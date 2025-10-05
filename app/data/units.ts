// app/data/units.ts
import type { CategoryKey } from "./categories"

export interface Unit {
  slug: string                // matches /rooms/[slug]
  title: string               // visible H1 on unit page
  category: CategoryKey
  priceFrom: number           // numeric for sorting; format later
  maxGuests: number
  bedrooms: number
  bathrooms: number
  bedType: string             // e.g., "Queen", "King + Sofa Bed"
  sqFt?: number
  floor?: string              // e.g., "Ground", "Upper"
  extras?: string[]           // e.g., ["Dining table", "Workspace"]
  hospitable_id: string
  images: string[]
}

export const UNITS: Unit[] = [
  // ——— Studios (example mapping to your current slugs) ———
  {
    slug: "unit-2528",             // Unit 2528 in your current data
    title: "Studio — Compact · Unit 2528",
    category: "studio-compact",
    priceFrom: 59,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    sqFt: 350,
    floor: "Ground",
    hospitable_id: "1887660",
    images: ["/5.jpg","/6.jpg","/7.jpg","/PHOTO-2025-06-19-12-33-37.jpg"],
  },
  {
    slug: "unit-2536",               // Unit 2536 in your current data
    title: "Studio — Compact · Unit 2536",
    category: "studio-compact",
    priceFrom: 249,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    sqFt: 360,
    floor: "Upper",
    extras: ["Espresso station"],
    hospitable_id: "1887654",
    images: ["/5.jpg","/1.jpg","/7.jpg","/3.jpg"],
  },

  // 4 larger studios (map 2–3 of your placeholders here)
  {
    slug: "unit-2538",               // use as Studio — Comfort
    title: "Studio — Comfort · Unit 2538",
    category: "studio-comfort",
    priceFrom: 329,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "King",
    sqFt: 430,
    floor: "Upper",
    extras: ["High ceilings"],
    hospitable_id: "1887656",
    images: ["/6.jpg","/2.jpg","/4.jpg","/PHOTO-2025-06-19-12-33-37.jpg"],
  },
  {
    slug: "pineapple-102",         // use as Studio — Comfort
    title: "Studio — Comfort · Pineapple 102",
    category: "studio-comfort",
    priceFrom: 349,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    sqFt: 440,
    floor: "Ground",
    extras: ["Workspace"],
    hospitable_id: "1887648",
    images: [],
  },
  // add two more to reach 4 total comfort studios as you finalize slugs

  // 1 huge studio with dining table
  {
    slug: "sea-grape-102",                // repurpose to Studio — Plus (Large)
    title: "Studio — Plus (Large) · Sea Grape 102",
    category: "studio-plus",
    priceFrom: 399,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "King",
    sqFt: 520,
    floor: "Ground",
    extras: ["Dining table in kitchen"],
    hospitable_id: "1887662",
    images: [],
  },

  // 1 bed / 1 bath
  {
    slug: "unit-2526",
    title: "1 Bedroom · Unit 2526",
    category: "one-bed-1-bath",
    priceFrom: 299,
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 1,
    bedType: "King + Sofa Bed",
    sqFt: 600,
    floor: "Upper",
    hospitable_id: "1887652",
    images: [],
  },

  // 2 bed / 1 bath (add when you publish the page/slug)
  {
    slug: "pineapple-103",
    title: "2 Bedroom, 1 Bath · Pineapple 103",
    category: "two-bed-1-bath",
    priceFrom: 379,
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 1,
    bedType: "Queen + Queen",
    sqFt: 720,
    floor: "Upper",
    hospitable_id: "1887650",
    images: ["/two-bed-1.jpg","/two-bed-2.jpg"],
  },
    // 2 bed / 1 bath (add when you publish the page/slug)
    {
      slug: "pineapple-104",
      title: "2 Bedroom, 1 Bath · Pineapple 104",
      category: "two-bed-1-bath",
      priceFrom: 379,
      maxGuests: 5,
      bedrooms: 2,
      bathrooms: 1,
      bedType: "Queen + Queen",
      sqFt: 720,
      floor: "Upper",
      hospitable_id: "1983780",
      images: ["/two-bed-1.jpg","/two-bed-2.jpg"],
    },
    {
      slug: "seagrape-104",
      title: "2 Bedroom, 1 Bath · Sea Grape 104",
      category: "two-bed-1-bath",
      priceFrom: 379,
      maxGuests: 5,
      bedrooms: 2,
      bathrooms: 1,
      bedType: "Queen + Queen",
      sqFt: 720,
      floor: "Upper",
      hospitable_id: "1983780",
      images: ["/two-bed-1.jpg","/two-bed-2.jpg"],
    },
    
]