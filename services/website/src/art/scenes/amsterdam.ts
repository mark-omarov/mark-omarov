// Amsterdam in a storm: a row of gabled canal houses, a humpback bridge
// outlined in bulbs whose reflections close into rings, bikes chained to
// every railing, a houseboat, rain on everything.
//
// Click the sky for lightning, a window to switch its light, the water to
// splash, the bridge to run the bulbs. Three easter eggs:
// - the handlebar sticking out of the canal: the bike fishers race over and
//   crane out that bike, and the whole tangle of bikes chained to it;
// - the plane circling overhead: it turns back, the storm becomes a
//   blizzard, and a bus with its windows lit crosses the bridge;
// - the hotel's little attic window: its light clicks off and we look into
//   a dark room, where a man pats the walls for the light switch while the
//   clock spins, until the light comes back on.

import { bayer8, Frame, lerpRGB, type RGB } from '../frame';
import { Fx, ripple, splash } from '../fx';
import { hash2 } from '../noise';
import { clouds, glow, gradient, rain } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';
import { hotelRoom, LIGHT_BACK, ROOM_H } from '../things/amsterdam-hotel';

const P = palette({
  sky0: '#090c1c',
  sky1: '#10142a',
  sky2: '#181c38',
  sky3: '#232546',
  sky4: '#33304f',
  cityGlow: '#5a4a6a',
  cloudLight: '#4e4a6e',
  cloudBase: '#262840',
  cloudShadow: '#181a2e',
  // facades
  red: '#5c2f2b',
  redDark: '#45221f',
  brown: '#4e3627',
  brownDark: '#3a2719',
  green: '#1f2d28',
  greenDark: '#16211d',
  navy: '#212a44',
  navyDark: '#181e33',
  grey: '#4a4a55',
  greyDark: '#383842',
  white: '#8f8b84',
  whiteDark: '#75716b',
  trim: '#d4ccba',
  trimDim: '#a49d8e',
  glass: '#141a2c',
  glassHi: '#232a44',
  win: '#ffc76e',
  winHi: '#ffe6a8',
  winTv: '#8ab4ff',
  curtain: '#c0703a',
  door: '#20302a',
  doorRed: '#5a1e1e',
  beam: '#1a1410',
  // quay and bridge
  cobble: '#2a2a3a',
  cobbleHi: '#3c3c52',
  brick: '#5a3430',
  brickDark: '#432622',
  brickHi: '#6c4038',
  stone: '#a29c8c',
  stoneDark: '#77715f',
  iron: '#12141c',
  bulb: '#ffe6a6',
  bulbDim: '#c8a868',
  lamp: '#ffd88a',
  lampPost: '#1a2a24',
  // water
  water: '#0b1022',
  waterTint: '#0a0f20',
  waterHi: '#3a4670',
  ripple: '#5a6a9a',
  // houseboat
  hull: '#1e3a30',
  hullHi: '#2e5446',
  cabin: '#5a4632',
  cabinHi: '#7a6046',
  plant: '#2e6a3a',
  flower: '#e0506a',
  rain: '#7c86b0',
  crane: '#e8b030',
  craneDark: '#a87a20',
  claw: '#d06030',
  rust: '#7a4028',
  rustHi: '#b06a3a',
  duck: '#ffd23a',
  cart: '#a8aab8',
  barge: '#2a3a2e',
  bargeHi: '#4a5e4c',
  flash: '#dfe6ff',
  bolt: '#f4f6ff',
  // the blizzard
  snow: '#eef2ff',
  snowShade: '#b4bcd8',
  haze: '#a2acd0',
  plane: '#5a6080',
  planeHi: '#8a90b0',
  navRed: '#ff4a4a',
  navGreen: '#4aff8a',
  strobe: '#ffffff',
  bus: '#34588c',
  busShade: '#1e365c',
  busRoof: '#5a7cae',
  busStripe: '#d8dce6',
  busGlass: '#ffd890',
  busHead: '#2a2430',
  manHair: '#9a6a42',
  // the hotel's attic window
  hotel: '#ffb46a',
  hotelHi: '#ffe0b0',
  hotelLamp: '#7a3a20',
  hotelSign: '#9ad0ff',
  roomFrame: '#d4ccba',
  roomEdge: '#07080f',
  roomFlood: '#fff4d0',
  // the bike fishers' call-out
  beacon: '#ffa020',
  flood: '#fff6d8',
  bikeRed: '#8a3a30',
  bikeBlue: '#3a5a8a',
  bikeBlueHi: '#5a82b8',
  boom: '#d89a28',
});

const FAR_QUAY = 100; // houses stand here
const WL = 113; // near waterline, at the foot of the bridge
const DECK = 88; // bridge deck

type Gable = 'step' | 'bell' | 'neck' | 'spout' | 'cornice';
type House = {
  x: number;
  w: number;
  eaves: number;
  g: number;
  gable: Gable;
  color: RGB;
  dark: RGB;
  seed: number;
};
type Win = {
  x: number;
  y: number;
  w: number;
  h: number;
  lit: boolean;
  color: RGB;
};

const FACADES: [RGB, RGB][] = [
  [P.red, P.redDark],
  [P.brown, P.brownDark],
  [P.green, P.greenDark],
  [P.navy, P.navyDark],
  [P.red, P.redDark],
  [P.grey, P.greyDark],
  [P.white, P.whiteDark],
  [P.brown, P.brownDark],
];
const GABLES: Gable[] = [
  'step',
  'bell',
  'neck',
  'cornice',
  'spout',
  'neck',
  'step',
  'bell',
];

const smooth = (u: number) => {
  const v = Math.max(0, Math.min(1, u));
  return v * v * (3 - 2 * v);
};

/** Top of the facade at column dx of a house, gable included. */
function roofAt(hs: House, dx: number) {
  const top = hs.eaves - hs.g;
  const u = Math.abs((dx + 0.5) / hs.w - 0.5) * 2; // 0 centre, 1 edge
  switch (hs.gable) {
    case 'cornice':
      return hs.eaves;
    case 'step': {
      // three steps up to a narrow top
      const steps = 3;
      const k = Math.min(steps, Math.floor((1 - u) * (steps + 1) * 1.05));
      return hs.eaves - Math.round((hs.g / steps) * k);
    }
    case 'bell': {
      if (u > 0.82) return hs.eaves;
      const v = u / 0.82;
      return top + Math.round(hs.g * (v * v * (3 - 2 * v)));
    }
    case 'neck': {
      if (u > 0.78) return hs.eaves;
      if (u < 0.42) return top;
      // a scroll from the shoulder up to the neck
      const v = (u - 0.42) / 0.36;
      return (
        top +
        Math.round(hs.g * 0.55 * Math.sqrt(v)) +
        (v > 0.8 ? Math.round(hs.g * 0.45) : 0)
      );
    }
    case 'spout': {
      if (u < 0.22) return top;
      return Math.min(hs.eaves, top + Math.round((u - 0.22) * hs.g * 1.6));
    }
  }
}

