'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { bayer8, Frame } from '~/art/frame';
import {
  type EggSpot,
  type Pointer,
  SCENE_H,
  type Scene,
  type SceneRuntime,
} from '~/art/scene';
import { SCENES, type SceneEntry } from '~/art/scenes';
import { EggSlots, type Mood, useEggBurst } from './egg-hunt';
import { VIM_SCENE, type VimSceneDetail } from './vim-keys';

const STORAGE_KEY = 'scenes:v1';
const EGGS_KEY = 'eggs:found';
const PAUSED_KEY = 'scenes:paused';
const ROTATE_MS = 24_000;
const DISSOLVE_MS = 1_100;
// rows under the scene where its reflection melts into the page
const FADE = 28;
const FULL_H = SCENE_H + FADE;
const PAGE_BG = 0xff261b1a; // --color-bg (#1a1b26) as ABGR

/** Mixes an ABGR pixel towards the page background by d (0..1). */
function toPage(p: number, d: number) {
  const r = p & 0xff;
  const g = (p >>> 8) & 0xff;
  const b = (p >>> 16) & 0xff;
  return (
    (0xff000000 |
      (Math.round(b + (0x26 - b) * d) << 16) |
      (Math.round(g + (0x1b - g) * d) << 8) |
      Math.round(r + (0x1a - r) * d)) >>>
    0
  );
}

/**
 * Below the scene, its bottom rows mirrored, darkened in a few steps and
 * dissolved with the same ordered dither as the scene changes, so the
 * picture melts into the page instead of stopping at a hard edge.
 */
function melt(src: Frame, dst: Frame) {
  const w = src.w;
  dst.pixels.set(src.pixels);
  for (let k = 0; k < FADE; k++) {
    const y = SCENE_H + k;
    const u = (k + 1) / FADE;
    const d = 0.25 + (0.6 * Math.min(3, Math.floor(u * 4))) / 4;
    const from = (SCENE_H - 1 - k) * w;
    for (let x = 0, i = y * w; x < w; x++, i++)
      dst.pixels[i] =
        bayer8(x, y) < u ? PAGE_BG : toPage(src.pixels[from + x]!, d);
  }
}

type Rotation = { order: string[]; i: number };

/** Each visit shows the next place in a per-visitor shuffled order, Tokyo first. */
function nextRotation(): Rotation {
  const ids = SCENES.map((s) => s.id);
  let saved: Rotation | null = null;
  try {
    saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? 'null'
    ) as Rotation | null;
  } catch {
    saved = null;
  }
  // whatever's stored could be anything (an old format, an extension…)
  const valid =
    !!saved &&
    Array.isArray(saved.order) &&
    Number.isInteger(saved.i) &&
    saved.order.length === ids.length &&
    saved.order.every((id) => ids.includes(id));
  let rotation: Rotation;
  if (valid && saved) {
    rotation = { order: saved.order, i: (saved.i + 1) % saved.order.length };
  } else {
    const rest = ids.filter((id) => id !== 'tokyo');
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j]!, rest[i]!];
    }
    rotation = { order: ['tokyo', ...rest], i: 0 };
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rotation));
  } catch {
    // private mode: rotation just won't persist
  }
  return rotation;
}

function label(s: SceneEntry) {
  return s.country ? `${s.name}, ${s.country}` : s.name;
}

const BY_ID = new Map(SCENES.map((s) => [s.id, s]));
// every egg, as "scene:egg"
const ALL_EGGS = new Set(
  SCENES.flatMap((s) => s.eggs.map((e) => `${s.id}:${e}`))
);

// hint colours: the tap ring goes from cold to hot
const COLD = 0x7aa2f7;
const WARM = 0xff9e64;
const HOT = 0xffd54a;
const SPARK = 0xfff3b0;

/** How close (x, y) is to the nearest spot, 0 (far) to 1 (on it). */
function heat(spots: EggSpot[], x: number, y: number, reach = 48) {
  let best = 0;
  for (const s of spots) {
    const d = Math.max(0, Math.hypot(x - s.x, y - s.y) - s.r);
    best = Math.max(best, 1 - d / reach);
  }
  return best;
}

