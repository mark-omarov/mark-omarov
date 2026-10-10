// Small standing figures in the Bali scene's style: no faces, told apart by
// hair, build and clothes. Each figure is built from a few numbers, so every
// pose works for everyone.

import { type Frame, type RGB } from '../frame';

export type Figure = {
  hair: RGB;
  hairLit: RGB;
  skin: RGB;
  skinSh: RGB;
  top: RGB;
  topSh: RGB;
  /** The light catching the left edge of the top (dark tops need it). */
  topLit?: RGB;
  low: RGB;
  lowSh: RGB;
  shoe: RGB;
  /** Rows of torso, of the lower garment, and of bare leg under it. */
  torso: number;
  lower: number;
  legs: number;
  lowKind: 'shorts' | 'trousers' | 'dress' | 'skirt';
  /** short; shaggy (a fringe, and volume at the sides); long (straight, past
   * the shoulders); wavy (to the shoulders, with volume) */
  hairStyle: 'short' | 'shaggy' | 'long' | 'wavy';
  /** A short beard along the jaw. */
  beard?: RGB;
  /** Sunglasses pushed up on the head. */
  sunnies?: RGB;
  /** A print on the front of the tee. */
  print?: RGB;
};

/**
 * Front poses: stand, hug (arms out round the neighbours), up (arms up in a
 * V), lift (both arms straight up, holding someone), wave0/wave1 (one arm
 * up), head (a hand on the back of the head), carry (an arm across, holding
 * a child on the hip), akimbo (a hand on the hip). Side poses (facing `dir`): walk0 (striding),
 * walk1 (passing), side (standing), bow.
 */
export type Pose =
  | 'stand'
  | 'hug'
  | 'up'
  | 'lift'
  | 'wave0'
  | 'wave1'
  | 'head'
  | 'carry'
  | 'akimbo'
  | 'walk0'
  | 'walk1'
  | 'side'
  | 'bow';

const SIDE = new Set<Pose>(['walk0', 'walk1', 'side', 'bow']);

/** How tall a figure stands, crown to soles. */
export const heightOf = (k: Figure) => 3 + k.torso + k.lower + k.legs + 1;

type Cell = [number, number, RGB];

/**
 * The figure's pixels: x from its body's left column (the body is 3 wide),
 * y from the top of its head (0), facing right when side-on.
 */
