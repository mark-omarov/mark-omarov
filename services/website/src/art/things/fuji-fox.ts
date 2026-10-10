// The Fuji camp's fox, hand-pixelled. Every sprite is a string-row sprite
// (one char per pixel) that the scene colours in:
//
//   a b c d   its coat, light to deep (a hue-shifted orange ramp)
//   W w v     white fur: cheeks, chin, chest ruff, tail tip
//   k K       dark brown and near-black: ear tips, stockings, nose
//   e h       eye and its highlight
//   i p       the inside of its ears, cream and shadow
//   s S r R H a sausage: body, highlight stripe, shade, dark ends, glint
//
// (and the pan, the campers' heads and arms have letters of their own)
//
// Up close (the close-up inset) it's a head-and-shoulders portrait; running
// past the camera it's a 32 x 13 gallop; in the camp it's small.

import { Frame, lerpRGB, type RGB } from '../frame';

/** Head and shoulders, 42 x 46, facing left: looking up at the pan. */
export const CLOSE = {
  /** Looking up, hoping. */
  up: [
    '...............k................k.........',
    '..............kk................kk........',
    '..............kkk..............kkk........',
    '.............kdkk..............kkdk.......',
    '.............abic.............bidcd.......',
    '.............abiic............biiicd......',
    '............abiiic...........bbiiicd......',
    '............abiWic...........biiWicd......',
    '............abiWiic.........bbiWiicd......',
    '............abWiWic..aaaaa..biWiWicd......',
    '...........aabWWWiaaaaaaaabbbiWWWWpcd.....',
    '...........aaaWWaaaaaaaabbbbbbbWWWpccd....',
    '...........aaaaaaaaaabbbbbbbbbbbbbbcccd...',
    '...........aaaaaeebbbbbbbbeeebbbbbbccccd..',
    '..........aaaaaaheeabbbbbehheebbbbbccccd..',
    '........aaaaaaaaaeebbbbbbeheeebbbbbccccd..',
    '......hKaaaaaaabbcbbbbbbbeeeabbbbbbcccd...',
    '.....KKKaaaaabbbbcbbbbbbbbbbbbbbbbcccdd...',
    '.....KKKWWWbbbbWWWbbbbbbbbbbbbWWbbccd.....',
    '......KkWWWWWWWWWWWWbbbbbbbbWWWWWWbcd.....',
    '.......kkkkkWWWWWWWWWWWbbWWWWWWWWWwwcd....',
    '........wwwvkWWWWWWWWWWWWWWWWWWWWWwwcdd...',
    '.........wwwvWWWWWWWWWWWWWWWWWWWwwwbccd...',
    '...........vWWWWWWWWWWWWWWWWWWWwwwbbccd...',
    '...........wWWWWWWWWWWWWWWWWWWwwwbbbccd...',
    '..........wWWWWWWWWWWWWWWWWWWWwwbbbbccd...',
    '..........vwWWWWWWWWWWWWWWWWWwwabbbbccd...',
    '.........wWWWWWWWWWWWWWWWWWWwwaabbbbccdd..',
    '.........vwWWWWWWWWWWWWWWWWwwaabbbbbccd...',
    '........wWWWWWWWWWWWWWWWWWwwaaabbbbbccdd..',
    '........vwWWWWWWWWWWWWWWWWwvaabbbbbbccd...',
    '.........wWWWWWWWWWWWWWWWWwvaabbbbbbbccdd.',
    '........wvWWWWWWWWWWWWWWWwwvaabbbbbbbccd..',
    '........vwWWWWWWWWWWWWWWWwvaaabbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWWwwvaaabbbbbbbbccd.',
    '........wvWWWWWWWWWWWWWWwvaaabbbbbbbbccdd.',
    '........vwWWWWWWWWWWWWWwwvaabbbbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWwvvaabbbbbbbbbbccd.',
    '..........wWWWWWWWWWWwwvaaabbbbbbbbbbccdd.',
    '...........wWWWWWWWWwvvaaabbbbbbbbbbcccd..',
    '............vwWWWWWwvvaaabbbbbbbbbbbcccdd.',
    '.............vwwwwwvvaaabbbbbbbbbbbbcccd..',
    '...............vvvvaaaabbbbbbbbbbbbbcccdd.',
    '................aaaaabbbbbbbbbbbbbbbccccd.',
    '................aaabbbbbbbbbbbbbbbbbbcccd.',
    '................abbbbbbbbbbbbbbbbbbbbcccdd',
  ],
  /** The same, head cocked one way... */
  tiltA: [
    '..................k.......................',
    '.................kk.......................',
    '................kdkk...............kk.....',
    '................abic..............kkk.....',
    '...............abiiic.............kkdk....',
    '...............abiiic............bidcd....',
    '...............abiWic............biicd....',
    '..............abiWWic...........biiiicd...',
    '..............abWiWic..........bbiWiicd...',
    '.............aaaWWWiaaaaaaaa..bbiWiicd....',
    '.............aaaaWaaaaaaaaaabbbiWiWicd....',
    '.............aaaaaaaaaaaaabbbbbiWWWWccd...',
    '...........aaaaaaaeebbbbbbbbbbbbbWWWpcc...',
    '.........aaaaaaaaaheebbbbbbbeeebbbbbbccd..',
    '.......hKaaaaaaaaaaeebbbbbbehheebbbbbcccd.',
    '......KKKaaaaaaabbcbbbbbbbbeheeebbbbbcccd.',
    '......KKKWWWbbbbbbcbbbbbbbbeeebbbbbbccccd.',
    '.......KkWWWWWWWWWWbbbbbbbbbbbbbbbbbccccd.',
    '.........kkkkWWWWWWWbbbbbbbbbbbbbbbbcccd..',
    '.........wwwvWWWWWWWWWbbbbbbbbWWWbbcccdd..',
    '..........wwwvWWWWWWWWWWbbWWWWWWWWbccd....',
    '...........vvWWWWWWWWWWWWWWWWWWWWWWwcd....',
    '...........wWWWWWWWWWWWWWWWWWWWWWWWwwcd...',
    '...........vWWWWWWWWWWWWWWWWWWWwwwbbccd...',
    '...........wWWWWWWWWWWWWWWWWWWwwwbbbccd...',
    '..........wWWWWWWWWWWWWWWWWWWWwwbbbbccd...',
    '..........vwWWWWWWWWWWWWWWWWWwwabbbbccd...',
    '.........wWWWWWWWWWWWWWWWWWWwwaabbbbccdd..',
    '.........vwWWWWWWWWWWWWWWWWwwaabbbbbccd...',
    '........wWWWWWWWWWWWWWWWWWwwaaabbbbbccdd..',
    '........vwWWWWWWWWWWWWWWWWwvaabbbbbbccd...',
    '.........wWWWWWWWWWWWWWWWWwvaabbbbbbbccdd.',
    '........wvWWWWWWWWWWWWWWWwwvaabbbbbbbccd..',
    '........vwWWWWWWWWWWWWWWWwvaaabbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWWwwvaaabbbbbbbbccd.',
    '........wvWWWWWWWWWWWWWWwvaaabbbbbbbbccdd.',
    '........vwWWWWWWWWWWWWWwwvaabbbbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWwvvaabbbbbbbbbbccd.',
    '..........wWWWWWWWWWWwwvaaabbbbbbbbbbccdd.',
    '...........wWWWWWWWWwvvaaabbbbbbbbbbcccd..',
    '............vwWWWWWwvvaaabbbbbbbbbbbcccdd.',
    '.............vwwwwwvvaaabbbbbbbbbbbbcccd..',
    '...............vvvvaaaabbbbbbbbbbbbbcccdd.',
    '................aaaaabbbbbbbbbbbbbbbccccd.',
    '................aaabbbbbbbbbbbbbbbbbbcccd.',
    '................abbbbbbbbbbbbbbbbbbbbcccdd',
  ],
  /** ...and the other. */
  tiltB: [
    '............................k.............',
    '............................kk............',
    '...........k................kkdk..........',
    '...........kk...............bdcd..........',
    '...........kkk.............biiicd.........',
    '..........kdkc.............biiicd.........',
    '..........abiic...........bbiWicd.........',
    '..........abiic...........biiiicdd........',
    '..........aiiicc..........biWiWicd........',
    '..........abiWic....aaa..bbiWWWWpcd.......',
    '..........abWWiic..aaaaabbbbWWWWpccdd.....',
    '..........abWWWiaaaaaabbbbbbbbbbbccccd....',
    '.........aaaWWWaaaaabbbbbbbbbbbbbccccd....',
    '.........aaaaaaaaaabbbbbeeebbbbbbccccd....',
    '.........aaaaaeebbbbbbbehheebbbbbccccd....',
    '.........aaaaaheeabbbbbeheeebbbbbcccd.....',
    '.........aaaaaaeebbbbbbeeebbbbbbbccdd.....',
    '.......aaaaaaabbcbbbbbbbbbbbbbWbbccd......',
    '......aaaaaaabbbcbbbbbbbbbbbWWWWWbccd.....',
    '.....hKaaaaabbbWWbbbbbbbbbWWWWWWWwwcdd....',
    '.....KKaWWbbbWWWWWWWbbbbWWWWWWWWWwwccd....',
    '.....KKWWWWWWWWWWWWWWWWWWWWWWWWWwwbccdd...',
    '.....KkkkkkkWWWWWWWWWWWWWWWWWWWwwbbbccd...',
    '...........vWWWWWWWWWWWWWWWWWWWwwwbbccd...',
    '...........wWWWWWWWWWWWWWWWWWWwwwbbbccd...',
    '..........wWWWWWWWWWWWWWWWWWWWwwbbbbccd...',
    '..........vwWWWWWWWWWWWWWWWWWwwabbbbccd...',
    '.........wWWWWWWWWWWWWWWWWWWwwaabbbbccdd..',
    '.........vwWWWWWWWWWWWWWWWWwwaabbbbbccd...',
    '........wWWWWWWWWWWWWWWWWWwwaaabbbbbccdd..',
    '........vwWWWWWWWWWWWWWWWWwvaabbbbbbccd...',
    '.........wWWWWWWWWWWWWWWWWwvaabbbbbbbccdd.',
    '........wvWWWWWWWWWWWWWWWwwvaabbbbbbbccd..',
    '........vwWWWWWWWWWWWWWWWwvaaabbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWWwwvaaabbbbbbbbccd.',
    '........wvWWWWWWWWWWWWWWwvaaabbbbbbbbccdd.',
    '........vwWWWWWWWWWWWWWwwvaabbbbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWwvvaabbbbbbbbbbccd.',
    '..........wWWWWWWWWWWwwvaaabbbbbbbbbbccdd.',
    '...........wWWWWWWWWwvvaaabbbbbbbbbbcccd..',
    '............vwWWWWWwvvaaabbbbbbbbbbbcccdd.',
    '.............vwwwwwvvaaabbbbbbbbbbbbcccd..',
    '...............vvvvaaaabbbbbbbbbbbbbcccdd.',
    '................aaaaabbbbbbbbbbbbbbbccccd.',
    '................aaabbbbbbbbbbbbbbbbbbcccd.',
    '................abbbbbbbbbbbbbbbbbbbbcccdd',
  ],
  /** Going for it, jaws open. */
  lunge: [
    '...............k................k.........',
    '..............kk................kk........',
    '..............kkk..............kkk........',
    '.............kdkk..............kkdk.......',
    '.............abic.............bidcd.......',
    '.............abiic............biiicd......',
    '............abiiic...........bbiiicd......',
    '............abiWic...........biiWicd......',
    '............abiWiic.........bbiWiicd......',
    '............abWiWic..aaaaa..biWiWicd......',
    '...........aabWWWiaaaaaaaabbbiWWWWpcd.....',
    '...........aaaWWaaaaaaaabbbbbbbWWWpccd....',
    '...........aaaaaaaaaabbbbbbbbbbbbbbcccd...',
    '...........aaaaaeebbbbbbbbeeebbbbbbccccd..',
    '..........aaaaaaheeabbbbbehheebbbbbccccd..',
    '........aaaaaaaaaeebbbbbbeheeebbbbbccccd..',
    '......hKaaaaaaabbcbbbbbbbeeeabbbbbbcccd...',
    '.....KKKaaaaabbbbcbbbbbbbbbbbbbbbbcccdd...',
    '.....KKKWWWbbbbWWWbbbbbbbbbbbbWWbbccd.....',
    '......KkWWWWWWWWWWWWbbbbbbbbWWWWWWbcd.....',
    '.......kkkkkWWWWWWWWWWWbbWWWWWWWWWwwcd....',
    '......KKKKKKKkWWWWWWWWWWWWWWWWWWWWwwcdd...',
    '......KiippKKkWWWWWWWWWWWWWWWWWWwwwbccd...',
    '.......KKKKKKkWWWWWWWWWWWWWWWWWwwwbbccd...',
    '.......wwwwwvkWWWWWWWWWWWWWWWWwwwbbbccd...',
    '........vwwwvWWWWWWWWWWWWWWWWWwwbbbbccd...',
    '..........vwWWWWWWWWWWWWWWWWWwwabbbbccd...',
    '.........wWWWWWWWWWWWWWWWWWWwwaabbbbccdd..',
    '.........vwWWWWWWWWWWWWWWWWwwaabbbbbccd...',
    '........wWWWWWWWWWWWWWWWWWwwaaabbbbbccdd..',
    '........vwWWWWWWWWWWWWWWWWwvaabbbbbbccd...',
    '.........wWWWWWWWWWWWWWWWWwvaabbbbbbbccdd.',
    '........wvWWWWWWWWWWWWWWWwwvaabbbbbbbccd..',
    '........vwWWWWWWWWWWWWWWWwvaaabbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWWwwvaaabbbbbbbbccd.',
    '........wvWWWWWWWWWWWWWWwvaaabbbbbbbbccdd.',
    '........vwWWWWWWWWWWWWWwwvaabbbbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWwvvaabbbbbbbbbbccd.',
    '..........wWWWWWWWWWWwwvaaabbbbbbbbbbccdd.',
    '...........wWWWWWWWWwvvaaabbbbbbbbbbcccd..',
    '............vwWWWWWwvvaaabbbbbbbbbbbcccdd.',
    '.............vwwwwwvvaaabbbbbbbbbbbbcccd..',
    '...............vvvvaaaabbbbbbbbbbbbbcccdd.',
    '................aaaaabbbbbbbbbbbbbbbccccd.',
    '................aaabbbbbbbbbbbbbbbbbbcccd.',
    '................abbbbbbbbbbbbbbbbbbbbcccdd',
  ],
  /** Got one: a sausage crosswise in its jaws, eyes shut, very pleased. */
  pleased: [
    '...............k................k.........',
    '..............kk................kk........',
    '..............kkk..............kkk........',
    '.............kdkk..............kkdk.......',
    '.............abic.............bidcd.......',
    '.............abiic............biiicd......',
    '............abiiic...........bbiiicd......',
    '............abiWic...........biiWicd......',
    '............abiWiic.........bbiWiicd......',
    '............abWiWic..aaaaa..biWiWicd......',
    '...........aabWWWiaaaaaaaabbbiWWWWpcd.....',
    '...........aaaWWaaaaaaaabbbbbbbWWWpccd....',
    '...........aaaaaaaaaabbbbbbbbbbbbbbcccd...',
    '...........aaaaaabbbbbbbbbbbbbbbbbbccccd..',
    '..........aaaaaaabbabbbbbbbbbbbbbbbccccd..',
    '........aaaaaaaaeebbbbbbbbeeebbbbbbccccd..',
    '......hKaaaaaaaebcebbbbbbebbaebbbbbcccd...',
    '.....KKKaaaaabbbbcbbbbbbbbbbbbbbbbcccdd...',
    '.....KKKWWWbbbbWWWbbbbbbbbbbbbWWbbccd.....',
    '......KkWWWWWWWWWWWWbbbbbbbbWWWWWWbcd.....',
    '...sSSSSSSSSWWWWWWWWWWWbbWWWWWWWWWwwcd....',
    '..rHHssssssssrWWWWWWWWWWWWWWWWWWWWwwcdd...',
    '.rSsssssssssssrWWWWWWWWWWWWWWWWWwwwbccd...',
    'RsssssssssssrssRWWWWWWWWWWWWWWWwwwbbccd...',
    'RrrrrrrrrrrrrrrRWWWWWWWWWWWWWWwwwbbbccd...',
    '.RR.......wWWRRWWWWWWWWWWWWWWWwwbbbbccd...',
    '..........vwWWWWWWWWWWWWWWWWWwwabbbbccd...',
    '.........wWWWWWWWWWWWWWWWWWWwwaabbbbccdd..',
    '.........vwWWWWWWWWWWWWWWWWwwaabbbbbccd...',
    '........wWWWWWWWWWWWWWWWWWwwaaabbbbbccdd..',
    '........vwWWWWWWWWWWWWWWWWwvaabbbbbbccd...',
    '.........wWWWWWWWWWWWWWWWWwvaabbbbbbbccdd.',
    '........wvWWWWWWWWWWWWWWWwwvaabbbbbbbccd..',
    '........vwWWWWWWWWWWWWWWWwvaaabbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWWwwvaaabbbbbbbbccd.',
    '........wvWWWWWWWWWWWWWWwvaaabbbbbbbbccdd.',
    '........vwWWWWWWWWWWWWWwwvaabbbbbbbbbccdd.',
    '.........wWWWWWWWWWWWWWwvvaabbbbbbbbbbccd.',
    '..........wWWWWWWWWWWwwvaaabbbbbbbbbbccdd.',
    '...........wWWWWWWWWwvvaaabbbbbbbbbbcccd..',
    '............vwWWWWWwvvaaabbbbbbbbbbbcccdd.',
    '.............vwwwwwvvaaabbbbbbbbbbbbcccd..',
    '...............vvvvaaaabbbbbbbbbbbbbcccdd.',
    '................aaaaabbbbbbbbbbbbbbbccccd.',
    '................aaabbbbbbbbbbbbbbbbbbcccd.',
    '................abbbbbbbbbbbbbbbbbbbbcccdd',
  ],
} as const;

