# Sensus Fidei

A personal Catholic lifestyle and commentary site — essays on faith, stewardship, family,
culture, and vocation, written to stand on their own before anything gets cross-posted to
Substack.

This is a hand-built static site: real HTML, CSS, and a small amount of templating, with no
CMS, no site builder, and no client-side app framework. It's built with
[Astro](https://astro.build), used only as a static-site compiler — Astro renders everything to
plain HTML/CSS at build time, and by default ships **zero JavaScript** to the browser (there's
no interactive JS on this site at all beyond what the browser needs to render standard HTML).
Astro was chosen over hand-written HTML files for one practical reason: it gives every post a
shared template (frontmatter + Markdown) and every section a shared layout, so adding a new essay
or a sixth section later is a matter of adding a file, not hand-editing a pile of near-duplicate
HTML pages.

## Structure

```
src/
  content/posts/       One Markdown file per essay (frontmatter: title, section, dek, date)
  content.config.ts     Schema for the posts collection
  data/sections.ts       The five sections — name, description, ordering — in one place
  layouts/BaseLayout.astro   <head>, header, footer, global shell
  components/            Header, Footer, PostListEntry (editorial list row), PullQuote
  pages/
    index.astro             Homepage (manuscript opening + recent list)
    about.astro
    [section]/index.astro    Section landing page (one template, 5 generated pages)
    [section]/[slug].astro   Article template (one template, N generated pages)
    rss.xml.js               RSS feed (auto-generated from the posts collection)
  styles/global.css      Design tokens (palette, type) and all hand-written CSS
```

**To add a new essay:** add a Markdown file to `src/content/posts/` with frontmatter for
`title`, `section` (one of `faith`, `stewardship`, `family`, `culture`, `vocation`), `dek`, and
`date`. It will automatically appear on the homepage, its section page, and the RSS feed, with
its own page at `/<section>/<filename>/`.

**To add a sixth section:** add an entry to `src/data/sections.ts` and extend the `section` enum
in `src/content.config.ts`. The nav, section landing page, and article template all read from
that one file.

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

Recommended host: **Netlify**. Reasoning: this is a zero-config static Astro site with no
server-side rendering, no environment variables, and no backend — Netlify's free tier builds and
deploys straight from a git push with no adapter or config file needed, and its preview-deploy-
per-branch workflow is convenient for reviewing a new essay before it goes live. Cloudflare Pages
and GitHub Pages would both work equally well for a site this simple; swap in whichever you
already have an account with.

### Netlify (recommended)

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build settings (Netlify auto-detects Astro, but to confirm):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Every push to the main branch redeploys automatically.

Or from the CLI, without connecting git:

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Cloudflare Pages (alternative)

1. **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
2. Build command: `npm run build`; output directory: `dist`.
3. Deploy.

### GitHub Pages (alternative)

Requires a small GitHub Actions workflow (Astro's own docs have a ready-made one:
https://docs.astro.build/en/guides/deploy/github/). Framework-agnostic hosts like Netlify or
Cloudflare are simpler for a static Astro site since they don't need a custom Actions file.

### Before going live

- `astro.config.mjs` sets `site: 'https://sensusfidei.org'` — update this if the real domain
  differs, since it's used for the RSS feed and canonical/Open Graph URLs.
- `src/components/Footer.astro` has three placeholder outbound links (Substack, Pinterest,
  LinkedIn) clearly marked `REPLACE-WITH-...` — fill in the real handles before launch.
- `public/favicon.svg` is a plain placeholder monogram; swap it for something more considered
  whenever there's time, but it's a reasonable stand-in as shipped.

## Design notes

The palette and type choices live entirely in `src/styles/global.css` as CSS custom properties
(`--ink`, `--vellum`, `--oxblood`, `--gilt`, `--slate`) — change the site's whole look from one
place. The one deliberately bold visual moment is the homepage's illuminated initial on the
featured essay's title; everything else (section pages, articles, nav) stays quiet on purpose.
