"use client"

import { useTranslations } from "next-intl"

export default function UnitAmenities({ amenities }: { amenities?: string[] }) {
  const t = useTranslations("unitPage.amenities")

  if (!amenities || amenities.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-primary/10 bg-white p-6">
      <header className="mb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">{t("heading")}</h2>
        <p className="mt-1 text-sm text-primary/70">{t("subheading")}</p>
      </header>

      <ul className="flex flex-wrap gap-2">
        {amenities.map((amenity) => (
          <li
            key={amenity}
            className="inline-flex items-center rounded-full border border-primary/15 bg-sand-fade px-3 py-1.5 text-xs font-medium text-primary"
          >
            {amenity}
          </li>
        ))}
      </ul>
    </section>
  )
}
