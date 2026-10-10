// Kyiv in May: St Michael's Golden-Domed Monastery on a bright spring day.
// The sky-blue baroque cathedral with its cluster of gold domes, the bell
// tower over the monastery gate, chestnuts in full bloom with their white
// candles, tulips along the wall, and the cobbled square in front: pigeons,
// an old lady feeding them from a bench, a balloon seller, people strolling.
//
// Click the pigeons to send them looping round the square, the bell tower to
// ring the bell, a chestnut to shake its blossom down, the domes to make the
// gold flash, the balloon seller to let a balloon go.
//
// Easter eggs:
// - balloon: the seller's bunch swells up and carries him off over the
//   square, legs kicking, and sets him back down again.
// - backpack: a young man with a big backpack sits alone on a bench, hood
//   up, imagining a night at a station; the two old ladies come over, hand
//   him a bun, and he walks off with them through the gate carrying their
//   bags.
// - metro: the little entrance pavilion takes the camera underground, down
//   one of the deepest escalators in the world with the young man, to the
//   platform as a train bursts in.

import { bayer, Frame, lerpRGB, type RGB, sprite } from '../frame';
import { flock, Fx } from '../fx';
import { fbm1, hash2 } from '../noise';
import { canopy, glow, gradient } from '../paint';
import {
  type EggSpot,
  layer,
  palette,
  type Pointer,
  type Scene,
} from '../scene';
import { LAD, METRO, metroView } from '../things/kyiv-metro';

const P = palette({
  sky0: '#2a6bd6',
  sky1: '#3a7fe0',
  sky2: '#4f93e8',
  sky3: '#6aa8ee',
  sky4: '#8cc0f3',
  sky5: '#b4d8f7',
  cloudHi: '#ffffff',
  cloud: '#ecf4fd',
  cloudSh: '#c4d7f0',
  cloudDeep: '#a2bce4',
  hill: '#a8c8e6',
  parkHi: '#9ccc82',
  parkLit: '#74b06e',
  park: '#56946a',
  parkDark: '#40785e',
  // walls
  wallHi: '#9fd8f6',
  wall: '#64b2ea',
  wallSh: '#4692d6',
  wallDeep: '#3270bc',
  trim: '#fbfaf3',
  trimSh: '#d2dcec',
  trimDeep: '#a6b8d6',
  glass: '#1c3262',
  glassHi: '#5a84c6',
  roof: '#a9c0d4',
  roofSh: '#8299b4',
  door: '#6a4430',
  doorDark: '#432a20',
  // gold
  goldHi: '#fffbd6',
  goldLight: '#ffe27c',
  gold: '#f7be3a',
  goldMid: '#df962a',
  goldSh: '#b16a1e',
  icon: '#26407a',
  // belfry
  belfryDark: '#122452',
  belfry: '#1d3466',
  beam: '#4a3426',
  bell: '#d79b38',
  bellHi: '#f6d27a',
  bellSh: '#9a6224',
  // ground
  stoneHi: '#efe8d8',
  stone: '#dcd2bd',
  stone2: '#d0c5ad',
  stone3: '#c8b9a0',
  stoneSh: '#b9ac94',
  joint: '#9e9179',
  granite: '#c9a898',
  graniteHi: '#dcbcac',
  shade: '#5e6c9e',
  grass: '#5aa84a',
  grassHi: '#8cca5a',
  grassSh: '#3b8442',
  tulipRed: '#ee3b36',
  tulipRedSh: '#b8242c',
  tulipYellow: '#ffd23c',
  tulipPink: '#ff8fb4',
  curb: '#f0ece2',
  curbSh: '#c9c2b2',
  // chestnut
  leafHi: '#a2d45c',
  leafLit: '#64ad4a',
  leaf: '#3a8a46',
  leafSh: '#276a3e',
  leafDeep: '#184a36',
  candle: '#fffcf4',
  candleSh: '#e4d6dc',
  candlePink: '#f0849c',
  candleYellow: '#ffcc48',
  bark: '#5e4a3e',
  barkHi: '#88715c',
  barkSh: '#3a2c28',
  // life
  pigeon: '#a6acbe',
  pigeonHi: '#d0d4e0',
  pigeonWing: '#7c849a',
  pigeonDark: '#4e566e',
  pigeonNeck: '#47a08c',
  pigeonBrown: '#a07a64',
  feet: '#e0706a',
  dove: '#f6f7fb',
  doveSh: '#c9cfdc',
  swift: '#2a2c40',
  skin: '#eab896',
  hairDark: '#3a2a24',
  hairBrown: '#7a4a2c',
  hairBlonde: '#e2b85a',
  coatRed: '#d8423a',
  coatYellow: '#f2b83c',
  coatTeal: '#2c9a98',
  coatWhite: '#f2eee6',
  coatPink: '#f08ab0',
  coatNavy: '#2c3c70',
  coatBrown: '#6a4a3a',
  denim: '#4a64a4',
  trousers: '#3a3a4c',
  scarf: '#d8343e',
  scarfHi: '#ffd04a',
  pram: '#3c4a7a',
  pramHi: '#5a6aa0',
  wheel: '#24242e',
  bench: '#3f7a46',
  benchHi: '#5a9a5a',
  iron: '#24323a',
  ironHi: '#3e5058',
  lampGlass: '#f8f4e2',
  crumb: '#f4e2b0',
  balloonRed: '#f0443c',
  balloonYellow: '#ffd640',
  balloonBlue: '#3a8cf0',
  balloonPink: '#ff8ac0',
  balloonGreen: '#5cc85a',
  balloonHi: '#fff6f0',
  string: '#9aa6b8',
  // the second old lady, her string bag, the bun
  coatPlum: '#7c4a78',
  coatPlumSh: '#5e3460',
  greyHair: '#b8b8c2',
  greyHairHi: '#e2e2ea',
  netBag: '#c8b48a',
  loaf: '#d89a4a',
  greens: '#5cb04a',
  bun: '#d8913a',
  bunHi: '#f6cc78',
  bunSh: '#a8642a',
  // moods: a cold lonely blue, then a warm glow, and hearts
  lonely: '#34406c',
  warm: '#ffb860',
  warmHi: '#fff0c8',
  heart: '#ff5a7a',
  heartHi: '#ffd0dc',
  heartSh: '#c8304a',
  // the thought bubble and its picture of a night at the station
  bubble: '#ffffff',
  bubbleEdge: '#3a4268',
  night: '#1f2a52',
  nightHi: '#2c3a68',
  picto: '#d6e0f4',
  pictoTrain: '#7ccad6',
  pictoTrainSh: '#4a8ea0',
  pictoHoodie: '#8a96c8',
  pictoJeans: '#5a78c0',
  pictoWin: '#ffe08a',
  moon: '#ffe9a0',
  // the metro pavilion
  pav: '#efe8d8',
  pavSh: '#cfc6b2',
  pavDeep: '#a99f8a',
  pavRoof: '#5f7480',
  pavRoofHi: '#8aa0aa',
  pavStair: '#7a5a44',
  pavIn: '#2a1a14',
  pavGlow: '#ffc46a',
  pavStep: '#ffe2a2',
  pavStepSh: '#c88a46',
});

const smooth = (u: number) => {
  const c = Math.min(1, Math.max(0, u));
  return c * c * (3 - 2 * c);
};

const rgbOf = (c: RGB) => [c >>> 16, (c >>> 8) & 0xff, c & 0xff] as const;

/** Blends (r, g, b) over pixel i at alpha a; a quick f.blend for whole-frame light. */
function mix(
  px: Uint32Array,
  i: number,
  r: number,
  g: number,
  b: number,
  a: number
) {
  const p = px[i]!;
  const pr = p & 0xff;
  const pg = (p >>> 8) & 0xff;
  const pb = (p >>> 16) & 0xff;
  px[i] =
    (0xff000000 |
      ((pb + (b - pb) * a) << 16) |
      ((pg + (g - pg) * a) << 8) |
      (pr + (r - pr) * a)) >>>
    0;
}

const WALL_TONES = new Set([P.wallHi, P.wall, P.wallSh, P.wallDeep]);

const BASE = 118; // foot of the bell tower and the monastery wall
const CBASE = 112; // foot of the cathedral, set back behind the wall
const WALL_TOP = 109;
const BED = 122; // flower bed along the wall, then the square
const EYE = 97; // eye level, for the paving's perspective

type Dome = {
  x: number;
  top: number;
  bottom: number;
  half: number;
  hx: number;
  hy: number;
};
type Clump = { x: number; y: number; r: number };
type Tree = {
  x: number;
  cy: number;
  rw: number;
  rh: number;
  base: number;
  clumps: Clump[];
  front: boolean;
};

/** Onion profile, 0 at the base ring to 1 at the tip: swells, then pinches to a point. */
function onionHalf(v: number) {
  if (v < 0.3) return 0.82 + 0.18 * Math.sin(((v / 0.3) * Math.PI) / 2);
  const u = (v - 0.3) / 0.7;
  return Math.pow(Math.cos((u * Math.PI) / 2), 1.45);
}

/** Polished gold lit from the upper left: inset highlight, dark core, reflected rim. */
function goldAt(l: number, v: number, bottom: boolean): RGB {
  if (bottom) return l < -0.3 ? P.goldMid : P.goldSh;
  if (l > -0.66 && l < -0.3 && v > 0.16 && v < 0.62) return P.goldHi;
  if (l < -0.8) return P.goldMid;
  if (l < -0.08) return P.goldLight;
  if (l < 0.36) return P.gold;
  if (l < 0.76) return P.goldMid;
  return P.goldSh;
}

/** Gold onion dome standing on `base`; returns the y of its tip. */
function onion(
  f: Frame,
  cx: number,
  base: number,
  R: number,
  H: number,
  cut = 1
) {
  let tip = base;
  for (let i = 0; i < H; i++) {
    const v = (i + 0.5) / H;
    if (v > cut) break;
    const half = R * onionHalf(v);
    const hw = Math.round(half);
    for (let dx = -hw; dx <= hw; dx++)
      f.set(cx + dx, base - i, goldAt(dx / (half + 0.6), v, i === 0));
    tip = base - i;
  }
  return tip;
}

/** Orthodox cross: upright, short top bar, main bar and the slanted foot bar. */
function cross(f: Frame, x: number, tip: number, big: boolean) {
  if (big) {
    f.vline(x, tip, tip + 7, P.goldLight);
    f.hline(x - 1, x + 1, tip + 1, P.goldLight);
    f.hline(x - 2, x + 2, tip + 3, P.goldLight);
    f.set(x + 2, tip + 3, P.goldMid);
    f.set(x - 1, tip + 6, P.goldMid);
    f.set(x + 1, tip + 5, P.goldMid);
    f.set(x, tip + 7, P.goldMid);
  } else {
    f.vline(x, tip, tip + 5, P.goldLight);
    f.hline(x - 1, x + 1, tip + 2, P.goldLight);
    f.set(x + 1, tip + 2, P.goldMid);
    f.set(x - 1, tip + 4, P.goldMid);
    f.set(x, tip + 5, P.goldMid);
  }
}

/** Cylindrical drum under a dome: shaded round, white pilasters, arched windows. */
function drum(f: Frame, cx: number, top: number, bottom: number, half: number) {
  for (let dx = -half; dx <= half; dx++) {
    const l = dx / (half + 0.5);
    f.vline(
      cx + dx,
      top,
      bottom,
      l < -0.55 ? P.wallHi : l < 0.3 ? P.wall : l < 0.72 ? P.wallSh : P.wallDeep
    );
  }
  const wTop = top + 3;
  const wBot = bottom - 2;
  if (half >= 8) {
    for (const a of [-0.62, 0.62])
      f.vline(
        cx + Math.round(Math.sin(a) * half),
        top + 1,
        bottom,
        a < 0 ? P.trim : P.trimSh
      );
    f.rect(cx - 1, wTop + 1, 3, wBot - wTop - 1, P.glass);
    f.set(cx, wTop, P.glass);
    f.set(cx - 1, wTop + 2, P.glassHi);
    for (const s of [-1, 1])
      f.vline(
        cx + s * Math.round(Math.sin(1.15) * half),
        wTop + 1,
        wBot - 1,
        P.glass
      );
  } else if (half >= 4) {
    for (const s of [-1, 1])
      f.vline(
        cx + s * Math.round(half * 0.7),
        top + 1,
        bottom,
        s < 0 ? P.trim : P.trimSh
      );
    f.vline(cx, wTop, wBot, P.glass);
    // wider drums get a three-wide arched window, still centred on the drum
    if (half >= 5)
      for (const s of [-1, 1]) f.vline(cx + s, wTop + 1, wBot, P.glass);
  }
  f.hline(cx - half - 1, cx + half + 1, top, P.trim);
  f.hline(cx - half, cx + half, top + 1, P.trimSh);
  f.hline(cx - half, cx + half, bottom, P.trimSh);
}

/** Drum, dome and cross; returns the dome for glints and clicks. */
function cupola(
  f: Frame,
  cx: number,
  drumTop: number,
  drumBottom: number,
  dh: number,
  R: number,
  H: number,
  lantern: boolean
): Dome {
  drum(f, cx, drumTop, drumBottom, dh);
  const base = drumTop - 1;
  f.hline(cx - Math.round(R * 0.82), cx + Math.round(R * 0.82), base, P.goldSh);
  let tip = onion(f, cx, base - 1, R, H, lantern ? 0.84 : 1);
  if (lantern) {
    // a little lantern drum and a second, tiny onion on top
    f.rect(cx - 1, tip - 4, 3, 4, P.wall);
    f.set(cx - 1, tip - 4, P.wallHi);
    f.vline(cx + 1, tip - 4, tip - 1, P.wallSh);
    f.set(cx, tip - 3, P.glass);
    f.hline(cx - 2, cx + 2, tip - 5, P.trim);
    tip = onion(f, cx, tip - 6, 2.4, 5);
  } else {
    f.set(cx, tip - 1, P.goldMid);
    tip -= 1;
  }
  const ct = tip - (R > 8 ? 8 : 6);
  cross(f, cx, ct, R > 8);
  return {
    x: cx,
    top: ct,
    bottom: drumBottom,
    half: Math.max(dh, R),
    hx: cx - Math.round(R * 0.45),
    hy: base - Math.round(H * 0.4),
  };
}

