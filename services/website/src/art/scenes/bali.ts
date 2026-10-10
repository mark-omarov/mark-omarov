// Bali at dawn, at Pura Lempuyang: the split gate, the candi bentar, two
// mirror-image stone towers with a clean vertical cut between them, framing
// Mount Agung lit pink by the sun rising behind us, over a sea of cloud. The
// courtyard floor is polished like a mirror (the famous photo), frangipani
// trees drop flowers on it, penjor bend over the walls, offerings smoke on
// the steps and someone is always posing in the gate.
//
// Click between the gates for a shimmer of light, the visitor to make them
// jump, Agung to make it puff, the sky for egrets, a frangipani for falling
// flowers, the floor for ripples.
//
// Three eggs: a black SUV backs into the patched stretch of courtyard wall on
// the right; a tiny pair of headlights crawling up the volcano turns the
// morning back to before dawn, with jeeps on the road and the sun breaking
// over the rim; the scooter parked by the wall brings a group of six in from
// both sides, and a flash leaves a print of a group photo at a lakeside
// viewpoint.

import { Frame, lerpRGB, type RGB } from '../frame';
import { Fx, ripple, sparkle } from '../fx';
import { fbm1, hash2, noise1 } from '../noise';
import { clouds, glow, gradient, smoke } from '../paint';
import { layer, palette, type Scene } from '../scene';
import {
  crownOf,
  drawFigure,
  drawLittle,
  type Figure,
  type Little,
  type Pose,
} from '../things/bali-people';

const P = palette({
  // a dawn sky looking west: blue overhead, a pink belt, the earth's shadow low down
  sky0: '#2c3a8e',
  sky1: '#3e4aa2',
  sky2: '#5a5cb4',
  sky3: '#7e6ec0',
  sky4: '#a880c4',
  sky5: '#d293c0',
  sky6: '#f0a8b6',
  sky7: '#f8bfae',
  belt: '#f4c8b4',
  cloudLight: '#ffe0bc',
  cloudBase: '#f4aeb4',
  cloudShadow: '#b886b8',
  // Agung, catching the first sun
  agHi: '#ffd2a8',
  agLit: '#eaa49c',
  ag: '#c47e96',
  agSh: '#94628c',
  agDeep: '#6c4c80',
  plume: '#f0d8dc',
  plumeSh: '#c4a8c4',
  ash: '#8a7890',
  ashSh: '#5e5070',
  // the sea of cloud below it
  seaLight: '#fff2e2',
  seaBase: '#f8d4ce',
  seaShade: '#dcaabe',
  seaDeep: '#b68cb2',
  // forested ridges below the clouds
  hill0: '#2e3c64',
  hill1: '#3e5274',
  hill2: '#56707e',
  palmFar: '#283456',
  // gate stone: dark weathered andesite, warm where the sun touches it
  stoneHi: '#f2c8a6',
  stoneLit: '#c49a92',
  stone: '#8a7086',
  stoneMid: '#73607a',
  stoneSh: '#57486a',
  stoneDeep: '#3c3150',
  stoneDark: '#2a2140',
  moss: '#5c6a5e',
  brick: '#b0604c',
  brickHi: '#c87a5e',
  brickSh: '#7c3c3c',
  brickJoint: '#8a4842',
  // floor
  floorTint: '#30284a',
  floorHi: '#f6d6c0',
  // frangipani
  bark: '#9a8a80',
  barkHi: '#c4b2a4',
  barkSh: '#64565e',
  leaf0: '#244e38',
  leaf1: '#3a7444',
  leaf2: '#64a050',
  bloom: '#fffaf0',
  bloomSh: '#f0d8d0',
  bloomEye: '#ffd24a',
  bloomPink: '#ff9ec0',
  // penjor
  bamboo: '#e0c470',
  bambooSh: '#a88a46',
  janur: '#f6eea4',
  janurSh: '#c8c060',
  sampian: '#fff6c0',
  // offerings
  tray: '#7aa83a',
  trayHi: '#a8cc5a',
  petalRed: '#ff4a4a',
  petalYellow: '#ffd23f',
  petalWhite: '#ffffff',
  petalPink: '#ff8ac8',
  petalPurple: '#9a5ae0',
  incense: '#e8d8e4',
  incense2: '#c0b0cc',
  ember: '#ff8a3a',
  umbrella: '#fff4dc',
  umbrellaSh: '#e0c8b0',
  umbrellaGold: '#ffc83a',
  // people
  skin: '#c88a64',
  skinSh: '#9a6248',
  hair: '#1e1620',
  shirt: '#fff4ec',
  shirtSh: '#d6c6cc',
  sarong0: '#7a3ab0',
  sarong1: '#d03a4a',
  sarong2: '#2a8a6a',
  sarong3: '#e8a42a',
  sash: '#ffd23f',
  fruitRed: '#e8403a',
  fruitGreen: '#8ac040',
  fruitYellow: '#ffd23f',
  // birds and sparkle
  bird: '#3a2c50',
  shine: '#fff6d8',
  shine2: '#ffd8a0',
  // the tourist in the sun hat
  shades: '#120e1a',
  tSkin: '#f4caa8',
  tSkinSh: '#c89a80',
  hat: '#f2d27c',
  hatSh: '#b88e48',
  tee: '#3ab4c4',
  teeSh: '#26869a',
  // the black SUV, and the wall's owner
  car: '#1c1a28',
  carHi: '#3e3a58',
  carSheen: '#a690bc',
  glass: '#2e2a48',
  glassHi: '#d8a4bc',
  tyre: '#0c0a12',
  hubcap: '#8a8698',
  tail: '#c42c3a',
  tailHot: '#ff5a50',
  reverse: '#fff4e4',
  hazard: '#ffb030',
  headlamp: '#fff0d0',
  hoodie: '#1a1822',
  hoodieHi: '#463c52',
  trousers: '#100e16',
  sole: '#5a5466',
  dust: '#ecd6c6',
  dust2: '#c8aca6',
  // the man: short light-brown hair, a short beard, a black tee
  manHair: '#8a5e3a',
  manHairLit: '#b88a58',
  manBeard: '#9a6c44',
  manSkin: '#f0c4a4',
  manSkinSh: '#c8927a',
  manTee: '#1f2029',
  manTeeSh: '#121219',
  manTeeLit: '#5e4e62',
  manShorts: '#2c4a86',
  manShortsSh: '#1e3466',
  manShoe: '#a8a4ae',
  // the woman: long straight dark hair, a taupe sleeveless knit
  womanHair: '#16101a',
  womanHairLit: '#4a3a44',
  womanSkin: '#f2cbb0',
  womanSkinSh: '#c89a84',
  womanDress: '#a8968a',
  womanDressSh: '#7e6e66',
  womanShoe: '#2a2228',
  // the girl: long brown hair, a lavender-blue tee, a lilac skirt
  girlHair: '#6a4430',
  girlSkin: '#ecb894',
  girlSkinSh: '#c08a6c',
  girlTop: '#8c9ae8',
  girlTopSh: '#6a74c4',
  girlSkirt: '#c8a8f0',
  // the elder: dark wavy hair to her shoulders, sunglasses pushed up on her
  // head, a white tee and jeans
  elderHair: '#3a2420',
  elderHairLit: '#6e4a3a',
  elderSkin: '#e2a888',
  elderSkinSh: '#b47c64',
  elderTop: '#f6f2ee',
  elderTopSh: '#d0c8cc',
  elderJeans: '#4a6a9a',
  elderJeansSh: '#34507a',
  elderShoe: '#e8e4ec',
  sunnies: '#141018',
  // the stocky one: short light-brown hair, a taupe tee, white shorts
  stockyHair: '#9a7048',
  stockyHairLit: '#c49a68',
  stockySkin: '#ecba98',
  stockySkinSh: '#c48a70',
  stockyTop: '#a89482',
  stockyTopSh: '#806c5e',
  stockyShorts: '#eeeae6',
  stockyShortsSh: '#c8c0c4',
  stockyShoe: '#2a2430',
  // the tall one: a dark shaggy fringe, a big white graphic tee
  tallHair: '#2a1e1c',
  tallHairLit: '#4e3a34',
  tallSkin: '#f2c8ac',
  tallSkinSh: '#c89880',
  tallTop: '#f2f0ee',
  tallTopSh: '#ccc6ca',
  tallPrint: '#3a3640',
  tallTrousers: '#d8d0c4',
  tallTrousersSh: '#b0a89c',
  tallShoe: '#f0ecf0',
  // the print: a group photo at the Lake Batur viewpoint
  bSky0: '#86a8d8',
  bSky1: '#aac4e6',
  bSky2: '#d4e2f0',
  bCloud: '#fbfbfd',
  bCloudSh: '#ccd6e4',
  bCloudDk: '#9eacc0',
  bRidge: '#8494aa',
  bRidgeSh: '#6a7a92',
  batur: '#5a6a7c',
  baturLit: '#7a8a9c',
  baturSh: '#485666',
  lake: '#6a8eb4',
  lakeHi: '#a0bed8',
  lakeSh: '#56789e',
  forest0: '#2e4a2a',
  forest1: '#44683a',
  forest2: '#628a4a',
  lava: '#3e3c38',
  rail: '#9a9ca4',
  railHi: '#d4d6dc',
  railSh: '#5e6068',
  mesh: '#2a2c30',
  deck: '#a8604a',
  deckHi: '#c47c5e',
  deckSh: '#7a4232',
  pave: '#c8c4c0',
  paveSh: '#aaa6a2',
  strap: '#3c3a48',
  teeth: '#fff8ee',
  mouth: '#7a3a34',
  smile: '#a8544c',
  eye: '#3a2828',
  heart: '#ff6fa4',
  heartHi: '#ffc4da',
  heartSh: '#d8407e',
  flash: '#fffaf4',
  paper: '#fffaf2',
  paperSh: '#e6dad6',
  dim: '#140e26',
  // a mint scooter with a helmet on the seat
  scoot: '#8ad8c0',
  scootHi: '#c4f4e2',
  scootSh: '#4e9a88',
  seat: '#3a2a30',
  chrome: '#d8d4e4',
  helmet: '#fff4ec',
  helmetSh: '#d0c0c8',
  // the jeeps up the volcano before dawn
  jeep: '#2a2140',
  jeepLamp: '#fffaf0',
  jeepGlow: '#ffe6b0',
  jeepTail: '#ff4a4a',
  hiker: '#160f26',
  hikerLamp: '#fff2c0',
  night0: '#070b26',
  night1: '#121a46',
  night2: '#24306a',
  night3: '#3c4482',
  dawnGlow: '#d86a5a',
  star: '#e8ecff',
  sun: '#fffbe8',
  sunMid: '#ffe8a0',
  sunEdge: '#ffc060',
  gold0: '#f0904a',
  gold1: '#ffb860',
  gold2: '#ffdc8a',
  gold3: '#fff0b8',
  ray: '#ffe6a0',
});

const FLOOR = 124; // the courtyard floor, polished to a mirror
const WALL_TOP = 110;
const SEA_TOP = 95; // top of the sea of cloud
const THRESH = FLOOR - 12; // top step, between the gate halves
const GATE_H = 117;

type Kind =
  | 'plinth'
  | 'lip'
  | 'neck'
  | 'body'
  | 'cornice'
  | 'cap'
  | 'tier'
  | 'finial';
type Seg = { h: number; w: number; kind: Kind };

// One half of the gate, from the floor up: a stepped foot, a tall carved body
// flaring into a cornice, then nine receding tiers to a point. Widths are
// measured outwards from the clean inner face, for a 48px-wide half.
const PROFILE: Seg[] = [
  { h: 3, w: 48, kind: 'plinth' },
  { h: 3, w: 46, kind: 'plinth' },
  { h: 2, w: 44, kind: 'lip' },
  { h: 2, w: 41, kind: 'neck' },
  { h: 2, w: 43, kind: 'lip' },
  { h: 26, w: 40, kind: 'body' },
  { h: 2, w: 42, kind: 'cornice' },
  { h: 2, w: 44, kind: 'cap' },
  { h: 2, w: 37, kind: 'neck' },
];
for (const [th, tw] of [
  [7, 35],
  [7, 31],
  [6, 27],
  [6, 23.5],
  [5, 20],
  [5, 16.5],
  [4, 13],
  [4, 10],
  [3, 7],
] as const) {
  PROFILE.push(
    { h: th, w: tw, kind: 'tier' },
    { h: 2, w: tw + 1, kind: 'cap' }
  );
}
PROFILE.push({ h: 8, w: 5, kind: 'finial' });

// The SUV side-on, nose to the right, about as tall as the man beside it.
// S roof sheen, B body lit, K body, g glass, G glass catching the sky, r tail
// light, w headlamp, t tyre, o hub. k is the dark of the wheel arches.
const SUV = [
  '.SSSSSSSSSSSSSSSSS.........',
  'SgGGggggBgggggGgggB........',
  'KgGgggggBggggggGgggB.......',
  'KgggggGgBgggggggGgggB......',
  'rKKKKKKKKKKKKKKKKKKKKKKBBB.',
  'rBBBBBBBBBBBBBBBBBBBBBBBBBw',
  'rKKKKKKKKKKKKKKKKKKKKKKKKKK',
  'KKkkkkkKKKKKKKKKKKKKkkkkkKK',
  '.KtoottKKKKKKKKKKKKKtoottK.',
  '..ttttt.............ttttt..',
];

// The wall's owner, facing right, his body in columns 2-4: a
// black cap on backwards (the peak out behind), black hoodie and trousers.
// c cap, s skin, H hood, h hoodie, T trousers, e shoes.
const OWNER = [
  // 0 standing
  [
    '........',
    '..ccc...',
    '.cccss..',
    '..cHss..',
    '..hhh...',
    '.Hhhhs..',
    '..hhh...',
    '..hhh...',
    '..T.T...',
    '..T.T...',
    '..e.e...',
  ],
  // 1 both arms up
  [
    's.....s.',
    'h.ccc.h.',
    '.hccssh.',
    '..cHss..',
    '.hhhhh..',
    '..hhh...',
    '..hhh...',
    '..hhh...',
    '..T.T...',
    '..T.T...',
    '..e.e...',
  ],
  // 2 pointing at it, a hand to his head
  [
    '........',
    's.ccc...',
    'hcccss..',
    '.hcHss..',
    '..hhhhhs',
    '..hhh...',
    '..hhh...',
    '..hhh...',
    '..T.T...',
    '..T.T...',
    '..e.e...',
  ],
  // 3 a hand on his head
  [
    '........',
    '..ccc...',
    '.sccss..',
    '.hcHss..',
    '.hhhhh..',
    '..hhh...',
    '..hhh...',
    '..hhh...',
    '..T.T...',
    '..T.T...',
    '..e.e...',
  ],
  // 4 mid-stride, scrambling over the rubble
  [
    '........',
    '..ccc...',
    '.cccss..',
    '..cHss..',
    '..hhh...',
    '..hhhs..',
    '..hhh...',
    '..hhh...',
    '..T.T...',
    '.T...T..',
    'e.....e.',
  ],
];

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