/** The skillet, from a little above: handle out to the left. 40 x 9. */
export const PAN = [
  '...............mmMMMMMMMMMMMMmm.........',
  '...........mmMMoooooooooooooooommm......',
  '.........mMoooooooooooooooooooooooomm...',
  '........mMoooooooooooooooooooooooooom...',
  'xxxxxxxxmooooooooooooooooooooooooooom...',
  'xxxxxxxxgmooooooooooooooooooooooooomg...',
  '......xx.gmmooooooooooooooooooooommgG...',
  '..........ggmmmmmmmmmmmmmmmmmmmmmgGG....',
  '............gggggggggggggggggGGGGGG.....',
];
/** The pan's front edge starts on this row (drawn again over the sausages). */
export const PAN_FRONT = 5;
/** A sausage lying in the pan. 10 x 4. */
export const SAUS_PAN = [
  '.rsSSSSsr.',
  'RsHssssssR',
  'RrsssssrrR',
  '.RRrrrrRR.',
];
/** A sausage held crosswise in its jaws, side on. 9 x 3. */
export const SAUS_HELD = ['.rSSSSSr.', 'RsHsssssR', 'RrrrrrrrR'];

/**
 * The campers' arms flung up, from the bottom edge: the man's (with his
 * mug), the woman's and the kid's. j/J hoodie, t/T sweater, q/Q jacket,
 * u/U hands, y/Y the mug.
 */
