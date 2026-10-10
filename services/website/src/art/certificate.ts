// A pixel certificate for the course dialog on /learned: cream paper with a
// double border, the real course written on it in a pixel font (what kind
// of certificate, Mark's name, the course, who issued it and when), a
// signature, and a wax seal with the topic's icon and ribbons in the
// topic's colour. When the dialog opens it prints out top to bottom like a
// dot-matrix printer, then the seal glints now and then.

import { Frame, hex, type RGB, sprite } from './frame';
import { hash2 } from './noise';
import { centred, measure, text, wrap } from './pixel-font';

export const CERT_W = 144;
export const CERT_H = 104;

export type CertContent = {
  topic: CertTopic;
  /** Varies the signature from course to course. */
  seed: number;
  /** The line across the top, e.g. "CERTIFICATE OF COMPLETION". */
  kind: string;
  title: string;
  issuer: string;
  /** Already formatted, e.g. "May 2023". */
  date: string;
};

export type CertTopic =
  | 'frontend'
  | 'backend'
  | 'languages'
  | 'tools'
  | 'security'
  | 'specialized'
  | 'design';

const TOPIC: Record<CertTopic, [RGB, RGB, RGB]> = {
  // seal, its shade, its highlight (the site's palette)
  frontend: [hex('#7aa2f7'), hex('#3d59a1'), hex('#c0d4ff')],
  backend: [hex('#9ece6a'), hex('#4f7a2e'), hex('#d4f0b0')],
  languages: [hex('#ff9e64'), hex('#b05a28'), hex('#ffd2b0')],
  tools: [hex('#e0af68'), hex('#9a6a28'), hex('#f6dcae')],
  security: [hex('#f7768e'), hex('#a8384e'), hex('#ffc2cc')],
  specialized: [hex('#bb9af7'), hex('#6e4fb0'), hex('#e4d6ff')],
  design: [hex('#7dcfff'), hex('#2e7aa8'), hex('#c8ecff')],
};

// 9x7 topic icons
const ICONS: Record<CertTopic, string[]> = {
  frontend: [
    '.....x...',
    '.x...x.x.',
    'x...x...x',
    'x...x...x',
    'x..x....x',
    '.x.x...x.',
    '...x.....',
  ],
  backend: [
    'xxxxxxxxx',
    'x.o.....x',
    'xxxxxxxxx',
    'x.o.....x',
    'xxxxxxxxx',
    'x.o.....x',
    'xxxxxxxxx',
  ],
  languages: [
    '.xx...xx.',
    '.x.....x.',
    '.x.....x.',
    'x...o...x',
    '.x.....x.',
    '.x.....x.',
    '.xx...xx.',
  ],
  tools: [
    '......xx.',
    '.....x..x',
    '....x..x.',
    '...x.xx..',
    '..x.x....',
    '.x.x.....',
    'xxx......',
  ],
  security: [
    '...xxx...',
    '..x...x..',
    '..x...x..',
    '.xxxxxxx.',
    '.xxxoxxx.',
    '.xxxoxxx.',
    '.xxxxxxx.',
  ],
  specialized: [
    '....x....',
    '...xxx...',
    'xxxxoxxxx',
    '.xxxxxxx.',
    '..xxxxx..',
    '.xx...xx.',
    'xx.....xx',
  ],
  design: [
    '.......xx',
    '......xxx',
    '.....xxx.',
    '....xxx..',
    '..oxxx...',
    '.ooo.....',
    'xoo......',
  ],
};

const PAPER = hex('#f2e6c9');
const PAPER_SH = hex('#e2d2ad');
const EDGE = hex('#c9b48a');
const INK = hex('#3a3350');
const INK_SOFT = hex('#8a7f96');
const SHADOW = hex('#0b0d17');
const HEAD = hex('#ffffff');

