// Donetsk: a summer evening in the dvor, the courtyard between a
// nine-storey panel block and a brick Khrushchevka. Through the gap between
// them the sun goes down behind the mine, the headframe's wheels turning
// against the glow, and the big terykon (spoil heap) catches the last light,
// the old skip incline running up its face and green creeping up its foot.
// Balconies full of life: washing, dishes, geraniums, a neighbour watering
// her flowers, windows coming on one by one. A trolleybus hums up to the stop
// by the ice-cream kiosk, a girl swings, two boys kick a ball about, a boy
// rides his bike up and down the drive, babushkas on a forged bench feed the
// pigeons, a bronze miner holds up his lump of coal on a granite plinth, the
// men play dominoes under the apricot tree, the park's ferris wheel turns far
// off on the horizon, poplar fluff drifts through the low sun, and roses
// everywhere: the city of a million roses. Everything in the yard is sized to
// where it stands: about 0.16 * (y - HZ) px to the metre.
//
// Click the monument and a kid brings flowers to lay at the plinth (they stay),
// the swing to push it higher, the boys for a big hoof into the sky,
// the pigeons to send them round the yard, the dominoes for the winning tile,
// the apricot tree to shake down fruit, the kiosk for an ice cream, the street
// for a trolleybus, the headframe to spin its wheels, the terykon to fly a
// kite off the top, the ferris wheel for its lights, a window to switch its
// light, the roses for a gust of petals, the sky for the swifts. Nothing
// already under way starts over: a click while it's happening is ignored.

import { type Frame, type RGB, sprite } from '../frame';
import { Fx } from '../fx';
import { fbm1, hash2 } from '../noise';
import { glow, gradient } from '../paint';
import { layer, palette, type Scene } from '../scene';

const P = palette({
  sky0: '#2b2a6e',
  sky1: '#3d347e',
  sky2: '#5a3f8c',
  sky3: '#844c94',
  sky4: '#b45e8e',
  sky5: '#dc7480',
  sky6: '#f49470',
  sky7: '#ffb86a',
  sky8: '#ffd47e',
  sun: '#fff6d6',
  sunRim: '#ffe7a0',
  sunGlow: '#ffc674',
  cloudLight: '#ffd29a',
  cloudLit: '#ffa080',
  cloudBase: '#d27088',
  cloudShadow: '#8e5288',
  // the far city, in the haze
  cityFar: '#b67a8e',
  cityFarLit: '#d8968e',
  cityFarDark: '#9a6684',
  winWarm: '#ffd88c',
  // terykony
  heapRim: '#ffc08a',
  heapLit: '#e8906a',
  heapMid: '#b0606a',
  heapShade: '#74405e',
  heapDeep: '#4e2e50',
  grassRim: '#c8c25a',
  grassLit: '#9aa448',
  grass: '#6a7e3c',
  grassShade: '#4a5a3c',
  grassDeep: '#34423a',
  farTree: '#7e5474',
  farTreeLit: '#c27c7c',
  farTreeDark: '#62426a',
  // the mine
  steel: '#3e2c48',
  steelLit: '#b0605e',
  steelRim: '#ffaa70',
  lamp: '#ff4040',
  // the street
  walk: '#a07888',
  walkLit: '#e8a888',
  road: '#7c5e78',
  roadLit: '#d89482',
  roadGlare: '#ffcf96',
  roadLine: '#b48e9a',
  kerb: '#c09aa4',
  pole: '#4a3452',
  wire: '#4a3456',
  poplarRim: '#d8b45a',
  poplarLit: '#7e8c3e',
  poplar: '#4a6034',
  poplarDark: '#33452e',
  // the nine-storey, in its own shade
  panelHi: '#b4a4c2',
  panelTop: '#a090b2',
  panel: '#9886aa',
  panelLo: '#887898',
  seam: '#7e6e92',
  endWall: '#6c5c84',
  endSeam: '#5e4e76',
  roofTop: '#c8b4c8',
  recess: '#4e4066',
  glass: '#56487a',
  glassHi: '#8676a8',
  frame: '#e0d6e8',
  frameLo: '#b8aac6',
  lit: '#ffcf78',
  litHi: '#fff2bc',
  litLo: '#f0a050',
  tv: '#9cb8ff',
  tvHi: '#e4eeff',
  curtain: '#e8865a',
  curtain2: '#d0708e',
  stair: '#e8d898',
  parConc: '#b0a0ba',
  parConcLo: '#9a8cac',
  parGreen: '#6e9a86',
  parGreenLo: '#5a826e',
  parBlue: '#7a8ec4',
  parBlueLo: '#6074aa',
  parWood: '#b07a5a',
  parWoodLo: '#8e5c4a',
  glazed: '#c4a6c8',
  glazedHi: '#ecd0dc',
  cloth1: '#f8f0f4',
  cloth2: '#ff86a8',
  cloth3: '#70a6f4',
  cloth4: '#ffd84a',
  cloth5: '#ec5050',
  cloth6: '#90d070',
  plant: '#4e9248',
  plantHi: '#86c45e',
  geranium: '#ff4a5a',
  dish: '#e0d8e4',
  dishLo: '#a69cb6',
  door: '#6e4a58',
  doorHi: '#946478',
  // the Khrushchevka, ochre brick, its end wall in the sun
  brick: '#aa7476',
  brickHi: '#c48e86',
  brickLo: '#966270',
  brickDim: '#a06c72',
  brickTop: '#b07c7a',
  sunWall: '#ffad74',
  sunWallHi: '#ffd29c',
  sunWallLo: '#ec8c66',
  roof: '#5e4a66',
  antenna: '#4a3a58',
  // the courtyard
  asphalt: '#6e6080',
  asphaltLo: '#605474',
  crack: '#54486a',
  earth: '#86687a',
  earthLo: '#76596e',
  sunGround: '#e6a684',
  sunGroundHi: '#ffcc9c',
  sunGroundLo: '#c88880',
  earthLit: '#e0a288',
  earthLit2: '#d09288',
  earthLit3: '#be8486',
  pebble: '#a07484',
  lawn: '#3e5c50',
  lawnLo: '#324c46',
  lawnLit: '#aeae5a',
  lawnLit2: '#98a056',
  lawnLit3: '#848e54',
  lawnLitHi: '#d8cc6a',
  lawnPen: '#5c7454',
  shadow: '#4c4066',
  // trees and flowers
  leafDeep: '#1e3a38',
  leafDark: '#284a40',
  leaf: '#386446',
  leafMid: '#4e7c4a',
  leafLit: '#9aaa4c',
  leafRim: '#e2cc68',
  trunk: '#4a3640',
  trunkLit: '#a86a5e',
  apricot: '#ff9a3c',
  apricotHi: '#ffd070',
  apricotLo: '#d8682e',
  mallow: '#ff86b2',
  mallowHi: '#ffd2e2',
  mallowWhite: '#fff0f4',
  stem: '#4a7a40',
  // the playground
  swing: '#e4503e',
  swingLo: '#a03040',
  swingHi: '#ff9e72',
  rod: '#5e4e66',
  seat: '#c47e56',
  bench: '#b47456',
  benchLo: '#7e4c46',
  benchLeg: '#8a7a92',
  // people
  skin: '#f2b294',
  skinLo: '#c47c7c',
  hair: '#3e2a30',
  hairFair: '#d09a58',
  hairRed: '#a8502e',
  shirtR: '#ea4c4c',
  shirtY: '#f8c840',
  shirtB: '#4a7ad2',
  shirtW: '#f4ecf4',
  shirtG: '#4aa860',
  shirtP: '#f28cb2',
  shorts: '#3a4a7a',
  shoe: '#2e2430',
  scarfR: '#e05050',
  scarfW: '#f0e8e0',
  scarfB: '#5a8ad8',
  dress: '#4a4a8a',
  dress2: '#7a4a5e',
  dress3: '#3e6a5a',
  apron: '#c890a8',
  rim: '#ffd8a8',
  ball: '#f8f4f8',
  ballDark: '#2a2430',
  // pigeons
  pigeon: '#9c9aba',
  pigeonLo: '#6e6c92',
  pigeonHi: '#cacae2',
  pigeonNeck: '#78b0a0',
  feet: '#e06a6a',
  // trolleybus
  tbCream: '#f6e8d6',
  tbCreamLo: '#d4bcb8',
  tbRed: '#d8463e',
  tbRedLo: '#a02c3e',
  tbGlass: '#3e304e',
  tbGlassLit: '#ffcf90',
  tbRoof: '#b6a4b2',
  tbDark: '#2a2030',
  tbBoard: '#ffd060',
  headlight: '#fff6d6',
  tail: '#ff4040',
  spark: '#dff4ff',
  // the kiosk and the stop
  kiosk: '#ece4f0',
  kioskLo: '#bcb2c8',
  kioskBlue: '#4a74c0',
  awning: '#e84a4a',
  awningW: '#f8f0f0',
  kioskWin: '#ffe2a2',
  // roses
  roseLeafHi: '#86b44a',
  roseLeafLit: '#4e8c3c',
  roseLeaf: '#2e6434',
  roseLeafDark: '#1e4630',
  roseLeafDeep: '#122a26',
  redHi: '#ff8a7a',
  red: '#e2283c',
  redDark: '#8e0e30',
  pinkHi: '#ffd6e4',
  pink: '#f47aa6',
  pinkDark: '#b83c74',
  yellowHi: '#fff6b0',
  yellow: '#ffd23a',
  yellowDark: '#d0801c',
  creamHi: '#ffffff',
  cream: '#fff0dc',
  creamDark: '#dcb8b0',
  coralHi: '#ffc2a0',
  coral: '#ff7a58',
  coralDark: '#c4403e',
  // creatures and little things
  swift: '#2a2448',
  butterfly: '#fff6e0',
  butterflyDot: '#ff9a3a',
  bug: '#2a1e1e',
  fluff: '#fff8ee',
  firefly: '#eaff9a',
  kite: '#ff4a4a',
  kiteHi: '#ffe04a',
  kiteBlue: '#4a7ad2',
  string: '#5a4060',
  // the Zhiguli parked on the drive
  car: '#7a94d2',
  carHi: '#b2c8f0',
  carLo: '#5468a4',
  chrome: '#ece8f4',
  tyre: '#2a2232',
  // dominoes under the apricot tree
  vest: '#f2eef6',
  vestLo: '#c8bcd4',
  cap: '#4a4a5e',
  trousers: '#3e3a56',
  table: '#9a6a5a',
  tableLo: '#6e4a4c',
  tile: '#fbf6ee',
  // the sandbox and its mushroom
  sand: '#c0a0a0',
  sandLit: '#ffdcb0',
  board: '#c08a5a',
  boardLo: '#8a5a48',
  cap1: '#ea4440',
  cap1Lo: '#a42c3c',
  dot: '#fff4f0',
  stalk: '#eadcc8',
  // the ferris wheel in the park, peeking over the roof
  fw: '#7a5274',
  fwLo: '#62466a',
  bulb: '#fff0a8',
  bulbGlow: '#ffd070',
  // washing lines in the yard
  sheet: '#f6f0f8',
  sheetLo: '#d4c8e0',
  sheetPink: '#f8cadc',
  sheetBlue: '#c6d6f6',
  post: '#7a6a8c',
  chalk: '#f2e8f2',
  // the miners' monument: dark bronze on a granite plinth
  bronzeDeep: '#2e2028',
  bronze: '#4a3236',
  bronzeMid: '#6a4640',
  bronzeLit: '#c4744c',
  bronzeHi: '#ffb878',
  coal: '#1c141c',
  coalHi: '#fff2c4',
  granite: '#76667e',
  graniteLo: '#5c4e68',
  graniteHi: '#9a8aa2',
  graniteLit: '#d0948a',
  pave: '#8e7e92',
  fwHaze: '#a46c88',
  fwHazeDark: '#8a587a',
  paveLo: '#76687e',
});

const HZ = 97; // the far ground: the heaps, the mine, the far city
const ROAD0 = 100; // the street through the gap
const ROAD1 = 108; // trolleybus wheels touch here
const KERB = 109; // near kerb, then the pavement with the stop
const HEDGE = 111; // a clipped hedge between the pavement and the yard
const LB = 117; // feet of both blocks; the drive runs along them
const YARD = 123; // the yard proper: lawns and the playground
const FH = 9; // one floor
const NINE_TOP = LB - 3 - 9 * FH;
const KH_TOP = LB - 2 - 5 * FH;
const WIRE = 86; // the two trolleybus wires hang at WIRE and WIRE + 2

type Bloom = { hi: RGB; mid: RGB; dark: RGB };
const BLOOMS: Bloom[] = [
  { hi: P.redHi, mid: P.red, dark: P.redDark },
  { hi: P.pinkHi, mid: P.pink, dark: P.pinkDark },
  { hi: P.yellowHi, mid: P.yellow, dark: P.yellowDark },
  { hi: P.creamHi, mid: P.cream, dark: P.creamDark },
  { hi: P.coralHi, mid: P.coral, dark: P.coralDark },
];

/** A rose seen from a little above: a cupped bloom with the curl of its heart. */
function rose(f: Frame, x: number, y: number, R: number, c: Bloom) {
  if (R < 1.8) {
    f.set(x, y, c.hi);
    f.set(x + 1, y, c.mid);
    f.set(x, y + 1, c.mid);
    f.set(x + 1, y + 1, c.dark);
    return;
  }
  f.disc(x, y, R, (dx, dy) => {
    const l = (dx * 0.8 + dy) / R;
    return l < -0.55 ? c.hi : l > 0.75 ? c.dark : c.mid;
  });
  const turns = R > 2.6 ? 1.6 : 1.1;
  for (let s = 0; s <= 1; s += 0.012) {
    const th = s * turns * Math.PI * 2 + 0.6;
    const r = 0.2 + s * (R - 1.1);
    const px = Math.round(x + Math.cos(th) * r);
    const py = Math.round(y + Math.sin(th) * r * 0.9);
    f.set(px, py, c.dark);
    const hx = Math.round(x + Math.cos(th) * (r + 0.9));
    const hy = Math.round(y + Math.sin(th) * (r + 0.9) * 0.9);
    if (Math.sin(th + 0.8) < -0.2 && f.get(hx, hy) !== c.dark)
      f.set(hx, hy, c.hi);
  }
  f.set(x - 1, Math.round(y + R), P.roseLeafLit);
  f.set(x + 1, Math.round(y + R), P.roseLeafDark);
}

/**
 * A spoil heap: a cone (or a flat-topped one), lit by the low sun from the
 * left, cut by erosion gullies, with grass and young birches climbing its foot.
 */
function terykon(
  f: Frame,
  cx: number,
  base: number,
  half: number,
  height: number,
  plateau: number,
  seed: number
) {
  const apexY = base - height;
  const halfAt = (y: number) =>
    half *
    (plateau +
      (1 - plateau) * Math.pow(Math.max(0, (y - apexY) / height), 1 / 1.18));
  const profile = (x: number) => {
    const u = Math.abs(x + 0.5 - cx) / half;
    if (u >= 1) return 0;
    const v = Math.max(0, (u - plateau) / (1 - plateau));
    return height * Math.pow(1 - v, 1.18) + (fbm1(x / 3, seed, 2) - 0.5) * 1.4;
  };
  const tone = (b: number) =>
    b > 0.45
      ? P.heapLit
      : b > 0.12
        ? P.heapMid
        : b > -0.3
          ? P.heapShade
          : P.heapDeep;
  const grassTone = (b: number) =>
    b > 0.45
      ? P.grassLit
      : b > 0.12
        ? P.grass
        : b > -0.3
          ? P.grassShade
          : P.grassDeep;
  const grassLine = (x: number) =>
    base - height * (0.2 + fbm1(x / 9, seed + 3, 3) * 0.3);
  for (let x = Math.floor(cx - half); x <= cx + half; x++) {
    const top = Math.round(base - profile(x));
    for (let y = top; y <= base; y++) {
      const nx = Math.max(
        -1,
        Math.min(1, (x + 0.5 - cx) / Math.max(1, halfAt(y)))
      );
      const b = -0.78 * nx + 0.62 * Math.sqrt(1 - nx * nx);
      let c = tone(b);
      if (y === top && b > 0.3) c = P.heapRim;
      const gl = grassLine(x);
      if (y > gl) {
        c = grassTone(b);
        if (y === Math.ceil(gl) && b > 0.3) c = P.grassRim;
      }
      f.set(x, y, c);
    }
  }
  // erosion gullies running down the fall lines
  const n = Math.round(half / 6);
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * 2 - 1 + (hash2(i, 1, seed) - 0.5) * 0.18;
    const y0 = Math.round(apexY + 2 + hash2(i, 2, seed) * height * 0.25);
    const y1 = Math.round(base - height * (0.15 + hash2(i, 3, seed) * 0.3));
    for (let y = y0; y < y1; y++) {
      const x = Math.round(cx + a * halfAt(y));
      if (y < Math.round(base - profile(x)) + 1) continue;
      const b = -0.78 * a + 0.62 * Math.sqrt(1 - a * a);
      f.set(x, y, b > 0.45 ? P.heapMid : b > 0.12 ? P.heapShade : P.heapDeep);
      if (b > 0.3) f.set(x - 1, y, P.heapLit);
    }
  }
  // bushes and birches at the foot
  for (
    let x = Math.floor(cx - half * 0.9);
    x < cx + half * 0.9;
    x += 3 + Math.floor(hash2(x, 5, seed) * 6)
  ) {
    if (hash2(x, 6, seed) < 0.35) continue;
    const y = Math.round(base - 1 - hash2(x, 7, seed) * height * 0.12);
    const r = 1.2 + hash2(x, 8, seed) * 1.4;
    const nx = (x - cx) / half;
    f.disc(x, y, r, (dx, dy) =>
      dx + dy < -1
        ? nx < 0.2
          ? P.grassRim
          : P.grassLit
        : dx + dy > 0.5
          ? P.grassDeep
          : P.grassShade
    );
  }
}