export const ARMS = {
  man: [
    '.yyyY..',
    '.yyyYyy',
    '.yyyY.y',
    '.yyyYyy',
    '.YuuY..',
    '.uuuU..',
    '.uuuU..',
    '.jJJj..',
    'jJJJJj.',
    'jJJJJj.',
    'jJJJJj.',
    'jJJJJj.',
    '.jJJJj.',
    '.jJJJj.',
    '.jJJJj.',
    '..jJJj.',
  ],
  woman: [
    'u.u.u..',
    'u.u.uu.',
    'uuuuuU.',
    'uuuuuU.',
    '.uuuU..',
    '.tTTt..',
    'tTTTTt.',
    'tTTTTt.',
    'tTTTTt.',
    'tTTTTt.',
    '.tTTTt.',
    '.tTTTt.',
    '..tTTt.',
    '..tTTt.',
  ],
  kid: [
    '.u.u.',
    'uuuuu',
    'uuuuU',
    '.uuU.',
    '.qQq.',
    'qQQQq',
    'qQQQq',
    'qQQQq',
    '.qQQq',
    '.qQQq',
    '..qQq',
  ],
} as const;

/**
 * The campers from behind, watching it all from the bottom corner: the
 * kid's beanie, the man (his beard just showing), the woman. n/N his hair,
 * F beard, l/L her hair, z/Z/P the beanie and its pom-pom.
 */
