import { ImageResponse } from 'next/og';

export const alt = 'Mark Omarov - Senior Product Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          padding: '80px',
          background:
            'linear-gradient(135deg, #050a07 0%, #0a0f0c 60%, #1a0d1f 100%)',
          color: '#e6f4ea',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            color: '#4ade80',
            fontSize: '34px',
            letterSpacing: '0.04em',
          }}
        >
          <span style={{ fontSize: '48px' }}>{'>'}</span>
          omarov.dev
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div
            style={{
              fontSize: '96px',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Mark Omarov
          </div>
          <div
            style={{
              fontSize: '44px',
              color: '#a7c4af',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            Senior Product Engineer. Tokyo. Ship product end-to-end, including
            the parts most engineers won&apos;t touch.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: '#7d9484',
            fontSize: '26px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>TypeScript</span>
            <span style={{ color: '#3b5040' }}>·</span>
            <span>React</span>
            <span style={{ color: '#3b5040' }}>·</span>
            <span>Next.js</span>
            <span style={{ color: '#3b5040' }}>·</span>
            <span>Node</span>
            <span style={{ color: '#3b5040' }}>·</span>
            <span>Postgres</span>
            <span style={{ color: '#3b5040' }}>·</span>
            <span>AWS</span>
          </div>
          <div style={{ color: '#4ade80' }}>linkedin.com/in/mark-omarov</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
