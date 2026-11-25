import assert from "node:assert/strict"
import { register } from "node:module"
import test from "node:test"

register(new URL("./ts-alias-loader.mjs", import.meta.url))

const { POST } = await import("../server/contactSubmit.ts")

const FAKE_RESEND_KEY = "re_test_local_only"
const FAKE_TURNSTILE_SECRET = "turnstile-test-local-only"
const GUEST_EMAIL = "review-form-test@example.com"
const MASKED_EMAIL = "r***@example.com"

const validSubmission = {
  name: "TEST Guest",
  email: GUEST_EMAIL,
  message: "TEST - please ignore. Is the unit pet friendly?",
  honey: "",
  pageUrl: "https://silverpineapple.net/en/rooms/unit-2528",
  locale: "en",
  turnstileToken: "widget-token",
}

function jsonResponse(status, body) {
  return Response.json(body, { status })
}

function turnstileOk() {
  return {
    success: true,
    action: "contact",
    hostname: "localhost",
    "error-codes": [],
  }
}

function installFetch(routes) {
  const calls = []
  const previous = globalThis.fetch
  globalThis.fetch = async (url, init = {}) => {
    const call = {
      url: String(url),
      method: (init.method || "GET").toUpperCase(),
      body: init.body == null ? null : String(init.body),
      headers: init.headers,
    }
    calls.push(call)
    const route = routes.find((candidate) => candidate.method === call.method && candidate.match(call.url))
    if (!route) {
      throw new Error(`blocked outbound ${call.method} ${call.url}`)
    }
    return route.respond(call)
  }
  return {
    calls,
    restore() {
      globalThis.fetch = previous
    },
  }
}

function captureConsole() {
  const entries = []
  const previous = {
    info: console.info,
    error: console.error,
    log: console.log,
    warn: console.warn,
  }
  for (const level of Object.keys(previous)) {
    console[level] = (...args) => {
      entries.push({ level, args })
    }
  }
  return {
    entries,
    text() {
      return JSON.stringify(entries)
    },
    restore() {
      Object.assign(console, previous)
    },
  }
}

function resendCall(calls) {
  return calls.find((call) => call.url === "https://api.resend.com/emails")
}

function turnstileCall(calls) {
  return calls.find((call) => call.url === "https://challenges.cloudflare.com/turnstile/v0/siteverify")
}

