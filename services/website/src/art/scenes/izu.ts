// Two riders on the Izu coast road, in warm golden-hour sun or pouring
// rain: the lead on a black-and-red bike, a friend behind on a gunmetal
// one. Along the sea wall: a beach of round boulders, the sea, wooded lava
// headlands with a lighthouse, Izu Oshima on the horizon.
//
// The weather comes and goes on its own (sun, then the cloud rolls in from
// the sea and the rain starts light and gets heavy, then it clears, the sun
// breaks through and a rainbow stands over the sea), or the other way when
// you click the sky. Sun and rain share every outline: each layer is drawn
// twice, once per weather, and kept as a colour-pair index per pixel, so a
// change of weather only rebuilds a small lookup table each frame.
//
// Click the trail sign on the verge and the scene dips into the night
// forest for a few seconds (headlight beams, a bumpy track, a pair of eyes
// in the bushes) before coming back out to the coast.
//
// Click the coin binoculars by the sea wall and the bikes pull over; the
// view opens out of the binoculars to the two riders at the rail of a lay-by
// up on the Izu Skyline after the rain, the wet ridges steaming below, and
// Fuji coming out across Suruga Bay as the sun breaks through (see
// things/izu-skyline).
//
// Clicks: either rider pulls a wheelie (one clicked mid-wheelie is queued,
// never restarted), the sky turns the weather (not while it's turning), the
// sea throws a wave over the boulders, the vending machines drop a can, the
// curve mirror glints, the verge sends a wild boar trotting across the
// road, the trail sign takes them into the forest and the binoculars up to
// the Skyline. A boar also crosses now and then on its own, and one lies up
// in the bush at each trail mouth (watch the leaves). The yellow wild-boar
// warning signs by the wall are right, too: click one and it flashes, a sow
// bursts out of the grass with her stripy piglets, and the bikes stop to
// let them cross. The trail mouths, binoculars and boar signs come round
// often enough that one of each is nearly always in view, however narrow
// the screen, and never crowd each other.

import { bayer8, Frame, lerpRGB, type RGB, sprite } from '../frame';
import { Fx } from '../fx';
import { hash2, pfbm1 } from '../noise';
import { canopy } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';
import {
  drawScope,
  SCOPE_EYE,
  SCOPE_H,
  SCOPE_W,
  type ScopeColours,
  skylineView,
} from '../things/izu-skyline';
import {
  FRIEND_BIKE,
  BIKE,
  BIKE_POINTS,
  type BikeOptions,
  type BikePalette,
  bikePoint,
  drawMotorcycle,
} from '../things/motorcycle';

// The rain palette. Every key has a golden-hour twin in SUN below.
const RAIN = palette({
  // overcast: heavy at the top, a silver band low over the sea
  sky0: '#3f4758',
  sky1: '#4a5365',
  sky2: '#5a6375',
  sky3: '#666f81',
  sky4: '#737d8d',
  sky5: '#818a99',
  sky6: '#8f98a5',
  sky7: '#9da5b1',
  sky8: '#adb4be',
  sky9: '#c4cad1',
  silver: '#dde1e5',
  scud: '#4b5364',
  scudSh: '#414858',
  scudLit: '#5f6878',
  cloudHi: '#aab2bd',
  cloudLit: '#939caa',
  cloud: '#7b8494',
  cloudSh: '#646d7e',
  cloudDk: '#525a6b',
  curtain: '#5c6576',
  beam: '#e9e8de',
  // far away
  oshimaTop: '#8d97a4',
  oshima: '#828c9a',
  cape: '#7a8592',
  capeSh: '#6f7a88',
  capeTop: '#86909c',
  // sea
  haze: '#c3c9d0',
  seaW: '#97a3ae',
  sea0: '#97a3ae',
  sea1: '#7f8f9c',
  sea2: '#6c7e8c',
  sea3: '#5e7181',
  sea4: '#526677',
  sea5: '#475b6c',
  swell: '#3e5162',
  swellHi: '#8d9ca8',
  foam: '#eef2f4',
  foamSh: '#c0cad2',
  seaRef: '#33465a',
  glint: '#c8d0d8',
  glintHi: '#e8eef2',
  // columnar basalt headland
  rockHi: '#8a919b',
  rockLit: '#6c737e',
  rock: '#58606c',
  rockSh: '#4a505d',
  rockDk: '#3a3f4c',
  // the headland's woods
  hzDk: '#33433f',
  hzSh: '#3d4f49',
  hz: '#4a5e55',
  hzLit: '#5d7264',
  hzPine: '#41544b',
  hzPineHi: '#5a6f62',
  hzPineSh: '#34453e',
  // near greens
  leafHi: '#6f8f66',
  leafLit: '#4f7052',
  leaf: '#3a5845',
  leafSh: '#294337',
  leafDk: '#1b2e29',
  pineHi: '#587866',
  pine: '#314a3f',
  pineSh: '#22362e',
  bark: '#40362f',
  barkSh: '#2a2420',
  // boulders
  stoneDk: '#2a2e37',
  stoneSh: '#3c414c',
  stone: '#525863',
  stoneLit: '#6c737e',
  stoneHi: '#9aa2ad',
  stoneSpec: '#d6dce3',
  brownSh: '#463f3b',
  brown: '#5e5550',
  brownLit: '#776d66',
  // concrete sea wall
  wallTop: '#b4b8bd',
  wallHi: '#9da1a8',
  wall: '#868a92',
  wallSh: '#6c7079',
  wallDk: '#535760',
  wallWet: '#636771',
  moss: '#556350',
  // the lighthouse
  white: '#d9dde0',
  whiteSh: '#9aa0aa',
  lamp: '#fff2c0',
  // road
  asphalt: '#3a3e4b',
  asphaltDk: '#31343f',
  asphaltLt: '#454a58',
  sheen: '#545b6a',
  sheenHi: '#6c7483',
  lineW: '#cfd5dc',
  lineY: '#d9ac3a',
  lineYSh: '#97782f',
  curb: '#8f949c',
  curbSh: '#62666f',
  ditch: '#7e838b',
  ditchSh: '#4b4f58',
  ditchLt: '#a2a7ae',
  shade: '#2b2a42',
  // verge
  grass: '#3e5c3f',
  grassLit: '#57774b',
  grassHi: '#7f9a62',
  grassSh: '#2c4532',
  mud: '#4a3d31',
  mudSh: '#342a22',
  mudHi: '#7d8590',
  wood: '#6a4b35',
  woodSh: '#45311f',
  woodHi: '#8c6a4c',
  glyph: '#e4dccb',
  ribbon: '#ff6fa8',
  ribbonSh: '#c8487c',
  susHi: '#cdc9b9',
  sus: '#a4a193',
  susSh: '#78766d',
  susStem: '#6c7050',
  susLeaf: '#456043',
  susLeafSh: '#2f4532',
  susLeafHi: '#62805a',
  // street furniture
  pole: '#a8abb2',
  poleHi: '#c9ccd2',
  poleSh: '#6d717b',
  wire: '#3c414d',
  drop: '#c8d0da',
  arm: '#6f737d',
  insul: '#d9dde2',
  trans: '#8c9099',
  transSh: '#5f636d',
  reflector: '#ff9526',
  reflectorHi: '#ffd08a',
  post: '#d2d6db',
  postSh: '#8a8f99',
  vmWhite: '#e9edf2',
  vmWhiteSh: '#a9afba',
  vmBlue: '#2c68d6',
  vmBlueHi: '#5c92f0',
  vmRed: '#d8262e',
  vmRedHi: '#f25a4a',
  vmRedSh: '#961820',
  vmGlass: '#f2f8ff',
  vmDark: '#22252d',
  vmGlow: '#e6f0ff',
  can1: '#e23a2e',
  can2: '#2a74e0',
  can3: '#3ab04a',
  can4: '#f2c230',
  can5: '#f6f6f6',
  can6: '#8a4a2a',
  mirrorPole: '#ff8f2a',
  mirrorPoleSh: '#b65c14',
  mirrorSky: '#9aa6b6',
  mirrorRoad: '#4c505c',
  signY: '#f2c41e',
  signHi: '#fbe58a',
  signK: '#1c1c22',
  // the coin binoculars
  scopeHi: '#8fd6b6',
  scope: '#3a9a7a',
  scopeSh: '#256652',
  scopeEye: '#121419',
  scopeLens: '#c4e2ee',
  scopeYoke: '#30343c',
  scopeCoin: '#e0b844',
  scopePost: '#b4b8bf',
  scopePostSh: '#6d717b',
  // lights
  lampHot: '#fffaf0',
  lampGlow: '#ffe7b0',
  tailGlow: '#ff4032',
  // rain
  rainFar: '#9aa4b1',
  rain: '#b9c2cd',
  rainHi: '#e2e8ee',
  spray: '#c9d1da',
  // life
  gull: '#eef0f2',
  gullTip: '#2a2a34',
  kite: '#3b2d27',
  kiteLit: '#6a5a50',
  boat: '#e2e6ea',
  boatSh: '#9aa2ae',
  boatRed: '#c8402e',
  cabin: '#38435a',
  smokeDk: '#3e3a48',
  smoke: '#6e6c78',
  smokeLt: '#a9a8b2',
  truck: '#e4e7ec',
  truckSh: '#a8adb8',
  truckDk: '#30343e',
  glass: '#2a3446',
  glassHi: '#8d9aae',
  tyre: '#16161c',
  mikan: '#ff9a1e',
  boar: '#5a4636',
  boarHi: '#8d7660',
  boarSh: '#3a2d24',
  boarDk: '#211a15',
  tusk: '#e6dfcf',
  // her piglets, striped like little melons
  pig: '#8e6a4e',
  pigHi: '#b0906e',
  pigStripe: '#ddd0b0',
  pigSh: '#5a4432',
  // a rainbow, after
  rbR: '#ff6a5a',
  rbO: '#ffa84a',
  rbY: '#ffe66a',
  rbG: '#7ad86a',
  rbB: '#5aa8ff',
  rbV: '#9a7aff',
  // the forest at night
  nSky0: '#05070c',
  nSky1: '#0a0e18',
  nSky2: '#111725',
  nFar: '#0f141c',
  nFarHi: '#18202a',
  nMid: '#090c11',
  nMidHi: '#141b21',
  nNear: '#030405',
  nGround: '#16120f',
  nGroundHi: '#2a231d',
  nRut: '#0b0908',
  nPuddle: '#1a2231',
  nFern: '#0c1611',
  nFernHi: '#1a2a20',
  nLight: '#fff0c8',
  eyes: '#e9ff9a',
});

type Pal = typeof RAIN;

// Golden hour: the sun low on the left, deep blue overhead warming to peach
// at the horizon, lava glowing orange, everything casting long shadows.
const SUN: Pal = palette({
  sky0: '#1c3690',
  sky1: '#2446a3',
  sky2: '#2f58b4',
  sky3: '#406fc2',
  sky4: '#5f88cc',
  sky5: '#8ea4d2',
  sky6: '#bcb0cc',
  sky7: '#e3bcb4',
  sky8: '#f6cda2',
  sky9: '#ffdfa6',
  silver: '#fff0cc',
  scud: '#8a83a6',
  scudSh: '#77729a',
  scudLit: '#c8b2b4',
  cloudHi: '#fff4d8',
  cloudLit: '#ffdca0',
  cloud: '#efc3a8',
  cloudSh: '#ab9cc2',
  cloudDk: '#857fac',
  curtain: '#7f88b0',
  beam: '#fff2d0',
  oshimaTop: '#d9a9a8',
  oshima: '#9c8ab2',
  cape: '#9a98bf',
  capeSh: '#8589b6',
  capeTop: '#c8a8aa',
  haze: '#efd8bc',
  seaW: '#c7b2c2',
  sea0: '#8a9fcc',
  sea1: '#5f86c6',
  sea2: '#4672bd',
  sea3: '#3762b2',
  sea4: '#2c55a6',
  sea5: '#244a98',
  swell: '#2a52a0',
  swellHi: '#7aa4e0',
  foam: '#fff8ec',
  foamSh: '#c6d4ec',
  seaRef: '#1b3878',
  glint: '#ffe4ae',
  glintHi: '#fff6dc',
  rockHi: '#f4ad68',
  rockLit: '#bf774e',
  rock: '#7c4f4c',
  rockSh: '#4b3752',
  rockDk: '#2a2342',
  hzDk: '#1e4040',
  hzSh: '#2f6146',
  hz: '#548c43',
  hzLit: '#9cba4c',
  hzPine: '#386346',
  hzPineHi: '#8cae5a',
  hzPineSh: '#24433f',
  leafHi: '#e2dc74',
  leafLit: '#9cba4c',
  leaf: '#548c43',
  leafSh: '#2f6146',
  leafDk: '#1e4040',
  pineHi: '#8cae5a',
  pine: '#386346',
  pineSh: '#24433f',
  bark: '#7a4c38',
  barkSh: '#45302e',
  stoneDk: '#3a3248',
  stoneSh: '#5a5266',
  stone: '#857a82',
  stoneLit: '#b4a090',
  stoneHi: '#ead2aa',
  stoneSpec: '#fff2d2',
  brownSh: '#5a4644',
  brown: '#8a6e60',
  brownLit: '#c09a78',
  wallTop: '#fff2dc',
  wallHi: '#f0e2ca',
  wall: '#d6c7b4',
  wallSh: '#a69890',
  wallDk: '#7c7080',
  wallWet: '#cdbdab',
  moss: '#8a9a5c',
  white: '#fbf4e6',
  whiteSh: '#b6aabc',
  lamp: '#ffe9a6',
  asphalt: '#5e5864',
  asphaltDk: '#524d5c',
  asphaltLt: '#6a6370',
  sheen: '#6a6370',
  sheenHi: '#6a6370',
  lineW: '#f8efe0',
  lineY: '#ffc63a',
  lineYSh: '#c99030',
  curb: '#ddcfb6',
  curbSh: '#9c8e88',
  ditch: '#d7c8ae',
  ditchSh: '#6b6274',
  ditchLt: '#f2e3c6',
  shade: '#29284a',
  grass: '#6f9a3c',
  grassLit: '#acc64c',
  grassHi: '#e6dc6a',
  grassSh: '#47703a',
  mud: '#7a5e44',
  mudSh: '#5a4434',
  mudHi: '#8a6c50',
  wood: '#8a5e3c',
  woodSh: '#5a3c26',
  woodHi: '#b88a5a',
  glyph: '#f4ecd8',
  ribbon: '#ff6fa8',
  ribbonSh: '#c8487c',
  susHi: '#fff2cc',
  sus: '#f0cf8e',
  susSh: '#c49a72',
  susStem: '#a6a05a',
  susLeaf: '#6e8c48',
  susLeafSh: '#45663e',
  susLeafHi: '#b8c060',
  pole: '#d9cfc2',
  poleHi: '#fff1d8',
  poleSh: '#8d88a0',
  wire: '#433d62',
  drop: '#433d62',
  arm: '#8a8496',
  insul: '#fff6e6',
  trans: '#b9b1ae',
  transSh: '#7c7690',
  reflector: '#ff9526',
  reflectorHi: '#ffd08a',
  post: '#f6efe4',
  postSh: '#8a849c',
  vmWhite: '#f6efe4',
  vmWhiteSh: '#bdb6c6',
  vmBlue: '#2c68d6',
  vmBlueHi: '#5c92f0',
  vmRed: '#d8262e',
  vmRedHi: '#f25a4a',
  vmRedSh: '#961820',
  vmGlass: '#eef6ff',
  vmDark: '#24272f',
  vmGlow: '#fff6e0',
  can1: '#e23a2e',
  can2: '#2a74e0',
  can3: '#3ab04a',
  can4: '#f2c230',
  can5: '#f6f6f6',
  can6: '#8a4a2a',
  mirrorPole: '#ff8f2a',
  mirrorPoleSh: '#b65c14',
  mirrorSky: '#a8c4ec',
  mirrorRoad: '#6c6670',
  signY: '#ffd21e',
  signHi: '#fff4b0',
  signK: '#1c1c22',
  scopeHi: '#b4f4d2',
  scope: '#3fb48a',
  scopeSh: '#22795f',
  scopeEye: '#14161c',
  scopeLens: '#e0f8ff',
  scopeYoke: '#3a3f48',
  scopeCoin: '#ffd04a',
  scopePost: '#e2d8cc',
  scopePostSh: '#8a849c',
  lampHot: '#fffaf0',
  lampGlow: '#ffe7b0',
  tailGlow: '#ff4032',
  rainFar: '#9aa4b1',
  rain: '#b9c2cd',
  rainHi: '#e2e8ee',
  spray: '#c9d1da',
  gull: '#fbf4ea',
  gullTip: '#2a2a34',
  kite: '#3b2d27',
  kiteLit: '#9a6a48',
  boat: '#fbf3e6',
  boatSh: '#aaa8c0',
  boatRed: '#d8402e',
  cabin: '#38435a',
  smokeDk: '#3e3a48',
  smoke: '#7a7484',
  smokeLt: '#bdb4bc',
  truck: '#f4ede2',
  truckSh: '#b2adbe',
  truckDk: '#3a3f4c',
  glass: '#2a3b55',
  glassHi: '#ffd9a0',
  tyre: '#16161c',
  mikan: '#ff9a1e',
  boar: '#6a5240',
  boarHi: '#a88a6c',
  boarSh: '#45352a',
  boarDk: '#2a2018',
  tusk: '#e6dfcf',
  pig: '#b47a48',
  pigHi: '#dca46a',
  pigStripe: '#fff0c4',
  pigSh: '#6e4a32',
  rbR: '#ff6a5a',
  rbO: '#ffa84a',
  rbY: '#ffe66a',
  rbG: '#7ad86a',
  rbB: '#5aa8ff',
  rbV: '#9a7aff',
  nSky0: '#05070c',
  nSky1: '#0a0e18',
  nSky2: '#111725',
  nFar: '#0f141c',
  nFarHi: '#18202a',
  nMid: '#090c11',
  nMidHi: '#141b21',
  nNear: '#030405',
  nGround: '#16120f',
  nGroundHi: '#2a231d',
  nRut: '#0b0908',
  nPuddle: '#1a2231',
  nFern: '#0c1611',
  nFernHi: '#1a2a20',
  nLight: '#fff0c8',
  eyes: '#e9ff9a',
});

/** A palette part of the way from a to b (every key). */
function mixPal<K extends string>(
  a: Record<K, RGB>,
  b: Record<K, RGB>,
  k: number
): Record<K, RGB> {
  const out = { ...a };
  for (const key of Object.keys(out) as K[])
    out[key] = lerpRGB(a[key], b[key], k);
  return out;
}

// the riders in each light: a gold rim and warm highlights in the sun, the
// grey sky's light in the rain
const LEAD_SUN: BikePalette = {
  ...BIKE,
  rimLight: 0xffc070,
  hoodieHi: 0x76666a,
  spec: 0xfff0d6,
  jeansHi: 0x86a6d4,
};
const LEAD_RAIN: BikePalette = {
  ...BIKE,
  rimLight: 0x8c95a5,
  spec: 0xc9d2e0,
  bodyHi: 0x56607a,
};
const FRIEND_SUN: BikePalette = { ...FRIEND_BIKE, rimLight: 0xc89a6a };
const FRIEND_RAIN: BikePalette = { ...FRIEND_BIKE, rimLight: 0x6e7684 };
// three steps between them, so the sprite caches stay small
const LEAD_PALS = [LEAD_SUN, mixPal(LEAD_SUN, LEAD_RAIN, 0.5), LEAD_RAIN];
const FRIEND_PALS = [
  FRIEND_SUN,
  mixPal(FRIEND_SUN, FRIEND_RAIN, 0.5),
  FRIEND_RAIN,
];

/** The same palette at night, lights left burning. */
function nightOf(p: BikePalette): BikePalette {
  const out = { ...p };
  for (const k of Object.keys(out) as (keyof BikePalette)[])
    out[k] = lerpRGB(p[k], 0x070a12, 0.62);
  out.light = p.light;
  out.lightSh = p.lightSh;
  out.tail = p.tail;
  out.amber = lerpRGB(p.amber, 0x070a12, 0.3);
  out.visorHi = lerpRGB(p.visorHi, 0x070a12, 0.35);
  out.rimLight = 0x2a3346;
  return out;
}

// the bike's indicators, from its rear axle (see BIKE_POINTS)
const BIKE_INDICATOR_F = [24, -11] as const;
const BIKE_INDICATOR_R = [-6, -12] as const;

const HORIZON = 60;
const FAR_WL = HORIZON + 2; // the far capes meet the sea here
const WL = 84; // waterline of the headland
const BEACH = 88; // where the surf runs up the boulders
const WALL = 98; // top of the sea wall
const ROAD = 106; // far edge of the road
const CENTRE = 116; // the yellow line
const ONCOMING = 114; // tyres of traffic in the far lane
const G_FRIEND = 121; // the friend rides nearer the centre line, behind
const G_LEAD = 126; // the lead rider, nearer the edge
const EDGE = 133; // near edge line
const VERGE = 137;
const TRAIL_G = 127; // the forest track

