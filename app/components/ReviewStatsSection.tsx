"use client"

import { Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { MagicCard } from "@/components/ui/magic-card"
import { PLATFORM_STATS, getAverageRating, getTotalReviewCount } from "@/app/data/reviews"

export default function ReviewStatsSection() {
  const t = useTranslations("reviews.stats")

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-muted/30">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center tracking-tight">
          {t("heading")}
        </h3>

        {/* Overall Stats */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <div className="text-5xl md:text-6xl font-bold text-tan mb-2">
                {getAverageRating()}
              </div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
            <div className="hidden md:block w-px h-16 bg-gray-300"></div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-tan mb-2">
                {getTotalReviewCount()}+
              </div>
              <p className="text-gray-600 font-medium">Total Reviews</p>
            </div>
          </div>

          {/* 5-Star Visual */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-8 h-8 text-tan fill-tan"
              />
            ))}
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PLATFORM_STATS.map((platform, index) => (
            <MagicCard
              key={index}
              className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-3">{platform.logo}</div>
              <div className="font-bold text-primary mb-2 text-lg">{platform.platform}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-5 h-5 text-tan fill-tan" />
                <span className="font-bold text-tan text-xl">{platform.rating}</span>
              </div>
              <div className="text-sm text-gray-600">{platform.reviews} reviews</div>
            </MagicCard>
          ))}
        </div>

        {/* Trust Message */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("body")}
          </p>
        </div>
      </div>
    </section>
  )
}
