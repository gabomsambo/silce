/** Stable interest ids from `BoutiqueNewsletterSignup` checkboxes. */
export const NEWSLETTER_INTEREST_IDS = [
  "new-studios",
  "local-tips",
  "special-offers",
  "seasonal",
] as const

export type NewsletterInterestId = (typeof NEWSLETTER_INTEREST_IDS)[number]

const KNOWN_INTERESTS = new Set<string>(NEWSLETTER_INTEREST_IDS)

/** Resend contact property keys (must be declared via scripts/resend-setup-properties.mjs). */
export const RESEND_NEWSLETTER_PROPERTY_KEYS = {
  locale: "locale",
  interests: "newsletter_interests",
} as const

export function normalizeNewsletterLocale(value: unknown): "en" | "es" {
  return value === "es" ? "es" : "en"
}

export function sanitizeNewsletterInterests(value: unknown): NewsletterInterestId[] {
  if (!Array.isArray(value)) {
    return []
  }

  const seen = new Set<string>()
  const result: NewsletterInterestId[] = []

  for (const item of value) {
    if (typeof item !== "string") {
      continue
    }
    const id = item.trim()
    if (!KNOWN_INTERESTS.has(id) || seen.has(id)) {
      continue
    }
    seen.add(id)
    result.push(id as NewsletterInterestId)
  }

  return result
}

/** Comma-separated stable ids for Resend (custom properties accept only string, number, or null). */
export function serializeNewsletterInterests(interests: readonly NewsletterInterestId[]): string {
  return interests.join(",")
}

export function buildNewsletterResendProperties(params: {
  locale?: unknown
  interests?: unknown
}): Record<string, string> {
  const properties: Record<string, string> = {}

  if (params.locale !== undefined) {
    properties[RESEND_NEWSLETTER_PROPERTY_KEYS.locale] = normalizeNewsletterLocale(params.locale)
  }

  if (params.interests !== undefined) {
    const interestIds = sanitizeNewsletterInterests(params.interests)
    properties[RESEND_NEWSLETTER_PROPERTY_KEYS.interests] = serializeNewsletterInterests(interestIds)
  }

  return properties
}
