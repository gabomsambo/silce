// app/about/page.tsx
import type { Metadata } from "next"
import Navbar from "../components/Navbar"
import AboutHeroSection from "../components/AboutHeroSection"
import IntroductionSection from "../components/IntroductionSection"
import FounderSection from "../components/FounderSection"
import PhilosophySection from "../components/PhilosophySection"
import LocationSection from "../components/LocationSection"
import AboutCTA from "../components/AboutCTA"
import Footer from "../components/Footer"

export const metadata: Metadata = {
  title: "About Silver Pineapple | Eau Gallie Short Stays",
  description:
    "Stay steps from the Eau Gallie Public Library. Renovated short-term units, easy parking, on-site laundry, murals, cafés, and beaches minutes away.",
  openGraph: {
    title: "About Silver Pineapple | Eau Gallie Short Stays",
    description:
      "Live like a local in Melbourne’s arts district. Two sister buildings with a shared backyard, renovated units, laundry, easy parking, and beaches in 10–15 minutes.",
    url: "/about",
    siteName: "Silver Pineapple",
    images: ["/og-about.jpg"], // 1200x630 recommended
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Silver Pineapple | Eau Gallie Short Stays",
    description:
      "Live like a local in Melbourne’s arts district. Two sister buildings with a shared backyard, renovated units, laundry, easy parking, and beaches in 10–15 minutes.",
    images: ["/og-about.jpg"],
  },
}
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <AboutHeroSection />
      <IntroductionSection />
      <FounderSection />
      <PhilosophySection />
      <LocationSection />
      <AboutCTA />
      <Footer />
    </main>
  )
}