// layer lengths (they tile) and speeds in px per ms
const LC = 1600;
const LS = 1300;
const LF = 1536;
const LM = 1300;
const LB = 1000;
const LR = 1440;
const LG = 960;
const LN = 1100;
const SPEED = {
  cloud: 0.003,
  far: 0.005,
  mid: 0.014,
  beach: 0.045,
  road: 0.07,
  fore: 0.1,
};

// the low sun on the left: a point h px up casts its shadow this far right / down
const SHADOW_X = 1.5;
const SHADOW_Y = 0.14;

/** Like Frame.scroll, but only over rows [y0, y1). */
function scrollRows(
  f: Frame,
  src: Frame,
  offset: number,
  y0: number,
  y1: number
) {
  const { w } = f;
  const sw = src.w;
  const o = ((Math.round(offset) % sw) + sw) % sw;
  const dst = f.pixels;
  const sp = src.pixels;
  for (let y = Math.max(0, y0); y < Math.min(f.h, y1); y++) {
    const row = y * sw;
    const out = y * w;
    let sx = o;
    for (let x = 0; x < w; x++) {
      const p = sp[row + sx]!;
      if (p >>> 24) dst[out + x] = p;
      if (++sx === sw) sx = 0;
    }
  }
}

/** Screen x of a layer x, wrapped so it lands nearest the visible strip. */
function onScreen(lx: number, off: number, L: number, w: number) {
  let x = (((lx - off) % L) + L) % L;
  if (x > w + 80) x -= L;
  return x;
}

const wset = (f: Frame, x: number, y: number, c: RGB) =>
  f.set(((Math.round(x) % f.w) + f.w) % f.w, y, c);

const wblend = (f: Frame, x: number, y: number, c: RGB, a: number) =>
  f.blend(((Math.round(x) % f.w) + f.w) % f.w, y, c, a);

const smooth = (u: number) => {
  const v = Math.max(0, Math.min(1, u));
  return v * v * (3 - 2 * v);
};

/** A soft stepped glow made of rings, blended onto what's there. */
function glowAt(
  f: Frame,
  cx: number,
  cy: number,
  r: number,
  c: RGB,
  a: number,
  squash = 1
) {
  if (a <= 0.01) return;
  for (let y = Math.floor(cy - r * squash); y <= cy + r * squash; y++)
    for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      const d = Math.hypot(x - cx, (y - cy) / squash) / r;
      if (d >= 1) continue;
      const ring = Math.ceil((1 - d) * 3) / 3;
      f.blend(x, y, c, a * ring * ring);
    }
}

// ---------- sun and rain versions of one picture ----------

/**
 * Every (sun colour, rain colour) pair that occurs anywhere in the layers,
 * so a layer can be stored once as pair indices and shown in any weather
 * through a lookup table. 0 is transparent in both.
 */
class Pairs {
  sun: number[] = [0];
  rain: number[] = [0];
  private map = new Map<number, number>();
  private luts = new Map<number, Uint32Array>();

  index(s: number, r: number) {
    const ks = s >>> 24 ? (s & 0xffffff) + 0x1000000 : 0;
    const kr = r >>> 24 ? (r & 0xffffff) + 0x1000000 : 0;
    if (!ks && !kr) return 0;
    const key = ks * 0x2000000 + kr;
    let i = this.map.get(key);
    if (i === undefined) {
      i = this.sun.length;
      this.sun.push(s >>> 24 ? s : 0);
      this.rain.push(r >>> 24 ? r : 0);
      this.map.set(key, i);
    }
    return i;
  }

  /** Pixels for the weather k (0 sun .. 1 rain), in 32 steps. */
  lut(k: number) {
    const step = Math.max(0, Math.min(32, Math.round(k * 32)));
    let out = this.luts.get(step);
    if (out) return out;
    const n = this.sun.length;
    out = new Uint32Array(n);
    const q = step / 32;
    for (let i = 1; i < n; i++) {
      const s = this.sun[i]!;
      const r = this.rain[i]!;
      if (s && r) {
        const lr = (s & 0xff) + ((r & 0xff) - (s & 0xff)) * q;
        const lg =
          ((s >>> 8) & 0xff) + (((r >>> 8) & 0xff) - ((s >>> 8) & 0xff)) * q;
        const lb =
          ((s >>> 16) & 0xff) + (((r >>> 16) & 0xff) - ((s >>> 16) & 0xff)) * q;
        out[i] =
          (0xff000000 |
            (Math.round(lb) << 16) |
            (Math.round(lg) << 8) |
            Math.round(lr)) >>>
          0;
      } else out[i] = step < 16 ? s : r;
    }
    this.luts.set(step, out);
    return out;
  }
}

/** One layer in both weathers: a pair index per pixel. */
type Duo = { w: number; idx: Uint16Array };

function duo(
  pairs: Pairs,
  sun: Frame,
  rain: Frame,
  y0: number,
  y1: number
): Duo {
  const idx = new Uint16Array(sun.w * sun.h);
  for (let y = Math.max(0, y0); y < Math.min(sun.h, y1); y++)
    for (let x = 0; x < sun.w; x++) {
      const i = y * sun.w + x;
      idx[i] = pairs.index(sun.pixels[i]!, rain.pixels[i]!);
    }
  return { w: sun.w, idx };
}

/**
 * The same picture in another palette: for layers whose shapes and shading
 * don't depend on the weather, recolour instead of drawing them twice.
 */
function recolour(src: Frame, from: Pal, to: Pal, keys: (keyof Pal)[]) {
  const map = new Map<number, number>();
  const px = (c: RGB) =>
    (0xff000000 | ((c & 0xff) << 16) | (c & 0xff00) | ((c >>> 16) & 0xff)) >>>
    0;
  for (const k of keys) map.set(px(from[k]), px(to[k]));
  const out = new Frame(src.w, src.h);
  for (let i = 0; i < src.pixels.length; i++) {
    const p = src.pixels[i]!;
    if (p >>> 24) out.pixels[i] = map.get(p) ?? p;
  }
  return out;
}

/** Like scrollRows, for a two-weather layer seen through a lookup table. */
function blit(
  f: Frame,
  d: Duo,
  lut: Uint32Array,
  offset: number,
  y0: number,
  y1: number
) {
  const { w } = f;
  const sw = d.w;
  const o = ((Math.round(offset) % sw) + sw) % sw;
  const dst = f.pixels;
  const idx = d.idx;
  for (let y = Math.max(0, y0); y < Math.min(f.h, y1); y++) {
    const row = y * sw;
    const out = y * w;
    let sx = o;
    for (let x = 0; x < w; x++) {
      const i = idx[row + sx]!;
      if (i) {
        const p = lut[i]!;
        if (p) dst[out + x] = p;
      }
      if (++sx === sw) sx = 0;
    }
  }
}

/**
 * A cloud layer that comes and goes: each pixel has a threshold, and shows
 * while `show(threshold, screen x)` says so.
 */
function blitCloud(
  f: Frame,
  d: Duo,
  thr: Uint8Array,
  lut: Uint32Array,
  offset: number,
  y0: number,
  y1: number,
  show: (th: number, x: number) => boolean
) {
  const { w } = f;
  const sw = d.w;
  const o = ((Math.round(offset) % sw) + sw) % sw;
  const dst = f.pixels;
  const idx = d.idx;
  for (let y = Math.max(0, y0); y < Math.min(f.h, y1); y++) {
    const row = y * sw;
    const out = y * w;
    let sx = o;
    for (let x = 0; x < w; x++) {
      const i = idx[row + sx]!;
      if (i && show(thr[row + sx]!, x)) {
        const p = lut[i]!;
        if (p) dst[out + x] = p;
      }
      if (++sx === sw) sx = 0;
    }
  }
}

/** Per-pixel thresholds for a cloud layer: soft patches that grow and shrink together. */
function thresholds(L: number, seed: number, per: number) {
  const out = new Uint8Array(L * 150);
  for (let x = 0; x < L; x++) {
    const n = pfbm1((x / L) * per, per, seed, 3);
    for (let y = 0; y < HORIZON + 4; y++) {
      const v = Math.max(0, Math.min(1, n * 1.15 - 0.08 + (y / HORIZON) * 0.1));
      out[y * L + x] = Math.round(v * 255);
    }
  }
  return out;
}

// ---------- sky ----------

type CloudTones = { hi: RGB; light: RGB; base: RGB; shadow: RGB; dark: RGB };

/**
 * A cumulus heap: overlapping domes on a flat base. The sun is low on the
 * left, so the left flanks and tops glow and the right sides and bellies
 * sit in shade. Draws with wrap-around so it tiles in a layer.
 */
function cumulus(
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
      (0.42 + 0.58 * Math.sin(Math.PI * (0.12 + 0.76 * u))) *
      (0.72 + hash2(i, 1, seed) * 0.4);
    domes.push([
      cx - wd / 2 + u * wd + (hash2(i, 2, seed) - 0.5) * 5,
      base - r * 0.55,
      r,
    ]);
  }
  // which pixels are cloud, worked out once over the heap's box
  const x0 = Math.floor(cx - wd / 2 - ht) - 3;
  const y0 = Math.floor(base - ht * 1.6) - 2;
  const bw = Math.ceil(wd + ht * 2) + 7;
  const bh = base - y0 + 3;
  const mask = new Uint8Array(bw * bh);
  for (let y = y0; y <= base; y++)
    for (let x = x0; x < x0 + bw; x++)
      if (domes.some(([a, b, r]) => (x - a) ** 2 + (y - b) ** 2 <= r * r))
        mask[(y - y0) * bw + (x - x0)] = 1;
  const inside = (x: number, y: number) =>
    y <= base &&
    x >= x0 &&
    x < x0 + bw &&
    y >= y0 &&
    mask[(y - y0) * bw + (x - x0)] === 1;
  for (let y = Math.floor(base - ht * 1.6); y <= base; y++) {
    for (let x = Math.floor(cx - wd / 2 - ht); x <= cx + wd / 2 + ht; x++) {
      if (!inside(x, y)) continue;
      let c = s.base;
      if (!inside(x - 3, y - 1)) c = s.light;
      if (!inside(x - 1, y - 1) && !inside(x - 2, y)) c = s.hi;
      if (!inside(x + 2, y + 1) || y >= base - 2) c = s.shadow;
      if (y >= base) c = s.dark;
      wset(f, x, y, c);
    }
  }
}

/** Fair-weather cloud: a bank of cumulus on the horizon, cirrus up high. */
function buildCumulus(P: Pal) {
  return layer(LC, 150, (f) => {
    const near = {
      hi: P.cloudHi,
      light: P.cloudLit,
      base: P.cloud,
      shadow: P.cloudSh,
      dark: P.cloudDk,
    };
    const farT = {
      hi: P.cloudLit,
      light: P.cloud,
      base: P.cloud,
      shadow: P.cloudSh,
      dark: P.cloudSh,
    };
    // high cirrus combed out by the wind
    for (let i = 0; i < 7; i++) {
      const x0 = (i / 7) * LC + hash2(i, 1, 82) * 120;
      const y = 9 + Math.round(hash2(i, 2, 82) * 18);
      const len = 40 + hash2(i, 3, 82) * 60;
      for (let k = 0; k < len; k++) {
        const u = k / len;
        const thick = Math.sin(u * Math.PI);
        const yy = y + Math.round(u * 3);
        wset(f, x0 + k, yy, thick > 0.5 ? P.cloudLit : P.cloud);
        if (thick > 0.75) wset(f, x0 + k + 3, yy + 1, P.cloud);
      }
    }
    for (let i = 0; i < 16; i++) {
      if (hash2(i, 5, 81) < 0.2) continue;
      const x = (i / 16) * LC + hash2(i, 1, 81) * 60;
      const isFar = hash2(i, 2, 81) > 0.5;
      const wd = 34 + hash2(i, 3, 81) * 60;
      const ht = (isFar ? 9 : 12) + hash2(i, 4, 81) * 9;
      cumulus(f, x, HORIZON + 3, wd, ht, i, isFar ? farT : near);
    }
    for (const [x, wd, ht] of [
      [420, 70, 24],
      [1180, 60, 21],
    ] as const)
      cumulus(f, x, HORIZON + 3, wd, ht, x, near);
    for (let i = 0; i < 6; i++) {
      const x = (i / 6) * LC + hash2(i, 6, 81) * 120;
      const y = 16 + hash2(i, 7, 81) * 12;
      cumulus(
        f,
        x,
        y,
        18 + hash2(i, 8, 81) * 26,
        4 + hash2(i, 9, 81) * 3,
        40 + i,
        {
          ...near,
          dark: P.cloudSh,
        }
      );
    }
  });
}

/** Rain cloud: decks of stratus with scalloped undersides, lighter low down. */
function buildDeck(P: Pal) {
  return layer(LC, 150, (f) => {
    const decks = [
      { y: 0, base: 11, c: [P.cloudSh, P.cloudDk], seed: 1, bump: 26 },
      { y: 13, base: 24, c: [P.cloud, P.cloudSh], seed: 2, bump: 21 },
      { y: 28, base: 37, c: [P.cloudLit, P.cloud], seed: 3, bump: 17 },
      { y: 41, base: 47, c: [P.cloudHi, P.cloudLit], seed: 4, bump: 13 },
    ];
    for (const d of decks) {
      for (let x = 0; x < LC; x++) {
        const on = pfbm1((x / LC) * 5, 5, d.seed * 7, 3);
        if (on < 0.4) continue;
        const ph = (x / d.bump) % 1;
        const k = Math.floor(x / d.bump);
        const amp = 1.5 + hash2(k, d.seed, 9) * 2.5;
        const belly = Math.round(
          d.base + Math.sqrt(Math.max(0, 1 - (2 * ph - 1) ** 2)) * amp
        );
        const top =
          d.y + Math.round((1 - Math.min(1, (on - 0.4) * 4)) * (d.base - d.y));
        for (let y = top; y <= belly; y++)
          f.set(x, y, y >= belly - 1 ? d.c[1]! : d.c[0]!);
      }
    }
  });
}

/** Ragged scud racing low under the deck. */
function buildScud(P: Pal) {
  return layer(LS, 150, (f) => {
    for (let i = 0; i < 9; i++) {
      const cx = ((i + hash2(i, 1, 61) * 0.6) / 9) * LS;
      const cy = 36 + Math.round(hash2(i, 2, 61) * 12);
      const wd = 30 + hash2(i, 3, 61) * 50;
      const ht = 3 + hash2(i, 4, 61) * 3;
      const blobs: [number, number, number, number][] = [];
      const n = 4 + Math.floor(hash2(i, 5, 61) * 4);
      for (let k = 0; k < n; k++)
        blobs.push([
          cx + (k / (n - 1) - 0.5) * wd,
          cy + (hash2(k, 6, i) - 0.5) * 3,
          wd / n + 4 + hash2(k, 7, i) * 6,
          ht * (0.6 + hash2(k, 8, i) * 0.6),
        ]);
      const inside = (x: number, y: number) =>
        blobs.some(
          ([a, b, rx, ry]) => ((x - a) / rx) ** 2 + ((y - b) / ry) ** 2 <= 1
        );
      for (let y = cy - 10; y <= cy + 8; y++)
        for (let x = Math.floor(cx - wd); x <= cx + wd; x++) {
          if (!inside(x, y)) continue;
          // torn underside: wisps drop out
          if (!inside(x, y + 2) && hash2(x >> 1, y, i) < 0.45) continue;
          const c = !inside(x, y - 1)
            ? P.scudLit
            : !inside(x, y + 1)
              ? P.scudSh
              : P.scud;
          wset(f, x, y, c);
        }
    }
  });
}

/** Sky and sea: clean bands; in the sun they bow up towards it on the left. */
function buildBase(w: number, P: Pal, wet: boolean) {
  const SKY = [
    P.sky0,
    P.sky1,
    P.sky2,
    P.sky3,
    P.sky4,
    P.sky5,
    P.sky6,
    P.sky7,
    P.sky8,
    P.sky9,
  ];
  const SEA = [P.seaW, P.sea0, P.sea1, P.sea2, P.sea3, P.sea4, P.sea5];
  const sunward = (x: number) =>
    wet ? 0 : Math.max(0, 1 - x / Math.max(200, w * 0.85)) ** 2;
  return layer(w, 150, (f) => {
    const bands = (
      y0: number,
      y1: number,
      ramp: RGB[],
      n: number,
      pos: (x: number, y: number) => number
    ) => {
      const at = (x: number, y: number) =>
        Math.max(0, Math.min(n - 1, Math.floor(pos(x, y) * n)));
      for (let y = y0; y < y1; y++)
        for (let x = 0; x < w; x++) {
          const k = at(x, y);
          const prev = y > y0 ? at(x, y - 1) : k;
          // a single checkered row where one band meets the next
          const kk = prev !== k && (x + y) % 2 === 0 ? prev : k;
          f.set(x, y, ramp[Math.round((kk / (n - 1)) * (ramp.length - 1))]!);
        }
    };
    if (wet) {
      bands(0, HORIZON, SKY, 12, (_x, y) => y / HORIZON);
      // light leaking in under the cloud deck, low over the sea
      f.hline(0, w, HORIZON - 3, P.sky9);
      f.hline(0, w, HORIZON - 2, P.silver);
      f.hline(0, w, HORIZON - 1, P.silver);
      f.hline(0, w, HORIZON, P.haze);
      bands(HORIZON + 1, WALL + 8, SEA.slice(1), 8, (_x, y) => {
        return (y - HORIZON - 1) / (WALL + 7 - HORIZON);
      });
      for (let x = 0; x < w; x++) {
        f.set(x, HORIZON + 1, P.haze);
        if ((x >> 1) % 3) f.set(x, HORIZON + 2, P.haze);
      }
    } else {
      bands(0, HORIZON, SKY, 15, (x, y) => {
        const v = y / HORIZON;
        return v * 0.86 + sunward(x) * 0.16 * (0.35 + v);
      });
      f.hline(0, w, HORIZON, P.haze);
      bands(HORIZON + 1, WALL + 8, SEA, 9, (x, y) => {
        const v = (y - HORIZON - 1) / (WALL + 7 - HORIZON);
        return 0.12 + v * 0.95 - sunward(x) * 0.18 * (1 - v);
      });
    }
  });
}

/** Izu Oshima on the horizon: a long low volcano. */
function buildOshima(w: number, P: Pal) {
  const oW = Math.round(Math.max(70, Math.min(140, w * 0.34)));
  const oX = Math.round(w * 0.5 + Math.min(150, w * 0.24) - oW / 2);
  return layer(w, 150, (f) => {
    for (let x = 0; x < oW; x++) {
      const u = (x / oW) * 2 - 1;
      const dome = Math.pow(Math.max(0, 1 - u * u), 0.55) * 7;
      const cone = Math.max(0, 1 - Math.abs(u + 0.08) * 7) * 2;
      const top = Math.round(HORIZON - dome - cone);
      for (let y = top; y < HORIZON; y++)
        f.set(oX + x, y, y === top && u < 0.3 ? P.oshimaTop : P.oshima);
    }
  });
}

/** The coast running away to the south, in the haze. */
function buildFar(P: Pal) {
  return layer(LF, 150, (f) => {
    const per = 9;
    const n = (x: number) => pfbm1((x / LF) * per, per, 404, 4);
    for (let x = 0; x < LF; x++) {
      const ht = Math.max(0, n(x) - 0.55) * 45;
      if (ht < 1) continue;
      const y0 = Math.round(FAR_WL - ht);
      for (let y = y0; y <= FAR_WL; y++)
        f.set(
          x,
          y,
          y === y0
            ? P.capeTop
            : y === FAR_WL
              ? P.haze
              : n(x + 3) < n(x - 3)
                ? P.capeSh
                : P.cape
        );
    }
  });
}

// ---------- the headland ----------

type Rock = {
  x0: number;
  x1: number;
  h: number;
  wl: number;
  stack: boolean;
  seed: number;
  left: number;
  right: number;
  tilt?: number;
};

type Column = {
  x0: number;
  x1: number;
  ht: number;
  tone: number;
  side: number;
  seed: number;
};

/** Splits a rock into lava columns of uneven width, each with its own height. */
function columns(r: Rock): Column[] {
  const out: Column[] = [];
  const wd = r.x1 - r.x0;
  for (let x = r.x0, i = 0; x < r.x1; i++) {
    const cw = Math.min(
      r.x1 - x,
      (r.stack ? 2 : 3) + Math.floor(hash2(i, 11, r.seed) * (r.stack ? 3 : 4))
    );
    const u = (x - r.x0 + cw / 2) / wd;
    const e = Math.min(1, u / r.left, (1 - u) / r.right);
    const shape = Math.pow(Math.max(0, e), r.stack ? 0.3 : 0.6);
    const jag = Math.round(hash2(i, 1, r.seed) * (r.stack ? 3 : 2.5));
    const ht = Math.max(
      1,
      Math.round((r.h + (r.tilt ?? 0) * (u - 0.5)) * shape) - jag
    );
    let tone = 2;
    const k = hash2(i, 4, r.seed);
    if (k < 0.25) tone = 3;
    else if (k > 0.75) tone = 1;
    const side = u < r.left ? 1 : u > 1 - r.right ? -1 : 0;
    out.push({ x0: x, x1: x + cw, ht, tone, side, seed: r.seed * 131 + i });
    x += cw;
  }
  return out;
}

