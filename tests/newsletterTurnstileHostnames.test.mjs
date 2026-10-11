import assert from "node:assert/strict"
import { register } from "node:module"
import test from "node:test"

register("./alias-hook.mjs", import.meta.url)

const { POST } = await import("../app/api/newsletter/subscribe/route.ts")

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
const RESEND_CONTACTS_URL = "https://api.resend.com/contacts"

function subscribeRequest() {
  return new Request("https://silverpineapple.net/api/newsletter/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: "Ada",
      email: "ada@example.com",
      turnstileToken: "token-from-widget",
    }),
  })
}

async function submitWithVerifiedHostname(hostname, nodeEnv) {
  const previous = {
    fetch: globalThis.fetch,
    nodeEnv: process.env.NODE_ENV,
    cfPagesUrl: process.env.CF_PAGES_URL,
    resendKey: process.env.RESEND_KEY,
    turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
    error: console.error,
  }

  process.env.NODE_ENV = nodeEnv
  delete process.env.CF_PAGES_URL
  process.env.RESEND_KEY = "re_test_key"
  process.env.TURNSTILE_SECRET_KEY = "turnstile_test_secret"

  const calls = []
  const rejectionLogs = []
  console.error = (...args) => {
    if (args[0] === "Turnstile validation rejected request") rejectionLogs.push(args[1])
  }
  globalThis.fetch = async (url, init) => {
    const target = String(url)
    calls.push({ url: target, body: init?.body })
    if (target === TURNSTILE_VERIFY_URL) {
      return Response.json({
        success: true,
        action: "newsletter",
        hostname,
      })
    }
    if (target === RESEND_CONTACTS_URL) {
      return Response.json({ id: "contact_test" })
    }
    throw new Error(`unexpected fetch ${target}`)
  }

  try {
    const response = await POST(subscribeRequest())
    const json = await response.json()
    const turnstileCall = calls.find((call) => call.url === TURNSTILE_VERIFY_URL)
    const resendCall = calls.find((call) => call.url === RESEND_CONTACTS_URL)
    return {
      status: response.status,
      json,
      verifiedWithTurnstile: Boolean(turnstileCall),
      resendCalled: Boolean(resendCall),
      rejection: rejectionLogs[0] ?? null,
    }
  } finally {
    globalThis.fetch = previous.fetch
    console.error = previous.error
    restoreEnv("NODE_ENV", previous.nodeEnv)
    restoreEnv("CF_PAGES_URL", previous.cfPagesUrl)
    restoreEnv("RESEND_KEY", previous.resendKey)
    restoreEnv("TURNSTILE_SECRET_KEY", previous.turnstileSecret)
  }
}

function restoreEnv(name, value) {
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}

const scenarios = [
  { nodeEnv: "production", hostname: "silverpineapple.net", expectedStatus: 200, expectResend: true },
  { nodeEnv: "production", hostname: "www.silverpineapple.net", expectedStatus: 403, expectResend: false },
  { nodeEnv: "production", hostname: "WWW.SilverPineapple.NET", expectedStatus: 403, expectResend: false },
  { nodeEnv: "production", hostname: "localhost", expectedStatus: 403, expectResend: false },
  { nodeEnv: "production", hostname: "127.0.0.1", expectedStatus: 403, expectResend: false },
  { nodeEnv: "production", hostname: "example.com", expectedStatus: 403, expectResend: false },
  { nodeEnv: "development", hostname: "silverpineapple.net", expectedStatus: 200, expectResend: true },
  { nodeEnv: "development", hostname: "localhost", expectedStatus: 200, expectResend: true },
  { nodeEnv: "development", hostname: "127.0.0.1", expectedStatus: 200, expectResend: true },
  { nodeEnv: "development", hostname: "www.silverpineapple.net", expectedStatus: 403, expectResend: false },
]

test("newsletter subscribe rejects www after a successful Turnstile pass and still accepts the apex", async () => {
  const results = []
  for (const scenario of scenarios) {
    const result = await submitWithVerifiedHostname(scenario.hostname, scenario.nodeEnv)
    results.push({
      ...scenario,
      actualStatus: result.status,
      json: result.json,
      verifiedWithTurnstile: result.verifiedWithTurnstile,
      resendCalled: result.resendCalled,
      rejection: result.rejection,
    })
  }

  const lines = results.map((result) => {
    const decision = result.actualStatus === 200 ? "accepted" : "rejected"
    const turnstile = result.rejection
      ? ` turnstile=${JSON.stringify(result.rejection)}`
      : ""
    return `${decision} | ${result.nodeEnv} | ${result.hostname} | ${result.actualStatus} | ${JSON.stringify(result.json)} | resend=${result.resendCalled}${turnstile}`
  })
  for (const line of lines) console.log(line)

  const evidencePath = process.env.NEWSLETTER_HOSTNAME_EVIDENCE
  if (evidencePath) {
    const { writeFile } = await import("node:fs/promises")
    await writeFile(evidencePath, `${lines.join("\n")}\n`)
  }

  for (const result of results) {
    const label = `${result.nodeEnv} hostname=${result.hostname}`
    assert.equal(result.verifiedWithTurnstile, true, `${label} did not reach Turnstile verification`)
    assert.equal(result.actualStatus, result.expectedStatus, label)
    assert.equal(result.resendCalled, result.expectResend, `${label} resend`)
    if (result.expectedStatus === 200) {
      assert.deepEqual(result.json, { ok: true, outcome: "subscribed" }, label)
      assert.equal(result.rejection, null, label)
    } else {
      assert.deepEqual(result.json, { error: "captcha_failed" }, label)
      assert.equal(result.rejection.success, true, `${label} was not a successful Turnstile pass`)
      assert.equal(result.rejection.action, "newsletter", label)
      assert.equal(result.rejection.hostname, result.hostname, label)
    }
  }
})
