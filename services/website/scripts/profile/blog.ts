import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

type Front = { date?: string | Date; draft?: boolean };

/** File names of the newest published posts. */
export function latestPosts(dir: string, n = 3) {
  return readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith('_'))
    .map((f) => ({
      f,
      front: matter(readFileSync(join(dir, f), 'utf8')).data as Front,
    }))
    .filter((p) => !p.front.draft)
    .sort(
      (a, b) =>
        new Date(b.front.date ?? 0).getTime() -
        new Date(a.front.date ?? 0).getTime()
    )
    .slice(0, n)
    .map((p) => p.f);
}
