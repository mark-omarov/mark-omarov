// A black-and-red naked 250cc sport bike: gloss black with red accents and
// red rim stripes, side view facing right, with its rider.
//
// Two riders are drawn (`opts.who`):
// - 'lead' (default): a matte black full-face helmet with a blue-purple
//   iridium visor, a black face mask, a black hoodie (hood bunched under
//   the helmet, drawstrings, a small orange square logo on the chest), blue
//   jeans, sneakers with white soles and dark gloves.
// - 'friend': a second rider on the same model, a supporting character. A
//   glossy black full-face helmet with a smoked visor and an action camera
//   on the chin, a black textile riding jacket with muted oxblood panels
//   and stripes, dark grey gloves, dark trousers and boots. Give this bike
//   its own palette (FRIEND_BIKE, gunmetal) and `bag: true` for its tail bag.
//
// Scale: 1px ≈ 5cm. 17" wheels are 13px across, wheelbase 28px (1.35m),
// seat ≈ 17px off the ground, helmet top ≈ 35px. The bodywork and riders
// are hand-placed pixels; the wheels, fork and front fender are drawn
// procedurally so the wheels can turn and the fork can stretch in a
// wheelie, where the rest of the sprite is rotated with RotSprite (Scale2x
// three times, then sampled) so it stays crisp instead of going ragged.
//
// Palette keys: `body*` is the painted bodywork (tank, shrouds, tail, side
// covers, fender); `frame*` is everything that stays black on every
// colourway (frame, swingarm, bars, mirrors, headlight housing, fork
// sliders). `hoodie*` / `jeans*` / `shoe*` / `glove*` / `helmet*` /
// `visor*` dress whichever rider is drawn (the friend's jacket uses the
// hoodie keys, its panels `logo` / `logoSh`). `rimLight` is the light
// catching the riders' top and back edges: set it to the scene's key light.
//
// `drawMotorcycle(f, x, ground, t, P?, rider?, opts?)` keeps its original
// signature; `opts` adds `wheelie`, `who` and `bag` (see BikeOptions).
// `bikePoint` with `BIKE_POINTS` tells a scene where the headlight, tail
// light or muffler ended up (wheelie pitch and flip included), for glows,
// beams and reflections.

import { Frame, type RGB } from '../frame';
import { palette } from '../scene';

export const BIKE = palette({
  // wheels
  tire: '#121218',
  tireHi: '#3a3a46',
  rim: '#1b1c23',
  rimRed: '#d62a32',
  disc: '#c3c9d4',
  discSh: '#7f879a',
  caliper: '#e8b648',
  caliperSh: '#a87a26',
  hub: '#9aa1ae',
  // gloss black bodywork: it shows the sky in its highlights
  body: '#121319',
  bodyMid: '#272b38',
  bodyHi: '#4e5a78',
  spec: '#d2ddf2',
  red: '#e0303a',
  redHi: '#ff6a5e',
  redSh: '#931c26',
  // black on every colourway
  frame: '#121319',
  frameMid: '#272b38',
  frameHi: '#4e5a78',
  seat: '#232128',
  seatHi: '#4a4652',
  engine: '#2a2a31',
  engineHi: '#5d5b66',
  engineSh: '#18171c',
  fin: '#85828e',
  chrome: '#eef1f6',
  chromeMid: '#aeb5c3',
  chromeSh: '#6a7182',
  pipe: '#4a3f3e',
  pipeHi: '#8c7466',
  light: '#f6fcff',
  lightSh: '#a9c6e4',
  amber: '#ffae3d',
  tail: '#ff3b30',
  bag: '#1e1e24',
  bagHi: '#45454f',
  // the rider: a black hoodie (warm charcoal, so it reads against the gloss
  // black bike), jeans, sneakers, gloves
  hoodie: '#36333d',
  hoodieHi: '#615b69',
  hoodieSh: '#24212a',
  hoodieDk: '#121015',
  string: '#e9e5dc',
  stringSh: '#a9a49c',
  logo: '#ff8a1e',
  logoSh: '#c25a10',
  jeans: '#3a62a8',
  jeansHi: '#6f95d2',
  jeansSh: '#284a86',
  jeansDk: '#1b305c',
  shoe: '#1d1c22',
  shoeHi: '#4a4852',
  sole: '#f4f2ec',
  soleSh: '#b9b6ae',
  glove: '#1a1a20',
  gloveHi: '#4c4c58',
  // matte black full-face helmet, iridium visor
  helmet: '#1b1c22',
  helmetHi: '#3b3d47',
  helmetSh: '#0e0e13',
  helmetSpec: '#5a5d6a',
  visor: '#3b5ff0',
  visorMid: '#8250e2',
  visorDeep: '#3a1f94',
  visorHi: '#9ff2ff',
  visorPink: '#f07ad6',
  /** Light catching the top and back edges of the rider (set it to the scene's key light). */
  rimLight: '#aab4cc',
});

