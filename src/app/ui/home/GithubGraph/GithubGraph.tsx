'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '@styles/githubGraph.module.scss';
import dynamic from 'next/dynamic';
import Dropdown from '../Components/Dropdown/dropdown';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GitPullRequest } from 'lucide-react';

const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  { ssr: false },
);

interface Contribution { date: string; count: number; level: number; }
interface WeeklyBar { label: string; count: number; weekStart: string; }
interface PR {
  id: number; title: string; html_url: string;
  repo: string; repoOwner: string; created_at: string;
  state: 'merged' | 'open';
}

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days > 365) return `${Math.floor(days / 365)}y ago`;
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  return 'today';
}

function LineChart({ bars, maxVal }: { bars: WeeklyBar[]; maxVal: number }) {
  const W = 800, H = 200, PAD = 8;
  const cW = W - PAD * 2, cH = H - PAD * 2;
  const pts = bars.map((b, i) => ({
    x: PAD + (i / (bars.length - 1)) * cW,
    y: PAD + cH - (b.count / maxVal) * cH,
    b,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `M${pts[0].x},${PAD + cH} ` + pts.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ` L${pts[pts.length - 1].x},${PAD + cH} Z`;
  const labels = [0, Math.floor(bars.length / 2), bars.length - 1];
  return (
    <div className="w-full" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ flex: 1, minHeight: 0 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.12" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.5].map(r => <line key={r} x1={PAD} y1={PAD + cH * (1 - r)} x2={W - PAD} y2={PAD + cH * (1 - r)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />)}
        <path d={area} fill="url(#lg)" />
        <path d={line} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.filter(p => p.b.count === maxVal).map(p => <circle key={p.b.weekStart} cx={p.x} cy={p.y} r="3" fill="white" />)}
      </svg>
      <div className="flex justify-between mt-1">
        {labels.map(i => <span key={bars[i]?.weekStart} className="text-[9px] text-neutral-600">{bars[i]?.label}</span>)}
      </div>
    </div>
  );
}

const GithubGraph = () => {
  const [loading, setIsLoading] = useState(true);
  const [gitHubYearList, setGithubYearList] = useState<number[]>([]);
  const [dropdownState, setDropdownState] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [bars, setBars] = useState<WeeklyBar[]>([]);
  const [totalContribs, setTotalContribs] = useState(0);
  const [chartLoading, setChartLoading] = useState(true);

  const [prs, setPrs] = useState<PR[]>([]);
  const [prLoading, setPrLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const arr = [];
    for (let i = new Date().getFullYear(); i >= 2019; i--) arr.push(i);
    setGithubYearList([...arr]);
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const sc = scrollContainerRef.current;
    if (sc && !loading) {
      const t = sc.querySelector<HTMLDivElement>('.react-activity-calendar__scroll-container');
      if (t) { t.scrollLeft = t.scrollWidth - t.clientWidth; t.style.paddingBottom = '10px'; }
    }
  }, [loading]);

  useEffect(() => {
    setIsMounted(true);

    async function fetchContribs() {
      try {
        const res = await fetch('https://github-contributions-api.jogruber.de/v4/gokuljs?y=last');
        if (!res.ok) return;
        const data: { contributions: Contribution[] } = await res.json();
        let total = 0;
        const wm: Record<string, number> = {};
        data.contributions.forEach(({ date, count }) => {
          total += count;
          const d = new Date(date);
          const mon = new Date(d);
          mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
          mon.setHours(0, 0, 0, 0);
          const k = mon.toISOString();
          wm[k] = (wm[k] || 0) + count;
        });
        setTotalContribs(total);
        setBars(Object.entries(wm).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
          .map(([ws, count]) => ({ weekStart: ws, label: new Date(ws).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count })));
      } catch { /**/ } finally { setChartLoading(false); }
    }

    async function fetchPRs() {
      try {
        const [mRes, oRes] = await Promise.all([
          fetch('https://api.github.com/search/issues?q=author:gokuljs+type:pr+is:merged&sort=created&order=desc&per_page=20', { headers: { Accept: 'application/vnd.github+json' } }),
          fetch('https://api.github.com/search/issues?q=author:gokuljs+type:pr+is:open&sort=created&order=desc&per_page=10', { headers: { Accept: 'application/vnd.github+json' } }),
        ]);
        const md = mRes.ok ? await mRes.json() : { items: [] };
        const od = oRes.ok ? await oRes.json() : { items: [] };

        const parse = (items: { id: number; title: string; html_url: string; created_at: string }[], state: PR['state']) =>
          items.map(pr => {
            const m = pr.html_url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/\d+/);
            if (!m) return null;
            const [, owner, repo] = m;
            if (owner.toLowerCase() === 'gokuljs') return null;
            return { id: pr.id, title: pr.title, html_url: pr.html_url, repo: `${owner}/${repo}`, repoOwner: owner.toLowerCase(), created_at: pr.created_at, state } as PR;
          }).filter((p): p is PR => p !== null);

        const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;
        const all = [...parse(od.items, 'open'), ...parse(md.items, 'merged')]
          .filter(pr => new Date(pr.created_at).getTime() >= twoYearsAgo)
          .sort((a, b) => {
            const ga = a.repoOwner.includes('rime') ? 1 : 0;
            const gb = b.repoOwner.includes('rime') ? 1 : 0;
            if (ga !== gb) return ga - gb;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        setPrs(all);
      } catch { /**/ } finally { setPrLoading(false); }
    }

    fetchContribs();
    fetchPRs();
  }, []);

  if (!isMounted) return null;
  const maxBar = Math.max(...bars.map(b => b.count), 1);

  return (
    <div className={styles.github} suppressHydrationWarning>
      <h1 className={styles.heading}>GitHub Contribution Journey</h1>

      <div className={`w-full flex flex-col gap-4 ${styles.inner}`}>

      {/* Top row: Calendar (left) + Currently Researching (right) */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full">

        {/* Calendar — shrinks on desktop so the side card fits */}
        <div className={`${styles.container} min-w-0 flex-1`} ref={scrollContainerRef}>
          <GlowingEffect spread={80} borderWidth={1} glow={true} disabled={false} proximity={64} inactiveZone={0.01} variant="white" />
          <div className={styles.dropdown}>
            <Dropdown dropdownState={dropdownState} setDropdownState={setDropdownState} options={gitHubYearList} value={selectedYear} setValue={setSelectedYear} />
          </div>
          <GitHubCalendar username="gokuljs" year={selectedYear ?? undefined} colorScheme="dark" blockSize={15} fontSize={12} loading={loading}
            theme={{ dark: ['#0a0a0a', '#2e2e2e', '#555555', '#7b7b7b', '#bcbcbc'] }} style={{ color: '#F0F1F4' }} />
        </div>

        {/* Currently Researching — fixed width on desktop, full width on mobile */}
        <a
          href="https://github.com/gokuljs/Advanced-rag"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex lg:w-[380px] w-full flex-shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: '24px 20px', borderRadius: 12, background: 'transparent', width: '100%',
          }}>

            {/* Top content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#525252', fontWeight: 500 }}>Currently Researching</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(34,197,94,0.12)', color: '#4ade80', fontWeight: 500 }}>active</span>
              </div>

              <p style={{ fontSize: 16, fontWeight: 700, color: '#d4d4d4', lineHeight: 1.3, margin: 0 }}
                className="group-hover:text-white transition-colors">
                Building Production RAG Pipelines
              </p>

              <p style={{ fontSize: 12, color: '#737373', lineHeight: 1.65, margin: 0 }}>
                Understanding the retrieval stack from first principles: inverted indices, BM25 scoring, and dense vector search, through to production concerns: hybrid fusion, cross-encoder re-ranking, evaluation metrics, and agentic retrieval loops.{' '}
                <span style={{ color: '#a3a3a3', fontStyle: 'italic' }}>Goal: design and ship a production-grade RAG system with robust retrieval, evaluation pipelines, and agentic query handling.</span>
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {['BM25', 'Embeddings', 'Vector DB', 'Hybrid Search', 'Re-ranking', 'Multimodal'].map(tag => (
                  <span key={tag} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: '#a3a3a3' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Bottom repo link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, color: '#525252' }}
              className="group-hover:text-neutral-400 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span style={{ fontSize: 11 }}>gokuljs/Advanced-rag</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </div>

          </div>
        </a>

      </div>

      {/* 50/50 split — matches top row width */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2" style={{ borderRadius: 12, background: 'transparent', overflow: 'hidden' }}>

        {/* Left — Commit history */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: 16, borderRight: 'none', height: 300, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Commit history</p>
            {!chartLoading && <span className="text-[10px] text-neutral-600">{totalContribs} total</span>}
          </div>
          <p className="text-[9px] text-neutral-700" style={{ marginBottom: 8 }}>last 365 days · by week</p>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {chartLoading && <div style={{ flex: 1, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} className="animate-pulse" />}
            {!chartLoading && bars.length > 0 && <LineChart bars={bars} maxVal={maxBar} />}
          </div>
        </div>

        {/* Right — Open source PRs */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: 16, height: 300, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Open source PRs</p>
            {!prLoading && <span className="text-[10px] text-neutral-600">{prs.length} PRs</span>}
          </div>
          <p className="text-[9px] text-neutral-700" style={{ marginBottom: 8 }}>latest · non-gokuljs repos</p>

          {prLoading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }} className="animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ height: 32, borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />)}
            </div>
          )}

          {!prLoading && (
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {prs.map((pr, idx) => (
                <a key={pr.id} href={pr.html_url} target="_blank" rel="noopener noreferrer"
                  className="group"
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 4px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none',
                    flexShrink: 0,
                  }}>
                  <GitPullRequest style={{ width: 12, height: 12, flexShrink: 0, marginTop: 2, color: pr.state === 'merged' ? '#a855f7' : '#22c55e' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: idx < 3 ? 11 : 10, color: idx < 3 ? '#d4d4d4' : '#737373', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3, fontWeight: idx < 3 ? 500 : 400 }}>
                      {pr.title}
                    </p>
                    <p style={{ fontSize: 9, color: '#525252', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.repo}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 9, padding: '1px 5px', borderRadius: 999,
                      background: pr.state === 'merged' ? 'rgba(168,85,247,0.15)' : 'rgba(34,197,94,0.15)',
                      color: pr.state === 'merged' ? '#c084fc' : '#4ade80',
                    }}>
                      {pr.state}
                    </span>
                    <span style={{ fontSize: 9, color: '#525252' }}>{timeAgo(pr.created_at)}</span>
                  </div>
                </a>
              ))}
              {prs.length === 0 && <p className="text-xs text-neutral-600 mt-4 text-center">No public PRs found</p>}
            </div>
          )}
        </div>

      </div>

      </div>
    </div>
  );
};

export default GithubGraph;
