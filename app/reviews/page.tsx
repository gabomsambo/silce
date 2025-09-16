import Navbar from "../components/Navbar"
import ReviewsHeroSection from "../components/ReviewsHeroSection"
import ReviewsIntroduction from "../components/ReviewsIntroduction"
import FeaturedReview from "../components/FeaturedReview"
import ReviewGrid from "../components/ReviewGrid"
import ReviewPlatformBadges from "../components/ReviewPlatformBadges"
import ReviewsCTA from "../components/ReviewsCTA"
import Footer from "../components/Footer"

export default function ReviewsPage() {
  const featuredReview = {
    text: "StayLokal exceeded every expectation. The attention to detail, the seamless check-in process, and the thoughtful touches throughout our suite made this the most memorable stay we've ever had. It truly felt like a home away from home, but with all the luxury amenities we could want.",
    author: "Sarah M.",
    location: "Verified Guest",
    rating: 5,
    source: "Google Reviews",
  }

  const reviews = [
    {
      id: 1,
      rating: 5,
      text: "Absolutely stunning property with incredible attention to detail. The self-check-in was seamless, and the apartment was immaculate. The location couldn't be better - walking distance to everything we wanted to see.",
      author: "Michael R.",
      source: "Airbnb",
      avatar: "/placeholder.svg?height=40&width=40&text=MR",
    },
    {
      id: 2,
      rating: 5,
      text: "This place is a gem! The design is beautiful, modern yet cozy. The kitchen was fully equipped, and the bed was incredibly comfortable. The neighborhood guide they provided was spot-on with great local recommendations.",
      author: "Jennifer L.",
      source: "Google Reviews",
      avatar: "/placeholder.svg?height=40&width=40&text=JL",
    },
    {
      id: 3,
      rating: 5,
      text: "Perfect for our business trip. The workspace was well-designed, WiFi was excellent, and the quiet atmosphere allowed us to be productive. The contactless experience was exactly what we needed.",
      author: "David K.",
      source: "Booking.com",
      avatar: "/placeholder.svg?height=40&width=40&text=DK",
    },
    {
      id: 4,
      rating: 5,
      text: "We stayed for a week and felt completely at home. The apartment had everything we needed, and the location was perfect for exploring the city. The host was responsive and helpful throughout our stay.",
      author: "Emma T.",
      source: "Airbnb",
      avatar: "/placeholder.svg?height=40&width=40&text=ET",
    },
    {
      id: 5,
      rating: 5,
      text: "Exceptional experience from start to finish. The property photos don't do it justice - it's even more beautiful in person. The amenities were top-notch, and we loved the local coffee shop recommendations.",
      author: "Robert H.",
      source: "Google Reviews",
      avatar: "/placeholder.svg?height=40&width=40&text=RH",
    },
    {
      id: 6,
      rating: 5,
      text: "This was our third stay at StayLokal, and it never disappoints. The consistency in quality and service is remarkable. We always feel welcomed and comfortable, which is why we keep coming back.",
      author: "Lisa P.",
      source: "Booking.com",
      avatar: "/placeholder.svg?height=40&width=40&text=LP",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ReviewsHeroSection />
      <ReviewsIntroduction />
      <FeaturedReview review={featuredReview} />
      <ReviewGrid reviews={reviews} />
      <ReviewPlatformBadges />
      <ReviewsCTA />
      <Footer />
    </main>
  )
}
