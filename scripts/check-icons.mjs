#!/usr/bin/env node
/**
 * Icon-integrity check for the production build.
 *
 * `check-links.mjs` deliberately skips hrefs that look like files, so nothing
 * guards the other half of the same bug class: an icon declared in metadata or
 * in the web app manifest that no static file backs. That ships past a green
 * build, past the link crawl, and only shows up as a blank tab.
 *
 * Against a real `next start` server (or any base URL — pass a `wrangler pages
 * dev .open-next` URL to check the Cloudflare output), for every locale this
 * asserts:
 *
 *   1. every `<link rel="icon" | "apple-touch-icon" | "manifest">` href
 *      resolves 200 with an image / manifest content type
 *   2. the pixels actually delivered match the declared `sizes` — a PNG's IHDR
 *      dimensions, or, for an ICO, that the file really carries a frame at each
 *      declared size rather than leaving the browser to downscale a large PNG
 *   3. every `icons[].src` in the manifest resolves 200 and its real pixel
 *      dimensions match that entry's declared `sizes`
 *
 * Usage:
 *   node scripts/check-icons.mjs                 # starts `next start` itself
 *   node scripts/check-icons.mjs --base-url URL  # check an already-running server
 */

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const nextBin = path.join(path.dirname(require.resolve('next/package.json')), 'dist/bin/next');

const LOCALES = ['en', 'es'];
const START_TIMEOUT_MS = 90_000;

const args = process.argv.slice(2);
const baseUrlArg = readFlag('--base-url');
const portArg = Number(readFlag('--port') ?? 3948);

function readFlag(name) {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
}

/** `<link rel="icon" href="/favicon.ico" type="..." sizes="16x16 32x32">` */
function extractIconLinks(html) {
  const links = [];
  for (const [tag] of html.matchAll(/<link\b[^>]*>/g)) {
    const rel = tag.match(/\brel="([^"]*)"/)?.[1];
    if (rel !== 'icon' && rel !== 'apple-touch-icon' && rel !== 'manifest') continue;
    const href = tag.match(/\bhref="([^"]*)"/)?.[1];
    if (!href) continue;
    links.push({
      rel,
      href,
      sizes: tag.match(/\bsizes="([^"]*)"/)?.[1] ?? '',
    });
  }
  return links;
}

/** `"16x16 32x32"` -> `[16, 32]`; ignores `any`. */
function parseSizes(sizes) {
  return [...sizes.matchAll(/(\d+)x(\d+)/g)].map(([, w]) => Number(w));
}

/** PNG dimensions straight out of the IHDR chunk. */
function pngSize(buf) {
  const isPng = buf.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
  if (!isPng) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** The widths present in an ICO directory (0 encodes 256). */
function icoFrameWidths(buf) {
  if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) return null;
  const count = buf.readUInt16LE(4);
  const widths = [];
  for (let i = 0; i < count; i++) widths.push(buf.readUInt8(6 + 16 * i) || 256);
  return widths;
}

async function fetchAsset(base, href) {
  const res = await fetch(new URL(href, base));
  const body = Buffer.from(await res.arrayBuffer());
  return { status: res.status, type: res.headers.get('content-type') ?? '', body };
}

async function run(base) {
  const failures = [];
  const fail = (msg) => failures.push(msg);
  let checked = 0;

  for (const locale of LOCALES) {
    const pageUrl = new URL(`/${locale}`, base);
    const res = await fetch(pageUrl);
    if (!res.ok) {
      fail(`GET /${locale} -> ${res.status}`);
      continue;
    }
    const links = extractIconLinks(await res.text());
    if (!links.some((l) => l.rel === 'icon')) fail(`/${locale} declares no <link rel="icon">`);
    if (!links.some((l) => l.rel === 'apple-touch-icon')) {
      fail(`/${locale} declares no <link rel="apple-touch-icon">`);
    }
    if (!links.some((l) => l.rel === 'manifest')) fail(`/${locale} declares no <link rel="manifest">`);

    for (const { rel, href, sizes } of links) {
      const { status, type, body } = await fetchAsset(base, href);
      checked++;
      const where = `/${locale} ${rel} ${href}`;
      if (status !== 200) {
        fail(`${where} -> ${status}`);
        continue;
      }
      if (rel === 'manifest') {
        if (!/manifest\+json|application\/json/.test(type)) fail(`${where} content-type ${type}`);
        continue;
      }
      if (!type.startsWith('image/')) fail(`${where} content-type ${type}`);

      const declared = parseSizes(sizes);
      const png = pngSize(body);
      if (png) {
        if (declared.length && !declared.includes(png.width)) {
          fail(`${where} declares sizes="${sizes}" but the PNG is ${png.width}x${png.height}`);
        }
      } else {
        const frames = icoFrameWidths(body);
        if (!frames) {
          fail(`${where} is neither a PNG nor an ICO`);
        } else {
          const missing = declared.filter((d) => !frames.includes(d));
          if (missing.length) {
            fail(
              `${where} declares sizes="${sizes}" but the ICO only carries ` +
                `${frames.join('/')} frames (missing ${missing.join(', ')})`
            );
          }
        }
      }
    }
  }

  const manifestRes = await fetch(new URL('/manifest.webmanifest', base));
  if (!manifestRes.ok) {
    fail(`GET /manifest.webmanifest -> ${manifestRes.status}`);
  } else {
    const manifest = await manifestRes.json();
    for (const icon of manifest.icons ?? []) {
      const { status, type, body } = await fetchAsset(base, icon.src);
      checked++;
      const where = `manifest icon ${icon.src} (purpose=${icon.purpose ?? 'any'})`;
      if (status !== 200) {
        fail(`${where} -> ${status}`);
        continue;
      }
      if (!type.startsWith('image/')) fail(`${where} content-type ${type}`);
      const png = pngSize(body);
      const declared = parseSizes(icon.sizes ?? '');
      if (png && declared.length && !declared.includes(png.width)) {
        fail(`${where} declares sizes="${icon.sizes}" but the PNG is ${png.width}x${png.height}`);
      }
    }
  }

  return { failures, checked };
}

async function waitForServer(base) {
  const deadline = Date.now() + START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(new URL('/en', base));
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(500);
  }
  throw new Error(`server at ${base} did not become ready within ${START_TIMEOUT_MS}ms`);
}

async function main() {
  let server;
  let base = baseUrlArg;

  if (!base) {
    base = `http://127.0.0.1:${portArg}`;
    server = spawn(process.execPath, [nextBin, 'start', '-p', String(portArg)], {
      stdio: ['ignore', 'ignore', 'inherit'],
    });
  }

  try {
    await waitForServer(base);
    const { failures, checked } = await run(base);
    if (failures.length) {
      console.error(`\nIcon integrity: ${failures.length} problem(s) against ${base}\n`);
      for (const f of failures) console.error(`  - ${f}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Icon integrity OK — ${checked} icon responses verified against ${base}`);
  } finally {
    server?.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