export type BikePalette = typeof BIKE;

/**
 * The friend's bike: same model, kept quiet so the eye goes to the lead
 * rider first. Gunmetal bodywork with dark slate accents and rim stripes;
 * the kit is a glossy black helmet with a smoked visor, a black jacket with
 * muted oxblood panels, dark grey gloves, dark trousers and boots.
 */
export const FRIEND_BIKE: BikePalette = {
  ...BIKE,
  ...palette({
    rimRed: '#4a5568',
    body: '#3b3f47',
    bodyMid: '#4e535d',
    bodyHi: '#6f7581',
    spec: '#9aa2ae',
    red: '#4a5a6e',
    redHi: '#62738a',
    redSh: '#333f4e',
    hoodie: '#25262c',
    hoodieHi: '#41434c',
    hoodieSh: '#18191d',
    hoodieDk: '#0e0f12',
    logo: '#5e3436',
    logoSh: '#43282a',
    jeans: '#2c2e35',
    jeansHi: '#454852',
    jeansSh: '#202127',
    jeansDk: '#16171b',
    shoe: '#18181c',
    shoeHi: '#34343a',
    sole: '#3e3e44',
    soleSh: '#2a2a2e',
    glove: '#16161a',
    gloveHi: '#7c7e86',
    helmet: '#17181d',
    helmetHi: '#3e424e',
    helmetSh: '#09090c',
    helmetSpec: '#8e95a2',
    visor: '#343a46',
    visorMid: '#46505e',
    visorDeep: '#22262e',
    visorHi: '#8e9aac',
    visorPink: '#4e586a',
  }),
};

export type BikeOptions = {
  /** Spinning too fast to see the spokes: draw them as a blur. */
  blur?: boolean;
  /** Face left instead of right. */
  flip?: boolean;
  /** The rider lifts the near hand off the bar to greet another rider. */
  wave?: boolean;
  /**
   * Front-wheel lift, 0..1 (1 ≈ 14° up, pivoting on the rear axle). The
   * fork tops out as the wheel leaves the ground and the rider tucks
   * forward. Negative values (down to -1) dive the nose onto a compressed
   * fork instead, for braking, landing or a bump. Default 0.
   */
  wheelie?: number;
  /** Which rider sits on it: 'lead' (default) or 'friend'. */
  who?: 'lead' | 'friend';
  /** A small tail bag strapped to the pillion seat (FRIEND_BIKE has one). */
  bag?: boolean;
};

