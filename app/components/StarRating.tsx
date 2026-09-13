import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  label: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function StarRating({ rating, label, size = "md", className = "" }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className={`flex ${className}`} aria-label={label}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`${sizeClasses[size]} ${i < rating ? "text-tan-ink fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  )
}
