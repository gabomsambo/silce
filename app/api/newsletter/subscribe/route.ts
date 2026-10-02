import { NextResponse } from "next/server"
import { z } from "zod"

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  action: z.string().optional(),
  hostname: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
})

const newsletterSubmissionSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  turnstileToken: z.string().trim().min(1).max(2048),
})

const resendContactSchema = z.object({
  unsubscribed: z.boolean(),
})

const PRODUCTION_TURNSTILE_HOSTNAMES = new Set(["silverpineapple.net", "www.silverpineapple.net"])
const LOOPBACK_TURNSTILE_HOSTNAMES = new Set(["localhost", "127.0.0.1"])

const RESEND_API_BASE = "https://api.resend.com"
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

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

function parseHostname(value: string): string | null {
  try {
    const url = value.startsWith("http://") || value.startsWith("https://") ? new URL(value) : new URL(`https://${value}`)
    return url.hostname.toLowerCase()
  } catch {
    return null
  }
}

function getAllowedTurnstileHostnames(): Set<string> {
  const hostnames = new Set(PRODUCTION_TURNSTILE_HOSTNAMES)

  const cloudflarePagesUrl = process.env.CF_PAGES_URL
  if (cloudflarePagesUrl) {
    const parsedHostname = parseHostname(cloudflarePagesUrl)
    const isProductionLoopback = process.env.NODE_ENV === "production" && parsedHostname && LOOPBACK_TURNSTILE_HOSTNAMES.has(parsedHostname)
    if (parsedHostname && !isProductionLoopback) {
      hostnames.add(parsedHostname)
    }
  }

  if (process.env.NODE_ENV !== "production") {
    LOOPBACK_TURNSTILE_HOSTNAMES.forEach((hostname) => hostnames.add(hostname))
  }

  return hostnames
}

async function verifyTurnstileToken(params: {
  token: string
  ipAddress?: string
  secret: string
}): Promise<{ ok: true } | { ok: false; errorCode: ApiErrorCode }> {
  const body = new URLSearchParams({
    secret: params.secret,
    response: params.token,
  })

  if (params.ipAddress) {
    body.set("remoteip", params.ipAddress)
  }

  const controller = new AbortController()
  const timeoutHandle = setTimeout(() => controller.abort(), 10_000)

  let response: Response
  let responseBody: unknown
  try {
    response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error("Turnstile verification returned non-OK status", { status: response.status })
      return { ok: false, errorCode: "captcha_failed" }
    }

    responseBody = await response.json()
  } catch (error) {
    console.error("Turnstile verification request failed", {
      reason: error instanceof Error ? error.message : "unknown_error",
    })
    return { ok: false, errorCode: "captcha_failed" }
  } finally {
    clearTimeout(timeoutHandle)
  }

  const parsedJson = turnstileResponseSchema.safeParse(responseBody)
  if (!parsedJson.success) {
    console.error("Turnstile verification returned malformed payload")
    return { ok: false, errorCode: "captcha_failed" }
  }

  const verified = parsedJson.data
  const allowedHostnames = getAllowedTurnstileHostnames()
  const returnedHostname = (verified.hostname || "").toLowerCase()
  const hasValidHostname = returnedHostname.length > 0 && allowedHostnames.has(returnedHostname)
  const hasValidAction = verified.action === "newsletter"
  const hasSuccess = verified.success === true

  if (!hasSuccess || !hasValidAction || !hasValidHostname) {
    const errorCodes = verified["error-codes"] || []
    const hasInvalidSecret = errorCodes.includes("invalid-input-secret")
    console.error("Turnstile validation rejected request", {
      success: hasSuccess,
      action: verified.action || null,
      hostname: verified.hostname || null,
      errorCodes,
      invalidSecretBinding: hasInvalidSecret,
    })
    return { ok: false, errorCode: "captcha_failed" }
  }

  return { ok: true }
}