export function SceneViewer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, scale: 3 });
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  // eggs found so far, and the number on the counter (which waits for the
  // pixels to land)
  const foundRef = useRef(new Set<string>());
  const [shown, setShown] = useState<ReadonlySet<string>>(new Set());
  const slotRefs = useRef(new Map<string, HTMLSpanElement>());
  // how the place's eggs react to the last tap, and a note over them
  const [mood, setMood] = useState<{ mood: Mood; key: number } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const noteTimer = useRef(0);
  // when the hint (tapping the eggs) was asked for
  const hintAt = useRef(-Infinity);
  // the hot/cold ring left by a tap that wasn't on an egg
  const ring = useRef<{ x: number; y: number; at: number; heat: number }>(null);
  // only announce a new place when someone asked for it, not on the timer
  const [announce, setAnnounce] = useState(false);
  // bumps when a scene's code arrives, so the page picks it up
  const [, setLoadedCount] = useState(0);
  const pausedUntil = useRef(0);
  const pointer = useRef<Pointer | null>(null);
  const clock = useRef(0); // the time of the last frame drawn
  // A switch dissolves from the place on screen (`from`, still running) or,
  // when another switch is under way, from a still of the screen (`still`).
  // start < 0: the dissolve begins when the new scene is ready to draw.
  const transition = useRef<{
    from: string | null;
    still: Uint32Array;
    w: number;
    start: number;
  } | null>(null);
  // the place last drawn in full, and the last frame drawn
  const onScreen = useRef<string | null>(null);
  const lastFrame = useRef<{ w: number; px: Uint32Array } | null>(null);
  const runtimes = useRef(new Map<string, SceneRuntime>());
  const loaded = useRef(new Map<string, Scene>());
  const loading = useRef(new Map<string, Promise<Scene>>());

  /** The scene's code, loading it the first time it's asked for. */
  const ensure = useCallback((id: string) => {
    let p = loading.current.get(id);
    if (!p) {
      const entry = SCENES.find((s) => s.id === id);
      if (!entry) return Promise.reject(new Error(`no scene ${id}`));
      p = entry.load().then((scene) => {
        loaded.current.set(id, scene);
        setLoadedCount((n) => n + 1);
        return scene;
      });
      // a failed load (offline, say) can be tried again later
      p.catch(() => loading.current.delete(id));
      loading.current.set(id, p);
    }
    return p;
  }, []);

  // pick where this visit starts
  useEffect(() => {
    const rotation = nextRotation();
    setOrder(rotation.order);
    setIndex(rotation.i);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    try {
      setPaused(localStorage.getItem(PAUSED_KEY) === '1');
      const saved: unknown = JSON.parse(localStorage.getItem(EGGS_KEY) ?? '[]');
      if (Array.isArray(saved))
        for (const e of saved)
          if (typeof e === 'string' && ALL_EGGS.has(e)) foundRef.current.add(e);
      setShown(new Set(foundRef.current));
    } catch {
      // private mode: eggs just won't be remembered
    }
  }, []);

  // integer pixel scale; the scene's width follows the screen
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const scale = window.matchMedia('(min-width: 48rem)').matches ? 3 : 2;
      const w = Math.ceil(wrap.clientWidth / scale);
      setSize((s) => (s.w === w && s.scale === scale ? s : { w, scale }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  /** The running scene at this width, or null while its code loads. */
  const runtimeFor = useCallback(
    (id: string) => {
      let rt = runtimes.current.get(id);
      if (!rt) {
        const scene = loaded.current.get(id);
        if (!scene) return null;
        rt = scene.create(size.w, SCENE_H);
        runtimes.current.set(id, rt);
      }
      return rt;
    },
    [size.w]
  );

  // a new width means new runtimes; let the old ones go
  useEffect(() => {
    runtimes.current.clear();
  }, [size.w]);

  const go = useCallback(
    (delta: number, user: boolean) => {
      if (!order.length) return;
      // fade from whatever is on screen right now, even mid-dissolve or
      // while the last place's code is still on its way
      const last = lastFrame.current;
      transition.current =
        reducedMotion || !last
          ? null
          : {
              from: transition.current ? null : onScreen.current,
              still: last.px.slice(),
              w: last.w,
              start: -1,
            };
      setIndex((i) => (i + delta + order.length) % order.length);
      setAnnounce(user);
      if (user) pausedUntil.current = performance.now() + 60_000;
    },
    [order, reducedMotion]
  );

  // a new place: its eggs start calm
  useEffect(() => {
    setMood(null);
  }, [index]);

  // h / l (and :N) from the vim keys
  useEffect(() => {
    const onVim = (e: Event) => {
      const { delta, index: to } = (e as CustomEvent<VimSceneDetail>).detail;
      if (to !== undefined && order.length) {
        const n = order.length;
        go((((to % n) + n) % n) - index, true);
      } else if (delta) go(delta, true);
    };
    window.addEventListener(VIM_SCENE, onVim);
    return () => window.removeEventListener(VIM_SCENE, onVim);
  }, [go, index, order.length]);

  // whether the current place's code has arrived: the render loop below
  // starts (again) when it does
  const currentId = order[index];
  const currentReady = !!currentId && loaded.current.has(currentId);

  // render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const id = order[index];
    if (!canvas || !ctx || !id || !size.w) return;
    const current = runtimeFor(id);
    if (!current) {
      // keep showing the last frame until this one's code is here
      void ensure(id).catch(() => undefined);
      return;
    }
    const w = size.w;
    const out = new Frame(w, SCENE_H);
    const a = new Frame(w, SCENE_H);
    const b = new Frame(w, SCENE_H);
    const full = new Frame(w, FULL_H);
    const image = new ImageData(full.rgba(), w, FULL_H);
    if (transition.current && transition.current.start < 0)
      transition.current.start = performance.now();
    onScreen.current = id;
    const shot =
      lastFrame.current?.w === w
        ? lastFrame.current
        : { w, px: new Uint32Array(w * SCENE_H) };
    lastFrame.current = shot;

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => (visible = !!e?.isIntersecting)
    );
    io.observe(canvas);

    let raf = 0;
    let last = 0;
    let shownAt = performance.now();
    const hidden = () =>
      (current.eggs?.(clock.current) ?? []).filter((e) => {
        const key = `${id}:${e.id}`;
        return ALL_EGGS.has(key) && !foundRef.current.has(key);
      });
    /** Hot/cold sparkles at the cursor, the tap ring, and the odd glint. */
    const hints = (now: number) => {
      const spots = hidden();
      // sparkles round the cursor, more and brighter the closer it gets
      const p = pointer.current;
      if (p && spots.length) {
        const h = heat(spots, p.x, p.y);
        const n = h > 0 ? Math.ceil(h * h * 6) : 0;
        for (let k = 0; k < n; k++) {
          const tick = Math.floor(now / 110) + k * 7;
          const a = ((tick * 2654435761) % 1000) / 1000;
          const d = 4 + (((tick * 40503) % 100) / 100) * (9 - h * 4);
          const x = Math.round(p.x + Math.cos(a * 6.283) * d);
          const y = Math.round(p.y + Math.sin(a * 6.283) * d);
          out.set(x, y, h > 0.85 && k % 2 ? HOT : SPARK);
          if (h > 0.6) out.set(x + 1, y, HOT);
        }
      }
      // the rings from the last tap, wide enough to show round a finger:
      // blue when cold, orange when warm, gold when hot
      const rg = ring.current;
      if (rg) {
        const age = (now - rg.at) / 900;
        if (age >= 1) ring.current = null;
        else {
          const c = rg.heat > 0.7 ? HOT : rg.heat > 0.35 ? WARM : COLD;
          for (const lag of [0, 0.22]) {
            const u = age - lag;
            if (u <= 0) continue;
            const rad = 4 + u * 22;
            const steps = Math.ceil(rad * 6);
            for (let k = 0; k < steps; k++) {
              if (bayer8(k, Math.floor(u * 8)) < u * 0.9) continue;
              const a = (k / steps) * 6.283;
              out.set(
                Math.round(rg.x + Math.cos(a) * rad),
                Math.round(rg.y + Math.sin(a) * rad * 0.8),
                c
              );
            }
          }
        }
      }
      const star = (x: number, y: number, arm: number) => {
        out.set(x, y, 0xffffff);
        for (let k = 1; k <= arm; k++) {
          const c = k === arm ? HOT : SPARK;
          out.set(x - k, y, c);
          out.set(x + k, y, c);
          out.set(x, y - k, c);
          out.set(x, y + k, c);
        }
        if (arm > 2) {
          out.set(x - 1, y - 1, SPARK);
          out.set(x + 1, y - 1, SPARK);
          out.set(x - 1, y + 1, SPARK);
          out.set(x + 1, y + 1, SPARK);
        }
      };
      // asked for a hint: every hidden egg here twinkles for a bit
      if (now - hintAt.current < 2200)
        spots.forEach((s, i) => {
          const ph = Math.floor((now - hintAt.current) / 140 + i * 2) % 4;
          star(s.x, s.y, [1, 2, 3, 2][ph]!);
        });
      // now and then, a glint where something's hidden
      const cycle = Math.floor((now - shownAt - 3000) / 7000);
      const into = (now - shownAt - 3000) % 7000;
      if (cycle >= 0 && into < 900 && spots.length) {
        const s = spots[cycle % spots.length]!;
        star(s.x, s.y, into < 200 ? 1 : into < 450 ? 2 : into < 700 ? 3 : 1);
      }
    };
    const draw = (now: number) => {
      clock.current = now;
      // a switch asked for this frame hasn't reached the new place yet
      const tr =
        transition.current && transition.current.start >= 0
          ? transition.current
          : null;
      const p = tr ? (now - tr.start) / DISSOLVE_MS : 1;
      if (tr && p >= 1) transition.current = null;
      const from = tr && p < 1 && tr.from ? runtimeFor(tr.from) : null;
      const still = tr && p < 1 && !from && tr.w === w ? tr.still : null;
      if (from || still) {
        if (from) from.render(a, now);
        current.render(b, now, pointer.current);
        const src = from ? a.pixels : still!;
        for (let y = 0, i = 0; y < SCENE_H; y++) {
          for (let x = 0; x < w; x++, i++)
            out.pixels[i] = bayer8(x, y) < p ? b.pixels[i]! : src[i]!;
        }
      } else {
        current.render(
          out,
          reducedMotion ? 6_000 : now,
          reducedMotion ? null : pointer.current
        );
        if (!reducedMotion) {
          hints(now);
        }
      }
      shot.px.set(out.pixels);
      melt(out, full);
      ctx.putImageData(image, 0, 0);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      if (reducedMotion && !transition.current && last) return;
      if (now - last < 1000 / 30) return;
      last = now;
      draw(now);
      if (
        !reducedMotion &&
        !paused &&
        now - shownAt > ROTATE_MS &&
        now > pausedUntil.current
      ) {
        shownAt = now;
        go(1, false);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [
    order,
    index,
    currentReady,
    size.w,
    reducedMotion,
    paused,
    runtimeFor,
    ensure,
    go,
  ]);

  // fetch the code of the places either side soon, so flicking through
  // doesn't wait on the network, and warm up the next one during idle
  // time, so the switch doesn't stutter
  useEffect(() => {
    const n = Math.max(1, order.length);
    const next = order[(index + 1) % n];
    const prev = order[(index - 1 + n) % n];
    if (!next || !prev || !size.w) return;
    const fetchSoon = window.setTimeout(() => {
      for (const id of [next, prev]) void ensure(id).catch(() => undefined);
    }, 400);
    const warm = window.setTimeout(() => {
      ensure(next)
        .then(() => runtimeFor(next))
        .catch(() => undefined);
    }, 2_000);
    return () => {
      window.clearTimeout(fetchSoon);
      window.clearTimeout(warm);
    };
  }, [order, index, size.w, runtimeFor, ensure]);

  const id = order[index];
  const scene = id ? loaded.current.get(id) : undefined;
  const entry = id ? BY_ID.get(id) : undefined;
  const { launch, overlay } = useEggBurst(size.scale);
  const say = (text: string) => {
    setNote(text);
    window.clearTimeout(noteTimer.current);
    noteTimer.current = window.setTimeout(() => setNote(null), 2600);
  };
  const placeEggs = (entry?.eggs ?? []).map((egg) => ({
    id: egg,
    found: shown.has(`${entry!.id}:${egg}`),
  }));
  /** Forget every egg found, for another go at the hunt. */
  const resetEggs = () => {
    foundRef.current.clear();
    try {
      localStorage.removeItem(EGGS_KEY);
    } catch {
      // fine
    }
    setShown(new Set());
    say(`fresh start: 0/${ALL_EGGS.size}`);
  };
  /** Tapping the eggs: make every hidden one here twinkle. */
  const hint = () => {
    if (!entry || !scene) return;
    const rt = runtimeFor(scene.id);
    const t = clock.current || performance.now();
    const hiddenNow = (rt?.eggs?.(t) ?? []).filter(
      (s) => !foundRef.current.has(`${entry.id}:${s.id}`)
    );
    if (placeEggs.every((e) => e.found)) say('all found here');
    else if (!hiddenNow.length) say('nothing showing right now. try later');
    else {
      hintAt.current = t;
      pausedUntil.current = performance.now() + 45_000;
    }
  };
  const togglePause = () => {
    const v = !paused;
    setPaused(v);
    try {
      if (v) localStorage.setItem(PAUSED_KEY, '1');
      else localStorage.removeItem(PAUSED_KEY);
    } catch {
      // fine
    }
  };

  const toScene = (e: React.PointerEvent<HTMLCanvasElement>): Pointer => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.floor(((e.clientX - r.left) / r.width) * size.w),
      y: Math.floor(((e.clientY - r.top) / r.height) * FULL_H),
    };
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType !== 'mouse' || !scene) return;
    const p = toScene(e);
    // the melted reflection below the scene isn't part of it
    pointer.current = p.y < SCENE_H ? p : null;
    const rt = runtimeFor(scene.id);
    const onEgg = (rt?.eggs?.(clock.current) ?? []).some(
      (e) => Math.hypot(p.x - e.x, p.y - e.y) <= e.r
    );
    e.currentTarget.style.cursor =
      p.y < SCENE_H && (onEgg || rt?.hot?.(p.x, p.y)) ? 'pointer' : 'default';
  };
  const onLeave = () => {
    pointer.current = null;
  };
  const onPoke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!scene || reducedMotion) return;
    const p = toScene(e);
    if (p.y >= SCENE_H) return;
    const rt = runtimeFor(scene.id);
    if (!rt) return;
    // on the render clock, so a scene never sees a click from its future
    const t = clock.current || performance.now();
    // the eggs out right now, before the click changes anything
    const listed = rt.eggs?.(t) ?? [];
    // fingers are blunt: a tap gets some slack round each egg, and a tap
    // that close goes to the egg itself, so its show always plays when
    // it's counted
    const slack = e.pointerType === 'touch' ? 6 : 2;
    let near: EggSpot | undefined;
    let best = Infinity;
    for (const s of listed) {
      const d = Math.hypot(p.x - s.x, p.y - s.y) - s.r;
      if (d <= slack && d < best) {
        near = s;
        best = d;
      }
    }
    rt.poke?.(near ? near.x : p.x, near ? near.y : p.y, t);
    // someone's playing with it: don't rotate away under them
    pausedUntil.current = performance.now() + 45_000;

    // only eggs the counter knows about count, once
    const hiddenHere = (s: EggSpot) => {
      const key = `${scene.id}:${s.id}`;
      return ALL_EGGS.has(key) && !foundRef.current.has(key);
    };
    const spots = listed.filter(hiddenHere);
    const egg = near && hiddenHere(near) ? near : undefined;
    if (egg) {
      const key = `${scene.id}:${egg.id}`;
      foundRef.current.add(key);
      try {
        localStorage.setItem(EGGS_KEY, JSON.stringify([...foundRef.current]));
      } catch {
        // fine
      }
      ring.current = null;
      setMood(null);
      launch(
        { x: e.clientX, y: e.clientY },
        slotRefs.current.get(egg.id),
        () => {
          setShown(new Set(foundRef.current));
          say(`${foundRef.current.size}/${ALL_EGGS.size} found`);
        }
      );
    } else if (spots.length) {
      const h = heat(spots, p.x, p.y);
      ring.current = { x: p.x, y: p.y, at: t, heat: h };
      // and the eggs under the picture answer too, where a finger can't
      // hide it
      setMood({
        mood: h > 0.7 ? 'hot' : h > 0.35 ? 'warm' : 'cold',
        key: t,
      });
    }
  };

  return (
    <section aria-label="Pixel art of places I've lived in or visited">
      <div
        ref={wrapRef}
        className="relative h-[356px] w-full overflow-hidden md:h-[534px]"
      >
        <canvas
          ref={canvasRef}
          width={size.w || 1}
          height={FULL_H}
          className="block [image-rendering:pixelated]"
          style={{ width: size.w * size.scale, height: FULL_H * size.scale }}
          role="img"
          aria-label={entry ? `Pixel art: ${label(entry)}` : 'Pixel art'}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onPointerDown={onPoke}
        />
      </div>
      <div className="page text-muted flex items-center justify-between gap-4 pt-3 text-xs">
        <p
          aria-live={announce ? 'polite' : 'off'}
          className="min-h-[1.25rem] min-w-0 flex-1 truncate"
        >
          {entry ? label(entry) : ' '}
        </p>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {placeEggs.length > 0 && (
            <EggSlots
              eggs={placeEggs}
              foundAll={shown.size}
              total={ALL_EGGS.size}
              mood={mood}
              note={note}
              slotRefs={slotRefs}
              onHint={hint}
              onReset={resetEggs}
            />
          )}
          <button
            type="button"
            onClick={() => go(-1, true)}
            className="hover:text-fg px-1"
            aria-label="previous place"
          >
            ←
          </button>
          <span className="tabular-nums">
            {order.length ? `${index + 1}/${order.length}` : ''}
          </span>
          {!reducedMotion && (
            <button
              type="button"
              onClick={togglePause}
              className="hover:text-fg px-1"
              aria-label={paused ? 'play the places' : 'pause the places'}
              aria-pressed={paused}
              title={paused ? 'play' : 'pause'}
            >
              {paused ? '▶' : '❚❚'}
            </button>
          )}
          <button
            type="button"
            onClick={() => go(1, true)}
            className="hover:text-fg px-1"
            aria-label="next place"
          >
            →
          </button>
        </div>
      </div>
      {overlay}
    </section>
  );
}
