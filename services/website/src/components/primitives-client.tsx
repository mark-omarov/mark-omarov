'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prm, setPrm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrm(mq.matches);
    const fn = (e: MediaQueryListEvent) => setPrm(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return prm;
}

export function useTokyoClock(): string {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    []
  );
  return now ? fmt.format(now) : '--:--:--';
}

export function useInView<T extends Element>(
  options: IntersectionObserverInit = { rootMargin: '-15% 0px -10% 0px' }
): [(el: T | null) => void, boolean] {
  const [seen, setSeen] = useState(false);
  const ref = useRef<T | null>(null);
  const setRef = (el: T | null) => {
    ref.current = el;
  };
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      });
    }, options);
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen, options]);
  return [setRef, seen];
}

interface CursorPlacerProps {
  punct?: string;
  delay?: number;
  tall?: boolean;
}

export function CursorPlacer({
  punct = '.',
  delay = 900,
  tall,
}: CursorPlacerProps) {
  const prm = usePrefersReducedMotion();
  const [phase, setPhase] = useState<'pre' | 'place' | 'rest'>(
    prm ? 'rest' : 'pre'
  );

  useEffect(() => {
    if (prm) return;
    const t1 = setTimeout(() => setPhase('place'), delay);
    const t2 = setTimeout(() => setPhase('rest'), delay + 280);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [prm, delay]);

  return (
    <span data-placer-phase={phase} className="inline-block whitespace-nowrap">
      <span
        aria-hidden={phase === 'pre' ? true : undefined}
        className="cursor-period text-bone inline-block"
      >
        {punct}
      </span>
      <span
        aria-hidden
        data-cursor-blink="true"
        className={`cursor-blink bg-signal inline-block w-[3px] align-[-0.04em] opacity-90 ${tall ? 'h-[0.8em]' : 'h-[0.78em]'}`}
      />
    </span>
  );
}

interface TypewriterProps {
  text: string;
  charDelay?: number;
  startDelay?: number;
  trigger?: boolean;
  storageKey?: string;
}

export function Typewriter({
  text,
  charDelay = 60,
  startDelay = 200,
  trigger = true,
  storageKey,
}: TypewriterProps) {
  const prm = usePrefersReducedMotion();
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    const alreadyPlayed = (() => {
      if (!storageKey || typeof sessionStorage === 'undefined') return false;
      try {
        return sessionStorage.getItem(storageKey) === '1';
      } catch {
        return false;
      }
    })();

    if (prm || alreadyPlayed || !trigger) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    let cancelled = false;
    const startT = setTimeout(function tick() {
      if (cancelled) return;
      i += 1;
      setCount(i);
      if (i >= text.length) {
        if (storageKey) {
          try {
            sessionStorage.setItem(storageKey, '1');
          } catch {
            // Ignore — sessionStorage unavailable.
          }
        }
        return;
      }
      setTimeout(tick, charDelay);
    }, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(startT);
    };
  }, [trigger, text, prm, storageKey, charDelay, startDelay]);

  return <span>{text.slice(0, count)}</span>;
}

/* Global scroll-reveal — finds [data-reveal] nodes and adds [data-revealed]
   when they enter the viewport. Mounted once per route. */
export function RevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      '[data-reveal]:not([data-revealed])'
    );
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
