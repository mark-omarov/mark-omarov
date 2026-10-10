// Lake Ashi, Hakone, on a clear autumn morning: the vermilion Torii of Peace
// standing in the water below Hakone Shrine's cedars, a pirate-ship cruise
// boat crossing the lake, Mt. Kamiyama in autumn colours with Owakudani
// steaming on its flank and the ropeway gondolas crawling over it, Fuji's
// snowy cone peeking over the rim of the caldera, and mist on the water.
//
// Click the ship to make it toot and get a move on, the water for ripples,
// the steam vents for a big puff, the trees for falling leaves, the torii for
// a photo, and the sky for a flock of ducks.
//
// Two easter eggs: the capybaras soaking in the little hot spring under the
// maple turn the whole lake into a yuzu bath and go for a swim in it; and
// the ropeway gondola with a man, a woman and a kid at its window stops over
// Owakudani just as the valley lets out a great sulphurous belch, which
// turns out to have one of its famous black eggs in it.

import { dither, Frame, lerpRGB, type RGB } from '../frame';
import { flock, Fx, ripple, splash } from '../fx';
import { fbm1, hash2, noise1 } from '../noise';
import { clouds, gradient } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';
import { fujisan } from '../things/fuji-mountain';

const P = palette({
  sky0: '#2a62c4',
  sky1: '#3a76d0',
  sky2: '#4e8ad8',
  sky3: '#6aa0e0',
  sky4: '#8ab6e6',
  sky5: '#acccec',
  sky6: '#cfe2f0',
  cloudLight: '#ffffff',
  cloudBase: '#e6eef8',
  cloudShadow: '#b9cbe4',
  // Fuji, far off in the haze
  snowLit: '#ffffff',
  snowMid: '#e4ecf8',
  snowShade: '#bccbe6',
  snowDeep: '#a2b4d8',
  rockLit: '#93a9d2',
  rock: '#8299c6',
  rockShade: '#748bbc',
  rockDeep: '#6a80b2',
  fujiForest: '#7a92ba',
  fujiForestLit: '#88a0c4',
  // the caldera rim
  rim: '#6f90b8',
  rimLit: '#86a6c8',
  rimShade: '#6283ae',
  rimHaze: '#7c9cc0',
  // Kamiyama and the hills across the lake (hazy autumn)
  cedarD: '#466a62',
  cedar: '#56786a',
  cedarL: '#6a8c74',
  mapleD: '#a65c4e',
  maple: '#c4704c',
  mapleL: '#dc925a',
  goldD: '#a8925a',
  gold: '#c6ae5e',
  goldL: '#dcc674',
  redD: '#94504e',
  red: '#b0584c',
  redL: '#c8745a',
  hillShade: '#466660',
  scar: '#d8d0b8',
  scarLit: '#f0ead8',
  scarShade: '#b4aa92',
  scarDark: '#8a8270',
  sulphur: '#e6d25a',
  vent: '#fffef4',
  steam0: '#ffffff',
  steam1: '#e6ecf2',
  steam2: '#c8d2de',
  cable: '#4a5a62',
  gondolaA: '#d8402e',
  gondolaB: '#f2efe6',
  gondolaLit: '#ff7a54',
  gondolaShade: '#c4bcac',
  glass: '#a8d4f0',
  gondolaLine: '#2a2e36',
  mist: '#f4f8fa',
  // Owakudani's belch, and the black egg boiled in it
  fumeLit: '#fff38a',
  fume: '#ecd23e',
  fumeShade: '#c8aa2c',
  fumeDeep: '#94802a',
  stink: '#5e7a16',
  stinkL: '#a8c838',
  egg0: '#0c0a0e',
  egg1: '#1c1920',
  egg2: '#302c36',
  eggHi: '#5e5868',
  eggShine: '#e4e0ec',
  eggWhite: '#fffcf2',
  eggWhiteShade: '#dcd6c4',
  // the trio in the gondola: the man's light-brown hair and dark hoodie, the
  // woman's near-black hair and cream sweater, the kid's teal beanie and its
  // pom-pom
  skin: '#e09a74',
  manHair: '#9a7650',
  hoodie: '#1f2029',
  womanHair: '#1a1418',
  sweater: '#e4c49c',
  kidHat: '#2e6a62',
  pom: '#f4ead0',
  // lake
  water0: '#7eb0d8',
  water1: '#5a96c8',
  water2: '#3a7ab4',
  water3: '#28629e',
  water4: '#1d4f88',
  waterHi: '#d8ecf8',
  waterHi2: '#a8d0ec',
  wake: '#eaf4fb',
  // the shrine's shore
  sugiD: '#11281e',
  sugi: '#1b3a2a',
  sugiL: '#2a5236',
  trunk: '#3a2a24',
  momijiD: '#8e1e1a',
  momiji: '#cc3424',
  momijiL: '#f2603a',
  momijiHi: '#ff9a5a',
  ginkgo: '#f0b830',
  ginkgoL: '#ffd860',
  ginkgoD: '#b88420',
  ground: '#2a3a2a',
  stone: '#b2aea2',
  stoneLit: '#d4d0c4',
  stoneShade: '#86827a',
  stoneDark: '#5c5a56',
  wall: '#7a786e',
  // torii
  shu: '#ec4a2c',
  shuLit: '#ff7a4c',
  shuShade: '#b0301c',
  shuDeep: '#7c1e14',
  kasagi: '#1e1a1e',
  kasagiHi: '#4a4248',
  plaque: '#2a2224',
  plaqueRim: '#e8b84a',
  // people
  coatA: '#2a4a8a',
  coatB: '#e8e0d0',
  coatC: '#8a2a3a',
  coatD: '#3a3a42',
  hair: '#1e1a1e',
  flash: '#ffffff',
  // the pirate ship
  hull: '#8c2420',
  hullLit: '#b8382c',
  hullDark: '#5a1614',
  keel: '#2a1a1a',
  trim: '#f0c050',
  trimDark: '#b08428',
  cabin: '#f4eee0',
  cabinShade: '#cfc6b2',
  window: '#3a4a6a',
  mast: '#5a3a26',
  rope: '#6a5040',
  sail: '#fffcf2',
  sailShade: '#dcd4c2',
  pennantA: '#e8402e',
  pennantB: '#f6c232',
  pennantC: '#3a6ad0',
  // swan boats
  swan: '#fbfaf6',
  swanShade: '#d2d0cc',
  beak: '#f0902a',
  swanSeat: '#3a4a6a',
  // branch
  bark: '#3a2620',
  barkL: '#5a3c2e',
  kite: '#3a3032',
  duck: '#2e2a30',
  // the rotenburo: dark volcanic boulders, milky jade water, capybaras, yuzu
  boulderLit: '#9a9c98',
  boulder: '#6a6c70',
  boulderShade: '#4a4c52',
  boulderDark: '#2e3036',
  onsen: '#8fd2c2',
  onsenDeep: '#62aa9e',
  onsenHi: '#e4f8f0',
  capyLit: '#c88e5c',
  capy: '#9c6a44',
  capyShade: '#6e4630',
  capyEar: '#4a2e20',
  capyEye: '#2a1810',
  yuzuLit: '#fff27a',
  yuzu: '#ffc21a',
  yuzuShade: '#d88a10',
});

// A capybara's big blunt head in profile, up to its neck in water, facing
// left, and a youngster's. h lit, m fur, d shade, e ear, E eye, n nose.
const CAPY = ['......e.', '.hhhhhhd', 'nhhhhEhd', 'nmmmmmmd', '.mmmmmdd'];
const CAPY_PUP = ['...ee.', '.hhhhd', 'nhhEhd', 'nmmmmd'];
// The same out swimming, the top of the back showing behind the head.
const SWIM = ['......e.....', '.hhhhhhd....', 'nhhhhEhdhhhd', 'nmmmmmmmmmmd'];
const SWIM_PUP = ['...ee....', '.hhhhd...', 'nhhEhdhhd', 'nmmmmmmmd'];

// The trio's gondola, hanging from its grip on the cable: a red roof, a
// white body, a dark outline so it stands out against the hillside, and the
// three of them at the window. k outline and hanger, R roof, r roof (lit),
// g glass, B body, b body (shade); the man's hair M over his hoodie J, the
// woman's hair W over her sweater w, the kid's pom-pom p over the beanie Y.
const GONDOLA = [
  '..kkk..',
  '...k...',
  'RRRRRRr',
  'kgMWpgk',
  'kgJwYgk',
  'kBBBBBk',
  '.kbbbk.',
];
// the same, all three bobbing about and flapping at the smell (s hands)
const GONDOLA_PHEW = [
  '..kkk..',
  '...k...',
  'RRRRRRr',
  'kgMWpsk',
  'ksJwYgk',
  'kBBBBBk',
  '.kbbbk.',
];
const GONDOLA_PHEW2 = [
  '..kkk..',
  '...k...',
  'RRRRRRr',
  'ksMgggk',
  'kgJWpsk',
  'kBBBBBk',
  '.kbbbk.',
];

const HORIZON = 92; // far shore
const SHIP_Y = 109; // the ship's waterline
const TORII_Y = 128; // the torii's feet in the water
const PEAK = 34;

type Leafy = { d: RGB; m: RGB; l: RGB; hi?: RGB };

/** Copies the opaque pixels of a same-width layer inside a box (cheaper than a full over()). */
function blit(
  f: Frame,
  src: Frame,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  const w = f.w;
  x0 = Math.max(0, x0);
  x1 = Math.min(w, x1);
  for (let y = Math.max(0, y0); y < Math.min(src.h, f.h, y1); y++) {
    const row = y * w;
    for (let x = x0; x < x1; x++) {
      const p = src.pixels[row + x]!;
      if (p >>> 24) f.pixels[row + x] = p;
    }
  }
}

/**
 * Autumn forest seen from a distance: packed tree crowns, each one a cedar,
 * maple, gold or red tree, lit from the upper right.
 */
function autumnCanopy(
  f: Frame,
  inside: (x: number, y: number) => boolean,
  pick: (x: number, y: number, r: number) => Leafy,
  opts: {
    seed: number;
    x0?: number;
    x1?: number;
    y0: number;
    y1: number;
    size: number;
    step?: number;
  }
) {
  const step = opts.step ?? Math.max(2, Math.round(opts.size * 1.1));
  const blobs: [number, number, number, Leafy][] = [];
  for (let gy = opts.y0; gy < opts.y1; gy += step) {
    for (
      let gx = opts.x0 ?? -opts.size;
      gx < (opts.x1 ?? f.w + opts.size);
      gx += step
    ) {
      const jx = gx + Math.round((hash2(gx, gy, opts.seed) - 0.5) * step);
      const jy = gy + Math.round((hash2(gx, gy, opts.seed + 1) - 0.5) * step);
      if (!inside(jx, jy)) continue;
      const r = opts.size * (0.7 + hash2(gx, gy, opts.seed + 2) * 0.6);
      blobs.push([jx, jy, r, pick(jx, jy, hash2(gx, gy, opts.seed + 3))]);
    }
  }
  blobs.sort((a, b) => a[1] - b[1]);
  for (const [bx, by, r, s] of blobs) {
    f.disc(bx, by, r, (dx, dy) => {
      const l = (-dx + dy * 1.3) / r;
      if (l < -0.8 && s.hi) return s.hi;
      if (l < -0.3) return s.l;
      if (l > 0.6) return s.d;
      return s.m;
    });
  }
}

