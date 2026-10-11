import assert from "node:assert/strict"
import test from "node:test"
import {
  buildNewsletterResendProperties,
  normalizeNewsletterLocale,
  sanitizeNewsletterInterests,
  serializeNewsletterInterests,
} from "../lib/newsletterSegment.ts"

test("normalizeNewsletterLocale falls back to en for missing or invalid values", () => {
  assert.equal(normalizeNewsletterLocale(undefined), "en")
  assert.equal(normalizeNewsletterLocale(null), "en")
  assert.equal(normalizeNewsletterLocale("fr"), "en")
  assert.equal(normalizeNewsletterLocale("es"), "es")
})

test("sanitizeNewsletterInterests drops unknown ids and deduplicates", () => {
  assert.deepEqual(sanitizeNewsletterInterests(["new-studios", "bogus", "new-studios", 3]), ["new-studios"])
  assert.deepEqual(sanitizeNewsletterInterests(null), [])
})

test("serializeNewsletterInterests joins stable ids for Resend", () => {
  assert.equal(serializeNewsletterInterests(["seasonal", "local-tips"]), "seasonal,local-tips")
  assert.equal(serializeNewsletterInterests([]), "")
})

test("buildNewsletterResendProperties omits absent segmentation properties", () => {
  assert.deepEqual(buildNewsletterResendProperties({}), {})
  assert.deepEqual(buildNewsletterResendProperties({ locale: "es" }), { locale: "es" })
  assert.deepEqual(buildNewsletterResendProperties({ interests: [] }), { newsletter_interests: "" })
})

test("buildNewsletterResendProperties maps present locale and sanitized interests", () => {
  assert.deepEqual(
    buildNewsletterResendProperties({
      locale: "es",
      interests: ["special-offers", "not-real", "new-studios"],
    }),
    {
      locale: "es",
      newsletter_interests: "special-offers,new-studios",
    },
  )
})
