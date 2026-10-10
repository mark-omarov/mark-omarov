// One-off effects triggered by clicks: fireworks, ripples, birds, lightning.
// Every effect is a closed-form function of the time since it started, so
// it looks the same at any frame rate and needs no simulation state.

import { type Frame, lerpRGB, type RGB } from './frame';
import { hash2 } from './noise';

type Effect = {
  start: number;
  until: number;
  draw: (f: Frame, age: number) => void;
};

export class Fx {
  private items: Effect[] = [];

  add(start: number, duration: number, draw: (f: Frame, age: number) => void) {
    this.items.push({ start, until: start + duration, draw });
    // never let a click-happy visitor pile up hundreds of effects: clear
    // out finished ones first, and only then drop the oldest still running
    if (this.items.length > 64) {
      this.items = this.items.filter((e) => e.until > start);
      if (this.items.length > 64) this.items.shift();
    }
  }

  get active() {
    return this.items.length > 0;
  }

  draw(f: Frame, t: number) {
    this.items = this.items.filter((e) => t < e.until);
    for (const e of this.items) if (t >= e.start) e.draw(f, t - e.start);
  }
}

/** Colour ramp lookup, 0..1. */
function ramp(colors: RGB[], v: number) {
  const n = colors.length - 1;
  const p = Math.min(0.999, Math.max(0, v)) * n;
  const i = Math.floor(p);
  return lerpRGB(colors[i]!, colors[i + 1] ?? colors[i]!, p - i);
}

/** Position along a ballistic path with air drag; `k` is drag per second. */
function flight(v: number, dt: number, k: number) {
  return k ? (v * (1 - Math.exp(-k * dt))) / k : v * dt;
}

/**
 * A firework shell launched from (x, ground) that bursts at (x, y).
 * `colors` runs from the hot centre to the dying embers.
 */
export function firework(
  fx: Fx,
  t: number,
  x: number,
  ground: number,
  y: number,
  colors: RGB[],
  seed = 1
) {
  const rise = Math.min(900, Math.max(350, (ground - y) * 9));
  const count = 48 + Math.floor(hash2(seed, 1, 7) * 24);
  const speed = 38 + hash2(seed, 2, 7) * 16; // px/s
  const ring = hash2(seed, 3, 7) > 0.6; // some shells burst in a clean ring
  const life = 1700;
  fx.add(t, rise + life, (f, age) => {
    if (age < rise) {
      // the shell climbing, with a short sparkling tail
      const p = age / rise;
      const e = 1 - (1 - p) * (1 - p);
      const sy = ground + (y - ground) * e;
      const sx = x + Math.sin(p * 9 + seed) * 0.6;
      for (let k = 0; k < 5; k++) {
        if (hash2(Math.floor(age / 40), k, seed) < 0.3 && k > 1) continue;
        f.set(sx, sy + k, ramp(colors, k / 5));
      }
      return;
    }
    const a = (age - rise) / 1000; // seconds since the burst
    const fade = (age - rise) / life;
    if (a < 0.09) {
      // the flash
      const r = 3 + a * 60;
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const d = Math.hypot(dx, dy) / r;
          if (d < 1) f.blend(x + dx, y + dy, colors[0]!, (1 - d) * 0.5);
        }
    }
    for (let i = 0; i < count; i++) {
      const ang =
        (i / count) * Math.PI * 2 + hash2(i, 4, seed) * (ring ? 0.05 : 0.5);
      const sp =
        speed *
        (ring ? 0.95 + hash2(i, 5, seed) * 0.1 : 0.4 + hash2(i, 5, seed) * 0.6);
      const vx = Math.cos(ang) * sp;
      const vy = Math.sin(ang) * sp;
      const px = (dt: number) => x + flight(vx, dt, 1.6);
      const py = (dt: number) => y + flight(vy, dt, 1.6) + 9 * dt * dt;
      // flicker out at the end, each ember on its own beat
      if (
        fade > 0.6 &&
        hash2(i, Math.floor(age / 70), seed) < (fade - 0.6) * 2.4
      )
        continue;
      const c = ramp(colors, fade);
      f.set(px(a), py(a), c);
      // trail
      if (a > 0.05)
        f.set(
          px(a - 0.05),
          py(a - 0.05),
          ramp(colors, Math.min(1, fade + 0.35))
        );
      if (a > 0.12 && fade < 0.5)
        f.set(
          px(a - 0.12),
          py(a - 0.12),
          ramp(colors, Math.min(1, fade + 0.6))
        );
    }
  });
}

