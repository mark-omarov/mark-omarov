import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Mark Omarov / Senior Product Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#1d1f23';
const PAPER = '#22252a';
const BONE = '#f7f5ef';
const GRAPHITE = '#8a8e96';
const RULE = '#3a3d44';

const logoBytes = fs.readFileSync(
  path.join(process.cwd(), 'public/logo-bone-256.png')
);
const logoDataUrl = `data:image/png;base64,${logoBytes.toString('base64')}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: INK,
          color: BONE,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            color: GRAPHITE,
            fontSize: 22,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <img
            src={logoDataUrl}
            width={56}
            height={56}
            alt=""
            style={{ display: 'block' }}
          />
          <span style={{ color: BONE }}>OMAROV</span>
          <span>/</span>
          <span>INDEX</span>
          <span
            style={{ flex: 1, height: 1, background: RULE, marginLeft: 24 }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 92,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: BONE,
            whiteSpace: 'nowrap',
          }}
        >
          Senior Product Engineer
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: GRAPHITE,
            fontSize: 22,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            borderTop: `1px solid ${RULE}`,
            background: PAPER,
            margin: '0 -80px -72px',
            padding: '32px 80px 48px',
          }}
        >
          <div style={{ display: 'flex' }}>Tokyo</div>
          <div style={{ display: 'flex', color: BONE }}>omarov.dev</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
