"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

export default function AboutCTA() {
  const t = useTranslations("about.cta")

  return (
    <section className="py-20 px-4 bg-sunset-beach">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-tan/10 to-tan/5 rounded-3xl p-12 md:p-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
            {t("heading")}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("body")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rooms"
              className="bg-tan hover:bg-tan/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {t("buttonRooms")}
            </Link>
            <Link
              href="/"
              className="bg-white border-2 border-tan text-tan hover:bg-tan hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {t("buttonBook")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
