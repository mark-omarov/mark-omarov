// The beach ceremony close-up the Maldives scene dips into when you tap the
// young palm with the plaque: a flower arch rises out of the sand over a
// couple (a white dress, a suit), they sign at a little table with a
// flourish, the champagne pops, petals and hearts burst out, and the palm
// puts out a new frond. No faces: the two are told apart by hair, build and
// clothes (his light-brown hair and short beard, her long straight black
// hair), as everywhere else on the site.
//
// Everything is a closed-form function of the time since the tap.

import { type Frame, lerpRGB, type RGB } from '../frame';
import { hash2 } from '../noise';
import { glow, gradient } from '../paint';
import { layer, palette } from '../scene';

const P = palette({
  // golden hour
  sky0: '#4b58a6',
  sky1: '#6a68b4',
  sky2: '#9278bc',
  sky3: '#c288b6',
  sky4: '#e898a4',
  sky5: '#f6b496',
  sky6: '#ffd194',
  sky7: '#ffe9b8',
  cloud: '#ffc4b0',
  cloudLit: '#ffe2c4',
  cloudSh: '#c890b0',
  sun: '#fff6dc',
  sunGlow: '#ffe6a6',
  sea0: '#56689e',
  sea1: '#5487b4',
  sea2: '#58a6bf',
  sea3: '#6fc0c2',
  sea4: '#9ed8c6',
  glint: '#fff1c2',
  glintHi: '#ffffff',
  foam: '#fff8ec',
  wet: '#d8b88c',
  sand0: '#e6c696',
  sand1: '#f2d8aa',
  sand2: '#fae6c0',
  sand3: '#fff1d6',
  sandSh: '#c9a376',
  hut: '#6a4c6e',
  hutDark: '#4c3654',
  // the arch
  bam0: '#8a5e34',
  bam1: '#c48c4c',
  bam2: '#e8bc78',
  drape: '#fffaf4',
  drapeSh: '#ecd6d4',
  leaf0: '#2f6e3c',
  leaf1: '#4f9a48',
  pink: '#ff6f9c',
  pinkLt: '#ffb0c8',
  red: '#e8365e',
  white: '#ffffff',
  peach: '#ffc27a',
  heart: '#ff4f86',
  heartHi: '#ffd2e2',
  // the man: short light-brown hair, a little messy, and a short beard
  hair: '#9a6c42',
  hairLit: '#c8965e',
  beard: '#83582f',
  skin: '#f0bc9a',
  skinSh: '#c88c70',
  suit: '#262d44',
  suitLit: '#46527a',
  suitSh: '#151927',
  shirt: '#fbf8f2',
  shirtSh: '#d4d0d8',
  tie: '#0e0f16',
  shoe: '#0b0b10',
  shoeHi: '#5c5c6c',
  // the woman: long, straight, near-black hair
  wHair: '#16121a',
  wHairLit: '#3c3446',
  wSkin: '#f4caa8',
  wSkinSh: '#cc967a',
  dress: '#fffdf8',
  dressSh: '#eadfd8',
  dressSh2: '#cdbcbc',
  sash: '#f4c6c6',
  veil: '#ffffff',
  // the table
  cloth: '#fffaf0',
  clothSh: '#e6d6c2',
  clothSh2: '#c9b49c',
  paper: '#ffffff',
  ink: '#2a3a7a',
  pen: '#1a1a22',
  gold: '#ffd75e',
  goldHi: '#fff6c8',
  bucket: '#d6dae2',
  bucketSh: '#8a909c',
  bottle: '#1c4a2c',
  bottleHi: '#4c8a5a',
  foil: '#e8c060',
  cork: '#d8a868',
  glass: '#e6f4ff',
  bubbly: '#ffe9a0',
  froth: '#fffbea',
  // the young palm
  f0: '#1f5a34',
  f1: '#2f8a42',
  f2: '#55b04e',
  f3: '#9ad460',
  b0: '#5a4638',
  b1: '#87705a',
  b2: '#b59b7b',
  fresh0: '#5ab03a',
  fresh1: '#8ee04a',
  fresh2: '#d8ff80',
  fresh3: '#ffffe0',
  plank0: '#5a3622',
  plank1: '#8e5a34',
  plank2: '#b8804c',
  plank3: '#d8a468',
});

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const span = (v: number, a: number, b: number) =>
  clamp((v - a) / (b - a), 0, 1);
const smooth = (p: number) => p * p * (3 - 2 * p);
const easeOut = (p: number) => 1 - (1 - p) * (1 - p);
/** Overshoots a little past 1 and settles: things popping into place. */
const backOut = (p: number) => {
  const s = 1.9;
  const q = p - 1;
  return 1 + (s + 1) * q * q * q + s * q * q;
};

/** When things happen in the close-up, in ms after the tap. */
export const CEREMONY = {
  open: 750, // the heart opens out from the palm
  arch0: 200,
  arch1: 1300,
  bloom0: 850,
  bloom1: 1900,
  sign0: 1900, // he turns to the table
  write0: 2150,
  write1: 2650,
  flourish1: 3200,
  bottle0: 3300, // he takes the bottle
  pop: 3900,
  burst: 4650, // petals and hearts
  kiss0: 4850,
  kiss1: 6500,
  frond0: 5500,
  frond1: 6800,
  close0: 7300, // the heart closes back down onto the palm
  end: 8000,
};

// ---------- the iris: a heart opening out of the palm ----------

/** Implicit heart, size r, its middle at (cx, cy): <= 0 inside. */
function heartF(x: number, y: number, cx: number, cy: number, r: number) {
  const u = (x + 0.5 - cx) / r;
  const v = (cy - (y + 0.5)) / r + 0.12;
  const a = u * u + v * v - 1;
  return a * a * a - u * u * v * v * v;
}

/** How big the heart has to get to cover the whole picture from (cx, cy). */
export function heartMax(w: number, h: number, cx: number, cy: number) {
  const far = Math.max(
    Math.hypot(cx, cy),
    Math.hypot(w - cx, cy),
    Math.hypot(cx, h - cy),
    Math.hypot(w - cx, h - cy)
  );
  return far / 0.66 + 4;
}

/** The heart's size, 0..1 of heartMax, `age` ms after the tap. */
export function heartOpen(age: number) {
  if (age < 0 || age >= CEREMONY.end) return 0;
  if (age < CEREMONY.open) return span(age, 0, CEREMONY.open) ** 1.7;
  if (age < CEREMONY.close0) return 1;
  return (1 - span(age, CEREMONY.close0, CEREMONY.end)) ** 1.7;
}

/**
 * Copies `src` into `f` inside a heart of size r round (cx, cy), with a
 * bright rim so its edge reads against anything.
 */
export function heartWipe(
  f: Frame,
  src: Frame,
  cx: number,
  cy: number,
  r: number
) {
  const { w, h } = f;
  const x0 = Math.max(0, Math.floor(cx - r * 1.2));
  const x1 = Math.min(w - 1, Math.ceil(cx + r * 1.2));
  const y0 = Math.max(0, Math.floor(cy - r * 1.4));
  const y1 = Math.min(h - 1, Math.ceil(cy + r * 1.2));
  const rim = Math.min(3, r * 0.25);
  const d = f.pixels;
  const s = src.pixels;
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      if (heartF(x, y, cx, cy, r) > 0) continue;
      const i = y * w + x;
      if (rim > 0.5 && heartF(x, y, cx, cy, r - rim) > 0) {
        const outer = heartF(x, y, cx, cy, r - rim * 0.45) > 0;
        f.set(x, y, outer ? P.heart : P.heartHi);
        continue;
      }
      d[i] = s[i]!;
    }
}