async function createResendContact(params: {
  resendKey: string
  firstName: string
  email: string
}): Promise<{ outcome: "subscribed" | "already_subscribed" } | { outcome: "failed"; errorCode: ApiErrorCode }> {
  const response = await fetch(`${RESEND_API_BASE}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      first_name: params.firstName,
    }),
  })

  if (response.ok) {
    return { outcome: "subscribed" }
  }

  let errorPayload: unknown
  try {
    errorPayload = await response.json()
  } catch {
    errorPayload = null
  }

  const maybeMessage =
    typeof errorPayload === "object" && errorPayload !== null && "message" in errorPayload
      ? String(errorPayload.message)
      : ""
  const maybeName =
    typeof errorPayload === "object" && errorPayload !== null && "name" in errorPayload
      ? String(errorPayload.name)
      : ""
  const normalizedDetail = `${maybeName} ${maybeMessage}`.toLowerCase()

  const isAlreadySubscribed =
    response.status === 409 ||
    normalizedDetail.includes("already exists") ||
    normalizedDetail.includes("already subscribed")

  if (isAlreadySubscribed) {
    const contactUrl = `${RESEND_API_BASE}/contacts/${encodeURIComponent(params.email)}`
    const authorizationHeaders = {
      Authorization: `Bearer ${params.resendKey}`,
    }
    const existingContactResponse = await fetch(contactUrl, {
      headers: authorizationHeaders,
    })

    if (!existingContactResponse.ok) {
      console.error("Resend contact lookup failed", {
        status: existingContactResponse.status,
        email: maskEmailAddress(params.email),
      })
      return { outcome: "failed", errorCode: "submission_failed" }
    }

    const existingContact = resendContactSchema.safeParse(await existingContactResponse.json())
    if (!existingContact.success) {
      console.error("Resend contact lookup returned malformed payload", {
        email: maskEmailAddress(params.email),
      })
      return { outcome: "failed", errorCode: "submission_failed" }
    }

    const updateResponse = await fetch(contactUrl, {
      method: "PATCH",
      headers: {
        ...authorizationHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: params.firstName,
        ...(existingContact.data.unsubscribed ? { unsubscribed: false } : {}),
      }),
    })

    if (!updateResponse.ok) {
      console.error("Resend contact update failed", {
        status: updateResponse.status,
        email: maskEmailAddress(params.email),
      })
      return { outcome: "failed", errorCode: "submission_failed" }
    }

    const outcome = existingContact.data.unsubscribed ? "subscribed" : "already_subscribed"
    console.info(outcome === "subscribed" ? "Newsletter address resubscribed" : "Newsletter address already subscribed", {
      email: maskEmailAddress(params.email),
    })
    return { outcome }
  }

  console.error("Resend contact creation failed", {
    status: response.status,
    email: maskEmailAddress(params.email),
  })
  return { outcome: "failed", errorCode: "submission_failed" }
}

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_KEY
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

  if (!resendKey || !turnstileSecret) {
    console.error("Newsletter endpoint is missing required environment bindings", {
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

  const parsedPayload = newsletterSubmissionSchema.safeParse(payload)
  if (!parsedPayload.success) {
    return NextResponse.json({ error: "validation_error" as ApiErrorCode }, { status: 400 })
  }

  const { firstName, email, turnstileToken } = parsedPayload.data
  const turnstileResult = await verifyTurnstileToken({
    token: turnstileToken,
    ipAddress: getRequestIp(request.headers),
    secret: turnstileSecret,
  })

  if (!turnstileResult.ok) {
    return NextResponse.json({ error: turnstileResult.errorCode }, { status: 403 })
  }

  try {
    const resendResult = await createResendContact({
      resendKey,
      firstName,
      email,
    })

    if (resendResult.outcome === "failed") {
      return NextResponse.json({ error: resendResult.errorCode }, { status: 502 })
    }

    return NextResponse.json({
      ok: true,
      outcome: resendResult.outcome,
    })
  } catch (error) {
    console.error("Unexpected newsletter submission failure", {
      email: maskEmailAddress(email),
      reason: error instanceof Error ? error.name : "unknown_error",
    })
    return NextResponse.json({ error: "unknown_error" as ApiErrorCode }, { status: 500 })
  }
}