function cells(k: Figure, pose: Pose): Cell[] {
  const out: Cell[] = [];
  const put = (x: number, y: number, c: RGB) => out.push([x, y, c]);
  const side = SIDE.has(pose);
  const bow = pose === 'bow' ? 1 : 0;
  const T0 = 3;
  const L0 = T0 + k.torso;
  const G0 = L0 + k.lower;
  const F = G0 + k.legs;
  const lit = k.topLit ?? k.top;

  // ---- head ----
  const hx = side ? bow : 0; // bowing: the head comes forward and down
  const hy = bow;
  const hair = (x: number, y: number) => put(x + hx, y + hy, k.hair);
  hair(0, 0);
  hair(1, 0);
  hair(2, 0);
  put(0 + hx, hy, k.hairLit);
  if (k.sunnies) {
    put(1 + hx, hy, k.sunnies);
    put(2 + hx, hy, k.sunnies);
  }
  if (!side) {
    const face = (y: number) => {
      put(0, y, k.skin);
      put(1, y, k.skin);
      put(2, y, k.skinSh);
    };
    face(1);
    face(2);
    if (k.beard) {
      put(0, 2, k.beard);
      put(2, 2, k.beard);
    }
    if (k.hairStyle === 'long') {
      // framing the face and falling over the shoulders
      put(0, 1, k.hairLit);
      put(2, 1, k.hair);
      put(0, 2, k.hair);
      put(2, 2, k.hair);
      put(-1, 2, k.hair);
      put(3, 2, k.hair);
    }
    if (k.hairStyle === 'wavy') {
      // full at the sides, down to the shoulders, the face left clear
      put(-1, 0, k.hair);
      put(3, 0, k.hair);
      put(-1, 1, k.hairLit);
      put(3, 1, k.hair);
      put(-1, 2, k.hair);
      put(3, 2, k.hair);
    }
    if (k.hairStyle === 'shaggy') {
      // a fringe over the eyes, and hair over the ears
      put(0, 1, k.hair);
      put(1, 1, k.hairLit);
      put(-1, 0, k.hair);
      put(3, 0, k.hair);
      put(-1, 1, k.hair);
      put(3, 1, k.hair);
      put(1, -1, k.hair);
    }
  } else {
    put(hx, 1 + hy, k.hair);
    put(1 + hx, 1 + hy, k.hairStyle === 'shaggy' ? k.hair : k.skin);
    put(2 + hx, 1 + hy, k.skin);
    put(hx, 2 + hy, k.hairStyle === 'short' ? k.skinSh : k.hair);
    put(1 + hx, 2 + hy, k.beard ?? k.skin);
    put(2 + hx, 2 + hy, k.beard ?? k.skin);
    if (k.hairStyle === 'long')
      for (let y = 1; y <= 4; y++) put(-1 + hx, y + hy, k.hair);
    if (k.hairStyle === 'wavy' || k.hairStyle === 'shaggy')
      for (let y = 0; y <= (k.hairStyle === 'wavy' ? 2 : 1); y++)
        put(-1 + hx, y + hy, k.hair);
  }

  // ---- torso ----
  for (let y = T0; y < L0; y++) {
    put(0, y, y === T0 ? lit : k.top);
    put(1, y, k.top);
    put(2, y, k.topSh);
  }
  put(0, T0, lit);
  if (k.print && k.torso >= 3) {
    put(1, T0 + 1, k.print);
    put(0, T0 + 2, k.print);
  }
  if (k.hairStyle === 'long' && !side) {
    put(0, T0, k.hair);
    put(2, T0, k.hair);
  }
  if (k.hairStyle === 'long' && side) put(0, T0, k.hair);

  // ---- arms ----
  const arm = (pts: [number, number][]) =>
    pts.forEach(([x, y], i) => put(x, y, i === 0 ? k.top : k.skin));
  const armDown = (s: -1 | 1) =>
    arm([
      [s < 0 ? -1 : 3, T0],
      [s < 0 ? -1 : 3, T0 + 1],
      [s < 0 ? -1 : 3, T0 + 2],
    ]);
  switch (pose) {
    case 'stand':
      armDown(-1);
      armDown(1);
      break;
    case 'hug':
      arm([
        [-1, T0],
        [-2, T0 + 1],
        [-3, T0 + 1],
        [-4, T0 + 1],
      ]);
      arm([
        [3, T0],
        [4, T0 + 1],
        [5, T0 + 1],
        [6, T0 + 1],
      ]);
      break;
    case 'up':
      arm([
        [-1, T0],
        [-1, T0 - 1],
        [-2, T0 - 2],
        [-2, T0 - 3],
      ]);
      arm([
        [3, T0],
        [3, T0 - 1],
        [4, T0 - 2],
        [4, T0 - 3],
      ]);
      break;
    case 'lift':
      arm([
        [-1, T0],
        [-1, T0 - 1],
        [-1, T0 - 2],
        [-1, T0 - 3],
        [-1, T0 - 4],
      ]);
      arm([
        [3, T0],
        [3, T0 - 1],
        [3, T0 - 2],
        [3, T0 - 3],
        [3, T0 - 4],
      ]);
      break;
    case 'wave0':
    case 'wave1':
      armDown(-1);
      arm(
        pose === 'wave0'
          ? [
              [3, T0],
              [4, T0 - 1],
              [4, T0 - 2],
              [4, T0 - 3],
            ]
          : [
              [3, T0],
              [4, T0 - 1],
              [5, T0 - 2],
              [6, T0 - 3],
            ]
      );
      break;
    case 'head':
      armDown(-1);
      arm([
        [3, T0],
        [4, T0 - 1],
        [3, T0 - 2],
      ]);
      break;
    case 'akimbo':
      // a hand on his hip, the elbow out
      armDown(-1);
      arm([
        [3, T0],
        [4, T0 + 1],
        [3, T0 + 2],
      ]);
      break;
    case 'carry':
      armDown(-1);
      arm([
        [3, T0],
        [3, T0 + 1],
        [4, T0 + 2],
      ]);
      break;
    case 'walk0':
      // the near arm swung forward
      arm([
        [1, T0],
        [2, T0 + 1],
        [3, T0 + 2],
      ]);
      break;
    case 'walk1':
      arm([
        [1, T0],
        [0, T0 + 1],
        [-1, T0 + 2],
      ]);
      break;
    case 'side':
      arm([
        [1, T0],
        [1, T0 + 1],
        [1, T0 + 2],
      ]);
      break;
    case 'bow':
      // hands together in front
      arm([
        [2, T0],
        [3, T0 + 1],
        [3, T0 + 2],
      ]);
      break;
  }

  // ---- lower garment and legs ----
  const stride = pose === 'walk0';
  const flare = k.lowKind === 'dress' || k.lowKind === 'skirt';
  for (let y = L0; y < G0; y++) {
    const last = y === G0 - 1;
    const r = y - L0;
    if (k.lowKind === 'trousers' && r > 0) {
      // two legs, scissoring when side-on
      const legX = side
        ? stride
          ? [Math.max(0, 1 - r), Math.min(2, 1 + r)]
          : [1]
        : [0, 2];
      for (const x of legX) put(x, y, x === 2 ? k.lowSh : k.low);
      continue;
    }
    for (let x = 0; x <= 2; x++) put(x, y, x === 2 ? k.lowSh : k.low);
    if (flare && last && k.lower >= 3) {
      put(-1, y, k.low);
      put(3, y, k.lowSh);
    }
    if (k.lowKind === 'shorts' && last && !side) put(1, y, k.skinSh);
  }
  // legs: apart when striding, together when passing, side by side from the front
  const legX: number[] = side ? (stride ? [0, 2] : [1]) : [0, 2];
  for (let y = G0; y < F; y++)
    for (const x of legX)
      put(x + (stride && y > G0 ? (x ? 1 : -1) : 0), y, k.skinSh);
  const feetX: number[] = side
    ? stride
      ? k.legs > 1
        ? [-1, 3]
        : [0, 2]
      : [1, 2]
    : [0, 2];
  for (const x of feetX) put(x, F, k.shoe);
  return out;
}

