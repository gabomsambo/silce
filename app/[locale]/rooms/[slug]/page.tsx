import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import BookingIframe from "../../../components/BookingIframe";
import UnitGallery from "../../../components/UnitGallery";
import UnitFacts from "../../../components/UnitFacts";
import UnitReviews from "../../../components/UnitReviews";
import UnitLocation from "../../../components/UnitLocation";
import UnitAmenities from "../../../components/UnitAmenities";
import { UNITS } from "../../../data/units";
import {
  buildBathroomsSpec,
  buildBedroomsSpec,
  formatPrice,
  translateBedType,
  type Translate,
} from "../../../data/copy";
import { CATEGORIES } from "../../../data/categories";
import {
  createRoomsBreadcrumbJsonLd,
  createUnitJsonLd,
} from "@/lib/structuredData";
import { SITE_URL } from "@/lib/site";
import { BUSINESS_CONTACT } from "@/app/data/contact";
import { Link } from "@/i18n/navigation";

// Generate static params for all rooms in both locales
export function generateStaticParams() {
  const locales = ["en", "es"];
  const params = [];

  for (const locale of locales) {
    for (const unit of UNITS) {
      params.push({
        locale,
        slug: unit.slug,
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
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }

  const t = await getTranslations({ locale, namespace: "propertyDetail.templates" });
  const tRoot = await getTranslations({ locale });
  const title = tRoot(unit.titleKey);
  const pageUrl = `${SITE_URL}/${locale}/rooms/${slug}`;

  // Build translated description using template
  const metaDescription = t("metaDescription", {
    title,
    maxGuests: unit.maxGuests,
    bathrooms: unit.bathrooms,
    price: formatPrice(unit.priceFrom, locale),
  });

  const ogDescription = t("ogDescription", {
    maxGuests: unit.maxGuests,
    bathrooms: unit.bathrooms,
    price: formatPrice(unit.priceFrom, locale),
  });

  return {
    title,
    description: metaDescription,
    keywords: [
      unit.category,
      "vacation rental",
      "Melbourne FL",
      "Eau Gallie",
      // Same rule as the JSON-LD: never publish a zero-bedroom claim.
      // See `getCorroboratedBedroomCount` in lib/structuredData.ts.
      ...(unit.bedrooms > 0 ? [`${unit.bedrooms} bedroom`] : []),
      "short-term rental",
      "Florida vacation",
    ],
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `/en/rooms/${slug}`,
        es: `/es/rooms/${slug}`,
        "x-default": `/en/rooms/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: `${title} | Silver Pineapple`,
      description: ogDescription,
      siteName: "Silver Pineapple",
      locale: locale === "es" ? "es_ES" : "en_US",
      images:
        unit.images.length > 0
          ? [
              {
                url: unit.images[0].src,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : [
              {
                url: "/og-rooms.jpg",
                width: 1200,
                height: 630,
                alt: "Silver Pineapple Properties",
              },
            ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Silver Pineapple`,
      description: ogDescription,
      images: unit.images.length > 0 ? [unit.images[0].src] : ["/og-rooms.jpg"],
    },
  };
}

function UnitTitleBlock({
  unit,
  locale,
  tRoot,
  categoryName,
}: {
  unit: (typeof UNITS)[number]
  locale: string
  tRoot: Translate
  categoryName: string
}) {
  const t = tRoot
  const title = t(unit.titleKey)
  const price = formatPrice(unit.priceFrom, locale)
  const specs = [
    buildBedroomsSpec(unit.bedrooms, t),
    t("propertyDetail.templates.specsGuests", { maxGuests: unit.maxGuests }),
    buildBathroomsSpec(unit.bathrooms, t),
    translateBedType(unit.bedType, t),
    unit.squareFootage
      ? t(
          unit.squareFootage.approximate
            ? "unitPage.titleBlock.squareFootageApprox"
            : "unitPage.titleBlock.squareFootageExact",
          { value: unit.squareFootage.value }
        )
      : null,
  ].filter(Boolean)

  return (
    <section className="bg-sand-fade pb-2 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-3 text-xs text-primary/70"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href="/rooms"
                className="hover:text-tan-hover"
              >
                {t("unitPage.breadcrumb.rooms")}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>{categoryName}</li>
            <li aria-hidden="true">›</li>
            <li className="font-semibold text-primary">{title}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-primary md:text-4xl">
              {title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {specs.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border border-primary/15 bg-white px-3 py-1 text-xs font-medium text-primary"
                >
                  {s}
                </span>
              ))}
              <span className="text-primary/30" aria-hidden="true">|</span>
              <span className="text-xs text-primary/75">
                {t("unitPage.titleBlock.locationLabel")}
              </span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-tan-ink">
              {t("unitPage.titleBlock.from")}
            </div>
            <div className="text-2xl font-extrabold leading-tight tracking-tight text-primary md:text-3xl">
              {price}
              <span className="ml-1 text-sm font-medium text-primary/65">
                {t("unitPage.titleBlock.perNight")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params;
  const property = UNITS.find((p) => p.slug === slug);
  if (!property) notFound();

  const t = await getTranslations({ locale, namespace: "propertyDetail.templates" });
  const tRoot = await getTranslations({ locale });
  const title = tRoot(property.titleKey);
  const unitJsonLd = createUnitJsonLd(locale, property, tRoot);
  const breadcrumbJsonLd = createRoomsBreadcrumbJsonLd(locale, tRoot, property);

  // Pull the category name for the breadcrumb so the unit page can read
  // "Rooms › Studio — Compact › Unit 2528" without hard-coding either.
  const categoryName = tRoot(CATEGORIES[property.category].nameKey);

  return (
    <main className="min-h-screen bg-sand-fade">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(unitJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      {/* Title block — ABOVE the mosaic, Expedia / Navan placement */}
      <UnitTitleBlock
        unit={property}
        locale={locale}
        tRoot={tRoot}
        categoryName={categoryName}
      />

      {/* Photo gallery */}
      <section className="bg-sand-fade pb-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <UnitGallery
            images={property.images}
            title={title}
          />
        </div>
      </section>

      {/* Body: details + sticky booking */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Info column */}
            <div className="lg:col-span-2">
              <UnitFacts
                unit={property}
                tRoot={tRoot}
              />

              {/* Amenities — section divider for visual rhythm */}
              <div className="mt-8 border-t border-primary/10 pt-8">
                <UnitAmenities amenities={property.amenities} />
              </div>

              {/* Reviews */}
              <div className="mt-2">
                <UnitReviews slug={property.slug} />
              </div>

              {/* Location */}
              <UnitLocation
                address={BUSINESS_CONTACT.location}
                coordinates={property.coordinates}
              />
            </div>

            {/* Booking column */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="relative rounded-2xl border border-primary/10 bg-white p-6 shadow-lg">
                  <div className="mb-5">
                    <div className="text-2xl font-extrabold text-primary">
                      {t("pricing", { price: formatPrice(property.priceFrom, locale) })}
                    </div>
                  </div>
                  <div className="booking-widget-container">
                    <BookingIframe
                      hospitableId={property.hospitable_id}
                      propertyTitle={title}
                      locale={locale}
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
