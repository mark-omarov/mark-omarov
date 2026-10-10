// Azov at dusk, from the reeds on the far side of the Don. The grassy
// ramparts of the old fortress catch the last of the light, the powder
// magazine's lamp is lit, a church dome glints over the town, a panel block
// of flats has its windows lit, and the river holds the whole sky. A man
// fishes from a wooden boat, a tug pushes a barge downstream, a heron waits
// in the shallows, a cat sits by the lantern on the jetty and the fireflies
// come out.
//
// Click the water for a jumping fish, the boat for the fisherman to land
// one, the reeds or the heron to send it flying, the sky for swallows. The
// reeds sway when you brush past them.
// Easter eggs:
// - bread: the window with a kid's head in it. He leans out and wails; the
//   shout rings out over the whole river, the birds scatter, and a woman
//   comes running back along the embankment with a loaf and pulls him back
//   in.
// - toys: the toy box on a balcony. A winged space toy loops right round the
//   sky and into one kid's arms; a cowboy doll lands with the other, who
//   stands there with his arms folded.
// - cat: the cat on the jetty pounces at a firefly, and a whole cloud of
//   them bursts out of the reeds and over the river.

import { type Frame, lerpRGB, type RGB, sprite } from '../frame';
import { Fx } from '../fx';
import { fbm1, hash2 } from '../noise';
import { clouds, glow, gradient, lightPath } from '../paint';
import { type EggSpot, layer, palette, type Scene } from '../scene';

const P = palette({
  sky0: '#191a45',
  sky1: '#25275e',
  sky2: '#372f72',
  sky3: '#543985',
  sky4: '#7b458d',
  sky5: '#a6518c',
  sky6: '#cd6284',
  sky7: '#e97b78',
  sky8: '#f59c6e',
  sky9: '#f9bd72',
  glow: '#ffd890',
  star: '#bdb8ea',
  starHi: '#fff6e0',
  moon: '#fff2d2',
  moonSh: '#d8b6b0',
  cloudLight: '#ffbf8c',
  cloudBase: '#c4667e',
  cloudShadow: '#7a4476',
  // town on the high bank
  town: '#3b2d5c',
  townEdge: '#64416e',
  townDark: '#2c2349',
  tree: '#2c2a4c',
  treeEdge: '#4c3a62',
  win: '#ffcf78',
  winHi: '#ffeab2',
  // church
  wall: '#9a84a8',
  wallLit: '#e6bcac',
  wallSh: '#6a5888',
  dome: '#eab25c',
  domeHi: '#fff0b4',
  domeSh: '#9a5c3e',
  // ramparts
  crest: '#d2aa70',
  grassLit: '#8e7c56',
  grass: '#5a624a',
  grassSh: '#3e4652',
  grassDark: '#2f3446',
  ledge: '#6e7454',
  path: '#86706a',
  bush: '#2c3044',
  bushLit: '#6e6452',
  brick: '#a05648',
  brickLit: '#c8705a',
  brickSh: '#6e3a46',
  stone: '#e2c0a4',
  door: '#2a1c2e',
  lamp: '#ffc86a',
  lampHi: '#fff2c4',
  shore: '#4a3a52',
  shoreHi: '#6e5260',
  // river
  water: '#2e2a58',
  ripple: '#8a6a9c',
  rippleHi: '#c890a0',
  glint: '#ffd49a',
  mist: '#b48aaa',
  // tug and barge
  tug: '#2a2440',
  tugHi: '#6a4a68',
  cabin: '#c8a0a0',
  red: '#ff5a4a',
  green: '#6aff9a',
  white: '#fff8e8',
  // near bank
  bank: '#1a1630',
  bankHi: '#2a2242',
  reed: '#221d38',
  reed2: '#2e2744',
  reedRim: '#83525e',
  cattail: '#4a2c34',
  willow: '#1d2138',
  willow2: '#262c46',
  willowRim: '#6e5470',
  bark: '#2a2236',
  plank: '#523e4c',
  plankLit: '#9a6452',
  plankGap: '#251e33',
  cat: '#15121f',
  catRim: '#a8685a',
  bucket: '#4c5a78',
  // boat and fisherman
  hull: '#2e4c62',
  hullSh: '#203448',
  rim: '#e0a274',
  man: '#1e1a2c',
  shirt: '#4a5a8a',
  cap: '#5a3a40',
  face: '#b07a6a',
  rod: '#16121e',
  float: '#ff6a4a',
  // heron
  heron: '#8c8aa8',
  heronSh: '#5c5a7a',
  heronHi: '#d4d0e2',
  heronDark: '#211d2c',
  beak: '#e6a650',
  // fish, fireflies, swallows
  fish: '#e2e6f4',
  fishSh: '#8a90b4',
  firefly: '#f4ffa6',
  fireGlow: '#c8ec72',
  swallow: '#15132a',
  // the block of flats
  panel: '#4c3f6c',
  panelSh: '#3c3159',
  panelLit: '#8c6c8c',
  balc: '#5c4e7c',
  balcLit: '#a8808e',
  glass: '#29223f',
  glassHi: '#4e4472',
  frameLit: '#c88a5a',
  curtain: '#ff9f5c',
  tv: '#8cb4ff',
  stair: '#d6dca6',
  // people: two kids with light brown hair, a young woman with dark brown
  // hair; backlit, just a silhouette
  hair: '#b07c4a',
  womanHair: '#3a2420',
  sil: '#33263a',
  skin: '#e8a47c',
  kidTop: '#4a7ad0',
  kid2Top: '#f06a3c',
  kid2Hair: '#c08c58',
  coat: '#e04c58',
  coatSh: '#a03450',
  legs: '#2a2234',
  loaf: '#d8964a',
  loafHi: '#ffd890',
  tear: '#a8e0ff',
  heart: '#ff6a8c',
  shout: '#fff0d4',
  dust: '#b89aa0',
  // the toys
  toyW: '#f6f4ff',
  toyG: '#5ade6e',
  toyP: '#a874ec',
  box: '#e8483c',
  boxLid: '#ffd44a',
  hat: '#9a6236',
  hatHi: '#c88c52',
  dollTop: '#f2d24a',
  dollLegs: '#3a66c0',
  grump: '#3a3448',
});

const HORIZON = 93; // the far bank's waterline
const CREST = 76; // top of the curtain wall
const BTOP = 71; // top of a bastion
const NEAR = 136; // roughly where our bank begins
const JETTY_Y = 124; // the far end of the jetty

type Pt = [number, number];

// heron standing, facing left: alert, then hunched; in flight, wings up and down
const HERON = [
  '..hhh.......',
  'bbhhkkk.....',
  '...hh..k....',
  '...hw.......',
  '....hw......',
  '....hw......',
  '...hw.......',
  '...hww......',
  '..hgggggg...',
  '..ggggggggg.',
  '..kgggggSSSS',
  '...gggSSSSS.',
  '....SSSSS...',
  '.....l.l....',
  '.....l.l....',
  '.....l.l....',
  '.....l.l....',
];
const HERON_HUNCH = [
  '............',
  '............',
  '............',
  '..hhh.......',
  'bbhhkkk.....',
  '...hh..k....',
  '...hw.......',
  '...hww......',
  '..hgggggg...',
  '..ggggggggg.',
  '..kgggggSSSS',
  '...gggSSSSS.',
  '....SSSSS...',
  '.....l.l....',
  '.....l.l....',
  '.....l.l....',
  '.....l.l....',
];
const HERON_FLY = [
  [
    '.........kkk......',
    '........kgggS.....',
    '.......kgggS......',
    'bbhhh..ggggS......',
    '...hhgggggggggllll',
    '......SSSS........',
  ],
  [
    '..................',
    '..................',
    '..................',
    'bbhhh.............',
    '...hhgggggggggllll',
    '......gggggggS....',
    '.......kgggggS....',
    '........kkkgS.....',
  ],
];
const SWALLOW = [
  ['k...k', '.k.k.', '..k..'],
  ['.....', 'kkkkk', '..k..'],
];

// People, from the front, no faces. h hair  s skin  b top  t tears
// m open mouth  a arm  r second kid's top  H second kid's hair
// A kid leaning right out of the window, wailing: arms up, arms out.
const WAIL = [
  [
    'a......a',
    'a..hh..a',
    '.ahhhha.',
    '..tsst..',
    '..smms..',
    '.bbbbbb.',
    'bbbbbbbb',
  ],
  [
    '........',
    '...hh...',
    '.ahhhha.',
    'a.tsst.a',
    '..smms..',
    '.bbbbbb.',
    'bbbbbbbb',
  ],
];
// A kid on the balcony: watching, reaching up, arms folded (grumpy).
const KID_WATCH = ['.hhh.', '.sss.', 'bbbbb', 'bbbbb', 'bbbbb'];
const KID_REACH = ['ahhha', 'asssa', 'bbbbb', 'bbbbb', 'bbbbb'];
const KID_FOLD = ['.hhh.', '.sss.', 'bbbbb', 'bsssb', 'bbbbb'];
// The second kid: waiting, and jumping for joy with the toy held up.
const KID2 = ['.HHH.', '.sss.', 'arrra', '.rrr.'];
const KID2_JOY = ['a...a', 'aHHHa', '.sss.', '.rrr.', '.rrr.', '.r.r.'];
// A woman running back with a loaf, facing left. l loaf  L loaf lit
// c coat  C coat shade  k legs
const WOMAN_RUN = [
  [
    'L......',
    'lL.hhh.',
    '.s.shhh',
    '..scch.',
    '..cccC.',
    '.ccccC.',
    '.k...k.',
    'k.....k',
  ],
  [
    'L......',
    'lL.hhh.',
    '.s.shh.',
    '..scchh',
    '..cccC.',
    '..cccC.',
    '...kk..',
    '...k.k.',
  ],
];
// The winged space toy, wings out: big, closer, and in a child's hands.
// w white  G green  P purple  s skin
const SPACE_TOY = [
  [
    '...PPP...',
    '...PsP...',
    'wwwwGwwww',
    '.GwwGwwG.',
    '...wGw...',
    '...P.P...',
    '...w.w...',
  ],
  ['.PPP.', 'wwGww', '.wGw.', '.P.P.'],
  ['.P.', 'wGw', '.w.'],
];
// The cowboy doll: big hat, yellow shirt, blue jeans. H hat  E hat lit
const DOLL = ['.EH.', 'HHHHH', '.ss.', 'yyyy', '.jj.', '.j.j'];
const DOLL_HELD = ['EH.....', 'HHsyyjj', 'H......'];
const HEART = ['.r.r.', 'rrrrr', '.rrr.', '..r..'];
const BIG_HEART = [
  '.rr.rr.',
  'rWrrrrr',
  'rrrrrrr',
  '.rrrrr.',
  '..rrr..',
  '...r...',
];
// The cat on the jetty: sitting, turned to you, crouched, pouncing.
const CAT_SIT = ['k.k..', 'kkk..', 'kkkr.', 'kkkkr', 'kkkkr', 'kkkk.'];
const CAT_LOOK = ['.k.k.', '.kkkr', 'kkkkr', 'kkkkr', 'kkkkr', 'kkkk.'];
const CAT_CROUCH = ['k.k..', 'kkkkr', 'kkkkr', 'kkkkk'];
const CAT_LEAP = [
  'k...k',
  'kk.kk',
  '.kkkr',
  '.kkkr',
  '.kkkr',
  '..kk.',
  '.k..k',
];

