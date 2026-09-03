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

const BUILDING_NAMES = [
  "Pineapple Ave Building",
  "Sea Grape Building 1042",
  "Sea Grape Building 1052",
];

const UNIT_TYPES = ["Product", "Accommodation"];

const BUSINESS_POSTAL_CODE = "32935";

// Independent corroboration for `unit.bedrooms`; see `getCorroboratedBedroomCount`.
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

function getUnitImageUrls(unit: Unit): string[] {
  return Array.from(new Set(unit.images)).map(toAbsoluteUrl);
}

// Hospitable's public booking API exposes no bedroom count, so `unit.bedrooms` is only
// inferred from the listing name (docs/UNITS-SOURCE-OF-TRUTH.md). Publish it only when the
// unit's category independently agrees, and never publish a literal 0 — for the studios
// that value means "no separate bedroom", not a verified count of zero bedrooms.
function getCorroboratedBedroomCount(unit: Unit): number | undefined {
  if (unit.bedrooms <= 0) {
    return undefined;
  }

  return BEDROOMS_BY_CATEGORY[unit.category] === unit.bedrooms ? unit.bedrooms : undefined;
}

function normalizeLocale(locale: string): SupportedLocale {
  return locale === "es" ? "es" : "en";
}

// Deliberately emits no `streetAddress`. The business spans three buildings, so no single
// street describes it, and the per-building streets are not confirmed in this repo —
// docs/UNITS-SOURCE-OF-TRUTH.md records the 2456-vs-2546 Pineapple Ave discrepancy and
// gives no street name for the Sea Grape buildings. Do not add one back unsourced.
function toPostalAddress(postalCode?: string) {
  return {
    "@type": "PostalAddress",
    addressLocality: "Melbourne",
    addressRegion: "FL",
    ...(postalCode === undefined ? {} : { postalCode }),
    addressCountry: "US",
  };
}

function getLocaleRootUrl(locale: SupportedLocale): string {
  return toAbsoluteUrl(`/${locale}`);
}

function getWebSiteId(locale: SupportedLocale): string {
  return `${getLocaleRootUrl(locale)}#website`;
}

// Locale-independent on purpose: /en and /es describe one business, so both must resolve
// to the same `@id`. Only the WebSite/WebPage nodes are locale-scoped.
function getLodgingBusinessId(): string {
  return `${toAbsoluteUrl("/")}#lodging-business`;
}

function getUnitUrl(locale: SupportedLocale, unit: Unit): string {
  return toAbsoluteUrl(`/${locale}/rooms/${unit.slug}`);
}

export function createLodgingBusinessJsonLd(locale: string, t: Translate) {
  const normalizedLocale = normalizeLocale(locale);
  const localeRootUrl = getLocaleRootUrl(normalizedLocale);
  const businessId = getLodgingBusinessId();

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
        url: toAbsoluteUrl("/"),
        address: toPostalAddress(BUSINESS_POSTAL_CODE),
        location: BUILDING_NAMES.map((name) => ({
          "@type": "Place",
          name,
          address: toPostalAddress(),
        })),
        image: [
          toAbsoluteUrl("/Silver_pineapple_logo.png"),
          toAbsoluteUrl("/silver_pineapple_home_update.jpeg"),
        ],
        makesOffer: UNITS.map((unit) => {
          const unitUrl = getUnitUrl(normalizedLocale, unit);
          const [primaryImage] = getUnitImageUrls(unit);

          return {
            ...createUnitOffer(unit, unitUrl),
            itemOffered: {
              "@type": UNIT_TYPES,
              "@id": `${unitUrl}#unit`,
              name: t(unit.titleKey),
              ...(primaryImage === undefined ? {} : { image: primaryImage }),
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
        image: getUnitImageUrls(unit),
        brand: {
          "@type": "Brand",
          name: BUSINESS_NAME,
        },
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: unit.maxGuests,
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
