// Underground Kyiv, for the kyiv scene's metro easter egg. The camera dips
// under the square and rides down one of the city's famously deep
// escalators with a young man (short light-brown hair, a big backpack, eyes
// like saucers), the lamps rushing past through the clay and the rock; then
// the platform, where a train bursts out of the tunnel with its headlights
// blazing and a gust of wind.
// Everything is a closed-form function of the time since the click.

import { bayer8, Frame, lerpRGB, type RGB, sprite } from '../frame';
import { hash2 } from '../noise';
import { palette } from '../scene';

/** The young man's colours; the square's small figure of him uses them too. */
export const LAD = palette({
  // short light-brown hair
  hair: '#8e6440',
  hairHi: '#b88a5a',
  eye: '#ffffff',
  pupil: '#2a1e1a',
  skin: '#f2c6a2',
  skinSh: '#d29a78',
  mouth: '#7a2e2e',
  hoodie: '#2a2b36',
  hoodieLit: '#50526a',
  hoodieSh: '#17171f',
  jeans: '#2c4a86',
  jeansLit: '#5a7ac0',
  shoes: '#a8a4ae',
  pack: '#c4552e',
  packHi: '#e8834e',
  packSh: '#8a3820',
  strap: '#3a2a24',
});

const C = palette({
  // the ground, from the setts down to the rock
  sett: '#d0c5ad',
  settHi: '#efe8d8',
  joint: '#9e9179',
  bedding: '#dccb9e',
  beddingDot: '#c8b68a',
  soil: '#6e4c36',
  soilDot: '#58392a',
  root: '#a0805e',
  loess: '#c69c64',
  loessDot: '#b08652',
  clay: '#a6683e',
  clayDot: '#8e5634',
  sand: '#d8ba7a',
  sandDot: '#c2a264',
  blueClay: '#7e8898',
  blueClayDot: '#6c7686',
  rock: '#5e5a6a',
  rockDot: '#4c4858',
  deep: '#45414f',
  deepDot: '#36323f',
  // the escalator tube
  lining: '#8c8578',
  liningSh: '#6a645a',
  vault: '#a8916a',
  wall: '#cdb890',
  wallLit: '#dcc9a2',
  rib: '#bba57c',
  strip: '#fff3cc',
  rail: '#26242c',
  railHi: '#5c5866',
  panel: '#8e5a34',
  panelHi: '#b67e4c',
  panelSh: '#6a4026',
  tread: '#c6cad2',
  riser: '#8a8e98',
  riserSh: '#6c707a',
  truss: '#34343e',
  trussHi: '#4a4a58',
  bronze: '#9a7440',
  bronzeHi: '#c89c58',
  globe: '#fffbe6',
  glow: '#ffd27a',
  trail: '#ffeab0',
  // the platform hall
  ceil: '#cdbb92',
  ceilSh: '#b39f78',
  arch: '#e2d4b2',
  marble: '#ece2ca',
  marbleSh: '#dacca8',
  vein: '#cbbb96',
  plinth: '#5c5048',
  dark: '#0d0c12',
  portal: '#6c665c',
  portalHi: '#8c857a',
  bed: '#28262c',
  sleeper: '#3c3638',
  steel: '#8e9098',
  steelHi: '#d4d8e0',
  edge: '#ece6d6',
  edgeSh: '#bcb6a6',
  floor: '#a29d94',
  floorSh: '#8f8a81',
  floorHi: '#b8b3a8',
  // the train
  roof: '#9aa4aa',
  body: '#2e7d92',
  bodyHi: '#4c9eb2',
  bodySh: '#22606f',
  band: '#e2e6e4',
  bandSh: '#c2c8c8',
  skirt: '#1c2830',
  wheel: '#121418',
  win: '#ffe7a6',
  winSh: '#e2bd76',
  rider: '#7c6a5e',
  door: '#1d5868',
  cab: '#1a2a34',
  cabHi: '#5a7a8c',
  lamp: '#fffdf0',
  beam: '#fff4d0',
  paper: '#f4f2ea',
  paperSh: '#c9c4b6',
  wind: '#ffffff',
});

