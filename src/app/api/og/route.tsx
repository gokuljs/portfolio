import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Gokul JS';
  const description = searchParams.get('description') ?? '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* subtle grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* top: site name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ffffff',
            }}
          />
          <span style={{ color: '#525252', fontSize: 16, letterSpacing: '0.08em' }}>
            gokuljs.com
          </span>
        </div>

        {/* middle: title + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              color: '#e5e5e5',
              fontSize: title.length > 50 ? 40 : 48,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                color: '#737373',
                fontSize: 20,
                lineHeight: 1.5,
                maxWidth: '800px',
              }}
            >
              {description.length > 120 ? description.slice(0, 120) + '...' : description}
            </div>
          )}
        </div>

        {/* bottom: tags + author */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 99,
                  padding: '6px 14px',
                  color: '#a3a3a3',
                  fontSize: 13,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ color: '#525252', fontSize: 15 }}>Gokul JS</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
