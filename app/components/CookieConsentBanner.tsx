"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_UPDATED_EVENT,
  type CookieConsentChoice,
  readCookieConsent,
  writeCookieConsent,
} from "./cookieConsent"

export default function CookieConsentBanner() {
  const t = useTranslations("cookieConsent")
  const [isHydrated, setIsHydrated] = useState(false)
  const [consent, setConsent] = useState<CookieConsentChoice | null>(null)

  useEffect(() => {
    const syncConsent = () => {
      setConsent(readCookieConsent())
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === COOKIE_CONSENT_STORAGE_KEY) {
        syncConsent()
      }
    }

    syncConsent()
    setIsHydrated(true)
    window.addEventListener("storage", handleStorage)
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent)
    }
  }, [])

  const handleConsent = (choice: CookieConsentChoice) => {
    writeCookieConsent(choice)
    setConsent(choice)
  }

  if (!isHydrated || consent !== null) {
    return null
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 p-4 pointer-events-none">
      <div className="pointer-events-auto w-full sm:max-w-md rounded-xl border border-gray-200 bg-white/95 p-5 shadow-xl backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-primary mb-2">{t("title")}</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{t("description")}</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{t("iframeNotice")}</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => handleConsent("declined")}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </aside>
  )
}
