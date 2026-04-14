'use client';

import { currentResearch } from '@/data/research-data';

type Row = {
  id: string;
  label: string;
  title: string;
  detail?: string;
  url?: string;
  external?: boolean;
  status?: 'active' | 'done' | 'reading';
  date?: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STATUS_COLOR: Record<string, string> = {
  active: '#f5a623',
  done: '#22c55e',
  reading: '#60a5fa',
};

export default function ActivityPage() {
  const { paper, title, goal, status, github } = currentResearch;

  const rows: Row[] = [];

  if (paper) {
    rows.push({
      id: 'reading',
      label: 'reading',
      title: paper.title,
      detail: paper.authors,
      url: paper.url,
      external: true,
      status: 'done',
    });
  }

  rows.push({
    id: 'building',
    label: 'building',
    title,
    detail: goal,
    url: github,
    external: true,
    status: 'done',
  });


  return (
    <div className="w-full bg-black" style={{ minHeight: '100vh' }}>
      <style>{`
        .a-mono {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
        }
        .a-row {
          display: grid;
          grid-template-columns: 6px 60px 1fr auto;
          gap: 12px;
          align-items: baseline;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .a-row:last-child { border-bottom: none; }
        .a-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 5px;
        }
        .a-label {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.04em;
        }
        .a-content {
          min-width: 0;
        }
        .a-title {
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          margin: 0;
          line-height: 1.45;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .a-title a {
          color: inherit;
          text-decoration: none;
          transition: color 0.12s;
        }
        .a-title a:hover { color: #fff; }
        .a-detail {
          font-size: 11px;
          color: rgba(255,255,255,0.18);
          margin: 2px 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .a-date {
          font-size: 11px;
          color: rgba(255,255,255,0.15);
          white-space: nowrap;
          padding-top: 2px;
        }
        .a-back {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          text-decoration: none;
          transition: color 0.15s;
        }
        .a-back:hover { color: rgba(255,255,255,0.5); }
      `}</style>

      <section style={{ maxWidth: 680, margin: '0 auto', padding: '120px 24px 60px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <h1 style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Activity
          </h1>
          <a href="/" className="a-back a-mono">← back</a>
        </div>

        <div>
          {rows.map((row) => (
            <div key={row.id} className="a-row">
              <div
                className="a-dot"
                style={{ background: STATUS_COLOR[row.status || 'done'] || STATUS_COLOR.done }}
              />
              <span className="a-label a-mono">{row.label}</span>
              <div className="a-content">
                <p className="a-title">
                  {row.url ? (
                    <a
                      href={row.url}
                      target={row.external ? '_blank' : undefined}
                      rel={row.external ? 'noopener noreferrer' : undefined}
                    >
                      {row.title}
                    </a>
                  ) : (
                    row.title
                  )}
                </p>
                {row.detail && <p className="a-detail a-mono">{row.detail}</p>}
              </div>
              <span className="a-date a-mono">
                {row.date ? formatDate(row.date) : ''}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
