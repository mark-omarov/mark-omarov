// Fukuoka at night: the yatai along the Naka River at Nakasu. Up close, a
// wooden food stall glows under its red lanterns: customers' backs on the
// bench, the cook shaking noodles over a steaming pot of tonkotsu, beer
// crates stacked outside. Across the river the Nakasu buildings are hung with
// neon from top to bottom, all of it shivering in the water. A willow sways,
// a river boat drifts by, and planes come in low for the airport.
//
// A couple sit at the big stall, either side of the empty place.
//
// Click a stall for a burst of steam, a customer for a kanpai, a neon sign
// to flicker it, the river for a ripple, the sky for a plane. And two eggs:
// the cook at the big stall takes kaedama orders, and the box of sea
// urchins on the crates beside it has one that's very fresh indeed.

import { type Frame, lerpRGB, type RGB, sprite } from '../frame';
import { Fx, sparkle, splash } from '../fx';
import { hash2 } from '../noise';
import { glow, gradient, stars } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';

const P = palette({
  sky0: '#0b0820',
  sky1: '#110c2c',
  sky2: '#1a1038',
  sky3: '#251444',
  sky4: '#341850',
  sky5: '#481c5a',
  skyGlow: '#6c2462',
  star: '#9886c8',
  starHi: '#f0e8ff',
  // Nakasu, across the river
  bldA: '#1d1534',
  bldAEdge: '#2c2148',
  bldADark: '#140f28',
  bldB: '#251a3e',
  bldBEdge: '#36285a',
  bldBDark: '#1a122e',
  win: '#ffcf7a',
  winWarmDim: '#c88a58',
  win2: '#ffe6b0',
  winPink: '#ff9ad0',
  winCyan: '#9ae6ff',
  winDim: '#3a2c58',
  signDark: '#0e0a1c',
  boxWhite: '#f4f0e8',
  boxInk: '#2a1a2a',
  neonPink: '#ff4fa3',
  neonCyan: '#46e6ff',
  neonYellow: '#ffe14d',
  neonRed: '#ff4a3d',
  neonGreen: '#5dff8a',
  neonViolet: '#b06aff',
  neonOrange: '#ff9a3a',
  neonWhite: '#fff4f8',
  // the river and its banks
  stone: '#4a3c5e',
  stoneHi: '#6a5882',
  stoneDark: '#2e2440',
  river0: '#1c1238',
  river1: '#160e2e',
  river2: '#110a26',
  riverHi: '#7a64b0',
  // the walkway
  pave: '#2a2240',
  paveHi: '#382e52',
  paveLine: '#1f1932',
  paveLit: '#4c3446',
  paveLitHi: '#6a4648',
  paveLitLine: '#3c283a',
  rail: '#120e20',
  railHi: '#40365e',
  // the yatai
  roof: '#2c2034',
  roofHi: '#4c3a52',
  fascia: '#5a2a22',
  wood: '#8a5634',
  woodHi: '#b4783e',
  woodDark: '#5a3422',
  woodDeep: '#36201a',
  noren: '#24336e',
  norenHi: '#3a4e9e',
  norenRed: '#a42a30',
  norenRedHi: '#cc4440',
  norenInk: '#f4ecdc',
  inside: '#ffbe68',
  insideHi: '#ffdc98',
  insideLow: '#de8442',
  bulb: '#fffae6',
  menu: '#fff2d8',
  menuInk: '#7a2a20',
  bottleA: '#3e8a4a',
  bottleB: '#9a5420',
  bottleC: '#e8e0d0',
  pot: '#b8bccc',
  potHi: '#eef0f6',
  potDark: '#6a6e80',
  grill: '#2a1a1a',
  coal: '#ff7a2a',
  cookShirt: '#f2eee6',
  cookShade: '#c4bab0',
  apron: '#2a3256',
  skin: '#e2a272',
  skinShade: '#b47450',
  hair: '#1a1418',
  beer: '#ffc23a',
  foam: '#fff8e8',
  glassRim: '#fff0c0',
  bowl: '#f0e8e0',
  noodle: '#e8c46a',
  noodleHi: '#fffae8',
  noodleDark: '#9a6a30',
  lantern: '#e8402e',
  lanternHi: '#ffa070',
  lanternDark: '#8a1e1e',
  lanternCap: '#1e1418',
  lanternInk: '#3a0e0e',
  glowWarm: '#ff9a4a',
  steam: '#fff8f6',
  steam2: '#d8c8dc',
  roofSign: '#fff4e0',
  roofSignInk: '#c42a2a',
  // customers
  suit: '#262a3c',
  shirtW: '#e8e4dc',
  jacketRed: '#8a2a2a',
  cardigan: '#c8a07a',
  hoodie: '#3a5a4a',
  hoodieHood: '#2c4638',
  denim: '#2c3c5e',
  hairDark: '#16101a',
  hairBlack: '#0c080e',
  coatPink: '#c86a8a',
  hairBrown: '#4a2a22',
  hairGrey: '#8a8490',
  trouser: '#1c1a26',
  shoe: '#100c14',
  rim: '#ffb468',
  // things on the walkway
  crate: '#e8b820',
  crateHi: '#fff070',
  crateDark: '#9a7410',
  crateRed: '#c83030',
  crateRedHi: '#ee5a4a',
  crateRedDark: '#801c22',
  propane: '#8a8ea0',
  propaneHi: '#c4c8d4',
  bucket: '#3a6ab0',
  willow: '#285a3c',
  willowHi: '#5a9658',
  willowDark: '#17362a',
  towerA: '#2a3a7a',
  towerB: '#5a7ad8',
  towerHi: '#c8dcff',
  bark: '#22181e',
  lamp: '#ffe2a0',
  lampPost: '#1a1424',
  walker: '#0e0a18',
  walkerRim: '#4a3a62',
  plane: '#3a3450',
  planeHi: '#8a84a8',
  planeLight: '#ffffff',
  navRed: '#ff3a3a',
  navGreen: '#3aff8a',
  boat: '#1e1624',
  boatHi: '#4a3644',
  // the sea urchins, just off the boat
  urchin: '#1c0e24',
  urchinMid: '#2e1838',
  urchinHi: '#4a2a5a',
  spine: '#6c3e8c',
  spineTip: '#c49ae6',
  spineRim: '#8ae0ec',
  shell: '#8a7258',
  shellHi: '#c4a47a',
  cavity: '#2a1008',
  uni: '#ff9a1a',
  uniHi: '#ffc443',
  uniGlint: '#fff4c0',
  uniShade: '#c8580c',
  sea: '#38c4dc',
  seaDrop: '#b8f2ff',
  hako: '#c89a62',
  hakoHi: '#ecc894',
  hakoDark: '#7a5230',
  kombu: '#2e4a2a',
  ice: '#d8f6ff',
  blade: '#cfd4e2',
  bladeEdge: '#ffffff',
  bladeBack: '#6e7286',
  handle: '#3a2418',
  bowlBand: '#b02a26',
  puddle: '#2c3458',
  // the couple at the big stall: his short light-brown hair, in the shadow
  // of his own head with the stall light in front of him
  manHair: '#5e4630',
  manHoodie: '#1f2029',
  manHood: '#121219',
  womanHair: '#17121a',
  womanSweater: '#5a524c',
  puddleHi: '#7a8ac0',
});

const FAR = 89; // the Nakasu buildings stand here
const RIVER = 93; // water begins below the far embankment
const EDGE = 116; // our side of the river
const WALK = 119; // the walkway starts

const NEON: RGB[] = [
  P.neonPink,
  P.neonCyan,
  P.neonYellow,
  P.neonRed,
  P.neonGreen,
  P.neonViolet,
  P.neonOrange,
  P.neonWhite,
];

// 3x3 glyphs that read as kanji/kana at this size
const GLYPHS = [
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1],
  [0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 1, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 0, 1, 1],
];
// 5x5 for the noren and the roof signs
const KANJI = [
  ['..#..', '#####', '#.#.#', '#####', '..#..'],
  ['..#..', '#####', '..#..', '.#.#.', '#...#'],
  ['#####', '#.#.#', '#####', '#.#.#', '#####'],
  ['..#..', '#####', '.###.', '#.#.#', '..#..'],
  ['####.', '.....', '#####', '...#.', '..#..'],
  ['.#.#.', '#####', '.#.#.', '#####', '.#.#.'],
];

function glyph(f: Frame, x: number, y: number, c: RGB, seed: number) {
  const g = GLYPHS[Math.floor(hash2(seed, 7, 5) * GLYPHS.length)]!;
  for (let i = 0; i < 9; i++)
    if (g[i]) f.set(x + (i % 3), y + Math.floor(i / 3), c);
}

function kanji(f: Frame, x: number, y: number, c: RGB, seed: number) {
  const g = KANJI[Math.floor(hash2(seed, 3, 17) * KANJI.length)]!;
  sprite(
    f,
    g.map((r) => r.replaceAll('#', 'x')),
    x,
    y,
    { x: c }
  );
}

// customers from behind, sitting on the bench (head top to seat)
type Look = { rows: string[]; pal: Record<string, RGB> };
const LOOKS: Look[] = [
  {
    // salaryman, dark suit, white collar
    rows: [
      '..hhh..',
      '.hhhhh.',
      '.hhhhh.',
      '.shhhs.',
      '..www..',
      '.ccccc.',
      'ccccccc',
      'ccccccc',
      'ccccccc',
      'ccccccc',
      '.ccccc.',
      '.ccccc.',
      '.ccccc.',
      'ccccccc',
    ],
    pal: { h: P.hairDark, s: P.skinShade, w: P.shirtW, c: P.suit },
  },
  {
    // long hair over a camel cardigan
    rows: [
      '..hhh..',
      '.hhhhh.',
      '.hhhhh.',
      '.hhhhh.',
      'hhhhhhh',
      'chhhhhc',
      'chhhhhc',
      'cchhhcc',
      'ccccccc',
      '.ccccc.',
      '.ccccc.',
      '.ccccc.',
      'ccccccc',
    ],
    pal: { h: P.hairBrown, c: P.cardigan },
  },
  {
    // grey hair, red jacket
    rows: [
      '..hhh..',
      '.hhhhh.',
      '.hsssh.',
      '.shhhs.',
      '..sss..',
      '.ccccc.',
      'ccccccc',
      'ccccccc',
      'ccccccc',
      'ccccccc',
      '.ccccc.',
      '.ccccc.',
      '.ccccc.',
      'ccccccc',
    ],
    pal: { h: P.hairGrey, s: P.skinShade, c: P.jacketRed },
  },
  {
    // hoodie, hood down
    rows: [
      '..hhh..',
      '.hhhhh.',
      '.hhhhh.',
      '.shhhs.',
      '.ccccc.',
      'cc...cc',
      'ccccccc',
      'ccccccc',
      'ccccccc',
      'ccccccc',
      '.ccccc.',
      '.ccccc.',
      '.ccccc.',
      'ccccccc',
    ],
    pal: { h: P.hairDark, s: P.skinShade, c: P.hoodie },
  },
  {
    // denim jacket, short hair
    rows: [
      '.hhhh..',
      '.hhhhh.',
      '.hhhhh.',
      '.shhhs.',
      '..sss..',
      '.ccccc.',
      'ccccccc',
      'ccccccc',
      'ccccccc',
      'ccccccc',
      '.ccccc.',
      '.ccccc.',
      '.ccccc.',
      'ccccccc',
    ],
    pal: { h: P.hairBrown, s: P.skinShade, c: P.denim },
  },
];
// up close: 9 wide, head to seat
const LOOKS_XL: Look[] = [
  {
    rows: [
      '...hhh...',
      '..hhhhh..',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.shhhhhs.',
      '..hhhhh..',
      '...sss...',
      '..wwwww..',
      '.ccccccc.',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      '.ccccccc.',
      '.cccvccc.',
      '.cccvccc.',
      '.cccvccc.',
      'ccccvcccc',
    ],
    pal: {
      h: P.hairDark,
      s: P.skinShade,
      w: P.shirtW,
      c: P.suit,
      v: P.trouser,
    },
  },
  {
    rows: [
      '...hhh...',
      '..hhhhh..',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.hhhhhhh.',
      'hhhhhhhhh',
      'chhhhhhhc',
      'chhhhhhhc',
      'cchhhhhcc',
      'cchhhhhcc',
      'ccchhhccc',
      'ccccccccc',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      'ccccccccc',
    ],
    pal: { h: P.hairBrown, c: P.cardigan },
  },
  {
    rows: [
      '...sss...',
      '..sssss..',
      '.hsssssh.',
      '.hhssshh.',
      '.shhhhhs.',
      '..hhhhh..',
      '...sss...',
      '..ccccc..',
      '.ccccccc.',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      'ccccccccc',
    ],
    pal: { h: P.hairGrey, s: P.skinShade, c: P.jacketRed },
  },
  {
    rows: [
      '...hhh...',
      '..hhhhh..',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.shhhhhs.',
      '..hhhhh..',
      '.kkkkkkk.',
      'ckkkkkkkc',
      'cckkkkkcc',
      'ccckkkccc',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      'ccccccccc',
    ],
    pal: { h: P.hairDark, s: P.skinShade, c: P.hoodie, k: P.hoodieHood },
  },
  {
    rows: [
      '....hh...',
      '...hhhh..',
      '...hhhh..',
      '..hhhhh..',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.shhhhhs.',
      '...sss...',
      '..ccccc..',
      '.xxxxxxx.',
      'ccccccccc',
      'xxxxxxxxx',
      'ccccccccc',
      'xxxxxxxxx',
      '.ccccccc.',
      '.xxxxxxx.',
      '.ccccccc.',
      '.ccccccc.',
      'ccccccccc',
    ],
    pal: { h: P.hairDark, s: P.skinShade, c: P.shirtW, x: P.denim },
  },
  {
    rows: [
      '...hhh...',
      '..hhhhh..',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '..hhhhh..',
      '..ccccc..',
      '.ccccccc.',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      'ccccccccc',
    ],
    pal: { h: P.hairBlack, c: P.coatPink },
  },
];
// how many of LOOKS_XL go to strangers: the last two are the couple
const XL_STRANGERS = LOOKS_XL.length;
LOOKS_XL.push(
  {
    // the man: short light-brown hair, a little messy on top, and a dark
    // hoodie with the hood down
    rows: [
      '...hhhh..',
      '..hhhhh..',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.shhhhhs.',
      '..hhhhh..',
      '...sss...',
      '.kkkkkkk.',
      'ckkkkkkkc',
      'cckkkkkcc',
      'ccckkkccc',
      'ccccccccc',
      'ccccccccc',
      'ccccccccc',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
      'ccccccccc',
    ],
    pal: {
      h: P.manHair,
      s: P.skinShade,
      c: P.manHoodie,
      k: P.manHood,
    },
  },
  {
    // the woman: long, straight, near-black hair over a soft grey-brown
    // sweater; slim
    rows: [
      '...hhh...',
      '..hhhhh..',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.hhhhhhh.',
      '.hhhhhhh.',
      'chhhhhhhc',
      'chhhhhhhc',
      'cchhhhhcc',
      '.chhhhhc.',
      '.cchhhcc.',
      '.ccccccc.',
      '.ccccccc.',
      '..ccccc..',
      '..ccccc..',
      '.ccccccc.',
      '.ccccccc.',
      '.ccccccc.',
    ],
    pal: { h: P.womanHair, c: P.womanSweater },
  }
);
const LOOKS_SMALL = [
  [
    '.hhh.',
    '.hhh.',
    '.shs.',
    'ccccc',
    'ccccc',
    'ccccc',
    'ccccc',
    '.ccc.',
    'ccccc',
  ],
  [
    '.hhh.',
    'hhhhh',
    'hhhhh',
    'chhhc',
    'ccccc',
    'ccccc',
    '.ccc.',
    '.ccc.',
    'ccccc',
  ],
];

