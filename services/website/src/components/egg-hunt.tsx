'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// The current place's easter eggs under the picture (hollow until found,
// gold once found), which react to taps hot or cold and give a hint when
// tapped, and the burst of pixels that flies from a found egg to its slot.

const COLORS = ['#fff3b0', '#ffd54a', '#e0af68', '#ff9e64', '#ffffff'];

// 7 wide, 9 tall
const EGG = [
  '..sss..',
  '.sssss.',
  '.sxsss.',
  'sssssxs',
  'ssxsssd',
  'ssssssd',
  'ssssxsd',
  '.ssssd.',
  '..ddd..',
];
const RIM = [
  '..ooo..',
  '.o...o.',
  '.o...o.',
  'o.....o',
  'o.....o',
  'o.....o',
  'o.....o',
  '.o...o.',
  '..ooo..',
];

/** A little pixel egg: gold and speckled once found, a dim outline before. */
export function EggIcon({ found }: { found: boolean }) {
  const rows = found ? EGG : RIM;
  const fill = (ch: string) =>
    ch === 'x'
      ? '#fff3b0'
      : ch === 'd'
        ? '#c88a1e'
        : ch === 'o'
          ? '#565f89'
          : '#ffd54a';
  return (
    <svg
      viewBox="0 0 7 9"
      width={7 * 2}
      height={9 * 2}
      shapeRendering="crispEdges"
      aria-hidden
      className="block"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === '.' ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={fill(ch)}
            />
          )
        )
      )}
    </svg>
  );
}

export type Mood = 'cold' | 'warm' | 'hot';

type SlotsProps = {
  /** this place's eggs, in order */
  eggs: { id: string; found: boolean }[];
  foundAll: number;
  total: number;
  /** how close the last tap was, and a key so the same mood replays */
  mood: { mood: Mood; key: number } | null;
  /** a short note over the eggs, e.g. "6/25 found" */
  note: string | null;
  slotRefs: React.RefObject<Map<string, HTMLSpanElement>>;
  onHint: () => void;
  onReset: () => void;
};

/**
 * One egg per egg hidden in this place. Tapping them opens a little menu:
 * a hint, or starting the whole hunt over.
 */
