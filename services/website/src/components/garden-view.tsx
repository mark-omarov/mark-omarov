'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Frame } from '~/art/frame';
import {
  createGarden,
  GARDEN_H,
  noteSeed,
  periodOf,
  type Stage,
} from '~/art/garden';
import { bubbleSide } from './bubble';

export type GardenNoteView = { slug: string; title: string; stage: Stage };

/** The blog's notes as a little pixel garden: hover a plant for its title, click to read. */
export function GardenView({
  notes,
  links,
}: {
  notes: GardenNoteView[];
  links: [number, number][];
}) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, scale: 3 });
  const [hovered, setHovered] = useState(-1);
  const hoveredRef = useRef(-1);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  // with reduced motion the garden only redraws when something changed
  const dirtyRef = useRef(true);
  const clockRef = useRef(0); // the time of the last frame drawn
  // the garden follows the visitor's own clock: dawn, day, dusk or night
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => {
    const now = () => {
      const d = new Date();
      return d.getHours() + d.getMinutes() / 60;
    };
    setHour(now());
    const id = window.setInterval(() => setHour(now()), 5 * 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const scale = window.matchMedia('(min-width: 48rem)').matches ? 3 : 2;
      const w = Math.ceil(wrap.clientWidth / scale);
      setSize((s) => (s.w === w && s.scale === scale ? s : { w, scale }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const garden = useMemo(
    () =>
      size.w && hour !== null
        ? createGarden(
            size.w,
            notes.map((n) => ({ stage: n.stage, seed: noteSeed(n.slug) })),
            links,
            hour
          )
        : null,
    // rebuild only when the part of the day changes, not every 5 minutes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size.w, notes, links, hour === null ? null : periodOf(hour)]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !garden) return;
    const f = new Frame(size.w, GARDEN_H);
    const image = new ImageData(f.rgba(), size.w, GARDEN_H);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => (visible = !!e?.isIntersecting)
    );
    io.observe(canvas);
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden || now - last < 1000 / 30) return;
      if (still && last && !dirtyRef.current) return;
      dirtyRef.current = false;
      last = now;
      clockRef.current = now;
      garden.render(
        f,
        still ? 5_000 : now,
        hoveredRef.current,
        pointerRef.current
      );
      ctx.putImageData(image, 0, 0);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [garden, size.w]);

  const toScene = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.floor(((e.clientX - r.left) / r.width) * size.w),
      y: Math.floor(((e.clientY - r.top) / r.height) * GARDEN_H),
    };
  };

  const spot = hovered >= 0 ? garden?.spots[hovered] : undefined;
  const note = hovered >= 0 ? notes[hovered] : undefined;

  return (
    <div
      ref={wrapRef}
      className="bg-bg-dark relative w-full overflow-hidden"
      style={{ height: GARDEN_H * size.scale }}
    >
      <canvas
        ref={canvasRef}
        width={size.w || 1}
        height={GARDEN_H}
        className="block [image-rendering:pixelated]"
        style={{ width: size.w * size.scale, height: GARDEN_H * size.scale }}
        role="img"
        aria-label={`A pixel-art garden with ${notes.length} ${notes.length === 1 ? 'note' : 'notes'} growing in it`}
        onPointerMove={(e) => {
          if (!garden) return;
          const p = toScene(e);
          pointerRef.current = p;
          dirtyRef.current = true;
          const i = garden.noteAt(p.x, p.y);
          hoveredRef.current = i;
          setHovered(i);
          e.currentTarget.style.cursor = garden.hot(p.x, p.y)
            ? 'pointer'
            : 'default';
        }}
        onPointerLeave={() => {
          pointerRef.current = null;
          dirtyRef.current = true;
          hoveredRef.current = -1;
          setHovered(-1);
        }}
        onPointerDown={(e) => {
          if (!garden) return;
          const p = toScene(e);
          const i = garden.noteAt(p.x, p.y);
          const target = notes[i];
          if (target) router.push(`/blog/${target.slug}`);
          else {
            garden.poke(p.x, p.y, clockRef.current || performance.now());
            dirtyRef.current = true;
          }
        }}
      />
      {spot && note && (
        <div
          className={`bubble pointer-events-none ${bubbleSide(spot.x, size.w, size.scale)}`}
          style={{
            left: (spot.x + 0.5) * size.scale,
            // the tail stops just above the bobbing arrow over the flower
            top: (spot.y - 12) * size.scale - 10,
          }}
        >
          {note.title}
        </div>
      )}
    </div>
  );
}
