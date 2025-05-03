import '@workspace/ui/globals.css';
import './globals.css';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { JetBrains_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cn } from '@workspace/ui/lib/utils';
import { Nav, type NavItem } from '~/components/nav';
import { Footer } from '~/components/footer';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Mark Omarov | Software Engineer',
  description:
    'Personal website of Mark Omarov - hands‑on software engineer who ships, no drama.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Certificates', path: '/certificates' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head>
      <body className={cn(jetbrainsMono.className, 'dark')}>
        <div className="flex min-h-screen flex-col">
          <Nav items={NAV_ITEMS} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
