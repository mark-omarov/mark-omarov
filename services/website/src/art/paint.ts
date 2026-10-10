// Reusable pixel-art painters. Everything snaps to the pixel grid and blends
// with ordered dithering instead of alpha, which is what keeps it looking
// like pixel art rather than a blurry downscale.

import { bayer, dither, type Frame, lerpRGB, type RGB } from './frame';
import { fbm1, hash2, noise1 } from './noise';

/**
 * Vertical ramp through `colors`: clean horizontal bands of interpolated
 * colour, with a single checkered row where one band meets the next.
 */
export function gradient(
  f: Frame,
  y0: number,
  y1: number,
  colors: RGB[],
  x0 = 0,
  x1 = f.w
) {
  const n = colors.length - 1;
  const span = Math.max(1, y1 - y0);
  const bands = Math.max(n + 1, Math.round(span / 5));
  const colorAt = (band: number) => {
    const t = (band / Math.max(1, bands - 1)) * n;
    const i = Math.min(n - 1, Math.floor(t));
    return lerpRGB(colors[i]!, colors[i + 1]!, t - i);
  };
  for (let y = Math.max(0, y0); y < Math.min(f.h, y1); y++) {
    const pos = ((y - y0) / span) * bands;
    const band = Math.min(bands - 1, Math.floor(pos));
    const c = colorAt(band);
    const edge = pos - band < 1 / (span / bands) && band > 0;
    const prev = edge ? colorAt(band - 1) : c;
    for (let x = x0; x < x1; x++)
      f.set(x, y, edge && (x + y) % 2 === 0 ? prev : c);
  }
}

/** Soft radial light, dithered. */
export function glow(
  f: Frame,
  cx: number,
  cy: number,
  r: number,
  c: RGB,
  strength = 0.6,
  squashY = 1,
  min = 0.12
) {
  for (let y = Math.floor(cy - r * squashY); y <= cy + r * squashY; y++) {
    for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      const d = Math.hypot(x - cx, (y - cy) / squashY) / r;
      if (d >= 1) continue;
      // stepped rings: a bright core and quieter bands around it
      const ring = Math.ceil((1 - d) * 4) / 4;
      const a = strength * ring * ring;
      if (a >= min * 0.5) f.blend(x, y, c, a);
    }
  }
}

export function stars(
  f: Frame,
  seed: number,
  count: number,
  yMax: number,
  t: number,
  colors: RGB[],
  twinkle = true
) {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(hash2(i, 1, seed) * f.w);
    const y = Math.floor(Math.pow(hash2(i, 2, seed), 1.4) * yMax);
    const phase = hash2(i, 3, seed) * Math.PI * 2;
    const tw = twinkle ? Math.sin(t / 700 + phase) : 1;
    if (tw < -0.6) continue;
    const c = colors[i % colors.length]!;
    f.set(x, y, c);
    // a few bright ones get a tiny cross
    if (hash2(i, 4, seed) > 0.94 && tw > 0.5) {
      f.set(x - 1, y, colors[colors.length - 1]!);
      f.set(x + 1, y, colors[colors.length - 1]!);
      f.set(x, y - 1, colors[colors.length - 1]!);
      f.set(x, y + 1, colors[colors.length - 1]!);
    }
  }
}

export function moon(
  f: Frame,
  cx: number,
  cy: number,
  r: number,
  colors: { light: RGB; mid: RGB; dark: RGB },
  phase = 0.5
) {
  const k = Math.cos(phase * Math.PI * 2);
  f.disc(cx, cy, r, (dx, dy) => {
    const hw = Math.sqrt(Math.max(0, r * r - dy * dy)) + 0.5;
    const lit = phase < 0.5 ? dx >= hw * k : dx <= -hw * k;
    if (!lit) return null;
    // a couple of craters
    const crater =
      (dx - 1) ** 2 + (dy + 1) ** 2 < 2 || (dx + 2) ** 2 + (dy - 2) ** 2 < 1.5;
    return crater ? colors.mid : dx + dy > r * 0.7 ? colors.mid : colors.light;
  });
}

// ---------- clouds ----------

export type CloudStyle = {
  light: RGB;
  base: RGB;
  shadow: RGB;
};

/**
 * Pixel cumulus. Draws into a layer that tiles horizontally (period = f.w)
 * so it can scroll forever without a seam.
 */
