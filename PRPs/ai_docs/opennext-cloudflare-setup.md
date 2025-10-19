# @opennextjs/cloudflare Setup Guide for Next.js 15

**Last Updated:** October 2025
**Package Version:** 1.11.0+
**Next.js Compatibility:** Next.js 14 (latest minor) and all Next.js 15 versions

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Build & Deployment](#build--deployment)
6. [Bindings & Context](#bindings--context)
7. [Caching with R2](#caching-with-r2)
8. [Migration from @cloudflare/next-on-pages](#migration-from-cloudflarenext-on-pages)
9. [Troubleshooting](#troubleshooting)
10. [Official Resources](#official-resources)

---

## Overview

The `@opennextjs/cloudflare` adapter enables Next.js applications to run on Cloudflare Workers using the **Node.js runtime** (not Edge runtime). This provides access to Node.js APIs and broader Next.js feature support compared to edge-only solutions.

### Key Features

- Full Next.js 14 & 15 support (App Router and Pages Router)
- Node.js runtime with `nodejs_compat` flag
- Access to Cloudflare bindings (KV, R2, D1, Durable Objects)
- Incremental Static Regeneration (ISR) with R2
- Local development with bindings support
- Remote bindings for local dev (connect to deployed resources)

### Important Differences from @cloudflare/next-on-pages

- **Runtime**: Uses Node.js runtime (not Edge runtime)
- **Feature Support**: More complete Next.js feature support
- **API Access**: Full Node.js APIs available via `nodejs_compat`
- **Status**: `@cloudflare/next-on-pages` is deprecated; `@opennextjs/cloudflare` is the recommended solution

---

## Prerequisites

- Node.js 18+ or Node.js 20+
- npm, yarn, or pnpm
- Existing Next.js 14 or 15 application (or create new)
- Cloudflare account (for deployment)

---

## Installation

### Option 1: Create New Project from Template

```bash
npm create cloudflare@latest -- my-next-app --framework=next --platform=workers
```

This creates a pre-configured Next.js app with all necessary setup.

### Option 2: Add to Existing Next.js Project

#### Step 1: Install Dependencies

```bash
# Using npm
npm install @opennextjs/cloudflare@latest
npm install --save-dev wrangler@latest

# Using pnpm
pnpm install @opennextjs/cloudflare@latest
pnpm install --save-dev wrangler@latest

# Using yarn
yarn add @opennextjs/cloudflare@latest
yarn add -D wrangler@latest
```

#### Step 2: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "upload": "opennextjs-cloudflare build && opennextjs-cloudflare upload",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  }
}
```

**Script Descriptions:**

- `build` - Standard Next.js build (called by opennextjs-cloudflare)
- `preview` - Build and run locally in Workers runtime
- `deploy` - Build and deploy immediately to Cloudflare
- `upload` - Build and upload new version (for gradual deployments, doesn't start serving)
- `cf-typegen` - Generate TypeScript types for Cloudflare environment bindings

---

## Configuration

### 1. next.config.js/ts Setup

Add `initOpenNextCloudflareForDev()` to enable bindings during local development.

**next.config.ts (TypeScript):**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your Next.js config options
};

export default nextConfig;

// Enable Cloudflare bindings in dev mode
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

**next.config.mjs (ES Modules):**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config options
};

export default nextConfig;

// Enable Cloudflare bindings in dev mode
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

**With Custom Options:**

```typescript
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev({
  experimental: { remoteBindings: true } // Enable remote bindings (older wrangler versions)
});
```

**With Server External Packages:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client", "postgres"],
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

### 2. wrangler.toml Configuration

Create `wrangler.toml` in your project root:

```toml
# Basic configuration
main = ".open-next/worker.js"
name = "my-app"  # Change to your app name
compatibility_date = "2024-09-23"  # Must be 2024-09-23 or later
compatibility_flags = ["nodejs_compat"]  # Required for Node.js runtime

# Assets binding (static files)
[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

**CRITICAL REQUIREMENTS:**

- `compatibility_date` must be **2024-09-23 or later**
- `compatibility_flags` must include **"nodejs_compat"**
- `main` points to `.open-next/worker.js` (generated during build)
- `assets.binding` must be named **"ASSETS"**

**Alternative with wrangler.jsonc:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "my-app",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

### 3. open-next.config.ts (Optional)

This file is **optional** - `@opennextjs/cloudflare` creates it automatically if missing.

**Basic Configuration:**

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Configuration options
});
```

**With R2 Incremental Cache:**

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```

Place this file at the **same location as your next.config.js**.

### 4. .gitignore Updates

Add these to your `.gitignore`:

```gitignore
# Cloudflare build output
.open-next/
.worker-next/
.wrangler/

# Cloudflare type definitions (optional - can commit if desired)
cloudflare-env.d.ts

# Vercel (if migrating from Vercel)
.vercel
```

---

## Build & Deployment

### Local Development

**Standard Next.js Dev Server:**

```bash
npm run dev
```

This runs on `http://localhost:3000` with Cloudflare bindings available via `getCloudflareContext()`.

**Local Preview in Workers Runtime:**

```bash
npm run preview
```

Builds and runs your app locally using the actual Cloudflare Workers runtime.

### Deployment to Cloudflare

**First-time Setup:**

```bash
# Login to Cloudflare
npx wrangler login
```

**Deploy to Production:**

```bash
npm run deploy
```

This builds and immediately deploys your app to Cloudflare Workers.

**Upload Without Deploying (Gradual Rollout):**

```bash
npm run upload
```

Creates a new version without starting to serve it immediately (use Cloudflare dashboard for gradual deployments).

### Build Process

When you run `opennextjs-cloudflare build`, it:

1. Runs `next build` to create standard Next.js build
2. Transforms build output for Cloudflare Workers
3. Generates `.open-next/worker.js` (entry point)
4. Generates `.open-next/assets/` (static files)
5. Creates/updates `open-next.config.ts` if missing

**Note:** The `.open-next/` directory is created during build and should be in `.gitignore`.

---

## Bindings & Context

### Accessing Cloudflare Bindings

Use `getCloudflareContext()` to access environment variables, bindings, and request context.

#### Import

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";
```

#### Basic Usage (Route Handlers)

```typescript
// app/api/example/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: Request) {
  const { env, cf, ctx } = getCloudflareContext();

  // env: Environment variables and bindings
  // cf: Request properties (like geolocation)
  // ctx: Execution context (for waitUntil, etc.)

  return new Response("Hello from Cloudflare!");
}
```

#### KV Binding Example

**wrangler.toml:**

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"
```

**Route Handler:**

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: Request) {
  const { env } = getCloudflareContext();

  // Write to KV
  await env.MY_KV.put("foo", "bar");

  // Read from KV
  const value = await env.MY_KV.get("foo");

  return new Response(value);
}
```

#### D1 Database Example

**wrangler.toml:**

```toml
[[d1_databases]]
binding = "DATABASE"
database_name = "my-database"
database_id = "your-database-id"
```

**Database Helper:**

```typescript
// lib/db.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "./schema";

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DATABASE, {
    schema,
    logger: true,
  });
}
```

**Usage in Route:**

```typescript
import { getDb } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const users = await db.select().from(schema.users);
  return Response.json(users);
}
```

#### R2 Bucket Example

**wrangler.toml:**

```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-r2-bucket"
```

**Route Handler:**

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  const formData = await request.formData();
  const file = formData.get("file") as File;

  // Upload to R2
  await env.MY_BUCKET.put(file.name, file.stream());

  return Response.json({ success: true });
}

export async function GET(request: Request) {
  const { env } = getCloudflareContext();
  const url = new URL(request.url);
  const filename = url.searchParams.get("file");

  // Read from R2
  const object = await env.MY_BUCKET.get(filename);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body);
}
```

