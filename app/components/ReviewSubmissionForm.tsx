"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import Script from "next/script"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Star, Send, CheckCircle2 } from "lucide-react"
import { MagicCard } from "@/components/ui/magic-card"
import { UNITS } from "@/app/data/units"
import { buildReviewFormSchema, type ReviewFormData } from "@/lib/reviewDelivery"
import confetti from "canvas-confetti"

const REVIEW_ERROR_CODES = [
  "validation_error",
  "captcha_failed",
  "service_unavailable",
  "submission_failed",
  "unknown_error",
] as const

type ReviewErrorCode = (typeof REVIEW_ERROR_CODES)[number]

function resolveReviewErrorCode(value: unknown): ReviewErrorCode {
  if (typeof value === "string" && REVIEW_ERROR_CODES.includes(value as ReviewErrorCode)) {
    return value as ReviewErrorCode
  }
  return "unknown_error"
}

// Star Rating Component
interface StarRatingProps {
  rating: number
  onChange: (rating: number) => void
  label: string
  required?: boolean
  errorId?: string
  invalid?: boolean
  groupRef?: React.Ref<HTMLDivElement>
}

function StarRating({ rating, onChange, label, required = false, errorId, invalid = false, groupRef }: StarRatingProps) {
  const t = useTranslations("reviews.form")
  const [hoverRating, setHoverRating] = useState(0)
  const labelId = useId()

  return (
    <div className="space-y-2">
      <span id={labelId} className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> {t("requiredSuffix")}</span>
          </>
        )}
      </span>
      <div
        ref={groupRef}
        tabIndex={-1}
        className="flex gap-1 focus:outline-none"
        role="group"
        aria-labelledby={labelId}
        aria-describedby={invalid && errorId ? errorId : undefined}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-pressed={rating === star}
            aria-label={t("starLabel", { count: star, category: label })}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="rounded transition-transform hover:scale-110"
          >
            <Star
              aria-hidden="true"
              className={`w-8 h-8 ${
                star <= (hoverRating || rating)
                  ? "text-primary fill-primary"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ReviewSubmissionForm() {
  const t = useTranslations("reviews.form")
  const tRoot = useTranslations()
  const locale = useLocale() === "es" ? "es" : "en"
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const reviewSchema = useMemo(() => buildReviewFormSchema(t), [t])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [overallRating, setOverallRating] = useState(0)
  const [categoryRatings, setCategoryRatings] = useState({
    cleanliness: 0,
    communication: 0,
    location: 0,
    value: 0
  })
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema)
  })

  const overallErrorId = useId()
  const overallRatingGroupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (errors.overallRating && Object.keys(errors).length === 1) {
      overallRatingGroupRef.current?.focus()
    }
  }, [errors])

  const resetTurnstile = () => {
    setTurnstileToken("")
    if (typeof window === "undefined" || !window.turnstile || !turnstileWidgetIdRef.current) {
      return
    }
    window.turnstile.reset(turnstileWidgetIdRef.current)
  }

  const renderTurnstile = () => {
    if (
      typeof window === "undefined" ||
      !window.turnstile ||
      !turnstileContainerRef.current ||
      !siteKey ||
      turnstileWidgetIdRef.current
    ) {
      return
    }

    const options = {
      sitekey: siteKey,
      action: "review",
      language: locale,
      callback: (token: string) => setTurnstileToken(token),
      "expired-callback": resetTurnstile,
      "error-callback": resetTurnstile,
      "timeout-callback": resetTurnstile,
    }

    turnstileWidgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      options as Parameters<NonNullable<Window["turnstile"]>["render"]>[1],
    )
  }

  useEffect(() => {
    renderTurnstile()
  })

  const onSubmit = async (data: ReviewFormData) => {
    if (isSubmitting) {
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    if (!siteKey) {
      setSubmitError(t("errors.service_unavailable"))
      setIsSubmitting(false)
      return
    }

    if (!turnstileToken) {
      setSubmitError(t("errors.captcha_failed"))
      resetTurnstile()
      setIsSubmitting(false)
      return
    }

    const optionalRating = (value: number | undefined) => (value && value >= 1 ? value : undefined)

    try {
      const response = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: data.guestName.trim(),
          email: data.email.trim(),
          propertySlug: data.propertySlug,
          overallRating: data.overallRating,
          cleanliness: optionalRating(data.cleanliness),
          communication: optionalRating(data.communication),
          location: optionalRating(data.location),
          value: optionalRating(data.value),
          reviewText: data.reviewText.trim(),
          stayDate: data.stayDate ?? "",
          locale,
          turnstileToken,
        }),
      })

      let responseBody: unknown = null
      try {
        responseBody = await response.json()
      } catch {
        responseBody = null
      }

      if (!response.ok || !responseBody || typeof responseBody !== "object" || !("ok" in responseBody) || responseBody.ok !== true) {
        const errorCode =
          responseBody && typeof responseBody === "object" && "error" in responseBody
            ? resolveReviewErrorCode(responseBody.error)
            : "unknown_error"
        setSubmitError(t(`errors.${errorCode}`))
        resetTurnstile()
        return
      }

      setIsSuccess(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      setSubmitError(t("errors.unknown_error"))
      resetTurnstile()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverallRatingChange = (rating: number) => {
    setOverallRating(rating)
    setValue("overallRating", rating, { shouldValidate: true })
  }

  const handleCategoryRatingChange = (category: keyof typeof categoryRatings, rating: number) => {
    setCategoryRatings(prev => ({ ...prev, [category]: rating }))
    setValue(category, rating)
  }

  if (isSuccess) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-white">
        <div className="max-w-3xl mx-auto">
          <MagicCard className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <h3 className="text-3xl font-bold text-primary">{t("successHeading")}</h3>
              <p className="text-lg text-gray-600 max-w-md">
                {t("successBody")}
              </p>
            </div>
          </MagicCard>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-white">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer onReady={renderTurnstile} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            {t("heading")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("subheading")}
          </p>
        </div>

        <MagicCard className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Guest Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">{t("sectionInfo")}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labelName")}
                  </label>
                  <input
                    type="text"
                    {...register("guestName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan-ink focus:border-transparent"
                    placeholder={t("placeholderName")}
                  />
                  {errors.guestName && (
                    <p className="mt-1 text-sm text-red-600">{errors.guestName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labelEmail")}
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan-ink focus:border-transparent"
                    placeholder={t("placeholderEmail")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{t("emailPrivacy")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labelProperty")}
                  </label>
                  <select
                    {...register("propertySlug")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan-ink focus:border-transparent"
                  >
                    <option value="">{t("placeholderProperty")}</option>
                    {UNITS.map(unit => (
                      <option key={unit.slug} value={unit.slug}>
                        {tRoot(unit.titleKey)}
                      </option>
                    ))}
                  </select>
                  {errors.propertySlug && (
                    <p className="mt-1 text-sm text-red-600">{errors.propertySlug.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("labelStayDate")}
                  </label>
                  <input
                    type="date"
                    {...register("stayDate")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan-ink focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary">{t("sectionRating")}</h3>

              <div className="bg-tan/5 p-6 rounded-lg">
                <StarRating
                  label={t("labelOverall")}
                  required
                  rating={overallRating}
                  onChange={handleOverallRatingChange}
                  errorId={overallErrorId}
                  invalid={!!errors.overallRating}
                  groupRef={overallRatingGroupRef}
                />
                {errors.overallRating && (
                  <p id={overallErrorId} role="alert" className="mt-2 text-sm text-red-600">
                    {errors.overallRating.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StarRating
                  label={t("labelCleanliness")}
                  rating={categoryRatings.cleanliness}
                  onChange={(rating) => handleCategoryRatingChange("cleanliness", rating)}
                />
                <StarRating
                  label={t("labelCommunication")}
                  rating={categoryRatings.communication}
                  onChange={(rating) => handleCategoryRatingChange("communication", rating)}
                />
                <StarRating
                  label={t("labelLocation")}
                  rating={categoryRatings.location}
                  onChange={(rating) => handleCategoryRatingChange("location", rating)}
                />
                <StarRating
                  label={t("labelValue")}
                  rating={categoryRatings.value}
                  onChange={(rating) => handleCategoryRatingChange("value", rating)}
                />
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("labelReview")}
              </label>
              <textarea
                {...register("reviewText")}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan-ink focus:border-transparent resize-none"
                placeholder={t("placeholderReview")}
              />
              {errors.reviewText && (
                <p className="mt-1 text-sm text-red-600">{errors.reviewText.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{t("reviewHint")}</p>
            </div>

            <div ref={turnstileContainerRef} />

            {submitError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {submitError}
              </p>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-4 bg-tan text-primary font-semibold rounded-lg
                  hover:bg-tan/90 transition-all duration-300 hover:shadow-lg hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t("submit")}
                  </>
                )}
              </button>
            </div>
          </form>
        </MagicCard>
      </div>
    </section>
  )
}
