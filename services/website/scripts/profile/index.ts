import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { SITE } from '../../src/data/site';
import { banner } from './banner';
import { latestPosts } from './blog';
import { fetchCalendar, sampleCalendar } from './contributions';
import { skyline } from './skyline';
import { terminal } from './terminal';
import { placeOf } from './today';

// Draws the images on the GitHub profile README into .github/profile.
// The contribution city needs GITHUB_TOKEN; --sample draws a made-up year.

const site = resolve(import.meta.dirname, '../..');
const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const out =
  outAt >= 0 && args[outAt + 1]
    ? resolve(args[outAt + 1]!)
    : resolve(site, '../../.github/profile');
const sample = args.includes('--sample');
const now = new Date();
const place = placeOf(now);

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'banner.webp'), await banner(place));
writeFileSync(
  join(out, 'terminal.svg'),
  terminal(place, latestPosts(join(site, 'content/blog')))
);

const token = process.env.GITHUB_TOKEN;
if (sample || token) {
  const login = new URL(SITE.github).pathname.slice(1);
  const cal = sample ? sampleCalendar(now) : await fetchCalendar(login, token!);
  writeFileSync(join(out, 'skyline.svg'), await skyline(cal, now));
} else console.log('No GITHUB_TOKEN: skyline left as it was.');

console.log(`${place.name} -> ${out}`);
