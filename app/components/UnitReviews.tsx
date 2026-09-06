"use client"

import { useMemo } from "react"
import { Star } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  getReviewsByProperty,
  getReviewsSortedByDate,
  PLATFORM_STATS,
} from "@/app/data/reviews"

/**
 * Per-unit reviews block on the unit page.
 *
 * Three honesty rules (all from the report):
 *   1. The count is always exact and always adjacent to any number.
 *      Never rounded up.
 *   2. Below the threshold there is no averaged headline at all.
 *      "5.0 from 2 reviews" is technically true and functionally a lie.
 *      At < AVG_THRESHOLD reviews, the headline becomes the count and
 *      the distribution, and all reviews are shown.
 *   3. Reviews are ordered newest first, never "best first". Picking the
 *      strongest is selection, and this site shipped fabricated reviews
 *      once already.
 *
 * Threshold: AVG_THRESHOLD = 4. Verified counts (snapshot 2026-09-06):
 *   19, 18, 12, 10, 10, 10, 9, 8, 8, 5, 4, 3, 2.
 *   4 means the count line is shown whenever the average would be too
 *   thin to defend. Affected units today: sea-grape-102 (2) and
 *   sea-grape-201 (3).
 *
 * "See all N reviews" is an explicit escape hatch to `/reviews?property=…`.
 * The reviews page reads the same `property` query (see ReviewsDisplay
 * `searchParams` wiring) so the link lands pre-filtered.
 */
const AVG_THRESHOLD = 4
const PAGE_SHOW_COUNT = 4

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`shrink-0 ${
            i < rating ? "fill-tan-ink text-tan-ink" : "text-primary/20"
          }`}
          style={{ width: size, height: size }}
        />
      ))}
    </span>
  )
}

export default function UnitReviews({ slug }: { slug: string }) {
  const t = useTranslations("unitPage.reviews")
  const locale = useLocale()

  const reviews = useMemo(
    () => getReviewsSortedByDate().filter((r) => r.propertySlug === slug),
    [slug],
  )
  const count = reviews.length
  const enough = count >= AVG_THRESHOLD

  const distribution = useMemo(() => {
    const buckets: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    for (const r of reviews) {
      const k = Math.max(1, Math.min(5, Math.round(r.overallRating)))
      buckets[k] = (buckets[k] ?? 0) + 1
    }
    return [5, 4, 3, 2, 1]
      .map((s) => ({ stars: s, count: buckets[s] ?? 0 }))
      .filter((b) => b.count > 0)
  }, [reviews])

  const avg = useMemo(() => {
    if (count === 0) return null
    const sum = reviews.reduce((acc, r) => acc + r.overallRating, 0)
    return sum / count
  }, [reviews, count])

  // Below the threshold we render every review we have; above, only the
  // PAGE_SHOW_COUNT most recent (the rest are reachable from /reviews).
  const visibleReviews = useMemo(
    () => (enough ? reviews.slice(0, PAGE_SHOW_COUNT) : reviews),
    [reviews, enough],
  )

  // Empty state: the only honest number is the property-wide average.
  if (count === 0) {
    const platform = PLATFORM_STATS[0]
    return (
      <section id="reviews" className="scroll-mt-20 border-t border-primary/10 py-8">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
          {t("heading")}
        </h2>
        <div className="rounded-2xl border border-primary/10 bg-white p-5">
          <p className="text-base font-semibold text-primary">{t("noneHeading")}</p>
          <p className="mt-2 text-sm leading-relaxed text-primary/75">
            {t("noneBody", { total: platform.reviews, rating: platform.rating.toFixed(2) })}{" "}
            <Link
              href={{ pathname: "/reviews", query: { property: slug } }}
              className="font-semibold text-tan-hover underline-offset-2 hover:underline"
            >
              {t("readAllLink")} →
            </Link>
          </p>
          <p className="mt-3 text-[11px] text-primary/50">{t("platformSource")}</p>
        </div>
      </section>
    )
  }

  const distLine = distribution.map((b) => `${b.count} × ${b.stars}★`).join(", ")

  return (
    <section id="reviews" className="scroll-mt-20 border-t border-primary/10 py-8">
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
        {t("heading")}
      </h2>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {enough && avg !== null ? (
          <>
            <div className="flex items-baseline gap-3">
              <span
                className="text-4xl font-extrabold leading-none tracking-tight text-primary tabular-nums"
                aria-hidden="true"
              >
                {avg.toFixed(1)}
              </span>
              <div>
                <StarRow rating={5} size={15} />
                <div className="mt-1 text-sm text-primary/75 tabular-nums">
                  {count} {count === 1 ? "review" : "reviews"} · {distLine}
                </div>
              </div>
            </div>
            <div className="hidden h-9 w-px bg-primary/10 sm:block" aria-hidden="true" />
          </>
        ) : (
          <div>
            <div className="text-lg font-extrabold tracking-tight text-primary">
              {count} {count === 1 ? "review" : "reviews"} · {distLine}
            </div>
            <div className="mt-1 text-sm text-primary/70">
              {t("lowVolumeHeading")} — {t("lowVolumeSubheading")}
            </div>
          </div>
        )}
        <div className="ml-auto text-right text-xs leading-relaxed text-primary/65">
          <div>{t("verifiedNote")}</div>
          <div>{t("snapshotNote", { date: t("snapshotDate") })}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {visibleReviews.map((r) => (
          <article
            key={r.id}
            className="flex flex-col gap-2 rounded-2xl border border-primary/10 bg-white p-4"
          >
            <header className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tan/20 text-sm font-bold text-tan-hover"
                aria-hidden="true"
              >
                {r.guestName.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-primary">{r.guestName}</div>
                <div className="text-[11px] text-primary/65">
                  {new Date(r.date).toLocaleDateString(locale, {
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · Airbnb
                </div>
              </div>
              <div className="ml-auto shrink-0">
                <StarRow rating={r.overallRating} />
              </div>
            </header>
            <p
              className="text-sm leading-relaxed text-primary/85"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 6,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {r.text}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5">
        {enough ? (
          <Link
            href={{ pathname: "/reviews", query: { property: slug } }}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/20 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            {count === 1 ? t("seeAllSingular") : t("seeAll", { count })} →
          </Link>
        ) : (
          <p className="text-xs text-primary/65">{t("lowVolumeFooter")}</p>
        )}
      </div>
    </section>
  )
}