/** Expanding rings on water, squashed for perspective. */
export function ripple(
  fx: Fx,
  t: number,
  x: number,
  y: number,
  c: RGB,
  opts: { rings?: number; size?: number; squash?: number } = {}
) {
  const rings = opts.rings ?? 3;
  const size = opts.size ?? 14;
  const squash = opts.squash ?? 0.3;
  const life = 1600;
  fx.add(t, life + rings * 220, (f, age) => {
    for (let k = 0; k < rings; k++) {
      const a = age - k * 220;
      if (a < 0 || a > life) continue;
      const p = a / life;
      const r = 1 + p * size;
      const alpha = (1 - p) * 0.75;
      const steps = Math.ceil(r * 6);
      for (let s = 0; s < steps; s++) {
        const ang = (s / steps) * Math.PI * 2;
        f.blend(
          x + Math.cos(ang) * r,
          y + Math.sin(ang) * r * squash,
          c,
          alpha
        );
      }
    }
  });
}

/** A few droplets thrown up from a point. */
export function splash(
  fx: Fx,
  t: number,
  x: number,
  y: number,
  c: RGB,
  seed = 1
) {
  fx.add(t, 700, (f, age) => {
    const a = age / 1000;
    for (let i = 0; i < 7; i++) {
      const vx = (hash2(i, 1, seed) - 0.5) * 30;
      const vy = -18 - hash2(i, 2, seed) * 22;
      const py = y + vy * a + 70 * a * a;
      if (py > y) continue;
      f.set(x + vx * a, py, c);
    }
  });
}

/** Birds startled from (x, y), flapping up and away. */
export function flock(
  fx: Fx,
  t: number,
  x: number,
  y: number,
  c: RGB,
  opts: { count?: number; seed?: number; dir?: 1 | -1 } = {}
) {
  const count = opts.count ?? 6;
  const seed = opts.seed ?? 1;
  const dir = opts.dir ?? (hash2(seed, 9, 3) > 0.5 ? 1 : -1);
  fx.add(t, 4200, (f, age) => {
    const a = age / 1000;
    for (let i = 0; i < count; i++) {
      const delay = hash2(i, 1, seed) * 0.35;
      const s = Math.max(0, a - delay);
      const vx = dir * (14 + hash2(i, 2, seed) * 16);
      const vy = -(10 + hash2(i, 3, seed) * 10);
      const bx = Math.round(x + (hash2(i, 4, seed) - 0.5) * 8 + vx * s);
      const by = Math.round(
        y + (hash2(i, 5, seed) - 0.5) * 4 + vy * s + 3 * s * s
      );
      const up = Math.floor(age / 90 + i) % 2 === 0;
      f.set(bx, by, c);
      f.set(bx - 1, by + (up ? -1 : 1), c);
      f.set(bx + 1, by + (up ? -1 : 1), c);
    }
  });
}

/** A shooting star streaking down across the sky. */
export function shootingStar(
  fx: Fx,
  t: number,
  x: number,
  y: number,
  c: RGB,
  dir: 1 | -1 = 1
) {
  fx.add(t, 700, (f, age) => {
    const p = age / 700;
    const hx = x + dir * p * 70;
    const hy = y + p * 26;
    for (let k = 0; k < 12; k++) {
      const a = (1 - k / 12) * (p < 0.8 ? 1 : (1 - p) * 5);
      f.blend(hx - dir * k * 1.8, hy - k * 0.67, c, a);
    }
  });
}

/** Generic click feedback: a little pixel star that pops and fades. */
export function sparkle(fx: Fx, t: number, x: number, y: number, c: RGB) {
  fx.add(t, 420, (f, age) => {
    const p = age / 420;
    const r = 1 + Math.round(p * 4);
    const a = 1 - p;
    f.blend(x, y, c, a);
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      f.blend(x + dx * r, y + dy * r, c, a);
      if (p < 0.5) f.blend(x + dx * (r - 1), y + dy * (r - 1), c, a * 0.6);
    }
  });
}
