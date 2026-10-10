import type { Stage } from '~/lib/posts';

// 8x8 pixel sprites, drawn as SVG rects so they stay crisp at any size.
const SPRITES: Record<Stage, { rows: string[]; label: string }> = {
  seedling: {
    label: 'seedling: a rough first draft',
    rows: [
      '........',
      '.gg..gg.',
      '..gGGg..',
      '...GG...',
      '....G...',
      '....G...',
      '.ssssss.',
      '..ssss..',
    ],
  },
  budding: {
    label: 'budding: taking shape',
    rows: [
      '...pp...',
      '..pPPp..',
      '...pp...',
      '.g.G..g.',
      '.gGG.Gg.',
      '...G.G..',
      '.ssssss.',
      '..ssss..',
    ],
  },
  evergreen: {
    label: 'evergreen: about as done as it gets',
    rows: [
      '...gg...',
      '..gGGg..',
      '.gGgGGg.',
      'gGGGgGGg',
      '.gGGGGg.',
      '..gGGg..',
      '...tt...',
      '..tttt..',
    ],
  },
};

const COLORS: Record<string, string> = {
  g: '#9ece6a',
  G: '#5f8f3e',
  p: '#f7768e',
  P: '#ffb3c1',
  s: '#7a5a42',
  t: '#7a5a42',
};

export const STAGE_LABEL: Record<Stage, string> = {
  seedling: 'seedling',
  budding: 'budding',
  evergreen: 'evergreen',
};

export function StageIcon({
  stage,
  size = 16,
}: {
  stage: Stage;
  size?: number;
}) {
  const { rows, label } = SPRITES[stage];
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
      className="inline-block shrink-0 align-[-0.15em]"
    >
      <title>{label}</title>
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          COLORS[c] ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={COLORS[c]}
            />
          ) : null
        )
      )}
    </svg>
  );
}
