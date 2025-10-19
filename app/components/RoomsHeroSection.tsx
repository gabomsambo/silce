"use client"

import { useTranslations } from "next-intl"

export default function RoomsHeroSection() {
  const t = useTranslations("rooms.hero")

  return (
    <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-coastal-aqua/15 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight">{t("heading")}</h1>
        <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
          {t("subheading")}
        </p>
      </div>
    </section>
  )
}
