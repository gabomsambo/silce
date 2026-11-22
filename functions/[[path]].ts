import { localeRedirect } from "../server/localeRedirect"

// Runs only for the unprefixed paths listed in public/_routes.json.
export const onRequest = ({ request }: { request: Request }) => localeRedirect(request)
