// A small, dark hotel room for the light-switch egg: the light goes off and
// a man pats the walls for the switch, his hands sliding right over it again
// and again while the wall clock spins; then the light comes on, he turns
// round and falls back onto the bed.
//
// Drawn as a close-up into a frame of its own (`IW` x `ROOM_H`); the scene
// blits it into an inset over the canal houses. Everything is a function of
// `a`, the seconds since the light went off.

import { type Frame, hex, lerpRGB, type RGB } from '../frame';
import { hash2 } from '../noise';

export const ROOM_H = 62;
/** When the light comes back on (s after it went off). */
export const LIGHT_BACK = 6.0;

const two = (dark: string, lit: string): [RGB, RGB] => [hex(dark), hex(lit)];
// every colour in the dark and with the light on
const C = {
  ceiling: two('#0c0e22', '#b48c5c'),
  wall: two('#171b3c', '#e0b87c'),
  wallLow: two('#13173a', '#d4aa70'),
  skirting: two('#0c0e22', '#6a4a30'),
  floor: two('#0e1028', '#7a5234'),
  floorHi: two('#141836', '#946644'),
  door: two('#10132e', '#80502e'),
  doorPanel: two('#0d1028', '#6c4224'),
  doorFrame: two('#1c2248', '#f0e2c4'),
  knob: two('#2c3460', '#f0c860'),
  bedFrame: two('#0e1128', '#5a3a24'),
  bedFrameHi: two('#151a3a', '#7a5032'),
  sheet: two('#262c54', '#f4f0e6'),
  sheetShade: two('#1c2246', '#c8c2b4'),
  blanket: two('#1c2044', '#b8403a'),
  blanketHi: two('#232a52', '#dc5c48'),
  case: two('#121634', '#2e6a8e'),
  caseHi: two('#1a2044', '#5a96b8'),
  caseDark: two('#0c0f26', '#1e4a66'),
  plate: two('#2c3466', '#f8f4ea'),
  plateEdge: two('#1f2650', '#b0a894'),
  toggle: two('#2a3060', '#d0c8b4'),
  dial: two('#16302e', '#f4f0e4'),
  dialGlow: two('#2c6a5a', '#f4f0e4'),
  dialRim: two('#1a2a40', '#4a3020'),
  hand: two('#8ef0c0', '#1a1a20'),
  cord: two('#0a0c1c', '#3a2a20'),
  shade: two('#151a38', '#f4dca8'),
  shadeIn: two('#10142e', '#ffe9b8'),
  bulb: two('#1c2244', '#fffbe8'),
  frame: two('#1a2046', '#f0e2c4'),
  wood: two('#10132e', '#8a5a36'),
  woodHi: two('#171b3c', '#a8703f'),
  woodDark: two('#0b0d22', '#5e3a22'),
  tv: two('#090b1a', '#26262e'),
  tvScreen: two('#121732', '#3e4c5c'),
  pic: two('#141a3c', '#5aa0d0'),
  picLow: two('#1a1e40', '#e04a50'),
  picMid: two('#181c3e', '#f0c040'),
  picGreen: two('#121834', '#4a9a4a'),
  // the man: short light-brown hair, a short beard, a black hoodie, jeans,
  // white-soled sneakers
  hair: two('#1c1620', '#9a6a42'),
  hairHi: two('#2a2230', '#b8844e'),
  beard: two('#181220', '#7a5232'),
  eye: two('#0a0a14', '#2a1a14'),
  skin: two('#4a3a50', '#e09a74'),
  skinShade: two('#2c2238', '#b0705a'),
  hoodie: two('#06070e', '#24262f'),
  hoodieHi: two('#121630', '#4a4c5a'),
  hoodieShade: two('#040509', '#16171e'),
  jeans: two('#0e1634', '#2c4a86'),
  jeansHi: two('#16224a', '#5a7ac0'),
  shoes: two('#2c3250', '#e4e0e8'),
};
type Key = keyof typeof C;

// night through the room's little window, the blizzard blowing past it
const NIGHT = hex('#1e2a5c');
const NIGHT_LOW = hex('#2a3266');
const LAMP_OUT = hex('#c89850');
const FLAKE = hex('#b8c4ec');
const SHAFT = hex('#3a4c8c');
const GLINT = hex('#fffbe0');
const PAT = hex('#5a6aa8');

