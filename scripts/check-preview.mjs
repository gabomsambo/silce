#!/usr/bin/env node
// Smoke-check and load-check a deployed copy of the site (e.g. a Cloudflare Pages preview).
//
//   node scripts/check-preview.mjs https://<hash>.silce.pages.dev [--requests 600] [--concurrency 6]
//
// Why this exists: Cloudflare marks a Pages deploy "successful" once the files are
// uploaded, without sending a request to the Worker. Two incidents shipped past
// every other check:
//   - the Next 16 upgrade (#44) answered HTTP 500 on every page;
//   - its fix (#45) answered fine on a 58-request pass and then returned HTTP 503
//     "Error code: 1102" (Worker exceeded its CPU limit) on 10-50% of requests once
//     a few requests ran back to back. A single pass, or a pass that retries a 5xx,
//     cannot see an intermittent failure.
// So this check has two parts and neither retries a failed request:
//
//   1. Smoke: robots.txt and sitemap.xml, every sitemap URL plus /en and /es returns
//      a real localized HTML document, the unprefixed locale redirect works, the
//      form endpoints are deployed, and an unknown URL is a 404.
//   2. Sustained: --requests requests (default 600, at least 500 is the contract) at
//      --concurrency, spread over every page in both locales, plus the locale
//      redirect. ANY non-200 (or a truncated/empty page) fails the check.
//
// The sitemap carries the production host, so only each URL's path is used against
// the base URL given here.
import { appendFileSync } from "node:fs";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const base = argv.find((a) => /^https?:\/\//.test(a))?.replace(/\/+$/, "");
const REQUESTS = Number(flag("--requests", 600));
const CONCURRENCY = Number(flag("--concurrency", 6));
if (!base || !(REQUESTS >= 0) || !(CONCURRENCY >= 1)) {
  console.error(
    "usage: node scripts/check-preview.mjs <base-url> [--requests N] [--concurrency N]",
  );
  process.exit(2);
}

const failures = [];
const fail = (url, why) => failures.push(`${url}  ${why}`);

/** One request, no retry. A network error is reported as status 0. */
async function get(path, init = {}) {
  const url = base + path;
  const started = performance.now();
  try {
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
      ...init,
    });
    const body = await res.text();
    return { url, res, body, ms: performance.now() - started };
  } catch (err) {
    return { url, err, ms: performance.now() - started };
  }
}

/** A just-published preview can 404 while Cloudflare propagates it. Wait for the
 *  first 200 on /en; this is the only tolerance, and it is not counted as traffic. */
async function waitUntilServed() {
  const deadline = Date.now() + 120_000;
  let last;
  while (Date.now() < deadline) {
    last = await get("/en");
    if (last.res?.status === 200) return;
    await new Promise((r) => setTimeout(r, 5_000));
  }
  console.error(`${base}/en never answered 200 (last: ${last?.res?.status ?? last?.err})`);
  process.exit(1);
}

function pageProblems(path, result) {
  const { res, body, err } = result;
  if (err) return `request failed: ${err.message ?? err}`;
  if (res.status !== 200) return `HTTP ${res.status} (want 200)`;
  const locale = path.split("/")[1];
  if (!body.includes(`<html lang="${locale}"`)) return `no <html lang="${locale}">`;
  if (!body.includes("</html>")) return "HTML document is truncated";
  if (body.length < 5_000) return `body is only ${body.length} bytes`;
  if (!/<h1[\s>]/.test(body)) return "no <h1> rendered";
  if (/Internal Server Error|error code: 1\d{3}/i.test(body)) return "body is a server error page";
  return null;
}

await waitUntilServed();

// --- 1. Smoke -------------------------------------------------------------------
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
for (const path of pages) {
  const problem = pageProblems(path, await get(path));
  if (problem) fail(base + path, problem);
}

// The unprefixed locale redirect is the one request that still runs code.
for (const [acceptLanguage, want] of [
  ["es-ES,es;q=0.9,en;q=0.5", "/es"],
  ["en-US,en;q=0.9", "/en"],
]) {
  const r = await get("/", { headers: { "accept-language": acceptLanguage } });
  const location = r.res?.headers.get("location");
  if (r.err || r.res.status !== 307 || location !== want) {
    fail(r.url, `"/" with Accept-Language ${acceptLanguage} gave ${r.err ?? r.res.status} -> ${location} (want 307 -> ${want})`);
  }
}

