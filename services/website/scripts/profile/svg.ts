import { Frame, type RGB } from '../../src/art/frame';
import { measure, text } from '../../src/art/pixel-font';

export const css = (c: RGB) => `#${c.toString(16).padStart(6, '0')}`;

type Rect = { x: number; y: number; w: number; h: number; c: RGB };

/**
 * Every opaque pixel of f as SVG path data, one entry per colour. Runs of a
 * colour become rectangles, and runs repeating on the next row grow them
 * downwards, which keeps flat pixel art small.
 */
export function inked(f: Frame, ox = 0, oy = 0) {
  const rects: Rect[] = [];
  let open = new Map<string, Rect>();
  for (let y = 0; y < f.h; y++) {
    const next = new Map<string, Rect>();
    let x = 0;
    while (x < f.w) {
      if (!f.opaque(x, y)) {
        x++;
        continue;
      }
      const c = f.get(x, y);
      let end = x + 1;
      while (end < f.w && f.opaque(end, y) && f.get(end, y) === c) end++;
      const key = `${c}:${x}:${end}`;
      let r = open.get(key);
      if (r) r.h++;
      else {
        r = { x, y, w: end - x, h: 1, c };
        rects.push(r);
      }
      next.set(key, r);
      x = end;
    }
    open = next;
  }
  const out = new Map<RGB, string>();
  for (const r of rects)
    out.set(
      r.c,
      (out.get(r.c) ?? '') + `M${r.x + ox} ${r.y + oy}h${r.w}v${r.h}h-${r.w}z`
    );
  return out;
}

/** Paths for a whole frame, one <path> per colour. */
export function paths(f: Frame, ox = 0, oy = 0) {
  return [...inked(f, ox, oy)]
    .map(([c, d]) => `<path fill="${css(c)}" d="${d}"/>`)
    .join('');
}

/** Path data for a line of pixel text with its cap line at y. */
export function textD(s: string, x: number, y: number, bold = false) {
  const f = new Frame(measure(s, bold) + 2, 8);
  text(f, s, 0, 0, 0xffffff, bold);
  return [...inked(f, x, y).values()].join('');
}

/** Where the next character goes after s, starting at 0. */
export const advance = (s: string, bold = false) =>
  s ? measure(s, bold) + 1 + (bold ? 1 : 0) : 0;

/** Path data for a card with stepped pixel corners. */
export function card(w: number, h: number, inset = 0) {
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  return (
    `M${x0 + 3} ${y0}H${x1 - 3}v1h2v2h1V${y1 - 3}h-1v2h-2v1` +
    `H${x0 + 3}v-1h-2v-2h-1V${y0 + 3}h1v-2h2z`
  );
}

export function svg(w: number, h: number, scale: number, body: string) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ` +
    `width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">` +
    body +
    `</svg>\n`
  );
}