/** Smoothstep, clamped to 0..1. */
const ease = (p: number) => (p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p));

// a sea urchin's spines: where each sticks out, how long, how it sways
const SPINES = Array.from({ length: 80 }, (_, i) => ({
  a: ((i + (hash2(i, 1, 71) - 0.5) * 0.5) / 80) * Math.PI * 2,
  len: 0.65 + hash2(i, 2, 71) * 0.5,
  ph: hash2(i, 3, 71) * Math.PI * 2,
}));

/** Draws a figure and lights its outline with the warm glow of the stall in front of it. */
function backlit(
  f: Frame,
  rows: readonly string[],
  pal: Record<string, RGB>,
  x: number,
  y: number,
  rim: RGB,
  amount: number
) {
  const at = (rx: number, ry: number) => {
    const c = rows[ry]?.[rx];
    return c !== undefined && c !== '.';
  };
  for (let ry = 0; ry < rows.length; ry++)
    for (let rx = 0; rx < rows[ry]!.length; rx++) {
      if (!at(rx, ry)) continue;
      const base = pal[rows[ry]![rx]!]!;
      const edge = !at(rx, ry - 1) || !at(rx - 1, ry) || !at(rx + 1, ry);
      f.set(x + rx, y + ry, edge ? lerpRGB(base, rim, amount) : base);
    }
}

type Seat = { x: number; look: number; top: number };
type Stall = {
  x: number;
  g: number;
  ppm: number; // pixels per metre at this depth
  tier: 0 | 1 | 2; // far, middling, up close
  w: number;
  seed: number;
  roofTop: number;
  norenTop: number;
  norenBot: number;
  counter: number;
  bench: number;
  potX: number;
  cookX: number;
  seats: Seat[];
  gapX: number; // the empty place on the bench
  red: boolean;
};

