// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Placeholder — update to the real deployed domain (sensusfidei.org) once
  // it's live. Used for the RSS feed and canonical/OG URLs.
  site: 'https://sensusfidei.org',
  // Every page still prerenders to static HTML by default (output stays
  // "static") — the adapter only exists so the two /api/auth/* routes
  // (which need `export const prerender = false`) have a Vercel serverless
  // function to run in. Nothing else about the site's rendering changes.
  adapter: vercel(),
});
