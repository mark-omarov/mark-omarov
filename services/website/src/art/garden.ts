// The blog as a garden in Tokyo, at whatever time it is where you are: dawn,
// day, dusk or night. Every note is a plant, grown by the note's stage
// (seedling, budding, evergreen). Links aren't drawn: fireflies (butterflies
// by day) fly from one linked note to the other, a few at a time, working
// through every link. Hover a plant and its own links light up as streams
// of light to its neighbours, like Obsidian's local graph. When the bed gets
// crowded the garden grows deeper, up to three rows. Mark sits on a bench
// under the maple, writing, the bike parked beside him.

import { type Frame, hex, lerpRGB, type RGB, sprite } from './frame';
import { flock, Fx, shootingStar } from './fx';
import { hash2 } from './noise';
import { canopy, clouds, glow, gradient, stars } from './paint';
import { layer } from './scene';
import { skyline } from './things/city';
import { drawMotorcycle } from './things/motorcycle';

export type Stage = 'seedling' | 'budding' | 'evergreen';
export type GardenNote = { stage: Stage; seed: number };

export const GARDEN_H = 132;
const GROUND = 110; // where the plants are rooted
const POND = 114; // still water in front of the bed

/** A stable number per note, so each one keeps its colour and shape. */
export function noteSeed(slug: string) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++)
    h = Math.imul(h ^ slug.charCodeAt(i), 16777619);
  return (h >>> 0) % 10_000;
}

type Period = 'dawn' | 'day' | 'dusk' | 'night';

/** Which part of the day an hour (0..24, local time) falls in. */
export function periodOf(hour: number): Period {
  if (hour >= 5 && hour < 7.5) return 'dawn';
  if (hour >= 7.5 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19.5) return 'dusk';
  return 'night';
}

// colours that change with the time of day
type Theme = {
  sky: string[];
  stars: number; // 0..1
  sun: { x: number; y: number; c: string; glow: string } | null; // x as a share of width
  moon: boolean;
  cloud: [string, string, string] | null; // light, base, shadow
  city: [string, string, string, string]; // body, edge, dark, windows
  lit: number; // share of lit windows
  shrub: [string, string, string, string];
  leaf: [string, string, string, string];
  stem: string;
  maple: [string, string, string, string];
  trunk: string;
  bamboo: [string, string, string];
  soil: [string, string];
  stone: [string, string, string];
  pond: string;
  pondHi: string;
  glow: number; // how strongly the flowers glow
  night: boolean; // lantern, fireflies, glowing eyes
  flower: number; // how much the decor flowers show (dim at night)
  mist: string | null;
};

const THEMES: Record<Period, Theme> = {
  night: {
    sky: ['#060818', '#0a0f28', '#111738', '#1a1f48', '#262856'],
    stars: 1,
    sun: null,
    moon: true,
    cloud: null,
    city: ['#121634', '#1a1f44', '#0e1129', '#c8a060'],
    lit: 0.25,
    shrub: ['#0a1222', '#0f1a2e', '#16243a', '#22384e'],
    leaf: ['#123028', '#1a4a3c', '#277058', '#4aa486'],
    stem: '#1d4a3c',
    maple: ['#1c0b17', '#2e1120', '#45182a', '#6a2638'],
    trunk: '#120a14',
    bamboo: ['#1e3a30', '#3a6a52', '#12261e'],
    soil: ['#150f1c', '#251b2c'],
    stone: ['#1c1e32', '#2c2f4a', '#4a4f72'],
    pond: '#080b1c',
    pondHi: '#3a4478',
    glow: 1,
    night: true,
    flower: 0.55,
    mist: null,
  },
  dusk: {
    sky: ['#1b1a44', '#3c2a62', '#7c3c6c', '#d0606a', '#f6a462'],
    stars: 0.35,
    sun: { x: 0.3, y: GROUND - 10, c: '#ffd27a', glow: '#ff9a5a' },
    moon: false,
    cloud: ['#ffb48a', '#b0587a', '#5a3060'],
    city: ['#2a1c3c', '#3a2a50', '#20162e', '#ffc870'],
    lit: 0.2,
    shrub: ['#1e1228', '#2c1a38', '#3c2446', '#5c3456'],
    leaf: ['#1c3428', '#2a4a38', '#3e664a', '#c09060'],
    stem: '#2a4a38',
    maple: ['#3a1020', '#5a1a28', '#7a2a30', '#c0503a'],
    trunk: '#1e1018',
    bamboo: ['#2a4030', '#5a7448', '#1a2a20'],
    soil: ['#22161e', '#3a2630'],
    stone: ['#2a2234', '#463a52', '#8a6a70'],
    pond: '#1a1430',
    pondHi: '#f0a070',
    glow: 0.7,
    night: true,
    flower: 0.75,
    mist: null,
  },
  dawn: {
    sky: ['#2c3c70', '#5a6aa4', '#a4a2ca', '#f0bab2', '#ffdcaa'],
    stars: 0.1,
    sun: { x: 0.72, y: GROUND - 6, c: '#fff0c0', glow: '#ffc890' },
    moon: false,
    cloud: ['#fff0e0', '#e0b0b8', '#9a8aaa'],
    city: ['#6a6e98', '#7a80a8', '#5a5e88', '#ffe0a0'],
    lit: 0.05,
    shrub: ['#2a3448', '#3a4a5e', '#4a5e70', '#7a8a9a'],
    leaf: ['#24483a', '#346a50', '#4a8a62', '#9ac89a'],
    stem: '#2e5a44',
    maple: ['#5a2030', '#7a2a36', '#9a3a40', '#d06a5a'],
    trunk: '#2a1e24',
    bamboo: ['#2e5a44', '#6a9a6a', '#1e3a2e'],
    soil: ['#3a2e34', '#544048'],
    stone: ['#4a4e62', '#6a6e84', '#a4a8bc'],
    pond: '#5a6a96',
    pondHi: '#ffe0c0',
    glow: 0.4,
    night: false,
    flower: 0.9,
    mist: '#e8dcec',
  },
  day: {
    sky: ['#2c66c4', '#3f80d8', '#5c9de4', '#86bdee', '#b9dcf6'],
    stars: 0,
    sun: { x: 0.8, y: 20, c: '#fffbe8', glow: '#fff4c0' },
    moon: false,
    cloud: ['#ffffff', '#e4eef8', '#a8c0da'],
    city: ['#8aa0c4', '#a4b8d4', '#7a90b4', '#ffffff'],
    lit: 0,
    shrub: ['#2a5236', '#36683e', '#468048', '#68a05a'],
    leaf: ['#2a6a38', '#3a8a44', '#56a24c', '#9ad86a'],
    stem: '#3f8a3a',
    maple: ['#8a2a26', '#b23a2c', '#d85a36', '#ff9058'],
    trunk: '#4a3028',
    bamboo: ['#3a7a48', '#7ac070', '#285a36'],
    soil: ['#5a4030', '#74563c'],
    stone: ['#7a7e88', '#a4a8b2', '#d4d8de'],
    pond: '#2e6aa6',
    pondHi: '#e8f6ff',
    glow: 0.22,
    night: false,
    flower: 1,
    mist: null,
  },
};

