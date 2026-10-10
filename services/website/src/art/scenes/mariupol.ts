// Mariupol on a July afternoon, from the bluff above the city beach. The Sea
// of Azov is warm, shallow and busy: swimmers bobbing inside the buoy line,
// people standing waist-deep far out, a pedalo, an airbed. A long wooden
// pier runs out to a little striped lighthouse, the pleasure boat chugs
// across behind it, the port cranes work on one side of the bay and the
// steelworks steam on the far shore. On the sand: umbrellas, the lifeguard
// tower, a yellow kvass barrel with its queue, watermelon on a towel.
//
// Click the sky to fly a kite, the water to splash (swimmers duck under), a
// gull (or the ones standing at the water's edge) to send it flapping off,
// the lighthouse to light its lamp, the boat to sound its horn, and the
// nearest goby fisherman on the pier to land a bychok (which a gull steals).

import { type Frame, type RGB, sprite } from '../frame';
import { Fx, ripple, sparkle, splash } from '../fx';
import { fbm1, hash2 } from '../noise';
import { clouds, glow, gradient } from '../paint';
import { layer, palette, type Scene } from '../scene';

const P = palette({
  sky0: '#2a64c4',
  sky1: '#3878d2',
  sky2: '#4c8edc',
  sky3: '#67a5e3',
  sky4: '#8cbde8',
  sky5: '#b6d6ec',
  haze: '#dce9e8',
  sun: '#fffef4',
  sunGlow: '#fff1b0',
  cloudLight: '#ffffff',
  cloudBase: '#e3edf8',
  cloudShadow: '#adbedc',
  // far shore, softened by haze
  far0: '#b4c6d8',
  far1: '#9fb3cc',
  far2: '#8aa0be',
  farLit: '#d0dce6',
  chimRed: '#d0959a',
  chimWhite: '#e8eef2',
  steam: '#ffffff',
  steam2: '#eef3f7',
  steam3: '#d8e3ee',
  crane: '#de8f62',
  craneSh: '#ac7480',
  hull: '#86617e',
  hullHi: '#a07a92',
  white: '#f7f6f0',
  // sea
  seaLine: '#235b8c',
  sea0: '#2b6c9e',
  sea1: '#3580ab',
  sea2: '#4094b4',
  sea3: '#50a8ba',
  sea4: '#66bbbd',
  sea5: '#86cdbf',
  shallow: '#a6dcc6',
  glint: '#f4feff',
  glint2: '#bfeaf0',
  foam: '#ffffff',
  foam2: '#d8f4ee',
  under: '#1f5378',
  // sand
  sandWet2: '#b89870',
  sandWet: '#cdb084',
  sandDamp: '#dfc494',
  sandFar: '#ecd29e',
  sand: '#f3daa6',
  sandHi: '#fbe9c2',
  sandSh: '#d9ac76',
  sandSh2: '#c08a5c',
  shadow: '#a8705a',
  // pier
  deckTop: '#d2a472',
  deckSeam: '#b4865a',
  deckSide: '#8e5c40',
  deckSideSh: '#6a4036',
  pile: '#6a4a40',
  pileWet: '#3e4058',
  railLit: '#fbf8f0',
  railSh: '#b8b2b8',
  lamp: '#fffbe6',
  // lighthouse
  lhWhite: '#fbfaf4',
  lhWhiteSh: '#c4c4d0',
  lhRed: '#e0453a',
  lhRedHi: '#f2705a',
  lhRedSh: '#a42e3c',
  lhDark: '#3a3448',
  glass: '#bfe0ec',
  lampOn: '#fff3a0',
  beam: '#fff6c8',
  // people
  skin: '#f0b98e',
  skinSh: '#cc8866',
  tan: '#d89a6c',
  tanSh: '#a8664e',
  hair: '#4a2e2a',
  hairFair: '#e0b866',
  hairRed: '#b8562e',
  // umbrellas, swimsuits, towels, toys
  red: '#e2443a',
  redSh: '#a82e3c',
  blue: '#2f72d0',
  blueSh: '#2a4ea0',
  yellow: '#f6c63c',
  yellowSh: '#d08c2a',
  yellowHi: '#ffe68c',
  green: '#3cae78',
  greenSh: '#2a7a64',
  orange: '#f28a3a',
  orangeSh: '#c25a34',
  pink: '#f07aa8',
  pinkSh: '#c04c84',
  navy: '#2a3a72',
  teal: '#2fb3b0',
  tealSh: '#1f7c88',
  purple: '#8a5ac8',
  purpleSh: '#5e3c96',
  lime: '#a6d03e',
  limeSh: '#6e9a2e',
  canvas: '#fbf8ee',
  canvasSh: '#d0c8cc',
  pole: '#6a5a58',
  ink: '#2e2a3a',
  wood: '#b07c52',
  woodSh: '#7a5040',
  melon: '#3e8a3c',
  melonSh: '#2a6236',
  melonHi: '#7cc05c',
  flesh: '#ee4a48',
  gull: '#ffffff',
  gullSh: '#aab4c8',
  gullTip: '#2c2e40',
  gullWing: '#76809c',
  beak: '#f2b23a',
  string: '#5a5a70',
});

const HORIZON = 64;
const SHORE = 112; // mean waterline on the beach
// a simple camera: the water at depth z sits at HORIZON + CAM / z
const CAM = 64;
const Z_NEAR = 0.5;
const Z_FAR = 3;
const DECK = 12; // pier deck height above the water, in world px (= screen px at z = 1)
const HALF = 7; // half the deck's width
const RAIL = 6;

type Pt = [number, number];
type Duo = [RGB, RGB];

const COLORS: Duo[] = [
  [P.red, P.redSh],
  [P.blue, P.blueSh],
  [P.yellow, P.yellowSh],
  [P.green, P.greenSh],
  [P.orange, P.orangeSh],
  [P.pink, P.pinkSh],
];
const TOWELS: Duo[] = [
  [P.teal, P.tealSh],
  [P.purple, P.purpleSh],
  [P.lime, P.limeSh],
  [P.pink, P.pinkSh],
  [P.blue, P.blueSh],
];
const SKINS: Duo[] = [
  [P.skin, P.skinSh],
  [P.tan, P.tanSh],
  [P.skin, P.skinSh],
];
const HAIRS = [P.hair, P.hairFair, P.hair, P.hairRed, P.hair];

// people, about 10 px tall: h hair, s/S skin lit/shade, c/C swimsuit lit/shade
const MAN = [
  '.hh.',
  '.sS.',
  'ssSS',
  'ssSS',
  'ssSS',
  '.cC.',
  '.cC.',
  '.sS.',
  '.sS.',
  '.sS.',
];
const WOMAN = [
  '.hh.',
  'hsSh',
  '.sS.',
  'scCS',
  'scCS',
  '.cC.',
  '.cC.',
  '.sS.',
  '.sS.',
  '.sS.',
];
const KID = ['.h.', '.sS', 'scS', '.cC', '.cC', '.sS', '.sS'];
const STEP = ['.s.S', 's..S'];
const KITE = [
  '...r...',
  '..rrY..',
  '.rrrYY.',
  'rrrkYYY',
  '.yyRyY.',
  '..yRY..',
  '...R...',
];

// gulls: wings up, level, down
// gulls in flight: wings up, gliding, wings down; the body sits on row 2
const GULL = [
  ['k.........k', '.ww.....ww.', '..gwwswwg..'],
  ['...........', '..www.www..', '.gggwswggg.', 'k.........k'],
  ['...........', '...........', '..wwwswww..', '.gg.....gg.', 'k.........k'],
];
const GULL_SMALL = [
  ['k.....k', '.w...w.', '.gwswg.'],
  ['.......', '.ww.ww.', 'kggsggk'],
  ['.......', '.......', '.wwsww.', 'k.....k'],
];
const STANDING_GULL = ['.ww....', 'bwwg...', '.wwwggk', '..wsgg.', '..b.b..'];

/** Paints a person sprite with its own palette. */
function person(
  f: Frame,
  rows: string[],
  x: number,
  foot: number,
  skin: Duo,
  hair: RGB,
  suit: Duo,
  flip = false
) {
  sprite(
    f,
    rows,
    x,
    foot - rows.length + 1,
    { h: hair, s: skin[0], S: skin[1], c: suit[0], C: suit[1] },
    flip
  );
}

/** A tiny figure for far away: one or two pixels wide, `ht` tall. */
function tiny(
  f: Frame,
  x: number,
  foot: number,
  ht: number,
  skin: RGB,
  top: RGB,
  step: number
) {
  x = Math.round(x);
  foot = Math.round(foot);
  if (ht < 3) return;
  f.set(x, foot - ht + 1, skin);
  for (let y = foot - ht + 2; y <= foot - Math.floor(ht / 2.6); y++)
    f.set(x, y, top);
  for (let y = foot - Math.floor(ht / 2.6) + 1; y <= foot; y++)
    f.set(x, y, P.skinSh);
  if (ht >= 6) {
    f.vline(x + 1, foot - ht + 2, foot - Math.floor(ht / 2.6), top);
    f.set(x + (step ? 1 : 0), foot, P.skinSh);
  }
}

/** Beach umbrella: striped dome, pole, and its shadow thrown down-right. */
function umbrella(
  f: Frame,
  x: number,
  base: number,
  r: number,
  col: Duo,
  ground: Frame = f
) {
  const top = base - Math.round(r * 1.75);
  const drop = Math.round(r * 0.55);
  // shadow on the sand
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -r - 1; dx <= r + 1; dx++) {
      if ((dx * dx) / ((r + 1) * (r + 1)) + (dy * dy) / 2.3 > 1) continue;
      ground.blend(x + dx + Math.round(r * 0.7), base + dy, P.shadow, 0.4);
    }
  f.vline(x, top, base, P.pole);
  for (let dx = -r; dx <= r; dx++) {
    const u = dx / r;
    const y0 = top + Math.round(u * u * drop);
    const panel = Math.floor(((dx + r) * 6) / (2 * r + 1));
    const striped = panel % 2 === 0;
    const shade = u > 0.3;
    const c = striped
      ? shade
        ? col[1]
        : col[0]
      : shade
        ? P.canvasSh
        : P.canvas;
    const y1 = top + drop + 1 + (Math.abs(dx) === r ? 1 : 0);
    f.vline(x + dx, y0, y1, c);
    // a lighter top edge where the sun catches the dome
    if (u < 0.1 && u > -0.85)
      f.set(x + dx, y0, striped ? lighten(col[0]) : P.white);
  }
  f.set(x, top - 1, P.pole);
}

const lightCache = new Map<RGB, RGB>();
function lighten(c: RGB) {
  let v = lightCache.get(c);
  if (v === undefined) {
    const r = Math.min(255, (c >> 16) + 34);
    const g = Math.min(255, ((c >> 8) & 0xff) + 30);
    const b = Math.min(255, (c & 0xff) + 18);
    v = (r << 16) | (g << 8) | b;
    lightCache.set(c, v);
  }
  return v;
}