/** Baroque pilaster with a capital and a base. */
function pilaster(f: Frame, x: number, top: number, bottom: number, w = 2) {
  f.rect(x, top, w, bottom - top, P.trim);
  f.vline(x + w - 1, top + 2, bottom - 3, P.trimSh);
  f.hline(x - 1, x + w, top, P.trim);
  f.hline(x - 1, x + w, bottom - 1, P.trim);
  f.hline(x - 1, x + w, bottom - 2, P.trimSh);
  // the capital's shadow, on the wall only (not in the air past a corner)
  for (const ex of [x - 1, x + w])
    if (f.opaque(ex, top + 1) && WALL_TONES.has(f.get(ex, top + 1)))
      f.set(ex, top + 1, P.wallSh);
}

/** Tall arched window in a white surround, with a sill and a curved hood. */
function archWindow(f: Frame, x: number, y: number, ww: number, wh: number) {
  f.rect(x - 1, y - 1, ww + 2, wh + 2, P.trim);
  f.vline(x + ww, y, y + wh, P.trimSh);
  f.set(x - 1, y - 1, P.wall);
  f.set(x + ww, y - 1, P.wall);
  f.rect(x, y, ww, wh, P.glass);
  f.set(x, y, P.trim);
  f.set(x + ww - 1, y, P.trim);
  f.set(x + 1, y + 1, P.glassHi);
  f.set(x + 1, y + 2, P.glassHi);
  f.hline(x - 2, x + ww + 1, y + wh + 1, P.trim);
  f.hline(x - 1, x + ww, y + wh + 2, P.wallSh);
  f.hline(x - 1, x + ww, y - 3, P.trim);
  f.set(x - 2, y - 2, P.trim);
  f.set(x + ww + 1, y - 2, P.trim);
  f.hline(x, x + ww - 1, y - 2, P.wallSh);
}

/** Half-width of the central baroque gable at height `v` (0 at the cornice, 1 at the top). */
function gableHalf(v: number) {
  if (v < 0.2) return 18;
  if (v < 0.46) {
    const s = (v - 0.2) / 0.26;
    return 18 - 8 * s * s * (3 - 2 * s);
  }
  if (v < 0.64) return 10;
  const c = (v - 0.64) / 0.36;
  return 10 * Math.sqrt(Math.max(0, 1 - c * c));
}

function cathedral(f: Frame, cx: number, base: number, domes: Dome[]) {
  const top = base - 38; // cornice
  const HW = 44;
  const GH = 19; // gable height
  // the big central drum and dome rise behind the gable, the inner pair further back
  domes.push(cupola(f, cx, top - 31, top, 10, 11.5, 22, true));
  for (const s of [-1, 1])
    domes.push(cupola(f, cx + s * 18, top - 15, top - 4, 4, 5.4, 11, false));
  // roof slopes over the wings
  f.poly(
    [
      [cx - HW - 1, top],
      [cx - HW + 5, top - 4],
      [cx + HW - 5, top - 4],
      [cx + HW + 7, top],
    ],
    (x) => (x > cx + HW - 2 ? P.roofSh : P.roof)
  );
  f.hline(cx - HW + 5, cx + HW - 5, top - 4, P.trimSh);
  // the south side, in shade
  f.poly(
    [
      [cx + HW + 1, top],
      [cx + HW + 7, top - 1],
      [cx + HW + 7, base],
      [cx + HW + 1, base],
    ],
    P.wallSh
  );
  f.hline(cx + HW + 1, cx + HW + 7, top, P.trimDeep);
  f.hline(cx + HW + 1, cx + HW + 7, base - 20, P.trimDeep);
  // its windows on the same floors as the front ones
  for (const [y, wh] of [
    [top + 9, 7],
    [base - 14, 9],
  ] as const) {
    f.rect(cx + HW + 3, y, 2, wh, P.wallDeep);
    f.set(cx + HW + 3, y, P.wallSh);
  }
  // facade; the central bay stands forward and catches the light on its left edge
  f.rect(cx - HW, top, HW * 2 + 1, base - top, P.wall);
  f.vline(cx - 16, top, base, P.wallHi);
  f.vline(cx + 16, top, base, P.wallSh);
  // gable: white outline, blue field
  for (let i = 0; i <= GH + 1; i++) {
    const y = top - i;
    const ho = Math.round(gableHalf(Math.min(1, (i - 1) / GH)) + 1);
    if (i > 0) f.hline(cx - ho, cx + ho, y, P.trim);
    const hi = Math.round(gableHalf(i / GH));
    if (i <= GH - 1 && hi > 0) {
      f.hline(cx - hi + 1, cx + hi - 1, y, P.wall);
      f.set(cx + hi - 1, y, P.wallSh);
    }
  }
  for (const s of [-1, 1]) {
    f.set(cx + s * 19, top - 4, P.trim);
    f.set(cx + s * 19, top - 5, P.trimSh);
  }
  // round window and a gilded finial in the gable
  f.disc(cx, top - 10, 3, P.trim);
  f.disc(cx, top - 10, 2, P.glass);
  f.set(cx - 1, top - 11, P.glassHi);
  f.vline(cx, top - GH - 3, top - GH - 1, P.goldLight);
  f.set(cx, top - GH - 3, P.goldHi);
  // entablature across the whole front, and a string course between the tiers
  f.hline(cx - HW - 2, cx + HW + 2, top, P.trim);
  f.hline(cx - HW - 1, cx + HW + 1, top + 1, P.trim);
  f.hline(cx - HW, cx + HW, top + 2, P.trimSh);
  f.hline(cx - HW, cx + HW, top + 3, P.wallSh);
  f.hline(cx - HW, cx + HW, base - 20, P.trim);
  f.hline(cx - HW, cx + HW, base - 19, P.wallSh);
  for (const x of [cx - HW, cx - 31, cx - 18, cx + 17, cx + 30, cx + HW - 1])
    pilaster(f, x, top + 3, base);
  // little urns along the cornice over the pilasters
  for (const x of [cx - HW, cx - 18, cx + 17, cx + HW - 1]) {
    f.rect(x, top - 2, 2, 2, P.trim);
    f.set(x + (x < cx ? 0 : 1), top - 3, P.trim);
    f.set(x + 1, top - 1, P.trimSh);
  }
  // windows, two tiers in each wing
  for (const a of [-39, -26]) {
    for (const s of [-1, 1]) {
      const x = s < 0 ? cx + a : cx - a - 3;
      archWindow(f, x, top + 9, 4, 7);
      archWindow(f, x, base - 14, 4, 9);
    }
  }
  // central portal
  f.rect(cx - 6, base - 18, 13, 18, P.trim);
  f.set(cx - 6, base - 18, P.wall);
  f.set(cx + 6, base - 18, P.wall);
  f.vline(cx + 6, base - 17, base, P.trimSh);
  f.rect(cx - 4, base - 16, 9, 16, P.door);
  f.hline(cx - 3, cx + 3, base - 16, P.doorDark);
  f.set(cx - 4, base - 16, P.trim);
  f.set(cx + 4, base - 16, P.trim);
  f.vline(cx, base - 15, base, P.doorDark);
  f.set(cx - 2, base - 9, P.goldLight);
  f.set(cx + 2, base - 9, P.goldLight);
  f.hline(cx - 7, cx + 7, base - 20, P.trim);
  f.hline(cx - 5, cx + 5, base - 21, P.trim);
  // the mosaic over it: gold ground, a figure in blue
  f.rect(cx - 4, top + 8, 9, 11, P.trim);
  f.rect(cx - 3, top + 9, 7, 9, P.gold);
  f.set(cx - 3, top + 9, P.trim);
  f.set(cx + 3, top + 9, P.trim);
  f.rect(cx - 1, top + 12, 3, 6, P.icon);
  f.set(cx, top + 11, P.goldHi);
  f.set(cx - 2, top + 10, P.goldLight);
  f.hline(cx - 5, cx + 5, top + 20, P.trim);
  // the front pair of domes over the wings
  for (const s of [-1, 1])
    domes.push(cupola(f, cx + s * 31, top - 10, top - 1, 5, 6.6, 13, false));
}

/** Bay pitch of the annexes; their width is a whole number of bays. */
const BAY = 11;

/** A lower monastery building: two floors, hipped roof, one small gold dome. */
function annex(f: Frame, x0: number, x1: number, base: number, domes: Dome[]) {
  const top = base - 24;
  // over the middle pilaster, or the middle window when the bay count is odd
  const cx = Math.floor((x0 + x1) / 2);
  if (x1 - x0 > 46)
    domes.push(cupola(f, cx, top - 12, top - 2, 4, 5.4, 11, false));
  f.poly(
    [
      [x0 - 1, top],
      [x0 + 5, top - 5],
      [x1 - 5, top - 5],
      [x1 + 1, top],
    ],
    P.roof
  );
  f.hline(x0 + 5, x1 - 5, top - 5, P.trimSh);
  f.rect(x0, top, x1 - x0 + 1, base - top, P.wall);
  f.vline(x1, top, base, P.wallSh);
  f.hline(x0 - 1, x1 + 1, top, P.trim);
  f.hline(x0, x1, top + 1, P.trimSh);
  f.hline(x0, x1, top + 12, P.trim);
  // a pilaster at each corner and between bays, a window centred in each bay
  for (let x = x0; x <= x1; x += BAY) pilaster(f, x, top + 2, base, 1);
  for (let x = x0 + 4; x < x1 - 5; x += BAY) {
    for (const y of [top + 5, top + 15]) {
      f.rect(x - 1, y - 1, 5, 7, P.trim);
      f.rect(x, y, 3, 5, P.glass);
      f.set(x, y, P.glassHi);
      f.vline(x + 3, y, y + 5, P.trimSh);
    }
  }
}

function bellTower(
  f: Frame,
  x: number,
  base: number,
  ledges: [number, number][]
) {
  const t1 = base - 44;
  const t2 = t1 - 24;
  const t3 = t2 - 13;
  // each tier: a front, and the east side in shade
  const box = (half: number, top: number, bottom: number, side: number) => {
    f.rect(x - half, top, half * 2 + 1, bottom - top, P.wall);
    f.rect(x + half + 1, top, side, bottom - top, P.wallSh);
    f.vline(x + half + side, top, bottom, P.wallDeep);
  };
  const cornice = (half: number, y: number, side: number) => {
    f.hline(x - half - 1, x + half + side + 1, y, P.trim);
    f.hline(x - half, x + half + side, y + 1, P.trimSh);
    f.hline(x + half + 1, x + half + side + 1, y, P.trimSh);
    f.hline(x - half, x + half, y + 2, P.wallSh);
  };
  // tier 1: the gate, with the sunny courtyard seen through it
  box(14, t1, base, 4);
  for (const px of [x - 14, x - 10, x + 9, x + 13])
    pilaster(f, px, t1 + 2, base);
  for (let dx = -6; dx <= 6; dx++) {
    const u = (dx + 0.5) / 6.5;
    const crown = Math.round(base - 20 - 6 * Math.sqrt(Math.max(0, 1 - u * u)));
    f.set(x + dx, crown - 1, P.trim);
    for (let y = crown; y < base; y++) {
      let c = y < crown + 3 ? P.belfryDark : P.belfry;
      if (y >= base - 10) c = y >= base - 6 ? P.stone : P.wallSh;
      if (y === base - 6) c = P.stoneSh;
      f.set(x + dx, y, c);
    }
  }
  f.rect(x - 1, base - 28, 3, 2, P.trim);
  f.vline(x + 6, base - 20, base, P.trimSh);
  f.rect(x - 4, base - 12, 3, 2, P.leaf);
  f.set(x - 3, base - 13, P.leafLit);
  // an icon over the gate
  f.rect(x - 3, t1 + 6, 7, 9, P.trim);
  f.rect(x - 2, t1 + 7, 5, 7, P.gold);
  f.set(x - 2, t1 + 7, P.trim);
  f.set(x + 2, t1 + 7, P.trim);
  f.rect(x - 1, t1 + 9, 3, 5, P.icon);
  f.set(x, t1 + 8, P.goldHi);
  cornice(14, t1, 4);
  ledges.push([x - 12, t1 - 1], [x + 8, t1 - 1]);
  // tier 2: the belfry
  box(11, t2, t1, 3);
  for (const px of [x - 11, x + 10]) pilaster(f, px, t2 + 2, t1, 2);
  for (let dx = -5; dx <= 5; dx++) {
    const u = dx / 5.5; // symmetric round arch over the bell
    const crown = Math.round(t2 + 9 - 5 * Math.sqrt(Math.max(0, 1 - u * u)));
    f.set(x + dx, crown - 1, P.trim);
    for (let y = crown; y < t1 - 3; y++)
      f.set(x + dx, y, y < crown + 3 ? P.belfryDark : P.belfry);
  }
  f.hline(x - 5, x + 5, t2 + 7, P.beam);
  f.rect(x - 1, t2 + 3, 3, 1, P.trim);
  f.hline(x - 7, x + 7, t1 - 4, P.trim);
  for (let dx = -6; dx <= 6; dx += 2) f.vline(x + dx, t1 - 3, t1 - 2, P.trim);
  f.hline(x - 7, x + 7, t1 - 1, P.trimSh);
  cornice(11, t2, 3);
  ledges.push([x - 9, t2 - 1], [x + 6, t2 - 1]);
  // tier 3: the clock
  box(8, t3, t2, 2);
  f.vline(x - 8, t3 + 2, t2, P.trim);
  f.vline(x + 8, t3 + 2, t2, P.trimSh);
  f.disc(x, t3 + 6, 3.5, P.goldMid);
  f.disc(x, t3 + 6, 2.6, P.trim);
  cornice(8, t3, 2);
  // the baroque pear dome, its lantern, and the cross
  f.hline(x - 7, x + 7, t3 - 1, P.goldSh);
  const dTip = onion(f, x, t3 - 2, 8.5, 18, 0.84);
  f.rect(x - 1, dTip - 4, 3, 4, P.wall);
  f.vline(x + 1, dTip - 4, dTip - 1, P.wallSh);
  f.set(x, dTip - 3, P.glass);
  f.hline(x - 2, x + 2, dTip - 5, P.trim);
  const tip = onion(f, x, dTip - 6, 2.6, 6);
  cross(f, x, tip - 8, true);
  return {
    t1,
    t2,
    t3,
    top: tip - 8,
    clock: [x, t3 + 6] as const,
    bell: [x, t2 + 8] as const,
    domeTop: dTip,
  };
}