// one character per pixel; '.' is transparent
const KEY: Record<string, keyof BikePalette> = {
  k: 'body',
  m: 'bodyMid',
  h: 'bodyHi',
  s: 'spec',
  r: 'red',
  '+': 'redHi',
  R: 'redSh',
  K: 'frame',
  M: 'frameMid',
  z: 'frameHi',
  y: 'seat',
  Y: 'seatHi',
  e: 'engine',
  E: 'engineHi',
  x: 'engineSh',
  f: 'fin',
  c: 'chrome',
  C: 'chromeMid',
  d: 'chromeSh',
  p: 'pipe',
  P: 'pipeHi',
  L: 'light',
  l: 'lightSh',
  a: 'amber',
  t: 'tail',
  A: 'bag',
  D: 'bagHi',
  j: 'hoodie',
  J: 'hoodieHi',
  q: 'hoodieSh',
  Q: 'hoodieDk',
  w: 'string',
  W: 'stringSh',
  '5': 'logo',
  '8': 'logoSh',
  n: 'jeans',
  N: 'jeansHi',
  o: 'jeansSh',
  O: 'jeansDk',
  b: 'shoe',
  B: 'shoeHi',
  '6': 'sole',
  '7': 'soleSh',
  g: 'glove',
  G: 'gloveHi',
  H: 'helmet',
  '1': 'helmetHi',
  '0': 'helmetSh',
  '2': 'helmetSpec',
  v: 'visor',
  V: 'visorMid',
  u: 'visorDeep',
  i: 'visorHi',
  '3': 'visorPink',
  '4': 'rimLight',
};

// [dy, dx, pixels] from the rear axle
type Run = [number, number, string];

// the muffler is on the far side: it goes behind the rear wheel
const MUFFLER: Run[] = [
  [-8, -1, 'cmmmk'],
  [-7, -1, 'CKKKKKK'],
  [-6, 1, 'KKKKK'],
];

const BODY: Run[] = [
  // mirror on its stalk, the bar down to the top clamp
  [-21, 20, 'zKK'],
  [-20, 20, 'KKM'],
  [-19, 21, 'K'],
  [-18, 21, 'K'],
  [-17, 21, 'K'],
  [-16, 19, 'KKKM'],
  [-15, 22, 'MK'],
  // angular LED headlight under its little visor, indicator on the side
  [-15, 23, 'Kzzm'],
  [-14, 23, 'KKMMz'],
  [-13, 23, 'KKKMLL'],
  [-12, 23, 'KKKMLl'],
  [-11, 24, 'aKMl'],
  [-10, 25, 'KK'],
  // tail: slim and upswept, LED tail light under the tip, split seat
  [-17, -6, 'hhm'],
  [-16, -8, 'thhmmmmk'],
  [-15, -8, 'tkkkkYYYYYYy'],
  [-14, -7, 'kkkkkkkkkkkYYYYYYYyy'],
  [-13, -6, 'kkkkkkkkkkkkyyyyyyy'],
  [-12, -4, 'kk+rrrkkkkkkkkkk'],
  [-11, -2, 'kRRRkkkkkkkkkk'],
  [-10, 1, 'MKKKKKKKKKKM'],
  // tail tidy with the indicator, the plate edge-on
  [-12, -6, 'a'],
  [-11, -5, 'KK'],
  [-10, -6, 'KK'],
  [-9, -7, 'K'],
  [-8, -8, 'C'],
  [-7, -8, 'C'],
  [-6, -8, 'd'],
  // side cover over the shock, red graphic, frame down to the pivot
  [-9, 3, 'mkkkkkkkkx'],
  [-8, 5, 'hkkRrkkx'],
  [-7, 7, 'MKKKKx'],
  [-6, 9, 'MKKx'],
  [-5, 10, 'Kx'],
  // frame and airbox under the tank, throttle body behind the cylinder
  [-12, 12, 'KK'],
  [-11, 12, 'KKK'],
  [-10, 13, 'KKK'],
  [-9, 12, 'xx'],
  [-8, 12, 'xx'],
  [-7, 12, 'xx'],
  [-6, 12, 'x'],
  // tank: tall and muscular, a hard specular along the top
  [-16, 16, 'hssss'],
  [-15, 13, 'hhmmmmmmk'],
  [-14, 12, 'kmmkkkkhhmk'],
  [-13, 11, 'kkkkkhhmkkkm'],
  // the big angular shroud, its top edge catching the light, red flash
  [-12, 14, 'hmkkkkkkkm'],
  [-11, 15, 'kk+rrrrrkm'],
  [-10, 16, 'kRrrrrrkm'],
  [-9, 18, 'kRRRRkm'],
  [-8, 21, 'kkm'],
  // engine: black, silver fin edges on the cylinder, round stator cover
  [-9, 14, 'xEEEx'],
  [-8, 14, 'xffffx'],
  [-7, 14, 'xeeeex'],
  [-6, 13, 'xffffx'],
  [-5, 13, 'xeeeex'],
  [-4, 11, 'xxxeeeeex'],
  [-3, 10, 'xedCCdeeex'],
  [-2, 10, 'xdCccCdeEx'],
  [-1, 10, 'xedCCdeeex'],
  [0, 11, 'xeeeeeeex'],
  [1, 12, 'xxxxxxx'],
  [2, 13, 'MMMMM'],
  // header pipe curling down the front of the engine
  [-7, 20, 'p'],
  [-6, 20, 'P'],
  [-5, 21, 'P'],
  [-4, 21, 'p'],
  [-3, 21, 'p'],
  [-2, 21, 'p'],
  [-1, 20, 'p'],
  [0, 20, 'p'],
  [1, 19, 'p'],
  [2, 18, 'p'],
  // swingarm, lit along the top, and the chain under it
  [-4, 8, 'zzM'],
  [-3, 4, 'zzzzKK'],
  [-2, 1, 'zzzKKKK'],
  [-1, 1, 'KKKKKx'],
  [-1, 8, 'xx'],
  [0, 8, 'xxx'],
  [1, 5, 'xxx'],
  [2, 2, 'xxx'],
  // footpegs
  [-1, 13, 'CCd'],
  [-5, 4, 'Cd'],
];