export const HEADS = {
  kid: [
    '...PP....',
    '..PPPP...',
    '..ZZZz...',
    '.ZzzZZz..',
    'ZzzzzZZz.',
    'Zzzzzzzz.',
    'Nnnnnnnu.',
    'NnnnnnnuU',
    'QqqqqqQqq',
  ],
  man: [
    '..NNnnn...',
    '.NNnnnnn..',
    'NNnnnnnnn.',
    'Nnnnnnnnnn',
    'NnnnnnnnFF',
    'NnnnnnnnuU',
    'Nnnnnnnnu.',
    '.Nnnnnnnu.',
    'JJjjjjjjjj',
    'JjjjjjjjJj',
  ],
  woman: [
    '...LLll...',
    '..LLllll..',
    '.LLllllll.',
    'LLlllllllu',
    'Llllllllll',
    'Lllllllllu',
    'LllllllllU',
    'Llllllllll',
    'Llllllllll',
    'TTtttttttt',
  ],
} as const;

/** Running flat out, facing left: four gallop frames, 32 x 13. */
export const RUN = [
  [
    '....k.k.........................',
    '...kckb.........................',
    '..abbbbc....................aa..',
    '.aaebbbbcaaaaaaaaaaab....aabbbb.',
    'Kaaaabbbbbbbbbbbbbbbbc.aabbbbbww',
    '.WWWbbbbbbbbbbbbbbbbbbcabbbbbwww',
    '..vWWWbbbbbbbbcbbbbbbbbcccccww..',
    '....vWWbbbcc....cccbbbbcd.......',
    '.....kcc.............bcc........',
    '....kk.d..............dkk.......',
    '...kk...K..............K.kk.....',
    '..kk.....K..............K..kk...',
    '.kK......KK..............KK.kK..',
  ],
  [
    '................................',
    '....k.k.........................',
    '...kckb.........................',
    '..abbbbc....................aa..',
    '.aaebbbbcaaaaaaaaaaab....aabbbb.',
    'Kaaaabbbbbbbbbbbbbbbbc.aabbbbbww',
    '.WWWbbbbbbbbbbbbbbbbbbcabbbbbwww',
    '..vWWWbbbbbbbbcbbbbbbbbcccccww..',
    '....vcccbbcc....cccbccdcd.......',
    '.....kc.d..........ck.d.........',
    '.....kk.K.........kk.K..........',
    '....kk...K.......k..K...........',
    '...kK....KK.....kK.KK...........',
  ],
  [
    '....k.k.........................',
    '...kckb.....................aa..',
    '..abbbbc.................aabbbb.',
    '.aaebbbbcaaaaaaaaaaab..aabbbbbww',
    'Kaaaabbbbbbbbbbbbbbbbc.abbbbbwww',
    '.WWWbbbbbbbbbbbbbbbbbbccccccww..',
    '..vWWWbbbbbbbbcbbbbbbbbcd.......',
    '....vWWbbbcc....cccbbbb.........',
    '......cc...........ccd..........',
    '........cd........cd............',
    '.........kK......kK.............',
    '..........kK....kK..............',
    '...........kKKkKK...............',
  ],
  [
    '................................',
    '....k.k.........................',
    '...kckb.........................',
    '..abbbbc....................aa..',
    '.aaebbbbcaaaaaaaaaaab....aabbbb.',
    'Kaaaabbbbbbbbbbbbbbbbc.aabbbbbww',
    '.WWWbbbbbbbbbbbbbbbbbbcabbbbbwww',
    '..vWWWbbbbbbbbcbbbbbbbbcccccww..',
    '....vkccbbcc....cccbbbccd.......',
    '...kkk..d.............dkk.......',
    '.Kkk...KK.............K..k......',
    '.....KK................K..k.....',
    '.......................KK.kK....',
  ],
] as const;

