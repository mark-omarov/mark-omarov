// Shonan at sunset from the Kamakura-Kokomae crossing: the sun going down
// between Enoshima and Fuji, surfers waiting on the swell off Shichirigahama,
// palms along Route 134, and the green-and-cream Enoden rattling past the
// level crossing while its lights flash and the gates come down.
//
// Click the track for a train, the waves for a surfer to catch one, the sky
// for a kite (they snatch snacks here), the Sea Candle to light it up, the
// beach for the dog, the road for a surfer on a bike.
//
// Two eggs. Click the couple sharing a snack on the sand: a kite comes in
// right over our heads, takes it out of their hands and swings back past us
// showing it off. Click their rolled-up beach mat: it unrolls, the evening
// runs on into a clear night (the Milky Way arching over Enoshima, shooting
// stars), and there they are lying back on it looking up, until the sunset
// comes back.

import { bayer8, type Frame, lerpRGB, type RGB, sprite } from '../frame';
import { Fx, shootingStar } from '../fx';
import { fbm1, fbm2, hash2, noise1 } from '../noise';
import { canopy, glow, gradient } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';

const P = palette({
  sky0: '#221d55',
  sky1: '#33266a',
  sky2: '#4d2f7c',
  sky3: '#733a88',
  sky4: '#a2468a',
  sky5: '#d05a80',
  sky6: '#ef7c6e',
  sky7: '#ffa266',
  sky8: '#ffc978',
  sun: '#fff6d2',
  sunRim: '#ffe49a',
  sunGlow: '#ffc06a',
  sunGlow2: '#ff8a5a',
  cloudLit: '#ffc48a',
  cloudRose: '#ff8c78',
  cloud: '#c8607c',
  cloudSh: '#7a3c78',
  cloudDk: '#5a3070',
  // far land, hazier the farther it is
  izu: '#9c5a86',
  izuLit: '#c4708a',
  fuji: '#6c4682',
  fujiSnow: '#94709e',
  fujiRim: '#e09a96',
  hakone: '#53376f',
  hakoneLit: '#8a4f7c',
  shore: '#372650',
  shoreLit: '#5e3a62',
  townLight: '#ffd27a',
  townLight2: '#ff9a6a',
  // Enoshima
  eno: '#2c2148',
  enoMid: '#382a56',
  enoLit: '#5e3c64',
  enoRim: '#ff9e6a',
  candle: '#241c3c',
  candleLit: '#4a3658',
  beacon: '#fffbe0',
  beam: '#fff2c8',
  mast: '#4a3a62',
  bridge: '#2a2042',
  bridgeLamp: '#ffd890',
  inamura: '#251c3c',
  inamuraMid: '#30244a',
  inamuraLit: '#6a3e60',
  // sea
  sea0: '#ffc88a',
  sea1: '#f2a07c',
  sea2: '#d07888',
  sea3: '#a0608e',
  sea4: '#74508a',
  sea5: '#523f7c',
  sea6: '#3d356c',
  glint: '#fff4cc',
  glint2: '#ffd48a',
  swell: '#2f2a5a',
  swellLit: '#e88a7a',
  foam: '#ffeede',
  foamSh: '#e4aaa4',
  surfer: '#1a1428',
  board: '#f4e6d0',
  boardSh: '#9a6c7a',
  // beach
  wet: '#c27a88',
  wetHi: '#f0a088',
  sand: '#6e4a5c',
  sandLit: '#8c5c62',
  sandSh: '#553a52',
  person: '#1d1628',
  personLit: '#7a4a5a',
  dog: '#2a1e2c',
  snack: '#f4d27a',
  // seawall, road, palms
  wall: '#5c4466',
  wallTop: '#9a7286',
  wallSh: '#40304e',
  road: '#2d2538',
  roadLine: '#b8949a',
  roadEdge: '#4a3c52',
  fence: '#4c3c58',
  car1: '#3a3c5a',
  car2: '#6a2a3a',
  car3: '#cfc6c8',
  car4: '#2a4a5a',
  carGlass: '#1a1626',
  carHi: '#ffb88a',
  headlight: '#fff6d8',
  taillight: '#ff3a3a',
  palm: '#24192f',
  palmMid: '#33233f',
  palmRim: '#e08668',
  // station and track
  platform: '#7a6476',
  platformTop: '#a88c98',
  platformSh: '#56445a',
  tactile: '#f2c230',
  shelter: '#3e3046',
  shelterRoof: '#5a4660',
  shelterRoofHi: '#c48a86',
  signBoard: '#efe6dc',
  signBar: '#2f6a4a',
  ballast: '#3a2e40',
  ballastHi: '#5a4658',
  sleeper: '#2a2030',
  railHi: '#e6b8a8',
  rail: '#8a7486',
  pole: '#2e2438',
  poleLit: '#7a5a6a',
  wire: '#2a2236',
  // Enoden: cream over green
  enoRoof: '#8e8494',
  enoRoofHi: '#c4b8c0',
  cream: '#ead8b4',
  creamSh: '#bfa98e',
  creamHi: '#fff0d0',
  green: '#2e6648',
  greenHi: '#43865e',
  greenSh: '#1f4836',
  enoWin: '#ffdc94',
  enoWinHi: '#fff4cc',
  enoWinDim: '#c49a6a',
  enoDark: '#1c1a28',
  enoPeople: '#5a3e46',
  enoHead: '#fffbe6',
  enoTail: '#ff4038',
  enoSign: '#ffb03a',
  // crossing
  xYellow: '#ffcf2a',
  xBlack: '#16141c',
  xRed: '#ff3324',
  xRedDim: '#5a1c20',
  xRedGlow: '#ff6040',
  xGrey: '#8a8296',
  xGreySh: '#5a5266',
  arrow: '#7affb0',
  // foreground
  hedge: '#1f2a32',
  hedgeMid: '#2b3a3e',
  hedgeLit: '#5a5a4e',
  fgWall: '#3a3040',
  fgWallTop: '#6a5664',
  phone: '#bff0ff',
  kite: '#22182a',
  kiteLit: '#6a4a52',
  kiteDk: '#160f1c',
  kiteRim: '#e8946c',
  kiteLeg: '#d8a848',
  gull: '#f4e4dc',
  // the couple, from behind with the sun in front of them: his short
  // light-brown hair (the sun round its edge), dark hoodie and jeans, her
  // long near-black hair and pale jumper
  mHair: '#6a4e36',
  mHairLit: '#c8965e',
  mHood: '#2c2436',
  hoodie: '#1c1a26',
  hoodieRim: '#c07462',
  jeans: '#2a3060',
  jeansRim: '#6a5684',
  wHair: '#1a1216',
  wHairLit: '#6a3a30',
  jumper: '#7c6064',
  jumperLit: '#eab48e',
  wLegs: '#2a2234',
  snackCrust: '#c88a3a',
  crumb: '#ffd98a',
  feather: '#5a4248',
  featherLit: '#d8b49c',
  // their beach mat, rolled up beside them
  matA: '#3d7a98',
  matALit: '#6ab0c0',
  matB: '#ecd0ae',
  matBSh: '#a88a88',
  matSh: '#2a3e58',
  // the same beach on a clear night
  nsky0: '#02030a',
  nsky1: '#050816',
  nsky2: '#090e24',
  nsky3: '#0e1431',
  nsky4: '#141b3f',
  nsky5: '#1b234d',
  nsky6: '#232b5a',
  nsky7: '#2d3364',
  nskyGlow: '#4a3a6a',
  mw: '#8c90c8',
  mwWarm: '#d0a8b0',
  mwCore: '#f6dcc4',
  star: '#5c6aa8',
  star2: '#a0aae4',
  starHi: '#f2f4ff',
  starWarm: '#ffd9a8',
  nsea0: '#232a58',
  nsea1: '#161b40',
  nsea2: '#0e1230',
  nsea3: '#090b20',
  nFig: '#0a0c1c',
  nSkin: '#9294c4',
  nArm: '#565e98',
});

const HORIZON = 78;
const SHORE = 108; // where the sea meets the wet sand
const WALL = 120; // top of the seawall
const ROAD = 123; // Route 134
const ROAD_B = 131;
const PLAT = 139; // platform top
const RAIL = 146; // Enoden wheels sit here
const WIRE = 117; // contact wire
const LINEUP = 99; // where the surfers wait

const CAR = 54; // one Enoden car
const CARS = 4;
const TRAIN_SPEED = 0.11; // px per ms
const TRAIN_EVERY = 14_000;

type CloudTones = { hi: RGB; light: RGB; base: RGB; shadow: RGB };

/** Draws a horizontally tiling layer scrolled by `offset`, only over rows [y0, y1). */
function scrollRows(
  f: Frame,
  src: Frame,
  offset: number,
  y0: number,
  y1: number
) {
  const sw = src.w;
  const o = ((Math.round(offset) % sw) + sw) % sw;
  for (let y = Math.max(0, y0); y < Math.min(f.h, y1); y++) {
    const row = y * sw;
    const out = y * f.w;
    let sx = o;
    for (let x = 0; x < f.w; x++) {
      const p = src.pixels[row + sx]!;
      if (p >>> 24) f.pixels[out + x] = p;
      if (++sx === sw) sx = 0;
    }
  }
}

/** Frame.over for a same-sized layer, only over rows [y0, y1). */
function overRows(f: Frame, src: Frame, y0: number, y1: number) {
  const d = f.pixels;
  const s = src.pixels;
  for (
    let i = Math.max(0, y0) * f.w, end = Math.min(f.h, y1) * f.w;
    i < end;
    i++
  ) {
    const p = s[i]!;
    if (p >>> 24) d[i] = p;
  }
}

/** Flat-bottomed cloud heaps lit from below and to the right by the low sun. */
function sunsetCloud(
  f: Frame,
  cx: number,
  base: number,
  wd: number,
  ht: number,
  seed: number,
  s: CloudTones
) {
  const n = Math.max(2, Math.round(wd / Math.max(4, Math.min(8, ht))));
  const domes: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const r =
      ht *
      (0.4 + 0.6 * Math.sin(Math.PI * (0.12 + 0.76 * u))) *
      (0.72 + hash2(i, 1, seed) * 0.4);
    domes.push([
      cx - wd / 2 + u * wd + (hash2(i, 2, seed) - 0.5) * 5,
      base - r * 0.5,
      r,
    ]);
  }
  const inside = (x: number, y: number) =>
    y <= base &&
    domes.some(([a, b, r]) => (x - a) ** 2 + (y - b) ** 2 <= r * r);
  for (let y = Math.floor(base - ht * 1.6); y <= base; y++) {
    for (let x = Math.floor(cx - wd / 2 - ht); x <= cx + wd / 2 + ht; x++) {
      if (!inside(x, y)) continue;
      let c = s.base;
      if (!inside(x - 2, y - 2)) c = s.shadow; // tops face away from the sun
      if (!inside(x + 1, y + 2) || y >= base - 1) c = s.light; // undersides glow
      if (y >= base && !inside(x + 2, y + 1)) c = s.hi;
      f.set(((Math.round(x) % f.w) + f.w) % f.w, y, c);
    }
  }
}

/** A Washingtonia palm: tall straight trunk, a skirt of dead fronds, a fan crown. */
function palmTree(
  f: Frame,
  x: number,
  base: number,
  h: number,
  lean: number,
  rimSide: number,
  seed: number
) {
  let tx = x;
  for (let i = 0; i < h; i++) {
    const v = i / h;
    tx = x + lean * v * h * 0.12;
    f.set(tx, base - i, P.palm);
    if (v < 0.35) f.set(tx + 1, base - i, P.palm);
    if (rimSide > 0 && v > 0.2)
      f.set(tx + 1, base - i, i % 4 === 0 ? P.palmMid : P.palmRim);
    if (rimSide < 0 && v > 0.2)
      f.set(tx - 1, base - i, i % 4 === 0 ? P.palmMid : P.palmRim);
  }
  const cx = Math.round(tx);
  const cy = base - h;
  // skirt of hanging dead fronds
  for (let dx = -2; dx <= 2; dx++)
    for (let dy = 1; dy <= 4 - Math.abs(dx); dy++)
      f.set(cx + dx, cy + dy, P.palmMid);
  // fan crown: fronds radiating out and drooping at the tips
  for (let k = 0; k < 13; k++) {
    const a =
      -Math.PI * (-0.08 + (k / 12) * 1.16) + (hash2(k, 1, seed) - 0.5) * 0.2;
    const len = 7 + hash2(k, 2, seed) * 4;
    for (let r = 1; r <= len; r++) {
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r * 0.7 + (r / len) ** 2 * 4;
      const edge =
        rimSide !== 0 && Math.sign(Math.cos(a)) === rimSide && r > len * 0.45;
      f.set(px, py, edge ? P.palmRim : P.palm);
      if (r < len * 0.6) f.set(px, py + 1, P.palm);
    }
  }
  f.disc(cx, cy, 1.5, P.palm);
}

