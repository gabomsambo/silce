"use client"

import { type ChangeEvent, type FormEvent, useRef, useState } from "react"
import Script from "next/script"
import { Mail, Heart, Star, Gift, MapPin, Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { MagicCard } from "@/components/ui/magic-card"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string
          action: string
          callback: (token: string) => void
          "expired-callback": () => void
          "error-callback": () => void
          "timeout-callback": () => void
        }
      ) => string
      reset: (widgetId: string) => void
    }
  }
}

type SubmissionOutcome = "subscribed" | "already_subscribed"

const UI_COPY = {
  en: {
    alreadySubscribedHeading: "You're Already on Our List",
    alreadySubscribedBody: "We'll keep sharing personal recommendations, local tips, and family offers with care.",
    submitErrorByCode: {
      validation_error: "Please review your details and try again.",
      captcha_failed: "Please complete the security check and try again.",
      service_unavailable: "Newsletter signup is temporarily unavailable. Please try again shortly.",
      submission_failed: "We couldn't save your signup just now. Please try again.",
      unknown_error: "Something went wrong while saving your signup. Please try again.",
    },
  },
  es: {
    alreadySubscribedHeading: "Ya Estabas en Nuestra Lista",
    alreadySubscribedBody: "Seguiremos compartiendo recomendaciones personales, consejos locales y ofertas familiares con el mismo cuidado.",
    submitErrorByCode: {
      validation_error: "Revise sus datos e intente de nuevo.",
      captcha_failed: "Complete la verificación de seguridad e intente nuevamente.",
      service_unavailable: "El registro al boletín no está disponible en este momento. Inténtelo de nuevo en breve.",
      submission_failed: "No pudimos guardar su registro en este momento. Inténtelo nuevamente.",
      unknown_error: "Hubo un problema al guardar su registro. Inténtelo de nuevo.",
    },
  },
} as const

type ApiErrorCode = keyof (typeof UI_COPY)["en"]["submitErrorByCode"]

function resolveApiErrorCode(value: unknown): ApiErrorCode {
  if (
    value === "validation_error" ||
    value === "captcha_failed" ||
    value === "service_unavailable" ||
    value === "submission_failed" ||
    value === "unknown_error"
  ) {
    return value
  }

  return "unknown_error"
}


