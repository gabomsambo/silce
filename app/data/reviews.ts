// app/data/reviews.ts - Centralized review data
export type ReviewPlatform = "Airbnb" | "Booking.com" | "VRBO" | "Google" | "SilverPineapple Direct"

export interface CategoryRatings {
  cleanliness?: number
  communication?: number
  location?: number
  value?: number
}

export interface Review {
  id: string
  guestName: string
  email?: string  // Not displayed publicly, for verification only
  propertySlug?: string  // Links to UNITS slug
  propertyName?: string  // Display name if slug not available
  overallRating: number  // 1-5
  categoryRatings?: CategoryRatings
  text: string
  date: string  // ISO date string
  platform: ReviewPlatform
  verified: boolean
  stayDuration?: string  // e.g., "3 nights"
  highlight?: string  // One-line highlight quote
  avatar?: string  // Path to avatar image
}

// Consolidated reviews from homepage and reviews page
export const REVIEWS: Review[] = [
  // Featured reviews from EnhancedGuestExperiences
  {
    id: "rev-001",
    guestName: "Sarah Johnson",
    propertySlug: "unit-2528",
    propertyName: "Studio — Compact · Unit 2528",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "StayLokal exceeded all expectations! The penthouse was absolutely stunning with breathtaking city views. The attention to detail was incredible - from the welcome amenities to the personalized local recommendations. The host was incredibly responsive and made our anniversary celebration truly unforgettable. The location was perfect for exploring Center City.",
    date: "2024-12-15",
    platform: "Airbnb",
    stayDuration: "3 nights",
    highlight: "Perfect for special occasions",
    verified: true,
    avatar: "/1.jpg"
  },
  {
    id: "rev-002",
    guestName: "Michael Chen",
    propertySlug: "unit-2536",
    propertyName: "Studio — Compact · Unit 2536",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "The oceanfront suite was a dream come true. Waking up to panoramic Atlantic views every morning was magical. The property was immaculately clean and beautifully decorated. The private balcony was perfect for morning coffee and sunset cocktails. The host provided excellent local dining recommendations and beach access was seamless.",
    date: "2024-11-20",
    platform: "Booking.com",
    stayDuration: "5 nights",
    highlight: "Stunning ocean views",
    verified: true,
    avatar: "/2.jpg"
  },
  {
    id: "rev-003",
    guestName: "Emily Rodriguez",
    propertySlug: "unit-2538",
    propertyName: "Studio — Comfort · Unit 2538",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "The historic loft perfectly blended old-world charm with modern luxury. The exposed brick walls and high ceilings created such a unique atmosphere. The location in the historic district was unbeatable - we could walk to amazing restaurants, museums, and attractions. The space was thoughtfully designed and incredibly comfortable.",
    date: "2024-10-10",
    platform: "VRBO",
    stayDuration: "4 nights",
    highlight: "Perfect location & design",
    verified: true,
    avatar: "/3.jpg"
  },

  // Quick reviews from EnhancedGuestExperiences
  {
    id: "rev-004",
    guestName: "David Kim",
    overallRating: 5,
    text: "Exceptional service and beautiful properties. Will definitely book again!",
    date: "2024-11-25",
    platform: "Google",
    verified: true
  },
  {
    id: "rev-005",
    guestName: "Lisa Thompson",
    propertySlug: "pineapple-102",
    overallRating: 5,
    text: "The most memorable stay we've ever had. Every detail was perfect.",
    date: "2024-12-05",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-006",
    guestName: "James Wilson",
    overallRating: 5,
    text: "Outstanding hospitality and gorgeous accommodations. Highly recommend!",
    date: "2024-10-15",
    platform: "Booking.com",
    verified: true
  },
  {
    id: "rev-007",
    guestName: "Maria Garcia",
    propertySlug: "sea-grape-102",
    overallRating: 4,
    text: "Beautiful property with amazing amenities. Great communication from host.",
    date: "2024-09-20",
    platform: "VRBO",
    verified: true
  },
  {
    id: "rev-008",
    guestName: "Robert Brown",
    overallRating: 5,
    text: "Exceeded expectations in every way. The attention to detail was incredible.",
    date: "2024-11-10",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-009",
    guestName: "Jennifer Lee",
    overallRating: 5,
    text: "Perfect getaway! The property was exactly as described and even better.",
    date: "2024-12-01",
    platform: "Google",
    verified: true
  },

  // Reviews from reviews page
  {
    id: "rev-010",
    guestName: "Michael R.",
    overallRating: 5,
    text: "Absolutely stunning property with incredible attention to detail. The self-check-in was seamless, and the apartment was immaculate. The location couldn't be better - walking distance to everything we wanted to see.",
    date: "2024-11-18",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-011",
    guestName: "Jennifer L.",
    overallRating: 5,
    text: "This place is a gem! The design is beautiful, modern yet cozy. The kitchen was fully equipped, and the bed was incredibly comfortable. The neighborhood guide they provided was spot-on with great local recommendations.",
    date: "2024-10-22",
    platform: "Google",
    verified: true
  },
  {
    id: "rev-012",
    guestName: "David K.",
    overallRating: 5,
    text: "Perfect for our business trip. The workspace was well-designed, WiFi was excellent, and the quiet atmosphere allowed us to be productive. The contactless experience was exactly what we needed.",
    date: "2024-09-30",
    platform: "Booking.com",
    verified: true
  },
  {
    id: "rev-013",
    guestName: "Emma T.",
    overallRating: 5,
    text: "We stayed for a week and felt completely at home. The apartment had everything we needed, and the location was perfect for exploring the city. The host was responsive and helpful throughout our stay.",
    date: "2024-11-05",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-014",
    guestName: "Robert H.",
    overallRating: 5,
    text: "Exceptional experience from start to finish. The property photos don't do it justice - it's even more beautiful in person. The amenities were top-notch, and we loved the local coffee shop recommendations.",
    date: "2024-10-08",
    platform: "Google",
    verified: true
  },
  {
    id: "rev-015",
    guestName: "Lisa P.",
    propertySlug: "unit-2526",
    overallRating: 5,
    text: "This was our third stay at StayLokal, and it never disappoints. The consistency in quality and service is remarkable. We always feel welcomed and comfortable, which is why we keep coming back.",
    date: "2024-12-10",
    platform: "Booking.com",
    verified: true
  },
  {
    id: "rev-016",
    guestName: "Sarah M.",
    overallRating: 5,
    text: "StayLokal exceeded every expectation. The attention to detail, the seamless check-in process, and the thoughtful touches throughout our suite made this the most memorable stay we've ever had. It truly felt like a home away from home, but with all the luxury amenities we could want.",
    date: "2024-11-28",
    platform: "Google",
    verified: true
  }
]

