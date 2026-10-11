import { z } from "zod"

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  action: z.string().optional(),
  hostname: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
})

const PRODUCTION_TURNSTILE_HOSTNAMES = new Set(["silverpineapple.net", "www.silverpineapple.net"])
const LOOPBACK_TURNSTILE_HOSTNAMES = new Set(["localhost", "127.0.0.1"])

// Cloudflare's published dummy secrets. They never match a real widget secret.
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const DUMMY_TURNSTILE_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
])

// Dummy siteverify responses have been observed with hostname "example.com"
// as well as the page host. Allow both only while a dummy secret is configured,
// so `next start` can prove the form locally without opening production.
const DUMMY_TURNSTILE_HOSTNAMES = new Set(["localhost", "127.0.0.1", "example.com"])

export const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export type TurnstileEnv = {
  nodeEnv?: string
  cloudflarePagesUrl?: string
  turnstileSecret?: string
}

function parseHostname(value: string): string | null {
  try {
    const url = value.startsWith("http://") || value.startsWith("https://") ? new URL(value) : new URL(`https://${value}`)
    return url.hostname.toLowerCase()
  } catch {
    return null
  }
}

export function getAllowedTurnstileHostnames(env: TurnstileEnv = {}): Set<string> {
  const nodeEnv = env.nodeEnv ?? process.env.NODE_ENV
  const cloudflarePagesUrl = env.cloudflarePagesUrl ?? process.env.CF_PAGES_URL
  const turnstileSecret = env.turnstileSecret ?? process.env.TURNSTILE_SECRET_KEY
  const hostnames = new Set(PRODUCTION_TURNSTILE_HOSTNAMES)

  if (cloudflarePagesUrl) {
    const parsedHostname = parseHostname(cloudflarePagesUrl)
    const isProductionLoopback = nodeEnv === "production" && parsedHostname && LOOPBACK_TURNSTILE_HOSTNAMES.has(parsedHostname)
    if (parsedHostname && !isProductionLoopback) {
      hostnames.add(parsedHostname)
    }
  }

  if (nodeEnv !== "production") {
    LOOPBACK_TURNSTILE_HOSTNAMES.forEach((hostname) => hostnames.add(hostname))
  }

  if (turnstileSecret && DUMMY_TURNSTILE_SECRETS.has(turnstileSecret)) {
    DUMMY_TURNSTILE_HOSTNAMES.forEach((hostname) => hostnames.add(hostname))
  }

  return hostnames
}

export function turnstileAllows(params: {
  success: boolean
  action: string | undefined
  hostname: string | undefined
  expectedAction: string
  secret: string
  env?: TurnstileEnv
}): boolean {
  const allowedHostnames = getAllowedTurnstileHostnames({
    ...params.env,
    turnstileSecret: params.secret,
  })
  const returnedHostname = (params.hostname || "").toLowerCase()
  const hasValidHostname = returnedHostname.length > 0 && allowedHostnames.has(returnedHostname)
  // Dummy siteverify responses omit `action` even when the widget set one.
  // A present action must still match, so a newsletter token cannot be reused here.
  const isDummySecret = DUMMY_TURNSTILE_SECRETS.has(params.secret)
  const hasValidAction = params.action === params.expectedAction || (isDummySecret && !params.action)
  return params.success === true && hasValidAction && hasValidHostname
}

export async function verifyTurnstileToken(params: {
  token: string
  action: string
  ipAddress?: string
  secret: string
}): Promise<{ ok: true } | { ok: false }> {
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
      return { ok: false }
    }

    responseBody = await response.json()
  } catch (error) {
    console.error("Turnstile verification request failed", {
      reason: error instanceof Error ? error.message : "unknown_error",
    })
    return { ok: false }
  } finally {
    clearTimeout(timeoutHandle)
  }

  const parsedJson = turnstileResponseSchema.safeParse(responseBody)
  if (!parsedJson.success) {
    console.error("Turnstile verification returned malformed payload")
    return { ok: false }
  }

  const verified = parsedJson.data
  const hasSuccess = verified.success === true
  const accepted = turnstileAllows({
    success: hasSuccess,
    action: verified.action,
    hostname: verified.hostname,
    expectedAction: params.action,
    secret: params.secret,
  })

  if (!accepted) {
    const errorCodes = verified["error-codes"] || []
    console.error("Turnstile validation rejected request", {
      success: hasSuccess,
      action: verified.action || null,
      hostname: verified.hostname || null,
      errorCodes,
      invalidSecretBinding: errorCodes.includes("invalid-input-secret"),
    })
    return { ok: false }
  }

  return { ok: true }
}
