import type { Metadata } from 'next'
import { notFound } from "next/navigation"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import BookingIframe from "../../components/BookingIframe"
import { BorderBeam } from "@/components/ui/border-beam"
import { UNITS } from "../../data/units"
import { buildUnitLongDescription, formatPrice } from "../../data/copy"

// Configure this route to use Edge Runtime for Cloudflare Pages compatibility
export const runtime = 'edge'

// CRITICAL: Next.js 15 requires async params
interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // CRITICAL: MUST await params in Next.js 15
  const { slug } = await params
  const unit = UNITS.find((u) => u.slug === slug)

  if (!unit) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverpineapple.net'
  const pageUrl = `${baseUrl}/rooms/${slug}`

  return {
    title: unit.title,  // Uses template from layout: "Unit 2528 | Silver Pineapple"
    description: `${unit.title} in Melbourne, FL. Sleeps ${unit.maxGuests}, ${unit.bedrooms} bedroom, ${unit.bathrooms} bath. From ${formatPrice(unit.priceFrom)}/night.`,
    keywords: [
      unit.category,
      'vacation rental',
      'Melbourne FL',
      'Eau Gallie',
      `${unit.bedrooms} bedroom`,
      'short-term rental',
      'Florida vacation',
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: `${unit.title} | Silver Pineapple`,
      description: `Sleeps ${unit.maxGuests} · ${unit.bedrooms} bed · ${unit.bathrooms} bath · From ${formatPrice(unit.priceFrom)}/night`,
      siteName: 'Silver Pineapple',
      images: unit.images.length > 0 ? [
        {
          url: unit.images[0],  // Use first property photo as OG image
          width: 1200,
          height: 630,
          alt: unit.title,
        }
      ] : [
        {
          url: '/og-rooms.jpg',  // Fallback to generic rooms image
          width: 1200,
          height: 630,
          alt: 'Silver Pineapple Properties',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${unit.title} | Silver Pineapple`,
      description: `Sleeps ${unit.maxGuests} · From ${formatPrice(unit.priceFrom)}/night`,
      images: unit.images.length > 0 ? [unit.images[0]] : ['/og-rooms.jpg'],
    },
  }
}

// CRITICAL: Page component also needs async params
export default async function PropertyPage({ params }: Props) {
  const { slug } = await params  // MUST await
  const property = UNITS.find(p => p.slug === slug)
  if (!property) notFound()

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
                    <BookingIframe
                      hospitableId={property!.hospitable_id}
                      propertyTitle={property!.title}
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