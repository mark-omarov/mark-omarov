// Gunma: the Tone River at Minakami on a hot summer day. A steep green gorge
// of broadleaf woods and pale granite boulders, a thin waterfall dropping
// through the trees, the twin summits of Tanigawa-dake at the head of the
// valley under a towering summer cloud, and a red railway arch across the
// side valley where the Joetsu line ducks from tunnel to tunnel. Down on the
// river, clear jade water fills a wide calm pool that spills out through a
// white-water rapid, and out on the pool are a man (red board, sunglasses)
// and a group of women on stand-up paddle boards. A kingfisher waits on a
// dead branch, dragonflies patrol the shallows, a kite circles overhead,
// and when there's room a rafting boat is pulled up on the near bank.
//
// Click the man's board: he wobbles, windmills and goes in backwards with a
// huge splash, his shades fly off and glint away down the rapid, he comes up
// squinting and climbs back on, and everyone else is pointing and laughing.
// And the river keeps its own secret: kappa, the river imps, love cucumbers,
// and somebody has left one on the rock by the bank. Click it: a kappa
// bursts out of the water, grabs it (hearts), munches it, and pushes a
// familiar pair of sunglasses up its beak with a glint you could see from
// the bridge.
//
// Everyday clicks: the water ripples and splashes; the woman in the cream
// top waves her paddle, the one in the cap wobbles, the one with the bun
// splashes another, the one in the straw hat waves; the kingfisher dives for
// a fish; the bridge brings the SL Gunma Minakami steam train puffing
// through.

import { Frame, lerpRGB, type RGB, sprite } from '../frame';
import { Fx, ripple } from '../fx';
import { fbm1, hash2, noise1, noise2 } from '../noise';
import { clouds, gradient } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';

const P = palette({
  // sky: deep summer blue overhead, pale and hazy down at the ridges
  sky0: '#2662cc',
  sky1: '#3274d8',
  sky2: '#4688e2',
  sky3: '#5e9fea',
  sky4: '#7cb6ee',
  sky5: '#9ccbf0',
  sky6: '#bcdcf0',
  cloudHi: '#ffffff',
  cloud: '#eef4fb',
  cloudSh: '#c8d8ec',
  // Tanigawa-dake, blue with distance
  mtnLit: '#b2ccd4',
  mtn: '#8eabbd',
  mtnSh: '#7290ab',
  mtnRock: '#5f7a95',
  mtnLow: '#86aab0',
  mtnLowSh: '#6e94a4',
  snow: '#f6fbfd',
  snowSh: '#d2e2ee',
  // hazy ridges and the woods down the side valley
  haze: '#87b0b8',
  hazeLit: '#a2c4c2',
  haze2: '#6c9ea0',
  haze2Lit: '#88b4a4',
  vDeep: '#2f6c5a',
  vDark: '#3f7f68',
  vMid: '#559470',
  vLit: '#73ac78',
  vHi: '#94c47e',
  // the gorge walls: the right one in full sun, the left one in shade
  sunDeep: '#1f5a36',
  sunDark: '#2f7438',
  sunMid: '#4f9c3a',
  sunLit: '#8cc63e',
  sunHi: '#cbe25a',
  shDeep: '#11382f',
  shDark: '#184c37',
  shMid: '#25683d',
  shLit: '#408a42',
  shHi: '#6aa848',
  cedar: '#173f33',
  cedarLit: '#2c5c3e',
  cedarSun: '#2a6a3a',
  // granite, gravel, grass
  graniteHi: '#fdf9ee',
  granite: '#e6e0d0',
  graniteMid: '#c9c3b4',
  graniteSh: '#a0a0a6',
  graniteDk: '#737888',
  crack: '#5a5f6e',
  gravel: '#d8d0bc',
  gravelSh: '#aea694',
  gravelDk: '#80796e',
  wet: '#6e7066',
  grass: '#6cb43c',
  grassHi: '#a8dc4a',
  grassDk: '#3a7a2e',
  // the bridge
  red: '#e0412b',
  redHi: '#ff8c5c',
  redMid: '#c02b24',
  redSh: '#7e1d26',
  concrete: '#d4cfc4',
  concreteSh: '#9a979a',
  portal: '#1c1c22',
  rail: '#4a4650',
  // water
  wFar: '#2a8676',
  wMid: '#2c9e90',
  wDeep: '#1f8584',
  wNear: '#38b29e',
  wShallow: '#58c6ae',
  sunk: '#5aa898',
  sunkHi: '#78bcaa',
  sunkSh: '#2a8a80',
  streak: '#8ee4d4',
  streakHi: '#c8f6ec',
  glint: '#ffffff',
  foam: '#ffffff',
  foamMid: '#dcf4f0',
  foamSh: '#a8dcd6',
  trough: '#24857c',
  troughDk: '#1a6a6c',
  shadow: '#156462',
  under: '#1c5e66',
  // people
  skin: '#eeb08c',
  skinSh: '#c07a5c',
  hair: '#16141a',
  // the man: short light-brown hair and beard in the summer sun, his shades
  mHair: '#8a6a48',
  mHairLit: '#b08a60',
  mHairSh: '#5e4630',
  beard: '#7a5a3c',
  lens: '#232633',
  lensHi: '#7a90aa',
  frame: '#121117',
  tee: '#34313c',
  teeHi: '#5c5866',
  logo: '#ff8a1e',
  shorts: '#3a62a8',
  shortsSh: '#284a86',
  wHair: '#17131a',
  wHairLit: '#4a3e48',
  wTop: '#f2e4cc',
  wTopSh: '#c8b294',
  leggings: '#2c2e3c',
  cap: '#f4f2ec',
  topA: '#f6c43a',
  topASh: '#c8902a',
  topB: '#f0708e',
  topBSh: '#c04a6a',
  topC: '#5ab0e0',
  topCSh: '#3a7ab0',
  straw: '#ecca7a',
  strawSh: '#b8904a',
  band: '#c83a3a',
  sweat: '#9ad8ff',
  dizzy: '#fff27a',
  // boards
  bMan: '#e0242c',
  bManSh: '#9a1620',
  pad: '#2a2a32',
  bWoman: '#f4f6f2',
  bWomanSh: '#b8c4c4',
  padTeal: '#25a8b0',
  bYellow: '#ffd23e',
  bYellowSh: '#c8942a',
  bLime: '#9ee04a',
  bLimeSh: '#5e9a2e',
  bBlue: '#3a8ae8',
  bBlueSh: '#2a5ab0',
  padGrey: '#6a6a76',
  shaft: '#2a2c34',
  blade: '#16181e',
  // the kappa and its cucumber
  kGreen: '#5cbc4a',
  kLit: '#9ae070',
  kSh: '#2f8a3e',
  kDark: '#1c5a34',
  kBeak: '#f8b630',
  kBeakSh: '#c8781a',
  kShell: '#8a6a2e',
  kShellHi: '#b8914a',
  kShellSh: '#5a4220',
  kBelly: '#eae29a',
  kBellySh: '#c8be70',
  kDish: '#f6f4ea',
  kDishWater: '#9ae2f2',
  kHair: '#2a6a4e',
  heart: '#ff5a8a',
  heartHi: '#ffb4c8',
  cuke: '#2f8a2a',
  cukeHi: '#86d05a',
  cukeDk: '#174a1c',
  cukeWart: '#d6f0a0',
  cukeStalk: '#a8a050',
  cukeFlower: '#ffd84a',
  // creatures
  kfBack: '#1ab0ec',
  kfWing: '#1462b4',
  kfBelly: '#f2842e',
  kfBill: '#18181e',
  kfThroat: '#f4f0e6',
  fish: '#e4eef4',
  flyBlue: '#5aa0e0',
  flyRed: '#e8502a',
  flyDark: '#1e2a3c',
  wing: '#f0f8ff',
  raft: '#f0782a',
  raftHi: '#ffb070',
  raftSh: '#a84a1a',
  raftIn: '#2a2a34',
  kite: '#4a3a30',
  kiteHi: '#7a6450',
  branch: '#4a3a2e',
  branchHi: '#86705a',
  // trains
  steel: '#c8ccd4',
  steelHi: '#eef0f4',
  steelSh: '#8a8e9a',
  stripeO: '#f08a24',
  stripeG: '#2e9a4a',
  winDark: '#2a3444',
  locoBlack: '#1c1c24',
  locoHi: '#4e4e5e',
  locoRed: '#d02a2a',
  brass: '#e8c060',
  coach: '#6a3424',
  coachHi: '#94523a',
  coachWin: '#f2e2b0',
  steam: '#f6f6f6',
  steamSh: '#c8d0d8',
  smoke: '#5e5e68',
  smokeHi: '#8a8a94',
  lamp: '#fff2b0',
});

const DECK = 56; // the rails on the bridge
const FLOOR = 86; // where the gorge walls meet the valley floor
const BANK = 96; // the far waterline
const ROW_FAR = 113; // waterline under the far boards
const ROW_NEAR = 131; // and under the near ones

