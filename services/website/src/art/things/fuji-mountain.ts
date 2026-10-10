// Mt. Fuji, drawn properly: a flat truncated summit with a shallow crater
// dip, flanks that are steep up top and sweep out into a very wide base
// (an exponential profile, roughly 1:6 height to base), radial ridges and
// gullies fanning out from the summit, and a snow cap whose ragged lower
// edge runs down the gullies in long fingers.

import { type Frame, type RGB } from '../frame';
import { noise1 } from '../noise';

export type FujiStyle = {
  snowLit: RGB;
  snowMid: RGB;
  snowShade: RGB;
  snowDeep: RGB;
  rockLit: RGB;
  rock: RGB;
  rockShade: RGB;
  rockDeep: RGB;
  /** lower slopes, where the forest starts */
  forest: RGB;
  forestLit: RGB;
};

export type FujiOpts = {
  /** half the width of the base at `baseY` */
  halfBase: number;
  style: FujiStyle;
  /** 1 = lit from the left, -1 = from the right */
  light?: 1 | -1;
  /** how far down the snow reaches on the ridges, as a fraction of the height */
  snow?: number;
  /** how much further the gully fingers reach */
  fingers?: number;
  /** fraction of the height (from the bottom) that's forested */
  forest?: number;
  seed?: number;
  /** curvature of the flanks: higher = steeper top and flatter skirt */
  k?: number;
};

/** Returns the silhouette: y of the top edge at column x (Infinity outside). */
export function fujiProfile(
  cx: number,
  peakY: number,
  baseY: number,
  halfBase: number,
  k = 2.7,
  seed = 1
) {
  const H = baseY - peakY;
  const plateau = Math.max(3, Math.round(H * 0.12));
  const norm = 1 - Math.exp(-k);
  const L = halfBase - plateau;
  return (x: number) => {
    const dx = x + 0.5 - cx;
    const ax = Math.abs(dx);
    if (ax > halfBase) return Infinity;
    if (ax <= plateau) {
      // the crater rim: two low humps at the ends of a flat top, a shallow dip between
      const e = ax / plateau;
      return peakY + (e < 0.45 ? 1 : e > 0.92 ? 1 : 0);
    }
    const u = (ax - plateau) / L;
    // a little asymmetry and a few shoulders keep it from looking lathe-turned
    const lump = (noise1(x * 0.18, seed + 3) - 0.5) * 1.2 * Math.min(1, u * 4);
    const skew = dx < 0 ? 1.03 : 0.97;
    return (
      peakY +
      1 +
      (H - 1) * Math.min(1, (1 - Math.exp(-k * u * skew)) / norm) +
      lump
    );
  };
}

/**
 * Draws Fuji with its summit at (cx, peakY) and its skirt reaching `baseY`.
 * Returns the profile function.
 */
export function fujisan(
  f: Frame,
  cx: number,
  peakY: number,
  baseY: number,
  opts: FujiOpts
) {
  const s = opts.style;
  const H = baseY - peakY;
  const seed = opts.seed ?? 1;
  const light = opts.light ?? 1;
  const snow = opts.snow ?? 0.36;
  const fingers = opts.fingers ?? 0.32;
  const forestFrom = 1 - (opts.forest ?? 0.18);
  const top = fujiProfile(cx, peakY, baseY, opts.halfBase, opts.k ?? 2.7, seed);
  // ridges radiate from a point a little above the summit
  const apexY = peakY - H * 0.12;
  const freq = 11;
  for (
    let x = Math.floor(cx - opts.halfBase);
    x <= Math.ceil(cx + opts.halfBase);
    x++
  ) {
    const y0 = Math.round(top(x));
    if (!Number.isFinite(y0)) continue;
    const dx = x + 0.5 - cx;
    for (let y = Math.max(0, y0); y < Math.min(f.h, baseY); y++) {
      const v = (y - peakY) / H;
      const ang = dx / (y - apexY);
      // ridge/gully streaks; a second, finer set breaks them up lower down
      const r = noise1(ang * freq + 40, seed + 11);
      const r2 = noise1(ang * freq * 2.6 + 40, seed + 12);
      const gully = r * 0.7 + r2 * 0.3;
      // the terminator sits right of centre (light from the left) and follows the ridges
      const side = dx * light;
      const div = (y - peakY) * 0.16 + (gully - 0.5) * (3 + v * 12);
      const lit = side < div;
      // snow: a ragged cap whose fingers run down the gullies and taper off
      const capEdge =
        snow +
        (noise1(ang * 13 + 9, seed + 13) - 0.5) * 0.12 +
        (noise1(ang * 41, seed + 16) - 0.5) * 0.06;
      const snowLine =
        capEdge + Math.max(0, (gully - 0.44) / 0.56) ** 1.2 * fingers;
      // the forest climbs higher up the ridges than the gullies
      const forestLine =
        forestFrom +
        (gully - 0.5) * 0.12 +
        (noise1(ang * 50, seed + 15) - 0.5) * 0.05;
      const edgeRow = y === y0;
      let c: RGB;
      if (v < snowLine) {
        if (lit) c = gully > 0.58 && v > 0.1 ? s.snowMid : s.snowLit;
        else
          c =
            gully > 0.62
              ? s.snowDeep
              : gully < 0.34 && v > 0.14
                ? s.snowMid
                : s.snowShade;
      } else if (v > forestLine) {
        c = lit && gully < 0.45 ? s.forestLit : s.forest;
      } else if (lit) {
        c = gully > 0.64 ? s.rockShade : gully > 0.52 ? s.rock : s.rockLit;
      } else {
        c = gully > 0.6 ? s.rockDeep : gully < 0.34 ? s.rock : s.rockShade;
      }
      // the sky-facing crest catches the light along the lit flank
      if (edgeRow && lit && v > 0.04)
        c =
          v < snowLine
            ? v < capEdge + 0.04
              ? s.snowLit
              : c
            : v > forestLine
              ? s.forestLit
              : s.rockLit;
      f.set(x, y, c);
    }
  }
  return top;
}
