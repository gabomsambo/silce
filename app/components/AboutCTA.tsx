import Link from "next/link"

export default function AboutCTA() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-tan/10 to-tan/5 rounded-3xl p-12 md:p-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
            Ready to Experience Our Space?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Tell us your dates and what you need we'll help you plan a comfortable short stay at Silver Pineapple.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rooms"
              className="bg-tan hover:bg-tan/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Explore Our Rooms
            </Link>
            <Link
              href="/"
              className="bg-white border-2 border-tan text-tan hover:bg-tan hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