/** Panel blocks far off in the haze, a few windows already lit. */
function farCity(f: Frame, x0: number, x1: number, base: number, seed: number) {
  let x = x0;
  let i = 0;
  while (x < x1) {
    const r = (k: number) => hash2(i, k, seed);
    const kind = r(1);
    // always an odd width, so the grid of windows has the same margin each side
    const bw =
      (kind < 0.5
        ? 22 + Math.round(r(2) * 18)
        : kind < 0.85
          ? 14 + Math.round(r(2) * 10)
          : 8 + Math.round(r(2) * 3)) | 1;
    const bh = kind < 0.5 ? 8 : kind < 0.85 ? 13 : 18 + Math.round(r(3) * 4);
    const top = base - bh;
    const w2 = Math.min(bw, x1 - x);
    if (w2 < 5) break;
    f.rect(x, top, w2, base - top, P.cityFar);
    f.vline(x, top, base, P.cityFarLit);
    f.rect(x + w2 - 1, top, 1, base - top, P.cityFarDark);
    f.hline(x, x + w2 - 1, top, P.cityFarLit);
    for (let y = top + 2; y < base - 1; y += 2)
      for (let wx = x + 2; wx < x + w2 - 2; wx += 2) {
        const stair = (wx - x) % 12 === 6;
        const on = hash2(wx, y, seed + 3) < (stair ? 0.4 : 0.1);
        f.set(wx, y, on ? P.winWarm : stair ? P.cityFarLit : P.cityFarDark);
      }
    x += w2 + 3 + Math.round(r(4) * 8);
    i++;
  }
}

/** Long evening streaks of cloud, lit from underneath by the low sun. */
function streaks(f: Frame, seed: number) {
  const w = f.w;
  const n = Math.max(4, Math.round(w / 60));
  for (let i = 0; i < n; i++) {
    const r = (k: number) => hash2(i, k, seed);
    const y = Math.round(10 + r(1) * 46);
    const len = Math.round((30 + r(2) * 60) * (0.6 + (y - 10) / 70));
    const thick = 1.5 + r(3) * 2.2;
    const x0 = r(4) * w;
    for (let dx = 0; dx < len; dx++) {
      const u = (dx / len) * 2 - 1;
      const th =
        thick * Math.sqrt(1 - u * u) * (0.75 + 0.5 * fbm1(dx / 7, seed + i, 2));
      const top = Math.round(y - th);
      const bot = Math.round(y + th * 0.5);
      const x = Math.round(x0 + dx) % w;
      for (let yy = top; yy <= bot; yy++) {
        const c =
          yy === bot
            ? r(5) > 0.4
              ? P.cloudLight
              : P.cloudLit
            : yy === bot - 1
              ? P.cloudLit
              : yy === top && th > 1.5
                ? P.cloudShadow
                : P.cloudBase;
        f.set(x, yy, c);
      }
    }
  }
}

/** A Lombardy poplar: a tall narrow flame of leaves, rimmed on the sunny side. */
function poplar(
  f: Frame,
  x: number,
  base: number,
  ph: number,
  sunSide: number
) {
  for (let y = base - ph; y < base - 2; y++) {
    const v = (y - (base - ph)) / ph;
    const hw =
      3.2 * Math.min(1, v / 0.3) ** 0.7 * (1 - Math.max(0, v - 0.75) * 1.4);
    const r = Math.round(hw);
    for (let dx = -r; dx <= r; dx++) {
      const l = (dx * sunSide) / (hw + 0.5); // > 0 towards the sun
      const clump = (y + (dx < 0 ? 0 : 1)) % 3 === 0;
      let c =
        l > 0.35
          ? clump
            ? P.poplar
            : P.poplarLit
          : l < -0.35
            ? P.poplarDark
            : clump
              ? P.poplarDark
              : P.poplar;
      if (dx * sunSide === r && r > 0 && !clump) c = P.poplarRim;
      f.set(x + dx, y, c);
    }
  }
  f.vline(x, base - 3, base - 1, P.poplarDark);
}

type Win = {
  x: number;
  y: number;
  w: number;
  h: number;
  on: boolean;
  tv: boolean;
  paint: (f: Frame, on: boolean, t: number) => void;
};

