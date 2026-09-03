"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star, Send, CheckCircle2 } from "lucide-react"
import { MagicCard } from "@/components/ui/magic-card"
import { UNITS } from "@/app/data/units"
import confetti from "canvas-confetti"

// Zod validation schema. Built from the active translator so validation
// messages follow the page locale like every other string on the form.
type Translate = (key: string) => string

const buildReviewSchema = (t: Translate) => z.object({
  guestName: z.string()
    .min(2, t("validation.nameMin"))
    .max(50, t("validation.nameMax")),
  email: z.string()
    .email(t("validation.email")),
  propertySlug: z.string()
    .min(1, t("validation.property")),
  overallRating: z.number()
    .min(1, t("validation.rating"))
    .max(5),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  reviewText: z.string()
    .min(50, t("validation.reviewMin"))
    .max(500, t("validation.reviewMax")),
  stayDate: z.string().optional()
})

type ReviewFormData = z.infer<ReturnType<typeof buildReviewSchema>>

// Star Rating Component
interface StarRatingProps {
  rating: number
  onChange: (rating: number) => void
  label: string
}

function StarRating({ rating, onChange, label }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoverRating || rating)
                  ? "text-tan fill-tan"
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
  const reviewSchema = useMemo(() => buildReviewSchema(t), [t])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [overallRating, setOverallRating] = useState(0)
  const [categoryRatings, setCategoryRatings] = useState({
    cleanliness: 0,
    communication: 0,
    location: 0,
    value: 0
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema)
  })

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual Formspree endpoint or API
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Success state
      setIsSuccess(true)

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        reset()
        setOverallRating(0)
        setCategoryRatings({
          cleanliness: 0,
          communication: 0,
          location: 0,
          value: 0
        })
      }, 3000)

    } catch (error) {
      console.error("Error submitting review:", error)
      alert(t("errorAlert"))
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent"
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
                  rating={overallRating}
                  onChange={handleOverallRatingChange}
                />
                {errors.overallRating && (
                  <p className="mt-2 text-sm text-red-600">{errors.overallRating.message}</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tan focus:border-transparent resize-none"
                placeholder={t("placeholderReview")}
              />
              {errors.reviewText && (
                <p className="mt-1 text-sm text-red-600">{errors.reviewText.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{t("reviewHint")}</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-4 bg-tan text-white font-semibold rounded-lg
                  hover:bg-tan/90 transition-all duration-300 hover:shadow-lg hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