#### Async Mode (for SSG Routes)

For Static Site Generation (SSG) routes, use async mode:

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function generateStaticParams() {
  // Must use async: true for SSG contexts
  const context = await getCloudflareContext({ async: true });
  const { env } = context;

  // Use env to generate params
  return [];
}
```

#### TypeScript Types

Generate TypeScript types for your bindings:

```bash
npm run cf-typegen
```

This creates `cloudflare-env.d.ts` with types for all bindings in `wrangler.toml`.

**Manual Type Declarations:**

```typescript
// cloudflare-env.d.ts
interface CloudflareEnv {
  MY_KV: KVNamespace;
  DATABASE: D1Database;
  MY_BUCKET: R2Bucket;
  // Add other bindings here
}

declare module "@opennextjs/cloudflare" {
  export function getCloudflareContext(): {
    env: CloudflareEnv;
    cf: IncomingRequestCfProperties;
    ctx: ExecutionContext;
  };
}
```

---

## Caching with R2

Enable Next.js Incremental Static Regeneration (ISR) using R2 storage.

### Setup

#### 1. Create open-next.config.ts

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
```

#### 2. Configure wrangler.toml

```toml
main = ".open-next/worker.js"
name = "my-app"
compatibility_date = "2024-12-30"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

# R2 bucket for cache
[[r2_buckets]]
binding = "NEXT_INC_CACHE_R2_BUCKET"
bucket_name = "my-cache-bucket"  # Change to your bucket name

# Service binding (self-reference)
[[services]]
binding = "WORKER_SELF_REFERENCE"
service = "my-app"  # Must match your worker name
```

