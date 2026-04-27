'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BrandMark } from '~/components/brand-mark';

type NavItem = { key: string; label: string; href: string };

const ITEMS: NavItem[] = [
  { key: 'home', label: 'Index', href: '/' },
  { key: 'projects', label: 'Projects', href: '/projects' },
  { key: 'certificates', label: 'Credentials', href: '/certificates' },
  { key: 'contact', label: 'Contact', href: '/#contact' },
];

function getRouteLabel(pathname: string): string {
  if (pathname === '/' || pathname.startsWith('/#')) return 'INDEX';
  if (pathname.startsWith('/projects')) return 'PROJECTS';
  if (pathname.startsWith('/certificates')) return 'CREDENTIALS';
  return 'INDEX';
}

function isActive(item: NavItem, pathname: string): boolean {
  if (item.key === 'home') return pathname === '/';
  if (item.key === 'contact') return false;
  return pathname.startsWith(item.href);
}

type Theme = 'dark' | 'light';

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem('om:theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // ignore — localStorage unavailable
  }
  return 'dark';
}

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setMounted(true);
    const t = readInitialTheme();
    setTheme(t);
    document.documentElement.classList.toggle('theme-light', t === 'light');
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      window.localStorage.setItem('om:theme', next);
    } catch {
      // ignore
    }
    document.documentElement.classList.toggle('theme-light', next === 'light');
  };

  return (
    <header className="site-header site-header-bg border-rule sticky top-0 z-50 border-b">
      <div className="grid-container flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-bone flex min-w-0 shrink items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] no-underline"
        >
          <BrandMark
            size={22}
            className="text-bone shrink-0"
            ariaLabel="mo · home"
          />

          <span>Omarov</span>
          <span className="text-graphite">/</span>
          <span className="text-graphite overflow-hidden text-ellipsis whitespace-nowrap">
            {getRouteLabel(pathname)}
          </span>
        </Link>

        <nav className="flex items-center gap-7 max-md:hidden">
          {ITEMS.map((it) => {
            const active = isActive(it, pathname);
            return (
              <Link
                key={it.key}
                href={it.href}
                className="nav-item py-1"
                data-active={active ? 'true' : 'false'}
              >
                {it.label}
              </Link>
            );
          })}
          <span className="bg-rule h-4 w-px" aria-hidden />
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            className="border-rule text-bone shrink-0 cursor-pointer whitespace-nowrap border bg-transparent px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em]"
          >
            {mounted ? (theme === 'dark' ? '[DARK]' : '[LIGHT]') : '[DARK]'}
          </button>
        </nav>

        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          type="button"
          className="border-rule text-bone hidden shrink-0 cursor-pointer items-center gap-2 border bg-transparent px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] max-md:inline-flex"
        >
          <span className="inline-flex flex-col gap-[3px]" aria-hidden>
            <span className="h-px w-3.5 bg-current" />
            <span className="h-px w-3.5 bg-current" />
            <span className="h-px w-3.5 bg-current" />
          </span>
          <span>Menu</span>
        </button>
      </div>

      {drawerOpen &&
        mounted &&
        createPortal(
          <MobileDrawer
            pathname={pathname}
            theme={theme}
            onToggleTheme={toggleTheme}
            onClose={() => setDrawerOpen(false)}
          />,
          document.body
        )}
    </header>
  );
}

interface MobileDrawerProps {
  pathname: string;
  theme: Theme;
  onToggleTheme: () => void;
  onClose: () => void;
}

function MobileDrawer({
  pathname,
  theme,
  onToggleTheme,
  onClose,
}: MobileDrawerProps) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className="animate-panel-scrim fixed inset-0 z-[90] bg-black/[0.78] backdrop-blur-md"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="border-rule bg-ink animate-panel-slide-in fixed inset-y-0 right-0 z-[95] flex w-[min(380px,100vw)] flex-col border-l shadow-[-24px_0_48px_rgba(0,0,0,0.4)]"
      >
        <div className="border-rule flex items-center justify-between border-b px-6 py-4">
          <span className="text-graphite font-mono text-[11px] uppercase tracking-[0.18em]">
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            type="button"
            className="border-rule text-bone cursor-pointer border bg-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            Close · ESC
          </button>
        </div>

        <nav className="flex-1 py-4">
          {ITEMS.map((it, idx) => {
            const active = isActive(it, pathname);
            return (
              <Link
                key={it.key}
                href={it.href}
                onClick={onClose}
                data-active={active ? 'true' : 'false'}
                className="group/nav border-rule text-bone data-[active=true]:text-signal flex w-full items-center justify-between border-b px-6 py-5 text-left text-[22px] font-medium tracking-[-0.01em] no-underline"
              >
                <span>{it.label}</span>
                <span className="text-graphite group-data-[active=true]/nav:text-signal font-mono text-[11px] tracking-[0.16em]">
                  {active ? '●' : `0${idx + 1}`}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-rule border-t px-6 py-5">
          <button
            onClick={onToggleTheme}
            type="button"
            className="border-rule text-bone cursor-pointer border bg-transparent px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em]"
          >
            {theme === 'dark' ? '[DARK]' : '[LIGHT]'} · Toggle
          </button>
        </div>
      </div>
    </>
  );
}