/** Lays out the leaf clumps of a horse chestnut's crown. */
function crownOf(tr: Tree, seed: number) {
  const { x: cx, cy, rw, rh } = tr;
  const step = tr.front ? 7 : 5;
  const rr = tr.front ? 5.6 : 3.6;
  const clumps: Clump[] = [];
  for (let gy = cy - rh, row = 0; gy <= cy + rh; gy += step * 0.8, row++) {
    for (let gx = cx - rw; gx <= cx + rw; gx += step) {
      const jx =
        gx + (hash2(gx, gy, seed) - 0.5) * step * 0.8 + (row % 2) * step * 0.5;
      const jy = gy + (hash2(gx, gy, seed + 1) - 0.5) * step * 0.6;
      // a rounded crown, a little flatter underneath
      const ny = (jy - cy) / rh;
      const e = ((jx - cx) / rw) ** 2 + (ny > 0 ? ny * 1.15 : ny) ** 2;
      const ang = Math.atan2(jy - cy, jx - cx);
      if (e > 0.78 + 0.32 * fbm1(ang * 2.2 + 9, seed, 2)) continue;
      clumps.push({
        x: Math.round(jx),
        y: Math.round(jy),
        r: rr * (0.8 + hash2(gx, gy, seed + 2) * 0.45),
      });
    }
  }
  clumps.sort((a, b) => a.y - b.y || a.x - b.x);
  tr.clumps = clumps;
}

/** Horse chestnut: a lumpy crown of big palmate leaves, lit from the upper left, with candles. */
function chestnut(f: Frame, tr: Tree, seed: number) {
  const { x: cx, cy, rw, rh, base, clumps } = tr;
  const big = tr.front;
  // trunk, widening at the roots, and the first big limbs
  const trunkTop = Math.round(cy + rh * 0.2);
  for (let y = trunkTop; y <= base; y++) {
    const tw = big ? (y > base - 3 ? 7 : y > trunkTop + 12 ? 5 : 4) : 2;
    const x0 = cx - (tw >> 1);
    for (let k = 0; k < tw; k++)
      f.set(
        x0 + k,
        y,
        k === 0
          ? P.barkHi
          : k >= tw - 2 && big
            ? P.barkSh
            : k === tw - 1
              ? P.barkSh
              : P.bark
      );
  }
  if (big) {
    for (const [ex, ey, w2] of [
      [-0.5, 0.05, 2],
      [0.55, 0.0, 2],
      [-0.1, -0.45, 2],
      [0.25, -0.3, 1],
    ] as const) {
      for (let k = 0; k < w2; k++)
        f.line(
          cx + k,
          trunkTop + 8,
          cx + rw * ex + k,
          cy + rh * ey,
          k ? P.barkSh : P.bark
        );
    }
  }
  for (const c of clumps) {
    const g = ((c.x - cx) / rw) * 0.45 + ((c.y - cy) / rh) * 0.7;
    f.disc(c.x, c.y, c.r, (dx, dy) => {
      const d = Math.hypot(dx, dy) / (c.r + 0.3);
      const l = (dx * 0.75 + dy) / c.r;
      // a crisp dark rim on the shaded lower right of each clump
      if (d > 0.8 && l > 0.25) return P.leafDeep;
      const v = l * 0.55 + g;
      return v < -0.62
        ? P.leafHi
        : v < -0.18
          ? P.leafLit
          : v < 0.32
            ? P.leaf
            : v < 0.7
              ? P.leafSh
              : P.leafDeep;
    });
    // fingers of the palmate leaves poking out of the lit edge
    if (big && c.y < cy && hash2(c.x, c.y, seed + 4) > 0.5) {
      f.set(c.x - Math.round(c.r) - 1, c.y - 1, P.leafLit);
      f.set(c.x - 1, c.y - Math.round(c.r) - 1, P.leafLit);
    }
  }
  // candles: upright white flower spikes standing over the leaves
  for (const c of clumps) {
    const g = ((c.x - cx) / rw) * 0.45 + ((c.y - cy) / rh) * 0.7;
    if (g > 0.6 || hash2(c.x, c.y, seed + 5) > (big ? 0.78 : 0.72)) continue;
    const x = Math.round(
      c.x - c.r * 0.2 + (hash2(c.x, c.y, seed + 6) - 0.5) * 2
    );
    const y = Math.round(c.y - c.r * 0.5);
    const spot = hash2(c.x, c.y, seed + 7) > 0.45 ? 'p' : 'y';
    const pal = {
      a: g > 0.25 ? P.candleSh : P.candle,
      b: P.candleSh,
      p: P.candlePink,
      y: P.candleYellow,
      s: P.leafSh,
    };
    const tall = hash2(c.x, c.y, seed + 8) > 0.4;
    if (big && tall)
      sprite(
        f,
        ['.a.', 'aa.', '.ab', 'aab', `ab${spot}`, '.s.'],
        x - 1,
        y - 5,
        pal
      );
    else if (big) sprite(f, ['a.', 'ab', `a${spot}`, 's.'], x, y - 3, pal);
    else sprite(f, ['a.', 'ab', `${spot}b`], x, y - 2, pal);
  }
}

/** Fluffy spring cumulus, drawn into a layer that wraps horizontally. */
function cumulus(
  f: Frame,
  puffs: [number, number, number][],
  baseOf: (i: number) => number
) {
  const w = f.w;
  const at = (x: number, y: number) => {
    for (let i = 0; i < puffs.length; i++) {
      const [px, py, r] = puffs[i]!;
      if (y > baseOf(i)) continue;
      let dx = x - px;
      dx -= Math.round(dx / w) * w;
      if (dx * dx + (y - py) * (y - py) * 1.3 < r * r) return i;
    }
    return -1;
  };
  for (let y = 0; y < 70; y++) {
    for (let x = 0; x < w; x++) {
      const i = at(x, y);
      if (i < 0) continue;
      const b = baseOf(i);
      let c = P.cloud;
      if (at(x - 1, y - 2) < 0) c = P.cloudHi;
      else if (y >= b - 1) c = P.cloudSh;
      else if (at(x + 2, y + 2) < 0) c = P.cloudSh;
      else if (y >= b - 3 && at(x + 1, y + 1) >= 0) c = P.cloudSh;
      if (y === b && (x + Math.floor(y / 2)) % 3 !== 0 && at(x, y - 1) >= 0)
        c = P.cloudDeep;
      f.set(x, y, c);
    }
  }
}

/**
 * Granite setts laid in rows across the square, in perspective: rows thin
 * out towards the wall and the joints converge on the middle of the view.
 */
function paving(f: Frame, y0: number, y1: number, vx: number) {
  const DZ = 0.0021; // row depth
  const SW = 0.2; // stone width
  const rowOf = (y: number) => Math.floor(1 / (y + 0.5 - EYE) / DZ);
  const colOf = (x: number, y: number, row: number) =>
    Math.floor(
      (x + 0.5 - vx) / (y + 0.5 - EYE) / SW +
        (row % 2) * 0.5 +
        hash2(row, 0, 3) * 0.3
    );
  for (let y = y0; y < y1; y++) {
    const row = rowOf(y);
    const newRow = rowOf(y - 1) !== row;
    const lastRow = rowOf(y + 1) !== row;
    const rh = DZ * (y - EYE) ** 2;
    for (let x = 0; x < f.w; x++) {
      const col = colOf(x, y, row);
      const band = row % 13 === 0;
      const edge = colOf(x + 1, y, row) !== col;
      const tone = hash2(col, row, 6);
      let c = band
        ? P.granite
        : tone < 0.28
          ? P.stone2
          : tone > 0.88
            ? P.stone3
            : P.stone;
      if (rh < 2.6) {
        // far rows: just a hint of the joints
        if (edge && row % 3 === 0) c = P.stoneSh;
      } else if (lastRow || edge) c = rh < 3.5 ? P.stoneSh : P.joint;
      else if (newRow) c = band ? P.graniteHi : P.stoneHi;
      else if (colOf(x + 2, y, row) !== col) c = band ? P.granite : P.stoneSh;
      f.set(x, y, c);
    }
  }
}

type Walker = {
  offset: number;
  speed: number;
  foot: number;
  top: RGB;
  legs: RGB;
  hair: RGB;
  tall: boolean;
  kind: 'adult' | 'pram' | 'kid';
};

