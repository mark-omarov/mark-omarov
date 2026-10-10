// A post's neighbourhood, like Obsidian's local graph: the note in the
// middle, the notes it links to and the ones linking to it around it, and
// one more hop out, fainter. Same flower colours as in the garden. Links are
// dotted trails with little sparks running from the note that links to the
// note it links to.

import { type Frame, hex, lerpRGB, type RGB } from './frame';
import { noteColors } from './garden';
import { hash2 } from './noise';
import { glow, stars } from './paint';
import { layer } from './scene';

export const LOCAL_H = 96;

export type LocalNode = { seed: number; ring: 0 | 1 | 2 };

const BG = hex('#16161e');
const BG2 = hex('#1a1b2a');
const TRAIL = hex('#2f334d');
const STAR = hex('#3a3f5c');

export function createLocalGraph(
  w: number,
  nodes: LocalNode[],
  edges: [number, number][]
) {
  const h = LOCAL_H;
  const cx = w / 2;
  const cy = h / 2;

  // place rings around the centre, then nudge apart anything too close.
  // Notes in the first ring that link to each other sit side by side, and
  // two of them don't sit straight across from each other: a link right
  // across the ring would run behind the centre note, out of sight.
  const linked = (a: number, b: number) =>
    edges.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
  const unplaced = nodes.map((n, i) => i).filter((i) => nodes[i]!.ring === 1);
  const ring1: number[] = [];
  while (unplaced.length) {
    const last = ring1[ring1.length - 1];
    const next =
      last === undefined ? -1 : unplaced.findIndex((i) => linked(last, i));
    ring1.push(unplaced.splice(Math.max(0, next), 1)[0]!);
  }
  const step = (Math.PI * 2) / (ring1.length === 2 ? 3 : ring1.length);
  const pos = nodes.map(() => ({ x: cx, y: cy }));
  ring1.forEach((i, k) => {
    const a = Math.PI / 2 + (k - (ring1.length - 1) / 2) * step;
    pos[i] = { x: cx + Math.cos(a) * w * 0.24, y: cy + Math.sin(a) * h * 0.3 };
  });
  nodes.forEach((n, i) => {
    if (n.ring !== 2) return;
    // sit outside whichever first-ring note leads here
    const parent = edges
      .map(([a, b]) => (a === i ? b : b === i ? a : -1))
      .find((p) => p >= 0 && nodes[p]!.ring === 1);
    const base = parent === undefined ? { x: cx, y: cy } : pos[parent]!;
    const ang =
      Math.atan2(base.y - cy, base.x - cx) + (hash2(n.seed, 1, 8) - 0.5) * 1.2;
    pos[i] = {
      x: cx + Math.cos(ang) * w * 0.42,
      y: cy + Math.sin(ang) * h * 0.42,
    };
  });
  const movable = (i: number) => nodes[i]!.ring !== 0;
  const links = edges.filter(
    ([a, b]) => a !== b && pos[a] !== undefined && pos[b] !== undefined
  );
  for (let iter = 0; iter < 60; iter++) {
    for (let i = 0; i < pos.length; i++)
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[j]!.x - pos[i]!.x;
        const dy = pos[j]!.y - pos[i]!.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d > 18) continue;
        const push = (18 - d) / 2;
        if (movable(i)) {
          pos[i]!.x -= (dx / d) * push;
          pos[i]!.y -= (dy / d) * push;
        }
        if (movable(j)) {
          pos[j]!.x += (dx / d) * push;
          pos[j]!.y += (dy / d) * push;
        }
      }
    // no link may run across a note it doesn't join (two neighbours of the
    // centre that link to each other would otherwise hide their link behind
    // the centre's own): the note and the link's ends move apart
    for (const [a, b] of links) {
      const p = pos[a]!;
      const q = pos[b]!;
      const ex = q.x - p.x;
      const ey = q.y - p.y;
      const len2 = ex * ex + ey * ey;
      if (len2 < 1) continue;
      for (let c = 0; c < pos.length; c++) {
        if (c === a || c === b) continue;
        const s = pos[c]!;
        const u = ((s.x - p.x) * ex + (s.y - p.y) * ey) / len2;
        if (u <= 0.05 || u >= 0.95) continue;
        let nx = s.x - (p.x + u * ex);
        let ny = s.y - (p.y + u * ey);
        let d = Math.hypot(nx, ny);
        const need = nodes[c]!.ring === 0 ? 9 : 7;
        if (d >= need) continue;
        if (d < 0.01) {
          // right on the line: step off it to one side
          nx = -ey;
          ny = ex;
          d = Math.hypot(nx, ny);
        }
        const push = (need - d) / 2;
        nx /= d;
        ny /= d;
        if (movable(c)) {
          s.x += nx * push;
          s.y += ny * push;
        }
        for (const [k, share] of [
          [a, 1 - u],
          [b, u],
        ] as const)
          if (movable(k)) {
            pos[k]!.x -= nx * push * share * 2;
            pos[k]!.y -= ny * push * share * 2;
          }
      }
    }
    for (const p of pos) {
      p.x = Math.max(8, Math.min(w - 8, p.x));
      p.y = Math.max(8, Math.min(h - 8, p.y));
    }
  }
  const spots = pos.map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) }));
  const colors = nodes.map((n) => noteColors(n.seed));
  const radius = (i: number) =>
    nodes[i]!.ring === 0 ? 4 : nodes[i]!.ring === 1 ? 3 : 2;

  // each edge as a list of pixels
  const lines = edges.map(([a, b]) => {
    const p = spots[a]!;
    const q = spots[b]!;
    const n = Math.max(Math.abs(q.x - p.x), Math.abs(q.y - p.y));
    const pts: [number, number][] = [];
    for (let k = 0; k <= n; k++)
      pts.push([
        Math.round(p.x + ((q.x - p.x) * k) / n),
        Math.round(p.y + ((q.y - p.y) * k) / n),
      ]);
    return { a, b, pts };
  });

  const bg = layer(w, h, (f) => {
    f.rect(0, 0, w, h, BG);
    for (let y = 0; y < h; y++) if (y % 4 === 0) f.hline(0, w, y, BG2);
    stars(f, 77, Math.round(w / 9), h, 0, [STAR], false);
  });

  function bloom(f: Frame, x: number, y: number, r: number, c: RGB, core: RGB) {
    f.disc(x, y, r, (dx, dy) => {
      const d = Math.hypot(dx, dy);
      if (r > 2 && d > r - 0.6 && Math.round(Math.atan2(dy, dx) * 2.5) & 1)
        return null;
      return d < r * 0.45 ? core : c;
    });
  }

  const nodeAt = (x: number, y: number) => {
    let best = -1;
    let bestD = 7;
    spots.forEach((s, i) => {
      const d = Math.hypot(x - s.x, y - s.y);
      if (d < bestD) {
        best = i;
        bestD = d;
      }
    });
    return best;
  };

  return {
    spots,
    nodeAt,
    render(f: Frame, t: number, hovered = -1) {
      f.copyFrom(bg);
      const focus = hovered >= 0 ? hovered : 0;
      // trails: dotted, with sparks running along the ones touching the focus
      lines.forEach((l, k) => {
        const on = l.a === focus || l.b === focus;
        const [c] = colors[on ? focus : l.a]!;
        const flow = Math.floor(t / 80);
        l.pts.forEach(([x, y], i) => {
          if (i % 2) return;
          f.set(x, y, on ? lerpRGB(TRAIL, c, 0.45) : TRAIL);
        });
        if (on)
          for (let i = 0; i < l.pts.length; i++) {
            if ((((i - flow - k * 3) % 9) + 9) % 9) continue;
            const [x, y] = l.pts[i]!;
            f.set(x, y, colors[focus]![1]);
            f.blend(x, y - 1, c, 0.4);
            f.blend(x, y + 1, c, 0.4);
          }
      });
      // the notes, breathing, the focus brightest
      nodes.forEach((n, i) => {
        const s = spots[i]!;
        const [c, core] = colors[i]!;
        const near = lines.some(
          (l) => (l.a === focus && l.b === i) || (l.b === focus && l.a === i)
        );
        const strength =
          i === focus ? 0.55 : near ? 0.4 : n.ring === 2 ? 0.15 : 0.25;
        glow(
          f,
          s.x,
          s.y,
          radius(i) + 5,
          c,
          strength + Math.sin(t / 1200 + i) * 0.05,
          1,
          0.08
        );
        bloom(
          f,
          s.x,
          s.y,
          radius(i),
          n.ring === 2 && i !== focus ? lerpRGB(c, BG, 0.35) : c,
          core
        );
      });
      // a little marker over the hovered note
      const hs = spots[hovered];
      if (hs) {
        const ay = hs.y - radius(hovered) - 4 + Math.round(Math.sin(t / 160));
        f.hline(hs.x - 1, hs.x + 1, ay - 1, colors[hovered]![1]);
        f.set(hs.x, ay, colors[hovered]![0]);
      }
    },
  };
}
