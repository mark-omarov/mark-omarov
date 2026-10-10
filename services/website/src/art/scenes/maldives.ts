// The Maldives at midday, from the beach of a resort island: a jetty of
// thatched water villas runs out across a lagoon that goes from almost-white
// shallows through turquoise to deep blue at the reef, a sandbank with a few
// palms, stingrays and baby sharks in the shallows, a dhoni out by the reef.
// The villas are real little 3D boxes projected from one camera, so the row
// recedes properly and the sun lights every roof the same way.
//
// Click the sky for a seaplane to come in and land, a villa for a guest to
// dive off the deck, the lagoon for a manta ray or a reef shark, the deep
// water by the reef (or the dhoni) for dolphins, the palm to shake it and
// its coconuts to drop one. Easter eggs:
// - palm: the young palm with a little plaque on the beach. The picture
//   dips through a heart into a beach ceremony close-up (an arch, a couple,
//   the signing, champagne, petals and hearts) and back;
// - sharks: the two snorkels bobbing in the lagoon. The water goes clear
//   and small blacktip reef sharks come round to circle the snorkellers.

import { bayer, Frame, lerpRGB, type RGB } from '../frame';
import { Fx, ripple, splash } from '../fx';
import { hash2, noise1 } from '../noise';
import { clouds, gradient } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';
import {
  heartMax,
  heartOpen,
  heartWipe,
  plaque,
  sapling,
  saplingTwinkle,
  CEREMONY,
  type CeremonyView,
  ceremonyView,
} from '../things/maldives-ceremony';

const P = palette({
  sky0: '#1452c2',
  sky1: '#1d68d2',
  sky2: '#2f82dc',
  sky3: '#4e9ee7',
  sky4: '#78bbf0',
  sky5: '#a8d6f6',
  sky6: '#d4ecfb',
  cloudLight: '#ffffff',
  cloudBase: '#e4f1fc',
  cloudShadow: '#a3c2e8',
  ocean0: '#1a44a2',
  ocean1: '#1f58b6',
  surf: '#ffffff',
  foam: '#bdebf9',
  lag0: '#1084c4',
  lag1: '#129dd1',
  lag2: '#18b4d7',
  lag3: '#26c6d9',
  lag4: '#44d4da',
  lag5: '#6ee0db',
  lag6: '#9cebde',
  lag7: '#c4f4e7',
  glint: '#ffffff',
  caustic: '#e6fff7',
  deep: '#0a5a84',
  shade: '#0b6a96',
  sand0: '#fff9e8',
  sand1: '#f8eaca',
  sand2: '#e9d3a2',
  sand3: '#cdb07a',
  wet: '#e4e2c6',
  halo0: '#dbf9f0',
  halo1: '#aef0e3',
  isle0: '#155234',
  isle1: '#22713f',
  isle2: '#3a9a4b',
  isle3: '#72c25a',
  frond0: '#175a33',
  frond1: '#24813f',
  frond2: '#49ab4c',
  frond3: '#93d35e',
  bark0: '#5a4638',
  bark1: '#87705a',
  bark2: '#b59b7b',
  nut: '#7a5a2a',
  nutHi: '#a8873e',
  // villas
  th0: '#5a2f22',
  th1: '#8d4f2c',
  th2: '#c38a40',
  th3: '#e7b552',
  th4: '#fbdc86',
  wd0: '#3e2420',
  wd1: '#653629',
  wd2: '#8f5034',
  wd3: '#b06a40',
  wd4: '#c9875a',
  wl0: '#8592c0',
  wl1: '#a9b3c9',
  wl2: '#d9dde4',
  wl3: '#f4f1e8',
  wl4: '#ffffff',
  glass: '#1f5470',
  glassHi: '#7cc8e2',
  post: '#5a3a2a',
  postDark: '#3c271f',
  pool: '#3fe3ef',
  poolHi: '#b4fbff',
  cushion: '#ffffff',
  cushionSh: '#c7dbe4',
  canopy: '#fff6e0',
  canopySh: '#d6c3a0',
  rope: '#d8c49a',
  skin: '#d9996a',
  skinDark: '#9a5e3e',
  suitA: '#ff5a6e',
  suitB: '#1f3f8f',
  suitC: '#ffd23f',
  towel: '#ff8a3d',
  // boats, planes, animals
  hullW: '#f7f5ee',
  hullSh: '#b9c3cc',
  hullWood: '#9a5a32',
  hullBlue: '#2058b4',
  canvas: '#f0e6cc',
  planeW: '#fbfbf7',
  planeSh: '#b4c0cf',
  planeStripe: '#1e5fc4',
  planeStripe2: '#ffc21a',
  planeWin: '#22324e',
  planeDark: '#3a4558',
  prop: '#c8d0da',
  dolphin: '#55728e',
  dolphinHi: '#a9bfd2',
  bird: '#2a2f3a',
  birdW: '#ffffff',
  heron: '#8e98a6',
  board: '#ffd23f',
  buoy: '#ff7a1a',
  ray: '#0d4c6a',
  shark: '#3a5664',
  sharkTip: '#121a22',
  manta: '#0a2e46',
  fish: '#ffe36b',
  // the snorkellers and the blacktips
  clear0: '#62dcdc',
  clear1: '#8eeae2',
  clear2: '#bcf6ea',
  clear3: '#e2fff4',
  sandRib: '#7fd2c8',
  sandShade: '#3f9fa8',
  coral0: '#ff8a7a',
  coral1: '#c86ad8',
  coral2: '#ffb84a',
  rash: '#1c1f2b',
  rashLit: '#3a4058',
  trunks: '#2f5fb8',
  swim: '#ff5a7a',
  swimHi: '#ff8c9e',
  swimSh: '#c23a5a',
  wHair: '#16121a',
  mHair: '#a8784a',
  mBeard: '#83582f',
  lens: '#c8dcff',
  finM: '#20242e',
  finW: '#ffd23f',
  tubeM: '#ff7a1a',
  tubeW: '#b8f04a',
  tip: '#14181c',
  btTop: '#5c635c',
  btMid: '#7e8678',
  btBelly: '#d2dacb',
  fishSilver: '#dfeef6',
});

const H0 = 44; // horizon
const REEF = 51; // the reef edge: breakers, deep blue beyond
const F = 150; // px per world unit at distance 1 (a villa is one unit, ~10 m)
const CAM = 1.3; // eye height, in villas

type V3 = [number, number, number];
type Ramp = readonly [RGB, RGB, RGB, RGB, RGB];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
};
// high sun, a little to the right and behind the camera
const SUN = unit([0.45, 1, -0.35]);
const EYE: V3 = [0, CAM, 0];
const lightIndex = (n: V3) => {
  const l = dot(n, SUN);
  return l > 0.85 ? 4 : l > 0.6 ? 3 : l > 0.32 ? 2 : l > 0.1 ? 1 : 0;
};

const THATCH: Ramp = [P.th0, P.th1, P.th2, P.th3, P.th4];
const WOOD: Ramp = [P.wd0, P.wd1, P.wd2, P.wd3, P.wd4];
const WALL: Ramp = [P.wl0, P.wl1, P.wl2, P.wl3, P.wl4];
const CUSHION: Ramp = [
  P.cushionSh,
  P.cushionSh,
  P.cushionSh,
  P.cushion,
  P.cushion,
];

type Cam = {
  proj(X: number, Y: number, Z: number): [number, number];
  /** The world point under screen pixel (x, y) on a plane. */
  unproject(x: number, y: number, p0: V3, n: V3): V3 | null;
};

type Tex = (p: V3, d: V3, k: number, ramp: Ramp) => RGB;

/** A flat polygon in the world, culled if it faces away, lit by the sun. */
function face(
  f: Frame,
  cam: Cam,
  pts: V3[],
  inside: V3,
  ramp: Ramp,
  tex?: Tex
) {
  let n = unit(cross(sub(pts[1]!, pts[0]!), sub(pts[2]!, pts[0]!)));
  if (dot(n, sub(pts[0]!, inside)) < 0) n = [-n[0], -n[1], -n[2]];
  if (dot(n, sub(EYE, pts[0]!)) <= 0) return;
  const k = lightIndex(n);
  const scr = pts.map((p) => cam.proj(p[0], p[1], p[2]));
  if (!tex) {
    f.poly(scr, ramp[k]);
    return;
  }
  f.poly(scr, (x, y) => {
    const p = cam.unproject(x, y, pts[0]!, n);
    const q = cam.unproject(x, y + 1, pts[0]!, n);
    if (!p || !q) return ramp[k];
    return tex(p, sub(q, p), k, ramp);
  });
}