// a soft tail bag strapped across the pillion pad
const BAG: Run[] = [
  [-19, -3, 'DDDDA'],
  [-18, -4, 'DAAAAAA'],
  [-17, -4, 'AA55AAA'],
  [-16, -3, 'AAAAA'],
];

/** An ASCII picture as runs: row i is at dy = y0 + i, column j at dx = x0 + j. */
function pic(x0: number, y0: number, rows: string[]): Run[] {
  return rows.map((r, i) => [y0 + i, x0, r] as Run);
}

// The legs: jeans (or the friend's trousers) along the tank, knee into it,
// shin down to the peg, the ball of the foot on it.
// prettier-ignore
const LOWER = [
  '...JqqqqqqQ..........',
  '..4NNNNNNNNNNn.......',
  '..onnnnnnnnnnNNn.....',
  '...oonnnnnnnnnnNn....',
  '......Ooooooonnno....',
  '.............Nnno....',
  '.............Nnno....',
  '............Nnno.....',
  '............Nnno.....',
  '...........NnnO......',
  '...........bBbb......',
  '..........bBb6bbb....',
  '..........6666667....',
];

// The lead rider, leaning about 20° into the bars: matte helmet, black mask
// under the chin bar, hood bunched at the back of the neck, drawstrings and
// the orange logo at the chest, elbow bent, hand on the grip.
// prettier-ignore
const LEAD_BARS = pic(2, -30, [
  '...........4411......',
  '..........411HHH.....',
  '.........41HHHHii....',
  '.........41HHvViV....',
  '........4HHHuVVV3....',
  '.......440HHHHHHH....',
  '......4JJQ00HHH0.....',
  '......JjjQ44JJQQ.....',
  '.....4JjjQJJJJww.....',
  '.....JjjjjQJJj5W.....',
  '.....JjjjjQJJj5......',
  '....4JjjjqjQJJj......',
  '....JjjjqjjQJJJJJj...',
  '....JjjqjjqQjjjjjQgG.',
  '...4Jjjjjjqq.....ggg.',
  '...JJjjjjqq.......g..',
  ...LOWER,
]);
// the near hand up off the bar, greeting a rider coming the other way
// prettier-ignore
const LEAD_WAVE = pic(2, -30, [
  '...........4411......',
  '..........411HHH.....',
  '.........41HHHHiigg..',
  '.........41HHvViVgGg.',
  '........4HHHuVVV3QQ..',
  '.......440HHHHHH4Jq..',
  '......4JJQ00HHH4Jq...',
  '......JjjQ44JJ4Jq....',
  '.....4JjjQqqqqqQ.....',
  '.....Jjjjjj55wW......',
  '.....Jjjjjj55Ww......',
  '....4Jjjjqjjqq.......',
  '....Jjjjqjjjqq.......',
  '....Jjjqjjjqq........',
  '...4Jjjjjjqq.........',
  '...JJjjjjqq..........',
  ...LOWER,
]);
// tucked forward over the tank, for wheelies: head and shoulders down and
// forward, elbow bent more, hand still on the grip
// prettier-ignore
const LEAD_LEAN = pic(2, -29, [
  '.............4411....',
  '............411HHH...',
  '...........41HHHHii..',
  '...........41HHvViV..',
  '..........4HHHuVVV3..',
  '.........440HHHHHHH..',
  '........4JJQ00HHH0...',
  '.......4JjjQ44JJQQ...',
  '......4JjjjQJJJJww...',
  '......JjjjjjQJJj5W...',
  '.....4JjjjqjQJJj5....',
  '....4JjjjqjjjQJJJj...',
  '....JjjqjjjqQjjjjQgG.',
  '...4Jjjjjjqq.....ggg.',
  '...JJjjjjqq.......g..',
  ...LOWER,
]);

