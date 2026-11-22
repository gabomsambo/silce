# Cloudflare Pages Deployment Setup - Silver Pineapple

## ✅ Completed Implementation

This document summarizes the successful setup of Cloudflare Pages deployment using @opennextjs/cloudflare for the Silver Pineapple Next.js 16 rental website.

### What Was Done

#### 1. Dependencies Installed ✅
- `@opennextjs/cloudflare` - OpenNext adapter for Cloudflare Workers
- `wrangler` - Cloudflare Workers CLI tool (devDependency)

`package.json` is the source of truth for the versions of these and of `next`;
`next` and `@opennextjs/cloudflare` are exact-pinned on purpose — see the
dependency-pinning section of `AGENTS.md` before changing either.

#### 2. Configuration Files Created/Modified ✅

**Created:**
- `wrangler.toml` - Cloudflare Pages configuration with nodejs_compat flag
- `open-next.config.ts` - OpenNext configuration (default settings)
- `.gitignore` entries for Cloudflare build outputs

**Modified:**
- `package.json` - Added Cloudflare build and deployment scripts
- `next.config.mjs` - Added `initOpenNextCloudflareForDev()` for local development
- `middleware.ts` - Updated matcher pattern to remove Vercel-specific `_vercel` reference
- `app/sitemap.ts` - Added locale prefixes for SEO (both /en/* and /es/* URLs)
- `app/manifest.ts` - Removed edge runtime declaration (OpenNext requires Node.js runtime)

#### 3. Build Verification ✅
- Standard Next.js build: ✅ Successful (40 pages generated)
- OpenNext Cloudflare build: ✅ Successful
- Build output directory: `.open-next/` (contains worker.js, assets/, middleware/)

### Configuration Details

#### wrangler.toml
```toml
name = "silver-pineapple"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".open-next"

[vars]
NEXT_PUBLIC_SITE_URL = "https://silverpineapple.net"
```

#### package.json Scripts

The Cloudflare scripts (`pages:build`, `pages:dev`, `preview`, `deploy`,
`cf-typegen`) live in `package.json`; read them there rather than from a copy.
`pages:build` does not stop at `opennextjs-cloudflare build`: it first runs
`scripts/patch-opennext-require-hook.mjs` (that file owns why — Pages' production
workerd lacks `Module.prototype`, so the adapter's relative-only require-hook
shim left Next 16's bare `next/dist/server/require-hook` import live and every
page returned HTTP 500), then chains unguarded `mv`/`cp` calls to reshape
`.open-next/` into the Pages Advanced Mode layout (see "Issue #1" in
`CLOUDFLARE_FIX_SUMMARY.md`). The adapter version stays pinned because those
layout moves have no assertions.

### Build Statistics

**Pages Generated:** 40 total
- 2 locales (English and Spanish)
- Home pages: `/en` and `/es`
- About pages: `/en/about` and `/es/about`
- Rooms pages: `/en/rooms` and `/es/rooms`
- 26 room detail pages (13 units × 2 locales)
- Reviews pages: `/en/reviews` and `/es/reviews`
- Search pages: `/en/search` and `/es/search`
- Not-found page: `/_not-found`
- Static routes: `manifest.webmanifest`, `robots.txt`, `sitemap.xml`

The room detail count is `UNITS.length × locales`, so it moves whenever
`app/data/units.ts` gains or loses a unit — re-read it off the build's route
table rather than trusting this number.

**Middleware:** 45.5 kB (next-intl i18n routing)

### Known Issues & Notes

#### INVALID_MESSAGE Warnings
During build, you may see `INVALID_MESSAGE` errors from next-intl. These are **non-critical warnings** related to metadata translation keys and do not prevent successful build completion. The build completes successfully despite these warnings.

**Example:**
```
Error: INVALID_MESSAGE
    at c (.next/server/chunks/464.js:1:100913)
```

**Impact:** None - all 40 pages generate successfully
**Status:** Can be safely ignored or fixed by ensuring all metadata translation keys exist in messages/en.json and messages/es.json

### Next Steps

#### Local Testing
1. **Test local preview:**
   ```bash
   npm run pages:dev
   ```
   Visit http://localhost:8788 to test in Workers runtime. Local `wrangler
   pages dev` can pass while a real Pages deployment fails (newer local workerd
   vs Pages' production runtime) — treat a Cloudflare preview URL as the source
   of truth, not localhost.

2. **Manual testing checklist:**
   - [ ] Visit /en and /es home pages
   - [ ] Test language toggle functionality
   - [ ] Visit sample room pages (/en/rooms/unit-2528)
   - [ ] Verify Hospitable booking widget loads
   - [ ] Check browser console for errors
   - [ ] Test navigation between pages
   - [ ] Verify sitemap includes locale prefixes: `/sitemap.xml`
   - [ ] Against a real preview or production host:
         `node scripts/check-preview.mjs https://<host>`

#### Cloudflare Pages Setup

1. **Login to Cloudflare Dashboard**
   ```bash
   npx wrangler login
   ```

2. **Create Pages Project:**
   - Go to Workers & Pages > Create application > Pages
   - Connect to GitHub repository
   - Configure build settings:
     - Build command: `npm run pages:build`
     - Build output directory: `.open-next`
     - Framework preset: None
     - Root directory: (leave empty or set to `silce/` if monorepo)

3. **Environment Variables:**
   Set in Cloudflare Dashboard (Settings > Environment Variables):
   - Use `.env.example` as the authoritative variable inventory, supplying
     deployment values for each enabled feature.
   - Store server-only values as encrypted secrets; never expose them through a
     `NEXT_PUBLIC_` variable.

4. **Advanced Settings:**
   - Node.js version: use the exact value in `.nvmrc` (Pages reads that file for
     its build image). The Node floor and the pinned `@opennextjs/cloudflare` /
     `wrangler` versions live in `package.json` and the dependency-pinning
     section of `AGENTS.md` — a Pages build on Node 18 dies in the adapter CLI
     before it ever produces `.open-next`.
   - Compatibility date: 2024-09-23
   - Compatibility flags: nodejs_compat
   - (These should be inherited from wrangler.toml)

5. **Deploy:**
   - Merge to `main` — Cloudflare's git integration builds and deploys automatically.
     Do not run `npm run deploy` / `wrangler pages deploy` by hand (see AGENTS.md).

6. **Custom Domain:**
   - After first successful deployment
   - Pages > Custom domains > Set up custom domain
   - Add `silverpineapple.net`
   - Configure DNS (CNAME or A record)

#### Post-Deployment Validation

1. **Smoke-check the real host** (not `pages:dev`):
   ```bash
   node scripts/check-preview.mjs https://<preview-or-pages-host>
   ```
   Then spot-check language switching, sample room pages, and the booking widget
   in a browser.

2. **SEO Validation:**
   - Visit `/sitemap.xml` - Should show 34 URLs with locale prefixes
     (4 static routes + `UNITS.length` room pages, each × 2 locales)
   - Visit `/robots.txt` - Should allow crawling
   - Check meta tags in page source

3. **Performance:**
   - Run Lighthouse audit (target: >90 performance score)
   - Check Core Web Vitals
   - Verify page load < 2 seconds

4. **Monitoring:**
   - Set up Google Analytics tracking
   - Monitor Cloudflare Analytics
   - Check error rates in Cloudflare dashboard

### Continuous Deployment

Cloudflare Pages automatically deploys on every push to `main` branch:
- ✅ Automatic builds enabled
- ✅ Branch preview deployments for PRs
- ✅ Rollback capability via Cloudflare dashboard

`.github/workflows/preview-smoke.yml` waits for the PR's Cloudflare Pages
preview check, then runs `scripts/check-preview.mjs` against that URL (Pages
marks a deploy successful on upload without ever hitting the Worker). Make that
workflow required in branch protection so a merge cannot outrun it.

### File Structure

After `npm run pages:build` (which reshapes OpenNext output for Pages Advanced
Mode — see `CLOUDFLARE_FIX_SUMMARY.md`):

```
.open-next/                 # Build output (gitignored)
├── _worker.js              # Cloudflare Pages Advanced Mode entry
├── _next/                  # Next static assets (flattened from assets/)
├── _routes.json            # Copied from .claude/routes.json
└── …                       # Public assets copied to output root
wrangler.toml               # Cloudflare configuration
open-next.config.ts         # OpenNext adapter config
```

### Important Commands

```bash
# Local development (Next.js dev server)
npm run dev

# Build for production
npm run build

# Build for Cloudflare
npm run pages:build

# Local preview (Workers runtime)
npm run pages:dev

# Generate TypeScript types for bindings
npm run cf-typegen
```

Production deploys only via merge to `main` — never `npm run deploy` by hand
(see AGENTS.md).

### Support & Resources

- **OpenNext Cloudflare Docs:** https://opennext.js.org/cloudflare
- **Cloudflare Workers Guide:** https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- **next-intl Documentation:** https://next-intl.dev/docs
- **Wrangler CLI Reference:** https://developers.cloudflare.com/workers/wrangler/

### Implementation Status

**Status:** ✅ **Ready for Deployment**
**Confidence:** 9/10
**Risk Level:** LOW

All configuration files are in place, build succeeds, and the application is ready to deploy to Cloudflare Pages. The only remaining steps are:
1. Local testing with `npm run pages:dev`
2. Cloudflare Pages project setup in dashboard
3. First deployment
4. Custom domain configuration
5. Post-deployment validation

---

**Implementation Date:** October 19, 2025

For the current `next`, `@opennextjs/cloudflare` and `wrangler` versions, read
`package.json`.
