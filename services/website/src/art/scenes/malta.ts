// Valletta from Sliema on a warm afternoon, across Marsamxett harbour: the
// honey-coloured bastions rise straight out of the water, the houses with
// their painted wooden balconies (gallarija) climb the hill behind, and the
// Carmelite dome and the spire of St Paul's stand over everything. Luzzus
// with the eye on the bow bob in the harbour, a dghajsa is rowed across,
// the ferry comes and goes, an old bus trundles along the quay. In front of
// us runs the Sliema promenade, its railings and the flat rocks at its end,
// where a slim woman with long black hair strolls by the sea.
//
// Click the sky for festa fireworks, the dome or the spire to ring the bells,
// a luzzu to rock it, the water to make a splash.
//
// Three easter eggs:
// - promenade: tap the woman on the promenade. A man walks up and waves,
//   picture bubbles go back and forth, then they sit on the rocks in the
//   golden light with a bottle and two glasses, clink, and hearts float up
//   over the harbour.
// - balcony: tap the gallarija lit by a monitor's glow. It opens into a
//   close-up of someone coding at a desk: code scrolls, a big green tick,
//   arms up, confetti out of the window over the street.
// - luzzu-wink: the eye on the big luzzu winks back, and the boat takes two
//   people on a trip round the harbour, waving, a little BBQ going on deck,
//   then comes back to its mooring.

import { Frame, lerpRGB, type RGB } from '../frame';
import { flock, Fx, ripple, splash } from '../fx';
import { hash2, noise1 } from '../noise';
import { clouds, gradient } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';
import {
  bubble,
  DESK_MAN,
  heart,
  HER,
  HER_SIT,
  HER_STEP,
  MAN,
  MAN_BOAT,
  MAN_SIT,
  MAN_STEP,
  PIC_POINT,
  PIC_SMILE,
  PIC_SUN,
  PIC_THUMB,
  PIC_WAVE,
  PIC_WINE,
  FRIEND_BOAT,
  type Sprite,
  spr,
  tintPal,
} from '../things/malta-people';

const P = palette({
  sky0: '#3a76cb',
  sky1: '#548fd6',
  sky2: '#79a8de',
  sky3: '#a6c1df',
  sky4: '#d3d1d0',
  sky5: '#f0dbc0',
  sky6: '#ffe6bd',
  sunGlow: '#fff1cc',
  cloudLight: '#fff5de',
  cloudBase: '#f6dcc8',
  cloudShadow: '#cab1c6',
  haze: '#f2dcc2',
  farLit: '#ead2b4',
  farMid: '#dcc0a4',
  farShade: '#c9ad9c',
  // limestone, warm light to cool shade
  st0: '#fff0c4',
  st1: '#f8d699',
  st2: '#eec282',
  st3: '#dfaa6e',
  st4: '#c38e64',
  st5: '#9a6650',
  st6: '#66414a',
  stA: '#f4cc8c',
  stB: '#fbe0ad',
  stC: '#e8b679',
  win: '#5b3a40',
  winHi: '#fff1c8',
  shut: '#3b7650',
  shutHi: '#5a9e6c',
  galG: '#2c774a',
  galGHi: '#47a068',
  galB: '#2c5da6',
  galBHi: '#4c86cc',
  galR: '#b0332b',
  galRHi: '#d65340',
  galN: '#774024',
  galNHi: '#9d5d36',
  galY: '#d79f28',
  galYHi: '#f2c24a',
  glass: '#d4e7ef',
  glassSh: '#93b3c6',
  domeHi: '#f2e8d6',
  domeLit: '#e2d6c2',
  domeMid: '#c9bcab',
  domeShade: '#9e96a2',
  domeDark: '#77707f',
  tree0: '#2c5532',
  tree1: '#43763a',
  tree2: '#6c9c48',
  // harbour
  water0: '#4383bb',
  water1: '#3270ad',
  water2: '#275e9b',
  water3: '#1d4d86',
  water4: '#163f72',
  waterTint: '#1d4f88',
  glint: '#ffe8ad',
  gold: '#b67a34',
  foam: '#eaf4ff',
  algae: '#6d7c50',
  wet: '#8a6450',
  // boats
  luzBlue: '#2563b9',
  luzBlueDk: '#1a478c',
  luzYel: '#f5c431',
  luzYelDk: '#c8961f',
  luzRed: '#d63c2f',
  luzRedDk: '#9c2a24',
  luzGrn: '#2f8f4f',
  luzGrnDk: '#1f6838',
  luzWht: '#f7f3e8',
  luzWhtDk: '#c9c4bb',
  eye: '#191b24',
  net: '#e2662e',
  rope: '#d8c49a',
  yacht: '#fbfbf7',
  yachtSh: '#c3cad3',
  mast: '#e9ecef',
  ferry: '#f6f6f2',
  ferrySh: '#bfc6cf',
  ferryBand: '#1f6fa8',
  ferryWin: '#2b3a4f',
  bus: '#f2b21c',
  busSh: '#c98a12',
  busStripe: '#d24a29',
  busWin: '#3b3c4c',
  person: '#3b2b2e',
  shirtA: '#f6f2e6',
  shirtB: '#d84a3a',
  shirtC: '#3a6cc0',
  skin: '#c98a5e',
  gull: '#ffffff',
  gullWing: '#9aa7b8',
  pigeon: '#6e6a78',
  bell: '#ffe48a',
  smoke: '#efe9e4',
  smokeSh: '#c7bfc4',
  fwWhite: '#fffbe8',
  fwYel: '#ffd93a',
  fwRed: '#ff3b3b',
  fwPink: '#ff4fa8',
  fwPurple: '#8a46ff',
  fwCyan: '#38e8ff',
  fwBlue: '#2f7bff',
  fwGreen: '#6dff5a',
  fwGreenDk: '#1fa84a',
  // the Sliema seafront: painted railings, paving, the flat rocks
  rail: '#f4efe4',
  railSh: '#a9a39c',
  pave: '#e3cfa8',
  paveLit: '#f4e4c2',
  paveJoint: '#c4ad88',
  paveSh: '#b69c78',
  rock0: '#fdeac0',
  rock1: '#efcd96',
  rock2: '#dcb07a',
  rock3: '#b98a5c',
  rock4: '#8a6048',
  // the man: short light-brown hair, a short beard, fair skin, a black tee
  mHair: '#a8743f',
  mHairHi: '#d2a466',
  mBeard: '#86592f',
  mSkin: '#f2c4a2',
  mSkinSh: '#cf9878',
  mTee: '#26252c',
  mTeeHi: '#4a4852',
  mJeans: '#2c4a86',
  mJeansHi: '#5a7ac0',
  mShoe: '#d8d4dc',
  // the woman: slim, long straight near-black hair, a taupe top, a black skirt
  wHair: '#18151b',
  wHairLit: '#4a4352',
  wSkin: '#f3cdb0',
  wSkinSh: '#d6a88a',
  top: '#b8a08a',
  topSh: '#8e7866',
  skirt: '#2a272f',
  skirtSh: '#141216',
  sandal: '#5a4a40',
  // the friend on the luzzu: dark hair, a straw hat
  hat: '#f0d080',
  hatSh: '#c8a050',
  hatBand: '#d63c2f',
  fHair: '#2e2226',
  fTop: '#2bb3a8',
  fTopSh: '#1d7f78',
  // talking in pictures
  bubble: '#fffaf0',
  ink: '#4a3a3e',
  picYel: '#ffd84a',
  picYelDk: '#e0a020',
  picGlass: '#7d93a8',
  wine: '#c0283a',
  wineDk: '#8a1a2a',
  motion: '#7aa8d8',
  bottle: '#1f5a3a',
  bottleHi: '#4f9a6a',
  heart: '#ff4a6a',
  heartHi: '#ffb6c4',
  heartEdge: '#b82848',
  golden: '#ffb35a',
  // the desk close-up
  monGlow: '#9ff0ff',
  monGlow2: '#5fb8ff',
  roomWall: '#f2dfba',
  roomWallSh: '#dcc196',
  floor: '#9a6a46',
  desk: '#a8703f',
  deskHi: '#cf9a5e',
  deskSh: '#6e4429',
  bezel: '#26262e',
  screen: '#162038',
  codeA: '#c792ea',
  codeB: '#82aaff',
  codeC: '#c3e88d',
  codeD: '#f78c6c',
  codeE: '#c8d0dc',
  keys: '#d8dce4',
  keysSh: '#9aa0ac',
  tick: '#3ddc6a',
  tickHi: '#b4ffc4',
  tickEdge: '#137a38',
  chair: '#30303a',
  chairHi: '#55555f',
  plant: '#3f9a4a',
  plantDk: '#256a32',
  pot: '#c0603c',
  // the BBQ on deck
  grill: '#2f2f36',
  grillHi: '#5a5a64',
  coal: '#ff7a2a',
  coalHi: '#ffd060',
  bbq: '#b9b2b8',
  bbqSh: '#8c8590',
});

// the sky at golden hour (blended in while the light turns)
const SUNSET = [
  '#3d4a96',
  '#5d5fae',
  '#9a78b0',
  '#d98f9c',
  '#f4ab84',
  '#ffcf8c',
].map((c) => parseInt(c.slice(1), 16));

const PARAPET = 80; // top of the bastion walls
const CORDON = 85;
const QUAY = 109; // the quay along the foot of the walls
const WATER = 114;
// the Sliema promenade along the bottom of the picture
const RAIL = 138; // the top rail
const PAVE = 143; // the paving starts
const FEET = 147; // where people on the promenade stand
const SHELF = 142; // the flat rock they sit on

// the easter eggs' running times (ms)
const MEET_FOR = 7800; // promenade
const BALCONY_FOR = 6000; // balcony
const LUZ_GO = 1000; // luzzu-wink: the wink, then it sets off...
const LUZ_TRIP = 6000; // ...goes round the harbour...
const LUZ_FOR = LUZ_GO + LUZ_TRIP + 500; // ...and they duck back down

const MAN_PAL: Record<string, RGB> = {
  H: P.mHair,
  h: P.mHairHi,
  b: P.mBeard,
  s: P.mSkin,
  S: P.mSkinSh,
  T: P.mTee,
  t: P.mTeeHi,
  J: P.mJeans,
  j: P.mJeansHi,
  e: P.mShoe,
  c: P.chair,
  C: P.chairHi,
  k: P.bezel,
};
const HER_PAL: Record<string, RGB> = {
  H: P.wHair,
  h: P.wHairLit,
  s: P.wSkin,
  S: P.wSkinSh,
  D: P.top,
  d: P.topSh,
  K: P.skirt,
  k: P.skirtSh,
  e: P.sandal,
};
const FRIEND_PAL: Record<string, RGB> = {
  Y: P.hat,
  y: P.hatSh,
  r: P.hatBand,
  H: P.fHair,
  s: P.mSkin,
  C: P.fTop,
  c: P.fTopSh,
  B: P.luzWht,
};
const picPal = (sleeve: RGB): Record<string, RGB> => ({
  s: P.mSkin,
  S: P.mSkinSh,
  Y: P.picYelDk,
  y: P.picYel,
  k: P.ink,
  o: P.picYelDk,
  g: P.picGlass,
  r: P.wine,
  R: P.wineDk,
  m: P.motion,
  b: sleeve,
});

/** An arm: a line from the shoulder to the hand, a sleeve at the top. */
function arm(
  f: Frame,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  skin: RGB,
  sleeve: RGB | null
) {
  f.line(x0, y0, x1, y1, skin);
  if (sleeve !== null) f.set(x0, y0, sleeve);
}

/**
 * Who's aboard the big luzzu for the boat trip: `pop` 0..1 as they come up
 * from below the gunwale, `t` for the waving.
 */
type Crew = { pop: number; t: number };

type Gal = { c: RGB; hi: RGB };
const GALS: Gal[] = [
  { c: P.galG, hi: P.galGHi },
  { c: P.galB, hi: P.galBHi },
  { c: P.galR, hi: P.galRHi },
  { c: P.galG, hi: P.galGHi },
  { c: P.galN, hi: P.galNHi },
  { c: P.galY, hi: P.galYHi },
];
const FACADES = [P.st1, P.st2, P.stA, P.stB, P.stC, P.st1];

type Scheme = {
  top: RGB;
  topDk: RGB;
  main: RGB;
  mainDk: RGB;
  trim: RGB;
  post: RGB[];
};
const SCHEMES: Scheme[] = [
  {
    top: P.luzYel,
    topDk: P.luzYelDk,
    main: P.luzBlue,
    mainDk: P.luzBlueDk,
    trim: P.luzRed,
    post: [P.luzRed, P.luzYel, P.luzBlue, P.luzGrn],
  },
  {
    top: P.luzRed,
    topDk: P.luzRedDk,
    main: P.luzGrn,
    mainDk: P.luzGrnDk,
    trim: P.luzYel,
    post: [P.luzYel, P.luzRed, P.luzGrn, P.luzBlue],
  },
  {
    top: P.luzYel,
    topDk: P.luzYelDk,
    main: P.luzGrn,
    mainDk: P.luzGrnDk,
    trim: P.luzBlue,
    post: [P.luzBlue, P.luzYel, P.luzRed],
  },
];

type Boat = {
  x: number;
  y: number;
  L: number;
  scheme: Scheme;
  seed: number;
  flip: boolean;
};

/**
 * A luzzu, side on: a sheer that sweeps up to a tall stem post, bands of
 * paint, the eye on the bow. (x, y) is the stern end at the waterline.
 */
