'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Frame } from '~/art/frame';
import { noteSeed, type Stage } from '~/art/garden';
import { createLocalGraph, LOCAL_H } from '~/art/local-graph';
import { bubbleSide } from './bubble';

export type LocalGraphNode = {
  slug: string;
  title: string;
  stage: Stage;
  ring: 0 | 1 | 2;
};

const SCALE = 2;

/** A post's neighbours as a small pixel graph: hover for titles, click to go. */
function graphLabel(nodes: LocalGraphNode[]) {
  const near = nodes.filter((n) => n.ring === 1).length;
  const far = nodes.filter((n) => n.ring === 2).length;
  const notes = (n: number) => `${n} ${n === 1 ? 'note' : 'notes'}`;
  return `A small graph of ${notes(near)} linked to this one${
    far ? `, and ${notes(far)} a step further` : ''
  }`;
}

export function LocalGraph({
  nodes,
  edges,
}: {
  nodes: LocalGraphNode[];
  edges: [number, number][];
}) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [w, setW] = useState(0);
  const [hovered, setHovered] = useState(-1);
  const hoveredRef = useRef(-1);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => setW(Math.floor(wrap.clientWidth / SCALE));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const graph = useMemo(
    () =>
      w
        ? createLocalGraph(
            w,
            nodes.map((n) => ({ seed: noteSeed(n.slug), ring: n.ring })),
            edges
          )
        : null,
    [w, nodes, edges]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !graph) return;
    const f = new Frame(w, LOCAL_H);
    const image = new ImageData(f.rgba(), w, LOCAL_H);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => (visible = !!e?.isIntersecting)
    );
    io.observe(canvas);
    let raf = 0;
    let last = 0;
    let drawn = -2;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden || now - last < 1000 / 30) return;
      // with reduced motion, only redraw when the hover changed
      if (still && last && drawn === hoveredRef.current) return;
      drawn = hoveredRef.current;
      last = now;
      graph.render(f, still ? 5_000 : now, hoveredRef.current);
      ctx.putImageData(image, 0, 0);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [graph, w]);

  const at = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * w);
    const y = Math.floor(((e.clientY - r.top) / r.height) * LOCAL_H);
    return graph ? graph.nodeAt(x, y) : -1;
  };

  const spot = hovered >= 0 ? graph?.spots[hovered] : undefined;

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ height: LOCAL_H * SCALE }}
    >
      <canvas
        ref={canvasRef}
        width={w || 1}
        height={LOCAL_H}
        className="block [image-rendering:pixelated]"
        style={{ width: w * SCALE, height: LOCAL_H * SCALE }}
        role="img"
        aria-label={graphLabel(nodes)}
        onPointerMove={(e) => {
          const i = at(e);
          hoveredRef.current = i;
          setHovered(i);
          e.currentTarget.style.cursor = i > 0 ? 'pointer' : 'default';
        }}
        onPointerLeave={() => {
          hoveredRef.current = -1;
          setHovered(-1);
        }}
        onPointerDown={(e) => {
          const i = at(e);
          if (i > 0) router.push(`/blog/${nodes[i]!.slug}`);
        }}
      />
      {spot && nodes[hovered] && (
        <div
          className={`bubble pointer-events-none ${bubbleSide(spot.x, w, SCALE)}`}
          style={{ left: (spot.x + 0.5) * SCALE, top: (spot.y - 7) * SCALE }}
        >
          {hovered === 0 ? 'you are here' : nodes[hovered].title}
        </div>
      )}
    </div>
  );
}
