"use client"

import { Palette, Waves, UtensilsCrossed, Leaf, Rocket, Music } from "lucide-react"
import Image from "next/image"
import { MagicCard } from "@/components/ui/magic-card"
import MapWrapper from "./MapWrapper"
import { MAP_MARKERS, EAU_GALLIE_CENTER } from "@/app/data/mapMarkers"

export default function DiscoverLocationSection() {
  const highlights = [
    {
      icon: Palette,
      title: "Arts & Culture",
      description: "30+ vibrant murals and 50+ galleries in the historic Eau Gallie Arts District (EGAD)",
      color: "text-purple-600"
    },
    {
      icon: Waves,
      title: "Beach Access",
      description: "10-15 minute drive to pristine Atlantic beaches via the scenic Eau Gallie Causeway",
      color: "text-blue-600"
    },
    {
      icon: UtensilsCrossed,
      title: "Dining & Drinks",
      description: "Waterfront dining, craft breweries, and local cafés steps from your door",
      color: "text-orange-600"
    },
    {
      icon: Leaf,
      title: "Nature & Wildlife",
      description: "Indian River Lagoon home to 700+ dolphins, sea turtle nesting beaches, and scenic trails",
      color: "text-green-600"
    },
    {
      icon: Rocket,
      title: "Space Exploration",
      description: "Kennedy Space Center just 50 minutes north - witness launches from the Space Coast",
      color: "text-red-600"
    },
    {
      icon: Music,
      title: "Nightlife & Events",
      description: "Live music, weekly art walks, and year-round festivals in a walkable historic district",
      color: "text-pink-600"
    }
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            DISCOVER EAU GALLIE & THE SPACE COAST
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your gateway to Florida's vibrant arts scene, pristine beaches, and legendary space exploration
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">

          {/* Left Column - Narrative + Highlights */}
          <div className="space-y-8">
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Welcome to <span className="font-semibold text-primary">Eau Gallie</span> (pronounced "oh-GAL-ee"),
                Melbourne's creative heart. Named for the colorful coquina rocks found in the shallow waters, this
                historic riverfront neighborhood has evolved into one of Florida's most vibrant arts communities.
              </p>
              <p>
                From your doorstep, wander the <span className="font-semibold">Eau Gallie Arts District</span> with
                its 30+ outdoor murals, 50+ galleries and boutiques, craft breweries like Intracoastal Brewing Company,
                and waterfront dining. Cross the scenic causeway to reach pristine Atlantic beaches in just 10-15 minutes,
                or venture north to witness rocket launches from Kennedy Space Center.
              </p>
              <p>
                Whether you're here for art walks and live music, dolphin watching on the Indian River Lagoon, or
                exploring the Space Coast's natural beauty, Eau Gallie offers the perfect base for an unforgettable
                Florida experience.
              </p>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-tan/10 rounded-lg">
                <div className="text-3xl font-bold text-tan mb-1">10 min</div>
                <div className="text-sm text-gray-600">to Atlantic Beaches</div>
              </div>
              <div className="text-center p-4 bg-tan/10 rounded-lg">
                <div className="text-3xl font-bold text-tan mb-1">50+</div>
                <div className="text-sm text-gray-600">Galleries & Murals</div>
              </div>
              <div className="text-center p-4 bg-tan/10 rounded-lg">
                <div className="text-3xl font-bold text-tan mb-1">50 min</div>
                <div className="text-sm text-gray-600">to Kennedy Space Center</div>
              </div>
              <div className="text-center p-4 bg-tan/10 rounded-lg">
                <div className="text-3xl font-bold text-tan mb-1">700+</div>
                <div className="text-sm text-gray-600">Dolphins in Lagoon</div>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Map */}
          <div className="relative">
            <MagicCard className="p-4">
              <div className="w-full h-[500px]">
                <MapWrapper
                  markers={MAP_MARKERS}
                  center={EAU_GALLIE_CENTER}
                  zoom={12}
                />
              </div>
            </MagicCard>
          </div>
        </div>

        {/* Highlights Grid */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
            What Makes This Location Special
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <MagicCard key={index} className="p-6 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-white to-muted ${highlight.color} bg-opacity-10`}>
                      <Icon className={`w-8 h-8 ${highlight.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-lg mb-2">{highlight.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
                    </div>
                  </div>
                </MagicCard>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 text-lg">
            Ready to experience the best of Florida's Space Coast?
          </p>
          <a
            href="/rooms"
            className="inline-block px-8 py-4 bg-tan text-white font-semibold rounded-lg
            hover:bg-tan/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Explore Our Properties
          </a>
        </div>
      </div>
    </section>
  )
}
