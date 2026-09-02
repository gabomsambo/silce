import type { Translate } from "@/app/data/copy";
import { UNITS, type Unit } from "@/app/data/units";

type SupportedLocale = "en" | "es";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://silverpineapple.net";
const BUSINESS_NAME = "Silver Pineapple";

const LANGUAGE_BY_LOCALE: Record<SupportedLocale, string> = {
  en: "en-US",
  es: "es-ES",
};

const BUILDING_ADDRESSES = [
  "2546 Pineapple Ave",
  "1042 Sea Grape",
  "1052 Sea Grape",
];

interface BreadcrumbItem {
  name: string;
  path: string;
}

function normalizeLocale(locale: string): SupportedLocale {
  return locale === "es" ? "es" : "en";
}

function toAbsoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

function toPostalAddress(streetAddress: string) {
  return {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality: "Melbourne",
    addressRegion: "FL",
    addressCountry: "US",
  };
}

export function getLocaleRootUrl(locale: string): string {
  return toAbsoluteUrl(`/${normalizeLocale(locale)}`);
}

export function createLodgingBusinessJsonLd(locale: string, t: Translate) {
  const normalizedLocale = normalizeLocale(locale);
  const localeRootUrl = getLocaleRootUrl(normalizedLocale);

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${localeRootUrl}#lodging-business`,
    name: BUSINESS_NAME,
    url: localeRootUrl,
    inLanguage: LANGUAGE_BY_LOCALE[normalizedLocale],
    address: toPostalAddress(BUILDING_ADDRESSES[0]),
    location: BUILDING_ADDRESSES.map((streetAddress) => ({
      "@type": "Place",
      address: toPostalAddress(streetAddress),
    })),
    image: [
      toAbsoluteUrl("/Silver_pineapple_logo.png"),
      toAbsoluteUrl("/silver_pineapple_home_update.jpeg"),
    ],
    makesOffer: UNITS.map((unit) => {
      const unitUrl = toAbsoluteUrl(`/${normalizedLocale}/rooms/${unit.slug}`);

      return {
        "@type": "Offer",
        price: unit.priceFrom,
        priceCurrency: "USD",
        url: unitUrl,
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Product",
          "@id": `${unitUrl}#unit`,
          name: t(unit.titleKey),
          inLanguage: LANGUAGE_BY_LOCALE[normalizedLocale],
        },
      };
    }),
  };
}

export function createUnitJsonLd(locale: string, unit: Unit, t: Translate) {
  const normalizedLocale = normalizeLocale(locale);
  const unitPath = `/${normalizedLocale}/rooms/${unit.slug}`;
  const unitUrl = toAbsoluteUrl(unitPath);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${unitUrl}#unit`,
    name: t(unit.titleKey),
    url: unitUrl,
    inLanguage: LANGUAGE_BY_LOCALE[normalizedLocale],
    image: unit.images.map((imagePath) => toAbsoluteUrl(imagePath)),
    brand: {
      "@type": "Brand",
      name: BUSINESS_NAME,
    },
    offers: {
      "@type": "Offer",
      price: unit.priceFrom,
      priceCurrency: "USD",
      url: unitUrl,
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "maxGuests", value: unit.maxGuests },
      { "@type": "PropertyValue", name: "bedrooms", value: unit.bedrooms },
      { "@type": "PropertyValue", name: "bathrooms", value: unit.bathrooms },
    ],
  };
}

export function createBreadcrumbJsonLd(locale: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: LANGUAGE_BY_LOCALE[normalizeLocale(locale)],
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}
