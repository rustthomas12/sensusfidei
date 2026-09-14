import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  }),
});

export const collections = { posts };
