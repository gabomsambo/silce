export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const url = new URL(`../${specifier.slice(2)}.ts`, import.meta.url)
    return nextResolve(url.href, context)
  }
  if (specifier === "next/server") {
    return nextResolve("next/server.js", context)
  }
  return nextResolve(specifier, context)
}
