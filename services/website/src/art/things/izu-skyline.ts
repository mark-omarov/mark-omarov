// The Izu Skyline, just after the rain: two riders have pulled into a high
// lay-by on the ridge road. The bikes stand on the wet tarmac, their
// helmets on the seats; the two of them lean on the guard rail. Below them
// the wet green ridges fall away to Suruga Bay, cloud lifts off the valleys,
// and across the water Fuji comes out of the last of the rain cloud as the
// light breaks through.
//
// `skylineView(w, h)` paints the still parts once and returns a renderer for
// the view `v` ms after the dip into it began. Also here: the coin-operated
// binoculars (seen from behind, eyepieces towards us) that stand on the
// coast road and at the lay-by's rail.

import { bayer8, Frame, lerpRGB, type RGB, sprite } from '../frame';
import { fbm1, fbm2, hash2, noise1 } from '../noise';
import { canopy } from '../paint';
import { palette } from '../scene';
import { fujisan } from './fuji-mountain';
import {
  FRIEND_BIKE,
  BIKE,
  type BikePalette,
  drawMotorcycle,
} from './motorcycle';

// ---------- the coin binoculars ----------

/**
 * Coin-operated binoculars on a pedestal, from behind: a hooded head with
 * two eyepieces, the coin box under it, a thin post. 9 x 39; the bottom row
 * is the foot. h lit, b body, s shade, E eyepiece, L lens, K yoke,
 * Y coin slot, p post lit, d post shade.
 */
export const SCOPE = [
  '..hhhhh..',
  '.hbbbbbbs',
  'hbbbbbbbs',
  'bEEbbbEEs',
  'bELbbbELs',
  'bbbbbbbbs',
  '.sssssss.',
  '...KKK...',
  '..hbbbs..',
  '..bYbbs..',
  '..bbbbs..',
  '..sssss..',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '...pd....',
  '..hbbs...',
  '.ssssss..',
];
export const SCOPE_W = 9;
export const SCOPE_H = SCOPE.length;
/** The middle of the head, from the sprite's top left. */
export const SCOPE_EYE: readonly [number, number] = [4, 3];

export type ScopeColours = {
  hi: RGB;
  body: RGB;
  sh: RGB;
  eye: RGB;
  lens: RGB;
  yoke: RGB;
  coin: RGB;
  post: RGB;
  postSh: RGB;
};

/** Draws the binoculars with their foot on row `base`, left edge at x. */
export function drawScope(f: Frame, x: number, base: number, c: ScopeColours) {
  sprite(f, SCOPE, x, base - SCOPE_H + 1, {
    h: c.hi,
    b: c.body,
    s: c.sh,
    E: c.eye,
    L: c.lens,
    K: c.yoke,
    Y: c.coin,
    p: c.post,
    d: c.postSh,
  });
}

// ---------- the view ----------

