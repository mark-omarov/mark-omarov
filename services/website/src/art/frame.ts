// A tiny framebuffer for pixel art. Works the same in the browser (blitted to a
// canvas with putImageData) and in Node (handed to sharp for OG images), so a
// scene is pure code that draws into memory.
//
// Colours are plain 0xRRGGBB numbers. Pixels are stored as ABGR uint32s,
// which is what ImageData expects on little-endian machines (all of them).

export type RGB = number;

export const hex = (s: string): RGB => parseInt(s.replace('#', ''), 16);

const toPixel = (c: RGB) =>
  (0xff000000 | ((c & 0xff) << 16) | (c & 0xff00) | ((c >>> 16) & 0xff)) >>> 0;

const fromPixel = (p: number): RGB =>
  ((p & 0xff) << 16) | (p & 0xff00) | ((p >>> 16) & 0xff);

// 4x4 ordered-dither thresholds in [0, 1).
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => (v + 0.5) / 16
);

// 8x8, used for the dissolve between scenes (smoother steps).
const BAYER8: number[] = (() => {
  const m = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ];
  return m.flat().map((v) => (v + 0.5) / 64);
})();

export const bayer = (x: number, y: number) => BAYER4[(y & 3) * 4 + (x & 3)]!;
export const bayer8 = (x: number, y: number) => BAYER8[(y & 7) * 8 + (x & 7)]!;

/** True on a fraction `a` of pixels, in an ordered-dither pattern. */
export const dither = (x: number, y: number, a: number) => a > bayer(x, y);

export function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  const ar = a >> 16,
    ag = (a >> 8) & 0xff,
    ab = a & 0xff;
  const br = b >> 16,
    bg = (b >> 8) & 0xff,
    bb = b & 0xff;
  return (
    (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
    Math.round(ab + (bb - ab) * t)
  );
}