// A black kite (tonbi) as polygons, so it holds up from a speck to a bird
// passing right over the camera: long wings with fingered tips, pale patches
// under the hands, a shallow forked tail. This is the right wing, in units
// of half the wingspan, head up; the left wing mirrors it.
const KITE_WING: readonly [number, number][] = [
  [0.06, -0.08],
  [0.22, -0.13],
  [0.4, -0.16],
  [0.55, -0.16], // the wrist
  [0.7, -0.11],
  [0.84, -0.04],
  [1.0, 0.06], // five long fingers
  [0.86, 0.07],
  [0.98, 0.14],
  [0.84, 0.13],
  [0.93, 0.21],
  [0.8, 0.18],
  [0.86, 0.27],
  [0.74, 0.22],
  [0.76, 0.3],
  [0.64, 0.26],
  [0.45, 0.28],
  [0.25, 0.26],
  [0.08, 0.21],
];
const KITE_PATCH: readonly [number, number][] = [
  [0.6, -0.08],
  [0.73, -0.06],
  [0.79, 0.04],
  [0.75, 0.13],
  [0.64, 0.1],
];

type KitePose = {
  /** Which way the head points: 0 is up the screen, PI/2 to the right. */
  heading: number;
  /** -1..1: the hands down or up. */
  flap: number;
  /** 0..1: wings swept back for a dive. */
  tuck: number;
  /** 0..1: the tail spread wide. */
  fan: number;
  /** 0 none, 1 feet down, 2 feet down with the snack in them. */
  talons: number;
};

function bigKite(
  f: Frame,
  cx: number,
  cy: number,
  span: number,
  pose: KitePose
) {
  const u = span / 2;
  const ca = Math.cos(pose.heading);
  const sa = Math.sin(pose.heading);
  const at = (x: number, y: number): [number, number] => {
    const ax = Math.abs(x);
    const k = Math.max(0, (ax - 0.25) / 0.75);
    let px =
      ax * (1 - 0.36 * pose.tuck * ax) * (1 - 0.22 * Math.abs(pose.flap) * k);
    const py = y + pose.tuck * 0.5 * ax * ax - pose.flap * 0.5 * k;
    if (x < 0) px = -px;
    return [cx + (px * ca - py * sa) * u, cy + (px * sa + py * ca) * u];
  };
  const side = (pts: readonly [number, number][], s: number) =>
    pts.map(([x, y]) => at(x * s, y));
  // the tail: a shallow fork, squared off when it's spread to brake
  const fw = 0.11 + pose.fan * 0.11;
  const body: [number, number][] = [
    [0, -0.25],
    [0.04, -0.23],
    [0.065, -0.15],
    [0.085, -0.03],
    [0.075, 0.2],
    [0.06, 0.27],
    [fw, 0.58 - pose.fan * 0.05],
    [fw * 0.45, 0.56 - pose.fan * 0.03],
    [0, 0.52 + pose.fan * 0.01],
  ];
  const bodyPts = [
    ...body.map(([x, y]) => at(x, y)),
    ...body
      .slice(1, -1)
      .reverse()
      .map(([x, y]) => at(-x, y)),
  ];
  for (const s of [1, -1]) f.poly(side(KITE_WING, s), P.kite);
  if (span >= 26)
    for (const s of [1, -1]) f.poly(side(KITE_PATCH, s), P.kiteLit);
  f.poly(bodyPts, span >= 40 ? P.kite : P.kiteDk);
  if (span >= 16) {
    // the low sun showing through the trailing edge of the feathers
    for (const s of [1, -1]) {
      const pts = side(KITE_WING, s);
      for (let i = 6; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i]!;
        const [x1, y1] = pts[i + 1]!;
        f.line(x0, y0, x1, y1, i < 15 && i % 2 === 0 ? P.kiteRim : P.kiteLit);
      }
    }
  }
  if (pose.talons) {
    // yellow legs, feet forward, and (once it has it) the snack
    for (const s of [1, -1]) {
      const [x0, y0] = at(0.035 * s, 0.1);
      const [x1, y1] = at(0.06 * s, 0.34);
      f.line(x0, y0, x1, y1, P.kiteLeg);
    }
    if (pose.talons === 2) {
      const [sx, sy] = at(0, 0.38);
      const r = Math.max(1, span * 0.045);
      f.disc(sx, sy, r, (dx, dy) =>
        dx + dy > r * 0.5 ? P.snackCrust : P.snack
      );
    }
  }
}

/**
 * The couple sitting on the sand, him on the left, seen from behind, looking
 * out at the sun. 12 x 7; arms are drawn on top so they can wave.
 * H his hair  I his hair lit  K hood  J hoodie  j hoodie rim
 * L jeans  l jeans rim  h her hair  i hair lit  W jumper  w jumper lit
 * B her trousers
 */
const COUPLE = [
  '..II....ih..',
  '.IHHI..ihhh.',
  '.IHHH..ihhi.',
  '..KK...ihhi.',
  '.JJJj..WhhW.',
  '.JJJj..WWWw.',
  '.LLLl..BBBB.',
];
/** Her head on his shoulder. */
const COUPLE_LEAN = [
  '..II...ih...',
  '.IHHI.ihhh..',
  '.IHHH.ihhi..',
  '..KK..ihhi..',
  '.JJJj..WhhW.',
  '.JJJj..WWWw.',
  '.LLLl..BBBB.',
];
const COUPLE_COL: Record<string, RGB> = {
  H: P.mHair,
  I: P.mHairLit,
  K: P.mHood,
  J: P.hoodie,
  j: P.hoodieRim,
  L: P.jeans,
  l: P.jeansRim,
  h: P.wHair,
  i: P.wHairLit,
  W: P.jumper,
  w: P.jumperLit,
  B: P.wLegs,
};

/**
 * The two of them lying back on the mat at night, side on, heads to the
 * right and faces to the sky: him behind, an arm folded under his head, and
 * her in front with her knees up and her hair spread out. 18 x 8.
 * F figure  s face
 */
const STARGAZERS = [
  '.F..........FFss..',
  '.FFFFFFFFFFFFFFFFF',
  '..FFFFFFFFFFFFFFF.',
  '..................',
  '...F........ss....',
  '..F.F......FFFFFF.',
  'FF...FFFFFFFFFFFF.',
  '...........FFFFFF.',
];
const STARGAZER_COL: Record<string, RGB> = {
  F: P.nFig,
  s: P.nSkin,
};

const rgbOf = (p: number): RGB =>
  ((p & 0xff) << 16) | (p & 0xff00) | ((p >>> 16) & 0xff);
const pixOf = (c: RGB) =>
  (0xff000000 | ((c & 0xff) << 16) | (c & 0xff00) | ((c >>> 16) & 0xff)) >>> 0;
/** Blends two packed pixels, `k` out of 256 of the way from a to b. */
function mixPix(a: number, b: number, k: number) {
  const ar = a & 0xff;
  const ag = (a >>> 8) & 0xff;
  const ab = (a >>> 16) & 0xff;
  const r = ar + ((((b & 0xff) - ar) * k) >> 8);
  const g = ag + (((((b >>> 8) & 0xff) - ag) * k) >> 8);
  const bl = ab + (((((b >>> 16) & 0xff) - ab) * k) >> 8);
  return (0xff000000 | (bl << 16) | (g << 8) | r) >>> 0;
}
const smooth = (v: number) => {
  const c = Math.max(0, Math.min(1, v));
  return c * c * (3 - 2 * c);
};

