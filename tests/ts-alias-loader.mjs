/**
 * Resolve the project's `@/` imports, extensionless relative imports, and JSON
 * modules when an API route is executed under the Node test runner (no Next bundler).
 */
const EXTENSIONLESS_PACKAGES = {
  "next/server": "next/server.js",
}

const KNOWN_EXTENSION = /\.(?:ts|mjs|js|json)$/

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const bare = specifier.slice(2)
    const withExtension = KNOWN_EXTENSION.test(bare) ? bare : `${bare}.ts`
    const url = new URL(`../${withExtension}`, import.meta.url)
    return nextResolve(url.href, context)
  }
  if (EXTENSIONLESS_PACKAGES[specifier]) {
    return nextResolve(EXTENSIONLESS_PACKAGES[specifier], context)
  }
  if (specifier.startsWith(".") && !KNOWN_EXTENSION.test(specifier)) {
    const url = new URL(`${specifier}.ts`, context.parentURL)
    return nextResolve(url.href, context)
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".json")) {
    const { readFile } = await import("node:fs/promises")
    return {
      format: "json",
      source: await readFile(new URL(url)),
      shortCircuit: true,
    }
  }
  return nextLoad(url, context)
}
