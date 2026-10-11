// app/data/units.ts
import type { CategoryKey } from "./categories"
import { getHospitableUnitContent } from "./hospitableContent"
import { getUnitPhotoMetadata } from "./photoMetadata"
import type { PhotoGroupKey } from "@/lib/photoGroups"

export interface UnitPhoto {
  src: string
  group?: PhotoGroupKey
  sourceCaption?: string
  sourceOrder?: number
}

export interface UnitSquareFootage {
  value: number
  approximate?: boolean
  source?: "description"
  sourceText?: string
}

export interface UnitCoordinate {
  lat: number
  lng: number
}

export interface UnitBedDetail {
  type: string
  quantity: number
}

export interface UnitRoomDetail {
  type: string
  beds?: UnitBedDetail[]
}

export interface UnitHouseRules {
  petsAllowed: boolean
  smokingAllowed: boolean
  eventsAllowed: boolean
  quietHoursStart: string
  checkinTime: string
  checkoutTime: string
}

export interface Unit {
  slug: string                // matches /rooms/[slug]
  titleKey: string            // message key for the visible H1 on the unit page
  category: CategoryKey
  priceFrom: number           // numeric for sorting; format later
  maxGuests: number
  bedrooms: number            // 0 = studio from listing name; public API has no bedroom field
  bathrooms: number
  bedType: string             // e.g., "Queen", "Queen + Sofa Bed" — sourced, never inferred
  floor?: string              // e.g., "Ground", "Upper"
  extras?: string[]           // e.g., ["Dining table", "Workspace"]
  hospitable_id: string
  summary?: string
  description?: string
  summaryEs?: string
  descriptionEs?: string
  squareFootage?: UnitSquareFootage
  amenities?: string[]
  roomDetails?: UnitRoomDetail[]
  coordinates?: UnitCoordinate
  houseRules?: UnitHouseRules
  images: UnitPhoto[]
}

