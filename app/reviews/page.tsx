import Navbar from "../components/Navbar"
import ReviewSubmissionForm from "../components/ReviewSubmissionForm"
import ReviewStatsSection from "../components/ReviewStatsSection"
import ReviewsDisplay from "../components/ReviewsDisplay"
import Footer from "../components/Footer"

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-ocean-sunrise">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-coastal-aqua/20 via-coastal-foam/15 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            GUEST REVIEWS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Read what our guests say and share your own Silver Pineapple experience
          </p>
        </div>
      </section>

      {/* New Components */}
      <ReviewSubmissionForm />
      <ReviewStatsSection />
      <ReviewsDisplay />

      <Footer />
    </main>
  )
}
