import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function StarRating({ rating, size = "md", className = "" }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className={`flex ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${sizeClasses[size]} ${i < rating ? "text-tan fill-current" : "text-gray-300"}`} />
      ))}
    </div>
  )
}
