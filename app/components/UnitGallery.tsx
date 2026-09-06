"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { photoSrcSet } from "@/lib/photos"
import PhotoViewer from "./PhotoViewer"
import type { UnitPhoto } from "@/app/data/units"

/**
 * The unit page's photo surface.
 *
 * - Desktop: a bounded 5-tile mosaic (one big + four small), capped at
 *   ~58vh. The last tile carries a "Show all N photos" pill. The pill and
 *   every tile open the same PhotoViewer, opening on the photo that was
 *   clicked (or on photo 1 from the pill).
 * - Mobile: a full-bleed swipe deck with one photo visible at a time, a
 *   "1 / 13" counter pinned bottom-right, and a "Show all" pill that opens
 *   the viewer at photo 1. The mosaic has nowhere to go at 390px, so this
 *   is correct here and only here.
 *
 * The component is a thin client wrapper around `PhotoViewer`. The unit
 * page passes `images: UnitPhoto[]`; we hand the same array to the viewer
 * without copy, because every room label translation lives in the viewer.
 */
export default function UnitGallery({
  images,
  title,
}: {
  images: UnitPhoto[]
  title: string
}) {
  const t = useTranslations("unitPage.gallery")
  const tDetail = useTranslations("propertyDetail.templates")
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerStart, setViewerStart] = useState(0)

  if (images.length === 0) return null

  function openAt(i: number) {
    setViewerStart(i)
    setViewerOpen(true)
  }

  function openFromShowAll() {
    openAt(0)
  }

  const hero = images[0]
  const mosaic = images.slice(1, 5)
  const showAllCount = images.length

  return (
    <>
      {/* Desktop mosaic */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[58vh] max-h-[640px] min-h-[360px]">
          <button
            type="button"
            onClick={() => openAt(0)}
            className="group relative col-span-2 row-span-2 overflow-hidden rounded-l-2xl focus-visible:outline-none"
            aria-label={t("openPhoto", { n: 1, count: showAllCount })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.src}
              srcSet={photoSrcSet(hero.src)}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={tDetail("imageAlt", { title, number: 1 })}
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
          {mosaic.map((p, i) => {
            const n = i + 2
            const isLast = i === mosaic.length - 1
            // Round only the outer corners of the right column, so the
            // 5-tile block reads as one shape.
            const radiusClass =
              i === mosaic.length - 2 && mosaic.length > 1
                ? "rounded-tr-2xl"
                : i === mosaic.length - 1
                  ? "rounded-br-2xl"
                  : ""
            return (
              <button
                key={p.src}
                type="button"
                onClick={() => openAt(n - 1)}
                className={`group relative overflow-hidden focus-visible:outline-none ${radiusClass}`}
                aria-label={t("openPhoto", { n, count: showAllCount })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  srcSet={photoSrcSet(p.src)}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  alt={tDetail("imageAlt", { title, number: n })}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {isLast ? (
                  <span
                    className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg border border-gray-900/40 bg-white px-3 py-2 text-xs font-bold text-gray-900 shadow-md transition group-hover:bg-gray-900 group-hover:text-white"
                    aria-hidden="true"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    <span className="whitespace-nowrap">
                      {t("showAll", { count: showAllCount })}
                    </span>
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
        <div className="mt-1 text-right text-[11px] text-gray-900/70">
          {t("viewAllLabel")}
        </div>
      </div>

      {/* Mobile swipe deck */}
      <div className="md:hidden">
        <div className="relative">
          <div
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory" }}
            onScroll={(e) => {
              const target = e.currentTarget
              const idx = Math.round(target.scrollLeft / target.clientWidth) + 1
              const counter = target.parentElement?.querySelector<HTMLElement>("[data-deck-counter]")
              if (counter) counter.textContent = `${Math.min(Math.max(idx, 1), showAllCount)} / ${showAllCount}`
            }}
          >
            {images.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => openAt(i)}
                className="relative h-72 w-full shrink-0 snap-center overflow-hidden focus-visible:outline-none"
                aria-label={t("openPhoto", { n: i + 1, count: showAllCount })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  srcSet={photoSrcSet(p.src)}
                  sizes="100vw"
                  alt={tDetail("imageAlt", { title, number: i + 1 })}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
          <span
            data-deck-counter
            className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-gray-900/85 px-2.5 py-1 text-[11px] font-bold tabular-nums text-white"
          >
            1 / {showAllCount}
          </span>
          <button
            type="button"
            onClick={openFromShowAll}
            className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-gray-900 shadow-md"
          >
            {t("showAll", { count: showAllCount })}
          </button>
        </div>
      </div>

      <PhotoViewer
        photos={images}
        unitTitle={title}
        open={viewerOpen}
        initialIndex={viewerStart}
        onClose={() => setViewerOpen(false)}
      />
    </>
  )
}
