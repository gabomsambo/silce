import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudflare Pages does not run Next's optimizer. Unit galleries ship
    // pre-generated WebP at 640/1024/1500; see lib/photos.ts.
    unoptimized: true,
  },
  // Inlined into both bundles at build time, so server and client render the
  // same value on the hydrating pass. Read by app/components/Footer.tsx.
  env: {
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
}

export default withNextIntl(nextConfig)

// Enable Cloudflare bindings in local development
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
