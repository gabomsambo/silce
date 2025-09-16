import Link from "next/link"
import Image from "next/image"
import { formatPrice, buildUnitShortDescription } from "../data/copy"
import type { CategoryMeta } from "../data/categories"
import type { Unit } from "../data/units"

export default function RoomCategorySection({ category, units }: { category: CategoryMeta, units: Unit[] }) {
  if (!units.length) return null
  const featured = units[0]

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                {category.name}
              </h2>
              {category.badge && (
                <span className="text-xs font-semibold bg-tan/15 text-tan px-2.5 py-1 rounded-full">
                  {category.badge}
                </span>
              )}
            </div>
            <p className="text-gray-700 mt-3 max-w-2xl">{category.blurb}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {category.defaultAmenities.map((a, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Grid: featured + other units */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured large card */}
          <Link href={`/rooms/${featured.slug}`} className="group relative rounded-2xl overflow-hidden border border-gray-200">
            <div className="relative h-72">
              <Image src={featured.images[0] || "/placeholder.svg"} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-semibold text-gray-900">{featured.title}</h3>
                <div className="text-tan font-semibold">{formatPrice(featured.priceFrom)}/night</div>
              </div>
              <p className="text-sm text-gray-600">{buildUnitShortDescription(featured)}</p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-tan group-hover:underline">
                View details & book →
              </div>
            </div>
          </Link>

          {/* Other units (tiles) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {units.slice(1).map((u) => (
              <Link key={u.slug} href={`/rooms/${u.slug}`} className="group relative rounded-2xl overflow-hidden border border-gray-200">
                <div className="relative h-56">
                  <Image src={u.images[0] || "/placeholder.svg"} alt={u.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{u.title}</h4>
                    <div className="text-tan font-semibold text-sm">{formatPrice(u.priceFrom)}/night</div>
                  </div>
                  <p className="text-xs text-gray-600">{buildUnitShortDescription(u)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}