export default function BoutiqueNewsletterSignup() {
  const t = useTranslations("newsletter")
  const locale = useLocale() === "es" ? "es" : "en"
  const uiCopy = UI_COPY[locale]
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    interests: [] as string[],
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionOutcome, setSubmissionOutcome] = useState<SubmissionOutcome | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const confettiRef = useRef<ConfettiRef>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetTurnstile = () => {
    setTurnstileToken("")
    if (typeof window === "undefined" || !window.turnstile || !turnstileWidgetIdRef.current) {
      return
    }

    window.turnstile.reset(turnstileWidgetIdRef.current)
  }

  const renderTurnstile = () => {
    if (typeof window === "undefined" || !window.turnstile || !turnstileContainerRef.current || !siteKey || turnstileWidgetIdRef.current) {
      return
    }

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: siteKey,
      action: "newsletter",
      callback: (token: string) => setTurnstileToken(token),
      "expired-callback": resetTurnstile,
      "error-callback": resetTurnstile,
      "timeout-callback": resetTurnstile,
    })
  }

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((item) => item !== value)
        : [...prev.interests, value],
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isSubmitting) {
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    if (!siteKey) {
      setSubmitError(uiCopy.submitErrorByCode.service_unavailable)
      setIsSubmitting(false)
      return
    }

    if (!turnstileToken) {
      setSubmitError(uiCopy.submitErrorByCode.captcha_failed)
      resetTurnstile()
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          email: formData.email.trim(),
          interests: formData.interests,
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

      if (!response.ok) {
        const errorCode =
          responseBody && typeof responseBody === "object" && "error" in responseBody
            ? resolveApiErrorCode(responseBody.error)
            : "unknown_error"
        setSubmitError(uiCopy.submitErrorByCode[errorCode])
        resetTurnstile()
        return
      }

      if (
        responseBody === null ||
        typeof responseBody !== "object" ||
        !("ok" in responseBody) ||
        responseBody.ok !== true ||
        !("outcome" in responseBody) ||
        (responseBody.outcome !== "subscribed" && responseBody.outcome !== "already_subscribed")
      ) {
        setSubmitError(uiCopy.submitErrorByCode.unknown_error)
        resetTurnstile()
        return
      }

      const outcome = responseBody.outcome

      setSubmissionOutcome(outcome)
      setIsSubmitted(true)

      if (outcome === "subscribed") {
        confettiRef.current?.fire({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    } catch (error) {
      console.error("Newsletter signup failed", error)
      setSubmitError(uiCopy.submitErrorByCode.unknown_error)
      resetTurnstile()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Boutique family business benefits
  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: t("benefits.personal.title"),
      description: t("benefits.personal.description")
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: t("benefits.discounts.title"),
      description: t("benefits.discounts.description")
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t("benefits.tips.title"),
      description: t("benefits.tips.description")
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: t("benefits.hospitality.title"),
      description: t("benefits.hospitality.description")
    }
  ]

  // Simple interest options
  const interests = [
    { id: "new-studios", label: t("form.interests.studios") },
    { id: "local-tips", label: t("form.interests.experiences") },
    { id: "special-offers", label: t("form.interests.discounts") },
    { id: "seasonal", label: t("form.interests.seasonal") }
  ]



  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-to-br from-coastal-sunrise/10 to-coastal-teal/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/6.jpg')] bg-cover bg-center opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <MagicCard className="p-12 bg-white/90 backdrop-blur-md">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">
                {submissionOutcome === "already_subscribed" ? uiCopy.alreadySubscribedHeading : t("headingSuccess")}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {submissionOutcome === "already_subscribed" ? uiCopy.alreadySubscribedBody : t("bodySuccess1")}
              </p>
              {submissionOutcome === "subscribed" && (
                <div className="mt-8 p-4 bg-tan/10 rounded-lg">
                  <p className="text-sm text-gray-700">{t("bodySuccess2")}</p>
                </div>
              )}
            </MagicCard>
          </div>
        </div>
        <Confetti ref={confettiRef} manualstart={true} className="fixed inset-0 pointer-events-none z-50" />
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-br from-coastal-sunrise/10 to-coastal-teal/5 relative overflow-hidden">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer onReady={renderTurnstile} />
      <div className="absolute inset-0 bg-[url('/6.jpg')] bg-cover bg-center opacity-5" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Personal Touch */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              {t("headingJoin")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("bodyIntro")}
            </p>
          </div>



          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Benefits Section */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-8">{t("headingSpecial")}</h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-tan/10 rounded-lg flex items-center justify-center text-tan-ink">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signup Form */}
            <div>
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-200 p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-tan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-tan-ink" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">{t("headingStayConnected")}</h3>
                    <p className="text-gray-600">{t("bodyCta")}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 bg-white text-gray-900">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        {t("form.labelFirstName")}
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 bg-white text-gray-900 ${
                          focusedField === "firstName"
                            ? "border-tan-ink ring-2 ring-tan-ink/20 shadow-lg"
                            : "border-gray-300 hover:border-tan-ink/50"
                        }`}
                        placeholder={t("form.placeholderFirstName")}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t("form.labelEmail")}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 bg-white text-gray-900 ${
                          focusedField === "email"
                            ? "border-tan-ink ring-2 ring-tan-ink/20 shadow-lg"
                            : "border-gray-300 hover:border-tan-ink/50"
                        }`}
                        placeholder={t("form.placeholderEmail")}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t("form.labelInterests")}
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {interests.map((interest) => (
                          <label key={interest.id} className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(interest.id)}
                              onChange={() => handleCheckboxChange(interest.id)}
                              className="w-4 h-4 text-tan-ink border-gray-300 rounded focus:ring-tan-ink/20"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                              {interest.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div ref={turnstileContainerRef} />

                    {submitError && (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-tan hover:bg-tan/90 text-primary font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-wait disabled:opacity-70"
                    >
                      {isSubmitting ? `${t("form.buttonSubmit")}...` : t("form.buttonSubmit")}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      {t("privacyText")}
                    </p>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Confetti ref={confettiRef} manualstart={true} className="fixed inset-0 pointer-events-none z-50" />
    </section>
  )
}
