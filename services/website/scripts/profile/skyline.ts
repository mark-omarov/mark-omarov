import { Frame, hex, lerpRGB, type RGB } from '../../src/art/frame';
import { measure, text } from '../../src/art/pixel-font';
import { C } from './colors';
import type { Calendar, Week } from './contributions';
import sharp from 'sharp';
import { css, paths, svg } from './svg';

const W = 427;
const H = 120;
const GROUND = H - 17;
const PITCH = 8;
const BW = 7;
const MIN_H = 10;
const MAX_H = GROUND - 28;
const CORNER = [3, 1, 1];

const SKY = [hex('#13141c'), hex('#1a1b26'), hex('#222538'), hex('#2e2c48')];
const FACADES = ['#1b1d2b', '#1d1f2e', '#191a27', '#1e2131'].map(hex);
const EDGE = hex('#2a2e45');
const BACK = hex('#22253a');
const BACK_LIT = hex('#3a3d5a');
const WARM = [hex('#a8834f'), C.yellow, hex('#ffd28a')];
const MONTHS = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');

/** A small deterministic random stream. */
function stream(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const hash = (s: string) => {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};

/** 0 at new moon, 0.5 at full. */
function moonPhase(now: Date) {
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const days = (now.getTime() - ref) / 86_400_000;
  return (((days / 29.530588853) % 1) + 1) % 1;
}

function moon(f: Frame, cx: number, cy: number, phase: number) {
  const r = 5.5;
  const k = Math.cos(phase * 2 * Math.PI);
  for (let dy = -5; dy <= 5; dy++)
    for (let dx = -5; dx <= 5; dx++) {
      const d2 = dx * dx + dy * dy;
      if (d2 > r * r) continue;
      const half = Math.sqrt(r * r - dy * dy) || 1;
      const xn = dx / half;
      const lit = phase < 0.5 ? xn > k : xn < -k;
      if (lit) f.set(cx + dx, cy + dy, d2 > 16 ? C.soft : C.fg);
    }
}

type Anim = { x: number; y: number; w: number; h: number; c: RGB; cls: string };

/** The year of contributions as a city at night, as an animated SVG. */
export async function skyline(cal: Calendar, now: Date) {
  const weeks = cal.weeks.slice(-53);
  const f = new Frame(W, H);
  const anims: Anim[] = [];

  // sky in flat bands, lighter towards the city glow
  for (let y = 0; y < GROUND; y++) {
    const t = (y / GROUND) ** 1.6 * (SKY.length - 1);
    const i = Math.min(SKY.length - 2, Math.floor(t));
    const band = Math.floor((t - i) * 3) / 3;
    f.rect(0, y, W, 1, lerpRGB(SKY[i]!, SKY[i + 1]!, band));
  }

  // caption
  const total = cal.total.toLocaleString('en-US');
  const title = ' contributions in the last year';
  const key = 'one building per week, lit windows for active days';
  text(f, total, 7, 6, C.yellow);
  text(f, title, 7 + measure(total) + 1, 6, C.soft);
  text(f, key, 7, 15, C.muted);
  const captionBottom = 23;
  const captionRight = 7 + Math.max(measure(total + title), measure(key));

  // stars
  const rand = stream(42);
  const moonX = W - 74;
  const moonY = 15;
  for (let n = 0; n < 70; n++) {
    const x = Math.floor(rand() * W);
    const y = 2 + Math.floor(rand() * (GROUND - 46));
    const b = rand();
    if (y < captionBottom + 2 && x < captionRight + 3) continue;
    if (Math.abs(x - moonX) < 9 && Math.abs(y - moonY) < 9) continue;
    if (b < 0.18) anims.push({ x, y, w: 1, h: 1, c: C.fg, cls: `t${n % 4}` });
    else f.set(x, y, b < 0.75 ? hex('#3b4261') : hex('#565f89'));
  }
  moon(f, moonX, moonY, moonPhase(now));

  // a hazy row of buildings behind, the same every day
  const back = stream(7);
  for (let x = 0; x < W; ) {
    const w = 4 + Math.floor(back() * 8);
    const h = 8 + Math.floor(back() * 30);
    f.rect(x, GROUND - h, w, h, BACK);
    for (let y = GROUND - h + 2; y < GROUND - 4; y += 3)
      for (let wx = x + 1; wx < x + w - 1; wx += 2)
        if (back() < 0.12) f.set(wx, y, BACK_LIT);
    x += w;
  }

  // the year: a building per week, height from its contributions
  const sums = weeks.map((w) => w.days.reduce((a, b) => a + b, 0));
  const max = Math.max(1, ...sums);
  const x0 = Math.floor((W - weeks.length * PITCH + 1) / 2);
  const tallest = sums.indexOf(max);
  weeks.forEach((week, i) => {
    const x = x0 + i * PITCH;
    const h = Math.round(MIN_H + (MAX_H - MIN_H) * Math.sqrt(sums[i]! / max));
    const b = building(f, anims, week, x, GROUND - h, sums[i]!);
    if (i === weeks.length - 1) crane(f, anims, x, b.top);
    else if (i === tallest && sums[i]! > 0)
      anims.push({
        x: b.peakX,
        y: b.peakY - 1,
        w: 1,
        h: 1,
        c: C.red,
        cls: 'r',
      });
  });

  // the elevated railway, the street and the months
  f.rect(0, GROUND - 4, W, 1, C.line);
  f.rect(0, GROUND - 3, W, 1, C.surface);
  for (let x = 5; x < W; x += 14) f.rect(x, GROUND - 2, 2, 2, C.surface);
  f.rect(0, GROUND, W, 1, C.line);
  f.rect(0, GROUND + 1, W, H - GROUND - 1, C.bgDark);
  for (let x = 2; x < W; x += 7) f.rect(x, GROUND + 3, 3, 1, hex('#24273a'));
  let lastLabel = -99;
  weeks.forEach((week, i) => {
    const m = Number(week.start.slice(5, 7)) - 1;
    const prev = i ? Number(weeks[i - 1]!.start.slice(5, 7)) - 1 : -1;
    const x = x0 + i * PITCH;
    if (m !== prev && x - lastLabel > 22 && x < W - 14) {
      text(f, MONTHS[m]!, x, GROUND + 7, C.muted);
      lastLabel = x;
    }
  });

  // pixel corners
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const row = Math.min(y, H - 1 - y);
      const col = Math.min(x, W - 1 - x);
      if (row < CORNER.length && col < CORNER[row]!) f.pixels[y * W + x] = 0;
    }

  const animated = anims
    .map(
      (a) =>
        `<rect class="${a.cls}" x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" fill="${css(a.c)}"/>`
    )
    .join('');
  const style =
    '<style>' +
    '@keyframes tw{0%,60%{opacity:1}65%,80%{opacity:.2}85%{opacity:1}}' +
    '.t0{animation:tw 3.7s step-end infinite}.t1{animation:tw 5.3s step-end -1.2s infinite}' +
    '.t2{animation:tw 4.1s step-end -2.9s infinite}.t3{animation:tw 6.7s step-end -.6s infinite}' +
    '@keyframes off{0%,70%{opacity:1}71%,100%{opacity:0}}' +
    '@keyframes on{0%,70%{opacity:0}71%,100%{opacity:1}}' +
    '.f0{animation:off 9s step-end -3s infinite}.f1{animation:off 13s step-end -8s infinite}' +
    '.n0{animation:on 11s step-end -2s infinite}.n1{animation:on 7s step-end -5s infinite}' +
    '@keyframes bl{0%{opacity:1}50%{opacity:.15}}.r{animation:bl 1.6s step-end infinite}' +
    '@keyframes tr{0%{transform:translateX(0)}45%,100%{transform:translateX(520px)}}' +
    '.train{animation:tr 16s steps(520,end) -4s infinite}' +
    '@keyframes sh{0%,94%{opacity:0;transform:translate(0,0)}95%{opacity:1;transform:translate(0,0)}' +
    '99%{opacity:1;transform:translate(-20px,10px)}100%{opacity:0;transform:translate(-20px,10px)}}' +
    '.sh{animation:sh 12s steps(1,end) infinite}' +
    '@media (prefers-reduced-motion:reduce){.train,.sh{display:none}*{animation:none!important}}' +
    '</style>';
  return svg(
    W,
    H,
    2,
    style +
      (await still(f)) +
      animated +
      `<g class="train">${paths(train(), -80, GROUND - 9)}</g>` +
      shootingStar()
  );
}

