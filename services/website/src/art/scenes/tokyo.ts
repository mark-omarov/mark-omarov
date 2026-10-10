// Tokyo at night, from street level under the JR tracks: izakaya glowing in
// the brick arches, Yamanote trains rattling overhead, Tokyo Tower lit up
// behind it all, and the big cat on the screen down the road. A rider on a
// black-and-red motorbike passes now and then. Something big lives behind
// the skyline.
//
// Asleep, only the glowing plates of its back show over a roof: poke them
// and it rears up and roars. Click the sky for fireworks (a few in a row
// wake it too), the tower to switch its lighting, the cat to say hi, the
// tracks for a train, the road for a taxi or the rider, a shop to make the
// lanterns swing. The little pedestrians-only sign is an easter egg: click
// it and a cop rides up on his bicycle, pulls the rider over, points at the
// "7-8:30" plate under the sign and hands over a ticket.

import { type Frame, lerpRGB, type RGB, sprite } from '../frame';
import { firework, Fx, sparkle } from '../fx';
import { hash2 } from '../noise';
import { clouds, glow, gradient, smoke, stars } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';
import {
  type Beacon,
  blinkBeacons,
  skyline,
  skytree,
  tokyoTower,
  type TowerStyle,
} from '../things/city';

const P = palette({
  sky0: '#06071a',
  sky1: '#0c0c26',
  sky2: '#161236',
  sky3: '#241848',
  sky4: '#3a1c58',
  sky5: '#561f60',
  sky6: '#742a66',
  haze: '#a03c74',
  star: '#8f8cc4',
  starHi: '#d8d4ff',
  cloudLight: '#c06090',
  cloudBase: '#5e3170',
  cloudShadow: '#3a2352',
  farBody: '#2f2152',
  farEdge: '#3c2b62',
  farDark: '#261a46',
  farWin: '#7c5ca6',
  midBody: '#1b1536',
  midEdge: '#2a2250',
  midDark: '#13102a',
  winWarm: '#f6c56f',
  winWarm2: '#ffe3a6',
  winCool: '#9cc4ff',
  beacon: '#ff3b3b',
  // tower, landmark light
  towerLit: '#ff7a2a',
  towerHi: '#ffbe73',
  towerDark: '#c84a1a',
  towerGlow: '#ff8a4a',
  // tower, diamond veil
  veilLit: '#7fb8ff',
  veilHi: '#e6f2ff',
  veilDark: '#3d64d8',
  veilGlow: '#6fa0ff',
  deck: '#ffd9a0',
  deckHi: '#fffbea',
  deckDark: '#4a2236',
  mastRed: '#ff3b30',
  mastWhite: '#ffe9d6',
  treeBody: '#8a6ae0',
  treeLit: '#c8b4ff',
  treeDeck: '#f0e8ff',
  neonPink: '#ff4fa3',
  neonCyan: '#46e6ff',
  neonYellow: '#ffe14d',
  neonRed: '#ff4a3d',
  signDark: '#0f0c22',
  // screen
  screen: '#18284e',
  screenHi: '#2c4a86',
  screenEdge: '#0a0f22',
  catWhite: '#f4efe6',
  catShade: '#c9c0b4',
  catOrange: '#f0a040',
  catBlack: '#2a2430',
  catEye: '#3a8a5a',
  catNose: '#ff8fa8',
  heart: '#ff5a8a',
  // viaduct
  wire: '#2c2446',
  pole: '#3a3058',
  rail: '#8a7fa8',
  girder: '#221b38',
  girderHi: '#3b3160',
  brick: '#4c2428',
  brickHi: '#5e2e2e',
  brickDark: '#36181e',
  mortar: '#2c1418',
  voussoir: '#6e3532',
  // train (E235: steel with the Yamanote green)
  trainRoof: '#5d6274',
  trainHi: '#e3e7ef',
  trainBody: '#b5bac7',
  trainShade: '#878c9c',
  trainGreen: '#8ad13c',
  trainWin: '#fff1c9',
  trainWinDim: '#e8cf96',
  trainPeople: '#6b5a4a',
  trainSkirt: '#2c2c3a',
  trainBogie: '#18161f',
  headlight: '#ffffff',
  taillight: '#ff3040',
  // shops
  lampTop: '#ffd88a',
  lampMid: '#f0a24e',
  lampLow: '#c4692e',
  shelf: '#5a3020',
  bottleA: '#3e8a4a',
  bottleB: '#8a4a20',
  bottleC: '#e8e0d0',
  menu: '#fff4dc',
  menuInk: '#7a3020',
  counter: '#4a2616',
  counterHi: '#a0603a',
  people: '#2e1a1e',
  shirt: '#d8ccc0',
  norenBlue: '#263a78',
  norenBlueHi: '#3a56a0',
  norenRed: '#b8282a',
  norenRedHi: '#d8443c',
  norenInk: '#f4ecdc',
  lantern: '#e8402e',
  lanternHi: '#ffa070',
  lanternDark: '#8a1e1e',
  lanternCap: '#1e1418',
  ramenTop: '#fff0c0',
  ramenMid: '#f8d488',
  steam: '#f4e8d8',
  steam2: '#c8b8b0',
  barBg: '#24143a',
  barBg2: '#341c4e',
  barNeon: '#ff5ec4',
  barNeon2: '#7af0ff',
  door: '#1a1024',
  shutter: '#3e3e56',
  shutterHi: '#55557a',
  shutterDark: '#2c2c40',
  // street
  vend: '#e8f0ff',
  vendBody: '#c03030',
  vendBody2: '#2a5ab0',
  sidewalk: '#2e2440',
  sidewalkHi: '#3e3254',
  curb: '#4a3e62',
  road: '#141022',
  roadLine: '#5a5070',
  walker: '#120c1c',
  taxi: '#26346a',
  taxiHi: '#4a5c9c',
  taxiWin: '#0c0e1c',
  taxiSign: '#ffd84a',
  // the rider and the bike
  helmet: '#0e0e16',
  helmetHi: '#4a4a62',
  visor: '#5a4cf0',
  visorHi: '#46d0ff',
  hoodie: '#1c1c26',
  hoodieHi: '#3c3c52',
  logo: '#ff8a30',
  jeans: '#2c4a86',
  jeansHi: '#4a6ab0',
  sneaker: '#e8e8f0',
  bikeBlack: '#0a0a10',
  bikeHi: '#565668',
  bikeRed: '#e0242c',
  engine: '#2c2c38',
  tyre: '#060608',
  hub: '#8a8a9c',
  // the omawari-san and the sign
  cop: '#1c2a5e',
  copHi: '#34488e',
  copCap: '#141e46',
  badge: '#f0c848',
  skin: '#e2a888',
  copPants: '#141a3a',
  baton: '#ff3a3a',
  batonHi: '#ffb0a0',
  ticket: '#5aa0ff',
  pad: '#f4f0e8',
  signBlue: '#2456d8',
  signWhite: '#f4f6fa',
  signInk: '#16182a',
  signPole: '#8a8aa0',
  // the neighbour behind the skyline
  kaiju: '#20382e',
  kaijuHi: '#3e6a50',
  kaijuRim: '#c86a9a',
  kaijuDark: '#101c18',
  plate: '#2e5244',
  plateGlow: '#7af0ff',
  plateGlowHi: '#e8ffff',
  kEye: '#ffe14d',
  kTooth: '#ece6d4',
  kMouth: '#5a1428',
  plane: '#ff4040',
  planeGreen: '#40ff80',
  planeWhite: '#ffffff',
});

const RAIL = 101; // train wheels sit here
const CROWN = 111; // top of the arch openings
const SPRING = 117; // where the arches start to curve
const GROUND = 136; // sidewalk
const ROAD = 139;
const BAY = 36; // one arch plus its pier
const PIER = 6;
const GLASS = 18; // the bar's neon cocktail glass, from the arch's left edge

type ShopKind = 'izakaya' | 'ramen' | 'bar' | 'shutter' | 'tachinomi';
type Shop = {
  kind: ShopKind;
  x0: number;
  x1: number;
  seed: number;
  light: RGB;
};

