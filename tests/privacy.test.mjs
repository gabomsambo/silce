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

test("owner placeholders appear in the same places in both languages", () => {
  const placeholderPaths = (catalog) =>
    leafPaths(catalog.privacy).filter((path) =>
      path.split(".").reduce((node, key) => node[key], catalog.privacy).includes("<todo>"),
    )
  const en = placeholderPaths(catalogs.en)
  assert.ok(en.length > 0)
  assert.deepEqual(placeholderPaths(catalogs.es), en)
})