export function clouds(
  f: Frame,
  opts: {
    seed: number;
    y0: number;
    y1: number;
    cell: number; // size of a noise cell in pixels
    coverage: number; // 0..1
    stretch?: number;
    style: CloudStyle;
    /** city clouds at night are lit from underneath */
    litFromBelow?: boolean;
  }
) {
  const { seed, y0, y1, coverage, style } = opts;
  const stretch = opts.stretch ?? 2.5;
  const cellsX = Math.max(1, Math.round(f.w / (opts.cell * stretch)));
  const cellW = f.w / cellsX;
  const density = (x: number, y: number) => {
    const v = (y - y0) / (y1 - y0);
    if (v < 0 || v > 1) return -1;
    // flat-ish bottoms, rounded tops
    const profile =
      v < 0.7
        ? Math.sin((v / 0.7) * (Math.PI / 2))
        : 1 - ((v - 0.7) / 0.3) ** 3;
    const n = periodicFbm(x / cellW, y / opts.cell, cellsX, seed);
    return n * profile - (1 - coverage) * 0.75;
  };
  for (let y = Math.max(0, y0); y < Math.min(f.h, y1); y++) {
    for (let x = 0; x < f.w; x++) {
      const d = density(x, y);
      if (d <= 0) continue;
      let up = density(x - 1, y - 2);
      let down = density(x + 1, y + 2);
      if (opts.litFromBelow) [up, down] = [down, up];
      let c = style.base;
      if (up <= 0) c = style.light;
      else if (down <= 0 || d < 0.025) c = style.shadow;
      else if (up < 0.03 && dither(x, y, 0.5)) c = style.light;
      f.set(x, y, c);
    }
  }
}

function periodicNoise(x: number, y: number, period: number, seed: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const wrap = (i: number) => ((i % period) + period) % period;
  const a = hash2(wrap(ix), iy, seed);
  const b = hash2(wrap(ix + 1), iy, seed);
  const c = hash2(wrap(ix), iy + 1, seed);
  const d = hash2(wrap(ix + 1), iy + 1, seed);
  return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
}