/** The whole certificate, printed, with the ribbon tips swayed by `sway`. */
function paint(clip: Frame, c: CertContent, sway: number) {
  const [seal, sealSh, sealHi] = TOPIC[c.topic];
  const x0 = 6;
  const y0 = 4;
  const pw = CERT_W - 12;
  const ph = CERT_H - 10;
  const r = (k: number) => hash2(c.seed, k, 61);

  // shadow and paper
  clip.rect(x0 + 3, y0 + 3, pw, ph, SHADOW);
  clip.rect(x0, y0, pw, ph, PAPER);
  for (let y = y0 + 1; y < y0 + ph; y += 2)
    if (r(y) > 0.82) clip.hline(x0 + 1, x0 + pw - 2, y, PAPER_SH);
  // double border with diamonds in the corners
  for (const i of [2, 4]) {
    clip.hline(x0 + i, x0 + pw - 1 - i, y0 + i, EDGE);
    clip.hline(x0 + i, x0 + pw - 1 - i, y0 + ph - 1 - i, EDGE);
    clip.vline(x0 + i, y0 + i, y0 + ph - 1 - i, EDGE);
    clip.vline(x0 + pw - 1 - i, y0 + i, y0 + ph - 1 - i, EDGE);
  }
  for (const [dx, dy] of [
    [x0 + 3, y0 + 3],
    [x0 + pw - 4, y0 + 3],
    [x0 + 3, y0 + ph - 4],
    [x0 + pw - 4, y0 + ph - 4],
  ] as const) {
    clip.set(dx, dy - 1, seal);
    clip.set(dx - 1, dy, seal);
    clip.set(dx + 1, dy, seal);
    clip.set(dx, dy + 1, seal);
    clip.set(dx, dy, sealSh);
  }

  // the writing: what it is, who, and for what
  const mid = x0 + Math.floor(pw / 2);
  centred(clip, c.kind, mid, y0 + 9, sealSh);
  clip.hline(mid - 26, mid + 26, y0 + 17, EDGE);
  centred(clip, 'Mark Omarov', mid, y0 + 21, INK);
  centred(clip, 'has completed', mid, y0 + 30, INK_SOFT);
  const lines = wrap(c.title, pw - 16).slice(0, 3);
  const ty = y0 + 39 + (3 - lines.length) * 4;
  lines.forEach((line, i) => centred(clip, line, mid, ty + i * 8, INK));

  // signed by the issuer, and dated, bottom left
  const sx = x0 + 12;
  const sy = y0 + ph - 25;
  const sw = Math.max(36, measure(c.issuer));
  let py = sy;
  for (let x = 0; x < sw - 6; x++) {
    const ny =
      sy -
      Math.round(
        Math.sin(x * (0.5 + r(30) * 0.4) + r(31) * 6) * 2 +
          Math.sin(x * 0.21) * 1.5
      );
    clip.line(sx + 2 + x, py, sx + 3 + x, ny, INK);
    py = ny;
  }
  clip.hline(sx, sx + sw, sy + 4, INK_SOFT);
  text(clip, c.issuer, sx, sy + 6, INK);
  text(clip, c.date, sx, sy + 14, INK_SOFT);

  // the seal with the topic's icon, and its two ribbons
  const cx = x0 + pw - 24;
  const cy = y0 + ph - 26;
  for (const [dx, lean] of [
    [-4, -1],
    [3, 1],
  ] as const) {
    for (let k = 0; k < 11; k++) {
      const rx = cx + dx + Math.round((lean * k) / 4) + (k > 6 ? sway : 0);
      clip.hline(rx, rx + 1, cy + 6 + k, k === 10 ? sealSh : seal);
    }
    // the V cut at the end
    clip.set(cx + dx + Math.round((lean * 10) / 4) + sway, cy + 16, PAPER);
  }
  clip.disc(cx, cy, 9, (ddx, ddy) => {
    const d = ddx * ddx + ddy * ddy;
    if (d > 72) return sealSh;
    if (d > 56 && d < 68)
      return (Math.round(Math.atan2(ddy, ddx) * 5) & 1) === 0 ? sealSh : seal;
    return ddx + ddy < -5 ? sealHi : seal;
  });
  sprite(clip, ICONS[c.topic], cx - 4, cy - 3, { x: sealSh, o: sealHi });
}

// built once per course (and ribbon position), not every frame
const painted = new Map<string, Frame>();
function base(c: CertContent, sway: number) {
  const key = [c.topic, c.seed, c.kind, c.title, c.issuer, c.date, sway].join(
    '|'
  );
  let fr = painted.get(key);
  if (!fr) {
    if (painted.size > 24) painted.clear();
    fr = new Frame(CERT_W, CERT_H);
    paint(fr, c, sway);
    painted.set(key, fr);
  }
  return fr;
}

/** Draws the certificate, `age` ms after the dialog opened. */
export function drawCertificate(f: Frame, age: number, c: CertContent) {
  const seal = TOPIC[c.topic][0];
  const x0 = 6;
  const y0 = 4;
  const pw = CERT_W - 12;
  const ph = CERT_H - 10;
  const cx = x0 + pw - 24;
  const cy = y0 + ph - 26;
  const printed = Math.min(1, age / 1100);
  const edge = y0 + Math.floor(printed * (ph + 2));
  const clip = base(c, Math.round(Math.sin(age / 500)));

  // copy the printed part across, with the print head on the edge
  for (let y = 0; y < Math.min(CERT_H, edge); y++)
    for (let x = 0; x < CERT_W; x++) {
      const p = clip.pixels[y * CERT_W + x]!;
      if (p >>> 24) f.pixels[y * CERT_W + x] = p;
    }
  // a glint sweeping over the seal every few seconds, once it's printed
  const g = (age - 1200) % 3200;
  if (printed >= 1 && g > 0 && g < 500) {
    const gx = cx - 10 + Math.round((g / 500) * 20);
    for (let k = -9; k <= 9; k++) {
      const x = gx + Math.round(k / 2);
      const y = cy + k;
      if ((x - cx) ** 2 + (y - cy) ** 2 <= 72 && y < edge) f.set(x, y, HEAD);
    }
  }

  if (printed < 1) {
    f.hline(x0 - 2, x0 + pw + 1, edge, INK);
    const hx = x0 + Math.round(((Math.sin(age / 40) + 1) / 2) * (pw - 6));
    f.rect(hx, edge - 1, 6, 3, seal);
  }
}
