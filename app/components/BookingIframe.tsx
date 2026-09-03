"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"

const WIDGET_ORIGIN = "https://booking.hospitable.com"

interface BookingIframeProps {
  hospitableId: string
  propertyTitle: string
  locale?: string
}

export default function BookingIframe({ hospitableId, propertyTitle, locale = "en" }: BookingIframeProps) {
  const t = useTranslations("propertyDetail")

  useEffect(() => {
    function getQueryParams(param: string) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      return urlSearchParams.get(param)
    }

    const iframe = document.getElementById("booking-iframe") as HTMLIFrameElement | null

    function updateIframeSrc() {
      if (!iframe) return

      const checkin = getQueryParams("checkin")
      const checkout = getQueryParams("checkout")
      const adults = getQueryParams("adults")
      const children = getQueryParams("children")
      const infants = getQueryParams("infants")
      const pets = getQueryParams("pets")

      const params = [
        checkin && `checkin=${checkin}`,
        checkout && `checkout=${checkout}`,
        adults && `adults=${adults}`,
        children && `children=${children}`,
        infants && `infants=${infants}`,
        pets && `pets=${pets}`,
        // Hospitable's widget loader forwards `locale` alongside the stay
        // parameters; the current widget build reads its language from the
        // postMessage handshake below, so we send both.
        `locale=${locale}`,
      ].filter(Boolean).join("&")

      const base = `${WIDGET_ORIGIN}/widget/9f9d3a07-f287-40dc-bb60-1966173ea154/${hospitableId}`
      iframe.src = params ? `${base}?${params}` : base
    }

    // The widget asks its parent for a language on boot
    // (`GET_HOSPITABLE_LANGUAGE`) and switches when the parent answers with
    // `SET_HOSPITABLE_LANGUAGE`. Without this the checkout always renders in
    // English, whatever locale the surrounding page is in.
    function sendLanguage() {
      iframe?.contentWindow?.postMessage(
        { type: "SET_HOSPITABLE_LANGUAGE", language: locale },
        WIDGET_ORIGIN
      )
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== WIDGET_ORIGIN) return
      if (event.data?.type === "GET_HOSPITABLE_LANGUAGE") sendLanguage()
    }

    window.addEventListener("message", handleMessage)
    iframe?.addEventListener("load", sendLanguage)
    updateIframeSrc()

    return () => {
      window.removeEventListener("message", handleMessage)
      iframe?.removeEventListener("load", sendLanguage)
    }
  }, [hospitableId, locale])

  // `allow-forms` and `allow-popups` in the sandbox below are load-bearing: without
  // them the guest cannot submit the Hospitable booking form, even though the widget
  // itself renders fine — the failure is silent.
  return (
    <iframe
      id="booking-iframe"
      sandbox="allow-top-navigation allow-scripts allow-same-origin allow-forms allow-popups"
      style={{ width: "100%", height: "600px" }}
      frameBorder="0"
      src={`${WIDGET_ORIGIN}/widget/9f9d3a07-f287-40dc-bb60-1966173ea154/${hospitableId}?locale=${locale}`}
      title={t("bookingIframeTitle", { title: propertyTitle })}
    />
  )
}
