// Berdyansk on a warm summer evening. The sun sets into the shallow Sea of
// Azov behind the long sandy spit and its striped lighthouse; kitesurfers
// skim the bay under bright kites, the old town glows on its hill, and the
// bronze goby that fed the town in hard years rests on the embankment, next
// to the little evening arcade: the shooting gallery, the air hockey and
// the coin pusher.
//
// Click a kitesurfer to send them flying, the lighthouse to set its beam
// sweeping, the sky for gulls, the water to splash. The eggs: rub the goby
// for luck and it comes alive, leaps into the sea and back, to a cat's
// dismay; the air-hockey table opens a close-up of two kids playing a match;
// the coin pusher pays out a jackpot that spills coins over the whole
// embankment for the kids to scoop up.

import { Frame, lerpRGB, type RGB, sprite } from '../frame';
import { Fx, ripple, splash } from '../fx';
import { hash2, noise1 } from '../noise';
import { glow, gradient } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';

const P = palette({
  // sky, top to horizon
  sky0: '#232766',
  sky1: '#363282',
  sky2: '#563a90',
  sky3: '#844694',
  sky4: '#b75090',
  sky5: '#df6480',
  sky6: '#f48566',
  sky7: '#ffa95c',
  sky8: '#ffc96e',
  star: '#c8b8e8',
  sun: '#fff8dc',
  sunRim: '#ffe38a',
  sunBand: '#ffd070',
  sunGlow: '#ffb860',
  sunWash: '#ff8a5a',
  cloudTop: '#6c3f88',
  cloud: '#a84c88',
  cloudMid: '#d8607e',
  cloudLit: '#ff9070',
  cloudRim: '#ffd28a',
  // water, horizon to shore
  sea0: '#ffcf7e',
  sea1: '#f59a72',
  sea2: '#d8707e',
  sea3: '#a85a88',
  sea4: '#7a4c88',
  sea5: '#5a4482',
  sea6: '#463c7a',
  shallow: '#6a5a92',
  glint: '#fff2c0',
  glintWarm: '#ffc070',
  ripple: '#c27aa2',
  rippleDark: '#46386e',
  foam: '#fff1e4',
  foamDim: '#e8b8bc',
  // the spit, backlit
  spitRim: '#ffd590',
  spit: '#c97a72',
  spitShade: '#9c5c78',
  scrub: '#4c3c5c',
  scrubLit: '#8a6060',
  cottage: '#d6a8b4',
  cottageRoof: '#8c3a4c',
  // lighthouse
  lhWhite: '#fff4e6',
  lhWhiteSh: '#b9a2c6',
  lhRed: '#ff5640',
  lhRedSh: '#a82e4c',
  lhDark: '#3a2440',
  lamp: '#fff6c8',
  lampGlow: '#ffe8a0',
  // town on the hill, lit by the low sun from the right
  hillLit: '#e8a062',
  hill: '#b0705e',
  hillShade: '#7a5068',
  hillDark: '#5a4062',
  treeDark: '#2e3346',
  tree: '#3e4a44',
  treeLit: '#8a8a4a',
  wallLit: '#ffe2b6',
  wall: '#e0b4a0',
  wallShade: '#a8849e',
  roof: '#c4503c',
  roofShade: '#8a3a46',
  winDark: '#4a3656',
  winGlint: '#fff4c4',
  winWarm: '#ffc062',
  // embankment
  paveLit: '#ffd6b2',
  pave: '#e2a88e',
  wallStone: '#8c5c74',
  wallStoneHi: '#a8707e',
  wallJoint: '#6a4464',
  post: '#3a2a3e',
  lampLight: '#ffe6a0',
  // the goby
  bronzeDark: '#4a2a1e',
  bronze: '#8a5428',
  bronzeLit: '#c8843a',
  bronzeHi: '#ffd690',
  stone: '#9c8a9e',
  stoneLit: '#dcbcae',
  stoneShade: '#6a5a7c',
  plaque: '#5a4a6a',
  // beach
  sand: '#eeac80',
  sandLit: '#ffca96',
  sandShade: '#c08080',
  wetSand: '#94688c',
  wetSandHi: '#c48c9c',
  shadow: '#b47486',
  wood: '#5a3a3e',
  woodLit: '#b0705a',
  // umbrellas and towels
  red: '#ec4436',
  redSh: '#a42c40',
  blue: '#3a6ad6',
  blueSh: '#2a4496',
  yellow: '#ffcc3c',
  yellowSh: '#d08a3a',
  green: '#3aa05c',
  greenSh: '#2a6a50',
  white: '#fff2e2',
  whiteSh: '#d0b0c0',
  // people
  skin: '#e8946e',
  skinSh: '#9a5a5e',
  hair: '#3a2430',
  suitA: '#e8404a',
  suitB: '#2a5ad0',
  // kites and gulls
  kiteLine: '#3a2a4a',
  board: '#fff2e2',
  gull: '#fff8f0',
  gullSh: '#c8b0c8',
  gullTip: '#3a2a3e',
  ship: '#5c3a5e',
  shipHi: '#a86a7a',
  sail: '#ffe6d0',
  sailSh: '#d89aa8',
  // the promenade cat: white with ginger patches
  cat: '#fff2e2',
  catSh: '#c8a4b4',
  catPatch: '#ec8a3e',
  // the evening arcade: a striped awning, bulbs, the games glowing inside
  awnRed: '#ec3c44',
  awnRedSh: '#a8263e',
  awnWhite: '#fff2e2',
  awnWhiteSh: '#d6aebc',
  sign: '#3c3aa8',
  signSh: '#28267a',
  arcWall: '#562850',
  arcWallLit: '#8a4464',
  arcGlow: '#ffb070',
  bulbOff: '#6a3a58',
  gallery: '#1c3a4c',
  galleryRim: '#3c6c7c',
  rail: '#b0a8c0',
  duck: '#ffd23c',
  duckBeak: '#ff7a2c',
  hockey: '#d8f6ff',
  hockeySh: '#9ccfea',
  hockeyDot: '#b4def4',
  hockeyRim: '#ec3c4c',
  hockeyRimLit: '#ff8a7a',
  hockeyBody: '#2c4cb0',
  hockeyBodySh: '#1c2a70',
  hockeyLight: '#7ef0ff',
  puck: '#20202e',
  puckLit: '#5a5a78',
  trail: '#3a8ae8',
  trailFade: '#8ac4f4',
  mallet: '#ff4a5a',
  malletSh: '#a82a44',
  rifle: '#2a2030',
  pusher: '#c8388a',
  pusherSh: '#7a2060',
  pusherLit: '#ff74b8',
  glass: '#2a1838',
  shelf: '#8a7a9a',
  gold: '#ffd03a',
  goldLit: '#fff6b0',
  goldSh: '#c8861c',
  goldDark: '#7a4c14',
  // the arcade kids in summer T-shirts: two light-brown boys and a
  // dark-haired toddler; and a young woman with dark hair
  hairKid: '#b07a48',
  hairKidLit: '#dcaa70',
  hairKidSh: '#7a5034',
  hairBaby: '#2a1c24',
  womanHair: '#3a2026',
  womanDress: '#e8506a',
  womanDressSh: '#a83050',
  kidTee: '#3a6ad6',
  kidTeeSh: '#2a4496',
  shorts: '#2c2c48',
  kid2Tee: '#ffb02c',
  kid2TeeSh: '#c8741c',
  kid2Shorts: '#c43a3a',
  kid3Tee: '#3ab06c',
  kid3TeeSh: '#2a7050',
  kid3Shorts: '#2a4496',
  frameDark: '#1a0f1e',
  // inside the arcade, up close
  arcDeep: '#22102a',
  arcMid: '#3a1a3c',
  floor: '#2c1624',
  floorLit: '#44263a',
  burst: '#fff4c8',
});

const HZ = 86; // the sea horizon
const PROM = 127; // the promenade on the embankment

// the cat, facing left: c white coat, g ginger patches, s the far legs in shade
const CAT_WALK = [
  ['g.g....', 'ccc...g', '.cggccg', '.c...s.'],
  ['g.g....', 'ccc...g', '.cggccg', '..s.c..'],
];
const CAT_SNIFF = ['.......', 'g.g...g', 'cccggcg', '.c...s.'];
const CAT_SIT = ['g.g..', 'ccc..', '.cc..', '.cgg.', '.ccsg'];
const CAT_REAR = ['g.g..', 'ccc..', '.cc..', '..cg.', '..cgg', '..c.s'];
const CAT_LEAP = ['g.g....', 'cccggcg', '.c...s.'];

// The boys' heads side on, facing right, for the air-hockey close-up, with
// their necks: H hair, h hair in the light, s skin, S skin in shade, E an eye,
// m the mouth.
const BOY1_HEAD = [
  '..hHhhh..',
  '.HHhhhhh.',
  'HHHHHhhhs',
  'HHHHHHHss',
  'HHHSssEs.',
  'HHHSsssss',
  '.HHssssS.',
  '..sssmS..',
  '...sss...',
];
const BOY2_HEAD = [
  '..hhhh..',
  '.Hhhhhh.',
  'HHHHHHHs',
  'HHHHssEs',
  'HHHSssss',
  '.HHsssS.',
  '..ssmS..',
  '...ss...',
];

// ---------- helpers ----------

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

/** Blends colour c over pixel (x, y) with alpha a (0..1), straight on the buffer. */
function mix(f: Frame, x: number, y: number, c: RGB, a: number) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= f.w || y >= f.h || a <= 0) return;
  const i = y * f.w + x;
  const p = f.pixels[i]!;
  const k = Math.round(Math.min(1, a) * 256);
  const r = p & 0xff;
  const g = (p >>> 8) & 0xff;
  const b = (p >>> 16) & 0xff;
  const nr = r + (((((c >>> 16) & 0xff) - r) * k) >> 8);
  const ng = g + (((((c >>> 8) & 0xff) - g) * k) >> 8);
  const nb = b + ((((c & 0xff) - b) * k) >> 8);
  f.pixels[i] = (0xff000000 | (nb << 16) | (ng << 8) | nr) >>> 0;
}

function mixLine(
  f: Frame,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  c: RGB,
  a: number
) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++)
    mix(f, x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c, a);
}

/** A gull: wings up, level or down. */
function gull(f: Frame, x: number, y: number, pose: number, c: RGB, tip: RGB) {
  x = Math.round(x);
  y = Math.round(y);
  const wy = pose === 0 ? -1 : pose === 1 ? 0 : 1; // where the wing tips are
  f.set(x, y, c);
  f.set(x - 1, y - 1 + (pose === 2 ? 1 : 0), c);
  f.set(x + 1, y - 1 + (pose === 2 ? 1 : 0), c);
  f.set(x - 2, y - 1 + wy, c);
  f.set(x + 2, y - 1 + wy, c);
  f.set(x - 3, y + wy, tip);
  f.set(x + 3, y + wy, tip);
}

type Brolly = readonly [RGB, RGB, RGB];

/** A beach umbrella: striped dome with a scalloped valance, its long shadow to the left. */
function umbrella(
  f: Frame,
  x: number,
  base: number,
  half: number,
  pole: number,
  c: Brolly,
  shadow: boolean
) {
  const [a, b, sh] = c;
  const bottom = base - pole;
  if (shadow) {
    const rx = half * 1.7;
    for (let dx = -rx; dx <= rx; dx++) {
      const yy = Math.sqrt(1 - (dx / rx) ** 2) > 0.55 ? 1 : 0;
      f.vline(Math.round(x - half * 1.6 + dx), base - yy, base, P.shadow);
    }
  }
  f.vline(x, bottom, base, P.post);
  const rows = Math.max(3, Math.round(half / 2) + 1);
  const stripe = Math.max(2, Math.round(half / 2.5));
  for (let r = 0; r < rows; r++) {
    const y = bottom - rows + 1 + r;
    const hw = Math.round(half * (0.3 + 0.7 * Math.sqrt((r + 1) / rows)));
    for (let dx = -hw; dx <= hw; dx++) {
      const panel = Math.floor((dx + half * 4) / stripe) % 2;
      const shade = dx < -hw * 0.35;
      f.set(x + dx, y, panel ? (shade ? P.whiteSh : b) : shade ? sh : a);
    }
  }
  // scalloped edge
  for (let dx = -half; dx <= half; dx += 2) {
    const panel = Math.floor((dx + half * 4) / stripe) % 2;
    f.set(x + dx, bottom + 1, panel ? (dx < -half * 0.35 ? P.whiteSh : b) : sh);
  }
  f.set(x, bottom - rows, P.post);
}

/** A white sunbed, maybe with someone on it. */
function sunbed(f: Frame, x: number, y: number, who: number) {
  f.hline(x, x + 7, y - 1, P.white);
  f.hline(x + 6, x + 8, y - 2, P.white);
  f.set(x + 8, y - 3, P.white);
  f.set(x, y, P.whiteSh);
  f.set(x + 7, y, P.whiteSh);
  if (who > 0.5) {
    f.hline(x + 1, x + 6, y - 2, P.skin);
    f.set(x + 7, y - 3, P.hair);
    f.hline(x + 3, x + 4, y - 2, who > 0.75 ? P.suitA : P.suitB);
  }
}

type Rider = {
  y: number;
  period: number;
  phase: number;
  x0: number;
  x1: number;
  kite: RGB;
  kiteSh: RGB;
  tipC: RGB;
  suit: RGB;
  kiteY: number;
};

