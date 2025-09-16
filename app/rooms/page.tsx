import Navbar from "../components/Navbar"
import RoomsHeroSection from "../components/RoomsHeroSection"
import RoomsIntroduction from "../components/RoomsIntroduction"
import AmenityGrid from "../components/AmenityGrid"
import Footer from "../components/Footer"

import { CATEGORIES } from "../data/categories"
import { UNITS } from "../data/units"
import RoomCategorySection from "../components/RoomCategorySection"

export default function RoomsPage() {
  // group units by category
  const grouped = Object.values(CATEGORIES).map(cat => ({
    cat,
    units: UNITS.filter(u => u.category === cat.key).sort((a,b) => a.priceFrom - b.priceFrom)
  }))

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <RoomsHeroSection />
      <RoomsIntroduction />

      {grouped.map(({ cat, units }) => (
        <RoomCategorySection key={cat.key} category={cat} units={units} />
      ))}

      <AmenityGrid />
      <Footer />
    </main>
  )
}