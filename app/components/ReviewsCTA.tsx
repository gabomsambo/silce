import Link from "next/link"

export default function ReviewsCTA() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-tan/10 to-tan/5 rounded-3xl p-12 md:p-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
            Ready to Create Your Own Review?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the exceptional hospitality that our guests rave about. Your perfect stay is just a booking away.
          </p>

          <Link
            href="/"
            className="inline-block bg-tan hover:bg-tan/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Book Your Stay Now
          </Link>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Free Cancellation</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
