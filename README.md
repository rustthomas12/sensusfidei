# Sensus Fidei

A personal Catholic lifestyle and commentary site — essays on faith, stewardship, family,
culture, and vocation, written to stand on their own before anything gets cross-posted to
Substack.

This is a hand-built static site: real HTML, CSS, and a small amount of templating, with no
site builder and no client-side app framework on the public pages. It's built with
[Astro](https://astro.build), used mostly as a static-site compiler — Astro renders every
public page to plain HTML/CSS at build time, and those pages ship **zero JavaScript** to the
browser (there's no interactive JS on any post, section, or the homepage beyond what the
browser needs to render standard HTML). The one exception is `/admin` — a browser-based
editor (see "Editing content without touching code" below) that runs its own JS, entirely
separate from the public pages.
Astro was chosen over hand-written HTML files for one practical reason: it gives every post a
shared template (frontmatter + Markdown) and every section a shared layout, so adding a new essay
or a sixth section later is a matter of adding a file, not hand-editing a pile of near-duplicate
HTML pages.

## Structure

```
src/
  content/
    posts/                 One Markdown file per essay (frontmatter: title, section, dek,
                            date, plus optional pullquote/image/SEO fields)
    pages/about.md          The About page's copy
    settings/site.yml       Sitewide settings: footer links, tagline
  content.config.ts     Schema for all of the above collections
  data/sections.ts       The five sections — name, description, ordering — in one place
  layouts/BaseLayout.astro   <head>, header, footer, global shell
  components/            Header, Footer, PostListEntry (editorial list row), PullQuote
  pages/
    index.astro             Homepage (manuscript opening + recent list)
    about.astro              Reads src/content/pages/about.md
    [section]/index.astro    Section landing page (one template, 5 generated pages)
    [section]/[slug].astro   Article template (one template, N generated pages)
    rss.xml.js               RSS feed (auto-generated from the posts collection)
    api/auth/                GitHub OAuth handshake for /admin (the only non-static routes)
  styles/global.css      Design tokens (palette, type) and all hand-written CSS
public/
  admin/                 /admin — Sveltia CMS config + entry point (see docs/admin-setup.md)
```

**To add a new essay:** add a Markdown file to `src/content/posts/` with frontmatter for
`title`, `section` (one of `faith`, `stewardship`, `family`, `culture`, `vocation`), `dek`, and
`date`. It will automatically appear on the homepage, its section page, and the RSS feed, with
its own page at `/<section>/<filename>/`.

**To add a sixth section:** add an entry to `src/data/sections.ts` and extend the `section` enum
in `src/content.config.ts`. The nav, section landing page, and article template all read from
that one file.

## Editing content without touching code

`/admin` is a browser-based editor (Sveltia CMS) for posts, the About page, and sitewide
settings (footer links, tagline) — sign in with GitHub, edit, save; it commits straight to
this repo and Vercel redeploys automatically. See [docs/admin-setup.md](docs/admin-setup.md)
for the one-time setup (a GitHub OAuth app + two environment variables) and day-to-day use.

## Fonts

Two families, both self-hosted variable fonts (no external font-loading requests), Latin subset
only:

- **Fraunces** (display/headlines) — `font-optical-sizing: auto` and a touch of the WONK axis for
  the high-contrast, slightly irregular manuscript feel at large sizes.
- **Newsreader** (body text) — set for long-form reading, `font-optical-sizing: auto`, 1.65+
  line-height.

## Local development

Requires Node 22.12+ (repo was built and tested on Node 24).

```bash
npm install
npm run dev       # http://localhost:4321, live reload
npm run build     # outputs static site to dist/
npm run preview   # serve the built dist/ locally, to sanity-check the production build
```

## Deploying

**Deployed on Vercel**, connected to this GitHub repo — every push to `master` redeploys
automatically. This is no longer a purely static site: the `@astrojs/vercel` adapter is
required because `/admin` (see below) needs two on-demand routes (`src/pages/api/auth/*`) to
run the GitHub sign-in handshake. Every content page still prerenders to plain static HTML
exactly as before — the adapter only exists for those two routes.

Moving to a different host (Netlify, Cloudflare Pages) is still possible but would mean
swapping `@astrojs/vercel` for that host's own adapter (e.g. `@astrojs/netlify`), since the
on-demand auth routes need somewhere to run.

### Before going live

- `astro.config.mjs` sets `site: 'https://sensusfidei.org'` — update this if the real domain
  differs, since it's used for the RSS feed, canonical/Open Graph URLs, **and** the CMS's
  `base_url` in `public/admin/config.yml` (update both together).
- The footer's Substack/Pinterest/LinkedIn links are placeholders (`REPLACE-WITH-...`) in
  `src/content/settings/site.yml` — fill in the real handles before launch, either by editing
  that file directly or through `/admin` (Site settings → Sitewide settings).
- `public/favicon.svg` is a plain placeholder monogram; swap it for something more considered
  whenever there's time, but it's a reasonable stand-in as shipped.

## Design notes

The palette and type choices live entirely in `src/styles/global.css` as CSS custom properties
(`--ink`, `--vellum`, `--oxblood`, `--gilt`, `--slate`) — change the site's whole look from one
place. The one deliberately bold visual moment is the homepage's illuminated initial on the
featured essay's title; everything else (section pages, articles, nav) stays quiet on purpose.
