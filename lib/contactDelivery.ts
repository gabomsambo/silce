import { z } from "zod"

export const CONTACT_TURNSTILE_ACTION = "contact"

export const CONTACT_LIMITS = {
  name: 100,
  email: 320,
  message: 5000,
} as const

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(CONTACT_LIMITS.name),
  email: z.string().trim().email().max(CONTACT_LIMITS.email),
  message: z.string().trim().min(1).max(CONTACT_LIMITS.message),
  // Hidden spam trap. Real visitors never fill it, so anything in it is a bot.
  honey: z.string().max(200).optional(),
  pageUrl: z.string().trim().max(2048).optional(),
  locale: z.enum(["en", "es"]),
  turnstileToken: z.string().trim().min(1).max(2048),
})

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim()
}

export function buildContactMessage(submission: ContactSubmission): { subject: string; text: string } {
  const name = oneLine(submission.name)
  const subject = oneLine(`New Silver Pineapple website inquiry (${submission.locale.toUpperCase()}) — ${name}`)
  const text = [
    "A guest sent a message from the Silver Pineapple website contact form.",
    "Reply to this email to answer them directly.",
    "",
    `Name: ${name}`,
    `Email: ${submission.email}`,
    `Page language: ${submission.locale}`,
    `Sent from: ${submission.pageUrl ? oneLine(submission.pageUrl) : "Not provided"}`,
    "",
    "Message:",
    submission.message,
  ].join("\n")

  return { subject, text }
}
