import ReviewCard from "./ReviewCard"

interface Review {
  id: number
  rating: number
  text: string
  author: string
  source: string
  avatar?: string
}

interface ReviewGridProps {
  reviews: Review[]
}

export default function ReviewGrid({ reviews }: ReviewGridProps) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">Guest Experiences</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read what our guests have to say about their stays with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}