const KINDS: ShopKind[] = [
  'izakaya',
  'ramen',
  'bar',
  'izakaya',
  'shutter',
  'tachinomi',
  'izakaya',
  'bar',
  'ramen',
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

// 5x5 kanji for the shop boards: 中 大 山 田 日 本 ラ
const KANJI = [
  ['..#..', '#####', '#.#.#', '#####', '..#..'],
  ['..#..', '#####', '..#..', '.#.#.', '#...#'],
  ['..#..', '#.#.#', '#.#.#', '#.#.#', '#####'],
  ['#####', '#.#.#', '#####', '#.#.#', '#####'],
  ['.###.', '.#.#.', '.###.', '.#.#.', '.###.'],
  ['..#..', '#####', '.###.', '#.#.#', '..#..'],
  ['####.', '.....', '#####', '...#.', '..#..'],
];

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

/** `shift` moves each row sideways, so a glyph on cloth can sway with it. */
function glyph(
  f: Frame,
  x: number,
  y: number,
  c: RGB,
  seed: number,
  shift: (y: number) => number = () => 0
) {
  const g = GLYPHS[Math.floor(hash2(seed, 7, 5) * GLYPHS.length)]!;
  for (let i = 0; i < 9; i++) {
    const gy = y + Math.floor(i / 3);
    if (g[i]) f.set(x + (i % 3) + shift(gy), gy, c);
  }
}

/** A vertical neon sign: dark panel, bright border, stacked glyphs. */
function neonSign(
  f: Frame,
  x: number,
  top: number,
  len: number,
  c: RGB,
  on: boolean,
  seed: number
) {
  f.rect(x, top, 5, len, P.signDark);
  const border = on ? c : P.midEdge;
  f.vline(x, top, top + len - 1, border);
  f.vline(x + 4, top, top + len - 1, border);
  f.hline(x, x + 4, top, border);
  f.hline(x, x + 4, top + len - 1, border);
  if (!on) return;
  for (let gy = top + 2, k = 0; gy + 3 < top + len; gy += 4, k++)
    glyph(f, x + 1, gy, c, seed * 13 + k);
}

/** Top of an arch opening at column x. */
function archY(x: number, s: Shop) {
  const half = (s.x1 - s.x0 + 1) / 2;
  const u = (x + 0.5 - s.x0 - half) / half;
  return Math.round(
    SPRING - (SPRING - CROWN) * Math.sqrt(Math.max(0, 1 - u * u))
  );
}

const CAT = [
  '.o..........k.',
  '.oo........kk.',
  '.ooo......kkk.',
  'oooowwwwwwkkkk',
  'owwwwwwwwwwwkk',
  'wwweewwwweewww',
  'wwweewwwweewww',
  'swwwwwwnwwwwws',
  '.swwwwmwmwwws.',
  '..sswwwwwwss..',
];
const CAT_BLINK = ['wwwwwwwwwwwwww', 'wwbbwwwwwbbwww'];
const CAT_MEOW = ['.swwwwmmmwwws.', '..sswwmmwwss..'];

// The rider on the bike at street scale (a person is ~10px here), facing right.
// The wheels are drawn separately so they can turn: rear axle at column 3,
// front at 13, both on the second row from the bottom.
const RIDER = [
  '.......hH.......',
  '......hhhV......',
  '......hhvv......',
  '.......kK.......',
  '......kkkK......',
  '......kokkkg....',
  '..t.jjJkbbbBm...',
  '..rbbjJbrrbbbl..',
  '...bbsjbeebbB...',
  '...b.ss.eeb..b..',
  '........eb....b.',
];
const RIDER_PAL = () => ({
  h: P.helmet,
  H: P.helmetHi,
  v: P.visor,
  V: P.visorHi,
  k: P.hoodie,
  K: P.hoodieHi,
  o: P.logo,
  g: P.hoodie,
  j: P.jeans,
  J: P.jeansHi,
  s: P.sneaker,
  b: P.bikeBlack,
  B: P.bikeHi,
  r: P.bikeRed,
  e: P.engine,
  m: P.bikeHi,
  t: P.taillight,
  l: P.headlight,
});

// 3x5 digits for the time plate under the sign
const DIGITS: Record<string, string[]> = {
  '7': ['###', '..#', '.#.', '.#.', '.#.'],
  '8': ['###', '#.#', '###', '#.#', '###'],
  '3': ['###', '..#', '###', '..#', '###'],
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  '-': ['...', '...', '###', '...', '...'],
  ':': ['.', '#', '.', '#', '.'],
};

// The kaiju that lives behind the skyline, facing left. Head and shoulders
// only: the buildings in front hide the rest.
const KAIJU = [
  '..................p.......',
  '...............p..pp..p...',
  '...............pp.pppppp..',
  '..........rrrrrrppppppp...',
  '.......rrrHHHHHHbpppppp.p.',
  '.....rrHHbbbbbbbbbpppppp..',
  '....rHHbbbbbbbbbbbbbpppp..',
  '...rHbbbdddbbbbbbbbbbppp..',
  '..rHbbbbeedbbbbbbbbbbbpp..',
  '.rHbbbbbbbbbbbbbbbbbbbbp..',
  'rHbbbbbbbbbbbbbbbbbbbbbbd.',
  'rnbbbbbbbbbbbbbbbbbbbbbbd.',
  'dbbbbbbbbbbbbbbbbbbbbbbbd.',
  'dtdtdtdtdbbbbbbbbbbbbbbbd.',
];
const KAIJU_JAW = [
  '.dtdtdtddbbbbbbbbbbbbbbbbd',
  '..ddddddbbbbbbbbbbbbbbbbbd',
  '....ddddbbbbbbbbbbbbbbbbbd',
  '.......dbbbbbbbbbbbbbbbbbd',
];
// Asleep, it lies low behind the roofs: just the plates down its back show
// over them, lit edges (h) on dark plates (p).
const CREST = [
  '...h.......',
  '..hph......',
  '..hph..h...',
  'h.hpph.hph.',
  'phhpphhpphh',
  'ppppppppppp',
];

export const tokyo: Scene = {
  id: 'tokyo',
  name: 'Tokyo',
  country: 'Japan',
  create(w, h) {
    const towerX = Math.round(w * 0.5 + Math.min(72, w * 0.15));
    const treeX = Math.round(w * 0.5 - Math.min(150, w * 0.37));
    const catX = Math.round(w * 0.5 - Math.min(64, w * 0.15)) - 13;
    const towerH = 100;
    const fx = new Fx();
    let beacons: Beacon[] = [];
    const signs: {
      x: number;
      top: number;
      len: number;
      c: RGB;
      seed: number;
    }[] = [];

    // arches: piers on a fixed rhythm, centred so the middle bay sits under the tower
    const shops: Shop[] = [];
    const first = (((towerX - BAY / 2) % BAY) - BAY) % BAY;
    for (let x = first, i = 0; x < w; x += BAY, i++) {
      const kind = KINDS[(i + 3) % KINDS.length]!;
      const light =
        kind === 'bar'
          ? P.barNeon
          : kind === 'ramen'
            ? P.ramenMid
            : kind === 'shutter'
              ? P.shutterHi
              : P.lampMid;
      shops.push({ kind, x0: x + PIER, x1: x + BAY - 1, seed: i + 1, light });
    }

    const sky = layer(w, h, (f) => {
      gradient(f, 0, RAIL, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
      ]);
      f.rect(0, RAIL, w, h - RAIL, P.sky6);
      stars(f, 4, Math.round(w / 12), 48, 0, [P.star], false);
      glow(f, w / 2, RAIL, w * 0.8, P.haze, 0.55, 0.22, 0.12);
    });
    const cloudLayer = layer(w, h, (f) => {
      clouds(f, {
        seed: 12,
        y0: 16,
        y1: 40,
        cell: 8,
        coverage: 0.34,
        stretch: 4,
        litFromBelow: true,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });
    const far = layer(w, h, (f) => {
      skyline(
        f,
        RAIL,
        {
          body: P.farBody,
          edge: P.farEdge,
          dark: P.farDark,
          windows: [P.farWin],
          litShare: 0.22,
        },
        { seed: 2, minH: 10, maxH: 40, minW: 6, maxW: 14 }
      );
      skytree(f, treeX, RAIL, 86, {
        body: P.treeBody,
        lit: P.treeLit,
        deck: P.treeDeck,
      });
    });
    const mid = layer(w, h, (f) => {
      const style = {
        body: P.midBody,
        edge: P.midEdge,
        dark: P.midDark,
        windows: [P.winWarm, P.winWarm, P.winWarm2, P.winCool],
        litShare: 0.3,
      };
      // keep the tower's legs clear: tall blocks either side, low ones in front
      const gap = Math.round(towerH * 0.13) + 5;
      beacons = beacons.concat(
        skyline(f, RAIL, style, {
          seed: 7,
          minH: 14,
          maxH: 52,
          minW: 8,
          maxW: 18,
          x1: towerX - gap,
        }),
        skyline(f, RAIL, style, {
          seed: 9,
          minH: 14,
          maxH: 56,
          minW: 8,
          maxW: 18,
          x0: towerX + gap,
        })
      );
      // the building with the big screen
      f.rect(catX, 44, 26, RAIL - 44, P.midBody);
      f.vline(catX, 44, RAIL, P.midEdge);
      f.vline(catX + 25, 44, RAIL, P.midDark);
      for (let y = 70; y < RAIL - 1; y += 2)
        for (let x = catX + 3; x < catX + 23; x += 3)
          if (hash2(x, y, 4) < 0.45) f.set(x, y, P.winWarm);
      // vertical neon on the building sides
      const neon = [P.neonPink, P.neonCyan, P.neonYellow, P.neonRed];
      // the lowest roof over the 5 columns at sx (a 1px gap between two
      // blocks doesn't count), so a sign can hang off a wall below it
      const roofOver = (sx: number) => {
        let roof = 0;
        let gaps = 0;
        for (let k = 0; k < 5; k++) {
          let y = 0;
          while (y < RAIL && !f.opaque(sx + k, y)) y++;
          if (y === RAIL && gaps++ === 0) continue;
          roof = Math.max(roof, y);
        }
        return roof;
      };
      const clear = (sx: number) =>
        sx >= 0 &&
        sx < w - 6 &&
        Math.abs(sx - towerX) >= gap + 4 &&
        !(sx > catX - 6 && sx < catX + 30);
      for (
        let x = 10 + Math.round(hash2(0, 0, 3) * 20);
        x < w - 6;
        x += 44 + Math.round(hash2(x, 0, 3) * 40)
      ) {
        const top = RAIL - 30 + Math.round(hash2(x, 2, 3) * 8);
        const len = 14 + Math.round(hash2(x, 1, 3) * 8);
        // slide it along to the nearest wall it can hang from whole, else
        // shorten it under a low roof, else leave it out
        let best: { sx: number; top: number } | null = null;
        for (let d = 0; d <= 24; d++) {
          const sx = x + (d % 2 ? -(d + 1) / 2 : d / 2);
          if (!clear(sx)) continue;
          const hung = Math.max(top, roofOver(sx) + 2);
          if (hung === top) {
            best = { sx, top };
            break;
          }
          if (top + len - hung >= 10 && (!best || hung < best.top))
            best = { sx, top: hung };
        }
        if (!best) continue;
        signs.push({
          x: best.sx,
          top: best.top,
          len: top + len - best.top,
          c: neon[Math.floor(hash2(x, 3, 3) * 4)]!,
          seed: x,
        });
      }
    });

    const near = layer(w, h, (f) => {
      // catenary: poles on every other pier, a messenger wire and a contact wire
      for (const s of shops) {
        if (s.seed % 2) continue;
        const px = s.x0 - 3;
        f.vline(px, 84, RAIL, P.pole);
        f.hline(px - 3, px + 1, 86, P.pole);
      }
      for (let x = 0; x < w; x++) {
        const sag = Math.round(
          Math.sin(((x - shops[0]!.x0 + 3) / (BAY * 2)) * Math.PI) ** 2 * 1.5
        );
        f.set(x, 85 + sag, P.wire);
        f.set(x, 88, P.wire);
      }
      // deck and girder
      f.hline(0, w, RAIL, P.rail);
      f.rect(0, RAIL + 1, w, 5, P.girder);
      f.hline(0, w, RAIL + 1, P.girderHi);
      // brick face
      for (let y = RAIL + 6; y < GROUND; y++) {
        for (let x = 0; x < w; x++) {
          const row = Math.floor((y - RAIL - 6) / 3);
          const joint =
            (y - RAIL - 6) % 3 === 2 || (x + (row % 2) * 3) % 6 === 0;
          f.set(
            x,
            y,
            joint
              ? P.mortar
              : hash2(x >> 1, row, 8) > 0.8
                ? P.brickHi
                : hash2(x, row, 9) > 0.85
                  ? P.brickDark
                  : P.brick
          );
        }
      }
      // openings
      for (const s of shops) drawShop(f, s);
      // shop names on boards above some arches
      for (const s of shops) {
        if (s.kind === 'shutter') continue;
        const cx = Math.round((s.x0 + s.x1) / 2);
        const by = RAIL + 7;
        const [board, ink] =
          s.kind === 'bar'
            ? [P.signDark, P.barNeon2]
            : s.kind === 'ramen'
              ? [P.norenRed, P.menu]
              : [P.menu, P.menuInk];
        // an even width, so it centres on the arch (cx is its right-hand middle)
        f.rect(cx - 7, by - 1, 14, 7, board);
        f.hline(cx - 7, cx + 6, by + 5, P.mortar);
        kanji(f, cx - 6, by, ink, s.seed * 2);
        kanji(f, cx + 1, by, ink, s.seed * 2 + 1);
      }
      // sidewalk and road
      f.rect(0, GROUND, w, ROAD - GROUND, P.sidewalk);
      f.hline(0, w, GROUND, P.sidewalkHi);
      f.hline(0, w, ROAD - 1, P.curb);
      f.rect(0, ROAD, w, h - ROAD, P.road);
      for (let x = 0; x < w; x += 12) f.hline(x, x + 5, h - 3, P.roadLine);
      // light spilling out of the arches onto the pavement and the wet road
      for (const s of shops) {
        if (s.kind === 'shutter') continue;
        for (let x = s.x0 + 1; x < s.x1; x++) {
          for (let y = GROUND + 1; y < ROAD - 1; y++)
            f.blend(x, y, s.light, 0.2);
          // streaks in the wet road, broken by the ripples
          if (hash2(x, 0, s.seed) < 0.45) continue;
          const strength = 0.2 + hash2(x, 1, s.seed) * 0.2;
          for (let y = ROAD + 1; y < h; y++) {
            if ((y - ROAD) % 3 === 0) continue;
            const d = (y - ROAD) / (h - ROAD);
            f.blend(
              x,
              y,
              s.light,
              strength * (d < 0.4 ? 1 : d < 0.75 ? 0.6 : 0.3)
            );
          }
        }
      }
      // vending machines against a couple of piers
      for (const s of shops) {
        if (s.seed % 3 !== 1) continue;
        vending(f, s.x0 - PIER, s.seed % 2 ? P.vendBody : P.vendBody2);
      }
      // beer crates and a drinker outside the standing bars
      for (const s of shops) {
        if (s.kind !== 'tachinomi') continue;
        const x = s.x1 - 9;
        f.rect(x, GROUND - 4, 5, 4, P.lantern);
        f.hline(x, x + 4, GROUND - 4, P.lanternHi);
        f.rect(x + 1, GROUND - 11, 3, 7, P.people);
        f.rect(x + 1, GROUND - 14, 3, 3, P.people);
      }
    });

    function vending(f: Frame, x: number, body: RGB) {
      const top = GROUND - 12;
      f.rect(x - 1, top, 8, 12, body);
      f.rect(x, top + 1, 6, 6, P.vend);
      for (let r = 0; r < 3; r++)
        for (let k = 0; k < 3; k++)
          f.set(
            x + k * 2 + (r % 2),
            top + 2 + r * 2,
            [P.neonRed, P.bottleA, P.norenBlue, P.catOrange][(r + k) % 4]!
          );
      f.rect(x + 1, top + 9, 4, 1, P.door);
      glow(f, x + 3, GROUND + 1, 9, P.vend, 0.3, 0.35, 0.2);
    }

    function drawShop(f: Frame, s: Shop) {
      const cx = (s.x0 + s.x1) / 2;
      // voussoirs: a ring of lighter brick around the opening
      for (let x = s.x0 - 1; x <= s.x1 + 1; x++) {
        const y = archY(Math.min(s.x1, Math.max(s.x0, x)), s);
        f.vline(x, y - 2, y - 1, P.voussoir);
      }
      for (let x = s.x0; x <= s.x1; x++) {
        const top = archY(x, s);
        for (let y = top; y < GROUND; y++) {
          let c: RGB;
          switch (s.kind) {
            case 'shutter': {
              c = (y - top) % 2 === 0 ? P.shutterHi : P.shutter;
              if (y > GROUND - 3) c = P.shutterDark;
              break;
            }
            case 'bar':
              c = y < SPRING + 4 ? P.barBg2 : P.barBg;
              break;
            case 'ramen':
              c =
                y < SPRING + 3
                  ? P.ramenTop
                  : y < SPRING + 10
                    ? P.ramenMid
                    : P.lampMid;
              break;
            default:
              c =
                y < SPRING + 2
                  ? P.lampTop
                  : y < SPRING + 9
                    ? P.lampMid
                    : P.lampLow;
          }
          f.set(x, y, c);
        }
      }
      if (s.kind === 'shutter') {
        f.rect(Math.round(cx) - 1, GROUND - 4, 3, 1, P.shutterDark);
        return;
      }
      if (s.kind === 'bar') {
        // a door, a window with a neon cocktail glass
        f.rect(s.x0 + 3, SPRING + 2, 7, GROUND - SPRING - 2, P.door);
        f.set(s.x0 + 8, SPRING + 10, P.barNeon2);
        const gx = s.x0 + GLASS; // clear of a sign plate on the next pier
        const gy = SPRING + 5;
        f.hline(gx - 3, gx + 3, gy, P.barNeon);
        f.line(gx - 3, gy, gx, gy + 3, P.barNeon);
        f.line(gx + 3, gy, gx, gy + 3, P.barNeon);
        f.vline(gx, gy + 3, gy + 6, P.barNeon);
        f.hline(gx - 2, gx + 2, gy + 6, P.barNeon);
        f.set(gx + 2, gy - 2, P.barNeon2);
        f.set(gx + 1, gy - 1, P.barNeon2);
        return;
      }
      // the back wall: a shelf of bottles and paper menus
      const shelfY = SPRING + 3;
      f.hline(s.x0 + 1, s.x1 - 1, shelfY, P.shelf);
      for (let x = s.x0 + 2; x < s.x1 - 1; x += 2)
        if (hash2(x, 1, s.seed) > 0.3)
          f.vline(
            x,
            shelfY - 2,
            shelfY - 1,
            [P.bottleA, P.bottleB, P.bottleC][
              Math.floor(hash2(x, 2, s.seed) * 3)
            ]!
          );
      for (let x = s.x0 + 2; x < s.x1 - 1; x += 2) {
        if (hash2(x, 3, s.seed) < 0.35) continue;
        f.vline(x, shelfY + 2, shelfY + 5, P.menu);
        f.set(x, shelfY + 3 + Math.floor(hash2(x, 4, s.seed) * 2), P.menuInk);
      }
      // counter and the regulars sitting at it
      const counterY = GROUND - 7;
      f.rect(s.x0, counterY, s.x1 - s.x0 + 1, GROUND - counterY, P.counter);
      f.hline(s.x0, s.x1, counterY, P.counterHi);
      const standing = s.kind === 'tachinomi';
      for (
        let x = s.x0 + 3;
        x < s.x1 - 3;
        x += 6 + Math.floor(hash2(x, 5, s.seed) * 4)
      ) {
        if (hash2(x, 6, s.seed) < 0.25) continue;
        const headY = counterY - (standing ? 9 : 6);
        f.rect(
          x,
          headY + 3,
          4,
          counterY - headY - 3,
          hash2(x, 7, s.seed) > 0.6 ? P.shirt : P.people
        );
        f.rect(x + 1, headY, 3, 3, P.people);
      }
    }

    /** `swing` is how far the panels sway: some under the pointer, dying away after a click. */
    function drawNoren(f: Frame, s: Shop, t: number, swing: number) {
      if (s.kind === 'shutter' || s.kind === 'bar') return;
      const ramen = s.kind === 'ramen';
      const [cloth, clothHi] = ramen
        ? [P.norenRed, P.norenRedHi]
        : [P.norenBlue, P.norenBlueHi];
      const rod = SPRING - 1;
      const len = s.kind === 'tachinomi' ? 4 : 7;
      f.hline(s.x0, s.x1, rod, P.counter);
      const panels = Math.max(3, Math.floor((s.x1 - s.x0 + 1) / 6));
      const pw = (s.x1 - s.x0 + 1) / panels;
      for (let p = 0; p < panels; p++) {
        const px0 = Math.round(s.x0 + p * pw);
        const px1 = Math.round(s.x0 + (p + 1) * pw) - 2;
        const sway = Math.round(Math.sin(t / 160 + p) * swing);
        const off = (y: number) => Math.round(sway * ((y - rod) / len));
        for (let y = rod + 1; y <= rod + len; y++)
          f.hline(
            px0 + off(y),
            px1 + off(y),
            y,
            y === rod + 1 ? clothHi : cloth
          );
        // the name on the middle panels, inside the cloth even when it's short
        if (Math.abs(p - (panels - 1) / 2) <= 1)
          glyph(
            f,
            px0 + 1,
            rod + Math.min(3, len - 2),
            P.norenInk,
            s.seed * 3 + p,
            off
          );
      }
    }

    function lantern(f: Frame, x: number, y: number) {
      f.hline(x + 1, x + 2, y, P.lanternCap);
      f.rect(x, y + 1, 4, 4, P.lantern);
      f.vline(x + 1, y + 1, y + 4, P.lanternHi);
      f.vline(x + 3, y + 1, y + 4, P.lanternDark);
      f.hline(x + 1, x + 2, y + 5, P.lanternCap);
      glow(f, x + 1.5, y + 3, 7, P.lantern, 0.32, 1, 0.2);
    }

    // traffic, people, the cat, the trains
    const walkers = Array.from(
      { length: Math.max(2, Math.round(w / 110)) },
      (_, i) => ({
        offset: hash2(i, 0, 41) * (w + 20),
        speed: (0.008 + hash2(i, 1, 41) * 0.008) * (i % 2 ? 1 : -1),
        tall: hash2(i, 2, 41) > 0.5 ? 1 : 0,
      })
    );
    const TRAIN_EVERY = 15_000;
    const CAR = 40;
    const CARS = 6;
    const TRAIN_SPEED = 0.16;
    let trainCalledAt = -Infinity;
    let veil = false;
    let meowAt = -Infinity;
    const swingAt = new Map<number, number>();
    // the road: taxis, the rider passing, and (click the sign) the rider
    // getting pulled over at the pedestrians-only sign
    type RoadKind = 'taxi' | 'rider' | 'ticket';
    type RoadRun = { kind: RoadKind; s: number; dir: 1 | -1 };
    let called: RoadRun | null = null;
    let calls = 0;
    const RIDER_PASS = 5200;
    // the ticket, start to finish: the cop rides in on his bicycle, the
    // rider turns up a moment later and gets pulled over, the cop points at
    // the sign, writes it up and hands it over, the rider rides off, then
    // the cop leaves
    const COP_IN = 2800;
    const RIDER_AT = 1400;
    const RIDE_IN = 2600;
    const STOPPED = 8200;
    const RIDE_OFF = 2600;
    const COP_OFF_AT = RIDER_AT + RIDE_IN + STOPPED + 700;
    const COP_OFF = 2600;
    const TICKET = COP_OFF_AT + COP_OFF;
    const runLength = (kind: RoadKind) =>
      kind === 'taxi' ? 3500 : kind === 'rider' ? RIDER_PASS : TICKET;
    const ROAD_CYCLE = 84_000;
    const SLOTS: [number, RoadKind, 1 | -1][] = [
      [2000, 'taxi', 1],
      [9000, 'rider', 1],
      [18_000, 'taxi', -1],
      [27_000, 'taxi', 1],
      [46_000, 'taxi', 1],
      [55_000, 'rider', -1],
      [64_000, 'taxi', -1],
      [73_000, 'taxi', 1],
    ];
    /** What's on the road right now, or null when it's clear. */
    function roadAt(t: number): RoadRun | null {
      if (called && t >= called.s && t < called.s + runLength(called.kind))
        return called;
      const n = Math.floor(t / ROAD_CYCLE);
      const local = t - n * ROAD_CYCLE;
      for (const [at, kind, dir] of SLOTS) {
        if (local < at || local >= at + runLength(kind)) continue;
        const start = n * ROAD_CYCLE + at;
        // a scheduled one that would have started while a called one was
        // out never comes, rather than popping up halfway down the road
        if (
          called &&
          start >= called.s &&
          start < called.s + runLength(called.kind)
        )
          return null;
        return { kind, s: start, dir };
      }
      return null;
    }

    function trainAt(t: number) {
      const len = CARS * (CAR + 1);
      const dur = (w + len) / TRAIN_SPEED;
      let start = Math.floor(t / TRAIN_EVERY) * TRAIN_EVERY + 4000;
      let dir = Math.floor(t / TRAIN_EVERY) % 2 ? -1 : 1;
      if (t - trainCalledAt < dur) {
        start = trainCalledAt;
        dir = 1;
      }
      const p = t - start;
      if (p < 0 || p > dur) return null;
      const lead = -len + p * TRAIN_SPEED; // left edge of the train going right
      return { x: dir === 1 ? lead : w - lead - len, dir };
    }

    function drawTrain(f: Frame, x0: number, dir: number, t: number) {
      const top = RAIL - 12;
      for (let c = 0; c < CARS; c++) {
        const x = Math.round(x0 + c * (CAR + 1));
        if (x > w || x + CAR < 0) continue;
        const leading = dir === 1 ? c === CARS - 1 : c === 0;
        const trailing = dir === 1 ? c === 0 : c === CARS - 1;
        f.rect(x, top, CAR, 1, P.trainRoof);
        f.rect(x, top + 1, CAR, 1, P.trainHi);
        f.rect(x, top + 2, CAR, 1, P.trainGreen);
        f.rect(x, top + 3, CAR, 6, P.trainBody);
        f.rect(x, top + 8, CAR, 1, P.trainShade);
        f.rect(x, top + 9, CAR, 1, P.trainGreen);
        f.rect(x, top + 10, CAR, 1, P.trainSkirt);
        // bogies
        f.rect(x + 3, top + 11, 7, 1, P.trainBogie);
        f.rect(x + CAR - 10, top + 11, 7, 1, P.trainBogie);
        // windows with standing passengers, doors in green frames; four
        // bays that fill the car with a pixel of body at each end
        for (let k = 0; k < 4; k++) {
          const dx = x + 1 + k * 10;
          f.rect(dx, top + 3, 2, 7, P.trainGreen);
          f.rect(dx + 1, top + 4, 1, 4, P.trainWinDim);
          f.rect(dx + 4, top + 4, 4, 3, P.trainWin);
          if (hash2(c, k, 61) > 0.4)
            f.rect(
              dx + 5 + Math.floor(hash2(c, k, 62) * 3),
              top + 5,
              1,
              2,
              P.trainPeople
            );
        }
        // pantograph on every other car, touching the contact wire
        if (c % 2 === 1) {
          const px = x + CAR / 2;
          f.line(px - 3, top - 1, px, 89, P.pole);
          f.line(px + 3, top - 1, px, 89, P.pole);
          f.hline(px - 2, px + 2, 88, P.trainShade);
          // the odd spark off the wire
          if (hash2(c, Math.floor(t / 90), 63) > 0.93)
            f.set(px + 1, 87, P.neonCyan);
        }
        if (leading || trailing) {
          const nose =
            dir === 1 ? (leading ? x + CAR - 1 : x) : leading ? x : x + CAR - 1;
          f.vline(nose, top, top + 1, P.sky6);
          f.vline(nose, top + 3, top + 6, P.taxiWin);
          f.set(nose, top + 8, leading ? P.headlight : P.taillight);
          if (leading)
            glow(f, nose + dir * 3, top + 8, 6, P.headlight, 0.4, 0.6, 0.2);
        }
      }
    }

    function drawCat(f: Frame, t: number) {
      const sx = catX + 3;
      const sy = 48;
      f.rect(sx - 1, sy - 1, 22, 16, P.screenEdge);
      // the screen cycles: a slow colour wash, then the cat looks in
      const phase = (t % 14_000) / 14_000;
      const meow = t - meowAt < 1400;
      const catOn = meow || (phase > 0.25 && phase < 0.9);
      for (let y = 0; y < 14; y++)
        for (let x = 0; x < 20; x++)
          f.set(
            sx + x,
            sy + y,
            (y + Math.floor(t / 200)) % 7 === 0 ? P.screenHi : P.screen
          );
      if (!catOn) {
        // ad loop: bars sweeping across
        for (let x = 0; x < 20; x++) {
          const v = Math.sin(x * 0.5 + t / 300);
          if (v > 0.2)
            f.vline(
              sx + x,
              sy + 4 + Math.round(v * 3),
              sy + 12,
              [P.neonPink, P.neonCyan, P.neonYellow][x % 3]!
            );
        }
        return;
      }
      // the cat rises into view and peeks at the street
      const rise = meow ? 0 : Math.max(0, Math.round((0.32 - phase) * 60));
      const look = Math.round(Math.sin(t / 900));
      const blink = !meow && t % 3200 < 160;
      const rows = CAT.slice();
      if (blink) {
        rows[5] = CAT_BLINK[0]!;
        rows[6] = CAT_BLINK[1]!;
      }
      if (meow) {
        rows[8] = CAT_MEOW[0]!;
        rows[9] = CAT_MEOW[1]!;
      }
      const pal = {
        o: P.catOrange,
        k: P.catBlack,
        w: P.catWhite,
        s: P.catShade,
        e: P.catEye,
        n: P.catNose,
        m: P.catBlack,
        b: P.catShade,
      };
      const cy = sy + 4 + rise;
      for (let ry = 0; ry < rows.length; ry++) {
        const yy = cy + ry;
        if (yy < sy || yy >= sy + 14) continue;
        sprite(f, [rows[ry]!], sx + 3 + look, yy, pal);
      }
      if (meow) {
        const a = (t - meowAt) / 1400;
        const hy = Math.round(sy - 2 - a * 10);
        sprite(f, ['.h.h.', 'hhhhh', '.hhh.', '..h..'], sx + 16, hy, {
          h: P.heart,
        });
      }
    }

    /** Where the taxi is, or null when it isn't out. */
    function taxiAt(t: number) {
      const run = roadAt(t);
      if (!run || run.kind !== 'taxi') return null;
      const p = (t - run.s) / 3500;
      const { dir } = run;
      const x = Math.round(
        dir === 1 ? -30 + p * (w + 60) : w + 30 - p * (w + 60)
      );
      return { x, dir };
    }

    function drawTaxi(f: Frame, t: number) {
      const taxi = taxiAt(t);
      if (!taxi) return;
      const { x, dir } = taxi;
      const y = ROAD + 2;
      f.rect(x, y + 3, 26, 4, P.taxi);
      f.hline(x + 1, x + 24, y + 3, P.taxiHi);
      f.rect(x + 5, y, 16, 3, P.taxi);
      f.hline(x + 6, x + 19, y, P.taxiHi);
      f.rect(x + 7, y + 1, 5, 2, P.taxiWin);
      f.rect(x + 14, y + 1, 5, 2, P.taxiWin);
      f.set(dir === 1 ? x + 18 : x + 7, y + 2, P.taillight); // the red vacancy sign
      f.rect(x + 11, y - 2, 4, 2, P.taxiSign);
      f.hline(x + 1, x + 24, y + 5, P.taxiWin);
      f.rect(x + 3, y + 7, 4, 1, P.trainBogie);
      f.rect(x + 19, y + 7, 4, 1, P.trainBogie);
      const front = dir === 1 ? x + 25 : x;
      const back = dir === 1 ? x : x + 25;
      f.set(front, y + 4, P.headlight);
      f.set(back, y + 4, P.taillight);
      glow(f, front + dir * 7, y + 5, 9, P.winWarm2, 0.4, 0.4, 0.2);
      // reflection in the wet road
      for (let k = 0; k < 4; k++)
        f.blend(front + dir * k, h - 2 + (k % 2), P.winWarm2, 0.4 - k * 0.08);
    }

    // the pedestrians-only sign, on a shuttered arch if there's one near
    // the right of centre, else on a pier without a vending machine
    const shutters = shops.filter(
      (s) => s.kind === 'shutter' && s.x0 > w * 0.12 && s.x1 < w * 0.92
    );
    const signX = shutters.length
      ? Math.round(
          shutters.reduce((a, b) =>
            Math.abs((a.x0 + a.x1) / 2 - w * 0.62) <
            Math.abs((b.x0 + b.x1) / 2 - w * 0.62)
              ? a
              : b
          ).x0 + 9
        )
      : shops
          .filter((s) => s.seed % 3 !== 1)
          .reduce((a, b) =>
            Math.abs(a.x0 - w * 0.62) < Math.abs(b.x0 - w * 0.62) ? a : b
          ).x0 - 3;
    // the cop stands clear of the plate, even after stepping up to the curb
    const copX = signX + 15;
    // rear axle when the rider's pulled over: the helmet between the sign's
    // pole and the cop, not under either of them
    const stopX = signX + 1;
    const BIKE_G = h - 2;

    const SIGN_Y = GROUND - 20; // centre of the disc
    /** The pedestrians-only sign: small, up on its pole, easy to miss. */
    function drawSign(f: Frame) {
      f.vline(signX, SIGN_Y, GROUND - 1, P.signPole);
      f.disc(signX, SIGN_Y, 4, (dx, dy) =>
        dx * dx + dy * dy > 12 ? P.signWhite : P.signBlue
      );
      // a walking figure
      sprite(f, ['.w.', 'www', '.w.', 'w.w'], signX - 1, SIGN_Y - 2, {
        w: P.signWhite,
      });
      // the little plate under it, too small to read from here
      f.rect(signX - 4, SIGN_Y + 6, 9, 4, P.signWhite);
      for (let x = signX - 3; x <= signX + 3; x++)
        if (x !== signX - 1 && x !== signX + 2) f.set(x, SIGN_Y + 7, P.signInk);
      f.hline(signX - 3, signX + 3, SIGN_Y + 8, P.signInk);
    }

    /** What the cop points at: the plate, up close. */
    function drawCallout(f: Frame, age: number) {
      const text = '7-8:30';
      const tw = [...text].reduce(
        (n, ch) => n + DIGITS[ch]![0]!.length + 1,
        -1
      );
      const bw = 7 + 2 + tw + 6;
      const bh = 11;
      const bx = Math.round(signX - bw / 2);
      // pops up a pixel, then settles
      const by = SIGN_Y - 7 - bh - (age < 120 ? 1 : 0);
      f.rect(bx, by, bw, bh, P.signWhite);
      f.hline(bx, bx + bw - 1, by, P.signInk);
      f.hline(bx, bx + bw - 1, by + bh - 1, P.signInk);
      f.vline(bx, by, by + bh - 1, P.signInk);
      f.vline(bx + bw - 1, by, by + bh - 1, P.signInk);
      // the tail, down to the sign
      f.set(signX - 1, by + bh, P.signInk);
      f.set(signX, by + bh, P.signWhite);
      f.set(signX + 1, by + bh, P.signInk);
      f.set(signX, by + bh + 1, P.signInk);
      // the sign's face and the time on its plate
      f.disc(bx + 6, by + 5, 3, (dx, dy) =>
        dx * dx + dy * dy > 6 ? P.signWhite : P.signBlue
      );
      f.set(bx + 6, by + 4, P.signWhite);
      f.set(bx + 6, by + 5, P.signWhite);
      f.disc(bx + 6, by + 5, 3, (dx, dy) =>
        dx * dx + dy * dy > 7 && dx * dx + dy * dy <= 10 ? P.signInk : null
      );
      let x = bx + 12;
      for (const ch of text) {
        const g = DIGITS[ch]!;
        sprite(
          f,
          g.map((r) => r.replaceAll('#', 'x')),
          x,
          by + 3,
          { x: P.signInk }
        );
        x += g[0]!.length + 1;
      }
    }

    /** The rider on the bike; x is the rear axle, g the bottom of the tyres. */
    function drawRider(
      f: Frame,
      x: number,
      g: number,
      dir: 1 | -1,
      spin: number,
      moving: boolean
    ) {
      const rx = dir === 1 ? x : x + 10;
      const fx2 = dir === 1 ? x + 10 : x;
      for (const [wx, ph] of [
        [rx, 0],
        [fx2, 1.7],
      ] as const) {
        f.disc(wx, g - 2, 2, (dx, dy) =>
          dx * dx + dy * dy > 1.5 ? P.tyre : null
        );
        f.set(wx, g - 2, P.hub);
        const a = spin + ph;
        f.set(
          wx + Math.round(Math.cos(a) * 2),
          g - 2 + Math.round(Math.sin(a) * 2),
          P.bikeRed
        );
      }
      sprite(
        f,
        RIDER,
        dir === 1 ? x - 3 : x - 2,
        g - 12,
        RIDER_PAL(),
        dir === -1
      );
      const head = dir === 1 ? x + 11 : x - 1;
      if (moving) {
        glow(f, head + dir * 6, g - 4, 7, P.winWarm2, 0.22, 0.4, 0.1);
        for (let k = 0; k < 3; k++)
          f.blend(head + dir * k, h - 1, P.winWarm2, 0.35 - k * 0.08);
      }
      // the tail light in the wet road
      f.blend(dir === 1 ? x - 2 : x + 12, h - 1, P.taillight, 0.35);
    }

    /** Where the rider is on a ticket run, and what's going on. */
    function ticketState(at: number) {
      const a = at - RIDER_AT;
      if (a < 0) return { x: -40, phase: 'wait' as const, u: 0 };
      if (a < RIDE_IN) {
        const u = a / RIDE_IN;
        const x = -20 + (stopX + 20) * (1 - (1 - u) ** 2);
        return { x, phase: 'in' as const, u };
      }
      if (a < RIDE_IN + STOPPED)
        return {
          x: stopX,
          phase: 'stopped' as const,
          u: (a - RIDE_IN) / STOPPED,
        };
      const u = Math.min(1, (a - RIDE_IN - STOPPED) / RIDE_OFF);
      return { x: stopX + (w + 30 - stopX) * u * u, phase: 'off' as const, u };
    }

    function drawRoadRider(f: Frame, t: number) {
      const run = roadAt(t);
      if (!run || run.kind === 'taxi') return;
      const a = t - run.s;
      if (run.kind === 'rider') {
        const p = a / RIDER_PASS;
        const x = run.dir === 1 ? -20 + p * (w + 40) : w + 10 - p * (w + 40);
        drawRider(f, Math.round(x), BIKE_G, run.dir, -t / 60, true);
        return;
      }
      const st = ticketState(a);
      if (st.phase === 'wait' || st.x > w + 20) return;
      // pull over towards the curb while stopped
      const g = BIKE_G - (st.phase === 'stopped' ? 1 : 0);
      const moving = st.phase !== 'stopped';
      const spin =
        st.phase === 'in'
          ? -((stopX + 20) * (1 - (1 - st.u) ** 2)) / 2
          : st.phase === 'stopped'
            ? -(stopX + 20) / 2
            : -(stopX + 20 + (w + 30 - stopX) * st.u * st.u) / 2;
      drawRider(f, Math.round(st.x), g, 1, spin, moving);
      // a nervous little sweat drop while the cop writes
      if (st.phase === 'stopped' && st.u > 0.15 && st.u < 0.8) {
        const k = Math.floor(t / 400) % 3;
        f.set(Math.round(st.x) + 7, g - 12 + k, P.visorHi);
      }
    }

    /**
     * The omawari-san's white bicycle, with him on it or parked on its
     * stand. x is the rear axle; dir is the way it faces.
     */
    function drawCopBike(
      f: Frame,
      x: number,
      dir: 1 | -1,
      t: number,
      riding: boolean
    ) {
      const g = GROUND - 1;
      const X = (dx: number) => (dir === 1 ? x + dx : x + 9 - dx);
      for (const wx of [X(0), X(9)]) {
        f.disc(wx, g - 2, 2, (dx, dy) =>
          dx * dx + dy * dy > 1.5 ? P.tyre : null
        );
        f.set(wx, g - 2, P.hub);
      }
      f.line(X(0), g - 2, X(4), g - 2, P.signWhite);
      f.line(X(4), g - 2, X(3), g - 6, P.signWhite);
      f.line(X(3), g - 5, X(8), g - 5, P.signWhite);
      f.line(X(4), g - 2, X(8), g - 5, P.signWhite);
      f.line(X(8), g - 5, X(9), g - 2, P.signWhite);
      f.set(X(8), g - 6, P.hub);
      f.set(X(7), g - 7, P.hub);
      // the white box on the carrier, and the lamp
      f.rect(Math.min(X(-1), X(1)), g - 8, 3, 3, P.signWhite);
      f.set(X(0), g - 7, P.signPole);
      f.set(X(10), g - 5, P.headlight);
      if (riding) glow(f, X(13), g - 4, 5, P.winWarm2, 0.25, 0.5, 0.1);
      if (!riding) {
        f.set(X(3), g - 6, P.signInk); // the saddle
        f.set(X(5), g, P.hub); // the stand
        return;
      }
      // him, pedalling
      const pedal = Math.floor(t / 140) % 2;
      f.line(X(3), g - 6, X(4 + pedal), g - 2, P.copPants);
      f.rect(Math.min(X(2), X(4)), g - 11, 3, 5, P.cop);
      f.set(X(3), g - 10, P.copHi);
      f.line(X(4), g - 10, X(7), g - 8, P.cop);
      f.rect(Math.min(X(2), X(4)), g - 13, 3, 2, P.skin);
      f.rect(Math.min(X(2), X(4)), g - 14, 3, 1, P.copCap);
      f.hline(Math.min(X(2), X(5)), Math.max(X(2), X(5)), g - 13, P.copCap);
      f.set(X(3), g - 14, P.badge);
    }

    /** The omawari-san: only around when there's a ticket to write. */
    function drawCop(f: Frame, t: number) {
      const run = roadAt(t);
      if (run?.kind !== 'ticket') return;
      const a = t - run.s;
      const park = copX + 5; // his bike, on the side he came from
      if (a < COP_IN) {
        const u = 1 - (1 - a / COP_IN) ** 2;
        drawCopBike(f, Math.round(w + 14 + (park - w - 14) * u), -1, t, true);
        return;
      }
      if (a >= COP_OFF_AT) {
        const u = ((a - COP_OFF_AT) / COP_OFF) ** 2;
        drawCopBike(f, Math.round(park + (w + 14 - park) * u), 1, t, true);
        return;
      }
      drawCopBike(f, park, -1, t, false);
      const st = ticketState(a);
      // he steps up to the curb while writing
      const step =
        st.phase === 'stopped' ? Math.min(2, Math.floor(st.u * 20)) : 0;
      const x = copX - step;
      const top = GROUND - 11;
      f.rect(x, top, 3, 1, P.copCap);
      f.hline(x - 1, x + 2, top + 1, P.copCap);
      f.set(x + 1, top, P.badge);
      f.rect(x, top + 2, 3, 2, P.skin);
      f.rect(x, top + 4, 3, 4, P.cop);
      f.vline(x + 1, top + 4, top + 7, P.copHi);
      f.set(x, top + 8, P.copPants);
      f.set(x + 2, top + 8, P.copPants);
      f.set(x, top + 9, P.copPants);
      f.set(x + 2, top + 9, P.copPants);
      f.set(x, top + 10, P.signInk);
      f.set(x + 2, top + 10, P.signInk);
      const batonAt = (bx: number, by: number, up: boolean) => {
        const pulse = 0.25 + 0.1 * Math.sin(t / 160);
        glow(f, bx, by + (up ? -2 : 2), 5, P.baton, pulse, 0.5, 0.25);
        if (up) f.vline(bx, by - 4, by - 1, P.baton);
        else f.vline(bx, by + 1, by + 3, P.baton);
        f.set(bx, up ? by - 4 : by + 3, P.batonHi);
      };
      if (st.phase === 'wait' || st.phase === 'in') {
        // waving the rider over
        const wave = Math.round(Math.sin(t / 110));
        f.vline(x + 3, top + 4, top + 6, P.cop);
        f.set(x - 1, top + 4, P.cop);
        f.set(x - 2, top + 4 + wave, P.skin);
        batonAt(x - 2, top + 4 + wave, true);
        return;
      }
      if (st.phase === 'stopped') {
        if (st.u < 0.4) {
          // "see the sign?": pointing up at it, and there's the plate
          f.line(x - 1, top + 4, x - 3, top + 2, P.cop);
          f.set(x - 4, top + 1, P.skin);
          batonAt(x + 3, top + 6, false);
          if (st.u > 0.03) drawCallout(f, (st.u - 0.03) * STOPPED);
          return;
        }
        if (st.u < 0.72) {
          // writing it up
          f.rect(x - 1, top + 5, 2, 2, P.pad);
          const jig = Math.floor(t / 130) % 2;
          f.set(x + 1 + jig, top + 5, P.skin);
          batonAt(x + 3, top + 6, false);
          return;
        }
        if (st.u < 0.88) {
          // handing over the blue ticket
          const u = Math.min(1, (st.u - 0.72) / 0.14);
          f.hline(x - 2, x - 1, top + 5, P.cop);
          const tx = Math.round(x - 3 - u * 3);
          const ty = Math.round(top + 5 + u * 4);
          f.rect(tx, ty, 2, 2, P.ticket);
          batonAt(x + 3, top + 6, false);
          return;
        }
      }
      // a salute as the rider rides off
      f.set(x - 1, top + 3, P.skin);
      f.set(x - 1, top + 4, P.cop);
      f.vline(x + 3, top + 4, top + 6, P.cop);
      batonAt(x + 3, top + 6, false);
    }

    // the kaiju: peeks over the skyline now and then, and fireworks wake it
    // it hides where the skyline's low enough to peek over: right of the
    // tower if there's room, else left of it, away from the cat's screen
    const roofs = Array.from({ length: w }, (_, x) => {
      for (let y = 0; y < RAIL; y++)
        if (mid.pixels[y * w + x]! >>> 24) return y;
      return RAIL;
    });
    const spots = (from: number, to: number, clearOfSigns: boolean) => {
      const out: number[] = [];
      for (let x = Math.max(4, from); x <= Math.min(w - 32, to); x++)
        if (
          (x + 28 < catX - 4 || x > catX + 30) &&
          !(clearOfSigns && signs.some((n) => n.x > x - 5 && n.x < x + 27))
        )
          out.push(x);
      return out;
    };
    let candidates = spots(towerX + 24, w, true);
    if (!candidates.length) candidates = spots(0, towerX - 52, true);
    // a phone is too narrow to keep clear of the neon too: let a sign hang
    // in front of it rather than have nowhere to hide
    if (!candidates.length) candidates = spots(towerX + 24, w, false);
    if (!candidates.length) candidates = spots(0, towerX - 52, false);
    if (!candidates.length) candidates = [Math.max(4, towerX - 52)];
    // the tallest roof in front of its head: pick the spot where that's lowest
    const roofTop = (x: number) => Math.min(...roofs.slice(x + 1, x + 25));
    const kaijuX = candidates.reduce((a, b) =>
      roofTop(b) > roofTop(a) ? b : a
    );
    const peekY = Math.max(24, roofTop(kaijuX) - 14);
    const KAIJU_UP = 11_000;
    let kaijuCalledAt = -Infinity;
    let roarAt = -Infinity;
    const booms: number[] = [];
    function kaijuStart(t: number) {
      if (t - kaijuCalledAt < KAIJU_UP) return kaijuCalledAt;
      const every = 97_000;
      const s0 = Math.floor((t - 47_000) / every) * every + 47_000;
      // a visit due while a woken one was up is skipped, rather than
      // popping up fully risen the moment that one has sunk
      if (s0 < kaijuCalledAt + KAIJU_UP && kaijuCalledAt < s0 + KAIJU_UP)
        return null;
      return t - s0 < KAIJU_UP ? s0 : null;
    }
    function kaijuTop(t: number) {
      const s0 = kaijuStart(t);
      if (s0 === null) return null;
      const a = t - s0;
      if (a < 0) return null;
      const rise =
        a < 1800
          ? 1 - (1 - a / 1800) ** 2
          : a > KAIJU_UP - 2000
            ? ((KAIJU_UP - a) / 2000) ** 2
            : 1;
      return { y: Math.round(RAIL + 4 - rise * (RAIL + 4 - peekY)), a, s0 };
    }
    function drawKaiju(f: Frame, t: number) {
      drawCrest(f, t);
      const k = kaijuTop(t);
      if (!k) return;
      const roaring = t >= roarAt && t - roarAt < 2400 && roarAt >= k.s0;
      const glowing = roaring ? 0.5 + 0.5 * Math.sin((t - roarAt) / 90) : 0;
      const plate =
        glowing > 0.5 ? P.plateGlowHi : glowing > 0 ? P.plateGlow : P.plate;
      const pal = {
        p: plate,
        r: P.kaijuRim,
        H: P.kaijuHi,
        b: P.kaiju,
        d: P.kaijuDark,
        e: P.kEye,
        n: P.kaijuDark,
        t: P.kTooth,
      };
      if (roaring) roarLight(f, t - roarAt, glowing, k.y);
      // the body: a broad column down behind the buildings
      f.rect(kaijuX + 7, k.y + 16, 19, RAIL - k.y - 16, P.kaiju);
      f.vline(kaijuX + 7, k.y + 16, RAIL, P.kaijuRim);
      f.vline(kaijuX + 25, k.y + 16, RAIL, P.kaijuDark);
      for (let y = k.y + 19; y < RAIL; y += 4)
        f.hline(kaijuX + 8, kaijuX + 18, y, P.kaijuHi);
      // dorsal plates down the back
      for (let y = k.y + 15; y < RAIL; y += 3) {
        f.set(kaijuX + 26, y, plate);
        f.set(kaijuX + 27, y + 1, plate);
      }
      if (glowing > 0)
        glow(
          f,
          kaijuX + 18,
          k.y + 4,
          22,
          P.plateGlow,
          0.35 * glowing,
          0.5,
          0.2
        );
      const open = roaring ? 3 : 0;
      sprite(f, KAIJU, kaijuX, k.y, pal);
      sprite(f, KAIJU_JAW, kaijuX, k.y + 14 + open, pal);
      if (open) f.rect(kaijuX + 1, k.y + 14, 7, open, P.kMouth);
      // looking around: at the tower, at you, then off down the street
      const look =
        k.a > 2600 && k.a < 4600 ? -1 : k.a > 6000 && k.a < 7800 ? 1 : 0;
      const blink = Math.floor(k.a / 150) % 23 === 7;
      if (blink) f.hline(kaijuX + 8, kaijuX + 9, k.y + 8, P.kaijuDark);
      else f.set(kaijuX + 8 + (look === 1 ? 1 : 0), k.y + 8, P.kaijuDark);
    }

    /** The roar lights the sky up behind the skyline, pulsing with its plates. */
    function roarLight(f: Frame, a: number, glowing: number, ky: number) {
      const e = Math.min(1, a / 250) * Math.min(1, (2400 - a) / 900);
      const peak = 0.36 * e * (0.7 + 0.3 * glowing);
      const cx = kaijuX + 14;
      const cy = ky + 6;
      const R = Math.max(110, w * 0.6);
      const x0 = Math.max(0, Math.floor(cx - R));
      const x1 = Math.min(w, Math.ceil(cx + R));
      for (let y = 0; y < RAIL; y++) {
        const dy = (y - cy) * 1.5;
        for (let x = x0; x < x1; x++) {
          const d = Math.sqrt((x - cx) ** 2 + dy * dy) / R;
          if (d < 1)
            f.blend(x, y, P.plateGlow, peak * (Math.ceil((1 - d) * 5) / 5));
        }
      }
    }
    /** ...and its roar rolls out over the city in rings from its mouth. */
    function drawRoarRings(f: Frame, t: number) {
      const k = kaijuTop(t);
      if (!k || roarAt < k.s0 || t < roarAt || t - roarAt >= 2400) return;
      const a = t - roarAt;
      const cx = kaijuX + 2;
      const cy = k.y + 15;
      const R = Math.max(120, w * 0.75);
      for (let i = 0; i < 3; i++) {
        const u = (a - i * 400) / 1400;
        if (u < 0 || u >= 1) continue;
        const r = 5 + u * R;
        const alpha = 0.75 * (1 - u);
        // the half in front of it, squashed a little, over the rooftops: a
        // bright edge with a softer one inside it
        const n = Math.ceil(r * 4);
        for (const [dr, c, k] of [
          [0, P.plateGlowHi, 1],
          [-1.5, P.plateGlow, 0.45],
        ] as const) {
          let px = NaN;
          let py = NaN;
          for (let j = 0; j <= n; j++) {
            const th = Math.PI / 2 + (j / n) * Math.PI;
            const x = Math.round(cx + Math.cos(th) * (r + dr));
            const y = Math.round(cy + Math.sin(th) * (r + dr) * 0.6);
            if (y >= RAIL || (x === px && y === py)) continue;
            f.blend(x, y, c, alpha * k);
            px = x;
            py = y;
          }
        }
      }
    }

    // while it sleeps, the plates along its back stick up over the flattest
    // bit of roof in front of it, and glow with each slow breath: poke them
    // and it wakes straight up (the head's already on its way through them)
    const CW = CREST[0]!.length;
    // the roofs it's behind (an alley between them doesn't count: its back
    // fills that)
    const roofsAt = (x: number) =>
      roofs.slice(x, x + CW).filter((r) => r < RAIL);
    const crestX = (() => {
      let best = kaijuX + 13;
      let score = Infinity;
      for (let x = kaijuX; x <= kaijuX + 28 - CW; x++) {
        const r = roofsAt(x);
        if (!r.length) continue;
        const top = Math.min(...r);
        // even roofs first, then high ones (more sky behind the glow), then
        // over where the head's own plates come up; and not lined up with
        // a building's walls, where it'd look like a crown on the roof, or
        // over a roof's red light
        const s =
          (Math.max(...r) - top) * 4 +
          top / 4 +
          Math.abs(x - kaijuX - 14) / 8 +
          (roofs[x - 1] !== roofs[x] ? 3 : 0) +
          (roofs[x + CW] !== roofs[x + CW - 1] ? 3 : 0) +
          (beacons.some((b) => b.x >= x && b.x < x + CW && b.y >= top - 7)
            ? 20
            : 0);
        if (s < score) [best, score] = [x, s];
      }
      return best;
    })();
    // its top, breathed in: the bottom row stays down behind the roof
    const crestY = Math.min(RAIL, ...roofsAt(crestX)) - 6;
    const CREST_R = 8;
    const crestSpot = { x: crestX + 5, y: crestY + 3 };
    const BREATH = 4200;
    /** How far into a breath it is: 0 breathed out, 1 all the way in. */
    const breath = (t: number) =>
      0.5 - 0.5 * Math.cos(((t % BREATH) / BREATH) * Math.PI * 2);
    /** Asleep, and not on its way up or down through where the crest is. */
    const asleep = (t: number) => {
      const k = kaijuTop(t);
      return !k || k.y > crestY;
    };
    function drawCrest(f: Frame, t: number) {
      if (!asleep(t)) return;
      // poked (or woken some other way), it lights right up
      const b = kaijuStart(t) === null ? breath(t) : 1;
      const y = crestY + (b > 0.5 ? 0 : 1);
      // its back, down behind the buildings, for any gap between them
      f.rect(crestX, y + CREST.length, CW, RAIL - y - CREST.length, P.kaiju);
      glow(f, crestSpot.x, y + 3, 12, P.plateGlow, 0.12 + 0.3 * b, 0.6, 0.15);
      sprite(f, CREST, crestX, y, {
        h: lerpRGB(P.plateGlow, P.plateGlowHi, b),
        p: lerpRGB(P.plate, P.plateGlow, 0.15 + 0.5 * b),
      });
    }
    /** A poke at the crest: up it comes, from right there, and roars. */
    function wake(t: number) {
      // start the rise part way through, with its head just under the roof
      // the crest's behind, so it's in sight the moment it's poked
      const rise = Math.min(1, (RAIL - 2 - crestY) / (RAIL + 4 - peekY));
      kaijuCalledAt = t - 1800 * (1 - Math.sqrt(1 - rise));
      roarAt = kaijuCalledAt + 2100;
      booms.length = 0;
    }
    const onCrest = (x: number, y: number) =>
      Math.hypot(x - crestSpot.x, y - crestSpot.y) <= CREST_R + SLACK;
    const onKaiju = (x: number, y: number, t: number) => {
      const k = kaijuTop(t);
      return !!k && x >= kaijuX && x < kaijuX + 28 && y >= k.y && y < RAIL;
    };
    /** Its head, while enough of it shows over the roofs to click. */
    const kaijuHead = (t: number) => {
      const k = kaijuTop(t);
      if (!k || k.y + 9 > roofTop(kaijuX)) return null;
      return { x: kaijuX + 13, y: k.y + 9 };
    };
    // (the egg spot's circle round the disc and plate counts too, so a tap
    // that finds the egg always sets the ticket going)
    const SIGN_R = 7;
    // the slack the viewer gives a finger round an egg, so a tap it counts
    // as a find always sets the egg off
    const SLACK = 6;
    const onSign = (x: number, y: number) =>
      (Math.abs(x - signX) <= 5 && y >= SIGN_Y - 5 && y < GROUND) ||
      Math.hypot(x - signX, y - SIGN_Y - 2) <= SIGN_R;

    function drawPlane(f: Frame, t: number) {
      const PERIOD = 46_000;
      const p = (t % PERIOD) / 30_000;
      if (p > 1) return;
      const x = Math.round(-10 + p * (w + 20));
      const y = 24 - Math.round(p * 8);
      if (Math.floor(t / 500) % 2) f.set(x, y, P.plane);
      if (Math.floor(t / 500) % 2 === 0) f.set(x + 2, y, P.planeGreen);
      if (t % 1300 < 90) f.set(x + 1, y - 1, P.planeWhite);
    }

    const towerStyle = (): TowerStyle =>
      veil
        ? {
            lit: P.veilLit,
            hi: P.veilHi,
            dark: P.veilDark,
            glow: P.veilGlow,
            deck: P.deck,
            deckHi: P.deckHi,
            deckDark: P.deckDark,
            red: P.mastRed,
            white: P.mastWhite,
          }
        : {
            lit: P.towerLit,
            hi: P.towerHi,
            dark: P.towerDark,
            glow: P.towerGlow,
            deck: P.deck,
            deckHi: P.deckHi,
            deckDark: P.deckDark,
            red: P.mastRed,
            white: P.mastWhite,
          };

    const onTower = (x: number, y: number) =>
      y > RAIL - towerH &&
      y < RAIL &&
      Math.abs(x - towerX) < 4 + ((y - (RAIL - towerH)) / towerH) * 14;
    const onCat = (x: number, y: number) =>
      x >= catX && x < catX + 26 && y >= 44 && y < 66;
    const shopAt = (x: number, y: number) =>
      y >= CROWN && y < GROUND
        ? shops.find((s) => x >= s.x0 && x <= s.x1 && s.kind !== 'shutter')
        : undefined;

    return {
      render(f, t, pointer) {
        f.copyFrom(sky);
        f.over(cloudLayer, Math.round(t / 1100), 0, true);
        drawPlane(f, t);
        f.over(far);
        tokyoTower(f, towerX, RAIL, towerH, towerStyle());
        if (Math.sin(t / 700) > 0) f.set(towerX, RAIL - towerH, P.beacon);
        drawKaiju(f, t);
        f.over(mid);
        drawRoarRings(f, t);
        blinkBeacons(f, beacons, t, P.beacon);
        for (const s of signs) {
          const on = !(hash2(s.seed, Math.floor(t / 180), 9) > 0.97);
          neonSign(f, s.x, s.top, s.len, s.c, on, s.seed);
        }
        drawCat(f, t);
        fx.draw(f, t);
        const tr = trainAt(t);
        if (tr) drawTrain(f, tr.x, tr.dir, t);
        f.over(near);
        const hoverShop = pointer ? shopAt(pointer.x, pointer.y) : undefined;
        for (const s of shops) {
          // a click sets the lanterns swinging and the noren (or, in a
          // bar, the neon) going for a moment
          const kicked = t - (swingAt.get(s.seed) ?? -Infinity);
          drawNoren(
            f,
            s,
            t,
            s === hoverShop
              ? 1.2
              : kicked < 2500
                ? 1.2 * (1 - kicked / 2500)
                : 0
          );
          if (s.kind === 'izakaya' || s.kind === 'tachinomi') {
            const amp = kicked < 2500 ? 2.2 * (1 - kicked / 2500) : 0.4;
            const sw = Math.round(
              Math.sin(t / (kicked < 2500 ? 140 : 900) + s.seed) * amp
            );
            lantern(f, s.x0 + 2 + sw, SPRING - 4);
            lantern(f, s.x1 - 5 + sw, SPRING - 4);
          }
          if (s.kind === 'ramen')
            smoke(
              f,
              Math.round((s.x0 + s.x1) / 2) + 4,
              SPRING - 2,
              t,
              [P.steam, P.steam2],
              { height: 14, drift: 3, width: 2, density: 0.5 }
            );
          if (
            s.kind === 'bar' &&
            (hash2(s.seed, Math.floor(t / 150), 4) > 0.95 ||
              (kicked < 900 && Math.floor(kicked / 110) % 2 === 1))
          ) {
            // the neon glass flickers off (just the glass, not the door)
            f.rect(s.x0 + GLASS - 3, SPRING + 3, 7, 1, P.barBg2);
            f.rect(s.x0 + GLASS - 3, SPRING + 4, 7, 8, P.barBg);
          }
        }
        // people strolling past
        for (const p of walkers) {
          const span = w + 20;
          const x =
            Math.round((((p.offset + t * p.speed) % span) + span) % span) - 10;
          const step = Math.floor(t / 220 + p.offset) % 2;
          const top = GROUND - 9 - p.tall;
          f.rect(x, top, 3, 3, P.walker);
          f.rect(x - (p.tall ? 0 : 0), top + 3, 3, 4 + p.tall, P.walker);
          f.set(x + (step ? 0 : 2), GROUND - 2, P.walker);
          f.set(x + (step ? 2 : 0), GROUND - 1, P.walker);
          f.set(x + 1, GROUND - 2, P.walker);
        }
        drawSign(f);
        drawCop(f, t);
        drawTaxi(f, t);
        drawRoadRider(f, t);
      },
      poke(x, y, t) {
        if (onTower(x, y)) {
          veil = !veil;
          sparkle(fx, t, x, y, veil ? P.veilHi : P.towerHi);
          return;
        }
        if (onCat(x, y)) {
          meowAt = t;
          return;
        }
        if (onKaiju(x, y, t)) {
          if (t - roarAt > 2400) roarAt = t;
          return;
        }
        // (and while it's up, or on its way, a poke there does nothing new)
        if (onCrest(x, y)) {
          if (kaijuStart(t) === null) wake(t);
          return;
        }
        if (onSign(x, y)) {
          if (!roadAt(t)) called = { kind: 'ticket', s: t, dir: 1 };
          return;
        }
        const s = shopAt(x, y);
        if (s) {
          // (and a second click doesn't restart them mid-swing)
          if (t - (swingAt.get(s.seed) ?? -Infinity) >= 2500)
            swingAt.set(s.seed, t);
          return;
        }
        // calling a train or a taxi only works when the way is clear, so
        // clicking again doesn't yank one back to the start
        if (y >= 84 && y < CROWN) {
          if (!trainAt(t)) trainCalledAt = t;
          return;
        }
        if (y >= GROUND) {
          if (!roadAt(t))
            called = { kind: calls++ % 2 ? 'taxi' : 'rider', s: t, dir: 1 };
          return;
        }
        // a shutter or a pier: nothing there (a firework would go off
        // unseen behind the arches)
        if (y >= CROWN) return;
        const colors = [
          [P.deckHi, P.neonYellow, P.neonRed, P.sky4],
          [P.deckHi, P.neonCyan, P.veilDark, P.sky3],
          [P.deckHi, P.neonPink, P.barNeon, P.sky4],
          [P.deckHi, P.trainGreen, P.bottleA, P.sky3],
        ];
        // enough fireworks and you wake up the neighbour
        booms.push(t);
        while (booms.length && t - booms[0]! > 8000) booms.shift();
        if (booms.length >= 3 && kaijuStart(t) === null) {
          kaijuCalledAt = t + 500;
          roarAt = t + 2600;
          booms.length = 0;
        }
        const seed = Math.floor(t) % 997;
        firework(
          fx,
          t,
          x + (hash2(seed, 1, 2) - 0.5) * 10,
          RAIL,
          y,
          colors[seed % colors.length]!,
          seed
        );
      },
      hot(x, y) {
        return y < CROWN || y >= GROUND || onSign(x, y) || !!shopAt(x, y);
      },
      eggs(t) {
        const out: EggSpot[] = [];
        // the kaiju: the crest of its back while it sleeps, its head while
        // it's up over the skyline
        const head = kaijuHead(t);
        if (head) out.push({ id: 'kaiju', ...head, r: 9 });
        else if (kaijuStart(t) === null)
          out.push({ id: 'kaiju', ...crestSpot, r: CREST_R });
        // the sign, while the road's clear for the cop (or he's on his way)
        const run = roadAt(t);
        if (!run || run.kind === 'ticket')
          out.push({ id: 'ticket', x: signX, y: SIGN_Y + 2, r: SIGN_R });
        return out;
      },
    };
  },
};
