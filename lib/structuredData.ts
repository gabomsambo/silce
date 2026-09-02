import { type CategoryKey } from "@/app/data/categories";
import type { Translate } from "@/app/data/copy";
import { UNITS, type Unit } from "@/app/data/units";
import { toAbsoluteUrl } from "@/lib/site";

type SupportedLocale = "en" | "es";

const BUSINESS_NAME = "Silver Pineapple";

const LANGUAGE_BY_LOCALE: Record<SupportedLocale, string> = {
  en: "en-US",
  es: "es-ES",
};

const BREADCRUMB_LABELS: Record<SupportedLocale, { home: string; rooms: string }> = {
  en: { home: "Home", rooms: "Rooms" },
  es: { home: "Inicio", rooms: "Alojamientos" },
};

const BUILDING_ADDRESSES = [
  "2546 Pineapple Ave",
  "1042 Sea Grape",
  "1052 Sea Grape",
];

const UNIT_TYPES = ["Product", "Accommodation"];

const BEDROOMS_BY_CATEGORY: Record<CategoryKey, number> = {
  "studio-compact": 0,
  "studio-comfort": 0,
  "studio-plus": 0,
  "one-bed-1-bath": 1,
  "two-bed-1-bath": 2,
};

interface BreadcrumbItem {
  name: string;
  path: string;
}

function createUnitOffer(unit: Unit, unitUrl: string) {
  return {
    "@type": "Offer",
    price: unit.priceFrom,
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      minPrice: unit.priceFrom,
      priceCurrency: "USD",
      unitCode: "DAY",
    },
    url: unitUrl,
    availability: "https://schema.org/InStock",
  };
}

function getCorroboratedBedroomCount(unit: Unit): number | undefined {
  return BEDROOMS_BY_CATEGORY[unit.category] === unit.bedrooms ? unit.bedrooms : undefined;
}

function normalizeLocale(locale: string): SupportedLocale {
  return locale === "es" ? "es" : "en";
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

function getLocaleRootUrl(locale: SupportedLocale): string {
  return toAbsoluteUrl(`/${locale}`);
}

function getWebSiteId(locale: SupportedLocale): string {
  return `${getLocaleRootUrl(locale)}#website`;
}

function getLodgingBusinessId(locale: SupportedLocale): string {
  return `${getLocaleRootUrl(locale)}#lodging-business`;
}

function getUnitUrl(locale: SupportedLocale, unit: Unit): string {
  return toAbsoluteUrl(`/${locale}/rooms/${unit.slug}`);
}

export function createLodgingBusinessJsonLd(locale: string, t: Translate) {
  const normalizedLocale = normalizeLocale(locale);
  const localeRootUrl = getLocaleRootUrl(normalizedLocale);
  const businessId = getLodgingBusinessId(normalizedLocale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": getWebSiteId(normalizedLocale),
        name: BUSINESS_NAME,
        url: localeRootUrl,
        inLanguage: LANGUAGE_BY_LOCALE[normalizedLocale],
        publisher: { "@id": businessId },
      },
      {
        "@type": "LodgingBusiness",
        "@id": businessId,
        name: BUSINESS_NAME,
        url: localeRootUrl,
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
          const unitUrl = getUnitUrl(normalizedLocale, unit);

          return {
            ...createUnitOffer(unit, unitUrl),
            itemOffered: {
              "@type": UNIT_TYPES,
              "@id": `${unitUrl}#unit`,
              name: t(unit.titleKey),
            },
          };
        }),
      },
    ],
  };
}

export function createUnitJsonLd(locale: string, unit: Unit, t: Translate) {
  const normalizedLocale = normalizeLocale(locale);
  const unitUrl = getUnitUrl(normalizedLocale, unit);
  const unitId = `${unitUrl}#unit`;
  const bedrooms = getCorroboratedBedroomCount(unit);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${unitUrl}#webpage`,
        name: t(unit.titleKey),
        url: unitUrl,
        inLanguage: LANGUAGE_BY_LOCALE[normalizedLocale],
        isPartOf: { "@id": getWebSiteId(normalizedLocale) },
        breadcrumb: { "@id": `${unitUrl}#breadcrumb` },
        mainEntity: { "@id": unitId },
      },
      {
        "@type": UNIT_TYPES,
        "@id": unitId,
        name: t(unit.titleKey),
        url: unitUrl,
        image: Array.from(new Set(unit.images)).map(toAbsoluteUrl),
        brand: {
          "@type": "Brand",
          name: BUSINESS_NAME,
        },
        occupancy: {
          "@type": "QuantitativeValue",
          value: unit.maxGuests,
          unitCode: "C62",
        },
        ...(bedrooms === undefined ? {} : { numberOfBedrooms: bedrooms }),
        numberOfBathroomsTotal: unit.bathrooms,
        offers: createUnitOffer(unit, unitUrl),
      },
    ],
  };
}

function createBreadcrumbJsonLd(pageUrl: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function createRoomsBreadcrumbJsonLd(locale: string, t: Translate, unit?: Unit) {
  const normalizedLocale = normalizeLocale(locale);
  const labels = BREADCRUMB_LABELS[normalizedLocale];
  const items: BreadcrumbItem[] = [
    { name: labels.home, path: `/${normalizedLocale}` },
    { name: labels.rooms, path: `/${normalizedLocale}/rooms` },
  ];

  if (unit) {
    items.push({ name: t(unit.titleKey), path: `/${normalizedLocale}/rooms/${unit.slug}` });
  }

  return createBreadcrumbJsonLd(toAbsoluteUrl(items[items.length - 1].path), items);
}