// fixed colours: people, things, light
const C = {
  star: hex('#7c84c4'),
  starHi: hex('#e4e8ff'),
  moon: hex('#f2eed8'),
  moonShade: hex('#cdc6a6'),
  moonGlow: hex('#7a82c8'),
  firefly: hex('#f0ff9c'),
  fireflyGlow: hex('#c8f070'),
  lantern: hex('#4a4e66'),
  lanternHi: hex('#6e7290'),
  lanternDark: hex('#2a2c40'),
  flame: hex('#ffd890'),
  flameGlow: hex('#ffb35a'),
  mushroom: hex('#5ae0ff'),
  mushroomStem: hex('#9ab4c8'),
  water: hex('#7ac0f0'),
  tube: hex('#6a9a5a'),
  tubeHi: hex('#a8d08a'),
  tubeDark: hex('#2e4a30'),
  seed: hex('#c8f070'),
  cat: hex('#0a0b12'),
  catEye: hex('#ffe066'),
  hydrangea: hex('#5a6ad0'),
  hydrangeaHi: hex('#9aaaf4'),
  iris: hex('#7a4ad8'),
  irisHi: hex('#b48cff'),
  irisYellow: hex('#ffd23a'),
  plume: hex('#c8c4b0'),
  plumeHi: hex('#f4f0e0'),
  wood: hex('#7a5034'),
  woodHi: hex('#a06a44'),
  woodDark: hex('#4a2e1e'),
  // Mark: black hoodie, jeans, white sneakers
  hoodie: hex('#22232e'),
  hoodieHi: hex('#4a4c60'),
  jeans: hex('#3a5a9a'),
  jeansHi: hex('#5a7ab8'),
  skin: hex('#e8b896'),
  skinShade: hex('#c08a6a'),
  hair: hex('#3a2a22'),
  shoe: hex('#f0f0f0'),
  laptop: hex('#b8bcc8'),
  laptopDark: hex('#7a7e8a'),
  screen: hex('#9ad8ff'),
  mug: hex('#f4f0e8'),
  steam: hex('#dde4f0'),
  butterflies: [hex('#ffffff'), hex('#ffd23a'), hex('#7dcfff'), hex('#ff9a6a')],
  bird: hex('#2a2a3a'),
};

// each note blooms in one of these: [petals, core]
const GLOWS: [RGB, RGB][] = [
  [0x6ff0ff, 0xd8fcff],
  [0xff7ad8, 0xffd8f4],
  [0xffc85a, 0xfff0c8],
  [0xb48cff, 0xe8dcff],
  [0xa8ff7a, 0xe8ffd8],
  [0xff8a6a, 0xffdcd0],
];

/** A note's flower colours, [petals, core]: the same in the garden and its graph. */
export function noteColors(seed: number): [RGB, RGB] {
  return GLOWS[Math.floor(hash2(seed, 7, 3) * GLOWS.length)]!;
}

type Spot = {
  x: number; // the flower
  y: number;
  base: number; // where the stem comes out of the ground
  root: number;
  row: number; // 0 at the front
  height: number;
  color: RGB;
  core: RGB;
};

function plantHeight(note: GardenNote) {
  const r = hash2(note.seed, 1, 5);
  if (note.stage === 'seedling') return 12 + Math.round(r * 4);
  if (note.stage === 'budding') return 26 + Math.round(r * 8);
  return 40 + Math.round(r * 14);
}

