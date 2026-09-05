"use client"

import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { formatPrice, buildUnitShortDescription, buildCategorySleepsCount } from "../data/copy"
import type { CategoryMeta } from "../data/categories"
import type { Unit } from "../data/units"

export default function RoomCategorySection({ category, units }: { category: CategoryMeta, units: Unit[] }) {
  const t = useTranslations()
  const locale = useLocale()
  if (!units.length) return null
  const featured = units[0]
  const sleeps = buildCategorySleepsCount(units)

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                {t(category.nameKey)}
              </h2>
              {category.badgeKey && (
                <span className="text-xs font-semibold bg-tan/15 text-tan px-2.5 py-1 rounded-full">
                  {t(category.badgeKey)}
                </span>
              )}
            </div>
            <p className="text-gray-700 mt-3 max-w-2xl">{t(category.blurbKey)}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {sleeps && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  {t("rooms.categoryAmenities.sleeps", { count: sleeps })}
                </span>
              )}
              {category.defaultAmenities.map((a, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  {t(`rooms.categoryAmenities.${a.key}`, a.values)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Grid: featured + other units */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured large card */}
          <Link href={`/rooms/${featured.slug}`} className="group relative rounded-2xl overflow-hidden border border-gray-200">
            <div className="relative h-72">
              <Image src={featured.images[0] || "/placeholder.svg"} alt={t(featured.titleKey)} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-semibold text-gray-900">{t(featured.titleKey)}</h3>
                <div className="text-tan font-semibold">{formatPrice(featured.priceFrom, locale)}{t("rooms.category.pricingSuffix")}</div>
              </div>
              <p className="text-sm text-gray-600">{buildUnitShortDescription(featured, t)}</p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-tan group-hover:underline">
                {t("rooms.category.ctaLink")} →
              </div>
            </div>
          </Link>

          {/* Other units (tiles) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {units.slice(1).map((u) => (
              <Link key={u.slug} href={`/rooms/${u.slug}`} className="group relative rounded-2xl overflow-hidden border border-gray-200">
                <div className="relative h-56">
                  <Image src={u.images[0] || "/placeholder.svg"} alt={t(u.titleKey)} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{t(u.titleKey)}</h4>
                    <div className="text-tan font-semibold text-sm">{formatPrice(u.priceFrom, locale)}{t("rooms.category.pricingSuffix")}</div>
                  </div>
                  <p className="text-xs text-gray-600">{buildUnitShortDescription(u, t)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}