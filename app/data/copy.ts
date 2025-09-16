// app/utils/copy.ts
import { CATEGORIES } from "../data/categories"
import type { Unit } from "../data/units"

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

export function buildUnitShortDescription(unit: Unit) {
  const bits = [
    unit.bedType,
    unit.sqFt ? `${unit.sqFt} sq ft` : null,
    unit.floor ? `${unit.floor} level` : null,
    unit.extras?.length ? unit.extras.join(" · ") : null,
  ].filter(Boolean)
  return bits.join(" · ")
}

export function buildUnitLongDescription(unit: Unit) {
  const cat = CATEGORIES[unit.category]
  const base = cat.blurb
  const specifics = [
    unit.sqFt && `~${unit.sqFt} sq ft`,
    `${unit.bedrooms} bedroom${unit.bedrooms !== 1 ? "s" : ""}`,
    `${unit.bathrooms} bathroom${unit.bathrooms !== 1 ? "s" : ""}`,
    `${unit.maxGuests} guests`,
    unit.bedType,
    unit.extras?.length ? unit.extras.join(", ") : null,
  ].filter(Boolean).join(" · ")

  return `${base} ${specifics ? `Highlights: ${specifics}.` : ""} Walk to the Eau Gallie Public Library, EGAD murals, cafés, and riverfront parks; beaches in ~10–15 minutes.`
}

export function buildMetaDescription(unit: Unit) {
  const short = buildUnitShortDescription(unit)
  return `${unit.title}: ${short ? short + " · " : ""}Walk to library, murals, cafés; beach in 10–15 min. Book at Silver Pineapple.`
}