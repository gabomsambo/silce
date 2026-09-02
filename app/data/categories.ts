// app/data/categories.ts
export type CategoryKey =
  | "studio-compact"     // 2 units (best value)
  | "studio-comfort"     // 4 units (larger studios)
  | "studio-plus"        // 1 unit (huge studio w/ dining table)
  | "one-bed-1-bath"     // 1 unit
  | "two-bed-1-bath"     // 1 unit

/**
 * An amenity chip shown at category level. `key` names a message under
 * `rooms.categoryAmenities`; `values` carries the facts (e.g. capacity) that
 * belong to the data rather than to the copy.
 */
export interface CategoryAmenity {
  key: string
  values?: Record<string, string | number>
}

/**
 * Category metadata. Visible copy lives in `messages/{locale}.json` — the
 * fields below hold message keys, never literals, so both locales render from
 * the same catalog.
 */
export interface CategoryMeta {
  key: CategoryKey
  nameKey: string
  badgeKey?: string
  blurbKey: string
  defaultAmenities: CategoryAmenity[] // shown at category level (shared)
  heroImage?: string
}

const SHARED_AMENITIES: CategoryAmenity[] = [
  { key: "wifi" },
  { key: "smartTv" },
  { key: "onSiteLaundry" },
  { key: "parking" },
]

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  "studio-compact": {
    key: "studio-compact",
    nameKey: "rooms.categories.studio-compact.name",
    badgeKey: "rooms.categories.studio-compact.badge",
    blurbKey: "rooms.categories.studio-compact.blurb",
    defaultAmenities: [
      { key: "sleeps", values: { count: "2" } },
      { key: "queenBed" },
      { key: "kitchenette" },
      ...SHARED_AMENITIES,
    ],
    heroImage: "/rooms/studio-compact.jpg",
  },
  "studio-comfort": {
    key: "studio-comfort",
    nameKey: "rooms.categories.studio-comfort.name",
    blurbKey: "rooms.categories.studio-comfort.blurb",
    defaultAmenities: [
      { key: "sleeps", values: { count: "2" } },
      { key: "queenBed" },
      { key: "kitchenette" },
      ...SHARED_AMENITIES,
    ],
    heroImage: "/rooms/studio-comfort.jpg",
  },
  "studio-plus": {
    key: "studio-plus",
    nameKey: "rooms.categories.studio-plus.name",
    badgeKey: "rooms.categories.studio-plus.badge",
    blurbKey: "rooms.categories.studio-plus.blurb",
    defaultAmenities: [
      { key: "sleeps", values: { count: "2-3" } },
      { key: "queenBed" },
      { key: "kitchenetteDiningTable" },
      ...SHARED_AMENITIES,
    ],
    heroImage: "/rooms/studio-plus.jpg",
  },
  "one-bed-1-bath": {
    key: "one-bed-1-bath",
    nameKey: "rooms.categories.one-bed-1-bath.name",
    blurbKey: "rooms.categories.one-bed-1-bath.blurb",
    defaultAmenities: [
      { key: "sleeps", values: { count: "3-4" } },
      { key: "kingQueenSofaBed" },
      { key: "fullKitchen" },
      ...SHARED_AMENITIES,
    ],
    heroImage: "/rooms/one-bed.jpg",
  },
  "two-bed-1-bath": {
    key: "two-bed-1-bath",
    nameKey: "rooms.categories.two-bed-1-bath.name",
    badgeKey: "rooms.categories.two-bed-1-bath.badge",
    blurbKey: "rooms.categories.two-bed-1-bath.blurb",
    defaultAmenities: [
      { key: "sleeps", values: { count: "4-5" } },
      { key: "twoBedrooms" },
      { key: "fullKitchen" },
      ...SHARED_AMENITIES,
    ],
    heroImage: "/rooms/two-bed.jpg",
  },
}
