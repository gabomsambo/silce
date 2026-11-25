"use client"

import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import Script from "next/script"
import { useLocale, useTranslations } from "next-intl"
import { CheckCircle2, LoaderCircle, Send } from "lucide-react"
import { BUSINESS_CONTACT } from "@/app/data/contact"
import { CONTACT_LIMITS, CONTACT_TURNSTILE_ACTION } from "@/lib/contactDelivery"

type SubmissionStatus = "idle" | "submitting" | "success" | "error"

const SUBMIT_TIMEOUT_MS = 30_000
const TOKEN_WAIT_MS = 12_000

// The spam check is on every page (the form lives in the footer), so its script is
// fetched only once a visitor starts using the form, not on every page view.
export default function ContactForm() {
  const t = useTranslations("footer.contactForm")
  const locale = useLocale() === "es" ? "es" : "en"
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const [status, setStatus] = useState<SubmissionStatus>("idle")
  const [armed, setArmed] = useState(false)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetIdRef = useRef<string | null>(null)
  const turnstileTokenRef = useRef("")

  const resetTurnstile = useCallback(() => {
    turnstileTokenRef.current = ""
    if (window.turnstile && turnstileWidgetIdRef.current) {
      window.turnstile.reset(turnstileWidgetIdRef.current)
    }
  }, [])

  const renderTurnstile = useCallback(() => {
    if (!window.turnstile || !turnstileContainerRef.current || !siteKey || turnstileWidgetIdRef.current) {
      return
    }
    const options = {
      sitekey: siteKey,
      action: CONTACT_TURNSTILE_ACTION,
      language: locale,
      theme: "dark",
      // Stays out of sight unless Cloudflare needs the visitor to do something.
      appearance: "interaction-only",
      callback: (token: string) => {
        turnstileTokenRef.current = token
      },
      "expired-callback": resetTurnstile,
      "error-callback": resetTurnstile,
      "timeout-callback": resetTurnstile,
    }
    turnstileWidgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      options as Parameters<NonNullable<Window["turnstile"]>["render"]>[1],
    )
  }, [locale, resetTurnstile, siteKey])

  // The script may already be on the page (home page newsletter form), in which
  // case Script's onReady does not fire for this component.
  useEffect(() => {
    if (armed) renderTurnstile()
  }, [armed, renderTurnstile])

  const waitForToken = async (): Promise<string> => {
    const deadline = Date.now() + TOKEN_WAIT_MS
    while (!turnstileTokenRef.current && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return turnstileTokenRef.current
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "submitting") return
    setStatus("submitting")

    const form = event.currentTarget
    const fields = new FormData(form)
    const controller = new AbortController()
    const timeoutHandle = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)

    try {
      if (!siteKey) throw new Error("Turnstile site key is not configured")
      const turnstileToken = await waitForToken()
      if (!turnstileToken) throw new Error("Spam check did not finish")

      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          message: fields.get("message"),
          honey: fields.get("_honey"),
          pageUrl: window.location.href,
          locale,
          turnstileToken,
        }),
        signal: controller.signal,
      })

      // Success is shown only when the server says Resend accepted the email.
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.error || `Contact endpoint returned ${response.status}`)
      }

      form.reset()
      setStatus("success")
    } catch (error) {
      console.error("Contact form delivery failed", error)
      setStatus("error")
    } finally {
      clearTimeout(timeoutHandle)
      // A Turnstile token is single use, so every attempt needs a fresh one.
      resetTurnstile()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={() => setArmed(true)}
      className="mt-6 space-y-4"
      noValidate={false}
    >
      {armed && siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
          onReady={renderTurnstile}
        />
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-gray-200">
            {t("nameLabel")}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name}
            className="w-full rounded border border-white/25 bg-white/10 px-3 py-2.5 text-white outline-none placeholder:text-gray-400 focus:border-tan focus:ring-2 focus:ring-tan/30"
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-gray-200">
            {t("emailLabel")}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={CONTACT_LIMITS.email}
            className="w-full rounded border border-white/25 bg-white/10 px-3 py-2.5 text-white outline-none placeholder:text-gray-400 focus:border-tan focus:ring-2 focus:ring-tan/30"
            placeholder={t("emailPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-gray-200">
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          maxLength={CONTACT_LIMITS.message}
          className="w-full resize-y rounded border border-white/25 bg-white/10 px-3 py-2.5 text-white outline-none placeholder:text-gray-400 focus:border-tan focus:ring-2 focus:ring-tan/30"
          placeholder={t("messagePlaceholder")}
        />
      </div>

      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div ref={turnstileContainerRef} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-tan px-5 py-2.5 font-semibold text-primary transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          {status === "submitting" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "submitting" ? t("sending") : t("submit")}
        </button>

        <div className="min-h-6 text-sm" aria-live="polite">
          {status === "success" && (
            <p className="flex items-center gap-2 text-green-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {t("success")}
            </p>
          )}
          {status === "error" && (
            <p className="text-red-200">
              {t("error")}{" "}
              <a className="font-semibold underline underline-offset-2" href={`mailto:${BUSINESS_CONTACT.email}`}>
                {BUSINESS_CONTACT.email}
              </a>
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
