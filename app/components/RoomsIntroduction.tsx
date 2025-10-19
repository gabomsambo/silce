"use client"

import { useTranslations } from "next-intl"

export default function RoomsIntroduction() {
  const t = useTranslations("rooms")

  return (
    <section className="py-16 px-4 bg-transparent">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          {t("introduction")}
        </p>
      </div>
    </section>
  )
}
