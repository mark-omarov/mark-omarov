import './globals.css';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { SiteHeader } from '~/components/site-header';
import { SiteFooter } from '~/components/site-footer';
import { HashScroller } from '~/components/hash-scroller';
import { PERSONAL } from '~/data/content';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const SITE_URL = 'https://omarov.dev';
const SITE_NAME = 'Mark Omarov';
const DEFAULT_TITLE = 'Mark Omarov / Senior Product Engineer';
const DEFAULT_DESCRIPTION = `Senior product engineer in Tokyo with ${PERSONAL.yearsShipping} years shipping web products end-to-end. TypeScript, React, Next.js, Node, Postgres, AWS, Kubernetes.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s · Mark Omarov',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'Mark Omarov', url: SITE_URL }],
  creator: 'Mark Omarov',
  keywords: [
    'Mark Omarov',
    'senior product engineer',
    'Tokyo',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'AWS',
    'Kubernetes',
    'Infrastructure as Code',
  ],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    firstName: 'Mark',
    lastName: 'Omarov',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    creator: '@omarov',
  },
  manifest: '/site.webmanifest',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mark Omarov',
  url: SITE_URL,
  image: `${SITE_URL}/avatar.webp`,
  jobTitle: 'Senior Product Engineer',
  worksFor: { '@type': 'Organization', name: 'Cogent Labs' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tokyo',
    addressCountry: 'JP',
  },
  email: 'mailto:mark@omarov.dev',
  sameAs: [
    'https://github.com/mark-omarov',
    'https://www.linkedin.com/in/mark-omarov/',
  ],
  knowsAbout: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'AWS',
    'Kubernetes',
    'Infrastructure as Code',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const fontVars = `${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang="en" suppressHydrationWarning className={fontVars}>
      <head>
        {process.env.NODE_ENV !== 'production' && (
          <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <HashScroller />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
