"use client"

import { useEffect } from "react"

interface BookingIframeProps {
  hospitableId: string
  propertyTitle: string
}

export default function BookingIframe({ hospitableId, propertyTitle }: BookingIframeProps) {
  useEffect(() => {
    function getQueryParams(param: string) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      return urlSearchParams.get(param)
    }

    function updateIframeSrc() {
      const iframe = document.getElementById("booking-iframe") as HTMLIFrameElement
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
      ].filter(Boolean).join("&")

      const base = `https://booking.hospitable.com/widget/9f9d3a07-f287-40dc-bb60-1966173ea154/${hospitableId}`
      iframe.src = params ? `${base}?${params}` : base
    }

    updateIframeSrc()
  }, [hospitableId])

  return (
    <iframe
      id="booking-iframe"
      sandbox="allow-top-navigation allow-scripts allow-same-origin"
      style={{ width: "100%", height: "600px" }}
      frameBorder="0"
      src={`https://booking.hospitable.com/widget/9f9d3a07-f287-40dc-bb60-1966173ea154/${hospitableId}`}
      title={`Book ${propertyTitle}`}
    />
  )
}
