// app/data/copy.ts
import { CATEGORIES } from "../data/categories"
import type { Unit } from "../data/units"

/**
 * Shape of a root-scoped next-intl translator (`useTranslations()` /
 * `getTranslations({locale})`). Copy builders take one so the composed
 * sentences below come out of the message catalog, not out of this module.
 */
export type Translate = (key: string, values?: Record<string, string | number>) => string

const LOCALE_TAGS: Record<string, string> = {
  // USD prices for a Florida property: keep US number conventions in both
  // languages, only the language differs.
  en: "en-US",
  es: "es-US",
}

export function formatPrice(n: number, locale = "en") {
  const tag = LOCALE_TAGS[locale] ?? LOCALE_TAGS.en
  return new Intl.NumberFormat(tag, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

/**
 * `units.ts` stores bed types, floors and extras as English literals (that file
 * is the operational source of truth and is edited by hand). These map the
 * known values onto catalog keys; anything unrecognised falls back to the raw
 * literal so a new unit never renders a missing-message error.
 */
const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/\+/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

const KNOWN_BED_TYPES = ["queen", "king", "queen-queen", "queen-sofa-bed", "queen-queen-sofa-bed"]
const KNOWN_FLOORS = ["ground", "upper"]
const KNOWN_EXTRAS = ["dining-table-in-kitchen", "espresso-station", "high-ceilings", "workspace"]

function translateFrom(known: string[], namespace: string, value: string, t: Translate) {
  const slug = slugify(value)
  return known.includes(slug) ? t(`${namespace}.${slug}`) : value.trim()
}

export function translateBedType(bedType: string, t: Translate) {
  return translateFrom(KNOWN_BED_TYPES, "unit.bedTypes", bedType, t)
}

export function translateFloor(floor: string, t: Translate) {
  return translateFrom(KNOWN_FLOORS, "unit.floors", floor, t)
}

export function translateExtra(extra: string, t: Translate) {
  return translateFrom(KNOWN_EXTRAS, "unit.extras", extra, t)
}

/**
 * Capacity shown on a category chip. Derived from the units actually filed
 * under that category so it tracks `maxGuests` instead of being restated by
 * hand: a single figure when they agree, a range otherwise.
 */
export function buildCategorySleepsCount(units: Unit[]) {
  if (!units.length) return null
  const guests = units.map((u) => u.maxGuests)
  const min = Math.min(...guests)
  const max = Math.max(...guests)
  return min === max ? `${min}` : `${min}-${max}`
}

export function buildUnitShortDescription(unit: Unit, t: Translate) {
  const bits = [
    translateBedType(unit.bedType, t),
    unit.sqFt ? t("unit.specs.sqFt", { sqFt: unit.sqFt }) : null,
    unit.floor ? translateFloor(unit.floor, t) : null,
    unit.extras?.length ? unit.extras.map((e) => translateExtra(e, t)).join(" · ") : null,
  ].filter(Boolean)
  return bits.join(" · ")
}

export function buildUnitLongDescription(unit: Unit, t: Translate) {
  const cat = CATEGORIES[unit.category]
  const specifics = [
    unit.sqFt ? t("unit.specs.sqFtApprox", { sqFt: unit.sqFt }) : null,
    unit.bedrooms === 0
      ? t("propertyDetail.templates.specsStudio")
      : unit.bedrooms === 1
        ? t("propertyDetail.templates.specsBedrooms", { bedrooms: unit.bedrooms })
        : t("propertyDetail.templates.specsBedroomsPlural", { bedrooms: unit.bedrooms }),
    unit.bathrooms === 1
      ? t("propertyDetail.templates.specsBathrooms", { bathrooms: unit.bathrooms })
      : t("propertyDetail.templates.specsBathroomsPlural", { bathrooms: unit.bathrooms }),
    t("propertyDetail.templates.specsGuests", { maxGuests: unit.maxGuests }),
    translateBedType(unit.bedType, t),
    unit.extras?.length ? unit.extras.map((e) => translateExtra(e, t)).join(", ") : null,
  ].filter(Boolean).join(" · ")

  return t("unit.description.full", { blurb: t(cat.blurbKey), specifics })
}
