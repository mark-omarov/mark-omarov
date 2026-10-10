// People and pictograms for the Malta scene: the man (short light-brown
// hair, a short beard, a black tee), the woman on the promenade (slim, long
// straight near-black hair, a taupe top and a black skirt), the friend on
// the luzzu (dark hair, a straw hat), and the little pictures they talk in.
// Sprites are strings, one char per pixel; arms are drawn by the scene on
// top, so the same body can wave, point, drink or type. All of them face
// right; draw them flipped to face left.

import { type Frame, lerpRGB, type RGB } from '../frame';

export type Sprite = readonly string[];

/**
 * Draws a sprite with its top-left at (x, y). `a` < 1 dithers it in or out;
 * rows below `clipY` are left out (someone standing in a boat).
 */
export function spr(
  f: Frame,
  rows: Sprite,
  x: number,
  y: number,
  pal: Record<string, RGB>,
  flip = false,
  a = 1,
  clipY = Infinity
) {
  const w = rows[0]!.length;
  x = Math.round(x);
  y = Math.round(y);
  for (let j = 0; j < rows.length && y + j <= clipY; j++) {
    const r = rows[j]!;
    for (let i = 0; i < r.length; i++) {
      const c = pal[r[i]!];
      if (c === undefined) continue;
      const px = flip ? x + w - 1 - i : x + i;
      if (a >= 1) f.set(px, y + j, c);
      else f.dset(px, y + j, c, a);
    }
  }
}

/** A palette with every colour pulled `k` of the way towards `to`. */
export function tintPal(
  pal: Record<string, RGB>,
  to: RGB,
  k: number
): Record<string, RGB> {
  if (k <= 0) return pal;
  const out: Record<string, RGB> = {};
  for (const key in pal) out[key] = lerpRGB(pal[key]!, to, k);
  return out;
}

// ---------- on the promenade, about 16 px tall ----------

/**
 * The man standing, turned a little to the right: light-brown hair a bit messy
 * on top, a short beard. No arms (the scene adds them at the shoulders,
 * row 7). 7 x 17.
 * H hair  h hair lit  b beard  s skin  S skin shade  T tee  t tee lit
 * J jeans  j jeans lit  e sneakers
 */
export const MAN = [
  '..hHh..',
  '.HHHHH.',
  '.HHHHHh',
  '.HHssss',
  '.Hbssss',
  '..bbbS.',
  '..tTTT.',
  '.tTTTTT',
  '.tTTTTT',
  '.tTTTTT',
  '.tTTTTT',
  '..JJJJ.',
  '..JJjJ.',
  '..JJ.J.',
  '..JJ.J.',
  '..JJ.j.',
  '.eee.ee',
];

/** Mid-stride. */
export const MAN_STEP = [
  '..hHh..',
  '.HHHHH.',
  '.HHHHHh',
  '.HHssss',
  '.Hbssss',
  '..bbbS.',
  '..tTTT.',
  '.tTTTTT',
  '.tTTTTT',
  '.tTTTTT',
  '.tTTTTT',
  '..JJJJ.',
  '.JJJjJJ',
  '.JJ..JJ',
  'JJ...jJ',
  'JJ....J',
  'ee....e',
];

/**
 * Her, strolling, turned to the right: slim, long straight near-black hair
 * down her back, a sleeveless taupe top and a black skirt. No arms (the
 * scene adds them at row 6). 7 x 16.
 * H hair  h hair sheen  s skin  S skin shade  D top  d top shade
 * K skirt  k skirt shade  e sandals
 */
export const HER = [
  '..HHH..',
  '.HHhHH.',
  '.HHHHs.',
  '.HHHss.',
  '.HHHs..',
  '.HHSs..',
  '.HHDDD.',
  '.HHDDD.',
  '.HHDDd.',
  '.HHDDd.',
  '..KKKK.',
  '.KKKKKk',
  '..s..s.',
  '..s..s.',
  '..s..s.',
  '.ee..ee',
];

