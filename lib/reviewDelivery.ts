import { z } from "zod"

export const REVIEW_TURNSTILE_ACTION = "review"

const optionalRating = z.number().int().min(1).max(5).optional()

export function createReviewSubmissionSchema(propertySlugs: readonly string[]) {
  const allowedSlugs = new Set(propertySlugs)

  return z.object({
    guestName: z.string().trim().min(2).max(50),
    email: z.string().trim().email().max(320),
    propertySlug: z.string().trim().refine((slug) => allowedSlugs.has(slug)),
    overallRating: z.number().int().min(1).max(5),
    cleanliness: optionalRating,
    communication: optionalRating,
    location: optionalRating,
    value: optionalRating,
    reviewText: z.string().trim().min(50).max(500),
    stayDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]).optional(),
    locale: z.enum(["en", "es"]),
    turnstileToken: z.string().trim().min(1).max(2048),
  })
}

export type ReviewSubmission = z.infer<ReturnType<typeof createReviewSubmissionSchema>>

export function propertyTitleForSlug(slug: string, titles: Record<string, { title?: string } | undefined>): string {
  const title = titles[slug]?.title?.trim()
  return title || slug
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim()
}

function rated(value: number | undefined): string {
  return typeof value === "number" ? `${value}/5` : "Not rated"
}

export function buildReviewMessage(
  submission: ReviewSubmission,
  propertyTitle: string,
): { subject: string; text: string } {
  const stayDate = submission.stayDate ? submission.stayDate : "Not provided"
  const subject = oneLine(
    `Guest review (${submission.locale.toUpperCase()}) — ${propertyTitle} — ${submission.guestName}`,
  )
  const text = [
    "A guest sent a review note from the Silver Pineapple website.",
    "Notes from this form are delivered by email only and are not posted on the site.",
    "",
    `Name: ${submission.guestName}`,
    `Email: ${submission.email}`,
    `Property: ${propertyTitle}`,
    `Property slug: ${submission.propertySlug}`,
    `Stay date: ${stayDate}`,
    `Page language: ${submission.locale}`,
    "",
    `Overall: ${submission.overallRating}/5`,
    `Cleanliness: ${rated(submission.cleanliness)}`,
    `Communication: ${rated(submission.communication)}`,
    `Location: ${rated(submission.location)}`,
    `Value: ${rated(submission.value)}`,
    "",
    "Review:",
    submission.reviewText,
  ].join("\n")

  return { subject, text }
}
