import type { Scene } from '../scene';

// Every place, in the order they're listed. Each scene's code is loaded
// only when it's about to be shown (or warmed up just before), so the home
// page doesn't download all eighteen up front.

export type SceneEntry = {
  id: string;
  /** Shown straight away, before the scene's code has loaded. */
  name: string;
  country: string;
  /** The ids its runtime's eggs() uses, so the counter knows the total. */
  eggs: readonly string[];
  load: () => Promise<Scene>;
};

export const SCENES: SceneEntry[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    eggs: ['kaiju', 'ticket'],
    load: () => import('./tokyo').then((m) => m.tokyo),
  },
  {
    id: 'fuji',
    name: 'Fuji Five Lakes',
    country: 'Japan',
    eggs: ['ufo', 'fox'],
    load: () => import('./fuji').then((m) => m.fuji),
  },
  {
    id: 'izu',
    name: 'Izu Peninsula',
    country: 'Japan',
    eggs: ['forest', 'boar', 'skyline'],
    load: () => import('./izu').then((m) => m.izu),
  },
  {
    id: 'hakone',
    name: 'Hakone',
    country: 'Japan',
    eggs: ['capybara', 'black-egg'],
    load: () => import('./hakone').then((m) => m.hakone),
  },
  {
    id: 'gunma',
    name: 'Gunma',
    country: 'Japan',
    eggs: ['glasses', 'kappa'],
    load: () => import('./gunma').then((m) => m.gunma),
  },
  {
    id: 'kamakura',
    name: 'Kamakura & Enoshima',
    country: 'Japan',
    eggs: ['kite', 'stars'],
    load: () => import('./kamakura').then((m) => m.kamakura),
  },
  {
    id: 'yokohama',
    name: 'Yokohama',
    country: 'Japan',
    eggs: ['robot', 'wheel'],
    load: () => import('./yokohama').then((m) => m.yokohama),
  },
  {
    id: 'okinawa',
    name: 'Okinawa',
    country: 'Japan',
    eggs: ['shisa', 'turtle', 'snorkel'],
    load: () => import('./okinawa').then((m) => m.okinawa),
  },
  {
    id: 'fukuoka',
    name: 'Fukuoka',
    country: 'Japan',
    eggs: ['kaedama', 'uni'],
    load: () => import('./fukuoka').then((m) => m.fukuoka),
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    eggs: ['suv', 'sunrise', 'scooter'],
    load: () => import('./bali').then((m) => m.bali),
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: '',
    eggs: ['palm', 'sharks'],
    load: () => import('./maldives').then((m) => m.maldives),
  },
  {
    id: 'malta',
    name: 'Malta',
    country: '',
    eggs: ['promenade', 'balcony', 'luzzu-wink'],
    load: () => import('./malta').then((m) => m.malta),
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    eggs: ['bike-fishers', 'blizzard', 'light-switch'],
    load: () => import('./amsterdam').then((m) => m.amsterdam),
  },
  {
    id: 'kyiv',
    name: 'Kyiv',
    country: 'Ukraine',
    eggs: ['balloon', 'backpack', 'metro'],
    load: () => import('./kyiv').then((m) => m.kyiv),
  },
  {
    id: 'donetsk',
    name: 'Donetsk',
    country: 'Ukraine',
    eggs: ['flowers', 'kite'],
    load: () => import('./donetsk').then((m) => m.donetsk),
  },
  {
    id: 'mariupol',
    name: 'Mariupol',
    country: 'Ukraine',
    eggs: ['goby'],
    load: () => import('./mariupol').then((m) => m.mariupol),
  },
  {
    id: 'berdyansk',
    name: 'Berdyansk',
    country: 'Ukraine',
    eggs: ['cat', 'air-hockey', 'coins'],
    load: () => import('./berdyansk').then((m) => m.berdyansk),
  },
  {
    id: 'azov',
    name: 'Azov',
    country: 'Russia',
    eggs: ['bread', 'toys', 'cat'],
    load: () => import('./azov').then((m) => m.azov),
  },
  {
    id: 'nizhnevartovsk',
    name: 'Nizhnevartovsk',
    country: 'Russia',
    eggs: ['bench', 'bear'],
    load: () => import('./nizhnevartovsk').then((m) => m.nizhnevartovsk),
  },
];