function periodicFbm(x: number, y: number, period: number, seed: number) {
  let sum = 0;
  let amp = 0.55;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < 4; o++) {
    sum +=
      periodicNoise(x * freq, y * freq, period * freq, seed + o * 13) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

// ---------- terrain ----------

export type RidgeStyle = {
  lit: RGB;
  base: RGB;
  shade: RGB;
  snow?: { lit: RGB; shade: RGB; line: number };
};

/**
 * A mountain range. Heights come from ridged fbm; faces turned towards the
 * light (from the left by default) get the lit colour along the ridge.
 * Returns the ridge heights so callers can place things on it.
 */
export function ridge(
  f: Frame,
  opts: {
    seed: number;
    base: number; // y of the lowest part
    amp: number;
    scale: number; // px per noise unit
    style: RidgeStyle;
    sharp?: number; // 0 = rolling hills, 1 = jagged peaks
    lightFromLeft?: boolean;
    bottom?: number;
    shape?: (x: number) => number; // extra height in px (e.g. a big peak)
  }
) {
  const { seed, base, amp, scale, style } = opts;
  const sharp = opts.sharp ?? 0.5;
  const bottom = opts.bottom ?? f.h;
  const heights: number[] = [];
  for (let x = -2; x < f.w + 2; x++) {
    const n = fbm1(x / scale, seed, 5);
    const ridged = 1 - Math.abs(2 * n - 1);
    const v = n * (1 - sharp) + ridged * sharp;
    heights[x + 2] = base - v * amp - (opts.shape?.(x) ?? 0);
  }
  const H = (x: number) =>
    heights[Math.max(0, Math.min(heights.length - 1, x + 2))]!;
  const left = opts.lightFromLeft ?? true;
  for (let x = 0; x < f.w; x++) {
    const top = Math.round(H(x));
    // slope over a few px; positive = ground falls away to the right
    const slope = (H(x + 3) - H(x - 3)) / 6;
    const toLight = left ? slope : -slope;
    // band depth grows with steepness; gentle slopes stay flat-coloured
    const band = Math.min(14, Math.abs(toLight) * 16);
    for (let y = Math.max(0, top); y < Math.min(bottom, f.h); y++) {
      const depth = y - top;
      let c = style.base;
      if (band > 1 && depth < band + 2) {
        const a = depth < band ? 1 : 1 - (depth - band) / 2;
        if (dither(x, y, a)) c = toLight > 0 ? style.lit : style.shade;
      }
      if (depth === 0 && toLight > -0.05) c = style.lit; // catch the light on the crest
      if (style.snow && y < style.snow.line + noise1(x / 3, seed + 5) * 4) {
        c = toLight < 0 ? style.snow.shade : style.snow.lit;
      }
      f.set(x, y, c);
    }
  }
  return H;
}

// ---------- water ----------

export type WaterStyle = {
  colors: RGB[]; // top (far) to bottom (near)
  highlight: RGB;
  shine?: RGB;
};

/** Glittering path of light on water under the sun or moon. */
export function lightPath(
  f: Frame,
  cx: number,
  y0: number,
  y1: number,
  c: RGB,
  t: number,
  width = 6
) {
  for (let y = y0; y < y1; y++) {
    const depth = (y - y0) / Math.max(1, y1 - y0);
    const w = width * (0.5 + depth * 1.6);
    for (let i = 0; i < 3 + depth * 4; i++) {
      const ph = hash2(i, y, 77);
      if (Math.sin(t / 380 + ph * 30) < 0.2) continue;
      const x = Math.round(cx + (hash2(i, y, 78) - 0.5) * 2 * w);
      const len = 1 + Math.round(hash2(i, y, 79) * (1 + depth * 3));
      f.hline(x, x + len - 1, y, c);
    }
  }
}

// ---------- plants ----------

export type TreeStyle = { dark: RGB; mid: RGB; light: RGB; trunk: RGB };

export function pine(
  f: Frame,
  x: number,
  base: number,
  h: number,
  s: TreeStyle,
  seed = 1
) {
  x = Math.round(x);
  base = Math.round(base);
  const trunkH = Math.max(1, Math.round(h * 0.08));
  f.rect(x, base - trunkH, h > 30 ? 2 : 1, trunkH, s.trunk);
  const top = base - h;
  const crown = h - trunkH;
  const tiers = Math.max(2, Math.round(crown / 7));
  const maxHalf = Math.max(1, h * 0.24);
  for (let y = 0; y < crown; y++) {
    const v = y / crown; // 0 at the tip, 1 at the bottom skirt
    const k = Math.min(tiers - 1, Math.floor(v * tiers));
    const tv = v * tiers - k; // position inside this tier
    // each tier flares out, then the next one starts narrower
    const tierHalf = maxHalf * (0.18 + 0.82 * ((k + 1) / tiers));
    const half = Math.max(
      0,
      Math.round(
        tierHalf * (0.35 + 0.65 * Math.pow(tv, 0.7)) + (v < 0.06 ? -1 : 0)
      )
    );
    const yy = top + y;
    for (let dx = -half; dx <= half; dx++) {
      const edge = Math.abs(dx) >= half - 1;
      if (edge && hash2(x + dx, yy, seed) > 0.55) continue;
      let c = s.mid;
      const side = dx / Math.max(1, half);
      if (tv > 0.82)
        c = side < -0.2 ? s.mid : s.dark; // underside of the skirt
      else if (side < -0.25 && tv > 0.15) c = s.light;
      else if (side > 0.35) c = s.dark;
      if (c === s.mid && hash2(x + dx, yy, seed + 9) > 0.86)
        c = side < 0 ? s.light : s.dark;
      f.set(x + dx, yy, c);
    }
    // drooping tips at the end of each skirt
    if (tv > 0.86 && half > 2) {
      f.set(x - half - 1, yy + 1, s.mid);
      f.set(x + half + 1, yy + 1, s.dark);
    }
  }
  f.set(x, top - 1, s.mid);
}

export function palm(
  f: Frame,
  x: number,
  base: number,
  h: number,
  lean: number,
  s: TreeStyle,
  t = 0,
  seed = 1,
  bark?: { light: RGB; mid: RGB; dark: RGB }
) {
  const b = bark ?? { light: s.trunk, mid: s.trunk, dark: s.dark };
  // trunk: tapering, curving with the lean, ringed
  let tx = x;
  let ty = base;
  for (let i = 0; i <= h; i++) {
    const v = i / h;
    tx = x + lean * v * v * h * 0.55;
    ty = base - i;
    const thick = v < 0.4 ? 3 : 2;
    for (let k = 0; k < thick; k++) {
      let c = k === 0 ? b.light : k === thick - 1 ? b.dark : b.mid;
      if (i % 4 === 0) c = k === 0 ? b.mid : b.dark; // growth rings
      f.set(Math.round(tx) + k - 1, ty, c);
    }
  }
  const cx = Math.round(tx);
  const cy = Math.round(ty);
  const sway = Math.sin(t / 1400 + seed * 2) * 0.08;
  // fronds: a spine with leaflets hanging off both sides
  const fronds = 10;
  const L = h * 0.36;
  for (let k = 0; k < fronds; k++) {
    const spread = (k / (fronds - 1)) * 2 - 1; // -1..1
    const ang = -Math.PI / 2 + spread * 2.1 + sway * (1 + Math.abs(spread));
    const len =
      L * (0.75 + hash2(k, seed, 9) * 0.3) * (1 - Math.abs(spread) * 0.15);
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    for (let j = 1; j < len; j++) {
      const v = j / len;
      const px = cx + dx * j;
      const py = cy + dy * j + v * v * len * 0.65; // droop
      f.set(px, py, s.dark);
      if (v > 0.06) {
        const leaf = Math.max(1, Math.round((1 - v) * 5 + 1));
        for (let m = 1; m <= leaf; m++) {
          // leaflets hang down and outwards
          f.set(
            px + Math.sign(dx || 1) * m * 0.4,
            py + m,
            m === 1 ? s.mid : s.dark
          );
          f.set(
            px - Math.sign(dx || 1) * m * 0.2,
            py - m * 0.6,
            v < 0.5 ? s.light : s.mid
          );
        }
      }
    }
  }
  // coconuts tucked under the crown
  f.disc(cx - 1, cy + 2, 1, b.mid);
  f.disc(cx + 2, cy + 1, 1, b.dark);
}

/**
 * Forest canopy seen from a distance: lots of small, shaded tree crowns
 * packed over an area. `inside(x, y)` says where the ground is; crowns sit
 * on it and bulge a little above its top edge, which gives the bumpy
 * silhouette real forested hills have.
 */
export function canopy(
  f: Frame,
  inside: (x: number, y: number) => boolean,
  s: { dark: RGB; mid: RGB; light: RGB; hi?: RGB },
  opts: {
    seed: number;
    x0?: number;
    x1?: number;
    y0: number;
    y1: number;
    size?: number;
    step?: number;
  }
) {
  const size = opts.size ?? 3;
  const step = opts.step ?? Math.max(2, Math.round(size * 1.1));
  const x0 = opts.x0 ?? -size;
  const x1 = opts.x1 ?? f.w + size;
  const blobs: [number, number, number][] = [];
  for (let gy = opts.y0; gy < opts.y1; gy += step) {
    for (let gx = x0; gx < x1; gx += step) {
      const jx = gx + Math.round((hash2(gx, gy, opts.seed) - 0.5) * step);
      const jy = gy + Math.round((hash2(gx, gy, opts.seed + 1) - 0.5) * step);
      if (!inside(jx, jy)) continue;
      const r = size * (0.7 + hash2(gx, gy, opts.seed + 2) * 0.6);
      blobs.push([jx, jy, r]);
    }
  }
  blobs.sort((a, b) => a[1] - b[1]); // back (higher) first
  for (const [bx, by, r] of blobs) {
    f.disc(bx, by, r, (dx, dy) => {
      const l = (dx + dy * 1.3) / r;
      if (l < -0.75 && s.hi) return s.hi;
      if (l < -0.25) return s.light;
      if (l > 0.65) return s.dark;
      return s.mid;
    });
  }
}

// ---------- particles ----------

export function rain(f: Frame, t: number, c: RGB, density = 0.6, seed = 5) {
  const count = Math.round(f.w * density);
  for (let i = 0; i < count; i++) {
    const speed = 0.11 + hash2(i, 0, seed) * 0.05;
    const x0 = hash2(i, 1, seed) * (f.w + 40);
    const y = ((hash2(i, 2, seed) * (f.h + 20) + t * speed) % (f.h + 20)) - 10;
    const x = x0 - y * 0.25;
    f.set(x, y, c);
    f.set(x - 0.25, y - 1, c);
    if (hash2(i, 3, seed) > 0.5) f.set(x - 0.5, y - 2, c);
  }
}

export function snow(
  f: Frame,
  t: number,
  colors: RGB[],
  count: number,
  seed = 6
) {
  for (let i = 0; i < count; i++) {
    const speed = 0.008 + hash2(i, 0, seed) * 0.012;
    const y = (hash2(i, 2, seed) * (f.h + 10) + t * speed) % (f.h + 10);
    const x =
      (hash2(i, 1, seed) * f.w + Math.sin(t / 1500 + i) * 3 + f.w) % f.w;
    f.set(x, y, colors[i % colors.length]!);
  }
}

export function smoke(
  f: Frame,
  x: number,
  y: number,
  t: number,
  colors: RGB[],
  opts: { height: number; drift: number; width?: number; density?: number }
) {
  const width = opts.width ?? 2.5;
  const density = opts.density ?? 0.75;
  for (let i = 0; i < opts.height; i++) {
    const v = i / opts.height; // 0 at the source
    const yy = Math.round(y - i);
    const sway =
      Math.sin(i * 0.16 - t / 650) * (0.5 + v * 3) +
      Math.sin(i * 0.05 - t / 1700) * v * 2;
    const cx = x + sway + v * v * opts.drift;
    const half = 0.5 + v * width;
    const a = density * (1 - v) ** 1.3;
    const c =
      colors[Math.min(colors.length - 1, Math.floor(v * colors.length))]!;
    for (let xx = Math.floor(cx - half); xx <= cx + half; xx++) {
      const edge = Math.abs(xx - cx) / half;
      const breakup = noise1(i * 0.3 - t / 900, xx) > 0.35 ? 1 : 0.55;
      if (dither(xx, yy, a * (1 - edge * 0.6) * breakup)) f.set(xx, yy, c);
    }
  }
}

export { bayer, dither };
