import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings, {
  type Options as AutolinkOptions,
} from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import { z } from 'zod';
import {
  makeResolver,
  outgoingLinks,
  remarkWikilinks,
  type Resolver,
} from './wikilinks';

const POSTS_DIR = path.join(process.cwd(), 'content/blog');

const frontmatterSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  // how grown a note is: seedling (rough), budding (getting there), evergreen (done-ish)
  stage: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
  // other names [[wikilinks]] can use for this post
  aliases: z.array(z.string()).default([]),
});

export type Stage = z.infer<typeof frontmatterSchema>['stage'];

export type PostMeta = z.infer<typeof frontmatterSchema> & {
  slug: string;
  readingMinutes: number;
};

export type Post = PostMeta & { html: string; backlinks: PostMeta[] };

// Drafts show up in `next dev` so you can preview them, never in a build.
const showDrafts = process.env.NODE_ENV === 'development';

const autolink: AutolinkOptions = {
  behavior: 'append',
  properties: { className: ['anchor'], ariaHidden: 'true', tabIndex: -1 },
  content: { type: 'text', value: '#' },
};

const markdown = (resolve: Resolver) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilinks, { resolve })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, autolink)
    .use(rehypeShiki, { theme: 'tokyo-night' })
    .use(rehypeStringify, { allowDangerousHtml: true });

async function readPostFile(file: string) {
  const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Bad frontmatter in content/blog/${file}: ${parsed.error.message}`
    );
  }
  const words = content.split(/\s+/).filter(Boolean).length;
  const meta: PostMeta = {
    ...parsed.data,
    slug: file.replace(/\.mdx?$/, ''),
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
  return { meta, content };
}

async function postFiles() {
  try {
    const files = await fs.readdir(POSTS_DIR);
    // Files starting with "_" are templates/scratch and never published.
    return files.filter((f) => /\.mdx?$/.test(f) && !f.startsWith('_'));
  } catch {
    return [];
  }
}

/** Every visible post with its raw markdown, newest first. */
const loadPosts = cache(async () => {
  const files = await postFiles();
  const posts = await Promise.all(files.map(readPostFile));
  return posts
    .filter((p) => showDrafts || !p.meta.draft)
    .sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime());
});

export const getAllPosts = cache(
  async (): Promise<PostMeta[]> => (await loadPosts()).map((p) => p.meta)
);

const getResolver = cache(async () =>
  makeResolver(
    (await getAllPosts()).map(({ slug, title, aliases }) => ({
      slug,
      title,
      aliases,
    }))
  )
);

/** The blog as a graph: notes and the [[wikilinks]] between them. */
export const getGarden = cache(async () => {
  const posts = await loadPosts();
  const resolve = await getResolver();
  const links: { from: string; to: string }[] = [];
  for (const p of posts) {
    for (const to of outgoingLinks(p.content, resolve)) {
      if (to !== p.meta.slug) links.push({ from: p.meta.slug, to });
    }
  }
  return { notes: posts.map((p) => p.meta), links };
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const post = (await loadPosts()).find((p) => p.meta.slug === slug);
  if (!post) return null;
  const html = String(
    await markdown(await getResolver()).process(post.content)
  );
  const { notes, links } = await getGarden();
  const from = new Set(links.filter((l) => l.to === slug).map((l) => l.from));
  const backlinks = notes.filter((n) => from.has(n.slug));
  return { ...post.meta, html, backlinks };
});

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * A post's neighbourhood for its local graph: the post, the notes it links
 * to or that link to it, and one hop further. Capped so it stays readable.
 */
export const getLocalGraph = cache(async (slug: string) => {
  const { notes, links } = await getGarden();
  const adj = new Map<string, Set<string>>();
  const add = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set());
    adj.get(a)!.add(b);
  };
  for (const l of links) {
    add(l.from, l.to);
    add(l.to, l.from);
  }
  const ring1 = [...(adj.get(slug) ?? [])].slice(0, 12);
  const ring2 = new Set<string>();
  for (const n of ring1)
    for (const m of adj.get(n) ?? [])
      if (m !== slug && !ring1.includes(m)) ring2.add(m);
  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  // drop anything that isn't a note first, so node positions and edge
  // indices agree
  const order = [slug, ...ring1, ...[...ring2].slice(0, 16)].filter((s) =>
    bySlug.has(s)
  );
  const ringOf = (s: string): 0 | 1 | 2 =>
    s === slug ? 0 : ring1.includes(s) ? 1 : 2;
  const index = new Map(order.map((s, i) => [s, i]));
  const nodes = order.map((s) => ({
    slug: s,
    title: bySlug.get(s)!.title,
    stage: bySlug.get(s)!.stage,
    ring: ringOf(s),
  }));
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (const l of links) {
    const a = index.get(l.from);
    const b = index.get(l.to);
    if (a === undefined || b === undefined) continue;
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push([a, b]);
  }
  return { nodes, edges };
});
