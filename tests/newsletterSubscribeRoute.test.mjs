import assert from "node:assert/strict"
import { mkdirSync, writeFileSync } from "node:fs"
import { register } from "node:module"
import { after, test } from "node:test"

register(new URL("./ts-alias-loader.mjs", import.meta.url))

const { POST } = await import("../app/api/newsletter/subscribe/route.ts")

const FAKE_RESEND_KEY = "re_test_local_only"
const FAKE_TURNSTILE_SECRET = "turnstile-test-local-only"
const evidence = []

function turnstileOk(hostname = "localhost") {
  return {
    success: true,
    action: "newsletter",
    hostname,
    "error-codes": [],
  }
}

function jsonResponse(status, body) {
  return Response.json(body, { status })
}

/**
 * Replace global fetch for one signup. Unexpected URLs throw instead of
 * reaching the network, so the live Resend account cannot be touched.
 */
function installFetch(routes) {
  const calls = []
  const previous = globalThis.fetch
  globalThis.fetch = async (url, init = {}) => {
    const call = {
      url: String(url),
      method: (init.method || "GET").toUpperCase(),
      body: init.body == null ? null : String(init.body),
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

function summarizeCalls(calls) {
  return calls.map((call) => {
    if (call.url.includes("/turnstile/v0/siteverify")) {
      const params = new URLSearchParams(call.body || "")
      return {
        method: call.method,
        url: call.url,
        body: { response: params.get("response") },
      }
    }
    return {
      method: call.method,
      url: call.url,
      body: call.body ? JSON.parse(call.body) : null,
    }
  })
}

function resendWrites(calls) {
  return summarizeCalls(calls).filter((call) => call.url.startsWith("https://api.resend.com/"))
}

async function submit(payload, { nodeEnv = "test", hostname = "localhost", routes }) {
  const previous = {
    RESEND_KEY: process.env.RESEND_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
    CF_PAGES_URL: process.env.CF_PAGES_URL,
  }
  const network = installFetch(routes)
  process.env.RESEND_KEY = FAKE_RESEND_KEY
  process.env.TURNSTILE_SECRET_KEY = FAKE_TURNSTILE_SECRET
  process.env.NODE_ENV = nodeEnv
  delete process.env.CF_PAGES_URL

  try {
    const response = await POST(
      new Request("https://silverpineapple.net/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          host: hostname,
        },
        body: JSON.stringify(payload),
      }),
    )
    const body = await response.json()
    return { status: response.status, body, calls: network.calls }
  } finally {
    network.restore()
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

function acceptedResendRoutes(turnstileBody = turnstileOk()) {
  return [
    {
      method: "POST",
      match: (url) => url === "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      respond: () => jsonResponse(200, turnstileBody),
    },
    {
      method: "POST",
      match: (url) => url === "https://api.resend.com/contacts",
      respond: () => jsonResponse(201, { id: "contact_test", object: "contact" }),
    },
  ]
}

function record(scenario) {
  evidence.push(scenario)
}

test("a Spanish signup stores locale and the ticked interests, and success follows Resend acceptance", async () => {
  const request = {
    firstName: "Ada",
    email: "ada.signup@example.com",
    interests: ["special-offers", "not-a-real-interest", "new-studios", "new-studios"],
    locale: "es",
    turnstileToken: "widget-token-es",
  }
  const result = await submit(request, { routes: acceptedResendRoutes() })

  assert.deepEqual(result.body, { ok: true, outcome: "subscribed" })
  assert.equal(result.status, 200)
  const writes = resendWrites(result.calls)
  assert.equal(writes.length, 1)
  assert.equal(writes[0].method, "POST")
  assert.deepEqual(writes[0].body, {
    email: "ada.signup@example.com",
    first_name: "Ada",
    properties: {
      locale: "es",
      newsletter_interests: "special-offers,new-studios",
    },
  })
  assert.equal(writes.some((call) => call.method === "DELETE"), false)

  record({
    scenario: "Spanish homepage signup with two real interests and one unknown id",
    browserRequest: request,
    browserResponse: { status: result.status, body: result.body },
    resendCalls: writes,
  })
})

test("an English signup stores locale en and the ticked interests", async () => {
  const request = {
    firstName: "Grace",
    email: "grace.signup@example.com",
    interests: ["local-tips", "seasonal"],
    locale: "en",
    turnstileToken: "widget-token-en",
  }
  const result = await submit(request, { routes: acceptedResendRoutes() })

  assert.deepEqual(result.body, { ok: true, outcome: "subscribed" })
  const writes = resendWrites(result.calls)
  assert.deepEqual(writes[0].body.properties, {
    locale: "en",
    newsletter_interests: "local-tips,seasonal",
  })

  record({
    scenario: "English homepage signup",
    browserRequest: request,
    browserResponse: { status: result.status, body: result.body },
    resendCalls: writes,
  })
})

test("a signup that omits locale and interests does not write those Resend properties", async () => {
  const request = {
    firstName: "Lin",
    email: "lin.oldbundle@example.com",
    turnstileToken: "widget-token-old",
  }
  const result = await submit(request, { routes: acceptedResendRoutes() })

  assert.deepEqual(result.body, { ok: true, outcome: "subscribed" })
  const writes = resendWrites(result.calls)
  assert.deepEqual(writes[0].body.properties, {})
  assert.equal("locale" in writes[0].body.properties, false)
  assert.equal("newsletter_interests" in writes[0].body.properties, false)

  record({
    scenario: "Older signup bundle omits locale and interests",
    browserRequest: request,
    browserResponse: { status: result.status, body: result.body },
    resendCalls: writes,
  })
})

test("resubmitting an existing contact without segmentation fields does not send locale or interests", async () => {
  const request = {
    firstName: "Lin",
    email: "lin.existing@example.com",
    turnstileToken: "widget-token-existing",
  }
  const result = await submit(request, {
    routes: [
      {
        method: "POST",
        match: (url) => url.includes("/turnstile/"),
        respond: () => jsonResponse(200, turnstileOk()),
      },
      {
        method: "POST",
        match: (url) => url === "https://api.resend.com/contacts",
        respond: () => jsonResponse(409, { name: "validation_error", message: "Contact already exists" }),
      },
      {
        method: "GET",
        match: (url) => url.startsWith("https://api.resend.com/contacts/"),
        respond: () => jsonResponse(200, { unsubscribed: false, email: request.email }),
      },
      {
        method: "PATCH",
        match: (url) => url.startsWith("https://api.resend.com/contacts/"),
        respond: () => jsonResponse(200, { id: "contact_existing" }),
      },
    ],
  })

  assert.equal(result.status, 200)
  assert.deepEqual(result.body, { ok: true, outcome: "already_subscribed" })
  const writes = resendWrites(result.calls)
  const patch = writes.find((call) => call.method === "PATCH")
  assert.ok(patch)
  assert.deepEqual(patch.body, {
    first_name: "Lin",
    properties: {},
  })
  assert.equal(writes.some((call) => call.method === "DELETE"), false)

  record({
    scenario: "Existing contact resubmits without locale or interests",
    browserRequest: request,
    browserResponse: { status: result.status, body: result.body },
    resendCalls: writes,
  })
})

test("a present segmentation update is written on the existing-contact path", async () => {
  const request = {
    firstName: "Ada",
    email: "ada.existing@example.com",
    locale: "es",
    interests: ["seasonal"],
    turnstileToken: "widget-token-update",
  }
  const result = await submit(request, {
    routes: [
      {
        method: "POST",
        match: (url) => url.includes("/turnstile/"),
        respond: () => jsonResponse(200, turnstileOk()),
      },
      {
        method: "POST",
        match: (url) => url === "https://api.resend.com/contacts",
        respond: () => jsonResponse(409, { message: "Contact already exists" }),
      },
      {
        method: "GET",
        match: (url) => url.startsWith("https://api.resend.com/contacts/"),
        respond: () => jsonResponse(200, { unsubscribed: false }),
      },
      {
        method: "PATCH",
        match: (url) => url.startsWith("https://api.resend.com/contacts/"),
        respond: () => jsonResponse(200, { id: "contact_existing" }),
      },
    ],
  })

  assert.deepEqual(result.body, { ok: true, outcome: "already_subscribed" })
  const patch = resendWrites(result.calls).find((call) => call.method === "PATCH")
  assert.deepEqual(patch.body.properties, {
    locale: "es",
    newsletter_interests: "seasonal",
  })

  record({
    scenario: "Existing contact resubmits with locale and interests",
    browserRequest: request,
    browserResponse: { status: result.status, body: result.body },
    resendCalls: resendWrites(result.calls),
  })
})

test("the browser does not receive success when Resend rejects the contact", async () => {
  const request = {
    firstName: "Ada",
    email: "ada.rejected@example.com",
    locale: "en",
    interests: ["new-studios"],
    turnstileToken: "widget-token-rejected",
  }
  const result = await submit(request, {
    routes: [
      {
        method: "POST",
        match: (url) => url.includes("/turnstile/"),
        respond: () => jsonResponse(200, turnstileOk()),
      },
      {
        method: "POST",
        match: (url) => url === "https://api.resend.com/contacts",
        respond: () => jsonResponse(422, { message: "Property does not exist", name: "validation_error" }),
      },
    ],
  })

  assert.equal(result.status, 502)
  assert.deepEqual(result.body, { error: "submission_failed" })
  assert.notEqual(result.body.ok, true)

  record({
    scenario: "Resend rejects the contact create",
    browserRequest: request,
    browserResponse: { status: result.status, body: result.body },
    resendCalls: resendWrites(result.calls),
  })
})

test("an invalid locale is refused before any contact write", async () => {
  const result = await submit(
    {
      firstName: "Ada",
      email: "ada.invalid@example.com",
      locale: "fr",
      interests: ["seasonal"],
      turnstileToken: "widget-token-invalid",
    },
    { routes: acceptedResendRoutes() },
  )

  assert.equal(result.status, 400)
  assert.deepEqual(result.body, { error: "validation_error" })
  assert.deepEqual(result.calls, [])

  record({
    scenario: "locale fr is rejected at the request boundary",
    browserResponse: { status: result.status, body: result.body },
    resendCalls: [],
  })
})

test("a Turnstile testing-key pass without a production hostname and action is rejected", async () => {
  const testingKeyVerdict = {
    success: true,
    hostname: "example.com",
    "error-codes": [],
    metadata: { result_with_testing_key: true },
  }
  for (const nodeEnv of ["production", "development"]) {
    const result = await submit(
      {
        firstName: "Ada",
        email: "ada.testingkey@example.com",
        locale: "en",
        interests: ["seasonal"],
        turnstileToken: "dummy-token",
      },
      {
        nodeEnv,
        routes: [
          {
            method: "POST",
            match: (url) => url.includes("/turnstile/"),
            respond: () => jsonResponse(200, testingKeyVerdict),
          },
        ],
      },
    )
    assert.equal(result.status, 403, nodeEnv)
    assert.deepEqual(result.body, { error: "captcha_failed" })
    assert.equal(resendWrites(result.calls).length, 0)

    record({
      scenario: `Turnstile testing-key verdict rejected when NODE_ENV=${nodeEnv}`,
      browserResponse: { status: result.status, body: result.body },
      resendCalls: [],
    })
  }
})

test("a real production hostname and newsletter action still reaches Resend", async () => {
  const request = {
    firstName: "Ada",
    email: "ada.prod@example.com",
    locale: "en",
    interests: ["special-offers"],
    turnstileToken: "widget-token-prod",
  }
  const result = await submit(request, {
    nodeEnv: "production",
    routes: acceptedResendRoutes(turnstileOk("silverpineapple.net")),
  })

  assert.deepEqual(result.body, { ok: true, outcome: "subscribed" })
  assert.deepEqual(resendWrites(result.calls)[0].body.properties, {
    locale: "en",
    newsletter_interests: "special-offers",
  })

  record({
    scenario: "Production hostname and newsletter action",
    browserRequest: request,
    browserResponse: { status: result.status, body: result.body },
    resendCalls: resendWrites(result.calls),
  })
})

after(() => {
  const directory = process.env.EVIDENCE_DIR
  if (!directory) return
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    `${directory}/newsletter-subscribe-outcomes.json`,
    `${JSON.stringify({ liveResendContacted: false, scenarios: evidence }, null, 2)}\n`,
  )
})