// The form endpoints are Pages Functions. A preview has no secrets, so a POST gets
// 500 service_unavailable (or 400 once secrets are bound): either proves the
// Function is deployed and running; a 404 or an HTML body means it is not.
for (const endpoint of ["/api/newsletter/subscribe", "/api/reviews/submit"]) {
  const r = await get(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const code = r.res && (r.res.headers.get("content-type") ?? "").includes("json")
    ? JSON.parse(r.body || "{}").error
    : undefined;
  if (r.err || ![400, 500].includes(r.res.status) || !["validation_error", "service_unavailable"].includes(code)) {
    fail(r.url, `POST gave ${r.err ?? r.res.status} ${code ?? "(not JSON)"}; the Function is not serving`);
  }
}

const missing = await get("/en/this-page-does-not-exist");
if (missing.err || missing.res.status !== 404) {
  fail(missing.url, `unknown URL gave ${missing.err ?? missing.res.status} (want 404)`);
}

console.log(`smoke: checked ${pages.length} pages + robots.txt + sitemap.xml + redirect + 2 Functions on ${base}`);

// --- 2. Sustained ---------------------------------------------------------------
let sustained = null;
if (REQUESTS > 0 && pages.length >= 10) {
  // Every page at least once; the rest spread evenly, shuffled so a route is not
  // always hit while the isolate or the edge cache is in the same state.
  const queue = Array.from({ length: Math.max(REQUESTS, pages.length) }, (_, i) =>
    i % 40 === 39 ? "/" : pages[i % pages.length],
  ).sort(() => Math.random() - 0.5);
  const results = [];
  let next = 0;
  const started = Date.now();
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < queue.length) {
        const path = queue[next++];
        const r = await get(path, path === "/" ? { headers: { "accept-language": "es" } } : {});
        const problem =
          path === "/"
            ? r.err || r.res.status !== 307
              ? `redirect gave ${r.err ?? r.res.status}`
              : null
            : pageProblems(path, r);
        results.push({ path, status: r.res?.status ?? 0, ms: r.ms, problem });
      }
    }),
  );
  const bad = results.filter((r) => r.problem);
  const ok = results.filter((r) => !r.problem).map((r) => r.ms).sort((a, b) => a - b);
  const pct = (p) => Math.round(ok[Math.min(ok.length - 1, Math.floor(ok.length * p))] ?? 0);
  const byStatus = {};
  for (const r of results) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  sustained = {
    total: results.length,
    failed: bad.length,
    statuses: byStatus,
    p50: pct(0.5),
    p95: pct(0.95),
    seconds: (Date.now() - started) / 1000,
  };
  console.log(
    `sustained: ${sustained.total} requests at concurrency ${CONCURRENCY} in ${sustained.seconds.toFixed(1)}s, ` +
      `${sustained.failed} failed, statuses ${JSON.stringify(byStatus)}, p50 ${sustained.p50}ms p95 ${sustained.p95}ms`,
  );
  const perRoute = new Map();
  for (const r of bad) perRoute.set(r.path, (perRoute.get(r.path) ?? 0) + 1);
  for (const [path, n] of perRoute) {
    const sample = bad.find((r) => r.path === path);
    fail(`${base}${path}`, `${n} failed request(s) in the sustained run, e.g. ${sample.problem}`);
  }
  if (REQUESTS < 500) fail(base, `--requests ${REQUESTS} is below the 500-request minimum for this check`);
}

if (process.env.GITHUB_STEP_SUMMARY && sustained) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Preview check\n\n${base}\n\n- sustained: **${sustained.total}** requests, **${sustained.failed}** failed, p50 ${sustained.p50} ms, p95 ${sustained.p95} ms\n- statuses: \`${JSON.stringify(sustained.statuses)}\`\n`,
  );
}

if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n` + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log("preview check passed");