// The same view in two lights: still overcast as the dip begins, and lit
// once the sun breaks through. Every key has its twin in LIT.
const DULL = palette({
  sky0: '#76849a',
  sky1: '#808ea3',
  sky2: '#8c99ac',
  sky3: '#99a5b6',
  sky4: '#a7b1bf',
  sky5: '#b5bec9',
  sky6: '#c4cbd3',
  sky7: '#d0d5da',
  cloudDk: '#4f5868',
  cloud: '#5f6877',
  cloudLt: '#737c8a',
  cloudHi: '#8a929e',
  lining: '#9ba3ae',
  gold: '#929aa6',
  // Fuji, fifty kilometres off across the bay, blue with distance
  snowLit: '#d3d6e0',
  snowMid: '#c3c6d3',
  snowShade: '#adb2c6',
  snowDeep: '#9ba1b9',
  rockLit: '#6d7390',
  rock: '#636a87',
  rockShade: '#5a617e',
  rockDeep: '#525874',
  fForest: '#555f78',
  fForestLit: '#5d6880',
  haze: '#a9b1bd',
  // Suruga Bay
  shore: '#5f6a82',
  shoreLt: '#717b92',
  bay0: '#8f9cab',
  bay1: '#83919f',
  bay2: '#778695',
  bay3: '#6c7b8b',
  streak: '#a4aebb',
  glit: '#b9c2cc',
  // the ridges going down to it, wet and green: far, middle, near
  r1Sh: '#5b6f78',
  r1: '#667c83',
  r1Lit: '#71878b',
  r2Dk: '#24392f',
  r2Sh: '#2c4538',
  r2: '#365242',
  r2Lit: '#43614b',
  r2Hi: '#4f6e54',
  r3Dk: '#101f17',
  r3Sh: '#172b1f',
  r3: '#1f3828',
  r3Lit: '#294631',
  r3Hi: '#36553b',
  mist: '#bfc6cb',
  mistSh: '#a6afb6',
  // the lay-by
  rail: '#c9ced3',
  railMid: '#aab2b9',
  railSh: '#7f8994',
  railDk: '#4f5762',
  post: '#b9c0c6',
  postSh: '#78828d',
  kerb: '#868c94',
  kerbSh: '#535962',
  asph0: '#22252c',
  asph1: '#282c34',
  asph2: '#2e333c',
  sheen: '#3f4752',
  sheenHi: '#525c69',
  skyRef: '#76818f',
  skyRefHi: '#8e99a6',
  paint: '#a9afb4',
  paintWet: '#7a828a',
  drop: '#b8c2cc',
  rim: '#767d8a',
});
type VP = typeof DULL;
const LIT: VP = palette({
  sky0: '#5a84c4',
  sky1: '#6a92cc',
  sky2: '#7fa3d4',
  sky3: '#98b5dc',
  sky4: '#b3c8e3',
  sky5: '#cfdbe8',
  sky6: '#ebeae4',
  sky7: '#fbf0d8',
  cloudDk: '#5d6779',
  cloud: '#76808f',
  cloudLt: '#959eab',
  cloudHi: '#c6ccd4',
  lining: '#fff3d6',
  gold: '#ffd98e',
  snowLit: '#fff8ec',
  snowMid: '#ebe6ee',
  snowShade: '#c3c6de',
  snowDeep: '#aab0cd',
  rockLit: '#9c94b2',
  rock: '#7d82a9',
  rockShade: '#686f99',
  rockDeep: '#5b638d',
  fForest: '#63708f',
  fForestLit: '#7a86a0',
  haze: '#d6dae0',
  shore: '#7d87a8',
  shoreLt: '#9aa3bf',
  bay0: '#9db8d2',
  bay1: '#8aaac8',
  bay2: '#7a9cbe',
  bay3: '#6c8fb2',
  streak: '#c4d6e6',
  glit: '#fff7e2',
  r1Sh: '#6a8b8c',
  r1: '#7d9e95',
  r1Lit: '#a2bf98',
  r2Dk: '#2c573f',
  r2Sh: '#3a6a49',
  r2: '#4d8253',
  r2Lit: '#72a95a',
  r2Hi: '#a9cf70',
  r3Dk: '#163522',
  r3Sh: '#20482c',
  r3: '#2e6236',
  r3Lit: '#4a8742',
  r3Hi: '#82b556',
  mist: '#fbf8ee',
  mistSh: '#e2e8e4',
  rail: '#f4f5f2',
  railMid: '#d8dde0',
  railSh: '#9fa9b2',
  railDk: '#5f6874',
  post: '#e2e6e8',
  postSh: '#949ea8',
  kerb: '#b0b5ba',
  kerbSh: '#6a7079',
  asph0: '#272b33',
  asph1: '#2f343d',
  asph2: '#3b414b',
  sheen: '#5b6676',
  sheenHi: '#8a98a8',
  skyRef: '#afc2d6',
  skyRefHi: '#e6edf2',
  paint: '#dcdfe0',
  paintWet: '#a3acb4',
  drop: '#eef6fb',
  rim: '#ffd894',
});

// the two of them, and the things that don't change with the light
const W = palette({
  sun: '#fffdf2',
  glow: '#ffeec2',
  ray: '#fff1cc',
  edge: '#ffe2a0',
  glint: '#ffffff',
  hair: '#6a5038',
  hairHi: '#9a7650',
  beard: '#7a5a3c',
  skin: '#d9a98a',
  skinSh: '#a87a62',
  hoodie: '#2e2b34',
  hoodieHi: '#4f4957',
  hoodieSh: '#1f1c24',
  hoodieDk: '#121015',
  jeans: '#335895',
  jeansHi: '#5b80bc',
  jeansSh: '#24447a',
  jeansDk: '#182f57',
  shoe: '#1d1c22',
  sole: '#e9e6de',
  friendHair: '#2b211c',
  friendHairHi: '#5b4a3e',
  jacket: '#222329',
  jacketHi: '#3c3e46',
  jacketSh: '#16171b',
  panel: '#5e3436',
  trousers: '#2a2c33',
  trousersSh: '#1d1e23',
  boot: '#141418',
  phone: '#1a1b20',
  screen: '#a9c8ea',
  screenHi: '#ffffff',
  glove: '#1a1a20',
  gloveHi: '#4c4c58',
  scopeHi: '#9fe0c4',
  scope: '#4fae8e',
  scopeSh: '#2f7865',
  scopeEye: '#121419',
  scopeLens: '#c8f0ff',
  scopeYoke: '#3a3f48',
  scopeCoin: '#f2c84a',
  scopePost: '#b7c0c8',
  scopePostSh: '#6f7883',
});