/** Small, in the camp: sitting (and with its head cocked), 10 x 12. */
export const SIT = [
  [
    '..k..k....',
    '.kbk.kbk..',
    '.abbbbbc..',
    'Kaebbbbc..',
    '.WWabbbc..',
    '..WWbbbc..',
    '..WWabbbc.',
    '..WWabbbcc',
    '..Wkbbbbcd',
    '..Wkbbbbcd',
    '.kk.kbbbcd',
    'WWwbbbbbcd',
  ],
  [
    '.k....k...',
    '.kbk.kbk..',
    '.abbbbbc..',
    'Kabebbbc..',
    '.WWabbbc..',
    '..WWbbbc..',
    '..WWabbbc.',
    '..WWabbbcc',
    '..Wkbbbbcd',
    '..Wkbbbbcd',
    '.kk.kbbbcd',
    'WWwbbbbbcd',
  ],
] as const;
/** Small, trotting: two frames, 20 x 9. */
export const TROT = [
  [
    '...k.k..............',
    '..kbkb..............',
    '.abbbbc........aab..',
    'aaebbbcaaaaaaaaabbbw',
    'KaabbbbbbbbbbbbcbbWW',
    '.WWWbbbbbbbbbbbbcww.',
    '..vWWbbbccccbbbc....',
    '...kc.k.....kc.k....',
    '..k...k....k....k...',
  ],
  [
    '...k.k..............',
    '..kbkb..............',
    '.abbbbc........aab..',
    'aaebbbcaaaaaaaaabbbw',
    'KaabbbbbbbbbbbbcbbWW',
    '.WWWbbbbbbbbbbbbcww.',
    '..vWWbbbccccbbbc....',
    '....kk.......kk.....',
    '....kK.......kK.....',
  ],
] as const;
/** Small, running: two frames, 20 x 7. */
export const DASH = [
  [
    '...k.k..............',
    '..kbkb.........aab..',
    '.abbbbcaaaaaaaaabbbw',
    'KaebbbbbbbbbbbbcbbWW',
    '.WWWbbbbbbbbbbbbcww.',
    '..vWkcccc....cbk....',
    '.kk.............kk..',
  ],
  [
    '...k.k..............',
    '..kbkb.........aab..',
    '.abbbbcaaaaaaaaabbbw',
    'KaebbbbbbbbbbbbcbbWW',
    '.WWWbbbbbbbbbbbbcww.',
    '...vWkcc...cckk.....',
    '......kk..kk........',
  ],
] as const;

