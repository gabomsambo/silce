import { NextResponse } from "next/server"
import { z } from "zod"
import { BUSINESS_CONTACT } from "@/app/data/contact"
import { UNITS } from "@/app/data/units"
import enMessages from "@/messages/en.json"
import {
  REVIEW_TURNSTILE_ACTION,
  buildReviewMessage,
  createReviewSubmissionSchema,
  propertyTitleForSlug,
  type ReviewSubmission,
} from "@/lib/reviewDelivery"
import { verifyTurnstileToken } from "@/lib/turnstileVerify"

const reviewSubmissionSchema = createReviewSubmissionSchema(UNITS.map((unit) => unit.slug))
const unitTitles = enMessages.units as Record<string, { title?: string }>

const RESEND_API_BASE = "https://api.resend.com"
const REVIEW_FROM = "Silver Pineapple <reviews@silverpineapple.net>"

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
  const visiblePrefix = localPart.slice(0, 1)
  return `${visiblePrefix}***@${domainPart}`
}

function getRequestIp(headers: Headers): string | undefined {
  const cloudflareIp = headers.get("cf-connecting-ip")
  if (cloudflareIp) return cloudflareIp.trim()

  const forwardedFor = headers.get("x-forwarded-for")
  if (!forwardedFor) return undefined
  const [firstIp] = forwardedFor.split(",")
  return firstIp?.trim() || undefined
}

async function sendReviewEmail(params: {
  resendKey: string
  submission: ReviewSubmission
}): Promise<{ ok: true; id: string } | { ok: false }> {
  const message = buildReviewMessage(
    params.submission,
    propertyTitleForSlug(params.submission.propertySlug, unitTitles),
  )
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
        from: REVIEW_FROM,
        to: [BUSINESS_CONTACT.email],
        reply_to: params.submission.email,
        subject: message.subject,
        text: message.text,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error("Resend review email was rejected", { status: response.status })
      return { ok: false }
    }

    const parsed = resendEmailSchema.safeParse(await response.json())
    if (!parsed.success) {
      console.error("Resend review email returned a malformed payload")
      return { ok: false }
    }

    console.info("Review email accepted", {
      id: parsed.data.id,
      guest: maskEmailAddress(params.submission.email),
    })
    return { ok: true, id: parsed.data.id }
  } catch (error) {
    console.error("Resend review email request failed", {
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
    console.error("Review endpoint is missing required environment bindings", {
      hasResendKey: Boolean(resendKey),
      hasTurnstileSecret: Boolean(turnstileSecret),
    })
    return NextResponse.json({ error: "service_unavailable" as ApiErrorCode }, { status: 500 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "validation_error" as ApiErrorCode }, { status: 400 })
  }

  const parsedPayload = reviewSubmissionSchema.safeParse(payload)
  if (!parsedPayload.success) {
    return NextResponse.json({ error: "validation_error" as ApiErrorCode }, { status: 400 })
  }

  const submission = parsedPayload.data
  const turnstileResult = await verifyTurnstileToken({
    token: submission.turnstileToken,
    action: REVIEW_TURNSTILE_ACTION,
    ipAddress: getRequestIp(request.headers),
    secret: turnstileSecret,
  })

  if (!turnstileResult.ok) {
    return NextResponse.json({ error: "captcha_failed" as ApiErrorCode }, { status: 403 })
  }

  try {
    const sent = await sendReviewEmail({ resendKey, submission })
    if (!sent.ok) {
      return NextResponse.json({ error: "submission_failed" as ApiErrorCode }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Unexpected review submission failure", {
      guest: maskEmailAddress(submission.email),
      reason: error instanceof Error ? error.name : "unknown_error",
    })
    return NextResponse.json({ error: "unknown_error" as ApiErrorCode }, { status: 500 })
  }
}
