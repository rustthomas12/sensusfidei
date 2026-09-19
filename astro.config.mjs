// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The real domain — used for the RSS feed, canonical/OG URLs, and the
  // sitemap below.
  site: 'https://sensusfidei.org',
  // Every page still prerenders to static HTML by default (output stays
  // "static") — the adapter only exists so the two /api/auth/* routes
  // (which need `export const prerender = false`) have a Vercel serverless
  // function to run in. Nothing else about the site's rendering changes.
  adapter: vercel(),
  // Generates /sitemap-index.xml + /sitemap-0.xml at build time from every
  // prerendered page. public/robots.txt points crawlers at it.
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
