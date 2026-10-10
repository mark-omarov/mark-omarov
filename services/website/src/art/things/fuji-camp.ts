// The camp on the shore of the Fuji Five Lakes: a boxy 4x4 with a loaded
// roof rack, a dome tent, and a man, a woman and a kid around the fire.
// Sprites are strings (one char per pixel); the scene supplies the colours,
// so it can light them.

import { type Frame, type RGB } from '../frame';

/**
 * The adventure car in side view, nose to the right. 48 x 23; the bottom row
 * is where the tyres touch the ground.
 *
 * k tyre/trim  r rim  R hub  b body  B body (lit top)  d body shade
 * D under-body  w window  p pillar  m rack  x roof box  X box top
 * j jerry cans  J can lit  g bumper/grille  h headlight  a indicator
 * l tail light  s spare tyre  S spare rim  n snorkel  e door seam
 */
export const CAR = [
  '..........XXXXXXXXXXXXXX........................',
  '.........xxxxxxxxxxxxxxxx...JjJj................',
  '.........xxxxxxxxxxxxxxxx...jjjj................',
  '..mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm..n.........',
  '...m..........m..........m........m...n.........',
  '..BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBp.n.........',
  '.kbwwwwwwwwwwpwwwwwwwwwwpwwwwwwwwwwwwp.n........',
  'ksbwwwwwwwwwwpwwwwwwwwwwpwwwwwwwwwwwwwpn........',
  'ksbwwwwwwwwwwpwwwwwwwwwwpwwwwwwwwwwwwwwnp.......',
  'kSbwwwwwwwwwwpwwwwwwwwwwpwwwwwwwwwwwwwwnbp......',
  'kSbbbbbbbbbbbebbbbbbbbbbebbbbbbbbbbbbbbnBBBBBBg.',
  'ksbbbbbbbbbbbebbbbbbbkkbebbbbbbbbbbbbbbbbbbbbbhg',
  'ksllbbbbkkkkkebbbbbbbbbbebbbbbbbbbbkkkkkbbbbbbhg',
  'ksllbbbkDDDDDkbbbbbbbbbbebbbbbbbbbkDDDDDkbbbbbag',
  'ksbbbbkDkkkkkDkbbbbbbbbbebbbbbbbbkDkkkkkDkbbbbgg',
  'gggddkDkkkkkkkDkddddddddddddddddkDkkkkkkkDkdddgg',
  'gggdkDkkkrrrkkkDkddddddddddddddkDkkkrrrkkkDkddgg',
  'gggdkDkkrRrrrkkDkddddddddddddddkDkkrRrrrkkDkddgg',
  '......kkrrkrrkk..DDDDDDDDDDDDDD..kkrrkrrkk......',
  '......kkrrrrrkk..................kkrrrrrkk......',
  '......kkkrrrkkk..................kkkrrrkkk......',
  '.......kkkkkkk....................kkkkkkk.......',
  '........kkkkk......................kkkkk........',
];

/**
 * A man in a low camp chair, facing left, a mug in his hands. 12 x 14.
 * H hair  h hair lit (the fire side)  s skin  b beard  J hoodie
 * j hoodie lit  K hoodie shade  L jeans  l jeans lit  e sneakers  c chair
 * C chair lit  f frame  m mug
 */
export const MAN = [
  '....hHH.....',
  '...hHHHH....',
  '...ssHHH..c.',
  '...bbHH...c.',
  '....jJJK..c.',
  '..mjjJJK.cc.',
  '..mjJJJKKc..',
  '....jJJJKc..',
  '.lllLLLKKc..',
  'lLLLLLLLCc..',
  'lL..fcccf...',
  'lL...ff.....',
  'lL..f..f....',
  'ee.f....f...',
];

/** The man taking a sip: the mug up at his face. */
export const MAN_SIP = [
  '....hHH.....',
  '...hHHHH....',
  '..mssHHH..c.',
  '..mjbHH...c.',
  '...jjJJK..c.',
  '....jJJK.cc.',
  '...jJJJKKc..',
  '....jJJJKc..',
  '.lllLLLKKc..',
  'lLLLLLLLCc..',
  'lL..fcccf...',
  'lL...ff.....',
  'lL..f..f....',
  'ee.f....f...',
];

