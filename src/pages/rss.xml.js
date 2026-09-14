import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: 'Sensus Fidei',
    description:
      'A personal record of faith, philosophy, and daily life — essays on doctrine, stewardship, family, culture, and vocation.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.dek,
      pubDate: post.data.date,
      link: `/${post.data.section}/${post.id}/`,
      categories: [post.data.section],
    })),
    customData: `<language>en-us</language>`,
  });
}
