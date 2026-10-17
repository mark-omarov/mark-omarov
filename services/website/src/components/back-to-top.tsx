'use client';

import { useEffect, useState } from 'react';

export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      className={`border-line bg-surface text-muted hover:text-fg hover:border-fg fixed bottom-6 right-6 z-40 border px-3 py-1.5 text-xs transition-all duration-200 ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      ↑ top
    </button>
  );
}
