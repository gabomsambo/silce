import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Introduction from "./components/Introduction"
import DiscoverLocationSection from "./components/DiscoverLocationSection"
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
      <DiscoverLocationSection />
      <EnhancedGuestExperiences />
      <BoutiqueNewsletterSignup />
      <InstagramFeed />
      <Footer />
    </main>
  )
}