export const fukuoka: Scene = {
  id: 'fukuoka',
  name: 'Fukuoka',
  country: 'Japan',
  create(w, h) {
    const cx = Math.round(w / 2);
    const fx = new Fx();
    const riverFx = new Fx();

    // ---------- the stalls ----------
    const makeStall = (
      x: number,
      g: number,
      ppm: number,
      seed: number,
      red: boolean
    ): Stall => {
      const u = (m: number) => Math.round(m * ppm);
      const sw = Math.round(5.1 * ppm);
      const tier = ppm >= 20 ? 2 : ppm >= 16 ? 1 : 0;
      const roofTop = g - u(2.55);
      const st: Stall = {
        x,
        g,
        ppm,
        tier,
        w: sw,
        seed,
        roofTop,
        norenTop: roofTop + 3,
        norenBot: g - u(1.92),
        counter: g - u(1.0),
        bench: g - u(0.45),
        potX: x + sw - u(1.15),
        cookX: x + Math.round(sw * 0.47),
        seats: [],
        gapX: 0,
        red,
      };
      const spacing = u(tier === 2 ? 0.6 : 0.7);
      const sprW = tier === 2 ? 9 : tier === 1 ? 7 : 5;
      const n = Math.floor((sw - 12) / spacing);
      const pad = Math.round((sw - (n - 1) * spacing - sprW) / 2);
      const looks =
        tier === 2
          ? XL_STRANGERS
          : tier === 1
            ? LOOKS.length
            : LOOKS_SMALL.length;
      const gap = 1 + Math.floor(hash2(seed, 1, 5) * (n - 2));
      st.gapX = x + pad + gap * spacing;
      for (let k = 0, j = 0; k < n; k++) {
        if (k === gap) continue;
        const look = (j++ + Math.floor(hash2(seed, 0, 6) * looks)) % looks;
        const rows =
          tier === 2
            ? LOOKS_XL[look]!.rows.length
            : tier === 1
              ? LOOKS[look]!.rows.length
              : LOOKS_SMALL[look]!.length;
        st.seats.push({ x: x + pad + k * spacing, look, top: st.bench - rows });
      }
      return st;
    };
    const nearPpm = w < 300 ? 21 : 24;
    const nearW = Math.round(5.1 * nearPpm);
    const bigX =
      cx - Math.round(nearW / 2) - Math.round(Math.min(52, w * 0.12));
    const stalls: Stall[] = [];
    const far2 = bigX + nearW + Math.round(Math.min(70, w * 0.16));
    stalls.push(makeStall(far2, 132, 13, 2, true));
    // the row carries on both ways as far as the screen goes
    for (let x = bigX - 82, k = 0; x + 66 > 4; x -= 100, k++)
      stalls.push(makeStall(x, 132, 13, 3 + k * 2, k % 2 === 1));
    for (let x = far2 + 100, k = 0; x + 50 < w + 30; x += 100, k++)
      stalls.push(makeStall(x, 132, 13, 4 + k * 2, k % 2 === 1));
    const main = makeStall(bigX, 147, nearPpm, 1, false);
    stalls.push(main);
    // the couple have the places either side of the empty one
    {
      const left = main.seats.filter((s) => s.x < main.gapX).at(-1)!;
      const right = main.seats.find((s) => s.x > main.gapX)!;
      for (const [seat, look] of [
        [left, XL_STRANGERS],
        [right, XL_STRANGERS + 1],
      ] as const) {
        seat.look = look;
        seat.top = main.bench - LOOKS_XL[look]!.rows.length;
      }
    }
    const willowX = Math.round((bigX + nearW + far2) / 2) + 2;
    const crown: { x: number; y: number; c: RGB; v: number }[] = [];
    const strands: {
      x: number;
      y: number;
      len: number;
      ph: number;
      c: RGB;
      tip: RGB;
    }[] = [];
    {
      const domes = [
        { x: willowX - 9, y: 64, rx: 13, ry: 8 },
        { x: willowX + 5, y: 66, rx: 11, ry: 7 },
        { x: willowX - 20, y: 70, rx: 9, ry: 6 },
        { x: willowX + 14, y: 72, rx: 8, ry: 5 },
        { x: willowX - 3, y: 71, rx: 12, ry: 6 },
        { x: willowX - 14, y: 60, rx: 6, ry: 4 },
        { x: willowX + 1, y: 59, rx: 5, ry: 4 },
      ];
      const inside = (x: number, y: number) =>
        domes.some(
          (d) => ((x - d.x) / d.rx) ** 2 + ((y - d.y) / d.ry) ** 2 <= 1
        );
      const bottom = new Map<number, number>();
      for (let y = 50; y < 82; y++)
        for (let x = willowX - 32; x < willowX + 26; x++) {
          if (!inside(x, y)) continue;
          bottom.set(x, Math.max(bottom.get(x) ?? 0, y));
          const lit = !inside(x - 2, y - 2);
          const shade = !inside(x + 2, y + 2);
          // drooping leaf strokes: short vertical dashes, not noise
          const stroke = hash2(x, Math.floor(y / 3), 35) > 0.72;
          const c = lit
            ? P.willowHi
            : shade
              ? P.willowDark
              : stroke
                ? x < willowX - 6
                  ? P.willowHi
                  : P.willowDark
                : P.willow;
          crown.push({ x, y, c, v: (82 - y) / 32 });
        }
      for (const [x, by] of bottom) {
        if (hash2(x, 1, 36) < 0.25) continue;
        const len =
          6 +
          Math.round(
            hash2(x, 2, 36) * 24 * (1 - Math.abs(x - willowX + 3) / 40)
          );
        strands.push({
          x,
          y: by - 2,
          len,
          ph: hash2(x, 3, 36) * 6,
          c: x < willowX - 8 ? P.willow : P.willowDark,
          tip: P.willowHi,
        });
      }
    }

    // ---------- Nakasu across the river ----------
    type Sign = {
      x: number;
      y: number;
      len: number;
      c: number;
      seed: number;
      kind: 'tate' | 'board';
    };
    const signs: Sign[] = [];
    let bowl = { x: 0, y: 0 };
    // which pixels of the backdrop are open sky (for things behind the buildings)
    const skyMask = new Uint8Array(w * h);
    const towerX = Math.round(cx - Math.min(150, w * 0.3));
    const base = layer(w, h, (f) => {
      gradient(f, 0, FAR, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.skyGlow,
      ]);
      f.rect(0, FAR, w, h - FAR, P.skyGlow);
      stars(
        f,
        19,
        Math.round(w / 14),
        34,
        0,
        [P.star, P.star, P.starHi],
        false
      );
      for (let y = 0; y < FAR; y++)
        for (let x = 0; x < w; x++) skyMask[y * w + x] = 1;

      // the buildings: narrow, tall, hung with signs
      let i = 0;
      const bowlAt = cx + Math.round(Math.min(30, w * 0.08));
      for (let x = -Math.round(hash2(0, 0, 7) * 10); x < w + 4; i++) {
        const r = (k: number) => hash2(i, k, 23);
        const bw = 13 + Math.round(r(1) * 16);
        const isBowl = x <= bowlAt && x + bw > bowlAt;
        const bh = isBowl ? 52 : 28 + Math.round(r(2) ** 1.2 * 40);
        const top = FAR - bh;
        const alt = i % 2 === 0;
        const body = alt ? P.bldA : P.bldB;
        f.rect(x, top, bw, bh, body);
        for (let y = Math.max(0, top - 8); y < FAR; y++)
          for (let k = Math.max(0, x - 1); k < Math.min(w, x + bw + 1); k++)
            skyMask[y * w + k] = 0;
        f.vline(x, top, FAR - 1, alt ? P.bldAEdge : P.bldBEdge);
        f.vline(x + bw - 1, top, FAR - 1, alt ? P.bldADark : P.bldBDark);
        f.hline(x, x + bw - 1, top, alt ? P.bldAEdge : P.bldBEdge);
        // window columns centred between the edges
        const cols = Math.floor((bw - 3) / 3);
        const wx0 = x + 1 + Math.floor((bw - 2 - (3 * cols - 1)) / 2);
        const wxN = wx0 + 3 * (cols - 1);
        // the signs hung on it: a column of boxes on one side over two
        // columns of windows, a tall neon sign on the other
        const side = r(3) > 0.5;
        const boxes = r(4) > 0.45;
        const bx = side ? wxN - 3 : wx0 - 1;
        let tate: Sign | null = null;
        if (r(5) > 0.35 && bh > 34) {
          const sy = top + 3 + Math.round(r(7) * 6);
          const want = 14 + Math.round(r(6) * Math.min(22, bh - 22));
          // a length that leaves the same gap above and below its glyphs
          // (4n + 3), and stops short of the embankment
          const n = Math.min(
            Math.round((want - 3) / 4),
            Math.floor((FAR - 1 - sy - 3) / 4)
          );
          tate = {
            x: side ? x - 1 : x + bw - 4,
            y: sy,
            len: 4 * n + 3,
            c: Math.floor(r(8) * NEON.length),
            seed: i,
            kind: 'tate',
          };
          signs.push(tate);
        }
        // floors of windows, some tinted by the signs outside; none left
        // half showing beside a sign
        for (let y = top + 3; y < FAR - 2; y += 4) {
          const on = hash2(i, y, 24) < 0.42;
          const tint = hash2(i, y >> 3, 25);
          const c =
            tint < 0.55
              ? P.winWarmDim
              : tint < 0.72
                ? P.win
                : tint < 0.86
                  ? P.winPink
                  : P.winCyan;
          for (let wx = wx0; wx <= wxN; wx += 3) {
            if (boxes && wx + 1 >= bx && wx <= bx + 5) continue;
            if (
              tate &&
              wx + 1 >= tate.x &&
              wx <= tate.x + 4 &&
              y + 1 >= tate.y &&
              y < tate.y + tate.len
            )
              continue;
            const lit = on && hash2(wx, y, 26) < 0.8;
            f.rect(wx, y, 2, 2, lit ? c : P.winDim);
          }
        }
        // a column of little lit sign boxes, one per bar upstairs
        if (boxes) {
          for (let y = top + 4; y < FAR - 6; y += 5) {
            if (hash2(i, y, 27) < 0.25) continue;
            const pick = hash2(i, y, 28);
            const c =
              pick < 0.4
                ? P.boxWhite
                : pick < 0.6
                  ? P.neonYellow
                  : pick < 0.75
                    ? P.winPink
                    : pick < 0.9
                      ? P.winCyan
                      : P.neonOrange;
            f.rect(bx, y, 6, 4, c);
            f.hline(
              bx + 1,
              bx + 1 + Math.floor(hash2(i, y, 29) * 3),
              y + 1,
              P.boxInk
            );
            f.set(bx + 4, y + 2, P.boxInk);
            glow(f, bx + 3, y + 2, 5, c, 0.2, 1, 0.12);
          }
        }
        // a lit board on the roof, or the big billboard standing on its legs
        if (isBowl) bowl = { x: x + Math.floor((bw - 1) / 2), y: top - 15 };
        else if (r(9) > 0.55) {
          const len = bw - 2;
          signs.push({
            x: x + 1,
            y: top - 6,
            len,
            c: Math.floor(r(10) * NEON.length),
            seed: i + 100,
            kind: 'board',
          });
          f.set(x + 3, top - 1, P.signDark);
          f.set(x + len - 2, top - 1, P.signDark);
        }
        x += bw;
      }
      // a soft halo where the neon is thickest
      for (const s of signs) {
        const c = NEON[s.c]!;
        if (s.kind === 'tate')
          glow(
            f,
            s.x + 2,
            s.y + s.len / 2,
            8,
            c,
            0.22,
            Math.max(1, s.len / 14),
            0.12
          );
        else
          glow(
            f,
            s.x + s.len / 2,
            s.y + 2,
            Math.max(8, s.len * 0.6),
            c,
            0.2,
            0.4,
            0.12
          );
      }
      glow(f, bowl.x, bowl.y + 5, 16, P.neonOrange, 0.22, 0.8, 0.12);

      // the far embankment: a stone wall with lamps along the top
      f.rect(0, FAR, w, RIVER - FAR, P.stone);
      f.hline(0, w, FAR, P.stoneHi);
      f.hline(0, w, RIVER - 1, P.stoneDark);
      for (let x = 3; x < w; x += 11)
        f.vline(x, FAR + 1, RIVER - 2, P.stoneDark);
    });

    /** Fukuoka Tower far off in Momochi: a thin mirrored triangle playing LED colours. */
    function drawTower(f: Frame, t: number) {
      const top = 6;
      const deck = 15;
      const scheme = Math.floor(t / 9000) % 3;
      for (let y = top; y < FAR; y++) {
        const half =
          y < deck
            ? 1
            : y < deck + 3
              ? 2
              : 1 + Math.min(2, Math.floor((y - deck) / 16));
        for (let dx = -half; dx <= half; dx++) {
          const x = towerX + dx;
          if (x < 0 || x >= w || !skyMask[y * w + x]) continue;
          let c: RGB = dx <= 0 ? P.towerB : P.towerA;
          if (y >= deck && y < deck + 3) c = dx < 1 ? P.towerHi : P.towerB;
          else if (y > deck + 3) {
            // the facade lights: a slow wave of colour running up the shaft
            const k = Math.floor((y - t / 120) / 4);
            const lit = ((k % 3) + 3) % 3 === 0;
            const col =
              scheme === 0
                ? P.neonCyan
                : scheme === 1
                  ? P.neonPink
                  : P.neonViolet;
            if (lit && dx <= 0) c = col;
          }
          f.set(x, y, c);
        }
      }
      if (skyMask[(top - 2) * w + towerX])
        f.vline(towerX, top - 4, top - 1, P.towerA);
      if (Math.sin(t / 600) > 0) f.set(towerX, top - 5, P.neonRed);
    }

    function drawSigns(f: Frame, t: number) {
      for (const [k, s] of signs.entries()) {
        const age = t - (flickAt.get(k) ?? -Infinity);
        const c = NEON[(s.c + (bumps.get(k) ?? 0)) % NEON.length]!;
        // a click makes it stutter, otherwise the odd tube flickers now and then
        const off =
          age < 700
            ? Math.floor(age / 70) % 2 === 0
            : hash2(k, Math.floor(t / 160), 9) > 0.985;
        if (s.kind === 'tate') {
          f.rect(s.x, s.y, 5, s.len, P.signDark);
          const border = off ? P.bldBEdge : c;
          f.vline(s.x, s.y, s.y + s.len - 1, border);
          f.vline(s.x + 4, s.y, s.y + s.len - 1, border);
          f.hline(s.x, s.x + 4, s.y, border);
          f.hline(s.x, s.x + 4, s.y + s.len - 1, border);
          if (!off)
            for (let gy = s.y + 2, g = 0; gy + 3 < s.y + s.len; gy += 4, g++)
              glyph(f, s.x + 1, gy, c, s.seed * 13 + g);
          if (age < 1400 && !off)
            glow(
              f,
              s.x + 2,
              s.y + s.len / 2,
              9,
              c,
              0.35 * (1 - age / 1400),
              s.len / 14,
              0.1
            );
        } else {
          // five rows on two legs: tubes top and bottom, one line of glyphs
          // centred between them
          f.rect(s.x, s.y, s.len, 5, P.signDark);
          f.hline(s.x, s.x + s.len - 1, s.y, off ? P.bldBEdge : c);
          f.hline(s.x, s.x + s.len - 1, s.y + 4, off ? P.bldBEdge : c);
          const n = Math.max(0, Math.ceil((s.len - 6) / 4));
          const gx0 = s.x + Math.floor((s.len - (4 * n - 1)) / 2);
          if (!off)
            for (let g = 0; g < n; g++)
              glyph(f, gx0 + g * 4, s.y + 1, c, s.seed * 7 + g);
          if (age < 1400 && !off)
            glow(
              f,
              s.x + s.len / 2,
              s.y + 2,
              s.len * 0.6,
              c,
              0.35 * (1 - age / 1400),
              0.4,
              0.1
            );
        }
      }
      // the rooftop billboard: a bowl of ramen in neon, steam lines rising
      const { x, y } = bowl;
      f.rect(x - 13, y - 2, 27, 15, P.signDark);
      f.hline(x - 13, x + 13, y - 2, P.neonOrange);
      f.hline(x - 13, x + 13, y + 12, P.neonOrange);
      f.vline(x - 13, y - 2, y + 12, P.neonOrange);
      f.vline(x + 13, y - 2, y + 12, P.neonOrange);
      f.vline(x - 9, y + 13, y + 14, P.signDark);
      f.vline(x + 9, y + 13, y + 14, P.signDark);
      // bowl
      f.hline(x - 8, x + 8, y + 5, P.neonRed);
      f.line(x - 8, y + 5, x - 4, y + 10, P.neonRed);
      f.line(x + 8, y + 5, x + 4, y + 10, P.neonRed);
      f.hline(x - 4, x + 4, y + 10, P.neonRed);
      f.hline(x - 3, x + 3, y + 11, P.neonRed);
      // noodles and chopsticks
      f.hline(x - 6, x + 6, y + 6, P.neonYellow);
      const lift = Math.floor(t / 700) % 2;
      f.line(x + 2, y + 6 - lift, x + 10, y - 1 - lift, P.neonWhite);
      f.line(x + 4, y + 6 - lift, x + 11, y + 1 - lift, P.neonWhite);
      f.vline(x + 3, y + 6 - lift, y + 8, P.neonYellow);
      // steam lines, lit one after another
      const step = Math.floor(t / 400) % 4;
      for (let k = 0; k < 3; k++) {
        if (k >= step) continue;
        const sx = x - 5 + k * 4;
        f.set(sx, y + 3, P.neonWhite);
        f.set(sx + 1, y + 2, P.neonWhite);
        f.set(sx, y + 1, P.neonWhite);
        f.set(sx + 1, y, P.neonWhite);
      }
    }

    // ---------- our side: railing, walkway, things ----------
    const lamps: number[] = [];
    for (
      let x = Math.round(cx - w * 0.47);
      x < w;
      x += Math.max(110, Math.round(w * 0.36))
    )
      lamps.push(x);
    const cratesX = main.x + main.w + 3;
    // the urchin box sits on the two beer crates
    const HAKO_W = 17;
    const hako = { x: cratesX + 3, y: main.g - 12 };
    const walk = layer(w, h, (f) => {
      // embankment edge and a low railing
      f.rect(0, EDGE, w, WALK - EDGE, P.stone);
      f.hline(0, w, EDGE, P.stoneHi);
      f.hline(0, w, WALK - 1, P.stoneDark);
      f.hline(0, w, EDGE - 5, P.railHi);
      f.hline(0, w, EDGE - 4, P.rail);
      for (let x = 1; x < w; x += 8) f.vline(x, EDGE - 5, EDGE - 1, P.rail);
      // paving slabs, rows widening towards us
      f.rect(0, WALK, w, h - WALK, P.pave);
      const rows = [WALK, WALK + 3, WALK + 7, WALK + 12, WALK + 18, WALK + 25];
      for (const [k, y] of rows.entries()) {
        f.hline(0, w, y, P.paveLine);
        f.hline(0, w, y + 1, P.paveHi);
        const step = 10 + k * 5;
        const next = rows[k + 1] ?? h;
        for (let x = (k % 2) * (step >> 1); x < w; x += step)
          f.vline(x, y + 1, next - 1, P.paveLine);
      }
      // warm light from each stall on the slabs in front of it
      for (const st of stalls) {
        const reach = Math.round(st.w * 0.62);
        const mid = st.x + st.w / 2;
        for (let y = st.bench; y < h; y++) {
          const spread = reach + (y - st.bench) * 1.4;
          for (let x = Math.round(mid - spread); x <= mid + spread; x++) {
            if (x < 0 || x >= w) continue;
            const c = f.get(x, y);
            const near = Math.abs(x - mid) < spread * 0.72;
            if (c === P.pave && near) f.set(x, y, P.paveLit);
            else if (c === P.paveHi)
              f.set(x, y, near ? P.paveLitHi : P.paveLit);
            else if (c === P.paveLine && near) f.set(x, y, P.paveLitLine);
          }
        }
      }
      // riverside lamps
      for (const lx of lamps) {
        f.vline(lx, 84, WALK + 1, P.lampPost);
        f.rect(lx - 1, WALK - 1, 3, 3, P.lampPost);
        f.hline(lx - 3, lx + 3, 84, P.lampPost);
        f.rect(lx - 2, 81, 5, 3, P.lamp);
        f.hline(lx - 2, lx + 2, 80, P.lampPost);
      }
    });

    // beer crates, a gas bottle and a bucket beside the big stall, and on
    // the crates a box of sea urchins (see drawHako)
    function crates(f: Frame) {
      const cy = main.g;
      const crate = (x: number, y: number, c: RGB, hi: RGB, dark: RGB) => {
        f.rect(x, y, 11, 7, c);
        f.hline(x, x + 10, y, hi);
        f.vline(x + 10, y, y + 6, dark);
        f.rect(x + 2, y + 2, 2, 1, dark);
        f.rect(x + 7, y + 2, 2, 1, dark);
        f.hline(x + 1, x + 9, y + 4, dark);
        f.hline(x + 1, x + 9, y + 6, dark);
      };
      crate(cratesX, cy - 7, P.crate, P.crateHi, P.crateDark);
      crate(cratesX + 12, cy - 7, P.crateRed, P.crateRedHi, P.crateRedDark);
      // the urchin box on top is drawn live (its urchins move); the
      // seawater that's run off it lies in a puddle round the crates
      f.hline(cratesX + 1, cratesX + 23, cy, P.puddle);
      f.hline(cratesX + 4, cratesX + 18, cy + 1, P.puddle);
      f.hline(cratesX + 6, cratesX + 8, cy, P.puddleHi);
      f.set(cratesX + 15, cy + 1, P.puddleHi);
      f.rect(cratesX + 25, cy - 11, 5, 11, P.propane);
      f.vline(cratesX + 25, cy - 11, cy - 1, P.propaneHi);
      f.hline(cratesX + 26, cratesX + 28, cy - 12, P.propaneHi);
      f.set(cratesX + 27, cy - 13, P.potDark);
      f.rect(cratesX + 32, cy - 5, 5, 5, P.bucket);
      f.hline(cratesX + 32, cratesX + 36, cy - 5, P.potHi);
    }

    // the stalls themselves, back to front, the crates between the rows
    const stallLayer = layer(w, h, (f) => {
      for (const st of stalls) {
        if (st === main) crates(f);
        drawStall(f, st);
      }
    });

    function drawStall(f: Frame, st: Stall) {
      const { x, g, w: sw, tier } = st;
      const x1 = x + sw - 1;
      const u = (m: number) => Math.round(m * st.ppm);
      // shadow under it
      f.rect(x - 2, g - 1, sw + 4, 2, P.paveLine);
      // the lit inside
      gradient(
        f,
        st.norenTop,
        st.counter,
        [P.insideHi, P.inside, P.insideLow],
        x + 1,
        x1
      );
      // menus along the back wall, bottles on a shelf
      const tagW = tier === 2 ? 3 : 2;
      const tagH = tier === 2 ? 6 : tier === 1 ? 4 : 3;
      for (let mx = x + 3; mx < x1 - 3; mx += tagW + 1) {
        const r = hash2(mx, 1, st.seed);
        if (r < 0.22) continue;
        // white paper mostly, the odd yellow or pink special
        const paper = r > 0.9 ? P.neonYellow : r > 0.82 ? P.winPink : P.menu;
        const th = tagH - (hash2(mx, 2, st.seed) > 0.6 ? 1 : 0);
        f.rect(mx, st.norenBot, tagW, th, paper);
        for (let k = 1; k < th - 1; k += 2)
          if (hash2(mx, k, st.seed + 3) > 0.25)
            f.set(mx + (tagW > 2 ? 1 : 0), st.norenBot + k, P.menuInk);
      }
      const shelf = st.norenBot + tagH + (tier === 2 ? 5 : 3);
      f.hline(x + 2, x1 - 2, shelf, P.woodDark);
      for (let bx = x + 3; bx < x1 - 3; bx += 2) {
        if (hash2(bx, 2, st.seed) < 0.35 || Math.abs(bx - st.cookX) < u(0.35))
          continue;
        f.vline(
          bx,
          shelf - (tier === 2 ? 4 : 2),
          shelf - 1,
          [P.bottleA, P.bottleB, P.bottleC][
            Math.floor(hash2(bx, 3, st.seed) * 3)
          ]!
        );
        if (tier === 2) f.set(bx, shelf - 5, P.bottleC);
      }
      // the stockpots on the right
      const pots =
        tier === 2
          ? [
              { x: st.potX - 8, w: 11, h: 13 },
              { x: st.potX + 5, w: 8, h: 9 },
            ]
          : [
              { x: st.potX - 4, w: 6, h: 6 },
              { x: st.potX + 3, w: 4, h: 4 },
            ];
      for (const pt of pots) {
        const top = st.counter - pt.h;
        f.rect(pt.x, top, pt.w, pt.h, P.pot);
        f.vline(pt.x + 1, top + 1, st.counter - 1, P.potHi);
        f.vline(pt.x + pt.w - 1, top, st.counter - 1, P.potDark);
        f.hline(pt.x - 1, pt.x + pt.w, top, P.potDark);
        if (tier === 2) {
          f.hline(pt.x, pt.x + pt.w - 1, top + 3, P.potDark);
          f.set(pt.x - 1, top + 2, P.potDark);
          f.set(pt.x + pt.w, top + 2, P.potDark);
        }
      }
      // the grill on the left, coals glowing under skewers
      const gx = x + u(0.3);
      const gw = u(0.6);
      f.rect(gx, st.counter - 3, gw, 3, P.grill);
      for (let k = gx + 1; k < gx + gw - 1; k += 2)
        f.set(k, st.counter - 2, P.coal);
      for (let k = gx + 1; k < gx + gw - 1; k += 3) {
        f.vline(k, st.counter - (tier === 2 ? 8 : 5), st.counter - 4, P.woodHi);
        if (tier === 2) f.vline(k, st.counter - 7, st.counter - 5, P.jacketRed);
      }
      // counter top
      f.rect(x - 1, st.counter, sw + 2, 2, P.woodHi);
      f.hline(x - 1, x1 + 1, st.counter + 1, P.wood);
      // the cart below: planked panel and wheels
      f.rect(x, st.counter + 2, sw, g - st.counter - 3, P.woodDark);
      for (let px = x + 5; px < x1; px += u(0.5))
        f.vline(px, st.counter + 2, g - 2, P.woodDeep);
      f.hline(x, x1, g - 2, P.woodDeep);
      const wr = tier === 2 ? 4 : 2;
      for (const wx of [x + wr + 1, x1 - wr - 1]) {
        f.disc(wx, g - wr, wr, P.woodDeep);
        f.disc(wx, g - wr, Math.max(1, wr - 2), P.wood);
        f.set(wx, g - wr, P.woodDeep);
      }
      // things on the counter between the customers
      for (let k = 0; k <= st.seats.length; k++) {
        const ix =
          x + 4 + Math.round(((k + 0.5) * (sw - 8)) / (st.seats.length + 1));
        if (hash2(k, 4, st.seed) < 0.45) {
          const bh = tier === 2 ? 5 : 3;
          f.rect(ix, st.counter - bh, tier === 2 ? 3 : 2, bh, P.beer);
          f.hline(ix, ix + (tier === 2 ? 2 : 1), st.counter - bh, P.foam);
          if (tier === 2)
            f.vline(ix + 3, st.counter - bh + 1, st.counter - 2, P.glassRim);
        } else {
          f.hline(ix - 1, ix + (tier === 2 ? 3 : 2), st.counter - 1, P.bowl);
          f.hline(ix, ix + (tier === 2 ? 2 : 1), st.counter, P.bowl);
          if (tier === 2) f.hline(ix - 1, ix + 3, st.counter - 2, P.foam);
        }
      }
      // the bench and the regulars on it
      f.rect(x + 1, st.bench, sw - 2, 2, P.wood);
      f.hline(x + 1, x1 - 1, st.bench, P.woodHi);
      for (const seat of st.seats) {
        if (tier === 2) {
          const look = LOOKS_XL[seat.look]!;
          backlit(f, look.rows, look.pal, seat.x, seat.top, P.rim, 0.5);
          // legs and shoes under the bench
          f.rect(seat.x + 1, st.bench + 2, 3, g - st.bench - 3, P.trouser);
          f.rect(seat.x + 5, st.bench + 2, 3, g - st.bench - 3, P.trouser);
          f.hline(seat.x, seat.x + 3, g - 1, P.shoe);
          f.hline(seat.x + 5, seat.x + 8, g - 1, P.shoe);
        } else if (tier === 1) {
          const look = LOOKS[seat.look]!;
          backlit(f, look.rows, look.pal, seat.x, seat.top, P.rim, 0.5);
          f.rect(seat.x + 1, st.bench + 2, 2, g - st.bench - 3, P.trouser);
          f.rect(seat.x + 4, st.bench + 2, 2, g - st.bench - 3, P.trouser);
        } else {
          const rows = LOOKS_SMALL[seat.look]!;
          const pal = {
            h: P.hairDark,
            s: P.skinShade,
            c: [P.suit, P.jacketRed, P.hoodie, P.cardigan][(seat.x >> 3) % 4]!,
          };
          backlit(f, rows, pal, seat.x, seat.top, P.rim, 0.45);
          f.vline(seat.x + 1, st.bench + 2, g - 1, P.trouser);
          f.vline(seat.x + 3, st.bench + 2, g - 1, P.trouser);
        }
      }
      // the bench's own legs, nearer to us than the customers' legs
      for (let lx = x + 3; lx < x1; lx += u(0.9))
        f.vline(lx, st.bench + 2, g - 1, P.woodDeep);
      // corner posts and the roof
      const post = tier === 2 ? 3 : 2;
      f.rect(x, st.roofTop + 3, post, st.counter - st.roofTop - 3, P.woodDark);
      f.rect(
        x1 - post + 1,
        st.roofTop + 3,
        post,
        st.counter - st.roofTop - 3,
        P.woodDark
      );
      f.vline(x, st.roofTop + 3, st.counter - 1, P.wood);
      const eave = tier === 2 ? 5 : 4;
      f.rect(x - eave, st.roofTop, sw + eave * 2, 3, P.roof);
      f.hline(x - eave, x1 + eave, st.roofTop, P.roofHi);
      f.hline(x - eave + 1, x1 + eave - 1, st.roofTop + 2, P.fascia);
      // a lit sign on the roof
      // sized so the glyphs sit with an even margin all round
      const sgw = tier === 2 ? 31 : 19;
      const sgh = tier === 2 ? 8 : 6;
      const sgx = x + Math.round((sw - sgw) / 2);
      const sgy = st.roofTop - sgh - 2;
      f.rect(sgx, sgy, sgw, sgh, P.roofSign);
      f.hline(sgx, sgx + sgw - 1, sgy + sgh - 1, P.menuInk);
      f.vline(sgx + 3, sgy + sgh, st.roofTop - 1, P.woodDeep);
      f.vline(sgx + sgw - 4, sgy + sgh, st.roofTop - 1, P.woodDeep);
      if (tier === 2)
        for (let k = 0; k < 5; k++)
          kanji(f, sgx + 1 + k * 6, sgy + 1, P.roofSignInk, st.seed * 5 + k);
      else
        for (let k = 0; k < 4; k++)
          glyph(f, sgx + 2 + k * 4, sgy + 1, P.roofSignInk, st.seed * 5 + k);
    }

    // ---------- moving things ----------
    const swingAt = new Map<number, number>();
    const burstAt = new Map<number, number>();
    const kanpaiAt = new Map<string, number>();
    const flickAt = new Map<number, number>();
    const bumps = new Map<number, number>();
    let planeCalledAt = -Infinity;
    let gustAt = -Infinity;

    // ---------- easter egg: kaedama ----------
    // Hakata ramen is thin noodles in plenty of soup, so you finish the
    // noodles first and call for a refill: kaedama. Click the cook at the
    // big stall: he shakes the water out of a fresh ball of noodles, hard,
    // and flings it up over the roof in a great golden streamer, down into
    // the bowl a customer's holding up to catch it. They slurp it all down.
    const KAE_SHAKE = 650; // the strainer shaken hard, then the flick
    const KAE_LAND = KAE_SHAKE + 1100; // in the bowl
    const KAE_SLURP = KAE_LAND + 1250; // the last of it slurped up
    const KAE = KAE_LAND + 3000;
    let kaeAt = -Infinity;
    const kaeAge = (t: number) => t - kaeAt;
    const kaeBusy = (t: number) => kaeAge(t) >= 0 && kaeAge(t) < KAE;
    // who catches it: a customer a good throw left of the pot
    const kaeAim = main.x + main.w * 0.12;
    const kaeSeat = main.seats.reduce((a, b) =>
      Math.abs(b.x - kaeAim) < Math.abs(a.x - kaeAim) ? b : a
    );
    // their head and shoulders, which hide the bowl once it's at their mouth
    const kaeBack = new Uint8Array(w * h);
    for (const [ry, row] of LOOKS_XL[kaeSeat.look]!.rows.entries())
      for (let rx = 0; rx < row.length; rx++) {
        const x = kaeSeat.x + rx;
        const y = kaeSeat.top + ry;
        if (row[rx] !== '.' && x >= 0 && x < w && y >= 0 && y < h)
          kaeBack[y * w + x] = 1;
      }
    const behindKae = (x: number, y: number) =>
      x >= 0 && x < w && y >= 0 && y < h && kaeBack[y * w + x] === 1;
    // the egg spot: his head and shoulders, clear of the heads at the counter
    const COOK_R = 7;
    const cookSpot = {
      x: main.cookX,
      y: Math.min(
        main.norenBot + 6,
        main.bench -
          Math.max(...LOOKS_XL.map((l) => l.rows.length)) -
          2 -
          COOK_R
      ),
    };
    const onCook = (x: number, y: number) =>
      Math.hypot(x - cookSpot.x, y - cookSpot.y) <= COOK_R;
    /** How high the strainer's lifted for a kaedama (0 when it isn't). */
    function kaeLift(t: number) {
      const a = kaeAge(t);
      if (a < 0 || a >= KAE_SHAKE + 350) return 0;
      if (a < 150) return Math.round((6 * a) / 150);
      // yugiri: brought down hard, again and again, to throw the water off
      if (a < KAE_SHAKE - 120) return Math.floor((a - 150) / 75) % 2 ? 1 : 6;
      if (a < KAE_SHAKE) return 8;
      return Math.round(8 * (1 - (a - KAE_SHAKE) / 350));
    }
    /** The bowl held up for it (the middle of its rim), if it's out. */
    function kaeBowl(a: number) {
      const hi = kaeSeat.top - 8; // up over their head
      const lo = kaeSeat.top + 3; // at their mouth
      if (a < 250 || a >= KAE_SLURP + 500) return null;
      let y = lo;
      if (a < 550) y = lo + (hi - lo) * ease((a - 250) / 300);
      else if (a < KAE_LAND) y = hi;
      // the catch knocks it down a little
      else if (a < KAE_LAND + 200)
        y = hi + Math.sin(((a - KAE_LAND) / 200) * Math.PI) * 2;
      else if (a < KAE_LAND + 500)
        y = hi + (lo - hi) * ease((a - KAE_LAND - 200) / 300);
      else if (a >= KAE_SLURP + 200) y = lo + ((a - KAE_SLURP - 200) / 300) * 6;
      return { x: kaeSeat.x + 4, y: Math.round(y) };
    }
    // the throw: from the strainer up past the roof, a loop-the-loop at the
    // top for show, and down into the bowl; once it's caught, what's still
    // in the air sags down after it (`sag` goes from 1 to 0)
    const kaeFrom = { x: main.potX - 3, y: main.norenBot + 1 };
    const kaeLoop = w < 256 ? 7 : w < 400 ? 9 : 11;
    // (and a wider swing out over the pots where there's room for it)
    const kaeSwing = Math.round(Math.min(36, Math.max(0, (w - 200) * 0.12)));
    const kaeArc = (kaeFrom.y + kaeSeat.top - 8) / 2 - 8 - 2 * kaeLoop;
    const kaePath = (
      u: number,
      bx: number,
      by: number,
      sag = 1
    ): [number, number] => {
      let x =
        kaeFrom.x +
        (bx - kaeFrom.x) * u +
        kaeSwing * sag * Math.sin(Math.PI * u) ** 2;
      let y = kaeFrom.y + (by - kaeFrom.y) * u - 4 * kaeArc * sag * u * (1 - u);
      if (u > 0.4 && u < 0.62) {
        const th = ((u - 0.4) / 0.22) * Math.PI * 2;
        x += Math.sin(th) * kaeLoop * sag;
        y -= (1 - Math.cos(th)) * kaeLoop * sag;
      }
      return [x, y];
    };
    /** Drops flung out from (x, y) at `age` ms: a closed-form little spray. */
    function spray(
      f: Frame,
      x: number,
      y: number,
      age: number,
      life: number,
      n: number,
      speed: number,
      up: number,
      c: RGB,
      seed: number
    ) {
      if (age < 0 || age > life) return;
      const s = age / 1000;
      for (let i = 0; i < n; i++) {
        const vx = (hash2(i, 1, seed) - 0.5) * 2 * speed;
        const vy = -up * (0.5 + hash2(i, 2, seed) * 0.7);
        f.blend(
          Math.round(x + vx * s),
          Math.round(y + vy * s + 160 * s * s),
          c,
          0.95 * (1 - age / life)
        );
      }
    }

    function drawKaedama(f: Frame, t: number) {
      const a = kaeAge(t);
      if (a < 0 || a >= KAE) return;
      const top = main.norenBot;
      // yugiri: water thrown off the strainer on every downstroke
      for (let k = 0; k < 3; k++)
        spray(
          f,
          main.potX - 2,
          top + 8,
          a - 225 - k * 150,
          420,
          6,
          40,
          30,
          P.steam,
          90 + k
        );
      // the flick sends a fan of it up after the noodles
      spray(
        f,
        main.potX - 2,
        top + 2,
        a - KAE_SHAKE + 120,
        600,
        10,
        55,
        70,
        P.steam,
        95
      );
      const bowl = kaeBowl(a);
      const end = bowl ?? { x: kaeSeat.x + 4, y: kaeSeat.top + 3 };
      const hide = a > KAE_LAND + 250;
      const pal = { n: P.noodle, h: P.noodleHi, d: P.noodleDark };
      // the bowl: up over their head, arms up to it from the shoulders
      if (bowl) {
        const { x, y } = bowl;
        const sleeve = LOOKS_XL[kaeSeat.look]!.pal.c!;
        const lit = lerpRGB(sleeve, P.rim, 0.5);
        const put = (px: number, py: number, c: RGB) => {
          if (!(hide && behindKae(px, py))) f.set(px, py, c);
        };
        for (const [sx, hx, c] of [
          [kaeSeat.x + 1, x - 5, lit],
          [kaeSeat.x + 7, x + 5, sleeve],
        ] as const) {
          // (Bresenham by hand, so the head can hide what's behind it)
          const y0 = kaeSeat.top + 9;
          const n = Math.max(1, Math.abs(y0 - y - 1), Math.abs(sx - hx));
          for (let i = 0; i <= n; i++) {
            const px = Math.round(sx + ((hx - sx) * i) / n);
            const py = Math.round(y0 + (y + 1 - y0) * (i / n));
            put(px, py, c);
            put(px + (hx < sx ? 1 : -1), py, sleeve);
          }
          put(hx, y + 1, P.skin);
          put(hx, y, P.skin);
        }
        for (let dx = -4; dx <= 4; dx++) put(x + dx, y, P.bowl);
        for (let dx = -4; dx <= 4; dx++) put(x + dx, y + 1, P.bowlBand);
        for (let dx = -3; dx <= 3; dx++) put(x + dx, y + 2, P.bowl);
        for (let dx = -2; dx <= 2; dx++) put(x + dx, y + 3, P.bowl);
        // full of noodles once they're in
        if (a > KAE_LAND && a < KAE_SLURP)
          for (let dx = -3; dx <= 3; dx++)
            put(
              x + dx,
              y - 1 - (dx > -2 && dx < 2 ? 1 : 0),
              dx % 2 ? P.noodleHi : P.noodle
            );
      }
      // the noodles: a golden streamer of strands with the clump at its
      // head; it unspools from the strainer, lands, and is slurped in
      const fly = (a - KAE_SHAKE) / (KAE_LAND - KAE_SHAKE);
      if (fly > 0) {
        const head = Math.min(1, fly);
        const sl = (a - KAE_LAND - 300) / (KAE_SLURP - KAE_LAND - 300);
        const tail =
          sl <= 0
            ? Math.max(0, head - 0.62)
            : 0.38 + 0.62 * Math.min(1, sl * sl);
        const sag = 1 - 0.85 * ease((a - KAE_LAND) / 900);
        const at = (u: number) => kaePath(u, end.x, end.y - 1, sag);
        if (tail < head - 0.002) {
          let len = 0;
          let [qx, qy] = at(tail);
          for (let i = 1; i <= 24; i++) {
            const [x, y] = at(tail + ((head - tail) * i) / 24);
            len += Math.hypot(x - qx, y - qy);
            qx = x;
            qy = y;
          }
          const n = Math.ceil(len * 1.8);
          const wig = sl > 0 ? 1.3 : 0.6;
          // a dark edge first, so it shows over the bright signs too
          for (let pass = 0; pass < 2; pass++)
            for (let i = 0; i <= n; i++) {
              const u = tail + ((head - tail) * i) / n;
              const [x, y] = at(u);
              const [x2, y2] = at(u + 0.002);
              const nl = Math.hypot(x2 - x, y2 - y) || 1;
              const nx = -(y2 - y) / nl;
              const ny = (x2 - x) / nl;
              for (let s = -2; s <= 2; s++) {
                const off =
                  s * 0.75 +
                  Math.sin(u * 40 + s * 2.1 - a / 55) * wig +
                  (pass === 0 ? Math.sign(s || 1) * 1.2 : 0);
                const px = Math.round(x + nx * off);
                const py = Math.round(y + ny * off);
                if (hide && behindKae(px, py)) continue;
                if (pass === 0) {
                  if (s === -2 || s === 2) f.blend(px, py, P.woodDeep, 0.55);
                } else
                  f.set(
                    px,
                    py,
                    s < 0 ? P.noodleHi : s > 1 ? P.noodleDark : P.noodle
                  );
              }
            }
        }
        if (fly < 1) {
          const [hx, hy] = at(head);
          sprite(
            f,
            Math.floor(a / 80) % 2
              ? ['.hnnh.', 'hnhnnd', 'nnhhnd', 'dnnhdd', '.dddd.']
              : ['.nhhn.', 'nhnnhd', 'hnnhnd', 'nndhnd', '.ddnd.'],
            hx - 3,
            hy - 2,
            pal
          );
          // water still flying off it
          for (let k = 0; k < 9; k++) {
            const s0 = KAE_SHAKE + 60 + k * 110;
            const [dx, dy] = at(
              Math.min(1, (s0 - KAE_SHAKE) / (KAE_LAND - KAE_SHAKE))
            );
            spray(f, dx, dy, a - s0, 650, 3, 16, 8, P.steam, 100 + k);
          }
        }
      }
      // the catch: soup splashing up out of the bowl, and a gleam
      if (bowl) {
        spray(f, bowl.x, bowl.y - 1, a - KAE_LAND, 600, 12, 45, 55, P.foam, 99);
        const g = (a - KAE_LAND) / 450;
        if (g > 0 && g < 1)
          for (let j = 0; j < 6; j++) {
            const ang = (j / 6) * Math.PI * 2 - Math.PI / 2;
            const d = 4 + g * 9;
            twinkle(
              f,
              bowl.x + Math.cos(ang) * d,
              bowl.y - 2 + Math.sin(ang) * d * 0.8,
              g < 0.5 ? 2 : 1,
              P.noodleHi
            );
          }
      }
      // and steam off the fresh noodles, a lot of it
      const sb = a - KAE_LAND;
      for (let i = 0; i < 12 && sb > 0; i++) {
        const ph = (sb - i * 210) / 1700;
        if (ph < 0 || ph > 1) continue;
        const px =
          end.x + Math.sin(ph * 5 + i * 1.7) * (1 + ph * 4) + (i % 3) * 2 - 2;
        const py = Math.min(end.y, kaeSeat.top) - 2 - ph * 40;
        const r = 1.5 + ph * 5.5;
        const al =
          (ph < 0.15 ? ph / 0.15 : 1 - (ph - 0.15) / 0.85) *
          0.75 *
          (a > KAE - 600 ? (KAE - a) / 600 : 1);
        const ri = Math.ceil(r);
        for (let dy = -ri; dy <= ri; dy++)
          for (let dx = -ri; dx <= ri; dx++)
            if (dx * dx + dy * dy <= r * r + 0.5)
              f.blend(
                px + dx,
                py + dy,
                ph < 0.4 ? P.steam : P.steam2,
                dy < 0 ? al : al * 0.7
              );
      }
    }

    // ---------- easter egg: uni ----------
    // A wooden box of sea urchins sits on the beer crates by the big stall,
    // one of them waving its spines about. Click it, and up it comes, close,
    // spines bristling, dripping seawater; a knife goes across, the top flies
    // off, and it's open: five bright orange-gold tongues of uni, glistening.
    // Everyone at the counter raises a glass, and it's served.
    const UNI_UP = 1300; // up close by here
    const UNI_CUT = 1700; // the knife's across
    const UNI_OPEN = 1800; // the top comes off
    const UNI_SERVE = 4700; // down it goes to the counter
    const UNI_DOWN = 5500; // served
    const UNI = 6700;
    let uniAt = -Infinity;
    const uniAge = (t: number) => t - uniAt;
    const uniBusy = (t: number) => uniAge(t) >= 0 && uniAge(t) < UNI;
    // the box, and the one in the middle that moves
    const UNI_R = 8;
    const uniSpot = { x: hako.x + 8, y: hako.y - 3 };
    const onUni = (x: number, y: number) =>
      Math.hypot(x - uniSpot.x, y - uniSpot.y) <= UNI_R;
    // the close-up: as big as the picture's height allows, held up above
    // the customers so they see it too
    const UR = w < 256 ? 23 : 27; // its body's radius
    const UL = Math.round(UR * 0.45); // and its spines' length
    const upX = Math.max(UR + UL + 2, Math.min(w - UR - UL - 2, hako.x + 14));
    const upY = Math.round(h * 0.39);
    // served on the counter in front of the empty place on the bench
    const served = { x: main.gapX + 4, y: main.counter - 3 };
    const CUT = -0.22; // the knife goes across here (a fraction of R, up)

    function uniPose(a: number) {
      const sx = uniSpot.x;
      const sy = hako.y - 2;
      if (a < UNI_UP) {
        // up out of the box first, then towards us
        const p = a / UNI_UP;
        const e = ease(p);
        const k = (1 - e) * (1 - e);
        const m = 2 * (1 - e) * e;
        return {
          x: k * sx + m * sx + e * e * upX,
          y: k * sy + m * (upY + 4) + e * e * upY,
          r: 3.5 + (UR - 3.5) * e ** 1.6,
          bristle: Math.min(1, p * 1.3),
        };
      }
      if (a < UNI_SERVE)
        return {
          x: upX,
          y: upY + Math.round(Math.sin((a - UNI_UP) / 450)),
          r: UR,
          bristle: 1,
        };
      if (a < UNI_DOWN) {
        const e = ease((a - UNI_SERVE) / (UNI_DOWN - UNI_SERVE));
        return {
          x: upX + (served.x - upX) * e,
          y: upY + (served.y - upY) * e - Math.sin(e * Math.PI) * 10,
          r: UR + (3 - UR) * e ** 0.6,
          bristle: 1,
        };
      }
      return { x: served.x, y: served.y, r: 3, bristle: 1 };
    }

    /** The urchin's body at (lx, ly) in its own coordinates; (dx, dy) on screen. */
    function urchinColor(
      lx: number,
      ly: number,
      dx: number,
      dy: number,
      R: number
    ) {
      // a ball, lit from the stall on its left
      const d = Math.hypot(dx / R + 0.4, dy / R + 0.45);
      const tone = d < 0.55 ? 2 : d < 1.05 ? 1 : 0;
      const rho = Math.hypot(lx, ly);
      // the spines pointing at us: rings of short stubs
      if (R >= 7) {
        const ring = Math.round(rho / 3.2);
        if (ring >= 1) {
          const rr = ring * 3.2;
          const k = Math.round((2 * Math.PI * rr) / 4);
          const th =
            (Math.atan2(ly, lx) / (2 * Math.PI)) * k + (ring % 2) * 0.5;
          if (
            Math.abs(th - Math.round(th)) * ((2 * Math.PI * rr) / k) < 0.6 &&
            Math.abs(rho - rr) < 0.5 + (rho / R) * 0.9
          )
            return tone === 2 ? P.spineTip : tone === 1 ? P.spine : P.urchinHi;
        }
      }
      // the sea-light behind catching its far edge
      if (rho > R - 1.3 && dx > R * 0.25) return P.spine;
      return tone === 2 ? P.urchinHi : tone === 1 ? P.urchinMid : P.urchin;
    }

    /**
     * A sea urchin of radius R centred at (cx, cy): spines all round, a
     * spiky ball of a body. `keep` picks the part to draw (in its own
     * coordinates), which is turned by `ang` about its own point (px, py).
     */
    function urchin(
      f: Frame,
      cx: number,
      cy: number,
      R: number,
      t: number,
      bristle: number,
      keep: (lx: number, ly: number) => boolean,
      ang = 0,
      px = 0,
      py = 0,
      spineK = 0.45
    ) {
      const c = Math.cos(ang);
      const s = Math.sin(ang);
      const to = (lx: number, ly: number): [number, number] => {
        const dx = lx - px;
        const dy = ly - py;
        return [cx + px + dx * c - dy * s, cy + py + dx * s + dy * c];
      };
      const [ox, oy] = to(0, 0);
      // a dark haze where the spines are thickest, so it reads as one ball
      const H = R * spineK * 0.55 * Math.min(1, bristle);
      if (R >= 7)
        for (let y = Math.floor(oy - R - H); y <= oy + R + H; y++)
          for (let x = Math.floor(ox - R - H); x <= ox + R + H; x++) {
            const dx = x - ox;
            const dy = y - oy;
            const d = Math.hypot(dx, dy);
            if (d <= R - 1 || d > R + H) continue;
            const k = (R - 1) / d;
            if (!keep((dx * c + dy * s) * k, (-dx * s + dy * c) * k)) continue;
            f.blend(x, y, P.urchin, 0.7 * (1 - (d - R) / (H + 1)));
          }
      // the spines first, so the body hides their roots
      const n = Math.max(
        10,
        Math.min(SPINES.length, Math.round((2 * Math.PI * R) / 2.4))
      );
      for (let k = 0; k < n; k++) {
        const sp = SPINES[Math.floor((k * SPINES.length) / n)]!;
        const a = sp.a + Math.sin(t / 190 + sp.ph) * 0.07 * bristle;
        const L = Math.max(
          1,
          R * spineK * sp.len * (0.35 + 0.65 * Math.min(1, bristle))
        );
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        if (!keep(ca * (R - 1), sa * (R - 1))) continue;
        const [x0, y0] = to(ca * (R - 1), sa * (R - 1));
        const [x1, y1] = to(ca * (R + L * 0.55), sa * (R + L * 0.55));
        const [x2, y2] = to(ca * (R + L), sa * (R + L));
        f.line(x0, y0, x1, y1, P.spine);
        // the tips catch the light: warm from the stall, cool from the sea
        f.line(x1, y1, x2, y2, x2 > cx + R * 0.3 ? P.spineRim : P.spineTip);
      }
      const rr = R * R + R * 0.6;
      for (let y = Math.floor(oy - R - 1); y <= oy + R + 1; y++)
        for (let x = Math.floor(ox - R - 1); x <= ox + R + 1; x++) {
          const dx = x - ox;
          const dy = y - oy;
          const lx = dx * c + dy * s;
          const ly = -dx * s + dy * c;
          if (lx * lx + ly * ly > rr || !keep(lx, ly)) continue;
          f.set(x, y, urchinColor(lx, ly, dx, dy, R));
        }
    }

    /** The open top: the shell's cut edge round five tongues of uni. */
    function uniOpen(
      f: Frame,
      cx: number,
      cy: number,
      R: number,
      open: number,
      t: number
    ) {
      const oy = cy + CUT * R;
      const rx = Math.sqrt(R * R - CUT * CUT * R * R);
      const ry = Math.max(0.6, rx * 0.55 * open);
      for (let y = Math.floor(oy - ry - 1); y <= oy + ry + 1; y++)
        for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
          const u = (x - cx) / rx;
          const v = (y - oy) / ry;
          const e = u * u + v * v;
          if (e > 1.02) continue;
          const rho = Math.sqrt(e);
          let c: RGB;
          if (R < 8) c = rho > 0.75 ? P.uniShade : P.uni;
          else if (rho > 0.84) c = v < 0 ? P.shellHi : P.shell;
          else {
            const phi = Math.atan2(v, u);
            const k = Math.round(((phi + Math.PI / 2) / (2 * Math.PI)) * 5);
            const d = phi + Math.PI / 2 - (k * 2 * Math.PI) / 5;
            const dd = Math.abs(d) * rho;
            const p = (rho - 0.1) / 0.72;
            const half =
              p <= 0 || p >= 1 ? 0 : 0.27 * Math.sin(Math.PI * p ** 0.7);
            if (dd < half) {
              c =
                hash2(x, y, 81) > 0.9 &&
                Math.sin(t / 150 + hash2(x, y, 82) * 20) > 0.6
                  ? P.uniGlint
                  : dd < half * 0.45
                    ? P.uniHi
                    : dd > half * 0.78
                      ? P.uniShade
                      : P.uni;
            } else c = P.cavity;
          }
          f.set(x, y, c);
        }
    }

    /** A four-point twinkle. */
    function twinkle(f: Frame, x: number, y: number, size: number, c: RGB) {
      x = Math.round(x);
      y = Math.round(y);
      f.set(x, y, c);
      for (let k = 1; k <= size; k++) {
        const a = k === size ? 0.6 : 1;
        f.blend(x + k, y, c, a);
        f.blend(x - k, y, c, a);
        f.blend(x, y + k, c, a);
        f.blend(x, y - k, c, a);
      }
    }

    /** Darkens the whole picture by `k` (0..1): the close-up's spotlight. */
    function dim(f: Frame, k: number) {
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

    // the box: the urchins peeking over its side, the middle one alive
    function drawHako(f: Frame, t: number) {
      const a = uniAge(t);
      const { x: hx, y: hy } = hako;
      // (only what shows over the side: the box hides the rest)
      const above = (lx: number, ly: number) =>
        ly < -0.6 || lx * lx + ly * ly < 2;
      urchin(f, hx + 4, hy - 1, 2.5, t, 1, above, 0, 0, 0, 1.1);
      urchin(f, hx + 12, hy - 0.5, 2.5, t + 900, 1, above, 0, 0, 0, 1.1);
      if (!(a >= 0 && a < UNI)) {
        // now and then it shuffles about and waves its spines
        const fidget = t % 2600 < 700;
        const jig = fidget && Math.floor(t / 120) % 2 ? 1 : 0;
        urchin(
          f,
          uniSpot.x,
          hy - 2 - jig,
          3.5,
          t * (fidget ? 2.5 : 1),
          fidget ? 4 : 1,
          above,
          0,
          0,
          0,
          1.1
        );
      }
      // the box itself, in front of them
      f.rect(hx, hy, HAKO_W, 5, P.hako);
      f.hline(hx, hx + HAKO_W - 1, hy, P.hakoHi);
      f.hline(hx, hx + HAKO_W - 1, hy + 4, P.hakoDark);
      f.vline(hx, hy, hy + 4, P.hakoDark);
      f.vline(hx + HAKO_W - 1, hy, hy + 4, P.hakoDark);
      // the fish market's name stencilled on its side
      glyph(f, hx + 4, hy + 1, P.hakoDark, 41);
      glyph(f, hx + 10, hy + 1, P.hakoDark, 44);
      // kombu and ice in among them
      f.set(hx + 1, hy - 1, P.kombu);
      f.set(hx + 16, hy - 1, P.kombu);
      f.set(hx + 16, hy - 2, P.kombu);
      if (Math.sin(t / 700) > 0.6) f.set(hx + 6, hy - 1, P.ice);
      if (Math.sin(t / 900 + 2) > 0.6) f.set(hx + 11, hy - 1, P.ice);
      // still dripping down the crates into the puddle
      const dp = (t % 1900) / 450;
      if (dp < 1)
        f.set(
          hx + 3,
          Math.round(hy + 5 + dp * dp * (main.g - hy - 5)),
          P.seaDrop
        );
    }

    function drawUni(f: Frame, t: number) {
      const a = uniAge(t);
      if (a < 0 || a >= UNI) return;
      // out of the box with a splash of seawater
      spray(f, uniSpot.x, hako.y - 3, a, 500, 10, 30, 45, P.seaDrop, 120);
      // everything else falls back into the dark while it's up close
      const up =
        a < UNI_UP
          ? ease(a / UNI_UP)
          : a < UNI_SERVE
            ? 1
            : 1 - ease((a - UNI_SERVE) / (UNI_DOWN - UNI_SERVE));
      const k =
        a < UNI_OPEN + 300
          ? 0.42
          : a < UNI_OPEN + 1300
            ? 0.42 - 0.22 * ((a - UNI_OPEN - 300) / 1000)
            : 0.2;
      if (up > 0) dim(f, k * up);
      const { x, y, r, bristle } = uniPose(a);
      const zoom = (r - 3.5) / (UR - 3.5);
      const open = a < UNI_OPEN ? 0 : Math.min(1, (a - UNI_OPEN) / 280);
      const oy = y + CUT * r;
      // the sea-light behind it, turning gold when it's opened
      if (zoom > 0.05)
        glow(
          f,
          x,
          y,
          r * 1.9,
          lerpRGB(P.sea, P.uniHi, open),
          0.45 * zoom,
          1,
          0.1
        );
      // and a burst of rays out of it
      const rq = (a - UNI_OPEN) / 1400;
      if (rq > 0 && rq < 1 && zoom > 0.5) {
        const len = r * (1 + 2.6 * (1 - (1 - rq) * (1 - rq)));
        for (let j = 0; j < 14; j++) {
          const ang = (j / 14) * Math.PI * 2 + 0.2 + rq * 0.5;
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          for (let d = r * 0.6; d < len; d += 0.8)
            f.blend(
              x + ca * d,
              oy + sa * d,
              P.uniHi,
              0.6 * (1 - rq) * (1 - (d / len) * 0.7)
            );
        }
      }
      // it shakes the sea off as it arrives, a ring of drops flung out
      const sq0 = (a - UNI_UP + 150) / 700;
      if (sq0 > 0 && sq0 < 1)
        for (let j = 0; j < 22; j++) {
          const ang = (j / 22) * Math.PI * 2 + hash2(j, 0, 133) * 0.2;
          const d = r + UL * 0.6 + sq0 * (14 + hash2(j, 1, 133) * 12);
          f.blend(
            x + Math.cos(ang) * d,
            y + Math.sin(ang) * d + sq0 * sq0 * 14,
            P.seaDrop,
            1 - sq0
          );
        }
      // seawater dripping off its spines
      if (a > 300 && a < UNI_OPEN + 1500)
        for (let j = 0; j < 4; j++) {
          const ph = ((a + j * 230) % 920) / 920;
          const cyc = Math.floor((a + j * 230) / 920);
          const dx = (hash2(j, cyc, 130) - 0.5) * r * 1.2;
          const y0 = y + Math.sqrt(Math.max(0, r * r - dx * dx)) + r * 0.25;
          f.blend(x + dx, y0 + ph * ph * 30, P.seaDrop, 1 - ph);
          f.blend(x + dx, y0 + ph * ph * 30 - 1, P.seaDrop, (1 - ph) * 0.5);
        }
      if (a >= UNI_DOWN && a > UNI - 350) {
        // eaten: gone with a twinkle
        const q = (a - (UNI - 350)) / 350;
        twinkle(f, served.x, served.y - 1, q < 0.5 ? 2 : 1, P.uniGlint);
        return;
      }
      const opened = a >= UNI_OPEN;
      urchin(
        f,
        x,
        y,
        r,
        t,
        bristle,
        opened
          ? (_, ly) => ly >= CUT * r
          : // (still half in the box as it comes out)
            (_, ly) => a > 500 || y + ly < hako.y
      );
      if (opened) uniOpen(f, x, y, r, open, t);
      // the knife: a long blade drawn across from the right, and back out
      const kin = (a - (UNI_CUT - 300)) / 300;
      const kout = (a - UNI_CUT) / 260;
      if (kin > 0 && kout < 1) {
        const span = 2 * r + 34;
        const tip = Math.round(
          kout < 0
            ? x + r + 30 - ease(kin) * span
            : x + r + 30 - span + ease(kout) * span
        );
        const L = Math.round(r * 2.4);
        const ky = Math.round(oy);
        // (a sashimi knife: the blade deepens from the point to the heel)
        f.hline(tip + Math.round(L * 0.45), tip + L, ky - 2, P.bladeBack);
        f.hline(tip + 2, tip + L, ky - 1, P.blade);
        f.hline(tip + Math.round(L * 0.45), tip + L, ky - 1, P.bladeEdge);
        f.hline(tip + 1, tip + L, ky, P.blade);
        f.hline(tip, tip + L, ky + 1, P.bladeEdge);
        f.rect(tip + L + 1, ky - 1, 8, 3, P.handle);
        f.vline(tip + L + 1, ky - 2, ky + 2, P.bladeBack);
        // the cook's hand on it
        f.rect(tip + L + 4, ky - 2, 4, 5, P.skin);
        f.vline(tip + L + 7, ky - 2, ky + 2, P.skinShade);
        f.rect(tip + L + 8, ky - 3, 6, 7, P.cookShirt);
        f.vline(tip + L + 8, ky - 3, ky + 3, P.cookShade);
      }
      // the cut, a bright line for a moment
      const cq = (a - UNI_CUT + 150) / 400;
      if (cq > 0 && cq < 1 && !opened) {
        const rx = Math.sqrt(r * r - CUT * CUT * r * r);
        for (let dx = -rx; dx <= rx; dx++)
          f.blend(x + dx, oy, P.bladeEdge, 1 - cq);
      }
      // the top, tossed away over the shoulder, tumbling
      const lq = (a - UNI_OPEN) / 900;
      if (lq > 0 && lq < 1) {
        const lr = r * (1 - lq * 0.85);
        urchin(
          f,
          x + lq * r * 1.6,
          y -
            Math.sin(Math.min(1, lq * 2) * (Math.PI / 2)) * r * 0.9 +
            lq * lq * r * 0.8,
          lr,
          t,
          1,
          (_, ly) => ly < CUT * lr,
          lq * 2.6,
          0,
          -0.6 * lr
        );
      }
      if (opened && zoom > 0.3) {
        // sparkles bursting out of it, then glints coming and going on it
        const sq = (a - UNI_OPEN) / 800;
        if (sq < 1)
          for (let j = 0; j < 9; j++) {
            const ang = (j / 9) * Math.PI * 2 + 0.4;
            const d = r * (0.3 + 1.5 * (1 - (1 - sq) * (1 - sq)));
            twinkle(
              f,
              x + Math.cos(ang) * d,
              oy + Math.sin(ang) * d * 0.8,
              sq < 0.6 ? 2 : 1,
              P.uniGlint
            );
          }
        const gl = Math.floor((a - UNI_OPEN) / 300);
        const gq = ((a - UNI_OPEN) % 300) / 300;
        if (a > UNI_OPEN + 400 && a < UNI_SERVE) {
          const rx = Math.sqrt(r * r - CUT * CUT * r * r);
          const ang = hash2(gl, 1, 131) * Math.PI * 2;
          const d = Math.sqrt(hash2(gl, 2, 131)) * 0.75;
          twinkle(
            f,
            x + Math.cos(ang) * d * rx,
            oy + Math.sin(ang) * d * rx * 0.55,
            gq < 0.3 || gq > 0.7 ? 1 : 2,
            P.uniGlint
          );
        }
      }
    }

    function drawNoren(f: Frame, st: Stall, t: number, hovered: boolean) {
      const [cloth, hi] = st.red
        ? [P.norenRed, P.norenRedHi]
        : [P.noren, P.norenHi];
      const panels = st.tier === 2 ? 9 : 6;
      const pw = (st.w - 2) / panels;
      const len = st.norenBot - st.norenTop;
      // the shop's name across the middle panels, centred on each and moving
      // with the cloth
      const big = st.tier === 2;
      const first = big ? 3 : 2;
      const names = big ? 3 : 2;
      const gs = big ? 5 : 3;
      const gy = st.norenTop + (big ? 3 : 1);
      for (let p = 0; p < panels; p++) {
        const px0 = Math.round(st.x + 1 + p * pw);
        const px1 = Math.round(st.x + 1 + (p + 1) * pw) - 2;
        const sway = hovered
          ? Math.sin(t / 170 + p * 0.9) * 1.4
          : Math.sin(t / 1300 + p * 0.7) * 0.45;
        for (let y = st.norenTop; y < st.norenBot; y++) {
          const off = Math.round(sway * ((y - st.norenTop) / len));
          f.hline(px0 + off, px1 + off, y, y === st.norenTop ? hi : cloth);
        }
        const k = p - first;
        if (k < 0 || k >= names) continue;
        const gx =
          px0 +
          Math.floor((px1 - px0 + 1 - gs) / 2) +
          Math.round(sway * ((gy + gs / 2 - st.norenTop) / len));
        if (big) kanji(f, gx, gy, P.norenInk, st.seed * 3 + k);
        else glyph(f, gx, gy, P.norenInk, st.seed * 3 + k);
      }
    }

    function lantern(f: Frame, x: number, y: number, tier: number) {
      const lw = tier === 2 ? 6 : tier === 1 ? 5 : 3;
      const lh = tier === 2 ? 9 : tier === 1 ? 7 : 5;
      f.vline(x + (lw >> 1), y - 1, y, P.lanternCap);
      f.hline(x + 1, x + lw - 2, y, P.lanternCap);
      f.rect(x, y + 1, lw, lh - 2, P.lantern);
      f.hline(x + 1, x + lw - 2, y + 1, P.lanternHi);
      f.vline(x + 1, y + 1, y + lh - 2, P.lanternHi);
      f.vline(x + lw - 1, y + 1, y + lh - 2, P.lanternDark);
      f.hline(x + 1, x + lw - 2, y + lh - 1, P.lanternCap);
      if (tier === 2) {
        // ribs and a brushed mark
        f.hline(x + 1, x + lw - 2, y + 3, P.lanternDark);
        f.hline(x + 1, x + lw - 2, y + 6, P.lanternDark);
        f.vline(x + 3, y + 2, y + 6, P.lanternInk);
        f.set(x + 2, y + 4, P.lanternInk);
        f.vline(x + 3, y + lh, y + lh + 1, P.lanternCap);
      }
      glow(
        f,
        x + lw / 2,
        y + lh / 2,
        tier === 2 ? 12 : tier === 1 ? 9 : 6,
        P.glowWarm,
        0.32,
        1.1,
        0.18
      );
    }

    function drawCook(f: Frame, st: Stall, t: number) {
      const x = st.cookX;
      const shake = (t + st.seed * 700) % 2600;
      const up = shake < 900 && Math.floor(shake / 150) % 2 === 0 ? 1 : 0;
      // (he stands behind the noren, so his head starts below it)
      if (st.tier === 2) {
        // head with a white tenugui, white shirt, dark apron, facing us
        const top = st.norenBot;
        f.rect(x - 2, top, 5, 6, P.skin);
        f.hline(x - 2, x + 2, top, P.hair);
        f.hline(x - 2, x + 2, top + 1, P.cookShirt);
        f.set(x + 3, top + 1, P.cookShirt);
        f.vline(x + 2, top + 2, top + 5, P.skinShade);
        f.hline(x - 1, x + 1, top + 6, P.skinShade);
        f.rect(x - 5, top + 7, 11, st.counter - top - 7, P.cookShirt);
        f.vline(x + 5, top + 7, st.counter - 1, P.cookShade);
        f.rect(x - 2, top + 9, 5, st.counter - top - 9, P.apron);
        f.hline(x - 5, x + 5, top + 9, P.apron);
        // one arm up to the strainer over the pot, shaking the noodles (or
        // lifting it right up for a kaedama)
        const lift = st === main ? kaeLift(t) : 0;
        const ay = top + 7 - (lift || up * 2);
        f.line(x + 5, top + 8, x + 9, ay, P.cookShirt);
        f.set(x + 10, ay, P.skin);
        f.line(x + 10, ay, st.potX - 3, ay + 2, P.potDark);
        f.rect(st.potX - 4, ay + 2, 4, 3, P.potHi);
        f.hline(st.potX - 4, st.potX - 1, ay + 4, P.potDark);
        // the other hand holding out a bowl
        f.line(x - 5, top + 8, x - 8, top + 11, P.cookShirt);
        f.set(x - 9, top + 11, P.skin);
        f.hline(x - 13, x - 9, top + 12, P.bowl);
        f.hline(x - 12, x - 10, top + 13, P.bowl);
      } else {
        const top = st.norenBot;
        f.rect(x - 1, top, 3, 3, P.skin);
        f.hline(x - 1, x + 1, top, P.cookShirt);
        f.rect(x - 2, top + 3, 5, st.counter - top - 3, P.cookShirt);
        f.rect(x - 1, top + 4, 3, st.counter - top - 4, P.apron);
        f.hline(x + 3, x + 5, top + 4 - up, P.cookShirt);
      }
    }

    /** How long ago customer k raised their glass, if it's still up (else -1). */
    function cheerAge(st: Stall, k: number, t: number) {
      const own = t - (kanpaiAt.get(`${st.seed}:${k}`) ?? -Infinity);
      if (own >= 0 && own <= 2400) return own;
      // the whole counter cheers the uni when it's opened, in a wave
      const u = uniAge(t);
      const c = u - UNI_OPEN - 150 - k * 90;
      if (st === main && u < UNI && c >= 0 && c <= 2400) return c;
      return -1;
    }

    function drawKanpai(f: Frame, st: Stall, t: number) {
      if (st.tier !== 2) return;
      for (const [k, seat] of st.seats.entries()) {
        const age = cheerAge(st, k, t);
        if (age < 0) continue;
        // (not while they're holding a bowl up for a kaedama)
        if (seat === kaeSeat && kaeBowl(kaeAge(t))) continue;
        const look = LOOKS_XL[seat.look]!;
        const sleeve = look.pal.c!;
        // the arm comes up, the glass goes high, then back down
        const lift =
          age < 250 ? age / 250 : age > 2100 ? (2400 - age) / 300 : 1;
        const sx = seat.x + 7;
        const sy = seat.top + 9;
        const hx = sx + Math.round(lift * 2);
        const hy = sy - Math.round(lift * 12);
        f.line(sx, sy, hx, hy + 2, sleeve);
        f.line(sx + 1, sy, hx + 1, hy + 2, lerpRGB(sleeve, P.rim, 0.5));
        f.set(hx, hy + 1, P.skin);
        f.set(hx + 1, hy + 1, P.skin);
        f.rect(hx - 1, hy - 4, 4, 5, P.beer);
        f.hline(hx - 1, hx + 2, hy - 4, P.foam);
        f.hline(hx - 1, hx + 2, hy - 5, P.foam);
        f.vline(hx + 3, hy - 3, hy - 1, P.glassRim);
        if (age > 280 && age < 760) {
          // a splash of foam where the glasses meet
          const a = 1 - (age - 280) / 480;
          for (const [dx, dy] of [
            [0, -8],
            [-2, -7],
            [3, -7],
            [1, -10],
            [-3, -9],
          ] as const)
            f.blend(hx + dx, hy + dy, P.foam, a);
        }
      }
    }

    function drawWillow(f: Frame, t: number) {
      const x = willowX;
      const foot = WALK + 3;
      const top = 62;
      // the trunk, leaning a little over the water, and two big limbs
      for (let y = top; y <= foot; y++) {
        const v = (foot - y) / (foot - top);
        const tx = Math.round(x - v * v * 6);
        f.hline(tx - (y > foot - 8 ? 2 : 1), tx + 1, y, P.bark);
      }
      f.line(x - 4, top + 10, x - 18, top + 2, P.bark);
      f.line(x - 3, top + 14, x + 10, top + 4, P.bark);
      f.line(x - 18, top + 2, x - 24, top + 6, P.bark);
      // the crown: a few overlapping domes, lit from the lamp on the left
      const gust = t - gustAt < 3000 ? 1 + 2.5 * (1 - (t - gustAt) / 3000) : 1;
      const lean = Math.sin(t / 2600) * 0.6 * gust;
      for (const p of crown) {
        const sway = Math.round(lean * p.v);
        f.set(p.x + sway, p.y, p.c);
      }
      // strands falling from the rim, swinging more towards their tips
      for (const st of strands) {
        for (let k = 0; k < st.len; k++) {
          const v = k / st.len;
          const sway =
            Math.sin(t / 1500 + st.ph + v * 1.3) * (0.4 + v * v * 2.2) * gust +
            lean;
          const c =
            k === st.len - 1
              ? st.tip
              : (k + st.ph * 3) % 6 < 1
                ? P.willowHi
                : st.c;
          f.set(st.x + Math.round(sway), st.y + k, c);
        }
      }
    }

    // passers-by along the railing, behind the stalls
    const walkers = Array.from(
      { length: Math.max(2, Math.round(w / 120)) },
      (_, i) => ({
        offset: hash2(i, 0, 51) * (w + 20),
        speed: (0.006 + hash2(i, 1, 51) * 0.006) * (i % 2 ? 1 : -1),
        tall: hash2(i, 2, 51) > 0.5 ? 1 : 0,
      })
    );

    /** Puffs of steam rising, swelling and thinning out: clean blobs, no dither. */
    function steam(
      f: Frame,
      x: number,
      y: number,
      t: number,
      height: number,
      width: number,
      strong: number,
      seed: number
    ) {
      const n = Math.round(9 + strong * 8);
      for (let i = 0; i < n; i++) {
        const life = 2600 - strong * 700;
        const ph = (t / life + i / n + hash2(i, 0, seed) * 0.15) % 1;
        const rise = ph * height * (1 + strong * 0.5);
        const px =
          x +
          Math.sin(ph * 4 + i * 1.7 + t / 900) * (1 + ph * 2.5) +
          ph * ph * 6 +
          (hash2(i, 1, seed) - 0.5) * width;
        const py = y - rise;
        const r = 1 + ph * width * 1.3 * (1 + strong * 0.6);
        const a =
          (ph < 0.12 ? ph / 0.12 : 1 - (ph - 0.12) / 0.88) *
          (0.8 + strong * 0.2);
        const c = ph < 0.4 ? P.steam : P.steam2;
        const ri = Math.ceil(r);
        for (let dy = -ri; dy <= ri; dy++)
          for (let dx = -ri; dx <= ri; dx++) {
            if (dx * dx + dy * dy > r * r + 0.5) continue;
            // a brighter top on each puff
            f.blend(px + dx, py + dy, c, dy < 0 ? a : a * 0.7);
          }
      }
    }

    function drawWalkers(f: Frame, t: number) {
      for (const p of walkers) {
        const span = w + 20;
        const x =
          Math.round((((p.offset + t * p.speed) % span) + span) % span) - 10;
        const step = Math.floor(t / 260 + p.offset) % 2;
        const foot = WALK + 3;
        const top = foot - 15 - p.tall;
        f.rect(x, top, 3, 3, P.walker);
        f.rect(x - 1, top + 3, 5, 6 + p.tall, P.walker);
        f.vline(x - 1, top + 3, top + 5, P.walkerRim);
        f.set(x + 1, top, P.walkerRim);
        f.vline(x + (step ? 0 : 2), top + 9 + p.tall, foot, P.walker);
        f.vline(x + (step ? 2 : 0), top + 9 + p.tall, foot - 1, P.walker);
      }
    }

    // a plane comes over every 38 s; a click on the sky calls one sooner
    const scheduledPlane = (t: number) => (t % 38_000) / 14_000;
    function drawPlane(f: Frame, t: number) {
      const called = t - planeCalledAt < 9000;
      if (!called) {
        // the scheduled flight that a called plane stood in for doesn't
        // pop in halfway across once the called one has gone
        const start = t - (t % 38_000);
        if (start < planeCalledAt + 9000 && start + 14_000 > planeCalledAt)
          return;
      }
      const p = called ? (t - planeCalledAt) / 9000 : scheduledPlane(t);
      if (p > 1) return;
      const x = Math.round(w + 20 - p * (w + 40));
      const y = 14 + Math.round(p * 12);
      // a jet on approach, gear down, landing lights blazing
      f.hline(x, x + 13, y, P.plane);
      f.hline(x + 1, x + 12, y - 1, P.planeHi);
      f.line(x + 5, y, x + 9, y + 3, P.plane);
      f.line(x + 11, y - 1, x + 13, y - 4, P.plane);
      f.set(x + 6, y + 1, P.plane);
      f.set(x + 6, y + 2, P.plane);
      for (let k = 2; k < 11; k += 2) f.set(x + k, y - 1, P.win2);
      f.set(x, y, P.planeLight);
      glow(f, x - 1, y, 5, P.planeLight, 0.3, 0.7, 0.15);
      if (Math.floor(t / 500) % 2) f.set(x + 9, y + 3, P.navRed);
      if (t % 1200 < 90) f.set(x + 13, y - 4, P.planeLight);
    }

    function drawBoat(f: Frame, t: number) {
      const p = ((t + 9000) % 46_000) / 30_000;
      if (p > 1) return;
      const L = 34;
      const x = Math.round(-L + p * (w + L));
      const y = RIVER + 13; // waterline
      // a river cruiser: dark hull, a warm-lit cabin, red lanterns along the roof
      f.rect(x + 1, y - 2, L - 2, 3, P.boat);
      f.hline(x, x + L - 1, y - 3, P.boatHi);
      f.set(x + L, y - 4, P.boatHi);
      f.set(x - 1, y - 4, P.boatHi);
      f.rect(x + 4, y - 8, L - 8, 5, P.woodDark);
      f.hline(x + 5, x + L - 6, y - 7, P.insideHi);
      f.hline(x + 5, x + L - 6, y - 6, P.inside);
      f.hline(x + 5, x + L - 6, y - 5, P.insideLow);
      for (let k = x + 8; k < x + L - 6; k += 5)
        f.vline(k, y - 7, y - 5, P.woodDark);
      f.hline(x + 3, x + L - 4, y - 9, P.roof);
      f.hline(x + 2, x + L - 3, y - 10, P.roofHi);
      for (let k = x + 4; k < x + L - 4; k += 4)
        f.rect(k, y - 12, 2, 2, P.lantern);
      // its warm light shivering on the water
      for (let k = 0; k < L - 8; k += 2) {
        const wob = Math.round(Math.sin(t / 300 + k) * 1);
        f.blend(x + 5 + k + wob, y + 1, P.inside, 0.45);
        f.blend(x + 6 + k - wob, y + 3, P.inside, 0.25);
      }
    }

    const riverRows: number[] = [];
    {
      const tmp = layer(1, h, (f) =>
        gradient(f, RIVER, EDGE, [P.river0, P.river1, P.river2], 0, 1)
      );
      for (let y = RIVER; y < EDGE; y++) riverRows.push(tmp.pixels[y]!);
    }

    function river(f: Frame, t: number) {
      const px = f.pixels;
      const depth = EDGE - RIVER;
      for (let y = RIVER; y < EDGE; y++) {
        const d = y - RIVER;
        const sy = Math.max(1, FAR - 1 - Math.floor(d * 2.3));
        const band = Math.floor((d + t / 260) / 2);
        const broken = (d + Math.floor(t / 320)) % 5 === 0;
        const wob =
          Math.round(Math.sin(band * 1.9 + t / 800) * (0.5 + d * 0.08)) +
          (broken ? (band % 2 ? 2 : -2) : 0);
        const fade = (1 - d / (depth + 14)) * (broken ? 0.5 : 1);
        const base = riverRows[d]!;
        const br = base & 0xff;
        const bg = (base >>> 8) & 0xff;
        const bb = (base >>> 16) & 0xff;
        const row = y * w;
        const s0 = sy * w;
        const s1 = s0 - w;
        for (let x = 0; x < w; x++) {
          const xc = Math.min(w - 1, Math.max(0, x + wob));
          const xp = xc + 1 < w ? xc + 1 : xc;
          const a0 = px[s0 + xc]!;
          const a1 = px[s0 + xp]!;
          const a2 = px[s1 + xc]!;
          const a3 = px[s1 + xp]!;
          let r = ((a0 & 0xff) + (a1 & 0xff) + (a2 & 0xff) + (a3 & 0xff)) >> 2;
          let g =
            (((a0 >>> 8) & 0xff) +
              ((a1 >>> 8) & 0xff) +
              ((a2 >>> 8) & 0xff) +
              ((a3 >>> 8) & 0xff)) >>
            2;
          let b =
            (((a0 >>> 16) & 0xff) +
              ((a1 >>> 16) & 0xff) +
              ((a2 >>> 16) & 0xff) +
              ((a3 >>> 16) & 0xff)) >>
            2;
          const lum = r * 0.3 + g * 0.55 + b * 0.15;
          let a: number;
          if (lum > 95) {
            const m =
              (a0 & 0xff) + ((a0 >>> 8) & 0xff) >
              (a2 & 0xff) + ((a2 >>> 8) & 0xff)
                ? a0
                : a2;
            r = m & 0xff;
            g = (m >>> 8) & 0xff;
            b = (m >>> 16) & 0xff;
            a = 0.8 * fade;
          } else if (lum > 50) a = 0.45 * fade;
          else a = 0.2 * fade;
          px[row + x] =
            (0xff000000 |
              ((bb + (b - bb) * a) << 16) |
              ((bg + (g - bg) * a) << 8) |
              (br + (r - br) * a)) >>>
            0;
        }
      }
      // shimmer
      for (let y = RIVER + 1; y < EDGE; y += 2) {
        const count = Math.round(w / 30);
        for (let i = 0; i < count; i++) {
          const ph = hash2(i, y, 61);
          if (Math.sin(t / 900 + ph * 25) < 0.65) continue;
          const len = 1 + Math.round(hash2(i, y, 62) * 3);
          const x = Math.floor(
            hash2(i, y, 63) * w + Math.sin(t / 2000 + ph * 9) * 3
          );
          for (let k = 0; k < len; k++) f.blend(x + k, y, P.riverHi, 0.45);
        }
      }
    }

    // ---------- hit areas ----------
    const stallAt = (x: number, y: number) =>
      stalls
        .slice()
        .reverse()
        .find(
          (st) =>
            x >= st.x - 6 &&
            x <= st.x + st.w + 5 &&
            y >= st.roofTop - 9 &&
            y < st.g
        );
    const seatAt = (st: Stall, x: number, y: number) =>
      st.tier === 2
        ? st.seats.findIndex(
            (s) =>
              x >= s.x - 1 &&
              x <= s.x + 9 &&
              y >= s.top - 1 &&
              y <= st.bench + 1
          )
        : -1;
    const signAt = (x: number, y: number) => {
      for (let k = signs.length - 1; k >= 0; k--) {
        const s = signs[k]!;
        if (
          s.kind === 'tate' &&
          x >= s.x - 1 &&
          x <= s.x + 5 &&
          y >= s.y - 1 &&
          y <= s.y + s.len
        )
          return k;
        if (
          s.kind === 'board' &&
          x >= s.x - 1 &&
          x <= s.x + s.len &&
          y >= s.y - 1 &&
          y <= s.y + 5
        )
          return k;
      }
      return -1;
    };
    const onWillow = (x: number, y: number) =>
      Math.abs(x - willowX + 2) < 20 && y > 56 && y < WALK;

    return {
      render(f, t, pointer) {
        f.copyFrom(base);
        drawTower(f, t);
        drawPlane(f, t);
        drawSigns(f, t);
        river(f, t);
        drawBoat(f, t);
        riverFx.draw(f, t);
        f.over(walk);
        for (const lx of lamps) glow(f, lx, 82, 9, P.lamp, 0.4, 1, 0.18);
        drawWalkers(f, t);
        drawWillow(f, t);
        f.over(stallLayer);
        const hover = pointer ? stallAt(pointer.x, pointer.y) : undefined;
        for (const st of stalls) {
          drawNoren(f, st, t, st === hover);
          drawCook(f, st, t);
          if (st === main) drawKaedama(f, t);
          drawKanpai(f, st, t);
          // lanterns at the front corners, swinging harder after a knock
          const kicked = t - (swingAt.get(st.seed) ?? -Infinity);
          const amp = kicked < 2500 ? 2.2 * (1 - kicked / 2500) : 0.5;
          const sw = Math.round(
            Math.sin(t / (kicked < 2500 ? 150 : 1000) + st.seed) * amp
          );
          const ly = st.roofTop + 3;
          const lw = st.tier === 2 ? 6 : st.tier === 1 ? 5 : 3;
          lantern(f, st.x - lw - 1 + sw, ly, st.tier);
          lantern(f, st.x + st.w + 1 + sw, ly, st.tier);
          // a bulb inside and the steam off the pots
          glow(
            f,
            st.cookX,
            st.norenBot + 1,
            st.tier === 2 ? 18 : 9,
            P.insideHi,
            0.25,
            0.7,
            0.14
          );
          const burst = t - (burstAt.get(st.seed) ?? -Infinity);
          const strong = burst < 2500 ? 1 - burst / 2500 : 0;
          const near = st.tier === 2;
          steam(
            f,
            st.potX - (near ? 3 : 1),
            st.counter - (near ? 14 : 7),
            t + st.seed * 900,
            near ? 40 : 20,
            near ? 3 : 1.6,
            strong,
            st.seed
          );
          // and a thinner smoke off the grill
          if (near)
            steam(
              f,
              st.x + Math.round(st.ppm * 0.6),
              st.counter - 8,
              t + 400,
              18,
              1.4,
              0,
              9
            );
        }
        drawHako(f, t);
        fx.draw(f, t);
        drawUni(f, t);
      },
      poke(x, y, t) {
        if (onUni(x, y)) {
          if (!uniBusy(t)) uniAt = t;
          return;
        }
        const st = stallAt(x, y);
        if (st) {
          if (st === main && onCook(x, y)) {
            if (!kaeBusy(t)) {
              kaeAt = t;
              // the pot's lid's off for it: a big gust of steam
              if (t - (burstAt.get(main.seed) ?? -Infinity) >= 2500)
                burstAt.set(main.seed, t);
            }
            return;
          }
          const k = seatAt(st, x, y);
          // (a click never restarts something that's still going)
          const raising = (j: number) => cheerAge(st, j, t) >= 0;
          if (k >= 0) {
            // kanpai: the one you clicked and a neighbour raise their glasses
            if (raising(k)) return;
            kanpaiAt.set(`${st.seed}:${k}`, t);
            const n = k + 1 < st.seats.length ? k + 1 : k - 1;
            if (n >= 0 && !raising(n)) kanpaiAt.set(`${st.seed}:${n}`, t + 120);
            return;
          }
          if (t - (burstAt.get(st.seed) ?? -Infinity) < 2500) return;
          swingAt.set(st.seed, t);
          burstAt.set(st.seed, t);
          return;
        }
        const s = signAt(x, y);
        if (s >= 0) {
          if (t - (flickAt.get(s) ?? -Infinity) < 700) return;
          flickAt.set(s, t);
          bumps.set(
            s,
            (bumps.get(s) ?? 0) + 1 + Math.floor(hash2(s, Math.floor(t), 3) * 3)
          );
          return;
        }
        if (onWillow(x, y)) {
          if (t - gustAt >= 3000) gustAt = t;
          return;
        }
        if (y >= RIVER && y < EDGE) {
          riverFx.add(t, 1800, (f, age) => {
            for (let k = 0; k < 3; k++) {
              const a = age - k * 220;
              if (a < 0 || a > 1300) continue;
              const p = a / 1300;
              const r = 2 + p * 12;
              const c = p < 0.4 ? P.neonWhite : P.riverHi;
              const n = Math.ceil(r * 5);
              for (let i = 0; i < n; i++) {
                const ang = (i / n) * Math.PI * 2;
                f.set(
                  Math.round(x + Math.cos(ang) * r),
                  Math.round(y + Math.sin(ang) * r * 0.3),
                  c
                );
              }
            }
          });
          splash(riverFx, t, x, y, P.riverHi, Math.round(t));
          return;
        }
        if (y < RIVER) {
          // not while a plane is already on its way across
          if (t - planeCalledAt > 9000 && scheduledPlane(t) > 1)
            planeCalledAt = t;
          sparkle(fx, t, x, y, P.starHi);
        }
      },
      hot(x, y) {
        return !!stallAt(x, y) || onWillow(x, y) || onUni(x, y) || y < EDGE;
      },
      eggs(t) {
        const out: EggSpot[] = [];
        // the cook at the big stall
        if (!kaeBusy(t)) out.push({ id: 'kaedama', ...cookSpot, r: COOK_R });
        // the box of sea urchins on the crates beside it
        if (!uniBusy(t)) out.push({ id: 'uni', ...uniSpot, r: UNI_R });
        return out;
      },
    };
  },
};
