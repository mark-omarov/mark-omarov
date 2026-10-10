'use client';

import { useEffect, useRef, useState } from 'react';
import { Frame, hex } from '~/art/frame';

const USER = 'omarov';
const W = 96;
const H = 28;

// badge colours for the loading animation
const BADGES = ['#f7768e', '#e0af68', '#9ece6a', '#7dcfff', '#bb9af7'].map(hex);
const RIM = hex('#c0caf5');
const SHADE = hex('#16161e');

/** A hexagonal pin badge, 7px wide, dropped onto the frame. */
function badge(f: Frame, cx: number, cy: number, c: number) {
  const rows = [
    '..xxx..',
    '.xxxxx.',
    'xxxxxxx',
    'xxxxxxx',
    'xxxxxxx',
    '.xxxxx.',
    '..xxx..',
  ];
  rows.forEach((r, y) =>
    [...r].forEach((ch, x) => {
      if (ch !== 'x') return;
      const edge =
        y === 0 ||
        x === 0 ||
        x === 6 ||
        y === 6 ||
        r[x - 1] === '.' ||
        r[x + 1] === '.';
      f.set(cx - 3 + x, cy - 3 + y, edge ? RIM : c);
    })
  );
  f.set(cx - 1, cy - 1, RIM);
  f.hline(cx - 2, cx + 2, cy + 4, SHADE);
}

/** Badges dropping in one by one, bouncing, then clearing for another go. */
function Loader() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const f = new Frame(W, H);
    const img = new ImageData(f.rgba(), W, H);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (!still) raf = requestAnimationFrame(tick);
      if (document.hidden || now - last < 1000 / 30) return;
      last = now;
      f.clear();
      // with reduced motion: one still frame, all the badges landed
      const cycle = still ? 2600 : now % 3200;
      BADGES.forEach((c, i) => {
        const at = i * 380;
        if (cycle < at) return;
        const a = (cycle - at) / 1000;
        // a drop with a little bounce, then everything lifts off together
        const fall = Math.min(1, a * 2.2);
        const bounce =
          a > 0.45
            ? Math.abs(Math.sin((a - 0.45) * 9)) *
              Math.max(0, 1 - (a - 0.45) * 2.5) *
              3
            : 0;
        const leave = cycle > 2700 ? (cycle - 2700) / 500 : 0;
        const y = Math.round(-6 + fall * 20 - bounce - leave * 30);
        badge(f, 12 + i * 18, y, c);
      });
      ctx.putImageData(img, 0, 0);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className="mx-auto block [image-rendering:pixelated]"
      style={{ width: W * 3, height: H * 3 }}
      aria-hidden
    />
  );
}

/** My Holopin board in a pixel frame. Holopin is often slow, so it gets a loader. */
export function HolopinBoard() {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const imgRef = useRef<HTMLImageElement>(null);

  // the image may have finished before hydration
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setState(img.naturalWidth ? 'ready' : 'failed');
  }, []);

  return (
    <a
      href={`https://holopin.io/@${USER}`}
      className="pixel-frame group block"
      aria-label="My Holopin badge board"
    >
      <span className="pixel-frame-studs" aria-hidden />
      {state !== 'ready' && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 py-6">
          {state === 'loading' ? (
            <>
              <Loader />
              <p className="text-muted text-xs">
                fetching badges from holopin…
              </p>
            </>
          ) : (
            <p className="text-muted text-sm">
              Holopin didn&apos;t answer.{' '}
              <span className="text-cyan link">See the board there</span>.
            </p>
          )}
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={`https://holopin.me/${USER}`}
        alt="My Holopin board: badges from events and open source"
        loading="lazy"
        onLoad={() => setState('ready')}
        onError={() => setState('failed')}
        className={
          state === 'ready'
            ? 'block w-full transition-opacity duration-500 group-hover:opacity-90'
            : 'absolute h-px w-px opacity-0'
        }
      />
    </a>
  );
}
