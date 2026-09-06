"use client"

import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { useState } from "react"
import { MAP_MARKERS } from "@/app/data/mapMarkers"
import type { UnitPhoto } from "@/app/data/units"
import { photoSrcSet } from "@/lib/photos"

/**
 * "Where you'll be" — the location band on the unit page.
 *
 * Two fact cards (arts district, riverfront) and the existing site-wide
 * map. Location cards only use photos explicitly labelled `area`; they do
 * not fall back to interior photos, which would misrepresent what the card
 * is describing when a unit has not yet received room labels.
 *
 * The map is shared across all units today (one marker for the property
 * at the Eau Gallie centre), so per-unit pins would be a separate change
 * if/when the captain supplies coordinates. The component is honest about
 * this in the caption.
 *
 * The map is loaded only when the guest clicks "Show map" — Leaflet is
 * ~150kB and the lazy load keeps the unit page's initial bundle lean.
 */

// CRITICAL: ssr: false prevents "window is not defined" error with Leaflet
const MapWrapper = dynamic(() => import("./MapWrapper"), {
  ssr: false,
})

export default function UnitLocation({
  address,
  photos,
  unitTitle,
}: {
  address: string
  photos: UnitPhoto[]
  unitTitle: string
}) {
  const t = useTranslations("unitPage.location")
  const [mapOpen, setMapOpen] = useState(false)

  const areaPhotos = photos.filter((p) => p.room === "area").slice(0, 2)
  const [card1, card2] = areaPhotos

  return (
    <section id="location" className="scroll-mt-20 border-t border-primary/10 py-8">
      <header className="mb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
          {t("heading")}
        </h2>
        <p className="mt-1 text-sm text-primary/70">
          {t("subheading", { address })}
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
          {card1 ? (
            <div className="aspect-[4/3] overflow-hidden bg-primary/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card1.src}
                srcSet={photoSrcSet(card1.src)}
                sizes="(min-width: 768px) 33vw, 100vw"
                alt={t("areaPhotoAlt", { title: unitTitle, number: 1 })}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="p-4">
            <div className="text-sm font-bold text-primary">{t("artsTitle")}</div>
            <p className="mt-1 text-xs leading-relaxed text-primary/75">{t("artsBody")}</p>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
          {card2 ? (
            <div className="aspect-[4/3] overflow-hidden bg-primary/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card2.src}
                srcSet={photoSrcSet(card2.src)}
                sizes="(min-width: 768px) 33vw, 100vw"
                alt={t("areaPhotoAlt", { title: unitTitle, number: 2 })}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <div className="p-4">
            <div className="text-sm font-bold text-primary">{t("riverTitle")}</div>
            <p className="mt-1 text-xs leading-relaxed text-primary/75">{t("riverBody")}</p>
          </div>
        </article>

        <article className="flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white">
          <div className="relative aspect-[4/3] overflow-hidden bg-coastal-mist">
            {mapOpen ? (
              <MapWrapper markers={MAP_MARKERS} />
            ) : (
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="flex h-full w-full flex-col items-center justify-center gap-2 text-tan-hover transition hover:bg-coastal-foam/40 focus-visible:bg-coastal-foam/40"
                aria-label={t("showMap")}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span className="text-xs font-semibold">{t("showMap")}</span>
              </button>
            )}
          </div>
          <div className="p-4">
            <div className="text-xs text-primary/65">{t("mapNote")}</div>
          </div>
        </article>
      </div>
    </section>
  )
}