// The friend: glossy helmet with its rear spoiler, smoked visor, action
// camera under the chin bar; black textile jacket with red shoulder panels
// and stripes.
// prettier-ignore
const FRIEND_BARS = pic(2, -30, [
  '...........4411......',
  '..........41H2HH.....',
  '.........41HHHHHi....',
  '.........41HHvvVi....',
  '.......HHHHHuvvvH....',
  '........0HHHHHHHH....',
  '.......Qj00HHHHfx....',
  '......JjjQ55JJQQ.....',
  '.....4JjjQ55JJjQ.....',
  '.....Jjj8jQ5Jjjq.....',
  '.....Jjj8jQJJjq......',
  '....4Jj8jqjQJJj......',
  '....Jjj8qjjQJ555Jj...',
  '....Jj8qjjqQjjjjjQgG.',
  '...4Jjjjjjqq.....gGg.',
  '...JJjjjjqq.......g..',
  ...LOWER,
]);
// prettier-ignore
const FRIEND_WAVE = pic(2, -30, [
  '...........4411......',
  '..........41H2HH.....',
  '.........41HHHHHigg..',
  '.........41HHvvVigGg.',
  '.......HHHHHuvvvHQQ..',
  '........0HHHHHHH4Jq..',
  '.......Qj00HHHHf5q...',
  '......JjjQ55JJ45q....',
  '.....4JjjQqqqqqQ.....',
  '.....Jjj8jjjjjqQ.....',
  '.....Jjj8jjjjjq......',
  '....4Jj8jqjjqq.......',
  '....Jjj8qjjjqq.......',
  '....Jj8qjjjqq........',
  '...4Jjjjjjqq.........',
  '...JJjjjjqq..........',
  ...LOWER,
]);
// prettier-ignore
const FRIEND_LEAN = pic(2, -29, [
  '.............4411....',
  '............41H2HH...',
  '...........41HHHHHi..',
  '...........41HHvvVi..',
  '.........HHHHHuvvvH..',
  '..........0HHHHHHHH..',
  '.........Qj00HHHHfx..',
  '.......4JjjQ55JJQQ...',
  '......4JjjjQ55JJjQ...',
  '......Jjj8jjQ5Jjjq...',
  '.....4Jj8jqjQJJjq....',
  '....4Jj8jqjjjQ555j...',
  '....Jj8qjjjqQjjjjQgG.',
  '...4Jjjjjjqq.....gGg.',
  '...JJjjjjqq.......g..',
  ...LOWER,
]);

const POSES = {
  lead: { bars: LEAD_BARS, wave: LEAD_WAVE, lean: LEAD_LEAN },
  friend: { bars: FRIEND_BARS, wave: FRIEND_WAVE, lean: FRIEND_LEAN },
};

type Put = (x: number, y: number, c: RGB) => void;

