import sharp from 'sharp';
import { Frame, bayer8 } from '../../src/art/frame';
import { measure, text } from '../../src/art/pixel-font';
import { SCENE_H } from '../../src/art/scene';
import type { SceneEntry } from '../../src/art/scenes';
import { C } from './colors';
import { placeLabel } from './today';

const W = 427;
// the same melt into the page as the home page viewer, with the caption in it
const FADE = 28;
const H = SCENE_H + FADE;
// 4x so it stays sharp on retina screens at README width
const SCALE = 4;
// ms per frame, close to the site's own pace
const STEP = 70;
const FRAMES = 100;
// the last frames dissolve into the first, so the loop has no seam
const BLEND = 14;
const CORNER = [3, 1, 1];

const PAGE =
  (0xff000000 | ((C.bg & 0xff) << 16) | (C.bg & 0xff00) | (C.bg >>> 16)) >>> 0;

/** The scene's bottom rows mirrored, darkened and dithered into the page. */
function melt(src: Uint32Array, dst: Frame) {
  dst.pixels.set(src);
  const mix = (s: number, t: number, d: number) => Math.round(s + (t - s) * d);
  for (let k = 0; k < FADE; k++) {
    const y = SCENE_H + k;
    const u = (k + 1) / FADE;
    const d = 0.25 + (0.6 * Math.min(3, Math.floor(u * 4))) / 4;
    const from = (SCENE_H - 1 - k) * W;
    for (let x = 0, i = y * W; x < W; x++, i++) {
      const p = src[from + x]!;
      dst.pixels[i] =
        bayer8(x, y) < u
          ? PAGE
          : (0xff000000 |
              (mix((p >>> 16) & 0xff, C.bg & 0xff, d) << 16) |
              (mix((p >>> 8) & 0xff, (C.bg >>> 8) & 0xff, d) << 8) |
              mix(p & 0xff, C.bg >>> 16, d)) >>>
            0;
    }
  }
}

function caption(f: Frame, place: SceneEntry) {
  const y = SCENE_H + 18;
  text(f, placeLabel(place), 7, y, C.soft);
  const site = 'omarov.dev';
  text(f, site, W - 7 - measure(site), y, C.blue);
}

const cornerAt = (x: number, y: number) => {
  const row = Math.min(y, H - 1 - y);
  const col = Math.min(x, W - 1 - x);
  return row < CORNER.length && col < CORNER[row]!;
};

/** Today's place, animated, as a looping lossless WebP. */
export async function banner(place: SceneEntry) {
  const scene = await place.load();
  const rt = scene.create(W, SCENE_H);
  const f = new Frame(W, SCENE_H);
  const t0 = 30_000;
  for (let t = t0 - BLEND * STEP - 3000; t < t0 - BLEND * STEP; t += STEP)
    rt.render(f, t);
  const shots: Uint32Array[] = [];
  for (let i = -BLEND; i < FRAMES; i++) {
    rt.render(f, t0 + i * STEP);
    shots.push(f.pixels.slice());
  }

  const full = new Frame(W, H);
  const mixed = new Uint32Array(W * SCENE_H);
  const sw = W * SCALE;
  const strip = new Uint32Array(sw * H * SCALE * FRAMES);
  const row = new Uint32Array(sw);
  for (let k = 0; k < FRAMES; k++) {
    const cur = shots[k + BLEND]!;
    const tail = k - (FRAMES - BLEND);
    if (tail >= 0) {
      const back = shots[tail]!;
      const p = (tail + 1) / (BLEND + 1);
      for (let y = 0, i = 0; y < SCENE_H; y++)
        for (let x = 0; x < W; x++, i++)
          mixed[i] = bayer8(x, y) < p ? back[i]! : cur[i]!;
      melt(mixed, full);
    } else melt(cur, full);
    caption(full, place);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++)
        row.fill(
          cornerAt(x, y) ? 0 : full.pixels[y * W + x]!,
          x * SCALE,
          (x + 1) * SCALE
        );
      for (let dy = 0; dy < SCALE; dy++)
        strip.set(row, ((k * H + y) * SCALE + dy) * sw);
    }
  }

  return sharp(new Uint8Array(strip.buffer), {
    raw: {
      width: sw,
      height: H * SCALE * FRAMES,
      channels: 4,
      pageHeight: H * SCALE,
    },
  })
    .webp({
      lossless: true,
      effort: 6,
      loop: 0,
      delay: Array<number>(FRAMES).fill(STEP),
    })
    .toBuffer();
}