export const kyiv: Scene = {
  id: 'kyiv',
  name: 'Kyiv',
  country: 'Ukraine',
  create(w, h) {
    const fx = new Fx();
    const btX = Math.round(w / 2 - Math.min(72, w * 0.2));
    let ccX = Math.round(w / 2 + Math.min(50, w * 0.13));
    // on some phones only a sliver of park would show between the tower and
    // the cathedral: close it so they stand side by side
    const slit = ccX - 44 - (btX + 18) - 1;
    if (slit > 0 && slit < 6) ccX -= slit;
    const domes: Dome[] = [];
    const ledges: [number, number][] = [];
    let tower: ReturnType<typeof bellTower> | undefined;

    // side buildings of the monastery when the screen is wide enough
    // (trimmed to whole bays, so the pilasters close at both corners)
    const bays = (a: number, b: number) => Math.floor((b - a) / BAY) * BAY;
    const annexes: [number, number][] = [];
    if (btX - 30 > 80) {
      const b = btX - 30;
      annexes.push([b - bays(Math.max(10, b - 110), b), b]);
    }
    if (w - 12 - (ccX + 62) > 70) {
      const a = ccX + 62;
      annexes.push([a, a + bays(a, Math.min(w - 12, a + 110))]);
    }

    // trees: two big ones framing the square, more behind the wall
    const fRW = Math.round(Math.min(38, w * 0.17));
    const trees: Tree[] = [
      {
        x: Math.round(Math.min(btX - 56, w * 0.07)),
        cy: 70,
        rw: fRW,
        rh: 37,
        base: 147,
        clumps: [],
        front: true,
      },
      {
        x: Math.round(Math.max(ccX + 76, w - w * 0.07)),
        cy: 68,
        rw: fRW,
        rh: 38,
        base: 148,
        clumps: [],
        front: true,
      },
    ];
    const keepOut: [number, number][] = [
      [btX - 18, btX + 20],
      [ccX - 50, ccX + 54],
      ...annexes.map(([a, b]): [number, number] => [a + 14, b - 14]),
    ];
    for (let x = 12; x < w; x += 44) {
      const jx = x + Math.round((hash2(x, 0, 21) - 0.5) * 10);
      if (keepOut.some(([a, b]) => jx + 12 > a && jx - 12 < b)) continue;
      trees.push({
        x: jx,
        cy: 93 + Math.round(hash2(x, 1, 21) * 4),
        rw: 14,
        rh: 13,
        base: WALL_TOP + 2,
        clumps: [],
        front: false,
      });
    }
    for (const tr of trees) crownOf(tr, (tr.front ? 70 : 40) + tr.x);

    const lamps: number[] = [];
    if (ccX - 50 - (btX + 20) > 24)
      lamps.push(Math.round((ccX - 50 + btX + 20) / 2));
    if (btX - 62 > 30) lamps.push(btX - 62);
    if (ccX + 70 < w - 50) lamps.push(ccX + 66);

    // the bench, the old lady on it, and her pigeons
    const benchX = ccX - 30;
    const coupleX = btX - 32;
    const pgX = ccX - 10;
    const sellerX = Math.round(Math.min(ccX + 40, w - 16));
    // the lad on the front bench, halfway between the gate and the old
    // lady (moved off the lamp if there's one there), and the metro
    // entrance at the near edge of the square, left of the gate
    const lampMid = Math.round((ccX - 50 + btX + 20) / 2);
    const manX =
      Math.round((btX + benchX) / 2) - (lamps.includes(lampMid) ? 12 : 0);
    const MAN_FOOT = 147;
    const pvX = btX - 30;

    const sky = layer(w, h, (f) => {
      gradient(f, 0, BASE, [P.sky0, P.sky1, P.sky2, P.sky3, P.sky4, P.sky5]);
      f.rect(0, BASE, w, h - BASE, P.sky5);
    });
    const cloudLayer = layer(w, h, (f) => {
      const puffs: [number, number, number][] = [];
      const bases: number[] = [];
      const n = Math.max(3, Math.round(w / 95));
      for (let c = 0; c < n; c++) {
        const cx = ((c + hash2(c, 0, 81) * 0.6) / n) * w;
        const size = 6 + hash2(c, 1, 81) * 8;
        const base = Math.round(
          20 + hash2(c, 2, 81) * 26 + (size < 9 ? 10 : 0)
        );
        const k = 3 + Math.round(size / 3);
        for (let i = 0; i < k; i++) {
          const u = (i / (k - 1)) * 2 - 1;
          const r =
            size *
            (0.5 + 0.55 * (1 - u * u)) *
            (0.85 + hash2(c, i + 3, 81) * 0.3);
          puffs.push([cx + u * size * 1.9, base - r * 0.45, r]);
          bases.push(base);
        }
      }
      cumulus(f, puffs, (i) => bases[i]!);
    });

    const front = layer(w, h, (f) => {
      for (const tr of trees) if (tr.front) chestnut(f, tr, 70 + tr.x);
    });

    const land = layer(w, h, (f) => {
      // the far bank of the Dnipro in the haze, then the park on Volodymyrska Hill
      for (let x = 0; x < w; x++) {
        const top = Math.round(96 - fbm1(x / 40, 7) * 10);
        f.vline(x, top, BASE, P.hill);
        f.set(x, top, P.sky5);
      }
      canopy(
        f,
        (x, y) => y > 102 - fbm1(x / 24, 9) * 12 && y < BASE,
        { dark: P.parkDark, mid: P.park, light: P.parkLit, hi: P.parkHi },
        { seed: 23, y0: 86, y1: BASE + 4, size: 4, step: 4 }
      );
      for (const [a, b] of annexes) annex(f, a, b, CBASE + 2, domes);
      cathedral(f, ccX, CBASE, domes);
      for (const tr of trees) if (!tr.front) chestnut(f, tr, 40 + tr.x);
      // the monastery wall: white coping, blue panels between white posts
      f.rect(0, WALL_TOP, w, BASE - WALL_TOP, P.wall);
      f.hline(0, w, WALL_TOP - 1, P.trim);
      f.hline(0, w, WALL_TOP, P.trimSh);
      f.hline(0, w, WALL_TOP + 1, P.wallSh);
      f.hline(0, w, BASE - 1, P.trimSh);
      for (let x = (btX % 12) - 12; x < w; x += 12) {
        f.rect(x, WALL_TOP - 2, 3, BASE - WALL_TOP + 2, P.trim);
        f.vline(x + 2, WALL_TOP, BASE - 1, P.trimSh);
        f.hline(x - 1, x + 3, WALL_TOP - 2, P.trim);
        f.rect(x + 5, WALL_TOP + 3, 4, 3, P.wallSh);
      }
      tower = bellTower(f, btX, BASE, ledges);
      // flower bed along the wall: tulips in rows, a white kerb
      f.rect(0, BASE, w, BED - BASE, P.grass);
      f.hline(0, w, BASE, P.grassSh);
      for (let x = 0; x < w; x++) {
        // (none on the path through the gate)
        if (Math.abs(x - btX) <= 6) continue;
        for (const [ry, seed] of [
          [BASE, 33],
          [BASE + 2, 34],
        ] as const) {
          if (hash2(x, 3, seed) < 0.3) continue;
          const c = [P.tulipRed, P.tulipRed, P.tulipYellow, P.tulipPink][
            Math.floor(hash2(Math.floor((x + seed) / 9), 4, seed) * 4)
          ]!;
          f.set(x, ry, c);
          f.set(x, ry - 1, c === P.tulipRed ? P.tulipRedSh : c);
          if (hash2(x, 5, seed) > 0.6) f.set(x, ry + 1, P.grassHi);
        }
      }
      f.hline(0, w, BED, P.curb);
      f.hline(0, w, BED + 1, P.curbSh);
      paving(f, BED + 2, h, w / 2);
      // the path through the gate
      for (let y = BASE; y < BED + 2; y++)
        f.hline(btX - 6, btX + 6, y, y === BASE ? P.stoneSh : P.stone);
      for (const lx of lamps) lamp(f, lx, 140);
      bench(f, benchX, 127);
      if (coupleX > 30) bench(f, coupleX, 127);
      // the big trees' shade on the setts: each clump of leaves throws its own patch
      const shade = new Uint8Array(w * h);
      for (const tr of trees) {
        if (!tr.front) continue;
        for (const c of tr.clumps) {
          const sx = tr.x + (c.x - tr.x) * 0.95 + 8;
          const sy = tr.base - 2 + (c.y - tr.cy) * 0.11;
          const rx = c.r * 1.25;
          const ry = Math.max(1.2, c.r * 0.32);
          for (let y = Math.floor(sy - ry); y <= sy + ry; y++)
            for (let x = Math.floor(sx - rx); x <= sx + rx; x++)
              if (
                ((x - sx) / rx) ** 2 + ((y - sy) / ry) ** 2 < 1 &&
                y >= BED + 2 &&
                x >= 0 &&
                x < w &&
                y < h
              )
                shade[y * w + x] = 1;
        }
      }
      for (let i = 0; i < shade.length; i++)
        if (shade[i]) f.blend(i % w, (i / w) | 0, P.shade, 0.3);
    });

    function lamp(f: Frame, x: number, foot: number) {
      f.rect(x - 1, foot - 2, 3, 2, P.iron);
      f.vline(x, foot - 26, foot - 2, P.iron);
      f.vline(x - 1, foot - 6, foot - 3, P.ironHi);
      f.hline(x - 3, x + 3, foot - 24, P.iron);
      for (const s of [-1, 1]) {
        f.rect(x + s * 3 - 1, foot - 29, 3, 4, P.lampGlass);
        f.set(x + s * 3 + 1, foot - 28, P.trimSh);
        f.hline(x + s * 3 - 1, x + s * 3 + 1, foot - 30, P.iron);
      }
      f.rect(x - 1, foot - 31, 3, 5, P.lampGlass);
      f.vline(x + 1, foot - 30, foot - 27, P.trimSh);
      f.hline(x - 1, x + 1, foot - 32, P.iron);
      f.set(x, foot - 33, P.iron);
      for (let k = 1; k < 7; k++) f.blend(x + k, foot, P.shade, 0.25);
    }

    function bench(f: Frame, x: number, foot: number) {
      f.hline(x - 6, x + 6, foot - 8, P.benchHi);
      f.hline(x - 6, x + 6, foot - 6, P.bench);
      f.hline(x - 6, x + 6, foot - 4, P.benchHi);
      f.hline(x - 6, x + 6, foot - 3, P.bench);
      for (const s of [-5, 5]) {
        f.vline(x + s, foot - 8, foot - 1, P.iron);
        f.vline(x + s + 1, foot - 2, foot - 1, P.iron);
      }
      for (let k = -5; k <= 7; k++) f.blend(x + k + 2, foot, P.shade, 0.3);
    }

    const goldSet = new Set([
      P.goldHi,
      P.goldLight,
      P.gold,
      P.goldMid,
      P.goldSh,
    ]);
    const gold: number[] = [];
    let goldX0 = w;
    for (let y = 0; y < CBASE - 20; y++)
      for (let x = 0; x < w; x++)
        if (land.opaque(x, y) && goldSet.has(land.get(x, y))) {
          gold.push(y * w + x);
          goldX0 = Math.min(goldX0, x);
        }
    // the flash lasts until the band has crossed the last gold and the last
    // dome's twinkle has finished, however wide the screen
    let glintLen = 1600;
    for (const p of gold)
      glintLen = Math.max(
        glintLen,
        ((p % w) - ((p / w) | 0) * 0.6 + 55 - goldX0) / 0.24
      );
    for (const d of domes)
      glintLen = Math.max(glintLen, (d.hx - goldX0 + 30) / 0.24 + 270);

    const tops = [
      P.coatRed,
      P.coatYellow,
      P.coatTeal,
      P.coatWhite,
      P.coatPink,
      P.coatNavy,
      P.denim,
    ];
    const hairs = [P.hairDark, P.hairBrown, P.hairBlonde];
    const walkers: Walker[] = Array.from(
      { length: Math.max(4, Math.round(w / 50)) },
      (_, i) => {
        const r = (k: number) => hash2(i, k, 51);
        return {
          offset: r(0) * (w + 40),
          speed: (0.006 + r(1) * 0.006) * (i % 2 ? 1 : -1),
          // (all behind the lad's bench, so nobody walks across him)
          foot: [131, 144, 137, 140][i % 4]!,
          top: tops[Math.floor(r(2) * tops.length)]!,
          legs: r(3) > 0.5 ? P.trousers : P.denim,
          hair: hairs[Math.floor(r(4) * hairs.length)]!,
          tall: r(5) > 0.4,
          kind: i % 7 === 2 ? 'pram' : i % 6 === 4 ? 'kid' : 'adult',
        };
      }
    );

    function sitter(
      f: Frame,
      x: number,
      top: number,
      coat: RGB,
      hair: RGB,
      legs: RGB,
      tilt: number
    ) {
      f.rect(x + tilt, top, 2, 3, hair);
      f.set(x + 1 + tilt, top + 1, P.skin);
      f.rect(x - 1, top + 3, 4, 5, coat);
      f.hline(x + 1, x + 4, top + 7, legs);
      f.vline(x + 4, top + 8, 126, legs);
      f.set(x + 3, top + 5, P.skin);
    }

    function person(
      f: Frame,
      x: number,
      foot: number,
      t: number,
      p: { top: RGB; legs: RGB; hair: RGB; tall: boolean },
      dir: number,
      phase: number
    ) {
      const H = p.tall ? 12 : 11;
      const top = foot - H;
      const step = Math.floor(t / 190 + phase) % 2;
      for (let k = 0; k < 4; k++) f.blend(x + k, foot, P.shade, 0.35);
      f.rect(x, top, 2, 3, p.hair);
      f.set(dir > 0 ? x + 1 : x, top + 1, P.skin);
      f.set(dir > 0 ? x + 1 : x, top + 2, P.skin);
      const body = p.tall ? 5 : 4;
      f.rect(x - 1, top + 3, 4, body, p.top);
      f.set(step ? x - 1 : x + 2, top + 3 + body, P.skin);
      const legTop = top + 3 + body;
      if (step) {
        f.vline(x - 1, legTop + 1, foot - 1, p.legs);
        f.vline(x + 2, legTop + 1, foot - 1, p.legs);
        f.hline(x, x + 1, legTop, p.legs);
      } else {
        f.vline(x, legTop, foot - 1, p.legs);
        f.vline(x + 1, legTop, foot - 1, p.legs);
      }
    }

    // pigeons on the square
    const pigeons = Array.from({ length: w < 300 ? 7 : 10 }, (_, i) => ({
      x: pgX - 14 + Math.round(hash2(i, 0, 61) * 42),
      y: 132 + Math.round(hash2(i, 1, 61) * 10),
      dir: hash2(i, 2, 61) > 0.5 ? 1 : -1,
      phase: hash2(i, 3, 61) * 10,
      body: i % 4 === 3 ? P.pigeonHi : i % 5 === 1 ? P.pigeonBrown : P.pigeon,
    }));
    let flightAt = -Infinity;
    let flightDir = 1;
    const FLIGHT = 6400;

    function groundPigeon(
      f: Frame,
      x: number,
      y: number,
      dir: number,
      peck: boolean,
      body: RGB
    ) {
      const rows = peck
        ? ['......', '.bbbn.', 'twwbbh', '..f.f.']
        : ['....hh', '.bbbn.', 'twwbb.', '..f.f.'];
      sprite(
        f,
        rows,
        x,
        y - 4,
        {
          h: P.pigeonDark,
          b: body,
          n: P.pigeonNeck,
          w: P.pigeonWing,
          t: P.pigeonDark,
          f: P.feet,
        },
        dir < 0
      );
      for (let k = 0; k < 5; k++) f.blend(x + k + 1, y, P.shade, 0.3);
    }
    function flyingBird(
      f: Frame,
      x: number,
      y: number,
      up: boolean,
      body: RGB,
      wing: RGB
    ) {
      x = Math.round(x);
      y = Math.round(y);
      f.hline(x - 1, x + 1, y, body);
      f.set(x, y + 1, body);
      if (up) {
        f.hline(x - 3, x - 2, y - 1, wing);
        f.hline(x + 2, x + 3, y - 1, wing);
        f.set(x - 4, y - 2, wing);
        f.set(x + 4, y - 2, wing);
      } else {
        f.hline(x - 3, x - 2, y + 1, wing);
        f.hline(x + 2, x + 3, y + 1, wing);
        f.set(x - 4, y + 2, wing);
        f.set(x + 4, y + 2, wing);
      }
    }

    // the balloon seller's bunch
    const balloons = [
      [P.balloonRed, -4, -27],
      [P.balloonYellow, 0, -29],
      [P.balloonBlue, 4, -27],
      [P.balloonPink, -6, -23],
      [P.balloonGreen, -2, -24],
      [P.balloonRed, 2, -24],
      [P.balloonYellow, 6, -23],
    ].map(([c, dx, dy]) => ({ c: c!, dx: dx!, dy: dy!, gone: -Infinity }));
    let nextBalloon = 0;
    const BALLOON_BACK = 15_000;

    function balloon(f: Frame, x: number, y: number, c: RGB) {
      x = Math.round(x);
      y = Math.round(y);
      f.rect(x, y + 1, 4, 3, c);
      f.hline(x + 1, x + 2, y, c);
      f.hline(x + 1, x + 2, y + 4, c);
      f.set(x + 1, y + 1, P.balloonHi);
      f.set(x + 2, y + 5, c);
    }

    let bellAt = -Infinity;
    let glintAt = -Infinity;

    function drawBell(f: Frame, t: number) {
      const [bx, by] = tower!.bell;
      const age = t - bellAt;
      const ringing = age < 5200;
      const k = ringing ? Math.exp(-age / 1900) : 0;
      const ang = ringing ? 0.62 * k * Math.sin(age / 170) : 0;
      const cs = Math.cos(ang);
      const sn = Math.sin(ang);
      const pts: [number, number][] = [
        [-1.5, 0],
        [1.5, 0],
        [2.6, 1.5],
        [2.8, 4],
        [4.2, 6.6],
        [-4.2, 6.6],
        [-2.8, 4],
        [-2.6, 1.5],
      ];
      const rot = (px: number, py: number): [number, number] => [
        bx + 0.5 + px * cs - py * sn,
        by + px * sn + py * cs,
      ];
      f.poly(
        pts.map(([px, py]) => rot(px, py)),
        (x, y) => {
          const lx = (x - bx) * cs + (y + 0.5 - by) * sn;
          return lx < -1.2 ? P.bellHi : lx > 1.6 ? P.bellSh : P.bell;
        }
      );
      // the clapper lags behind the swing
      const [kx, ky] = rot(
        ringing ? -Math.sin(age / 170 - 0.6) * 1.5 * k : 0,
        7.2
      );
      f.set(kx, ky, P.bellSh);
    }

    function soundRings(f: Frame, t: number) {
      const age = t - bellAt;
      if (age > 5200) return;
      const [bx, by] = tower!.bell;
      for (let k = 0; k < 8; k++) {
        const a = age - k * 534;
        if (a < 0 || a > 1300) continue;
        const p = a / 1300;
        const r = 14 + p * 34;
        const alpha = 0.7 * (1 - p) * Math.exp(-k * 0.25);
        for (let s = -6; s <= 6; s++) {
          const th = (s / 6) * 0.65;
          for (const side of [-1, 1])
            f.blend(
              bx + side * Math.cos(th) * r,
              by + 3 + Math.sin(th) * r,
              P.trim,
              alpha
            );
        }
      }
    }

    function twinkle(f: Frame, x: number, y: number, p: number, c: RGB) {
      if (p < 0 || p >= 1) return;
      const r = Math.round(1 + Math.sin(p * Math.PI) * 3);
      f.set(x, y, c);
      for (let k = 1; k <= r; k++) {
        const a = 1 - k / (r + 1);
        f.blend(x + k, y, c, a);
        f.blend(x - k, y, c, a);
        f.blend(x, y + k, c, a);
        f.blend(x, y - k, c, a);
      }
    }

    /** One blossom drifting down from a clump of a tree, `s` seconds after it let go. */
    function petal(f: Frame, tr: Tree, i: number, seed: number, s: number) {
      const cl = tr.clumps[Math.floor(hash2(i, 1, seed) * tr.clumps.length)];
      if (!cl || s < 0) return;
      const x0 = cl.x + (hash2(i, 3, seed) - 0.5) * cl.r * 2;
      const y0 = cl.y - cl.r * 0.4;
      const ground = tr.front ? 132 + hash2(i, 4, seed) * 17 : WALL_TOP - 1;
      const fall = 10 + hash2(i, 5, seed) * 9;
      const land = (ground - y0) / fall;
      if (s > land + 1.6) return;
      const tt = Math.min(s, land);
      const x = x0 + Math.sin(tt * 2.6 + i) * 3 + tt * 5;
      const y = y0 + fall * tt;
      const c = i % 3 === 0 ? P.candlePink : P.candle;
      f.set(x, y, c);
      if (s < land) {
        if (Math.floor(s * 6 + i) % 2)
          f.set(x + 1, y, i % 3 === 0 ? P.candle : P.candleSh);
        else f.set(x, y + 1, P.candleSh);
      }
    }

    function blossomFall(t: number, tr: Tree, seed: number) {
      const n = tr.front ? 70 : 24;
      fx.add(t, 7000, (f, age) => {
        for (let i = 0; i < n; i++)
          petal(f, tr, i, seed, age / 1000 - hash2(i, 2, seed) * 1.2);
      });
    }

    const onTree = (x: number, y: number) =>
      trees.find(
        (tr) =>
          ((x - tr.x) / (tr.rw + 3)) ** 2 + ((y - tr.cy) / (tr.rh + 3)) ** 2 <
            1 &&
          (tr.front || y < WALL_TOP)
      );
    const onTower = (x: number, y: number) => {
      const ti = tower!;
      return (
        x >= btX - 15 &&
        x <= btX + 19 &&
        y >= ti.top &&
        y < BASE &&
        (y > ti.t3 || Math.abs(x - btX) < 10)
      );
    };
    const domeAt = (x: number, y: number) =>
      domes.find(
        (d) => Math.abs(x - d.x) <= d.half + 1 && y >= d.top && y <= d.bottom
      );
    const pgBox = [
      Math.min(...pigeons.map((p) => p.x)) - 5,
      Math.max(...pigeons.map((p) => p.x)) + 10,
    ] as const;
    const onPigeons = (x: number, y: number) =>
      x >= pgBox[0] && x <= pgBox[1] && y >= 124 && y <= 145;
    const onSeller = (x: number, y: number) =>
      x >= sellerX - 6 && x <= sellerX + 13 && y >= 96 && y <= 140;
    // a tap anywhere this close to an egg's spot counts as finding it (the
    // viewer gives fingers this much slack), so it sets the egg off too
    const SLACK = 6;
    const near = (x: number, y: number, s: EggSpot) =>
      Math.hypot(x - s.x, y - s.y) <= s.r + SLACK;

    // ---------- easter egg: balloon ----------
    // his bunch swells up and carries him off over the square, legs
    // kicking, and brings him gently back down
    const BUNCH_R = 9;
    const bunch = [sellerX + 4, 105] as const;
    const BUNCH: EggSpot = {
      id: 'balloon',
      x: bunch[0],
      y: bunch[1],
      r: BUNCH_R,
    };
    const FLY = 7400;
    let flyAt = -Infinity;
    const flying = (t: number) => t - flyAt >= 0 && t - flyAt < FLY;
    const DRIFT = Math.max(20, Math.min(Math.round(w * 0.3), sellerX - 34));
    /** Where the flight has him: offset, how high (0..1), how swollen the balloons. */
    function flight(t: number) {
      const a = t - flyAt;
      if (a < 0 || a >= FLY) return { dx: 0, dy: 0, up: 0, s: 1 };
      const up = smooth((a - 400) / 2100) * (1 - smooth((a - 4700) / 2300));
      const across = Math.sin(Math.PI * smooth((a - 600) / 6200));
      const swell = smooth(a / 450) * (1 - smooth((a - 6900) / 450));
      return {
        dx: -Math.round(across * DRIFT + Math.sin(a / 650) * 3 * up),
        dy: -Math.round(up * 64 + Math.sin(a / 420) * 2 * up),
        up,
        s: 1 + swell * 1.15,
      };
    }

    // ---------- easter egg: backpack ----------
    // The lad slumps, hood up, imagining a night on a station bench; the old
    // lady on her bench and a second one from the gate bustle over, wave him
    // in, press a bun on him, and off they all go through the gate with him
    // carrying their shopping, in a warm glow.
    const PACK = {
      bubble: 250,
      full: 800,
      pop: 2300,
      arrive: 2500,
      bun: 2700,
      got: 3000,
      stand: 3400,
      walk: 3500,
      back: 7000,
      end: 8000,
    };
    let packAt = -Infinity;
    const packOn = (t: number) => t - packAt >= 0 && t - packAt < PACK.end;
    const LAD_SPOT: EggSpot = { id: 'backpack', x: manX - 1, y: 139, r: 8 };
    const onLad = (x: number, y: number) =>
      x >= manX - 7 && x <= manX + 6 && y >= MAN_FOOT - 17 && y <= MAN_FOOT;
    /** The render clock, for hot(), which isn't told the time. */
    let now = 0;
    const gBench = benchX - 2; // where she sits
    type Pt = readonly [number, number];
    const lenOf = (pts: Pt[]) => {
      let d = 0;
      for (let i = 1; i < pts.length; i++)
        d += Math.hypot(
          pts[i]![0] - pts[i - 1]![0],
          pts[i]![1] - pts[i - 1]![1]
        );
      return d;
    };
    /** The point `d` px along a path, and which way it's heading there. */
    function walkTo(pts: Pt[], d: number): [number, number, number] {
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1]!;
        const [bx, by] = pts[i]!;
        const len = Math.hypot(bx - ax, by - ay);
        const dir = bx > ax + 0.5 ? 1 : bx < ax - 0.5 ? -1 : 0;
        if (d <= len && len > 0)
          return [ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len, dir];
        d -= len;
      }
      const last = pts[pts.length - 1]!;
      return [last[0], last[1], 0];
    }
    // where everyone goes: the second lady comes out of the gate, the first
    // gets up from her bench; then all three go off through the gate
    const G1_IN: Pt[] = [
      [gBench + 1, 127],
      [manX + 8, MAN_FOOT],
    ];
    const G2_IN: Pt[] = [
      [btX - 1, 116],
      [btX - 1, 128],
      [manX - 10, MAN_FOOT],
    ];
    const OUT = (x0: number, dx: number): Pt[] => [
      [x0, MAN_FOOT],
      [btX + dx, 128],
      [btX + dx, 112],
    ];
    const G1_OUT = OUT(manX + 8, 2);
    const G2_OUT = OUT(manX - 10, -2);
    const LAD_OUT = OUT(manX, 0);
    /** When a bustle starts so that it ends on cue, and how long it takes. */
    const bustle = (pts: Pt[]) => {
      const dur = Math.min(PACK.arrive - 1000, lenOf(pts) / 0.036);
      return [PACK.arrive - dur, dur] as const;
    };
    const [g1From, g1Dur] = bustle(G1_IN);
    const [g2From, g2Dur] = bustle(G2_IN);
    const WALK = 0.016; // px per ms, an easy pace with the shopping

    /** A pixel, or a dithered share of one while someone fades in or out. */
    const dot = (f: Frame, x: number, y: number, c: RGB, al: number) => {
      if (al >= 1 || (al > 0 && bayer(x | 0, y | 0) < al)) f.set(x, y, c);
    };
    const box = (
      f: Frame,
      x: number,
      y: number,
      bw: number,
      bh: number,
      c: RGB,
      al: number
    ) => {
      for (let yy = y; yy < y + bh; yy++)
        for (let xx = x; xx < x + bw; xx++) dot(f, xx, yy, c, al);
    };

    // the old lady in her red headscarf, and the grey-haired one
    type Lady = { scarf: RGB; spot: RGB; coat: RGB; coatSh: RGB; bun: boolean };
    const LADY1: Lady = {
      scarf: P.scarf,
      spot: P.scarfHi,
      coat: P.coatBrown,
      coatSh: P.hairDark,
      bun: false,
    };
    const LADY2: Lady = {
      scarf: P.greyHair,
      spot: P.greyHairHi,
      coat: P.coatPlum,
      coatSh: P.coatPlumSh,
      bun: true,
    };
    /**
     * An old lady on her feet: headscarf, long coat, little steps. `arm`
     * is 0 down, 1 held out (with the bun), 2 and 3 the two halves of a
     * beckoning wave. `bag` 1 is the red shopping bag, 2 the string bag.
     */
    function lady(
      f: Frame,
      x: number,
      foot: number,
      dir: number,
      g: Lady,
      steps: number,
      arm: number,
      bag: number,
      al: number
    ) {
      x = Math.round(x);
      foot = Math.round(foot);
      const bob = steps % 2 && steps >= 0 ? -1 : 0;
      const top = foot - 11 + bob;
      // local column c (facing right) to screen x
      const X = (c: number) => (dir >= 0 ? x + c : x + 1 - c);
      const px = (c: number, y: number, col: RGB) => dot(f, X(c), y, col, al);
      if (al >= 1)
        for (let k = -1; k < 3; k++) f.blend(x + k, foot, P.shade, 0.35);
      for (const c of [-1, 0, 1]) px(c, top, g.scarf);
      px(0, top, g.spot);
      px(-1, top + 1, g.scarf);
      px(0, top + 1, g.scarf);
      px(1, top + 1, P.skin);
      if (g.bun) {
        // grey hair up in a bun, her face showing
        px(-2, top, g.scarf);
        px(-1, top - 1, g.spot);
        px(-1, top + 2, g.scarf);
        px(0, top + 2, P.skin);
        px(1, top + 2, P.skin);
      } else for (const c of [-1, 0, 1]) px(c, top + 2, g.scarf);
      for (let y = top + 3; y < top + 8; y++)
        for (const c of [-1, 0, 1, 2]) px(c, y, c === -1 ? g.coatSh : g.coat);
      for (const c of [-2, -1, 0, 1, 2])
        px(c, top + 8, c === -2 ? g.coatSh : g.coat);
      // legs, stepping when she's on the move
      const legs = steps >= 0 && steps % 2 ? [-1, 2] : [0, 1];
      for (const c of legs) {
        px(c, top + 9, P.trousers);
        px(c, foot - 1, P.trousers);
      }
      if (arm === 1) {
        px(2, top + 4, g.coat);
        px(3, top + 4, g.coat);
        px(4, top + 4, P.skin);
      } else if (arm === 2) {
        px(3, top + 3, g.coat);
        px(3, top + 2, P.skin);
        px(3, top + 1, P.skin);
      } else if (arm === 3) {
        px(3, top + 4, g.coat);
        px(4, top + 4, P.skin);
        px(4, top + 3, P.skin);
      } else px(2, top + 6, P.skin);
      if (bag === 1) {
        for (let y = top + 6; y < top + 9; y++) {
          px(-2, y, P.coatRed);
          px(-3, y, P.coatRed);
        }
        px(-2, top + 5, P.iron);
      } else if (bag === 2) netBag(f, X(-3) - (dir >= 0 ? 0 : 1), top + 5, al);
    }

    /** The string bag: a loaf and some spring onions poking out. */
    function netBag(f: Frame, x: number, y: number, al: number) {
      dot(f, x + 1, y, P.greens, al);
      dot(f, x, y + 1, P.loaf, al);
      dot(f, x + 1, y + 1, P.greens, al);
      for (let yy = y + 2; yy < y + 5; yy++)
        for (let xx = x; xx < x + 2; xx++)
          dot(f, xx, yy, (xx + yy) % 2 ? P.netBag : P.loaf, al);
    }

    function spriteA(
      f: Frame,
      rows: readonly string[],
      x: number,
      y: number,
      pal: Record<string, RGB>,
      al: number
    ) {
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          const c = pal[row[rx]!];
          if (c !== undefined) dot(f, x + rx, y + ry, c, al);
        }
      });
    }

    function bun(f: Frame, x: number, y: number) {
      x = Math.round(x);
      y = Math.round(y);
      f.hline(x, x + 3, y, P.bun);
      f.hline(x + 1, x + 2, y - 1, P.bunHi);
      f.set(x, y, P.bunHi);
      f.hline(x, x + 3, y + 1, P.bunSh);
    }

    // the lad on his bench: as you find him, slumped with his hood up, and
    // cheered up with the bun; his big pack on the bench beside him
    const LAD_PAL: Record<string, RGB> = {
      H: LAD.hair,
      h: LAD.hairHi,
      s: LAD.skin,
      J: LAD.hoodie,
      j: LAD.hoodieLit,
      K: LAD.hoodieSh,
      L: LAD.jeans,
      e: LAD.shoes,
      B: LAD.pack,
      T: LAD.packHi,
      b: LAD.packSh,
      x: LAD.strap,
    };
    const LAD_SIT = [
      '.TT.......',
      'TTTT......',
      'BBBB.hH...',
      'BBBb.Hs...',
      'BBBb.Hs...',
      'BBBbJJjJ..',
      'BBBbJJjJ..',
      'BBBbJJJJs.',
      'BBBbJJJJ..',
      'BBBbJJJJ..',
      'bbbbKJJJ..',
      '....LLLLLL',
      '.........L',
      '.........L',
      '.........L',
      '........ee',
    ];
    const LAD_SLUMP = [
      '.TT.......',
      'TTTT......',
      'BBBB......',
      'BBBb..JJ..',
      'BBBb.JJJJ.',
      'BBBbJJJKs.',
      'BBBbJJJJ..',
      'BBBbJJJJ..',
      'BBBbJJJs..',
      'BBBbJJJJ..',
      'bbbbKJJJ..',
      '....LLLLLL',
      '.........L',
      '.........L',
      '.........L',
      '........ee',
    ];
    const LAD_TOP = MAN_FOOT - 16;

    /** The lad on his feet, pack on his back, a bag in each hand. */
    function ladWalk(
      f: Frame,
      x: number,
      foot: number,
      dir: number,
      steps: number,
      al: number,
      eating: boolean
    ) {
      x = Math.round(x);
      foot = Math.round(foot);
      const top = foot - 14;
      const X = (c: number) => (dir >= 0 ? x + c : x + 1 - c);
      const px = (c: number, y: number, col: RGB) => dot(f, X(c), y, col, al);
      if (al >= 1)
        for (let k = -2; k < 3; k++) f.blend(x + k, foot, P.shade, 0.35);
      // the pack, towering over his head
      for (let y = top; y < top + 10; y++)
        for (const c of [-4, -3, -2])
          px(
            c,
            y,
            y === top
              ? LAD.packHi
              : c === -2 && y > top + 1
                ? LAD.packSh
                : LAD.pack
          );
      px(-3, top - 1, LAD.packHi);
      px(-1, top + 4, LAD.strap);
      px(0, top + 1, LAD.hair);
      px(1, top + 1, LAD.hairHi);
      px(0, top + 2, LAD.hair);
      px(1, top + 2, LAD.skin);
      px(0, top + 3, LAD.hair);
      px(1, top + 3, LAD.skin);
      if (eating) px(2, top + 3, P.bunHi);
      for (let y = top + 4; y < top + 10; y++)
        for (const c of [-1, 0, 1, 2])
          px(c, y, c === 1 ? LAD.hoodieLit : LAD.hoodie);
      const legs = steps % 2 ? [-1, 2] : [0, 1];
      for (let y = top + 10; y < foot; y++)
        for (const c of legs) px(c, y, y === foot - 1 ? LAD.shoes : LAD.jeans);
      // their shopping: the red bag in front, the string bag behind
      px(2, top + 8, LAD.skin);
      for (let y = top + 9; y < top + 12; y++) {
        px(2, y, P.coatRed);
        px(3, y, P.coatRed);
      }
      netBag(f, X(-1) - (dir >= 0 ? 0 : 1), top + 9, al);
    }

    const HEART = ['.r.r.', 'rhrrr', 'rrrrs', '.rrs.', '..s..'];
    const HEART_BIG = [
      '.rr.rr.',
      'rhhrrrr',
      'rhrrrrs',
      'rrrrrrs',
      '.rrrrs.',
      '..rrs..',
      '...s...',
    ];

    /** Where the lad is at age a of the egg, for the hearts and the glow. */
    function ladAt(a: number): Pt {
      if (a < PACK.walk) return [manX, MAN_FOOT];
      const [x, y] = walkTo(LAD_OUT, (a - PACK.walk) * WALK);
      return [x, y];
    }

    /** The whole square's light: cold and lonely, then warm. */
    // distance of every pixel from the lad on his bench, for the cold
    let coldD: Float32Array | undefined;
    function mood(f: Frame, a: number) {
      const [lx, ly] = ladAt(a);
      const cold =
        a < PACK.pop ? smooth(a / 500) : 1 - smooth((a - PACK.pop) / 700);
      const coldR = a * 0.45;
      const warm = warmth(a);
      const warmR = (a - PACK.got) * 0.32;
      if (cold <= 0 && warm <= 0) return;
      if (!coldD) {
        coldD = new Float32Array(w * h);
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++)
            coldD[y * w + x] = Math.hypot(x - (manX - 1), (y - 138) * 1.4);
      }
      const px = f.pixels;
      const [cr, cg, cb] = rgbOf(P.lonely);
      const [wr, wg, wb] = rgbOf(P.warm);
      for (let y = 0; y < h; y++) {
        const wy = ((y - ly + 6) * 1.2) ** 2;
        for (let x = 0, i = y * w; x < w; x++, i++) {
          if (cold > 0) {
            const d = coldD[i]!;
            if (d < coldR && d > 9) {
              const edge = Math.min(1, (coldR - d) / 30);
              // a little pool of light left round him
              const pool = Math.min(1, (d - 9) / 14);
              mix(px, i, cr, cg, cb, 0.5 * cold * edge * pool);
            }
          }
          if (warm > 0) {
            const dd = (x - lx) ** 2 + wy;
            if (dd < warmR * warmR) {
              const edge = Math.min(1, (warmR - Math.sqrt(dd)) / 40);
              mix(px, i, wr, wg, wb, warm * edge * 0.2);
            }
          }
        }
      }
    }

    /** How warm it's got round them: the glow behind them, 0..1. */
    const warmth = (a: number) =>
      a < PACK.got
        ? 0
        : smooth((a - PACK.got) / 500) * (1 - smooth((a - 5800) / 1600));

    // what he's imagining: a night on a bench at a station (pack for a
    // pillow), the lamp, the moon, and a train rolling in in the morning
    const PICTO = [
      '................s.............s....mm...',
      '....s.............................mm....',
      '....................ppp....s......mm....',
      '............s.......lll............mm...',
      '.....................p..................',
      '.....................p..................',
      '.....................p..................',
      '.....................p..................',
      '.....................p..................',
      '.....................p...pppppppppppppp.',
      '.....................p...TT.f...........',
      '.....................p...BBBffhhhhh.jj..',
      '.....................p...Bbbffhhhhhjjjp.',
      '.....................p..pppppppppppppppp',
      '.....................p...p............p.',
      '....................ppp..p............p.',
      'pppppppppppppppppppppppppppppppppppppppp',
    ];
    const PICTO_TRAIN = [
      '.ttttttttttttttt...',
      'tttttttttttttttttt.',
      'ttwwttwwttwwtttwwtt',
      'ttwwttwwttwwtttwwtt',
      'ttttttttttttttttttt',
      'ttttttttttttttttttw',
      'uuuuuuuuuuuuuuuuuuu',
      '..pp..pp...pp..pp..',
    ];
    const PICTO_PAL: Record<string, RGB> = {
      s: P.nightHi,
      m: P.moon,
      p: P.picto,
      l: P.pictoWin,
      t: P.pictoTrain,
      u: P.pictoTrainSh,
      w: P.pictoWin,
      T: LAD.packHi,
      B: LAD.pack,
      b: LAD.packSh,
      f: LAD.skin,
      h: P.pictoHoodie,
      j: P.pictoJeans,
    };
    const BUB_RX = 31;
    const BUB_RY = 17;
    const bubX = Math.max(BUB_RX + 2, Math.min(w - BUB_RX - 3, manX + 4));
    const bubY = 92;

    /** The thought bubble, with its picture of a night at the station. */
    function thought(f: Frame, a: number) {
      if (a < PACK.bubble || a > PACK.pop + 450) return;
      const bx = bubX;
      const by = bubY;
      // the trail of little puffs up from his head
      const midX = Math.round((manX + 2 + bx - 8) / 2);
      const puffs: [number, number, number, number][] = [
        [manX + 1, 127, 1, PACK.bubble],
        [manX + 3, 120, 1.6, PACK.bubble + 130],
        [midX, by + BUB_RY + 3, 2.3, PACK.bubble + 260],
      ];
      if (a >= PACK.pop) {
        // it bursts: little puffs flying out and fading
        const p = (a - PACK.pop) / 450;
        for (let i = 0; i < 16; i++) {
          const ang = (i / 16) * Math.PI * 2 + 0.2;
          const r = 0.75 + p * 0.7;
          const x = bx + Math.cos(ang) * BUB_RX * r;
          const y = by + Math.sin(ang) * BUB_RY * r;
          const pr = 2.6 * (1 - p);
          if (pr < 0.5) continue;
          f.disc(x, y, pr + 1, P.bubbleEdge);
          f.disc(x, y, pr, P.bubble);
        }
        return;
      }
      for (const [px, py, r, at] of puffs) {
        if (a < at) continue;
        f.disc(px, py, r + 1, P.bubbleEdge);
        f.disc(px, py, r, P.bubble);
      }
      const g = (a - PACK.full + 300) / 300;
      if (g <= 0) return;
      // pops up with a little overshoot
      const s = g >= 1 ? 1 : smooth(g) * (1 + 0.15 * Math.sin(g * Math.PI));
      const RX = BUB_RX * s;
      const RY = BUB_RY * s;
      // a cloud: an oval with a ring of round lobes
      const lobes: [number, number, number][] = [];
      for (let k = 0; k < 12; k++) {
        const th = (k / 12) * Math.PI * 2 + 0.13;
        lobes.push([
          bx + Math.cos(th) * RX * 0.8,
          by + Math.sin(th) * RY * 0.74,
          (RY * (k % 2 ? 0.34 : 0.4)) ** 2,
        ]);
      }
      const cloud = (x: number, y: number) => {
        const nx = (x + 0.5 - bx) / RX;
        const ny = (y + 0.5 - by) / RY;
        if (nx * nx + ny * ny < 0.7) return true;
        for (const [lx, ly, rr] of lobes)
          if ((x + 0.5 - lx) ** 2 + (y + 0.5 - ly) ** 2 < rr) return true;
        return false;
      };
      for (let y = Math.floor(by - RY - 3); y <= by + RY + 3; y++) {
        for (let x = Math.floor(bx - RX - 4); x <= bx + RX + 4; x++) {
          if (!cloud(x, y)) continue;
          const edge =
            !cloud(x - 1, y) ||
            !cloud(x + 1, y) ||
            !cloud(x, y - 1) ||
            !cloud(x, y + 1);
          const nx = (x + 0.5 - bx) / (RX * 0.8);
          const ny = (y + 0.5 - by) / (RY * 0.8);
          f.set(
            x,
            y,
            edge ? P.bubbleEdge : nx * nx + ny * ny < 1 ? P.night : P.bubble
          );
        }
      }
      if (s < 0.95) return;
      // the picture, clipped to the dark panel
      const inside = (x: number, y: number) =>
        Math.hypot((x + 0.5 - bx) / (RX * 0.8), (y + 0.5 - by) / (RY * 0.8)) <
        1;
      const draw = (rows: readonly string[], x0: number, y0: number) =>
        rows.forEach((row, ry) => {
          for (let rx = 0; rx < row.length; rx++) {
            const c = PICTO_PAL[row[rx]!];
            if (c !== undefined && inside(x0 + rx, y0 + ry))
              f.set(x0 + rx, y0 + ry, c);
          }
        });
      const x0 = bx - 20;
      const y0 = by - 9;
      draw(PICTO, x0, y0);
      // he's asleep: little bubbles rising off him
      const zz = Math.floor(a / 260) % 4;
      for (let k = 0; k < zz; k++) {
        const zx = x0 + 31 + k * 2;
        const zy = y0 + 8 - k * 2;
        f.set(zx, zy, P.picto);
        if (k === 2) f.set(zx + 1, zy, P.picto);
      }
      // and the train rolls in from the left
      const tx = Math.round(x0 - 22 * (1 - smooth((a - PACK.full) / 800)));
      draw(PICTO_TRAIN, tx, y0 + 8);
    }

    function hearts(f: Frame, a: number) {
      for (let i = 0; i < 10; i++) {
        const born = PACK.got + 60 + i * 260;
        const age = a - born;
        if (age < 0 || age > 2400) continue;
        const [hx, hy] = ladAt(born);
        const spread = (hash2(i, 1, 17) - 0.5) * 26;
        const x = hx + spread + Math.sin(age / 280 + i) * 3;
        const y = hy - 18 - age * 0.024 - (i % 3) * 3;
        if (age > 2000 && Math.floor(age / 70) % 2) continue;
        sprite(f, i % 3 === 1 ? HEART : HEART_BIG, x - 3, y, {
          r: P.heart,
          h: P.heartHi,
          s: P.heartSh,
        });
      }
      // and the burst of sparkle as the bun lands in his hands
      const b = a - PACK.got;
      if (b >= 0 && b < 600) {
        const p = b / 600;
        for (let k = 0; k < 8; k++) {
          const ang = (k / 8) * Math.PI * 2;
          const r = 3 + p * 16;
          const x = manX + 2 + Math.cos(ang) * r;
          const y = LAD_TOP + 7 + Math.sin(ang) * r * 0.8;
          f.set(x, y, k % 2 ? P.warmHi : P.goldLight);
          if (p < 0.6) f.set(x, y - 1, P.warmHi);
        }
      }
    }

    /** Everyone in the backpack egg, at age a (draws the lad's bench too). */
    function packScene(f: Frame, t: number, a: number) {
      bench(f, manX, MAN_FOOT);
      const on = a >= 0 && a < PACK.end;
      const back =
        on && a >= PACK.back ? (a - PACK.back) / (PACK.end - PACK.back) : 1;
      if (!on || a >= PACK.back) {
        spriteA(f, LAD_SIT, manX - 6, LAD_TOP, LAD_PAL, back);
        if (on) benchLady(f, t, false, back);
        return;
      }
      // a warm glow round them once he's got his bun
      const wm = warmth(a);
      if (wm > 0) {
        const [lx, ly] = ladAt(a);
        glow(f, lx, ly - 7, 40, P.warmHi, 0.75 * wm, 0.85, 0.05);
        glow(f, lx, ly - 7, 22, P.warmHi, 0.5 * wm, 0.9, 0.05);
      }
      // the second lady, out of the gate and over to him
      const g2 = a - g2From;
      if (g2 >= 0) {
        let x: number,
          y: number,
          dir: number,
          steps: number,
          arm = 0,
          al = 1;
        if (a < PACK.walk) {
          const d = Math.min(1, g2 / g2Dur) * lenOf(G2_IN);
          [x, y, dir] = walkTo(G2_IN, d);
          steps = g2 < g2Dur ? Math.floor(g2 / 90) : -1;
          if (g2 >= g2Dur) {
            dir = 1;
            if (a < PACK.walk) arm = Math.floor(a / 220) % 2 ? 2 : 3;
          }
          al = Math.min(1, g2 / 250);
        } else {
          const d = (a - PACK.walk) * WALK;
          [x, y, dir] = walkTo(G2_OUT, d);
          steps = Math.floor(a / 190);
          if (dir === 0) dir = -1;
          al = Math.min(1, (y - 113) / 8);
        }
        if (al > 0)
          lady(f, x, y, dir || 1, LADY2, steps, arm, a < PACK.walk ? 2 : 0, al);
      }
      // the lad
      if (a < PACK.stand) {
        sprite(
          f,
          a < PACK.got ? LAD_SLUMP : LAD_SIT,
          manX - 6,
          LAD_TOP,
          LAD_PAL
        );
        if (a >= PACK.got) bun(f, manX + 1, LAD_TOP + 7);
      } else {
        const d = a < PACK.walk ? 0 : (a - PACK.walk) * WALK;
        const [x, y, dir] = walkTo(LAD_OUT, d);
        const al = Math.min(1, (y - 113) / 8);
        if (al > 0)
          ladWalk(
            f,
            x,
            y,
            dir || -1,
            a < PACK.walk ? 0 : Math.floor(a / 190),
            al,
            true
          );
      }
      // the first lady: up off her bench, over to him, the bun
      if (a < g1From) {
        benchLady(f, t, a > 900);
      } else {
        let x: number,
          y: number,
          dir: number,
          steps: number,
          arm = 0,
          al = 1;
        if (a < PACK.walk) {
          const g1 = a - g1From;
          const d = Math.min(1, g1 / g1Dur) * lenOf(G1_IN);
          [x, y, dir] = walkTo(G1_IN, d);
          steps = g1 < g1Dur ? Math.floor(g1 / 90) : -1;
          if (g1 >= g1Dur) dir = -1;
          if (a >= PACK.arrive && a < PACK.got) arm = 1;
        } else {
          const d = (a - PACK.walk) * WALK;
          [x, y, dir] = walkTo(G1_OUT, d);
          steps = Math.floor(a / 190) + 1;
          if (dir === 0) dir = -1;
          al = Math.min(1, (y - 113) / 8);
        }
        if (al > 0)
          lady(
            f,
            x,
            y,
            dir || -1,
            LADY1,
            steps,
            arm,
            a < PACK.walk ? 1 : 0,
            al
          );
        // the bun, from her hand into his
        if (a >= PACK.arrive && a < PACK.got) {
          const p = smooth((a - PACK.bun) / (PACK.got - PACK.bun));
          bun(
            f,
            x - 5 + (manX + 1 - (x - 5)) * p,
            y - 8 + (LAD_TOP + 7 - (y - 8)) * p
          );
        }
      }
    }

    // ---------- easter egg: metro ----------
    let metroAt = -Infinity;
    const metroOn = (t: number) => t - metroAt >= 0 && t - metroAt < METRO.end;
    const PAV: EggSpot = { id: 'metro', x: pvX, y: 140, r: 9 };
    let under: ReturnType<typeof metroView> | undefined;
    let scratch: Frame | undefined;
    let scratch2: Frame | undefined;
    const onPavilion = (x: number, y: number) =>
      Math.abs(x - pvX) <= 12 && y >= 126 && y < h;

    /**
     * The entrance pavilion: a little vaulted porch, and through its round
     * arch, steps going down into a warm glow. `flare` brightens it as the
     * camera dips.
     */
    function pavilion(f: Frame, t: number, flare: number) {
      const base = h - 1;
      const pulse = 0.5 + 0.5 * Math.sin(t / 650);
      // the warm light it throws round itself
      const spill = 0.14 + 0.08 * pulse + flare * 0.5;
      for (let y = 124; y <= base; y++)
        for (let x = pvX - 18; x <= pvX + 18; x++) {
          const d = Math.hypot(x - pvX, (y - 143) * 1.4) / 19;
          if (d < 1) f.blend(x, y, P.pavGlow, spill * (1 - d));
        }
      // a shallow vaulted roof
      for (let dx = -11; dx <= 11; dx++) {
        const top = Math.round(
          132 - 2.4 * Math.sqrt(Math.max(0, 1 - (dx / 11.5) ** 2))
        );
        f.vline(
          pvX + dx,
          top,
          132,
          top < 131 && dx < 0 ? P.pavRoofHi : P.pavRoof
        );
      }
      f.hline(pvX - 12, pvX + 12, 133, P.pav);
      f.hline(pvX - 11, pvX + 11, 134, P.pavSh);
      // the facade, and the arch through it
      f.rect(pvX - 10, 135, 21, base - 134, P.pav);
      f.vline(pvX + 10, 135, base, P.pavSh);
      for (let dx = -7; dx <= 7; dx++) {
        const u = (dx + 0.5) / 7.5;
        const crown = Math.round(142 - 6 * Math.sqrt(Math.max(0, 1 - u * u)));
        f.set(pvX + dx, crown - 1, dx > 3 ? P.pavSh : P.pavDeep);
        // the stair, coming down from the left; the hall's glow far below
        const k = Math.floor((dx + 7) / 3);
        const ty = 140 + k * 2;
        for (let y = crown; y <= base; y++) {
          let c: RGB;
          if (y < ty) c = P.pavIn;
          else if (y === ty) c = P.pavStep;
          else if (y === ty + 1)
            c = (dx + 7) % 3 === 0 ? P.pavStepSh : P.pavStair;
          else c = P.pavStair;
          f.set(pvX + dx, y, c);
          if (y < ty) {
            const g = Math.max(
              0,
              1 - Math.hypot(dx - 7, (y - base) * 0.9) / 12
            );
            f.blend(
              pvX + dx,
              y,
              P.pavGlow,
              g * (0.8 + 0.2 * pulse + flare * 0.2)
            );
          }
        }
        // its handrail
        f.set(pvX + dx, Math.round(136.5 + (dx + 7) * 0.62), P.iron);
      }
      // a glowing globe either side of the arch
      for (const lx of [pvX - 9, pvX + 9]) {
        f.rect(lx - 1, 136, 2, 2, P.goldLight);
        f.set(lx - 1, 136, P.goldHi);
        for (let r = 1; r <= 3; r++) {
          f.blend(lx - 1 - r, 136, P.pavGlow, 0.35 - r * 0.08);
          f.blend(lx + r, 137, P.pavGlow, 0.35 - r * 0.08);
          f.blend(lx, 137 + r, P.pavGlow, 0.35 - r * 0.08);
        }
      }
      f.hline(pvX - 10, pvX + 10, base, P.pavDeep);
    }

    return {
      render(f, t, pointer) {
        now = t;
        const mA = t - metroAt;
        if (mA >= 0 && mA < METRO.end) {
          under ??= metroView(w, h, pvX);
          scratch ??= new Frame(w, h);
          scratch2 ??= new Frame(w, h);
          if (mA >= METRO.dip && mA < METRO.rise) {
            under.draw(f, mA, scratch);
            return;
          }
          square(f, t, pointer);
          if (mA < METRO.dip) {
            // the camera dips: the square slides up, the ground comes up
            const D = Math.round(h * smooth(mA / METRO.dip));
            if (D > 0) {
              f.pixels.copyWithin(0, D * w, h * w);
              under.draw(scratch, mA, scratch2);
              f.pixels.set(scratch.pixels.subarray(0, D * w), (h - D) * w);
            }
          } else {
            // and rises back up to the square
            const R = Math.round(
              h * smooth((mA - METRO.rise) / (METRO.end - METRO.rise))
            );
            if (R < h) {
              f.pixels.copyWithin(0, (h - R) * w, h * w);
              under.draw(scratch, mA, scratch2);
              f.pixels.set(scratch.pixels.subarray(0, (h - R) * w), R * w);
            }
          }
          return;
        }
        square(f, t, pointer);
      },
      poke(x, y, t) {
        // underground, the square isn't there to click
        if (metroOn(t)) return;
        if (near(x, y, PAV) || onPavilion(x, y)) {
          metroAt = t;
          return;
        }
        if (near(x, y, LAD_SPOT) || onLad(x, y)) {
          if (!packOn(t)) packAt = t;
          return;
        }
        if (near(x, y, BUNCH)) {
          if (!flying(t) && balloons.some((b) => t - b.gone > BALLOON_BACK))
            flyAt = t;
          return;
        }
        if (flying(t) && onSeller(x, y)) return;
        pokeSquare(x, y, t);
      },
      hot(x, y) {
        if (metroOn(now)) return false;
        return (
          onPavilion(x, y) ||
          (!packOn(now) && onLad(x, y)) ||
          !!onTree(x, y) ||
          onTower(x, y) ||
          !!domeAt(x, y) ||
          onPigeons(x, y) ||
          (!flying(now) && onSeller(x, y))
        );
      },
      eggs(t) {
        if (metroOn(t)) return [];
        const out: EggSpot[] = [PAV];
        if (!packOn(t)) out.push(LAD_SPOT);
        // while he's on the ground with a balloon left
        if (!flying(t) && balloons.some((b) => t - b.gone > BALLOON_BACK))
          out.push(BUNCH);
        return out;
      },
    };

    /**
     * The old lady on her bench, throwing crumbs now and then (not while
     * she's watching the lad); `al` fades her in.
     */
    function benchLady(f: Frame, t: number, watching: boolean, al = 1) {
      const throwP = (t % 3800) / 3800;
      const bx = gBench;
      box(f, bx - 1, 115, 4, 3, P.scarf, al);
      dot(f, bx + 1, 115, P.scarfHi, al);
      dot(f, bx + 2, 117, P.skin, al);
      box(f, bx - 1, 118, 4, 5, P.coatBrown, al);
      box(f, bx + 3, 121, 3, 2, P.coatBrown, al);
      box(f, bx + 5, 123, 1, 4, P.trousers, al);
      const reach = !watching && throwP > 0.1 && throwP < 0.25;
      dot(f, bx + (reach ? 4 : 3), reach ? 119 : 120, P.skin, al);
      if (!watching && al >= 1 && throwP > 0.14 && throwP < 0.4) {
        const s = (throwP - 0.14) / 0.26;
        for (let k = 0; k < 3; k++)
          f.set(
            bx + 5 + s * (8 + k * 6),
            119 + s * (10 + k * 3) - Math.sin(s * Math.PI) * 4,
            P.crumb
          );
      }
      box(f, bx - 3, 121, 2, 3, P.coatRed, al); // her shopping bag
    }

    /** People out for a walk: those further back than `foot`, or the rest. */
    function strollers(f: Frame, t: number, nearer: boolean) {
      const span = w + 40;
      for (const [i, p] of walkers.entries()) {
        if (p.foot >= MAN_FOOT !== nearer) continue;
        const x =
          Math.round((((p.offset + t * p.speed) % span) + span) % span) - 20;
        const dir = p.speed > 0 ? 1 : -1;
        if (p.kind === 'kid') {
          const top = p.foot - 8;
          for (let k = 0; k < 3; k++) f.blend(x + k, p.foot, P.shade, 0.35);
          f.rect(x, top, 2, 2, p.hair);
          f.rect(x - 1, top + 2, 3, 3, P.coatYellow);
          const step = Math.floor(t / 150 + i) % 2;
          f.vline(x - (step ? 1 : 0), top + 5, p.foot - 1, P.denim);
          f.vline(x + 1, top + 5, p.foot - 1, P.denim);
          const bob = Math.round(Math.sin(t / 500 + i));
          f.vline(x + 2, top - 6 + bob, top + 2, P.string);
          balloon(f, x + 1, top - 12 + bob, P.balloonRed);
          continue;
        }
        person(f, x, p.foot, t, p, dir, i);
        if (p.kind === 'pram') {
          const px = dir > 0 ? x + 4 : x - 8;
          f.rect(px, p.foot - 6, 6, 3, P.pram);
          f.rect(px + (dir > 0 ? 3 : 0), p.foot - 8, 3, 2, P.pramHi);
          f.hline(px + 1, px + 4, p.foot - 3, P.wheel);
          f.set(px + 1, p.foot - 1, P.wheel);
          f.set(px + 4, p.foot - 1, P.wheel);
          f.set(dir > 0 ? px - 1 : px + 6, p.foot - 7, P.wheel);
        }
      }
    }

    function bigBalloon(
      f: Frame,
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      c: RGB
    ) {
      const sh = lerpRGB(c, 0x1a1030, 0.3);
      for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          const nx = (x + 0.5 - cx) / rx;
          const ny = (y + 0.5 - cy) / ry;
          if (nx * nx + ny * ny > 1) continue;
          let col = c;
          if (nx * 0.8 + ny > 0.72) col = sh;
          if ((nx + 0.38) ** 2 + (ny + 0.42) ** 2 < 0.06) col = P.balloonHi;
          f.set(x, y, col);
        }
      f.set(cx, cy + ry + 0.5, c);
    }

    /** The balloon seller and his bunch, wherever the flight has him. */
    function seller(f: Frame, t: number) {
      const { dx, dy, up, s } = flight(t);
      const sx = sellerX + dx;
      // his shadow stays on the ground, shrinking as he rises
      const sw = Math.round(5 - up * 3);
      for (let k = 0; k < sw; k++)
        f.blend(sx + 2 - (sw >> 1) + k, 140, P.shade, 0.35 * (1 - up * 0.5));
      f.rect(sx, 126 + dy, 2, 3, P.hairDark);
      f.set(sx + 1, 127 + dy, P.skin);
      f.rect(sx - 1, 129 + dy, 4, 6, P.coatTeal);
      if (up > 0.04) {
        // legs kicking, his free arm waving
        const k = Math.floor(t / 150) % 2;
        f.vline(sx, 135 + dy, 137 + dy, P.trousers);
        f.vline(sx + 1, 135 + dy, 137 + dy, P.trousers);
        f.set(k ? sx - 1 : sx, 138 + dy, P.trousers);
        f.set(k ? sx + 1 : sx + 2, 138 + dy, P.trousers);
        f.set(k ? sx - 1 : sx + 3, 139 + dy, P.wheel);
        f.set(sx - 2, 129 + dy, P.coatTeal);
        f.set(sx - 3, (Math.floor(t / 230) % 2 ? 127 : 129) + dy, P.skin);
      } else {
        f.vline(sx, 135 + dy, 139 + dy, P.trousers);
        f.vline(sx + 1, 135 + dy, 139 + dy, P.trousers);
      }
      // the bunch, swollen to twice its size while it's carrying him
      const kx = sx + 4;
      const ky = 113 + dy - Math.round((s - 1) * 7);
      f.line(sx + 3, 128 + dy, kx, ky, P.string);
      f.set(sx + 3, 129 + dy - (up > 0.04 ? 2 : 0), P.skin);
      const sp = 1 + (s - 1) * 1.5;
      const knots = balloons.map((b, i) => {
        const bob = Math.round(Math.sin(t / 800 + i * 1.7) * 0.6);
        return [
          Math.round(kx + b.dx * sp),
          Math.round(ky + (b.dy + 21 + bob) * sp - (s - 1) * 3),
        ] as const;
      });
      for (const [i, b] of balloons.entries())
        if (t - b.gone >= BALLOON_BACK)
          f.line(kx, ky, knots[i]![0], knots[i]![1], P.string);
      for (const [i, b] of balloons.entries()) {
        if (t - b.gone < BALLOON_BACK) continue;
        const [bx, by] = knots[i]!;
        if (s < 1.12) balloon(f, bx - 2, by - 5, b.c);
        else bigBalloon(f, bx, by - 2.5 * s - 0.5, 2 * s, 2.5 * s, b.c);
      }
    }

    function square(f: Frame, t: number, pointer?: Pointer | null) {
      now = t;
      f.copyFrom(sky);
      f.over(cloudLayer, Math.round(t / 1400), 0, true);
      f.over(land);
      const ti = tower!;

      // gold: a sweeping flash when clicked, and the odd glint on its own
      const gAge = t - glintAt;
      if (gAge < glintLen) {
        const band = goldX0 - 20 + gAge * 0.24;
        for (const p of gold) {
          const x = p % w;
          const d = Math.abs(x - ((p / w) | 0) * 0.6 - band + 30);
          if (d < 2) f.blend(x, (p / w) | 0, P.goldHi, 0.95);
          else if (d < 5) f.blend(x, (p / w) | 0, P.goldHi, 0.5);
        }
        domes.forEach((d) =>
          twinkle(
            f,
            d.hx,
            d.hy,
            (gAge - (d.hx - goldX0 + 30) / 0.24 + 250) / 520,
            P.goldHi
          )
        );
      }
      const gk = Math.floor(t / 2300);
      const dm = domes[Math.floor(hash2(gk, 0, 5) * domes.length)];
      if (dm && hash2(gk, 1, 5) > 0.35)
        twinkle(f, dm.hx, dm.hy, ((t % 2300) - 300) / 600, P.goldHi);
      if (pointer) {
        const d = domeAt(pointer.x, pointer.y);
        if (d) twinkle(f, d.hx, d.hy, (t % 900) / 900, P.goldHi);
      }

      // clock hands and the bell
      const [kx, ky] = ti.clock;
      const m = (t / 60_000) * Math.PI * 2;
      f.set(
        kx + Math.round(Math.sin(m) * 2),
        ky - Math.round(Math.cos(m) * 2),
        P.icon
      );
      f.set(
        kx + Math.round(Math.sin(m / 12)),
        ky - Math.round(Math.cos(m / 12)),
        P.icon
      );
      f.set(kx, ky, P.icon);
      drawBell(f, t);
      // doves on the cornices, until the bell sends them off
      if (t - bellAt > 9000)
        for (const [lx, ly] of ledges) {
          f.set(lx, ly, P.dove);
          f.set(lx + 1, ly, P.doveSh);
          f.set(lx + (Math.floor(t / 1700 + lx) % 2 ? 0 : 1), ly - 1, P.dove);
        }
      // swifts wheeling round the bell tower
      for (let i = 0; i < 3; i++) {
        const a = t / 2300 + i * 2.1;
        const x = btX + Math.sin(a) * 34 + Math.sin(a * 2.3) * 8;
        const y = 26 + Math.sin(a * 1.7 + i) * 12;
        const up = Math.floor(t / 110 + i * 3) % 3 === 0;
        f.set(x, y, P.swift);
        f.set(x - 1, y + (up ? -1 : 0), P.swift);
        f.set(x + 1, y + (up ? -1 : 0), P.swift);
        f.set(x - 2, y + (up ? -1 : 1), P.swift);
        f.set(x + 2, y + (up ? -1 : 1), P.swift);
      }

      // the old lady on the bench (unless she's off helping the lad)
      if (!packOn(t)) benchLady(f, t, false);

      // a couple on the other bench, her head on his shoulder now and then
      if (coupleX > 30) {
        const lean = Math.sin(t / 5000) > 0.4 ? 1 : 0;
        sitter(f, coupleX - 4, 116, P.coatNavy, P.hairDark, P.trousers, 0);
        sitter(
          f,
          coupleX + 2,
          117 + lean,
          P.coatPink,
          P.hairBlonde,
          P.denim,
          -lean
        );
      }

      // people out for a walk, the lad on his bench in among them
      strollers(f, t, false);
      packScene(f, t, t - packAt);
      strollers(f, t, true);
      // (flaring up as the camera dips into it)
      const mA = t - metroAt;
      pavilion(f, t, mA >= 0 && mA < METRO.dip ? 1 - mA / METRO.dip : 0);

      // the balloon seller (in front of everything once he's airborne)
      const airborne = flying(t);
      if (!airborne) seller(f, t);

      // pigeons: pecking about, or looping round the square
      const fAge = t - flightAt;
      for (const [i, pg] of pigeons.entries()) {
        const u = (fAge - i * 70) / FLIGHT;
        if (u >= 0 && u < 1) continue;
        const wander = Math.round(Math.sin(t / 2600 + pg.phase) * 3);
        const peck = Math.sin(t / 260 + pg.phase * 3) > 0.55;
        groundPigeon(
          f,
          pg.x + wander,
          pg.y,
          Math.cos(t / 2600 + pg.phase) > 0 ? pg.dir : -pg.dir,
          peck,
          pg.body
        );
      }

      f.over(front);
      if (airborne) seller(f, t);

      // the odd blossom letting go on its own
      for (let i = 0; i < 6; i++) {
        const tr = trees[i % 2]!;
        const cyc = t / 9000 + hash2(i, 0, 91);
        petal(f, tr, i + Math.floor(cyc) * 7, 91, (cyc % 1) * 9);
      }

      for (const [i, pg] of pigeons.entries()) {
        const u = (fAge - i * 70) / FLIGHT;
        if (u < 0 || u >= 1) continue;
        const rx = Math.min(60 + hash2(i, 5, 61) * 50, w * 0.28);
        const ry = 70 + hash2(i, 6, 61) * 22;
        const x =
          pg.x + flightDir * rx * Math.sin(u * Math.PI * 2) * (1 - u * 0.2);
        const y = pg.y - 2 - ry * Math.pow(Math.sin(u * Math.PI), 0.65);
        const flap = u < 0.15 || u > 0.85 ? 70 : 140;
        const glide = u > 0.3 && u < 0.7 && Math.sin(t / 400 + i) > 0.4;
        flyingBird(
          f,
          x,
          y,
          !glide && Math.floor(t / flap + i) % 2 === 0,
          pg.body,
          P.pigeonDark
        );
      }

      // released balloons drift up and away
      const sx = sellerX;
      for (const [i, b] of balloons.entries()) {
        const a = (t - b.gone) / 1000;
        if (a < 0 || a > 10) continue;
        const x = sx + 2 + b.dx + Math.sin(a * 1.3 + i) * 4 + a * 4;
        const y = 129 + b.dy - a * a * 3 - a * 9;
        balloon(f, x, y, b.c);
        f.line(x + 2, y + 6, x + 2 + Math.sin(a * 3) * 1.5, y + 11, P.string);
      }

      soundRings(f, t);
      fx.draw(f, t);

      // the backpack egg's light, the bubble and the hearts over it all
      const gA = t - packAt;
      if (gA >= 0 && gA < PACK.end) {
        mood(f, gA);
        thought(f, gA);
        hearts(f, gA);
        if (gA >= PACK.got && gA < PACK.got + 520)
          twinkle(f, manX + 2, LAD_TOP + 7, (gA - PACK.got) / 520, P.warmHi);
      }
    }

    function pokeSquare(x: number, y: number, t: number) {
      if (onPigeons(x, y)) {
        if (t - flightAt > FLIGHT + 600) {
          flightAt = t;
          flightDir = x < pgX + 6 ? 1 : -1;
        }
        return;
      }
      if (onSeller(x, y)) {
        for (let k = 0; k < balloons.length; k++) {
          const b = balloons[(nextBalloon + k) % balloons.length]!;
          if (t - b.gone > BALLOON_BACK) {
            b.gone = t;
            nextBalloon = (nextBalloon + k + 1) % balloons.length;
            break;
          }
        }
        return;
      }
      if (domeAt(x, y)) {
        if (t - glintAt > glintLen) glintAt = t;
        return;
      }
      if (onTower(x, y)) {
        // ring only once the last peal has died away; the doves fly off
        // only if they're back on their ledges
        if (t - bellAt > 5200) {
          const doves = t - bellAt > 9000;
          bellAt = t;
          if (doves)
            for (const [i, [lx, ly]] of ledges.entries())
              flock(fx, t + i * 60, lx, ly, P.dove, {
                count: 2,
                seed: i + Math.floor(t),
                dir: lx < btX ? -1 : 1,
              });
        }
        return;
      }
      const tr = onTree(x, y);
      if (tr) blossomFall(t, tr, Math.floor(t) % 1000);
    }
  },
};