**Key Bindings:**

- `NEXT_INC_CACHE_R2_BUCKET` - R2 bucket for cache storage (name is required)
- `WORKER_SELF_REFERENCE` - Service binding to your own worker (name must match worker name)

#### 3. Optional: Configure Cache Prefix

Set environment variable to customize cache key prefix:

```toml
[env.production.vars]
NEXT_INC_CACHE_R2_PREFIX = "incremental-cache"  # Default value
```

### Usage

Once configured, Next.js ISR works automatically:

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return <article>{post.content}</article>;
}
```

The cached pages will be stored in your R2 bucket with the prefix `incremental-cache/` (or your custom prefix).

---

## Migration from @cloudflare/next-on-pages

If you're currently using the deprecated `@cloudflare/next-on-pages` package, follow these steps:

### Step 1: Remove Old Packages

```bash
# Uninstall deprecated packages
npm uninstall @cloudflare/next-on-pages
npm uninstall eslint-plugin-next-on-pages  # If present
```

### Step 2: Install New Package

```bash
npm install @opennextjs/cloudflare@latest
npm install --save-dev wrangler@latest
```

### Step 3: Update Configuration Files

#### Remove setupDevPlatform() from next.config.js

**Before:**

```javascript
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

const nextConfig = {
  // config
};

export default nextConfig;
```

**After:**

```javascript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // config
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

#### Replace getRequestContext imports

**Before:**

```typescript
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function GET(request: Request) {
  const context = getRequestContext();
  const env = context.env;
  // ...
}
```

**After:**

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: Request) {
  const { env, cf, ctx } = getCloudflareContext();
  // ...
}
```

#### Remove next-on-pages ESLint Rules

Remove from `.eslintrc.json`:

```json
{
  "extends": [
    "plugin:next-on-pages/recommended"  // Remove this line
  ]
}
```

### Step 4: Update package.json Scripts

**Before:**

```json
{
  "scripts": {
    "build": "next-on-pages",
    "preview": "wrangler pages dev .vercel/output/static",
    "deploy": "wrangler pages deploy .vercel/output/static"
  }
}
```

**After:**

```json
{
  "scripts": {
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
  }
}
```

### Step 5: Update wrangler.toml

**Before:**

```toml
name = "my-app"
pages_build_output_dir = ".vercel/output/static"
```

**After:**

```toml
main = ".open-next/worker.js"
name = "my-app"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

