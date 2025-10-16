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

// Real guest reviews from Silver Pineapple properties
export const REVIEWS: Review[] = [
  {
    id: "rev-001",
    guestName: "Arturo",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Overall clean and nice place to stay the night, me and my family of 6 stayed for a single night, host let me book the same day of and was super responsive the entire time! Would recommend this stay for a quick get away trip!",
    date: "2024-10-15",
    platform: "Airbnb",
    stayDuration: "1 night",
    highlight: "Super responsive host",
    verified: true
  },
  {
    id: "rev-002",
    guestName: "Jason",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Great spot, close to everything and yet away from the hustle. Perfect place for a few days of exploring and such.",
    date: "2024-10-20",
    platform: "Airbnb",
    highlight: "Perfect location balance",
    verified: true
  },
  {
    id: "rev-003",
    guestName: "Kimberly",
    overallRating: 5,
    text: "Definitely a great place to stay on vacation! Will definitely be booking with her again in the future!",
    date: "2024-10-25",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-004",
    guestName: "David",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Thank you Ada for your responsiveness and accurate description of your property. I work extremely early mornings so a private unit was perfect for me. I would recommend this unit for a single professional or couple.",
    date: "2024-09-28",
    platform: "Booking.com",
    highlight: "Perfect for professionals",
    verified: true
  },
  {
    id: "rev-005",
    guestName: "Ryan",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      location: 5,
      value: 5
    },
    text: "This is a great beach getaway that won't break the bank. Your only 10 mins from a beautiful clean beach and less than 5 minutes from great restaurants. Gotta check out Squid Lips. The AC in this house is better than in my car - if you turn it down it will be like your sleeping in the fridge. Highly recommend!",
    date: "2024-07-18",
    platform: "Airbnb",
    stayDuration: "3 nights",
    highlight: "Great value beach getaway",
    verified: true
  },
  {
    id: "rev-006",
    guestName: "Elice",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      value: 5
    },
    text: "Excelente lugar, cómodo, todo el tiempos que necesite hacer preguntas mi anfitriona estaba para contestar y asistir. Definitivamente lo recomiendo y espero regresar pronto 🙏",
    date: "2024-06-22",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-007",
    guestName: "David",
    overallRating: 5,
    text: "Ada is a great host. This is my third visit and I'll be back!",
    date: "2024-06-15",
    platform: "Airbnb",
    highlight: "Repeat guest - 3rd visit",
    verified: true
  },
  {
    id: "rev-008",
    guestName: "Jimmy",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      location: 5
    },
    text: "Great cute place, close to the water/beaches. Ada is a responsive and great host. The place was just as described, we had a short stay but if we are ever back in the area we would like to stay with them.",
    date: "2024-06-10",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-009",
    guestName: "Tim",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      location: 5,
      value: 5
    },
    text: "Always stay here while I'm working away from home. It really is a great deal and always clean. Very private and you can see the river across the street.",
    date: "2024-05-28",
    platform: "Booking.com",
    highlight: "Repeat guest - work stays",
    verified: true
  },
  {
    id: "rev-010",
    guestName: "Jose",
    overallRating: 5,
    text: "Place was very comfortable. Perfect for one person and a short stay depending on your needs. Pretty small place, but the layout fits everything well in the space. I slept very well.",
    date: "2024-05-24",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-011",
    guestName: "Melissa",
    overallRating: 5,
    text: "Great place for our one night stay… we live in Orlando and love weekend getaways.",
    date: "2024-05-20",
    platform: "Airbnb",
    stayDuration: "1 night",
    verified: true
  },
  {
    id: "rev-012",
    guestName: "Jacquelyn",
    overallRating: 5,
    text: "Absolutely loved my stay here, unfortunately I did have to cut my time short due to some plans changing but overall it was a beautiful stay! 😊",
    date: "2024-05-18",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-013",
    guestName: "Jared",
    overallRating: 5,
    categoryRatings: {
      communication: 5,
      value: 5
    },
    text: "I highly recommend this stay. My fiancé and I were waiting to close on a house and the host was more than happy to accommodate us for a temporary stay. Thanks again.",
    date: "2024-05-15",
    platform: "Booking.com",
    highlight: "Accommodating host",
    verified: true
  },
  {
    id: "rev-014",
    guestName: "Adrian",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      location: 5,
      value: 5
    },
    text: "The place was very clean, comfortable and close to fun things to do. We loved the spaciousness of the rooms and the comfort of the beds and couches. The kitchen was stocked with pots and pans, dishes and silverware and there were more than enough towels and comfy bedding! We had such a nice stay!",
    date: "2024-04-28",
    platform: "Airbnb",
    highlight: "Spacious and well-equipped",
    verified: true
  },
  {
    id: "rev-015",
    guestName: "Joshua",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5
    },
    text: "Perfect for what I needed! Well kept, plenty of parking, great communication.",
    date: "2024-04-24",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-016",
    guestName: "Tim",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      location: 5
    },
    text: "It was perfect and peaceful. Quiet at night and the place was very clean. Check-in was a breeze and parking was perfect, right in front of your room. I will stay here again.",
    date: "2024-04-20",
    platform: "Booking.com",
    highlight: "Peaceful and quiet",
    verified: true
  },
  {
    id: "rev-017",
    guestName: "Kavi",
    overallRating: 5,
    categoryRatings: {
      cleanliness: 5,
      communication: 5,
      value: 5
    },
    text: "Absolutely adorable! Everything you need for a 'stay away.' Check-in and communication was absolutely fabulous and easy. You can tell that they care about hosting this fabulous place and I definitely recommend it because I will be back.",
    date: "2024-04-15",
    platform: "Airbnb",
    highlight: "Caring hosts",
    verified: true
  },
  {
    id: "rev-018",
    guestName: "Kayla",
    overallRating: 5,
    categoryRatings: {
      location: 5,
      value: 5
    },
    text: "Great place for a quick overnight or extended stay. Central to the important places but not right in the middle of the hustle and bustle.",
    date: "2024-04-10",
    platform: "Airbnb",
    verified: true
  },
  {
    id: "rev-019",
    guestName: "Tori",
    overallRating: 5,
    text: "This apartment was great! Perfect amount of space and just what we needed! We will definitely stay here again!",
    date: "2024-04-05",
    platform: "Airbnb",
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