/** An axis-aligned box; only the faces the camera can see get drawn. */
function box(
  f: Frame,
  cam: Cam,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  ramp: Ramp,
  tex?: Partial<Record<'top' | 'front' | 'side', Tex>>
) {
  const c: V3 = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
  // left, right, front, top
  face(
    f,
    cam,
    [
      [x0, y0, z1],
      [x0, y0, z0],
      [x0, y1, z0],
      [x0, y1, z1],
    ],
    c,
    ramp,
    tex?.side
  );
  face(
    f,
    cam,
    [
      [x1, y0, z0],
      [x1, y0, z1],
      [x1, y1, z1],
      [x1, y1, z0],
    ],
    c,
    ramp,
    tex?.side
  );
  face(
    f,
    cam,
    [
      [x0, y0, z0],
      [x1, y0, z0],
      [x1, y1, z0],
      [x0, y1, z0],
    ],
    c,
    ramp,
    tex?.front
  );
  face(
    f,
    cam,
    [
      [x0, y1, z0],
      [x1, y1, z0],
      [x1, y1, z1],
      [x0, y1, z1],
    ],
    c,
    ramp,
    tex?.top
  );
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const frac = (v: number) => v - Math.floor(v);
const unlerp = (v: number, a: number, b: number) =>
  clamp((v - a) / (b - a), 0, 1);
const smooth = (p: number) => p * p * (3 - 2 * p);

type Villa = {
  X: number;
  Z: number;
  seed: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

// ---------- the palm, with a sway we control ----------

type PalmStyle = {
  f0: RGB;
  f1: RGB;
  f2: RGB;
  f3: RGB;
  b0: RGB;
  b1: RGB;
  b2: RGB;
};

/** Returns the crown position. */
function drawPalm(
  f: Frame,
  x: number,
  base: number,
  h: number,
  lean: number,
  sway: number,
  seed: number,
  S: PalmStyle,
  fronds = 11
) {
  const big = h > 60;
  let tx = x;
  let ty = base;
  for (let i = 0; i <= h; i++) {
    const v = i / h;
    tx = x + lean * h * 0.5 * v * v + sway * v * v * h * 0.04;
    ty = base - i;
    const thick = big
      ? Math.round(5 - v * 2.4)
      : h > 22
        ? v < 0.5
          ? 2
          : 1
        : 1;
    for (let k = 0; k < thick; k++) {
      let c = k === 0 ? S.b0 : k === thick - 1 ? S.b2 : S.b1;
      if (i % 4 === 0 && thick > 1) c = k === thick - 1 ? S.b1 : S.b0; // growth rings
      f.set(Math.round(tx) + k - (thick >> 1), ty, c);
    }
  }
  const cx = Math.round(tx);
  const cy = Math.round(ty);
  const L = big ? h * 0.4 : h * 0.5;
  const maxW = big ? 6 : h > 22 ? 2.5 : 1.6;
  // back fronds first (darker), then the ones facing us
  const order = Array.from({ length: fronds }, (_, k) => k).sort(
    (a, b) => hash2(a, seed, 4) - hash2(b, seed, 4)
  );
  for (const [n, k] of order.entries()) {
    const back = n < fronds * 0.4;
    const spread = (k / (fronds - 1)) * 2 - 1;
    const ang =
      -Math.PI / 2 +
      spread * 1.85 +
      sway * (0.6 + Math.abs(spread)) +
      (hash2(k, seed, 3) - 0.5) * 0.3;
    const len =
      L *
      (0.75 + hash2(k, seed, 9) * 0.35) *
      (1 - Math.abs(spread) * 0.08) *
      (back ? 0.9 : 1);
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    const droop = big ? 0.75 : 0.6;
    const pt = (j: number) => {
      const v = j / len;
      return [cx + dx * j, cy + dy * j + v * v * len * droop] as const;
    };
    for (let j = 1; j < len; j += 0.6) {
      const v = j / len;
      const [px, py] = pt(j);
      const [qx, qy] = pt(j + 0.6);
      const tl = Math.hypot(qx - px, qy - py) || 1;
      const tx2 = (qx - px) / tl;
      const ty2 = (qy - py) / tl;
      // leaflets hang below the spine, raked towards the tip
      let nx = -ty2;
      let ny = tx2;
      if (ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      const hx = nx * 0.8 + tx2 * 0.6;
      const hy = ny * 0.8 + ty2 * 0.6;
      const notch = Math.floor(j) % 3 === 0 ? 0.5 : 1;
      const wdt = Math.max(
        0,
        Math.sin(Math.min(1, v * 1.15) * Math.PI) ** 0.6 * maxW * notch
      );
      for (let m = 0; m <= wdt; m += 0.7) {
        const c =
          m < 0.7
            ? back
              ? S.f1
              : v < 0.55
                ? S.f3
                : S.f2
            : back
              ? m > wdt * 0.5
                ? S.f0
                : S.f1
              : m < wdt * 0.45
                ? S.f2
                : m < wdt * 0.8
                  ? S.f1
                  : S.f0;
        f.set(px + hx * m, py + hy * m, c);
      }
    }
  }
  if (h > 40) {
    f.disc(cx - 1, cy + 2, 1, P.nut);
    f.disc(cx + 2, cy + 2, 1, P.nutHi);
    f.disc(cx, cy + 3, 1, P.nut);
    f.set(cx + 2, cy + 1, P.frond3);
  }
  return [cx, cy] as const;
}

// ---------- sprites ----------

export const maldives: Scene = {
  id: 'maldives',
  name: 'Maldives',
  country: '',
  create(w, h) {
    const vp = Math.round(w / 2);
    const cam: Cam = {
      proj: (X, Y, Z) => [vp + (F * X) / Z, H0 + (F * (CAM - Y)) / Z],
      unproject(x, y, p0, n) {
        const d: V3 = [(x + 0.5 - vp) / F, -(y + 0.5 - H0) / F, 1];
        const den = dot(n, d);
        if (Math.abs(den) < 1e-9) return null;
        const t = dot(n, sub(p0, EYE)) / den;
        return [d[0] * t, CAM + d[1] * t, t];
      },
    };
    const yAt = (Z: number, Y = 0) => H0 + (F * (CAM - Y)) / Z;
    const xAt = (X: number, Z: number) => vp + (F * X) / Z;
    const Xof = (x: number, Z: number) => ((x - vp) * Z) / F;

    // ---- layout ----
    const near = clamp(w * 0.235, 46, 120); // nearest villa, px right of centre
    const Z0 = 3.6;
    const STEP = 2.15;
    const rowX = (near * Z0) / F;
    const JX0 = rowX + 0.64; // the jetty's walkway
    const JX1 = rowX + 0.92;
    const ROW = 6;
    const ZT = Z0 + ROW * STEP + 0.3; // the far arm of the T
    const villas: Villa[] = [];
    for (let i = 0; i < ROW; i++)
      villas.push({
        X: rowX,
        Z: Z0 + i * STEP,
        seed: i,
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
      });
    let armL = rowX;
    let armR = rowX;
    for (let k = -2; k <= 3; k++) {
      const X = rowX + k * 1.6;
      const sx = xAt(X, ZT);
      if (sx < -6 || sx > w + 6) continue;
      villas.push({ X, Z: ZT, seed: 30 + k, x0: 0, y0: 0, x1: 0, y1: 0 });
      armL = Math.min(armL, X);
      armR = Math.max(armR, X);
    }
    // the sandbank out on the left
    const isleZ = 7.4;
    const isleX = Xof(vp - clamp(w * 0.28, 52, 150), isleZ);
    // the beach we're standing on
    const beachW = clamp(w * 0.25, 56, 150);
    const shoreY = (x: number) =>
      x >= beachW ? Infinity : h - (h - 114) * Math.sqrt(1 - (x / beachW) ** 2);
    const palmX = Math.round(beachW * 0.22);
    const palmBase = 146;
    const palmH = 112;
    const palmLean = 0.42;

    const shadowMask = new Uint8Array(w * h);
    const zbuf = new Float32Array(w * h).fill(Infinity);

    function shadowQuad(
      xa: number,
      xb: number,
      za: number,
      zb: number,
      height: number
    ) {
      const ox = (-SUN[0] / SUN[1]) * height;
      const oz = (-SUN[2] / SUN[1]) * height;
      const pts = [
        cam.proj(xa + ox, 0, za + oz),
        cam.proj(xb + ox, 0, za + oz),
        cam.proj(xb + ox, 0, zb + oz),
        cam.proj(xa + ox, 0, zb + oz),
      ];
      const m = new Frame(w, h);
      m.poly(pts, 1);
      for (let i = 0; i < w * h; i++)
        if (m.pixels[i]! >>> 24) shadowMask[i] = 1;
    }

    // ---------- the villas and the jetty, painted far to near ----------

    function drawVilla(f: Frame, v: Villa) {
      const { X, Z, seed } = v;
      const s = F / Z;
      const W = (dx: number, y: number, dz: number): V3 => [X + dx, y, Z + dz];
      const put = (dx: number, y: number, dz: number) =>
        cam.proj(X + dx, y, Z + dz);
      const left = X > 0; // we see its left side
      const pw = s > 36 ? 2 : 1;
      // stilts
      const fronts =
        s > 26
          ? [-0.6, -0.3, 0, 0.3, 0.6]
          : s > 12
            ? [-0.6, 0, 0.6]
            : [-0.55, 0.55];
      for (const dz of [0.38, -0.1]) {
        const ex = left ? -0.62 : 0.6;
        const [px, py0] = put(ex, 0, dz);
        const [, py1] = put(ex, 0.2, dz);
        f.rect(
          Math.round(px),
          Math.round(py1),
          pw,
          Math.round(py0) - Math.round(py1) + 1,
          P.postDark
        );
      }
      for (const dx of fronts) {
        const [px, py0] = put(dx, 0, -0.6);
        const [, py1] = put(dx, 0.2, -0.6);
        f.rect(
          Math.round(px),
          Math.round(py1),
          pw,
          Math.round(py0) - Math.round(py1) + 1,
          P.post
        );
      }
      // deck, with planks running across it
      const planks: Tex = (p, d, k, r) => {
        const dz = Math.abs(d[2]);
        if (dz < 0.034 && frac((p[2] - Z) / 0.1) < dz)
          return r[Math.max(0, k - 1)]!;
        return r[k]!;
      };
      box(f, cam, X - 0.64, X + 0.64, 0.19, 0.24, Z - 0.62, Z + 0.42, WOOD, {
        top: planks,
      });
      // plunge pool and loungers on the front deck
      if (s > 13) {
        const rim = [
          put(0.12, 0.24, -0.58),
          put(0.6, 0.24, -0.58),
          put(0.6, 0.24, -0.18),
          put(0.12, 0.24, -0.18),
        ];
        f.poly(rim, P.wl3);
        const pool = [
          put(0.16, 0.24, -0.54),
          put(0.56, 0.24, -0.54),
          put(0.56, 0.24, -0.22),
          put(0.16, 0.24, -0.22),
        ];
        f.poly(pool, (x, y) =>
          y <= Math.round(put(0, 0.24, -0.22)[1]) + (s > 30 ? 1 : 0)
            ? P.poolHi
            : P.pool
        );
      }
      if (s > 16) {
        for (const lx of [-0.52, -0.32])
          box(
            f,
            cam,
            X + lx - 0.06,
            X + lx + 0.06,
            0.24,
            0.27,
            Z - 0.58,
            Z - 0.34,
            CUSHION
          );
        // someone sunbathing
        if (hash2(seed, 1, 5) > 0.35 && s > 24) {
          const [gx, gy] = put(-0.52, 0.27, -0.46);
          f.set(gx, gy, P.skin);
          f.set(gx, gy + 1, [P.suitA, P.suitB, P.suitC][seed % 3]!);
          if (s > 34) f.set(gx, gy - 1, P.skin);
        }
      }
      // the villa itself
      const glassTex: Tex = (p, d, k, r) => {
        const u = p[0] - X;
        const yy = p[1];
        if (yy < 0.25 || yy > 0.45 || u < -0.37 || u > 0.33) return r[k]!;
        const dx = Math.max(0.02, Math.abs(d[0]) + 1 / s);
        if (frac((u + 0.37) / 0.175) < dx / 0.175)
          return r[Math.min(4, k + 1)]!;
        // a streak of sky reflected in the glass
        return frac((u * 3 - yy * 4) * 1.2) < 0.18 ? P.glassHi : P.glass;
      };
      box(f, cam, X - 0.4, X + 0.36, 0.24, 0.47, Z - 0.08, Z + 0.4, WALL, {
        front: glassTex,
      });
      // the thatched hip roof
      const eave = 0.47;
      const ridge = 1.02;
      const thatch: Tex = (p, d, k, r) => {
        const y = p[1] - eave;
        const dy = Math.max(0.004, Math.abs(d[1]));
        if (y < dy * 1.01) return r[Math.max(0, k - 2)]!; // shadowy fringe
        if (y < dy * 2.01 && s > 18) return r[Math.min(4, k + 1)]!; // lit lip
        if (p[1] > ridge - dy * 1.2) return r[Math.max(0, k - 1)]!; // ridge cap
        const step = (ridge - eave) / 3;
        if (s > 22 && frac(y / step) < dy / step) return r[Math.max(0, k - 1)]!;
        return r[k]!;
      };
      const eL = -0.58;
      const eR = 0.54;
      const eF = -0.28;
      const eB = 0.58;
      const rL = -0.06;
      const rR = 0.03;
      const rZ = 0.15;
      const rc = W(0, 0.6, 0.15);
      face(
        f,
        cam,
        [W(eR, eave, eB), W(eL, eave, eB), W(rL, ridge, rZ), W(rR, ridge, rZ)],
        rc,
        THATCH,
        thatch
      );
      face(
        f,
        cam,
        [W(eL, eave, eB), W(eL, eave, eF), W(rL, ridge, rZ)],
        rc,
        THATCH,
        thatch
      );
      face(
        f,
        cam,
        [W(eR, eave, eF), W(eR, eave, eB), W(rR, ridge, rZ)],
        rc,
        THATCH,
        thatch
      );
      face(
        f,
        cam,
        [W(eL, eave, eF), W(eR, eave, eF), W(rR, ridge, rZ), W(rL, ridge, rZ)],
        rc,
        THATCH,
        thatch
      );
      // a finial on the ridge
      if (s > 20) {
        const [fx, fy] = put((rL + rR) / 2, ridge, rZ);
        f.vline(
          Math.round(fx),
          Math.round(fy) - Math.round(s * 0.06),
          Math.round(fy),
          P.th0
        );
      }
      // a parasol and the ladder into the lagoon
      if (s > 16) {
        const [ax, ay] = put(-0.1, 0.24, -0.46);
        const [, ty] = put(-0.1, 0.44, -0.46);
        f.vline(Math.round(ax), Math.round(ty), Math.round(ay), P.wd1);
        const r = Math.max(2, Math.round(s * 0.13));
        for (let dy = 0; dy <= Math.round(r * 0.6); dy++) {
          const half = Math.round(
            r * (0.35 + (0.65 * dy) / Math.max(1, r * 0.6))
          );
          f.hline(
            Math.round(ax) - half,
            Math.round(ax),
            Math.round(ty) + dy,
            P.canopySh
          );
          f.hline(
            Math.round(ax) + 1,
            Math.round(ax) + half,
            Math.round(ty) + dy,
            P.canopy
          );
        }
      }
      if (s > 22) {
        const [lx, ly0] = put(-0.48, 0.24, -0.63);
        const [, ly1] = put(-0.48, -0.03, -0.63);
        const lw = Math.max(2, Math.round(s * 0.06));
        f.vline(Math.round(lx), Math.round(ly0) - 1, Math.round(ly1), P.wl3);
        f.vline(
          Math.round(lx) + lw,
          Math.round(ly0) - 1,
          Math.round(ly1),
          P.wl1
        );
        for (let y = Math.round(ly0) + 1; y < Math.round(ly1); y += 2)
          f.hline(Math.round(lx), Math.round(lx) + lw, y, P.wl2);
      }
      // someone standing at the rail
      if (s > 20 && hash2(seed, 2, 5) > 0.55) {
        const [gx, gy] = put(0.3, 0.24, -0.6);
        const tall = Math.max(3, Math.round(s * 0.15));
        f.vline(
          Math.round(gx),
          Math.round(gy) - tall,
          Math.round(gy) - 1,
          P.skin
        );
        f.set(
          Math.round(gx),
          Math.round(gy) - Math.round(tall * 0.45),
          [P.suitA, P.suitB, P.towel][seed % 3]!
        );
        f.set(Math.round(gx), Math.round(gy) - tall, P.skinDark);
      }
    }

    function drawJetty(f: Frame, za: number, zb: number) {
      const planks: Tex = (p, d, k, r) => {
        const dz = Math.abs(d[2]);
        if (dz < 0.06 && frac(p[2] / 0.18) < dz / 0.18)
          return r[Math.max(0, k - 1)]!;
        return r[k]!;
      };
      // posts under the walkway
      for (let z = Math.ceil(za / 0.75) * 0.75; z <= zb; z += 0.75) {
        for (const ex of [JX0 + 0.02, JX1 - 0.02]) {
          const [px, py0] = cam.proj(ex, 0, z);
          const [, py1] = cam.proj(ex, 0.2, z);
          f.vline(
            Math.round(px),
            Math.round(py1),
            Math.round(py0),
            ex === JX0 + 0.02 ? P.post : P.postDark
          );
        }
      }
      box(f, cam, JX0, JX1, 0.19, 0.24, za, zb, WOOD, { top: planks });
      // rope rail on posts along both edges
      for (const ex of [JX0 + 0.01, JX1 - 0.01]) {
        let prev: [number, number] | null = null;
        for (let z = Math.ceil(za / 0.75) * 0.75; z <= zb + 0.001; z += 0.75) {
          const [px, py] = cam.proj(ex, 0.24, z);
          const [, ty] = cam.proj(ex, 0.33, z);
          f.vline(Math.round(px), Math.round(ty), Math.round(py), P.wd1);
          if (prev) f.line(prev[0], prev[1] + 1, px, ty + 1, P.rope);
          prev = [px, ty];
        }
      }
    }

    function drawArm(f: Frame) {
      const z0 = ZT - 0.95;
      const z1 = ZT - 0.67;
      const x0 = armL - 0.5;
      const x1 = armR + 0.5;
      for (let x = Math.ceil(x0 / 0.75) * 0.75; x <= x1; x += 0.75) {
        const [px, py0] = cam.proj(x, 0, z0);
        const [, py1] = cam.proj(x, 0.2, z0);
        f.vline(Math.round(px), Math.round(py1), Math.round(py0), P.post);
      }
      box(f, cam, x0, x1, 0.19, 0.24, z0, z1, WOOD);
    }

    // ---------- static layers ----------

    const base = layer(w, h, (f) => {
      gradient(f, 0, H0, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
      ]);
      // far islands sitting on the horizon
      const isles = [
        { x: w * 0.04, r: Math.min(46, w * 0.12) },
        { x: w * 0.97, r: Math.min(30, w * 0.08) },
      ];
      f.rect(0, H0, w, REEF - H0, P.ocean1);
      f.hline(0, w, H0, P.ocean0);
      f.hline(0, w, H0 + 1, P.ocean0);
      for (const is of isles) {
        for (let x = Math.floor(is.x - is.r); x <= is.x + is.r; x++) {
          const u = (x - is.x) / is.r;
          if (Math.abs(u) >= 1) continue;
          const top =
            H0 +
            1 -
            Math.round(Math.sqrt(1 - u * u) * 4 + noise1(x / 2.5, 4) * 2);
          f.vline(
            x,
            top,
            H0,
            Math.abs(u) > 0.7
              ? P.isle1
              : noise1(x / 3, 9) > 0.55
                ? P.isle2
                : P.isle1
          );
          f.set(x, top, P.isle2);
          f.set(x, H0 + 1, P.sand1);
        }
        // a couple of palms poking out of the jungle
        for (const k of [-0.4, 0.2]) {
          const px = Math.round(is.x + k * is.r);
          f.vline(px, H0 - 7, H0 - 3, P.isle0);
          f.hline(px - 2, px + 2, H0 - 7, P.isle1);
          f.set(px - 2, H0 - 6, P.isle1);
          f.set(px + 2, H0 - 6, P.isle1);
        }
      }
      // the lagoon, shading lighter as it gets shallower towards us
      gradient(f, REEF + 1, h, [
        P.lag0,
        P.lag1,
        P.lag2,
        P.lag3,
        P.lag4,
        P.lag5,
        P.lag6,
        P.lag7,
      ]);
      f.hline(0, w, REEF + 1, P.lag0);
      // coral heads showing through the water
      const bommies: [number, number, number][] = [];
      for (let i = 0; i < 18; i++) {
        const Z = 4 + hash2(i, 1, 71) * 18;
        const x = hash2(i, 2, 71) * w;
        bommies.push([Xof(x, Z), Z, 0.25 + hash2(i, 3, 71) * 0.55]);
      }
      for (const [bx, bz, br] of bommies) {
        const cx = xAt(bx, bz);
        const cy = yAt(bz);
        const rx = (F * br) / bz;
        const ry = (yAt(bz - br * 0.6) - yAt(bz + br * 0.6)) / 2;
        for (let y = Math.floor(cy - ry); y <= cy + ry; y++) {
          for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
            const d =
              Math.hypot((x - cx) / rx, (y - cy) / Math.max(0.8, ry)) +
              (noise1(x / 2 + y * 3.1, 5) - 0.5) * 0.5;
            if (d < 1) f.blend(x, y, P.deep, d < 0.5 ? 0.34 : 0.2);
          }
        }
      }
      // the sandbank: white sand in pale halos of shallow water
      const ix = xAt(isleX, isleZ);
      const iy = yAt(isleZ);
      const rings: [number, RGB][] = [
        [2.6, P.lag5],
        [2.15, P.halo1],
        [1.75, P.halo0],
        [1.45, P.sand1],
        [1.2, P.sand0],
      ];
      for (const [r, c] of rings) {
        const rx = (F * r) / isleZ;
        const ry = (yAt(isleZ - r * 0.38) - yAt(isleZ + r * 0.38)) / 2;
        for (let y = Math.floor(iy - ry); y <= iy + ry; y++) {
          const half = rx * Math.sqrt(Math.max(0, 1 - ((y - iy) / ry) ** 2));
          if (half > 0.5)
            f.hline(Math.round(ix - half), Math.round(ix + half), y, c);
        }
      }
      // the beach under our feet
      for (let x = 0; x < beachW; x++) {
        const top = Math.round(shoreY(x));
        for (let y = top; y < h; y++) {
          const d = y - top;
          f.set(
            x,
            y,
            d < 2
              ? P.wet
              : d < 4
                ? P.sand2
                : (x + y * 3) % 23 === 0 && hash2(x, y, 3) > 0.5
                  ? P.sand2
                  : P.sand0
          );
        }
      }
      // a thatched parasol and a pair of loungers
      if (beachW > 70) {
        const ux = Math.round(beachW * 0.64);
        const uy = h - 7;
        for (let y = uy - 1; y <= uy + 1; y++)
          f.hline(
            ux - 9 + Math.abs(y - uy),
            ux + 6 - Math.abs(y - uy),
            y,
            P.sand2
          );
        f.vline(ux, uy - 15, uy, P.wd1);
        for (let r = 0; r < 6; r++) {
          const half = 2 + r * 2;
          f.hline(ux - half, ux - 1, uy - 19 + r, r === 5 ? P.th1 : P.th2);
          f.hline(ux, ux + half, uy - 19 + r, r === 5 ? P.th2 : P.th3);
        }
        for (let x = ux - 12; x <= ux + 12; x += 2) f.set(x, uy - 13, P.th1);
        f.set(ux, uy - 20, P.th1);
        for (const lx of [ux - 16, ux - 6]) {
          f.hline(lx - 1, lx + 7, uy + 1, P.sand2);
          f.hline(lx, lx + 6, uy - 2, P.glassHi);
          f.hline(lx, lx + 6, uy - 1, P.wd2);
          f.set(lx + 7, uy - 3, P.glassHi);
          f.set(lx + 7, uy - 2, P.wd2);
          f.set(lx + 8, uy - 4, P.glassHi);
          f.set(lx, uy, P.wd1);
          f.set(lx + 6, uy, P.wd1);
        }
        f.hline(ux - 14, ux - 11, uy - 2, P.towel);
        f.hline(ux - 5, ux - 2, uy - 3, P.skin);
        f.set(ux - 3, uy - 3, P.suitA);
        f.set(ux - 1, uy - 3, P.skinDark);
      }
      // shells
      for (let i = 0; i < 6; i++) {
        const x = Math.floor(hash2(i, 1, 33) * beachW * 0.9);
        const y = Math.round(
          shoreY(x) + 5 + hash2(i, 2, 33) * (h - shoreY(x) - 6)
        );
        if (y < h - 1) f.set(x, y, i % 2 ? P.sand3 : P.cushion);
      }
      // shadows of the jetty and villas on the water
      shadowQuad(JX0, JX1, 1.2, ZT - 0.67, 0.24);
      shadowQuad(armL - 0.5, armR + 0.5, ZT - 0.95, ZT - 0.67, 0.24);
      for (const v of villas) {
        shadowQuad(v.X - 0.64, v.X + 0.64, v.Z - 0.62, v.Z + 0.42, 0.24);
        shadowQuad(v.X - 0.56, v.X + 0.52, v.Z - 0.26, v.Z + 0.56, 0.6);
      }
      for (let y = REEF + 1; y < h; y++)
        for (let x = 0; x < w; x++)
          if (shadowMask[y * w + x] && y < shoreY(x))
            f.blend(x, y, P.shade, 0.42);
    });

    // villas and jetty, with a depth buffer so things can walk among them
    type Item = { z: number; key: number; draw: (f: Frame) => void };
    const items: Item[] = [];
    for (const v of villas)
      items.push({
        z: v.Z + 0.3,
        key: v.Z * 100 + Math.abs(v.X),
        draw: (f) => drawVilla(f, v),
      });
    const row = villas.filter((v) => v.Z < ZT - 1);
    for (const v of row)
      items.push({
        z: Infinity,
        key: (v.Z + 0.001) * 100 + 99,
        draw: (f) => drawJetty(f, v.Z - STEP / 2, v.Z + STEP / 2),
      });
    const lastZ = row[row.length - 1]!.Z + STEP / 2;
    items.push({
      z: Infinity,
      key: (ZT - 0.67) * 100 + 99,
      draw: (f) => drawJetty(f, lastZ, ZT - 0.67),
    });
    items.push({ z: Infinity, key: (ZT - 0.8) * 100 + 99, draw: drawArm });
    items.push({
      z: Infinity,
      key: (Z0 - STEP / 2) * 100,
      draw: (f) => drawJetty(f, 1.2, Z0 - STEP / 2),
    });
    items.sort((a, b) => b.key - a.key);
    const resort = new Frame(w, h);
    const tmp = new Frame(w, h);
    for (const it of items) {
      tmp.clear();
      it.draw(tmp);
      for (let i = 0; i < w * h; i++) {
        const p = tmp.pixels[i]!;
        if (!(p >>> 24)) continue;
        resort.pixels[i] = p;
        zbuf[i] = it.z;
      }
    }
    for (const v of villas) {
      const s = F / v.Z;
      const [cx, cy] = cam.proj(v.X, 0, v.Z);
      v.x0 = cx - s * 0.66;
      v.x1 = cx + s * 0.66;
      v.y0 = yAt(v.Z + 0.15, 0.9);
      v.y1 = cy + s * 0.35;
    }

    const cloudLayer = layer(w, h, (f) => {
      clouds(f, {
        seed: 64,
        y0: 6,
        y1: 37,
        cell: 7,
        coverage: 0.4,
        stretch: 3,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });

    // the far palms on the sandbank don't move much: bake them
    const isle = layer(w, h, (f) => {
      const ix = xAt(isleX, isleZ);
      const iy = yAt(isleZ);
      const s = F / isleZ;
      const style = {
        f0: P.frond0,
        f1: P.frond1,
        f2: P.frond2,
        f3: P.frond3,
        b0: P.bark0,
        b1: P.bark1,
        b2: P.bark2,
      };
      // bushes along the middle, lit from the upper right
      for (let k = 0; k < 7; k++) {
        const bx = ix - s * 0.72 + k * s * 0.22 + (hash2(k, 1, 13) - 0.5) * 3;
        const r = 1.6 + hash2(k, 2, 13) * 1.6;
        const by = iy - 0.5;
        f.disc(bx, by - r * 0.4, r, (dx, dy) => {
          if (by - r * 0.4 + dy > iy) return null;
          const l = dx - dy * 1.2;
          return l > r * 0.6 ? P.isle3 : l < -r * 0.4 ? P.isle1 : P.isle2;
        });
      }
      drawPalm(
        f,
        ix - s * 0.55,
        iy,
        Math.round(s * 1.35),
        -0.35,
        0,
        3,
        style,
        9
      );
      drawPalm(f, ix + s * 0.2, iy, Math.round(s * 1.6), 0.25, 0, 5, style, 9);
      drawPalm(f, ix - s * 0.1, iy, Math.round(s * 1.1), 0.1, 0, 8, style, 8);
    });

    for (let i = 0; i < w * h; i++)
      if (isle.pixels[i]! >>> 24 && zbuf[i]! > isleZ) zbuf[i] = isleZ;

    // ---------- moving life ----------

    const fxWater = new Fx(); // under the surface
    const fxSurface = new Fx(); // splashes, ripples, dolphins
    const fxTop = new Fx(); // in front of everything

    /** Sets a pixel unless something in the resort is nearer than z. */
    const zset = (f: Frame, x: number, y: number, c: RGB, z: number) => {
      x = Math.round(x);
      y = Math.round(y);
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      if (zbuf[y * w + x]! < z) return;
      f.set(x, y, c);
    };

    /** Light or shade under the surface: never on the beach. */
    const uw = (f: Frame, x: number, y: number, c: RGB, a: number) => {
      if (y < shoreY(Math.round(x)) - 1) f.blend(x, y, c, a);
    };

    function ray(
      f: Frame,
      x: number,
      y: number,
      dir: number,
      t: number,
      size = 1,
      col = P.ray
    ) {
      const flap = Math.sin(t / 260);
      const a = size > 1 ? 0.55 : 0.4;
      const span = Math.round(2 * size);
      for (let dy = -span; dy <= span; dy++) {
        const k = 1 - Math.abs(dy) / (span + 1);
        const len = Math.round(
          4 * size * k + (Math.abs(dy) === span ? flap : 0)
        );
        for (let dx = -len; dx <= Math.round(len * 0.7); dx++) {
          const px = x + dx * dir;
          uw(f, px - dir * 1, y + dy + 3, col, 0.12); // its shadow on the sand
          uw(f, px, y + dy, col, a);
        }
      }
      for (let k = 1; k < 7 * size; k++)
        uw(
          f,
          x - dir * (4 * size + k),
          y + Math.round(Math.sin(t / 300 + k * 0.5) * 0.4),
          col,
          a * 0.8
        );
    }

    function shark(f: Frame, x: number, y: number, dir: number, t: number) {
      for (let k = -6; k <= 6; k++) {
        const wig = Math.round(
          Math.sin(k * 0.45 - t / 140) * (k < 0 ? 0.8 : 0.2)
        );
        const px = x + k * dir;
        uw(f, px, y + wig, P.shark, 0.55);
        if (k > -3 && k < 4) uw(f, px, y + wig - 1, P.shark, 0.4);
        uw(f, px - dir, y + wig + 3, P.shark, 0.1);
      }
      // black-tipped fins
      uw(f, x + dir, y - 2, P.sharkTip, 0.6);
      uw(f, x + dir, y + 1, P.sharkTip, 0.6);
      uw(f, x, y - 1, P.sharkTip, 0.5);
      const tw = Math.round(Math.sin(-t / 140 - 2.7));
      uw(f, x - 7 * dir, y - 1 + tw, P.sharkTip, 0.6);
      uw(f, x - 7 * dir, y + 1 + tw, P.sharkTip, 0.6);
    }

    function manta(
      f: Frame,
      x: number,
      y: number,
      dir: number,
      t: number,
      a: number
    ) {
      const flap = Math.sin(t / 380);
      for (let dy = -7; dy <= 7; dy++) {
        const ad = Math.abs(dy);
        const tip = ad > 4 ? Math.round(flap * (ad - 4) * 0.6) : 0;
        const front = 3 - Math.round(ad * 0.75) + tip;
        const back = -2 - Math.round(ad * 0.15) + tip;
        for (let dx = back; dx <= front; dx++) {
          uw(f, x + dx * dir, y + Math.round(dy * 0.6), P.manta, 0.55 * a);
          uw(
            f,
            x + dx * dir - dir,
            y + Math.round(dy * 0.6) + 4,
            P.manta,
            0.12 * a
          );
        }
      }
      uw(f, x + 4 * dir, y - 1, P.manta, 0.5 * a);
      uw(f, x + 4 * dir, y + 1, P.manta, 0.5 * a);
      for (let k = 3; k < 9; k++) uw(f, x - k * dir, y, P.manta, 0.4 * a);
    }

    const creatures = Array.from(
      { length: Math.max(3, Math.round(w / 90)) },
      (_, i) => ({
        kind: i % 3 === 1 ? 'shark' : 'ray',
        y: 116 + hash2(i, 1, 19) * 28,
        speed:
          (0.004 + hash2(i, 2, 19) * 0.004) * (hash2(i, 3, 19) > 0.5 ? 1 : -1),
        off: hash2(i, 4, 19) * (w + 60),
        seed: i,
      })
    );

    function drawCreatures(f: Frame, t: number) {
      for (const c of creatures) {
        const sp = c.kind === 'shark' ? c.speed * 2.2 : c.speed;
        // keep clear of the beach
        const x0 =
          c.y > 114
            ? beachW *
                Math.sqrt(Math.max(0, 1 - ((h - c.y) / (h - 114)) ** 2)) +
              6
            : -30;
        const sp2 = w + 30 - x0;
        const x = ((((c.off + t * sp) % sp2) + sp2) % sp2) + x0;
        const y = c.y + Math.sin(t / 2300 + c.seed) * 3;
        if (c.kind === 'shark') shark(f, x, y, Math.sign(sp), t + c.seed * 400);
        else ray(f, x, y, Math.sign(sp), t + c.seed * 300, 1.5);
      }
    }

    function drawWater(f: Frame, t: number) {
      // breakers on the reef
      for (let x = 0; x < w; x++) {
        const n = noise1(x / 7 + t / 1900, 3);
        const m = noise1(x / 5 - t / 2600, 8);
        if (n > 0.42) f.set(x, REEF, P.surf);
        else if (n > 0.32) f.set(x, REEF, P.foam);
        if (m > 0.6) f.set(x, REEF + 1, P.foam);
        if (n > 0.62) f.set(x, REEF - 1, P.foam);
      }
      // sun glints, more of them up close
      const count = Math.round(w / 5);
      for (let i = 0; i < count; i++) {
        const y =
          REEF + 2 + Math.floor(hash2(i, 1, 23) ** 0.8 * (h - REEF - 3));
        const x = Math.floor(hash2(i, 0, 23) * w + Math.sin(t / 1800 + i) * 2);
        const life = Math.sin(t / 520 + hash2(i, 2, 23) * 40);
        if (life < 0.75 || y >= shoreY(x) - 1) continue;
        const len = y > 100 ? 2 : 1;
        f.hline(x, x + len - 1, y, P.glint);
        if (life > 0.95 && y > 90) f.set(x, y - 1, P.glint);
      }
      // swell lines drifting in
      for (let k = 0; k < 6; k++) {
        const y = Math.round(60 + ((t / 90 + k * 15) % 90));
        for (let x = 0; x < w; x++) {
          if (y >= shoreY(x) - 1) continue;
          const v = noise1(x / 9 + k * 7, 13 + k);
          if (v > 0.66) f.blend(x, y, P.caustic, 0.3 + (y - 60) / 300);
        }
      }
      // the swash on the beach
      const sw = Math.sin(t / 1300) * 1.5;
      for (let x = 0; x < beachW + 2; x++) {
        const sy = shoreY(x);
        if (!Number.isFinite(sy)) continue;
        const y = Math.round(sy - 1 + sw + Math.sin(x / 6 + t / 900) * 0.6);
        f.set(x, y, P.surf);
        if (hash2(x >> 1, Math.floor(t / 600), 4) > 0.5)
          f.set(x, y - 1, P.halo0);
      }
    }

    // a motor dhoni pottering along inside the reef
    const dhoniAt = (t: number) => {
      const PERIOD = 70_000;
      const p = (t % PERIOD) / PERIOD;
      return {
        x: Math.round(-30 + p * (w + 60)),
        y: REEF + 5 + Math.round(Math.sin(t / 900) * 0.4),
      };
    };
    function dhoni(f: Frame, t: number) {
      const { x, y } = dhoniAt(t);
      // wake
      for (let k = 2; k < 14; k++)
        if ((k + Math.floor(t / 200)) % 3)
          f.set(x - k, y + 1 + (k > 7 ? 1 : 0), P.foam);
      f.hline(x, x + 14, y, P.hullW);
      f.hline(x + 1, x + 13, y + 1, P.hullBlue);
      f.hline(x + 2, x + 12, y + 2, P.hullWood);
      // the tall curved prow
      f.vline(x + 15, y - 4, y, P.hullWood);
      f.set(x + 16, y - 5, P.hullWood);
      f.set(x + 14, y - 1, P.hullWood);
      // canopy on posts
      f.hline(x + 2, x + 11, y - 4, P.canvas);
      f.hline(x + 3, x + 10, y - 5, P.canvas);
      for (const k of [3, 7, 11]) f.vline(x + k, y - 3, y - 1, P.hullWood);
      f.set(x + 5, y - 2, P.skinDark);
      f.set(x + 9, y - 2, P.suitB);
    }

    // a paddleboarder in the shallows and two snorkellers out by a coral head
    function paddlers(f: Frame, t: number) {
      const span = Math.max(40, beachW * 1.4);
      const p = (Math.sin(t / 14000) + 1) / 2;
      const x = Math.round(vp - clamp(w * 0.12, 26, 70) - p * span * 0.5);
      const y = 98;
      const dir = Math.cos(t / 14000) > 0 ? -1 : 1;
      f.hline(x - 4, x + 4, y, P.board);
      f.hline(x - 3, x + 3, y + 1, P.lag2);
      f.vline(x, y - 6, y - 1, P.skin);
      f.set(x, y - 4, P.suitA);
      f.set(x, y - 7, P.skinDark);
      const stroke = Math.sin(t / 420);
      const px = x + dir * (stroke > 0 ? 2 : 1);
      f.line(px, y - 7, px + dir, y + 1, P.wd1);
      if (stroke > 0.6) f.set(px + dir * 2, y + 1, P.foam);
    }

    // the resort's speedboat, tied up alongside the jetty
    const boatZ = 3.3;
    const [boatX, boatY] = cam.proj(JX1 + 0.12, 0, boatZ);
    // the jetty's rail post just in front of it, where its bow line is made fast
    const [cleatX, cleatY] = cam.proj(
      JX1 - 0.01,
      0.33,
      Math.floor(boatZ / 0.75) * 0.75
    );
    function speedboat(f: Frame, t: number) {
      const x = Math.round(boatX);
      if (x > w) return;
      const y = Math.round(boatY + Math.sin(t / 1100) * 0.6);
      const L = 34;
      // its shadow and a dark line where it sits in the water
      for (let k = 2; k < L; k++) {
        f.blend(x + k - 2, y + 1, P.deep, 0.35);
        f.blend(x + k - 3, y + 2, P.deep, 0.2);
      }
      for (let k = 0; k < L; k++) {
        const bow = k > L - 9 ? k - (L - 9) : 0;
        f.vline(
          x + k,
          y - 6 + Math.round(bow * 0.35),
          y - 5 + Math.round(bow * 0.35),
          P.hullW
        );
        f.set(x + k, y - 4 + Math.round(bow * 0.5), P.hullBlue);
        if (y - 3 + Math.round(bow * 0.6) <= y)
          f.vline(x + k, y - 3 + Math.round(bow * 0.6), y, P.hullSh);
      }
      // deck, seats, windscreen and a white canvas canopy
      f.hline(x + 1, x + L - 8, y - 7, P.hullSh);
      f.hline(x + 3, x + 7, y - 8, P.cushion);
      f.hline(x + 12, x + 16, y - 8, P.cushion);
      f.vline(x + 20, y - 10, y - 7, P.glassHi);
      f.vline(x + 21, y - 9, y - 7, P.glass);
      f.hline(x + 6, x + 19, y - 15, P.canvas);
      f.hline(x + 5, x + 20, y - 14, P.canvas);
      for (const k of [6, 19]) f.vline(x + k, y - 13, y - 8, P.hullSh);
      // two outboards on the stern
      f.rect(x - 2, y - 7, 2, 5, P.planeDark);
      f.set(x - 2, y - 8, P.planeDark);
      // mooring line from the bow back to a post on the jetty
      f.line(x + L - 4, y - 6, cleatX, cleatY + 1, P.rope);
    }

    // a catamaran sailing slowly across the lagoon
    const catZ = 11;
    function catamaran(f: Frame, t: number) {
      const PERIOD = 120_000;
      const p = ((t + 52_000) % PERIOD) / PERIOD;
      const x = Math.round(-36 + p * (w + 72));
      const y = Math.round(yAt(catZ) + Math.sin(t / 1300) * 0.4);
      const z = catZ;
      for (let k = 0; k < 20; k++) {
        if ((k + Math.floor(t / 250)) % 4)
          zset(f, x - 3 - k, y + (k > 9 ? 1 : 0), P.foam, z + 0.1);
      }
      for (let k = 0; k < 19; k++) {
        zset(f, x + k, y - 1, P.hullW, z);
        zset(f, x + k, y, k > 1 && k < 17 ? P.hullSh : P.hullW, z);
      }
      zset(f, x + 19, y - 2, P.hullW, z);
      zset(f, x + 19, y - 1, P.hullW, z);
      for (let k = 2; k < 16; k++) zset(f, x + k, y - 2, P.planeDark, z);
      // mast, mainsail and jib, lit from the right
      const mx = x + 8;
      for (let k = 2; k < 24; k++) zset(f, mx, y - k, P.planeSh, z);
      for (let r = 0; r < 19; r++) {
        const yy = y - 22 + r;
        const wd = Math.round(r * 0.42);
        for (let k = 1; k <= wd; k++)
          zset(
            f,
            mx - k,
            yy,
            k === wd ? P.planeSh : r > 13 && k < 3 ? P.canvas : P.planeW,
            z
          );
      }
      for (let r = 0; r < 15; r++) {
        const yy = y - 18 + r;
        const wd = Math.round(r * 0.62);
        for (let k = 1; k <= wd; k++)
          zset(f, mx + k, yy, k === wd ? P.planeSh : P.planeW, z);
      }
      // a band of colour across the main
      for (let k = 1; k <= 5; k++)
        zset(f, mx - k, y - 12 + Math.round(k * 0.1), P.suitA, z);
      zset(f, x + 4, y - 3, P.skinDark, z);
      zset(f, x + 12, y - 3, P.suitC, z);
    }

    // people strolling out along the jetty
    const walkers = [0, 1, 2].map((i) => ({
      phase: hash2(i, 1, 51),
      speed: 1 / (60000 + i * 17000),
      color: [P.suitB, P.cushion, P.suitA][i]!,
    }));
    function drawWalkers(f: Frame, t: number) {
      for (const wk of walkers) {
        const ph = (wk.phase + t * wk.speed) % 1;
        const u = ph < 0.5 ? ph * 2 : 2 - ph * 2;
        const Z = 2.6 + u * (ZT - 3.8);
        const X = (JX0 + JX1) / 2 + 0.04;
        const s = F / Z;
        const [x, y] = cam.proj(X, 0.24, Z);
        const tall = Math.max(2, Math.round(s * 0.17));
        const zz = Z - 0.05;
        for (let k = 1; k <= tall; k++)
          zset(
            f,
            x,
            y - k,
            k === tall ? P.skinDark : k > tall * 0.45 ? wk.color : P.skin,
            zz
          );
        if (s > 30) {
          const step = Math.floor(t / 260) % 2;
          zset(f, x + (step ? 1 : -1), y - 1, P.skin, zz);
          for (let k = 2; k <= tall - 2; k++)
            zset(f, x + 1, y - k, k > tall * 0.45 ? wk.color : P.skin, zz);
        }
      }
      // a grey heron on the rail, waiting for scraps
      const [hx, hy] = cam.proj(JX0 + 0.01, 0.33, Z0 + STEP * 1.5);
      const look = Math.sin(t / 3000) > 0 ? 1 : -1;
      const z = Z0 + STEP * 1.5;
      zset(f, hx, hy - 1, P.heron, z);
      zset(f, hx, hy - 2, P.heron, z);
      zset(f, hx + 1, hy - 2, P.heron, z);
      zset(f, hx, hy - 3, P.heron, z);
      zset(f, hx, hy - 4, P.heron, z);
      zset(f, hx + look, hy - 4, P.bird, z);
    }

    function drawBirds(f: Frame, t: number) {
      // frigatebirds hanging on the wind
      for (let i = 0; i < 3; i++) {
        const cx = w * (0.25 + i * 0.3) + Math.sin(t / 5000 + i * 2) * 30;
        const cy = 12 + i * 5 + Math.cos(t / 5000 + i * 2) * 4;
        const flap = Math.sin(t / 900 + i) > 0.6 ? 1 : 0;
        f.set(cx, cy, P.bird);
        f.set(cx - 1, cy - 1 + flap, P.bird);
        f.set(cx + 1, cy - 1 + flap, P.bird);
        f.set(cx - 2, cy - 1 + flap, P.bird);
        f.set(cx + 2, cy - 1 + flap, P.bird);
        f.set(cx - 3, cy + flap, P.bird);
        f.set(cx + 3, cy + flap, P.bird);
      }
    }

    // ---- the seaplane ----
    const PLANE_W = 35;
    let planes: number[] = []; // when each one was called in
    const landZ = 6.2;
    const landY = Math.round(yAt(landZ));
    const touchX = Math.round(vp - clamp(w * 0.07, 6, 46));
    const APPROACH = 3800;
    const RUN = 2600;
    const TAXI_V = 0.016; // px per ms
    function planeState(t: number, at: number) {
      const a = t - at;
      if (a < 0) return null;
      const startX = w + 40;
      const vTouch = (startX - touchX) / APPROACH;
      if (a < APPROACH) {
        const p = a / APPROACH;
        const x = startX - (startX - touchX) * p;
        // a long glide that flares out just before the water, nose up, so it
        // settles on instead of dropping in
        const y = 8 + (landY - 8) * p * p * (3 - 2 * p);
        return {
          x,
          y,
          speed: vTouch,
          onWater: false,
          a,
          pitch: p > 0.86 ? 1 : 0,
        };
      }
      const r = a - APPROACH;
      if (r < RUN) {
        const p = r / RUN;
        const dist =
          vTouch * RUN * (p - (p * p) / 2) + (TAXI_V * RUN * (p * p)) / 2;
        return {
          x: touchX - dist,
          y: landY,
          speed: vTouch * (1 - p) + TAXI_V * p,
          onWater: true,
          a,
          pitch: 0,
        };
      }
      const runDist = (vTouch * RUN) / 2 + (TAXI_V * RUN) / 2;
      const x = touchX - runDist - (r - RUN) * TAXI_V;
      // gone once it's off screen and its wake has faded
      if (x < -PLANE_W - 30 && r >= 9000) return null;
      return { x, y: landY, speed: TAXI_V, onWater: true, a, pitch: 0 };
    }

    /** A Twin Otter on floats, nose at (x, y) on the cabin's centre line, facing left. */
    function seaplane(
      f: Frame,
      x: number,
      y: number,
      t: number,
      z: number,
      pitch: number
    ) {
      // pitched nose up, as a gentle stair-step through the whole plane
      const S = (px: number, py: number, c: RGB) =>
        zset(f, x + px, y + py + Math.round((pitch * (px - 16)) / 18), c, z);
      // tail fin with the stabiliser across it
      for (let k = 0; k < 8; k++) {
        const x0 = 26 + Math.round(k * 0.5);
        for (let px = x0; px <= 31; px++)
          S(
            px,
            -2 - k,
            k > 4 ? P.planeStripe2 : k > 2 ? P.planeStripe : P.planeStripe
          );
      }
      for (let px = 27; px <= 34; px++) S(px, -4, P.planeSh);
      // fuselage, tapering up into the tail
      for (let px = 0; px <= 31; px++) {
        const bottom = px < 21 ? 2 : 2 - Math.round((px - 21) * 0.4);
        const top = px === 0 ? -1 : -2;
        for (let py = top; py <= bottom; py++) {
          let c = py === -2 ? P.planeW : py === bottom ? P.planeSh : P.planeW;
          if (py === 1 && px > 1) c = P.planeStripe;
          if (py === 0 && px > 2 && px < 26 && bottom > 1) c = P.planeStripe2;
          S(px, py, c);
        }
      }
      S(0, 1, P.planeSh);
      // cockpit and cabin windows
      S(2, -1, P.planeWin);
      S(3, -1, P.planeWin);
      S(4, -1, P.planeWin);
      for (let px = 8; px <= 20; px += 2) S(px, -1, P.planeWin);
      S(22, -1, P.planeWin);
      // high wing with the engine slung under its leading edge
      for (let px = 7; px <= 15; px++) {
        S(px, -4, P.planeW);
        S(px, -3, P.planeSh);
      }
      for (let px = 4; px <= 9; px++)
        S(px, -2, px === 4 ? P.planeDark : P.planeSh);
      S(5, -3, P.planeW);
      S(6, -3, P.planeW);
      const blur = Math.floor(t / 45) % 2;
      for (let py = -6 + blur; py <= 1; py += 1 + blur) S(3, py, P.prop);
      // wing strut, float struts and the floats
      for (let k = 0; k <= 4; k++)
        S(13 - Math.round(k * 0.6), -2 + k + 1, P.planeDark);
      for (const sx of [5, 9, 17, 20]) {
        S(sx, 3, P.planeDark);
        S(sx + (sx < 12 ? 1 : -1), 4, P.planeDark);
      }
      for (let px = 1; px <= 25; px++) {
        S(px, 5, P.planeW);
        if (px > 1 && px < 18) S(px, 6, P.planeSh);
        else if (px >= 18 && px < 24) S(px, 6 - (px > 21 ? 1 : 0), P.planeSh);
      }
      S(0, 4, P.planeW);
    }

    function drawPlanes(f: Frame, t: number) {
      planes = planes.filter((at) => planeState(t, at) !== null || t < at);
      for (const at of planes) drawPlane(f, t, at);
    }

    function drawPlane(f: Frame, t: number, at: number) {
      const st = planeState(t, at);
      if (!st) return;
      const x = Math.round(st.x);
      const y = Math.round(st.y) - 6; // floats sit on the water
      const z = landZ;
      if (st.onWater) {
        const run = st.a - APPROACH;
        const sp = st.speed / ((w + 40 - touchX) / APPROACH);
        // the white wake back to where it touched down, fading out
        const tail = Math.min(w, touchX - st.x + 18);
        for (let k = 0; k < tail; k++) {
          const fade = 1 - run / 9000 - (k / (tail + 1)) * 0.7;
          if (fade <= 0) continue;
          const spread = Math.round(k / 12);
          if (hash2(k, Math.floor(t / 120), 5) < fade) {
            zset(f, x + 20 + k, landY + 1 + spread, P.surf, z);
            zset(f, x + 20 + k, landY - spread, P.foam, z);
          }
        }
        // bow wave at the floats
        zset(f, x - 1, landY, P.surf, z);
        zset(f, x, landY + 1, P.foam, z);
        // spray thrown up behind the floats while it's still fast
        if (sp > 0.2) {
          for (let i = 0; i < 22; i++) {
            const life = (t / 280 + hash2(i, 1, 9)) % 1;
            const sx = x + 12 + hash2(i, 3, 9) * 12 + life * 18 * sp;
            const sy =
              landY - Math.sin(life * Math.PI) * (3 + 7 * sp * hash2(i, 2, 9));
            zset(f, sx, sy, life > 0.6 ? P.foam : P.surf, z);
          }
        }
      } else if (st.y < landY - 1) {
        // its shadow racing over the lagoon
        const off = Math.round((landY - st.y) * 0.5);
        for (let k = 0; k < 30; k++)
          f.blend(x + k + off, landY + 2, P.deep, 0.22);
      }
      seaplane(f, x, y, t, z, st.pitch);
    }

    // ---- dolphins ----
    function dolphins(
      t: number,
      x: number,
      dir = x < w / 2 ? 1 : -1,
      near = 0 // rows nearer us than usual
    ) {
      const seed = Math.round(t) % 97;
      const L = 30; // length of one leap
      const H = 8;
      fxSurface.add(t, 5600, (f, age) => {
        for (let i = 0; i < 3; i++) {
          for (let leap = 0; leap < 2; leap++) {
            const a = (age - i * 420 - leap * 2100) / 1150;
            if (a < -0.1 || a > 1.5) continue;
            const x0 = x + dir * (leap * (L + 8) + i * 5 - 22);
            const by =
              REEF + 5 + near + i * 2 + Math.round(hash2(i, 2, seed) * 2);
            const at = (u: number) =>
              [x0 + dir * u * L, by - Math.sin(u * Math.PI) * H] as const;
            // the body follows the arc behind the nose
            for (let k = 0; k < 9; k++) {
              const u = a - k * 0.028;
              if (u < 0 || u > 1) continue;
              const [px, py] = at(u);
              if (py > by - 0.5) continue;
              const tx = dir * L;
              const ty = -Math.cos(u * Math.PI) * Math.PI * H;
              const tl = Math.hypot(tx, ty);
              // the side towards the sky is dark, the belly pale
              const ux = (ty / tl) * dir;
              const uy = (-tx / tl) * dir;
              const up = uy < 0 ? 1 : -1;
              f.set(px, py, P.dolphin);
              if (k > 0 && k < 8)
                f.set(px + ux * up * -1, py + uy * up * -1, P.dolphinHi);
              if (k === 4) f.set(px - ux * up, py - uy * up, P.dolphin); // dorsal fin
              if (k === 8) {
                f.set(px + ux, py + uy, P.dolphin);
                f.set(px - ux, py - uy, P.dolphin);
              }
            }
            // splashes going out and coming back in
            for (const [u0, u1] of [
              [-0.1, 0.25],
              [0.85, 1.5],
            ] as const) {
              if (a < u0 || a > u1) continue;
              const sa = (a - u0) / (u1 - u0);
              const sx = at(u0 < 0 ? 0 : 1)[0];
              const r = Math.round(1 + sa * 4);
              const up2 = Math.round(Math.sin(sa * Math.PI) * 3);
              f.set(sx, by - up2, P.surf);
              f.set(sx - 1, by - Math.max(0, up2 - 1), P.surf);
              f.set(sx + 1, by - Math.max(0, up2 - 1), P.foam);
              f.hline(sx - r, sx - r + 1, by + 1, P.surf);
              f.hline(sx + r - 1, sx + r, by + 1, P.surf);
            }
          }
        }
      });
    }

    // ---- a guest diving off a villa deck ----
    function bigSplash(
      fx: Fx,
      t: number,
      x: number,
      y: number,
      size: number,
      seed: number
    ) {
      fx.add(t, 1100, (f, age) => {
        const a = age / 1000;
        if (age < 420) {
          const col = size * 1.6 * Math.sin((age / 420) * Math.PI);
          for (let k = 0; k < col; k++) {
            f.set(x, y - k, P.surf);
            if (k < col * 0.7) f.set(x - 1, y - k * 0.8, P.foam);
            if (k < col * 0.6) f.set(x + 1, y - k * 0.7, P.surf);
          }
        }
        for (let i = 0; i < 16; i++) {
          const vx = (hash2(i, 1, seed) - 0.5) * size * 10;
          const vy = -(size * 6 + hash2(i, 2, seed) * size * 7);
          const py = y + vy * a + 55 * a * a;
          if (py > y) continue;
          f.set(x + vx * a, py, i % 3 ? P.surf : P.foam);
        }
        const r = Math.round(1 + a * size * 2.2);
        if (a < 0.8) {
          f.hline(x - r, x - r + 2, y, P.surf);
          f.hline(x + r - 2, x + r, y, P.surf);
        }
      });
    }

    function dive(t: number, v: Villa) {
      const s = F / v.Z;
      const [sx, sy] = cam.proj(v.X - 0.46, 0.24, v.Z - 0.58);
      const [ex, ey] = cam.proj(v.X - 0.72, 0, v.Z - 1.3);
      const tall = Math.max(3, Math.round(s * 0.18));
      const wide = s > 30 ? 2 : 1;
      const z = v.Z - 0.7;
      const seed = Math.round(t) % 89;
      const suit = [P.suitA, P.suitB, P.suitC][seed % 3]!;
      const RUN_T = 520;
      const AIR_T = 640;
      bigSplash(
        fxSurface,
        t + RUN_T + AIR_T,
        ex,
        ey,
        Math.max(2.5, s * 0.12),
        seed
      );
      ripple(fxSurface, t + RUN_T + AIR_T + 80, ex, ey + 1, P.surf, {
        rings: 3,
        size: Math.max(6, s * 0.4),
        squash: 0.35,
      });
      // a figure as a line of pixels from the feet, tipped over by `ang`
      const body = (
        f: Frame,
        x: number,
        y: number,
        ang: number,
        len: number
      ) => {
        for (let k = 0; k < len; k++) {
          const px = x + Math.sin(ang) * k;
          const py = y - Math.cos(ang) * k;
          const c =
            k === len - 1
              ? P.skinDark
              : k > len * 0.3 && k < len * 0.65
                ? suit
                : P.skin;
          for (let q = 0; q < wide; q++) zset(f, px + q, py, c, z);
        }
      };
      fxTop.add(t, 6500, (f, age) => {
        if (age < RUN_T) {
          // stands at the edge, crouches, and goes
          const crouch = age > RUN_T * 0.6 ? 1 : 0;
          body(f, sx, sy - 1, 0.15, tall - crouch);
          if (age < RUN_T * 0.6) zset(f, sx + wide, sy - tall, P.skin, z);
          return;
        }
        const p = (age - RUN_T) / AIR_T;
        if (p < 1) {
          const x = sx + (ex - sx) * p;
          const y =
            sy - 1 + (ey - sy + 1) * p - Math.sin(p * Math.PI) * s * 0.22;
          body(f, x, y, 0.3 + p * 2.6, tall);
          return;
        }
        // the head pops up and swims back to the ladder
        const b = age - RUN_T - AIR_T;
        if (b > 900) {
          const q = Math.min(1, (b - 900) / 3600);
          const x = ex + (sx - ex) * q;
          const y = ey + (sy + s * 0.24 - ey) * q;
          zset(f, x, y, P.skinDark, z);
          if (wide > 1) zset(f, x + 1, y, P.skinDark, z);
          if (Math.floor(b / 260) % 2) zset(f, x + wide, y + 1, P.surf, z);
          zset(f, x - 1, y + 1, P.foam, z);
        }
      });
    }

    // ---- the palm on the beach ----
    let shookAt = -Infinity;
    const palmStyle = {
      f0: P.frond0,
      f1: P.frond1,
      f2: P.frond2,
      f3: P.frond3,
      b0: P.bark0,
      b1: P.bark1,
      b2: P.bark2,
    };
    let crown: readonly [number, number] = [
      palmX + palmLean * palmH * 0.5,
      palmBase - palmH,
    ];

    function coconut(t: number) {
      const [cx, cy] = crown;
      const x0 = cx + 1;
      const y0 = cy + 4;
      const landX = Math.round(x0 + 6);
      const sea = shoreY(landX) < 147;
      const groundY = Math.min(147, Math.round(shoreY(landX) + (sea ? -1 : 3)));
      const G = 0.00012;
      const fall = Math.sqrt((groundY - y0) / G); // ms to fall
      if (sea) {
        ripple(fxSurface, t + fall, landX, groundY + 1, P.surf, {
          rings: 2,
          size: 8,
          squash: 0.4,
        });
        bigSplash(fxSurface, t + fall, landX, groundY, 2.5, 7);
      }
      fxTop.add(t, fall + 2400, (f, age) => {
        if (age < fall) {
          const x = x0 + (landX - x0) * (age / fall);
          const y = y0 + G * age * age;
          f.disc(x, y, 1, P.nut);
          f.set(x - 1, y - 1, P.nutHi);
          return;
        }
        const b = age - fall;
        if (sea) {
          // it bobs up, drifts a little, and settles lower until it's gone
          const fx = landX + (b - 500) * 0.003;
          if (b > 500 && b < 1700) f.disc(fx, groundY + 1, 1, P.nut);
          else if (b >= 1700 && b < 2100)
            f.hline(fx - 1, fx + 1, groundY + 1, P.nut);
          else if (b >= 2100) f.blend(fx, groundY + 1, P.nut, 0.6);
          return;
        }
        // a little bounce on the sand, then it sits there
        const hop = b < 400 ? Math.sin((b / 400) * Math.PI) * 3 : 0;
        const x = landX + Math.min(4, b / 100);
        f.disc(x, groundY - hop, 1, P.nut);
        f.set(x - 1, groundY - hop - 1, P.nutHi);
      });
    }

    let creatureCount = 0;
    const swimAt = [-Infinity, -Infinity]; // when the shark and the manta set off
    const divedAt = new Map<Villa, number>();
    const DIVE_FOR = 6500;
    let podAt = -Infinity;
    const POD_FOR = 5600;
    const villaAt = (x: number, y: number) => {
      // nearest first
      let best: Villa | null = null;
      for (const v of villas)
        if (
          x >= v.x0 &&
          x <= v.x1 &&
          y >= v.y0 &&
          y <= v.y1 &&
          (!best || v.Z < best.Z)
        )
          best = v;
      return best;
    };
    const onPalm = (x: number, y: number) => {
      const [cx, cy] = crown;
      if (Math.hypot(x - cx, (y - cy) * 1.4) < 22) return true;
      const v = (palmBase - y) / palmH;
      if (v < 0 || v > 1) return false;
      return Math.abs(x - (palmX + palmLean * palmH * 0.5 * v * v)) < 4;
    };

    // the coconuts under the palm's crown: click them and one drops (the
    // rest of the palm only shakes)
    let nutAt = -Infinity;
    const NUT_FOR = 3400; // the last one down and gone before the next
    const NUT_R = 7;
    const nutSpot = () => [crown[0] + 0.5, crown[1] + 3] as const;
    const onNuts = (x: number, y: number) => {
      const [nx, ny] = nutSpot();
      return Math.hypot(x - nx, y - ny) <= NUT_R;
    };

    // ---------- easter egg: the young palm and the close-up ----------

    // the young palm, its plaque at its foot, on the beach between the big
    // palm and the parasol
    const sapX = Math.round(Math.max(palmX + 20, beachW * 0.4));
    const sapBase = clamp(Math.round(shoreY(sapX) + 19), 132, 144);
    const SAP_R = 8;
    const sapSpot = [sapX + 2, sapBase - 5] as const;
    const onSapling = (x: number, y: number) =>
      Math.hypot(x - sapSpot[0], y - sapSpot[1]) <= SAP_R;
    let cerAt = -Infinity;
    const cerPlaying = (t: number) =>
      t - cerAt >= 0 && t - cerAt < CEREMONY.end;
    // the close-up's built the first time it's needed
    let ceremony: CeremonyView | null = null;
    const closeUp = () => (ceremony ??= ceremonyView(w, h));
    let cer: Frame | null = null;
    const R_MAX = heartMax(w, h, sapSpot[0], sapSpot[1]);

    function drawSapling(f: Frame, t: number) {
      // a ring of shells round where it went in
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2 + 0.4;
        f.set(
          Math.round(sapX + Math.cos(a) * 4),
          Math.round(sapBase + 1 + Math.sin(a) * 1.3),
          k % 2 ? P.cushion : P.sand2
        );
      }
      f.hline(sapX - 2, sapX + 2, sapBase + 1, P.sand3);
      sapling(f, sapX, sapBase, 1, Math.sin(t / 1500 + 1) * 0.08);
      plaque(f, sapX + 3, sapBase + 1, false);
      // the plaque catching the sun now and then: huh, what's that?
      if (Math.sin(t / 1300) > 0.94) f.set(sapX + 4, sapBase - 4, P.glint);
    }

    // ---------- easter egg: the snorkellers and the sharks ----------

    // two snorkels bobbing in the lagoon, between the beach and the jetty
    const snX = Math.round(vp - clamp(w * 0.06, 8, 40));
    const snY = 106;
    const SN_R = 9;
    const snSpot = [snX - 5, snY] as const;
    const onSnorkel = (x: number, y: number) =>
      Math.hypot(x - snSpot[0], y - snSpot[1]) <= SN_R;
    const SHARK_FOR = 7000;
    let sharkAt = -Infinity;
    const sharkPlaying = (t: number) =>
      t - sharkAt >= 0 && t - sharkAt < SHARK_FOR;
    /** How far the clear water has spread round them, 0..1. */
    const clearness = (t: number) => {
      const a = t - sharkAt;
      if (a < 0 || a >= SHARK_FOR) return 0;
      const p = Math.min(1, a / 1000);
      return Math.min(1 - (1 - p) ** 3, 1 - smooth(unlerp(a, 5500, SHARK_FOR)));
    };
    // the clear patch: an ellipse on the water round them
    const CX = snX;
    const CY = snY + 5;
    const CRX = clamp(w * 0.32, 68, 170);
    const CRY = clamp(CRX * 0.27, 22, 30);
    // coral on the bottom, seen once the water's clear
    const corals = Array.from({ length: Math.round(CRX / 12) }, (_, i) => {
      const a = hash2(i, 1, 87) * Math.PI * 2;
      const d = 0.45 + hash2(i, 2, 87) * 0.42;
      return {
        x: Math.round(CX + Math.cos(a) * d * CRX),
        y: Math.round(CY + Math.sin(a) * d * CRY),
        c: [P.coral0, P.coral1, P.coral2][i % 3]!,
        seed: i,
      };
    });

    function drawClear(f: Frame, t: number, c: number) {
      const r = c;
      const x0 = Math.max(0, Math.floor(CX - CRX * r));
      const x1 = Math.min(w - 1, Math.ceil(CX + CRX * r));
      const y0 = Math.max(REEF + 3, Math.floor(CY - CRY * r));
      const y1 = Math.min(h - 1, Math.ceil(CY + CRY * r));
      const ramp = [P.clear3, P.clear2, P.clear1, P.clear0];
      for (let y = y0; y <= y1; y++) {
        const dy = (y - CY) / CRY;
        const far = clamp((CY + CRY - y) / (CRY * 2), 0, 1);
        const yy = y * 2.4;
        const wy = Math.sin(yy * 0.15 + t / 900) * 1.4;
        for (let x = x0; x <= x1; x++) {
          const dx = (x - CX) / CRX;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > r) continue;
          if (y >= shoreY(x) - 1) continue;
          // a soft dithered edge
          if (d > r - 0.1 && (d - (r - 0.1)) * 10 > bayer(x, y)) continue;
          // pale sand in the middle, turquoise towards the edge and further out
          const v = clamp(d * 0.75 + far * 0.45, 0, 0.999) * 3;
          const vi = Math.floor(v);
          let k = lerpRGB(ramp[vi]!, ramp[vi + 1]!, v - vi);
          // light rippling over the bottom: a wobbly net of bright lines
          const n =
            Math.sin(x * 0.2 + wy + t / 1500) +
            Math.sin(
              yy * 0.19 + Math.sin(x * 0.16 - t / 1100) * 1.4 - t / 1700
            );
          const line = Math.abs(n);
          if (line < 0.16) k = lerpRGB(k, P.glint, 0.75);
          else if (line < 0.4) k = lerpRGB(k, P.glint, 0.25);
          f.set(x, y, k);
          if (shadowMask[y * w + x]) f.blend(x, y, P.shade, 0.35);
          // the edge of the clearing, a bright ring running outwards
          if (c < 0.999 && d > r - 0.07) f.blend(x, y, P.glint, 0.75);
        }
      }
      // little coral heads: branches and a round brain coral or two
      for (const co of corals) {
        const d = Math.hypot((co.x - CX) / CRX, (co.y - CY) / CRY);
        if (d > r - 0.08 || co.y >= shoreY(co.x) - 2) continue;
        const dark = lerpRGB(co.c, P.deep, 0.4);
        const lit = lerpRGB(co.c, P.glint, 0.35);
        f.blend(co.x - 1, co.y + 1, P.sandShade, 0.35);
        f.blend(co.x + 2, co.y + 1, P.sandShade, 0.35);
        if (co.seed % 2) {
          f.hline(co.x - 1, co.x + 1, co.y, dark);
          f.set(co.x - 1, co.y - 1, co.c);
          f.set(co.x + 1, co.y - 1, co.c);
          f.set(co.x, co.y - 2, lit);
          f.set(co.x - 2, co.y - 2, lit);
          f.set(co.x + 2, co.y - 2, co.c);
        } else {
          f.hline(co.x - 1, co.x + 1, co.y, dark);
          f.hline(co.x - 1, co.x + 1, co.y - 1, co.c);
          f.set(co.x, co.y - 2, lit);
          f.set(co.x - 1, co.y - 1, lit);
        }
      }
    }

    // the two snorkellers, face down with fins: their colours
    const SWIM = [
      // the man: light-brown hair, a black rash vest, blue shorts
      {
        hair: P.mHair,
        top: P.rash,
        topLit: P.rashLit,
        hip: P.trunks,
        fin: P.finM,
        tube: P.tubeM,
      },
      // the woman: a coral swimsuit, long straight black hair, yellow fins
      {
        hair: P.wHair,
        top: P.swim,
        topLit: P.swimHi,
        hip: P.swimSh,
        fin: P.finW,
        tube: P.tubeW,
      },
    ];

    /** One of them face down at the surface, head at (x, y), fins to the right. */
    function swimmer(
      f: Frame,
      x: number,
      y: number,
      who: 0 | 1,
      t: number,
      under: number
    ) {
      const S = SWIM[who]!;
      const kick = Math.sin(t / 240 + who * 1.7);
      // under the surface: seen faintly, or clearly once the water clears
      const u = (px: number, py: number, c: RGB) => {
        if (under >= 0.99) f.set(px, py, lerpRGB(c, P.clear1, 0.1));
        else f.blend(px, py, c, under);
      };
      if (under > 0.5) {
        // their shadow on the sand below
        const a = 0.45 * (under - 0.5) * 2;
        for (let k = 1; k < 21; k++) {
          f.blend(x + k + 2, y + 9, P.sandShade, a);
          if (k > 2 && k < 13) f.blend(x + k + 2, y + 10, P.sandShade, a);
        }
      }
      // back and shoulders, then hips, legs and fins
      for (let k = 3; k <= 10; k++) {
        u(x + k, y, k < 5 ? S.topLit : S.top);
        u(x + k, y + 1, S.top);
        u(x + k, y + 2, lerpRGB(S.top, P.deep, 0.25));
      }
      for (let k = 11; k <= 12; k++) {
        u(x + k, y, S.hip);
        u(x + k, y + 1, S.hip);
        u(x + k, y + 2, lerpRGB(S.hip, P.deep, 0.25));
      }
      for (let k = 13; k <= 16; k++) {
        u(x + k, y + 1, P.skin);
        u(x + k, y + 2, P.skinDark);
      }
      // an arm along each side
      for (let k = 3; k <= 8; k++)
        u(x + k, y + 3, k === 8 ? P.skin : P.skinDark);
      // fins, kicking up and down in turn
      const ka = kick > 0.25 ? 1 : kick < -0.25 ? -1 : 0;
      for (let k = 17; k <= 20; k++) {
        const flare = k > 18 ? 1 : 0;
        u(x + k, y + 1 - ka - flare, S.fin);
        u(x + k, y + 1 - ka, S.fin);
        u(x + k, y + 2 + ka, S.fin);
        u(x + k, y + 2 + ka + flare, S.fin);
      }
      // a fin breaking the surface now and then
      if (kick > 0.85) {
        f.set(x + 20, y - 1, P.surf);
        f.set(x + 21, y, P.foam);
      }
      // the head at the surface: hair, the mask's strap and lens, the snorkel
      f.hline(x, x + 2, y, S.hair);
      f.hline(x, x + 2, y + 1, S.hair);
      f.set(x + 1, y + 1, P.tip);
      f.set(x + 2, y + 1, P.tip);
      u(x, y + 2, who === 0 ? P.mBeard : S.hair);
      f.set(x - 1, y + 1, P.lens);
      f.set(x - 1, y + 2, P.lens);
      if (who === 1) {
        // her long hair fanning out over her shoulders
        f.hline(x + 3, x + 5, y - 1, S.hair);
        u(x + 6, y - 1, S.hair);
        u(x + 3, y, S.hair);
      }
      f.vline(x + 1, y - 4, y - 1, S.tube);
      f.set(x + 1, y - 5, lerpRGB(S.tube, P.glint, 0.4));
      // the water lapping round the head
      f.set(x - 2, y + 2, P.foam);
      if (Math.sin(t / 600 + who * 3) > 0) f.set(x + 3, y - 1, P.foam);
    }

    const bob = (t: number, k: number) =>
      Math.round(Math.sin(t / 850 + k * 2.1) * 0.6);
    function drawSwimmers(f: Frame, t: number, clear: number) {
      const under = 0.32 + 0.68 * clear;
      swimmer(f, snX - 12, snY - 3 + bob(t, 0), 0, t, under);
      swimmer(f, snX - 7, snY + 3 + bob(t, 1), 1, t, under);
    }

    /**
     * A small blacktip reef shark, side on, swimming along (vx, vy):
     * foreshortened when it's heading towards us or away.
     */
    function blacktip(
      f: Frame,
      x: number,
      y: number,
      vx: number,
      vy: number,
      t: number,
      a: number
    ) {
      const dir = vx >= 0 ? 1 : -1;
      const sp = Math.hypot(vx, vy) || 1;
      const L = Math.max(8, Math.round(17 * Math.max(0.5, Math.abs(vx) / sp)));
      const wig = (u: number) =>
        u > 0.55 ? Math.round(Math.sin(t / 140) * (u - 0.55) * 3.2) : 0;
      // (under the water only: never over the beach)
      const put = (k: number, dy: number, c: RGB) =>
        uw(
          f,
          Math.round(x + dir * (L / 2 - k)),
          Math.round(y + dy + wig(k / L)),
          c,
          a
        );
      // its shadow on the bottom
      if (a > 0.3)
        for (let k = 1; k < L; k++)
          uw(
            f,
            Math.round(x + dir * (L / 2 - k)) + 2,
            Math.round(y + 8),
            P.sandShade,
            0.4 * a
          );
      for (let k = 0; k <= L; k++) {
        const u = k / L;
        if (u <= 0.9) put(k, 0, P.btMid);
        if (u > 0.06 && u < 0.8) put(k, -1, P.btTop);
        if (u > 0.05 && u < 0.7) put(k, 1, P.btMid);
        if (u > 0.15 && u < 0.55) put(k, 2, P.btBelly);
      }
      put(2, -1, P.tip); // an eye
      // the black-tipped fins: dorsal, pectoral and tail
      const kd = Math.round(L * 0.34);
      put(kd, -2, P.btTop);
      put(kd + 1, -2, P.btTop);
      put(kd + 2, -2, P.btTop);
      put(kd + 1, -3, P.btTop);
      put(kd + 2, -3, P.tip);
      put(kd + 2, -4, P.tip);
      const kp = Math.round(L * 0.25);
      put(kp + 1, 3, P.btTop);
      put(kp + 2, 4, P.tip);
      put(L + 1, -1, P.btTop);
      put(L + 2, -2, P.btTop);
      put(L + 3, -3, P.tip);
      put(L + 1, 1, P.btTop);
      put(L + 2, 2, P.tip);
    }

    // the sharks circle them, coming in from outside and going again
    const SHARKS = 4;
    function sharkPos(t: number, i: number) {
      const a = t - sharkAt;
      const lap = 5200;
      const th = (i / SHARKS) * Math.PI * 2 + (a / lap) * Math.PI * 2 + 0.6;
      const k = 0.88 + hash2(i, 1, 31) * 0.24;
      const out =
        1 +
        1.3 * (1 - smooth(unlerp(a, 0, 1600))) +
        1.5 * smooth(unlerp(a, 5300, 6900));
      const rx = clamp(CRX * 0.55, 40, 64) * k * out;
      const ry = CRY * 0.62 * k * out;
      const x = CX - 1 + Math.cos(th) * rx;
      const y = CY - 1 + Math.sin(th) * ry + Math.sin(a / 500 + i) * 0.6;
      // heading: along the circle
      return {
        x,
        y,
        vx: -Math.sin(th) * rx,
        vy: Math.cos(th) * ry,
        front: Math.sin(th) > 0,
      };
    }
    function drawSharks(f: Frame, t: number, clear: number, front: boolean) {
      const a = t - sharkAt;
      const vis = Math.min(1, a / 500) * (1 - unlerp(a, 6200, 6950));
      for (let i = 0; i < SHARKS; i++) {
        const s = sharkPos(t, i);
        if (s.front !== front) continue;
        blacktip(
          f,
          s.x,
          s.y,
          s.vx,
          s.vy,
          t + i * 300,
          vis * (0.4 + 0.6 * clear)
        );
      }
    }

    // a school of little fish round them, scattering when the sharks come
    function drawFish(f: Frame, t: number, clear: number) {
      const a = t - sharkAt;
      const s = Math.max(0, (a - 700) / 1000);
      const ox = CX + 16;
      const oy = CY + 4;
      for (let i = 0; i < 44; i++) {
        const ang = hash2(i, 1, 91) * Math.PI * 2;
        const r0 = 1 + hash2(i, 2, 91) * 7;
        // milling round the middle of the school
        const mill = (a / 900 + hash2(i, 3, 91) * 6) * 0.35;
        const hx = ox + Math.cos(ang + mill) * r0 * 1.7;
        const hy = oy + Math.sin(ang + mill) * r0 * 0.6;
        // and then they're off, every which way
        const sp = 80 + hash2(i, 4, 91) * 80;
        const d = (sp * (1 - Math.exp(-2.4 * s))) / 2.4;
        const ex = Math.cos(ang) * 1.6;
        const ey = Math.sin(ang) * 0.55;
        const x = hx + ex * d;
        const y = hy + ey * d;
        const dir =
          s > 0 ? (ex >= 0 ? 1 : -1) : Math.sin(ang + mill) > 0 ? -1 : 1;
        const vis = clear * (1 - unlerp(s, 1.4, 2.4));
        if (vis <= 0.05 || y >= shoreY(Math.round(x)) - 1) continue;
        const c = i % 3 ? P.fish : P.fishSilver;
        f.blend(x, y, c, vis);
        f.blend(x - dir, y, lerpRGB(c, P.deep, 0.35), vis);
        if (s > 0 && s < 0.4) f.blend(x - dir * 2, y, P.glint, vis * 0.6);
      }
    }

    function drawMain(f: Frame, t: number) {
      f.copyFrom(base);
      f.over(cloudLayer, Math.round(t / 1400), 0, true);
      drawBirds(f, t);
      const clear = clearness(t);
      const sharks = sharkPlaying(t);
      if (clear > 0) drawClear(f, t, clear);
      drawWater(f, t);
      drawCreatures(f, t);
      fxWater.draw(f, t);
      if (sharks) {
        drawFish(f, t, clear);
        drawSharks(f, t, clear, false);
      }
      dhoni(f, t);
      f.over(isle);
      paddlers(f, t);
      drawSwimmers(f, t, clear);
      if (sharks) drawSharks(f, t, clear, true);
      fxSurface.draw(f, t);
      speedboat(f, t);
      f.over(resort);
      catamaran(f, t);
      drawWalkers(f, t);
      drawPlanes(f, t);
      drawSapling(f, t);
      // the palm leaning over everything, swaying, shaken when clicked
      const shake = t - shookAt;
      const sway =
        Math.sin(t / 1700) * 0.05 +
        (shake < 2500 ? Math.sin(shake / 110) * 0.14 * (1 - shake / 2500) : 0);
      crown = drawPalm(
        f,
        palmX,
        palmBase,
        palmH,
        palmLean,
        sway,
        2,
        palmStyle,
        13
      );
      fxTop.draw(f, t);
    }

    let now = 0;
    return {
      render(f, t) {
        now = t;
        const wa = t - cerAt;
        const open = heartOpen(wa);
        if (open >= 1) {
          // all the way into the close-up: nothing else to draw
          closeUp().draw(f, wa);
          return;
        }
        drawMain(f, t);
        if (open > 0) {
          cer ??= new Frame(w, h);
          closeUp().draw(cer, wa);
          heartWipe(f, cer, sapSpot[0], sapSpot[1], open * R_MAX);
        }
        // and back on the beach, the young palm twinkling
        if (wa >= CEREMONY.close0 && wa < CEREMONY.end + 900)
          saplingTwinkle(f, sapX + 1, sapBase - 7, wa - CEREMONY.close0);
      },
      poke(x, y, t) {
        if (cerPlaying(t)) {
          // in the close-up, taps throw petals
          if (heartOpen(t - cerAt) > 0.5) closeUp().puff(x, y, t - cerAt);
          return;
        }
        if (onSapling(x, y)) {
          cerAt = t;
          return;
        }
        if (onSnorkel(x, y) && !sharkPlaying(t)) {
          sharkAt = t;
          ripple(fxSurface, t, snSpot[0], snSpot[1] + 2, P.surf, {
            rings: 2,
            size: 16,
            squash: 0.35,
          });
          return;
        }
        if (onNuts(x, y)) {
          // one coconut at a time
          if (t - nutAt >= NUT_FOR) {
            nutAt = t;
            coconut(t);
          }
          if (t - shookAt >= 2500) shookAt = t;
          return;
        }
        if (onPalm(x, y)) {
          // (not while it's still shaking: restarting would snap the fronds)
          if (t - shookAt >= 2500) shookAt = t;
          return;
        }
        const v = villaAt(x, y);
        if (v) {
          // one guest at a time off each deck
          if (t - (divedAt.get(v) ?? -Infinity) >= DIVE_FOR) {
            divedAt.set(v, t);
            dive(t, v);
          }
          return;
        }
        if (y < H0) {
          // one at a time on the way in; another can follow once it's down
          if (
            planes.every((at) => planeState(t, at)?.onWater !== false) &&
            planes.length < 2
          )
            planes.push(t);
          return;
        }
        if (y >= shoreY(x)) return;
        if (y < REEF + 8) {
          // dolphins out by the reef (the dhoni's out there too), one pod at
          // a time
          if (t - podAt >= POD_FOR) {
            podAt = t;
            dolphins(t, x);
          }
          return;
        }
        ripple(fxSurface, t, x, y, P.surf, {
          rings: 3,
          size: 6 + (y - H0) / 8,
          squash: 0.35,
        });
        splash(fxSurface, t, x, y, P.surf, Math.round(t));
        const dir = x < w / 2 ? 1 : -1;
        // a shark and a manta can be out together, but not two of either
        let kind = creatureCount % 2;
        if (t - swimAt[kind]! < 6000) kind = 1 - kind;
        if (t - swimAt[kind]! < 6000) return;
        creatureCount = kind + 1;
        swimAt[kind] = t;
        fxWater.add(t, 6000, (f, age) => {
          const a = Math.min(1, age / 500, (6000 - age) / 800);
          const gx = x + dir * age * (kind ? 0.012 : 0.02);
          const gy = y + 3 + Math.sin(age / 900) * 2;
          if (kind) manta(f, gx, gy, dir, t + age, a);
          else shark(f, gx, gy, dir, t + age);
        });
      },
      hot(x, y) {
        return (
          cerPlaying(now) ||
          onSapling(x, y) ||
          y < shoreY(x) ||
          onPalm(x, y) ||
          villaAt(x, y) !== null
        );
      },
      eggs(t) {
        const out: EggSpot[] = [];
        // (none while the close-up is showing)
        if (cerPlaying(t)) return out;
        out.push({ id: 'palm', x: sapSpot[0], y: sapSpot[1], r: SAP_R });
        if (!sharkPlaying(t))
          out.push({ id: 'sharks', x: snSpot[0], y: snSpot[1], r: SN_R });
        return out;
      },
    };
  },
};
