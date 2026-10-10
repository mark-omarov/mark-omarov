// Yokohama's Minato Mirai at night, from the deck of Osanbashi pier: the
// Landmark Tower with its stepped crown, the three Queen's Square towers
// stepping down to the sea, the Cosmo Clock 21 wheel with its light show
// and the giant clock in the hub, the sail of the InterContinental, the Red
// Brick Warehouses, Air Cabin gondolas gliding over the canal, and boats
// crossing a harbour that doubles all of it.
//
// Click the wheel to change its light show, the sky for fireworks over the
// harbour, the water for a boat, the ropeway to light up the cabins, the
// Landmark to change its crown, the gull to send it flying. Out past the
// warehouses a giant robot keeps watch over the harbour; say hello. And one
// gondola on the wheel glows pink, with a family inside: tap it for a windy
// ride.

import { bayer8, Frame, lerpRGB, type RGB } from '../frame';
import { firework, Fx, sparkle, splash } from '../fx';
import { hash2 } from '../noise';
import { clouds, glow, gradient, moon, stars } from '../paint';
import {
  type EggSpot,
  layer,
  palette,
  type Pointer,
  type Scene,
} from '../scene';
import { type Beacon, blinkBeacons, skyline } from '../things/city';

const P = palette({
  sky0: '#060a22',
  sky1: '#0a1030',
  sky2: '#0f173e',
  sky3: '#15204e',
  sky4: '#1d2a60',
  sky5: '#28346e',
  sky6: '#383c7c',
  haze: '#7a4f9a',
  star: '#7f8cc6',
  starHi: '#e8eeff',
  moonLight: '#fff1cf',
  moonMid: '#e2c98f',
  moonDark: '#a08a6a',
  cloudLight: '#6c5aa2',
  cloudBase: '#2e2f6a',
  cloudShadow: '#1d2254',
  // far city
  farBody: '#1a2354',
  farEdge: '#242e66',
  farDark: '#141b46',
  farWin: '#4f5f9e',
  // office towers
  midBody: '#202a60',
  midEdge: '#303c7a',
  midDark: '#171f4e',
  winCool: '#d2e2ff',
  winWarm: '#ffd68a',
  winWarm2: '#ffeab8',
  winDim: '#323f7a',
  // Landmark Tower
  lmLit: '#4a5594',
  lmBody: '#39437e',
  lmShade: '#272f62',
  lmNotch: '#1b2252',
  crown: '#bcd8ff',
  crownHi: '#f4f9ff',
  crownGlow: '#8ab4ff',
  crownPink: '#ff8fd0',
  crownPinkHi: '#ffe0f4',
  crownGold: '#ffc864',
  crownGoldHi: '#fff2c8',
  // Queen's Square
  qLit: '#56649f',
  qBody: '#404c8a',
  qShade: '#2b346a',
  // InterContinental
  sail: '#eef1fa',
  sailMid: '#c2cbe4',
  sailShade: '#8590ba',
  sailDeep: '#5c6694',
  sailWin: '#ffe0a0',
  sailWinCool: '#cfe0ff',
  sailGlow: '#9ec4ff',
  // Pacifico
  shell: '#a6b0d2',
  shellShade: '#6a76a6',
  // Red Brick Warehouse
  brick: '#b04f38',
  brickLit: '#cf6d48',
  brickShade: '#7a3428',
  brickRoof: '#2a2038',
  brickRoofHi: '#4c3a56',
  archWin: '#ffcf72',
  archWinHi: '#fff1c4',
  iron: '#1a1428',
  // wheel
  steel: '#a2b4e0',
  steelDark: '#4c5c94',
  spokeOff: '#34418a',
  hub: '#0a0d26',
  hubRing: '#6f80c0',
  digit: '#8cf7d4',
  digitDim: '#1c3a46',
  gondola: '#e4ecff',
  gondolaWin: '#ffe2a0',
  arcade: '#ff6ad2',
  arcade2: '#46d8ff',
  arcade3: '#ffe45a',
  baseBody: '#1b2154',
  baseHi: '#2c347a',
  // ropeway
  cable: '#8a98d0',
  cableDark: '#3c4886',
  pylon: '#dfe6f8',
  pylonShade: '#8c98c4',
  cabin: '#eef2ff',
  cabinShade: '#a6b0d4',
  cabinWin: '#ffd88a',
  station: '#c8d2ee',
  stationShade: '#7c88b6',
  stationGlass: '#ffe6b0',
  // shore
  quay: '#161c46',
  quayHi: '#3c4886',
  tree: '#0f1638',
  treeHi: '#1b2552',
  lamp: '#ffe2a0',
  // water
  water0: '#121c4e',
  water1: '#0d1540',
  water2: '#090f32',
  water3: '#060a24',
  waterHi: '#5a72bc',
  // boats
  hull: '#e8ecf6',
  hullShade: '#98a2c6',
  hullBlue: '#2c4cb0',
  hullRed: '#c83a4a',
  boatDark: '#141a3e',
  boatWin: '#ffd88a',
  navRed: '#ff3a3a',
  navGreen: '#3aff8a',
  wake: '#a8bcf0',
  // the deck we stand on
  deck: '#15163a',
  deckHi: '#24264e',
  plank: '#0e0f2c',
  rail: '#0a0a1f',
  railHi: '#363c72',
  people: '#07071a',
  peopleRim: '#4a508c',
  phone: '#d6ecff',
  lampPost: '#0c0c22',
  lampPostHi: '#2e3266',
  lampGlass: '#ffe7a8',
  lampGlassHi: '#fffbe8',
  lampWarm: '#ffa848',
  deckLit: '#3a2c44',
  deckLitHi: '#5a3e48',
  gull: '#eef0f8',
  gullShade: '#9aa2c4',
  beacon: '#ff3b3b',
  fwWhite: '#fffbe6',
  fwGold: '#ffd060',
  fwRed: '#ff5050',
  fwPink: '#ff70c8',
  fwViolet: '#8a5ad8',
  fwCyan: '#58e0ff',
  fwBlue: '#4a6ae8',
  fwGreen: '#7af080',
  // the giant robot on Yamashita Pier, and its gantry
  mech: '#eef2fa',
  mechShade: '#aab4d4',
  mechBlue: '#2c50c0',
  mechBlueLit: '#5a84ec',
  mechRed: '#d8303c',
  mechJoint: '#5a6290',
  mechDark: '#1a1e3e',
  visor: '#5ad8f0',
  visorHi: '#e8ffff',
  gantry: '#46508c',
  gantryLit: '#8692cc',
  gantryLamp: '#ffd88a',
  flood: '#e4ecff',
  beam: '#dfe8ff',
  // the windy ride: gusts, leaves, somebody's hat
  wind: '#c4d4ff',
  windHi: '#f2f6ff',
  leaf1: '#e8a848',
  leaf2: '#d0683c',
  leaf3: '#a6b84e',
  hat: '#f2deaa',
  hatShade: '#b89c66',
  hatBand: '#e0404e',
  // their gondola, close up
  gFrame: '#e8eeff',
  gFrameMid: '#b8c2e2',
  gFrameShade: '#7c88b6',
  gFrameDark: '#4a5486',
  gIn: '#fbdca4',
  gInMid: '#ecbd84',
  gInLo: '#c98e5e',
  gInCool: '#a8acd0',
  gInCoolLo: '#7c80aa',
  gSeat: '#7a3c44',
  gSeatHi: '#a0505a',
  gGlass: '#ffffff',
  // the man: short light-brown hair and a short beard, black hoodie (white
  // drawstrings, small orange logo), jeans
  manHair: '#8a6a48',
  manHairHi: '#b08a60',
  manHairSh: '#5e4630',
  manBeard: '#7a5a3c',
  manEye: '#2a1e1a',
  manMouth: '#6a3028',
  manSkin: '#e09a74',
  manKnuckle: '#f4d0b8',
  manSkinSh: '#a8664c',
  manHood: '#36333d',
  manHoodHi: '#615b69',
  manHoodSh: '#1c1a22',
  manString: '#e9e5dc',
  manLogo: '#ff8a1e',
  manJeans: '#3a62a8',
  manJeansHi: '#6f95d2',
  sweat: '#9ad8ff',
  // the woman: long, straight, near-black hair, an oatmeal sweater
  womanHair: '#17121a',
  womanHairHi: '#4a3430',
  womanKnit: '#9a8c7c',
  womanKnitHi: '#e4c49c',
  womanKnitSh: '#5a524c',
  womanLegs: '#2c2c3a',
  // the kid: long brown hair under a teal beanie with a pom-pom, red jacket
  kHair: '#6a4630',
  kPom: '#f4ead0',
  kHat: '#1e5a58',
  kHatHi: '#3e9080',
  kCoat: '#b02e2c',
  kCoatHi: '#ee5e40',
  kLegs: '#2a2e40',
  kBoots: '#141420',
});

// A generic white, blue and red mecha, facing us: a plain round helmet with
// a visor, no fin. Its right arm (on our right) is drawn separately so it
// can wave. w white, W white in shade, b blue, B blue lit, r red, k dark,
// g joint, v visor.
const ROBO = [
  '....www....',
  '...wwwww...',
  '...wvvvw...',
  '....kgk....',
  '.wwWbbbWww.',
  'wwWbBbbbWww',
  'wW.rrbrr...',
  'wW.wwwww...',
  'gk.wkkkw...',
  '...bbkbb...',
  '...bb.bb...',
  '...ww.ww...',
  '...wW.wW...',
  '...bb.bb...',
  '..wwb.bww..',
  '..rrr.rrr..',
];
/** The right arm, as [col, row, colour key]: hanging, half raised, waving (two beats). */
const ROBO_ARM: [number, number, string][][] = [
  [
    [9, 6, 'W'],
    [10, 6, 'w'],
    [9, 7, 'W'],
    [10, 7, 'w'],
    [9, 8, 'k'],
    [10, 8, 'g'],
  ],
  [
    [11, 5, 'w'],
    [12, 5, 'W'],
    [12, 4, 'w'],
    [12, 3, 'w'],
    [12, 2, 'g'],
  ],
  [
    [10, 3, 'w'],
    [11, 3, 'W'],
    [11, 2, 'w'],
    [11, 1, 'w'],
    [11, 0, 'g'],
    [11, -1, 'w'],
  ],
  [
    [10, 3, 'w'],
    [11, 3, 'W'],
    [11, 2, 'w'],
    [12, 1, 'w'],
    [12, 0, 'g'],
    [13, -1, 'w'],
  ],
];

const SHORE = 103; // the Minato Mirai waterfront
const RAIL = 134; // top of the railing in front of us
const DECK = 141; // Osanbashi's wooden deck
const R = 27; // Cosmo Clock 21 rim
const HUB = 9; // the clock in the middle

const LED: RGB[] = [
  0xff4a6a, 0xff9a3a, 0xffe45a, 0x6ae67a, 0x46d8ff, 0x5a78ff, 0xb46aff,
  0xff6ad2,
];
const LED_DIM: RGB[] = LED.map((c) => lerpRGB(c, 0x1a2260, 0.62));
const SAKURA: RGB[] = [0xffb0e0, 0xff6ad2, 0xfff0fa];

/** The time in Japan right now (UTC+9, no daylight saving). */
function japanTime() {
  const d = new Date(Date.now() + 9 * 3_600_000);
  return {
    h: d.getUTCHours(),
    m: d.getUTCMinutes(),
    s: d.getUTCSeconds() + d.getUTCMilliseconds() / 1000,
  };
}

// 3x5 digits for the clock
const DIGITS = [
  '111101101101111',
  '010110010010111',
  '111001111100111',
  '111001111001111',
  '101101111001001',
  '111100111001111',
  '111100111101111',
  '111001001001001',
  '111101111101111',
  '111101111001111',
];

function digit(f: Frame, x: number, y: number, n: number, c: RGB) {
  const d = DIGITS[n]!;
  for (let i = 0; i < 15; i++)
    if (d[i] === '1') f.set(x + (i % 3), y + Math.floor(i / 3), c);
}

/** Pixels on a 1px circle of radius r, sorted by angle. */
function ringPoints(r: number) {
  const pts: { dx: number; dy: number; a: number }[] = [];
  const n = Math.ceil(r) + 1;
  for (let dy = -n; dy <= n; dy++)
    for (let dx = -n; dx <= n; dx++) {
      const d = Math.hypot(dx, dy);
      if (Math.abs(d - r) < 0.5) pts.push({ dx, dy, a: Math.atan2(dy, dx) });
    }
  return pts.sort((p, q) => p.a - q.a);
}

// people on the deck, backs to us, looking at the view
const MAN = [
  '.###.',
  '#####',
  '.###.',
  '..#..',
  '#####',
  '#####',
  '#####',
  '#####',
  '#####',
  '.###.',
  '.#.#.',
  '.#.#.',
  '.#.#.',
  '.#.#.',
];
const WOMAN = [
  '..##.',
  '.####',
  '.####',
  '#####',
  '.####',
  '.####',
  '.####',
  '..##.',
  '.####',
  '.####',
  '..#.#',
  '..#.#',
];
const PHOTOGRAPHER = [
  '..sss..',
  '..sss..',
  '.#...#.',
  '.#.#.#.',
  '.#####.',
  '##.#.##',
  '.#####.',
  '.#####.',
  '.#####.',
  '.#####.',
  '..###..',
  '..#.#..',
  '..#.#..',
  '..#.#..',
  '..#.#..',
];
const KID = [
  '....#',
  '.##.#',
  '####.',
  '.###.',
  '.###.',
  '.###.',
  '.#.#.',
  '.#.#.',
];