async function submit(payload, { routes, headers = {} }) {
  const previous = {
    RESEND_KEY: process.env.RESEND_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
  }
  const network = installFetch(routes)
  const logs = captureConsole()
  process.env.RESEND_KEY = FAKE_RESEND_KEY
  process.env.TURNSTILE_SECRET_KEY = FAKE_TURNSTILE_SECRET
  process.env.NODE_ENV = "test"

  try {
    const response = await POST(
      new Request("http://localhost/api/contact/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.10",
          ...headers,
        },
        body: JSON.stringify(payload),
      }),
    )
    return {
      status: response.status,
      body: await response.json(),
      calls: network.calls,
      logs: logs.text(),
    }
  } finally {
    network.restore()
    logs.restore()
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

function acceptedRoutes(resendBody = { id: "email_test_123" }, turnstileBody = turnstileOk()) {
  return [
    {
      method: "POST",
      match: (url) => url === "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      respond: () => jsonResponse(200, turnstileBody),
    },
    {
      method: "POST",
      match: (url) => url === "https://api.resend.com/emails",
      respond: () => jsonResponse(200, resendBody),
    },
  ]
}

test("an accepted contact message is emailed to the inbox and logs only a shortened address", async () => {
  const result = await submit(validSubmission, { routes: acceptedRoutes() })

  assert.equal(result.status, 200)
  assert.deepEqual(result.body, { ok: true })

  const sent = resendCall(result.calls)
  assert.ok(sent, "Resend was called")
  const email = JSON.parse(sent.body)
  assert.equal(email.from, "Silver Pineapple <contact@silverpineapple.net>")
  assert.deepEqual(email.to, ["gabriel@silverpineapple.net"])
  assert.equal(email.reply_to, GUEST_EMAIL)
  assert.match(email.subject, /^New Silver Pineapple website inquiry/)
  assert.match(email.text, /Is the unit pet friendly\?/)
  assert.match(email.text, new RegExp(GUEST_EMAIL))
  assert.match(email.text, /Sent from: https:\/\/silverpineapple\.net\/en\/rooms\/unit-2528/)

  const verify = turnstileCall(result.calls)
  const verifyBody = new URLSearchParams(verify.body)
  assert.equal(verifyBody.get("remoteip"), "203.0.113.10")
  assert.equal(verifyBody.get("response"), "widget-token")

  assert.match(result.logs, /Contact email accepted/)
  assert.match(result.logs, /r\*\*\*@example\.com/)
  assert.equal(result.logs.includes(GUEST_EMAIL), false)
})

test("a line break in the name cannot inject a header into the subject", async () => {
  const result = await submit(
    { ...validSubmission, name: "Eve\r\nBcc: attacker@example.com" },
    { routes: acceptedRoutes() },
  )

  assert.equal(result.status, 200)
  const email = JSON.parse(resendCall(result.calls).body)
  assert.equal(/[\r\n]/.test(email.subject), false)
})

test("a Resend rejection is reported as a failure, never success, and does not log the guest email", async () => {
  const result = await submit(validSubmission, {
    routes: [
      {
        method: "POST",
        match: (url) => url.includes("siteverify"),
        respond: () => jsonResponse(200, turnstileOk()),
      },
      {
        method: "POST",
        match: (url) => url.endsWith("/emails"),
        respond: () => jsonResponse(422, { message: "rejected" }),
      },
    ],
  })

  assert.equal(result.status, 502)
  assert.deepEqual(result.body, { error: "submission_failed" })
  assert.match(result.logs, /Resend contact email was rejected/)
  assert.equal(result.logs.includes(GUEST_EMAIL), false)
  assert.equal(result.logs.includes(MASKED_EMAIL), false)
})

test("a malformed Resend payload is a failure", async () => {
  const result = await submit(validSubmission, { routes: acceptedRoutes({ unexpected: true }) })

  assert.equal(result.status, 502)
  assert.deepEqual(result.body, { error: "submission_failed" })
  assert.match(result.logs, /malformed payload/)
  assert.equal(result.logs.includes(GUEST_EMAIL), false)
})

test("an unreachable Resend is a failure and logs neither the guest email nor the network error", async () => {
  const result = await submit(validSubmission, {
    routes: [
      {
        method: "POST",
        match: (url) => url.includes("siteverify"),
        respond: () => jsonResponse(200, turnstileOk()),
      },
      {
        method: "POST",
        match: (url) => url.endsWith("/emails"),
        respond: () => {
          throw new Error("network down")
        },
      },
    ],
  })

  assert.equal(result.status, 502)
  assert.deepEqual(result.body, { error: "submission_failed" })
  assert.match(result.logs, /Resend contact email request failed/)
  assert.equal(result.logs.includes(GUEST_EMAIL), false)
  assert.equal(result.logs.includes(MASKED_EMAIL), false)
  assert.equal(result.logs.includes("network down"), false)
})

test("a failed spam check rejects the message before Resend is called", async () => {
  const result = await submit(validSubmission, {
    routes: [
      {
        method: "POST",
        match: (url) => url.includes("siteverify"),
        respond: () => jsonResponse(200, { success: false, "error-codes": ["invalid-input-response"] }),
      },
    ],
  })

  assert.equal(result.status, 403)
  assert.deepEqual(result.body, { error: "captcha_failed" })
  assert.equal(resendCall(result.calls), undefined)
  assert.equal(result.logs.includes(GUEST_EMAIL), false)
})

test("a review-action Turnstile token cannot be replayed on the contact form", async () => {
  const result = await submit(validSubmission, {
    routes: acceptedRoutes(undefined, { ...turnstileOk(), action: "review" }),
  })

  assert.equal(result.status, 403)
  assert.deepEqual(result.body, { error: "captcha_failed" })
  assert.equal(resendCall(result.calls), undefined)
})

test("a filled honeypot is refused as an error, with no spam check or email", async () => {
  const result = await submit({ ...validSubmission, honey: "http://spam.example" }, { routes: [] })

  assert.equal(result.status, 400)
  assert.deepEqual(result.body, { error: "validation_error" })
  assert.equal(result.calls.length, 0)
})

test("an invalid message is refused without calling any service or logging the guest email", async () => {
  for (const bad of [{ message: "" }, { email: "not-an-email" }, { name: "" }, { locale: "fr" }, { turnstileToken: "" }]) {
    const result = await submit({ ...validSubmission, ...bad }, { routes: [] })
    assert.equal(result.status, 400, JSON.stringify(bad))
    assert.deepEqual(result.body, { error: "validation_error" })
    assert.equal(result.calls.length, 0)
    assert.equal(result.logs.includes(GUEST_EMAIL), false)
  }
})

test("missing server secrets are reported as service_unavailable", async () => {
  const previous = { RESEND_KEY: process.env.RESEND_KEY, TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY }
  delete process.env.RESEND_KEY
  delete process.env.TURNSTILE_SECRET_KEY
  const quiet = console.error
  console.error = () => {}
  try {
    const response = await POST(new Request("http://localhost/api/contact/submit", { method: "POST", body: "{}" }))
    assert.equal(response.status, 500)
    assert.deepEqual(await response.json(), { error: "service_unavailable" })
  } finally {
    console.error = quiet
    for (const [key, value] of Object.entries(previous)) {
      if (value !== undefined) process.env[key] = value
    }
  }
})