### Step 6: Change Runtime to Node.js

**CRITICAL:** Remove all Edge runtime declarations.

**Before:**

```typescript
export const runtime = "edge"; // Remove this
```

**After:**

```typescript
// No runtime declaration needed (defaults to Node.js)
// OR explicitly set:
export const runtime = "nodejs";
```

The `@opennextjs/cloudflare` adapter **only supports Node.js runtime**, not Edge runtime.

### Step 7: Update Cloudflare Pages Settings (if applicable)

If deploying to Cloudflare Pages:

1. Go to **Settings > Functions > Compatibility Flags**
2. Add `nodejs_compat` for both production and preview
3. Set **Compatibility Date** to at least **2024-09-23** for both environments

### Step 8: Test Locally

```bash
npm run preview
```

Verify your app works in the Workers runtime locally before deploying.

### Step 9: Deploy

```bash
npm run deploy
```

### Migration Tool (Alternative)

For complex migrations (including from Vercel), consider using [Diverce](https://diverce.io/), which can automate migration from both Vercel and `@cloudflare/next-on-pages`.

---

## Troubleshooting

### Common Errors & Solutions

#### 1. Turbopack Not Supported

**Error:** Build fails when using `next build --turbo`

**Solution:** Remove `--turbo` flag from build command:

```json
{
  "scripts": {
    "build": "next build"  // Not: "next build --turbo"
  }
}
```

Turbopack is not currently supported by OpenNext.

---

#### 2. nodejs_compat Not Enabled

**Error:** Runtime errors, missing Node.js APIs

**Solution:** Verify `wrangler.toml` has:

```toml
compatibility_date = "2024-09-23"  # Or later
compatibility_flags = ["nodejs_compat"]
```

For Cloudflare Pages:
- Go to **Settings > Functions > Compatibility Flags**
- Add `nodejs_compat` to production and preview
- Set Compatibility Date to **2024-09-23** or later

---

#### 3. FinalizationRegistry Not Defined

**Error:** `ReferenceError: FinalizationRegistry is not defined`

**Solution:** Update `compatibility_date` to **2025-05-05** or later:

```toml
compatibility_date = "2025-05-05"
```

---

#### 4. Entry Point Not Found

**Error:** `The entry-point file at '.open-next/worker.js' was not found`

**Cause:** The `.open-next/` directory is created during build, not before.

**Solution:**
- Ensure `.open-next/` is in `.gitignore`
- Run `npm run build` or `opennextjs-cloudflare build` before deploying
- Don't commit `.open-next/` to version control

---

#### 5. Package Resolution Errors

**Error:** `Could not resolve <package-name>`

**Cause:** Package contains workerd-specific code

**Solution:** Add to `serverExternalPackages` in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client", "your-package"],
};
```

---

#### 6. I/O Request Context Error

**Error:** `Cannot perform I/O on behalf of a different request`

**Cause:** Database client created globally instead of per-request

**Bad:**

```typescript
// DON'T: Global DB client
const db = drizzle(env.DATABASE);

export async function GET() {
  const users = await db.select().from(schema.users);
}
```

**Good:**

```typescript
// DO: Create DB client per request
export async function GET() {
  const { env } = getCloudflareContext();
  const db = drizzle(env.DATABASE);
  const users = await db.select().from(schema.users);
}
```

---

#### 7. Edge Runtime Not Supported

**Error:** App fails to deploy or build

**Cause:** Using Edge runtime instead of Node.js runtime

**Solution:** Remove all Edge runtime declarations:

```typescript
// Remove these lines
export const runtime = "edge";
export const runtime = 'edge';
```

The adapter only supports **Node.js runtime**.

---

#### 8. Durable Objects Warning During Build

**Warning:** `Internal Durable Objects bindings detected during build`

**Cause:** R2 incremental cache uses Durable Objects internally

**Solution:** Safely ignore this warning - the caching Durable Objects are not used during build.

---

#### 9. Build Timeout on Large Projects

**Issue:** Build takes too long or times out

**Solutions:**
- Increase Wrangler timeout in `wrangler.toml`:
  ```toml
  [build]
  command = "npm run build"
  watch_dirs = ["src"]
  ```
- Split into multi-worker setup (advanced - see docs)
- Optimize Next.js build (reduce bundle size, use dynamic imports)

---

#### 10. TypeScript Errors with Bindings

**Issue:** TypeScript doesn't recognize binding types

**Solution:** Generate types or manually declare:

```bash
npm run cf-typegen
```

Or manually create `cloudflare-env.d.ts`:

```typescript
interface CloudflareEnv {
  MY_KV: KVNamespace;
  DATABASE: D1Database;
  MY_BUCKET: R2Bucket;
}
```

---

### Debugging Tips

#### Enable Verbose Logging

```bash
# For build
DEBUG=* opennextjs-cloudflare build

