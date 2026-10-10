import { Frame, hex, type RGB } from './frame';

/** All scenes are this tall; width follows the screen. */
export const SCENE_H = 150;

/** Where the pointer is, in scene pixels. */
export type Pointer = { x: number; y: number };

export type SceneRuntime = {
  /** Draws the frame for time `t` (ms). */
  render(f: Frame, t: number, pointer?: Pointer | null): void;
  /** A click or tap at scene pixel (x, y). */
  poke?(x: number, y: number, t: number): void;
  /** Whether (x, y) is over something that reacts to a click. */
  hot?(x: number, y: number): boolean;
  /**
   * Where the scene's easter eggs can be set off right now: a click within
   * `r` of (x, y) finds egg `id`. The scene's own poke() still does the
   * egg's thing; the viewer only keeps score (and drops hints). A tap that
   * close to an egg (give or take a finger) is passed to poke() as a click
   * on the egg's own (x, y).
   */
  eggs?(t: number): EggSpot[];
};

/** A hidden easter egg's trigger. `id` is unique within its scene. */
export type EggSpot = { id: string; x: number; y: number; r: number };

export type Scene = {
  id: string;
  name: string;
  country: string;
  create(w: number, h: number): SceneRuntime;
};

/** Builds a transparent layer by running `draw` once. */
export function layer(w: number, h: number, draw: (f: Frame) => void) {
  const f = new Frame(w, h);
  draw(f);
  return f;
}

/** Turns a { key: '#hex' } object into { key: RGB }. */
export function palette<T extends Record<string, string>>(
  p: T
): { [K in keyof T]: RGB } {
  const out = {} as { [K in keyof T]: RGB };
  for (const k in p) out[k] = hex(p[k]!);
  return out;
}
