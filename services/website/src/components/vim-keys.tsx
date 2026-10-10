'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

// Vim keys for the whole site: scrolling, link hints, search, a command
// line and a few "go to" shortcuts. Single-key shortcuts can get in the way
// (screen readers, voice control), so they can be switched off with
// `:set novim` or from the help (`?`), and the choice is remembered.

export type VimTarget = { title: string; href: string };

/** Asks the home page's scene viewer to change place. */
export const VIM_SCENE = 'vim:scene';
export type VimSceneDetail = { delta?: number; index?: number };
/** Opens the help from anywhere (the footer hint uses it). */
export const VIM_HELP = 'vim:help';

const OFF_KEY = 'vim:off';
const HINT_CHARS = 'sadfjklewcmpgh';
const LINE = 64; // px per j/k

const PAGES: VimTarget[] = [
  { title: 'home', href: '/' },
  { title: 'blog', href: '/blog' },
  { title: 'learned', href: '/learned' },
];

const COMMANDS = [
  'blog',
  'learned',
  'home',
  'help',
  'e ',
  'q',
  'rss',
  'set novim',
];

// every sequence normal mode acts on, and the ones that wait for more
const BOUND = new Set([
  'j',
  'k',
  'd',
  'u',
  'G',
  'gg',
  ']]',
  '[[',
  'h',
  'l',
  'H',
  'L',
  'f',
  'F',
  'gh',
  'gU',
  'gb',
  'gl',
  'gu',
  'yy',
  'n',
  'N',
  '/',
  ':',
  '?',
]);
const PREFIXES = new Set(['g', ']', '[', 'y']);

type Hint = { el: HTMLElement; label: string; x: number; y: number };
type Prompt = { kind: ':' | '/'; value: string; pick: number };

const KEYS: [string, string][] = [
  ['j / k', 'scroll down / up (takes a count, like 5j)'],
  ['d / u', 'half a page down / up'],
  ['gg / G', 'top / bottom'],
  [']] / [[', 'next / previous section'],
  ['f / F', 'link hints (F opens in a new tab)'],
  ['h / l', 'previous / next place on the home page'],
  ['H / L', 'back / forward'],
  ['gh gb gl', 'go home / blog / learned'],
  ['gu', 'up a level'],
  ['/  n  N', 'search the page, next / previous match (esc clears)'],
  [':', 'command line (:e post, :blog, :q, :help…)'],
  ['yy', 'copy the page address'],
  ['?', 'this help'],
  ['esc', 'cancel'],
];

const editable = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

const openDialog = () =>
  document.querySelector<HTMLDialogElement>('dialog[open]');

/** Prefix-free labels of equal length from the home-row characters. */
function labels(n: number) {
  const k = HINT_CHARS.length;
  let len = 1;
  while (k ** len < n) len++;
  return Array.from({ length: n }, (_, i) => {
    let s = '';
    for (let j = 0, v = i; j < len; j++, v = Math.floor(v / k))
      s = HINT_CHARS[v % k]! + s;
    return s;
  });
}

/** Everything clickable that's on screen, inside `root`. */
function clickables(root: ParentNode): HTMLElement[] {
  const els = root.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), summary, [role="button"], input:not([type="hidden"]), select, textarea'
  );
  return [...els].filter((el) => {
    if (el.closest('[inert], [aria-hidden="true"], .sr-only')) return false;
    const vis = (el as { checkVisibility?: (o: object) => boolean })
      .checkVisibility;
    if (
      vis &&
      !vis.call(el, { opacityProperty: true, visibilityProperty: true })
    )
      return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (r.bottom < 0 || r.right < 0) return false;
    if (r.top > innerHeight || r.left > innerWidth) return false;
    const st = getComputedStyle(el);
    return st.visibility !== 'hidden' && st.opacity !== '0';
  });
}

type HighlightCtor = new (...ranges: Range[]) => unknown;
type HighlightRegistry = {
  set(name: string, h: unknown): void;
  delete(name: string): void;
};
const highlights = () =>
  (globalThis.CSS as unknown as { highlights?: HighlightRegistry } | undefined)
    ?.highlights;

/** Ranges for every case-insensitive match of q in the page's visible text. */
function textMatches(q: string): Range[] {
  const root = openDialog() ?? document.querySelector('main') ?? document.body;
  const needle = q.toLowerCase();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const el = n.parentElement;
      if (!el || el.closest('.sr-only, [aria-hidden="true"], script, style'))
        return NodeFilter.FILTER_REJECT;
      return el.getClientRects().length
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const out: Range[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = (n.nodeValue ?? '').toLowerCase();
    for (
      let i = text.indexOf(needle);
      i >= 0;
      i = text.indexOf(needle, i + 1)
    ) {
      const r = document.createRange();
      r.setStart(n, i);
      r.setEnd(n, i + needle.length);
      out.push(r);
    }
  }
  return out;
}

