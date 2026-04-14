'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Github } from 'lucide-react';
import { currentResearch } from '@/data/research-data';
import Footer from '@/app/ui/home/Footer/Footer';

function CommitSparkline({ username }: { username: string }) {
  const [weeks, setWeeks] = useState<{ total: number }[]>([]);
  const [totalCommits, setTotalCommits] = useState(0);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => r.json())
      .then((data) => {
        if (data.contributions) {
          const weekMap: Record<string, number> = {};
          data.contributions.forEach((d: { date: string; count: number }) => {
            const date = new Date(d.date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const key = weekStart.toISOString().slice(0, 10);
            weekMap[key] = (weekMap[key] || 0) + d.count;
          });
          const sorted = Object.entries(weekMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, total]) => ({ total }));
          setWeeks(sorted);
          setTotalCommits(data.total?.lastYear ?? sorted.reduce((s, w) => s + w.total, 0));
        }
      })
      .catch(() => {});
  }, [username]);

  if (weeks.length === 0) {
    return (
      <div className="animate-pulse" style={{ height: 60, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
    );
  }

  const max = Math.max(...weeks.map((w) => w.total), 1);
  const W = 520;
  const H = 60;
  const padY = 6;
  const usable = H - padY * 2;

  const points = weeks.map((w, i) => {
    const x = (i / (weeks.length - 1)) * W;
    const y = padY + usable - (w.total / max) * usable;
    return [x, y] as [number, number];
  });

  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const mx = (px + cx) / 2;
    d += ` C${mx},${py} ${mx},${cy} ${cx},${cy}`;
  }

  const area = `${d} L${points[points.length - 1][0]},${H} L${points[0][0]},${H} Z`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
            fontWeight: 600,
            margin: 0,
          }}
        >
          Commits · Last Year
        </p>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums' }}>
          {totalCommits.toLocaleString()}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="spark-fill-full" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#spark-fill-full)" />
        <path d={d} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function ActivityPage() {
  const { paper, title, goal, description, tags, status, github } = currentResearch;

  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden">
      <section className="w-full min-h-screen py-32 px-6 md:px-16 lg:px-24 flex flex-col items-center">
        <div className="max-w-3xl w-full mt-[70px]">
          <div style={{ marginBottom: '3rem' }}>
            <p
              style={{
                fontSize: '10px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '0.75rem',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              now
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-lora), Georgia, "Times New Roman", serif',
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                color: '#f0f0ee',
                margin: '0 0 0.75rem',
              }}
            >
              Activity
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1.5rem' }}>
              <div style={{ flex: 0, width: '40px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>✦</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'relative',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              padding: '32px 32px 32px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />

            {/* READING */}
            {paper && (
              <div style={{ position: 'relative', marginBottom: 40 }}>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 14 }}>
                  Reading
                </p>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none', padding: '5px 12px', borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                    marginBottom: 14, transition: 'border-color 0.2s, color 0.2s',
                  }}
                  className="hover:!border-white/20 hover:!text-white/70"
                >
                  {paper.venue}
                </a>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#f0f0ee', lineHeight: 1.35, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                  {paper.title}
                </h2>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 14px' }}>
                  {paper.authors}
                </p>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: 0, fontStyle: 'italic', fontFamily: 'var(--font-lora), Georgia, serif' }}>
                  A hypernetwork that reads a doc once and generates a LoRA adapter in a single forward pass — the LLM
                  answers without the doc ever touching the context window. If this scales, it basically kills the
                  retrieval problem.
                </p>
              </div>
            )}

            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 32 }} />

            {/* BUILDING */}
            <div style={{ position: 'relative', marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, margin: 0 }}>
                  Building
                </p>
                {status === 'active' && (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
                )}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#f0f0ee', lineHeight: 1.35, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
                {title}
              </h2>
              {goal && (
                <blockquote style={{ borderLeft: '2px solid rgba(255,255,255,0.12)', paddingLeft: 16, margin: '0 0 14px' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                    {goal}
                  </p>
                </blockquote>
              )}
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, margin: '0 0 16px' }}>
                {description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', padding: '4px 10px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                  className="hover:!text-white/60"
                >
                  <Github size={13} /> View on GitHub <ArrowUpRight size={11} />
                </a>
              )}
            </div>

            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 28 }} />

            {/* COMMITS */}
            <CommitSparkline username="gokuljs" />

            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '24px 0 0' }} />

            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                width: '100%',
                padding: '16px 0',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.35)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              className="hover:!text-white/60"
            >
              Back to home <ArrowUpRight size={13} />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
