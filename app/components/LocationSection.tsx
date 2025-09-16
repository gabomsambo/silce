import Image from "next/image"

export default function LocationSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight">
              Discover Eau Gallie
            </h2>

            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Welcome to Melbourne’s creative heart. From our doorstep beside the Eau Gallie Public Library, you can
                wander a walkable district filled with colorful murals, independent galleries, cozy cafés, and breezy
                riverfront parks — with the Atlantic beaches just a quick drive over the causeway.
              </p>
              <p>
                Whether you’re here for a few nights or a few months, Eau Gallie offers an easy rhythm of art, markets,
                live music, and waterfront sunsets — the perfect base for Space Coast adventures.
              </p>
            </div>

            {/* Neighborhood Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-4 rounded-xl">
                <h4 className="font-semibold text-primary mb-2">Arts & Murals</h4>
                <p className="text-sm text-gray-600">
                  EGAD’s open-air art scene with galleries, studios, and 30+ murals a short walk away.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <h4 className="font-semibold text-primary mb-2">Dining & Drinks</h4>
                <p className="text-sm text-gray-600">
                  Rooftops, waterfront seafood, craft brews, and local coffee — all nearby.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <h4 className="font-semibold text-primary mb-2">River & Parks</h4>
                <p className="text-sm text-gray-600">
                  Ballard Park boat ramp, Eau Gallie Pier, and green spaces for sunrise walks.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <h4 className="font-semibold text-primary mb-2">Beach & Access</h4>
                <p className="text-sm text-gray-600">
                  Beaches in ~10–15 min via Eau Gallie Causeway; quick routes to US-1, I-95, and MLB airport.
                </p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden">
            <Image
              src="/6.jpg"
              alt="Eau Gallie neighborhood and riverfront"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}