/**
 * The static picture as a PNG inside the SVG: far smaller than a path per
 * window. It's drawn at 4x so it stays sharp however the browser scales it.
 */
async function still(f: Frame) {
  const S = 4;
  const px = new Uint32Array(W * S * H * S);
  for (let y = 0; y < H * S; y++)
    for (let x = 0; x < W * S; x++)
      px[y * W * S + x] = f.pixels[Math.floor(y / S) * W + Math.floor(x / S)]!;
  const png = await sharp(new Uint8Array(px.buffer), {
    raw: { width: W * S, height: H * S, channels: 4 },
  })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  return `<image width="${W}" height="${H}" style="image-rendering:pixelated" href="data:image/png;base64,${png.toString('base64')}"/>`;
}

/** One week's building; returns its roof line and highest point. */
function building(
  f: Frame,
  anims: Anim[],
  week: Week,
  x: number,
  top: number,
  sum: number
) {
  const rand = stream(hash(week.start));
  const facade = FACADES[Math.floor(rand() * FACADES.length)]!;
  const roof = Math.floor(rand() * 5);
  const bw = rand() < 0.3 ? BW - 2 : BW;
  x += Math.floor((BW - bw) / 2);
  const inset = roof === 2 ? 1 : 0;
  f.rect(x + inset, top, bw - inset * 2, 2, facade);
  f.rect(x, top + 2, bw, GROUND - top - 2, facade);
  f.rect(x + bw - 1, top + 2, 1, GROUND - top - 2, EDGE);
  f.rect(x + inset, top, bw - inset * 2, 1, EDGE);
  let peakX = x + Math.floor(bw / 2);
  let peakY = top;
  if (roof === 1) {
    const ah = 3 + Math.floor(rand() * 4);
    peakX = x + (rand() < 0.5 ? 1 : bw - 3);
    peakY = top - ah;
    f.rect(peakX, peakY, 1, ah, hex('#3b4261'));
  } else if (roof === 3) {
    f.rect(x + 1, top - 3, 3, 2, hex('#2a2e45'));
    f.set(x + 1, top - 1, hex('#2a2e45'));
    f.set(x + 3, top - 1, hex('#2a2e45'));
    peakX = x + 2;
    peakY = top - 3;
  }

  const active = week.days.filter((d) => d > 0).length;
  const busy = active ? sum / active : 0;
  const spots: [number, number][] = [];
  for (let y = top + 3; y < GROUND - 5; y += 3)
    for (let wx = 1; wx < bw - 1; wx += 2) spots.push([x + wx, y]);
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [spots[i], spots[j]] = [spots[j]!, spots[i]!];
  }
  const lit = active ? Math.max(1, Math.round((spots.length * active) / 7)) : 0;
  spots.forEach(([wx, wy], i) => {
    const r = rand();
    if (i < lit) {
      const c =
        r < 0.06 ? C.cyan : WARM[Math.min(2, Math.floor(r * 2 + busy / 6))]!;
      if (r > 0.95)
        anims.push({ x: wx, y: wy, w: 1, h: 1, c, cls: `f${i % 2}` });
      else f.set(wx, wy, c);
    } else {
      f.set(wx, wy, hex('#24273a'));
      if (r > 0.985)
        anims.push({ x: wx, y: wy, w: 1, h: 1, c: WARM[1]!, cls: `n${i % 2}` });
    }
  });
  return { top, peakX, peakY };
}