/** A towel seen from above: flat, with a band at each end. */
function towel(f: Frame, x: number, y: number, len: number, col: Duo) {
  f.hline(x, x + len - 1, y, col[0]);
  f.hline(x, x + len - 1, y + 1, col[0]);
  f.hline(x, x + len - 1, y + 2, col[1]);
  for (const bx of [x + 1, x + len - 2]) f.vline(bx, y, y + 1, P.canvas);
}

/** Someone sunbathing on their back, head to the left. */
function sunbather(
  f: Frame,
  x: number,
  y: number,
  skin: Duo,
  hair: RGB,
  suit: Duo
) {
  f.vline(x + 1, y, y + 1, hair);
  f.hline(x + 2, x + 9, y, skin[0]);
  f.hline(x + 2, x + 9, y + 1, skin[1]);
  f.hline(x + 4, x + 6, y, suit[0]);
  f.hline(x + 4, x + 6, y + 1, suit[1]);
  f.set(x + 7, y + 1, skin[1]);
}

/** The old-style beach shade: a tin cone on a thick post, painted in segments. */
function mushroom(
  f: Frame,
  x: number,
  base: number,
  r: number,
  col: Duo,
  ground: Frame = f
) {
  const top = base - r * 2 + 1;
  for (let dy = -1; dy <= 2; dy++)
    for (let dx = -r - 1; dx <= r + 1; dx++) {
      if ((dx * dx) / ((r + 1) * (r + 1)) + (dy * dy) / 4 > 1) continue;
      ground.blend(x + dx + 4, base + dy, P.shadow, 0.4);
    }
  f.rect(x, top + 3, 2, base - top - 2, P.pole);
  f.set(x, top + 3, P.ink);
  for (let k = 0; k < 4; k++) {
    const half = Math.round(1 + (r * (k + 1)) / 4);
    for (let dx = -half; dx <= half + 1; dx++) {
      const seg = Math.floor((dx + r + 2) / 3) % 2 === 0;
      const shade = dx > half * 0.35;
      f.set(
        x + dx,
        top + k,
        seg ? (shade ? col[1] : col[0]) : shade ? P.canvasSh : P.canvas
      );
    }
  }
  f.hline(x - r - 1, x + r + 2, top + 4, P.ink);
  f.set(x, top - 1, P.ink);
}

