// The park in the Nizhnevartovsk scene: a man (short light-brown hair, a
// short beard, a charcoal parka and an orange scarf), a woman (a cream knit
// hat over long, straight, near-black hair, a camel coat), a lady in red
// (shoulder-length dark wavy hair, a red puffer and jeans) and a lanky teen
// (dark shaggy hair with a fringe, a beanie pushed back, a yellow puffer), all
// wrapped up for a Siberian winter. Walking, they're seen from the side and
// face right (draw them flipped to face left); sitting on the bench, they
// face us. Arms are drawn by the scene on top, so the same body can swing
// its arms, hold them open, hug or link arms. Sprites are strings, one char
// per pixel; the scene supplies the colours.

import { type Frame, type RGB } from '../frame';

export type Sprite = readonly string[];

/** Draws a sprite with its top-left at (x, y). `a` < 1 dithers it in or out. */
export function spr(
  f: Frame,
  rows: Sprite,
  x: number,
  y: number,
  pal: Record<string, RGB>,
  flip = false,
  a = 1
) {
  const w = rows[0]!.length;
  x = Math.round(x);
  y = Math.round(y);
  for (let j = 0; j < rows.length; j++) {
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

// ---------- walking, side on, facing right: 7 wide ----------
// Each body is the top part; the legs are added underneath (LEGS_*), so
// one stride frame serves everyone. Shoulders are on row 6.

/**
 * The man from his hair down to the hem of his parka. 7 x 12.
 * H hair  h hair lit  Y beard  s skin  r scarf  R scarf shade
 * J parka  j parka lit  K parka shade
 */
export const MAN_TOP = [
  '...hHh.',
  '..hHHHh',
  '..HHsss',
  '..HYsss',
  '...YYY.',
  '..rrrrr',
  '.RrJJJj',
  'Rr.JJJj',
  '..KJJJj',
  '..KJJJj',
  '..KJJJj',
  '..KKJJj',
];

/**
 * The woman: a cream knit hat with a pom-pom, long straight near-black hair
 * down her back, a camel coat to the knee. 7 x 11.
 * p pom-pom  C hat  c hat shade  H hair  h hair sheen  s skin
 * D coat  d coat shade  w coat lit
 */
export const WOMAN_TOP = [
  '....p..',
  '...CCC.',
  '..cCCCC',
  '..HHsss',
  '..HhHss',
  '..HHss.',
  '..HdDDw',
  '..HdDDw',
  '..HdDDw',
  '..HdDDw',
  '..dDDDw',
];

/**
 * The lady: shoulder-length dark wavy hair, a red puffer jacket, jeans.
 * 7 x 11.
 * H hair  h hair lit  s skin  M jacket  m jacket shade  n jacket lit
 * q quilting
 */
export const LADY_TOP = [
  '...HHh.',
  '..HhHHH',
  '.HHHsss',
  '.HhHsss',
  'HHHHss.',
  '.HhHMMn',
  '..mMMMn',
  '..qqqqq',
  '..mMMMn',
  '..mMMMn',
  '..qqqqq',
];

/**
 * The teen: all legs, a skinny body, dark shaggy hair with a fringe and a
 * beanie shoved to the back of his head. 7 x 11; his legs are the long ones.
 * k beanie  H hair  s skin  Y puffer  y puffer lit  q quilting
 */
export const TEEN_TOP = [
  '.kkk...',
  'kkHHHH.',
  '.HHHHHH',
  '..HHHHs',
  '..HHsss',
  '...Hss.',
  '...YYYy',
  '...YYYy',
  '...qqqq',
  '...YYYy',
  '...YYYy',
];

/** Legs mid-stride and legs passing, 7 x 4. B trousers  b lit  e boots */
export const LEGS_STRIDE = ['...BBb.', '..BB.b.', '.BB...b', 'ee....e'];
export const LEGS_PASS = ['...BBb.', '...BBb.', '...Bb..', '..eee..'];
/** Standing still, feet together. */
export const LEGS_STAND = ['...BBb.', '...B.b.', '...B.b.', '..ee.ee'];
/** The same, a row longer, for the lanky teen. 7 x 5. */
export const LONG_STRIDE = [
  '...BBb.',
  '...BBb.',
  '..BB.b.',
  '.BB...b',
  'ee....e',
];
export const LONG_PASS = [
  '...BBb.',
  '...BBb.',
  '...BBb.',
  '...Bb..',
  '..eee..',
];
export const LONG_STAND = [
  '...BBb.',
  '...B.b.',
  '...B.b.',
  '...B.b.',
  '..ee.ee',
];

// ---------- sitting on the bench, facing us: 5 wide ----------
// Shoulders on row 5; the lap on row 8 sits on the seat.

/** The man sitting, from the front, his beard round his jaw. 5 x 12. */
export const MAN_SIT = [
  '.hHh.',
  'HHHHH',
  'HsssH',
  'YsssY',
  '.YYY.',
  'rrrrr',
  'JRJJK',
  'JJJJK',
  'BBBbb',
  '.B.b.',
  '.B.b.',
  'ee.ee',
];

/** The woman sitting, her long hair down over her shoulders. 5 x 12. */
export const WOMAN_SIT = [
  '..p..',
  '.CCC.',
  'cCCCC',
  'HsssH',
  'HsssH',
  'HDDDH',
  'HDDDH',
  'dDDDw',
  'dDDDw',
  '.B.b.',
  '.B.b.',
  'ee.ee',
];

/** The lady sitting, her wavy hair on her shoulders. 5 x 12. */
export const LADY_SIT = [
  '.HHh.',
  'HhHHH',
  'HsssH',
  'HsssH',
  'hHsHh',
  'HMMMH',
  'mMMMn',
  'qqqqq',
  'BBBbb',
  '.B.b.',
  '.B.b.',
  'ee.ee',
];

/**
 * The teen standing behind the bench, facing us, leaning on its back:
 * the fringe down over his eyes. 5 x 16; the bottom row is his feet.
 */
export const TEEN_FRONT = [
  'kkkk.',
  'kHHHH',
  'HHHHH',
  'HHHHH',
  'HsssH',
  '.sss.',
  'YYYYy',
  'YYYYy',
  'qqqqq',
  'YYYYy',
  'YYYYy',
  '.B.b.',
  '.B.b.',
  '.B.b.',
  '.B.b.',
  'ee.ee',
];

// ---------- park furniture ----------

/**
 * An old park bench, front on: slatted back and seat on cast-iron ends
 * that curl at the feet, snow lying along the top. 23 x 11; the bottom row
 * is the ground.
 * S snow  s snow shade  W slat lit  w slat  k iron  K iron lit
 */
export const BENCH = [
  '.SSSSSSSSSSSSSSSSSSSSS.',
  'KWWWWWWWWWWWWWWWWWWWWWk',
  'Kwwwwwwwwwwwwwwwwwwwwwk',
  'k.....................k',
  'KWWWWWWWWWWWWWWWWWWWWWk',
  'Kwwwwwwwwwwwwwwwwwwwwwk',
  'kSSSSSSSSSSSSSSSSSSSSSk',
  'KWWWWWWWWWWWWWWWWWWWWWk',
  '.k...................k.',
  '.k...................k.',
  'kk...................kk',
];

/**
 * The little stop by the track: a post with a bear on a board and a
 * bicycle bell screwed to its side. 8 x 17; the bottom row is the ground.
 * S snow  b board  B board lit  k board edge  u bear  U bear lit
 * p post  P post lit  c bell  C bell lit  l lever
 */
export const BELL_POST = [
  '.SSSSSS.',
  'kBBBBBBk',
  'kBuBBuBk',
  'kBuuuuBk',
  'kBuUuuBk',
  'kbbuubbk',
  'kkkkkkkk',
  '...Pp...',
  '...Pp...',
  '...PpCC.',
  '...PpcCl',
  '...Pp...',
  '...Pp...',
  '...Pp...',
  '...Pp...',
  '..SPpS..',
  '.SSSSSS.',
];