/** Where a frame's nose is (its first 'K' in the first column), or row 4. */
export function noseRow(rows: readonly string[]) {
  const i = rows.findIndex((r) => r.startsWith('K'));
  return i < 0 ? 4 : i;
}

/** Stamps a string sprite: `col` maps chars to colours (missing = skip). */
export function stamp(
  f: Frame,
  rows: readonly string[],
  x: number,
  y: number,
  col: Record<string, RGB>,
  scale = 1
) {
  x = Math.round(x);
  y = Math.round(y);
  for (let ry = 0; ry < rows.length; ry++) {
    const row = rows[ry]!;
    for (let rx = 0; rx < row.length; rx++) {
      const c = col[row[rx]!];
      if (c === undefined) continue;
      if (scale === 1) f.set(x + rx, y + ry, c);
      else f.rect(x + rx * scale, y + ry * scale, scale, scale, c);
    }
  }
}

export type CloseupPalette = {
  /** The fox's (and the sausage's and the arms') colours, by sprite char. */
  sprite: Record<string, RGB>;
  bgTop: RGB;
  bgBottom: RGB;
  glow: RGB;
  bokeh: RGB;
  steam: RGB;
  grease: RGB;
  flame: RGB;
  flameHot: RGB;
  frameDark: RGB;
  frameLight: RGB;
};

