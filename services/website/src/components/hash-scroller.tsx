'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Mounted once at the layout level. Two responsibilities:
 *
 * 1. Click delegation: when any <a href="...#id"> targets a node already on
 *    the current page, scroll to it manually. This fixes the silent no-op
 *    that both the browser and Next's <Link> hit when the URL already
 *    contains the same hash (e.g. clicking "Get in touch" twice).
 *
 * 2. Route-change scroll: when navigation lands on a URL with a hash
 *    (e.g. /projects → /#contact), scroll to the target after mount.
 *    Native browser scroll-on-load doesn't fire for client-side
 *    transitions in App Router.
 *
 * Smoothness is handled in CSS (`html { scroll-behavior: smooth }`), with
 * `prefers-reduced-motion` opting out automatically.
 */
export function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;

      const anchor = (e.target as Element | null)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      const hashIdx = href.indexOf('#');
      if (hashIdx === -1) return;

      const targetPath = href.slice(0, hashIdx);
      const id = href.slice(hashIdx + 1);
      if (!id) return;

      const samePage =
        targetPath === '' ||
        targetPath === window.location.pathname ||
        (targetPath === '/' && window.location.pathname === '/');
      if (!samePage) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ block: 'start' });

      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}#${id}`
        );
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Reset scroll on every route change. With a hash, scroll to the target;
  // without one, scroll to top. Done instantly via a temporary scroll-behavior
  // override — the CSS smooth-scroll only makes sense for in-page link clicks,
  // not for navigation between routes.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    requestAnimationFrame(() => {
      if (id) {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ block: 'start' });
        }
      } else {
        window.scrollTo(0, 0);
      }
      html.style.scrollBehavior = prev;
    });
  }, [pathname]);

  return null;
}