/**
 * Columnar lava. In the rain it's lit flat from the grey sky above and dark
 * low down; in the sun the left flanks blaze, the right ones sit in shade.
 */
function drawRock(f: Frame, r: Rock, hs: Int16Array, P: Pal, wet: boolean) {
  const RAMP = [P.rockDk, P.rockSh, P.rock, P.rockLit, P.rockHi];
  const cols = columns(r);
  cols.forEach((c, ci) => {
    const top = r.wl - c.ht;
    const crack = top + Math.round(c.ht * (0.35 + hash2(1, 0, c.seed) * 0.3));
    const prev = cols[ci - 1];
    const base = wet ? c.tone : c.side === 1 ? 3 : c.side === -1 ? 1 : c.tone;
    for (let x = c.x0; x < c.x1; x++) {
      hs[x - r.x0] = c.ht;
      for (let y = top; y <= r.wl; y++) {
        const d = y - top;
        let tone = base;
        if (d === 0) tone = 4;
        else if (d === 1) tone = Math.min(4, base + 1);
        else if (d > c.ht * 0.55) tone--;
        if (
          !wet &&
          x === c.x0 &&
          (!prev || top < r.wl - prev.ht) &&
          d < c.ht * 0.7
        )
          tone = Math.min(4, base + 1); // a column standing proud catches the sun
        if (x === c.x1 - 1 && c.x1 - c.x0 > 2) tone = Math.min(tone, 1);
        if (y === crack && x > c.x0) tone = 1;
        if (y >= r.wl - 1) tone = 0;
        f.set(x, y, RAMP[Math.max(0, Math.min(4, tone))]!);
      }
    }
  });
}

/** A windswept black pine: a leaning trunk and flat, layered pads. */
function blackPine(
  f: Frame,
  P: Pal,
  x: number,
  base: number,
  h: number,
  lean: number,
  seed: number
) {
  let tx = x;
  for (let i = 0; i < h * 0.75; i++) {
    const v = i / h;
    tx = x + lean * v * v * h * 0.6 + Math.sin(v * 5 + seed) * 0.6;
    f.set(tx, base - i, i % 3 === 0 ? P.barkSh : P.bark);
    if (h > 16 && v < 0.5) f.set(tx + 1, base - i, P.barkSh);
  }
  const pads = Math.max(2, Math.round(h / 5));
  for (let k = 0; k < pads; k++) {
    const v = 0.45 + (k / pads) * 0.6;
    const py = Math.round(base - h * v);
    const px = Math.round(
      x + lean * v * v * h * 0.6 + (hash2(k, 1, seed) - 0.35) * h * 0.35
    );
    const hw = Math.max(
      2,
      Math.round(h * (0.42 - k * 0.07) + hash2(k, 2, seed) * 2)
    );
    for (let dy = -2; dy <= 1; dy++) {
      const span = dy === -2 ? hw - 2 : dy === 1 ? hw - 1 : hw;
      for (let dx = -span; dx <= span; dx++) {
        if (Math.abs(dx) === span && hash2(px + dx, py + dy, seed) > 0.6)
          continue;
        const c = dy === -2 ? P.hzPineHi : dy === 1 ? P.hzPineSh : P.hzPine;
        f.set(px + dx, py + dy, c);
      }
    }
  }
}

const ROCKS: Rock[] = [
  {
    x0: 40,
    x1: 250,
    h: 30,
    wl: WL,
    stack: false,
    seed: 1,
    left: 0.12,
    right: 0.1,
    tilt: 8,
  },
  {
    x0: 258,
    x1: 268,
    h: 20,
    wl: WL + 1,
    stack: true,
    seed: 2,
    left: 0.5,
    right: 0.5,
  },
  {
    x0: 274,
    x1: 279,
    h: 9,
    wl: WL + 1,
    stack: true,
    seed: 3,
    left: 0.5,
    right: 0.5,
  },
  {
    x0: 700,
    x1: 860,
    h: 22,
    wl: WL,
    stack: false,
    seed: 4,
    left: 0.2,
    right: 0.14,
    tilt: -6,
  },
  {
    x0: 870,
    x1: 880,
    h: 15,
    wl: WL + 1,
    stack: true,
    seed: 5,
    left: 0.5,
    right: 0.5,
  },
];

/** Two wooded lava headlands and their stacks, a lighthouse on the first. */
function buildMid(P: Pal, wet: boolean) {
  const lighthouse = { x: 0, y: 0 };
  const f = layer(LM, 150, (f) => {
    for (const r of ROCKS) {
      const hs = new Int16Array(r.x1 - r.x0);
      // the rock's dark reflection in the sea at its foot
      for (let x = r.x0 - 2; x < r.x1 + 2; x++) {
        f.set(x, r.wl + 1, P.seaRef);
        if (hash2(x >> 2, 9, r.seed) > 0.4) f.set(x, r.wl + 2, P.seaRef);
      }
      drawRock(f, r, hs, P, wet);
      // surf breaking at the foot
      for (let x = r.x0 - 1; x <= r.x1; x++)
        f.set(x, r.wl, hash2(x, 1, r.seed) > 0.4 ? P.foam : P.foamSh);
      if (r.stack) continue;
      // woods on top: a bumpy canopy that stops where the cliff drops
      canopy(
        f,
        (x, y) => {
          const ht = x >= r.x0 && x < r.x1 ? hs[x - r.x0]! : 0;
          if (ht < r.h * 0.7) return false;
          const t0 = r.wl - ht;
          return y >= t0 - 3 && y < t0 + 2;
        },
        { dark: P.hzDk, mid: P.hzSh, light: P.hz, hi: P.hzLit },
        {
          seed: 30 + r.seed,
          x0: r.x0,
          x1: r.x1,
          y0: r.wl - r.h - 8,
          y1: r.wl - r.h * 0.6,
          size: 2.2,
          step: 3,
        }
      );
      for (const [k, px, ph, lean] of [
        [0, 0.08, 10, -0.5],
        [1, 0.3, 12, 0.3],
        [2, 0.62, 9, 0.4],
        [3, 0.88, 11, 0.6],
      ] as const) {
        const x = Math.round(r.x0 + (r.x1 - r.x0) * px);
        const ht = hs[x - r.x0]!;
        if (ht > 4) blackPine(f, P, x, r.wl - ht + 1, ph, lean, x + k);
      }
      if (r.seed !== 1) continue;
      // a white lighthouse on the first headland
      const lx = r.x0 + Math.round((r.x1 - r.x0) * 0.45);
      const top = r.wl - hs[lx - r.x0]! + 2;
      lighthouse.x = lx;
      lighthouse.y = top - 18;
      f.rect(lx - 1, top - 15, 4, 15, P.white);
      f.rect(lx + 1, top - 15, 2, 15, P.whiteSh);
      f.rect(lx - 2, top - 16, 6, 1, P.whiteSh);
      f.rect(lx - 1, top - 18, 4, 2, P.rockDk);
      f.set(lx, top - 18, P.lamp);
      f.set(lx + 1, top - 17, P.lamp);
      f.rect(lx - 1, top - 19, 4, 1, P.white);
      f.set(lx + 1, top - 20, P.whiteSh);
    }
  });
  return { f, lighthouse };
}

// ---------- the boulder beach ----------

/** Round boulders piled under the sea wall, bigger towards us. */
function buildBeach(P: Pal, wet: boolean) {
  return layer(LB, 150, (f) => {
    for (let x = 0; x < LB; x++)
      for (let y = BEACH + 1; y < WALL + 4; y++)
        f.set(x, y, y < BEACH + 3 ? P.stoneSh : P.stoneDk);
    const rows = [
      { y: BEACH + 3, r: 2.6, n: LB / 6 },
      { y: BEACH + 7, r: 4, n: LB / 9 },
      { y: WALL + 2, r: 6, n: LB / 12 },
    ];
    rows.forEach((row, ri) => {
      for (let i = 0; i < row.n; i++) {
        const cx = Math.round((i + hash2(i, 1, ri) * 0.7) * (LB / row.n));
        const r = row.r * (0.75 + hash2(i, 2, ri) * 0.5);
        const cy = row.y + Math.round((hash2(i, 3, ri) - 0.5) * 2);
        const warm = hash2(i, 4, ri) > 0.7;
        const ramp = warm
          ? [P.stoneDk, P.brownSh, P.brown, P.brownLit, P.stoneHi]
          : [P.stoneDk, P.stoneSh, P.stone, P.stoneLit, P.stoneHi];
        const sq = 0.72 + hash2(i, 5, ri) * 0.15;
        for (let dy = -Math.ceil(r * sq); dy <= Math.ceil(r * sq); dy++)
          for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
            const d = Math.hypot(dx / r, dy / (r * sq));
            if (d > 1.05) continue;
            // wet: lit from the sky above, a hard sheen on top; dry: lit
            // from the low sun on the left
            const l = wet
              ? -dy / (r * sq) - dx / (r * 3)
              : (-dy / (r * sq)) * 0.6 - (dx / r) * 0.8;
            let k = 2;
            if (l > 0.5) k = 3;
            if (l > 0.82 && d > 0.45) k = 4;
            if (l < -0.35) k = 1;
            if (d > 0.92 && dy > 0) k = 0;
            wset(f, cx + dx, cy + dy, ramp[k]!);
          }
        if (r > 2.5)
          wset(
            f,
            cx - Math.round(r * (wet ? 0.3 : 0.5)),
            cy - Math.round(r * sq * (wet ? 0.6 : 0.4)),
            P.stoneSpec
          );
      }
    });
  });
}

// ---------- the road ----------

/** Paints colour c over what's at (x, y), k of the way back towards it. */
function reflectInto(f: Frame, x: number, y: number, c: RGB, k = 0.55) {
  if (!f.opaque(x, y)) return;
  wset(f, x, y, lerpRGB(c, f.get(x, y), k));
}

const POLES: number[] = [];
for (let x = 70; x < LR; x += 180) POLES.push(x);
const VENDING_X = 470;
const MIRROR_X = 900;
const TRAIL_X = 260; // the first dirt-track turn-off on the verge
// the low bush at each trail mouth where a wild boar lies up
const BUSH_DX = -24;
const BUSH_H = 15;
const BUSH_R = 15; // how far its leaves can reach from its middle
// the coin binoculars stand at the foot of the sea wall
const SCOPE_BASE = ROAD;
const SCOPE_TOP = SCOPE_BASE - SCOPE_H + 1;
const SCOPE_EYE_Y = SCOPE_TOP + SCOPE_EYE[1];
// the wild-boar warning signs, also at the foot of the wall: a yellow
// diamond with a black boar on it, on a post
const BOAR_SIGN_R = 9; // half the diamond's diagonal
const BOAR_SIGN_Y = 62; // its middle
// prettier-ignore
const BOAR_GLYPH = [
  '.......b.bb..',
  '....bbbbbbb..',
  '..bbbbbbbbbb.',
  'bbbbbbbbbbbbb',
  '.bbbbbbbbbb.b',
  '..bbbbbbbb...',
  '..b.b...b.b..',
  '..b.b...b.b..',
];

type Layout = { trails: number[]; scopes: number[]; boars: number[] };

/**
 * Where the trail mouths (sign and bushes), the coin binoculars and the
 * boar warning signs go along the road, for a screen w wide: evenly, a
 * little more often than once a screen's width, so one of each is nearly
 * always in view. The binoculars sit halfway between trail mouths and the
 * boar signs three quarters of the way, nudged clear of the poles, the
 * vending machines, the mirror and each other.
 */
function layout(w: number): Layout {
  const n = Math.max(1, Math.ceil(LR / (w / 0.86)));
  const S = LR / n;
  // (no trail mouth straddles the layer's seam)
  const p = Math.min(TRAIL_X, S - 45);
  const trails = Array.from({ length: n }, (_, k) => Math.round(p + k * S));
  const blocked: [number, number][] = [
    ...POLES.map((x) => [x - 13, x + 5] as [number, number]),
    [VENDING_X - 16, VENDING_X + 42],
    [MIRROR_X - 13, MIRROR_X + 6],
    [-Infinity, 6],
    [LR - SCOPE_W - 6, Infinity],
  ];
  const free = (x: number) => blocked.every(([a, b]) => x < a || x > b);
  const scopes = trails.map((tx) => {
    const ideal = Math.round(tx + S / 2) % LR;
    for (let d = 0; d < 120; d++)
      for (const x of [ideal + d, ideal - d]) if (free(x)) return x;
    return ideal;
  });
  // a boar sign's middle stays well clear of everything you can click up
  // there (so taps meant for one don't land on the other), and of the poles
  const near = (x: number, c: number, d: number) =>
    Math.abs(x - c) < d || Math.abs(x - c - LR) < d || Math.abs(x - c + LR) < d;
  const clear = (x: number) =>
    x > 14 &&
    x < LR - 14 &&
    !POLES.some((p) => near(x, p, 13)) &&
    !near(x, VENDING_X + 17, 17 + 26) &&
    !near(x, MIRROR_X + 1, 38) &&
    !scopes.some((sx) => near(x, sx + SCOPE_EYE[0], 32));
  const boars = trails.map((tx) => {
    const ideal = Math.round(tx + (S * 3) / 4) % LR;
    for (let d = 0; d < 160; d++)
      for (const x of [ideal + d, ideal - d]) if (clear(x)) return x;
    return ideal;
  });
  return { trails, scopes, boars };
}

/** A boar warning sign with its middle at (x, BOAR_SIGN_Y), post to the road. */
function drawBoarSign(f: Frame, P: Pal, x: number) {
  f.rect(
    x - 1,
    BOAR_SIGN_Y + BOAR_SIGN_R,
    2,
    ROAD - BOAR_SIGN_Y - BOAR_SIGN_R,
    P.pole
  );
  f.vline(x, BOAR_SIGN_Y + BOAR_SIGN_R, ROAD - 1, P.poleSh);
  const R = BOAR_SIGN_R;
  for (let dy = -R; dy <= R; dy++) {
    const half = R - Math.abs(dy);
    for (let dx = -half; dx <= half; dx++) {
      let c = P.signY;
      if (Math.abs(dx) === half) c = P.signK;
      // a sheen along its top left edge
      else if (dx === -half + 1 && dy < 0) c = P.signHi;
      f.set(x + dx, BOAR_SIGN_Y + dy, c);
    }
  }
  sprite(f, BOAR_GLYPH, x - 6, BOAR_SIGN_Y - 4, { b: P.signK });
}

/**
 * The road layer. Wet, the far side shines with the sky and everything by
 * the road is mirrored in it; dry, the low sun throws long shadows across it.
 */
function buildRoad(P: Pal, wet: boolean, L: Layout) {
  const shade = (f: Frame, x: number, y: number, a = 0.5) =>
    wblend(f, x, y, P.shade, a);
  return layer(LR, 150, (f) => {
    for (let x = 0; x < LR; x++) {
      f.set(x, ROAD, P.curb);
      f.set(x, ROAD + 1, P.curbSh);
      for (let y = ROAD + 2; y < EDGE + 1; y++) {
        let c = P.asphalt;
        const v = (y - ROAD) / (EDGE - ROAD);
        if (v < 0.22) c = P.sheen;
        else if (v < 0.4) c = P.asphaltLt;
        else if (v > 0.8) c = P.asphaltDk;
        if (y === ROAD + 4) c = P.lineW;
        if (y === CENTRE) c = P.lineY;
        if (y === CENTRE + 1) c = P.lineYSh;
        if (y === EDGE) c = P.lineW;
        f.set(x, y, c);
      }
      f.set(x, EDGE + 1, P.ditchLt);
      f.set(x, EDGE + 2, P.ditchSh);
      f.set(x, EDGE + 3, P.ditch);
      for (let y = VERGE; y < 150; y++)
        f.set(
          x,
          y,
          y === VERGE ? P.grassLit : y < VERGE + 5 ? P.grass : P.grassSh
        );
    }
    for (let i = 0; i < LR / 10; i++)
      tuft(
        f,
        P,
        Math.round(hash2(i, 1, 61) * LR),
        VERGE + 1 + Math.round(hash2(i, 2, 61) * 6),
        3 + Math.round(hash2(i, 3, 61) * 2),
        i
      );
    // puddles in the ruts, holding the sky
    if (wet)
      for (let i = 0; i < 14; i++) {
        const x = Math.round(hash2(i, 1, 55) * LR);
        const len = 8 + Math.round(hash2(i, 2, 55) * 22);
        const y = [ROAD + 7, CENTRE + 4, CENTRE + 9, ROAD + 11][i % 4]!;
        for (let k = 0; k < len; k++) {
          const e = k === 0 || k === len - 1;
          wset(f, x + k, y, e ? P.sheen : P.sheenHi);
          if (!e && k > 1 && k < len - 2) wset(f, x + k, y + 1, P.sheen);
        }
      }

    // the sea wall: a concrete parapet with a rounded lip, drips and moss
    for (let x = 0; x < LR; x++) {
      f.set(x, WALL, P.wallTop);
      f.set(x, WALL + 1, P.wallHi);
      for (let y = WALL + 2; y < ROAD; y++) {
        let c = y < WALL + 4 ? P.wall : P.wallSh;
        if (y === ROAD - 1) c = P.moss;
        if (hash2(x >> 1, 3, 71) > 0.82 && y > WALL + 2) c = P.wallWet;
        f.set(x, y, c);
      }
      if (x % 24 === 0)
        for (let y = WALL + 1; y < ROAD; y++) f.set(x, y, P.wallDk);
      if (x % 48 === 30) {
        f.set(x, WALL + 4, P.wallDk);
        f.set(x + 1, WALL + 4, P.wallDk);
        f.set(x, WALL + 5, P.wallWet); // a drain hole, weeping
      }
    }
    for (let x = 0; x < LR; x++) {
      if (wet)
        // the wall mirrored on the wet far edge of the road
        for (let k = 0; k < 3; k++)
          reflectInto(
            f,
            x,
            ROAD + 2 + k,
            k ? P.wall : P.wallHi,
            0.5 + k * 0.15
          );
      else {
        // the wall's shadow along the far edge
        shade(f, x, ROAD + 2, 0.5);
        shade(f, x, ROAD + 3, 0.3);
      }
    }

    // wires first (behind the poles), sagging, beaded with drops in the rain
    for (let i = 0; i < POLES.length; i++) {
      const a = POLES[i]!;
      const b = i + 1 < POLES.length ? POLES[i + 1]! : POLES[0]! + LR;
      for (const [dx, y, sag] of [
        [-6, 30, 5],
        [0, 37, 7],
      ] as const) {
        for (let x = a + dx; x <= b + dx; x++) {
          const u = (x - a - dx) / (b - a);
          const wy = Math.round(y + Math.sin(u * Math.PI) * sag);
          wset(f, x, wy, P.wire);
          if (wet && hash2(x, y, 13) > 0.93) wset(f, x, wy + 1, P.drop);
        }
      }
    }
    POLES.forEach((x, i) => {
      f.rect(x - 1, 27, 3, ROAD - 27, P.pole);
      f.vline(x - 1, 27, ROAD - 1, P.poleHi);
      f.vline(x + 1, 27, ROAD - 1, P.poleSh);
      for (let y = 50; y < WALL - 4; y += 5)
        f.set(x + ((y / 5) % 2 ? 2 : -2), y, P.arm);
      f.rect(x - 7, 30, 15, 2, P.arm);
      f.set(x - 6, 29, P.insul);
      f.set(x, 36, P.insul);
      if (i % 2 === 0) {
        f.rect(x + 2, 40, 4, 7, P.trans);
        f.vline(x + 5, 40, 46, P.transSh);
        f.line(x + 3, 39, x + 5, 31, P.wire);
      }
      if (wet)
        // its reflection streaking down the far lane
        for (let k = 0; k < 12; k++) {
          if (k % 3 === 2) continue;
          reflectInto(f, x, ROAD + 2 + k, P.poleHi, 0.45 + k * 0.04);
          reflectInto(f, x + (k % 2), ROAD + 2 + k, P.pole, 0.55 + k * 0.03);
        }
      else
        // its long shadow across the far lane
        for (let k = 0; k < 70; k++) {
          const sx = x + 1 + k * 1.05;
          const sy = ROAD + 2 + Math.round(k * SHADOW_Y * 1.2);
          if (sy > CENTRE - 1) break;
          shade(f, sx, sy);
          shade(f, sx + 1, sy);
        }
    });
    // curve mirror on its orange pole
    f.rect(MIRROR_X, 62, 2, ROAD - 62, P.mirrorPole);
    f.vline(MIRROR_X + 1, 62, ROAD - 1, P.mirrorPoleSh);
    for (let dy = -6; dy <= 6; dy++)
      for (let dx = -5; dx <= 5; dx++) {
        const d = (dx / 5.5) ** 2 + (dy / 6.5) ** 2;
        if (d > 1) continue;
        let c: RGB = dy < 1 ? P.mirrorSky : P.mirrorRoad;
        if (dy === 1) c = P.wall;
        if (d > 0.62) c = dx > 2 ? P.mirrorPoleSh : P.mirrorPole;
        else if (dx === -2 && dy < -1 && dy > -5) c = P.white;
        f.set(MIRROR_X + 1 + dx, 56 + dy, c);
      }
    f.hline(MIRROR_X - 3, MIRROR_X + 5, 49, P.mirrorPoleSh);
    if (wet)
      for (let k = 0; k < 10; k++)
        if (k % 3 !== 2)
          reflectInto(f, MIRROR_X, ROAD + 2 + k, P.mirrorPole, 0.45);
    // the wild-boar warning signs
    for (const bx of L.boars) {
      if (wet) {
        // the sign's reflection, yellow, down the far lane
        for (let k = 0; k < 10; k++)
          if (k % 3 !== 2)
            reflectInto(
              f,
              bx,
              ROAD + 2 + k,
              k < 6 ? P.signY : P.pole,
              0.5 + k * 0.04
            );
      } else
        for (let k = 0; k < 46; k++) {
          const sy = ROAD + 2 + Math.round(k * SHADOW_Y * 1.2);
          shade(f, bx + k * 1.05, sy, 0.45);
          if (k > 28 && k < 44) shade(f, bx + k * 1.05, sy + 1, 0.4);
        }
      drawBoarSign(f, P, bx);
    }
    // round orange delineators along the wall
    for (let x = 12; x < LR; x += 48) {
      f.rect(x, WALL - 3, 2, 2, P.reflector);
      f.set(x, WALL - 3, P.reflectorHi);
      f.vline(x + 1, WALL - 1, WALL, P.postSh);
      if (wet) {
        reflectInto(f, x, ROAD + 3, P.reflector, 0.4);
        reflectInto(f, x, ROAD + 5, P.reflector, 0.6);
      }
    }
    // the coin binoculars at the foot of the wall, looking out to sea
    for (const sx of L.scopes) {
      if (wet) {
        // the post's reflection streaking down the far lane
        for (let k = 0; k < 9; k++)
          if (k % 3 !== 2)
            reflectInto(f, sx + 3, ROAD + 2 + k, P.scopePost, 0.5 + k * 0.04);
      } else {
        // and its long shadow, the head's a blob at the end of it
        for (let k = 0; k < 44; k++) {
          const sy = ROAD + 2 + Math.round(k * SHADOW_Y * 1.2);
          shade(f, sx + 4 + k * 1.05, sy, 0.45);
          if (k > 30) shade(f, sx + 4 + k * 1.05, sy + 1, 0.4);
        }
      }
      drawScope(f, sx, SCOPE_BASE, scopeColours(P));
    }
    // white posts along the near verge
    for (let x = 30; x < LR; x += 160) {
      if (L.trails.some((tx) => Math.abs(x - tx) < 40)) continue;
      if (!wet)
        for (let k = 0; k < 14; k++)
          shade(f, x + 2 + k, VERGE + 1 + (k >> 3), 0.35);
      f.rect(x, VERGE - 9, 2, 11, P.post);
      f.vline(x + 1, VERGE - 9, VERGE + 1, P.postSh);
      f.rect(x, VERGE - 9, 2, 2, P.reflector);
      f.set(x, VERGE - 9, P.reflectorHi);
    }
    // the vending machines, set into a gap in the wall
    const vx = VENDING_X;
    f.rect(vx - 6, WALL, 46, ROAD - WALL, P.wallSh);
    f.hline(vx - 6, vx + 39, ROAD - 1, P.moss);
    if (!wet)
      // their long shadow down the far lane
      for (let k = 0; k < 52; k++)
        for (let y = ROAD + 2; y < ROAD + 2 + Math.max(0, 6 - (k >> 3)); y++)
          shade(f, vx + 34 + k, y, 0.4);
    drawVending(f, P, vx, P.vmWhite, P.vmWhiteSh, P.vmBlue, P.vmBlueHi);
    drawVending(f, P, vx + 18, P.vmRed, P.vmRedSh, P.vmRedSh, P.vmRedHi);
    f.rect(vx - 4, ROAD, 44, 2, P.curbSh);
    if (wet)
      // their light smeared down the wet road in broken vertical streaks
      for (let x = vx; x < vx + 34; x++) {
        if (x === vx + 16 || x === vx + 17) continue;
        const red = x >= vx + 18;
        const lx = red ? x - vx - 18 : x - vx;
        const glass = lx >= 1 && lx < VM_W - 2;
        const c = glass ? P.vmGlass : red ? P.vmRed : P.vmWhite;
        const len = 6 + Math.round(hash2(x, 1, 7) * (glass ? 12 : 5));
        for (let k = 0; k < len; k++) {
          if (hash2(x, k, 8) < 0.28) continue; // raindrops breaking it up
          reflectInto(f, x, ROAD + 2 + k, c, 0.35 + (k / len) * 0.55);
        }
      }
    // the dirt-track turn-offs: muddy mouths in the verge, rutted, puddled
    for (const tx of L.trails)
      for (let y = EDGE + 1; y < 150; y++) {
        const v = (y - EDGE) / (150 - EDGE);
        const half = 7 + v * 9;
        const cx = tx - v * 10;
        for (let x = Math.round(cx - half); x <= cx + half; x++) {
          const e = Math.abs(x - cx) / half;
          let c = P.mud;
          if (e > 0.8) c = P.mudSh;
          else if (Math.abs(Math.abs(x - cx) - half * 0.35) < 0.8) c = P.mudSh; // tyre ruts
          if (hash2(x, y, 81) > 0.9 && e < 0.7) c = P.mudHi; // puddles
          wset(f, x, y, c);
        }
      }
  });
}

