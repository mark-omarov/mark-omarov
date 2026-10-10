// Nizhnevartovsk in deep winter: an oil town in the West Siberian taiga.
// Northern lights ripple over a wooden izba with carved window frames and a
// smoking chimney; panel blocks and power-station stacks glow on the left,
// a couple of pump jacks nod quietly out in the field and gas flares burn
// orange on the horizon. In front, a little park: a lantern-lit path, a
// few young birches and an old bench under the snow. Now and then a bear in
// a red scarf pedals past on an old roadster, playing the balalaika
// no-hands; a bell on a post by his track calls him.
//
// Click the northern lights to make them surge, the empty sky for a shooting
// star, a window to switch its light, the roof to stoke the stove, a flare to
// make it roar, the trees to shake the snow off their branches.
//
// Eggs. 'bear': ring the bell on the post (or click the bear himself) and he
// comes racing along the track, skids to a stop and plays a rousing tune:
// notes fountain into the sky and the northern lights dance to it, then he
// rings his bell back and rides on. 'bench': click the park bench. A couple
// walks into the snowy park along the path, a woman and a lanky teen come
// from the other side, they hug; they walk arm in arm to the bench and sit
// together, and a big aurora blooms over the whole sky.

import { type Frame, lerpRGB, type RGB } from '../frame';
import { Fx, shootingStar } from '../fx';
import { hash2, noise1, noise2 } from '../noise';
import { glow, gradient, snow } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';
import {
  BELL_POST,
  BENCH,
  TEEN_FRONT,
  TEEN_TOP,
  LEGS_PASS,
  LEGS_STAND,
  LEGS_STRIDE,
  LONG_PASS,
  LONG_STAND,
  LONG_STRIDE,
  MAN_SIT,
  MAN_TOP,
  LADY_SIT,
  LADY_TOP,
  type Sprite,
  spr,
  WOMAN_SIT,
  WOMAN_TOP,
} from '../things/nizhnevartovsk-park';

const P = palette({
  sky0: '#03051a',
  sky1: '#060b24',
  sky2: '#09122e',
  sky3: '#0d1a3a',
  sky4: '#122344',
  sky5: '#1a2b4c',
  horizonWarm: '#4a2c48',
  cityGlow: '#6a3a4a',
  star: '#8a9ccc',
  starHi: '#eef4ff',
  // northern lights
  auroraHem: '#e2ffec',
  aurora0: '#8cffb8',
  aurora1: '#3fe596',
  aurora2: '#1fb98a',
  aurora3: '#1a8c88',
  auroraTop: '#6a52e8',
  auroraPink: '#ff5aa8',
  // far taiga and town
  taiga: '#091022',
  taigaEdge: '#16213c',
  block: '#121a32',
  blockEdge: '#1e2a48',
  blockDark: '#0c1226',
  blockRoof: '#4a5a84',
  winWarm: '#ffc66a',
  winWarm2: '#f2a04e',
  winCool: '#9cc0ff',
  stack: '#2c3254',
  stackHi: '#454c72',
  stackBand: '#7a3446',
  beacon: '#ff3a3a',
  // plume: lit from below by the town
  plumeDark: '#3a3c62',
  plume: '#5c5a80',
  plumeLit: '#8c7890',
  plumeFadeDark: '#232a4c',
  plumeFade: '#30365c',
  plumeFadeLit: '#433f66',
  // oil field
  rig: '#1c2440',
  rigHi: '#3a4670',
  rigLight: '#fff0b8',
  pipe: '#252d4c',
  pipeHi: '#56628e',
  pipeSnow: '#8a9acb',
  jack: '#0a1022',
  // pump jacks: quiet, muted silhouettes in the mid-distance
  pj: '#151b33',
  pjHi: '#34406a',
  pjHead: '#3e2a3c',
  pjHeadHi: '#5c3c48',
  pjRod: '#5a6894',
  pjSnow: '#5e70a8',
  flameCore: '#fffbe0',
  flame0: '#ffe27a',
  flame1: '#ffa632',
  flame2: '#f0602a',
  flame3: '#a8302a',
  flareGlow: '#ff8c3a',
  // snow, far to near
  snowFar: '#2a3760',
  snowFarLit: '#38467a',
  snow1: '#3a4a7c',
  snow1Lit: '#4e5f96',
  snow2: '#4f609a',
  snow2Lit: '#6a7cb6',
  snow3: '#6a7cb4',
  snow3Lit: '#8ea0d4',
  snow4: '#8395cb',
  snow4Lit: '#a9bbe8',
  snowHi: '#d6e2ff',
  snowShadow: '#2e3a68',
  // izba
  logHi: '#7a5444',
  log: '#5a3a34',
  logSh: '#3c2628',
  logEnd: '#b08a64',
  logEndRing: '#7a5a44',
  sideHi: '#4c3236',
  side: '#3a252c',
  sideSh: '#281a22',
  board: '#33201f',
  carve: '#e8ecf6',
  carveSh: '#a8b2cc',
  shutter: '#2e6aa8',
  shutterHi: '#4c8cd0',
  glass: '#141c38',
  glassHi: '#3a5a7a',
  win: '#ffcf70',
  winHi: '#fff0c0',
  winDeep: '#f09a40',
  curtain: '#ffe8b8',
  roofSnow: '#c6d4f4',
  roofSnowHi: '#e8f0ff',
  roofSnowSh: '#8c9cd0',
  icicle: '#bfe4ff',
  brick: '#6a2e2c',
  brickHi: '#8e4436',
  door: '#2a1a1c',
  doorHi: '#4a2e2c',
  lampWarm: '#ffd590',
  lampCone: '#ffb24a',
  shade: '#24443c',
  shadeHi: '#4a7a66',
  glowWarm: '#ffb862',
  // trees
  spruceDark: '#07101a',
  spruce: '#0e1d26',
  spruceLit: '#183034',
  spruceHi: '#244440',
  trunk: '#1a1218',
  birch: '#d8deee',
  birchSh: '#98a2c4',
  birchMark: '#1c1e2c',
  twig: '#4a2c3c',
  twigLit: '#6c4a58',
  // life
  person: '#10121e',
  coat: '#3a2830',
  hat: '#6a564e',
  sled: '#9a3a2a',
  kid: '#2e6aa8',
  dog: '#c8ccd8',
  dogSh: '#7a809a',
  truck: '#262c46',
  truckCab: '#b8642a',
  headlight: '#fff6d8',
  smokeDark: '#3a4268',
  smoke: '#58628a',
  smokeLit: '#7e8cb4',
  smokeFadeDark: '#222a4e',
  smokeFade: '#323a62',
  smokeFadeLit: '#444e78',
  // the bear on his bicycle
  bear: '#6e4630',
  bearSh: '#4a2c2c',
  bearHi: '#8e6040',
  bearOut: '#28141c',
  muzzle: '#c49a6a',
  nose: '#120a0e',
  scarf: '#dc4038',
  scarfSh: '#962c3a',
  balal: '#f0b450',
  balalSh: '#b46a30',
  balalNeck: '#4a2a22',
  balalNeckHi: '#c8824a',
  balalHi: '#ffe0a0',
  balalHole: '#2c1610',
  frame: '#3a78c4',
  frameHi: '#62a0e4',
  frameSh: '#24508c',
  tire: '#12121c',
  spoke: '#8a96bc',
  chrome: '#e2eaf8',
  saddle: '#2a1a1c',
  note: '#ffd88a',
  noteHi: '#fff4d0',
  noteDim: '#b88a5c',
  noteSh: '#2a2240',
  spark: '#ffd27a',
  flake: '#e6eeff',
  flakeDim: '#8a9acc',
  // the park: lanterns, the bench, the bear's bell post
  iron: '#151a2c',
  ironHi: '#3a4466',
  lantern: '#ffe6a8',
  lanternHi: '#fffbe8',
  slat: '#5a3a30',
  slatHi: '#8a5a40',
  post: '#4a3028',
  postHi: '#7a5240',
  sign: '#d8c8a0',
  signHi: '#f4e8c8',
  signEdge: '#3a2420',
  // the people in the park, wrapped up warm
  hair: '#9a6c48', // the man: light brown
  hairHi: '#c49468',
  beard: '#7a5238',
  skin: '#e0a688',
  skinSh: '#a06a5e',
  parka: '#2a2a3a',
  parkaHi: '#4c4c64',
  parkaSh: '#1a1a26',
  manScarf: '#e8802c',
  manScarfSh: '#a8501e',
  jeans: '#2c4a86',
  jeansHi: '#4e70b0',
  boot: '#1a1418',
  womanHair: '#121018', // the woman: near-black
  womanHairHi: '#3a3a52',
  knit: '#ece2cc',
  knitSh: '#b0a49a',
  womanCoat: '#a07c5e',
  womanCoatHi: '#d0a67c',
  womanCoatSh: '#6a5048',
  tights: '#221c2a',
  ladyHair: '#3a2220', // the lady in red: dark brown, wavy
  ladyHairHi: '#6c4232',
  ladyCoat: '#c8343c',
  ladyCoatHi: '#f0625a',
  ladyCoatSh: '#86202e',
  ladyQuilt: '#9a2632',
  teenHair: '#1a1216', // the teen: dark and shaggy
  beanie: '#3c4a8a',
  teenCoat: '#f2c232',
  teenCoatHi: '#ffe27a',
  teenCoatSh: '#b88a1e',
  teenLegs: '#262838',
  teenLegsHi: '#3a3e56',
  breath: '#eef4ff',
});

const HZ = 100; // horizon
const ROAD = 112; // the winter road across the field
const BASE = 129; // the izba stands here
const PATH = 145; // where people walk past
const TRACK = 141; // the bear's bicycle track, just behind the path

/** The packed bicycle track wanders a little over the drifts. */
const trackY = (x: number) => TRACK + Math.round(Math.sin(x / 47 + 0.6) * 1.2);

// ---------- small drawing helpers ----------

/** A tiny distant spruce: a stepped triangle. */
function tinySpruce(
  f: Frame,
  x: number,
  base: number,
  h: number,
  c: RGB,
  edge: RGB
) {
  for (let k = 0; k < h; k++) {
    const half = Math.floor((k + 1) / 3);
    const y = base - h + k;
    f.hline(x - half, x + half, y, c);
    if (half > 0) f.set(x - half, y, edge);
  }
}

/** Per-row [first, last] opaque columns of a layer, so blits skip empty space. */
function spans(src: Frame) {
  const out = new Int16Array(src.h * 2).fill(-1);
  for (let y = 0; y < src.h; y++) {
    let a = -1;
    let b = -1;
    for (let x = 0; x < src.w; x++) {
      if (src.pixels[y * src.w + x]! >>> 24) {
        if (a < 0) a = x;
        b = x;
      }
    }
    out[y * 2] = a;
    out[y * 2 + 1] = b;
  }
  return out;
}

/** Copies a layer's opaque pixels over the frame, row span by row span. */
function blit(f: Frame, src: Frame, sp: Int16Array) {
  const d = f.pixels;
  const s = src.pixels;
  for (let y = 0; y < src.h; y++) {
    const a = sp[y * 2]!;
    if (a < 0) continue;
    const b = sp[y * 2 + 1]!;
    for (let i = y * src.w + a, e = y * src.w + b; i <= e; i++) {
      const p = s[i]!;
      if (p >>> 24) d[i] = p;
    }
  }
}

/** Blends colour c over pixel i with alpha a (0..1), straight on the buffer. */
function mix(px: Uint32Array, i: number, c: RGB, a: number) {
  const p = px[i]!;
  const k = Math.round(Math.min(1, a) * 256);
  const r = p & 0xff;
  const g = (p >>> 8) & 0xff;
  const b = (p >>> 16) & 0xff;
  const nr = r + (((((c >>> 16) & 0xff) - r) * k) >> 8);
  const ng = g + (((((c >>> 8) & 0xff) - g) * k) >> 8);
  const nb = b + ((((c & 0xff) - b) * k) >> 8);
  px[i] = (0xff000000 | (nb << 16) | (ng << 8) | nr) >>> 0;
}

type Puff = { x: number; y: number; r: number; c: readonly [RGB, RGB, RGB] };

/**
 * Smoke and steam as overlapping round puffs, shaded as one mass: every
 * puff's shadow first, then the body nudged towards the light, then the lit
 * cores. (lx, ly) points at the light.
 */
function puffs(f: Frame, list: Puff[], lx: number, ly: number) {
  for (const p of list) f.disc(p.x, p.y, p.r, p.c[0]);
  for (const p of list)
    if (p.r > 1.4) f.disc(p.x + lx, p.y + ly, p.r - 1, p.c[1]);
  for (const p of list)
    if (p.r > 2.6) f.disc(p.x + lx * 2, p.y + ly * 2, p.r - 2.2, p.c[2]);
}

type SpruceStyle = {
  dark: RGB;
  mid: RGB;
  lit: RGB;
  hi: RGB;
  snow: RGB;
  snowSh: RGB;
  snowHi: RGB;
  trunk: RGB;
};

/**
 * A snow-laden Siberian spruce: a narrow spire of drooping tiers. Each tier
 * carries a pad of snow on top, dark needles beneath and ragged tips that
 * hang over the tier below.
 */
function spruce(
  f: Frame,
  x: number,
  base: number,
  h: number,
  s: SpruceStyle,
  seed: number
) {
  x = Math.round(x);
  const trunkH = Math.max(3, Math.round(h * 0.07));
  const top = base - h;
  const crown = h - trunkH;
  const tiers = Math.max(3, Math.round(crown / 9));
  const step = crown / tiers;
  const maxHalf = Math.max(3, h * 0.21);
  f.rect(x - 1, base - trunkH - 3, 3, trunkH + 3, s.trunk);
  // bottom tier first: each tier's ragged skirt hangs over the snow below it
  for (let k = tiers - 1; k >= 0; k--) {
    const half = Math.max(
      2,
      Math.round(
        maxHalf * ((k + 1) / tiers) ** 0.9 * (0.9 + hash2(k, 0, seed) * 0.2)
      )
    );
    const shoulder = Math.round(half * (k === 0 ? 0.1 : 0.55));
    const t0 = Math.round(top + k * step);
    const t1 = Math.round(top + (k + 1) * step);
    for (let dx = -half - 1; dx <= half + 1; dx++) {
      const ad = Math.abs(dx);
      const u = ad / half;
      const tip = ad > half;
      if (tip && hash2(dx, k, seed + 3) < 0.4) continue;
      const rise = k === 0 ? 2.2 : 1;
      const yTop =
        t0 + Math.max(0, Math.round((ad - shoulder) * rise)) + (tip ? 1 : 0);
      const yBot =
        t1 -
        1 +
        Math.round(u * u * 2.5) +
        (hash2(dx, k, seed) > 0.6 ? 1 : 0) +
        (tip ? 1 : 0);
      // snow lies in clumps: thick here, thin there
      const clump = hash2((dx + 64) >> 1, k, seed + 5);
      const pad = tip ? 1 : clump < 0.2 ? 2 : clump > 0.7 ? 4 : 3;
      for (let y = Math.max(top, yTop); y <= yBot; y++) {
        const d = y - yTop;
        let c: RGB;
        if (d < pad)
          c =
            dx > half * 0.3
              ? s.snowSh
              : d === 0 && dx < half * 0.1
                ? s.snowHi
                : s.snow;
        else if (y >= yBot - 1)
          c = dx < -half * 0.55 ? s.mid : s.dark; // shadowed underside
        else if (d === pad) c = dx < half * 0.2 ? s.hi : s.mid;
        else c = dx < -half * 0.3 ? s.lit : dx > half * 0.3 ? s.dark : s.mid;
        f.set(x + dx, y, c);
      }
    }
  }
  f.vline(x, top - 2, top, s.snowHi);
  f.set(x, top - 3, s.dark);
}

