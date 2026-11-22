// Pages Functions receive secrets and variables on `context.env`, but the
// handlers in this folder (and `lib/turnstileVerify.ts`) read `process.env`, as
// they did when they were Next route handlers. Copy the bindings across before
// calling a handler.
//
// NODE_ENV is pinned to "production": the Workers runtime does not define it,
// and `getAllowedTurnstileHostnames` treats anything but "production" as local
// development and then accepts localhost Turnstile tokens.
export function bindProcessEnv(env: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string") process.env[key] = value
  }
  Object.assign(process.env, { NODE_ENV: "production" })
}
