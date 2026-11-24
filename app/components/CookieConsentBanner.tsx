"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  ANALYTICS_ENABLED,
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

  if (!ANALYTICS_ENABLED || !isHydrated || consent !== null) {
    return null
  }

  // A compact bottom bar: it must leave the hero and the Book Now button visible on a
  // phone. The pointer-events-none wrapper around a pointer-events-auto card keeps it from
  // swallowing clicks on the sticky booking column of a room page. z-40 also keeps it under
  // the Hospitable widget overlays, which globals.css pins at z-index 2147483647 so their
  // calendars and dropdowns stay reachable while it shows.
  return (
    <aside aria-label={t("title")} className="fixed inset-x-0 bottom-0 z-40 p-2 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur-sm sm:mx-auto sm:max-w-3xl sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <p className="flex-1 text-sm leading-snug text-gray-700">
          {t("description")}{" "}
          <Link href="/privacy" className="font-medium text-tan-hover underline underline-offset-4 hover:text-primary">
            {t("privacyLink")}
          </Link>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
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