type Style = { deep: RGB; dark: RGB; mid: RGB; lit: RGB; hi: RGB };
const SUNNY: Style = {
  deep: P.sunDeep,
  dark: P.sunDark,
  mid: P.sunMid,
  lit: P.sunLit,
  hi: P.sunHi,
};
const SHADY: Style = {
  deep: P.shDeep,
  dark: P.shDark,
  mid: P.shMid,
  lit: P.shLit,
  hi: P.shHi,
};
const VALLEY: Style = {
  deep: P.vDeep,
  dark: P.vDark,
  mid: P.vMid,
  lit: P.vLit,
  hi: P.vHi,
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const clamp01 = (v: number) => clamp(v, 0, 1);
const ease = (u: number) => {
  const v = clamp01(u);
  return v * v * (3 - 2 * v);
};

// ---------- people ----------
// Sprites face right (flipped for left). Arms and paddles are drawn on top.
// H hair  h hair lit  s skin  S skin shade  L lens  g glasses frame
// T top  t top lit/shade  O logo  B bottoms  b bottoms shade  C cap/hat
// c hat shade  r hat band  D hair shade  d beard

/**
 * The man: short light-brown hair and beard, dark sunglasses, a charcoal tee
 * with an orange logo.
 */
const MAN = [
  '..HhH.',
  '.HHHhH',
  '.DLgLs',
  '.Ddsss',
  '..ddd.',
  '.TTTT.',
  '.TTOT.',
  '.TTTT.',
  '..TTt.',
  '.BBBB.',
  '.BB.b.',
  '.s..s.',
  '.s..s.',
  '.s..s.',
  'ss..ss',
];
/** The man without his sunglasses, squinting in the sun. */
const MAN_SQUINT = MAN.map((r, i) => (i === 2 ? '.DSsSs' : r));
/** Back on the board on his knees. */
const MAN_KNEEL = [
  '..HhH.',
  '.HHHhH',
  '.DSsSs',
  '.Ddsss',
  '..ddd.',
  '.TTTT.',
  '.TTOT.',
  '.TTTT.',
  '.BBBB.',
  'BBBBss',
  'ss....',
];
/** Just his head, above the water, eyes screwed up. */
const MAN_HEAD = ['.HhH.', 'HHHhH', 'DSsSD', '.ddd.'];
/** A woman: long, straight, near-black hair, a cream top, dark leggings. */
const WOMAN = [
  '..hHH.',
  '.hHHHH',
  '.hHsss',
  '.HHsss',
  '.HHss.',
  '.HTTT.',
  '.tTTT.',
  '.tTTT.',
  '..TTT.',
  '.BBBB.',
  '.BB.B.',
  '.B..B.',
  '.B..B.',
  '.s..s.',
  'ss..ss',
];
/** A woman in a white cap. */
const CAPPED = [
  '.CCC..',
  '.CCCCC',
  '.HSsss',
  '.Hsss.',
  '..ss..',
  '.TTTT.',
  '.tTTT.',
  '.tTTT.',
  '..TTT.',
  '.BBBB.',
  '.BB.B.',
  '.s..s.',
  '.s..s.',
  '.s..s.',
  'ss..ss',
];
/** A woman with her hair up in a bun. */
const BUN = [
  'HH....',
  'HHHHH.',
  '.HHHHs',
  '.HHsss',
  '..ss..',
  '.TTTT.',
  '.tTTT.',
  '.tTTT.',
  '..TTT.',
  '.BBBB.',
  '.BB.B.',
  '.s..s.',
  '.s..s.',
  '.s..s.',
  'ss..ss',
];
/** A woman in a straw hat, sitting on her board with her feet in the river. */
const SITTER = [
  '..ccc...',
  '.CCCCC..',
  'CrrrrrC.',
  '..Hss...',
  '..sss...',
  '.TTTT...',
  '.tTTT...',
  '.tTTTs..',
  '.BBBBBss',
];

// ---------- the kappa ----------
// Front on, so you can see whose sunglasses it has on. 15 x 21.
// d dish rim  W the water in the dish  h hair  l green lit  G green
// k green shade  o shades frame  L dark lens  w lens shine  b beak  B beak
// shade  s shell  S shell rim  y belly plate  Y belly plate lines
const KAPPA = [
  '.....ddddd.....',
  '....dWWWWWd....',
  '...hddWWWddh...',
  '..hhhdddddhhh..',
  '..hlGGGGGGGGkh.',
  '.hlGGGGGGGGGkh.',
  '.loooooooooook.',
  '.loLwLLoLwLLok.',
  '.lGLLwLGLLwLGk.',
  '.lGGLLGGGLLGGk.',
  '.lGGGGbbbGGGGk.',
  '..GGGbbBbbGGk..',
  '...kGGbBbGGk...',
  '....kkGGGkk....',
  '..sssyyyyysss..',
  '.SssyYyyyYyssS.',
  '.SsyyyYYYyyysS.',
  '..SsyyyyyyysS..',
  '...SsyyyyysS...',
  '....GGG.GGG....',
  '...GGGG.GGGG...',
];
const KAPPA_LOOK: Record<string, RGB> = {
  d: P.kDish,
  W: P.kDishWater,
  h: P.kHair,
  l: P.kLit,
  G: P.kGreen,
  k: P.kSh,
  o: P.frame,
  L: P.lens,
  w: P.lensHi,
  b: P.kBeak,
  B: P.kBeakSh,
  s: P.kShell,
  S: P.kShellSh,
  y: P.kBelly,
  Y: P.kBellySh,
};
/** An orange river raft, pulled up on the bank with its paddles. */
const RAFT = [
  '...hhhhhhhhhhhhhhhhhhh...',
  '..hrrrrrrrrrrrrrrrrrrrh..',
  '.hrkkkkrkkkkkrkkkkkkkrrh.',
  '.rrkkkkrkkkpppppppkkkkrr.',
  'hhhhhhhhhhhhhhhhhhhhhhhbb',
  'rrrrrrrkrrrrrkrrrrrkrrrrr',
  '.sssssssssssssssssssssss.',
];
const HEART = [
  '.hh.hh.',
  'hHHhhhh',
  'hHhhhhh',
  '.hhhhh.',
  '..hhh..',
  '...h...',
];

// The man's sunglasses on their own, spinning: front on, turning, edge on.
const GLASSES = [
  ['ooooooo', 'oLwoLwo', '.LL.LL.'],
  ['ooooo', 'oLoLo', '.L.L.'],
  ['.o.', 'ooo', '.o.'],
];
const GLASS_LOOK = { o: P.frame, L: P.lens, w: P.lensHi };

/** A kingfisher on its perch, facing right. */
const KINGFISHER = ['..bb...', '.bbbtkk', 'wwbooo.', 'wwooo..', 'w......'];
const KF_LOOK = {
  b: P.kfBack,
  t: P.kfThroat,
  k: P.kfBill,
  w: P.kfWing,
  o: P.kfBelly,
};

type Look = Record<string, RGB>;
const MAN_LOOK: Look = {
  H: P.mHair,
  h: P.mHairLit,
  D: P.mHairSh,
  d: P.beard,
  s: P.skin,
  S: P.skinSh,
  L: P.lens,
  g: P.frame,
  T: P.tee,
  t: P.teeHi,
  O: P.logo,
  B: P.shorts,
  b: P.shortsSh,
};
const WOMAN_LOOK: Look = {
  H: P.wHair,
  h: P.wHairLit,
  s: P.skin,
  S: P.skinSh,
  T: P.wTop,
  t: P.wTopSh,
  B: P.leggings,
};

type BoardLook = { top: RGB; side: RGB; pad: RGB };

type Who = 'man' | 'woman' | 'cap' | 'bun' | 'sitter';
type Paddler = {
  who: Who;
  x0: number;
  row: number; // waterline
  dir: 1 | -1;
  rows: string[];
  look: Look;
  board: BoardLook;
  ph: number;
};

/**
 * A splash you can see from the bridge: a flash of spray, a crown of water
 * thrown up round the hole, a thick white jet, drops flung out wide, and a
 * patch of foam left behind.
 */
function bigSplash(
  fx: Fx,
  t: number,
  x: number,
  y: number,
  size: number,
  seed: number
) {
  const n = Math.round(20 + size * 3.5);
  fx.add(t, 2200, (f, age) => {
    const a = age / 1000;
    // spray hanging in the air for a moment, brightening everything
    if (age < 600) {
      const al = 0.4 * (1 - age / 600);
      const R = size * (1.4 + a * 2.2);
      for (let dy = -Math.round(R * 1.1); dy <= 1; dy++)
        for (let dx = -Math.round(R); dx <= R; dx++) {
          const d = Math.hypot(dx / R, dy / (R * 1.1));
          if (d < 1) f.blend(x + dx, y + dy, P.foam, al * (1 - d * d));
        }
    }
    // the crown: walls of water thrown up round the hole, flaring out
    if (age < 950) {
      const q = age / 950;
      const r = size * (0.35 + q * 0.85);
      const ht = size * 1.35 * Math.sin(q * Math.PI);
      for (const s of [-1, 1])
        for (let k = 0; k < 3; k++) {
          const hh = ht * (1 - k * 0.22);
          for (let j = 0; j < hh; j++) {
            const xx = x + s * (r + k + (j * j) / (hh * 2.2));
            f.set(xx, y - j, k === 1 ? P.foam : P.foamMid);
          }
          // drops breaking off the rim
          if (hh > 3) f.set(x + s * (r + k + hh / 2 + 1), y - hh - 1, P.foam);
        }
    }
    // the jet, shooting up out of the middle and collapsing
    if (age > 100 && age < 1050) {
      const q = (age - 100) / 950;
      const ht = size * 2.7 * Math.sin(q * Math.PI);
      for (let k = 0; k < ht; k++) {
        const half = Math.round((1 - k / ht) * size * 0.24 + 0.8);
        f.hline(x - half, x + half, y - k, P.foam);
        f.set(x + half, y - k, P.foamSh);
        f.set(x - half, y - k, P.foamMid);
      }
      f.disc(x, y - ht, Math.max(1, size * 0.2), P.foam);
    }
    // drops flung out on arcs
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + (hash2(i, 1, seed) - 0.5) * 2.7;
      const sp = size * (3.4 + hash2(i, 2, seed) * 4.6);
      const px = x + Math.cos(ang) * sp * a;
      const py = y + Math.sin(ang) * sp * a + 80 * a * a;
      if (py > y + 1) continue;
      f.set(px, py, i % 3 ? P.foam : P.streakHi);
      if (i % 2 === 0) f.set(px, py + 1, P.foamMid);
      if (i % 4 === 0) f.set(px + 1, py, P.foamMid);
    }
    // foam left lying on the water, slowly breaking up
    const fr = size * 1.5 * (1 - a / 2.2);
    if (fr > 1)
      for (let dy = -1; dy <= 2; dy++) {
        const half = Math.round(fr * (dy === 0 ? 1 : dy === 1 ? 0.8 : 0.5));
        for (let xx = x - half; xx <= x + half; xx++)
          if (hash2(xx, dy, seed + Math.floor(age / 300)) > a * 0.35)
            f.set(xx, y + dy, dy <= 0 ? P.foam : P.foamMid);
      }
  });
}

/** Rings spreading out over the water, drawn crisp (not faded dots). */
function rings(
  fx: Fx,
  t: number,
  x: number,
  y: number,
  maxR: number,
  count: number,
  seed: number
) {
  const life = 2400;
  fx.add(t, life + count * 260, (f, age) => {
    for (let k = 0; k < count; k++) {
      const b = age - k * 260;
      if (b < 0 || b > life) continue;
      const p = b / life;
      const r = 2 + (1 - (1 - p) * (1 - p)) * maxR * (1 - k * 0.12);
      const steps = Math.ceil(r * 7);
      const c = p < 0.45 ? P.foamMid : P.streakHi;
      for (let s = 0; s < steps; s++) {
        // broken up a little more as it fades
        if (hash2(s >> 2, k, seed) < p * 0.7) continue;
        const ang = (s / steps) * Math.PI * 2;
        const yy = y + Math.sin(ang) * r * 0.28;
        if (p < 0.6) f.set(x + Math.cos(ang) * r, yy, c);
        else f.blend(x + Math.cos(ang) * r, yy, c, (1 - p) * 2.2);
      }
    }
  });
}