export const kamakura: Scene = {
  id: 'kamakura',
  name: 'Kamakura & Enoshima',
  country: 'Japan',
  create(w, h) {
    const fx = new Fx();
    const fxTop = new Fx();
    const enoX = Math.round(w / 2 + Math.max(25, Math.min(120, w * 0.2)));
    const fujiX = Math.round(
      Math.min(w - 18, enoX + Math.max(40, Math.min(140, w * 0.22)))
    );
    const sunX = Math.round((enoX + fujiX) / 2) - 4;
    const sunY = HORIZON - 9;
    const xingX = Math.round(w * 0.36); // the level crossing
    const platX0 = xingX + 16;
    const platX1 = Math.min(w + 20, platX0 + 96);
    const capeW = Math.round(Math.max(22, Math.min(80, w * 0.13)));
    const enoW = Math.round(Math.max(48, Math.min(80, w * 0.17)));
    const coupleX = Math.round(capeW + (w - capeW) * 0.28);
    // their mat, rolled up on the sand to their right
    const matX = coupleX + 20;
    const fujiH = w < 300 ? 20 : 27;
    let candle = { x: 0, y: 0 };

    const sky = layer(w, h, (f) => {
      gradient(f, 0, HORIZON + 1, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
        P.sky7,
        P.sky8,
      ]);
      glow(f, sunX, sunY, Math.min(130, w * 0.36), P.sunGlow2, 0.45, 0.5, 0.12);
      glow(f, sunX, sunY, 40, P.sunGlow, 0.7, 0.8, 0.15);
      // (the sun itself is drawn each frame, so it can set)
    });
    function drawSun(f: Frame, drop: number) {
      f.disc(sunX, sunY + Math.round(drop), 6.5, (dx, dy) =>
        sunY + drop + dy > HORIZON
          ? null
          : dx * dx + dy * dy > 30
            ? P.sunRim
            : P.sun
      );
    }

    const cloudLayer = layer(w * 2, h, (f) => {
      const tones = {
        hi: P.sunRim,
        light: P.cloudLit,
        base: P.cloud,
        shadow: P.cloudSh,
      };
      const rose = {
        hi: P.cloudLit,
        light: P.cloudRose,
        base: P.cloudSh,
        shadow: P.cloudDk,
      };
      const W = w * 2;
      const n = Math.max(4, Math.round(W / 90));
      for (let i = 0; i < n; i++) {
        const x = (i / n) * W + hash2(i, 1, 5) * 40;
        const y = 16 + hash2(i, 2, 5) * 30;
        const near = y > 34;
        sunsetCloud(
          f,
          x,
          y,
          26 + hash2(i, 3, 5) * 50,
          4 + hash2(i, 4, 5) * 4,
          i,
          near ? tones : rose
        );
      }
      // long, thin streaks low over the horizon, lit gold
      for (let i = 0; i < Math.round(n * 0.35); i++) {
        const x = hash2(i, 5, 5) * W;
        const y = HORIZON - 16 - Math.round(hash2(i, 6, 5) * 10);
        const len = 20 + Math.round(hash2(i, 7, 5) * 50);
        for (let k = 0; k < len; k++) {
          const xx = ((Math.round(x + k) % W) + W) % W | 0;
          f.set(xx, y, k < 3 || k > len - 4 ? P.sky7 : P.cloudLit);
          if (k > 4 && k < len - 6) f.set(xx, y + 1, P.cloudRose);
        }
      }
    });

    const land = layer(w, h, (f) => {
      // the Izu peninsula, hazy under the sun
      for (let x = 0; x < w; x++) {
        const u = (x - (sunX - w * 0.35)) / (w * 0.5);
        if (u < 0 || u > 1.3) continue;
        const ht = Math.round(
          Math.max(0, Math.sin(Math.min(1, u) * Math.PI * 0.9)) * 6 +
            fbm1(x / 9, 3) * 3 -
            1
        );
        for (let y = HORIZON - ht; y < HORIZON; y++)
          f.set(x, y, y === HORIZON - ht ? P.izuLit : P.izu);
      }
      // Fuji: concave slopes, a flat summit, a little snow catching the last light
      const R = fujiH * 2.6;
      for (let x = Math.floor(fujiX - R); x <= fujiX + R; x++) {
        const d = Math.abs(x - fujiX) / R;
        const top = Math.round(
          HORIZON - (d < 0.05 ? fujiH : fujiH * Math.pow((1 - d) / 0.95, 1.7))
        );
        for (let y = top; y < HORIZON; y++) {
          const depth = y - (HORIZON - fujiH);
          let c = P.fuji;
          if (depth < fujiH * 0.32 + Math.sin(x * 1.7) * 1.5) c = P.fujiSnow;
          if (y === top && x < fujiX) c = P.fujiRim;
          f.set(x, y, c);
        }
      }
      // Hakone and Tanzawa in front of Fuji's foot, then the Shonan shore
      for (let x = Math.round(enoX - enoW * 0.3); x < w; x++) {
        const ht = Math.round(
          5 + fbm1(x / 14, 7) * 9 - Math.max(0, (enoX + enoW * 0.2 - x) / 6)
        );
        if (ht <= 0) continue;
        for (let y = HORIZON - ht; y < HORIZON; y++)
          f.set(x, y, y === HORIZON - ht ? P.hakoneLit : P.hakone);
      }
      for (let x = Math.round(enoX); x < w; x++) {
        const ht = 2 + Math.round(fbm1(x / 5, 9) * 2);
        for (let y = HORIZON - ht; y <= HORIZON + 1; y++)
          f.set(x, y, y === HORIZON - ht ? P.shoreLit : P.shore);
        // buildings along the shore with their first lights on
        if (hash2(x, 1, 4) > 0.82) {
          f.vline(x, HORIZON - ht - 2, HORIZON - ht, P.shore);
          if (hash2(x, 2, 4) > 0.5)
            f.set(
              x,
              HORIZON - ht - 1,
              hash2(x, 3, 4) > 0.5 ? P.townLight : P.townLight2
            );
        }
      }
      // Enoshima: low harbour land at its east end, a steep wooded rise, a broad
      // top, and cliffs dropping into the sea at the west end. Backlit, so it
      // is mostly one dark shape with the sun catching its crown.
      const half = enoW / 2;
      const eTop = (x: number) => {
        const u = (x - enoX) / half; // -1..1
        if (u < -1 || u > 1) return HORIZON + 4;
        let ht: number;
        if (u < -0.62)
          ht = 3; // the harbour flats
        else if (u < -0.3) ht = 3 + ((u + 0.62) / 0.32) * 11;
        else if (u < 0.55) ht = 14 + Math.sin(((u + 0.3) / 0.85) * Math.PI) * 4;
        else ht = 14 * Math.pow(Math.max(0, (1 - u) / 0.45), 0.5);
        return Math.round(
          HORIZON + 3 - ht - (u > -0.62 ? (fbm1(x / 4, 2) - 0.5) * 2.5 : 0)
        );
      };
      for (let x = Math.floor(enoX - half); x <= enoX + half; x++) {
        const top = eTop(x);
        for (let y = top; y <= HORIZON + 3; y++) {
          const d = y - top;
          let c = P.eno;
          // a few tree crowns on the slope towards the sun pick up a little light
          if (
            d > 0 &&
            d < 4 &&
            x > enoX - half * 0.3 &&
            hash2(x >> 1, y >> 1, 4) > 0.72
          )
            c = P.enoMid;
          if (d === 0 && x > enoX - half * 0.35) c = P.enoRim;
          else if (d === 1 && x > enoX + half * 0.1 && hash2(x, 1, 5) > 0.4)
            c = P.enoLit;
          f.set(x, y, c);
        }
      }
      // harbour buildings and a forest of masts on the flats
      for (let k = 0; k < 4; k++) {
        const bx = Math.round(enoX - half + 2 + k * 4);
        f.rect(bx, HORIZON - 2 - (k % 2), 3, 3 + (k % 2), P.enoMid);
      }
      const hx0 = Math.round(enoX - half - 12);
      f.hline(hx0, enoX - half, HORIZON + 3, P.eno);
      for (let k = 0; k < 8; k++) {
        const mx = hx0 + 1 + k * 2 + Math.round(hash2(k, 1, 6));
        const mh = 4 + Math.round(hash2(k, 2, 6) * 4);
        f.vline(mx, HORIZON + 2 - mh, HORIZON + 2, P.mast);
      }
      // the Sea Candle: slim stem flaring into the observation deck, lantern on top
      const cx = enoX + Math.round(enoW * 0.06);
      const cy = eTop(cx) + 1;
      candle = { x: cx, y: cy - 14 };
      f.vline(cx, cy - 10, cy, P.candle);
      f.vline(cx + 1, cy - 9, cy, P.candleLit);
      f.hline(cx - 1, cx + 2, cy - 11, P.candle);
      f.hline(cx - 2, cx + 3, cy - 12, P.candle);
      f.hline(cx - 2, cx + 3, cy - 13, P.candleLit);
      f.set(cx, cy - 14, P.candle);
      f.set(cx + 1, cy - 14, P.candle);
      f.set(cx, cy - 15, P.candle);
      // the bridge back to Katase: a long low line on its piers, lamps coming on
      const bx0 = Math.round(enoX + enoW / 2 - 2);
      for (let x = bx0; x < w; x++) {
        f.set(x, HORIZON + 4, P.bridge);
        if ((x - bx0) % 5 === 0) f.set(x, HORIZON + 5, P.bridge);
        if ((x - bx0) % 9 === 4) f.set(x, HORIZON + 3, P.bridgeLamp);
      }
      // Inamuragasaki, the little wooded cape at the end of the beach
      const cTop = (x: number) => {
        const u = x / capeW;
        return Math.round(
          HORIZON +
            14 -
            Math.pow(Math.max(0, 1 - u), 0.6) * 26 -
            (fbm1(x / 4, 11) - 0.5) * 3
        );
      };
      for (let x = 0; x < capeW + 2; x++)
        for (let y = cTop(x); y < SHORE + 2; y++) f.set(x, y, P.inamura);
      canopy(
        f,
        (x, y) => x < capeW && y >= cTop(x) && y < cTop(x) + 6,
        {
          dark: P.inamura,
          mid: P.inamura,
          light: P.inamuraMid,
          hi: P.inamuraMid,
        },
        {
          seed: 3,
          x0: -3,
          x1: capeW + 3,
          y0: HORIZON - 16,
          y1: SHORE,
          size: 2.4,
          step: 3,
        }
      );
      for (let x = 0; x < capeW; x++) {
        const t0 = cTop(x);
        if (hash2(x, 2, 8) > 0.35) f.set(x + 1, t0, P.inamuraLit);
      }
      // its rocky toe, with the sea washing it
      for (let x = capeW - 4; x < capeW + 6; x++)
        f.vline(
          x,
          SHORE - 2 - Math.max(0, capeW + 6 - x) / 3,
          SHORE + 1,
          P.inamuraMid
        );
    });

    // sea: the colour of the sky, with the sun's road running straight at us
    const seaBase = layer(w, h, (f) => {
      gradient(f, HORIZON, SHORE + 3, [
        P.sea0,
        P.sea1,
        P.sea2,
        P.sea3,
        P.sea4,
        P.sea5,
        P.sea6,
      ]);
      f.hline(0, w, HORIZON, P.sky8);
      // the island's dark reflection, broken into ripples
      for (let y = HORIZON + 4; y < HORIZON + 12; y++) {
        const k = y - HORIZON - 4;
        const shrink = k * 0.09;
        for (
          let x = Math.round(enoX - enoW * (0.5 - shrink));
          x < enoX + enoW * (0.5 - shrink);
          x++
        ) {
          if (hash2(x >> 2, y, 12) < 0.3 + k * 0.06) continue;
          f.set(x, y, lerpRGB(P.eno, P.sea1, 0.25 + k * 0.08));
        }
      }
    });

    const backdrop = layer(w, h, (f) => {
      f.over(seaBase);
      f.over(land);
    });

    // ----- the same beach on a clear night (the stars egg) -----
    // The Milky Way arches right over the bay from the cape to Enoshima, its
    // bright core standing just over the island.
    const archIn = 26; // how far below the horizon the arch's centre sits
    const archRy = HORIZON + archIn - 5;
    const archFoot = Math.asin(archIn / archRy);
    const archR = enoX + enoW * 0.08;
    const archL = -w * 0.05;
    const archX = (archR + archL) / 2;
    const archY = HORIZON + archIn;
    const archRx = (archR - archL) / 2 / Math.cos(archFoot);
    const bandW = w < 300 ? 14 : 18;
    const core = {
      x: archX + archRx * Math.cos(archFoot + 0.12),
      y: archY - archRy * Math.sin(archFoot + 0.12),
    };
    const coreR = w < 300 ? 22 : 30;
    const milky = (x: number, y: number) => {
      const ex = (x - archX) / archRx;
      const ey = (archY - y) / archRy;
      const th = Math.atan2(ey, ex);
      const along = (th - archFoot) / (Math.PI - 2 * archFoot);
      const scale =
        (archRx * archRy) /
        Math.hypot(archRx * Math.sin(th), archRy * Math.cos(th));
      const perp =
        (Math.hypot(ex, ey) - 1) * scale + (noise1(along * 5, 51) - 0.5) * 7;
      const hw =
        bandW * (1.2 - 0.5 * along) * (0.6 + noise1(along * 3.5, 54) * 0.75);
      const c = Math.max(
        0,
        1 - Math.hypot(x - core.x, (y - core.y) * 1.25) / coreR
      );
      const inside = 1 - Math.abs(perp) / hw;
      if (inside <= 0 && c <= 0) return { v: 0, along, c };
      // big clumpy star clouds, with dust lanes and dark patches through them
      const n = fbm2(x / 11, y / 11, 52, 3);
      const m = fbm2(x / 5 + 30, y / 5, 55, 2);
      let v =
        inside > 0
          ? 0.3 +
            Math.pow(inside, 0.7) * (0.3 + n * 1.1) +
            Math.max(0, 0.3 - along) * 0.9
          : 0;
      v = Math.max(v, c * c * 2.1 * (0.6 + n * 0.6) + c * 0.3);
      // the Great Rift: a dark lane off-centre, broken up along its length
      const rift = (noise1(along * 6, 53) - 0.5) * hw * 0.9 - hw * 0.15;
      const lane =
        noise1(along * 9, 57) > 0.32 &&
        Math.abs(perp - rift) <
          (0.6 + m * 2.6) * Math.min(1, Math.max(inside, c) * 2.2);
      if (lane) v -= 0.5;
      else if (m < 0.3) v -= 0.2;
      if (inside < 0.15 && c < 0.25) v -= 0.22;
      return { v, along, c };
    };
    const nightSky = layer(w, h, (f) => {
      gradient(f, 0, HORIZON + 1, [
        P.nsky0,
        P.nsky1,
        P.nsky2,
        P.nsky3,
        P.nsky4,
        P.nsky5,
        P.nsky6,
        P.nsky7,
      ]);
      // towns along the coast glow on the horizon either side of the island
      glow(
        f,
        w * 0.97,
        HORIZON,
        Math.max(60, w * 0.22),
        P.nskyGlow,
        0.45,
        0.32,
        0.1
      );
      glow(
        f,
        w * 0.02,
        HORIZON,
        Math.max(40, w * 0.12),
        P.nskyGlow,
        0.3,
        0.35,
        0.1
      );
      for (let y = 0; y < HORIZON; y++)
        for (let x = 0; x < w; x++) {
          const { v, along, c } = milky(x, y);
          if (v < 0.32) continue;
          const tint =
            c > 0.5 && v > 1.1
              ? P.mwCore
              : along < 0.25 || c > 0.2
                ? P.mwWarm
                : P.mw;
          f.blend(
            x,
            y,
            tint,
            v > 1.4
              ? 0.85
              : v > 1.15
                ? 0.64
                : v > 0.9
                  ? 0.46
                  : v > 0.62
                    ? 0.29
                    : 0.13
          );
        }
      // stars: a field everywhere, crowded inside the band
      for (let i = 0; i < Math.round(w * 1.1); i++) {
        const x = Math.floor(hash2(i, 1, 71) * w);
        const y = Math.floor(Math.pow(hash2(i, 2, 71), 1.25) * (HORIZON - 3));
        const r = hash2(i, 3, 71);
        f.set(
          x,
          y,
          r > 0.92
            ? P.starHi
            : r > 0.72
              ? P.star2
              : r > 0.66
                ? P.starWarm
                : P.star
        );
      }
      for (let i = 0; i < w * 8; i++) {
        const x = Math.floor(hash2(i, 4, 72) * w);
        const y = Math.floor(hash2(i, 5, 72) * HORIZON);
        const { v } = milky(x, y);
        if (v < 0.45 || hash2(i, 6, 72) > (v - 0.3) * 0.45) continue;
        const r = hash2(i, 7, 72);
        f.set(x, y, r > 0.88 ? P.starHi : r > 0.5 ? P.star2 : P.mw);
      }
    });
    // the brightest stars, which twinkle and flare
    const bright: { x: number; y: number; ph: number }[] = [];
    for (let i = 0; i < Math.round(w * 1.1); i++)
      if (hash2(i, 3, 71) > 0.965)
        bright.push({
          x: Math.floor(hash2(i, 1, 71) * w),
          y: Math.floor(Math.pow(hash2(i, 2, 71), 1.25) * (HORIZON - 3)),
          ph: hash2(i, 8, 71) * 6.28,
        });
    // the bay goes dark too, with stars caught in it
    const nightSea = layer(w, h, (f) => {
      gradient(f, HORIZON, SHORE + 3, [P.nsea0, P.nsea1, P.nsea2, P.nsea3]);
      f.hline(0, w, HORIZON, P.nsky7);
      for (let y = HORIZON + 4; y < HORIZON + 12; y++) {
        const k = y - HORIZON - 4;
        for (
          let x = Math.round(enoX - enoW * (0.5 - k * 0.09));
          x < enoX + enoW * (0.5 - k * 0.09);
          x++
        )
          if (hash2(x >> 2, y, 12) >= 0.3 + k * 0.06)
            f.set(x, y, lerpRGB(P.nFig, P.nsea1, 0.2 + k * 0.08));
      }
      for (let i = 0; i < w / 5; i++) {
        const x = Math.floor(hash2(i, 1, 73) * w);
        const y =
          HORIZON + 2 + Math.floor(hash2(i, 2, 73) * (SHORE - HORIZON - 4));
        f.set(x, y, hash2(i, 3, 73) > 0.7 ? P.star2 : P.star);
      }
    });
    // what's sky or sea (and so is swapped for the night layers) and what's land
    const SNAP = w * (SHORE + 3);
    const bg = new Uint8Array(SNAP);
    for (let i = 0; i < SNAP; i++) bg[i] = land.pixels[i]! >>> 24 ? 0 : 1;
    const snap = new Uint32Array(SNAP);
    // the lights that stay on after dark: towns, the bridge, the island
    const lamps: { x: number; y: number }[] = [];
    for (let y = HORIZON - 30; y < HORIZON + 6; y++)
      for (let x = 0; x < w; x++) {
        const c = land.get(x, y);
        if (
          land.opaque(x, y) &&
          (c === P.townLight || c === P.townLight2 || c === P.bridgeLamp)
        )
          lamps.push({ x, y });
      }

    // Colour grading for everything else: a stepped fade into starlight
    // blues, keeping lamps, windows and headlights as bright as they are.
    const LEVELS = 10;
    const luts = Array.from(
      { length: LEVELS + 1 },
      () => new Map<number, number>()
    );
    const LIGHTS = new Set(
      [
        P.townLight,
        P.townLight2,
        P.bridgeLamp,
        P.headlight,
        P.taillight,
        P.enoHead,
        P.enoTail,
        P.enoWin,
        P.enoWinHi,
        P.enoSign,
        P.xRed,
        P.arrow,
        P.beacon,
        P.phone,
      ].map(pixOf)
    );
    // edges the sun was lighting go dark with it
    const UNLIT = new Map<RGB, RGB>([
      [P.enoRim, P.eno],
      [P.enoLit, P.enoMid],
      [P.fujiRim, P.fuji],
      [P.izuLit, P.izu],
      [P.hakoneLit, P.hakone],
      [P.shoreLit, P.shore],
      [P.palmRim, P.palmMid],
      [P.inamuraLit, P.inamuraMid],
      [P.hoodieRim, P.hoodie],
      [P.mHairLit, P.mHair],
      [P.jeansRim, P.jeans],
      [P.jumperLit, P.jumper],
      [P.wHairLit, P.wHair],
      [P.kiteRim, P.kite],
      [P.sandLit, P.sand],
      [P.wetHi, P.wet],
      [P.swellLit, P.swell],
      [P.carHi, P.car1],
      // their mat fades to a plain pale shape in the dark
      [P.matA, P.matB],
      [P.matALit, P.matB],
      [P.matSh, P.matBSh],
    ]);
    function nightOf(c: RGB): RGB {
      const r = c >> 16;
      const g = (c >> 8) & 0xff;
      const b = c & 0xff;
      const l = Math.pow((0.3 * r + 0.59 * g + 0.11 * b) / 255, 1.2);
      return (
        (Math.round(9 + r * 0.07 + l * 66) << 16) |
        (Math.round(11 + g * 0.07 + l * 76) << 8) |
        Math.round(28 + b * 0.1 + l * 108)
      );
    }
    function gradedPix(p: number, level: number) {
      const lut = luts[level]!;
      let o = lut.get(p);
      if (o === undefined) {
        if (LIGHTS.has(p)) o = p;
        else {
          const c = rgbOf(p);
          o = pixOf(lerpRGB(c, nightOf(UNLIT.get(c) ?? c), level / LEVELS));
        }
        lut.set(p, o);
      }
      return o;
    }
    /** How far into night the sky is at row y (the top goes first). */
    const skyQ = (n: number, y: number) =>
      smooth(1.5 * n - 0.5 * (y / HORIZON));
    /** ...and the sea and land, which follow the horizon. */
    const groundQ = (n: number) => smooth(1.35 * n - 0.35);
    function nightIn(
      f: Frame,
      src: Frame,
      y0: number,
      y1: number,
      q: (y: number) => number,
      maskBg: boolean
    ) {
      const px = f.pixels;
      const ns = src.pixels;
      for (let y = y0; y < y1; y++) {
        const qy = q(y);
        if (qy <= 0) continue;
        for (let x = 0, i = y * w; x < w; x++, i++) {
          if (maskBg && !bg[i]) continue;
          const s = Math.min(8, Math.floor(qy * 8 + bayer8(x, y)));
          if (s <= 0) continue;
          px[i] = s >= 8 ? ns[i]! : mixPix(px[i]!, ns[i]!, s * 32);
        }
      }
    }
    function grade(f: Frame, level: number) {
      if (level <= 0) return;
      const px = f.pixels;
      const lut = luts[level]!;
      let lastIn = -1;
      let lastOut = 0;
      for (let i = 0; i < px.length; i++) {
        const p = px[i]!;
        // sky and sea already swapped for the night, and not drawn over since
        if (i < SNAP && bg[i] && p === snap[i]) continue;
        if (p !== lastIn) {
          lastIn = p;
          lastOut = lut.get(p) ?? gradedPix(p, level);
        }
        px[i] = lastOut;
      }
    }

    // the shore, seawall, Route 134 and the station, all still
    const front = layer(w, h, (f) => {
      // dry sand, dark on Shichirigahama, with a lit lip where it rises to the wall
      for (let y = SHORE + 3; y < WALL; y++) {
        for (let x = 0; x < w; x++) {
          const d = y - SHORE - 3;
          let c = d < 2 ? P.sandLit : d < 7 ? P.sand : P.sandSh;
          if (d >= 2 && d < 7 && hash2(x >> 2, y, 3) > 0.9) c = P.sandLit;
          f.set(x, y, c);
        }
      }
      // a few boards stood up in the sand against the wall
      const boards = [P.board, P.cloudRose, P.arrow, P.xYellow];
      const racks: number[] = [];
      for (let i = 0; i < Math.max(2, Math.round(w / 140)); i++) {
        let bx = Math.round(capeW + 20 + hash2(i, 1, 17) * (w - capeW - 40));
        // two stands mustn't land on top of each other, or on the couple's mat
        while (
          racks.some((r) => Math.abs(r - bx) < 11) ||
          (bx > coupleX - 16 && bx < matX + 8)
        )
          bx += 11;
        if (bx > w - 10) continue;
        racks.push(bx);
        const c = boards[i % boards.length]!;
        for (let k = 0; k < 3; k++) {
          const x = bx + k * 3;
          const top = WALL - 8 - (k % 2);
          f.vline(x, top + 1, WALL - 1, lerpRGB(c, P.sandSh, 0.45));
          f.vline(x + 1, top, WALL - 1, lerpRGB(c, P.sandSh, 0.25));
          f.set(x + 1, top, lerpRGB(c, P.sun, 0.3));
        }
      }
      // seawall with its steps down to the beach
      f.rect(0, WALL, w, ROAD - WALL, P.wall);
      f.hline(0, w, WALL, P.wallTop);
      f.hline(0, w, ROAD - 1, P.wallSh);
      for (let x = 30; x < w; x += 120)
        for (let k = 0; k < 4; k++)
          f.hline(x + k * 2, x + 8 - k, WALL - 1 - k + 4, P.wallTop);
      // Route 134
      f.rect(0, ROAD, w, ROAD_B - ROAD, P.road);
      for (let x = 0; x < w; x++)
        if (x % 10 < 6) f.set(x, ROAD + 3, P.roadLine);
      f.hline(0, w, ROAD, P.roadEdge);
      // sidewalk and fence on the land side
      f.rect(0, ROAD_B, w, 3, P.wallSh);
      f.hline(0, w, ROAD_B, P.wallTop);
      for (let x = 2; x < w; x += 6) f.vline(x, ROAD_B - 3, ROAD_B, P.fence);
      f.hline(0, w, ROAD_B - 3, P.fence);
    });

    // the station, the track and the near side of the crossing
    const station = layer(w, h, (f) => {
      // the gap behind the platform, down to the track
      f.rect(0, ROAD_B + 3, w, RAIL - ROAD_B - 3, P.ballast);
      // Kamakura-Kokomae: a single platform on the sea side, a shelter and the name board
      f.rect(platX0, PLAT, platX1 - platX0, RAIL - PLAT - 2, P.platform);
      f.hline(platX0, platX1, PLAT, P.platformTop);
      f.hline(platX0, platX1, PLAT + 1, P.tactile);
      f.hline(platX0, platX1, RAIL - 3, P.platformSh);
      const sx = platX0 + 30;
      for (const px of [sx, sx + 26])
        f.vline(px, PLAT - 14, PLAT - 1, P.shelter);
      f.hline(sx - 3, sx + 29, PLAT - 15, P.shelterRoof);
      f.hline(sx - 2, sx + 28, PLAT - 16, P.shelterRoofHi);
      f.hline(sx + 4, sx + 22, PLAT - 5, P.shelter); // bench
      f.rect(platX0 + 8, PLAT - 12, 12, 5, P.signBoard);
      f.hline(platX0 + 8, platX0 + 19, PLAT - 8, P.signBar);
      f.vline(platX0 + 10, PLAT - 7, PLAT - 1, P.shelter);
      f.vline(platX0 + 17, PLAT - 7, PLAT - 1, P.shelter);
      for (let k = 0; k < 3; k++)
        f.hline(platX0 + 10, platX0 + 13 + k * 2, PLAT - 11 + k, P.shelter); // glyph-like marks
      // the crossing: the road runs over the track here
      f.rect(xingX - 7, ROAD_B + 3, 14, RAIL - ROAD_B - 3, P.road);
      // track: ballast, sleepers, rails catching the sunset
      f.rect(0, RAIL, w, h - RAIL, P.ballast);
      for (let x = 0; x < w; x++)
        if (hash2(x, 1, 9) > 0.7)
          f.set(x, RAIL + 1 + Math.round(hash2(x, 2, 9) * 3), P.ballastHi);
      for (let x = 1; x < w; x += 4) f.rect(x, RAIL + 1, 2, 1, P.sleeper);
      f.hline(0, w, RAIL, P.railHi);
      f.hline(0, w, RAIL + 1, P.rail);
      f.rect(xingX - 7, RAIL - 1, 14, h - RAIL + 1, P.road);
      f.hline(xingX - 7, xingX + 6, RAIL, P.railHi);
      // the foreground: a low wall and hedge either side of the road up the hill
      for (let x = 0; x < w; x++) {
        if (Math.abs(x - xingX) < 9) continue;
        const top = h - 3 - Math.round(fbm1(x / 6, 5) * 2);
        for (let y = top; y < h; y++)
          f.set(x, y, y === top ? P.hedgeLit : P.hedge);
      }
    });

    // palms along Route 134, catching the light on the sun side
    const palms = layer(w, h, (f) => {
      for (
        let x = 14 + Math.round(hash2(0, 0, 2) * 20);
        x < w - 4;
        x += 64 + Math.round(hash2(x, 1, 2) * 30)
      ) {
        if (
          Math.abs(x - xingX) < 14 ||
          Math.abs(x - enoX) < enoW / 2 + 8 ||
          Math.abs(x - coupleX - 2) < 14 ||
          Math.abs(x - matX) < 10
        )
          continue;
        palmTree(
          f,
          x,
          WALL + 1,
          30 + Math.round(hash2(x, 2, 2) * 12),
          (hash2(x, 3, 2) - 0.5) * 1.2,
          x < sunX ? 1 : -1,
          x
        );
      }
    });

    // catenary poles on the near side, one wire over the track
    const poleXs: number[] = [];
    for (let x = 8; x < w; x += 72)
      if (Math.abs(x - xingX) > 22) poleXs.push(x);
    const wires = layer(w, h, (f) => {
      for (let x = 0; x < w; x++)
        f.set(
          x,
          WIRE + Math.round(Math.sin(((x - 8) / 72) * Math.PI) ** 2),
          P.wire
        );
      for (const x of poleXs) {
        f.rect(x, WIRE - 3, 2, h - WIRE + 3, P.pole);
        f.set(x - 5, WIRE - 1, P.pole); // the hanger the wire's slung from
        f.vline(x + 1, WIRE, h - 4, P.poleLit);
        f.hline(x - 6, x + 1, WIRE - 2, P.pole);
      }
    });

    // ----- the train and the crossing -----
    let calledAt = -Infinity;
    const trainLen = CARS * (CAR + 1);
    const trainDur = (w + trainLen + 40) / TRAIN_SPEED;
    // trains are timed so that one is at the crossing at t = 6s (the still
    // frame shown with reduced motion), then every TRAIN_EVERY after
    const toCentre = (dir: number) =>
      ((dir === 1 ? xingX : w - xingX) + trainLen / 2 + 20) / TRAIN_SPEED;
    function trainAt(t: number) {
      const k = Math.floor((t - 6000 + TRAIN_EVERY / 2) / TRAIN_EVERY);
      let dir = ((k % 2) + 2) % 2 ? -1 : 1;
      let start = 6000 + k * TRAIN_EVERY - toCentre(dir);
      if (t - calledAt < trainDur + 2600) {
        start = calledAt + 2600; // the crossing rings first
        dir = -1;
      } else if (
        start - 3000 < calledAt + 2600 + trainDur &&
        start + trainDur > calledAt
      )
        // one due while a called train was out never comes, rather than
        // turning up halfway along the line the moment that one's gone
        return null;
      const p = t - start;
      if (p < -3000 || p > trainDur) return null;
      const lead = -trainLen - 20 + p * TRAIN_SPEED; // left end, going right
      const x = dir === 1 ? lead : w - lead - trainLen;
      return { x, dir, p };
    }

    function crossingState(t: number) {
      const tr = trainAt(t);
      if (!tr) return { ringing: false, gate: 0, dir: 0 };
      // ring while any part of the train is near the crossing
      // ring from a few seconds before the train shows up until its tail has cleared
      const near = tr.x < xingX + 40 && tr.x + trainLen > xingX - 40;
      const coming =
        tr.dir === 1 ? tr.x + trainLen < xingX + 40 : tr.x > xingX - 40;
      const gap = tr.dir === 1 ? xingX - (tr.x + trainLen) : tr.x - xingX;
      const ringing =
        near || (coming && gap < (tr.dir === 1 ? xingX : w - xingX) + 320);
      return { ringing, gate: ringing ? 1 : 0, dir: tr.dir };
    }

    // gates swing down over ~0.8s, and up again after the train
    let gateFrom = 0;
    let gateTo = 0;
    let gateAt = -Infinity;
    function gateAngle(t: number, want: number) {
      if (want !== gateTo) {
        gateFrom = gateValue(t);
        gateTo = want;
        gateAt = t;
      }
      return gateValue(t);
    }
    function gateValue(t: number) {
      const p = Math.max(0, Math.min(1, (t - gateAt) / 900));
      const e = p * p * (3 - 2 * p);
      return gateFrom + (gateTo - gateFrom) * e;
    }

    function drawTrain(f: Frame, x0: number, dir: number, t: number) {
      const top = RAIL - 20;
      for (let c = 0; c < CARS; c++) {
        const x = Math.round(x0 + c * (CAR + 1));
        if (x > w || x + CAR < 0) continue;
        const front = dir === 1 ? c === CARS - 1 : c === 0;
        const back = dir === 1 ? c === 0 : c === CARS - 1;
        const leftEnd = c === 0;
        const rightEnd = c === CARS - 1;
        for (let dx = 0; dx < CAR; dx++) {
          // rounded cab ends, square where the cars couple
          const inset =
            (leftEnd && dx < 3 ? 3 - dx : 0) +
            (rightEnd && dx > CAR - 4 ? dx - (CAR - 4) : 0);
          const xx = x + dx;
          for (let y = top + Math.min(3, inset); y < RAIL - 2; y++) {
            const r = y - top;
            let col: RGB;
            if (r <= 1) col = r === 0 ? P.enoRoofHi : P.enoRoof;
            else if (r <= 10) col = P.cream;
            else if (r === 11) col = P.greenHi;
            else col = P.green;
            if (r === 2) col = P.creamHi;
            if (r === RAIL - 3 - top) col = P.greenSh;
            f.set(xx, y, col);
          }
        }
        // windows with people inside, doors at the quarter points; the
        // windows past the middle step back a pixel so each car (and its
        // two cab ends) mirrors about its centre
        for (let k = 0; k < 6; k++) {
          const wx = x + 5 + k * 8 - (k > 2 && k !== 4 ? 1 : 0);
          if (k === 1 || k === 4) {
            f.rect(wx - 1, top + 4, 6, RAIL - 3 - top - 4, P.creamSh);
            f.rect(wx, top + 5, 2, 5, P.enoWin);
            f.rect(wx + 2, top + 5, 2, 5, P.enoWin);
            f.vline(wx + 2, top + 4, RAIL - 4, P.enoDark);
            continue;
          }
          f.rect(wx, top + 4, 5, 5, P.enoWin);
          f.hline(wx, wx + 4, top + 4, P.enoWinHi);
          if (hash2(c, k, 61) > 0.35)
            f.rect(
              wx + 1 + Math.floor(hash2(c, k, 62) * 3),
              top + 6,
              2,
              3,
              P.enoPeople
            );
        }
        // cab windows, lights and the destination sign
        if (leftEnd || rightEnd) {
          const ex = leftEnd ? x + 1 : x + CAR - 4;
          f.rect(ex, top + 4, 3, 5, P.enoDark);
          f.rect(ex, top + 2, 3, 1, P.enoSign);
          const lightX = leftEnd ? x : x + CAR - 1;
          const lit =
            (front && leftEnd && dir === -1) ||
            (front && rightEnd && dir === 1);
          const tail =
            (back && leftEnd && dir === 1) || (back && rightEnd && dir === -1);
          f.set(
            lightX,
            top + 13,
            lit ? P.enoHead : tail ? P.enoTail : P.greenSh
          );
          f.set(
            lightX,
            top + 14,
            lit ? P.enoHead : tail ? P.enoTail : P.greenSh
          );
        }
        // bogies
        for (const bx of [x + 6, x + CAR - 15]) {
          f.rect(bx, RAIL - 3, 9, 2, P.enoDark);
          f.set(bx + 1, RAIL - 1, P.enoDark);
          f.set(bx + 7, RAIL - 1, P.enoDark);
          const spin = Math.floor(t / 60) % 2;
          f.set(bx + 1 + spin, RAIL - 2, P.rail);
          f.set(bx + 6 + spin, RAIL - 2, P.rail);
        }
        // pantograph on the inner cars, pressed up against the wire
        if (c === 1 || c === 2) {
          const px = x + (c === 1 ? CAR - 13 : 12);
          f.rect(px - 3, top - 1, 7, 1, P.enoDark);
          f.line(px - 2, top - 2, px + 1, WIRE + 4, P.enoDark);
          f.line(px + 1, WIRE + 4, px - 1, WIRE + 1, P.enoDark);
          f.hline(px - 3, px + 2, WIRE + 1, P.enoDark);
          if (hash2(c, Math.floor(t / 80), 63) > 0.94)
            f.set(px, WIRE, P.enoWinHi);
        }
        // a coupling to the next car
        if (c < CARS - 1) f.rect(x + CAR, RAIL - 8, 1, 3, P.enoDark);
      }
      // headlight glow and its gleam on the rails ahead
      const nose = dir === 1 ? x0 + trainLen - 1 : x0;
      const toot = t - tootAt;
      if (toot < 700 && Math.floor(toot / 175) % 2 === 0) {
        glow(f, nose + dir * 6, RAIL - 6, 18, P.enoHead, 0.6, 0.7, 0.15);
      }
      glow(f, nose + dir * 4, RAIL - 6, 10, P.enoHead, 0.45, 0.6, 0.15);
      for (let k = 2; k < 40; k += 2)
        f.blend(nose + dir * k, RAIL, P.enoHead, 0.5 * (1 - k / 40));
    }

    function drawSignal(
      f: Frame,
      x: number,
      t: number,
      state: { ringing: boolean; dir: number },
      near: boolean
    ) {
      const base = near ? h - 1 : PLAT + 3;
      const top = base - (near ? 27 : 22);
      // pole with the black and yellow stripes at the bottom
      f.vline(x, top, base, P.xBlack);
      for (let y = base - 7; y <= base; y++)
        f.set(x, y, Math.floor(y / 2) % 2 ? P.xYellow : P.xBlack);
      // the crossbuck
      for (let k = -3; k <= 3; k++) {
        f.set(x + k, top + 3 + k, P.xYellow);
        f.set(x - k, top + 3 + k, P.xYellow);
        f.set(x + k + 1, top + 3 + k, P.xBlack);
      }
      // two red lamps on a black bar, flashing in turn
      const ly = top + 9;
      f.hline(x - 4, x + 4, ly, P.xBlack);
      const on = state.ringing ? Math.floor(t / 420) % 2 : -1;
      for (const [k, lx] of [
        [0, x - 3],
        [1, x + 2],
      ] as const) {
        const lit = on === k;
        f.rect(lx, ly + 1, 2, 2, lit ? P.xRed : P.xRedDim);
        f.hline(lx, lx + 1, ly + 1, lit ? P.enoWinHi : P.xRedDim);
        if (lit) glow(f, lx + 0.5, ly + 1.5, 7, P.xRedGlow, 0.55, 1, 0.15);
      }
      // the arrow showing which way the train is coming
      f.rect(x - 2, ly + 4, 5, 3, P.xBlack);
      if (state.ringing && state.dir !== 0) {
        const d = state.dir;
        f.set(x - d, ly + 5, P.arrow);
        f.set(x, ly + 5, P.arrow);
        f.set(x + d, ly + 5, P.arrow);
        f.set(x, ly + 4 + 0, P.arrow);
        f.set(x, ly + 6, P.arrow);
      }
    }

    function drawGate(
      f: Frame,
      pivotX: number,
      pivotY: number,
      len: number,
      down: number,
      side: number
    ) {
      // a yellow-and-black boom swinging from upright down across the road
      const a = (Math.PI / 2) * (1 - down);
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      for (let i = 1; i < len; i++) {
        const px = pivotX - side * ca * i;
        const py = pivotY - 1 - sa * i;
        const c = Math.floor(i / 3) % 2 ? P.xBlack : P.xYellow;
        f.set(px, py, c);
        f.set(px + sa * side, py + ca, c === P.xYellow ? P.xBlack : P.xBlack);
      }
      f.rect(pivotX - 1, pivotY - 2, 3, 5, P.xGrey);
      f.vline(pivotX + 1, pivotY - 2, pivotY + 2, P.xGreySh);
      f.set(pivotX, pivotY - 1, P.xBlack);
    }

    // ----- waves and surfers -----
    const WAVES = 3;
    const WAVE_T = 7800;
    function wave(t: number, k: number) {
      const p = (((t / WAVE_T + k / WAVES) % 1) + 1) % 1;
      const y = LINEUP - 6 + p * (SHORE - LINEUP + 8);
      const peak =
        w * (0.25 + hash2(k, Math.floor(t / WAVE_T + k / WAVES), 31) * 0.5);
      return { p, y, peak };
    }

    // the shape of each wave's sections, recomputed only when a new wave starts
    const waveNoise = Array.from({ length: WAVES }, () => ({
      cycle: NaN,
      n: new Float32Array(w),
    }));
    const swashEdge = Int8Array.from({ length: w }, (_, x) =>
      Math.round(fbm1(x / 10, 51) * 2 - 1)
    );
    function sections(k: number, cycle: number) {
      const c = waveNoise[k]!;
      if (c.cycle !== cycle) {
        c.cycle = cycle;
        for (let x = 0; x < w; x++)
          c.n[x] = fbm1(x / 26 + k * 7.3 + cycle * 3.1, 40 + k);
      }
      return c.n;
    }

    function drawWaves(f: Frame, t: number) {
      for (let k = 0; k < WAVES; k++) {
        const { p, y, peak } = wave(t, k);
        const yy = Math.round(y);
        const cycle = Math.floor(t / WAVE_T + k / WAVES);
        const noise = sections(k, cycle);
        // breaking starts at the peak and peels both ways
        const broken = Math.max(0, (p - 0.3) / 0.7) * w * 0.9;
        const gate = 0.42 + p * 0.1;
        for (let x = capeW - 2; x < w; x++) {
          // the swell comes in sets of sections, not one endless line
          const n = noise[x]!;
          if (n < gate) continue;
          const core = n > gate + 0.06;
          if (Math.abs(x - peak) < broken) {
            if (p > 0.82 && hash2(x >> 1, cycle, 9) < (p - 0.82) * 5) continue; // whitewash breaking up
            f.set(x, yy, P.foam);
            if (core && p < 0.8)
              f.set(
                x,
                yy + 1,
                hash2(x, Math.floor(t / 180), k) > 0.3 ? P.foam : P.foamSh
              );
            if (core && p < 0.55 && hash2(x, Math.floor(t / 120), k + 3) > 0.7)
              f.set(x, yy - 1, P.foamSh);
          } else {
            // unbroken swell: the lip catches the sun, the face is in shadow
            f.set(x, yy, core ? P.swellLit : P.sea2);
            if (core) f.set(x, yy + 1, P.swell);
          }
        }
      }
      // swash: the thin sheet of water sliding up the sand and back
      const s = (t % 3900) / 3900;
      const reach = Math.sin(s * Math.PI);
      const edge = SHORE + 1 + Math.round(reach * 3);
      for (let x = capeW; x < w; x++) {
        const e = edge + swashEdge[x]!;
        for (let y = SHORE + 1; y <= e; y++)
          f.set(x, y, y === e ? P.foam : P.wetHi);
      }
    }

    // surfers waiting in the lineup, and the one who catches each wave
    const surfers = Array.from(
      { length: Math.max(3, Math.round(w / 70)) },
      (_, i) => ({
        x: Math.round(capeW + 10 + hash2(i, 1, 21) * (w - capeW - 20)),
        y: LINEUP + Math.round(hash2(i, 2, 21) * 4),
      })
    );
    let rideCalled = { t: -Infinity, x: 0 };

    function rideFor(t: number) {
      // which wave is being ridden, by whom, and where they are on it
      for (let k = 0; k < WAVES; k++) {
        const { p, peak } = wave(t, k);
        if (p < 0.3 || p > 0.86) continue;
        const startT = t - (p - 0.3) * WAVE_T; // when this wave began to break
        const called =
          rideCalled.t <= startT + 400 &&
          rideCalled.t > startT - WAVE_T / WAVES;
        const cycle = Math.floor(t / WAVE_T + k / WAVES);
        if (!called && hash2(k, cycle, 77) > 0.55) continue;
        const startX = called ? rideCalled.x : peak;
        // peel away from the cape if there's no room to ride towards it
        const dir =
          hash2(k, cycle, 78) > 0.5 || startX - 80 < capeW + 6 ? 1 : -1;
        const q = (p - 0.3) / 0.56;
        return { k, x: startX + dir * q * 80, dir, q, called };
      }
      return null;
    }

    function drawSurfers(f: Frame, t: number, night: number) {
      const ride = rideFor(t);
      for (const [i, s] of surfers.entries()) {
        // (they paddle in one by one as it gets dark)
        if (night > 0.2 + 0.45 * hash2(i, 9, 21)) continue;
        // bob as the swell passes under
        let lift = 0;
        for (let k = 0; k < WAVES; k++)
          if (Math.abs(wave(t, k).y - s.y) < 3) lift = 1;
        const x = s.x;
        const y = s.y - lift;
        f.hline(x - 3, x + 2, y, P.board);
        f.set(x + 2, y, P.boardSh);
        f.rect(x - 1, y - 3, 2, 3, P.surfer);
        f.set(x - 1, y - 4, P.surfer);
        if (Math.floor(t / 900 + i) % 5 === 0) f.set(x + 1, y - 2, P.surfer); // a hand paddling
      }
      // (a ride that reaches the cape kicks out there rather than surf onto the rocks)
      // (after dark only someone you've called out is still riding)
      if (ride && ride.x > capeW + 6 && (night < 0.25 || ride.called)) {
        const { x, dir, q } = ride;
        const y = Math.round(wave(t, ride.k).y) - 1;
        const rx = Math.round(x);
        // spray off the tail
        for (let k = 1; k < 8; k++)
          if (hash2(k, Math.floor(t / 90), 5) > 0.35)
            f.set(rx - dir * (k + 2), y - Math.round((8 - k) / 3), P.foam);
        // board, crouched rider, arms out
        f.hline(rx - 3, rx + 3, y + 1, P.board);
        f.set(rx + dir * 4, y, P.board);
        f.rect(rx, y - 4, 1, 4, P.surfer);
        f.set(rx - dir, y - 1, P.surfer);
        f.set(rx - dir, y, P.surfer);
        f.set(rx + dir, y - 3, P.surfer);
        f.set(rx + dir * 2, y - 3, P.surfer);
        f.set(rx - dir, y - 3, P.surfer);
        f.set(rx - dir * 2, y - 4, P.surfer);
        f.set(rx, y - 5, P.surfer);
        if (q > 0.92) f.set(rx, y - 6, P.surfer);
      }
    }

    // ----- life on the beach and the road -----
    const dogBase = Math.round(capeW + (w - capeW) * 0.62);
    let dogCalled = { t: -Infinity, x: 0 };
    let cyclistAt = -Infinity;
    /** How far along the road the cyclist is (0..1), or > 1 when out of sight. */
    const cyclistP = (t: number) => {
      const c = t - cyclistAt;
      if (c < 6000) return c / 6000;
      const p = ((t + 5000) % 23_000) / 6000;
      // the regular one skips a ride that would have overlapped a called one
      const s = t - p * 6000;
      return s < cyclistAt + 6000 && s + 6000 > cyclistAt ? 2 : p;
    };
    let beaconAt = -Infinity;
    let tootAt = -Infinity;
    // The couple's snack. A kite called down from the sky (a click up
    // there) dives on it from wherever you clicked; every kite that dives for
    // it gets it, and a while later they've got another one out.
    const SNATCH = 3000;
    const GRAB = SNATCH * 0.45;
    const SNACK_BACK = 6000;
    let snatches: number[] = [];
    const snatching = (t: number) =>
      snatches.some((s) => t - s >= 0 && t - s < SNACK_BACK);
    // The egg: a kite that goes for it. It comes in over our heads, huge,
    // drops on the snack right out of their hands, swings out over the sea
    // with it, and comes back past us showing it off.
    const KITE_FOR = 6000;
    const K_IN = 350; // over the camera
    const K_GRAB = 1500; // in their hands
    const K_OFF = 1750;
    const K_TURN = 3000; // out over the sea, turning back
    const K_GONE = 4500; // back past the camera
    let kiteAt = -Infinity;
    const kiteEgg = (t: number) => t - kiteAt >= 0 && t - kiteAt < KITE_FOR;
    const snackGone = (t: number) =>
      snatches.some((s) => t - s >= GRAB && t - s < SNACK_BACK) ||
      (t - kiteAt >= K_GRAB && t - kiteAt < KITE_FOR);
    const coupleTop = WALL - 10;
    const snackX = coupleX + 3; // 2x2, held up between them
    const snackY = coupleTop + 2;

    // The stars egg: their beach mat. It unrolls, the evening runs on into
    // night, and there they are, lying back on it under the Milky Way.
    const STARS_FOR = 8000;
    let starsAt = -Infinity;
    const starsEgg = (t: number) => t - starsAt >= 0 && t - starsAt < STARS_FOR;
    /** How far into the night the egg has run: 0 for the usual sunset, 1 for night. */
    const nightN = (t: number) => {
      const a = t - starsAt;
      if (a < 0 || a >= STARS_FOR) return 0;
      return smooth((a - 250) / 2000) * (1 - smooth((a - 5900) / 1800));
    };
    const matL = coupleX - 6;
    const matR = matX + 4;
    /** 0 rolled up, 1 flat out. */
    const matOpen = (t: number) => {
      const a = t - starsAt;
      if (a < 0 || a >= STARS_FOR) return 0;
      return smooth(a / 550) * (1 - smooth((a - 7350) / 550));
    };
    // shooting stars while they're lying there: [starts at, lasts, from, to]
    const METEORS = [
      { at: 2500, dur: 1000, x0: 0.9, y0: 3, x1: 0.48, y1: 38 },
      { at: 4200, dur: 850, x0: 0.08, y0: 6, x1: 0.42, y1: 36 },
      { at: 5250, dur: 550, x0: 0.6, y0: 10, x1: 0.76, y1: 28 },
    ];

    function drawMat(f: Frame, t: number) {
      const m = matOpen(t);
      const roll = Math.round(matX + (matL + 4 - matX) * m);
      // the flat part left behind as it rolls out
      if (m > 0)
        for (let x = roll; x <= matR; x++) {
          const stripe = Math.floor((x - matL) / 3) % 2 === 0;
          for (let y = WALL - 10; y <= WALL - 3; y++) {
            const edge = y === WALL - 10 ? 1 : y === WALL - 3 ? -1 : 0;
            f.set(
              x,
              y,
              stripe
                ? edge > 0
                  ? P.matALit
                  : edge < 0
                    ? P.matSh
                    : P.matA
                : edge < 0
                  ? P.matBSh
                  : P.matB
            );
          }
        }
      if (m >= 0.97) return;
      // the roll: stripes running round it and the spiral at its end
      const thick = m > 0.7 ? 2 : 3;
      for (let dx = -4; dx <= 4; dx++) {
        const x = roll + dx;
        const ring = (((x - Math.round(m * 9)) % 4) + 4) % 4 < 2;
        for (let k = 0; k < thick; k++) {
          const y = WALL - 4 - thick + k;
          const top = k === 0;
          const bottom = k === thick - 1 && thick > 1;
          let c = ring
            ? top
              ? P.matALit
              : bottom
                ? P.matSh
                : P.matA
            : bottom
              ? P.matBSh
              : P.matB;
          if (dx === 4) c = k === 1 ? P.matSh : P.matBSh; // the spiral end
          if (Math.abs(dx) === 4 && top && thick === 3) continue; // rounded
          f.set(x, y, c);
        }
      }
    }

    function drawCouple(f: Frame, t: number) {
      const n = nightN(t);
      if (n > 0.5) return; // off lying on the mat
      const x0 = coupleX - 2;
      const top = coupleTop;
      const a = t - kiteAt;
      const egg = a >= 0 && a < KITE_FOR;
      // holding the snack, flailing at a kite, pointing after it, or laughing
      let mode: 'hold' | 'flail' | 'point' | 'laugh' = 'hold';
      if (egg)
        mode =
          a < K_GRAB - 60
            ? 'hold'
            : a < 2900
              ? 'flail'
              : a < 4300
                ? 'point'
                : 'laugh';
      else if (snatches.some((s) => t - s >= GRAB - 80 && t - s < GRAB + 1000))
        mode = 'flail';
      const rows = mode === 'laugh' ? COUPLE_LEAN : COUPLE;
      // shoulders shaking with laughter, each on their own beat
      const bobM = mode === 'laugh' && Math.floor(a / 150) % 2 ? 1 : 0;
      const bobW = mode === 'laugh' && Math.floor(a / 190) % 2 ? 1 : 0;
      for (let ry = 0; ry < rows.length; ry++) {
        const row = rows[ry]!;
        for (let rx = 0; rx < row.length; rx++) {
          const c = COUPLE_COL[row[rx]!];
          if (c === undefined) continue;
          f.set(x0 + rx, top + ry + (rx < 6 ? bobM : bobW), c);
        }
      }
      const arm = (sx: number, sy: number, ang: number, len: number, c: RGB) =>
        f.line(
          sx,
          sy,
          sx + Math.round(Math.sin(ang) * len),
          sy - Math.round(Math.cos(ang) * len),
          c
        );
      const sy = top + 4;
      if (mode === 'hold') {
        if (!snackGone(t)) {
          // his hand up between them with the snack in it (lifted for a
          // bite, catching the sun, just as the kite comes)
          const up = egg ? 1 : 0;
          f.set(x0 + 5, sy - up, P.hoodie);
          f.rect(snackX, snackY - up, 2, 2, P.snack);
          f.set(snackX + 1, snackY + 1 - up, P.snackCrust);
          if (egg && a < 700) {
            const r = 1 + Math.floor(a / 120);
            const k = 1 - a / 700;
            for (const [dx, dy] of [
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1],
            ] as const)
              for (let i = 1; i <= r; i++)
                f.blend(
                  snackX + 0.5 + dx * (i + 0.5),
                  snackY - up + 0.5 + dy * (i + 0.5),
                  P.sun,
                  k * (1 - (i - 1) / (r + 1))
                );
          }
        }
      } else if (mode === 'flail') {
        const k = egg ? a : t;
        const sw = (ph: number) => 0.5 + 0.65 * Math.sin(k / 55 + ph);
        arm(x0 + 1, sy, -sw(0), 4, P.hoodie);
        arm(x0 + 4, sy, sw(2.1), 4, P.hoodie);
        arm(x0 + 7, sy, -sw(1.3), 4, P.jumper);
        arm(x0 + 10, sy, sw(3.6), 4, P.jumper);
        f.set(
          x0 + 4 + Math.round(Math.sin(sw(2.1)) * 4),
          sy - Math.round(Math.cos(sw(2.1)) * 4),
          P.hoodieRim
        );
        f.set(
          x0 + 10 + Math.round(Math.sin(sw(3.6)) * 4),
          sy - Math.round(Math.cos(sw(3.6)) * 4),
          P.jumperLit
        );
      } else if (mode === 'point') {
        // he shakes a fist after it; she's got her hands on her head
        const k = kiteFlight(a);
        const ang =
          Math.min(0.75, k ? Math.atan2(k.x - (x0 + 4), sy - k.y) : 0.6) +
          Math.sin(a / 45) * 0.18;
        arm(x0 + 4, sy, ang, 5, P.hoodie);
        f.set(
          x0 + 4 + Math.round(Math.sin(ang) * 5),
          sy - Math.round(Math.cos(ang) * 5),
          P.hoodieRim
        );
        f.line(x0 + 7, sy, x0 + 6, top + 1, P.jumper);
        f.line(x0 + 10, sy, x0 + 11, top + 1, P.jumperLit);
      }
    }

    /** Crumbs flying off a snatched snack and landing round them on the sand. */
    function crumbs(
      f: Frame,
      age: number,
      count: number,
      until: number,
      seed: number
    ) {
      if (age < 0 || age >= until) return;
      const s = age / 1000;
      const G = 150;
      for (let i = 0; i < count; i++) {
        if (age > until - 700 && hash2(i, 9, seed) < (age - until + 700) / 700)
          continue;
        const vx = (hash2(i, 1, seed) - 0.5) * 70;
        const vy = -(18 + hash2(i, 2, seed) * 42);
        const y0 = snackY + 1;
        const ground = WALL - 4 + Math.floor(hash2(i, 3, seed) * 3);
        const land =
          (-vy + Math.sqrt(vy * vy + 4 * G * (ground - y0))) / (2 * G);
        const ss = Math.min(s, land);
        const x = snackX + 0.5 + vx * ss;
        const y = s >= land ? ground : y0 + vy * ss + G * ss * ss;
        f.set(x, y, hash2(i, 4, seed) > 0.4 ? P.crumb : P.snackCrust);
      }
    }

    /** A feather knocked loose in the scuffle, seesawing down onto the sand. */
    function feather(f: Frame, age: number, until: number) {
      if (age < 0 || age >= until) return;
      const s = age / 1000;
      const x0 = snackX + 2;
      const y0 = snackY - 8;
      const ground = WALL - 3;
      const rise = Math.sin(Math.min(1, s / 0.4) * Math.PI * 0.5) * 5;
      const fall = smooth((s - 0.4) / 3.4);
      const y = y0 - rise * (1 - fall) + (ground - y0) * fall;
      const landed = fall >= 1;
      const sw = Math.sin(s * 2.8);
      const x = x0 + s * 2.5 + (landed ? 0 : sw * 6);
      // tilted as it swings, flat once down
      const tilt = landed ? 0.1 : Math.cos(s * 2.8) * 0.7;
      const cx = Math.cos(tilt);
      const cy = Math.sin(tilt);
      // a pale quill with the dark barred vane along one side
      for (let k = -3; k <= 3; k++) {
        const px = x + cx * k;
        const py = y + cy * k;
        f.set(px, py, P.featherLit);
        if (k > -3 && k < 3)
          f.set(px - cy, py - 1, k % 2 ? P.feather : P.featherLit);
      }
    }

    function drawBeach(f: Frame, t: number) {
      const n = nightN(t);
      drawMat(f, t);
      drawCouple(f, t);
      crumbs(f, t - kiteAt - K_GRAB, 18, KITE_FOR - K_GRAB, 3);
      feather(f, t - kiteAt - K_GRAB - 60, KITE_FOR - K_GRAB - 60);
      for (const s of snatches)
        crumbs(f, t - s - GRAB, 6, SNACK_BACK - GRAB, Math.floor(s) % 97);
      // someone walking home with a board under the arm (gone by nightfall)
      const span = w + 30;
      const wx = Math.round(((t * 0.006) % span) - 15);
      const step = Math.floor(t / 260) % 2;
      const wy = SHORE + 7;
      if (n < 0.3) {
        f.rect(wx, wy - 6, 2, 4, P.person);
        f.set(wx, wy - 7, P.person);
        f.set(wx - step, wy - 2, P.person);
        f.set(wx + 1 + step, wy - 2, P.person);
        f.hline(wx - 3, wx + 4, wy - 4, P.board);
      }
      // the dog walker and a dog trotting at the water's edge
      const dyc = SHORE + 6;
      const called = t - dogCalled.t;
      // trotting about in front of its owner, never into them
      let dx = dogBase + 2 + Math.round(Math.sin(t / 1300) * 5);
      if (called < 4000) {
        const p = called / 4000;
        const out = p < 0.5 ? p / 0.5 : (1 - p) / 0.5;
        const e = out * out * (3 - 2 * out);
        dx = Math.round(dx + (dogCalled.x - dx) * e);
      }
      const ox = dogBase - 8;
      f.rect(ox, dyc - 7, 2, 5, P.person);
      f.set(ox, dyc - 8, P.person);
      f.set(ox + (Math.floor(t / 400) % 2), dyc - 2, P.person);
      // the lead, when it's close (a dog called away runs off it)
      if (dx > ox + 3 && dx < ox + 17)
        f.line(ox + 2, dyc - 5, dx - 2, dyc - 3, P.personLit);
      const run = Math.floor(t / (called < 4000 ? 90 : 200)) % 2;
      f.hline(dx - 2, dx + 1, dyc - 2, P.dog);
      f.set(dx + 2, dyc - 3, P.dog);
      f.set(dx - 3, dyc - 3, P.dog);
      f.set(dx - 2 + run, dyc - 1, P.dog);
      f.set(dx + 1 - run, dyc - 1, P.dog);
    }

    const CAR_COLORS = [P.car1, P.car2, P.car3, P.car4];
    function drawRoad(f: Frame, t: number) {
      // a steady trickle of cars both ways, lights on at dusk
      for (let i = 0; i < Math.max(3, Math.round(w / 90)); i++) {
        const dir = i % 2 ? 1 : -1;
        const speed = 0.035 + hash2(i, 1, 13) * 0.015;
        const span = w + 40;
        const p = (((hash2(i, 2, 13) * span + t * speed) % span) + span) % span;
        const x = Math.round(dir === 1 ? p - 20 : w + 20 - p);
        const y = dir === 1 ? ROAD + 6 : ROAD + 2;
        const body = CAR_COLORS[i % CAR_COLORS.length]!;
        f.rect(x, y - 3, 13, 3, body);
        f.rect(x + 3, y - 5, 7, 2, body);
        f.rect(x + 4, y - 5, 5, 1, P.carGlass);
        f.hline(x + 3, x + 9, y - 6, P.carHi);
        f.set(x + 2, y, P.xBlack);
        f.set(x + 10, y, P.xBlack);
        const fx0 = dir === 1 ? x + 12 : x;
        f.set(fx0, y - 2, P.headlight);
        f.set(dir === 1 ? x : x + 12, y - 2, P.taillight);
        for (let k = 1; k < 7; k++)
          f.blend(
            fx0 + dir * k,
            y - 2 + (k > 3 ? 1 : 0),
            P.headlight,
            0.4 - k * 0.05
          );
      }
      // a surfer cycling home, board in the side rack
      const p = cyclistP(t);
      if (p <= 1) {
        const x = Math.round(-14 + p * (w + 28));
        const y = ROAD_B + 2;
        const pedal = Math.floor(t / 150) % 2;
        f.disc(x, y - 1, 1.5, (dx, dy) =>
          dx * dx + dy * dy > 1 ? P.person : null
        );
        f.disc(x + 7, y - 1, 1.5, (dx, dy) =>
          dx * dx + dy * dy > 1 ? P.person : null
        );
        f.line(x, y - 1, x + 3, y - 4, P.person);
        f.line(x + 3, y - 4, x + 7, y - 1, P.person);
        f.vline(x + 3, y - 9, y - 5, P.person);
        f.set(x + 3, y - 10, P.person);
        f.line(x + 3, y - 7, x + 6, y - 5, P.person);
        f.set(x + 3 + pedal, y - 3, P.person);
        // the board in its side rack, nose up
        f.line(x - 4, y - 3, x + 9, y - 6, P.board);
        f.line(x - 4, y - 2, x + 9, y - 5, P.boardSh);
      }
    }

    function drawKites(f: Frame, t: number, night: number) {
      for (let k = 0; k < 2; k++) {
        if (night > 0.15 + k * 0.15) continue; // off to roost
        const ph = (t / (10_000 + k * 3_000)) * Math.PI * 2 + k * 2;
        const x = w * (0.22 + 0.38 * k) + Math.cos(ph) * (18 + k * 6);
        const y = 26 + k * 10 + Math.sin(ph) * 5;
        const dir = -Math.sin(ph) > 0 ? 1 : -1;
        sprite(
          f,
          [
            'x.x.......x.x',
            '.xxx.....xxx.',
            '..xxxx#xxxx..',
            '.....xxx.....',
            '.....x.x.....',
          ],
          x - 6,
          y - 2,
          { x: P.kite, '#': P.kiteLit },
          dir < 0
        );
      }
    }

    function drawGlints(f: Frame, t: number, night: number) {
      // (going out as the sun goes down)
      if (night >= 0.34) return;
      const out = night * 3;
      // the sun's road: broken gold dashes, wider and longer close in
      for (let y = HORIZON + 1; y < SHORE; y++) {
        const depth = (y - HORIZON) / (SHORE - HORIZON);
        const half = 3 + depth * 26;
        const n = 2 + Math.round(depth * 6);
        for (let i = 0; i < n; i++) {
          const ph = hash2(i, y, 77);
          if (Math.sin(t / 420 + ph * 30) < 0.15) continue;
          if (out && hash2(i, y, 80) < out) continue;
          const x = Math.round(sunX + (hash2(i, y, 78) - 0.5) * 2 * half);
          const len = 1 + Math.round(hash2(i, y, 79) * (1 + depth * 4));
          f.hline(x, x + len - 1, y, depth < 0.4 || i % 3 ? P.glint : P.glint2);
        }
      }
      // scattered sparkles elsewhere on the bay
      for (let i = 0; i < w / 12; i++) {
        const y =
          HORIZON + 2 + Math.floor(hash2(i, 1, 81) * (SHORE - HORIZON - 4));
        const x = Math.floor(hash2(i, 2, 81) * w);
        if (Math.sin(t / 600 + i * 1.7) < 0.7) continue;
        if (out && hash2(i, 3, 81) < out) continue;
        f.set(x, y, P.glint2);
      }
    }

    function drawBeacon(f: Frame, t: number) {
      // the Sea Candle's light: a slow blink, or a sweeping beam when poked
      const a = t - beaconAt;
      const { x, y } = candle;
      if (a < 5000) {
        // the beam turns: long when it points across the bay, short when it points at us
        const ang = (a / 5000) * Math.PI * 4;
        const reach = Math.cos(ang);
        const len = Math.abs(reach) * Math.min(150, w * 0.4);
        const dir = reach < 0 ? -1 : 1;
        const fade = Math.min(1, (5000 - a) / 800, a / 200);
        for (let r = 2; r < len; r++) {
          const spread = 0.6 + r * 0.07;
          const strength = 0.38 * (1 - r / (len + 1)) * fade;
          for (let k = Math.ceil(-spread); k <= spread; k++) {
            const edge = Math.abs(k) > spread - 1 ? 0.5 : 1;
            f.blend(x + dir * r, y + k, P.beam, strength * edge);
          }
        }
        f.set(x, y, P.beacon);
        glow(f, x, y, 6 + Math.abs(Math.sin(ang)) * 4, P.beacon, 0.6, 1, 0.15);
        return;
      }
      if (Math.floor(t / 600) % 5 === 0) {
        f.set(x, y, P.beacon);
        glow(f, x, y, 4, P.beacon, 0.5, 1, 0.15);
      }
    }

    function kiteSnatch(t: number, x: number, y: number) {
      // a black kite drops out of the sky and makes off with their snack
      // (if there's still one to have)
      const tx = snackX + 1;
      const ty = snackY - 2;
      const dir = x < tx ? 1 : -1;
      const carry = !snackGone(t + GRAB);
      snatches = snatches.filter((s) => t - s < SNACK_BACK);
      snatches.push(t);
      fxTop.add(t, SNATCH, (f, age) => {
        const p = age / SNATCH;
        let kx: number;
        let ky: number;
        if (p < 0.45) {
          const q = p / 0.45;
          kx = x + (tx - x) * q;
          ky = y + (ty - y) * q * q;
        } else {
          const q = (p - 0.45) / 0.55;
          kx = tx + dir * q * 90;
          ky = ty - q * (ty - 20) * Math.sqrt(q);
        }
        const rows =
          p < 0.4
            ? [
                '..xx.........',
                '...xxx.......',
                '....xx#xx....',
                '......xxxx...',
                '.....x.......',
              ]
            : [
                'x.x.......x.x',
                '.xxx.....xxx.',
                '..xxxx#xxxx..',
                '.....xxx.....',
                '.....x.x.....',
              ];
        sprite(f, rows, kx - 6, ky - 2, { x: P.kite, '#': P.kiteLit }, dir < 0);
        if (p > 0.45 && carry)
          f.set(Math.round(kx), Math.round(ky) + 3, P.snack); // rounded like the sprite
      });
    }

    // ----- the kite egg -----
    const SPAN = 16; // its wingspan down at the couple
    const NEAR = Math.max(160, w * 0.42); // ...and right over the camera
    const grabX = snackX + 1;
    const grabY = snackY - 4;
    const fromX = grabX - Math.max(40, w * 0.2);
    const turnFrom = { x: grabX + 3, y: grabY - 9 };
    const turnTo = {
      x: Math.min(w - 20, grabX + Math.max(50, (sunX - grabX) * 0.7)),
      y: HORIZON - 26,
    };
    const passTo = { x: -NEAR * 0.25, y: 10 };
    /** Where the egg's kite is `a` ms in, how big, and how it's holding itself. */
    function kiteFlight(a: number) {
      if (a < K_IN || a >= K_GONE) return null;
      if (a < K_GRAB) {
        // in from behind us: huge as it passes over the camera, then
        // shrinking as it drops away down onto them
        const s = (a - K_IN) / (K_GRAB - K_IN);
        const d0 = SPAN / NEAR;
        const d = d0 + (1 - d0) * Math.pow(s, 1.7);
        const g = (1 / d - 1) / (1 / d0 - 1);
        const x = grabX + (fromX - grabX) * g;
        const y = grabY + (18 - grabY) * g;
        // wings spread wide going over us, folding back as it dives, and it
        // brakes at the last moment: head up, tail spread, feet out
        const flare = smooth((a - (K_GRAB - 240)) / 240);
        const fold = smooth(s / 0.55);
        return {
          x,
          y,
          span: SPAN / d,
          pose: {
            heading: (0.15 + 0.3 * fold) * (1 - flare),
            flap: 0.3 * Math.sin(a / 110) * (1 - fold) + flare * 0.7,
            tuck: 0.5 * fold * (1 - flare),
            fan: 0.6 * (1 - fold) + flare,
            talons: flare > 0.3 ? 1 : 0,
          },
        };
      }
      if (a < K_OFF) {
        // the grab: wings beating hard, the snack in its feet
        const s = (a - K_GRAB) / (K_OFF - K_GRAB);
        return {
          x: grabX + 3 * s,
          y: grabY - 9 * smooth(s),
          span: SPAN,
          pose: {
            heading: 0.25 * s,
            flap: Math.sin((a - K_GRAB) / 40),
            tuck: 0,
            fan: 1 - s * 0.5,
            talons: 2,
          },
        };
      }
      if (a < K_TURN) {
        // out over the sea towards the sun, climbing
        const s = (a - K_OFF) / (K_TURN - K_OFF);
        const d = 1 + 1.2 * smooth(s);
        const x =
          turnFrom.x + ((turnTo.x - turnFrom.x) * (1 - 1 / d)) / (1 - 1 / 2.2);
        const y =
          turnFrom.y +
          (turnTo.y - turnFrom.y) * smooth(s) -
          Math.sin(Math.PI * s) * 4;
        return {
          x,
          y,
          span: SPAN / d,
          pose: {
            heading: 0.5 - 0.9 * smooth((s - 0.6) / 0.4),
            flap: Math.sin((a - K_OFF) / 65),
            tuck: 0,
            fan: 0.3,
            talons: 2,
          },
        };
      }
      // ...and wheels round and comes back right past us, showing it off
      const s = (a - K_TURN) / (K_GONE - K_TURN);
      const e = Math.pow(s, 1.9);
      return {
        x: turnTo.x + (passTo.x - turnTo.x) * e,
        y: turnTo.y + (passTo.y - turnTo.y) * e,
        span: SPAN / 2.2 + (NEAR * 0.9 - SPAN / 2.2) * Math.pow(s, 2.3),
        pose: {
          heading: -0.4 + 0.15 * Math.sin(a / 200),
          flap: Math.sin((a - K_TURN) / (90 + 60 * s)),
          tuck: 0,
          fan: 0.5,
          talons: 2,
        },
      };
    }
    function drawKiteEgg(f: Frame, t: number) {
      const a = t - kiteAt;
      // crumbs raining off the snack in its feet as it comes back past us
      if (a > K_TURN && a < K_GONE + 1200)
        for (let i = 0; i < 14; i++) {
          const at = K_TURN + 250 + i * 70;
          const dt = (a - at) / 1000;
          if (dt < 0 || at >= K_GONE) continue;
          const src = kiteFlight(at)!;
          const r = src.span / 2;
          const sx = src.x - Math.sin(src.pose.heading) * 0.38 * r;
          const sy = src.y + Math.cos(src.pose.heading) * 0.38 * r;
          const g = 30 + src.span * 3;
          const x = sx + (hash2(i, 1, 33) - 0.5) * src.span * 0.4 * dt;
          const y = sy + g * dt * dt;
          if (y > h) continue;
          const c = hash2(i, 2, 33) > 0.4 ? P.crumb : P.snackCrust;
          if (src.span > 50) f.rect(x, y, 2, 2, c);
          else f.set(x, y, c);
        }
      const k = kiteFlight(a);
      if (!k) return;
      if (k.span >= 7) {
        bigKite(f, k.x, k.y, k.span, k.pose);
        return;
      }
      // a few pixels now: flapping wings, the snack hanging below
      const x = Math.round(k.x);
      const y = Math.round(k.y);
      const up = k.pose.flap > 0 ? -1 : 1;
      f.set(x, y, P.kite);
      f.set(x - 1, y + up, P.kite);
      f.set(x + 1, y + up, P.kite);
      if (k.span >= 4) {
        f.set(x - 2, y, P.kite);
        f.set(x + 2, y, P.kite);
      }
      f.set(x, y + 1, P.snack);
    }

    // ----- the stars egg's night -----
    // a few lights on the island after dark
    const islandLights: { x: number; y: number }[] = [];
    for (let k = 0; k < 7; k++) {
      const x = Math.round(enoX - enoW * 0.42 + hash2(k, 1, 91) * enoW * 0.84);
      for (let y = HORIZON - 26; y < HORIZON + 3; y++)
        if (land.opaque(x, y)) {
          islandLights.push({ x, y: y + 2 + Math.floor(hash2(k, 2, 91) * 3) });
          break;
        }
    }
    const fxNight = new Fx();
    function meteor(
      f: Frame,
      p: number,
      m: (typeof METEORS)[number],
      sky: (x: number, y: number) => boolean
    ) {
      const x0 = m.x0 * w;
      const x1 = m.x1 * w;
      const len = Math.hypot(x1 - x0, m.y1 - m.y0);
      const ux = (x1 - x0) / len;
      const uy = (m.y1 - m.y0) / len;
      const e = 1 - (1 - p) * (1 - p);
      const hx = x0 + (x1 - x0) * e;
      const hy = m.y0 + (m.y1 - m.y0) * e;
      const a = Math.min(1, p * 6, (1 - p) * 3.5);
      const tail = Math.min(len * e, len * 0.5);
      for (let k = 0; k < tail; k += 0.6) {
        const x = Math.round(hx - ux * k);
        const y = Math.round(hy - uy * k);
        if (!sky(x, y)) continue;
        const v = 1 - k / tail;
        f.blend(
          x,
          y,
          k < tail * 0.3 ? P.starHi : P.star2,
          a * Math.min(1, v * 1.4)
        );
        // a fainter second line along the bright end, so it reads as a streak
        if (k < tail * 0.45 && sky(x, y + 1))
          f.blend(x, y + 1, P.star2, a * v * 0.55);
      }
      const x = Math.round(hx);
      const y = Math.round(hy);
      if (sky(x, y)) {
        glow(f, x, y, 5, P.star2, 0.5 * a, 1, 0.1);
        f.blend(x, y, P.starHi, a);
        f.blend(x + 1, y, P.starHi, a);
        f.blend(x, y + 1, P.starHi, a * 0.8);
        f.blend(x + 1, y + 1, P.starHi, a * 0.6);
      }
    }
    /** Which meteor is going over `a` ms into the egg, and where its head is. */
    function meteorHead(a: number) {
      for (const [i, m] of METEORS.entries()) {
        const age = a - m.at;
        if (age < 0 || age >= m.dur + 700) continue;
        const p = Math.min(1, age / m.dur);
        const e = 1 - (1 - p) * (1 - p);
        return {
          i,
          x: m.x0 * w + (m.x1 - m.x0) * w * e,
          y: m.y0 + (m.y1 - m.y0) * e,
        };
      }
      return null;
    }
    function drawNight(f: Frame, t: number, n: number, gq: number) {
      const a = t - starsAt;
      const px = f.pixels;
      /** Open sky that's not been drawn over (by a palm, say). */
      const sky = (x: number, y: number) => {
        if (x < 0 || x >= w || y < 0 || y >= HORIZON) return false;
        const i = y * w + x;
        return bg[i] === 1 && px[i] === snap[i];
      };
      // the brightest stars twinkle and flare
      for (const s of bright) {
        if (skyQ(n, s.y) < 0.85 || !sky(s.x, s.y)) continue;
        const tw = Math.sin(t / 380 + s.ph);
        if (tw < 0.2) continue;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const)
          if (sky(s.x + dx, s.y + dy))
            f.blend(s.x + dx, s.y + dy, P.starHi, tw * 0.6);
      }
      if (gq > 0.3) {
        const g = (gq - 0.3) / 0.7;
        // the town and bridge lamps, and their light across the water
        for (const l of lamps) {
          f.blend(l.x - 1, l.y, P.townLight, 0.3 * g);
          f.blend(l.x + 1, l.y, P.townLight, 0.3 * g);
          f.blend(l.x, l.y - 1, P.townLight, 0.2 * g);
          if (l.y > HORIZON)
            for (let y = l.y + 3; y < l.y + 13; y++)
              if (Math.sin(t / 240 + y * 1.9 + l.x * 0.7) > 0)
                f.blend(
                  l.x,
                  y,
                  P.bridgeLamp,
                  0.5 * g * (1 - (y - l.y - 3) / 10)
                );
        }
        for (const l of islandLights) f.dset(l.x, l.y, P.townLight, g * 1.5);
        // the Sea Candle lit up
        for (let x = candle.x - 1; x <= candle.x + 2; x++)
          f.dset(x, candle.y + 2, P.bridgeLamp, g * 1.4);
      }
      drawBeacon(f, t);
      for (const m of METEORS) {
        const age = a - m.at;
        if (age >= 0 && age < m.dur) meteor(f, age / m.dur, m, sky);
      }
      fxNight.draw(f, t);
      // the two of them, lying back on the mat looking up
      if (n > 0.62) {
        const x0 = coupleX - 1;
        const y0 = WALL - 10;
        sprite(f, STARGAZERS, x0, y0, STARGAZER_COL);
        // "look!": whoever sees a shooting star points it out
        const mh = meteorHead(a);
        if (mh) {
          const who = mh.i === 1 ? [0] : mh.i === 0 ? [1] : [0, 1];
          for (const k of who) {
            const sx = x0 + (k ? 11 : 12);
            const sy = y0 + (k ? 5 : 0);
            const ang = Math.max(
              -0.9,
              Math.min(0.9, Math.atan2(mh.x - sx, sy - mh.y))
            );
            f.line(
              sx,
              sy - 1,
              sx + Math.round(Math.sin(ang) * 5),
              sy - Math.round(Math.cos(ang) * 5),
              P.nArm
            );
            f.set(
              sx + Math.round(Math.sin(ang) * 5),
              sy - Math.round(Math.cos(ang) * 5),
              P.nSkin
            );
          }
        }
      }
    }

    const onTrack = (x: number, y: number) => y >= ROAD_B && y < h;
    const EGG_R = 7;
    const coupleSpot = { x: coupleX + 4, y: WALL - 8 };
    const matSpot = { x: matX, y: WALL - 6 };
    const onCouple = (x: number, y: number) =>
      Math.hypot(x - coupleSpot.x, y - coupleSpot.y) <= EGG_R;
    const onMat = (x: number, y: number) =>
      Math.hypot(x - matSpot.x, y - matSpot.y) <= EGG_R;
    const onCandle = (x: number, y: number) =>
      Math.abs(x - candle.x) <= 4 && y >= candle.y - 3 && y <= candle.y + 22;
    const onSea = (x: number, y: number) =>
      y > HORIZON && y < SHORE && x > capeW;
    const onBeach = (x: number, y: number) => y >= SHORE && y < WALL;
    const onRoad = (x: number, y: number) => y >= WALL && y < ROAD_B;

    return {
      render(f, t) {
        const n = nightN(t);
        f.copyFrom(sky);
        // (the stars egg runs the evening on like a time-lapse: the sun
        // drops, the clouds race, and it all runs back afterwards)
        drawSun(f, 22 * smooth(n * 2.2));
        scrollRows(f, cloudLayer, t / 900 + 140 * n, 0, HORIZON);
        if (n > 0) nightIn(f, nightSky, 0, HORIZON, (y) => skyQ(n, y), false);
        overRows(f, backdrop, HORIZON - 40, SHORE + 3);
        const gq = groundQ(n);
        if (n > 0) {
          nightIn(f, nightSea, HORIZON, SHORE + 3, () => gq, true);
          snap.set(f.pixels.subarray(0, SNAP));
        }
        drawGlints(f, t, n);
        if (n === 0) drawBeacon(f, t);
        drawWaves(f, t);
        drawSurfers(f, t, n);
        overRows(f, front, SHORE, ROAD_B + 3);
        drawBeach(f, t);
        fx.draw(f, t);
        overRows(f, palms, HORIZON - 4, WALL + 2);
        drawRoad(f, t);
        overRows(f, station, ROAD_B - 18, h);
        drawKites(f, t, n);
        const st = crossingState(t);
        const down = gateAngle(t, st.gate);
        // the far signal and gate stand behind the train, on the right of the road
        drawSignal(f, xingX + 12, t, st, false);
        drawGate(f, xingX + 9, PLAT + 1, 17, down, 1);
        const tr = trainAt(t);
        if (tr) drawTrain(f, tr.x, tr.dir, t);
        overRows(f, wires, WIRE - 3, h);
        // and the near ones on the left
        drawGate(f, xingX - 9, h - 6, 18, down, -1);
        drawSignal(f, xingX - 12, t, st, true);
        // a tourist on the near side, phone up for the famous shot
        const ph = xingX - 22;
        f.rect(ph, h - 9, 2, 6, P.person);
        f.set(ph, h - 10, P.person);
        f.set(ph + 1, h - 10, P.person);
        f.line(ph + 2, h - 8, ph + 3, h - 10, P.person);
        f.set(
          ph + 3,
          h - 11,
          st.ringing && tr && Math.floor(t / 300) % 4 === 0 ? P.beacon : P.phone
        );
        fxTop.draw(f, t);
        if (n > 0) {
          grade(f, Math.round(gq * LEVELS));
          drawNight(f, t, n, gq);
        }
        // the egg's kite comes past closer than anything else in the picture
        drawKiteEgg(f, t);
      },
      poke(x, y, t) {
        if (onCandle(x, y)) {
          if (t - beaconAt >= 5000) beaconAt = t;
          return;
        }
        if (onCouple(x, y)) {
          // the kite egg (not while one's already about, or while it's night)
          if (!kiteEgg(t) && !snatching(t) && !starsEgg(t)) kiteAt = t;
          return;
        }
        if (onMat(x, y)) {
          // their mat: it unrolls and they lie back under the stars
          if (!starsEgg(t) && !kiteEgg(t)) starsAt = t;
          return;
        }
        if (onTrack(x, y)) {
          // call a train, or have the one passing flash its lights
          // (and don't restart one that's already ringing its way in)
          if (trainAt(t)) tootAt = t;
          else if (t - calledAt > trainDur + 2600) calledAt = t;
          return;
        }
        if (onRoad(x, y)) {
          if (cyclistP(t) > 1) cyclistAt = t;
          return;
        }
        // (none of these restart while they're still going)
        if (onBeach(x, y)) {
          if (t - dogCalled.t >= 4000)
            dogCalled = { t, x: Math.max(capeW + 4, Math.min(w - 4, x)) };
          return;
        }
        if (onSea(x, y)) {
          // a call holds until the next wave has been ridden in
          if (t - rideCalled.t >= WAVE_T / WAVES + WAVE_T * 0.56)
            rideCalled = { t, x };
          return;
        }
        if (y <= HORIZON) {
          // after dark, a shooting star; otherwise a kite after the snack
          if (nightN(t) > 0.3)
            shootingStar(
              fxNight,
              t,
              x,
              Math.max(2, y - 8),
              P.starHi,
              x < w / 2 ? 1 : -1
            );
          else if (!kiteEgg(t) && !starsEgg(t))
            kiteSnatch(t, x, Math.max(10, y));
        }
      },
      hot(x, y) {
        return (
          y <= HORIZON ||
          onCouple(x, y) ||
          onMat(x, y) ||
          onCandle(x, y) ||
          onSea(x, y) ||
          onBeach(x, y) ||
          onRoad(x, y) ||
          onTrack(x, y)
        );
      },
      eggs(t) {
        const out: EggSpot[] = [];
        // the couple and their snack, while it's there for the taking
        if (!kiteEgg(t) && !snatching(t) && !starsEgg(t))
          out.push({ id: 'kite', x: coupleSpot.x, y: coupleSpot.y, r: EGG_R });
        // their rolled-up mat
        if (!starsEgg(t) && !kiteEgg(t))
          out.push({ id: 'stars', x: matSpot.x, y: matSpot.y, r: EGG_R });
        return out;
      },
    };
  },
};
