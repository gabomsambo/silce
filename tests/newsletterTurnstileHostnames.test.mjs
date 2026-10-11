import assert from "node:assert/strict"
import test from "node:test"
import {
  LOOPBACK_TURNSTILE_HOSTNAMES,
  PRODUCTION_TURNSTILE_HOSTNAMES,
  REGISTERED_TURNSTILE_WIDGET_HOSTNAMES,
} from "../lib/newsletterTurnstileHostnames.ts"

test("newsletter Turnstile allowlist matches the widget's registered hostnames", () => {
  const fromAllowlist = new Set([
    ...PRODUCTION_TURNSTILE_HOSTNAMES,
    ...LOOPBACK_TURNSTILE_HOSTNAMES,
  ])
  const fromWidget = new Set(REGISTERED_TURNSTILE_WIDGET_HOSTNAMES)

  assert.deepEqual(fromAllowlist, fromWidget)
  assert.equal(PRODUCTION_TURNSTILE_HOSTNAMES.has("www.silverpineapple.net"), false)
})