// ---------- the young palm, with its plaque ----------

type FrondColors = readonly [RGB, RGB, RGB, RGB];
const OLD: FrondColors = [P.f0, P.f1, P.f2, P.f3];
const NEW: FrondColors = [P.fresh0, P.fresh1, P.fresh2, P.fresh3];

/** One arching frond out of (cx, cy), leaflets hanging under its spine. */
function frond(
  f: Frame,
  cx: number,
  cy: number,
  ang: number,
  len: number,
  maxW: number,
  droop: number,
  c: FrondColors,
  back: boolean
) {
  if (len < 0.6) return;
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const pt = (j: number) => {
    const v = j / len;
    return [cx + dx * j, cy + dy * j + v * v * len * droop] as const;
  };
  const step = 0.5;
  for (let j = 0.5; j <= len; j += step) {
    const v = j / len;
    const [px, py] = pt(j);
    const [qx, qy] = pt(j + step);
    const tl = Math.hypot(qx - px, qy - py) || 1;
    const tx = (qx - px) / tl;
    const ty = (qy - py) / tl;
    let nx = -ty;
    let ny = tx;
    if (ny < 0) {
      nx = -nx;
      ny = -ny;
    }
    const hx = nx * 0.8 + tx * 0.6;
    const hy = ny * 0.8 + ty * 0.6;
    const notch = Math.floor(j * 1.4) % 3 === 0 ? 0.55 : 1;
    const wdt = Math.sin(Math.min(1, v * 1.15) * Math.PI) ** 0.6 * maxW * notch;
    f.set(px, py, back ? c[1] : v < 0.6 ? c[3] : c[2]);
    for (let m = 0.7; m <= wdt; m += 0.7)
      f.set(
        px + hx * m,
        py + hy * m,
        back
          ? m > wdt * 0.5
            ? c[0]
            : c[1]
          : m < wdt * 0.45
            ? c[2]
            : m < wdt * 0.8
              ? c[1]
              : c[0]
      );
  }
}

/**
 * A young coconut palm with its soles at (x, base): a short trunk and a
 * crown of arching fronds. `size` 1 is the little one on the scene's beach.
 * `grow` 0..1 unfurls a new frond out of the top of the crown. Returns the
 * crown.
 */
export function sapling(
  f: Frame,
  x: number,
  base: number,
  size: number,
  sway: number,
  grow = 0
) {
  const th = Math.round(6 * size);
  const thick = size > 2 ? 3 : size > 1.4 ? 2 : 1;
  let tx = x;
  let ty = base;
  for (let i = 0; i <= th; i++) {
    const v = i / th;
    tx = x + v * v * size * 1.6 + sway * v * v * size * 2;
    ty = base - i;
    const k0 = Math.round(tx) - (thick >> 1);
    for (let k = 0; k < thick; k++) {
      let c = k === 0 ? P.b0 : k === thick - 1 ? P.b2 : P.b1;
      if (thick > 1 && i % 3 === 0) c = k === thick - 1 ? P.b1 : P.b0;
      f.set(k0 + k, ty, c);
    }
  }
  const cx = Math.round(tx);
  const cy = Math.round(ty);
  const L = 7.5 * size;
  const maxW = size > 2 ? 2.6 : size > 1.4 ? 1.6 : 1;
  const droop = 0.7;
  // back fronds first, then the ones facing us
  const fronds = [
    { a: -2.05, l: 0.85, back: true },
    { a: -1.1, l: 0.8, back: true },
    { a: -0.35, l: 0.85, back: true },
    { a: -2.75, l: 1, back: false },
    { a: -0.05, l: 1, back: false },
    { a: -2.35, l: 0.9, back: false },
    { a: -0.65, l: 0.95, back: false },
  ];
  for (const fr of fronds)
    frond(
      f,
      cx,
      cy,
      fr.a + sway * (0.5 + Math.abs(fr.a + Math.PI / 2) * 0.4),
      L * fr.l,
      maxW,
      droop,
      OLD,
      fr.back
    );
  if (grow > 0) {
    // a new spear comes up out of the middle and opens as it arches over
    const g = easeOut(grow);
    frond(
      f,
      cx,
      cy - 1,
      -Math.PI / 2 + 0.15 + g * 0.55 + sway * 0.4,
      L * 1.05 * (0.25 + 0.75 * g),
      maxW * g * g,
      droop * g,
      NEW,
      false
    );
  }
  return [cx, cy] as const;
}

/**
 * The plaque planted at its foot: carved marks and a heart, no readable
 * text. Left edge of the board at x; its stake stands on `base`.
 */
export function plaque(f: Frame, x: number, base: number, big: boolean) {
  if (!big) {
    f.vline(x + 2, base - 2, base, P.plank0);
    f.hline(x, x + 4, base - 5, P.plank3);
    f.hline(x, x + 4, base - 4, P.plank2);
    f.hline(x, x + 4, base - 3, P.plank1);
    f.set(x + 1, base - 4, P.plank0);
    f.set(x + 3, base - 4, P.plank0);
    return;
  }
  const bw = 11;
  const bh = 7;
  const top = base - bh - 4;
  f.rect(x + 4, top + bh, 2, 4, P.plank0);
  f.rect(x, top, bw, bh, P.plank2);
  f.hline(x, x + bw - 1, top, P.plank3);
  f.vline(x, top, top + bh - 1, P.plank3);
  f.hline(x, x + bw - 1, top + bh - 1, P.plank0);
  f.vline(x + bw - 1, top, top + bh - 1, P.plank1);
  // carved marks and a heart
  for (const [mx, my, n] of [
    [2, 2, 3],
    [2, 4, 2],
    [7, 4, 2],
  ] as const)
    f.hline(x + mx, x + mx + n - 1, top + my, P.plank0);
  f.set(x + 7, top + 2, P.red);
  f.set(x + 8, top + 2, P.red);
}

// ---------- the couple ----------

/**
 * The man in his suit, front on, arms drawn separately. 13 wide; column 6 is
 * his middle. H hair  h hair lit  s skin  S skin shade  B beard  w shirt
 * t tie  J suit  j suit lit  K suit shade  f flower  L trousers
 * l trousers lit  e shoe  E shoe shine
 */
const MAN_ROWS = [
  '....h.hH.....',
  '...hHhhHHH...',
  '...HhHHHHH...',
  '...HsssssH...',
  '...ssssssS...',
  '...BsBBBsB...',
  '....BBBBB....',
  '.....sSS.....',
  '...jJwtwJK...',
  '..jJJwtwJJK..',
  '..jJjwtwJJK..',
  '..jJJjtJfJK..',
  '..jJJjtJJJK..',
  '..jJJJjJJJK..',
  '..jJJJjJJKK..',
  '..jJJJjJJKK..',
  '...jJJjJJK...',
  '...jJJjJJK...',
  '...jJJjJJK...',
  '...jJJjJJK...',
  '..jJJJjJJJK..',
  '..jJJl.lJJK..',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '...lLL.LLK...',
  '..eEee.eeEe..',
];
/** Rows from his crown to his soles; the row his shoulders start on. */
const MAN_H = MAN_ROWS.length;
const MAN_SH = 8;
const MAN_HIP = 21;

