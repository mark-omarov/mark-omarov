import type { Metadata } from 'next';
import { SITE } from '~/data/site';

// Next merges metadata one top-level key at a time: a page that sets
// `alternates` or `openGraph` replaces the root layout's whole object. So
// every page builds them here, and keeps the RSS link and its own titles.

export const RSS: NonNullable<Metadata['alternates']>['types'] = {
  'application/rss+xml': [{ url: '/rss.xml', title: `${SITE.name}'s blog` }],
};

type PageMeta = {
  title: string;
  description?: string;
  path: string;
  openGraph?: Metadata['openGraph'];
};

export function pageMeta({
  title,
  description,
  path,
  openGraph,
}: PageMeta): Metadata {
  const full = `${title} · ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path, types: RSS },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: SITE.name,
      url: path,
      title: full,
      description,
      ...openGraph,
    },
    twitter: { card: 'summary_large_image', title: full, description },
  };
}