const scopeColours = (P: Pal): ScopeColours => ({
  hi: P.scopeHi,
  body: P.scope,
  sh: P.scopeSh,
  eye: P.scopeEye,
  lens: P.scopeLens,
  yoke: P.scopeYoke,
  coin: P.scopeCoin,
  post: P.scopePost,
  postSh: P.scopePostSh,
});

/** A low leafy bush on the verge, hh tall, rooted below the bottom edge. */
function bush(f: Frame, P: Pal, cx: number, hh: number) {
  const cy = 150 - hh * 0.45;
  canopy(
    f,
    (x, y) =>
      ((x - cx) / (hh * 0.75)) ** 2 + ((y - cy) / (hh * 0.5)) ** 2 < 1 &&
      y < 150,
    { dark: P.leafDk, mid: P.leafSh, light: P.leaf, hi: P.leafLit },
    {
      seed: cx,
      x0: cx - hh,
      x1: cx + hh,
      y0: 150 - hh,
      y1: 150,
      size: 2.4,
      step: 3,
    }
  );
}

/** Each boar bush's outline: its top row per column, its right edge per row. */
function bushOutlines(xs: number[]) {
  // the same leaves as on the front layer (canopy's grid is anchored to x)
  const g = new Frame(LR, 150);
  for (const bx of xs) bush(g, SUN, bx, BUSH_H);
  return xs.map((bx) => {
    const top = new Int16Array(2 * BUSH_R + 1).fill(150);
    const right = new Int16Array(150).fill(-99);
    for (let y = 0; y < 150; y++)
      for (let dx = -BUSH_R; dx <= BUSH_R; dx++)
        if (g.opaque(bx + dx, y)) {
          if (top[dx + BUSH_R] === 150) top[dx + BUSH_R] = y;
          right[y] = dx;
        }
    return { top, right };
  });
}

/**
 * What stands on the near verge, in front of the riders: at each trail
 * mouth, the bushes (the boar lies up in the big one on the left) and the
 * wooden trail sign with its arrow.
 */
function buildFront(P: Pal, L: Layout) {
  return layer(LR, 150, (f) => {
    for (const tx of L.trails) {
      for (const [ox, hh] of [
        [BUSH_DX, BUSH_H],
        [24, 12],
        [33, 9],
      ] as const)
        bush(f, P, tx + ox, hh);
      const sx = tx + 14;
      f.rect(sx, VERGE - 14, 2, 20, P.wood);
      f.vline(sx + 1, VERGE - 14, VERGE + 5, P.woodSh);
      f.rect(sx - 7, VERGE - 19, 14, 6, P.wood);
      f.hline(sx - 7, sx + 6, VERGE - 19, P.woodHi);
      f.hline(sx - 7, sx + 6, VERGE - 14, P.woodSh);
      sprite(
        f,
        ['..w.........', '.wwwww.w.w.w', '..w.....w.w.'],
        sx - 6,
        VERGE - 18,
        { w: P.glyph }
      );
    }
  });
}

const VM_W = 16;
const VM_TOP = ROAD - 31;

function drawVending(
  f: Frame,
  P: Pal,
  x: number,
  body: RGB,
  bodySh: RGB,
  trim: RGB,
  trimHi: RGB
) {
  const top = VM_TOP;
  f.rect(x, top, VM_W, ROAD - top + 1, body);
  f.vline(x + VM_W - 1, top, ROAD, bodySh);
  f.rect(x, top, VM_W, 3, trim);
  f.hline(x, x + VM_W - 1, top, trimHi);
  f.rect(x + 1, top + 4, VM_W - 3, 13, P.vmGlass);
  const cans = [P.can1, P.can2, P.can3, P.can4, P.can5, P.can6];
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 6; k++) {
      const cx = x + 2 + k * 2;
      const cy = top + 5 + r * 4;
      const c = cans[Math.floor(hash2(k, r, x) * cans.length)]!;
      f.vline(cx, cy, cy + 2, c);
      f.set(cx, cy, c === P.can5 ? P.whiteSh : P.white);
      f.set(cx, cy + 3, trim === P.vmBlue ? P.can2 : P.can1);
    }
  }
  f.rect(x + VM_W - 5, top + 18, 3, 4, P.vmDark);
  f.set(x + VM_W - 4, top + 19, P.can4);
  // the drop tray, centred under the glass
  f.rect(x + 2, ROAD - 7, VM_W - 5, 4, P.vmDark);
  f.hline(x + 2, x + VM_W - 4, ROAD - 7, bodySh);
  f.hline(x, x + VM_W - 1, ROAD, P.vmDark);
}

type Put = (x: number, y: number, c: RGB) => void;

/** A susuki tassel hanging over. */
function plume(
  P: Pal,
  put: Put,
  x: number,
  y: number,
  len: number,
  droop: number,
  seed: number
) {
  let px = x;
  let py = y;
  for (let i = 0; i < len; i++) {
    const u = i / (len - 1);
    const ang = -Math.PI / 2 - droop * u * 2.3;
    px += Math.cos(ang);
    py += Math.sin(ang);
    const wd =
      u < 0.15 ? 0 : Math.sin(Math.min(1, (u - 0.1) * 1.25) * Math.PI) * 1.2;
    const nx = -Math.sin(ang);
    const ny = Math.cos(ang);
    for (let k = -Math.ceil(wd); k <= Math.ceil(wd); k++) {
      if (Math.abs(k) > wd + 0.3) continue;
      const c = k < 0 ? P.susHi : k > 0 ? P.susSh : P.sus;
      put(Math.round(px + nx * k), Math.round(py + ny * k), c);
    }
    if (wd > 0.8 && hash2(i, 9, seed) > 0.6)
      put(
        Math.round(px - nx * (wd + 1)),
        Math.round(py - ny * (wd + 1)),
        P.sus
      );
  }
}

/** A clump of susuki: a fountain of blades and nodding tassels. */
function susuki(
  f: Frame,
  P: Pal,
  x: number,
  base: number,
  h: number,
  seed: number
) {
  const put: Put = (px, py, c) => wset(f, px, py, c);
  for (let k = 0; k < 7; k++) {
    const dir = k % 2 ? 1 : -1;
    const len = h * (0.5 + hash2(k, 1, seed) * 0.35);
    const spread = 0.3 + hash2(k, 2, seed) * 0.35;
    for (let i = 0; i < len; i++) {
      const v = i / len;
      put(
        Math.round(x + dir * (Math.pow(v, 2) * len * spread + (k >> 1) * 0.7)),
        Math.round(base - v * len * (1 - 0.5 * v)),
        v > 0.7 ? P.susLeafHi : v > 0.3 ? P.susLeaf : P.susLeafSh
      );
    }
  }
  const n = 3 + Math.round(hash2(0, 3, seed) * 2);
  for (let k = 0; k < n; k++) {
    const sh = h * (0.68 + hash2(k, 4, seed) * 0.3);
    const sx = x + Math.round((k - (n - 1) / 2) * 2);
    const lean = (hash2(k, 5, seed) - 0.6) * 0.3;
    let tx = sx;
    let ty = base;
    for (let i = 0; i < sh; i++) {
      tx = sx + (lean * i * i) / sh;
      ty = base - i;
      put(Math.round(tx), ty, P.susStem);
    }
    plume(
      P,
      put,
      Math.round(tx),
      ty,
      Math.round(4 + sh * 0.4),
      0.6 + hash2(k, 6, seed) * 0.4,
      k + seed
    );
  }
}

/** A little tuft of grass, blades fanning out, tips catching the light. */
function tuft(f: Frame, P: Pal, x: number, y: number, h: number, seed: number) {
  for (let k = -1; k <= 1; k++) {
    const bh = h - Math.abs(k) - (hash2(k, 1, seed) > 0.5 ? 1 : 0);
    for (let j = 0; j < bh; j++)
      wset(
        f,
        x + k * (j > 0 ? 1 : 0),
        y - j,
        j === bh - 1 ? P.grassHi : j > 0 ? P.grassLit : P.grassSh
      );
  }
}

/** The near verge, rushing past: grass and susuki. */
function buildFore(P: Pal) {
  return layer(LG, 150, (f) => {
    const tops = new Int16Array(LG);
    for (let x = 0; x < LG; x++) {
      const top = 145 + Math.round(pfbm1((x / LG) * 20, 20, 5, 3) * 5 - 1);
      tops[x] = top;
      for (let y = top; y < 150; y++)
        f.set(
          x,
          y,
          y === top ? P.grassLit : y === top + 1 ? P.grass : P.grassSh
        );
    }
    for (let i = 0; i < LG / 7; i++) {
      const x = Math.round(hash2(i, 1, 33) * LG);
      tuft(f, P, x, tops[x]! + 1, 3 + Math.round(hash2(i, 3, 33) * 3), i + 7);
    }
    for (let i = 0; i < 9; i++) {
      const x = Math.round(((i + hash2(i, 1, 44) * 0.6) / 9) * LG);
      susuki(f, P, x, 152, 15 + Math.round(hash2(i, 2, 44) * 6), 100 + i);
    }
  });
}

// ---------- the forest at night ----------

const N = RAIN; // the night colours are the same whatever the weather

/**
 * Height of the forest track at layer x: ruts and roots to bounce over. It
 * repeats every LN, like the ground layer drawn from it, so the riders stay
 * on the track they're shown on lap after lap.
 */
const trackAt = (lx: number) => {
  const u = (lx / LN) * Math.PI * 2;
  return Math.round(
    Math.sin(u * 10) * 1.4 +
      Math.sin(u * 24 + 1.7) * 0.8 +
      Math.sin(u * 4) * 1.6
  );
};

function buildForest() {
  const back = layer(LN, 150, (f) => {
    // far trunks: barely darker than the night, until a beam finds them
    for (let i = 0; i < LN / 13; i++) {
      const x = Math.round(((i + hash2(i, 1, 91) * 0.8) / (LN / 13)) * LN);
      const wd = 1 + Math.round(hash2(i, 2, 91) * 2);
      const top = 10 + Math.round(hash2(i, 3, 91) * 20);
      for (let y = top; y < TRAIL_G - 8; y++)
        for (let k = 0; k < wd; k++) wset(f, x + k, y, N.nFar);
    }
    // the canopy closing over, ragged against the sky
    for (let x = 0; x < LN; x++) {
      const top = 18 + Math.round(pfbm1((x / LN) * 30, 30, 92, 3) * 22);
      for (let y = 0; y < top; y++)
        f.set(x, y, y === top - 1 ? N.nFarHi : N.nFar);
    }
  });
  const mid = layer(LN, 150, (f) => {
    // cedar trunks, straight and tall, a faint edge of sky on their left
    for (let i = 0; i < LN / 34; i++) {
      const x = Math.round(((i + hash2(i, 1, 93) * 0.7) / (LN / 34)) * LN);
      const wd = 4 + Math.round(hash2(i, 2, 93) * 5);
      for (let y = 0; y < TRAIL_G - 4; y++)
        for (let k = 0; k < wd; k++)
          wset(f, x + k, y, k === 0 ? N.nMidHi : N.nMid);
      // a dead branch or two sticking out
      for (let j = 0; j < 2; j++) {
        const by = 30 + Math.round(hash2(i, 4 + j, 93) * 50);
        const dir = j ? 1 : -1;
        const len = 4 + Math.round(hash2(i, 6 + j, 93) * 6);
        for (let k = 1; k <= len; k++)
          wset(
            f,
            x + (dir > 0 ? wd - 1 + k : -k),
            by - Math.round(k * 0.4),
            N.nMid
          );
      }
    }
    // ferns and bushes along the far side of the track
    for (let x = 0; x < LN; x++) {
      const top =
        TRAIL_G - 12 + Math.round(pfbm1((x / LN) * 50, 50, 94, 3) * 7);
      for (let y = top; y < TRAIL_G - 4; y++)
        f.set(x, y, y === top ? N.nFernHi : N.nFern);
    }
  });
  const ground = layer(LN, 150, (f) => {
    for (let x = 0; x < LN; x++) {
      const g = TRAIL_G + trackAt(x);
      for (let y = g - 6; y < 150; y++) {
        let c = N.nGround;
        if (y === g - 6) c = N.nGroundHi;
        if (y === g - 1 || y === g + 6) c = N.nRut;
        if (y > 141) c = y === 142 ? N.nFernHi : N.nFern;
        f.set(x, y, c);
      }
    }
    // puddles in the ruts
    for (let i = 0; i < 18; i++) {
      const x = Math.round(hash2(i, 1, 95) * LN);
      const y = TRAIL_G + 2 + trackAt(x) + Math.round(hash2(i, 2, 95) * 3);
      const len = 6 + Math.round(hash2(i, 3, 95) * 12);
      for (let k = 0; k < len; k++) wset(f, x + k, y, N.nPuddle);
    }
  });
  const near = layer(LN, 150, (f) => {
    // big trunks right in front of us, now and then
    for (let i = 0; i < 5; i++) {
      const x = Math.round(((i + hash2(i, 1, 96)) / 5) * LN);
      const wd = 9 + Math.round(hash2(i, 2, 96) * 6);
      for (let y = 0; y < 150; y++)
        for (let k = 0; k < wd; k++)
          wset(f, x + k + Math.round(Math.sin(y / 31 + i) * 2), y, N.nNear);
    }
  });
  return { back, mid, ground, near };
}

/** A pixel caught in a headlight: brighter and warmer, shapes kept. */
function lit(p: number, s: number) {
  const r = p & 0xff;
  const g = (p >>> 8) & 0xff;
  const b = (p >>> 16) & 0xff;
  const k = 1 + 4.2 * s;
  const R = Math.min(255, r * k + 46 * s);
  const G = Math.min(255, g * k + 36 * s);
  const B = Math.min(255, b * k + 18 * s);
  return (0xff000000 | (B << 16) | (G << 8) | R) >>> 0;
}

// ---------- life ----------

const GULL = [
  ['k...k', '.w.w.', '..w..'],
  ['.....', 'kwwwk', '..w..'],
  ['.....', '..w..', 'kw.wk'],
];

// a black kite gliding or banking (facing right)
const KITE_GLIDE = [
  'x.x.......x.x',
  '.xxx.....xxx.',
  '..xxxx#xxxx..',
  '.....xxx.....',
  '.....x.x.....',
];
const KITE_BANK = [
  '.............',
  'xxxx.....xxxx',
  '...xxx#xxx...',
  '.....xxx.....',
  '.....x.x.....',
];

// a wild boar, side on, facing right: bristly hump over the shoulders, a
// long wedge of a head, tusks, thin legs; two trotting frames
// prettier-ignore
const BOAR_BODY = [
  '..........hhh.......',
  '......hhhhhhhhh.....',
  '...hhhbbbbbbbbbhe...',
  '.thbbbbbbbbbbbbbbb..',
  '..bbbbbbbbbbbbbbbbbb',
  '..bbbbbbbbbbbbbbbbbn',
  '..sbbbbbbbbbbbbbsss.',
  '...sss......ssss.k..',
];
const BOAR_LEGS = [
  ['...d.d......d..d....', '...d..d.....d...d...'],
  ['....dd.......dd.....', '....dd.......dd.....'],
];

function drawBoar(
  f: Frame,
  P: Pal,
  x: number,
  y: number,
  dir: number,
  t: number,
  dark = false
) {
  const legs = BOAR_LEGS[Math.floor(t / 90) % 2]!;
  sprite(
    f,
    [...BOAR_BODY, ...legs],
    x - 10,
    y - 10,
    {
      h: dark ? N.nGroundHi : P.boarHi,
      b: dark ? N.nRut : P.boar,
      s: dark ? N.nRut : P.boarSh,
      n: dark ? N.nRut : P.boarDk,
      e: dark ? N.nRut : P.boarDk,
      t: dark ? N.nRut : P.boarDk,
      k: P.tusk,
      d: dark ? N.nRut : P.boarDk,
    },
    dir < 0
  );
}