/**
 * Her in her dress, front on, arms and veil drawn separately. 17 wide;
 * column 8 is her middle. H hair  h hair lit  s skin  S skin shade  D dress
 * d dress shade  c deeper fold  b sash
 */
const WOMAN_ROWS = [
  '......hhHH.......',
  '.....hHHHHH......',
  '.....HHHHHHH.....',
  '.....HssssHH.....',
  '....HHssssSHH....',
  '....HHssssSHH....',
  '....HHHsssSHH....',
  '....HHH.sS.HH....',
  '....HHsssssSH....',
  '....HHDDDDDdH....',
  '....HHDDDDDdH....',
  '.....HDDDDDd.....',
  '......DDDDDd.....',
  '......DDDDDd.....',
  '......bbbbbb.....',
  '......DDDDDd.....',
  '.....DDDDDDdd....',
  '.....DDDDDDdd....',
  '.....DDDdDDDd....',
  '....DDDDdDDDdd...',
  '....DDDDdDDDdd...',
  '....DDDDdDDDDd...',
  '...DDDDDdDDDDdd..',
  '...DDDDDdDDDDdd..',
  '...DDDDDdDDDDdc..',
  '...DDDDdDDDDDdc..',
  '..DDDDDdDDDDDddc.',
  '..DDDDDdDDDDDddc.',
  '..DDDDDdDDDDDddc.',
  '..DDDDDdDDDDDddc.',
  '.DDDDDDdDDDDDdddc',
  '.DDDDDDdDDDDDdddc',
  '.DDDDDdDDDDDDdddc',
  '.ddDDDdDDDDDdddcc',
  '..dddddddddddcc..',
];
const WOMAN_H = WOMAN_ROWS.length;
const WOMAN_SH = 8;
const WOMAN_HIP = 15;

const MAN_COL: Record<string, RGB> = {
  H: P.hair,
  h: P.hairLit,
  s: P.skin,
  S: P.skinSh,
  B: P.beard,
  w: P.shirt,
  t: P.tie,
  J: P.suit,
  j: P.suitLit,
  K: P.suitSh,
  f: P.pink,
  L: P.suit,
  l: P.suitLit,
  e: P.shoe,
  E: P.shoeHi,
};
const WOMAN_COL: Record<string, RGB> = {
  H: P.wHair,
  h: P.wHairLit,
  s: P.wSkin,
  S: P.wSkinSh,
  D: P.dress,
  d: P.dressSh,
  c: P.dressSh2,
  b: P.sash,
};

/**
 * A figure from rows, soles on `feet`, middle column at x. `lean` px tips
 * everything above the hips sideways, the most at the crown.
 */
function figure(
  f: Frame,
  rows: readonly string[],
  col: Record<string, RGB>,
  x: number,
  feet: number,
  mid: number,
  hip: number,
  lean: number
) {
  const top = feet - rows.length + 1;
  rows.forEach((row, r) => {
    const dx = r < hip ? Math.round((lean * (hip - r)) / hip) : 0;
    for (let i = 0; i < row.length; i++) {
      const c = col[row[i]!];
      if (c !== undefined) f.set(x - mid + i + dx, top + r, c);
    }
  });
}

/** Where a row of a leaning figure has moved to. */
const leanAt = (r: number, hip: number, lean: number) =>
  r < hip ? Math.round((lean * (hip - r)) / hip) : 0;

/** A two-pixel arm from (x0, y0) to (x1, y1): sleeve, then a hand. */
function arm(
  f: Frame,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  sleeve: RGB,
  sleeveSh: RGB,
  hand: RGB,
  bare = false
) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
  for (let k = 0; k <= n; k++) {
    const p = k / n;
    const x = x0 + (x1 - x0) * p;
    const y = y0 + (y1 - y0) * p;
    const c = p > 0.86 || (bare && p > 0.15) ? hand : sleeve;
    f.set(x, y, c);
    f.set(x + 1, y, p > 0.86 || (bare && p > 0.15) ? hand : sleeveSh);
  }
}

// ---------- little things ----------

const HEART = ['.X.X.', 'XXXXX', 'XXXXX', '.XXX.', '..X..'];
const HEART_BIG = [
  '.XX.XX.',
  'XXXXXXX',
  'XXXXXXX',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];

function heart(
  f: Frame,
  x: number,
  y: number,
  big: boolean,
  c: RGB,
  hi: RGB,
  a = 1
) {
  const rows = big ? HEART_BIG : HEART;
  const ox = Math.round(x) - (rows[0]!.length >> 1);
  const oy = Math.round(y) - (rows.length >> 1);
  rows.forEach((row, r) => {
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== 'X') continue;
      const hl = r === 1 && i === 1;
      if (a >= 1) f.set(ox + i, oy + r, hl ? hi : c);
      else f.dset(ox + i, oy + r, hl ? hi : c, a);
    }
  });
}

/** A four-pointed twinkle, 0..1 through its life. */
function twinkle(f: Frame, x: number, y: number, p: number, c: RGB, hi: RGB) {
  if (p <= 0 || p >= 1) return;
  const r = Math.round(Math.sin(p * Math.PI) * 3);
  f.set(x, y, hi);
  for (let k = 1; k <= r; k++) {
    const c2 = k === r ? c : hi;
    f.set(x + k, y, c2);
    f.set(x - k, y, c2);
    f.set(x, y + k, c2);
    f.set(x, y - k, c2);
  }
}

/** A flower on the arch: a cross of petals round a golden eye. */
function flower(f: Frame, x: number, y: number, c: RGB, open: number) {
  if (open <= 0) return;
  x = Math.round(x);
  y = Math.round(y);
  if (open < 0.5) {
    f.set(x, y, c);
    return;
  }
  f.set(x - 1, y, c);
  f.set(x + 1, y, c);
  f.set(x, y - 1, c);
  f.set(x, y + 1, c);
  f.set(x, y, c === P.white ? P.peach : P.goldHi);
}

const PETALS = [P.pink, P.pinkLt, P.white, P.red, P.peach, P.pink];

// ---------- the view ----------

export type CeremonyView = {
  /** Draws the close-up into f, `age` ms after the tap. */
  draw(f: Frame, age: number): void;
  /** A tap on the close-up: a puff of petals, `age` ms into the show. */
  puff(x: number, y: number, age: number): void;
};

