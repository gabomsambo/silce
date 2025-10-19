"use client"

import { Heart, Zap, MapPin, Shield } from "lucide-react"
import { useTranslations } from "next-intl"

export default function PhilosophySection() {
  const t = useTranslations("about.philosophy")

  const philosophies = [
    {
      icon: Heart,
      title: t("comfort.title"),
      description: t("comfort.description"),
    },
    {
      icon: Zap,
      title: t("seamless.title"),
      description: t("seamless.description"),
    },
    {
      icon: MapPin,
      title: t("local.title"),
      description: t("local.description"),
    },
    {
      icon: Shield,
      title: t("trusted.title"),
      description: t("trusted.description"),
    },
  ]

  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">{t("heading")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {philosophies.map((philosophy, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-tan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-tan/20 transition-colors duration-300">
                <philosophy.icon className="w-10 h-10 text-tan" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{philosophy.title}</h3>
              <p className="text-gray-600 leading-relaxed">{philosophy.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}