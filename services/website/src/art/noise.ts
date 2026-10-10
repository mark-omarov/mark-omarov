// Deterministic randomness: every scene looks the same on every load.

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash2(x: number, y: number, seed = 0) {
  let h =
    (Math.imul(x | 0, 374761393) +
      Math.imul(y | 0, 668265263) +
      Math.imul(seed, 982451653)) |
    0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function noise1(x: number, seed = 0) {
  const i = Math.floor(x);
  const f = smooth(x - i);
  return hash2(i, 0, seed) * (1 - f) + hash2(i + 1, 0, seed) * f;
}

export function noise2(x: number, y: number, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);
  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}

export function fbm1(x: number, seed = 0, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise1(x * freq, seed + o * 17) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

export function fbm2(x: number, y: number, seed = 0, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise2(x * freq, y * freq, seed + o * 31) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

/** 1D fbm that repeats every `period` units, for tiling strips. */
export function pfbm1(x: number, period: number, seed = 0, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    const p = period * freq;
    const xx = x * freq;
    const i = Math.floor(xx);
    const f = xx - i;
    const s = f * f * (3 - 2 * f);
    const a = hash2(((i % p) + p) % p, 0, seed + o * 17);
    const b = hash2((((i + 1) % p) + p) % p, 0, seed + o * 17);
    sum += (a * (1 - s) + b * s) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}