/** Mid-stride, her hair swinging behind her. */
export const HER_STEP = [
  '..HHH..',
  '.HHhHH.',
  '.HHHHs.',
  '.HHHss.',
  '.HHHs..',
  'HHHSs..',
  'HH.DDD.',
  'HH.DDD.',
  'H..DDd.',
  '...DDd.',
  '..KKKK.',
  '..KKKKk',
  '...ss..',
  '...ss..',
  '...ss..',
  '...eee.',
];

/**
 * Sitting on the rocks side on, knees up, feet on the ledge below. Faces
 * right. Arms are the scene's. 8 x 12.
 */
export const HER_SIT = [
  '..HHH...',
  '.HHhHH..',
  '.HHHHs..',
  '.HHHss..',
  '.HHHs...',
  '.HHSs...',
  '.HHDDD..',
  '.HHDDD..',
  '.HHDDKss',
  '..KKKKKs',
  '..kkkk.s',
  '.......e',
];

/** The man sitting, faces right. 8 x 12. */
export const MAN_SIT = [
  '..hHh...',
  '.HHHHH..',
  '.HHHHHh.',
  '.HHssss.',
  '.Hbssss.',
  '..bbbS..',
  '..tTTT..',
  '.tTTTTT.',
  '.tTTTTT.',
  '.tTTTJJJ',
  '..JJJJJj',
  '.......e',
];

// ---------- aboard the luzzu, about 8 px of them above the gunwale ----------

/** The man on deck. Arms are the scene's (shoulders at row 4). 5 x 9. */
export const MAN_BOAT = [
  '.hHh.',
  'HHHHH',
  'Hssss',
  'Hbbbs',
  '.tTT.',
  'tTTTT',
  'tTTTT',
  'tTTTT',
  '.JJJ.',
];

/**
 * The friend on deck: dark hair under a wide straw hat, a turquoise
 * top. Shoulders at row 5. 7 x 10.
 * Y hat  y hat shade  r hat band  H hair  s skin  C top  c top shade
 */
export const FRIEND_BOAT = [
  '..YYY..',
  '..rrr..',
  'yYYYYYy',
  '.HHsss.',
  '.HHss..',
  '.HHCC..',
  '.cCCCC.',
  '.cCCCC.',
  '.cCCCC.',
  '..BBB..',
];

// ---------- at the desk, seen through the balcony window ----------

/**
 * The coder at the desk, side on, facing right, in an office chair.
 * Shoulder at (4, 6). 10 x 16.
 * c chair  C chair lit  k chair frame
 */
export const DESK_MAN = [
  '..hHh.....',
  '.HHHHHh...',
  'HHHHHHH...',
  'HHHHsss...',
  'HHHbsss...',
  '.HHbbbS...',
  'c.TTT.....',
  'cTTTTT....',
  'cTTTTT....',
  'cTTTTT....',
  'cTTTTT....',
  'cJJJJJJJ..',
  'cCJJJJJJJ.',
  '.kk....JJ.',
  '..k....JJ.',
  '.k.k...ee.',
];

// ---------- pictograms for the speech bubbles ----------
// s skin  S skin shade  Y yellow  y yellow light  k ink  o ray
// g glass  r wine  R wine shade  m motion  b sleeve

/** An open hand, waving hello. 11 x 9. */
export const PIC_WAVE = [
  'm...s.s....',
  '.m.ss.s.s..',
  'm..s.ss.s..',
  '.m.s.s.ss.s',
  '...sssssss.',
  '.s.sssssSs.',
  '.ssssssSS..',
  '..sssssS...',
  '...SSSS....',
];

/** A smiling face. 9 x 9. */
export const PIC_SMILE = [
  '..YYYYY..',
  '.YyyyyyY.',
  'YyykyykyY',
  'YyykyykyY',
  'YyyyyyyyY',
  'YykyyyykY',
  'YyykkkkyY',
  '.YyyyyyY.',
  '..YYYYY..',
];

/** A glass of red wine. 7 x 10. */
export const PIC_WINE = [
  'g.....g',
  'g.....g',
  'grrrrrg',
  'gRrrrrg',
  '.gRrrg.',
  '..ggg..',
  '...g...',
  '...g...',
  '...g...',
  '.ggggg.',
];