export const amsterdam: Scene = {
  id: 'amsterdam',
  name: 'Amsterdam',
  country: 'Netherlands',
  create(w, h) {
    const fx = new Fx();
    const houses: House[] = [];
    const windows: Win[] = [];
    for (let x = -6, i = 0; x < w + 6; i++) {
      const r = (k: number) => hash2(i, k, 77);
      const hw = 16 + 2 * Math.floor(r(1) * 6);
      // never the same colour as the house next door
      let [color, dark] = FACADES[Math.floor(r(2) * FACADES.length)]!;
      for (let k = 1; color === houses[i - 1]?.color; k++)
        [color, dark] =
          FACADES[(Math.floor(r(2) * FACADES.length) + k) % FACADES.length]!;
      const gable = GABLES[(i + Math.floor(r(3) * 3)) % GABLES.length]!;
      const eaves =
        FAR_QUAY - 50 - Math.round(r(4) * 16) + (gable === 'cornice' ? -6 : 0);
      houses.push({
        x,
        w: hw,
        eaves,
        g: gable === 'cornice' ? 0 : 9 + Math.round(r(5) * 5),
        gable,
        color,
        dark,
        seed: i,
      });
      x += hw + (r(6) > 0.85 ? 1 : 0);
    }
    // one of them is a little hotel: the gabled house nearest a quarter of
    // the way along, its attic window the light-switch egg
    const hotelHouse = houses
      .filter((hs) => hs.gable !== 'cornice' && hs.x > 4 && hs.x + hs.w < w - 4)
      .reduce((best, hs) =>
        Math.abs(hs.x + hs.w / 2 - w * 0.27) <
        Math.abs(best.x + best.w / 2 - w * 0.27)
          ? hs
          : best
      );
    let hotelWin: Win | null = null;

    // bridge geometry: a wide main arch with a smaller one each side
    const cx = Math.round(w / 2);
    const a1 = Math.round(Math.max(24, Math.min(44, w * 0.12)));
    const a2 = Math.round(a1 * 0.66);
    const PIER_W = 7;
    // a wide arch in the middle, smaller ones repeating out to both edges
    const arches = [{ cx, a: a1, crown: 93 }];
    for (
      let off = a1 + PIER_W + a2;
      off - a2 < w / 2 + 4;
      off += 2 * a2 + PIER_W
    ) {
      arches.push(
        { cx: cx - off, a: a2, crown: 99 },
        { cx: cx + off, a: a2, crown: 99 }
      );
    }
    const archTop = (x: number) => {
      for (const ar of arches) {
        const u = (x + 0.5 - ar.cx) / ar.a;
        if (Math.abs(u) < 1)
          return Math.round(WL - (WL - ar.crown) * Math.sqrt(1 - u * u));
      }
      return Infinity;
    };
    const bulbs: { x: number; y: number; k: number }[] = [];

    const sky = layer(w, h, (f) => {
      gradient(f, 0, FAR_QUAY, [P.sky0, P.sky1, P.sky2, P.sky3, P.sky4]);
      glow(f, w / 2, FAR_QUAY, w * 0.7, P.cityGlow, 0.5, 0.35, 0.12);
    });
    const cloudLayer = layer(w, h, (f) => {
      clouds(f, {
        seed: 31,
        y0: 0,
        y1: 34,
        cell: 9,
        coverage: 0.62,
        stretch: 3,
        litFromBelow: true,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });

    const town = layer(w, h, (f) => {
      for (const hs of houses) {
        // facade, shadowed on the right
        for (let dx = 0; dx < hs.w; dx++) {
          const top = roofAt(hs, dx);
          const c = dx === hs.w - 1 ? hs.dark : hs.color;
          f.vline(hs.x + dx, top, FAR_QUAY - 1, c);
        }
        // sandstone dressing along the gable edge
        if (hs.gable !== 'cornice') {
          for (let dx = 0; dx < hs.w; dx++) {
            const top = roofAt(hs, dx);
            const prev = dx > 0 ? roofAt(hs, dx - 1) : top;
            const next = dx < hs.w - 1 ? roofAt(hs, dx + 1) : top;
            const low = Math.max(top, Math.min(Math.max(prev, next), hs.eaves));
            f.vline(hs.x + dx, top, Math.max(top, low - 1), P.trim);
          }
        } else {
          f.hline(hs.x - 1, hs.x + hs.w, hs.eaves, P.trim);
          f.hline(hs.x, hs.x + hs.w - 1, hs.eaves + 1, P.trimDim);
          f.hline(hs.x, hs.x + hs.w - 1, hs.eaves + 2, hs.dark);
        }
        // windows: tall sashes with white frames, a few floors of them,
        // spread so the gaps between them and at both ends are even
        const bays = Math.max(2, Math.floor((hs.w - 2) / 6));
        const gap = (hs.w - 4 * bays) / (bays + 1);
        const floors: { y: number; h: number }[] = [];
        floors.push({ y: FAR_QUAY - 13, h: 9 }); // ground floor: tall windows and a door
        // keep clear of the cornice (three rows of moulding) or the eaves
        const clear = hs.eaves + (hs.gable === 'cornice' ? 5 : 3);
        for (let y = FAR_QUAY - 25; y >= clear; y -= 11)
          floors.push({ y, h: 7 });
        // the gable gets a window of its own, centred, as high as it fits
        // with a pixel of wall between it and the coping all round, and the
        // end of the hoisting beam sticking out above it
        if (hs.gable !== 'cornice') {
          const gx = hs.x + (hs.w - 4) / 2;
          const fits = (gy: number) => {
            for (let dx = gx - hs.x - 1; dx <= gx - hs.x + 4; dx++)
              if (roofAt(hs, dx) > gy - 2) return false;
            return true;
          };
          for (let gy = hs.eaves - hs.g + 4; gy + 5 <= hs.eaves - 1; gy++) {
            if (!fits(gy)) continue;
            const gw = {
              x: gx,
              y: gy,
              w: 4,
              h: 5,
              lit: hash2(hs.seed, 99, 3) < 0.55,
              color: P.win,
            };
            if (hs === hotelHouse) hotelWin = { ...gw, lit: true };
            else windows.push(gw);
            if (roofAt(hs, gx - hs.x + 1) <= gy - 4)
              f.rect(gx + 1, gy - 3, 2, 2, P.beam);
            break;
          }
        }
        floors.forEach((fl, fi) => {
          for (let b = 0; b < bays; b++) {
            const wx = hs.x + Math.round(gap * (b + 1) + 4 * b);
            if (fi === 0 && b === hs.seed % bays) {
              // front door with a stoop
              f.rect(wx, fl.y, 4, fl.h + 3, P.trim);
              f.rect(
                wx + 1,
                fl.y + 1,
                2,
                fl.h + 2,
                hs.seed % 2 ? P.door : P.doorRed
              );
              f.hline(wx - 1, wx + 4, FAR_QUAY - 1, P.trimDim);
              continue;
            }
            const lit = hash2(hs.seed, fi * 7 + b, 3) < 0.55;
            const tv = hash2(hs.seed, fi * 7 + b, 4) > 0.92;
            windows.push({
              x: wx,
              y: fl.y,
              w: 4,
              h: fl.h,
              lit,
              color: tv ? P.winTv : P.win,
            });
          }
        });
      }
      // far quay with the odd parked bike
      f.rect(0, FAR_QUAY, w, 4, P.cobble);
      f.hline(0, w, FAR_QUAY, P.cobbleHi);
      for (let x = 8; x < w; x += 23 + Math.round(hash2(x, 0, 5) * 20)) {
        f.disc(x, FAR_QUAY + 1, 1, P.iron);
        f.disc(x + 4, FAR_QUAY + 1, 1, P.iron);
        f.line(x, FAR_QUAY, x + 3, FAR_QUAY - 2, P.iron);
      }
      // far water under the bridge: a dim mirror of the quay and doors
      for (let y = FAR_QUAY + 4; y < WL; y++) {
        for (let x = 0; x < w; x++) {
          const sy = 2 * (FAR_QUAY + 4) - y - 1;
          const src = f.opaque(x, sy) ? f.get(x, sy) : P.water;
          f.set(
            x,
            y,
            lerpRGB(P.water, src, (y - FAR_QUAY) % 3 === 0 ? 0.2 : 0.42)
          );
        }
      }
    });

    const bridge = layer(w, h, (f) => {
      // brick body with arch openings
      for (let x = 0; x < w; x++) {
        const open = archTop(x);
        for (let y = DECK + 2; y < WL; y++) {
          if (y >= open) break;
          const row = (y - DECK) >> 1;
          const joint = (x + (row % 2) * 2) % 4 === 0 && (y - DECK) % 2 === 0;
          f.set(
            x,
            y,
            joint
              ? P.brickDark
              : hash2(x >> 1, row, 9) > 0.85
                ? P.brickHi
                : P.brick
          );
        }
        // stone coping along the deck
        f.set(x, DECK, P.stone);
        f.set(x, DECK + 1, P.stoneDark);
      }
      // stone ring around each arch, studded with bulbs
      for (const ar of arches) {
        for (let x = ar.cx - ar.a - 2; x <= ar.cx + ar.a + 2; x++) {
          const u = (x + 0.5 - ar.cx) / (ar.a + 2);
          if (Math.abs(u) >= 1) continue;
          const y = Math.round(WL - (WL - ar.crown + 2) * Math.sqrt(1 - u * u));
          const inner =
            Math.abs((x + 0.5 - ar.cx) / ar.a) < 1 ? archTop(x) : WL;
          f.vline(x, y, Math.min(inner - 1, y + 1), P.stone);
          if (Math.abs(u) < 0.98 && (x - ar.cx) % 3 === 0)
            bulbs.push({ x, y: y - 1, k: bulbs.length });
        }
      }
      for (let x = 2; x < w; x += 4)
        bulbs.push({ x, y: DECK - 1, k: bulbs.length });
      // railing with bikes chained to it
      f.hline(0, w, DECK - 5, P.iron);
      f.hline(0, w, DECK - 2, P.iron);
      for (let x = 0; x < w; x += 3) f.vline(x, DECK - 5, DECK - 1, P.iron);
      for (let x = 6; x < w - 6; x += 9 + Math.round(hash2(x, 1, 6) * 14)) {
        if (Math.abs(x - cx) < 6) continue;
        const flip = hash2(x, 2, 6) > 0.5 ? 1 : -1;
        const b = DECK - 3;
        for (const wx of [x - 3, x + 3]) {
          f.set(wx - 1, b, P.iron);
          f.set(wx + 1, b, P.iron);
          f.set(wx, b - 1, P.iron);
          f.set(wx, b + 1, P.iron);
        }
        f.line(x - 3, b, x, b - 2, P.iron);
        f.line(x, b - 2, x + 3, b, P.iron);
        f.line(x - flip, b - 3, x + 2 * flip, b - 3, P.iron);
        f.set(x + 3 * flip, b - 4, P.iron);
      }
      // lamp posts at the ends of the main arch
      for (const lx of [cx - a1 - 4, cx + a1 + 4]) {
        f.vline(lx, DECK - 22, DECK - 1, P.lampPost);
        f.hline(lx - 1, lx + 1, DECK - 2, P.lampPost);
        f.rect(lx - 1, DECK - 26, 3, 4, P.lampPost);
        f.vline(lx, DECK - 25, DECK - 24, P.lamp);
      }
    });

    // where snow settles in the blizzard: every pixel of the houses and the
    // bridge with open air above it (roofs and gable steps, the deck, the
    // railings, the bikes chained to them), and the one below that
    const capsOf = (src: Frame, y1: number) => {
      const one: number[] = [];
      const two: number[] = [];
      const three: number[] = [];
      for (let y = 1; y < y1; y++)
        for (let x = 0; x < w; x++) {
          if (!src.opaque(x, y) || src.opaque(x, y - 1)) continue;
          one.push(y * w + x);
          if (src.opaque(x, y + 1)) two.push((y + 1) * w + x);
          if (src.opaque(x, y + 1) && src.opaque(x, y + 2))
            three.push((y + 2) * w + x);
        }
      return [one, two, three].map((a) => Int32Array.from(a));
    };
    const townCaps = capsOf(town, FAR_QUAY + 1);
    const bridgeCaps = capsOf(bridge, WL);
    function settle(f: Frame, caps: Int32Array[], k: number) {
      if (k <= 0) return;
      const [one, two, three] = caps as [Int32Array, Int32Array, Int32Array];
      for (const i of one) f.dset(i % w, (i / w) | 0, P.snow, k * 1.3);
      for (const i of two) f.dset(i % w, (i / w) | 0, P.snow, k * 1.4 - 0.2);
      for (const i of three)
        f.dset(i % w, (i / w) | 0, P.snowShade, k * 1.3 - 0.4);
    }
    /** A line of snow along a ledge, as thick as `k` allows. */
    const ledge = (f: Frame, x0: number, x1: number, y: number, k: number) => {
      if (k <= 0) return;
      for (let x = x0; x <= x1; x++) {
        f.dset(x, y, P.snow, k * 1.3);
        f.dset(x, y - 1, P.snow, k * 1.3 - 0.5);
      }
    };

    // houseboat moored on the right
    const boatW = Math.min(64, Math.round(w * 0.17));
    const boatX = w - boatW - Math.round(w * 0.04);
    function houseboat(f: Frame, t: number, snowK: number) {
      const bob = Math.round(Math.sin(t / 900));
      const y = WL + 8 + bob;
      f.rect(boatX, y, boatW, 4, P.hull);
      f.hline(boatX, boatX + boatW - 1, y, P.hullHi);
      f.rect(boatX + 4, y - 7, boatW - 10, 7, P.cabin);
      f.hline(boatX + 3, boatX + boatW - 6, y - 8, P.cabinHi);
      for (let x = boatX + 7; x < boatX + boatW - 9; x += 7) {
        f.rect(x, y - 5, 4, 3, P.win);
        f.set(x, y - 5, P.winHi);
      }
      // pots and a bike on the roof
      for (let x = boatX + 6; x < boatX + boatW - 8; x += 9) {
        f.rect(x, y - 10, 2, 2, P.flower);
        f.set(x, y - 11, P.plant);
        f.set(x + 1, y - 11, P.flower);
      }
      const bx = boatX + boatW - 16;
      f.disc(bx, y - 10, 1, P.iron);
      f.disc(bx + 5, y - 10, 1, P.iron);
      f.line(bx, y - 10, bx + 3, y - 12, P.iron);
      // under the snow
      ledge(f, boatX + 3, boatX + boatW - 6, y - 8, snowK);
      ledge(f, boatX, boatX + boatW - 1, y, snowK * 0.8);
      for (let x = boatX + 6; x < boatX + boatW - 8; x += 9)
        ledge(f, x, x + 1, y - 11, snowK);
      ledge(f, bx - 1, bx + 6, y - 12, snowK * 0.9);
      // its reflection
      for (let k = 0; k < 6; k++)
        for (let x = boatX; x < boatX + boatW; x++)
          if ((x + k) % 2 === 0)
            f.blend(x, y + 4 + k, k < 3 ? P.win : P.hull, 0.15 - k * 0.02);
    }

    // people cycling over the bridge in the rain, lights on
    function cyclists(f: Frame, t: number) {
      for (let i = 0; i < 3; i++) {
        const period = 9_000 + i * 2_300;
        const p = ((t + i * 4_100) % period) / period;
        const dir = i % 2 ? -1 : 1;
        const span = w + 20;
        const x = Math.round(dir === 1 ? -10 + p * span : w + 10 - p * span);
        const y = DECK - 1;
        const pedal = Math.floor(t / 140) % 2;
        // wheels
        for (const wx of [x - 3, x + 3]) {
          f.set(wx - 1, y - 1, P.iron);
          f.set(wx + 1, y - 1, P.iron);
          f.set(wx, y - 2, P.iron);
          f.set(wx, y, P.iron);
        }
        f.line(x - 3, y - 1, x + 3, y - 1, P.iron);
        // rider, hunched against the rain, coat flapping
        f.rect(x - 1, y - 6, 2, 4, i === 1 ? P.doorRed : P.navyDark);
        f.rect(x - 1 + dir, y - 8, 2, 2, P.iron);
        f.set(x + pedal * dir, y - 2, P.iron);
        // headlight and tail light
        f.set(x + dir * 4, y - 2, P.bulb);
        f.blend(x + dir * 5, y - 2, P.bulb, 0.5);
        f.blend(x + dir * 6, y - 2, P.bulb, 0.25);
        f.set(x - dir * 4, y - 2, P.doorRed);
        // the railing stays in front of them
        railing(f, x - 6, x + 6, 0);
      }
    }
    /** Redraws the bridge railing over x0..x1 (in front of what's on the deck). */
    function railing(f: Frame, x0: number, x1: number, snowK: number) {
      for (let k = x0; k <= x1; k++) {
        if (k % 3 === 0) f.vline(k, DECK - 5, DECK - 1, P.iron);
        f.set(k, DECK - 5, P.iron);
        f.set(k, DECK - 2, P.iron);
        if (snowK > 0) {
          f.dset(k, DECK - 5, P.snow, snowK * 1.3);
          f.dset(k, DECK - 2, P.snow, snowK * 1.3);
        }
      }
    }

    // a glass-roofed canal cruise sliding past now and then
    function tourBoat(f: Frame, t: number, snowK: number) {
      const period = 38_000;
      const p = (t % period) / 24_000;
      if (p > 1) return;
      const len = 58;
      const x = Math.round(w + 4 - p * (w + len + 8));
      const y = h - 9;
      f.rect(x, y, len, 4, P.navyDark);
      f.hline(x + 1, x + len - 2, y, P.stoneDark);
      f.rect(x + 4, y - 5, len - 12, 5, P.glassHi);
      f.hline(x + 5, x + len - 9, y - 6, P.waterHi);
      for (let k = x + 6; k < x + len - 9; k += 4) {
        f.rect(k, y - 4, 2, 3, P.win);
        f.set(k, y - 4, P.winHi);
      }
      f.set(x, y + 1, P.bulb);
      f.set(x + len - 1, y + 1, P.doorRed);
      ledge(f, x + 5, x + len - 9, y - 6, snowK);
      ledge(f, x + 1, x + 3, y, snowK);
      ledge(f, x + len - 8, x + len - 2, y, snowK);
      // light spilling on the water around it
      for (let k = x; k < x + len; k += 2) f.blend(k, y + 4, P.win, 0.25);
    }

    // the bike fishers: a barge with a crane that pulls bikes out of the canal
    // (Amsterdam fishes out thousands a year). It comes by now and then, or
    // when something gets dropped in the water.
    const FISH = 18_000;
    let fishAt = -Infinity;
    let fishX = Math.round(w * 0.35);
    let pile = 0;
    // a bike's handlebar sticking out of the canal: click it and the fishers
    // come racing for that bike, and haul up the whole tangle chained to it.
    // It's gone once they've lifted it out, and another one turns up a while
    // after they've left (it's Amsterdam).
    const hbX = cx + Math.round(a1 * 0.3); // in the main arch's dark reflection
    const HB_Y = WL + 19; // where it breaks the surface, level with the barge
    const FISH_EGG = 8400;
    const HOOK = 2900; // when the grab comes up with it
    const HB_BACK = FISH_EGG + 25_000;
    let hbAt = -Infinity;
    let eggFrom = -70; // where the barge was when the call came
    let pileAtEgg = 0;
    const fishEggAge = (t: number) => {
      const a = t - hbAt;
      return a >= 0 && a < FISH_EGG ? a : -1;
    };
    const handlebarUp = (t: number) => t - hbAt < HOOK || t - hbAt >= HB_BACK;
    // the click spot: between the bars and the wheel, taking in both
    const HB_R = 9;
    // (a finger's slack round each egg, as the viewer allows it)
    const SLACK = 6;
    const hbCX = hbX + 4;
    const hbCY = HB_Y - 2;
    const onHandlebar = (x: number, y: number, t: number) =>
      handlebarUp(t) && Math.hypot(x - hbCX, y - hbCY) <= HB_R + SLACK;
    // a run that would overlap the call-out never turns up
    const clashes = (s: number) => s < hbAt + FISH_EGG && s + FISH > hbAt;
    const fisherStart = (t: number) => {
      if (fishEggAge(t) >= 0) return null;
      if (t - fishAt < FISH)
        return clashes(fishAt) ? null : { s: fishAt, x: fishX };
      const cycle = 70_000;
      const s0 = Math.floor((t - 30_000) / cycle) * cycle + 30_000;
      // (one that was due while a called-in run was out never turns up)
      if (s0 >= fishAt && s0 < fishAt + FISH) return null;
      if (clashes(s0)) return null;
      return t - s0 < FISH ? { s: s0, x: Math.round(w * 0.35) } : null;
    };
    const ease = (u: number) => 1 - (1 - u) ** 2;
    const runBargeX = (run: { s: number; x: number }, t: number) => {
      const a = (t - run.s) / 1000;
      const stop = run.x - 46; // the crane's pivot sits over the spot
      return Math.round(
        a < 4
          ? -70 + (stop + 70) * ease(a / 4)
          : a < 13
            ? stop
            : stop + (w + 80 - stop) * ((a - 13) / 5) ** 2
      );
    };
    function handlebar(f: Frame, t: number) {
      if (!handlebarUp(t)) return;
      const ea = fishEggAge(t);
      // called: it jerks about as if something's tugging it from below
      const jig = ea >= 0 && ea < 700 ? Math.round(Math.sin(ea / 35) * 1.4) : 0;
      const x = hbX + jig;
      const y = HB_Y + (ea >= HOOK - 400 ? -1 : 0);
      // the top of the back wheel, the bike lying tipped over under water
      for (const [dx, dy] of [
        [5, 0],
        [5, -1],
        [6, -2],
        [7, -3],
        [8, -3],
        [9, -3],
        [10, -2],
        [11, -1],
        [11, 0],
      ] as const)
        f.set(x + dx, y + dy, dy === -3 ? P.rustHi : P.rust);
      f.set(x + 8, y - 1, P.rust);
      f.set(x + 8, y, P.rust);
      // the stem out of the water, swept-back bars, grips, a bell
      f.vline(x, y - 2, y, P.rust);
      f.hline(x - 2, x + 2, y - 3, P.rustHi);
      f.set(x - 3, y - 4, P.rustHi);
      f.set(x + 3, y - 4, P.rustHi);
      f.set(x - 4, y - 5, P.whiteDark);
      f.set(x + 4, y - 5, P.whiteDark);
      f.set(x - 3, y - 5, P.trimDim);
      f.set(x + 3, y - 5, P.trimDim);
      f.set(x + 1, y - 4, P.cart);
      // water lapping round them, and their broken reflections
      const lap = Math.sin(t / 650) > 0;
      f.hline(x - (lap ? 2 : 1), x + (lap ? 1 : 2), y + 1, P.ripple);
      f.hline(x + 5 - (lap ? 0 : 1), x + 11 + (lap ? 1 : 0), y + 1, P.ripple);
      f.blend(x, y + 2, P.rust, 0.35);
      for (const dx of [-2, 2, 6, 8, 10])
        f.blend(x + dx, y + 3, P.rustHi, 0.25);
    }
    /** The barge itself, its heap of `heap` bikes, and the crane's pivot. */
    function barge(f: Frame, bx: number, t: number, heap: number) {
      const y = WL + 16;
      const bob = Math.round(Math.sin(t / 700));
      // hull, wheelhouse, a heap of rusty bikes on deck
      f.rect(bx, y + bob, 60, 4, P.barge);
      f.hline(bx, bx + 59, y + bob, P.bargeHi);
      f.hline(bx + 1, bx + 58, y + 2 + bob, P.trimDim);
      f.rect(bx + 4, y - 8 + bob, 11, 8, P.trim);
      f.rect(bx + 6, y - 6 + bob, 3, 2, P.win);
      f.rect(bx + 10, y - 6 + bob, 3, 2, P.win);
      f.hline(bx + 3, bx + 15, y - 9 + bob, P.barge);
      for (let k = 0; k < heap; k++) {
        const hx = bx + 19 + ((k * 7) % 20);
        const hy = y - 2 - Math.floor(k / 3) * 2 + bob;
        f.disc(hx, hy, 2, (dx, dy) =>
          dx * dx + dy * dy > 1.5 ? P.rust : null
        );
        f.line(hx - 2, hy, hx + 3, hy - 2, P.rustHi);
      }
      // its lights in the rain
      f.set(bx + 59, y - 1 + bob, P.bulb);
      f.set(bx, y - 1 + bob, P.doorRed);
      return { px: bx + 46, py: y - 5 + bob, bob, y };
    }
    function fishers(f: Frame, t: number, snowK: number) {
      const run = fisherStart(t);
      if (!run) return;
      const a = (t - run.s) / 1000;
      const bx = runBargeX(run, t);
      const heap = 3 + Math.min(6, pile + (a > 11 ? 1 : 0));
      const { px, py, bob, y } = barge(f, bx, t, heap);
      ledge(f, bx + 3, bx + 15, y - 9 + bob, snowK);
      // the crane: a yellow boom swinging out over the water and back
      f.rect(px - 1, py, 3, 5, P.craneDark);
      const out =
        a < 4
          ? 0
          : a < 5
            ? a - 4
            : a < 9.5
              ? 1
              : a < 11
                ? 1 - (a - 9.5) / 1.5
                : 0;
      const ang = -2.3 + out * 1.75; // from leaning back over the deck to out over the water
      const L = 20;
      const tx = Math.round(px + Math.cos(ang) * L);
      const ty = Math.round(py + Math.sin(ang) * L);
      f.line(px + 1, py + 1, tx + 1, ty + 1, P.craneDark);
      f.line(px, py, tx, ty, P.crane);
      // the grab on its cable: down into the water, back up with the catch
      const drop =
        a < 5
          ? 3
          : a < 6.5
            ? 3 + ((a - 5) / 1.5) * (y - ty + 1)
            : a < 7.5
              ? y - ty + 1
              : a < 9.5
                ? 3 + (1 - (a - 7.5) / 2) * (y - ty - 2)
                : 3;
      const cy = Math.round(ty + drop);
      f.vline(tx, ty, cy, P.iron);
      f.rect(tx - 2, cy, 5, 2, P.claw);
      f.set(tx - 2, cy + 2, P.claw);
      f.set(tx + 2, cy + 2, P.claw);
      if (a > 6 && a < 7.5)
        for (let k = 0; k < 3; k++)
          f.set(
            tx - 2 + k * 2,
            y - 2 - Math.floor((t / 120 + k) % 3),
            P.waterHi
          );
      // what comes up: usually a bike, sometimes not
      if (a > 7.5 && a < 11) {
        const kind = hash2(Math.floor(run.s), 4, 21);
        const ix = tx;
        const iy = cy + 4;
        if (kind < 0.7) bikeAt(f, ix, iy - 1, P.rust, P.rustHi, h);
        else if (kind < 0.85) cartAt(f, ix, iy - 1, h);
        else {
          f.rect(ix - 2, iy, 4, 3, P.duck);
          f.rect(ix + 1, iy - 2, 2, 2, P.duck);
          f.set(ix + 3, iy - 1, P.claw);
        }
        // dripping
        if (a < 9.5)
          f.set(
            ix - 1 + (Math.floor(t / 90) % 3),
            iy + 5 + (Math.floor(t / 60) % 4),
            P.waterHi
          );
      }
    }

    // what the grab brings up, top at (cx, cy), nothing drawn from `clip` down
    // (still under water)
    function bikeAt(
      f: Frame,
      cx: number,
      cy: number,
      col: RGB,
      hi: RGB,
      clip: number,
      flip = 1
    ) {
      const S = (x: number, y: number, c: RGB) => {
        if (y < clip) f.set(x, y, c);
      };
      for (const wx of [cx - 3, cx + 3])
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const d = dx * dx + dy * dy;
            if (d > 1.5 && d <= 5.2) S(wx + dx, cy + 3 + dy, col);
          }
      // frame, saddle, bars
      for (let k = 0; k <= 3; k++) {
        S(cx - 3 + k, cy + 3 - Math.round((k * 2) / 3), hi);
        S(cx + k, cy + 1 + Math.round((k * 2) / 3), hi);
      }
      S(cx - flip, cy, col);
      S(cx - 2 * flip, cy, col);
      S(cx + 2 * flip, cy - 1, col);
      S(cx + 3 * flip, cy - 1, hi);
    }
    function cartAt(f: Frame, cx: number, cy: number, clip: number) {
      for (let y = cy; y < cy + 4; y++)
        for (let x = cx - 3; x <= cx + 3; x++)
          if (y < clip)
            f.set(x, y, (x + y) % 2 === 0 || y === cy ? P.cart : P.barge);
      if (cy + 5 < clip) {
        f.set(cx - 2, cy + 5, P.iron);
        f.set(cx + 2, cy + 5, P.iron);
      }
      if (cy + 4 < clip) f.hline(cx - 3, cx + 3, cy + 4, P.cart);
    }

    // the call-out: the barge races over with its beacon going, the crane
    // reaches out and telescopes up, and up comes that bike, and another
    // chained to it, and another, and a shopping cart, and a duck riding the
    // lot, dripping, all swung aboard onto a heap
    const CATCH: { kind: 'bike' | 'cart'; col: RGB; hi: RGB }[] = [
      { kind: 'bike', col: P.rust, hi: P.rustHi },
      { kind: 'bike', col: P.bikeRed, hi: P.claw },
      { kind: 'cart', col: P.cart, hi: P.cart },
      { kind: 'bike', col: P.bikeBlue, hi: P.bikeBlueHi },
      { kind: 'bike', col: P.rust, hi: P.rustHi },
    ];
    const LINK = 8; // from one catch to the next down the chain
    const stopE = hbX - 17 - 46;
    function callOut(f: Frame, t: number, snowK: number) {
      const ea = fishEggAge(t);
      if (ea < 0) return;
      const a = ea / 1000;
      const bx = Math.round(
        a < 1.5
          ? eggFrom + (stopE - eggFrom) * ease(a / 1.5)
          : a < 6.8
            ? stopE
            : stopE + (w + 80 - stopE) * ((a - 6.8) / 1.6) ** 2
      );
      // the chain's items land on the heap one by one at the end
      const surface = WL + 17;
      const y = WL + 16;
      // where the boom's tip is
      const restX = bx + 46 - 13;
      const restY = y - 5 - 15;
      const outX = hbX;
      const outY = y - 16;
      const highY = Math.max(40, DECK - 46);
      const heapX = bx + 29;
      let tx: number;
      let ty: number;
      if (a < 1.5) {
        tx = restX;
        ty = restY;
      } else if (a < 2.2) {
        const u = ease((a - 1.5) / 0.7);
        tx = restX + (outX - restX) * u;
        ty = restY + (outY - restY) * u;
      } else if (a < 2.9) {
        tx = outX;
        ty = outY;
      } else if (a < 5.4) {
        // up and up and up
        const u = (a - 2.9) / 2.5;
        tx = outX;
        ty = outY + (highY - outY) * (u * u * (3 - 2 * u));
      } else if (a < 6.1) {
        // swing it all over the deck
        const u = ease((a - 5.4) / 0.7);
        tx = outX + (heapX - outX) * u;
        ty = highY + 8 * u;
      } else if (a < 6.9) {
        // and let it down onto the heap
        const u = smooth((a - 6.1) / 0.8);
        tx = heapX;
        ty = highY + 8 + (y - 14 - highY - 8) * u;
      } else {
        const u = Math.min(1, ease((a - 6.9) / 0.6));
        tx = heapX + (restX - heapX) * u;
        ty = y - 14 + (restY - (y - 14)) * u;
      }
      tx = Math.round(tx);
      ty = Math.round(ty);
      // the grab: on the end of the boom, or down in the water
      const grabY =
        a < 2.2
          ? ty + 3
          : a < 2.6
            ? ty + 3 + ((a - 2.2) / 0.4) * (surface - ty)
            : a < 2.9
              ? surface + 1
              : ty + 3;
      const gy = Math.round(grabY);
      // what's hanging under it (from when it's got hold), and how much of
      // that has landed on the heap
      const hooked = a >= 2.9 && a < 7.2;
      const deck = y - 3;
      let landed = 0;
      const items: { x: number; y: number; k: number }[] = [];
      if (hooked) {
        for (let k = 0; k < CATCH.length; k++) {
          const sway =
            Math.sin(t / 380 + k * 0.7) * k * 0.45 * (a < 5.4 ? 1 : 2);
          const iy = gy + 3 + k * LINK;
          if (iy + 6 > deck && a > 6.1) {
            landed++;
            continue;
          }
          items.push({ x: Math.round(tx + sway), y: iy, k });
        }
      } else if (a >= 7.2) landed = CATCH.length;

      // the beacon's light sweeping round over the whole canal
      const env = Math.min(1, a / 0.3, (8.4 - a) / 0.6);
      const bcx = bx + 9;
      const bcy = y - 11 + Math.round(Math.sin(t / 700));
      const th = t / 280;
      const c = Math.cos(th);
      if (c > 0.05) {
        // a pulse of amber round the barge, and the beam sweeping across
        glow(f, bcx, bcy + 6, 34, P.beacon, 0.32 * env * c, 0.7, 0.06);
        const mid = bcx + Math.sin(th) * w * 0.8;
        for (let yy = 30; yy < h; yy++) {
          const half = 10 + Math.abs(yy - bcy) * 0.4;
          const x0 = Math.max(0, Math.round(mid - half));
          const x1 = Math.min(w - 1, Math.round(mid + half));
          for (let xx = x0; xx <= x1; xx++) {
            const d = Math.abs(xx - mid) / half;
            const al = 0.5 * env * c * (1 - d * d);
            if (al > 0.03 && bayer8(xx, yy) < 0.9)
              f.blend(xx, yy, P.beacon, al);
          }
        }
      }
      // the floodlight on the boom, down on the water where the bike is
      if (a > 1.9 && a < 6.2) {
        const fk = Math.min(1, (a - 1.9) / 0.3, (6.2 - a) / 0.3);
        const bot = surface + 2;
        for (let yy = ty + 2; yy < bot; yy++) {
          const half = 1 + (yy - ty) * 0.22;
          for (let xx = Math.round(tx - half); xx <= tx + half; xx++)
            if ((xx + yy) % 2 === 0) f.blend(xx, yy, P.flood, 0.16 * fk);
        }
        const pr = 6 + (bot - ty) * 0.22;
        for (let yy = bot - 3; yy <= bot + 3; yy++)
          for (let xx = Math.round(tx - pr); xx <= tx + pr; xx++) {
            const d = Math.hypot((xx - tx) / pr, (yy - bot) / 3.5);
            if (d < 1) f.blend(xx, yy, P.flood, 0.45 * fk * (1 - d));
          }
      }

      const { px, py, bob } = barge(
        f,
        bx,
        t,
        3 + Math.min(6, pileAtEgg) + landed
      );
      ledge(f, bx + 3, bx + 15, y - 9 + bob, snowK);
      // the bow wave as it races in
      if (a < 1.6 && bx > -60) {
        const sp = 1 - a / 1.6;
        for (let k = 0; k < 6; k++) {
          const sx = bx + 60 + k;
          const sy =
            y - 1 + bob - Math.round(Math.abs(Math.sin(t / 60 + k)) * 3 * sp);
          f.set(sx, sy, P.snow);
          f.blend(sx - 3 - k * 2, y + 3 + bob, P.snow, 0.5 * sp);
        }
      }
      // the beacon itself
      const flashOn = Math.cos(th) > 0.6;
      f.rect(bcx - 1, bcy, 3, 2, P.craneDark);
      f.set(bcx, bcy - 1, flashOn ? P.duck : P.beacon);
      if (flashOn) glow(f, bcx, bcy - 1, 6, P.beacon, 0.55 * env, 1, 0.08);
      // the crane: its post, the boom out to the tip, the telescoped part
      // a lighter yellow
      f.rect(px - 1, py, 3, 5, P.craneDark);
      const len = Math.hypot(tx - px, ty - py);
      const base = Math.min(len, 20);
      const bxe = px + ((tx - px) * base) / Math.max(1, len);
      const bye = py + ((ty - py) * base) / Math.max(1, len);
      f.line(px + 1, py + 1, tx + 1, ty + 1, P.craneDark);
      f.line(px, py, tx, ty, P.boom);
      f.line(px, py, bxe, bye, P.crane);
      f.line(px + 1, py, bxe + 1, bye, P.crane);
      // warning stripes on the extension
      for (let s = base + 3; s < len - 1; s += 6) {
        const sx = px + ((tx - px) * s) / len;
        const sy = py + ((ty - py) * s) / len;
        f.set(sx, sy, P.iron);
      }
      // the floodlight lamp on the tip
      if (a > 1.9 && a < 6.2) f.set(tx, ty - 1, P.flood);
      // cable and grab
      f.vline(tx, ty, gy, P.iron);
      f.rect(tx - 2, gy, 5, 2, P.claw);
      f.set(tx - 2, gy + 2, P.claw);
      f.set(tx + 2, gy + 2, P.claw);
      // the grab going in
      if (a > 2.5 && a < 3.2)
        for (let k = 0; k < 5; k++)
          f.set(
            outX - 4 + k * 2,
            surface - 1 - Math.floor((t / 90 + k * 1.7) % 4),
            P.waterHi
          );
      // the catch, chained together, pouring water
      for (const it of items) {
        const cat = CATCH[it.k]!;
        if (it.k > 0) {
          // chained to the one above
          const above = items.find((o) => o.k === it.k - 1);
          const ax = above ? above.x : tx;
          for (let yy = it.y - LINK + 6; yy < it.y; yy++)
            if (yy < surface && (yy & 1) === 0)
              f.set(
                Math.round(ax + ((it.x - ax) * (yy - it.y + LINK)) / LINK),
                yy,
                P.cart
              );
        }
        if (cat.kind === 'bike')
          bikeAt(
            f,
            it.x,
            it.y + 1,
            cat.col,
            cat.hi,
            surface,
            it.k % 2 ? -1 : 1
          );
        else cartAt(f, it.x, it.y + 1, surface);
        // water pouring off it
        if (a < 6.3 && it.y + 6 < surface)
          for (let j = 0; j < 3; j++) {
            const dx = [-3, 0, 3][j]!;
            for (
              let yy = it.y + 7;
              yy < Math.min(surface, it.y + 7 + LINK);
              yy++
            )
              if (Math.floor(yy - t / 45 + j * 2) % 3 === 0)
                f.set(it.x + dx, yy, P.waterHi);
          }
      }
      // a duck riding the top bike, very pleased with itself
      const top = items.find((o) => o.k === 0);
      if (top && top.y < surface - 3) {
        f.rect(top.x - 6, top.y - 1, 4, 2, P.duck);
        f.rect(top.x - 6, top.y - 3, 2, 2, P.duck);
        f.set(top.x - 7, top.y - 2, P.claw);
        f.set(top.x - 3, top.y - 2, P.duck);
      }
      // the bell rings out as they come for it
      if (a < 0.9) {
        const r = 3 + a * 26;
        const al = 0.85 * (1 - a / 0.9);
        const steps = Math.ceil(r * 5);
        for (let s = 0; s < steps; s++) {
          const ang = (s / steps) * Math.PI * 2;
          f.blend(
            hbX + 1 + Math.cos(ang) * r,
            HB_Y - 4 + Math.sin(ang) * r * 0.8,
            P.duck,
            al
          );
        }
      }
    }

    // ---------- the blizzard ----------
    // a plane in the holding stack over the city, round and round, waiting
    // for the storm to let it land: cabin windows, beacon, strobes
    const HOLD_SPAN = Math.max(60, Math.min(w - 50, 300));
    const holdX0 = Math.round(
      Math.max(20, Math.min(w - 20 - HOLD_SPAN, w * 0.58 - HOLD_SPAN / 2))
    );
    const PLANE_V = 0.011; // px per ms
    const LEG = HOLD_SPAN / PLANE_V;
    const TURN = 2600;
    const LAP = 2 * (LEG + TURN);
    const NEAR_Y = 14;
    const FAR_Y = 9;
    const PLANE_R = 8;
    type View = 'side' | 'head' | 'far';
    type PlanePos = { x: number; y: number; dir: 1 | -1; view: View };
    function holding(t: number): PlanePos {
      const p = (((t + LAP * 0.3) % LAP) + LAP) % LAP;
      const xR = holdX0 + HOLD_SPAN;
      // round the ends it banks towards us for a moment, wings level
      const turn = (u: number): View =>
        Math.abs(u - 0.5) < 0.16 ? 'head' : 'side';
      if (p < LEG)
        return { x: holdX0 + p * PLANE_V, y: NEAR_Y, dir: 1, view: 'side' };
      if (p < LEG + TURN) {
        const u = (p - LEG) / TURN;
        return {
          x: xR + Math.sin(u * Math.PI) * 7,
          y: NEAR_Y - (NEAR_Y - FAR_Y) * smooth(u),
          dir: u < 0.5 ? 1 : -1,
          view: turn(u),
        };
      }
      if (p < 2 * LEG + TURN)
        return {
          x: xR - (p - LEG - TURN) * PLANE_V,
          y: FAR_Y,
          dir: -1,
          view: 'side',
        };
      const u = (p - 2 * LEG - TURN) / TURN;
      return {
        x: holdX0 - Math.sin(u * Math.PI) * 7,
        y: FAR_Y + (NEAR_Y - FAR_Y) * smooth(u),
        dir: u < 0.5 ? -1 : 1,
        view: turn(u),
      };
    }
    // an airliner side on, nose to the right, its cabin lit (15 x 5); head
    // on as it banks round; small and far off as it leaves
    // prettier-ignore
    const PLANE_SPRITES: Record<View, { rows: string[]; lights: [number, number][]; beacon: [number, number] }> = {
      side: {
        rows: [
          'TT.............',
          '.TT............',
          '.TPPPPPPPPPPPP.',
          '.PwwwwwwwwwwwPN',
          '..pppppWWWppp..',
        ],
        lights: [[0, 0], [8, 4]],
        beacon: [7, 1],
      },
      head: {
        rows: [
          '....T....',
          'WWWWPWWWW',
          '....p....',
        ],
        lights: [[0, 1], [8, 1]],
        beacon: [4, 0],
      },
      far: {
        rows: [
          'T.......',
          'TPwwwwPN',
          '...WW...',
        ],
        lights: [[0, 0], [4, 2]],
        beacon: [4, 0],
      },
    };
    const planeCol: Record<string, RGB> = {
      T: P.plane,
      P: P.planeHi,
      p: P.plane,
      w: P.busGlass,
      N: P.planeHi,
      W: P.plane,
    };
    function drawPlane(
      f: Frame,
      pos: PlanePos,
      t: number,
      alpha = 1,
      wild = false
    ) {
      const sp = PLANE_SPRITES[pos.view];
      const rows = sp.rows;
      const pw = rows[0]!.length;
      const x0 = Math.round(pos.x) - (pw >> 1);
      const y0 = Math.round(pos.y) - (rows.length >> 1);
      const X = (rx: number) => (pos.dir === 1 ? x0 + rx : x0 + pw - 1 - rx);
      for (let ry = 0; ry < rows.length; ry++)
        for (let rx = 0; rx < pw; rx++) {
          const ch = rows[ry]![rx]!;
          if (ch !== '.') f.dset(X(rx), y0 + ry, planeCol[ch]!, alpha);
        }
      if (alpha < 0.3) return;
      // a red beacon on top, a nav light on the wingtip, double-flash strobes
      const [bx, by] = sp.beacon;
      if (t % 1100 < 180 || wild) {
        f.set(X(bx), y0 + by, P.navRed);
        f.blend(X(bx), y0 + by - 1, P.navRed, 0.6);
      }
      const [nx, ny] = sp.lights[1]!;
      f.set(X(nx), y0 + ny, pos.dir === 1 ? P.navGreen : P.navRed);
      const q = t % 1500;
      if (q < 70 || (q > 190 && q < 260) || (wild && t % 220 < 100)) {
        const big = wild ? 3.2 : 1.8;
        for (const [lx, ly] of sp.lights) {
          const sx = X(lx);
          const sy = y0 + ly;
          f.set(sx, sy, P.strobe);
          for (let dy = -3; dy <= 3; dy++)
            for (let dx = -3; dx <= 3; dx++) {
              const d = Math.hypot(dx, dy);
              if (d > 0 && d <= big)
                f.blend(
                  sx + dx,
                  sy + dy,
                  P.strobe,
                  0.7 * (1 - d / (big + 0.5))
                );
            }
        }
      }
    }

    const BLIZ = 8000;
    let blizAt = -Infinity;
    let blizFrom: PlanePos = { x: 0, y: 0, dir: 1, view: 'side' };
    const blizAge = (t: number) => {
      const a = t - blizAt;
      return a >= 0 && a < BLIZ ? a : -1;
    };
    /** How hard it's snowing, 0..1. */
    const storm = (a: number) =>
      a < 300
        ? 0
        : a < 1800
          ? smooth((a - 300) / 1500)
          : a < 5600
            ? 1
            : a < 7800
              ? 1 - smooth((a - 5600) / 2200)
              : 0;
    /** How white the roofs are: it settles, then melts back into the rain. */
    const cover = (a: number) =>
      a < 700
        ? 0
        : a < 2600
          ? (a - 700) / 1900
          : a < 6000
            ? 1
            : a < 7900
              ? 1 - (a - 6000) / 1900
              : 0;
    /** The planes overhead: circling, or the one turning back. */
    function planes(f: Frame, t: number, ba: number) {
      if (ba < 0 || ba > 7000) {
        const fade = ba < 0 ? 1 : (ba - 7000) / 1000;
        drawPlane(f, holding(t), t, fade);
      }
      if (ba < 0 || ba > 3800) return;
      // it banks hard round and heads back the way it came, into the storm
      const { x: x0, y: y0, dir } = blizFrom;
      const back = dir === 1 ? -1 : 1;
      const R = 10;
      const at = (ms: number): PlanePos => {
        if (ms < 1300) {
          const u = smooth(ms / 1300);
          return {
            x: x0 + dir * R * Math.sin(u * Math.PI),
            y: y0 + 3 * Math.sin(u * Math.PI) - 2 * u,
            dir: u < 0.5 ? dir : back,
            view: Math.abs(u - 0.5) < 0.2 ? 'head' : 'side',
          };
        }
        const b = (ms - 1300) / 1000;
        return {
          x: x0 + back * b * (30 + b * 12),
          y: y0 - 2 - b * 2.5,
          dir: back,
          view: b > 0.9 ? 'far' : 'side',
        };
      };
      // the trail of its lights round the turn
      for (let ms = 0; ms < Math.min(ba, 2300); ms += 60) {
        const age = ba - ms;
        if (age > 1700) continue;
        const p = at(ms);
        f.blend(
          p.x,
          p.y,
          (ms / 60) % 2 ? P.strobe : P.navRed,
          0.8 * (1 - age / 1700)
        );
      }
      drawPlane(f, at(ba), t, Math.min(1, (3800 - ba) / 1000), ba < 1000);
    }
    const HAZE = [P.haze & 0xff, (P.haze >> 8) & 0xff, P.haze >> 16] as const;
    // gusts: a ramp across the picture that slides along, 70 px a wave
    const gustAt = new Float32Array(70);
    /** Haze blowing over everything, in gusts sweeping across. */
    function whiteout(f: Frame, t: number, k: number, fr: number) {
      const { x: sx, y: sy } = blizFrom;
      const r2 = fr * fr;
      const px = f.pixels;
      const [HR, HG, HB] = HAZE;
      const tq = Math.floor(t * 0.16);
      for (let g = 0; g < 70; g++) {
        const u = g / 70;
        const tri = u < 0.5 ? u * 2 : 2 - u * 2;
        gustAt[g] = 0.2 * tri * tri;
      }
      const all = fr >= 900;
      for (let y = 0; y < h; y++) {
        const base = y < FAR_QUAY ? 0.3 : 0.24;
        const off = Math.floor(y * 0.6) + tq;
        const dy2 = (y - sy) ** 2;
        for (let x = 0; x < w; x++) {
          if (!all && (x - sx) ** 2 + dy2 > r2) continue;
          const al = k * (base + gustAt[(x + off) % 70]!);
          const q = Math.floor(al * 8 + bayer8(x, y)) / 8;
          if (q <= 0) continue;
          const i = y * w + x;
          const p = px[i]!;
          const r = p & 0xff;
          const gg = (p >>> 8) & 0xff;
          const b = (p >>> 16) & 0xff;
          px[i] =
            (0xff000000 |
              (((b + (HB - b) * q) | 0) << 16) |
              (((gg + (HG - gg) * q) | 0) << 8) |
              ((r + (HR - r) * q) | 0)) >>>
            0;
        }
      }
    }
    /** Snow driving sideways across the whole picture. */
    function streaks(f: Frame, t: number, k: number, fr: number) {
      const { x: sx, y: sy } = blizFrom;
      const n = Math.round(w * 1.15 * k);
      const span = w + 40;
      for (let i = 0; i < n; i++) {
        const near = hash2(i, 0, 61) < 0.3;
        const sp = (near ? 0.36 : 0.2) + hash2(i, 1, 61) * 0.1;
        const len = near
          ? 5 + Math.floor(hash2(i, 2, 61) * 6)
          : 2 + Math.floor(hash2(i, 2, 61) * 3);
        const x = w + 20 - ((hash2(i, 3, 61) * span + t * sp) % span);
        const fall = 0.015 + hash2(i, 4, 61) * 0.03;
        const y =
          ((hash2(i, 5, 61) * (h + 10) + t * fall) % (h + 10)) -
          5 +
          Math.sin(t / 240 + i) * 1.5;
        if (fr < 900 && (x - sx) ** 2 + (y - sy) ** 2 > fr * fr) continue;
        for (let j = 0; j < len; j++) {
          const al = (1 - j / len) * (near ? 1 : 0.6);
          f.blend(x + j, y - j * 0.22, P.snow, al);
        }
      }
    }
    // a bus with its windows lit, trundling across the bridge
    const BUS_L = 44;
    const busX = (a: number) => {
      const u = (a - 1300) / 6000;
      return u < 0 || u > 1
        ? null
        : Math.round(-BUS_L - 8 + u * (w + BUS_L + 16));
    };
    const busTop = (t: number) =>
      DECK - 15 + (Math.floor(t / 210) % 3 === 0 ? 1 : 0);
    function bus(f: Frame, a: number, t: number, snowK: number) {
      const x = busX(a);
      if (x === null) return;
      const top = busTop(t);
      f.hline(x + 2, x + BUS_L - 3, top, P.busRoof);
      f.rect(x + 1, top + 1, BUS_L - 2, 1, P.busRoof);
      f.rect(x, top + 2, BUS_L, 10, P.bus);
      busLights(f, a, t);
      // a white stripe, the skirt, wheels
      f.hline(x, x + BUS_L - 1, top + 8, P.busStripe);
      f.hline(x, x + BUS_L - 1, top + 11, P.busShade);
      for (const wx of [x + 7, x + BUS_L - 13]) {
        f.disc(wx, DECK - 3, 2, P.iron);
        f.set(wx, DECK - 3, P.cart);
      }
      // snow piling on the roof
      ledge(f, x + 2, x + BUS_L - 3, top, snowK);
      railing(f, x - 2, x + BUS_L + 1, snowK);
      // its windows shining on the snowy deck below
      for (let k = x + 2; k < x + BUS_L - 4; k += 2)
        f.blend(k, DECK, P.busGlass, 0.45);
    }
    /** Its lit windows, heads in them, and its lights: they shine through the haze. */
    function busLights(f: Frame, a: number, t: number) {
      const x = busX(a);
      if (x === null) return;
      const top = busTop(t);
      f.rect(x + 2, top + 3, BUS_L - 11, 4, P.busGlass);
      f.hline(x + 2, x + BUS_L - 10, top + 3, P.winHi);
      for (let k = 0; k * 5 + 2 < BUS_L - 10; k++) {
        const wx = x + 2 + k * 5;
        f.vline(wx + 4, top + 3, top + 6, P.bus);
        if (hash2(k, 7, 71) > 0.2) {
          // passengers' heads in the windows, one of them light-brown
          const hc = k === 3 ? P.manHair : P.busHead;
          f.rect(wx + 1, top + 5, 2, 2, hc);
          f.set(wx + 1 + (k & 1), top + 4, hc);
        }
      }
      // the door and the windscreen up front
      f.rect(x + BUS_L - 9, top + 3, 2, 7, P.busGlass);
      f.rect(x + BUS_L - 5, top + 3, 4, 5, P.busGlass);
      f.hline(x + BUS_L - 5, x + BUS_L - 2, top + 3, P.winHi);
      f.set(x + BUS_L - 1, top + 3, P.bus);
      // lights
      f.rect(x + BUS_L - 2, top + 9, 2, 2, P.bulb);
      f.set(x, top + 9, P.navRed);
      f.set(x, top + 10, P.navRed);
    }
    /** The bus's headlights out ahead of it, through the driving snow. */
    function busBeam(f: Frame, a: number, t: number) {
      const x = busX(a);
      if (x === null) return;
      busLights(f, a, t);
      const hx = x + BUS_L;
      const hy = busTop(t) + 10;
      for (let d = 0; d < 48; d++) {
        const half = 1 + d * 0.2;
        const al = 0.6 * (1 - d / 48);
        for (let y = Math.round(hy - half); y <= hy + half * 0.5; y++) {
          const q = al * (1 - Math.abs(y - hy) / (half + 1));
          if (q > bayer8(hx + d, y) * 0.6) f.blend(hx + d, y, P.bulb, q);
        }
      }
    }

    // ---------- the hotel ----------
    const hw: Win = (hotelWin as Win | null) ?? {
      x: 40,
      y: 40,
      w: 4,
      h: 5,
      lit: true,
      color: P.win,
    };
    const hotelCX = hw.x + 2;
    const hotelCY = hw.y + 2;
    const HOTEL_R = 7;
    const LS = 8000;
    let lsAt = -Infinity;
    const lsAge = (t: number) => {
      const a = t - lsAt;
      return a >= 0 && a < LS ? a : -1;
    };
    const IW = Math.max(84, Math.min(240, Math.round(w * 0.36)));
    const room = hotelRoom(IW);
    const roomFrame = new Frame(IW, ROOM_H);
    const insetX = Math.max(
      3,
      Math.min(w - IW - 3, Math.round(hotelCX - IW / 2))
    );
    const insetY = Math.max(4, Math.min(h - ROOM_H - 8, hw.y - 22));
    const OPEN0 = 150;
    const OPEN1 = 650;
    const CLOSE0 = 7350;
    const CLOSE1 = 7900;
    /** The close-up's outer edge at age `a` (ms), frame included, or null. */
    function insetRect(a: number) {
      const p =
        a < OPEN0
          ? 0
          : a < OPEN1
            ? 1 - (1 - (a - OPEN0) / (OPEN1 - OPEN0)) ** 3
            : a < CLOSE0
              ? 1
              : a < CLOSE1
                ? 1 - smooth((a - CLOSE0) / (CLOSE1 - CLOSE0))
                : 0;
      if (p <= 0) return null;
      const lerp = (u: number, v: number) => Math.round(u + (v - u) * p);
      const x = lerp(hw.x - 1, insetX - 2);
      const y = lerp(hw.y - 1, insetY - 2);
      return {
        x,
        y,
        w: lerp(hw.x + 5, insetX + IW + 2) - x,
        h: lerp(hw.y + 6, insetY + ROOM_H + 2) - y,
      };
    }
    function hotelWindow(f: Frame, t: number, la: number) {
      // it blinks off and on now and then
      const q = t % 11_000;
      let lit = !(q > 10_300 && (q < 10_420 || (q > 10_560 && q < 10_700)));
      if (la >= 0) lit = la >= CLOSE1;
      const { x, y } = hw;
      if (lit) glow(f, x + 2, y + 2, 8, P.hotel, 0.4, 1, 0.1);
      f.rect(x - 1, y - 1, 6, 7, P.trimDim);
      f.rect(x, y, 4, 5, P.trim);
      f.rect(x + 1, y + 1, 2, 3, lit ? P.hotel : P.glass);
      if (lit) {
        // a bedside lamp's shade glowing in it
        f.set(x + 1, y + 1, P.hotelHi);
        f.set(x + 2, y + 1, P.hotelHi);
        f.set(x + 2, y + 3, P.hotelLamp);
      } else f.set(x + 1, y + 1, P.glassHi);
    }
    function closeUp(f: Frame, t: number, la: number) {
      const r = insetRect(la);
      if (!r) return;
      const a = la / 1000;
      room.draw(roomFrame, a, t);
      const back = a - LIGHT_BACK;
      // the light flooding out round it when it comes back on
      if (back >= 0 && back < 0.7) {
        const k = 1 - back / 0.7;
        const R = 18;
        for (let y = r.y - R; y < r.y + r.h + R; y++)
          for (let x = r.x - R; x < r.x + r.w + R; x++) {
            const dx = Math.max(r.x - x, 0, x - (r.x + r.w - 1));
            const dy = Math.max(r.y - y, 0, y - (r.y + r.h - 1));
            const d = Math.hypot(dx, dy);
            if (d <= 0 || d >= R) continue;
            const al = 0.5 * k * (1 - d / R);
            const q = Math.floor(al * 6 + bayer8(x, y)) / 6;
            if (q > 0) f.blend(x, y, P.roomFlood, q);
          }
      }
      // drop shadow, then the frame: like looking in through its window
      for (let y = r.y + 2; y < r.y + r.h + 2; y++)
        for (let x = r.x + 2; x < r.x + r.w + 2; x++)
          if (x >= r.x + r.w || y >= r.y + r.h) f.blend(x, y, P.roomEdge, 0.5);
      f.rect(r.x, r.y, r.w, r.h, P.roomEdge);
      f.rect(r.x + 1, r.y + 1, r.w - 2, r.h - 2, P.roomFrame);
      // the room, with a slight wobble while it's dark
      const wob = back < 0 ? 1 : Math.max(0, 1 - back / 0.5);
      const flood = back >= 0 && back < 0.35 ? 1 - back / 0.35 : 0;
      const dst = f.pixels;
      const src = roomFrame.pixels;
      for (let y = Math.max(0, r.y + 2); y < Math.min(h, r.y + r.h - 2); y++) {
        const ry = y - insetY;
        if (ry < 0 || ry >= ROOM_H) continue;
        const shift = Math.round(Math.sin(ry * 0.3 + t / 260) * 0.9 * wob);
        for (
          let x = Math.max(0, r.x + 2);
          x < Math.min(w, r.x + r.w - 2);
          x++
        ) {
          const rx = Math.max(0, Math.min(IW - 1, x - insetX + shift));
          dst[y * w + x] = src[ry * IW + rx]!;
          if (flood > 0) f.blend(x, y, P.roomFlood, flood * 0.8);
        }
      }
    }

    const ambientEvery = 26_000;
    let strikeAt = -Infinity;
    let strikeX = 0;
    let chaseAt = -Infinity;
    const flipped = new Set<number>();
    let lastT = 0;

    function strike(t: number) {
      const age = t - strikeAt;
      const amb = t % ambientEvery;
      if (age < 600) return { a: age, x: strikeX, seed: Math.round(strikeAt) };
      if (amb < 600)
        return {
          a: amb,
          x: Math.round(hash2(Math.floor(t / ambientEvery), 1, 8) * w),
          seed: Math.floor(t / ambientEvery),
        };
      return null;
    }

    const windowAt = (x: number, y: number) =>
      windows.findIndex(
        (win) =>
          x >= win.x - 1 &&
          x <= win.x + win.w &&
          y >= win.y - 1 &&
          y <= win.y + win.h
      );
    const inRect = (
      r: { x: number; y: number; w: number; h: number } | null,
      x: number,
      y: number
    ) => !!r && x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;

    return {
      render(f, t) {
        lastT = t;
        const ba = blizAge(t);
        const k = ba >= 0 ? storm(ba) : 0;
        const snowK = ba >= 0 ? cover(ba) : 0;
        const fr = ba >= 0 ? (ba - 250) * 0.4 : 0;
        const la = lsAge(t);
        f.copyFrom(sky);
        const s = strike(t);
        // the bolt sits behind the houses, the flash lights everything
        if (s && s.a < 240 && !(s.a > 90 && s.a < 160)) {
          let bx = s.x;
          for (let y = 0; y < FAR_QUAY; y++) {
            const nx = bx + (hash2(y >> 2, 1, s.seed) - 0.5) * 3.4;
            f.line(bx, y, nx, y + 1, P.bolt);
            bx = nx;
          }
        }
        f.over(cloudLayer, Math.round(t / 600), 0, true);
        planes(f, t, ba);
        f.over(town);
        settle(f, townCaps, snowK);
        for (const [i, win] of windows.entries()) {
          const lit = win.lit !== flipped.has(i);
          f.rect(win.x, win.y, win.w, win.h, P.trim);
          f.rect(
            win.x + 1,
            win.y + 1,
            win.w - 2,
            win.h - 2,
            lit ? win.color : P.glass
          );
          f.hline(
            win.x + 1,
            win.x + win.w - 2,
            win.y + (win.h >> 1),
            P.trimDim
          );
          if (lit) {
            f.set(
              win.x + 1,
              win.y + 1,
              win.color === P.winTv ? P.flash : P.winHi
            );
            if ((i * 7) % 5 === 0)
              f.vline(win.x + 2, win.y + 1, win.y + win.h - 2, P.curtain);
          } else {
            f.set(win.x + 1, win.y + 1, P.glassHi);
          }
          // snow on the sills
          if (snowK > 0)
            for (let x = win.x; x < win.x + win.w; x++)
              f.dset(x, win.y + win.h, P.snow, snowK * 1.2 - 0.1);
        }
        hotelWindow(f, t, la);
        f.over(bridge);
        settle(f, bridgeCaps, snowK);
        // (nobody's out cycling in a blizzard)
        if (k < 0.15) cyclists(f, t);
        if (ba >= 0) bus(f, ba, t, snowK);
        // bulbs: steady, or chasing round the arches when the bridge is clicked
        const chase = t - chaseAt < 2600;
        for (const b of bulbs) {
          const on = chase
            ? Math.floor(t / 60 - b.k / 2) % 6 < 2
            : hash2(b.k, Math.floor(t / 400), 2) > 0.04;
          f.set(b.x, b.y, on ? P.bulb : P.bulbDim);
          if (on) f.blend(b.x, b.y + 1, P.bulb, 0.3);
        }
        for (const lx of [cx - a1 - 4, cx + a1 + 4])
          glow(f, lx, DECK - 24, 9, P.lamp, 0.4, 1, 0.22);
        // the canal: a rippling, darkened mirror of everything above it
        // (only the bridge and what's under it: the railing and bikes would
        // just turn into noise down here)
        const mirror = WL - DECK - 1;
        for (let y = WL; y < h; y++) {
          const d = y - WL;
          const wob = Math.round(Math.sin(y * 0.8 + t / 380) * (0.6 + d / 18));
          const broken = (d + Math.floor(t / 500)) % 5 === 0;
          if (d >= mirror) {
            // open water nearer us: dark, with the odd glint of lamplight
            for (let x = 0; x < w; x++) f.set(x, y, P.waterTint);
            if (d % 2 === 0) {
              for (let x = 0; x < w; x += 9) {
                const gx =
                  x +
                  Math.round(hash2(x, d, 40) * 8 + Math.sin(t / 700 + x) * 2);
                if (hash2(gx >> 2, d, Math.floor(t / 900)) > 0.55)
                  f.hline(gx, gx + 2, y, P.waterHi);
              }
            }
            continue;
          }
          const sy = WL - 1 - d;
          const fade = 0.7 * (1 - d / (mirror + 12));
          for (let x = 0; x < w; x++) {
            const src = f.get(x + wob, sy);
            f.set(x, y, lerpRGB(P.waterTint, src, broken ? fade * 0.45 : fade));
          }
        }
        // lamp reflections stretch down the water
        for (const lx of [cx - a1 - 4, cx + a1 + 4]) {
          for (let y = WL + 2; y < h; y += 2) {
            const wob = Math.round(Math.sin(y * 0.7 + t / 300) * 1.5);
            f.blend(lx + wob, y, P.lamp, 0.45 * (1 - (y - WL) / (h - WL)));
          }
        }
        handlebar(f, t);
        tourBoat(f, t, snowK);
        houseboat(f, t, snowK);
        fishers(f, t, snowK);
        callOut(f, t, snowK);
        // rain rings
        const rings = Math.round((w / 16) * (1 - k));
        for (let i = 0; i < rings; i++) {
          const cycle = t / 900 + hash2(i, 0, 12);
          const life = cycle % 1;
          const n = Math.floor(cycle);
          const rx = Math.floor(hash2(i, n, 13) * w);
          const ry = WL + 3 + Math.floor(hash2(i, n, 14) * (h - WL - 4));
          const r = Math.round(life * 3);
          f.blend(rx - r, ry, P.ripple, 0.6 * (1 - life));
          f.blend(rx + r, ry, P.ripple, 0.6 * (1 - life));
        }
        fx.draw(f, t);
        // the rain, or the blizzard blowing in from where the plane turned
        if (k < 1) rain(f, t, P.rain, 0.55 * (1 - k), 5);
        if (k > 0) {
          whiteout(f, t, k, fr);
          streaks(f, t, k, fr);
        }
        if (ba >= 0) busBeam(f, ba, t);
        if (s) {
          const pulse =
            s.a < 90
              ? 1
              : s.a < 160
                ? 0.15
                : s.a < 240
                  ? 0.65
                  : Math.max(0, 1 - (s.a - 240) / 360) * 0.45;
          if (pulse > 0)
            for (let y = 0; y < h; y++)
              for (let x = 0; x < w; x++) f.blend(x, y, P.flash, pulse * 0.28);
        }
        if (la >= 0) closeUp(f, t, la);
      },
      poke(x, y, t) {
        const la = lsAge(t);
        // inside the close-up there's nothing to do but watch
        if (la >= 0 && inRect(insetRect(la), x, y)) return;
        // the hotel's attic window: the light goes off
        if (la < 0 && Math.hypot(x - hotelCX, y - hotelCY) <= HOTEL_R + SLACK) {
          lsAt = t;
          return;
        }
        // the plane in the holding stack: it gives up and turns back
        if (blizAge(t) < 0) {
          const p = holding(t);
          const px = Math.round(p.x);
          const py = Math.round(p.y);
          if (Math.hypot(x - px, y - py) <= PLANE_R + SLACK) {
            blizAt = t;
            blizFrom = p;
            return;
          }
        }
        if (onHandlebar(x, y, t) && fishEggAge(t) < 0) {
          // that bike: the fishers race over (taking over a run that's out
          // already) and lift it out, with everything chained to it
          ripple(fx, t, hbX, HB_Y + 1, P.ripple, {
            rings: 3,
            size: 16,
            squash: 0.35,
          });
          splash(fx, t, hbX, HB_Y, P.waterHi, Math.round(t));
          const run = fisherStart(t);
          eggFrom = run
            ? Math.max(-70, Math.min(w + 10, runBargeX(run, t)))
            : -70;
          if (t - fishAt >= FISH)
            pile = Math.min(6, pile + (fishAt > 0 ? 1 : 0));
          pileAtEgg = pile;
          pile = Math.min(6, pile + 3);
          hbAt = t;
          return;
        }
        const i = windowAt(x, y);
        if (i >= 0 && y < FAR_QUAY) {
          if (flipped.has(i)) flipped.delete(i);
          else flipped.add(i);
          return;
        }
        if (y >= WL) {
          ripple(fx, t, x, y, P.ripple, { rings: 3, size: 12, squash: 0.35 });
          splash(fx, t, x, y, P.waterHi, Math.round(t));
          // something went in the canal: the bike fishers are on their way
          // (unless they're busy with the call-out)
          if (!fisherStart(t) && fishEggAge(t) < 0) {
            if (t - fishAt >= FISH)
              pile = Math.min(6, pile + (fishAt > 0 ? 1 : 0));
            fishAt = t;
            fishX = Math.max(60, Math.min(w - 40, x));
          }
          return;
        }
        if (y >= DECK - 6) {
          chaseAt = t;
          return;
        }
        strikeAt = t;
        strikeX = x;
      },
      hot(x, y) {
        if (listEggs(lastT).some((e) => Math.hypot(x - e.x, y - e.y) <= e.r))
          return true;
        return (
          y >= DECK - 6 ||
          y < 40 ||
          windowAt(x, y) >= 0 ||
          Math.hypot(x - hotelCX, y - hotelCY) <= HOTEL_R
        );
      },
      eggs: listEggs,
    };
    function listEggs(t: number): EggSpot[] {
      const out: EggSpot[] = [];
      // the handlebar, while it's there
      if (handlebarUp(t) && fishEggAge(t) < 0)
        out.push({ id: 'bike-fishers', x: hbCX, y: hbCY, r: HB_R });
      // the plane, wherever it's got to in the holding pattern
      if (blizAge(t) < 0) {
        const p = holding(t);
        out.push({
          id: 'blizzard',
          x: Math.round(p.x),
          y: Math.round(p.y),
          r: PLANE_R,
        });
      }
      // the hotel's little window
      const la = lsAge(t);
      if (la < 0)
        out.push({ id: 'light-switch', x: hotelCX, y: hotelCY, r: HOTEL_R });
      // (nothing under the close-up while it's open)
      const r = la >= 0 ? insetRect(la) : null;
      return r ? out.filter((e) => !inRect(r, e.x, e.y)) : out;
    }
  },
};
