import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { BROWSER_STORAGE_ITEMS, CONSENT_STORAGE_KEY } from "../app/data/privacy.ts"
import { COOKIE_CONSENT_STORAGE_KEY } from "../app/components/cookieConsent.ts"

const catalogs = Object.fromEntries(
  ["en", "es"].map((locale) => [
    locale,
    JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")),
  ]),
)

function leafPaths(value, prefix = "") {
  if (typeof value !== "object" || value === null) return [prefix]
  return Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key))
}

test("the policy names the consent key the banner actually writes", () => {
  assert.equal(CONSENT_STORAGE_KEY, COOKIE_CONSENT_STORAGE_KEY)
})

test("privacy copy has the same keys in English and Spanish", () => {
  assert.deepEqual(leafPaths(catalogs.es.privacy).sort(), leafPaths(catalogs.en.privacy).sort())
})

test("every listed cookie or storage item has a purpose and duration in both catalogs", () => {
  for (const [locale, catalog] of Object.entries(catalogs)) {
    for (const item of BROWSER_STORAGE_ITEMS) {
      const copy = catalog.privacy.storage.items[item.id]
      assert.ok(copy?.purpose, `${locale}: ${item.id} purpose`)
      assert.ok(copy?.duration, `${locale}: ${item.id} duration`)
      for (const kind of item.kinds) {
        assert.ok(catalog.privacy.storage.kinds[kind], `${locale}: kind ${kind}`)
      }
    }
  }
})

test("review privacy copy describes delivery instead of claiming nothing is sent", () => {
  for (const [locale, catalog] of Object.entries(catalogs)) {
    const reviews = catalog.privacy.collect.reviews
    const serialized = JSON.stringify(reviews)
    assert.ok(!serialized.includes("does not currently send"), `${locale}: stale review copy`)
    assert.ok(!serialized.includes("no envía ni guarda actualmente"), `${locale}: stale review copy`)
    assert.match(reviews.who, /Resend/, `${locale}: Resend in who`)
    assert.ok(catalog.privacy.retention.reviews, `${locale}: retention.reviews`)
  }
})

test("no owner placeholder is left in the published copy", () => {
  for (const [locale, catalog] of Object.entries(catalogs)) {
    const copy = JSON.stringify(catalog.privacy)
    assert.ok(!copy.includes("<todo>"), `${locale}: <todo> placeholder`)
    assert.ok(!/TO BE CONFIRMED|PENDIENTE DE CONFIRMAR/.test(copy), `${locale}: placeholder text`)
  }
})

test("rich-text tags match between English and Spanish", () => {
  const tagsAt = (catalog) =>
    leafPaths(catalog.privacy).map((path) => {
      const text = path.split(".").reduce((node, key) => node[key], catalog.privacy)
      return `${path}:${[...text.matchAll(/<(\w+)>/g)].map((m) => m[1]).sort().join(",")}`
    })
  assert.deepEqual(tagsAt(catalogs.es).sort(), tagsAt(catalogs.en).sort())
})
