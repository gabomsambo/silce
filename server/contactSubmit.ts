import { z } from "zod"
import { BUSINESS_CONTACT } from "@/app/data/contact"
import {
  CONTACT_TURNSTILE_ACTION,
  buildContactMessage,
  contactSubmissionSchema,
  type ContactSubmission,
} from "@/lib/contactDelivery"
import { verifyTurnstileToken } from "@/lib/turnstileVerify"

const RESEND_API_BASE = "https://api.resend.com"
// Same verified silverpineapple.net sending domain the review form uses.
const CONTACT_FROM = "Silver Pineapple <contact@silverpineapple.net>"

const resendEmailSchema = z.object({
  id: z.string().min(1),
})

type ApiErrorCode =
  | "validation_error"
  | "captcha_failed"
  | "service_unavailable"
  | "submission_failed"
  | "unknown_error"

function maskEmailAddress(email: string): string {
  const [localPart = "", domainPart = ""] = email.split("@")
  if (!domainPart) return "***"
  return `${localPart.slice(0, 1)}***@${domainPart}`
}

function getRequestIp(headers: Headers): string | undefined {
  const cloudflareIp = headers.get("cf-connecting-ip")
  if (cloudflareIp) return cloudflareIp.trim()

  const forwardedFor = headers.get("x-forwarded-for")
  if (!forwardedFor) return undefined
  const [firstIp] = forwardedFor.split(",")
  return firstIp?.trim() || undefined
}

async function sendContactEmail(params: {
  resendKey: string
  submission: ContactSubmission
}): Promise<{ ok: true; id: string } | { ok: false }> {
  const message = buildContactMessage(params.submission)
  const controller = new AbortController()
  const timeoutHandle = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch(`${RESEND_API_BASE}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [BUSINESS_CONTACT.email],
        reply_to: params.submission.email,
        subject: message.subject,
        text: message.text,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error("Resend contact email was rejected", { status: response.status })
      return { ok: false }
    }

    const parsed = resendEmailSchema.safeParse(await response.json())
    if (!parsed.success) {
      console.error("Resend contact email returned a malformed payload")
      return { ok: false }
    }

    console.info("Contact email accepted", {
      id: parsed.data.id,
      guest: maskEmailAddress(params.submission.email),
    })
    return { ok: true, id: parsed.data.id }
  } catch (error) {
    console.error("Resend contact email request failed", {
      reason: error instanceof Error ? error.name : "unknown_error",
    })
    return { ok: false }
  } finally {
    clearTimeout(timeoutHandle)
  }
}

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_KEY
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

  if (!resendKey || !turnstileSecret) {
    console.error("Contact endpoint is missing required environment bindings", {
      hasResendKey: Boolean(resendKey),
      hasTurnstileSecret: Boolean(turnstileSecret),
    })
    return Response.json({ error: "service_unavailable" as ApiErrorCode }, { status: 500 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: "validation_error" as ApiErrorCode }, { status: 400 })
  }

  const parsedPayload = contactSubmissionSchema.safeParse(payload)
  // A filled honeypot is a bot: refuse it as a validation failure, never as
  // success, so a browser that autofilled the hidden field shows the honest
  // error (with the email fallback) instead of silently dropping a real message.
  if (!parsedPayload.success || parsedPayload.data.honey) {
    return Response.json({ error: "validation_error" as ApiErrorCode }, { status: 400 })
  }

  const submission = parsedPayload.data
  const turnstileResult = await verifyTurnstileToken({
    token: submission.turnstileToken,
    action: CONTACT_TURNSTILE_ACTION,
    ipAddress: getRequestIp(request.headers),
    secret: turnstileSecret,
  })

  if (!turnstileResult.ok) {
    return Response.json({ error: "captcha_failed" as ApiErrorCode }, { status: 403 })
  }

  try {
    const sent = await sendContactEmail({ resendKey, submission })
    if (!sent.ok) {
      return Response.json({ error: "submission_failed" as ApiErrorCode }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Unexpected contact submission failure", {
      guest: maskEmailAddress(submission.email),
      reason: error instanceof Error ? error.name : "unknown_error",
    })
    return Response.json({ error: "unknown_error" as ApiErrorCode }, { status: 500 })
  }
}
