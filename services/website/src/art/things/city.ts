// City pieces: skylines with lit windows, Tokyo Tower, Skytree, trains.

import { dither, type Frame, type RGB } from '../frame';
import { hash2 } from '../noise';

export type Beacon = { x: number; y: number; phase: number };

export type SkylineStyle = {
  body: RGB;
  edge: RGB; // lit side / roof edge
  dark: RGB;
  windows: RGB[]; // lit window colours (warm first)
  windowOff?: RGB;
  litShare: number; // 0..1 how many windows are on
};

/**
 * A row of buildings standing on `base`. Returns aircraft beacons on the
 * tallest roofs so the caller can blink them.
 */
export function skyline(
  f: Frame,
  base: number,
  s: SkylineStyle,
  opts: {
    seed: number;
    minH: number;
    maxH: number;
    minW: number;
    maxW: number;
    gap?: number;
    x0?: number;
    x1?: number;
  }
): Beacon[] {
  const beacons: Beacon[] = [];
  // with explicit bounds the row stays inside them; otherwise it runs off both edges
  let x = opts.x0 ?? -Math.round(hash2(0, 0, opts.seed) * opts.maxW);
  const x1 = opts.x1 ?? f.w;
  let i = 0;
  while (x < x1) {
    const r = (k: number) => hash2(i, k, opts.seed);
    let bw = Math.round(opts.minW + r(1) * (opts.maxW - opts.minW));
    if (opts.x1 !== undefined) {
      bw = Math.min(bw, x1 - x);
      if (bw < 4) break;
    }
    const tall = r(2) ** 1.8;
    const bh = Math.round(opts.minH + tall * (opts.maxH - opts.minH));
    const top = base - bh;
    const kind = r(3);
    // body
    f.rect(x, top, bw, bh, s.body);
    f.rect(x, top, 1, bh, s.edge); // lit left edge
    f.rect(x + bw - 1, top, 1, bh, s.dark);
    // roof details
    let peak = top; // the highest point, where a beacon goes
    if (kind > 0.75 && bw > 6) {
      f.rect(x + 2, top - 2, bw - 4, 2, s.body); // setback penthouse
      f.rect(x + 2, top - 2, 1, 2, s.edge);
      peak = top - 2;
    } else if (kind > 0.55) {
      f.rect(x + Math.round(bw / 2), top - 4, 1, 4, s.dark); // antenna
      peak = top - 4;
    }
    // windows: rows of 1px windows, whole floors tend to be on or off
    const pattern = r(4);
    const stepX = pattern > 0.5 ? 2 : 3;
    // centre the columns on the facade: whatever the step leaves over is
    // split between the two sides instead of all landing on the right
    const spare = (bw - 5) % stepX;
    const wx0 = x + 2 + (spare > 0 ? Math.floor(spare / 2) : 0);
    for (let wy = top + 2; wy < base - 1; wy += 2) {
      const floorOn = hash2(i, wy, opts.seed + 5) < s.litShare * 1.6;
      for (let wx = wx0; wx < x + bw - 2; wx += stepX) {
        const on = floorOn && hash2(wx, wy, opts.seed + 6) < 0.75;
        if (on) {
          const c =
            s.windows[
              Math.floor(hash2(i, wy >> 3, opts.seed + 7) * s.windows.length)
            ]!;
          f.set(wx, wy, c);
        } else if (s.windowOff) {
          f.set(wx, wy, s.windowOff);
        }
      }
    }
    if (bh > opts.minH + (opts.maxH - opts.minH) * 0.6)
      beacons.push({ x: x + Math.round(bw / 2), y: peak - 1, phase: r(8) });
    x += bw + (opts.gap ?? 0) + (r(9) > 0.8 ? 1 : 0);
    i++;
  }
  return beacons;
}

export function blinkBeacons(f: Frame, beacons: Beacon[], t: number, c: RGB) {
  for (const b of beacons) {
    if (Math.sin(t / 600 + b.phase * 20) > 0.2) f.set(b.x, b.y, c);
  }
}