// a wild boar piglet (uribō), facing right: round, with pale stripes down
// its length like a little melon, a pink-brown snout; two trotting frames
// prettier-ignore
const PIG_BODY = [
  '...hhhh....',
  '.hssssssh..',
  'bbbbbbbbbbe',
  'tssssssssbbn',
  '.bbbbbbbbb..',
  '..SSSSSSS...',
];
const PIG_LEGS = [
  ['..d.d..d.d.', '..d.d..d.d.'],
  ['...dd...dd.', '...dd...dd.'],
];

/** A piglet with its feet on y and its middle at x, facing dir. */
function drawPig(
  f: Frame,
  P: Pal,
  x: number,
  y: number,
  dir: number,
  t: number,
  phase: number
) {
  const legs = PIG_LEGS[Math.floor((t + phase) / 70) % 2]!;
  sprite(
    f,
    [...PIG_BODY, ...legs],
    x - 6,
    y - 7,
    {
      h: P.pigHi,
      s: P.pigStripe,
      b: P.pig,
      S: P.pigSh,
      t: P.pigSh,
      e: P.boarDk,
      n: P.boarDk,
      d: P.boarDk,
    },
    dir < 0
  );
}

type Who = 'lead' | 'friend';

/** How the weather looks right now, each part 0 (sun) .. 1 (rain). */
type Weather = {
  cover: number; // rain cloud over the sky
  light: number; // grey light instead of gold
  rain: number; // how hard it's raining
  wet: number; // how wet the road is
  gap: number; // the sun breaking through as it clears
  bow: number; // the rainbow after
};

// ---------- the scene ----------

