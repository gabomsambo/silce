"use client"

import { useState, useMemo } from "react"
import { Star, Filter } from "lucide-react"
import { MagicCard } from "@/components/ui/magic-card"
import { REVIEWS, getReviewsSortedByDate, type ReviewPlatform } from "@/app/data/reviews"
import { UNITS } from "@/app/data/units"

export default function ReviewsDisplay() {
  const [selectedProperty, setSelectedProperty] = useState<string>("all")
  const [minRating, setMinRating] = useState<number>(1)
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [displayCount, setDisplayCount] = useState(9)

  // Filter reviews based on selected criteria
  const filteredReviews = useMemo(() => {
    let filtered = getReviewsSortedByDate()

    if (selectedProperty !== "all") {
      filtered = filtered.filter(r => r.propertySlug === selectedProperty)
    }

    if (minRating > 1) {
      filtered = filtered.filter(r => r.overallRating >= minRating)
    }

    if (selectedPlatform !== "all") {
      filtered = filtered.filter(r => r.platform === selectedPlatform)
    }

    return filtered
  }, [selectedProperty, minRating, selectedPlatform])

  const displayedReviews = filteredReviews.slice(0, displayCount)
  const hasMore = displayedReviews.length < filteredReviews.length

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Airbnb": return "bg-red-100 text-red-700"
      case "Booking.com": return "bg-blue-100 text-blue-700"
      case "VRBO": return "bg-purple-100 text-purple-700"
      case "Google": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const resetFilters = () => {
    setSelectedProperty("all")
    setMinRating(1)
    setSelectedPlatform("all")
    setDisplayCount(9)
  }

  return (
    <section className="py-16 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            RECENT GUEST REVIEWS
          </h2>
          <p className="text-lg text-gray-600">
            Authentic experiences from our valued guests
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-primary">Filter Reviews</h3>
            <button
              onClick={resetFilters}
              className="ml-auto text-sm text-tan hover:text-tan/80 font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Property Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
              >
                <option value="all">All Properties</option>
                {UNITS.map(unit => (
                  <option key={unit.slug} value={unit.slug}>
                    {unit.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMinRating(1)}
                  className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-all ${
                    minRating === 1
                      ? "bg-tan text-white border-tan"
                      : "bg-white text-gray-700 border-gray-300 hover:border-tan"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMinRating(4)}
                  className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-all ${
                    minRating === 4
                      ? "bg-tan text-white border-tan"
                      : "bg-white text-gray-700 border-gray-300 hover:border-tan"
                  }`}
                >
                  4★+
                </button>
                <button
                  onClick={() => setMinRating(5)}
                  className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-all ${
                    minRating === 5
                      ? "bg-tan text-white border-tan"
                      : "bg-white text-gray-700 border-gray-300 hover:border-tan"
                  }`}
                >
                  5★
                </button>
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
              >
                <option value="all">All Platforms</option>
                <option value="Airbnb">Airbnb</option>
                <option value="Booking.com">Booking.com</option>
                <option value="VRBO">VRBO</option>
                <option value="Google">Google</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600 text-center">
            Showing {displayedReviews.length} of {filteredReviews.length} reviews
          </div>
        </div>

        {/* Review Grid */}
        {displayedReviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 mb-4">No reviews match your filters</p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-tan text-white font-semibold rounded-lg hover:bg-tan/90 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map(review => (
              <MagicCard key={review.id} className="p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="space-y-4">
                  {/* Platform Badge and Date */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getPlatformColor(review.platform)}`}>
                      {review.platform}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.overallRating
                            ? "text-tan fill-tan"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                    "{review.text}"
                  </p>

                  {/* Author Info */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="font-medium text-primary text-sm">{review.guestName}</p>
                    {review.propertyName && (
                      <p className="text-xs text-gray-500 mt-1">{review.propertyName}</p>
                    )}
                    {review.stayDuration && (
                      <p className="text-xs text-gray-500 mt-1">Stayed {review.stayDuration}</p>
                    )}
                    {review.highlight && (
                      <p className="text-xs text-tan font-medium mt-1 italic">"{review.highlight}"</p>
                    )}
                  </div>

                  {/* Verified Badge */}
                  {review.verified && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Verified Guest</span>
                    </div>
                  )}
                </div>
              </MagicCard>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setDisplayCount(prev => prev + 9)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-lg border-2 border-tan
                hover:bg-tan hover:text-white transition-all duration-300 hover:shadow-lg"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