/** The man raising his mug to the sky. */
export const MAN_TOAST = [
  '.m..hHH.....',
  '.mjhHHHH....',
  '..jssHHH..c.',
  '...bbHH...c.',
  '....jJJK..c.',
  '....jJJK.cc.',
  '...jJJJKKc..',
  '....jJJJKc..',
  '.lllLLLKKc..',
  'lLLLLLLLCc..',
  'lL..fcccf...',
  'lL...ff.....',
  'lL..f..f....',
  'ee.f....f...',
];

/**
 * A woman, facing left, a blanket over her knees. 12 x 14.
 * H hair  h hair lit  s skin  W sweater  w sweater lit  b blanket
 * B blanket fold  c chair  C chair lit  f frame  m mug
 */
export const WOMAN = [
  '....hHH.....',
  '...hHHHH....',
  '...sHHHH..c.',
  '...sHHHH..c.',
  '....wWHH..c.',
  '..mwwWWH.cc.',
  '..mwWWWHHc..',
  '....wWWWWc..',
  '.BBBBBBbbCc.',
  'Bbbbbbbbbcc.',
  'Bbbbbbf.f...',
  'Bbbbbb......',
  '.bbbbf.f....',
  '..e.f...f...',
];

/** The woman taking a sip. */
export const WOMAN_SIP = [
  '....hHH.....',
  '...hHHHH....',
  '..mssHHH..c.',
  '..mwHHHH..c.',
  '...wwWHH..c.',
  '....wWWH.cc.',
  '...wWWWHHc..',
  '....wWWWWc..',
  '.BBBBBBbbCc.',
  'Bbbbbbbbbcc.',
  'Bbbbbbf.f...',
  'Bbbbbb......',
  '.bbbbf.f....',
  '..e.f...f...',
];

/** The woman raising her mug. */
export const WOMAN_TOAST = [
  '.m..hHH.....',
  '.mwhHHHH....',
  '..wsHHHH..c.',
  '...sHHHH..c.',
  '....wWHH..c.',
  '....wWWH.cc.',
  '...wWWWHHc..',
  '....wWWWWc..',
  '.BBBBBBbbCc.',
  'Bbbbbbbbbcc.',
  'Bbbbbbf.f...',
  'Bbbbbb......',
  '.bbbbf.f....',
  '..e.f...f...',
];

/**
 * The kid, standing, facing right, both hands on a roasting stick. 7 x 11.
 * p pom-pom  Y beanie  y beanie lit  H hair  s skin  R jacket  r jacket lit
 * T trousers  t trousers lit  e boots
 */
export const KID = [
  '.p.....',
  'YYyy...',
  'YYYyy..',
  'HHss...',
  'HRRr...',
  'RRRrrs.',
  'RRRr...',
  '.RRr...',
  '.TTt...',
  '.T.t...',
  'ee.ee..',
];

/**
 * The kid pointing up at the sky with their free hand, still holding the
 * stick with the other. One column wider than KID, on the left. 8 x 11.
 */
export const KID_POINT = [
  's.p.....',
  'RYYyy...',
  'RYYYyy..',
  'RHHss...',
  '.RRRr...',
  '.RRRrrs.',
  '.RRRr...',
  '..RRr...',
  '..TTt...',
  '..T.t...',
  '.ee.ee..',
];

/**
 * A canoe pulled up on the shore, side view. 22 x 5.
 * k bow and stern  w gunwale  H hull (lit)  h hull  K keel
 */
export const CANOE = [
  'k....................k',
  'kwwwwwwwwwwwwwwwwwwwwk',
  '.HHHHHHHHHHHHHHHHHHHH.',
  '..hhhhhhhhhhhhhhhhhh..',
  '....KKKKKKKKKKKKKK....',
];

/**
 * The camp kitchen: a cassette stove on a low folding table, a skillet of
 * sausages on the burner, its handle out to the right. 13 x 10.
 * R sausage  r sausage shade  k pan rim  i inside the pan  P pan  p pan base
 * h handle  b burner flame  B flame core  S stove top  s stove  T table top
 * t table legs
 */
