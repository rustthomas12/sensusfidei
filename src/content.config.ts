import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    section: z.enum(['faith', 'stewardship', 'family', 'culture', 'vocation']),
    dek: z.string(),
    date: z.coerce.date(),
    // Optional line set as a pull quote inside the article body, styled with
    // the gilt rule treatment. Most posts just use a blockquote in the
    // markdown body instead — this is only for a callout pulled from outside
    // the running text.
    pullquote: z.string().optional(),
    draft: z.boolean().optional().default(false),
    // Optional hero photo, shown at the top of the article body. Path is
    // relative to /public, e.g. "/images/posts/my-photo.jpg".
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // SEO overrides. Every field falls back to the equivalent editorial
    // field (title/dek, or the sitewide default OG image) when left blank
    // — these only exist for the cases where the SEO-optimal phrasing
    // differs from the human-facing title or dek.
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

// The About page's copy, stored the same way posts are — Markdown body,
// small frontmatter — so /admin edits it with the exact same editor. Only
// one file lives in here today, but it's a glob collection (not a single
// file) so a second standalone page could be added later the same way a
// sixth post gets added: drop in a file.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
  }),
});

// Sitewide settings that used to be hardcoded in components — the footer's
// outbound links and blurb, the header's tagline. One YAML file, one entry
// (id: "site"), read from wherever those values are needed instead of
// being typed into the markup directly.
const settings = defineCollection({
  loader: file('src/content/settings/site.yml'),
  schema: z.object({
    tagline: z.string(),
    footerBlurb: z.string(),
    substackUrl: z.string(),
    pinterestUrl: z.string(),
    linkedinUrl: z.string(),
  }),
});

export const collections = { posts, pages, settings };
