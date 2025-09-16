import Image from "next/image"
import { Star } from "lucide-react"

export default function ReviewPlatformBadges() {
  const platforms = [
    {
      name: "Google Reviews",
      logo: "/placeholder.svg?height=60&width=120&text=Google",
      rating: "4.9",
      reviewCount: "150+",
      link: "#",
    },
    {
      name: "Airbnb",
      logo: "/placeholder.svg?height=60&width=120&text=Airbnb",
      rating: "4.95",
      reviewCount: "200+",
      link: "#",
    },
    {
      name: "Booking.com",
      logo: "/placeholder.svg?height=60&width=120&text=Booking",
      rating: "9.2",
      reviewCount: "100+",
      link: "#",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">Trusted Across Platforms</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what guests are saying about us on all major booking and review platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Platform Logo */}
              <div className="relative h-16 mb-6">
                <Image src={platform.logo || "/placeholder.svg"} alt={platform.name} fill className="object-contain" />
              </div>

              {/* Rating Display */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary mb-2">{platform.rating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-tan fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{platform.reviewCount} reviews</p>
              </div>

              {/* CTA Button */}
              <a
                href={platform.link}
                className="inline-block bg-tan hover:bg-tan/90 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-300"
              >
                Read all reviews on {platform.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
