import source from "./hospitable-units.json"
import type { Unit } from "./units"

interface RawCoordinates {
  latitude: string
  longitude: string
}

interface RawUnit {
  name: string
  amenities: string[]
  description: string
  summary: string
  room_details: Array<{ type: string; beds: Array<{ type: string; quantity: number }> }>
  house_rules: { pets_allowed: boolean; smoking_allowed: boolean; events_allowed: boolean }
  checkin: string
  checkout: string
  address: { coordinates: RawCoordinates }
}

const PROPERTY_ID_BY_NAME: Record<string, string> = {
  "2282914": "Unit PA101 Ed 2546",
  "2282915": "Unit PA102 Ed 2546",
  "2282916": "Unit PA103 Ed 2546",
  "2282917": "Unit PA105 Ed 2546",
  "2282918": "Unit PA2536",
  "2282919": "Unit PA2538",
  "2282920": "Unit SG102 Ed 1042",
  "2282921": "Unit SG101 Ed 1042",
  "2282922": "Unit SG201 ED 1042",
  "2282923": "Unit PA104 Ed 2546",
  "2282925": "Unit PA2528",
  "2282928": "Unit PA2526",
  "2282929": "Unit 101 Ed 1052 SG",
}

const rawUnits = (source.units ?? []) as RawUnit[]
const rawUnitByName = new Map(rawUnits.map((unit) => [unit.name, unit]))

function assertRawUnit(name: string) {
  const unit = rawUnitByName.get(name)
  if (!unit) {
    throw new Error(`Missing Hospitable dataset unit: ${name}`)
  }
  return unit
}

function parseSquareFootage(description: string, summary: string) {
  const text = `${description}\n${summary}`
  const match = text.match(/(~)?\s*(\d{3,4})\s*(?:sq\.?\s*ft|square\s*feet)/i)
  if (!match) return undefined

  return {
    value: Number(match[2]),
    approximate: Boolean(match[1]),
    source: "description" as const,
    sourceText: match[0].trim(),
  }
}

function normalizeAmenities(rawUnit: RawUnit) {
  const roomTypes = new Set(rawUnit.room_details.map((room) => room.type))
  const withKitchenGuard = rawUnit.amenities.filter((amenity) =>
    amenity === "kitchen" ? roomTypes.has("kitchen") : true
  )

  const hasLaundry =
    withKitchenGuard.includes("washer") ||
    withKitchenGuard.includes("dryer") ||
    withKitchenGuard.includes("laundromat_nearby")

  return hasLaundry && !withKitchenGuard.includes("on_site_laundry_paid")
    ? [...withKitchenGuard, "on_site_laundry_paid"]
    : withKitchenGuard
}

function unitContentFromRaw(rawUnit: RawUnit): Partial<Unit> {
  return {
    summary: rawUnit.summary,
    description: rawUnit.description,
    squareFootage: parseSquareFootage(rawUnit.description, rawUnit.summary),
    amenities: normalizeAmenities(rawUnit),
    roomDetails: rawUnit.room_details.map((room) => ({
      type: room.type,
      beds: room.beds.map((bed) => ({ type: bed.type, quantity: bed.quantity })),
    })),
    coordinates: {
      lat: Number(rawUnit.address.coordinates.latitude),
      lng: Number(rawUnit.address.coordinates.longitude),
    },
    houseRules: {
      petsAllowed: rawUnit.house_rules.pets_allowed,
      smokingAllowed: rawUnit.house_rules.smoking_allowed,
      eventsAllowed: rawUnit.house_rules.events_allowed,
      quietHoursStart: "22:00",
      checkinTime: rawUnit.checkin,
      checkoutTime: rawUnit.checkout,
    },
  }
}

const contentByPropertyId: Record<string, Partial<Unit>> = Object.fromEntries(
  Object.entries(PROPERTY_ID_BY_NAME).map(([id, unitName]) => [id, unitContentFromRaw(assertRawUnit(unitName))])
)

export function getHospitableUnitContent(hospitableId: string): Partial<Unit> {
  return contentByPropertyId[hospitableId] ?? {}
}