export function ceremonyView(w: number, h: number): CeremonyView {
  const HZ = 60; // the horizon
  const SHORE = 95; // where the lagoon meets the sand
  const GY = 133; // where they stand
  const ax = Math.round(w / 2) + (w < 220 ? 6 : 0); // middle of the arch
  const AW = 25; // half the arch's width
  const POST_TOP = 76; // where the posts turn into the arch
  const womanX = ax - 9;
  const manX = ax + 8;
  const tableX = ax + 24; // middle of the table
  const TABLE_TOP = GY - 19;
  const palmX = ax - AW - 25;
  const sunX = Math.round(ax - clamp(w * 0.3, 40, 150));
  const sunY = HZ - 9;

  // ---- what doesn't move ----
  const back = layer(w, h, (f) => {
    gradient(f, 0, HZ, [
      P.sky0,
      P.sky1,
      P.sky2,
      P.sky3,
      P.sky4,
      P.sky5,
      P.sky6,
      P.sky7,
    ]);
    // long streaks of cloud lit pink from below
    for (let i = 0; i < Math.max(4, Math.round(w / 70)); i++) {
      const cy = 14 + Math.round(hash2(i, 1, 41) * 30);
      const cx = hash2(i, 2, 41) * w;
      const len = 20 + hash2(i, 3, 41) * 40;
      for (let k = 0; k < 3; k++) {
        const l = len * (1 - k * 0.3);
        const x0 = Math.round(cx - l / 2 + k * 3);
        f.hline(
          x0,
          x0 + Math.round(l),
          cy + k,
          k === 2 ? P.cloudLit : k ? P.cloud : P.cloudSh
        );
      }
    }
    glow(f, sunX, sunY, 40, P.sunGlow, 0.55, 0.8, 0.06);
    f.disc(sunX, sunY, 7, P.sun);
    // the lagoon, paler towards the beach
    gradient(f, HZ, SHORE, [P.sea0, P.sea1, P.sea2, P.sea3, P.sea4]);
    f.hline(0, w, HZ, P.sea0);
    // water villas far out on the horizon, on a long jetty
    const hut0 = ax + 40;
    if (hut0 < w) f.hline(hut0 - 6, w, HZ - 1, P.hutDark);
    for (let k = 0; k < 8; k++) {
      const hx = hut0 + k * 13;
      if (hx > w + 6) break;
      f.hline(hx - 3, hx + 3, HZ - 3, P.hutDark);
      f.hline(hx - 3, hx + 3, HZ - 2, P.hutDark);
      for (let r = 0; r < 4; r++)
        f.hline(
          hx - r - 1,
          hx + r + 1,
          HZ - 7 + r,
          r === 3 ? P.hutDark : P.hut
        );
      f.set(hx, HZ - 8, P.hut);
    }
    // and an island on the other side, with a couple of palms
    const isleR = Math.min(46, ax - 50);
    if (isleR > 10) {
      const icx = isleR * 0.6;
      for (let x = 0; x < icx + isleR; x++) {
        const u = (x - icx) / isleR;
        if (Math.abs(u) >= 1) continue;
        const top = HZ - Math.round(Math.sqrt(1 - u * u) * 4);
        if (top < HZ) f.vline(x, top, HZ - 1, P.hutDark);
      }
      for (const [k, lean] of [
        [-0.3, -1],
        [0.25, 1],
      ] as const) {
        const px = Math.round(icx + k * isleR);
        const top = HZ - 10;
        f.line(px, HZ - 4, px + lean, top + 1, P.hutDark);
        const cx = px + lean;
        for (const s of [-1, 1]) {
          f.set(cx + s, top, P.hutDark);
          f.set(cx + s * 2, top, P.hutDark);
          f.set(cx + s * 3, top + 1, P.hutDark);
          f.set(cx + s * 4, top + 2, P.hutDark);
          f.set(cx + s, top - 1, P.hutDark);
        }
        f.set(cx, top - 1, P.hutDark);
      }
    }
    // the sand
    gradient(f, SHORE, h, [P.wet, P.sand0, P.sand1, P.sand2, P.sand3]);
    // petals scattered down the aisle in front of the arch
    for (let i = 0; i < 46; i++) {
      const v = hash2(i, 1, 77);
      const y = Math.round(GY + 2 + v * (h - GY - 3));
      const half = 8 + v * 18;
      const x = Math.round(ax + (hash2(i, 2, 77) - 0.5) * 2 * half);
      f.set(x, y, PETALS[i % PETALS.length]!);
      if (hash2(i, 3, 77) > 0.6) f.set(x + 1, y, PETALS[(i + 2) % 6]!);
    }
    // footprints coming up from the right
    for (let k = 0; k < 8; k++) {
      const fx = Math.round(tableX + 14 + k * 9 + (k % 2) * 2);
      const fy = Math.round(GY + 6 + k * 1.6 + (k % 2) * 2);
      f.hline(fx, fx + 1, fy, P.sandSh);
    }
  });

  // ---- the arch ----
  type Bloom = { x: number; y: number; c: RGB; at: number; leaf: boolean };
  const blooms: Bloom[] = [];
  {
    // along the curve and down the posts, thickest at the shoulders
    let i = 0;
    const along = (ang: number, n: number, spread: number) => {
      for (let k = 0; k < n; k++, i++) {
        const a = ang + (hash2(i, 1, 9) - 0.5) * spread;
        const rr = AW + (hash2(i, 2, 9) - 0.5) * 6;
        blooms.push({
          x: ax + Math.cos(a) * rr,
          y: POST_TOP - Math.sin(a) * rr * 1.05,
          c: [P.pink, P.white, P.red, P.pinkLt, P.peach][i % 5]!,
          at: hash2(i, 3, 9),
          leaf: hash2(i, 4, 9) > 0.62,
        });
      }
    };
    along(Math.PI * 0.8, 26, 0.55);
    along(Math.PI * 0.2, 26, 0.55);
    along(Math.PI * 0.5, 14, 0.5);
    for (const side of [-1, 1])
      for (let k = 0; k < 7; k++, i++)
        blooms.push({
          x: ax + side * AW + (hash2(i, 1, 9) - 0.5) * 5,
          y: POST_TOP + 4 + k * 5 + hash2(i, 2, 9) * 3,
          c: [P.pinkLt, P.white, P.pink][k % 3]!,
          at: 0.2 + hash2(i, 3, 9) * 0.6,
          leaf: k % 2 === 1,
        });
    // a big knot of flowers at the top of each post
    for (const side of [-1, 1])
      for (let k = 0; k < 10; k++, i++)
        blooms.push({
          x: ax + side * (AW - 2) + (hash2(i, 1, 9) - 0.5) * 9,
          y: POST_TOP - 6 + (hash2(i, 2, 9) - 0.5) * 9,
          c: [P.red, P.pink, P.white, P.pinkLt, P.peach][k % 5]!,
          at: hash2(i, 3, 9) * 0.5,
          leaf: k % 3 === 0,
        });
  }

  function drawArch(f: Frame, age: number, sway: number) {
    const p = span(age, CEREMONY.arch0, CEREMONY.arch1);
    if (p <= 0) return;
    // it rises out of the sand, overshoots a touch and settles
    const lift = Math.round((1 - backOut(p)) * (GY - POST_TOP + AW + 6));
    const ground = GY - 3;
    const put = (x: number, y: number, c: RGB) => {
      const yy = y + lift;
      if (yy <= ground) f.set(x, yy, c);
    };
    // the posts: bamboo, with a node every few pixels
    for (const side of [-1, 1]) {
      const px = ax + side * AW - 1;
      for (let y = POST_TOP; y <= ground; y++) {
        const node = (y - POST_TOP) % 7 === 3;
        put(px, y, node ? P.bam0 : P.bam1);
        put(px + 1, y, node ? P.bam1 : P.bam2);
        put(px + 2, y, P.bam0);
      }
    }
    // the curve over the top
    for (let a = 0; a <= Math.PI; a += 0.012) {
      for (let k = -1; k <= 1; k++) {
        const rr = AW + k;
        const x = Math.round(ax + Math.cos(a) * rr);
        const y = Math.round(POST_TOP - Math.sin(a) * rr * 1.05);
        put(x, y, k === 1 ? P.bam2 : k === 0 ? P.bam1 : P.bam0);
      }
    }
    // white drapes: a swag across the top and tails down the outside
    for (let x = ax - AW + 2; x <= ax + AW - 2; x++) {
      const u = (x - ax) / AW;
      const top = POST_TOP - Math.sqrt(Math.max(0, 1 - u * u)) * AW * 1.05;
      const sag = Math.cos(u * Math.PI * 1.5) * 3 + 7;
      for (let y = Math.round(top) + 2; y <= top + sag; y++)
        put(x, y, y > top + sag - 1.5 ? P.drapeSh : P.drape);
    }
    for (const side of [-1, 1]) {
      for (let y = POST_TOP - 4; y <= ground - 2; y++) {
        const v = (y - POST_TOP + 4) / (ground - POST_TOP);
        const wv = Math.sin(age / 400 + y / 6 + side) * v * 1.6 + sway * v * 4;
        const x0 = ax + side * (AW + 2) + Math.round(wv);
        const wd = 2 + Math.round(v * 2);
        for (let k = 0; k < wd; k++)
          put(x0 + side * k, y, k === wd - 1 ? P.drapeSh : P.drape);
      }
    }
    // flowers popping open one by one
    for (const b of blooms) {
      const q = span(age, CEREMONY.bloom0, CEREMONY.bloom1);
      const open = (q - b.at * 0.7) / 0.3;
      if (open <= 0) continue;
      if (b.leaf) {
        put(Math.round(b.x) - 1, Math.round(b.y) + 1, P.leaf0);
        put(Math.round(b.x) + 1, Math.round(b.y) + 1, P.leaf1);
      }
      if (b.y + lift <= ground) flower(f, b.x, b.y + lift, b.c, open);
    }
  }

  // ---- the table, the paper, the bucket ----
  function drawTable(f: Frame, age: number) {
    const x0 = tableX - 8;
    const x1 = tableX + 8;
    // cloth to the sand, in folds
    for (let y = TABLE_TOP; y <= GY; y++) {
      const flare = Math.round(((y - TABLE_TOP) / (GY - TABLE_TOP)) * 1.5);
      for (let x = x0 - flare; x <= x1 + flare; x++) {
        const fold = (x - x0 + 1) % 5 === 0 && y > TABLE_TOP + 2;
        f.set(
          x,
          y,
          y === TABLE_TOP
            ? P.cloth
            : x >= x1 + flare - 1
              ? P.clothSh2
              : fold
                ? P.clothSh
                : y === TABLE_TOP + 1
                  ? P.clothSh
                  : P.cloth
        );
      }
    }
    f.hline(x0, x1, TABLE_TOP - 1, P.cloth);
    f.hline(x0 - 1, x1 + 1, TABLE_TOP + 1, P.clothSh);
    // the paper, with the lines filling in as they write
    const px = tableX - 1;
    const py = TABLE_TOP - 2;
    f.rect(px, py, 7, 2, P.paper);
    f.hline(px, px + 6, py + 2, P.shirtSh);
    const wrote = span(age, CEREMONY.write0, CEREMONY.write1);
    for (let k = 0; k < Math.round(wrote * 9); k++) {
      const row = k < 5 ? 0 : 1;
      const col = row ? k - 5 : k;
      if (hash2(k, 1, 3) > 0.25) f.set(px + 1 + col, py + row, P.ink);
    }
    // the pen, lying there until he picks it up
    const signing = age >= CEREMONY.sign0 && age < CEREMONY.bottle0;
    if (!signing) {
      f.set(px + 3, py - 1, P.pen);
      f.set(px + 4, py - 1, P.gold);
    }
    // two flutes
    for (const gx of [x1 - 2, x1]) {
      f.vline(gx, TABLE_TOP - 5, TABLE_TOP - 1, P.glass);
      f.set(gx, TABLE_TOP - 4, P.bubbly);
      f.set(gx, TABLE_TOP - 3, P.bubbly);
    }
    // the ice bucket, with the bottle in it until he takes it out
    const bx = x0 + 1;
    for (let y = TABLE_TOP - 5; y <= TABLE_TOP - 1; y++)
      f.hline(bx, bx + 4, y, y === TABLE_TOP - 5 ? P.white : P.bucket);
    f.vline(bx + 4, TABLE_TOP - 4, TABLE_TOP - 1, P.bucketSh);
    if (age < CEREMONY.bottle0 + 150) {
      f.vline(bx + 2, TABLE_TOP - 10, TABLE_TOP - 6, P.bottle);
      f.vline(bx + 1, TABLE_TOP - 8, TABLE_TOP - 6, P.bottle);
      f.vline(bx + 3, TABLE_TOP - 8, TABLE_TOP - 6, P.bottleHi);
      f.set(bx + 2, TABLE_TOP - 11, P.foil);
      f.set(bx + 2, TABLE_TOP - 12, P.foil);
    }
  }

  // ---- the people ----
  const manTop = GY - MAN_H + 1;
  const womanTop = GY - WOMAN_H + 1;
  const handsY = GY - 21;

  /** How far each of them leans, 0 standing straight. */
  function leans(age: number) {
    const sign =
      smooth(span(age, CEREMONY.sign0, CEREMONY.sign0 + 250)) *
      (1 - smooth(span(age, CEREMONY.flourish1, CEREMONY.flourish1 + 250)));
    const kissIn = smooth(span(age, CEREMONY.kiss0, CEREMONY.kiss0 + 450));
    const kissOut = smooth(span(age, CEREMONY.kiss1 - 400, CEREMONY.kiss1));
    const kiss = kissIn * (1 - kissOut);
    return {
      kiss,
      man: Math.round(sign * 4 - kiss * 5),
      woman: Math.round(kiss * 4 + sign * 1),
      step: Math.round(kiss * 2),
    };
  }

  /** His right shoulder, after the lean. */
  const manRight = (lean: number, step: number) =>
    [
      manX - step + 4 + leanAt(MAN_SH + 1, MAN_HIP, lean),
      manTop + MAN_SH + 1,
    ] as const;

  /**
   * The champagne in his right hand, once he's taken it out of the bucket:
   * where his hand is, which way the neck points, and where its mouth is.
   */
  function bottlePose(age: number) {
    if (age < CEREMONY.bottle0 + 150 || age >= CEREMONY.end) return null;
    const ln = leans(age);
    const [sx, sy] = manRight(ln.man, ln.step);
    const bucket = [tableX - 5, TABLE_TOP - 8] as const;
    // held up high and out to the side, away from her
    const hold = [sx + 3, sy - 6] as const;
    const up = smooth(
      span(age, CEREMONY.bottle0 + 250, CEREMONY.bottle0 + 600)
    );
    // and down by his side once it's done
    const down = smooth(span(age, CEREMONY.kiss0 - 150, CEREMONY.kiss0 + 200));
    const side = [sx + 3, handsY + 2] as const;
    let hx = bucket[0] + (hold[0] - bucket[0]) * up;
    let hy = bucket[1] + (hold[1] - bucket[1]) * up;
    hx += (side[0] - hx) * down;
    hy += (side[1] - hy) * down;
    const shake =
      age > CEREMONY.pop - 380 && age < CEREMONY.pop
        ? Math.floor(age / 45) % 2
          ? 0.16
          : -0.16
        : 0;
    // it kicks back a little when it goes
    const kick =
      age > CEREMONY.pop ? 0.25 * Math.exp(-(age - CEREMONY.pop) / 200) : 0;
    let ang = -1.57 + 0.3 * up + shake - kick;
    ang += (1.25 - ang) * down;
    const ux = Math.cos(ang);
    const uy = Math.sin(ang);
    return {
      hand: [Math.round(hx), Math.round(hy)] as const,
      ang,
      mouth: [hx + ux * 11, hy + uy * 11] as const,
    };
  }

  function drawCouple(f: Frame, age: number) {
    const ln = leans(age);
    // (they step in to each other for the kiss)
    const wX = womanX + ln.step;
    const mX = manX - ln.step;
    // her veil first, behind her, lifting in the breeze
    {
      const vx = wX + leanAt(1, WOMAN_HIP, ln.woman);
      for (let r = 1; r < 30; r++) {
        const v = r / 30;
        const flow = Math.sin(age / 450 - r / 5) * v * 2;
        const xl = Math.round(vx - 4 - v * 7 - flow);
        const xr = vx - 2 + Math.round(v * 2);
        for (let x = xl; x <= xr; x++)
          f.blend(x, womanTop + r, P.veil, x === xl ? 0.85 : 0.55);
      }
    }
    figure(f, WOMAN_ROWS, WOMAN_COL, wX, GY, 8, WOMAN_HIP, ln.woman);
    figure(f, MAN_ROWS, MAN_COL, mX, GY, 6, MAN_HIP, ln.man);

    // shoulders, after the lean
    const mL = [
      mX - 5 + leanAt(MAN_SH + 1, MAN_HIP, ln.man),
      manTop + MAN_SH + 1,
    ] as const;
    const mR = manRight(ln.man, ln.step);
    const wL = [
      wX - 4 + leanAt(WOMAN_SH + 1, WOMAN_HIP, ln.woman),
      womanTop + WOMAN_SH + 1,
    ] as const;
    const wR = [
      wX + 3 + leanAt(WOMAN_SH + 1, WOMAN_HIP, ln.woman),
      womanTop + WOMAN_SH + 1,
    ] as const;
    // holding hands between them, except while he signs
    const meet = [Math.round((wX + mX) / 2), handsY] as const;
    const holding = age < CEREMONY.sign0 || age > CEREMONY.bottle0 + 100;

    // her: the bouquet in one hand, his hand in the other
    arm(f, wL[0], wL[1], wX - 3, handsY + 1, P.wSkin, P.wSkinSh, P.wSkin, true);
    const herHand = holding ? meet : ([wR[0] + 1, handsY] as const);
    arm(
      f,
      wR[0],
      wR[1],
      herHand[0] - 1,
      herHand[1],
      P.wSkin,
      P.wSkinSh,
      P.wSkin,
      true
    );
    {
      const bx = wX - 2;
      const by = handsY + 1;
      f.set(bx, by + 3, P.leaf0);
      f.set(bx + 1, by + 4, P.leaf1);
      f.set(bx - 1, by + 2, P.leaf1);
      flower(f, bx - 1, by - 1, P.pink, 1);
      flower(f, bx + 2, by - 1, P.white, 1);
      flower(f, bx, by + 1, P.red, 1);
      flower(f, bx + 2, by + 2, P.pinkLt, 1);
    }

    // him: his left hand in hers, his right on the pen or the bottle
    const myHand = holding ? meet : ([mL[0] - 1, handsY + 1] as const);
    arm(f, mL[0], mL[1], myHand[0] + 1, myHand[1], P.suit, P.suitSh, P.skin);
    const rest = [mR[0] + 1, handsY + 1] as const;
    if (age >= CEREMONY.sign0 && age < CEREMONY.bottle0) {
      // writing: the hand scratches along the paper, then lifts for the
      // flourish, then comes back
      let to: readonly [number, number];
      if (age < CEREMONY.write1) {
        const wr = span(age, CEREMONY.write0, CEREMONY.write1);
        to = [
          tableX + Math.round(wr * 4) + (Math.floor(age / 70) % 2),
          TABLE_TOP - 3,
        ];
      } else {
        // a quick little loop of the pen; the gold one rises off it
        const [fx, fy] = flourishAt(
          span(age, CEREMONY.write1, CEREMONY.flourish1)
        );
        const [f0x, f0y] = flourishAt(0);
        to = [
          tableX + 3 + Math.round((fx - f0x) * 0.2),
          TABLE_TOP - 3 + Math.round((fy - f0y) * 0.2),
        ];
      }
      const go =
        smooth(span(age, CEREMONY.sign0, CEREMONY.write0)) *
        (1 - smooth(span(age, CEREMONY.flourish1, CEREMONY.bottle0)));
      const rh = [
        Math.round(rest[0] + (to[0] - rest[0]) * go),
        Math.round(rest[1] + (to[1] - rest[1]) * go),
      ] as const;
      arm(f, mR[0], mR[1], rh[0], rh[1], P.suit, P.suitSh, P.skin);
      if (go > 0.5) {
        f.set(rh[0] + 1, rh[1] - 1, P.pen);
        f.set(rh[0] + 2, rh[1] - 2, P.gold);
      }
      return;
    }
    const b = bottlePose(age);
    if (age >= CEREMONY.bottle0 && b) {
      arm(f, mR[0], mR[1], b.hand[0], b.hand[1], P.suit, P.suitSh, P.skin);
      bottle(f, b.hand[0], b.hand[1], b.ang, age < CEREMONY.pop);
      return;
    }
    if (age >= CEREMONY.bottle0) {
      // reaching for it
      const r0 = smooth(span(age, CEREMONY.bottle0, CEREMONY.bottle0 + 150));
      const to = [tableX - 5, TABLE_TOP - 8] as const;
      arm(
        f,
        mR[0],
        mR[1],
        Math.round(rest[0] + (to[0] - rest[0]) * r0),
        Math.round(rest[1] + (to[1] - rest[1]) * r0),
        P.suit,
        P.suitSh,
        P.skin
      );
      return;
    }
    arm(f, mR[0], mR[1], rest[0], rest[1], P.suit, P.suitSh, P.skin);
  }

  /** The bottle in his hand at (x, y), its neck pointing along `ang`. */
  function bottle(
    f: Frame,
    x: number,
    y: number,
    ang: number,
    corked: boolean
  ) {
    const ux = Math.cos(ang);
    const uy = Math.sin(ang);
    for (let k = -1; k <= 10; k++) {
      const cx = x + ux * k;
      const cy = y + uy * k;
      if (k < 6) {
        // the body, two pixels thick with a shine down one side
        f.set(cx, cy, P.bottle);
        f.set(cx - uy, cy + ux, P.bottle);
        f.set(cx + uy, cy - ux, k > 0 && k < 5 ? P.bottleHi : P.bottle);
        if (k === 2 || k === 3) f.set(cx - uy, cy + ux, P.cloth); // the label
      } else f.set(cx, cy, k > 7 ? P.foil : P.bottle);
    }
    if (corked) {
      f.set(x + ux * 11, y + uy * 11, P.cork);
      f.set(x + ux * 11.8, y + uy * 11.8, P.cork);
    }
  }

  // the pen's flourish: a big loop and a tail over the table, 0..1
  const flourishAt = (q: number) => {
    const th = q * Math.PI * 2.3;
    const x0 = tableX + 1;
    const y0 = TABLE_TOP - 5;
    return [
      x0 + th * 3 - Math.sin(th) * 8,
      y0 - (1 - Math.cos(th)) * 7 - q * 10,
    ] as const;
  };

  function drawFlourish(f: Frame, age: number) {
    if (age < CEREMONY.write1 || age > CEREMONY.bottle0 + 300) return;
    const q = span(age, CEREMONY.write1, CEREMONY.flourish1);
    const fade =
      1 - span(age, CEREMONY.flourish1 + 100, CEREMONY.bottle0 + 300);
    const n = 90;
    for (let k = 0; k <= n * q; k++) {
      const [x, y] = flourishAt(k / n);
      const fresh = q - k / n < 0.1;
      if (fade <= 0) continue;
      f.dset(x, y, fresh ? P.goldHi : P.gold, fade);
      // thicker where the pen's moving fastest
      if (k % 2 === 0) f.dset(x + 1, y, P.gold, fade * 0.7);
      // sparks shed along it
      if (hash2(k, 1, 17) > 0.85) {
        const p = span(
          age,
          CEREMONY.write1 + (k / n) * 550,
          CEREMONY.write1 + (k / n) * 550 + 700
        );
        twinkle(f, Math.round(x), Math.round(y) - 2, p, P.gold, P.goldHi);
      }
    }
    if (q >= 1) {
      // and a twinkle where it ends
      const [x, y] = flourishAt(1);
      twinkle(
        f,
        Math.round(x) + 1,
        Math.round(y) - 1,
        span(age, CEREMONY.flourish1, CEREMONY.flourish1 + 700),
        P.gold,
        P.goldHi
      );
    }
  }

  // ---- the champagne ----
  function drawPop(f: Frame, age: number) {
    const a = age - CEREMONY.pop;
    if (a < 0 || a > 2600) return;
    const b = bottlePose(age);
    const at = bottlePose(CEREMONY.pop);
    if (!at) return;
    const [mx, my] = b && age < CEREMONY.kiss0 - 150 ? b.mouth : at.mouth;
    const s = a / 1000;
    // the flash: a starburst and a ring of light
    if (a < 320) {
      const p = a / 320;
      const r = 3 + p * 10;
      for (let k = 0; k < 12; k++) {
        const t = (k / 12) * Math.PI * 2;
        const long = k % 2 ? 0.6 : 1;
        for (let j = Math.max(1, r * long - 4); j <= r * long; j++)
          f.set(
            at.mouth[0] + Math.cos(t) * j,
            at.mouth[1] + Math.sin(t) * j,
            j > r * long - 1.5 ? P.gold : P.goldHi
          );
      }
      glow(
        f,
        at.mouth[0],
        at.mouth[1],
        8 + p * 16,
        P.goldHi,
        0.5 * (1 - p),
        1,
        0.05
      );
    }
    // the cork, flying up and over into the lagoon
    {
      const vx = 40;
      const vy = -185;
      const g = 250;
      const [ox, oy] = at.mouth;
      const cx = ox + vx * s;
      const cy = oy + vy * s + 0.5 * g * s * s;
      const landY = SHORE - 7;
      const landT = (-vy + Math.sqrt(vy * vy + 2 * g * (landY - oy))) / g;
      if (s < landT) {
        f.rect(Math.round(cx), Math.round(cy), 2, 2, P.cork);
        f.set(Math.round(cx), Math.round(cy) + 1, P.bam0);
        // a streak of sparkle behind it
        for (let k = 1; k <= 4; k++)
          f.dset(
            cx - vx * 0.012 * k,
            cy - (vy + g * s) * 0.012 * k,
            P.goldHi,
            1 - k * 0.22
          );
      } else if (s < landT + 1) {
        // plip
        const lx = ox + vx * landT;
        const d = s - landT;
        const r = 1 + d * 10;
        f.hline(Math.round(lx - r), Math.round(lx - r + 1), landY, P.foam);
        f.hline(Math.round(lx + r - 1), Math.round(lx + r), landY, P.foam);
        if (d < 0.35) {
          const up = Math.round(Math.sin((d / 0.35) * Math.PI) * 4);
          f.vline(Math.round(lx), landY - up, landY - 1, P.foam);
          f.set(lx - 1, landY - 1, P.foam);
          f.set(lx + 1, landY - 1, P.foam);
        }
      }
    }
    // the foam: a fountain out of the neck, raining down all round
    const ang = at.ang;
    const ux = Math.cos(ang);
    const uy = Math.sin(ang);
    for (let i = 0; i < 120; i++) {
      const born = hash2(i, 1, 21) ** 2 * 1100;
      const bt = (a - born) / 1000;
      if (bt < 0) continue;
      const spread = (hash2(i, 2, 21) - 0.5) * 1.1;
      const sp = (60 + hash2(i, 3, 21) * 110) * (1 - born / 2200);
      const dx = (ux * Math.cos(spread) - uy * Math.sin(spread)) * sp;
      const dy = (uy * Math.cos(spread) + ux * Math.sin(spread)) * sp;
      const x = mx + dx * bt;
      const y = my + dy * bt + 0.5 * 240 * bt * bt;
      if (y > GY + 4 || bt > 1.4) continue;
      const c = i % 3 === 0 ? P.bubbly : i % 3 === 1 ? P.froth : P.white;
      f.set(x, y, c);
      if (bt < 0.3) f.set(x - dx * 0.025, y - dy * 0.025, P.froth);
    }
    // and frothing over his hand for a moment
    if (a < 900 && b) {
      for (let k = 0; k < 6; k++) {
        const fx = mx + (hash2(k, Math.floor(a / 80), 5) - 0.5) * 4;
        const fy = my + hash2(k, Math.floor(a / 80) + 9, 5) * 3;
        f.set(fx, fy, k % 2 ? P.froth : P.white);
      }
    }
  }

  // ---- petals and hearts ----
  const burstX = ax;
  const burstY = GY - MAN_H + 2; // between their heads
  function drawBurst(f: Frame, age: number) {
    const a = age - CEREMONY.burst;
    if (a < 0) return;
    const s = a / 1000;
    const ox = burstX;
    const oy = burstY;
    // a flash of warm light out of the middle of them
    if (a < 600) {
      const p = a / 600;
      glow(f, ox, oy, 12 + p * 50, P.heartHi, 0.6 * (1 - p), 0.8, 0.05);
      const r = 4 + p * 60;
      for (let k = 0; k < 64; k++) {
        const t = (k / 64) * Math.PI * 2;
        f.dset(
          ox + Math.cos(t) * r * 1.3,
          oy + Math.sin(t) * r * 0.8,
          P.white,
          1 - p
        );
      }
    }
    // petals everywhere, then drifting down on the breeze
    const n = Math.round(clamp(w * 0.75, 140, 340));
    for (let i = 0; i < n; i++) {
      const ang = hash2(i, 1, 55) * Math.PI * 2;
      const sp = 50 + hash2(i, 2, 55) * 190;
      const k = 1.9; // drag
      const d = (sp * (1 - Math.exp(-k * s))) / k;
      const fall = 10 + hash2(i, 3, 55) * 16;
      const drift = Math.max(0, s - 0.5);
      const x =
        ox +
        Math.cos(ang) * d * (w / 150) * 0.8 +
        Math.sin(s * 3 + i) * 2.5 * Math.min(1, s) +
        drift * 6;
      const y =
        oy +
        Math.sin(ang) * d * 0.9 -
        18 * Math.min(s, 0.6) +
        fall * drift ** 1.15;
      if (y > h || y < -2) continue;
      const c = PETALS[i % PETALS.length]!;
      // tumbling: flat, then edge on
      const turn = Math.floor(age / 110 + i) % 4;
      f.set(x, y, c);
      if (turn) f.set(x + 1, y, c);
      if (turn === 2 && i % 2) {
        f.set(x, y + 1, c);
        f.set(x + 1, y + 1, lerpRGB(c, P.red, 0.3));
      }
    }
    // hearts burst out with them and float up
    const hn = Math.round(clamp(w * 0.07, 12, 32));
    for (let i = 0; i < hn; i++) {
      const life = 2200 + hash2(i, 4, 56) * 1000;
      const b = a - hash2(i, 5, 56) * 300;
      if (b < 0 || b > life) continue;
      const q = b / 1000;
      const ang = -Math.PI / 2 + (hash2(i, 1, 56) - 0.5) * 3.4;
      const sp = 60 + hash2(i, 2, 56) * 110;
      const d = (sp * (1 - Math.exp(-2.2 * q))) / 2.2;
      const x =
        ox + Math.cos(ang) * d * (w / 150) * 0.7 + Math.sin(q * 3 + i) * 2.5;
      const y = oy + Math.sin(ang) * d * 0.8 - q * 9;
      const fade = 1 - span(b, life - 600, life);
      heart(f, x, y, i % 3 !== 2, i % 2 ? P.heart : P.pink, P.heartHi, fade);
    }
  }

  // ---- the young palm ----
  function drawPalm(f: Frame, age: number) {
    const sway = Math.sin(age / 900) * 0.06;
    const grow = smooth(span(age, CEREMONY.frond0, CEREMONY.frond1));
    const base = GY - 1;
    const sparkle = age > CEREMONY.frond0 - 300 && age < CEREMONY.end;
    const p = span(age, CEREMONY.frond0 - 300, CEREMONY.close0 + 300);
    const g = Math.sin(p * Math.PI);
    if (sparkle)
      glow(f, palmX + 6, base - 28, 38 * g + 4, P.goldHi, 0.6 * g, 0.9, 0.05);
    const [cx, cy] = sapling(f, palmX, base, 4, sway, grow);
    plaque(f, palmX + 5, base + 1, true);
    if (sparkle) {
      // it sparkles all over while the new frond comes
      for (let i = 0; i < 20; i++) {
        const ph = ((age - CEREMONY.frond0) / 650 + hash2(i, 1, 61)) % 1;
        if (age - CEREMONY.frond0 + 300 < hash2(i, 1, 61) * 600) continue;
        const x = cx + Math.round((hash2(i, 2, 61) - 0.5) * 56);
        const y = cy + Math.round((hash2(i, 3, 61) - 0.4) * 46);
        twinkle(f, x, y, ph, P.gold, P.goldHi);
      }
      // and a big twinkle at the tip of the new frond as it opens
      if (grow > 0 && grow < 1)
        twinkle(
          f,
          cx + Math.round(grow * 12),
          cy - 4 - Math.round((1 - grow) * 10),
          (age / 500) % 1,
          P.fresh2,
          P.white
        );
    }
  }

  // ---- the lagoon's glitter and the wash on the sand ----
  function drawLagoon(f: Frame, age: number) {
    // the sun's path on the water: short bright streaks, wider towards us
    for (let y = HZ + 1; y < SHORE - 1; y++) {
      const near = (y - HZ) / (SHORE - HZ);
      const half = 3 + near * 16;
      for (let k = 0; k < 3; k++) {
        const on = Math.sin(age / 260 + hash2(y, k, 13) * 30);
        if (on < 0.35) continue;
        const x = Math.round(sunX + (hash2(y, k + 5, 13) - 0.5) * 2 * half);
        const len = 1 + Math.round(near * 3 * hash2(y, k + 9, 13));
        f.hline(x, x + len, y, on > 0.85 ? P.glintHi : P.glint);
      }
    }
    const sw = Math.sin(age / 1100) * 1.5;
    for (let x = 0; x < w; x++) {
      const y = Math.round(SHORE + 1 + sw + Math.sin(x / 7 + age / 700) * 0.7);
      f.set(x, y, P.foam);
      if (hash2(x >> 1, Math.floor(age / 500), 4) > 0.55)
        f.set(x, y + 1, P.sea4);
    }
  }

  // ---- torches along the beach, where there's room for them ----
  const torches = [-110, -70, 70, 110]
    .map((d) => ax + d)
    .filter((x) => x > 6 && x < w - 6 && (x < palmX - 28 || x > palmX + 36));
  function drawTorches(f: Frame, age: number) {
    for (const [i, x] of torches.entries()) {
      const top = GY - 24;
      glow(f, x, top - 3, 14, P.sunGlow, 0.3, 0.9, 0.05);
      f.vline(x, top + 2, GY - 1, P.bam1);
      f.vline(x + 1, top + 2, GY - 1, P.bam0);
      f.hline(x - 1, x + 2, top + 1, P.bam0);
      f.hline(x - 1, x + 2, top + 2, P.bam1);
      f.hline(x - 2, x + 3, GY, P.sandSh);
      // the flame, never still
      const fl = Math.floor(age / 90 + i * 3);
      const tall = 4 + (hash2(fl, i, 7) > 0.5 ? 1 : 0);
      const lean = hash2(fl, i + 4, 7) > 0.6 ? 1 : 0;
      for (let k = 0; k < tall; k++) {
        const half = k < 2 ? 1 : 0;
        const cx = x + (k > tall - 3 ? lean : 0);
        f.hline(
          cx - half,
          cx + 1,
          top - k,
          k < 1 ? P.peach : k < tall - 1 ? P.gold : P.goldHi
        );
      }
      f.set(x, top - 1, P.goldHi);
    }
  }

  // ---- taps during the show ----
  const puffs: { x: number; y: number; at: number }[] = [];
  function drawPuffs(f: Frame, age: number) {
    for (const p of puffs) {
      const a = (age - p.at) / 1000;
      if (a < 0 || a > 1.4) continue;
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2 + p.at;
        const d = (30 * (1 - Math.exp(-3 * a))) / 3;
        const x = p.x + Math.cos(ang) * d * 1.3;
        const y = p.y + Math.sin(ang) * d + 10 * a * a;
        f.set(x, y, PETALS[i % PETALS.length]!);
      }
      if (a < 0.9)
        heart(f, p.x, p.y - a * 12, false, P.heart, P.heartHi, 1 - a / 0.9);
    }
  }

  return {
    draw(f, age) {
      f.copyFrom(back);
      drawLagoon(f, age);
      const sway = Math.sin(age / 900) * 0.4;
      drawTorches(f, age);
      drawArch(f, age, sway);
      drawPalm(f, age);
      drawTable(f, age);
      drawCouple(f, age);
      drawFlourish(f, age);
      drawPop(f, age);
      // a heart over them when they kiss
      const k = age - CEREMONY.kiss0 - 250;
      if (k > 0 && k < 1500) {
        const y = GY - MAN_H - 4 - k / 120;
        heart(
          f,
          (womanX + manX) / 2,
          y,
          true,
          P.heart,
          P.heartHi,
          1 - span(k, 1000, 1500)
        );
      }
      drawBurst(f, age);
      drawPuffs(f, age);
    },
    puff(x, y, age) {
      // (only a few at once)
      while (puffs.length && age - puffs[0]!.at > 1400) puffs.shift();
      if (puffs.length < 6) puffs.push({ x, y, at: age });
    },
  };
}

/** Light for the find: the little palm on the beach twinkling. */
export function saplingTwinkle(
  f: Frame,
  x: number,
  y: number,
  a: number,
  seed = 1
) {
  for (let i = 0; i < 5; i++) {
    const ph = (a / 600 + hash2(i, 1, seed)) % 1;
    twinkle(
      f,
      Math.round(x + (hash2(i, 2, seed) - 0.5) * 16),
      Math.round(y + (hash2(i, 3, seed) - 0.5) * 12),
      ph,
      lerpRGB(P.gold, P.white, 0.2),
      P.goldHi
    );
  }
}