export const izu: Scene = {
  id: 'izu',
  name: 'Izu Peninsula',
  country: 'Japan',
  create(w, h) {
    const fxTop = new Fx(); // over everything
    // the lead rider in front; the friend behind, nearer the centre line
    const GAP = 54;
    const bikeX = Math.max(Math.round(w * 0.42) - 12, GAP + 10); // lead's rear axle
    const scratch = new Frame(60, 50);
    const SCR_X = 14;
    const SCR_G = 43;
    const night = new Frame(w, h);
    let now = 0;
    const L = layout(w);
    const BUSH_XS = L.trails.map((tx) => tx + BUSH_DX);

    // ----- static layers, in both weathers -----
    const pairs = new Pairs();
    const both = (
      make: (P: Pal, wet: boolean) => Frame,
      y0: number,
      y1: number
    ) => duo(pairs, make(SUN, false), make(RAIN, true), y0, y1);
    const base = both((P, wet) => buildBase(w, P, wet), 0, WALL + 8);
    const CLOUD_KEYS: (keyof Pal)[] = [
      'cloudHi',
      'cloudLit',
      'cloud',
      'cloudSh',
      'cloudDk',
      'scud',
      'scudSh',
      'scudLit',
    ];
    const swap = (make: (P: Pal) => Frame, y0: number, y1: number) => {
      const rain = make(RAIN);
      return duo(pairs, recolour(rain, RAIN, SUN, CLOUD_KEYS), rain, y0, y1);
    };
    const cum = swap(buildCumulus, 0, HORIZON + 4);
    const deck = swap(buildDeck, 0, HORIZON + 4);
    const scud = swap(buildScud, 24, HORIZON);
    const cumThr = thresholds(LC, 21, 8);
    const deckThr = thresholds(LC, 22, 6);
    const scudThr = thresholds(LS, 23, 7);
    const oshima = both((P) => buildOshima(w, P), HORIZON - 10, HORIZON);
    const far = both((P) => buildFar(P), FAR_WL - 16, FAR_WL + 1);
    let lighthouse = { x: 0, y: 0 };
    const mid = both(
      (P, wet) => {
        const m = buildMid(P, wet);
        lighthouse = m.lighthouse;
        return m.f;
      },
      WL - 45,
      WL + 3
    );
    const beach = both((P, wet) => buildBeach(P, wet), BEACH - 2, WALL + 6);
    const road = both((P, wet) => buildRoad(P, wet, L), 24, h);
    const front = both((P) => buildFront(P, L), VERGE - 22, h);
    const fore = both((P) => buildFore(P), 128, h);
    const forest = buildForest();
    const LEAD_N = nightOf(LEAD_RAIN);
    const FRIEND_N = nightOf(FRIEND_RAIN);

    // ----- the weather -----
    // Sun first; then the cloud rolls in from the sea and it rains; then it
    // clears, the sun breaks through, a rainbow stands over the sea; and
    // round again. A visit of half a minute usually sees a change.
    const HOLD = [22_000, 18_000]; // how long sun / rain last, once settled
    const TURN = [9_000, 7_000]; // clearing up / clouding over
    let wxTo = 0; // 0 sun, 1 rain: where the weather is heading
    let wxStart = NaN; // when it started heading there
    /** Moves the weather on to time t (it only ever goes forward). */
    function settle(t: number) {
      if (Number.isNaN(wxStart)) wxStart = t - TURN[0]! - 9_000; // sunny for a while already
      for (;;) {
        const end = wxStart + TURN[wxTo]! + HOLD[wxTo]!;
        if (t < end) break;
        wxTo = 1 - wxTo;
        wxStart = end;
      }
    }
    const turning = (t: number) => {
      if (Number.isNaN(wxStart)) return false; // not even started yet
      settle(t);
      return t - wxStart < TURN[wxTo]!;
    };
    function weather(t: number): Weather {
      settle(t);
      const a = t - wxStart;
      const D = TURN[wxTo]!;
      const p = Math.max(0, Math.min(1, a / D));
      if (wxTo === 1)
        // clouding over: cloud first, then the light, then the rain, then the wet
        return {
          cover: smooth(p / 0.5),
          light: smooth((p - 0.1) / 0.6),
          rain: smooth((p - 0.35) / 0.55),
          wet: smooth((p - 0.45) / 0.55),
          gap: 0,
          bow: 0,
        };
      // clearing: the rain eases, the sun breaks through on the left, the
      // cloud draws back out to sea, the road dries last; a rainbow after
      return {
        rain: 1 - smooth(p / 0.4),
        cover: 1 - smooth((p - 0.2) / 0.6),
        light: 1 - smooth((p - 0.2) / 0.55),
        wet: 1 - smooth((p - 0.3) / 0.7),
        gap: smooth(p / 0.15) * (1 - smooth((p - 0.5) / 0.35)),
        bow:
          smooth((a - 0.45 * D) / 1800) * (1 - smooth((a - D - 5000) / 3000)),
      };
    }
    // the dynamic colours follow the light, a few dozen steps of it
    const palCache = new Map<number, Pal>();
    const palAt = (k: number) => {
      const step = Math.round(Math.max(0, Math.min(1, k)) * 24);
      let p = palCache.get(step);
      if (!p) palCache.set(step, (p = mixPal(SUN, RAIN, step / 24)));
      return p;
    };
    let C: Pal = SUN;
    let WX: Weather = { cover: 0, light: 0, rain: 0, wet: 0, gap: 0, bow: 0 };
    const riderPal = (who: Who, light: number) =>
      (who === 'lead' ? LEAD_PALS : FRIEND_PALS)[
        light < 0.34 ? 0 : light < 0.67 ? 1 : 2
      ]!;

    // ----- motion: travelled "time", stretched by revs -----
    const REV_K = 1.2;
    const REV_TAU = 520;
    const REV_GAIN = REV_K * Math.E * REV_TAU;
    let revs: number[] = [];
    let banked = 0;
    // stops: the bikes brake to a halt (`rin`), stand (`hold`) and pull
    // away again (`rout`); the road's travel loses the time they stood
    type Halt = { at: number; rin: number; hold: number; rout: number };
    let halts: Halt[] = [];
    const haltEnd = (s: Halt) => s.at + s.rin + s.hold + s.rout;
    /** How stopped the bikes are by halt s at t, 0 (riding) .. 1 (standing). */
    const haltK = (s: Halt, t: number) => {
      const a = t - s.at;
      if (a <= 0 || a >= s.rin + s.hold + s.rout) return 0;
      if (a < s.rin) return smooth(a / s.rin);
      if (a < s.rin + s.hold) return 1;
      return 1 - smooth((a - s.rin - s.hold) / s.rout);
    };
    /** Travel lost to halt s by t: the integral of haltK, in closed form. */
    const haltLost = (s: Halt, t: number) => {
      const a = t - s.at;
      if (a <= 0) return 0;
      const ramp = (u: number) => u * u * u - (u * u * u * u) / 2; // ∫ smooth
      if (a < s.rin) return s.rin * ramp(a / s.rin);
      if (a < s.rin + s.hold) return s.rin / 2 + (a - s.rin);
      const b = a - s.rin - s.hold;
      if (b < s.rout) {
        const u = b / s.rout;
        return s.rin / 2 + s.hold + s.rout * (u - ramp(u));
      }
      return s.rin / 2 + s.hold + s.rout / 2;
    };
    const stopped = (t: number) => {
      let k = 0;
      for (const s of halts) k = Math.max(k, haltK(s, t));
      return k;
    };
    const halted = (t: number) =>
      halts.some((s) => t >= s.at && t < haltEnd(s));
    const travel = (t: number) => {
      let s = t + banked;
      for (const r of revs) {
        const a = t - r;
        if (a > 0)
          s += REV_GAIN * (1 - (1 + a / REV_TAU) * Math.exp(-a / REV_TAU));
      }
      for (const st of halts) s -= haltLost(st, t);
      return s;
    };
    /** Stops the bikes from t (halts never overlap: see `busy`). */
    const halt = (t: number, rin: number, hold: number, rout: number) => {
      // stops long over are banked, like old revs
      halts = halts.filter((s) => {
        if (t - haltEnd(s) > 30_000) {
          banked -= haltLost(s, Infinity);
          return false;
        }
        return true;
      });
      const s = { at: t, rin, hold, rout };
      halts.push(s);
      return s;
    };
    /** Braking (0..1) while slowing and standing; 0 once pulling away. */
    const braking = (t: number) => {
      for (const s of halts) {
        const a = t - s.at;
        if (a > 0 && a < s.rin + s.hold) return smooth(a / 250);
      }
      return 0;
    };
    /** When the latest stop began. */
    const lastStop = () => (halts.length ? halts[halts.length - 1]!.at : 0);
    /** The fork dives as they brake, and the nose lifts a touch pulling away. */
    const pitch = (t: number) => {
      let p = 0;
      for (const s of halts) {
        const a = t - s.at;
        if (a <= 0) continue;
        if (a < s.rin + 300)
          p -= Math.sin(Math.min(1, a / (s.rin + 300)) * Math.PI) * 0.9;
        const b = a - s.rin - s.hold;
        if (b > 0 && b < 600) p += Math.sin((b / 600) * Math.PI) * 0.12;
      }
      return p;
    };
    const boost = (t: number) => {
      let m = 0;
      for (const r of revs) {
        const a = t - r;
        if (a > 0) m += REV_K * (a / REV_TAU) * Math.exp(1 - a / REV_TAU);
      }
      return m;
    };

    // ----- wheelies, one queue per rider -----
    const WHEELIE_MS = 2300;
    const SURGE_MS = 4000;
    const wheelies: Record<Who, number[]> = { lead: [], friend: [] };
    /** Front lift (0..1, negative = fork compressed) for a wheelie of age a. */
    function liftAt(a: number) {
      if (a < 0 || a >= WHEELIE_MS) return 0;
      if (a < 900) return smooth(a / 900) ** 1.3; // the front floats up on the throttle
      if (a < 1450) return 1 - 0.07 * Math.sin(((a - 900) / 550) * Math.PI * 2); // balance point
      if (a < 1950) {
        const u = (a - 1450) / 500;
        return 1 - u * u; // falls back faster and faster
      }
      const u = (a - 1950) / 350;
      return -Math.sin(u * Math.PI) * (1 - u) * 1.2; // the fork soaks up the landing
    }
    const lift = (who: Who, t: number) => {
      let l = 0;
      for (const s of wheelies[who]) l += liftAt(t - s);
      return l;
    };
    /** The rider who wheelies surges ahead a little, then settles back. */
    const surge = (who: Who, t: number) => {
      let d = 0;
      for (const s of wheelies[who]) {
        const a = t - s;
        if (a > 0 && a < SURGE_MS)
          d += 9 * Math.sin((a / SURGE_MS) * Math.PI) ** 1.5;
      }
      return Math.round(d);
    };
    const leadX = (t: number) => bikeX + surge('lead', t);
    const friendX = (t: number) =>
      bikeX - GAP + Math.round(Math.sin(t / 5300) * 3) + surge('friend', t);

    // ----- the forest detour -----
    const TRAIL_MS = 8_800;
    const FADE_MS = 800;
    let trailAt = -Infinity;
    /** 0 on the coast, 1 in the forest; the dissolve in between. */
    const forestMix = (t: number) => {
      const a = t - trailAt;
      if (a < 0 || a >= TRAIL_MS) return 0;
      return Math.min(smooth(a / FADE_MS), smooth((TRAIL_MS - a) / FADE_MS));
    };
    /**
     * Where a rider's tyres touch and how the bike is pitched: on the coast
     * road, on the forest track, or in the dissolve somewhere between the
     * two, the same in both pictures so the bikes don't show double.
     */
    function riderPose(who: Who, t: number, mix: number) {
      const x = who === 'lead' ? leadX(t) : friendX(t);
      const coast = who === 'lead' ? G_LEAD : G_FRIEND;
      const up = lift(who, t);
      if (mix <= 0)
        return {
          x,
          g: coast,
          wheelie: Math.max(-1, Math.min(1, up + pitch(t))),
        };
      // bucking over the roots and ruts of the track
      const lx = Math.round(x + roadOff(t));
      const dg = who === 'friend' ? -3 : 0;
      const gr = TRAIL_G + dg + trackAt(lx);
      const gf = TRAIL_G + dg + trackAt(lx + 28);
      const ang = Math.atan2(gr - gf, 28);
      const bump =
        ang >= 0 ? ang / ((14 * Math.PI) / 180) : ang / ((3 * Math.PI) / 180);
      return {
        x,
        g: Math.round(coast + (gr - coast) * mix),
        wheelie: Math.max(-1, Math.min(1, up > 0.2 ? up : up + bump * mix)),
      };
    }

    // ----- traffic in the far lane -----
    const TRAFFIC_EVERY = 14_000;
    const oncoming: BikePalette = {
      ...BIKE,
      body: 0x2f6a4a,
      bodyMid: 0x3f8a5f,
      bodyHi: 0x6cb08a,
      red: 0xf2c230,
      redHi: 0xffe070,
      redSh: 0xb88a1c,
      rimRed: 0x1b1c23,
      hoodie: 0x6a7a8a,
      hoodieHi: 0x8e9eae,
      hoodieSh: 0x4e5c6a,
      hoodieDk: 0x3a4652,
      logo: 0xf2c230,
      jeans: 0x2a3348,
      jeansHi: 0x3d4a66,
      jeansSh: 0x1e2536,
      jeansDk: 0x161b28,
      helmet: 0xf4f4f0,
      helmetHi: 0xffffff,
      helmetSh: 0xb4bac6,
      helmetSpec: 0xffffff,
      visor: 0x3a3e4a,
      visorMid: 0x4a4e5c,
      visorDeep: 0x24262e,
      visorHi: 0xc8d0e0,
      visorPink: 0x4a4e5c,
      rimLight: 0xb8a890,
    };

    function traffic(t: number) {
      const k = Math.floor(t / TRAFFIC_EVERY);
      const p = t - k * TRAFFIC_EVERY;
      const kind = k % 2 ? 'bike' : 'truck';
      const x = w + 10 - p * 0.2;
      if (x < -120) return null;
      return { kind, x } as const;
    }

    // the truck is drawn in a frame of its own first, so it can be mirrored
    // in the wet road or cast a shadow on the dry one, like the bikes
    const TRUCK_G = 26;
    const truckF = new Frame(50, TRUCK_G + 2);
    function drawTruck(f: Frame, x: number, t: number) {
      truckF.clear();
      truckBody(truckF, 1, TRUCK_G, t);
      stamp(f, truckF, 1, TRUCK_G, x, ONCOMING, t);
      const g = ONCOMING;
      const bx = Math.round(x);
      // headlight glow, and its long reflection on the wet road
      glowAt(f, bx + 1, g - 9, 6, C.lampGlow, 0.2 + 0.25 * WX.light);
      for (let k = 1; k < 14; k++)
        if (k % 3)
          f.blend(
            bx + 1 + (k % 2),
            g - 4 + k,
            C.lampGlow,
            (0.5 - k * 0.03) * WX.wet
          );
    }

    function truckBody(f: Frame, bx: number, g: number, t: number) {
      // a white kei truck, its load of mikan under a tarp, wipers going in the rain
      f.rect(bx + 15, g - 15, 32, 9, C.truck);
      f.hline(bx + 15, bx + 46, g - 15, C.white);
      f.hline(bx + 15, bx + 46, g - 7, C.truckSh);
      for (let k = 0; k < 3; k++)
        f.vline(bx + 24 + k * 8, g - 14, g - 8, C.truckSh);
      f.rect(bx + 16, g - 19, 29, 4, C.vmBlue);
      f.hline(bx + 16, bx + 44, g - 19, C.vmBlueHi);
      for (let k = 0; k < 4; k++) f.set(bx + 18 + k * 7, g - 16, C.mikan);
      f.poly(
        [
          [bx + 2, g - 13],
          [bx + 4, g - 25],
          [bx + 15, g - 25],
          [bx + 15, g - 6],
          [bx + 1, g - 6],
        ],
        (px, py) => (py < g - 23 ? C.white : px > bx + 13 ? C.truckSh : C.truck)
      );
      f.poly(
        [
          [bx + 4, g - 15],
          [bx + 6, g - 23],
          [bx + 13, g - 23],
          [bx + 13, g - 15],
        ],
        (px, py) => (px - bx + (py - g) < -6 ? C.glassHi : C.glass)
      );
      const wa = WX.rain > 0.2 ? Math.sin(t / 260) * 0.9 : -0.9;
      f.line(
        bx + 9,
        g - 15,
        bx + 9 + Math.round(Math.sin(wa) * 5),
        g - 15 - Math.round(Math.cos(wa) * 6),
        C.truckDk
      );
      f.rect(bx + 1, g - 10, 3, 2, C.lampHot);
      f.hline(bx + 1, bx + 46, g - 6, C.truckDk);
      f.rect(bx + 46, g - 13, 1, 3, C.tailGlow);
      for (const wx of [bx + 8, bx + 38]) {
        f.disc(wx, g - 3, 3, C.tyre);
        f.set(wx, g - 3, C.truckSh);
        f.set(wx + (Math.floor(t / 60) % 2 ? 1 : -1), g - 3, C.truckDk);
      }
      f.rect(bx + 10, g - 21, 2, 3, C.truckDk);
    }

    // ----- clicks -----
    const roadOff = (t: number) => SPEED.road * travel(t);
    const vmScreen = (t: number) => onScreen(VENDING_X, roadOff(t), LR, w);
    const mirrorScreen = (t: number) => onScreen(MIRROR_X, roadOff(t), LR, w);
    /** Screen x of each of a list of road-layer xs. */
    const screens = (xs: number[], t: number) => {
      const off = roadOff(t);
      return xs.map((x) => onScreen(x, off, LR, w));
    };
    /** Of road-layer xs, the screen x (+ dx) in view nearest the middle, or null. */
    const inView = (xs: number[], t: number, dx = 0) => {
      let best: number | null = null;
      for (const sx of screens(xs, t)) {
        const x = sx + dx;
        if (x < 0 || x >= w) continue;
        if (best === null || Math.abs(x - w / 2) < Math.abs(best - w / 2))
          best = x;
      }
      return best;
    };
    const CAN_MS = 2200;
    let canAt = -Infinity;
    let canMachine = 0;
    const GLINT_MS = 600;
    let glintAt = -Infinity;

    const onRider = (who: Who, x: number, y: number, t: number) => {
      const bx = who === 'lead' ? leadX(t) : friendX(t);
      const g = who === 'lead' ? G_LEAD : G_FRIEND;
      return x >= bx - 8 && x <= bx + 36 && y >= g - 38 && y <= g + 1;
    };
    const onVending = (x: number, y: number, t: number) => {
      const vx = vmScreen(t);
      return y >= VM_TOP && y <= ROAD && x >= vx && x < vx + 34;
    };
    const onMirror = (x: number, y: number, t: number) => {
      const mx = mirrorScreen(t);
      return Math.abs(x - mx - 1) <= 6 && y >= 48 && y <= 63;
    };
    /** A trail mouth (not the boar's bush on its left). */
    const onTrail = (x: number, y: number, t: number) =>
      y >= VERGE - 20 &&
      y < h &&
      screens(L.trails, t).some((tx) => x >= tx - 9 && x <= tx + 22);
    /** A signpost itself (board, ribbon and post), drawn in front of the riders. */
    const onSign = (x: number, y: number, t: number) =>
      screens(L.trails, t).some(
        (tx) =>
          (x >= tx + 6 && x <= tx + 21 && y >= VERGE - 20 && y <= VERGE - 13) ||
          (x >= tx + 13 && x <= tx + 19 && y > VERGE - 13 && y < h)
      );
    /**
     * Which binoculars (x, y) is on, as a screen x, or null: the head and
     * coin box (they stand above the riders), or with `all` the post too.
     */
    const onScope = (x: number, y: number, t: number, all: boolean) => {
      if (y < SCOPE_TOP - 1 || y > (all ? SCOPE_BASE : SCOPE_TOP + 11))
        return null;
      for (const sx of screens(L.scopes, t))
        if (x >= sx - 1 && x <= sx + SCOPE_W) return sx;
      return null;
    };

    // ----- the wild boar -----
    // It noses out of the verge, trots across both lanes ahead of the riders
    // and hurries off along the foot of the sea wall. Crosses on its own now
    // and then, or when you click the verge; one boar at a time.
    // it's about until it has run off the right edge (BOAR_MAX is a backstop)
    const BOAR_MAX = 9000;
    const BOAR_EVERY = 37_000;
    let boarAt = -Infinity;
    let boarLx = 0; // road-layer x where it comes out
    type Boar = { at: number; lx: number };
    /** Where a boar can come out without running into a bike: ahead of them. */
    const boarSafeX = (t: number) => Math.min(w - 12, leadX(t) + 52);
    /**
     * A boar's way across `a` ms after it came out of the grass at road-layer
     * x lx0: up onto the verge, across both lanes on a slant going our way
     * (`slant` px of road per ms), then off along the foot of the wall.
     * Road-layer x.
     */
    function boarPath(lx0: number, a: number, slant = 0.068) {
      if (a < 400)
        return {
          lx: lx0 + a * 0.03,
          y: Math.round(h + 10 - smooth(a / 400) * (h + 9 - VERGE)),
        };
      const lx = lx0 + 12;
      if (a < 1900) {
        const u = (a - 400) / 1500;
        return {
          lx: lx + (a - 400) * slant,
          y: Math.round(VERGE + 1 - u * (VERGE + 1 - (ROAD + 6))),
        };
      }
      const u = a - 1900;
      return {
        lx: lx + 1500 * slant + u * 0.09 + u * u * 0.00004,
        y: ROAD + 6,
      };
    }
    const boarAlive = (b: Boar, t: number) => {
      const a = t - b.at;
      return a >= 0 && a < BOAR_MAX && (a < 1900 || boarPos(b, t).x < w + 12);
    };
    const boarFor = (t: number): Boar | null => {
      const clicked = { at: boarAt, lx: boarLx };
      if (boarAlive(clicked, t)) return clicked;
      // the regular crossing (not while they're stopped, away, or the
      // family's about)
      const k = Math.floor(t / BOAR_EVERY);
      const at = k * BOAR_EVERY + 21_000;
      const clash =
        Math.abs(at - boarAt) < BOAR_MAX || Math.abs(at - famAt) < FAM_MAX;
      if (t >= at && !busy(at) && !clash) {
        const b = { at, lx: roadOff(at) + boarSafeX(at) };
        if (boarAlive(b, t)) return b;
      }
      return null;
    };
    /** Where the boar is (screen space). */
    function boarPos(b: Boar, t: number) {
      const p = boarPath(b.lx, t - b.at);
      return { x: p.lx - roadOff(t), y: p.y };
    }

    // ----- the boars' bushes, and the boar family -----
    // A boar lies up in the bush at each trail mouth: now and then the
    // leaves shiver and a snout pokes out. And the warning signs are right:
    // tap one and it flashes, and a sow bursts out of the long grass ahead
    // of the bikes in a shower of leaves, six stripy piglets at her heels;
    // the bikes brake to a stop and wait while the family trots across
    // towards the sign (the last piglet stops halfway to stare at them,
    // then scurries after the others), the two of them wave them off, and
    // the bikes pull away.
    const outline = bushOutlines(BUSH_XS);
    const BUSH_Y = 142; // the middle of what shows of a bush
    /** Which boar sign (x, y) is on, as a screen x, or null: the diamond, or with `all` its post too. */
    const onBoarSign = (x: number, y: number, t: number, all: boolean) => {
      for (const bx of screens(L.boars, t)) {
        if (Math.abs(x - bx) + Math.abs(y - BOAR_SIGN_Y) <= BOAR_SIGN_R + 1)
          return bx;
        if (
          all &&
          Math.abs(x - bx + 0.5) <= 1.5 &&
          y > BOAR_SIGN_Y &&
          y <= ROAD
        )
          return bx;
      }
      return null;
    };
    /** Whether a boar coming out at x would miss the bikes. */
    const clearOfBikes = (x: number, t: number) =>
      x < friendX(t) - 12 || x > leadX(t) + 44;
    // its head, sliced off the boar facing right, the snout's tip last
    const PEEK = BOAR_BODY.map((row) => row.slice(8));

    // when each comes out of the grass after the sow (ms); the last one
    // stops to stare PAUSE_MS, PAUSE_AT ms into its crossing
    const FAM = [0, 420, 720, 1020, 1320, 1620, 1920];
    const LAST = FAM.length - 1;
    const PAUSE_AT = 750;
    const PAUSE_MS = 800;
    const FAM_MAX = 13_000;
    let famAt = -Infinity;
    let famLx = 0; // road-layer x where they come out of the grass
    let famSignLx = 0; // road-layer x of the sign that was tapped
    // across on a slant, as far as there's room to the right
    let famSlant = 0.045;
    /** The path time of family member k, `a` ms after the sow came out. */
    const famA = (k: number, a: number) => {
      const p = a - FAM[k]!;
      if (k !== LAST) return p;
      const at = 400 + PAUSE_AT;
      return p < at ? p : p < at + PAUSE_MS ? at : p - PAUSE_MS;
    };
    /** When the last piglet reaches the far lane, after the sow came out. */
    const famAcross = () => FAM[LAST]! + PAUSE_MS + 1900;
    const famOut = (t: number) => {
      const a = t - famAt;
      if (a < 0 || a >= FAM_MAX) return false;
      if (a < famAcross()) return true;
      return boarPath(famLx, famA(LAST, a), famSlant).lx - roadOff(t) < w + 12;
    };
    /** Each of the family on screen: where, which way, and whether it's the sow. */
    function family(t: number) {
      const a = t - famAt;
      const out: { x: number; y: number; dir: number; k: number }[] = [];
      if (!famOut(t)) return out;
      const off = roadOff(t);
      for (let k = 0; k < FAM.length; k++) {
        const p = famA(k, a);
        if (p < 0) continue;
        const pos = boarPath(famLx, p, famSlant);
        const pause = 400 + PAUSE_AT;
        const staring =
          k === LAST &&
          a - FAM[k]! > pause + 80 &&
          a - FAM[k]! < pause + PAUSE_MS - 120;
        out.push({ x: pos.lx - off, y: pos.y, dir: staring ? -1 : 1, k });
      }
      return out;
    }
    /** The sign at screen x was right: the bikes stop for the family. */
    function startFamily(t: number, signX: number) {
      famAt = t;
      famSignLx = signX + roadOff(t);
      const stop = halt(t, 650, 60_000, 1300);
      // they come out of the long grass across the road from the sign, but
      // clear of the lead's front wheel and no further on than will fit in a
      // shot with him (as the bikes come to a stop, that's where they'll be)
      const span = w / ZOOM;
      const nearest = leadX(t) + 58;
      const furthest = Math.min(w - 26, leadX(t) + 2 + span - 34);
      const crossX = Math.min(furthest, Math.max(nearest, signX + 6));
      famLx = crossX - 12 + roadOff(t + 400);
      // the camera's shot, from the wall down to the verge: the crossing,
      // with the lead in it (and the friend, if there's room), and they
      // cross on a slant only as far as the shot has room for
      let left = Math.min(crossX - 16, friendX(t) - 10);
      if (crossX + 34 - left > span) left = Math.min(crossX - 16, leadX(t) + 2);
      if (crossX + 34 - left > span) left = crossX - 16;
      left = Math.max(0, Math.min(w - span, left));
      famSlant = Math.max(
        0.008,
        Math.min(0.045, (left + span - 24 - crossX) / 1500)
      );
      famCx = left + span / 2;
      famCy = h - h / (2 * ZOOM);
      // they pull away as the last piglet reaches the far lane
      stop.hold = famAcross() - 650 - 250;
      const go = t + 650 + stop.hold;
      exhaust(go, 'lead');
      exhaust(go + 140, 'friend');
      // (the sign flashes first, then they burst out)
      leafBurst(t + 200, famLx);
    }
    // the camera pushes in on the crossing (to twice the size) while they
    // wait, and eases back out as the bikes pull away
    let famCx = 0;
    let famCy = 0;
    const ZOOM = 2;
    /**
     * The zoom now: how far in, and the middle of what's shown (in the
     * unzoomed picture), sliding from the whole picture to the crossing.
     */
    function famZoom(t: number) {
      const a = t - famAt;
      const end = famAcross();
      if (a < 500 || a > end + 1000) return null;
      const k = smooth((a - 500) / 800) * (1 - smooth((a - end + 50) / 950));
      if (k <= 0.002) return null;
      return {
        z: 1 + (ZOOM - 1) * k,
        cx: w / 2 + (famCx - w / 2) * k,
        cy: h / 2 + (famCy - h / 2) * k,
      };
    }
    /** A point on screen back to where it is in the unzoomed picture. */
    const unzoom = (x: number, y: number, t: number) => {
      const zm = famZoom(t);
      if (!zm) return { x, y };
      return {
        x: zm.cx + (x + 0.5 - w / 2) / zm.z,
        y: zm.cy + (y + 0.5 - h / 2) / zm.z,
      };
    };
    const zoomBuf = new Uint32Array(w * h);
    const zoomCols = new Int32Array(w);
    function applyZoom(f: Frame, t: number) {
      const zm = famZoom(t);
      if (!zm) return;
      zoomBuf.set(f.pixels);
      const px = f.pixels;
      for (let x = 0; x < w; x++)
        zoomCols[x] = Math.max(
          0,
          Math.min(w - 1, Math.floor(zm.cx + (x + 0.5 - w / 2) / zm.z))
        );
      for (let y = 0; y < h; y++) {
        const sy = Math.max(
          0,
          Math.min(h - 1, Math.floor(zm.cy + (y + 0.5 - h / 2) / zm.z))
        );
        const row = sy * w;
        for (let x = 0; x < w; x++)
          px[y * w + x] = zoomBuf[row + zoomCols[x]!]!;
      }
    }
    /** The lead rider, then the friend, wave the boars off. */
    const famWave = (who: Who, t: number) => {
      const a = t - famAt - 400;
      return who === 'lead' ? a > 1300 && a < 3600 : a > 1900 && a < 3400;
    };

    // a leaf tumbling through the air, in its four turns
    const LEAF = [
      ['xx', 'xo'],
      ['x.', 'xx'],
      ['ox', 'xx'],
      ['.x', 'xx'],
    ];
    function leafBurst(t: number, lx: number) {
      // the bush explodes in leaves as she crashes out: flung up and out
      // over the verge and the road, then fluttering down
      const seed = Math.round(t) % 89;
      fxTop.add(t, 2200, (f, age) => {
        const sx = lx - roadOff(t + age);
        const s = age / 1000;
        for (let i = 0; i < 150; i++) {
          const ang = -Math.PI * (0.03 + 0.94 * hash2(i, 1, seed));
          const sp = 90 + hash2(i, 2, seed) ** 0.5 * 280;
          const u = s - hash2(i, 3, seed) * 0.12;
          if (u < 0 || u > 2 - hash2(i, 4, seed) * 0.5) continue;
          const k = (1 - Math.exp(-3.4 * u)) / 3.4;
          const x =
            sx + Math.cos(ang) * sp * k + Math.sin(u * 7 + i) * 4 * u * u;
          const y = BUSH_Y - 6 + Math.sin(ang) * sp * k + 30 * u * u;
          if (y > h + 1) continue;
          const c =
            i % 7 === 0
              ? C.grassHi
              : i % 4 === 0
                ? C.leafHi
                : i % 3 === 0
                  ? C.leafLit
                  : i % 2
                    ? C.leaf
                    : C.leafSh;
          if (i % 3 === 2) {
            f.set(x, y, c); // bits of twig and torn leaf
            continue;
          }
          const turn = LEAF[(Math.floor(u * 12) + i) % 4]!;
          for (let ry = 0; ry < 2; ry++)
            for (let rx = 0; rx < 2; rx++) {
              const ch = turn[ry]![rx];
              if (ch === 'x') f.set(x + rx, y + ry, c);
              else if (ch === 'o') f.set(x + rx, y + ry, C.leafDk);
            }
        }
        // a puff of dust and broken twigs where she burst out
        if (s < 0.7)
          glowAt(
            f,
            sx,
            BUSH_Y - 2,
            8 + s * 34,
            C.mudHi,
            0.4 * (1 - s / 0.7),
            0.6
          );
      });
    }

    /** The bush's leaves shivering (in front) or the snout poking out (behind). */
    function bushLife(f: Frame, t: number, behind: boolean) {
      const out = !!boarFor(t) || famOut(t);
      const xs = screens(BUSH_XS, t);
      for (let i = 0; i < BUSH_XS.length; i++) {
        const sx = xs[i]!;
        if (sx < -BUSH_R || sx > w + BUSH_R) continue;
        const bx = Math.round(sx);
        let shake = 0;
        let peek = 0;
        if (!out) {
          const cyc = (t + i * 2900) % 6100;
          if (cyc < 650) shake = 1;
          else if (cyc >= 900 && cyc < 2700) {
            const u = cyc - 900;
            peek = u < 300 ? u / 300 : u > 1500 ? (1800 - u) / 300 : 1;
          }
        }
        const { top, right } = outline[i]!;
        if (behind && peek > 0) {
          // sniffing: the snout bobs while it's out
          const u = (t + i * 2900) % 6100;
          const bob = u > 1400 && u < 2300 && Math.floor(u / 170) % 2 ? 1 : 0;
          const tip = bx + right[BUSH_Y]! + Math.round(peek * 4);
          sprite(f, PEEK, tip - PEEK[0]!.length + 1, BUSH_Y - 5 + bob, {
            h: C.boarHi,
            b: C.boar,
            s: C.boarSh,
            n: C.boarDk,
            e: C.boarDk,
            t: C.boarDk,
            k: C.tusk,
          });
        }
        if (!behind && shake) {
          // its top bristling, leaves flicking up all along it
          const fr = Math.floor(t / (shake > 1 ? 60 : 100));
          for (let dx = -BUSH_R; dx <= BUSH_R; dx++) {
            const tp = top[dx + BUSH_R]!;
            if (tp >= 150 || (dx + fr) % 3) continue;
            f.set(bx + dx, tp - 1, (dx + fr) % 2 ? C.leaf : C.leafLit);
            if (shake > 1 && (dx + fr) % 2) f.set(bx + dx, tp - 2, C.leafLit);
          }
        }
      }
    }

    // ----- up on the Skyline -----
    // Click the binoculars and the bikes pull over; the view opens out of
    // them, binocular-shaped, from where they stand, grows to fill the
    // picture, holds, and closes back into them as the bikes ride on.
    const view = skylineView(w, h);
    const viewF = new Frame(w, h);
    const SKY_MS = 7800;
    const SKY_OPEN = 1250;
    const SKY_CLOSE = 1100;
    let skyAt = -Infinity;
    let skyLx = 0; // road-layer x of the binoculars clicked
    const skyOn = (t: number) => t >= skyAt && t < skyAt + SKY_MS;
    // the window's two lobes are LOBE * R either side of its middle; at
    // R_ALL it covers the whole picture
    const LOBE = 0.55;
    let R_ALL = 8;
    while (
      Math.max(
        Math.hypot(Math.abs(w / 2 - R_ALL * LOBE), h / 2),
        Math.hypot(R_ALL * LOBE, h / 2)
      ) >
      R_ALL - 4
    )
      R_ALL += 2;
    const R_LOOK = Math.min(h * 0.36, w * 0.21); // looking through them
    /** The window `a` ms into the dip, or null once it fills the picture. */
    function iris(a: number, t: number) {
      const closing = a > SKY_MS - SKY_CLOSE;
      const u = closing ? (SKY_MS - a) / SKY_CLOSE : a / SKY_OPEN;
      if (u >= 1) return null;
      const sx = skyLx - roadOff(t) + SCOPE_EYE[0];
      const m = smooth(u / 0.7);
      return {
        cx: sx + (w / 2 - sx) * m,
        cy: SCOPE_EYE_Y + (h / 2 - SCOPE_EYE_Y) * m,
        R:
          1 +
          R_LOOK * smooth(u / 0.42) +
          (R_ALL - R_LOOK) * smooth((u - 0.55) / 0.45),
        dim: 0.8 * smooth(u / 0.3),
      };
    }
    function startSky(t: number, sx: number) {
      skyAt = t;
      skyLx = sx + roadOff(t);
      // they brake to a stop as the view opens and ride on as it closes
      const stop = halt(t, 700, SKY_MS - 700 - 350, 1300);
      const go = t + stop.rin + stop.hold;
      exhaust(go, 'lead');
      exhaust(go + 140, 'friend');
    }
    /** Anything playing that the other eggs (and stops) must wait for. */
    const busy = (t: number) => forestMix(t) > 0 || skyOn(t) || halted(t);

    function bigWave(t: number, x: number) {
      // a big one rolls in and bursts over the boulders, spray flying at the wall
      const seed = Math.round(t) % 97;
      const lx = x + SPEED.beach * travel(t);
      fxTop.add(t, 2000, (f, age) => {
        const sx = lx - SPEED.beach * travel(t + age);
        const a = age / 1000;
        for (let i = 0; i < 60; i++) {
          const vx = (hash2(i, 1, seed) - 0.5) * 40;
          const vy = -18 - hash2(i, 2, seed) ** 0.7 * 34;
          const d = hash2(i, 3, seed) * 0.25;
          const s = a - d;
          if (s < 0) continue;
          const px = sx + vx * s + (hash2(i, 4, seed) - 0.5) * 10;
          const py = BEACH + 4 + vy * s + 46 * s * s;
          if (py > BEACH + 8) continue;
          // in the sun, the spray on the sunny side flashes gold
          const c =
            s > 0.9
              ? C.foamSh
              : vx < -4 && i % 2 && WX.light < 0.5
                ? C.glint
                : C.foam;
          f.set(px, py, c);
          if (s < 0.3 && i % 3 === 0) f.set(px + 1, py, C.foam);
        }
        const spread = Math.min(1, a * 2.5) * 20;
        const fade = Math.max(0, 1 - a / 1.8);
        for (let dx = -spread; dx <= spread; dx++) {
          if (hash2(Math.round(dx), Math.floor(age / 110), seed) > fade)
            continue;
          f.set(
            sx + dx,
            BEACH + 1 + (Math.abs(dx) > spread * 0.6 ? 2 : 0),
            C.foam
          );
          f.set(sx + dx, BEACH + 3, C.foamSh);
        }
      });
    }

    function exhaust(t: number, who: Who) {
      // a bark from the twin outlets, left hanging in the air
      fxTop.add(t, 1600, (f, age) => {
        const { x: bx, g } = riderPose(who, t + age, forestMix(t + age));
        for (let i = 0; i < 5; i++) {
          const a = age - i * 60;
          if (a < 0 || a > 1300) continue;
          const p = a / 1300;
          const r = 2.2 + Math.sqrt(p) * 5;
          const px = bx - 2 - a * 0.09 - i * 2.2;
          const py = g - 14 - p * 6;
          const core = lerpRGB(
            i === 0 ? C.smokeDk : C.smoke,
            C.smokeLt,
            Math.min(1, p * 1.6)
          );
          const alpha = (1 - p) ** 1.2 * 0.85;
          for (let dy = -Math.ceil(r); dy <= r; dy++)
            for (let dx = -Math.ceil(r); dx <= r; dx++) {
              const d = Math.hypot(dx, dy * 1.2) / r;
              if (d > 1) continue;
              // the side towards the low sun lights up gold
              const sunlit = WX.light < 0.5 && d > 0.55 && dx < 0 && dy < 1;
              f.blend(
                px + dx,
                py + dy,
                sunlit ? C.cloudLit : d > 0.75 ? C.smoke : core,
                alpha * (d < 0.75 ? 1 : 0.6)
              );
            }
        }
      });
    }

    // ----- drawing the moving parts -----

    function drawSea(f: Frame, tr: number, t: number) {
      // swells rolling in as darker bands when it's rough
      const rough = WX.light;
      if (rough > 0.05)
        for (let k = 0; k < 6; k++) {
          const v = (k + ((t / 4200) % 1)) / 6;
          const y = Math.round(HORIZON + 3 + v * v * (BEACH - HORIZON - 3));
          const speed = SPEED.far + (SPEED.beach - SPEED.far) * v;
          for (let x = 0; x < w; x++) {
            const n = hash2(Math.floor((x + tr * speed) / (3 + v * 6)), k, 41);
            if (n > 1 - 0.32 * rough) f.set(x, y, C.swell);
            else if (n < 0.06 * rough && v > 0.3) f.set(x, y - 1, C.swellHi);
          }
        }
      // whitecaps (plenty when it's rough) and sun glints (crowding towards
      // the sunny left) on the water
      const n = Math.round(w / 3.4);
      for (let i = 0; i < n; i++) {
        const depth = hash2(i, 1, 71) ** 0.9;
        const y = Math.round(HORIZON + 2 + depth * (BEACH - HORIZON - 2));
        const speed = SPEED.far + (SPEED.beach - SPEED.far) * depth;
        const span = w + 20;
        const x =
          ((((hash2(i, 2, 71) * span - tr * speed) % span) + span) % span) - 10;
        const life =
          (t / (1400 + hash2(i, 3, 71) * 1800) + hash2(i, 4, 71)) % 1;
        if (life > 0.6) continue;
        const grow = Math.sin((life / 0.6) * Math.PI);
        const len = Math.round(grow * (1 + depth * 5));
        if (len <= 0) continue;
        const kind = hash2(i, 5, 71);
        const sunny =
          kind < 0.6 * (1 - rough) &&
          x < w * 0.6 &&
          hash2(i, 6, 71) > x / (w * 0.6);
        if (sunny) {
          f.hline(x, x + Math.max(0, len - 1), y, C.glint);
          if (len > 2) f.set(x + (len >> 1), y, C.glintHi);
        } else if (kind > 0.55 - 0.45 * rough) {
          f.hline(x, x + len, y, C.foam);
          if (depth > 0.35 && len > 2)
            f.hline(x + 1, x + len - 1, y + 1, C.foamSh);
        }
      }
    }

    function drawSurf(f: Frame, tr: number, t: number) {
      // white water running up between the boulders and draining back
      const off = SPEED.beach * tr;
      const reach = 1 + WX.light * 0.6;
      for (let x = 0; x < w; x++) {
        const lx = Math.round(x + off);
        const s = Math.sin(t / 900 - lx * 0.035 + Math.sin(lx * 0.011) * 2);
        const up = Math.round((s + 1) * 1.6 * reach);
        f.set(x, BEACH - 1, C.foamSh);
        for (let k = 0; k <= up; k++)
          if (hash2(lx, k + Math.floor(t / 200), 7) > 0.25)
            f.set(x, BEACH + k, k === up ? C.foamSh : C.foam);
      }
    }

    function drawGulls(f: Frame, tr: number, t: number) {
      const n = w > 300 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const span = w + 40;
        const x =
          ((((hash2(i, 2, 61) * span +
            t * 0.008 * (i % 2 ? 1 : -0.6) -
            tr * SPEED.mid * 0.6) %
            span) +
            span) %
            span) -
          20;
        const y =
          WL - 30 + hash2(i, 3, 61) * 18 + Math.sin(t / 900 + i * 2) * 3;
        const flap = (t / 1000 + hash2(i, 4, 61) * 7) % 2.4;
        const frame = flap < 1.2 ? Math.floor(flap / 0.13) % 3 : 1;
        sprite(f, GULL[frame]!, x - 2, y - 1, { k: C.gullTip, w: C.gull });
      }
    }

    function drawKites(f: Frame, t: number) {
      // a pair of black kites circling in the warm air; they're off once
      // the cloud comes over
      if (WX.cover > 0.45) return;
      for (let k = 0; k < 2; k++) {
        const period = 11_000 + k * 3_100;
        const ph = (t / period) * Math.PI * 2 + k * 2.4;
        const cx = w * (0.22 + 0.5 * k) + Math.sin(t / 27_000 + k) * w * 0.08;
        const cy = 18 + k * 9 + Math.sin(t / 9_000 + k) * 3 - WX.cover * 30;
        const r = 18 + k * 6;
        const x = cx + Math.cos(ph) * r;
        const y = cy + Math.sin(ph) * r * 0.32;
        const dir = -Math.sin(ph) > 0 ? 1 : -1;
        const rows = Math.abs(Math.cos(ph)) > 0.75 ? KITE_BANK : KITE_GLIDE;
        sprite(f, rows, x - 6, y - 2, { x: C.kite, '#': C.kiteLit }, dir < 0);
      }
    }

    function drawBoat(f: Frame, tr: number, t: number) {
      // a fishing boat heading home, pitching more in the swell when it's rough
      const y = HORIZON + 9;
      const span = w + 60;
      const x =
        Math.round(
          (((0.6 * span - tr * 0.008 + t * 0.003) % span) + span) % span
        ) - 30;
      const bob = Math.round(Math.sin(t / 500) * (0.4 + WX.light * 0.6));
      f.hline(x, x + 9, y + bob, C.boat);
      f.hline(x + 1, x + 8, y + 1 + bob, C.boatSh);
      f.rect(x + 2, y - 2 + bob, 3, 2, C.boat);
      f.set(x + 2, y - 2 + bob, C.cabin);
      f.vline(x + 6, y - 5 + bob, y - 1 + bob, C.cabin);
      f.set(x + 1, y + bob, C.boatRed);
      if (WX.light > 0.5) f.set(x + 6, y - 5 + bob, C.lamp);
      for (let j = 1; j < 6; j++)
        if ((j + Math.floor(t / 200)) % 3) f.set(x - j, y + 1, C.foamSh);
    }

    function drawSunBreak(f: Frame, t: number) {
      // as it clears, the cloud tears open over on the sunny left and rays
      // of light slant down onto a patch of sea that goes silver
      const k = WX.gap;
      if (k <= 0.01) return;
      const cx = Math.round(w * 0.24);
      const cy = 15;
      const rx = 6 + 24 * k;
      const ry = 1 + 3.5 * k;
      for (let y = Math.floor(cy - ry - 2); y <= cy + ry + 2; y++)
        for (let x = Math.floor(cx - rx - 3); x <= cx + rx + 3; x++) {
          const d =
            Math.hypot((x - cx) / rx, (y - cy) / ry) +
            (hash2(x >> 2, y, 3) - 0.5) * 0.45 +
            Math.sin(x * 0.4) * 0.12;
          if (d < 0.82) f.set(x, y, d < 0.5 ? C.silver : C.sky9);
          else if (d < 1 && y > cy) f.set(x, y, C.beam);
          else if (d < 1.12) f.blend(x, y, C.beam, 0.45);
        }
      for (const [o, wd] of [
        [-10, 3],
        [-3, 2],
        [4, 3],
        [11, 2],
      ] as const) {
        for (let y = Math.round(cy + ry); y < BEACH - 2; y++) {
          const v = (y - cy) / (BEACH - cy);
          const x0 = cx + o * k * (1 + v * 0.8) + (y - cy) * 0.32;
          const al = k * 0.26 * (1 - v * 0.5);
          for (let x = Math.round(x0); x < x0 + wd + v * 3; x++)
            f.blend(x, y, C.beam, al);
        }
      }
      const sx = cx + (HORIZON + 10 - cy) * 0.32;
      for (let y = HORIZON + 3; y < HORIZON + 18; y++)
        for (let x = Math.floor(sx - 26 * k); x <= sx + 26 * k; x++) {
          const e = Math.hypot(
            (x - sx) / (26 * k + 0.1),
            (y - HORIZON - 10) / 7
          );
          if (e >= 1) continue;
          f.blend(x, y, C.silver, 0.4 * k * (1 - e));
          if (hash2(x, y, Math.floor(t / 160)) > 0.93) f.set(x, y, C.foam);
        }
    }

    function drawRainbow(f: Frame) {
      // opposite the low western sun, so out over the sea: six bands, the
      // feet fading into the haze at the horizon
      const k = WX.bow;
      if (k <= 0.01) return;
      const cx = w * 0.64;
      const cy = HORIZON + 22;
      const R = Math.max(48, Math.min(74, w * 0.2)); // the whole arc in frame
      const bands = [C.rbR, C.rbO, C.rbY, C.rbG, C.rbB, C.rbV];
      for (let y = Math.max(0, Math.floor(cy - R - 1)); y < HORIZON; y++) {
        const foot = Math.min(1, (HORIZON - y) / 14);
        for (let x = Math.floor(cx - R - 1); x <= cx + R + 1; x++) {
          const d = R - Math.hypot(x - cx, y - cy);
          if (d < 0 || d >= bands.length) continue;
          f.blend(x, y, bands[Math.floor(d)]!, 0.4 * k * foot);
        }
      }
    }

    function drawProps(
      f: Frame,
      t: number,
      pointer?: { x: number; y: number } | null
    ) {
      const vx = vmScreen(t);
      if (vx > -40 && vx < w + 4) {
        // the machines glow when the light goes
        glowAt(f, vx + 7, VM_TOP + 10, 16, C.vmGlow, 0.22 * WX.light, 1.2);
        glowAt(f, vx + 25, VM_TOP + 10, 16, C.vmGlow, 0.18 * WX.light, 1.2);
        for (const [k, mx] of [
          [0, vx],
          [1, vx + 18],
        ] as const) {
          const hover =
            pointer &&
            onVending(pointer.x, pointer.y, t) &&
            pointer.x >= mx &&
            pointer.x < mx + VM_W;
          if (hover)
            for (let y = VM_TOP + 4; y < VM_TOP + 17; y++)
              for (let x = mx + 1; x < mx + VM_W - 2; x++)
                f.blend(x, y, C.white, 0.25);
          const a = t - canAt;
          if (k === canMachine && a < CAN_MS) {
            // the chosen button blinks, then the can drops into the tray
            if (a < 700 && Math.floor(a / 110) % 2 === 0)
              f.hline(mx + 2, mx + 12, VM_TOP + 8, C.lamp);
            if (a > 650) {
              const flap = a < 800 ? 1 : 0;
              f.rect(mx + 4, ROAD - 6 + flap, 4, 2, k ? C.can1 : C.can2);
              f.set(mx + 4, ROAD - 6 + flap, C.white);
            }
          }
        }
      }
      // the binoculars: a lens catches the light now and then, and the head
      // lights up under the pointer
      const hover = pointer ? onScope(pointer.x, pointer.y, t, true) : null;
      for (const [i, sx] of screens(L.scopes, t).entries()) {
        if (sx < -SCOPE_W || sx > w) continue;
        const ex = Math.round(sx);
        if (hover !== null && Math.abs(hover - sx) < 1)
          for (let y = SCOPE_TOP; y < SCOPE_TOP + 7; y++)
            for (let x = ex; x < ex + SCOPE_W; x++) f.blend(x, y, C.white, 0.3);
        const cyc = (t + i * 1100) % 2600;
        if (cyc < 420) {
          const k = Math.sin((cyc / 420) * Math.PI);
          const lx = ex + 7;
          const ly = SCOPE_TOP + 4;
          f.blend(lx, ly, C.white, k);
          if (k > 0.5) {
            f.blend(lx - 1, ly, C.white, k * 0.6);
            f.blend(lx + 1, ly, C.white, k * 0.6);
            f.blend(lx, ly - 1, C.white, k * 0.6);
            f.blend(lx, ly + 1, C.white, k * 0.6);
          }
        }
      }
      // the boar signs: a sheen runs over one now and then, one lights up
      // under the pointer, and a tapped one flashes its warning out across
      // the picture
      const onSignNow = pointer
        ? onBoarSign(pointer.x, pointer.y, t, true)
        : null;
      const fa = t - famAt;
      for (const [i, bx] of screens(L.boars, t).entries()) {
        if (bx < -60 || bx > w + 60) continue;
        const sx = Math.round(bx);
        const R = BOAR_SIGN_R;
        const sweep = ((t + i * 1300) % 3400) / 500; // 0..1 while it runs
        const lit = onSignNow !== null && Math.abs(onSignNow - bx) < 1;
        const tapped = fa < 1700 && Math.abs(famSignLx - roadOff(t) - bx) < 1;
        const flash = tapped && fa < 1000 && Math.floor(fa / 120) % 2 === 0;
        if (sweep < 1 || lit || flash)
          for (let dy = -R + 1; dy < R; dy++) {
            const half = R - 1 - Math.abs(dy);
            for (let dx = -half; dx <= half; dx++) {
              if (flash) f.blend(sx + dx, BOAR_SIGN_Y + dy, C.white, 0.55);
              else if (lit) f.blend(sx + dx, BOAR_SIGN_Y + dy, C.white, 0.3);
              else if (Math.abs(dx + dy - (sweep * 2 - 1) * R * 1.6) < 1.2)
                f.blend(sx + dx, BOAR_SIGN_Y + dy, C.white, 0.75);
            }
          }
        if (tapped)
          // diamond rings of warning yellow spreading out from it
          for (let k = 0; k < 3; k++) {
            const pa = fa - k * 260;
            if (pa < 0 || pa > 900) continue;
            const r = R + 2 + pa * 0.055;
            const a = 0.85 * (1 - pa / 900);
            const ri = Math.ceil(r + 2);
            for (let dy = -ri; dy <= ri; dy++)
              for (let dx = -ri; dx <= ri; dx++) {
                const d = Math.abs(dx) + Math.abs(dy);
                if (d >= r && d < r + 2)
                  f.blend(
                    sx + dx,
                    BOAR_SIGN_Y + dy,
                    d < r + 1 ? C.signY : C.signK,
                    a
                  );
              }
          }
      }
      const mx = mirrorScreen(t);
      const g = t - glintAt;
      if (g < GLINT_MS && mx > -10 && mx < w + 10) {
        const p = g / GLINT_MS;
        const r = Math.round(1 + p * 5);
        for (let k = -r; k <= r; k++) {
          f.blend(mx - 1 + k, 53, C.white, 1 - p);
          f.blend(mx - 1, 53 + k, C.white, 1 - p);
        }
      }
    }

    const MASK_W = 120;
    const MASK_H = 8;
    const shadowMask = new Uint8Array(MASK_W * MASK_H);

    /**
     * Copies a vehicle drawn in its own frame `src` (x at sx, tyres on sg)
     * to (x, g): first its reflection in the wet road, darkened and broken
     * up by the rain, and its long shadow on the sunny one, as far as the
     * weather has each.
     */
    function stamp(
      f: Frame,
      src: Frame,
      sx: number,
      sg: number,
      x: number,
      g: number,
      t: number,
      coast = true
    ) {
      const ox = Math.round(x) - sx;
      const oy = g - sg;
      const sw = src.w;
      const sun = coast ? 1 - WX.light : 0;
      if (sun > 0.02) {
        // every pixel projected along the sun onto the road, ahead and a
        // little towards us
        shadowMask.fill(0);
        for (let y = 0; y <= sg && y < src.h; y++)
          for (let xx = 0; xx < sw; xx++) {
            if (!(src.pixels[y * sw + xx]! >>> 24)) continue;
            const hgt = sg - y;
            const mx = xx + Math.round(hgt * SHADOW_X);
            const my = Math.round(hgt * SHADOW_Y);
            if (mx < MASK_W && my < MASK_H) shadowMask[my * MASK_W + mx] = 1;
          }
        for (let y = 0; y < MASK_H; y++)
          for (let xx = 0; xx < MASK_W; xx++)
            if (shadowMask[y * MASK_W + xx])
              f.blend(ox + xx, g + y, C.shade, 0.55 * sun);
      }
      const wet = coast ? WX.wet : 0;
      if (wet > 0.02)
        for (let k = 1; k <= 12; k++) {
          const ry = g + k;
          const sy = sg - k + 1;
          if (ry > EDGE || sy < 0) break;
          if ((k + Math.floor(t / 70)) % 4 === 0) continue;
          const wob = Math.round(Math.sin(k * 1.7 + t / 120) * 0.8);
          for (let xx = 0; xx < sw; xx++) {
            const p = src.pixels[sy * sw + xx]!;
            if (!(p >>> 24)) continue;
            const c = ((p & 0xff) << 16) | (p & 0xff00) | ((p >>> 16) & 0xff);
            f.blend(ox + xx + wob, ry, c, (0.55 - k * 0.03) * wet);
          }
        }
      for (let yy = 0; yy < src.h; yy++)
        for (let xx = 0; xx < sw; xx++) {
          const p = src.pixels[yy * sw + xx]!;
          if (!(p >>> 24)) continue;
          const px = ox + xx;
          const py = oy + yy;
          if (px >= 0 && px < f.w && py >= 0 && py < f.h)
            f.pixels[py * f.w + px] = p;
        }
    }

    /** One rider: shadow or reflection, the bike, its lights, spray. */
    function drawRider(
      f: Frame,
      who: Who,
      x: number,
      g: number,
      t: number,
      opts: BikeOptions,
      pal: BikePalette,
      coast: boolean
    ) {
      const wheelT = (roadOff(t) * 70) / 6.5 + (who === 'friend' ? 37 : 0);
      scratch.clear();
      drawMotorcycle(scratch, SCR_X, SCR_G, wheelT, pal, true, opts);
      stamp(f, scratch, SCR_X, SCR_G, x, g, t, coast);
      const o: BikeOptions = { wheelie: opts.wheelie };
      const [hx, hy] = bikePoint(Math.round(x), g, BIKE_POINTS.headlight, o);
      const [lx, ly] = bikePoint(Math.round(x), g, BIKE_POINTS.tailLight, o);
      const gloom = coast ? WX.light : 1;
      glowAt(f, hx + 1, hy, 7, C.lampGlow, 0.22 + 0.28 * gloom);
      f.set(hx, hy, C.lampHot);
      // the brake light flares as they pull up, and stays on while they
      // wait, hazards blinking
      const brake = coast ? braking(t) : 0;
      if (brake > 0.5 && Math.floor((t - lastStop()) / 380) % 2 === 0)
        for (const pt of [BIKE_INDICATOR_F, BIKE_INDICATOR_R]) {
          const [ax, ay] = bikePoint(Math.round(x), g, pt, o);
          glowAt(f, ax, ay, 5, pal.amber, 0.55);
          f.set(ax, ay, C.lampHot);
        }
      glowAt(
        f,
        lx,
        ly,
        4 + 3 * brake,
        C.tailGlow,
        0.2 + 0.25 * gloom + 0.45 * brake
      );
      if (brake > 0.5) f.set(lx, ly, C.lampHot);
      const wet = coast ? WX.wet : 0;
      if (wet <= 0.02) return;
      // (no spray off tyres that have stopped)
      const go = wet * (1 - stopped(t));
      // the headlight laid down the road ahead as a bright smear, the tail
      // light as a red one
      for (let k = 2; k < 40; k++) {
        const a = 0.42 * (1 - k / 40) * wet;
        f.blend(hx + k, g + 1, C.lampGlow, a);
        if (k < 26) f.blend(hx + k + 2, g + 2, C.lampGlow, a * 0.6);
      }
      for (let k = 1; k < 9; k++)
        if (k % 3) f.blend(lx, g + k, C.tailGlow, (0.45 - k * 0.04) * wet);
      // spray thrown up off the back tyre, and a little off the front
      for (let i = 0; i < 26; i++) {
        const ph = (t / (380 + hash2(i, 1, 5) * 200) + hash2(i, 2, 5)) % 1;
        const sx = x - 3 - ph * (14 + hash2(i, 3, 5) * 14);
        const sy =
          g - Math.sin(ph * Math.PI) * (3 + hash2(i, 4, 5) * 5) - ph * 2;
        f.blend(sx, sy, C.spray, (1 - ph) * 0.8 * go);
        if (i % 3 === 0) f.blend(sx - 1, sy, C.spray, (1 - ph) * 0.5 * go);
      }
      for (let i = 0; i < 8; i++) {
        const ph = (t / 300 + hash2(i, 5, 5)) % 1;
        f.blend(
          x + 30 + ph * 6,
          g - Math.sin(ph * Math.PI) * 2,
          C.spray,
          (1 - ph) * 0.6 * go
        );
      }
    }

    /**
     * Rain streaks slanting left as we ride into them, as many as `density`
     * says; `lit` dims them or lights them up in a beam.
     */
    function rain(
      f: Frame,
      t: number,
      which: number,
      density: number,
      lit?: (x: number, y: number) => number
    ) {
      if (density <= 0.01) return;
      const cfg = [
        { n: 0.9, len: 3, speed: 0.16, c: C.rainFar, a: 0.35 },
        { n: 0.55, len: 5, speed: 0.26, c: C.rain, a: 0.55 },
        { n: 0.14, len: 9, speed: 0.42, c: C.rainHi, a: 0.7 },
      ][which]!;
      // a light shower first, the big drops only once it's pouring
      const k = which === 2 ? smooth((density - 0.4) / 0.6) : density;
      const count = Math.round(w * cfg.n * k);
      const H = h + 20;
      const span = w + 60;
      for (let i = 0; i < count; i++) {
        const sp = cfg.speed * (0.85 + hash2(i, 0, which) * 0.3);
        const y0 = ((hash2(i, 2, which) * H + t * sp) % H) - 10;
        const x0 =
          ((((hash2(i, 1, which) * span - y0 * 0.38 - t * 0.02) % span) +
            span) %
            span) -
          30;
        for (let j = 0; j < cfg.len; j++) {
          const x = Math.round(x0 + j * 0.38);
          const y = Math.round(y0 - j);
          const l = lit ? lit(x, y) : 1;
          if (l <= 0) continue;
          f.blend(x, y, lit ? N.nLight : cfg.c, cfg.a * l);
        }
      }
    }

    function splashes(f: Frame, t: number) {
      // rain landing on the road: tiny crowns that come and go
      const n = Math.round((w / 5) * WX.rain);
      for (let i = 0; i < n; i++) {
        const per = 300 + hash2(i, 1, 17) * 200;
        const ph = t / per + hash2(i, 2, 17);
        const cyc = Math.floor(ph);
        const a = ph - cyc;
        if (a > 0.35) continue;
        const x = Math.round(hash2(i, cyc, 18) * w);
        const y = ROAD + 3 + Math.round(hash2(i, cyc, 19) * (EDGE - ROAD - 3));
        if (a < 0.15) f.blend(x, y, C.rainHi, 0.7);
        else {
          f.blend(x - 1, y - 1, C.rainHi, 0.6);
          f.blend(x + 1, y - 1, C.rainHi, 0.6);
        }
      }
    }

    function riderOpts(who: Who, t: number, mix: number): BikeOptions {
      const tf = traffic(t);
      const bx = who === 'lead' ? leadX(t) : friendX(t);
      // (nobody to wave to once they're deep in the forest); and they wave
      // the boar family off
      const wave =
        (mix < 1 &&
          !!tf &&
          tf.kind === 'bike' &&
          tf.x < bx + 60 &&
          tf.x > bx - 70) ||
        famWave(who, t);
      return {
        blur: boost(t) > 0.6,
        wave,
        wheelie: riderPose(who, t, mix).wheelie,
        who,
        bag: who === 'friend',
      };
    }

    // which way the rain cloud rolls in: from the sea side on the right
    const fromRight = new Float32Array(w);
    for (let x = 0; x < w; x++) fromRight[x] = 1 - x / Math.max(1, w - 1);

    function renderCoast(
      f: Frame,
      t: number,
      pointer: { x: number; y: number } | null | undefined,
      mix: number
    ) {
      const tr = travel(t);
      const lutLight = pairs.lut(WX.light);
      const cover = WX.cover;
      blit(f, base, lutLight, 0, 0, WALL + 8);
      // fair-weather cloud melts away as the rain cloud comes over
      if (cover < 0.98)
        blitCloud(
          f,
          cum,
          cumThr,
          lutLight,
          SPEED.cloud * tr + t * 0.002,
          0,
          HORIZON + 4,
          (th) => th >= cover * 255 * 1.05
        );
      if (cover > 0.02) {
        const c255 = cover * 255;
        const showDeck = (th: number, x: number) =>
          th * 0.6 + fromRight[x]! * 102 < c255;
        blitCloud(
          f,
          deck,
          deckThr,
          lutLight,
          SPEED.cloud * tr + t * 0.004,
          0,
          HORIZON,
          showDeck
        );
        drawSunBreak(f, t);
        blitCloud(
          f,
          scud,
          scudThr,
          lutLight,
          SPEED.cloud * tr * 3 + t * 0.012,
          24,
          HORIZON - 3,
          showDeck
        );
      }
      drawRainbow(f);
      blit(f, oshima, lutLight, 0, HORIZON - 10, HORIZON);
      // rain curtains hanging off the cloud base over the sea
      if (WX.rain > 0.05)
        for (let i = 0; i < 3; i++) {
          const span = w + 120;
          const cx =
            ((((hash2(i, 1, 51) * span - t * 0.006 - tr * 0.004) % span) +
              span) %
              span) -
            60;
          const half = 14 + hash2(i, 2, 51) * 20;
          for (let x = Math.floor(cx - half); x <= cx + half; x++) {
            if (hash2(x, i, 52) < 0.45) continue;
            const a = 0.32 * (1 - Math.abs(x - cx) / half) * WX.rain;
            for (let y = 32; y <= HORIZON + 6; y++)
              f.blend(x + Math.round((y - 32) * 0.3), y, C.curtain, a);
          }
        }
      blit(f, far, lutLight, SPEED.far * tr, FAR_WL - 16, FAR_WL + 1);
      drawBoat(f, tr, t);
      drawSea(f, tr, t);
      blit(f, mid, lutLight, SPEED.mid * tr, WL - 45, WL + 3);
      // the lighthouse lamp turns, its beam sweeping through the gloom
      const lhx = onScreen(lighthouse.x, SPEED.mid * tr, LM, w);
      if (lhx > -60 && lhx < w + 60 && WX.light > 0.05) {
        const sweep = Math.sin(t / 1300);
        const len = 40 * Math.abs(sweep);
        const dir = sweep > 0 ? 1 : -1;
        for (let k = 2; k < len; k++)
          for (let d = -1; d <= 1; d++)
            f.blend(
              lhx + 1 + dir * k,
              lighthouse.y + 1 + d * Math.round(k / 14),
              C.lamp,
              0.3 * (1 - k / 40) * WX.light
            );
        if (Math.abs(sweep) < 0.25)
          glowAt(f, lhx + 1, lighthouse.y + 1, 5, C.lamp, 0.8 * WX.light);
      }
      drawGulls(f, tr, t);
      drawKites(f, t);
      rain(f, t, 0, WX.rain);
      blit(f, beach, lutLight, SPEED.beach * tr, BEACH - 2, WALL + 6);
      drawSurf(f, tr, t);
      blit(
        f,
        road,
        pairs.lut(WX.light * 0.4 + WX.wet * 0.6),
        SPEED.road * tr,
        24,
        h
      );
      drawProps(f, t, pointer);
      if (WX.rain > 0.05) splashes(f, t);
      const tf = traffic(t);
      if (tf) {
        if (tf.kind === 'truck') drawTruck(f, tf.x, t);
        else {
          scratch.clear();
          drawMotorcycle(scratch, SCR_X, SCR_G, -t * 1.6, oncoming, true, {
            flip: true,
            wave: tf.x < bikeX + 70 && tf.x > bikeX - GAP - 70,
          });
          stamp(f, scratch, SCR_X, SCR_G, tf.x, ONCOMING, t);
          const [hx, hy] = bikePoint(tf.x, ONCOMING, BIKE_POINTS.headlight, {
            flip: true,
          });
          glowAt(f, hx - 1, hy, 6, C.lampGlow, 0.2 + 0.25 * WX.light);
          for (let k = 1; k < 13; k++)
            if (k % 3)
              f.blend(
                hx - (k % 2),
                ONCOMING + k,
                C.lampGlow,
                (0.45 - k * 0.03) * WX.wet
              );
        }
      }
      // the boars and the two riders, back to front: the friend's further over
      const beasts: { x: number; y: number; dir: number; k: number }[] = [];
      const b = boarFor(t);
      if (b) beasts.push({ ...boarPos(b, t), dir: 1, k: 0 });
      beasts.push(...family(t));
      beasts.sort((p, q) => p.y - q.y);
      const drawBeasts = (y0: number, y1: number) => {
        for (const p of beasts)
          if (p.y >= y0 && p.y < y1) {
            if (p.k === 0) drawBoar(f, C, p.x, p.y, p.dir, t);
            else drawPig(f, C, p.x, p.y, p.dir, t, p.k * 37);
          }
      };
      drawBeasts(-Infinity, G_FRIEND);
      for (const who of ['friend', 'lead'] as const) {
        const p = riderPose(who, t, mix);
        drawRider(
          f,
          who,
          p.x,
          p.g,
          t,
          riderOpts(who, t, mix),
          riderPal(who, WX.light),
          true
        );
        if (who === 'friend') drawBeasts(G_FRIEND, G_LEAD);
      }
      drawBeasts(G_LEAD, Infinity);
      bushLife(f, t, true);
      blit(f, front, lutLight, SPEED.road * tr, VERGE - 22, h);
      bushLife(f, t, false);
      // a pink trail ribbon on each signpost, flicking in the wind; a sign
      // lights up a little under the pointer
      const fr = Math.floor(t / 210) % 3;
      for (const tx of screens(L.trails, t)) {
        if (tx < -30 || tx > w + 30) continue;
        const rx = tx + 16;
        const ry = VERGE - 12;
        f.set(rx, ry, C.ribbon);
        f.set(rx + 1, ry + (fr === 1 ? 0 : 1), C.ribbon);
        f.set(rx + 2, ry + (fr === 2 ? 0 : 1), C.ribbonSh);
        if (fr !== 0) f.set(rx + 3, ry + 1 + (fr === 1 ? 1 : 0), C.ribbonSh);
        if (
          pointer &&
          pointer.x >= tx - 9 &&
          pointer.x <= tx + 22 &&
          onTrail(pointer.x, pointer.y, t)
        )
          for (let y = VERGE - 19; y < VERGE - 13; y++)
            for (let x = tx + 7; x < tx + 21; x++) f.blend(x, y, C.lamp, 0.3);
      }
      blit(f, fore, lutLight, SPEED.fore * tr, 128, h);
      rain(f, t, 1, WX.rain);
      rain(f, t, 2, WX.rain);
      fxTop.draw(f, t);
    }

    // in the forest: the eyes open at EYES_AT and watch from the bushes
    // until EYES_MS, then the boar bolts (gone before the dissolve back)
    const EYES_AT = 2600;
    const EYES_MS = 5400;
    const BOLT_MS = 2200;

    // how strongly the headlights light each pixel this frame, in quarters
    const beamBuf = new Uint8Array(w * h);
    let beamBox: [number, number, number, number] = [0, 0, 0, 0];

    function renderForest(f: Frame, t: number, mix: number) {
      const a = t - trailAt;
      for (let y = 0; y < h; y++)
        f.rect(0, y, w, 1, y < 26 ? N.nSky1 : y < 58 ? N.nSky2 : N.nSky0);
      const off = roadOff(t);
      scrollRows(f, forest.back, off * 0.35, 0, h);
      scrollRows(f, forest.mid, off * 0.65, 0, h);
      scrollRows(f, forest.ground, off, TRAIL_G - 12, h);
      // the bikes, bucking over roots and ruts
      const beams: [number, number][] = [];
      const bikes: [Who, number, number, BikeOptions, BikePalette][] = [];
      for (const [who, pal] of [
        ['friend', FRIEND_N],
        ['lead', LEAD_N],
      ] as const) {
        const { x, g } = riderPose(who, t, mix);
        const opts = riderOpts(who, t, mix);
        bikes.push([who, x, g, opts, pal]);
        beams.push(bikePoint(Math.round(x), g, BIKE_POINTS.headlight, opts));
      }
      // headlight beams: whatever they reach comes up out of the dark,
      // warm, with a haze of light in the air
      const [bx0, by0, bx1, by1] = beamBox;
      for (let y = by0; y < by1; y++) beamBuf.fill(0, y * w + bx0, y * w + bx1);
      const LEN = 130;
      let nx0 = w;
      let ny0 = h;
      let nx1 = 0;
      let ny1 = 0;
      for (const [hx, hy] of beams) {
        const x0 = Math.max(0, Math.floor(hx + 1));
        const x1 = Math.min(w, Math.ceil(hx + LEN));
        for (let x = x0; x < x1; x++) {
          const dx = x - hx;
          const spread = 2 + dx * 0.17;
          const cy = hy + dx * 0.09;
          const y0 = Math.max(0, Math.floor(cy - spread));
          const y1 = Math.min(h - 1, Math.ceil(cy + spread));
          const fall = 1 - dx / LEN;
          for (let y = y0; y <= y1; y++) {
            const e = Math.abs(y - cy) / spread;
            if (e >= 1) continue;
            const q = Math.ceil((1 - e) * fall * 4);
            const i = y * w + x;
            if (q > beamBuf[i]!) beamBuf[i] = q;
          }
          nx0 = Math.min(nx0, x);
          nx1 = Math.max(nx1, x + 1);
          ny0 = Math.min(ny0, y0);
          ny1 = Math.max(ny1, y1 + 1);
        }
      }
      beamBox = [nx0, ny0, Math.max(nx0, nx1), Math.max(ny0, ny1)];
      const px = f.pixels;
      for (let y = ny0; y < ny1; y++)
        for (let x = nx0; x < nx1; x++) {
          const q = beamBuf[y * w + x]!;
          if (q) px[y * w + x] = lit(px[y * w + x]!, q / 4);
        }
      // a pair of eyes in the bushes, catching the light; then the boar bolts
      // (all of it on the far side of the track, ahead of the lead)
      if (a > EYES_AT && a < EYES_MS + BOLT_MS) {
        // drifting back as we draw level, but staying ahead of the lead bike
        const mx = leadX(trailAt);
        const ex0 = Math.min(w - 10, mx + 66);
        const ex = Math.round(
          ex0 -
            ((Math.min(a, EYES_MS) - EYES_AT) / (EYES_MS - EYES_AT)) *
              Math.max(0, ex0 - mx - 40)
        );
        const ey = TRAIL_G - 15;
        if (a < EYES_MS) {
          const blink = a % 1700 < 140 && Math.floor(a / 1700) % 3 === 2;
          if (!blink) {
            const on = ex >= 0 && ex < w && beamBuf[ey * w + ex]! > 0;
            const c = on ? N.eyes : lerpRGB(N.eyes, N.nSky0, 0.45);
            f.set(ex, ey, c);
            f.set(ex + 2, ey, c);
            if (on) {
              glowAt(f, ex + 1, ey, 3, N.eyes, 0.35);
              f.set(ex, ey, N.eyes);
              f.set(ex + 2, ey, N.eyes);
            }
          }
        } else {
          // it crashes out of the bushes, its eye where the pair of eyes
          // was, across the track ahead and away off the edge into the dark
          const u = (a - EYES_MS) / BOLT_MS;
          const bx = Math.round(ex - 5 + u * (0.5 + 0.5 * u) * (w + 27 - ex));
          const by2 = ey + 8 + Math.round(Math.sin(u * Math.PI) * 4);
          const on =
            bx >= 0 && bx < w && by2 > 2 && beamBuf[(by2 - 3) * w + bx]! > 0;
          drawBoar(f, RAIN, bx, by2, 1, t, !on);
        }
      }
      // the riders over the lit ground, silhouetted in each other's beams
      for (const [who, x, gr, opts, pal] of bikes)
        drawRider(f, who, x, gr, t, opts, pal, false);
      for (const [hx, hy] of beams) glowAt(f, hx + 1, hy, 6, C.lampGlow, 0.7);
      scrollRows(f, forest.near, off * 1.6, 0, h);
      // rain, if it's raining: faint in the dark, bright where the beams catch it
      const inBeam = (x: number, y: number) =>
        x >= 0 && x < w && y >= 0 && y < h ? beamBuf[y * w + x]! / 4 : 0;
      rain(f, t, 1, WX.rain, (x, y) => Math.max(0.12, inBeam(x, y) * 1.6));
      rain(f, t, 2, WX.rain, (x, y) => Math.max(0.1, inBeam(x, y) * 1.4));
      fxTop.draw(f, t);
    }

    // the binoculars' dark rim round the window (as a stored pixel)
    const RIM = 0xff120d0c;
    /** The dip up to the Skyline: the view through the window, or all of it. */
    function renderSky(
      f: Frame,
      t: number,
      pointer: { x: number; y: number } | null | undefined
    ) {
      const a = t - skyAt;
      const ir = iris(a, t);
      if (!ir) {
        view.render(f, a);
        return;
      }
      renderCoast(f, t, pointer, 0);
      view.render(viewF, a);
      const o = ir.R * LOBE;
      const keep = 1 - ir.dim;
      const px = f.pixels;
      const vp = viewF.pixels;
      for (let y = 0; y < h; y++) {
        const dy2 = (y - ir.cy) ** 2;
        for (let x = 0; x < w; x++) {
          const ax = x - ir.cx;
          const d = Math.sqrt(Math.min((ax + o) ** 2, (ax - o) ** 2) + dy2);
          const e = ir.R - d;
          const i = y * w + x;
          if (e > 3 * bayer8(x, y)) px[i] = vp[i]!;
          else if (e > -2) px[i] = RIM;
          else if (keep < 1) {
            // everything outside goes dark, as if you'd put your eyes to them
            const p = px[i]!;
            px[i] =
              (0xff000000 |
                (Math.round(((p >>> 16) & 0xff) * keep) << 16) |
                (Math.round(((p >>> 8) & 0xff) * keep) << 8) |
                Math.round((p & 0xff) * keep)) >>>
              0;
          }
        }
      }
    }

    return {
      render(f, t, pointer) {
        now = t;
        WX = weather(t);
        C = palAt(WX.light);
        if (skyOn(t)) {
          renderSky(f, t, pointer);
          return;
        }
        const mix = forestMix(t);
        if (mix <= 0) {
          renderCoast(f, t, pointer && unzoom(pointer.x, pointer.y, t), 0);
          applyZoom(f, t);
          return;
        }
        if (mix >= 1) {
          renderForest(f, t, 1);
          return;
        }
        renderCoast(f, t, pointer, mix);
        renderForest(night, t, mix);
        // an ordered dissolve between the two
        const px = f.pixels;
        const np = night.pixels;
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++)
            if (bayer8(x, y) < mix) px[y * w + x] = np[y * w + x]!;
      },
      poke(px, py, t) {
        if (skyOn(t)) return; // up on the Skyline there's only the view
        const { x, y } = unzoom(px, py, t);
        const coast = forestMix(t) === 0;
        // the binoculars' heads stand clear above the riders
        const head = coast ? onScope(x, y, t, false) : null;
        if (head !== null) {
          if (!busy(t)) startSky(t, head);
          return;
        }
        // and so do the boar signs' diamonds
        const sign = coast ? onBoarSign(x, y, t, false) : null;
        if (sign !== null) {
          // one family at a time, and not while they're stopped already
          if (!busy(t) && !famOut(t)) startFamily(t, sign);
          return;
        }
        // the sign stands on the near verge, in front of the bikes passing it
        if (coast && onSign(x, y, t)) {
          if (!busy(t)) trailAt = t;
          return;
        }
        for (const who of ['lead', 'friend'] as const) {
          if (!onRider(who, x, y, t)) continue;
          // a wheelie already up is never restarted: one more can queue behind it
          const list = wheelies[who];
          const last = list.length ? list[list.length - 1]! : -Infinity;
          const next = Math.max(t, last + WHEELIE_MS + 120);
          if (next - t > WHEELIE_MS + 200) return;
          wheelies[who] = list.filter((s) => t - s < SURGE_MS);
          wheelies[who].push(next);
          // (stopped, it's a wheelie on the spot: no surge down the road)
          if (!halted(next)) {
            revs = revs.filter((r) => {
              if (t - r > REV_TAU * 14) {
                banked += REV_GAIN;
                return false;
              }
              return true;
            });
            revs.push(next);
          }
          exhaust(next, who);
          return;
        }
        if (!coast) return; // in the forest, the riders are all there is
        const scope = onScope(x, y, t, true);
        if (scope !== null) {
          if (!busy(t)) startSky(t, scope);
          return;
        }
        const post = onBoarSign(x, y, t, true);
        if (post !== null) {
          if (!busy(t) && !famOut(t)) startFamily(t, post);
          return;
        }
        if (onTrail(x, y, t)) {
          if (!busy(t)) trailAt = t;
          return;
        }
        if (onVending(x, y, t)) {
          if (t - canAt < CAN_MS) return; // one can at a time
          canAt = t;
          canMachine = x >= vmScreen(t) + 17 ? 1 : 0;
          return;
        }
        if (onMirror(x, y, t)) {
          if (t - glintAt >= GLINT_MS) glintAt = t;
          return;
        }
        if (y < HORIZON - 4) {
          // turn the weather the other way, unless it's already turning
          if (!turning(t)) {
            wxTo = 1 - wxTo;
            wxStart = t;
          }
          return;
        }
        if (y < WALL + 2) {
          bigWave(t, x);
          return;
        }
        if (y >= VERGE - 4) {
          if (boarFor(t) || famOut(t)) return; // one boar at a time
          // out of the grass where you clicked, unless that's under the bikes
          boarAt = t;
          boarLx = (clearOfBikes(x, t) ? x : boarSafeX(t)) + roadOff(t);
        }
      },
      eggs(t) {
        if (busy(t)) return [];
        const spots: EggSpot[] = [];
        // a trail sign, off into the night forest
        const sx = inView(L.trails, t, 14);
        if (sx !== null)
          spots.push({ id: 'forest', x: sx, y: VERGE - 12, r: 8 });
        // a boar warning sign: and out comes the family
        const bx = famOut(t) ? null : inView(L.boars, t);
        if (bx !== null)
          spots.push({ id: 'boar', x: bx, y: BOAR_SIGN_Y, r: BOAR_SIGN_R });
        // the coin binoculars, up to the Skyline
        const ex = inView(L.scopes, t, SCOPE_EYE[0]);
        if (ex !== null)
          spots.push({ id: 'skyline', x: ex, y: SCOPE_EYE_Y, r: 7 });
        return spots;
      },
      hot(px, py) {
        const t = now;
        if (skyOn(t)) return false;
        const { x, y } = unzoom(px, py, t);
        const coast = forestMix(t) === 0;
        if (coast && onScope(x, y, t, false) !== null) return true;
        if (coast && onBoarSign(x, y, t, false) !== null) return true;
        if (onRider('lead', x, y, t) || onRider('friend', x, y, t)) return true;
        if (!coast) return false;
        if (
          onVending(x, y, t) ||
          onMirror(x, y, t) ||
          onTrail(x, y, t) ||
          onScope(x, y, t, true) !== null ||
          onBoarSign(x, y, t, true) !== null
        )
          return true;
        if (y < HORIZON - 4) return !turning(t);
        return y < WALL + 2 || y >= VERGE - 4;
      },
    };
  },
};
