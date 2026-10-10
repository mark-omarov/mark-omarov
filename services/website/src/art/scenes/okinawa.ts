// Okinawa on a bright day, looking along the shore from just above the
// beach: a turquoise lagoon over white sand with coral heads showing through
// the water, the reef breaking further out, a small island with a lighthouse
// on the horizon, and an old Ryukyu house with a red-tiled roof (white mortar
// lines) and a shisa on the ridge, behind a coral-stone wall spilling over
// with bougainvillea. A sea turtle cruises the shallows, and out in the
// lagoon a snorkel pokes up out of the water.
//
// Eggs: the shisa swells up and roars a gust across the bay (palms bend,
// bougainvillea petals stream over the beach); the turtle comes right up to
// the surface, big, for a breath that throws spray and a little rainbow; the
// snorkel turns the lagoon see-through: a bright reef, a swirling school of
// fish, and five snorkellers of different sizes floating face down over it
// (the smallest in a swim ring).
//
// Other clicks: the water for flying fish, a palm for a coconut, the sky for
// a diving tern, the flowers for butterflies, the trees for egrets, the sand
// for a crab.

import { type Frame, lerpRGB, type RGB } from '../frame';
import { flock, Fx, ripple, sparkle, splash } from '../fx';
import { fbm1, hash2, noise1 } from '../noise';
import { canopy, glow, gradient, palm, type TreeStyle } from '../paint';
import { layer, palette, type Scene } from '../scene';

const P = palette({
  sky0: '#1a54c6',
  sky1: '#2468d4',
  sky2: '#347fdf',
  sky3: '#4c97e8',
  sky4: '#6cb0ef',
  sky5: '#95caf4',
  haze: '#c4e4f8',
  sun: '#fffdf0',
  sunGlow: '#fff4c4',
  cloudLight: '#ffffff',
  cloudBase: '#e6f1fc',
  cloudShadow: '#b4cdee',
  cloudDeep: '#93b3e2',
  chain: '#7aa8dc',
  chainLit: '#93bbe6',
  // sea
  deep0: '#1446a2',
  deep1: '#1858b4',
  reefOut: '#1b6fc2',
  lagoon0: '#178bcc',
  lagoon1: '#16a6d2',
  lagoon2: '#24bfd2',
  shallow0: '#46d3d0',
  shallow1: '#7ae4d6',
  shallow2: '#b0f2de',
  foam: '#ffffff',
  foamShade: '#a6e6ee',
  glint: '#f4ffff',
  coral: '#1c3f80',
  coralLit: '#86e0d0',
  coralPink: '#ff8aa8',
  coralGold: '#ffd25e',
  // sand
  sand0: '#fff8e8',
  sand1: '#f8eacc',
  sand2: '#ecd8b0',
  sandShade: '#d8c8b8',
  sandDapple: '#ece0cc',
  sandWet: '#e4d4ae',
  shell: '#ffffff',
  wrack: '#c8b48a',
  // the island on the horizon (hazed with distance)
  isle0: '#2d6c66',
  isle1: '#3f866e',
  isle2: '#5ea47a',
  isleRock: '#a8b8b0',
  isleSand: '#e4f2ea',
  lighthouse: '#ffffff',
  lighthouseSh: '#b8c8d4',
  // notch rock
  rockHi: '#f2e8cc',
  rockLit: '#d8ccac',
  rock: '#b0a286',
  rockShade: '#82786c',
  rockNotch: '#544c4c',
  // greens
  fuku0: '#174a33',
  fuku1: '#22663c',
  fuku2: '#368646',
  fuku3: '#5aa954',
  frond0: '#1b5a34',
  frond1: '#2f8a42',
  frond2: '#70c454',
  trunk: '#9a7652',
  trunkLit: '#c8a474',
  trunkSh: '#66503c',
  adan0: '#2a6a3a',
  adan1: '#4a9a48',
  adan2: '#9ccc5a',
  adanFruit: '#f08a2a',
  adanFruitHi: '#ffc04a',
  adanFruitSh: '#b8521e',
  vine0: '#2e7a36',
  vine1: '#56a845',
  glory: '#d24aa8',
  gloryHi: '#f28ad2',
  gloryEye: '#fff2f8',
  // flowers
  bouga0: '#b01a6c',
  bouga1: '#e23a94',
  bouga2: '#ff7cc0',
  hibiscus: '#e8203a',
  hibiscusHi: '#ff5a5a',
  stamen: '#ffd23f',
  leaf0: '#1f5e30',
  leaf1: '#348c3e',
  // house
  roof: '#d4452e',
  roofHi: '#ee6a45',
  roofSh: '#b23826',
  roofDeep: '#6e1f1a',
  mortar: '#fffaf0',
  mortarDim: '#f6dccc',
  mortarSh: '#c8a49a',
  wood: '#7a5236',
  woodHi: '#a07448',
  woodDark: '#4a2e22',
  eaveShadow: '#2e1e1c',
  shoji: '#f6eed8',
  shojiLine: '#c8b28a',
  tatami: '#c4bc6a',
  interior: '#2a1c1a',
  // coral-stone wall
  wallHi: '#f0e8d0',
  wallLit: '#ddd2b4',
  wall: '#c2b596',
  wallSh: '#9a8f7a',
  wallDeep: '#6c6658',
  // shisa
  shisa: '#d4683c',
  shisaHi: '#f6a068',
  shisaSh: '#9a4024',
  mane: '#8e321a',
  shisaDark: '#2e100a',
  teeth: '#fffaf0',
  roar: '#fff6c0',
  // people and things
  skin: '#f0b88e',
  skin2: '#c98a5c',
  hair: '#2a1a14',
  suitRed: '#ff4a5a',
  suitBlue: '#2a5ad8',
  suitYellow: '#ffd23f',
  towel: '#36b8e0',
  towel2: '#ff8a3a',
  towelHi: '#ffffff',
  parasolA: '#ff4a4a',
  parasolASh: '#c42a3a',
  parasolA2: '#ffd23f',
  parasolA2Sh: '#e09a1e',
  parasolB: '#2a7ae0',
  parasolBSh: '#1c56b0',
  parasolB2: '#ffffff',
  parasolB2Sh: '#a8c4e8',
  pole: '#ffffff',
  bucket: '#ff6a2a',
  snorkel: '#ffd23f',
  mask: '#9ae8ff',
  kayak: '#ffc83a',
  kayakHi: '#ffe48a',
  kayakSh: '#d8901a',
  paddle: '#2a5ad8',
  // boats
  hull: '#5a3a26',
  hullHi: '#8a5a3a',
  sail: '#fff6e0',
  sailSh: '#e2d2b0',
  ferry: '#ffffff',
  ferrySh: '#c4d0e0',
  ferryBand: '#2a5ad8',
  // creatures
  tShell: '#2a5a4a',
  tPlate: '#4e7e5a',
  tPlateHi: '#78a46a',
  tSkin: '#8cc4a6',
  sShell: '#5a4420',
  sPlate: '#8e7036',
  sPlateHi: '#b8944a',
  sSkin: '#b8b07e',
  fishA: '#ffe14a',
  fishB: '#46d8ff',
  silver: '#e8f6ff',
  silverSh: '#7aa8d0',
  tern: '#ffffff',
  ternSh: '#b8c4d4',
  ternCap: '#2a2a34',
  egret: '#ffffff',
  wing: '#ffffff',
  wingSpot: '#2a2a3a',
  crab: '#f0b0a0',
  crabSh: '#c07060',
  crabLeg: '#d04a3a',
  coconut: '#6e5a26',
  coconutHi: '#9a8236',
  coconutSh: '#3e3218',
  rainbowR: '#ff5a5a',
  rainbowY: '#ffe14a',
  rainbowB: '#5ab4ff',
  // the lagoon seen right through: clear water over pale sand
  clearFar: '#40c8f2',
  clearMid: '#7ce4f0',
  clearNear: '#c0faee',
  floor: '#e4fae6',
  floorSh: '#58c4dc',
  // the reef, lit up
  cPink: '#ff5aa0',
  cPinkHi: '#ffb0d6',
  cPinkSh: '#c42e70',
  cPurple: '#a05ae8',
  cPurpleHi: '#dcb0ff',
  cPurpleSh: '#6630b4',
  cYellow: '#ffc83a',
  cYellowHi: '#fff29a',
  cYellowSh: '#d0861a',
  cOrange: '#ff7a36',
  cOrangeHi: '#ffc08a',
  cOrangeSh: '#c4461c',
  cLime: '#9ae44a',
  cLimeHi: '#e0ffa0',
  cLimeSh: '#4a9a2a',
  cRed: '#ff4a62',
  cRedHi: '#ffa0ac',
  cRedSh: '#b42840',
  cBlue: '#3a62ff',
  cBlueHi: '#a4bcff',
  clown: '#ff7a1a',
  // tropical fish
  yFish: '#ffe63a',
  yFishHi: '#fffab4',
  yFishTail: '#f09a1a',
  bFish: '#2a5cff',
  bFishHi: '#86acff',
  bubble: '#f4ffff',
  // the snorkellers: a man (short light-brown hair, a dark rash guard), a
  // woman (long near-black hair), a girl (long brown hair), a woman with a
  // bun, and a boy
  manHair: '#8a6a48',
  manHairLit: '#b08a60',
  manRash: '#23273a',
  manRashLit: '#4e587c',
  manRashSh: '#121420',
  manShorts: '#3a64b0',
  manFin: '#2a7ae0',
  manFinSh: '#1a4aa0',
  womanHair: '#16121a',
  womanHairLit: '#3e3036',
  womanSuit: '#ff5a7a',
  womanSuitLit: '#ffa4b8',
  womanSuitSh: '#c43a5c',
  womanFin: '#ff7ac8',
  womanFinSh: '#c84a98',
  girlHair: '#6a4630',
  girlHairLit: '#9a6a44',
  girlSuit: '#e8303a',
  girlSuitLit: '#ff7a6a',
  girlSuitSh: '#a01e2a',
  swimRing: '#ffd23f',
  swimRingLit: '#fffbe0',
  swimRingSh: '#e8901e',
  woman2Hair: '#8a3a1e',
  woman2HairLit: '#d0703a',
  woman2Suit: '#8a4ad8',
  woman2SuitLit: '#c09aff',
  woman2SuitSh: '#5a2a9a',
  woman2Fin: '#b46aff',
  woman2FinSh: '#7a3ac8',
  boyHair: '#3a2418',
  boyHairLit: '#6a4430',
  boySuit: '#52c832',
  boySuitLit: '#a8f07a',
  boySuitSh: '#2e8a22',
  boyShorts: '#ff8a2a',
  boyFin: '#ff6a1a',
  boyFinSh: '#c4480e',
  snorkelTop: '#ff5a2a',
  maskStrap: '#1a1a24',
});

const HORIZON = 56;
const REEF = 64;
const SHORE = 113; // average waterline on the beach
const HOUSE_B = 118; // the house's floor line
const RIDGE = HOUSE_B - 30;
const WALL_TOP = 115;
const WALL_B = 126;

const TROPIC: TreeStyle = {
  dark: P.frond0,
  mid: P.frond1,
  light: P.frond2,
  trunk: P.trunk,
};
const BARK = { dark: P.trunkSh, mid: P.trunk, light: P.trunkLit };

// a sitting shisa, facing us: curly mane, white mortar brows, big eyes
const SHISA = [
  '..m.mm.mm.m..',
  '.mmmmmmmmmmm.',
  'mmHHhhhhhhhmm',
  'mhWWWhhhWWWhm',
  'mhwEhhhhhEwhm',
  'mmhhHNHNHhhmm',
  'mhtttttttttmm',
  '.mmhkkkkkhmm.',
  '..sHhhhhhsscc',
  '..sHhhhhhs..c',
  '..sH.hhh.s...',
  '.sHH.h.h.ss..',
  'SSSSSSSSSSSSS',
];
const SHISA_ROAR = ['mhtkkkkkkkthm', '.mhkkkkkkkhm.', '..stttttsscc.'];

type Put = (x: number, y: number, c: RGB) => void;

/** Smoothstep on 0..1, clamped. */
const smooth = (v: number) => {
  const c = Math.max(0, Math.min(1, v));
  return c * c * (3 - 2 * c);
};

/** Someone snorkelling, side-on and face down, as built from these parts. */
type Snorkeller = {
  head: number; // head width: adults 3, kids 2
  tall: number; // body thickness in rows: adults 3, kids 2
  torso: number;
  legs: number;
  fins: number;
  hair: RGB;
  hairLit: RGB;
  suit: RGB;
  suitLit: RGB;
  suitSh: RGB;
  shorts?: RGB;
  fin: RGB;
  finSh: RGB;
  tail?: number; // long hair floating back over the shoulders
  bun?: boolean;
  ring?: boolean; // a swim ring round her middle
};

const MAN_S: Snorkeller = {
  head: 3,
  tall: 3,
  torso: 6,
  legs: 4,
  fins: 4,
  hair: P.manHair,
  hairLit: P.manHairLit,
  suit: P.manRash,
  suitLit: P.manRashLit,
  suitSh: P.manRashSh,
  shorts: P.manShorts,
  fin: P.manFin,
  finSh: P.manFinSh,
};
const WOMAN_S: Snorkeller = {
  head: 3,
  tall: 3,
  torso: 5,
  legs: 3,
  fins: 4,
  hair: P.womanHair,
  hairLit: P.womanHairLit,
  suit: P.womanSuit,
  suitLit: P.womanSuitLit,
  suitSh: P.womanSuitSh,
  fin: P.womanFin,
  finSh: P.womanFinSh,
  tail: 4,
};
const WOMAN2_S: Snorkeller = {
  head: 3,
  tall: 3,
  torso: 5,
  legs: 4,
  fins: 4,
  hair: P.woman2Hair,
  hairLit: P.woman2HairLit,
  suit: P.woman2Suit,
  suitLit: P.woman2SuitLit,
  suitSh: P.woman2SuitSh,
  fin: P.woman2Fin,
  finSh: P.woman2FinSh,
  bun: true,
};
const BOY_S: Snorkeller = {
  head: 2,
  tall: 2,
  torso: 5,
  legs: 3,
  fins: 3,
  hair: P.boyHair,
  hairLit: P.boyHairLit,
  suit: P.boySuit,
  suitLit: P.boySuitLit,
  suitSh: P.boySuitSh,
  shorts: P.boyShorts,
  fin: P.boyFin,
  finSh: P.boyFinSh,
};
const GIRL_S: Snorkeller = {
  head: 2,
  tall: 2,
  torso: 4,
  legs: 2,
  fins: 2,
  hair: P.girlHair,
  hairLit: P.girlHairLit,
  tail: 3,
  suit: P.girlSuit,
  suitLit: P.girlSuitLit,
  suitSh: P.girlSuitSh,
  fin: P.womanFin,
  finSh: P.womanFinSh,
  ring: true,
};

/**
 * Draws a snorkeller with the top of the head's front at (x, y), facing
 * `dir`, the body trailing behind; `kick` flips the fins.
 */
