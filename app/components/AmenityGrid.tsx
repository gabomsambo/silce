"use client"

import { Wifi, Key, Clock, Car, Coffee, Tv2, Wind, WashingMachine } from "lucide-react"
import { useTranslations } from "next-intl"

export default function AmenityGrid() {
  const t = useTranslations("rooms.amenities")

  const amenities = [
    { icon: Wifi,  title: t("list.wifi.title"),   description: t("list.wifi.description") },
    { icon: Key,   title: t("list.keyless.title"),      description: t("list.keyless.description") },
    { icon: Clock, title: t("list.checkin.title"),      description: t("list.checkin.description") },
    { icon: Car,   title: t("list.parking.title"),            description: t("list.parking.description") },
    { icon: WashingMachine, title: t("list.laundry.title"), description: t("list.laundry.description") },
    { icon: Coffee, title: t("list.coffee.title"),      description: t("list.coffee.description") },
    { icon: Tv2,   title: t("list.tv.title"),           description: t("list.tv.description") },
    { icon: Wind,  title: t("list.ac.title"),      description: t("list.ac.description") },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-coastal-teal/10 to-coastal-foam/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">{t("heading")}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((A, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-tan/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <A.icon className="w-8 h-8 text-tan" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">{A.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{A.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}