export function createGarden(
  w: number,
  notes: GardenNote[],
  links: [number, number][],
  hour = 22
) {
  const h = GARDEN_H;
  const fx = new Fx();
  const period = periodOf(hour);
  const T = THEMES[period];
  const rgb = (s: string) => hex(s);
  const leafC = T.leaf.map(rgb) as [RGB, RGB, RGB, RGB];
  const stemC = rgb(T.stem);
  const wide = w >= 300;

  /** A long leaf from (x, y) heading out to one side and up. */
  function leaf(f: Frame, x: number, y: number, len: number, dir: 1 | -1) {
    for (let k = 1; k <= len; k++) {
      const v = k / len;
      const lx = x + dir * k;
      const ly = Math.round(y - v * len * 0.45);
      const thick = v < 0.25 || v > 0.85 ? 0 : 1;
      f.set(lx, ly, k === len ? leafC[3] : leafC[2]);
      if (thick) f.set(lx, ly + 1, leafC[0]);
      if (thick && v > 0.4 && v < 0.7) f.set(lx, ly - 1, leafC[3]);
    }
  }

  /** A bloom: petals around a bright core. */
  function bloom(f: Frame, x: number, y: number, r: number, c: RGB, core: RGB) {
    f.disc(x, y, r, (dx, dy) => {
      const d = Math.hypot(dx, dy);
      // petals: notch the outline so it isn't a plain disc
      if (d > r - 0.6 && Math.round(Math.atan2(dy, dx) * 2.5) & 1) return null;
      return d < r * 0.4 ? core : c;
    });
  }

  /** The x of a note's stem at height y: it leans a little towards the top. */
  function stemAt(
    note: GardenNote,
    base: number,
    root: number,
    height: number
  ) {
    const bend = (hash2(note.seed, 2, 5) - 0.5) * 2;
    return (y: number) =>
      Math.round(base + bend * ((root - y) / height) ** 2 * lean);
  }

  /**
   * A note's plant, rooted at (s.base, s.root). Its glow is drawn per frame.
   * In a crowded bed the evergreens leave out their side shoots.
   */
  function drawPlant(f: Frame, note: GardenNote, s: Spot, shoots: boolean) {
    const top = s.root - s.height;
    const stemX = stemAt(note, s.base, s.root, s.height);
    for (let y = s.root; y > top; y--) {
      const sx = stemX(y);
      f.set(sx, y, stemC);
      if (note.stage === 'evergreen' && y > top + 6) f.set(sx + 1, y, leafC[0]);
    }
    const tx = stemX(top + 1);
    if (note.stage === 'seedling') {
      leaf(f, tx, top + 4, 4, -1);
      leaf(f, tx, top + 5, 4, 1);
      f.set(tx, top, s.color);
      f.set(tx, top + 1, leafC[2]);
      return;
    }
    // leaves up the stem, alternating sides, longer near the bottom
    const count = note.stage === 'budding' ? 4 : 7;
    for (let i = 0; i < count; i++) {
      const y = s.root - 3 - Math.round((i / count) * (s.height - 10));
      const len = Math.max(
        3,
        Math.round((note.stage === 'evergreen' ? 9 : 6) * (1 - i / (count + 2)))
      );
      leaf(f, stemX(y), y, len, i % 2 ? 1 : -1);
    }
    if (note.stage === 'budding') {
      // a closed bud with its sepals, colour showing at the tip
      f.rect(tx - 1, top, 3, 4, s.color);
      f.set(tx, top - 1, s.color);
      f.set(tx, top + 1, s.core);
      f.set(tx - 2, top + 3, leafC[2]);
      f.set(tx + 2, top + 3, leafC[2]);
      f.hline(tx - 1, tx + 1, top + 4, leafC[1]);
      return;
    }
    // evergreen: a full bloom, and a couple more on side shoots
    bloom(f, tx, top, 4, s.color, s.core);
    if (shoots)
      for (const side of [-1, 1] as const) {
        const by = top + 10 + (side > 0 ? 5 : 0);
        const bx = stemX(by) + side * 6;
        f.line(stemX(by + 3), by + 3, bx, by, stemC);
        bloom(f, bx, by, 2, s.color, s.core);
      }
  }

  // layout, left to right: bamboo and the lantern, the water rocker (when
  // there's room), the notes, Mark on his bench, the bike, the maple
  const lanternAt = { x: Math.max(18, Math.round(w * 0.05)), y: GROUND };
  const rocker = { x: lanternAt.x + 38, y: GROUND };
  const left = wide ? rocker.x + 12 : lanternAt.x + 16;
  const markX = wide ? w - 86 : w - 30; // his hips
  const right = markX - 24;
  const bikeX = markX + 20;
  const catAt = { x: markX - 18, y: GROUND };

  // Where each note grows. Linked notes are planted near each other (a walk
  // through the link graph, starting from the oldest note), and when one row
  // gets crowded the bed grows deeper: up to three rows, the back ones
  // planted a little higher up and grown taller, so their flowers stand
  // above the row in front instead of colliding with it.
  const neighbours = notes.map(() => new Set<number>());
  for (const [a, b] of links) {
    if (a === b || !notes[a] || !notes[b]) continue;
    neighbours[a]!.add(b);
    neighbours[b]!.add(a);
  }
  const order: number[] = [];
  const seen = new Set<number>();
  for (let start = notes.length - 1; start >= 0; start--) {
    if (seen.has(start)) continue;
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      const n = queue.shift()!;
      order.push(n);
      for (const m of [...neighbours[n]!].sort((p, q) => q - p)) {
        if (seen.has(m)) continue;
        seen.add(m);
        queue.push(m);
      }
    }
  }
  const perRow = Math.max(1, Math.floor((right - left) / 11));
  const rows = Math.min(3, Math.ceil(notes.length / perRow));
  const pitch = notes.length ? (right - left) / notes.length : 0;
  // Neighbours in a row stand this far apart. Flowers 9 wide need 10 to
  // keep clear of each other, and whatever's left over is shared between
  // the stems' lean and the planting's jitter (both ways), so in a crowded
  // bed two flowers never lean into each other.
  const spacing = pitch * Math.max(1, rows);
  const spare = Math.max(0, spacing - 10) / 4;
  const lean = Math.min(3, spare);
  const jitter = Math.min(2, pitch * 0.15, spare);
  const spots: Spot[] = new Array<Spot>(notes.length);
  order.forEach((n, k) => {
    const note = notes[n]!;
    const row = rows > 1 ? (k + 1) % rows : 0;
    const root = GROUND - row * 5;
    const [color, core] = noteColors(note.seed);
    const base = Math.round(
      left + pitch * (k + 0.5) + (hash2(note.seed, 3, 5) - 0.5) * 2 * jitter
    );
    const height = Math.round(plantHeight(note) * (1 + row * 0.16));
    const top = root - height;
    // the flower itself, where its glow, links and label belong: the stem
    // leans, and a bud's heart is a pixel below its tip
    const x = stemAt(note, base, root, height)(top + 1);
    const y = note.stage === 'budding' ? top + 1 : top;
    spots[n] = { x, y, base, root, row, height, color, core };
  });
  // side shoots only where neighbours in a row leave room for them
  const shoots = spacing >= 16;

  // each link's flight path: a gentle arch from flower to flower. Never
  // drawn as a line; fireflies fly it, and it lights up on hover.
  const paths = links
    .filter(([a, b]) => a !== b && spots[a] && spots[b])
    .map(([a, b]) => {
      const p = spots[a]!;
      const q = spots[b]!;
      const span = Math.abs(q.x - p.x);
      const rise = Math.min(Math.min(p.y, q.y) - 6, 6 + span * 0.3);
      const pts: [number, number][] = [];
      const steps = Math.max(8, Math.round(span * 1.5 + rise * 2));
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = Math.round(p.x + (q.x - p.x) * u);
        const y = Math.round(
          p.y + (q.y - p.y) * u - Math.sin(Math.PI * u) * rise
        );
        const last = pts[pts.length - 1];
        if (!last || last[0] !== x || last[1] !== y) pts.push([x, y]);
      }
      return { a, b, pts };
    });
  const linksOf = notes.map(() => [] as number[]);
  paths.forEach((p, k) => {
    linksOf[p.a]!.push(k);
    linksOf[p.b]!.push(k);
  });

  const moon = { x: Math.round(w * 0.62), y: 22 };
  const mushrooms: [number, number][] = [
    [9, 2],
    [12, 1],
    [-8, 1],
  ];

  const sky = layer(w, h, (f) => {
    gradient(f, 0, GROUND, T.sky.map(rgb));
    f.rect(0, GROUND, w, h - GROUND, rgb(T.sky[4]!));
    if (T.stars > 0)
      stars(
        f,
        21,
        Math.round((w / 7) * T.stars),
        80,
        0,
        [C.star, C.star, C.starHi],
        false
      );
    if (T.moon) {
      glow(f, moon.x, moon.y, 26, C.moonGlow, 0.32, 1, 0.12);
      f.disc(moon.x, moon.y, 8, (dx, dy) =>
        dx + dy > 5 ? C.moonShade : C.moon
      );
      f.set(moon.x - 3, moon.y - 2, C.moonShade);
      f.set(moon.x + 2, moon.y + 3, C.moonShade);
      f.set(moon.x - 1, moon.y + 4, C.moonShade);
    }
    if (T.sun) {
      const sx = Math.round(w * T.sun.x);
      glow(
        f,
        sx,
        T.sun.y,
        period === 'day' ? 30 : 44,
        rgb(T.sun.glow),
        0.45,
        period === 'day' ? 1 : 0.6,
        0.1
      );
      f.disc(sx, T.sun.y, period === 'day' ? 6 : 8, rgb(T.sun.c));
    }
  });
  const cloudLayer = T.cloud
    ? layer(w, h, (f) => {
        const [light, base, shadow] = T.cloud!.map(rgb) as [RGB, RGB, RGB];
        clouds(f, {
          seed: 51,
          y0: 6,
          y1: period === 'day' ? 40 : 30,
          cell: 8,
          coverage: period === 'day' ? 0.42 : 0.34,
          stretch: 3.5,
          litFromBelow: period !== 'day',
          style: { light, base, shadow },
        });
      })
    : null;

  const back = layer(w, h, (f) => {
    // a far-off city line: this garden is in Tokyo
    const [body, edge, dark, win] = T.city.map(rgb) as [RGB, RGB, RGB, RGB];
    skyline(
      f,
      GROUND - 8,
      {
        body,
        edge,
        dark,
        windows: [win, lerpRGB(win, body, 0.4)],
        litShare: T.lit,
      },
      { seed: 33, minH: 6, maxH: 26, minW: 6, maxW: 14 }
    );
    // shrubs and a tree behind the bed
    const [s0, s1, s2, s3] = T.shrub.map(rgb) as [RGB, RGB, RGB, RGB];
    const shrubs = { dark: s0, mid: s1, light: s2, hi: s3 };
    canopy(
      f,
      (x, y) =>
        y > GROUND - 14 - Math.sin(x / 13) * 4 - Math.sin(x / 5.3) * 2 &&
        y < GROUND + 2,
      shrubs,
      { seed: 34, y0: GROUND - 22, y1: GROUND + 2, size: 4 }
    );
    // a cloud-pruned maple on the right: pads of leaves on bare branches
    const trunk = rgb(T.trunk);
    const tx = Math.round(w - Math.min(26, w * 0.07));
    for (let y = 40; y < GROUND; y++) {
      const x = Math.round(tx + Math.sin((y - 40) / 16) * 4);
      f.rect(x - 1, y, 3 + (y > GROUND - 12 ? 1 : 0), 1, trunk);
    }
    const pads: [number, number, number, number][] = [
      [tx - 2, 26, 18, 7],
      [tx - 26, 46, 14, 5],
      [tx + 12, 52, 12, 5],
      [tx - 14, 70, 11, 4],
    ];
    for (const [px, py] of pads)
      f.line(tx, Math.max(py + 4, 44), px, py + 2, trunk);
    const [m0, m1, m2, m3] = T.maple.map(rgb) as [RGB, RGB, RGB, RGB];
    pads.forEach(([px, py, rx, ry], i) =>
      canopy(
        f,
        (x, y) => ((x - px) / rx) ** 2 + ((y - py) / ry) ** 2 < 1,
        { dark: m0, mid: m1, light: m2, hi: m3 },
        {
          seed: 35 + i,
          x0: px - rx - 3,
          x1: px + rx + 3,
          y0: py - ry - 3,
          y1: py + ry + 3,
          size: 3,
        }
      )
    );
    // bamboo behind the lantern
    const [b0, b1, b2] = T.bamboo.map(rgb) as [RGB, RGB, RGB];
    for (const [bx, top] of [
      [lanternAt.x - 8, 6],
      [lanternAt.x - 3, 18],
      [lanternAt.x + 12, 30],
    ] as const) {
      f.rect(bx, top, 2, GROUND - top, b0);
      f.vline(bx, top, GROUND, b1);
      for (let y = top + 9; y < GROUND; y += 11) f.hline(bx - 1, bx + 2, y, b2);
      for (let y = top + 4; y < GROUND - 20; y += 14)
        leaf(f, bx + 1, y, 6, y % 28 < 14 ? 1 : -1);
    }
    // the garden's own plants fill the gaps between notes: hydrangea
    // clumps, irises, ferns and pampas grass
    const flowerC = (c: RGB) => lerpRGB(s1, c, T.flower);
    for (let x = 4; x < w - 4; x += 8) {
      // clear of the notes, so a lone seedling isn't lost among them
      if (
        spots.some((s) => Math.abs(s.base - x) < 10) ||
        Math.abs(x - lanternAt.x) < 14
      )
        continue;
      if (x > markX - 26 && x < markX + 16) continue;
      if (wide && Math.abs(x - rocker.x) < 14) continue;
      if (wide && x > bikeX - 10 && x < bikeX + 40) continue; // behind the bike
      const r = hash2(x, 0, 36);
      if (r < 0.12) continue;
      if (r < 0.4) {
        // hydrangea: a leafy mound with round heads of tiny florets
        const blue = hash2(x, 1, 36) < 0.6;
        const c = flowerC(blue ? C.hydrangea : C.iris);
        const hi = flowerC(blue ? C.hydrangeaHi : C.irisHi);
        f.disc(x, GROUND - 3, 5, (dx, dy) =>
          dx + dy < -4 ? leafC[2] : dx + dy > 3 ? leafC[0] : leafC[1]
        );
        for (const [dx, dy] of [
          [-3, -6],
          [3, -7],
          [0, -9],
        ] as const) {
          f.disc(x + dx, GROUND + dy, 2, (ex, ey) => ((ex + ey) & 1 ? hi : c));
        }
      } else if (r < 0.58) {
        // irises: sword leaves, purple falls with a yellow flash
        for (let k = -2; k <= 2; k++)
          f.line(
            x + k,
            GROUND,
            x + k * 2,
            GROUND - 9 + Math.abs(k),
            leafC[k % 2 ? 1 : 2]
          );
        for (const [dx, tall] of [
          [-1, 13],
          [2, 11],
        ] as const) {
          const fx0 = x + dx;
          const fy = GROUND - tall;
          f.vline(fx0, fy + 2, GROUND - 6, stemC);
          f.set(fx0, fy, flowerC(C.irisHi));
          f.hline(fx0 - 1, fx0 + 1, fy + 1, flowerC(C.iris));
          f.set(fx0 - 1, fy + 2, flowerC(C.iris));
          f.set(fx0 + 1, fy + 2, flowerC(C.iris));
          f.set(fx0, fy + 1, flowerC(C.irisYellow));
        }
      } else if (r < 0.82) {
        // fern
        const tall = 8 + Math.floor(hash2(x, 2, 36) * 6);
        for (let k = -3; k <= 3; k++)
          f.line(
            x,
            GROUND,
            x + k * 2.2,
            GROUND - tall + Math.abs(k) * 1.5,
            k ? leafC[1] : leafC[2]
          );
      } else {
        // pampas grass with feathery plumes
        const tall = 18 + Math.floor(hash2(x, 3, 36) * 12);
        for (let k = -2; k <= 2; k++) {
          const tipX = x + k * 2;
          const tipY = GROUND - tall + Math.abs(k) * 3;
          f.line(x, GROUND, tipX, tipY + 4, leafC[1]);
          f.vline(tipX, tipY, tipY + 3, flowerC(C.plume));
          f.set(tipX + (k < 0 ? -1 : 1), tipY + 1, flowerC(C.plumeHi));
        }
      }
    }
    // the notes
    for (let row = 2; row >= 0; row--)
      spots.forEach((s, i) => {
        if (s.row === row) drawPlant(f, notes[i]!, s, shoots);
      });
    // the bed's soil and the stones along the pond's edge
    const [soil, soilHi] = T.soil.map(rgb) as [RGB, RGB];
    const [st0, st1, st2] = T.stone.map(rgb) as [RGB, RGB, RGB];
    f.rect(0, GROUND, w, POND - GROUND, soil);
    f.hline(0, w, GROUND, soilHi);
    for (let x = -2; x < w; x += 6) {
      const sw = 5 + Math.floor(hash2(x, 0, 38) * 3);
      const y = POND - 2 + Math.round(hash2(x, 1, 38));
      f.rect(x, y, sw, 3, st1);
      f.hline(x + 1, x + sw - 2, y, st2);
      f.hline(x, x + sw - 1, y + 2, st0);
    }
    // stone lantern
    const lx = lanternAt.x;
    const ly = lanternAt.y;
    f.rect(lx - 4, ly - 2, 9, 2, C.lanternDark);
    f.rect(lx - 1, ly - 9, 3, 7, C.lantern);
    f.vline(lx - 1, ly - 9, ly - 3, C.lanternHi);
    f.rect(lx - 3, ly - 15, 7, 6, C.lantern);
    f.vline(lx - 3, ly - 15, ly - 10, C.lanternHi);
    f.rect(lx - 1, ly - 14, 3, 3, C.lanternDark);
    f.hline(lx - 5, lx + 5, ly - 16, C.lanternDark);
    f.hline(lx - 4, lx + 4, ly - 17, C.lantern);
    f.hline(lx - 2, lx + 2, ly - 18, C.lanternHi);
    f.set(lx, ly - 19, C.lantern);
    // mushrooms by the lantern (they glow after dark)
    for (const [dx, s2] of mushrooms) {
      const mx = lx + dx;
      f.vline(mx, GROUND + 1 - s2, GROUND + 1, C.mushroomStem);
      f.hline(
        mx - s2,
        mx + s2,
        GROUND - s2,
        T.night ? C.mushroom : lerpRGB(C.mushroom, s0, 0.5)
      );
      f.set(
        mx,
        GROUND - s2 - 1,
        T.night ? C.mushroom : lerpRGB(C.mushroom, s0, 0.5)
      );
    }
    // Mark's bench under the maple, and the bike parked beside it
    f.rect(markX - 9, GROUND - 6, 23, 2, C.woodHi);
    f.hline(markX - 9, markX + 13, GROUND - 4, C.woodDark);
    for (const lx2 of [markX - 7, markX + 11])
      f.vline(lx2, GROUND - 4, GROUND - 1, C.woodDark);
    if (wide) drawMotorcycle(f, bikeX, GROUND, 0, undefined, false);
  });

  const front = layer(w, h, (f) => {
    // big dark leaves poking in at the bottom corners, close to us
    const dark = lerpRGB(leafC[0], 0x000000, 0.55);
    for (const [ox, dir] of [
      [-2, 1],
      [w + 1, -1],
    ] as const) {
      for (let k = 0; k < 4; k++) {
        const bx = ox + dir * k * 5;
        const len = 16 - k * 3;
        for (let i = 0; i < len; i++) {
          const y = h - 1 - Math.round(i * 0.9);
          const x = bx + dir * Math.round(i * 0.7);
          const half = Math.round(Math.sin((i / len) * Math.PI) * 3);
          f.hline(x - half, x + half, y, dark);
          f.set(x, y, leafC[0]);
        }
      }
    }
  });

  let lanternOff = !T.night;
  let catLookAt = -Infinity;
  let waveAt = -Infinity;
  let revAt = -Infinity;
  let swarm: { x: number; y: number; t: number } | null = null;

  // shishi-odoshi: a bamboo rocker that fills from a spout, tips, and clacks
  let tipAt = -Infinity;
  function drawRocker(f: Frame, t: number) {
    const CYCLE = 6_000;
    const since = t - tipAt;
    const p = since < 900 ? 1 : ((t % CYCLE) / CYCLE) * 0.95;
    const tipping = since < 900 || p > 0.88;
    const angle = tipping ? -0.55 : 0.5 - p * 0.45;
    const { x, y } = rocker;
    const st = T.stone.map(rgb) as [RGB, RGB, RGB];
    f.rect(x - 22, y - 3, 10, 4, st[1]);
    f.hline(x - 21, x - 13, y - 3, st[2]);
    f.hline(x - 21, x - 13, y - 2, C.water);
    f.rect(x - 1, y - 26, 2, 12, C.tube);
    f.vline(x - 1, y - 26, y - 15, C.tubeHi);
    f.rect(x - 9, y - 26, 9, 2, C.tube);
    f.hline(x - 9, x - 1, y - 26, C.tubeHi);
    if (!tipping) f.set(x - 9, y - 23 + (Math.floor(t / 110) % 4), C.water);
    f.line(x - 3, y, x, y - 7, C.tubeDark);
    f.line(x + 3, y, x, y - 7, C.tubeDark);
    for (let k = -14; k <= 6; k++) {
      const tx = Math.round(x + k * Math.cos(angle));
      const ty = Math.round(y - 7 + k * Math.sin(angle));
      f.set(tx, ty - 1, C.tubeHi);
      f.set(tx, ty, C.tube);
      f.set(tx, ty + 1, C.tubeDark);
    }
    const ex = Math.round(x - 14 * Math.cos(angle));
    const ey = Math.round(y - 7 - 14 * Math.sin(angle));
    f.set(ex, ey, C.tubeDark);
    if (tipping)
      for (let k = 1; k < 6; k++)
        f.blend(ex - 1, ey + k, C.water, 0.85 - k * 0.12);
  }

  // Mark sitting on the bench, facing the garden, laptop on his knees.
  // Bottom row is the ground; the bench seat runs under his thighs (row 15).
  const MARK = [
    '..........hhh....',
    '........hhhhhh...',
    '........shhhhhh..',
    '.......ssshhhhh..',
    '.......sesshhh...',
    '.......ssss.h....',
    '........ss.......',
    '......kkkkkkKk...',
    '.L...kkkkkkkkkk..',
    '.Lc.kkkkkkkkkkk..',
    '.Lc..kkkdkkkkkk..',
    '.Lc.kkkkdkkkkkK..',
    '.Lc.kkkkkkkkkkK..',
    '.LLLLLLkkkkkkkk..',
    '..jjjjjjjjjjjjj..',
    '..JJJJJJJJJJJJ...',
    '..jj.............',
    '..jj.............',
    '..jj.............',
    '..jj.............',
    '.wwww............',
    '.gggg............',
  ];
  const markX0 = markX - 12; // the sprite's left edge
  const markY0 = GROUND - MARK.length;

  /** Mark on the bench, typing; waving when poked. */
  function drawMark(f: Frame, t: number, near: boolean) {
    const waving = t - waveAt < 1800;
    const screenOn = T.night ? C.screen : lerpRGB(C.screen, C.laptop, 0.4);
    sprite(f, MARK, markX0, markY0, {
      h: C.hair,
      s: C.skin,
      e: near ? C.skinShade : C.hair,
      k: C.hoodie,
      K: C.hoodieHi,
      d: C.laptop,
      L: C.laptop,
      c: screenOn,
      j: C.jeans,
      J: C.jeansHi,
      w: C.shoe,
      g: C.laptopDark,
    });
    // the screen lights his face after dark
    if (T.night)
      for (let k = 0; k < 3; k++)
        f.blend(markX0 + 7, markY0 + 3 + k, C.screen, 0.35);
    // hands on the keyboard, typing; one arm up when he waves
    const tap = Math.floor(t / 130) % 2;
    const hy = markY0 + 11;
    f.set(markX0 + 3, hy - (waving ? 0 : tap), C.skin);
    if (waving) {
      const sway = Math.round(Math.sin((t - waveAt) / 120) * 1.5);
      f.line(markX0 + 12, markY0 + 8, markX0 + 14 + sway, markY0 + 1, C.hoodie);
      f.line(
        markX0 + 13,
        markY0 + 8,
        markX0 + 15 + sway,
        markY0 + 1,
        C.hoodieHi
      );
      f.rect(markX0 + 14 + sway, markY0 - 1, 2, 2, C.skin);
    } else {
      f.set(markX0 + 4, hy + 1 - (1 - tap), C.skin);
    }
    // a mug on the bench beside him, steaming
    const mx = markX0 + 17;
    const my = GROUND - 9;
    f.rect(mx, my, 2, 3, C.mug);
    f.set(mx + 2, my + 1, C.mug);
    for (let k = 0; k < 4; k++) {
      const sx = mx + Math.round(Math.sin(t / 400 + k) * 0.8);
      if ((Math.floor(t / 200) + k) % 3)
        f.blend(sx, my - 2 - k * 2, C.steam, 0.5 - k * 0.1);
    }
  }

  function drawCat(f: Frame, t: number) {
    const x = catAt.x;
    const y = catAt.y;
    const curious = t - catLookAt < 2000;
    f.rect(x - 2, y - 6, 5, 6, C.cat);
    f.rect(x - 2, y - 10, 4, 4, C.cat);
    f.set(x - 2, y - 11, C.cat);
    f.set(x + 1, y - 11, C.cat);
    const sw = Math.round(Math.sin(t / (curious ? 120 : 700)) * 1.5);
    f.line(x + 3, y - 1, x + 5, y - 4 + sw, C.cat);
    if (t % 4100 < 140) return; // blink
    const eye = T.night ? C.catEye : lerpRGB(C.catEye, 0x7a6a20, 0.4);
    f.set(x - 1, y - 8, eye);
    f.set(x + 1, y - 8, eye);
    if (curious) {
      f.set(x - 1, y - 9, eye);
      f.set(x + 1, y - 9, eye);
    }
  }

  // fireflies after dark, butterflies by day; both drift towards the pointer
  function critters(
    f: Frame,
    t: number,
    pointer: { x: number; y: number } | null
  ) {
    const s = t / 1000;
    const n = Math.round(w / (T.night ? 26 : 60));
    for (let i = 0; i < n; i++) {
      const drift =
        Math.sin(s * 0.3 + i) * 30 + s * (hash2(i, 2, 40) - 0.5) * 6;
      let x = (((hash2(i, 1, 40) * w + drift) % w) + w) % w;
      let y =
        GROUND - 10 - hash2(i, 3, 40) * 50 + Math.sin(s * 0.7 + i * 2) * 8;
      if (pointer) {
        const d = Math.hypot(pointer.x - x, pointer.y - y);
        if (d < 50) {
          const pull = (1 - d / 50) * 0.6;
          x += (pointer.x - x) * pull + Math.sin(s * 3 + i) * 3;
          y += (pointer.y - y) * pull + Math.cos(s * 3 + i) * 2;
        }
      }
      if (T.night) {
        const pulse = Math.sin(s * 1.7 + i * 1.3);
        if (pulse < 0) continue;
        f.blend(x, y, C.fireflyGlow, 0.3 * pulse);
        f.blend(x - 1, y, C.fireflyGlow, 0.15 * pulse);
        f.blend(x + 1, y, C.fireflyGlow, 0.15 * pulse);
        if (pulse > 0.4) f.set(x, y, C.firefly);
      } else {
        const c = C.butterflies[i % C.butterflies.length]!;
        const open = Math.floor(t / 110 + i) % 2 === 0;
        f.set(x, y, C.bird);
        f.set(x - 1, y - 1, c);
        f.set(x + 1, y - 1, c);
        if (open) {
          f.set(x - 1, y, c);
          f.set(x + 1, y, c);
        }
      }
    }
    if (!swarm) return;
    const age = (t - swarm.t) / 1000;
    if (age > 3) {
      swarm = null;
      return;
    }
    for (let i = 0; i < 14; i++) {
      const ang = hash2(i, 1, 41) * Math.PI * 2;
      const sp = 8 + hash2(i, 2, 41) * 14;
      const x = swarm.x + Math.cos(ang) * sp * age + Math.sin(age * 5 + i) * 2;
      const y =
        swarm.y -
        age * (10 + hash2(i, 3, 41) * 10) +
        Math.sin(ang) * sp * age * 0.4;
      const a = Math.max(0, 1 - age / 3);
      if (T.night) {
        f.blend(x, y, C.fireflyGlow, 0.4 * a);
        if (a > 0.3) f.set(x, y, C.firefly);
      } else if (a > 0.2) {
        const c = C.butterflies[i % C.butterflies.length]!;
        f.set(x - 1, y, c);
        f.set(x + 1, y, c);
        f.set(x, y, C.bird);
      }
    }
  }

  // nearest plant under the pointer, preferring the front rows
  const reach = Math.max(3, Math.min(7, (pitch * Math.max(1, rows)) / 2));
  const noteAt = (x: number, y: number) => {
    let best = -1;
    let bestScore = Infinity;
    spots.forEach((s, i) => {
      const d = Math.min(Math.abs(x - s.x), Math.abs(x - s.base));
      if (d > reach || y < s.y - 6 || y > s.root + 2) return;
      const score = d + s.row * 2;
      if (score < bestScore) {
        best = i;
        bestScore = score;
      }
    });
    return best;
  };
  const onLantern = (x: number, y: number) =>
    Math.abs(x - lanternAt.x) < 6 &&
    y > lanternAt.y - 20 &&
    y < lanternAt.y + 1;
  const onCat = (x: number, y: number) =>
    Math.abs(x - catAt.x) < 5 && y > catAt.y - 12 && y < catAt.y + 1;
  const onRocker = (x: number, y: number) =>
    wide &&
    Math.abs(x - rocker.x + 6) < 16 &&
    y > rocker.y - 28 &&
    y < rocker.y + 4;
  const onMark = (x: number, y: number) =>
    x > markX - 12 && x < markX + 8 && y > GROUND - 24 && y < GROUND + 1;
  const onBike = (x: number, y: number) =>
    wide &&
    x > bikeX - 8 &&
    x < bikeX + 36 &&
    y > GROUND - 24 &&
    y < GROUND + 1;

  return {
    /** Each note's flower in garden pixels (for tooltips), by note index. */
    spots,
    noteAt,
    period,
    render(
      f: Frame,
      t: number,
      hovered = -1,
      pointer: { x: number; y: number } | null = null
    ) {
      f.copyFrom(sky);
      if (cloudLayer) f.over(cloudLayer, Math.round(t / 2400), 0, true);
      fx.draw(f, t);
      f.over(back);
      // morning mist drifting over the bed
      if (T.mist)
        for (let y = GROUND - 16; y < GROUND + 2; y++)
          for (let x = 0; x < w; x++) {
            const n =
              Math.sin(x / 17 + t / 3000 + y * 0.4) +
              Math.sin(x / 7 - t / 2100);
            if (n > 0.9) f.blend(x, y, rgb(T.mist), 0.25);
          }
      // the lantern's light on everything around it
      if (!lanternOff) {
        const flick = Math.sin(t / 130) * 0.04 + Math.sin(t / 47) * 0.03;
        glow(
          f,
          lanternAt.x,
          lanternAt.y - 12,
          16,
          C.flameGlow,
          0.28 + flick,
          1,
          0.12
        );
        f.rect(lanternAt.x - 1, lanternAt.y - 14, 3, 3, C.flame);
      }
      if (T.night)
        for (const [dx, s2] of mushrooms)
          glow(
            f,
            lanternAt.x + dx,
            GROUND - s2,
            4,
            C.mushroom,
            0.25 + Math.sin(t / 900 + dx) * 0.08,
            1,
            0.1
          );
      // nothing planted yet: seeds glowing in the soil, waiting
      if (!spots.length) {
        for (let i = 0; i < 5; i++) {
          const sx = Math.round(left + ((right - left) * (i + 0.5)) / 5);
          const pulse = (Math.sin(t / 1400 + i * 1.9) + 1) / 2;
          glow(
            f,
            sx,
            GROUND + 1,
            4,
            C.seed,
            (0.15 + pulse * 0.25) * (T.night ? 1 : 0.6),
            0.6,
            0.08
          );
          f.set(sx, GROUND + 1, pulse > 0.5 ? C.firefly : C.seed);
        }
      }
      // fireflies (butterflies by day) carrying things between linked notes:
      // a few in the air at once, working through every link over time
      const flying = Math.min(paths.length, Math.max(2, Math.round(w / 90)));
      const LEG = 7_000;
      for (let k = 0; k < flying; k++) {
        const tt = t + (k * LEG) / flying;
        const p = paths[(Math.floor(tt / LEG) * flying + k) % paths.length]!;
        const u = (tt % LEG) / LEG;
        let i: number;
        let a = 1;
        if (u < 0.12) {
          i = 0;
          a = u / 0.12;
        } else if (u < 0.72) {
          const e = (u - 0.12) / 0.6;
          i = Math.round(e * e * (3 - 2 * e) * (p.pts.length - 1));
        } else {
          i = p.pts.length - 1;
          a = 1 - (u - 0.72) / 0.28;
        }
        const [x, y0] = p.pts[i]!;
        const y = y0 - 2 + Math.round(Math.sin(t / 200 + k));
        if (T.night) {
          // a short fading trail while it flies
          if (u >= 0.12 && u < 0.72)
            for (let back = 1; back <= 3; back++) {
              const [bx, by] = p.pts[Math.max(0, i - back * 2)]!;
              f.blend(bx, by - 2, C.fireflyGlow, (0.35 - back * 0.1) * a);
            }
          glow(f, x, y, 4, C.fireflyGlow, 0.45 * a, 1, 0.1);
          if (a > 0.4) f.set(x, y, C.firefly);
        } else if (a > 0.3) {
          const c = C.butterflies[k % C.butterflies.length]!;
          const open = Math.floor(t / 110 + k) % 2 === 0;
          f.set(x, y, C.bird);
          f.set(x - 1, y - 1, c);
          f.set(x + 1, y - 1, c);
          if (open) {
            f.set(x - 1, y, c);
            f.set(x + 1, y, c);
          }
        }
      }
      // the hovered note's own links: streams of light flowing between it
      // and its neighbours, from the note that links to the one it links to
      const lit = new Set<number>();
      const hs = spots[hovered];
      if (hs) {
        const flow = Math.floor(t / 70);
        for (const k of linksOf[hovered] ?? []) {
          const p = paths[k]!;
          lit.add(p.a === hovered ? p.b : p.a);
          p.pts.forEach(([x, y], i) => {
            const on = (((i - flow) % 5) + 5) % 5;
            if (on === 0) {
              f.set(x, y, hs.core);
              f.blend(x, y - 1, hs.color, 0.35);
              f.blend(x, y + 1, hs.color, 0.35);
            } else if (on === 1) f.blend(x, y, hs.color, 0.55);
          });
        }
      }
      // the flowers glow, gently breathing; the hovered one and its friends brighter
      spots.forEach((s, i) => {
        const breathe = Math.sin(t / 1300 + i * 1.7) * 0.06;
        const hot = i === hovered;
        const friend = lit.has(i) && !hot;
        const stage = notes[i]!.stage;
        const r = stage === 'evergreen' ? 13 : stage === 'budding' ? 7 : 4;
        const quiet = hovered >= 0 && !hot && !friend;
        const strength =
          (hot ? 0.6 : friend ? 0.5 : quiet ? 0.12 : 0.34) *
            Math.max(T.glow, hot || friend ? 0.6 : 0) +
          (quiet ? 0 : breathe * T.glow);

        glow(f, s.x, s.y, hot ? r + 4 : r, s.color, strength, 1, 0.1);
        if (hot || friend) f.set(s.x, s.y, s.core);
      });
      if (wide) drawRocker(f, t);
      // the bike ticking over when poked: a puff from the exhaust, the headlight on
      const rev = t - revAt;
      if (wide && rev < 1600) {
        glow(
          f,
          bikeX + 33,
          GROUND - 13,
          6,
          C.flame,
          0.6 * (1 - rev / 1600),
          1,
          0.1
        );
        for (let k = 0; k < 4; k++) {
          const a = rev / 1000 - k * 0.15;
          if (a < 0 || a > 1) continue;
          f.blend(
            bikeX - 6 - a * 14,
            GROUND - 6 - a * 6 - k,
            C.steam,
            0.6 * (1 - a)
          );
        }
      }
      drawMark(f, t, !!pointer && onMark(pointer.x, pointer.y));
      drawCat(f, t);
      critters(f, t, pointer);
      // the pond: a rippling mirror of the bed and everything on it
      const pond = rgb(T.pond);
      for (let y = POND + 1; y < h; y++) {
        const d = y - POND;
        const sy = POND - d;
        const wob = Math.round(Math.sin(y * 0.9 + t / 420) * (0.5 + d / 10));
        const fade =
          0.78 *
          (1 - d / (h - POND + 10)) *
          ((d + Math.floor(t / 600)) % 4 === 0 ? 0.55 : 1);
        for (let x = 0; x < w; x++)
          f.set(x, y, lerpRGB(pond, f.get(x + wob, sy), fade));
      }
      // each flower lays a streak of its colour across the water after dark
      if (T.glow > 0.3)
        spots.forEach((s, i) => {
          const hotNote = i === hovered;
          for (let y = POND + 2; y < h; y += 2) {
            const wob = Math.round(Math.sin(y * 0.8 + t / 350 + i) * 1.2);
            const a =
              (hotNote ? 0.6 : 0.42) * T.glow * (1 - (y - POND) / (h - POND));
            f.blend(s.x + wob, y, s.color, a);
            f.blend(s.x + wob + 1, y, s.color, a * 0.5);
          }
        });
      // glints on the water
      const pondHi = rgb(T.pondHi);
      for (let i = 0; i < Math.round(w / 30); i++) {
        if (Math.sin(t / 600 + i * 2.1) < 0.5) continue;
        const gx = Math.floor(hash2(i, 1, 39) * w);
        const gy = POND + 3 + Math.floor(hash2(i, 2, 39) * (h - POND - 4));
        f.hline(gx, gx + 2, gy, pondHi);
      }
      f.over(front);
      const s = spots[hovered];
      if (s) {
        const ay = s.y - 9 + Math.round(Math.sin(t / 160));
        f.hline(s.x - 2, s.x + 2, ay - 2, s.core);
        f.hline(s.x - 1, s.x + 1, ay - 1, s.core);
        f.set(s.x, ay, s.color);
      }
    },
    /** Clicks that aren't on a note. */
    poke(x: number, y: number, t: number) {
      if (onLantern(x, y)) lanternOff = !lanternOff;
      else if (onRocker(x, y)) {
        if (t - tipAt > 900) tipAt = t;
      } else if (onMark(x, y)) {
        if (t - waveAt > 1800) waveAt = t;
      } else if (onBike(x, y)) {
        if (t - revAt > 1600) revAt = t;
      } else if (onCat(x, y)) {
        if (t - catLookAt > 2000) catLookAt = t;
      } else if (y < GROUND - 40) {
        if (T.night) shootingStar(fx, t, x, y, C.starHi, x < w / 2 ? 1 : -1);
        else flock(fx, t, x, y, C.bird, { count: 4, seed: Math.round(t) });
      } else if (!swarm || t - swarm.t > 3000) swarm = { x, y, t };
    },
    hot(x: number, y: number) {
      return (
        noteAt(x, y) >= 0 ||
        onLantern(x, y) ||
        onCat(x, y) ||
        onRocker(x, y) ||
        onMark(x, y) ||
        onBike(x, y)
      );
    },
  };
}

export type Garden = ReturnType<typeof createGarden>;
