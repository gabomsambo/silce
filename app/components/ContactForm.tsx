"use client"

import { FormEvent, useState } from "react"
import { useTranslations } from "next-intl"
import { CheckCircle2, LoaderCircle, Send } from "lucide-react"
import { BUSINESS_CONTACT } from "@/app/data/contact"

type SubmissionStatus = "idle" | "submitting" | "success" | "error"

interface FormSubmitResponse {
  success?: boolean | string
  message?: string
}

export default function ContactForm() {
  const t = useTranslations("footer.contactForm")
  const [status, setStatus] = useState<SubmissionStatus>("idle")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("submitting")

    const form = event.currentTarget
    const fields = new FormData(form)

    try {
      const response = await fetch(BUSINESS_CONTACT.formEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          message: fields.get("message"),
          _honey: fields.get("_honey"),
          _subject: "New Silver Pineapple website inquiry",
          _template: "table",
          _url: window.location.href,
        }),
      })
      const result = (await response.json()) as FormSubmitResponse
      const accepted = result.success === true || result.success === "true"

      if (!response.ok || !accepted) {
        throw new Error(result.message || `FormSubmit returned ${response.status}`)
      }

      form.reset()
      setStatus("success")
    } catch (error) {
      console.error("Contact form delivery failed", error)
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate={false}>
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