/** Timeline of the egg, in ms after the click. */
export const METRO = {
  /** the camera dips under the square */
  dip: 700,
  /** the escalator reaches the bottom; the platform fades in */
  ride: 4300,
  mix: 400,
  /** the train's nose comes out of the tunnel, and where it stops */
  burst: 5400,
  stop: 6650,
  /** the camera rises back to the square */
  rise: 7100,
  end: 7800,
};

const smooth = (u: number) => {
  const c = Math.min(1, Math.max(0, u));
  return c * c * (3 - 2 * c);
};

/**
 * The young man riding down, body facing down the escalator (right), head
 * turned to us, eyes like saucers; the big pack on his back. 13 x 26; his
 * hand (bottom right) goes on the handrail.
 *
 * H hair  h hair lit  W eye  p pupil  s skin  S skin shade  o mouth
 * J hoodie  j hoodie lit  K hoodie shade  L jeans  l jeans lit  e shoes
 * B pack  T pack lit  b pack shade  x strap
 */
const RIDE = [
  '.TTT....h.H..',
  'TTTTT.HHhHHhH',
  'BTTTB.HhHHHhH',
  'BBBBB.sWWsWWs',
  'BBBBb.sWpsWps',
  'BBBBb.Sssssss',
  'BBBBb..ssoss.',
  'BBBBbx..sss..',
  'BBBBbxJJJJJ..',
  'BBBBbxJJJJJj.',
  'BBBBbxJJJJjK.',
  'TBBBbJJJJJjK.',
  'BBBBbJJJJJJjK',
  'BBBBbJJJJJJ.K',
  'BBBBbJJJJJJ.K',
  'bbbbbKJJJJJ.s',
  '.bbbbKKKKKK..',
  '......LLlL...',
  '......LLlL...',
  '......LLlL...',
  '......LL.L...',
  '......LL.LL..',
  '......LL.LL..',
  '......LL..L..',
  '.....eee.ee..',
  '.....eeeeeee.',
];
/** His hair blowing about (the draft on the way down, the train's gust). */
const HAIR_A = ['.......h.H...', '......HHhHHhH'];
const HAIR_B = ['....h..Hh....', '...HHHhHHHH..'];
const HAIR_C = ['.....hH.Hh...', '....HHhHHHhH.'];
/** Standing on the platform: arms at his sides. */
const STAND = RIDE.map((r, i) =>
  i === 12
    ? 'BBBBbJJJJJJj.'
    : i === 13 || i === 14
      ? 'BBBBbJJJJJJK.'
      : i === 15
        ? 'bbbbbKJJJJJs.'
        : r
);

const LAD_KEYS: Record<string, RGB> = {
  H: LAD.hair,
  h: LAD.hairHi,
  W: LAD.eye,
  p: LAD.pupil,
  s: LAD.skin,
  S: LAD.skinSh,
  o: LAD.mouth,
  J: LAD.hoodie,
  j: LAD.hoodieLit,
  K: LAD.hoodieSh,
  L: LAD.jeans,
  l: LAD.jeansLit,
  e: LAD.shoes,
  B: LAD.pack,
  T: LAD.packHi,
  b: LAD.packSh,
  x: LAD.strap,
};

function lad(f: Frame, x: number, y: number, body: string[], hair: number) {
  sprite(f, body, x, y, LAD_KEYS);
  if (hair > 0) {
    // clear his usual top rows and draw the windblown ones
    const rows = hair === 1 ? HAIR_A : hair === 2 ? HAIR_B : HAIR_C;
    for (let r = 0; r < 2; r++)
      for (let c = 5; c < 13; c++) {
        const ch = rows[r]![c];
        if (ch === 'H') f.set(x + c, y + r, LAD.hair);
        else if (ch === 'h') f.set(x + c, y + r, LAD.hairHi);
      }
  }
}

