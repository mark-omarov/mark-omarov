// Camping at the Fuji Five Lakes on a clear night: Mt. Fuji under the Milky
// Way, doubled in the still lake, and on the near shore a camp. The 4x4 is
// parked by the pines with its awning out and a lantern hanging under it,
// the dome tent glows from inside, and a man, a woman and a kid sit round
// the fire (the kid is roasting a marshmallow), with sausages on the camp
// stove behind them.
//
// Click the fire for a burst of sparks, the kid to set the marshmallow
// alight, the man and woman for a toast, the car to unlock it, the awning
// for its string lights, the tent for its lantern, Fuji's slopes for a cap
// cloud, the lake for a jumping fish and the sky for a shooting star.
//
// Two easter eggs: tap Fuji's summit and a cap cloud rolls in with a flying
// saucer inside, which comes down to beam a fish out of the lake; tap the
// camp stove and the pan flares, the smell of sausages fills the night, and
// a fox comes out of the pines for one.

import { type Frame, lerpRGB, type RGB } from '../frame';
import { Fx, ripple, splash } from '../fx';
import { fbm1, fbm2, hash2, noise1 } from '../noise';
import { canopy, glow, gradient, pine } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';
import {
  CANOE,
  CAR,
  KID,
  KID_POINT,
  MAN,
  MAN_SIP,
  MAN_TOAST,
  paint,
  STOVE,
  tentZones,
  WOMAN,
  WOMAN_SIP,
  WOMAN_TOAST,
} from '../things/fuji-camp';
import { fujisan } from '../things/fuji-mountain';
import {
  type CloseupPalette,
  DASH,
  makeCloseup,
  noseRow,
  RUN,
  SAUS_HELD,
  SIT,
  stamp,
  TROT,
} from '../things/fuji-fox';

const P = palette({
  sky0: '#03050f',
  sky1: '#060a1e',
  sky2: '#0a102c',
  sky3: '#0f173b',
  sky4: '#151f4a',
  sky5: '#1c2958',
  sky6: '#263467',
  sky7: '#344279',
  horizon: '#6a5088',
  mw: '#8c90c8',
  mwWarm: '#c8a0a8',
  star: '#5c6aa8',
  star2: '#9aa4e0',
  starHi: '#eef0ff',
  starWarm: '#ffd9a8',
  // Fuji under starlight
  snowLit: '#dde4ff',
  snowMid: '#a6b2e4',
  snowShade: '#6f7cbc',
  snowDeep: '#525e9e',
  rockLit: '#353f78',
  rock: '#283064',
  rockShade: '#1d2352',
  rockDeep: '#161b44',
  fujiForest: '#111832',
  fujiForestLit: '#182140',
  cap0: '#d4dcfa',
  cap1: '#a0acdc',
  cap2: '#6e7ab4',
  // far shore
  hillDark: '#070b18',
  hill: '#0c1326',
  hillLit: '#131d36',
  hillHi: '#1b2844',
  aoki: '#0e152c',
  aokiLit: '#16203c',
  lamp: '#ffc874',
  lampHot: '#fff2cc',
  lampDim: '#b07444',
  // lake
  water: '#060a1a',
  waterHi: '#26305e',
  waterHi2: '#3a4680',
  fish: '#b8c4e8',
  troutBack: '#3e5a8c',
  troutFin: '#6a8ac0',
  troutPink: '#ff8aa8',
  troutBelly: '#eef2ff',
  // near shore
  ground: '#080b14',
  groundLit: '#111724',
  dirt: '#14141c',
  grass: '#0f1824',
  grassLit: '#1a2636',
  shore: '#1e2638',
  stone: '#2c3446',
  stoneLit: '#4a4c5a',
  stalk: '#05070d',
  cattail: '#2e1c1a',
  pineDark: '#04060c',
  pineMid: '#080c18',
  pineLight: '#0f1626',
  trunk: '#05070c',
  rope: '#3e4050',
  shadow: '#04050a',
  // tent
  tentHot: '#fff0b8',
  tentLit: '#ffc460',
  tent: '#f4943c',
  tentShade: '#c8642c',
  tentDeep: '#8a3a26',
  tentOff: '#2a2230',
  tentOffLit: '#3e2e34',
  tentOffDark: '#1a1622',
  tentGlow: '#ffb060',
  // fire
  fire0: '#fffbe0',
  fire1: '#ffe070',
  fire2: '#ffa63a',
  fire3: '#f2622a',
  fire4: '#b8362a',
  ember: '#ff7a3a',
  log: '#2a1a18',
  logLit: '#6a3a28',
  fireGlow: '#ff9448',
  smokeLo: '#7a5a5a',
  smokeHi: '#3a4064',
  // the car: a sand-coloured 4x4, cool in the shadows
  carK: '#09090f',
  carRim: '#383a46',
  carHub: '#686a78',
  car: '#433f37',
  carLit: '#6f624d',
  carShade: '#2c2b33',
  carDeep: '#14141b',
  glass: '#10162a',
  glassHi: '#2a3456',
  pillar: '#0c0c12',
  rack: '#1c1e27',
  box: '#16181f',
  boxTop: '#343848',
  can: '#3a4630',
  canLit: '#5a6a40',
  bumper: '#17171e',
  headOff: '#5c6478',
  amberOff: '#4e3824',
  tailOff: '#4a1a1e',
  carSeam: '#34312e',
  cabin: '#f2b866',
  cabinHot: '#ffe6b0',
  cabinDim: '#a87448',
  // awning, its lantern and the string lights
  awning: '#3a3830',
  awningLit: '#a8875a',
  awningHot: '#e0b878',
  pole: '#3a3c48',
  bulb: '#ffcf78',
  bulbHot: '#fff4d0',
  bulbOff: '#3a3426',
  wire: '#121218',
  canoe: '#2a4636',
  canoeLit: '#4e7a5a',
  canoeDark: '#162420',
  gunwale: '#7a5634',
  cooler: '#2a4c60',
  coolerLit: '#c8d4d8',
  // the campers
  // the man: short light-brown hair and beard, dimmed by the night, warmer
  // on the side the fire's on
  hair: '#4e3a2a',
  hairLit: '#8a6a48',
  beard: '#6a4e36',
  skin: '#e09a74',
  hoodie: '#1f2029',
  hoodieLit: '#9a6a52',
  hoodieShade: '#121219',
  jeans: '#2c4a86',
  jeansLit: '#5a7ac0',
  shoes: '#a8a4ae',
  chair: '#173030',
  chairLit: '#2c584c',
  chairFrame: '#3a3e4c',
  mug: '#d8dce8',
  mug2: '#6aa8a4',
  // the woman: long straight hair, near black (a warm edge from the fire)
  wHair: '#141016',
  wHairLit: '#3e2a26',
  sweater: '#5a524c',
  sweaterLit: '#e4c49c',
  blanket: '#6a4e24',
  blanketLit: '#c8963c',
  kidHair: '#5a3c26', // long brown hair, out from under her beanie
  kidHat: '#1e4a4a',
  kidHatLit: '#3e8070',
  pom: '#e8dcb0',
  jacket: '#7a2426',
  jacketLit: '#e45a3c',
  pants: '#232734',
  pantsLit: '#4c4c5e',
  boots: '#3a2a22',
  stick: '#8a6a48',
  marsh: '#f6efdc',
  char: '#2a1c18',
  steam: '#8a8aa8',
  // car lights
  headlight: '#f4f8ff',
  amber: '#ffb347',
  tail: '#ff4a3d',
  sat: '#a0a6d0',
  // the camp kitchen
  table: '#5a4634',
  tableLit: '#8a6a48',
  stoveTop: '#8a8e9c',
  stoveBody: '#3e4250',
  pan: '#4a4a54',
  panIn: '#141418',
  panBase: '#26262c',
  handle: '#1a1210',
  sausage: '#a83c28',
  sausageLit: '#ee8e70',
  sausageShade: '#6e2418',
  burner: '#3a7cff',
  burnerHot: '#a8d0ff',
  grease: '#fff2c8',
  cookSmokeLit: '#d89a70',
  cookSmoke: '#8c8a96',
  cookSmokeHi: '#4a5070',
  // the fox: a hue-shifted orange, white fur, dark points
  foxA: '#f08a3c',
  foxB: '#d8682a',
  foxC: '#a8481e',
  foxD: '#6a2c14',
  foxW: '#fff4e0',
  foxW2: '#ecd6b8',
  foxW3: '#c0a080',
  foxK: '#3a1c12',
  foxKK: '#1a0c08',
  foxEarIn: '#f6dcc0',
  foxEarShade: '#d89878',
  sausageEnd: '#42140c',
  sausageGlint: '#ffd0b8',
  // the close-up
  cuBack: '#2a1c1a',
  cuPanRim: '#9a9eac',
  cuPanHi: '#c8ccd8',
  cuPanDark: '#22222a',
  cuSweaterLit: '#a08a76',
  cuMugShade: '#b8bcc8',
  cuSkinShade: '#a86a50',
  cuWomanHairLit: '#6a4434',
  cuHatLit: '#4a9080',
  cuPanSide: '#3a3a44',
  cuFrame: '#e8d8b0',
  cuHoodie: '#4a4048',
  cuSweater: '#7a6a5c',
  eyeshine: '#e4ffa8',
  night: '#0a0e1a',
  // the saucer hiding in the cap cloud
  ufoDome: '#4ac8c0',
  ufoDomeHi: '#d8fff4',
  ufoHull: '#a8b0d0',
  ufoHullHi: '#f4f6ff',
  ufoBelly: '#5a6290',
  ufoDark: '#2a3060',
  ufoBeam: '#b8ffe4',
  ufoPort: '#e8fff6',
});

// A flying saucer, far, middling and near: a glass dome on a disc ringed with
// lights (L, chasing round), and a port underneath (g) where the beam comes
// out. d/D dome  u/H hull  K dark trim  y belly
const UFO_SPRITES = [
  ['...dDd...', '..dDDdd..', '.uHHHHHu.', 'LuLuLuLuL', '..KyyyK..'],
  [
    '......dDd......',
    '....dDDddd.....',
    '...KKuuuuuKK...',
    '.uHHHHHHHHHHHu.',
    'LuuLuuLuuLuuLuu',
    '.KyyyyyyyyyyyK.',
    '....KKggggKK...',
  ],
  [
    '.........ddDd.........',
    '.......dDDDDddd.......',
    '......dDDdddddd.......',
    '.....KKKuuuuuuuKK.....',
    '...uuHHHHHHHHHHHHuu...',
    '.uHHHHHHHHHHHHHHHHHHu.',
    'uLuuLuuLuuLuuLuuLuuLuu',
    '.KyyyyyyyyyyyyyyyyyyK.',
    '...KKyyyyyyyyyyyyyKK..',
    '.......KggggggK.......',
  ],
] as const;
const UFO_LIGHTS: RGB[] = [0xff5a6a, 0xffd84a, 0x5ae8ff];
// a rainbow trout (facing left) for the saucer to take a look at:
// d back  D fin  p its pink stripe  S belly  e eye
const FISH = ['...dDd.....', '.dddddddd.d', 'eppppppppdd', '.SSSSSSSS.d'];

const WATER = 86; // far shoreline
const PEAK = 22;
const SQ = 1.06; // the reflection is a touch shorter than the mountain
const BANK = 122; // near shoreline on the camp side
const BACK = 129; // the car and the tent stand here
const FRONT = 147; // the fire and the campers
const FIRE = FRONT - 1;

/** A blob-shaped puff (for smoke), blended so it stays translucent. */
function puff(f: Frame, x: number, y: number, r: number, c: RGB, a: number) {
  const rr = r * r;
  for (let dy = -Math.ceil(r); dy <= r; dy++)
    for (let dx = -Math.ceil(r); dx <= r; dx++)
      if (dx * dx + dy * dy * 1.4 <= rr) f.blend(x + dx, y + dy, c, a);
}

/**
 * A soft, lumpy puff of smoke (rx by ry), blended, its edge crumbling in a
 * pattern that moves with it.
 */
function billow(
  f: Frame,
  x: number,
  y: number,
  rx: number,
  ry: number,
  c: RGB,
  a: number,
  seed: number
) {
  const x0 = Math.round(x);
  const y0 = Math.round(y);
  for (let dy = -Math.ceil(ry); dy <= ry; dy++)
    for (let dx = -Math.ceil(rx); dx <= rx; dx++) {
      const d = (dx / rx) ** 2 + (dy / ry) ** 2;
      if (d > 1) continue;
      if (d > 0.55 && hash2(dx, dy, seed) < (d - 0.55) * 1.6) continue;
      // a little thicker at the heart
      f.blend(x0 + dx, y0 + dy, c, a * (1.25 - d * 0.5));
    }
}

const ease = (v: number) => {
  const c = Math.max(0, Math.min(1, v));
  return c * c * (3 - 2 * c);
};

