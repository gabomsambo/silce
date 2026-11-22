import { POST } from "../../../server/newsletterSubscribe"
import { bindProcessEnv } from "../../../server/pagesEnv"

// The only server code for newsletter signup. Every page is a static file;
// this Function runs only when the signup form is submitted.
export const onRequestPost = ({ request, env }: { request: Request; env: Record<string, unknown> }) => {
  bindProcessEnv(env)
  return POST(request)
}

export const onRequest = () =>
  Response.json({ error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } })
