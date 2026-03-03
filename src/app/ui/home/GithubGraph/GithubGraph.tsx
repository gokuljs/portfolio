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

interface PR {
  id: number; title: string; html_url: string;
  repo: string; repoOwner: string; created_at: string;
  state: 'merged' | 'open';
}

const ORG_COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ec4899'];

function OrgChart({ prs }: { prs: PR[] }) {
  const W = 700, H = 200, PAD = { t: 16, r: 10, b: 28, l: 8 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;

  // Build monthly buckets for last 18 months
  const now = new Date();
  const months: string[] = [];
  for (let i = 17; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  // Top 5 orgs by total
  const orgTotals: Record<string, number> = {};
  prs.forEach(pr => { orgTotals[pr.repoOwner] = (orgTotals[pr.repoOwner] || 0) + 1; });
  const topOrgs = Object.entries(orgTotals).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([o]) => o);

  // Count per org per month
  const data: Record<string, number[]> = {};
  topOrgs.forEach(org => { data[org] = months.map(() => 0); });
  prs.forEach(pr => {
    const m = pr.created_at.slice(0, 7);
    const idx = months.indexOf(m);
    if (idx !== -1 && data[pr.repoOwner]) data[pr.repoOwner][idx]++;
  });

  const maxVal = Math.max(...topOrgs.flatMap(o => data[o]), 1);

  // Smooth bezier path
  function smooth(pts: [number, number][]) {
    if (pts.length < 2) return '';
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [cx, cy] = pts[i];
      const mx = (px + cx) / 2;
      d += ` C${mx},${py} ${mx},${cy} ${cx},${cy}`;
    }
    return d;
  }

  function getPoints(org: string): [number, number][] {
    return data[org].map((v, i) => [
      PAD.l + (i / (months.length - 1)) * cW,
      PAD.t + cH - (v / maxVal) * cH,
    ]);
  }

  const labelIdxs = [0, Math.floor(months.length / 2), months.length - 1];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          {topOrgs.map((org, i) => (
            <linearGradient key={org} id={`og-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ORG_COLORS[i]} stopOpacity="0.35" />
              <stop offset="100%" stopColor={ORG_COLORS[i]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(r => (
          <line key={r}
            x1={PAD.l} y1={PAD.t + cH * (1 - r)}
            x2={W - PAD.r} y2={PAD.t + cH * (1 - r)}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        ))}

        {/* Area + line per org */}
        {topOrgs.map((org, i) => {
          const pts = getPoints(org);
          const linePath = smooth(pts);
          const areaPath = `${linePath} L${pts[pts.length - 1][0]},${PAD.t + cH} L${pts[0][0]},${PAD.t + cH} Z`;
          const color = ORG_COLORS[i];
          return (
            <g key={org}>
              <path d={areaPath} fill={`url(#og-${i})`} />
              <path d={linePath} fill="none" stroke={color} strokeWidth="2.5"
                strokeLinejoin="round" strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 3px ${color})` }} />
              {/* Peak dot */}
              {pts.map(([x, y], j) => data[org][j] === maxVal && data[org][j] > 0 ? (
                <circle key={j} cx={x} cy={y} r="3.5" fill={color}
                  style={{ filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 2px #fff)` }} />
              ) : null)}
            </g>
          );
        })}

        {/* X labels */}
        {labelIdxs.map(i => (
          <text key={i}
            x={PAD.l + (i / (months.length - 1)) * cW}
            y={H - 4}
            fontSize="8" fill="rgba(255,255,255,0.2)" textAnchor="middle">
            {new Date(months[i] + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 8 }}>
        {topOrgs.map((org, i) => (
          <a key={org} href={`https://github.com/${org}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
            className="group">
            <div style={{ width: 20, height: 2, borderRadius: 1, background: ORG_COLORS[i], boxShadow: `0 0 6px ${ORG_COLORS[i]}80` }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}
              className="group-hover:text-white/60 transition-colors">
              {org}
            </span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)' }}>
              {orgTotals[org]}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days > 365) return `${Math.floor(days / 365)}y ago`;
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  return 'today';
}


const GithubGraph = () => {
  const [loading, setIsLoading] = useState(true);
  const [gitHubYearList, setGithubYearList] = useState<number[]>([]);
  const [dropdownState, setDropdownState] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

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

    async function fetchPRs() {
      try {
        const [mRes, oRes] = await Promise.all([
          fetch('https://api.github.com/search/issues?q=author:gokuljs+type:pr+is:merged&sort=created&order=desc&per_page=100', { headers: { Accept: 'application/vnd.github+json' } }),
          fetch('https://api.github.com/search/issues?q=author:gokuljs+type:pr+is:open&sort=created&order=desc&per_page=100', { headers: { Accept: 'application/vnd.github+json' } }),
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

    fetchPRs();
  }, []);

  if (!isMounted) return null;

  return (
    <div className={styles.github} suppressHydrationWarning>
      <h1 className={styles.heading}>GITHUB</h1>

      <div className={`w-full flex flex-col items-center gap-6 ${styles.inner}`}>

        {/* Everything locked to calendar width */}
        <div className={styles.calendarWrap}>

          {/* Calendar */}
          <div ref={scrollContainerRef} className={styles.container} style={{ position: 'relative' }}>
            <GlowingEffect spread={80} borderWidth={1} glow={true} disabled={false} proximity={64} inactiveZone={0.01} variant="white" />
            <div className="flex justify-end mb-2">
              <Dropdown dropdownState={dropdownState} setDropdownState={setDropdownState} options={gitHubYearList} value={selectedYear} setValue={setSelectedYear} />
            </div>
            <GitHubCalendar username="gokuljs" year={selectedYear ?? undefined} colorScheme="dark" blockSize={15} fontSize={12} loading={loading}
              theme={{ dark: ['#0a0a0a', '#2e2e2e', '#555555', '#7b7b7b', '#bcbcbc'] }} style={{ color: '#F0F1F4' }} />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />

          {/* Org chart (left) + PR list (right) */}
          <div className={styles.bottomRow}>

            {/* Left — org line chart */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Open source contributions</p>
              <p className="text-[9px] text-neutral-700">last 18 months</p>
              </div>
              {prLoading && <div style={{ height: 200, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} className="animate-pulse" />}
              {!prLoading && prs.length > 0 && <OrgChart prs={prs} />}
            </div>

            {/* Right — PR list */}
            <div style={{ display: 'flex', flexDirection: 'column', height: 260, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">Open source PRs</p>
                {!prLoading && <span className="text-[10px] text-neutral-600">{prs.length} PRs</span>}
              </div>
              <p className="text-[9px] text-neutral-700" style={{ marginBottom: 8 }}>last 2 years</p>

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
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 4px', borderBottom: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none', flexShrink: 0 }}>
                      <GitPullRequest style={{ width: 12, height: 12, flexShrink: 0, marginTop: 2, color: pr.state === 'merged' ? '#a855f7' : '#22c55e' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: idx < 3 ? 11 : 10, color: idx < 3 ? '#d4d4d4' : '#737373', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3, fontWeight: idx < 3 ? 500 : 400 }}>
                          {pr.title}
                        </p>
                        <p style={{ fontSize: 9, color: '#525252', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.repo}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 999, background: pr.state === 'merged' ? 'rgba(168,85,247,0.15)' : 'rgba(34,197,94,0.15)', color: pr.state === 'merged' ? '#c084fc' : '#4ade80' }}>
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
    </div>
  );
};

export default GithubGraph;