export const donetsk: Scene = {
  id: 'donetsk',
  name: 'Donetsk',
  country: 'Ukraine',
  create(w, h) {
    const fx = new Fx();
    const cx = w / 2;
    // the gap between the two blocks, and what's framed in it
    const G = Math.round(Math.max(56, Math.min(128, w * 0.22)));
    const LX1 = Math.round(cx - G); // right edge of the nine-storey's front
    const EWL = 5; // its end wall, turned away from the sun
    const RX0 = Math.round(cx + G); // left edge of the Khrushchevka's front
    const EWR = 8; // its end wall, in the sun
    const gapL = LX1 + EWL;
    const gapR = RX0 - EWR;
    const sunX = Math.round(cx - G * 0.3);
    const sunY = 85;
    const hx = Math.round(cx - G * 0.6); // headframe
    const hTop = 56;
    // on wider screens the park's ferris wheel stands far off on the horizon,
    // between the heap and the Khrushchevka, so the heap moves over for it
    const hasWheel = w >= 360;
    const tSize = Math.max(46, Math.min(72, G * 0.62));
    const tx = Math.round(cx + G * (hasWheel ? 0.26 : 0.38)); // the big terykon
    const tHalf = Math.round(
      hasWheel ? Math.max(46, Math.min(66, G * 0.5)) : tSize
    );
    const tHeight = Math.round(tSize * 0.95);
    const apex = { x: tx, y: HZ - tHeight };

    /**
     * How much evening sun reaches the ground: a fan of light through the gap,
     * 0 in the blocks' shade, 0.5 at its soft edge, 1 lit, 2 the glare.
     */
    const fanAt = (x: number, y: number) => {
      const d = y - KERB;
      const xl = gapL - d * 0.72;
      const xr = gapR + d * 0.72;
      if (x < xl - 2 || x > xr + 2) return 0;
      if (x < xl || x > xr) return 0.5;
      if (y < YARD && Math.abs(x - sunX) < 3 + d * 0.8) return 2;
      return 1;
    };
    const lvl = (L: number) => (L >= 2 ? 3 : L >= 1 ? 2 : L > 0 ? 1 : 0);

    // where everything in the yard stands
    const stopX = Math.round(cx + G * 0.28); // the trolleybus's front door stops here
    const kioskX = gapR - 15;
    const sbX = Math.round(cx - G * 0.62); // sandbox
    const SB_Y = 134;
    const swingX = Math.round(cx - G * 0.12);
    const SWING_BASE = 139;
    const SWING_TOP = SWING_BASE - 19; // a bit over twice the kids' height
    // the miners' monument on its own patch of lawn, left of the bench
    const statueX = Math.max(9, gapL - 58);
    const STATUE_Y = 133;
    // on a narrow phone the bench moves along so it never sits on the plinth
    const benchX = Math.max(gapL - 28, statueX + 11);
    const BENCH_Y = 128;
    const lampX = benchX + 19;
    const LAMP_Y = 129;
    const chestX = benchX - 72; // a horse chestnut on the left lawn
    const CHEST_BASE = 135;
    const hasChestnut = chestX > -8;
    const kidA = Math.round(cx + G * 0.22);
    const kidB = Math.round(cx + G * 0.56);
    const KIDS_Y = 135;
    const treeX = RX0 + 14;
    const TREE_BASE = 131;
    const treeR = 11;
    const treeCY = TREE_BASE - 20;
    const tableX = treeX + 14;
    const TABLE_Y = 134;
    const hasTable = tableX + 9 < w;
    const lineX0 = RX0 + 70;
    const lineX1 = lineX0 + 36;
    const LINE_Y = 132;
    const hasLine = lineX1 + 4 < w;
    // a Zhiguli parked on the drive in front of the Khrushchevka
    const carX = RX0 + 36;
    const hasCar = carX + 17 < w;
    const fwR = Math.round(Math.max(7, Math.min(10, G * 0.08)));
    const fwX = gapR - 7 - fwR;
    const fwY = HZ - 7 - fwR;

    // ---------------- sky ----------------
    const sky = layer(w, h, (f) => {
      gradient(f, 0, HZ, [
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
      f.rect(0, HZ, w, h - HZ, P.sky8);
      glow(f, sunX, sunY, 90, P.sunGlow, 0.5, 0.55, 0.1);
      glow(f, sunX, sunY, 30, P.sunRim, 0.55, 0.8, 0.15);
      f.disc(sunX, sunY, 8, (dx, dy) =>
        dx * dx + dy * dy > 42 ? P.sunRim : P.sun
      );
    });
    const cloudLayer = layer(w, h, (f) => streaks(f, 92));

    // ---------------- the far side: city, heap, mine ----------------
    const legs = (y: number) => 2 + ((y - hTop) / (HZ - hTop)) * 3.2;
    const farBack = layer(w, h, (f) => {
      farCity(f, -6, w + 6, HZ, 5);
      // little heaps on the horizon: the Donbass is dotted with them
      for (const [x, s] of hasWheel
        ? ([[gapL + 10, 0.5]] as const)
        : ([
            [gapL + 10, 0.5],
            [gapR - 4, 0.36],
          ] as const)) {
        const hh = Math.round(6 + s * 10);
        for (let dx = -hh * 1.3; dx <= hh * 1.3; dx++) {
          const top = Math.round(HZ - 2 - hh + Math.abs(dx) / 1.3);
          f.vline(
            Math.round(x + dx),
            top,
            HZ,
            dx < 0 ? P.cityFarLit : P.cityFar
          );
        }
      }
    });
    const far = layer(w, h, (f) => {
      terykon(f, tx, HZ, tHalf, tHeight, 0.04, 3);
      // the incline the skips used to run up, from the mine side to the top
      {
        const x0 = tx - Math.round(tHalf * 0.62);
        const y0 = HZ - 3;
        const x1 = tx - 2;
        const y1 = apex.y + 4;
        f.line(x0 + 1, y0, x1 + 1, y1, P.heapRim);
        f.line(x0, y0, x1, y1, P.heapDeep);
        for (let k = 0.08; k < 0.95; k += 0.11) {
          const x = Math.round(x0 + (x1 - x0) * k);
          const y = Math.round(y0 + (y1 - y0) * k);
          f.set(x - 1, y, P.heapShade);
        }
        // the old skip parked near the top
        f.rect(x1 - 4, y1 + 2, 3, 2, P.steel);
        f.set(x1 - 4, y1 + 1, P.steel);
      }
      // the headframe: a lattice tower, its back-leg strut leaning to the left
      const foot = HZ + 1;
      for (let y = hTop; y < foot; y++) {
        const hw = legs(y);
        f.set(Math.round(hx - hw), y, P.steel);
        f.set(Math.round(hx + hw), y, P.steelLit);
      }
      for (let y = hTop + 3; y < foot - 2; y += 6) {
        const a = legs(y);
        const b = legs(y + 6);
        f.line(hx - a, y, hx + b, Math.min(foot - 1, y + 6), P.steel);
        f.line(hx + a, y, hx - b, Math.min(foot - 1, y + 6), P.steel);
        f.hline(Math.round(hx - a), Math.round(hx + a), y, P.steel);
      }
      const strutX = hx - Math.round((foot - hTop) * 0.62);
      for (const k of [0, 3])
        f.line(
          hx - 3 - k,
          hTop + 2 + k,
          strutX - k,
          foot,
          k ? P.steel : P.steelLit
        );
      for (let s = 0.22; s < 0.95; s += 0.19) {
        const y = hTop + 2 + s * (foot - hTop - 2);
        const sx = hx - 3 + s * (strutX - hx + 3);
        f.line(hx - legs(y), y, sx, y, P.steel);
        f.line(sx, y, hx - legs(y + 6), Math.min(foot, y + 6), P.steel);
      }
      // the head platform
      f.hline(hx - 12, hx + 5, hTop, P.steel);
      f.hline(hx - 12, hx + 5, hTop - 1, P.steel);
      f.hline(hx - 4, hx + 5, hTop - 1, P.steelLit);
      f.set(hx - 12, hTop - 2, P.steel);
      f.set(hx + 5, hTop - 2, P.steel);
      // the trestle the wheels turn on
      f.line(hx - 9, hTop - 2, hx - 6, hTop - 7, P.steel);
      f.line(hx - 3, hTop - 2, hx - 6, hTop - 7, P.steel);
      f.line(hx + 2, hTop - 2, hx - 1, hTop - 9, P.steel);
      // far trees hiding the foot of it all
      for (let x = -3; x < w + 3; x += 3) {
        const r = 1.6 + hash2(x, 1, 13) * 1.8;
        const y = HZ - 1 + Math.round(hash2(x, 2, 13) * 2);
        const toSun = Math.sign(sunX - x);
        f.disc(x, y, r, (dx, dy) =>
          dy < -r * 0.4 && dx * toSun >= 0
            ? P.farTreeLit
            : dx * toSun < -r * 0.3
              ? P.farTreeDark
              : P.farTree
        );
      }
    });

    // ---------------- the street through the gap ----------------
    const poles: number[] = [];
    for (let x = Math.round(gapL + 18 - 64 * 4); x < w + 64; x += 64)
      poles.push(x);
    const street = layer(w, h, (f) => {
      // far pavement, a row of poplars on it
      f.rect(0, HZ + 1, w, ROAD0 - HZ - 1, P.walk);
      for (const [x, ph] of [
        [gapL + 2, 36],
        [gapL + 8, 29],
        [gapR - 3, 38],
        ...(hasWheel ? [] : ([[gapR - 10, 30]] as const)),
      ] as const)
        poplar(f, x, ROAD0, ph, Math.sign(sunX - x) || 1);
      // the road, glaring where it runs towards the sun
      for (let y = ROAD0; y <= ROAD1; y++) {
        const spread = 10 + (y - ROAD0) * 3;
        for (let x = 0; x < w; x++) {
          const d = Math.abs(x - sunX) / spread;
          f.set(x, y, d < 0.5 ? P.roadGlare : d < 1.2 ? P.roadLit : P.road);
        }
      }
      for (let x = 0; x < w; x += 9) f.hline(x, x + 3, 104, P.roadLine);
      // near kerb and pavement
      f.hline(0, w, KERB, P.kerb);
      f.rect(0, KERB + 1, w, HEDGE + 3 - KERB, P.walk);
      for (let x = 0; x < w; x++)
        if (Math.abs(x - sunX) < 26) {
          f.set(x, KERB, P.sunWallHi);
          f.set(x, KERB + 1, P.walkLit);
        }
      // the trolleybus line: poles on the far side, two wires over the road
      for (const x of poles) {
        f.vline(x, WIRE - 5, ROAD0 - 1, P.pole);
        f.hline(x - 1, x + 3, WIRE - 3, P.pole);
        f.vline(x + 2, WIRE - 2, WIRE, P.pole);
      }
      for (let x = 0; x < w; x++) {
        f.set(x, WIRE, P.wire);
        f.set(x, WIRE + 2, P.wire);
      }
    });

    // ---------------- the ground of the yard ----------------
    const ASPHALT = [P.asphalt, P.road, P.sunGroundLo, P.sunGroundHi];
    const playground = (x: number, y: number) =>
      y >= YARD &&
      Math.abs(x - cx + G * 0.05) <
        Math.min(G * 0.88, 92) +
          (y - YARD) * 1.2 +
          (fbm1(x / 9 + y / 5, 23, 2) - 0.5) * 9;
    /** Lit ground fades a step at a time as it comes towards us. */
    const depthStep = (y: number) => (y < YARD + 4 ? 0 : y < YARD + 12 ? 1 : 2);
    const ground = layer(w, h, (f) => {
      for (let y = HEDGE + 1; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const L = lvl(fanAt(x, y));
          const ds = depthStep(y);
          const earth = [
            P.earth,
            P.sunGroundLo,
            [P.earthLit, P.earthLit2, P.earthLit3][ds]!,
            P.sunGroundHi,
          ];
          const lawn = [
            P.lawn,
            P.lawnPen,
            [P.lawnLit, P.lawnLit2, P.lawnLit3][ds]!,
            P.lawnLitHi,
          ];
          let c: RGB;
          if (y < LB) {
            // the strip of lawn behind the hedge lies in the hedge's shadow,
            // but for where the sun gets through the gaps at the stop and kiosk
            const open = (x > stopX - 5 && x < stopX + 15) || x > kioskX - 3;
            c = open || y > LB - 2 ? lawn[L]! : L ? P.lawnPen : P.lawn;
          } else if (y < LB + 2)
            c = L ? earth[L]! : P.earthLo; // front-garden beds
          else if (y < YARD - 1) c = ASPHALT[L]!;
          else if (y === YARD - 1) c = L ? P.sunGroundHi : P.kerb;
          else c = playground(x, y) ? earth[L]! : lawn[L]!;
          f.set(x, y, c);
        }
      }
      // the earth is trodden bare under the swing and where the kids play
      for (let dx = -8; dx <= 9; dx++) {
        const x = swingX + dx;
        const k = Math.abs(dx) < 5 ? 2 : 1;
        for (let dy = -k; dy <= k - 1; dy++)
          f.set(
            x,
            SWING_BASE + 2 + dy,
            fanAt(x, SWING_BASE) ? P.earthLit3 : P.earthLo
          );
      }
      // stone paving round the monument's plinth
      for (let dy = -3; dy <= 3; dy++)
        for (let dx = -11; dx <= 11; dx++) {
          if ((dx / 11.5) ** 2 + (dy / 3.4) ** 2 > 1) continue;
          const x = statueX + dx;
          const y = STATUE_Y + dy;
          f.set(x, y, (dx + 40) % 4 === 0 || dy === 1 ? P.paveLo : P.pave);
        }
      // long shadows of the things standing in the light
      castShadow(f, sbX + 4, SB_Y - 1, 10, 2);
      castShadow(f, sbX - 2, SB_Y, 3, 10, 0.4);
      castShadow(f, swingX - 10, SWING_BASE, 13, 1);
      castShadow(f, swingX + 12, SWING_BASE, 13, 1);
      // pebbles and the odd bottle cap, in pairs
      for (let i = 0; i < Math.round(w / 9); i++) {
        const x = Math.round(hash2(i, 1, 37) * w);
        const y = YARD + 2 + Math.round(hash2(i, 2, 37) * (h - YARD - 6));
        if (!playground(x, y)) continue;
        const L = fanAt(x, y);
        f.set(x, y, L ? P.earthLit3 : P.earthLo);
        if (hash2(i, 3, 37) < 0.5)
          f.set(x + 1, y, L ? P.sunGroundHi : P.pebble);
      }
      // tufts in the lawns: little clean v's, darker in the shade
      for (let y = YARD + 2; y < h; y += 3) {
        for (let x = (y * 7) % 6; x < w; x += 6) {
          const jx = x + Math.round(hash2(x, y, 34) * 4);
          if (playground(jx, y) || hash2(x, y, 35) < 0.5) continue;
          const L = lvl(fanAt(jx, y));
          const c =
            L >= 2
              ? P.lawnLitHi
              : L
                ? P.lawnLit
                : hash2(x, y, 36) < 0.6
                  ? P.lawnLo
                  : P.lawnPen;
          f.set(jx - 1, y - 1, c);
          f.set(jx, y, c);
          f.set(jx + 1, y - 1, c);
        }
      }
      // a few cracks in the drive, and hopscotch chalked on it
      for (let i = 0; i < Math.round(w / 50); i++) {
        const x0 = Math.round(hash2(i, 1, 33) * w);
        const y0 = LB + 3 + Math.round(hash2(i, 2, 33) * 2);
        for (let k = 0; k < 5; k++)
          f.set(
            x0 + k,
            y0 + (k > 2 ? 1 : 0),
            fanAt(x0 + k, y0) ? P.sunGroundLo : P.crack
          );
      }
      // the hedge between the pavement and the yard, gaps for the stop and kiosk
      for (let x = gapL - 4; x < gapR + 4; x++) {
        if ((x > stopX - 6 && x < stopX + 16) || x > kioskX - 3) continue;
        const top = HEDGE - 1 + Math.round(fbm1(x / 4, 61, 2) * 2 - 0.6);
        for (let y = top; y <= HEDGE + 2; y++) {
          const c =
            y === top
              ? P.leafRim
              : y === top + 1
                ? P.leafLit
                : (x + y) % 4 === 0
                  ? P.leafDeep
                  : P.leafDark;
          f.set(x, y, c);
        }
      }
    });

    // ---------------- the nine-storey ----------------
    const windows: Win[] = [];
    type Bay = { x: number; kind: 'W' | 'B' | 'S' };
    const nine: Bay[] = [];
    const SECTION = ['W', 'B', 'S', 'B', 'W'] as const;
    for (let x = LX1 - 2 - 9, i = 0; x > -10; x -= 9, i++)
      nine.push({ x, kind: SECTION[i % SECTION.length]! });
    const entrances = nine.filter((b) => b.kind === 'S').map((b) => b.x);
    const nineFloor = (k: number) => LB - 3 - (k + 1) * FH;

    function glassPane(
      f: Frame,
      x: number,
      y: number,
      ww: number,
      wh: number,
      on: boolean,
      tv: boolean,
      curtain: number,
      t: number
    ) {
      if (!on) {
        f.rect(x, y, ww, wh, P.glass);
        f.hline(x, x + ww - 1, y, P.glassHi);
        return;
      }
      const flick = tv && hash2(Math.floor(t / 260), x, y) > 0.6;
      f.rect(x, y, ww, wh, tv ? (flick ? P.tvHi : P.tv) : P.lit);
      if (!tv) {
        f.hline(x, x + ww - 1, y + wh - 1, P.litLo);
        f.set(x, y, P.litHi);
        if (curtain === 1) f.vline(x + ww - 1, y, y + wh - 1, P.curtain);
        if (curtain === 2) f.vline(x, y, y + wh - 1, P.curtain2);
      }
    }

    const PARAPETS: [RGB, RGB][] = [
      [P.parConc, P.parConcLo],
      [P.parConc, P.parConcLo],
      [P.parGreen, P.parGreenLo],
      [P.parBlue, P.parBlueLo],
      [P.parWood, P.parWoodLo],
    ];
    const CLOTHES = [
      P.cloth1,
      P.cloth1,
      P.cloth2,
      P.cloth3,
      P.cloth4,
      P.cloth5,
      P.cloth6,
    ];

    /** A loggia: open with washing and flowers, or glazed in by its owners. */
    function loggia(
      f: Frame,
      x0: number,
      y0: number,
      seed: number,
      on: boolean,
      t: number
    ) {
      const r = (k: number) => hash2(seed, k, 57);
      const glazed = r(1) < 0.45;
      const [par, parLo] = PARAPETS[Math.floor(r(2) * PARAPETS.length)]!;
      if (glazed) {
        // everyone glazed their own: white or brown frames, some lit behind
        const fr = r(3) < 0.6 ? P.frame : P.parWoodLo;
        f.rect(x0, y0 + 1, 9, 4, on ? P.lit : P.glazed);
        if (!on) f.hline(x0, x0 + 8, y0 + 1, P.glazedHi);
        else f.set(x0 + 1, y0 + 2, P.litHi);
        for (const dx of [0, 3, 6, 8]) f.vline(x0 + dx, y0 + 1, y0 + 4, fr);
        f.hline(x0, x0 + 8, y0 + 1, fr);
        if (on && r(9) < 0.5) f.vline(x0 + 4, y0 + 2, y0 + 4, P.curtain);
      } else {
        f.rect(x0 + 1, y0 + 1, 7, 4, P.recess);
        glassPane(f, x0 + 2, y0 + 1, 2, 4, on, false, 0, t);
        glassPane(f, x0 + 5, y0 + 2, 2, 2, on && r(4) < 0.7, false, 0, t);
      }
      // parapet with a lighter top edge
      f.rect(x0, y0 + 5, 9, 4, par);
      f.hline(x0, x0 + 8, y0 + 5, P.panelHi);
      f.hline(x0, x0 + 8, y0 + 8, parLo);
      if (!glazed) {
        if (r(5) < 0.5) {
          // a washing line across the top
          for (let dx = 1; dx < 8; dx++) {
            if (r(10 + dx) < 0.45) continue;
            const c = CLOTHES[Math.floor(r(20 + dx) * CLOTHES.length)]!;
            f.vline(x0 + dx, y0 + 1, y0 + 2 + (r(30 + dx) < 0.4 ? 1 : 0), c);
          }
        }
        if (r(6) < 0.6) {
          // pots and geraniums along the parapet
          for (let dx = 0; dx < 9; dx += 2) {
            if (r(40 + dx) < 0.3) continue;
            f.set(x0 + dx, y0 + 4, r(50 + dx) < 0.4 ? P.geranium : P.plant);
            if (r(60 + dx) < 0.5) f.set(x0 + dx, y0 + 5, P.plantHi);
          }
        }
      }
      if (r(7) < 0.22) {
        // a satellite dish hung off the front, looking south
        f.disc(x0 + 7, y0 + 4, 1.2, (dx, dy) =>
          dx + dy < 0 ? P.dish : P.dishLo
        );
        f.set(x0 + 6, y0 + 5, P.dishLo);
      }
    }

    function nineWindow(
      f: Frame,
      x0: number,
      y0: number,
      on: boolean,
      tv: boolean,
      curtain: number,
      t: number
    ) {
      glassPane(f, x0 + 2, y0 + 3, 5, 4, on, tv, curtain, t);
      f.vline(x0 + 4, y0 + 3, y0 + 6, P.frameLo);
    }

    const nineLayer = layer(w, h, (f) => {
      f.rect(-2, NINE_TOP, LX1 + 2, LB - NINE_TOP, P.panel);
      // roof parapet, the plinth
      f.rect(-2, NINE_TOP - 3, LX1 + 2, 3, P.panelLo);
      f.hline(-2, LX1 - 1, NINE_TOP - 3, P.roofTop);
      f.rect(-2, LB - 3, LX1 + 2, 3, P.panelLo);
      for (let k = 0; k < 3; k++)
        f.rect(-2, nineFloor(k), LX1 + 2, FH, P.panelLo);
      for (let k = 7; k < 9; k++)
        f.rect(-2, nineFloor(k), LX1 + 2, FH, P.panelTop);
      for (let k = 0; k < 9; k++) f.hline(-2, LX1 - 1, nineFloor(k), P.seam);
      for (const b of nine) f.vline(b.x, NINE_TOP, LB - 4, P.seam);
      // lift rooms on the roof above each stair, TV aerials
      for (const x of entrances) {
        f.rect(x - 1, NINE_TOP - 9, 11, 6, P.panelLo);
        f.hline(x - 1, x + 9, NINE_TOP - 9, P.roofTop);
        f.rect(x + 7, NINE_TOP - 7, 2, 4, P.endWall);
      }
      for (let x = 6; x < LX1 - 4; x += 17 + Math.round(hash2(x, 0, 71) * 14)) {
        const ht = 6 + Math.round(hash2(x, 1, 71) * 4);
        f.vline(x, NINE_TOP - 3 - ht, NINE_TOP - 4, P.antenna);
        f.hline(x - 2, x + 2, NINE_TOP - 2 - ht, P.antenna);
        f.hline(x - 1, x + 1, NINE_TOP - ht, P.antenna);
      }
      // the end wall, seen edge-on and turned from the sun
      for (let i = 0; i < EWL; i++) {
        const x = LX1 + i;
        const top = Math.round(NINE_TOP - 3 + (i * (HZ - NINE_TOP + 3)) / G);
        const bot = Math.round(LB - (i * (LB - HZ)) / G);
        f.vline(x, top, bot, i === 0 ? P.panelLo : P.endWall);
        for (let k = 0; k <= 9; k++) {
          const y0 = k === 9 ? NINE_TOP : nineFloor(k);
          f.set(x, Math.round(y0 + (i * (HZ - y0)) / G), P.endSeam);
        }
      }
    });

    // windows and balconies: baked once, repainted when switched
    for (const b of nine) {
      for (let k = 0; k < 9; k++) {
        const y0 = nineFloor(k);
        const seed = Math.round(b.x * 31 + k * 7);
        const on = hash2(seed, 1, 5) < 0.4;
        if (b.kind === 'S') {
          // the door is on the ground floor, and its lit fanlight and canopy
          // fill the first landing
          if (k < 2) continue;
          const lit = hash2(seed, 2, 5) < 0.55;
          windows.push({
            x: b.x + 3,
            y: y0 + 5,
            w: 3,
            h: 4,
            on: lit,
            tv: false,
            paint: (f, o) => {
              f.rect(b.x + 3, y0 + 5, 3, 4, o ? P.stair : P.glass);
              f.set(b.x + 3, y0 + 5, o ? P.litHi : P.glassHi);
            },
          });
        } else if (b.kind === 'B' && k > 0) {
          windows.push({
            x: b.x,
            y: y0 + 1,
            w: 9,
            h: 8,
            on,
            tv: false,
            paint: (f, o, t) => loggia(f, b.x, y0, seed, o, t),
          });
        } else {
          const tv = on && hash2(seed, 3, 5) < 0.18;
          const curtain = Math.floor(hash2(seed, 4, 5) * 3);
          windows.push({
            x: b.x + 2,
            y: y0 + 3,
            w: 5,
            h: 4,
            on,
            tv,
            paint: (f, o, t) => nineWindow(f, b.x, y0, o, tv, curtain, t),
          });
        }
      }
    }

    // ---------------- the Khrushchevka ----------------
    const KSECTION = ['W', 'B', 'W', 'S', 'W', 'B'] as const;
    const kh: Bay[] = [];
    for (let x = RX0 + 2, i = 0; x < w + 2; x += 9, i++)
      kh.push({ x, kind: KSECTION[i % KSECTION.length]! });
    const khFloor = (k: number) => LB - 2 - (k + 1) * FH;

    function khWindow(
      f: Frame,
      x0: number,
      y0: number,
      on: boolean,
      tv: boolean,
      curtain: number,
      t: number
    ) {
      f.rect(x0 + 1, y0 + 2, 7, 6, P.frame);
      glassPane(f, x0 + 2, y0 + 3, 5, 4, on, tv, curtain, t);
      f.vline(x0 + 4, y0 + 3, y0 + 6, P.frame);
      f.set(x0 + 5, y0 + 4, P.frame);
      f.set(x0 + 6, y0 + 4, P.frame);
      f.hline(x0 + 1, x0 + 7, y0 + 8, P.brickHi);
    }
    function khBalcony(
      f: Frame,
      x0: number,
      y0: number,
      seed: number,
      on: boolean,
      t: number
    ) {
      const r = (k: number) => hash2(seed, k, 59);
      f.rect(x0 + 1, y0 + 1, 7, 7, P.brickLo);
      glassPane(f, x0 + 2, y0 + 2, 2, 5, on, false, 0, t);
      glassPane(f, x0 + 5, y0 + 2, 2, 3, on && r(1) < 0.6, false, 0, t);
      // the slab and a painted sheet-metal railing
      const [par, parLo] = PARAPETS[2 + Math.floor(r(2) * 3)]!;
      f.rect(x0 - 1, y0 + 5, 11, 3, par);
      f.hline(x0 - 1, x0 + 9, y0 + 5, P.frame);
      f.hline(x0 - 1, x0 + 9, y0 + 8, P.panelHi);
      f.set(x0 + 9, y0 + 6, parLo);
      f.set(x0 + 9, y0 + 7, parLo);
      if (r(3) < 0.55) {
        for (let dx = 0; dx < 9; dx++) {
          if (r(10 + dx) < 0.45) continue;
          f.vline(
            x0 + dx,
            y0 + 1,
            y0 + 2 + (r(20 + dx) < 0.4 ? 1 : 0),
            CLOTHES[Math.floor(r(30 + dx) * CLOTHES.length)]!
          );
        }
        f.hline(x0 - 1, x0 + 9, y0 + 1, P.rod);
      }
    }

    const khLayer = layer(w, h, (f) => {
      f.rect(RX0, KH_TOP, w - RX0 + 2, LB - KH_TOP, P.brick);
      f.rect(RX0, KH_TOP - 2, w - RX0 + 2, 2, P.brickLo);
      f.hline(RX0, w, KH_TOP - 2, P.brickHi);
      f.rect(RX0, LB - 2, w - RX0 + 2, 2, P.brickLo);
      f.rect(RX0, khFloor(0), w - RX0 + 2, FH, P.brickDim);
      f.rect(RX0, khFloor(4), w - RX0 + 2, FH, P.brickTop);
      for (let k = 0; k < 5; k++) f.hline(RX0, w, khFloor(k), P.brickLo);
      // aerials on the roof
      for (let x = RX0 + 8; x < w; x += 23 + Math.round(hash2(x, 0, 73) * 16)) {
        const ht = 7 + Math.round(hash2(x, 1, 73) * 5);
        f.vline(x, KH_TOP - 2 - ht, KH_TOP - 3, P.antenna);
        for (let k = 0; k < 3; k++)
          f.hline(x - 2 + k, x + 2 - k, KH_TOP - 1 - ht + k * 2, P.antenna);
      }
      // the end wall in the sun
      for (let i = 0; i < EWR; i++) {
        const x = RX0 - 1 - i;
        const top = Math.round(KH_TOP - 2 + (i * (HZ - KH_TOP + 2)) / G);
        const bot = Math.round(LB - (i * (LB - HZ)) / G);
        f.vline(x, top, bot, i === 0 ? P.sunWallHi : P.sunWall);
        f.set(x, top, P.sunWallHi);
        for (let k = 0; k < 5; k++) {
          const y0 = khFloor(k);
          f.set(x, Math.round(y0 + (i * (HZ - y0)) / G), P.sunWallLo);
        }
        f.set(x, bot, P.sunWallLo);
        f.set(x, bot - 1, P.sunWallLo);
      }
    });
    for (const b of kh) {
      for (let k = 0; k < 5; k++) {
        const y0 = khFloor(k);
        const seed = Math.round(b.x * 37 + k * 11);
        const on = hash2(seed, 1, 6) < 0.38;
        if (b.kind === 'S') {
          if (k === 0) continue;
          const lit = hash2(seed, 2, 6) < 0.5;
          windows.push({
            x: b.x + 3,
            y: y0 + 5,
            w: 3,
            h: 4,
            on: lit,
            tv: false,
            paint: (f, o) => {
              f.rect(b.x + 3, y0 + 5, 3, 4, o ? P.stair : P.glass);
              f.set(b.x + 3, y0 + 5, o ? P.litHi : P.glassHi);
            },
          });
        } else if (b.kind === 'B' && k > 0) {
          windows.push({
            x: b.x,
            y: y0 + 1,
            w: 9,
            h: 7,
            on,
            tv: false,
            paint: (f, o, t) => khBalcony(f, b.x, y0, seed, o, t),
          });
        } else {
          const tv = on && hash2(seed, 3, 6) < 0.2;
          const curtain = Math.floor(hash2(seed, 4, 6) * 3);
          windows.push({
            x: b.x + 1,
            y: y0 + 2,
            w: 7,
            h: 6,
            on,
            tv,
            paint: (f, o, t) => khWindow(f, b.x, y0, o, tv, curtain, t),
          });
        }
      }
    }
    const buildings = layer(w, h, (f) => {
      f.over(nineLayer);
      f.over(khLayer);
      for (const win of windows) win.paint(f, win.on, 0);
      // entrances: a door under a concrete canopy
      for (const x of entrances) {
        const y = LB - 3;
        f.rect(x + 2, y - 8, 5, 8, P.door);
        f.vline(x + 2, y - 8, y - 1, P.doorHi);
        f.set(x + 5, y - 4, P.doorHi);
        f.rect(x + 3, y - 12, 3, 2, P.stair);
        f.rect(x - 1, y - 10, 11, 2, P.panelLo);
        f.hline(x - 1, x + 9, y - 10, P.panelHi);
        f.rect(x + 1, y, 7, 3, P.panelHi);
      }
      for (const b of kh) {
        if (b.kind !== 'S') continue;
        const y = LB - 2;
        f.rect(b.x + 2, y - 7, 5, 7, P.door);
        f.vline(b.x + 2, y - 7, y - 1, P.doorHi);
        f.rect(b.x, y - 9, 9, 2, P.brickLo);
        f.hline(b.x, b.x + 8, y - 9, P.brickHi);
      }
    });
    const tvWins = windows.flatMap((win, i) => (win.tv ? [i] : []));
    // a few rooms where someone comes in and switches the light on, and later
    // goes out again: one window at a time, the evening going on
    const evening = windows.flatMap((win, i) =>
      !win.on && !win.tv && hash2(i, 1, 131) < 0.12
        ? [{ i, phase: hash2(i, 2, 131) * 47_000 }]
        : []
    );
    const eveningOn = (e: { phase: number }, t: number) =>
      (t + e.phase) % 47_000 < 26_000;

    /** Long evening shadow thrown towards us, away from the sun. */
    function castShadow(
      f: Frame,
      x: number,
      base: number,
      len: number,
      wd: number,
      a = 0.55
    ) {
      const lean = Math.max(
        -1.2,
        Math.min(1.2, ((x - sunX) / Math.max(8, base - HZ)) * 0.5)
      );
      for (let k = 1; k <= len; k++) {
        const sx = Math.round(x + lean * k);
        for (let j = 0; j < wd; j++) {
          if (!fanAt(sx + j, base + k)) continue;
          f.blend(sx + j, base + k, P.shadow, a);
        }
      }
    }

    // ---------------- the yard: gardens, car, sandbox, swing, tree ----------------
    // each apricot remembers the leaves it hides, so it can leave the tree
    const apricots: { x: number; y: number; under: (RGB | null)[] }[] = [];
    const yardBack = layer(w, h, (f) => {
      // front gardens under the ground-floor windows: a little fence, mallows
      // taller than the kids, roses and bushes
      const nearDoor = (x: number, pad: number) =>
        entrances.some((e) => x > e - 2 - pad && x < e + 11 + pad);
      for (let x = -2; x < LX1; x++) {
        if (nearDoor(x, 0)) continue;
        if (x % 3 === 0) f.vline(x, LB, LB + 2, P.frameLo);
        f.set(x, LB + 1, P.frameLo);
      }
      for (let x = 1; x < LX1 - 3; x += 3 + Math.floor(hash2(x, 1, 81) * 4)) {
        if (nearDoor(x, 2) || Math.abs(x - statueX) < 10) continue;
        const kind = hash2(x, 2, 81);
        if (kind < 0.4) {
          // a mallow: a tall stalk hung with flowers, buds at the top
          const ht = 9 + Math.round(hash2(x, 3, 81) * 3);
          const top = LB + 1 - ht;
          f.vline(x, top, LB + 1, P.stem);
          const white = hash2(x, 4, 81) > 0.6;
          const col = white ? P.mallowWhite : P.mallow;
          const hi = white ? P.creamHi : P.mallowHi;
          for (let y = top + 2; y < LB - 2; y += 2) {
            const s = (y + x) % 2 ? -1 : 1;
            f.set(x + s, y, hi);
            f.set(x + s * 2, y, col);
            f.set(x + s, y + 1, col);
            f.set(x + s * 2, y + 1, white ? P.creamDark : P.pinkDark);
            f.set(x - s, y + 1, col);
          }
          f.set(x - 1, top + 1, P.leafMid);
          f.set(x + 1, top + 2, P.leafMid);
          f.set(x - 1, LB - 1, P.leafMid);
          f.set(x + 1, LB - 2, P.leaf);
          f.set(x + 2, LB - 1, P.leaf);
        } else {
          const r = 1.8 + hash2(x, 5, 81) * 1.5;
          f.disc(x, LB, r, (dx, dy) =>
            dx + dy < -1 ? P.leafMid : dx + dy > 1 ? P.leafDeep : P.leaf
          );
          if (kind > 0.6)
            for (let k = 0; k < 3; k++)
              f.set(
                x - 1 + Math.round(hash2(x, 10 + k, 81) * 2),
                LB - 2 + Math.round(hash2(x, 20 + k, 81) * 2),
                kind > 0.8 ? P.red : P.pink
              );
        }
      }
      // a Zhiguli parked on the drive
      if (hasCar) {
        const y = YARD - 2;
        sprite(
          f,
          [
            '.....RRRRR......',
            '....RggRggR.....',
            '..rrrrrrrrrrrr..',
            'cRRRRRRRRRRRRRRc',
            'lrrrrrrrrrrrrrrt',
            '..kk........kk..',
          ],
          carX,
          y - 5,
          {
            R: P.car,
            r: P.carLo,
            g: P.glass,
            c: P.chrome,
            k: P.tyre,
            l: P.headlight,
            t: P.tail,
          }
        );
        f.hline(carX + 5, carX + 9, y - 5, P.carHi);
        f.set(carX + 8, y - 4, P.glassHi);
      }
    });
    const yard = layer(w, h, (f) => {
      // the bench where the babushkas keep an eye on everyone
      f.rect(benchX, BENCH_Y - 4, 12, 1, P.bench);
      f.rect(benchX, BENCH_Y - 2, 12, 1, P.bench);
      f.hline(benchX, benchX + 11, BENCH_Y - 3, P.benchLo);
      // forged ends with a curl, Donetsk-style
      for (const [ex, d] of [
        [benchX - 1, -1],
        [benchX + 12, 1],
      ] as const) {
        f.vline(ex, BENCH_Y - 4, BENCH_Y, P.steel);
        f.set(ex + d, BENCH_Y - 5, P.steel);
        f.set(ex + d, BENCH_Y - 3, P.steel);
        f.set(ex + d, BENCH_Y, P.steel);
      }
      // a forged lamppost: a pole, a scroll, a lantern on a crook
      f.vline(lampX, LAMP_Y - 16, LAMP_Y, P.steel);
      f.hline(lampX - 1, lampX + 1, LAMP_Y, P.steel);
      for (const [dx, dy] of [
        [-1, -6],
        [-2, -7],
        [-1, -8],
        [1, -9],
        [2, -10],
        [1, -11],
        [1, -16],
        [2, -17],
        [3, -17],
        [4, -16],
      ] as const)
        f.set(lampX + dx, LAMP_Y + dy, P.steel);
      f.hline(lampX + 3, lampX + 5, LAMP_Y - 15, P.steel);
      f.rect(lampX + 3, LAMP_Y - 14, 3, 2, P.litHi);
      f.set(lampX + 4, LAMP_Y - 12, P.steel);
      if (hasChestnut) {
        // a horse chestnut, its big crown in the blocks' shade, lit only by the sky
        const cy = CHEST_BASE - 29;
        f.rect(chestX - 1, CHEST_BASE - 14, 4, 14, P.trunk);
        f.vline(chestX + 2, CHEST_BASE - 14, CHEST_BASE - 1, P.leafDeep);
        f.line(chestX, CHEST_BASE - 12, chestX - 8, CHEST_BASE - 21, P.trunk);
        f.line(
          chestX + 2,
          CHEST_BASE - 13,
          chestX + 9,
          CHEST_BASE - 22,
          P.trunk
        );
        const blobs: [number, number, number][] = [];
        for (let i = 0; i < 34; i++) {
          const a = hash2(i, 1, 95) * Math.PI * 2;
          const d = Math.sqrt(hash2(i, 2, 95)) * 15;
          blobs.push([
            chestX + Math.cos(a) * d * 1.2,
            cy + Math.sin(a) * d * 0.8,
            3 + hash2(i, 3, 95) * 2.6,
          ]);
        }
        blobs.sort((a, b) => a[1] - b[1]);
        for (const [bx, by, r] of blobs)
          f.disc(bx, by, r, (dx, dy) => {
            const l = (dx * 0.5 + dy * 1.2) / r;
            if (l < -0.8) return P.leafMid;
            if (l < -0.3) return P.leaf;
            if (l > 0.5) return P.leafDeep;
            return P.leafDark;
          });
      }
      // the miners' monument: a miner in his helmet holding up a lump of coal,
      // on a granite plinth, the low sun catching his raised arm
      {
        const sx = statueX;
        const by = STATUE_Y;
        // plinth: a base step, the shaft, a cornice
        f.rect(sx - 7, by - 2, 15, 2, P.graniteLo);
        f.hline(sx - 7, sx + 7, by - 2, P.granite);
        f.rect(sx - 5, by - 12, 11, 10, P.granite);
        f.vline(sx - 5, by - 12, by - 3, P.graniteHi);
        f.vline(sx + 4, by - 12, by - 3, P.graniteLo);
        f.vline(sx + 5, by - 12, by - 3, P.graniteLit);
        f.hline(sx - 4, sx + 3, by - 7, P.graniteLo);
        f.rect(sx - 6, by - 14, 13, 2, P.granite);
        f.hline(sx - 6, sx + 6, by - 14, P.graniteHi);
        f.set(sx + 6, by - 14, P.graniteLit);
        f.set(sx + 6, by - 13, P.graniteLit);
        // the miner, feet on the cornice
        const py = by - 15;
        const fig: [number, number, number, number, RGB][] = [
          // [x0, x1, y0, y1, colour] relative to (sx, py)
          [-2, 2, -5, 0, P.bronze], // legs, together in heavy trousers
          [0, 0, -3, 0, P.bronzeDeep],
          [-3, 3, 0, 0, P.bronzeDeep], // boots
          [-3, 2, -11, -6, P.bronze], // jacket
          [-3, 2, -6, -6, P.bronzeDeep], // belt
          [-3, 3, -12, -12, P.bronze], // shoulders
          [-4, -4, -12, -6, P.bronzeDeep], // the hanging arm
          [-5, -4, -6, -5, P.bronzeMid], // his lamp
          [-1, 1, -14, -13, P.bronzeMid], // face, neck
          [-2, 2, -15, -15, P.bronze], // helmet brim
          [-1, 1, -17, -16, P.bronze], // helmet
        ];
        for (const [x0, x1, y0, y1, c] of fig)
          f.rect(sx + x0, py + y0, x1 - x0 + 1, y1 - y0 + 1, c);
        // the raised arm, out towards the gap and up, the coal on his palm
        f.line(sx + 3, py - 12, sx + 6, py - 17, P.bronze);
        f.line(sx + 2, py - 11, sx + 5, py - 17, P.bronze);
        f.rect(sx + 5, py - 20, 3, 2, P.coal);
        f.set(sx + 6, py - 21, P.coal);
        f.set(sx + 5, py - 18, P.bronzeMid);
        f.set(sx + 7, py - 18, P.bronzeMid);
        // the sun's side: a warm rim down his right
        for (const [x, y] of [
          [1, -17],
          [2, -16],
          [2, -15],
          [2, -14],
          [3, -12],
          [2, -10],
          [2, -9],
          [2, -8],
          [2, -7],
          [2, -5],
          [2, -4],
          [2, -3],
          [3, 0],
          [4, -13],
          [5, -15],
          [6, -16],
          [7, -17],
          [8, -19],
          [8, -20],
        ] as const)
          f.set(sx + x, py + y, P.bronzeLit);
        f.set(sx + 1, py - 16, P.bronzeHi);
        f.set(sx + 7, py - 18, P.bronzeHi);
        f.set(sx, py - 15, P.bronzeHi); // the lamp on his helmet
        f.set(sx - 1, py - 11, P.bronzeMid);
        f.set(sx - 2, py - 9, P.bronzeMid);
      }
      // the sandbox with its toadstool shade
      f.rect(sbX - 6, SB_Y - 2, 13, 2, P.boardLo);
      f.hline(sbX - 6, sbX + 6, SB_Y - 3, P.board);
      f.hline(
        sbX - 5,
        sbX + 5,
        SB_Y - 2,
        fanAt(sbX, SB_Y) ? P.sandLit : P.sand
      );
      f.vline(sbX + 4, SB_Y - 11, SB_Y - 3, P.stalk);
      f.disc(sbX + 4, SB_Y - 11, 4, (dx, dy) =>
        dy > 0
          ? null
          : dy === 0
            ? P.cap1Lo
            : dx < -1 && dy < -1
              ? P.swingHi
              : P.cap1
      );
      for (const [dx, dy] of [
        [-2, -2],
        [1, -3],
        [3, -1],
        [-1, -1],
      ] as const)
        f.set(sbX + 4 + dx, SB_Y - 11 + dy, P.dot);
      // the swing frame, seen end-on: a wide A, sunny on its left
      f.line(swingX, SWING_TOP, swingX - 10, SWING_BASE, P.swingHi);
      f.line(swingX + 1, SWING_TOP + 1, swingX - 9, SWING_BASE, P.swing);
      f.line(swingX + 1, SWING_TOP, swingX + 11, SWING_BASE, P.swing);
      f.line(swingX + 2, SWING_TOP + 1, swingX + 12, SWING_BASE, P.swingLo);
      f.rect(swingX - 1, SWING_TOP - 1, 4, 2, P.swingLo);
      f.hline(swingX - 1, swingX + 2, SWING_TOP - 1, P.swingHi);
      // washing lines, the posts and the ropes
      if (hasLine) {
        for (const x of [lineX0, lineX1]) {
          f.vline(x, LINE_Y - 13, LINE_Y, P.post);
          f.hline(x - 2, x + 2, LINE_Y - 13, P.post);
        }
      }
      // the apricot tree, heavy with fruit, rimmed by the low sun
      f.rect(treeX - 1, TREE_BASE - 10, 3, 10, P.trunk);
      f.vline(treeX - 1, TREE_BASE - 10, TREE_BASE - 1, P.trunkLit);
      f.line(treeX, TREE_BASE - 8, treeX - 5, TREE_BASE - 14, P.trunk);
      f.line(treeX + 1, TREE_BASE - 9, treeX + 6, TREE_BASE - 15, P.trunk);
      const blobs: [number, number, number][] = [];
      for (let i = 0; i < 22; i++) {
        const a = hash2(i, 1, 91) * Math.PI * 2;
        const d = Math.sqrt(hash2(i, 2, 91)) * treeR * 0.8;
        blobs.push([
          treeX + Math.cos(a) * d * 1.15,
          treeCY + Math.sin(a) * d * 0.8,
          2.4 + hash2(i, 3, 91) * 2,
        ]);
      }
      blobs.sort((a, b) => a[1] - b[1]);
      for (const [bx, by, r] of blobs) {
        f.disc(bx, by, r, (dx, dy) => {
          const l = (dx * 0.9 + dy * 1.2) / r;
          const outer = (bx + dx - treeX) / treeR;
          if (l < -0.8 && outer < 0.2) return P.leafRim;
          if (l < -0.4) return outer < 0 ? P.leafLit : P.leafMid;
          if (l > 0.55) return P.leafDeep;
          return l > 0 ? P.leafDark : P.leaf;
        });
      }
      for (let i = 0; i < 16; i++) {
        const ax = Math.round(treeX + (hash2(i, 5, 92) - 0.5) * treeR * 1.9);
        const ay = Math.round(treeCY + (hash2(i, 6, 92) - 0.4) * treeR * 1.2);
        if (!f.opaque(ax, ay)) continue;
        apricots.push({
          x: ax,
          y: ay,
          under: [
            [ax, ay],
            [ax - 1, ay],
            [ax, ay + 1],
          ].map(([x, y]) => (f.opaque(x!, y!) ? f.get(x!, y!) : null)),
        });
        f.set(ax, ay, P.apricot);
        f.set(ax - 1, ay, P.apricotHi);
        f.set(ax, ay + 1, P.apricotLo);
      }
      // on wide screens, a cherry tree further along, in the block's shade
      const chX = lineX1 + 36;
      if (hasLine && chX + 16 < w) {
        const base = 134;
        const cy = base - 21;
        f.rect(chX - 1, base - 10, 2, 10, P.trunk);
        f.line(chX, base - 9, chX - 5, base - 15, P.trunk);
        f.line(chX, base - 9, chX + 5, base - 16, P.trunk);
        const bl: [number, number, number][] = [];
        for (let i = 0; i < 20; i++) {
          const a = hash2(i, 1, 97) * Math.PI * 2;
          const d = Math.sqrt(hash2(i, 2, 97)) * 10;
          bl.push([
            chX + Math.cos(a) * d * 1.2,
            cy + Math.sin(a) * d * 0.8,
            2.4 + hash2(i, 3, 97) * 2,
          ]);
        }
        bl.sort((a, b) => a[1] - b[1]);
        for (const [bx, by, r] of bl)
          f.disc(bx, by, r, (dx, dy) => {
            const l = (dx * 0.5 + dy * 1.2) / r;
            return l < -0.7
              ? P.leafMid
              : l < -0.2
                ? P.leaf
                : l > 0.5
                  ? P.leafDeep
                  : P.leafDark;
          });
        for (let i = 0; i < 12; i++) {
          const x = Math.round(chX + (hash2(i, 5, 98) - 0.5) * 22);
          const y = Math.round(cy + (hash2(i, 6, 98) - 0.4) * 14);
          if (!f.opaque(x, y) || !f.opaque(x + 1, y + 1)) continue;
          f.set(x, y, P.red);
          f.set(x + 1, y + 1, P.redDark);
        }
      }
      // the domino table under the tree
      if (hasTable) {
        f.rect(tableX - 4, TABLE_Y - 5, 9, 1, P.table);
        f.hline(tableX - 4, tableX + 4, TABLE_Y - 4, P.tableLo);
        f.vline(tableX - 3, TABLE_Y - 3, TABLE_Y, P.tableLo);
        f.vline(tableX + 3, TABLE_Y - 3, TABLE_Y, P.tableLo);
      }
    });

    // ---------------- roses all along the front ----------------
    const corner = Math.min(46, w * 0.2);
    const hedgeTop = (x: number) => {
      const edge =
        Math.max(0, 1 - x / corner) ** 1.2 * 18 +
        Math.max(0, 1 - (w - x) / corner) ** 1.2 * 16;
      // a couple of taller bushes breaking the line
      const bush = (c: number, r: number) =>
        Math.max(0, 1 - ((x - c) / r) ** 2) * 6;
      const top =
        142 -
        edge -
        bush(w * 0.31, 9) -
        bush(w * 0.74, 8) +
        (fbm1(x / 11, 41, 3) - 0.5) * 6;
      const clear = Math.max(0, 1 - ((x - statueX) / 15) ** 2);
      return Math.max(top, top + (141 - top) * clear);
    };
    const roseLayer = layer(w, h, (f) => {
      for (let gy = 118; gy < h + 3; gy += 2.4) {
        for (let gx = -3; gx < w + 3; gx += 2.8) {
          const jx =
            gx + (hash2(Math.round(gx * 3), Math.round(gy * 3), 1) - 0.5) * 2.4;
          const jy =
            gy + (hash2(Math.round(gx * 3), Math.round(gy * 3), 2) - 0.5) * 2;
          const top = hedgeTop(jx);
          if (jy < top + 1) continue;
          const g = Math.min(1, (jy - top) / 9);
          const sun = fanAt(jx, top) >= 1 && jy - top < 3;
          f.disc(jx, jy, 1.9, (dx, dy) => {
            const v =
              (dx * 0.6 + dy) * 0.35 +
              g * 0.9 -
              0.35 +
              (hash2(Math.round(jx), Math.round(jy), 3) - 0.5) * 0.3;
            return v < -0.5
              ? sun
                ? P.leafRim
                : P.roseLeafHi
              : v < -0.1
                ? P.roseLeafLit
                : v < 0.35
                  ? P.roseLeaf
                  : v < 0.7
                    ? P.roseLeafDark
                    : P.roseLeafDeep;
          });
        }
      }
      const blooms: [number, number, number, Bloom][] = [];
      for (let x = 2; x < w; x += 4 + Math.floor(hash2(x, 0, 42) * 4)) {
        const top = hedgeTop(x);
        const group = Math.floor((x + 9) / 30);
        const kind =
          BLOOMS[
            (Math.floor(hash2(group, 1, 42) * BLOOMS.length) +
              (hash2(x, 2, 42) > 0.88 ? 1 : 0)) %
              BLOOMS.length
          ]!;
        const deep = h - top;
        for (let k = 0; k < Math.max(2, Math.round(deep / 6)); k++) {
          const y = Math.round(top + 2 + hash2(x, 3 + k, 42) * (deep - 1));
          if (y > h + 2 || hash2(x, 6 + k, 42) < 0.3) continue;
          const near = (y - 125) / 25;
          const R =
            hash2(x, 15 + k, 42) > 0.85
              ? 1.5
              : 1.8 + near * 1.8 + hash2(x, 9 + k, 42) * 0.6;
          blooms.push([
            x + Math.round((hash2(x, 12 + k, 42) - 0.5) * 3),
            y,
            R,
            kind,
          ]);
        }
      }
      blooms.sort((a, b) => a[1] - b[1]);
      for (const [x, y, R, c] of blooms) rose(f, x, y, R, c);
    });

    // ---------------- life ----------------

    // the winding wheels
    let spinAt = -Infinity;
    let spinAcc = 0;
    const SPIN = 6500;
    const spinOffset = (a: number) => {
      const B = 0.012;
      if (a <= 0) return 0;
      if (a < 1000) return (B * a * a) / 2000;
      if (a < 4000) return B * 500 + B * (a - 1000);
      if (a < SPIN) return B * 3500 + B * (a - 4000 - (a - 4000) ** 2 / 5000);
      return B * (3500 + 1250);
    };
    const spinSpeed = (a: number) =>
      a < 0
        ? 0
        : a < 1000
          ? a / 1000
          : a < 4000
            ? 1
            : a < SPIN
              ? 1 - (a - 4000) / 2500
              : 0;
    function sheave(
      f: Frame,
      x: number,
      y: number,
      r: number,
      ang: number,
      fast: number,
      front: boolean
    ) {
      for (let k = 0; k < 40; k++) {
        const a = (k / 40) * Math.PI * 2;
        f.set(
          Math.round(x + Math.cos(a) * r),
          Math.round(y + Math.sin(a) * r),
          front && Math.cos(a) > 0.45 ? P.steelRim : P.steel
        );
      }
      if (!front) return;
      if (fast > 0.55) {
        for (let dy = -r + 1; dy < r; dy++)
          for (let dx = -r + 1; dx < r; dx++)
            if (dx * dx + dy * dy < (r - 1) * (r - 1))
              f.blend(x + dx, y + dy, P.steel, 0.45);
      } else {
        for (let k = 0; k < 3; k++) {
          const a = ang + (k * Math.PI) / 3;
          f.line(
            x - Math.cos(a) * (r - 1),
            y - Math.sin(a) * (r - 1),
            x + Math.cos(a) * (r - 1),
            y + Math.sin(a) * (r - 1),
            P.steel
          );
        }
      }
      f.set(x, y, front ? P.steelRim : P.steelLit);
    }

    // the ferris wheel: lights on, lights off
    let wheelLit = false;
    let wheelAt = -Infinity;
    function ferrisWheel(f: Frame, t: number) {
      // far off in the park, in the haze: a thin rim, spokes, its A-legs down
      // to the trees, the cabins little dabs of colour
      const a0 = t / 16_000;
      f.line(fwX, fwY, fwX - fwR * 0.65, HZ, P.fwHazeDark);
      f.line(fwX, fwY, fwX + fwR * 0.65, HZ, P.fwHazeDark);
      const n = 8;
      for (let k = 0; k < n; k++) {
        const a = a0 + (k / n) * Math.PI * 2;
        f.line(
          fwX,
          fwY,
          fwX + Math.cos(a) * (fwR - 1),
          fwY + Math.sin(a) * (fwR - 1),
          P.fwHaze
        );
      }
      const ring = Math.round(fwR * 6.3);
      for (let k = 0; k < ring; k++) {
        const a = (k / ring) * Math.PI * 2;
        f.set(
          Math.round(fwX + Math.cos(a) * fwR),
          Math.round(fwY + Math.sin(a) * fwR),
          Math.cos(a) < -0.3 && Math.sin(a) < 0.3 ? P.cityFarLit : P.fwHazeDark
        );
      }
      for (let k = 0; k < n; k++) {
        const a = a0 + (k / n) * Math.PI * 2 + Math.PI / n;
        const gx = Math.round(fwX + Math.cos(a) * fwR);
        const gy = Math.round(fwY + Math.sin(a) * fwR);
        f.set(
          gx,
          gy + 1,
          [P.winWarm, P.cityFarLit, P.mallow, P.cityFarLit][k % 4]!
        );
      }
      f.set(fwX, fwY, P.fwHazeDark);
      if (!wheelLit) return;
      // bulbs round the rim, chasing for a moment when they come on
      const bulbs = Math.round(fwR * 2.4);
      for (let k = 0; k < bulbs; k++) {
        const a = a0 + (k / bulbs) * Math.PI * 2;
        if (t - wheelAt < 2400 && Math.floor(t / 90 - k) % 4 === 0) continue;
        const bx = Math.round(fwX + Math.cos(a) * fwR);
        const by = Math.round(fwY + Math.sin(a) * fwR);
        f.set(bx, by, P.bulb);
      }
      for (let k = 0; k < 4; k++) {
        const a = a0 + (k / 4) * Math.PI * 2;
        f.set(
          Math.round(fwX + Math.cos(a) * fwR * 0.5),
          Math.round(fwY + Math.sin(a) * fwR * 0.5),
          P.bulbGlow
        );
      }
      f.set(fwX, fwY, P.bulb);
      glow(f, fwX, fwY, fwR + 3, P.bulbGlow, 0.22, 1, 0.08);
    }

    // the trolleybus: comes in from the right, stops, and pulls away left
    const TB_LEN = 38;
    const V = 0.045; // px per ms at cruising speed
    const inD = w + 6 - stopX;
    const outD = stopX + TB_LEN + 40;
    const T_IN = (2 * inD) / V;
    const T_DWELL = 3400;
    const T_OUT = (2 * outD) / V;
    const TB_DUR = T_IN + T_DWELL + T_OUT;
    // one at a time: the next is never due before the last has gone
    const TB_EVERY = Math.max(30_000, Math.ceil(TB_DUR / 1000) * 1000 + 6000);
    let tbCalledAt = -Infinity;
    const tbStartAt = (t: number) => {
      if (t - tbCalledAt < TB_DUR && t >= tbCalledAt) return tbCalledAt;
      const k = Math.floor((t - 3000) / TB_EVERY);
      const s = k * TB_EVERY + 3000;
      // a timetabled one that would run into a called one doesn't come
      if (s >= tbCalledAt && s < tbCalledAt + TB_DUR) return -Infinity;
      return s;
    };
    const trolleybus = (t: number) => {
      const s = tbStartAt(t);
      const a = t - s;
      if (!(a >= 0 && a < TB_DUR)) return null;
      let x: number;
      let doors = 0;
      if (a < T_IN) x = stopX + inD * (1 - a / T_IN) ** 2;
      else if (a < T_IN + T_DWELL) {
        x = stopX;
        const d = a - T_IN;
        doors = Math.min(1, d / 300, (T_DWELL - d) / 300);
      } else x = stopX - outD * ((a - T_IN - T_DWELL) / T_OUT) ** 2;
      return { x: Math.round(x), doors, a };
    };

    function drawTrolleybus(f: Frame, x: number, doors: number, t: number) {
      const top = ROAD1 - 11; // roof line
      const L = TB_LEN;
      // the trolley poles, sprung up and back to the wires
      const pb = x + L - 11;
      f.line(pb, top - 1, pb + 14, WIRE + 1, P.pole);
      f.line(pb + 2, top - 1, pb + 16, WIRE + 3, P.pole);
      f.set(pb + 14, WIRE + 1, P.tbDark);
      f.set(pb + 16, WIRE + 3, P.tbDark);
      for (const px of poles)
        if (
          Math.abs(pb + 15 - (px + 2)) < 1.5 &&
          hash2(Math.floor(t / 60), px, 3) > 0.3
        ) {
          f.set(pb + 15, WIRE + 1, P.spark);
          glow(f, pb + 15, WIRE + 2, 5, P.spark, 0.5, 1, 0.15);
        }
      f.rect(pb - 2, top - 1, 8, 1, P.tbRoof);
      // body
      f.rect(x + 1, top, L - 2, 1, P.tbRoof);
      f.rect(x, top + 1, L, 7, P.tbCream);
      f.rect(x, top + 8, L, 2, P.tbRed);
      f.hline(x, x + L - 1, top + 9, P.tbRedLo);
      f.hline(x + 1, x + L - 2, top + 10, P.tbDark);
      // windows with warm lights and a few heads
      for (let k = 0; k < 7; k++) {
        const wx = x + 5 + k * 4;
        f.rect(wx, top + 2, 3, 4, P.tbGlass);
        f.hline(wx, wx + 2, top + 2, P.tbGlassLit);
        if (hash2(k, 1, 77) < 0.55) f.rect(wx + 1, top + 4, 1, 2, P.hair);
      }
      // the windscreen, the route board, the lights
      f.rect(x, top + 1, 3, 5, P.tbGlass);
      f.vline(x, top + 2, top + 5, P.tbGlassLit);
      f.hline(x + 1, x + 3, top + 1, P.tbBoard);
      f.set(x, top + 8, P.headlight);
      f.blend(x - 1, top + 8, P.sunRim, 0.6);
      f.blend(x - 2, top + 8, P.sunRim, 0.3);
      f.set(x + L - 1, top + 8, P.tail);
      f.rect(x + L - 2, top + 1, 2, 5, P.tbCreamLo);
      // three doors facing us, folding open at the stop
      for (const dx of [4, 17, 30]) {
        if (doors > 0.5) {
          f.rect(x + dx, top + 2, 3, 8, P.tbDark);
          f.vline(x + dx, top + 2, top + 9, P.tbCreamLo);
        } else {
          f.rect(x + dx, top + 2, 3, 8, P.tbCreamLo);
          f.vline(x + dx + 1, top + 3, top + 6, P.tbGlass);
        }
      }
      // wheels
      for (const dx of [7, L - 9]) {
        f.rect(x + dx - 1, top + 9, 5, 2, P.tbDark);
        f.rect(x + dx, top + 11, 3, 1, P.tbDark);
      }
    }

    // the swing: it never stops; a push sends it higher for a while
    let pushAt = -Infinity;
    let prevPushAt = -Infinity;
    const pushEnv = (a: number) =>
      a < 0 ? 0 : a < 700 ? a / 700 : Math.max(0, 1 - (a - 700) / 6500);
    const SWING_T = 2600;
    const swingAngle = (t: number) => {
      const A =
        0.42 + 0.62 * Math.max(pushEnv(t - pushAt), pushEnv(t - prevPushAt));
      return A * Math.sin((t / SWING_T) * Math.PI * 2);
    };

    // the ball game: back and forth, or one big hoof into the sky
    const BALL_T = 2400;
    const LOFT = 2600;
    let loftAt = -Infinity;
    let loftBase = 0;
    let loftFromA = true;
    const gameT = (t: number) =>
      t - loftBase - Math.max(0, Math.min(LOFT, t - loftAt));

    // flowers for the miners: a kid runs in with a bouquet and lays it at the
    // plinth (it stays). The coal in the miner's hand glows like a little
    // sun, rose petals swirl up round him and away over the whole sky, the
    // roses all along the front give up theirs, and every window in both
    // blocks comes on, from the monument outwards, then goes back to how it was
    let flowersAt = -Infinity;
    const laid: { slot: number; at: number }[] = [];
    const flowerTarget = (slot: number) => statueX - 6 + slot * 5;
    // a stroll on a phone, a run on a wide screen: never more than 1.2 s
    const flowerV = (slot: number) =>
      Math.max(0.035, (flowerTarget(slot) + 8) / 1200); // px per ms
    const flowerWalk = (slot: number) =>
      (flowerTarget(slot) + 8) / flowerV(slot);
    const flowerLay = (slot: number) => flowerWalk(slot) + 300; // it's down
    const FL_AFTER = 5900; // the glow, the petals and the lights, from then
    const flowerDur = (slot: number) => flowerLay(slot) + FL_AFTER;
    let flowerSlot = 0;
    let visits = 0;
    const flowersPlaying = (t: number) =>
      t - flowersAt >= 0 && t - flowersAt < flowerDur(flowerSlot);
    // the windows come on in a wave from the monument: each one's distance
    const winFar = windows.map((win) =>
      Math.hypot(win.x + win.w / 2 - statueX, (win.y - STATUE_Y) * 0.7)
    );
    const winFarMax = Math.max(1, ...winFar);
    /** When the flowers switch this window on, and off, after they went down. */
    const winOn = (i: number) => 150 + (winFar[i]! / winFarMax) * 1500;
    const winOff = (i: number) => 4400 + (winFar[i]! / winFarMax) * 1300;
    /** How bright the miner's coal is, 0..1, `a` ms after the click. */
    const coalGlow = (a: number, lay: number) => {
      const ss = (v: number) => {
        const c = Math.max(0, Math.min(1, v));
        return c * c * (3 - 2 * c);
      };
      if (a < 0) return 0;
      return (
        Math.max(0.6 * ss(a / 300), ss((a - lay + 250) / 450)) *
        (1 - ss((a - lay - 3900) / 1500))
      );
    };
    const N_SWIRL = Math.round(Math.max(130, Math.min(260, w * 0.5)));
    const N_FRONT = Math.round(Math.max(64, Math.min(170, w * 0.3)));
    /** A rose petal tumbling: flat on, or edge on. */
    function petal(
      f: Frame,
      x: number,
      y: number,
      c: Bloom,
      k: number,
      a: number
    ) {
      const X = Math.round(x);
      const Y = Math.round(y);
      f.blend(X, Y, c.hi, a);
      f.blend(X + 1, Y, c.mid, a);
      if (k % 3 === 0) return;
      f.blend(X, Y + 1, c.mid, a);
      f.blend(X + 1, Y + 1, c.dark, a);
    }
    /**
     * Rose petals, `a` ms after the click: a column swirling up round the
     * monument that bursts over the whole sky and comes fluttering down, and
     * a wave of them lifting off the roses all along the front. `back` draws
     * only those going round behind the miner.
     */
    function petals(f: Frame, a: number, lay: number, back: boolean) {
      const baseY = STATUE_Y + 1;
      const cx0 = statueX + 1;
      const end = lay + FL_AFTER - 200;
      // on a phone the monument's at the edge: lean the column in
      const drift = Math.max(5, Math.min(26, 40 - statueX * 0.6));
      for (let i = 0; i < N_SWIRL; i++) {
        const h1 = hash2(i, 1, 151);
        // a few go up as soon as he glows, most once the bouquet's down
        const born =
          i < N_SWIRL * 0.22 ? 150 + h1 * (lay - 150) : lay + h1 ** 1.3 * 1300;
        const s = (a - born) / 1000;
        const life = Math.min(
          4.6 + hash2(i, 2, 151) * 1.2,
          (end - born) / 1000
        );
        if (s < 0 || s > life) continue;
        // up round him in a widening spiral...
        const rise = 1 + hash2(i, 3, 151) * 0.8;
        const q = Math.min(s, rise) / rise;
        const theta = hash2(i, 4, 151) * Math.PI * 2 + Math.min(s, rise) * 6.5;
        const R = 2.5 + q * (8 + hash2(i, 5, 151) * 5);
        const topY = 22 + hash2(i, 6, 151) * 46;
        let x = cx0 + Math.cos(theta) * R + q * drift;
        let y = baseY - (baseY - topY) * q ** 0.85 + Math.sin(theta) * R * 0.35;
        // ...then flung out over the sky and fluttering down on the breeze
        const b = Math.max(0, s - rise);
        if (b > 0) {
          const e = 1 - Math.exp(-b / 0.5);
          const toX = -10 + (w + 20) * hash2(i, 7, 151);
          const toY = 6 + hash2(i, 8, 151) * 60;
          x += (toX - x) * e + Math.sin(b * 1.8 + i) * 4 + b * 3;
          y += (toY - y) * e + b * (6 + hash2(i, 9, 151) * 8);
        } else if (Math.sin(theta) < 0 !== back) continue;
        if (back && b > 0) continue;
        const fade = life - s < 0.8 ? (life - s) / 0.8 : 1;
        petal(f, x, y, BLOOMS[i % BLOOMS.length]!, Math.floor(s * 8 + i), fade);
      }
      if (back) return;
      for (let j = 0; j < N_FRONT; j++) {
        const px = ((j + hash2(j, 1, 153)) / N_FRONT) * w;
        const born =
          lay + 100 + (Math.abs(px - cx0) / w) * 1300 + hash2(j, 2, 153) * 400;
        const s = (a - born) / 1000;
        const life = Math.min(
          2.6 + hash2(j, 3, 153) * 1.2,
          (end - born) / 1000
        );
        if (s < 0 || s > life) continue;
        const py = hedgeTop(px) + 2 + hash2(j, 4, 153) * 7;
        const x =
          px + s * (8 + hash2(j, 5, 153) * 12) + Math.sin(s * 3 + j) * 3;
        const y = py - s * (24 + hash2(j, 6, 153) * 18) + s * s * 2.2;
        const fade = life - s < 0.6 ? (life - s) / 0.6 : 1;
        petal(
          f,
          x,
          y,
          BLOOMS[(j * 3) % BLOOMS.length]!,
          Math.floor(s * 7 + j),
          fade
        );
      }
    }

    // the ice-cream kiosk
    let creamAt = -Infinity;
    const CREAM = 6000;

    // dominoes: someone slams down the last tile
    let slamAt = -Infinity;
    const SLAM = 1600;

    // pigeons by the bench
    const pigeons = Array.from({ length: w < 300 ? 5 : 8 }, (_, i) => ({
      x: benchX - 4 + Math.round(hash2(i, 0, 61) * 32),
      y: BENCH_Y + 3 + Math.round(hash2(i, 1, 61) * 6),
      dir: hash2(i, 2, 61) > 0.5 ? 1 : -1,
      phase: hash2(i, 3, 61) * 10,
      body: i % 3 === 2 ? P.pigeonHi : P.pigeon,
    }));
    let flightAt = -Infinity;
    const FLIGHT = 6200;

    // swifts screaming round the rooftops
    const nSw = Math.max(4, Math.round(w / 90));
    const swifts = Array.from({ length: nSw }, (_, i) => ({
      cx: (i + 0.5) * (w / nSw),
      ax: 26 + hash2(i, 1, 71) * 40,
      ay: 4 + hash2(i, 2, 71) * 6,
      cy: 10 + hash2(i, 3, 71) * 14,
      speed: 1 / (1300 + hash2(i, 4, 71) * 900),
      phase: hash2(i, 5, 71) * 10,
    }));
    let swoopAt = -Infinity;
    let swoopX = 0;
    let swoopY = 0;

    // a kite flown off the top of the heap: it climbs and comes in on the
    // wind, big and bright and backlit by the sun, sweeps across the whole
    // sky, loops the loop with its long tail of paper bows, and glides back
    // down to the two kids on the top
    let kiteAt = -Infinity;
    const KITE = 8000;
    const KS = Math.max(10, Math.min(16, w * 0.035)); // its size, flying high
    const kiteHome = { x: apex.x + 1, y: apex.y - 4 };
    const kitePeakX = Math.round(cx + G * 0.05);
    const kiteSweep = Math.max(50, G * 0.9);
    const KITE_LOOP = 3300; // when it loops the loop
    const smooth = (v: number) => {
      const c = Math.max(0, Math.min(1, v));
      return c * c * (3 - 2 * c);
    };
    /** Where the kite is `a` ms after the click, how big (0..1), and its tilt. */
    const kiteAtAge = (a: number) => {
      const up = smooth((a - 250) / 2300);
      const down = smooth((a - 5900) / 2100);
      const k = up * (1 - down);
      // a slow figure of eight up there
      const ph = (a - 600) / 1500;
      const dx = Math.sin(ph) * kiteSweep;
      const dy = Math.sin(ph * 2) * 6;
      const hx2 = kitePeakX + dx;
      const hy2 = 31 + dy;
      // and one loop the loop, diving down and round
      const lp = smooth((a - KITE_LOOP) / 1300);
      const loop = lp * Math.PI * 2;
      const LR = 4 + KS * 0.5;
      let x = kiteHome.x + (hx2 - kiteHome.x) * k;
      let y = kiteHome.y + (hy2 - kiteHome.y) * k - Math.sin(k * Math.PI) * 12;
      x -= Math.sin(loop) * LR * k;
      y += (1 - Math.cos(loop)) * LR * k;
      const vx = Math.cos(ph) * kiteSweep * k;
      const tilt = Math.max(-0.5, Math.min(0.5, (vx / kiteSweep) * 0.45));
      return { x, y, s: 0.22 + 0.78 * k, rot: tilt + loop };
    };
    const KITE_PANELS = [P.kite, P.kiteHi, P.kiteBlue, P.cloth6];
    const BOWS = [P.kite, P.kiteHi, P.cloth3, P.cloth6, P.cloth2];
    /** The kite, its string down to the kids, and its tail of bows. */
    function drawKite(f: Frame, a: number) {
      const { x, y, s, rot } = kiteAtAge(a);
      const S = KS * s;
      const ca = Math.cos(rot);
      const sa = Math.sin(rot);
      const at = (u: number, v: number): [number, number] => [
        x + (u * ca - v * sa) * S,
        y + (u * sa + v * ca) * S,
      ];
      // the string, lit by the low sun, sagging down to the top of the heap
      const sx0 = apex.x;
      const sy0 = apex.y - 2;
      const [ex, ey] = at(0, -0.1);
      const sag = 6 + 14 * s;
      let px = sx0;
      let py = sy0;
      for (let k = 1; k <= 16; k++) {
        const v = k / 16;
        const nx = sx0 + (ex - sx0) * v;
        const ny = sy0 + (ey - sy0) * v + Math.sin(v * Math.PI) * sag;
        for (let q = 0; q < 4; q++)
          f.blend(
            px + ((nx - px) * q) / 4,
            py + ((ny - py) * q) / 4,
            P.rim,
            0.55
          );
        px = nx;
        py = ny;
      }
      // the tail: a ribbon of a fixed length off its foot, streaming back
      // along the way the kite came and hanging down under its own weight
      const N = 30;
      const seg = 2.1 * s;
      const foot = (b: { x: number; y: number; s: number; rot: number }) => [
        b.x - Math.sin(b.rot) * 1.3 * KS * b.s,
        b.y + Math.cos(b.rot) * 1.3 * KS * b.s,
      ];
      let [lx, ly] = foot(kiteAtAge(a)) as [number, number];
      let [hx0, hy0] = [lx, ly];
      for (let k = 1; k <= N; k++) {
        const [hx1, hy1] = foot(kiteAtAge(Math.max(0, a - k * 40))) as [
          number,
          number,
        ];
        // the way it came, plus the pull down, plus a flutter
        let dx = hx1 - hx0;
        let dy = hy1 - hy0;
        const m = Math.hypot(dx, dy);
        dx = m > 0.01 ? dx / m : 0;
        dy = m > 0.01 ? dy / m : 0;
        const wgt = Math.min(1, m * 1.5);
        let ux = dx * wgt + Math.sin(a / 150 - k * 0.6) * 0.45;
        let uy = dy * wgt + 0.75;
        const um = Math.hypot(ux, uy);
        ux /= um;
        uy /= um;
        const tx2 = lx + ux * seg;
        const ty2 = ly + uy * seg;
        f.line(lx, ly, tx2, ty2, P.cloth1);
        if (k % 3 === 0) {
          const c = BOWS[(k / 3) % BOWS.length]!;
          const bw = s > 0.55 ? 2 : 1;
          const X = Math.round(tx2);
          const Y = Math.round(ty2);
          for (let d = 1; d <= bw; d++) {
            f.vline(X - d, Y - d + 1, Y + d - 1, c);
            f.vline(X + d, Y - d + 1, Y + d - 1, c);
          }
          f.set(X, Y, P.cloth1);
        }
        lx = tx2;
        ly = ty2;
        hx0 = hx1;
        hy0 = hy1;
      }
      // four paper panels round the cross of its spars, glowing with the sun
      // behind them, and a bright rim where it catches the light
      const top = at(0, -1);
      const left = at(-0.72, -0.18);
      const right = at(0.72, -0.18);
      const bot = at(0, 1.3);
      const mid = at(0, -0.18);
      const tris: [number, number][][] = [
        [top, left, mid],
        [top, right, mid],
        [left, bot, mid],
        [right, bot, mid],
      ];
      tris.forEach((tri, i) => f.poly(tri, KITE_PANELS[i]!));
      if (S >= 4) {
        f.line(top[0], top[1], bot[0], bot[1], P.trunk);
        f.line(left[0], left[1], right[0], right[1], P.trunk);
        f.line(left[0], left[1], bot[0], bot[1], P.sunRim);
        f.line(right[0], right[1], bot[0], bot[1], P.sunRim);
      } else {
        f.set(mid[0], mid[1], P.kiteHi);
      }
    }

    // apricots shaken down
    let shakeAt = -Infinity;
    const DROP = 7000; // how long a fallen apricot lies in the grass
    let drops: {
      src: number;
      x: number;
      y: number;
      t: number;
      land: number;
      dx: number;
    }[] = [];

    const flipped = new Set<number>();

    // a boy on his bike, up and down the drive (keeping clear of the car)
    const bikeX0 = 10;
    const bikeX1 = Math.min(w - 10, gapR + 24);

    // neighbours out on their balconies
    const folk: { x: number; y: number; kind: number }[] = [];
    for (const [k, kind] of [
      [6, 0],
      [3, 1],
    ] as const) {
      for (const b of nine) {
        if (b.kind !== 'B' || folk.some((p) => Math.abs(p.x - b.x) < 30))
          continue;
        if (hash2(Math.round(b.x * 31 + k * 7), 1, 57) < 0.45) continue;
        folk.push({ x: b.x, y: nineFloor(k), kind });
        break;
      }
    }

    type Pose = 'stand' | 'kick' | 'cheer';
    const KID: Record<Pose, string[]> = {
      stand: [
        '.hh..',
        'hhhs.',
        '.hss.',
        'TTTTT',
        'sTTTs',
        '.PPP.',
        '.P.P.',
        '.s.s.',
        '.k.k.',
      ],
      kick: [
        '.hh..',
        'hhhs.',
        '.hss.',
        'TTTT.',
        'sTTTs',
        '.PPP.',
        '.P.Ps',
        '.s..k',
        '.k...',
      ],
      cheer: [
        's.hh.s',
        's.hhs.s',
        '.Thss',
        '.TTTT.',
        '..TTT.',
        '..PPP.',
        '..P.P.',
        '..s.s.',
        '..k.k.',
      ],
    };
    function kid(
      f: Frame,
      x: number,
      foot: number,
      shirt: RGB,
      hair: RGB,
      dir: number,
      pose: Pose,
      lit: boolean
    ) {
      const rows = KID[pose];
      const ox = pose === 'cheer' ? 3 : 2;
      sprite(
        f,
        rows,
        dir > 0 ? x - ox : x - (rows[0]!.length - 1 - ox),
        foot - rows.length + 1,
        { h: hair, s: P.skin, T: shirt, P: P.shorts, k: P.shoe },
        dir < 0
      );
      if (lit) {
        // the sun behind them catches their hair and shoulders
        f.set(x - dir, foot - 8, P.rim);
        f.set(x - 2 * dir, foot - 5, P.rim);
      }
    }

    function pigeon(
      f: Frame,
      x: number,
      y: number,
      dir: number,
      peck: boolean,
      body: RGB
    ) {
      const rows = peck ? ['....', 'tbbn', '.f.h'] : ['...h', 'tbbn', '.ff.'];
      sprite(
        f,
        rows,
        x - 2,
        y - 2,
        { h: P.pigeonLo, b: body, n: P.pigeonNeck, t: P.pigeonLo, f: P.feet },
        dir < 0
      );
    }

    function flyingBird(
      f: Frame,
      x: number,
      y: number,
      up: boolean,
      c: RGB,
      light: RGB
    ) {
      x = Math.round(x);
      y = Math.round(y);
      f.set(x, y, c);
      f.set(x + 1, y, c);
      if (up) {
        f.set(x - 1, y - 1, light);
        f.set(x - 2, y - 2, light);
        f.set(x + 2, y - 1, light);
        f.set(x + 3, y - 2, light);
      } else {
        f.set(x - 1, y + 1, light);
        f.set(x + 2, y + 1, light);
      }
    }

    function swift(f: Frame, x: number, y: number, dir: number, up: boolean) {
      x = Math.round(x);
      y = Math.round(y);
      f.hline(x - 1, x + 1, y, P.swift);
      f.set(x + dir * 2, y, P.swift);
      f.set(x - dir * 2, y - 1, P.swift);
      f.set(x - dir * 3, y - 1, P.swift);
      if (up) {
        f.set(x, y - 1, P.swift);
        f.set(x - 1, y - 2, P.swift);
        f.set(x + 1, y - 2, P.swift);
        f.set(x - 2, y - 3, P.swift);
        f.set(x + 2, y - 3, P.swift);
      } else {
        f.set(x - 1, y + 1, P.swift);
        f.set(x + 1, y + 1, P.swift);
        f.set(x - 2, y + 1, P.swift);
        f.set(x + 2, y + 1, P.swift);
      }
    }

    function bike(
      f: Frame,
      x: number,
      y: number,
      dir: number,
      t: number,
      lit: boolean
    ) {
      const X = (k: number) => x + dir * k;
      // wheels
      for (const c of [-3, 3])
        for (const [dx, dy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ] as const)
          f.set(X(c) + dx, y - 1 + dy, P.tyre);
      // frame, saddle and bars
      f.line(X(-3), y - 1, X(0), y - 1, P.kiteBlue);
      f.line(X(0), y - 1, X(-1), y - 3, P.kiteBlue);
      f.line(X(-1), y - 3, X(2), y - 3, P.kiteBlue);
      f.line(X(2), y - 3, X(3), y - 1, P.kiteBlue);
      f.set(X(2), y - 4, P.tyre);
      // the boy, leaning into it, pedalling
      const ped = Math.floor(t / 140) % 2;
      f.line(X(-1), y - 4, X(ped ? 1 : 0), y - 2 + ped, P.shorts);
      f.set(X(ped ? 1 : 0), y - 1 + ped, P.shoe);
      f.set(X(-1), y - 5, P.shirtG);
      f.set(X(0), y - 5, P.shirtG);
      f.set(X(0), y - 6, P.shirtG);
      f.set(X(1), y - 5, P.skin);
      f.set(X(0), y - 8, P.hair);
      f.set(X(1), y - 8, P.hair);
      f.set(X(0), y - 7, P.hair);
      f.set(X(1), y - 7, P.skin);
      if (lit) f.set(X(-1), y - 8, P.rim);
    }

    /** Neighbours on their balconies: one waters her geraniums, one just looks out. */
    function neighbours(f: Frame, t: number) {
      for (const p of folk) {
        const x = p.x;
        const y = p.y;
        if (p.kind === 0) {
          f.rect(x + 2, y + 2, 2, 2, P.hairRed);
          f.set(x + 3, y + 3, P.skin);
          f.rect(x + 2, y + 4, 3, 1, P.shirtP);
          const pour = Math.sin(t / 1400) > 0.2;
          f.rect(x + 5, y + 3 + (pour ? 0 : 1), 2, 1, P.cloth6);
          f.set(x + 4, y + 4, P.skin);
          if (pour) {
            f.set(x + 7, y + 4, P.cloth6);
            const d = Math.floor(t / 120) % 3;
            f.set(x + 8, y + 5 + d, P.tvHi);
          }
        } else {
          // a grandad in his vest, elbows on the parapet
          f.rect(x + 4, y + 2, 2, 2, P.skin);
          f.set(x + 4, y + 2, P.vestLo);
          f.rect(x + 3, y + 4, 4, 1, P.vest);
          f.set(x + 2, y + 4, P.skin);
          f.set(x + 7, y + 4, P.skin);
          const look = Math.sin(t / 2300) > 0 ? 1 : 0;
          f.set(x + 4 + look, y + 3, P.skinLo);
        }
      }
    }

    // ---------------- hit tests ----------------
    // a window hidden behind a tree, the lamppost or the monument isn't one
    // you can click
    const windowAt = (x: number, y: number) =>
      yard.opaque(x, y)
        ? -1
        : windows.findIndex(
            (win) =>
              x >= win.x - 1 &&
              x <= win.x + win.w &&
              y >= win.y - 1 &&
              y <= win.y + win.h
          );
    const onSwing = (x: number, y: number) =>
      Math.abs(x - swingX) < 13 && y > SWING_TOP - 3 && y < SWING_BASE + 2;
    const onKids = (x: number, y: number) =>
      x > kidA - 6 && x < kidB + 6 && y > KIDS_Y - 13 && y < KIDS_Y + 3;
    const onPigeons = (x: number, y: number) =>
      x > benchX - 8 && x < benchX + 30 && y > BENCH_Y - 10 && y < BENCH_Y + 11;
    const onTree = (x: number, y: number) =>
      Math.hypot((x - treeX) / 1.15, (y - treeCY) / 0.85) < treeR + 2;
    const onTable = (x: number, y: number) =>
      hasTable &&
      Math.abs(x - tableX) < 10 &&
      y > TABLE_Y - 12 &&
      y < TABLE_Y + 2;
    const onWheel = (x: number, y: number) =>
      hasWheel && Math.hypot(x - fwX, y - fwY) < fwR + 3 && y < HZ;
    const onHeadframe = (x: number, y: number) =>
      x > hx - 16 && x < hx + 9 && y > hTop - 16 && y < HZ;
    const onHeap = (x: number, y: number) =>
      x > gapL &&
      x < gapR &&
      y < HZ &&
      Math.abs(x - tx) < tHalf * (1 - (HZ - y) / tHeight) + 2;
    // the eggs' spots; a tap this close sets one off too (a finger gets the
    // same slack the viewer gives it, so a find always plays)
    const SLACK = 6;
    const FLOWERS_SPOT = { x: statueX + 1, y: STATUE_Y - 17, r: 9 };
    const KITE_SPOT = { x: apex.x, y: apex.y + 5, r: 8 };
    // the very top of the heap, where the kite goes up from: a little of the
    // sky round the peak counts too, so a click at the tip always lands
    const onSummit = (x: number, y: number) =>
      Math.hypot(x - KITE_SPOT.x, y - KITE_SPOT.y) <= KITE_SPOT.r + SLACK;
    const onStatue = (x: number, y: number) =>
      Math.abs(x - statueX - 1) <= 9 && y >= STATUE_Y - 38 && y <= STATUE_Y + 3;
    const nearStatue = (x: number, y: number) =>
      Math.hypot(x - FLOWERS_SPOT.x, y - FLOWERS_SPOT.y) <=
      FLOWERS_SPOT.r + SLACK;
    const onKiosk = (x: number, y: number) =>
      x >= kioskX - 2 && x <= kioskX + 14 && y >= ROAD1 - 15 && y <= HEDGE;
    const onStreet = (x: number, y: number) =>
      x > gapL && x < gapR && y >= ROAD0 - 12 && y <= HEDGE;
    const onRoses = (x: number, y: number) => y > hedgeTop(x) + 1;
    const inBlocks = (x: number, y: number) =>
      (x < gapL && y > NINE_TOP - 12 && y < LB) ||
      (x > gapR && y > KH_TOP - 14 && y < LB);

    return {
      render(f, t, pointer) {
        f.copyFrom(sky);
        f.over(cloudLayer, Math.round(t / 1500), 0, true);
        // the evening star
        const sx = Math.round(cx + G * 0.75);
        f.set(sx, 10, P.sun);
        if (Math.sin(t / 900) > 0.3) {
          f.blend(sx - 1, 10, P.sun, 0.5);
          f.blend(sx + 1, 10, P.sun, 0.5);
          f.blend(sx, 9, P.sun, 0.5);
          f.blend(sx, 11, P.sun, 0.5);
        }

        f.over(farBack);
        if (hasWheel) ferrisWheel(f, t);
        f.over(far);
        // the kite, if it's up, and the two kids on the top who flew it,
        // hopping about
        const kAge = t - kiteAt;
        if (kAge >= 0 && kAge < KITE) {
          const hop = Math.floor(kAge / 260) % 2;
          f.set(apex.x - 1, apex.y - 1 - hop, P.ballDark);
          f.set(apex.x - 1, apex.y - 2 - hop, P.ballDark);
          f.set(apex.x + 1, apex.y - 1 - (1 - hop), P.ballDark);
          f.set(apex.x + 1, apex.y - 2 - (1 - hop), P.ballDark);
          drawKite(f, kAge);
        }
        // the winding wheels and the lamp on top
        const sAge = t - spinAt;
        const ang = t * 0.0008 + spinAcc + spinOffset(sAge);
        const fast = spinSpeed(sAge);
        // the two winding wheels, one just behind the other, ropes running
        // down to the winder house hidden behind the trees
        for (let s = 0; s <= 1; s += 0.025) {
          f.blend(
            hx - 11 + s * (hx - 46 - hx + 11),
            hTop - 8 + s * (HZ - hTop + 8),
            P.steel,
            0.55
          );
          f.blend(
            hx - 6 + s * (hx - 42 - hx + 6),
            hTop - 14 + s * (HZ - hTop + 14),
            P.steel,
            0.55
          );
        }
        sheave(f, hx - 1, hTop - 9, 6, -ang + 0.4, fast, false);
        sheave(f, hx - 6, hTop - 7, 6, ang, fast, true);
        if (Math.sin(t / 900) > 0) f.set(hx - 1, hTop - 16, P.lamp);

        f.over(street);
        const tb = trolleybus(t);
        if (tb) drawTrolleybus(f, tb.x, tb.doors, t);
        // the stop: a shelter, a bench and the people waiting
        {
          const x = stopX - 3;
          const top = ROAD1 - 6;
          f.vline(x, top, HEDGE, P.pole);
          f.vline(x + 16, top, HEDGE, P.pole);
          f.rect(x - 1, top - 1, 18, 2, P.kioskBlue);
          f.hline(x - 1, x + 16, top - 1, P.frame);
          for (let yy = top + 1; yy < HEDGE - 1; yy++)
            for (let xx = x + 1; xx < x + 16; xx++)
              f.blend(xx, yy, P.glazed, 0.3);
          f.hline(x + 2, x + 13, HEDGE - 3, P.bench);
          // a babushka with her shopping
          sprite(f, ['.S.', 'SsS', 'ddd', 'ddd', '.l.'], x + 3, HEDGE - 6, {
            S: P.scarfW,
            s: P.skin,
            d: P.dress2,
            l: P.skinLo,
          });
          f.rect(x + 7, HEDGE - 3, 2, 2, P.cloth3);
          // a man strolls up to wait, and gets on when it comes
          const a = tb ? tb.a : -1;
          let mx = -1;
          if (a >= 0 && a < 3000)
            // out from behind the kiosk (drawn after him), not out of thin air
            mx = kioskX + 5 - (kioskX + 5 - (x + 11)) * (a / 3000);
          else if (a >= 3000 && a < T_IN + 900) mx = x + 11;
          else if (a >= T_IN + 900 && a < T_IN + 1700)
            mx = x + 11 - ((a - T_IN - 900) / 800) * 7;
          if (mx >= 0) {
            const walking = a < 3000 || a > T_IN + 900;
            const step = walking && Math.floor(t / 200) % 2;
            sprite(
              f,
              [
                '.h.',
                'sh.',
                'TTT',
                '.T.',
                step ? 'l.l' : '.l.',
                step ? 'l.l' : '.l.',
              ],
              mx - 1,
              HEDGE - 7,
              {
                h: P.hair,
                s: P.skin,
                T: P.shirtW,
                l: P.shorts,
              }
            );
          }
          // and someone gets off and heads home across the yard
          if (tb && tb.a > T_IN + 900) {
            const wa = tb.a - T_IN - 900;
            const px = Math.round(stopX + 18 + wa * 0.012);
            if (px < kioskX + 5) {
              const step = Math.floor(wa / 200) % 2;
              sprite(
                f,
                [
                  '.h.',
                  '.hs',
                  'TTT',
                  '.T.',
                  step ? 'l.l' : '.l.',
                  step ? 'l.l' : '.l.',
                ],
                px - 1,
                HEDGE - 7,
                {
                  h: P.hairFair,
                  s: P.skin,
                  T: P.shirtP,
                  l: P.dress,
                }
              );
            }
          }
        }
        // the kiosk with ice cream
        {
          const x = kioskX;
          const top = ROAD1 - 6;
          f.rect(x, top, 13, HEDGE - top, P.kiosk);
          f.vline(x + 12, top, HEDGE - 1, P.kioskLo);
          f.rect(x - 1, top - 2, 15, 2, P.kioskBlue);
          for (let k = 0; k < 15; k++)
            f.set(x - 1 + k, top, k % 2 ? P.awning : P.awningW);
          f.rect(x + 2, top + 2, 8, 3, P.kioskWin);
          for (let k = 0; k < 4; k++)
            f.set(x + 3 + k * 2, top + 3, CLOTHES[k + 2]!);
          f.hline(x + 2, x + 9, top + 5, P.kioskLo);
          sprite(f, ['.p.', 'ppp', 'yyy', '.y.'], x + 5, top - 6, {
            p: P.pink,
            y: P.yellow,
          });
          // a kid nips out from behind the block for an ice cream, and back
          const cAge = t - creamAt;
          if (cAge >= 0 && cAge < CREAM) {
            const winX = x + 4;
            const from = gapR + 8;
            let kx: number;
            let dir = -1;
            let has = false;
            if (cAge < 2200) kx = from + (winX - from) * (cAge / 2200);
            else if (cAge < 3200) {
              kx = winX;
              // the cone comes out of the window
              f.set(x + 8, top + 4, P.skin);
              f.set(x + 8, top + 3, P.yellow);
              f.set(x + 8, top + 2, P.pink);
            } else {
              kx = winX + (from - winX) * ((cAge - 3200) / (CREAM - 3200));
              dir = 1;
              has = true;
            }
            const walking = cAge < 2200 || cAge >= 3200;
            const step = walking && Math.floor(t / 160) % 2;
            sprite(
              f,
              ['.hh', 'hhs', 'TTT', step ? 's.s' : '.s.', step ? 'k.k' : '.k.'],
              Math.round(kx) - 1,
              HEDGE - 5,
              { h: P.hairFair, s: P.skin, T: P.shirtR, k: P.shoe },
              dir < 0
            );
            if (has) {
              f.set(Math.round(kx) + 2, HEDGE - 4, P.yellow);
              f.set(Math.round(kx) + 2, HEDGE - 5, P.pink);
            }
          }
        }

        f.over(ground);
        f.over(buildings);
        for (const e of evening) {
          if (!eveningOn(e, t)) continue;
          windows[e.i]!.paint(f, !flipped.has(e.i), t);
        }
        for (const i of flipped) {
          if (evening.some((e) => e.i === i && eveningOn(e, t))) continue;
          windows[i]!.paint(f, !windows[i]!.on, t);
        }
        for (const i of tvWins)
          if (!flipped.has(i)) windows[i]!.paint(f, true, t);
        // the flowers: every window in both blocks comes on, and goes back
        const fa = t - flowersAt;
        const fLay = flowerLay(flowerSlot);
        const fOn = flowersPlaying(t);
        if (fOn && fa >= fLay)
          for (let i = 0; i < windows.length; i++) {
            const k = fa - fLay - winOn(i);
            if (k < 0 || fa - fLay >= winOff(i)) continue;
            const win = windows[i]!;
            // (one that's lit anyway needs no repainting)
            if (!win.on || flipped.has(i)) win.paint(f, true, t);
            // each one flashes as it comes on, and glows warm over and under
            const flash = k < 400 ? 1 - k / 400 : 0;
            const halo = 0.3 + 0.5 * flash;
            for (let x = win.x - 1; x <= win.x + win.w; x++) {
              f.blend(x, win.y - 1, P.lit, halo);
              f.blend(x, win.y + win.h, P.lit, halo);
            }
            if (flash > 0)
              for (let y = win.y; y < win.y + win.h; y++)
                for (let x = win.x; x < win.x + win.w; x++)
                  f.blend(x, y, P.litHi, flash * 0.85);
          }
        neighbours(f, t);
        // lamps over the doors, just come on
        for (const x of entrances) {
          f.set(x + 4, LB - 14, P.litHi);
          glow(f, x + 4, LB - 13, 7, P.lit, 0.4, 1, 0.15);
        }
        f.over(yardBack);
        // a boy on his bike, up and down the drive, slowing to turn at each end
        {
          const span = bikeX1 - bikeX0;
          const per = (span * 2 * Math.PI) / 0.05;
          const ph = ((t % per) / per) * Math.PI * 2;
          const x = Math.round(bikeX0 + (span * (1 - Math.cos(ph))) / 2);
          const dir = Math.sin(ph) >= 0 ? 1 : -1;
          castShadow(f, x, YARD - 2, 6, 3, 0.45);
          bike(f, x, YARD - 2, dir, t, fanAt(x, YARD - 2) >= 1);
        }

        if (fOn) petals(f, fa, fLay, true);
        f.over(yard);
        glow(f, lampX + 4, LAMP_Y - 13, 9, P.lit, 0.35, 1, 0.12);
        f.rect(lampX + 3, LAMP_Y - 14, 3, 2, P.litHi);

        // the monument: a pigeon on his helmet, bouquets at his feet
        {
          const py = STATUE_Y - 15;
          pigeon(f, statueX, py - 18, 1, Math.sin(t / 1700) > 0.8, P.pigeonHi);
          for (const b of laid) {
            if (t < b.at) continue;
            const x = statueX - 4 + b.slot * 4;
            const y = STATUE_Y - 1;
            f.set(x, y, P.stem);
            f.set(x + 1, y, P.stem);
            f.set(x - 1, y - 1, P.red);
            f.set(x + 1, y - 1, P.redHi);
            f.set(x, y - 2, P.red);
            f.set(x + 2, y - 2, b.slot === 1 ? P.cream : P.red);
          }
          if (fOn) {
            const walk = flowerWalk(flowerSlot);
            const v = flowerV(flowerSlot);
            const target = flowerTarget(flowerSlot);
            // in, down on one knee, up to watch the petals go, and off home
            const KNEEL = 900;
            const WATCH = 1900;
            const kneel = fa >= walk && fa < walk + KNEEL;
            const watch = fa >= walk + KNEEL && fa < walk + KNEEL + WATCH;
            const out = fa >= walk + KNEEL + WATCH;
            const kx = Math.round(
              kneel || watch
                ? target
                : out
                  ? target - (fa - walk - KNEEL - WATCH) * v
                  : -8 + fa * v
            );
            const step = !kneel && Math.floor(t / (v > 0.05 ? 110 : 170)) % 2;
            const rows = kneel
              ? ['.hh..', 'hhhs.', '.hss.', 'TTTT.', 'sTTTs', '.PPP.', 'PP.k.']
              : watch
                ? KID.cheer
                : [
                    '.hh..',
                    'hhhs.',
                    '.hss.',
                    'TTTTT',
                    'sTTTs',
                    '.PPP.',
                    '.P.P.',
                    step ? 's...s' : '.s.s.',
                    step ? 'k...k' : '.k.k.',
                  ];
            if (kx > -6)
              sprite(
                f,
                rows,
                kx - (watch ? 3 : 2),
                STATUE_Y + 3 - rows.length - (watch && fa % 700 < 200 ? 1 : 0),
                {
                  h: P.hairFair,
                  s: P.skin,
                  T: P.shirtW,
                  P: P.shorts,
                  k: P.shoe,
                },
                out
              );
            if (!out && !kneel && !watch) {
              // the bouquet held out in front
              f.set(kx + 3, STATUE_Y - 4, P.red);
              f.set(kx + 4, STATUE_Y - 5, P.redHi);
              f.set(kx + 3, STATUE_Y - 3, P.stem);
            }
            // the coal in his hand glows like a little sun, rays turning
            const g = coalGlow(fa, fLay);
            if (g > 0.02) {
              const gx = statueX + 6;
              const gy = py - 20;
              glow(f, gx, gy, 5 + 15 * g, P.lit, 0.7 * g, 1, 0.1);
              glow(f, gx, gy, 3 + 5 * g, P.litHi, 0.9 * g, 1, 0.1);
              const len = 4 + 16 * g;
              for (let k = 0; k < 10; k++) {
                const ang = (k / 10) * Math.PI * 2 + fa / 2400;
                const ca = Math.cos(ang);
                const sa = Math.sin(ang);
                const l = len * (k % 2 ? 0.6 : 1);
                for (let d = 3; d < l; d++)
                  f.blend(gx + ca * d, gy + sa * d, P.litHi, g * (1 - d / l));
              }
              f.rect(gx - 1, gy, 3, 2, g > 0.3 ? P.litHi : P.coalHi);
            }
          }
        }

        // babushkas on the bench, one throwing seed to the pigeons
        {
          const y = BENCH_Y - 7;
          const throwP = (t % 4200) / 4200;
          const arm = throwP > 0.8 && throwP < 0.9;
          sprite(
            f,
            ['.KKK.', 'KsssK', '.ddd.', 'ddddd', 'dAAAd', '.s.s.', '.k.k.'],
            benchX,
            y,
            {
              K: P.scarfR,
              s: P.skin,
              d: P.dress,
              A: P.apron,
              k: P.shoe,
            }
          );
          sprite(
            f,
            ['.KKK.', 'KsssK', '.ddd.', 'ddddd', 'ddddd', '.s.s.', '.k.k.'],
            benchX + 6,
            y,
            {
              K: P.scarfW,
              s: P.skin,
              d: P.dress3,
              k: P.shoe,
            }
          );
          if (arm) {
            f.set(benchX + 11, y + 2, P.dress3);
            f.set(benchX + 12, y + 1, P.skin);
          } else f.set(benchX + 10, y + 4, P.skin);
          if (throwP > 0.84) {
            const s = (throwP - 0.84) / 0.16;
            for (let k = 0; k < 3; k++)
              f.set(
                benchX + 13 + k * 2 + s * 5,
                y + 1 + s * s * 9 + k,
                P.cream
              );
          }
        }
        // a cat on the porch roof, tail hanging over the edge
        if (entrances[0] !== undefined) {
          const ex = entrances[0] + 6;
          const ey = LB - 3 - 10;
          sprite(f, ['e.e.', 'ccc.', 'cccc'], ex, ey - 3, {
            c: P.cap,
            e: P.cap,
          });
          const flick = Math.sin(t / 800) > 0.7 ? 1 : 0;
          f.vline(ex + 3 + flick, ey, ey + 2, P.cap);
          f.set(ex + 1, ey - 2, P.lit);
        }

        // the pigeons: pecking, or off round the yard when startled
        const fAge = t - flightAt;
        const flying = fAge >= 0 && fAge < FLIGHT;
        for (const [i, p] of pigeons.entries()) {
          // where it's pottering about; they take off from there and land
          // back on it, so nothing jumps when the flight starts or ends
          const px = p.x + Math.round(Math.sin(t / 3000 + p.phase) * 2);
          if (flying) {
            const a = Math.max(0, fAge - i * 70);
            const ss = (v: number) => v * v * (3 - 2 * v);
            const wgt =
              ss(Math.min(1, a / 700)) *
              (1 - ss(Math.max(0, Math.min(1, (a - 4400) / 1600))));
            const th = (a / 4400) * Math.PI * 2 + i * 0.5;
            const ox = cx + Math.cos(th) * G * 0.9 + (i % 3) * 4;
            const oy = 72 + Math.sin(th) * 14 + (i % 2) * 5;
            const bx = px + (ox - px) * wgt;
            const by = p.y - 3 + (oy - p.y + 3) * wgt;
            if (wgt < 0.04) pigeon(f, px, p.y, p.dir, false, p.body);
            else
              flyingBird(
                f,
                bx,
                by,
                Math.floor(t / 80 + i) % 2 === 0,
                P.pigeonLo,
                p.body
              );
            continue;
          }
          const peck = Math.sin(t / 260 + p.phase * 3) > 0.4;
          pigeon(f, px, p.y, p.dir, peck, p.body);
        }

        // a little one digging in the sandbox
        {
          const dig = Math.floor(t / 500) % 2;
          sprite(f, ['.hh.', 'hss.', 'TTT.', 'TTTs'], sbX - 4, SB_Y - 6, {
            h: P.hairFair,
            s: P.skin,
            T: P.shirtP,
          });
          f.set(sbX - 1 + dig, SB_Y - 2 - dig, P.kiteBlue);
          f.rect(sbX - 6, SB_Y - 4, 2, 2, P.kiteHi);
        }

        // the swing
        {
          const th = swingAngle(t);
          const L = 15;
          const sx2 = swingX + Math.sin(th) * L;
          const sy2 = SWING_TOP + Math.cos(th) * L;
          const lit = fanAt(sx2, SWING_BASE) >= 1;
          for (let k = -2; k <= 2; k++)
            if (fanAt(sx2 + k, SWING_BASE + 4))
              f.blend(
                Math.round(sx2 + k + th * 4),
                SWING_BASE + 4,
                P.shadow,
                0.5
              );
          const X = Math.round(sx2);
          const Y = Math.round(sy2);
          // the girl on it, legs out going forward and tucked going back
          const fwd = Math.cos((t / SWING_T) * Math.PI * 2) > 0;
          sprite(
            f,
            ['.hh.', 'hhhs', 'hhss', '.YYs', '.YY.', '.YY.', 'YYYY'],
            X - 2,
            Y - 7,
            { h: P.hairRed, s: P.skin, Y: P.shirtY }
          );
          if (lit) {
            f.set(X - 2, Y - 6, P.rim);
            f.set(X - 1, Y - 7, P.rim);
          }
          if (fwd) {
            f.hline(X + 2, X + 3, Y, P.skin);
            f.set(X + 4, Y, P.shoe);
          } else {
            f.set(X + 2, Y, P.skin);
            f.vline(X + 2, Y + 1, Y + 2, P.skin);
            f.set(X + 1, Y + 3, P.shoe);
          }
          f.hline(X - 2, X + 2, Y + 1, P.seat);
          f.line(swingX + 1, SWING_TOP + 1, X + 1, Y - 4, P.rod);
          f.set(X + 1, Y - 4, P.skin);
        }

        // the ball game
        {
          const gt = gameT(t);
          const u = (((gt % BALL_T) + BALL_T) % BALL_T) / BALL_T;
          const toB = u < 0.5;
          const v = toB ? u * 2 : (u - 0.5) * 2;
          const lAge = t - loftAt;
          const lofting = lAge >= 0 && lAge < LOFT;
          let bx: number;
          let by: number;
          const span = kidB - kidA - 6;
          if (lofting) {
            const fromA = loftFromA;
            const kx = fromA ? kidA + 3 : kidB - 3;
            const s = lAge / LOFT;
            bx = kx + Math.sin(s * Math.PI) * (fromA ? 5 : -5);
            const air = Math.min(1, s / 0.82);
            by =
              KIDS_Y -
              1 -
              4 * 46 * air * (1 - air) -
              (s > 0.82 ? Math.sin(((s - 0.82) / 0.18) * Math.PI) * 4 : 0);
          } else {
            bx = toB ? kidA + 3 + span * v : kidB - 3 - span * v;
            by = KIDS_Y - 1 - Math.sin(v * Math.PI) * 3;
          }
          const hoof = lofting && lAge < 260;
          const kickA = hoof ? loftFromA : !lofting && (u > 0.96 || u < 0.06);
          const kickB = hoof ? !loftFromA : !lofting && u > 0.46 && u < 0.56;
          const cheer = lofting && lAge > 350 && lAge < LOFT * 0.8;
          castShadow(f, kidA, KIDS_Y, 8, 2);
          castShadow(f, kidB, KIDS_Y, 8, 2);
          kid(
            f,
            kidA,
            KIDS_Y,
            P.shirtR,
            P.hair,
            1,
            cheer ? 'cheer' : kickA ? 'kick' : 'stand',
            fanAt(kidA, KIDS_Y) >= 1
          );
          kid(
            f,
            kidB,
            KIDS_Y,
            P.shirtB,
            P.hairFair,
            -1,
            cheer ? 'cheer' : kickB ? 'kick' : 'stand',
            fanAt(kidB, KIDS_Y) >= 1
          );
          const BX = Math.round(bx);
          const BY = Math.round(by);
          if (fanAt(BX, KIDS_Y + 2))
            f.blend(
              BX + Math.round((KIDS_Y - by) * 0.2),
              KIDS_Y + 1,
              P.shadow,
              0.5
            );
          f.set(BX, BY, P.ball);
          f.set(BX + 1, BY, P.ballDark);
          f.set(BX, BY - 1, P.ball);
          f.set(BX + 1, BY - 1, P.ball);
        }

        // the domino players: click and someone slams down the last tile
        if (hasTable) {
          const sAge2 = t - slamAt;
          const slam = sAge2 >= 0 && sAge2 < SLAM;
          const up = slam && sAge2 < 300;
          const bang = slam && sAge2 >= 300 && sAge2 < 520;
          const hands = slam && sAge2 >= 520 && sAge2 < 1400;
          const y = TABLE_Y;
          // the one standing behind, facing us, his legs under the table
          f.vline(tableX - 1, y - 3, y, P.trousers);
          f.vline(tableX + 1, y - 3, y, P.trousers);
          sprite(
            f,
            ['.ss.', 'ssss', 'VVVV', up ? 'sVVV' : 'sVVs', 'VVVV'],
            tableX - 2,
            y - 10,
            { s: P.skin, V: P.vestLo }
          );
          if (up) {
            f.vline(tableX + 2, y - 12, y - 8, P.skin);
            f.set(tableX + 2, y - 13, P.tile);
          } else if (bang) f.set(tableX + 1, y - 6, P.skin);
          for (let k = 0; k < 4; k++) {
            const hop = bang
              ? k % 2
                ? 2
                : 1
              : slam && sAge2 < 700 && k % 2
                ? 1
                : 0;
            f.set(tableX - 3 + k * 2, y - 6 - hop, P.tile);
          }
          if (bang) {
            f.blend(tableX - 5, y - 6, P.tile, 0.5);
            f.blend(tableX + 5, y - 6, P.tile, 0.5);
          }
          // one each side, side-on
          sprite(
            f,
            [
              '.cc.',
              '.cs.',
              hands ? 'VVV.' : 'VVVs',
              'VVV.',
              'TTTT',
              'T..T',
              'k..k',
            ],
            tableX - 8,
            y - 6,
            { c: P.cap, s: P.skin, V: P.vest, T: P.trousers, k: P.shoe }
          );
          sprite(
            f,
            [
              '.hh.',
              '.sh.',
              hands ? '.VVV' : 'sVVV',
              '.VVV',
              'TTTT',
              'T..T',
              'k..k',
            ],
            tableX + 5,
            y - 6,
            { h: P.hair, s: P.skin, V: P.shirtG, T: P.trousers, k: P.shoe }
          );
          if (hands) {
            f.vline(tableX - 5, y - 8, y - 7, P.skin);
            f.vline(tableX + 5, y - 8, y - 7, P.skin);
          }
        }

        // sheets on the line, stirring a little
        if (hasLine) {
          const y0 = LINE_Y - 12;
          f.line(lineX0, y0, lineX1, y0 + 1, P.rod);
          const items: [number, number, number, RGB][] = [
            [lineX0 + 3, 9, 6, P.sheet],
            [lineX0 + 14, 3, 3, P.cloth5],
            [lineX0 + 20, 9, 5, P.sheetBlue],
            [lineX0 + 31, 2, 2, P.cloth4],
          ];
          for (const [x0, ww, hh, c] of items) {
            for (let dx = 0; dx < ww; dx++) {
              const sway = Math.round(
                Math.sin(t / 900 + (x0 + dx) * 0.35) * 0.7
              );
              const bot = y0 + 1 + hh + (dx === 0 || dx === ww - 1 ? 0 : sway);
              f.vline(
                x0 + dx,
                y0 + 1,
                bot,
                dx === ww - 1 ? (c === P.sheet ? P.sheetLo : c) : c
              );
            }
            f.set(x0, y0 + 1, P.post);
            f.set(x0 + ww - 1, y0 + 1, P.post);
          }
        }

        // apricots falling and rolling to a stop
        drops = drops.filter((d) => t - d.t < DROP);
        for (const d of drops) {
          const a = (t - d.t) / 1000;
          if (a < 0) continue;
          // it's gone from the branch; in the end the fallen one fades into
          // the grass and the tree has a fresh one
          const fade = Math.max(0, (t - d.t - (DROP - 800)) / 800);
          const src = apricots[d.src]!;
          for (const [k, [ux, uy]] of (
            [
              [src.x, src.y],
              [src.x - 1, src.y],
              [src.x, src.y + 1],
            ] as const
          ).entries()) {
            const u = src.under[k];
            if (u != null) f.blend(ux, uy, u, 1 - fade);
          }
          const fallT = Math.sqrt((2 * (d.land - d.y)) / 160);
          let x: number;
          let y: number;
          if (a < fallT) {
            x = d.x;
            y = d.y + 80 * a * a;
          } else {
            const b = a - fallT;
            x = d.x + d.dx * Math.min(b, 0.6) * 8;
            y =
              d.land -
              Math.max(0, Math.sin(Math.min(b / 0.35, 1) * Math.PI)) * 3;
          }
          f.blend(x, y, P.apricot, 1 - fade);
          f.blend(x - 1, y, P.apricotHi, 1 - fade);
        }

        f.over(roseLayer);
        if (fOn) petals(f, fa, fLay, false);

        // swifts round the roofs; they dive to where the sky was clicked
        const swAge = t - swoopAt;
        for (const [i, s] of swifts.entries()) {
          const a = t * s.speed + s.phase;
          let x = s.cx + Math.sin(a) * s.ax;
          let y = s.cy + Math.sin(a * 2) * s.ay;
          if (swAge >= 0 && swAge < 2600) {
            const k = Math.sin((swAge / 2600) * Math.PI);
            x += (swoopX + Math.sin(a * 3) * 10 - x) * k;
            y += (swoopY + Math.cos(a * 3) * 6 - y) * k;
          }
          swift(
            f,
            x,
            y,
            Math.cos(a) > 0 ? 1 : -1,
            Math.floor(t / 90 + i * 3) % 2 === 0
          );
        }

        // poplar fluff drifting through the low sun
        const nFluff = Math.round(w / 12);
        for (let i = 0; i < nFluff; i++) {
          const span = w + 40;
          const x =
            ((hash2(i, 1, 101) * span +
              t * (0.004 + hash2(i, 2, 101) * 0.006)) %
              span) -
            20 +
            Math.sin(t / 1300 + i) * 3;
          const y =
            40 +
            hash2(i, 3, 101) * 96 +
            Math.sin(t / 1700 + i * 2) * 5 -
            ((t * 0.0015 + hash2(i, 4, 101) * 30) % 30);
          const inGap = x > gapL && x < gapR && y > 62;
          if (y < LB && !inGap) continue;
          const inSun = y > KERB ? fanAt(x, y) >= 1 : inGap;
          f.blend(x, y, P.fluff, inSun ? 0.85 : 0.35);
        }

        // fireflies starting up in the roses
        for (let i = 0; i < Math.max(4, Math.round(w / 50)); i++) {
          const b = Math.sin(t / 900 + hash2(i, 1, 111) * 20);
          if (b < 0.55) continue;
          const x = hash2(i, 2, 111) * w + Math.sin(t / 2100 + i) * 6;
          const y =
            hedgeTop(x) - 2 + hash2(i, 3, 111) * 8 + Math.cos(t / 1800 + i) * 3;
          if (fanAt(x, y) >= 1) continue;
          f.blend(x, y, P.firefly, (b - 0.55) * 2.2);
        }

        fx.draw(f, t);

        // hover: a window under the pointer gets a faint outline
        if (pointer) {
          const i = windowAt(pointer.x, pointer.y);
          if (i >= 0 && pointer.y < LB) {
            const win = windows[i]!;
            for (let x = win.x - 1; x <= win.x + win.w; x++) {
              f.blend(x, win.y - 1, P.frame, 0.35);
              f.blend(x, win.y + win.h, P.frame, 0.35);
            }
          }
        }
      },
      poke(x, y, t) {
        if (onRoses(x, y)) {
          const seed = Math.floor(t) % 991;
          fx.add(t, 5000, (f, age) => {
            const a = age / 1000;
            for (let i = 0; i < 30; i++) {
              const s = a - hash2(i, 1, seed) * 0.6;
              if (s < 0) continue;
              const px =
                x +
                (hash2(i, 2, seed) - 0.5) * 16 +
                s * (10 + hash2(i, 3, seed) * 12) +
                Math.sin(s * 3 + i) * 3;
              const py =
                y -
                4 +
                (hash2(i, 4, seed) - 0.5) * 6 -
                s * (12 + hash2(i, 6, seed) * 8) +
                s * s * 2.6;
              const c = BLOOMS[Math.floor(hash2(i, 5, seed) * BLOOMS.length)]!;
              const flip = Math.floor(s * 6 + i) % 2;
              f.set(px, py, c.mid);
              f.set(px + flip, py + 1 - flip, c.hi);
            }
            const bx = x + Math.sin(a * 2) * 8 + a * 6;
            const by = y - 6 - a * 12 + Math.sin(a * 5) * 3;
            const open = Math.floor(age / 110) % 2 === 0;
            f.set(bx, by, P.bug);
            f.set(bx - 1, by - (open ? 1 : 0), P.butterfly);
            f.set(bx + 1, by - (open ? 1 : 0), P.butterfly);
            if (open) {
              f.set(bx - 2, by - 1, P.butterflyDot);
              f.set(bx + 2, by - 1, P.butterfly);
            }
          });
          return;
        }
        if (onStatue(x, y) || nearStatue(x, y)) {
          // one kid at a time, never started over; the bouquets stay where
          // they're laid
          if (!flowersPlaying(t)) {
            flowerSlot = visits++ % 3;
            flowersAt = t;
            if (laid.length < 3)
              laid.push({ slot: flowerSlot, at: t + flowerLay(flowerSlot) });
          }
          return;
        }
        if (onSwing(x, y)) {
          if (t - pushAt > 2500) {
            prevPushAt = pushAt;
            pushAt = t;
          }
          return;
        }
        if (onKids(x, y)) {
          // the next one to get the ball hoofs it up: never yanks it mid-pass
          if (t > loftAt + LOFT) {
            const half = BALL_T / 2;
            const gt = gameT(t);
            const next = (Math.floor(gt / half) + 1) * half;
            loftBase += Math.max(0, Math.min(LOFT, t - loftAt));
            loftAt = t + (next - gt);
            loftFromA = Math.round(next / half) % 2 === 0;
          }
          return;
        }
        if (onPigeons(x, y)) {
          if (t - flightAt > FLIGHT) flightAt = t;
          return;
        }
        if (onTable(x, y)) {
          if (t - slamAt > SLAM) slamAt = t;
          return;
        }
        if (onTree(x, y)) {
          if (t - shakeAt > 1500) {
            shakeAt = t;
            // only fruit still on the branches can fall
            const left = apricots
              .map((_, i) => i)
              .filter((i) => !drops.some((d) => d.src === i));
            const picks = left
              .filter((i) => hash2(i, Math.floor(t), 7) < 0.3)
              .slice(0, 3);
            for (const [i, src] of (picks.length
              ? picks
              : left.slice(0, 2)
            ).entries())
              drops.push({
                src,
                x: apricots[src]!.x,
                y: apricots[src]!.y,
                t: t + i * 180,
                land: TREE_BASE + 2 + i,
                dx: hash2(i, 9, Math.floor(t)) - 0.5,
              });
          }
          return;
        }
        if (onWheel(x, y)) {
          wheelLit = !wheelLit;
          wheelAt = t;
          return;
        }
        const i = windowAt(x, y);
        if (i >= 0 && y < LB) {
          if (flipped.has(i)) flipped.delete(i);
          else flipped.add(i);
          return;
        }
        if (inBlocks(x, y)) return;
        if (onHeadframe(x, y)) {
          if (t - spinAt > SPIN) {
            spinAcc += spinOffset(Infinity);
            spinAt = t;
          }
          return;
        }
        if (onKiosk(x, y)) {
          if (t - creamAt > CREAM) creamAt = t;
          return;
        }
        if (onStreet(x, y)) {
          if (!trolleybus(t)) tbCalledAt = t;
          return;
        }
        if (onHeap(x, y) || onSummit(x, y)) {
          if (t - kiteAt > KITE) kiteAt = t;
          return;
        }
        if (y < HZ && t - swoopAt > 2600) {
          swoopAt = t;
          swoopX = x;
          swoopY = y;
        }
      },
      hot(x, y) {
        return (
          onRoses(x, y) ||
          onSwing(x, y) ||
          onKids(x, y) ||
          onStatue(x, y) ||
          onPigeons(x, y) ||
          onTable(x, y) ||
          onTree(x, y) ||
          onWheel(x, y) ||
          (windowAt(x, y) >= 0 && y < LB) ||
          onHeadframe(x, y) ||
          onStreet(x, y) ||
          onHeap(x, y) ||
          onSummit(x, y) ||
          (y < HZ && !inBlocks(x, y))
        );
      },
      eggs() {
        return [
          // the kid with the bouquet for the miners
          { id: 'flowers', ...FLOWERS_SPOT },
          // the kite off the top of the terykon
          { id: 'kite', ...KITE_SPOT },
        ];
      },
    };
  },
};