// Platform aggregate data
export const PLATFORM_STATS = [
  { platform: "Airbnb", rating: 4.9, reviews: 127, logo: "🏠" },
  { platform: "Booking.com", rating: 4.8, reviews: 89, logo: "🌐" },
  { platform: "VRBO", rating: 4.9, reviews: 64, logo: "🏖️" },
  { platform: "Google", rating: 4.9, reviews: 156, logo: "⭐" }
]

// Helper functions
export const getAverageRating = () => {
  const sum = REVIEWS.reduce((acc, review) => acc + review.overallRating, 0)
  return (sum / REVIEWS.length).toFixed(1)
}

export const getReviewsByProperty = (propertySlug: string) => {
  return REVIEWS.filter(review => review.propertySlug === propertySlug)
}

export const getReviewsByPlatform = (platform: ReviewPlatform) => {
  return REVIEWS.filter(review => review.platform === platform)
}

export const getReviewsByRating = (minRating: number) => {
  return REVIEWS.filter(review => review.overallRating >= minRating)
}

// Sort reviews by date (newest first)
export const getReviewsSortedByDate = () => {
  return [...REVIEWS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get total review count across all platforms
export const getTotalReviewCount = (): number => {
  return PLATFORM_STATS.reduce((acc, platform) => acc + platform.reviews, 0)
}