function runs(put: Put, x: number, y: number, list: Run[], P: BikePalette) {
  for (const [dy, dx, s] of list) {
    for (let i = 0; i < s.length; i++) {
      const k = KEY[s[i]!];
      if (k) put(x + dx + i, y + dy, P[k]);
    }
  }
}

function wheel(
  put: Put,
  cx: number,
  cy: number,
  angle: number,
  front: boolean,
  P: BikePalette,
  blur: boolean
) {
  for (let dy = -7; dy <= 7; dy++) {
    for (let dx = -7; dx <= 7; dx++) {
      const d = Math.hypot(dx, dy);
      let c: RGB | null = null;
      if (d <= 6.5 && d > 4.7)
        c = d > 5.6 && dx + dy < -4 && dx < 1 ? P.tireHi : P.tire;
      else if (d <= 4.7 && d > 4.0)
        c = P.rimRed; // red rim stripe
      else if (d <= 4.0 && d > 3.3) c = P.rim;
      else if (d <= 3.3 && blur && d > 1.5) c = P.frameMid;
      if (c !== null) put(cx + dx, cy + dy, c);
    }
  }
  // brake disc: a big one at the front, a small one at the back
  const discR = front ? 3.2 : 2.3;
  for (let dy = -4; dy <= 4; dy++)
    for (let dx = -4; dx <= 4; dx++) {
      const d = Math.hypot(dx, dy);
      if (d <= discR && d > discR - 0.9)
        put(cx + dx, cy + dy, dx + dy < 0 ? P.disc : P.discSh);
    }
  if (!blur) {
    // five black spokes, turning
    for (let k = 0; k < 5; k++) {
      const a = angle + (k * Math.PI * 2) / 5;
      for (let r = 1.4; r <= 3.7; r += 0.55)
        put(
          Math.round(cx + Math.cos(a) * r),
          Math.round(cy + Math.sin(a) * r),
          P.rim
        );
    }
  }
  put(cx, cy, P.hub);
  if (front) {
    // gold caliper hugging the back of the disc
    put(cx - 3, cy - 2, P.caliper);
    put(cx - 2, cy - 3, P.caliper);
    put(cx - 3, cy - 1, P.caliperSh);
  }
}

// ---------- geometry ----------

const FRONT = 28; // wheelbase, px
const CLAMP: [number, number] = [22, -15]; // top of the fork, from the rear axle
const MAX_LIFT = (14 * Math.PI) / 180;
const MAX_DIVE = (3 * Math.PI) / 180;

/** The fork's unit direction, top clamp to axle, in bike space. */
const FORK = (() => {
  const dx = FRONT - CLAMP[0];
  const dy = -CLAMP[1];
  const l = Math.hypot(dx, dy);
  return [dx / l, dy / l, l] as const;
})();

/** Fork, axle clamp and fender, between the top clamp and the axle (screen space). */
function fork(
  put: Put,
  tx: number,
  ty: number,
  ax: number,
  ay: number,
  ang: number,
  P: BikePalette
) {
  // the near leg: silver stanchion up top, black slider down to the axle
  const len = Math.hypot(ax - tx, ay - ty);
  const n = Math.ceil(len * 2);
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = Math.round(tx + (ax - tx) * u);
    const y = Math.round(ty + (ay - ty) * u);
    const lower = len * (1 - u) < 7.5;
    put(x, y, lower ? P.frame : P.chromeMid);
    put(x + 1, y, lower ? P.frameMid : P.chrome);
  }
  // the fender hugs the tyre, fixed to the slider
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  for (let dy = -9; dy <= 2; dy++)
    for (let dx = -9; dx <= 9; dx++) {
      // into the fork's own frame (undo the pitch)
      const bx = dx * c - dy * s;
      const by = dx * s + dy * c;
      const r = Math.hypot(bx, by);
      const a = Math.atan2(by, bx);
      if (r > 6.9 && r <= 7.9 && a > -2.5 && a < -1.05)
        put(
          Math.round(ax) + dx,
          Math.round(ay) + dy,
          r > 7.4 && a < -1.5 ? P.bodyHi : P.body
        );
    }
  put(Math.round(ax), Math.round(ay), P.hub);
}