/** How well `q` matches `s`: higher is better, 0 is no match. */
function score(s: string, q: string) {
  const a = s.toLowerCase();
  const b = q.toLowerCase().trim();
  if (!b) return 1;
  const at = a.indexOf(b);
  if (at === 0) return 100;
  if (at > 0) return 60 - Math.min(at, 40) + (a[at - 1] === ' ' ? 20 : 0);
  // letters in order, anywhere
  let i = 0;
  for (const ch of a) if (ch === b[i]) i++;
  return i === b.length ? 10 : 0;
}

export function VimKeys({ posts }: { posts: VimTarget[] }) {
  const router = useRouter();
  const path = usePathname();
  const [on, setOn] = useState(true);
  const [pending, setPending] = useState('');
  const [message, setMessage] = useState('');
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [hints, setHints] = useState<{
    items: Hint[];
    typed: string;
    tab: boolean;
    host: HTMLElement;
  } | null>(null);
  const [help, setHelp] = useState(false);
  const helpRef = useRef<HTMLDialogElement>(null);
  const lastFind = useRef('');
  const msgTimer = useRef(0);

  // latest state for the window listener
  const st = useRef({ on, pending, prompt, hints, help, path });
  st.current = { on, pending, prompt, hints, help, path };

  useEffect(() => {
    try {
      setOn(localStorage.getItem(OFF_KEY) !== '1');
    } catch {
      // stays on
    }
  }, []);

  const say = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(msgTimer.current);
    msgTimer.current = window.setTimeout(() => setMessage(''), 2600);
  }, []);

  const setEnabled = useCallback(
    (v: boolean) => {
      setOn(v);
      try {
        if (v) localStorage.removeItem(OFF_KEY);
        else localStorage.setItem(OFF_KEY, '1');
      } catch {
        // fine
      }
      say(
        v
          ? 'vim keys on'
          : 'vim keys off. :set vim or the footer turns them back on'
      );
    },
    [say]
  );

  const targets = useCallback(() => [...PAGES, ...posts], [posts]);

  const go = useCallback(
    (href: string) => {
      if (href.endsWith('.xml')) window.location.href = href;
      else router.push(href);
    },
    [router]
  );

  const scrollBy = useCallback((dy: number, instant = false) => {
    const d = openDialog();
    const el: HTMLElement | Window =
      d && d.scrollHeight > d.clientHeight ? d : window;
    el.scrollBy({ top: dy, behavior: instant ? 'instant' : 'smooth' });
  }, []);

  const findAt = useRef(-1);
  /**
   * Searches the page's text (not window.find, which isn't standard and
   * doesn't work everywhere): every match is highlighted, the current one
   * is selected and scrolled to. `step` 0 starts from the top of the screen,
   * 1 / -1 go to the next / previous match, wrapping round like vim.
   */
  const find = useCallback(
    (q: string, step: 0 | 1 | -1) => {
      if (!q) return;
      const ranges = textMatches(q);
      const reg = highlights();
      if (!ranges.length) {
        reg?.delete('vim-search');
        reg?.delete('vim-current');
        say(`E486: Pattern not found: ${q}`);
        return;
      }
      let i: number;
      let note = '';
      if (step === 0) {
        i = ranges.findIndex((r) => r.getBoundingClientRect().top > 0);
        if (i < 0) i = 0;
      } else {
        i = findAt.current + step;
        if (i >= ranges.length) {
          i = 0;
          note = ' search hit BOTTOM, continuing at TOP';
        } else if (i < 0) {
          i = ranges.length - 1;
          note = ' search hit TOP, continuing at BOTTOM';
        }
      }
      findAt.current = i;
      const r = ranges[i]!;
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
      if (reg) {
        const H = (window as unknown as { Highlight: HighlightCtor }).Highlight;
        reg.set('vim-search', new H(...ranges));
        reg.set('vim-current', new H(r));
      }
      const box = r.getBoundingClientRect();
      const d = openDialog();
      if (d)
        r.startContainer.parentElement?.scrollIntoView({ block: 'center' });
      else if (box.top < 60 || box.bottom > innerHeight - 60)
        window.scrollTo({
          top: window.scrollY + box.top - innerHeight / 3,
          behavior: 'smooth',
        });
      say(`/${q} [${i + 1}/${ranges.length}]${note}`);
    },
    [say]
  );

  const startHints = useCallback(
    (tab: boolean) => {
      const d = openDialog();
      const host = d ?? document.body;
      const els = clickables(d ?? document);
      if (!els.length) return say('no links here');
      const names = labels(els.length);
      const base = d?.getBoundingClientRect();
      setHints({
        tab,
        typed: '',
        host,
        items: els.map((el, i) => {
          const r = el.getBoundingClientRect();
          return {
            el,
            label: names[i]!,
            // inside a dialog, relative to it (it scrolls); else the viewport
            x: base ? r.left - base.left + d!.scrollLeft : r.left,
            y: base ? r.top - base.top + d!.scrollTop : r.top,
          };
        }),
      });
    },
    [say]
  );

  const activate = useCallback((el: HTMLElement, tab: boolean) => {
    const href = el instanceof HTMLAnchorElement ? el.href : null;
    if (tab && href) {
      window.open(href, '_blank', 'noopener');
      return;
    }
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
      el.focus();
      return;
    }
    el.focus({ preventScroll: true });
    el.click();
  }, []);

  const section = useCallback((dir: 1 | -1) => {
    const hs = [
      ...document.querySelectorAll<HTMLElement>('main h1, main h2, main h3'),
    ];
    const y = (el: HTMLElement) => el.getBoundingClientRect().top;
    const next =
      dir === 1
        ? hs.find((el) => y(el) > 12)
        : [...hs].reverse().find((el) => y(el) < -4);
    if (next) {
      const top = window.scrollY + y(next) - 16;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    } else if (dir === 1)
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const completions = useCallback(
    (value: string): string[] => {
      const m = /^(e|edit|o|open)\s+(.*)$/.exec(value);
      if (m) {
        return targets()
          .map((t) => ({ t, s: score(t.title, m[2]!) }))
          .filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s)
          .slice(0, 6)
          .map((x) => `${m[1]} ${x.t.title}`);
      }
      if (!value || value.includes(' ')) return [];
      return COMMANDS.filter((c) => c.startsWith(value) && c !== value);
    },
    [targets]
  );

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      const [name = '', ...rest] = cmd.split(/\s+/);
      const arg = rest.join(' ');
      if (!cmd) return;
      if (/^\d+$/.test(cmd)) {
        if (st.current.path === '/')
          window.dispatchEvent(
            new CustomEvent<VimSceneDetail>(VIM_SCENE, {
              detail: { index: Number(cmd) - 1 },
            })
          );
        else {
          const max = document.documentElement.scrollHeight - innerHeight;
          window.scrollTo({
            top: (max * Math.min(100, Number(cmd))) / 100,
            behavior: 'smooth',
          });
        }
        return;
      }
      switch (name) {
        case 'q':
        case 'q!':
        case 'quit':
        case 'wq':
        case 'x':
        case 'close': {
          const d = openDialog();
          if (d) d.close();
          else say("can't quit the web. try :home");
          return;
        }
        case 'h':
        case 'help':
          setHelp(true);
          return;
        case 'noh':
        case 'nohlsearch':
          highlights()?.delete('vim-search');
          highlights()?.delete('vim-current');
          return;
        case 'home':
          go('/');
          return;
        case 'blog':
        case 'learned':
          go(`/${name}`);
          return;
        case 'rss':
          go('/rss.xml');
          return;
        case 'e':
        case 'edit':
        case 'o':
        case 'open': {
          const best = targets()
            .map((t) => ({ t, s: score(t.title, arg) }))
            .filter((x) => x.s > 0)
            .sort((a, b) => b.s - a.s)[0];
          if (best && arg) go(best.t.href);
          else say(`E32: No file name${arg ? ` matching ${arg}` : ''}`);
          return;
        }
        case 'set':
          if (arg === 'novim' || arg === 'vim!') setEnabled(false);
          else if (arg === 'vim') setEnabled(true);
          else say(`E518: Unknown option: ${arg}`);
          return;
        default:
          say(`E492: Not an editor command: ${cmd}`);
      }
    },
    [go, say, setEnabled, targets]
  );

  // normal mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = st.current;
      if (e.defaultPrevented || e.isComposing) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (editable(e.target)) return;

      // typing a hint
      if (s.hints) {
        e.preventDefault();
        if (e.key === 'Escape') return setHints(null);
        const typed =
          e.key === 'Backspace'
            ? s.hints.typed.slice(0, -1)
            : HINT_CHARS.includes(e.key.toLowerCase())
              ? s.hints.typed + e.key.toLowerCase()
              : s.hints.typed;
        const left = s.hints.items.filter((h) => h.label.startsWith(typed));
        if (!left.length) return setHints(null);
        if (left.length === 1 && left[0]!.label === typed) {
          setHints(null);
          activate(left[0]!.el, s.hints.tab);
          return;
        }
        setHints({ ...s.hints, typed });
        return;
      }

      if (!s.on) return;
      if (s.help) {
        if (e.key === '?' || e.key === 'q') {
          e.preventDefault();
          setHelp(false);
        }
        return;
      }
      if (e.key === 'Escape') {
        if (s.pending) {
          setPending('');
          e.preventDefault();
        }
        highlights()?.delete('vim-search');
        highlights()?.delete('vim-current');
        return; // native dialogs still close on Esc
      }
      if (e.key.length !== 1) return;

      const seq = s.pending + e.key;
      const count = Number(/^\d+/.exec(seq)?.[0] ?? '1') || 1;
      const keys = seq.replace(/^\d+/, '');
      const done = () => setPending('');

      // a count in progress (0 on its own isn't a count)
      if (/^[1-9]\d*$/.test(seq)) {
        e.preventDefault();
        return setPending(seq);
      }
      // anything that isn't ours (Space, letters we don't use…) goes
      // through to the page untouched
      if (!BOUND.has(keys) && !PREFIXES.has(keys)) return done();
      e.preventDefault();

      const inDialog = !!openDialog();
      switch (keys) {
        case 'j':
          scrollBy(LINE * count, e.repeat);
          return done();
        case 'k':
          scrollBy(-LINE * count, e.repeat);
          return done();
        case 'd':
          scrollBy((innerHeight / 2) * count);
          return done();
        case 'u':
          scrollBy((-innerHeight / 2) * count);
          return done();
        case 'G':
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
          return done();
        case 'gg':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return done();
        case ']]':
          section(1);
          return done();
        case '[[':
          section(-1);
          return done();
        case 'h':
        case 'l':
          if (s.path === '/')
            window.dispatchEvent(
              new CustomEvent<VimSceneDetail>(VIM_SCENE, {
                detail: { delta: (keys === 'l' ? 1 : -1) * count },
              })
            );
          return done();
        case 'H':
          history.back();
          return done();
        case 'L':
          history.forward();
          return done();
        case 'f':
        case 'F':
          startHints(keys === 'F');
          return done();
        case 'gh':
        case 'gU':
          go('/');
          return done();
        case 'gb':
          go('/blog');
          return done();
        case 'gl':
          go('/learned');
          return done();
        case 'gu': {
          const up = s.path.replace(/\/[^/]+\/?$/, '') || '/';
          if (up !== s.path) go(up);
          return done();
        }
        case 'yy':
          void navigator.clipboard
            ?.writeText(location.href)
            .then(() => say(`yanked ${location.href}`))
            .catch(() => say("couldn't copy"));
          return done();
        case 'n':
        case 'N':
          find(lastFind.current, keys === 'N' ? -1 : 1);
          return done();
        case '/':
        case ':':
          // a modal dialog makes everything outside it inert, prompt included
          if (inDialog) say('close the dialog first (esc)');
          else setPrompt({ kind: keys, value: '', pick: -1 });
          return done();
        case '?':
          setHelp(true);
          return done();
        case 'g':
        case ']':
        case '[':
        case 'y':
          return setPending(seq);
        default:
          return done();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activate, find, go, say, scrollBy, section, startHints]);

  // the footer's hint opens the help, and turns the keys back on
  useEffect(() => {
    const open = () => {
      setOn(true);
      try {
        localStorage.removeItem(OFF_KEY);
      } catch {
        // fine
      }
      setHelp(true);
    };
    window.addEventListener(VIM_HELP, open);
    return () => window.removeEventListener(VIM_HELP, open);
  }, []);

  // help is a real modal dialog
  useEffect(() => {
    const d = helpRef.current;
    if (!d) return;
    if (help && !d.open) d.showModal();
    if (!help && d.open) d.close();
  }, [help]);

  // hints go away if the page moves under them
  useEffect(() => {
    if (!hints) return;
    const clear = () => setHints(null);
    window.addEventListener('scroll', clear, { passive: true });
    window.addEventListener('resize', clear);
    return () => {
      window.removeEventListener('scroll', clear);
      window.removeEventListener('resize', clear);
    };
  }, [hints]);

  // nothing lingers across pages
  useEffect(() => {
    setHints(null);
    setPrompt(null);
    setPending('');
    highlights()?.delete('vim-search');
    highlights()?.delete('vim-current');
  }, [path]);

  const onPromptKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!prompt) return;
    const list = prompt.kind === ':' ? completions(prompt.value) : [];
    if (e.key === 'Escape') {
      e.preventDefault();
      setPrompt(null);
      return;
    }
    if (e.key === 'Backspace' && !prompt.value) {
      e.preventDefault();
      setPrompt(null);
      return;
    }
    if (
      (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
      list.length
    ) {
      e.preventDefault();
      const dir = e.key === 'ArrowUp' || e.shiftKey ? -1 : 1;
      const pick = (prompt.pick + dir + list.length) % list.length;
      setPrompt({ ...prompt, pick });
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const value =
        prompt.pick >= 0 && list[prompt.pick]
          ? list[prompt.pick]!
          : prompt.value;
      setPrompt(null);
      if (prompt.kind === '/') {
        lastFind.current = value;
        // let the prompt go first, so the search doesn't land in it
        requestAnimationFrame(() => find(value, 0));
      } else runCommand(value);
    }
  };

  const list = prompt?.kind === ':' ? completions(prompt.value) : [];
  const status = pending || message;

  return (
    <>
      {/* the build's CSS parser doesn't know ::highlight() yet */}
      <style>{`::highlight(vim-search){background-color:rgb(224 175 104/.35)}::highlight(vim-current){background-color:#e0af68;color:#16161e}`}</style>
      {hints &&
        createPortal(
          <div
            aria-hidden
            className={`${hints.host === document.body ? 'fixed' : 'absolute'} pointer-events-none inset-0 z-[60]`}
          >
            {hints.items
              .filter((h) => h.label.startsWith(hints.typed))
              .map((h) => (
                <span
                  key={h.label}
                  className="vim-hint"
                  style={{ left: h.x, top: h.y }}
                >
                  <b>{hints.typed}</b>
                  {h.label.slice(hints.typed.length)}
                </span>
              ))}
          </div>,
          hints.host
        )}

      {prompt && (
        <div className="vim-line">
          {list.length > 0 && (
            <ul className="vim-menu">
              {list.map((c, i) => (
                <li key={c} className={i === prompt.pick ? 'is-picked' : ''}>
                  {c}
                </li>
              ))}
            </ul>
          )}
          <label className="flex items-center gap-1">
            <span aria-hidden>{prompt.kind}</span>
            <span className="sr-only">
              {prompt.kind === ':' ? 'command' : 'search the page'}
            </span>
            <input
              autoFocus
              value={prompt.value}
              onChange={(e) =>
                setPrompt({ ...prompt, value: e.target.value, pick: -1 })
              }
              onKeyDown={onPromptKey}
              onBlur={() => setPrompt(null)}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent outline-none"
            />
          </label>
        </div>
      )}

      {/* always in the page, so screen readers announce what goes in it */}
      <div
        role="status"
        className={status && !prompt ? 'vim-status' : 'sr-only'}
      >
        {status}
      </div>

      <dialog
        ref={helpRef}
        className="vim-help pixel-frame"
        aria-labelledby="vim-help-title"
        onClose={() => setHelp(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setHelp(false);
        }}
      >
        <h2 id="vim-help-title" className="heading">
          vim keys
        </h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm">
          {KEYS.map(([k, what]) => (
            <div key={k} className="contents">
              <dt className="text-yellow whitespace-nowrap">{k}</dt>
              <dd className="text-soft">{what}</dd>
            </div>
          ))}
        </dl>
        <div className="text-muted mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            className="hover:text-fg cursor-pointer underline underline-offset-4"
            onClick={() => {
              setEnabled(!on);
              setHelp(false);
            }}
          >
            {on ? 'turn vim keys off' : 'turn vim keys on'}
          </button>
          <button
            type="button"
            className="hover:text-fg cursor-pointer"
            onClick={() => setHelp(false)}
          >
            close [esc]
          </button>
        </div>
      </dialog>
    </>
  );
}

/** "press ? for vim keys" in the footer, only where there's a keyboard. */
export function VimHint() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(VIM_HELP))}
      className="vim-footer-hint hover:text-fg cursor-pointer"
    >
      <kbd>?</kbd> vim keys
    </button>
  );
}
