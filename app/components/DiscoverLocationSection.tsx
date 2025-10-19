"use client"

import { Palette, Waves, UtensilsCrossed, Leaf, Rocket, Music } from "lucide-react"
import Image from "next/image"
import { MagicCard } from "@/components/ui/magic-card"
import MapWrapper from "./MapWrapper"
import { MAP_MARKERS, EAU_GALLIE_CENTER } from "@/app/data/mapMarkers"
import { useTranslations } from "next-intl"

export default function DiscoverLocationSection() {
  const t = useTranslations("discoverLocation")

  const highlights = [
    {
      icon: Palette,
      title: t("highlights.arts.title"),
      description: t("highlights.arts.description"),
      color: "text-purple-600"
    },
    {
      icon: Waves,
      title: t("highlights.beach.title"),
      description: t("highlights.beach.description"),
      color: "text-blue-600"
    },
    {
      icon: UtensilsCrossed,
      title: t("highlights.dining.title"),
      description: t("highlights.dining.description"),
      color: "text-orange-600"
    },
    {
      icon: Leaf,
      title: t("highlights.nature.title"),
      description: t("highlights.nature.description"),
      color: "text-green-600"
    },
    {
      icon: Rocket,
      title: t("highlights.space.title"),
      description: t("highlights.space.description"),
      color: "text-red-600"
    },
    {
      icon: Music,
      title: t("highlights.nightlife.title"),
      description: t("highlights.nightlife.description"),
      color: "text-pink-600"
    }
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-coastal-mist/40 via-white via-60% to-coastal-dune/20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight">
            {t("mainHeading")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("introText")}
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">

          {/* Left Column - Narrative + Highlights */}
          <div className="space-y-8">
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                {t("welcome")}
              </p>
              <p>
                {t("fromDoorstep")}
              </p>
              <p>
                {t("whetherHere")}
              </p>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-tan/10 rounded-lg">
                <div className="text-3xl font-bold text-tan mb-1">{t("stats.beaches.value")}</div>
                <div className="text-sm text-gray-600">{t("stats.beaches.label")}</div>
              </div>
              <div className="text-center p-4 bg-tan/10 rounded-lg">
                <div className="text-3xl font-bold text-tan mb-1">{t("stats.galleries.value")}</div>
                <div className="text-sm text-gray-600">{t("stats.galleries.label")}</div>
              </div>
              <div className="text-center p-4 bg-tan/10 rounded-lg">
                <div className="text-3xl font-bold text-tan mb-1">{t("stats.spaceCenter.value")}</div>
                <div className="text-sm text-gray-600">{t("stats.spaceCenter.label")}</div>
              </div>
              <div className="text-center p-4 bg-tan/10 rounded-lg">
                <div className="text-3xl font-bold text-tan mb-1">{t("stats.dolphins.value")}</div>
                <div className="text-sm text-gray-600">{t("stats.dolphins.label")}</div>
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
            {t("sectionHeading")}
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
            {t("ready")}
          </p>
          <a
            href="/rooms"
            className="inline-block px-8 py-4 bg-tan text-white font-semibold rounded-lg
            hover:bg-tan/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            {t("ctaButton")}
          </a>
        </div>
      </div>
    </section>
  )
}
