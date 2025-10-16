"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star, Calendar, MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MagicCard } from "@/components/ui/magic-card"
import NumberTicker from "@/components/ui/number-ticker"

export default function EnhancedGuestExperiences() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Enhanced review data with platform sources and more details
  const featuredReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/1.jpg",
      rating: 5,
      platform: "Airbnb",
      date: "December 2024",
      stayDuration: "3 nights",
      property: "Philadelphia Penthouse",
      text: "Silver Pineapple exceeded all expectations! The penthouse was absolutely stunning with breathtaking city views. The attention to detail was incredible - from the welcome amenities to the personalized local recommendations. The host was incredibly responsive and made our anniversary celebration truly unforgettable. The location was perfect for exploring Center City.",
      highlight: "Perfect for special occasions",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/2.jpg", 
      rating: 5,
      platform: "Booking.com",
      date: "November 2024",
      stayDuration: "5 nights",
      property: "Cape May Coastal Suite",
      text: "The oceanfront suite was a dream come true. Waking up to panoramic Atlantic views every morning was magical. The property was immaculately clean and beautifully decorated. The private balcony was perfect for morning coffee and sunset cocktails. The host provided excellent local dining recommendations and beach access was seamless.",
      highlight: "Stunning ocean views",
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "/3.jpg",
      rating: 5,
      platform: "VRBO",
      date: "October 2024", 
      stayDuration: "4 nights",
      property: "Historic District Loft",
      text: "The historic loft perfectly blended old-world charm with modern luxury. The exposed brick walls and high ceilings created such a unique atmosphere. The location in the historic district was unbeatable - we could walk to amazing restaurants, museums, and attractions. The space was thoughtfully designed and incredibly comfortable.",
      highlight: "Perfect location & design",
      verified: true
    }
  ]

  const quickReviews = [
    {
      name: "David Kim",
      rating: 5,
      platform: "Google",
      text: "Exceptional service and beautiful properties. Will definitely book again!",
      date: "Nov 2024"
    },
    {
      name: "Lisa Thompson", 
      rating: 5,
      platform: "Airbnb",
      text: "The most memorable stay we've ever had. Every detail was perfect.",
      date: "Dec 2024"
    },
    {
      name: "James Wilson",
      rating: 5,
      platform: "Booking.com", 
      text: "Outstanding hospitality and gorgeous accommodations. Highly recommend!",
      date: "Oct 2024"
    },
    {
      name: "Maria Garcia",
      rating: 4,
      platform: "VRBO",
      text: "Beautiful property with amazing amenities. Great communication from host.",
      date: "Sep 2024"
    },
    {
      name: "Robert Brown",
      rating: 5,
      platform: "Airbnb",
      text: "Exceeded expectations in every way. The attention to detail was incredible.",
      date: "Nov 2024"
    },
    {
      name: "Jennifer Lee",
      rating: 5,
      platform: "Google",
      text: "Perfect getaway! The property was exactly as described and even better.",
      date: "Dec 2024"
    }
  ]

  const platformRatings = [
    { platform: "Airbnb", rating: 4.9, reviews: 127, logo: "🏠" },
    { platform: "Booking.com", rating: 4.8, reviews: 89, logo: "🌐" },
    { platform: "VRBO", rating: 4.9, reviews: 64, logo: "🏖️" },
    { platform: "Google", rating: 4.9, reviews: 156, logo: "⭐" }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredReviews.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredReviews.length) % featuredReviews.length)
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Airbnb": return "bg-red-100 text-red-700"
      case "Booking.com": return "bg-blue-100 text-blue-700"
      case "VRBO": return "bg-purple-100 text-purple-700"
      case "Google": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-coastal-foam/20 to-coastal-mist/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Stats */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            GUEST EXPERIENCES
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover why travelers choose Silver Pineapple for their most memorable getaways
          </p>
          
          {/* Animated Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-tan mb-2">
                <NumberTicker value={500} />+
              </div>
              <p className="text-gray-600 font-medium">Happy Guests</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-tan mb-2">
                <NumberTicker value={4.9} decimalPlaces={1} />
              </div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-tan mb-2">
                <NumberTicker value={3} />+
              </div>
              <p className="text-gray-600 font-medium">Years of Excellence</p>
            </div>
          </div>
        </div>

        {/* Featured Review Carousel */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-primary mb-8 text-center">Featured Guest Stories</h3>
          <div className="relative max-w-4xl mx-auto">
            <MagicCard className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Guest Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      src={featuredReviews[currentSlide].avatar}
                      alt={featuredReviews[currentSlide].name}
                      width={120}
                      height={120}
                      className="rounded-full object-cover"
                    />
                    {featuredReviews[currentSlide].verified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Platform Badge */}
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(featuredReviews[currentSlide].platform)}`}>
                      {featuredReviews[currentSlide].platform}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {featuredReviews[currentSlide].date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {featuredReviews[currentSlide].stayDuration}
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(featuredReviews[currentSlide].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-tan fill-current" />
                    ))}
                  </div>

                  {/* Property */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{featuredReviews[currentSlide].property}</span>
                  </div>

                  {/* Review Text */}
                  <blockquote className="text-lg text-gray-700 mb-4 leading-relaxed italic">
                    "{featuredReviews[currentSlide].text}"
                  </blockquote>

                  {/* Guest Info */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="font-semibold text-primary text-lg">{featuredReviews[currentSlide].name}</div>
                    <div className="text-tan font-medium">"{featuredReviews[currentSlide].highlight}"</div>
                  </div>
                </div>
              </div>
            </MagicCard>

            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {featuredReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-tan" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Reviews Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-primary mb-8 text-center">What Our Guests Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickReviews.map((review, index) => (
              <MagicCard key={index} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(review.platform)}`}>
                    {review.platform}
                  </span>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-tan fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">"{review.text}"</p>
                
                <div className="font-medium text-primary text-sm">{review.name}</div>
              </MagicCard>
            ))}
          </div>
        </div>

        {/* Platform Ratings */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-primary mb-8">Trusted Across All Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {platformRatings.map((platform, index) => (
              <MagicCard key={index} className="p-6 text-center">
                <div className="text-3xl mb-2">{platform.logo}</div>
                <div className="font-bold text-primary mb-1">{platform.platform}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-tan fill-current" />
                  <span className="font-bold text-tan">{platform.rating}</span>
                </div>
                <div className="text-sm text-gray-600">{platform.reviews} reviews</div>
              </MagicCard>
            ))}
          </div>

          {/* CTA to Reviews Page */}
          <div className="mt-12">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-8 py-4 bg-tan text-white font-semibold rounded-lg
                hover:bg-tan/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Share Your Experience
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