function snorkeller(
  put: Put,
  x: number,
  y: number,
  dir: number,
  s: Snorkeller,
  kick: number
) {
  const X = (j: number) => x - dir * j;
  const { head, tall, torso, legs, fins } = s;
  const feet = head + torso + legs;
  const low = tall === 3 ? y + 1 : y; // the lower leg's row
  // fins first, so the feet sit over them: a flutter kick, one up, one down
  for (let k = 0; k < fins; k++) {
    const lift = Math.ceil(k / 2);
    const c = k === fins - 1 ? s.finSh : s.fin;
    put(X(feet + k), y - (kick ? lift : 0), c);
    put(X(feet + k), low + (kick ? 0 : lift), c);
  }
  for (let j = head + torso; j < feet; j++) {
    put(X(j), y, P.skin);
    if (tall === 3) put(X(j), y + 1, P.skin2);
  }
  for (let j = head; j < head + torso; j++) {
    const sh = s.shorts !== undefined && j >= head + torso - 2;
    put(X(j), y, sh ? s.shorts! : s.suitLit);
    put(X(j), y + 1, sh ? s.shorts! : s.suit);
    if (tall === 3) put(X(j), y + 2, sh ? s.shorts! : s.suitSh);
  }
  if (s.tail) {
    for (let k = 0; k < s.tail; k++) {
      put(X(head + k), y, k % 2 ? s.hairLit : s.hair);
      if (k < s.tail - 2) put(X(head + k), y + 1, s.hair);
    }
  }
  // the head: hair on top, the mask's glass at the front, face down
  for (let j = 0; j < head; j++) put(X(j), y, j === 1 ? s.hairLit : s.hair);
  if (tall === 3) {
    put(X(0), y + 1, P.mask);
    put(X(1), y + 1, P.maskStrap);
    put(X(2), y + 1, s.hair);
    put(X(0), y + 2, P.mask);
    put(X(1), y + 2, P.skin);
    put(X(2), y + 2, P.skin2);
  } else {
    put(X(0), y + 1, P.mask);
    put(X(1), y + 1, P.skin);
  }
  if (s.bun) {
    put(X(2), y - 1, s.hair);
    put(X(3), y - 1, s.hairLit);
  }
  if (s.ring) {
    // a swim ring round her middle: lit along the top, its far side behind her
    const r0 = head;
    const r1 = head + torso - 1;
    for (let j = r0; j <= r1; j++) {
      put(X(j), y - 1, j === r0 || j === r1 ? P.swimRing : P.swimRingLit);
      put(X(j), y + tall, P.swimRingSh);
    }
    for (let r = 0; r < tall; r++) {
      put(X(r0 - 1), y + r, P.swimRing);
      put(X(r1 + 1), y + r, P.swimRingSh);
    }
    put(X(r0 - 1), y - 1, P.swimRingLit);
  }
  // the snorkel, up the side of the head
  const up = tall === 3 ? 4 : 3;
  for (let k = 1; k <= up; k++) put(X(1), y - k, P.snorkel);
  put(X(1), y - up - 1, P.snorkelTop);
}

/** Opaque runs of a layer as (y, x0, x1) triples, so compositing it is a few memcpys. */
function runsOf(src: Frame) {
  const out: number[] = [];
  const { w, h, pixels } = src;
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      while (x < w && !(pixels[y * w + x]! >>> 24)) x++;
      if (x >= w) break;
      const x0 = x;
      while (x < w && pixels[y * w + x]! >>> 24) x++;
      out.push(y, x0, x);
    }
  }
  return Int32Array.from(out);
}

/** Copies a layer's opaque runs onto the frame, optionally shifted right by `dx` with wrap-around. */
function blit(f: Frame, src: Frame, runs: Int32Array, dx = 0) {
  const w = f.w;
  const o = ((Math.round(dx) % w) + w) % w;
  for (let i = 0; i < runs.length; i += 3) {
    const row = runs[i]! * w;
    const x0 = runs[i + 1]!;
    const x1 = runs[i + 2]!;
    const a = x0 + o;
    const b = x1 + o;
    if (b <= w) f.pixels.set(src.pixels.subarray(row + x0, row + x1), row + a);
    else if (a >= w)
      f.pixels.set(src.pixels.subarray(row + x0, row + x1), row + a - w);
    else {
      f.pixels.set(src.pixels.subarray(row + x0, row + w - o), row + a);
      f.pixels.set(src.pixels.subarray(row + w - o, row + x1), row);
    }
  }
}

// the turtle's front flipper through one stroke (facing right, upper side)
const STROKE: [number, number][][] = [
  [
    [2, -3],
    [3, -4],
    [4, -5],
    [5, -5],
  ],
  [
    [1, -3],
    [1, -4],
    [1, -5],
    [0, -6],
  ],
  [
    [0, -3],
    [-1, -4],
    [-2, -5],
    [-3, -5],
  ],
  [
    [1, -3],
    [1, -4],
    [1, -5],
    [0, -6],
  ],
];

type Patch = { x: number; y: number; rx: number; ry: number; seed: number };
type Hit = { x0: number; y0: number; x1: number; y1: number };

/** A cumulus: a few round puffs on a flat base, lit from the upper left. Wraps at the frame edge. */
function cumulus(
  f: Frame,
  x: number,
  base: number,
  size: number,
  seed: number
) {
  const n = 3 + Math.floor(hash2(seed, 0, 1) * 3);
  const puffs: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1) - 0.5;
    const r =
      size * (0.5 + (1 - Math.abs(u) * 1.7) * 0.42 + hash2(seed, i, 2) * 0.22);
    const px = x + u * size * 2.5 + (hash2(seed, i, 3) - 0.5) * size * 0.4;
    const py =
      base - r * 0.5 - Math.max(0, 1 - Math.abs(u) * 2.2) * size * 0.45;
    puffs.push([px, py, r]);
  }
  const owner = (xx: number, yy: number) => {
    if (yy > base) return -1;
    // the lowest puff whose disc covers this pixel sits in front
    let best = -1;
    let bestY = -Infinity;
    for (let i = 0; i < puffs.length; i++) {
      const [px, py, r] = puffs[i]!;
      if ((xx - px) ** 2 + (yy - py) ** 2 <= r * r + r * 0.5 && py > bestY) {
        best = i;
        bestY = py;
      }
    }
    return best;
  };
  const x0 = Math.floor(x - size * 2.6);
  const x1 = Math.ceil(x + size * 2.6);
  for (let yy = Math.floor(base - size * 2.4); yy <= base; yy++) {
    for (let xx = x0; xx <= x1; xx++) {
      const o = owner(xx, yy);
      if (o < 0) continue;
      let c = P.cloudBase;
      const above = owner(xx - 1, yy - 1);
      if (above < 0 || owner(xx, yy - 2) < 0) c = P.cloudLight;
      else if (above !== o && puffs[above]![1] < puffs[o]![1])
        c = P.cloudLight; // rim of a front puff
      else if (yy >= base - 1) c = P.cloudDeep;
      else if (owner(xx + 2, yy + 1) < 0 || yy >= base - 3) c = P.cloudShadow;
      f.set(((xx % f.w) + f.w) % f.w, yy, c);
    }
  }
}

