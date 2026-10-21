import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { sitemapFilter, sitemapSerialize } from './sitemap-helpers.mjs';

export default defineConfig({
  site: 'https://maud-hendrix.com',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: sitemapFilter,
      serialize: sitemapSerialize,
      i18n: {
        defaultLocale: 'nl',
        locales: {
          nl: 'nl-BE',
          en: 'en',
        },
      },
    }),
  ],
});