export const STOVE = [
  '...RrRrR.....',
  '..kiiiiik....',
  '..PPPPPPPhhh.',
  '...ppppp.....',
  '...b.Bb.b....',
  '.SSSSSSSSs...',
  '.sssssssss...',
  'TTTTTTTTTTTT.',
  '.t........t..',
  '.t........t..',
];

/** Draws a string sprite with a per-char colour lookup (null = skip). */
export function paint(
  f: Frame,
  rows: readonly string[],
  x: number,
  y: number,
  col: (ch: string, rx: number, ry: number) => RGB | null,
  flip = false
) {
  const w = Math.max(...rows.map((r) => r.length));
  for (let ry = 0; ry < rows.length; ry++) {
    const row = rows[ry]!;
    for (let rx = 0; rx < row.length; rx++) {
      const ch = row[rx]!;
      if (ch === '.' || ch === ' ') continue;
      const c = col(ch, rx, ry);
      if (c !== null) f.set(x + (flip ? w - 1 - rx : rx), y + ry, c);
    }
  }
}

/**
 * A dome tent seen three-quarter on, as a map of zones (one char per pixel),
 * `w` wide with its ground row at the bottom. Two poles cross over the top:
 * one is the silhouette, the other comes up from the front corner as the
 * seam between the door face (left, towards the fire) and the side face.
 *
 * o rim  L door face  R side face  P pole seam  D door (open, the inside)
 * F rolled-up door  Z door edge  G groundsheet  V mesh window  q sleeping bag
 */
export function tentZones(w = 31, h = 17) {
  const ax = Math.round(w * 0.46); // apex column
  const fxc = Math.round(w * 0.55); // front corner column
  const ground = h - 1;
  const inside = (x: number, y: number) => {
    if (x < 0 || x >= w || y > ground) return false;
    const half = x <= ax ? ax + 0.5 : w - 0.5 - ax;
    const u = Math.min(1, Math.abs(x + 0.5 - (ax + 0.5)) / half);
    return (
      y >= Math.round(ground - ground * Math.pow(1 - Math.pow(u, 2.4), 0.5))
    );
  };
  // the front pole: from the front corner, leaning back to the apex
  const seam = (y: number) => {
    const v = (ground - y) / ground; // 0 at the ground, 1 at the apex
    return Math.round(fxc - (fxc - ax) * v * v);
  };
  // the door: an arch on the door face
  const dc = Math.round(fxc * 0.46);
  const r = Math.max(2.5, fxc * 0.24);
  const dTop = Math.round(h * 0.36);
  const door = (x: number, y: number) => {
    if (y < dTop || y >= ground) return false;
    const dy = Math.max(0, dTop + r - 0.5 - y);
    const half = Math.sqrt(Math.max(0, r * r - dy * dy));
    return Math.abs(x + 0.5 - (dc + 0.5)) <= half;
  };
  const rows: string[] = [];
  for (let y = 0; y < h; y++) {
    let row = '';
    for (let x = 0; x < w; x++) {
      if (!inside(x, y)) {
        row += '.';
        continue;
      }
      const sx = seam(y);
      const left = x < sx;
      let c = left ? 'L' : 'R';
      if (x === sx) c = 'P';
      else if (left && door(x, y)) {
        c = !door(x - 1, y) || !door(x + 1, y) ? 'Z' : 'D';
        if (c === 'D' && y >= ground - 2 && x >= dc && x <= dc + 2) c = 'q';
      } else if (left && (door(x, y + 1) || door(x, y + 2))) c = 'F';
      // a mesh window high on the side face
      const wx = Math.round(sx + (w - sx) * 0.48);
      if (
        c === 'R' &&
        y >= Math.round(h * 0.3) &&
        y < Math.round(h * 0.3) + 3 &&
        Math.abs(x - wx) <= 2
      )
        c = 'V';
      if (y === ground) c = 'G';
      else if (!inside(x, y - 1) || !inside(x - 1, y) || !inside(x + 1, y))
        c = 'o';
      row += c;
    }
    rows.push(row);
  }
  return { rows, apex: { x: ax, y: 0 }, door: { x: dc, y: dTop } };
}
