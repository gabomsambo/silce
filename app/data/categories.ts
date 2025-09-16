// app/data/categories.ts
export type CategoryKey =
  | "studio-compact"     // 2 units (best value)
  | "studio-comfort"     // 4 units (larger studios)
  | "studio-plus"        // 1 unit (huge studio w/ dining table)
  | "one-bed-1-bath"     // 1 unit
  | "two-bed-1-bath"     // 1 unit

export interface CategoryMeta {
  key: CategoryKey
  name: string
  badge?: string
  blurb: string
  defaultAmenities: string[] // shown at category level (shared)
  heroImage?: string
}

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  "studio-compact": {
    key: "studio-compact",
    name: "Studio — Compact",
    badge: "Best Value",
    blurb:
      "Smart, efficient studios ideal for solo travelers or couples who want a budget-friendly, walkable base beside the Eau Gallie Public Library.",
    defaultAmenities: ["Sleeps 2", "Queen bed", "Kitchenette", "High-speed Wi-Fi", "Smart TV", "On-site laundry", "Parking"],
    heroImage: "/rooms/studio-compact.jpg",
  },
  "studio-comfort": {
    key: "studio-comfort",
    name: "Studio — Comfort",
    blurb:
      "Roomier studios with a bit more breathing space — an easy pick for longer short stays near murals, cafés, and riverfront parks.",
    defaultAmenities: ["Sleeps 2", "Queen bed", "Kitchenette", "High-speed Wi-Fi", "Smart TV", "On-site laundry", "Parking"],
    heroImage: "/rooms/studio-comfort.jpg",
  },
  "studio-plus": {
    key: "studio-plus",
    name: "Studio — Plus (Large)",
    badge: "Extra Space",
    blurb:
      "A large studio with a dedicated dining nook in the kitchen — great for work-from-home days or longer stays.",
    defaultAmenities: ["Sleeps 2-3", "Queen bed", "Kitchenette + dining table", "High-speed Wi-Fi", "Smart TV", "On-site laundry", "Parking"],
    heroImage: "/rooms/studio-plus.jpg",
  },
  "one-bed-1-bath": {
    key: "one-bed-1-bath",
    name: "1 Bedroom, 1 Bath",
    blurb:
      "Separate bedroom and living area for more privacy — a comfy setup for couples, friends, or work trips.",
    defaultAmenities: ["Sleeps 3-4", "King/Queen + sofa bed", "Full kitchen", "High-speed Wi-Fi", "Smart TV", "On-site laundry", "Parking"],
    heroImage: "/rooms/one-bed.jpg",
  },
  "two-bed-1-bath": {
    key: "two-bed-1-bath",
    name: "2 Bedroom, 1 Bath",
    badge: "Great for Groups",
    blurb:
      "Two bedrooms, one bath — the most space for friends or families who want a walkable Eau Gallie base near the river.",
    defaultAmenities: ["Sleeps 4-5", "Two bedrooms", "Full kitchen", "High-speed Wi-Fi", "Smart TV", "On-site laundry", "Parking"],
    heroImage: "/rooms/two-bed.jpg",
  },
}