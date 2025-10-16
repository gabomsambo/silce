"use client"

import { useEffect } from "react"
import { notFound } from "next/navigation"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { BorderBeam } from "@/components/ui/border-beam"
import { UNITS } from "../../data/units"
import { buildUnitLongDescription, formatPrice } from "../../data/copy"

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const property = UNITS.find(p => p.slug === params.slug)
  if (!property) notFound()

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
      const base = `https://booking.hospitable.com/widget/9f9d3a07-f287-40dc-bb60-1966173ea154/${property!.hospitable_id}`
      ;(iframe.src as any) = params ? `${base}?${params}` : base
    }
    updateIframeSrc()
  }, [property?.hospitable_id])

  return (
    <main className="min-h-screen bg-sand-fade">
      <Navbar />

      {/* Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-[60vh]">
          {property!.images.map((image, i) => (
            <div key={i} className={`relative overflow-hidden ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}>
              <img src={image} alt={`${property!.title} - Image ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{property!.title}</h1>
                <div className="flex items-center gap-6 text-gray-600 mb-6">
                  <span>{property!.maxGuests} guests</span>
                  <span>•</span>
                  <span>{property!.bedrooms} bedroom{property!.bedrooms !== 1 ? "s" : ""}</span>
                  <span>•</span>
                  <span>{property!.bathrooms} bathroom{property!.bathrooms !== 1 ? "s" : ""}</span>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {buildUnitLongDescription(property!)}
                </p>
              </div>

              {/* Amenities (from unit + category defaults, if you want) */}
              {/* Minimal example: */}
              {/* You can render your amenity icons here if you maintain an amenity list on each unit. */}
            </div>

            {/* Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <BorderBeam size={200} duration={8} colorFrom="#9c40ff" colorTo="#ffaa40" />
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">
                      From {formatPrice(property!.priceFrom)}/night
                    </div>
                  </div>
                  <div className="booking-widget-container">
                    <iframe
                      id="booking-iframe"
                      sandbox="allow-top-navigation allow-scripts allow-same-origin"
                      style={{ width: "100%", height: "600px" }}
                      frameBorder="0"
                      src={`https://booking.hospitable.com/widget/9f9d3a07-f287-40dc-bb60-1966173ea154/${property!.hospitable_id}`}
                      title={`Book ${property!.title}`}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}