// standing at the rail, from behind: the light is out in front of them, so
// their backs are in shade and a rim of light runs round their heads and
// shoulders. The lead rider: short light-brown hair, an ear and the edge
// of his beard showing (his head is turned a little to the right, towards
// the mountain), the black hoodie with its hood bunched at the neck, blue
// jeans, white-soled sneakers.
// prettier-ignore
const LEAD_STAND = [
  '....rrrr....',
  '...rHHhhH...',
  '..rHHHHhHH..',
  '..rHHHHHHHs.',
  '..rHHHHHHsss',
  '...HHHHHHdd.',
  '....SSSSdS..',
  '...rJqQQQq..',
  '.rrJjqQQQqjJ',
  'rJjjjjqqqjjj',
  'rJjjjjjjjjjq',
  'rjjjjjjjjjjq',
  'rjjjjjjjjjjq',
  'rjjjjjjjjjjq',
  '.jjjjjjjjjq.',
  '.jjjjjjjjjq.',
  '.Jjjjjjjjjq.',
  '.qqqqqqqqqQ.',
  '.NnnnnnnnnO.',
  '.Nnnnnnonno.',
  '.Nnnno.Nnno.',
  '.Nnnno.Nnno.',
  '.Nnnno.Nnno.',
  '.Nnnno.Nnno.',
  '.Nnnno.Nnno.',
  '.Nnnno.Nnno.',
  '.Nnnno.Nnno.',
  '.Nnnno.Nnno.',
  '.Nnnno.Nnno.',
  '.nnnoo.nnno.',
  '.nnnoo.nnnoo',
  '.bbbbb.bbbbb',
  '.66666.66666',
];
// his right arm up, pointing out at the mountain (same origin as above)
// prettier-ignore
const LEAD_POINT = [
  '.................',
  '.................',
  '...............rr',
  '.............rrgg',
  '............rjjg.',
  '..........rrjj...',
  '.........rjjj....',
  '........rjjj.....',
  '........jjj......',
];
// The friend: short dark brown hair, a black riding jacket with the
// oxblood panels over the shoulders, dark trousers, boots
// prettier-ignore
const FRIEND_STAND = [
  '...rrrr....',
  '..rAAaaA...',
  '..rAAAAAA..',
  '..rAAAAAA..',
  '..rAAAAAA..',
  '...AAAAAA..',
  '....SSSs...',
  '..rkPPPPk..',
  '.rPPkkkkPPk',
  'rPPkkkkkkPP',
  'rKkkkkkkkkk',
  'rkkkkkkkkkx',
  'rkPkkkkkPkx',
  'rkPkkkkkPkx',
  '.kkkkkkkkx.',
  '.kkkkkkkkx.',
  '.Kkkkkkkkx.',
  '.xxxxxxxxx.',
  '.tttttttTT.',
  '.ttttTtttT.',
  '.tttT.ttT..',
  '.tttT.ttT..',
  '.tttT.ttT..',
  '.tttT.ttT..',
  '.tttT.ttT..',
  '.tttT.ttT..',
  '.tttT.ttT..',
  '.tttT.ttT..',
  '.tttT.ttT..',
  '.tttT.tttT.',
  '.bbbb.bbbb.',
  '.bbbb.bbbbb',
  '.bbbb.bbbbb',
];
// his right arm up, holding his phone out to the right of his head, its
// screen towards us showing the shot (four rows above the sprite above)
// prettier-ignore
const FRIEND_PHONE = [
  '...........OOOO',
  '...........OssO',
  '...........OsSO',
  '...........OSsO',
  '...........OOOO',
  '............gG.',
  '...........KK..',
  '...........Kk..',
  '..........Kk...',
  '..........Kk...',
  '.........KPk...',
  '.........PP....',
];

// helmets resting on the seats: the lead's matte one with its iridium
// visor, the friend's glossy one
// prettier-ignore
const LEAD_LID = [
  '..1HH..',
  '.1HHHH.',
  '1HHHivV',
  'HHHHVV3',
  '0HHHHu.',
];
// prettier-ignore
const FRIEND_LID = [
  '..12HH.',
  '.1HHHH.',
  '1HHHvvi',
  'HHHHvvV',
  '0HHHHH.',
];

const smooth = (u: number) => {
  const v = Math.max(0, Math.min(1, u));
  return v * v * (3 - 2 * v);
};

/** RGB of a stored pixel. */
const rgbOf = (p: number) =>
  ((p & 0xff) << 16) | (p & 0xff00) | ((p >>> 16) & 0xff);

type Mist = { y0: number; hgt: number; dens: Uint8Array; rise: number };

export type SkylineView = {
  /** Where the binoculars' head is in the view. */
  scope: { x: number; y: number };
  /** Paints the view v ms after the dip into it began. */
  render(f: Frame, v: number): void;
};

