import '@workspace/ui/globals.css';
import './globals.css';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { JetBrains_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { cn } from '@workspace/ui/lib/utils';
import { Nav, type NavItem } from '~/components/nav';
import { Footer } from '~/components/footer';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const SITE_URL = 'https://omarov.dev';
const SITE_NAME = 'Mark Omarov';
const DEFAULT_TITLE = 'Mark Omarov - Senior Product Engineer';
const DEFAULT_DESCRIPTION =
  'Senior product engineer in Tokyo with 10 years shipping web products end-to-end. TypeScript, React, Next.js, Node, Postgres, AWS, Kubernetes.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s - Mark Omarov',
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
  alternates: {
    canonical: '/',
  },
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
  icons: [
    { rel: 'icon', url: '/favicon.ico', sizes: 'any' },
    {
      rel: 'icon',
      url: '/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'mask-icon', url: '/favicon.ico' },
  ],
};

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Certificates', path: '/certificates' },
];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mark Omarov',
  url: SITE_URL,
  image: `${SITE_URL}/avatar.webp`,
  jobTitle: 'Senior Product Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Cogent Labs',
  },
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
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV !== 'production' && (
          <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        )}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={cn(jetbrainsMono.className, 'dark')}>
        <div className="flex min-h-screen flex-col">
          <Nav items={NAV_ITEMS} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