export function EggSlots({
  eggs,
  foundAll,
  total,
  mood,
  note,
  slotRefs,
  onHint,
  onReset,
}: SlotsProps) {
  const [open, setOpen] = useState(false);
  const [sure, setSure] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);
  const here = eggs.filter((e) => e.found).length;

  // close on a click elsewhere or Esc
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', away);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', away);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);
  useEffect(() => {
    if (!open) setSure(false);
  }, [open]);

  return (
    <span ref={wrap} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Easter eggs here: ${here} of ${eggs.length} found (${foundAll} of ${total} overall)`}
        aria-expanded={open}
        aria-haspopup="true"
        title={`${foundAll}/${total} eggs found`}
        className={`egg-slots ${mood ? `is-${mood.mood}` : ''}`}
        // a new key restarts the mood animation
        key={mood?.key ?? 0}
      >
        {eggs.map((e) => (
          <span
            key={e.id}
            ref={(el) => {
              if (el) slotRefs.current.set(e.id, el);
              else slotRefs.current.delete(e.id);
            }}
          >
            <EggIcon found={e.found} />
          </span>
        ))}
      </button>
      {note && !open && (
        <span className="egg-note" aria-live="polite">
          {note}
        </span>
      )}
      {open && (
        <span className="egg-menu pixel-frame">
          <span className="text-muted block pb-1">
            {foundAll}/{total} eggs found
          </span>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onHint();
            }}
          >
            show me a hint
          </button>
          <button
            type="button"
            onClick={() => {
              if (!sure) return setSure(true);
              setOpen(false);
              onReset();
            }}
            className={sure ? 'text-red' : ''}
          >
            {sure ? `sure? forget all ${foundAll}` : 'start the hunt over'}
          </button>
        </span>
      )}
    </span>
  );
}

type Particle = {
  delay: number;
  dur: number;
  /** where it pops out to first, relative to the egg */
  ox: number;
  oy: number;
  bend: number;
  color: string;
  size: number;
};
type Burst = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  start: number;
  parts: Particle[];
};

const easeOut = (u: number) => 1 - (1 - u) ** 3;
const easeIn = (u: number) => u * u * u;
const POP = 0.28; // the share of a flight spent popping out of the egg

/** Where a particle is at u (0..1 of its flight). */
function at(b: Burst, p: Particle, u: number) {
  const px = b.from.x + p.ox;
  const py = b.from.y + p.oy;
  if (u < POP) {
    const k = easeOut(u / POP);
    return { x: b.from.x + p.ox * k, y: b.from.y + p.oy * k };
  }
  // then a curve over to the counter, speeding up as it homes in
  const k = easeIn((u - POP) / (1 - POP));
  const cx = (px + b.to.x) / 2 + p.bend;
  const cy = Math.min(py, b.to.y) - 70;
  return {
    x: (1 - k) ** 2 * px + 2 * (1 - k) * k * cx + k * k * b.to.x,
    y: (1 - k) ** 2 * py + 2 * (1 - k) * k * cy + k * k * b.to.y,
  };
}

/**
 * Pixels that pop out of a found egg and fly to its slot. Returns a
 * function that launches a burst and calls `arrived` as the first land.
 */
export function useEggBurst(scale: number) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);

  const launch = useCallback(
    (
      from: { x: number; y: number },
      target: HTMLElement | null | undefined,
      arrived: () => void
    ) => {
      if (!target) return arrived();
      const r = target.getBoundingClientRect();
      const to = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      const parts: Particle[] = Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2 + Math.random() * 0.4;
        const d = 18 + Math.random() * 34;
        return {
          delay: Math.random() * 120,
          dur: 820 + Math.random() * 420,
          ox: Math.cos(a) * d,
          oy: Math.sin(a) * d * 0.8 - 10,
          bend: (Math.random() - 0.5) * 260,
          color: COLORS[i % COLORS.length]!,
          size: scale * (i % 3 === 0 ? 3 : 2),
        };
      });
      const start = performance.now();
      setBursts((b) => [...b, { from, to, start, parts }]);
      const first = Math.min(...parts.map((p) => p.delay + p.dur));
      window.setTimeout(arrived, first);
    },
    [scale]
  );

  useEffect(() => {
    if (!bursts.length) return;
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const dot = (x: number, y: number, s: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(x / scale) * scale,
        Math.round(y / scale) * scale,
        s,
        s
      );
    };
    let raf = 0;
    const tick = (now: number) => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      for (const b of bursts) {
        let landed = 0;
        for (const p of b.parts) {
          const u = (now - b.start - p.delay) / p.dur;
          if (u >= 1) {
            landed++;
            continue;
          }
          alive = true;
          if (u < 0) continue;
          // a short fading trail behind each one
          for (let k = 3; k >= 1; k--) {
            const q = at(b, p, Math.max(0, u - k * 0.025));
            ctx.globalAlpha = 0.18 * (4 - k);
            dot(q.x, q.y, Math.max(scale, p.size - scale), p.color);
          }
          ctx.globalAlpha = 1;
          const q = at(b, p, u);
          dot(q.x, q.y, p.size, p.color);
        }
        // a flash on the counter while they land
        if (landed > 0 && landed < b.parts.length) {
          const f = 2 + (landed % 3);
          for (let k = -f; k <= f; k++) {
            dot(b.to.x + k * scale, b.to.y, scale, '#fff3b0');
            dot(b.to.x, b.to.y + k * scale, scale, '#fff3b0');
          }
        }
      }
      if (alive) raf = requestAnimationFrame(tick);
      else setBursts([]);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bursts, scale]);

  const overlay =
    bursts.length > 0
      ? createPortal(
          <canvas
            ref={canvas}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-40"
          />,
          document.body
        )
      : null;

  return { launch, overlay };
}