// ---------- RotSprite ----------

/** Scale2x (EPX): doubles a sprite, rounding off its staircases. */
function scale2x(src: Uint32Array, w: number, h: number) {
  const out = new Uint32Array(w * h * 4);
  const at = (x: number, y: number) =>
    src[Math.max(0, Math.min(h - 1, y)) * w + Math.max(0, Math.min(w - 1, x))]!;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const p = at(x, y);
      const a = at(x, y - 1);
      const b = at(x + 1, y);
      const c = at(x - 1, y);
      const d = at(x, y + 1);
      const o = y * 2 * (w * 2) + x * 2;
      out[o] = c === a && c !== d && a !== b ? a : p;
      out[o + 1] = a === b && a !== c && b !== d ? b : p;
      out[o + w * 2] = d === c && d !== b && c !== a ? c : p;
      out[o + w * 2 + 1] = b === d && b !== a && d !== c ? d : p;
    }
  return out;
}

// sprite box around the rear axle
const BOX_X = -9;
const BOX_Y = -32;
const BOX_W = 46;
const BOX_H = 38;

type Big = { px: Uint32Array; w: number; h: number };
const bigCache = new WeakMap<BikePalette, Map<string, Big>>();
const rotCache = new WeakMap<BikePalette, Map<string, Frame>>();

function big(P: BikePalette, key: string, list: Run[][]): Big {
  let m = bigCache.get(P);
  if (!m) bigCache.set(P, (m = new Map<string, Big>()));
  const hit = m.get(key);
  if (hit) return hit;
  const f = new Frame(BOX_W, BOX_H);
  for (const l of list) runs((x, y, c) => f.set(x, y, c), -BOX_X, -BOX_Y, l, P);
  let px: Uint32Array = f.pixels;
  let w = BOX_W;
  let h = BOX_H;
  for (let k = 0; k < 3; k++) {
    px = scale2x(px, w, h);
    w *= 2;
    h *= 2;
  }
  const b = { px, w, h };
  m.set(key, b);
  return b;
}

/** The sprite layers `list` pitched by `ang` about the rear axle (cached per half degree). */
function rotated(P: BikePalette, key: string, list: Run[][], ang: number) {
  const step = Math.round((ang * 180) / Math.PI / 0.5);
  let m = rotCache.get(P);
  if (!m) rotCache.set(P, (m = new Map<string, Frame>()));
  const k = `${key}@${step}`;
  const hit = m.get(k);
  if (hit) return hit;
  const a = (step * 0.5 * Math.PI) / 180;
  const src = big(P, key, list);
  const f = new Frame(BOX_W, BOX_H);
  const c = Math.cos(a);
  const s = Math.sin(a);
  // pivot: the centre of the rear axle pixel
  const ox = -BOX_X + 0.5;
  const oy = -BOX_Y + 0.5;
  for (let y = 0; y < BOX_H; y++)
    for (let x = 0; x < BOX_W; x++) {
      const dx = x + 0.5 - ox;
      const dy = y + 0.5 - oy;
      // inverse of the pitch: screen -> bike space
      const sx = ox + dx * c - dy * s;
      const sy = oy + dx * s + dy * c;
      const bx = Math.floor(sx * 8);
      const by = Math.floor(sy * 8);
      if (bx < 0 || by < 0 || bx >= src.w || by >= src.h) continue;
      const p = src.px[by * src.w + bx]!;
      if (p >>> 24) f.pixels[y * BOX_W + x] = p;
    }
  m.set(k, f);
  return f;
}

/**
 * Draws the bike with its tyres on `ground`, wheels at x and x + 28 (x is
 * the rear axle, or the front one when `flip` turns it to face left). `t`
 * turns the wheels (radians = -t / 70). `opts` adds the spoke blur, the
 * flip, the rider's wave and wheelies (see `BikeOptions`).
 */