export const mariupol: Scene = {
  id: 'mariupol',
  name: 'Mariupol',
  country: 'Ukraine',
  create(w, h) {
    const fx = new Fx();
    const cx = Math.round(w / 2);
    const sunX = Math.round(cx - Math.min(150, w * 0.36));
    const sunY = 13;

    // ---------- the pier, in perspective ----------
    const X0 = Math.min(150, w * 0.38) * Z_NEAR;
    const X1 = Math.min(46, w * 0.13) * Z_FAR;
    const zAt = (u: number) => Z_NEAR + (Z_FAR - Z_NEAR) * u;
    const proj = (u: number, side: number, Y: number, dx = 0): Pt => {
      const z = zAt(u);
      return [
        cx + (X0 + (X1 - X0) * u + side * HALF + dx) / z,
        HORIZON + (CAM - Y) / z,
      ];
    };
    const [lhX, lhBase] = proj(1, 0, DECK).map(Math.round) as Pt;
    const LH_H = 26;

    // the shoreline wiggles a little
    const edge = Array.from(
      { length: w },
      (_, x) => SHORE + Math.round((fbm1(x / 45, 21) - 0.5) * 5)
    );
    const edgeAt = (x: number) =>
      edge[Math.max(0, Math.min(w - 1, Math.round(x)))]!;

    // mask of where the pier and its shadow are, so props keep clear of it
    const mask = new Uint8Array(w * h);
    const masked = (x0: number, y0: number, x1: number, y1: number) => {
      for (let y = Math.max(0, y0); y <= Math.min(h - 1, y1); y++)
        for (let x = Math.max(0, x0); x <= Math.min(w - 1, x1); x++)
          if (mask[y * w + x]) return true;
      return x0 < 0 || x1 >= w;
    };
    const claim = (x0: number, y0: number, x1: number, y1: number) => {
      for (let y = Math.max(0, y0); y <= Math.min(h - 1, y1); y++)
        for (let x = Math.max(0, x0); x <= Math.min(w - 1, x1); x++)
          mask[y * w + x] = 1;
    };

    // ---------- static layers ----------
    const base = layer(w, h, (f) => {
      gradient(f, 0, HORIZON, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.haze,
      ]);
      glow(f, sunX, sunY, 17, P.sunGlow, 0.55, 1, 0.12);
      f.disc(sunX, sunY, 3, P.sun);
      // the sea: deep blue at the horizon, turquoise over the sandbanks
      gradient(f, HORIZON, SHORE + 4, [
        P.sea0,
        P.sea1,
        P.sea2,
        P.sea3,
        P.sea4,
        P.sea5,
        P.shallow,
      ]);
      f.hline(0, w, HORIZON, P.seaLine);
      // sandbars showing through the shallows
      for (let x = 0; x < w; x++) {
        const n = fbm1(x / 38, 33);
        if (n > 0.56) f.hline(x, x, SHORE - 13 + Math.round(n * 3), P.sea5);
        if (fbm1(x / 30, 34) > 0.6) f.set(x, SHORE - 7, P.shallow);
      }
      // the beach
      gradient(f, SHORE - 3, h, [P.sandFar, P.sand, P.sand, P.sandHi]);
      for (let x = 0; x < w; x++) {
        const e = edge[x]!;
        for (let y = SHORE - 6; y < e; y++)
          f.set(x, y, y > e - 4 ? P.shallow : f.get(x, y));
        f.set(x, e, P.sandWet2);
        f.set(x, e + 1, P.sandWet);
        f.set(x, e + 2, P.sandWet);
        f.set(x, e + 3, P.sandDamp);
        if (hash2(x >> 2, 0, 7) > 0.5) f.set(x, e + 4, P.sandDamp);
      }
      // wind ripples in the dry sand
      for (let i = 0; i < w / 18; i++) {
        const x = Math.floor(hash2(i, 1, 11) * w);
        const y = SHORE + 8 + Math.floor(hash2(i, 2, 11) * (h - SHORE - 8));
        const len = 2 + Math.floor(hash2(i, 3, 11) * 3) + (y > 135 ? 1 : 0);
        f.hline(x, x + len, y, P.sandSh);
        f.hline(x + 1, x + len - 1, y - 1, P.sandHi);
      }
      // footprints down to the water
      for (let k = 0; k < 14; k++) {
        const y = h - 3 - k * 3;
        if (y < SHORE + 5) break;
        const x =
          cx -
          Math.min(18, w * 0.05) +
          Math.round(Math.sin(k * 0.35) * 6) +
          (k % 2) * 2;
        f.hline(x, x + 1, y, P.sandSh);
      }
      // the pier's shadow, thrown to the right by the afternoon sun
      f.poly(
        [
          proj(0, -1, 0, 4),
          proj(1, -1, 0, 4),
          proj(1, 1, 0, 8),
          proj(0, 1, 0, 8),
        ],
        (x, y) => {
          f.blend(
            x,
            y,
            y >= edgeAt(x) ? P.shadow : P.under,
            y >= edgeAt(x) ? 0.32 : 0.45
          );
          return null;
        }
      );
    });

    const cloudLayer = layer(w, h, (f) => {
      clouds(f, {
        seed: 104,
        y0: 6,
        y1: 40,
        cell: 11,
        coverage: 0.4,
        stretch: 2.6,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });

    // port on the left of the bay, steelworks on the far shore to the right
    const portX0 = Math.round(cx - Math.min(205, w * 0.49));
    const portX1 = Math.round(cx - Math.min(70, w * 0.17));
    const steelX0 = Math.round(cx + Math.min(105, w * 0.27));
    const steelX1 = Math.min(w + 4, Math.round(cx + Math.min(220, w * 0.52)));
    const cranes: { x: number; dir: number; ang: number; anim: boolean }[] = [];
    const chimneys: { x: number; top: number; seed: number }[] = [];
    const far = layer(w, h, (f) => {
      // low far coast on the right
      for (let x = steelX0 - 30; x < w; x++) {
        const top = HORIZON - 2 - Math.round(fbm1(x / 24, 5) * 3);
        f.vline(x, top, HORIZON - 1, P.far0);
      }
      // steelworks: sheds, a couple of blast furnaces, tall striped stacks
      let x = steelX0;
      for (let i = 0; x < steelX1; i++) {
        const r = (k: number) => hash2(i, k, 19);
        const bw = 6 + Math.floor(r(1) * 10);
        const bh = 3 + Math.floor(r(2) * 6);
        f.rect(x, HORIZON - 1 - bh, bw, bh, P.far1);
        f.hline(x, x + bw - 1, HORIZON - 1 - bh, P.farLit);
        f.vline(x, HORIZON - bh, HORIZON - 1, P.farLit);
        if (r(3) > 0.55) {
          // blast furnace: a fat tapering tower with a pipe off its top
          const fx0 = x + 2;
          for (let k = 0; k < 13; k++) {
            const half = k < 8 ? 2 : 1;
            f.hline(
              fx0 - half,
              fx0 + half,
              HORIZON - 2 - bh - k,
              k % 5 === 0 ? P.far2 : P.far1
            );
            f.set(fx0 - half, HORIZON - 2 - bh - k, P.farLit);
          }
          f.line(fx0 + 1, HORIZON - 14 - bh, fx0 + 7, HORIZON - 4 - bh, P.far2);
        }
        if (i % 3 === 1) {
          const top = HORIZON - 1 - bh - 14 - Math.floor(r(4) * 9);
          const sx = x + bw - 3;
          for (let y = top; y < HORIZON - 1 - bh; y++) {
            const band = Math.floor((y - top) / 3) % 2 === 0 && y - top < 9;
            f.set(sx, y, band ? P.chimRed : P.chimWhite);
            f.set(sx + 1, y, band ? P.chimRed : P.far1);
          }
          chimneys.push({ x: sx, top, seed: i });
        }
        x += bw + Math.floor(r(5) * 4);
      }
      // the port: quay, sheds, a grain elevator, a ship alongside
      if (portX1 > 4) {
        f.rect(portX0, HORIZON - 3, portX1 - portX0, 3, P.far1);
        f.hline(portX0, portX1 - 1, HORIZON - 3, P.farLit);
        const ex = portX0 + Math.round((portX1 - portX0) * 0.12);
        f.rect(ex, HORIZON - 17, 9, 14, P.far0);
        f.rect(ex + 2, HORIZON - 20, 5, 3, P.far0);
        f.vline(ex, HORIZON - 17, HORIZON - 4, P.farLit);
        for (let y = HORIZON - 15; y < HORIZON - 4; y += 3)
          f.hline(ex + 1, ex + 7, y, P.far1);
        for (let sx = ex + 12; sx < portX1 - 6; sx += 14) {
          f.rect(sx, HORIZON - 7, 9, 4, P.far1);
          f.hline(sx, sx + 8, HORIZON - 7, P.farLit);
        }
        // a cargo ship moored along the quay
        const shipX = portX0 + Math.round((portX1 - portX0) * 0.42);
        const shipL = Math.min(40, Math.round((portX1 - portX0) * 0.4));
        f.rect(shipX, HORIZON - 5, shipL, 4, P.hull);
        f.hline(shipX, shipX + shipL - 1, HORIZON - 5, P.hullHi);
        f.rect(shipX + 3, HORIZON - 9, 6, 4, P.white);
        f.hline(shipX + 4, shipX + 7, HORIZON - 8, P.far2);
        f.vline(shipX + 5, HORIZON - 12, HORIZON - 10, P.far2);
        f.vline(shipX + shipL - 5, HORIZON - 9, HORIZON - 6, P.far2);
        // cranes along the quay
        const n = Math.max(2, Math.floor((portX1 - portX0) / 28));
        for (let k = 0; k < n; k++) {
          const crx =
            Math.round(portX0 + ((k + 0.5) / n) * (portX1 - portX0)) + 4;
          cranes.push({
            x: crx,
            dir: k % 2 ? 1 : -1,
            ang: 0.6 + hash2(k, 1, 23) * 0.5,
            anim: k === n - 1,
          });
        }
      }
    });

    function crane(
      f: Frame,
      c: { x: number; dir: number; ang: number },
      ang: number,
      hookDrop: number
    ) {
      const b = HORIZON - 3;
      // portal legs and the slewing house
      f.vline(c.x - 3, b - 5, b, P.craneSh);
      f.vline(c.x + 3, b - 5, b, P.craneSh);
      f.hline(c.x - 3, c.x + 3, b - 6, P.crane);
      f.rect(c.x - 2, b - 10, 5, 4, P.crane);
      f.vline(c.x + 2, b - 10, b - 7, P.craneSh);
      // A-frame and jib
      f.line(c.x - 1, b - 11, c.x, b - 16, P.craneSh);
      f.line(c.x + 1, b - 11, c.x, b - 16, P.craneSh);
      const L = 17;
      const tx = c.x + c.dir * Math.cos(ang) * L;
      const ty = b - 10 - Math.sin(ang) * L;
      f.line(c.x, b - 10, tx, ty, P.crane);
      f.line(c.x, b - 16, tx, ty, P.craneSh);
      f.vline(
        Math.round(tx),
        Math.round(ty) + 1,
        Math.round(ty) + hookDrop,
        P.far2
      );
    }

    function plume(f: Frame, x: number, y: number, t: number, seed: number) {
      const EVERY = 600;
      const LIFE = 6600;
      const latest = Math.floor(t / EVERY);
      for (let k = Math.ceil(LIFE / EVERY); k >= 0; k--) {
        const id = latest - k;
        const age = t - id * EVERY;
        if (age < 0 || age > LIFE) continue;
        const a = age / LIFE;
        const px = x + 1 + a * 22 + Math.sin(id * 1.3 + seed) * a * 2;
        const py = y - 1 - a * 7 - Math.sqrt(a) * 3;
        const grow = 0.5 + a * 2.6 * (0.8 + hash2(id, 1, seed) * 0.4);
        const r = a < 0.7 ? grow : grow * (1 - (a - 0.7) / 0.3);
        const c = a < 0.25 ? P.steam : a < 0.6 ? P.steam2 : P.steam3;
        if (r > 0.4) f.disc(px, py, r, c);
      }
    }

    // ---------- the pier ----------
    const pierLayer = layer(w, h, (f) => {
      // under the deck: water in shadow, sand in shadow nearer in
      const foot: Pt[] = [
        proj(0, -1, 0),
        proj(1, -1, 0),
        proj(1, 1, 0),
        proj(0, 1, 0),
      ];
      f.poly(foot, (x, y) => (y >= edgeAt(x) ? P.sandSh : P.under));
      // piles on the far side, then the near side
      let last = Infinity;
      for (let k = 0; ; k++) {
        const u = k * 0.045;
        if (u > 1) break;
        const [, py] = proj(u, -1, 0);
        if (Math.abs(last - py) < 2.5) continue;
        last = py;
        for (const side of [1, -1]) {
          const [x0, y0] = proj(u, side, DECK - 2);
          const [, y1] = proj(u, side, 0);
          const x = Math.round(x0);
          const wide = zAt(u) < 1.3 ? 2 : 1;
          for (let y = Math.round(y0); y <= Math.round(y1); y++) {
            const wet = y >= edgeAt(x) ? false : y > y1 - 2.5;
            f.set(x, y, side === 1 ? P.deckSideSh : wet ? P.pileWet : P.pile);
            if (wide === 2)
              f.set(
                x + 1,
                y,
                side === 1 ? P.deckSideSh : wet ? P.pileWet : P.deckSideSh
              );
          }
        }
      }
      // the far-side railing peeks over the deck
      const rail = (side: number, c: RGB, posts: boolean) => {
        f.line(...proj(0, side, DECK + RAIL), ...proj(1, side, DECK + RAIL), c);
        if (!posts) return;
        let prev = Infinity;
        for (let k = 0; ; k++) {
          const u = k * 0.03;
          if (u > 1) break;
          const [x, y0] = proj(u, side, DECK + RAIL);
          if (Math.abs(prev - x) < 4 || zAt(u) > (side === 1 ? 2 : 2.6))
            continue;
          prev = x;
          const [, y1] = proj(u, side, DECK);
          f.vline(Math.round(x), Math.round(y0), Math.round(y1), c);
        }
      };
      rail(1, P.railSh, true);
      // deck top and the near side face
      f.poly(
        [
          proj(0, -1, DECK),
          proj(0, 1, DECK),
          proj(1, 1, DECK),
          proj(1, -1, DECK),
        ],
        P.deckTop
      );
      f.poly(
        [
          proj(0, -1, DECK),
          proj(1, -1, DECK),
          proj(1, -1, DECK - 2.5),
          proj(0, -1, DECK - 2.5),
        ],
        P.deckSide
      );
      f.line(
        ...proj(0, -1, DECK - 2.5),
        ...proj(1, -1, DECK - 2.5),
        P.deckSideSh
      );
      // plank seams, only where they're far enough apart to read
      let seam = Infinity;
      for (let k = 0; ; k++) {
        const u = k * 0.025;
        if (u > 1) break;
        const a = proj(u, -1, DECK);
        const b = proj(u, 1, DECK);
        if (Math.abs(seam - a[1]) < 4 || zAt(u) > 1.8) continue;
        seam = a[1];
        f.line(a[0] + 1, a[1], b[0] - 1, b[1], P.deckSeam);
      }
      rail(-1, P.railLit, true);
      f.line(
        ...proj(0, -1, DECK + RAIL / 2),
        ...proj(0.6, -1, DECK + RAIL / 2),
        P.railSh
      );
      // lamp posts along the near railing
      for (let u = 0.08; u < 0.9; u += 0.2) {
        const [x, y0] = proj(u, -1, DECK + 17);
        const [, y1] = proj(u, -1, DECK);
        const z = zAt(u);
        f.vline(Math.round(x), Math.round(y0), Math.round(y1), P.pole);
        if (z < 1.6) {
          f.rect(Math.round(x) - 1, Math.round(y0) - 2, 3, 2, P.lamp);
          f.hline(
            Math.round(x) - 1,
            Math.round(x) + 1,
            Math.round(y0) - 3,
            P.pole
          );
        } else {
          f.set(Math.round(x), Math.round(y0) - 1, P.lamp);
        }
      }
      // pier head under the lighthouse
      f.rect(lhX - 5, lhBase, 11, 2, P.railLit);
      f.hline(lhX - 5, lhX + 5, lhBase + 2, P.railSh);
      f.hline(lhX - 4, lhX + 4, lhBase + 3, P.pileWet);
      lighthouse(f, lhX, lhBase, false);
      // mask the pier, its shadow and the area under it
      const shadow: Pt[] = foot.map(([x, y]) => [x + 6, y]);
      const tmp = layer(w, h, (g) => {
        g.poly(foot, P.ink);
        g.poly(shadow, P.ink);
        g.poly(
          [
            proj(0, -1, DECK + RAIL),
            proj(1, -1, DECK + RAIL),
            proj(1, 1, 0),
            proj(0, 1, 0),
          ],
          P.ink
        );
      });
      for (let i = 0; i < w * h; i++)
        if (tmp.pixels[i]! >>> 24 || f.pixels[i]! >>> 24) mask[i] = 1;
    });

    function lighthouse(f: Frame, x: number, b: number, lit: boolean) {
      // tapered tower, white with red bands, lit from the left
      for (let k = 0; k < LH_H - 7; k++) {
        const y = b - 1 - k;
        const half = k < 7 ? 3 : 2;
        const red = Math.floor(k / 4) % 2 === 1;
        for (let dx = -half; dx <= half; dx++) {
          let c = red ? P.lhRed : P.lhWhite;
          if (dx >= half - 1 + (half === 3 ? 0 : 1))
            c = red ? P.lhRedSh : P.lhWhiteSh;
          if (dx === -half && red) c = P.lhRedHi;
          f.set(x + dx, y, c);
        }
      }
      f.vline(x - 1, b - 3, b - 1, P.lhDark); // door
      f.set(x, b - 13, P.lhDark); // windows
      f.set(x, b - 6, P.lhDark);
      const g = b - LH_H + 7; // gallery
      f.hline(x - 4, x + 4, g, P.lhDark);
      f.set(x - 4, g - 1, P.lhDark);
      f.set(x + 4, g - 1, P.lhDark);
      f.hline(x - 4, x + 4, g - 2, P.lhDark);
      f.rect(x - 2, g - 4, 5, 3, lit ? P.lampOn : P.glass);
      f.vline(x - 2, g - 4, g - 1, P.lhDark);
      f.vline(x + 2, g - 4, g - 1, P.lhDark);
      f.set(x, g - 3, lit ? P.white : P.lampOn);
      f.hline(x - 3, x + 3, g - 5, P.lhRedSh);
      f.hline(x - 2, x + 2, g - 6, P.lhRed);
      f.hline(x - 1, x + 1, g - 7, P.lhRed);
      f.set(x - 1, g - 6, P.lhRedHi);
      f.vline(x, g - 9, g - 8, P.lhDark);
    }
    const lampY = lhBase - LH_H + 4;

    // ---------- the beach ----------
    const kvassX = Math.round(cx - Math.min(108, w * 0.25));
    const kvassY = 135;
    const towerX = Math.round(cx - Math.min(168, w * 0.4));
    const towerY = SHORE + 10;
    const kidX = Math.round(cx - Math.min(48, w * 0.12));
    const kidY = 124;
    const melonX = Math.round(cx - Math.min(150, w * 0.42));
    const ballA = { x: Math.round(cx - Math.min(92, w * 0.2)), y: SHORE + 8 };
    const ballB = { x: ballA.x + 24, y: SHORE + 9 };

    const props = layer(w, h, (f) => {
      // lifeguard tower near the water
      claim(towerX - 7, towerY - 24, towerX + 9, towerY + 2);
      claim(kvassX - 12, kvassY - 14, kvassX + 22, kvassY + 2);
      claim(kidX - 3, kidY - 10, kidX + 9, kidY + 1);
      claim(melonX - 2, 138, melonX + 34, h - 1);
      claim(ballA.x - 2, ballA.y - 12, ballB.x + 4, ballB.y + 1);
      lifeguard(f, towerX, towerY);
      kvass(f, kvassX, kvassY);
      // umbrellas, towels and sunbathers in loose rows, back to front
      const rows = [
        { y: SHORE + 11, r: 5, gap: 19 },
        { y: SHORE + 19, r: 6, gap: 21 },
        { y: SHORE + 28, r: 7, gap: 23 },
        { y: SHORE + 37, r: 8, gap: 25 },
      ];
      rows.forEach((row, ri) => {
        for (let x = 4 + ri * 9, i = 0; x < w + 10; x += row.gap, i++) {
          const ux = x + Math.round((hash2(i, ri, 3) - 0.5) * row.gap * 0.7);
          const uy = row.y + Math.round((hash2(i, ri, 4) - 0.5) * 6);
          const r = row.r;
          const kind = hash2(i, ri, 12);
          const grib = kind > 0.93 && ri > 0;
          const rr = grib ? r + 3 : r;
          if (masked(ux - rr - 1, uy - rr * 2, ux + rr + 6, uy + 3)) continue;
          if (hash2(i, ri, 5) < 0.12) continue;
          claim(ux - rr - 1, uy - rr * 2, ux + rr + 6, uy + 3);
          const col = COLORS[Math.floor(hash2(i, ri, 6) * COLORS.length)]!;
          const tcol = TOWELS[Math.floor(hash2(i, ri, 7) * TOWELS.length)]!;
          const skin = SKINS[Math.floor(hash2(i, ri, 8) * SKINS.length)]!;
          const hair = HAIRS[Math.floor(hash2(i, ri, 9) * HAIRS.length)]!;
          const suit = COLORS[Math.floor(hash2(i, ri, 10) * COLORS.length)]!;
          if (grib) mushroom(f, ux, uy, rr, col, base);
          else umbrella(f, ux, uy, r, col, base);
          if (kind < 0.5) {
            towel(f, ux - 1, uy - 1, 11, tcol);
            sunbather(f, ux, uy - 1, skin, hair, suit);
          } else if (kind < 0.78) {
            towel(f, ux - 3, uy, 9, tcol);
            person(
              f,
              kind < 0.64 ? WOMAN : MAN,
              ux + 3,
              uy + 1,
              skin,
              hair,
              suit
            );
          } else {
            // someone sitting in the shade, knees up, and a towel in the sun
            sprite(f, ['.h.', '.sS', 'cCS', 'sS.'], ux - 3, uy - 3, {
              h: hair,
              s: skin[0],
              S: skin[1],
              c: suit[0],
              C: suit[1],
            });
            towel(f, ux + 2, uy, 9, tcol);
            if (kind > 0.86)
              sunbather(
                f,
                ux + 3,
                uy,
                SKINS[(i + 1) % 3]!,
                HAIRS[(i + 2) % 5]!,
                COLORS[(i + 3) % 6]!
              );
          }
        }
      });
      // a few people just standing about between the rows
      for (let i = 0; i < w / 16; i++) {
        const px = Math.floor(hash2(i, 1, 91) * w);
        const py = SHORE + 10 + Math.floor(hash2(i, 2, 91) * 30);
        if (masked(px - 1, py - 10, px + 5, py + 1)) continue;
        claim(px - 1, py - 10, px + 5, py + 1);
        const kidOrNot = hash2(i, 3, 91);
        const rows = kidOrNot < 0.3 ? KID : kidOrNot < 0.65 ? WOMAN : MAN;
        person(
          f,
          rows,
          px,
          py,
          SKINS[i % 3]!,
          HAIRS[i % 5]!,
          COLORS[(i * 5) % 6]!,
          i % 2 === 0
        );
      }
      watermelon(f, melonX, 141);
    });

    function lifeguard(f: Frame, x: number, b: number) {
      const H = 11;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -2 + Math.abs(dy) * 3; dx <= 13 - Math.abs(dy) * 3; dx++)
          base.blend(x + dx, b + dy, P.shadow, 0.3);
      // legs and braces
      f.vline(x - 4, b - H, b, P.woodSh);
      f.vline(x + 4, b - H, b, P.woodSh);
      f.line(x - 4, b - 2, x + 4, b - H + 2, P.wood);
      f.line(x - 4, b - H + 2, x + 4, b - 2, P.wood);
      // ladder down the right side
      f.line(x + 5, b - H, x + 8, b, P.wood);
      f.line(x + 7, b - H, x + 10, b, P.wood);
      for (let k = 2; k < H; k += 3)
        f.hline(
          x + 5 + Math.round((k * 3) / H),
          x + 7 + Math.round((k * 3) / H),
          b - H + k,
          P.woodSh
        );
      // platform, cabin with the lifeguard in the window, red roof
      f.hline(x - 6, x + 6, b - H, P.wood);
      f.hline(x - 6, x + 6, b - H + 1, P.woodSh);
      f.rect(x - 4, b - H - 7, 9, 7, P.white);
      f.vline(x + 4, b - H - 7, b - H - 1, P.canvasSh);
      f.rect(x - 3, b - H - 5, 6, 3, P.navy);
      f.rect(x - 1, b - H - 5, 2, 1, P.hair);
      f.rect(x - 1, b - H - 4, 2, 2, P.tan);
      f.hline(x - 6, x + 6, b - H - 8, P.redSh);
      f.hline(x - 5, x + 5, b - H - 9, P.red);
      f.hline(x - 3, x + 3, b - H - 10, P.red);
      f.hline(x - 5, x - 2, b - H - 9, lighten(P.red));
      // a life ring hung on the rail
      f.rect(x - 6, b - H + 2, 2, 2, P.red);
      f.set(x - 6, b - H + 3, P.white);
    }

    function kvass(f: Frame, x: number, b: number) {
      // the shade it throws
      for (let dx = -8; dx <= 12; dx++)
        base.blend(x + dx + 3, b, P.shadow, 0.32);
      for (let dx = -6; dx <= 10; dx++)
        base.blend(x + dx + 3, b + 1, P.shadow, 0.32);
      // tow bar and wheels
      f.line(x - 8, b - 4, x - 12, b, P.ink);
      f.disc(x - 3, b - 1, 1.4, P.ink);
      f.disc(x + 4, b - 1, 1.4, P.ink);
      f.set(x - 3, b - 1, P.pole);
      f.set(x + 4, b - 1, P.pole);
      // the barrel: a fat yellow cylinder lying on its side
      const rows = [
        [-6, 6, P.yellowHi],
        [-7, 7, P.yellowHi],
        [-8, 8, P.yellow],
        [-8, 8, P.yellow],
        [-8, 8, P.yellow],
        [-7, 7, P.yellowSh],
        [-6, 6, P.yellowSh],
      ] as const;
      rows.forEach(([a, z, c], i) => f.hline(x + a, x + z, b - 9 + i, c));
      for (const hx of [x - 5, x + 5]) f.vline(hx, b - 8, b - 4, P.yellowSh);
      f.vline(x + 8, b - 7, b - 5, P.yellowSh);
      f.set(x + 9, b - 5, P.ink); // the tap
      // vendor on a stool under a little umbrella, mugs on a crate
      umbrella(f, x + 13, b, 5, [P.red, P.redSh], base);
      sprite(f, ['.h.', 'sws', 'www', 'w.w'], x + 11, b - 4, {
        h: P.hairFair,
        s: P.skin,
        w: P.white,
      });
      f.rect(x + 9, b - 3, 2, 3, P.wood);
      f.set(x + 9, b - 4, P.yellowHi);
      // the queue
      person(f, MAN, x + 17, b, SKINS[1]!, P.hair, [P.navy, P.ink]);
      person(f, KID, x + 22, b, SKINS[0]!, P.hairFair, [P.yellow, P.yellowSh]);
    }

    function watermelon(f: Frame, x: number, y: number) {
      // a big striped towel, a whole melon, a half and two slices, flip-flops
      for (let dy = 0; y + dy < h; dy++) {
        const sx = x + Math.round(dy * 0.5);
        f.hline(sx, sx + 29, y + dy, P.white);
        for (let dx = 0; dx < 30; dx++)
          if (Math.floor(dx / 5) % 2 === 0)
            f.set(sx + dx, y + dy, dy === 0 ? P.blue : P.blueSh);
      }
      f.hline(x, x + 29, y, P.canvasSh);
      for (let dx = 0; dx < 30; dx++)
        if (Math.floor(dx / 5) % 2 === 0) f.set(x + dx, y, P.blue);
      // the whole melon, striped, with its shadow
      f.hline(x + 6, x + 13, y + 8, P.blueSh);
      f.disc(x + 9, y + 4, 3.6, (dx, dy) =>
        dx + dy < -3
          ? P.melonHi
          : dx * dx + dy * dy > 9 && dx + dy > 1
            ? P.melonSh
            : (dx + 9) % 3 === 0
              ? P.melonSh
              : P.melon
      );
      // the cut half, flesh up
      f.hline(x + 15, x + 22, y + 5, P.melonHi);
      f.hline(x + 15, x + 22, y + 4, P.flesh);
      f.hline(x + 16, x + 21, y + 3, P.flesh);
      f.hline(x + 15, x + 22, y + 6, P.melon);
      f.hline(x + 16, x + 21, y + 7, P.melonSh);
      f.set(x + 17, y + 4, P.ink);
      f.set(x + 20, y + 3, P.ink);
      for (const [sx, sy] of [
        [x + 24, y + 2],
        [x + 26, y + 6],
      ] as const) {
        f.hline(sx, sx + 4, sy + 2, P.melon);
        f.hline(sx, sx + 4, sy + 1, P.flesh);
        f.hline(sx + 1, sx + 3, sy, P.flesh);
        f.set(sx + 2, sy - 1, P.flesh);
        f.set(sx + 2, sy + 1, P.ink);
      }
      f.rect(x - 4, y + 4, 2, 4, P.pink);
      f.rect(x - 1, y + 5, 2, 4, P.pink);
      f.set(x - 3, y + 5, P.white);
      f.set(x, y + 6, P.white);
    }

    // ---------- things that move ----------
    type Swimmer = {
      x: number;
      y: number;
      kind: number;
      cap: RGB;
      skin: Duo;
      phase: number;
    };
    const swimmers: Swimmer[] = [];
    const pierLeftAt = (y: number) => {
      // the leftmost column of the pier on a given row
      for (let x = 0; x < w; x++) if (mask[Math.round(y) * w + x]) return x;
      return w;
    };
    for (let i = 0; i < Math.round(w / 14); i++) {
      const y = SHORE - 15 + Math.floor(hash2(i, 1, 51) * 12);
      const x = Math.floor(hash2(i, 2, 51) * w);
      if (x > pierLeftAt(y) - 8 && x < pierLeftAt(y) + 70) continue;
      const k = hash2(i, 3, 51);
      swimmers.push({
        x,
        y,
        kind: k < 0.45 ? 0 : k < 0.62 ? 1 : k < 0.9 ? 2 : 3, // head, ring, wader, airbed
        cap: [P.red, P.white, P.yellow, P.hair, P.blue, P.hairFair][i % 6]!,
        skin: SKINS[i % SKINS.length]!,
        phase: hash2(i, 4, 51) * 6.28,
      });
    }
    swimmers.sort((a, b) => a.y - b.y);
    const buoyY = SHORE - 19;
    const buoyEnd = pierLeftAt(buoyY) - 4;

    const walkers = Array.from(
      { length: Math.max(2, Math.round(w / 120)) },
      (_, i) => ({
        seed: i,
        y: SHORE + 5 + (i % 3),
        speed: 0.005 + hash2(i, 1, 61) * 0.004,
        woman: i % 2 === 0,
        skin: SKINS[i % 3]!,
        hair: HAIRS[(i + 2) % HAIRS.length]!,
        suit: COLORS[(i * 2 + 1) % COLORS.length]!,
      })
    );
    const strollers = Array.from({ length: 4 }, (_, i) => ({
      u0: hash2(i, 1, 71),
      speed: 0.000018 + hash2(i, 2, 71) * 0.00001,
      lane: i % 2 ? -0.45 : 0.35,
      top: [P.red, P.white, P.blue, P.yellow][i]!,
    }));

    type Gull = {
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      speed: number;
      phase: number;
      big: boolean;
    };
    const gulls: Gull[] = [
      {
        cx: lhX + 6,
        cy: 34,
        rx: 24,
        ry: 8,
        speed: 1 / 2600,
        phase: 0,
        big: true,
      },
      {
        cx: lhX - 40,
        cy: 22,
        rx: 40,
        ry: 7,
        speed: -1 / 3400,
        phase: 2,
        big: false,
      },
      {
        cx: cx - Math.min(90, w * 0.2),
        cy: 40,
        rx: 34,
        ry: 9,
        speed: 1 / 3000,
        phase: 4,
        big: true,
      },
      {
        cx: cx - Math.min(150, w * 0.35),
        cy: 20,
        rx: 30,
        ry: 6,
        speed: -1 / 3800,
        phase: 1,
        big: false,
      },
      {
        cx: cx + Math.min(150, w * 0.35),
        cy: 24,
        rx: 22,
        ry: 6,
        speed: 1 / 3300,
        phase: 5,
        big: false,
      },
    ];
    const gullStartled = gulls.map(() => -Infinity);
    const standX = Math.round(cx - Math.min(130, w * 0.3));
    const standY = SHORE + 4;
    let standFlown = -Infinity;
    let kiteAt = -Infinity;
    let kiteTo: Pt = [0, 0];
    let kiteFrom: Pt = [0, 0];
    let kiteMovedAt = -Infinity;
    /** Where the kite is heading: eases across when it's sent somewhere new. */
    const kiteTarget = (t: number): Pt => {
      const e = Math.min(1, (t - kiteMovedAt) / 1400);
      const k = 1 - (1 - e) ** 3;
      return [
        kiteFrom[0] + (kiteTo[0] - kiteFrom[0]) * k,
        kiteFrom[1] + (kiteTo[1] - kiteFrom[1]) * k,
      ];
    };
    let beamAt = -Infinity;
    let hornAt = -Infinity;
    const dives = new Map<number, number>();

    // the goby fisherman nearest us: click him and he lands a bychok, holds
    // it up, and a gull dives in, snatches it, and swoops off low right past
    // the camera, huge, the goby in its beak and three more gulls after it,
    // while he runs down the pier after it shaking his fist, stamps, and
    // trudges back to his rod
    const ANGLER_U = 0.36;
    const HAUL = 450; // the bite, then he strikes
    const LANDED = 1250; // the goby's up, dangling off the rod
    const SWOOP = 1800; // a gull starts its dive
    const GRAB = 2600; // and takes it
    const PASS = 3000; // off past the camera and gone
    const RUN = GRAB + 150; // he's off down the pier after it
    const RUN_U = 0.17; // as far as he gets
    const STAMP = GRAB + 1500; // shaking his fist at it
    const BACK = GRAB + 2900; // trudging back to his rod
    const CATCH = GRAB + 4600;
    let catchAt = -Infinity;
    const [anglerX, anglerY] = proj(ANGLER_U, -0.7, DECK);
    const rodDown = proj(ANGLER_U, -2.2, DECK + 12);
    // lifted, it swings out over open water, clear of the pier behind
    const rodUp = proj(ANGLER_U, -3.4, DECK + 17);
    const lineWater = proj(ANGLER_U, -2.2, 0)[1];
    const ANGLER_R = 7;
    // a tap this close sets him off too (a finger gets the same slack the
    // viewer gives it, so a find always plays)
    const SLACK = 6;
    const anglerSpot: Pt = [anglerX - 3, anglerY - 5];
    const onAngler = (x: number, y: number) =>
      Math.hypot(x - anglerSpot[0], y - anglerSpot[1]) <= ANGLER_R + SLACK;
    const ease = (k: number) => {
      const c = Math.max(0, Math.min(1, k));
      return c * c * (3 - 2 * c);
    };
    /** The tip of his rod, `a` ms into the catch. */
    const rodTip = (a: number): Pt => {
      const k =
        a < GRAB
          ? ease((a - HAUL) / (LANDED - HAUL))
          : 1 - ease((a - GRAB - 200) / 500);
      const dip = a < HAUL && Math.floor(a / 70) % 2 ? 2 : 0;
      return [
        rodDown[0] + (rodUp[0] - rodDown[0]) * k,
        rodDown[1] + (rodUp[1] - rodDown[1]) * k + dip,
      ];
    };
    /** Where the goby hangs on the line (its top), till the gull has it. */
    const gobyOnLine = (a: number): Pt | null => {
      if (a < HAUL || a >= GRAB) return null;
      const tip = rodTip(a);
      const k = ease((a - HAUL) / (LANDED - HAUL));
      const sway = a > LANDED ? Math.sin((a - LANDED) / 170) * 1.2 : 0;
      return [tip[0] + sway, lineWater + (tip[1] + 6 - lineWater) * k];
    };
    /** Where he is along the pier (u), `a` ms into the catch. */
    const anglerU = (a: number) =>
      a < RUN || a >= CATCH
        ? ANGLER_U
        : a < STAMP
          ? ANGLER_U + (RUN_U - ANGLER_U) * ease((a - RUN) / (STAMP - RUN))
          : a < BACK
            ? RUN_U
            : RUN_U + (ANGLER_U - RUN_U) * ease((a - BACK) / (CATCH - BACK));
    const bez = (s: number, p0: Pt, p1: Pt, p2: Pt): Pt => [
      (1 - s) * (1 - s) * p0[0] + 2 * s * (1 - s) * p1[0] + s * s * p2[0],
      (1 - s) * (1 - s) * p0[1] + 2 * s * (1 - s) * p1[1] + s * s * p2[1],
    ];
    const grabAt = gobyOnLine(GRAB - 1)!;
    // how big the thief gets as it goes by the camera (half its wingspan)
    const BIG = Math.max(42, Math.min(110, w * 0.23));
    /**
     * A gull after the goby, `g` ms after the grab (`lag` behind the thief,
     * smaller for being further back): where it is and its half wingspan.
     */
    const passAt = (g: number, lag: number) => {
      const e = Math.max(0, (g - lag) / PASS);
      const s = e ** 1.7;
      const [gx, gy] = grabAt;
      // up off the line a little, then down and in, low over the beach
      const p = bez(
        s,
        [gx, gy - 2],
        [gx - w * 0.1, gy - 22],
        [-BIG * 1.1, 140 - lag * 0.03]
      );
      const W = 5 + (BIG * (lag ? 0.42 : 1) - 5) * e * e;
      if (lag) {
        // the chasers come in from off the top right to join the chase
        const j = ease(e * 3);
        p[0] += (w + 20 - p[0]) * (1 - j) + lag * 0.02;
        p[1] += (-20 - p[1]) * (1 - j) - lag * 0.01;
      }
      return { x: p[0], y: p[1], W, e };
    };
    /** The thief before the grab: down from off the top right. */
    const thiefIn = (a: number): Pt | null => {
      if (a < SWOOP || a >= GRAB) return null;
      const [gx, gy] = grabAt;
      const s = (a - SWOOP) / (GRAB - SWOOP);
      return bez(s, [gx + 130, gy - 110], [gx + 22, gy + 8], [gx, gy - 2]);
    };
    /** A goby, hanging head up off a line or crosswise in a beak. */
    const goby = (f: Frame, x: number, y: number, t: number, held: boolean) => {
      const X = Math.round(x);
      const Y = Math.round(y);
      const flick = Math.floor(t / 110) % 2;
      if (held) {
        f.hline(X - 1, X + 2, Y, P.woodSh);
        f.set(X, Y + 1, P.tanSh);
        f.set(X + 3, Y + flick, P.tanSh);
        return;
      }
      // a fat head and a wriggling tail, the sun catching its side
      f.rect(X, Y, 3, 3, P.woodSh);
      f.set(X + 1, Y + 1, flick ? P.glint : P.tanSh);
      f.vline(X + 1 + flick, Y + 3, Y + 4, P.tanSh);
    };
    /**
     * A gull close to the camera, seen from the front: white wings beating,
     * black tips, yellow beak, and the goby wriggling crosswise in it.
     */
    function bigGull(
      f: Frame,
      x: number,
      y: number,
      W: number,
      phase: number,
      t: number,
      fish: boolean
    ) {
      const flap = Math.sin(phase);
      const edge = Math.max(1, W * 0.035);
      for (const sd of [-1, 1]) {
        // an M: the elbow up, the hand drooping to a point
        const elbowDy = -flap * W * 0.15;
        const tipDy = -flap * W * 0.45;
        const sTop: Pt = [x + sd * W * 0.07, y - W * 0.05];
        const eTop: Pt = [x + sd * W * 0.42, y - W * 0.16 + elbowDy];
        const tip: Pt = [x + sd * W, y - W * 0.02 + tipDy];
        const eBot: Pt = [x + sd * W * 0.44, y - W * 0.02 + elbowDy];
        const sBot: Pt = [x + sd * W * 0.07, y + W * 0.09];
        /** The y of a wing edge (through three points) at screen x `px`. */
        const along = (px: number, a: Pt, b: Pt, c: Pt) => {
          const [p, q] =
            Math.abs(px - x) < Math.abs(b[0] - x) ? [a, b] : [b, c];
          const k = (px - p[0]) / (q[0] - p[0] || 1);
          return p[1] + (q[1] - p[1]) * Math.max(0, Math.min(1, k));
        };
        f.poly([sTop, eTop, tip, eBot, sBot], (px, py) => {
          const fr = Math.abs(px - x) / W;
          if (fr > 0.78) return P.gullTip;
          if (py - along(px, sTop, eTop, tip) < edge) return P.gull;
          if (along(px, sBot, eBot, tip) - py < edge) return P.gullWing;
          return P.gullSh;
        });
        // the white spot in the black tip
        if (W > 22)
          f.disc(
            x + sd * W * 0.87,
            along(x + sd * W * 0.87, sTop, eTop, tip) + W * 0.025,
            W * 0.022,
            P.gull
          );
      }
      // body and head, shaded underneath
      f.disc(x, y + W * 0.04, W * 0.12, (dx, dy) =>
        dy > W * 0.06 ? P.gullSh : P.gull
      );
      f.disc(x, y - W * 0.1, W * 0.085, P.gull);
      const ey = Math.round(y - W * 0.12);
      const ex = Math.max(1, Math.round(W * 0.04));
      f.set(x - ex, ey, P.gullTip);
      f.set(x + ex, ey, P.gullTip);
      if (W > 40) {
        f.set(x - ex, ey - 1, P.gullTip);
        f.set(x + ex, ey - 1, P.gullTip);
      }
      // the beak, and the goby crosswise in it, tail flapping
      const by = y - W * 0.06;
      const bl = Math.max(2, W * 0.08);
      f.poly(
        [
          [x - W * 0.035 - 0.5, by],
          [x + W * 0.035 + 0.5, by],
          [x, by + bl],
        ],
        P.beak
      );
      if (!fish) return;
      const gl = Math.max(4, W * 0.24);
      const gh = Math.max(1, W * 0.045);
      const gy = by + bl * 0.8;
      f.poly(
        [
          [x - gl * 0.45, gy - gh],
          [x + gl * 0.3, gy - gh * 0.8],
          [x + gl * 0.4, gy],
          [x + gl * 0.3, gy + gh * 0.8],
          [x - gl * 0.45, gy + gh],
        ],
        (px, py) => (py < gy - gh * 0.2 ? P.wood : P.woodSh)
      );
      const flick = Math.floor(t / 90) % 2 ? 1 : -1;
      f.poly(
        [
          [x + gl * 0.35, gy],
          [x + gl * 0.6, gy - gh * 1.3 * flick - gh * 0.4],
          [x + gl * 0.6, gy + gh * 0.4 - gh * 1.3 * flick * 0.2],
        ],
        P.woodSh
      );
      if (W > 30) f.set(x - gl * 0.3, gy - gh * 0.3, P.ink);
    }
    let lastT = 0;

    const gullAt = (g: Gull, t: number): Pt => {
      const a = t * g.speed + g.phase;
      return [
        g.cx + Math.cos(a) * g.rx,
        g.cy + Math.sin(a) * g.ry + Math.sin(t / 900 + g.phase) * 1.5,
      ];
    };
    /** Where each gull is now, after any fright: null while it's away. */
    function gullPos(i: number, t: number): { p: Pt; flap: boolean } | null {
      const g = gulls[i]!;
      const age = t - gullStartled[i]!;
      const home = gullAt(g, t);
      if (age > 12_000) return { p: home, flap: false };
      const p0 = gullAt(g, gullStartled[i]!);
      const dir = p0[0] < cx ? -1 : 1;
      const s = age / 1000;
      const away: Pt = [
        p0[0] + dir * (40 * s + 6 * s * s),
        p0[1] - 26 * s - 4 * s * s,
      ];
      if (age < 3000) return { p: away, flap: true };
      if (age < 8000) return null;
      // glide back in from where it went
      const e = (age - 8000) / 4000;
      const end: Pt = [p0[0] + dir * 174, p0[1] - 114];
      const k = 1 - (1 - e) * (1 - e);
      return {
        p: [end[0] + (home[0] - end[0]) * k, end[1] + (home[1] - end[1]) * k],
        flap: e < 0.6,
      };
    }

    function boatAt(t: number) {
      const span = w + 90;
      return Math.round((((t * 0.0032) % span) + span) % span) - 50;
    }
    const BOAT_WL = HORIZON + 11;
    const BOAT_L = 32;

    function pleasureBoat(f: Frame, x: number, t: number) {
      const y = BOAT_WL;
      // wake and bow wave
      for (let k = 0; k < 16; k++) {
        if ((k + Math.floor(t / 260)) % 3 === 0) continue;
        f.set(x - k, y + (k > 7 ? 1 : 0), k < 8 ? P.foam : P.glint2);
      }
      f.set(x + BOAT_L, y, P.foam);
      f.set(x + BOAT_L + 1, y, P.glint2);
      // hull: white, blue band, dark boot-top
      f.hline(x + 2, x + BOAT_L - 3, y, P.navy);
      f.hline(x + 1, x + BOAT_L - 1, y - 1, P.blue);
      f.hline(x, x + BOAT_L, y - 2, P.white);
      f.hline(x, x + BOAT_L + 1, y - 3, P.white);
      // main deck saloon with a band of windows
      // (an odd width, so the row of windows has the same margin each end)
      f.rect(x + 3, y - 6, BOAT_L - 9, 3, P.white);
      for (let k = x + 4; k < x + BOAT_L - 6; k += 2) f.set(k, y - 5, P.navy);
      f.hline(x + 2, x + BOAT_L - 6, y - 7, P.canvasSh);
      // upper deck: open at the back with passengers, wheelhouse at the front
      f.rect(x + 13, y - 9, 10, 2, P.white);
      f.hline(x + 19, x + 22, y - 9, P.navy);
      for (let k = 0; k < 5; k++)
        f.set(
          x + 4 + k * 2,
          y - 8,
          [P.red, P.yellow, P.skin, P.blue, P.pink][k]!
        );
      f.hline(x + 3, x + 12, y - 9, P.railSh);
      // funnel and mast
      f.rect(x + 15, y - 12, 2, 3, P.red);
      f.hline(x + 15, x + 16, y - 12, P.ink);
      f.vline(x + 25, y - 13, y - 8, P.ink); // stepped on the saloon roof
      f.set(x + 25, y - 14, P.white);
      // a faint reflection
      for (let k = x + 1; k < x + BOAT_L; k++)
        if ((k + Math.floor(t / 400)) % 3) f.blend(k, y + 2, P.white, 0.25);
    }

    function sailboat(f: Frame, x: number, y: number, c: RGB) {
      f.hline(x - 2, x + 2, y, P.ink);
      f.vline(x, y - 6, y - 1, P.ink);
      for (let k = 0; k < 5; k++)
        f.hline(x + 1, x + 1 + Math.floor(k / 2), y - 5 + k, P.white);
      for (let k = 0; k < 3; k++) f.set(x - 1, y - 3 + k, c);
    }

    function drawSwimmer(f: Frame, s: Swimmer, i: number, t: number) {
      const dive = t - (dives.get(i) ?? -Infinity);
      const bob = Math.sin(t / 650 + s.phase) > 0.4 ? -1 : 0;
      const drift =
        s.kind === 0 ? Math.round(Math.sin(t / 5000 + s.phase) * 6) : 0;
      const x = s.x + drift;
      const y = s.y + bob;
      if (s.kind !== 2 && dive < 1600) {
        // ducked under: a few bubbles where they went down
        if (dive % 400 < 200) f.set(x + (dive < 800 ? 0 : 1), s.y, P.foam);
        return;
      }
      if (s.kind === 2) {
        // standing waist-deep in the shallows
        f.set(x, y - 4, s.cap);
        f.set(x + 1, y - 4, s.cap);
        f.set(x, y - 3, s.skin[0]);
        f.set(x + 1, y - 3, s.skin[1]);
        f.hline(x - 1, x + 2, y - 2, s.skin[0]);
        f.set(x + 2, y - 2, s.skin[1]);
        f.hline(x - 1, x + 2, y - 1, s.skin[1]);
        f.hline(x - 2, x + 3, y, P.foam2);
        return;
      }
      if (s.kind === 3) {
        // airbed with someone lying on it
        f.hline(x - 4, x + 5, y, P.red);
        f.hline(x - 4, x + 5, y + 1, P.redSh);
        f.hline(x - 3, x + 3, y - 1, s.skin[0]);
        f.set(x - 4, y - 1, s.cap);
        f.hline(x - 1, x, y - 1, P.blue);
        f.hline(x - 5, x + 6, y + 2, P.foam2);
        return;
      }
      f.set(x, y - 1, s.cap);
      f.set(x + 1, y - 1, s.cap);
      f.set(x, y, s.skin[0]);
      f.set(x + 1, y, s.skin[1]);
      if (s.kind === 1) {
        f.hline(x - 2, x + 3, y + 1, P.red);
        for (let k = -2; k <= 3; k += 2) f.set(x + k, y + 1, P.white);
      } else if (Math.sin(t / 900 + s.phase * 3) > 0.7) {
        f.set(x - 1, y - 1, s.skin[0]); // an arm mid-stroke
      }
      f.set(x - 1, y + 1, P.foam2);
      f.set(x + 2, y + 1, P.foam2);
    }

    function pedalo(f: Frame, t: number) {
      const range = Math.max(20, Math.min(90, (buoyEnd - 30) / 2));
      const mid = Math.max(30, buoyEnd / 2);
      const x = Math.round(mid + Math.sin(t / 16000) * range);
      const dir = Math.cos(t / 16000) >= 0 ? 1 : -1;
      const y = buoyY - 3;
      f.hline(x - 6, x + 6, y, P.yellow);
      f.hline(x - 6, x + 6, y + 1, P.yellowSh);
      f.hline(x - 7, x + 7, y + 2, P.foam2);
      // seat back, two riders, the paddle wheel turning at the stern
      f.vline(x - dir * 2, y - 3, y - 1, P.blue);
      f.vline(x - dir * 2 + dir, y - 3, y - 1, P.blueSh);
      for (const k of [0, 3]) {
        const px = x + dir * (k - 1);
        f.set(px, y - 4, k ? P.hairFair : P.hair);
        f.set(px, y - 3, P.skin);
        f.set(px, y - 2, k ? P.pink : P.navy);
      }
      const wx = x - dir * 6;
      const turn = Math.floor(t / 180) % 2;
      f.set(wx, y - 1 - turn, P.white);
      f.set(wx - dir, y - turn, P.white);
    }

    function gullSprite(
      f: Frame,
      x: number,
      y: number,
      frame: number,
      big: boolean
    ) {
      const rows = (big ? GULL : GULL_SMALL)[frame]!;
      sprite(f, rows, x - (big ? 5 : 3), y - 2, {
        k: P.gullTip,
        w: P.gull,
        s: P.gullSh,
        g: P.gullWing,
      });
    }

    function drawKite(f: Frame, t: number) {
      const hand: Pt = [kidX + 2, kidY - 8];
      const age = t - kiteAt;
      if (age > 16_000) {
        // folded on the sand next to the kid
        f.hline(kidX + 5, kidX + 8, kidY, P.red);
        f.hline(kidX + 6, kidX + 7, kidY - 1, P.yellow);
        return;
      }
      const sway = Math.sin(t / 700) * 3;
      let k: number;
      if (age < 2000) k = 1 - (1 - age / 2000) ** 3;
      else if (age < 14_000) k = 1;
      else k = 1 - ((age - 14_000) / 2000) ** 2;
      const [gx, gy] = kiteTarget(t);
      const kx = hand[0] + (gx - hand[0]) * k + sway * k;
      const ky = hand[1] + (gy - hand[1]) * k + Math.cos(t / 900) * 2 * k;
      // the string, sagging a little
      let px = hand[0];
      let py = hand[1];
      for (let s = 1; s <= 8; s++) {
        const v = s / 8;
        const nx = hand[0] + (kx - hand[0]) * v;
        const ny = hand[1] + (ky - hand[1]) * v + Math.sin(v * Math.PI) * 5 * k;
        f.line(px, py, nx, ny, P.string);
        px = nx;
        py = ny;
      }
      // the tail flutters out behind
      for (let s = 1; s <= 9; s++) {
        const tx =
          kx - s * 1.2 + Math.sin(t / 180 + s * 0.9) * (0.5 + s * 0.25);
        const ty = ky + 4 + s * 1.6;
        f.set(tx, ty, P.ink);
        if (s % 3 === 0) {
          f.set(tx - 1, ty, P.blue);
          f.set(tx + 1, ty, P.blue);
        }
      }
      sprite(f, KITE, kx - 3, ky - 4, {
        r: P.red,
        R: P.redSh,
        y: P.yellow,
        Y: P.yellowSh,
        k: P.ink,
      });
    }

    function beam(f: Frame, t: number) {
      const age = t - beamAt;
      if (age > 5000) return;
      const fade = age < 4000 ? 1 : 1 - (age - 4000) / 1000;
      const ang = age / 520;
      const c = Math.cos(ang);
      const len = 70 * Math.abs(c);
      const dir = c > 0 ? 1 : -1;
      for (let d = 2; d < len; d++) {
        const spread = 0.5 + d * 0.09;
        const a = 0.7 * fade * (1 - d / (len + 1)) ** 0.6;
        for (let s = -spread; s <= spread; s++)
          f.blend(lhX + dir * d, lampY + s - d * 0.04, P.beam, a);
      }
      // facing us: a flash
      const face = 1 - Math.abs(c);
      if (face > 0.75)
        glow(f, lhX, lampY, 4 + face * 6, P.beam, 0.8 * fade, 1, 0.1);
    }

    const onPier = (x: number, y: number) => pierLayer.opaque(x, y);
    const onLighthouse = (x: number, y: number) =>
      Math.abs(x - lhX) <= 5 && y >= lhBase - LH_H - 2 && y <= lhBase + 1;
    const onBoat = (x: number, y: number, t: number) => {
      const bx = boatAt(t);
      return (
        x >= bx - 1 &&
        x <= bx + BOAT_L + 1 &&
        y >= BOAT_WL - 14 &&
        y <= BOAT_WL + 1
      );
    };
    const onStanding = (x: number, y: number, t: number) =>
      t - standFlown > 16_000 &&
      x >= standX - 4 &&
      x <= standX + 20 &&
      y >= standY - 6 &&
      y <= standY + 1;
    const gullHit = (x: number, y: number, t: number) =>
      gulls.findIndex((_, i) => {
        // one that's already off (or still on its way back) is left alone
        if (t - gullStartled[i]! <= 12_000) return false;
        const g = gullPos(i, t);
        return (
          g !== null && Math.abs(g.p[0] - x) <= 5 && Math.abs(g.p[1] - y) <= 4
        );
      });

    return {
      render(f, t, pointer) {
        lastT = t;
        f.copyFrom(base);
        f.over(cloudLayer, Math.round(t / 1500), 0, true);
        f.over(far);
        for (const c of cranes) {
          const ang = c.anim ? c.ang + Math.sin(t / 5200) * 0.3 : c.ang;
          crane(
            f,
            c,
            ang,
            c.anim ? 4 + Math.round((Math.sin(t / 2600) + 1) * 2) : 4
          );
        }
        for (const ch of chimneys)
          plume(f, ch.x, ch.top, t + ch.seed * 1700, ch.seed);

        // sparkle on the sea, thickest under the sun
        for (
          let y = HORIZON + 2;
          y < SHORE - 2;
          y += y < HORIZON + 14 ? 2 : 3
        ) {
          const depth = (y - HORIZON) / (SHORE - HORIZON);
          const n = Math.round(w / (24 - depth * 8));
          for (let i = 0; i < n; i++) {
            const ph = hash2(i, y, 9);
            const life = Math.sin(t / 800 + ph * 40);
            const gx = Math.floor(hash2(i, y, 10) * w);
            const nearSun = Math.abs(gx - sunX) < 30 + depth * 50;
            if (life < (nearSun ? 0.2 : 0.75)) continue;
            const len = 1 + Math.round(hash2(i, y, 11) * (1 + depth * 4));
            f.hline(
              gx,
              gx + len - 1,
              y,
              nearSun && life > 0.6 ? P.glint : P.glint2
            );
          }
        }
        // far sails
        for (let k = 0; k < 3; k++) {
          const span = w + 30;
          const sx =
            Math.round(
              (((hash2(k, 0, 81) * span + t * (k % 2 ? -0.0011 : 0.0016)) %
                span) +
                span) %
                span
            ) - 15;
          const sy =
            HORIZON + 3 + k * 2 + (Math.sin(t / 1300 + k) > 0.6 ? 1 : 0);
          sailboat(f, sx, sy, [P.red, P.blue, P.yellow][k]!);
        }
        pleasureBoat(f, boatAt(t), t);
        if (t - hornAt < 1800) {
          const a = (t - hornAt) / 1800;
          const bx = boatAt(t) + 15;
          for (let k = 0; k < 3; k++) {
            const pa = a - k * 0.18;
            if (pa < 0 || pa > 0.8) continue;
            f.disc(
              bx + 1 - pa * 10,
              BOAT_WL - 14 - pa * 10,
              1 + pa * 3,
              pa < 0.4 ? P.white : P.steam3
            );
          }
        }
        // the buoy line, the pedalo and everyone in the water
        for (let x = 3; x < buoyEnd; x += 7) {
          const by = buoyY + (Math.sin(t / 900 + x * 0.4) > 0.5 ? 1 : 0);
          f.set(x, by, (x / 7) % 2 < 1 ? P.red : P.white);
          f.set(x + 1, by, P.foam2);
        }
        pedalo(f, t);
        swimmers.forEach((s, i) => drawSwimmer(f, s, i, t));
        // waves running up the sand
        const p = (t / 4600) % 1;
        const run =
          p < 0.3
            ? Math.sin((p / 0.3) * (Math.PI / 2))
            : Math.cos(((p - 0.3) / 0.7) * (Math.PI / 2));
        const crest = SHORE - 8 + Math.round(p * 7);
        for (let x = 0; x < w; x++) {
          const e = edge[x]!;
          const reach = Math.round(run * (2 + fbm1(x / 14, 3) * 2.5));
          for (let y = e; y < e + reach; y++) f.set(x, y, P.shallow);
          if (reach > 0) f.set(x, e + reach, P.foam);
          else if (p > 0.3) f.set(x, e, P.foam2);
          if (fbm1(x / 9 + t / 9000, 41) > 0.56 && p < 0.85)
            f.set(x, crest, p < 0.6 ? P.foam : P.foam2);
        }
        // the lighthouse in the water
        for (let k = 1; k < 9; k++) {
          const wob = Math.round(Math.sin(k * 1.4 + t / 380));
          for (let dx = -3; dx <= 3; dx++) {
            const src = f.get(lhX + dx, lhBase - 1 - k * 2);
            if (k % 3 !== 2)
              f.blend(lhX + dx + wob, lhBase + 3 + k, src, 0.45 - k * 0.04);
          }
        }

        f.over(pierLayer);
        const hoverLh = pointer ? onLighthouse(pointer.x, pointer.y) : false;
        const beamOn = t - beamAt < 5000;
        if (beamOn || hoverLh) {
          lighthouse(f, lhX, lhBase, true);
          glow(f, lhX, lampY, 7, P.lampOn, 0.5, 1, 0.15);
        }
        if (beamOn) beam(f, t);
        // people strolling along the pier, and one fishing off the end
        for (const s of strollers) {
          const raw = (t * s.speed + s.u0) % 2;
          const u = 0.12 + 0.8 * (raw < 1 ? raw : 2 - raw);
          const z = zAt(u);
          const [x, y] = proj(u, s.lane, DECK);
          tiny(
            f,
            x,
            y - 1,
            Math.round(12 / z),
            P.skin,
            s.top,
            Math.floor(t / 260) % 2
          );
        }
        // and the goby fishermen along the rail, lines over the side
        const ca = t - catchAt;
        for (const [u, top] of [
          [ANGLER_U, P.white],
          [0.58, P.blue],
          [0.8, P.red],
        ] as const) {
          const z = zAt(u);
          const [x, y] = proj(u, -0.7, DECK);
          const ht = Math.round(11 / z);
          if (u === ANGLER_U && ca >= 0 && ca < CATCH) {
            if (ca < RUN) {
              tiny(f, x, y - 1, ht, P.tan, top, 0);
              const [tx, ty] = rodTip(ca);
              f.line(x - 1, y - ht * 0.55, tx, ty, P.ink);
              const g = gobyOnLine(ca);
              if (ca < HAUL)
                f.vline(
                  Math.round(tx),
                  Math.round(ty) + 1,
                  Math.round(lineWater) - 1,
                  P.glint2
                );
              else if (g) {
                f.line(tx, ty + 1, g[0], g[1] - 1, P.glint2);
                goby(f, g[0], g[1], t, false);
              } else
                f.vline(
                  Math.round(tx),
                  Math.round(ty) + 1,
                  Math.round(ty) + 3,
                  P.glint2
                );
              continue;
            }
            // robbed: the rod left leaning on the rail, its line back in...
            f.line(x - 1, y - ht * 0.45, rodDown[0], rodDown[1], P.ink);
            f.vline(
              Math.round(rodDown[0]),
              Math.round(rodDown[1]) + 1,
              Math.round(lineWater) - 1,
              P.glint2
            );
            // ...while he runs down the pier after it, shakes his fist and
            // stamps, and trudges back
            const ru = anglerU(ca);
            const [rx, ry] = proj(ru, -0.7, DECK);
            const rht = Math.round(11 / zAt(ru));
            const moving = ca < STAMP || ca >= BACK;
            const hop =
              ca >= STAMP && ca < BACK && Math.floor(ca / 140) % 2 ? 2 : 0;
            tiny(
              f,
              rx,
              ry - 1 - hop,
              rht,
              P.tan,
              top,
              moving ? Math.floor(ca / (ca < STAMP ? 110 : 220)) % 2 : 0
            );
            if (ca < BACK) {
              const up = Math.floor(ca / 120) % 2;
              const X = Math.round(rx) + 2;
              const Y = Math.round(ry - 1 - hop - rht + 1);
              f.vline(X, Y + 1 - up * 2, Y + 3 - up, P.tan);
              f.rect(X, Y - up * 2, 2, 2, P.tan);
            }
            continue;
          }
          tiny(f, x, y - 1, ht, P.tan, top, 0);
          const [tx, ty] = proj(u, -2.2, DECK + 12);
          const [, wy] = proj(u, -2.2, 0);
          f.line(x - 1, y - ht * 0.55, tx, ty, P.ink);
          if (Math.sin(t / 1400 + u * 9) > -0.6)
            f.vline(
              Math.round(tx),
              Math.round(ty) + 1,
              Math.round(wy) - 1,
              P.glint2
            );
        }
        {
          const [x, y] = proj(0.97, -0.6, DECK);
          tiny(f, x, y - 1, 4, P.tan, P.navy, 0);
          f.line(x - 1, y - 3, x - 5, y - 6, P.ink);
          f.vline(
            Math.round(x - 5),
            Math.round(y - 5),
            Math.round(y - 3),
            P.white
          );
        }

        // walkers along the waterline, turning back before the pier, and the
        // gulls standing at the water's edge: all further back than the
        // nearest umbrellas, so drawn before them
        for (const p of walkers) {
          const lim = pierLeftAt(p.y) - 8;
          const span = Math.max(20, lim - 6);
          const raw =
            (t * p.speed + hash2(p.seed, 2, 61) * span * 2) % (span * 2);
          const x = Math.round(3 + (raw < span ? raw : span * 2 - raw));
          const flip = raw >= span;
          const rows = (p.woman ? WOMAN : MAN).slice();
          if (Math.floor(t / 240 + p.seed) % 2)
            rows[rows.length - 1] = STEP[0]!;
          else rows[rows.length - 1] = STEP[1]!;
          person(f, rows, x, p.y, p.skin, p.hair, p.suit, flip);
        }
        // gulls standing at the water's edge
        const sAge = t - standFlown;
        if (sAge > 16_000) {
          for (let k = 0; k < 3; k++) {
            const peck = Math.sin(t / 1300 + k * 2) > 0.85 ? 1 : 0;
            const rows = STANDING_GULL.slice();
            if (peck) rows[0] = '......';
            sprite(
              f,
              rows,
              standX + k * 7,
              standY - 3 + (k === 1 ? 1 : 0) + peck,
              {
                w: P.gull,
                s: P.gullSh,
                g: P.gullWing,
                k: P.gullTip,
                b: P.beak,
              },
              k === 1
            );
          }
        } else if (sAge < 3500) {
          // off they go, up and away over the water
          const s2 = sAge / 1000;
          for (let k = 0; k < 3; k++) {
            const d = Math.max(0, s2 - k * 0.15);
            const gx = standX + k * 7 - (14 + k * 5) * d - 6 * d * d;
            const gy = standY - 2 - (16 + k * 3) * d - 5 * d * d;
            gullSprite(
              f,
              gx,
              gy,
              d === 0 ? 1 : [0, 1, 2, 1][Math.floor(sAge / 70 + k) % 4]!,
              true
            );
          }
        } else if (sAge > 13_000) {
          // gliding back down, in from off the top-left where they went
          const e = (sAge - 13_000) / 3000;
          const far = (1 - e) ** 2;
          for (let k = 0; k < 3; k++) {
            const gx = standX + k * 7 - far * (130 + k * 12);
            const gy = standY - 2 - far * (125 + k * 6);
            gullSprite(f, gx, gy, e > 0.8 ? 0 : 1, true);
          }
        }
        f.over(props);
        // two kids with a beach ball
        {
          const T = 1700;
          const k = Math.floor(t / T);
          const ph = (t % T) / T;
          const [a, b] = k % 2 ? [ballB, ballA] : [ballA, ballB];
          const bx = a.x + 2 + (b.x - a.x) * ph;
          const by = a.y - 8 - Math.sin(ph * Math.PI) * 13;
          person(f, KID, ballA.x, ballA.y, SKINS[0]!, P.hairFair, [
            P.red,
            P.redSh,
          ]);
          person(
            f,
            KID,
            ballB.x,
            ballB.y,
            SKINS[1]!,
            P.hair,
            [P.blue, P.blueSh],
            true
          );
          f.blend(Math.round(bx), b.y + 1, P.shadow, 0.4);
          sprite(f, ['.rw', 'byr', 'wb.'], bx - 1, by - 1, {
            r: P.red,
            w: P.white,
            b: P.blue,
            y: P.yellow,
          });
        }
        // the kid with the kite
        person(f, KID, kidX, kidY, SKINS[2]!, P.hairRed, [P.green, P.greenSh]);
        if (t - kiteAt < 16_000) f.set(kidX + 2, kidY - 6, P.skin); // arm up
        // gulls in the air
        for (let i = 0; i < gulls.length; i++) {
          const g = gullPos(i, t);
          if (!g) continue;
          const flapping = g.flap || Math.sin(t / 1700 + i * 2) > 0.4;
          const fr = flapping
            ? [0, 1, 2, 1][Math.floor(t / (g.flap ? 70 : 130) + i) % 4]!
            : 1;
          gullSprite(f, g.p[0], g.p[1], fr, gulls[i]!.big);
        }
        drawKite(f, t);
        // and the ones after the fisherman's goby: the thief diving in, then
        // off low past the camera with three more after it
        if (ca >= 0 && ca < CATCH) {
          const tin = thiefIn(ca);
          if (tin) gullSprite(f, tin[0], tin[1], ca < GRAB - 250 ? 0 : 1, true);
          const g = ca - GRAB;
          for (const lag of [750, 500, 250, 0]) {
            if (g < lag) continue;
            const c = passAt(g, lag);
            if (c.e >= 1) continue;
            const phase = (g - lag) / 55 - 14 * c.e * c.e + lag;
            if (!lag && c.W > 14) {
              // its shadow sweeping over the sand
              const sx = c.x + c.W * 0.3;
              const sy = Math.min(h - 3, c.y + 22 + c.W * 0.35);
              const rx = c.W * 0.9;
              const ry = Math.max(1.5, c.W * 0.1);
              for (let dy = -Math.ceil(ry); dy <= ry; dy++)
                for (let dx = -Math.ceil(rx); dx <= rx; dx++) {
                  if ((dx / rx) ** 2 + (dy / ry) ** 2 > 1) continue;
                  const X = Math.round(sx + dx);
                  const Y = Math.round(sy + dy);
                  if (Y >= edgeAt(X) + 2) f.blend(X, Y, P.shadow, 0.3);
                }
            }
            if (c.W < 8) {
              const fr = [2, 1, 0, 1][Math.floor(phase / 1.6) % 4]!;
              gullSprite(f, c.x, c.y, fr, true);
              if (!lag) goby(f, c.x, c.y + 2, t, true);
            } else bigGull(f, c.x, c.y, c.W, phase, t, !lag);
          }
        }
        fx.draw(f, t);
      },
      poke(x, y, t) {
        const gi = gullHit(x, y, t);
        if (gi >= 0) {
          gullStartled[gi] = t;
          return;
        }
        if (onAngler(x, y)) {
          if (t - catchAt > CATCH) {
            catchAt = t;
            // a bite: rings round the line, then the goby comes up splashing
            ripple(fx, t, rodDown[0], lineWater, P.foam, {
              rings: 2,
              size: 5,
              squash: 0.3,
            });
            splash(fx, t + HAUL, rodDown[0], lineWater, P.foam, Math.round(t));
            splash(
              fx,
              t + HAUL + 60,
              rodDown[0],
              lineWater,
              P.glint2,
              Math.round(t) + 3
            );
            ripple(fx, t + HAUL, rodDown[0], lineWater, P.foam, {
              rings: 3,
              size: 10,
              squash: 0.3,
            });
            // and it flashes in the sun as it comes up
            sparkle(fx, t + LANDED - 150, rodUp[0], rodUp[1] + 7, P.glint);
          }
          return;
        }
        if (onStanding(x, y, t)) {
          standFlown = t;
          return;
        }
        if (onLighthouse(x, y)) {
          // the lamp turns its full five seconds before it can be lit again
          if (t - beamAt > 5000) {
            beamAt = t;
            sparkle(fx, t, lhX, lampY, P.lampOn);
          }
          return;
        }
        if (onBoat(x, y, t)) {
          if (t - hornAt > 1800) hornAt = t;
          return;
        }
        // the pier is wood, not water: no splashing on the deck
        if (onPier(x, y)) return;
        if (y > HORIZON && y < edgeAt(x)) {
          ripple(fx, t, x, y, P.foam, { rings: 3, size: 12, squash: 0.3 });
          splash(fx, t, x, y, P.foam, Math.round(t));
          splash(fx, t + 60, x, y, P.glint2, Math.round(t) + 7);
          swimmers.forEach((s, i) => {
            if (
              s.kind !== 2 &&
              Math.abs(s.x - x) < 12 &&
              Math.abs(s.y - y) < 6 &&
              t - (dives.get(i) ?? -Infinity) > 1600
            )
              dives.set(i, t);
          });
          return;
        }
        if (y < HORIZON - 4) {
          const age = t - kiteAt;
          const up = age >= 0 && age < 16_000;
          const to: Pt = [Math.max(4, Math.min(w - 4, x)), Math.max(6, y)];
          kiteFrom = up ? kiteTarget(t) : to;
          kiteTo = to;
          kiteMovedAt = t;
          if (!up) kiteAt = t;
          else if (age >= 2000) {
            // keep it up a while longer; one coming down climbs back from
            // where it is, without a jump
            const k = age < 14_000 ? 1 : 1 - ((age - 14_000) / 2000) ** 2;
            kiteAt = t - 2000 * (1 - Math.cbrt(1 - k));
          }
        }
      },
      hot(x, y) {
        const t = lastT;
        return (
          y < HORIZON - 4 ||
          (y > HORIZON && y < edgeAt(x) && !onPier(x, y)) ||
          onBoat(x, y, t) ||
          onLighthouse(x, y) ||
          onStanding(x, y, t) ||
          onAngler(x, y) ||
          gullHit(x, y, t) >= 0
        );
      },
      eggs() {
        // the goby fisherman nearest us, who gets robbed by a gull
        return [
          { id: 'goby', x: anglerSpot[0], y: anglerSpot[1], r: ANGLER_R },
        ];
      },
    };
  },
};
