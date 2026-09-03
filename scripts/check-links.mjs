#!/usr/bin/env node
/**
 * Link-integrity check for the production build.
 *
 * Crawls every page reachable from `/en` and `/es` in a real `next start`
 * server and asserts two things about every internal <a href>:
 *
 *   1. it does not 404 (and does not only work because middleware redirects it)
 *   2. it carries a locale prefix — `routing.localePrefix` is 'always', so an
 *      internal page href must resolve under `/en/...` or `/es/...`
 *
 * Both classes have shipped past a green build here before: relative hrefs like
 * `./rooms` that resolve to `/es/rooms/rooms` from a nested page, and unprefixed
 * hrefs like `/rooms` that only survive because of the next-intl middleware.
 *
 * Usage:
 *   node scripts/check-links.mjs                 # builds nothing; starts `next start` itself
 *   node scripts/check-links.mjs --base-url URL  # crawl an already-running server
 */

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const nextBin = path.join(path.dirname(require.resolve('next/package.json')), 'dist/bin/next');

const LOCALES = ['en', 'es'];
// `/search` is a real route that nothing links to, so the crawl would never
// reach it from the home page; seed it explicitly.
const UNLINKED_ROUTES = ['/search'];
const SEEDS = LOCALES.flatMap((l) => [`/${l}`, ...UNLINKED_ROUTES.map((r) => `/${l}${r}`)]);
const START_TIMEOUT_MS = 90_000;

/** Paths that are legitimately served without a locale prefix. */
const LOCALE_EXEMPT = new Set(['/robots.txt', '/sitemap.xml', '/manifest.webmanifest']);

const args = process.argv.slice(2);
const baseUrlArg = readFlag('--base-url');
const portArg = Number(readFlag('--port') ?? 3947);

function readFlag(name) {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
}

function isSkippableHref(href) {
  if (!href) return true;
  const h = href.trim();
  if (h === '' || h.startsWith('#')) return true;
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(h);
}

/** A path that points at a file rather than a page. */
function looksLikeAsset(pathname) {
  return /\.[a-z0-9]{1,6}$/i.test(pathname);
}

function extractHrefs(html) {
  const out = [];
  const re = /<a\b[^>]*?\shref\s*=\s*("([^"]*)"|'([^']*)'|([^\s">]+))/gi;
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[2] ?? m[3] ?? m[4] ?? '');
  return out;
}

async function waitForServer(base) {
  const deadline = Date.now() + START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${base}/en`, { redirect: 'manual' });
      if (res.status < 500) return;
    } catch {
      /* not up yet */
    }
    await sleep(500);
  }
  throw new Error(`server did not become ready at ${base} within ${START_TIMEOUT_MS}ms`);
}

async function crawl(base) {
  const origin = new URL(base).origin;
  const violations = [];
  const queue = [...SEEDS];
  const seen = new Set(queue);
  let pagesCrawled = 0;
  let linksChecked = 0;

  const statusCache = new Map();
  async function statusOf(path) {
    if (!statusCache.has(path)) {
      const res = await fetch(origin + path, { redirect: 'manual' });
      statusCache.set(path, { status: res.status, location: res.headers.get('location') });
    }
    return statusCache.get(path);
  }

  while (queue.length > 0) {
    const path = queue.shift();
    const res = await fetch(origin + path, { redirect: 'manual' });
    statusCache.set(path, { status: res.status, location: res.headers.get('location') });
    if (res.status !== 200) {
      violations.push({ kind: 'broken-page', page: path, detail: `status ${res.status}` });
      continue;
    }
    pagesCrawled += 1;
    const html = await res.text();

    for (const raw of extractHrefs(html)) {
      if (isSkippableHref(raw)) continue;
      linksChecked += 1;

      let resolved;
      try {
        resolved = new URL(raw, origin + path);
      } catch {
        violations.push({ kind: 'unparseable-href', page: path, href: raw });
        continue;
      }
      if (resolved.origin !== origin) continue;

      const target = resolved.pathname;
      if (LOCALE_EXEMPT.has(target)) continue;
      if (looksLikeAsset(target)) continue;

      // Historical bug #1: relative hrefs. Under localePrefix: 'always' every
      // internal link must come from the next-intl navigation helpers, which
      // always emit a root-relative, locale-prefixed path.
      if (!raw.startsWith('/')) {
        violations.push({
          kind: 'relative-href',
          page: path,
          href: raw,
          detail: `resolves to ${target}`,
        });
      }

      // Historical bug #2: locale prefix dropped; the link only works because
      // the next-intl middleware redirects it.
      const prefixed = LOCALES.some((l) => target === `/${l}` || target.startsWith(`/${l}/`));
      if (!prefixed) {
        violations.push({ kind: 'missing-locale-prefix', page: path, href: raw, detail: target });
      }

      const { status, location } = await statusOf(target);
      if (status === 404) {
        violations.push({ kind: 'broken-link', page: path, href: raw, detail: `404 at ${target}` });
      } else if (status >= 300 && status < 400) {
        violations.push({
          kind: 'redirected-link',
          page: path,
          href: raw,
          detail: `${status} -> ${location} (link works only via a redirect)`,
        });
      } else if (status !== 200) {
        violations.push({ kind: 'broken-link', page: path, href: raw, detail: `status ${status} at ${target}` });
      }

      if (prefixed && status === 200 && !seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }

  return { violations, pagesCrawled, linksChecked, pages: [...seen].sort() };
}

async function main() {
  let child;
  let base = baseUrlArg;

  if (!base) {
    base = `http://127.0.0.1:${portArg}`;
    // Spawn the local `next` bin directly (not through npx) and in its own
    // process group, so SIGTERM below reaps the server instead of orphaning it.
    child = spawn(process.execPath, [nextBin, 'start', '-p', String(portArg)], {
      stdio: ['ignore', 'inherit', 'inherit'],
      detached: true,
    });
    console.log(`Started next start on port ${portArg} (pid ${child.pid})`);
  }

  try {
    await waitForServer(base);
    const { violations, pagesCrawled, linksChecked, pages } = await crawl(base);

    console.log(`\nCrawled ${pagesCrawled} pages, checked ${linksChecked} internal links.`);
    if (process.env.LINK_CHECK_VERBOSE) console.log(pages.join('\n'));
    if (violations.length === 0) {
      console.log('Link integrity OK: no 404s, no dropped locale prefixes.');
      return 0;
    }

    console.error(`\n${violations.length} link-integrity violation(s):\n`);
    for (const v of violations) {
      const href = v.href ? ` href="${v.href}"` : '';
      console.error(`  [${v.kind}] on ${v.page}${href} — ${v.detail ?? ''}`);
    }
    return 1;
  } finally {
    if (child?.pid) {
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        child.kill('SIGTERM');
      }
    }
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
