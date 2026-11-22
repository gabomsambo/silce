import assert from "node:assert/strict"
import { register } from "node:module"
import test from "node:test"

register(new URL("./ts-alias-loader.mjs", import.meta.url))

const { localeRedirect, negotiateLocale } = await import("../server/localeRedirect.ts")
const { bindProcessEnv } = await import("../server/pagesEnv.ts")

const go = (path, headers = {}) =>
  localeRedirect(new Request(`https://silverpineapple.net${path}`, { headers }))

test("negotiates by q-value, ignoring regions and unsupported languages", () => {
  assert.equal(negotiateLocale("es-ES,es;q=0.9,en;q=0.5"), "es")
  assert.equal(negotiateLocale("fr-FR,fr;q=0.9,en;q=0.5"), "en")
  assert.equal(negotiateLocale("en;q=0.4, es;q=0.8"), "es")
  assert.equal(negotiateLocale("es;q=0, en"), "en")
  assert.equal(negotiateLocale("de, fr"), undefined)
  assert.equal(negotiateLocale(null), undefined)
})

test("/ redirects to the negotiated locale, defaulting to en", () => {
  assert.equal(go("/", { "accept-language": "es" }).headers.get("location"), "/es")
  assert.equal(go("/", { "accept-language": "de" }).headers.get("location"), "/en")
  assert.equal(go("/").headers.get("location"), "/en")
  assert.equal(go("/").status, 307)
})

test("the NEXT_LOCALE cookie wins over Accept-Language", () => {
  const res = go("/rooms", { cookie: "a=b; NEXT_LOCALE=en", "accept-language": "es" })
  assert.equal(res.headers.get("location"), "/en/rooms")
  assert.equal(go("/", { cookie: "NEXT_LOCALE=xx", "accept-language": "es" }).headers.get("location"), "/es")
})

test("unprefixed paths keep their path and query", () => {
  const res = go("/rooms/unit-2528?checkin=2026-12-01&adults=2", { "accept-language": "es" })
  assert.equal(res.headers.get("location"), "/es/rooms/unit-2528?checkin=2026-12-01&adults=2")
  assert.match(res.headers.get("cache-control") ?? "", /no-store/)
  assert.match(res.headers.get("vary") ?? "", /Accept-Language/)
})

test("bindProcessEnv copies string bindings and pins NODE_ENV to production", () => {
  const before = { ...process.env }
  try {
    bindProcessEnv({ RESEND_KEY: "re_x", NOT_A_STRING: { a: 1 } })
    assert.equal(process.env.RESEND_KEY, "re_x")
    assert.equal(process.env.NOT_A_STRING, undefined)
    assert.equal(process.env.NODE_ENV, "production")
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in before)) delete process.env[key]
    Object.assign(process.env, before)
  }
})