export function drawMotorcycle(
  f: Frame,
  x: number,
  ground: number,
  t: number,
  P = BIKE,
  rider = true,
  opts: BikeOptions = {}
) {
  const rx = Math.round(x);
  const by = Math.round(ground) - 6; // axle line
  const spin = -t / 70;
  const blur = opts.blur ?? false;
  const put: Put = opts.flip
    ? (px, py, c) => f.set(2 * rx + FRONT - px, py, c)
    : (px, py, c) => f.set(px, py, c);
  const lift = Math.max(-1, Math.min(1, opts.wheelie ?? 0));
  const ang = lift >= 0 ? lift * MAX_LIFT : lift * MAX_DIVE;
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  // bike space (from the rear axle) -> screen, pitched nose-up by ang
  const tx = (bx: number, byy: number) => rx + bx * c + byy * s;
  const ty = (bx: number, byy: number) => by - bx * s + byy * c;
  // the fork tops out once the wheel is off the ground; diving compresses it
  const ext =
    lift >= 0
      ? 1.6 * Math.min(1, lift * 5)
      : (-FRONT * Math.sin(-ang)) / FORK[1];
  const fax = FRONT + FORK[0] * ext;
  const fay = FORK[1] * ext;
  const ax = Math.round(tx(fax, fay));
  const ay = Math.round(ty(fax, fay));
  const ctx = Math.round(tx(CLAMP[0], CLAMP[1]));
  const cty = Math.round(ty(CLAMP[0], CLAMP[1]));

  const lean = rider && lift > 0.25;
  const who = opts.who ?? 'lead';
  const pose = lean ? 'lean' : opts.wave ? 'wave' : 'bars';
  const top: Run[][] = [BODY];
  if (opts.bag) top.push(BAG);
  if (rider) top.push(POSES[who][pose]);
  const key = `${rider ? who + pose : 'none'}${opts.bag ? '+bag' : ''}`;

  if (Math.abs(ang) < 0.004) {
    runs(put, rx, by, MUFFLER, P);
    wheel(put, rx, by, spin, false, P, blur);
    wheel(put, ax, ay, spin + 0.6, true, P, blur);
    fork(put, ctx, cty, ax, ay, 0, P);
    for (const l of top) runs(put, rx, by, l, P);
    return;
  }
  const blit = (spr: Frame) => {
    for (let y = 0; y < BOX_H; y++)
      for (let x2 = 0; x2 < BOX_W; x2++) {
        const p = spr.pixels[y * BOX_W + x2]!;
        if (!(p >>> 24)) continue;
        const sx = rx + BOX_X + x2;
        const sy = by + BOX_Y + y;
        // decode back to RGB for put (keeps flip working)
        put(sx, sy, ((p & 0xff) << 16) | (p & 0xff00) | ((p >>> 16) & 0xff));
      }
  };
  blit(rotated(P, 'M', [MUFFLER], ang));
  wheel(put, rx, by, spin, false, P, blur);
  wheel(put, ax, ay, spin + 0.6, true, P, blur);
  fork(put, ctx, cty, ax, ay, ang, P);
  blit(rotated(P, key, top, ang));
}

/** Handy points on the bike, in bike space (px from the rear axle, y up is negative). */
export const BIKE_POINTS = {
  headlight: [28, -13],
  tailLight: [-8, -16],
  muffler: [-1, -8],
  rearTyre: [0, 6],
  frontTyre: [28, 6],
} as const;

/**
 * Where a bike-space point (see BIKE_POINTS) lands on screen for a bike
 * drawn with the same x, ground and options, following the wheelie pitch
 * and the flip.
 */
export function bikePoint(
  x: number,
  ground: number,
  p: readonly [number, number],
  opts: BikeOptions = {}
): [number, number] {
  const rx = Math.round(x);
  const by = Math.round(ground) - 6;
  const lift = Math.max(-1, Math.min(1, opts.wheelie ?? 0));
  const ang = lift >= 0 ? lift * MAX_LIFT : lift * MAX_DIVE;
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const px = rx + p[0] * c + p[1] * s;
  const py = by - p[0] * s + p[1] * c;
  return [opts.flip ? 2 * rx + FRONT - px : px, py];
}
