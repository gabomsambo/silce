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
    title: "Studio - Compact · Unit 2528",
    category: "studio-compact",
    priceFrom: 49,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    //sqFt: 350,
    floor: "Ground",
    hospitable_id: "1887660",
    images: ["/photos_2528/1.jpg","/photos_2528/2.jpg","/photos_2528/3.jpg","/photos_2528/4.jpg","/photos_2528/5.jpg","/photos_2528/6.jpg","/photos_2528/7.jpg","/photos_2528/8.jpg","/photos_2528/9.jpg","/photos_2528/10.jpg"],
  },
  {
    slug: "unit-2536",               // Unit 2536 in your current data
    title: "Studio — Compact · Unit 2536",
    category: "studio-comfort",
    priceFrom: 59,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    //sqFt: 360,
    floor: "Upper",
    extras: ["Espresso station"],
    hospitable_id: "1887654",
    images: ["/photos_2536/1.jpg","/photos_2536/2.jpg","/photos_2536/3.jpg","/photos_2536/4.jpg","/photos_2536/5.jpg","/photos_2536/6.jpg","/photos_2536/7.jpg","/photos_2536/8.jpg"],
  },

  // 4 larger studios (map 2–3 of your placeholders here)
  {
    slug: "unit-2538",               // use as Studio — Comfort
    title: "Studio — Comfort · Unit 2538",
    category: "studio-comfort",
    priceFrom: 59,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "King",
    sqFt: 430,
    floor: "Upper",
    extras: ["High ceilings"],
    hospitable_id: "1887656",
    images: ["/photos_2538/1.jpg","/photos_2538/2.jpg","/photos_2538/3.jpg","/photos_2538/4.jpg","/photos_2538/5.jpg","/photos_2538/6.jpg","/photos_2538/7.jpg","/photos_2538/8.jpg","/photos_2538/9.jpg","/photos_2538/10.jpg","/photos_2538/11.jpg","/photos_2538/12.jpg"],
  },
  {
    slug: "pineapple-102",         // use as Studio — Comfort
    title: "1 Bedroom, 1 Bath · Pineapple 102",
    category: "one-bed-1-bath",
    priceFrom: 69,
    maxGuests: 4,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    sqFt: 440,
    floor: "Ground",
    extras: ["Workspace"],
    hospitable_id: "1887648",
    images: ["/photos_102/1.jpg","/photos_102/2.jpg","/photos_102/3.jpg","/photos_102/4.jpg","/photos_102/5.jpg","/photos_102/6.jpg","/photos_102/7.jpg","/photos_102/8.jpg","/photos_102/9.jpg"],
  },
  // add two more to reach 4 total comfort studios as you finalize slugs

  // 1 huge studio with dining table
  {
    slug: "sea-grape-102",                // repurpose to Studio — Plus (Large)
    title: "2 Bedroom, 1 Bath · Sea Grape 102",
    category: "two-bed-1-bath",
    priceFrom: 79,
    maxGuests: 6,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen + Queen + Sofa Bed",
    sqFt: 520,
    floor: "Ground",
    extras: ["Dining table in kitchen"],
    hospitable_id: "1887662",
    images: ["/photos_seagrape_102/1.jpg","/photos_seagrape_102/2.jpg","/photos_seagrape_102/3.jpg","/photos_seagrape_102/4.jpg","/photos_seagrape_102/5.jpg","/photos_seagrape_102/6.jpg","/photos_seagrape_102/9.jpg","/photos_seagrape_102/10.jpg","/photos_seagrape_102/9.jpg","/photos_seagrape_102/10.jpg","/photos_seagrape_102/11.jpg","/photos_seagrape_102/12.jpg","/photos_seagrape_102/13.jpg","/photos_seagrape_102/14.jpg","/photos_seagrape_102/15.jpg","/photos_seagrape_102/16.jpg"]
  },

  // 1 bed / 1 bath
  {
    slug: "unit-2526",
    title: "Studio - Compact · Unit 2526",
    category: "studio-compact",
    priceFrom: 49,
    maxGuests: 4,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    //sqFt: 600,
    floor: "Upper",
    hospitable_id: "1887652",
    images: ["/photos_2526/1.jpg","/photos_2526/2.jpg","/photos_2526/3.jpg","/photos_2526/4.jpg","/photos_2526/5.jpg","/photos_2526/6.jpg","/photos_2526/7.jpg","/photos_2526/8.jpg"],
  },

  // 2 bed / 1 bath (add when you publish the page/slug)
  {
    slug: "pineapple-103",
    title: "Studio - Comfort · Pineapple 103",
    category: "studio-comfort",
    priceFrom: 59,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    sqFt: 720,
    floor: "Upper",
    hospitable_id: "1887650",
    images: ["/photos_103/1.jpg","/photos_103/2.jpg","/photos_103/3.jpg","/photos_103/4.jpg","/photos_103/5.jpg","/photos_103/6.jpg","/photos_103/7.jpg","/photos_103/8.jpg"],
  },
    // 2 bed / 1 bath (add when you publish the page/slug)
    {
      slug: "pineapple-104",
      title: "Studio - Comfort · Pineapple 104",
      category: "studio-comfort",
      priceFrom: 59,
      maxGuests: 2,
      bedrooms: 0,
      bathrooms: 1,
      bedType: "Queen",
      sqFt: 720,
      floor: "Upper",
      hospitable_id: "1983780",
      images: ["/photos_104/1.jpg","/photos_104/2.jpg","/photos_104/3.jpg","/photos_104/4.jpg","/photos_104/5.jpg"],
    },
    {
      slug: "pineapple-101",
      title: "Studio — Plus (Large) · Pineapple 101",
      category: "studio-plus",
      priceFrom: 69,
      maxGuests: 2,
      bedrooms: 0,
      bathrooms: 1,
      bedType: "Queen ",
      sqFt: 720,
      floor: "Upper",
      hospitable_id: "1983780",
      images: ["/photos_101/1.jpg","/photos_101/2.jpg","/photos_101/3.jpg","/photos_101/4.jpg","/photos_101/5.jpg","/photos_101/6.jpg","/photos_101/7.jpg","/photos_101/8.jpg","/photos_101/9.jpg","/photos_101/10.jpg"],
    },
    
]