/** Bands of the ground: bottom edge (world y, before the wobble), fill, speckle. */
const STRATA: [number, RGB, RGB][] = [
  [9, C.bedding, C.beddingDot],
  [36, C.soil, C.soilDot],
  [100, C.loess, C.loessDot],
  [156, C.clay, C.clayDot],
  [222, C.sand, C.sandDot],
  [310, C.blueClay, C.blueClayDot],
  [420, C.rock, C.rockDot],
  [1e9, C.deep, C.deepDot],
];

const PEBBLE = STRATA.map(([, fill]) => lerpRGB(fill, 0xfff6e6, 0.4));

export function metroView(w: number, h: number, entrance: number) {
  // ---------- the escalator ----------
  const S = 0.6; // its slope: 3 px down for every 5 across
  const N = 1 + S * S;
  // where the lad stands, on screen: far enough along that the top of the
  // tube comes up under the entrance on the square
  const mx = Math.round(Math.min(w * 0.62, Math.max(w * 0.3, entrance + 100)));
  const my = 74;
  const L = 560; // how far the camera travels along the tube (x)
  const LAMP_GAP = 38;
  // the ride's speed: speeding up, a long run at full tilt, slowing down
  const PA = 0.22;
  const PD = 0.22;
  const VMAX = 1 / (1 - PA / 2 - PD / 2);
  const along = (p: number) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    if (p < PA) return (VMAX * p * p) / (2 * PA);
    if (p < 1 - PD) return VMAX * (PA / 2 + p - PA);
    const q = 1 - p;
    return 1 - (VMAX * q * q) / (2 * PD);
  };
  const RIDE_MS = METRO.ride - METRO.dip;
  const camAt = (a: number) => L * along((a - METRO.dip) / RIDE_MS);
  /** px of tube per ms at age a */
  const speedAt = (a: number) => (camAt(a + 16) - camAt(a - 16)) / 32;
  const wob = new Float32Array(w);

  function earth(X: number, Y: number, x: number): RGB {
    if (Y < 4) {
      // the setts of the square, cut through
      if (Y === 3 || X % 7 === 0) return C.joint;
      return Y === 0 ? C.settHi : C.sett;
    }
    const Yw = Y + wob[x]!;
    let i = 0;
    while (Yw >= STRATA[i]![0]) i++;
    const [, fill, dot] = STRATA[i]!;
    // a darker seam where one layer meets the next
    if (i > 0 && Yw < STRATA[i - 1]![0] + 1) return dot;
    if (i === 1 && Y < 30 && hash2(X + (Y >> 2), 0, 13) > 0.965) return C.root;
    // the odd pebble
    if (Y % 3 === 1 && X & 3 && (X & 3) < 3) {
      const p = hash2(X >> 2, (Y / 3) | 0, 7);
      if (p > 0.94) return (X & 3) === 1 ? PEBBLE[i]! : dot;
    }
    return hash2(X, Y, 5) > 0.84 ? dot : fill;
  }

  function drawRide(f: Frame, a: number) {
    const u = camAt(a);
    const uX = Math.round(u);
    const uY = Math.round(u * S);
    const v0 = speedAt(a);
    for (let x = 0; x < w; x++) {
      const X = x + uX;
      wob[x] = Math.sin(X / 23) * 3 + Math.sin(X / 9.7 + 1) * 1.5;
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = y - my - (x - mx) * S;
        const X = x + uX;
        let c: RGB;
        if (v < -42 || v > 17) c = earth(X, y + uY, x);
        else if (v < -39 || v > 14) {
          const r = X + (S * v) / N;
          c = ((r % 26) + 26) % 26 < 1.5 ? C.liningSh : C.lining;
        } else {
          // inside the tube; steps are fixed to the lad, so they stay put
          const k = Math.floor((x - mx + 2) / 5);
          const ty = my + 3 * k;
          if (y >= ty) {
            if (y === ty) c = C.tread;
            else if (y <= ty + 2)
              c = (x - mx + 2) % 5 === 4 ? C.riserSh : C.riser;
            else {
              const r = X + (S * v) / N;
              c = (((r + v * 2) % 12) + 12) % 12 < 1.5 ? C.trussHi : C.truss;
            }
          } else if (v >= -11) {
            c = v < -10 ? C.panelHi : v > -3 ? C.panelSh : C.panel;
          } else if (v >= -13) c = v < -12 ? C.railHi : C.rail;
          else if (v < -36) c = C.vault;
          else {
            const r = X + (S * v) / N;
            const rm = ((r % 26) + 26) % 26;
            c = rm < 1 ? C.rib : v > -26 && v < -14 ? C.wallLit : C.wall;
          }
        }
        f.set(x, y, c);
      }
    }
    // the bronze lamps on the balustrade, rushing past
    const trail = Math.min(40, v0 * 170);
    const k0 = Math.floor((uX - 40) / LAMP_GAP);
    for (let k = k0; k * LAMP_GAP - uX < w + 20; k++) {
      const x = k * LAMP_GAP - uX;
      const base = my + (x - mx) * S - 13;
      const gy = base - 10;
      for (let r = 9; r >= 2; r--)
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++) {
            const dd = dx * dx + dy * dy;
            if (dd <= r * r && dd > (r - 1) * (r - 1))
              f.blend(x + dx, gy + dy, C.glow, 0.08 + (9 - r) * 0.04);
          }
      // streaks of light left behind them at speed
      for (let t = 1; t <= trail; t++) {
        const al = (1 - t / (trail + 1)) ** 0.7;
        f.blend(x + t, gy + t * S, C.globe, al);
        f.blend(x + t, gy + t * S - 1, C.trail, al * 0.6);
        f.blend(x + t, gy + t * S + 1, C.glow, al * 0.6);
      }
      f.vline(x, base - 7, base, C.bronze);
      f.set(x - 1, base, C.bronze);
      f.set(x + 1, base, C.bronze);
      f.hline(x - 1, x + 1, base - 7, C.bronzeHi);
      f.rect(x - 1, gy - 1, 3, 3, C.globe);
      f.set(x, gy - 2, C.globe);
    }
    // and the light strips along the vault, streaking too
    for (let k = Math.floor((uX - 60) / 52); k * 52 - uX < w + 20; k++) {
      const x = k * 52 - uX;
      const y = my + (x - mx) * S - 35;
      for (let t = 0; t < 7 + trail * 0.6; t++)
        f.blend(
          x + t,
          y + t * S,
          C.strip,
          t < 7 ? 0.95 : 0.6 * (1 - (t - 7) / (trail * 0.6 + 1))
        );
    }
    // the lad on his step, and the near handrail he's gripping
    const fast = v0 > 0.12;
    const hair = fast ? 1 + (Math.floor(a / 110) % 3) : 0;
    lad(f, mx - 7, my - RIDE.length, RIDE, hair);
    for (let x = 0; x < w; x++) {
      const y = Math.round(my - 13 + (x - mx) * S);
      f.set(x, y, C.rail);
      f.set(x, y - 1, C.railHi);
    }
    f.set(mx + 5, Math.round(my - 13 + 5 * S) - 1, LAD.skin);
    f.set(mx + 5, Math.round(my - 13 + 5 * S), LAD.skin);
  }

  // ---------- the platform ----------
  const FLOOR = 129; // top of the platform's edge
  const TRACK = 124; // the rails
  const TOP = 70; // the train's roof
  const portal = w - 34; // the tunnel mouth
  const ladX = Math.round(w * 0.3) - 6;
  const stopX = Math.round(w * 0.05);
  const CAR = 196;

  /** Where the train's nose is at age a (it runs right to left). */
  const noseAt = (a: number) => {
    if (a < METRO.burst) return Infinity;
    const p = Math.min(1, (a - METRO.burst) / (METRO.stop - METRO.burst));
    return stopX + (w + 6 - stopX) * Math.pow(1 - p, 2.6);
  };

  let hallLayer: Frame | undefined;
  function hall(f: Frame) {
    if (!hallLayer) {
      hallLayer = new Frame(w, h);
      paintHall(hallLayer);
    }
    f.copyFrom(hallLayer);
  }

  function paintHall(f: Frame) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let c: RGB;
        if (y < 30) {
          // the vault, with arches every bay
          const bx = ((x % 64) + 64) % 64;
          const d = Math.abs(bx - 32);
          const archY = 30 - Math.sqrt(Math.max(0, 30 * 30 - d * d)) * 0.8;
          c = y > archY ? (y < archY + 2 ? C.arch : C.ceil) : C.ceilSh;
        } else if (y < 108) {
          const bx = ((x % 64) + 64) % 64;
          if (bx < 6) c = bx === 5 ? C.vein : C.marbleSh;
          else c = hash2(x >> 1, y >> 2, 3) > 0.94 ? C.vein : C.marble;
          if (y === 30 || y === 31) c = C.marbleSh;
        } else if (y < 112) c = C.plinth;
        else if (y < FLOOR) {
          c = C.bed;
          if (y >= TRACK - 1 && y <= TRACK)
            c = y === TRACK - 1 ? C.steelHi : C.steel;
          else if (y > TRACK && x % 9 < 4) c = C.sleeper;
          else if (y === 118) c = C.steel; // the far rail
        } else if (y < FLOOR + 2) c = C.edge;
        else if (y === FLOOR + 2) c = C.edgeSh;
        else {
          const t = ((x + (y - FLOOR) * 2) >> 4) + ((y - FLOOR) >> 3);
          c = t % 2 ? C.floor : C.floorSh;
          if ((x + 3 * y) % 16 === 0) c = C.floorHi;
        }
        f.set(x, y, c);
      }
    }
    // the tunnel mouth at the end of the hall
    for (let y = 56; y < FLOOR; y++) {
      const d = y < 72 ? Math.sqrt(Math.max(0, 1 - ((72 - y) / 16) ** 2)) : 1;
      const half = Math.round(17 * d);
      const cx = portal + 17;
      for (let x = cx - half - 3; x <= cx + half + 3; x++) {
        const inner = Math.abs(x - cx) <= half && y > 56 + (1 - d) * 16;
        f.set(x, y, inner ? C.dark : x < cx ? C.portalHi : C.portal);
      }
    }
    // lamps hanging in each bay
    for (let x = 32; x < w + 64; x += 64) {
      f.vline(x, 0, 16, C.plinth);
      f.hline(x - 4, x + 4, 17, C.bronze);
      for (const dx of [-4, 0, 4]) {
        f.rect(x + dx - 1, 18, 3, 3, C.globe);
        for (let r = 1; r <= 6; r++)
          f.blend(x + dx, 24 + r, C.glow, 0.25 - r * 0.03);
      }
    }
  }

  function train(f: Frame, nose: number, a: number) {
    const x0 = Math.round(nose);
    const right = w + 4;
    for (let x = Math.max(0, x0); x < right; x++) {
      const lx = x - x0; // along the train from its nose
      const ci = Math.floor(lx / (CAR + 4));
      const cx = lx - ci * (CAR + 4);
      if (cx >= CAR) {
        // the gap between two cars: the coupling
        f.rect(x, 112, 1, 3, C.wheel);
        continue;
      }
      // a rounded nose up front
      const nr = ci === 0 ? Math.max(0, 10 - cx) : 0;
      const top = TOP + Math.round(nr > 0 ? 10 - Math.sqrt(100 - nr * nr) : 0);
      for (let y = top; y <= 121; y++) {
        let c: RGB;
        if (y < TOP + 3) c = C.roof;
        else if (y < 78) c = C.bodyHi;
        else if (y < 98) c = C.band;
        else if (y < 116) c = y === 101 ? C.bodyHi : C.body;
        else c = C.skirt;
        // windows and doors
        const wi = (cx - 22) % 30;
        if (y >= 81 && y <= 95 && cx > 22 && cx < CAR - 10 && wi < 16)
          c = y < 83 || wi > 14 ? C.winSh : C.win;
        if ((cx - 37) % 60 < 2 && cx > 30 && y >= 78 && y < 116) c = C.door;
        if (ci === 0 && cx < 16) {
          // the cab: a dark windscreen, a light band under it
          if (y >= 80 && y <= 94 && cx > 1 && cx < 13)
            c = cx === 3 && y < 90 ? C.cabHi : C.cab;
        }
        if (y > 112 && y < 116 && cx > 2) c = C.bodySh;
        f.set(x, y, c);
      }
      // passengers' heads in the lit windows
      const wi = (cx - 22) % 30;
      if (
        cx > 22 &&
        cx < CAR - 10 &&
        hash2(Math.floor((cx - 22) / 30), ci, 4) > 0.4 &&
        (wi === 6 || wi === 7)
      )
        f.vline(x, 89, 95, C.rider);
    }
    // bogies
    for (let ci = 0; x0 + ci * (CAR + 4) < right; ci++) {
      for (const b of [24, CAR - 30]) {
        const bx = x0 + ci * (CAR + 4) + b;
        f.rect(bx - 6, 118, 20, 4, C.wheel);
        const spin = Math.floor(a / 40) % 2;
        for (const wx of [bx - 3, bx + 8]) {
          f.rect(wx - 2, 121, 6, 3, C.wheel);
          f.set(wx + spin, 122, C.steel);
        }
      }
    }
    // the headlights on its nose
    for (const ly of [104, 109]) f.rect(x0 - 1, ly, 2, 3, C.lamp);
  }

  /** A headlight's star: a hot core and long streaks of flare either side. */
  function flare(f: Frame, x: number, y: number, s: number) {
    if (s <= 0) return;
    const len = 30 + s * 110;
    for (let k = 1; k < len; k++) {
      const al = s * 0.95 * (1 - k / len) ** 1.5;
      f.blend(x - k, y, C.lamp, al);
      f.blend(x + k, y, C.lamp, al);
      if (k < len * 0.6) {
        f.blend(x - k, y - 1, C.beam, al * 0.4);
        f.blend(x + k, y + 1, C.beam, al * 0.4);
      }
    }
    for (let k = 1; k < 8 + s * 10; k++) {
      const al = s * 0.8 * (1 - k / (8 + s * 10));
      f.blend(x, y - k, C.lamp, al);
      f.blend(x, y + k, C.lamp, al);
    }
    for (let r = 2; r <= 3 + s * 8; r++)
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++)
          if (dx * dx + dy * dy <= r * r)
            f.blend(x + dx, y + dy, C.beam, s * 0.07);
  }

  /** Light thrown ahead of the train: the beam down the track. */
  function beam(f: Frame, nose: number, strength: number) {
    const x0 = Math.round(nose);
    for (let x = Math.max(0, x0 - 170); x < Math.min(w, x0); x++) {
      const d = (x0 - x) / 170;
      const half = 5 + d * 34;
      const al = strength * (1 - d) * 0.85;
      for (
        let y = Math.round(107 - half);
        y <= Math.min(h - 1, 107 + half);
        y++
      )
        f.blend(x, y, C.beam, al * (1 - Math.abs(y - 107) / (half + 1)));
    }
  }

  function drawPlatform(f: Frame, a: number) {
    hall(f);
    const nose = noseAt(a);
    // the headlights coming up the tunnel before the train itself
    if (a < METRO.burst) {
      const p = smooth((a - (METRO.burst - 1000)) / 1000);
      if (p > 0) {
        const cx = portal + 17;
        for (let r = 24; r >= 2; r -= 2)
          for (let dy = -r; dy <= r; dy++)
            for (let dx = -r; dx <= r; dx++)
              if (dx * dx + dy * dy <= r * r)
                f.blend(cx + dx, 107 + dy * 0.8, C.beam, p * 0.065);
        // the rails catch it
        for (let x = portal - 90; x < portal + 4; x++)
          f.blend(x, TRACK - 1, C.lamp, p * (1 - (portal - x) / 90));
        const lx = cx + Math.round((1 - p) * 8);
        flare(f, lx, 105, p * 0.8);
        flare(f, lx, 110, p * 0.8);
      }
    }
    if (nose < w + 6) {
      train(f, nose, a);
      const glare = 1 - smooth((a - METRO.burst) / 1400);
      beam(f, nose, 0.5 + 0.5 * glare);
      flare(f, Math.round(nose) - 1, 105, 0.35 + 0.65 * glare);
      flare(f, Math.round(nose) - 1, 110, 0.35 + 0.65 * glare);
    }
    // the gust: streaks of air, and a few bits of paper tumbling past
    const g = a - (METRO.burst - 250);
    const gust = g > 0 && g < 1700;
    if (gust) {
      for (let i = 0; i < 18; i++) {
        const st = hash2(i, 1, 77) * 900;
        const age = g - st;
        if (age < 0 || age > 900) continue;
        const sx = w + 10 - age * (0.45 + hash2(i, 2, 77) * 0.3);
        const sy = 36 + Math.round(hash2(i, 3, 77) * 104);
        const len = 10 + hash2(i, 4, 77) * 26;
        const al = 0.6 * Math.sin((age / 900) * Math.PI);
        for (let k = 0; k < len; k++)
          f.blend(sx + k, sy, C.wind, al * (1 - k / len));
      }
      for (let i = 0; i < 4; i++) {
        const age = g - 150 - i * 160;
        if (age < 0) continue;
        const px = w + 4 - age * (0.32 + i * 0.05);
        const py = 120 + i * 6 - Math.sin(age / 140 + i) * 7 - age * 0.012;
        const flip = Math.floor(age / 90 + i) % 2;
        f.rect(px, py, flip ? 3 : 2, flip ? 2 : 3, C.paper);
        f.set(px + (flip ? 2 : 1), py + 1, C.paperSh);
      }
    }
    // the lad, watching it come
    const hair = gust ? 1 + (Math.floor(a / 80) % 3) : a > METRO.stop ? 3 : 0;
    for (let k = 0; k < 12; k++) f.blend(ladX + k, 146, C.floorSh, 0.5);
    lad(f, ladX, 146 - STAND.length, STAND, hair === 3 ? 3 : hair);
    // the moment the nose bursts out: a flash of headlight over everything
    const fl = a - METRO.burst;
    if (fl > 0 && fl < 600) {
      const al = 0.65 * (1 - fl / 600) ** 2;
      const br = C.beam >>> 16;
      const bg = (C.beam >>> 8) & 0xff;
      const bb = C.beam & 0xff;
      const px = f.pixels;
      for (let i = 0; i < px.length; i++) {
        const p = px[i]!;
        const pr = p & 0xff;
        const pg = (p >>> 8) & 0xff;
        const pb = (p >>> 16) & 0xff;
        px[i] =
          (0xff000000 |
            ((pb + (bb - pb) * al) << 16) |
            ((pg + (bg - pg) * al) << 8) |
            (pr + (br - pr) * al)) >>>
          0;
      }
    }
  }

  return {
    /**
     * The underground at `a` ms into the egg: the top of the escalator
     * before the ride, the ride, the platform after it.
     */
    draw(f: Frame, a: number, scratch: Frame) {
      const m = (a - METRO.ride) / METRO.mix;
      if (m <= 0) {
        drawRide(f, a);
        return;
      }
      if (m >= 1) {
        drawPlatform(f, a);
        return;
      }
      drawRide(f, a);
      drawPlatform(scratch, a);
      const px = f.pixels;
      const sp = scratch.pixels;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++)
          if (bayer8(x, y) < m) px[y * w + x] = sp[y * w + x]!;
    },
  };
}
