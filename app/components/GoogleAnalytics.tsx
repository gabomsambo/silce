"use client"

import { useEffect, useState } from "react"
import Script from 'next/script'
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_UPDATED_EVENT,
  readCookieConsent,
} from "./cookieConsent"

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_ANALYTICS_ID
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const syncConsent = () => {
      setIsAllowed(readCookieConsent() === "accepted")
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === COOKIE_CONSENT_STORAGE_KEY) {
        syncConsent()
      }
    }

    syncConsent()
    window.addEventListener("storage", handleStorage)
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncConsent)
    }
  }, [])

  if (!measurementId || !isAllowed) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  )
}