export const okinawa: Scene = {
  id: 'okinawa',
  name: 'Okinawa',
  country: 'Japan',
  create(w, h) {
    const cx = Math.round(w / 2);
    const hx = Math.round(cx + Math.min(118, w * 0.27)); // the house
    const vegL = hx - 46; // where the trees behind the house start
    const at = (frac: number) => Math.round(frac * vegL); // spots along the open beach
    const sunX = Math.round(cx - Math.min(118, w * 0.3));
    const SUN_Y = 15;
    const isleX = Math.round(cx - Math.min(62, w * 0.17));
    const rockX = at(0.74);
    const ROCK_B = 84;
    const parasols = [
      {
        x: at(0.68),
        a: P.parasolA,
        aSh: P.parasolASh,
        b: P.parasolA2,
        bSh: P.parasolA2Sh,
        towel: P.towel,
      },
      ...(w >= 300
        ? [
            {
              x: at(0.38),
              a: P.parasolB,
              aSh: P.parasolBSh,
              b: P.parasolB2,
              bSh: P.parasolB2Sh,
              towel: P.towel2,
            },
          ]
        : []),
    ];
    const adanX = Math.round(Math.min(66, w * 0.16));
    const fx = new Fx();
    const fxBack = new Fx(); // behind the trees, the house and the wall

    const shoreY: number[] = [];
    for (let x = -2; x < w + 2; x++)
      shoreY[x + 2] = SHORE + Math.round((fbm1(x / 30, 6) - 0.5) * 6);
    const shore = (x: number) =>
      shoreY[Math.max(0, Math.min(w + 3, Math.round(x) + 2))]!;
    // left edge of the wooded ground behind the house, sloping up to the right
    const vegEdge = (y: number) => vegL + Math.max(0, SHORE + 4 - y) * 0.75;
    const vegTop = (x: number) =>
      63 +
      Math.round(fbm1(x / 6, 21) * 9) -
      Math.round(Math.max(0, x - vegL - 40) / 40);
    const inVeg = (x: number, y: number) => x >= vegEdge(y) && y >= vegTop(x);
    const inWater = (x: number, y: number) =>
      y > HORIZON && y < shore(x) && !inVeg(x, y);

    // palms: two leaning out over the beach on the left, a couple behind the house
    const fgPalms = [
      { x: 8, base: h + 2, h: 98, lean: 0.42, seed: 1 },
      { x: 30, base: h + 2, h: 70, lean: 0.8, seed: 2 },
    ];
    const bgPalms = [
      { x: hx - 24, base: 106, h: 64, lean: -0.45, seed: 3 },
      { x: hx + 36, base: 104, h: 74, lean: 0.3, seed: 4 },
      ...(w >= 520
        ? [{ x: hx + 124, base: 106, h: 66, lean: -0.2, seed: 6 }]
        : []),
    ];
    const crown = (p: {
      x: number;
      base: number;
      h: number;
      lean: number;
    }) => ({
      x: Math.round(p.x + p.lean * p.h * 0.55),
      y: p.base - p.h,
    });

    // ---------- sky ----------
    const sky = layer(w, h, (f) => {
      gradient(f, 0, HORIZON, [P.sky0, P.sky1, P.sky2, P.sky3, P.sky4, P.sky5]);
      f.hline(0, w, HORIZON - 1, P.haze);
      f.hline(0, w, HORIZON - 2, P.haze);
      glow(f, sunX, SUN_Y, 26, P.sunGlow, 0.5, 1, 0.1);
      f.disc(sunX, SUN_Y, 4, P.sun);
    });
    const cloudLayer = layer(w, h, (f) => {
      // high summer cumulus stacked along the horizon, a few smaller ones above
      const n = Math.max(3, Math.round(w / 70));
      for (let i = 0; i < n; i++) {
        const x = ((i + hash2(i, 1, 61) * 0.6) / n) * w;
        cumulus(f, x, HORIZON + 1, 7 + hash2(i, 2, 61) * 5, i * 7 + 1);
      }
      const m = Math.max(2, Math.round(w / 120));
      for (let i = 0; i < m; i++) {
        const x = ((i + 0.5 + (hash2(i, 3, 61) - 0.5) * 0.5) / m) * w;
        cumulus(
          f,
          x,
          24 + Math.round(hash2(i, 4, 61) * 12),
          3 + hash2(i, 5, 61) * 2.5,
          i * 11 + 50
        );
      }
    });

    // ---------- sea: lagoon colours, coral heads, the island, the notch rock ----------
    const patches: Patch[] = [];
    for (let i = 0; i < Math.round(w / 24); i++) {
      const v = Math.pow(hash2(i, 1, 33), 0.8);
      const y = Math.round(REEF + 8 + v * (SHORE - REEF - 22));
      const x = Math.round(hash2(i, 2, 33) * w);
      if (x > vegEdge(y) - 4 || Math.abs(x - rockX) < 12) continue;
      const near = (y - REEF) / (SHORE - REEF);
      const rx = (3 + near * 11) * (0.6 + hash2(i, 3, 33) * 0.7);
      patches.push({
        x,
        y,
        rx,
        ry: Math.max(1.4, rx * (0.22 + near * 0.12)),
        seed: i,
      });
    }
    const school = patches.reduce<Patch | null>(
      (best, q) =>
        q.y > 86 && q.y < 104 && (!best || q.rx > best.rx) ? q : best,
      null
    );
    const sea = layer(w, h, (f) => {
      gradient(f, HORIZON, REEF, [P.deep0, P.deep1]);
      gradient(f, REEF, REEF + 8, [P.reefOut, P.lagoon0]);
      gradient(f, REEF + 8, SHORE + 4, [
        P.lagoon0,
        P.lagoon1,
        P.lagoon2,
        P.shallow0,
        P.shallow1,
        P.shallow2,
      ]);
      f.rect(0, SHORE + 4, w, h - SHORE - 4, P.shallow2);
      // coral heads seen through the water: darker, with lit tops
      for (const p of patches) {
        const near = (p.y - REEF) / (SHORE - REEF);
        for (let dy = -Math.ceil(p.ry) - 1; dy <= Math.ceil(p.ry) + 1; dy++) {
          for (let dx = -Math.ceil(p.rx) - 2; dx <= Math.ceil(p.rx) + 2; dx++) {
            const u = dx / p.rx;
            const v = dy / p.ry;
            const ang = Math.atan2(v, u);
            const lim = 0.72 + 0.4 * noise1(ang * 1.6 + 10, p.seed);
            const r = Math.hypot(u, v);
            if (r > lim) continue;
            const x = p.x + dx;
            const y = p.y + dy;
            const c0 = f.get(x, y);
            let c = lerpRGB(c0, P.coral, 0.34 + near * 0.1);
            if (r < lim * 0.55) c = lerpRGB(c0, P.coral, 0.5 + near * 0.12);
            if (v < -0.2 && r > lim * 0.6 && u < 0.5)
              c = lerpRGB(c0, P.coralLit, 0.45);
            f.set(x, y, c);
          }
        }
        // a few bright coral heads on the nearer patches
        if (near > 0.45) {
          for (let k = 0; k < 2; k++) {
            const x = Math.round(p.x + (hash2(p.seed, k, 5) - 0.5) * p.rx);
            const y = Math.round(
              p.y + (hash2(p.seed, k, 6) - 0.5) * p.ry * 0.8
            );
            const c = k ? P.coralGold : P.coralPink;
            f.set(x, y, lerpRGB(f.get(x, y), c, 0.7));
            f.set(x + 1, y, lerpRGB(f.get(x + 1, y), c, 0.45));
          }
        }
      }
      // a faint chain of islands on the left of the horizon
      for (let x = 0; x < isleX - 30; x++) {
        const n = fbm1(x / 16, 41);
        const top = Math.round(HORIZON - 1 - Math.max(0, n - 0.38) * 14);
        for (let y = top; y < HORIZON; y++)
          f.set(x, y, y === top ? P.chainLit : P.chain);
      }
      // the small island: a wooded hump on a rocky foot, white sand at one end
      const iw = 26;
      const top = (x: number) => {
        const u = (x - isleX) / iw;
        return (
          HORIZON -
          1 -
          Math.max(
            0,
            (1 - u * u) * 7 +
              (fbm1(x / 5, 2) - 0.5) * 2.5 +
              (u < -0.2 ? 1.5 : 0)
          )
        );
      };
      canopy(
        f,
        (x, y) =>
          y >= top(x) && y < HORIZON - 1 && Math.abs(x - isleX) < iw - 2,
        { dark: P.isle0, mid: P.isle1, light: P.isle2 },
        {
          seed: 3,
          x0: isleX - iw,
          x1: isleX + iw,
          y0: HORIZON - 12,
          y1: HORIZON,
          size: 2,
          step: 2,
        }
      );
      for (let x = isleX - iw + 2; x <= isleX + iw - 2; x++) {
        f.set(x, HORIZON - 1, x > isleX + 12 ? P.isleSand : P.isleRock);
        f.set(x, HORIZON, lerpRGB(P.deep0, P.isleRock, 0.3));
      }
      // lighthouse on the high end
      const lx = isleX - 9;
      const ly = Math.round(top(lx)) - 1;
      f.rect(lx, ly - 6, 2, 7, P.lighthouse);
      f.vline(lx + 1, ly - 6, ly, P.lighthouseSh);
      f.rect(lx - 1, ly - 8, 4, 2, P.lighthouseSh);
      f.set(lx, ly - 9, P.lighthouse);
      // notch rock: a mushroom of old reef limestone, eaten away at the waterline
      const rows = [4, 6, 7, 8, 8, 8, 7, 6, 4, 4, 4, 4, 5];
      rows.forEach((half, r) => {
        const y = ROCK_B - rows.length + 1 + r;
        const lo = rockX - half + (r >= 8 ? 1 : 0);
        const hi = rockX + half;
        for (let x = lo; x <= hi; x++) {
          const s = (x - lo) / Math.max(1, hi - lo);
          let c: RGB;
          if (r < 7) {
            c = s < 0.3 ? P.rockLit : s < 0.72 ? P.rock : P.rockShade;
            if (r < 2 && s < 0.65) c = P.rockHi;
            if (r === 0 || (r === 1 && s < 0.2)) c = P.rockHi;
            // pitted karst: a few deliberate holes
            if (
              r > 1 &&
              r < 6 &&
              s > 0.15 &&
              s < 0.85 &&
              hash2(x >> 1, r >> 1, 19) > 0.8
            )
              c = s < 0.5 ? P.rock : P.rockShade;
          } else if (r === 7)
            c = s < 0.15 ? P.rockShade : P.rockNotch; // the overhang's underside
          else c = s < 0.35 ? P.rockShade : P.rockNotch; // the notch, in its own shadow
          f.set(x, y, c);
        }
      });
      // scrub on top
      for (let k = -4; k <= 4; k++) {
        const hh = 1 + Math.round(hash2(k, 0, 23) * 2);
        f.vline(
          rockX + k,
          ROCK_B - 12 - hh,
          ROCK_B - 13,
          k < 0 ? P.fuku2 : P.fuku1
        );
      }
      f.set(rockX - 2, ROCK_B - 16, P.fuku3);
      f.set(rockX - 3, ROCK_B - 15, P.fuku3);
      // its reflection, dark and broken
      for (let y = ROCK_B + 1; y < ROCK_B + 5; y++)
        for (let x = rockX - 4; x <= rockX + 5; x++)
          if ((y + (x >> 1)) % 2 === 0)
            f.set(
              x,
              y,
              lerpRGB(f.get(x, y), P.rockNotch, 0.4 - (y - ROCK_B) * 0.06)
            );
    });

    // ---------- the beach ----------
    const sand = layer(w, h, (f) => {
      for (let x = 0; x < w; x++) {
        const edge = shore(x);
        for (let y = edge; y < h; y++) {
          const d = y - edge;
          f.set(x, y, d < 2 ? P.sandWet : d < 6 ? P.sand1 : P.sand0);
        }
        // the wrack line: a ragged row of dried weed and shells along the last high tide
        const wy = edge + 10 + Math.round(noise1(x / 9, 4) * 2);
        if (noise1(x / 5, 6) > 0.45) f.set(x, wy, P.sand2);
        if (hash2(x, 0, 8) > 0.94) f.set(x, wy - 1, P.wrack);
        if (hash2(x, 1, 8) > 0.975)
          f.set(x, wy + 4 + Math.floor(hash2(x, 2, 8) * 14), P.shell);
      }
      // shadows of the palm crowns thrown across the sand by the high sun
      for (const p of fgPalms) {
        const c = crown(p);
        const tmp = layer(w, h, (g) =>
          palm(g, p.x, p.base, p.h, p.lean, TROPIC, 0, p.seed, BARK)
        );
        const sx0 = 20 + Math.round((p.base - c.y) * 0.12);
        const sy0 = 139 - Math.round((p.base - c.y) * 0.03);
        for (let y = Math.max(0, c.y - 30); y < Math.min(h, c.y + 30); y++)
          for (let x = 0; x < w; x++) {
            if (!tmp.opaque(x, y)) continue;
            const X = x + sx0;
            const Y = Math.round(sy0 + (y - c.y) * 0.32);
            if (Y > shore(X) + 12 && Y < h) f.set(X, Y, P.sandDapple);
          }
        // and the trunk's
        f.line(p.x + 2, h, c.x + sx0, sy0 + 2, P.sandDapple);
        f.line(p.x + 3, h, c.x + sx0 + 1, sy0 + 2, P.sandDapple);
      }
      // the wall's cast shadow (sun from the upper left)
      for (let x = hx - 36; x < w; x++) {
        f.set(x, WALL_B, P.sandShade);
        if (x < hx - 6 || x > hx + 6) f.set(x, WALL_B + 1, P.sandShade);
      }
    });

    // beach life drawn after the waves: parasols, towels, a kayak, creeping morning glory
    const props = layer(w, h, (f) => {
      for (const p of parasols) {
        parasol(f, p.x, 141, p.a, p.aSh, p.b, p.bSh);
        // someone sunbathing on a towel in its shade
        const tx = p.x - 13;
        f.rect(tx, 140, 11, 3, p.towel);
        f.hline(tx, tx + 10, 142, lerpRGB(p.towel, P.hair, 0.3));
        f.vline(tx, 140, 142, P.towelHi);
        f.rect(tx + 2, 140, 7, 2, P.skin);
        f.rect(tx + 4, 140, 3, 2, p.towel === P.towel ? P.suitRed : P.suitBlue);
        f.rect(tx + 8, 139, 2, 2, P.hair);
        f.set(tx + 9, 140, P.skin);
        f.set(tx + 1, 140, P.skin2);
      }
      // footprints from the first parasol down to the water
      const p0 = parasols[0]!;
      for (let k = 0; k < 9; k++) {
        const x = p0.x + 7 + Math.round(k * 1.6);
        const y = 137 - k * 2;
        if (y > shore(x) + 2) f.set(x + (k % 2), y, P.sand2);
      }
      // a sit-on-top kayak pulled up the sand
      const kx = at(0.9);
      if (kx + 12 < hx - 40) {
        const ky = 130;
        for (let dx = -8; dx <= 8; dx++) {
          const half = Math.abs(dx) > 6 ? 0 : 1;
          for (let dy = -half; dy <= half; dy++)
            f.set(
              kx + dx,
              ky + dy,
              dy < 0 ? P.kayakHi : dy > 0 ? P.kayakSh : P.kayak
            );
        }
        f.hline(kx - 2, kx + 1, ky, P.kayakSh);
        f.hline(kx - 6, kx + 8, ky + 2, P.sandShade);
        f.line(kx - 6, ky - 2, kx + 7, ky + 1, P.hair);
        f.set(kx - 7, ky - 2, P.paddle);
        f.set(kx - 6, ky - 3, P.paddle);
        f.set(kx + 8, ky + 1, P.paddle);
        f.set(kx + 8, ky + 2, P.paddle);
      }
      // beach morning glory creeping over the sand
      for (
        let x = hx - 26, k = 0;
        x < w + 8;
        x += 22 + Math.round(hash2(k, 0, 70) * 14), k++
      )
        glory(f, x, 134 + Math.round(hash2(k, 1, 70) * 10), 5, 71 + k);
      glory(f, adanX - 16, 145, 6, 90);
      glory(f, adanX + 16, 147, 4, 91);
      if (w >= 300) glory(f, at(0.55), 146, 5, 92);
    });

    function parasol(
      f: Frame,
      x: number,
      y: number,
      a: RGB,
      aSh: RGB,
      b: RGB,
      bSh: RGB
    ) {
      // shadow falls down and to the right
      for (let dy = 0; dy < 4; dy++)
        f.hline(x - 5 + dy * 2, x + 11 - dy, y + dy - 1, P.sandShade);
      f.vline(x, y - 14, y, P.pole);
      const top = y - 19;
      // a dome of gores that fan out from the tip
      for (let dy = 0; dy < 6; dy++) {
        const half = [2, 5, 7, 8, 9, 9][dy]!;
        for (let dx = -half; dx <= half; dx++) {
          const seg = Math.floor(((dx / half) * 2.5 + 2.5) % 2);
          const shade = dx / half > 0.45 || dy === 5;
          const c = seg ? (shade ? aSh : a) : shade ? bSh : b;
          f.set(x + dx, top + dy, c);
        }
      }
      // scalloped hem
      for (let dx = -9; dx <= 9; dx += 2) f.set(x + dx, top + 6, aSh);
      f.set(x, top - 1, P.pole);
    }

    function glory(f: Frame, x: number, y: number, n: number, seed: number) {
      // beach morning glory: a runner with round leaves and a few pink trumpets
      for (let k = 0; k < n; k++) {
        const lx = x + Math.round((hash2(k, 0, seed) - 0.5) * n * 2.4);
        const ly = y + Math.round((hash2(k, 1, seed) - 0.5) * 4);
        if (k > 0)
          f.line(
            lx,
            ly,
            x + Math.round((hash2(k - 1, 0, seed) - 0.5) * n * 2.4),
            y + Math.round((hash2(k - 1, 1, seed) - 0.5) * 4),
            P.vine0
          );
      }
      for (let k = 0; k < n; k++) {
        const lx = x + Math.round((hash2(k, 0, seed) - 0.5) * n * 2.4);
        const ly = y + Math.round((hash2(k, 1, seed) - 0.5) * 4);
        f.rect(lx - 1, ly - 1, 3, 2, P.vine1);
        f.hline(lx - 1, lx + 1, ly + 1, P.vine0);
        f.set(lx - 1, ly - 1, P.vine0);
        if (hash2(k, 2, seed) > 0.62) {
          const fx0 = lx + 1;
          const fy0 = ly - 2;
          f.set(fx0, fy0 - 1, P.gloryHi);
          f.set(fx0 - 1, fy0, P.gloryHi);
          f.set(fx0 + 1, fy0, P.glory);
          f.set(fx0, fy0 + 1, P.glory);
          f.set(fx0, fy0, P.gloryEye);
        }
      }
    }

    // ---------- the house, its trees and its wall ----------
    const flowers: Hit[] = [];
    const land = layer(w, h, (f) => {
      // dense fukugi windbreak: fill solid first so the gaps between crowns stay dark
      for (let x = Math.floor(vegL); x < w; x++) {
        for (let y = vegTop(x) + 4; y < SHORE + 6; y++)
          if (inVeg(x, y)) f.set(x, y, P.fuku0);
      }
      canopy(
        f,
        (x, y) => inVeg(x, y) && y < SHORE + 4,
        { dark: P.fuku0, mid: P.fuku1, light: P.fuku2, hi: P.fuku3 },
        {
          seed: 5,
          x0: vegL - 4,
          x1: w + 6,
          y0: 60,
          y1: SHORE + 4,
          size: 4,
          step: 4,
        }
      );
      // a few trunks where the trees meet the beach
      for (let x = vegL + 4; x < hx - 36; x += 6) {
        const y0 = Math.max(vegTop(x) + 8, Math.round(SHORE - 6));
        f.vline(x, y0, shore(x) + 1, P.woodDark);
      }
      if (w >= 560) house(f, hx + 84, HOUSE_B - 3, false);
      house(f, hx, HOUSE_B, true);
      wall(f);
      // bougainvillea tumbling over the wall, hibiscus by the gate
      bougainvillea(f, hx - 36, WALL_TOP - 1, 7, 4, 11);
      bougainvillea(f, hx + 21, WALL_TOP, 9, 3, 12);
      bougainvillea(f, hx - 27, HOUSE_B - 15, 3, 8, 13); // climbing the corner post
      if (w >= 300)
        bougainvillea(f, Math.min(w - 10, hx + 60), WALL_TOP, 8, 3, 14);
      hibiscus(f, hx - 12, WALL_TOP - 2, 15);
      hibiscus(f, hx + 11, WALL_TOP - 1, 16);
    });

    function house(f: Frame, x: number, B: number, main: boolean) {
      const eave = B - 14;
      const ridge = B - 30;
      const ex = 29;
      const rx = 11;
      // walls: posts, sliding shutters, paper screens, a glimpse of tatami
      f.rect(x - 25, eave + 1, 51, B - eave - 1, P.wood);
      const panels = ['amado', 'shoji', 'open', 'shoji'] as const;
      for (let i = 0; i < 4; i++) {
        const x0 = x - 24 + i * 12 + 1;
        const kind = panels[(i + (main ? 0 : 1)) % 4]!;
        for (let y = eave + 3; y < B - 1; y++) {
          for (let k = 0; k < 11; k++) {
            let c: RGB;
            if (kind === 'amado')
              c = k % 4 === 3 ? P.woodDark : y === eave + 3 ? P.woodHi : P.wood;
            else if (kind === 'shoji')
              c = k === 5 || (y - eave) % 4 === 0 ? P.shojiLine : P.shoji;
            else c = y > B - 5 ? P.tatami : P.interior;
            f.set(x0 + k, y, c);
          }
        }
      }
      for (let i = 0; i <= 4; i++) {
        const px = x - 24 + i * 12;
        f.vline(px, eave + 1, B - 1, P.woodDark);
        if (i < 4) f.set(px + 1, eave + 3, P.woodHi);
      }
      // the veranda floor and the deep shadow under the eaves
      f.hline(x - 25, x + 25, B - 1, P.woodHi);
      f.hline(x - 26, x + 26, B, P.woodDark);
      f.hline(x - 25, x + 25, eave + 1, P.eaveShadow);
      f.hline(x - 25, x + 25, eave + 2, P.woodDark);
      // roof: a low hipped roof of red tiles laid in rows, each joint sealed with white mortar
      for (let y = ridge; y <= eave; y++) {
        const v = (y - ridge) / (eave - ridge);
        const half = Math.round(rx + (ex - rx) * v);
        const course = (eave - y) % 3 === 2;
        for (let dx = -half; dx <= half; dx++) {
          const k = (((dx + 1) % 4) + 4) % 4;
          let c: RGB;
          if (k === 0) c = P.mortarDim;
          else if (k === 1) c = course ? P.roof : P.roofHi;
          else if (k === 2) c = P.roof;
          else c = course ? P.roofDeep : P.roofSh;
          // hips: thick mortar along the diagonals
          if (Math.abs(dx) >= half - 1)
            c = Math.abs(dx) === half ? P.mortar : P.mortarSh;
          f.set(x + dx, y, c);
        }
      }
      // eave: tile ends with mortar dabs, and the shadow line beneath
      for (let dx = -ex; dx <= ex; dx++) {
        const k = (((dx + 1) % 4) + 4) % 4;
        f.set(x + dx, eave, k === 0 ? P.mortar : P.roofSh);
      }
      f.hline(x - ex, x + ex, eave + 1, P.roofDeep);
      // ridge: a fat band of mortar with flared ends
      f.hline(x - rx - 1, x + rx + 1, ridge - 1, P.mortar);
      f.hline(x - rx, x + rx, ridge - 2, P.mortar);
      f.hline(x - rx - 1, x + rx + 1, ridge, P.mortarSh);
      f.set(x - rx - 2, ridge - 2, P.mortar);
      f.set(x + rx + 2, ridge - 2, P.mortar);
      f.set(x - rx - 2, ridge - 3, P.mortarDim);
      f.set(x + rx + 2, ridge - 3, P.mortarDim);
      if (!main) drawShisa(f, x, ridge - 3, 0, false, 0);
    }

    function wall(f: Frame) {
      // coral limestone, laid as rounded blocks: nearest-seed cells with dark joints
      const x0 = hx - 38;
      const seeds: [number, number][] = [];
      for (let gy = WALL_TOP - 2; gy < WALL_B + 4; gy += 4)
        for (let gx = x0 - 6; gx < w + 8; gx += 5)
          seeds.push([
            gx + Math.round(hash2(gx, gy, 51) * 4),
            gy + Math.round(hash2(gx, gy, 52) * 3),
          ]);
      const gate = (x: number) => x >= hx - 5 && x <= hx + 5;
      for (let y = WALL_TOP; y < WALL_B; y++) {
        for (let x = x0; x < w; x++) {
          if (gate(x)) continue;
          // the end of the wall is rounded off
          if (x - x0 < 3 && y - WALL_TOP < 3 - (x - x0)) continue;
          let d1 = Infinity;
          let d2 = Infinity;
          let best = 0;
          for (let i = 0; i < seeds.length; i++) {
            const s = seeds[i]!;
            if (Math.abs(s[0] - x) > 8 || Math.abs(s[1] - y) > 6) continue;
            const d = (s[0] - x) ** 2 + ((s[1] - y) * 1.3) ** 2;
            if (d < d1) {
              d2 = d1;
              d1 = d;
              best = i;
            } else if (d < d2) d2 = d;
          }
          const s = seeds[best]!;
          let c = P.wall;
          if (Math.sqrt(d2) - Math.sqrt(d1) < 1) c = P.wallDeep;
          else if (y < s[1] - 1 && x < s[0] + 1) c = P.wallLit;
          else if (y > s[1] + 1 || x > s[0] + 2) c = P.wallSh;
          if (y === WALL_TOP) c = c === P.wallDeep ? P.wallSh : P.wallHi;
          if (y === WALL_B - 1) c = P.wallDeep;
          f.set(x, y, c);
        }
      }
      // gate posts, a little taller, and the path of white coral sand to the door
      for (const gx of [hx - 8, hx + 6]) {
        f.rect(gx, WALL_TOP - 3, 3, WALL_B - WALL_TOP + 3, P.wall);
        f.vline(gx, WALL_TOP - 3, WALL_B - 1, P.wallLit);
        f.vline(gx + 2, WALL_TOP - 3, WALL_B - 1, P.wallSh);
        f.hline(gx, gx + 2, WALL_TOP - 3, P.wallHi);
        f.hline(gx, gx + 2, WALL_TOP + 3, P.wallDeep);
        f.hline(gx, gx + 2, WALL_TOP + 7, P.wallDeep);
      }
      f.rect(hx - 5, HOUSE_B + 1, 11, WALL_B - HOUSE_B - 1, P.sand0);
      f.rect(hx - 2, HOUSE_B + 2, 5, 2, P.wallLit);
      f.hline(hx - 2, hx + 2, HOUSE_B + 3, P.wallSh);
    }

    function bougainvillea(
      f: Frame,
      x: number,
      y: number,
      rw: number,
      rh: number,
      seed: number
    ) {
      const cols = [P.bouga0, P.bouga1, P.bouga2];
      for (let k = 0; k < rw * rh * 0.9; k++) {
        const bx = x + Math.round((hash2(k, 0, seed) - 0.5) * 2 * rw);
        const by =
          y + Math.round(Math.pow(hash2(k, 1, seed), 1.4) * rh * 2) - 1;
        const leaf = hash2(k, 2, seed) > 0.78;
        f.disc(bx, by, 1, (dx, dy) => {
          if (leaf) return dx + dy > 0 ? P.leaf0 : P.leaf1;
          const l = -dx - dy;
          return cols[l > 0 ? 2 : l < 0 ? 0 : 1]!;
        });
      }
      flowers.push({
        x0: x - rw - 2,
        y0: y - 3,
        x1: x + rw + 2,
        y1: y + rh * 2 + 2,
      });
    }

    function hibiscus(f: Frame, x: number, y: number, seed: number) {
      for (let k = 0; k < 9; k++) {
        const bx = x + Math.round((hash2(k, 0, seed) - 0.5) * 8);
        const by = y + Math.round(hash2(k, 1, seed) * 5) - 2;
        f.disc(bx, by, 1.4, (dx, dy) => (dx + dy > 0 ? P.leaf0 : P.leaf1));
      }
      for (let k = 0; k < 3; k++) {
        const bx = x + Math.round((hash2(k, 3, seed) - 0.5) * 7);
        const by = y + Math.round(hash2(k, 4, seed) * 4) - 2;
        f.set(bx, by, P.hibiscusHi);
        f.set(bx + 1, by, P.hibiscus);
        f.set(bx, by + 1, P.hibiscus);
        f.set(bx + 1, by + 1, P.hibiscus);
        f.set(bx - 1, by, P.hibiscus);
        f.set(bx, by - 1, P.hibiscusHi);
        f.set(bx + 1, by - 1, P.stamen);
      }
      flowers.push({ x0: x - 6, y0: y - 5, x1: x + 6, y1: y + 5 });
    }

    function drawShisa(
      f: Frame,
      x: number,
      base: number,
      look: number,
      roaring: boolean,
      shake: number,
      sc = 1 // swelled up to roar
    ) {
      const rows = SHISA.slice();
      if (roaring) {
        rows[6] = SHISA_ROAR[0]!;
        rows[7] = SHISA_ROAR[1]!;
        rows[8] = SHISA_ROAR[2]!;
      }
      const pal: Record<string, RGB> = {
        m: P.mane,
        h: P.shisa,
        H: P.shisaHi,
        s: P.shisaSh,
        k: P.shisaDark,
        N: P.shisaDark,
        t: P.teeth,
        W: P.teeth,
        w: P.teeth,
        E: P.shisaDark,
        c: P.mane,
        S: P.mortar,
      };
      const x0 = x - 6 * sc;
      const top = base - rows.length * sc + 1;
      rows.forEach((row, ry) => {
        // the head shakes and lifts when it roars; the body stays put
        const head = ry < 8;
        const ox = head ? shake * sc : 0;
        const oy = head && roaring ? -sc : 0;
        for (let rx = 0; rx < row.length; rx++) {
          let ch = row[rx]!;
          // the pupils follow whatever is going on
          if (ry === 4 && (ch === 'w' || ch === 'E')) {
            const left = rx < 6;
            const pupil = left ? (look < 0 ? 2 : 3) : look > 0 ? 10 : 9;
            ch = rx === pupil ? 'E' : 'w';
          }
          const c = pal[ch];
          if (c === undefined) continue;
          if (sc === 1) f.set(x0 + rx + ox, top + ry + oy, c);
          else f.rect(x0 + rx * sc + ox, top + ry * sc + oy, sc, sc, c);
        }
      });
    }

    // ---------- foreground: a pandanus with its pineapple-like fruit ----------
    const foreground = layer(w, h, (f) => {
      const x = adanX;
      const base = h;
      // stilt roots
      for (const [dx, len] of [
        [-6, 9],
        [-3, 12],
        [2, 11],
        [6, 8],
      ] as const)
        f.line(x + dx, base, x + Math.sign(dx), base - len, P.trunkSh);
      f.rect(x - 1, base - 20, 3, 10, P.trunk);
      f.vline(x - 1, base - 20, base - 10, P.trunkLit);
      f.line(x, base - 19, x - 7, base - 26, P.trunk);
      f.line(x + 1, base - 19, x + 7, base - 27, P.trunk);
      for (const [rx, ry, s] of [
        [x - 7, base - 27, 1],
        [x + 7, base - 28, 2],
        [x, base - 22, 3],
      ] as const) {
        for (let k = 0; k < 13; k++) {
          const ang =
            -Math.PI / 2 +
            ((k / 12) * 2 - 1) * 1.5 +
            (hash2(k, s, 3) - 0.5) * 0.2;
          const len = 8 + hash2(k, s, 4) * 6;
          for (let j = 1; j < len; j++) {
            const v = j / len;
            const px = rx + Math.cos(ang) * j;
            const py = ry + Math.sin(ang) * j + v * v * len * 0.6;
            f.set(
              px,
              py,
              v > 0.78 ? P.adan2 : Math.cos(ang) < 0 ? P.adan1 : P.adan0
            );
            if (v < 0.55) f.set(px, py + 1, P.adan0);
          }
        }
      }
      // fruit hanging under the crown
      f.disc(x + 3, base - 21, 2.6, (dx, dy) =>
        (dx + dy * 2 + 9) % 3 === 0
          ? P.adanFruitSh
          : dx + dy < 0
            ? P.adanFruitHi
            : P.adanFruit
      );
      f.set(x + 3, base - 24, P.adan0);
    });

    // ---------- moving things ----------
    // (on a phone the middle of the lagoon is under the palm fronds, so it
    // keeps a little nearer the beach there, and clear of the snorkel)
    const narrow = vegL < 200;
    const turtleA = Math.min(56, vegL * (narrow ? 0.15 : 0.2));
    const turtleX0 = at(0.6);
    const TURTLE_Y = narrow ? 102 : 100;
    const TURTLE_LOOP = 30_000;
    let lastT = 0;

    // ---- the turtle egg: it comes right up for a breath ----
    const TURTLE_LEN = 5600;
    const TURTLE_BIG = 2.1; // how much bigger it looks up at the surface
    const RING_R = Math.max(36, Math.min(124, w * 0.21));
    let surfAt = -Infinity;
    let swimLag = 0; // ms its swim clock lost to earlier breaths
    /** How far the swim clock falls behind while it hangs at the surface. */
    function lagOf(age: number) {
      if (!(age > 0)) return 0;
      if (age < 700) return (age * age) / 1400;
      if (age < 4300) return 350 + (age - 700);
      if (age < 5300) {
        const a = age - 4300;
        return 3950 + a - (a * a) / 2000;
      }
      return 4450;
    }
    const swimT = (t: number) => t - swimLag - lagOf(t - surfAt);
    /** 0 down on the bottom, 1 at the surface. */
    function turtleUp(age: number) {
      if (!(age >= 0) || age >= 5200) return 0;
      if (age < 900) return smooth(age / 900);
      if (age < 4200) return 1;
      return 1 - smooth((age - 4200) / 1000);
    }

    function turtlePos(t: number) {
      const a = (swimT(t) / TURTLE_LOOP) * Math.PI * 2;
      return {
        x: turtleX0 + Math.sin(a) * turtleA,
        y: TURTLE_Y + Math.sin(a * 2) * 4,
        dir: Math.cos(a) >= 0 ? 1 : -1,
      };
    }

    /** Where it's drawn: up at the surface it swims clear of the near palm's trunk. */
    function turtleAt(t: number) {
      const { x, y, dir } = turtlePos(t);
      const up = turtleUp(t - surfAt);
      return {
        X: Math.round(x + (Math.max(x, 64) - x) * up),
        Y: Math.round(y - up * 3),
        dir,
        up,
      };
    }

    function drawTurtle(f: Frame, t: number) {
      const { X, Y, dir, up } = turtleAt(t);
      const shell = lerpRGB(P.tShell, P.sShell, up);
      const plate = lerpRGB(P.tPlate, P.sPlate, up);
      const plateHi = lerpRGB(P.tPlateHi, P.sPlateHi, up);
      const skin = lerpRGB(P.tSkin, P.sSkin, up);
      const s = 1 + up * (TURTLE_BIG - 1);
      // its shadow on the sand below, further away the higher it swims
      const so = Math.round(3 + up * 6);
      const sw = Math.round(4 * s);
      const sh = Math.max(1, Math.round(s));
      for (let dx = -sw; dx <= sw; dx++)
        for (let dy = -sh; dy <= sh; dy++)
          if (Math.abs(dx) < sw || dy === 0)
            f.blend(X + dx + 1, Y + so + dy, P.coral, 0.22 * (1 - up * 0.4));
      if (s > 1.08) {
        bigTurtle(f, X, Y, dir, s, t, { shell, plate, plateHi, skin });
        drawRings(f, t, X, Y);
        return;
      }
      const px = (dx: number, dy: number, c: RGB) =>
        f.set(X + dir * dx, Y + dy, c);
      // flippers: the front pair rows in three beats, the back pair steers
      const beat = Math.floor(t / 280) % 4;
      const front = STROKE[beat]!;
      for (const s of [-1, 1]) {
        for (const [dx, dy] of front) px(dx, dy * s, skin);
        px(2, -3 * s, skin);
        px(-4, 2 * s, skin);
        px(-5, 3 * s, skin);
      }
      px(-5, 0, skin);
      // shell: a dark rim around lighter plates, lit from the upper left
      for (let dy = -2; dy <= 2; dy++) {
        const half = Math.abs(dy) === 2 ? 3 : 4;
        for (let dx = -half; dx <= half; dx++)
          px(
            dx,
            dy,
            Math.abs(dy) === 2 || Math.abs(dx) === half ? shell : plate
          );
      }
      px(-2, 0, shell);
      px(0, 0, shell);
      px(2, 0, shell);
      px(-1, -1, plateHi);
      px(1, -1, plateHi);
      px(-3, -1, plateHi);
      // head
      px(5, -1, skin);
      px(5, 0, skin);
      px(6, 0, skin);
      px(6, -1, skin);
      px(7, -1, skin);
      drawRings(f, t, X, Y);
    }

    /** The turtle drawn at `s` times its size, up at the surface. */
    function bigTurtle(
      f: Frame,
      x: number,
      y: number,
      dir: number,
      s: number,
      t: number,
      c: { shell: RGB; plate: RGB; plateHi: RGB; skin: RGB }
    ) {
      const rx = 4.6 * s;
      const ry = 2.7 * s;
      const skinSh = lerpRGB(c.skin, P.tShell, 0.45);
      // the front flippers row in a slow stroke; the back ones trail
      const st = Math.sin(t / 360);
      for (const side of [-1, 1]) {
        const bx = x + dir * rx * 0.4;
        const by = y + side * ry * 0.55;
        const ang = 0.35 + st * 0.55; // swept back from straight out
        const L = 7 * s;
        const ux = -dir * Math.sin(ang);
        const uy = side * Math.cos(ang) * 0.85;
        // a long paddle, widest two thirds of the way out, its tip curling back
        for (let k = 0; k <= L; k += 0.5) {
          const v = k / L;
          const r =
            s * (0.55 + 0.6 * Math.sin(Math.min(1, v * 1.4) * Math.PI * 0.85));
          const px = bx + ux * k - dir * v * v * 1.5 * s;
          const py = by + uy * k;
          f.disc(px, py, Math.max(0.5, r * (1 - v * 0.5)), (dx, dy) =>
            dy * side > 0 || dx * dir < -1 ? skinSh : c.skin
          );
        }
        const rbx = x - dir * rx * 0.62;
        const rby = y + side * ry * 0.5;
        f.poly(
          [
            [rbx + dir * 0.8 * s, rby],
            [rbx - dir * 2.4 * s, rby + side * 1.7 * s],
            [rbx - dir * 1.4 * s, rby],
          ],
          skinSh
        );
      }
      // the head, poking forward, eyes either side
      const hx0 = x + dir * (rx + 1.1 * s);
      f.disc(hx0, y, 1.35 * s, (dx, dy) =>
        dx * dir + dy < -1 ? lerpRGB(c.skin, P.foam, 0.3) : c.skin
      );
      f.set(hx0 + dir * 0.6 * s, y - Math.round(0.9 * s), P.shisaDark);
      f.set(hx0 + dir * 0.6 * s, y + Math.round(0.9 * s), P.shisaDark);
      // the shell: a rim round rows of scutes, lit from the upper left and wet
      const cx = Math.ceil(rx);
      const cy = Math.ceil(ry);
      for (let dy = -cy; dy <= cy; dy++) {
        const v = dy / ry;
        for (let dx = -cx; dx <= cx; dx++) {
          const u = dx / rx;
          const e = u * u + v * v;
          if (e > 1) continue;
          let col = c.shell;
          if (e < 0.72) {
            const su = u * dir;
            const mid = Math.abs(v) < 0.3;
            const cu = mid ? su * 2.6 + 0.5 : su * 2.2;
            const seam =
              Math.abs(Math.abs(v) - 0.3) < 0.09 ||
              Math.abs(cu - Math.round(cu)) < 0.12;
            col = seam
              ? c.shell
              : v < -0.3 || (mid && u < -0.2)
                ? c.plateHi
                : c.plate;
          }
          f.set(x + dx, y + dy, col);
        }
      }
      // a wet glint on the shell
      if (Math.floor(t / 300) % 3) {
        f.set(x - Math.round(rx * 0.3), y - Math.round(ry * 0.6), P.glint);
        f.set(x - Math.round(rx * 0.3) + 1, y - Math.round(ry * 0.6), P.foam);
      }
    }

    /** Bubbles as it rises, then rings spreading out across the lagoon. */
    function drawRings(f: Frame, t: number, X: number, Y: number) {
      const age = t - surfAt;
      if (age >= 0 && age < 1000) {
        // a stream of bubbles as it kicks up for the surface
        for (let k = 0; k < 12; k++) {
          const p = (age / 600 + hash2(k, 1, 12)) % 1;
          const bx =
            X + Math.round((hash2(k, 2, 12) - 0.5) * 14 + Math.sin(p * 8 + k));
          const by = Math.round(Y + 3 - p * 10);
          f.set(bx, by, P.bubble);
          if (k % 3 === 0) f.set(bx + 1, by - 1, P.bubble);
        }
      }
      if (!(age >= 700 && age < TURTLE_LEN)) return;
      // rings spreading wide across the lagoon
      for (let k = 0; k < 4; k++) {
        const a = age - 800 - k * 420;
        if (a < 0 || a > 2600) continue;
        const p = a / 2600;
        const r = 7 + (1 - (1 - p) * (1 - p)) * RING_R;
        const alpha = (1 - p) * 0.9;
        const steps = Math.ceil(r * 7);
        for (let i = 0; i < steps; i++) {
          const ang = (i / steps) * Math.PI * 2;
          const px = X + Math.cos(ang) * r;
          const py = Y + Math.sin(ang) * r * 0.3;
          if (py <= REEF + 1) continue;
          f.blend(px, py, P.foam, alpha);
          if (k < 2) f.blend(px, py + 1, P.foamShade, alpha * 0.5);
          if (hash2(i, Math.floor(a / 140), 9 + k) > 0.93)
            f.set(px, py - 1, P.glint);
        }
      }
    }

    /**
     * Spray as it breaks the surface, and its breath with a rainbow in it.
     * (Drawn over everything: on a phone the palm fronds hang over it.)
     */
    function drawBreath(f: Frame, t: number) {
      const age = t - surfAt;
      if (!(age >= 800 && age < TURTLE_LEN)) return;
      const { X, Y, dir } = turtleAt(t);
      // spray thrown up as it breaks the surface, and again as it dives
      for (const [at0, n, hgt] of [
        [850, 18, 1],
        [4250, 10, 0.6],
      ] as const) {
        const sa = (age - at0) / 1000;
        if (sa < 0 || sa > 0.8) continue;
        for (let i = 0; i < n; i++) {
          const vx = (hash2(i, 1, 31) - 0.5) * 70;
          const vy = (-34 - hash2(i, 2, 31) * 40) * hgt;
          const px = X + (hash2(i, 3, 31) - 0.5) * 16 + vx * sa;
          const py = Y - 2 + vy * sa + 110 * sa * sa;
          if (py > Y + 3) continue;
          f.set(px, py, i % 3 ? P.foam : P.glint);
          if (i % 4 === 0) f.set(px + 1, py, P.foamShade);
        }
      }
      // the breath: a puff of spray from the nostrils, with a rainbow in it
      const ba = age - 1350;
      if (ba >= 0 && ba < 1900) {
        const p = ba / 1900;
        const hx0 = X + dir * Math.round(4.6 * TURTLE_BIG + 2.2 * TURTLE_BIG);
        const cx = hx0 + dir * p * 3;
        const cy = Y - 4 - p * 10;
        if (p < 0.25) f.vline(hx0, cy, Y - 2, P.foam); // the jet
        const r = 1.6 + p * 5;
        const dens = p < 0.25 ? 1 : 1 - (p - 0.25) / 0.75;
        for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++)
          for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
            const d = Math.hypot(dx, dy * 1.3) / r;
            if (d > 1) continue;
            const a = dens * (1.3 - d);
            if (a > 0.75) f.set(cx + dx, cy + dy, d < 0.5 ? P.foam : P.glint);
            else f.dset(cx + dx, cy + dy, P.foam, a);
          }
        if (p > 0.12) {
          const fade = Math.min(1, (p - 0.12) * 5) * Math.min(1, (1 - p) * 4);
          const r0 = 5 + p * 6;
          const bands = [P.rainbowB, P.rainbowY, P.rainbowR];
          for (let b = 0; b < 3; b++) {
            const rr = r0 + b;
            const steps = Math.ceil(rr * 5);
            for (let i = 0; i <= steps; i++) {
              const ang = Math.PI + (i / steps) * Math.PI;
              f.blend(
                cx + Math.cos(ang) * rr * 1.3,
                cy + 3 + Math.sin(ang) * rr,
                bands[b]!,
                0.8 * fade
              );
            }
          }
        }
      }
    }

    // ---- the snorkel egg: the lagoon goes see-through ----
    const SY = 86; // the waterline at the snorkel
    const tubeX = Math.round(
      Math.min(Math.max(at(narrow ? 0.94 : 0.92), 88), vegEdge(SY) - 9)
    );
    const SNORKEL_LEN = 7800;
    const ASPECT = 3.2; // the clear patch spreads wider than deep
    const TUBE_R = 7;
    let snorkelAt = -Infinity;
    // where the clear view replaces the water: the lagoon, but not the rock
    const lagoon = new Uint8Array(w * h);
    const rocky = new Set([
      P.rockHi,
      P.rockLit,
      P.rock,
      P.rockShade,
      P.rockNotch,
      P.fuku1,
      P.fuku2,
      P.fuku3,
    ]);
    let qMax = 0;
    for (let y = REEF + 2; y < SHORE + 6; y++)
      for (let x = 0; x < w; x++) {
        if (!inWater(x, y)) continue;
        if (Math.abs(x - rockX) <= 9 && rocky.has(sea.get(x, y))) continue;
        lagoon[y * w + x] = 1;
        qMax = Math.max(qMax, Math.hypot((x - tubeX) / ASPECT, y - SY));
      }
    const CORAL: [RGB, RGB, RGB][] = [
      [P.cPinkHi, P.cPink, P.cPinkSh],
      [P.cPurpleHi, P.cPurple, P.cPurpleSh],
      [P.cYellowHi, P.cYellow, P.cYellowSh],
      [P.cOrangeHi, P.cOrange, P.cOrangeSh],
      [P.cLimeHi, P.cLime, P.cLimeSh],
      [P.cRedHi, P.cRed, P.cRedSh],
    ];
    type Coral = {
      x: number;
      y: number;
      s: number;
      kind: number;
      pal: number;
      fade: number; // far ones fade into the water
    };
    const clearWater = (y: number) => {
      const d = Math.min(1, Math.max(0, (y - REEF - 2) / (SHORE - REEF - 2)));
      return d < 0.5
        ? lerpRGB(P.clearFar, P.clearMid, d * 2)
        : lerpRGB(P.clearMid, P.clearNear, (d - 0.5) * 2);
    };
    function coral(f: Frame, it: Coral) {
      const { x, y, s } = it;
      const wc = clearWater(y);
      const [hi, mid, sh] = CORAL[it.pal]!.map((c) =>
        lerpRGB(c, wc, it.fade)
      ) as [RGB, RGB, RGB];
      if (it.kind <= 1) {
        // branching, like antlers
        const H = Math.max(2, Math.round(1.5 + s * 2));
        const n = 2 + Math.round(s);
        for (let b = 0; b < n; b++) {
          const u = b / (n - 1) - 0.5;
          const tx = x + Math.round(u * H * 1.5);
          const ty = y - H + Math.round(Math.abs(u) * H * 0.7);
          f.line(x, y, tx, ty, b % 2 ? mid : sh);
          f.set(tx, ty, hi);
          if (H > 3) f.set(tx + (u < 0 ? -1 : 1), ty + 1, hi);
        }
      } else if (it.kind === 2) {
        // a round brain coral
        const r = 1 + s * 1.1;
        const rv = Math.max(1, r * 0.75);
        for (let dy = -Math.ceil(rv); dy <= 0; dy++)
          for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
            if ((dx * dx) / (r * r) + (dy * dy) / (rv * rv) > 1.05) continue;
            let c = dx + dy < -1 ? hi : dx > r * 0.4 ? sh : mid;
            if ((dx * 2 + dy * 3 + 40) % 4 === 0 && dx + dy >= -1) c = sh;
            f.set(x + dx, y + dy, c);
          }
      } else if (it.kind === 3) {
        // a table coral on its stem
        const W = Math.round(1 + s * 1.6);
        const Hs = Math.max(1, Math.round(s * 0.8));
        f.vline(x, y - Hs, y, sh);
        f.hline(x - W, x + W, y - Hs - 1, mid);
        f.hline(x - W + 1, x + W - 1, y - Hs - 2, hi);
      } else if (it.kind === 4) {
        // a sea fan
        const r = 1.5 + s * 1.4;
        for (let k = 0; k <= 8; k++) {
          const ang = Math.PI + (k / 8) * Math.PI;
          f.set(x + Math.cos(ang) * r, y + Math.sin(ang) * r, k % 2 ? hi : mid);
        }
        for (let k = 1; k <= 3; k++) {
          const ang = Math.PI + (k / 4) * Math.PI;
          f.line(x, y, x + Math.cos(ang) * r, y + Math.sin(ang) * r, mid);
        }
        f.set(x, y, sh);
      } else if (it.kind === 5) {
        // an anemone, with a clownfish
        for (let k = -2; k <= 2; k++) {
          const hh = 1 + Math.round(s * (1 - Math.abs(k) * 0.25));
          f.vline(x + k, y - hh, y, P.cLime);
          f.set(x + k, y - hh, P.cLimeHi);
        }
        const cy = y - Math.round(2 + s);
        f.set(x - 1, cy, P.clown);
        f.set(x, cy, P.foam);
        f.set(x + 1, cy, P.clown);
      } else {
        // a bright blue sea star
        f.set(x, y, P.cBlueHi);
        f.set(x - 1, y, P.cBlue);
        f.set(x + 1, y, P.cBlue);
        f.set(x, y - 1, P.cBlue);
        if (s > 1.2) {
          f.set(x - 2, y + 1, P.cBlue);
          f.set(x + 2, y + 1, P.cBlue);
        }
      }
    }
    // the snorkellers round the tube (the man's): head positions on a phone
    // and on a wide screen, and which way each faces
    const spread = Math.max(0, Math.min(1, (w - 200) / 227));
    const GROUP: [Snorkeller, number, number, number, number, number][] = [
      // who, dx narrow, dy narrow, dx wide, dy wide, dir
      [WOMAN_S, 6, -9, -8, -10, 1],
      [WOMAN2_S, 8, -1, 24, -5, -1],
      [MAN_S, 1, 0, 1, 0, 1],
      [BOY_S, 10, 7, -14, 10, -1],
      [GIRL_S, 4, 7, 18, 8, 1],
    ];
    // a big school of fish swirls round them all
    const school2 = (() => {
      let x0 = Infinity;
      let x1 = -Infinity;
      let y0 = Infinity;
      let y1 = -Infinity;
      for (const [who, dxN, dyN, dxW, dyW, dir] of GROUP) {
        const x = tubeX + dxN + (dxW - dxN) * spread;
        const y = SY + dyN + (dyW - dyN) * spread;
        const len = who.head + who.torso + who.legs + who.fins;
        x0 = Math.min(x0, x, x - dir * len);
        x1 = Math.max(x1, x, x - dir * len);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y + who.tall);
      }
      return {
        x: (x0 + x1) / 2,
        y: (y0 + y1) / 2 + 2,
        rx: (x1 - x0) / 2 + 9,
        ry: (y1 - y0) / 2 + 6,
      };
    })();
    const fishN = Math.round(
      Math.min(48, (Math.PI * (school2.rx + school2.ry * 1.3)) / 5)
    );

    const clear = layer(w, h, (f) => {
      for (let y = REEF + 2; y < SHORE + 6; y++) {
        const d = Math.min(1, Math.max(0, (y - REEF - 2) / (SHORE - REEF - 2)));
        const water = clearWater(y);
        const freq = 1.6 - d * 0.7; // ripples in the sand, closer far away
        for (let x = 0; x < w; x++) {
          if (!lagoon[y * w + x]) continue;
          const rip = Math.sin(y * freq + Math.sin(x * 0.11 + y * 0.3) * 2.4);
          let c = water;
          if (rip > 0.8) c = lerpRGB(water, P.floor, 0.3 + d * 0.2);
          else if (rip < -0.9) c = lerpRGB(water, P.floorSh, 0.22);
          f.set(x, y, c);
        }
      }
      // the reef: a garden of coral where each dark head was, two or three
      // colours to a garden, and the odd sea star out on the sand
      const items: Coral[] = [];
      const inGroup = (x: number, y: number) => {
        const u = (x - school2.x) / (school2.rx - 4);
        const v = (y - school2.y) / (school2.ry - 1);
        return u * u + v * v < 1;
      };
      // more of it than the surface lets on
      const gardens = patches.slice();
      for (let i = 0; i < w / 20; i++) {
        const v = hash2(i, 1, 34);
        const y = Math.round(REEF + 8 + v * (SHORE - REEF - 16));
        const x = Math.round(hash2(i, 2, 34) * w);
        if (!lagoon[y * w + x] || inGroup(x, y)) continue;
        const near = (y - REEF) / (SHORE - REEF);
        const rx = (2.5 + near * 8) * (0.6 + hash2(i, 3, 34) * 0.6);
        gardens.push({ x, y, rx, ry: Math.max(1.4, rx * 0.3), seed: 100 + i });
      }
      for (const p of gardens) {
        const near = (p.y - REEF) / (SHORE - REEF);
        // the old reef rock the corals grow on
        for (let dy = -Math.ceil(p.ry); dy <= Math.ceil(p.ry); dy++)
          for (let dx = -Math.ceil(p.rx); dx <= Math.ceil(p.rx); dx++) {
            const x = p.x + dx;
            const y = p.y + dy;
            const u = dx / p.rx;
            const v = dy / p.ry;
            const r = Math.hypot(u, v);
            const lim =
              0.72 + 0.4 * noise1(Math.atan2(v, u) * 1.6 + 10, p.seed);
            if (r > lim || !lagoon[y * w + x] || inGroup(x, y)) continue;
            const c0 = f.get(x, y);
            f.set(
              x,
              y,
              lerpRGB(
                c0,
                v < -0.2 ? P.coralLit : P.coral,
                v < -0.2 ? 0.3 : 0.22
              )
            );
          }
        const n = Math.max(3, Math.round(p.rx * 1.4));
        const pa = Math.floor(hash2(p.seed, 0, 45) * CORAL.length);
        const pb =
          (pa + 1 + Math.floor(hash2(p.seed, 1, 45) * 4)) % CORAL.length;
        for (let k = 0; k < n; k++) {
          const ang = hash2(p.seed, k, 41) * Math.PI * 2;
          const rr = Math.sqrt(hash2(p.seed, k, 42)) * 0.8;
          items.push({
            x: Math.round(p.x + Math.cos(ang) * rr * p.rx),
            y: Math.round(p.y + Math.sin(ang) * rr * p.ry + 1),
            s: 0.7 + near * 2 + hash2(p.seed, k, 43) * 0.6,
            kind: Math.floor(hash2(p.seed, k, 44) * 6),
            pal: k % 3 === 2 ? pb : pa,
            fade: (1 - near) * 0.4,
          });
        }
      }
      for (let k = 0; k < w / 16; k++) {
        const x = Math.round(hash2(k, 1, 46) * w);
        const y = Math.round(REEF + 8 + hash2(k, 2, 46) * (SHORE - REEF - 12));
        if (!lagoon[y * w + x]) continue;
        const near = (y - REEF) / (SHORE - REEF);
        items.push({
          x,
          y,
          s: 0.4 + near * 1.4,
          kind: k % 3 ? 6 : 2,
          pal: Math.floor(hash2(k, 4, 46) * CORAL.length),
          fade: (1 - near) * 0.4,
        });
      }
      items.sort((a, b) => a.y - b.y);
      for (const it of items) if (!inGroup(it.x, it.y)) coral(f, it);
    });

    /** How far the clear patch has spread, in stretched px from the tube. */
    function revealR(age: number) {
      const full = qMax + 2;
      if (!(age >= 0) || age >= 7400) return 0;
      if (age < 1500) return full * (1 - (1 - age / 1500) ** 2);
      if (age < 6100) return full;
      return full * (1 - smooth((age - 6100) / 1300));
    }

    function drawReveal(f: Frame, t: number) {
      const age = t - snorkelAt;
      const R = revealR(age);
      if (R <= 0) return;
      const R2 = R * R;
      const rim = R > 1.5 ? (R - 1.5) * (R - 1.5) : 0;
      const y0 = Math.max(REEF + 2, Math.floor(SY - R));
      const y1 = Math.min(SHORE + 5, Math.ceil(SY + R));
      for (let y = y0; y <= y1; y++) {
        const dy = y - SY;
        if (dy * dy >= R2) continue;
        const half = Math.sqrt(R2 - dy * dy) * ASPECT;
        const xa = Math.max(0, Math.floor(tubeX - half));
        const xb = Math.min(w - 1, Math.ceil(tubeX + half));
        const row = y * w;
        const wob = Math.sin(y * 1.3 + t / 800) * 2.2;
        const tc = t / 650;
        const tc2 = t / 1000 - y * 0.9;
        for (let x = xa; x <= xb; x++) {
          if (!lagoon[row + x]) continue;
          const ux = (x - tubeX) / ASPECT;
          const q2 = ux * ux + dy * dy;
          if (q2 >= R2) continue;
          if (q2 > rim) {
            f.set(x, y, P.glint);
            continue;
          }
          f.pixels[row + x] = clear.pixels[row + x]!;
          // sunlight netting over the bottom
          if (Math.sin(x * 0.5 + tc + wob) + Math.sin(x * 0.29 - tc2) > 1.45)
            f.blend(x, y, P.glint, 0.45);
        }
      }
      const seen = (x: number, y: number) => {
        const ux = (x - tubeX) / ASPECT;
        const dy = y - SY;
        return ux * ux + dy * dy < rim;
      };
      // a big school of bright fish, swirling under the snorkellers
      const open = smooth(Math.min(1, age / 1500));
      for (let i = 0; i < fishN; i++) {
        const h1 = hash2(i, 1, 404);
        const h2 = hash2(i, 2, 404);
        const h3 = hash2(i, 3, 404);
        const a =
          (i / fishN) * Math.PI * 2 + (h1 - 0.5) * 0.2 + (age / 1000) * 1.6;
        const rr = (0.8 + 0.25 * h2) * (0.35 + 0.65 * open);
        const sa = Math.sin(a);
        const x = Math.round(school2.x + Math.cos(a) * school2.rx * rr);
        const y = Math.round(
          school2.y +
            sa * school2.ry * rr +
            (h3 - 0.5) * 3 +
            Math.sin(age / 500 + i)
        );
        const face = sa > 0 ? -1 : 1;
        const far = sa < 0;
        const blue = i % 5 === 0;
        let body = blue ? P.bFish : P.yFish;
        let lit = blue ? P.bFishHi : P.yFishHi;
        let tail = blue ? P.yFish : P.yFishTail;
        if (far) {
          body = lerpRGB(body, P.clearMid, 0.4);
          lit = lerpRGB(lit, P.clearMid, 0.4);
          tail = lerpRGB(tail, P.clearMid, 0.4);
        }
        if (!seen(x, y)) continue;
        // a little fish: pointed nose, an eye, a forked tail
        f.set(x, y, body);
        f.set(x - face, y, far ? body : P.shisaDark);
        f.set(x - face * 2, y, body);
        f.set(x - face * 3, y, body);
        f.set(x - face, y - 1, lit);
        f.set(x - face * 2, y - 1, lit);
        f.set(x - face * 2, y + 1, body);
        f.set(x - face * 4, y - 1, tail);
        f.set(x - face * 4, y + 1, tail);
      }
      // bubbles winding up from the reef
      for (let k = 0; k < 9; k++) {
        const bx0 = school2.x + (hash2(k, 1, 77) - 0.5) * school2.rx * 2.2;
        const by0 = SY + 14 + hash2(k, 2, 77) * 8;
        const p = (age / 1700 + hash2(k, 3, 77)) % 1;
        const bx = Math.round(bx0 + Math.sin(p * 9 + k) * 1.2);
        const by = Math.round(by0 - p * 18);
        if (!seen(bx, by)) continue;
        f.set(bx, by, P.bubble);
        if (k % 3 === 0 && p < 0.7) {
          f.set(bx + 1, by - 2, P.bubble);
          f.set(bx, by - 3, P.bubble);
        }
      }
      // and the snorkellers, floating over it all
      const bob = Math.round(Math.sin(t / 800) * 0.6);
      let tint = 0;
      const put: Put = (x, y, c) => {
        if (seen(x, y)) f.set(x, y, tint ? lerpRGB(c, P.clearMid, tint) : c);
      };
      // their shadows on the sand below say the water's clear
      const shade: Put = (x, y, c) => {
        if (c !== P.snorkel && c !== P.snorkelTop && seen(x + 3, y + 9))
          f.blend(x + 3, y + 9, P.floorSh, 0.5);
      };
      GROUP.forEach(([who, dxN, dyN, dxW, dyW, dir]) => {
        const hx0 = tubeX + Math.round(dxN + (dxW - dxN) * spread);
        const hy0 = SY + Math.round(dyN + (dyW - dyN) * spread);
        snorkeller(shade, hx0, hy0, dir, who, 0);
      });
      GROUP.forEach(([who, dxN, dyN, dxW, dyW, dir], i) => {
        const hx0 = tubeX + Math.round(dxN + (dxW - dxN) * spread);
        let hy0 = SY + Math.round(dyN + (dyW - dyN) * spread);
        hy0 +=
          who === MAN_S ? bob : Math.round(Math.sin(t / 900 + i * 2) * 0.6);
        const kick = Math.floor(age / 170 + i * 1.7) % 2;
        tint = 0;
        let dive = 0;
        if (who === BOY_S) {
          // the boy dives down to the fish
          const a = age - 1900;
          dive =
            a < 0 || a > 3000
              ? 0
              : a < 700
                ? smooth(a / 700)
                : a < 2200
                  ? 1
                  : 1 - smooth((a - 2200) / 800);
          tint = dive * 0.4;
          // his bubbles
          if (dive > 0.3)
            for (let k = 0; k < 5; k++) {
              const p = (age / 900 + k / 5) % 1;
              const bx = hx0 - 1 + Math.round(Math.sin(p * 8 + k) * 1.2);
              const by = Math.round(hy0 + dive * 8 - p * (dive * 8 + 2));
              if (seen(bx, by)) f.set(bx, by, P.bubble);
            }
        }
        snorkeller(put, hx0, hy0 + Math.round(dive * 8), dir, who, kick);
        tint = 0;
        if (who === MAN_S) {
          // a thumbs-up out of the water
          const a = age - 2700;
          if (a >= 0 && a < 2600) {
            const len = Math.min(3, Math.floor(a / 70));
            const ax = hx0 - dir * 4;
            for (let k = 1; k <= len; k++) put(ax, hy0 - k, P.skin);
            if (len === 3) {
              put(ax, hy0 - 4, P.skin);
              put(ax + dir, hy0 - 4, P.skin);
              put(ax + dir, hy0 - 3, P.skin2);
              put(ax, hy0 - 5, P.skin); // the thumb
              if (a < 900 && Math.floor(a / 120) % 2) {
                put(ax, hy0 - 8, P.glint);
                put(ax - 2, hy0 - 6, P.glint);
                put(ax + 2, hy0 - 6, P.glint);
              }
            }
          }
        }
      });
    }

    function drawFish(f: Frame, t: number) {
      // a little school circling a coral head
      if (!school) return;
      for (let i = 0; i < 7; i++) {
        const a = t / 2600 + i * 0.5 + Math.sin(t / 3000 + i) * 0.3;
        const x = Math.round(school.x + Math.cos(a) * (school.rx + 2));
        const y = Math.round(school.y + Math.sin(a) * (school.ry + 1.5));
        const c = i % 3 === 0 ? P.fishB : P.fishA;
        f.set(x, y, c);
        f.blend(x + (Math.sin(a) > 0 ? 1 : -1), y, c, 0.5);
      }
    }

    /** The trigger: a snorkel poking up out of the lagoon, bobbing. */
    function drawTube(f: Frame, t: number) {
      const age = t - snorkelAt;
      const bob = Math.round(Math.sin(t / 800) * 0.6);
      const y = SY + bob;
      if (revealR(age) < 3) {
        // the swimmer under it, a dark shape just under the surface
        for (let k = -1; k <= 13; k++)
          f.blend(
            tubeX - k,
            y + 1 + (k > 9 ? 1 : 0),
            P.coral,
            k < 2 ? 0.35 : 0.22
          );
        f.blend(tubeX + 1, y + 1, P.coral, 0.3);
      }
      // a ring of little ripples round it
      const rp = Math.floor(t / 400) % 2;
      f.blend(tubeX - 2 - rp, y, P.foam, 0.75);
      f.blend(tubeX + 2 + rp, y, P.foam, 0.75);
      f.vline(tubeX, y - 4, y - 1, P.snorkel);
      f.set(tubeX, y - 5, P.snorkelTop);
      // now and then he blows it clear: a little spout (and once more at the end)
      const ph = (t + 1500) % 6400;
      const sp = age >= 6600 && age < 7400 ? age - 6600 : ph < 700 ? ph : -1;
      if (sp >= 0) {
        const s = sp / 1000;
        for (let k = 0; k < 5; k++) {
          const vx = (k - 2) * 7;
          const vy = -22 - (2 - Math.abs(k - 2)) * 8;
          const py = y - 6 + vy * s + 60 * s * s;
          if (py < y - 5) f.set(tubeX + vx * s, py, k % 2 ? P.foam : P.glint);
        }
      }
    }

    function drawWaders(f: Frame, t: number) {
      // two people standing waist-deep, chatting, the water lapping at them
      const x0 = at(0.86);
      for (let i = 0; i < 2; i++) {
        const x = x0 + i * 5;
        const y = shore(x) - 6 + i;
        const bob = Math.round(Math.sin(t / 1300 + i * 2) * 0.6);
        f.rect(x, y - 3 + bob, 2, 3, P.skin);
        f.rect(x, y - 5 + bob, 2, 2, P.skin);
        f.hline(x, x + 1, y - 5 + bob, P.hair);
        if (i) f.hline(x, x + 1, y - 2 + bob, P.suitBlue);
        f.hline(x - 1, x + 2, y + 1, P.foam);
        f.blend(x, y + 2, P.skin, 0.25);
        f.blend(x + 1, y + 2, P.skin, 0.25);
      }
    }

    function drawSabani(f: Frame, t: number) {
      const span = w + 50;
      const x = Math.round(((t * 0.0035 + w * 0.3) % span) - 25);
      const y = REEF + 6 + Math.round(Math.sin(t / 1100));
      // hull and its reflection
      f.hline(x - 6, x + 6, y, P.hull);
      f.hline(x - 5, x + 5, y + 1, P.hull);
      f.hline(x - 6, x + 5, y - 1, P.hullHi);
      f.set(x + 7, y - 2, P.hullHi);
      for (let k = -4; k <= 4; k += 2) f.blend(x + k, y + 2, P.hull, 0.3);
      // a big lug sail on a raked mast
      f.vline(x, y - 13, y - 2, P.hull);
      for (let r = 0; r < 10; r++) {
        const yy = y - 12 + r;
        const x1 = x + 3 + Math.round(r * 0.5);
        for (let xx = x + 1; xx <= x1; xx++)
          f.set(xx, yy, xx === x1 || r % 4 === 3 ? P.sailSh : P.sail);
      }
      f.set(x - 3, y - 2, P.hair); // the sailor
      f.set(x - 3, y - 3, P.skin);
    }

    function drawFerry(f: Frame, t: number) {
      const span = w + 30;
      const x = Math.round(w + 15 - ((t * 0.0016) % span));
      const y = HORIZON - 1;
      f.hline(x, x + 9, y, P.ferry);
      f.hline(x + 1, x + 8, y + 1, P.ferrySh);
      f.hline(x + 2, x + 7, y - 1, P.ferry);
      f.hline(x + 2, x + 7, y, P.ferryBand);
      f.set(x + 4, y - 2, P.ferrySh);
      f.set(x + 5, y - 2, P.ferrySh);
    }

    function drawTerns(f: Frame, t: number) {
      for (let i = 0; i < 2; i++) {
        const span = w + 40;
        const x = Math.round(((t * (0.006 + i * 0.002) + i * 170) % span) - 20);
        const y = Math.round(30 + i * 8 + Math.sin(t / 1300 + i * 2) * 3);
        bird(f, x, y, Math.floor(t / 180 + i) % 6 < 2 ? 1 : 0, 1);
      }
    }

    function bird(f: Frame, x: number, y: number, pose: number, dir: number) {
      // pose: 0 gliding, 1 wings up, 2 wings down, 3 folded for a dive
      const X = Math.round(x);
      const Y = Math.round(y);
      if (pose === 3) {
        f.set(X, Y, P.tern);
        f.set(X, Y - 1, P.tern);
        f.set(X - 1, Y - 2, P.ternSh);
        f.set(X + 1, Y - 2, P.ternSh);
        f.set(X, Y + 1, P.ternCap);
        return;
      }
      const wy = pose === 1 ? -1 : pose === 2 ? 1 : 0;
      const sh = pose === 2 ? 0 : -1;
      f.set(X, Y, P.tern);
      f.set(X + dir, Y, P.ternCap);
      f.set(X - 1, Y + sh, P.tern);
      f.set(X + 1, Y + sh, P.tern);
      f.set(X - 2, Y - 1 + wy, P.ternSh);
      f.set(X + 2, Y - 1 + wy, P.ternSh);
      f.set(X - 3, Y + wy, P.ternSh);
      f.set(X + 3, Y + wy, P.ternSh);
    }

    function drawKid(f: Frame, t: number) {
      const p0 = parasols[0]!;
      const span = Math.min(26, vegL - p0.x - 14);
      const ph = (t / 15_000) % 2;
      const tri = ph < 1 ? ph : 2 - ph;
      const dir = ph < 1 ? 1 : -1;
      const x = Math.round(p0.x - 6 + tri * span);
      const y = shore(x) + 7;
      const step = Math.floor(t / 260) % 2;
      // legs, swimsuit, head
      f.set(x + (step ? 0 : 1), y, P.skin);
      f.set(x + (step ? 2 : 1), y, P.skin);
      f.rect(x, y - 3, 3, 3, P.suitYellow);
      f.rect(x, y - 5, 3, 2, P.skin);
      f.hline(x, x + 2, y - 5, P.hair);
      f.set(x + (dir > 0 ? 3 : -1), y - 2, P.skin);
      f.rect(x + (dir > 0 ? 3 : -2), y - 1, 2, 2, P.bucket);
      f.hline(x - 1, x + 3, y + 1, P.sandShade);
    }

    function drawSwash(f: Frame, t: number) {
      const ph = (((t / 5600) % 1) + 1) % 1;
      const reach =
        ph < 0.4 ? Math.sin((ph / 0.4) * (Math.PI / 2)) : 1 - (ph - 0.4) / 0.6;
      const wet = ph >= 0.4;
      for (let x = 0; x < Math.min(w, vegL + 10); x++) {
        const edge = shore(x);
        const far = 2 + Math.round(noise1(x / 12, 17) * 4);
        const front = Math.round(reach * far);
        // wet sand left behind by the last wave
        if (wet)
          for (let y = edge + front + 1; y <= edge + far; y++)
            f.set(x, y, P.sandWet);
        for (let y = edge; y < edge + front; y++) f.set(x, y, P.shallow2);
        f.set(x, edge + front, ph < 0.55 ? P.foam : P.foamShade);
        if (ph < 0.4 && noise1(x / 4 + t / 500, 3) > 0.55)
          f.set(x, edge + front - 1, P.foam);
      }
    }

    // ---------- effects ----------
    let fishUntil = -Infinity;
    function flyingFish(t: number, x: number, y: number, seed: number) {
      const n = 2 + (seed % 2);
      fishUntil = t + (n - 1) * 220 + 800 + 32 * 12;
      for (let i = 0; i < n; i++) {
        const dir = hash2(seed, i, 1) > 0.5 ? 1 : -1;
        const start = t + i * 220;
        const sx = x + (i - (n - 1) / 2) * 4;
        const sy = y + i;
        const len = 18 + hash2(seed, i, 2) * 14;
        const hgt = 6 + hash2(seed, i, 3) * 6;
        const dur = 800 + len * 12;
        splash(fx, start, sx, sy, P.foam, seed + i);
        ripple(fx, start, sx, sy, P.foam, { rings: 2, size: 7, squash: 0.3 });
        splash(fx, start + dur, sx + dir * len, sy, P.foam, seed + i + 7);
        ripple(fx, start + dur, sx + dir * len, sy, P.foam, {
          rings: 2,
          size: 6,
          squash: 0.3,
        });
        fx.add(start, dur, (f, age) => {
          const p = age / dur;
          for (let k = 0; k < 4; k++) {
            const q = Math.max(0, p - k * 0.025);
            f.set(
              sx + dir * q * len,
              sy - Math.sin(q * Math.PI) * hgt,
              k === 0 ? P.silver : k === 3 ? P.fishB : P.silverSh
            );
          }
          // the long pectoral fins spread like wings
          const q = Math.max(0, p - 0.03);
          const fx0 = sx + dir * q * len;
          const fy0 = sy - Math.sin(q * Math.PI) * hgt;
          const flick = Math.floor(age / 70) % 2;
          f.set(fx0, fy0 - 1 - flick, P.silver);
          f.set(fx0, fy0 + 1, P.silverSh);
        });
      }
    }

    let ternUntil = -Infinity;
    function dive(t: number, x: number, y: number, seed: number) {
      const dir = x < vegL / 2 ? 1 : -1;
      const tx = Math.round(Math.max(4, Math.min(vegL - 8, x + dir * 22)));
      const ty = Math.max(
        REEF + 6,
        Math.min(shore(tx) - 8, 74 + Math.round(hash2(seed, 1, 4) * 16))
      );
      const PLUNGE = 750;
      const UNDER = 420;
      const CLIMB = 2600;
      ternUntil = t + PLUNGE + UNDER + CLIMB;
      splash(fx, t + PLUNGE, tx, ty, P.foam, seed);
      ripple(fx, t + PLUNGE, tx, ty, P.foam, {
        rings: 3,
        size: 10,
        squash: 0.3,
      });
      splash(fx, t + PLUNGE + UNDER, tx, ty, P.foam, seed + 3);
      fx.add(t, PLUNGE + UNDER + CLIMB, (f, age) => {
        if (age < 260) {
          // a quick hover with wings up before folding
          bird(f, x, y, Math.floor(age / 90) % 2 ? 1 : 2, dir);
          return;
        }
        if (age < PLUNGE) {
          const p = (age - 260) / (PLUNGE - 260);
          const e = p * p;
          bird(f, x + (tx - x) * e, y + (ty - y) * e, 3, dir);
          return;
        }
        if (age < PLUNGE + UNDER) return;
        const s = (age - PLUNGE - UNDER) / 1000;
        const bx = tx + dir * 26 * s;
        const by = ty - 2 - 22 * s + 2 * s * s;
        bird(f, bx, by, Math.floor(age / 110) % 2 ? 1 : 2, dir);
        f.set(bx + dir, by + 1, P.silver); // its catch
        f.set(bx + dir * 2, by + 1, P.silverSh);
      });
    }

    function coconut(
      t: number,
      p: { x: number; base: number; h: number; lean: number },
      seed: number
    ) {
      const c = crown(p);
      const x0 = c.x + (hash2(seed, 1, 9) > 0.5 ? 2 : -1);
      const y0 = c.y + 3;
      // the background palms drop theirs among the trees (or, leaning out
      // over the lagoon, into the water); the others onto the beach
      const back = p.base < h;
      const ground = back
        ? Math.min(p.base, WALL_TOP + 2)
        : Math.max(shore(x0) + 14, 134 + Math.round(hash2(seed, 2, 9) * 8));
      const wet = back && inWater(x0, ground);
      const g = 260; // px/s²
      const fall = Math.sqrt((2 * Math.max(1, ground - y0)) / g);
      const vLand = g * fall;
      const bounce = (0.22 * vLand) / g; // half the time of the hop
      const roll = 600;
      // behind the house it rolls on in among the trees, out of sight
      const dir = back ? 1 : hash2(seed, 3, 9) > 0.5 ? 1 : -1;
      const life = wet ? fall * 1000 : (fall + bounce * 2) * 1000 + roll + 4200;
      coconutUntil.set(p, t + life + (wet ? 700 : 0));
      if (wet) {
        splash(fxBack, t + fall * 1000, x0, ground, P.foam, seed);
        ripple(fxBack, t + fall * 1000, x0, ground + 1, P.foam, {
          rings: 2,
          size: 6,
          squash: 0.3,
        });
      }
      (back ? fxBack : fx).add(t, life, (f, age) => {
        const s = age / 1000;
        let x = x0;
        let y: number;
        if (s < fall) y = y0 + 0.5 * g * s * s;
        else if (s < fall + bounce * 2) {
          const b = s - fall;
          y = ground - (0.22 * vLand * b - 0.5 * g * b * b);
          x = x0 + dir * (b / (bounce * 2)) * 3;
        } else {
          const r = Math.min(1, (age - (fall + bounce * 2) * 1000) / roll);
          y = ground;
          x = x0 + dir * (3 + (1 - (1 - r) * (1 - r)) * 4);
        }
        if (!wet && age > life - 600 && Math.floor(age / 80) % 2) return;
        f.disc(Math.round(x), Math.round(y) - 1, 1.2, (dx, dy) =>
          dx + dy < 0 ? P.coconutHi : dx + dy > 1 ? P.coconutSh : P.coconut
        );
        // a puff of sand where it lands
        const since = s - fall;
        if (since > 0 && since < 0.35) {
          for (let k = 0; k < 5; k++) {
            const vx = (hash2(k, 1, seed) - 0.5) * 34;
            const vy = -14 - hash2(k, 2, seed) * 14;
            f.set(
              x0 + vx * since,
              ground + vy * since + 60 * since * since,
              P.sand2
            );
          }
        }
      });
    }

    const coconutUntil = new Map<object, number>();

    function butterflies(t: number, x: number, y: number, seed: number) {
      for (let i = 0; i < 3; i++) {
        const dir = hash2(seed, i, 2) > 0.5 ? 1 : -1;
        fx.add(t + i * 160, 5200, (f, age) => {
          const a = age / 1000;
          const bx = x + (i - 1) * 3 + dir * a * 9 + Math.sin(a * 3 + i) * 5;
          const by = y - a * 9 + Math.sin(a * 7 + i * 2) * 2 + a * a * 0.6;
          const open = Math.floor(age / 110 + i) % 2 === 0;
          const X = Math.round(bx);
          const Y = Math.round(by);
          if (age > 4600 && Math.floor(age / 80) % 2) return;
          f.set(X, Y, P.wingSpot);
          if (open) {
            f.set(X - 1, Y - 1, P.wing);
            f.set(X + 1, Y - 1, P.wing);
            f.set(X - 1, Y, P.wing);
            f.set(X + 1, Y, P.wing);
            f.set(X - 2, Y - 1, P.wingSpot);
            f.set(X + 2, Y - 1, P.wingSpot);
          } else {
            f.set(X, Y - 1, P.wing);
            f.set(X, Y - 2, P.wing);
          }
        });
      }
    }

    function hermitCrab(t: number, x: number, y: number, seed: number) {
      const dir = hash2(seed, 1, 5) > 0.5 ? 1 : -1;
      const dist = 10 + hash2(seed, 2, 5) * 8;
      fx.add(t, 4200, (f, age) => {
        const walk = Math.min(1, Math.max(0, (age - 250) / 2200));
        const X = Math.round(x + dir * walk * dist);
        const Y = Math.round(y);
        // pops up out of the sand first
        const rise = Math.round(Math.min(1, age / 250));
        if (age > 3600 && Math.floor(age / 80) % 2) return;
        f.set(X, Y - rise, P.crab);
        f.set(X + 1, Y - rise, P.crabSh);
        f.set(X, Y - 1 - rise, P.crabSh);
        f.set(X - dir, Y, P.crabSh);
        if (walk > 0 && walk < 1) {
          const step = Math.floor(age / 90) % 2;
          f.set(X + dir * 2, Y, P.crabLeg);
          f.set(X + dir * 2 - step, Y + 1, P.crabLeg);
          f.set(X - dir, Y + 1 - step, P.crabLeg);
        } else if (walk === 0) {
          f.set(X + dir * 2, Y, P.crabLeg);
        }
        f.set(X + 1, Y + 1, P.sandShade);
      });
    }

    // ---- the shisa egg: it swells up and roars a gust across the bay ----
    const ROAR_LEN = 5600;
    let roarAt = -Infinity;
    let cloudsBlown = 0; // px earlier roars pushed the clouds along
    const CLOUD_PUSH = 48;
    const cloudShift = (t: number) =>
      cloudsBlown +
      (Number.isFinite(roarAt)
        ? CLOUD_PUSH * smooth((t - roarAt - 250) / 3200)
        : 0);
    const GUST_V = (w + 80) / 1500; // px/ms the gust spreads from the ridge
    /** How hard the roar's gust blows at x, 0..1. */
    function gust(x: number, t: number) {
      const age = t - roarAt;
      if (!(age >= 0) || age >= ROAR_LEN) return 0;
      const since = age - 180 - Math.abs(x - hx) / GUST_V;
      if (since <= 0) return 0;
      return Math.min(1, since / 300) * (1 - smooth((age - 2900) / 2000));
    }
    /** A palm's extra lean in the gust: away from the house, flapping. */
    function bend(
      p: { x: number; base: number; h: number; lean: number; seed: number },
      t: number
    ) {
      const c = crown(p);
      const g = gust(c.x, t);
      if (!g) return 0;
      const flap = Math.sin((t - roarAt) / 85 + p.seed);
      return Math.sign(c.x - hx || -1) * g * (0.5 + 0.1 * flap);
    }
    /** Bougainvillea petals torn off the wall and streaming over the beach. */
    function drawPetals(f: Frame, t: number) {
      const age = t - roarAt;
      if (!(age >= 0) || age >= ROAR_LEN) return;
      const n = Math.round(w / 2.4);
      const cols = [
        [P.bouga2, P.bouga1],
        [P.bouga1, P.bouga0],
        [P.gloryHi, P.glory],
        [P.hibiscusHi, P.hibiscus],
        [P.bouga2, P.bouga0],
      ];
      for (let i = 0; i < n; i++) {
        const r = flowers[i % flowers.length]!;
        const x0 = r.x0 + hash2(i, 1, 88) * (r.x1 - r.x0);
        const y0 = r.y0 + hash2(i, 2, 88) * (r.y1 - r.y0);
        const s =
          (age - 150 - Math.abs(x0 - hx) / GUST_V - hash2(i, 3, 88) * 700) /
          1000;
        const life = 3 + hash2(i, 4, 88) * 1.6;
        if (s < 0 || s > life) continue;
        if (s > life - 0.5 && Math.floor(age / 70 + i) % 2) continue;
        const dir = x0 > hx + 10 ? 1 : -1;
        const sp = (0.45 + 0.55 * hash2(i, 5, 88)) * Math.max(80, w * 0.34);
        const x = Math.round(x0 + dir * sp * (s - 0.08 * s * s));
        // they all ride the same rolling wave of air, so they stream as a ribbon
        const y = Math.round(
          y0 -
            32 * (1 - Math.exp(-s * 2)) * (0.3 + hash2(i, 6, 88)) +
            5 * Math.sin(x * 0.05 - age / 260) +
            Math.sin(s * 7 + i) * 1.5 +
            Math.max(0, s - 1.8) ** 2 * 6
        );
        const [c, cs] = cols[i % cols.length]!;
        const tum = Math.floor(age / 100 + i) % 4;
        if (tum === 0) {
          f.set(x, y, c!);
          f.set(x + 1, y, c!);
          f.set(x, y + 1, cs!);
          f.set(x + 1, y + 1, c!);
        } else if (tum === 1) {
          f.set(x - 1, y, cs!);
          f.set(x, y, c!);
          f.set(x + 1, y, c!);
        } else if (tum === 2) {
          f.set(x, y - 1, c!);
          f.set(x, y, c!);
          f.set(x + 1, y, cs!);
        } else {
          f.set(x, y, c!);
          f.set(x + 1, y + 1, cs!);
        }
      }
    }
    /** Streaks of wind blowing out from the ridge. */
    function drawWind(f: Frame, t: number) {
      const age = t - roarAt;
      if (!(age >= 200) || age >= ROAR_LEN) return;
      const n = Math.round(w / 8);
      for (let i = 0; i < n; i++) {
        const y = 12 + Math.floor(hash2(i, 1, 57) * 124);
        const dir = hash2(i, 4, 57) < 0.8 ? -1 : 1;
        const period = 700 + hash2(i, 2, 57) * 600;
        const local = (age + hash2(i, 3, 57) * period) % period;
        const x = hx + dir * (local / period) * (w * 0.9);
        const g = gust(x, t);
        if (g < 0.25) continue;
        const len = Math.round((6 + hash2(i, 5, 57) * 12) * g);
        for (let k = 0; k < len; k++)
          f.blend(x - dir * k, y, P.foam, 0.6 * g * (1 - k / len));
      }
    }
    /** A parasol blown inside out by the gust, until it pops back. */
    function drawParasolFlip(f: Frame, t: number) {
      const age = t - roarAt;
      if (!(age >= 0) || age >= ROAR_LEN) return;
      for (const p of parasols) {
        if (gust(p.x, t) < 0.5) continue;
        const x = p.x;
        const top = 141 - 19;
        // back to bare sand where the dome was
        for (let yy = top - 1; yy <= top + 6; yy++)
          for (let dx = -9; dx <= 9; dx++) {
            if (x + dx < 0 || x + dx >= w) continue;
            const i = yy * w + x + dx;
            f.pixels[i] = sand.pixels[i]!;
          }
        // the canopy cupped up the wrong way, flapping on its pole
        const flap = Math.round(Math.sin(age / 60 + x));
        const lift = 3 + flap;
        f.vline(x, top - lift - 2, 141 - 14, P.pole);
        for (let dy = 0; dy < 6; dy++) {
          const half = [9, 9, 8, 6, 4, 2][dy]!;
          const yy = top - lift - 4 + dy;
          const skew = Math.round(-dy * 0.4 * (1 + flap * 0.5));
          for (let dx = -half; dx <= half; dx++) {
            const seg = Math.floor(((dx / half) * 2.5 + 2.5) % 2);
            const inside = dy > 0 && dx / half < 0.5;
            const c = seg ? (inside ? p.aSh : p.a) : inside ? p.bSh : p.b;
            f.set(x + dx + skew, yy, c);
          }
        }
        for (let dx = -9; dx <= 9; dx += 2)
          f.set(x + dx, top - lift - 5, p.aSh);
      }
    }
    /** Whitecaps whipped up on the lagoon as the gust goes over. */
    function drawGustWater(f: Frame, t: number) {
      const age = t - roarAt;
      if (!(age >= 0) || age >= ROAR_LEN) return;
      const n = Math.round(w / 1.5);
      for (let i = 0; i < n; i++) {
        const y = REEF + 2 + Math.floor(hash2(i, 1, 66) * (SHORE - REEF - 4));
        const x0 = hash2(i, 2, 66) * w;
        const g = gust(x0, t);
        if (g < 0.15) continue;
        if (Math.sin(age / 160 + i * 1.7) < 0.8 - g) continue;
        const x = Math.round(x0 + Math.sign(x0 - hx) * (age / 1000) * 14);
        const len = 1 + Math.round(g * 2 * hash2(i, 3, 66));
        for (let k = 0; k <= len; k++)
          if (inWater(x + k, y))
            f.set(x + k, y, k === len ? P.foamShade : P.foam);
      }
    }
    /** The roar itself: rings of sound bursting out over the whole bay. */
    function drawRoar(f: Frame, t: number) {
      const age = t - roarAt;
      if (!(age >= 0) || age >= 1900) return;
      const cy = RIDGE - 14;
      const RR = Math.min(160, w * 0.6);
      for (let k = 0; k < 3; k++) {
        const a = age - k * 230;
        if (a < 0 || a > 1300) continue;
        const p = a / 1300;
        const r = 9 + (1 - (1 - p) ** 2) * RR;
        const alpha = Math.pow(1 - p, 0.7);
        const steps = Math.ceil(r * 6.5);
        for (let i = 0; i < steps; i++) {
          const ang = (i / steps) * Math.PI * 2;
          const c = Math.cos(ang);
          const sn = Math.sin(ang);
          f.blend(hx + c * (r + 1), cy + sn * (r + 1), P.roar, alpha * 0.45);
          f.blend(hx + c * r, cy + sn * r, P.foam, alpha * 0.95);
          f.blend(hx + c * (r - 1), cy + sn * (r - 1), P.roar, alpha * 0.8);
          f.blend(hx + c * (r - 2), cy + sn * (r - 2), P.roar, alpha * 0.35);
        }
      }
    }

    // ---------- hit areas ----------
    const shisaHit = (x: number, y: number) =>
      Math.abs(x - hx) <= 8 && y >= RIDGE - 17 && y <= RIDGE - 1;
    const palmHit = (x: number, y: number) =>
      [...fgPalms, ...bgPalms].find((p) => {
        const c = crown(p);
        const r = p.h * 0.3;
        return Math.abs(x - c.x) < r && y > c.y - 8 && y < c.y + r * 0.6;
      });
    // (round the turtle, the egg spot's circle counts too)
    const TURTLE_R = 7;
    const turtleSpot = (t: number) => {
      const p = turtlePos(t);
      return { x: Math.round(p.x), y: Math.round(p.y) };
    };
    const turtleHit = (x: number, y: number, t = lastT) => {
      const p = turtlePos(t);
      return Math.abs(x - p.x) <= 7 && Math.abs(y - p.y) <= 6;
    };
    const flowerHit = (x: number, y: number) =>
      flowers.some((r) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1);
    const houseHit = (x: number, y: number) =>
      Math.abs(x - hx) <= 30 && y >= RIDGE && y <= WALL_B;
    const onWall = (x: number, y: number) =>
      x >= hx - 38 && y >= WALL_TOP - 1 && y < WALL_B;
    // the trees only come down to the top of the beach
    const onTrees = (x: number, y: number) => inVeg(x, y) && y < SHORE + 6;

    // the eggs, playing or not; a click this close sets one off (a finger
    // gets the same slack the viewer gives it)
    const SLACK = 6;
    const spots = (t: number) => [
      // the shisa on the ridge
      { id: 'shisa', x: hx, y: RIDGE - 9, r: 8 },
      // the snorkel poking out of the lagoon
      { id: 'snorkel', x: tubeX, y: SY - 3, r: TUBE_R },
      // the turtle, wherever it's got to in the shallows
      { id: 'turtle', ...turtleSpot(t), r: TURTLE_R },
    ];
    const playing = (id: string, t: number) => {
      const since =
        id === 'shisa'
          ? t - roarAt
          : id === 'snorkel'
            ? t - snorkelAt
            : t - surfAt;
      const len =
        id === 'shisa' ? ROAR_LEN : id === 'snorkel' ? SNORKEL_LEN : TURTLE_LEN;
      return since >= 0 && since < len;
    };
    function start(id: string, t: number) {
      if (playing(id, t)) return; // never restart one mid-way
      if (id === 'shisa') {
        if (Number.isFinite(roarAt)) cloudsBlown += CLOUD_PUSH;
        roarAt = t;
        sparkle(fx, t, hx, RIDGE - 30, P.roar);
        flock(fx, t + 120, hx + 22, RIDGE - 14, P.egret, {
          count: 5,
          seed: Math.floor(t) % 997,
          dir: 1,
        });
        flock(fx, t + 300, vegL + 24, 76, P.egret, {
          count: 4,
          seed: (Math.floor(t) + 5) % 997,
          dir: -1,
        });
      } else if (id === 'snorkel') snorkelAt = t;
      else {
        swimLag += lagOf(t - surfAt);
        surfAt = t;
      }
    }

    const L = {
      clouds: runsOf(cloudLayer),
      sea: runsOf(sea),
      sand: runsOf(sand),
      props: runsOf(props),
      land: runsOf(land),
      fg: runsOf(foreground),
    };

    return {
      render(f, t, pointer) {
        lastT = t;
        f.copyFrom(sky);
        blit(f, cloudLayer, L.clouds, t / 1400 - cloudShift(t));
        drawTerns(f, t);
        blit(f, sea, L.sea);
        drawFerry(f, t);
        // the reef: surf breaking in a ragged white line, rolling along
        for (let x = 0; x < w; x++) {
          const n = fbm1(x / 8 - t / 2600, 12, 3);
          const m = fbm1(x / 5 + t / 1900, 13, 2);
          if (n > 0.4) f.set(x, REEF, P.foam);
          else if (n > 0.32) f.set(x, REEF, P.foamShade);
          if (n > 0.56) f.set(x, REEF - 1, P.foam);
          if (m > 0.62) f.set(x, REEF + 1, P.foamShade);
        }
        // glitter on the open sea and down the lagoon under the sun
        for (let i = 0; i < w / 14; i++) {
          const x = Math.floor(hash2(i, 0, 3) * w);
          const y =
            HORIZON + 2 + Math.floor(hash2(i, 1, 3) * (REEF - HORIZON - 3));
          if (Math.sin(t / 420 + i * 2.7) > 0.6)
            f.hline(x, x + (i % 2), y, P.glint);
        }
        for (let y = REEF + 3; y < SHORE - 8; y += 2) {
          const spread = 4 + (y - REEF) * 0.3;
          for (let k = 0; k < 2; k++) {
            const ph = hash2(k, y, 77);
            if (Math.sin(t / 360 + ph * 30) < 0.55) continue;
            const x = Math.round(
              sunX + 10 + (hash2(k, y, 78) - 0.5) * 2 * spread
            );
            if (inWater(x, y)) f.hline(x, x + 1, y, P.glint);
          }
        }
        drawFish(f, t);
        drawReveal(f, t);
        drawGustWater(f, t);
        drawSabani(f, t);
        // foam around the foot of the notch rock
        for (let k = -5; k <= 6; k++)
          if (Math.sin(t / 500 + k * 1.3) > -0.2)
            f.set(
              rockX + k,
              ROCK_B + 1,
              k < -3 || k > 4 ? P.foamShade : P.foam
            );
        drawTurtle(f, t);
        drawTube(f, t);
        // caustics: a moving net of light over the sand in the shallows
        for (let y = SHORE - 16; y < SHORE + 4; y++) {
          for (let x = 0; x < Math.min(w, vegL); x++) {
            if (y >= shore(x)) continue;
            const c =
              Math.sin(x * 0.55 + t / 700 + Math.sin(y * 1.1 + t / 900) * 2.2) +
              Math.sin(
                x * 0.31 - t / 1100 + y * 0.9 + Math.sin(x * 0.2 + t / 1300)
              );
            if (c > 1.55)
              f.blend(x, y, P.glint, 0.3 + (y - SHORE + 16) * 0.015);
          }
        }
        blit(f, sand, L.sand);
        drawSwash(f, t);
        drawWaders(f, t);
        blit(f, props, L.props);
        drawParasolFlip(f, t);
        drawKid(f, t);
        for (const p of bgPalms)
          palm(
            f,
            p.x,
            p.base,
            p.h,
            p.lean + bend(p, t),
            TROPIC,
            t,
            p.seed,
            BARK
          );
        fxBack.draw(f, t);
        blit(f, land, L.land);
        // the shisa keeps watch; poked, it swells up to twice its size and roars
        const age = t - roarAt;
        const roaring = age >= 0 && age < 1700;
        const idle = Math.sin(t / 2300);
        const look = pointer
          ? Math.sign(pointer.x - hx)
          : idle > 0.6
            ? 1
            : idle < -0.6
              ? -1
              : 0;
        const shake =
          roaring && age < 700 ? (Math.floor(age / 60) % 2 ? 1 : -1) : 0;
        const sc = !roaring ? 1 : age < 90 || age > 1580 ? 1.5 : 2;
        drawShisa(f, hx, RIDGE - 3, look, roaring, shake, sc);
        if (roaring && age < 1300) {
          // the roar: short strokes bursting out either side of the head, in pulses
          const r = 1 + (Math.floor(age / 70) % 5);
          const my = RIDGE - 2 - 6 * sc;
          for (const [dx, dy] of [
            [-1, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [1, 1],
          ] as const) {
            for (let k = 0; k < 3; k++) {
              const x = hx + dx * (7 * sc + 1 + r + k);
              const y = my + dy * (2 + Math.round((r + k) * 0.6)) * sc;
              f.set(x, y, k ? P.roar : P.mortar);
            }
          }
        }
        for (const p of fgPalms)
          palm(
            f,
            p.x,
            p.base,
            p.h,
            p.lean + bend(p, t),
            TROPIC,
            t,
            p.seed,
            BARK
          );
        blit(f, foreground, L.fg);
        drawWind(f, t);
        drawPetals(f, t);
        drawRoar(f, t);
        drawBreath(f, t);
        fx.draw(f, t);
      },
      poke(x, y, t) {
        const seed = Math.floor(t) % 997;
        const egg = spots(t).find(
          (e) => Math.hypot(x - e.x, y - e.y) <= e.r + SLACK
        );
        if (egg) {
          start(egg.id, t);
          return;
        }
        if (shisaHit(x, y)) {
          start('shisa', t);
          return;
        }
        // (the turtle before the palms: on a phone it swims under the fronds)
        if (turtleHit(x, y, t)) {
          start('turtle', t);
          return;
        }
        const p = palmHit(x, y);
        if (p) {
          // one coconut at a time from each palm
          if (t >= (coconutUntil.get(p) ?? -Infinity)) coconut(t, p, seed);
          return;
        }
        if (flowerHit(x, y)) {
          butterflies(t, x, y, seed);
          return;
        }
        if (inWater(x, y)) {
          if (t >= fishUntil) flyingFish(t, x, y, seed);
          return;
        }
        if (y <= HORIZON) {
          if (t >= ternUntil) dive(t, x, y, seed);
          return;
        }
        if (houseHit(x, y) || onWall(x, y)) return;
        if (onTrees(x, y)) {
          flock(fx, t, x, y, P.egret, { count: 4, seed });
          return;
        }
        if (y > shore(x)) hermitCrab(t, x, y, seed);
      },
      hot(x, y) {
        if (shisaHit(x, y) || palmHit(x, y) || flowerHit(x, y)) return true;
        if (spots(lastT).some((e) => Math.hypot(x - e.x, y - e.y) <= e.r))
          return true;
        return !houseHit(x, y) && !onWall(x, y);
      },
      eggs(t) {
        // each one is listed all the time, except while it's playing
        return spots(t).filter((e) => !playing(e.id, t));
      },
    };
  },
};