/**
 * Draws a figure with its body's left column at `x` and soles on `feet`,
 * facing `dir` (1 right, -1 left) when side-on. `tint` recolours (for
 * reflections), `flipY` stands it upside down under `feet` (the mirror).
 */
export function drawFigure(
  f: Frame,
  k: Figure,
  pose: Pose,
  x: number,
  feet: number,
  dir: 1 | -1 = 1,
  tint?: (c: RGB) => RGB,
  flipY = false
) {
  const top = feet - heightOf(k) + 1;
  for (const [dx, dy, c] of cells(k, pose)) {
    const px = Math.round(x) + (dir < 0 ? 2 - dx : dx);
    const py = flipY ? feet + 1 + (feet - (top + dy)) : top + dy;
    f.set(px, py, tint ? tint(c) : c);
  }
}

/** Where a figure's crown is, given its soles. */
export const crownOf = (k: Figure, feet: number) => feet - heightOf(k) + 1;

/**
 * A small child, little enough to carry: on the hip (side), held up high
 * with her arms up (up), or sitting on someone's shoulders (ride). 4 wide.
 */
export type Little = {
  hair: RGB;
  skin: RGB;
  skinSh: RGB;
  /** her top, and the skirt under it */
  top: RGB;
  topSh: RGB;
  skirt: RGB;
};

export function drawLittle(
  f: Frame,
  l: Little,
  pose: 'hip' | 'up' | 'ride',
  x: number,
  top: number,
  dir: 1 | -1 = 1,
  tint?: (c: RGB) => RGB,
  mirrorAt?: number
) {
  const rows: Record<typeof pose, string[]> = {
    // h hair, s skin, S skin shade, d top, D top shade, k skirt
    hip: ['.hh.', 'hss.', 'hdd.', '.kk.', '.SS.'],
    up: ['s..s', 'shhs', 'hssh', '.dD.', 'kkkk', '.S.S'],
    ride: ['.hh.', 'hssh', 'sddS', 'S..S'],
  };
  const pal: Record<string, RGB> = {
    h: l.hair,
    s: l.skin,
    S: l.skinSh,
    d: l.top,
    D: l.topSh,
    k: l.skirt,
  };
  const r = rows[pose];
  r.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const c = pal[row[rx]!];
      if (c === undefined) continue;
      const px = Math.round(x) + (dir < 0 ? row.length - 1 - rx : rx);
      const y = top + ry;
      const py = mirrorAt === undefined ? y : 2 * mirrorAt + 1 - y;
      f.set(px, py, tint ? tint(c) : c);
    }
  });
}
