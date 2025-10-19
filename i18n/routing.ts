import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales
  locales: ['en', 'es'],

  // Default locale
  defaultLocale: 'en',

  // Always show locale in URL (/en/ and /es/)
  localePrefix: 'always'
});