function hull(b: Boat, tilt: number) {
  const { L } = b;
  const x0 = Math.round(b.x);
  const y0 = Math.round(b.y);
  const H = Math.max(4, Math.round(L * 0.13)); // freeboard amidships
  const tb = Math.max(1, Math.round(H * 0.3)); // the top band of colour
  const dir = b.flip ? -1 : 1;
  const X = (u: number) =>
    b.flip
      ? x0 + L - 1 - Math.round(u * (L - 1))
      : x0 + Math.round(u * (L - 1));
  const lift = (u: number) => Math.round((u - 0.5) * L * tilt);
  const sheer = (u: number) => {
    const bow = u > 0.55 ? ((u - 0.55) / 0.45) ** 2.2 * L * 0.12 : 0;
    const stern = u < 0.3 ? ((0.3 - u) / 0.3) ** 2 * L * 0.06 : 0;
    return y0 - H - Math.round(bow + stern);
  };
  const keel = (u: number) => {
    if (u < 0.07) return y0 - Math.round(((0.07 - u) / 0.07) * H * 0.8);
    if (u > 0.84)
      return y0 - Math.round(((u - 0.84) / 0.16) ** 1.6 * (y0 - sheer(1) - 1));
    return y0;
  };
  const at = (u: number) => [X(u), sheer(u) + lift(u)] as const;
  // the Eye of Osiris on the bow
  const [ex, eTop] = at(0.86);
  const eye = [ex, eTop + tb + 3] as const;
  return { L, y0, H, tb, dir, X, lift, sheer, keel, at, eye };
}

/**
 * How the eye looks, `age` ms after it was clicked: it glances back at you,
 * winks, and looks ahead again.
 */
const EYE_FOR = 1400;
function eyeLook(age: number) {
  if (age < 0 || age >= EYE_FOR) return 'ahead';
  if (age < 450) return 'back';
  if (age < 950) return 'wink';
  return age < 1150 ? 'back' : 'ahead';
}

function luzzu(
  f: Frame,
  b: Boat,
  t: number,
  tilt: number,
  eyeAge: number,
  crew: Crew | null = null
) {
  const { scheme: S } = b;
  const { L, y0, tb, dir, X, lift, sheer, keel, at, eye } = hull(b, tilt);
  if (crew && L >= 40) {
    // a boat trip: a little BBQ on deck, two people aboard waving
    const sink = Math.round((1 - crew.pop) * 11);
    const [gx, gy] = at(0.56);
    const gTop = gy - 4 + sink;
    const clip = gy + 1;
    for (let k = 0; k < 4; k++) {
      if (gTop + k > clip) break;
      f.hline(gx - 2, gx + 2, gTop + k, k === 0 ? P.grillHi : P.grill);
    }
    if (gTop - 1 <= clip)
      for (let k = -1; k <= 1; k++)
        f.set(
          gx + k,
          gTop - 1,
          Math.sin(crew.t / 90 + k * 2) > 0 ? P.coalHi : P.coal
        );
    const wig = Math.floor(crew.t / 150) % 2;
    const [mx, my] = at(0.68);
    const mY = my - 7 + sink;
    spr(f, MAN_BOAT, mx - 2, mY, MAN_PAL, false, 1, my + 1);
    if (mY + 4 <= my) {
      // both arms up, waving
      arm(f, mx + 2, mY + 4, mx + 4 + wig, mY - 1, P.mSkin, P.mTee);
      arm(f, mx - 2, mY + 4, mx - 3 - (1 - wig), mY - 1, P.mSkin, P.mTee);
    }
    const [sx, sy] = at(0.8);
    const sY = sy - 8 + sink;
    spr(f, FRIEND_BOAT, sx - 3, sY, FRIEND_PAL, false, 1, sy + 1);
    if (sY + 6 <= sy)
      arm(f, sx + 2, sY + 6, sx + 4 - wig, sY + 1, P.mSkin, null);
  }
  // what's on board: an awning, crates, nets and the fisherman
  if (L >= 40) {
    const [ax0, ay0] = at(0.18);
    const [ax1] = at(0.5);
    const awn = ay0 - Math.round(L * 0.1);
    for (const u of [0.2, 0.48]) {
      const [px, py] = at(u);
      f.vline(px, awn, py, P.st5);
    }
    f.hline(Math.min(ax0, ax1), Math.max(ax0, ax1), awn, S.main);
    f.hline(Math.min(ax0, ax1) + 1, Math.max(ax0, ax1) - 1, awn - 1, S.main);
    f.hline(Math.min(ax0, ax1), Math.max(ax0, ax1), awn + 1, S.mainDk);
    const [cx0, cy0] = at(0.3);
    f.rect(cx0 - 2, cy0 - 2, 4, 2, P.luzRed);
    f.rect(cx0 + 2 * dir, cy0 - 3, 3, 3, P.luzBlue);
    const [nx, ny] = at(0.7);
    if (!crew)
      for (let k = -3; k <= 3; k++)
        f.set(nx + k, ny - 1 - (Math.abs(k) < 2 ? 1 : 0), P.net);
    // the fisherman: bent over the nets, straightening up now and then; on
    // a trip he stands at the stern and steers
    const [mx, my] = at(crew ? 0.1 : 0.6);
    const tall = Math.max(5, Math.round(L * 0.09));
    const lean = !crew && Math.sin(t / 2600 + b.seed) > 0.3 ? 1 : 0;
    for (let k = 1; k <= tall; k++)
      f.set(
        mx + (k > tall * 0.5 ? lean * dir : 0),
        my - k,
        k > tall * 0.45 ? P.shirtC : P.person
      );
    f.set(mx + lean * dir, my - tall - 1, P.skin);
    f.set(mx + lean * dir, my - tall - 2, P.person);
    f.set(mx + (lean + 1) * dir, my - tall + 2, P.skin);
  } else {
    const [mx, my] = at(0.55);
    f.vline(mx, my - 4, my - 1, P.person);
    f.set(mx, my - 5, P.skin);
  }
  for (let i = 0; i < L; i++) {
    const u = i / (L - 1);
    const x = X(u);
    const l = lift(u);
    const top = sheer(u) + l;
    const bot = keel(u) + l;
    for (let y = top; y <= bot; y++) {
      const d = y - top;
      let c: RGB =
        d === 0 ? S.trim : d <= tb ? S.top : d === tb + 1 ? P.luzWht : S.main;
      if (y >= y0 + l - 1 && d > tb + 1) c = S.mainDk; // the curve of the bilge
      if (u > 0.93 && d > 0)
        c = c === S.top ? S.topDk : c === S.main ? S.mainDk : c; // the bow turns away
      f.set(x, y, c);
    }
  }
  // stem post at the bow, a shorter one at the stern, painted in bands
  const postH = Math.max(4, Math.round(L * 0.14));
  const [bx, by] = at(1);
  for (let k = 0; k < postH; k++)
    f.set(
      bx + (k > postH * 0.7 ? dir : 0),
      by - k,
      S.post[Math.floor(k / 2) % S.post.length]!
    );
  const [sx, sy] = at(0.01);
  for (let k = 0; k < Math.round(postH * 0.55); k++)
    f.set(sx, sy - k, S.post[(Math.floor(k / 2) + 1) % S.post.length]!);
  // the Eye of Osiris, keeping watch over the bow
  const [ex, ey] = eye;
  const look = eyeLook(eyeAge);
  if (L >= 40) {
    f.hline(ex - 2, ex + 2, ey - 2, P.eye);
    if (look === 'wink') {
      f.hline(ex - 2, ex + 2, ey, P.eye);
      f.set(ex - 3, ey - 1, P.eye);
    } else {
      // the pupil looks ahead over the bow, or back at us
      const p = look === 'back' ? -dir : dir;
      f.hline(ex - 1, ex + 1, ey - 1, P.luzWht);
      f.hline(ex - 2, ex + 2, ey, P.luzWht);
      f.hline(ex - 1, ex + 1, ey + 1, P.luzWht);
      f.set(ex, ey, P.eye);
      f.set(ex + p, ey, P.eye);
      f.set(ex, ey - 1, P.eye);
    }
  } else {
    f.hline(ex - 1, ex + 1, ey - 1, look === 'wink' ? P.eye : P.luzWht);
    if (look !== 'wink')
      f.set(ex + (look === 'back' ? -dir : dir), ey - 1, P.eye);
  }
  // a lick of foam where it sits in the water
  for (let i = 5; i < L - 5; i += 7)
    if (Math.sin(t / 400 + i * 1.7) > 0.85)
      f.set(X(i / (L - 1)), y0 + lift(i / (L - 1)) + 1, P.foam);
}

/** Colour ramp lookup, 0..1. */
function ramp(colors: RGB[], v: number) {
  const n = colors.length - 1;
  const p = Math.min(0.999, Math.max(0, v)) * n;
  const i = Math.floor(p);
  return lerpRGB(colors[i]!, colors[i + 1] ?? colors[i]!, p - i);
}

/**
 * A daytime festa shell: it climbs from behind the roofs and bursts into
 * streaking stars that burn out into smoke. Chunkier than a night firework
 * so it still reads against a blue sky.
 */
function festaShell(
  fx: Fx,
  t: number,
  x: number,
  ground: number,
  y: number,
  colors: RGB[],
  seed: number
) {
  const rise = Math.min(900, Math.max(350, (ground - y) * 9));
  const n = 26 + Math.floor(hash2(seed, 1, 3) * 10);
  const speed = 30 + hash2(seed, 2, 3) * 12;
  const life = 1900;
  const drag = 1.8;
  fx.add(t, rise + life, (f, age) => {
    if (age < rise) {
      const p = age / rise;
      const sy = ground + (y - ground) * (1 - (1 - p) * (1 - p));
      for (let k = 0; k < 4; k++)
        f.set(x + Math.sin(p * 8 + seed) * 0.5, sy + k, ramp(colors, k / 6));
      return;
    }
    const a = (age - rise) / 1000;
    const fade = (age - rise) / life;
    if (a < 0.12) {
      const r = 2 + a * 45;
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const d = Math.hypot(dx, dy) / r;
          if (d < 1)
            f.blend(x + dx, y + dy, colors[0]!, (1 - d) * 0.7 * (1 - a / 0.12));
        }
    }
    for (let i = 0; i < n; i++) {
      if (
        fade > 0.55 &&
        hash2(i, Math.floor(age / 80), seed) < (fade - 0.55) * 2.2
      )
        continue;
      const ang = (i / n) * Math.PI * 2 + hash2(i, 4, seed) * 0.25;
      const sp = speed * (0.8 + hash2(i, 5, seed) * 0.35);
      const vx = Math.cos(ang) * sp;
      const vy = Math.sin(ang) * sp;
      const k1 = (dt: number) => (1 - Math.exp(-drag * dt)) / drag;
      for (let k = 0; k < 4; k++) {
        const dt = a - k * 0.05;
        if (dt < 0) break;
        f.set(
          x + vx * k1(dt),
          y + vy * k1(dt) + 11 * dt * dt,
          ramp(colors, Math.min(1, fade * 1.1 + k * 0.18))
        );
      }
    }
  });
}

