import type { Metadata } from "next"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Introduction from "./components/Introduction"
import DiscoverLocationSection from "./components/DiscoverLocationSection"
import EnhancedGuestExperiences from "./components/EnhancedGuestExperiences"
import BoutiqueNewsletterSignup from "./components/BoutiqueNewsletterSignup"
import InstagramFeed from "./components/InstagramFeed"
import Footer from "./components/Footer"

export const metadata: Metadata = {
  title: "Home",
  description: "Discover boutique short-term rentals in Eau Gallie, Melbourne FL. Steps from the arts district, 10 minutes to beaches. Renovated units with parking, laundry, and coastal charm.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Silver Pineapple | Boutique Short-Term Rentals in Melbourne, FL",
    description: "Live like a local in Melbourne's arts district. Renovated units, easy parking, on-site laundry, steps from murals and cafés, beaches minutes away.",
    url: "/",
    siteName: "Silver Pineapple",
    images: ["/og-home.jpg"],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silver Pineapple | Boutique Short-Term Rentals",
    description: "Boutique rentals in Eau Gallie, Melbourne FL. Arts district location, beach access, renovated units with all amenities.",
    images: ["/og-home.jpg"],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-ocean-sunrise">
      <Navbar />
      <Hero />
      <Introduction />
      <DiscoverLocationSection />
      {/* <EnhancedGuestExperiences /> */}
      <BoutiqueNewsletterSignup />
      {/* <InstagramFeed /> */}
      <Footer />
    </main>
  )
}