/** Paints the still parts of the view once and returns its renderer. */
export function skylineView(w: number, h: number): SkylineView {
  // ----- where everything goes -----
  const BAY = 76; // the far shore, Fuji's foot
  const RAIL = 124; // the foot of the guard rail, the back of the lay-by
  const BEAM = RAIL - 15;
  const FEET = 128; // where the two of them stand
  const fujiX = Math.round(w * 0.64);
  const PEAK = 22;
  const halfBase = Math.round(Math.max(115, Math.min(175, w * 0.36)));
  const sunX = Math.round(w * 0.16);
  const sunY = 14;
  const friendX = Math.round(w * 0.5) + 4; // left edge of his sprite
  const leadX = friendX + 13;
  const leadBike = friendX - 50; // rear axles
  const friendBike = Math.max(10, leadBike - 40);
  const LEAD_G = 146;
  const FRIEND_G = 139;
  const scopeX = leadX + 20;

  // the ridges: a cape running out into the bay under Fuji, a spur coming
  // down from the left, a nearer ridge dipping to a valley behind the two
  // of them, and the wooded slope right under the rail
  const cape = (x: number) => {
    const u = x / w;
    if (u < 0.56) return Infinity;
    const k = 1 - smooth((u - 0.56) / 0.4);
    return BAY + 4 + 20 * k * k + (fbm1(x / 16, 64, 3) - 0.5) * 5;
  };
  const spur = (x: number) =>
    BAY +
    8 +
    30 * smooth((x / w - 0.08) / 0.4) +
    (fbm1(x / 26, 61, 4) - 0.5) * 9;
  const nearR = (x: number) => {
    const u = (x / w - 0.53) / 0.17;
    return 98 + 13 * Math.exp(-u * u) + (fbm1(x / 20, 62, 4) - 0.5) * 8;
  };
  const slope = (x: number) => 111 + (fbm1(x / 14, 63, 3) - 0.5) * 6;

  // the rain cloud's lumps, shared by both lights (the noise is the
  // costly part), already thinned out towards the top and bottom
  const CLOUD_H = 46;
  const cloudN = new Float32Array(w * CLOUD_H);
  for (let y = 0; y < CLOUD_H; y++) {
    const band = Math.max(0, 1 - Math.abs(y - 15) / 24);
    if (band > 0)
      for (let x = 0; x < w; x++)
        cloudN[y * w + x] = fbm2(x / 30, y / 9, 41, 4) * band;
  }

  // ----- far: sky, cloud, Fuji, the bay, the ridges -----
  function paintBack(P: VP, lit: boolean) {
    const f = new Frame(w, h);
    const SKY = [
      P.sky0,
      P.sky1,
      P.sky2,
      P.sky3,
      P.sky4,
      P.sky5,
      P.sky6,
      P.sky7,
    ];
    for (let y = 0; y < BAY; y++)
      for (let x = 0; x < w; x++) {
        const nx = (x - sunX) / (w * 0.55);
        const ny = (y - sunY) / 70;
        const near = Math.max(0, 1 - Math.sqrt(nx * nx + ny * ny));
        const v = Math.min(
          0.999,
          (y / BAY) * 0.78 + near * (lit ? 0.42 : 0.2) + 0.02
        );
        const k = v * SKY.length;
        const i = Math.floor(k);
        // dithered steps between the bands
        const j = k - i > 0.75 && bayer8(x, y) < (k - i - 0.75) * 4 ? i + 1 : i;
        f.set(x, y, SKY[Math.min(SKY.length - 1, j)]!);
      }
    // the rain cloud breaking up: ragged heaps, gold-edged round the gap
    // where the sun is coming through (still shut in the overcast picture)
    const cloudD = (x: number, y: number) => {
      if (x < 0 || x >= w || y < 0 || y >= CLOUD_H) return -1;
      let gap = 0;
      if (lit) {
        const gx = (x - sunX) / 30;
        const gy = (y - sunY) / 13;
        gap = Math.max(0, 1 - Math.sqrt(gx * gx + gy * gy)) * 0.6;
      }
      return cloudN[y * w + x]! - (lit ? 0.3 : 0.25) - gap;
    };
    for (let y = 0; y < CLOUD_H; y++)
      for (let x = 0; x < w; x++) {
        const d = cloudD(x, y);
        if (d <= 0) continue;
        const dx = sunX - x;
        const dy = sunY - y;
        const l = Math.sqrt(dx * dx + dy * dy) || 1;
        const toward = cloudD(
          x + Math.round((dx / l) * 2),
          y + Math.round((dy / l) * 2)
        );
        const sunNear = Math.max(0, 1 - l / (w * 0.5));
        let c = d > 0.13 ? P.cloudDk : d > 0.06 ? P.cloud : P.cloudLt;
        if (toward <= 0)
          c = sunNear > 0.55 ? P.lining : sunNear > 0.3 ? P.gold : P.cloudHi;
        else if (cloudD(x, y + 2) <= 0 && d < 0.08) c = P.cloudLt;
        f.set(x, y, c);
      }
    if (lit)
      // the sun, out from behind the cloud's edge, and its glare
      for (let y = sunY - 14; y <= sunY + 14; y++)
        for (let x = sunX - 18; x <= sunX + 18; x++) {
          const d = Math.hypot(x - sunX, (y - sunY) * 1.15);
          if (d < 4.5) f.set(x, y, W.sun);
          else if (d < 16)
            f.blend(
              x,
              y,
              W.glow,
              (Math.ceil((1 - (d - 4.5) / 11.5) * 4) / 4) * 0.75
            );
        }
    // Fuji across the bay
    const fuji = fujisan(f, fujiX, PEAK, BAY + 2, {
      halfBase,
      style: {
        snowLit: P.snowLit,
        snowMid: P.snowMid,
        snowShade: P.snowShade,
        snowDeep: P.snowDeep,
        rockLit: P.rockLit,
        rock: P.rock,
        rockShade: P.rockShade,
        rockDeep: P.rockDeep,
        forest: P.fForest,
        forestLit: P.fForestLit,
      },
      snow: 0.3,
      fingers: 0.26,
      forest: 0.22,
      seed: 7,
    });
    // haze over its skirt, in steps, thickening down to the water
    for (let y = PEAK + 28; y < BAY + 2; y++) {
      const v = smooth((y - PEAK - 28) / (BAY - PEAK - 26)) * 3;
      for (let x = 0; x < w; x++)
        if (y >= Math.round(fuji(x)))
          f.blend(x, y, P.haze, Math.floor(v + bayer8(x, y)) / 4.5);
    }
    // the bay: the far shore under Fuji, then open water, ruffled by the
    // wind in long lines
    const BAYS = [P.bay0, P.bay1, P.bay2, P.bay3];
    for (let y = BAY; y < h; y++)
      for (let x = 0; x < w; x++) {
        const v = Math.min(0.999, (y - BAY) / 22);
        let c = BAYS[Math.floor(v * BAYS.length)]!;
        const n = fbm1(x / (14 + (y - BAY) * 2) + y * 7.3, 83, 3);
        if (n > 0.66) c = P.streak;
        else if (n < 0.3 && v > 0.2) c = P.bay3;
        f.set(x, y, c);
      }
    for (let x = 0; x < w; x++) {
      const n = noise1(x / 9, 5);
      f.set(x, BAY, n > 0.55 ? P.shoreLt : P.shore);
      if (n > 0.35) f.set(x, BAY + 1, P.shore);
      if (hash2(x, 3, 9) > 0.93) f.set(x, BAY, P.glit); // towns on the far shore
    }
    // the sun's road across the water
    for (let y = BAY + 2; y < h; y++) {
      const half = 2 + (y - BAY) * 0.8;
      for (let x = Math.floor(sunX - half); x <= sunX + half; x++) {
        const e = Math.abs(x - sunX) / half;
        if (hash2(x, y, 17) > 0.4 + e * 0.55)
          f.set(x, y, lit ? P.glit : P.bay0);
      }
    }
    // the ridges, far to near; slopes facing the light catch it
    const ridgeFill = (
      top: (x: number) => number,
      lit2: RGB,
      base: RGB,
      sh: RGB,
      haze: number
    ) => {
      const L = lerpRGB(lit2, P.bay0, haze);
      const B = lerpRGB(base, P.bay0, haze);
      const S = lerpRGB(sh, P.bay0, haze);
      for (let x = 0; x < w; x++) {
        const t0 = top(x);
        if (!Number.isFinite(t0)) continue;
        const y0 = Math.round(t0);
        const sl = top(x + 2) - top(x - 2);
        for (let y = Math.max(0, y0); y < h; y++) {
          const d = y - y0;
          let c = B;
          if (d < 3 && sl > 0.5) c = L;
          else if (d < 4 && sl < -0.7) c = S;
          if (d === 0 && sl > -0.3) c = L;
          f.set(x, y, c);
        }
      }
    };
    ridgeFill(cape, P.r1Lit, P.r1, P.r1Sh, 0.15);
    ridgeFill(spur, P.r2Lit, P.r2, P.r2Sh, 0.3);
    canopy(
      f,
      (x, y) => y >= spur(x) - 1 && y < spur(x) + 9,
      {
        dark: lerpRGB(P.r2Dk, P.bay0, 0.3),
        mid: lerpRGB(P.r2Sh, P.bay0, 0.3),
        light: lerpRGB(P.r2, P.bay0, 0.3),
        hi: lerpRGB(P.r2Lit, P.bay0, 0.3),
      },
      { seed: 70, y0: BAY + 2, y1: 118, size: 1.6, step: 3 }
    );
    ridgeFill(nearR, P.r2Lit, P.r2, P.r2Sh, 0);
    canopy(
      f,
      (x, y) => y >= nearR(x) - 1 && y < nearR(x) + 12,
      { dark: P.r2Dk, mid: P.r2Sh, light: P.r2, hi: P.r2Lit },
      { seed: 71, y0: 90, y1: 124, size: 2.2, step: 3 }
    );
    for (let x = 0; x < w; x++)
      for (let y = Math.round(slope(x)) + 2; y < h; y++) f.set(x, y, P.r3Sh);
    canopy(
      f,
      (x, y) => y >= slope(x) - 1,
      { dark: P.r3Dk, mid: P.r3Sh, light: P.r3, hi: P.r3Lit },
      { seed: 72, y0: 104, y1: RAIL + 4, size: 3, step: 4 }
    );
    return f;
  }

  // ----- near: the rail and the lay-by, the bikes -----
  const bikeF = new Frame(60, 50);
  function paintFront(P: VP, lit: boolean) {
    const f = new Frame(w, h);
    // the tarmac, wet: the sky laid along it in streaks, darker towards us
    for (let y = RAIL; y < h; y++)
      for (let x = 0; x < w; x++) {
        const v = (y - RAIL) / (h - RAIL);
        let c = v < 0.18 ? P.asph2 : v < 0.5 ? P.asph1 : P.asph0;
        const s = fbm1(x / 30 + y * 0.9, 81, 3);
        if (s > 0.62 - (1 - v) * 0.1) c = v < 0.35 ? P.sheenHi : P.sheen;
        f.set(x, y, c);
      }
    f.hline(0, w - 1, RAIL, P.kerb);
    f.hline(0, w - 1, RAIL + 1, P.kerbSh);
    // the parking bays, their paint wet
    for (let bx = (((friendBike - 30) % 46) + 46) % 46; bx < w + 10; bx += 46)
      for (let y = RAIL + 3; y < h; y++) {
        const x = Math.round(bx - (y - RAIL) * 0.35);
        f.set(x, y, y % 5 ? P.paintWet : P.paint);
      }
    // puddles holding the sky
    for (const [px, py, pw] of [
      [w * 0.12, 133, 22],
      [w * 0.74, 141, 30],
      [w * 0.94, 131, 16],
      [scopeX + 8, 134, 18],
    ] as const) {
      for (let dy = -2; dy <= 2; dy++) {
        const half = pw * 0.5 * Math.sqrt(1 - (dy / 2.6) ** 2);
        for (let x = Math.round(px - half); x <= px + half; x++) {
          const e = Math.abs(x - px) / half;
          f.set(x, py + dy, dy < 0 && e < 0.6 ? P.skyRefHi : P.skyRef);
        }
      }
    }
    // the guard rail: a white beam on posts, beaded with rain underneath
    for (let x = 0; x < w; x++) {
      f.set(x, BEAM, P.rail);
      f.set(x, BEAM + 1, P.railMid);
      f.set(x, BEAM + 2, P.railSh);
      f.set(x, BEAM + 3, P.railMid);
      f.set(x, BEAM + 4, P.railDk);
      if (hash2(x, 1, 33) > 0.82) f.set(x, BEAM + 5, P.drop);
    }
    for (let x = 6; x < w; x += 22) {
      f.vline(x, BEAM + 5, RAIL - 1, P.post);
      f.vline(x + 1, BEAM + 5, RAIL - 1, P.postSh);
    }
    // the binoculars at the rail
    drawScope(f, scopeX, RAIL + 2, {
      hi: W.scopeHi,
      body: W.scope,
      sh: W.scopeSh,
      eye: W.scopeEye,
      lens: W.scopeLens,
      yoke: W.scopeYoke,
      coin: W.scopeCoin,
      post: W.scopePost,
      postSh: W.scopePostSh,
    });
    // the bikes on their side stands, helmets on the seats, gleaming wet,
    // with their reflections in the tarmac
    const parked = (x: number, g: number, p0: BikePalette, friend: boolean) => {
      const p: BikePalette = lit
        ? { ...p0, spec: 0xfff4dc, bodyHi: lerpRGB(p0.bodyHi, 0xe8dcc8, 0.3) }
        : p0;
      bikeF.clear();
      drawMotorcycle(bikeF, 12, 44, 0, p, false, { bag: friend });
      bikeF.line(23, 39, 20, 44, p.frame); // the side stand
      sprite(bikeF, friend ? FRIEND_LID : LEAD_LID, friend ? 17 : 16, 18, {
        H: p.helmet,
        '1': p.helmetHi,
        '0': p.helmetSh,
        '2': p.helmetSpec,
        v: p.visor,
        V: p.visorMid,
        u: p.visorDeep,
        i: p.visorHi,
        '3': p.visorPink,
      });
      const ox = x - 12;
      const oy = g - 44;
      for (let k = 1; k <= 14; k++) {
        const ry = g + k;
        if (ry >= h) break;
        if (k % 4 === 3) continue; // broken up by ripples
        const wob = Math.round(Math.sin(k * 1.9) * 0.8);
        for (let xx = 0; xx < 60; xx++) {
          const q = bikeF.pixels[(44 - k + 1) * 60 + xx]!;
          if (q >>> 24) f.blend(ox + xx + wob, ry, rgbOf(q), 0.5 - k * 0.03);
        }
      }
      for (let yy = 0; yy < 50; yy++)
        for (let xx = 0; xx < 60; xx++) {
          const q = bikeF.pixels[yy * 60 + xx]!;
          const tx = ox + xx;
          const ty = oy + yy;
          if (q >>> 24 && tx >= 0 && tx < w && ty < h)
            f.pixels[ty * w + tx] = q;
        }
    };
    parked(friendBike, FRIEND_G, FRIEND_BIKE, true);
    parked(leadBike, LEAD_G, BIKE, false);
    return f;
  }

  const back = [paintBack(DULL, false), paintBack(LIT, true)];
  const front = [paintFront(DULL, false), paintFront(LIT, true)];
  // front's rows start here; above it, it's see-through
  let FRONT_Y0 = 0;
  while (
    FRONT_Y0 < h - 1 &&
    !front[1]!.pixels
      .subarray(FRONT_Y0 * w, FRONT_Y0 * w + w)
      .some((p) => p >>> 24)
  )
    FRONT_Y0++;

  // ----- the light breaking through -----
  // It spreads out from the sun: each pixel's distance from it, in half
  // pixels (stretched downwards, so the ground lights last), with an
  // ordered jitter so the front comes on in a dither.
  const dist = new Uint16Array(w * h);
  const jit = new Int8Array(w * h);
  let farthest = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dy = (y - sunY) * 1.5;
      const d = Math.sqrt((x - sunX) ** 2 + dy * dy);
      dist[y * w + x] = Math.round(d * 2);
      jit[y * w + x] = Math.round((bayer8(x, y) - 0.5) * 18);
      farthest = Math.max(farthest, d);
    }
  }
  // shafts of light fanning down from the gap, as a weight per pixel
  const rays = new Uint8Array(w * h);
  for (let y = sunY + 8; y < RAIL; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - sunX;
      const dy = y - sunY;
      const ang = Math.atan2(dx, dy); // 0 straight down, + to the right
      if (ang < -0.6 || ang > 1.15) continue;
      const band = noise1(ang * 10 + 3, 91) * 0.7 + noise1(ang * 25, 92) * 0.3;
      if (band < 0.48) continue;
      const len = Math.hypot(dx, dy);
      const edge = Math.min(1, (ang + 0.6) / 0.3, (1.15 - ang) / 0.4);
      const fall = Math.max(0, 1 - len / (h * 1.05));
      rays[y * w + x] =
        Math.ceil(((band - 0.48) / 0.52) * edge * fall * 3) * 80;
    }
  }
  // the cloud lying across Fuji's flanks, and the mist in the valleys
  const mistBand = (
    y0: number,
    hgt: number,
    seed: number,
    rise: number,
    cover: number,
    x0: number,
    x1: number,
    sx = 16
  ): Mist => {
    const dens = new Uint8Array(w * hgt);
    for (let y = 0; y < hgt; y++)
      for (let x = Math.max(0, Math.round(x0)); x < Math.min(w, x1); x++) {
        const v = y / hgt;
        // flat underneath, heaped on top, frayed at the ends
        const prof = Math.sin(Math.PI * Math.min(1, 0.15 + v * 1.1)) ** 0.7;
        const ends = Math.min(1, (x - x0) / 26, (x1 - x) / 26);
        const n = fbm2(x / sx, y / 4, seed, 4);
        const d = (n * prof * ends - (1 - cover) * 0.55) * 2.1;
        dens[y * w + x] = Math.max(0, Math.min(255, Math.round(d * 255)));
      }
    return { y0, hgt, dens, rise };
  };
  const veil = mistBand(
    PEAK + 13,
    22,
    101,
    16,
    0.8,
    fujiX - halfBase * 0.75,
    fujiX + halfBase * 0.75,
    22
  );
  const mists = [
    mistBand(BAY + 2, 12, 102, 7, 0.66, w * 0.5, w),
    mistBand(BAY + 12, 16, 103, 9, 0.64, 0, w * 0.5),
    mistBand(94, 18, 104, 12, 0.7, w * 0.25, w * 0.85),
  ];

  /** Draws a mist band risen and thinned by u (0..1), lit where the light has got to. */
  function drawMist(f: Frame, m: Mist, u: number, drift: number, Rq: number) {
    const lift = Math.round(m.rise * u);
    const thr = 30 + u * 225;
    const sh = Math.round(drift);
    for (let y = 0; y < m.hgt; y++) {
      const ty = m.y0 + y - lift;
      if (ty < 0 || ty >= h) continue;
      const top = y < m.hgt * 0.55;
      for (let x = 0; x < w; x++) {
        const sx = x - sh;
        if (sx < 0 || sx >= w) continue;
        const d = m.dens[y * w + sx]!;
        if (d <= thr) continue;
        const a = Math.min(1, (d - thr) / 60);
        if (a < 0.66 && bayer8(x, ty) >= a * 1.5) continue;
        const i = ty * w + x;
        const P = dist[i]! + jit[i]! < Rq ? LIT : DULL;
        f.pixels[i] = 0;
        f.set(x, ty, a > 0.5 && top ? P.mist : P.mistSh);
      }
    }
  }

  function drawPeople(f: Frame, v: number, rim: RGB) {
    const top = FEET - LEAD_STAND.length + 1;
    sprite(f, FRIEND_STAND, friendX, top, {
      r: rim,
      A: W.friendHair,
      a: W.friendHairHi,
      S: W.skinSh,
      s: W.skin,
      k: W.jacket,
      K: W.jacketHi,
      x: W.jacketSh,
      P: W.panel,
      t: W.trousers,
      T: W.trousersSh,
      b: W.boot,
    });
    if (v > 2300 && v < 6600)
      // the shot on his screen
      sprite(f, FRIEND_PHONE, friendX, top - 5, {
        O: W.phone,
        s: W.screen,
        S: W.screenHi,
        k: W.jacket,
        K: rim,
        P: W.panel,
        g: W.glove,
        G: W.gloveHi,
      });
    sprite(f, LEAD_STAND, leadX, top, {
      r: rim,
      H: W.hair,
      h: W.hairHi,
      d: W.beard,
      s: W.skin,
      S: W.skinSh,
      q: W.hoodieSh,
      Q: W.hoodieDk,
      j: W.hoodie,
      J: W.hoodieHi,
      n: W.jeans,
      N: W.jeansHi,
      o: W.jeansSh,
      O: W.jeansDk,
      b: W.shoe,
      '6': W.sole,
    });
    if (v > 3300 && v < 5900)
      sprite(f, LEAD_POINT, leadX, top, { j: W.hoodie, r: rim, g: W.glove });
  }

  return {
    scope: {
      x: scopeX + SCOPE_EYE[0],
      y: RAIL + 2 - SCOPE_H + 1 + SCOPE_EYE[1],
    },
    render(f: Frame, v: number) {
      // the light front: out from the sun from 1.3 s, everywhere by 4.4 s
      const R = smooth((v - 1300) / 3100) * (farthest + 14);
      const Rq = R * 2;
      const dp = f.pixels;
      const b0 = back[0]!.pixels;
      const b1 = back[1]!.pixels;
      for (let i = 0; i < dp.length; i++)
        dp[i] = dist[i]! + jit[i]! < Rq ? b1[i]! : b0[i]!;
      // the veil lifts off Fuji; the valleys steam and the mist goes up
      const lift = smooth((v - 500) / 3800);
      if (lift < 1) drawMist(f, veil, lift, v * 0.002, Rq);
      for (let i = 0; i < mists.length; i++)
        drawMist(
          f,
          mists[i]!,
          Math.min(1, 0.05 + v / 9500 + i * 0.04),
          v * (0.0012 + i * 0.0008),
          Rq
        );
      // shafts of light once the gap is open
      const shaft =
        smooth((v - 1500) / 1600) * (1 - 0.3 * smooth((v - 6400) / 1200));
      if (shaft > 0.01)
        for (let i = (sunY + 8) * w; i < RAIL * w; i++) {
          const r = rays[i]!;
          if (r && dist[i]! < Rq) {
            const p = dp[i]!;
            dp[i] = 0xff000000;
            f.blend(
              i % w,
              (i / w) | 0,
              lerpRGB(rgbOf(p), W.ray, ((shaft * r) / 240) * 0.42),
              1
            );
          }
        }
      // the patch of bay under the gap glitters
      if (shaft > 0.01) {
        const fr = Math.floor(v / 120);
        for (let y = BAY + 2; y < h; y++) {
          const half = 3 + (y - BAY) * 1.1;
          for (
            let x = Math.max(0, Math.floor(sunX - half));
            x <= Math.min(w - 1, sunX + half);
            x++
          ) {
            const i = y * w + x;
            if (b1[i] !== dp[i]) continue; // only open, lit water
            const c = rgbOf(dp[i]!);
            if (
              c !== LIT.bay0 &&
              c !== LIT.bay1 &&
              c !== LIT.bay2 &&
              c !== LIT.bay3 &&
              c !== LIT.streak &&
              c !== LIT.glit
            )
              continue;
            if (hash2(x, y * 7 + fr, 23) > 0.84) f.set(x, y, W.glint);
          }
        }
      }
      // the bright edge of the light as it travels
      if (R > 0 && R < farthest + 10) {
        const lo = Rq;
        const hi = Rq + 14;
        for (let i = 0; i < dp.length; i++) {
          const d = dist[i]! + jit[i]!;
          if (d >= lo && d < hi) {
            const p = dp[i]!;
            dp[i] = (p & 0x00ffffff) | 0xff000000;
            f.blend(i % w, (i / w) | 0, W.edge, 0.32 * (1 - (d - lo) / 14));
          }
        }
      }
      // the rail, the lay-by and the bikes
      const fp0 = front[0]!.pixels;
      const fp1 = front[1]!.pixels;
      for (let i = FRONT_Y0 * w; i < dp.length; i++) {
        const p = dist[i]! + jit[i]! < Rq ? fp1[i]! : fp0[i]!;
        if (p >>> 24) dp[i] = p;
      }
      const litPeople = dist[FEET * w - 30 * w + leadX]! < Rq;
      drawPeople(f, v, litPeople ? LIT.rim : DULL.rim);
      // the wet road glistening: sparkles come and go, more once it's lit
      const n = Math.round(w * (0.06 + 0.3 * shaft));
      for (let i = 0; i < n; i++) {
        const per = 500 + hash2(i, 1, 51) * 600;
        const ph = v / per + hash2(i, 2, 51);
        const cyc = Math.floor(ph);
        const a = ph - cyc;
        if (a > 0.4) continue;
        const x = Math.floor(hash2(i, cyc, 52) * w);
        const y =
          RAIL + 3 + Math.floor(hash2(i, cyc, 53) ** 1.6 * (h - RAIL - 3));
        const k = Math.sin((a / 0.4) * Math.PI);
        f.blend(x, y, W.glint, k);
        if (k > 0.7) {
          f.blend(x - 1, y, W.glint, 0.5);
          f.blend(x + 1, y, W.glint, 0.5);
          f.blend(x, y - 1, W.glint, 0.4);
          f.blend(x, y + 1, W.glint, 0.4);
        }
      }
      // drops running off the rail
      for (let i = 0; i < Math.round(w / 30); i++) {
        const x = Math.floor(hash2(i, 1, 61) * w);
        const per = 900 + hash2(i, 2, 61) * 900;
        const a = ((v + hash2(i, 3, 61) * per) % per) / per;
        const y = BEAM + 5 + Math.round(a * a * 14);
        if (y < RAIL) f.set(x, y, LIT.drop);
      }
    },
  };
}