export type TowerStyle = {
  lit: RGB; // floodlit steel
  hi: RGB; // the leg facing the light
  dark: RGB; // braces and the shaded leg
  glow: RGB; // haze between the members
  deck: RGB;
  deckHi: RGB;
  deckDark: RGB;
  red: RGB;
  white: RGB;
};

/**
 * Tokyo Tower in its night lighting. Draw it onto an opaque frame: the
 * space inside the lattice is tinted with `glow` rather than painted, so
 * whatever stands behind it still shows through.
 */
export function tokyoTower(
  f: Frame,
  cx: number,
  base: number,
  h: number,
  s: TowerStyle
) {
  cx = Math.round(cx);
  const top = base - h;
  const body = Math.round(h * 0.82); // steel; the rest is antenna
  const hw0 = Math.max(6, Math.round(h * 0.13));
  // half-width: a concave flare like the real thing
  const hw = (y: number) => {
    const v = Math.min(1, (base - y) / body);
    return 0.6 + (hw0 - 0.6) * Math.pow(1 - v, 2.05);
  };
  const deck1 = base - Math.round(h * 0.44);
  const deck2 = base - Math.round(h * 0.74);
  const archTop = base - Math.round(h * 0.13);

  // floodlight haze hugging the silhouette, then a tint inside it so the
  // lattice reads as one lit mass
  for (let y = top; y <= base; y++) {
    const half = y < base - body ? 0.5 : hw(y);
    const reach = y < base - body ? 2 : 5;
    for (
      let x = Math.floor(cx - half - reach);
      x <= Math.ceil(cx + half + reach);
      x++
    ) {
      const out = Math.abs(x - cx) - half;
      if (out > 0) {
        f.blend(x, y, s.glow, out <= reach * 0.45 ? 0.16 : 0.08);
        continue;
      }
      // leave the arch open between the legs
      if (y > archTop) {
        const ax = (x - cx) / Math.max(1, half - 2.2);
        const ay = (base - y) / (base - archTop);
        if (ax * ax + ay * ay < 1) continue;
      }
      f.blend(x, y, s.glow, 0.28);
    }
  }

  // panels: horizontal girders with an X in each bay, roughly square bays
  const girders: number[] = [];
  for (let y = archTop; y > base - body; ) {
    girders.push(y);
    const span = Math.max(3, Math.round(hw(y) * 1.7));
    y -= span;
  }
  girders.push(base - body);
  for (let i = 0; i + 1 < girders.length; i++) {
    const yb = girders[i]!;
    const ya = girders[i + 1]!;
    const lb = cx - hw(yb);
    const rb = cx + hw(yb);
    const la = cx - hw(ya);
    const ra = cx + hw(ya);
    f.line(lb, yb, ra, ya, s.dark);
    f.line(rb, yb, la, ya, s.dark);
    f.hline(Math.round(lb), Math.round(rb), yb, s.lit);
  }

  // the legs, curving out to the ground; the left one catches the light
  for (let y = base - body; y <= base; y++) {
    const half = hw(y);
    const thick = y > deck1 ? 2 : 1;
    const l = Math.round(cx - half);
    const r = Math.round(cx + half);
    for (let k = 0; k < thick; k++) {
      f.set(l + k, y, k === 0 ? s.hi : s.lit);
      f.set(r - k, y, k === 0 ? s.lit : s.dark);
    }
  }
  // the big arch between the front legs
  for (let x = -hw0; x <= hw0; x++) {
    const half = hw(base);
    const ax = x / Math.max(1, half - 2.2);
    if (Math.abs(ax) > 1) continue;
    const y = Math.round(base - (base - archTop) * Math.sqrt(1 - ax * ax));
    f.set(cx + x, y, s.lit);
    if (Math.abs(ax) < 0.85) f.set(cx + x, y + 1, s.dark);
  }

  // main observatory: two bands of lit windows, wider than the tower
  const d1 = Math.round(hw(deck1)) + 3;
  f.hline(cx - d1 + 1, cx + d1 - 1, deck1 - 6, s.lit);
  for (const wy of [deck1 - 5, deck1 - 2]) {
    f.rect(cx - d1, wy, d1 * 2 + 1, 2, s.deckHi);
    for (let x = cx - d1 + 2; x < cx + d1; x += 3)
      f.vline(x, wy, wy + 1, s.deck);
  }
  f.hline(cx - d1, cx + d1, deck1 - 3, s.deckDark);
  f.hline(cx - d1 + 1, cx + d1 - 1, deck1, s.dark);
  // top deck
  const d2 = Math.round(hw(deck2)) + 2;
  f.rect(cx - d2, deck2 - 3, d2 * 2 + 1, 3, s.deckDark);
  f.hline(cx - d2, cx + d2, deck2 - 2, s.deck);
  for (let x = cx - d2; x <= cx + d2; x += 2) f.set(x, deck2 - 2, s.deckHi);

  // antenna mast in red and white bands
  const mastBase = base - body;
  for (let y = top; y < mastBase; y++) {
    const band = Math.floor((mastBase - y) / 3) % 2 === 0;
    f.set(cx, y, band ? s.red : s.white);
    if (y > mastBase - Math.round(h * 0.06))
      f.set(cx + 1, y, band ? s.dark : s.lit);
  }
}