export const bali: Scene = {
  id: 'bali',
  name: 'Bali',
  country: 'Indonesia',
  create(w, h) {
    const cx = Math.round(w / 2);
    const HW = Math.round(Math.max(40, Math.min(48, w * 0.11))); // half-gate width at the foot
    const G = 2 * Math.round(HW * 0.3); // the gap
    const innerL = cx - G / 2; // first column of the gap
    const innerR = cx + G / 2; // first column of the right half
    const scale = HW / 48;
    const agX = cx;
    const AG_TOP = 36;
    const treeL = Math.round(innerL - HW - 24);
    const treeR = Math.round(innerR + HW + 24);
    const penjorL = Math.round(innerL - HW - 60);
    const penjorR = Math.round(innerR + HW + 60);
    const extraTrees = w >= 560 ? [treeL - 150, treeR + 150] : [];
    const fx = new Fx();
    const fxBack = new Fx();

    // ---------- sky ----------
    const sky = layer(w, h, (f) => {
      gradient(f, 0, SEA_TOP + 4, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
        P.sky7,
      ]);
      glow(f, cx, SEA_TOP, w * 0.6, P.belt, 0.45, 0.25, 0.1);
    });
    const cloudLayer = layer(w, h, (f) => {
      // high streaks of altocumulus lit gold from the sun behind us
      clouds(f, {
        seed: 52,
        y0: 6,
        y1: 30,
        cell: 7,
        coverage: 0.4,
        stretch: 4.5,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
      clouds(f, {
        seed: 57,
        y0: 46,
        y1: 58,
        cell: 5,
        coverage: 0.26,
        stretch: 6,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });

    // ---------- Agung ----------
    const R = Math.max(150, w * 0.42);
    const agTop = (x: number) => {
      const u = Math.min(1, Math.abs(x - agX) / R);
      const crater = Math.abs(x - agX - 1) < 2 ? 1 : 0;
      const shoulder = x > agX ? 3.5 * Math.exp(-(((u - 0.3) / 0.1) ** 2)) : 0;
      return (
        AG_TOP +
        crater -
        shoulder +
        (SEA_TOP + 6 - AG_TOP) * (1 - Math.pow(1 - u, 1.9)) +
        (fbm1(x / 7, 3) - 0.5) * 1.6 * u
      );
    };
    const mountain = layer(w, h, (f) => {
      // erosion gullies radiate down from the crater; each catches the sun on its left side
      const ridges: number[] = [];
      for (let k = -14; k <= 14; k++)
        ridges.push(k * 0.36 + (hash2(k, 0, 5) - 0.5) * 0.22);
      for (let x = 0; x < w; x++) {
        const top = Math.round(agTop(x));
        for (let y = top; y < SEA_TOP + 8; y++) {
          const dy = y - AG_TOP + 3;
          const a = (x - agX) / dy;
          let near = Infinity;
          for (const r of ridges) {
            const d = (a - r) * dy;
            if (Math.abs(d) < Math.abs(near)) near = d;
          }
          const depth = (y - top) / 40;
          let c = (x - agX) / R < -0.05 ? P.agLit : P.ag;
          if (y - AG_TOP > 5) {
            if (near > -1.2 && near <= 0) c = P.agHi;
            else if (near > 0 && near < 1.6 + depth * 2) c = P.agSh;
          }
          if (y - top < 1) c = x < agX + 6 ? P.agHi : P.agLit; // the rim catching the light
          if (y > SEA_TOP - 4) c = lerpRGB(c, P.agDeep, 0.35);
          f.set(x, y, c);
        }
      }
    });

    // ---------- the sea of cloud, with ridges and palms below ----------
    const seaTop = (x: number) =>
      SEA_TOP -
      Math.round(
        Math.abs(Math.sin(x / 9 + 1.3 * Math.sin(x / 23))) * 3 +
          noise1(x / 5, 9) * 1.5
      );
    const cloudSea = layer(w, h, (f) => {
      for (let x = 0; x < w; x++) {
        const top = seaTop(x);
        for (let y = top; y < SEA_TOP + 12; y++) {
          const d = y - top;
          let c = P.seaBase;
          if (d === 0 || (d === 1 && seaTop(x - 1) > top)) c = P.seaLight;
          else if (seaTop(x + 1) < top - 1 && d < 3) c = P.seaShade;
          if (y > SEA_TOP + 4) c = P.seaShade;
          if (y > SEA_TOP + 8) c = P.seaDeep;
          f.set(x, y, c);
        }
      }
    });
    const farRidge = (x: number) =>
      Math.round(SEA_TOP + 9 - fbm1(x / 26, 11) * 8);
    const hills = layer(w, h, (f) => {
      for (let x = 0; x < w; x++) {
        const a = farRidge(x);
        for (let y = a; y < FLOOR; y++)
          f.set(x, y, y === a ? P.hill2 : P.hill1);
        const b = Math.round(SEA_TOP + 18 - fbm1((x + 40) / 22, 17) * 6);
        for (let y = b; y < FLOOR; y++)
          f.set(x, y, y === b ? P.hill1 : P.hill0);
      }
      // coconut palms standing up on the far ridge against the cloud
      for (let x = 9; x < w; x += 23 + Math.round(hash2(x, 0, 9) * 26)) {
        const base = farRidge(x);
        const hh = 8 + Math.round(hash2(x, 1, 9) * 6);
        const lean = hash2(x, 2, 9) > 0.5 ? 1 : -1;
        for (let k = 0; k < hh; k++)
          f.set(x + Math.round((k / hh) * lean * 2), base - k, P.palmFar);
        const tx = x + lean * 2;
        const ty = base - hh;
        for (let k = 0; k < 6; k++) {
          const ang = -Math.PI / 2 + ((k / 5) * 2 - 1) * 1.6;
          for (let j = 1; j <= 4; j++)
            f.set(
              tx + Math.cos(ang) * j,
              ty + Math.sin(ang) * j * 0.7 + (j * j) / 8,
              P.palmFar
            );
        }
      }
    });

    // ---------- the temple: walls, the gate, steps, frangipani ----------
    const blooms: { x: number; y: number }[] = [];
    const offerings: { x: number; y: number }[] = [];
    const temple = layer(w, h, (f) => {
      wall(f, 0, innerL - HW + 2);
      wall(f, innerR + HW - 2, w);
      // the steps up through the gap
      for (let k = 0; k < 6; k++) {
        const y = FLOOR - 2 * (k + 1);
        const x0 = innerL - (k < 2 ? 2 - k : 0);
        const x1 = innerR - 1 + (k < 2 ? 2 - k : 0);
        f.hline(x0, x1, y, P.stoneHi);
        f.hline(x0, x1, y + 1, k === 0 ? P.stoneMid : P.stone);
      }
      gateHalf(f, false);
      gateHalf(f, true);
      // white ceremonial umbrellas either side of the steps
      umbrella(f, innerL - 5, THRESH + 1);
      umbrella(f, innerR + 4, THRESH + 1);
      for (const [x, d, s] of [
        [treeL, -1, 21],
        [treeR, 1, 22],
        ...extraTrees.map((x, i) => [x, i ? -1 : 1, 23 + i] as const),
      ] as const)
        frangipani(f, x, FLOOR, d, s);
      // offerings on the steps and at the foot of the gate
      for (const [x, y] of [
        [innerL + 3, THRESH],
        [innerR - 6, THRESH + 4],
        [innerL - 12, FLOOR - 12],
        [innerR + 9, FLOOR - 12],
        [innerL - Math.round(HW * 0.65), FLOOR],
        [innerR + Math.round(HW * 0.55), FLOOR],
      ] as const) {
        canang(f, x, y);
        offerings.push({ x: x + 2, y: y - 5 });
      }
    });

    function wall(f: Frame, x0: number, x1: number) {
      // the courtyard wall: red brick between grey stone caps and pilasters
      for (let x = x0; x < x1; x++) {
        for (let y = WALL_TOP; y < FLOOR; y++) {
          let c: RGB;
          if (y === WALL_TOP) c = P.stoneHi;
          else if (y === WALL_TOP + 1) c = P.stoneLit;
          else if (y === WALL_TOP + 2) c = P.stoneSh;
          else if (y >= FLOOR - 3)
            c = y === FLOOR - 3 ? P.stoneLit : P.stoneMid;
          else {
            const row = (y - WALL_TOP - 3) >> 1;
            const joint =
              (y - WALL_TOP - 3) % 2 === 1 || (x + (row % 2) * 3) % 6 === 0;
            c = joint
              ? P.brickJoint
              : y === WALL_TOP + 3
                ? P.brickSh
                : hash2(x >> 1, row, 6) > 0.82
                  ? P.brickHi
                  : P.brick;
          }
          f.set(x, y, c);
        }
      }
      const pitch = 30;
      const first = x0 < cx ? x1 - 4 : x0 + 4;
      for (let k = 0; ; k++) {
        const x = x0 < cx ? first - k * pitch : first + k * pitch;
        if (x < x0 - 4 || x > x1 + 4) break;
        // a stone pilaster with a carved panel and a pointed finial
        f.rect(x - 2, WALL_TOP - 1, 5, FLOOR - WALL_TOP + 1, P.stone);
        f.vline(x - 2, WALL_TOP - 1, FLOOR - 1, P.stoneLit);
        f.vline(x + 2, WALL_TOP - 1, FLOOR - 1, P.stoneSh);
        f.hline(x - 3, x + 3, WALL_TOP - 1, P.stoneHi);
        f.hline(x - 3, x + 3, WALL_TOP, P.stoneMid);
        f.rect(x - 1, WALL_TOP + 3, 3, 6, P.stoneSh);
        f.set(x, WALL_TOP + 4, P.stoneLit);
        f.set(x, WALL_TOP + 6, P.stoneLit);
        f.rect(x - 1, WALL_TOP - 4, 3, 3, P.stone);
        f.set(x - 1, WALL_TOP - 4, P.stoneLit);
        f.set(x + 1, WALL_TOP - 3, P.stoneSh);
        f.set(x, WALL_TOP - 5, P.stoneHi);
        f.set(x, WALL_TOP - 6, P.stoneLit);
      }
      // little stone finials along the cap between the pilasters
      for (let x = x0 + 8; x < x1 - 2; x += 10) {
        f.set(x, WALL_TOP - 1, P.stoneLit);
        f.set(x + 1, WALL_TOP - 1, P.stoneSh);
        f.set(x, WALL_TOP - 2, P.stoneHi);
      }
    }

    function gateHalf(f: Frame, right: boolean) {
      // columns run outwards from the inner face; `px` maps a distance from the cut to x
      const px = (d: number) => (right ? innerR + d : innerL - 1 - d);
      const out = right ? 1 : -1;
      let y = FLOOR;
      let prevW = Infinity;
      for (const seg of PROFILE) {
        const sw = Math.max(1, Math.round(seg.w * scale));
        const y1 = y - seg.h; // the segment covers rows y1 .. y - 1
        for (let row = y - 1; row >= y1; row--) {
          const r = row - y1; // 0 at the segment's top
          const width =
            seg.kind === 'finial'
              ? Math.max(1, Math.round(sw * ((r + 1) / seg.h)))
              : sw;
          for (let d = 0; d < width; d++) {
            const edge = width - 1 - d; // 0 at the outer edge
            let c = P.stone;
            switch (seg.kind) {
              case 'plinth':
                c = r === 0 ? P.stoneHi : r === seg.h - 1 ? P.stoneSh : P.stone;
                break;
              case 'lip':
                c = r === 0 ? P.stoneHi : P.stoneLit;
                break;
              case 'neck':
                c = r === 0 ? P.stoneDark : P.stoneSh;
                break;
              case 'cornice':
                // carved dentils under the cap
                c =
                  r === 0 ? P.stoneDeep : d % 3 === 2 ? P.stoneSh : P.stoneLit;
                break;
              case 'cap':
                c =
                  r === 0 ? (seg.w > 40 ? P.stoneHi : P.stoneLit) : P.stoneMid;
                break;
              case 'tier': {
                c =
                  r === 0 ? P.stoneSh : r === seg.h - 1 ? P.stoneMid : P.stone;
                // a carved lotus in the middle of the taller courses
                const mid = Math.round(width * 0.5);
                const mdy = Math.round(seg.h / 2);
                if (seg.h >= 5 && width >= 12) {
                  const dx = d - mid;
                  const dy = r - mdy;
                  if (dy === 0 && Math.abs(dx) <= 2)
                    c = Math.abs(dx) === 2 ? P.stoneLit : P.stoneSh;
                  if (dy === -1 && Math.abs(dx) === 1) c = P.stoneLit;
                  if (dy === -2 && dx === 0) c = P.stoneHi;
                  if (dy === 1 && Math.abs(dx) <= 1) c = P.stoneDeep;
                }
                break;
              }
              case 'body': {
                c = r < 2 ? (r === 0 ? P.stoneDark : P.stoneSh) : P.stone;
                const inset = Math.max(3, Math.round(width * 0.15));
                const pw = width - inset * 2;
                const ph = seg.h - 8;
                const pd = d - inset;
                const pr = r - 4;
                if (pd >= 0 && pd < pw && pr >= 0 && pr < ph) {
                  // a recessed panel with a gunungan, the leaf-shaped tree of life, in relief
                  c =
                    pr === 0 || pd === (right ? 0 : pw - 1)
                      ? P.stoneDark
                      : pr === ph - 1 || pd === (right ? pw - 1 : 0)
                        ? P.stoneMid
                        : P.stoneSh;
                  const mx = (pw - 1) / 2;
                  const v = (pr - 1) / (ph - 3);
                  const half =
                    v < 0 || v > 1
                      ? -1
                      : (v < 0.7
                          ? Math.sin((v / 0.7) * (Math.PI / 2))
                          : 1 - (v - 0.7) * 1.4) *
                        pw *
                        0.36;
                  const dx = Math.abs(pd - mx);
                  if (dx <= half) {
                    const rim = dx > half - 1;
                    c = rim
                      ? pd < mx !== right
                        ? P.stoneLit
                        : P.stoneDeep
                      : P.stone;
                    if (!rim && dx < 0.6 && v > 0.25) c = P.stoneMid; // the trunk
                    if (
                      !rim &&
                      v > 0.3 &&
                      v < 0.85 &&
                      Math.abs(dx - (v - 0.25) * pw * 0.5) < 0.6 &&
                      pr % 3 === 0
                    )
                      c = P.stoneLit; // branches
                    if (!rim && v < 0.25 && dx < 0.6) c = P.stoneHi;
                  }
                }
                if (r >= seg.h - 2) c = r === seg.h - 1 ? P.stoneMid : P.stone;
                // moss in the damp foot of the body
                if (
                  r > seg.h - 5 &&
                  (edge < 3 || d < 2) &&
                  hash2(d, r, 3) > 0.55
                )
                  c = P.moss;
                break;
              }
              case 'finial':
                c = d === 0 ? P.stoneLit : P.stone;
                if (r === 0) c = P.stoneHi;
                break;
            }
            // the outer edge reads the light: lit on the left half, in shade on the right
            if (
              edge === 0 &&
              seg.kind !== 'cap' &&
              seg.kind !== 'lip' &&
              seg.kind !== 'plinth'
            )
              c = right ? P.stoneDeep : lerpRGB(c, P.stoneLit, 0.45);
            f.set(px(d), row, c);
          }
        }
        // under the big cornice, a shadow line
        if (seg.kind === 'cap' && seg.w > 40 && prevW < sw) {
          for (let d = prevW; d < sw; d++) f.set(px(d), y, P.stoneSh);
        }
        if (seg.kind === 'cap' && seg.w <= 38) {
          // antefixes: upright flame-shaped stones along the top of every course,
          // the tallest at the outer corner, so the outline climbs in a serrated stair
          const big = seg.w >= 18;
          const flame = (d: number, tall: number) => {
            const x = px(d);
            const lit = right ? P.stoneMid : P.stoneHi;
            const shade = right ? P.stoneSh : P.stoneLit;
            f.set(x, y1 - 1, lit);
            f.set(x - out, y1 - 1, shade);
            for (let k = 2; k <= tall; k++)
              f.set(x, y1 - k, k === tall ? P.stoneHi : lit);
            if (tall >= 3) f.set(x + out, y1 - tall, shade); // the tip curls outwards
          };
          flame(sw - 1, big ? 4 : 3);
          // a smaller one on the inner corner of the step, against the next course up
          const next = PROFILE[PROFILE.indexOf(seg) + 1];
          if (next && next.kind === 'tier') {
            const nw = Math.round(next.w * scale);
            if (sw - nw >= 4) flame(nw + 1, big ? 2 : 1);
          }
        }
        if (seg.kind === 'cap' && seg.w === 44) {
          // the big corner piece over the body's cornice
          const o = px(sw - 1);
          f.rect(Math.min(o, o + out), y1 - 3, 2, 3, P.stone);
          f.set(o, y1 - 3, P.stoneHi);
          f.set(o + out, y1 - 4, P.stoneLit);
          f.set(o + out * 2, y1 - 5, P.stoneHi);
          f.set(o + out * 2, y1 - 6, P.stoneLit);
          f.set(o - out, y1 - 1, P.stone);
          f.set(o - out * 2, y1 - 2, P.stoneLit);
        }
        prevW = sw;
        y = y1;
      }
      // the inner face is a clean vertical cut from foot to tip
      for (let row = y; row < FLOOR; row++) {
        if (!f.opaque(px(0), row)) continue;
        const c = f.get(px(0), row);
        f.set(
          px(0),
          row,
          right ? lerpRGB(c, P.stoneDark, 0.45) : lerpRGB(c, P.stoneHi, 0.3)
        );
      }
    }

    function umbrella(f: Frame, x: number, base: number) {
      // a tedung: a tall white ceremonial umbrella with a gold fringe
      f.vline(x, base - 16, base - 1, P.stoneDark);
      for (let dy = 0; dy < 3; dy++) {
        const half = [2, 4, 5][dy]!;
        for (let dx = -half; dx <= half; dx++)
          f.set(x + dx, base - 20 + dy, dx > 1 ? P.umbrellaSh : P.umbrella);
      }
      for (let dx = -5; dx <= 5; dx++)
        f.set(x + dx, base - 17, dx % 2 ? P.umbrellaGold : P.sash);
      f.set(x, base - 21, P.umbrellaGold);
    }

    function frangipani(
      f: Frame,
      x: number,
      base: number,
      dir: number,
      seed: number
    ) {
      // a smooth grey trunk forking into thick blunt branches, leaf rosettes and flowers at the tips
      const tips: [number, number][] = [];
      const branch = (
        x0: number,
        y0: number,
        ang: number,
        len: number,
        depth: number
      ) => {
        const x1 = x0 + Math.cos(ang) * len;
        const y1 = y0 + Math.sin(ang) * len;
        for (let k = 0; k <= len; k++) {
          const xx = x0 + ((x1 - x0) * k) / len;
          const yy = y0 + ((y1 - y0) * k) / len;
          f.set(xx, yy, P.bark);
          f.set(xx - 1, yy, P.barkHi);
          if (depth === 0) {
            f.set(xx + 1, yy, P.bark);
            f.set(xx + 2, yy, P.barkSh);
          } else if (depth === 1) f.set(xx + 1, yy, P.barkSh);
        }
        if (depth >= 3) {
          tips.push([Math.round(x1), Math.round(y1)]);
          return;
        }
        const spread = 0.42 + hash2(depth, Math.round(x0 * 7 + y0), seed) * 0.3;
        branch(x1, y1, ang - spread, len * 0.66, depth + 1);
        branch(x1, y1, ang + spread, len * 0.62, depth + 1);
      };
      branch(x, base, -Math.PI / 2 + dir * 0.1, 14, 0);
      // leaf rosettes: long paddle leaves fanning out from each tip
      for (const [tx, ty] of tips) {
        for (let k = 0; k < 7; k++) {
          const a = -Math.PI / 2 + ((k / 6) * 2 - 1) * 1.55;
          const len = 4 + hash2(k, tx, seed) * 3;
          for (let j = 1; j <= len; j++) {
            const lx = tx + Math.cos(a) * j;
            const ly = ty + Math.sin(a) * j * 0.75 + (j > len * 0.6 ? 0.7 : 0);
            f.set(
              lx,
              ly,
              j > len - 1.5 ? P.leaf2 : Math.cos(a) < 0 ? P.leaf1 : P.leaf0
            );
            f.set(lx, ly + 1, P.leaf0);
          }
        }
      }
      // flower clusters on top of the rosettes
      for (const [tx, ty] of tips) {
        for (let k = 0; k < 2; k++) {
          const bx = tx + Math.round((hash2(k, ty, seed + 1) - 0.5) * 5);
          const by = ty - 2 - Math.round(hash2(k, tx, seed + 2) * 2);
          bloom(f, bx, by, hash2(k, tx, seed + 3) > 0.82);
          blooms.push({ x: bx, y: by });
        }
      }
      // a few fallen ones on the floor below
      for (let k = 0; k < 3; k++)
        bloom(
          f,
          x + Math.round((hash2(k, 9, seed) - 0.5) * 24),
          base + 3 + Math.round(hash2(k, 8, seed) * 14),
          false
        );
    }

    function bloom(f: Frame, x: number, y: number, pink: boolean) {
      const c = pink ? P.bloomPink : P.bloom;
      f.set(x - 1, y, c);
      f.set(x + 1, y, pink ? P.bloomPink : P.bloomSh);
      f.set(x, y - 1, c);
      f.set(x, y + 1, pink ? P.bloomPink : P.bloomSh);
      f.set(x, y, P.bloomEye);
    }

    function canang(f: Frame, x: number, y: number) {
      // a little palm-leaf tray heaped with petals, an incense stick smouldering in it
      f.hline(x - 1, x + 4, y - 1, P.tray);
      f.hline(x - 1, x + 4, y - 2, P.trayHi);
      const petals = [
        P.petalRed,
        P.petalYellow,
        P.petalWhite,
        P.petalPink,
        P.petalPurple,
      ];
      for (let k = 0; k < 5; k++)
        f.set(x - 1 + k, y - 3, petals[(k + x) % petals.length]!);
      f.set(x + 1, y - 4, petals[(x + 2) % petals.length]!);
      f.vline(x + 2, y - 5, y - 4, P.stoneDark);
      f.set(x + 2, y - 5, P.ember);
    }

    // ---------- moving things ----------
    let jumpAt = -Infinity;
    let shimmerAt = -Infinity;
    let lastT = 0;
    const POSE_EVERY = 3400;

    function person(
      f: Frame,
      x: number,
      feet: number,
      sarong: RGB,
      pose: number,
      lift = 0
    ) {
      // pose 0: standing, 1: arms up in a V, 2: hands together, 3: one arm up, 4: legs tucked (jumping)
      const y = feet - lift;
      if (pose === 4) {
        f.rect(x, y - 3, 3, 2, sarong);
        f.set(x, y - 1, P.skinSh);
        f.set(x + 2, y - 1, P.skinSh);
      } else {
        f.rect(x, y - 4, 3, 4, sarong);
        f.set(x, y, P.skinSh);
        f.set(x + 2, y, P.skinSh);
      }
      const top = pose === 4 ? y - 8 : y - 9;
      f.rect(x, top + 2, 3, 3, P.shirt);
      f.set(x + 2, top + 3, P.shirtSh);
      f.hline(x, x + 2, top + 4, P.sash);
      f.rect(x, top, 3, 2, P.skin);
      f.hline(x, x + 2, top, P.hair);
      f.set(x + 2, top + 1, P.skinSh);
      if (pose === 1 || pose === 4) {
        f.set(x - 1, top + 1, P.skin);
        f.set(x - 2, top, P.skin);
        f.set(x + 3, top + 1, P.skin);
        f.set(x + 4, top, P.skin);
      } else if (pose === 2) {
        f.set(x + 1, top + 2, P.skin);
        f.set(x + 1, top + 1, P.skin);
      } else if (pose === 3) {
        f.set(x - 1, top + 3, P.skin);
        f.set(x + 3, top + 1, P.skin);
        f.set(x + 3, top, P.skin);
        f.set(x + 4, top - 1, P.skin);
      } else {
        f.set(x - 1, top + 3, P.skin);
        f.set(x + 3, top + 3, P.skin);
      }
    }

    function poser(t: number) {
      // someone steps into the gap, strikes a few poses, then steps out for the next person
      const cycle = 22_000;
      const k = Math.floor(t / cycle);
      const p = (t % cycle) / cycle;
      const enter = 0.08;
      const leave = 0.86;
      const spot = cx - 1;
      const side = hash2(k, 1, 4) > 0.5 ? 1 : -1;
      let x = spot;
      let walking = false;
      if (p < enter) {
        x = spot + side * Math.round((1 - p / enter) * (G / 2 + 2));
        walking = true;
      } else if (p > leave) {
        x = spot - side * Math.round(((p - leave) / (1 - leave)) * (G / 2 + 2));
        walking = true;
      }
      // when the group comes in, whoever's posing steps aside
      const fa = t - groupAt;
      if (fa >= 0 && fa < FA.end) {
        const away = ease(fa / 800) * (1 - ease((fa - FA.end + 900) / 900));
        x += (x >= spot ? 1 : -1) * Math.round(away * (G / 2 + 3));
        if (away > 0 && away < 1) walking = true;
      }
      const poses = [1, 2, 3, 1, 0];
      const pose = walking
        ? 0
        : poses[Math.floor(t / POSE_EVERY + k) % poses.length]!;
      const sarong = [P.sarong0, P.sarong1, P.sarong2, P.sarong3][k % 4]!;
      return { x, pose, sarong, visible: Math.abs(x - spot) <= G / 2 - 1 };
    }

    function drawPoser(f: Frame, t: number) {
      const p = poser(t);
      if (!p.visible) return;
      const age = t - jumpAt;
      if (age >= 0 && age < 700) {
        const lift = Math.round(Math.sin((age / 700) * Math.PI) * 6);
        person(f, p.x, THRESH, p.sarong, lift > 1 ? 4 : 1, lift);
        return;
      }
      person(f, p.x, THRESH, p.sarong, p.pose);
    }

    function drawQueue(f: Frame, t: number) {
      // people waiting their turn, sitting on the wall's ledge
      const room = innerL - HW - 4;
      const n = Math.max(2, Math.min(5, Math.floor(room / 9)));
      for (let i = 0; i < n; i++) {
        const x = innerL - HW - 9 - i * 7;
        if (Math.abs(x + 2 - treeL) < 4) continue;
        const sarong = [P.sarong1, P.sarong3, P.sarong2, P.sarong0, P.sarong1][
          i
        ]!;
        const nod = Math.sin(t / 1700 + i * 2) > 0.85 ? 1 : 0;
        if (i === 0) {
          drawTourist(f, x, sarong, nod);
          continue;
        }
        f.rect(x, FLOOR - 4, 4, 3, sarong);
        f.vline(x + 3, FLOOR - 2, FLOOR - 1, P.skinSh);
        f.rect(x, FLOOR - 8, 3, 4, i % 2 ? P.shirt : P.shirtSh);
        f.rect(x, FLOOR - 10 + nod, 3, 2, P.skin);
        f.hline(x, x + 2, FLOOR - 10 + nod, P.hair);
        f.set(x + 3, FLOOR - 6, P.skin);
      }
    }

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const span = (a: number, a0: number, a1: number) =>
      clamp01((a - a0) / (a1 - a0));
    const ease = (v: number) => {
      const u = clamp01(v);
      return u * u * (3 - 2 * u);
    };

    function drawTourist(f: Frame, x: number, sarong: RGB, nod: number) {
      // a sunburnt visitor in a rented sarong, a sun hat and dark glasses
      const head = FLOOR - 10 + nod;
      f.rect(x, FLOOR - 4, 4, 3, sarong);
      f.vline(x + 3, FLOOR - 2, FLOOR - 1, P.tSkinSh);
      f.rect(x, FLOOR - 8, 3, 4, P.tee);
      f.vline(x + 2, FLOOR - 8, FLOOR - 5, P.teeSh);
      f.rect(x, head + 1, 3, 1, P.tSkin);
      f.set(x + 1, head + 1, P.shades);
      f.set(x + 2, head + 1, P.shades);
      // the hat: a crown and a wide brim
      f.hline(x, x + 2, head - 1, P.hat);
      f.set(x + 2, head - 1, P.hatSh);
      f.hline(x - 1, x + 3, head, P.hat);
      f.set(x - 1, head, P.hatSh);
      f.set(x + 3, FLOOR - 6, P.tSkin);
    }

    // ---------- easter egg: the wall ----------
    // Click the patched stretch of the courtyard wall on the right and a black
    // SUV backs into frame, reversing lights on, and thumps it: the whole
    // picture jolts, a stretch of wall folds into rubble in a big cloud of
    // dust, bricks skitter over the floor and the egrets leave the frangipani.
    // The owner, in a black hoodie and a backwards cap, scrambles out over the
    // rubble waving his arms; the driver climbs out, a hand on the back of his
    // head, and bows sorry; the hazards blink, he gets back in and the car
    // creeps away. The wall is quietly back a moment later.
    const wallR0 = innerR + HW - 2;
    const pil0 = wallR0 + 4;
    const aim = Math.min(w - 44, innerR + HW + 107);
    let HX = pil0 + Math.max(0, Math.floor((aim - pil0) / 30)) * 30 + 15;
    for (const tx of [treeR, ...extraTrees])
      if (Math.abs(HX - tx) < 10) HX = tx - 10;
    const HOLE = 6; // half the hole's width
    const CW = {
      bump: 1400,
      fall: 1650,
      out: 2300, // the owner climbs out
      door: 2500, // and so does the driver
      sorry: 3300, // hazards
      driverIn: 5500,
      leave: 5900,
      back: 6300, // the owner goes back in
      mend: 7400,
      end: 8800,
    };
    let wallAt = -Infinity;
    const wallBusy = (t: number) => t - wallAt >= 0 && t - wallAt < CW.end;
    // how many rows each column of the hole loses: a ragged V, in brick courses
    const cut = new Int16Array(2 * HOLE + 1);
    for (let i = 0; i <= 2 * HOLE; i++) {
      const u = (i - HOLE) / (HOLE + 0.6);
      const depth =
        (FLOOR - 4 - WALL_TOP) * Math.sqrt(1 - u * u) +
        (hash2(i, 0, 81) - 0.5) * 3;
      cut[i] = Math.max(2, Math.round(depth / 2) * 2 + 1);
    }
    const inHole = (x: number, y: number) => {
      const i = x - HX + HOLE;
      return (
        i >= 0 && i <= 2 * HOLE && y >= WALL_TOP - 2 && y < WALL_TOP + cut[i]!
      );
    };
    // that stretch is patched already, in newer brick that doesn't quite
    // line up, a hairline crack round the V
    {
      const isWall = (c: RGB) =>
        c === P.brick ||
        c === P.brickHi ||
        c === P.brickSh ||
        c === P.brickJoint ||
        c === P.stoneHi ||
        c === P.stoneLit ||
        c === P.stoneSh;
      const newJoint = lerpRGB(P.brickJoint, P.stoneLit, 0.55);
      const newBrick = lerpRGB(P.brick, P.brickHi, 0.55);
      for (let y = WALL_TOP; y < FLOOR - 3; y++)
        for (let x = HX - HOLE - 1; x <= HX + HOLE + 1; x++) {
          if (!temple.opaque(x, y) || !isWall(temple.get(x, y))) continue;
          if (!inHole(x, y)) {
            if (inHole(x - 1, y) || inHole(x + 1, y) || inHole(x, y - 1))
              temple.set(x, y, y < WALL_TOP + 3 ? P.stoneSh : P.brickSh);
            continue;
          }
          if (y < WALL_TOP + 3) {
            // a new length of coping, still pale
            if (y === WALL_TOP + 1) temple.set(x, y, P.stoneHi);
            continue;
          }
          const row = (y - WALL_TOP - 3) >> 1;
          const joint =
            (y - WALL_TOP - 3) % 2 === 1 || (x + (row % 2) * 3 + 2) % 6 === 0;
          temple.set(x, y, joint ? newJoint : newBrick);
        }
    }
    // the rubble: broken brick in a heap at the foot of the hole, a slab of
    // the coping on top; each chunk remembers how far it fell
    const rubble: { x: number; y: number; c: RGB; k: number }[] = [];
    {
      const mx = HX - 3;
      for (let x = HX - 11; x <= HX + 5; x++) {
        const v = (x - mx) / 8.5;
        const top = Math.round(
          5.6 * (1 - v * v) + (hash2(x, 1, 82) - 0.5) * 1.4
        );
        for (let d = 0; d < top; d++) {
          const y = FLOOR - 1 - d;
          const row = d >> 1;
          const cx2 = x + (row % 2) * 2;
          const k = Math.floor(cx2 / 3) * 8 + row;
          const r = hash2(k, 2, 83);
          let c =
            r < 0.45
              ? P.brick
              : r < 0.65
                ? P.brickHi
                : r < 0.85
                  ? P.brickSh
                  : P.stoneMid;
          if (d % 2 === 1 && r < 0.65) c = r < 0.45 ? P.brickHi : P.stoneHi;
          if (cx2 % 3 === 2) c = P.brickJoint;
          if (d === top - 1 && top >= 4 && hash2(x, 3, 82) > 0.5)
            c = P.stoneLit;
          rubble.push({ x, y, c, k });
        }
      }
      // a slab of the stone coping lying across the heap
      for (let k = 0; k < 6; k++) {
        const x = HX - 9 + k;
        const y = FLOOR - 5 - (k > 3 ? 1 : 0) + (k < 1 ? 1 : 0);
        rubble.push({ x, y, c: k < 5 ? P.stoneHi : P.stoneMid, k: 999 });
        rubble.push({ x, y: y + 1, c: P.stoneSh, k: 999 });
      }
    }
    const chunkDrop = (k: number) => 5 + Math.round(hash2(k, 4, 84) * 7);
    const chunkDelay = (k: number) => hash2(k, 5, 84) * 260;

    /** The wall, the hole and the rubble: drawn before the floor mirrors them. */
    function drawWallGag(f: Frame, t: number) {
      const a = t - wallAt;
      if (a < 0 || a >= CW.end) return;
      if (a >= CW.bump && a < CW.fall) {
        // the bump: the stretch about to go shivers
        const jig = Math.floor(a / 60) % 2 ? 1 : -1;
        for (let y = WALL_TOP - 2; y < FLOOR - 1; y++)
          for (let x = HX - HOLE; x <= HX + HOLE; x++)
            if (inHole(x, y))
              f.set(
                x,
                y,
                temple.opaque(x - jig, y)
                  ? temple.get(x - jig, y)
                  : hills.get(x, y)
              );
        // grit trickling off the top
        for (let k = 0; k < 3; k++) {
          const s = ((a - CW.bump + k * 140) % 420) / 420;
          f.set(HX - 3 + k * 3, WALL_TOP + Math.round(s * 12), P.dust2);
        }
        return;
      }
      if (a < CW.fall) return;
      // mending: the wall goes back up course by course as the heap goes down
      const mend = a >= CW.mend ? (a - CW.mend) / (CW.end - CW.mend) : 0;
      const built =
        FLOOR - 1 - Math.floor((mend * (FLOOR - WALL_TOP + 3)) / 2) * 2;
      // (the heap's last course goes with the wall's last, not after it)
      const heap = FLOOR - Math.ceil((1 - mend) * 7);
      // the gap, showing the hills behind
      for (let y = WALL_TOP - 2; y < FLOOR; y++)
        for (let x = HX - HOLE - 1; x <= HX + HOLE + 1; x++) {
          if (mend && y >= built) continue;
          if (inHole(x, y)) f.set(x, y, hills.get(x, y));
          else if (inHole(x, y - 1) || inHole(x - 1, y) || inHole(x + 1, y))
            f.set(x, y, y < WALL_TOP + 3 ? P.stoneSh : P.brickSh); // broken edges
        }
      drawOwner(f, t, true);
      // the bricks coming down into a heap
      const s = a - CW.fall;
      for (const r of rubble) {
        if (mend && r.y <= heap) continue;
        const d = chunkDelay(r.k);
        const e = clamp01((s - d) / 300);
        const fall = Math.round(chunkDrop(r.k) * (1 - e * e));
        const settle = e >= 1 && s - d < 380 ? 1 : 0;
        f.set(r.x, r.y - fall - settle, r.c);
      }
    }

    const OWNER_COL: Record<string, RGB> = {
      c: P.hoodie,
      s: P.skin,
      H: P.hoodieHi,
      h: P.hoodie,
      T: P.trousers,
      e: P.sole,
    };
    /** The owner with his body's left column at `x`, standing on `feet`. */
    function owner(
      f: Frame,
      x: number,
      feet: number,
      pose: number,
      tint: (c: RGB) => RGB,
      flipY = false
    ) {
      const rows = OWNER[pose]!;
      for (let ry = 0; ry < rows.length; ry++) {
        const row = rows[ry]!;
        const y = flipY ? feet + rows.length - ry : feet - rows.length + 1 + ry;
        for (let rx = 0; rx < row.length; rx++) {
          const c = OWNER_COL[row[rx]!];
          if (c !== undefined) f.set(x - 2 + rx, y, tint(c));
        }
      }
    }

    const ownerClip = new Frame(10, 14);
    function drawOwner(f: Frame, t: number, behind: boolean) {
      const a = t - wallAt;
      if (a < CW.out || a >= CW.back + 700) return;
      const plain = (c: RGB) => c;
      // climbing out (and back in) over the rubble
      const sx = HX - 4;
      const fx2 = HX - 11;
      let x = fx2;
      let feet = FLOOR + 3;
      let inFront = true;
      let pose = 0;
      if (a < CW.out + 300 || a >= CW.back + 350) {
        const p =
          a < CW.out + 300
            ? span(a, CW.out, CW.out + 300)
            : 1 - span(a, CW.back + 350, CW.back + 650);
        x = sx;
        feet = Math.round(FLOOR + 3 - p * 8);
        inFront = false;
        pose = 4;
      } else if (a < CW.out + 650 || a >= CW.back) {
        const p =
          a < CW.out + 650
            ? span(a, CW.out + 300, CW.out + 650)
            : 1 - span(a, CW.back, CW.back + 350);
        x = Math.round(sx + (fx2 - sx) * p);
        feet = Math.round(FLOOR - 5 + 8 * p - Math.sin(p * Math.PI) * 4);
        inFront = p > 0.5;
        pose = 4;
      } else if (a < 4500) pose = Math.floor(a / 260) % 2 ? 1 : 2;
      else if (a < 5400)
        pose = 3; // a hand on his head while the driver says sorry
      else pose = Math.floor(a / 450) % 2 ? 2 : 0; // one last word about it
      if (behind === inFront) return;
      if (!inFront) {
        // only what shows through the gap, above the rubble
        const clip = ownerClip;
        clip.clear();
        owner(clip, 3, 12, pose, plain);
        for (let dy = 0; dy < 14; dy++)
          for (let dx = 0; dx < 10; dx++) {
            if (!clip.opaque(dx, dy)) continue;
            const px = x - 3 + dx;
            const py = feet - 12 + dy;
            if (inHole(px, py)) f.set(px, py, clip.get(dx, dy));
          }
        return;
      }
      owner(f, x, feet, pose, plain);
      owner(f, x, feet, pose, (c) => lerpRGB(P.floorTint, c, 0.38), true);
    }

    function drawCar(f: Frame, t: number) {
      const a = t - wallAt;
      if (a < 0 || a >= CW.leave + 2000) return;
      const L = SUV[0]!.length;
      const rest = HX + 2;
      let x: number;
      let feet: number;
      if (a < CW.bump) {
        const p = 1 - (1 - a / CW.bump) ** 3;
        x = w + 3 + (rest - w - 3) * p;
        feet = FLOOR + 9 - 5 * p;
      } else if (a < CW.leave) {
        x = rest + (a < CW.bump + 160 ? 1 : 0);
        feet = FLOOR + 4;
      } else if (a < CW.leave + 700) {
        // a guilty creep forward, a pause
        x = rest + 3 * span(a, CW.leave, CW.leave + 500);
        feet = FLOOR + 4;
      } else {
        const p = span(a, CW.leave + 700, CW.leave + 2000);
        x = rest + 3 + (w + 4 - rest - 3) * p * p;
        feet = FLOOR + 4 + 4 * p;
      }
      x = Math.round(x);
      feet = Math.round(feet);
      if (x >= w) return;
      const reversing = a < CW.bump;
      const braking = a >= CW.bump && a < CW.leave;
      const blink = a >= CW.sorry && a < CW.leave + 1500 && a % 520 < 260;
      const wheel = Math.floor(x / 2) % 2;
      const hubAt = (rx: number) => {
        const k = rx < 13 ? rx - 2 : rx - 20;
        return k === 1 + wheel || k === 2 + wheel;
      };
      const door = a >= CW.door - 150 && a < CW.driverIn + 150;
      const col = (ch: string, rx: number, ry: number): RGB | null => {
        // the driver's door stands open while he's out: its edge catches the light
        if (door && rx === 13 && ry >= 1 && ry <= 7) return P.carSheen;
        switch (ch) {
          case 'S':
            return P.carSheen;
          case 'B':
            return P.carHi;
          case 'K':
            return P.car;
          case 'g':
            return P.glass;
          case 'G':
            return P.glassHi;
          case 'k':
            return P.tyre;
          case 'r':
            if (blink && ry === 4) return P.hazard;
            if (reversing && ry === 6) return P.reverse;
            return braking && ry === 5 ? P.tailHot : P.tail;
          case 'w':
            return blink ? P.hazard : P.headlamp;
          case 't':
          case 'o':
            return ry === 8 && hubAt(rx) ? P.hubcap : P.tyre;
          default:
            return null;
        }
      };
      const top = feet - SUV.length + 1;
      if (blink) {
        // the hazards wash the wall and the floor amber
        glow(f, x - 1, top + 4, 22, P.hazard, 0.5, 0.75);
        glow(f, x + L, top + 5, 22, P.hazard, 0.5, 0.75);
      }
      if (reversing) {
        // the reversing lights throw a pool of white across the floor behind it
        for (let dy = 1; dy <= 6; dy++)
          for (let dx = 1; dx <= 26; dx++)
            f.blend(
              x - dx,
              feet + dy - 2,
              P.reverse,
              0.5 * (1 - dx / 26) * (1 - (dy - 1) / 6)
            );
      }
      for (let ry = 0; ry < SUV.length; ry++) {
        const row = SUV[ry]!;
        for (let rx = 0; rx < L; rx++) {
          const c = col(row[rx]!, rx, ry);
          if (c === null) continue;
          f.set(x + rx, top + ry, c);
          // and upside down in the polished floor
          f.set(
            x + rx,
            feet + 1 + (SUV.length - 1 - ry),
            lerpRGB(P.floorTint, c, 0.38)
          );
        }
      }
      // a soft shadow where it meets the floor
      f.hline(x + 1, x + L - 2, feet + 1, lerpRGB(P.floorTint, P.tyre, 0.6));
      if (blink) {
        f.set(x - 1, top + 4, P.hazard);
        f.set(x + L, top + 5, P.hazard);
      }
    }

    /** The thump: a burst of light where the bumper meets the wall. */
    function drawBang(f: Frame, t: number) {
      const a = t - wallAt - CW.bump;
      if (a < 0 || a >= 320) return;
      const bx = HX + 1;
      const by = FLOOR - 3;
      const p = a / 320;
      const r0 = 2 + p * 7;
      const al = 1 - p * p;
      glow(f, bx, by, 18 + p * 10, P.shine, 0.6 * al, 0.8);
      for (let k = 0; k < 10; k++) {
        const ang = (k / 10) * Math.PI * 2 + 0.3;
        const len = (k % 2 ? 5 : 9) * (0.6 + p * 0.8);
        for (let d = r0; d < r0 + len; d++)
          f.blend(
            bx + Math.cos(ang) * d,
            by + Math.sin(ang) * d * 0.8,
            k % 2 ? P.shine2 : P.shine,
            al
          );
      }
    }

    // the driver: the man from the group, a little smaller (he's further back here)
    const MAN_S: Figure = {
      hair: P.manHair,
      hairLit: P.manHairLit,
      skin: P.manSkin,
      skinSh: P.manSkinSh,
      top: P.manTee,
      topSh: P.manTeeSh,
      topLit: P.manTeeLit,
      low: P.manShorts,
      lowSh: P.manShortsSh,
      shoe: P.manShoe,
      torso: 3,
      lower: 2,
      legs: 2,
      lowKind: 'shorts',
      hairStyle: 'short',
      beard: P.manBeard,
    };
    const reflect = (c: RGB) => lerpRGB(P.floorTint, c, 0.42);
    /** The driver out of the car: round to the rubble, sheepish, sorry, back in. */
    function drawSorry(f: Frame, t: number) {
      const a = t - wallAt;
      if (a < CW.door || a >= CW.driverIn) return;
      const feet = FLOOR + 6;
      const doorX = HX + 2 + 14;
      const spot = HX - 2;
      let x = spot;
      let pose: Pose = 'head';
      let dir: 1 | -1 = -1;
      const step = Math.floor(a / 110) % 2 ? 'walk0' : 'walk1';
      if (a < CW.door + 600) {
        x = doorX + (spot - doorX) * span(a, CW.door, CW.door + 600);
        pose = step;
      } else if (a < 3900) pose = 'head';
      else if (a < 4700)
        pose = (a - 3900) % 400 < 260 ? 'bow' : 'side'; // two bows
      else if (a < 5000) pose = 'head';
      else {
        x = spot + (doorX - spot) * span(a, 5000, CW.driverIn);
        pose = step;
        dir = 1;
      }
      drawFigure(f, MAN_S, pose, x, feet, dir);
      drawFigure(f, MAN_S, pose, x, feet, dir, reflect, true);
    }

    /** The jolt when it hits: the whole picture shakes for a moment. */
    function shake(f: Frame, t: number) {
      const a = t - wallAt - CW.bump;
      if (a < 0 || a >= 420) return;
      const dx = Math.round(Math.sin(a / 24) * 2.6 * (1 - a / 420));
      const dy = a < 110 ? 1 : 0;
      const px = f.pixels;
      if (dy) px.copyWithin(w, 0, w * (h - 1));
      if (!dx) return;
      for (let y = 0; y < h; y++) {
        const r = y * w;
        if (dx > 0) px.copyWithin(r + dx, r, r + w - dx);
        else px.copyWithin(r, r - dx, r + w);
      }
    }

    // bricks knocked flying out over the floor, each bouncing once
    const flying = Array.from({ length: 12 }, (_, k) => ({
      x0: HX - 4 + Math.round((hash2(k, 0, 86) - 0.5) * 8),
      y0: WALL_TOP + 4 + Math.round(hash2(k, 1, 86) * 6),
      vx: (hash2(k, 2, 86) - 0.5) * 2 * (25 + hash2(k, 3, 86) * 45),
      vy: -(25 + hash2(k, 4, 86) * 45),
      ground: FLOOR + 1 + Math.round(hash2(k, 5, 86) * 8),
      c: [P.brick, P.brickHi, P.brickSh, P.stoneHi][k % 4]!,
      big: k % 3 === 0,
    }));
    const G_BRICK = 220;
    function drawBricks(f: Frame, t: number) {
      const a = t - wallAt - CW.fall;
      if (a < 0 || t - wallAt >= CW.mend + 600) return;
      const fade = t - wallAt >= CW.mend;
      for (const b of flying) {
        let s = a / 1000;
        // first flight, to the floor
        const dy0 = b.ground - b.y0;
        const t1 =
          (-b.vy + Math.sqrt(b.vy * b.vy + 2 * G_BRICK * dy0)) / G_BRICK;
        let x: number;
        let y: number;
        if (s < t1) {
          x = b.x0 + b.vx * s;
          y = b.y0 + b.vy * s + 0.5 * G_BRICK * s * s;
        } else {
          // one small bounce, then it lies there
          s -= t1;
          const v2 = (b.vy + G_BRICK * t1) * 0.3;
          const t2 = (2 * v2) / G_BRICK;
          const u = Math.min(s, t2);
          x = b.x0 + b.vx * t1 + b.vx * 0.4 * u;
          y = b.ground - v2 * u + 0.5 * G_BRICK * u * u;
        }
        x = Math.round(x);
        y = Math.round(Math.min(y, b.ground));
        if (fade && Math.floor(a / 90) % 2) continue;
        f.set(x, y, b.c);
        f.set(x + 1, y, b.c === P.stoneHi ? P.stoneLit : P.brickSh);
        if (b.big) f.set(x, y - 1, P.brickHi);
      }
    }

    function drawDust(f: Frame, t: number) {
      const s = t - wallAt - CW.fall;
      if (s < 0 || s > 3400 || !wallBusy(t)) return;
      // a big soft cloud that billows out along the wall and slowly settles
      const reach = Math.max(44, Math.min(80, w * 0.2));
      for (let k = 0; k < 26; k++) {
        const u = (s - hash2(k, 1, 85) * 260) / 1000;
        if (u < 0 || u > 3) continue;
        const out = 1 - Math.exp(-u * 1.7);
        // most of it near the hole, some rolling far out along the wall
        const side = (k % 2 ? 1 : -1) * ((k >> 1) / 12) ** 1.4;
        const x = HX - 3 + side * reach * out + (hash2(k, 3, 85) - 0.5) * 8;
        const y =
          FLOOR -
          3 -
          hash2(k, 4, 85) * 8 -
          u * (6 + hash2(k, 6, 85) * 8) * (1 - Math.abs(side) * 0.6);
        const r = 2 + out * (5 + hash2(k, 5, 85) * 6);
        const al = 0.62 * (1 - u / 3) ** 1.2;
        const c = k % 3 ? P.dust : P.dust2;
        for (let dy = -Math.ceil(r); dy <= r; dy++)
          for (let dx = -Math.ceil(r); dx <= r; dx++)
            if (dx * dx + dy * dy * 1.5 <= r * r)
              f.blend(x + dx, y + dy, c, al);
      }
    }

    function drawPenjor(
      f: Frame,
      x: number,
      dir: number,
      t: number,
      seed: number
    ) {
      // a tall bamboo pole bowing over at the top, hung with woven palm-leaf ornaments:
      // its angle from the vertical grows with the cube of the length, like a loaded rod
      const sway =
        Math.sin(t / 1900 + seed) * 0.12 + Math.sin(t / 700 + seed) * 0.03;
      const N = 64;
      const ds = 2;
      const pts: [number, number][] = [[x, FLOOR]];
      let px = x;
      let py = FLOOR;
      for (let k = 1; k <= N; k++) {
        const s = k / N;
        const ang = (2.35 + sway) * s * s * s;
        px += dir * Math.sin(ang) * ds;
        py -= Math.cos(ang) * ds;
        pts.push([px, py]);
      }
      for (let k = 0; k < N; k++) {
        const [ax, ay] = pts[k]!;
        const [bx, by] = pts[k + 1]!;
        f.line(ax, ay, bx, by, P.bamboo);
        if (k < N * 0.6) f.line(ax - dir, ay, bx - dir, by, P.bambooSh);
        if (k % 6 === 3 && k < N * 0.6) f.set(ax, ay, P.bambooSh);
      }
      // a fringe of young palm leaf hanging all along the bend, with woven ornaments
      for (let k = Math.round(N * 0.5); k < N; k++) {
        const [ax, ay] = pts[k]!;
        const len = 2 + ((k * 7) % 4);
        const swing = Math.round(Math.sin(t / 500 + k * 0.7) * 0.6);
        for (let j = 1; j <= len; j++)
          f.set(
            ax + (j === len ? swing : 0),
            ay + j,
            j === len ? P.janurSh : P.janur
          );
        if (k % 8 === 4) {
          f.set(ax - 1, ay + len + 1, P.sampian);
          f.set(ax, ay + len + 1, P.janur);
          f.set(ax + 1, ay + len + 1, P.sampian);
          f.set(ax, ay + len + 2, P.janurSh);
        }
      }
      // the sampian dangling from the tip
      const [tx, ty] = pts[N]!;
      const dangle = Math.round(Math.sin(t / 900 + seed) * 1.2);
      f.vline(tx, ty, ty + 3, P.janurSh);
      f.rect(tx - 1 + dangle, ty + 4, 3, 5, P.sampian);
      f.set(tx - 1 + dangle, ty + 5, P.janurSh);
      f.set(tx + 1 + dangle, ty + 7, P.janurSh);
      f.set(tx + dangle, ty + 9, P.janur);
      f.set(tx + dangle, ty + 10, P.janurSh);
      // a little offering shelf part way up, and a skirt of leaves at the foot
      const [sx, sy] = pts[Math.round(N * 0.22)]!;
      f.rect(sx - 2, sy, 6, 3, P.janur);
      f.hline(sx - 2, sx + 3, sy + 3, P.janurSh);
      f.set(sx, sy - 1, P.petalRed);
      f.set(sx + 1, sy - 1, P.petalYellow);
      for (let k = -3; k <= 3; k++)
        f.line(
          x + 1,
          FLOOR - 9,
          x + 1 + k,
          FLOOR - 1,
          Math.abs(k) % 2 ? P.janurSh : P.janur
        );
    }

    function drawBirds(f: Frame, t: number) {
      // swiftlets wheeling high over the gate
      for (let i = 0; i < 3; i++) {
        const a = t / (2600 + i * 400) + i * 2.1;
        const x = Math.round(cx + Math.cos(a) * (HW + 18 + i * 9));
        const y = Math.round(20 + i * 6 + Math.sin(a * 1.3) * 5);
        const up = Math.floor(t / 140 + i) % 2;
        f.set(x, y, P.bird);
        f.set(x - 1, y - up, P.bird);
        f.set(x + 1, y - up, P.bird);
        f.set(x - 2, y - up + (up ? 0 : 1), P.bird);
        f.set(x + 2, y - up + (up ? 0 : 1), P.bird);
      }
    }

    function drawCarrier(f: Frame, t: number) {
      // a woman crossing the courtyard with a tower of fruit offerings on her head
      const PERIOD = 34_000;
      const p = (t % PERIOD) / PERIOD;
      const x = Math.round(-15 + p * (w + 30));
      const feet = h - 9;
      const step = Math.floor(t / 300) % 2;
      // her reflection first, then her
      for (const s of [-1, 1]) {
        const base = s === 1 ? feet : feet + 1;
        const at = (dy: number) => base - dy * s;
        const tint = (c: RGB) => (s === 1 ? c : lerpRGB(P.floorTint, c, 0.45));
        f.rect(x, Math.min(at(5), at(1)), 4, 5, tint(P.sarong1));
        f.hline(x, x + 3, at(4), tint(P.sash));
        f.rect(x, Math.min(at(9), at(6)), 4, 4, tint(P.shirt));
        f.rect(x + 1, Math.min(at(11), at(10)), 2, 2, tint(P.skin));
        f.set(x + 3, at(8), tint(P.skin));
        f.set(x + 3, at(10), tint(P.skin));
        // the gebogan: fruit stacked in a cone
        const rows = [
          [P.janur, 5],
          [P.fruitRed, 5],
          [P.fruitYellow, 4],
          [P.fruitGreen, 3],
          [P.fruitRed, 2],
          [P.janur, 1],
        ] as const;
        rows.forEach(([c, n], r) => {
          const yy = at(12 + r);
          const x0 = x + 2 - Math.floor(n / 2);
          for (let k = 0; k < n; k++)
            f.set(
              x0 + k,
              yy,
              tint((k + r) % 3 === 0 && r > 0 ? P.fruitYellow : c)
            );
        });
        if (s === 1) {
          f.set(x + step, base + 1, P.skinSh);
          f.set(x + 3 - step, base + 1, P.skinSh);
        }
      }
    }

    // ---------- easter egg: the sunrise ----------
    // A tiny pair of headlights is always crawling up Agung between the
    // gates; tap it and the morning goes back to the dark before dawn. The
    // sky drops to deep blue with the last stars out, a line of jeeps comes
    // zigzagging up out of the clouds, little figures gather on the rim, and
    // then the sun breaks over the summit and floods the whole courtyard
    // gold, before it settles back into this pink morning.
    const SR = {
      climb0: 350, // the first jeep comes up out of the clouds
      climb1: 3500, // and gets to the top
      hikers: 2500, // people walk up onto the rim, one by one
      glow: 3300, // the sky behind the summit starts to warm
      sun: 4400, // the sun breaks over the rim
      fade: 5900,
      end: 7900,
    };
    let sunAt = -Infinity;
    let sunTap: [number, number] = [agX, 60];
    const sunBusy = (t: number) => t - sunAt >= 0 && t - sunAt < SR.end;

    // the road up: switchbacks across the gap, the bends tucked behind the gate
    const ROAD_TOP = AG_TOP + 4;
    const ROAD_BOT = SEA_TOP - 1;
    const LEGS = 7;
    /** How far either side of the axis Agung's slope is at row y. */
    const slopeHalf = (y: number) => {
      const v = clamp01((y - AG_TOP) / (SEA_TOP + 6 - AG_TOP));
      return R * (1 - Math.pow(1 - v, 1 / 1.9));
    };
    const road: [number, number][] = [];
    for (let i = 0; i <= LEGS; i++) {
      const y = ROAD_BOT - ((ROAD_BOT - ROAD_TOP) * i) / LEGS;
      const reach = Math.min(slopeHalf(y) - 2, G / 2 + 2 + (y - AG_TOP) * 0.2);
      road.push([agX + (i % 2 ? 1 : -1) * Math.max(1, reach), y]);
    }
    const legLen = road
      .slice(1)
      .map(([x, y], i) => Math.hypot(x - road[i]![0], y - road[i]![1]));
    const roadLen = legLen.reduce((s, l) => s + l, 0);
    /** The point `s` px along the road from the bottom, and which way it heads. */
    const roadAt = (s: number): [number, number, number] => {
      let d = Math.max(0, Math.min(roadLen, s));
      for (let i = 0; i < LEGS; i++) {
        const l = legLen[i]!;
        if (d <= l || i === LEGS - 1) {
          const [ax, ay] = road[i]!;
          const [bx, by] = road[i + 1]!;
          const u = Math.min(1, d / l);
          return [ax + (bx - ax) * u, ay + (by - ay) * u, bx > ax ? 1 : -1];
        }
        d -= l;
      }
      return [road[LEGS]![0], road[LEGS]![1], 1];
    };
    // the jeep that's always on its way up: along the leg that crosses the
    // middle of the gap, where it can be seen
    const IDLE_LEG = 4;
    const IDLE_RUN = 15_000;
    const IDLE_REST = 1400;
    function idleJeep(t: number): [number, number, number] | null {
      if (sunBusy(t)) return null;
      const k = t % (IDLE_RUN + IDLE_REST);
      if (k >= IDLE_RUN) return null;
      const [ax, ay] = road[IDLE_LEG]!;
      const [bx, by] = road[IDLE_LEG + 1]!;
      const dir = bx > ax ? 1 : -1;
      const x0 = dir > 0 ? innerL + 3 : innerR - 4;
      const x1 = dir > 0 ? innerR - 4 : innerL + 3;
      const x = Math.round(x0 + (x1 - x0) * (k / IDLE_RUN));
      const y = Math.round(ay + ((by - ay) * (x - ax)) / (bx - ax));
      return [x, y, dir];
    }
    /** A jeep: dark body, a headlight pointing the way, a red tail light. */
    function jeep(f: Frame, x: number, y: number, dir: number, a = 1) {
      const vis = (px: number, py: number) => !temple.opaque(px, py);
      const put = (px: number, py: number, c: RGB, al: number) => {
        if (vis(px, py)) f.blend(px, py, c, al * a);
      };
      put(x - dir, y, P.jeep, 1);
      put(x - 2 * dir, y, P.jeep, 1);
      put(x - dir, y - 1, P.jeep, 0.9);
      put(x - 3 * dir, y, P.jeepTail, 0.8);
      put(x, y, P.jeepLamp, 1);
      // the beam, lighting up the road ahead
      put(x + dir, y, P.jeepGlow, 0.7);
      put(x + 2 * dir, y, P.jeepGlow, 0.45);
      put(x + 3 * dir, y, P.jeepGlow, 0.25);
      put(x + 2 * dir, y + 1, P.jeepGlow, 0.2);
    }
    function drawIdleJeep(f: Frame, t: number) {
      const j = idleJeep(t);
      if (!j) return;
      const [x, y, dir] = j;
      jeep(f, x, y, dir);
      // now and then a flash of high beam, just enough to catch the eye
      const b = t % 2700;
      if (b < 180) {
        const al = 0.7 * (1 - b / 180);
        for (const [dx, dy] of [
          [0, -1],
          [0, 1],
          [dir, -1],
          [dir, 1],
          [2 * dir, 0],
          [3 * dir, 0],
        ] as const)
          if (!temple.opaque(x + dx, y + dy))
            f.blend(x + dx, y + dy, P.jeepLamp, al);
      }
    }

    // what each pixel of the still picture is, so the light can treat it right
    const SKYK = 0;
    const MOUNTK = 1;
    const LOWK = 2;
    const STONEK = 3;
    const FLOORK = 4;
    const kind = new Uint8Array(w * h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        kind[y * w + x] =
          y >= FLOOR
            ? FLOORK
            : temple.opaque(x, y)
              ? STONEK
              : hills.opaque(x, y) || cloudSea.opaque(x, y)
                ? LOWK
                : mountain.opaque(x, y)
                  ? MOUNTK
                  : SKYK;
    const ramp = (cs: RGB[], v: number) => {
      const p = clamp01(v) * (cs.length - 1);
      const i = Math.min(cs.length - 2, Math.floor(p));
      return lerpRGB(cs[i]!, cs[i + 1]!, p - i);
    };
    const nightRow = Array.from({ length: h }, (_, y) =>
      ramp([P.night0, P.night1, P.night2, P.night3], y / (SEA_TOP + 4))
    );
    const goldRow = Array.from({ length: h }, (_, y) =>
      ramp([P.gold0, P.gold1, P.gold2, P.gold3], y / (SEA_TOP + 4))
    );
    const starsAt = Array.from({ length: 46 }, (_, i) => ({
      x: Math.floor(hash2(i, 1, 61) * w),
      y: 2 + Math.floor(Math.pow(hash2(i, 2, 61), 1.3) * 70),
      ph: hash2(i, 3, 61) * 6.28,
      big: hash2(i, 4, 61) > 0.88,
    })).filter((s) => kind[s.y * w + s.x] === SKYK);
    // the people on the rim, either side of the crater
    const hikers = [-8, -5, -3, 2, 4, 7].map((dx, i) => {
      const x = agX + dx;
      return { x, feet: Math.round(agTop(x)) - 1, delay: i * 230 };
    });
    const SUN_R = 6;
    /** Where the sun's centre is, `a` ms in: rising from behind the summit. */
    const sunY = (a: number) =>
      AG_TOP + 9 - 17 * ease((a - SR.sun + 300) / 1300);

    function sunrise(f: Frame, t: number) {
      const a = t - sunAt;
      if (a < 0 || a >= SR.end) return;
      const [tx, ty] = sunTap;
      // the dark spreads out from the jeep you tapped
      const nightR = a * 0.8;
      // and the gold from the sun, once it's up
      const goldR = a < SR.sun ? -1 : (a - SR.sun) * 0.42;
      const peak = 1 - ease((a - SR.fade) / (SR.end - SR.fade));
      const warm = ease((a - SR.glow) / (SR.sun - SR.glow)) * 0.75;
      const sy0 = AG_TOP + 2;
      const px = f.pixels;
      for (let y = 0; y < h; y++) {
        const dyN = (y - ty) * (y - ty);
        const dyG = (y - sy0) * (y - sy0);
        const nRow = nightRow[y]!;
        const gRow = goldRow[y]!;
        for (let x = 0; x < w; x++) {
          let n = clamp01((nightR - Math.sqrt((x - tx) * (x - tx) + dyN)) / 30);
          let g = 0;
          if (goldR >= 0) {
            const fr = clamp01(
              (goldR - Math.sqrt((x - agX) * (x - agX) + dyG)) / 50
            );
            n *= 1 - fr;
            g = fr * peak;
          }
          if (n <= 0.004 && g <= 0.004) continue;
          const i = y * w + x;
          const p = px[i]!;
          const r = p & 0xff;
          const gg = (p >>> 8) & 0xff;
          const b = (p >>> 16) & 0xff;
          const k = kind[i]!;
          // before dawn: deep blue, the sky first, the land darker still
          let nr: number, ng: number, nb: number;
          if (k === SKYK) {
            let c = nRow;
            if (warm > 0) {
              const d = Math.sqrt(
                (x - agX) * (x - agX) + (y - AG_TOP) * (y - AG_TOP) * 2.56
              );
              const wv = warm * Math.max(0, 1 - d / 70);
              if (wv > 0) c = lerpRGB(c, P.dawnGlow, wv * wv);
            }
            nr = ((c >> 16) & 0xff) * 0.86 + r * 0.14;
            ng = ((c >> 8) & 0xff) * 0.86 + gg * 0.14;
            nb = (c & 0xff) * 0.86 + b * 0.14;
          } else if (k === MOUNTK) {
            nr = r * 0.08 + 8;
            ng = gg * 0.12 + 10;
            nb = b * 0.22 + 30;
          } else if (k === LOWK) {
            nr = r * 0.2 + 8;
            ng = gg * 0.24 + 12;
            nb = b * 0.38 + 38;
          } else {
            nr = r * 0.13 + 8;
            ng = gg * 0.17 + 10;
            nb = b * 0.32 + 26;
          }
          // sunrise: gold over everything
          let gr: number, gg2: number, gb: number;
          if (k === SKYK) {
            gr = ((gRow >> 16) & 0xff) * 0.78 + r * 0.22;
            gg2 = ((gRow >> 8) & 0xff) * 0.78 + gg * 0.22;
            gb = (gRow & 0xff) * 0.78 + b * 0.22;
          } else {
            gr = Math.min(255, r * 1.06 + 58);
            gg2 = Math.min(255, gg * 0.94 + 36);
            gb = b * 0.6 + 8;
          }
          const o = 1 - n - g;
          const R2 = r * o + nr * n + gr * g;
          const G2 = gg * o + ng * n + gg2 * g;
          const B2 = b * o + nb * n + gb * g;
          px[i] =
            (0xff000000 |
              (Math.round(B2) << 16) |
              (Math.round(G2) << 8) |
              Math.round(R2)) >>>
            0;
        }
      }

      const night = (x: number, y: number) =>
        clamp01((nightR - Math.hypot(x - tx, y - ty)) / 30) *
        (goldR < 0
          ? 1
          : 1 - clamp01((goldR - Math.hypot(x - agX, y - sy0)) / 50));
      // the last stars
      for (const s of starsAt) {
        const n = night(s.x, s.y);
        if (n <= 0) continue;
        const tw = 0.65 + 0.35 * Math.sin(t / 500 + s.ph);
        f.blend(s.x, s.y, P.star, n * tw);
        if (s.big && tw > 0.8) {
          f.blend(s.x - 1, s.y, P.star, n * 0.4);
          f.blend(s.x + 1, s.y, P.star, n * 0.4);
          f.blend(s.x, s.y - 1, P.star, n * 0.4);
          f.blend(s.x, s.y + 1, P.star, n * 0.4);
        }
      }

      // the sun, its rays, and its light on the floor
      if (a >= SR.sun - 300) {
        const scx = agX;
        const scy = sunY(a);
        const sky = (x: number, y: number) =>
          x >= 0 &&
          x < w &&
          y >= 0 &&
          y < h &&
          kind[(y | 0) * w + (x | 0)] === SKYK;
        const up = ease((a - SR.sun + 300) / 900) * peak;
        glow(f, scx, scy, 46, P.gold2, 0.55 * up, 0.8);
        for (let dy = -SUN_R - 1; dy <= SUN_R + 1; dy++)
          for (let dx = -SUN_R - 1; dx <= SUN_R + 1; dx++) {
            const d = Math.hypot(dx, dy);
            const x = scx + dx;
            const y = Math.round(scy) + dy;
            if (d > SUN_R + 0.5 || !sky(x, y)) continue;
            const c =
              d < SUN_R * 0.55 ? P.sun : d < SUN_R - 0.6 ? P.sunMid : P.sunEdge;
            f.blend(x, y, c, Math.min(1, up * 1.4));
          }
        if (a >= SR.sun) {
          // rays fanning out across the sky
          const len = ease((a - SR.sun) / 900) * Math.max(w, 260);
          for (let k = 0; k < 11; k++) {
            const ang = -Math.PI + ((k + 0.5) / 11) * Math.PI;
            const ca = Math.cos(ang);
            const sa = Math.sin(ang);
            const wob = 0.8 + 0.2 * Math.sin(t / 300 + k * 1.7);
            for (let d = SUN_R + 3; d < len; d++) {
              const x = scx + ca * d;
              const y = scy + sa * d;
              if (y < 0) break;
              const al = 0.42 * peak * wob * (1 - d / Math.max(w, 260));
              if (sky(x, y)) f.blend(x, y, P.ray, al);
              if (sky(x - sa, y + ca)) f.blend(x - sa, y + ca, P.ray, al * 0.5);
            }
          }
          // a path of gold on the polished floor, straight from the gap
          const pa = 0.55 * peak * ease((a - SR.sun) / 700);
          for (let y = FLOOR + 1; y < h; y++) {
            const half = 1 + (y - FLOOR) * 0.12;
            const wob = Math.sin(y * 0.9 + t / 300) * 0.8;
            for (
              let x = Math.floor(agX - half + wob);
              x <= agX + half + wob;
              x++
            )
              f.blend(x, y, (x + y) % 3 ? P.gold3 : P.sun, pa);
          }
        }
      }

      // the line of jeeps, up out of the clouds and along the switchbacks
      if (a >= SR.climb0) {
        const lead = roadLen * (1 - (1 - span(a, SR.climb0, SR.climb1)) ** 1.6);
        const lights = 1 - clamp01((a - SR.sun) / 600);
        if (lights > 0)
          for (let j = 0; j < 13; j++) {
            const s = lead - j * 17;
            if (s <= 0) break;
            const [x, y, dir] = roadAt(s);
            const off = (t / 2400) % w; // the clouds drift
            const seaY = seaTop(Math.floor((((x - off) % w) + w) % w));
            if (y >= seaY - 1) continue;
            jeep(f, Math.round(x), Math.round(y), dir, lights);
          }
      }

      // and the people up on the rim, headlamps on, then arms up for the sun
      hikers.forEach((p, i) => {
        const arrive = SR.hikers + p.delay;
        if (a < arrive) return;
        const [rx] = road[LEGS]!;
        const u = span(a, arrive, arrive + 450);
        const x = Math.round(rx + (p.x - rx) * u);
        const feet = Math.round(agTop(x)) - 1;
        const c = P.hiker;
        const cheer = a >= SR.sun + 250 + i * 70;
        const fade = a >= SR.end - 700 ? Math.floor(a / 80) % 2 : 0;
        if (fade) return;
        f.set(x, feet, c);
        f.set(x, feet - 1, c);
        f.set(x, feet - 2, c);
        if (cheer) {
          f.set(x - 1, feet - 3, c);
          f.set(x + 1, feet - 3, c);
        } else if (a < SR.sun) f.blend(x, feet - 2, P.hikerLamp, 0.9);
      });
    }

    // ---------- easter egg: the scooter ----------
    // Tap the scooter parked by the wall and a group walks in from both sides:
    // the man, the woman with the girl on her hip and the tall one from the
    // left, the elder and the stocky one from the right. They meet in front of
    // the gate, the man and the elder first, then everyone in one hug; the man
    // lifts the girl up high and they all crowd round her; frangipani petals
    // and little hearts go up; a camera flashes and a print slides up into the
    // middle of the picture: a group photo at a lakeside viewpoint (Lake
    // Batur). It holds a moment, drops away, and they wave and walk off
    // together.
    const SCOOT = [
      '..........c..',
      '.ee......Hmc.',
      'eEee......mmL',
      'sssss.....mm.',
      'Hmmmmm....mm.',
      'mmmmmmm..mmm.',
      'MmmmmmmmmmmM.',
      '.Mtt.....Mtt.',
      '.tot.....tot.',
      '..t.......t..',
    ];
    const SX = innerL - HW - 15; // the scooter's tail
    const SFEET = FLOOR + 8;
    const SCX = SX + 6;
    const SCY = SFEET - 5;
    const scootCol: Record<string, RGB> = {
      m: P.scoot,
      M: P.scootSh,
      H: P.scootHi,
      s: P.seat,
      c: P.chrome,
      L: P.headlamp,
      t: P.carHi,
      o: P.chrome,
      e: P.helmet,
      E: P.helmetSh,
    };
    function drawScooter(f: Frame, t: number) {
      const a = t - groupAt;
      // tapped: the headlight blinks twice, a toot
      const lamp = a >= 0 && a < 700 && a % 350 < 200;
      const top = SFEET - SCOOT.length + 1;
      SCOOT.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          const c = scootCol[row[rx]!];
          if (c === undefined) continue;
          f.set(SX + rx, top + ry, c);
          f.set(
            SX + rx,
            SFEET + 1 + (SCOOT.length - 1 - ry),
            lerpRGB(P.floorTint, c, 0.4)
          );
        }
      });
      f.hline(SX + 1, SX + 11, SFEET + 1, lerpRGB(P.floorTint, P.tyre, 0.55));
      if (lamp) glow(f, SX + 12, top + 2, 10, P.headlamp, 0.75, 0.7);
    }

    const MAN: Figure = { ...MAN_S, torso: 4 };
    const WOMAN: Figure = {
      hair: P.womanHair,
      hairLit: P.womanHairLit,
      skin: P.womanSkin,
      skinSh: P.womanSkinSh,
      top: P.womanDress,
      topSh: P.womanDressSh,
      low: P.womanDress,
      lowSh: P.womanDressSh,
      shoe: P.womanShoe,
      torso: 3,
      lower: 3,
      legs: 1,
      lowKind: 'dress',
      hairStyle: 'long',
    };
    const ELDER: Figure = {
      hair: P.elderHair,
      hairLit: P.elderHairLit,
      skin: P.elderSkin,
      skinSh: P.elderSkinSh,
      top: P.elderTop,
      topSh: P.elderTopSh,
      low: P.elderJeans,
      lowSh: P.elderJeansSh,
      shoe: P.elderShoe,
      torso: 3,
      lower: 4,
      legs: 0,
      lowKind: 'trousers',
      hairStyle: 'wavy',
      sunnies: P.sunnies,
    };
    // tall and lanky, the tallest of them
    const TALL: Figure = {
      hair: P.tallHair,
      hairLit: P.tallHairLit,
      skin: P.tallSkin,
      skinSh: P.tallSkinSh,
      top: P.tallTop,
      topSh: P.tallTopSh,
      low: P.tallTrousers,
      lowSh: P.tallTrousersSh,
      shoe: P.tallShoe,
      torso: 4,
      lower: 6,
      legs: 0,
      lowKind: 'trousers',
      hairStyle: 'shaggy',
      print: P.tallPrint,
    };
    // stocky, a hand on his hip when he stands
    const STOCKY: Figure = {
      hair: P.stockyHair,
      hairLit: P.stockyHairLit,
      skin: P.stockySkin,
      skinSh: P.stockySkinSh,
      top: P.stockyTop,
      topSh: P.stockyTopSh,
      low: P.stockyShorts,
      lowSh: P.stockyShortsSh,
      shoe: P.stockyShoe,
      torso: 4,
      lower: 2,
      legs: 2,
      lowKind: 'shorts',
      hairStyle: 'short',
    };
    const KID: Little = {
      hair: P.girlHair,
      skin: P.girlSkin,
      skinSh: P.girlSkinSh,
      top: P.girlTop,
      topSh: P.girlTopSh,
      skirt: P.girlSkirt,
    };
    const FFEET = FLOOR + 12;
    const M0 = cx - 2; // the man ends up in the middle
    // left to right as they stand at the end: who, where, which side they came from
    const GROUP = [
      { k: TALL, x: M0 - 13, from: -1 },
      { k: WOMAN, x: M0 - 7, from: -1 },
      { k: MAN, x: M0, from: -1 },
      { k: ELDER, x: M0 + 6, from: 1 },
      { k: STOCKY, x: M0 + 12, from: 1 },
    ] as const;
    const WOMAN_I = 1;
    const MAN_I = 2;
    const FA = {
      meet: 1800, // they've arrived
      hug1: 1900, // the man and the elder
      hug: 2200, // everyone
      lift: 2650, // the man lifts the girl up
      high: 2950, // up high: petals and hearts
      photo: 3450, // flash, and the print slides up
      drop: 5950, // the print drops away
      ride: 4300, // she's down on his shoulders (behind the print)
      wave: 6150,
      off: 6850, // and off they go together
      end: 8700,
    };
    let groupAt = -Infinity;
    const groupBusy = (t: number) => t - groupAt >= 0 && t - groupAt < FA.end;
    const walkIn = (p: number) =>
      p < 0.75
        ? (p / 0.75) * 0.85
        : 0.85 + 0.15 * (1 - (1 - (p - 0.75) / 0.25) ** 2);
    const offBy = M0 + 20; // far enough left for the last of them to be gone

    /** A warm light round them while they hug, as if the morning leaned in. */
    function groupLight(f: Frame, t: number) {
      const a = t - groupAt;
      if (a < FA.hug1 || a >= FA.off + 700) return;
      const k = ease((a - FA.hug1) / 900) * (1 - ease((a - FA.off) / 700));
      glow(
        f,
        M0 + 1,
        FFEET - 9,
        Math.max(48, Math.min(110, w * 0.25)),
        P.shine2,
        0.28 * k,
        0.65
      );
    }

    function drawGroup(f: Frame, t: number) {
      const a = t - groupAt;
      if (a < 0 || a >= FA.end) return;
      const inL = M0 + 8; // how far the left group walks in
      const inR = w + 6 - (M0 + 6);
      const walking = a < FA.meet || a >= FA.off;
      const pIn = walkIn(span(a, 0, FA.meet));
      const pOff = span(a, FA.off, FA.end) ** 1.25;
      const hugging = a >= FA.hug && a < FA.lift;
      const sway = hugging ? Math.round(Math.sin((a - FA.hug) / 170)) : 0;
      const crowd = a >= FA.high && a < FA.ride;
      type Placed = { k: Figure; x: number; pose: Pose; dir: 1 | -1 };
      const placed: Placed[] = GROUP.map((m, i) => {
        let x: number = m.x;
        let pose: Pose = 'stand';
        let dir: 1 | -1 = 1;
        const step: Pose =
          Math.floor(a / 120 + i * 0.5) % 2 ? 'walk0' : 'walk1';
        if (a < FA.meet) {
          x = m.from < 0 ? m.x - inL * (1 - pIn) : m.x + inR * (1 - pIn);
          pose = step;
          dir = m.from < 0 ? 1 : -1;
        } else if (a >= FA.off) {
          x = m.x - offBy * pOff;
          pose = step;
          dir = -1;
        } else {
          // closing in: the man and the elder first, then everyone
          const toward = m.from < 0 ? 1 : -1;
          if (a >= FA.hug1 && (i === MAN_I || i === MAN_I + 1)) x += toward;
          if (a >= FA.hug)
            x += i === 0 || i === 4 ? toward * 2 : i === WOMAN_I ? toward : 0;
          if (crowd && i !== MAN_I) x += toward;
          x += sway;
          if (a < FA.hug1) pose = i === WOMAN_I ? 'carry' : 'stand';
          else if (a < FA.hug)
            pose =
              i === MAN_I || i === MAN_I + 1
                ? 'hug'
                : i === WOMAN_I
                  ? 'carry'
                  : 'stand';
          else if (a < FA.lift) pose = i === WOMAN_I ? 'carry' : 'hug';
          else if (a < FA.ride) {
            if (i === MAN_I) pose = a < FA.photo + 300 ? 'lift' : 'stand';
            else if (a < FA.high) pose = 'stand';
            else pose = 'up';
          } else if (a < FA.wave) pose = 'stand';
          else
            pose =
              Math.floor((a - FA.wave) / 210 + i * 0.6) % 2 ? 'wave0' : 'wave1';
        }
        // the stocky one stands with a hand on his hip
        if (pose === 'stand' && m.k === STOCKY) pose = 'akimbo';
        return { k: m.k, x: Math.round(x), pose, dir };
      });
      // a little hop of joy while she's up there
      const hop = (i: number) =>
        crowd && i !== MAN_I && Math.floor((a - FA.high) / 180 + i * 0.5) % 2
          ? 1
          : 0;
      // the girl: on the woman's hip, lifted up high, then on the man's shoulders
      const woman = placed[WOMAN_I]!;
      const man = placed[MAN_I]!;
      const womanTop = crownOf(WOMAN, FFEET);
      const manTop = crownOf(MAN, FFEET);
      let kid: {
        pose: 'hip' | 'up' | 'ride';
        x: number;
        top: number;
        dir: 1 | -1;
      };
      const hip = {
        x: woman.x + (walking ? (woman.dir > 0 ? 2 : -3) : 3),
        top: womanTop + 3,
      };
      const highAt = { x: man.x, top: manTop - 6 };
      const rideAt = { x: man.x + (man.dir > 0 ? 0 : -1), top: manTop - 3 };
      if (a < FA.lift) kid = { pose: 'hip', ...hip, dir: woman.dir };
      else if (a < FA.high) {
        const u = ease(span(a, FA.lift, FA.high));
        kid = {
          pose: u > 0.5 ? 'up' : 'hip',
          x: Math.round(hip.x + (highAt.x - hip.x) * u),
          top: Math.round(
            hip.top + (highAt.top - hip.top) * u - Math.sin(u * Math.PI) * 4
          ),
          dir: 1,
        };
      } else if (a < FA.photo + 300) {
        const bob = Math.floor((a - FA.high) / 260) % 2;
        kid = { pose: 'up', x: highAt.x, top: highAt.top - bob, dir: 1 };
      } else if (a < FA.ride) {
        const u = ease(span(a, FA.photo + 300, FA.ride));
        kid = {
          pose: u > 0.5 ? 'ride' : 'up',
          x: Math.round(highAt.x + (rideAt.x - highAt.x) * u),
          top: Math.round(highAt.top + (rideAt.top - highAt.top) * u),
          dir: 1,
        };
      } else kid = { pose: 'ride', ...rideAt, dir: man.dir };
      const onHip = kid.pose === 'hip';
      // the reflections first, then everyone, left to right
      placed.forEach((p, i) => {
        drawFigure(f, p.k, p.pose, p.x, FFEET, p.dir, reflect, true);
        if (i === WOMAN_I && onHip)
          drawLittle(f, KID, kid.pose, kid.x, kid.top, kid.dir, reflect, FFEET);
      });
      if (!onHip)
        drawLittle(f, KID, kid.pose, kid.x, kid.top, kid.dir, reflect, FFEET);
      placed.forEach((p, i) => {
        drawFigure(f, p.k, p.pose, p.x, FFEET - hop(i), p.dir);
        if (i === WOMAN_I && onHip)
          drawLittle(f, KID, kid.pose, kid.x, kid.top, kid.dir);
      });
      if (!onHip) drawLittle(f, KID, kid.pose, kid.x, kid.top, kid.dir);
    }

    // the burst when she's up: frangipani flowers flung out wide, little hearts rising
    const burst = {
      petals: Array.from({ length: 26 }, (_, k) => ({
        ang: -Math.PI / 2 + (hash2(k, 1, 71) - 0.5) * 2.9,
        v: 0.55 + 0.45 * hash2(k, 2, 71),
        ground: FLOOR + 2 + Math.round(hash2(k, 3, 71) * (h - FLOOR - 5)),
        ph: hash2(k, 4, 71) * 6.28,
        pink: k % 4 === 0,
        delay: hash2(k, 5, 71) * 160,
      })),
      hearts: Array.from({ length: 8 }, (_, k) => ({
        ang:
          -Math.PI / 2 +
          (((k * 5) % 8) / 7 - 0.5) * 2.5 +
          (hash2(k, 1, 72) - 0.5) * 0.2,
        v: 0.65 + 0.35 * hash2(k, 2, 72),
        big: k % 3 !== 1,
        ph: hash2(k, 3, 72) * 6.28,
        delay: k * 70,
      })),
    };
    const HEART_BIG = ['XX.XX', 'XXXXX', '.XXX.', '..X..'];
    const HEART_SMALL = ['X.X', 'XXX', '.X.'];
    function drawBurst(f: Frame, t: number) {
      const a = t - groupAt - FA.high;
      if (a < 0 || t - groupAt >= FA.end) return;
      const ox = M0 + 1;
      const oy = crownOf(MAN, FFEET) - 5;
      const V = Math.max(70, Math.min(170, w * 0.36));
      const K = 1.7; // drag
      for (const p of burst.petals) {
        const s = (a - p.delay) / 1000;
        if (s < 0) continue;
        const e = (1 - Math.exp(-K * s)) / K;
        let x =
          ox +
          Math.cos(p.ang) * p.v * V * e +
          Math.sin(s * 4 + p.ph) * 2 * Math.min(1, s);
        // flung up and out, then drifting down
        let y = oy + Math.sin(p.ang) * p.v * V * 0.75 * e + 16 * (s - e);
        let landed = false;
        if (y >= p.ground) {
          y = p.ground;
          landed = true;
        }
        x = Math.round(x);
        y = Math.round(y);
        if (landed) {
          // lying on the floor, then gone as the scene settles
          if (t - groupAt > FA.end - 900 && Math.floor(a / 90) % 2) continue;
          bloom(f, x, y, p.pink);
          continue;
        }
        const spin = Math.floor(s * 7 + p.ph) % 3;
        const c = p.pink ? P.bloomPink : P.bloom;
        f.set(x, y, P.bloomEye);
        f.set(x + (spin === 0 ? 1 : 0), y + (spin === 1 ? 1 : 0), c);
        f.set(x - (spin === 2 ? 1 : 0), y - (spin === 0 ? 1 : 0), c);
        f.set(x + (spin === 1 ? -1 : 0), y + (spin === 2 ? 1 : 0), c);
      }
      for (const hh of burst.hearts) {
        const s = (a - hh.delay) / 1000;
        if (s < 0 || s > 3.2) continue;
        if (s > 2.4 && Math.floor(s * 12) % 2) continue;
        const e = (1 - Math.exp(-2 * s)) / 2;
        // from a ring round her, so they never hide her
        const x = Math.round(
          ox -
            2 +
            Math.cos(hh.ang) * (7 + hh.v * V * 0.85 * e) +
            Math.sin(s * 3 + hh.ph) * 1.5
        );
        const y = Math.round(
          oy - 2 + Math.sin(hh.ang) * (6 + hh.v * V * 0.5 * e) - 6 * s
        );
        const rows = hh.big ? HEART_BIG : HEART_SMALL;
        rows.forEach((row, ry) => {
          for (let rx = 0; rx < row.length; rx++)
            if (row[rx] === 'X')
              f.set(
                x + rx,
                y + ry,
                ry === 0 && rx === 0
                  ? P.heartHi
                  : ry === rows.length - 1 || rx === row.length - 1
                    ? P.heartSh
                    : P.heart
              );
        });
      }
    }

    /** The camera flash. */
    function flash(f: Frame, t: number) {
      const a = t - groupAt - FA.photo;
      if (a < 0 || a >= 520) return;
      const k = a < 60 ? a / 60 : a < 130 ? 1 : 1 - (a - 130) / 390;
      const px = f.pixels;
      const fr = (P.flash >> 16) & 0xff;
      const fg = (P.flash >> 8) & 0xff;
      const fb = P.flash & 0xff;
      for (let i = 0; i < px.length; i++) {
        const p = px[i]!;
        const r = p & 0xff;
        const g = (p >>> 8) & 0xff;
        const b = (p >>> 16) & 0xff;
        px[i] =
          (0xff000000 |
            (Math.round(b + (fb - b) * k) << 16) |
            (Math.round(g + (fg - g) * k) << 8) |
            Math.round(r + (fr - r) * k)) >>>
          0;
      }
    }

    // ---------- the print ----------
    // About 60% of the width on a phone, 40% on a wide screen, a white border
    // with a deeper strip along the bottom, like an instant photo. The
    // picture in it, drawn once, is a group photo at the viewpoint over Lake
    // Batur: the man in front, big, grinning, his arm out holding the camera;
    // the woman on the left; the tall one at the back; the girl up high in the
    // middle with the elder in front of her; the stocky one on the right, a
    // hand on his hip. Behind them a railing, the forest, the blue caldera
    // lake, Batur's slopes and soft clouds.
    const PH_W = Math.round(Math.max(w * 0.42, Math.min(w * 0.6, 140)));
    const PB = 4;
    const PB_BOT = 11;
    const PI_W = PH_W - 2 * PB;
    const PI_H = 78;
    const PH_H = PI_H + PB + PB_BOT;
    type Face = {
      hair: RGB;
      hairLit: RGB;
      skin: RGB;
      skinSh: RGB;
      style: 'short' | 'shaggy' | 'long' | 'wavy' | 'kid';
      beard?: RGB;
      sunnies?: RGB;
      grin?: boolean;
    };
    const photo = layer(PI_W, PI_H, (f) => {
      const pc = Math.floor(PI_W / 2);
      // ---- the view ----
      gradient(f, 0, 30, [P.bSky0, P.bSky1, P.bSky2]);
      clouds(f, {
        seed: 73,
        y0: 1,
        y1: 13,
        cell: 5,
        coverage: 0.32,
        stretch: 4,
        style: { light: P.bCloud, base: P.bCloudSh, shadow: P.bCloudDk },
      });
      // the far rim of the caldera
      const rim = (x: number) => 21 + Math.round(fbm1(x / 9, 31) * 4);
      for (let x = 0; x < PI_W; x++)
        for (let y = rim(x); y < 34; y++)
          f.set(x, y, y === rim(x) ? P.bRidge : P.bRidgeSh);
      // Batur, its top lost in cloud
      const bx = pc + 14;
      const batur = (x: number) =>
        Math.round(14 + Math.abs(x - bx) * 0.42 + fbm1(x / 4, 32) * 2);
      for (let x = pc - 14; x < PI_W; x++)
        for (let y = Math.max(0, batur(x)); y < 34; y++) {
          const g = (x - bx) / Math.max(1, y - 10);
          f.set(
            x,
            y,
            x < bx - 2
              ? P.baturLit
              : Math.abs((g * 2.6) % 1) < 0.25
                ? P.baturSh
                : P.batur
          );
        }
      // the lake
      for (let x = 0; x < PI_W; x++) {
        const y0 = 25 + Math.round(Math.max(0, (x - pc - 22) * 0.35));
        const y1 = 30 + Math.round(Math.sin(x / 7) * 1.2);
        for (let y = y0; y <= y1; y++)
          f.set(
            x,
            y,
            y === y0
              ? P.lakeSh
              : (y + Math.floor(x / 9)) % 4 === 0
                ? P.lakeHi
                : P.lake
          );
      }
      // soft clouds piled over Batur, and a bank across the middle
      for (let x = pc + 6; x < PI_W; x++) {
        const top = 3 + Math.round(fbm1(x / 6, 33) * 7 + (x - pc) * -0.05);
        const bot = 18 + Math.round(fbm1(x / 5, 34) * 8 + (x - pc - 6) * 0.12);
        for (let y = top; y < bot; y++)
          f.set(
            x,
            y,
            y - top < 2 ? P.bCloud : y > bot - 3 ? P.bCloudDk : P.bCloudSh
          );
      }
      for (let x = pc - 26; x < pc + 16; x++) {
        const top = 13 + Math.round(fbm1(x / 4, 35) * 4);
        for (let y = top; y < top + 3; y++)
          f.set(x, y, y === top ? P.bCloud : P.bCloudSh);
      }
      // the forest falling away below the viewpoint
      for (let y = 30; y < 50; y++)
        for (let x = 0; x < PI_W; x++) {
          const lakeEdge = 31 + Math.round(Math.sin(x / 7) * 1.2);
          if (y < lakeEdge) continue;
          const n = hash2(x >> 1, y >> 1, 36);
          let c = n > 0.72 ? P.forest2 : n < 0.3 ? P.forest0 : P.forest1;
          if (x < pc - 30 && y < 38 && hash2(x, y, 37) > 0.4) c = P.lava;
          f.set(x, y, c);
        }
      // the railing round the viewpoint, the mesh under it, the deck
      const railY = (x: number) => 37 + Math.round((x / PI_W) * 2);
      for (let x = 0; x < PI_W; x++) {
        const ry = railY(x);
        for (let y = ry + 9; y < 53; y++)
          f.set(x, y, (x + y) % 3 === 0 ? P.railSh : P.mesh);
        if (x % 3 === 0) f.vline(x, ry + 2, ry + 8, P.rail);
        f.set(x, ry, P.railHi);
        f.set(x, ry + 1, P.rail);
        f.set(x, ry + 8, P.railSh);
      }
      for (let y = 52; y < PI_H; y++)
        for (let x = 0; x < PI_W; x++) {
          const pave = x > pc + 26 + (y - 52) * 0.4;
          const plank = (x + Math.round(y * 1.6)) % 7 === 0;
          f.set(
            x,
            y,
            pave
              ? (x * 3 + y) % 11 === 0
                ? P.paveSh
                : P.pave
              : plank
                ? P.deckSh
                : y === 52
                  ? P.deckHi
                  : P.deck
          );
        }

      // ---- the six of them ----
      /** A head about the oval (cx, cy, rx, ry): hair, a beard, a smile. */
      const head = (
        cx: number,
        cy: number,
        rx: number,
        ry: number,
        o: Face
      ) => {
        const below = o.style === 'long' ? 14 : o.style === 'kid' ? 8 : 4;
        for (let y = Math.floor(cy - ry - 3); y <= cy + ry + below; y++)
          for (let x = Math.floor(cx - rx - 3); x <= cx + rx + 3; x++) {
            const nx = (x + 0.5 - cx) / rx;
            const ny = (y + 0.5 - cy) / ry;
            const e = nx * nx + ny * ny;
            const face = e <= 1;
            const ax = Math.abs(nx);
            let c: RGB | null = face ? (nx > 0.5 ? o.skinSh : o.skin) : null;
            let hair = false;
            switch (o.style) {
              case 'short':
                hair =
                  (e <= 1.15 && ny < -0.3 + 0.12 * Math.sin(nx * 8)) ||
                  (e <= 1.32 && ny < -0.75 && hash2(x, y, 38) > 0.45) ||
                  (face && ax > 0.82 && ny < 0.05);
                break;
              case 'shaggy':
                hair =
                  (e <= 1.38 && ny < -0.02 + 0.16 * Math.sin(nx * 6 + 1)) ||
                  (ax > 0.7 && e <= 1.45 && ny < 0.55);
                break;
              case 'long':
                hair =
                  (e <= 1.12 && ny < -0.42) ||
                  (ax >= 0.72 && e <= 1.25) ||
                  (ny > 0 && ax >= 0.8 && ax <= 1.4);
                break;
              case 'wavy':
                hair =
                  (e <= 1.18 && ny < -0.35) ||
                  (ax >= 0.72 &&
                    ny < 1.3 &&
                    ax <= 1.45 + 0.14 * Math.sin(ny * 7) &&
                    !(face && ax < 0.75));
                break;
              case 'kid':
                hair =
                  (e <= 1.14 && ny < -0.35) ||
                  (ax >= 0.7 &&
                    ax <= 1.3 &&
                    ny < 2.4 &&
                    (ny < 0.5 || ax > 0.8));
                break;
            }
            if (hair) c = nx < -0.25 && ny < -0.4 ? o.hairLit : o.hair;
            if (o.beard && face && (ny > 0.32 || (ny > 0.14 && ax < 0.5)))
              c = o.beard;
            if (
              o.sunnies &&
              e <= 1.25 &&
              ny >= -0.95 &&
              ny < -0.62 &&
              ax < 0.82
            )
              c = o.sunnies;
            if (c !== null) f.set(x, y, c);
          }
        if (o.sunnies) f.set(cx - rx * 0.4, cy - ry * 0.8, P.railHi);
        // a smile: eyes creased shut with it, and the mouth
        const ey = Math.round(cy - ry * 0.05);
        for (const s of [-1, 1]) {
          const ex = Math.round(cx + s * rx * 0.42 - 0.5);
          if (o.style === 'shaggy') continue; // under the fringe
          f.set(ex, ey, P.eye);
          if (rx >= 6) {
            f.set(ex - 1, ey + 1, P.eye);
            f.set(ex + 1, ey + 1, P.eye);
          }
        }
        const my = Math.round(cy + ry * 0.45);
        const mx = Math.round(cx - 0.5);
        if (o.grin) {
          // the big grin, teeth and all
          const mw = Math.max(2, Math.round(rx * 0.55));
          for (let x = -mw; x <= mw; x++) {
            f.set(mx + x, my - 1, P.teeth);
            f.set(mx + x, my, Math.abs(x) === mw ? P.mouth : P.teeth);
            if (Math.abs(x) < mw) f.set(mx + x, my + 1, P.mouth);
          }
        } else {
          // a smile: up at the corners
          f.set(mx - 1, my - 1, P.smile);
          f.set(mx, my, P.smile);
          f.set(mx + 1, my, P.smile);
          f.set(mx + 2, my - 1, P.smile);
        }
      };
      /** Shoulders and chest, from `top` down out of the picture. */
      const body = (
        cx: number,
        top: number,
        wide: number,
        top0: RGB,
        sh: RGB,
        lit: RGB,
        bare?: [RGB, RGB]
      ) => {
        for (let y = top; y < PI_H; y++) {
          const half = (wide / 2) * Math.min(1, 0.55 + (y - top) * 0.2);
          for (let x = Math.round(cx - half); x < cx + half; x++) {
            const u = (x - (cx - half)) / (2 * half);
            let c = u < 0.12 ? lit : u > 0.74 ? sh : top0;
            if (bare && y - top > 1 && (u < 0.15 || u > 0.85))
              c = u < 0.5 ? bare[0] : bare[1];
            f.set(x, y, c);
          }
        }
      };
      const neck = (cx: number, y0: number, y1: number, c: RGB) =>
        f.rect(cx - 2, y0, 3, y1 - y0 + 1, c);
      /** A thick limb along a few points. */
      const limb = (
        pts: [number, number][],
        width: number,
        c: RGB,
        sleeve?: [RGB, number]
      ) => {
        let n = 0;
        for (let i = 0; i + 1 < pts.length; i++) {
          const [ax, ay] = pts[i]!;
          const [bx2, by2] = pts[i + 1]!;
          const len = Math.max(1, Math.hypot(bx2 - ax, by2 - ay));
          for (let k = 0; k <= len; k++, n++) {
            const x = ax + ((bx2 - ax) * k) / len;
            const y = ay + ((by2 - ay) * k) / len;
            const col = sleeve && n < sleeve[1] ? sleeve[0] : c;
            for (let dy = 0; dy < width; dy++)
              for (let dx = 0; dx < width; dx++)
                f.set(
                  Math.round(x - width / 2 + dx),
                  Math.round(y - width / 2 + dy),
                  col
                );
          }
        }
      };

      // the tall one at the back, in a big white graphic tee
      neck(pc - 12, 34, 37, P.tallSkinSh);
      body(pc - 12, 37, 19, P.tallTop, P.tallTopSh, P.tallTop);
      for (const [dx, dy] of [
        [-3, 6],
        [-2, 5],
        [-1, 7],
        [0, 6],
        [1, 8],
        [2, 7],
        [-3, 9],
        [1, 10],
      ] as const)
        f.set(pc - 12 + dx, 37 + dy, P.tallPrint);
      head(pc - 12, 29.5, 4.2, 5, {
        hair: P.tallHair,
        hairLit: P.tallHairLit,
        skin: P.tallSkin,
        skinSh: P.tallSkinSh,
        style: 'shaggy',
      });
      // the girl, up high in the middle
      body(pc + 4, 35, 11, P.girlTop, P.girlTopSh, P.girlTop);
      head(pc + 4, 29, 3.8, 4.4, {
        hair: P.girlHair,
        hairLit: lerpRGB(P.girlHair, P.bCloud, 0.25),
        skin: P.girlSkin,
        skinSh: P.girlSkinSh,
        style: 'kid',
      });
      // the stocky one on the right, a hand on his hip
      neck(pc + 18, 41, 43, P.stockySkinSh);
      body(
        pc + 18,
        43,
        23,
        P.stockyTop,
        P.stockyTopSh,
        lerpRGB(P.stockyTop, P.bCloud, 0.3)
      );
      limb(
        [
          [pc + 27, 46],
          [pc + 32, 57],
          [pc + 26, 63],
        ],
        3,
        P.stockySkin,
        [P.stockyTopSh, 5]
      );
      head(pc + 18, 36.5, 4.4, 5.2, {
        hair: P.stockyHair,
        hairLit: P.stockyHairLit,
        skin: P.stockySkin,
        skinSh: P.stockySkinSh,
        style: 'short',
      });
      // the elder, in front of the girl, holding her hand up by her shoulder
      body(pc + 3, 52, 21, P.elderTop, P.elderTopSh, P.elderTop);
      neck(pc + 3, 49, 52, P.elderSkinSh);
      head(pc + 3, 45, 5, 5.8, {
        hair: P.elderHair,
        hairLit: P.elderHairLit,
        skin: P.elderSkin,
        skinSh: P.elderSkinSh,
        style: 'wavy',
        sunnies: P.sunnies,
      });
      limb(
        [
          [pc + 9, 66],
          [pc + 11, 59],
          [pc + 10, 53],
        ],
        3,
        P.elderSkin
      );
      f.rect(pc + 9, 51, 3, 2, P.girlSkin); // the little hand in hers
      // the woman on the left
      neck(pc - 29, 48, 51, P.womanSkinSh);
      body(pc - 29, 51, 19, P.womanDress, P.womanDressSh, P.womanDress, [
        P.womanSkin,
        P.womanSkinSh,
      ]);
      head(pc - 29, 43, 4.6, 6, {
        hair: P.womanHair,
        hairLit: P.womanHairLit,
        skin: P.womanSkin,
        skinSh: P.womanSkinSh,
        style: 'long',
      });
      // and the man, close to the camera, grinning, his arm out holding it
      limb(
        [
          [pc - 25, 72],
          [pc - 44, PI_H + 3],
        ],
        5,
        P.manSkin,
        [P.manTee, 6]
      );
      body(pc - 13, 69, 34, P.manTee, P.manTeeSh, P.manTeeLit);
      limb(
        [
          [pc - 3, 69],
          [pc - 22, PI_H + 2],
        ],
        2,
        P.strap
      );
      neck(pc - 13, 66, 69, P.manSkinSh);
      head(pc - 13, 58.5, 8, 9.5, {
        hair: P.manHair,
        hairLit: P.manHairLit,
        skin: P.manSkin,
        skinSh: P.manSkinSh,
        style: 'short',
        beard: P.manBeard,
        grin: true,
      });
      // the woman's hand on his shoulder
      f.rect(pc - 26, 70, 3, 2, P.womanSkin);
      f.set(pc - 26, 69, P.teeth);
    });

    /** The print: up out of the flash, a moment in the middle, then away. */
    function drawPrint(f: Frame, t: number) {
      const a = t - groupAt;
      const s0 = FA.photo + 60;
      const s1 = s0 + 520;
      const d1 = FA.drop + 560;
      if (a < s0 || a >= d1) return;
      const rest = Math.round(h / 2 - 6);
      const below = h + PH_H / 2 + 8;
      let pcx = cx + 0.5;
      let pcy = rest;
      let ang = -0.05;
      if (a < s1) {
        // up, overshooting a touch, and settling its tilt
        const u = span(a, s0, s1);
        const back = 1 + 2.4 * (u - 1) ** 3 + 1.4 * (u - 1) ** 2;
        pcy = below + (rest - below) * back;
        ang = -0.17 + 0.12 * ease(u);
      } else if (a >= FA.drop) {
        const u = span(a, FA.drop, d1);
        pcy = rest + (below + 12 - rest) * u * u;
        ang = -0.05 + 0.16 * u * u;
        pcx += 10 * u * u;
      }
      // the courtyard dims a little behind it
      const dim =
        0.34 * Math.min(span(a, s0, s0 + 300), 1 - span(a, FA.drop, d1));
      if (dim > 0) {
        const dr = (P.dim >> 16) & 0xff;
        const dg = (P.dim >> 8) & 0xff;
        const db = P.dim & 0xff;
        const px = f.pixels;
        for (let i = 0; i < px.length; i++) {
          const p = px[i]!;
          const r = p & 0xff;
          const g = (p >>> 8) & 0xff;
          const b = (p >>> 16) & 0xff;
          px[i] =
            (0xff000000 |
              (Math.round(b + (db - b) * dim) << 16) |
              (Math.round(g + (dg - g) * dim) << 8) |
              Math.round(r + (dr - r) * dim)) >>>
            0;
        }
      }
      const develop = ease(span(a, s0 + 80, s0 + 650));
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const hw = (Math.abs(PH_W * ca) + Math.abs(PH_H * sa)) / 2 + 4;
      const hh = (Math.abs(PH_W * sa) + Math.abs(PH_H * ca)) / 2 + 4;
      const x0 = Math.max(0, Math.floor(pcx - hw));
      const x1 = Math.min(w - 1, Math.ceil(pcx + hw));
      const y0 = Math.max(0, Math.floor(pcy - hh));
      const y1 = Math.min(h - 1, Math.ceil(pcy + hh));
      /** The point on the card under (x, y), or null off it. */
      const onCard = (x: number, y: number): [number, number] | null => {
        const dx = x + 0.5 - pcx;
        const dy = y + 0.5 - pcy;
        const u = dx * ca + dy * sa + PH_W / 2;
        const v = -dx * sa + dy * ca + PH_H / 2;
        return u >= 0 && u < PH_W && v >= 0 && v < PH_H
          ? [Math.floor(u), Math.floor(v)]
          : null;
      };
      // its shadow
      for (let y = y0; y <= y1 + 3; y++)
        for (let x = x0; x <= x1 + 2; x++)
          if (onCard(x - 2, y - 3) && !onCard(x, y)) f.blend(x, y, P.dim, 0.45);
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) {
          const uv = onCard(x, y);
          if (!uv) continue;
          const [u, v] = uv;
          const iu = u - PB;
          const iv = v - PB;
          let c: RGB;
          if (iu < 0 || iu >= PI_W || iv < 0 || iv >= PI_H)
            c = u === PH_W - 1 || v === PH_H - 1 ? P.paperSh : P.paper;
          else c = lerpRGB(P.paper, photo.get(iu, iv), develop);
          f.set(x, y, c);
        }
    }

    // ---------- effects ----------
    function puff(t: number, seed: number) {
      // Agung clears its throat: a lumpy column of ash and steam climbs, shears
      // off downwind into a cauliflower head, then lifts away and thins out
      fxBack.add(t, 7600, (f, age) => {
        const a = age / 1000;
        const top = 36 * (1 - Math.exp(-a * 1.2));
        const bottom = a > 3.4 ? (a - 3.4) * 8 : 0;
        const fade = Math.max(0, (a - 4.4) / 3.2);
        // each row's extent first, so the lumps can be lit on top and shaded underneath
        const rows: [number, number][] = [];
        for (let z = 0; z < top; z++) {
          const v = z / 36;
          const mx = agX + 1 + v * v * 7 + Math.sin(z / 5 + a) * 0.7;
          const head =
            top - z < 10 ? Math.sin(((top - z) / 10) * Math.PI) * 4 : 0;
          const lump = 0.7 + 0.6 * noise1(z / 2.6 - a * 1.3, seed);
          const r = (1.4 + z * 0.13 + head) * lump;
          rows.push([Math.round(mx - r), Math.round(mx + r)]);
        }
        for (let z = Math.floor(bottom); z < rows.length; z++) {
          const [x0, x1] = rows[z]!;
          const up = rows[z + 1];
          const down = rows[z - 1];
          const y = AG_TOP - 2 - z;
          for (let x = x0; x <= x1; x++) {
            if (fade > 0 && hash2(x, y, seed) < fade) continue;
            const u = (x - x0) / Math.max(1, x1 - x0);
            let c = u < 0.3 ? P.plume : u > 0.75 ? P.ash : P.plumeSh;
            if (!up || x < up[0] || x > up[1])
              c = u > 0.7 ? P.plumeSh : P.plume; // top of a lump
            else if (down && z > bottom + 1 && (x < down[0] || x > down[1]))
              c = P.ashSh; // its underside
            if (z < 7 && a < 2.2) c = u < 0.3 ? P.plumeSh : P.ashSh; // dark ash near the vent
            f.set(x, y, c);
          }
        }
        // a few cinders thrown out and falling back on the slopes
        if (age < 2200) {
          const s = age / 1000;
          for (let k = 0; k < 7; k++) {
            const y = AG_TOP - 3 - 20 * s + 22 * s * s;
            if (y < AG_TOP + 8)
              f.set(agX + (hash2(k, 5, seed) - 0.5) * 30 * s, y, P.ashSh);
          }
        }
      });
    }

    function shimmer(t: number, x: number, y: number, seed: number) {
      shimmerAt = t;
      // motes of gold rising up through the gap from the top step, and rings on the mirror floor below
      fx.add(t, 2600, (f, age) => {
        const a = age / 1000;
        for (let k = 0; k < 24; k++) {
          const s = a - hash2(k, 1, seed) * 0.7;
          if (s < 0 || s > 1.8) continue;
          const mx =
            innerL +
            1 +
            hash2(k, 2, seed) * (G - 3) +
            Math.sin(s * 5 + k) * 1.5;
          const my =
            THRESH -
            4 -
            hash2(k, 3, seed) * 14 -
            s * (22 + hash2(k, 4, seed) * 30);
          if (my > THRESH - 1) continue;
          const c = k % 3 ? P.shine : P.shine2;
          f.set(mx, my, c);
          if (s < 0.6) f.set(mx, my + 1, P.shine2);
          // the motes' reflections in the floor
          const ry = FLOOR + (FLOOR - 1 - my) / 2.2;
          if (ry < h) f.blend(mx, ry, c, 0.6);
        }
      });
      sparkle(fx, t, x, y, P.shine);
      ripple(fx, t + 150, cx, FLOOR + 6, P.shine2, {
        rings: 3,
        size: G * 0.8,
        squash: 0.25,
      });
    }

    function petals(t: number, tx: number, seed: number) {
      const near = blooms.filter((b) => Math.abs(b.x - tx) < 24);
      const pick = near.length ? near : blooms;
      // all nine in one effect, so a few quick clicks can't push earlier
      // petals out of the effect list halfway down
      const fall = Array.from({ length: 9 }, (_, i) => {
        const b = pick[Math.floor(hash2(i, 1, seed) * pick.length)]!;
        return {
          b,
          delay: i * 140,
          fallFor: 2400 + hash2(i, 2, seed) * 1600,
          ground: FLOOR + 2 + Math.round(hash2(i, 3, seed) * (h - FLOOR - 6)),
          drift: (hash2(i, 4, seed) - 0.5) * 30,
        };
      });
      const total = Math.max(...fall.map((p) => p.delay + p.fallFor + 2600));
      fx.add(t, total, (f, all) => {
        fall.forEach(({ b, delay, fallFor, ground, drift }, i) => {
          const age = all - delay;
          if (age < 0 || age >= fallFor + 2600) return;
          const s = Math.min(1, age / fallFor);
          const x = b.x + drift * s + Math.sin(age / 260 + i) * 2.5;
          const y = b.y + (ground - b.y) * s;
          const spin = Math.floor(age / 160 + i) % 3;
          if (age > fallFor + 2000 && Math.floor(age / 80) % 2) return;
          if (s >= 1) {
            bloom(f, Math.round(x), Math.round(y), i % 4 === 0);
            return;
          }
          const c = i % 4 === 0 ? P.bloomPink : P.bloom;
          f.set(x, y, P.bloomEye);
          f.set(x + (spin === 0 ? 1 : 0), y + (spin === 1 ? 1 : 0), c);
          f.set(x - (spin === 2 ? 1 : 0), y - (spin === 0 ? 1 : 0), c);
        });
      });
    }

    function egrets(t: number, x: number, y: number) {
      // a skein of egrets flying out over the valley
      const dir = x < cx ? 1 : -1;
      fxBack.add(t, 9000, (f, age) => {
        const a = age / 1000;
        for (let i = 0; i < 7; i++) {
          const rank = Math.ceil(i / 2);
          const sideK = i % 2 ? 1 : -1;
          const X = Math.round(x + dir * a * 22 - dir * rank * 5);
          const Y = Math.round(
            y + rank * 3 * sideK - a * 2 + Math.sin(a * 2 + i) * 0.6
          );
          const up = Math.floor(age / 160 + i) % 3;
          const wy = up === 0 ? 2 : up === 1 ? 0 : -1;
          f.set(X, Y, P.bloom);
          f.set(X + dir, Y, P.bloomEye);
          f.set(X - 1, Y - (up === 0 ? 1 : 0), P.bloom);
          f.set(X + 1, Y - (up === 0 ? 1 : 0), P.bloom);
          f.set(X - 2, Y - wy, P.bloomSh);
          f.set(X + 2, Y - wy, P.bloomSh);
        }
      });
    }

    // ---------- hit areas ----------
    const inGap = (x: number, y: number) =>
      x >= innerL && x < innerR && y > 8 && y < THRESH - 10;
    const onPoser = (x: number, y: number) => {
      const p = poser(lastT);
      return (
        p.visible &&
        x >= p.x - 3 &&
        x <= p.x + 5 &&
        y >= THRESH - 12 &&
        y <= THRESH + 1
      );
    };
    const onGate = (x: number, y: number) => {
      if (x >= innerL && x < innerR) return false;
      const d = x < cx ? innerL - 1 - x : x - innerR;
      if (d < 0 || d >= HW || y >= FLOOR) return false;
      // rough: the half narrows towards the top
      const v = (FLOOR - y) / GATE_H;
      return d < HW * (v < 0.4 ? 0.95 : 1.25 * (1 - v));
    };
    const onAgung = (x: number, y: number) =>
      y < SEA_TOP - 2 && y >= agTop(x) - 2 && !onGate(x, y);
    // the light-filled parts of the gap: the sky above the summit, the clouds and steps below
    const gapLight = (x: number, y: number) => inGap(x, y) && !onAgung(x, y);
    let puffAt = -Infinity;
    const onTree = (x: number, y: number) =>
      [treeL, treeR, ...extraTrees].some(
        (tx) => Math.abs(x - tx) < 20 && y > FLOOR - 46 && y < FLOOR
      );

    const onWallR = (x: number, y: number) =>
      x >= wallR0 &&
      y >= WALL_TOP - 1 &&
      y < FLOOR &&
      Math.abs(x - penjorR) > 2 &&
      ![treeR, ...extraTrees].some((tx) => Math.abs(x - tx - 1) < 4);
    const onScooter = (x: number, y: number) =>
      Math.hypot(x - SCX, y - SCY) <= 8;
    const onJeep = (x: number, y: number, t: number) => {
      const j = idleJeep(t);
      return !!j && Math.hypot(x - (j[0] - j[2]), y - j[1]) <= 7;
    };
    // the frangipani nearest the wall gag: the jolt shakes it
    const shookTree = [treeR, ...extraTrees].reduce((p, q) =>
      Math.abs(q - HX) < Math.abs(p - HX) ? q : p
    );

    const L = {
      clouds: runsOf(cloudLayer),
      mountain: runsOf(mountain),
      cloudSea: runsOf(cloudSea),
      hills: runsOf(hills),
      temple: runsOf(temple),
    };

    return {
      render(f, t, pointer) {
        lastT = t;
        f.copyFrom(sky);
        blit(f, cloudLayer, L.clouds, t / 1600);
        drawBirds(f, t);
        // the morning star, the last one left
        const sx = Math.round(cx + Math.min(150, w * 0.34));
        const tw = Math.sin(t / 900);
        f.set(sx, 10, P.shine);
        if (tw > 0.2) {
          f.blend(sx - 1, 10, P.shine, 0.6);
          f.blend(sx + 1, 10, P.shine, 0.6);
          f.blend(sx, 9, P.shine, 0.6);
          f.blend(sx, 11, P.shine, 0.6);
        }
        blit(f, mountain, L.mountain);
        drawIdleJeep(f, t);
        // Agung always breathes a thin plume
        smoke(f, agX + 1, AG_TOP - 1, t, [P.plume, P.plumeSh], {
          height: 16,
          drift: 12,
          width: 2,
          density: 0.45,
        });
        fxBack.draw(f, t);
        blit(f, cloudSea, L.cloudSea, t / 2400);
        blit(f, hills, L.hills);
        // the light in the gap brightens for a moment when it's poked, or when hovered
        const hover =
          pointer &&
          (gapLight(pointer.x, pointer.y) || onPoser(pointer.x, pointer.y))
            ? 1
            : 0;
        const sh = t - shimmerAt;
        const lit = sh >= 0 && sh < 1200;
        if (hover || lit) {
          const a = Math.max(hover * 0.14, lit ? 0.35 * (1 - sh / 1200) : 0);
          for (let y = 16; y < THRESH; y++)
            for (let x = innerL; x < innerR; x++)
              f.blend(
                x,
                y,
                P.shine,
                a * (1 - Math.abs(x - cx + 0.5) / (G / 2 + 1))
              );
        }
        blit(f, temple, L.temple);
        drawWallGag(f, t);
        drawQueue(f, t);
        drawPoser(f, t);
        for (const o of offerings) {
          for (let k = 0; k < 11; k++) {
            const sway =
              Math.sin(k * 0.55 - t / 420 + o.x) * (0.3 + k * 0.22) + k * 0.15;
            f.blend(
              o.x + sway,
              o.y - k,
              k < 5 ? P.incense : P.incense2,
              0.55 * (1 - k / 11)
            );
          }
        }
        drawPenjor(f, penjorL, -1, t, 1);
        drawPenjor(f, penjorR, 1, t, 2);
        // the floor: a mirror of everything above, squashed a little and faintly rippled
        for (let y = FLOOR; y < h; y++) {
          const d = y - FLOOR;
          const sy = FLOOR - 1 - Math.floor(d * 2.2);
          const wob = Math.round(
            Math.sin(d * 0.9 + t / 600) * (d > 4 ? 0.6 : 0)
          );
          const fade = 0.76 - d * 0.009;
          const joint = d === 3 || d === 8 || d === 15 || d === 24;
          for (let x = 0; x < w; x++) {
            const src = f.get(x + wob, Math.max(0, sy));
            f.set(x, y, lerpRGB(P.floorTint, src, joint ? fade * 0.75 : fade));
          }
        }
        // a bright line where the floor meets the foot of the gate
        f.hline(0, w, FLOOR, lerpRGB(P.floorTint, P.floorHi, 0.35));
        // then what stands on the floor, back to front
        drawScooter(f, t);
        drawCar(f, t);
        drawOwner(f, t, false);
        drawSorry(f, t);
        drawBang(f, t);
        drawBricks(f, t);
        drawDust(f, t);
        groupLight(f, t);
        drawGroup(f, t);
        drawCarrier(f, t);
        fx.draw(f, t);
        drawBurst(f, t);
        sunrise(f, t);
        flash(f, t);
        drawPrint(f, t);
        shake(f, t);
      },
      poke(x, y, t) {
        const seed = Math.floor(t) % 997;
        if (onPoser(x, y)) {
          if (t - jumpAt > 800) jumpAt = t;
          return;
        }
        // the easter eggs ignore clicks while they're playing out
        if (onScooter(x, y)) {
          if (!groupBusy(t)) {
            groupAt = t;
            // when she's lifted up, the frangipani either side let go of their flowers too
            petals(t + FA.high, treeL, seed);
            petals(t + FA.high + 150, treeR, seed + 1);
          }
          return;
        }
        const j = idleJeep(t);
        if (j && onJeep(x, y, t)) {
          sunAt = t;
          sunTap = [j[0], j[1]];
          return;
        }
        if (onWallR(x, y)) {
          if (!wallBusy(t)) {
            wallAt = t;
            // the jolt shakes flowers off the nearest frangipani, and the egrets out of it
            petals(t + CW.bump + 80, shookTree, seed);
            egrets(t + CW.bump + 40, shookTree, FLOOR - 42);
          }
          return;
        }
        if (onAgung(x, y)) {
          if (t - puffAt > 2500) {
            puffAt = t;
            puff(t, seed);
          }
          return;
        }
        if (gapLight(x, y) || (y >= FLOOR && Math.abs(x - cx) < G)) {
          if (y >= FLOOR)
            ripple(fx, t, x, y, P.shine2, { rings: 3, size: 10, squash: 0.3 });
          shimmer(t, x, Math.min(y, h - 2), seed);
          return;
        }
        if (onTree(x, y)) {
          petals(t, x, seed);
          return;
        }
        if (y >= FLOOR) {
          ripple(fx, t, x, y, P.shine2, { rings: 3, size: 12, squash: 0.3 });
          return;
        }
        if (y < SEA_TOP && !onGate(x, y)) egrets(t, x, y);
      },
      eggs(t) {
        // (none is listed while it's playing: a click then is ignored, not restarted)
        const out = [];
        // the patched stretch of the courtyard wall
        if (!wallBusy(t)) out.push({ id: 'suv', x: HX, y: WALL_TOP + 6, r: 8 });
        // the jeep crawling up the volcano
        const j = idleJeep(t);
        if (j) out.push({ id: 'sunrise', x: j[0] - j[2], y: j[1], r: 7 });
        // the scooter by the wall
        if (!groupBusy(t)) out.push({ id: 'scooter', x: SCX, y: SCY, r: 8 });
        return out;
      },
      hot(x, y) {
        return (
          onPoser(x, y) ||
          onScooter(x, y) ||
          onJeep(x, y, lastT) ||
          onWallR(x, y) ||
          gapLight(x, y) ||
          onTree(x, y) ||
          onAgung(x, y) ||
          y >= FLOOR ||
          (y < SEA_TOP && !onGate(x, y))
        );
      },
    };
  },
};
