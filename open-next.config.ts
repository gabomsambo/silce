import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Every page is prerendered at build time (see setRequestLocale in
  // app/[locale]/**). Serve those prerenders from the deployment's own static
  // assets instead of re-rendering them in the Worker on each request.
  // `pages:build` copies the cache into the assets with `populateCache`.
  incrementalCache: staticAssetsIncrementalCache,
});
