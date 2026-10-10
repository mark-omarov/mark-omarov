// Obsidian-style [[wikilinks]] between posts.
//
//   [[slug]]  [[Post title]]  [[an alias]]  [[target|shown text]]  [[target#Heading]]
//
// Targets resolve against post slugs, titles and `aliases` (case-insensitive).
// A link to something that doesn't exist yet renders as plain text marked
// "not written yet", so notes can point at future notes.

import { slug } from 'github-slugger';

const WIKILINK = /\[\[([^[\]|#\n]+)(?:#([^[\]|\n]+))?(?:\|([^[\]\n]+))?\]\]/g;

export type WikiTarget = { slug: string; title: string; aliases: string[] };

export type Resolver = (target: string) => WikiTarget | undefined;

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * A heading's anchor: the same github-slugger rehype-slug uses for the ids,
 * so [[note#Some heading]] lands on it. (A repeated heading's later copies
 * get -1, -2… there; a link goes to the first.)
 */
export const anchor = (s: string) => slug(s.trim());

export function makeResolver(targets: WikiTarget[]): Resolver {
  const map = new Map<string, WikiTarget>();
  for (const t of targets) {
    for (const key of [t.slug, t.title, ...t.aliases]) {
      if (!map.has(norm(key))) map.set(norm(key), t);
    }
  }
  return (target) => map.get(norm(target)) ?? map.get(anchor(target));
}

/** Slugs a post's markdown links to (ignores code). */
export function outgoingLinks(markdown: string, resolve: Resolver) {
  const text = markdown
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`\n]*`/g, '');
  const slugs = new Set<string>();
  for (const m of text.matchAll(WIKILINK)) {
    const hit = resolve(m[1]!);
    if (hit) slugs.add(hit.slug);
  }
  return [...slugs];
}

// Just enough of the mdast shape to walk text nodes.
type Node = {
  type: string;
  value?: string;
  children?: Node[];
  url?: string;
  data?: Record<string, unknown>;
};

/** remark plugin: turns [[wikilinks]] in text into links (or "missing" spans). */
export function remarkWikilinks(options: { resolve: Resolver }) {
  return (tree: Node) => {
    const walk = (node: Node) => {
      if (!node.children) return;
      // links can't nest, and code stays literal
      if (node.type === 'link' || node.type === 'linkReference') return;
      const out: Node[] = [];
      for (const child of node.children) {
        if (child.type !== 'text' || !child.value?.includes('[[')) {
          walk(child);
          out.push(child);
          continue;
        }
        let last = 0;
        for (const m of child.value.matchAll(WIKILINK)) {
          const [raw, target, heading, alias] = m;
          if (m.index > last)
            out.push({ type: 'text', value: child.value.slice(last, m.index) });
          const hit = options.resolve(target!);
          // [[some-slug]] reads better as the post's title
          const base =
            hit && norm(target!) === hit.slug ? hit.title : target!.trim();
          // an alias of nothing but spaces doesn't count
          const shown = alias?.trim() === '' ? undefined : alias?.trim();
          const label =
            shown ?? (heading ? `${base} › ${heading.trim()}` : base);
          if (hit) {
            out.push({
              type: 'link',
              url: `/blog/${hit.slug}${heading ? `#${anchor(heading)}` : ''}`,
              data: { hProperties: { className: ['wikilink'] } },
              children: [{ type: 'text', value: label }],
            });
          } else {
            out.push({
              type: 'emphasis',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['wikilink', 'wikilink-missing'],
                  title: 'not written yet',
                },
              },
              children: [{ type: 'text', value: label }],
            });
          }
          last = m.index + raw.length;
        }
        if (last < child.value.length)
          out.push({ type: 'text', value: child.value.slice(last) });
      }
      node.children = out;
    };
    walk(tree);
  };
}
