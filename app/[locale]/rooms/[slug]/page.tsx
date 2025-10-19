import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import BookingIframe from "../../../components/BookingIframe";
import { BorderBeam } from "@/components/ui/border-beam";
import { UNITS } from "../../../data/units";
import { buildUnitLongDescription, formatPrice } from "../../../data/copy";

// Generate static params for all rooms in both locales
export function generateStaticParams() {
  const locales = ['en', 'es'];
  const params = [];

  for (const locale of locales) {
    for (const unit of UNITS) {
      params.push({
        locale,
        slug: unit.slug
      });
    }
  }

  return params;
}

// CRITICAL: Next.js 15 requires async params
interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // CRITICAL: MUST await params in Next.js 15
  const { locale, slug } = await params;
  const unit = UNITS.find((u) => u.slug === slug);

  if (!unit) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    };
  }

  const t = await getTranslations({ locale, namespace: 'propertyDetail.templates' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverpineapple.net';
  const pageUrl = `${baseUrl}/${locale}/rooms/${slug}`;

  // Build translated description using template
  const metaDescription = t('metaDescription', {
    title: unit.title,
    maxGuests: unit.maxGuests,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    price: formatPrice(unit.priceFrom)
  });

  const ogDescription = t('ogDescription', {
    maxGuests: unit.maxGuests,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    price: formatPrice(unit.priceFrom)
  });

  return {
    title: unit.title,
    description: metaDescription,
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
      languages: {
        'en': `/en/rooms/${slug}`,
        'es': `/es/rooms/${slug}`
      }
    },
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: `${unit.title} | Silver Pineapple`,
      description: ogDescription,
      siteName: 'Silver Pineapple',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      images: unit.images.length > 0 ? [
        {
          url: unit.images[0],
          width: 1200,
          height: 630,
          alt: unit.title,
        }
      ] : [
        {
          url: '/og-rooms.jpg',
          width: 1200,
          height: 630,
          alt: 'Silver Pineapple Properties',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${unit.title} | Silver Pineapple`,
      description: ogDescription,
      images: unit.images.length > 0 ? [unit.images[0]] : ['/og-rooms.jpg'],
    },
  };
}

// CRITICAL: Page component also needs async params
export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params;
  const property = UNITS.find(p => p.slug === slug);
  if (!property) notFound();

  const t = await getTranslations({ locale, namespace: 'propertyDetail.templates' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return (
    <main className="min-h-screen bg-sand-fade">
      <Navbar />

      {/* Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-[60vh]">
          {property.images.map((image, i) => (
            <div key={i} className={`relative overflow-hidden ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}>
              <img src={image} alt={`${property.title} - Image ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{property.title}</h1>
                <div className="flex items-center gap-6 text-gray-600 mb-6">
                  <span>{t('specsGuests', { maxGuests: property.maxGuests })}</span>
                  <span>•</span>
                  <span>
                    {property.bedrooms === 1
                      ? t('specsBedrooms', { bedrooms: property.bedrooms })
                      : t('specsBedroomsPlural', { bedrooms: property.bedrooms })
                    }
                  </span>
                  <span>•</span>
                  <span>
                    {property.bathrooms === 1
                      ? t('specsBathrooms', { bathrooms: property.bathrooms })
                      : t('specsBathroomsPlural', { bathrooms: property.bathrooms })
                    }
                  </span>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {buildUnitLongDescription(property)}
                </p>
              </div>
            </div>

            {/* Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <BorderBeam size={200} duration={8} colorFrom="#9c40ff" colorTo="#ffaa40" />
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">
                      {t('pricing', { price: formatPrice(property.priceFrom) })}
                    </div>
                  </div>
                  <div className="booking-widget-container">
                    <BookingIframe
                      hospitableId={property.hospitable_id}
                      propertyTitle={property.title}
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
  );
}