export const fuji: Scene = {
  id: 'fuji',
  name: 'Fuji Five Lakes',
  country: 'Japan',
  create(w, h) {
    const cx = w / 2;
    const fujiX = Math.round(cx - Math.min(26, w * 0.11));
    const halfBase = 196;

    // ---------- the camp's layout ----------
    // back row: the car (nose to the trees) with its awning reaching back
    // towards the tent; front row: the fire, the kid on its left and the
    // man and woman on its right. Phones get a tighter camp with no awning.
    const wide = w >= 300;
    const pad = Math.round(Math.min(16, w * 0.04));
    const right = Math.min(w - pad, Math.round(cx + 236));
    const carX = right - CAR[0]!.length;
    const carTop = BACK - CAR.length + 1;
    const awn = wide ? 22 : 0; // how far the awning reaches
    const TW = 31;
    const TH = 17;
    const poleX = carX - awn + 1;
    const tentX = wide ? poleX - 8 - TW : carX - 19;
    const tentG = wide ? BACK : BACK + 2;
    // the fire sits between the tent and the car, so its light reaches both
    const fireX = wide ? poleX - 5 : tentX + 16;
    const kidX = fireX - 15;
    const manX = fireX + 6;
    const womanX = manX + 13;
    const canoeX = kidX - 26;
    // the camp kitchen, just behind the woman's chair, and where a fox that
    // smells sausages would sit and wait
    const stoveX = womanX + 13;
    const stoveY = FRONT - STOVE.length + 1;
    const panX = stoveX + 5; // the middle of the pan
    const panY = stoveY + 1; // the sausages' row is just above it
    const sitX = stoveX + 14;
    // where the bank meets the bottom edge (far enough left that the canoe
    // is pulled right up on it, not hanging out over the lake)
    const bankX = Math.min(kidX - 14, tentX - 30, canoeX - 12);
    const bankTop = (x: number) => {
      if (x < bankX) return h;
      const rise = Math.min(1, (x - bankX) / 34);
      return Math.round(
        h -
          (h - BANK) * rise * rise * (3 - 2 * rise) +
          (noise1(x * 0.3, 8) - 0.5) * 1.4
      );
    };

    // the first bank pixel on each row (where the water ends)
    const shore = new Int16Array(h).fill(w);
    for (let x = w - 1; x >= bankX; x--)
      for (let y = Math.max(0, bankTop(x)); y < h; y++) shore[y] = x;

    const fx = new Fx();
    const skyFx = new Fx();
    const campFx = new Fx();

    // ---------- sky ----------
    // the Milky Way rises out of the trees behind the camp and climbs up to the left
    const mwA = { x: w * 0.97, y: WATER + 8 };
    const mwB = { x: w * 0.5, y: -14 };
    const mwLen = Math.hypot(mwB.x - mwA.x, mwB.y - mwA.y);
    const mwD = { x: (mwB.x - mwA.x) / mwLen, y: (mwB.y - mwA.y) / mwLen };
    const milky = (x: number, y: number) => {
      const rx = x - mwA.x;
      const ry = y - mwA.y;
      const along = (rx * mwD.x + ry * mwD.y) / mwLen;
      const perp = rx * mwD.y - ry * mwD.x + (noise1(along * 5, 51) - 0.5) * 8;
      const hw = (18 - 8 * along) * (0.65 + noise1(along * 4, 54) * 0.7);
      const inside = 1 - Math.abs(perp) / hw;
      if (inside <= 0) return { v: 0, along };
      // clumpy star clouds, with dust lanes cutting through them
      const n = fbm2(x / 9, y / 9, 52, 3);
      const m = fbm2(x / 6 + 30, y / 6, 55, 2);
      let v =
        0.36 + Math.pow(inside, 0.6) * n * 1.1 + Math.max(0, 0.4 - along) * 0.8;
      const rift = 1 + (noise1(along * 6, 53) - 0.5) * 8;
      if (
        along > 0.06 &&
        along < 0.9 &&
        Math.abs(perp - rift) < (1 + m * 4) * Math.min(1, inside * 2)
      )
        v -= 0.5;
      else if (m < 0.33) v -= 0.18;
      if (inside < 0.18) v -= 0.25;
      return { v, along };
    };

    const back = layer(w, h, (f) => {
      gradient(f, 0, WATER, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
        P.sky7,
      ]);
      // a town's glow far off to the left
      glow(
        f,
        w * 0.12,
        WATER,
        Math.max(70, w * 0.28),
        P.horizon,
        0.42,
        0.28,
        0.1
      );
      for (let y = 0; y < WATER; y++) {
        for (let x = 0; x < w; x++) {
          const { v, along } = milky(x, y);
          if (v < 0.32) continue;
          const tint = along < 0.3 ? P.mwWarm : P.mw;
          f.blend(
            x,
            y,
            tint,
            v > 1.1 ? 0.54 : v > 0.82 ? 0.37 : v > 0.58 ? 0.23 : 0.12
          );
        }
      }
      // stars: a thin field everywhere, crowded inside the band
      const n = Math.round(w * 0.55);
      for (let i = 0; i < n; i++) {
        const x = Math.floor(hash2(i, 1, 61) * w);
        const y = Math.floor(Math.pow(hash2(i, 2, 61), 1.3) * (WATER - 4));
        const r = hash2(i, 3, 61);
        f.set(
          x,
          y,
          r > 0.93
            ? P.starHi
            : r > 0.75
              ? P.star2
              : r > 0.7
                ? P.starWarm
                : P.star
        );
      }
      for (let i = 0; i < w * 5; i++) {
        const x = Math.floor(hash2(i, 4, 62) * w);
        const y = Math.floor(hash2(i, 5, 62) * WATER);
        const { v } = milky(x, y);
        if (v < 0.45 || hash2(i, 6, 62) > (v - 0.3) * 0.5) continue;
        const r = hash2(i, 7, 62);
        f.set(x, y, r > 0.9 ? P.starHi : r > 0.55 ? P.star2 : P.mw);
      }
    });

    // ---------- land across the lake ----------
    const leftEnd = Math.min(w * 0.3, fujiX - 46);
    const rightStart = Math.max(w * 0.72, fujiX + 120);
    const hillTop = (x: number) => {
      const l = Math.max(0, 1 - x / leftEnd);
      const r = Math.max(0, (x - rightStart) / Math.max(40, w - rightStart));
      const lh = 24 * Math.pow(l, 1.25) * (0.8 + fbm1(x / 22, 71) * 0.4);
      const rh =
        30 * Math.pow(Math.min(1, r), 0.8) * (0.8 + fbm1(x / 20, 72) * 0.4);
      return WATER - 3 - Math.max(lh, rh);
    };
    const aokiTop = (x: number) => WATER - 4 - Math.round(fbm1(x / 9, 73) * 3);
    const landTop = new Int16Array(w);
    const land = layer(w, h, (f) => {
      fujisan(f, fujiX, PEAK, WATER, {
        halfBase,
        snow: 0.4,
        fingers: 0.3,
        forest: 0.16,
        seed: 4,
        style: {
          snowLit: P.snowLit,
          snowMid: P.snowMid,
          snowShade: P.snowShade,
          snowDeep: P.snowDeep,
          rockLit: P.rockLit,
          rock: P.rock,
          rockShade: P.rockShade,
          rockDeep: P.rockDeep,
          forest: P.fujiForest,
          forestLit: P.fujiForestLit,
        },
      });
      // Aokigahara: flat forest at Fuji's foot, right across the far shore
      for (let x = 0; x < w; x++) f.vline(x, aokiTop(x) + 1, WATER - 1, P.aoki);
      canopy(
        f,
        (x, y) => y >= aokiTop(x) + 1 && y < WATER,
        { dark: P.aoki, mid: P.aoki, light: P.aokiLit },
        { seed: 74, y0: WATER - 8, y1: WATER, size: 1.6, step: 2 }
      );
      // wooded hills either side
      for (let x = 0; x < w; x++) {
        const top = Math.round(hillTop(x));
        if (top < WATER - 4) f.vline(x, top + 2, WATER - 1, P.hill);
      }
      canopy(
        f,
        (x, y) => y >= hillTop(x) + 1 && y < WATER - 1,
        { dark: P.hill, mid: P.hill, light: P.hill, hi: P.hillLit },
        { seed: 75, y0: 40, y1: WATER, size: 3, step: 3 }
      );
    });
    // sky and land in one opaque layer, and its reflection
    const backAll = layer(w, h, (f) => {
      f.copyFrom(back);
      f.over(land);
    });
    for (let x = 0; x < w; x++) {
      // landTop holds the first land pixel; anything above it is sky
      let y = 0;
      while (y < WATER && !land.opaque(x, y)) y++;
      landTop[x] = y;
    }
    const lake = layer(w, h, (f) => {
      for (let y = WATER; y < h; y++) {
        const d = y - WATER;
        const sy = WATER - 1 - Math.floor(d * SQ);
        const fade = 0.8 - (d / (h - WATER)) * 0.32;
        for (let x = 0; x < w; x++) {
          const src = sy >= 0 ? backAll.get(x, sy) : P.sky0;
          f.set(x, y, lerpRGB(P.water, src, fade));
        }
      }
      // the far shore's edge: a thin dark line where the water meets the trees
      f.hline(0, w - 1, WATER, P.hillDark);
    });

    // lights on the far shore: a lakeside town on the left, a few lodges
    const lights: { x: number; c: RGB; seed: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const x = Math.round(
        w * 0.04 + hash2(i, 1, 81) * Math.max(30, leftEnd - w * 0.02)
      );
      lights.push({ x, c: i % 3 ? P.lamp : P.lampHot, seed: i });
    }
    for (const dx of [-58, 36, 92])
      if (fujiX + dx > 0 && fujiX + dx < bankX)
        lights.push({ x: fujiX + dx, c: P.lampDim, seed: dx });

    // ---------- the near shore ----------
    const tree = {
      dark: P.pineDark,
      mid: P.pineMid,
      light: P.pineLight,
      trunk: P.trunk,
    };
    // the awning: canvas from the back of the roof rack out to a pole
    const awnY0 = carTop + 3; // where it leaves the rack
    const awnY1 = awnY0 + 3; // its outer edge
    const awnAt = (x: number) =>
      Math.round(
        awnY0 + ((carX + 2 - x) / (carX + 2 - poleX)) * (awnY1 - awnY0)
      );
    const lanternX = carX - Math.round(awn * 0.45);
    const lanternY = awnAt(lanternX) + 3;

    const carColor: Record<string, RGB> = {
      k: P.carK,
      r: P.carRim,
      R: P.carHub,
      b: P.car,
      B: P.carLit,
      d: P.carShade,
      D: P.carDeep,
      w: P.glass,
      p: P.pillar,
      m: P.rack,
      x: P.box,
      X: P.boxTop,
      j: P.can,
      J: P.canLit,
      g: P.bumper,
      h: P.headOff,
      a: P.amberOff,
      l: P.tailOff,
      s: P.carK,
      S: P.carRim,
      n: P.pillar,
      e: P.carSeam,
    };

    const fg = layer(w, h, (f) => {
      // pines behind the camp, cropped by the top of the frame
      pine(f, w - 6, BANK + 4, wide ? 128 : 104, tree, 7);
      pine(f, w - (wide ? 30 : 22), BANK + 2, wide ? 76 : 60, tree, 8);
      if (w > 520) pine(f, w - 70, BANK + 1, 52, tree, 9);
      // the bank: grass down to a stony edge at the water
      for (let x = bankX; x < w; x++) {
        const top = bankTop(x);
        for (let y = top; y < h; y++) {
          let c = P.ground;
          if (y === top) c = P.shore;
          else if (y === top + 1) c = P.stone;
          else if (y < top + 4) c = P.grass;
          f.set(x, y, c);
        }
        for (let y = top + 5; y < h; y += 3)
          if (hash2(x, y, 83) > 0.9) f.hline(x, x + 1, y, P.grass);
        // grass tufts
        const tuft = hash2(x, 0, 84);
        if (tuft > 0.7)
          for (let j = 1; j <= 1 + Math.round(tuft * 3); j++)
            f.set(x, top - j + 2, P.grassLit);
      }
      // trodden earth round the fire
      for (let dy = -3; dy <= 3; dy++)
        for (let dx = -20; dx <= 20; dx++)
          if ((dx / 20) ** 2 + (dy / 3.4) ** 2 < 1)
            f.set(fireX + dx, FIRE + dy, P.dirt);
      // the car's shadow on the grass
      for (let dx = 2; dx < CAR[0]!.length - 1; dx++) {
        f.set(carX + dx, BACK, P.shadow);
        if (dx > 4 && dx < CAR[0]!.length - 4)
          f.set(carX + dx, BACK + 1, P.shadow);
      }
      paint(f, CAR, carX, carTop, (ch) => carColor[ch] ?? null);
      // a sky-blue glint along the glass
      for (let dx = 4; dx < 38; dx++) {
        const y = carTop + 6 + ((dx * 3) % 4);
        if (CAR[y - carTop]![dx] === 'w' && (dx + 2) % 9 < 2)
          f.set(carX + dx, y, P.glassHi);
      }
      if (wide) {
        // the awning, its pole and guy line, and a cooler underneath
        for (let x = poleX; x <= carX + 2; x++) {
          const y = awnAt(x);
          f.set(x, y, P.awning);
          f.set(x, y + 1, P.awningLit);
        }
        f.vline(poleX, awnY1 + 2, BACK, P.pole);
        f.vline(poleX, awnY1 + 1, awnY1 + 2, P.awning); // the valance
        f.rect(lanternX - 3, BACK - 4, 7, 5, P.cooler);
        f.hline(lanternX - 3, lanternX + 3, BACK - 4, P.coolerLit);
        f.hline(lanternX - 3, lanternX + 3, BACK - 3, P.coolerLit);
        f.set(lanternX, lanternY - 2, P.wire);
        f.set(lanternX, lanternY - 1, P.wire);
      }
      // the canoe, pulled up out of the water
      paint(f, CANOE, canoeX, FRONT - 4, (c) =>
        c === 'w'
          ? P.gunwale
          : c === 'H'
            ? P.canoeLit
            : c === 'h'
              ? P.canoe
              : P.canoeDark
      );
      // firewood stacked by the cooler
      if (wide) {
        const wood = lanternX + 5;
        f.hline(wood, wood + 4, BACK, P.log);
        f.hline(wood, wood + 4, BACK - 1, P.log);
        f.hline(wood + 1, wood + 3, BACK - 2, P.log);
        f.set(wood, BACK, P.logLit);
        f.set(wood, BACK - 1, P.logLit);
        f.set(wood + 1, BACK - 2, P.logLit);
      }
      // the tent's guy lines and pegs
      f.line(tentX + 2, tentG - 8, tentX - 4, tentG, P.rope);
      f.line(tentX + TW - 3, tentG - 8, tentX + TW + 2, tentG - 1, P.rope);
      f.set(tentX - 4, tentG - 1, P.stoneLit);
    });

    // where firelight lands: the bank and everything on it, never the water
    // (1 = the ground, which takes it more softly; 2 = things standing on it)
    const lit = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) lit[i] = fg.pixels[i]! >>> 24 ? 1 : 0;
    const things = layer(w, h, (f) => {
      paint(f, CAR, carX, carTop, () => 1);
    });
    for (let i = 0; i < w * h; i++) if (things.pixels[i]! >>> 24) lit[i] = 2;
    const tent = tentZones(TW, TH);
    const tentTop = tentG - TH + 1;
    const markLit = (x0: number, y0: number, rows: readonly string[]) => {
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          const x = x0 + rx;
          const y = y0 + ry;
          if (row[rx] !== '.' && x >= 0 && x < w && y >= 0 && y < h)
            lit[y * w + x] = 2;
        }
      });
    };
    markLit(tentX, tentTop, tent.rows);
    markLit(manX, FRONT - MAN.length + 1, MAN);
    markLit(manX, FRONT - MAN.length + 1, MAN_SIP);
    markLit(manX, FRONT - MAN.length + 1, MAN_TOAST);
    markLit(womanX, FRONT - 1 - WOMAN.length + 1, WOMAN);
    markLit(womanX, FRONT - 1 - WOMAN.length + 1, WOMAN_SIP);
    markLit(womanX, FRONT - 1 - WOMAN.length + 1, WOMAN_TOAST);
    if (wide) markLit(lanternX + 5, BACK - 2, ['.xxx', 'xxxxx', 'xxxxx']);
    markLit(stoveX, stoveY, STOVE);
    markLit(kidX, FRONT - KID.length + 1, KID);
    markLit(kidX - 1, FRONT - KID.length + 1, KID_POINT);
    markLit(canoeX, FRONT - 4, CANOE);

    /** Stepped warm light like glow(), but only on things in `lit`. */
    function light(
      f: Frame,
      cx: number,
      cy: number,
      r: number,
      c: RGB,
      strength: number,
      squash: number
    ) {
      for (
        let y = Math.max(0, Math.floor(cy - r * squash));
        y <= Math.min(h - 1, cy + r * squash);
        y++
      ) {
        for (
          let x = Math.max(0, Math.floor(cx - r));
          x <= Math.min(w - 1, cx + r);
          x++
        ) {
          const lv = lit[y * w + x];
          if (!lv) continue;
          const d = Math.hypot(x - cx, (y - cy) / squash) / r;
          if (d >= 1) continue;
          const ring = Math.ceil((1 - d) * 4) / 4;
          f.blend(x, y, c, strength * ring * ring * (lv === 2 ? 1 : 0.6));
        }
      }
    }

    // reeds and cattails in the bottom-left corner
    const clump = Math.min(60, w * 0.15);
    const reeds = Array.from(
      { length: Math.max(7, Math.round(w / 34)) },
      (_, i) => ({
        x: Math.round(2 + Math.pow(hash2(i, 1, 91), 1.3) * clump),
        h: 12 + Math.round(hash2(i, 2, 91) * 20),
        lean: 0.5 + hash2(i, 3, 91) * 3,
        head: hash2(i, 4, 91) > 0.45,
        seed: i,
      })
    );
    const blades = Array.from({ length: Math.round(clump / 4) }, (_, i) => ({
      x: Math.round(Math.pow(hash2(i, 5, 91), 1.4) * (clump + 8)),
      len: 6 + Math.round(hash2(i, 6, 91) * 12),
      dir: hash2(i, 7, 91) > 0.35 ? 1 : -1,
    }));

    function drawReeds(f: Frame, t: number) {
      for (const b of blades) {
        for (let j = 0; j < b.len; j++) {
          const v = j / b.len;
          f.set(
            b.x + Math.round(b.dir * v * v * b.len * 0.6),
            h - 1 - Math.round(j * (1 - v * 0.5)),
            P.stalk
          );
        }
      }
      for (const r of reeds) {
        const sway =
          Math.sin(t / 1900 + r.seed * 1.3) * 0.9 +
          Math.sin(t / 830 + r.seed) * 0.25;
        let px = r.x;
        let py = h - 1;
        for (let j = 0; j < r.h; j++) {
          const v = j / r.h;
          px = Math.round(r.x + (r.lean + sway) * v * v);
          py = h - 1 - j;
          f.set(px, py, P.stalk);
          // the cattail's brown head, a little below the tip
          if (r.head && v > 0.62 && v < 0.86)
            f.hline(px, px + 1, py, P.cattail);
        }
      }
    }

    // ---------- the tent ----------
    let lanternOn = true;
    let lanternAt = -Infinity;
    const lx = tentX + tent.apex.x;
    const ly = tentTop + 8;
    function drawTent(f: Frame, t: number) {
      const since = t - lanternAt;
      // the lantern stutters for a moment when it's switched on
      const on =
        lanternOn && !(since < 320 && Math.floor(since / 60) % 2 === 1);
      tent.rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          const z = row[rx]!;
          if (z === '.') continue;
          const x = tentX + rx;
          const y = tentTop + ry;
          let c: RGB;
          if (on) {
            // the lantern hangs under the apex: rings of light through the fabric
            const d = Math.hypot((x - lx) * 0.8, y - ly);
            const side =
              z === 'R' || z === 'V' || (z === 'o' && x > lx) ? 1 : 0;
            const lvl = (d < 5 ? 0 : d < 10 ? 1 : d < 14 ? 2 : 3) + side;
            const ramp = [
              P.tentLit,
              P.tent,
              P.tentShade,
              P.tentDeep,
              P.tentDeep,
            ];
            c =
              z === 'L' || z === 'R'
                ? ramp[lvl]!
                : z === 'V'
                  ? ramp[Math.max(0, lvl - 1)]!
                  : z === 'P'
                    ? ramp[Math.min(4, lvl + 2)]!
                    : z === 'o'
                      ? ramp[Math.min(4, lvl + 1)]!
                      : z === 'D'
                        ? y < tentG - 3
                          ? P.tentHot
                          : P.tentLit
                        : z === 'q'
                          ? P.tent
                          : z === 'Z' || z === 'F'
                            ? ramp[Math.min(4, lvl + 1)]!
                            : P.tentDeep;
          } else {
            c =
              z === 'L' || z === 'V'
                ? P.tentOffLit
                : z === 'R'
                  ? P.tentOff
                  : z === 'D' || z === 'q'
                    ? P.shadow
                    : P.tentOffDark;
          }
          f.set(x, y, c);
        }
      });
      if (on) {
        // the lantern itself, seen through the door
        f.set(tentX + tent.door.x + 1, tentTop + tent.door.y + 1, P.bulbHot);
        glow(f, lx, ly + 2, 24, P.tentGlow, 0.26, 0.55, 0.14);
        // light spilling out of the door onto the grass
        light(f, tentX + tent.door.x, tentG + 2, 26, P.tentGlow, 0.32, 0.45);
      }
    }

    // ---------- the car: interior light, hazards and headlights ----------
    let carAt = -Infinity;
    const CAR_FOR = 6400;
    function drawCarLights(f: Frame, t: number) {
      const age = t - carAt;
      if (age < 0 || age > CAR_FOR) return;
      // the dome light fades up, stays on a while, then fades out
      const cabin = Math.min(ease(age / 500), 1 - ease((age - 4600) / 1500));
      if (cabin > 0.02) {
        for (let ry = 6; ry <= 9; ry++) {
          const row = CAR[ry]!;
          for (let rx = 0; rx < row.length; rx++) {
            if (row[rx] !== 'w') continue;
            const near = Math.abs(rx - 18) / 18; // the lamp is mid-cabin
            const c =
              near < 0.35 && ry < 8
                ? P.cabinHot
                : near < 0.75
                  ? P.cabin
                  : P.cabinDim;
            f.set(
              carX + rx,
              carTop + ry,
              lerpRGB(f.get(carX + rx, carTop + ry), c, cabin)
            );
          }
        }
        glow(f, carX + 18, carTop + 8, 18, P.cabin, 0.18 * cabin, 0.6, 0.1);
      }
      // two blinks of the hazards as it unlocks, and the headlights on
      const blink = (age < 260 || (age > 520 && age < 780)) && age < 900;
      if (blink) {
        const front = { x: carX + 46, y: carTop + 13 };
        const rear = { x: carX + 2, y: carTop + 12 };
        f.set(front.x, front.y, P.amber);
        f.set(rear.x, rear.y, P.amber);
        f.set(rear.x + 1, rear.y, P.amber);
        glow(f, front.x, front.y, 5, P.amber, 0.55, 1, 0.15);
        glow(f, rear.x, rear.y, 5, P.amber, 0.55, 1, 0.15);
      }
      const head = Math.min(ease(age / 200), 1 - ease((age - 3200) / 900));
      if (head > 0.02) {
        f.set(carX + 46, carTop + 11, P.headlight);
        f.set(carX + 46, carTop + 12, P.headlight);
        glow(f, carX + 47, carTop + 11, 7, P.headlight, 0.55 * head, 1, 0.15);
        // the beam, faint in the night air, and a pool of light by the trees
        for (let k = 2; k < 30; k++) {
          const spread = k * 0.3;
          for (
            let y = Math.round(carTop + 11 - spread * 0.3);
            y <= Math.round(carTop + 12 + spread);
            y++
          )
            f.blend(carX + 46 + k, y, P.headlight, 0.14 * (1 - k / 30) * head);
        }
        light(f, carX + 62, BACK, 20, P.headlight, 0.35 * head, 0.35);
        f.set(carX + 2, carTop + 12, P.tail);
        f.set(carX + 2, carTop + 13, P.tail);
      }
    }

    // ---------- the awning: lantern and string lights ----------
    let bulbsOn = true;
    let bulbsAt = -Infinity;
    const BULB_STEP = 70;
    // the string swoops along the awning's edge, a bulb every 3 px
    const bulbs: { x: number; y: number }[] = [];
    if (wide) {
      for (let x = poleX + 1; x <= carX; x += 3) {
        const u = ((x - poleX) % 9) / 9;
        bulbs.push({
          x,
          y: awnAt(x) + 2 + Math.round(Math.sin(u * Math.PI) * 2),
        });
      }
    } else {
      // no awning on a phone: the string is draped along the roof rack
      for (let x = carX + 4; x <= carX + 34; x += 3) {
        const u = ((x - carX - 4) % 10) / 10;
        bulbs.push({
          x,
          y: carTop + 4 + Math.round(Math.sin(u * Math.PI) * 2),
        });
      }
    }
    function drawAwningLights(f: Frame, t: number) {
      const since = t - bulbsAt;
      // the wire between bulbs
      for (let i = 0; i + 1 < bulbs.length; i++)
        f.line(
          bulbs[i]!.x,
          bulbs[i]!.y - 1,
          bulbs[i + 1]!.x,
          bulbs[i + 1]!.y - 1,
          P.wire
        );
      let lit2 = 0;
      bulbs.forEach((b, i) => {
        // switching runs bulb by bulb from the car outwards
        const k = wide ? bulbs.length - 1 - i : i;
        const on = since < k * BULB_STEP ? !bulbsOn : bulbsOn;
        const gentle = Math.sin(t / 900 + i * 1.7) > 0.85;
        if (on) {
          lit2++;
          f.set(b.x, b.y, gentle ? P.bulbHot : P.bulb);
          f.blend(b.x - 1, b.y, P.bulb, 0.35);
          f.blend(b.x + 1, b.y, P.bulb, 0.35);
          f.blend(b.x, b.y + 1, P.bulb, 0.25);
        } else f.set(b.x, b.y, P.bulbOff);
      });
      if (wide) {
        // the lantern under the awning
        f.set(lanternX, lanternY, P.wire);
        f.set(lanternX - 1, lanternY + 1, P.pole);
        f.set(lanternX, lanternY + 1, P.bulbHot);
        f.set(lanternX + 1, lanternY + 1, P.pole);
        f.set(lanternX, lanternY + 2, P.bulb);
        // light on the canvas above and the ground below
        for (let x = poleX + 1; x <= carX + 2; x++) {
          const d = Math.abs(x - lanternX);
          if (d < 9) f.set(x, awnAt(x) + 1, d < 4 ? P.awningHot : P.awningLit);
        }
        glow(f, lanternX, lanternY + 1, 8, P.bulb, 0.4, 1, 0.12);
        light(f, lanternX, BACK - 3, 22, P.bulb, 0.34, 0.45);
        // a couple of moths that found the lantern
        for (let i = 0; i < 2; i++) {
          const a = t / (260 + i * 90) + i * 2.4;
          f.set(
            lanternX +
              Math.round(Math.sin(a) * (3 + i) + Math.sin(a * 2.3) * 1.2),
            lanternY + 1 + Math.round(Math.cos(a * 1.3) * 2.5),
            P.mug
          );
        }
      }
      if (lit2)
        glow(
          f,
          (bulbs[0]!.x + bulbs.at(-1)!.x) / 2,
          bulbs[0]!.y + 1,
          Math.abs(bulbs[0]!.x - bulbs.at(-1)!.x) / 2 + 4,
          P.bulb,
          0.05 * lit2,
          0.4,
          0.04
        );
    }

    // ---------- the campers ----------
    const manColor: Record<string, RGB> = {
      H: P.hair,
      h: P.hairLit,
      s: P.skin,
      b: P.beard,
      J: P.hoodie,
      j: P.hoodieLit,
      K: P.hoodieShade,
      L: P.jeans,
      l: P.jeansLit,
      e: P.shoes,
      c: P.chair,
      C: P.chairLit,
      f: P.chairFrame,
      m: P.mug,
    };
    const womanColor: Record<string, RGB> = {
      H: P.wHair,
      h: P.wHairLit,
      s: P.skin,
      W: P.sweater,
      w: P.sweaterLit,
      b: P.blanket,
      B: P.blanketLit,
      c: P.chair,
      C: P.chairLit,
      f: P.chairFrame,
      m: P.mug2,
      e: P.boots,
    };
    const kidColor: Record<string, RGB> = {
      p: P.pom,
      Y: P.kidHat,
      y: P.kidHatLit,
      H: P.kidHair,
      s: P.skin,
      R: P.jacket,
      r: P.jacketLit,
      T: P.pants,
      t: P.pantsLit,
      e: P.boots,
    };
    const manY = FRONT - MAN.length + 1;
    const womanY = FRONT - WOMAN.length;
    const kidY = FRONT - KID.length + 1;
    const hand = { x: kidX + 5, y: kidY + 5 };

    // the fox egg's beats (ms after the click): the pan flares, the smell
    // goes up, a pair of eyes shine in the pines, the fox trots out and sits
    // by the stove; a close-up opens on it, hoping, and it grabs a sausage;
    // then it races off right past the camera with it
    let foxAt = -Infinity;
    const FOX = {
      eyes: 1100,
      out: 1700,
      sit: 2700,
      open: 2650, // the close-up opens
      snatch: 4500, // got one
      close: 5050, // the close-up shuts
      away: 5300, // and past the camera it goes
      gone: 7100,
      end: 8000,
    };
    /** How far someone has jumped up out of their seat at the snatch. */
    const jumpOf = (t: number, delay: number, height: number) => {
      const a = t - foxAt - FOX.snatch - 100 - delay;
      if (a < 0 || a > 3000) return 0;
      if (a < 130) return Math.round(height * ease(a / 130));
      // hopping about while it gets away, then sitting back down
      if (a < 2600) return height + (Math.sin((a - 130) / 75) > 0.2 ? 1 : 0);
      return Math.round(height * (1 - ease((a - 2600) / 400)));
    };
    const kidUp = (t: number) => jumpOf(t, 40, 3);
    // a sip every so often, each on their own beat
    const sipping = (t: number, period: number, ph: number) =>
      (t + ph) % period < 1600;
    // clicking the man or woman: both raise their mugs (and the sky obliges)
    let toastAt = -Infinity;
    const TOAST_FOR = 2400;
    const toasting = (t: number) => t - toastAt >= 0 && t - toastAt < TOAST_FOR;
    /** How far a mug is lifted: 0 at rest, 3 for a sip, 5 for a toast. */
    const lift = (t: number, period: number, ph: number) =>
      toasting(t) ? 5 : sipping(t, period, ph) ? 3 : 0;

    // the kid's marshmallow: catches fire on a click, gets waved about, blown out
    let marshAt = -Infinity;
    const MARSH_FOR = 3600;
    /** Where the stick's tip is `age` ms after it caught fire (or at rest). */
    function tipAt(t: number, age: number) {
      const rest = 0.45 + Math.sin(t / 1300) * 0.06;
      let ang = rest;
      let len = 8;
      if (age >= 0 && age < MARSH_FOR) {
        // lifted out of the fire, waved round in loops, then lowered again
        const up = ease((age - 250) / 300) * (1 - ease((age - 2900) / 500));
        const a = (age - 250) / 120;
        ang = rest + up * (0.95 + Math.sin(a) * 0.5);
        len = 8 + up * (1.5 + Math.cos(a * 2) * 2);
      }
      return {
        x: hand.x + Math.cos(ang) * len,
        y: hand.y - Math.sin(ang) * len,
      };
    }
    const isChair = (c: string) => c === 'c' || c === 'C' || c === 'f';
    function drawCampers(f: Frame, t: number) {
      const pose = <T>(l: number, rest: T, sip: T, toast: T) =>
        l === 5 ? toast : l === 3 ? sip : rest;
      /** An adult in their chair, or jumped `up` px up out of it. */
      const seat = (
        rows: readonly string[],
        x: number,
        y: number,
        col: Record<string, RGB>,
        up: number
      ) => {
        if (!up) return paint(f, rows, x, y, (c) => col[c] ?? null);
        paint(f, rows, x, y, (c) => (isChair(c) ? (col[c] ?? null) : null));
        // (a touch warmer: they've come up out of the firelit patch)
        paint(f, rows, x, y - up, (c) =>
          isChair(c) || !col[c] ? null : lerpRGB(col[c], P.fireGlow, 0.12)
        );
      };
      const mUp = jumpOf(t, 0, 4);
      const wUp = jumpOf(t, 90, 4);
      seat(
        mUp ? MAN_TOAST : pose(lift(t, 11_000, 0), MAN, MAN_SIP, MAN_TOAST),
        manX,
        manY,
        manColor,
        mUp
      );
      seat(
        wUp
          ? WOMAN_TOAST
          : pose(lift(t, 13_700, 6100), WOMAN, WOMAN_SIP, WOMAN_TOAST),
        womanX,
        womanY,
        womanColor,
        wUp
      );
      // the kid points up while there's a saucer about, and jumps up for
      // the fox
      const ua = t - ufoAt;
      const up = kidUp(t);
      if (up || (ua >= 1000 && ua < UFO_FOR - 300))
        paint(f, KID_POINT, kidX - 1, kidY - up, (c) => kidColor[c] ?? null);
      else paint(f, KID, kidX, kidY, (c) => kidColor[c] ?? null);
    }
    function drawStick(f: Frame, t: number) {
      const age = t - marshAt;
      const up = kidUp(t);
      const tip = tipAt(t, age);
      const tx = Math.round(tip.x);
      const ty = Math.round(tip.y) - up;
      f.line(hand.x, hand.y - up, tx, ty, P.stick);
      const burning = age > 120 && age < 2700;
      const charred = age > 900 && age < MARSH_FOR;
      f.set(tx, ty, charred ? P.char : P.marsh);
      f.set(tx + 1, ty, charred ? P.char : P.marsh);
      f.set(tx, ty + 1, charred ? P.char : lerpRGB(P.marsh, P.fire2, 0.4));
      if (burning) {
        // the trail it leaves as it's waved about
        for (let k = 1; k <= 7; k++) {
          const p = tipAt(t, age - k * 28);
          f.blend(
            p.x,
            p.y - 1 - up,
            k < 3 ? P.fire1 : k < 5 ? P.fire2 : P.fire3,
            0.85 - k * 0.1
          );
        }
        const flick = Math.sin(t / 60) > 0;
        const big = age < 2300 ? 1 : 0;
        f.set(tx, ty - 1, P.fire1);
        f.set(tx + 1, ty - 1, P.fire2);
        f.set(tx + (flick ? 1 : 0), ty - 2, P.fire2);
        if (big) f.set(tx + (flick ? 0 : 1), ty - 3, P.fire3);
        glow(f, tx, ty - 1, 6, P.fireGlow, 0.35, 1, 0.12);
      } else if (age >= 2700 && age < 3900) {
        // blown out: a wisp of smoke
        const p = (age - 2700) / 1200;
        puff(
          f,
          tx + p * 3,
          ty - 2 - p * 8,
          1 + p * 2,
          P.smokeHi,
          0.5 * (1 - p)
        );
      }
    }

    // ---------- the fire ----------
    let flareAt = -Infinity;
    const flareOf = (t: number, hover: boolean) =>
      1 + 0.9 * Math.exp(-(t - flareAt) / 450) + (hover ? 0.15 : 0);
    const breatheOf = (t: number) =>
      0.85 + 0.15 * Math.sin(t / 420) + 0.06 * Math.sin(t / 97);
    function fireLight(f: Frame, t: number, hover: boolean) {
      const flare = flareOf(t, hover);
      // warm light over the ground, the campers, the tent and the car
      light(
        f,
        fireX,
        FIRE - 4,
        62 * Math.min(1.3, flare),
        P.fireGlow,
        0.32 * breatheOf(t) * Math.min(1.5, flare),
        0.5
      );
    }
    function drawFire(f: Frame, t: number, hover: boolean) {
      const flare = flareOf(t, hover);
      const breathe = breatheOf(t);
      // stones: the back of the ring, the logs and embers, then the front stones
      for (const [dx, dy] of [
        [-5, -1],
        [-2, -2],
        [1, -2],
        [4, -1],
      ] as const) {
        f.rect(fireX + dx, FIRE + dy, 2, 1, P.stoneLit);
        f.rect(fireX + dx, FIRE + dy + 1, 2, 1, P.stone);
      }
      f.line(fireX - 4, FIRE, fireX + 2, FIRE - 3, P.log);
      f.line(fireX - 2, FIRE - 3, fireX + 4, FIRE, P.log);
      f.set(fireX - 3, FIRE - 1, P.logLit);
      f.set(fireX + 3, FIRE - 1, P.logLit);
      for (let dx = -2; dx <= 2; dx++) {
        const hot = Math.sin(t / 230 + dx * 1.9) > 0;
        f.set(fireX + dx, FIRE - 1, hot ? P.ember : P.fire4);
      }
      for (const [dx, dy] of [
        [-6, 1],
        [-3, 2],
        [0, 2],
        [3, 2],
        [6, 1],
      ] as const) {
        f.rect(fireX + dx, FIRE + dy - 1, 2, 1, P.stoneLit);
        f.rect(fireX + dx, FIRE + dy, 2, 1, P.stone);
      }
      // flames: tongues that grow, shrink and lean on their own beats
      const tongues = [
        [-2, 4, 1],
        [2, 4, 1],
        [-1, 7, 1],
        [1, 6, 1],
        [0, 9, 1],
        [1, 5, 0],
      ] as const;
      for (const [i, [ox, base, half]] of tongues.entries()) {
        const flick =
          Math.sin(t / 110 + i * 2.1) * 1.1 + Math.sin(t / 53 + i * 4.3) * 0.6;
        const len = Math.max(2, Math.round((base + flick) * flare * breathe));
        const lean = Math.sin(t / 340 + i) * 1.2 + 0.6;
        for (let j = 0; j < len; j++) {
          const v = j / len;
          const sx = fireX + ox + Math.round(lean * v * v);
          const hw = Math.round(half * (1 - v) + 0.2);
          for (let k = -hw; k <= hw; k++) {
            const core = Math.abs(k) < hw || hw === 0;
            const c =
              v > 0.78
                ? P.fire3
                : v > 0.5
                  ? P.fire2
                  : core && v < 0.38 && i > 1
                    ? P.fire0
                    : core
                      ? P.fire1
                      : P.fire2;
            f.set(sx + k, FIRE - 2 - j, c);
          }
        }
      }
      // embers drifting up out of the flames
      for (let i = 0; i < 7; i++) {
        const life = (t / 1900 + hash2(i, 0, 21)) % 1;
        if (life > 0.8) continue;
        const n = Math.floor(t / 1900 + hash2(i, 0, 21));
        const x =
          fireX +
          (hash2(i, n, 22) - 0.5) * 6 +
          Math.sin(life * 7 + i) * 2 +
          life * 5;
        const y = FIRE - 6 - life * 30;
        f.set(x, y, life < 0.3 ? P.fire1 : life < 0.6 ? P.fire2 : P.fire3);
      }
      // smoke, lit from below near the fire and fading into the night
      for (let i = 0; i < 9; i++) {
        const p = (t / 4200 + i / 9) % 1;
        const r = 1.5 + p * 5;
        const x = fireX + 1 + Math.sin(p * 5 + i) * 1.5 + p * p * 22;
        const y = FIRE - 9 - p * 60;
        puff(
          f,
          x,
          y,
          r,
          lerpRGB(P.smokeLo, P.smokeHi, Math.min(1, p * 2)),
          0.16 * (1 - p)
        );
      }
    }

    // ---------- interactions ----------
    const onFire = (x: number, y: number) =>
      Math.abs(x - fireX) < 7 && y > FIRE - 16 && y < FIRE + 3;
    const onKid = (x: number, y: number) =>
      x >= kidX - 1 && x <= kidX + 7 && y >= kidY - 1 && y <= FRONT;
    const onAdults = (x: number, y: number) =>
      x >= manX && x < womanX + 11 && y >= manY - 1 && y <= FRONT;
    const onTent = (x: number, y: number) => {
      const row = tent.rows[y - tentTop];
      return !!row && x >= tentX && x < tentX + TW && row[x - tentX] !== '.';
    };
    const onCar = (x: number, y: number) =>
      x >= carX && x < carX + CAR[0]!.length && y >= carTop && y <= BACK;
    const onAwning = (x: number, y: number) =>
      wide
        ? x >= poleX - 2 && x < carX && y >= awnY0 - 1 && y <= awnY1 + 5
        : bulbs.some((b) => Math.abs(b.x - x) <= 2 && Math.abs(b.y - y) <= 1);
    const onFuji = (x: number, y: number) =>
      y < WATER - 4 &&
      y >= landTop[Math.max(0, Math.min(w - 1, x))]! &&
      Math.abs(x - fujiX) < 90;
    const onLake = (x: number, y: number) =>
      y > WATER + 2 && y < bankTop(x) - 1 && !(x < 70 && y > h - 26);
    // the two eggs: the camp stove and Fuji's summit (a tap a little wide of
    // either still counts, as long as it isn't on something else)
    const stoveSpot = { x: stoveX + 6, y: FRONT - 5, r: 8 };
    const onStove = (x: number, y: number) =>
      x >= stoveX && x <= stoveX + 12 && y >= stoveY - 1 && y <= FRONT;
    const nearStove = (x: number, y: number) =>
      Math.hypot(x - stoveSpot.x, y - stoveSpot.y) <= stoveSpot.r + 6;
    const summit = { x: fujiX + 1, y: PEAK + 4, r: 11 };
    const onSummit = (x: number, y: number, slack = 0) =>
      Math.hypot(x - summit.x, y - summit.y) <= summit.r + slack;

    // ---------- the cap cloud, and the saucer inside it ----------
    let capAt = -Infinity; // a plain cap cloud (Fuji's slopes)
    let ufoAt = -Infinity; // the easter egg (the summit)
    let ufoCap0 = 0; // how much cap cloud was already there when it began
    const UFO = {
      glow: 200, // its lights glow through the cloud as it rolls in
      drop: 900, // it drops straight out of the bottom
      dive: 1400, // swoops down to the far shore
      skim: 1950, // and glides in low over the lake
      hover: 3000,
      beam: 3250,
      fish: 3500, // a fish comes up out of the lake with a splash
      gulp: 5000, // ...and in through the port
      beamOff: 5350,
      zip: 5500, // then off, up and over Fuji
      gone: 6900,
      melt: 5800, // and the cloud thins out after it
      end: 7700,
    };
    const UFO_FOR = UFO.end;
    const ufoPlaying = (t: number) => t - ufoAt >= 0 && t - ufoAt < UFO_FOR;

    /** How much plain cap cloud there is at t (0..1). */
    function plainCap(t: number) {
      const age = t - capAt;
      if (age < 0 || age > 9000) return 0;
      const g = ease(age / 1600);
      return age > 7000 ? g * (1 - (age - 7000) / 2000) : g;
    }

    /** A kasagumo: the lens-shaped cap cloud that settles over Fuji's summit. */
    function capCloud(f: Frame, t: number, mirror: boolean) {
      const ua = t - ufoAt;
      const egg = ua >= 0 && ua < UFO_FOR;
      let s = plainCap(t);
      let melt = 0;
      let roll = 0;
      let inner = 0;
      if (egg) {
        // it rolls in from upwind (unless there was a cloud there already)
        s = Math.max(s, ufoCap0 + (1 - ufoCap0) * ease(ua / 700));
        roll = Math.round((1 - ease(ua / 800)) * 18 * (1 - ufoCap0));
        melt = ease((ua - UFO.melt) / 1900);
        // the saucer's lights glow through it, flaring as it drops out
        if (ua < UFO.dive)
          inner =
            ua >= UFO.drop - 120 && ua < UFO.drop + 200
              ? 1
              : ease((ua - UFO.glow) / 300) *
                (0.5 + 0.5 * Math.sin(ua / 65)) *
                (1 - ease((ua - UFO.drop - 200) / 300));
      }
      if (melt >= 1 || s <= 0.05) return;
      const big = egg ? 1.25 : 1;
      const tint = UFO_LIGHTS[Math.floor(t / 120) % 3]!;
      // melting, the plates go one at a time from the top, drifting downwind
      const plate = (k: number) => 1 - ease((melt - (2 - k) * 0.2) / 0.6);
      const drift = Math.round(melt * 4) - roll;
      const lens = (
        cx0: number,
        cy: number,
        a: number,
        th: number,
        under: number
      ) => {
        for (let dx = -Math.round(a); dx <= Math.round(a); dx++) {
          const e = 1 - (dx / (a + 0.5)) ** 2;
          if (e <= 0) continue;
          const top = Math.round(cy - th * Math.sqrt(e));
          const bot = Math.round(cy + under * Math.sqrt(e));
          for (let y = top; y <= bot; y++) {
            const shade = dx > a * 0.5 ? 1 : 0;
            let c =
              y === top
                ? shade
                  ? P.cap1
                  : P.cap0
                : y >= bot - (under > 1.2 ? 1 : 0)
                  ? P.cap2
                  : shade
                    ? P.cap2
                    : P.cap1;
            if (inner > 0) {
              const d = Math.hypot(dx / (a + 1), (y - PEAK) / 6);
              if (d < 1)
                c = lerpRGB(c, d < 0.4 ? P.ufoPort : tint, inner * (1 - d));
            }
            if (mirror) {
              const my = Math.round(WATER + (WATER - 1 - y) / SQ);
              c = lerpRGB(P.water, c, 0.6);
              if (my >= WATER && my < h) f.set(cx0 + dx, my, c);
            } else {
              f.set(cx0 + dx, y, c);
            }
          }
        }
      };
      // stacked like plates, draped over the summit and nudged downwind
      const plates = [
        [2, PEAK + 1, 20, 3.2, 1.8],
        [3, PEAK - 3, 14, 2.4, 0.8],
        [4, PEAK - 6, 8, 1.6, 0.5],
      ] as const;
      plates.forEach(([ox, cy, a, th, under], k) => {
        const m = s * plate(k);
        // (rolling in, the top plates trail the bottom one a little)
        if (m > 0.12)
          lens(
            fujiX + ox + drift - Math.round(roll * k * 0.3),
            cy - (k ? Math.round((big - 1) * 4 * k) : 0),
            a * m * big,
            th * m * big,
            under * m * big
          );
      });
      if (inner > 0.05 && !mirror)
        glow(f, fujiX + 3, PEAK, 26, tint, 0.3 * inner, 0.5, 0.06);
    }

    // The saucer drops out of the cloud, swoops down to the far shore, glides
    // in low over the lake (getting bigger as it comes), hovers to beam up a
    // fish, then zips off up and over Fuji.
    const S1 = wide ? 2 : 1.4; // its size up close, against the near sprite
    const hoverX = Math.round(fujiX - Math.min(74, w * 0.17));
    const footY = WATER + 40; // where the beam meets the water
    const hoverY = footY - Math.round(14 + 9 * S1);
    const dropTop = { x: fujiX + 3, y: PEAK - 2 };
    const dropEnd = { x: fujiX + 3, y: PEAK + 13 };
    const farPt = { x: fujiX - 16, y: WATER - 4 };
    const awayPt = { x: fujiX + 12, y: PEAK - 16 };
    /** Where it is, how big (s), and the water under it (g, 0 = none). */
    function ufoPos(a: number) {
      const lerp = (p: number, u: number, v: number) => u + (v - u) * p;
      if (a < UFO.dive) {
        const p = ease((a - UFO.drop) / (UFO.dive - UFO.drop));
        return {
          x: dropTop.x,
          y: lerp(p, dropTop.y, dropEnd.y),
          s: 0.62,
          g: 0,
        };
      }
      if (a < UFO.skim) {
        const p = ease((a - UFO.dive) / (UFO.skim - UFO.dive));
        return {
          x: lerp(p, dropEnd.x, farPt.x),
          y: lerp(p * p, dropEnd.y, farPt.y),
          s: lerp(p, 0.62, 0.68),
          g: WATER + 2,
        };
      }
      if (a < UFO.hover) {
        // in towards us: lower on the picture, bigger, a little higher up
        const p = ease((a - UFO.skim) / (UFO.hover - UFO.skim));
        const g = lerp(p, WATER + 2, footY);
        return {
          x: lerp(p, farPt.x, hoverX) - Math.sin(p * Math.PI) * 14,
          y: g - lerp(p * p, 3, footY - hoverY),
          s: lerp(p, 0.68, S1),
          g,
        };
      }
      if (a < UFO.zip)
        return {
          x: hoverX,
          y: hoverY + Math.round(Math.sin((a - UFO.hover) / 260)),
          s: S1,
          g: footY,
        };
      // a hop, then away faster and faster, shrinking into the distance
      const p = Math.min(1, (a - UFO.zip) / (UFO.gone - UFO.zip));
      const e = p * p;
      return {
        x: lerp(e, hoverX, awayPt.x),
        y:
          lerp(Math.pow(e, 0.6), hoverY, awayPt.y) -
          Math.sin(p * 9) * 2 * (1 - p),
        s: lerp(Math.pow(e, 0.5), S1, 0.12),
        g: 0,
      };
    }

    const ufoCol: Record<string, RGB> = {
      d: P.ufoDome,
      D: P.ufoDomeHi,
      u: P.ufoHull,
      H: P.ufoHullHi,
      y: P.ufoBelly,
      K: P.ufoDark,
      g: P.ufoPort,
    };
    /** The saucer at (x, y), drawn about 22 * s px wide. */
    function saucer(
      f: Frame,
      x: number,
      y: number,
      s: number,
      t: number,
      tint: (c: RGB) => RGB,
      flipY = false
    ) {
      const tw = 22 * s;
      const chase = Math.floor(t / 110);
      if (tw < 6) {
        // so far off it's just a glint and its lights
        f.set(x, y, tint(P.ufoHullHi));
        f.set(x - 1, y, tint(UFO_LIGHTS[chase % 3]!));
        f.set(x + 1, y, tint(UFO_LIGHTS[(chase + 1) % 3]!));
        return;
      }
      const idx = tw < 12 ? 0 : tw < 18 ? 1 : 2;
      const rows = UFO_SPRITES[idx];
      const sw = rows[0].length;
      const sh = rows.length;
      const k = idx === 2 ? Math.max(1, tw / sw) : 1;
      const dw = Math.round(sw * k);
      const dh = Math.round(sh * k);
      const x0 = Math.round(x - dw / 2);
      const y0 = Math.round(y - dh / 2);
      const every = idx === 0 ? 2 : 3;
      for (let dy = 0; dy < dh; dy++) {
        const ry = Math.min(sh - 1, Math.floor(dy / k));
        const row = rows[flipY ? sh - 1 - ry : ry]!;
        for (let dx = 0; dx < dw; dx++) {
          const rx = Math.min(sw - 1, Math.floor(dx / k));
          const ch = row[rx]!;
          const c =
            ch === 'L'
              ? UFO_LIGHTS[(Math.floor(rx / every) + chase) % 3]!
              : ufoCol[ch];
          if (c !== undefined) f.set(x0 + dx, y0 + dy, tint(c));
        }
      }
    }

    const troutCol: Record<string, RGB> = {
      d: P.troutBack,
      D: P.troutFin,
      p: P.troutPink,
      S: P.troutBelly,
      e: P.ufoDark,
    };
    const FK = wide ? 2 : 1; // the trout's pixel size
    /** The trout centred on (x, y), turned over (flipped) as it wriggles. */
    function drawFish(
      f: Frame,
      x: number,
      y: number,
      flip: boolean,
      tilt: number
    ) {
      const fw = FISH[0]!.length;
      const x0 = Math.round(x - (fw * FK) / 2);
      const y0 = Math.round(y - (FISH.length * FK) / 2);
      FISH.forEach((row, ry) => {
        for (let rx = 0; rx < fw; rx++) {
          const c = troutCol[row[rx]!];
          if (c === undefined) continue;
          const sx = flip ? fw - 1 - rx : rx;
          // a flick of the tail
          const bend = (flip ? rx : fw - 1 - rx) < 3 ? tilt : 0;
          f.rect(x0 + sx * FK, y0 + (ry + bend) * FK, FK, FK, c);
        }
      });
    }

    function drawUfo(f: Frame, t: number, inCloud: boolean) {
      const a = t - ufoAt;
      if (a < UFO.drop || a >= UFO.gone + 500) return;
      // (behind the cloud while it drops out of it; in front of the lake after)
      if (inCloud !== a < UFO.dive) return;
      const plain = (c: RGB) => c;
      if (a >= UFO.gone) {
        // the last of it: a wink of light where it went
        const q = (a - UFO.gone) / 500;
        const r = Math.round(1 + q * 3);
        const c = lerpRGB(P.ufoBeam, P.sky2, q);
        f.set(awayPt.x, awayPt.y, P.starHi);
        for (let k = 1; k <= r; k++) {
          f.set(awayPt.x - k, awayPt.y, c);
          f.set(awayPt.x + k, awayPt.y, c);
          f.set(awayPt.x, awayPt.y - k, c);
          f.set(awayPt.x, awayPt.y + k, c);
        }
        return;
      }
      const p = ufoPos(a);
      if (inCloud) {
        saucer(f, p.x, p.y, p.s, t, plain);
        return;
      }
      // its reflection, while it's low enough over the water to have one
      const alt = p.g - p.y;
      if (p.g && alt < 36) {
        const ry = 2 * p.g - p.y;
        const k = 0.5 * (1 - alt / 40);
        if (ry > WATER + 1 && ry < h + 12)
          saucer(f, p.x, ry, p.s, t, (c) => lerpRGB(P.water, c, k), true);
      }
      // a wake on the water as it skims in
      if (a >= UFO.skim && a < UFO.hover + 600) {
        for (let k = 0; k < 7; k++) {
          const born = Math.floor((a - UFO.skim) / 110) * 110 - k * 110;
          if (born < 0 || born > UFO.hover - UFO.skim) continue;
          const q = ufoPos(UFO.skim + born);
          const age = a - UFO.skim - born;
          const r = 2 + age / 55;
          const al = 0.55 * (1 - age / 900);
          if (al <= 0) continue;
          for (let i = 0; i < 20; i++) {
            const ang = (i / 20) * Math.PI * 2;
            f.blend(
              q.x + Math.cos(ang) * r,
              q.g + Math.sin(ang) * r * 0.25,
              P.ufoBeam,
              al
            );
          }
        }
      }
      if (a >= UFO.beam && a < UFO.beamOff) drawBeam(f, t, a, p.y);
      // a streak behind it as it zips away
      if (a >= UFO.zip) {
        for (let k = 1; k < 10; k++) {
          const q = ufoPos(a - k * 28);
          f.blend(q.x, q.y, P.ufoBeam, 0.7 * (1 - k / 10));
          f.blend(q.x, q.y + 1, P.ufoBeam, 0.35 * (1 - k / 10));
        }
      }
      glow(f, p.x, p.y + 2 * p.s, 6 + 10 * p.s, P.ufoBeam, 0.2, 0.6, 0.08);
      saucer(f, p.x, p.y, p.s, t, plain);
    }

    function drawBeam(f: Frame, t: number, a: number, uy: number) {
      const b = a - UFO.beam;
      const on = Math.min(1, b / 180, (UFO.beamOff - a) / 180);
      const flick = 0.88 + 0.12 * Math.sin(t / 40);
      const top = Math.round(uy + 4 * S1 + 1);
      const topHalf = 1.5 + 1.5 * S1;
      const botHalf = 6 + 4 * S1;
      // the whole lake round it takes on its light
      glow(f, hoverX, footY, 46 + 26 * S1, P.ufoBeam, 0.26 * on, 0.3, 0.05);
      for (let y = top; y <= footY; y++) {
        const v = (y - top) / Math.max(1, footY - top);
        const half = topHalf + (botHalf - topHalf) * v;
        // bands of light running up it
        const band = (y + Math.floor(t / 30)) % 6 < 2 ? 0.18 : 0;
        for (let dx = -Math.ceil(half); dx <= Math.ceil(half); dx++) {
          const edge = Math.abs(dx) / (half + 0.5);
          if (edge >= 1) continue;
          f.blend(
            hoverX + dx,
            y,
            P.ufoBeam,
            on * flick * (0.66 - edge * 0.44 + band)
          );
        }
      }
      // a bright pool where it meets the water, and rings spreading out
      const rx = botHalf * 1.7;
      for (let dy = -3; dy <= 3; dy++)
        for (let dx = -Math.ceil(rx); dx <= rx; dx++) {
          const d = Math.hypot(dx / rx, dy / 3.2);
          if (d < 1)
            f.blend(hoverX + dx, footY + dy, P.ufoPort, on * (0.8 - d * 0.6));
        }
      for (let k = 0; k < 3; k++) {
        const rp = ((b + k * 400) % 1200) / 1200;
        const r = rx + rp * 22;
        for (let i = 0; i < 40; i++) {
          const ang = (i / 40) * Math.PI * 2;
          f.blend(
            hoverX + Math.cos(ang) * r,
            footY + Math.sin(ang) * r * 0.22,
            P.ufoBeam,
            on * 0.6 * (1 - rp)
          );
        }
      }
      // the fish: out of the lake in a splash, then up the beam, wriggling
      const fa = a - UFO.fish;
      if (fa >= 0 && fa < UFO.gulp - UFO.fish) {
        const fp = fa / (UFO.gulp - UFO.fish);
        // a leap clear of the water first, then a steady float up
        const jump = fp < 0.18 ? Math.sin((fp / 0.18) * Math.PI * 0.5) * 7 : 7;
        const fy = Math.round(
          footY -
            2 * FK -
            jump -
            ease((fp - 0.18) / 0.82) * (footY - 6 * FK - top)
        );
        const flip = Math.floor(fa / 320) % 2 === 1;
        drawFish(f, hoverX, fy, flip, Math.round(Math.sin(fa / 70)));
        // drops of lake water coming up with it
        for (let i = 0; i < 6; i++) {
          const q = (fa / 900 + i / 6) % 1;
          const dy = Math.round(q * 12);
          f.blend(
            hoverX + Math.round(Math.sin(i * 2.3 + fa / 200) * (2 + (i % 3))),
            fy + 3 + dy,
            P.starHi,
            0.9 * (1 - q)
          );
        }
      }
      if (fa >= 0 && fa < 650) {
        // the splash: a burst of water thrown up round the beam's foot
        const s = fa / 1000;
        for (let i = 0; i < 16; i++) {
          const vx = (hash2(i, 1, 33) - 0.5) * 60;
          const vy = -(28 + hash2(i, 2, 33) * 44);
          const py = footY + vy * s + 120 * s * s;
          if (py > footY) continue;
          f.set(hoverX + vx * s, py, i % 3 ? P.fish : P.starHi);
        }
        if (fa < 260) {
          const ht = Math.round(Math.sin((fa / 260) * Math.PI) * 9);
          f.vline(hoverX - 1, footY - ht, footY, P.fish);
          f.vline(hoverX + 1, footY - ht + 2, footY, P.fish);
        }
      }
      // gulp: a flash at the port as the fish goes in
      const ga = a - UFO.gulp;
      if (ga >= 0 && ga < 300)
        glow(
          f,
          hoverX,
          top - 1,
          9 + ga / 30,
          P.ufoPort,
          0.7 * (1 - ga / 300),
          0.7,
          0.06
        );
    }

    // ---------- the camp kitchen, and the fox ----------
    const stoveCol: Record<string, RGB> = {
      R: P.sausage,
      r: P.sausageShade,
      k: P.panBase,
      i: P.panIn,
      P: P.pan,
      p: P.panBase,
      h: P.handle,
      S: P.stoveTop,
      s: P.stoveBody,
      T: P.tableLit,
      t: P.table,
    };
    const foxPlaying = (t: number) => t - foxAt >= 0 && t - foxAt < FOX.end;
    /** The pan's own flare: a sheet of flame, then a smaller one at the snatch. */
    const flameOf = (a: number) => {
      const one = (b: number) =>
        b < 0 ? 0 : b < 110 ? ease(b / 110) : Math.exp(-(b - 110) / 650);
      return one(a) + 0.55 * one(a - FOX.snatch - 30);
    };
    function drawStove(f: Frame, t: number) {
      const a = t - foxAt;
      const playing = foxPlaying(t);
      // the pan jumps when the fox grabs at it, and there's a sausage fewer
      const jolt = playing && a >= FOX.snatch && a < FOX.snatch + 180;
      const taken = playing && a >= FOX.snatch;
      paint(f, STOVE, stoveX, stoveY, (c, rx, ry) => {
        if (ry < 4 && jolt) return null;
        if (taken && ry === 0 && rx >= 6) return null;
        return stoveCol[c] ?? null;
      });
      if (jolt)
        paint(f, STOVE.slice(0, 4), stoveX + 1, stoveY - 1, (c, rx, ry) =>
          taken && ry === 0 && rx >= 6 ? null : (stoveCol[c] ?? null)
        );
    }
    /** The burner, the flare, the sizzle and the smoke: drawn over the camp. */
    function drawCooking(f: Frame, t: number) {
      const a = t - foxAt;
      const playing = foxPlaying(t);
      // the burner's blue ring
      for (const dx of [0, 2, 3, 5]) {
        const hot = Math.sin(t / 90 + dx * 1.7) > 0.3;
        f.set(stoveX + 3 + dx, stoveY + 4, hot ? P.burnerHot : P.burner);
      }
      // steam off the sausages, now and then a spit of fat
      for (let i = 0; i < 3; i++) {
        const p = (t / 1500 + i / 3) % 1;
        if (p > 0.75) continue;
        f.blend(
          panX - 1 + i * 2 + Math.round(Math.sin(p * 6 + i) * 0.8),
          panY - 2 - Math.round(p * 7),
          P.steam,
          0.55 * (1 - p)
        );
      }
      if (!playing) {
        const k = Math.floor(t / 700);
        const q = (t % 700) / 220;
        if (q < 1 && hash2(k, 1, 41) > 0.55)
          f.set(
            panX - 2 + Math.round(hash2(k, 2, 41) * 5),
            panY - 1 - Math.round(Math.sin(q * Math.PI) * 3),
            P.grease
          );
        return;
      }
      const fl = flameOf(a);
      // smoke: a big plume going up into the still night air until it
      // meets the cold layer over the lake, and spreads out flat along it,
      // mostly out over the water (warm where the camp lights it, grey-blue
      // above)
      const layerY = 42;
      const smokeAt = (y: number) =>
        y > BACK
          ? P.cookSmokeLit
          : y > BACK - 30
            ? lerpRGB(P.cookSmoke, P.cookSmokeLit, (y - BACK + 30) / 30)
            : lerpRGB(
                P.cookSmokeHi,
                P.cookSmoke,
                Math.max(0, (y - 30) / (BACK - 60))
              );
      const leftRoom = panX - Math.max(20, w * 0.18);
      const rightRoom = Math.max(6, w - panX - 10);
      for (let i = 0; i < 44; i++) {
        const burst = i < 20;
        const born = burst ? i * 40 : 600 + (i - 20) * 140;
        const life = burst ? 6800 : 3600;
        const q = (a - born) / life;
        if (q < 0 || q >= 1) continue;
        const h1 = hash2(i, 1, 43);
        const h2 = hash2(i, 2, 43);
        // up the column, then out along the layer
        const up = Math.min(1, q / 0.32);
        const out = Math.max(0, (q - 0.22) / 0.78);
        const y =
          panY -
          3 -
          (panY - 3 - layerY - (h1 - 0.5) * 10) * (1 - Math.pow(1 - up, 2)) +
          out * 4;
        const dir = h2 < 0.72 ? -1 : 1;
        const room = dir < 0 ? leftRoom : rightRoom;
        const x =
          panX +
          Math.sin(q * 9 + i * 1.9) * (0.5 + up * 2) +
          dir * room * (0.25 + 0.75 * hash2(i, 3, 43)) * Math.pow(out, 0.7);
        const rx =
          (burst ? 3 : 2) + (burst ? 12 : 8) * up + out * 9 * (0.6 + h1 * 0.8);
        const ry = rx * (0.85 - 0.45 * out);
        const al =
          (burst ? 0.46 : 0.3) *
          Math.pow(1 - q, 1.2) *
          Math.min(1, q * 16 + 0.25);
        const c =
          q < 0.05 ? lerpRGB(P.fire2, smokeAt(y), q / 0.05) : smokeAt(y);
        billow(f, x, y, rx, ry, c, al, i);
      }
      // the flare: a sheet of flame off the pan
      if (fl > 0.1) {
        const k = Math.min(1.2, fl);
        glow(
          f,
          panX,
          panY - 8,
          16 + 30 * k,
          P.fireGlow,
          0.3 * Math.min(1, fl),
          0.85,
          0.05
        );
        glow(
          f,
          panX,
          panY - 5,
          8 + 14 * k,
          P.fire1,
          0.45 * Math.min(1, fl),
          0.9,
          0.06
        );
        for (let i = 0; i < 11; i++) {
          const ox = i - 5;
          const flick =
            Math.sin(t / 70 + i * 2.1) * 1.6 + Math.sin(t / 37 + i * 4.3) * 0.9;
          const len = Math.round((24 - Math.abs(ox) * 3.6 + flick) * k);
          const lean = Math.sin(t / 150 + i) * 2;
          for (let j = 0; j < len; j++) {
            const v = j / len;
            const sx = panX + ox + Math.round(lean * v * v);
            f.set(
              sx,
              panY - 1 - j,
              v > 0.78
                ? P.fire3
                : v > 0.5
                  ? P.fire2
                  : v > 0.22 || Math.abs(ox) > 2
                    ? P.fire1
                    : P.fire0
            );
          }
        }
      }
      // fat spitting out of the pan, hard at first
      const spit = a < FOX.snatch + 900 ? (a < 1600 ? 14 : 6) : 0;
      for (let i = 0; i < spit; i++) {
        const cyc = 380 + hash2(i, 1, 44) * 300;
        const n = Math.floor((a + hash2(i, 2, 44) * cyc) / cyc);
        const q = ((a + hash2(i, 2, 44) * cyc) % cyc) / cyc;
        const vx = (hash2(i, n, 45) - 0.5) * 16;
        const up = 4 + hash2(i, n, 46) * 9;
        f.set(
          panX + vx * q,
          panY - 1 - Math.sin(q * Math.PI) * up,
          q < 0.5 ? P.grease : P.fire1
        );
      }
    }
    /** The flare's light over the camp. */
    function cookLight(f: Frame, t: number) {
      if (!foxPlaying(t)) return;
      const fl = flameOf(t - foxAt);
      if (fl > 0.03)
        light(
          f,
          panX,
          FRONT - 8,
          40 + 70 * Math.min(1, fl),
          P.fireGlow,
          0.55 * Math.min(1, fl),
          0.5
        );
    }

    // where the fox comes from: a pair of eyes under the pines
    const eyeAt = { x: Math.min(w - 6, carX + 48 + 14), y: BACK + 1 };
    const foxFrom = { x: eyeAt.x - 3, y: eyeAt.y + 6 };
    // the fox's colours by sprite char (see things/fuji-fox), and the same
    // dimmed for the dark under the trees
    const FOX_COL: Record<string, RGB> = {
      a: P.foxA,
      b: P.foxB,
      c: P.foxC,
      d: P.foxD,
      W: P.foxW,
      w: P.foxW2,
      v: P.foxW3,
      k: P.foxK,
      K: P.foxKK,
      e: P.foxKK,
      h: P.starHi,
      i: P.foxEarIn,
      p: P.foxEarShade,
      s: P.sausage,
      S: P.sausageLit,
      r: P.sausageShade,
      R: P.sausageEnd,
      H: P.sausageGlint,
      m: P.cuPanRim,
      M: P.cuPanHi,
      g: P.cuPanSide,
      G: P.cuPanDark,
      o: P.panIn,
      x: P.handle,
      j: P.hoodie,
      J: P.cuHoodie,
      t: P.cuSweater,
      T: P.cuSweaterLit,
      q: P.jacket,
      Q: P.jacketLit,
      u: P.skin,
      U: P.cuSkinShade,
      y: P.mug,
      Y: P.cuMugShade,
      n: P.hair,
      N: P.hairLit,
      F: P.beard,
      l: P.wHair,
      L: P.cuWomanHairLit,
      z: P.kidHat,
      Z: P.cuHatLit,
      P: P.pom,
    };
    const dimCache = new Map<number, Record<string, RGB>>();
    /** The fox's colours, `lit` from 0 (in the dark) to 1 (by the fire). */
    const foxCol = (lit: number, eyes = false) => {
      const key = Math.round(lit * 10) + (eyes ? 100 : 0);
      let col = dimCache.get(key);
      if (!col) {
        col = {};
        for (const [k, c] of Object.entries(FOX_COL))
          col[k] = lerpRGB(P.night, c, 0.3 + 0.07 * Math.round(lit * 10));
        if (eyes) col.e = P.eyeshine;
        dimCache.set(key, col);
      }
      return col;
    };
    /** The fox in the camp, small: out of the trees, sitting, the snatch. */
    function drawFox(f: Frame, t: number) {
      const a = t - foxAt;
      if (a < FOX.eyes || a >= FOX.snatch + 520) return;
      if (a < FOX.out) {
        // just a pair of eyes in the dark, and a blink
        if (a > 1450 && a < 1540) return;
        f.set(eyeAt.x, eyeAt.y, P.eyeshine);
        f.set(eyeAt.x + 2, eyeAt.y, P.eyeshine);
        glow(f, eyeAt.x + 1, eyeAt.y, 4, P.eyeshine, 0.25, 0.8, 0.08);
        return;
      }
      let rows: readonly string[];
      let x: number;
      let ground: number;
      let lit = 1;
      if (a < FOX.sit) {
        // out of the trees and over to the stove, into the firelight
        const p = (a - FOX.out) / (FOX.sit - FOX.out);
        x = Math.round(foxFrom.x + (sitX - foxFrom.x) * p);
        ground = Math.round(foxFrom.y + (FRONT - foxFrom.y) * ease(p * 1.3));
        rows = TROT[Math.floor(a / 120) % 2]!;
        lit = ease(p * 2.2);
      } else if (a < FOX.snatch - 150) {
        // sitting, head cocked one way and the other (as in the close-up)
        x = sitX;
        ground = FRONT;
        rows = SIT[closeTilt(a) !== 0 ? 1 : 0]!;
      } else if (a < FOX.snatch + 200) {
        // a spring at the pan
        const p = (a - FOX.snatch + 150) / 350;
        x = Math.round(sitX + (stoveX + 3 - sitX) * p);
        ground = Math.round(FRONT - Math.sin(p * Math.PI) * 9);
        rows = DASH[0];
      } else {
        // and off it goes towards us, out of the bottom of the picture
        const p = (a - FOX.snatch - 200) / 320;
        x = Math.round(stoveX + 3 - p * 10);
        ground = Math.round(FRONT + p * 18);
        rows = DASH[Math.floor(a / 80) % 2]!;
      }
      const top = ground - rows.length + 1;
      stamp(f, rows, x, top, foxCol(lit, lit < 0.5));
      if (a >= FOX.snatch) {
        // a sausage, crosswise in its jaws
        const ny = top + noseRow(rows);
        f.set(x - 1, ny + 1, P.sausageEnd);
        f.set(x, ny + 1, P.sausage);
        f.set(x + 1, ny + 1, P.sausageLit);
        f.set(x + 2, ny + 1, P.sausage);
        f.set(x + 3, ny + 2, P.sausageEnd);
      }
    }

    // ---------- the fox, up close ----------
    // the close-up opens out of the fox where it sits, up over the camp
    const cuW = wide
      ? Math.max(150, Math.min(200, Math.round(w * 0.36)))
      : Math.max(76, Math.round(w * 0.46));
    const cuH = wide ? 66 : 58;
    const cuX = w - cuW - Math.max(4, Math.round(w * 0.015));
    const cuY = 4;
    const cuFrom = { x: sitX + 3, y: FRONT - 9 };
    const cuPal: CloseupPalette = {
      sprite: FOX_COL,
      bgTop: P.sky1,
      bgBottom: P.cuBack,
      glow: P.fireGlow,
      bokeh: P.bulb,
      steam: P.steam,
      grease: P.grease,
      flame: P.burner,
      flameHot: P.burnerHot,
      frameDark: P.shadow,
      frameLight: P.cuFrame,
    };
    // (made the first time it's needed: it paints its backdrop up front)
    let closeup: ReturnType<typeof makeCloseup> | null = null;
    /** Its head in the close-up: cocked one way, then the other, hoping. */
    function closeTilt(a: number) {
      if (a < 3050) return 0;
      if (a < 3650) return 1;
      if (a < 4200) return -1;
      return 0;
    }
    function drawCloseup(f: Frame, t: number) {
      const a = t - foxAt;
      if (a < FOX.open || a >= FOX.close + 320) return;
      const o =
        a < FOX.close
          ? ease((a - FOX.open) / 320)
          : 1 - ease((a - FOX.close) / 320);
      if (o <= 0.02) return;
      const sn = a - FOX.snatch;
      const reach =
        sn < -230
          ? 0
          : sn < 0
            ? ease((sn + 230) / 200)
            : 1 - 1.2 * ease(sn / 200);
      closeup ??= makeCloseup(cuW, cuH, cuPal);
      closeup(
        f,
        cuFrom.x + (cuX - cuFrom.x) * o,
        cuFrom.y + (cuY - cuFrom.y) * o,
        6 + (cuW - 6) * o,
        5 + (cuH - 5) * o,
        {
          t,
          tilt: closeTilt(a),
          reach,
          holding: sn >= 0,
          arms: ease((sn - 150) / 380),
          jolt: sn >= 0 ? 2.4 * Math.exp(-sn / 110) * Math.cos(sn / 28) : 0,
          spit: sn >= -80 && sn < 500 ? 1 : 0.25,
        }
      );
    }

    // ---------- and its getaway, right past the camera ----------
    const NEAR = 2; // the running sprite, doubled: it's close
    const bigW = RUN[0][0].length * NEAR;
    const awayX = (a: number) => {
      const p = (a - FOX.away) / (FOX.gone - FOX.away);
      return Math.round(w + 2 - (w + bigW + 14) * p);
    };
    function drawGetaway(f: Frame, t: number) {
      const a = t - foxAt;
      if (a < FOX.away || a >= FOX.gone) return;
      const x = awayX(a);
      const step = Math.floor(a / 75) % 4;
      const rows = RUN[step]!;
      // its paws just off the bottom of the picture: it's that close
      const top = h + 2 - rows.length * NEAR;
      // what it's kicking up behind it: spray in the shallows, dust on the bank
      for (let j = 1; j <= 8; j++) {
        const pa = a - j * 70;
        if (pa < FOX.away) break;
        const px = awayX(pa) + bigW * 0.75;
        const age = j * 70;
        const wet = px < bankX + 6;
        for (let i = 0; i < (wet ? 5 : 3); i++) {
          const vx = (hash2(i, j, 51) - 0.3) * 40;
          const vy = -(20 + hash2(i, j, 52) * (wet ? 40 : 18));
          const s = age / 1000;
          const dx = px + vx * s;
          const dy = h - 2 + vy * s + 140 * s * s;
          if (dy > h) continue;
          if (wet) f.set(dx, dy, i % 2 ? P.fish : P.starHi);
          else puff(f, dx, dy, 1 + s * 6, P.cookSmoke, 0.35 * (1 - j / 9));
        }
        if (wet && j % 2 === 0) {
          const r = 2 + age / 40;
          for (let i = 0; i < 16; i++) {
            const ang = (i / 16) * Math.PI * 2;
            f.blend(
              px + Math.cos(ang) * r,
              h - 3 + Math.sin(ang) * r * 0.25,
              P.waterHi2,
              0.7 * (1 - j / 9)
            );
          }
        }
      }
      // lit by the fire as it passes the camp, a little darker over the water
      const lit = Math.max(
        0.75,
        Math.min(1, 1.25 - Math.abs(x + bigW / 2 - fireX) / (w * 0.4))
      );
      stamp(f, rows, x, top, foxCol(lit), NEAR);
      // and the sausage, crosswise in its jaws
      stamp(
        f,
        SAUS_HELD,
        x - 2 * NEAR,
        top + (noseRow(rows) + 1) * NEAR,
        foxCol(lit),
        NEAR
      );
    }

    /** A meteor at progress p (0..1): a bright head and a tail that grows and fades. */
    function meteor(
      f: Frame,
      x0: number,
      y0: number,
      dir: number,
      len: number,
      p: number
    ) {
      const e = 1 - (1 - p) * (1 - p);
      const hx = x0 + dir * e * len;
      const hy = y0 + e * len * 0.36;
      const tail = Math.round(5 + 18 * Math.min(1, p * 3));
      const fade = p < 0.7 ? 1 : (1 - p) / 0.3;
      for (let k = 0; k <= tail; k++) {
        const x = Math.round(hx - dir * k);
        const y = Math.round(hy - k * 0.36);
        if (x < 0 || x >= w || y < 0 || y >= landTop[x]!) continue;
        if (k === 0 && fade > 0.5) f.set(x, y, P.starHi);
        else
          f.blend(
            x,
            y,
            k < 4 ? P.starHi : P.star2,
            (1 - k / tail) * fade * 0.9
          );
      }
    }

    function shootingStar(
      t0: number,
      x0: number,
      y0: number,
      dir: 1 | -1,
      len: number
    ) {
      skyFx.add(t0, 900, (f, age) => meteor(f, x0, y0, dir, len, age / 900));
    }

    function fishJump(t0: number, x0: number, y0: number) {
      const dir = hash2(Math.round(t0), 1, 5) > 0.5 ? 1 : -1;
      const dur = 650;
      fx.add(t0 + 120, dur, (f, age) => {
        const p = age / dur;
        const x = Math.round(x0 + dir * p * 9);
        const y = Math.round(y0 - Math.sin(p * Math.PI) * 9);
        // nose along the arc, tail trailing behind
        const rise = Math.cos(p * Math.PI);
        const ty = rise > 0.3 ? 1 : rise < -0.3 ? -1 : 0;
        f.set(x + dir, y - ty, P.starHi);
        f.set(x, y, P.fish);
        f.set(x - dir, y + ty, P.fish);
        f.set(x - 2 * dir, y + 2 * ty - 1, P.waterHi2);
        f.set(x - 2 * dir, y + 2 * ty + 1, P.waterHi2);
      });
      ripple(fx, t0, x0, y0, P.waterHi2, { rings: 2, size: 8, squash: 0.3 });
      splash(fx, t0 + 80, x0, y0, P.fish, Math.round(t0) % 97);
      ripple(fx, t0 + 120 + dur, x0 + dir * 9, y0, P.waterHi2, {
        rings: 3,
        size: 11,
        squash: 0.3,
      });
      splash(
        fx,
        t0 + 120 + dur,
        x0 + dir * 9,
        y0,
        P.fish,
        (Math.round(t0) + 7) % 97
      );
    }

    function sparkBurst(t0: number) {
      const seed = Math.round(t0) % 1013;
      campFx.add(t0, 2200, (f, age) => {
        const a = age / 1000;
        for (let i = 0; i < 28; i++) {
          const life = 1.1 + hash2(i, 1, seed) * 1.1;
          if (a > life) continue;
          const vx = (hash2(i, 2, seed) - 0.5) * 34;
          const vy = -(24 + hash2(i, 3, seed) * 40);
          const k = 1.4;
          const x =
            fireX +
            (vx * (1 - Math.exp(-k * a))) / k +
            Math.sin(a * 6 + i) * 1.5;
          const y = FIRE - 4 + (vy * (1 - Math.exp(-k * a))) / k + 4 * a * a;
          const v = a / life;
          if (v > 0.7 && hash2(i, Math.floor(age / 60), seed) < 0.4) continue;
          f.set(
            x,
            y,
            v < 0.25
              ? P.fire0
              : v < 0.5
                ? P.fire1
                : v < 0.75
                  ? P.fire2
                  : P.fire3
          );
        }
      });
    }

    // sky pixels only (not Fuji, not the hills)
    const skySet = (f: Frame, x: number, y: number, c: RGB) => {
      x = Math.round(x);
      y = Math.round(y);
      if (x >= 0 && x < w && y >= 0 && y < landTop[x]!) f.set(x, y, c);
    };

    const twinkles = Array.from({ length: Math.round(w / 14) }, (_, i) => ({
      x: Math.floor(hash2(i, 1, 63) * w),
      y: Math.floor(Math.pow(hash2(i, 2, 63), 1.2) * (WATER - 10)),
      ph: hash2(i, 3, 63) * 40,
      big: hash2(i, 4, 63) > 0.8,
    }));

    /** The stove: the pan flares, and a fox comes for a sausage. */
    function cook(t: number) {
      if (!foxPlaying(t)) foxAt = t;
    }

    return {
      render(f, t, pointer) {
        f.copyFrom(backAll);
        // twinkling stars and their crosses
        for (const s of twinkles) {
          const v = Math.sin(t / 650 + s.ph);
          if (v < 0.4) continue;
          skySet(f, s.x, s.y, P.starHi);
          if (s.big && v > 0.8) {
            skySet(f, s.x - 1, s.y, P.star2);
            skySet(f, s.x + 1, s.y, P.star2);
            skySet(f, s.x, s.y - 1, P.star2);
            skySet(f, s.x, s.y + 1, P.star2);
          }
        }
        // a satellite drifting over every so often
        const sp = (t % 52_000) / 26_000;
        if (sp < 1) skySet(f, w * 0.15 + sp * w * 0.8, 10 + sp * 18, P.sat);
        skyFx.draw(f, t);
        // the odd shooting star on its own
        const slot = Math.floor(t / 19_000);
        const ambient = (t % 19_000) / 800;
        if (ambient < 1) {
          const dir = hash2(slot, 3, 64) > 0.5 ? 1 : -1;
          meteor(
            f,
            w * (0.2 + hash2(slot, 1, 64) * 0.6),
            4 + hash2(slot, 2, 64) * 16,
            dir,
            50,
            ambient
          );
        }
        drawUfo(f, t, true);
        capCloud(f, t, false);

        // the lake: the mirrored sky and mountain, rows nudged by the faintest swell
        const src = lake.pixels;
        const dst = f.pixels;
        for (let y = WATER + 1; y < h; y++) {
          const d = y - WATER;
          const amp = 0.35 + d / 30;
          const broken = Math.sin(y * 1.7 + t / 900) > 0.93 ? 2 : 1;
          const o = Math.round(Math.sin(y * 0.8 + t / 520) * amp * broken);
          const row = y * w;
          if (o === 0) dst.set(src.subarray(row, row + w), row);
          else if (o > 0) {
            dst.set(src.subarray(row + o, row + w), row);
            dst.fill(src[row + w - 1]!, row + w - o, row + w);
          } else {
            dst.set(src.subarray(row, row + w + o), row - o);
            dst.fill(src[row]!, row, row - o);
          }
        }
        f.hline(0, w - 1, WATER, P.hillDark);
        capCloud(f, t, true);
        // slow, faint lanes of ripples catching the sky glow
        for (let i = 0; i < Math.round(w / 22); i++) {
          const y = WATER + 3 + Math.floor(hash2(i, 1, 65) * (h - WATER - 6));
          const life = Math.sin(t / 2400 + hash2(i, 2, 65) * 30);
          if (life < 0.3) continue;
          const len =
            3 + Math.round(hash2(i, 3, 65) * 10 * (0.4 + (y - WATER) / 60));
          const x = Math.round(
            hash2(i, 4, 65) * w + Math.sin(t / 3000 + i) * 4
          );
          f.hline(x, x + len, y, life > 0.75 ? P.waterHi2 : P.waterHi);
        }
        // shore lights and their long reflections
        for (const l of lights) {
          const flick = hash2(l.seed, Math.floor(t / 260), 66) > 0.96;
          f.set(l.x, WATER - 2, flick ? P.lampDim : l.c);
          for (let y = WATER + 1; y < WATER + 16; y += 2) {
            const wob = Math.round(
              Math.sin(y * 0.9 + t / 400 + l.seed) * (0.5 + (y - WATER) / 12)
            );
            f.blend(l.x + wob, y, l.c, 0.55 * (1 - (y - WATER) / 16));
          }
        }
        // a car's headlights creeping along the far shore road, until the
        // road turns off into the trees
        const cp = (t % 34_000) / 22_000;
        if (cp < 1) {
          const x = Math.round(-4 + cp * (w * 0.62));
          const a = Math.min(1, (1 - cp) / 0.15);
          f.blend(x, WATER - 1, P.lampHot, a);
          f.blend(x + 1, WATER - 1, P.lamp, a);
          for (let y = WATER + 1; y < WATER + 9; y += 2)
            f.blend(x + 1, y, P.lamp, 0.4 * a * (1 - (y - WATER) / 9));
        }
        drawUfo(f, t, false);
        fx.draw(f, t);
        // the camp's warm light shimmering on the water off the shore
        const warm =
          (lanternOn ? 1 : 0.5) * breatheOf(t) +
          (foxPlaying(t) ? Math.min(1.5, flameOf(t - foxAt)) : 0);
        for (let i = 0; i < 8; i++) {
          const y = BANK + 2 + i * 3 + (i % 2);
          if (y >= h) break;
          const life = Math.sin(t / 760 + i * 2.1);
          if (life < 0.2) continue;
          const len = 2 + (i % 3);
          const x =
            shore[y]! -
            3 -
            len -
            Math.round(hash2(i, 1, 97) * 6 + Math.sin(t / 900 + i) * 1.5);
          for (let k = 0; k < len; k++)
            f.blend(x + k, y, P.tentGlow, 0.3 * life * warm);
        }

        // the camp
        f.over(fg);
        const hover = !!pointer && onFire(pointer.x, pointer.y);
        drawCarLights(f, t);
        drawTent(f, t);
        drawCampers(f, t);
        drawStove(f, t);
        fireLight(f, t, hover);
        cookLight(f, t);
        drawAwningLights(f, t);
        drawFire(f, t, hover);
        drawStick(f, t);
        // steam off the mugs
        for (const [mx, my, period, ph] of [
          [manX + 2, manY + 5, 11_000, 0],
          [womanX + 2, womanY + 5, 13_700, 6100],
        ] as const) {
          const up = lift(t, period, ph);
          for (let i = 0; i < 3; i++) {
            const p = (t / 1800 + i / 3 + mx * 0.13) % 1;
            if (p > 0.8) continue;
            f.blend(
              mx - (up === 5 ? 1 : 0) + Math.round(Math.sin(p * 6 + i) * 0.8),
              my - 1 - up - Math.round(p * 7),
              P.steam,
              0.6 * (1 - p)
            );
          }
        }
        drawCooking(f, t);
        drawFox(f, t);
        campFx.draw(f, t);
        drawReeds(f, t);
        // the fox's big moments: up close, then right past the camera
        drawGetaway(f, t);
        drawCloseup(f, t);
      },
      poke(x, y, t) {
        // nothing restarts while it's still going: a second click waits its turn
        if (onFire(x, y)) {
          if (t - flareAt > 2200) {
            flareAt = t;
            sparkBurst(t);
          }
          return;
        }
        if (onKid(x, y)) {
          if (t - marshAt > MARSH_FOR + 400) marshAt = t;
          return;
        }
        if (onAdults(x, y)) {
          if (!toasting(t)) {
            toastAt = t;
            // a shooting star right over the summit, as if on cue
            shootingStar(t + 500, fujiX - 34, 6, 1, 64);
          }
          return;
        }
        if (onStove(x, y)) {
          cook(t);
          return;
        }
        if (onAwning(x, y)) {
          if (t - bulbsAt > bulbs.length * BULB_STEP + 100) {
            bulbsOn = !bulbsOn;
            bulbsAt = t;
          }
          return;
        }
        // (on a phone the tent stands in front of the car)
        if (onTent(x, y)) {
          if (t - lanternAt > 400) {
            lanternOn = !lanternOn;
            lanternAt = t;
          }
          return;
        }
        if (onCar(x, y)) {
          if (t - carAt > CAR_FOR) carAt = t;
          return;
        }
        // a tap a little wide of the stove still gets the sausages going
        if (nearStove(x, y)) {
          cook(t);
          return;
        }
        // Fuji's summit: a cap cloud rolls in, and there's a saucer in it
        if (onSummit(x, y, 6)) {
          if (!ufoPlaying(t)) {
            ufoCap0 = plainCap(t);
            capAt = -Infinity;
            ufoAt = t;
            ripple(fx, t + UFO.fish, hoverX, footY, P.waterHi2, {
              rings: 3,
              size: 26,
              squash: 0.22,
            });
          }
          return;
        }
        // anywhere else on Fuji: just a cap cloud
        if (onFuji(x, y)) {
          if (!ufoPlaying(t) && t - capAt > 9000) capAt = t;
          return;
        }
        if (onLake(x, y)) {
          fishJump(t, x, y);
          return;
        }
        if (y < WATER && y < landTop[Math.max(0, Math.min(w - 1, x))]!) {
          const dir = x < w / 2 ? 1 : -1;
          shootingStar(t, x - dir * 20, Math.max(2, y - 8), dir, 70);
        }
      },
      eggs(t) {
        const spots: EggSpot[] = [];
        if (!ufoPlaying(t)) spots.push({ id: 'ufo', ...summit });
        if (!foxPlaying(t)) spots.push({ id: 'fox', ...stoveSpot });
        return spots;
      },
      hot(x, y) {
        return (
          onStove(x, y) ||
          onSummit(x, y) ||
          onFire(x, y) ||
          onKid(x, y) ||
          onAdults(x, y) ||
          onAwning(x, y) ||
          onCar(x, y) ||
          onTent(x, y) ||
          onFuji(x, y) ||
          onLake(x, y) ||
          (y < WATER && y < landTop[Math.max(0, Math.min(w - 1, x))]!)
        );
      },
    };
  },
};