/** Copies the opaque pixels of `src` inside a box: cheaper than a full-frame over(). */
function blit(
  f: Frame,
  src: Frame,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  const w = f.w;
  for (let y = Math.max(0, y0); y < Math.min(f.h, y1); y++) {
    const row = y * w;
    for (let x = Math.max(0, x0); x < Math.min(w, x1); x++) {
      const p = src.pixels[row + x]!;
      if (p >>> 24) f.pixels[row + x] = p;
    }
  }
}

const heronXFor = (w: number, cx: number) =>
  Math.round(Math.min(w - 14, cx + Math.min(150, w * 0.36)));

export const azov: Scene = {
  id: 'azov',
  name: 'Azov',
  country: 'Russia',
  create(w, h) {
    const fx = new Fx();
    const cx = Math.round(w / 2);
    const sunX = Math.round(cx + Math.min(130, w * 0.32));
    const moonX = sunX - Math.min(80, w * 0.2);
    const churchX = Math.round(cx - Math.min(74, w * 0.19));
    const magX = Math.round(cx - Math.min(14, w * 0.04));
    const bastions = [
      Math.round(cx - Math.min(122, w * 0.31)),
      Math.round(cx + Math.min(84, w * 0.22)),
    ];
    for (let b = bastions[0]! - 210; b > -40; b -= 210) bastions.push(b);
    for (let b = bastions[1]! + 210; b < w + 40; b += 210) bastions.push(b);
    const lamps = [
      magX + 13,
      cx + Math.min(150, w * 0.36),
      cx - Math.min(170, w * 0.42),
    ].filter((x) => x > 4 && x < w - 4);

    // ---------- sky ----------
    const sky = layer(w, h, (f) => {
      gradient(f, 0, HORIZON, [
        P.sky0,
        P.sky1,
        P.sky2,
        P.sky3,
        P.sky4,
        P.sky5,
        P.sky6,
        P.sky7,
        P.sky8,
        P.sky9,
      ]);
      glow(f, sunX, HORIZON, Math.min(150, w * 0.4), P.glow, 0.55, 0.42, 0.1);
      sprite(
        f,
        ['.mm..', '..mM.', '...mM', '...mM', '...mM', '..mM.', '.mm..'],
        moonX,
        20,
        { m: P.moon, M: P.moonSh }
      );
    });
    // (none of them in front of the moon)
    const starList = Array.from({ length: Math.round(w / 9) }, (_, i) => ({
      x: Math.floor(hash2(i, 1, 13) * w),
      y: Math.floor(hash2(i, 2, 13) ** 1.6 * 46),
      ph: hash2(i, 3, 13) * 6.28,
      big: hash2(i, 4, 13) > 0.93,
    })).filter(
      (s) => !(Math.abs(s.x - moonX - 2) < 5 && Math.abs(s.y - 23) < 6)
    );
    const cloudLayer = layer(w, h, (f) => {
      clouds(f, {
        seed: 58,
        y0: 36,
        y1: 66,
        cell: 5,
        coverage: 0.3,
        stretch: 6,
        litFromBelow: true,
        style: {
          light: P.cloudLight,
          base: P.cloudBase,
          shadow: P.cloudShadow,
        },
      });
    });

    // ---------- the far bank: town, church, ramparts, magazine ----------
    const crestTop = Array.from(
      { length: w },
      (_, x) => CREST + Math.round((fbm1(x / 30, 8) - 0.5) * 2)
    );
    // the block of flats on the high bank, between the magazine and the
    // right-hand bastion: five floors of panels, a column of balconies, a
    // stairwell, TV aerials on the flat roof. Its foot is behind the rampart.
    const FLOOR = 8;
    const BLK_TOP = 36; // the roof's edge
    const floorY = (k: number) => BLK_TOP + 2 + k * FLOOR; // k = 0 at the top
    const cols = w >= 240 ? 6 : 5;
    const blkW = cols * 7 + 4;
    const blkR = bastions[1]! - 13;
    const blkL = blkR - blkW + 1;
    const cellX = (c: number) => blkL + 2 + c * 7;
    const kinds = cols === 6 ? 'wbwsbb' : 'wbsbb';
    const kidCol = cols - 1;
    const kid2Col = cols - 2;
    const TOY_FLOOR = 3;
    const railY = floorY(TOY_FLOOR) + 5; // top of the balcony rail
    // the window the kid wails out of (top-left lit window, second floor down)
    const bwx0 = cellX(0) + 1;
    const bwy0 = floorY(1) + 2;
    const breadSpot = [bwx0 + 2, bwy0 + 1] as const;
    // the toy box on the balcony, at the rail's right end
    const boxX = cellX(kidCol) + 4;
    const toysSpot = [boxX + 1, railY - 2] as const;
    const EGG_R = 7;
    type Win = { x: number; y: number; seed: number; kind: string };
    const flats: Win[] = [];
    for (let c = 0; c < cols; c++)
      for (let k = 0; k < 5; k++) {
        const seed = c * 9 + k;
        const kind = k === 4 ? 'w' : kinds[c]!;
        if (kind === 's') {
          if (k < 4)
            flats.push({ x: cellX(c) + 3, y: floorY(k) + 5, seed, kind });
        } else if (kind === 'b') {
          flats.push({ x: cellX(c) + 1, y: floorY(k) + 1, seed, kind });
        } else {
          flats.push({ x: cellX(c) + 1, y: floorY(k) + 2, seed, kind });
        }
      }
    function block(f: Frame) {
      const top = BLK_TOP;
      const bot = CREST + 3;
      f.rect(blkL, top, blkW, bot - top, P.panel);
      // the roof: a lit parapet, a lift room, aerials
      f.hline(blkL - 1, blkR + 1, top, P.panelLit);
      f.hline(blkL - 1, blkR + 1, top + 1, P.panelSh);
      const lift = blkL + Math.round(blkW * 0.42);
      f.rect(lift, top - 3, 6, 3, P.panel);
      f.hline(lift, lift + 5, top - 3, P.panelLit);
      f.vline(lift + 5, top - 3, top - 1, P.panelLit);
      for (const ax of [blkL + 4, blkR - 6, lift - 6]) {
        f.vline(ax, top - 7, top - 1, P.townDark);
        f.hline(ax - 2, ax + 2, top - 6, P.townDark);
        f.hline(ax - 1, ax + 1, top - 4, P.townDark);
      }
      // panel seams between the floors, and the sunset on the end wall
      for (let k = 1; k < 5; k++) f.hline(blkL, blkR, floorY(k), P.panelSh);
      for (let c = 1; c < cols; c++)
        if (kinds[c] === 's' || kinds[c - 1] === 's')
          f.vline(cellX(c), top + 2, bot, P.panelSh);
      f.vline(blkR, top, bot, P.panelLit);
      // windows dark for now (render lights them), balcony rails in front
      for (const wn of flats) {
        if (wn.kind === 's') f.rect(wn.x, wn.y, 2, 2, P.glass);
        else if (wn.kind === 'b') {
          // a balcony: door and window behind a rail
          f.rect(wn.x, wn.y, 2, 4, P.glass);
          f.rect(wn.x + 2, wn.y + 1, 3, 3, P.glass);
          f.hline(wn.x - 1, wn.x + 5, wn.y - 1, P.panelSh);
        } else {
          f.rect(wn.x, wn.y, 5, 3, P.glass);
          f.set(wn.x + 4, wn.y, P.glassHi);
          f.hline(wn.x, wn.x + 4, wn.y + 3, P.panelSh);
        }
      }
      for (let c = 0; c < cols; c++) {
        if (kinds[c] !== 'b') continue;
        for (let k = 0; k < 4; k++) {
          const y = floorY(k) + 5;
          const x = cellX(c);
          f.rect(x, y, 7, 3, P.balc);
          f.hline(x, x + 6, y, P.balcLit);
          f.vline(x + 6, y, y + 2, P.balcLit);
          f.vline(x, y + 1, y + 2, P.panelSh);
        }
      }
    }

    const windows: { x: number; y: number; seed: number }[] = [];
    const land = layer(w, h, (f) => {
      // trees and roofs of the town on the high bank
      for (let x = -4; x < w + 4; x++) {
        const top = 70 - Math.round(fbm1(x / 16, 3) * 8);
        f.vline(x, top, CREST + 2, P.tree);
        if (fbm1((x + 1) / 16, 3) < fbm1(x / 16, 3) - 0.01)
          f.set(x, top, P.treeEdge);
      }
      // pyramidal poplars, the southern skyline
      for (let x = 6; x < w; x += 23 + Math.floor(hash2(x, 0, 4) * 30)) {
        if (Math.abs(x - churchX) < 16) continue;
        const ph = 15 + Math.floor(hash2(x, 1, 4) * 10);
        for (let k = 0; k < ph; k++) {
          const v = k / ph;
          const half = Math.round(
            2.3 * Math.sin(Math.min(1, (1 - v) * 1.25) * (Math.PI / 2)) ** 0.8
          );
          const y = 72 - k;
          f.hline(x - half, x + half, y, P.townDark);
          if (half) f.set(x + half, y, P.treeEdge);
          else f.set(x, y, P.treeEdge);
        }
      }
      // houses, and a couple of five-storey blocks with their windows
      for (let x = 0, i = 0; x < w; i++) {
        const r = (k: number) => hash2(i, k, 9);
        const block = r(1) > 0.82;
        const bw = block
          ? 26 + Math.floor(r(2) * 10)
          : 7 + Math.floor(r(2) * 6);
        const top = block
          ? 62 + Math.floor(r(3) * 3)
          : 68 + Math.floor(r(3) * 4);
        if (Math.abs(x + bw / 2 - churchX) < 18 + bw / 2) {
          x += bw + 3;
          continue;
        }
        if (r(4) > 0.35 || block) {
          f.rect(x, top, bw, CREST + 2 - top, P.town);
          f.vline(x + bw - 1, top, CREST + 1, P.townEdge);
          if (!block) {
            // pitched roof, lit on the sunset side
            for (let k = 1; k <= Math.floor(bw / 2); k++) {
              f.hline(x + k - 1, x + bw - k, top - k, P.townDark);
              f.set(x + bw - k, top - k, P.townEdge);
            }
          } else {
            f.hline(x, x + bw - 1, top, P.townEdge);
          }
          // a grid of windows centred on the front, two pixels in from each side
          const pitch = block ? 2 : 3;
          const cols = Math.floor((bw - 5) / pitch) + 1;
          const wx0 = x + Math.floor((bw - (cols - 1) * pitch - 1) / 2);
          for (let wy = top + 2; wy < CREST - 1; wy += pitch)
            for (let c = 0; c < cols; c++) {
              const wx = wx0 + c * pitch;
              if (hash2(wx, wy, 5) < (block ? 0.32 : 0.25))
                windows.push({ x: wx, y: wy, seed: windows.length });
            }
        }
        x += bw + 2 + Math.floor(r(5) * 8);
      }
      block(f);
      church(f, churchX, CREST + 3);
      // the ramparts: a long grassy curtain...
      for (let x = 0; x < w; x++) {
        const top = crestTop[x]!;
        for (let y = top; y < HORIZON; y++) {
          let c = P.grass;
          if (y === top) c = P.crest;
          else if (y < top + 3) c = P.grassLit;
          else if (y === 84) c = P.ledge;
          else if (y === 85) c = P.grassSh;
          else if (y > HORIZON - 5) c = P.grassSh;
          f.set(x, y, c);
        }
      }
      // ...with the bastions jutting out of it, one face in the light
      for (const b of bastions) bastion(f, b);
      // bushes and small trees along the curtain crest
      for (let x = 10; x < w; x += 19 + Math.floor(hash2(x, 3, 6) * 20)) {
        if (
          bastions.some((b) => Math.abs(x - b) < 30) ||
          Math.abs(x - magX) < 14
        )
          continue;
        const r = 2 + Math.floor(hash2(x, 4, 6) * 2);
        f.disc(x, CREST - r + 1, r, (dx, dy) =>
          dx - dy > r * 0.6 ? P.bushLit : P.bush
        );
      }
      magazine(f, magX);
      // keep only the windows still in sight, not under a bastion or a bush
      const seen = windows.filter((wn) => f.get(wn.x, wn.y) === P.town);
      windows.splice(0, windows.length, ...seen);
      // the far bank: a strip of sand, moored boats, a little jetty
      for (let x = 0; x < w; x++) {
        f.set(x, HORIZON - 2, P.shoreHi);
        f.set(x, HORIZON - 1, P.shore);
      }
      for (let x = 12; x < w; x += 47 + Math.floor(hash2(x, 7, 2) * 40)) {
        if (Math.abs(x - magX) < 20) continue;
        f.hline(x, x + 6, HORIZON - 1, P.hullSh);
        f.hline(x + 1, x + 5, HORIZON, P.tug);
        f.set(x + 6, HORIZON - 2, P.rim);
      }
      f.hline(magX - 5, magX + 5, HORIZON - 1, P.path);
      f.vline(magX - 4, HORIZON - 1, HORIZON + 1, P.tug);
      f.vline(magX + 4, HORIZON - 1, HORIZON + 1, P.tug);
      // lamps along the embankment
      for (const lx of lamps) {
        f.vline(lx, HORIZON - 11, HORIZON - 2, P.tug);
        f.rect(lx - 1, HORIZON - 13, 3, 2, P.lampHi);
        f.set(lx, HORIZON - 14, P.tug);
        glow(f, lx, HORIZON - 12, 9, P.lamp, 0.45, 1, 0.12);
      }
    });

    function bastion(f: Frame, b: number) {
      const hw = 14;
      const fw = 30;
      // the face turned away from the glow, in shade
      f.poly(
        [
          [b - hw, BTOP],
          [b + 1, BTOP],
          [b + 1, HORIZON + 1],
          [b - fw, HORIZON + 1],
        ],
        (_, y) => (y < BTOP + 3 ? P.grass : y === 82 ? P.grassDark : P.grassSh)
      );
      // the face turned towards it, warm
      f.poly(
        [
          [b + 1, BTOP],
          [b + hw, BTOP],
          [b + fw, HORIZON + 1],
          [b + 1, HORIZON + 1],
        ],
        (_, y) => (y < BTOP + 3 ? P.crest : y === 82 ? P.grass : P.grassLit)
      );
      // a soft grassy lip along the top, and the seam where the faces meet
      f.hline(b - hw + 2, b + hw - 2, BTOP - 1, P.grass);
      f.hline(b + 1, b + hw - 2, BTOP - 1, P.grassLit);
      f.vline(b + 1, BTOP + 3, HORIZON - 1, P.ledge);
      // a path climbing the lit face
      f.line(b + fw - 4, HORIZON - 1, b + 7, BTOP + 3, P.path);
      // trees on top, rim-lit from the right
      for (const [k, r] of [
        [-8, 4],
        [5, 3],
      ] as const) {
        const tx = b + k;
        f.disc(tx, BTOP - 1 - r, r, (dx, dy) =>
          dx - dy * 0.4 > r * 0.55 ? P.bushLit : P.bush
        );
        f.vline(tx, BTOP - 1, BTOP, P.bush);
      }
    }

    function church(f: Frame, x: number, b: number) {
      // nave: lit on the sunset side
      f.rect(x - 7, b - 15, 15, 15, P.wall);
      f.rect(x + 3, b - 15, 5, 15, P.wallLit);
      f.hline(x - 7, x + 7, b - 15, P.wallSh);
      // a low roof, solid down to the eaves
      for (let k = -8; k <= 8; k++)
        f.vline(
          x + k,
          Math.floor(b - 16 - Math.max(0, 3 - Math.abs(k) / 2.5)),
          b - 16,
          P.wallSh
        );
      f.rect(x - 4, b - 11, 2, 4, P.win);
      f.rect(x + 3, b - 11, 2, 4, P.win);
      // drum and onion dome, the dome sitting right on the drum
      f.rect(x - 2, b - 24, 5, 6, P.wall);
      f.vline(x + 2, b - 24, b - 19, P.wallLit);
      f.set(x, b - 21, P.wallSh);
      const dome = [
        [0, 0],
        [-1, 1],
        [-2, 2],
        [-3, 3],
        [-3, 3],
        [-3, 3],
        [-2, 2],
      ] as const;
      dome.forEach(([a, z], i) => {
        const y = b - 31 + i;
        for (let dx = a; dx <= z; dx++)
          f.set(
            x + dx,
            y,
            dx >= 1 ? (i < 4 ? P.domeHi : P.dome) : dx === 0 ? P.dome : P.domeSh
          );
      });
      f.vline(x, b - 36, b - 32, P.domeSh);
      f.hline(x - 1, x + 1, b - 35, P.domeSh);
      // bell tower with a little spire
      const t = x - 12;
      f.rect(t - 2, b - 24, 5, 24, P.wall);
      f.vline(t + 2, b - 24, b - 1, P.wallLit);
      f.rect(t - 1, b - 21, 2, 3, P.door);
      for (let k = 0; k < 6; k++)
        f.hline(
          t - Math.floor((6 - k) / 3),
          t + Math.floor((6 - k) / 3),
          b - 25 - k,
          k > 3 ? P.domeHi : P.dome
        );
      f.set(t + 1, b - 26, P.domeHi);
      f.vline(t, b - 33, b - 31, P.domeSh);
    }

    function magazine(f: Frame, x: number) {
      // the old powder magazine: a brick vault dug into the foot of the
      // rampart, turf over its roof, a stone arch round the door
      const b = HORIZON - 3;
      for (let dx = -17; dx <= 17; dx++) {
        const top = b - 15 - Math.round((1 - (dx / 17) ** 2) * 3);
        f.vline(x + dx, top, b - 8, dx > 2 ? P.grassLit : P.grass);
        f.set(x + dx, top, P.crest);
      }
      const R = 11;
      for (let dx = -R; dx <= R; dx++) {
        const top =
          b - 6 - Math.round(Math.sqrt(1 - (dx / (R + 0.5)) ** 2) * 6);
        f.vline(x + dx, top, b, dx > 4 ? P.brickLit : P.brick);
        f.set(x + dx, top, P.stone);
        if (Math.abs(dx) < R)
          f.set(x + dx, top + 1, dx > 4 ? P.brick : P.brickSh);
      }
      for (let y = b - 4; y <= b; y += 2) f.hline(x - R, x + R, y, P.brickSh);
      f.vline(x - R, b - 6, b, P.brickSh);
      // arched door in a stone frame, two small vents
      f.rect(x - 3, b - 7, 7, 8, P.stone);
      f.rect(x - 2, b - 6, 5, 7, P.door);
      f.set(x - 3, b - 7, P.brick);
      f.set(x + 3, b - 7, P.brick);
      f.set(x - 2, b - 6, P.stone);
      f.set(x + 2, b - 6, P.stone);
      for (const wx of [x - 8, x + 7]) {
        f.rect(wx, b - 5, 2, 2, P.door);
        f.hline(wx, wx + 1, b - 6, P.stone);
      }
      // lamp by the door, its light on the path
      f.rect(x + 5, b - 6, 1, 2, P.lampHi);
      glow(f, x + 5, b - 5, 10, P.lamp, 0.5, 1, 0.12);
      for (let dx = -4; dx <= 8; dx++) f.blend(x + dx, b + 1, P.lamp, 0.25);
    }

    // what stands in front of the people walking on the curtain's crest
    const cover = layer(w, h, (f) => {
      for (const b of bastions) bastion(f, b);
      magazine(f, magX);
    });

    // the river: everything above, mirrored and darkened, ready to wobble
    const base = layer(w, h, (f) => {
      f.copyFrom(sky);
      f.over(land);
    });
    const mirror = layer(w, h, (f) => {
      for (let y = HORIZON; y < h; y++) {
        const d = y - HORIZON;
        const sy = HORIZON - 1 - d;
        const fade = 0.62 * (1 - d / (h - HORIZON + 20));
        for (let x = 0; x < w; x++) {
          const src = sy >= 0 ? base.get(x, sy) : P.sky0;
          f.set(x, y, lerpRGB(P.water, src, d % 4 === 3 ? fade * 0.75 : fade));
        }
      }
    });

    // ---------- the near bank ----------
    const bankTop = Array.from(
      { length: w },
      (_, x) =>
        NEAR +
        Math.round((fbm1(x / 22, 17) - 0.5) * 6) +
        (Math.abs(x - cx) < w * 0.22 ? 3 : 0)
    );
    const willowX = Math.round(Math.min(34, w * 0.09));
    type Stalk = {
      x: number;
      base: number;
      ht: number;
      ph: number;
      c: RGB;
      cat: boolean;
      leaf: number;
    };
    const stalks: Stalk[] = [];
    const leftEnd = Math.round(cx - Math.min(110, w * 0.27));
    const rightStart = Math.round(cx + Math.min(118, w * 0.29));
    for (let i = 0; i < w * 0.55; i++) {
      const left = hash2(i, 5, 3) < 0.5;
      const x = left
        ? Math.floor(hash2(i, 0, 3) * leftEnd)
        : rightStart + Math.floor(hash2(i, 0, 3) * (w - rightStart));
      const edgeD = left
        ? (leftEnd - x) / Math.max(1, leftEnd)
        : (x - rightStart) / Math.max(1, w - rightStart);
      const ht = Math.round(
        (9 + hash2(i, 1, 3) * 22) * (0.45 + Math.min(1, edgeD * 1.6) * 0.55)
      );
      if (Math.abs(x - heronXFor(w, cx)) < 9 && ht > 6) continue;
      stalks.push({
        x,
        base: bankTop[Math.min(w - 1, Math.max(0, x))]! + 3,
        ht,
        ph: hash2(i, 6, 3) * 6.28,
        c: hash2(i, 2, 3) > 0.5 ? P.reed : P.reed2,
        cat: hash2(i, 4, 3) > 0.8 && ht > 14,
        leaf: hash2(i, 7, 3) > 0.6 ? (hash2(i, 8, 3) > 0.5 ? 1 : -1) : 0,
      });
    }
    stalks.sort((a, b) => b.ht - a.ht);
    // the willow: a dome of leaves with curtains hanging almost to the water
    const WRX = 31;
    const WCY = 54;
    const willowTop = (dx: number) =>
      WCY -
      Math.round(
        17 * Math.sqrt(Math.max(0, 1 - (dx / WRX) ** 2)) +
          (fbm1(dx / 5 + 9, 12) - 0.5) * 6
      );
    const tresses = Array.from({ length: 21 }, (_, i) => {
      const dx = -WRX + 1 + i * 3 + Math.round((hash2(i, 1, 21) - 0.5) * 2);
      const a = Math.abs(dx) / WRX;
      return {
        dx,
        top: willowTop(dx) + 3 + Math.round(a * 3),
        len: Math.round(50 + (1 - a * a) * 18 + hash2(i, 3, 21) * 14 - a * 16),
        ph: hash2(i, 4, 21) * 6.28,
        wide: hash2(i, 5, 21) > 0.35 ? 2 : 3,
      };
    });
    const bankMin = Math.min(...bankTop);
    const jettyX = Math.round(cx - Math.min(42, w * 0.11));
    const nearBank = layer(w, h, (f) => {
      for (let x = 0; x < w; x++) {
        f.vline(x, bankTop[x]!, h - 1, P.bank);
        f.set(x, bankTop[x]!, P.bankHi);
      }
      // trunk leaning out over the water, two limbs up into the crown
      for (let y = WCY; y < h; y++) {
        const v = (h - y) / (h - WCY);
        const tx = willowX - 6 + Math.round(v * v * 9);
        const thick = Math.round(2 + (1 - v) * 3);
        f.hline(tx - thick, tx + thick, y, P.bark);
        if (y < 118) f.set(tx + thick, y, P.willowRim);
      }
      f.line(willowX + 2, 70, willowX + 16, 50, P.bark);
      f.line(willowX - 2, 74, willowX - 14, 54, P.bark);
      // the dome of the crown, its rounded top catching the glow
      for (let dx = -WRX; dx <= WRX; dx++) {
        const top = willowTop(dx);
        for (let y = top; y <= WCY + 4; y++) {
          const nx = dx / WRX;
          const ny = (y - WCY) / 17;
          let c = P.willow;
          if (y - top < 2 && nx > -0.3) c = P.willowRim;
          else if (y - top < 1) c = P.willow2;
          else if (nx * 0.7 - ny * 0.7 > 0.55) c = P.willow2;
          f.set(willowX + dx, y, c);
        }
      }
      // a little wooden jetty running out from our bank
      for (let y = JETTY_Y; y < h; y++) {
        const v = (y - JETTY_Y) / (h - JETTY_Y);
        const c0 = jettyX - v * 6;
        const half = 5.5 + v * 6;
        const x0 = Math.round(c0 - half);
        const x1 = Math.round(c0 + half);
        const gap = [3, 7, 12, 18, 25].includes(y - JETTY_Y);
        f.hline(x0, x1, y, gap ? P.plankGap : P.plank);
        if (!gap) f.hline(Math.round(c0 + half * 0.3), x1, y, P.plankLit);
        f.set(x0, y, P.plankGap);
      }
      f.hline(jettyX - 6, jettyX + 6, JETTY_Y, P.plankLit);
      f.hline(jettyX - 6, jettyX + 6, JETTY_Y + 1, P.plankGap);
      for (const px of [jettyX - 5, jettyX + 5]) {
        f.vline(px, JETTY_Y - 4, JETTY_Y + 4, P.plankGap);
        f.set(px + 1, JETTY_Y - 4, P.plankLit);
      }
      // a bucket for the catch
      f.rect(jettyX - 6, JETTY_Y + 3, 3, 3, P.bucket);
      f.hline(jettyX - 6, jettyX - 4, JETTY_Y + 2, P.plankGap);
    });

    // ---------- moving things ----------
    const mistMask = Array.from(
      { length: w * 2 },
      (_, x) => fbm1(x / 40, 77) > 0.45
    );
    const fireflies = Array.from(
      { length: Math.max(8, Math.round(w / 26)) },
      (_, i) => {
        const left = i % 3 !== 0;
        return {
          x: left
            ? hash2(i, 1, 31) * (leftEnd + 30)
            : rightStart - 20 + hash2(i, 1, 31) * (w - rightStart + 20),
          y: 104 + hash2(i, 2, 31) * 40,
          ph: hash2(i, 3, 31) * 6.28,
        };
      }
    );
    const boatX = Math.round(cx + Math.min(22, w * 0.06));
    const BOAT_Y = 115;
    const heronX = heronXFor(w, cx);
    const heronY = bankTop[heronX]! - 5;
    let heronFlew = -Infinity;
    let catAt = -Infinity;
    const walkers = Math.max(2, Math.round(w / 140));
    let catchAt = -Infinity;
    let lastT = 0;

    function swallows(t: number, x: number, y: number, seed: number) {
      fx.add(t, 3200, (f, age) => {
        const a = age / 1000;
        for (let i = 0; i < 5; i++) {
          const dir = hash2(i, 1, seed) > 0.5 ? 1 : -1;
          const sp = 55 + hash2(i, 2, seed) * 40;
          const sx = x + dir * sp * a + Math.sin(a * 4 + i) * 6;
          const sy =
            y +
            Math.sin(a * 3.2 + i * 1.7) * 14 * Math.min(1, a * 2) +
            (hash2(i, 3, seed) - 0.5) * a * 30;
          sprite(f, SWALLOW[Math.floor(age / 80 + i) % 2]!, sx - 2, sy - 1, {
            k: P.swallow,
          });
        }
      });
    }

    function rings(
      f: Frame,
      age: number,
      x: number,
      y: number,
      n: number,
      size: number,
      c: RGB
    ) {
      for (let k = 0; k < n; k++) {
        const p = (age - k * 220) / 1100;
        if (p < 0 || p > 1) continue;
        const r = 1 + p * size;
        const steps = Math.ceil(r * 5);
        for (let s = 0; s < steps; s++) {
          const ang = (s / steps) * Math.PI * 2;
          f.blend(
            x + Math.cos(ang) * r,
            y + Math.sin(ang) * r * 0.3,
            c,
            (1 - p) * 0.7
          );
        }
      }
    }

    /** A fish leaping out of the water at (x, y): `age` ms since it broke the surface. */
    function fish(f: Frame, age: number, x: number, y: number, seed: number) {
      const dir = hash2(seed, 1, 3) > 0.5 ? 1 : -1;
      const lx = x + dir * 10;
      rings(f, age, x, y, 2, 7, P.rippleHi);
      rings(f, age - 650, lx, y, 3, 11, P.rippleHi);
      if (age < 700) {
        const p = age / 700;
        const hx = Math.round(x + dir * p * 10);
        const hy = Math.round(y - Math.sin(p * Math.PI) * 8);
        const tilt = p < 0.35 ? 1 : p > 0.65 ? -1 : 0;
        // nose, body, tail fin, glinting in the glow
        f.set(hx + dir * 2, hy - tilt * 2, P.fishSh);
        f.set(hx + dir, hy - tilt, P.fish);
        f.set(hx, hy, P.fish);
        f.set(hx, hy + 1, P.fishSh);
        f.set(hx - dir, hy + tilt, P.fish);
        f.set(hx - dir * 2, hy + tilt * 2, P.fishSh);
        f.set(hx - dir * 3, hy + tilt * 2 - 1, P.fishSh);
        f.set(hx - dir * 3, hy + tilt * 2 + 1, P.fishSh);
        if (p > 0.3 && p < 0.6) f.set(hx, hy - 1, P.glint);
        // drops trailing off it
        if (p > 0.15) f.set(hx - dir * 4, hy + 2 + tilt, P.white);
        if (p < 0.25) f.hline(x - 1, x + 1, y - 1, P.white);
      }
      if (age > 620 && age < 1120) {
        const q = (age - 620) / 500;
        for (let i = 0; i < 5; i++) {
          const dx = (hash2(i, 2, seed) - 0.5) * 8 * q;
          const dy = -Math.sin(q * Math.PI) * (2 + hash2(i, 3, seed) * 4);
          f.set(lx + dx, y + dy, P.white);
        }
      }
    }
    const FISH_EVERY = 4300;

    function tug(f: Frame, t: number) {
      // a tug pushing a barge downstream, right to left, very slowly
      const span = w + 120;
      const x = Math.round(w + 60 - ((t * 0.005) % span));
      const y = HORIZON + 5;
      // barge in front
      f.rect(x - 40, y - 2, 36, 3, P.tug);
      f.hline(x - 40, x - 5, y - 2, P.tugHi);
      f.set(x - 41, y - 1, P.tug);
      // tug: hull, two-tier cabin with lit windows, mast lights
      f.rect(x - 3, y - 3, 16, 4, P.tug);
      f.hline(x - 3, x + 12, y - 3, P.tugHi);
      f.rect(x + 2, y - 7, 8, 4, P.tug);
      f.rect(x + 4, y - 10, 5, 3, P.tug);
      f.hline(x + 3, x + 8, y - 6, P.win);
      f.hline(x + 5, x + 7, y - 9, P.winHi);
      f.vline(x + 6, y - 15, y - 11, P.tug);
      f.set(x + 6, y - 16, P.white);
      f.set(x - 40, y - 3, P.green);
      f.set(x + 1, y - 4, P.red);
      // reflections
      for (let k = 1; k < 7; k++) {
        const wob = Math.round(Math.sin(k * 1.3 + t / 300));
        f.blend(x + 3 + wob, y + 1 + k, P.win, 0.5 - k * 0.06);
        f.blend(x + 6 + wob, y + 1 + k, P.win, 0.4 - k * 0.05);
        if (k < 4) f.blend(x - 40 + wob, y + 1 + k, P.green, 0.3);
        f.blend(x + 6 - wob, y + 6 + k * 2, P.white, 0.25);
      }
    }

    function boat(f: Frame, t: number) {
      const x = boatX + Math.round(Math.sin(t / 7000) * 4);
      const y = BOAT_Y + (Math.sin(t / 1100) > 0.6 ? 1 : 0);
      const age = t - catchAt;
      // reflection first
      for (let k = 1; k < 6; k++) {
        const wob = Math.round(Math.sin(k * 1.7 + t / 350));
        for (let dx = 2; dx < 16; dx++)
          if ((dx + k) % 3)
            f.blend(x + dx + wob, y + k, P.hullSh, 0.55 - k * 0.08);
        f.blend(x + 1 + wob, y + k + 1, P.lamp, 0.5 - k * 0.07);
      }
      // hull: a wooden rowing boat, gunwale catching the glow
      f.hline(x + 3, x + 13, y, P.hullSh);
      f.hline(x + 1, x + 16, y - 1, P.hull);
      f.hline(x, x + 17, y - 2, P.hull);
      f.hline(x, x + 17, y - 3, P.rim);
      f.set(x + 18, y - 4, P.rim);
      f.set(x + 17, y - 4, P.rim);
      // stern lantern
      f.vline(x + 1, y - 6, y - 4, P.rod);
      f.set(x + 1, y - 7, P.lampHi);
      glow(f, x + 1, y - 7, 7, P.lamp, 0.45, 1, 0.12);
      // the fisherman, sitting, cap on
      // (a shout from across the river makes him jump out of his skin)
      const mx = x + 8;
      const jv = jolt(t, boatHit);
      const my = y - Math.round(jv * 3);
      f.rect(mx, my - 8, 3, 5, P.shirt);
      f.vline(mx + 2, my - 8, my - 4, P.man);
      f.rect(mx, my - 10, 3, 2, P.face);
      f.hline(mx - 1, mx + 2, my - 11 - Math.round(jv * 4), P.cap);
      f.set(mx + 3, my - 6, P.face);
      // rod and line; when clicked he strikes and lifts a fish out
      const bend =
        age < 600 ? age / 600 : age < 2200 ? 1 - (age - 600) / 1600 : 0;
      const lift =
        age >= 600 && age < 2400 ? Math.min(1, (age - 600) / 900) : 0;
      const tip: Pt = [
        mx + 15 - bend * 2 - lift * 4,
        y - 17 + bend * 4 - lift * 5,
      ];
      f.line(mx + 3, y - 6, tip[0], tip[1], P.rod);
      const floatX = mx + 19;
      const dip = age < 600 ? 1 : Math.sin(t / 900) > 0.92 ? 1 : 0;
      if (lift > 0) {
        const fyy = y + 1 - lift * (y + 1 - tip[1] - 6);
        const fxx = floatX + (tip[0] - floatX) * lift;
        f.line(tip[0], tip[1], fxx, fyy - 2, P.ripple);
        f.vline(
          Math.round(fxx),
          Math.round(fyy) - 1,
          Math.round(fyy) + 1,
          P.fish
        );
        f.set(Math.round(fxx) + 1, Math.round(fyy) + 1, P.fishSh);
        if (age < 1200)
          for (let k = 0; k < 4; k++)
            f.set(floatX - 2 + k * 1.4, y - ((age / 80 + k) % 3), P.white);
      } else {
        f.line(tip[0], tip[1], floatX, y - 1 + dip, P.ripple);
        f.set(floatX, y + dip, P.float);
        if (!dip) f.set(floatX, y + 1, P.white);
      }
    }

    const heronPal = {
      k: P.heronDark,
      h: P.heronHi,
      w: P.heron,
      b: P.beak,
      g: P.heron,
      S: P.heronSh,
      l: P.beak,
    };
    function heronStand(f: Frame, t: number) {
      // mostly still; now and then it hunches down, then stretches up again
      const hunch = Math.sin(t / 3700) > 0.55;
      for (let k = 1; k < 5; k++) {
        const wob = Math.round(Math.sin(k + t / 400) * 0.6);
        f.blend(heronX + wob, heronY + k, P.heron, 0.35 - k * 0.06);
        f.blend(heronX + 2 + wob, heronY + k, P.heron, 0.35 - k * 0.06);
      }
      const jv = jolt(t, heronHit);
      sprite(
        f,
        hunch && !jv ? HERON_HUNCH : HERON,
        heronX - 5,
        heronY - 16 - Math.round(jv * 4),
        heronPal
      );
      if (Math.sin(t / 1300) > 0.2)
        f.hline(heronX - 1, heronX + 3, heronY + 1, P.rippleHi);
    }

    function heronFlight(f: Frame, age: number) {
      // up and away to the left, out of sight; back in a long glide later
      const pal = heronPal;
      // (a frame can be stamped a moment before the click that set it off)
      if (age < 0) return false;
      if (age < 5000) {
        const a = age / 1000;
        const x = heronX - 16 * a - 10 * a * a;
        const y = heronY - 10 - 34 * a + 3 * a * a;
        sprite(f, HERON_FLY[Math.floor(age / 280) % 2]!, x - 9, y - 4, pal);
        return true;
      }
      if (age < 12_000) return false;
      if (age < 16_000) {
        const e = (age - 12_000) / 4000;
        const k = 1 - (1 - e) ** 2;
        const x = heronX + 90 * (1 - k);
        const y = heronY - 12 - 60 * (1 - k);
        sprite(
          f,
          HERON_FLY[e > 0.85 ? Math.floor(age / 200) % 2 : 1]!,
          x - 9,
          y - 4,
          pal
        );
        return true;
      }
      return false;
    }

    const onBoat = (x: number, y: number) =>
      x >= boatX - 4 && x <= boatX + 32 && y >= BOAT_Y - 20 && y <= BOAT_Y + 3;
    const onHeron = (x: number, y: number) =>
      Math.abs(x - heronX) <= 7 && y >= heronY - 18 && y <= heronY + 3;
    const onReeds = (x: number, y: number) =>
      y > NEAR - 30 &&
      (x < leftEnd || x > rightStart) &&
      y > (bankTop[Math.max(0, Math.min(w - 1, x))] ?? NEAR) - 30;
    const heronHome = (t: number) => t < heronFlew || t - heronFlew > 16_000;
    // ---------- the easter eggs ----------
    // Each egg's spot sits inside what's clickable for it, with room for a
    // blunt finger (the viewer gives a touch 6px of slack), so a tap that
    // finds an egg always plays it.
    const SLACK = 6;
    const CAT_R = 7;
    const catSpot = [jettyX - 1, JETTY_Y - 4] as const;
    const onJetty = (x: number, y: number) =>
      (y >= JETTY_Y - 8 &&
        y < h &&
        Math.abs(x - (jettyX - ((y - JETTY_Y) / (h - JETTY_Y)) * 6)) <=
          6 + Math.max(0, y - JETTY_Y) * 0.15) ||
      Math.hypot(x - catSpot[0], y - catSpot[1]) <= CAT_R + SLACK;
    const within = (x: number, y: number, s: readonly number[], r: number) =>
      Math.hypot(x - s[0]!, y - s[1]!) <= r;

    // --- bread: a kid wails from the window, a woman runs back with a loaf ---
    let breadAt = -Infinity;
    const bwx = bwx0 + 2; // the window's middle
    const bwy = bwy0 + 1;
    const b1 = bastions[1]!;
    const crestY = (x: number) =>
      crestTop[Math.max(0, Math.min(w - 1, Math.round(x)))]! - 1;
    const doorX = blkL + Math.round(blkW / 2);
    // her way back: along the embankment, up the path on the bastion's lit
    // face, over its top and along the rampart to the block
    const route: Pt[] = [
      [w + 8, HORIZON - 2],
      [b1 + 26, HORIZON - 2],
      [b1 + 7, BTOP + 3],
      [b1 + 4, BTOP - 1],
      [b1 - 12, BTOP - 1],
      [b1 - 17, crestY(b1 - 17)],
      [doorX, crestY(doorX)],
    ];
    const segs = route
      .slice(1)
      .map((p, i) => Math.hypot(p[0] - route[i]![0], p[1] - route[i]![1]));
    const routeLen = segs.reduce((a, b) => a + b, 0);
    function along(d: number): Pt {
      for (let i = 0; i < segs.length; i++) {
        const L = segs[i]!;
        if (d <= L || i === segs.length - 1) {
          const k = Math.max(0, Math.min(1, d / L));
          const a = route[i]!;
          const b = route[i + 1]!;
          return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
        }
        d -= L;
      }
      return route[route.length - 1]!;
    }
    const RUN_FROM = 800; // she hears him and comes flying round the corner
    const runT = Math.max(2000, Math.min(3000, routeLen / 0.09));
    const ARRIVE = RUN_FROM + runT;
    const PULL = ARRIVE + 300; // and he's hauled back in
    const BREAD_LEN = ARRIVE + 2700;
    const RING_EVERY = 340;
    const RING_LIFE = 1400;
    const ringMax = Math.hypot(Math.max(bwx, w - bwx), 100);
    /** When the first shout ring gets to (x, y), in ms after the tap. */
    const ringHits = (x: number, y: number) =>
      150 +
      (RING_LIFE * Math.max(0, Math.hypot(x - bwx, (y - bwy) / 0.62) - 4)) /
        ringMax;
    const boatHit = ringHits(boatX + 9, BOAT_Y - 8);
    const heronHit = ringHits(heronX, heronY - 10);
    /** How hard the shout makes something jump, 0..1. */
    const jolt = (t: number, hit: number) => {
      const a = t - breadAt - hit;
      return a >= 0 && a < 650 ? Math.sin((a / 650) * Math.PI) : 0;
    };

    function shoutRings(f: Frame, age: number) {
      const stop = age > ARRIVE ? Math.max(0, 1 - (age - ARRIVE) / 350) : 1;
      if (!stop) return;
      for (let k = 0; ; k++) {
        const e = 150 + k * RING_EVERY;
        if (e > ARRIVE - 150 || e > age) break;
        const a = age - e;
        if (a > RING_LIFE) continue;
        const p = a / RING_LIFE;
        const r = 4 + p * ringMax;
        const alpha = (1 - p) * stop;
        const steps = Math.ceil(r * 4);
        for (let s = 0; s < steps; s++) {
          const ang = (s / steps) * Math.PI * 2;
          const x = bwx + Math.cos(ang) * r;
          const y = bwy + Math.sin(ang) * r * 0.62;
          f.blend(x, y, P.shout, alpha);
          if (p < 0.45) f.blend(x, y + 1, P.shout, alpha * 0.5);
        }
      }
    }
    /** ...and the same rings spreading across the river below. */
    function riverRings(f: Frame, age: number) {
      const stop = age > ARRIVE ? Math.max(0, 1 - (age - ARRIVE) / 350) : 1;
      if (!stop) return;
      const cy = HORIZON + 7;
      for (let k = 0; ; k++) {
        const e = 300 + k * RING_EVERY;
        if (e > ARRIVE - 150 || e > age) break;
        const a = age - e;
        if (a > 1800) continue;
        const p = a / 1800;
        const r = 3 + p * ringMax * 1.1;
        const alpha = 0.85 * (1 - p) * stop;
        const steps = Math.ceil(r * 3.5);
        for (let s = 0; s < steps; s++) {
          const ang = (s / steps) * Math.PI * 2;
          const y = cy + Math.sin(ang) * r * 0.24;
          if (y < HORIZON + 1) continue;
          f.blend(bwx + Math.cos(ang) * r, y, P.rippleHi, alpha);
        }
      }
    }

    // birds and swallows bursting out of the roofs and trees round the block
    const scatter = Array.from({ length: 16 }, (_, i) => {
      const x0 = blkL - 40 + hash2(i, 1, 61) * (blkW + 80);
      const y0 = i % 4 === 0 ? BLK_TOP - 1 : 58 + hash2(i, 2, 61) * 12;
      const dx = x0 - bwx;
      const dy = y0 - bwy - 30;
      const n = Math.hypot(dx, dy) || 1;
      const sp = 55 + hash2(i, 3, 61) * 45;
      return {
        x0,
        y0,
        vx: (dx / n) * sp,
        vy: (dy / n) * sp * 0.6 - 12,
        delay: ringHits(x0, y0) + hash2(i, 4, 61) * 200,
      };
    });
    function scatterBirds(f: Frame, age: number) {
      scatter.forEach((b, i) => {
        const a = (age - b.delay) / 1000;
        if (a < 0 || a > 4) return;
        const x = b.x0 + b.vx * a + Math.sin(a * 6 + i) * 3;
        const y = b.y0 + b.vy * a + Math.sin(a * 9 + i * 2) * 1.5;
        if (x < -6 || x > w + 6 || y < -4) return;
        sprite(f, SWALLOW[Math.floor(age / 70 + i) % 2]!, x - 2, y - 1, {
          k: P.swallow,
        });
      });
    }

    /** The window: lit, a little head waiting at the sill; then the wail. */
    function breadWindow(f: Frame, t: number) {
      const age = t - breadAt;
      const playing = age >= 0 && age < BREAD_LEN;
      f.rect(bwx0, bwy0, 5, 3, P.curtain);
      f.vline(bwx0 + 3, bwy0, bwy0 + 2, P.frameLit);
      const kid = { h: P.hair, s: P.skin, b: P.kidTop, t: P.tear };
      if (!playing) {
        // he's waiting at the window, now and then craning to see
        const crane = Math.sin(t / 2300) > 0.55;
        const hx = bwx0 + (Math.sin(t / 3100) > 0 ? 1 : 2);
        f.hline(hx, hx + 1, bwy0 + 1, P.sil);
        f.hline(hx - 1, hx + 2, bwy0 + 2, P.sil);
        if (crane) f.hline(hx, hx + 1, bwy0, P.sil);
        return;
      }
      // light flooding out of the window, throbbing with the wail
      const wail = age < PULL;
      const glowA = wail
        ? 0.5 + 0.2 * Math.sin(age / 90)
        : 0.45 * Math.max(0, 1 - (age - PULL) / 2200);
      if (age < 160) glow(f, bwx, bwy, 6 + age / 8, P.winHi, 0.8, 0.9, 0.06);
      glow(f, bwx, bwy, 13, P.win, glowA, 0.85, 0.06);
      f.rect(bwx0, bwy0, 5, 3, P.winHi);
      if (wail) {
        // leaning right out, arms going, head shaking, tears flying
        const fr = Math.floor(age / 130) % 2;
        const shake = age > 120 ? (Math.floor(age / 65) % 2) * 2 - 1 : 0;
        const pulled = age > ARRIVE ? 1 : 0;
        sprite(
          f,
          WAIL[fr]!,
          bwx0 - 1 + shake * (1 - pulled),
          bwy0 - 3 + pulled,
          { ...kid, a: P.skin, m: P.door }
        );
        for (let j = 0; j < 6; j++) {
          const q = (age / 420 + j / 6) % 1;
          const side = j % 2 ? 1 : -1;
          f.set(
            bwx + 0.5 + side * (3 + q * 8),
            bwy - 1 - Math.sin(q * Math.PI) * 4 + q * q * 6,
            P.tear
          );
        }
        // the wail itself: short strokes flicking out round his head
        if (Math.floor(age / 110) % 2 && age < ARRIVE)
          for (let k = 0; k < 6; k++) {
            const ang = -Math.PI * (0.12 + (k / 5) * 0.76);
            for (let r = 6; r < 9; r++)
              f.set(
                bwx + Math.cos(ang) * r * 1.3,
                bwy + Math.sin(ang) * r,
                P.shout
              );
          }
        if (pulled) {
          // the woman's arms round him from behind
          f.vline(bwx0 - 2, bwy0 + 1, bwy0 + 3, P.coat);
          f.vline(bwx0 + 6, bwy0 + 1, bwy0 + 3, P.coat);
          f.hline(bwx0 - 1, bwx0, bwy0 + 4, P.skin);
          f.hline(bwx0 + 4, bwx0 + 5, bwy0 + 4, P.skin);
        }
        return;
      }
      // back inside: the two of them in the window, a hug, a heart
      f.hline(bwx0 + 2, bwx0 + 3, bwy0, P.womanHair);
      f.vline(bwx0 + 3, bwy0 + 1, bwy0 + 2, P.womanHair);
      f.set(bwx0 + 2, bwy0 + 2, P.coat);
      f.hline(bwx0 + 1, bwx0 + 2, bwy0 + 1, P.hair);
      f.set(bwx0 + 1, bwy0 + 2, P.kidTop);
      const ha = age - PULL - 200;
      if (ha > 0 && ha < 2200) {
        const k = ha / 2200;
        const beat = Math.floor(ha / 260) % 2;
        if (k < 0.75 || Math.floor(ha / 90) % 2)
          sprite(
            f,
            beat ? HEART : BIG_HEART,
            bwx - (beat ? 2 : 3),
            bwy0 - 8 - k * 14 + (beat ? 1 : 0),
            { r: P.heart, W: P.white }
          );
      }
    }

    function womanRun(f: Frame, age: number) {
      const tau = age - RUN_FROM;
      if (tau < 0 || age > ARRIVE + 120) return;
      const p = Math.min(1, tau / runT);
      const d = routeLen * (p * 0.8 + (1 - (1 - p) ** 2) * 0.2);
      const [x, y] = along(d);
      const fr = Math.floor(age / 75) % 2;
      // speed lines streaming off her along the way she came, and dust
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 9 + j * 3; k++) {
          const [sx, sy] = along(d - 5 - k - j * 2);
          if (Math.floor(age / 75 + j) % 3 === 0 && k > 6) continue;
          f.blend(sx, sy - 2 - j * 2, P.shout, 0.6 * (1 - k / (9 + j * 3)));
        }
      for (let k = 1; k <= 4; k++) {
        const [px, py] = along(d - k * 7);
        const a = 0.65 * (1 - k / 5);
        f.blend(px + 1, py - Math.floor(k / 2), P.dust, a);
        f.blend(px - 1, py - Math.floor(k / 2) - 1, P.dust, a * 0.8);
        if (k > 1) f.blend(px, py - k, P.dust, a * 0.6);
      }
      const pal = {
        L: P.loafHi,
        l: P.loaf,
        h: P.womanHair,
        s: P.skin,
        c: P.coat,
        C: P.coatSh,
        k: P.legs,
      };
      const rows = WOMAN_RUN[fr]!;
      const top = Math.round(y) - rows.length + 1 - fr;
      sprite(f, rows, Math.round(x) - 3, top, pal);
      // her reflection, while she's down by the water
      if (y > HORIZON - 4)
        rows.forEach((row, ry) => {
          for (let rx = 0; rx < row.length; rx++) {
            const c = pal[row[rx] as keyof typeof pal];
            if (c !== undefined)
              f.blend(
                Math.round(x) - 3 + rx,
                2 * HORIZON - (top + ry),
                c,
                0.35
              );
          }
        });
    }

    // --- toys: the space toy goes to one kid, the cowboy to the other ---
    let toysAt = -Infinity;
    const TOYS_LEN = 7200;
    const LAUNCH = 350;
    const LAND = 3550;
    const DOLL_GO = 3900;
    const DOLL_IN = 4450;
    const kidX = cellX(kidCol); // the kid who gets the cowboy
    const kid2X = cellX(kid2Col) + 1; // the other, on the next balcony
    const kidY = floorY(TOY_FLOOR); // the top of the kid's head
    const loopR = Math.max(45, Math.min(140, w * 0.28));
    const flightPath: Pt[] = [
      [boxX + 1, railY - 3],
      [boxX + 4, railY - 22],
      [Math.min(w - 12, boxX + loopR * 0.75), 22],
      [boxX - loopR * 0.2, 10],
      [Math.max(12, boxX - loopR), 27],
      [kid2X + 2 - loopR * 0.35, kidY - 20],
      [kid2X + 2, kidY - 3],
    ];
    function flightAt(s: number): Pt {
      const pts = flightPath;
      const n = pts.length - 1;
      const u = Math.min(n - 1e-6, Math.max(0, s * n));
      const i = Math.floor(u);
      const q = u - i;
      const p0 = pts[Math.max(0, i - 1)]!;
      const p1 = pts[i]!;
      const p2 = pts[i + 1]!;
      const p3 = pts[Math.min(n, i + 2)]!;
      const cr = (a: number, b: number, c: number, d: number) =>
        0.5 *
        (2 * b +
          (c - a) * q +
          (2 * a - 5 * b + 4 * c - d) * q * q +
          (3 * b - a - 3 * c + d) * q * q * q);
      return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
    }
    const flightS = (age: number) => {
      const u = Math.max(0, Math.min(1, (age - LAUNCH) / (LAND - LAUNCH)));
      return u * 0.6 + (0.5 - 0.5 * Math.cos(u * Math.PI)) * 0.4;
    };
    const spaceToyPal = { w: P.toyW, G: P.toyG, P: P.toyP, s: P.skin };
    const dollPal = {
      H: P.hat,
      E: P.hatHi,
      s: P.skin,
      y: P.dollTop,
      j: P.dollLegs,
    };
    const SPARKS = [P.white, P.glow, P.toyG, P.toyP, P.white];

    /** Draws only the rows above the balcony rail (y < yMax). */
    function behindRail(
      f: Frame,
      rows: readonly string[],
      x: number,
      y: number,
      pal: Record<string, RGB>,
      yMax = railY
    ) {
      rows.forEach((row, ry) => {
        const yy = Math.round(y) + ry;
        if (yy >= yMax) return;
        for (let rx = 0; rx < row.length; rx++) {
          const c = pal[row[rx]!];
          if (c !== undefined) f.set(Math.round(x) + rx, yy, c);
        }
      });
    }

    /** A sprite with each pixel drawn k x k. */
    function spriteAt(
      f: Frame,
      rows: readonly string[],
      x: number,
      y: number,
      pal: Record<string, RGB>,
      k: number
    ) {
      const x0 = Math.round(x);
      const y0 = Math.round(y);
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          const c = pal[row[rx]!];
          if (c !== undefined) f.rect(x0 + rx * k, y0 + ry * k, k, k, c);
        }
      });
    }

    function burst(f: Frame, x: number, y: number, a: number, r: number) {
      // a star of sparks thrown out from (x, y), `a` ms in
      if (a < 0 || a > 500) return;
      const p = a / 500;
      for (let k = 0; k < 12; k++) {
        const ang = (k / 12) * Math.PI * 2 + 0.3;
        const c = SPARKS[k % SPARKS.length]!;
        for (const d of [2 + p * r, 1 + p * r * 0.7])
          f.blend(x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.8, c, 1 - p);
      }
    }

    /** The balcony: the toy box, and the boys when they come out. */
    function toyBalcony(f: Frame, t: number) {
      const age = t - toysAt;
      const playing = age >= 0 && age < TOYS_LEN;
      const kid = { h: P.hair, s: P.skin, b: P.kidTop, a: P.skin };
      const kid2 = { H: P.kid2Hair, s: P.skin, r: P.kid2Top, a: P.skin };
      if (playing) {
        // they come running out, and go back in at the end
        const rise = (from: number) => {
          const out = TOYS_LEN - 600;
          if (age >= out) return Math.round(6 * Math.min(1, (age - out) / 400));
          return Math.round(
            6 * (1 - Math.max(0, Math.min(1, (age - from) / 220)))
          );
        };
        const my =
          kidY + rise(0) + (age > DOLL_IN && age < DOLL_IN + 120 ? 1 : 0);
        const by = kidY + 1 + rise(120);
        // watching, then sure it's coming to him, then not
        const kidRows =
          age < LAND - 900 ? KID_WATCH : age < LAND ? KID_REACH : KID_FOLD;
        behindRail(f, kidRows, kidX, my, kid);
        if (age >= DOLL_IN) behindRail(f, DOLL_HELD, kidX - 2, my + 2, dollPal);
        // the other kid, and the toy he's got now, jumping for joy
        if (age < LAND) behindRail(f, KID2, kid2X, by, kid2);
        else {
          const j = age - LAND;
          const hop =
            j < 2400 && age < TOYS_LEN - 600
              ? Math.round(Math.abs(Math.sin((j / 300) * Math.PI)) * 3)
              : 0;
          behindRail(f, KID2_JOY, kid2X, by - 1 - hop, kid2);
          if (age < TOYS_LEN - 500)
            behindRail(f, SPACE_TOY[2]!, kid2X + 1, by - 4 - hop, spaceToyPal);
        }
      }
      // the toy box, a star on the front: lid on, rattling now and then as
      // if something inside wants out; off while it plays
      f.rect(boxX, railY - 2, 3, 2, P.box);
      f.set(boxX + 1, railY - 2, P.boxLid);
      f.vline(boxX + 2, railY - 2, railY - 1, P.red);
      const open = playing && age < TOYS_LEN - 400;
      if (!open) {
        const rattle = t % 4700 < 420 ? Math.floor(t / 70) % 2 : 0;
        f.hline(boxX, boxX + 2, railY - 3 - rattle, P.boxLid);
        if (rattle)
          f.set(boxX + 1 + (Math.floor(t / 140) % 2), railY - 3, P.white);
      }
    }

    /** Everything the toys throw across the sky. */
    function toyFlight(f: Frame, age: number) {
      // the lid pops off and the box bursts with light
      if (age < 900) {
        const q = age / 900;
        f.hline(
          boxX + q * 10,
          boxX + 2 + q * 10,
          railY - 3 - Math.sin(q * Math.PI) * 9,
          P.boxLid
        );
      }
      if (age < 600)
        glow(
          f,
          boxX + 1,
          railY - 2,
          6 + age / 30,
          P.glow,
          0.75 * (1 - age / 600),
          0.9,
          0.06
        );
      burst(f, boxX + 1, railY - 3, age - 60, 18);
      burst(f, boxX + 1, railY - 3, age - 220, 11);
      // the space toy's loop round the sky, sparkles streaming behind;
      // it swoops in close (twice the size) over the top of the loop
      if (age >= LAUNCH && age < LAND) {
        for (let k = 1; k <= 160; k++) {
          const ta = age - k * 9;
          if (ta < LAUNCH) break;
          const [sx, sy] = flightAt(flightS(ta));
          const life = k / 160;
          const id = Math.floor(ta / 9);
          if (hash2(id, Math.floor(age / 70), 23) < 0.1 + life * 0.35) continue;
          const c = SPARKS[Math.floor(hash2(id, 1, 29) * 5)]!;
          const jx = (hash2(id, 2, 31) - 0.5) * 6 * life;
          const jy = (hash2(id, 3, 31) - 0.5) * 6 * life + life * life * 8;
          const x = sx + jx;
          const y = sy + jy;
          if (life < 0.3) f.set(x, y, c);
          else f.blend(x, y, c, 1.2 - life);
          if (id % 7 === 0 && life < 0.75) {
            const a = (1 - life) * 0.8;
            for (const [dx, dy] of [
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1],
            ] as const)
              f.blend(x + dx, y + dy, c, a);
          }
        }
        const s = flightS(age);
        const [x, y] = flightAt(s);
        const size = s < 0.05 || s > 0.95 ? 2 : s < 0.14 || s > 0.86 ? 1 : 0;
        const big = s > 0.3 && s < 0.7 ? 2 : 1;
        const spr = SPACE_TOY[size]!;
        glow(f, x, y, size ? 5 : 6 + big * 4, P.white, 0.35, 1, 0.06);
        spriteAt(
          f,
          spr,
          x - Math.floor((spr[0]!.length * big) / 2),
          y - Math.floor((spr.length * big) / 2),
          spaceToyPal,
          big
        );
      }
      // landing: a shower of sparks and the kid over the moon
      burst(f, kid2X + 2, kidY - 3, age - LAND, 10);
      if (age > LAND && age < LAND + 2200)
        for (let k = 0; k < 5; k++) {
          const a = age - LAND - k * 300;
          if (a < 0 || a > 900) continue;
          const sx = kid2X + 1 + (hash2(k, 1, 37) - 0.7) * 12;
          const sy = kidY - 2 - a / 90;
          const c = k % 2 ? P.heart : P.glow;
          if (k % 2) sprite(f, HEART, sx - 2, sy - 2, { r: c });
          else f.set(sx, sy, c);
        }
      // the cowboy tumbles out of the box into the first kid's folded arms
      if (age >= DOLL_GO && age < DOLL_IN) {
        const q = (age - DOLL_GO) / (DOLL_IN - DOLL_GO);
        const x0 = boxX;
        const y0 = railY - 6;
        const x1 = kidX - 1;
        const y1 = kidY + 1;
        const x = x0 + (x1 - x0) * q;
        const y = y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * 9;
        const flip = Math.floor(age / 110) % 2 === 1;
        sprite(f, flip ? [...DOLL].reverse() : DOLL, x, y, dollPal);
      }
      if (age >= DOLL_IN && age < DOLL_IN + 400) {
        const q = (age - DOLL_IN) / 400;
        for (const dx of [-3, -2, 5, 6])
          f.blend(
            kidX + dx + Math.sign(dx) * q * 2,
            kidY + 3 - q * 2,
            P.dust,
            1 - q
          );
      }
      // ...who is not happy about it
      if (age > DOLL_IN + 250 && age < TOYS_LEN - 600) {
        const cx = kidX + 2;
        const cy = kidY - 7 + (Math.floor(age / 400) % 2);
        sprite(f, ['..ggg..', '.ggggg.', 'ggggggg', '.g.g.g.'], cx - 3, cy, {
          g: P.grump,
        });
        if (Math.floor(age / 140) % 4 === 0) {
          f.set(cx, cy + 3, P.boxLid);
          f.set(cx - 1, cy + 4, P.boxLid);
        }
        for (let k = 0; k < 3; k++)
          f.set(cx - 2 + k * 2, cy + 4 + ((age / 90 + k) % 2), P.tear);
      }
    }

    // --- cat: it pounces at a firefly, and the reeds light up ---
    const CAT_LEN = 6600;
    const BURST = 950; // when its paws meet the firefly
    const swarm = Array.from(
      { length: Math.round(Math.max(70, Math.min(170, w / 2.5))) },
      (_, i) => ({
        tx: hash2(i, 1, 71) * w,
        ty: 40 + hash2(i, 2, 71) * 105,
        d: hash2(i, 3, 71) * 500,
        ph: hash2(i, 4, 71) * 6.28,
        end: 3900 + hash2(i, 5, 71) * 1700,
      })
    );
    // a firefly's halo, worked out once: [dx, dy, alpha] in stepped rings
    const halo = (r: number) => {
      const out: [number, number, number][] = [];
      for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++)
        for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
          const d = Math.hypot(dx, dy) / r;
          if (d >= 1) continue;
          const ring = Math.ceil((1 - d) * 4) / 4;
          const a = 0.6 * ring * ring;
          if (a >= 0.04) out.push([dx, dy, a]);
        }
      return out;
    };
    const HALO = halo(3.6);
    const HALO_NEAR = halo(5);
    function fireflyBurst(f: Frame, age: number) {
      const a0 = age - BURST;
      if (a0 < 0) return;
      const x0 = jettyX - 2;
      const y0 = JETTY_Y - 15;
      if (a0 < 1800)
        glow(
          f,
          x0,
          y0 + 6,
          10 + a0 / 30,
          P.fireGlow,
          0.32 * (1 - a0 / 1800),
          0.8,
          0.05
        );
      swarm.forEach((s, i) => {
        const a = a0 - s.d;
        if (a < 0) return;
        const fade = age > s.end ? 1 - (age - s.end) / 900 : 1;
        if (fade <= 0) return;
        if (fade < 1 && hash2(i, Math.floor(age / 80), 43) > fade) return;
        const p = Math.min(1, a / 1700);
        const e = 1 - (1 - p) ** 3;
        const x = x0 + (s.tx - x0) * e + Math.sin(a / 650 + s.ph) * 7 * e;
        const y =
          y0 +
          (s.ty - y0) * e +
          Math.sin(a / 520 + s.ph * 1.3) * 5 * e -
          a / 700;
        const pulse = Math.sin(a / 260 + s.ph * 5);
        // the ones that end up nearer us are bigger
        const near = s.ty > 112;
        if (pulse > -0.1) {
          const xr = Math.round(x);
          const yr = Math.round(y);
          for (const [dx, dy, al] of near ? HALO_NEAR : HALO)
            f.blend(xr + dx, yr + dy, P.fireGlow, al * fade);
        }
        const c = pulse > -0.3 ? P.firefly : P.fireGlow;
        f.set(x, y, c);
        if (near && pulse > 0) {
          f.set(x + 1, y, c);
          f.set(x, y + 1, c);
          f.set(x + 1, y + 1, P.fireGlow);
        }
      });
    }

    return {
      render(f, t, pointer) {
        lastT = t;
        f.copyFrom(base);
        for (const s of starList) {
          if (land.opaque(s.x, s.y)) continue;
          const tw = Math.sin(t / 1300 + s.ph);
          f.set(s.x, s.y, tw > 0.2 ? P.starHi : P.star);
          if (s.big && tw > 0.5) {
            f.blend(s.x - 1, s.y, P.star, 0.6);
            f.blend(s.x + 1, s.y, P.star, 0.6);
            f.blend(s.x, s.y - 1, P.star, 0.6);
            f.blend(s.x, s.y + 1, P.star, 0.6);
          }
        }
        // the evening star, low over the glow
        f.set(sunX - 26, 50, P.starHi);
        f.blend(sunX - 27, 50, P.starHi, 0.4);
        f.blend(sunX - 25, 50, P.starHi, 0.4);
        const co = ((Math.round(-t / 2600) % w) + w) % w;
        for (let y = 36; y < 66; y++) {
          const row = y * w;
          for (let x = 0; x < w; x++) {
            const p = cloudLayer.pixels[row + ((x + co) % w)]!;
            if (p >>> 24 && !(land.pixels[row + x]! >>> 24))
              f.pixels[row + x] = p;
          }
        }
        // a few windows switch on and off over time
        for (const wn of windows) {
          const on =
            hash2(wn.seed, Math.floor(t / 9000 + wn.seed * 0.37), 7) < 0.8;
          if (on)
            f.set(wn.x, wn.y, hash2(wn.seed, 1, 8) > 0.85 ? P.winHi : P.win);
        }
        // the block's windows: kitchens, curtains, a TV flickering blue,
        // the stairwell lights (only where the glass isn't hidden)
        const lit = (x: number, y: number, ww: number, hh: number, c: RGB) => {
          for (let yy = y; yy < y + hh; yy++)
            for (let xx = x; xx < x + ww; xx++)
              if (land.get(xx, yy) === P.glass) f.set(xx, yy, c);
        };
        // (the toy balcony stays dark, so the toy box shows, until the boys
        // come running out)
        const toysAge = t - toysAt;
        const toysOn = toysAge >= 0 && toysAge < TOYS_LEN;
        for (const wn of flats) {
          const toyFlat = wn.kind === 'b' && wn.y === floorY(TOY_FLOOR) + 1;
          const kidHome = toyFlat && wn.x === cellX(kidCol) + 1;
          const home = toyFlat && wn.x === cellX(kid2Col) + 1;
          if (kidHome && !(toysOn && toysAge < TOYS_LEN - 300)) continue;
          const on =
            home ||
            kidHome ||
            hash2(wn.seed, Math.floor(t / 11_000 + wn.seed * 0.29), 17) <
              (wn.kind === 's' ? 0.85 : 0.66);
          if (!on) continue;
          if (wn.kind === 's') {
            lit(wn.x, wn.y, 2, 2, P.stair);
            continue;
          }
          const hue = hash2(wn.seed, 2, 19);
          let c =
            hue > 0.84
              ? P.tv
              : hue > 0.66
                ? P.curtain
                : hue > 0.5
                  ? P.winHi
                  : P.win;
          if (home || kidHome) c = P.win;
          if (c === P.tv)
            c = lerpRGB(P.tv, P.glass, Math.sin(t / 70) > 0.6 ? 0.45 : 0);
          if (wn.kind === 'b') {
            lit(wn.x, wn.y, 2, 4, lerpRGB(c, P.glass, 0.25));
            lit(wn.x + 2, wn.y + 1, 3, 3, c);
          } else {
            lit(wn.x, wn.y, 5, 3, c);
            if (land.get(wn.x + 3, wn.y) === P.glass)
              f.vline(wn.x + 3, wn.y, wn.y + 2, lerpRGB(c, P.frameLit, 0.6));
          }
        }
        breadWindow(f, t);
        toyBalcony(f, t);
        // people out for an evening walk along the top of the rampart, on
        // the crest and passing behind the bastions and the magazine's turf
        const walk = (x: number, y: number, c: RGB) => {
          if (!cover.opaque(x, y)) f.set(x, y, c);
        };
        for (let i = 0; i < walkers; i++) {
          const span = w + 20;
          const dir = i % 2 ? 1 : -1;
          const x =
            Math.round(
              (((hash2(i, 1, 51) * span + dir * t * 0.0045) % span) + span) %
                span
            ) - 10;
          const y = crestTop[Math.max(0, Math.min(w - 1, x))]! - 1;
          const step = Math.floor(t / 300 + i) % 2;
          for (let k = 1; k <= 4; k++) walk(x, y - k, P.man);
          walk(x + 1, y - 3, P.man);
          walk(x + (step ? 1 : 0), y, P.man);
          walk(x + (step ? 0 : 1), y, P.townDark);
          if (i % 3 === 0) {
            // a couple, arm in arm
            for (let k = 0; k <= 4; k++) walk(x + 2, y - k, P.man);
          }
        }
        const breadAge = t - breadAt;
        const breadOn = breadAge >= 0 && breadAge < BREAD_LEN;
        if (breadOn) womanRun(f, breadAge);
        // the river
        for (let y = HORIZON; y < h; y++) {
          const d = y - HORIZON;
          const wob =
            d < 4
              ? 0
              : Math.round(
                  Math.sin((y >> 1) * 0.8 + t / 700) * (0.45 + d / 50)
                );
          const row = y * w;
          // shift the mirrored row sideways, repeating the edge pixel
          if (wob >= 0) {
            f.pixels.set(mirror.pixels.subarray(row + wob, row + w), row);
            f.pixels.fill(mirror.pixels[row + w - 1]!, row + w - wob, row + w);
          } else {
            f.pixels.set(mirror.pixels.subarray(row, row + w + wob), row - wob);
            f.pixels.fill(mirror.pixels[row]!, row, row - wob);
          }
        }
        lightPath(f, sunX, HORIZON + 1, NEAR + 4, P.glint, t, 7);
        // lamp reflections stretching down the water
        for (const lx of lamps) {
          for (let y = HORIZON + 1; y < HORIZON + 26; y += 2) {
            const wob = Math.round(Math.sin(y * 0.8 + t / 330) * 1.2);
            f.blend(lx + wob, y, P.lamp, 0.55 * (1 - (y - HORIZON) / 26));
          }
        }
        // slow ripple lines across the surface
        for (let i = 0; i < w / 10; i++) {
          const y =
            HORIZON + 3 + Math.floor(hash2(i, 1, 41) * (NEAR - HORIZON));
          const life = Math.sin(t / 1400 + hash2(i, 2, 41) * 20);
          if (life < 0.3) continue;
          const x = Math.floor(
            hash2(i, 3, 41) * w + t * 0.002 * (hash2(i, 4, 41) > 0.5 ? 1 : -1)
          );
          const len = 2 + Math.round(((y - HORIZON) / 40) * 5);
          const xx = ((x % w) + w) % w;
          f.hline(xx, xx + len, y, life > 0.8 ? P.rippleHi : P.ripple);
        }
        // mist lying on the water by the far bank, drifting
        const drift = Math.floor(t / 900);
        for (let y = HORIZON + 1; y < HORIZON + 6; y++) {
          const a = y < HORIZON + 3 ? 0.22 : 0.12;
          const off = drift + (y - HORIZON) * 37;
          for (let x = 0; x < w; x++)
            if (mistMask[(x + off) % mistMask.length]) f.blend(x, y, P.mist, a);
        }
        tug(f, t);
        if (breadOn) riverRings(f, breadAge);
        // a fish jumps now and then
        const slot = Math.floor(t / FISH_EVERY);
        if (hash2(slot, 1, 5) > 0.35) {
          const sx = Math.floor(hash2(slot, 2, 5) * w);
          const sy = HORIZON + 8 + Math.floor(hash2(slot, 3, 5) * 26);
          if (Math.abs(sx - boatX - 14) > 26)
            fish(f, t - slot * FISH_EVERY, sx, sy, slot);
        }
        boat(f, t);
        fx.draw(f, t);
        blit(f, nearBank, 0, willowTop(0) - 1, willowX + WRX + 2, h);
        blit(
          f,
          nearBank,
          willowX + WRX + 2,
          Math.min(bankMin, JETTY_Y - 5),
          w,
          h
        );
        // the lantern on the jetty, and the cat keeping it company
        {
          const age = t - catAt;
          const play = age >= 0 && age < CAT_LEN;
          // the lantern flares as the fireflies burst out
          const flare =
            play && age > BURST ? Math.max(0, 1 - (age - BURST) / 1600) : 0;
          const lx = jettyX + 2;
          glow(
            f,
            lx,
            JETTY_Y - 3,
            13 + flare * 10,
            P.lamp,
            0.42 + flare * 0.3,
            0.8,
            0.12
          );
          f.set(lx, JETTY_Y - 6, P.plankGap);
          f.hline(lx - 1, lx + 1, JETTY_Y - 5, P.plankGap);
          f.rect(lx - 1, JETTY_Y - 4, 3, 3, P.lamp);
          f.set(lx, JETTY_Y - 3, P.lampHi);
          f.hline(lx - 1, lx + 1, JETTY_Y - 1, P.plankGap);
          // it turns to look at you, sees a firefly, crouches, pounces...
          let rows = CAT_SIT;
          let dy = 0;
          let eye = false;
          if (play) {
            if (age < 450) {
              rows = CAT_LOOK;
              eye = true;
            } else if (age < 650) rows = CAT_CROUCH;
            else if (age < 1250) {
              rows = CAT_LEAP;
              dy = -Math.round(Math.sin(((age - 650) / 600) * Math.PI) * 10);
            } else {
              // ...and sits watching them go, eyes shining
              rows = CAT_LOOK;
              eye = Math.floor(age / 450) % 4 !== 3;
            }
            if (age < BURST) {
              // the one firefly it's after
              const fx0 = jettyX - 2 + Math.round(Math.sin(age / 160));
              const fy0 = JETTY_Y - 15 + Math.round(Math.cos(age / 210));
              glow(f, fx0, fy0, 3.4, P.fireGlow, 0.55, 1, 0.1);
              f.set(fx0, fy0, P.firefly);
            }
          }
          const cy = JETTY_Y - rows.length + dy;
          sprite(f, rows, jettyX - 4, cy, { k: P.cat, r: P.catRim });
          if (eye) {
            f.set(jettyX - 3, cy + 1, P.firefly);
            f.set(jettyX - 1, cy + 1, P.firefly);
          }
          if (rows !== CAT_LEAP) {
            const flick = play
              ? Math.floor(age / 150) % 2
              : Math.sin(t / 2300) > 0.8
                ? 1
                : 0;
            f.set(jettyX + 1, JETTY_Y - 1 - flick, P.cat);
            f.set(jettyX + 2, JETTY_Y - 2 - flick, P.cat);
          }
        }
        if (heronHome(t)) heronStand(f, t);
        // the willow's hanging tresses, stirring
        for (const tr of tresses) {
          const side = Math.sign(tr.dx);
          const sway = Math.sin(t / 1900 + tr.ph);
          for (let k = 0; k < tr.len; k++) {
            const v = k / tr.len;
            const sx = Math.round(
              willowX + tr.dx + side * v * v * 4 + sway * v * v * 1.6
            );
            const y = tr.top + k;
            if (y >= h) break;
            const wide = v > 0.86 ? 1 : tr.wide;
            f.hline(sx, sx + wide - 1, y, P.willow);
            if (tr.dx > 4 && (k + tr.dx) % 9 < 5)
              f.set(sx + wide - 1, y, P.willowRim);
            else if ((k + tr.dx * 3) % 11 === 0) f.set(sx, y, P.willow2);
          }
        }
        // reeds, swaying; brushed by the pointer they bend harder
        for (const s of stalks) {
          const near = pointer
            ? Math.abs(pointer.x - s.x) < 14 && pointer.y > s.base - s.ht - 10
            : false;
          const amp = near ? 3.5 : 1.3;
          const lean =
            Math.sin(t / (near ? 260 : 1500) + s.ph + s.x * 0.04) *
              amp *
              (s.ht / 30) +
            0.8;
          let px = s.x;
          for (let j = 0; j <= s.ht; j++) {
            const v = j / s.ht;
            px = Math.round(s.x + lean * v * v);
            f.set(px, s.base - j, j > s.ht - 3 && lean > 0 ? P.reedRim : s.c);
          }
          if (s.leaf) {
            for (let j = 0; j < 6; j++)
              f.set(
                s.x + s.leaf * Math.round(j * 0.8) + Math.round(lean * 0.3),
                s.base - s.ht * 0.4 - j,
                s.c
              );
          }
          if (s.cat) {
            f.vline(px, s.base - s.ht - 3, s.base - s.ht + 1, P.cattail);
            f.set(px + 1, s.base - s.ht - 2, P.reedRim);
            f.set(px, s.base - s.ht - 4, s.c);
          }
        }
        // fireflies drifting over the reeds
        for (const ff of fireflies) {
          const x = ff.x + Math.sin(t / 2300 + ff.ph) * 7;
          const y = ff.y + Math.sin(t / 1700 + ff.ph * 1.3) * 5;
          const pulse = Math.sin(t / 820 + ff.ph * 5);
          if (pulse < -0.1) continue;
          if (pulse > 0.45) glow(f, x, y, 3.2, P.fireGlow, 0.45, 1, 0.1);
          f.set(x, y, pulse > 0.3 ? P.firefly : P.fireGlow);
        }
        heronFlight(f, t - heronFlew);
        // the eggs' big moments, over everything
        const catAge = t - catAt;
        if (catAge >= 0 && catAge < CAT_LEN) fireflyBurst(f, catAge);
        if (toysOn) toyFlight(f, toysAge);
        if (breadOn) {
          scatterBirds(f, breadAge);
          shoutRings(f, breadAge);
        }
      },
      poke(x, y, t) {
        // the eggs first; a tap while one plays never restarts it
        if (within(x, y, breadSpot, EGG_R + SLACK)) {
          if (t - breadAt >= BREAD_LEN) breadAt = t;
          return;
        }
        if (within(x, y, toysSpot, EGG_R + SLACK)) {
          if (t - toysAt >= TOYS_LEN) toysAt = t;
          return;
        }
        if (onJetty(x, y)) {
          if (t - catAt >= CAT_LEN) catAt = t;
          return;
        }
        if (onBoat(x, y)) {
          if (t - catchAt > 2600) catchAt = t;
          return;
        }
        if ((onHeron(x, y) || onReeds(x, y)) && heronHome(t)) {
          heronFlew = t;
          return;
        }
        if (y > HORIZON + 1 && y < NEAR + 4 && !onReeds(x, y)) {
          const seed = Math.round(t) % 1000;
          fx.add(t, 2400, (g, age) => fish(g, age, x, y, seed));
          return;
        }
        if (y < CREST - 4) swallows(t, x, y, Math.round(t) % 1000);
      },
      hot(x, y) {
        return (
          within(x, y, breadSpot, EGG_R + 2) ||
          within(x, y, toysSpot, EGG_R + 2) ||
          onJetty(x, y) ||
          onBoat(x, y) ||
          (heronHome(lastT) && (onHeron(x, y) || onReeds(x, y))) ||
          (y > HORIZON + 1 && y < NEAR + 4 && !onReeds(x, y)) ||
          y < CREST - 4
        );
      },
      eggs(t) {
        const out: EggSpot[] = [];
        if (!(t - breadAt < BREAD_LEN))
          out.push({ id: 'bread', x: breadSpot[0], y: breadSpot[1], r: EGG_R });
        if (!(t - toysAt < TOYS_LEN))
          out.push({ id: 'toys', x: toysSpot[0], y: toysSpot[1], r: EGG_R });
        if (!(t - catAt < CAT_LEN))
          out.push({ id: 'cat', x: catSpot[0], y: catSpot[1], r: CAT_R });
        return out;
      },
    };
  },
};
