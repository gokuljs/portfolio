'use client';

import { currentResearch } from '@/data/research-data';

type Item = {
  id: string;
  type: 'reading' | 'building';
  title: string;
  meta: string;
  url?: string;
  external?: boolean;
  tags?: string[];
  active?: boolean;
};

export default function ActivityPage() {
  const { paper, title, goal, tags, status, github } = currentResearch;

  const items: Item[] = [];

  if (paper) {
    items.push({
      id: 'reading',
      type: 'reading',
      title: paper.title,
      meta: `${paper.venue}  ·  ${paper.authors}`,
      url: paper.url,
      external: true,
    });
  }

  items.push({
    id: 'building',
    type: 'building',
    title,
    meta: goal || '',
    url: github,
    external: true,
    tags: tags.slice(0, 5),
    active: status === 'active',
  });

  return (
    <div className="w-full bg-black" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .hn-mono {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
        }
        .hn-item {
          display: flex;
          align-items: baseline;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .hn-item:last-child { border-bottom: none; }
        .hn-link {
          text-decoration: none;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: opacity 0.12s;
        }
        .hn-link:hover { opacity: 0.7; }
        .hn-title {
          font-size: 15px;
          font-weight: 500;
          color: #d4d4d4;
          line-height: 1.45;
          margin: 0;
        }
        .hn-meta {
          font-size: 11px;
          color: rgba(255,255,255,0.22);
          margin: 0;
          line-height: 1.5;
        }
        .hn-type {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          width: 68px;
          flex-shrink: 0;
          color: rgba(255,255,255,0.18);
          padding-top: 3px;
        }
        .hn-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }
        .hn-tag {
          font-size: 9px;
          letter-spacing: 0.04em;
          padding: 1px 6px;
          border-radius: 2px;
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.3);
        }
        .hn-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 5px rgba(34,197,94,0.5);
          margin-right: 6px;
          vertical-align: middle;
        }
        .hn-back {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          text-decoration: none;
          transition: color 0.15s;
        }
        .hn-back:hover { color: rgba(255,255,255,0.5); }
      `}</style>

      <section style={{ maxWidth: 640, margin: '0 auto', padding: '140px 24px 0', width: '100%', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
          <h1 style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: '-0.01em' }}>
            Activity
          </h1>
          <a href="/" className="hn-back hn-mono">← back</a>
        </div>

        <div>
          {items.map((item) => {
            const isExternal = item.external;
            const href = item.url || '#';

            const content = (
              <>
                <p className="hn-title">
                  {item.active && <span className="hn-dot" />}
                  {item.title}
                </p>
                <p className="hn-meta hn-mono">{item.meta}</p>
                {item.tags && (
                  <div className="hn-tags hn-mono">
                    {item.tags.map((t) => (
                      <span key={t} className="hn-tag">{t}</span>
                    ))}
                  </div>
                )}
              </>
            );

            return (
              <div key={item.id} className="hn-item">
                <span className="hn-type hn-mono">{item.type}</span>
                <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} className="hn-link">
                  {content}
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
