import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Introduction from "./components/Introduction"
import FeaturedRooms from "./components/FeaturedRooms"
import EnhancedGuestExperiences from "./components/EnhancedGuestExperiences"
import BoutiqueNewsletterSignup from "./components/BoutiqueNewsletterSignup"
import InstagramFeed from "./components/InstagramFeed"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Introduction />
      <FeaturedRooms />
      <EnhancedGuestExperiences />
      <BoutiqueNewsletterSignup />
      <InstagramFeed />
      <Footer />
    </main>
  )
}