// The man from behind, facing the wall. 9 x 26, feet on the bottom row.
// H hair  h hair lit  s skin  B beard  q hood bunched at the neck  J hoodie
// j hoodie lit edge  K hoodie shade  L jeans  l jeans lit  e sneakers
// prettier-ignore
const BACK = [
  '...hhH...',
  '..hHHHH..',
  '..HHHHH..',
  '..HHHHH..',
  '..sHHHs..',
  '..BsssB..',
  '...sss...',
  '..qqqqq..',
  '.jJJJJJK.',
  '.jJJJJJK.',
  '.jJJJJJK.',
  '.jJJJJJK.',
  '.jJJJJJK.',
  '.jJJJJJK.',
  '.jJJJJJK.',
  '.KKKKKKK.',
  '..lLLLL..',
  '..lLLLL..',
  '..lL.LL..',
  '..lL.LL..',
  '..lL.LL..',
  '..lL.LL..',
  '..lL.LL..',
  '..lL.LL..',
  '..lL.LL..',
  '.eee.eee.',
];
// facing us, arms down, when the light's back on, blinking in it
// prettier-ignore
const FRONT = [
  '...hhH...',
  '..hHHHH..',
  '..HsssH..',
  '..sysys..',
  '..sssss..',
  '..BsSsB..',
  '...BBB...',
  '..qqqqq..',
  '.JJJJJJJ.',
  'JJJJJJJJJ',
  'JJ.JJJ.JJ',
  'JJ.JJJ.JJ',
  'JJ.JJJ.JJ',
  'JJ.JJJ.JJ',
  'ss.JJJ.ss',
  '..KKKKK..',
  '..LLlLL..',
  '..LLlLL..',
  '..LL.LL..',
  '..LL.LL..',
  '..LL.LL..',
  '..LL.LL..',
  '..LL.LL..',
  '..LL.LL..',
  '..LL.LL..',
  '.eee.eee.',
];
// on his back on the bed, head on the pillow (right), one arm
// flung up over it, the other hanging off the side, feet dangling off the end
// prettier-ignore
const FLAT = [
  '.......................ss..',
  '......................JJ...',
  '.....................JJ....',
  '..LLLLLLLLLKJJJJJJJJJBsss..',
  'eLLLLLLLLLLKJJJJJJJJJBsysH.',
  'e.lllllllllKKKKKKKKKKKHHHH.',
  'e.............J............',
  '..............J............',
  '..............s............',
];

const SPRITE_KEY: Record<string, Key> = {
  H: 'hair',
  h: 'hairHi',
  B: 'beard',
  y: 'eye',
  s: 'skin',
  S: 'skinShade',
  q: 'hoodieHi',
  J: 'hoodie',
  j: 'hoodieHi',
  K: 'hoodieShade',
  L: 'jeans',
  l: 'jeansHi',
  e: 'shoes',
};

const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
const smooth = (u: number) => {
  const v = clamp01(u);
  return v * v * (3 - 2 * v);
};

/** Piecewise-linear through [time, value] keys. */
function track(keys: readonly (readonly [number, number])[], s: number) {
  if (s <= keys[0]![0]) return keys[0]![1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i]!;
    if (s <= t1) {
      const [t0, v0] = keys[i - 1]!;
      return v0 + (v1 - v0) * smooth((s - t0) / (t1 - t0));
    }
  }
  return keys.at(-1)![1];
}

export type HotelRoom = {
  /** Draws the room `a` s after the light went off. */
  draw(f: Frame, a: number, t: number): void;
};

