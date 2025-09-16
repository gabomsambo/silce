import { Star } from "lucide-react"
import Image from "next/image"

interface ReviewCardProps {
  review: {
    id: number
    rating: number
    text: string
    author: string
    source: string
    avatar?: string
  }
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Rating Stars */}
      <div className="flex mb-4">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-tan fill-current" />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">{review.text}</p>

      {/* Author Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {review.avatar && (
            <div className="relative w-10 h-10">
              <Image
                src={review.avatar || "/placeholder.svg"}
                alt={review.author}
                fill
                className="object-cover rounded-full"
              />
            </div>
          )}
          <div>
            <p className="font-semibold text-primary text-sm">{review.author}</p>
            <p className="text-xs text-gray-500">From {review.source}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
