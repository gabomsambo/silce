import { Star, Quote } from "lucide-react"

interface FeaturedReviewProps {
  review: {
    text: string
    author: string
    location: string
    rating: number
    source: string
  }
}

export default function FeaturedReview({ review }: FeaturedReviewProps) {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg text-center">
          {/* Quote Icon */}
          <div className="w-16 h-16 bg-tan/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Quote className="w-8 h-8 text-tan" />
          </div>

          {/* Rating Stars */}
          <div className="flex justify-center mb-6">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-tan fill-current" />
            ))}
          </div>

          {/* Review Text */}
          <blockquote className="text-2xl md:text-3xl text-primary font-light italic leading-relaxed mb-8">
            "{review.text}"
          </blockquote>

          {/* Author Info */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-primary">{review.author}</p>
            <p className="text-gray-600">{review.location}</p>
            <p className="text-sm text-tan font-medium">From {review.source}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
