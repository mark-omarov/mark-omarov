import type { MetadataRoute } from 'next';
import { SITE } from '~/data/site';
import { getAllPosts } from '~/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  return [
    { url: `${SITE.url}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/learned`, changeFrequency: 'monthly', priority: 0.4 },
    ...posts.map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: p.updated ?? p.date,
      priority: 0.7,
    })),
  ];
}
