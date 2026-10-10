import { Frame, type RGB } from '../../src/art/frame';
import { text } from '../../src/art/pixel-font';
import { SCENES, type SceneEntry } from '../../src/art/scenes';
import { C } from './colors';
import { advance, css, paths, svg, textD } from './svg';
import { placeLabel } from './today';

type Seg = [string, RGB];
type Step = { cmd: string; out: Seg[][] };

const W = 320;
const PAD = 9;
// title bar rows, then a separator line
const BAR = 11;
const TOP = BAR + 7;
const LINE = 9;
const CORNER = [3, 1, 1];
const PROMPT: Seg[] = [
  ['mark@tokyo', C.green],
  [' ~ ', C.blue],
  ['$ ', C.muted],
];

function script(place: SceneEntry, posts: string[]): Step[] {
  const here = place.eggs.length;
  const all = SCENES.reduce((n, s) => n + s.eggs.length, 0);
  const steps: Step[] = [
    {
      cmd: 'whoami',
      out: [
        [
          ['mark omarov', C.fg],
          [', software engineer from ukraine, living in tokyo.', C.soft],
        ],
      ],
    },
    {
      cmd: 'cat now.txt',
      out: [
        [['building AI products at cogent labs.', C.soft]],
        [
          [
            'off the clock: motorcycle, homelab, open source, trips out of the city.',
            C.soft,
          ],
        ],
      ],
    },
  ];
  if (posts.length)
    steps.push({
      cmd: 'ls -t blog/',
      out: columns(posts).map((line) => [[line, C.purple]]),
    });
  steps.push(
    {
      cmd: './places --today',
      out: [
        [
          [placeLabel(place).toLowerCase(), C.yellow],
          ['. ', C.soft],
          [`${here}`, C.orange],
          [here === 1 ? ' egg hidden in it, ' : ' eggs hidden in it, ', C.soft],
          [`${all}`, C.orange],
          [' across ', C.soft],
          ['omarov.dev', C.blue],
        ],
      ],
    },
    {
      cmd: 'cat contact.txt',
      out: [
        [
          ['mark@omarov.dev', C.cyan],
          [', open to new things, consulting or otherwise.', C.soft],
        ],
      ],
    }
  );
  return steps;
}

/** Names laid out like ls does, two spaces apart, wrapping at the edge. */
function columns(names: string[]) {
  const lines: string[] = [];
  for (const n of names) {
    const last = lines.at(-1);
    if (last !== undefined && advance(`${last}  ${n}`) <= W - PAD * 2)
      lines[lines.length - 1] = `${last}  ${n}`;
    else lines.push(n);
  }
  return lines;
}

/** A line of coloured segments as paths, starting at x. */
function segs(line: Seg[], x: number, y: number) {
  let out = '';
  for (const [s, c] of line) {
    const d = textD(s, x, y);
    if (d) out += `<path fill="${css(c)}" d="${d}"/>`;
    x += advance(s);
  }
  return out;
}

const s = (t: number) => `${t.toFixed(2)}s`;

function chrome(h: number) {
  const f = new Frame(W, h);
  const inside = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= W || y >= h) return false;
    const row = Math.min(y, h - 1 - y);
    const col = Math.min(x, W - 1 - x);
    return !(row < CORNER.length && col < CORNER[row]!);
  };
  for (let y = 0; y < h; y++)
    for (let x = 0; x < W; x++) {
      if (!inside(x, y)) continue;
      const edge =
        !inside(x - 1, y) ||
        !inside(x + 1, y) ||
        !inside(x, y - 1) ||
        !inside(x, y + 1);
      f.set(x, y, edge || y === BAR ? C.line : y < BAR ? C.bgDark : C.bg);
    }
  [C.red, C.yellow, C.green].forEach((c, i) => {
    const x = 7 + i * 7;
    f.rect(x + 1, 4, 2, 4, c);
    f.rect(x, 5, 4, 2, c);
  });
  const title = 'mark@tokyo: ~';
  text(f, title, Math.floor((W - advance(title)) / 2), 2, C.muted);
  return f;
}

/** A terminal typing a short intro, as an animated SVG. */
export function terminal(place: SceneEntry, posts: string[]) {
  const steps = script(place, posts);
  const rows = steps.reduce((n, st) => n + 1 + st.out.length, 1);
  const h = TOP + (rows - 1) * LINE + 7 + 8;

  // deterministic jitter so the typing doesn't feel mechanical
  let seed = 7;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const cursor = (x: number, y: number, from: number, to: number) =>
    `<rect class="k" x="${x}" y="${y}" width="3" height="5" style="animation:k ${s(to - from)} ${s(from)}"/>`;

  let body = '';
  let cursors = '';
  let y = TOP;
  let t = 0;
  const promptW = advance(PROMPT.map(([p]) => p).join(''));
  steps.forEach((st, i) => {
    body += i
      ? `<g class="a" style="animation-delay:${s(t)}">${segs(PROMPT, PAD, y)}</g>`
      : segs(PROMPT, PAD, y);
    let x = PAD + promptW;
    let tc = t + (i ? 0.45 : 1.1);
    cursors += cursor(x, y, t, tc);
    for (const ch of st.cmd) {
      const d = textD(ch, x, y);
      if (d)
        body += `<path class="a" fill="${css(C.fg)}" style="animation-delay:${s(tc)}" d="${d}"/>`;
      const dt = 0.05 + rand() * 0.07;
      x += advance(ch);
      cursors += cursor(x, y, tc, tc + dt);
      tc += dt;
    }
    cursors += cursor(x, y, tc, tc + 0.35);
    tc += 0.35;
    for (const line of st.out) {
      y += LINE;
      body += `<g class="a" style="animation-delay:${s(tc)}">${segs(line, PAD, y)}</g>`;
      tc += 0.06;
    }
    y += LINE;
    t = tc + 0.25;
  });
  body += `<g class="a" style="animation-delay:${s(t)}">${segs(PROMPT, PAD, y)}</g>`;
  cursors += `<rect class="b" x="${PAD + promptW}" y="${y}" width="3" height="5" style="animation-delay:${s(t)}"/>`;

  const style =
    '<style>' +
    '.a{opacity:0;animation:a .01s forwards}@keyframes a{to{opacity:1}}' +
    '.k{opacity:0}@keyframes k{from,to{opacity:1}}' +
    '.b{opacity:0;animation:b 1.1s step-end infinite}@keyframes b{0%{opacity:1}50%{opacity:0}}' +
    '@media (prefers-reduced-motion:reduce){.a,.b{animation:none;opacity:1}.k{display:none}}' +
    '</style>';
  return svg(
    W,
    h,
    2,
    style + paths(chrome(h)) + body + `<g fill="${css(C.soft)}">${cursors}</g>`
  );
}
