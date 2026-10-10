import { SCENES, type SceneEntry } from '../../src/art/scenes';

/** Days since the epoch, counted in Tokyo. */
export const tokyoDay = (now: Date) =>
  Math.floor((now.getTime() + 9 * 3_600_000) / 86_400_000);

// A fixed shuffle, so every place comes round once per cycle without the
// Japan ones bunching up.
const ORDER = (() => {
  const out = [...SCENES];
  let s = 2018;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
})();

/** The place on the banner for the given day. */
export const placeOf = (now: Date): SceneEntry =>
  ORDER[tokyoDay(now) % ORDER.length]!;

export const placeLabel = (s: SceneEntry) =>
  s.country ? `${s.name}, ${s.country}` : s.name;
