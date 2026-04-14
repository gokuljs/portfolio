'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { currentResearch } from '@/data/research-data';
import { blogsData } from '@/data/blogs-data';
import Footer from '@/app/ui/home/Footer/Footer';

function timeAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function useCommitTotal(username: string) {
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => r.json())
      .then((data) => {
        if (data.contributions) {
          setTotal(data.contributions.reduce((s: number, d: { count: number }) => s + d.count, 0));
        }
      })
      .catch(() => {});
  }, [username]);
  return total;
}

type Item = {
  id: string;
  type: 'reading' | 'building' | 'blog' | 'commits';
  title: string;
  meta: string;
  url?: string;
  external?: boolean;
  tags?: string[];
  active?: boolean;
};

export default function ActivityPage() {
  const { paper, title, goal, tags, status, github } = currentResearch;
  const commitTotal = useCommitTotal('gokuljs');

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

  if (commitTotal !== null) {
    items.push({
      id: 'commits',
      type: 'commits',
      title: `${commitTotal.toLocaleString()} commits`,
      meta: 'last year · github.com/gokuljs',
      url: 'https://github.com/gokuljs',
      external: true,
    });
  }

  blogsData.forEach((blog) => {
    items.push({
      id: blog.id,
      type: 'blog',
      title: blog.title,
      meta: `${timeAgo(blog.date)}  ·  ${blog.readTime || ''}`,
      url: `/blogs/${blog.slug}`,
    });
  });

  return (
    <div className="min-h-screen w-full bg-black">
      <style>{`
        .hn-mono {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
        }
        .hn-item {
          display: flex;
          align-items: baseline;
          gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .hn-item:last-child { border-bottom: none; }
        .hn-link {
          text-decoration: none;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
          transition: opacity 0.12s;
        }
        .hn-link:hover { opacity: 0.7; }
        .hn-title {
          font-size: 14px;
          font-weight: 500;
          color: #d4d4d4;
          line-height: 1.45;
          margin: 0;
        }
        .hn-meta {
          font-size: 11px;
          color: rgba(255,255,255,0.22);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hn-type {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          width: 64px;
          flex-shrink: 0;
          color: rgba(255,255,255,0.18);
          padding-top: 2px;
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
      `}</style>

      <section style={{ maxWidth: 640, margin: '0 auto', padding: '140px 24px 80px' }}>
        <h1 style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.5)', margin: '0 0 32px', letterSpacing: '-0.01em' }}>
          Activity
        </h1>

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
                <p className={`hn-meta hn-mono`}>{item.meta}</p>
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
                {isExternal ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="hn-link">
                    {content}
                  </a>
                ) : (
                  <Link href={href} className="hn-link">
                    {content}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
