import assert from "node:assert/strict"
import test from "node:test"
import {
  buildReviewMessage,
  createReviewSubmissionSchema,
  propertyTitleForSlug,
} from "../lib/reviewDelivery.ts"
import { getAllowedTurnstileHostnames, turnstileAllows } from "../lib/turnstileVerify.ts"

const reviewSubmissionSchema = createReviewSubmissionSchema(["unit-2528"])
const unitTitles = {
  "unit-2528": { title: "Studio — Compact · Unit 2528" },
}

const validSubmission = {
  guestName: "TEST Guest",
  email: "review-form-test@example.com",
  propertySlug: "unit-2528",
  overallRating: 5,
  cleanliness: 4,
  reviewText: "TEST - please ignore. This note is long enough to satisfy the review minimum length.",
  stayDate: "2026-10-01",
  locale: "en",
  turnstileToken: "token",
}

test("a review email includes every submitted field and leaves blank ratings unmarked", () => {
  const parsed = reviewSubmissionSchema.parse(validSubmission)
  const message = buildReviewMessage(parsed, propertyTitleForSlug(parsed.propertySlug, unitTitles))

  assert.equal(message.subject, "Guest review (EN) — Studio — Compact · Unit 2528 — TEST Guest")
  assert.match(message.text, /Name: TEST Guest/)
  assert.match(message.text, /Email: review-form-test@example.com/)
  assert.match(message.text, /Property: Studio — Compact · Unit 2528/)
  assert.match(message.text, /Property slug: unit-2528/)
  assert.match(message.text, /Stay date: 2026-10-01/)
  assert.match(message.text, /Page language: en/)
  assert.match(message.text, /Overall: 5\/5/)
  assert.match(message.text, /Cleanliness: 4\/5/)
  assert.match(message.text, /Communication: Not rated/)
  assert.match(message.text, /Location: Not rated/)
  assert.match(message.text, /Value: Not rated/)
  assert.match(message.text, /TEST - please ignore/)
  assert.match(message.text, /not posted on the site/)
  assert.equal(propertyTitleForSlug("unit-2528", unitTitles), "Studio — Compact · Unit 2528")
  assert.equal(propertyTitleForSlug("missing", unitTitles), "missing")
})

test("the subject stays a single line when the guest name contains a line break", () => {
  const parsed = reviewSubmissionSchema.parse(validSubmission)
  const message = buildReviewMessage(
    { ...parsed, guestName: "TEST\nGuest" },
    propertyTitleForSlug(parsed.propertySlug, unitTitles),
  )
  assert.equal(message.subject.includes("\n"), false)
  assert.match(message.subject, /TEST Guest/)
})

test("delivery validation rejects an unknown property, a short note, and a missing captcha token", () => {
  assert.equal(
    reviewSubmissionSchema.safeParse({ ...validSubmission, propertySlug: "not-a-unit" }).success,
    false,
  )
  assert.equal(
    reviewSubmissionSchema.safeParse({ ...validSubmission, reviewText: "too short" }).success,
    false,
  )
  assert.equal(
    reviewSubmissionSchema.safeParse({ ...validSubmission, turnstileToken: "" }).success,
    false,
  )
  assert.equal(
    reviewSubmissionSchema.safeParse({ ...validSubmission, stayDate: "" }).success,
    true,
  )
})

test("production Turnstile hostnames stay on the live site unless a dummy test secret is configured", () => {
  const production = getAllowedTurnstileHostnames({ nodeEnv: "production" })
  assert.equal(production.has("silverpineapple.net"), true)
  assert.equal(production.has("localhost"), false)

  const dummy = getAllowedTurnstileHostnames({
    nodeEnv: "production",
    turnstileSecret: "1x0000000000000000000000000000000AA",
  })
  assert.equal(dummy.has("localhost"), true)
  assert.equal(dummy.has("example.com"), true)
  assert.equal(dummy.has("silverpineapple.net"), true)
})

test("dummy Turnstile secrets may omit action, and a mismatched action is still rejected", () => {
  const dummySecret = "1x0000000000000000000000000000000AA"
  assert.equal(
    turnstileAllows({
      success: true,
      action: undefined,
      hostname: "example.com",
      expectedAction: "review",
      secret: dummySecret,
      env: { nodeEnv: "production" },
    }),
    true,
  )
  assert.equal(
    turnstileAllows({
      success: true,
      action: "newsletter",
      hostname: "example.com",
      expectedAction: "review",
      secret: dummySecret,
      env: { nodeEnv: "production" },
    }),
    false,
  )
  assert.equal(
    turnstileAllows({
      success: true,
      action: undefined,
      hostname: "silverpineapple.net",
      expectedAction: "review",
      secret: "live-secret",
      env: { nodeEnv: "production" },
    }),
    false,
  )
  assert.equal(
    turnstileAllows({
      success: true,
      action: "review",
      hostname: "silverpineapple.net",
      expectedAction: "review",
      secret: "live-secret",
      env: { nodeEnv: "production" },
    }),
    true,
  )
})