export const gunma: Scene = {
  id: 'gunma',
  name: 'Gunma',
  country: 'Japan',
  create(w, h) {
    const fx = new Fx(); // on the water, under the people
    const fxTop = new Fx(); // splashes and spray, over everything
    const cx = w / 2;
    // the side valley and the bridge over it, a touch right of centre
    const gx = Math.round(cx + Math.min(22, w * 0.05));
    const floorHalf = Math.round(clamp(w * 0.13, 18, 80));
    // the rapid's drop line where it meets the far bank
    const rapidX = Math.round(w - clamp(w * 0.2, 34, 110));
    // the rock with the cucumber on it, near the left bank
    const kx = Math.round(Math.max(24, cx - Math.min(150, w * 0.36)));
    const poolL = kx + 16;
    const poolR = rapidX - 12;

    // ---------- the gorge walls ----------
    const wallL = (x: number) => {
      const u = gx - floorHalf - x;
      if (u <= 0) return FLOOR + 10;
      const rise = 1 - Math.exp(-u / 20);
      return (
        FLOOR -
        rise * 70 -
        (fbm1(x / 12, 3) - 0.5) * 16 * (1 - Math.exp(-u / 10))
      );
    };
    const wallR = (x: number) => {
      const u = x - gx - floorHalf;
      if (u <= 0) return FLOOR + 10;
      const rise = 1 - Math.exp(-u / 19);
      return (
        FLOOR -
        rise * 64 -
        (fbm1(x / 12, 5) - 0.5) * 16 * (1 - Math.exp(-u / 10))
      );
    };
    const wallTop = (x: number) => Math.min(wallL(x), wallR(x));

    // where the bridge goes into the hillsides, and where the arch springs
    let bL = gx;
    while (bL > 8 && wallL(bL) > DECK - 9) bL--;
    let bR = gx;
    while (bR < w - 9 && wallR(bR) > DECK - 9) bR++;
    const SPRING = DECK + 25;
    let sL = gx;
    while (sL > 0 && wallL(sL) > SPRING) sL--;
    let sR = gx;
    while (sR < w - 1 && wallR(sR) > SPRING) sR++;
    const archMid = (sL + sR) / 2;
    const archHalf = (sR - sL) / 2;
    const archY = (x: number) =>
      SPRING - (SPRING - DECK - 5) * (1 - ((x - archMid) / archHalf) ** 2);

    /** Woods seen from across the river: lots of shaded round crowns. */
    function forest(
      f: Frame,
      inside: (x: number, y: number) => boolean,
      styleAt: (x: number, y: number) => Style,
      seed: number,
      size: number,
      y0 = 0
    ) {
      const step = Math.max(2, Math.round(size * 1.15));
      const blobs: [number, number, number][] = [];
      for (let gy = y0; gy < BANK + 4; gy += step)
        for (let gx2 = -size; gx2 < w + size; gx2 += step) {
          const jx = gx2 + Math.round((hash2(gx2, gy, seed) - 0.5) * step);
          const jy = gy + Math.round((hash2(gx2, gy, seed + 1) - 0.5) * step);
          if (!inside(jx, jy)) continue;
          blobs.push([jx, jy, size * (0.7 + hash2(gx2, gy, seed + 2) * 0.6)]);
        }
      blobs.sort((a, b) => a[1] - b[1]);
      for (const [bx, by, r] of blobs) {
        const s = styleAt(bx, by);
        const kind = hash2(bx, by, seed + 3);
        f.disc(bx, by, r, (dx, dy) => {
          const l = (dx + dy * 1.3) / r;
          // the odd darker crown (an oak, a cedar) among the bright ones
          if (kind > 0.86) return l < -0.3 ? s.mid : l > 0.5 ? s.deep : s.dark;
          if (l < -0.75) return s.hi;
          if (l < -0.25) return s.lit;
          if (l > 0.65) return s.dark;
          return s.mid;
        });
      }
    }

    // ---------- sky ----------
    const sky = layer(w, h, (f) => {
      gradient(f, 0, FLOOR, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
      ]);
      f.rect(0, FLOOR, w, h - FLOOR, P.sky6);
    });
    const cloudLayer = layer(w, h, (f) => {
      clouds(f, {
        seed: 23,
        y0: 2,
        y1: 20,
        cell: 6,
        coverage: 0.26,
        stretch: 4,
        style: { light: P.cloudHi, base: P.cloud, shadow: P.cloudSh },
      });
    });

    // ---------- far: the summer cloud, Tanigawa, the side valley ----------
    const tgX = gx + 2;
    const mouthHalf = Math.max(4, Math.round(floorHalf * 0.4));
    const far = layer(w, h, (f) => {
      // a towering summer cumulus behind the mountain
      const ccx = Math.round(Math.min(w - 26, tgX + clamp(w * 0.17, 34, 96)));
      const blobs: [number, number, number][] = [];
      for (let i = 0; i < 30; i++) {
        const v = i / 29; // 0 at the base, 1 at the top
        const spread = (1 - v * 0.6) * clamp(w * 0.1, 22, 46);
        blobs.push([
          ccx + (hash2(i, 1, 31) - 0.5) * 2 * spread + v * 5,
          50 - v * 42 + (hash2(i, 2, 31) - 0.5) * 6,
          6 + hash2(i, 3, 31) * 5 - v * 1.5,
        ]);
      }
      const inCloud = (x: number, y: number) =>
        y < 52 &&
        blobs.some(([bx, by, r]) => (x - bx) ** 2 + (y - by) ** 2 < r * r);
      for (let y = 0; y < 54; y++)
        for (let x = ccx - 70; x < ccx + 70; x++) {
          if (x < 0 || x >= w || !inCloud(x, y)) continue;
          let c = P.cloud;
          if (!inCloud(x - 1, y - 2)) c = P.cloudHi;
          else if (!inCloud(x + 2, y + 2)) c = P.cloudSh;
          if (y > 44) c = !inCloud(x - 1, y - 2) ? P.cloud : P.cloudSh;
          f.set(x, y, c);
        }
      // Tanigawa-dake: a broad, steep massif with two little summits on
      // top, "the two ears", gullies of bare rock and the last of the snow
      const spread = clamp(w * 0.26, 66, 130);
      const massifTop = (x: number) =>
        25 + 42 * Math.pow(Math.min(1, Math.abs(x - tgX) / spread), 0.95);
      const tgTop = (x: number) => {
        const ear = (px: number, py: number) =>
          py + ((x - px) / 4.5) ** 2 * 3.6;
        return (
          Math.min(massifTop(x), ear(tgX - 7, 20), ear(tgX + 7, 17.5)) +
          (fbm1(x / 3, 41) - 0.5) * 3
        );
      };
      for (let x = 0; x < w; x++) {
        const top = Math.round(tgTop(x));
        if (top > 66) continue;
        const slope = tgTop(x + 1.5) - tgTop(x - 1.5);
        const side = x < tgX ? -1 : 1;
        // the big dark east face, under the right-hand summit
        const face = x > tgX + 4 && x < tgX + 30 ? 0.5 : 0.64;
        for (let y = top; y < 70; y++) {
          const d = y - top;
          const s = d < 4 ? slope : side;
          let c = s < -0.2 ? P.mtnLit : s > 0.2 ? P.mtnSh : P.mtn;
          const n = noise2(x * 0.26, y * 0.07, 43);
          if (n > face && d > 1 && y < 56) c = P.mtnRock;
          if (n > face + 0.1 && d > 3 && y < 40)
            c = side > 0 ? P.snowSh : P.snow;
          if (y > 54) c = side < 0 ? P.mtnLow : P.mtnLowSh;
          if (d === 0) c = s > 0.5 ? P.mtn : P.mtnLit;
          f.set(x, y, c);
        }
      }
      // two hazy ridges down the valley, each a little nearer and greener
      for (let x = 0; x < w; x++) {
        const v = Math.abs(x - gx) / Math.max(40, floorHalf * 2);
        const t1 = Math.round(56 + (fbm1(x / 22, 51) - 0.5) * 12 - v * 8);
        for (let y = t1; y < 80; y++)
          f.set(x, y, y === t1 ? P.hazeLit : P.haze);
        const t2 = Math.round(67 + (fbm1(x / 16, 53) - 0.5) * 8 - v * 10);
        for (let y = t2; y < 84; y++)
          f.set(x, y, y === t2 ? P.haze2Lit : P.haze2);
      }
      // the valley floor: woods, and a side stream winding down out of it
      const vTop = (x: number) => 75 + Math.round((fbm1(x / 6, 57) - 0.5) * 4);
      for (let x = 0; x < w; x++)
        for (let y = vTop(x) + 2; y < BANK; y++) f.set(x, y, P.vDeep);
      forest(
        f,
        (x, y) => y >= vTop(x) && y < BANK,
        () => VALLEY,
        61,
        2.4,
        70
      );
      for (let y = 79; y < BANK; y++) {
        const u = (y - 79) / (BANK - 79);
        const sx = gx - 2 + Math.sin(y * 0.45) * 2.5 * (1 - u);
        const half = 0.6 + u * u * mouthHalf;
        f.hline(Math.round(sx - half), Math.round(sx + half), y, P.wNear);
        if (y % 3 === 0)
          f.hline(Math.round(sx - half * 0.4), Math.round(sx), y, P.foamSh);
      }
    });

    // ---------- the gorge walls, wooded ----------
    /** A Japanese cedar: a narrow dark spire. */
    function cedar(f: Frame, x: number, base: number, ht: number, lit: RGB) {
      for (let k = 0; k < ht; k++) {
        const v = k / ht; // 0 at the tip
        const half = Math.round(v * 2.2 + (k % 3 === 2 ? 0.6 : 0));
        for (let dx = -half; dx <= half; dx++)
          f.set(x + dx, base - ht + k, dx < 0 && dx === -half ? lit : P.cedar);
      }
    }
    const walls = layer(w, h, (f) => {
      for (let x = 0; x < w; x++) {
        const top = Math.round(wallTop(x)) + 2;
        const sunny = wallR(x) < wallL(x);
        for (let y = top; y < BANK; y++)
          f.set(x, y, sunny ? P.sunDeep : P.shDeep);
      }
      // cedar stands along the ridges, behind the broadleaf crowns
      for (let x = 2; x < w - 2; x += 3) {
        const top = wallTop(x);
        if (top > 50) continue;
        if (noise1(x / 9, 21) < 0.55) continue;
        const sunny = wallR(x) < wallL(x);
        cedar(
          f,
          x,
          Math.round(top) + 6,
          8 + Math.round(hash2(x, 1, 22) * 6),
          sunny ? P.cedarSun : P.cedarLit
        );
      }
      forest(
        f,
        (x, y) => y >= wallL(x) + 1 && y < BANK + 2,
        (_x, y) => (y > 72 ? { ...SHADY, hi: P.shLit, lit: P.shMid } : SHADY),
        11,
        3.4
      );
      forest(
        f,
        (x, y) => y >= wallR(x) + 1 && y < BANK + 2,
        (_x, y) => (y > 76 ? { ...SUNNY, hi: P.sunLit } : SUNNY),
        13,
        3.4
      );
    });

    // ---------- the bridge ----------
    const bridge = layer(w, h, (f) => {
      // spandrel posts from the arch up to the deck
      for (let x = Math.ceil(sL + 3); x < sR - 2; x += 5) {
        const y = Math.round(archY(x));
        if (y <= DECK + 4) continue;
        f.vline(x, DECK + 3, y, P.redMid);
      }
      // the arch rib
      for (let x = sL; x <= sR; x++) {
        const y = Math.round(archY(x));
        f.set(x, y - 1, P.redHi);
        f.set(x, y, P.red);
        f.set(x, y + 1, P.redSh);
      }
      // concrete footings on the walls
      for (const fx0 of [sL - 3, sR - 1]) {
        f.rect(fx0, SPRING - 1, 5, 4, P.concrete);
        f.hline(fx0, fx0 + 4, SPRING + 2, P.concreteSh);
      }
      // concrete piers where the deck runs over the slopes
      for (const [a, b] of [
        [bL + 4, sL - 3],
        [sR + 4, bR - 3],
      ] as const)
        for (let x = a; x < b; x += 7) {
          const g = Math.round(wallTop(x)) + 3;
          if (g <= DECK + 5) continue;
          f.vline(x, DECK + 4, g, P.concrete);
          f.vline(x + 1, DECK + 4, g, P.concreteSh);
        }
      // the deck girder and the rails
      for (let x = bL; x <= bR; x++) {
        f.set(x, DECK + 1, P.redHi);
        f.set(x, DECK + 2, P.red);
        f.set(x, DECK + 3, P.redSh);
        f.set(x, DECK, P.rail);
      }
      // tunnel portals into the hillsides, trees growing over them
      for (const [px, dir] of [
        [bL, -1],
        [bR, 1],
      ] as const) {
        // a sloped concrete face with a round-topped mouth, half buried
        const x0 = dir === -1 ? px - 7 : px - 1;
        for (let k = 0; k < 9; k++) {
          const y0 = DECK - 8 + Math.abs(k - 4) * 0.5;
          f.vline(x0 + k, Math.round(y0), DECK + 3, P.concrete);
        }
        f.vline(dir === -1 ? x0 : x0 + 8, DECK - 6, DECK + 3, P.concreteSh);
        f.rect(x0 + 2, DECK - 4, 5, 4, P.portal);
        f.hline(x0 + 3, x0 + 5, DECK - 5, P.portal);
        // the hillside's trees right over the top of it
        const st = dir === -1 ? SHADY : SUNNY;
        for (let k = 0; k < 5; k++) {
          const bx = x0 - 2 + k * 3 + Math.round(hash2(k, dir, 19) * 2);
          const by = DECK - 10 - Math.round(hash2(k, dir, 20) * 2);
          f.disc(bx, by, 2.8, (dx, dy) =>
            dx + dy < -1.5 ? st.lit : dx + dy > 1.5 ? st.dark : st.mid
          );
        }
      }
    });
    const onBridge = (x: number, y: number) =>
      x >= bL - 6 &&
      x <= bR + 6 &&
      ((y >= DECK - 10 && y <= DECK + 4) ||
        (x >= sL && x <= sR && Math.abs(y - archY(x)) <= 3));

    // ---------- granite ----------
    /** A pale granite boulder, lit from the upper left. Returns its top. */
    function boulder(
      f: Frame,
      x0: number,
      x1: number,
      base: number,
      height: number,
      seed: number,
      squareness = 2.6
    ) {
      const span = Math.max(2, x1 - x0);
      const peak = 0.35 + hash2(seed, 1, 71) * 0.3;
      const topAt = (x: number) => {
        const u = (x - x0) / span;
        const v = u < peak ? 1 - u / peak : (u - peak) / (1 - peak);
        return (
          base -
          height *
            Math.pow(1 - Math.pow(clamp01(v), squareness), 1 / squareness)
        );
      };
      for (let x = x0; x <= x1; x++) {
        const top = Math.round(topAt(x));
        const u = (x - x0) / span;
        for (let y = top; y <= base; y++) {
          const s = (u - peak) * 1.1 + ((y - (base - height)) / height) * 0.9;
          let c = P.granite;
          if (y === top && u < peak + 0.25) c = P.graniteHi;
          else if (s > 1.05) c = P.graniteDk;
          else if (s > 0.72) c = P.graniteSh;
          else if (s > 0.4) c = P.graniteMid;
          if (y === base) c = P.graniteDk;
          f.set(x, y, c);
        }
      }
      // a crack or two
      if (span > 9) {
        const cx0 = Math.round(x0 + span * (0.3 + hash2(seed, 2, 71) * 0.4));
        let y = Math.round(topAt(cx0)) + 1;
        let x = cx0;
        for (let k = 0; k < height * 0.6 && y < base; k++) {
          f.set(x, y, P.crack);
          y++;
          if (hash2(seed, k, 72) > 0.6) x += hash2(seed, k, 73) > 0.5 ? 1 : -1;
        }
      }
      return topAt;
    }

    // ---------- the far bank ----------
    // the kingfisher's dead branch, sticking out over the water on the left
    const kfX = Math.round(clamp(w * 0.1, 14, 56));
    const kfY = 87; // its perch
    const bank = layer(w, h, (f) => {
      // gravel along the waterline
      for (let x = 0; x < w; x++) {
        if (Math.abs(x - gx) < mouthHalf) continue;
        const top = BANK - 4 - Math.round(noise1(x / 7, 81) * 3);
        for (let y = top; y < BANK; y++)
          f.set(x, y, y === top ? P.gravel : y > BANK - 2 ? P.wet : P.gravelSh);
      }
      // boulders all along it: a back row, then a front row, a few big ones
      for (const [row, seed] of [
        [BANK - 3, 83],
        [BANK, 84],
      ] as const)
        for (let x = -8 + (row === BANK ? 5 : 0), i = 0; x < w + 8; i++) {
          const big = hash2(i, 0, seed) > 0.78;
          const bw = big
            ? 14 + Math.round(hash2(i, 1, seed) * 10)
            : 4 + Math.round(hash2(i, 1, seed) * 6);
          const bh = Math.round(bw * (0.42 + hash2(i, 2, seed) * 0.22));
          const mx = x + bw / 2;
          const skip = row === BANK && hash2(i, 5, seed) < 0.35 && !big;
          if (Math.abs(mx - gx) > mouthHalf + bw / 2 - 1 && !skip)
            boulder(
              f,
              x,
              x + bw,
              row + Math.round(hash2(i, 3, seed) * 2) - 1,
              bh,
              i + seed * 7
            );
          x += bw - 1 + Math.round(hash2(i, 4, seed) * (row === BANK ? 9 : 4));
        }
      // the side stream spills over a lip of rock into the pool
      for (let x = gx - mouthHalf - 2; x <= gx + mouthHalf + 2; x++) {
        const u = Math.abs(x - gx) / (mouthHalf + 2);
        const top = Math.round(89 + u * u * 4);
        for (let y = top; y < BANK; y++) {
          const fan = (y - top) / (BANK - top);
          if (u > 0.75 + fan * 0.3) continue;
          // unbroken streaks down the fall, all white where it lands
          const streak = hash2(x, 0, 89) > 0.6 && fan < 0.7;
          f.set(x, y, y === top ? P.streakHi : streak ? P.foamMid : P.foam);
        }
      }
      boulder(f, gx - mouthHalf - 7, gx - mouthHalf + 1, BANK, 6, 501);
      boulder(f, gx + mouthHalf - 1, gx + mouthHalf + 8, BANK + 1, 7, 502);
      // a dead branch reaching out of the trees over the water
      f.line(kfX - 17, kfY - 9, kfX + 1, kfY + 1, P.branch);
      f.line(kfX - 17, kfY - 10, kfX + 1, kfY, P.branchHi);
      f.hline(kfX + 1, kfX + 4, kfY + 1, P.branch);
      f.hline(kfX + 1, kfX + 3, kfY, P.branchHi);
      f.line(kfX - 8, kfY - 5, kfX - 10, kfY - 9, P.branch);
      f.line(kfX - 4, kfY - 2, kfX - 3, kfY - 6, P.branch);
    });

    // ---------- the water, before anything moves on it ----------
    const poolMid = (poolL + poolR) / 2;
    const poolHalf = Math.max(20, (poolR - poolL) / 2);
    const dropX = (y: number) =>
      rapidX -
      Math.round((y - BANK) * 0.32) +
      Math.round((noise1(y * 0.3, 117) - 0.5) * 6);
    // rocks on the drop line: the water piles up white against them
    const rapidRocks = [
      { y: BANK + 9, dx: 3, bw: 11, bh: 6 },
      { y: BANK + 27, dx: -4, bw: 15, bh: 8 },
      { y: BANK + 45, dx: 7, bw: 9, bh: 5 },
    ].map((r) => ({ ...r, x: dropX(r.y) + r.dx }));
    const waterBase = layer(w, h, (f) => {
      gradient(f, BANK, h, [P.wFar, P.wMid, P.wMid, P.wNear, P.wShallow]);
      // the deep channel through the middle of the pool
      for (let x = poolL; x < poolR + 20; x++) {
        const u = (x - poolMid) / (poolHalf + 10);
        const yc = 119 + Math.sin(x / 23) * 3;
        const half = (6 + fbm1(x / 9, 121) * 7) * Math.sqrt(clamp01(1 - u * u));
        for (let y = Math.round(yc - half); y < yc + half; y++)
          f.set(x, y, P.wDeep);
      }
      // boulders under the water: you can see right down to them
      for (let i = 0; i < Math.round(w / 70) + 2; i++) {
        const x = Math.round(poolL + hash2(i, 1, 123) * (poolR - poolL));
        const y = Math.round(106 + hash2(i, 2, 123) * 34);
        const r = 2 + hash2(i, 3, 123) * 3;
        const water = f.get(x, y);
        f.disc(x, y, r, (dx, dy) => {
          const sh = dx + dy * 1.6;
          return lerpRGB(
            sh < -r * 0.6 ? P.sunkHi : sh > r * 0.5 ? P.sunkSh : P.sunk,
            water,
            0.45
          );
        });
      }
      // pebbles in the shallows by the near bank
      for (let i = 0; i < w / 3; i++) {
        const x = Math.round(hash2(i, 1, 125) * w);
        const y = Math.round(139 + hash2(i, 2, 125) * 11);
        if (x > dropX(y) - 4) continue;
        const pw = 2 + Math.round(hash2(i, 3, 125) * 2);
        const water = f.get(x, y);
        f.hline(x, x + pw - 1, y, lerpRGB(P.sunkHi, water, 0.35));
        f.hline(x, x + pw - 1, y + 1, lerpRGB(P.sunkSh, water, 0.3));
      }
    });

    // ---------- in front: the near bank and the rapid's rocks ----------
    const cukeX = kx - 8;
    let cukeY = 126;
    let rockTop = (_x: number) => 128;
    const front = layer(w, h, (f) => {
      // the near bank at the bottom left: gravel, pebbles and summer grass
      const bankTop = (x: number) =>
        Math.round(128 + Math.pow(x / Math.max(1, kx - 6), 1.6) * 18);
      for (let x = 0; x < kx - 4; x++) {
        const top = bankTop(x);
        for (let y = top; y < h; y++) f.set(x, y, P.gravelSh);
        f.set(x, top, P.gravel);
        f.set(x, top - 1, P.wet); // wet stones at the water's edge
      }
      // the pebbles: little rounded stones, lit on top
      for (let gy = 128; gy < h + 2; gy += 3)
        for (let gx2 = (gy % 2) * 2; gx2 < kx - 4; gx2 += 4) {
          const x = gx2 + Math.round(hash2(gx2, gy, 131) * 2);
          const y = gy + Math.round(hash2(gx2, gy, 132) * 2);
          if (y < bankTop(x) + 2) continue;
          const pw = 2 + Math.round(hash2(gx2, gy, 133));
          f.hline(
            x,
            x + pw - 1,
            y,
            hash2(gx2, gy, 134) > 0.5 ? P.gravel : P.granite
          );
          f.hline(x, x + pw - 1, y + 1, P.gravelDk);
        }
      for (let i = 0; i < Math.max(2, kx / 9); i++) {
        const gxx = Math.round(hash2(i, 1, 133) * (kx - 14)) + 2;
        const top = bankTop(gxx) + 2 + Math.round(hash2(i, 2, 133) * 4);
        for (let k = -2; k <= 2; k++) {
          const ht = 3 + Math.round(hash2(i, k, 134) * 4) - Math.abs(k);
          f.line(
            gxx,
            top,
            gxx + k * 1.5,
            top - ht,
            k < 0 ? P.grassHi : k > 0 ? P.grassDk : P.grass
          );
        }
      }
      // when there's room: a rafting boat pulled up on the gravel (this is
      // Minakami), and a couple of bigger stones
      if (kx > 100) {
        for (const u of [0.18, 0.78]) {
          const bx0 = Math.round(kx * u);
          boulder(f, bx0, bx0 + 13, bankTop(bx0 + 6) + 9, 8, 600 + bx0);
        }
        const rx = Math.round(kx * 0.42);
        sprite(f, RAFT, rx, bankTop(rx + 12) + 3, {
          h: P.raftHi,
          r: P.raft,
          k: P.raftIn,
          s: P.raftSh,
          p: P.shaft,
          b: P.topA,
        });
      }
      // the cucumber rock, flat on top
      rockTop = boulder(f, kx - 15, kx + 13, 149, 21, 5, 3.4);
      cukeY = Math.round(rockTop(cukeX)) - 2;
      // rocks on the rapid's drop line, the water heaped white against them
      for (const [k, r] of rapidRocks.entries()) {
        boulder(f, r.x - 2, r.x - 2 + r.bw, r.y, r.bh, 40 + k);
        for (let dy = 0; dy < 3; dy++) {
          f.hline(r.x - 4 + dy, r.x - 2 + dy, r.y - dy, P.foam);
          f.set(r.x - 5 + dy, r.y - dy + 1, P.foamMid);
        }
        f.hline(r.x - 3, r.x + r.bw + 2, r.y + 1, P.foam);
        f.hline(r.x - 1, r.x + r.bw + 5, r.y + 2, P.foamMid);
      }
      // a big one in the near right corner
      boulder(f, w - 22, w + 14, h + 2, 22, 9);
    });

    // ---------- the paddlers ----------
    const BOARDS: Record<Who, BoardLook> = {
      man: { top: P.bMan, side: P.bManSh, pad: P.pad },
      woman: { top: P.bWoman, side: P.bWomanSh, pad: P.padTeal },
      cap: { top: P.bYellow, side: P.bYellowSh, pad: P.padGrey },
      bun: { top: P.bLime, side: P.bLimeSh, pad: P.padGrey },
      sitter: { top: P.bBlue, side: P.bBlueSh, pad: P.padGrey },
    };
    const span = poolR - poolL;
    const at = (u: number) => Math.round(poolL + span * u);
    const paddlers: Paddler[] = [
      {
        who: 'cap',
        x0: at(0.12),
        row: ROW_FAR,
        dir: 1,
        rows: CAPPED,
        look: {
          ...WOMAN_LOOK,
          H: P.hair,
          C: P.cap,
          T: P.topA,
          t: P.topASh,
          B: P.shorts,
        },
        board: BOARDS.cap,
        ph: 0.3,
      },
      {
        who: 'bun',
        x0: at(0.5),
        row: ROW_FAR - 1,
        dir: -1,
        rows: BUN,
        look: { ...WOMAN_LOOK, T: P.topB, t: P.topBSh, B: P.leggings },
        board: BOARDS.bun,
        ph: 0.65,
      },
      {
        who: 'woman',
        x0: at(0.27),
        row: ROW_NEAR,
        dir: 1,
        rows: WOMAN,
        look: WOMAN_LOOK,
        board: BOARDS.woman,
        ph: 0.1,
      },
      {
        who: 'man',
        x0: at(0.68),
        row: ROW_NEAR + 1,
        dir: -1,
        rows: MAN,
        look: MAN_LOOK,
        board: BOARDS.man,
        ph: 0.5,
      },
    ];
    if (span > 150)
      paddlers.splice(2, 0, {
        who: 'sitter',
        x0: at(0.88),
        row: ROW_FAR + 2,
        dir: -1,
        rows: SITTER,
        look: {
          ...WOMAN_LOOK,
          C: P.straw,
          c: P.strawSh,
          r: P.band,
          T: P.topC,
          t: P.topCSh,
          B: P.shorts,
        },
        board: BOARDS.sitter,
        ph: 0.8,
      });
    const man = paddlers.find((p) => p.who === 'man')!;
    const posOf = (p: Paddler, t: number) => ({
      x: Math.round(p.x0 + Math.sin(t / 9000 + p.ph * 6) * 4),
      y: p.row + (Math.sin(t / 820 + p.ph * 9) > 0.6 ? -1 : 0),
    });

    const BOARD_L = 26;
    function drawBoard(
      f: Frame,
      x: number,
      y: number,
      dir: 1 | -1,
      b: BoardLook,
      tilt = 0
    ) {
      const x0 = x - BOARD_L / 2;
      // its shadow on the water, thrown off to the right by the sun
      for (let i = 1; i < BOARD_L + 2; i++) {
        f.blend(x0 + i + 1, y + 1, P.shadow, 0.45);
        if (i > 3) f.blend(x0 + i + 2, y + 2, P.shadow, 0.25);
      }
      for (let i = 0; i < BOARD_L; i++) {
        const fromNose = dir === 1 ? BOARD_L - 1 - i : i;
        const fromTail = BOARD_L - 1 - fromNose;
        const lift = fromNose < 3 ? 1 : 0; // the nose rocker
        const tl = Math.round(tilt * ((i - BOARD_L / 2) / (BOARD_L / 2)));
        const X = x0 + i;
        if (fromNose === 0) {
          f.set(X, y - 2 - lift + tl, b.side);
          continue;
        }
        const deck = fromNose > 4 && fromTail > 6;
        f.set(X, y - 2 - lift + tl, deck ? b.pad : b.top);
        f.set(X, y - 1 - lift + tl, b.top);
        if (fromTail > 0 && fromNose > 1) f.set(X, y + tl, b.side);
      }
    }

    /** Where a sprite stands on a board at (x, y): its top-left corner. */
    const spriteAt = (rows: string[], dir: 1 | -1, x: number, y: number) => {
      const sw = Math.max(...rows.map((r) => r.length));
      return {
        ox: dir === 1 ? x - 3 : x - sw + 3,
        oy: y - 2 - rows.length,
        sw,
      };
    };

    /** A paddler's reflection, broken up by the ripples. */
    function reflect(
      f: Frame,
      rows: string[],
      look: Look,
      dir: 1 | -1,
      x: number,
      y: number,
      t: number
    ) {
      const { ox, sw } = spriteAt(rows, dir, x, y);
      const n = rows.length;
      for (let ry = 0; ry < n; ry++) {
        const yy = y + 2 + (n - 1 - ry);
        if (yy >= h) continue;
        const wob = Math.round(Math.sin(yy * 0.9 + t / 300) * 0.8);
        const row = rows[ry]!;
        for (let rx = 0; rx < row.length; rx++) {
          const c = look[row[rx]!];
          if (c === undefined) continue;
          const xx = dir === 1 ? ox + rx : ox + sw - 1 - rx;
          f.blend(xx + wob, yy, c, 0.28);
        }
      }
    }

    /** The paddle stroke: catch ahead, pull back past the feet, recover. */
    function paddle(
      f: Frame,
      px: number,
      y: number,
      d: 1 | -1,
      cycle: number,
      arm: RGB
    ) {
      const feet = y - 2;
      const ph = ((cycle % 1) + 1) % 1;
      let bx: number;
      let by: number;
      let tx: number;
      let ty: number;
      if (ph < 0.55) {
        const q = ph / 0.55;
        bx = px + d * (9 - q * 12);
        by = y + 2;
        tx = px + d * (3 - q * 2);
        ty = feet - 15 + Math.round(q);
      } else {
        const q = (ph - 0.55) / 0.45;
        bx = px + d * (-3 + q * 12);
        by = y + 2 - Math.round(Math.sin(q * Math.PI) * 4);
        tx = px + d * (1 + q * 2);
        ty = feet - 14 - Math.round(Math.sin(q * Math.PI));
      }
      bx = Math.round(bx);
      tx = Math.round(tx);
      f.line(tx, ty, bx, by - 3, P.shaft);
      for (let k = 0; k < 4; k++) {
        const yy = by - 2 + k;
        if (yy > y) f.blend(bx, yy, P.blade, 0.4);
        else f.set(bx, yy, P.blade);
      }
      if (by >= y + 2 && ph > 0.05) {
        // a swirl where the blade pulls
        f.set(bx + d, y, P.foam);
        f.set(bx + d * 2, y + 1, P.foamMid);
      }
      // arms: the top hand on the grip, the low hand down the shaft
      const sy = feet - 10;
      const lx = Math.round(tx + (bx - tx) * 0.42);
      const ly = Math.round(ty + (by - 3 - ty) * 0.42);
      f.line(px, sy, tx, ty + 1, arm);
      f.line(px, sy + 1, lx, ly, arm);
    }

    /** The paddle lying on the water. */
    function floatingPaddle(f: Frame, x: number, y: number) {
      f.hline(x - 6, x + 4, y, P.shaft);
      f.hline(x + 4, x + 6, y, P.blade);
      f.hline(x + 4, x + 6, y + 1, P.blade);
      f.blend(x - 5, y + 1, P.shadow, 0.5);
    }

    // ---------- egg: the glasses ----------
    // Click the man's board: he wobbles, windmills and goes in backwards with
    // a huge splash. His sunglasses fly off and the current takes them away
    // down the rapid, glinting in the sun all the way. He surfaces squinting,
    // climbs back on, and the others are bouncing on their boards laughing.
    const G = {
      tip: 1100, // he's going over
      fly: 1250, // the glasses come off
      hit: 1450, // and in
      surface: 3000,
      grab: 4100, // hands on the board
      lie: 4600, // hauled across it
      kneel: 5300,
      stand: 6000,
      end: 8400,
    };
    let glassesAt = -Infinity;
    const glassesOn = (t: number) =>
      t - glassesAt >= 0 && t - glassesAt < G.end;
    const back = -man.dir as 1 | -1; // he falls backwards, downstream
    /** How far the board's shot forward from under him. */
    const kick = (a: number) =>
      man.dir *
      (a < G.tip ? 0 : 7 * ease((a - G.tip) / 700)) *
      (1 - ease((a - G.stand) / (G.end - G.stand)));
    // where he goes in, where the glasses come down, and their way out
    const fallAt = (s: number) => {
      const p = posOf(man, s + G.hit);
      return { x: p.x + back * 9, y: man.row };
    };
    const FLY = 1300; // ms in the air
    const GRAV = 160; // px/s²
    function glassesPath(s: number, a: number) {
      const p = posOf(man, s + G.fly);
      const lx = p.x + back * 3;
      const ly = man.row - 16;
      const wy = man.row + 1;
      const drop0 = dropX(wy);
      const land = lx + back * clamp(Math.abs(drop0 - lx) * 0.45, 16, 60);
      const u = (a - G.fly) / 1000;
      if (u < FLY / 1000) {
        const T = FLY / 1000;
        const vy = (wy - ly - 0.5 * GRAV * T * T) / T;
        return {
          x: lx + ((land - lx) * u) / T,
          y: ly + vy * u + 0.5 * GRAV * u * u,
          air: true,
          rapid: false,
        };
      }
      // then the current has them: drifting, then racing down the rapid
      const b = a - G.fly - FLY;
      const POOL_T = 1500;
      const RAPID_T = 1600;
      if (b < POOL_T) {
        const q = b / POOL_T;
        return {
          x: land + (drop0 - land) * q * q,
          y: wy + Math.round(Math.sin(b / 260) * 0.6),
          air: false,
          rapid: false,
        };
      }
      // tossed from wave to wave, hopping clear of the foam
      const q = (b - POOL_T) / RAPID_T;
      const x = drop0 + (w + 10 - drop0) * Math.pow(q, 1.2);
      return {
        x,
        y: wy + q * 9 - Math.abs(Math.sin((x - drop0) / 6)) * 5,
        air: false,
        rapid: true,
      };
    }
    const glassesGone = G.fly + FLY + 1500 + 1600;

    /** The man as a column of pixels from the feet, tipped over by `ang`. */
    function tipped(f: Frame, x: number, y: number, ang: number, side: number) {
      const segs = [
        P.skin,
        P.skin,
        P.skin,
        P.skin,
        P.shorts,
        P.shorts,
        P.tee,
        P.tee,
        P.tee,
        P.tee,
        P.tee,
        P.beard,
        P.skin,
        P.mHair,
        P.mHair,
      ];
      const dx = Math.sin(ang) * side;
      const dy = -Math.cos(ang);
      for (let k = 0; k < segs.length; k += 0.6) {
        const c = segs[Math.floor(k)]!;
        const px = x + dx * k;
        const py = y + dy * k;
        const wide = k < 4 ? 1 : 2;
        for (let q = -1; q < wide; q++)
          f.set(Math.round(px - dy * q), Math.round(py + dx * q), c);
      }
      return { x: x + dx * 10, y: y + dy * 10 }; // his shoulders
    }

    function drawManEgg(f: Frame, t: number, a: number) {
      const { x, y } = posOf(man, t);
      const d = man.dir;
      const bx = Math.round(x + kick(a));
      const feet = y - 2;
      const fall = fallAt(glassesAt);
      // the board: rocking, then bucking as he goes, then settling
      const tilt =
        a < G.hit
          ? Math.sin(a / 85) * Math.min(1.6, a / 300)
          : a < G.hit + 1100
            ? Math.sin(a / 70) * 1.4 * (1 - (a - G.hit) / 1100)
            : 0;
      // his paddle, flung away, floats until he's back on his knees
      if (a > 520 && a < G.kneel)
        floatingPaddle(
          f,
          Math.round(x + d * 15 + ((a - 520) / 1000) * 2),
          y + 1
        );
      if (a < G.tip) {
        // wobbling, arms going round like windmills
        drawBoard(f, bx, y, d, man.board, tilt);
        const sway = Math.round(Math.sin(a / 85 + 0.6) * Math.min(2, a / 250));
        const { ox, oy } = spriteAt(MAN, d, x, y);
        sprite(f, MAN, ox + sway, oy, MAN_LOOK, d === -1);
        const sx = x + sway;
        const sy = feet - 10;
        for (const k of [0, Math.PI]) {
          const ang = a / 65 + k;
          f.line(
            sx,
            sy,
            Math.round(sx + Math.cos(ang) * 5),
            Math.round(sy + Math.sin(ang) * 5),
            P.skin
          );
        }
        if (a < 520) {
          // the paddle, flung up out of his hands
          const u = a / 520;
          const px = x + d * (4 + u * 11);
          const py = feet - 12 - Math.sin(u * Math.PI) * 8 + u * 14;
          f.line(
            Math.round(px - 5),
            Math.round(py + (1 - u) * 3),
            Math.round(px + 5),
            Math.round(py - (1 - u) * 3),
            P.shaft
          );
        }
        // a nervous bead of sweat
        if (a > 150 && a < 900) {
          const sy2 = feet - 15 + Math.floor((a - 150) / 150);
          f.set(sx + d * -2, sy2, P.sweat);
          f.set(sx + d * -2, sy2 + 1, P.sweat);
        }
        return;
      }
      if (a < G.hit) {
        // over he goes, backwards, arms flung up
        drawBoard(f, bx, y, d, man.board, tilt);
        const q = (a - G.tip) / (G.hit - G.tip);
        const ang = Math.pow(q, 1.5) * 1.9;
        const sh = tipped(
          f,
          Math.round(x + back * q * 4),
          Math.round(feet + q * 3),
          ang,
          back
        );
        for (const k of [-0.5, 0.5]) {
          const aa = -Math.PI / 2 - back * 0.4 + k + Math.sin(a / 40 + k) * 0.5;
          f.line(
            Math.round(sh.x),
            Math.round(sh.y),
            Math.round(sh.x + Math.cos(aa) * 5),
            Math.round(sh.y + Math.sin(aa) * 5),
            P.skin
          );
        }
        return;
      }
      drawBoard(f, bx, y, d, man.board, tilt);
      if (a < G.surface) {
        // under: a dark shape in the clear water, and bubbles
        for (let k = -5; k <= 5; k++)
          f.blend(
            fall.x + k,
            fall.y + 3 + (Math.abs(k) > 3 ? 1 : 0),
            P.under,
            0.45
          );
        for (let i = 0; i < 4; i++) {
          const ph = (a / 420 + i * 0.27) % 1;
          f.set(
            fall.x - 3 + i * 2,
            Math.round(fall.y + 2 - ph * 3),
            ph > 0.7 ? P.foam : P.streakHi
          );
        }
        return;
      }
      // swimming back to the board
      const grabX = bx + back * 11;
      if (a < G.grab) {
        const q = ease((a - G.surface) / (G.grab - G.surface - 300));
        const hx = Math.round(fall.x + (grabX - fall.x) * q);
        const bob = Math.floor(a / 260) % 2;
        const hy = y - 4 + bob;
        sprite(f, MAN_HEAD, hx - 2, hy, MAN_LOOK);
        // flapping arms, and water streaming off him
        const fl = Math.floor(a / 160) % 2;
        f.set(hx - 3, y - fl, P.skin);
        f.set(hx + 3, y - 1 + fl, P.skin);
        f.set(hx - 4, y, P.foam);
        f.set(hx + 4, y, P.foam);
        f.hline(hx - 2, hx + 2, y + 1, P.foamMid);
        if (Math.floor(a / 120) % 3 === 0) f.set(hx + 1, hy + 4, P.sweat);
        // can't see a thing: stars going round his head
        for (let k = 0; k < 3; k++) {
          const ang = a / 170 + (k * Math.PI * 2) / 3;
          f.set(
            Math.round(hx + Math.cos(ang) * 4),
            Math.round(hy - 2 + Math.sin(ang) * 1.3),
            P.dizzy
          );
        }
        return;
      }
      if (a < G.lie) {
        // hands on the rail, pulling up
        const q = (a - G.grab) / (G.lie - G.grab);
        const hy = y - 4 - Math.round(q * 3);
        sprite(f, MAN_HEAD, grabX - 2, hy, MAN_LOOK);
        f.rect(grabX - 2, hy + 4, 5, y - hy - 4, P.tee);
        f.line(grabX, hy + 4, grabX - back * 4, y - 2, P.skin);
        return;
      }
      if (a < G.kneel) {
        // flopped across it like a seal
        const ly = y - 3;
        for (let k = 0; k < 11; k++) {
          const xx = grabX - back * (k + 1);
          f.set(
            xx,
            ly,
            k < 2 ? P.mHair : k < 4 ? P.skin : k < 8 ? P.tee : P.shorts
          );
          f.set(
            xx,
            ly - 1,
            k < 2 ? P.mHair : k < 4 ? P.skin : k < 8 ? P.tee : P.shorts
          );
        }
        f.blend(grabX - back * 13, y + 1, P.skin, 0.6);
        f.blend(grabX - back * 14, y + 2, P.skin, 0.5);
        return;
      }
      if (a < G.stand) {
        const { ox, oy } = spriteAt(MAN_KNEEL, d, bx, y);
        sprite(f, MAN_KNEEL, ox, oy, MAN_LOOK, d === -1);
        return;
      }
      // up again, a bit shaky, and paddling on without his sunglasses
      const shaky = a < G.stand + 700;
      const { ox, oy } = spriteAt(MAN_SQUINT, d, bx, y);
      sprite(f, MAN_SQUINT, ox, oy, MAN_LOOK, d === -1);
      if (shaky) {
        const fl = Math.floor(a / 120) % 2;
        f.line(bx, feet - 10, bx - 5, feet - 11 - fl, P.skin);
        f.line(bx, feet - 10, bx + 5, feet - 11 + fl, P.skin);
      } else paddle(f, bx, y, d, t / 2400 + man.ph, P.skin);
    }

    function drawGlasses(f: Frame, t: number) {
      const a = t - glassesAt;
      if (!glassesOn(t) || a < G.fly || a > glassesGone) return;
      const g = glassesPath(glassesAt, a);
      // a trail of sparkles left hanging along the way, twinkling out
      for (let k = 1; k <= 14; k++) {
        const s = a - k * 70;
        if (s < G.fly) break;
        const p = glassesPath(glassesAt, s);
        const fade = 1 - k / 15;
        const px = Math.round(
          p.x + (hash2(k, Math.floor(s / 70), 61) - 0.5) * 3
        );
        const py = Math.round(
          p.y - (p.air ? 0 : 3) + (hash2(k, Math.floor(s / 70), 62) - 0.5) * 3
        );
        const tw = Math.floor((a + k * 37) / 90) % 3;
        const c = p.rapid ? P.dizzy : P.glint;
        f.blend(px, py, c, fade);
        if (tw === 0 && k < 10) {
          f.blend(px - 1, py, c, fade * 0.7);
          f.blend(px + 1, py, c, fade * 0.7);
          f.blend(px, py - 1, c, fade * 0.7);
          f.blend(px, py + 1, c, fade * 0.7);
        }
      }
      if (g.air) {
        const fr = Math.floor(a / 70) % 4;
        const rows = GLASSES[fr === 3 ? 1 : fr]!;
        const gw = rows[0]!.length;
        sprite(
          f,
          rows,
          Math.round(g.x - gw / 2),
          Math.round(g.y - 1),
          GLASS_LOOK
        );
      } else {
        // floating, half under, the current tugging them along
        const x = Math.round(g.x - 3);
        const y = Math.round(g.y - 1);
        if (g.rapid) {
          // riding a dark trough between the waves, so you can still see them
          f.hline(x - 2, x + 8, y, P.troughDk);
          f.hline(x - 1, x + 7, y - 1, P.troughDk);
          f.hline(x - 1, x + 7, y + 1, P.trough);
        }
        sprite(f, GLASSES[0]!.slice(0, 2), x, y - 1, GLASS_LOOK);
        f.hline(x, x + 6, y + 1, P.foamMid);
        if (g.rapid) {
          // spray off the waves they bounce through
          const sp = Math.floor(a / 90) % 3;
          f.set(x - 1 - sp, y - 2 - sp, P.foam);
          f.set(x + 7 + sp, y - 1 - sp, P.foam);
        }
      }
      // and they flash in the sun (gold over the white water)
      const beat = g.rapid ? 200 : 260;
      const ph = a % beat;
      if (ph < beat * 0.6) {
        const r = ph < beat * 0.3 ? 4 : 2;
        const lx = Math.round(g.x + 1);
        const ly = Math.round(g.y - (g.air ? 0 : 2));
        const c = g.rapid ? P.dizzy : P.glint;
        f.set(lx, ly, P.glint);
        for (let k = 1; k <= r; k++) {
          const al = 1 - (k - 1) / (r + 1);
          f.blend(lx - k, ly, c, al);
          f.blend(lx + k, ly, c, al);
          f.blend(lx, ly - k, c, al);
          f.blend(lx, ly + k, c, al);
        }
      }
    }

    /** The others, while the man's in the drink: bouncing with laughter. */
    const laughing = (t: number) => {
      const a = t - glassesAt;
      return glassesOn(t) && a > G.hit + 250 && a < G.stand + 900;
    };

    // ---------- egg: the kappa ----------
    // Click the cucumber: bubbles, then a kappa bursts out of the river,
    // leaps onto the rock, grabs the cucumber (hearts), munches it, pushes
    // the man's sunglasses up its beak (very cool) with a flash of sun off the
    // dark lenses you can see from the bridge, waves, and dives back in.
    const K = {
      pop: 800,
      leap: 1050,
      land: 1500,
      grab: 1750,
      munch: 2400,
      adjust: 3900,
      glint: 4250,
      wave: 4900,
      dive: 5500,
      splash: 5950,
      end: 7600,
    };
    let kappaAt = -Infinity;
    const kappaOn = (t: number) => t - kappaAt >= 0 && t - kappaAt < K.end;
    const cukeThere = (t: number) => !kappaOn(t) || t - kappaAt < K.grab;
    const KW = 15;
    const KH = 21;
    // it comes up out of the water just right of the rock, and sits up there
    const emerge = { x: kx + 19, y: 145 };
    const perchX = kx + 7;
    const perchY = () => Math.round(rockTop(perchX)) + 1; // its feet

    /** A cucumber lying on its side: glossy, warty, a dried flower at the tip. */
    function drawCucumber(f: Frame, x: number, y: number, len: number) {
      if (len <= 0) return;
      f.hline(x + 1, x + len - 2, y, P.cukeHi);
      f.hline(x, x + len - 1, y + 1, P.cuke);
      f.hline(x + 1, x + len - 2, y + 2, P.cukeDk);
      for (let k = 2; k < len - 1; k += 3) f.set(x + k, y + 1, P.cukeWart);
      for (let k = 3; k < len - 2; k += 3) f.set(x + k, y, P.cuke);
      f.set(x + 2, y, P.glint);
      f.set(x + len, y + 1, P.cukeFlower);
      f.set(x - 1, y + 1, P.cukeStalk);
    }

    /** The kappa, feet at (x, y); `sink` rows are still under the water. */
    function kappaSprite(
      f: Frame,
      x: number,
      y: number,
      waterY: number,
      flip = false
    ) {
      const ox = Math.round(x - KW / 2);
      const oy = Math.round(y - KH);
      for (let ry = 0; ry < KH; ry++) {
        const row = KAPPA[flip ? KH - 1 - ry : ry]!;
        const yy = oy + ry;
        for (let rx = 0; rx < KW; rx++) {
          const c = KAPPA_LOOK[row[rx]!];
          if (c === undefined) continue;
          if (yy > waterY) f.blend(ox + rx, yy, c, 0.35);
          else f.set(ox + rx, yy, c);
        }
      }
      return { ox, oy };
    }

    function drawKappa(f: Frame, t: number) {
      const a = t - kappaAt;
      if (!kappaOn(t)) return;
      const py = perchY();
      if (a < K.pop) {
        // something's down there: bubbles, and a glint under the water
        for (let i = 0; i < 5; i++) {
          const ph = (a / 300 + i * 0.21) % 1;
          f.set(
            emerge.x - 4 + i * 2,
            Math.round(emerge.y + 1 - ph * 4),
            ph > 0.75 ? P.foam : P.streakHi
          );
        }
        if (a > 300 && Math.floor(a / 110) % 2 === 0) {
          f.blend(emerge.x - 2, emerge.y + 2, P.glint, 0.7);
          f.blend(emerge.x + 2, emerge.y + 2, P.glint, 0.7);
        }
        return;
      }
      if (a < K.leap) {
        // up it comes, dish first
        const q = (a - K.pop) / (K.leap - K.pop);
        kappaSprite(f, emerge.x, emerge.y + KH - Math.round(q * 12), emerge.y);
        return;
      }
      if (a < K.land) {
        // a leap up out of the river onto the rock
        const q = (a - K.leap) / (K.land - K.leap);
        const x = emerge.x + (perchX - emerge.x) * q;
        const y =
          emerge.y + 9 + (py - emerge.y - 9) * q - Math.sin(q * Math.PI) * 26;
        kappaSprite(f, x, y, emerge.y);
        // water streaming off it
        for (let k = 1; k <= 4; k++) {
          const qq = Math.max(0, q - k * 0.07);
          const tx = emerge.x + (perchX - emerge.x) * qq;
          const ty =
            emerge.y +
            9 +
            (py - emerge.y - 9) * qq -
            Math.sin(qq * Math.PI) * 26;
          f.set(tx + (k % 2 ? 2 : -2), ty - 2, k % 2 ? P.foam : P.streakHi);
        }
        return;
      }
      if (a < K.dive) {
        const { ox, oy } = kappaSprite(f, perchX, py, h);
        const sl = { x: ox + 2, y: oy + 14 }; // its shoulders
        const sr = { x: ox + 12, y: oy + 14 };
        const arm = (p: { x: number; y: number }, x: number, y: number) => {
          f.line(p.x, p.y, x, y, P.kSh);
          f.line(p.x, p.y - 1, x, y - 1, P.kGreen);
        };
        const hx = ox + 7; // the middle of its face
        if (a < K.grab) {
          // reaching for it
          arm(sl, sl.x - 4, sl.y + 1);
          arm(sr, sr.x + 1, sr.y + 3);
          drawCucumber(f, cukeX, cukeY, 9);
        } else if (a < K.munch) {
          // got it! held up high, hearts everywhere
          arm(sl, hx - 4, oy - 2);
          arm(sr, hx + 4, oy - 2);
          drawCucumber(f, hx - 4, oy - 5, 9);
          const b = a - K.grab;
          for (let i = 0; i < 5; i++) {
            const hb = b - i * 110;
            if (hb < 0) continue;
            const hy = oy - 8 - hb / 30;
            const hxx =
              hx -
              3 +
              (i - 2) * 7 +
              Math.sin(hb / 110 + i) * 2 +
              ((i - 2) * hb) / 120;
            sprite(f, HEART, Math.round(hxx), Math.round(hy), {
              h: P.heart,
              H: P.heartHi,
            });
          }
        } else if (a < K.adjust) {
          // munch, munch, munch
          const b = (a - K.munch) / (K.adjust - K.munch);
          const len = 9 - Math.floor(b * 8);
          const chomp = Math.floor(a / 160) % 2;
          arm(sl, hx - 3, oy + 12);
          arm(sr, hx + 3, oy + 12);
          drawCucumber(f, hx - Math.floor(len / 2), oy + 11 + chomp, len);
          for (let i = 0; i < 5; i++) {
            const cb = (a / 380 + i * 0.2) % 1;
            f.set(
              hx - 6 + i * 3,
              Math.round(oy + 13 + cb * 8),
              i % 2 ? P.cukeHi : P.kBelly
            );
          }
        } else if (a < K.wave) {
          // pushes the shades up its beak... and they catch the sun
          const b = a - K.adjust;
          const up = b > 200 && b < 600 ? 1 : 0;
          arm(sl, sl.x - 2, sl.y + 4);
          arm(sr, hx + 1, oy + 8 + up);
          f.set(hx, oy + 8 + up, P.kLit);
          f.set(hx, oy + 7 + up, P.kLit);
        } else {
          // a little wave goodbye
          const wv = Math.floor(a / 140) % 2;
          arm(sl, sl.x - 2, sl.y + 4);
          arm(sr, sr.x + 4 + wv * 2, oy + 4);
          f.rect(sr.x + 3 + wv * 2, oy + 2, 2, 2, P.kLit);
        }
        return;
      }
      if (a < K.splash) {
        // and back in, head first
        const q = (a - K.dive) / (K.splash - K.dive);
        const x = perchX + (emerge.x + 6 - perchX) * q;
        const y = py + (emerge.y + 16 - py) * q - Math.sin(q * Math.PI) * 20;
        kappaSprite(f, x, y, emerge.y + 1, q > 0.45);
        return;
      }
      // ripples close over it; the dish glints once, going down
      const b = a - K.splash;
      if (b < 900) {
        const yy = emerge.y + 3 + Math.round(b / 300);
        f.blend(emerge.x + 6, yy, P.kDish, 0.5 * (1 - b / 900));
        f.blend(emerge.x + 7, yy, P.kDish, 0.5 * (1 - b / 900));
      }
    }

    /** The big anime glint off the kappa's shades: a star the size of a boat. */
    function drawGlint(f: Frame, t: number) {
      const a = t - kappaAt;
      if (!kappaOn(t) || a < K.glint || a > K.glint + 900) return;
      const q = (a - K.glint) / 900;
      const s = Math.sin(Math.min(1, q * 1.6) * Math.PI * 0.5) * (1 - q * q);
      const ox = Math.round(perchX - KW / 2);
      const lx = ox + 10; // its right lens
      const ly = perchY() - KH + 7;
      const L = Math.round(s * clamp(w * 0.17, 32, 72));
      const V = Math.round(L * 0.45);
      const ray = (dx: number, dy: number, len: number, k0: number) => {
        for (let k = 0; k <= len; k++) {
          const al = (1 - k / (len + 1)) * s;
          f.blend(lx + dx * k, ly + dy * k, P.glint, al);
          // a thick, bright core near the middle
          if (k < len * k0) {
            f.blend(lx + dx * k + dy, ly + dy * k + dx, P.glint, al * 0.7);
            f.blend(lx + dx * k - dy, ly + dy * k - dx, P.glint, al * 0.7);
          }
        }
      };
      ray(1, 0, L, 0.4);
      ray(-1, 0, L, 0.4);
      ray(0, 1, V, 0.3);
      ray(0, -1, V, 0.3);
      const D = Math.round(L * 0.2);
      for (const [dx, dy] of [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ] as const)
        ray(dx, dy, D, 0);
      // a ring of light bursting out
      const R = 3 + q * L * 0.9 + q * 10;
      const steps = Math.ceil(R * 6);
      for (let k = 0; k < steps; k++) {
        const ang = (k / steps) * Math.PI * 2;
        f.blend(
          lx + Math.cos(ang) * R,
          ly + Math.sin(ang) * R * 0.8,
          P.dizzy,
          (1 - q) * 0.8
        );
      }
      f.disc(lx, ly, Math.max(0.5, s * 2), P.glint);
    }

    // ---------- everyday: the women ----------
    const REACT = 2400;
    const reactAt = new Map<Who, number>();
    const reacting = (who: Who, t: number) => {
      const s = reactAt.get(who);
      return s !== undefined && t - s >= 0 && t - s < REACT ? t - s : -1;
    };

    function drawWoman(f: Frame, p: Paddler, t: number) {
      const { x, y: y0 } = posOf(p, t);
      const r = reacting(p.who, t);
      const laugh = laughing(t);
      const bounce = laugh && Math.floor((t - glassesAt) / 150) % 2 ? -1 : 0;
      const y = y0 + bounce;
      const wob =
        p.who === 'cap' && r >= 0
          ? Math.sin(r / 90) * 1.6 * (1 - r / REACT)
          : 0;
      reflect(f, p.rows, p.look, p.dir, x, y0, t);
      drawBoard(f, x, y0, p.dir, p.board, wob);
      const sway = Math.round(wob * 0.8);
      const { ox, oy } = spriteAt(p.rows, p.dir, x, y);
      sprite(f, p.rows, ox + sway, oy, p.look, p.dir === -1);
      const feet = y - 2;
      const headX = ox + 3 + sway;
      const ka = t - kappaAt;
      if (kappaOn(t) && ka >= K.pop && ka < K.pop + 1300) {
        // what on earth was that?! (lines jumping out of the head)
        const k = ka - K.pop < 500 ? 1 : 0;
        f.set(headX - 3, oy - 2 - k, P.foam);
        f.set(headX - 4, oy - 3 - k, P.foam);
        f.set(headX, oy - 3 - k, P.foam);
        f.set(headX, oy - 4 - k, P.foam);
        f.set(headX + 3, oy - 2 - k, P.foam);
        f.set(headX + 4, oy - 3 - k, P.foam);
      }
      if (laugh) {
        // ha ha ha: little strokes popping out round the head, on the beat
        const k = Math.floor((t - glassesAt) / 150) % 2;
        for (const side of [-1, 1]) {
          const ex = headX + side * (4 + k);
          f.set(ex, oy - 1 - k, P.foam);
          f.set(ex + side, oy - 2 - k, P.foam);
          f.set(ex + side, oy + 1, P.foam);
          f.set(ex + side * 2, oy + 1, P.foam);
        }
      }
      if (p.who === 'sitter') {
        // kicking her feet in the water (and waving, when you say hello)
        const kickIt = r >= 0 || laugh;
        const fl = kickIt ? Math.floor(t / 110) % 2 : 0;
        const fx0 = p.dir === 1 ? ox + 7 : ox;
        f.set(fx0, feet + 3 - fl, P.skin);
        if (kickIt)
          for (let k = 0; k < 4; k++) {
            const up = (Math.floor(t / 110) + k) % 3;
            f.set(fx0 - 2 + k * 2 - p.dir, feet - up - (k % 2) * 2, P.foam);
          }
        if (r >= 0) {
          const wv = Math.floor(r / 150) % 2;
          const sx = ox + (p.dir === 1 ? 2 : 5);
          f.line(sx, oy + 5, sx - p.dir * 2, oy - 1, P.skin);
          f.line(sx + 1, oy + 5, sx + 3 * -p.dir + wv * 2, oy - 2, P.skin);
        }
        return;
      }
      if (p.who === 'woman' && r >= 0) {
        // waving her paddle over her head
        const sw = Math.round(Math.sin(r / 140) * 2);
        const top = oy - 3;
        f.line(headX, feet - 10, headX - 3 + sw, top + 1, P.skin);
        f.line(headX, feet - 10, headX + 3 + sw, top + 1, P.skin);
        f.hline(headX - 7 + sw, headX + 5 + sw, top, P.shaft);
        f.rect(headX + 5 + sw, top - 1, 3, 3, P.blade);
        return;
      }
      if (p.who === 'cap' && r >= 0 && r < REACT * 0.7) {
        // arms out, trying not to go in
        const fl = Math.floor(r / 100) % 2;
        f.line(
          headX + sway,
          feet - 10,
          headX + sway - 5,
          feet - 12 + fl,
          P.skin
        );
        f.line(
          headX + sway,
          feet - 10,
          headX + sway + 5,
          feet - 12 - fl,
          P.skin
        );
        return;
      }
      if (laugh) {
        // pointing at him, the paddle dangling from the other hand
        const mx = posOf(man, t).x;
        const side = mx > x ? 1 : -1;
        const sy = feet - 10;
        f.line(x, sy, x + side * 5, sy - 3, P.skin);
        f.line(x, sy + 1, x - side * 2, sy + 4, P.skin);
        f.line(x - side * 2, sy + 1, x - side * 4, y + 3, P.shaft);
        return;
      }
      paddle(f, x, y, p.dir, t / 1700 + p.ph, P.skin);
    }

    function drawMan(f: Frame, t: number) {
      const a = t - glassesAt;
      if (glassesOn(t)) {
        drawManEgg(f, t, a);
        return;
      }
      const { x, y } = posOf(man, t);
      reflect(f, MAN, MAN_LOOK, man.dir, x, y, t);
      drawBoard(f, x, y, man.dir, man.board);
      const { ox, oy } = spriteAt(MAN, man.dir, x, y);
      sprite(f, MAN, ox, oy, MAN_LOOK, man.dir === -1);
      // the sun winks off his shades now and then
      const gl = (t + 1300) % 4600;
      if (gl < 280)
        f.set(
          man.dir === 1 ? ox + 4 : ox + 1,
          oy + 2,
          gl > 60 && gl < 220 ? P.glint : P.lensHi
        );
      paddle(f, x, y, man.dir, t / 1700 + man.ph, P.skin);
    }

    // one of the women splashing the nearest board
    function splashFight(t: number, p: Paddler) {
      const { x, y } = posOf(p, t);
      const sx = x + p.dir * 9;
      // a sheet of water scooped up with the paddle, flung at her neighbour
      fx.add(t, 1300, (f, age) => {
        const a = age / 1000;
        for (let i = 0; i < 26; i++) {
          const vx = p.dir * (34 + hash2(i, 1, 151) * 46);
          const vy = -(30 + hash2(i, 2, 151) * 34);
          const d = hash2(i, 3, 151) * 0.12;
          const s = Math.max(0, a - d);
          const px = sx + vx * s;
          const py = y - 1 + vy * s + 95 * s * s;
          if (py > y + 2) {
            // where it lands: a little patter on the water
            const tl = (vy + Math.sqrt(vy * vy + 4 * 95 * 3)) / (2 * -95);
            if (a - d - Math.abs(tl) < 0.25)
              f.set(sx + vx * Math.abs(tl), y + 2, P.foamMid);
            continue;
          }
          f.set(px, py, i % 3 ? P.foam : P.streakHi);
          if (i % 2) f.set(px - p.dir, py + 1, P.foamMid);
        }
      });
    }

    // ---------- the kingfisher ----------
    const KF_DIVE = 2600;
    let kfAt = -Infinity;
    const kfStart = (t: number) => {
      if (t - kfAt < KF_DIVE) return kfAt;
      const every = 23_000;
      const s0 = Math.floor((t - 9000) / every) * every + 9000;
      if (s0 >= kfAt && s0 < kfAt + KF_DIVE) return null;
      return t - s0 < KF_DIVE ? s0 : null;
    };
    const kfDive = { x: kfX + 16, y: BANK + 9 };
    function kingfisherAt(t: number) {
      const s = kfStart(t);
      const a = s === null ? -1 : t - s;
      if (a < 0 || a > 1900)
        return {
          x: kfX - 3,
          y: kfY - 5,
          dir: 1 as const,
          fish: a > 0 && a < KF_DIVE,
          under: false,
        };
      if (a < 380) {
        const q = a / 380;
        return {
          x: kfX - 3 + (kfDive.x - kfX + 3) * q,
          y: kfY - 5 + (kfDive.y - kfY + 5) * q * q,
          dir: 1 as const,
          fish: false,
          under: false,
        };
      }
      if (a < 750)
        return {
          x: kfDive.x,
          y: kfDive.y + 2,
          dir: 1 as const,
          fish: false,
          under: true,
        };
      const q = ease((a - 750) / 1150);
      return {
        x: kfDive.x + (kfX - 3 - kfDive.x) * q,
        y: kfDive.y + (kfY - 5 - kfDive.y) * q - Math.sin(q * Math.PI) * 10,
        dir: -1 as const,
        fish: true,
        under: false,
      };
    }
    function drawKingfisher(f: Frame, t: number) {
      const k = kingfisherAt(t);
      const x = Math.round(k.x);
      const y = Math.round(k.y);
      if (k.under) {
        f.blend(x, y, P.kfBack, 0.4);
        f.blend(x + 1, y, P.kfBack, 0.4);
        return;
      }
      sprite(f, KINGFISHER, x, y, KF_LOOK, k.dir === -1);
      // a bob of the head while it waits
      if (k.dir === 1 && Math.floor(t / 1700) % 3 === 0 && t % 1700 < 200)
        f.set(x + 3, y, P.kfBack);
      if (k.fish) {
        const fx0 = k.dir === 1 ? x + 7 : x - 2;
        f.set(fx0, y + 1, P.fish);
        f.set(fx0 + (k.dir === 1 ? 1 : -1), y + 2, P.fish);
      }
    }
    const onKingfisher = (x: number, y: number, t: number) => {
      const k = kingfisherAt(t);
      return Math.abs(x - (k.x + 3)) <= 5 && Math.abs(y - (k.y + 2)) <= 5;
    };

    // ---------- dragonflies and a kite ----------
    const flies = [
      { ax: kx + 14, ay: 114, c: P.flyBlue, rx: 22, ry: 7 },
      { ax: poolMid + 10, ay: 101, c: P.flyRed, rx: 40, ry: 5 },
      { ax: rapidX - 18, ay: 108, c: P.flyBlue, rx: 26, ry: 8 },
    ].slice(0, w < 300 ? 2 : 3);
    function drawFlies(f: Frame, t: number) {
      flies.forEach((fl, i) => {
        const seg = 2100 + i * 400;
        const tt = t + i * 777;
        const n = Math.floor(tt / seg);
        const u = (tt % seg) / seg;
        const pt = (k: number) => ({
          x: fl.ax + (hash2(k, i, 141) - 0.5) * 2 * fl.rx,
          y: fl.ay + (hash2(k, i, 142) - 0.5) * 2 * fl.ry,
        });
        const p0 = pt(n);
        const p1 = pt(n + 1);
        const m = u < 0.78 ? 0 : ease((u - 0.78) / 0.22);
        const x = Math.round(p0.x + (p1.x - p0.x) * m);
        const y = Math.round(
          p0.y + (p1.y - p0.y) * m + Math.sin(t / 380 + i) * 0.6
        );
        const dir = p1.x >= p0.x ? 1 : -1;
        // a long body, the head end dark, wings catching the light
        for (let k = 0; k < 5; k++)
          f.set(x - dir * k, y, k === 0 ? P.flyDark : fl.c);
        f.blend(x - dir, y - 1, P.wing, 0.85);
        f.blend(x - dir * 2, y - 1, P.wing, 0.85);
        f.blend(x - dir, y + 1, P.wing, 0.5);
        if (Math.floor(t / 60) % 2) f.blend(x - dir * 2, y + 1, P.wing, 0.5);
      });
    }
    function drawKite(f: Frame, t: number) {
      const ang = t / 5200;
      const x = Math.round(w * 0.3 + Math.cos(ang) * clamp(w * 0.08, 14, 40));
      const y = Math.round(14 + Math.sin(ang) * 4);
      const tip = Math.sin(t / 900) > 0.6 ? 1 : 0;
      f.hline(x - 1, x + 1, y, P.kite);
      f.set(x - 2, y - tip, P.kite);
      f.set(x + 2, y - tip, P.kite);
      f.set(x - 3, y + 1 - tip, P.kiteHi);
      f.set(x + 3, y + 1 - tip, P.kiteHi);
    }

    // ---------- the trains ----------
    // a three-car Joetsu line local now and then; click the bridge and the
    // SL Gunma Minakami comes through instead, smoke and all
    const TRAIN_EVERY = 34_000;
    const LOCAL_V = 0.045;
    const SL_V = 0.03;
    const SL_LEN = 16 + 9 + 3 * 18;
    let slAt = -Infinity;
    let slDir: 1 | -1 = 1;
    const slDur = (bR - bL + SL_LEN + 20) / SL_V;
    function trainAt(t: number) {
      if (t - slAt >= 0 && t - slAt < slDur) {
        const lead = bL - SL_LEN - 6 + (t - slAt) * SL_V;
        return {
          sl: true,
          x: slDir === 1 ? lead : bR + bL - lead - SL_LEN,
          dir: slDir,
        };
      }
      const len = 3 * 21;
      const dur = (bR - bL + len + 10) / LOCAL_V;
      const n = Math.floor(t / TRAIN_EVERY);
      const s0 = n * TRAIN_EVERY + 6000;
      const p = t - s0;
      if (p < 0 || p > dur) return null;
      if (s0 < slAt + slDur && s0 + dur > slAt) return null;
      const dir: 1 | -1 = n % 2 ? -1 : 1;
      const lead = bL - len + p * LOCAL_V;
      return { sl: false, x: dir === 1 ? lead : bR + bL - lead - len, dir };
    }
    function drawTrain(f: Frame, t: number) {
      const tr = trainAt(t);
      if (!tr) return;
      const put = (x: number, y: number, c: RGB) => {
        if (x > bL && x < bR) f.set(x, y, c);
      };
      if (!tr.sl) {
        for (let c = 0; c < 3; c++) {
          const x0 = Math.round(tr.x + c * 21);
          for (let i = 0; i < 20; i++) {
            const x = x0 + i;
            const win = i % 5 === 2 || i % 5 === 3;
            put(x, DECK - 7, P.steelSh);
            put(x, DECK - 6, P.steelHi);
            put(x, DECK - 5, win ? P.winDark : P.steel);
            put(x, DECK - 4, win ? P.winDark : P.steel);
            put(x, DECK - 3, P.stripeO);
            put(x, DECK - 2, P.stripeG);
            put(
              x,
              DECK - 1,
              i > 2 && i < 17 && (i < 6 || i > 13) ? P.portal : P.steelSh
            );
          }
        }
        return;
      }
      // the steam engine leads, then its tender, then the old brown coaches
      const d = tr.dir;
      const X = (i: number) =>
        Math.round(d === 1 ? tr.x + SL_LEN - 1 - i : tr.x + i);
      const rod = Math.floor(t / 90) % 4;
      for (let i = 0; i < 16; i++) {
        const x = X(i);
        if (i < 11) {
          // the boiler, smokebox at the front
          put(x, DECK - 6, i === 9 ? P.locoBlack : P.locoHi);
          put(x, DECK - 5, P.locoBlack);
          put(x, DECK - 4, P.locoBlack);
          put(x, DECK - 3, i === 0 ? P.locoRed : P.locoBlack);
        } else {
          // the cab
          for (let y = DECK - 9; y <= DECK - 3; y++)
            put(
              x,
              y,
              y === DECK - 9
                ? P.locoHi
                : y === DECK - 7 && i > 12 && i < 15
                  ? P.coachWin
                  : P.locoBlack
            );
        }
        put(x, DECK - 2, P.locoBlack);
        put(x, DECK - 1, (i + rod) % 4 === 0 ? P.locoRed : P.locoBlack);
      }
      put(X(2), DECK - 7, P.locoBlack); // the chimney
      put(X(2), DECK - 8, P.locoBlack);
      put(X(6), DECK - 7, P.brass); // the dome
      put(X(0), DECK - 5, P.lamp);
      for (let i = 16; i < 25; i++) {
        const x = X(i);
        put(x, DECK - 6, P.locoHi);
        for (let y = DECK - 5; y <= DECK - 1; y++) put(x, y, P.locoBlack);
      }
      for (let c = 0; c < 3; c++)
        for (let i = 0; i < 17; i++) {
          const x = X(25 + c * 18 + i);
          const win = i % 4 === 2;
          put(x, DECK - 8, P.coach);
          put(x, DECK - 7, P.coachHi);
          put(x, DECK - 6, win ? P.coachWin : P.coach);
          put(x, DECK - 5, win ? P.coachWin : P.coach);
          put(x, DECK - 4, P.coach);
          put(x, DECK - 3, P.coach);
          put(x, DECK - 2, P.locoBlack);
          put(x, DECK - 1, i === 3 || i === 13 ? P.locoBlack : P.portal);
        }
    }
    /** The SL's smoke: puffs left hanging where the chimney passed. */
    function drawSmoke(f: Frame, t: number) {
      if (!(t - slAt >= 0 && t - slAt < slDur + 2500)) return;
      for (let k = 0; ; k++) {
        const te = slAt + k * 160;
        if (te > t || te > slAt + slDur) break;
        const age = t - te;
        if (age > 2400) continue;
        const lead = bL - SL_LEN - 6 + (te - slAt) * SL_V;
        const x0 = slDir === 1 ? lead : bR + bL - lead - SL_LEN;
        const cxp = slDir === 1 ? x0 + SL_LEN - 3 : x0 + 2;
        if (cxp < bL - 2 || cxp > bR + 2) continue;
        const u = age / 2400;
        const r = (1.2 + u * 3.5) * (0.8 + hash2(k, 1, 181) * 0.45);
        const px = cxp - slDir * u * 8 + Math.sin(k) * u * 3;
        const py = DECK - 9 - u * 22;
        const col = u < 0.3 ? P.smoke : P.smokeHi;
        if (u > 0.85 && k % 2) continue;
        f.disc(px, py, r, (dx, dy) =>
          dx + dy < -r * 0.4 ? P.steam : dx + dy > r * 0.5 ? col : P.steamSh
        );
      }
    }

    // ---------- water, every frame ----------
    function drawWater(f: Frame, t: number) {
      // reflections by the far bank wobble
      for (let y = BANK; y < BANK + 8; y++) {
        const wob = Math.round(Math.sin(y * 0.9 + t / 420) * 0.7);
        const sy = 2 * BANK - y - 1;
        const k = 0.36 - (y - BANK) * 0.04;
        for (let x = 0; x < w; x++)
          f.set(x, y, lerpRGB(waterBase.get(x, y), f.get(x + wob, sy), k));
      }
      // slow streaks drifting down the pool
      for (let y = BANK + 9; y < h; y += 4) {
        const d = (y - BANK) / (h - BANK);
        const v = 0.004 + d * 0.004;
        const n = Math.round(w / (40 + d * 30));
        for (let i = 0; i < n; i++) {
          const x =
            ((hash2(i, y, 101) * (w + 40) + t * v * (0.7 + hash2(i, y, 102))) %
              (w + 40)) -
            20;
          if (x > dropX(y) - 10) continue;
          const len = 2 + Math.round(hash2(i, y, 103) * 3);
          f.hline(x, x + len, y, P.streak);
        }
      }
      // sun glints
      for (let i = 0; i < Math.round(w / 9); i++) {
        const life = 1400;
        const ph = hash2(i, 0, 107) * life;
        const n = Math.floor((t + ph) / life);
        const a = ((t + ph) % life) / life;
        const gx2 = Math.floor(hash2(i, n, 108) * w);
        const gy = BANK + 10 + Math.floor(hash2(i, n, 109) * (h - BANK - 12));
        if (gx2 > dropX(gy) - 3) continue;
        const s = Math.sin(a * Math.PI);
        if (s > 0.3) f.set(gx2, gy, P.glint);
        if (s > 0.85) {
          f.set(gx2 - 1, gy, P.streakHi);
          f.set(gx2 + 1, gy, P.streakHi);
        }
      }
      // the rapid: a white lip on the drop, then foam racing off downstream
      for (let y = BANK; y < h; y++) {
        const e = dropX(y);
        // the smooth tongue speeding up into the drop
        for (let i = 0; i < 2; i++) {
          const sx = e - 9 + ((hash2(i, y, 111) * 9 + t * 0.02) % 9);
          if ((y + i) % 2 === 0)
            f.hline(sx, Math.min(e - 1, sx + 2), y, P.streak);
        }
        // white water: lumps of foam carried off downstream, nearer and
        // faster towards us, thinning out as it calms
        const depth = (y - BANK) / (h - BANK);
        const flow = t * (0.03 + depth * 0.025);
        for (let x = Math.max(0, e); x < w; x++) {
          const u = x - e;
          const v =
            noise2((x - flow) / 6, y / 2.2, 113) * 0.75 +
            noise2((x - flow * 1.3) / 2.5, y / 1.3, 114) * 0.25 +
            (u < 5 ? 0.3 : 0.14 * Math.exp(-u / 45));
          f.set(
            x,
            y,
            v > 0.66
              ? P.foam
              : v > 0.57
                ? P.foamMid
                : v > 0.49
                  ? P.foamSh
                  : v > 0.4
                    ? P.trough
                    : P.troughDk
          );
        }
        f.hline(e, e + 1, y, P.foam);
      }
      // spray thrown up off the rocks in the rapid
      for (const [k, r] of rapidRocks.entries())
        for (let i = 0; i < 3; i++) {
          const ph = (((t / 520 + i * 0.33 + k * 0.17) % 1) + 1) % 1;
          const sx = r.x - 3 + i * 2 + ph * 4;
          const sy = r.y - 1 - Math.sin(ph * Math.PI) * (3 + i);
          f.set(sx, sy, P.foam);
        }
    }

    // ---------- putting it together ----------
    const base = new Frame(w, h);
    base.copyFrom(sky);
    base.over(far);
    base.over(walls);
    base.over(bridge);
    base.over(bank);
    base.over(waterBase);
    // a thin waterfall dropping through the trees on the sunny wall, seen in
    // glimpses between the crowns
    const wfX = Math.round(
      Math.min(w - 8, gx + floorHalf + clamp(w * 0.15, 26, 90))
    );
    const wfTop = Math.round(wallR(wfX)) + 8;
    let wfBottom = 70;
    while (wfBottom < BANK && !bank.opaque(wfX, wfBottom)) wfBottom++;
    const wfOpen = Array.from(
      { length: h },
      (_, y) => noise1(y * 0.22, 171) > 0.36 || y > wfBottom - 7
    );
    const wfStep = (y: number) =>
      Math.floor(clamp01(noise1(y * 0.07, 172) * 1.4 - 0.2) * 2.99) - 1;
    function drawFall(f: Frame, t: number) {
      for (let y = wfTop; y < wfBottom; y++) {
        if (!wfOpen[y]) continue;
        // it steps sideways over a ledge or two on the way down
        const x0 = wfX + wfStep(y);
        const wide = y - wfTop < 8 ? 1 : y > wfBottom - 10 ? 3 : 2;
        for (let k = 0; k < wide; k++) {
          const v = Math.floor(y - t * 0.035 + k * 2);
          const c = ((v % 6) + 6) % 6 === 0 ? P.foamSh : k ? P.foamMid : P.foam;
          f.set(x0 + k, y, c);
        }
        f.set(x0 + wide, y, P.sunDeep); // wet rock beside it
        if (wfStep(y + 1) !== wfStep(y)) {
          // a burst of white where it hits the ledge
          const b = Math.floor(t / 150) % 2;
          f.hline(x0 - 1, x0 + wide + 1, y, P.foam);
          f.set(x0 - 2 + b, y - 1, P.foamMid);
          f.set(x0 + wide + 1 - b, y - 1, P.foamMid);
        }
      }
      // spray where it lands behind the boulders
      const m = Math.floor(t / 200) % 2;
      for (let k = -2; k <= 4; k++)
        f.blend(wfX + k, wfBottom - 1 - ((k + m) % 2), P.foam, 0.55);
    }

    const skyRows = 30;
    const isSky = new Uint8Array(w * skyRows);
    for (let y = 0; y < skyRows; y++)
      for (let x = 0; x < w; x++)
        isSky[y * w + x] =
          far.opaque(x, y) || walls.opaque(x, y) || bridge.opaque(x, y) ? 0 : 1;

    // hit areas
    const manSpot = (t: number) => {
      const { x } = posOf(man, t);
      return { x, y: man.row - 7 };
    };
    const MAN_R = 11;
    const KAPPA_R = 8;
    const onCuke = (x: number, y: number) =>
      Math.hypot(x - cukeX - 4, y - cukeY - 1) <= KAPPA_R;
    const womanAt = (x: number, y: number, t: number) =>
      paddlers.find((p) => {
        if (p.who === 'man') return false;
        const q = posOf(p, t);
        return (
          Math.abs(x - q.x) <= BOARD_L / 2 && y >= q.y - 17 && y <= q.y + 2
        );
      });

    let now = 0; // the last frame's time, for hot()
    return {
      render(f, t) {
        now = t;
        f.copyFrom(base);
        // small clouds drifting over (only where it's sky)
        const off = Math.round(t / 900);
        for (let y = 0; y < skyRows; y++)
          for (let x = 0; x < w; x++) {
            if (!isSky[y * w + x]) continue;
            const sx = (((x + off) % w) + w) % w;
            if (cloudLayer.opaque(sx, y)) f.set(x, y, cloudLayer.get(sx, y));
          }
        drawKite(f, t);
        drawFall(f, t);
        drawTrain(f, t);
        drawSmoke(f, t);
        drawWater(f, t);
        drawKingfisher(f, t);
        fx.draw(f, t);
        // back row first, then the near one
        for (const p of paddlers) if (p.row < ROW_NEAR) drawWoman(f, p, t);
        for (const p of paddlers)
          if (p.row >= ROW_NEAR && p !== man) drawWoman(f, p, t);
        drawMan(f, t);
        drawGlasses(f, t);
        f.over(front);
        if (cukeThere(t)) {
          // its shadow on the rock, and now and then a bead of dew glints
          f.hline(cukeX, cukeX + 9, cukeY + 3, P.graniteSh);
          drawCucumber(f, cukeX, cukeY, 9);
          // (a fresh one, just put out after the kappa's been)
          const fresh = t - kappaAt - K.end;
          if (fresh >= 0 && fresh < 500) {
            const r = 2 + Math.round((fresh / 500) * 4);
            for (const [dx, dy] of [
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1],
            ] as const)
              f.set(cukeX + 4 + dx * r, cukeY + 1 + dy * r, P.glint);
          }
          const dew = t % 3700;
          if (dew < 300) {
            const r = dew < 150 ? 2 : 1;
            for (let k = 1; k <= r; k++) {
              f.set(cukeX + 6 - k, cukeY, P.glint);
              f.set(cukeX + 6 + k, cukeY, P.glint);
              f.set(cukeX + 6, cukeY - k, P.glint);
            }
          }
        }
        drawKappa(f, t);
        drawFlies(f, t);
        fxTop.draw(f, t);
        drawGlint(f, t);
        // the kappa's glint lights up the whole river for a moment
        const ga = t - kappaAt;
        if (kappaOn(t) && ga > K.glint && ga < K.glint + 220) {
          const al = 0.28 * Math.sin(((ga - K.glint) / 220) * Math.PI);
          for (let i = 0; i < f.pixels.length; i++) {
            const x = i % w;
            f.blend(x, (i - x) / w, P.glint, al);
          }
        }
        // and the man hitting the water shakes the picture
        const ma = t - glassesAt;
        if (ma >= G.hit && ma < G.hit + 280) {
          const dy = Math.floor((ma - G.hit) / 45) % 2 ? 1 : -1;
          if (dy > 0) f.pixels.copyWithin(w, 0, (h - 1) * w);
          else f.pixels.copyWithin(0, w);
        }
      },
      poke(x, y, t) {
        // the cucumber: here comes the kappa (never restarted mid-way)
        if (cukeThere(t) && !kappaOn(t) && onCuke(x, y)) {
          kappaAt = t;
          bigSplash(fxTop, t + K.pop, emerge.x, emerge.y, 8, 3);
          rings(fx, t + K.pop, emerge.x, emerge.y, 34, 3, 3);
          bigSplash(fxTop, t + K.splash, emerge.x + 6, emerge.y, 9, 4);
          rings(fx, t + K.splash, emerge.x + 6, emerge.y, 44, 4, 4);
          return;
        }
        if (kappaOn(t) && onCuke(x, y)) return;
        // the man's board: in he goes
        const ms = manSpot(t);
        if (Math.hypot(x - ms.x, y - ms.y) <= MAN_R) {
          if (!glassesOn(t)) {
            glassesAt = t;
            const fall = fallAt(t);
            bigSplash(fxTop, t + G.hit, fall.x, fall.y, 13, 7);
            rings(fx, t + G.hit, fall.x, fall.y + 1, 60, 4, 7);
            const land = glassesPath(t, G.fly + FLY + 1);
            bigSplash(fxTop, t + G.fly + FLY, land.x, land.y, 3, 8);
            rings(fx, t + G.fly + FLY, land.x, land.y, 12, 2, 8);
          }
          return;
        }
        if (onKingfisher(x, y, t)) {
          if (kfStart(t) === null) {
            kfAt = t;
            bigSplash(fxTop, t + 380, kfDive.x, kfDive.y, 3, 11);
            ripple(fx, t + 380, kfDive.x, kfDive.y, P.streakHi, {
              rings: 2,
              size: 10,
              squash: 0.35,
            });
          }
          return;
        }
        const p = womanAt(x, y, t);
        if (p) {
          if (reacting(p.who, t) < 0) {
            reactAt.set(p.who, t);
            if (p.who === 'bun') splashFight(t, p);
          }
          return;
        }
        if (onBridge(x, y)) {
          if (!trainAt(t)) {
            slAt = t;
            slDir = slDir === 1 ? -1 : 1;
          }
          return;
        }
        if (y >= BANK) {
          ripple(fx, t, x, y, P.streakHi, {
            rings: 3,
            size: 12,
            squash: 0.35,
          });
          const s = Math.round(t) % 97;
          fx.add(t, 650, (f, age) => {
            const a = age / 1000;
            for (let i = 0; i < 8; i++) {
              const vx = (hash2(i, 1, s) - 0.5) * 36;
              const vy = -20 - hash2(i, 2, s) * 26;
              const py = y + vy * a + 80 * a * a;
              if (py > y) continue;
              f.set(x + vx * a, py, i % 2 ? P.foam : P.streakHi);
            }
          });
        }
      },
      hot(x, y) {
        const t = now;
        const ms = manSpot(t);
        return (
          y >= BANK ||
          onCuke(x, y) ||
          Math.hypot(x - ms.x, y - ms.y) <= MAN_R ||
          onKingfisher(x, y, t) ||
          onBridge(x, y) ||
          !!womanAt(x, y, t)
        );
      },
      eggs(t) {
        const out: EggSpot[] = [];
        if (!glassesOn(t)) {
          const ms = manSpot(t);
          out.push({ id: 'glasses', x: ms.x, y: ms.y, r: MAN_R });
        }
        if (cukeThere(t) && !kappaOn(t))
          out.push({ id: 'kappa', x: cukeX + 4, y: cukeY + 1, r: KAPPA_R });
        return out;
      },
    };
  },
};
