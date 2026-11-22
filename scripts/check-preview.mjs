#!/usr/bin/env node
// Smoke-check a deployed copy of the site (e.g. a Cloudflare Pages preview).
//
//   node scripts/check-preview.mjs https://<hash>.silce.pages.dev
//
// Why this exists: Cloudflare marks a Pages deploy "successful" once the files are
// uploaded, without sending a request to the Worker. The Next 16 upgrade (#44) went
// green on every check and then returned HTTP 500 on every page in production,
// because the Worker only fails when a request reaches it. `npm run check:links`
// and wrangler emulation both ran a newer workerd than Pages does, so only a request
// to the real deployment tells the truth.
//
// Checks: robots.txt and sitemap.xml are served, then every URL the sitemap lists
// (both locales' pages and every unit page) plus /en and /es returns 200 with a
// real, localized HTML document. The sitemap carries the production host, so only
// each URL's path is used against the base URL given here.
const base = process.argv[2]?.replace(/\/+$/, "");
if (!base || !/^https?:\/\//.test(base)) {
  console.error("usage: node scripts/check-preview.mjs <base-url>");
  process.exit(2);
}

const failures = [];
const fail = (url, why) => failures.push(`${url}  ${why}`);

async function get(path) {
  const url = base + path;
  let last;
  // A freshly published preview can answer 5xx/522 for a few seconds while it warms.
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30_000) });
      if (res.status < 500) return { url, res, body: await res.text() };
      last = { url, res, body: await res.text() };
    } catch (err) {
      last = { url, err };
    }
    await new Promise((r) => setTimeout(r, 3_000 * attempt));
  }
  return last;
}

function checkPage(path, result) {
  const { url, res, body, err } = result;
  if (err) return fail(url, `request failed: ${err.message ?? err}`);
  if (res.status !== 200) return fail(url, `HTTP ${res.status} (want 200)`);
  const locale = path.split("/")[1];
  if (!body.includes(`<html lang="${locale}"`)) fail(url, `no <html lang="${locale}">`);
  if (!body.includes("</html>")) fail(url, "HTML document is truncated");
  if (body.length < 5_000) fail(url, `body is only ${body.length} bytes`);
  if (!/<h1[\s>]/.test(body)) fail(url, "no <h1> rendered");
  if (/Internal Server Error/i.test(body)) fail(url, "body says Internal Server Error");
}

const robots = await get("/robots.txt");
if (robots.err || robots.res.status !== 200 || !/sitemap:/i.test(robots.body)) {
  fail(robots.url, `robots.txt not served correctly (${robots.err ?? robots.res.status})`);
}

const sitemap = await get("/sitemap.xml");
let paths = [];
if (sitemap.err || sitemap.res.status !== 200) {
  fail(sitemap.url, `sitemap.xml not served (${sitemap.err ?? sitemap.res.status})`);
} else {
  paths = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}
if (paths.length < 10) fail(sitemap.url, `sitemap lists only ${paths.length} URLs`);

const pages = [...new Set(["/en", "/es", ...paths])];
for (const path of pages) checkPage(path, await get(path));

console.log(`checked ${pages.length} pages + robots.txt + sitemap.xml on ${base}`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n` + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log("preview smoke check passed");