const BASE_UNITS: Unit[] = [
  {
    slug: "unit-2528",
    titleKey: "units.unit-2528.title",
    category: "studio-compact",
    priceFrom: 70,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    floor: "Ground",
    hospitable_id: "2282925",
    images: [
      { src: "/photos_2528/01.webp" },
      { src: "/photos_2528/02.webp" },
      { src: "/photos_2528/03.webp" },
      { src: "/photos_2528/04.webp" },
      { src: "/photos_2528/05.webp" },
      { src: "/photos_2528/06.webp" },
      { src: "/photos_2528/07.webp" },
      { src: "/photos_2528/08.webp" },
      { src: "/photos_2528/09.webp" },
      { src: "/photos_2528/10.webp" },
      { src: "/photos_2528/11.webp" },
      { src: "/photos_2528/12.webp" },
      { src: "/photos_2528/13.webp" },
    ],
  },
  {
    slug: "unit-2536",
    titleKey: "units.unit-2536.title",
    category: "studio-comfort",
    priceFrom: 75,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    floor: "Upper",
    extras: ["Espresso station"],
    hospitable_id: "2282918",
    images: [
      { src: "/photos_2536/01.webp" },
      { src: "/photos_2536/02.webp" },
      { src: "/photos_2536/03.webp" },
      { src: "/photos_2536/04.webp" },
      { src: "/photos_2536/05.webp" },
      { src: "/photos_2536/06.webp" },
      { src: "/photos_2536/07.webp" },
      { src: "/photos_2536/08.webp" },
      { src: "/photos_2536/09.webp" },
      { src: "/photos_2536/10.webp" },
      { src: "/photos_2536/11.webp" },
    ],
  },

  {
    slug: "unit-2538",
    titleKey: "units.unit-2538.title",
    category: "studio-comfort",
    priceFrom: 75,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    floor: "Upper",
    extras: ["High ceilings"],
    hospitable_id: "2282919",
    images: [
      { src: "/photos_2538/01.webp" },
      { src: "/photos_2538/02.webp" },
      { src: "/photos_2538/03.webp" },
      { src: "/photos_2538/04.webp" },
      { src: "/photos_2538/05.webp" },
      { src: "/photos_2538/06.webp" },
      { src: "/photos_2538/07.webp" },
      { src: "/photos_2538/08.webp" },
      { src: "/photos_2538/09.webp" },
      { src: "/photos_2538/10.webp" },
      { src: "/photos_2538/11.webp" },
    ],
  },
  {
    slug: "pineapple-102",
    titleKey: "units.pineapple-102.title",
    category: "one-bed-1-bath",
    priceFrom: 80,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    bedType: "Queen",
    floor: "Ground",
    extras: ["Workspace"],
    hospitable_id: "2282915",
    images: [
      { src: "/photos_102/01.webp" },
      { src: "/photos_102/02.webp" },
      { src: "/photos_102/03.webp" },
      { src: "/photos_102/04.webp" },
      { src: "/photos_102/05.webp" },
      { src: "/photos_102/06.webp" },
      { src: "/photos_102/07.webp" },
      { src: "/photos_102/08.webp" },
      { src: "/photos_102/09.webp" },
      { src: "/photos_102/10.webp" },
      { src: "/photos_102/11.webp" },
    ],
  },
  {
    slug: "sea-grape-102",
    titleKey: "units.sea-grape-102.title",
    category: "two-bed-1-bath",
    priceFrom: 110,
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 1,
    bedType: "Queen + Queen + Sofa Bed",
    floor: "Ground",
    extras: ["Dining table in kitchen"],
    hospitable_id: "2282920",
    images: [
      { src: "/photos_seagrape_102/01.webp" },
      { src: "/photos_seagrape_102/02.webp" },
      { src: "/photos_seagrape_102/03.webp" },
      { src: "/photos_seagrape_102/04.webp" },
      { src: "/photos_seagrape_102/05.webp" },
      { src: "/photos_seagrape_102/06.webp" },
      { src: "/photos_seagrape_102/07.webp" },
      { src: "/photos_seagrape_102/08.webp" },
      { src: "/photos_seagrape_102/09.webp" },
      { src: "/photos_seagrape_102/10.webp" },
      { src: "/photos_seagrape_102/11.webp" },
      { src: "/photos_seagrape_102/12.webp" },
      { src: "/photos_seagrape_102/13.webp" },
    ]
  },
  {
    slug: "unit-2526",
    titleKey: "units.unit-2526.title",
    category: "studio-compact",
    priceFrom: 70,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Full",
    floor: "Upper",
    hospitable_id: "2282928",
    images: [
      { src: "/photos_2526/01.webp" },
      { src: "/photos_2526/02.webp" },
      { src: "/photos_2526/03.webp" },
      { src: "/photos_2526/04.webp" },
      { src: "/photos_2526/05.webp" },
      { src: "/photos_2526/06.webp" },
      { src: "/photos_2526/07.webp" },
      { src: "/photos_2526/08.webp" },
      { src: "/photos_2526/09.webp" },
      { src: "/photos_2526/10.webp" },
      { src: "/photos_2526/11.webp" },
      { src: "/photos_2526/12.webp" },
    ],
  },
  {
    slug: "pineapple-103",
    titleKey: "units.pineapple-103.title",
    category: "studio-comfort",
    priceFrom: 75,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    floor: "Upper",
    hospitable_id: "2282916",
    images: [
      { src: "/photos_103/01.webp" },
      { src: "/photos_103/02.webp" },
      { src: "/photos_103/03.webp" },
      { src: "/photos_103/04.webp" },
      { src: "/photos_103/05.webp" },
      { src: "/photos_103/06.webp" },
      { src: "/photos_103/07.webp" },
      { src: "/photos_103/08.webp" },
      { src: "/photos_103/09.webp" },
      { src: "/photos_103/10.webp" },
      { src: "/photos_103/11.webp" },
    ],
  },
  {
    slug: "pineapple-104",
    titleKey: "units.pineapple-104.title",
    category: "studio-comfort",
    priceFrom: 75,
    maxGuests: 2,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    floor: "Upper",
    hospitable_id: "2282923",
    images: [
      { src: "/photos_104/01.webp" },
      { src: "/photos_104/02.webp" },
      { src: "/photos_104/03.webp" },
      { src: "/photos_104/04.webp" },
      { src: "/photos_104/05.webp" },
      { src: "/photos_104/06.webp" },
      { src: "/photos_104/07.webp" },
      { src: "/photos_104/08.webp" },
      { src: "/photos_104/09.webp" },
      { src: "/photos_104/10.webp" },
      { src: "/photos_104/11.webp" },
      { src: "/photos_104/12.webp" },
      { src: "/photos_104/13.webp" },
    ],
  },
  {
    slug: "pineapple-105",
    titleKey: "units.pineapple-105.title",
    category: "studio-comfort",
    priceFrom: 75,
    maxGuests: 3,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Queen",
    hospitable_id: "2282917",
    images: [
      { src: "/photos_105/01.webp" },
      { src: "/photos_105/02.webp" },
      { src: "/photos_105/03.webp" },
      { src: "/photos_105/04.webp" },
      { src: "/photos_105/05.webp" },
      { src: "/photos_105/06.webp" },
      { src: "/photos_105/07.webp" },
      { src: "/photos_105/08.webp" },
      { src: "/photos_105/09.webp" },
      { src: "/photos_105/10.webp" },
      { src: "/photos_105/11.webp" },
      { src: "/photos_105/12.webp" },
      { src: "/photos_105/13.webp" },
    ],
  },
  {
    slug: "pineapple-101",
    titleKey: "units.pineapple-101.title",
    category: "studio-plus",
    priceFrom: 80,
    maxGuests: 4,
    bedrooms: 0,
    bathrooms: 1,
    bedType: "Full",
    floor: "Upper",
    hospitable_id: "2282914",
    images: [
      { src: "/photos_101/01.webp" },
      { src: "/photos_101/02.webp" },
      { src: "/photos_101/03.webp" },
      { src: "/photos_101/04.webp" },
      { src: "/photos_101/05.webp" },
      { src: "/photos_101/06.webp" },
      { src: "/photos_101/07.webp" },
      { src: "/photos_101/08.webp" },
      { src: "/photos_101/09.webp" },
      { src: "/photos_101/10.webp" },
      { src: "/photos_101/11.webp" },
    ],
  },
  {
    slug: "sea-grape-101",
    titleKey: "units.sea-grape-101.title",
    category: "two-bed-1-bath",
    priceFrom: 110,
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 1,
    bedType: "Queen + Queen + Sofa Bed",
    hospitable_id: "2282921",
    images: [
      { src: "/photos_seagrape_101/01.webp" },
      { src: "/photos_seagrape_101/02.webp" },
      { src: "/photos_seagrape_101/03.webp" },
      { src: "/photos_seagrape_101/04.webp" },
      { src: "/photos_seagrape_101/05.webp" },
      { src: "/photos_seagrape_101/06.webp" },
      { src: "/photos_seagrape_101/07.webp" },
      { src: "/photos_seagrape_101/08.webp" },
      { src: "/photos_seagrape_101/09.webp" },
      { src: "/photos_seagrape_101/10.webp" },
      { src: "/photos_seagrape_101/11.webp" },
    ],
  },
  {
    slug: "sea-grape-201",
    titleKey: "units.sea-grape-201.title",
    category: "one-bed-1-bath",
    priceFrom: 95,
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 1,
    bedType: "Queen",
    hospitable_id: "2282922",
    images: [
      { src: "/photos_seagrape_201/01.webp" },
      { src: "/photos_seagrape_201/02.webp" },
      { src: "/photos_seagrape_201/03.webp" },
      { src: "/photos_seagrape_201/04.webp" },
      { src: "/photos_seagrape_201/05.webp" },
      { src: "/photos_seagrape_201/06.webp" },
      { src: "/photos_seagrape_201/07.webp" },
      { src: "/photos_seagrape_201/08.webp" },
      { src: "/photos_seagrape_201/09.webp" },
      { src: "/photos_seagrape_201/10.webp" },
      { src: "/photos_seagrape_201/11.webp" },
    ],
  },
  {
    slug: "sea-grape-1052-101",
    titleKey: "units.sea-grape-1052-101.title",
    category: "one-bed-1-bath",
    priceFrom: 90,
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 1,
    bedType: "Queen",
    hospitable_id: "2282929",
    // Unit 101 Ed 1052 SG is the sole listing whose 16 source photos have no
    // captions. Keep its gallery flat: assigning groups from the images would
    // violate the project's prohibition on photo-derived labels.
    images: [
      { src: "/photos_seagrape_1052_101/01.webp" },
      { src: "/photos_seagrape_1052_101/02.webp" },
      { src: "/photos_seagrape_1052_101/03.webp" },
      { src: "/photos_seagrape_1052_101/04.webp" },
      { src: "/photos_seagrape_1052_101/05.webp" },
      { src: "/photos_seagrape_1052_101/06.webp" },
      { src: "/photos_seagrape_1052_101/07.webp" },
      { src: "/photos_seagrape_1052_101/08.webp" },
      { src: "/photos_seagrape_1052_101/09.webp" },
      { src: "/photos_seagrape_1052_101/10.webp" },
      { src: "/photos_seagrape_1052_101/11.webp" },
      { src: "/photos_seagrape_1052_101/12.webp" },
      { src: "/photos_seagrape_1052_101/13.webp" },
    ],
  },
]

export const UNITS: Unit[] = BASE_UNITS.map((unit) => ({
  ...unit,
  ...getHospitableUnitContent(unit.hospitable_id),
  images: unit.images.map((photo) => ({
    ...photo,
    ...getUnitPhotoMetadata(unit.hospitable_id, photo.src),
  })),
}))
