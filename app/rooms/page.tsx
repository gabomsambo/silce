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
    <main className="min-h-screen relative">
      {/* Background image with opacity */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(/dolphin.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content wrapper with gradient overlay */}
      <div className="relative z-10 bg-gradient-to-b from-tropical-waters/95 via-tropical-waters/90 to-tropical-waters/95">
        <Navbar />
        <RoomsHeroSection />
        <RoomsIntroduction />

        {grouped.map(({ cat, units }) => (
          <RoomCategorySection key={cat.key} category={cat} units={units} />
        ))}

        <AmenityGrid />
        <Footer />
      </div>
    </main>
  )
}