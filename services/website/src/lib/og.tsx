import 'server-only';

import { ImageResponse } from 'next/og';
import { Frame } from '~/art/frame';
import { createGarden, GARDEN_H, noteSeed, type Stage } from '~/art/garden';
import { pngDataURL } from '~/art/png';
import { SCENE_H } from '~/art/scene';
import { tokyo } from '~/art/scenes/tokyo';

export const OG_SIZE = { width: 1200, height: 630 };

const SCALE = 3;
const W = OG_SIZE.width / SCALE;

/** A still of the Tokyo scene, train going by, at 3x. */
function tokyoStill() {
  const f = new Frame(W, SCENE_H);
  tokyo.create(W, SCENE_H).render(f, 7_000);
  return pngDataURL(f, SCALE);
}

/** The blog garden with one note marked, at 3x. */
function gardenStill(
  notes: { slug: string; stage: Stage }[],
  links: [number, number][],
  highlight: number
) {
  const f = new Frame(W, GARDEN_H);
  createGarden(
    W,
    notes.map((n) => ({ stage: n.stage, seed: noteSeed(n.slug) })),
    links
  ).render(f, 5_000, highlight);
  return pngDataURL(f, SCALE);
}

function card(art: string, artHeight: number, kicker: string, title: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#16161e',
          color: '#c0caf5',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art} width={OG_SIZE.width} height={artHeight} alt="" />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 10,
            padding: '0 64px',
            borderTop: '6px solid #2f334d',
          }}
        >
          <div style={{ fontSize: 28, color: '#9ece6a' }}>{kicker}</div>
          <div
            style={{
              fontSize: title.length > 48 ? 48 : 60,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}

export function siteImage() {
  return card(
    tokyoStill(),
    SCENE_H * SCALE,
    'omarov.dev · tokyo',
    "hey, i'm mark."
  );
}

export function postImage(opts: {
  title: string;
  stage: Stage;
  notes: { slug: string; stage: Stage }[];
  links: [number, number][];
  index: number;
}) {
  return card(
    gardenStill(opts.notes, opts.links, opts.index),
    GARDEN_H * SCALE,
    `omarov.dev/blog · ${opts.stage}`,
    opts.title
  );
}