/** A winter birch: white trunk with black marks, limbs and weeping twigs. */
function birch(
  f: Frame,
  x: number,
  base: number,
  h: number,
  seed: number,
  lean: number
) {
  const top = base - h;
  const pts: [number, number][] = [];
  for (let y = base; y >= top + h * 0.1; y--) {
    const v = (base - y) / h;
    const cx = Math.round(
      x + lean * v * v * h * 0.12 + Math.sin(v * 5 + seed) * 0.6
    );
    pts.push([cx, y]);
    const wide = v < 0.62;
    f.set(cx, y, P.birch);
    if (wide) f.set(cx + 1, y, P.birchSh);
    // lenticels: short dark dashes
    if (hash2(y, 1, seed) > 0.82 && y < base - 5) {
      f.set(cx + (hash2(y, 3, seed) > 0.5 ? 1 : 0), y, P.birchMark);
      if (wide && hash2(y, 2, seed) > 0.5) f.set(cx, y, P.birchMark);
    }
  }
  // the dark, cracked foot of an old birch
  for (let y = base - 5; y < base; y++) {
    f.set(x, y, y % 3 ? P.birchMark : P.birchSh);
    f.set(x + 1, y, P.birchMark);
  }
  // limbs climb out of the trunk, lower ones spreading wider; twigs branch
  // off them and droop at the ends
  const n = 7;
  for (let i = 0; i < n; i++) {
    const fr = 0.5 + (i / n) * 0.45;
    const p = pts[Math.min(pts.length - 1, Math.round(pts.length * fr))]!;
    const side = i % 2 ? 1 : -1;
    const spread = 0.62 - (i / n) * 0.42 + hash2(i, 1, seed) * 0.1;
    const len = h * (0.3 - (i / n) * 0.12) * (0.85 + hash2(i, 2, seed) * 0.3);
    const at = (u: number): [number, number] => [
      p[0] +
        (side > 0 ? 1 : 0) +
        side * (Math.sin(spread) * len * u + u * u * 2),
      p[1] - Math.cos(spread) * len * u,
    ];
    let prev = at(0);
    for (let k = 1; k <= 8; k++) {
      const q = at(k / 8);
      f.line(prev[0], prev[1], q[0], q[1], k < 4 ? P.birchSh : P.twigLit);
      prev = q;
    }
    for (const u of [0.4, 0.62, 0.82, 1]) {
      const [bx, by] = at(u);
      const tl = 2 + Math.round(hash2(i, u * 10, seed) * 4);
      const ex = bx + side * tl;
      const ey = by - tl * 0.6;
      f.line(bx, by, ex, ey, P.twig);
      f.vline(
        Math.round(ex),
        Math.round(ey) + 1,
        Math.round(ey) + 2 + Math.round(hash2(i, u * 20, seed) * 3),
        P.twig
      );
      if (u < 0.9) {
        // a twig on the inner side too
        const ix = bx - side * 2;
        f.line(bx, by, ix, by - 3, P.twig);
      }
    }
  }
}

/**
 * Behind the twigs, the crown of a bare birch reads as a faint haze:
 * returns its pixels, for blending at render.
 */
function birchCrown(
  w: number,
  h: number,
  x: number,
  base: number,
  ht: number,
  seed: number,
  lean: number
) {
  const out: { i: number; a: number; lit: boolean }[] = [];
  const cx = x + lean * ht * 0.05;
  const cy = base - ht * 0.72;
  const rx = ht * 0.2;
  const ry = ht * 0.24;
  for (let y = Math.floor(cy - ry - 3); y <= cy + ry + 3; y++) {
    for (let xx = Math.floor(cx - rx - 3); xx <= cx + rx + 3; xx++) {
      if (xx < 0 || xx >= w || y < 0 || y >= h) continue;
      const dx = (xx - cx) / rx;
      const dy = (y - cy) / ry;
      const lump = (noise2(xx / 4, y / 4, seed) - 0.5) * 0.5;
      const d = Math.sqrt(dx * dx + dy * dy) - lump;
      if (d >= 1) continue;
      out.push({ i: y * w + xx, a: d < 0.6 ? 0.3 : 0.18, lit: dx + dy < -0.4 });
    }
  }
  return out;
}

type Win = { x: number; y: number; lit: boolean; side: boolean };

/** One window: a carved white frame (nalichnik) and painted shutters. */
function windowFrame(f: Frame, x: number, y: number, side: boolean) {
  const carve = side ? P.carveSh : P.carve;
  // kokoshnik: a little carved pediment over the window
  f.hline(x - 2, x + 6, y - 2, carve);
  f.hline(x - 1, x + 5, y - 3, carve);
  f.hline(x + 1, x + 3, y - 4, carve);
  f.set(x + 2, y - 5, carve);
  f.set(x + 2, y - 3, P.shutter);
  // frame
  f.rect(x - 1, y - 1, 7, 9, carve);
  // sill and the carved drop under it
  f.hline(x - 2, x + 6, y + 7, carve);
  f.hline(x + 1, x + 3, y + 8, carve);
  f.set(x + 2, y + 9, carve);
  // shutters, folded open, one each side hard against the frame
  for (const sx of [x - 3, x + 6]) {
    f.rect(sx, y - 1, 2, 8, side ? P.shutter : P.shutterHi);
    f.vline(sx + (sx < x ? 0 : 1), y - 1, y + 6, P.shutter);
    f.set(sx + (sx < x ? 1 : 0), y + 2, P.carve);
  }
}

function windowGlass(f: Frame, w: Win, lit: boolean, t: number) {
  const { x, y } = w;
  if (lit) {
    f.rect(x, y, 5, 7, P.win);
    f.rect(x, y + 4, 5, 3, P.winDeep);
    f.set(x + 1, y, P.winHi);
    f.set(x + 3, y, P.winHi);
    // lace curtains drawn halfway
    f.vline(x, y, y + 6, P.curtain);
    f.vline(x + 4, y, y + 6, P.curtain);
    // someone moving about inside now and then
    if (Math.sin(t / 3100 + x) > 0.7) f.rect(x + 3, y + 3, 1, 4, P.board);
  } else {
    f.rect(x, y, 5, 7, P.glass);
    f.set(x + 3, y + 1, P.glassHi);
    f.set(x + 4, y, P.glassHi);
  }
  // cross mullion
  f.vline(x + 2, y, y + 6, P.board);
  f.hline(x, x + 4, y + 2, P.board);
}

// ---------- the bear on a bicycle ----------

/**
 * A brown bear sitting on the saddle, face turned to us; '.' is empty.
 * Column 0 is dx -7 and row 0 is dy -20 from the ground under the pedals.
 */
const BEAR = [
  '...oo...oo.....',
  '..ohbooobBo....',
  '...ohhhhhhBo...',
  '..ohhBBBBBBo...',
  '..ohBnBBBnBo...',
  '..oBBBmnmBBo...',
  '...obBmmmBbo...',
  '.ohrrrrrrrrBo..',
  'ohhBBBBBBBBBBo.',
  'ohBBBBBBBBBBBBo',
  'ohBBBBBBBBBBBBo',
  '.obBBBBBBBBBBbo',
  '..obbbbbbbbbbo.',
];
const BEAR_INK: Record<string, RGB> = {
  o: P.bearOut,
  b: P.bearSh,
  B: P.bear,
  h: P.bearHi,
  m: P.muzzle,
  n: P.nose,
  r: P.scarf,
  R: P.scarfSh,
};

/** A 7px wheel rim, as offsets from the hub. */
const RIM = [
  [-1, -3],
  [0, -3],
  [1, -3],
  [2, -2],
  [3, -1],
  [3, 0],
  [3, 1],
  [2, 2],
  [1, 3],
  [0, 3],
  [-1, 3],
  [-2, 2],
  [-3, 1],
  [-3, 0],
  [-3, -1],
  [-2, -2],
] as const;

type BearPose = {
  wheel: number; // wheel angle, radians
  crank: number; // pedal crank angle
  bob: number; // 0 or 1: the body dips with the pedalling
  lean: number; // -1, 0 or 1: wobbling on the saddle
  strum: number; // -1: paw still, 0 or 1: strumming up or down
  bell: boolean; // paw on the bell
  ring: number; // -1, or how far into a ding of the bell (0..1)
  foot: boolean; // stopped, one foot down in the snow
  flap: number; // the scarf's flutter phase
};

/**
 * A brown bear on an old roadster bicycle, playing the balalaika no-hands:
 * dir 1 rides right, -1 rides left. (x, y) is the ground under the pedals.
 */
function drawBear(f: Frame, x: number, y: number, dir: number, p: BearPose) {
  x = Math.round(x);
  y = Math.round(y);
  const put = (dx: number, dy: number, c: RGB) =>
    f.set(x + dir * dx, y + dy, c);
  const seg = (x0: number, y0: number, x1: number, y1: number, c: RGB) =>
    f.line(x + dir * x0, y + y0, x + dir * x1, y + y1, c);
  const bx = p.lean;
  const by = p.bob;
  const pedal = (a: number): [number, number] => [
    Math.round(Math.cos(a) * 2),
    -3 + Math.round(Math.sin(a) * 2),
  ];
  // a stubby leg from the hip down to the pedal, knee bent forward
  const leg = (hx: number, fx: number, fy: number, c: RGB, sole: RGB) => {
    const hy = by - 8;
    const dx = fx - hx;
    const dy = fy - hy;
    const d = Math.max(0.01, Math.hypot(dx, dy));
    const off = Math.sqrt(Math.max(0, 3.4 * 3.4 - (d / 2) ** 2));
    let nx = dy / d;
    let ny = -dx / d;
    if (nx < 0) {
      nx = -nx;
      ny = -ny;
    }
    const kx = Math.round((hx + fx) / 2 + nx * off);
    const ky = Math.round((hy + fy) / 2 + ny * off);
    seg(hx, hy, kx, ky, c);
    seg(hx + 1, hy, kx + 1, ky, c);
    seg(kx, ky, fx, fy, c);
    seg(kx + 1, ky, fx + 1, fy - 1, c);
    put(fx - 1, fy, sole);
    put(fx, fy, sole);
    put(fx + 1, fy, sole);
  };

  // far leg and pedal, behind the frame
  const [fpx, fpy] = pedal(p.crank + Math.PI);
  leg(bx + 1, fpx, fpy, P.bearSh, P.bearOut);
  // wheels: a dark tyre, spokes that turn, one bright reflector
  for (const cx of [-7, 7]) {
    for (const [a, b] of RIM) put(cx + a, -3 + b, P.tire);
    for (let k = 0; k < 4; k++) {
      const a = p.wheel + (k * Math.PI) / 2;
      put(
        cx + Math.round(Math.cos(a) * 2),
        -3 + Math.round(Math.sin(a) * 2),
        k ? P.spoke : P.chrome
      );
    }
    put(cx, -3, P.chrome);
  }
  // the frame: an old roadster, blue like the shutters
  seg(-7, -3, 0, -3, P.frameSh);
  seg(-7, -3, -3, -7, P.frame);
  seg(0, -3, -3, -8, P.frame);
  seg(-3, -7, 5, -7, P.frameHi);
  seg(0, -3, 5, -6, P.frame);
  seg(5, -6, 7, -3, P.frameSh);
  put(6, -7, P.chrome); // dynamo headlamp
  put(7, -7, P.lampWarm);
  // the bear himself
  BEAR.forEach((row, ry) => {
    for (let i = 0; i < row.length; i++) {
      const c = BEAR_INK[row[i]!];
      if (c !== undefined) put(i - 7 + bx, ry - 20 + by, c);
    }
  });
  // scarf end streaming out behind
  for (let i = 0; i < 4; i++) {
    const wy = p.foot
      ? i
      : Math.round(Math.sin(p.flap - i * 1.1) * (0.3 + i * 0.25));
    put(bx - 5 - i, by - 13 + wy, i === 3 ? P.scarfSh : P.scarf);
  }
  // the balalaika: a bright triangle across his belly, the neck reaching
  // up past his chin
  const ox = bx;
  const oy = by;
  f.poly(
    [
      [x + dir * (ox + 3.6), y + oy - 12.6],
      [x + dir * (ox - 4.8), y + oy - 8.6],
      [x + dir * (ox - 1), y + oy - 4.4],
    ],
    (px, py) => {
      const lx = (px - x) * dir - ox;
      const ly = py - y - oy;
      // lit along the top edge, shadowed along the rounded base
      if ((lx + 2.5) * 0.7 - (ly + 6.5) * 0.7 < 0.6) return P.balalSh;
      return (ly + 6.5) * 0.7 + (lx + 2.5) * 0.7 < -1.4 ? P.balalHi : P.balal;
    }
  );
  put(ox - 1, oy - 8, P.balalHole);
  seg(ox + 3, oy - 12, ox + 6, oy - 15, P.balalNeckHi);
  put(ox + 7, oy - 16, P.balalNeck);
  put(ox + 6, oy - 16, P.balalNeck);
  put(ox + 7, oy - 17, P.chrome);
  // far paw on the neck
  put(ox + 5, oy - 13, P.bearSh);
  put(ox + 4, oy - 13, P.bearSh);
  // handlebars in front of his belly, the bell on them
  seg(5, -7, 5, -10, P.frameSh);
  seg(3, -10, 6, -10, P.chrome);
  put(3, -10, P.tire);
  put(7, -10, P.chrome);
  put(7, -11, p.ring >= 0 && p.ring < 0.3 ? P.noteHi : P.chrome);
  // ...and when it rings, rings of sound rippling off it
  if (p.ring >= 0) {
    const c = p.ring < 0.35 ? P.noteHi : P.note;
    if (p.ring < 0.6) {
      put(9, -12, c);
      put(10, -11, c);
      put(9, -10, c);
    }
    if (p.ring > 0.2 && p.ring < 0.85) {
      put(11, -13, P.note);
      put(12, -12, P.note);
      put(12, -11, P.note);
      put(12, -10, P.note);
      put(11, -9, P.note);
    }
    // a glint of a ding just above it
    if (p.ring < 0.4) {
      const r = p.ring < 0.2 ? 1 : 2;
      put(9, -14, P.noteHi);
      put(9 - r, -14, P.note);
      put(9 + r, -14, P.note);
      put(9, -14 - r, P.note);
      put(9, -14 + r, P.note);
    }
  }
  // near leg, crank and pedal
  const [npx, npy] = p.foot ? [4, 0] : pedal(p.crank);
  if (!p.foot) seg(0, -3, npx, npy, P.chrome);
  leg(bx - 1, npx, npy, P.bear, P.bearOut);
  // near paw: strumming, or ringing the bell
  const [qx, qy] = p.bell ? [6, -11] : [ox + 1, oy - (p.strum === 1 ? 7 : 8)];
  put(qx, qy, P.bear);
  put(qx - 1, qy, P.bearHi);
  put(qx, qy + 1, P.bearSh);
  put(qx - 1, qy + 1, P.bear);
}