/** The sun. 9 x 9. */
export const PIC_SUN = [
  '....o....',
  '.o.....o.',
  '...YYY...',
  '..YyyyY..',
  'o.YyyyY.o',
  '..YyyyY..',
  '...YYY...',
  '.o.....o.',
  '....o....',
];

/** Thumbs up. 8 x 9. */
export const PIC_THUMB = [
  '...s....',
  '..ss....',
  '..sS....',
  '.ssssss.',
  'bssssssS',
  'bsssssS.',
  'bssssssS',
  'bsssssS.',
  '.SSSSS..',
];

/** Pointing that way (to the rocks). 9 x 5. */
export const PIC_POINT = [
  '..ssssss.',
  'bssssssss',
  'bsssS....',
  'bsssS....',
  '.SSS.....',
];

/**
 * A speech bubble with its body's top-left at (x, y), `w` x `h`, and a tail
 * from its bottom edge down towards (tx, ty).
 */
export function bubble(
  f: Frame,
  x: number,
  y: number,
  w: number,
  h: number,
  tx: number,
  ty: number,
  fill: RGB,
  ink: RGB
) {
  x = Math.round(x);
  y = Math.round(y);
  // the tail: a little wedge from the bottom edge towards the speaker
  const bx = Math.max(x + 3, Math.min(x + w - 4, Math.round(tx)));
  const by = y + h;
  const steps = Math.max(1, Math.round(ty) - by);
  for (let k = 0; k <= steps; k++) {
    const px = Math.round(bx + ((tx - bx) * k) / steps);
    const half = Math.max(0, 1 - Math.floor((k * 2) / steps));
    for (let d = -half - 1; d <= half + 1; d++)
      f.set(px + d, by + k - 1, Math.abs(d) > half ? ink : fill);
  }
  // the body, its corners rounded off
  f.rect(x + 1, y, w - 2, h, fill);
  f.rect(x, y + 1, w, h - 2, fill);
  f.hline(x + 2, x + w - 3, y - 1, ink);
  f.hline(x + 2, x + w - 3, y + h, ink);
  f.vline(x - 1, y + 2, y + h - 3, ink);
  f.vline(x + w, y + 2, y + h - 3, ink);
  f.set(x, y, ink);
  f.set(x + w - 1, y, ink);
  f.set(x, y + h - 1, ink);
  f.set(x + w - 1, y + h - 1, ink);
  f.set(x + 1, y, fill);
  // the tail joins the body without an outline across it
  for (let d = -1; d <= 1; d++) f.set(bx + d, y + h, fill);
}

/**
 * A heart `size` px wide centred on (cx, cy): an outline, the fill and a
 * highlight on its upper left lobe. `a` dithers it out.
 */
export function heart(
  f: Frame,
  cx: number,
  cy: number,
  size: number,
  fill: RGB,
  hi: RGB,
  edge: RGB,
  a = 1
) {
  const s = size / 2;
  const inside = (dx: number, dy: number) => {
    // the classic heart curve, y up
    const u = dx / s / 1.12;
    const v = -dy / s / 1.12 + 0.18;
    const q = u * u + v * v - 1;
    return q * q * q - u * u * v * v * v <= 0;
  };
  const r = Math.ceil(s) + 1;
  for (let dy = -r; dy <= r; dy++)
    for (let dx = -r; dx <= r; dx++) {
      if (!inside(dx, dy)) continue;
      const rim =
        !inside(dx - 1, dy) ||
        !inside(dx + 1, dy) ||
        !inside(dx, dy - 1) ||
        !inside(dx, dy + 1);
      const c = rim
        ? edge
        : dx < -s * 0.2 && dy < -s * 0.15 && dx + dy > -s * 1.05
          ? hi
          : fill;
      const x = Math.round(cx + dx);
      const y = Math.round(cy + dy);
      if (a >= 1) f.set(x, y, c);
      else f.dset(x, y, c, a);
    }
}
