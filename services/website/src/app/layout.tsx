import './globals.css';

import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { SiteHeader } from '~/components/site-header';
import { SiteFooter } from '~/components/site-footer';
import { VimKeys } from '~/components/vim-keys';
import { RSS } from '~/lib/meta';
import { getAllPosts } from '~/lib/posts';
import { SITE } from '~/data/site';

// Self-hosted (OFL licensed, see src/fonts) so builds don't depend on Google Fonts.
const mono = localFont({
  src: [
    {
      path: '../fonts/jetbrains-mono-latin-wght-normal.woff2',
      style: 'normal',
    },
    {
      path: '../fonts/jetbrains-mono-latin-wght-italic.woff2',
      style: 'italic',
    },
  ],
  weight: '100 800',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const pixel = localFont({
  src: '../fonts/pixelify-sans-latin-wght-normal.woff2',
  weight: '400 700',
  variable: '--font-pixelify',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: '/', types: RSS },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE.name,
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#1a1b26',
  colorScheme: 'dark',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tokyo',
    addressCountry: 'JP',
  },
  sameAs: [SITE.github, SITE.linkedin],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const posts = (await getAllPosts()).map((p) => ({
    title: p.title,
    href: `/blog/${p.slug}`,
  }));
  return (
    <html lang="en" className={`${mono.variable} ${pixel.variable}`}>
      <head>
        {process.env.NODE_ENV !== 'production' && (
          <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="flex flex-col">
        <a
          href="#content"
          className="bg-yellow text-bg sr-only z-50 px-3 py-1 focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
        >
          skip to content
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <VimKeys posts={posts} />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
