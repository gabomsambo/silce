#!/usr/bin/env node
/**
 * One-time (idempotent) setup for Resend contact properties used by newsletter signup.
 *
 * Usage:
 *   RESEND_KEY=re_... node scripts/resend-setup-properties.mjs
 *
 * Lists existing properties and creates only missing keys. Never deletes or mutates
 * existing property definitions.
 */

const RESEND_API_BASE = "https://api.resend.com"

/** @type {{ key: string, type: "string", fallback_value: string }[]} */
const REQUIRED_PROPERTIES = [
  {
    key: "locale",
    type: "string",
    fallback_value: "en",
  },
  {
    key: "newsletter_interests",
    type: "string",
    fallback_value: "",
  },
]

function getResendKey() {
  const key = process.env.RESEND_KEY?.trim()
  if (!key) {
    console.error("RESEND_KEY is required (server secret from project .env).")
    process.exit(1)
  }
  return key
}

async function resendFetch(resendKey, path, options = {}) {
  const response = await fetch(`${RESEND_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  return { response, body }
}

async function listContactProperties(resendKey) {
  const { response, body } = await resendFetch(resendKey, "/contact-properties")
  if (!response.ok) {
    console.error("Failed to list contact properties", response.status, body)
    process.exit(1)
  }

  const data = Array.isArray(body?.data) ? body.data : []
  return new Map(data.map((item) => [item.key, item]))
}

async function createContactProperty(resendKey, property) {
  const { response, body } = await resendFetch(resendKey, "/contact-properties", {
    method: "POST",
    body: JSON.stringify(property),
  })

  if (!response.ok) {
    console.error(`Failed to create property ${property.key}`, response.status, body)
    process.exit(1)
  }

  return body
}

async function main() {
  const resendKey = getResendKey()
  const existing = await listContactProperties(resendKey)
  const created = []

  for (const property of REQUIRED_PROPERTIES) {
    if (existing.has(property.key)) {
      console.log(`skip: ${property.key} (already declared)`)
      continue
    }

    const result = await createContactProperty(resendKey, property)
    created.push(property.key)
    console.log(`created: ${property.key}`, result?.id ? `(id ${result.id})` : "")
  }

  const after = await listContactProperties(resendKey)
  for (const property of REQUIRED_PROPERTIES) {
    const row = after.get(property.key)
    if (!row) {
      console.error(`verify failed: missing ${property.key} after setup`)
      process.exit(1)
    }
    console.log(`verified: ${property.key} type=${row.type}`)
  }

  if (created.length === 0) {
    console.log("No new properties created; account already configured.")
  } else {
    console.log(`Created properties: ${created.join(", ")}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
