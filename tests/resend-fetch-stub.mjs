/**
 * Child-process fetch stand-in for `scripts/resend-setup-properties.mjs`.
 * Never calls the network. Scenarios are selected with RESEND_STUB_SCENARIO.
 */
const scenario = process.env.RESEND_STUB_SCENARIO || "already-string"

const state = {
  properties:
    scenario === "mismatch"
      ? [
          { key: "locale", type: "number", id: "prop_locale" },
          { key: "newsletter_interests", type: "string", id: "prop_interests" },
        ]
      : scenario === "missing"
        ? []
        : [
            { key: "locale", type: "string", id: "prop_locale" },
            { key: "newsletter_interests", type: "string", id: "prop_interests" },
          ],
}

globalThis.fetch = async (url, options = {}) => {
  const method = (options.method || "GET").toUpperCase()
  const target = String(url)
  if (target !== "https://api.resend.com/contact-properties") {
    return Response.json({ message: `refused ${method} ${target}` }, { status: 500 })
  }

  if (method === "GET") {
    return Response.json({ data: state.properties })
  }

  if (method === "POST") {
    const body = JSON.parse(String(options.body))
    if (state.properties.some((row) => row.key === body.key)) {
      return Response.json({ message: `refusing to mutate ${body.key}` }, { status: 409 })
    }
    state.properties.push({ key: body.key, type: body.type, id: `prop_${body.key}` })
    return Response.json({ id: `prop_${body.key}`, object: "contact_property" })
  }

  return Response.json({ message: `method refused ${method}` }, { status: 500 })
}