export const malta: Scene = {
  id: 'malta',
  name: 'Malta',
  country: '',
  create(w, h) {
    const cx = Math.round(w / 2);
    const domeX = Math.round(cx + Math.min(24, w * 0.04));
    const spireX = Math.round(domeX - Math.min(34, Math.max(22, w * 0.075)));
    const fx = new Fx();
    const fxBack = new Fx(); // fireworks: behind the city

    // the hill: highest in the middle, falling away towards both ends
    const ridge = (x: number) => {
      const u = (x - cx) / (w / 2);
      return u < 0 ? 9 * u * u : 6 * u * u;
    };

    // ---------- the Sliema seafront ----------
    // the promenade runs from the left edge to the flat rocks at the right
    const R = Math.round(Math.min(56, Math.max(36, w * 0.12)));
    const rx0 = w - R;
    const rockTop = (x: number) => {
      const u = (x - rx0) / R;
      const y =
        u < 0.1
          ? 145 - u * 30
          : u < 0.66
            ? SHELF
            : SHELF - ((u - 0.66) / 0.34) ** 1.4 * 5;
      return Math.round(y);
    };
    /** Where someone standing at x has their feet. */
    const ground = (x: number) =>
      x < rx0 + 1
        ? FEET
        : Math.round(
            FEET + Math.min(1, (x - rx0) / 6) * (rockTop(x) + 2 - FEET)
          );
    // she strolls up and down the end of the promenade, stopping to look
    // out at the harbour
    const herMin = rx0 - 34;
    const herMax = rx0 - 12;
    const HER_V = 0.0065; // px/ms
    const HER_REST = 1800;
    const herWalk = (herMax - herMin) / HER_V;
    const herPeriod = 2 * (herWalk + HER_REST);
    function stroll(t: number) {
      const p = (((t + 2500) % herPeriod) + herPeriod) % herPeriod;
      if (p < HER_REST)
        return { x: herMin, dir: p < HER_REST / 2 ? -1 : 1, step: 0 };
      const q = p - HER_REST;
      const step = Math.floor(t / 280) % 2;
      if (q < herWalk) return { x: herMin + q * HER_V, dir: 1, step };
      const r = q - herWalk;
      if (r < HER_REST)
        return { x: herMax, dir: r < HER_REST / 2 ? 1 : -1, step: 0 };
      return { x: herMax - (r - HER_REST) * HER_V, dir: -1, step };
    }
    const herSpot = (t: number) => ({
      x: Math.round(stroll(t).x) + 3,
      y: FEET - 8,
    });
    const HER_R = 8;

    // ---------- balcony: a gallarija lit by a monitor ----------
    const jx = Math.round(cx - w * 0.15);
    const jy = 69; // the balcony's little roof
    const BALCONY_R = 7;
    const insetW = Math.round(Math.min(216, Math.max(70, w * 0.36)));
    const jk = insetW >= 140 ? 2 : 1; // the close-up's pixel size
    const roomW = Math.floor(insetW / jk);
    const roomH = jk === 2 ? 50 : 48;
    const insetH = roomH * jk;
    const insetX = Math.round(
      Math.max(2, Math.min(w - insetW - 2, jx - insetW / 2))
    );
    const insetY = Math.round(
      Math.max(2, Math.min(h - insetH - 2, jy + 2 - insetH / 2))
    );
    const room = new Frame(roomW, roomH);

    // ---------- the walls ----------
    const s1 = Math.round(cx - Math.min(160, Math.max(50, w * 0.28)));
    const s2 = Math.round(cx + Math.min(120, Math.max(38, w * 0.2)));
    const FW = Math.round(Math.min(42, Math.max(18, w * 0.09)));
    const gardjolas: number[] = [s1, s2];
    type Face = 'shade' | 'lit' | 'front' | 'flankL' | 'flankR';
    function faceAt(x: number): Face {
      for (const s of [s1, s2]) {
        if (x >= s - FW - 4 && x < s - FW) return 'flankL';
        if (x >= s - FW && x < s) return 'shade';
        if (x >= s && x < s + FW) return 'lit';
        if (x >= s + FW && x < s + FW + 3) return 'flankR';
      }
      return 'front';
    }
    /** Highlight, body and shadow tones for each face of the walls. */
    const faceColors = (face: Face): [RGB, RGB, RGB] =>
      face === 'lit' || face === 'flankR'
        ? [P.st0, P.st1, P.st2]
        : face === 'shade'
          ? [P.st2, P.st4, P.st5]
          : face === 'flankL'
            ? [P.st3, P.st5, P.st6]
            : [P.st0, P.st2, P.st3];
    // the bastions stand a little taller than the curtain walls between them
    const wallTop = (x: number) =>
      faceAt(x) === 'front' ? PARAPET + 1 : PARAPET - 2;

    const sky = layer(w, h, (f) => {
      gradient(f, 0, WATER, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
      ]);
    });
    const cloudLayer = layer(w, h, (f) => {
      clouds(f, {
        seed: 72,
        y0: 10,
        y1: 30,
        cell: 7,
        coverage: 0.3,
        stretch: 4.5,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });

    const pigeons: [number, number][] = [];
    const city = layer(w, h, (f) => {
      // far off beyond City Gate: Floriana's rooftops and its big church,
      // soft in the haze, peeking over the right-hand end of the town
      const fx0 = Math.round(cx + Math.min(90, w * 0.2));
      for (let x = fx0; x < w; x++) {
        const k = Math.min(1, (x - fx0) / 30);
        const top = Math.round(
          54 -
            k * 7 -
            noise1(x / 5, 21) * 3 -
            (hash2(x >> 2, 0, 22) > 0.75 ? 2 : 0)
        );
        f.vline(x, top, 80, (x >> 2) % 3 === 0 ? P.farMid : P.farLit);
        f.set(x, top, P.farLit);
        if ((x >> 1) % 4 === 0) f.vline(x, top + 3, top + 4, P.farShade);
      }
      const fdx = Math.round(w - Math.min(54, w * 0.13));
      f.rect(fdx - 5, 41, 11, 9, P.farMid);
      f.vline(fdx - 5, 41, 49, P.farShade);
      f.disc(fdx, 40, 5, (dx, dy) =>
        dy > 0 ? null : dx > 1 ? P.farLit : dx < -2 ? P.farShade : P.farMid
      );
      f.vline(fdx, 33, 35, P.farShade);
      for (const bx of [fdx - 10, fdx + 9]) {
        f.rect(bx - 1, 38, 3, 10, P.farMid);
        f.set(bx, 37, P.farShade);
      }

      // rows of houses stepping down the hill, back to front
      const tiers = [
        { top: 50, haze: 0.32, seed: 1 },
        { top: 57, haze: 0.16, seed: 2 },
        { top: 64, haze: 0.06, seed: 3 },
        { top: 71, haze: 0, seed: 4 },
      ];
      for (const [ti, tier] of tiers.entries()) {
        if (ti === 1) landmarks(f);
        let x = -6 + Math.round(hash2(ti, 9, 3) * 6);
        let i = 0;
        while (x < w + 6) {
          const r = (k: number) => hash2(i, k, tier.seed * 31);
          const bw = 7 + Math.round(r(1) * 9);
          // a street running down to the harbour now and then
          if (ti > 0 && r(7) > 0.86) {
            street(f, x, tier.top + Math.round(ridge(x)) - 2, 3);
            x += 3;
          }
          const top =
            tier.top + Math.round(ridge(x + bw / 2)) - Math.round(r(2) * 6);
          house(
            f,
            x,
            top,
            bw,
            PARAPET + 2,
            FACADES[Math.floor(r(3) * FACADES.length)]!,
            tier.haze,
            i * 7 + tier.seed * 101,
            ti
          );
          x += bw;
          i++;
        }
      }
      balconyHouse(f);
      bastions(f);
    });

    // the water's mirror of the walls, warmed and tinted row by row
    const waterBase = (d: number) =>
      d < 5
        ? P.water0
        : d < 12
          ? P.water1
          : d < 21
            ? P.water2
            : d < 30
              ? P.water3
              : P.water4;
    const mirror = new Int32Array((h - WATER) * w);
    {
      const still = new Frame(w, h);
      still.copyFrom(sky);
      still.over(city);
      for (let d = 0; d < h - WATER; d++) {
        const sy = Math.max(0, WATER - 1 - Math.floor(d * 1.25));
        const mix = 0.2 + d * 0.013;
        for (let x = 0; x < w; x++)
          mirror[d * w + x] = lerpRGB(
            lerpRGB(still.get(x, sy), P.gold, 0.22),
            waterBase(d),
            mix
          );
      }
    }

    /** Mixes a colour into the warm haze for things further away. */
    function hz(c: RGB, a: number) {
      return a > 0 ? lerpRGB(c, P.haze, a) : c;
    }

    function street(f: Frame, x: number, top: number, sw: number) {
      for (let y = top; y < PARAPET; y++) {
        f.hline(x, x + sw - 1, y, P.st4);
        if ((y - top) % 3 === 0) f.hline(x, x + sw - 1, y, P.st3); // the steps
        f.set(x + sw - 1, y, P.st5);
      }
    }

    function house(
      f: Frame,
      x: number,
      top: number,
      bw: number,
      bottom: number,
      body: RGB,
      haze: number,
      seed: number,
      tier: number
    ) {
      const r = (k: number) => hash2(seed, k, 57);
      f.rect(x, top, bw, bottom - top, hz(body, haze));
      // a shadowed edge where it meets its neighbour, a lit parapet on top
      f.vline(x, top, bottom, hz(P.st3, haze));
      f.hline(x, x + bw - 1, top, hz(P.st0, haze));
      if (r(1) > 0.5) f.hline(x, x + bw - 1, top + 2, hz(P.st3, haze)); // cornice
      // roof clutter: a little room, water tanks, an aerial, washing
      if (r(2) > 0.45) {
        const rx = x + 1 + Math.floor(r(3) * Math.max(1, bw - 5));
        f.rect(rx, top - 3, 4, 3, hz(P.st2, haze));
        f.hline(rx, rx + 3, top - 3, hz(P.st0, haze));
        f.vline(rx, top - 3, top - 1, hz(P.st3, haze));
      }
      if (r(4) > 0.6) f.rect(x + bw - 3, top - 1, 2, 1, hz(P.st6, haze));
      if (r(5) > 0.75) {
        // a satellite dish catching the sun
        const ax = x + 2 + Math.floor(r(6) * (bw - 3));
        f.set(ax, top - 2, hz(P.st0, haze));
        f.set(ax + 1, top - 2, hz(P.yachtSh, haze));
        f.set(ax, top - 1, hz(P.st5, haze));
      }
      if (tier >= 2 && r(8) > 0.82) {
        const cols = [P.shirtA, P.shirtB, P.shirtC, P.galY];
        for (let k = 1; k < bw - 1; k += 2)
          f.set(x + k, top - 2, cols[(k + seed) % cols.length]!);
      }
      // windows by floor, centred on the facade (x itself is the shadowed
      // edge), the odd one catching the sun
      const floorH = 4;
      const winTop = top + 4;
      const cols = Math.floor((bw - 4) / 3) + 1;
      const wx0 = x + 1 + Math.floor((bw - 1 - (cols - 1) * 3 - 1) / 2);
      // gallarija: enclosed wooden balconies, stacked up the facade. Each one
      // covers a pair of windows, its glass level with the windows beside it.
      const gal =
        bw >= 8 && r(9) > (tier === 0 ? 0.75 : 0.3)
          ? {
              g: GALS[Math.floor(r(10) * GALS.length)]!,
              gx: wx0 + 3 * Math.floor(r(12) * (cols - 1)),
              floors: 1 + Math.floor(r(13) * 3),
            }
          : null;
      const galW = 5;
      for (let y = winTop, fl = 0; y < bottom - 2; y += floorH, fl++) {
        const covered = gal !== null && fl < gal.floors && y + 2 < bottom;
        for (let c = 0; c < cols; c++) {
          const wx = wx0 + c * 3;
          const k = hash2(wx, fl, seed);
          f.vline(wx, y, y + 1, hz(k > 0.93 ? P.winHi : P.win, haze));
          // a shutter, unless it would touch the side of a gallarija
          if (k < 0.3 && tier > 0 && !(covered && wx - 1 === gal.gx + galW))
            f.set(wx - 1, y, hz(P.shut, haze));
        }
      }
      if (gal)
        for (let k = 0; k < gal.floors; k++) {
          const gy = winTop - 1 + k * floorH;
          if (gy + 3 >= bottom) break;
          gallarija(f, gal.gx, gy, galW, gal.g, haze);
        }
    }

    function gallarija(
      f: Frame,
      x: number,
      y: number,
      gw: number,
      g: Gal,
      haze: number
    ) {
      f.hline(x, x + gw - 1, y, hz(g.hi, haze)); // its little roof
      f.hline(x, x + gw - 1, y + 1, hz(P.glass, haze));
      for (let k = x; k < x + gw; k += 2) f.set(k, y + 1, hz(g.c, haze)); // window frames
      f.set(x + gw - 1, y + 1, hz(g.c, haze));
      f.hline(x, x + gw - 1, y + 2, hz(g.c, haze));
      f.set(x, y + 1, hz(g.c, haze));
      // the shadow it casts on the wall, and its stone corbels
      f.hline(x - 1, x + gw - 2, y + 3, hz(P.st4, haze));
      f.set(x - 1, y + 1, hz(P.st3, haze));
      f.set(x - 1, y + 2, hz(P.st3, haze));
    }

    function landmarks(f: Frame) {
      // ---- St Paul's: a square belfry and a tall octagonal spire ----
      const tw = 7;
      const tx = spireX - 3;
      const towerTop = 32;
      f.rect(tx, towerTop, tw, 26, P.st1);
      f.vline(tx, towerTop, towerTop + 25, P.st3);
      f.vline(tx + tw - 1, towerTop, towerTop + 25, P.st0);
      // louvred belfry openings
      f.rect(tx + 2, towerTop + 4, 3, 5, P.win);
      f.hline(tx + 2, tx + 4, towerTop + 5, P.st4);
      f.hline(tx + 2, tx + 4, towerTop + 7, P.st4);
      f.rect(tx + 3, towerTop + 13, 1, 3, P.win);
      // cornice and corner pinnacles
      f.hline(tx - 1, tx + tw, towerTop, P.st0);
      f.hline(tx - 1, tx + tw, towerTop + 1, P.st4);
      f.vline(tx - 1, towerTop - 3, towerTop - 1, P.st2);
      f.vline(tx + tw, towerTop - 3, towerTop - 1, P.st1);
      // the spire, lit on the right, with little lucarnes at its foot
      const spTop = 4;
      for (let y = spTop; y < towerTop; y++) {
        const v = (y - spTop) / (towerTop - spTop);
        const half = v * 2.6;
        const l = Math.round(spireX - half);
        const r = Math.round(spireX + half);
        for (let x = l; x <= r; x++)
          f.set(x, y, x < spireX ? P.st3 : x === spireX ? P.st2 : P.st0);
        if (y % 5 === 0 && half > 1) f.hline(l, r, y, x0shade(l, r));
      }
      f.set(spireX, spTop - 1, P.st4);
      f.set(spireX, spTop - 2, P.st4);
      f.hline(spireX - 1, spireX + 1, spTop - 2 + 1, P.st4);
      f.set(spireX - 2, towerTop - 3, P.win);
      f.set(spireX + 2, towerTop - 3, P.win);

      // ---- the Carmelite church: a tall drum, a ribbed dome, the lantern ----
      const dw = 13; // half-width of the drum
      const drumTop = 36;
      const drumBot = 56;
      for (let x = domeX - dw; x <= domeX + dw; x++) {
        const u = (x - domeX) / dw;
        // round drum: shade on the left, light on the right
        const c =
          u < -0.55 ? P.st4 : u < -0.1 ? P.st3 : u < 0.6 ? P.st1 : P.st0;
        f.vline(x, drumTop, drumBot, c);
      }
      // paired pilasters and tall arched windows round the drum
      for (const u of [-0.8, -0.35, 0.1, 0.55]) {
        const px = Math.round(domeX + u * dw);
        f.vline(px, drumTop + 2, drumBot, u < 0 ? P.st2 : P.st0);
        const wx = Math.round(domeX + (u + 0.22) * dw);
        if (Math.abs(u + 0.22) < 0.85) {
          f.vline(wx, drumTop + 4, drumTop + 9, P.win);
          f.vline(wx + 1, drumTop + 5, drumTop + 9, P.win);
          f.set(wx + 1, drumTop + 4, u < 0 ? P.st3 : P.st1);
        }
      }
      f.hline(domeX - dw - 1, domeX + dw + 1, drumTop, P.st0);
      f.hline(domeX - dw - 1, domeX + dw + 1, drumTop + 1, P.st4);
      f.hline(domeX - dw, domeX + dw, drumTop + 11, P.st3);
      // the dome: a little taller than a half circle, with ribs
      const dr = dw - 1;
      const dh = 17;
      for (let y = drumTop - dh; y < drumTop; y++) {
        const v = (drumTop - y) / dh; // 0 at the base, 1 at the top
        const half = dr * Math.sqrt(Math.max(0, 1 - v ** 2.2));
        for (
          let x = Math.round(domeX - half);
          x <= Math.round(domeX + half);
          x++
        ) {
          const u = (x - domeX) / Math.max(1, half);
          let c =
            u < -0.6
              ? P.domeShade
              : u < -0.15
                ? P.domeMid
                : u < 0.5
                  ? P.domeLit
                  : P.domeHi;
          if (u < -0.85) c = P.domeDark;
          // eight ribs: four of them face us
          for (const ru of [-0.72, -0.25, 0.25, 0.72])
            if (Math.abs(u - ru) < 0.5 / Math.max(1, half))
              c = u < 0 ? P.domeDark : P.domeMid;
          f.set(x, y, c);
        }
      }
      // lantern and cupola, a ball and a cross on top
      const lt = drumTop - dh;
      f.rect(domeX - 2, lt - 6, 5, 6, P.st1);
      f.vline(domeX - 2, lt - 6, lt - 1, P.st3);
      f.vline(domeX + 2, lt - 6, lt - 1, P.st0);
      f.vline(domeX, lt - 5, lt - 2, P.win);
      f.hline(domeX - 3, domeX + 3, lt - 7, P.st0);
      f.hline(domeX - 2, domeX + 2, lt - 8, P.domeLit);
      f.hline(domeX - 1, domeX + 1, lt - 9, P.domeMid);
      f.vline(domeX, lt - 13, lt - 10, P.st5);
      f.hline(domeX - 1, domeX + 1, lt - 12, P.st5);
      pigeons.push(
        [domeX - 3, lt - 8],
        [domeX + 3, lt - 8],
        [domeX - 10, drumTop - 1],
        [domeX + 9, drumTop - 1],
        [spireX - 3, towerTop - 1]
      );
      // (they're drawn each frame, so they can fly off when the bells ring)

      // a couple of baroque belfries further along
      for (const bx of [
        Math.round(cx - Math.min(150, w * 0.32)),
        Math.round(cx + Math.min(110, w * 0.25)),
      ]) {
        const bt = 44 + Math.round(ridge(bx));
        f.rect(bx - 3, bt, 7, 16, P.st1);
        f.vline(bx - 3, bt, bt + 15, P.st3);
        f.vline(bx + 3, bt, bt + 15, P.st0);
        f.rect(bx - 1, bt + 3, 3, 4, P.win);
        f.hline(bx - 4, bx + 4, bt, P.st0);
        f.disc(bx, bt - 1, 3, (dx, dy) =>
          dy > 0 ? null : dx < 0 ? P.st3 : P.st1
        );
        f.vline(bx, bt - 7, bt - 4, P.st5);
        f.set(bx, bt - 4, P.st2);
      }
    }

    /**
     * The house with the lit balcony: a plain front with a green gallarija
     * whose glass glows (drawn each frame, it flickers).
     */
    function balconyHouse(f: Frame) {
      const x0 = jx - 6;
      const x1 = jx + 6;
      const top = jy - 6;
      f.rect(x0, top, x1 - x0 + 1, PARAPET + 2 - top, P.stB);
      f.vline(x0, top, PARAPET + 1, P.st3);
      f.vline(x1, top, PARAPET + 1, P.st2);
      f.hline(x0, x1, top, P.st0);
      f.hline(x0, x1, top + 2, P.st3);
      // a water tank and a dish on the roof
      f.rect(x0 + 2, top - 3, 4, 3, P.st2);
      f.hline(x0 + 2, x0 + 5, top - 3, P.st0);
      f.set(x1 - 2, top - 2, P.st0);
      f.set(x1 - 1, top - 2, P.yachtSh);
      f.set(x1 - 2, top - 1, P.st5);
      // windows below the balcony
      for (const wx of [jx - 3, jx, jx + 3]) f.vline(wx, jy + 6, jy + 7, P.win);
      // the gallarija (its glass is drawn each frame)
      const g = GALS[0]!;
      f.hline(jx - 3, jx + 3, jy - 1, g.hi);
      f.hline(jx - 4, jx + 4, jy, g.c);
      for (const k of [-3, 0, 3]) f.vline(jx + k, jy + 1, jy + 2, g.c);
      f.hline(jx - 3, jx + 3, jy + 3, g.c);
      f.hline(jx - 2, jx + 2, jy + 3, g.hi);
      f.hline(jx - 4, jx + 2, jy + 4, P.st4);
      f.set(jx - 4, jy + 1, P.st3);
      f.set(jx - 4, jy + 2, P.st3);
    }

    function x0shade(l: number, r: number) {
      return r - l > 2 ? P.st4 : P.st3;
    }

    function bastions(f: Frame) {
      // Hastings Gardens: trees along the top of the right-hand bastion, none
      // hanging off its far end
      for (let k = 0; k <= Math.floor((FW - 8) / 4); k++) {
        const tx = s2 + 4 + k * 4 + Math.round(hash2(k, 1, 5) * 2);
        const r = 2.5 + hash2(k, 2, 5) * 1.5;
        f.disc(tx, PARAPET - r - 1, r, (dx, dy) =>
          dx - dy > r * 0.5 ? P.tree2 : dx - dy < -r * 0.6 ? P.tree0 : P.tree1
        );
      }
      for (let x = 0; x < w; x++) {
        const face = faceAt(x);
        const [hi, body, low] = faceColors(face);
        const top = wallTop(x);
        for (let y = top; y < QUAY; y++) {
          let c = body;
          if (y === top) c = hi;
          else if (y < CORDON)
            c = face === 'shade' || face === 'flankL' ? low : P.st1; // the parapet
          else if (y === CORDON)
            c = hi; // the rounded cordon catches the light
          else if (y === CORDON + 1) c = low;
          else if ((y - CORDON) % 4 === 0 && hash2(x >> 3, y, 7) > 0.35)
            c = low; // courses of ashlar
          f.set(x, y, c);
        }
        // a little embrasure in the parapet now and then
        if (x % 23 === 11 && face === 'front')
          f.vline(x, PARAPET + 1, PARAPET + 2, P.st4);
      }
      // the salient edges, sharp against the shade
      for (const s of [s1, s2]) {
        f.vline(s, PARAPET - 2, QUAY - 1, P.st0);
        f.vline(s - 1, CORDON + 1, QUAY - 1, P.st5);
      }
      // weathering streaks below the cordon
      for (let k = 0; k < Math.round(w / 30); k++) {
        const sx = Math.floor(hash2(k, 1, 44) * w);
        const len = 4 + Math.floor(hash2(k, 2, 44) * 10);
        for (let y = CORDON + 2; y < CORDON + 2 + len; y++)
          f.blend(sx, y, P.st5, 0.25);
      }
      // gardjola: a six-sided sentry box on corbels at each bastion's point
      for (const s of gardjolas) {
        const gy = PARAPET - 1;
        for (let k = 0; k < 4; k++) {
          f.hline(s - 3 + k, s - 1, gy + k, P.st4);
          f.hline(s, s + 3 - k, gy + k, P.st2);
        }
        for (let y = gy - 8; y < gy; y++) {
          f.hline(s - 3, s - 2, y, P.st5);
          f.hline(s - 1, s + 1, y, P.st1);
          f.hline(s + 2, s + 3, y, P.st0);
          f.set(s - 4, y, P.st6);
          f.set(s + 4, y, P.st4);
        }
        f.vline(s, gy - 6, gy - 4, P.st6);
        f.set(s - 3, gy - 5, P.st6);
        f.set(s + 3, gy - 5, P.st5);
        f.hline(s - 4, s + 4, gy - 9, P.st0);
        f.hline(s - 4, s + 4, gy - 8, P.st5);
        f.hline(s - 3, s - 1, gy - 10, P.st4);
        f.hline(s, s + 3, gy - 10, P.st0);
        f.hline(s - 2, s - 1, gy - 11, P.st4);
        f.hline(s, s + 2, gy - 11, P.st0);
        f.hline(s - 1, s + 1, gy - 12, P.st1);
        f.vline(s, gy - 14, gy - 13, P.st4);
      }
      // capers and weeds growing out of the joints
      for (let k = 0; k < Math.round(w / 70); k++) {
        const x = Math.floor(hash2(k, 5, 46) * w);
        const y =
          CORDON + 3 + Math.floor(hash2(k, 6, 46) * (QUAY - CORDON - 12));
        f.set(x, y, P.tree1);
        f.set(x + 1, y, P.tree2);
        f.set(x, y + 1, P.tree0);
        if (hash2(k, 7, 46) > 0.5) f.set(x - 1, y - 1, P.tree2);
      }
      // the quay: arched store doors in the wall, a stone edge, bollards
      for (let x = 8; x < w - 8; x += 26 + Math.floor(hash2(x, 3, 9) * 14)) {
        // not across a corner of the walls
        const face = faceAt(x - 1);
        if (Math.abs(x - s1) < 6 || Math.abs(x - s2) < 6) continue;
        if (faceAt(x + 4) !== face) continue;
        f.rect(x, QUAY - 6, 4, 6, P.st6);
        f.hline(x + 1, x + 2, QUAY - 7, P.st6);
        f.hline(x - 1, x + 4, QUAY - 8, faceColors(face)[2]); // the drip mould
      }
      f.rect(0, QUAY, w, 2, P.st1);
      f.hline(0, w, QUAY, P.st0);
      f.rect(0, QUAY + 2, w, WATER - QUAY - 2, P.st4);
      f.hline(0, w, WATER - 1, P.wet);
      for (let x = 5; x < w; x += 19) f.rect(x, QUAY - 1, 1, 1, P.st6);
    }

    // ---------- boats ----------
    const LA = Math.round(Math.min(76, Math.max(52, w * 0.17)));
    const L1 = Math.round(LA * 0.66);
    const boats: Boat[] = [
      {
        x: Math.round(cx - Math.min(200, Math.max(78, w * 0.4))),
        y: RAIL - 1,
        L: LA,
        scheme: SCHEMES[0]!,
        seed: 1,
        flip: false,
      },
      {
        // (clear of where she strolls, so she stands against the water)
        x: Math.round(
          Math.min(cx + Math.min(120, Math.max(30, w * 0.16)), herMin - L1 - 6)
        ),
        y: 131,
        L: L1,
        scheme: SCHEMES[1]!,
        seed: 2,
        flip: true,
      },
    ];
    if (w > 300)
      boats.push({
        x: Math.round(cx - Math.min(70, w * 0.14)),
        y: 126,
        L: 28,
        scheme: SCHEMES[2]!,
        seed: 3,
        flip: false,
      });
    const rockAt = boats.map(() => -Infinity);
    // the big luzzu's eye is an easter egg: click it and it looks back at
    // you and winks, and the boat sets off on a trip round the harbour (the
    // boats only rock when you click the rest of them)
    let eyeAt = -Infinity;
    const EYE_R = 7;
    const eyeSpot = (t: number) => {
      const b = boats[0]!;
      const st = boatState(b, 0, t);
      return hull({ ...b, y: b.y + st.bob }, st.tilt).eye;
    };
    const onEye = (x: number, y: number, t: number) => {
      const [ex, ey] = eyeSpot(t);
      return Math.hypot(x - ex, y - ey) <= EYE_R;
    };
    const boatBox = (b: Boat) => ({
      x0: b.x - 2,
      x1: b.x + b.L + 2,
      y0: b.y - b.L * 0.3,
      y1: b.y + 4,
    });

    function boatState(b: Boat, i: number, t: number) {
      const k = t - rockAt[i]!;
      const kick = k < 3200 ? (1 - k / 3200) ** 1.5 : 0;
      const tilt =
        Math.sin(t / 900 + b.seed * 2) * 0.012 +
        (kick ? kick * Math.sin(k / 170) * 0.09 : 0);
      const bob =
        Math.sin(t / 1100 + b.seed) * 0.6 +
        (kick ? kick * Math.sin(k / 170 + 1) * 1.2 : 0);
      return { tilt, bob };
    }

    function boatReflection(f: Frame, b: Boat, bob: number, t: number) {
      const y0 = Math.round(b.y + bob);
      for (let i = 0; i < b.L; i++) {
        const x = b.x + i;
        const u = b.flip ? 1 - i / b.L : i / b.L; // short under the raised bow
        const len = Math.round(
          b.L * 0.14 * Math.sin(Math.min(1, u * 1.1) * Math.PI) + 1
        );
        for (let d = 1; d <= len; d++) {
          if ((d + Math.floor(t / 400)) % 3 === 0) continue;
          const wob = Math.round(Math.sin(d * 1.3 + t / 350) * 0.8);
          const c = d < len * 0.45 ? b.scheme.main : b.scheme.top;
          f.blend(x + wob, y0 + d, c, 0.45 - (d / len) * 0.25);
        }
      }
    }

    // moored yachts, small boats along the quay
    const yachts = [0.05, 0.6, 0.93]
      .filter((k) => w > 300 || k !== 0.6)
      .map((k, i) => ({
        x: Math.round(k * w - 9),
        y: 121 + Math.round(hash2(i, 2, 81) * 2),
        L: 16 + Math.round(hash2(i, 3, 81) * 6),
        mast: 22 + Math.round(hash2(i, 4, 81) * 10),
      }));

    function yacht(f: Frame, x: number, y: number, L: number, mast: number) {
      for (let k = 0; k < L; k++) {
        const bow = k > L - 4 ? k - (L - 4) : 0;
        f.set(x + k, y - 3 + Math.floor(bow / 2), P.yacht);
        f.set(x + k, y - 2 + Math.floor(bow / 2), P.yacht);
        if (y - 1 + bow <= y)
          f.vline(x + k, y - 1 + Math.floor(bow / 2), y, P.yachtSh);
      }
      f.rect(x + 3, y - 5, Math.round(L * 0.4), 2, P.yacht);
      f.hline(x + 4, x + 2 + Math.round(L * 0.4), y - 4, P.ferryWin);
      const mx = x + Math.round(L * 0.45);
      f.vline(mx, y - 3 - mast, y - 4, P.mast);
      f.line(mx, y - 3 - mast, x + L - 1, y - 4, P.yachtSh); // forestay
      f.hline(mx - Math.round(L * 0.35), mx, y - 6, P.luzBlueDk); // furled sail on the boom
    }

    // ---------- people, gulls, the bus, the ferry, the dghajsa ----------
    const walkers = Array.from(
      { length: Math.max(2, Math.round(w / 90)) },
      (_, i) => ({
        off: hash2(i, 0, 61) * (w + 20),
        speed: (0.006 + hash2(i, 1, 61) * 0.006) * (i % 2 ? 1 : -1),
        shirt: [P.shirtA, P.shirtB, P.shirtC][i % 3]!,
      })
    );

    function bus(f: Frame, t: number) {
      const PERIOD = 34_000;
      const p = (t % PERIOD) / 14_000;
      if (p > 1) return;
      const dir = Math.floor(t / PERIOD) % 2 ? 1 : -1;
      const x = Math.round(
        dir === 1 ? -24 + p * (w + 48) : w + 24 - p * (w + 48)
      );
      // half as tall again as the people on the quay
      const L = 19;
      const y = QUAY - 9;
      f.rect(x, y + 1, L, 7, P.bus);
      f.hline(x + 1, x + L - 2, y, P.busSh);
      for (let k = 1; k < L - 2; k += 3) f.rect(x + k, y + 2, 2, 2, P.busWin);
      f.hline(x, x + L - 1, y + 5, P.busStripe);
      f.hline(x, x + L - 1, y + 7, P.busSh);
      f.rect(dir === 1 ? x + L : x - 1, y + 2, 1, 6, P.busSh); // the rounded nose
      for (const wx of [x + 3, x + L - 5]) f.hline(wx, wx + 1, y + 8, P.st6);
    }

    function ferry(f: Frame, t: number) {
      const PERIOD = 46_000;
      const p = (t % PERIOD) / 30_000;
      if (p > 1) return;
      const dir = Math.floor(t / PERIOD) % 2 ? 1 : -1;
      const L = 34;
      const x = Math.round(
        dir === 1
          ? -L - 10 + p * (w + 2 * L + 20)
          : w + 10 - p * (w + 2 * L + 20)
      );
      const y = 119 + Math.round(Math.sin(t / 900) * 0.4);
      // wake
      for (let k = 2; k < 26; k++)
        if ((k + Math.floor(t / 150)) % 3)
          f.set(dir === 1 ? x - k : x + L + k, y + (k > 12 ? 1 : 0), P.foam);
      for (let k = 0; k < L; k++) {
        const nose = dir === 1 ? k > L - 5 : k < 5;
        const rise = nose ? 1 : 0;
        f.vline(x + k, y - 4 - rise, y - 3, P.ferry);
        f.set(x + k, y - 2, P.ferryBand);
        f.vline(x + k, y - 1, y, P.ferrySh);
      }
      const c0 = x + (dir === 1 ? 6 : 8);
      f.rect(c0, y - 8, 20, 4, P.ferry);
      f.hline(c0, c0 + 19, y - 8, P.ferrySh);
      for (let k = 1; k < 19; k += 2) f.set(c0 + k, y - 6, P.ferryWin);
      f.rect(c0 + (dir === 1 ? 14 : 2), y - 11, 4, 3, P.ferry);
      f.set(c0 + (dir === 1 ? 15 : 3), y - 10, P.ferryWin);
      for (let k = 0; k < 18; k++) f.blend(x + k * 2, y + 1, P.water4, 0.3);
    }

    function dghajsa(f: Frame, t: number) {
      const PERIOD = 80_000;
      const p = ((t + 20_000) % PERIOD) / PERIOD;
      // far enough past the left edge that its wake has gone too
      const x = Math.round(w + 20 - p * (w + 60));
      const y = 126;
      const L = 22;
      for (let k = 0; k < L; k++) {
        const end = Math.min(k, L - 1 - k);
        const top = y - 2 - (end < 3 ? 3 - end : 0);
        f.vline(x + k, top, y - 1, k < 3 || k > L - 4 ? P.luzRed : P.luzBlue);
        f.set(x + k, top, P.luzYel);
        f.set(x + k, y, P.luzBlueDk);
      }
      // the tall carved posts at each end
      f.vline(x, y - 9, y - 4, P.luzYel);
      f.vline(x + L - 1, y - 8, y - 4, P.luzGrn);
      // the boatman stands and rows facing forward
      const stroke = Math.sin(t / 500);
      const rx = x + 14;
      f.vline(rx, y - 8, y - 3, P.person);
      f.set(rx, y - 6, P.shirtA);
      f.set(rx, y - 9, P.skin);
      const oarX = rx + (stroke > 0 ? 3 : 1);
      f.line(rx - 1, y - 6, oarX, y + 1, P.st5);
      if (stroke > 0.7) f.set(oarX + 1, y + 1, P.foam);
      for (let k = 0; k < 14; k++)
        if ((k + Math.floor(t / 300)) % 4)
          f.set(x + L + 1 + k, y + (k > 6 ? 1 : 0), P.foam);
      // a passenger
      f.vline(x + 6, y - 5, y - 3, P.person);
      f.set(x + 6, y - 6, P.shirtB);
    }

    function gulls(f: Frame, t: number) {
      for (let i = 0; i < 3; i++) {
        const span = w + 40;
        const x =
          ((hash2(i, 1, 91) * span + t * (0.008 + i * 0.003)) % span) - 20;
        const y =
          92 + i * 9 + Math.sin(t / 1600 + i * 2) * 4 - (i === 2 ? 60 : 0);
        const flap = Math.sin(t / 220 + i * 3) > 0 ? -1 : 0;
        f.set(x, y, P.gull);
        f.set(x + 1, y, P.gull);
        f.set(x - 1, y + flap, P.gullWing);
        f.set(x - 2, y + flap * 2, P.gullWing);
        f.set(x + 2, y + flap, P.gull);
        f.set(x + 3, y + flap * 2, P.gullWing);
      }
    }

    // ---------- the promenade and the rocks, in front of everything ----------
    const front = layer(w, h, (f) => {
      // pale paving slabs, a lit kerb along the foot of the railings
      for (let y = PAVE; y < h; y++) {
        const row = y - PAVE;
        for (let x = 0; x < rx0; x++) {
          let c = P.pave;
          if (row === 0) c = P.paveLit;
          else if (row === 1) c = P.paveSh;
          else if (row === 4 || row === 7) c = P.paveJoint;
          else if ((x + (row > 4 ? 5 : 0)) % 10 === 0) c = P.paveJoint;
          else if (hash2(x, y, 71) > 0.93) c = P.paveLit;
          f.set(x, y, c);
        }
      }
      // the railings: posts, a top rail and a middle one
      for (let x = 0; x < rx0 - 3; x++) {
        f.set(x, RAIL, P.rail);
        f.set(x, RAIL + 1, P.railSh);
        f.set(x, RAIL + 3, P.rail);
        if (x % 6 === 2) f.vline(x, RAIL, PAVE - 1, P.rail);
        if (x % 6 === 3) f.vline(x, RAIL + 2, PAVE - 1, P.railSh);
      }
      // a stone pillar where the promenade ends and the rocks begin
      f.rect(rx0 - 3, RAIL - 2, 3, h - RAIL + 2, P.st1);
      f.vline(rx0 - 3, RAIL - 2, h - 1, P.st3);
      f.vline(rx0 - 1, RAIL - 2, h - 1, P.st0);
      f.hline(rx0 - 4, rx0, RAIL - 3, P.st0);
      // flat shelves of pale limestone stepping down to the sea: lit tops,
      // a ledge in shadow under each, pitted faces, the odd crack
      for (let x = rx0; x < w; x++) {
        const top = rockTop(x);
        const crack = hash2(x, 5, 35) > 0.9;
        for (let y = top; y < h; y++) {
          const d = y - top;
          let c = d === 0 ? P.rock0 : d < 3 ? P.rock1 : P.rock2;
          if (d === 3 && hash2(x >> 2, 1, 36) > 0.25) c = P.rock3; // the ledge
          if (d > 3 && (y - top) % 4 === 3 && hash2(x >> 2, y, 36) > 0.6)
            c = P.rock3; // bedding
          if (d > 0 && hash2(x, y, 33) > 0.93) c = P.rock3; // pitted
          if (d > 4 && hash2(x, y, 34) > 0.985) c = P.rock4;
          if (crack && d > 3 && d < 7) c = P.rock3;
          f.set(x, y, c);
        }
        // where it steps up, the step's face is in shade
        const prev = rockTop(x - 1);
        if (x > rx0 && prev > top)
          for (let y = top + 1; y <= prev; y++) f.set(x, y, P.rock2);
      }
    });
    function blitFront(f: Frame) {
      const src = front.pixels;
      const dst = f.pixels;
      for (let i = (RAIL - 4) * w; i < w * h; i++) {
        const p = src[i]!;
        if (p >>> 24) dst[i] = p;
      }
    }
    /** Is (x, y) on the promenade or the rocks (not the water)? */
    const inFront = (x: number, y: number) =>
      (x < rx0 - 3 && y >= RAIL) ||
      (x >= rx0 - 4 && x < rx0 && y >= RAIL - 3) ||
      (x >= rx0 && y >= rockTop(x));

    /** The sea lapping at the rocks. */
    function lap(f: Frame, t: number) {
      for (let x = rx0; x < rx0 + Math.round(R * 0.12); x++) {
        const y = rockTop(x) - 1;
        if (Math.sin(t / 650 + x * 0.9) > 0.2) f.set(x, y, P.foam);
      }
      // now and then a wave slaps the lip and throws up a little spray
      const k = (t % 3700) / 700;
      if (k < 1)
        for (let i = 0; i < 6; i++) {
          const a = k + hash2(i, 1, 55) * 0.2;
          f.set(
            rx0 + 1 + i + Math.round(a * (i - 2)),
            rockTop(rx0 + 2) - 2 - Math.round(Math.sin(a * Math.PI) * (3 + i)),
            P.foam
          );
        }
    }

    // ---------- golden hour (while they sit on the rocks) ----------
    const sunsetRow = new Int32Array(WATER);
    for (let y = 0; y < WATER; y++) {
      const v = Math.min(1, y / 86) * (SUNSET.length - 1);
      const i = Math.floor(v);
      sunsetRow[y] = lerpRGB(
        SUNSET[i]!,
        SUNSET[Math.min(SUNSET.length - 1, i + 1)]!,
        v - i
      );
    }
    /** Pulls the sky towards a sunset, `k` of the way. */
    function skyToSunset(f: Frame, k: number) {
      const A = Math.round(k * 256);
      const px = f.pixels;
      for (let y = 0; y < WATER; y++) {
        const c = sunsetRow[y]!;
        const cr = c >> 16;
        const cg = (c >> 8) & 255;
        const cb = c & 255;
        for (let i = y * w, e = i + w; i < e; i++) {
          const p = px[i]!;
          const r = p & 255;
          const g = (p >> 8) & 255;
          const b = (p >> 16) & 255;
          px[i] =
            (0xff000000 |
              ((b + (((cb - b) * A) >> 8)) << 16) |
              ((g + (((cg - g) * A) >> 8)) << 8) |
              (r + (((cr - r) * A) >> 8))) >>>
            0;
        }
      }
    }
    /** Warms everything up: honey stone goes gold, the water deepens. */
    function warmGrade(f: Frame, k: number) {
      const A = Math.round(k * 256);
      const px = f.pixels;
      for (let i = 0, e = w * h; i < e; i++) {
        const p = px[i]!;
        const r = p & 255;
        const g = (p >> 8) & 255;
        const b = (p >> 16) & 255;
        const tr = Math.min(255, r + (r >> 3) + 34);
        const tg = g - (g >> 4) + 6;
        const tb = (b >> 1) + (b >> 3);
        px[i] =
          (0xff000000 |
            ((b + (((tb - b) * A) >> 8)) << 16) |
            ((g + (((tg - g) * A) >> 8)) << 8) |
            (r + (((tr - r) * A) >> 8))) >>>
          0;
      }
    }

    // ---------- luzzu-wink: the boat trip ----------
    const tripD = w + LA + 28; // off the right edge, back in from the left
    /**
     * Where the big luzzu is `age` ms after its eye was clicked, and how fast
     * it's going (0..1): it eases away, runs off to the right, comes round
     * from the left and glides back to its mooring.
     */
    function trip(age: number) {
      const p = Math.min(1, Math.max(0, (age - LUZ_GO) / LUZ_TRIP));
      const A = 0.22;
      const D = 0.3;
      const vmax = 1 / (1 - A / 2 - D / 2);
      let s: number;
      let v: number;
      if (p < A) {
        s = (vmax * p * p) / (2 * A);
        v = p / A;
      } else if (p < 1 - D) {
        s = vmax * (A / 2 + p - A);
        v = 1;
      } else {
        const q = 1 - p;
        s = 1 - (vmax * q * q) / (2 * D);
        v = q / D;
      }
      let x = boats[0]!.x + s * tripD;
      if (x > w + 14) x -= tripD;
      return { x, v, pxs: (v * vmax * tripD) / (LUZ_TRIP / 1000) };
    }
    const crewPop = (age: number) =>
      Math.min(1, Math.max(0, (age - 450) / 350)) *
      Math.min(1, Math.max(0, (LUZ_FOR - 80 - age) / 350));
    const grillY = hull(boats[0]!, 0).at(0.56)[1] - 6;
    /** Smoke off the grill, left behind as the boat goes. */
    function bbqSmoke(f: Frame, age: number) {
      const STEP = 110;
      for (let j = 0; j < 16; j++) {
        const te = Math.floor(age / STEP) * STEP - j * STEP;
        const da = age - te;
        if (te < 600 || te > LUZ_FOR - 300 || da > 1700) continue;
        const gx = trip(te).x + Math.round(0.56 * (LA - 1));
        const a = da / 1700;
        const px = gx - da * 0.006 + Math.sin(da / 300 + j) * 1.2;
        const py = grillY - da * 0.013;
        const r = 1 + a * 2.8;
        for (let dy = -4; dy <= 4; dy++)
          for (let dx = -4; dx <= 4; dx++) {
            const q = Math.hypot(dx, dy) / r;
            if (q > 1) continue;
            f.dset(
              Math.round(px + dx),
              Math.round(py + dy),
              dy > 0 || dx > 1 ? P.bbqSh : P.bbq,
              (1 - a * a) * (q < 0.6 ? 0.95 : 0.6)
            );
          }
      }
    }
    /** Spray off the bow while it's going (drawn over the boat). */
    function bowSpray(f: Frame, age: number, y0: number) {
      // a fan of spray thrown up off the stem
      const STEP = 30;
      for (let j = 0; j < 24; j++) {
        const te = Math.floor(age / STEP) * STEP - j * STEP;
        const da = (age - te) / 1000;
        if (te < LUZ_GO || da > 0.7) continue;
        const tr = trip(te);
        if (tr.v < 0.25) continue;
        for (let k = 0; k < 2; k++) {
          const r1 = hash2(te, 1 + k * 2, 77);
          const r2 = hash2(te, 2 + k * 2, 77);
          const bx = tr.x + LA * 0.88;
          const vx = tr.pxs * (0.5 + r1 * 0.55);
          const vy = -(35 + r2 * 60) * tr.v;
          const x = bx + vx * da;
          const y = y0 - 3 + vy * da + 170 * da * da;
          if (y > y0) continue;
          f.set(x, y, da < 0.25 ? P.fwWhite : P.foam);
          if (r1 > 0.45) f.set(x - 1, y, P.foam);
          if (r2 > 0.55) f.set(x, y + 1, P.foam);
        }
      }
      // the bow wave curling off the stem
      const now = trip(age);
      if (now.v > 0.15) {
        const bx = Math.round(now.x + LA * 0.86);
        const hgt = Math.round(1 + now.v * 4);
        for (let i = 0; i < 7; i++) {
          const top = y0 - Math.round(hgt * (1 - i / 7)) - 1;
          for (let y = top; y <= y0; y++)
            f.set(
              bx + i,
              y,
              (y + i + Math.floor(age / 80)) % 3 ? P.foam : P.fwWhite
            );
        }
      }
    }
    /** The wake spreading out behind it. */
    function wake(f: Frame, age: number, y0: number) {
      for (let j = 0; j < 30; j++) {
        const te = Math.floor(age / 50) * 50 - j * 50;
        const da = age - te;
        if (te < LUZ_GO || da > 1500) continue;
        const tr = trip(te);
        if (tr.v < 0.15) continue;
        const spread = da * 0.004;
        const sx = Math.round(tr.x + 1 - da * 0.004);
        const a = (1 - da / 1500) * tr.v;
        f.dset(sx, Math.round(y0 - spread), P.foam, a);
        f.dset(sx, Math.round(y0 + 1 + spread * 0.5), P.foam, a);
      }
    }

    // ---------- promenade: a man walks up to the woman ----------
    let meetAt = -Infinity;
    let meetX = 0; // where she was when he walked up
    let meetDir = 1;
    const sitHer = rx0 + Math.round(R * 0.12);
    const sitMan = sitHer + 11;
    const sitY = SHELF - 10;
    const bottleX = sitHer + 9;
    const smooth = (v: number) => {
      const c = Math.min(1, Math.max(0, v));
      return c * c * (3 - 2 * c);
    };
    /** The golden light, 0..1, while they're on the rocks. */
    const goldAt = (age: number) =>
      age < 3500
        ? 0
        : age < 4600
          ? smooth((age - 3500) / 1100)
          : age < 6800
            ? 1
            : smooth((7700 - age) / 900);
    // what they say: each in pictures, back and forth
    const TALK: { at: number; man: boolean; pics: Sprite[] }[] = [
      { at: 1150, man: true, pics: [PIC_WAVE] },
      { at: 1700, man: false, pics: [PIC_SMILE] },
      { at: 2250, man: true, pics: [PIC_WINE, PIC_POINT] },
      { at: 2800, man: false, pics: [PIC_SUN, PIC_THUMB] },
    ];
    const SAY_FOR = 950;
    const manPic = picPal(P.mTee);
    const herPic = picPal(P.wSkin);

    /** Her on the promenade, strolling (or turned to him). */
    function drawHer(
      f: Frame,
      x: number,
      dir: number,
      step: number,
      a: number,
      hand: [number, number] | null,
      pal: Record<string, RGB>
    ) {
      const flip = dir < 0;
      const y = FEET - 15;
      spr(f, step ? HER_STEP : HER, x, y, pal, flip, a);
      if (a < 1) return;
      // her arm: hanging, swinging as she walks, or doing what she says
      const sx = flip ? x + 1 : x + 5;
      const [hx, hy] = hand ?? [step ? 1 : 0, 4];
      arm(f, sx, y + 6, sx + hx * dir, y + 6 + hy, pal.s!, null);
    }
    /** The man standing on the promenade, `hand` relative to his shoulder. */
    function drawMan(
      f: Frame,
      x: number,
      dir: number,
      step: number,
      hand: [number, number],
      back: [number, number] | null,
      pal: Record<string, RGB>,
      a = 1
    ) {
      const flip = dir < 0;
      const y = ground(x + 3) - 16;
      spr(f, step ? MAN_STEP : MAN, x, y, pal, flip, a);
      if (a < 1) return;
      const fx0 = flip ? x + 1 : x + 5;
      const bx0 = flip ? x + 5 : x + 1;
      if (back)
        arm(
          f,
          bx0,
          y + 7,
          bx0 + back[0] * dir,
          y + 7 + back[1],
          pal.s!,
          pal.T!
        );
      arm(f, fx0, y + 7, fx0 + hand[0] * dir, y + 7 + hand[1], pal.s!, pal.T!);
    }
    /** A glass of red wine held at (x, y). */
    function wineGlass(f: Frame, x: number, y: number) {
      f.set(x - 1, y - 3, P.picGlass);
      f.set(x + 1, y - 3, P.picGlass);
      f.hline(x - 1, x + 1, y - 2, P.wine);
      f.set(x, y - 1, P.wineDk);
      f.set(x, y, P.picGlass);
    }

    function drawMeet(f: Frame, age: number, gold: number) {
      const tint = gold * 0.25;
      const mPal = tintPal(MAN_PAL, P.golden, tint);
      const hPal = tintPal(HER_PAL, P.golden, tint);
      const hx = meetX;
      const mEnd = hx + 10;
      const out = age > 7100 ? Math.max(0, 1 - (age - 7100) / 600) : 1;
      if (age < 3600) {
        // he walks up from the rocks, waves, and they talk
        const p = Math.min(1, age / 1100);
        const mx = Math.round(w + 2 + (mEnd - w - 2) * (1 - (1 - p) ** 2));
        const walking = p < 0.97;
        const mStep = walking ? Math.floor(age / 130) % 2 : 0;
        let hand: [number, number] = walking ? [mStep ? 1 : -1, 4] : [0, 4];
        let back: [number, number] | null = null;
        if (age >= 1100 && age < 1700) {
          // the wave: hand up, a stiff little wiggle
          hand = [2 + (Math.floor(age / 110) % 2), -6];
        } else if (age >= 1700 && age < 2250) {
          back = [-1, -7]; // rubbing the back of his head
        } else if (age >= 2250 && age < 2650) {
          hand = [0, -3]; // a drink?
        } else if (age >= 2650 && age < 3300) {
          hand = [5, -1]; // over there, on the rocks?
        }
        drawMan(f, mx, -1, mStep, hand, back, mPal);
        const hDir = age < 450 ? meetDir : 1;
        let hHand: [number, number] | null = null;
        if (age >= 1750 && age < 2250) hHand = [1, -2]; // a giggle
        if (age >= 2850 && age < 3500) hHand = [2, -4]; // thumbs up
        drawHer(f, hx, hDir, 0, 1, hHand, hPal);
        // speech bubbles
        for (const s of TALK) {
          const sa = age - s.at;
          if (sa < 0 || sa > SAY_FOR) continue;
          const pw =
            s.pics.reduce((n, p) => n + p[0]!.length, 0) +
            (s.pics.length - 1) * 2;
          const ph = Math.max(...s.pics.map((p) => p.length));
          const bw = pw + 4;
          const bh = ph + 4;
          const headX = s.man ? mx + 3 : hx + 3;
          const headY = s.man ? FEET - 17 : FEET - 16;
          const rise = sa < 120 ? Math.round((1 - sa / 120) * 3) : 0;
          const bx = Math.max(
            2,
            Math.min(w - bw - 2, s.man ? headX - 3 : headX - bw + 3)
          );
          const by = headY - 5 - bh + rise;
          bubble(
            f,
            bx,
            by,
            bw,
            bh,
            headX + (s.man ? 1 : -1),
            headY - 1,
            P.bubble,
            P.ink
          );
          let px = bx + 2;
          for (const pic of s.pics) {
            spr(
              f,
              pic,
              px,
              by + 2 + Math.floor((ph - pic.length) / 2),
              s.man ? manPic : herPic
            );
            px += pic[0]!.length + 2;
          }
        }
        return;
      }
      if (age < 4400) {
        // off to the rocks together
        const p = smooth((age - 3600) / 800);
        const step = Math.floor(age / 140) % 2;
        const hxx = Math.round(hx + (sitHer - hx) * p);
        const mxx = Math.round(mEnd + (sitMan - mEnd) * p);
        drawMan(f, mxx, 1, p < 0.98 ? step : 0, [step ? 1 : -1, 4], null, mPal);
        drawHer(f, hxx, 1, p < 0.98 ? 1 - step : 0, 1, null, hPal);
        return;
      }
      // on the rocks with a bottle and two glasses, golden light all round
      // (and a little more of it on them)
      if (gold > 0) {
        const gx0 = bottleX;
        const gy0 = sitY + 4;
        const gr = 26;
        for (let y = gy0 - gr; y <= gy0 + gr * 0.6; y++)
          for (let x = gx0 - gr; x <= gx0 + gr; x++) {
            const d = Math.hypot(x - gx0, (y - gy0) * 1.3) / gr;
            if (d < 1) f.blend(x, y, P.coalHi, gold * 0.5 * (1 - d) * (1 - d));
          }
      }
      const clink = age >= 4800 && age < 5300;
      const lean = age >= 5400 ? 1 : 0;
      const hX = sitHer + lean;
      spr(f, HER_SIT, hX, sitY, hPal, false, out);
      spr(f, MAN_SIT, sitMan, sitY, mPal, true, out);
      if (out >= 1) {
        f.vline(bottleX, SHELF - 4, SHELF - 1, P.bottle);
        f.vline(bottleX + 1, SHELF - 4, SHELF - 1, P.bottle);
        f.set(bottleX, SHELF - 3, P.bottleHi);
        f.vline(bottleX, SHELF - 6, SHELF - 5, P.bottle);
        f.set(bottleX, SHELF - 7, P.wineDk);
        const up = clink ? smooth((age - 4800) / 200) : 0;
        const hh: [number, number] = [
          Math.round(hX + 6 + (bottleX - 1 - hX - 6) * up),
          Math.round(sitY + 9 - 6 * up),
        ];
        const mh: [number, number] = [
          Math.round(sitMan + 1 + (bottleX + 2 - sitMan - 1) * up),
          Math.round(sitY + 9 - 6 * up),
        ];
        arm(f, hX + 4, sitY + 6, hh[0], hh[1], hPal.s!, null);
        arm(f, sitMan + 3, sitY + 7, mh[0], mh[1], mPal.s!, mPal.T!);
        wineGlass(f, hh[0], hh[1] - 1);
        wineGlass(f, mh[0], mh[1] - 1);
      }
      // the clink: a sparkle where the glasses touch
      const ka = age - 4950;
      if (ka >= 0 && ka < 700) {
        const p = ka / 700;
        const sx = bottleX + 0.5;
        const sy = sitY - 1;
        const len = Math.round(2 + Math.sin(p * Math.PI) * 6);
        for (let d = 1; d <= len; d++) {
          const c = d < len * 0.5 ? P.fwWhite : P.coalHi;
          for (const [ux, uy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ] as const)
            f.set(sx + ux * d, sy + uy * d, c);
          if (d <= len * 0.5)
            for (const [ux, uy] of [
              [1, 1],
              [-1, 1],
              [1, -1],
              [-1, -1],
            ] as const)
              f.set(sx + ux * d, sy + uy * d, P.coalHi);
        }
        f.set(sx, sy, P.fwWhite);
        for (let i = 0; i < 5; i++) {
          const ang = hash2(i, 1, 66) * Math.PI * 2;
          const r = 4 + p * (10 + hash2(i, 2, 66) * 8);
          if (Math.sin(ka / 60 + i * 2) > -0.2)
            f.set(
              sx + Math.cos(ang) * r,
              sy + Math.sin(ang) * r * 0.8,
              P.fwWhite
            );
        }
      }
      // big hearts float up over the harbour, fanning out to the left
      const spread = Math.min(w * 0.6, 240);
      for (let i = 0; i < 10; i++) {
        const st = 5000 + i * 170;
        const life = 2500 - i * 90;
        const ha = age - st;
        if (ha < 0 || ha > life) continue;
        const p = ha / life;
        const full = [15, 11, 13, 9, 15, 11, 13, 9, 11, 13][i]!;
        // pop in, and shrink away at the top
        const size =
          ha < 160
            ? 3 + (full - 3) * (ha / 160)
            : p > 0.85
              ? full * (1 - (p - 0.85) / 0.15)
              : full;
        if (size < 2) continue;
        const x0 = bottleX + (hash2(i, 1, 88) - 0.5) * 8;
        const fan = 0.15 + ((i * 7) % 10) / 10;
        const x = x0 - spread * fan * p ** 1.2 + Math.sin(ha / 260 + i) * 2.5;
        const y = sitY - 8 - (60 + full * 3) * p ** 0.8;
        heart(f, x, y, Math.round(size), P.heart, P.heartHi, P.heartEdge);
      }
    }

    // ---------- balcony: the close-up through the window ----------
    let balconyAt = -Infinity;
    const onWindow = (x: number, y: number) =>
      Math.hypot(x - jx, y - (jy + 2)) <= BALCONY_R;
    const easeOut = (v: number) => 1 - (1 - v) * (1 - v);
    /** The inset's rectangle `age` ms in, or null while it's shut. */
    function insetRect(age: number) {
      const o =
        age < 450
          ? easeOut(age / 450)
          : age < 4500
            ? 1
            : age < 4950
              ? 1 - smooth((age - 4500) / 450)
              : 0;
      if (o <= 0) return null;
      return {
        o,
        x: Math.round(jx - 3 + (insetX - jx + 3) * o),
        y: Math.round(jy + 1 + (insetY - jy - 1) * o),
        w: Math.max(2, Math.round(7 + (insetW - 7) * o)),
        h: Math.max(2, Math.round(2 + (insetH - 2) * o)),
      };
    }
    function codeLine(
      n: number,
      x0: number,
      y: number,
      x1: number,
      f: Frame,
      upTo = Infinity
    ) {
      const cols = [P.codeA, P.codeB, P.codeC, P.codeD, P.codeE, P.codeE];
      let x = x0 + Math.floor(hash2(n, 1, 41) * 3) * 2;
      if (hash2(n, 9, 41) > 0.85) return; // a blank line
      const segs = 1 + Math.floor(hash2(n, 2, 41) * 3);
      for (let s = 0; s < segs && x < x1; s++) {
        const len = 2 + Math.floor(hash2(n, 3 + s, 41) * 5);
        const c = cols[Math.floor(hash2(n, 7 + s, 41) * cols.length)]!;
        for (let k = 0; k < len && x < x1 && x - x0 < upTo; k++, x++)
          f.set(x, y, c);
        x++;
      }
    }
    function drawRoom(age: number) {
      const f = room;
      const W = roomW;
      const H = roomH;
      const c = Math.floor(W / 2);
      for (let y = 0; y < H; y++)
        f.hline(0, W - 1, y, y < H * 0.45 ? P.roomWall : P.roomWallSh);
      const floorY = H - 6;
      f.rect(0, floorY, W, H - floorY, P.floor);
      f.hline(0, W - 1, floorY, P.deskSh);
      // a window with green shutters, open on a Maltese sky
      const wx0 = c - 30;
      f.rect(wx0, 5, 10, 13, P.st4);
      f.rect(wx0 + 1, 6, 8, 11, P.sky1);
      f.rect(wx0 + 1, 12, 8, 5, P.sky3);
      f.rect(wx0 + 1, 14, 8, 3, P.st1);
      f.vline(wx0 + 5, 6, 16, P.st4);
      for (const sx of [wx0 - 3, wx0 + 10]) {
        f.rect(sx, 5, 3, 13, P.shut);
        for (let y = 6; y < 17; y += 2) f.hline(sx, sx + 2, y, P.shutHi);
      }
      // a shelf with folders (on wider close-ups)
      if (W > 80) {
        f.rect(W - 16, 12, 12, 1, P.deskSh);
        for (let k = 0; k < 5; k++)
          f.rect(
            W - 15 + k * 2,
            7 + (k % 2),
            2,
            5 - (k % 2),
            [P.galR, P.galB, P.galY, P.galG, P.galN][k]!
          );
      }
      // the desk
      const deskY = H - 13;
      const d0 = c - 14;
      const d1 = Math.min(W - 3, c + 25);
      f.hline(d0, d1, deskY, P.deskHi);
      f.rect(d0, deskY + 1, d1 - d0 + 1, 2, P.desk);
      f.vline(d0 + 1, deskY + 3, floorY - 1, P.deskSh);
      f.vline(d1 - 1, deskY + 3, floorY - 1, P.deskSh);
      // the monitor, scrolling code as he types
      const sw = 26;
      const sh = 15;
      const sx0 = c - 1;
      const sy0 = deskY - sh - 4;
      f.rect(sx0 - 1, sy0 - 1, sw + 2, sh + 2, P.bezel);
      f.rect(sx0, sy0, sw, sh, P.screen);
      f.vline(sx0 + 12, sy0 + sh + 1, deskY - 1, P.bezel);
      f.vline(sx0 + 13, sy0 + sh + 1, deskY - 1, P.bezel);
      f.hline(sx0 + 9, sx0 + 16, deskY - 1, P.bezel);
      const tickAge = age - 2600;
      const scroll = Math.min(age, 2600) / 140;
      const top = Math.floor(scroll);
      const lines = Math.floor(sh / 2);
      for (let r = 0; r < lines; r++) {
        const n = top + r;
        const last = r === lines - 1;
        codeLine(
          n,
          sx0 + 1,
          sy0 + 1 + r * 2,
          sx0 + sw - 1,
          f,
          last ? Math.floor((scroll - top) * 14) : Infinity
        );
      }
      if (tickAge < 0 && Math.floor(age / 250) % 2)
        f.set(sx0 + 2, sy0 + 1 + (lines - 1) * 2, P.fwWhite); // the cursor
      // the keyboard, a mug, a plant
      f.hline(c - 9, c + 3, deskY - 1, P.keys);
      for (let k = c - 8; k < c + 3; k += 2) f.set(k, deskY - 1, P.keysSh);
      f.rect(sx0 + sw + 1, deskY - 3, 2, 3, P.yacht);
      f.set(sx0 + sw + 3, deskY - 2, P.yachtSh);
      if (d1 - (sx0 + sw) > 7) {
        f.rect(d1 - 3, deskY - 3, 3, 3, P.pot);
        f.set(d1 - 3, deskY - 5, P.plant);
        f.set(d1 - 1, deskY - 6, P.plant);
        f.set(d1 - 2, deskY - 4, P.plantDk);
        f.set(d1 - 2, deskY - 7, P.plant);
      }
      // the coder, typing away; then arms up
      const mX = c - 19;
      const mY = floorY - 15;
      const cheer = age >= 2750;
      const hop = cheer && Math.floor(age / 160) % 2 ? -1 : 0;
      spr(f, DESK_MAN, mX, mY + hop, MAN_PAL);
      if (cheer) {
        // arms up! fists in the air
        const y1 = mY - 5 + hop;
        arm(f, mX + 3, mY + 6 + hop, mX, y1, P.mSkin, P.mTee);
        arm(f, mX + 5, mY + 6 + hop, mX + 9, y1, P.mSkin, P.mTee);
        f.rect(mX - 1, y1 - 1, 2, 2, P.mSkin);
        f.rect(mX + 9, y1 - 1, 2, 2, P.mSkin);
      } else {
        const tap = Math.floor(age / 90) % 2;
        arm(f, mX + 4, mY + 7, c - 8 + tap, deskY - 2 - tap, P.mSkin, P.mTee);
        arm(
          f,
          mX + 5,
          mY + 7,
          c - 4 - tap,
          deskY - 2 - (1 - tap),
          P.mSkin,
          P.mTee
        );
      }
      // the screen lights his face
      f.blend(mX + 6, mY + 3 + hop, P.monGlow, 0.5);
      f.blend(mX + 6, mY + 4 + hop, P.monGlow, 0.3);
      // the tick: a flash, then a big green check bursting out of the screen
      if (tickAge >= 0) {
        if (tickAge < 90) f.rect(sx0, sy0, sw, sh, P.tickHi);
        else
          for (let y = sy0; y < sy0 + sh; y++)
            for (let x = sx0; x < sx0 + sw; x++) f.blend(x, y, P.screen, 0.6);
        const s =
          tickAge < 160
            ? 0.4 + (tickAge / 160) * 0.85
            : tickAge < 300
              ? 1.25 - ((tickAge - 160) / 140) * 0.25
              : 1;
        const mx0 = sx0 + sw / 2;
        const my0 = sy0 + sh / 2;
        const pts = [
          [-0.34, 0.02],
          [-0.08, 0.36],
          [0.38, -0.36],
        ].map(([u, v]) => [mx0 + u! * sw * s, my0 + v! * sw * s] as const);
        const thick = (r: number, col: RGB) => {
          for (let i = 0; i < 2; i++) {
            const [ax, ay] = pts[i]!;
            const [bx, by] = pts[i + 1]!;
            const n = Math.ceil(Math.hypot(bx - ax, by - ay));
            for (let k = 0; k <= n; k++)
              f.disc(
                ax + ((bx - ax) * k) / n,
                ay + ((by - ay) * k) / n,
                r,
                col
              );
          }
        };
        thick(2.2 * Math.max(0.7, s), P.tickEdge);
        thick(1.2 * Math.max(0.7, s), P.tick);
        f.set(pts[1]![0] - 1, pts[1]![1] - 1, P.tickHi);
        // rays off the screen
        if (tickAge < 600) {
          const p = tickAge / 600;
          for (let i = 0; i < 12; i++) {
            const ang = (i / 12) * Math.PI * 2;
            for (let d = 0; d < 3; d++) {
              const r = 10 + p * 26 + d * 2;
              f.set(
                mx0 + Math.cos(ang) * r,
                my0 + Math.sin(ang) * r * 0.75,
                d ? P.tick : P.tickHi
              );
            }
          }
        }
      }
    }
    /** Copies the room into the inset, scaled, with a gallarija frame. */
    function drawInset(f: Frame, age: number) {
      const r = insetRect(age);
      if (r) {
        const g = GALS[0]!;
        // a soft shadow, then the scaled-up room
        for (let y = r.y + 2; y < r.y + r.h + 3; y++)
          for (let x = r.x + 2; x < r.x + r.w + 3; x++)
            f.blend(x, y, P.st6, 0.35);
        if (r.o > 0.12) {
          drawRoom(age);
          const src = room.pixels;
          for (let y = 0; y < r.h; y++) {
            const sy = Math.min(roomH - 1, Math.floor((y * roomH) / r.h));
            const ty = r.y + y;
            if (ty < 0 || ty >= h) continue;
            for (let x = 0; x < r.w; x++) {
              const tx = r.x + x;
              if (tx < 0 || tx >= w) continue;
              const sx = Math.min(roomW - 1, Math.floor((x * roomW) / r.w));
              f.pixels[ty * w + tx] = src[sy * roomW + sx]!;
            }
          }
        } else f.rect(r.x, r.y, r.w, r.h, P.monGlow);
        // the wooden frame of the balcony window, and its little roof
        const fr = r.o > 0.5 ? 2 : 1;
        for (let k = 0; k < fr; k++) {
          const col = k === 0 ? g.c : g.hi;
          f.hline(r.x - 1 - k, r.x + r.w + k, r.y - 1 - k, col);
          f.hline(r.x - 1 - k, r.x + r.w + k, r.y + r.h + k, col);
          f.vline(r.x - 1 - k, r.y - 1 - k, r.y + r.h + k, col);
          f.vline(r.x + r.w + k, r.y - 1 - k, r.y + r.h + k, col);
        }
        if (r.o > 0.5) {
          f.hline(r.x - 4, r.x + r.w + 3, r.y - 4, g.hi);
          f.hline(r.x - 3, r.x + r.w + 2, r.y - 3, g.c);
        }
      }
      // confetti out of the window, over the street
      const ca = age - 2800;
      if (ca >= 0) {
        const t = ca / 1000;
        const kd = 1.8;
        const e = (1 - Math.exp(-kd * t)) / kd;
        const cols = [
          P.fwRed,
          P.fwYel,
          P.fwCyan,
          P.fwPink,
          P.fwGreen,
          P.luzBlue,
          P.fwWhite,
          P.fwPurple,
        ];
        const fade = Math.min(1, (BALCONY_FOR - age) / 700);
        for (let i = 0; i < 160 + 60 * jk; i++) {
          const side = hash2(i, 1, 93);
          const u = hash2(i, 2, 93);
          let x0: number;
          let y0: number;
          let vx: number;
          let vy: number;
          const sp = (25 + hash2(i, 3, 93) * 60) * (0.6 + jk * 0.4);
          if (side < 0.3) {
            x0 = insetX;
            y0 = insetY + u * insetH;
            vx = -sp;
            vy = -30 - hash2(i, 4, 93) * 50;
          } else if (side < 0.6) {
            x0 = insetX + insetW;
            y0 = insetY + u * insetH;
            vx = sp;
            vy = -30 - hash2(i, 4, 93) * 50;
          } else {
            x0 = insetX + u * insetW;
            y0 = side < 0.8 ? insetY : insetY + insetH;
            vx = (u - 0.5) * sp * 1.6;
            vy = side < 0.8 ? -sp : -20 + hash2(i, 4, 93) * 30;
          }
          const vt = 10 + hash2(i, 5, 93) * 12;
          const x = x0 + vx * e + Math.sin(t * 5 + i) * 1.5;
          const y = y0 + vt * t + (vy - vt) * e;
          const c = cols[i % cols.length]!;
          // each piece flutters: flat, edge on, flat (bigger pieces when
          // the close-up is drawn at 2x)
          const turn = Math.floor(ca / 120 + i) % 3;
          if (fade < 1 && hash2(i, 6, 93) > fade) continue;
          const pw = turn === 1 ? jk : jk + 1;
          const ph = turn === 1 ? jk + 1 : turn === 0 && i % 2 ? jk : 1;
          f.rect(Math.round(x), Math.round(y), pw, ph, c);
        }
      }
    }
    /** The glow of a monitor in the gallarija, flickering. */
    function balconyGlow(f: Frame, t: number) {
      const a = 0.26 + 0.16 * Math.sin(t / 520);
      for (let dy = -4; dy <= 7; dy++)
        for (let dx = -7; dx <= 7; dx++) {
          if (Math.abs(dx) <= 4 && dy >= -1 && dy <= 4) continue;
          const d = Math.hypot(dx / 7, (dy - 1.5) / 5.5);
          if (d < 1) f.blend(jx + dx, jy + dy, P.monGlow, a * (1 - d));
        }
      const flick = Math.sin(t / 130) * Math.sin(t / 410) > 0.25;
      for (const gx of [jx - 2, jx - 1, jx + 1, jx + 2]) {
        f.set(gx, jy + 1, flick && gx < jx ? P.monGlow2 : P.monGlow);
        f.set(gx, jy + 2, P.monGlow);
      }
      f.set(jx + 1, jy + 2, P.mHair); // someone at a desk in there
      f.set(jx + 2, jy + 2, P.monGlow2);
    }

    // ---------- clicks ----------
    let bellsAt = -Infinity;
    const onDome = (x: number, y: number) =>
      (Math.abs(x - domeX) < 15 && y > 6 && y < 58) ||
      (Math.abs(x - spireX) < 5 && y > 2 && y < 58);
    const boatAt = (x: number, y: number) =>
      boats.findIndex((b) => {
        const bb = boatBox(b);
        return x >= bb.x0 && x <= bb.x1 && y >= bb.y0 && y <= bb.y1;
      });

    function smokePuff(t: number, x: number, y: number, seed: number) {
      fxBack.add(t, 6500, (f, age) => {
        const a = age / 6500;
        for (let i = 0; i < 5; i++) {
          const ang = hash2(i, 1, seed) * Math.PI * 2;
          const d = 4 + hash2(i, 2, seed) * 6;
          const r = 2 + a * 6 * (0.6 + hash2(i, 3, seed) * 0.5);
          const px = x + Math.cos(ang) * d * (0.6 + a) + a * 18;
          const py = y + Math.sin(ang) * d * 0.6 * (0.6 + a) - a * 6;
          for (let dy = -r; dy <= r; dy++)
            for (let dx = -r; dx <= r; dx++) {
              const q = Math.hypot(dx, dy) / r;
              if (q > 1) continue;
              f.blend(
                px + dx,
                py + dy,
                dy > r * 0.3 ? P.smokeSh : P.smoke,
                (1 - a) * (q < 0.6 ? 0.55 : 0.3)
              );
            }
        }
      });
    }

    function bells(t: number) {
      const since = t - bellsAt;
      if (since < 3000) return; // still ringing
      bellsAt = t;
      if (since <= 6000) return; // the pigeons haven't come back yet
      flock(fx, t, domeX, 20, P.pigeon, {
        count: 7,
        seed: Math.round(t) % 50,
        dir: 1,
      });
      flock(fx, t + 150, spireX, 30, P.pigeon, {
        count: 4,
        seed: (Math.round(t) % 50) + 3,
        dir: -1,
      });
    }

    let lastT = 0;
    const meeting = (t: number) => t - meetAt >= 0 && t - meetAt < MEET_FOR;
    const tripping = (t: number) => t - eyeAt >= 0 && t - eyeAt < LUZ_FOR;
    const working = (t: number) =>
      t - balconyAt >= 0 && t - balconyAt < BALCONY_FOR;
    const onHer = (x: number, y: number, t: number) => {
      const s = herSpot(t);
      return Math.hypot(x - s.x, y - s.y) <= HER_R;
    };
    // the boats in order, the far ones first
    const boatOrder = boats
      .map((b, i) => i)
      .sort((a, b) => boats[a]!.y - boats[b]!.y);

    return {
      render(f, t) {
        lastT = t;
        const mAge = t - meetAt;
        const gold = meeting(t) ? goldAt(mAge) : 0;
        f.copyFrom(sky);
        f.over(cloudLayer, Math.round(t / 1500), 0, true);
        fxBack.draw(f, t);
        if (gold > 0) skyToSunset(f, gold * 0.85);
        f.over(city);
        balconyGlow(f, t);
        // the bells: one swings in the belfry, rings of sound spread out
        const ba = t - bellsAt;
        const ringing = ba < 3000;
        const swing = ringing ? Math.round(Math.sin(ba / 160) * 1.4) : 0;
        // kept inside the belfry opening as it swings
        for (const y of [37, 38])
          f.hline(
            Math.max(spireX - 1, spireX - 1 + swing),
            Math.min(spireX + 1, spireX + 1 + swing),
            y,
            P.bell
          );
        f.set(spireX + swing, 36, P.bell);
        f.set(spireX + swing, 39, P.luzYelDk);
        if (ringing) {
          for (let k = 0; k < 4; k++) {
            const a = (ba - k * 520) / 1300;
            if (a < 0 || a > 1) continue;
            const r = 5 + a * 18;
            for (let s = 0; s < 40; s++) {
              const ang = (s / 40) * Math.PI * 2;
              if (Math.abs(Math.sin(ang)) > 0.8) continue; // arcs to either side
              const px = spireX + Math.cos(ang) * r;
              const py = 38 + Math.sin(ang) * r * 0.75;
              f.blend(px, py, P.bell, (1 - a) * 0.9);
              f.blend(
                px + Math.sign(Math.cos(ang)),
                py,
                P.fwWhite,
                (1 - a) * 0.5
              );
            }
          }
        }
        // pigeons sit on the dome until the bells go
        if (ba > 6000)
          for (const [px, py] of pigeons)
            f.set(px, py + (Math.sin(t / 700 + px) > 0.95 ? -1 : 0), P.pigeon);
        // people on the quay, and the bus
        for (const p of walkers) {
          const span = w + 20;
          const x =
            Math.round((((p.off + t * p.speed) % span) + span) % span) - 10;
          const step = Math.floor(t / 240 + p.off) % 2;
          f.vline(x, QUAY - 5, QUAY - 2, p.shirt);
          f.set(x, QUAY - 6, P.person);
          f.set(x + (step ? 1 : 0), QUAY - 1, P.person);
          f.set(x - (step ? 0 : 1), QUAY - 1, P.person);
        }
        bus(f, t);
        // the harbour: a broken, warm mirror of the walls, bluer towards us
        for (let y = WATER; y < h; y++) {
          const d = y - WATER;
          const wob = Math.round(Math.sin(y * 0.9 + t / 520) * (0.5 + d / 18));
          const keep = 0.78 - (d / (h - WATER)) * 0.62;
          const base = waterBase(d);
          // ripples two rows tall, drifting alternately left and right
          const band = y >> 1;
          const drift = (t / 2600) * (band % 2 ? 1 : -1) + band * 0.71;
          const scale = 1 / (7 + d * 0.3);
          const row = d * w;
          // (the paving covers the bottom rows, all but the rocks' end)
          for (let x = y >= PAVE ? rx0 : 0; x < w; x++) {
            const n = noise1(x * scale + drift, band);
            f.set(
              x,
              y,
              n > keep
                ? base
                : mirror[row + Math.min(w - 1, Math.max(0, x + wob))]!
            );
          }
        }
        // glints of the low sun on the ripples
        for (let i = 0; i < w / 5; i++) {
          const y = WATER + 2 + Math.floor(hash2(i, 1, 13) * (h - WATER - 3));
          const x = Math.floor(
            hash2(i, 0, 13) * w + Math.sin(t / 1700 + i) * 2
          );
          const life = Math.sin(t / 480 + hash2(i, 2, 13) * 40);
          if (life < 0.7) continue;
          f.hline(x, x + (y > 132 ? 2 : 1), y, life > 0.93 ? P.foam : P.glint);
        }
        // back to front: the ferry passes behind the moored yachts
        ferry(f, t);
        for (const y of yachts)
          yacht(
            f,
            y.x,
            y.y + Math.round(Math.sin(t / 1300 + y.x) * 0.5),
            y.L,
            y.mast
          );
        dghajsa(f, t);
        gulls(f, t);
        const eAge = t - eyeAt;
        const onTrip = tripping(t);
        for (const i of boatOrder) {
          const b = boats[i]!;
          const st = boatState(b, i, t);
          if (i === 0 && onTrip) {
            // the boat trip: out round the harbour and back
            const tr = trip(eAge);
            const tilt =
              st.tilt - 0.03 * tr.v + Math.sin(eAge / 140) * 0.012 * tr.v;
            const bob = st.bob + Math.sin(eAge / 170) * 0.7 * tr.v;
            const bb = { ...b, x: Math.round(tr.x) };
            boatReflection(f, bb, bob, t);
            wake(f, eAge, Math.round(b.y + bob));
            luzzu(f, { ...bb, y: b.y + bob }, t, tilt, eAge, {
              pop: crewPop(eAge),
              t: eAge,
            });
            bowSpray(f, eAge, Math.round(b.y + bob));
            bbqSmoke(f, eAge);
            continue;
          }
          boatReflection(f, b, st.bob, t);
          const eyeAge = i === 0 ? eAge : Infinity;
          luzzu(f, { ...b, y: b.y + st.bob }, t, st.tilt, eyeAge);
        }
        // the promenade and the rocks, and the woman strolling along
        blitFront(f);
        lap(f, t);
        if (!meeting(t) || mAge > 7200) {
          const s = stroll(t);
          const a = meeting(t) ? Math.min(1, (mAge - 7200) / 500) : 1;
          drawHer(f, Math.round(s.x), s.dir, s.step, a, null, HER_PAL);
        }
        if (gold > 0) warmGrade(f, gold * 0.6);
        if (meeting(t)) drawMeet(f, mAge, gold);
        fx.draw(f, t);
        if (working(t)) drawInset(f, t - balconyAt);
      },
      poke(x, y, t) {
        // the eggs never restart while they play, and while one plays
        // clicks on it are its own
        if (meeting(t)) {
          if (inFront(x, y) || (y > sitY - 20 && x > meetX - 12)) return;
        } else if (onHer(x, y, t)) {
          const s = stroll(t);
          meetAt = t;
          meetX = Math.round(s.x);
          meetDir = s.dir;
          return;
        }
        if (working(t)) {
          const r = insetRect(t - balconyAt);
          if (
            r &&
            x >= r.x - 4 &&
            x <= r.x + r.w + 3 &&
            y >= r.y - 4 &&
            y <= r.y + r.h + 2
          )
            return;
        } else if (onWindow(x, y)) {
          balconyAt = t;
          return;
        }
        if (!tripping(t) && onEye(x, y, t)) {
          eyeAt = t;
          return;
        }
        const bi = boatAt(x, y);
        if (bi >= 0 && !(bi === 0 && tripping(t))) {
          if (t - rockAt[bi]! < 3200) return; // still rocking
          rockAt[bi] = t;
          const b = boats[bi]!;
          ripple(fx, t, b.x + b.L / 2, b.y + 1, P.foam, {
            rings: 3,
            size: b.L * 0.6,
            squash: 0.25,
          });
          return;
        }
        if (onDome(x, y)) {
          bells(t);
          return;
        }
        if (inFront(x, y)) return; // the promenade, the rocks
        if (y >= WATER) {
          ripple(fx, t, x, y, P.foam, { rings: 3, size: 10, squash: 0.3 });
          splash(fx, t, x, y, P.foam, Math.round(t));
          return;
        }
        if (!city.opaque(x, y)) {
          // a festa: daytime shells, bright bursts that leave puffs of smoke
          const seed = Math.floor(t) % 997;
          const colors = [
            [P.fwWhite, P.fwYel, P.fwRed, P.smoke],
            [P.fwWhite, P.fwPink, P.fwPurple, P.smoke],
            [P.fwWhite, P.fwYel, P.galY, P.smoke],
            [P.fwWhite, P.fwGreen, P.fwGreenDk, P.smoke],
            [P.fwWhite, P.fwRed, P.luzRedDk, P.smoke],
          ];
          for (let k = 0; k < 2; k++) {
            const bx =
              x +
              (k
                ? hash2(seed, 3, 2) > 0.5
                  ? 16
                  : -16
                : (hash2(seed, 1, 2) - 0.5) * 8);
            const by = Math.max(6, y + k * 10);
            festaShell(
              fxBack,
              t + k * 380,
              bx,
              70,
              by,
              colors[(seed + k * 2) % colors.length]!,
              seed + k
            );
            const rise = Math.min(900, Math.max(350, (70 - by) * 9));
            smokePuff(t + k * 380 + rise + 300, bx, by, seed + k);
          }
        }
      },
      hot(x, y) {
        const t = lastT;
        if (!meeting(t) && onHer(x, y, t)) return true;
        if (!working(t) && onWindow(x, y)) return true;
        if (!tripping(t) && onEye(x, y, t)) return true;
        if (inFront(x, y)) return false;
        const bi = boatAt(x, y);
        return (
          y >= WATER ||
          (bi >= 0 && !(bi === 0 && tripping(t))) ||
          onDome(x, y) ||
          !city.opaque(x, y)
        );
      },
      eggs(t) {
        const out: EggSpot[] = [];
        if (!meeting(t)) {
          const s = herSpot(t);
          out.push({ id: 'promenade', x: s.x, y: s.y, r: HER_R });
        }
        if (!working(t))
          out.push({ id: 'balcony', x: jx, y: jy + 2, r: BALCONY_R });
        if (!tripping(t)) {
          const [x, y] = eyeSpot(t);
          out.push({ id: 'luzzu-wink', x, y, r: EYE_R });
        }
        return out;
      },
    };
  },
};
