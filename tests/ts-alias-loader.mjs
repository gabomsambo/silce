/**
 * Resolve the project's `@/` imports when the subscribe route is executed
 * under the Node test runner (no Next bundler).
 */
const EXTENSIONLESS_PACKAGES = {
  "next/server": "next/server.js",
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const bare = specifier.slice(2)
    const withExtension = bare.endsWith(".ts") || bare.endsWith(".mjs") || bare.endsWith(".js") ? bare : `${bare}.ts`
    const url = new URL(`../${withExtension}`, import.meta.url)
    return nextResolve(url.href, context)
  }
  if (EXTENSIONLESS_PACKAGES[specifier]) {
    return nextResolve(EXTENSIONLESS_PACKAGES[specifier], context)
  }
  return nextResolve(specifier, context)
}