export const hakone: Scene = {
  id: 'hakone',
  name: 'Hakone',
  country: 'Japan',
  create(w, h) {
    const cx = w / 2;
    const fujiX = Math.round(cx - Math.min(92, w * 0.24));
    const kamX = Math.round(cx + Math.min(34, w * 0.1));
    const toriiX = Math.round(cx + Math.min(118, w * 0.31)); // centre of the torii
    const fx = new Fx();

    // ---------- sky ----------
    const sky = layer(w, h, (f) => {
      gradient(f, 0, HORIZON, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
      ]);
    });
    const cloudLayer = layer(w, 46, (f) => {
      clouds(f, {
        seed: 17,
        y0: 2,
        y1: 22,
        cell: 6,
        coverage: 0.32,
        stretch: 3.5,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });

    // ---------- far: Fuji over the caldera rim ----------
    // the rim: a long hazy ridge with a few saddles and spurs
    const rimTop = (x: number) =>
      73 -
      fbm1(x / 46, 31, 4) * 18 -
      fbm1(x / 7, 33, 2) * 3 +
      Math.max(0, 1 - Math.abs(x - fujiX) / 40) * 3;
    const far = layer(w, h, (f) => {
      fujisan(f, fujiX, PEAK, 96, {
        halfBase: 122,
        light: -1,
        snow: 0.42,
        fingers: 0.3,
        forest: 0.1,
        seed: 9,
        style: {
          snowLit: P.snowLit,
          snowMid: P.snowMid,
          snowShade: P.snowShade,
          snowDeep: P.snowDeep,
          rockLit: P.rockLit,
          rock: P.rock,
          rockShade: P.rockShade,
          rockDeep: P.rockDeep,
          forest: P.fujiForest,
          forestLit: P.fujiForestLit,
        },
      });
      for (let x = 0; x < w; x++) {
        const top = Math.round(rimTop(x));
        // a sunlit crest on slopes facing the morning sun, haze thickening lower down
        const slope = rimTop(x + 2) - rimTop(x - 2);
        for (let y = top; y < HORIZON; y++) {
          let c = y > HORIZON - 16 + noise1(x / 9, 32) * 4 ? P.rimHaze : P.rim;
          if (y === top) c = slope > 0.8 ? P.rimShade : P.rimLit;
          else if (y === top + 1 && slope < -0.8) c = P.rimLit;
          f.set(x, y, c);
        }
      }
    });

    // ---------- mid: Kamiyama with Owakudani, the hills across the lake ----------
    const kamTop = (x: number) => {
      const d = (x - kamX) / 62;
      const mount =
        42 * Math.exp(-d * d * 1.4) +
        (d < 0 ? 8 * Math.exp(-((d + 1.1) ** 2) * 3) : 0);
      return HORIZON - 9 - mount - fbm1(x / 22, 41, 4) * 10;
    };
    // the bare, steaming slope of Owakudani on Kamiyama's left flank
    const scarX = kamX - Math.round(Math.min(24, w * 0.07));
    const scarY = Math.round(kamTop(scarX)) + 5;
    const scarH = 20;
    const inScar = (x: number, y: number) => {
      const v = (y - scarY) / scarH;
      if (v < 0 || v > 1) return false;
      // a raw, rounded hollow in the hillside, ragged at the edges and fraying out below
      const half =
        7 +
        Math.sin(v * Math.PI * 0.8) * 7 +
        v * 3 +
        (noise1(y * 0.6 + x * 0.04, 42) - 0.5) * 6;
      const dx = x - scarX + v * 4;
      const bottom = 0.72 + noise1(x * 0.25, 49) * 0.28;
      return Math.abs(dx) < half && y >= kamTop(x) + 2 && v < bottom;
    };
    const vents = [
      { x: scarX - 1, y: scarY + 5 },
      { x: scarX + 5, y: scarY + 11 },
      { x: scarX - 7, y: scarY + 14 },
    ];
    const greens: Leafy = { d: P.cedarD, m: P.cedar, l: P.cedarL };
    const autumn: Leafy[] = [
      { d: P.goldD, m: P.gold, l: P.goldL },
      { d: P.mapleD, m: P.maple, l: P.mapleL },
      { d: P.redD, m: P.red, l: P.redL },
    ];
    const mid = layer(w, h, (f) => {
      for (let x = 0; x < w; x++)
        f.vline(x, Math.round(kamTop(x)) + 2, HORIZON - 1, P.hillShade);
      autumnCanopy(
        f,
        (x, y) => y >= kamTop(x) + 1 && y < HORIZON && !inScar(x, y),
        (x, y, r) => {
          // whole hillsides turn together: broad drifts of colour through the cedar green
          const zone =
            noise1(x / 16 + y / 30, 43) * 0.7 +
            noise1(y / 7 - x / 40, 47) * 0.3;
          if (zone < 0.42 || r > 0.88) return greens;
          return autumn[Math.min(2, Math.floor((zone - 0.42) * 6))]!;
        },
        { seed: 45, y0: 30, y1: HORIZON + 2, size: 2.6, step: 3 }
      );
      // Owakudani: pale ash and rock, sulphur crusts, darker gullies
      for (let y = scarY; y < scarY + scarH + 1; y++) {
        for (let x = scarX - 22; x < scarX + 22; x++) {
          if (!inScar(x, y)) continue;
          const g = noise1(x * 0.45 - y * 0.12, 46);
          const sul = noise1(x * 0.3 + y * 0.4, 48);
          let c = g > 0.68 ? P.scarShade : g < 0.32 ? P.scarLit : P.scar;
          if (sul > 0.72 && g < 0.6) c = P.sulphur;
          if (!inScar(x - 1, y) || !inScar(x + 1, y)) c = P.scarDark;
          f.set(x, y, c);
        }
      }
      for (const v of vents) {
        f.hline(v.x - 1, v.x + 1, v.y, P.vent);
        f.set(v.x, v.y - 1, P.vent);
      }
    });

    // ---------- the lake ----------
    // everything static above the water in one opaque layer; the clouds move
    // behind it, so remember where the sky ends in each column
    const back = layer(w, h, (f) => {
      f.copyFrom(sky);
      f.over(far);
      f.over(mid);
    });
    const skyEnd = new Int16Array(w);
    for (let x = 0; x < w; x++) {
      let y = 0;
      while (y < HORIZON && !far.opaque(x, y) && !mid.opaque(x, y)) y++;
      skyEnd[x] = y;
    }
    const lake = layer(w, h, (f) => {
      gradient(f, HORIZON, h, [
        P.water0,
        P.water1,
        P.water2,
        P.water3,
        P.water4,
      ]);
      for (let y = HORIZON; y < h; y++) {
        const d = y - HORIZON;
        const sy = HORIZON - 1 - d;
        if (sy < 0) break;
        const k = 0.5 - d / 120;
        for (let x = 0; x < w; x++)
          f.set(x, y, lerpRGB(f.get(x, y), back.get(x, sy), Math.max(0.12, k)));
      }
    });

    // ---------- near: the shrine's shore, cedars, steps and the torii ----------
    const shoreTop = (x: number) => {
      // the promontory slopes down to the water left of the torii
      const s = (x - (toriiX - 44)) / 22;
      if (s < 0) return Infinity;
      return Math.round(
        TORII_Y - 2 - Math.min(1, s) * 5 + (noise1(x * 0.3, 51) - 0.5) * 1.5
      );
    };
    const maple: Leafy = {
      d: P.momijiD,
      m: P.momiji,
      l: P.momijiL,
      hi: P.momijiHi,
    };
    const ginkgo: Leafy = { d: P.ginkgoD, m: P.ginkgo, l: P.ginkgoL };
    /** A broadleaf tree: a trunk forking into a crown built from a few lumpy clusters. */
    function tree(
      f: Frame,
      x: number,
      base: number,
      size: number,
      pal: Leafy,
      seed: number
    ) {
      const cy = base - size * 1.25;
      f.rect(x, Math.round(cy), 2, Math.round(base - cy), P.trunk);
      f.line(x, cy + size * 0.4, x - size * 0.5, cy - size * 0.1, P.trunk);
      f.line(x + 1, cy + size * 0.3, x + size * 0.55, cy - size * 0.2, P.trunk);
      const lumps: [number, number, number][] = [];
      for (let k = 0; k < 6; k++) {
        const a = k * 1.1 + hash2(k, 1, seed) * 0.8;
        const d = size * (k === 0 ? 0 : 0.45 + hash2(k, 2, seed) * 0.25);
        lumps.push([
          x + Math.cos(a) * d * 1.2,
          cy + Math.sin(a) * d * 0.7 - size * 0.1,
          size * (0.42 + hash2(k, 3, seed) * 0.2),
        ]);
      }
      autumnCanopy(
        f,
        (px, py) =>
          lumps.some(
            ([lx, ly, r]) => (px - lx) ** 2 + ((py - ly) / 0.8) ** 2 < r * r
          ),
        () => pal,
        {
          seed,
          y0: Math.round(cy - size * 1.2),
          y1: Math.round(cy + size),
          x0: Math.round(x - size * 1.8),
          x1: Math.round(x + size * 1.8),
          size: 2.6,
          step: 2,
        }
      );
    }
    /** Sugi: a tall, narrow, dense cedar, sunlit down its right side. */
    function sugi(f: Frame, x: number, base: number, ht: number, seed: number) {
      const top = base - ht;
      f.rect(
        x - 1,
        base - Math.round(ht * 0.18),
        3,
        Math.round(ht * 0.18),
        P.trunk
      );
      f.vline(x + 1, base - Math.round(ht * 0.18), base, P.barkL);
      const crown = Math.round(ht * 0.84);
      for (let y = 0; y < crown; y++) {
        const v = y / crown;
        const tier = (y % 6) / 5;
        const half = Math.max(
          0,
          Math.round(
            ht * 0.1 * (0.15 + 0.85 * Math.pow(v, 0.7)) * (0.8 + tier * 0.25)
          )
        );
        for (let dx = -half; dx <= half; dx++) {
          if (Math.abs(dx) === half && hash2(x + dx, top + y, seed) > 0.6)
            continue;
          const side = dx / Math.max(1, half);
          let c = P.sugi;
          if (side > 0.35) c = P.sugiL;
          else if (side < -0.3 || tier > 0.85) c = P.sugiD;
          f.set(x + dx, top + y, c);
        }
      }
    }
    const nearL = layer(w, h, (f) => {
      // dark undergrowth so no daylight shows between the trunks
      for (let x = toriiX - 30; x < w; x++) {
        const top = Math.round(TORII_Y - 34 + noise1(x * 0.2, 54) * 8);
        f.vline(x, top, TORII_Y - 6, P.sugiD);
      }
      // giant cedars behind, cropped by the top of the frame
      for (let i = 0, x = toriiX - 26; x < w + 12; i++) {
        const tall =
          96 + Math.round(hash2(i, 1, 52) * 40) + Math.max(0, x - toriiX) * 0.4;
        sugi(f, x, TORII_Y - 5, tall, 53 + i);
        x += 8 + Math.round(hash2(i, 2, 52) * 7);
      }
      for (let i = 0, x = toriiX - 20; x < w + 12; i++) {
        sugi(
          f,
          x + 4,
          TORII_Y - 7,
          70 + Math.round(hash2(i, 3, 52) * 30),
          80 + i
        );
        x += 12 + Math.round(hash2(i, 4, 52) * 8);
      }
      // the shrine's hall at the top of the steps, glimpsed through the torii
      const hx = toriiX + 13;
      const hy = TORII_Y - 23;
      f.rect(hx - 8, hy - 7, 17, 8, P.shuShade);
      for (let k = -8; k <= 8; k += 4) f.vline(hx + k, hy - 7, hy, P.shu);
      f.rect(hx - 6, hy - 5, 3, 4, P.cabin);
      f.rect(hx + 3, hy - 5, 3, 4, P.cabin);
      for (let k = 0; k < 4; k++)
        f.hline(
          hx - 11 + k,
          hx + 11 - k,
          hy - 8 - k,
          k === 0 ? P.kasagiHi : P.kasagi
        );
      f.set(hx - 12, hy - 7, P.kasagi);
      f.set(hx + 12, hy - 7, P.kasagi);
      // the bank under the trees, a stone embankment at the water
      for (let x = toriiX - 48; x < w; x++) {
        const top = shoreTop(x);
        if (!Number.isFinite(top)) continue;
        f.vline(x, top - 7, top - 1, P.ground);
        f.set(x, top, P.stoneLit);
        f.vline(x, top + 1, Math.min(h - 1, top + 2), P.stoneShade);
      }
      // maples and a gold ginkgo in front of the cedars
      const deep: Leafy = {
        d: P.momijiD,
        m: P.momijiD,
        l: P.momiji,
        hi: P.momijiL,
      };
      tree(f, toriiX - 40, shoreTop(toriiX - 40) - 1, 9, maple, 61);
      for (let i = 0, x = toriiX + 44; x < w + 14; i++) {
        const r = hash2(i, 1, 60);
        const size = 7 + Math.round(hash2(i, 2, 60) * 7);
        const pal = r < 0.5 ? maple : r < 0.78 ? ginkgo : deep;
        tree(
          f,
          x,
          shoreTop(x) - 1 - Math.round(hash2(i, 3, 60) * 3),
          size,
          pal,
          62 + i
        );
        x += 12 + Math.round(hash2(i, 4, 60) * 18);
      }
      // stone steps climbing from the water up into the trees behind the torii
      for (let k = 0; k < 9; k++) {
        const y = TORII_Y - 3 - k * 2;
        const half = 8 - k * 0.6;
        const sx = toriiX + k * 1.5;
        f.hline(
          Math.round(sx - half),
          Math.round(sx + half),
          y,
          k % 2 ? P.stoneLit : P.stone
        );
        f.hline(
          Math.round(sx - half),
          Math.round(sx + half),
          y + 1,
          P.stoneShade
        );
      }
      // a stone lantern beside the steps
      const lx = toriiX + 18;
      const ly = TORII_Y - 8;
      f.rect(lx - 1, ly - 9, 3, 1, P.stoneShade);
      f.rect(lx - 2, ly - 8, 5, 1, P.stone);
      f.rect(lx - 1, ly - 7, 3, 2, P.stoneLit);
      f.set(lx, ly - 6, P.stoneDark);
      f.rect(lx - 2, ly - 5, 5, 1, P.stone);
      f.rect(lx, ly - 4, 1, 4, P.stoneShade);
      f.rect(lx - 1, ly, 3, 1, P.stone);
    });

    // the Torii of Peace: two pillars, a black kasagi with upturned ends over
    // the shimaki, a plaque on its strut, the nuki through the pillars, black
    // sleeves at the feet, all standing on stones in the water
    const T_H = 46; // height from the water to the top of the kasagi
    const T_HALF = 24; // half the kasagi's length
    const toriiL = layer(w, h, (f) => {
      const top = TORII_Y - T_H;
      const span = 13; // pillar centres at toriiX ± span
      // kasagi: black, three pixels deep, sweeping up into the ends
      for (let dx = -T_HALF; dx <= T_HALF; dx++) {
        const u = Math.abs(dx) / T_HALF;
        const lift = Math.round(u * u * u * 4);
        const thick = u > 0.88 ? 4 : 3;
        f.vline(toriiX + dx, top - lift, top - lift + thick - 1, P.kasagi);
        if (u < 0.82) f.set(toriiX + dx, top - lift, P.kasagiHi);
      }
      // shimaki
      f.hline(toriiX - 20, toriiX + 20, top + 3, P.shuLit);
      f.hline(toriiX - 20, toriiX + 20, top + 4, P.shu);
      f.hline(toriiX - 19, toriiX + 19, top + 5, P.shuShade);
      // gakuzuka with the plaque
      f.rect(toriiX - 1, top + 6, 3, 9, P.shu);
      f.rect(toriiX - 3, top + 7, 7, 7, P.plaqueRim);
      f.rect(toriiX - 2, top + 8, 5, 5, P.plaque);
      // pillars, leaning in a touch (the step hides behind the nuki), lit from
      // the right; four pixels wide, so the right one sits a pixel further
      // out to stay symmetric about the plaque
      for (const side of [-1, 1]) {
        const px = toriiX + side * span + (side > 0 ? 1 : 0);
        for (let y = top + 6; y < TORII_Y - 1; y++) {
          const lean = y < top + 16 ? -side : 0;
          const x = px + lean;
          const black = y >= TORII_Y - 7;
          f.set(x - 2, y, black ? P.kasagi : P.shuDeep);
          f.set(x - 1, y, black ? P.kasagi : P.shuShade);
          f.set(x, y, black ? P.kasagi : P.shu);
          f.set(x + 1, y, black ? P.kasagiHi : P.shuLit);
        }
        // stone footing in the water
        f.rect(px - 4, TORII_Y - 1, 8, 2, P.stoneShade);
        f.hline(px - 4, px + 3, TORII_Y - 1, P.stone);
      }
      // nuki, poking out past the pillars, with its wedges
      f.hline(toriiX - 18, toriiX + 18, top + 16, P.shuLit);
      f.hline(toriiX - 18, toriiX + 18, top + 17, P.shu);
      f.hline(toriiX - 17, toriiX + 17, top + 18, P.shuShade);
      for (const side of [-1, 1])
        f.vline(toriiX + side * (span + 3), top + 16, top + 17, P.kasagi);
    });

    // reflections of the shore and torii, mirrored about their own waterlines
    const nearAll = layer(w, h, (f) => {
      f.over(nearL);
      f.over(toriiL);
    });
    const nearRefl = layer(w, h, (f) => {
      const mirror = (src: Frame, x: number, base: number, k: number) => {
        for (let y = base; y < h; y++) {
          const sy = 2 * base - y - 1;
          if (sy < 0 || !src.opaque(x, sy)) continue;
          f.set(
            x,
            y,
            lerpRGB(lake.get(x, y), src.get(x, sy), k - (y - base) / 80)
          );
        }
      };
      // the shore's waterline in each column is just under its lowest stone
      // (or step); past the tip of the promontory the maple overhangs the
      // water, mirrored about the tip's waterline
      const waterline = (x: number) => {
        let y = h - 1;
        while (y > HORIZON && !nearL.opaque(x, y)) y--;
        return y + 1;
      };
      const tip = Math.max(0, toriiX - 44);
      for (let x = Math.max(0, toriiX - 60); x < w; x++) {
        const base = waterline(Math.max(x, tip));
        mirror(nearL, x, base, 0.6);
        // a skirt tucked up under the stones: the breeze shifts the rows
        // sideways, and the ragged waterline mustn't let the lake show through
        if (f.opaque(x, base))
          for (let y = base - 3; y < base; y++) f.set(x, y, f.get(x, base));
      }
      // the torii, standing in the water in front, about its own feet
      for (
        let x = Math.max(0, toriiX - T_HALF);
        x <= Math.min(w - 1, toriiX + T_HALF);
        x++
      )
        mirror(toriiL, x, TORII_Y + 1, 0.72);
    });

    // maple branch hanging in from the top-left corner
    const reach = Math.min(70, w * 0.17);
    const branchL = layer(w, 40, (f) => {
      const twig = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        thick: number
      ) => {
        f.line(x0, y0, x1, y1, P.bark);
        if (thick > 1) f.line(x0, y0 - 1, x1, y1 - 1, P.barkL);
      };
      twig(-2, 3, reach * 0.55, 12, 2);
      twig(reach * 0.55, 12, reach, 17, 1);
      twig(reach * 0.3, 8, reach * 0.42, 20, 1);
      twig(reach * 0.62, 13, reach * 0.75, 6, 1);
      const pal: Leafy = { d: P.momijiD, m: P.momiji, l: P.momijiL };
      for (const [bx, by, r] of [
        [reach * 0.18, 6, 6],
        [reach * 0.42, 14, 6],
        [reach * 0.4, 22, 5],
        [reach * 0.72, 8, 5],
        [reach * 0.9, 19, 6],
        [reach * 0.62, 18, 4],
      ] as const) {
        autumnCanopy(
          f,
          (x, y) => (x - bx) ** 2 + ((y - by) / 0.6) ** 2 < r * r,
          () => pal,
          {
            seed: Math.round(bx * 7 + by),
            y0: by - r,
            y1: by + r,
            x0: bx - r - 2,
            x1: bx + r + 2,
            size: 1.7,
            step: 2,
          }
        );
      }
    });

    // ---------- moving things ----------
    // the pirate ship: drifts right to left; clicks add a burst of speed
    const SHIP_PERIOD = 52_000;
    // from bowsprit off the right edge to the end of its wake off the left
    const shipSpan = w + 160;
    const boosts: number[] = [];
    let settled = 0; // boosts long finished, folded into a constant
    const shipX = (t: number) => {
      let extra = settled;
      for (const b of boosts)
        if (t > b) extra += 46 * (1 - Math.exp(-(t - b) / 1400));
      // phased so the still frame (reduced motion renders t = 6000) has the ship mid-lake
      const p = ((t - 6000) / SHIP_PERIOD) * shipSpan + w * 0.5 + 100 + extra;
      return Math.round(w + 70 - (((p % shipSpan) + shipSpan) % shipSpan));
    };
    const ship = new Frame(70, 50);
    let tootAt = -Infinity;
    const TOOT_MS = 2600;

    const SHIP_L = 40;
    function drawShip(s: Frame, t: number) {
      // in its own little frame: bow at x=8, waterline at y=40
      s.clear();
      const x0 = 8;
      const wl = 40;
      const L = SHIP_L;
      const deck = (dx: number) => {
        // gunwale: a rising beakhead at the bow, a dip amidships, a tall stern castle
        const u = dx / L;
        if (u < 0.12) return wl - 6 - Math.round((0.12 - u) * 18);
        if (u > 0.76) return wl - 11;
        if (u > 0.68) return wl - 8;
        return wl - 5;
      };
      for (let dx = 0; dx < L; dx++) {
        const x = x0 + dx;
        const top = deck(dx);
        const bot = wl + (dx < 3 ? -2 : dx < 7 ? 0 : 1);
        const castle = dx > L * 0.68;
        for (let y = top; y <= bot; y++) {
          let c = P.hull;
          if (y === top) c = P.trim;
          else if (y === wl - 3 && dx > 5) c = P.trimDark;
          else if (y >= wl) c = P.keel;
          else if (y < wl - 3) c = castle ? P.cabin : P.hullLit;
          if (
            castle &&
            y > top + 1 &&
            y < wl - 4 &&
            dx % 3 === 1 &&
            (y - top) % 3 === 0
          )
            c = P.window;
          s.set(x, y, c);
        }
        // gun ports along the hull
        if (dx > 7 && dx < L * 0.66 && dx % 4 === 0) s.set(x, wl - 1, P.trim);
      }
      s.hline(x0 + Math.round(L * 0.76), x0 + L, wl - 12, P.trimDark);
      // stern lantern, the steam whistle and the figurehead
      s.set(x0 + L, wl - 14, P.trim);
      s.set(x0 + L, wl - 13, P.trimDark);
      s.vline(x0 + L - 5, wl - 14, wl - 13, P.trim);
      s.set(x0, wl - 9, P.trim);
      s.set(x0 - 1, wl - 8, P.trim);
      // bowsprit
      s.line(x0 + 2, wl - 8, x0 - 6, wl - 13, P.mast);
      // masts, yards and square sails filled by the breeze
      const masts = [
        [10, 25],
        [20, 29],
        [30, 21],
      ] as const;
      for (const [i, [mx, mh]] of masts.entries()) {
        const x = x0 + mx;
        const top = wl - 5 - mh;
        s.vline(x, top, deck(mx) - 1, P.mast);
        const sails = i === 2 ? 1 : 2;
        for (let k = 0; k < sails; k++) {
          const sy = top + 3 + k * 9;
          const sw = 3 + k + (i === 1 ? 1 : 0);
          s.hline(x - sw - 1, x + sw + 1, sy - 1, P.mast);
          for (let yy = 0; yy < 7; yy++) {
            const inset = yy === 6 ? 1 : 0;
            for (let xx = -sw + inset; xx <= sw - inset; xx++) {
              const c = xx === -sw + inset || yy === 6 ? P.sailShade : P.sail;
              s.set(x + xx, sy + yy, c);
            }
          }
        }
        // a pennant streaming back from each masthead
        const pc = [P.pennantA, P.pennantB, P.pennantC][i]!;
        for (let k = 1; k <= 4; k++)
          s.set(
            x + k,
            top +
              Math.round(Math.sin(t / 180 + k * 0.9 + i) * 0.7) +
              (k > 2 ? 1 : 0),
            pc
          );
      }
      // rigging: forestay, the stays between the mastheads, and down to the stern
      s.line(x0 - 6, wl - 13, x0 + 10, wl - 30, P.rope);
      s.line(x0 + 10, wl - 30, x0 + 20, wl - 34, P.rope);
      s.line(x0 + 20, wl - 34, x0 + 30, wl - 26, P.rope);
      s.line(x0 + 30, wl - 26, x0 + L, wl - 14, P.rope);
      // passengers at the rail
      for (let k = 0; k < 6; k++) {
        const px = x0 + 6 + k * 4;
        if (px === x0 + 10 || px === x0 + 22) continue;
        s.set(
          px,
          deck(px - x0) - 1,
          [P.coatA, P.coatC, P.coatD, P.coatB][k % 4]!
        );
        s.set(px, deck(px - x0) - 2, P.hair);
      }
    }

    function shipAt(t: number) {
      const x = shipX(t);
      const bob = Math.round(Math.sin(t / 1100));
      return { x, y: SHIP_Y + bob };
    }

    // Owakudani's plumes: billows of steam, lit from the right, dissolving as they rise
    let eruptAt = -Infinity;
    function billow(f: Frame, x: number, y: number, r: number, fade: number) {
      const rr = r * r;
      for (let dy = -Math.ceil(r); dy <= r; dy++) {
        for (let dx = -Math.ceil(r); dx <= r; dx++) {
          if (dx * dx + dy * dy * 1.25 > rr) continue;
          const l = (dx - dy) / r;
          const c = l > 0.35 ? P.steam0 : l < -0.55 ? P.steam2 : P.steam1;
          if (fade >= 1) f.set(x + dx, y + dy, c);
          else f.blend(x + dx, y + dy, c, fade);
        }
      }
    }
    const ERUPT_MS = 5100; // the last billow of a big puff has gone by then
    const ages = new Float32Array(9);
    function steam(f: Frame, t: number) {
      for (const [vi, v] of vents.entries()) {
        const n = ages.length;
        // each billow rises from its vent (p = 0) and thins out as it goes
        // (p = 1); the oldest (highest) are drawn first so the fresh ones sit
        // in front
        const base = t / 7000 + vi * 0.37;
        for (let k = 0; k < n; k++) ages[k] = (base + k / n) % 1;
        ages.sort().reverse();
        for (const p of ages) {
          const r =
            p < 0.55 ? 1.5 + p * 6 : 4.8 * (1 - (p - 0.55) / 0.45) ** 0.7;
          if (r < 0.8) continue;
          const x = v.x + p * p * 22 + Math.sin(p * 5 + vi * 2) * 1.2;
          const y = v.y - 2 - p * 30;
          billow(f, x, y, r, 1);
        }
      }
      const age = t - eruptAt;
      if (age < ERUPT_MS) {
        for (let i = 13; i >= 0; i--) {
          const p = (age / 5000) * 1.5 - i * 0.04;
          if (p < 0 || p > 1) continue;
          const r = p < 0.6 ? 2.5 + p * 12 : 9.7 * (1 - (p - 0.6) / 0.4) ** 0.7;
          if (r > 0.8)
            billow(
              f,
              scarX + p * p * 34 + Math.sin(i * 1.7) * 2,
              scarY + 8 - p * 62,
              r,
              1
            );
        }
      }
    }

    // the ropeway: two cables from the lakeside up over the scar to the ridge,
    // sagging a little between
    // (on a narrow screen the shrine's cedars stand in front of the ridge,
    // so the line stops short of them, where its gondolas can still be seen)
    const cableTop = Math.min(kamX + 26, toriiX - 34);
    const cableA = {
      x0: kamX - Math.min(110, w * 0.3),
      y0: HORIZON - 6,
      x1: cableTop,
      y1: Math.round(kamTop(cableTop)) + 1,
    };
    const cableY = (x: number, off: number) => {
      const u = (x - cableA.x0) / (cableA.x1 - cableA.x0);
      return (
        cableA.y0 +
        (cableA.y1 - cableA.y0) * u +
        Math.sin(u * Math.PI) * 3 +
        off
      );
    };
    // The whole line runs on rope time, which stands still while the
    // trio's gondola is held over Owakudani for the black egg: it slows to
    // a stop in STOP_IN, hangs there, and picks up again over STOP_OUT.
    const ROPE_MS = 26_000; // from the bottom of the line to the top
    const STOP_IN = 450;
    const STOP_OUT = 900;
    const STOP_FOR = 6700; // from the click until it's back up to speed
    let ropeLag = 0; // rope time lost to stops long finished
    let stopAt = -Infinity;
    /** Rope time lost `a` ms into a stop. */
    function lagOf(a: number) {
      if (a <= 0) return 0;
      if (a < STOP_IN) return (a * a) / (2 * STOP_IN);
      const held = STOP_FOR - STOP_OUT;
      if (a < held) return STOP_IN / 2 + a - STOP_IN;
      const u = Math.min(a, STOP_FOR) - held;
      return STOP_IN / 2 + held - STOP_IN + u - (u * u) / (2 * STOP_OUT);
    }
    const ropeT = (t: number) => t - ropeLag - lagOf(t - stopAt);
    /** The gondolas swinging on their grips when the line stops and starts. */
    function sway(t: number) {
      const a = t - stopAt;
      if (a < 0 || a > STOP_FOR + 1500) return 0;
      const jolt = (s: number) =>
        s < 0 ? 0 : Math.sin(s / 150) * 1.6 * Math.exp(-s / 700);
      return Math.round(jolt(a - 200) - jolt(a - (STOP_FOR - 300)) * 0.7);
    }
    const ropeLen = cableA.x1 - cableA.x0;
    // the trio's gondola is the second one going up
    function trioAt(t: number) {
      const p = (((ropeT(t) / ROPE_MS + 0.25) % 1) + 1) % 1;
      const x = Math.round(cableA.x0 + p * ropeLen);
      const y = Math.round(cableY(x, 0));
      // they come out of the trees at the bottom and go over the ridge at
      // the top, so they fade in and out at the ends of the line
      return { x, y, a: Math.min(1, (Math.min(p, 1 - p) * ropeLen) / 6) };
    }
    function trioGondola(f: Frame, t: number, a = 1) {
      const g = trioAt(t);
      const alpha = Math.min(a, g.a);
      if (alpha <= 0) return;
      const age = t - belchAt;
      const phew = age > 3500 && age < 6600;
      const rows = phew
        ? Math.floor(age / 140) % 2
          ? GONDOLA_PHEW
          : GONDOLA_PHEW2
        : GONDOLA;
      const rock = phew ? Math.round(Math.sin(age / 110) * 0.8) : 0;
      const sx = sway(t) + rock;
      const col: Record<string, RGB> = {
        k: P.gondolaLine,
        R: P.gondolaA,
        r: P.gondolaLit,
        g: P.glass,
        s: P.skin,
        B: P.gondolaB,
        b: P.gondolaShade,
        M: P.manHair,
        J: P.hoodie,
        W: P.womanHair,
        w: P.sweater,
        p: P.pom,
        Y: P.kidHat,
      };
      for (let ry = 0; ry < rows.length; ry++) {
        const row = rows[ry]!;
        // the hanger leans as it swings
        const lean = ry < 2 ? Math.round((sx * ry) / 2) : sx;
        for (let rx = 0; rx < row.length; rx++) {
          const c = col[row[rx]!];
          if (c === undefined) continue;
          f.dset(g.x - 3 + rx + lean, g.y + ry, c, alpha);
        }
      }
    }
    function ropeway(f: Frame, t: number) {
      for (
        let x = Math.max(0, Math.round(cableA.x0));
        x <= Math.min(w - 1, cableA.x1);
        x++
      ) {
        f.blend(x, Math.round(cableY(x, 0)), P.cable, 0.4);
        f.blend(x, Math.round(cableY(x, 3)), P.cable, 0.4);
      }
      const rt = ropeT(t);
      const sx = sway(t);
      for (let k = 0; k < 4; k++) {
        for (const [dir, off] of [
          [1, 0],
          [-1, 3],
        ] as const) {
          if (k === 1 && dir > 0) continue; // the trio's, drawn on its own
          const p =
            ((((rt / ROPE_MS) * dir + k / 4 + (dir < 0 ? 0.12 : 0)) % 1) + 1) %
            1;
          const gx = Math.round(cableA.x0 + p * ropeLen);
          if (gx < 0 || gx >= w) continue;
          const gy = Math.round(cableY(gx, off));
          const a = Math.min(1, (Math.min(p, 1 - p) * ropeLen) / 6);
          const c = k % 2 ? P.gondolaA : P.gondolaB;
          f.blend(gx, gy + 1, P.cable, 0.6 * a);
          for (let dy = 2; dy < 4; dy++)
            for (let dx = -1; dx <= 1; dx++)
              f.blend(gx + dx + sx, gy + dy, c, a);
        }
      }
      trioGondola(f, t);
    }

    // ---------- easter egg: Owakudani's black egg ----------
    // Click the trio's gondola and the line stops with them hanging over
    // the valley. Owakudani lets rip: a great sulphur-yellow cloud rolls up
    // the hill and swallows them, stink lines wobbling out of it, and the
    // whole valley goes faintly yellow. Out of the top pops a kuro-tamago, an
    // egg boiled black in the springs, much too big; it bounces off the lake,
    // cracks, the shell falls away and the white egg inside lets out a puff
    // of steam. The air clears, the three of them reappear flapping at the
    // window, and the line runs on.
    const BELCH_MS = 7600;
    let belchAt = -Infinity;
    const belching = (t: number) => t - belchAt >= 0 && t - belchAt < BELCH_MS;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const ease = (v: number) => {
      const c = clamp01(v);
      return c * c * (3 - 2 * c);
    };
    const easeOut = (v: number) => 1 - (1 - clamp01(v)) ** 2;
    const R0 = Math.max(10, Math.min(19, w * 0.06)); // a big billow of the cloud
    const SRC = { x: scarX + 1, y: scarY + 8 };
    const TOP_Y = 9 + R0 * 0.4; // the top of the cloud at its biggest
    const fume = new Frame(w, HORIZON);
    const ROLL = 16;
    // the heap of cloud boiling up, in tiers that narrow towards the top
    const TIERS = [5, 5, 4, 4, 3];
    const TOWER = TIERS.reduce((a, b) => a + b, 0);
    const pb = new Float32Array((ROLL + TOWER) * 4);
    const pOrder: number[] = [];
    /** Where the cloud rolls to (the trio's gondola) and where it boils up. */
    function belchGeom(t: number) {
      const g = trioAt(t);
      const gx = g.x;
      const gy = g.y + 4;
      const dx = gx - SRC.x;
      const dy = gy - SRC.y;
      // the column goes up just past the vents, towards the gondola
      const mx = SRC.x + dx * 0.25;
      const my = SRC.y + dy * 0.25 - R0 * 0.4;
      return { gx, gy, dx, dy, mx, my };
    }
    /** A round billow of cloud, lit from the upper right. */
    function puff(
      f: Frame,
      x: number,
      y: number,
      r: number,
      lit: RGB,
      mid: RGB,
      shade: RGB,
      deep: RGB,
      alpha = 1
    ) {
      const xi = Math.round(x);
      const yi = Math.round(y);
      const R = Math.ceil(r);
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const nx = dx / r;
          const ny = (dy * 1.1) / r;
          const d = nx * nx + ny * ny;
          if (d > 1) continue;
          // a bright, rounded cap, shadowed underneath, a darker rim low on
          // the left
          const l = nx * 0.4 - ny * 0.8 + Math.sqrt(1 - d) * 0.4 - 0.12;
          const c =
            l > 0.42
              ? lit
              : l > -0.2
                ? mid
                : d > 0.7 && l < -0.55
                  ? deep
                  : shade;
          f.dset(xi + dx, yi + dy, c, alpha);
        }
      }
    }
    /** Draws the cloud into `fume`; false if there's none. */
    function belch(t: number) {
      const a = t - belchAt;
      if (a < 0 || a > 6800) return false;
      fume.clear();
      const { dx, dy, mx, my } = belchGeom(t);
      const dl = Math.hypot(dx, dy) || 1;
      const nx = -dy / dl;
      const ny = dx / dl;
      // thinning out and drifting off at the end
      const out = ease((a - 3900) / 2700);
      const driftX = -out * R0 * 1.6;
      const driftY = -out * R0 * 1.4;
      let n = 0;
      const add = (x: number, y: number, r: number, k: number) => {
        if (r < 1) return;
        pb[n * 4] = x;
        pb[n * 4 + 1] = y;
        pb[n * 4 + 2] = r;
        pb[n * 4 + 3] = k;
        n++;
      };
      // the cloud rolling up the slope from the vents to the gondola
      const front = 1.35 * easeOut((a - 120) / 1300);
      for (let i = 0; i < ROLL; i++) {
        const lam = (i / (ROLL - 1)) * 1.25;
        const grow = easeOut((front - lam) / 0.4);
        if (grow <= 0) continue;
        const j = (hash2(i, 1, 311) - 0.5) * 2;
        add(
          SRC.x + dx * lam + nx * j * R0 * 0.6 + driftX * (0.5 + lam * 0.5),
          SRC.y +
            dy * lam +
            ny * j * R0 * 0.6 -
            R0 * 0.35 * lam +
            (1 - grow) * 4 +
            driftY,
          R0 * (0.55 + hash2(i, 2, 311) * 0.45) * grow * (1 - out * 0.45),
          i
        );
      }
      // and a great heap boiling up out of it, leaning out over the lake
      let i = 0;
      for (let tier = 0; tier < TIERS.length; tier++) {
        const eta = (tier + 1) / TIERS.length;
        const cnt = TIERS[tier]!;
        const q = easeOut((a - 250 - eta * 1000) / 1100);
        const cy = my + (TOP_Y - my) * eta;
        const cxx = mx - eta * R0 * 1.7;
        const half = R0 * (1.9 - eta * 1.2);
        for (let k = 0; k < cnt; k++, i++) {
          if (q <= 0) continue;
          const u = cnt > 1 ? k / (cnt - 1) - 0.5 : 0;
          const tx = cxx + u * 2 * half + (hash2(i, 3, 311) - 0.5) * R0 * 0.5;
          const ty =
            cy + (hash2(i, 5, 311) - 0.5) * R0 * 0.5 + Math.abs(u) * R0 * 0.5;
          const r =
            R0 *
            (0.85 - eta * 0.1) *
            (0.8 + hash2(i, 4, 311) * 0.4) *
            (0.35 + 0.65 * q) *
            (1 - out * 0.45);
          add(
            mx + (tx - mx) * q + driftX * (1 + eta),
            my + (ty - my) * q + driftY * (1 + eta),
            r,
            i + ROLL
          );
        }
      }
      if (!n) return false;
      // the highest billows first, so the lower ones sit in front
      pOrder.length = 0;
      for (let k = 0; k < n; k++) pOrder.push(k);
      pOrder.sort((p, q) => pb[p * 4 + 1]! - pb[q * 4 + 1]!);
      for (const k of pOrder)
        puff(
          fume,
          pb[k * 4]!,
          pb[k * 4 + 1]!,
          pb[k * 4 + 2]!,
          P.fumeLit,
          P.fume,
          P.fumeShade,
          P.fumeDeep,
          // the billows clear one by one at the end
          1 - ease((out - 0.1 - hash2(pb[k * 4 + 3]!, 6, 311) * 0.7) / 0.18)
        );
      return true;
    }
    /** A wobbly stink line rising from (x, y), fading as it goes. */
    function stinkLine(
      f: Frame,
      x: number,
      y: number,
      life: number,
      i: number
    ) {
      if (life <= 0 || life >= 1) return;
      const len = 13;
      const rise = life * 12;
      const fade = Math.min(1, life * 5, (1 - life) * 3);
      for (let k = 0; k < len; k++) {
        const xx =
          x + Math.round(Math.sin(k * 0.8 - life * 16 + i * 1.7) * 1.4);
        const yy = Math.round(y - rise - k);
        const a = fade * (1 - k / 20);
        f.dset(xx, yy, P.stink, a);
        f.dset(xx + 1, yy, P.stinkL, a * 0.8);
      }
    }
    function stink(f: Frame, t: number) {
      const a = t - belchAt;
      const { mx, my } = belchGeom(t);
      // wafting off the cloud
      for (let i = 0; i < 6; i++) {
        const side = i % 2 ? 1 : -1;
        const hgt = 0.25 + (i >> 1) * 0.3;
        const x = Math.round(
          mx - hgt * R0 * 1.3 + side * R0 * (0.9 + hgt * 1.6)
        );
        const y = Math.round(my + (TOP_Y - my) * hgt);
        stinkLine(f, x, y, (a - 1100 - i * 210) / 2000, i);
        stinkLine(f, x - side * 3, y + 2, (a - 2300 - i * 210) / 2000, i + 6);
      }
      // off the gondola, once it's out of the cloud
      const g = trioAt(t);
      const sx = sway(t);
      for (let i = 0; i < 3; i++) {
        stinkLine(
          f,
          g.x - 4 + i * 3 + sx,
          g.y + 2,
          (a - 3700 - i * 260) / 1700,
          i
        );
        stinkLine(
          f,
          g.x - 3 + i * 3 + sx,
          g.y + 2,
          (a - 4600 - i * 260) / 1700,
          i + 3
        );
      }
    }
    /** The sulphur haze over everything, `k` of the way to yellow. */
    function haze(f: Frame, k: number) {
      if (k <= 0.004) return;
      const ki = Math.round(k * 256);
      const px = f.pixels;
      const fr = (P.fume >> 16) & 0xff;
      const fg = (P.fume >> 8) & 0xff;
      const fb = P.fume & 0xff;
      for (let i = 0; i < px.length; i++) {
        const p = px[i]!;
        const r = p & 0xff;
        const g = (p >>> 8) & 0xff;
        const b = (p >>> 16) & 0xff;
        px[i] =
          (0xff000000 |
            ((b + (((fb - b) * ki) >> 8)) << 16) |
            ((g + (((fg - g) * ki) >> 8)) << 8) |
            (r + (((fr - r) * ki) >> 8))) >>>
          0;
      }
    }
    const hazeAt = (a: number) =>
      0.22 * ease((a - 400) / 1300) * (1 - ease((a - 4200) / 1800));

    // The egg itself, much bigger than life, drawn about its centre (cx, cy)
    // and turned by `rot`. Part 0 is the whole egg (cracking down the middle
    // as `crack` goes to 1), 1 the white egg inside, 2 and 3 the left and
    // right halves of the shell.
    const EGG_A = 10;
    const EGG_B = 13;
    const crackU = (v: number) =>
      (Math.abs((((v % 6) + 6) % 6) - 3) - 1.5) * 1.1;
    function drawEgg(
      f: Frame,
      cx: number,
      cy: number,
      s: number,
      sq: number,
      rot: number,
      crack: number,
      part: 0 | 1 | 2 | 3,
      clipY = Infinity,
      pivot = 0
    ) {
      const A = EGG_A * s * (1 + (1 - sq) * 0.7) * (part === 1 ? 0.9 : 1);
      const B = EGG_B * s * sq * (part === 1 ? 0.93 : 1);
      const R = Math.ceil(Math.max(A * 1.15, B) + Math.abs(pivot)) + 1;
      const cs = Math.cos(rot);
      const sn = Math.sin(rot);
      const x0 = Math.round(cx);
      const y0 = Math.round(cy);
      for (let y = -R; y <= R; y++) {
        const sy = y0 + y;
        if (sy >= clipY || sy < 0 || sy >= h) continue;
        for (let x = -R; x <= R; x++) {
          // turned about (pivot, 0), so a half of the shell swings about
          // its own middle
          const u = cs * (x - pivot) + sn * y + pivot;
          const v = -sn * (x - pivot) + cs * y;
          const nyv = v / B;
          if (nyv < -1 || nyv > 1) continue;
          const wv = A * (1 + (part === 1 ? 0.06 : 0.12) * nyv);
          const nxv = u / wv;
          const d = nxv * nxv + nyv * nyv;
          if (d > 1) continue;
          const cut = crackU(v);
          if (part === 2 && u >= cut) continue;
          if (part === 3 && u < cut) continue;
          const nz = Math.sqrt(1 - d);
          const l = nxv * 0.5 - nyv * 0.5 + nz * 0.7;
          let c: RGB;
          if (part === 1) {
            // boiled white, a soft shadow down the left
            c = l > 0.95 ? P.flash : l > 0.35 ? P.eggWhite : P.eggWhiteShade;
          } else {
            // the shell, glossy black, lit from the upper right
            c =
              l > 0.97
                ? P.eggShine
                : l > 0.87
                  ? P.eggHi
                  : l > 0.62
                    ? P.egg2
                    : l > 0.15
                      ? P.egg1
                      : P.egg0;
            if (d > 0.7 && nxv > 0.55 && nyv > -0.3) c = P.egg2; // the lake's light
            if (part === 0 && crack > 0) {
              // the crack opening from the top down, white showing through
              if (Math.abs(u - cut) < 0.8 && nyv < -1 + 2.4 * crack)
                c = P.eggWhite;
            } else if (part > 1 && Math.abs(u - cut) < 1) c = P.egg2; // the broken edge
          }
          f.set(x0 + x, sy, c);
        }
      }
    }
    // the egg's flight: out of the top of the cloud, over, off the lake once
    // and down again, closer, getting bigger as it comes
    const POP = 2200;
    const APEX = 2550;
    const HIT1 = 3150;
    const HIT2 = 3700;
    const CRACK = 4150;
    const BURST = 4600;
    const SINK = 6500;
    const GONE = 7300;
    const L1 = { x: SRC.x - 10, y: HORIZON + 15 };
    const L2 = { x: SRC.x - 28, y: HORIZON + 34 };
    /** Squash on landing, then a little stretch back up. */
    const squash = (s: number) =>
      s < 0 || s > 380
        ? 1
        : s < 90
          ? 1 - (s / 90) * 0.3
          : s < 230
            ? 0.7 + ((s - 90) / 140) * 0.42
            : 1.12 - ((s - 230) / 150) * 0.12;
    /** Where the egg pops out of the cloud (its bottom). */
    function popPoint() {
      const { mx } = belchGeom(belchAt + POP);
      return { x: mx - R0 * 0.8, y: TOP_Y + R0 * 1.4 };
    }
    function eggState(t: number) {
      const a = t - belchAt;
      const p0 = popPoint();
      const pk = { x: p0.x - 6, y: 4 + EGG_B * 1.1 };
      let x: number;
      let bottom: number; // where the bottom of the egg is
      let s: number;
      let rot = 0;
      let sq = 1;
      if (a < APEX) {
        const u = easeOut((a - POP) / (APEX - POP));
        x = p0.x + (pk.x - p0.x) * u;
        bottom = p0.y + (pk.y - p0.y) * u;
        // popping out: a quick swell
        const pop = clamp01((a - POP) / 160);
        s = 0.55 * pop + (pop < 1 ? 0.2 * Math.sin(pop * Math.PI) : 0);
      } else if (a < HIT1) {
        const u = (a - APEX) / (HIT1 - APEX);
        x = pk.x + (L1.x - pk.x) * u;
        bottom = pk.y + (L1.y - pk.y) * u * u;
        s = 0.55 + 0.27 * u;
        rot = Math.PI * 2 * ease(u);
      } else if (a < HIT2) {
        const u = (a - HIT1) / (HIT2 - HIT1);
        x = L1.x + (L2.x - L1.x) * u;
        bottom = L1.y + (L2.y - L1.y) * u - 70 * u * (1 - u);
        s = 0.82 + 0.18 * u;
        rot = -Math.PI * 2 * ease(u);
        sq = squash(a - HIT1);
      } else {
        x = L2.x;
        bottom = L2.y;
        s = 1;
        sq = squash(a - HIT2);
        // rocking to a stop, then shivering as it cracks
        rot = 0.3 * Math.sin((a - HIT2) / 75) * Math.exp(-(a - HIT2) / 260);
        if (a > CRACK + 150 && a < BURST) x += Math.floor(a / 45) % 2 ? 1 : -1;
      }
      const B = EGG_B * s * sq;
      return { x, cy: bottom - B, s, sq, rot };
    }
    /** A crown of spray where something hits the water, and a ring. */
    function crown(f: Frame, x: number, y: number, age: number, size: number) {
      if (age < 0 || age > 900) return;
      const a = age / 1000;
      for (let i = 0; i < 18; i++) {
        const side = i % 2 ? 1 : -1;
        const vx = side * (6 + hash2(i, 1, 331) * 30) * size;
        const vy = -(24 + hash2(i, 2, 331) * 34) * size;
        const px = x + side * size * 5 + vx * a;
        const py = y + vy * a + 120 * a * a;
        if (py > y + 1) continue;
        f.set(Math.round(px), Math.round(py), i % 3 ? P.wake : P.flash);
        if (a < 0.4) f.set(Math.round(px), Math.round(py) + 1, P.waterHi2);
      }
      const r = 4 + a * 30 * size;
      const al = 0.9 * (1 - a / 0.9);
      for (let k = 0; k < 48; k++) {
        const ang = (k / 48) * Math.PI * 2;
        f.blend(
          Math.round(x + Math.cos(ang) * r),
          Math.round(y + Math.sin(ang) * r * 0.28),
          P.wake,
          al
        );
      }
    }
    // the halves of the shell: falling away to either side
    const half = (side: number, sa: number) => ({
      dx: side * (sa * 26 + 2),
      dy: -18 * sa + 70 * sa * sa,
      rot: side * Math.min(1.9, sa * 5),
    });
    // when each half lands flat in the lake (s after the burst)
    const HALF_LAND = (18 + Math.sqrt(18 * 18 + 4 * 70 * EGG_B * 0.5)) / 140;
    function blackEgg(f: Frame, t: number) {
      const a = t - belchAt;
      if (a < POP || a > GONE + 900) return;
      const wl = L2.y + 2; // the waterline round it on the lake
      const restY = L2.y - EGG_B;
      // the splashes
      crown(f, L1.x, L1.y, a - HIT1, 0.8);
      crown(f, L2.x, L2.y, a - HIT2, 1);
      for (const side of [-1, 1])
        crown(
          f,
          L2.x + half(side, HALF_LAND).dx + side * 4,
          wl,
          a - BURST - HALF_LAND * 1000,
          0.45
        );
      if (a > GONE) return;
      const e = eggState(t);
      const onWater = a >= HIT2;
      if (a < POP + 300) {
        // pop! a burst of little lines round it as it comes out
        const p0 = popPoint();
        const q = (a - POP) / 300;
        for (let k = 0; k < 8; k++) {
          const ang = (k / 8) * Math.PI * 2 + 0.3;
          const r1 = 4 + q * 10;
          for (let j = 0; j < 3; j++)
            f.dset(
              Math.round(p0.x + Math.cos(ang) * (r1 + j)),
              Math.round(p0.y - 5 + Math.sin(ang) * (r1 + j) * 0.85),
              j === 2 ? P.fumeShade : P.fumeDeep,
              1 - q
            );
        }
      }
      if (onWater) {
        // its reflection, dark in the water under it
        const hw0 = EGG_A * 0.9;
        const deep = a > SINK ? ease((a - SINK) / (GONE - SINK)) : 0;
        const col = a > BURST ? P.eggWhiteShade : P.egg1;
        for (let k = 1; k < 10; k++) {
          const hw = Math.round(hw0 * (1 - k / 16) * (1 - deep));
          const wob = Math.round(Math.sin(k * 1.3 + t / 160));
          for (let x = -hw; x <= hw; x++)
            f.blend(Math.round(e.x) + x + wob, wl + k, col, 0.55 - k * 0.05);
        }
      }
      if (a < BURST) {
        drawEgg(
          f,
          e.x,
          e.cy,
          e.s,
          e.sq,
          e.rot,
          clamp01((a - CRACK) / 300),
          0,
          onWater ? wl : Infinity
        );
      } else {
        const sa = (a - BURST) / 1000;
        // the white egg, bobbing, and sinking at the end
        const down =
          a > SINK
            ? ((a - SINK) / (GONE - SINK)) ** 1.5 * 30
            : Math.round(Math.sin(sa * 4) * 0.6);
        const pop = sa < 0.25 ? -Math.sin((sa / 0.25) * Math.PI) * 3 : 0;
        drawEgg(f, e.x, restY + 1 + down + pop, 1, 1, 0, 1, 1, wl);
        // the two halves of the shell falling away into the lake
        for (const side of [-1, 1]) {
          const hv = half(side, sa);
          if (sa > 1) continue;
          drawEgg(
            f,
            e.x + hv.dx,
            restY + hv.dy,
            1,
            1,
            hv.rot,
            1,
            side < 0 ? 2 : 3,
            wl,
            side * EGG_A * 0.5
          );
        }
        // the puff of steam it lets out
        for (let i = 0; i < 12; i++) {
          const p = (a - BURST - 60 - i * 55) / 1700;
          if (p <= 0 || p >= 1) continue;
          const ang = -Math.PI / 2 + (hash2(i, 7, 337) - 0.5) * 2.2;
          const dist = easeOut(p * 1.3) * (8 + hash2(i, 5, 337) * 16);
          const r =
            (p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8) *
            (4 + hash2(i, 6, 337) * 4.5);
          if (r < 0.8) continue;
          puff(
            f,
            e.x + Math.cos(ang) * dist * 1.2,
            restY - 2 + Math.sin(ang) * dist - p * 22,
            r,
            P.steam0,
            P.steam0,
            P.steam1,
            P.steam2
          );
        }
        // a twinkle off the white
        const tw = (a - BURST - 450) / 700;
        if (tw > 0 && tw < 1) {
          const arm = Math.round(Math.sin(tw * Math.PI) * 3);
          const sx = Math.round(e.x) + 9;
          const sy = Math.round(restY + down) + 2;
          f.set(sx, sy, P.flash);
          for (let k = 1; k <= arm; k++) {
            const c = k === arm ? P.yuzu : P.yuzuLit;
            f.set(sx + k, sy, c);
            f.set(sx - k, sy, c);
            f.set(sx, sy + k, c);
            f.set(sx, sy - k, c);
          }
        }
      }
      // foam round it on the water
      if (onWater && a < SINK + 500)
        for (let x = -10; x <= 10; x++)
          if ((x + Math.floor(t / 180)) % 3)
            f.set(Math.round(e.x) + x, wl, P.wake);
    }

    /** Banks of morning mist sitting on a line, puffy on top, drifting. */
    function mist(
      f: Frame,
      t: number,
      y: number,
      thick: number,
      x0: number,
      x1: number,
      seed: number,
      speed: number
    ) {
      for (let x = Math.max(0, x0); x < Math.min(w, x1); x++) {
        const n = fbm1((x + t * speed) / 26, seed, 3);
        const edge = Math.min(1, (x - x0) / 20, (x1 - x) / 20);
        const hgt = Math.round((n - 0.48) * thick * 4 * edge);
        if (hgt < 1) continue;
        for (let k = 0; k <= hgt; k++)
          f.blend(x, y - k, P.mist, k === hgt ? 0.4 : 0.66);
      }
    }

    // swan pedal boats bobbing by the shore on the left
    const swans = [
      { x: Math.round(w * 0.05) + 4, y: 139, ph: 0 },
      { x: Math.round(w * 0.05) + 22, y: 143, ph: 2 },
    ];
    function swan(f: Frame, x: number, y: number, t: number, ph: number) {
      const b = Math.round(Math.sin(t / 900 + ph) * 0.6);
      y += b;
      // body
      f.hline(x, x + 9, y - 1, P.swan);
      f.hline(x - 1, x + 10, y, P.swan);
      f.hline(x, x + 9, y + 1, P.swanShade);
      f.hline(x + 2, x + 6, y - 2, P.swanSeat);
      f.set(x + 8, y - 2, P.swan);
      f.set(x + 9, y - 3, P.swan);
      // neck and head
      f.vline(x, y - 6, y - 1, P.swan);
      f.set(x + 1, y - 7, P.swan);
      f.set(x, y - 7, P.swan);
      f.set(x - 1, y - 6, P.beak);
      f.set(x + 1, y - 6, P.swanShade);
      // reflection
      for (let k = 2; k < 5; k++)
        f.hline(
          x - 1 + (k & 1),
          x + 9 - (k & 1),
          y + k,
          lerpRGB(P.water3, P.swan, 0.4 - k * 0.06)
        );
    }

    // a kite (the bird) wheeling high over the lake
    function kite(f: Frame, t: number) {
      const a = t / 5200;
      const x = Math.round(cx - 20 + Math.cos(a) * Math.min(60, w * 0.15));
      const y = Math.round(22 + Math.sin(a) * 8);
      const tilt = Math.round(Math.sin(a) * 1);
      f.hline(x - 1, x + 1, y, P.kite);
      f.set(x - 2, y - tilt, P.kite);
      f.set(x + 2, y + tilt, P.kite);
      f.set(x - 3, y - tilt, P.kite);
      f.set(x + 3, y + tilt, P.kite);
      f.set(x, y + 1, P.kite);
    }

    // people on the steps queueing for their photo under the torii
    let photoAt = -Infinity;
    const PHOTO_MS = 1600; // the wave for the camera
    function people(f: Frame, t: number, hover: boolean) {
      const spots = [
        { x: toriiX - 3, y: TORII_Y - 4, c: P.coatB, pose: true },
        { x: toriiX + 6, y: TORII_Y - 10, c: P.coatA, pose: false },
        { x: toriiX + 9, y: TORII_Y - 14, c: P.coatC, pose: false },
        { x: toriiX + 2, y: TORII_Y - 6, c: P.coatD, pose: false },
      ];
      for (const [i, s] of spots.entries()) {
        const shuffle =
          i > 0 ? Math.round(Math.sin(t / 2400 + i * 2) * 0.6) : 0;
        const x = s.x + shuffle;
        f.rect(x, s.y - 5, 2, 4, s.c);
        f.rect(x, s.y - 1, 2, 1, P.coatD);
        f.rect(x, s.y - 7, 2, 2, P.hair);
        // the one under the torii waves for the camera
        if (s.pose && (hover || t - photoAt < PHOTO_MS))
          f.set(x + 2, s.y - 7 - (Math.floor(t / 200) % 2), s.c);
      }
      // the photographer on the rocks, phone held up
      const age = t - photoAt;
      const px = toriiX - 19;
      const py = shoreTop(px);
      f.rect(px, py - 5, 2, 4, P.coatC);
      f.rect(px, py - 7, 2, 2, P.hair);
      f.rect(px, py - 1, 2, 1, P.coatD);
      f.set(px + 2, py - 6, P.coatD);
      if (age < 260) {
        f.set(px + 2, py - 6, P.flash);
        for (let k = 1; k < 4; k++) {
          f.blend(px + 2 + k, py - 6, P.flash, 0.8 - k * 0.2);
          f.blend(px + 2 - k, py - 6, P.flash, 0.8 - k * 0.2);
          f.blend(px + 2, py - 6 + k, P.flash, 0.8 - k * 0.2);
          f.blend(px + 2, py - 6 - k, P.flash, 0.8 - k * 0.2);
        }
      }
    }

    // leaves drifting down
    const drift = Array.from(
      { length: Math.max(5, Math.round(w / 55)) },
      (_, i) => ({
        x: hash2(i, 1, 71) * w,
        speed: 0.006 + hash2(i, 2, 71) * 0.006,
        off: hash2(i, 3, 71) * 200,
        c: [P.momiji, P.momijiL, P.ginkgo][i % 3]!,
      })
    );
    function leaf(f: Frame, x: number, y: number, c: RGB, flip: number) {
      if (flip === 0) f.hline(x, x + 1, y, c);
      else if (flip === 1) {
        f.set(x, y, c);
        f.set(x + 1, y + 1, c);
      } else f.vline(x, y, y + 1, c);
    }
    function leafBurst(t0: number, x0: number, y0: number) {
      const seed = Math.round(t0) % 991;
      fx.add(t0, 5200, (f, age) => {
        const a = age / 1000;
        for (let i = 0; i < 22; i++) {
          const delay = hash2(i, 1, seed) * 0.6;
          const s = a - delay;
          if (s < 0) continue;
          const x =
            x0 +
            (hash2(i, 2, seed) - 0.5) * 14 +
            s * (4 + hash2(i, 3, seed) * 8) +
            Math.sin(s * 3 + i) * 3;
          const y =
            y0 +
            (hash2(i, 4, seed) - 0.5) * 6 +
            s * (12 + hash2(i, 5, seed) * 8);
          if (y > h) continue;
          leaf(
            f,
            Math.round(x),
            Math.round(y),
            [P.momiji, P.momijiL, P.ginkgo, P.momijiHi][i % 4]!,
            Math.floor(age / 160 + i) % 3
          );
        }
      });
    }

    // ---------- easter egg: the capybara onsen ----------
    // A little rotenburo built of boulders at the tip of the promontory,
    // under the maple, where three capybaras soak up to their necks with yuzu
    // bobbing round them (the capybara hot spring is a real thing, down the
    // road in Izu). Click it and all three duck under, the pool goes off
    // like a geyser and showers yuzu all over the lake, and the capybaras
    // come up out there among them, each wearing one, and go for a swim in a
    // line before climbing back into the warm.
    const PX = toriiX - 38; // the pool's centre
    const WL = TORII_Y - 6; // the heads' lowest row; the water starts below it
    const X0 = PX - 16;
    const X1 = PX + 16;
    // two grown-ups and a youngster, nose to nose with one of them
    const capys = [
      { x: PX - 14, flip: true, blink: 0, rows: CAPY, swim: SWIM },
      { x: PX - 4, flip: false, blink: 2700, rows: CAPY_PUP, swim: SWIM_PUP },
      { x: PX + 5, flip: false, blink: 5300, rows: CAPY, swim: SWIM },
    ];
    const YUZU_MS = 7600;
    let yuzuAt = -Infinity;
    const yuzuShow = (t: number) => t - yuzuAt >= 0 && t - yuzuAt < YUZU_MS;
    const DUNK = 250; // sinking
    const GEYSER = 300; // the pool goes up
    const SWIM0 = 950; // the first one surfaces out on the lake
    const GAP = 380; // and the others behind
    const LOOP = 4600; // once round
    const swimEnd = (i: number) => SWIM0 + i * GAP + LOOP;
    const backAt = (i: number) => swimEnd(i) + 300; // up again in the pool
    const BACK = 250; // coming up
    const offAt = (i: number) => 7000 + i * 120; // the yuzu rolls off
    /** How far a head is sunk (6 is under), and its yuzu. */
    function headState(i: number, t: number) {
      const a = t - yuzuAt;
      let sink = 0;
      let yuzuOn = false;
      let roll = -1;
      if (a >= 0 && a < YUZU_MS) {
        const d = a - i * 90;
        if (d < 0) sink = 0;
        else if (d < DUNK) sink = Math.round((d / DUNK) * 6);
        else if (a < backAt(i)) sink = 6;
        else if (a < backAt(i) + BACK) {
          const p = (a - backAt(i)) / BACK;
          sink = Math.round((1 - p) * 6) - (p > 0.6 && p < 0.95 ? 1 : 0);
          yuzuOn = true;
        } else if (a < offAt(i)) yuzuOn = true;
        else if (a < offAt(i) + 300) roll = (a - offAt(i)) / 300;
      }
      return { sink, yuzuOn, roll };
    }
    const wearing = (i: number, t: number) => headState(i, t).yuzuOn;

    function boulder(
      f: Frame,
      x: number,
      bottom: number,
      bw: number,
      bh: number
    ) {
      // rounded, lit from the upper right like everything else here
      for (let dy = 0; dy < bh; dy++)
        for (let dx = 0; dx < bw; dx++) {
          if (dy === 0 && (dx === 0 || dx === bw - 1)) continue;
          let c = P.boulder;
          if (dy === 0 || (dy === 1 && dx >= bw - 2)) c = P.boulderLit;
          else if (dx === 0 || dy === bh - 1) c = P.boulderShade;
          f.set(x + dx, bottom - bh + 1 + dy, c);
        }
      f.set(x, bottom, P.boulderDark);
    }
    // the rim in front of the water, kept apart so whatever floats in the
    // pool can be drawn behind it
    const onsenFront = layer(w, h, (f) => {
      // a lower rim of rounded stones in front, the ends tucked round
      for (let x = X0 - 2, k = 0; x <= X1 + 1; k++) {
        const bw = 3 + Math.round(hash2(k, 3, 93) * 3);
        boulder(f, x, WL + 5, bw, 2 + (hash2(k, 4, 93) > 0.55 ? 1 : 0));
        x += bw;
      }
      boulder(f, X0 - 2, WL + 3, 3, 4);
      boulder(f, X1, WL + 3, 3, 4);
    });
    const onsenL = layer(w, h, (f) => {
      // big dark boulders piled up behind the water
      for (let x = X0 - 1, k = 0; x <= X1; k++) {
        const bw = 4 + Math.round(hash2(k, 1, 93) * 3);
        boulder(f, x, WL, bw, 2 + Math.round(hash2(k, 2, 93) * 2));
        x += bw - 1;
      }
      // the water, darker in the shade of the rocks
      for (let y = WL + 1; y <= WL + 3; y++)
        f.hline(X0, X1, y, y === WL + 1 ? P.onsenDeep : P.onsen);
      f.over(onsenFront);
    });
    const onsenTop = WL - 7;
    const onsenBot = WL + 5;

    function capyHead(f: Frame, i: number, t: number) {
      const c = capys[i]!;
      const { sink, yuzuOn, roll } = headState(i, t);
      if (sink >= 5) return;
      const blink = (t + c.blink) % 6400 < 420; // a slow, contented blink
      const rows = c.rows;
      const cw = rows[0]!.length;
      const top = WL - rows.length + 1 + sink;
      const col: Record<string, RGB> = {
        h: P.capyLit,
        m: P.capy,
        d: P.capyShade,
        e: P.capyEar,
        E: blink ? P.capyShade : P.capyEye,
        n: P.capyEar,
      };
      for (let ry = 0; ry < rows.length; ry++) {
        const y = top + ry;
        if (y > WL) break; // under the water
        const row = rows[ry]!;
        for (let rx = 0; rx < row.length; rx++) {
          const cc = col[row[rx]!];
          if (cc === undefined) continue;
          f.set(c.flip ? c.x + cw - 1 - rx : c.x + rx, y, cc);
        }
      }
      // the water lapping round its neck
      if (sink <= 0) {
        f.set(c.x, WL + 1, P.onsenHi);
        f.set(c.x + cw - 1, WL + 1, P.onsenHi);
      }
      // the yuzu, balanced on top of its head
      const yx = c.flip ? c.x + cw - 4 : c.x + 2;
      if (yuzuOn) yuzu(f, yx, top - 1);
      else if (roll >= 0) {
        // rolling off the back of its head into the water
        const back = c.flip ? -1 : 1;
        yuzu(
          f,
          Math.round(yx + back * roll * 5),
          Math.round(top - 1 + roll * roll * (WL + 2 - top))
        );
      }
    }

    function yuzu(f: Frame, x: number, bottom: number) {
      f.set(x, bottom - 1, P.yuzuLit);
      f.set(x + 1, bottom - 1, P.yuzu);
      f.set(x, bottom, P.yuzu);
      f.set(x + 1, bottom, P.yuzuShade);
    }

    function ring(f: Frame, x: number, p: number) {
      // a ripple spreading over the pool's little surface
      const r = 1 + p * 6;
      for (let k = 0; k < 16; k++) {
        const ang = (k / 16) * Math.PI * 2;
        const px = Math.round(x + Math.cos(ang) * r);
        const py = Math.round(WL + 2 + Math.sin(ang) * r * 0.3);
        if (px >= X0 && px <= X1 && py >= WL + 1 && py <= WL + 3)
          f.blend(px, py, P.onsenHi, 0.8 * (1 - p));
      }
    }

    function drawOnsen(f: Frame, t: number) {
      blit(f, onsenL, X0 - 3, onsenTop, X1 + 4, onsenBot + 1);
      // the front stones mirrored in the lake
      for (let d = 1; d <= 3; d++) {
        const y = onsenBot + d;
        for (let x = X0 - 2; x <= X1 + 3; x++) {
          if (!onsenL.opaque(x, onsenBot + 1 - d)) continue;
          f.set(
            x,
            y,
            lerpRGB(
              f.get(x, y),
              onsenL.get(x, onsenBot + 1 - d),
              0.4 - d * 0.08
            )
          );
        }
      }
      // glints sliding on the water
      for (let k = 0; k < 3; k++) {
        const x = X0 + 1 + Math.round((t / 90 + k * 37) % (X1 - X0 - 2));
        if (Math.sin(t / 500 + k * 2) > 0.2)
          f.set(x, WL + 3 - (k % 2), P.onsenHi);
      }
      // ripples from them ducking under and coming back up, and the pool
      // boiling up before it goes off
      const sa = t - yuzuAt;
      if (sa >= 0 && sa < YUZU_MS) {
        for (let i = 0; i < capys.length; i++) {
          const mx = capys[i]!.x + (capys[i]!.rows[0]!.length >> 1);
          const d = sa - i * 90;
          if (d >= 0 && d < 900) ring(f, mx, d / 900);
          const b = sa - backAt(i);
          if (b >= 0 && b < 900) ring(f, mx, b / 900);
          const o = sa - offAt(i) - 300;
          if (o >= 0 && o < 900)
            ring(f, mx + (capys[i]!.flip ? -4 : 4), o / 900);
        }
        if (sa > DUNK && sa < SWIM0)
          for (let k = 0; k < 12; k++)
            if (hash2(k, Math.floor(sa / 70), 7) > 0.4)
              f.set(X0 + 2 + k * 2.5, WL + 1 + (k % 3), P.onsenHi);
      }
      // the heads
      for (let i = 0; i < capys.length; i++) capyHead(f, i, t);
      // the yuzu nobody's wearing, drifting round the pool
      const free = 3 - capys.filter((_, i) => wearing(i, t)).length;
      for (let k = 0; k < free; k++) {
        const u = Math.sin(t / (6100 + k * 1700) + k * 2.4) * 0.5 + 0.5;
        const lo = k === 1 ? X0 + 1 : k === 0 ? X0 + 1 : PX + 1;
        const hi = k === 1 ? X1 - 2 : k === 0 ? PX - 2 : X1 - 2;
        const x = Math.round(lo + (hi - lo) * u);
        const bob = Math.sin(t / 800 + k * 2) > 0.7 ? 1 : 0;
        yuzu(f, x, (k === 1 ? WL + 3 : WL + 2) + bob);
      }
      // the front rim again, over anything bobbing low in the water
      blit(f, onsenFront, X0 - 2, WL, X1 + 3, onsenBot + 1);
      // steam curling up off the water and drifting downwind
      // three wavy wisps, like the onsen sign, each coming and going
      for (let i = 0; i < 3; i++) {
        const x0 = PX - 9 + i * 9;
        const life = Math.sin(t / (2300 + i * 500) + i * 2);
        if (life < -0.3) continue;
        const len = 7 + Math.round((life + 0.3) * 4);
        for (let k = 0; k < len; k++) {
          const x = x0 + Math.round(Math.sin((k - t / 160) / 2.2 + i) * 1.2);
          const a = 0.85 * (1 - k / len) * Math.min(1, (life + 0.3) * 2);
          f.blend(x + Math.floor(k / 6), WL - 3 - k, P.steam0, a);
        }
      }
    }
    const onOnsen = (x: number, y: number) =>
      x >= X0 - 2 && x <= X1 + 2 && y >= WL - 9 && y <= WL + 5;

    // the pool going off: a column of steam shooting up out of it
    function geyser(f: Frame, t: number) {
      const a = t - yuzuAt - GEYSER;
      if (a < 0 || a > 2600) return;
      // the jet itself, for a moment
      if (a < 700) {
        const top =
          WL - 2 - easeOut(a / 250) * 46 * (1 - ease((a - 450) / 250));
        for (let y = Math.round(top); y < WL + 1; y++)
          for (let dx = -2; dx <= 2; dx++)
            if (Math.abs(dx) < 2 || (y + dx + Math.floor(a / 60)) % 3)
              f.set(PX + dx, y, Math.abs(dx) < 1 ? P.flash : P.steam1);
      }
      for (let i = 0; i < 14; i++) {
        const p = (a - i * 80) / 1900;
        if (p <= 0 || p >= 1) continue;
        const r =
          (p < 0.25 ? 2 + (p / 0.25) * 5 : 7 * (1 - (p - 0.25) / 0.75) ** 0.8) *
          (0.8 + hash2(i, 1, 403) * 0.5);
        if (r < 0.8) continue;
        puff(
          f,
          PX + Math.sin(p * 5 + i) * 3 + p * p * 16,
          WL - 4 - easeOut(p) * 64 - (i % 3) * 3,
          r,
          P.steam0,
          P.steam0,
          P.steam1,
          P.steam2
        );
      }
    }

    // and the lake itself turning into one big yuzu bath round it: milky
    // jade water spreading out from the pool, steaming, then going back
    const BATH_RX = Math.max(80, Math.min(260, w * 0.5));
    function bath(f: Frame, t: number) {
      const a = t - yuzuAt;
      const k = easeOut((a - GEYSER) / 1400) * (1 - ease((a - 5200) / 2000));
      if (k <= 0.01) return;
      const rx = BATH_RX * k;
      const ry = rx * 0.32;
      const cy = WL + 3;
      const px = f.pixels;
      const tr = (P.onsen >> 16) & 0xff;
      const tg = (P.onsen >> 8) & 0xff;
      const tb = P.onsen & 0xff;
      const y0 = Math.max(HORIZON + 1, Math.floor(cy - ry));
      const y1 = Math.min(h - 1, Math.ceil(cy + ry * 1.6));
      for (let y = y0; y <= y1; y++) {
        // squashed more below the pool, where the lake comes towards us
        const dy = (y - cy) / (y > cy ? ry * 1.6 : ry);
        const span = rx * Math.sqrt(Math.max(0, 1 - dy * dy));
        const xa = Math.max(0, Math.floor(PX - span));
        const xb = Math.min(w - 1, Math.ceil(PX + span));
        for (let x = xa; x <= xb; x++) {
          const dx = (x - PX) / rx;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d >= 1) continue;
          // a ragged, dithered edge
          if (d > 0.82 && !dither(x, y, (1 - d) / 0.18)) continue;
          const m = Math.round((0.6 - d * 0.26) * 256);
          const i = y * w + x;
          const q = px[i]!;
          const r = q & 0xff;
          const g = (q >>> 8) & 0xff;
          const b = (q >>> 16) & 0xff;
          px[i] =
            (0xff000000 |
              ((b + (((tb - b) * m) >> 8)) << 16) |
              ((g + (((tg - g) * m) >> 8)) << 8) |
              (r + (((tr - r) * m) >> 8))) >>>
            0;
        }
      }
      // wisps of steam curling up off it
      for (let i = 0; i < 9; i++) {
        const u = hash2(i, 1, 409) * 2 - 1;
        const v = hash2(i, 2, 409) * 2 - 1;
        const wx = PX + u * rx * 0.8;
        const wy = cy + v * ry * (v > 0 ? 1.3 : 0.8);
        if (wy <= HORIZON + 2) continue;
        const life = Math.sin(t / (1300 + i * 170) + i * 2);
        if (life < -0.2) continue;
        const len = 5 + Math.round((life + 0.2) * 4);
        for (let j = 0; j < len; j++) {
          const x = wx + Math.round(Math.sin((j - t / 150) / 2 + i) * 1.1);
          const al = 0.8 * (1 - j / len) * Math.min(1, (life + 0.2) * 2) * k;
          f.blend(x, wy - 1 - j, P.steam0, al);
        }
      }
    }

    // the yuzu it throws out all over the lake
    const SPREAD = Math.max(56, Math.min(170, w * 0.36));
    const flung = Array.from(
      { length: Math.round(SPREAD / 3) + 12 },
      (_, j) => {
        const lx = X0 - 6 - hash2(j, 1, 401) * SPREAD;
        const ly = HORIZON + 9 + hash2(j, 2, 401) ** 0.8 * (h - HORIZON - 13);
        const dist = Math.hypot(lx - PX, ly - WL);
        return {
          lx,
          ly,
          launch: GEYSER + 30 + hash2(j, 3, 401) * 420,
          flight: 600 + dist * 4 + hash2(j, 4, 401) * 250,
          apex: 22 + hash2(j, 5, 401) * 34 + dist * 0.15,
          sink: 5000 + hash2(j, 6, 401) * 1800,
          drift: (hash2(j, 7, 401) - 0.6) * 0.003,
          big: ly > HORIZON + 22,
        };
      }
    );
    function yuzuBall(f: Frame, x: number, y: number, big: boolean) {
      x = Math.round(x);
      y = Math.round(y);
      if (!big) {
        yuzu(f, x, y);
        return;
      }
      f.hline(x, x + 1, y - 2, P.yuzuLit);
      f.set(x + 2, y - 2, P.yuzu);
      f.set(x - 1, y - 1, P.yuzu);
      f.hline(x, x + 1, y - 1, P.yuzuLit);
      f.set(x + 2, y - 1, P.yuzu);
      f.set(x - 1, y, P.yuzuShade);
      f.hline(x, x + 1, y, P.yuzu);
      f.set(x + 2, y, P.yuzuShade);
      f.hline(x, x + 1, y + 1, P.yuzuShade);
    }
    /** The flung yuzu: in the air (`flying`), or bobbing on the lake. */
    function drawFlung(f: Frame, t: number, flying: boolean) {
      const a = t - yuzuAt;
      if (a < 0 || a >= YUZU_MS) return;
      for (const y of flung) {
        const s = (a - y.launch) / y.flight;
        if (s < 0) continue;
        if (s < 1) {
          if (!flying) continue;
          const yy = WL - 3 + (y.ly - WL + 3) * s - 4 * y.apex * s * (1 - s);
          yuzuBall(f, PX + (y.lx - PX) * s, yy, true);
          continue;
        }
        if (flying) continue;
        const on = a - y.launch - y.flight; // ms since it landed
        const x = y.lx + on * y.drift;
        // a plop as it lands, and another as it goes under at the end
        if (on < 500) {
          const r = 1 + (on / 500) * 6;
          for (let k = 0; k < 14; k++) {
            const ang = (k / 14) * Math.PI * 2;
            f.blend(
              Math.round(x + 1 + Math.cos(ang) * r),
              Math.round(y.ly + 1 + Math.sin(ang) * r * 0.3),
              P.wake,
              0.9 * (1 - on / 500)
            );
          }
          if (on < 160) {
            f.set(Math.round(x) - 1, Math.round(y.ly - 2 - on / 40), P.wake);
            f.set(Math.round(x) + 3, Math.round(y.ly - 3 - on / 50), P.wake);
          }
        }
        if (a > y.sink + 300) continue;
        const bob = Math.sin(t / 700 + y.lx) > 0.6 ? 1 : 0;
        if (a > y.sink) f.set(Math.round(x), Math.round(y.ly), P.yuzu);
        else yuzuBall(f, x, y.ly + bob, y.big);
      }
    }

    // the three of them out on the lake, swimming once round in a line,
    // out of the side of the pool and back (above the swans)
    const LRX = Math.max(24, Math.min(60, w * 0.16));
    const LRY = 7;
    const LCX = X0 - 5 - LRX;
    const LCY = WL + 2;
    function swimmers(f: Frame, t: number) {
      const a = t - yuzuAt;
      if (a < SWIM0 || a > swimEnd(2) + 300) return;
      const col: Record<string, RGB> = {
        h: P.capyLit,
        m: P.capy,
        d: P.capyShade,
        e: P.capyEar,
        E: P.capyEye,
        n: P.capyEar,
      };
      for (let i = capys.length - 1; i >= 0; i--) {
        const c = capys[i]!;
        const ms = a - SWIM0 - i * GAP;
        if (ms < 0 || ms > LOOP) continue;
        const phi = (ms / LOOP) * Math.PI * 2;
        const x = LCX + LRX * Math.cos(phi);
        const y = Math.round(LCY - LRY * Math.sin(phi));
        const right = Math.sin(phi) < 0; // heading back along the near side
        // surfacing at the start, ducking under at the end
        const sink = Math.round(
          4 * (1 - Math.min(1, ms / 220, (LOOP - ms) / 220))
        );
        const rows = c.swim;
        const cw = rows[0]!.length;
        const x0 = Math.round(x - cw / 2);
        // the wake, a V spreading out behind
        const vx = -LRX * Math.sin(phi);
        const vy = -LRY * Math.cos(phi);
        const vl = Math.hypot(vx, vy) || 1;
        const tail = right ? x0 : x0 + cw - 1;
        for (let k = 1; k < 12; k++) {
          const bx = tail - (vx / vl) * k;
          const by = y + 1 - (vy / vl) * k * 0.5;
          const spread = k * 0.45;
          const al = 0.85 * (1 - k / 12);
          f.blend(Math.round(bx), Math.round(by - spread * 0.5), P.wake, al);
          f.blend(Math.round(bx), Math.round(by + spread * 0.7), P.wake, al);
        }
        // the head and back, above the water
        for (let ry = 0; ry < rows.length; ry++) {
          const yy = y - rows.length + 1 + ry + sink;
          if (yy > y) break;
          const row = rows[ry]!;
          for (let rx = 0; rx < cw; rx++) {
            const cc = col[row[rx]!];
            if (cc === undefined) continue;
            f.set(right ? x0 + cw - 1 - rx : x0 + rx, yy, cc);
          }
        }
        // water lapping round it
        f.set(x0 - 1, y + 1, P.wake);
        f.hline(x0, x0 + cw - 1, y + 1, P.waterHi2);
        f.set(x0 + cw, y + 1, P.wake);
        // and the yuzu it came up wearing
        if (sink < 3) {
          const hx = right ? x0 + cw - 5 : x0 + 2;
          yuzu(f, hx, y - rows.length + sink);
        }
      }
    }

    // ---------- hit areas ----------
    const CAPY_SPOT = { x: PX - 1, y: WL - 1 };
    // the trio's gondola (with a finger's slack round it for a tap)
    const TRIO_R = 7;
    const trioSpot = (t: number) => {
      const g = trioAt(t);
      return { x: g.x + sway(t), y: g.y + 4 };
    };
    /** Whether the trio's gondola can be seen (not fading in or out at
     * the ends of the line, nor behind the ship's sails). */
    const shipChk = new Frame(70, 50);
    const trioShown = (t: number) => {
      const g = trioAt(t);
      if (g.a < 0.35) return false;
      const s = shipAt(t);
      const ox = s.x - 8;
      const oy = s.y - 40;
      if (g.x + 4 < ox || g.x - 4 > ox + 70 || g.y + 7 < oy) return true;
      drawShip(shipChk, t);
      let hid = 0;
      for (let y = g.y; y < g.y + 7; y++)
        for (let x = g.x - 3; x <= g.x + 3; x++)
          if (shipChk.opaque(x - ox, y - oy)) hid++;
      return hid < 16;
    };
    const onTrio = (x: number, y: number, t: number, slack: number) => {
      if (!trioShown(t)) return false;
      const g = trioSpot(t);
      return Math.hypot(x - g.x, y - g.y) <= TRIO_R + slack;
    };
    const onShip = (x: number, y: number, t: number) => {
      const s = shipAt(t);
      return (
        x >= s.x - 7 && x <= s.x + SHIP_L + 2 && y >= s.y - 36 && y <= s.y + 2
      );
    };
    // the scar and its plumes, which drift off downwind to the right
    const onSteam = (x: number, y: number) =>
      x > scarX - 16 && x < scarX + 24 && y > scarY - 30 && y < scarY + 20;
    const onTorii = (x: number, y: number) =>
      Math.abs(x - toriiX) <= T_HALF && y >= TORII_Y - T_H - 4 && y <= TORII_Y;
    const onTrees = (x: number, y: number) =>
      (y < 40 && branchL.opaque(x, y)) ||
      (nearL.opaque(x, y) && y < TORII_Y - 6 && !onTorii(x, y));
    const onWater = (x: number, y: number) =>
      y > HORIZON + 1 &&
      !nearAll.opaque(x, y) &&
      !(x > toriiX - 44 && y > shoreTop(x) - 1);
    let pointerT = 0;

    return {
      render(f, t, pointer) {
        pointerT = t;
        f.copyFrom(back);
        // clouds drift across the sky behind Fuji and the hills
        const co = Math.round(t / 900) % w;
        const cp = cloudLayer.pixels;
        const dst = f.pixels;
        for (let y = 0; y < cloudLayer.h; y++) {
          for (let x = 0; x < w; x++) {
            if (y >= skyEnd[x]!) continue;
            const p = cp[y * w + ((x - co + w) % w)]!;
            if (p >>> 24) dst[y * w + x] = p;
          }
        }
        kite(f, t);
        mist(f, t, HORIZON - 4, 4, -20, kamX + 20, 83, 0.004);
        ropeway(f, t);
        steam(f, t);
        const belchOn = belching(t);
        const fumeOn = belchOn && belch(t);
        if (fumeOn) {
          blit(f, fume, 0, 0, w, HORIZON);
          // the gondola coming back out of the cloud
          const ba = t - belchAt;
          if (ba > 3500) trioGondola(f, t, clamp01((ba - 3500) / 600));
        }
        if (belchOn) stink(f, t);
        // the lake: reflections nudged row by row by the breeze
        const src = lake.pixels;
        for (let y = HORIZON; y < h; y++) {
          const d = y - HORIZON;
          const o = Math.round(Math.sin(y * 0.9 + t / 420) * (0.6 + d / 16));
          const row = y * w;
          if (o === 0) dst.set(src.subarray(row, row + w), row);
          else if (o > 0) {
            dst.set(src.subarray(row + o, row + w), row);
            dst.fill(src[row + w - 1]!, row + w - o, row + w);
          } else {
            dst.set(src.subarray(row, row + w + o), row - o);
            dst.fill(src[row]!, row, row - o);
          }
        }
        if (yuzuShow(t)) bath(f, t);
        // the cloud, mirrored in the lake
        if (fumeOn) {
          const fp = fume.pixels;
          for (let y = HORIZON; y < h; y++) {
            const k = 0.5 - (y - HORIZON) / 60;
            if (k <= 0) break;
            const srow = (2 * HORIZON - 1 - y) * w;
            const o = Math.round(
              Math.sin(y * 0.9 + t / 420) * (0.6 + (y - HORIZON) / 16)
            );
            for (let x = Math.max(0, -o); x < Math.min(w, w - o); x++) {
              const p = fp[srow + x + o]!;
              if (p >>> 24)
                f.blend(
                  x,
                  y,
                  ((p & 0xff) << 16) | (p & 0xff00) | ((p >>> 16) & 0xff),
                  k
                );
            }
          }
        }
        mist(f, t, HORIZON, 5, -20, toriiX - 30, 82, 0.006);
        // glints on the ripples
        for (let i = 0; i < Math.round(w / 6); i++) {
          const y =
            HORIZON +
            2 +
            Math.floor(Math.pow(hash2(i, 1, 91), 1.4) * (h - HORIZON - 3));
          const life = Math.sin(t / 700 + hash2(i, 2, 91) * 40);
          if (life < 0.45) continue;
          const depth = (y - HORIZON) / (h - HORIZON);
          const len = 1 + Math.round(hash2(i, 3, 91) * (2 + depth * 6));
          const x = Math.round(
            hash2(i, 4, 91) * w + Math.sin(t / 2600 + i) * 3
          );
          f.hline(x, x + len, y, life > 0.85 ? P.waterHi : P.waterHi2);
        }
        // the ship, its reflection and wake
        const s = shipAt(t);
        drawShip(ship, t);
        const sx0 = s.x - 8;
        const sy0 = s.y - 40;
        for (let k = 0; k < 14; k++) {
          // wake: two widening lines trailing off the stern
          const wx = s.x + SHIP_L + k * 3;
          const spread = Math.round(k * 0.45);
          if ((k + Math.floor(t / 300)) % 4 === 0) continue;
          f.set(wx, s.y + 1 + spread, P.wake);
          f.set(wx + 1, s.y + 1 - Math.round(spread * 0.3), P.waterHi2);
        }
        for (let y = 0; y < 41; y++) {
          const ty = s.y + 1 + (40 - y);
          if (ty >= h) continue;
          const wob = Math.round(Math.sin(ty * 0.9 + t / 300) * 1.2);
          const fade = 0.45 - (40 - y) / 120;
          for (let x = 0; x < 70; x++) {
            if (!ship.opaque(x, y)) continue;
            const tx = sx0 + x + wob;
            if (tx < 0 || tx >= w || ty < HORIZON) continue;
            f.set(tx, ty, lerpRGB(f.get(tx, ty), ship.get(x, y), fade));
          }
        }
        f.over(ship, sx0, sy0);
        // bow wave
        f.set(s.x - 1, s.y + 1, P.wake);
        f.set(s.x - 2, s.y + 2, P.waterHi2);
        // toot! puffs from the whistle on the stern castle
        const ta = t - tootAt;
        if (ta < TOOT_MS) {
          for (let k = 2; k >= 0; k--) {
            const p = (ta - k * 420) / 1500;
            if (p < 0 || p > 1) continue;
            const r = p < 0.5 ? 1 + p * 6 : 4 * (1 - (p - 0.5) / 0.5) ** 0.7;
            if (r > 0.7)
              billow(f, s.x + SHIP_L - 5 + p * 6, s.y - 15 - p * 14, r, 1);
          }
        }
        // the shrine's shore with its reflection, then the torii
        for (let y = HORIZON; y < h; y++) {
          const o = Math.round(
            Math.sin(y * 0.9 + t / 420) * (0.6 + (y - HORIZON) / 16)
          );
          const row = y * w;
          for (let x = Math.max(0, toriiX - 66); x < w; x++) {
            const sxx = x + o;
            if (sxx < 0 || sxx >= w) continue;
            const p = nearRefl.pixels[row + sxx]!;
            if (p >>> 24) dst[row + x] = p;
          }
        }
        // the people on the steps stand behind the torii
        blit(f, nearL, toriiX - 64, 0, w, TORII_Y + 2);
        people(f, t, !!pointer && onTorii(pointer.x, pointer.y));
        blit(
          f,
          toriiL,
          toriiX - T_HALF,
          TORII_Y - T_H - 5,
          toriiX + T_HALF + 1,
          TORII_Y + 1
        );
        drawOnsen(f, t);
        const showOn = yuzuShow(t);
        if (showOn) {
          geyser(f, t);
          drawFlung(f, t, false);
        }
        for (const sw of swans) swan(f, sw.x, sw.y, t, sw.ph);
        if (showOn) {
          swimmers(f, t);
          drawFlung(f, t, true);
        }
        blit(f, branchL, 0, 0, Math.ceil(reach) + 8, branchL.h);
        for (const d of drift) {
          const y = ((t * d.speed + d.off) % (h + 20)) - 10;
          const x =
            Math.round(d.x + Math.sin(t / 900 + d.off) * 6 + y * 0.15) % w;
          leaf(f, x, Math.round(y), d.c, Math.floor(t / 220 + d.off) % 3);
        }
        fx.draw(f, t);
        if (belchOn) {
          haze(f, hazeAt(t - belchAt));
          blackEgg(f, t);
        }
      },
      poke(x, y, t) {
        if (onTrio(x, y, t, 6)) {
          // the line stops, and Owakudani does its thing (just the once)
          if (!belching(t)) {
            belchAt = t;
            ropeLag += lagOf(t - stopAt);
            stopAt = t;
          }
          return;
        }
        if (onShip(x, y, t)) {
          // every click pushes it on, but a toot already going isn't restarted
          if (t - tootAt >= TOOT_MS) tootAt = t;
          if (boosts.length >= 12) {
            // only drop a boost once it has finished pushing the ship
            if (t - boosts[0]! < 8000) return;
            boosts.shift();
            settled += 46;
          }
          boosts.push(t);
          return;
        }
        if (onSteam(x, y)) {
          if (t - eruptAt >= ERUPT_MS) eruptAt = t;
          return;
        }
        // (the pool's right end reaches under the torii's kasagi)
        if (
          onOnsen(x, y) ||
          Math.hypot(x - CAPY_SPOT.x, y - CAPY_SPOT.y) <= 16
        ) {
          // under they go, and up it goes (not again while it's going)
          if (!yuzuShow(t)) yuzuAt = t;
          return;
        }
        if (onTorii(x, y)) {
          if (t - photoAt >= PHOTO_MS) photoAt = t;
          return;
        }
        if (onTrees(x, y)) {
          leafBurst(t, x, y);
          return;
        }
        if (onWater(x, y)) {
          ripple(fx, t, x, y, P.waterHi, { rings: 3, size: 12, squash: 0.32 });
          splash(fx, t, x, y, P.wake, Math.round(t) % 97);
          return;
        }
        if (y < HORIZON - 30)
          flock(fx, t, x, y, P.duck, { count: 6, seed: Math.round(t) % 89 });
      },
      eggs(t) {
        const out: EggSpot[] = [];
        // the capybaras in the pool
        if (!yuzuShow(t)) out.push({ id: 'capybara', ...CAPY_SPOT, r: 10 });
        // the trio's gondola, wherever it's got to on the line
        if (!belching(t) && trioShown(t)) {
          const g = trioSpot(t);
          out.push({ id: 'black-egg', x: g.x, y: g.y, r: TRIO_R });
        }
        return out;
      },
      hot(x, y) {
        return (
          onTrio(x, y, pointerT, 0) ||
          onShip(x, y, pointerT) ||
          onSteam(x, y) ||
          onTorii(x, y) ||
          onOnsen(x, y) ||
          onTrees(x, y) ||
          onWater(x, y) ||
          y < HORIZON - 30
        );
      },
    };
  },
};