/** Tokyo Skytree: tall, slim, lit blue or purple. */
export function skytree(
  f: Frame,
  cx: number,
  base: number,
  h: number,
  s: { body: RGB; lit: RGB; deck: RGB }
) {
  cx = Math.round(cx);
  const deck1 = base - Math.round(h * 0.55);
  const deck2 = base - Math.round(h * 0.7);
  for (let y = base; y >= base - h; y--) {
    const v = (base - y) / h;
    let half = v < 0.12 ? 3 : v < 0.6 ? 2 : v < 0.82 ? 1 : 0;
    if (Math.abs(y - deck1) <= 2) half = 4;
    if (Math.abs(y - deck2) <= 1) half = 3;
    for (let dx = -half; dx <= half; dx++) {
      let c = Math.abs(dx) === half && half > 0 ? s.lit : s.body;
      if (Math.abs(y - deck1) <= 2 || Math.abs(y - deck2) <= 1)
        c = (dx + y) % 2 === 0 ? s.deck : s.lit;
      f.set(cx + dx, y, c);
    }
  }
}

export type TrainStyle = {
  body: RGB;
  bodyHi: RGB;
  bodySh: RGB;
  stripe: RGB;
  window: RGB;
  windowDark: RGB;
  frame: RGB;
};

/** A commuter train of `cars` cars, each `carW` px, running along `railY`. */
export function train(
  f: Frame,
  x: number,
  railY: number,
  cars: number,
  s: TrainStyle,
  opts: { carW?: number; carH?: number; lit?: boolean; dir?: 1 | -1 } = {}
) {
  const carW = opts.carW ?? 30;
  const carH = opts.carH ?? 9;
  for (let i = 0; i < cars; i++) {
    const cx = Math.round(x + i * (carW + 1));
    const top = railY - carH - 1;
    f.rect(cx, top, carW, carH, s.body);
    f.rect(cx, top, carW, 1, s.bodyHi);
    f.rect(cx, railY - 2, carW, 1, s.bodySh);
    f.rect(cx, railY - 4, carW, 1, s.stripe);
    // windows and doors
    for (let wx = cx + 2; wx < cx + carW - 2; wx += 4) {
      const door = (wx - cx) % 12 === 6;
      const c = opts.lit ? s.window : s.windowDark;
      f.rect(wx, top + 2, 2, door ? 5 : 3, c);
      if (opts.lit && dither(wx, top + 2, 0.5)) f.set(wx, top + 2, s.bodyHi);
    }
    // gangway and wheels
    f.rect(cx + carW, top + 2, 1, carH - 4, s.frame);
    f.rect(cx + 3, railY - 1, 4, 1, s.frame);
    f.rect(cx + carW - 7, railY - 1, 4, 1, s.frame);
  }
}