export const berdyansk: Scene = {
  id: 'berdyansk',
  name: 'Berdyansk',
  country: 'Ukraine',
  create(w, h) {
    const fx = new Fx();
    const mid = w / 2;

    // ---------- layout ----------
    const sunX = Math.round(mid + Math.min(112, w * 0.25));
    const sunY = HZ + 3;
    const sunR = 12;
    // where the town's hill comes down to the water
    const hillFoot = Math.round(mid - Math.min(68, w * 0.17));
    const hillR = hillFoot + 12; // the town's hill runs down to the water here
    const tipX = hillR + 14; // tip of the spit
    // along the embankment, left to right: the evening arcade, the bronze
    // goby on its stone, the kiosk by the steps. On a narrow screen the
    // embankment runs on a little past the hill's foot to fit them all in.
    const PW = 38; // the arcade's width
    const gobyX0 = Math.round(hillFoot - Math.min(52, w * 0.13));
    const pavX = Math.max(
      -1,
      gobyX0 - 20 - PW,
      Math.min(4, hillFoot - 30 - PW)
    );
    const gobyX = Math.max(gobyX0, pavX + PW + 17);
    const embR = Math.max(hillFoot, gobyX + 13); // end of the embankment
    const spitV = (x: number) =>
      Math.max(0, Math.min(1, (x - tipX) / Math.max(1, w - tipX)));
    const spitY = (x: number) => HZ + 3 + 15 * spitV(x) ** 1.5; // its near shore
    const spitT = (x: number) => 1 + Math.round(4 * spitV(x)); // thickness
    const lx = Math.round(tipX + Math.max(26, (w - tipX) * 0.16));
    const lBase = Math.round(spitY(lx)) - 1;
    const LH = 44;
    const lampY = lBase - LH - 4; // the lamp's lower row, inside the lantern
    // the kiosk by the steps, when there's room for it beside the goby
    const kx0 = embR - 16;
    const hasKiosk = kx0 - gobyX > 22;
    /** Whether x is on the arcade (with a step of space round it). */
    const byArcade = (x: number, pad = 0) =>
      x >= pavX - 3 - pad && x <= pavX + PW + 2 + pad;
    // lamp posts along the promenade, keeping clear of the goby, the kiosk
    // and the arcade
    const lamps: number[] = [];
    for (let x = Math.round(Math.min(26, w * 0.08)); x < embR - 6; x += 58)
      if (
        Math.abs(x - gobyX) >= 18 &&
        !byArcade(x) &&
        !(hasKiosk && x > kx0 - 4 && x < kx0 + 14)
      )
        lamps.push(x);
    const shoreY = (x: number) =>
      125 - ((x - embR) / Math.max(1, w - embR)) * 7 + Math.sin(x / 19) * 1.2;
    const hillTop = (x: number) =>
      56 + 45 * Math.min(1, x / hillR) ** 1.7 + (noise1(x / 9, 4) - 0.5) * 4;

    const riders: Rider[] = [
      {
        y: 106,
        period: 23_000,
        phase: 0.1,
        x0: embR + (w - embR) * 0.4,
        x1: w - 16,
        kite: P.red,
        kiteSh: P.redSh,
        tipC: P.white,
        suit: P.hair,
        kiteY: 0,
      },
      {
        y: 112,
        period: 19_000,
        phase: 0.62,
        x0: embR + 24,
        x1: embR + (w - embR) * 0.78,
        kite: P.yellow,
        kiteSh: P.yellowSh,
        tipC: P.hair,
        suit: P.suitB,
        kiteY: 8,
      },
    ];
    if (w > 300)
      riders.push({
        y: 99,
        period: 29_000,
        phase: 0.35,
        x0: tipX + 8,
        x1: tipX + (w - tipX) * 0.45,
        kite: P.blue,
        kiteSh: P.blueSh,
        tipC: P.white,
        suit: P.hair,
        kiteY: -11,
      });
    if (w > 540)
      riders.push({
        y: 109,
        period: 25_000,
        phase: 0.85,
        x0: w * 0.62,
        x1: w - 30,
        kite: P.green,
        kiteSh: P.greenSh,
        tipC: P.yellow,
        suit: P.suitA,
        kiteY: -6,
      });

    // ---------- sky ----------
    const sky = layer(w, h, (f) => {
      gradient(f, 0, HZ + 1, [
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
      // the first stars over the east
      for (let i = 0; i < Math.round(w / 22); i++) {
        const x = Math.floor(hash2(i, 1, 9) * w * 0.55);
        const y = Math.floor(hash2(i, 2, 9) * 22);
        f.set(x, y, P.star);
      }
      glow(f, sunX, HZ, Math.min(w * 0.55, 200), P.sunWash, 0.32, 0.4, 0.1);
      glow(f, sunX, sunY - 2, 40, P.sunGlow, 0.5, 0.75, 0.12);
      // the sun, half set, with bands of haze across its lower part
      f.disc(sunX, sunY, sunR, (dx, dy) => {
        const y = sunY + dy;
        if (y >= HZ) return null;
        if (y === HZ - 2 || y === HZ - 5) return P.sunBand;
        return dx * dx + dy * dy > (sunR - 1.2) ** 2 ? P.sunRim : P.sun;
      });
    });

    // long streaks of cloud, lit from below by the sun
    const cloudLayer = layer(w, h, (f) => {
      const n = Math.max(5, Math.round(w / 44));
      for (let i = 0; i < n; i++) {
        const cy = 12 + Math.round(hash2(i, 1, 31) * 58);
        const cx = Math.round(((i + hash2(i, 2, 31) * 0.7) / n) * w);
        const low = cy > 44;
        const len = 26 + Math.round(hash2(i, 3, 31) * (low ? 90 : 60));
        const th = 2 + Math.round(hash2(i, 4, 31) * (low ? 4 : 2));
        for (let j = 0; j < th; j++) {
          const v = th === 1 ? 1 : j / (th - 1);
          const half = (len / 2) * (0.35 + 0.65 * Math.sqrt(v));
          const off = Math.round((noise1(j * 2.3, i) - 0.5) * 10);
          const y = cy + j;
          const c =
            j === th - 1
              ? low
                ? P.cloudRim
                : P.cloudLit
              : j === th - 2
                ? low
                  ? P.cloudLit
                  : P.cloudMid
                : j === 0
                  ? P.cloudTop
                  : low
                    ? P.cloudMid
                    : P.cloud;
          for (let x = Math.round(cx - half + off); x <= cx + half + off; x++)
            f.set(((x % w) + w) % w, y, c);
        }
        // wisps trailing off both ends
        for (let k = 0; k < 2; k++) {
          const y = cy + th - 1 - k;
          for (const side of [-1, 1]) {
            const x0 = cx + side * (len / 2 + 3 + k * 6);
            for (let x = 0; x < 5 + k * 4; x++)
              f.set(
                ((Math.round(x0 + side * x) % w) + w) % w,
                y,
                k ? P.cloud : low ? P.cloudLit : P.cloudMid
              );
          }
        }
      }
    });

    // ---------- the sea: a still mirror of the sunset ----------
    const sea = layer(w, h, (f) => {
      gradient(f, HZ, 128, [
        P.sea0,
        P.sea1,
        P.sea2,
        P.sea3,
        P.sea4,
        P.sea5,
        P.sea6,
      ]);
      f.rect(0, 128, w, h - 128, P.sea6);
      // the sun's reflection right under it
      for (let y = HZ; y < HZ + 6; y++) {
        const half = Math.round((sunR - 2) * (1 - (y - HZ) / 7));
        if ((y - HZ) % 2 === 1) continue;
        f.hline(sunX - half, sunX + half, y, y === HZ ? P.sun : P.sunRim);
      }
    });

    // ---------- the spit and its lighthouse ----------
    const far = layer(w, h, (f) => {
      for (let x = tipX; x < w; x++) {
        const yb = Math.round(spitY(x));
        const th = spitT(x);
        for (let y = yb - th; y <= yb; y++)
          f.set(
            x,
            y,
            y === yb - th ? P.spitRim : y === yb ? P.spitShade : P.spit
          );
      }
      f.set(tipX - 1, Math.round(spitY(tipX)), P.spitShade);
      // scrub and the odd tree along the spit, cottages near the root
      for (let x = tipX + 4; x < w; x += 3) {
        const v = spitV(x);
        if (hash2(x, 0, 12) > 0.25 + v * 0.5) continue;
        if (Math.abs(x - lx) < 9) continue;
        const top = Math.round(spitY(x)) - spitT(x);
        const ht = 1 + Math.round(hash2(x, 1, 12) * (0.5 + v * 2));
        const bw = 2 + Math.round(hash2(x, 2, 12) * 2);
        for (let k = 0; k < ht; k++)
          f.hline(
            x - (k ? 0 : 1),
            x + bw - 1 - (k === ht - 1 ? 1 : 0),
            top - k,
            P.scrub
          );
        f.hline(x, x + bw - 2, top - ht, P.scrubLit);
      }
      for (let x = Math.round(w - Math.min(90, w * 0.25)); x < w - 6; x += 11) {
        const top = Math.round(spitY(x)) - spitT(x);
        if (hash2(x, 3, 12) < 0.4) {
          // a poplar
          f.rect(x, top - 9, 2, 9, P.scrub);
          f.set(x + 1, top - 10, P.scrub);
          f.vline(x + 1, top - 8, top - 2, P.scrubLit);
          continue;
        }
        // five wide, so its one lit window is in the middle
        f.rect(x, top - 3, 5, 3, P.cottage);
        f.hline(x - 1, x + 5, top - 4, P.cottageRoof);
        f.hline(x, x + 4, top - 5, P.cottageRoof);
        f.set(x + 2, top - 2, P.winWarm);
      }
      // the lighthouse: a tapering tower in red and white bands
      for (let y = lBase - LH; y <= lBase; y++) {
        const v = (lBase - y) / LH;
        const half = 3.6 - v * 1.4;
        const red = Math.floor((lBase - y) / 6) % 2 === 1;
        for (let x = Math.round(lx - half); x <= Math.round(lx + half); x++) {
          const u = (x - lx) / half;
          const lit = u > -0.15;
          f.set(
            x,
            y,
            red ? (lit ? P.lhRed : P.lhRedSh) : lit ? P.lhWhite : P.lhWhiteSh
          );
        }
      }
      // a door and two little windows up the tower
      f.rect(lx - 1, lBase - 3, 2, 3, P.lhDark);
      f.set(lx, lBase - 16, P.lhDark);
      f.set(lx, lBase - 28, P.lhDark);
      // gallery, lantern room, dome
      const gy = lBase - LH - 1;
      f.hline(lx - 4, lx + 4, gy, P.lhDark);
      f.hline(lx - 4, lx + 4, gy - 2, P.lhDark);
      f.set(lx - 4, gy - 1, P.lhDark);
      f.set(lx + 4, gy - 1, P.lhDark);
      f.set(lx, gy - 1, P.lhDark);
      f.rect(lx - 2, gy - 5, 5, 4, P.lhDark);
      f.rect(lx - 1, gy - 4, 3, 2, P.lamp);
      f.hline(lx - 2, lx + 2, gy - 6, P.lhRedSh);
      f.hline(lx - 1, lx + 1, gy - 7, P.lhRed);
      f.set(lx, gy - 8, P.lhDark);
      // the keeper's house at its foot
      f.rect(lx - 13, lBase - 4, 8, 5, P.cottage);
      f.hline(lx - 14, lx - 5, lBase - 5, P.cottageRoof);
      f.hline(lx - 13, lx - 6, lBase - 6, P.cottageRoof);
      f.set(lx - 11, lBase - 2, P.winWarm);
      f.set(lx - 8, lBase - 2, P.winWarm);
    });

    // ---------- the old town on its hill ----------
    const town = layer(w, h, (f) => {
      for (let x = 0; x < hillR; x++) {
        const top = Math.round(hillTop(x));
        const slope = hillTop(x + 2) - hillTop(x - 2);
        for (let y = top; y <= 101; y++) {
          const d = y - top;
          let c = d < 2 ? P.hillLit : slope > 1.2 && d < 5 ? P.hillLit : P.hill;
          if (y > 98) c = P.hillShade;
          f.set(x, y, c);
        }
      }
      // a strip of beach and the water's edge below the town
      for (let x = 0; x < hillR + 4; x++) {
        f.set(x, 101, P.sandLit);
        f.set(x, 102, P.wetSand);
      }
      // apartment blocks along the top
      for (let x = 2; x < hillR * 0.45; x += 22) {
        // 15 wide, so the grid of six windows across has an even margin
        const top = Math.round(hillTop(x + 8)) - 12;
        f.rect(x, top, 15, 14, P.wall);
        f.vline(x + 14, top, top + 13, P.wallLit);
        f.vline(x, top, top + 13, P.wallShade);
        f.hline(x, x + 14, top, P.wallLit);
        for (let wy = top + 2; wy < top + 12; wy += 2)
          for (let wx = x + 2; wx < x + 13; wx += 2) {
            const v = hash2(wx, wy, 5);
            f.set(
              wx,
              wy,
              v < 0.2 ? P.winGlint : v < 0.35 ? P.winWarm : P.winDark
            );
          }
      }
      // gardens and trees all over the slope, lit from the setting sun
      const blobs: [number, number, number][] = [];
      for (let gy = 58; gy < 101; gy += 3) {
        for (let gx = -3; gx < hillR + 3; gx += 4) {
          const jx = gx + Math.round((hash2(gx, gy, 71) - 0.5) * 4);
          const jy = gy + Math.round((hash2(gx, gy, 72) - 0.5) * 3);
          if (jy < hillTop(jx) + 2 || jy > 100 || hash2(gx, gy, 73) > 0.62)
            continue;
          blobs.push([jx, jy, 1.4 + hash2(gx, gy, 74) * 1.8]);
        }
      }
      blobs.sort((a, b) => a[1] - b[1]);
      for (const [bx, by, r] of blobs)
        f.disc(bx, by, r, (dx, dy) => {
          const l = (dx - dy) / r;
          return l > 0.85 ? P.treeLit : l < -0.45 ? P.treeDark : P.tree;
        });
      // houses with red roofs scattered down the slope, poplars between; none
      // built into another, and the lower (nearer) ones drawn last
      const lots: { i: number; x: number; y: number; poplar: boolean }[] = [];
      const taken: [number, number, number, number][] = [];
      const N = Math.round(hillR / 5);
      // as many houses as the first pass finds plots for: where one would
      // have overlapped another, a free plot further on is used instead
      let want = 0;
      let placed = 0;
      for (let i = 0; i < N * 4; i++) {
        if (i >= N && placed >= want) break;
        const x = Math.round(hash2(i, 1, 81) * (hillR - 10));
        const y = Math.round(
          hillTop(x) + 6 + hash2(i, 2, 81) * (100 - hillTop(x) - 8)
        );
        if (y > 99 || hillTop(x + 8) > y - 4) continue;
        const poplar = hash2(i, 3, 81) < 0.2;
        if (i < N && !poplar) want++;
        if (i >= N && poplar) continue;
        const box: [number, number, number, number] = poplar
          ? [x + 2, y - 14, x + 4, y - 1]
          : [x - 1, y - 7, x + 9, y - 1];
        if (
          !poplar &&
          taken.some(
            ([a, b, c, d]) =>
              box[0] <= c + 1 && box[2] >= a - 1 && box[1] <= d && box[3] >= b
          )
        )
          continue;
        if (!poplar) {
          taken.push(box);
          placed++;
        }
        lots.push({ i, x, y, poplar });
      }
      lots.sort((a, b) => a.y - b.y);
      for (const { i, x, y, poplar } of lots) {
        if (poplar) {
          // a poplar, the tall southern kind
          f.rect(x + 2, y - 13, 3, 13, P.tree);
          f.vline(x + 4, y - 12, y - 1, P.treeLit);
          f.vline(x + 2, y - 12, y - 1, P.treeDark);
          f.set(x + 3, y - 14, P.tree);
          continue;
        }
        // an odd width, so its row of windows sits in the middle
        const hw = 7 + 2 * Math.round(hash2(i, 4, 81));
        f.rect(x, y - 4, hw, 4, P.wall);
        f.vline(x + hw - 1, y - 4, y - 1, P.wallLit);
        f.hline(x - 1, x + hw, y - 5, P.roof);
        f.hline(x, x + hw - 1, y - 6, P.roofShade);
        f.hline(x + 1, x + hw - 2, y - 7, P.roof);
        for (let wx = x + 1; wx < x + hw - 1; wx += 2)
          f.set(
            wx,
            y - 3,
            hash2(wx, y, 6) > 0.6
              ? P.winGlint
              : hash2(wx, y, 6) > 0.35
                ? P.winWarm
                : P.winDark
          );
      }
    });

    // ---------- the embankment and the beach ----------
    const near = layer(w, h, (f) => {
      // beach, from the waterline down
      for (let x = 0; x < w; x++) {
        const top = Math.round(x > embR ? shoreY(x) : 140);
        for (let y = top; y < h; y++) {
          const d = y - top;
          let c = d < 2 ? P.wetSand : d < 3 ? P.wetSandHi : P.sand;
          if (
            d >= 3 &&
            (y + Math.round(Math.sin(x / 11) * 2)) % 9 === 0 &&
            hash2(x >> 2, y, 3) > 0.5
          )
            c = P.sandLit;
          f.set(x, y, c);
        }
      }
      // the embankment: paved promenade on a stone wall, steps down to the beach
      for (let x = 0; x <= embR; x++) {
        f.set(x, PROM - 2, P.paveLit);
        f.set(x, PROM - 1, P.pave);
        f.set(x, PROM, P.pave);
        f.set(x, PROM + 1, P.wallStoneHi);
        for (let y = PROM + 2; y < 141; y++) {
          const row = Math.floor((y - PROM - 2) / 3);
          const joint =
            (y - PROM - 2) % 3 === 2 || (x + (row % 2) * 4) % 8 === 0;
          f.set(x, y, joint ? P.wallJoint : P.wallStone);
        }
        f.set(x, 141, P.shadow);
      }
      for (let k = 0; k < 7; k++) {
        const sx = embR + 1 + k * 2;
        const sy = PROM + 2 + k * 2;
        f.hline(sx, sx + 2, sy - 1, P.paveLit);
        f.rect(sx, sy, 3, 141 - sy, P.wallStone);
      }
      // lamp posts along the promenade
      for (const x of lamps) {
        f.vline(x, PROM - 18, PROM - 2, P.post);
        f.hline(x - 1, x + 1, PROM - 2, P.post);
        f.hline(x - 2, x + 2, PROM - 18, P.post);
        f.set(x - 2, PROM - 19, P.lampLight);
        f.set(x + 2, PROM - 19, P.lampLight);
      }
      // a kiosk selling ice cream and kvass, by the steps
      if (hasKiosk) {
        f.rect(kx0, PROM - 11, 11, 9, P.white);
        f.vline(kx0 + 10, PROM - 11, PROM - 3, P.wallLit);
        f.vline(kx0, PROM - 11, PROM - 3, P.whiteSh);
        f.rect(kx0 + 2, PROM - 9, 7, 3, P.winWarm);
        f.hline(kx0 + 2, kx0 + 8, PROM - 6, P.whiteSh);
        for (let x = kx0 - 1; x <= kx0 + 11; x++) {
          const c = Math.floor((x - kx0 + 1) / 2) % 2 ? P.white : P.red;
          f.set(x, PROM - 13, c);
          f.set(x, PROM - 12, c);
        }
        for (let x = kx0 - 1; x <= kx0 + 11; x += 2)
          f.set(x, PROM - 11, P.redSh);
        f.hline(kx0 + 1, kx0 + 9, PROM - 14, P.redSh);
      }
      // people sitting on the edge of the wall (drawn below): a couple and
      // one on their own, on the nearest free stretch of wall, off the lamp
      // posts, the arcade, the goby and the kiosk (if there's any free)
      const busy = (x0: number, wd: number) =>
        x0 < 2 ||
        x0 + wd > embR - 1 ||
        lamps.some((l) => x0 < l + 3 && x0 + wd > l - 2) ||
        (x0 < pavX + PW + 3 && x0 + wd > pavX - 3) ||
        (x0 < gobyX + 14 && x0 + wd > gobyX - 17) ||
        (hasKiosk && x0 < kx0 + 13 && x0 + wd > kx0 - 2);
      const seat = (x: number, wd: number) => {
        for (let d = 0; d < embR; d++)
          for (const s of [x + d, x - d]) if (!busy(s, wd)) return s;
        return -1;
      };
      const pair = seat(Math.round(embR * 0.3), 6);
      const one = seat(Math.round(embR * 0.62), 2);
      const sitters = [
        ...(pair >= 0 ? [pair, pair + 4] : []),
        ...(one >= 0 && (pair < 0 || Math.abs(one - pair - 2) > 8)
          ? [one]
          : []),
      ];
      // planters with flowers along the wall top
      for (let x = 8; x < embR - 4; x += 19) {
        if (Math.abs(x - gobyX) < 16 || Math.abs(x - (embR - 11)) < 12)
          continue;
        if (byArcade(x, 4)) continue;
        if (sitters.some((sx) => sx > x - 4 && sx < x + 6)) continue;
        if (lamps.some((lx2) => lx2 > x - 3 && lx2 < x + 6)) continue;
        f.rect(x, PROM - 4, 4, 2, P.wallStoneHi);
        f.set(x, PROM - 5, P.red);
        f.set(x + 2, PROM - 5, P.yellow);
        f.set(x + 1, PROM - 6, P.red);
        f.set(x + 3, PROM - 5, P.tree);
        f.set(x + 1, PROM - 5, P.tree);
      }
      // people sitting on the edge of the wall, legs dangling
      for (const sx of sitters) {
        f.rect(sx, PROM - 5, 2, 3, sx % 2 ? P.suitB : P.white);
        f.rect(sx, PROM - 7, 2, 2, P.skin);
        f.set(sx, PROM - 8, P.hair);
        f.set(sx + 1, PROM - 8, P.hair);
        f.vline(sx, PROM - 2, PROM + 2, P.skin);
        f.vline(sx + 1, PROM - 2, PROM + 3, P.skinSh);
      }
      // an old rowing boat turned over on the sand below the wall
      const bx = Math.round(Math.min(18, w * 0.05));
      f.hline(bx + 2, bx + 15, 143, P.blue);
      f.hline(bx + 1, bx + 16, 144, P.blue);
      f.hline(bx, bx + 17, 145, P.white);
      f.hline(bx + 1, bx + 16, 146, P.whiteSh);
      f.hline(bx + 3, bx + 14, 142, P.blueSh);
      f.hline(bx - 2, bx + 19, 147, P.shadow);
      // goby's pedestal: a rough stone block
      const px0 = gobyX - 11;
      f.rect(px0, PROM - 9, 22, 8, P.stone);
      f.hline(px0 + 1, px0 + 20, PROM - 9, P.stoneLit);
      f.vline(px0 + 21, PROM - 8, PROM - 2, P.stoneLit);
      f.vline(px0 + 20, PROM - 8, PROM - 2, P.stoneLit);
      f.vline(px0, PROM - 8, PROM - 2, P.stoneShade);
      f.set(px0 + 6, PROM - 8, P.stoneShade);
      f.set(px0 + 15, PROM - 6, P.stoneShade);
      f.rect(px0 + 7, PROM - 6, 8, 3, P.plaque);
      f.hline(px0 - 1, px0 + 22, PROM - 1, P.stoneShade);
      // wooden groyne posts running out into the water
      const gx = Math.round(embR + Math.min(80, (w - embR) * 0.32));
      for (let k = 0; k < 6; k++) {
        const x = gx + k * 4;
        const y = Math.round(shoreY(x)) + 3 - k * 3;
        f.vline(x, y - 3, y, P.wood);
        f.set(x + 1, y - 3, P.woodLit);
        f.set(x + 1, y - 2, P.wood);
      }
    });

    // the beach crowd: umbrellas, sunbeds and the lifeguard's tower
    const crowd = layer(w, h, (f) => {
      // the beach crowd: a row of umbrellas by the water, a bigger row behind
      const brollies: Brolly[] = [
        [P.red, P.white, P.redSh],
        [P.blue, P.white, P.blueSh],
        [P.yellow, P.green, P.yellowSh],
        [P.green, P.white, P.greenSh],
        [P.red, P.yellow, P.redSh],
        [P.blue, P.yellow, P.blueSh],
      ];
      const towerX = Math.round(embR + (w - embR) * 0.6);
      let k = 0;
      for (const [row, half, pole, gap, dy] of [
        [0, 5, 9, 30, 8],
        [1, 7, 12, 42, 18],
      ] as const) {
        for (
          let x = embR + 30 + row * 17;
          x < w - 6;
          x += gap + Math.round(hash2(x, row, 21) * 10), k++
        ) {
          if (Math.abs(x - towerX) < 14) continue;
          const base = Math.round(
            Math.min(h - 2, shoreY(x) + dy + hash2(x, 1, 21) * 3)
          );
          const hx = hash2(x, 2, 21);
          // towels and sunbeds first, then the umbrella over them
          if (hx < 0.5) sunbed(f, x - 12, base, hash2(x, 3, 21));
          else {
            f.rect(
              x - 11,
              base - 1,
              7,
              2,
              brollies[(k + 3) % brollies.length]![0]
            );
            if (hx > 0.7) {
              f.hline(x - 10, x - 6, base - 2, P.skinSh);
              f.set(x - 5, base - 2, P.hair);
            }
          }
          umbrella(
            f,
            x,
            base,
            half,
            pole,
            brollies[k % brollies.length]!,
            true
          );
          if (hash2(x, 4, 21) > 0.45) {
            // someone sitting in the shade
            f.rect(x + 2, base - 4, 2, 3, P.skin);
            f.set(x + 3, base - 3, P.skinSh);
            f.hline(x + 2, x + 3, base - 5, P.hair);
            f.hline(x + 2, x + 5, base - 1, P.skinSh);
          }
        }
      }
      // the lifeguard's tower on stilts
      const tb = Math.round(shoreY(towerX) + 10);
      for (const lx2 of [towerX - 4, towerX + 3])
        f.vline(lx2, tb - 9, tb, P.wood);
      f.line(towerX - 4, tb - 1, towerX + 3, tb - 8, P.wood);
      f.hline(towerX - 6, towerX + 5, tb - 9, P.woodLit);
      f.rect(towerX - 4, tb - 15, 8, 6, P.white);
      f.vline(towerX + 3, tb - 15, tb - 10, P.wallLit);
      f.vline(towerX - 4, tb - 15, tb - 10, P.whiteSh);
      f.rect(towerX - 2, tb - 13, 4, 2, P.winDark);
      f.hline(towerX - 4, towerX + 3, tb - 11, P.red);
      f.hline(towerX - 6, towerX + 5, tb - 16, P.red);
      f.hline(towerX - 5, towerX + 4, tb - 17, P.redSh);
      f.line(towerX - 9, tb, towerX - 5, tb - 8, P.woodLit);
      // a lifebuoy hanging on the rail
      f.hline(towerX + 6, towerX + 7, tb - 12, P.red);
      f.hline(towerX + 6, towerX + 7, tb - 9, P.white);
      f.vline(towerX + 5, tb - 11, tb - 10, P.white);
      f.vline(towerX + 8, tb - 11, tb - 10, P.red);
    });

    // close to us: a big umbrella and a sunbed at the edge of the picture
    const front = layer(w, h, (f) => {
      const fx0 = Math.round(w - Math.min(26, w * 0.08));
      umbrella(f, fx0, h + 6, 18, 36, [P.red, P.white, P.redSh], false);
      sunbed(f, fx0 - 24, h - 2, 0.8);
      sunbed(f, fx0 - 13, h, 0);
      f.rect(fx0 - 31, h - 3, 3, 3, P.blue);
      f.set(fx0 - 30, h - 4, P.blueSh);
    });

    // ---------- the evening arcade ----------
    // A little open-fronted pavilion under a striped awning, strung with
    // bulbs: the shooting gallery along its back wall, the air-hockey table
    // in front of it, the gallery's counter with a toy rifle, and the coin
    // pusher at the end. In two layers, so the boys can go in behind the
    // counter.
    const ax = (lx: number) => pavX + lx; // the arcade's columns, in the scene
    const AH_L = 2; // the air-hockey table
    const AH_R = 17;
    const CAB_L = 27; // the coin pusher
    const CAB_R = 34;
    const stripeRed = (lx: number) => Math.floor((lx + 1) / 3) % 2 === 0;
    const arcBack = layer(w, h, (f) => {
      // the crest over the awning, a sign with no words, just bulbs (below)
      for (const [dy, a, b] of [
        [-26, 16, 21],
        [-25, 14, 23],
        [-24, 12, 25],
        [-23, 11, 26],
      ] as const)
        for (let lx = a; lx <= b; lx++)
          f.set(ax(lx), PROM + dy, lx === a || dy === -23 ? P.signSh : P.sign);
      // a gold coin on it
      f.set(ax(18), PROM - 25, P.goldLit);
      f.set(ax(19), PROM - 25, P.gold);
      f.set(ax(18), PROM - 24, P.gold);
      f.set(ax(19), PROM - 24, P.goldSh);
      // the awning: red and white stripes, sloping in at the top, its
      // valance scalloped, lit by the low sun from the right
      for (let r = 0; r < 4; r++) {
        const y = PROM - 22 + r;
        const inset = Math.max(0, 2 - r);
        for (let lx = -1 + inset; lx <= PW - inset; lx++) {
          const lit = lx > PW * 0.6;
          const shade = r === 0 || (r === 1 && !lit);
          f.set(
            ax(lx),
            y,
            stripeRed(lx)
              ? shade
                ? P.awnRedSh
                : P.awnRed
              : shade
                ? P.awnWhiteSh
                : P.awnWhite
          );
        }
      }
      for (let lx = -1; lx <= PW; lx++)
        if ((lx + 1) % 3 === 1)
          f.set(ax(lx), PROM - 18, stripeRed(lx) ? P.awnRedSh : P.awnWhiteSh);
      // inside: the back wall, lit by the bulbs at the top
      for (let y = PROM - 17; y <= PROM - 3; y++)
        f.hline(ax(1), ax(PW - 2), y, y < PROM - 15 ? P.arcWallLit : P.arcWall);
      // the shooting gallery: a backdrop with targets, the ducks' rail
      f.hline(ax(3), ax(24), PROM - 16, P.galleryRim);
      f.rect(ax(3), PROM - 15, 22, 4, P.gallery);
      f.hline(ax(3), ax(24), PROM - 11, P.galleryRim);
      f.hline(ax(3), ax(24), PROM - 12, P.rail);
      for (const lx of [6, 11, 16, 21]) {
        f.set(ax(lx - 1), PROM - 14, P.white);
        f.set(ax(lx), PROM - 14, P.red);
        f.set(ax(lx + 1), PROM - 14, P.white);
      }
      // the posts
      for (const lx of [0, PW - 1])
        f.vline(ax(lx), PROM - 18, PROM - 3, P.post);
      f.vline(ax(PW - 1), PROM - 17, PROM - 4, P.woodLit);
    });
    const arcFront = layer(w, h, (f) => {
      // the air-hockey table, side on: its glowing top, the rim, the lit
      // apron and the legs
      f.hline(ax(AH_L + 1), ax(AH_R - 1), PROM - 10, P.hockeySh);
      f.hline(ax(AH_L), ax(AH_R), PROM - 9, P.hockey);
      f.set(ax(AH_L), PROM - 10, P.puck);
      f.set(ax(AH_R), PROM - 10, P.puck);
      f.set(ax(9), PROM - 9, P.hockeyRim);
      f.set(ax(10), PROM - 9, P.hockeyRim);
      f.hline(ax(AH_L), ax(AH_R), PROM - 8, P.hockeyRimLit);
      f.rect(ax(AH_L), PROM - 7, AH_R - AH_L + 1, 2, P.hockeyBody);
      f.hline(ax(AH_L), ax(AH_R), PROM - 5, P.hockeyBodySh);
      for (const lx of [AH_L + 1, AH_R - 1])
        f.vline(ax(lx), PROM - 4, PROM - 3, P.hockeyBodySh);
      // the gallery's counter, a toy rifle lying on it
      f.hline(ax(19), ax(25), PROM - 9, P.woodLit);
      f.rect(ax(19), PROM - 8, 7, 6, P.wood);
      f.hline(ax(19), ax(25), PROM - 6, P.awnRed);
      f.hline(ax(19), ax(22), PROM - 10, P.rifle);
      f.hline(ax(23), ax(24), PROM - 10, P.woodLit);
      // the coin pusher: a marquee, a window full of gold, the payout tray
      f.rect(ax(CAB_L), PROM - 16, 8, 14, P.pusher);
      f.vline(ax(CAB_L), PROM - 16, PROM - 3, P.pusherSh);
      f.vline(ax(CAB_R), PROM - 16, PROM - 3, P.pusherLit);
      f.hline(ax(CAB_L), ax(CAB_R), PROM - 14, P.pusherSh);
      f.rect(ax(CAB_L + 1), PROM - 13, 6, 5, P.glass);
      for (let lx = CAB_L + 1; lx < CAB_R; lx++) {
        f.set(ax(lx), PROM - 13, lx % 2 ? P.goldSh : P.goldDark);
        f.set(ax(lx), PROM - 10, lx % 2 ? P.gold : P.goldSh);
        f.set(ax(lx), PROM - 9, P.shelf);
      }
      f.rect(ax(CAB_L + 1), PROM - 8, 6, 1, P.frameDark);
      f.set(ax(CAB_L + 2), PROM - 8, P.goldSh);
      f.set(ax(CAB_L + 5), PROM - 8, P.gold);
      f.set(ax(30), PROM - 6, P.frameDark);
      f.set(ax(31), PROM - 6, P.gold);
    });
    // what a click on the arcade's things finds
    const ahSpot = { x: ax(10), y: PROM - 9, r: 8 };
    const cabSpot = { x: ax(31), y: PROM - 10, r: 7 };

    const farSpans = spans(far);
    const townSpans = spans(town);
    const nearSpans = spans(near);
    const frontSpans = spans(front);
    const crowdSpans = spans(crowd);
    const arcBackSpans = spans(arcBack);
    const arcFrontSpans = spans(arcFront);

    // ---------- moving things ----------
    const jumpAt = riders.map(() => -Infinity);
    let beamAt = -Infinity;
    let shineAt = -Infinity;
    let lastT = 0;

    function riderAt(i: number, t: number) {
      const r = riders[i]!;
      const q = t / r.period + r.phase;
      const p = q - Math.floor(q);
      // out and back across the bay, slowing right down for each turn
      const u = p < 0.5 ? p * 2 : 2 - p * 2;
      const e = (1 - Math.cos(u * Math.PI)) / 2;
      const x = r.x0 + (r.x1 - r.x0) * (0.06 + e * 0.88);
      const dir = p < 0.5 ? 1 : -1;
      // the kite swings over to lead the other way through the turn, not in
      // one jump
      const lead = Math.max(-1, Math.min(1, Math.sin(p * Math.PI * 2) * 4));
      const ja = t - jumpAt[i]!;
      const jp = ja >= 0 && ja < 1700 ? ja / 1700 : -1;
      const lift = jp >= 0 ? Math.sin(jp * Math.PI) * 28 : 0;
      const kx = x + lead * 20 + Math.sin(t / 1700 + i * 2) * 5;
      const ky =
        62 -
        (r.y - 100) * 0.4 +
        r.kiteY +
        Math.sin(t / 1200 + i) * 3 -
        (jp >= 0 ? Math.sin(jp * Math.PI) * 14 : 0);
      return {
        x,
        y: r.y - lift,
        dir,
        kx,
        ky,
        jp,
        lift,
        tilt: lead * 0.3 + Math.sin(t / 1700 + i * 2) * 0.12,
      };
    }

    function kite(f: Frame, kx: number, ky: number, r: Rider, tilt: number) {
      // a leading-edge kite seen from behind: a bowed crescent, fat in the
      // middle, thin at the tips, banked over a little
      const ca = Math.cos(tilt);
      const sa = Math.sin(tilt);
      for (let k = 0; k <= 28; k++) {
        const u = k / 28;
        const a = Math.PI + u * Math.PI; // left tip, over the top, right tip
        const ox = Math.cos(a) * 12;
        const oy = Math.sin(a) * 5 + 5;
        const x = kx + ox * ca - oy * sa;
        const y = ky + ox * sa + oy * ca;
        const mid = Math.sin(u * Math.PI);
        const th = mid > 0.8 ? 3 : mid > 0.35 ? 2 : 1;
        const tip = mid < 0.3;
        for (let j = 0; j < th; j++) {
          const c = tip
            ? r.tipC
            : j === 0
              ? r.kiteSh
              : k % 5 === 0
                ? r.kiteSh
                : r.kite;
          f.set(x - sa * j, y + ca * j, c);
        }
      }
    }

    function surfer(
      f: Frame,
      x: number,
      y: number,
      dir: number,
      r: Rider,
      airborne: boolean,
      t: number
    ) {
      x = Math.round(x);
      y = Math.round(y);
      const d = dir;
      // wake and spray
      if (!airborne) {
        for (let k = 3; k < 18; k++) {
          const a = 0.8 * (1 - k / 18);
          mix(f, x - d * k, y + 1, P.foam, a);
          if (k % 2 === 0)
            mix(f, x - d * k, y + 2 + (k > 9 ? 1 : 0), P.foam, a * 0.6);
        }
        const sp = Math.floor(t / 110) % 3;
        f.set(x - d * 4, y - 1 - sp, P.foam);
        f.set(x - d * 5, y - sp, P.foam);
      }
      // the board, nose up
      f.hline(x - 3, x + 3, y, P.board);
      f.set(x + d * 4, y - 1, P.board);
      // a rider leaning back against the pull of the kite
      const s = (dx: number, dy: number, c: RGB) =>
        f.set(x + dx * d, y + dy, c);
      s(-1, -1, P.skin);
      s(1, -1, P.skin);
      s(-1, -2, P.skin);
      s(1, -2, P.skinSh);
      s(-1, -3, r.suit);
      s(0, -3, r.suit);
      s(-1, -4, r.suit);
      s(-2, -5, r.suit);
      s(-1, -5, r.suit);
      s(-2, -6, r.suit);
      s(-1, -6, P.skin);
      s(0, -6, P.skin);
      s(1, -6, P.kiteLine);
      s(-3, -7, P.skin);
      s(-2, -7, P.skin);
      s(-3, -8, P.hair);
      s(-2, -8, P.hair);
      return { hx: x + d, hy: y - 6 };
    }

    const BULBS = [P.yellow, P.red, P.white, P.green, P.blue];
    // the bulbs strung along the valance and round the crest
    const bulbSpots: [number, number][] = [];
    for (let lx = -1; lx <= PW; lx++)
      if ((lx + 1) % 3 === 0) bulbSpots.push([lx, PROM - 18]);
    for (const [lx, dy] of [
      [11, -23],
      [12, -24],
      [14, -25],
      [16, -26],
      [18, -27],
      [19, -27],
      [21, -26],
      [23, -25],
      [25, -24],
      [26, -23],
    ] as const)
      bulbSpots.push([lx, PROM + dy]);

    /**
     * The arcade's lights and games ticking over: its glow, the bulbs
     * chasing, the ducks on the gallery's rail. `fast` speeds the bulbs up,
     * `flash` blinks them all together.
     */
    function arcadeBack(f: Frame, t: number) {
      // its warm light on the water behind and the paving in front
      glow(f, ax(PW / 2), PROM - 9, 30, P.arcGlow, 0.22, 0.55, 0.06);
      blit(f, arcBack, arcBackSpans);
      // the bulbs' warm light inside, and the table's cool light on the
      // wall behind it
      glow(f, ax(PW / 2), PROM - 12, 20, P.arcGlow, 0.22, 0.5, 0.08);
      glow(f, ax(10), PROM - 11, 8, P.hockeyLight, 0.3, 0.6, 0.1);
      // ducks gliding along the gallery's rail; now and then one is hit
      // and flips down with a spark
      const hitCycle = Math.floor(t / 2900);
      const hitAge = t - hitCycle * 2900;
      const hitDuck = Math.floor(hash2(hitCycle, 3, 17) * 3);
      for (let k = 0; k < 3; k++) {
        const x = ax(4 + ((Math.floor(t / 260) + k * 7) % 20));
        if (k === hitDuck && hitAge < 420) {
          f.hline(x - 1, x + 1, PROM - 13, P.goldSh);
          if (hitAge < 140) {
            f.set(x, PROM - 14, P.white);
            f.set(x - 1, PROM - 15, P.white);
            f.set(x + 1, PROM - 15, P.white);
          }
          continue;
        }
        f.hline(x - 1, x, PROM - 13, P.duck);
        f.set(x, PROM - 14, P.duck);
        f.set(x + 1, PROM - 14, P.duckBeak);
      }
    }

    function arcadeFront(f: Frame, t: number, fast = 0, flash = false) {
      blit(f, arcFront, arcFrontSpans);
      // the bulbs chasing round
      const step = Math.floor(t / (fast ? 90 : 260));
      for (const [i, [lx, y]] of bulbSpots.entries()) {
        const k = (i + step) % 5;
        const on = flash ? Math.floor(t / 110) % 2 === 0 : k !== 4;
        f.set(ax(lx), y, on ? BULBS[(i + step) % 4]! : P.bulbOff);
      }
      // the air-hockey table: the puck drifting on its air, the apron's
      // lights running
      f.set(ax(Math.round(9.5 + 5.5 * Math.sin(t / 1100))), PROM - 10, P.puck);
      const run = Math.floor(t / 160);
      for (let lx = AH_L + 1; lx < AH_R; lx++)
        if ((lx + run) % 4 === 0) f.set(ax(lx), PROM - 6, P.hockeyLight);
      // the coin pusher: its marquee blinking, the shelf pushing, a glint
      const mq = Math.floor(t / (fast ? 80 : 300));
      for (let lx = CAB_L + 1; lx < CAB_R; lx++) {
        const c = [P.gold, P.pusherLit, P.white][(lx + mq) % 3]!;
        f.set(ax(lx), PROM - 16, c);
        f.set(ax(lx), PROM - 15, (lx + mq) % 3 === 1 ? P.gold : P.pusherLit);
      }
      const push = Math.round(1.5 + 1.5 * Math.sin(t / (fast ? 120 : 650)));
      f.hline(ax(CAB_L + 1), ax(CAB_L + 2 + push), PROM - 12, P.shelf);
      f.set(ax(CAB_L + 3 + push), PROM - 11, P.gold);
      const gl = Math.floor(t / 230);
      f.set(ax(CAB_L + 1 + (gl % 6)), PROM - (gl % 2 ? 10 : 13), P.goldLit);
      f.set(ax(31), PROM - 4, Math.floor(t / 500) % 2 ? P.red : P.green);
    }

    /** Darkens the whole picture by `k` (0..1), for a close-up's spotlight. */
    function dim(f: Frame, k: number) {
      if (k <= 0) return;
      const m = Math.round((1 - k) * 256);
      const px = f.pixels;
      for (let i = 0; i < px.length; i++) {
        const p = px[i]!;
        px[i] =
          (0xff000000 |
            (((((p >>> 16) & 0xff) * m) >> 8) << 16) |
            (((((p >>> 8) & 0xff) * m) >> 8) << 8) |
            (((p & 0xff) * m) >> 8)) >>>
          0;
      }
    }

    // ---------- egg: air hockey ----------
    // Tap the table (or the arcade's glowing front) and a close-up opens out
    // of it over the arcade: the bigger boy at one end, a smaller one at the
    // other, the puck zipping back and forth faster and faster, trailing
    // light, until the bigger boy slams it home. The goal lights flash, a
    // burst of light, and up go his arms.
    const Z = w >= 300 ? 2 : 1; // the close-up's zoom
    const IW = Math.max(
      96,
      Math.min(128, Math.round((w * (Z === 2 ? 0.44 : 0.6)) / Z))
    );
    const IH = 44;
    const IB = Z === 2 ? 4 : 3; // its frame
    const insW = IW * Z;
    const insH = IH * Z;
    const insX = Math.max(
      IB + 1,
      Math.min(w - insW - IB - 1, Math.round(ax(PW / 2) - insW / 2))
    );
    const insY = PROM - 28 - insH - IB;
    const ins = new Frame(IW, IH);
    // the table in perspective: s runs along it from the left player's goal
    // (0) to the right's (1), d across it from the far rail (0) to the near
    // one (1)
    const TCX = IW / 2;
    const TYF = 19;
    const TYN = 30;
    const tlen = (d: number) => IW - 50 + 14 * d;
    const tx = (s: number, d: number) => TCX + (s - 0.5) * tlen(d);
    const ty = (d: number) => TYF + (TYN - TYF) * d;
    const AH_OPEN = 500; // the close-up's open
    const LEGS = [620, 520, 430, 360, 300, 250, 210, 180];
    const STRIKE = [650]; // when each shot's hit; the last is the winner
    for (const d of LEGS) STRIKE.push(STRIKE[STRIKE.length - 1]! + d);
    const GOAL = STRIKE[LEGS.length]! + 170;
    const AH_SHUT = GOAL + 1800; // the close-up starts closing
    const AH = AH_SHUT + 450;
    // how far across the table each shot starts, unfolded so that crossing
    // 0 or 1 is a bounce off a rail; the last one banks into the goal
    const ACROSS = [0.5, 1.3, 0.2, -0.4, 0.8, 1.5, 0.3, 0.9, 0.35, 1.5];
    const fold = (u: number) => {
      const m = ((u % 2) + 2) % 2;
      return m > 1 ? 2 - m : m;
    };
    const S_L = 0.14; // where each of them hits it
    const S_R = 0.86;
    // each player's shots: when, and where across the table
    const shots = (p1: boolean) => {
      const out: [number, number][] = [];
      for (let k = p1 ? 0 : 1; k <= LEGS.length; k += 2)
        out.push([STRIKE[k]!, fold(ACROSS[k]!)]);
      // the smaller boy lunges for the winner, too late and the wrong way
      if (!p1) out.push([GOAL - 30, 0.92]);
      return out;
    };
    const P1_SHOTS = shots(true);
    const P2_SHOTS = shots(false);
    let ahAt = -Infinity;
    const ahAge = (t: number) => t - ahAt;
    const ahBusy = (t: number) => ahAge(t) >= 0 && ahAge(t) < AH;
    const ease = (p: number) => 1 - (1 - p) ** 3;
    const smooth = (p: number) => {
      const q = Math.max(0, Math.min(1, p));
      return q * q * (3 - 2 * q);
    };

    /** The puck at age a, along and across the table; null once it's in. */
    function puck(a: number) {
      if (a < STRIKE[0]!) return { s: S_L, d: 0.5 };
      if (a >= GOAL) return null;
      let k = 0;
      while (k < LEGS.length && a >= STRIKE[k + 1]!) k++;
      const t0 = STRIKE[k]!;
      const t1 = k < LEGS.length ? STRIKE[k + 1]! : GOAL;
      const u = (a - t0) / (t1 - t0);
      const from = k % 2 ? S_R : S_L;
      const to = k === LEGS.length ? 1.07 : k % 2 ? S_L : S_R;
      return {
        s: from + (to - from) * u,
        d: fold(ACROSS[k]! + (ACROSS[k + 1]! - ACROSS[k]!) * u),
      };
    }

    /** A player's mallet at age a: sliding across to meet each shot, jabbing through it. */
    function malletAt(a: number, p1: boolean) {
      const list = p1 ? P1_SHOTS : P2_SHOTS;
      const home = p1 ? S_L - 0.08 : S_R + 0.08;
      const fwd = p1 ? 1 : -1;
      let i = 0;
      while (i < list.length && list[i]![0] < a) i++;
      const [pt, pd] = i > 0 ? list[i - 1]! : [0, 0.5];
      const [nt, nd] = i < list.length ? list[i]! : [pt + 1, pd];
      const d = pd + (nd - pd) * smooth((a - pt) / Math.max(1, nt - pt));
      // the jab through the nearest shot
      const near = Math.min(Math.abs(a - pt), Math.abs(nt - a));
      const s = home + fwd * 0.06 * Math.max(0, 1 - near / 110);
      return { s, d };
    }

    type Boy = {
      h: number;
      head: readonly string[];
      tee: RGB;
      teeSh: RGB;
      shorts: RGB;
      tw: number; // the T-shirt's width
    };
    const BOY1: Boy = {
      h: 28,
      head: BOY1_HEAD,
      tee: P.kidTee,
      teeSh: P.kidTeeSh,
      shorts: P.shorts,
      tw: 7,
    };
    const BOY2: Boy = {
      h: 24,
      head: BOY2_HEAD,
      tee: P.kid2Tee,
      teeSh: P.kid2TeeSh,
      shorts: P.kid2Shorts,
      tw: 7,
    };

    /** A two-pixel-thick arm from the shoulder to the hand, sleeve first. */
    function arm(
      g: Frame,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      sleeve: RGB,
      skin: RGB
    ) {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
      for (let i = 0; i <= n; i++) {
        const x = Math.round(x0 + ((x1 - x0) * i) / n);
        const y = Math.round(y0 + ((y1 - y0) * i) / n);
        const c = i < n * 0.3 ? sleeve : skin;
        g.set(x, y, c);
        g.set(x, y + 1, c);
      }
    }

    /**
     * A boy side on, facing `dir`, his feet on row `foot`: his near hand on
     * `hand` (or hanging if null), or both arms up when he's cheering;
     * `slump` drops his head.
     */
    function boy(
      g: Frame,
      x: number,
      foot: number,
      dir: number,
      b: Boy,
      hand: readonly [number, number] | null,
      cheer: boolean,
      slump: number
    ) {
      const top = foot - b.h + 1;
      const tTop = top + b.head.length; // the T-shirt
      const sTop = tTop + (b.h >= 26 ? 8 : 7); // the shorts
      const lTop = sTop + (b.h >= 26 ? 4 : 3); // the legs
      const c = (dx: number) => x + dx * dir;
      const cl = -3;
      const cr = b.tw - 4;
      // legs, the far one in shade, and white sneakers
      for (let y = lTop; y < foot; y++) {
        g.set(c(-2), y, P.skinSh);
        g.set(c(-1), y, P.skinSh);
        g.set(c(1), y, P.skin);
        g.set(c(2), y, P.skin);
      }
      g.hline(c(-2), c(-1), foot, P.whiteSh);
      g.hline(c(1), c(3), foot, P.white);
      // the far arm: up in the air, or down behind him
      if (cheer) arm(g, c(-1), tTop + 1, c(-4), top - 4, b.teeSh, P.skinSh);
      for (let y = sTop; y < lTop; y++)
        for (let dx = cl; dx <= cr; dx++) g.set(c(dx), y, b.shorts);
      for (let y = tTop; y < sTop; y++)
        for (let dx = cl; dx <= cr; dx++) {
          if (y === tTop && (dx === cl || dx === cr)) continue;
          g.set(c(dx), y, dx === cl || y === sTop - 1 ? b.teeSh : b.tee);
        }
      // arms up for a goal, in a V behind his head
      if (cheer) arm(g, c(1), tTop + 1, c(5), top - 4, b.tee, P.skin);
      const hx = dir > 0 ? x - 3 : x + 4 - b.head[0]!.length;
      sprite(
        g,
        b.head,
        hx + (slump ? dir : 0),
        top + slump,
        {
          H: P.hairKidSh,
          h: P.hairKid,
          s: P.skin,
          S: P.skinSh,
          E: P.frameDark,
          m: cheer ? P.frameDark : P.skinSh,
        },
        dir < 0
      );
      if (cheer) return;
      if (hand) arm(g, c(1), tTop + 1, hand[0], hand[1], b.tee, P.skin);
      else arm(g, c(1), tTop + 1, c(2), tTop + 7, b.tee, P.skin);
    }

    /** Draws the close-up at age a into its own little frame. */
    function drawHockey(a: number, t: number) {
      const g = ins;
      const goal = a - GOAL; // ≥ 0 once the winner's in
      const flash =
        goal >= 0 && goal < 1500 && Math.floor(goal / 110) % 2 === 0;
      // the back wall in the dark of the arcade, the floor
      gradient(g, 0, 37, [P.arcDeep, P.arcMid, P.arcWall]);
      g.rect(0, 37, IW, IH - 37, P.floor);
      g.hline(
        Math.round(tx(0, 1)) - 4,
        Math.round(tx(1, 1)) + 4,
        37,
        P.floorLit
      );
      // bulbs strung along the top, chasing (all flashing for the goal)
      const step = Math.floor(t / 150);
      for (let i = 0, x = 2; x < IW; i++, x += 4) {
        const y = 2 + (i % 2);
        const on = goal >= 0 ? flash === (i % 2 === 0) : (i + step) % 4 !== 3;
        g.set(x, y, on ? BULBS[(i + step) % 4]! : P.bulbOff);
        if (on) glow(g, x, y, 3, BULBS[(i + step) % 4]!, 0.25, 1, 0.1);
      }
      // the shooting gallery on the wall behind: targets, ducks on a rail
      const gx0 = Math.round(TCX - 26);
      const gx1 = Math.round(TCX + 25);
      g.hline(gx0, gx1, 6, P.galleryRim);
      g.rect(gx0, 7, gx1 - gx0 + 1, 6, P.gallery);
      g.hline(gx0, gx1, 13, P.galleryRim);
      g.hline(gx0 + 1, gx1 - 1, 12, P.rail);
      for (let x = gx0 + 5; x < gx1 - 3; x += 9) {
        g.hline(x - 1, x + 1, 8, P.white);
        g.set(x, 8, P.red);
        g.set(x, 7, P.white);
        g.set(x, 9, P.white);
      }
      for (let k = 0; k < 4; k++) {
        const dx = gx0 + 2 + ((Math.floor(t / 120) + k * 13) % (gx1 - gx0 - 5));
        g.hline(dx, dx + 2, 11, P.duck);
        g.hline(dx + 1, dx + 2, 10, P.duck);
        g.set(dx + 3, 10, P.duckBeak);
      }
      // the table's cool light on the wall
      glow(g, TCX, TYF - 3, IW * 0.4, P.hockeyLight, 0.28, 0.45, 0.06);
      // the table: far rail, the top with its air holes and markings, the
      // end rails with the goals' mouths, the near rail, the lit apron
      const xf0 = Math.round(tx(0, 0));
      const xf1 = Math.round(tx(1, 0));
      const xn0 = Math.round(tx(0, 1));
      const xn1 = Math.round(tx(1, 1));
      g.hline(xf0 - 1, xf1 + 1, TYF - 1, P.hockeyRim);
      for (let y = TYF; y <= TYN; y++) {
        const d = (y - TYF) / (TYN - TYF);
        const xl = Math.round(tx(0, d));
        const xr = Math.round(tx(1, d));
        for (let x = xl; x <= xr; x++)
          g.set(
            x,
            y,
            y % 2 === 0 && (x + y) % 4 === 0
              ? P.hockeyDot
              : d < 0.2
                ? P.hockeySh
                : P.hockey
          );
        const mouth = d > 0.28 && d < 0.72;
        g.set(xl - 1, y, mouth ? P.puck : P.hockeyRim);
        g.set(xr + 1, y, mouth ? P.puck : P.hockeyRim);
      }
      for (let y = TYF; y <= TYN; y++) g.set(Math.round(TCX), y, P.hockeyRim);
      for (let i = 0; i < 40; i++) {
        const an = (i / 40) * Math.PI * 2;
        const cx = Math.cos(an);
        const cy = Math.sin(an);
        g.set(TCX + cx * 6, ty(0.5) + cy * 3, P.hockeyRim);
        // the goal creases, half rings round each goal
        if (cx > 0) {
          g.set(tx(0, 0.5) + cx * 6, ty(0.5) + cy * 3.5, P.hockeyBody);
          g.set(tx(1, 0.5) - cx * 6, ty(0.5) + cy * 3.5, P.hockeyBody);
        }
      }
      g.hline(xn0 - 1, xn1 + 1, TYN + 1, P.hockeyRimLit);
      g.rect(xn0 - 1, TYN + 2, xn1 - xn0 + 3, 4, P.hockeyBody);
      g.hline(xn0 - 1, xn1 + 1, TYN + 5, P.hockeyBodySh);
      const run = Math.floor(t / (a < GOAL ? 90 : 60));
      for (let x = xn0 + 4; x <= xn1 - 4; x += 2)
        g.set(
          x,
          TYN + 3,
          goal >= 0
            ? flash
              ? P.gold
              : P.red
            : (x / 2 + run) % 3 === 0
              ? P.hockeyLight
              : P.hockeyBodySh
        );
      // the goal lights at each end of the apron
      for (const [x0, mine] of [
        [xn0, false],
        [xn1 - 2, true],
      ] as const) {
        const lit = mine && goal >= 0 ? flash : false;
        g.rect(x0, TYN + 3, 3, 2, lit ? P.burst : P.hockeyBodySh);
        if (lit) glow(g, x0 + 1, TYN + 3, 9, P.gold, 0.6, 1, 0.1);
      }
      for (const x of [xn0, xn1 - 1])
        g.rect(x, TYN + 6, 2, 36 - TYN, P.hockeyBodySh);
      // the puck, trailing light the faster it goes, and a spark at each hit
      const pk = puck(a);
      if (pk) {
        let prev: [number, number] | null = null;
        for (let j = 0; j <= 10; j++) {
          const b = a - j * 14;
          if (b < STRIKE[0]!) break;
          const q = puck(b);
          if (!q) continue;
          const qx = Math.round(tx(q.s, q.d));
          const qy = Math.round(ty(q.d));
          if (prev && j > 0) {
            const c = lerpRGB(P.trail, P.trailFade, j / 10);
            g.line(prev[0], prev[1], qx, qy, c);
            if (j < 5) g.line(prev[0], prev[1] - 1, qx, qy - 1, c);
          }
          prev = [qx, qy];
        }
        const px = Math.round(tx(pk.s, pk.d));
        const py = Math.round(ty(pk.d));
        g.hline(px - 1, px + 1, py, P.puck);
        g.hline(px - 1, px + 1, py - 1, P.puckLit);
      }
      for (const st of STRIKE) {
        const da = a - st;
        if (da < 0 || da >= 110) continue;
        const q = puck(st)!;
        const sx = Math.round(tx(q.s, q.d));
        const sy = Math.round(ty(q.d)) - 1;
        const r = 1 + Math.round(da / 40);
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const)
          g.set(sx + dx * r, sy + dy * r, P.white);
      }
      // the mallets, and the boys holding them
      const cheer = goal >= 0 && goal < 1750;
      const bob = cheer
        ? Math.round(3 * Math.abs(Math.sin(goal / 160)) * (1 - goal / 1750))
        : 0;
      const hands: [number, number][] = [];
      for (const p1 of [true, false]) {
        const m = malletAt(Math.min(a, GOAL + 200), p1);
        const mx = Math.round(tx(m.s, m.d));
        const my = Math.round(ty(m.d));
        g.hline(mx - 2, mx + 1, my, P.malletSh);
        g.hline(mx - 2, mx + 1, my - 1, P.mallet);
        g.hline(mx - 1, mx, my - 2, P.malletSh);
        hands.push([mx, my - 3]);
      }
      boy(g, xn0 - 9, IH - 3 - bob, 1, BOY1, hands[0]!, cheer, 0);
      const slump = goal > 150 ? 1 : 0;
      boy(g, xn1 + 9, IH - 3, -1, BOY2, slump ? null : hands[1]!, false, slump);
      // the goal: a flash, a burst of light from the goal's mouth, sparks
      if (goal >= 0) {
        const gx = xn1 + 1;
        const gy = Math.round(ty(0.5));
        const fade = goal < 450 ? 1 : Math.max(0, 1 - (goal - 450) / 600);
        if (fade > 0) {
          glow(
            g,
            gx,
            gy,
            6 + Math.min(goal, 400) * 0.04,
            P.gold,
            0.8 * fade,
            0.8,
            0.12
          );
          // bold rays of light bursting out of the goal's mouth
          const r1 = 5 + Math.min(goal, 350) * 0.07;
          for (let k = 0; k < 12; k++) {
            const an = (k / 12) * Math.PI * 2 + 0.26;
            const ca = Math.cos(an);
            const sa = Math.sin(an) * 0.75;
            const len = r1 * (k % 2 ? 0.65 : 1);
            for (let i = 3; i <= len; i++) {
              const c = i < len * 0.5 ? P.burst : k % 2 ? P.gold : P.goldLit;
              const al = fade * (1 - (i / (len + 2)) * 0.6);
              g.blend(gx + ca * i, gy + sa * i, c, al);
              if (i < len * 0.6)
                g.blend(gx + ca * i - sa, gy + sa * i + ca * 0.75, c, al * 0.7);
            }
          }
          // and a star flashing right in it
          const st = 2 + (Math.floor(goal / 80) % 2) * 2;
          for (let i = -st; i <= st; i++) {
            g.blend(gx + i, gy, P.burst, fade);
            g.blend(gx, gy + i, P.burst, fade);
          }
        }
        for (let i = 0; i < 22; i++) {
          const life = 900 + hash2(i, 1, 51) * 500;
          if (goal > life) continue;
          const an = hash2(i, 2, 51) * Math.PI * 2;
          const sp = 0.03 + hash2(i, 3, 51) * 0.05;
          const sx = gx + Math.cos(an) * sp * goal;
          const sy =
            gy + Math.sin(an) * sp * goal * 0.8 + 0.00003 * goal * goal;
          g.set(sx, sy, BULBS[i % 4]!);
        }
        if (goal < 200) {
          const k = 0.6 * (1 - goal / 200);
          for (let y = 0; y < IH; y++)
            for (let x = 0; x < IW; x++) g.blend(x, y, P.burst, k);
        }
      }
    }

    /** The close-up's frame: dark edges and a band of chasing bulbs. */
    function hockeyFrame(
      f: Frame,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      t: number,
      goal: number
    ) {
      const b = IB;
      for (let i = 0; i < b; i++) {
        const c = i === 0 || i === b - 1 ? P.frameDark : P.awnRedSh;
        f.hline(x0 - b + i, x1 + b - 1 - i, y0 - b + i, c);
        f.hline(x0 - b + i, x1 + b - 1 - i, y1 + b - 1 - i, c);
        f.vline(x0 - b + i, y0 - b + i, y1 + b - 1 - i, c);
        f.vline(x1 + b - 1 - i, y0 - b + i, y1 + b - 1 - i, c);
      }
      const bs = b - 2; // a bulb's size
      const gap = Z === 2 ? 6 : 4;
      const bx0 = x0 - b + 1;
      const by0 = y0 - b + 1;
      const bx1 = x1 + 1;
      const by1 = y1 + 1;
      const step = Math.floor(t / (goal >= 0 ? 70 : 140));
      const flash = goal >= 0 && Math.floor(goal / 110) % 2 === 0;
      let i = 0;
      const bulb = (x: number, y: number) => {
        const k = (i + step) % 4;
        const on = goal >= 0 && goal < 1500 ? flash === (i % 2 === 0) : k !== 3;
        f.rect(x, y, bs, bs, on ? BULBS[k]! : P.bulbOff);
        i++;
      };
      for (let x = bx0; x < bx1; x += gap) bulb(x, by0);
      for (let y = by0; y < by1; y += gap) bulb(bx1, y);
      for (let x = bx1; x > bx0; x -= gap) bulb(x, by1);
      for (let y = by1; y > by0; y -= gap) bulb(bx0, y);
    }

    /** Where the close-up is at age a, and how far open (0..1). */
    function hockeyRect(a: number) {
      const k =
        a < AH_OPEN
          ? ease(a / AH_OPEN)
          : a > AH_SHUT
            ? 1 - ((a - AH_SHUT) / (AH - AH_SHUT)) ** 2
            : 1;
      const sx = ahSpot.x;
      const sy = ahSpot.y;
      const x0 = Math.round(sx + (insX - sx) * k);
      const y0 = Math.round(sy + (insY - sy) * k);
      return {
        x0,
        y0,
        x1: Math.round(sx + (insX + insW - sx) * k),
        y1: Math.round(sy + (insY + insH - sy) * k),
        k,
      };
    }

    function hockey(f: Frame, t: number) {
      const a = ahAge(t);
      if (a < 0 || a >= AH) return;
      const r = hockeyRect(a);
      // the rest of the evening fades back while it's open
      dim(f, 0.38 * r.k);
      const rw = r.x1 - r.x0;
      const rh = r.y1 - r.y0;
      if (rw < 4 || rh < 3) return;
      drawHockey(a, t);
      for (let y = Math.max(0, r.y0); y < Math.min(h, r.y1); y++) {
        const sy = Math.min(IH - 1, Math.floor(((y - r.y0) * IH) / rh));
        for (let x = Math.max(0, r.x0); x < Math.min(w, r.x1); x++) {
          const sx = Math.min(IW - 1, Math.floor(((x - r.x0) * IW) / rw));
          f.pixels[y * w + x] = ins.pixels[sy * IW + sx]!;
        }
      }
      hockeyFrame(f, r.x0, r.y0, r.x1 - 1, r.y1 - 1, t, a - GOAL);
    }
    /** Whether (x, y) is on the close-up while it's open. */
    const onHockey = (x: number, y: number, t: number) => {
      const a = ahAge(t);
      if (a < 0 || a >= AH) return false;
      const r = hockeyRect(a);
      return x >= r.x0 - IB && x < r.x1 + IB && y >= r.y0 - IB && y < r.y1 + IB;
    };

    // ---------- egg: coins ----------
    // The coin pusher. Tap it: a boy drops a coin in, the shelf shoves, and
    // it pays out the jackpot. Gold gushes out and avalanches over the whole
    // embankment, bouncing and glinting, tumbling off the edge onto the
    // sand, and the boys dash about scooping it up, the toddler too, while
    // the woman looks on; then the last coins twinkle away and everyone goes
    // back inside.
    const CN_DROP = 350; // the coin is in the slot
    const CN_JACK = 1050; // the jackpot
    const CN_POUR = 1300; // how long it pours for
    const CN_GO = 1650; // the boys hop down after it
    const CN_HOME = 5300; // and come back
    const CN_IN = 7000; // and go in behind the counter
    const COINS = 7400;
    const G = 0.0007; // gravity, px/ms²
    let coinsAt = -Infinity;
    const coinsAge = (t: number) => t - coinsAt;
    const coinsBusy = (t: number) => coinsAge(t) >= 0 && coinsAge(t) < COINS;
    const cabX = ax(30.5);
    type Hop = { t: number; x: number; y: number; vx: number; vy: number };
    type Coin = {
      hops: Hop[];
      rest: number; // when it settles
      x: number; // and where
      y: number;
      prom: boolean; // on the promenade, where the boys can get it
      got: number; // when it's scooped up (or twinkles out)
      spin: number;
    };
    const coins: Coin[] = [];
    {
      const n = Math.round(Math.max(70, Math.min(180, w * 0.4)));
      const left = cabX;
      const right = w - cabX;
      const pRight = Math.max(0.45, Math.min(0.75, right / (left + right)));
      for (let i = 0; i < n; i++) {
        const t0 = CN_JACK + CN_POUR * (i / n) ** 1.5;
        const dir = hash2(i, 1, 61) < pRight ? 1 : -1;
        // as far as there's room for on that side
        const vmax = Math.max(
          0.03,
          Math.min(0.15, (dir > 0 ? right : left) / 1100)
        );
        let vx = dir * vmax * (0.15 + 0.85 * hash2(i, 2, 61));
        let vy = -(0.1 + 0.2 * hash2(i, 3, 61) + (i < n * 0.25 ? 0.05 : 0));
        let x = cabX + (hash2(i, 4, 61) - 0.5) * 4;
        let y = PROM - 9;
        let t = t0;
        // some land on the paving, some tumble off the wall onto the sand;
        // the first just plops out at the toddler's feet
        const prom0 = i === 0 || hash2(i, 5, 61) < 0.6;
        if (i === 0) {
          vx = -0.022;
          vy = -0.1;
        }
        const sand = 142 + Math.floor(hash2(i, 6, 61) * 7);
        const pave = PROM - 2 + Math.floor(hash2(i, 7, 61) * 3);
        let prom = prom0;
        const hops: Hop[] = [];
        let gone = false;
        for (let b = 0; b < 8; b++) {
          let gy = prom ? pave : sand;
          const land = (gy2: number) =>
            (-vy + Math.sqrt(vy * vy + 2 * G * (gy2 - y))) / G;
          let T = land(gy);
          if (prom && x + vx * T > embR + 1) {
            // off the end of the embankment, down to the beach
            prom = false;
            gy = Math.max(sand - 6, Math.round(shoreY(x + vx * T)) + 6);
            T = land(gy);
          }
          hops.push({ t, x, y, vx, vy });
          x += vx * T;
          t += T;
          y = gy;
          if (x < -4 || x > w + 4) {
            gone = true;
            break;
          }
          vy = -(vy + G * T) * 0.42;
          vx *= 0.62;
          if (-vy < 0.035) break;
        }
        coins.push({
          hops,
          rest: t,
          x: gone ? -99 : x + vx * 90,
          y,
          prom: prom && !gone,
          got: gone ? t : CN_HOME + 400 + hash2(i, 8, 61) * 1200,
          spin: hash2(i, 9, 61) * 4,
        });
      }
    }
    // The boys' dash: they hop down off the wall onto the sand, where most
    // of it landed, and each in turn runs to the nearest coin still lying
    // there, scoops it up (and any next to it), and on to the next, until
    // it's time to hop back up. The toddler stays up on the promenade with
    // the woman, and toddles over to the coin that plopped out at his feet.
    type Leg = {
      t0: number;
      t1: number;
      x0: number;
      x1: number;
      y0: number;
      y1: number;
      kind: 'run' | 'scoop' | 'hop';
    };
    type Runner = { home: number; v: number; legs: Leg[] };
    const UP = PROM - 3; // feet on the promenade
    const SAND = 147; // and down on the beach
    const HOP = 450;
    const runners: Runner[] = [
      { home: ax(25), v: 0.05, legs: [] },
      { home: ax(21), v: 0.042, legs: [] },
      { home: ax(13), v: 0.014, legs: [] },
    ];
    {
      const wide = cabX > 60; // room for one of them on each side
      const zone = [
        [wide ? cabX - 8 : 1, w - 3],
        [1, wide ? cabX + 8 : w - 3],
        [ax(8), ax(27)],
      ] as const;
      const taken = new Set<Coin>();
      const at = runners.map((r, k) => {
        if (k === 2) return { x: r.home, y: UP, t: CN_GO + 300 };
        const t0 = CN_GO + k * 160;
        const x = r.home + (k === 0 ? 3 : -3);
        r.legs.push({
          t0,
          t1: t0 + HOP,
          x0: r.home,
          x1: x,
          y0: UP,
          y1: SAND,
          kind: 'hop',
        });
        return { x, y: SAND, t: t0 + HOP };
      });
      for (let guard = 0; guard < 300; guard++) {
        let k = -1;
        for (let j = 0; j < runners.length; j++)
          if (at[j]!.t < CN_HOME && (k < 0 || at[j]!.t < at[k]!.t)) k = j;
        if (k < 0) break;
        const r = runners[k]!;
        const s = at[k]!;
        const [lo, hi] = zone[k]!;
        const down = k < 2;
        let best: Coin | null = null;
        let bestT = Infinity;
        for (const c of coins) {
          if (taken.has(c) || c.x < lo || c.x > hi) continue;
          if (down ? c.prom || c.y < 141 : !c.prom) continue;
          const arrive =
            s.t + (Math.abs(c.x - s.x) + Math.abs(c.y - s.y)) / r.v;
          const when = Math.max(arrive, c.rest + 80);
          // close enough to be back in time
          const back = Math.abs(c.x - r.home) / r.v + (down ? HOP : 0);
          const due = down ? CN_IN - 100 : CN_HOME + 950;
          if (Math.max(when + 300, CN_HOME) + back > due) continue;
          if (when < bestT) {
            bestT = when;
            best = c;
          }
        }
        if (!best) {
          s.t = CN_HOME;
          continue;
        }
        const fy = down ? best.y + 1 : UP;
        const arrive =
          s.t + (Math.abs(best.x - s.x) + Math.abs(fy - s.y)) / r.v;
        r.legs.push({
          t0: s.t,
          t1: arrive,
          x0: s.x,
          x1: best.x,
          y0: s.y,
          y1: fy,
          kind: 'run',
        });
        r.legs.push({
          t0: arrive,
          t1: bestT + 300,
          x0: best.x,
          x1: best.x,
          y0: fy,
          y1: fy,
          kind: 'scoop',
        });
        for (const c of coins)
          if (
            !taken.has(c) &&
            c.prom === !down &&
            Math.abs(c.x - best.x) <= 2.5 &&
            Math.abs(c.y - best.y) <= 2 &&
            c.rest < bestT + 150
          ) {
            c.got = bestT + 150;
            taken.add(c);
          }
        s.x = best.x;
        s.y = fy;
        s.t = bestT + 300;
      }
      // back to the arcade: along the sand, a hop up, and in
      for (const [k, r] of runners.entries()) {
        const s = at[k]!;
        let t0 = Math.max(s.t, CN_HOME);
        const x1 = k < 2 ? r.home + (k === 0 ? 3 : -3) : r.home;
        const t1 =
          t0 + (Math.abs(x1 - s.x) + Math.abs((k < 2 ? SAND : UP) - s.y)) / r.v;
        r.legs.push({
          t0,
          t1,
          x0: s.x,
          x1,
          y0: s.y,
          y1: k < 2 ? SAND : UP,
          kind: 'run',
        });
        t0 = t1;
        if (k < 2)
          r.legs.push({
            t0,
            t1: t0 + HOP,
            x0: x1,
            x1: r.home,
            y0: SAND,
            y1: UP,
            kind: 'hop',
          });
      }
    }

    /** Where a runner is at age a, which way they face, and what they're up to. */
    function runnerAt(r: Runner, a: number) {
      let dir = 1;
      for (const l of r.legs) {
        if (a < l.t0) break;
        if (l.x1 !== l.x0) dir = l.x1 > l.x0 ? 1 : -1;
        if (a < l.t1) {
          const u = (a - l.t0) / Math.max(1, l.t1 - l.t0);
          const hop = l.kind === 'hop';
          return {
            x: l.x0 + (l.x1 - l.x0) * u,
            y:
              l.y0 +
              (l.y1 - l.y0) * (hop ? u * u : u) -
              (hop ? Math.sin(u * Math.PI) * 7 : 0),
            dir,
            kind: l.kind,
          };
        }
      }
      const last = r.legs[r.legs.length - 1];
      const done = !!last && a >= last.t1;
      return {
        x: done ? last.x1 : r.home,
        y: done ? last.y1 : UP,
        dir: a < CN_GO ? 1 : dir,
        kind: 'stand' as const,
      };
    }

    type Kid = {
      h: number;
      hair: RGB;
      tee: RGB;
      teeSh: RGB;
      shorts: RGB;
    };
    const KIDS: Kid[] = [
      {
        h: 7,
        hair: P.hairKid,
        tee: P.kidTee,
        teeSh: P.kidTeeSh,
        shorts: P.shorts,
      },
      {
        h: 6,
        hair: P.hairKid,
        tee: P.kid2Tee,
        teeSh: P.kid2TeeSh,
        shorts: P.kid2Shorts,
      },
      {
        h: 4,
        hair: P.hairBaby,
        tee: P.white,
        teeSh: P.whiteSh,
        shorts: P.whiteSh,
      },
    ];

    /** One of the boys, small, on the promenade: standing, running, scooping or cheering. */
    function kid(
      f: Frame,
      x: number,
      feet: number,
      dir: number,
      k: Kid,
      pose: 'stand' | 'run' | 'scoop' | 'cheer',
      t: number
    ) {
      x = Math.round(x);
      feet = Math.round(feet);
      const front = dir > 0 ? x + 1 : x;
      const back = dir > 0 ? x : x + 1;
      const step = Math.floor(t / 110) % 2;
      if (pose === 'scoop') {
        // bent right over, a hand down to the ground
        const y = feet - 3;
        f.set(back, y, k.teeSh);
        f.set(front, y, k.tee);
        f.set(front + dir, y, k.hair);
        f.set(front + dir, y + 1, P.skin);
        f.set(front + dir * 2, y + 1, k.hair);
        f.set(back, y + 1, k.shorts);
        f.set(front, y + 1, k.teeSh);
        f.set(front + dir, feet, P.skin);
        f.set(back, y + 2, P.skin);
        f.set(back, feet, P.skin);
        return;
      }
      const top = feet - k.h + 1;
      f.set(back, top, k.hair);
      f.set(front, top, k.hair);
      f.set(back, top + 1, k.hair);
      f.set(front, top + 1, P.skin);
      let y = top + 2;
      if (k.h >= 7) {
        f.set(back, y, P.skinSh);
        f.set(front, y, P.skin);
        y++;
      }
      for (; y < feet - 1; y++) {
        f.set(back, y, k.teeSh);
        f.set(front, y, k.tee);
      }
      f.set(back, feet - 1, k.shorts);
      f.set(front, feet - 1, k.shorts);
      if (pose === 'run') {
        f.set(step ? back - dir : back, feet, P.skin);
        f.set(step ? front : front + dir, feet, P.skin);
      } else {
        f.set(back, feet, P.skin);
        f.set(front, feet, P.skin);
      }
      if (pose === 'cheer') {
        // arms up (the toddler holding up his coin)
        if (k.h > 4) {
          f.set(back - dir, top - 1, P.skin);
          f.set(back - dir, top, k.tee);
        }
        f.set(front + dir, top - 1, k.h > 4 ? P.skin : P.gold);
        f.set(front + dir, top, k.h > 4 ? k.tee : P.skin);
      }
    }

    /** A young woman: dark hair to her shoulders, a summer dress; the toddler on her hip when he's not off after the coins. */
    function woman(f: Frame, x: number, carrying: boolean) {
      const feet = PROM - 3;
      const top = feet - 7;
      f.hline(x, x + 1, top, P.womanHair);
      f.set(x, top + 1, P.womanHair);
      f.set(x + 1, top + 1, P.skin);
      f.set(x, top + 2, P.womanHair);
      f.set(x + 1, top + 2, P.skin);
      for (let y = top + 3; y <= feet - 2; y++) {
        f.set(x, y, P.womanDressSh);
        f.set(x + 1, y, P.womanDress);
      }
      f.hline(x - 1, x + 2, feet - 1, P.womanDress);
      f.set(x - 1, feet - 1, P.womanDressSh);
      f.set(x, feet, P.skin);
      f.set(x + 1, feet, P.skin);
      f.set(x + 2, top + 3, P.skin);
      if (carrying) {
        f.set(x + 2, top + 2, P.hairBaby);
        f.set(x + 3, top + 2, P.hairBaby);
        f.set(x + 2, top + 4, P.white);
        f.set(x + 3, top + 3, P.white);
      }
    }

    /** The woman and the kids, inside (behind the counter) or out on the promenade. */
    function arcadeGroup(f: Frame, t: number, inside: boolean) {
      const a = coinsAge(t);
      if (a < 0 || a >= COINS || inside !== a >= CN_IN) return;
      const cheer = a >= CN_JACK && a < CN_GO;
      const babyOff = a >= CN_GO && a < CN_HOME + 1000;
      woman(f, ax(10), !babyOff);
      for (const [k, r] of runners.entries()) {
        if (k === 2 && !babyOff) continue;
        const s = runnerAt(r, a);
        // the toddler, once he's got his coin, holds it up for all to see
        const held =
          k === 2 &&
          r.legs.some((l) => l.kind === 'scoop' && a >= l.t1) &&
          s.kind !== 'run';
        kid(
          f,
          s.x,
          s.y,
          s.dir,
          KIDS[k]!,
          cheer || held
            ? 'cheer'
            : s.kind === 'scoop'
              ? 'scoop'
              : s.kind === 'run'
                ? 'run'
                : 'stand',
          t
        );
        // the bigger boy's arm up to drop the coin in
        if (k === 0 && a < CN_DROP)
          f.set(Math.round(s.x) + 2, PROM - 7, P.skin);
      }
    }

    /** The coin pusher's show, and the gold all over the embankment. */
    function coinShow(f: Frame, t: number) {
      const a = coinsAge(t);
      if (a < 0 || a >= COINS) return;
      // the coin, flipped up and into the slot
      if (a < CN_DROP) {
        const u = a / CN_DROP;
        f.set(
          ax(27) + 3.5 * u,
          PROM - 7 - Math.sin(u * Math.PI) * 5 + u,
          Math.floor(a / 60) % 2 ? P.goldLit : P.gold
        );
      }
      // the shelf shoving, the cabinet lighting up more and more
      if (a >= CN_DROP && a < CN_JACK) {
        const k = (a - CN_DROP) / (CN_JACK - CN_DROP);
        const beat = Math.floor(a / 90) % 2;
        glow(
          f,
          cabX,
          PROM - 10,
          10 + k * 14 + beat * 3,
          P.gold,
          0.3 + k * 0.4,
          1,
          0.08
        );
        f.hline(
          ax(CAB_L + 1),
          ax(CAB_R - 1),
          PROM - 16,
          beat ? P.white : P.gold
        );
        f.hline(
          ax(CAB_L + 1),
          ax(CAB_R - 1),
          PROM - 15,
          beat ? P.gold : P.white
        );
        const sh = Math.round(Math.sin(a / 60) * 1.2);
        f.hline(ax(CAB_L + 1), ax(CAB_L + 3 + sh), PROM - 12, P.shelf);
        for (let lx = CAB_L + 1; lx < CAB_R; lx++)
          f.set(
            ax(lx),
            PROM - 9,
            (lx + Math.floor(a / 80)) % 2 ? P.goldLit : P.gold
          );
      }
      // jackpot! a flash of gold light and rays bursting from the cabinet
      const j = a - CN_JACK;
      if (j >= 0 && j < 1400) {
        const fade = j < 300 ? 1 : 1 - (j - 300) / 1100;
        glow(f, cabX, PROM - 12, 26 + j * 0.03, P.gold, 0.55 * fade, 0.9, 0.06);
        const r1 = 6 + j * 0.06;
        for (let k = 0; k < 12; k++) {
          const an = -Math.PI * (k / 11);
          const n = Math.round(r1 * (k % 2 ? 0.7 : 1));
          for (let i = Math.round(n * 0.4); i <= n; i++)
            mix(
              f,
              cabX + Math.cos(an) * i,
              PROM - 14 + Math.sin(an) * i * 0.8,
              k % 2 ? P.gold : P.goldLit,
              fade * (1 - i / (n + 3))
            );
        }
        for (let lx = CAB_L; lx <= CAB_R; lx++)
          for (let y = PROM - 16; y <= PROM - 3; y++)
            if (j < 500 && Math.floor(j / 90) % 2 === 0)
              mix(f, ax(lx), y, P.goldLit, 0.5);
      }
      // the gold lighting up the embankment while it pours
      if (j >= 0 && j < CN_POUR + 1200) {
        const k = j < CN_POUR ? 1 : 1 - (j - CN_POUR) / 1200;
        glow(f, cabX, PROM - 4, 60, P.gold, 0.22 * k, 0.6, 0.05);
      }
      // the gold: flying, bouncing, settling and glinting, until it's scooped
      // up or twinkles out
      for (const [i, c] of coins.entries()) {
        const t0 = c.hops[0]!.t;
        if (a < t0 || a >= c.got + 160) continue;
        if (a >= c.got) {
          // a last glint as it goes
          const r = 1 + Math.round((a - c.got) / 60);
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ] as const)
            f.set(c.x + dx * r, c.y - 1 + dy * r, P.goldLit);
          continue;
        }
        let x: number;
        let y: number;
        let flying = true;
        if (a < c.rest) {
          let k = 0;
          while (k + 1 < c.hops.length && a >= c.hops[k + 1]!.t) k++;
          const hp = c.hops[k]!;
          const dt = a - hp.t;
          x = hp.x + hp.vx * dt;
          y = hp.y + hp.vy * dt + 0.5 * G * dt * dt;
        } else {
          const last = c.hops[c.hops.length - 1]!;
          const lx0 = last.x + last.vx * (c.rest - last.t);
          const u = Math.min(1, (a - c.rest) / 180);
          x = lx0 + (c.x - lx0) * (1 - (1 - u) ** 2);
          y = c.y;
          flying = u < 1;
        }
        x = Math.round(x);
        y = Math.round(y);
        if (flying) {
          // spinning: face on, then edge on
          const ph = Math.floor((a - t0) / 70 + c.spin) % 4;
          if (ph === 2) {
            f.vline(x, y - 2, y, P.gold);
            f.set(x, y - 2, P.goldLit);
          } else if (ph === 1 || ph === 3) {
            f.vline(x, y - 2, y, P.gold);
            f.vline(x + 1, y - 2, y, P.goldSh);
            f.set(x, y - 2, P.goldLit);
          } else {
            f.set(x, y - 2, P.goldSh);
            f.set(x + 1, y - 2, P.goldLit);
            f.set(x + 2, y - 2, P.goldSh);
            f.hline(x, x + 2, y - 1, P.gold);
            f.set(x, y - 1, P.goldLit);
            f.set(x, y, P.goldSh);
            f.set(x + 1, y, P.gold);
            f.set(x + 2, y, P.goldDark);
          }
        } else {
          f.hline(x, x + 2, y, P.gold);
          f.set(x + 1, y, P.goldLit);
          f.hline(x, x + 2, y + 1, P.goldDark);
        }
        // glints, often
        if (hash2(i, Math.floor(a / 120), 62) > (flying ? 0.82 : 0.9)) {
          const gx = x + 1;
          const gy = y - (flying ? 1 : 1);
          f.set(gx, gy, P.white);
          f.set(gx - 2, gy, P.goldLit);
          f.set(gx + 2, gy, P.goldLit);
          f.set(gx, gy - 2, P.goldLit);
          f.set(gx, gy + 2, P.goldLit);
          f.set(gx - 1, gy, P.white);
          f.set(gx + 1, gy, P.white);
          f.set(gx, gy - 1, P.white);
        }
      }
    }

    function lighthouseLamp(f: Frame, t: number) {
      const a = t - beamAt;
      const flash = t % 5000 < 380;
      if (a >= 0 && a < 5200) {
        // the lens turns: a beam sweeping across the sky, flaring as it faces us
        const fade = a < 300 ? a / 300 : a > 4600 ? (5200 - a) / 600 : 1;
        const th = (a / 1700) * Math.PI * 2;
        const s = Math.sin(th);
        const dir = s > 0 ? 1 : -1;
        const len = Math.abs(s) * Math.min(170, w * 0.45);
        for (let d = 2; d < len; d++) {
          const half = 0.6 + d * 0.1;
          const al = Math.round(0.6 * fade * (1 - d / (len + 30)) * 8) / 8;
          for (let yy = Math.round(lampY - half); yy <= lampY + half; yy++) {
            const core = Math.abs(yy - lampY) < half * 0.4;
            mix(
              f,
              lx + dir * d,
              yy,
              core ? P.lamp : P.lampGlow,
              core ? al : al * 0.5
            );
          }
        }
        const face = Math.cos(th);
        if (face > 0.6)
          glow(
            f,
            lx,
            lampY,
            6 + face * 10,
            P.lampGlow,
            0.7 * fade * face,
            1,
            0.15
          );
      } else if (flash) {
        glow(f, lx, lampY, 9, P.lampGlow, 0.6, 1, 0.15);
      }
      f.rect(lx - 1, lampY - 1, 3, 2, flash || a < 5200 ? P.white : P.lamp);
    }

    /** The bronze goby: a big flat head, bulging eyes, fanned fins, on its stone. */
    const GOBY_TOP = [
      6, 4, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7,
    ];
    const GOBY_BOT = [
      9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 9, 9, 9, 9,
      9, 9, 8,
    ];
    /** Paints the bronze fish with its row 0 at y0 and its lips at x0. */
    function gobyPaint(f: Frame, x0: number, y0: number) {
      const px = (c: number, r: number, col: RGB) => f.set(x0 + c, y0 + r, col);
      // second dorsal fin: a long low fin of rays
      for (let c = 14; c <= 21; c++) {
        const tp = c < 20 ? 3 : 4;
        for (let r = tp; r < GOBY_TOP[c]!; r++)
          px(c, r, r === tp ? P.bronzeLit : c % 2 ? P.bronze : P.bronzeDark);
      }
      // first dorsal fin: short and spiny
      const spines: [number, number][] = [
        [8, 2],
        [9, 1],
        [10, 1],
        [11, 2],
        [12, 3],
      ];
      for (const [c, r] of spines)
        for (let rr = r; rr < GOBY_TOP[c]!; rr++)
          px(c, rr, rr === r ? P.bronzeHi : P.bronze);
      // body: lit along the back, dark along the belly
      for (let c = 0; c < GOBY_TOP.length; c++) {
        const tp = GOBY_TOP[c]!;
        const bt = GOBY_BOT[c]!;
        for (let r = tp; r <= bt; r++) {
          let col =
            r === tp
              ? c > 2
                ? P.bronzeHi
                : P.bronzeLit
              : r === tp + 1
                ? P.bronzeLit
                : r >= bt - 1
                  ? P.bronzeDark
                  : P.bronze;
          // mottled like the real fish
          if (r === tp + 2 && (c === 10 || c === 14 || c === 18))
            col = P.bronzeDark;
          px(c, r, col);
        }
      }
      // tail: a rounded fan
      for (let c = 23; c <= 27; c++) {
        const k = c - 23;
        const r0 = 7 - Math.ceil(k * 0.6);
        const r1 = 8 + Math.floor(k * 0.4);
        for (let r = r0; r <= r1; r++)
          px(
            c,
            r,
            c === 27 || r === r0 ? P.bronzeLit : c % 2 ? P.bronze : P.bronzeDark
          );
      }
      // the big pectoral fin spread over the stone
      for (let k = 0; k < 4; k++) {
        // rays fanning back from the shoulder
        f.line(
          x0 + 7,
          y0 + 8,
          x0 + 10 + k * 1.6,
          y0 + 9 + k * 0.7,
          k % 2 ? P.bronze : P.bronzeLit
        );
      }
      px(7, 9, P.bronzeDark);
      // eyes bulging on top of the head, the wide mouth with its thick lips
      px(3, 2, P.bronzeLit);
      px(4, 2, P.bronzeHi);
      px(3, 3, P.bronzeDark);
      px(4, 3, P.bronzeHi);
      px(5, 2, P.bronze);
      for (let c = 0; c <= 3; c++) px(c, 8, P.bronzeDark);
      px(0, 7, P.bronzeLit);
      px(1, 7, P.bronzeLit);
      px(0, 9, P.bronze);
    }
    // the fish on its own, for when it comes alive
    const gobySprite = layer(29, 13, (g) => gobyPaint(g, 0, 0));

    // ---------- egg: the cat ----------
    // Rub the goby for luck: it gleams, and a cat springs up from the beach
    // to see. The bronze fish blinks awake, wriggles, flops round to face
    // the sea and leaps: a golden arc right out over the bay, as the cat
    // pounces on the empty stone. Splash. A moment later it leaps back,
    // raining drops, and thumps down on its stone, the cat bolting out of
    // the way; it turns to bronze again, and the cat, unimpressed, sniffs
    // it, bats it on the lips and goes back down to the beach.
    const CT_UP = 420; // the cat's up on the promenade
    const CT_WAKE = 250; // the goby comes alive
    const CT_FLOP = 700; // flopping about
    const CT_LEAP = 1300; // it leaps
    const CT_SPLASH = 2300; // into the bay
    const CT_BACK = 3200; // out again
    const CT_LAND = 4200; // back on its stone
    const CT_STILL = 4800; // bronze again
    const CT_SNIFF = 5300; // the cat's up on the stone, nose to its lips
    const CT_GO = 6550; // and back down to the beach
    const CAT = 7000;
    let catAt = -Infinity;
    const catAge = (t: number) => t - catAt;
    const catBusy = (t: number) => catAge(t) >= 0 && catAge(t) < CAT;
    const fishHome = { x: gobyX - 1, y: PROM - 14 };
    const splashX = Math.round(
      Math.max(
        embR + 24,
        Math.min(w - 30, gobyX + Math.max(70, Math.min(w * 0.36, 210)))
      )
    );
    const splashY = Math.round(shoreY(splashX) - 10);
    const arcH = Math.max(38, Math.min(68, (splashX - fishHome.x) * 0.45));
    /** The goby on its leap at u (0..1), out from its stone to the bay. */
    function fishArc(u: number) {
      const dx = splashX - fishHome.x;
      const dy = splashY - fishHome.y;
      return {
        x: fishHome.x + dx * u,
        y: fishHome.y + dy * u - 4 * arcH * u * (1 - u),
        ang: Math.atan2(dy - 4 * arcH * (1 - 2 * u), dx),
      };
    }

    /**
     * The goby come alive, centred on (cx, cy): turned by `ang`, facing the
     * sea if `right`, its body rippling by `wig`, warmed towards gold.
     */
    function liveGoby(
      f: Frame,
      cx: number,
      cy: number,
      ang: number,
      right: boolean,
      wig: number,
      a: number,
      warm: number
    ) {
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const icx = Math.round(cx);
      const icy = Math.round(cy);
      const sp = gobySprite.pixels;
      for (let dy = -16; dy <= 16; dy++)
        for (let dx = -16; dx <= 16; dx++) {
          const rx = dx * ca + dy * sa;
          const ly = -dx * sa + dy * ca;
          const sc = Math.round((right ? -rx : rx) + 14);
          if (sc < 0 || sc > 28) continue;
          const sr = Math.round(
            ly + 7 - wig * Math.sin(sc * 0.45 - a / 45) * (sc / 28 + 0.3)
          );
          if (sr < 0 || sr > 12) continue;
          const p = sp[sr * 29 + sc]!;
          if (!(p >>> 24)) continue;
          const c = ((p & 0xff) << 16) | (p & 0xff00) | ((p >>> 16) & 0xff);
          f.set(icx + dx, icy + dy, warm > 0 ? lerpRGB(c, P.sunRim, warm) : c);
        }
    }

    function goby(f: Frame, t: number) {
      const a = catAge(t);
      const on = a >= 0 && a < CAT;
      if (on && a >= CT_LEAP && a < CT_LAND) return; // off on its jaunt
      if (on && a >= CT_WAKE && a < CT_STILL) {
        // alive on its stone: glowing, wriggling, flopping round to face the
        // sea; then, back from the bay, settling down again
        const back = a >= CT_LAND;
        const k = back ? 1 - (a - CT_LAND) / (CT_STILL - CT_LAND) : 1;
        const flop = !back && a >= CT_FLOP;
        const fa = (a - CT_FLOP) / 150;
        const right = flop && (a > CT_LEAP - 220 || Math.floor(fa) % 2 === 0);
        const hop = flop ? Math.abs(Math.sin(fa * Math.PI)) * 3 : 0;
        glow(f, fishHome.x, fishHome.y, 18, P.sunRim, 0.5 * k, 0.75, 0.08);
        liveGoby(
          f,
          fishHome.x,
          fishHome.y - hop,
          flop ? Math.sin(fa * Math.PI) * 0.25 : 0,
          right,
          (flop ? 0.9 : 0.6) * k,
          a,
          0.15 * k
        );
        return;
      }
      const x0 = gobyX - 15;
      const y0 = PROM - 21; // row 0 of the fish; its belly rests on the stone
      gobyPaint(f, x0, y0);
      // rubbed for luck (or just back): a gleam runs along the bronze
      const sweep = Math.min(
        (t - shineAt) / 900,
        on && a >= CT_STILL ? (a - CT_STILL) / 900 : 9
      );
      if (sweep >= 0 && sweep < 1) {
        const sx = -4 + sweep * 38;
        for (let r = 0; r <= 11; r++)
          for (
            let c = Math.round(sx + (11 - r) * 0.5);
            c <= sx + (11 - r) * 0.5 + 1;
            c++
          ) {
            const col = f.get(x0 + c, y0 + r);
            if (col === P.bronze || col === P.bronzeLit || col === P.bronzeDark)
              f.set(x0 + c, y0 + r, P.bronzeHi);
          }
        glow(
          f,
          fishHome.x,
          fishHome.y,
          16,
          P.sunRim,
          0.35 * (1 - sweep),
          0.7,
          0.08
        );
      }
    }

    /** A burst of spray and spreading rings where something hits the water. */
    function bigSplash(
      f: Frame,
      x: number,
      y: number,
      age: number,
      seed: number
    ) {
      if (age < 0 || age > 1500) return;
      for (let i = 0; i < 40; i++) {
        const vx = (hash2(i, 1, seed) - 0.5) * 0.1;
        const vy = -(0.05 + hash2(i, 2, seed) * 0.15);
        const py = y + vy * age + 0.00018 * age * age;
        if (py > y + 1) continue;
        f.set(x + vx * age, py, hash2(i, 3, seed) > 0.6 ? P.glint : P.foam);
      }
      for (let k = 0; k < 3; k++) {
        const ra = age - k * 220;
        if (ra < 0 || ra > 1100) continue;
        const r = 2 + ra * 0.02;
        const al = 0.8 * (1 - ra / 1100);
        const n = Math.ceil(r * 6);
        for (let s = 0; s < n; s++) {
          const an = (s / n) * Math.PI * 2;
          mix(f, x + Math.cos(an) * r, y + Math.sin(an) * r * 0.3, P.foam, al);
        }
      }
    }

    /** The cat, and the goby when it's off its stone. */
    function catEgg(f: Frame, t: number) {
      const a = catAge(t);
      if (a < 0 || a >= CAT) return;
      // the goby's leap out over the bay, trailing gold, and back
      if (a >= CT_LEAP && a < CT_LAND) {
        const out = a < CT_SPLASH;
        const inAir = out || a >= CT_BACK;
        const u = out
          ? (a - CT_LEAP) / (CT_SPLASH - CT_LEAP)
          : 1 - (a - CT_BACK) / (CT_LAND - CT_BACK);
        if (inAir) {
          if (out) {
            // a comet's tail of gold behind it, twinkling as it fades
            for (let j = 1; j <= 16; j++) {
              const uj = u - j * 0.022;
              if (uj < 0) break;
              const q = fishArc(uj);
              const jx =
                (hash2(j, Math.floor(a / 90), 7) - 0.5) * (2 + j * 0.4);
              const jy =
                (hash2(j, Math.floor(a / 90), 8) - 0.5) * (2 + j * 0.3);
              const c = j < 5 ? P.goldLit : j < 10 ? P.sunRim : P.gold;
              if (j < 10 || hash2(j, Math.floor(a / 70), 9) > 0.4)
                f.set(q.x + jx, q.y + jy, c);
              if (j < 4) f.set(q.x - jx, q.y - jy, P.burst);
            }
          } else {
            // drops raining off it on the way back
            for (let j = 1; j <= 14; j++) {
              const dt = j * 45;
              const ra = a - dt;
              if (ra < CT_BACK) break;
              const q = fishArc(1 - (ra - CT_BACK) / (CT_LAND - CT_BACK));
              const dx = (hash2(j, 1, 13) - 0.5) * 10;
              f.set(
                q.x + dx,
                q.y + 3 + 0.00035 * dt * dt,
                hash2(j, 2, 13) > 0.5 ? P.glint : P.foam
              );
            }
          }
          const p = fishArc(u);
          const ang = Math.max(-0.7, Math.min(0.7, p.ang));
          glow(f, p.x, p.y, 18, P.sunRim, 0.55, 0.8, 0.08);
          liveGoby(f, p.x, p.y, ang, out, 0.6, a, 0.15);
        } else {
          // a gold glimmer under the water while it's under
          glow(f, splashX, splashY + 2, 9, P.sunRim, 0.3, 0.4, 0.08);
        }
      }
      // where it went in, luck spreads out across the bay in gold glints
      const lk = a - CT_SPLASH;
      if (lk >= 0 && lk < 1700)
        for (const ring of [1, 0.65, 0.35]) {
          const r = (6 + lk * 0.1) * ring;
          const n = Math.round(r * 2);
          for (let i = 0; i < n; i++) {
            if (hash2(i, Math.floor(lk / 90) + ring * 7, 41) > 0.6) continue;
            const an = (i / n) * Math.PI * 2;
            const gx = splashX + Math.cos(an) * r;
            const gy = splashY + Math.sin(an) * r * 0.22;
            if (gy <= HZ + 1 || !onWater(gx, gy)) continue;
            f.set(gx, gy, lk < 1000 ? P.goldLit : P.gold);
            f.set(gx + 1, gy, P.sunRim);
          }
        }
      bigSplash(f, splashX, splashY, a - CT_SPLASH, 11);
      bigSplash(f, splashX, splashY, a - CT_BACK + 60, 23);
      if (a >= CT_LAND && a < CT_LAND + 400) {
        // the thump back down on the stone: a puff of dust either side
        const p = (a - CT_LAND) / 400;
        for (const s of [-1, 1])
          for (let k = 0; k < 3; k++)
            mix(
              f,
              fishHome.x + s * (12 + p * 8 + k * 2),
              PROM - 9 - k - p * 3,
              P.stoneLit,
              0.8 * (1 - p)
            );
      }
      // the cat
      const pal = { c: P.cat, g: P.catPatch, s: P.catSh };
      const draw = (
        rows: readonly string[],
        x: number,
        feet: number,
        right = false
      ) => sprite(f, rows, x, feet - rows.length + 1, pal, right);
      const hopTo = (
        k: number,
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        hgt: number,
        right = false
      ) =>
        draw(
          k > 0.85 ? CAT_WALK[0]! : CAT_LEAP,
          x0 + (x1 - x0) * k,
          y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * hgt,
          right
        );
      const floorX = gobyX + 5; // in front of the stone
      const stoneX = gobyX - 5; // up where the fish was
      const topX = gobyX - 10; // face to face with the goby
      const ground = PROM - 3;
      const onStone = PROM - 10;
      if (a < CT_UP) {
        // up from the beach, over the edge of the wall
        hopTo(a / CT_UP, floorX + 4, h + 8, floorX, ground, 6);
      } else if (a < CT_LEAP - 140) {
        // crouched, staring up at the wriggling fish, bottom wiggling
        if (a < CT_FLOP) draw(CAT_SIT, floorX + 1, ground);
        else draw(CAT_SNIFF, floorX + (Math.floor(a / 90) % 2), ground);
      } else if (a < CT_LEAP + 320) {
        // pounce! onto the stone, just as the fish takes off
        hopTo((a - CT_LEAP + 140) / 460, floorX, ground, stoneX, onStone, 9);
      } else if (a < CT_LAND - 420) {
        // on the empty stone, watching the bay; a start at each splash
        const jolt =
          (a > CT_SPLASH && a < CT_SPLASH + 160) ||
          (a > CT_BACK && a < CT_BACK + 160)
            ? 2
            : 0;
        draw(CAT_SIT, stoneX + 1, onStone - jolt, true);
      } else if (a < CT_LAND) {
        // and bolting as it comes back down on top of it
        hopTo(
          (a - CT_LAND + 420) / 420,
          stoneX + 1,
          onStone,
          floorX + 3,
          ground,
          10,
          true
        );
      } else if (a < CT_SNIFF - 380) {
        draw(CAT_SIT, floorX + 3, ground);
      } else if (a < CT_SNIFF) {
        hopTo((a - CT_SNIFF + 380) / 380, floorX + 3, ground, topX, onStone, 8);
      } else if (a < CT_SNIFF + 700) {
        // nose to the bronze, sniff sniff
        const sniff = Math.floor((a - CT_SNIFF) / 220) % 2;
        draw(sniff ? CAT_SNIFF : CAT_WALK[0]!, topX, onStone);
      } else if (a < CT_GO) {
        // up on its hind legs to bat the goby's lips, twice
        draw(CAT_REAR, topX + 1, onStone);
        const reach = (a - CT_SNIFF - 700) % 320 < 160;
        f.set(topX + (reach ? 0 : 1), onStone - 3 - (reach ? 1 : 0), P.cat);
      } else {
        // and off, down to the beach
        hopTo(
          (a - CT_GO) / (CAT - CT_GO),
          topX + 1,
          onStone,
          topX + 6,
          h + 8,
          6,
          true
        );
      }
    }

    function shore(f: Frame, t: number) {
      // little waves rolling in and washing up the wet sand
      for (let x = embR + 18; x < w; x++) {
        const yb = shoreY(x);
        const q = t / 2600 + x * 0.004 + noise1(x / 23, 2) * 0.6;
        const p = q - Math.floor(q);
        const y = Math.round(yb - 4 + p * 5);
        const a = p < 0.8 ? 0.85 : (1 - p) * 4;
        if (hash2(x >> 1, Math.floor(q), 4) > 0.15) mix(f, x, y, P.foam, a);
        if (p > 0.55)
          mix(f, x, Math.round(yb + (p - 0.55) * 4), P.foamDim, (1 - p) * 1.2);
      }
      // the wall at the end of the embankment gets a little lapping
      for (let x = 0; x < embR + 18; x++) {
        const y = 141 + Math.round(Math.sin(x / 5 + t / 700));
        if ((x + Math.floor(t / 400)) % 7 < 5) mix(f, x, y, P.foamDim, 0.4);
      }
    }

    function bay(f: Frame, t: number) {
      // glitter on the water, longer up close, most of it under the sun
      for (let y = HZ + 1; y < 140; y += 2) {
        const depth = (y - HZ) / (140 - HZ);
        const count = Math.round(w / (46 - depth * 18));
        for (let i = 0; i < count; i++) {
          const ph = hash2(i, y, 3);
          if (Math.sin(t / 800 + ph * 20) < 0.5) continue;
          const len = 1 + Math.round(hash2(i, y, 4) * (1 + depth * 4));
          const x = Math.floor(
            hash2(i, y, 5) * w + Math.sin(t / 2100 + ph * 9) * 3
          );
          const near = Math.abs(x - sunX) < 8 + depth * 40;
          f.hline(
            x,
            x + len,
            y,
            near ? P.glint : hash2(i, y, 6) > 0.5 ? P.ripple : P.rippleDark
          );
        }
      }
      // the sun's path: a column of bright broken strokes
      for (let y = HZ + 6; y < 140; y++) {
        const depth = (y - HZ) / (140 - HZ);
        const half = 4 + depth * 22;
        for (let i = 0; i < 2 + depth * 4; i++) {
          if (Math.sin(t / 380 + hash2(i, y, 77) * 30) < 0.15) continue;
          const x = Math.round(sunX + (hash2(i, y, 78) - 0.5) * 2 * half);
          const len = 1 + Math.round(hash2(i, y, 79) * (1 + depth * 3));
          f.hline(
            x,
            x + len - 1,
            y,
            Math.abs(x - sunX) < half * 0.4 ? P.glint : P.glintWarm
          );
        }
      }
      // the lighthouse mirrored in the bay, broken up by ripples
      for (let y = lBase + 2; y < lBase + 2 + LH * 0.7; y++) {
        const sy = lBase - Math.round((y - lBase - 2) / 0.7);
        const wob = Math.round(
          Math.sin(y * 0.9 + t / 420) * (0.6 + (y - lBase) / 25)
        );
        if ((y + Math.floor(t / 300)) % 4 === 0) continue;
        for (let x = lx - 4; x <= lx + 4; x++) {
          const c = f.get(x + wob, sy);
          if (
            c === P.lhRed ||
            c === P.lhRedSh ||
            c === P.lhWhite ||
            c === P.lhWhiteSh
          )
            mix(f, x, y, c, 0.45);
        }
      }
    }

    function cruise(f: Frame, t: number) {
      // the pleasure boat taking holidaymakers out round the bay
      const PERIOD = 54_000;
      const DUR = 40_000;
      const p = ((t + 26_000) % PERIOD) / DUR;
      if (p > 1) return;
      // from off the right until it and its wake are off the left
      const x = Math.round(w + 30 - p * (w + 100));
      const y = 111;
      for (let k = 0; k < 24; k++) {
        const a = 0.7 * (1 - k / 24);
        mix(f, x + 17 + k, y + (k > 10 ? 1 : 0), P.foam, a);
        if (k % 3 === 0)
          mix(f, x + 17 + k, y - 1 + (k > 10 ? 2 : 0), P.foam, a * 0.6);
      }
      f.hline(x + 1, x + 17, y, P.whiteSh);
      f.hline(x, x + 17, y - 1, P.white);
      f.hline(x - 1, x + 17, y - 2, P.blue);
      f.hline(x, x + 16, y - 3, P.white);
      // passengers under a striped awning
      for (let px = x + 3; px < x + 15; px += 2) {
        f.set(px, y - 4, (px * 7) % 3 ? P.skin : P.hair);
        f.set(px, y - 5, P.hair);
      }
      for (const px of [x + 2, x + 15]) f.vline(px, y - 7, y - 4, P.post);
      for (let px = x + 1; px <= x + 16; px++)
        f.set(px, y - 8, Math.floor((px - x) / 2) % 2 ? P.white : P.red);
      f.set(x + 8, y - 9, P.red);
      mix(f, x + 8, y + 2, P.rippleDark, 0.4);
    }

    function strollers(f: Frame, t: number) {
      // people wandering along the water's edge
      for (let i = 0; i < 2; i++) {
        // there and back: turning at the steps, and just out of the picture
        const span = w - embR - 8;
        const sp = 0.003 + i * 0.0012;
        const raw =
          (((hash2(i, 9, 44) * span * 2 + t * sp) % (span * 2)) + span * 2) %
          (span * 2);
        const x = Math.round(embR + 10 + (raw < span ? raw : span * 2 - raw));
        const y = Math.round(shoreY(x)) + 3;
        const step = Math.floor(t / 320 + i) % 2;
        f.rect(x, y - 5, 2, 3, i ? P.suitB : P.suitA);
        f.rect(x, y - 7, 2, 2, P.skin);
        f.set(x + (i ? 0 : 1), y - 8, P.hair);
        f.set(x + (step ? 0 : 1), y - 2, P.skin);
        f.set(x + (step ? 1 : 0), y - 1, P.skin);
        mix(f, x, y, P.wetSand, 0.6);
      }
    }

    function people(f: Frame, t: number) {
      // bathers standing out in the shallows: the water is waist deep for ages
      const n = Math.max(2, Math.round((w - embR) / 70));
      for (let i = 0; i < n; i++) {
        const x = Math.round(embR + 30 + hash2(i, 1, 44) * (w - embR - 50));
        if (Math.abs(x - (embR + Math.min(80, (w - embR) * 0.32))) < 30)
          continue;
        const y = Math.round(shoreY(x) - 4 - hash2(i, 2, 44) * 8);
        const bob = Math.round(Math.sin(t / 900 + i * 2));
        f.rect(x, y - 4 + bob, 2, 4, P.skin);
        f.set(x + 1, y - 3 + bob, P.skinSh);
        f.set(x, y - 5 + bob, P.hair);
        f.set(x + 1, y - 5 + bob, P.hair);
        if (i % 2) f.set(x + 2, y - 3 + bob, P.skin);
        mix(f, x - 1, y, P.foam, 0.5);
        mix(f, x + 2, y, P.foam, 0.5);
      }
      // a couple strolling along the promenade, someone stopping by the goby
      for (let i = 0; i < 2; i++) {
        // there and back, from off the left to where the steps go down
        const span = embR + 5;
        const sp = 0.004 + i * 0.0015;
        const raw =
          (((hash2(i, 5, 44) * span * 2 + t * sp) % (span * 2)) + span * 2) %
          (span * 2);
        const x = Math.round(raw < span ? raw : span * 2 - raw) - 10;
        const y = PROM - 2;
        const step = Math.floor(t / 300 + i) % 2;
        f.rect(x, y - 6, 2, 4, i ? P.white : P.suitA);
        f.set(x, y - 7, P.skin);
        f.set(x + 1, y - 7, P.hair);
        f.set(x + (step ? 0 : 1), y - 2, P.hair);
        f.set(x + (step ? 1 : 0), y - 1, P.hair);
        if (i === 0) {
          f.rect(x + 3, y - 5, 2, 3, P.yellow);
          f.set(x + 3, y - 6, P.skin);
          f.set(x + 3, y - 2, P.hair);
          f.set(x + 4, y - 1, P.hair);
        }
      }
    }

    function gulls(f: Frame, t: number) {
      const n = Math.max(3, Math.round(w / 100));
      for (let i = 0; i < n; i++) {
        const sp = 0.004 + hash2(i, 1, 66) * 0.004;
        const span = w + 40;
        const x = ((hash2(i, 2, 66) * span + t * sp) % span) - 20;
        const y = 22 + hash2(i, 3, 66) * 40 + Math.sin(t / 1900 + i * 3) * 4;
        const flap = Math.floor(t / 140 + i * 3) % 12;
        const pose = flap < 3 ? [0, 1, 2][flap]! : 1;
        gull(f, x, y, pose, P.gull, P.gullTip);
      }
    }

    function postGull(f: Frame, t: number) {
      // one keeping watch on the last groyne post, turning its head now and then
      const gx = Math.round(embR + Math.min(80, (w - embR) * 0.32)) + 20;
      const gy = Math.round(shoreY(gx)) + 3 - 15 - 5;
      const look = Math.sin(t / 2300) > 0.4 ? -1 : 1;
      f.rect(gx - 1, gy, 3, 2, P.gull);
      f.set(gx - 1, gy + 1, P.gullSh);
      f.set(gx + look, gy - 1, P.gull);
      f.set(gx + look * 2, gy - 1, P.yellow);
      f.set(gx - look * 2, gy, P.gullTip);
    }

    function boats(f: Frame, t: number) {
      // a freighter creeping along the horizon towards the port
      const span = w + 60;
      const sx = Math.round(((w * 0.2 + t * 0.0016) % span) - 30);
      f.rect(sx, HZ - 2, 18, 2, P.ship);
      f.hline(sx + 1, sx + 17, HZ - 3, P.ship);
      f.rect(sx + 13, HZ - 6, 4, 3, P.ship);
      f.vline(sx + 5, HZ - 6, HZ - 3, P.ship);
      f.vline(sx + 9, HZ - 5, HZ - 3, P.ship);
      f.hline(sx + 13, sx + 16, HZ - 6, P.shipHi);
      // a yacht beyond the spit
      const yx = Math.round(w + 6 - ((t * 0.0025 + w * 0.3) % (w + 12)));
      const yy = HZ + 4;
      f.hline(yx - 3, yx + 3, yy, P.ship);
      for (let k = 0; k < 7; k++)
        f.hline(
          yx - Math.floor(k / 3),
          yx,
          yy - 1 - k,
          k > 4 ? P.sail : P.sailSh
        );
      f.vline(yx + 1, yy - 6, yy - 1, P.sail);
    }

    // ---------- hit tests ----------
    const onLighthouse = (x: number, y: number) =>
      Math.abs(x - lx) <= 5 && y >= lampY - 6 && y <= lBase;
    const onGoby = (x: number, y: number) =>
      x >= gobyX - 16 && x <= gobyX + 13 && y >= PROM - 22 && y <= PROM - 1;
    const riderHit = (x: number, y: number, t: number) =>
      riders.findIndex((_, i) => {
        const r = riderAt(i, t);
        return (
          (Math.abs(x - r.x) <= 6 && y >= r.y - 10 && y <= r.y + 3) ||
          (Math.abs(x - r.kx) <= 11 && Math.abs(y - r.ky - 2) <= 5)
        );
      });
    const onWater = (x: number, y: number) => {
      if (y <= HZ) return false;
      // the spit, the kiosk, the lamps, umbrellas and the like aren't water
      if (
        far.opaque(x, y) ||
        near.opaque(x, y) ||
        arcBack.opaque(x, y) ||
        arcFront.opaque(x, y) ||
        crowd.opaque(x, y) ||
        front.opaque(x, y)
      )
        return false;
      if (x < hillR && y <= 102) return false;
      if (x <= embR) return y < PROM - 2;
      return y < shoreY(x);
    };

    // the eggs, in the order the viewer checks them
    type Egg = {
      spot: EggSpot;
      busy: (t: number) => boolean;
      start: (t: number) => void;
    };
    const EGGS: Egg[] = [
      {
        // rub the goby: it comes alive, to the cat's dismay
        spot: { id: 'cat', x: gobyX - 1, y: PROM - 12, r: 10 },
        busy: catBusy,
        start: (t) => {
          catAt = t;
          shineAt = t;
        },
      },
      {
        spot: { id: 'air-hockey', ...ahSpot },
        busy: ahBusy,
        start: (t) => (ahAt = t),
      },
      {
        spot: { id: 'coins', ...cabSpot },
        busy: coinsBusy,
        start: (t) => (coinsAt = t),
      },
    ];
    const eggAt = (x: number, y: number, slack: number) =>
      EGGS.find(
        (e) => Math.hypot(x - e.spot.x, y - e.spot.y) <= e.spot.r + slack
      );

    function flockGulls(t: number, x: number, y: number) {
      const seed = Math.round(t) % 977;
      fx.add(t, 3600, (f, age) => {
        const a = age / 1000;
        for (let i = 0; i < 8; i++) {
          const ang = -Math.PI / 2 + (hash2(i, 1, seed) - 0.5) * 2.4;
          const sp = 18 + hash2(i, 2, seed) * 16;
          const gx = x + Math.cos(ang) * sp * a + (hash2(i, 3, seed) - 0.5) * 6;
          // climbing faster and faster: all of them are off the top of the
          // picture before the effect ends, so none just vanishes mid-air
          const gy = y + Math.sin(ang) * sp * a * 0.7 - 6 * a * a;
          const pose = Math.floor(age / 90 + i) % 3;
          gull(f, gx, gy, pose, P.gull, P.gullTip);
        }
      });
    }

    return {
      render(f, t) {
        lastT = t;
        f.copyFrom(sky);
        f.over(cloudLayer, Math.round(t / 2400), 0, true);
        gulls(f, t);
        f.pixels.set(sea.pixels.subarray((HZ + 1) * w), (HZ + 1) * w);
        boats(f, t);
        blit(f, far, farSpans);
        bay(f, t);
        cruise(f, t);
        lighthouseLamp(f, t);
        blit(f, town, townSpans);
        // kites up in the sky, their lines, the riders below
        for (const [i, r] of riders.entries()) {
          const s = riderAt(i, t);
          kite(f, s.kx, s.ky, r, s.tilt);
        }
        for (const [i, r] of riders.entries()) {
          const s = riderAt(i, t);
          const hand = surfer(f, s.x, s.y, s.dir, r, s.jp >= 0, t);
          // the lines, converging on the bar
          const ca = Math.cos(s.tilt);
          const sa = Math.sin(s.tilt);
          for (const side of [-1, 1])
            mixLine(
              f,
              hand.hx,
              hand.hy,
              s.kx + side * 11 * ca - 5 * sa,
              s.ky + side * 11 * sa + 5 * ca,
              P.kiteLine,
              0.28
            );
          if (s.jp >= 0) {
            // its shadow on the water while airborne
            f.hline(
              Math.round(s.x) - 2,
              Math.round(s.x) + 2,
              r.y + 1,
              P.rippleDark
            );
          }
        }
        // the bathers, and the couple at the back of the promenade, who pass
        // behind the lamps, the kiosk, the goby's stone and the people
        // sitting on the wall's edge
        people(f, t);
        blit(f, near, nearSpans);
        // the arcade, the woman and the kids going in and out of it
        const ha = ahAge(t);
        const ca = coinsAge(t);
        const rally = ha >= 0 && ha < GOAL;
        const won = ha >= GOAL && ha < AH_SHUT;
        const pushing = ca >= CN_DROP && ca < CN_JACK + 1400;
        arcadeBack(f, t);
        arcadeGroup(f, t, true);
        arcadeFront(f, t, rally || pushing ? 1 : 0, won);
        shore(f, t);
        postGull(f, t);
        strollers(f, t);
        blit(f, crowd, crowdSpans);
        goby(f, t);
        // lamps along the promenade coming on
        for (const x of lamps) {
          glow(f, x, PROM - 19, 6, P.lampLight, 0.45, 1, 0.2);
        }
        catEgg(f, t);
        blit(f, front, frontSpans);
        fx.draw(f, t);
        // the jackpot: the evening dims round the gold while it pours
        if (ca >= 0 && ca < COINS) {
          const up = (ca - CN_JACK + 300) / 300;
          const down = (CN_HOME + 1500 - ca) / 900;
          dim(f, 0.32 * Math.max(0, Math.min(1, up, down)));
        }
        coinShow(f, t);
        arcadeGroup(f, t, false);
        hockey(f, t);
      },
      poke(x, y, t) {
        // the close-up takes the clicks on it while it's open
        if (onHockey(x, y, t)) return;
        // an egg, a tap a little off it counts too, as the viewer counts it
        const egg = eggAt(x, y, 2) ?? eggAt(x, y, 6);
        if (egg) {
          if (!egg.busy(t)) egg.start(t);
          return;
        }
        const ri = riderHit(x, y, t);
        if (ri >= 0) {
          const ja = t - jumpAt[ri]!;
          if (ja >= 0 && ja < 1700) return;
          jumpAt[ri] = t;
          const r = riders[ri]!;
          // a splash where they land
          const land = riderAt(ri, t + 1650);
          splash(fx, t + 1650, land.x, r.y, P.foam, Math.round(t));
          ripple(fx, t + 1650, land.x, r.y + 1, P.foam, {
            rings: 2,
            size: 9,
            squash: 0.3,
          });
          return;
        }
        if (onLighthouse(x, y)) {
          // the lens turns its full round before it can be set going again
          if (t - beamAt >= 5200) beamAt = t;
          return;
        }
        if (onGoby(x, y)) {
          // rubbed again while the cat's about: just a gleam
          if (t - shineAt >= 900 && !catBusy(t)) shineAt = t;
          return;
        }
        if (onWater(x, y)) {
          ripple(fx, t, x, y, P.foam, { rings: 3, size: 12, squash: 0.3 });
          splash(fx, t, x, y, P.foam, Math.round(t));
          return;
        }
        if (y < HZ) flockGulls(t, x, y);
      },
      hot(x, y) {
        if (onHockey(x, y, lastT)) return false;
        return (
          !!eggAt(x, y, 2) ||
          y < HZ ||
          onWater(x, y) ||
          riderHit(x, y, lastT) >= 0 ||
          onLighthouse(x, y) ||
          onGoby(x, y)
        );
      },
      eggs(t) {
        return EGGS.filter((e) => !e.busy(t)).map((e) => e.spot);
      },
    };
  },
};