# For preview
DEBUG=* opennextjs-cloudflare preview
```

#### Check Worker Logs

```bash
# Tail production logs
wrangler tail

# Tail with filters
wrangler tail --format=pretty --status=error
```

#### Local Development Issues

If bindings don't work in `next dev`:

1. Verify `initOpenNextCloudflareForDev()` is called in `next.config.js`
2. Check `wrangler.toml` exists and is valid
3. Restart dev server after config changes
4. Use `npm run preview` to test in actual Workers runtime

---

## Official Resources

### Documentation

- **OpenNext Cloudflare Docs:** https://opennext.js.org/cloudflare
- **Get Started Guide:** https://opennext.js.org/cloudflare/get-started
- **Bindings Guide:** https://opennext.js.org/cloudflare/bindings
- **Caching Guide:** https://opennext.js.org/cloudflare/caching
- **Troubleshooting:** https://opennext.js.org/cloudflare/troubleshooting
- **Known Issues:** https://opennext.js.org/cloudflare/known-issues

### Cloudflare Docs

- **Next.js on Workers:** https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- **Wrangler Configuration:** https://developers.cloudflare.com/workers/wrangler/configuration/
- **Bindings Reference:** https://developers.cloudflare.com/workers/runtime-apis/bindings/

### GitHub & Community

- **GitHub Repository:** https://github.com/opennextjs/opennextjs-cloudflare
- **npm Package:** https://www.npmjs.com/package/@opennextjs/cloudflare
- **Cloudflare Community:** https://community.cloudflare.com/
- **Announcement Blog Post:** https://blog.cloudflare.com/deploying-nextjs-apps-to-cloudflare-workers-with-the-opennext-adapter/

### Migration Tools

- **Diverce (Vercel → Cloudflare):** https://diverce.io/

---

## Quick Reference Checklist

### Initial Setup

- [ ] Install `@opennextjs/cloudflare` and `wrangler`
- [ ] Add `initOpenNextCloudflareForDev()` to `next.config.js/ts`
- [ ] Create `wrangler.toml` with `nodejs_compat` and `compatibility_date >= 2024-09-23`
- [ ] Add build/preview/deploy scripts to `package.json`
- [ ] Remove any Edge runtime declarations
- [ ] Update `.gitignore` to exclude `.open-next/`

### Before Deploying

- [ ] Test locally with `npm run preview`
- [ ] Verify bindings work with `getCloudflareContext()`
- [ ] Check build completes without errors
- [ ] Review wrangler.toml configuration
- [ ] Generate TypeScript types with `npm run cf-typegen`

### Deployment

- [ ] Run `wrangler login` (first time only)
- [ ] Execute `npm run deploy`
- [ ] Test production URL
- [ ] Verify bindings in production
- [ ] Check Worker logs with `wrangler tail`

---

## Version History

- **1.11.0** (Latest) - Full Next.js 15 support
- **1.0-beta** - Production-ready release
- **0.5.x** - Legacy versions (see migration docs)

---

**End of Guide**

For the most up-to-date information, always refer to the official documentation at https://opennext.js.org/cloudflare.