/** A tower crane on the building still going up: this week. */
function crane(f: Frame, anims: Anim[], x: number, top: number) {
  const steel = hex('#b8925a');
  const mx = x + 4;
  const jy = top - 14;
  f.rect(mx, jy, 1, top - jy, steel);
  f.rect(mx - 18, jy, 22, 1, steel);
  f.rect(mx - 1, jy - 1, 3, 1, steel);
  f.rect(mx + 1, jy + 1, 2, 2, hex('#3b4261'));
  f.rect(mx - 12, jy + 1, 1, 6, hex('#565f89'));
  f.rect(mx - 13, jy + 7, 3, 1, steel);
  anims.push({ x: mx, y: jy - 2, w: 1, h: 1, c: C.red, cls: 'r' });
}

function train() {
  const cars = 3;
  const car = 22;
  const f = new Frame(cars * (car + 1), 5);
  for (let c = 0; c < cars; c++) {
    const x = c * (car + 1);
    f.rect(x + 1, 0, car - 2, 1, C.muted);
    f.rect(x, 1, car, 2, C.soft);
    for (let wx = x + 2; wx < x + car - 2; wx += 3)
      f.rect(wx, 1, 2, 1, C.yellow);
    f.rect(x, 3, car, 1, C.green);
    f.rect(x + 1, 4, car - 2, 1, hex('#565f89'));
  }
  f.set(f.w - 1, 3, hex('#ffd28a'));
  return f;
}

function shootingStar() {
  const d = 'M300 8h1v1h-1zM298 7h2v1h-2zM295 6h3v1h-3z';
  return `<path class="sh" fill="${css(C.fg)}" d="${d}"/>`;
}