export type CloseupState = {
  /** The time, for the sizzle, the steam and the flames. */
  t: number;
  /** Head cocked: -1 one way, 1 the other, 0 straight. */
  tilt: number;
  /** How far it has lunged at the pan: 0 sitting, 1 at the pan. */
  reach: number;
  /** It's got one (and there's one fewer in the pan). */
  holding: boolean;
  /** The campers' arms flying up at the edge, 0..1. */
  arms: number;
  /** The pan knocked sideways, in pixels. */
  jolt: number;
  /** How hard the fat is spitting, 0..1. */
  spit: number;
};

const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * Makes the close-up, W x H with its frame. Draw it into any rect: smaller
 * while it's opening (it zooms out of that rect), full size once it's open.
 */
export function makeCloseup(W: number, H: number, P: CloseupPalette) {
  const iw = W - 4;
  const ih = H - 4;
  const buf = new Frame(iw, ih);
  // the fox sits bottom right, cut off at the chest; the pan is up and to
  // the left of its nose, on the burner
  const fx = iw - 40;
  const fy = ih - 40;
  const panX = fx - 32;
  const panY = fy + 3;
  // the campers, bottom left (but not too far off when it's a wide one)
  const campersX = Math.max(4, panX - 44);

  // the night behind (it doesn't change): warm near the fire, with the
  // string lights out of focus
  const bg = new Frame(iw, ih);
  for (let py = 0; py < ih; py++)
    for (let px = 0; px < iw; px++) {
      const v = py / ih;
      const band = Math.max(
        0,
        Math.min(3, Math.floor(v * 4 + ((px + py) & 1 ? 0.12 : -0.12)))
      );
      let c = lerpRGB(P.bgTop, P.bgBottom, band / 3);
      const g1 = Math.hypot(px - iw * 0.08, py - ih * 1.05) / (ih * 1.1);
      if (g1 < 1) c = lerpRGB(c, P.glow, (Math.ceil((1 - g1) * 4) / 4) * 0.2);
      const g2 = Math.hypot(px - panX - 24, (py - panY - 4) * 1.4) / 30;
      if (g2 < 1) c = lerpRGB(c, P.glow, (Math.ceil((1 - g2) * 3) / 3) * 0.22);
      bg.set(px, py, c);
    }
  // the string lights strung across behind, out of focus
  for (let x = 3; x < iw; x += 7) {
    const u = x / iw;
    const y = Math.round(3 + Math.sin(u * Math.PI) * 5 + ((x / 7) % 2));
    bg.blend(x - 1, y, P.bokeh, 0.35);
    bg.blend(x + 1, y, P.bokeh, 0.35);
    bg.blend(x, y - 1, P.bokeh, 0.35);
    bg.blend(x, y + 1, P.bokeh, 0.35);
    bg.blend(x, y, P.bokeh, 0.85);
  }
  const S = P.sprite;

  function render(s: CloseupState) {
    const t = s.t;
    buf.copyFrom(bg);
    const jx = Math.round(s.jolt);
    const jy = -Math.round(s.jolt * 0.5);
    const px = panX + jx;
    const py = panY + jy;
    // the burner's blue flames under the pan
    for (let i = 0; i < 6; i++) {
      const x = px + 13 + i * 4;
      const tall = 1 + Math.floor(hash(i, Math.floor(t / 70)) * 3);
      for (let k = 0; k < tall; k++)
        buf.set(x, py + 9 + k, k ? P.flame : P.flameHot);
      buf.set(x - 1, py + 9, P.flame);
      buf.set(x + 1, py + 9, P.flame);
    }
    stamp(buf, PAN, px, py, S);
    // three sausages sizzling (one fewer once it's been and gone)
    for (let i = 0; i < 3; i++) {
      if (s.holding && i === 2) continue;
      const jig = hash(i, Math.floor(t / 110)) > 0.75 ? -1 : 0;
      stamp(
        buf,
        SAUS_PAN,
        px + 10 + i * 8,
        py + 1 + jig + (i === 1 ? 1 : 0),
        S
      );
    }
    // (the front of the pan over them)
    for (let ry = PAN_FRONT; ry < PAN.length; ry++) {
      const row = PAN[ry]!;
      for (let rx = 0; rx < row.length; rx++) {
        const ch = row[rx]!;
        if (ch !== '.' && ch !== 'o') buf.set(px + rx, py + ry, S[ch]!);
      }
    }
    // steam off the sausages, and fat spitting
    for (let i = 0; i < 4; i++) {
      const q0 = (t / 1300 + i / 4) % 1;
      for (let j = 0; j < 5; j++) {
        const q = q0 - j * 0.03;
        if (q < 0) continue;
        buf.blend(
          px + 14 + i * 6 + Math.round(Math.sin(q * 9 + i) * 2),
          py - Math.round(q * 18),
          P.steam,
          0.45 * (1 - q)
        );
      }
    }
    const spits = Math.round(3 + 8 * s.spit);
    for (let i = 0; i < spits; i++) {
      const cyc = 420 + hash(i, 7) * 300;
      const n = Math.floor((t + hash(i, 8) * cyc) / cyc);
      const k = ((t + hash(i, 8) * cyc) % cyc) / cyc;
      buf.set(
        px + 12 + hash(i, n) * 24 + (hash(i, n + 1) - 0.5) * 16 * k,
        py + 1 - Math.sin(k * Math.PI) * (3 + 8 * hash(n, i)),
        P.grease
      );
    }

    // the fox: cocking its head, lunging, or very pleased with itself
    const pose = s.holding
      ? CLOSE.pleased
      : s.reach > 0.35
        ? CLOSE.lunge
        : s.tilt > 0
          ? CLOSE.tiltA
          : s.tilt < 0
            ? CLOSE.tiltB
            : CLOSE.up;
    stamp(
      buf,
      pose,
      fx - Math.round(s.reach * 7),
      fy - Math.round(s.reach * 6),
      S
    );

    // the campers watching from the bottom corner: they jump up, arms
    // flung up, when they see what it's done
    const jump = Math.round(3 * Math.min(1, s.arms * 3));
    const campers = [
      { head: HEADS.kid, arm: ARMS.kid, x: campersX, ax: 7, d: 0.3 },
      { head: HEADS.man, arm: ARMS.man, x: campersX + 11, ax: 9, d: 0 },
      { head: HEADS.woman, arm: ARMS.woman, x: campersX + 24, ax: 9, d: 0.15 },
    ];
    for (const m of campers)
      stamp(buf, m.head, m.x, ih - m.head.length + 1 - jump, S);
    for (const m of campers) {
      const p = Math.max(0, Math.min(1, (s.arms - m.d) / (1 - m.d)));
      if (p <= 0) continue;
      const up = 1 - Math.pow(1 - p, 3);
      const wave = Math.round(Math.sin(t / 90 + m.x) * up);
      stamp(
        buf,
        m.arm,
        m.x + m.ax + wave,
        ih - Math.round(m.arm.length * up) + 2 - jump,
        S
      );
    }
  }

  /** Draws it into (X, Y, w, h), scaled down to fit if that's smaller. */
  return function draw(
    f: Frame,
    X: number,
    Y: number,
    w: number,
    h: number,
    s: CloseupState
  ) {
    X = Math.round(X);
    Y = Math.round(Y);
    w = Math.round(w);
    h = Math.round(h);
    if (w < 4 || h < 4) return;
    render(s);
    // a shadow under the frame, then the frame: dark outside, light inside
    for (let k = 1; k <= 2; k++) {
      for (let x = X + k; x < X + w + k; x++)
        f.blend(x, Y + h - 1 + k, P.frameDark, 0.5);
      for (let y = Y + k; y < Y + h + k - 1; y++)
        f.blend(X + w - 1 + k, y, P.frameDark, 0.5);
    }
    f.rect(X + 1, Y, w - 2, 1, P.frameDark);
    f.rect(X + 1, Y + h - 1, w - 2, 1, P.frameDark);
    f.rect(X, Y + 1, 1, h - 2, P.frameDark);
    f.rect(X + w - 1, Y + 1, 1, h - 2, P.frameDark);
    f.rect(X + 1, Y + 1, w - 2, 1, P.frameLight);
    f.rect(X + 1, Y + h - 2, w - 2, 1, P.frameLight);
    f.rect(X + 1, Y + 1, 1, h - 2, P.frameLight);
    f.rect(X + w - 2, Y + 1, 1, h - 2, P.frameLight);
    const dw = w - 4;
    const dh = h - 4;
    if (dw < 1 || dh < 1) return;
    if (dw === iw && dh === ih) {
      f.over(buf, X + 2, Y + 2);
      return;
    }
    // (opening or closing: the picture zoomed down into the frame)
    const src = buf.pixels;
    const dst = f.pixels;
    for (let y = 0; y < dh; y++) {
      const ty = Y + 2 + y;
      if (ty < 0 || ty >= f.h) continue;
      const sy = Math.min(ih - 1, Math.floor((y * ih) / dh));
      for (let x = 0; x < dw; x++) {
        const tx = X + 2 + x;
        if (tx < 0 || tx >= f.w) continue;
        dst[ty * f.w + tx] =
          src[sy * iw + Math.min(iw - 1, Math.floor((x * iw) / dw))]!;
      }
    }
  };
}
