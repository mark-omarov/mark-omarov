import type { MetadataRoute } from 'next';

const SITE_URL = 'https://omarov.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/certificates`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
