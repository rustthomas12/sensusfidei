import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: 'Sensus Fidei',
    description:
      'A Catholic lifestyle and commentary blog — essays on faith, stewardship, family, culture, and vocation, for living the Catholic faith in everyday life.',
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