// The family up in their gondola, seen through its window, facing us.
// The man, seated, gripping the bench with straight arms, shoulders up round
// his ears, teeth gritted: H hair, h hair lit, D hair shade, b beard, s skin,
// S skin shade, E eyes, M mouth, J hoodie, j hoodie lit, K hoodie shade,
// w drawstrings, 5 logo, L jeans, l jeans lit, k knuckles.
const MAN_RIDE = [
  '....HHhHHH.....',
  '...HHhhHhHH....',
  '...DHHHHHHHD...',
  '...DsssssssD...',
  '...bsEsssEsb...',
  '...bsssSsssb...',
  '....bbMMMbb....',
  '.....bbbbb.....',
  '..jJJJJJJJJJK..',
  '.jJJJJwJwJJJJK.',
  'jJJJJJwJwJJJJJK',
  'jJ.JJJwJwJJJ.JK',
  'jJ.JJJJJJJJJ.JK',
  'jJ.JJJJJJ5JJ.JK',
  'jJ.JJJJJJJJJ.JK',
  'jJ.JJJJJJJJJ.JK',
  'jJ.KKKKKKKKK.JK',
  'jJ.lLLLLLLLL.JK',
  'sk.lLLLLLLLL.ks',
  'ss.lLLLLLLLL.ss',
];
// the woman beside him, an arm out to steady the little one: H hair, h hair
// lit, s skin, S skin shade, W sweater, w sweater lit, K sweater shade,
// L trousers
const WOMAN_RIDE = [
  '....hHHHH....',
  '...hHHHHHH...',
  '..hHHHHHHHH..',
  '..HHsssssHH..',
  '..HsssssssH..',
  '..HsssssssH..',
  '..HHsssssHH..',
  '..HH.SSS.HH..',
  '..HwWWWWWKH..',
  '.wwWWWWWWWH..',
  'wwWWWWWWWWH..',
  's.wWWWWWWWK..',
  '..wWWWWWWWK..',
  '..wWWWWWWWK..',
  '..wWWWWWWWK..',
  '..KKKKKKKKK..',
  '..LLLLLLLLL..',
  '..LLLLLLLLL..',
];
// the kid, standing on the bench and bouncing: arms up in the air,
// then out as she lands. p pom-pom, Y beanie, y beanie lit, H hair, s skin,
// R coat, r coat lit, T trousers, e boots
const KID_UP = [
  '.....p.....',
  's...YYy...s',
  'R..YYYYy..R',
  'R..YYYyy..R',
  '.R.HsssH.R.',
  '.R.HsssH.R.',
  '..RsssssR..',
  '...RRRRr...',
  '..RRRRRrr..',
  '..RRRRRrr..',
  '..RRRRRrr..',
  '...TT.Tt...',
  '...TT.Tt...',
  '...ee.ee...',
];
const KID_LAND = [
  '.....p.....',
  '....YYy....',
  '...YYYYy...',
  '...YYYyy...',
  '...HsssH...',
  '...HsssH...',
  '...HsssH...',
  'srRRRRRrrrs',
  '..RRRRRrr..',
  '..RRRRRrr..',
  '..RRRRRrr..',
  '..TT...Tt..',
  '..TT...Tt..',
  '.ee.....ee.',
];
// strangers in the next gondolas along, sitting tight: # dark, o rim lit
const STRANGER = [
  '...ooo...',
  '..o###o..',
  '..#####..',
  '..#####..',
  '...###...',
  '.ooooooo.',
  'o#######o',
  '#########',
  '#########',
  '#########',
  '#########',
  '#########',
  '#########',
];
// somebody's sun hat, tumbling in the wind: four turns of it
const HAT = [
  ['...hhh...', '..hhhhh..', '.bbbbbbb.', 'sssssssss'],
  ['s...', 'sb..', 'sbh.', 'sbhh', 'sbhh', 'sbhh', 'sbh.', 'sb..', 's...'],
  ['sssssssss', '.bbbbbbb.', '..hhhhh..', '...hhh...'],
  ['...s', '..bs', '.hbs', 'hhbs', 'hhbs', 'hhbs', '.hbs', '..bs', '...s'],
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => {
  const u = clamp01(v);
  return u * u * (3 - 2 * u);
};
/** The integral of smooth() from 0 to v (v in 0..1). */
const smoothArea = (v: number) => {
  const u = clamp01(v);
  return u * u * u - (u * u * u * u) / 2;
};

/** A silhouette backlit by the city: edges facing up and out catch the light. */
function figure(
  f: Frame,
  rows: readonly string[],
  x: number,
  foot: number,
  flip = false
) {
  const top = foot - rows.length + 1;
  const wd = Math.max(...rows.map((r) => r.length));
  const at = (rx: number, ry: number) => {
    const row = rows[ry];
    if (!row) return false;
    const c = row[flip ? wd - 1 - rx : rx];
    return c !== undefined && c !== '.' && c !== 's';
  };
  for (let ry = 0; ry < rows.length; ry++)
    for (let rx = 0; rx < wd; rx++) {
      if (!at(rx, ry)) continue;
      const upper = ry < rows.length * 0.6;
      const rim =
        !at(rx, ry - 1) || (upper && (!at(rx - 1, ry) || !at(rx + 1, ry)));
      f.set(x + rx, top + ry, rim ? P.peopleRim : P.people);
    }
}

export const yokohama: Scene = {
  id: 'yokohama',
  name: 'Yokohama',
  country: 'Japan',
  create(w, h) {
    const cx = Math.round(w / 2);
    const wheelX = cx + Math.round(Math.min(26, w * 0.07));
    const wheelY = SHORE - 9 - R;
    const lmX = wheelX - Math.round(Math.min(108, 30 + w * 0.18));
    const lmTop = 15;
    const qx = lmX + 13; // Queen's Square tower A
    const sailX = wheelX + R + 5;
    const sailW = 25;
    const sailTop = SHORE - 47;
    const rbX = sailX + sailW + 12; // Red Brick Warehouses
    const bbX = rbX + 96; // Bay Bridge's nearer tower
    // the giant robot's gantry, past the warehouses or at the right edge;
    // on a narrow screen it takes the place of the warehouses it would
    // cover, and would rather run its far tower off the edge than stand
    // over the hotel (as long as the robot itself stays in view)
    const RX =
      rbX + 91 <= w
        ? rbX + 81
        : Math.min(w - 6, Math.max(w - 12, sailX + sailW + 13)); // its centre column
    const clearOfGantry = (x0: number, x1: number) =>
      x1 < RX - 13 || x0 > RX + 13;
    const sheds = (
      [
        [rbX, 34],
        [rbX + 42, 24],
      ] as const
    ).filter(([x0, len]) => x0 < w + 10 && clearOfGantry(x0 - 1, x0 + len));
    const shedsEnd = sheds.reduce((e, [x0, len]) => Math.max(e, x0 + len), 0);
    const pacificoX = sailX + sailW - 2;
    const pacifico = clearOfGantry(pacificoX, pacificoX + 11);
    // the Air Cabin: from Sakuragicho over the canal to the foot of the wheel
    const rwA = lmX - 64;
    const rwB = wheelX - R - 10;
    const rwP = Math.round(rwA + (rwB - rwA) * 0.42);
    const stY = SHORE - 16;
    const pyY = SHORE - 27;

    const skyFx = new Fx();
    const waterFx = new Fx();
    const topFx = new Fx(); // things in front of everything: the gull taking off
    let beacons: Beacon[] = [];
    const crownPts: { x: number; y: number; hi: boolean }[] = [];
    const shoreLamps: number[] = [];
    const quayLamps: number[] = [];
    const trees: { x: number; r: number }[] = [];

    const cableY = (x: number, lane: number) => {
      const sag = 2.5;
      let y: number;
      if (x < rwP) {
        const u = Math.max(0, (x - rwA) / (rwP - rwA));
        y = stY + (pyY - stY) * u + sag * Math.sin(Math.PI * u);
      } else {
        const u = Math.min(1, (x - rwP) / (rwB - rwP));
        y = pyY + (stY - pyY) * u + sag * Math.sin(Math.PI * u);
      }
      return Math.round(y) - lane * 2;
    };

    // ---------- static layers ----------

    const sky = layer(w, h, (f) => {
      gradient(f, 0, SHORE, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
        P.haze,
      ]);
      f.rect(0, SHORE, w, h - SHORE, P.sky6);
      stars(
        f,
        11,
        Math.round(w / 10),
        60,
        0,
        [P.star, P.star, P.starHi],
        false
      );
      const mx = Math.round(Math.min(w - 22, cx + w * 0.36));
      glow(f, mx, 20, 13, P.star, 0.2, 1, 0.12);
      moon(
        f,
        mx,
        20,
        5,
        { light: P.moonLight, mid: P.moonMid, dark: P.moonDark },
        0.36
      );
    });

    const cloudLayer = layer(w, h, (f) => {
      clouds(f, {
        seed: 44,
        y0: 26,
        y1: 44,
        cell: 6,
        coverage: 0.3,
        stretch: 6,
        litFromBelow: true,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });

    const city = layer(w, h, (f) => {
      // far: the rest of the city, dim and low
      skyline(
        f,
        SHORE - 2,
        {
          body: P.farBody,
          edge: P.farEdge,
          dark: P.farDark,
          windows: [P.farWin],
          litShare: 0.25,
        },
        { seed: 5, minH: 6, maxH: 24, minW: 7, maxW: 15, x1: bbX - 60 }
      );
      // Daikoku pier's low lights under the bridge
      for (let x = bbX - 60; x < w; x++) {
        f.set(x, SHORE - 2, P.farDark);
        if (hash2(x, 0, 14) > 0.7) f.set(x, SHORE - 3, P.farDark);
        if (hash2(x, 1, 14) > 0.85) f.set(x, SHORE - 2, P.farWin);
      }
      // Yokohama Bay Bridge far off to the right: H towers, fans of cables
      if (bbX < w + 20) {
        const deckY = SHORE - 11;
        for (const tx of [bbX, bbX + 92]) {
          const top = deckY - 22;
          for (let k = -12; k <= 12; k += 3) {
            if (k === 0) continue;
            f.line(
              tx + Math.sign(k),
              top + 2 + Math.abs(k) * 0.15,
              tx + k * 3.4,
              deckY - 1,
              P.farEdge
            );
          }
          f.vline(tx - 2, top, deckY + 8, P.farWin);
          f.vline(tx + 2, top, deckY + 8, P.farEdge);
          f.hline(tx - 2, tx + 2, top + 2, P.farWin);
          f.hline(tx - 2, tx + 2, deckY + 2, P.farEdge);
          f.set(tx - 2, top - 1, P.beacon);
          f.set(tx + 2, top - 1, P.beacon);
        }
        f.rect(bbX - 70, deckY, 260, 2, P.farDark);
        f.hline(bbX - 70, bbX + 190, deckY, P.farEdge);
        for (let x = bbX - 70; x < bbX + 190; x += 3)
          f.set(x, deckY + 1, hash2(x, 0, 13) > 0.5 ? P.winWarm : P.winCool);
        for (let x = bbX - 66; x < bbX + 190; x += 30)
          f.vline(x, deckY + 2, SHORE - 2, P.farDark);
      }
      // office towers: tall on the Sakuragicho side, low behind the wheel
      const style = {
        body: P.midBody,
        edge: P.midEdge,
        dark: P.midDark,
        windows: [P.winCool, P.winCool, P.winWarm, P.winWarm2],
        litShare: 0.32,
      };
      beacons = beacons.concat(
        skyline(f, SHORE - 2, style, {
          seed: 17,
          minH: 16,
          maxH: 50,
          minW: 9,
          maxW: 16,
          x1: lmX - 11,
        }),
        skyline(f, SHORE - 2, style, {
          seed: 21,
          minH: 8,
          maxH: 20,
          minW: 8,
          maxW: 14,
          x0: qx + 38,
          x1: sailX,
        }),
        skyline(f, SHORE - 2, style, {
          seed: 29,
          minH: 10,
          maxH: 30,
          minW: 8,
          maxW: 15,
          x0: sailX + sailW,
          x1: Math.min(w, bbX - 60),
        })
      );

      // Landmark Tower: tapering, notched corners, stepped crown
      const base = SHORE - 2;
      const lmBody = lmTop + 9; // where the crown starts
      const half = (y: number) =>
        Math.round(10 - 3 * ((base - y) / (base - lmBody)));
      for (let y = lmBody; y <= base; y++) {
        const hw = half(y);
        for (let dx = -hw; dx <= hw; dx++) {
          // two faces meeting at a notched corner a little right of centre
          let c = dx < 1 ? P.lmBody : P.lmShade;
          if (dx === -hw) c = P.lmLit;
          if (dx === 1 || dx === -hw + 1 || dx === hw) c = P.lmNotch;
          f.set(lmX + dx, y, c);
        }
        // windows: whole floors on or off, two faces lit differently
        if ((base - y) % 2 === 1 && y > lmBody + 3) {
          const floorOn = hash2(y, 0, 31) < 0.62;
          for (let dx = -hw + 2; dx < hw; dx++) {
            if (dx === 1 || (dx + 20) % 2 === 1) continue;
            if (!floorOn || hash2(dx, y, 32) > 0.82) continue;
            f.set(
              lmX + dx,
              y,
              dx < 1
                ? hash2(y >> 2, 1, 33) > 0.35
                  ? P.winCool
                  : P.winWarm
                : P.winDim
            );
          }
        }
      }
      // the Sky Garden floors, lit right across
      for (const y of [lmBody + 1, lmBody + 3]) {
        const hw = half(y);
        for (let dx = -hw + 2; dx < hw; dx += 1)
          if (dx !== 1) f.set(lmX + dx, y, dx < 1 ? P.winWarm2 : P.winWarm);
      }
      // crown: three steps in, each edged in light
      const steps = [
        { y: lmBody - 3, hw: 6 },
        { y: lmBody - 6, hw: 5 },
        { y: lmBody - 9, hw: 3 },
      ];
      for (const s of steps) {
        for (let y = s.y; y < s.y + 3; y++)
          for (let dx = -s.hw; dx <= s.hw; dx++) {
            // uplit ribs on each step
            const rib = (dx + 20) % 2 === 0 && y > s.y;
            f.set(
              lmX + dx,
              y,
              dx < 1 ? (rib ? P.lmLit : P.lmBody) : rib ? P.lmBody : P.lmShade
            );
          }
        for (let dx = -s.hw; dx <= s.hw; dx++)
          crownPts.push({ x: lmX + dx, y: s.y, hi: dx < 1 });
      }
      beacons.push(
        { x: lmX - 3, y: lmTop - 1, phase: 0.1 },
        { x: lmX + 3, y: lmTop - 1, phase: 0.6 }
      );
      // Landmark Plaza at its foot
      f.rect(lmX - 14, base - 7, 26, 8, P.midBody);
      f.hline(lmX - 14, lmX + 11, base - 7, P.midEdge);
      for (let x = lmX - 12; x < lmX + 10; x += 2)
        f.set(x, base - 4, P.winWarm);

      // Queen's Square: three towers stepping down towards the sea, roofs cut on a slant
      const qs = [
        { x: qx, h: 52 },
        { x: qx + 13, h: 44 },
        { x: qx + 26, h: 36 },
      ];
      for (const [i, q] of qs.entries()) {
        const top = base - q.h;
        const qw = 11;
        for (let dx = 0; dx < qw; dx++) {
          const roof = top + Math.floor(dx / 4) * 2;
          for (let y = roof; y <= base; y++) {
            let c = dx === 0 ? P.qLit : dx >= qw - 3 ? P.qShade : P.qBody;
            if (y === roof) c = P.crown;
            else if (y === roof + 1 && dx % 4 === 3) c = P.crownGlow;
            f.set(q.x + dx, y, c);
          }
          if (dx > 0 && dx < qw - 1 && dx % 2 === 1)
            for (let y = top + 6; y < base - 2; y += 2) {
              const on = hash2(i * 3 + (y >> 1), dx, 41) < 0.55;
              f.set(
                q.x + dx,
                y,
                on ? (dx >= qw - 3 ? P.winDim : P.winCool) : P.qShade
              );
            }
        }
        beacons.push({ x: q.x + 1, y: top - 1, phase: i * 0.3 });
      }
      // the mall between them
      f.rect(qx - 2, base - 9, 40, 10, P.midBody);
      f.hline(qx - 2, qx + 37, base - 9, P.midEdge);
      for (let x = qx + 1; x < qx + 36; x += 3)
        f.vline(x, base - 6, base - 5, P.winWarm);

      // the Air Cabin: stations, a pylon, two cables
      const station = (x: number, flip: boolean) => {
        const y = stY - 5;
        f.hline(x - 8, x + 8, y, P.pylon);
        f.hline(x - 7, x + 7, y + 1, P.pylonShade);
        f.rect(x - 7, y + 2, 15, 4, P.stationGlass);
        for (let k = x - 4; k <= x + 4; k += 4)
          f.vline(k, y + 2, y + 5, P.station);
        f.rect(x - 7, y + 6, 15, SHORE - 2 - (y + 6), P.midDark);
        f.hline(x - 7, x + 7, y + 6, P.stationShade);
        f.vline(flip ? x + 7 : x - 7, y + 2, SHORE - 3, P.stationShade);
        for (let k = x - 6; k <= x + 6; k += 4) f.set(k, y + 9, P.winWarm);
      };
      station(rwA, false);
      station(rwB, true);
      // a slim white pylon with a crossarm for the two cables
      f.vline(rwP, pyY - 1, SHORE - 2, P.pylon);
      f.vline(rwP + 1, pyY - 1, SHORE - 2, P.pylonShade);
      f.line(rwP - 3, SHORE - 2, rwP, pyY + 10, P.pylonShade);
      f.line(rwP + 4, SHORE - 2, rwP + 1, pyY + 10, P.pylonShade);
      f.hline(rwP - 2, rwP + 3, pyY - 2, P.pylon);
      f.hline(rwP - 2, rwP + 3, pyY, P.pylonShade);
      for (const lane of [1, 0])
        for (let x = rwA + 8; x <= rwB - 8; x++)
          f.set(x, cableY(x, lane), lane ? P.cableDark : P.cable);
    });

    // the wheel's base: Cosmo World's arcade building
    const arcadeX0 = wheelX - Math.round(R * 0.62) - 3;
    const arcadeX1 = wheelX + Math.round(R * 0.62) + 3;
    const front = layer(w, h, (f) => {
      const bx0 = arcadeX0;
      const bx1 = arcadeX1;
      f.rect(bx0, SHORE - 9, bx1 - bx0 + 1, 8, P.baseBody);
      f.hline(bx0, bx1, SHORE - 9, P.baseHi);
      for (let x = bx0 + 2; x < bx1 - 1; x += 2)
        f.set(x, SHORE - 7, [P.arcade, P.arcade2, P.arcade3][(x >> 1) % 3]!);
      for (let x = bx0 + 3; x < bx1 - 2; x += 4)
        f.rect(x, SHORE - 5, 2, 3, P.winWarm);

      // the InterContinental: a white sail, floors in horizontal bands
      const sailTopAt = (dx: number) => {
        const u = dx / sailW;
        return Math.round(
          sailTop +
            (SHORE - 2 - sailTop) *
              (1 - Math.sqrt(Math.max(0, 1 - u * u))) ** 1.15
        );
      };
      for (let dx = 0; dx < sailW; dx++) {
        const top = sailTopAt(dx);
        for (let y = top; y < SHORE - 1; y++) {
          const u = dx / sailW;
          let c =
            u < 0.18
              ? P.sail
              : u < 0.55
                ? P.sailMid
                : u < 0.8
                  ? P.sailShade
                  : P.sailDeep;
          if (y === top || (dx === 0 && y < SHORE - 6)) c = P.sail;
          else if ((y - sailTop) % 3 === 2 && dx > 0 && y > top + 1) {
            const lit = hash2(dx >> 1, y, 51) < 0.6;
            c = lit
              ? hash2(dx, y, 52) > 0.75
                ? P.sailWinCool
                : P.sailWin
              : u < 0.55
                ? P.sailShade
                : P.sailDeep;
          }
          f.set(sailX + dx, y, c);
        }
      }
      // Pacifico's shell-roofed hall beside it
      const px0 = pacificoX;
      for (let dx = 0; dx < (pacifico ? 12 : 0); dx++) {
        const top =
          SHORE - 2 - Math.round(7 * Math.sin((dx / 12) * Math.PI) ** 0.6);
        f.vline(px0 + dx, top, SHORE - 2, dx < 6 ? P.shell : P.shellShade);
        if (dx % 2 === 0 && dx > 0) f.set(px0 + dx, SHORE - 4, P.winWarm);
      }

      // Red Brick Warehouses: two long brick sheds, floodlit, rows of arched windows
      const shed = (x0: number, len: number) => {
        const top = SHORE - 15;
        f.rect(x0 - 1, top - 2, len + 2, 2, P.brickRoof);
        f.hline(x0, x0 + len - 1, top - 2, P.brickRoofHi);
        for (let y = top; y < SHORE - 1; y++) {
          const lit = (y - top) / (SHORE - 1 - top);
          f.hline(x0, x0 + len - 1, y, lit > 0.66 ? P.brickLit : P.brick);
        }
        f.vline(x0, top, SHORE - 2, P.brickShade);
        f.vline(x0 + len - 1, top, SHORE - 2, P.brickShade);
        // three floors of arched windows, centred between the stair towers
        const inner = len - 8;
        const first = x0 + 4 + (inner - (Math.floor(inner / 4) * 4 - 2)) / 2;
        for (const [fl, y] of [top + 2, top + 6, top + 10].entries()) {
          for (let x = first; x + 1 < x0 + len - 4; x += 4) {
            const on = hash2(x, fl, 61) < 0.8;
            f.set(x, y, on ? P.archWinHi : P.brickShade);
            f.rect(
              x - 0.5 < x0 + 1 ? x : x,
              y + 1,
              2,
              2,
              on ? P.archWin : P.brickShade
            );
            f.set(x + 1, y, on ? P.archWin : P.brickShade);
          }
          if (fl < 2) f.hline(x0 + 1, x0 + len - 2, y + 3, P.iron); // iron balconies
        }
        // the stair towers at each end stand a little proud of the roof
        for (const ex of [x0, x0 + len - 4]) {
          f.rect(ex, top - 4, 4, SHORE - 1 - (top - 4), P.brick);
          f.vline(ex, top - 4, SHORE - 2, P.brickLit);
          f.vline(ex + 3, top - 4, SHORE - 2, P.brickShade);
          f.hline(ex - 1, ex + 4, top - 5, P.brickRoofHi);
          f.hline(ex, ex + 3, top - 6, P.brickRoof);
          for (let y = top - 2; y < SHORE - 3; y += 4)
            f.rect(ex + 1, y, 2, 2, P.archWin);
        }
      };
      for (const [x0, len] of sheds) shed(x0, len);

      // the far quay: a strip of park trees, a seawall, a row of lamps
      f.rect(0, SHORE - 2, w, 2, P.quay);
      f.hline(0, w, SHORE - 1, P.quayHi);
      for (let x = 2; x < w; x += 3 + Math.round(hash2(x, 0, 71) * 3)) {
        // not in front of the arcade, the sail, the warehouses or the gantry
        const inWay =
          (x > arcadeX0 - 3 && x < arcadeX1 + 3) ||
          (x > sailX - 2 && x < sailX + sailW + 12) ||
          (sheds.length > 0 && x > rbX - 3 && x < shedsEnd + 4) ||
          !clearOfGantry(x - 2, x + 2);
        if (inWay) continue;
        if (hash2(x, 1, 71) < 0.45) continue;
        // (drawn as the scene runs, so the wind can bend them)
        trees.push({ x, r: 1 + Math.round(hash2(x, 2, 71) * 1.4) });
      }
      for (let x = 4; x < w; x += 8 + Math.round(hash2(x, 3, 71) * 6)) {
        f.set(x, SHORE - 2, P.lamp);
        quayLamps.push(x);
        // only the brighter ones throw a streak across the water
        if (hash2(x, 4, 71) < 0.45) shoreLamps.push(x);
      }
    });

    // the deck we're standing on
    const coupleX = Math.round(cx - w * 0.33);
    const photoX = Math.round(cx + w * 0.06);
    const kidX = Math.round(cx + w * 0.36);
    const gullX = Math.round(cx - w * 0.1);
    // old-fashioned harbour lamps, kept clear of the wheel's reflection,
    // and stepped aside from anyone (or the gull) they'd stand in front of
    const busy: [number, number][] = [
      [gullX - 1, gullX + 3],
      [coupleX, coupleX + 8],
      [photoX, photoX + 6],
      [kidX - 5, kidX + 4],
    ];
    const blocked = (x: number) =>
      busy.find(([a, b]) => x + 3 >= a && x - 3 <= b);
    const lamps: number[] = [];
    for (
      let x = Math.round(cx - w * 0.44);
      x < w;
      x += Math.max(90, Math.round(w * 0.29))
    ) {
      let lx = x;
      const hit = blocked(lx);
      if (hit) lx = lx - hit[0] < hit[1] - lx ? hit[0] - 4 : hit[1] + 4;
      if (!blocked(lx) && Math.abs(lx - wheelX) > R + 4) lamps.push(lx);
    }
    const LAMP_TOP = DECK - 27;
    const deck = layer(w, h, (f) => {
      f.rect(0, DECK, w, h - DECK, P.deck);
      f.hline(0, w, DECK, P.deckHi);
      for (let y = DECK + 3; y < h; y += 3) f.hline(0, w, y, P.plank);
      for (let y = DECK + 1; y < h; y += 3)
        for (let x = Math.round(hash2(y, 0, 81) * 30); x < w; x += 30)
          f.set(x, y + 1, P.plank);
      // railing: two rails and posts
      f.hline(0, w, RAIL, P.railHi);
      f.hline(0, w, RAIL + 1, P.rail);
      f.hline(0, w, RAIL + 4, P.rail);
      for (let x = 2; x < w; x += 7) f.vline(x, RAIL, DECK - 1, P.rail);
      for (const lx of lamps) {
        f.rect(lx - 2, DECK - 3, 5, 3, P.lampPost);
        f.hline(lx - 2, lx + 2, DECK - 3, P.lampPostHi);
        f.vline(lx, LAMP_TOP + 6, DECK - 3, P.lampPost);
        f.vline(lx - 1, DECK - 8, DECK - 4, P.lampPost);
        f.vline(lx + 1, DECK - 8, DECK - 4, P.lampPost);
        // the lantern: a cap, glass panes, a finial
        f.set(lx, LAMP_TOP - 2, P.lampPost);
        f.hline(lx - 1, lx + 1, LAMP_TOP - 1, P.lampPost);
        f.hline(lx - 2, lx + 2, LAMP_TOP, P.lampPostHi);
        f.rect(lx - 2, LAMP_TOP + 1, 5, 4, P.lampGlass);
        f.vline(lx, LAMP_TOP + 1, LAMP_TOP + 4, P.lampPost);
        f.vline(lx - 1, LAMP_TOP + 1, LAMP_TOP + 2, P.lampGlassHi);
        f.hline(lx - 1, lx + 1, LAMP_TOP + 5, P.lampPost);
        // warm light catching the deck's edge and the first planks
        f.hline(lx - 9, lx + 9, DECK, P.deckLitHi);
        f.hline(lx - 5, lx + 5, DECK + 1, P.deckLit);
        f.hline(lx - 12, lx + 12, DECK + 3, P.deckLit);
      }
      figure(f, MAN, coupleX, DECK);
      figure(f, WOMAN, coupleX + 4, DECK + 0);
      figure(f, PHOTOGRAPHER, photoX, DECK);
      figure(f, MAN, kidX, DECK, true);
      figure(f, KID, kidX - 5, DECK);
    });

    // the sail's lit crest and the warehouses' floodlights never change: bake them in
    for (const lf of [sky, city])
      glow(lf, sailX + 4, sailTop + 6, 14, P.sailGlow, 0.22, 1.2, 0.18);
    if (sheds.length) {
      const span = shedsEnd - rbX;
      for (const lf of [sky, city, front])
        glow(
          lf,
          rbX + span / 2 - 3,
          SHORE - 6,
          40 * Math.min(1, span / 66),
          P.archWin,
          0.18,
          0.35,
          0.14
        );
    }

    // ---------- moving things ----------

    const N = 30; // spokes
    const G = 30; // gondolas
    const rimPts = ringPoints(R);
    const innerPts = ringPoints(R - 2);
    const hubPts = ringPoints(HUB);
    const ledPts = ringPoints(HUB + 1);

    let modeBase = 0;
    let modeAt = -Infinity;
    const MODE_EVERY = 16_000;
    const MODES = 6;
    const modeAtT = (t: number) =>
      (Math.floor(t / MODE_EVERY) + modeBase) % MODES;

    function spokeColor(
      mode: number,
      k: number,
      ang: number,
      r: number,
      t: number
    ): RGB {
      switch (mode) {
        case 0: // rainbow sectors turning
          return LED[Math.floor(((k / N + t / 12_000) % 1) * 8)]!;
        case 1: {
          // rings of light running outwards
          const p = r - t / 60;
          const ring = Math.floor(p / 6);
          return ((p % 6) + 6) % 6 < 2.5
            ? LED[((ring % 8) + 8) % 8]!
            : LED_DIM[(((ring + 1) % 8) + 8) % 8]!;
        }
        case 2: {
          // the second hand: spokes fill clockwise from the top every minute
          const s = japanTime().s;
          const from =
            (((ang + Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) %
            (Math.PI * 2);
          const v = (from / (Math.PI * 2)) * 60;
          if (Math.abs(v - s) < 1.2) return P.crownHi;
          return v < s ? P.digit : P.spokeOff;
        }
        case 3: {
          // sakura: pink and white, twinkling
          const tw = hash2(k, Math.floor(t / 240), 91);
          return tw > 0.8 ? SAKURA[2]! : SAKURA[k % 2]!;
        }
        case 4: {
          // spiral arms
          return LED[
            ((Math.floor((k / N) * 8 + r / 5 - t / 260) % 8) + 8) % 8
          ]!;
        }
        default: {
          // the whole wheel washing through the colours
          const c = Math.floor(t / 900) % 8;
          return k % 2 ? LED[c]! : lerpRGB(LED[c]!, LED[(c + 1) % 8]!, 0.5);
        }
      }
    }

    // ---------- easter egg: the windy ride ----------
    // One gondola is lit warmer than the rest, with a man, a woman and a kid
    // in it. Click it and the wind gets up across the whole harbour (gusts,
    // bending trees, chop on the water, leaves and somebody's hat), the
    // gondolas swing, the wheel brings theirs round to the top and the
    // picture cuts to them up there: the gondola sways in the wind; the man
    // grips the seat, the kid bounces. Then it all calms down.
    const EGG_G = 17; // their gondola
    const RIDE_FOR = 8000;
    const SPIN_MS = 2000; // the wheel turning them up to the top
    const UP_IN = 2500; // the cut to the gondola...
    const UP_OUT = 6300; // ...and back
    const UP_FADE = 450;
    const GUST_UP = 800; // how fast the wind gets up
    let rideAt = -Infinity;
    let rideSpin = 0; // how far the rides before this one turned the wheel
    let rideTurn = 0; // how far this one turns it
    let cloudsBlown = 0; // how far the rides before this one blew the clouds
    const rideAge = (t: number) => t - rideAt;
    const riding = (t: number) => rideAge(t) >= 0 && rideAge(t) < RIDE_FOR;
    const rotAt = (t: number) =>
      t / 95_000 + rideSpin + rideTurn * smooth(rideAge(t) / SPIN_MS);
    /** How hard the wind is blowing, 0..1. */
    const gustAt = (t: number) => {
      const a = rideAge(t);
      if (!(a >= 0 && a < RIDE_FOR)) return 0;
      return Math.min(smooth(a / GUST_UP), smooth((RIDE_FOR - a) / 2000));
    };
    /** How far the wind has pushed the clouds this ride (gust over time). */
    const blownBy = (t: number) => {
      const a = rideAge(t);
      if (!(a > 0 && a < Infinity)) return 0; // (no ride yet: nothing)
      const s =
        GUST_UP * smoothArea(a / GUST_UP) +
        Math.max(0, Math.min(a, RIDE_FOR - 2000) - GUST_UP) +
        2000 * (0.5 - smoothArea((RIDE_FOR - Math.min(a, RIDE_FOR)) / 2000));
      return s * 0.035;
    };
    /** 0 on the pier, 1 up in the gondola; the dissolve in between. */
    const upMix = (t: number) => {
      const a = rideAge(t);
      if (!(a >= UP_IN && a < UP_OUT)) return 0;
      return Math.min(
        smooth((a - UP_IN) / UP_FADE),
        smooth((UP_OUT - a) / UP_FADE)
      );
    };
    /** Where gondola g hangs from the rim right now. */
    const gondolaAt = (g: number, t: number) => {
      const a = rotAt(t) + ((g + 0.5) / G) * Math.PI * 2;
      return {
        a,
        x: wheelX + Math.round(Math.cos(a) * (R + 1)),
        y: wheelY + Math.round(Math.sin(a) * (R + 1)),
      };
    };

    function drawWheel(f: Frame, t: number, hover: boolean) {
      const mode = modeAtT(t);
      const rot = rotAt(t);
      const gust = gustAt(t);
      const ra = rideAge(t);
      const legSpread = Math.round(R * 0.62);
      const foot = SHORE - 9;
      // the back legs, darker
      f.line(wheelX + 1, wheelY, wheelX - legSpread + 2, foot, P.steelDark);
      f.line(wheelX - 1, wheelY, wheelX + legSpread - 2, foot, P.steelDark);
      // spokes
      for (let k = 0; k < N; k++) {
        const a = rot + (k / N) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        for (let r = HUB + 1; r < R - 2; r++)
          f.set(
            wheelX + Math.round(ca * r),
            wheelY + Math.round(sa * r),
            spokeColor(mode, k, a, r, t)
          );
      }
      // rim: a lit outer ring around a steel truss
      for (const p of innerPts)
        f.set(wheelX + p.dx, wheelY + p.dy, P.steelDark);
      for (const [i, p] of rimPts.entries()) {
        let c = P.steel;
        if (i % 3 === 0) {
          const a = p.a - rot;
          const k = Math.floor((((a / (Math.PI * 2)) % 1) + 1) * N) % N;
          c = spokeColor(mode, k, p.a, R, t);
          if (hover && hash2(i, Math.floor(t / 90), 93) > 0.85) c = P.crownHi;
        }
        f.set(wheelX + p.dx, wheelY + p.dy, c);
      }
      // gondolas hang off the rim and stay level (and swing in the wind)
      for (let g = 0; g < G; g++) {
        const { x: gx, y: gy } = gondolaAt(g, t);
        const isEgg = g === EGG_G;
        const sw =
          gust > 0
            ? Math.round(
                gust *
                  (isEgg ? 2.4 : 1.8) *
                  Math.sin(ra / (isEgg ? 150 : 210) + g * 1.9)
              )
            : 0;
        // swung far out, a gondola rides up a pixel on its hanger
        const lift = Math.abs(sw) > 1 ? 1 : 0;
        f.set(gx, gy, P.steelDark);
        if (sw) f.set(gx + Math.sign(sw), gy + 1 - lift, P.steelDark);
        if (isEgg) continue; // drawn last, over its neighbours
        f.rect(gx - 1 + sw, gy + 1 - lift, 2, 2, P.gondola);
        f.set(gx - 1 + sw, gy + 1 - lift, P.gondolaWin);
      }
      drawEggGondola(f, t, gust, ra);
      // front A-frame legs, dark against the lights, lit along one edge
      for (const sgn of [-1, 1]) {
        f.line(wheelX, wheelY, wheelX + sgn * legSpread, foot, P.hub);
        f.line(
          wheelX + sgn,
          wheelY,
          wheelX + sgn * legSpread + sgn,
          foot,
          P.hub
        );
        f.line(
          wheelX - (sgn < 0 ? 1 : 0),
          wheelY + 1,
          wheelX + sgn * legSpread - (sgn < 0 ? 1 : 0),
          foot,
          P.steelDark
        );
      }
      f.hline(
        wheelX - Math.round(legSpread * 0.5),
        wheelX + Math.round(legSpread * 0.5),
        foot - 7,
        P.hub
      );
      // the hub: a giant digital clock
      f.disc(wheelX, wheelY, HUB - 0.5, P.hub);
      for (const p of hubPts) f.set(wheelX + p.dx, wheelY + p.dy, P.hubRing);
      for (const [i, p] of ledPts.entries())
        if (i % 2 === 0)
          f.set(
            wheelX + p.dx,
            wheelY + p.dy,
            (i >> 1) % 2 ? P.gondolaWin : P.hubRing
          );
      // the real time in Yokohama, like the real one
      const now = japanTime();
      const hh = now.h;
      const mm = now.m;
      const dx = wheelX - 8;
      const dy = wheelY - 2;
      digit(f, dx, dy, Math.floor(hh / 10), P.digit);
      digit(f, dx + 4, dy, hh % 10, P.digit);
      if (now.s % 1 < 0.6) {
        f.set(dx + 8, dy + 1, P.digit);
        f.set(dx + 8, dy + 3, P.digit);
      }
      digit(f, dx + 10, dy, Math.floor(mm / 10), P.digit);
      digit(f, dx + 14, dy, mm % 10, P.digit);
      if (t - modeAt < 500) {
        const a = 1 - (t - modeAt) / 500;
        for (const p of rimPts)
          f.blend(wheelX + p.dx, wheelY + p.dy, P.crownHi, a);
      }
    }

    // Air Cabin gondolas: out on the front cable, back on the rear one
    let rainbowAt = -Infinity;
    const CAB_GAP = 30;
    function drawCabins(f: Frame, t: number) {
      const span = rwB - rwA;
      const show = t - rainbowAt < 6000;
      for (const lane of [1, 0]) {
        const dir = lane ? -1 : 1;
        const n = Math.ceil(span / CAB_GAP) + 1;
        for (let k = 0; k < n; k++) {
          const p =
            (((k * CAB_GAP + t * 0.0075) % (n * CAB_GAP)) + n * CAB_GAP) %
            (n * CAB_GAP);
          const x = Math.round(dir > 0 ? rwA + p : rwB - p);
          if (x < rwA + 7 || x > rwB - 7 || Math.abs(x - rwP - 0.5) < 2)
            continue;
          const y = cableY(x, lane);
          let body = lane ? P.cabinShade : P.cabin;
          if (show) {
            const wave = Math.floor((t - rainbowAt) / 80 - (x - rwA) / 6);
            body = wave >= 0 ? LED[((wave % 8) + k) % 8]! : body;
          }
          f.set(x, y + 1, P.cableDark);
          f.hline(x - 1, x + 1, y + 2, body);
          f.rect(x - 2, y + 3, 5, 2, lane ? P.winWarm : P.cabinWin);
          f.set(x - 2, y + 3, body);
          f.set(x + 2, y + 4, body);
          f.hline(x - 1, x + 1, y + 5, lane ? P.cabinShade : P.stationShade);
        }
      }
    }

    // boats
    type Boat = { y: number; len: number; kind: 'wing' | 'bass' | 'speed' };
    function drawBoat(f: Frame, b: Boat, x: number, dir: number, t: number) {
      const y =
        b.y +
        (Math.sin(t / 700 + x * 0.1) > 0.6 ? 1 : 0) *
          (b.kind === 'wing' ? 0 : 1);
      x = Math.round(x);
      const L = b.len;
      const bowAt = (k: number) => (dir > 0 ? x + L - 1 - k : x + k);
      if (b.kind === 'wing') {
        // a white restaurant cruiser, three decks of windows
        f.rect(x, y - 3, L, 3, P.hull);
        f.hline(x, x + L - 1, y - 1, P.hullBlue);
        for (let k = 0; k < 4; k++)
          f.vline(
            bowAt(k),
            y - 3 + (3 - k > 0 ? 0 : 1),
            y - 1 - Math.max(0, 2 - k),
            P.water1
          );
        f.rect(x + (dir > 0 ? 3 : 6), y - 6, L - 9, 3, P.hull);
        f.rect(x + (dir > 0 ? 7 : 12), y - 9, L - 19, 3, P.hullShade);
        for (
          let k = x + (dir > 0 ? 4 : 7);
          k < x + L - (dir > 0 ? 7 : 4);
          k += 2
        )
          f.set(k, y - 5, P.boatWin);
        for (
          let k = x + (dir > 0 ? 8 : 13);
          k < x + L - (dir > 0 ? 13 : 8);
          k += 2
        )
          f.set(k, y - 8, P.winWarm2);
        f.hline(x + 2, x + L - 3, y - 2, P.boatWin);
        const mast = dir > 0 ? x + L - 14 : x + 13;
        f.vline(mast, y - 13, y - 10, P.hullShade);
        f.set(mast, y - 14, P.lamp);
        f.set(bowAt(1), y - 4, dir > 0 ? P.navGreen : P.navRed);
        for (let k = 0; k < L; k += 2) {
          f.blend(x + k, y + 1, P.boatWin, 0.35);
          f.blend(x + k + 1, y + 3, P.boatWin, 0.18);
        }
        return;
      }
      if (b.kind === 'bass') {
        // the Sea Bass water bus: low, sleek, a band of windows
        f.rect(x, y - 2, L, 2, P.hull);
        f.hline(x + 1, x + L - 2, y, P.hullRed);
        f.rect(x + (dir > 0 ? 2 : 5), y - 4, L - 7, 2, P.hull);
        for (
          let k = x + (dir > 0 ? 3 : 6);
          k < x + L - (dir > 0 ? 6 : 3);
          k += 2
        )
          f.set(k, y - 3, P.boatWin);
        f.set(bowAt(0), y - 2, P.water1);
        for (let k = 0; k < L; k += 2) f.blend(x + k, y + 2, P.boatWin, 0.3);
      } else {
        // a little launch: white hull, a cabin, a light on the bow
        f.rect(x, y - 1, L, 2, P.hull);
        f.hline(x + 1, x + L - 2, y + 1, P.hullShade);
        f.set(bowAt(0), y - 1, P.water1);
        f.rect(x + (dir > 0 ? 2 : L - 6), y - 3, 4, 2, P.boatDark);
        f.set(x + (dir > 0 ? 4 : L - 5), y - 3, P.boatWin);
        f.set(bowAt(1), y - 2, P.crownHi);
        f.set(bowAt(1) + dir * 2, y, P.crownHi);
      }
      // wake behind it
      const stern = dir > 0 ? x - 1 : x + L;
      const long = b.kind === 'speed' ? 26 : 16;
      for (let k = 0; k < long; k++) {
        const wx = stern - dir * k;
        const spread = Math.floor(k / 4);
        const a = 0.55 * (1 - k / long);
        f.blend(wx, y + 1 + spread, P.wake, a);
        if (k > 2) f.blend(wx, y - 0 - Math.floor(spread / 2), P.wake, a * 0.6);
      }
    }

    function crossing(t: number, every: number, dur: number, offset: number) {
      const n = Math.floor((t + offset) / every);
      const p = ((t + offset) % every) / dur;
      if (p > 1) return null;
      return { p, dir: n % 2 ? -1 : 1 };
    }

    const speedboats: { at: number; y: number; dir: number }[] = [];
    const gull = { flownAt: -Infinity };
    let crownMode = 0;

    // water colour by depth, as pixels
    const waterRows: number[] = [];
    {
      const tmp = layer(1, h, (f) =>
        gradient(f, SHORE, h, [P.water0, P.water1, P.water2, P.water3], 0, 1)
      );
      for (let y = SHORE; y < h; y++) waterRows.push(tmp.pixels[y]!);
    }

    function harbour(f: Frame, t: number) {
      const px = f.pixels;
      const depth = DECK - SHORE;
      const gust = gustAt(t);
      for (let y = SHORE; y < DECK; y++) {
        const d = y - SHORE;
        const sy = Math.max(1, SHORE - 2 - Math.floor(d * 1.75));
        // the swell: bands of rows share an offset, breaks drift towards us
        const band = Math.floor((d + t / 300) / 3);
        const broken =
          (d + Math.floor(t / (gust > 0.4 ? 120 : 380))) %
            (gust > 0.4 ? 3 : 6) ===
          0;
        const wob =
          Math.round(Math.sin(band * 1.7 + t / 900) * (0.4 + d * 0.05)) +
          (broken ? (band % 2 ? 2 : -2) : 0) +
          // in the wind, a short steep chop
          (gust > 0
            ? Math.round(
                gust * (1.2 + d * 0.1) * Math.sin(d * 2.1 + t / 70 + band)
              )
            : 0);
        const fade = (1 - d / (depth + 26)) * (broken ? 0.45 : 1);
        const base = waterRows[d]!;
        const br = base & 0xff;
        const bg = (base >>> 8) & 0xff;
        const bb = (base >>> 16) & 0xff;
        const row = y * w;
        const s0 = sy * w;
        const s1 = s0 - w;
        for (let x = 0; x < w; x++) {
          let xc = x + wob;
          if (xc < 0) xc = 0;
          else if (xc >= w) xc = w - 1;
          const xp = xc + 1 < w ? xc + 1 : xc;
          // 2x2 of the scene above: window grids melt into blocks of light
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
          // posterised: dark mass, lit mass, or a light shining through
          let a: number;
          if (lum > 105) {
            const m =
              (a0 & 0xff) + ((a0 >>> 8) & 0xff) >
              (a2 & 0xff) + ((a2 >>> 8) & 0xff)
                ? a0
                : a2;
            r = m & 0xff;
            g = (m >>> 8) & 0xff;
            b = (m >>> 16) & 0xff;
            a = 0.85 * fade;
          } else if (lum > 55) a = 0.5 * fade;
          else a = 0.2 * fade;
          px[row + x] =
            (0xff000000 |
              ((bb + (b - bb) * a) << 16) |
              ((bg + (g - bg) * a) << 8) |
              (br + (r - br) * a)) >>>
            0;
        }
      }
      // the quay lamps stretch into long columns of dashes
      for (const [i, lx] of shoreLamps.entries()) {
        for (let y = SHORE + 1; y < DECK; y++) {
          const d = (y - SHORE) / depth;
          if (hash2(i, y + Math.floor(t / 300), 73) < 0.35 + d * 0.3) continue;
          const len = 1 + Math.floor(hash2(i, y, 74) * (1 + d * 3));
          const x0 = Math.round(
            lx - len / 2 + Math.sin(y * 0.7 + t / 380 + i) * (0.5 + d * 2.5)
          );
          for (let k = 0; k < len; k++)
            f.blend(x0 + k, y, P.lamp, 0.6 * (1 - d) ** 1.2);
        }
      }
      // whitecaps, in the wind
      if (gust > 0) {
        const ra = rideAge(t);
        for (let y = SHORE + 2; y < DECK - 1; y += 2) {
          const d = (y - SHORE) / depth;
          const n = Math.round((w / (16 - d * 8)) * gust);
          for (let i = 0; i < n; i++) {
            const life = 500 + hash2(i, y, 501) * 400;
            const ph = ((ra + hash2(i, y, 502) * life) % life) / life;
            if (ph > 0.55) continue;
            const x0 =
              (hash2(i, y, 503) * w + ra * (0.03 + d * 0.03)) % (w + 8);
            const len = 1 + Math.round((1 - ph * 1.5) * (1.5 + d * 3));
            for (let k = 0; k < len; k++)
              f.blend(x0 - 4 + k, y, P.windHi, (0.65 - ph) * (0.6 + d * 0.4));
          }
        }
      }
      // shimmer
      for (let y = SHORE + 2; y < DECK; y += 2) {
        const d = (y - SHORE) / depth;
        const count = Math.round(w / (36 - d * 16));
        for (let i = 0; i < count; i++) {
          const ph = hash2(i, y, 97);
          if (Math.sin(t / 1000 + ph * 25) < 0.6) continue;
          const len = 1 + Math.round(hash2(i, y, 98) * (1 + d * 4));
          const x = Math.floor(
            hash2(i, y, 99) * w + Math.sin(t / 2400 + ph * 9) * 3
          );
          for (let k = 0; k < len; k++) f.blend(x + k, y, P.waterHi, 0.45);
        }
      }
    }

    function drawPlane(f: Frame, t: number) {
      const p = (t % 52_000) / 34_000;
      if (p > 1) return;
      const x = Math.round(w + 10 - p * (w + 20));
      const y = 30 + Math.round(p * 9);
      f.set(x, y, P.starHi);
      if (Math.floor(t / 450) % 2) f.set(x - 1, y + 1, P.navRed);
      if (t % 1400 < 100) f.set(x + 2, y, P.crownHi);
    }

    function rings(t0: number, x: number, y: number) {
      waterFx.add(t0, 2200, (f, age) => {
        for (let k = 0; k < 3; k++) {
          const a = age - k * 260;
          if (a < 0 || a > 1500) continue;
          const p = a / 1500;
          const r = 2 + p * 16;
          const c = p < 0.35 ? P.crownHi : p < 0.7 ? P.wake : P.waterHi;
          const n = Math.ceil(r * 5);
          for (let i = 0; i < n; i++) {
            const ang = (i / n) * Math.PI * 2;
            // the near half of each ring is brighter than the far half
            if (Math.sin(ang) < 0 && p > 0.5) continue;
            f.set(
              Math.round(x + Math.cos(ang) * r),
              Math.round(y + Math.sin(ang) * r * 0.3),
              c
            );
          }
        }
      });
    }

    // ---------- easter egg: the giant robot ----------
    // A nod to the life-size robot that stood at Yamashita Pier: a mecha of
    // our own in its gantry at the harbour's edge, past the warehouses, under
    // floodlights. Its visor glows and now and then it looks around. Click it
    // and it lights up like the real one's night shows: its visor flares, a
    // pulse of light runs off along the quay, two searchlights climb out of
    // the gantry and sweep the whole sky, and it waves hello.
    const RF = SHORE - 3; // its feet, on the quay
    const GH = 21; // the gantry's height
    const roboCol: Record<string, RGB> = {
      w: P.mech,
      W: P.mechShade,
      b: P.mechBlue,
      B: P.mechBlueLit,
      r: P.mechRed,
      k: P.mechDark,
      g: P.mechJoint,
      v: P.visor,
    };
    const gLamps: { x: number; y: number }[] = [];
    const gantryL = layer(w, h, (f) => {
      const top = RF - GH + 1;
      // the dock's dark steel back, ribbed, so the robot stands out against it
      f.rect(RX - 7, top + 1, 15, RF - top + 1, P.farDark);
      for (const dx of [-5, -2, 2, 5]) f.vline(RX + dx, top + 2, RF, P.farBody);
      for (const x0 of [RX - 11, RX + 7]) {
        // a lattice tower: two posts, rungs, a diagonal in each bay
        f.vline(x0, top, RF + 1, P.gantryLit);
        f.vline(x0 + 4, top, RF + 1, P.gantry);
        for (let y = RF; y > top; y -= 4) {
          f.hline(x0, x0 + 4, y, P.gantry);
          f.line(x0 + 1, y - 1, x0 + 3, y - 3, P.gantry);
          gLamps.push({ x: x0 < RX ? x0 + 4 : x0, y: y - 2 });
        }
      }
      // walkways reaching in behind the robot, and the crane beam on top
      for (const y of [RF - 7, RF - 13]) {
        f.hline(RX - 7, RX + 7, y, P.gantryLit);
        f.hline(RX - 7, RX + 7, y + 1, P.gantry);
      }
      f.hline(RX - 12, RX + 12, top - 1, P.gantryLit);
      f.hline(RX - 12, RX + 12, top, P.gantry);
    });
    let waveAt = -Infinity;
    const WAVE_FOR = 6500;
    const robotBusy = (t: number) => t - waveAt >= 0 && t - waveAt < WAVE_FOR;

    function drawRobot(f: Frame, t: number) {
      const a = t - waveAt;
      const show = a >= 0 && a < WAVE_FOR;
      // floodlights washing up the robot from the quay
      glow(f, RX, RF - 6, 9, P.flood, show ? 0.26 : 0.14, 1.2, 0.1);
      // (the gantry, copied from its layer within its own box)
      for (let y = RF - GH - 1; y <= RF + 1; y++)
        for (let x = Math.max(0, RX - 12); x <= Math.min(w - 1, RX + 12); x++) {
          const px = gantryL.pixels[y * w + x]!;
          if (px >>> 24) f.pixels[y * w + x] = px;
        }
      // the floodlights themselves, on the quay at the robot's feet
      for (const side of [-1, 1]) {
        f.set(RX + side * 5, RF, P.gantryLit);
        f.set(RX + side * 5, RF - 1, P.flood);
        f.set(RX + side * 4, RF - 1, P.lampGlassHi);
      }
      // the gantry's lamps: steady and warm, or chasing colours in the show
      for (const [i, l] of gLamps.entries()) {
        const c = show
          ? LED[(i + Math.floor(a / 110)) % LED.length]!
          : P.gantryLamp;
        if (show || (i + Math.floor(t / 1600)) % 5 !== 0) f.set(l.x, l.y, c);
      }
      if (t % 1500 < 700) f.set(RX, RF - GH - 1, P.beacon);
      // the robot
      const x0 = RX - 5;
      const y0 = RF - ROBO.length + 1;
      const turn = show ? 0 : [0, 0, -1, 0, 0, 1][Math.floor(t / 3100) % 6]!;
      for (let ry = 0; ry < ROBO.length; ry++) {
        const row = ROBO[ry]!;
        const dx = ry < 3 ? turn : 0;
        for (let rx = 0; rx < row.length; rx++) {
          const c = roboCol[row[rx]!];
          if (c !== undefined) f.set(x0 + rx + dx, y0 + ry, c);
        }
      }
      // the visor glows, brightest where it's looking
      const pulse = 0.5 + 0.5 * Math.sin(t / 700);
      for (let k = 0; k < 3; k++)
        f.set(
          x0 + 4 + k + turn,
          y0 + 2,
          lerpRGB(
            P.visor,
            P.visorHi,
            k === 1 + turn ? 0.6 + pulse * 0.4 : pulse * 0.35
          )
        );
      // the right arm: up, a wave, down again
      let arm = 0;
      if (show) {
        if (a < 120 || a > WAVE_FOR - 900) arm = 0;
        else if (a < 300 || a > WAVE_FOR - 1200) arm = 1;
        else arm = 2 + (Math.floor((a - 300) / 300) % 2);
      }
      for (const [cx2, cy2, k] of ROBO_ARM[arm]!)
        f.set(x0 + cx2, y0 + cy2, roboCol[k]!);
      if (show) {
        // the visor flares as it powers up
        const flare = 1 - smooth(a / 900);
        if (flare > 0)
          glow(
            f,
            x0 + 5 + turn,
            y0 + 2,
            4 + (1 - flare) * 14,
            P.visorHi,
            0.8 * flare,
            1,
            0.06
          );
      }
    }

    /** The robot's light show: searchlights over the whole sky, a pulse along the quay. */
    function robotShow(f: Frame, t: number) {
      const a = t - waveAt;
      if (!(a >= 0 && a < WAVE_FOR)) return;
      const fade = Math.min(1, (WAVE_FOR - a) / 900);
      // a pulse of light running away along the quay, lamp by lamp
      const run = (a - 150) * (w / 1300);
      if (run > 0)
        for (const x of quayLamps) {
          const d = Math.abs(x - RX) - run;
          if (d > 0 || d < -40) continue;
          const k = 1 + d / 40;
          f.set(x, SHORE - 2, P.lampGlassHi);
          glow(f, x, SHORE - 3, 3 + k * 4, P.gantryLamp, 0.6 * k, 1, 0.1);
        }
      // two searchlights from the top of the gantry, climbing out of it and
      // then sweeping the sky, crossing and uncrossing
      const reach = Math.hypot(w, 110) * smooth((a - 200) / 1100);
      if (reach <= 2) return;
      const off = Math.round(t / 1500 + cloudsBlown + blownBy(t));
      const clouds = cloudLayer.pixels;
      for (const side of [-1, 1]) {
        const sx = RX + side * 9;
        const sy = RF - GH - 1;
        // mostly out over the harbour, to the left of the robot
        const sweep = 0.5 - 0.5 * Math.cos(a / 650 + (side > 0 ? 2.2 : 0));
        const ang =
          side < 0
            ? -Math.PI / 2 - 0.15 - sweep * 1.3
            : -Math.PI / 2 + 0.3 - sweep * 1.0;
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);
        const spread = 0.065;
        // the wedge, scanned row by row
        const ex = sx + ca * reach;
        const ey = sy + sa * reach;
        const wx = -sa * reach * spread;
        const wy = ca * reach * spread;
        const ys = [sy, ey + wy, ey - wy];
        const y0 = Math.max(0, Math.floor(Math.min(...ys)));
        const y1 = Math.min(SHORE - 1, Math.ceil(Math.max(...ys)));
        const xs = [sx, ex + wx, ex - wx];
        const x0 = Math.max(0, Math.floor(Math.min(...xs)));
        const x1 = Math.min(w - 1, Math.ceil(Math.max(...xs)));
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const dx = x - sx;
            const dy = y - sy;
            const along = dx * ca + dy * sa;
            if (along < 1 || along > reach) continue;
            const across =
              Math.abs(-dx * sa + dy * ca) / (along * spread + 0.8);
            if (across > 1) continue;
            const u = along / reach;
            // brighter in the core and near the lamp, stepped like the art
            const lvl =
              (Math.ceil((1 - across) * 3) / 3) * (1 - u * 0.6) * 0.42 * fade;
            const cx2 = (((x - off) % w) + w) % w;
            const cloud = clouds[y * w + cx2]! >>> 24 !== 0;
            f.blend(
              x,
              y,
              cloud ? P.cloudLight : P.beam,
              cloud ? lvl * 2.2 : lvl
            );
          }
        // the lamp itself
        f.set(sx, sy, P.lampGlassHi);
        glow(f, sx, sy, 4, P.beam, 0.6 * fade, 1, 0.1);
      }
    }
    // ---------- the windy ride, down on the pier ----------

    /** Their gondola on the wheel: lit warm and pink, and it twinkles. */
    function drawEggGondola(f: Frame, t: number, gust: number, ra: number) {
      const { x: gx, y: gy } = gondolaAt(EGG_G, t);
      const sw =
        gust > 0
          ? Math.round(gust * 2.4 * Math.sin(ra / 150 + EGG_G * 1.9))
          : 0;
      const lift = Math.abs(sw) > 1 ? 1 : 0;
      const bx = gx - 1 + sw;
      const by = gy + 1 - lift;
      glow(f, bx + 1, by + 1, 5, P.crownPink, riding(t) ? 0.5 : 0.3, 1, 0.1);
      if (ra >= 0 && ra < 700) {
        // the tap: a pink flash off their gondola
        const k = 1 - ra / 700;
        glow(
          f,
          bx + 1,
          by + 1,
          6 + (1 - k) * 8,
          P.crownPinkHi,
          0.7 * k,
          1,
          0.08
        );
      }
      f.rect(bx, by, 3, 3, P.crownPinkHi);
      f.hline(bx, bx + 1, by + 1, P.gondolaWin);
      f.set(bx + 2, by + 2, P.crownPink);
      // now and then a glint off its glass
      const tw = (t + 1700) % 3900;
      if (tw < 320 && !riding(t)) {
        const k = tw < 160 ? 1 : 2;
        for (let d = 1; d <= k; d++) {
          f.blend(bx + 1, by - d - 1, P.crownHi, 0.9 - d * 0.25);
          f.blend(bx + 1 + d + 1, by + 1, P.crownHi, 0.9 - d * 0.25);
          f.blend(bx + 1 - d - 1, by + 1, P.crownHi, 0.9 - d * 0.25);
        }
      }
    }

    /** The park trees along the quay, leaning with the wind. */
    function drawTrees(f: Frame, t: number) {
      const gust = gustAt(t);
      const ra = rideAge(t);
      for (const tr of trees) {
        const n = Math.ceil(tr.r);
        const lean =
          gust > 0 ? gust * (2.4 + 1.2 * Math.sin(ra / 160 + tr.x * 0.4)) : 0;
        const rr = tr.r * tr.r + tr.r * 0.6;
        for (let dy = -n; dy <= n; dy++) {
          const sh = Math.round((lean * (n - dy)) / (2 * n));
          for (let dx = -n; dx <= n; dx++)
            if (dx * dx + dy * dy <= rr)
              f.set(
                tr.x + dx + sh,
                SHORE - 3 + dy,
                dx + dy < -1 ? P.treeHi : P.tree
              );
        }
      }
      for (const x of quayLamps) f.set(x, SHORE - 2, P.lamp);
    }

    /** Gusts: pale streaks racing left to right, wavy, brightest at the head. */
    function gusts(
      f: Frame,
      ra: number,
      gust: number,
      n: number,
      y0: number,
      y1: number,
      speed: number,
      len: number,
      seed: number,
      reach = Infinity
    ) {
      const span = w + 80;
      for (let i = 0; i < n; i++) {
        if (hash2(i, 0, seed) > gust * 1.2) continue;
        const v = speed * (0.7 + hash2(i, 1, seed) * 0.6);
        const L = Math.round(len * (0.5 + hash2(i, 2, seed)));
        const head = ((hash2(i, 3, seed) * span + ra * v) % span) - 40;
        const y = y0 + Math.floor(hash2(i, 4, seed) * (y1 - y0));
        const ph = hash2(i, 5, seed) * 6.28;
        const a0 = Math.min(1, gust * 1.4) * (0.55 + hash2(i, 6, seed) * 0.35);
        const wave = (x: number) =>
          y + Math.round(Math.sin((x + ra * 0.04) / 8 + ph) * 1.6);
        for (let k = 0; k < L; k++) {
          const x = Math.round(head - k);
          if (Math.abs(x - wheelX) > reach) continue;
          f.blend(x, wave(x), k < 2 ? P.windHi : P.wind, a0 * (1 - k / L));
        }
        // every so often, a cartoon curl at the head of the gust
        if (hash2(i, 7, seed) < 0.22 && Math.abs(head - wheelX) <= reach) {
          const cr = 2 + Math.round(hash2(i, 8, seed) * 1.5);
          const hx = Math.round(head);
          const hy = wave(hx);
          for (let q = 0; q < 14; q++) {
            const an = Math.PI / 2 - (q / 14) * Math.PI * 1.6;
            f.blend(
              Math.round(hx + Math.cos(an) * cr),
              Math.round(hy - cr + Math.sin(an) * cr),
              P.windHi,
              a0 * (1 - q / 20)
            );
          }
        }
      }
    }

    /** Leaves torn off the trees, fluttering away on the wind. */
    function leaves(
      f: Frame,
      ra: number,
      gust: number,
      n: number,
      seed: number,
      y0: number,
      y1: number
    ) {
      const span = w + 20;
      for (let j = 0; j < n; j++) {
        if (hash2(j, 0, seed) > gust * 1.25) continue;
        const age = ra - 250 - hash2(j, 1, seed) * 1400;
        if (age < 0) continue;
        const from = trees.length
          ? trees[j % trees.length]!.x
          : hash2(j, 3, seed) * w;
        const v = 0.08 + hash2(j, 2, seed) * 0.14;
        const x = Math.round((((from + age * v) % span) + span) % span) - 10;
        const to = y0 + hash2(j, 4, seed) * (y1 - y0);
        const y = Math.round(
          SHORE -
            4 +
            (to - SHORE + 4) * (1 - Math.exp(-age / 650)) +
            Math.sin(age / 130 + j) * 3
        );
        const c = [P.leaf1, P.leaf2, P.leaf3][j % 3]!;
        const spin = Math.floor(age / 85 + j) % 4;
        // a leaf turning over: flat, edge-on, flat, edge-on
        f.set(x, y, c);
        if (spin !== 1) f.set(x + 1, y, c);
        if (spin === 0) f.set(x + 1, y - 1, c);
        else if (spin === 2) f.set(x, y + 1, c);
        else f.set(x, y - 1, c);
      }
    }

    function drawHat(f: Frame, x: number, y: number, turn: number) {
      const rows = HAT[((turn % 4) + 4) % 4]!;
      for (let ry = 0; ry < rows.length; ry++)
        for (let rx = 0; rx < rows[ry]!.length; rx++) {
          const ch = rows[ry]![rx];
          if (ch === 'h') f.set(x + rx, y + ry, P.hat);
          else if (ch === 's') f.set(x + rx, y + ry, P.hatShade);
          else if (ch === 'b') f.set(x + rx, y + ry, P.hatBand);
        }
    }

    /** The wind across the harbour, in front of everything. */
    function windOnThePier(f: Frame, t: number) {
      const gust = gustAt(t);
      if (gust <= 0) return;
      const ra = rideAge(t);
      // it gets up round the wheel first, then sweeps the whole harbour
      const reach = 30 + (ra / 1000) * w;
      gusts(
        f,
        ra,
        gust,
        Math.round(w * 0.3),
        4,
        RAIL - 2,
        0.32,
        22,
        301,
        reach
      );
      leaves(f, ra, gust, Math.round(w / 6), 302, SHORE - 60, RAIL - 6);
      // somebody's sun hat goes cartwheeling right across the picture
      const HAT0 = 650;
      const HAT1 = 2450;
      if (ra > HAT0 && ra < HAT1) {
        const p = (ra - HAT0) / (HAT1 - HAT0);
        // a loop-the-loop on the way
        const q = clamp01((p - 0.42) / 0.2);
        const loop = q > 0 && q < 1 ? q * Math.PI * 2 : 0;
        const x = -8 + p * (w + 16) + Math.sin(loop) * 11;
        const y =
          RAIL -
          12 -
          (RAIL - 46) * Math.sin(Math.PI * p) ** 0.7 -
          (1 - Math.cos(loop)) * 9;
        drawHat(f, Math.round(x - 4), Math.round(y), Math.floor(ra / 110));
      }
    }

    // ---------- the windy ride: up in their gondola ----------
    // Close up at the top of the wheel: the rim arching overhead, spokes
    // running down to the hub far below, their gondola hanging in the middle
    // with the neighbours down the curve either side, the city spread out
    // under them.
    const UX = cx; // their gondola's pivot on the rim
    const RIM_Y = 9; // the top of the rim
    const WR = 230; // the wheel's radius, this close
    const HUB_Y = RIM_Y + WR; // its hub, well below the picture
    const PIV_Y = RIM_Y + 8;
    const CW = 68; // the gondola, close up; it hangs from (CPX, 0)
    const CH = 58;
    const CPX = 34;
    const HZ = 106; // the horizon, far off below
    const upF = new Frame(w, h);
    const eggCab = new Frame(CW, CH);
    const nextCab = new Frame(CW, CH);
    /** A point on the wheel `r` from the hub, `phi` from straight up. */
    const onWheelUp = (phi: number, r: number) => ({
      x: UX + Math.sin(phi) * r,
      y: HUB_Y - Math.cos(phi) * r,
    });
    // the lights along the rim and down the spokes, coloured as the show runs
    const upLeds: { x: number; y: number; phi: number; r: number }[] = [];
    const upSpokes: {
      x: number;
      y: number;
      phi: number;
      r: number;
      k: number;
    }[] = [];

    // the view from the top: night sky, the city spread out below, the
    // wheel's rim arching over it all
    const upView = layer(w, h, (f) => {
      gradient(f, 0, HZ, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
        P.haze,
      ]);
      stars(f, 23, Math.round(w / 8), HZ - 30, 0, [P.star, P.starHi], false);
      const mx = Math.round(Math.min(w - 22, cx + w * 0.36));
      glow(f, mx, 22, 13, P.star, 0.2, 1, 0.12);
      moon(
        f,
        mx,
        22,
        5,
        { light: P.moonLight, mid: P.moonMid, dark: P.moonDark },
        0.36
      );
      // the city below: a haze of lights on the horizon, closer streets
      // spread out under us; the bay off to one side
      const shoreAt = (y: number) => w * 0.62 + (y - HZ) * 1.6;
      for (let y = HZ; y < h; y++) {
        const d = (y - HZ) / (h - HZ);
        for (let x = 0; x < w; x++) {
          if (x > shoreAt(y)) {
            // water: dark, the odd glint of a reflected light
            f.set(x, y, lerpRGB(P.water1, P.water3, d));
            if (hash2(x >> 1, y, 401) > 0.985)
              f.set(x, y, lerpRGB(P.waterHi, P.winWarm, hash2(x, y, 402)));
            continue;
          }
          f.set(x, y, lerpRGB(P.farDark, P.water3, d));
          // streets: a grid getting wider as it comes towards us
          const gap = 2 + Math.floor(d * 7);
          const street =
            (y - HZ) % (gap + 1) === 0 ||
            Math.floor(x / (gap * 2 + 3)) !==
              Math.floor((x + 1) / (gap * 2 + 3));
          const v = hash2(x, y, 403);
          if (street && v > 0.5 - d * 0.1)
            f.set(x, y, v > 0.85 ? P.winWarm2 : v > 0.7 ? P.winWarm : P.farWin);
          else if (v > 0.95 - (1 - d) * 0.2)
            f.set(x, y, v > 0.98 ? P.winCool : P.farWin);
        }
      }
      for (let y = HZ; y < h; y += 2) f.set(Math.round(shoreAt(y)), y, P.lamp);
      f.hline(0, w, HZ, P.haze);
      for (let x = 0; x < w; x += 2)
        if (hash2(x, 0, 404) > 0.4)
          f.set(x, HZ + 1, hash2(x, 1, 404) > 0.5 ? P.winWarm : P.farWin);
      // the spokes, down to the hub
      for (let k = 0; k < N; k++) {
        const phi = ((k + 0.5) / N) * Math.PI * 2;
        if (Math.cos(phi) < 0.2) continue;
        for (let r = WR - 7; r > 0; r -= 0.7) {
          const p = onWheelUp(phi, r);
          if (p.y >= h) break;
          const x = Math.round(p.x);
          const y = Math.round(p.y);
          if (x < -2 || x > w + 2) continue;
          f.set(x + 1, y, P.steelDark);
          upSpokes.push({ x, y, phi, r, k });
        }
      }
      // the rim: an outer and an inner chord, a lattice between
      for (let phi = -1.6; phi <= 1.6; phi += 0.6 / WR) {
        for (let dr = 0; dr <= 6; dr++) {
          const p = onWheelUp(phi, WR - dr);
          const x = Math.round(p.x);
          const y = Math.round(p.y);
          if (x < 0 || x >= w || y < 0 || y >= h) continue;
          const along = Math.round(phi * WR);
          if (dr === 0 || dr === 6) f.set(x, y, P.steel);
          else if (dr === 1 || dr === 5) f.set(x, y, P.steelDark);
          else if ((along + dr) % 6 === 0 || (along - dr + 600) % 6 === 0)
            f.set(x, y, P.steelDark);
        }
      }
      for (let phi = -1.6; phi <= 1.6; phi += 3 / WR) {
        const p = onWheelUp(phi, WR);
        upLeds.push({ x: Math.round(p.x), y: Math.round(p.y), phi, r: WR });
      }
    });

    /** Their gondola (or strangers'), drawn upright into its own frame. */
    function paintGondola(g: Frame, ra: number, egg: boolean, sway: number) {
      g.clear();
      // the hanger and its yoke
      g.vline(CPX - 1, 0, 8, P.steel);
      g.vline(CPX, 0, 8, P.steelDark);
      g.hline(CPX - 7, CPX + 6, 8, P.gFrameShade);
      g.hline(CPX - 6, CPX + 5, 7, P.gFrameMid);
      // the shell: a domed roof, a big window, a band of lights below it
      const rowSpan = (y: number): [number, number] | null => {
        if (y < 9) return null;
        if (y === 9) return [20, 47];
        if (y === 10) return [13, 54];
        if (y === 11) return [9, 58];
        if (y === 12) return [7, 60];
        if (y < 54) return [6, 61];
        if (y === 54) return [7, 60];
        if (y === 55) return [9, 58];
        if (y === 56) return [13, 54];
        return null;
      };
      for (let y = 9; y < CH; y++) {
        const sp = rowSpan(y);
        if (!sp) continue;
        for (let x = sp[0]; x <= sp[1]; x++) {
          const u = (x - sp[0]) / (sp[1] - sp[0]);
          let c = u < 0.1 ? P.gFrame : u < 0.78 ? P.gFrameMid : P.gFrameShade;
          if (y >= 52) c = u < 0.5 ? P.gFrameShade : P.gFrameDark;
          if (y === 9 || x === sp[0]) c = P.gFrame;
          g.set(x, y, c);
        }
      }
      // inside: light on the back wall, the bench
      const wx0 = 10;
      const wx1 = 57;
      const wy0 = 17;
      const wy1 = 44;
      for (let y = wy0; y <= wy1; y++)
        g.hline(
          wx0,
          wx1,
          y,
          egg
            ? y < 25
              ? P.gIn
              : y < 33
                ? P.gInMid
                : P.gInLo
            : y < 30
              ? P.gInCool
              : P.gInCoolLo
        );
      const seat = 41;
      g.hline(wx0, wx1, seat, P.gSeatHi);
      g.rect(wx0, seat + 1, wx1 - wx0 + 1, wy1 - seat, P.gSeat);
      if (egg) {
        const u = ra - UP_IN;
        // the man: rigid, gripping the bench, shaking when it swings hard
        const shake = Math.abs(sway) > 0.1 ? Math.floor(u / 45) % 2 : 0;
        const mx = 11 + shake;
        const my = wy1 - MAN_RIDE.length + 1;
        paintRows(g, MAN_RIDE, mx, my, manCol);
        // ...his hair on end at the top of each big swing
        if (Math.abs(sway) > 0.16)
          for (let k = 0; k < 4; k++) {
            const hx = mx + 4 + k * 2;
            const tall = (k + Math.floor(u / 90)) % 2;
            g.set(hx, my - 1, P.manHair);
            if (tall) g.set(hx + (k < 2 ? -1 : 1), my - 2, P.manHair);
          }
        // ...beads of sweat flying off him
        for (let k = 0; k < 2; k++) {
          const sa = (u + k * 300) % 600;
          const side = k ? 1 : -1;
          const sx = mx + 7 + side * (5 + sa / 60);
          const sy = my + 2 - sa / 70 + (sa / 140) ** 2;
          g.set(Math.round(sx), Math.round(sy), P.sweat);
          g.set(Math.round(sx), Math.round(sy) + 1, P.sweat);
        }
        // the kid, bouncing on the bench with her arms up
        const ph = (((u % 380) + 380) % 380) / 380;
        const up = Math.sin(Math.PI * ph);
        const kid = up > 0.3 ? KID_UP : KID_LAND;
        paintRows(g, kid, 28, seat - kid.length - Math.round(up * 5), kidCol);
        // and the woman beside them, steadying her
        paintRows(g, WOMAN_RIDE, 42, wy1 - WOMAN_RIDE.length + 1, womanCol);
      } else {
        // strangers, sitting tight
        paintRows(g, STRANGER, 16, wy1 - STRANGER.length + 1, strangerCol);
        paintRows(g, STRANGER, 41, wy1 - STRANGER.length + 2, strangerCol);
      }
      // window frame and glass: mullions, the sill, a gleam across it all
      for (const mx of [wx0 + 16, wx1 - 16]) g.vline(mx, wy0, wy1, P.gFrameMid);
      g.hline(wx0 - 1, wx1 + 1, wy0 - 1, P.gFrameShade);
      g.hline(wx0 - 1, wx1 + 1, wy1 + 1, P.gFrame);
      for (let y = wy0; y <= wy1; y++)
        for (let x = wx0; x <= wx1; x++) {
          const d = (x + y * 0.6) % 26;
          if (d < 2) g.blend(x, y, P.gGlass, 0.2);
        }
      // the band of lights under the window, chasing
      for (let x = 10; x < 58; x += 2)
        g.set(
          x,
          49,
          egg
            ? Math.floor(x / 2 + ra / 90) % 3
              ? P.crownPink
              : P.crownPinkHi
            : LED[Math.floor(x / 2 + ra / 120) % 8]!
        );
    }
    const manCol: Record<string, RGB> = {
      H: P.manHair,
      h: P.manHairHi,
      D: P.manHairSh,
      b: P.manBeard,
      E: P.manEye,
      M: P.manMouth,
      s: P.manSkin,
      S: P.manSkinSh,
      k: P.manKnuckle,
      J: P.manHood,
      j: P.manHoodHi,
      K: P.manHoodSh,
      w: P.manString,
      '5': P.manLogo,
      L: P.manJeans,
      l: P.manJeansHi,
    };
    const womanCol: Record<string, RGB> = {
      H: P.womanHair,
      h: P.womanHairHi,
      s: P.manSkin,
      S: P.manSkinSh,
      W: P.womanKnit,
      w: P.womanKnitHi,
      K: P.womanKnitSh,
      L: P.womanLegs,
    };
    const kidCol: Record<string, RGB> = {
      p: P.kPom,
      Y: P.kHat,
      y: P.kHatHi,
      H: P.kHair,
      s: P.manSkin,
      R: P.kCoat,
      r: P.kCoatHi,
      T: P.kLegs,
      e: P.kBoots,
    };
    const strangerCol: Record<string, RGB> = {
      '#': P.people,
      o: P.peopleRim,
    };
    function paintRows(
      g: Frame,
      rows: readonly string[],
      x: number,
      y: number,
      col: Record<string, RGB>
    ) {
      for (let ry = 0; ry < rows.length; ry++)
        for (let rx = 0; rx < rows[ry]!.length; rx++) {
          const c = col[rows[ry]![rx]!];
          if (c !== undefined) g.set(x + rx, y + ry, c);
        }
    }

    /**
     * Hangs a gondola frame from (px, py), swung by `ang` radians: rotated
     * by three shears, which moves every pixel without losing any, so the
     * little people inside stay whole.
     */
    function swingBlit(
      f: Frame,
      g: Frame,
      px: number,
      py: number,
      ang: number
    ) {
      const a = -Math.tan(ang / 2);
      const b = Math.sin(ang);
      const src = g.pixels;
      const dst = f.pixels;
      for (let ly = 0; ly < CH; ly++) {
        const s1 = Math.round(a * (ly + 0.5));
        for (let lx = 0; lx < CW; lx++) {
          const p = src[ly * CW + lx]!;
          if (!(p >>> 24)) continue;
          const x1 = lx - CPX + s1;
          const y1 = ly + Math.round(b * (x1 + 0.5));
          const x2 = x1 + Math.round(a * (y1 + 0.5));
          const x = px + x2;
          const y = py + y1;
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          dst[y * w + x] = p;
        }
      }
    }

    /** How far their gondola is swung out, close up. */
    const swayAt = (ra: number) => {
      const u = ra - UP_IN;
      const amp =
        0.1 +
        0.2 *
          smooth((ra - UP_IN - 300) / 1200) *
          (1 - smooth((ra - 5300) / 900));
      return amp * (Math.sin(u / 170) + 0.3 * Math.sin(u / 61 + 1));
    };

    function renderUp(f: Frame, t: number) {
      const ra = rideAge(t);
      const gust = Math.max(0.6, gustAt(t));
      const mode = modeAtT(t);
      const rot = rotAt(t);
      f.copyFrom(upView);
      // the spokes and the rim, lit in the wheel's show: the same lights,
      // spoke for spoke, as the wheel seen from the pier
      const kTop = (phi: number) =>
        Math.floor(
          ((((phi - Math.PI / 2 - rot) / (Math.PI * 2)) % 1) + 1) * N
        ) % N;
      for (const s of upSpokes) {
        const ang = s.phi - Math.PI / 2;
        f.set(s.x, s.y, spokeColor(mode, kTop(s.phi), ang, (s.r / WR) * R, t));
      }
      for (const l of upLeds) {
        const ang = l.phi - Math.PI / 2;
        const c = spokeColor(mode, kTop(l.phi), ang, R, t);
        f.set(l.x, l.y, c);
        f.blend(l.x, l.y - 1, c, 0.4);
      }
      gusts(f, ra, gust, Math.round(w / 6), 0, h, 0.5, 22, 311);
      // the gondolas either side of theirs, down the curve, swinging too
      for (const s of [-3, -2, -1, 1, 2, 3]) {
        const p = onWheelUp(s * 0.62, WR);
        if (p.x < -40 || p.x > w + 40 || p.y > h) continue;
        const px = Math.round(p.x);
        const py = Math.round(p.y) + 8;
        f.rect(px - 2, py - 8, 5, 8, P.steelDark);
        paintGondola(nextCab, ra + s * 300, false, 0);
        swingBlit(f, nextCab, px, py, swayAt(ra + s * 410) * 0.75);
      }
      // theirs
      f.rect(UX - 3, PIV_Y - 2, 6, 3, P.steel);
      const sway = swayAt(ra);
      paintGondola(eggCab, ra, true, sway);
      swingBlit(f, eggCab, UX, PIV_Y, sway);
      // the wind rushing past, close
      gusts(f, ra, gust, Math.round(w / 16), 0, h, 0.8, 36, 312);
      leaves(f, ra + 900, gust, Math.round(w / 30), 313, 10, h - 10);
      // ...and that hat again, sailing right past under them
      const ha = ra - 4100;
      if (ha > 0 && ha < 1100) {
        const p = ha / 1100;
        drawHat(
          f,
          Math.round(-10 + p * (w + 20)),
          Math.round(
            PIV_Y + CH + 12 - Math.sin(p * Math.PI) * 16 + Math.sin(p * 11) * 3
          ),
          Math.floor(ha / 90)
        );
      }
    }

    const onRobot = (x: number, y: number) =>
      (Math.abs(x - RX) <= 12 && y >= RF - GH - 2 && y <= RF + 2) ||
      Math.hypot(x - RX, y - (RF - 7)) <= 9 + 6;

    /** Their gondola's middle, unless it's down behind the arcade. */
    // generous: it's small and on the move, and a near miss on the wheel
    // only changes its lights
    const OUR_R = 10;
    const eggSpot = (t: number) => {
      const g = gondolaAt(EGG_G, t);
      return g.y <= SHORE - 12 ? { x: g.x, y: g.y + 2 } : null;
    };
    const onEggGondola = (x: number, y: number, t: number) => {
      const g = eggSpot(t);
      // as far as the counter reaches for a finger, so a find always plays
      return !!g && Math.hypot(x - g.x, y - g.y) <= OUR_R + 6;
    };
    function startRide(t: number) {
      if (rideAt > -Infinity) {
        // the last ride's turn of the wheel and push on the clouds stay put
        cloudsBlown += blownBy(rideAt + RIDE_FOR);
        rideSpin += rideTurn;
      }
      rideAt = t;
      rideTurn = 0;
      // turn the wheel (forwards, as it goes) to bring them up to the top
      const a = gondolaAt(EGG_G, t + SPIN_MS).a;
      const TAU = Math.PI * 2;
      rideTurn = (((-Math.PI / 2 - a) % TAU) + TAU) % TAU;
    }

    const onWheel = (x: number, y: number) =>
      Math.hypot(x - wheelX, y - wheelY) <= R + 3;
    const onLandmark = (x: number, y: number) =>
      y >= lmTop - 2 && y < SHORE - 2 && Math.abs(x - lmX) <= 10;
    const onRopeway = (x: number, y: number) =>
      x > rwA - 6 && x < rwB + 6 && Math.abs(y - cableY(x, 0) - 3) < 6;
    const onGull = (x: number, y: number) =>
      Math.abs(x - gullX - 1) < 4 && y > RAIL - 6 && y < RAIL + 2;

    function renderPier(f: Frame, t: number, pointer?: Pointer | null) {
      f.copyFrom(sky);
      f.over(
        cloudLayer,
        Math.round(t / 1500 + cloudsBlown + blownBy(t)),
        0,
        true
      );
      drawPlane(f, t);
      f.over(city);
      blinkBeacons(f, beacons, t, P.beacon);
      // Landmark crown lights
      const [cLo, cHi] =
        crownMode === 1
          ? [P.crownPink, P.crownPinkHi]
          : crownMode === 2
            ? [P.crownGold, P.crownGoldHi]
            : [P.crown, P.crownHi];
      for (const p of crownPts) f.set(p.x, p.y, p.hi ? cHi : cLo);
      glow(f, lmX, lmTop + 4, 9, cLo, 0.2, 1, 0.14);
      drawCabins(f, t);
      drawWheel(f, t, !!pointer && onWheel(pointer.x, pointer.y));
      f.over(front);
      drawTrees(f, t);
      drawRobot(f, t);
      robotShow(f, t);
      glow(
        f,
        wheelX,
        wheelY,
        R + 7,
        LED[modeAtT(t) === 3 ? 7 : 4]!,
        0.12,
        1,
        0.1
      );
      skyFx.draw(f, t);
      harbour(f, t);
      // boats
      const wing = crossing(t, 70_000, 56_000, 20_000);
      if (wing) {
        const L = 44;
        const x = wing.dir > 0 ? -L + wing.p * (w + L) : w - wing.p * (w + L);
        drawBoat(f, { y: SHORE + 7, len: L, kind: 'wing' }, x, wing.dir, t);
      }
      const bass = crossing(t, 23_000, 10_000, 3_000);
      if (bass) {
        const L = 18;
        const x =
          bass.dir > 0
            ? -L - 20 + bass.p * (w + L + 40)
            : w + 20 - bass.p * (w + L + 40);
        drawBoat(f, { y: SHORE + 17, len: L, kind: 'bass' }, x, bass.dir, t);
      }
      for (const s of speedboats) {
        const p = (t - s.at) / 5000;
        if (p < 0 || p > 1) continue;
        const x = s.dir > 0 ? -12 + p * (w + 24) : w + 12 - p * (w + 24);
        drawBoat(f, { y: s.y, len: 10, kind: 'speed' }, x, s.dir, t);
      }
      waterFx.draw(f, t);
      f.over(deck);
      // bollard lights on the deck, the photographer's phone
      for (const lx of lamps) {
        glow(f, lx, LAMP_TOP + 3, 7, P.lampWarm, 0.38, 1, 0.2);
      }
      // the photographer's screen shows the wheel; now and then the flash goes
      const mode = modeAtT(t);
      for (let k = 0; k < 6; k++)
        f.set(
          photoX + 2 + (k % 3),
          DECK - 14 + Math.floor(k / 3),
          spokeColor(mode, k * 5, k, 12, t)
        );
      f.set(photoX + 3, DECK - 14, P.hub);
      if (t % 9000 < 110)
        glow(f, photoX + 3, DECK - 13, 7, P.phone, 0.7, 1, 0.2);
      // the gull on the rail
      const gone = t - gull.flownAt;
      if (gone > 9000 || gone < 0) {
        const look = Math.floor(t / 2300) % 3 === 0 ? 1 : 0;
        f.set(gullX + 1, RAIL - 3, P.gull);
        f.set(gullX + 1 + look, RAIL - 3, P.gull);
        f.hline(gullX, gullX + 2, RAIL - 2, P.gull);
        f.set(gullX + (look ? 3 : -1), RAIL - 3, P.fwGold);
        f.hline(gullX, gullX + 1, RAIL - 1, P.gullShade);
      } else if (gone > 7000) {
        // gliding back in
        const p = (gone - 7000) / 2000;
        const gx = Math.round(gullX + 1 + (1 - p) * 60); // lands where it sat
        const gy = Math.round(RAIL - 2 - (1 - p) * 30);
        f.set(gx, gy, P.gull);
        f.set(gx - 1, gy - 1, P.gull);
        f.set(gx + 1, gy - 1, P.gull);
      }
      windOnThePier(f, t);
      topFx.draw(f, t);
    }

    let now = 0;
    return {
      render(f, t, pointer) {
        now = t;
        const mix = upMix(t);
        if (mix >= 1) {
          renderUp(f, t);
          return;
        }
        renderPier(f, t, pointer);
        if (mix <= 0) return;
        // an ordered dissolve up to the gondola and back
        renderUp(upF, t);
        const px = f.pixels;
        const up = upF.pixels;
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++)
            if (bayer8(x, y) < mix) px[y * w + x] = up[y * w + x]!;
      },
      poke(x, y, t) {
        // up in the gondola, the ride is all there is
        if (upMix(t) > 0) return;
        if (!riding(t) && onEggGondola(x, y, t)) {
          startRide(t);
          return;
        }
        if (onRobot(x, y)) {
          if (!robotBusy(t)) waveAt = t;
          return;
        }
        if (onGull(x, y) && t - gull.flownAt > 9000) {
          gull.flownAt = t;
          topFx.add(t, 3000, (f, age) => {
            const a = age / 1000;
            const gx = Math.round(gullX + 1 - 26 * a - 4 * a * a);
            const gy = Math.round(RAIL - 3 - 18 * a + 2 * a * a);
            const up = Math.floor(age / 110) % 2 === 0;
            f.set(gx, gy, P.gull);
            f.set(gx - 1, gy + (up ? -1 : 0), P.gull);
            f.set(gx + 1, gy + (up ? -1 : 0), P.gull);
            f.set(gx - 2, gy + (up ? -2 : 0), P.gullShade);
            f.set(gx + 2, gy + (up ? -2 : 0), P.gullShade);
          });
          return;
        }
        if (onWheel(x, y)) {
          modeBase = (modeBase + 1) % MODES;
          modeAt = t;
          return;
        }
        if (onLandmark(x, y)) {
          crownMode = (crownMode + 1) % 3;
          sparkle(skyFx, t, lmX, lmTop + 2, P.crownHi);
          return;
        }
        if (onRopeway(x, y)) {
          rainbowAt = t;
          sparkle(skyFx, t, x, y, P.crownHi);
          return;
        }
        if (y >= SHORE && y < RAIL) {
          rings(t, x, y);
          splash(waterFx, t, x, y, P.waterHi, Math.round(t));
          if (speedboats.filter((s) => t - s.at < 5000).length < 2) {
            speedboats.push({
              at: t + 300,
              y: Math.min(RAIL - 3, Math.max(SHORE + 6, y)),
              dir: x < cx ? 1 : -1,
            });
            if (speedboats.length > 4) speedboats.shift();
          }
          return;
        }
        if (y < SHORE) {
          const palettes = [
            [P.fwWhite, P.fwGold, P.fwRed, P.sky4],
            [P.fwWhite, P.fwPink, P.fwViolet, P.sky4],
            [P.fwWhite, P.fwCyan, P.fwBlue, P.sky3],
            [P.fwWhite, P.fwGreen, P.fwCyan, P.sky3],
            [P.fwWhite, P.fwGold, P.fwPink, P.sky4],
          ];
          const seed = Math.floor(t) % 997;
          const by = Math.max(30, Math.min(y, SHORE - 30));
          firework(
            skyFx,
            t,
            x + (hash2(seed, 1, 2) - 0.5) * 10,
            SHORE + 4,
            by,
            palettes[seed % palettes.length]!,
            seed
          );
          // and a smaller one beside it
          const x2 =
            x +
            (hash2(seed, 3, 2) > 0.5 ? 1 : -1) * (18 + hash2(seed, 4, 2) * 20);
          firework(
            skyFx,
            t + 350,
            x2,
            SHORE + 4,
            by + 10 + hash2(seed, 5, 2) * 12,
            palettes[(seed + 2) % palettes.length]!,
            seed + 1
          );
        }
      },
      hot(x, y) {
        if (upMix(now) > 0) return false;
        return y < RAIL || onGull(x, y);
      },
      eggs(t) {
        if (upMix(t) > 0) return [];
        const spots: EggSpot[] = [];
        // the robot, middle of its chest (its whole gantry answers a click)
        if (!robotBusy(t)) spots.push({ id: 'robot', x: RX, y: RF - 7, r: 9 });
        // their gondola, wherever the wheel has taken it
        const g = eggSpot(t);
        if (g && !riding(t))
          spots.push({ id: 'wheel', x: g.x, y: g.y, r: OUR_R });
        return spots;
      },
    };
  },
};