export const nizhnevartovsk: Scene = {
  id: 'nizhnevartovsk',
  name: 'Nizhnevartovsk',
  country: 'Russia',
  create(w, h) {
    const fx = new Fx();
    const mid = Math.round(w / 2);

    // ---------- layout ----------
    const GW = 41; // gable front: odd, so its apex falls on a pixel column
    const SW = w < 300 ? 22 : 32; // side wall running back
    const gx = Math.round(mid - Math.min(76, w * 0.25));
    const wallTop = BASE - 21;
    const ax = gx + (GW - 1) / 2; // apex, over the middle window
    const run = (GW + 1) / 2; // apex out to the log ends at the corners
    const rise = 18;
    const ay = wallTop - rise;
    const houseR = gx + GW + SW + 2;
    const chimX = Math.round(ax + SW * 0.62);
    const chimTop = ay - 8;
    const lampX = houseR + 11;
    const flareX = Math.round(mid + Math.min(128, w * 0.28));
    const flares = [
      { x: flareX, top: HZ - 34, phase: 0.3 },
      { x: flareX + 14, top: HZ - 25, phase: 2.1 },
    ];
    const rigX = w > 300 ? Math.round(mid + Math.min(180, w * 0.4)) : -100;
    const stackX = Math.round(mid - Math.min(140, w * 0.33));
    const stacks = [
      { x: stackX, top: HZ - 46 },
      { x: stackX + 10, top: HZ - 40 },
    ];
    // a pump jack or two out in the field between the lamp and the flares
    const jacks: { x: number; base: number; phase: number; s: number }[] = [];
    const fieldL = lampX + 14;
    const fieldR = flareX - 8;
    if (fieldR - fieldL > 70) {
      jacks.push({
        x: Math.round(fieldL + (fieldR - fieldL) * 0.28),
        base: ROAD + 4,
        phase: 2.1,
        s: 0.75,
      });
      jacks.push({
        x: Math.round(fieldL + (fieldR - fieldL) * 0.72),
        base: ROAD + 9,
        phase: 0,
        s: 1,
      });
    } else if (fieldR - fieldL > 24) {
      jacks.push({
        x: Math.round((fieldL + fieldR) / 2),
        base: ROAD + 7,
        phase: 0,
        s: 0.85,
      });
    }
    const birches = [
      { x: Math.round(gx - Math.min(36, w * 0.09)), h: 76, seed: 5, lean: -1 },
    ];
    if (w > 560)
      birches.push({ x: Math.round(w - 70), h: 66, seed: 9, lean: 1 });

    const treeH = Math.round(Math.min(130, 72 + w * 0.14));
    const bigTrees = [
      { x: Math.round(Math.min(14, w * 0.04)), h: treeH, seed: 3 },
      { x: Math.round(w - Math.min(16, w * 0.04)), h: treeH - 12, seed: 7 },
    ];

    // the park, in front and to the right of the house: a short path lit by
    // lanterns, a bench, and young birches behind it
    const rTree = bigTrees[1]!;
    const parkR = Math.min(
      rTree.x - Math.round(rTree.h * 0.21) - 2,
      w > 560 ? Math.round(w - 70) - 14 : w
    );
    const benchX = Math.min(
      parkR - 11,
      Math.round(lampX + Math.max(14, Math.min(60, (parkR - lampX) * 0.42)))
    );
    const BENCH_Y = PATH; // the bench's feet
    const meetX = benchX - 24; // where they meet
    // lanterns along the path, beside the old street lamp
    const lanterns: number[] = [];
    if (benchX + 17 < parkR - 2) lanterns.push(benchX + 17);
    if (benchX - lampX > 40)
      lanterns.push(Math.round((lampX + benchX) / 2) - 4);
    if (parkR - benchX > 70) lanterns.push(benchX + 52);
    const parkBirches: { x: number; h: number; seed: number; lean: number }[] =
      [];
    for (const [dx, hh, seed, lean] of [
      [-9, 44, 13, -1],
      [8, 52, 17, 1],
      [33, 40, 19, 1],
      [-40, 38, 23, -1],
    ] as const) {
      const x = benchX + dx;
      if (x < lampX + 6 || x > parkR - 4) continue;
      if (lanterns.some((l) => Math.abs(l - x) < 4)) continue;
      parkBirches.push({ x, h: hh, seed, lean });
    }
    const PARK_BASE = TRACK - 3; // the birches stand just behind the track

    // the bear's stop: a bell on a post by his track, on the left
    const lTreeR = bigTrees[0]!.x + Math.round(bigTrees[0]!.h * 0.21) + 3;
    const birchX0 = Math.round(gx - Math.min(36, w * 0.09));
    const postX =
      birchX0 - lTreeR > 40
        ? Math.min(66, Math.round((lTreeR + birchX0) / 2) - 6)
        : birchX0 + 12;
    const POST_Y = TRACK + 3; // the post's foot, just in front of the track
    const crowns = [
      ...birches.map((b) => birchCrown(w, h, b.x, h - 4, b.h, b.seed, b.lean)),
      ...parkBirches.map((b) =>
        birchCrown(w, h, b.x, PARK_BASE, b.h, b.seed, b.lean)
      ),
    ];

    const windows: Win[] = [];
    for (let i = 0; i < 3; i++)
      windows.push({
        x: gx + 5 + i * 13,
        y: wallTop + 6,
        lit: i !== 2,
        side: false,
      });
    if (SW >= 30)
      windows.push({ x: gx + GW + 8, y: wallTop + 6, lit: true, side: true });
    const doorX = houseR - 10;
    const attic = { x: Math.round(ax) - 1, y: ay + 9 };

    // ---------- static layers ----------
    const sky = layer(w, h, (f) => {
      gradient(f, 0, HZ, [P.sky0, P.sky1, P.sky2, P.sky3, P.sky4, P.sky5]);
      // stars: mostly faint, a few bright ones
      for (let i = 0; i < Math.round(w / 3.2); i++) {
        const x = Math.floor(hash2(i, 1, 21) * w);
        const y = Math.floor(Math.pow(hash2(i, 2, 21), 1.3) * (HZ - 20));
        f.set(x, y, hash2(i, 3, 21) > 0.85 ? P.starHi : P.star);
      }
      // the town's sodium glow and the flares' warm wash low in the sky
      glow(f, stackX, HZ, Math.min(150, w * 0.4), P.cityGlow, 0.38, 0.3, 0.1);
      glow(
        f,
        flareX,
        HZ,
        Math.min(130, w * 0.36),
        P.horizonWarm,
        0.5,
        0.42,
        0.1
      );
    });

    const far = layer(w, h, (f) => {
      // panel blocks of the town, each a grid of windows with lit stairwells
      const townR = Math.min(gx + 30, Math.round(w * 0.46));
      for (let x = -6, i = 0; x < townR; i++) {
        const r = (k: number) => hash2(i, k, 31);
        const tall = r(1) > 0.5;
        const bw = 14 + Math.round(r(2) * 18);
        const floors = tall ? (r(3) > 0.5 ? 12 : 9) : 5;
        const bh = floors * 2 + 2;
        const y0 = HZ - 2 - bh - Math.round(r(4) * 2);
        f.rect(x, y0, bw, HZ - y0, P.block);
        f.vline(x, y0, HZ, P.blockEdge);
        f.vline(x + bw - 1, y0, HZ, P.blockDark);
        f.hline(x, x + bw - 1, y0, P.blockRoof);
        if (r(5) > 0.5) {
          f.rect(x + 3, y0 - 2, 4, 2, P.block); // lift housing
          f.hline(x + 3, x + 6, y0 - 2, P.blockRoof);
        }
        // window columns centred on the block, two pixels in from each side
        const cols = Math.floor((bw - 5) / 2) + 1;
        const wx0 = x + Math.floor((bw - (cols - 1) * 2 - 1) / 2);
        const stair = wx0 + 2 * Math.floor(r(6) * cols);
        for (let fl = 0; fl < floors; fl++) {
          const wy = y0 + 2 + fl * 2;
          for (let wx = wx0; wx < wx0 + cols * 2; wx += 2) {
            if (wx === stair) continue;
            const v = hash2(wx, wy, 33);
            if (v < 0.34)
              f.set(
                wx,
                wy,
                v < 0.05 ? P.winCool : v < 0.2 ? P.winWarm : P.winWarm2
              );
          }
          if (fl % 2 === 0 && fl < floors - 1) f.set(stair, wy + 1, P.winCool);
        }
        x += bw + (r(7) > 0.6 ? 3 + Math.round(r(8) * 6) : 0);
      }
      // power-station stacks with red bands near the top
      for (const s of stacks) {
        for (let y = s.top; y < HZ; y++) {
          const v = (y - s.top) / (HZ - s.top);
          const wide = v > 0.45;
          const band = Math.floor((y - s.top) / 4) % 2 === 0 && y < s.top + 16;
          f.set(s.x, y, band ? P.stackBand : P.stackHi);
          f.set(s.x + 1, y, band ? P.stackBand : P.stack);
          if (wide) f.set(s.x + 2, y, P.stack);
          if (wide && v > 0.75) f.set(s.x - 1, y, P.stackHi);
        }
        f.hline(s.x - 1, s.x + 2, s.top + 17, P.stackHi);
      }
      // the taiga: a low ragged wall of spruce along the horizon
      for (let x = -2; x < w + 2; x += 2) {
        const hh = 3 + Math.round(hash2(x, 0, 41) * 5 + Math.sin(x / 23) * 2);
        tinySpruce(
          f,
          x + Math.round(hash2(x, 1, 41)),
          HZ + 1,
          Math.max(2, hh),
          P.taiga,
          P.taigaEdge
        );
      }
      f.hline(0, w, HZ, P.taiga);
      // drilling rig: a lattice derrick, with its winter shelter
      if (rigX > 0) {
        const top = HZ - 42;
        for (let y = top; y < HZ - 7; y++) {
          const v = (y - top) / (HZ - 7 - top);
          const half = Math.round(1 + v * 5);
          f.set(rigX - half, y, P.rigHi);
          f.set(rigX + half, y, P.rig);
          if ((y - top) % 6 === 0) f.hline(rigX - half, rigX + half, y, P.rig);
          else if ((y - top) % 6 === 3) f.set(rigX, y, P.rig);
        }
        f.rect(rigX - 2, top - 3, 5, 3, P.rigHi);
        f.rect(rigX - 11, HZ - 7, 23, 7, P.rig);
        f.hline(rigX - 11, rigX + 11, HZ - 7, P.pipeSnow);
        f.rect(rigX + 12, HZ - 4, 10, 4, P.rig);
        f.hline(rigX + 12, rigX + 21, HZ - 4, P.pipeSnow);
        for (let x = rigX - 9; x < rigX + 10; x += 4)
          f.set(x, HZ - 4, P.winWarm);
      }
      // flare stacks: tall pipes with a platform and guy wires
      for (const fl of flares) {
        f.line(fl.x, fl.top + 8, fl.x - 9, HZ, P.taigaEdge);
        f.line(fl.x + 1, fl.top + 8, fl.x + 10, HZ, P.taigaEdge);
        f.vline(fl.x, fl.top, HZ, P.pipeHi);
        f.vline(fl.x + 1, fl.top, HZ, P.pipe);
        f.hline(fl.x - 1, fl.x + 2, fl.top + 1, P.pipe);
        f.hline(fl.x - 2, fl.x + 3, fl.top + 12, P.pipe);
      }
    });

    // the snowfield: overlapping drifts, painted back to front, each one
    // lighter than the last and catching the light along its crest
    const levels = [
      [P.snowFar, P.snowFarLit],
      [P.snow1, P.snow1Lit],
      [P.snow2, P.snow2Lit],
      [P.snow3, P.snow3Lit],
      [P.snow4, P.snow4Lit],
    ] as const;
    const levelAt = (y: number) =>
      levels[
        Math.max(0, Math.min(4, Math.floor(((y - HZ) / (h - HZ)) * 5.6)))
      ]!;
    const ground = layer(w, h, (f) => {
      const mound = (cx: number, mw: number, y: number, mh: number) => {
        const [base, lit] = levelAt(y);
        for (let x = Math.floor(cx - mw / 2); x <= cx + mw / 2; x++) {
          const u = (x - cx) / (mw / 2);
          if (Math.abs(u) > 1) continue;
          const top = Math.round(y - mh * (1 - u * u) ** 1.5);
          for (let yy = top; yy < h; yy++) {
            const d = yy - top;
            let c = base;
            if (d === 0)
              c = mh < 1.4 ? base : y > BASE - 4 && u < 0.3 ? P.snowHi : lit;
            else if (d < 2 && u < 0.1 && mh > 1.5) c = lit;
            f.set(x, yy, c);
          }
        }
      };
      f.rect(0, HZ, w, h - HZ, P.snowFar);
      let row = 0;
      for (let y = HZ + 2; y < h; row++) {
        const d = (y - HZ) / (h - HZ);
        if (y >= ROAD - 1 && y < ROAD + 3) {
          // the winter road: packed snow with two ruts
          for (let x = 0; x < w; x++) {
            f.set(x, ROAD - 1, P.snow1Lit);
            f.set(x, ROAD, P.snow1);
            f.set(x, ROAD + 1, P.snowShadow);
            f.set(x, ROAD + 2, P.snow1Lit);
          }
          y = ROAD + 3;
          continue;
        }
        for (let x = -30 - hash2(row, 0, 51) * 40; x < w + 40; ) {
          const mw = (34 + 110 * d) * (0.6 + hash2(row, x, 52) * 0.8);
          const mh = (0.8 + 4.5 * d) * (0.5 + hash2(row, x, 53) * 0.7);
          mound(x + mw / 2, mw, y, mh);
          x += mw * (0.55 + hash2(row, x, 54) * 0.5);
        }
        y += Math.round(2 + d * 7);
      }
      // the packed track the bear rides along: a rut with a lit lip
      for (let x = 0; x < w; x++) {
        const y = trackY(x);
        f.set(x, y, P.snow3);
        f.set(x, y + 1, P.snow4Lit);
      }
      // a trodden path from the porch out towards the viewer
      for (let y = BASE + 2; y < h; y++) {
        const v = (y - BASE) / (h - BASE);
        const x = Math.round(doorX + 3 - v * 14 + Math.sin(v * 4) * 2);
        const half = 1 + Math.round(v * 2);
        f.hline(
          x - half,
          x + half,
          y,
          levelAt(y)[0] === P.snow4 ? P.snow3 : P.snow2
        );
        f.set(x + half + 1, y, P.snowHi);
      }
      // the park path: trodden snow between low banks
      const p0 = Math.min(lampX - 16, meetX - 56);
      const p1 = Math.max(benchX + 30, meetX + 56);
      for (let x = p0; x <= p1; x++) {
        const fade = Math.min(x - p0, p1 - x);
        if (fade < 4 && hash2(x, 0, 91) * 4 > fade) continue;
        f.set(x, PATH - 2, P.snowHi);
        f.set(x, PATH - 1, P.snow3);
        f.set(x, PATH, P.snow3);
        if (hash2(x, 1, 91) > 0.7) f.set(x, PATH, P.snow3Lit);
        f.set(x, PATH + 1, P.snow3Lit);
      }
    });

    const house = layer(w, h, (f) => {
      const logRow = (y: number, hi: RGB, mid: RGB, sh: RGB) => {
        const r = (((y - wallTop) % 3) + 3) % 3;
        return r === 0 ? hi : r === 1 ? mid : sh;
      };
      // side wall, in shadow
      for (let y = wallTop; y < BASE; y++)
        f.hline(gx + GW, houseR - 2, y, logRow(y, P.sideHi, P.side, P.sideSh));
      // logs poking out at the far corner
      for (let y = wallTop; y < BASE; y += 3) {
        f.hline(houseR - 1, houseR, y + 1, P.sideHi);
        f.set(houseR - 1, y + 2, P.sideSh);
      }
      // side roof plane, heavy with snow
      const eave = wallTop + 1;
      f.poly(
        [
          [ax + 1, ay - 3],
          [ax + SW + 1, ay - 3],
          [gx + GW + SW + 5, eave + 1],
          [gx + GW + 5, eave + 1],
        ],
        (x, y) => {
          const v = (y - (ay - 3)) / (eave + 1 - (ay - 3));
          if (y <= ay - 2) return P.roofSnowHi;
          if (v > 0.84) return P.roofSnowHi; // the rounded lip at the eave
          if (v > 0.72) return P.roofSnow;
          return v < 0.22 ? P.roofSnow : P.roofSnowSh;
        }
      );
      // the overhang's shadow on the wall, and icicles
      f.hline(gx + GW, houseR - 2, eave + 1, P.sideSh);
      f.hline(gx + GW, houseR - 2, eave + 2, P.sideSh);
      for (let x = gx + GW + 3; x < houseR + 2; x++) {
        const len =
          hash2(x, 0, 51) > 0.55 ? 1 + Math.floor(hash2(x, 1, 51) * 4) : 0;
        if (len) f.vline(x, eave + 2, eave + 1 + len, P.icicle);
      }
      // chimney: brick, poking up through the snow on the ridge
      for (let y = chimTop; y < ay + 2; y++) {
        const r = (y - chimTop) % 2;
        f.hline(chimX, chimX + 3, y, r ? P.brick : P.brickHi);
        if (r === 0) f.set(chimX + 1 + ((y >> 1) % 2) * 2, y, P.brick);
      }
      f.vline(chimX + 3, chimTop, ay + 1, P.brick);
      f.hline(chimX - 1, chimX + 4, chimTop - 1, P.roofSnowHi);
      f.hline(chimX, chimX + 3, chimTop - 2, P.roofSnow);
      // porch on the side: a door under a little snowy canopy, two steps
      f.rect(doorX - 1, BASE - 13, 7, 13, P.sideSh);
      f.rect(doorX, BASE - 12, 5, 12, P.door);
      f.vline(doorX + 1, BASE - 11, BASE - 1, P.doorHi);
      f.set(doorX + 4, BASE - 6, P.logEnd);
      f.poly(
        [
          [doorX - 3, BASE - 14],
          [doorX + 2, BASE - 18],
          [doorX + 8, BASE - 14],
        ],
        P.roofSnow
      );
      f.hline(doorX - 3, doorX + 7, BASE - 14, P.roofSnowHi);
      f.hline(doorX - 2, doorX + 6, BASE - 13, P.board);
      f.hline(doorX - 2, doorX + 7, BASE - 1, P.board);
      f.hline(doorX - 3, doorX + 8, BASE, P.logSh);

      // the gable front
      for (let y = wallTop; y < BASE; y++)
        f.hline(gx, gx + GW - 1, y, logRow(y, P.logHi, P.log, P.logSh));
      // pediment: logs continue up into the gable
      for (let y = ay + 2; y < wallTop; y++) {
        const half = Math.round(((y - ay) / rise) * run);
        f.hline(ax - half, ax + half, y, logRow(y, P.logHi, P.log, P.logSh));
      }
      // log ends at both front corners: round cut faces
      for (const cx of [gx - 1, gx + GW]) {
        for (let y = wallTop; y < BASE - 1; y += 3) {
          f.set(cx - 1, y + 1, P.logEndRing);
          f.set(cx + 1, y + 1, P.logEndRing);
          f.set(cx, y, P.logEndRing);
          f.set(cx, y + 1, P.logEnd);
          f.set(cx, y + 2, P.logEndRing);
        }
      }
      // attic window
      const ax0 = attic.x;
      const ay0 = attic.y;
      f.rect(ax0 - 1, ay0 - 1, 5, 6, P.carve);
      f.hline(ax0 - 2, ax0 + 4, ay0 - 2, P.carve);
      f.hline(ax0, ax0 + 2, ay0 - 3, P.carve);
      f.hline(ax0 - 2, ax0 + 4, ay0 + 5, P.carve);
      // carved barge boards and the snow piled on them
      for (const dir of [-1, 1]) {
        for (let i = 0; i <= run + 4; i++) {
          const x = ax + dir * i;
          const y = Math.round(ay + (i * rise) / run);
          f.vline(x, y - 1, y, P.board);
          if (i % 2 === 0 && i > 1) f.set(x, y + 1, P.carve); // scalloped trim
          if (i % 4 === 2 && i > 1) f.set(x, y + 2, P.carveSh);
          // snow on top: lit on the left slope, a little shaded on the right
          const thick = i > run + 1 ? 2 : 3;
          for (let j = 1; j <= thick; j++)
            f.set(
              x,
              y - 1 - j,
              j === thick ? P.roofSnowHi : dir < 0 ? P.roofSnow : P.roofSnowSh
            );
        }
      }
      // the drooping snow cornice at the front eave
      f.hline(gx - 6, gx - 3, wallTop + 1, P.roofSnow);
      f.hline(gx - 5, gx - 4, wallTop + 2, P.roofSnowSh);
      // polotentse: a carved board hanging from the apex
      f.rect(Math.round(ax) - 1, ay, 3, 6, P.carve);
      f.set(Math.round(ax), ay + 2, P.shutter);
      f.set(Math.round(ax), ay + 6, P.carve);
      f.hline(Math.round(ax) - 1, Math.round(ax) + 1, ay - 3, P.roofSnowHi);
      // windows with their carved frames
      for (const wn of windows) windowFrame(f, wn.x, wn.y, wn.side);
      // the snow bank piled against the wall (zavalinka)
      for (let x = gx - 6; x < houseR + 6; x++) {
        const bank = 2 + Math.round(Math.sin((x - gx) / 7) * 0.8 + 0.6);
        for (let y = BASE - bank; y < BASE + 2; y++)
          f.set(x, y, y === BASE - bank ? P.snowHi : P.snow3Lit);
      }
      // a woodpile under a snow cap, round log ends showing
      const wpx = gx - 17;
      for (let r = 0; r < 3; r++) {
        const y = BASE - 3 - r * 3;
        for (let x = wpx + (r % 2) + 1; x < wpx + 11; x += 3) {
          f.rect(x - 1, y - 1, 3, 3, P.logSh);
          f.set(x, y, hash2(x, y, 3) > 0.35 ? P.logEnd : P.logEndRing);
          f.set(x + 1, y, P.logEndRing);
          f.set(x, y + 1, P.logEndRing);
        }
      }
      f.hline(wpx - 1, wpx + 11, BASE - 11, P.roofSnow);
      f.hline(wpx, wpx + 10, BASE - 12, P.roofSnowHi);
      f.vline(wpx - 1, BASE - 10, BASE - 1, P.board);
      f.vline(wpx + 11, BASE - 10, BASE - 1, P.board);
      // a little picket fence in front of the windows, half buried
      // (posts spaced evenly out to the same overhang each side)
      for (let x = gx - 4; x <= gx + GW + 3; x += 3) {
        f.vline(x, BASE + 2, BASE + 7, P.board);
        f.set(x, BASE + 1, P.snowHi);
      }
      f.hline(gx - 4, gx + GW + 3, BASE + 4, P.board);
      f.hline(gx - 4, gx + GW + 3, BASE + 3, P.snowHi);
      for (let x = gx - 6; x < gx + GW + 6; x++) {
        const y = BASE + 6 + Math.round(Math.sin(x / 5) * 0.7);
        f.vline(x, y, BASE + 8, P.snow4);
        f.set(x, y, P.snow4Lit);
      }
      // the lamp post: a crooked wooden pole and an old enamel shade
      f.vline(lampX, BASE - 26, BASE + 4, P.board);
      f.vline(lampX + 1, BASE - 26, BASE + 4, P.trunk);
      f.line(lampX, BASE - 24, lampX - 4, BASE - 27, P.board);
      // a green enamel shade, white inside, snow on top
      f.hline(lampX - 6, lampX - 5, BASE - 27, P.shade);
      f.hline(lampX - 7, lampX - 4, BASE - 26, P.shadeHi);
      f.hline(lampX - 8, lampX - 3, BASE - 25, P.shade);
      f.set(lampX - 8, BASE - 25, P.shadeHi);
      f.hline(lampX - 7, lampX - 4, BASE - 28, P.roofSnowHi);
      f.set(lampX, BASE - 27, P.roofSnowHi);
      // the park: young birches behind the path, and its lanterns
      for (const b of parkBirches)
        birch(f, b.x, PARK_BASE, b.h, b.seed, b.lean);
      for (const lx of lanterns) {
        const top = PATH - 21;
        f.vline(lx, top + 5, PATH - 3, P.iron);
        f.vline(lx + 1, top + 5, PATH - 3, P.ironHi);
        f.hline(lx - 1, lx + 2, PATH - 3, P.iron);
        f.hline(lx - 1, lx + 2, PATH - 2, P.snowHi);
        f.set(lx, top + 12, P.ironHi); // a cast collar
        f.set(lx + 1, top + 12, P.iron);
        // the lantern: a little iron cage under a peaked cap
        f.set(lx, top - 1, P.iron);
        f.hline(lx - 1, lx + 2, top, P.iron);
        f.hline(lx - 2, lx + 3, top + 1, P.ironHi);
        f.vline(lx - 1, top + 2, top + 4, P.iron);
        f.vline(lx + 2, top + 2, top + 4, P.iron);
        f.hline(lx - 1, lx + 2, top + 5, P.iron);
        f.hline(lx - 1, lx + 2, top - 1, P.roofSnowHi);
        f.set(lx, top - 2, P.roofSnowHi);
      }
    });

    // in front of the bear's track: the bench and the bell post
    const parkFront = layer(w, h, (f) => {
      spr(f, BENCH, benchX - 11, BENCH_Y - BENCH.length + 1, {
        S: P.roofSnowHi,
        s: P.roofSnow,
        W: P.slatHi,
        w: P.slat,
        k: P.iron,
        K: P.ironHi,
      });
      spr(f, BELL_POST, postX - 3, POST_Y - BELL_POST.length + 1, {
        S: P.roofSnowHi,
        b: P.sign,
        B: P.signHi,
        k: P.signEdge,
        u: P.bear,
        U: P.bearHi,
        p: P.post,
        P: P.postHi,
        c: P.spoke,
        C: P.chrome,
        l: P.tire,
      });
    });

    const fore = layer(w, h, (f) => {
      for (const b of birches) birch(f, b.x, h - 4, b.h, b.seed, b.lean);
      const st: SpruceStyle = {
        dark: P.spruceDark,
        mid: P.spruce,
        lit: P.spruceLit,
        hi: P.spruceHi,
        snow: P.roofSnow,
        snowSh: P.roofSnowSh,
        snowHi: P.roofSnowHi,
        trunk: P.trunk,
      };
      for (const tr of bigTrees) spruce(f, tr.x, h + 1, tr.h, st, tr.seed);
      // a foreground drift to stand the trees in
      for (let x = 0; x < w; x++) {
        const edge = Math.min(x, w - 1 - x);
        const y0 =
          h -
          3 -
          Math.max(0, Math.round(5 - edge / 8)) -
          Math.round(Math.sin(x / 13) * 0.8);
        for (let y = y0; y < h; y++)
          f.set(x, y, y === y0 ? P.snowHi : P.snow4Lit);
      }
    });

    const farSpans = spans(far);
    const houseSpans = spans(house);
    const parkSpans = spans(parkFront);
    const foreSpans = spans(fore);

    // ---------- moving things ----------

    let surgeAt = -Infinity;
    let surgeX = 0;
    const flareAt = [-Infinity, -Infinity];
    let stokeAt = -Infinity;
    const flipped = new Set<number>();
    // everything that sheds its snow when clicked: the two big spruces, the
    // birches out front and the young ones in the park
    const shakers = [
      ...bigTrees.map((tr) => ({ x: tr.x, h: tr.h, base: h - 4, big: true })),
      ...birches.map((b) => ({ x: b.x, h: b.h, base: h - 4, big: false })),
      ...parkBirches.map((b) => ({
        x: b.x,
        h: b.h,
        base: PARK_BASE,
        big: false,
      })),
    ];
    const shakeAt = shakers.map(() => -Infinity);
    let postRingAt = -Infinity; // the bell on the post, rung
    let meetAt = -Infinity; // the bench clicked

    const surgeEnv = (t: number) => {
      const a = t - surgeAt;
      if (a < 0 || a > 5000) return 0;
      return a < 300 ? a / 300 : Math.max(0, 1 - (a - 300) / 4700) ** 1.5;
    };

    // ---------- 'bench': a meeting in the park ----------
    // ms after the bench is clicked
    const MEET = {
      in0: 250, // the couple, and the lady and the teen, come along the path
      in1: 1950, // they meet: a big hug
      hug1: 3150, // arm in arm to the bench
      walk1: 4250, // they sit
      sit1: 4500,
      bloom0: 3900, // the northern lights bloom over them
      bloom1: 5200,
      bloom2: 6700,
      bloom3: 8500,
      fade0: 7700, // and it all fades
      end: 8600,
    };
    const meetAge = (t: number) => {
      const s = t - meetAt;
      return s >= 0 && s < MEET.end ? s : -1;
    };
    const ease = (u: number) => {
      const v = Math.max(0, Math.min(1, u));
      return v * v * (3 - 2 * v);
    };
    /** The great curtain over the whole sky: 0..1. */
    const bloomEnv = (t: number) => {
      const s = meetAge(t);
      if (s < MEET.bloom0 || s > MEET.bloom3) return 0;
      if (s < MEET.bloom1)
        return ease((s - MEET.bloom0) / (MEET.bloom1 - MEET.bloom0));
      if (s < MEET.bloom2) return 1;
      return 1 - ease((s - MEET.bloom2) / (MEET.bloom3 - MEET.bloom2));
    };
    /** The park lanterns, turned up while the group's there: 0..1. */
    const lampBoost = (t: number, x: number) => {
      const s = meetAge(t) - Math.abs(x - benchX) * 4; // lit outward from the bench
      if (s < 0 || meetAge(t) < 0) return 0;
      if (s < 300) return s / 300;
      const out = MEET.end - 600;
      return meetAge(t) < out ? 1 : 1 - (meetAge(t) - out) / 600;
    };

    /** The bear's tune, if he's playing it: how hard, where, how far in. */
    const danceAt = (t: number) => {
      for (const { at, tune } of stops) {
        const s = t - at;
        if (!tune || s < TUNE[0] || s > TUNE[1] + 500) continue;
        const b = bearAt(at + 1000);
        if (!b) continue;
        const k =
          s < TUNE[0] + 250
            ? (s - TUNE[0]) / 250
            : s > TUNE[1]
              ? 1 - (s - TUNE[1]) / 500
              : 1;
        return { k, x: b.x, s };
      }
      return null;
    };

    // the bloom's colour bands, by how far up the ray: [until, colour]
    const BLOOM_BANDS: [number, RGB][] = [
      [0, P.auroraHem],
      [0.08, P.aurora0],
      [0.3, P.aurora1],
      [0.5, P.aurora2],
      [0.68, P.aurora3],
      [1, P.auroraTop],
    ];

    // aurora curtains: a bright hem with rays rising off it, green into violet
    const curtains = [
      {
        base: 60,
        tilt: 7,
        a1: 11,
        l1: 64,
        s1: 8200,
        a2: 3.5,
        l2: 21,
        s2: 3900,
        h: 32,
        seed: 3,
        gain: 1.12,
      },
      {
        base: 38,
        tilt: -5,
        a1: 8,
        l1: 97,
        s1: -11800,
        a2: 3,
        l2: 29,
        s2: -5300,
        h: 20,
        seed: 8,
        gain: 0.62,
      },
    ];
    const hemAt = (c: (typeof curtains)[number], x: number, t: number) =>
      c.base +
      (c.tilt * (x - w / 2)) / Math.max(150, w / 2) +
      c.a1 * Math.sin(x / c.l1 + t / c.s1 + c.seed) +
      c.a2 * Math.sin(x / c.l2 - t / c.s2 + c.seed * 2);

    function aurora(f: Frame, t: number) {
      const env = surgeEnv(t);
      const age = t - surgeAt;
      const bloom = bloomEnv(t);
      const dance = danceAt(t);
      for (const c of curtains) {
        for (let x = 0; x < w; x++) {
          const hem = hemAt(c, x, t);
          const slope = Math.abs(hemAt(c, x + 1, t) - hem);
          // brightness drifts slowly along the curtain but never quite dies;
          // where the ribbon folds and we see it edge-on it glows brighter
          let I =
            c.gain *
            (0.4 + 0.6 * noise1(x / 70 - t / 6400, c.seed)) *
            (1 + Math.min(0.5, slope * 0.6));
          if (env > 0) {
            const wave = Math.exp(
              -(((Math.abs(x - surgeX) - age * 0.09) / 22) ** 2)
            );
            I *= 1 + env * (0.6 + wave * 1.2);
          }
          // dancing to the balalaika: a beat of light runs out along the
          // curtains from the bear with every few strums
          let beat = 0;
          if (dance) {
            const ph = Math.abs(x - dance.x) / 44 - dance.s / 210;
            beat = dance.k * (0.5 + 0.5 * Math.cos(ph * Math.PI * 2)) ** 2;
            I *= 1 + dance.k * 0.3 + beat * 0.7;
          }
          if (bloom > 0) I *= 1 + bloom * 1.3;
          I *= 0.9 + 0.1 * noise1(x / 6 + t / 1300, c.seed + 6);
          const H =
            c.h *
            (0.65 + 0.7 * noise1(x / 42 + t / 5200, c.seed + 2)) *
            (0.86 + 0.28 * noise1(x / 4.5 + t / 2200, c.seed + 4)) *
            (1 + env * 0.35) *
            (1 + bloom * 0.6 + beat * 0.6);
          const y0 = Math.round(hem);
          const px = f.pixels;
          if (y0 + 2 < h) {
            // a faint glow under the hem; strong displays get a pink lower border
            const strong = Math.max(env, bloom, beat);
            const pink =
              strong > 0.15 ? Math.round(strong * I * 0.5 * 8) / 8 : 0;
            mix(
              px,
              (y0 + 1) * w + x,
              pink ? P.auroraPink : P.aurora2,
              pink || Math.round(I * 0.16 * 8) / 8
            );
            if (pink) mix(px, (y0 + 2) * w + x, P.auroraPink, pink / 2);
          }
          for (let k = 0; k < H; k++) {
            const y = y0 - k;
            if (y < 0) break;
            if (y >= h) continue;
            const v = k / H;
            const a = Math.round(I * (k === 0 ? 0.95 : 0.85 * (1 - v)) * 8) / 8;
            if (a <= 0) continue;
            let col =
              k === 0
                ? P.auroraHem
                : v < 0.15
                  ? P.aurora0
                  : v < 0.4
                    ? P.aurora1
                    : v < 0.62
                      ? P.aurora2
                      : v < 0.8
                        ? P.aurora3
                        : P.auroraTop;
            // the beat flushes the rays pink and violet as it passes
            if (beat > 0.2 && k > 0)
              col = lerpRGB(
                col,
                v < 0.5 ? P.auroraPink : P.auroraTop,
                Math.round(beat * 3) / 5
              );
            mix(px, y * w + x, col, a);
          }
        }
      }
      if (bloom > 0) bloomCurtain(f, t, bloom);
    }

    /**
     * The great display: a vast curtain unrolling across the sky from over
     * the bench, its hem low over the town and its rays climbing right up to
     * the top of the sky, pink along the bottom, violet at the top.
     */
    function bloomCurtain(f: Frame, t: number, B: number) {
      const s = meetAge(t) - MEET.bloom0;
      const reach = 12 + Math.max(0, s) * 0.42;
      const px = f.pixels;
      const hemOf = (x: number) =>
        84 +
        6 * Math.sin(x / 43 + t / 2600) +
        3 * Math.sin(x / 16 - t / 1400) -
        5 * Math.exp(-(((x - benchX) / 70) ** 2));
      for (let x = 0; x < w; x++) {
        const edge = Math.min(1, (reach - Math.abs(x - benchX)) / 50);
        if (edge <= 0) continue;
        const hem = hemOf(x);
        const slope = Math.abs(hemOf(x + 1) - hem);
        const rays =
          0.5 +
          0.35 * noise1(x / 3.2 + t / 800, 41) +
          0.25 * noise1(x / 11 - t / 1900, 42);
        const I = B * edge * rays * (1 + Math.min(0.7, slope * 0.8)) * 1.15;
        const top = 1 + 12 * noise1(x / 37 + t / 3100, 43);
        const H = hem - top;
        const y0 = Math.round(hem);
        mix(px, (y0 + 1) * w + x, P.auroraPink, Math.min(1, I * 0.75));
        mix(px, (y0 + 2) * w + x, P.auroraPink, I * 0.35);
        // up the rays in bands, green into violet, fading as they climb
        // (alpha stepped in eighths, worked out as it goes)
        const n = Math.min(y0 + 1, Math.ceil(H));
        let k = 0;
        for (const [until, col] of BLOOM_BANDS) {
          const r = (col >>> 16) & 0xff;
          const g = (col >>> 8) & 0xff;
          const bl = col & 0xff;
          const end = Math.min(n, k === 0 ? 1 : Math.ceil(until * H));
          for (; k < end; k++) {
            const q = Math.round(I * (k === 0 ? 8 : 7.4 * (1 - k / H)));
            if (q <= 0) continue;
            const i = (y0 - k) * w + x;
            const kk = q >= 8 ? 256 : q * 32;
            const p = px[i]!;
            const pr = p & 0xff;
            const pg = (p >>> 8) & 0xff;
            const pb = (p >>> 16) & 0xff;
            px[i] =
              (0xff000000 |
                ((pb + (((bl - pb) * kk) >> 8)) << 16) |
                ((pg + (((g - pg) * kk) >> 8)) << 8) |
                (pr + (((r - pr) * kk) >> 8))) >>>
              0;
          }
        }
      }
    }

    /** The bloom's green light, falling on the snow and everything on it. */
    function bloomLight(f: Frame, t: number) {
      const B = bloomEnv(t);
      if (B <= 0) return;
      const px = f.pixels;
      const kk = Math.round(B * 0.13 * 256);
      const r = (P.aurora1 >>> 16) & 0xff;
      const g = (P.aurora1 >>> 8) & 0xff;
      const bl = P.aurora1 & 0xff;
      for (let i = (HZ - 30) * w, e = w * h; i < e; i++) {
        const p = px[i]!;
        const pr = p & 0xff;
        const pg = (p >>> 8) & 0xff;
        const pb = (p >>> 16) & 0xff;
        px[i] =
          (0xff000000 |
            ((pb + (((bl - pb) * kk) >> 8)) << 16) |
            ((pg + (((g - pg) * kk) >> 8)) << 8) |
            (pr + (((r - pr) * kk) >> 8))) >>>
          0;
      }
    }

    /**
     * A stream of puffs, each with its own size and drift, oldest drawn first.
     * `at(p, id)` places puff `id` at age p (0..1).
     */
    function stream(
      t: number,
      period: number,
      n: number,
      seed: number,
      at: (p: number, rs: number, ox: number) => Puff | null
    ) {
      const list: { p: number; puff: Puff }[] = [];
      for (let i = 0; i < n; i++) {
        const q = t / period + i / n + seed * 0.37;
        const p = q - Math.floor(q);
        const id = Math.floor(q) * n + i;
        const puff = at(
          p,
          0.7 + 0.6 * hash2(id, 1, seed),
          hash2(id, 2, seed) * 2 - 1
        );
        if (puff) list.push({ p, puff });
      }
      list.sort((a, b) => b.p - a.p);
      return list.map((e) => e.puff);
    }

    const plumeSet = [P.plumeDark, P.plume, P.plumeLit] as const;
    const plumeFade = [P.plumeFadeDark, P.plumeFade, P.plumeFadeLit] as const;
    // steam from the power station: straight up in the still cold air, then
    // flattening out and drifting off under the inversion
    function plume(f: Frame, x: number, y: number, t: number, seed: number) {
      const list = stream(t, 15000, 18, seed, (p, rs, ox) => {
        if (p > 0.95) return null;
        if (p < 0.42) {
          const v = p / 0.42;
          return {
            x: x + ox * v * 2,
            y: y - 2 - v * 24,
            r: (1.3 + v * 4) * rs,
            c: plumeSet,
          };
        }
        const v = (p - 0.42) / 0.58;
        const r = (5 + v * 2) * rs * (v > 0.7 ? 1 - (v - 0.7) * 1.6 : 1);
        return {
          x: x - v * 56 + ox * 4,
          y: y - 26 - v * 3 + ox * 1.5,
          r,
          c: v > 0.4 ? plumeFade : plumeSet,
        };
      });
      puffs(f, list, 0.4, 0.8);
    }

    const smokeSet = [P.smokeDark, P.smoke, P.smokeLit] as const;
    const smokeFade = [P.smokeFadeDark, P.smokeFade, P.smokeFadeLit] as const;
    function chimneySmoke(f: Frame, t: number) {
      const sx = chimX + 1.5;
      const sway = Math.sin(t / 2300) * 3;
      const list = stream(t, 7000, 22, 4, (p, rs, ox) => {
        if (p > 0.93) return null;
        const r = (0.9 + p * 4.4) * rs * (p > 0.72 ? 1 - (p - 0.72) * 2 : 1);
        return {
          x: sx - p ** 1.5 * 28 + ox * p * 7 + sway * p,
          y: chimTop - 3 - p * 38,
          r,
          c: p > 0.5 ? smokeFade : smokeSet,
        };
      });
      // stoking the stove: a thick burst of smoke and sparks
      const a = (t - stokeAt) / 1000;
      if (a >= 0 && a < 3) {
        for (let i = 0; i < 6; i++) {
          const d = a - i * 0.22;
          if (d < 0 || d > 2.4) continue;
          list.push({
            x: sx - d * 10 + Math.sin(d * 3 + i) * 1.5,
            y: chimTop - 3 - d * 15,
            r: 2 + d * 3.2,
            c: d > 1.4 ? smokeFade : smokeSet,
          });
        }
      }
      puffs(f, list, -0.5, -0.7);
      if (a >= 0 && a < 1.3) {
        for (let i = 0; i < 9; i++) {
          const d = a * (0.8 + hash2(i, 1, 9) * 0.6);
          if (d > 1.1) continue;
          f.set(
            sx + (hash2(i, 2, 9) - 0.5) * 16 * d,
            chimTop - 2 - d * 30 + d * d * 10,
            i % 3 ? P.spark : P.flame1
          );
        }
      }
    }

    function flame(
      f: Frame,
      fl: { x: number; top: number; phase: number },
      t: number,
      boost: number
    ) {
      const flick = noise1(t / 110 + fl.phase * 10, 5);
      const H = Math.round((10 + flick * 5) * (1 + boost * 1.6));
      const lean = -0.25 + Math.sin(t / 900 + fl.phase) * 0.12;
      const cx0 = fl.x + 0.5;
      for (let k = 0; k < H; k++) {
        const v = k / H;
        const half =
          (v < 0.2 ? 1.2 + v * 9 : (3 * (1 - v)) / 0.8 + 0.2) *
          (1 + boost * 0.6);
        const cx = cx0 + lean * k + Math.sin(k * 0.55 - t / 85) * v * 1.4;
        const y = fl.top - 1 - k;
        for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) {
          const e = Math.abs(x - cx) / Math.max(1, half);
          if (v > 0.8 && hash2(x, Math.floor(t / 90), k) > 0.6) continue;
          let c =
            v > 0.72 || e > 0.8
              ? P.flame2
              : e > 0.45 || v > 0.45
                ? P.flame1
                : v > 0.15
                  ? P.flame0
                  : P.flameCore;
          if (boost > 0.3 && v < 0.45 && e < 0.5) c = P.flameCore;
          f.set(x, y, c);
        }
      }
      // sparks fly when it roars
      if (boost > 0.05) {
        for (let i = 0; i < 12; i++) {
          const p = (t / 900 + hash2(i, 1, fl.x)) % 1;
          if (hash2(i, Math.floor(t / 60), 3) > boost + 0.2) continue;
          const sx = cx0 + (hash2(i, 2, fl.x) - 0.5) * 12 * p + lean * 26 * p;
          const sy = fl.top - H * 0.6 - p * 30;
          f.set(sx, sy, p < 0.5 ? P.flame0 : P.flame2);
        }
      }
    }

    const flareBoost = (i: number, t: number) => {
      const a = t - flareAt[i]!;
      if (a < 0 || a > 4200) return 0;
      return a < 200 ? a / 200 : (1 - (a - 200) / 4000) ** 1.4;
    };

    /**
     * A nodding donkey, well on the left: a skid, an A-frame samson post
     * carrying the walking beam, the horsehead whose arc face keeps the
     * polished rod plumb over the wellhead, and at the back the gearbox whose
     * crank and counterweight turn and pull the beam down through the
     * pitman arm. The beam's angle is solved from that four-bar linkage, so
     * it nods the way the real thing does. s scales it for distance.
     */
    function pumpJack(
      f: Frame,
      x: number,
      base: number,
      t: number,
      phase: number,
      s: number
    ) {
      const R = (v: number) => Math.round(v * s);
      const A = 10 * s; // pivot to the horsehead's face
      const C = 8 * s; // pivot to the equaliser
      const r = 2 * s; // crank radius
      const py = base - R(11); // saddle bearing
      const gx = x + R(9); // crank shaft, on top of the gearbox
      const gy = base - R(6);
      const L = Math.hypot(gx - (x + C), gy - py); // pitman arm
      const phi = t / 1500 + phase;
      const kx = gx + r * Math.cos(phi);
      const ky = gy + r * Math.sin(phi);
      const dx = kx - x;
      const dy = ky - py;
      const dd = Math.hypot(dx, dy);
      const be =
        Math.atan2(dy, dx) -
        Math.acos(
          Math.max(-1, Math.min(1, (C * C + dd * dd - L * L) / (2 * C * dd)))
        );
      const ux = Math.cos(be);
      const uy = Math.sin(be);
      const ex = x + C * ux;
      const ey = py + C * uy;
      // the head end's frame: along the beam towards the head, and below it
      const at = (a: number, b: number): [number, number] => [
        x - a * ux - b * uy,
        py - a * uy + b * ux,
      ];
      const wx = Math.round(x - A); // the well, plumb under the face
      // skid, and the shadow it casts on the snow
      f.hline(wx - 5, gx + R(8), base + 1, P.snowShadow);
      f.hline(wx - 1, gx + R(7), base, P.pj);
      // gearbox and the motor behind it, snow on their tops
      f.rect(gx - R(2), gy + 1, R(5), base - gy - 1, P.pj);
      f.hline(gx - R(2), gx + R(2), gy + 1, P.pjSnow);
      const mx = gx + R(4);
      f.rect(mx, base - R(3), R(3), R(3), P.pj);
      f.hline(mx, mx + R(3) - 1, base - R(3), P.pjSnow);
      // samson post: an A-frame with a brace
      f.line(x - R(4), base - 1, x - 1, py + 1, P.pjHi);
      f.line(x + R(4), base - 1, x + 1, py + 1, P.pj);
      // crank and counterweight, turning on the gearbox
      // (on whole pixels, so the glint stays on the weight as it turns)
      const cwx = Math.round(gx + Math.cos(phi) * 2.3 * s);
      const cwy = Math.round(gy + Math.sin(phi) * 2.3 * s);
      const cwr = Math.max(0.8, 1.5 * s);
      f.disc(cwx, cwy, cwr, P.pjHead);
      f.set(cwx - 1, cwy - (cwr > 1.4 ? 1 : 0), P.pjHeadHi);
      f.set(gx, gy, P.pjHi);
      // pitman arm from the crank pin up to the equaliser
      f.line(kx, ky, ex, ey + 1, P.pjHi);
      // walking beam: a dark girder lit along its top
      const [b0x, b0y] = at(A - 4 * s, 0);
      const [b1x, b1y] = at(-C - 1, 0);
      f.line(b0x, b0y, b1x, b1y, P.pj);
      f.line(b0x, b0y - 1, b1x, b1y - 1, P.pjHi);
      f.rect(x - 1, py, 3, 2, P.pj); // saddle bearing
      // horsehead: a curved wedge whose face is an arc about the bearing
      const head: [number, number][] = [at(A - 3.6 * s, -2.4 * s)];
      for (let d = -0.24; d <= 0.6; d += 0.07)
        head.push(at(A * Math.cos(d), A * Math.sin(d)));
      head.push(at(A - 2 * s, 5 * s));
      head.push(at(A - 3.4 * s, 2.4 * s));
      head.push(at(A - 5.2 * s, 0.4 * s));
      f.poly(head, P.pjHead);
      // its lit face, kept on the head itself through the whole stroke
      for (let d = -0.22; d <= 0.6; d += 0.05) {
        const [faceX, faceY] = at(A * Math.cos(d), A * Math.sin(d));
        const hx = Math.round(faceX);
        const hy = Math.round(faceY);
        if (f.get(hx, hy) === P.pjHead) f.set(hx, hy, P.pjHeadHi);
      }
      // bridle down from the face, carrier bar and polished rod, rising and
      // falling plumb over the wellhead
      const yc = Math.round(py + 3.4 * s - A * be);
      if (yc > py + 1) f.vline(wx, py + 1, yc - 1, P.pj);
      f.hline(wx - 1, wx + 1, yc, P.pj);
      f.vline(wx, yc + 1, base - 3, P.pjRod);
      f.rect(wx - 1, base - 2, 3, 2, P.pj);
      f.set(wx, base - 3, P.pjHi);
      f.hline(wx - 4, wx - 2, base - 1, P.pj); // flow line
    }

    function truck(f: Frame, t: number) {
      const PERIOD = 29_000;
      const DUR = 15_000;
      const p = ((t + 4000) % PERIOD) / DUR;
      if (p > 1) return;
      const dir = Math.floor((t + 4000) / PERIOD) % 2 ? 1 : -1;
      const x = Math.round(
        dir === 1 ? -30 + p * (w + 60) : w + 30 - p * (w + 60)
      );
      const y = ROAD;
      // a flatbed loaded with pipes, a boxy cab with the light on inside
      const bx = dir === 1 ? x : x + 7;
      f.rect(bx, y - 4, 16, 2, P.truck);
      f.hline(bx, bx + 15, y - 5, P.pipeHi);
      f.hline(bx, bx + 15, y - 6, P.pipe);
      f.hline(bx + 1, bx + 14, y - 7, P.pipeSnow);
      const cx = dir === 1 ? x + 17 : x;
      f.rect(cx, y - 8, 6, 6, P.truckCab);
      f.rect(cx + (dir === 1 ? 3 : 0), y - 7, 3, 2, P.winWarm);
      f.hline(cx, cx + 5, y - 9, P.roofSnowHi);
      f.hline(x, x + 22, y - 2, P.truck);
      for (const wx of [x + 3, x + 11, x + 19])
        f.hline(wx, wx + 1, y - 1, P.jack);
      const nose = dir === 1 ? cx + 6 : cx - 1;
      f.set(nose, y - 3, P.headlight);
      glow(f, nose + dir * 8, y - 2, 11, P.headlight, 0.32, 0.35, 0.18);
      f.set(dir === 1 ? x : x + 22, y - 3, P.beacon);
    }

    // ---------- the bear ----------
    // Now and then a bear pedals along the track, playing the balalaika.
    // He keeps his own clock: it runs with real time while he rides and
    // eases to a halt whenever he's clicked and stops to play, so where he
    // is stays a closed-form function of time.
    const BEAR_V = 0.0125; // px per ms
    // brake, a rousing tune, the bell, ride on
    const STOP = 4300;
    const TUNE = [300, 2700] as const; // strumming away
    const BELL = [2700, 3700] as const; // paw on the bell
    const EASE_IN = 350;
    const EASE_OUT = 600;
    const crossMs = (w + 70) / BEAR_V;
    const bearPeriod = crossMs + 24_000;
    const BEAR_OFF = 10_000; // his first ride starts after the 404 still
    // his stops: to play his tune (STOP long), or, quietly, to wait while
    // the group has the park
    type Stop = { at: number; len: number; tune: boolean };
    const stops: Stop[] = [];
    // when the bell on the post calls him in: his clock jumps him to just
    // out of sight, then runs fast (he pedals like mad) and eases back to
    // normal over S ms, just as he brakes beside the post
    type Sprint = { at: number; jump: number; S: number; k: number };
    const sprints: Sprint[] = [];
    let lostBase = 0;
    /** How much of his clock a stop has eaten, s ms after it began. */
    const lostIn = (s: number, len = STOP) => {
      if (s <= 0) return 0;
      if (s < EASE_IN) return (s * s) / (2 * EASE_IN);
      const hold = len - EASE_OUT;
      if (s < hold) return EASE_IN / 2 + (s - EASE_IN);
      const u = Math.min(EASE_OUT, s - hold);
      return EASE_IN / 2 + (hold - EASE_IN) + u - (u * u) / (2 * EASE_OUT);
    };
    /** How far a sprint has pushed his clock on, s ms after the call. */
    const gainIn = (sp: Sprint, s: number) => {
      if (s < 0) return 0;
      const u = Math.min(1, s / sp.S);
      return sp.jump + sp.k * sp.S * (u - (u * u * u) / 3);
    };
    const bearClock = (t: number) => {
      let c = t - lostBase;
      for (const sp of sprints) c += gainIn(sp, t - sp.at);
      for (const st of stops) c -= lostIn(t - st.at, st.len);
      return c;
    };
    /** The stop running at t, as ms since it began, or -1. */
    const stopAge = (t: number) => {
      for (const st of stops)
        if (t >= st.at && t < st.at + st.len) return t - st.at;
      return -1;
    };
    /** How hard he's pedalling on a sprint: 0 cruising, up to 1 flat out. */
    const sprintAt = (t: number) => {
      for (const sp of sprints) {
        const s = t - sp.at;
        if (s >= 0 && s < sp.S && sp.k > 0) return 1 - (s / sp.S) ** 2;
      }
      return 0;
    };
    /** Whether his show (a sprint in, the stop, the tune) is under way. */
    const bearBusy = (t: number) =>
      stops.some((st) => t < st.at + st.len) ||
      sprints.some((sp) => t >= sp.at && t < sp.at + sp.S);
    type BearAt = { x: number; y: number; dir: number; d: number };
    const bearAt = (t: number): BearAt | null => {
      const c = bearClock(t) - BEAR_OFF;
      const n = Math.floor(c / bearPeriod);
      const a = c - n * bearPeriod;
      if (a > crossMs) return null;
      const dir = n % 2 === 0 ? 1 : -1;
      const d = a * BEAR_V;
      const wob = Math.sin(a / 800) * 1.4;
      const x = dir > 0 ? -35 + d + wob : w + 35 - d - wob;
      return { x, y: trackY(Math.round(x)), dir, d };
    };
    // he plays in phrases, with a breather in between
    const playing = (t: number) => ((t % 5600) + 5600) % 5600 < 3400;

    function bearPose(b: BearAt, t: number): BearPose {
      const s = stopAge(t);
      const crank = b.d / 4.5;
      const sprint = sprintAt(t);
      const st = stops.find((q) => t >= q.at && t < q.at + q.len);
      if (st && !st.tune) {
        // waiting quietly, a foot down, balalaika still, watching the park
        return {
          wheel: b.d / 3,
          crank,
          bob: 0,
          lean: 0,
          strum: -1,
          bell: false,
          ring: -1,
          foot: s > EASE_IN && s < st.len - EASE_OUT + 100,
          flap: t / 300,
        };
      }
      const stopped = s >= 0;
      let strum = -1;
      if (stopped && s >= TUNE[0] && s < TUNE[1])
        strum = Math.floor(s / 70) % 2;
      else if (!sprint && (!stopped || s >= BELL[1]) && playing(t))
        strum = Math.floor(t / 190) % 2;
      const posed = stopped && s > TUNE[0] && s < BELL[1];
      return {
        wheel: b.d / 3,
        crank,
        bob: posed ? Math.max(0, strum) : Math.floor(crank / (Math.PI / 2)) % 2,
        // racing in, he hunches over the bars
        lean: posed
          ? 0
          : sprint > 0.2
            ? 1
            : Math.round(Math.sin(t / 1100) * 0.7),
        strum,
        bell: stopped && s >= BELL[0] && s < BELL[1],
        ring:
          stopped && s >= BELL[0] + 50 && s < BELL[1] + 40
            ? ((s - BELL[0] - 50) % 330) / 330
            : -1,
        foot: stopped && s > EASE_IN && s < BELL[1] + 100,
        flap: t / (sprint > 0.2 ? 60 : 150),
      };
    }

    const NOTES = [
      ['.##', '.#.', '##.', '##.'],
      ['.####', '.#..#', '##.##', '##.##'],
    ] as const;
    function note(f: Frame, x: number, y: number, kind: number, v: number) {
      const c = v < 0.12 ? P.noteHi : v > 0.72 ? P.noteDim : P.note;
      const rows = NOTES[kind % 2]!;
      const nx = Math.round(x);
      const ny = Math.round(y);
      // a dark drop shadow keeps them legible over lit windows and snow
      for (const [dx, col] of [
        [1, P.noteSh],
        [0, c],
      ] as const)
        for (let r = 0; r < rows.length; r++)
          for (let i = 0; i < rows[r]!.length; i++)
            if (rows[r]![i] === '#') f.set(nx + i + dx, ny + r + dx, col);
    }

    function bear(f: Frame, t: number) {
      const b = bearAt(t);
      if (b) {
        drawBear(f, b.x, b.y, b.dir, bearPose(b, t));
        // the dynamo lamp throws a little warm light on the track ahead
        const s = stopAge(t);
        if (s < 0 || s > STOP - EASE_OUT) {
          for (let k = 2; k < 14; k++)
            for (let j = -1; j <= 0; j++)
              f.blend(
                b.x + b.dir * (6 + k),
                b.y + j + (k > 8 ? 1 : 0),
                P.lampWarm,
                0.3 * (1 - k / 14)
              );
        }
      }
      // notes float up off the balalaika while he plays
      const LIFE = 2200;
      const EVERY = 420;
      for (let k = Math.floor((t - LIFE) / EVERY) + 1; k * EVERY <= t; k++) {
        const e = k * EVERY;
        if (!playing(e) || stopAge(e) >= 0 || sprintAt(e) > 0) continue;
        const eb = bearAt(e);
        if (!eb) continue;
        const age = t - e;
        note(
          f,
          eb.x +
            eb.dir * 7 +
            Math.sin(age / 300 + k) * 1.8 -
            eb.dir * age * 0.004 -
            1,
          eb.y - 21 - age * 0.012,
          hash2(k, 1, 77) > 0.7 ? 1 : 0,
          age / LIFE
        );
      }
      // racing in: snow sprays up off the back wheel
      const sp = sprintAt(t);
      if (b && sp > 0.05) {
        for (let i = 0; i < 14; i++) {
          const q = (t / 260 + hash2(i, 1, 81)) % 1;
          if (hash2(i, 2, 81) > sp + 0.15) continue;
          const sx = b.x - b.dir * (9 + q * 16 + hash2(i, 3, 81) * 4);
          const sy = b.y - 2 - q * 7 + q * q * 9;
          f.set(sx, sy, q < 0.5 ? P.flake : P.flakeDim);
        }
      }
      for (const { at, tune } of stops) {
        const s = t - at;
        if (!tune || s < 0 || s > STOP + 1800) continue;
        const sb = bearAt(at + 1000);
        if (!sb) continue;
        // the skid: a fan of snow thrown forward off the wheels
        if (s < 650) {
          for (let i = 0; i < 18; i++) {
            const d = s / 650 - hash2(i, 1, 83) * 0.25;
            if (d < 0 || d > 0.85) continue;
            const ang = -0.25 - hash2(i, 2, 83) * 1.1;
            const r = d * (10 + hash2(i, 3, 83) * 12);
            const sx = sb.x + sb.dir * (8 + Math.cos(ang) * r);
            const sy = sb.y - 1 + Math.sin(ang) * r + d * d * 14;
            f.set(sx, sy, d < 0.5 ? P.flake : P.flakeDim);
            if (i % 3 === 0 && d < 0.5) f.set(sx + sb.dir, sy, P.flake);
          }
        }
        // the tune: a fountain of notes, thrown high and wide off the
        // strings, drifting on up as they fade
        const NOTE_EVERY = 55;
        const NOTE_LIFE = 2000;
        const n = Math.floor((TUNE[1] - TUNE[0]) / NOTE_EVERY);
        for (let i = 0; i < n; i++) {
          const age = s - TUNE[0] - i * NOTE_EVERY;
          if (age < 0 || age > NOTE_LIFE) continue;
          const side = i % 2 ? 1 : -1;
          const ang =
            -Math.PI / 2 + side * (0.15 + hash2(i, 1, 79) * 1.05) * 0.95;
          const v = 0.07 + hash2(i, 2, 79) * 0.05;
          const reach = v * 650 * (1 - Math.exp(-age / 650));
          note(
            f,
            sb.x + sb.dir * 2 + Math.cos(ang) * reach * 1.2 - 1,
            sb.y - 14 + Math.sin(ang) * reach - age * 0.006,
            hash2(i, 3, 79) > 0.6 ? 1 : 0,
            age / NOTE_LIFE
          );
        }
        // his bell, answering: rings of sound rolling out over the snow
        for (let k = 0; k < 3; k++) {
          const ra = s - BELL[0] - 50 - k * 330;
          if (ra < 0 || ra > 900) continue;
          soundRings(
            f,
            sb.x + sb.dir * 7,
            sb.y - 11,
            4 + ra * 0.045,
            1 - ra / 900
          );
        }
      }
    }

    /** Arcs of sound spreading from a ringing bell: r is the radius. */
    function soundRings(f: Frame, x: number, y: number, r: number, a: number) {
      for (const [rr, c] of [
        [r, P.noteHi],
        [r * 0.62, P.note],
      ] as const) {
        if (rr < 2) continue;
        const steps = Math.ceil(rr * 3);
        for (let k = 0; k <= steps; k++) {
          const ang = -Math.PI + (k / steps) * Math.PI;
          // just the two side arcs, like the ripples in a cartoon
          if (Math.abs(Math.cos(ang)) < 0.45) continue;
          const px = Math.round(x + Math.cos(ang) * rr);
          const py = Math.round(y + Math.sin(ang) * rr * 0.75);
          f.dset(px, py, c, a);
        }
      }
    }

    function walker(f: Frame, t: number) {
      const PERIOD = 46_000;
      const p = ((t + 9000) % PERIOD) / PERIOD;
      const x = Math.round(-20 + p * (w + 40));
      const y = PATH;
      const step = Math.floor(t / 260) % 2;
      // he steps out of the way while the group has the park to itself
      const s = meetAge(t);
      const a =
        s < 0 ? 1 : Math.max(0, 1 - s / 300, (s - MEET.end + 700) / 700);
      if (a <= 0) return;
      // a bundled-up figure in an ushanka, towing a child on a sled
      f.drect(x, y - 9, 3, 6, P.coat, a);
      f.drect(x, y - 11, 3, 2, P.hat, a);
      f.dset(x - 1, y - 10, P.hat, a);
      f.dset(x + 3, y - 10, P.hat, a);
      f.dset(x + (step ? 0 : 2), y - 3, P.person, a);
      f.dset(x + (step ? 2 : 0), y - 2, P.person, a);
      f.dset(x + 1, y - 3, P.person, a);
      seg(f, x, y - 6, x - 6, y - 2, P.person, a);
      f.drect(x - 13, y - 1, 8, 1, P.sled, a);
      f.dset(x - 13, y - 2, P.sled, a);
      f.drect(x - 11, y - 5, 3, 4, P.kid, a);
      f.drect(x - 11, y - 7, 3, 2, P.sled, a);
    }

    /** A one-pixel line, dithered by `a`. */
    function seg(
      f: Frame,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      c: RGB,
      a = 1
    ) {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
      for (let i = 0; i <= n; i++)
        f.dset(
          Math.round(x0 + ((x1 - x0) * i) / n),
          Math.round(y0 + ((y1 - y0) * i) / n),
          c,
          a
        );
    }

    // ---------- the park ----------

    /** The lanterns' light, turned up while the group's in the park. */
    function parkLights(f: Frame, t: number) {
      const top = PATH - 21;
      for (const lx of lanterns) {
        const b = lampBoost(t, lx);
        // each one flares as it comes on
        const on = meetAge(t) - Math.abs(lx - benchX) * 4;
        if (on >= 0 && on < 500)
          glow(
            f,
            lx + 0.5,
            top + 3,
            6 + on * 0.03,
            P.lanternHi,
            0.7 * (1 - on / 500),
            1,
            0.1
          );
        glow(
          f,
          lx + 0.5,
          top + 3,
          7 + b * 9,
          P.lampWarm,
          0.42 + b * 0.3,
          1,
          0.1
        );
        glow(
          f,
          lx + 0.5,
          PATH,
          13 + b * 12,
          P.glowWarm,
          0.3 + b * 0.25,
          0.32,
          0.1
        );
        f.rect(lx, top + 2, 2, 3, b > 0.5 ? P.lanternHi : P.lantern);
        f.set(lx, top + 2, P.lanternHi);
      }
      // the old street lamp joins in
      const b = lampBoost(t, lampX);
      if (b > 0)
        glow(
          f,
          lampX - 5.5,
          BASE - 24,
          8 + b * 10,
          P.lampWarm,
          b * 0.4,
          1,
          0.1
        );
      // the bench, lit up as it's clicked: a warm pool spreading over it
      const s = meetAge(t);
      if (s >= 0 && s < 1600) {
        const u = s / 1600;
        glow(
          f,
          benchX,
          BENCH_Y - 4,
          10 + ease(s / 600) * 40,
          P.glowWarm,
          0.6 * (1 - u * u),
          0.55,
          0.08
        );
        // and a ring of light running out across the snow, two deep
        for (const lag of [0, 260]) {
          const ra = s - lag;
          if (ra < 0 || ra > 1000) continue;
          const R = 6 + ease(ra / 1000) * 64;
          const al = 0.75 * (1 - ra / 1000);
          const steps = Math.ceil(R * 7);
          for (let k = 0; k < steps; k++) {
            const ang = (k / steps) * Math.PI * 2;
            const rx = benchX + Math.cos(ang) * R;
            const ry = BENCH_Y - 3 + Math.sin(ang) * R * 0.3;
            f.blend(rx, ry, P.lanternHi, al);
            f.blend(rx, ry + 1, P.lampCone, al * 0.6);
          }
        }
      }
    }

    /** Glints on the bench's snow as it's clicked. */
    function benchGlints(f: Frame, t: number) {
      const s = meetAge(t);
      if (s < 0 || s > 1100) return;
      for (let i = 0; i < 9; i++) {
        const ph = s / 110 - i * 1.3;
        if (ph < 0 || ph > 4) continue;
        const gx0 = benchX - 10 + Math.round(hash2(i, 1, 93) * 20);
        const gy0 = BENCH_Y - (hash2(i, 2, 93) > 0.5 ? 10 : 4);
        sparkle4(f, gx0, gy0, ph < 1 || ph > 3 ? 0 : 1, P.lanternHi, 1);
      }
    }

    /** A four-pointed glint: size 0 is a dot, 1 a little cross, 2 a star. */
    function sparkle4(
      f: Frame,
      x: number,
      y: number,
      size: number,
      c: RGB,
      a: number
    ) {
      x = Math.round(x);
      y = Math.round(y);
      f.dset(x, y, P.lanternHi, a);
      for (let r = 1; r <= size; r++) {
        f.dset(x - r, y, c, a);
        f.dset(x + r, y, c, a);
        f.dset(x, y - r, c, a);
        f.dset(x, y + r, c, a);
      }
    }

    /** The bell on the post, rung: it shines and rings out. */
    function postBell(f: Frame, t: number) {
      const s = t - postRingAt;
      if (s < 0 || s > 1300) return;
      const bx = postX + 2;
      const by = POST_Y - 6;
      if (s < 700 && Math.floor(s / 90) % 2 === 0) {
        f.set(bx, by - 1, P.noteHi);
        f.set(bx + 1, by - 1, P.noteHi);
      }
      for (let k = 0; k < 2; k++) {
        const ra = s - k * 330;
        if (ra < 0 || ra > 950) continue;
        soundRings(f, bx + 1, by - 1, 4 + ra * 0.05, 1 - ra / 950);
      }
    }

    // ---------- 'bench' ----------
    type Who = {
      top: Sprite;
      sit: Sprite;
      pal: Record<string, RGB>;
      arm: RGB;
      legs?: readonly [Sprite, Sprite, Sprite]; // stride, passing, standing
    };
    const MAN_P: Who = {
      top: MAN_TOP,
      sit: MAN_SIT,
      pal: {
        H: P.hair,
        h: P.hairHi,
        Y: P.beard,
        s: P.skin,
        S: P.skinSh,
        r: P.manScarf,
        R: P.manScarfSh,
        J: P.parka,
        j: P.parkaHi,
        K: P.parkaSh,
        B: P.jeans,
        b: P.jeansHi,
        e: P.boot,
      },
      arm: P.parkaSh,
    };
    const WOMAN_P: Who = {
      top: WOMAN_TOP,
      sit: WOMAN_SIT,
      pal: {
        p: P.knit,
        C: P.knit,
        c: P.knitSh,
        H: P.womanHair,
        h: P.womanHairHi,
        s: P.skin,
        D: P.womanCoat,
        d: P.womanCoatSh,
        w: P.womanCoatHi,
        B: P.tights,
        b: P.tights,
        e: P.boot,
      },
      arm: P.womanCoatSh,
    };
    const LADY_P: Who = {
      top: LADY_TOP,
      sit: LADY_SIT,
      pal: {
        H: P.ladyHair,
        h: P.ladyHairHi,
        s: P.skin,
        M: P.ladyCoat,
        m: P.ladyCoatSh,
        n: P.ladyCoatHi,
        q: P.ladyQuilt,
        B: P.jeans,
        b: P.jeansHi,
        e: P.boot,
      },
      arm: P.ladyCoatSh,
    };
    // where the teen stands, behind the bench
    const TEEN_FEET = BENCH_Y - 5;
    const TEEN_P: Who = {
      top: TEEN_TOP,
      sit: TEEN_FRONT,
      pal: {
        k: P.beanie,
        H: P.teenHair,
        s: P.skin,
        Y: P.teenCoat,
        y: P.teenCoatHi,
        q: P.teenCoatSh,
        B: P.teenLegs,
        b: P.teenLegsHi,
        e: P.boot,
      },
      arm: P.teenCoatSh,
      legs: [LONG_STRIDE, LONG_PASS, LONG_STAND],
    };
    /** A palette pulled k of the way towards `to` (into the dark). */
    const tintPal = (pal: Record<string, RGB>, to: RGB, k: number) => {
      if (k <= 0) return pal;
      const out: Record<string, RGB> = {};
      for (const key in pal) out[key] = lerpRGB(pal[key]!, to, k);
      return out;
    };
    /**
     * Someone walking or standing, feet on y, centred on cx; faces right
     * unless flipped. step: -1 standing, else the stride frame. `dark` pulls
     * them into the shadows. Returns where the near shoulder is.
     */
    function walkFig(
      f: Frame,
      who: Who,
      cx: number,
      y: number,
      flip: boolean,
      step: number,
      a: number,
      dark = 0
    ) {
      const x = Math.round(cx) - 3;
      const [ls, lp, lst] = who.legs ?? [LEGS_STRIDE, LEGS_PASS, LEGS_STAND];
      const legs = step < 0 ? lst : step % 2 ? ls : lp;
      const hip = y - legs.length + 1;
      const top = hip - who.top.length;
      const pal = tintPal(who.pal, P.snowShadow, dark);
      spr(f, legs, x, hip, pal, flip, a);
      spr(f, who.top, x, top, pal, flip, a);
      return {
        sx: flip ? x + 2 : x + 4,
        sy: top + 6,
        x,
        top,
        arm: lerpRGB(who.arm, P.snowShadow, dark),
      };
    }

    function benchGroup(f: Frame, t: number) {
      const s = meetAge(t);
      if (s < MEET.in0) return;
      const y = PATH + 1;
      // out of the dark at the ends of the path, and at the end, a fade
      const a =
        s > MEET.fade0
          ? Math.max(0, 1 - (s - MEET.fade0) / (MEET.end - MEET.fade0))
          : 1;
      const D = 46;
      if (s < MEET.in1) {
        // along the path from both ends: the couple hand in hand from the
        // left, the lady from the right, hurrying the last bit
        const u = (s - MEET.in0) / (MEET.in1 - MEET.in0);
        const e = 1 - (1 - u) ** 1.4;
        const walked = D * e;
        const step = Math.floor(walked / 3.2) % 2;
        const fa = Math.min(1, (s - MEET.in0) / 120);
        const dark = Math.max(0, 0.75 - (s - MEET.in0) / 700);
        const mk = meetX - 5 - D + walked;
        const mu = meetX + 5 + D - walked;
        const wf = walkFig(f, WOMAN_P, mk - 6, y, false, step, fa, dark);
        const mf = walkFig(f, MAN_P, mk, y, false, step, fa, dark);
        // holding hands
        seg(f, wf.sx, wf.sy, wf.sx + 2, wf.sy + 3, wf.arm, fa);
        seg(f, mf.sx - 2, mf.sy + 1, mf.sx - 3, mf.sy + 3, mf.arm, fa);
        // the near arm swinging
        seg(f, mf.sx, mf.sy, mf.sx + (step ? 1 : -1), mf.sy + 4, mf.arm, fa);
        // the teen, all legs, a step behind the lady, hands swinging
        const bf = walkFig(f, TEEN_P, mu + 7, y - 1, true, step, fa, dark);
        seg(f, bf.sx, bf.sy, bf.sx + (step ? -1 : 1), bf.sy + 5, bf.arm, fa);
        const uf = walkFig(f, LADY_P, mu, y, true, (step + 1) % 2, fa, dark);
        if (u > 0.55) {
          // arms flung wide as she comes
          seg(f, uf.sx, uf.sy, uf.sx - 3, uf.sy - 3, uf.arm, fa);
          seg(f, uf.sx + 2, uf.sy, uf.sx + 5, uf.sy - 3, uf.arm, fa);
        } else {
          seg(f, uf.sx, uf.sy, uf.sx + (step ? 1 : -1), uf.sy + 4, uf.arm, fa);
        }
        return;
      }
      if (s < MEET.hug1) {
        // the hug: they step in close and rock, arms round each other: the
        // man's round the lady's back, hers up round his shoulders, and the
        // woman's round the both of them
        const hb = s - MEET.in1;
        const close = ease(hb / 160);
        const sway =
          hb > 250 ? Math.round(Math.sin((hb - 250) / 200) * 0.8) : 0;
        const mk = meetX - 5 + close * 2 + sway;
        const mu = meetX + 5 - close * 2 + sway;
        // the teen hangs back a beat, gangly, then gets pulled in
        const pulled = ease((hb - 380) / 200);
        const bf = walkFig(
          f,
          TEEN_P,
          meetX + 12 - pulled * 3 + sway,
          y - 1,
          true,
          -1,
          a
        );
        const wf = walkFig(f, WOMAN_P, mk - 6 + close, y, false, -1, a);
        const mf = walkFig(f, MAN_P, mk, y, false, -1, a);
        const uf = walkFig(f, LADY_P, mu, y, true, -1, a);
        seg(f, mf.sx, mf.sy + 2, uf.x + 5, mf.sy + 2, mf.arm, a);
        f.set(uf.x + 5, mf.sy + 1, mf.arm);
        seg(f, uf.sx, uf.sy, mf.x + 2, uf.sy, uf.arm, a);
        f.set(mf.x + 2, uf.sy + 1, uf.arm);
        seg(f, wf.sx, wf.sy + 1, mf.sx, wf.sy, wf.arm, a);
        if (pulled > 0.5) {
          // a long arm over the lady's shoulders to the man's, and a
          // slightly awkward pat
          const pat = Math.floor(hb / 180) % 2;
          seg(f, bf.sx, bf.sy, mf.x + 5, mf.sy - pat, bf.arm, a);
          f.dset(mf.x + 5, mf.sy - pat, P.skin, a);
        } else {
          // arms hanging, not quite sure what to do with them
          seg(f, bf.sx, bf.sy, bf.sx, bf.sy + 5, bf.arm, a);
        }
        return;
      }
      if (s < MEET.walk1) {
        // arm in arm along the path to the bench
        const u = (s - MEET.hug1) / (MEET.walk1 - MEET.hug1);
        const cx = meetX + (benchX - meetX) * ease(u);
        const spread = ease(u / 0.3);
        const walked = Math.abs(benchX - meetX) * ease(u);
        const step = u > 0.95 ? -1 : Math.floor(walked / 3.2) % 2;
        const mk = cx - 3 + 3 * spread;
        const wf = walkFig(f, WOMAN_P, mk - 5 - 3 * spread, y, false, step, a);
        const mf = walkFig(f, MAN_P, mk, y, false, step, a);
        // the teen loping along on the far side, hands in his pockets,
        // until he steps round behind the bench
        const g = teenWalk(s);
        if (g.round < 0.35) walkFig(f, TEEN_P, g.bx, g.y, g.flip, g.step, a);
        const uf = walkFig(f, LADY_P, mk + 6 + 2 * spread, y, false, step, a);
        // linked arms
        seg(f, wf.sx, wf.sy + 1, mf.x + 2, mf.sy + 2, wf.arm, a);
        seg(f, mf.sx, mf.sy + 1, uf.x + 2, uf.sy + 2, mf.arm, a);
        seg(f, uf.sx, uf.sy, uf.sx + (step ? 1 : 0), uf.sy + 4, uf.arm, a);
        return;
      }
      // sitting together on the bench, close, the man's arms round them both
      const sd = s - MEET.walk1;
      const settle = sd < 160 ? -2 : sd < 260 ? -1 : 0;
      const top = BENCH_Y - 4 - 8 + settle;
      const lean = sd > 700 ? 1 : 0;
      const seat = (who: Who, x: number, dx: number) => {
        spr(f, who.sit.slice(0, 5), x + dx, top, who.pal, false, a);
        spr(f, who.sit.slice(5), x, top + 5, who.pal, false, a);
      };
      // the teen's forearms along the top of the bench back, behind them
      const teenTop = TEEN_FEET - TEEN_FRONT.length + 1;
      seg(f, benchX + 1, teenTop + 6, benchX - 2, BENCH_Y - 10, TEEN_P.arm, a);
      seg(f, benchX - 2, BENCH_Y - 10, benchX - 4, BENCH_Y - 10, TEEN_P.arm, a);
      seg(f, benchX + 5, teenTop + 6, benchX + 8, BENCH_Y - 10, TEEN_P.arm, a);
      seg(
        f,
        benchX + 8,
        BENCH_Y - 10,
        benchX + 10,
        BENCH_Y - 10,
        TEEN_P.arm,
        a
      );
      f.dset(benchX - 5, BENCH_Y - 10, P.skin, a);
      f.dset(benchX + 11, BENCH_Y - 10, P.skin, a);
      seat(WOMAN_P, benchX - 8, lean);
      seat(LADY_P, benchX + 4, -lean);
      seat(MAN_P, benchX - 2, 0);
      if (sd > 450) {
        // his arms round their shoulders
        seg(f, benchX - 3, top + 5, benchX - 8, top + 5, MAN_P.arm, a);
        seg(f, benchX + 3, top + 5, benchX + 8, top + 5, MAN_P.arm, a);
      }
      // as it fades, a few warm glints drift up off the bench
      if (s > MEET.fade0 - 200) {
        const fs = s - MEET.fade0 + 200;
        for (let i = 0; i < 8; i++) {
          const ga = fs - i * 90;
          if (ga < 0 || ga > 900) continue;
          sparkle4(
            f,
            benchX - 9 + hash2(i, 1, 99) * 18,
            top + 4 - ga * 0.02,
            Math.floor(ga / 150 + i) % 3 === 0 ? 1 : 0,
            P.spark,
            1 - ga / 900
          );
        }
      }
    }

    /** The teen on the way to the bench: beside the lady, then round. */
    function teenWalk(s: number) {
      const u = (s - MEET.hug1) / (MEET.walk1 - MEET.hug1);
      const cx = meetX + (benchX - meetX) * ease(u);
      const spread = ease(u / 0.3);
      const beside = cx - 3 + 3 * spread + 6 + 2 * spread + 7;
      const round = ease((u - 0.6) / 0.4);
      const walked = Math.abs(benchX - meetX) * ease(u);
      return {
        bx: beside + (benchX + 2 - beside) * round,
        y: PATH - Math.round(round * (PATH - TEEN_FEET)),
        flip: u < 0.08,
        step: u > 0.95 ? -1 : Math.floor(walked / 3.6) % 2,
        round,
      };
    }

    /**
     * Behind the bench: the teen, loping along at the far side of the
     * group, hands in his pockets, then standing behind the bench.
     */
    function benchGroupBack(f: Frame, t: number) {
      const s = meetAge(t);
      if (s < MEET.hug1) return;
      const a =
        s > MEET.fade0
          ? Math.max(0, 1 - (s - MEET.fade0) / (MEET.end - MEET.fade0))
          : 1;
      if (s < MEET.walk1) {
        const g = teenWalk(s);
        if (g.round >= 0.35) walkFig(f, TEEN_P, g.bx, g.y, g.flip, g.step, a);
        return;
      }
      spr(
        f,
        TEEN_FRONT,
        benchX + 1,
        TEEN_FEET - TEEN_FRONT.length + 1,
        TEEN_P.pal,
        false,
        a
      );
    }

    /** The hug's warmth: a glow, glints, and their breath in the frost. */
    function warmth(f: Frame, t: number) {
      const hb = meetAge(t) - MEET.in1;
      if (hb < 0 || hb > 2600) return;
      const cy = PATH - 8;
      glow(
        f,
        meetX,
        cy,
        8 + ease(hb / 600) * 26,
        P.glowWarm,
        0.5 * (1 - hb / 2600),
        0.85,
        0.08
      );
      // glints, thrown out round them and twinkling
      for (let i = 0; i < 16; i++) {
        const ga = hb - hash2(i, 1, 95) * 500;
        if (ga < 0 || ga > 1800) continue;
        const ang = (i / 16) * Math.PI * 2 + hash2(i, 2, 95);
        const rr = 9 + (6 + hash2(i, 3, 95) * 16) * ease(ga / 700);
        const tw = Math.floor(ga / 120 + i) % 4;
        sparkle4(
          f,
          meetX + Math.cos(ang) * rr * 1.3,
          cy - 2 + Math.sin(ang) * rr * 0.85 - ga * 0.004,
          tw === 0 ? 0 : tw === 2 && i % 2 ? 2 : 1,
          i % 3 ? P.spark : P.lantern,
          Math.min(1, (1800 - ga) / 500)
        );
      }
      // laughing breath, puffing up from each of them into the frost
      const px = f.pixels;
      for (let i = 0; i < 16; i++) {
        const pa = hb - i * 120;
        if (pa < 0 || pa > 1400) continue;
        const who = i % 4;
        const hx =
          meetX + (who === 0 ? -6 : who === 1 ? -1 : who === 2 ? 1 : 5);
        const u = pa / 1400;
        const out = who >= 2 ? 1 : who === 1 ? -0.3 : 0.5;
        const bx = hx + out * (1 + u * 7) + Math.sin(pa / 200 + i) * 1.2;
        const by = PATH - (who === 3 ? 14 : 13) - u * 16;
        const r = 1.3 + u * 3;
        const al = 0.85 * (1 - u * u);
        for (let yy = Math.floor(by - r); yy <= by + r; yy++)
          for (let xx = Math.floor(bx - r); xx <= bx + r; xx++) {
            if (xx < 0 || xx >= w || yy < 0 || yy >= h) continue;
            const q = Math.hypot(xx - bx, yy - by) / r;
            if (q < 1) mix(px, yy * w + xx, P.breath, q < 0.6 ? al : al * 0.45);
          }
      }
    }

    /** The snow on the bench, brushed off as they sit down. */
    function benchPuff(f: Frame, t: number) {
      const sd = meetAge(t) - MEET.walk1;
      if (sd < 0 || sd > 700) return;
      for (let i = 0; i < 14; i++) {
        const d = sd / 700 - hash2(i, 1, 97) * 0.2;
        if (d < 0 || d > 0.8) continue;
        const side = i % 2 ? 1 : -1;
        const x0 = benchX + side * (2 + hash2(i, 2, 97) * 9);
        f.set(
          x0 + side * d * 9,
          BENCH_Y - 4 - d * 8 + d * d * 12,
          d < 0.4 ? P.flake : P.flakeDim
        );
      }
    }

    function dog(f: Frame, t: number) {
      const x = doorX - 10;
      const y = BASE + 1;
      // the laika perks up and wags hard while the bear rides past
      const b = bearAt(t);
      const near = !!b && Math.abs(b.x - x - 3) < 34;
      const up = near ? 1 : 0;
      // a laika sitting by the porch, tail curled, wagging now and then
      f.rect(x, y - 4, 5, 3, P.dog);
      f.rect(x + 3, y - 7 - up, 3, 3 + up, P.dog);
      f.set(x + 3, y - 8 - up, P.dog);
      f.set(x + 5, y - 8 - up, P.dog);
      f.set(x + 6, y - 6 - up, P.dogSh);
      f.vline(x + 3, y - 3, y - 1, P.dogSh);
      f.hline(x, x + 4, y - 1, P.dogSh);
      const wag = near
        ? Math.sin(t / 55) > 0
          ? 1
          : 0
        : Math.sin(t / 120) > 0 && t % 5000 < 1800
          ? 1
          : 0;
      f.set(x - 1, y - 5 - wag, P.dog);
      f.set(x, y - 6 - wag, P.dog);
      f.set(x - 1, y - 4, P.dogSh);
      // and woofs: little puffs of breath in the cold
      if (near && t % 900 < 260) {
        const p = (t % 900) / 260;
        f.set(x + 7 + Math.round(p * 2), y - 7 - Math.round(p), P.flake);
        if (p > 0.4) f.set(x + 8 + Math.round(p * 2), y - 8, P.flakeDim);
      }
    }

    function lightPools(f: Frame, t: number) {
      // window light falling on the snow in front of the house
      for (const [i, wn] of windows.entries()) {
        if (wn.lit === flipped.has(i)) continue;
        glow(f, wn.x + 2, wn.y + 3, 9, P.glowWarm, 0.36, 1, 0.2);
        if (wn.side) continue;
        for (let k = 0; k < 7; k++) {
          const y = BASE + 1 + k;
          const half = 3 + k * 0.6;
          const a = k < 3 ? 0.3 : 0.18;
          for (
            let x = Math.round(wn.x + 2 - half + k * 0.4);
            x <= wn.x + 2 + half + k * 0.4;
            x++
          )
            f.blend(x, y, P.glowWarm, a);
        }
      }
      // the street lamp: a cone of light with the snow drifting through it
      const lx = lampX - 5.5;
      const ly = BASE - 23;
      glow(f, lx, ly - 1, 9, P.lampWarm, 0.5, 1, 0.2);
      for (let y = ly + 1; y < BASE + 8; y++) {
        const k = (y - ly) / (BASE + 8 - ly);
        const half = 2 + k * 12;
        for (let x = Math.round(lx - half); x <= lx + half; x++) {
          const core = Math.abs(x - lx) < half * 0.55;
          f.blend(x, y, P.lampCone, core ? 0.26 : 0.13);
        }
      }
      glow(f, lx, BASE + 7, 18, P.glowWarm, 0.45, 0.28, 0.15);
      for (let i = 0; i < 12; i++) {
        const sp = 0.012 + hash2(i, 0, 61) * 0.008;
        const yy = ly + 2 + ((hash2(i, 1, 61) * 40 + t * sp) % (BASE + 8 - ly));
        const k = (yy - ly) / (BASE + 9 - ly);
        const xx =
          lx +
          (hash2(i, 2, 61) - 0.5) * 2 * (1 + k * 10) +
          Math.sin(t / 700 + i) * 1.2;
        f.set(xx, yy, P.winHi);
      }
      f.set(lampX - 6, BASE - 24, P.winHi);
      f.hline(lampX - 7, lampX - 4, BASE - 24, P.lampWarm);
      f.set(lampX - 5, BASE - 24, P.winHi);
      // porch light
      f.set(doorX + 2, BASE - 12, P.lampWarm);
      glow(f, doorX + 2, BASE - 12, 9, P.glowWarm, 0.3, 1, 0.2);
      // flares light the snow beneath them
      for (const [i, fl] of flares.entries()) {
        const b = flareBoost(i, t);
        glow(
          f,
          fl.x,
          HZ + 3,
          22 + b * 18,
          P.flareGlow,
          0.3 + b * 0.25,
          0.22,
          0.12
        );
      }
    }

    // ---------- hit tests ----------
    const onHouse = (x: number, y: number) =>
      x >= gx - 4 && x <= houseR + 2 && y >= chimTop - 2 && y < BASE + 2;
    const windowAt = (x: number, y: number) =>
      windows.findIndex(
        (wn) => x >= wn.x - 2 && x <= wn.x + 6 && y >= wn.y - 4 && y <= wn.y + 8
      );
    const flareAtXY = (x: number, y: number) =>
      flares.findIndex(
        (fl) => Math.abs(x - fl.x) < 6 && y > fl.top - 18 && y <= HZ
      );
    const treeAt = (x: number, y: number) => {
      for (const [i, tr] of bigTrees.entries()) {
        const v = (y - (h - tr.h)) / tr.h;
        if (v > 0 && Math.abs(x - tr.x) < 4 + v * tr.h * 0.22) return i;
      }
      for (const [i, b] of birches.entries()) {
        // low down there's only the trunk to click
        const reach = y > h - 4 - b.h * 0.45 ? 3 : 12;
        if (Math.abs(x - b.x) < reach && y > h - 4 - b.h && y < h - 4)
          return 2 + i;
      }
      for (const [i, b] of parkBirches.entries())
        if (
          Math.abs(x - b.x) < (y > PARK_BASE - 14 ? 2 : 9) &&
          y > PARK_BASE - b.h &&
          y < PARK_BASE
        )
          return 2 + birches.length + i;
      return -1;
    };
    const onAurora = (x: number, y: number, t: number) =>
      curtains.some((c) => {
        const hem = hemAt(c, x, t);
        return y <= hem + 4 && y >= hem - c.h * 1.2;
      });

    function shake(f: Frame, t: number) {
      for (const [i, at] of shakeAt.entries()) {
        const a = t - at;
        if (a < 0 || a > 2400) continue;
        const tr = shakers[i];
        if (!tr) continue;
        const top = tr.base - tr.h;
        const ground = tr.base + 1;
        const s = a / 1000;
        // powder bursting off the branches
        for (let k = 0; k < 7; k++) {
          const d = s - hash2(k, 6, i + 70) * 0.3;
          if (d < 0 || d > 1.2) continue;
          const v = hash2(k, 7, i + 70);
          const px =
            tr.x + (hash2(k, 8, i + 70) - 0.5) * (tr.big ? tr.h * 0.35 : 22);
          const py = top + 10 + v * tr.h * 0.7 + d * 10;
          const r = 1.5 + d * 5;
          const al = 0.55 * (1 - d / 1.2);
          for (let yy = Math.round(py - r); yy <= py + r; yy++)
            for (let xx = Math.round(px - r); xx <= px + r; xx++) {
              if (xx < 0 || xx >= w || yy < 0 || yy >= h) continue;
              const q = Math.hypot(xx - px, yy - py) / r;
              if (q < 1)
                mix(f.pixels, yy * w + xx, P.flake, q < 0.6 ? al : al * 0.5);
            }
        }
        for (let k = 0; k < 40; k++) {
          const v = hash2(k, 1, i + 70);
          const y0 = top + 8 + v * tr.h * 0.8;
          const reach = (tr.big ? tr.h * 0.2 : 14) * (0.3 + v * 0.7);
          const x0 = tr.x + (hash2(k, 2, i + 70) - 0.5) * 2 * reach;
          const d = s - hash2(k, 3, i + 70) * 0.6;
          if (d < 0) continue;
          const y = y0 + 40 * d * d + d * 6;
          if (y > ground) {
            // a little burst of powder where it lands
            const pa = d - Math.sqrt(Math.max(0, ground - y0) / 40);
            if (pa < 0.4) {
              f.set(x0 - 1 - pa * 6, ground - 1 - pa * 5, P.flake);
              f.set(x0 + 1 + pa * 6, ground - 1 - pa * 5, P.flake);
            }
            continue;
          }
          const sz = hash2(k, 4, i + 70) > 0.5 ? 2 : 1;
          f.rect(
            Math.round(x0),
            Math.round(y),
            sz,
            sz,
            k % 3 ? P.roofSnowHi : P.roofSnow
          );
          if (d < 1) f.set(x0 + Math.sin(k + d * 9) * 2, y - 2, P.flakeDim);
        }
      }
    }

    const onBear = (x: number, y: number, t: number) => {
      const b = bearAt(t);
      return !!b && Math.abs(x - b.x) <= 11 && y >= b.y - 21 && y <= b.y + 1;
    };
    // the eggs' triggers: the bell on its post, and the park bench
    const postSpot = { x: postX + 1, y: POST_Y - 11, r: 8 };
    const benchSpot = { x: benchX, y: BENCH_Y - 5, r: 10 };
    const near = (
      s: { x: number; y: number; r: number },
      x: number,
      y: number,
      slack: number
    ) => Math.hypot(x - s.x, y - s.y) <= s.r + slack;

    /**
     * The bell on the post rung: if the bear's in sight he pulls up where he
     * is; if not, he comes flying in from the left and skids to a stop just
     * past the post. Either way he then plays his tune.
     */
    function callBear(t: number) {
      const b = bearAt(t);
      // in plain sight (clear of the big spruces at either side)
      if (b && b.x - 9 > lTreeR && b.x + 9 < parkR + 2) {
        stops.push({ at: t, len: STOP, tune: true });
        return;
      }
      const c0 = bearClock(t) - BEAR_OFF;
      const n = Math.floor(c0 / bearPeriod);
      const a = c0 - n * bearPeriod;
      const dStop = postX + 16 + 35;
      const ENTRY = 22; // just out of sight
      let jump: number;
      let d0: number;
      if (n % 2 === 0 && a <= crossMs && a * BEAR_V < dStop - 24) {
        // already on his way in from the left, just not here yet
        d0 = Math.max(ENTRY, a * BEAR_V);
        jump = (d0 - a * BEAR_V) / BEAR_V;
      } else {
        // skip ahead to his next ride in from the left
        let m = n + 1;
        if (m % 2) m++;
        d0 = ENTRY;
        jump = m * bearPeriod + ENTRY / BEAR_V - c0;
      }
      const S = 1300;
      const k = Math.max(
        0,
        ((dStop - (EASE_IN * BEAR_V) / 2 - d0) / (BEAR_V * S) - 1) * 1.5
      );
      sprints.push({ at: t, jump, S, k });
      stops.push({ at: t + S, len: STOP, tune: true });
    }
    /**
     * The bear keeps out of the group's way: heading for the park, he
     * pulls up and waits until they've gone; already in it, he scoots on
     * through and out of it.
     */
    function makeWay(t: number) {
      if (bearBusy(t)) return;
      const b = bearAt(t);
      // out of sight: he'll just come by a little later
      if (!b) {
        stops.push({ at: t, len: MEET.end + 400, tune: false });
        return;
      }
      const zL = meetX - 5 - 46 - 16 - 11;
      const zR = Math.max(benchX + 14, meetX + 5 + 46 + 7 + 4) + 11;
      const ahead = b.dir > 0 ? b.x < zL : b.x > zR;
      const behind = b.dir > 0 ? b.x > zR : b.x < zL;
      if (behind) return;
      if (ahead) {
        stops.push({ at: t, len: MEET.end + 400, tune: false });
        return;
      }
      const rem = (b.dir > 0 ? zR + 4 - b.x : b.x - zL + 4) + 2;
      const S = 1100;
      const k = Math.max(0, (rem / (BEAR_V * S) - 1) * 1.5);
      sprints.push({ at: t, jump: 0, S, k });
    }
    let lastT = 0;

    return {
      render(f, t) {
        lastT = t;
        // fold long-finished stops into the bear's lost time
        while (stops.length && t - stops[0]!.at > stops[0]!.len + 6000) {
          lostBase += lostIn(stops[0]!.len, stops[0]!.len);
          stops.shift();
        }
        while (sprints.length && t - sprints[0]!.at > sprints[0]!.S + 6000) {
          lostBase -= gainIn(sprints[0]!, sprints[0]!.S);
          sprints.shift();
        }
        f.copyFrom(sky);
        aurora(f, t);
        // a shooting star now and then, all on its own
        const sPeriod = 21_000;
        const sa = t % sPeriod;
        if (sa < 700) {
          const n = Math.floor(t / sPeriod);
          const sx = 20 + hash2(n, 1, 5) * (w - 40);
          const sy = 6 + hash2(n, 2, 5) * 20;
          const p = sa / 700;
          for (let k = 0; k < 10; k++)
            f.blend(
              sx + p * 60 - k * 1.8,
              sy + p * 22 - k * 0.66,
              P.starHi,
              (1 - k / 10) * (p < 0.8 ? 1 : (1 - p) * 5)
            );
        }
        // flare light on the sky around the flames
        for (const [i, fl] of flares.entries()) {
          const b = flareBoost(i, t);
          const flick = noise1(t / 140 + fl.phase * 7, 6);
          glow(
            f,
            fl.x,
            fl.top - 6,
            18 + flick * 3 + b * 20,
            P.flareGlow,
            0.32 + flick * 0.08 + b * 0.25,
            1,
            0.12
          );
        }
        for (const [k, s] of stacks.entries()) plume(f, s.x + 0.5, s.top, t, k);
        blit(f, far, farSpans);
        for (const [i, fl] of flares.entries())
          flame(f, fl, t, flareBoost(i, t));
        // aircraft lights on the stacks and the rig
        for (const [k, s] of stacks.entries()) {
          if (Math.sin(t / 650 + k * 2) > 0) f.set(s.x, s.top - 1, P.beacon);
          if (Math.sin(t / 650 + k * 2 + 1) > 0.3)
            f.set(s.x - 1, s.top + 17, P.beacon);
        }
        if (rigX > 0) {
          for (let y = HZ - 37; y < HZ - 8; y += 7) {
            const half = Math.round(1 + ((y - (HZ - 42)) / 35) * 5);
            f.set(rigX - half, y, P.rigLight);
            f.set(rigX + half, y + 3, P.rigLight);
          }
          f.set(rigX, HZ - 46, Math.sin(t / 500) > 0 ? P.beacon : P.rig);
        }
        f.pixels.set(ground.pixels.subarray(HZ * w), HZ * w);
        truck(f, t);
        for (const j of jacks) pumpJack(f, j.x, j.base, t, j.phase, j.s);
        blit(f, house, houseSpans);
        // windows: lit or dark, flipped by clicks
        for (const [i, wn] of windows.entries())
          windowGlass(f, wn, wn.lit !== flipped.has(i), t);
        const atticLit = Math.sin(t / 7000) > 0.2;
        f.rect(attic.x, attic.y, 3, 4, atticLit ? P.winDeep : P.glass);
        f.set(attic.x + 1, attic.y + 1, P.board);
        if (atticLit) f.set(attic.x, attic.y, P.win);
        chimneySmoke(f, t);
        dog(f, t);
        lightPools(f, t);
        parkLights(f, t);
        bear(f, t);
        benchGroupBack(f, t);
        blit(f, parkFront, parkSpans);
        postBell(f, t);
        benchGlints(f, t);
        walker(f, t);
        benchGroup(f, t);
        benchPuff(f, t);
        warmth(f, t);
        // bare birch crowns: a see-through haze of twigs
        for (const cr of crowns)
          for (const c of cr)
            mix(f.pixels, c.i, c.lit ? P.twigLit : P.twig, c.a);
        blit(f, fore, foreSpans);
        bloomLight(f, t);
        shake(f, t);
        snow(f, t, [P.flakeDim, P.flakeDim, P.flake], Math.round(w / 5), 6);
        fx.draw(f, t);
      },
      poke(x, y, t) {
        // a click never restarts anything already under way: while a flare
        // roars, a tree sheds its snow, the stove smokes, the sky surges or
        // the bear plays, clicking it again just lets it finish
        // the bell on the post: it rings, and the bear answers
        if (near(postSpot, x, y, 6)) {
          if (t - postRingAt > 700) postRingAt = t;
          if (!bearBusy(t)) callBear(t);
          return;
        }
        // the park bench: the meeting
        if (near(benchSpot, x, y, 6)) {
          if (meetAge(t) < 0) {
            meetAt = t;
            makeWay(t);
          }
          return;
        }
        if (onBear(x, y, t) && !fore.opaque(x, y)) {
          if (!bearBusy(t)) stops.push({ at: t, len: STOP, tune: true });
          return;
        }
        const fl = flareAtXY(x, y);
        if (fl >= 0) {
          if (t - flareAt[fl]! > 4200) flareAt[fl] = t;
          return;
        }
        const tr = treeAt(x, y);
        if (tr >= 0) {
          if (t - shakeAt[tr]! > 2400) shakeAt[tr] = t;
          return;
        }
        const wi = windowAt(x, y);
        if (wi >= 0) {
          if (flipped.has(wi)) flipped.delete(wi);
          else flipped.add(wi);
          return;
        }
        if (onHouse(x, y)) {
          if (t - stokeAt > 3000) stokeAt = t;
          return;
        }
        if (y < HZ - 2) {
          if (onAurora(x, y, t)) {
            if (t - surgeAt > 5000) {
              surgeAt = t;
              surgeX = x;
            }
          } else {
            shootingStar(fx, t, x, y, P.starHi, x < w / 2 ? 1 : -1);
          }
        }
      },
      hot(x, y) {
        return (
          near(postSpot, x, y, 1) ||
          near(benchSpot, x, y, 1) ||
          (onBear(x, y, lastT) && !fore.opaque(x, y)) ||
          y < HZ - 2 ||
          onHouse(x, y) ||
          flareAtXY(x, y) >= 0 ||
          treeAt(x, y) >= 0
        );
      },
      eggs(t) {
        const spots: EggSpot[] = [];
        const bearFree = !bearBusy(t);
        if (bearFree) spots.push({ id: 'bear', ...postSpot });
        if (meetAge(t) < 0) spots.push({ id: 'bench', ...benchSpot });
        // the bear himself, while he's in the picture, not behind a tree and
        // not crossing in front of the post or behind the bench
        const b = bearAt(t);
        if (
          !bearFree ||
          !b ||
          b.x < 4 ||
          b.x > w - 4 ||
          Math.abs(b.x - postSpot.x) < 26 ||
          Math.abs(b.x - benchSpot.x) < 28
        )
          return spots;
        const R = 10;
        const cy = b.y - 10;
        for (let dy = -R; dy <= R; dy += 2)
          for (let dx = -R; dx <= R; dx += 2)
            if (dx * dx + dy * dy <= R * R && fore.opaque(b.x + dx, cy + dy))
              return spots;
        spots.push({ id: 'bear', x: b.x, y: cy, r: R });
        return spots;
      },
    };
  },
};