export class Frame {
  readonly w: number;
  readonly h: number;
  readonly pixels: Uint32Array;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.pixels = new Uint32Array(w * h);
  }

  clear() {
    this.pixels.fill(0);
  }

  set(x: number, y: number, c: RGB) {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.pixels[y * this.w + x] = toPixel(c);
  }

  /** Sets the pixel on a fraction `a` of positions (ordered dither). */
  dset(x: number, y: number, c: RGB, a: number) {
    if (a >= 1 || dither(x | 0, y | 0, a)) this.set(x, y, c);
  }

  /** Alpha-blends a colour over whatever is there (for light, not for drawing). */
  blend(x: number, y: number, c: RGB, a: number) {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || a <= 0) return;
    const i = y * this.w + x;
    const p = this.pixels[i]!;
    if (!(p >>> 24)) return;
    this.pixels[i] = toPixel(lerpRGB(fromPixel(p), c, Math.min(1, a)));
  }

  get(x: number, y: number): RGB {
    x = Math.max(0, Math.min(this.w - 1, x | 0));
    y = Math.max(0, Math.min(this.h - 1, y | 0));
    return fromPixel(this.pixels[y * this.w + x]!);
  }

  opaque(x: number, y: number) {
    x |= 0;
    y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return false;
    return this.pixels[y * this.w + x]! >>> 24 !== 0;
  }

  rect(x: number, y: number, w: number, h: number, c: RGB) {
    const x0 = Math.max(0, Math.round(x));
    const y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(this.w, Math.round(x + w));
    const y1 = Math.min(this.h, Math.round(y + h));
    const p = toPixel(c);
    for (let yy = y0; yy < y1; yy++)
      this.pixels.fill(p, yy * this.w + x0, yy * this.w + x1);
  }

  /** Dithered translucent rectangle. */
  drect(x: number, y: number, w: number, h: number, c: RGB, a: number) {
    for (let yy = Math.round(y); yy < Math.round(y + h); yy++)
      for (let xx = Math.round(x); xx < Math.round(x + w); xx++)
        this.dset(xx, yy, c, a);
  }

  hline(x0: number, x1: number, y: number, c: RGB) {
    this.rect(Math.min(x0, x1), y, Math.abs(x1 - x0) + 1, 1, c);
  }

  vline(x: number, y0: number, y1: number, c: RGB) {
    this.rect(x, Math.min(y0, y1), 1, Math.abs(y1 - y0) + 1, c);
  }

  line(x0: number, y0: number, x1: number, y1: number, c: RGB) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  /** Filled circle; `shade` can pick a colour per pixel (dx, dy from centre). */
  disc(
    cx: number,
    cy: number,
    r: number,
    c: RGB | ((dx: number, dy: number) => RGB | null)
  ) {
    const rr = r * r + r * 0.6;
    for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++) {
      for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
        if (dx * dx + dy * dy > rr) continue;
        const col = typeof c === 'function' ? c(dx, dy) : c;
        if (col !== null)
          this.set(Math.round(cx) + dx, Math.round(cy) + dy, col);
      }
    }
  }

  /** Even-odd scanline fill of a polygon given as [x, y] pairs. */
  poly(
    points: [number, number][],
    c: RGB | ((x: number, y: number) => RGB | null)
  ) {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [, y] of points) {
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    for (
      let y = Math.max(0, Math.floor(minY));
      y <= Math.min(this.h - 1, Math.ceil(maxY));
      y++
    ) {
      const sy = y + 0.5;
      const xs: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const [ax, ay] = points[i]!;
        const [bx, by] = points[(i + 1) % points.length]!;
        if (ay > sy !== by > sy)
          xs.push(ax + ((sy - ay) * (bx - ax)) / (by - ay));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        for (let x = Math.round(xs[i]!); x < Math.round(xs[i + 1]!); x++) {
          const col = typeof c === 'function' ? c(x, y) : c;
          if (col !== null) this.set(x, y, col);
        }
      }
    }
  }

  /** Copies another frame of the same size over this one, skipping transparent pixels. */
  over(src: Frame, dx = 0, dy = 0, wrap = false) {
    const { w, h } = this;
    for (let y = 0; y < src.h; y++) {
      const ty = y + dy;
      if (ty < 0 || ty >= h) continue;
      for (let x = 0; x < src.w; x++) {
        let tx = x + dx;
        if (wrap) tx = ((tx % w) + w) % w;
        else if (tx < 0 || tx >= w) continue;
        const p = src.pixels[y * src.w + x]!;
        if (p >>> 24) this.pixels[ty * w + tx] = p;
      }
    }
  }

  /** Draws a horizontally tiling layer scrolled by `offset` px (parallax). */
  scroll(src: Frame, offset: number, dy = 0) {
    const { w, h } = this;
    const sw = src.w;
    const o = ((Math.round(offset) % sw) + sw) % sw;
    for (let y = 0; y < src.h; y++) {
      const ty = y + dy;
      if (ty < 0 || ty >= h) continue;
      const row = y * sw;
      for (let x = 0; x < w; x++) {
        let sx = x + o;
        if (sx >= sw) sx -= sw;
        if (sx >= sw) sx %= sw;
        const p = src.pixels[row + sx]!;
        if (p >>> 24) this.pixels[ty * w + x] = p;
      }
    }
  }

  copyFrom(src: Frame) {
    this.pixels.set(src.pixels);
  }

  rgba() {
    return new Uint8ClampedArray(
      this.pixels.buffer,
      this.pixels.byteOffset,
      this.pixels.byteLength
    );
  }
}

/** A sprite drawn from strings: one char per pixel, '.' or ' ' is transparent. */
export function sprite(
  f: Frame,
  rows: readonly string[],
  x: number,
  y: number,
  palette: Record<string, RGB>,
  flip = false
) {
  const w = Math.max(...rows.map((r) => r.length));
  rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const c = palette[row[rx]!];
      if (c === undefined) continue;
      f.set(Math.round(x) + (flip ? w - 1 - rx : rx), Math.round(y) + ry, c);
    }
  });
}