/** Lays out a room `IW` wide (the props stay put, the wall stretches). */
export function hotelRoom(IW: number): HotelRoom {
  const H = ROOM_H;
  const floorY = H - 12; // where the back wall meets the floor
  const feetY = H - 3; // where he stands, in front of the wall
  // the bed along the right wall, the switch by its foot, the door left
  const bedX0 = IW - 38;
  const bedX1 = IW - 4;
  const sx = bedX0 - 7; // the switch
  const sy = floorY - 20;
  const xa = Math.max(26, sx - 46); // as far left as he gets
  const doorX = xa - 20;
  const caseX = xa - 6;
  const winX = Math.round((xa + sx) / 2) - 6;
  const clockX = bedX0 + 16;
  const clockY = 14;
  const lampX = Math.round((xa + bedX1) / 2);
  // a picture of the tulip fields left of the door, and in a wider room a
  // desk with a little telly and a wardrobe, all crammed in
  const picX = doorX - 26;
  const deskX = picX - 34;
  const robeX = deskX - 22;

  // where he stands (his centre) while he searches: in the middle, over to
  // the door, then back and forth along the wall past the switch
  const mid = Math.round((xa + sx) / 2);
  const BODY: [number, number][] = [
    [0, mid],
    [0.9, mid],
    [1.8, xa],
    [2.4, xa],
    [3.4, sx + 8],
    [3.7, sx + 8],
    [4.5, sx - 11],
    [4.8, sx - 11],
    [5.3, sx - 1],
    [5.6, sx - 1],
    [5.95, sx - 5],
  ];
  const REACH = 6; // hands either side of his centre
  // the moments a hand slides across the switch (it glints each time)
  const passes: number[] = [];
  for (let i = 1; i < BODY.length; i++) {
    const [t0, x0] = BODY[i - 1]!;
    const [t1, x1] = BODY[i]!;
    for (const off of [-REACH, REACH]) {
      const target = sx - off;
      if ((x0 - target) * (x1 - target) < 0) {
        // invert the smoothstep: solve smooth(u) = v by bisection
        const v = (target - x0) / (x1 - x0);
        let lo = 0;
        let hi = 1;
        for (let k = 0; k < 20; k++) {
          const m = (lo + hi) / 2;
          if (smooth(m) < v) lo = m;
          else hi = m;
        }
        const tp = t0 + lo * (t1 - t0);
        if (tp < LIGHT_BACK - 0.5) passes.push(tp);
      }
    }
  }
  const nearPass = (s: number) =>
    passes.reduce((m, p) => Math.min(m, Math.abs(s - p)), Infinity);

  function draw(f: Frame, a: number, t: number) {
    const on = a >= LIGHT_BACK ? 1 : 0;
    const c = (k: Key) => C[k][on];
    const dark = !on;
    const s = a;

    // ---- the room ----
    f.rect(0, 0, IW, H, c('wall'));
    f.rect(0, 0, IW, 3, c('ceiling'));
    for (let y = floorY - 8; y < floorY; y++)
      for (let x = 0; x < IW; x++)
        if ((x + y) % 2 === 0 || y > floorY - 4) f.set(x, y, c('wallLow'));
    f.rect(0, floorY, IW, H - floorY, c('floor'));
    for (let y = floorY + 2; y < H; y += 3)
      for (let x = (y * 5) % 11; x < IW; x += 11)
        f.hline(x, x + 4, y, c('floorHi'));
    f.hline(0, IW - 1, floorY - 1, c('skirting'));
    f.hline(0, IW - 1, floorY, c('skirting'));

    // the tulip-field picture, where there's wall for it
    if (picX > 4) {
      f.rect(picX, 14, 16, 11, c('frame'));
      f.rect(picX + 1, 15, 14, 4, c('pic'));
      f.rect(picX + 1, 19, 14, 2, c('picLow'));
      f.rect(picX + 1, 21, 14, 1, c('picGreen'));
      f.rect(picX + 1, 22, 14, 2, c('picMid'));
    }

    if (robeX > 3) {
      f.rect(robeX, floorY - 36, 18, 40, c('wood'));
      f.hline(robeX, robeX + 17, floorY - 36, c('woodHi'));
      f.vline(robeX + 8, floorY - 34, floorY + 2, c('woodDark'));
      f.vline(robeX + 9, floorY - 34, floorY + 2, c('woodDark'));
      f.set(robeX + 6, floorY - 16, c('knob'));
      f.set(robeX + 11, floorY - 16, c('knob'));
      f.rect(robeX, floorY + 4, 18, 1, c('woodDark'));
    }
    if (deskX > 3) {
      // desk, its telly, and a chair pushed in
      f.rect(deskX, floorY - 11, 26, 2, c('woodHi'));
      f.rect(deskX + 1, floorY - 9, 3, 13, c('wood'));
      f.rect(deskX + 22, floorY - 9, 3, 13, c('wood'));
      f.rect(deskX + 16, floorY - 9, 6, 4, c('wood'));
      f.rect(deskX + 4, floorY - 21, 12, 9, c('tv'));
      f.rect(deskX + 5, floorY - 20, 10, 7, c('tvScreen'));
      f.hline(deskX + 8, deskX + 11, floorY - 12, c('tv'));
      f.rect(deskX + 7, floorY - 6, 9, 2, c('woodDark'));
      f.rect(deskX + 7, floorY - 14, 2, 8, c('woodDark'));
      f.vline(deskX + 7, floorY - 4, floorY + 6, c('woodDark'));
      f.vline(deskX + 15, floorY - 4, floorY + 6, c('woodDark'));
    }

    // the door
    f.rect(doorX - 1, floorY - 36, 14, 36, c('doorFrame'));
    f.rect(doorX, floorY - 35, 12, 35, c('door'));
    f.rect(doorX + 2, floorY - 33, 8, 13, c('doorPanel'));
    f.rect(doorX + 2, floorY - 17, 8, 14, c('doorPanel'));
    f.rect(doorX + 9, floorY - 19, 2, 2, c('knob'));

    // the window, the blizzard outside, a street lamp glowing below it
    const wy = 8;
    f.rect(winX - 1, wy - 1, 14, 18, c('doorFrame'));
    for (let y = wy; y < wy + 16; y++)
      f.hline(winX, winX + 11, y, y > wy + 10 ? NIGHT_LOW : NIGHT);
    for (let y = wy + 9; y < wy + 16; y++)
      for (let x = winX; x < winX + 12; x++) {
        const d = Math.hypot(x - winX - 3, (y - wy - 16) * 1.4);
        if (d < 6) f.blend(x, y, LAMP_OUT, d < 3 ? 0.55 : 0.28);
      }
    for (let i = 0; i < 9; i++) {
      const fx = winX + 11 - ((hash2(i, 1, 44) * 12 + t * 0.05) % 12);
      const fy = wy + ((hash2(i, 2, 44) * 16 + t * 0.012) % 16);
      f.set(fx, fy, FLAKE);
      if (i % 3 === 0) f.blend(fx + 1, fy, FLAKE, 0.5);
    }
    f.vline(winX + 5, wy, wy + 15, c('doorFrame'));
    f.hline(winX, winX + 11, wy + 7, c('doorFrame'));
    if (dark) {
      // the only light in the room: a pale shaft from the window
      for (let y = wy + 16; y < H; y++) {
        const k = (y - wy - 16) / (H - wy - 16);
        const x0 = winX + Math.round(k * 10);
        const x1 = winX + 11 + Math.round(k * 16);
        for (let x = x0; x <= x1; x++)
          if ((x + y) % 2 === 0 || y >= floorY)
            f.blend(x, y, SHAFT, y >= floorY ? 0.45 : 0.25);
      }
    }

    // a suitcase
    f.rect(caseX, floorY - 6, 9, 12, c('case'));
    f.hline(caseX, caseX + 8, floorY - 6, c('caseHi'));
    f.vline(caseX + 4, floorY - 5, floorY + 5, c('caseDark'));
    f.rect(caseX + 3, floorY - 9, 3, 1, c('caseDark'));
    f.set(caseX + 2, floorY - 8, c('caseDark'));
    f.set(caseX + 6, floorY - 8, c('caseDark'));

    // the bed, made, along the right wall
    f.rect(bedX1 - 3, floorY - 14, 3, 23, c('bedFrame'));
    f.hline(bedX1 - 3, bedX1 - 1, floorY - 14, c('bedFrameHi'));
    f.rect(bedX0, floorY + 1, bedX1 - bedX0 - 3, 5, c('bedFrame'));
    f.hline(bedX0, bedX1 - 4, floorY + 1, c('bedFrameHi'));
    f.vline(bedX0, floorY + 6, feetY + 1, c('bedFrame'));
    f.vline(bedX1 - 4, floorY + 6, feetY + 1, c('bedFrame'));
    f.rect(bedX0, floorY - 3, bedX1 - bedX0 - 3, 4, c('sheet'));
    f.rect(bedX0, floorY - 3, bedX1 - bedX0 - 13, 5, c('blanket'));
    f.hline(bedX0, bedX1 - 17, floorY - 3, c('blanketHi'));
    f.hline(bedX0, bedX1 - 4, floorY + 1, c('sheetShade'));
    f.rect(bedX1 - 11, floorY - 6, 7, 3, c('sheet'));
    f.hline(bedX1 - 11, bedX1 - 5, floorY - 4, c('sheetShade'));

    // the wall clock: glow-in-the-dark hands, spinning while it's dark
    f.disc(clockX, clockY, 5, c('dialRim'));
    f.disc(clockX, clockY, 4, c('dial'));
    if (dark)
      for (let k = 0; k < 12; k++) {
        const ang = (k / 12) * Math.PI * 2;
        f.set(
          clockX + Math.round(Math.cos(ang) * 3.4),
          clockY + Math.round(Math.sin(ang) * 3.4),
          c('dialGlow')
        );
      }
    // turns of the minute hand: slow, then faster and faster until the light
    // comes back on
    const spin =
      a < LIGHT_BACK
        ? 0.3 * a + 0.11 * Math.max(0, a - 0.8) ** 2.6
        : 0.3 * LIGHT_BACK + 0.11 * (LIGHT_BACK - 0.8) ** 2.6;
    const rate = a < LIGHT_BACK ? 0.3 + 0.29 * Math.max(0, a - 0.8) ** 1.6 : 0;
    const ghosts = rate > 2.5 ? 3 : rate > 1.2 ? 2 : 1;
    for (let g = ghosts - 1; g >= 0; g--) {
      const turn = spin - g * 0.05 * Math.min(1, rate / 3);
      const m = turn * Math.PI * 2 - Math.PI / 2;
      const hr = (turn / 12 + 0.3) * Math.PI * 2 - Math.PI / 2;
      const col = g ? lerpRGB(c('dial'), c('hand'), 0.45) : c('hand');
      f.line(
        clockX,
        clockY,
        clockX + Math.round(Math.cos(m) * 4),
        clockY + Math.round(Math.sin(m) * 4),
        col
      );
      if (!g)
        f.line(
          clockX,
          clockY,
          clockX + Math.round(Math.cos(hr) * 2.4),
          clockY + Math.round(Math.sin(hr) * 2.4),
          col
        );
    }

    // the ceiling lamp
    f.vline(lampX, 0, 5, c('cord'));
    f.hline(lampX - 2, lampX + 2, 6, c('shade'));
    f.hline(lampX - 3, lampX + 3, 7, c('shade'));
    f.hline(lampX - 2, lampX + 2, 8, c('shadeIn'));
    f.set(lampX, 9, c('bulb'));
    if (on) {
      // light pooling under it
      for (let y = 9; y < H; y++)
        for (let x = lampX - 30; x <= lampX + 30; x++) {
          const d = Math.hypot((x - lampX) * 0.8, y - 9) / 34;
          if (d < 1 && (x + y) % 2 === 0)
            f.blend(x, y, hex('#fff2c8'), (1 - d) * 0.35);
        }
    }

    // the switch, right there by the bed
    const flick = a >= LIGHT_BACK - 0.05;
    f.rect(sx - 1, sy - 2, 3, 5, c('plateEdge'));
    f.rect(sx - 1, sy - 2, 2, 4, c('plate'));
    f.set(sx, flick ? sy - 1 : sy + 1, c('toggle'));

    // ---- the man ----
    const bx = Math.round(track(BODY, s));
    const top = feetY - BACK.length + 1;
    const shoulderY = top + 8;
    const sprite = (
      rows: readonly string[],
      x0: number,
      y0: number,
      shear = 0
    ) => {
      for (let ry = 0; ry < rows.length; ry++) {
        const row = rows[ry]!;
        const sh = Math.round((rows.length - 1 - ry) * shear);
        for (let rx = 0; rx < row.length; rx++) {
          const ch = row[rx]!;
          if (ch === '.') continue;
          f.set(x0 + rx + sh, y0 + ry, c(SPRITE_KEY[ch]!));
        }
      }
    };

    if (a < LIGHT_BACK) {
      // shuffling, feet a step apart now and then
      const moving =
        Math.abs(track(BODY, s + 0.05) - track(BODY, s - 0.05)) > 0.3;
      sprite(BACK, bx - 4, top);
      if (moving && Math.floor(t / 160) % 2) {
        f.set(bx - 2, feetY, c('floor'));
        f.set(bx - 3, feetY - 1, c('shoes'));
      }
      // head turning to one side then the other: a cheek, a beard, a nose
      const look = Math.sin(s * 3.1) > 0 ? 1 : -1;
      f.set(bx + look * 3, top + 3, c('skin'));
      f.set(bx + look * 3, top + 4, c('beard'));
      f.set(bx + look * 2, top + 5, c('beard'));
      // both hands up on the wall, patting about
      const final = clamp01((s - 5.6) / 0.35);
      for (const side of [-1, 1]) {
        const ph = side < 0 ? 0 : 1.9;
        const near = nearPass(s);
        const sweep = Math.min(1, near / 0.3);
        let hx = bx + side * REACH + Math.round(Math.sin(s * 2.3 + ph) * sweep);
        let hy = Math.round(
          sy + Math.sin(s * 6.2 + ph) * 4 * sweep - 1 + sweep
        );
        if (side === 1 && final > 0) {
          // at last: right on it
          hx = Math.round(hx + (sx - hx) * final);
          hy = Math.round(hy + (sy - hy) * final);
        }
        const sxh = bx + side * 3;
        f.line(sxh, shoulderY, hx, hy + 1, c('hoodie'));
        f.line(sxh + side, shoulderY, hx + side, hy + 1, c('hoodie'));
        f.rect(Math.min(hx, hx + side), hy - 1, 2, 2, c('skin'));
        // a pat: little marks round the hand on the beat
        const beat = (s * 3 + (side < 0 ? 0 : 0.5)) % 1;
        if (beat < 0.25 && s > 0.6 && final === 0) {
          f.set(hx - 2, hy - 3, PAT);
          f.set(hx + 3, hy - 3, PAT);
          f.set(hx - 3, hy, PAT);
          f.set(hx + 4, hy, PAT);
        }
      }
      // every time a hand slides over the switch, it glints
      for (const p of passes) {
        const g = s - p;
        if (g < -0.05 || g > 0.45) continue;
        const k = 1 - Math.max(0, g) / 0.45;
        const arm = g < 0.12 ? 3 : g < 0.28 ? 2 : 1;
        for (let d = 1; d <= arm; d++) {
          const al = k * (1 - (d - 1) / (arm + 0.5));
          f.blend(sx - d, sy, GLINT, al);
          f.blend(sx + d, sy, GLINT, al);
          f.blend(sx, sy - d, GLINT, al);
          f.blend(sx, sy + d, GLINT, al);
        }
        f.set(sx, sy, GLINT);
      }
    } else {
      const b = a - LIGHT_BACK;
      if (b < 0.45) {
        // click: he turns round, arms down, blinking in the light
        sprite(b < 0.15 ? BACK : FRONT, bx - 4, top);
        if (b < 0.15) f.rect(bx + REACH - 1, sy - 1, 2, 2, c('skin'));
      } else if (b < 0.7) {
        // toppling back onto the bed
        const k = (b - 0.45) / 0.25;
        sprite(FRONT, bx - 4, top + Math.round(k * 6), k * 0.9);
      } else {
        // lying on the bed, with a bounce or two
        const c2 = b - 0.7;
        const bounce =
          c2 < 0.12 ? -1 : c2 < 0.24 ? 1 : c2 < 0.36 ? -1 : c2 < 0.5 ? 0 : 0;
        const ly = floorY - 6 - 2 + bounce;
        sprite(FLAT, bedX1 - 4 - FLAT[0]!.length, ly);
        // the mattress gives under him
        if (bounce > 0)
          f.hline(bedX0 + 2, bedX1 - 6, floorY + 2, c('bedFrameHi'));
      }
    }
  }

  return { draw };
}
