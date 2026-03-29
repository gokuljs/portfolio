'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '@styles/githubGraph.module.scss';
import dynamic from 'next/dynamic';
import Dropdown from '../Components/Dropdown/dropdown';
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

// Large warm-earth pool — hash each org name so the same org always gets the same color
const COLOR_POOL = [
  '#FFFDF1', // cream
  '#FFCE99', // peach
  '#FF9644', // orange
  '#ffba08', // amber
  '#f48c06', // warm orange
  '#d2bba0', // warm beige
  '#9f7e69', // tan
  '#ece2d0', // sand
  '#e85d04', // deep orange
  '#faa307', // golden amber
];

function hashOrg(org: string): number {
  let h = 0;
  for (let i = 0; i < org.length; i++) h = (Math.imul(31, h) + org.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Stable: same org → same color, always. New orgs auto-pick from pool.
function orgColor(org: string): string {
  if (org === '__others__') return '#9f7e69';
  return COLOR_POOL[hashOrg(org) % COLOR_POOL.length];
}

function smooth(pts: [number, number][]) {
  if (pts.length < 2) return `M${pts[0][0]},${pts[0][1]}`;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i];
    const mx = (px + cx) / 2;
    d += ` C${mx},${py} ${mx},${cy} ${cx},${cy}`;
  }
  return d;
}

function OrgChart({ prs }: { prs: PR[] }) {
  const [hover, setHover] = useState<{ mi: number; x: number } | null>(null);

  const W = 700, H = 160;
  const PAD = { t: 14, r: 16, b: 32, l: 44 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  // ── dynamic date range: first PR ever → last PR ever ────────────────────────
  const allDates = prs.map(pr => pr.created_at.slice(0, 7)).sort();
  const months: string[] = [];
  if (allDates.length > 0) {
    const cur = new Date(allDates[0] + '-01');
    const end = new Date(allDates[allDates.length - 1] + '-01');
    while (cur <= end) {
      months.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`);
      cur.setMonth(cur.getMonth() + 1);
    }
  }
  if (months.length === 0) return null;

  // ── orgs: top 3 named + "others" bucket ─────────────────────────────────────
  const orgTotals: Record<string, number> = {};
  prs.forEach(pr => { orgTotals[pr.repoOwner] = (orgTotals[pr.repoOwner] || 0) + 1; });

  const sorted    = Object.entries(orgTotals).sort((a, b) => b[1] - a[1]);
  const namedOrgs = sorted.slice(0, 3).map(([o]) => o);
  const restOrgs  = sorted.slice(3).map(([o]) => o);
  const hasRest   = restOrgs.length > 0;
  const OTHERS    = '__others__';
  const series    = hasRest ? [...namedOrgs, OTHERS] : namedOrgs;

  const data: Record<string, number[]> = {};
  series.forEach(s => { data[s] = months.map(() => 0); });
  prs.forEach(pr => {
    const idx = months.indexOf(pr.created_at.slice(0, 7));
    if (idx === -1) return;
    if (namedOrgs.includes(pr.repoOwner))                           data[pr.repoOwner][idx]++;
    else if (hasRest && restOrgs.includes(pr.repoOwner))            data[OTHERS][idx]++;
  });

  // Shared Y axis (absolute values) so dominant orgs show proportionally bigger
  const globalMax = Math.max(...series.flatMap(s => data[s]), 1);
  const gridMax   = Math.ceil(globalMax / 4) * 4 || 4;
  const gridTicks = [0, 1, 2, 3, 4].map(n => Math.round(gridMax / 4 * n));

  const seriesLabel = (s: string) => s === OTHERS ? `+${restOrgs.length} more` : s;
  const seriesTotal = (s: string) => s === OTHERS
    ? restOrgs.reduce((a, o) => a + (orgTotals[o] ?? 0), 0)
    : orgTotals[s] ?? 0;

  // ── geometry helpers ─────────────────────────────────────────────────────────
  const xOf = (mi: number) =>
    PAD.l + (months.length === 1 ? cW / 2 : (mi / (months.length - 1)) * cW);
  const yOf = (v: number) => PAD.t + cH - (v / gridMax) * cH;

  function getPts(s: string): [number, number][] {
    return data[s].map((v, mi) => [xOf(mi), yOf(v)]);
  }

  const xLabels = months
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => [1, 4, 7, 10].includes(parseInt(m.split('-')[1])))
    .map(({ i }) => i);

  const tipRows = hover
    ? series
        .map(s => ({ label: seriesLabel(s), val: data[s][hover.mi], color: orgColor(s) }))
        .filter(e => e.val > 0)
        .sort((a, b) => b.val - a.val)
    : [];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - r.left) / r.width) * W;
    const raw  = ((svgX - PAD.l) / cW) * (months.length - 1);
    const mi   = Math.max(0, Math.min(months.length - 1, Math.round(raw)));
    setHover({ mi, x: xOf(mi) });
  };

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible', cursor: 'crosshair', display: 'block' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s} id={`lg-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={orgColor(s)} stopOpacity="0.18" />
              <stop offset="100%" stopColor={orgColor(s)} stopOpacity="0.01" />
            </linearGradient>
          ))}
        </defs>

        {/* Y-axis grid + labels */}
        {gridTicks.map((val, j) => {
          const y = yOf(val);
          return (
            <g key={j}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
                stroke={j === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.045)'}
                strokeWidth={j === 0 ? 1 : 0.75} />
              {val > 0 && (
                <text x={PAD.l - 7} y={y + 3.5} fontSize="8"
                  fill="rgba(255,255,255,0.22)" textAnchor="end">{val}</text>
              )}
            </g>
          );
        })}

        {/* Area fills — drawn first so lines sit on top */}
        {series.map((s, i) => {
          const pts = getPts(s);
          const line = smooth(pts);
          const area = `${line} L${pts[pts.length - 1][0]},${yOf(0)} L${pts[0][0]},${yOf(0)} Z`;
          return <path key={`area-${s}`} d={area} fill={`url(#lg-${i})`} />;
        })}

        {/* Lines */}
        {series.map((s) => {
          const pts = getPts(s);
          const line = smooth(pts);
          const color = orgColor(s);
          const isHovered = hover && tipRows.some(r => r.label === seriesLabel(s));
          const dim = hover && !isHovered;
          return (
            <path key={`line-${s}`} d={line} fill="none"
              stroke={color}
              strokeWidth={isHovered ? 2.2 : 1.8}
              strokeOpacity={dim ? 0.25 : 1}
              strokeLinejoin="round" strokeLinecap="round"
              style={{ transition: 'stroke-opacity 0.15s, stroke-width 0.15s' }}
            />
          );
        })}

        {/* Hover: crosshair + dots + tooltip */}
        {hover && (
          <>
            <line x1={hover.x} y1={PAD.t} x2={hover.x} y2={PAD.t + cH}
              stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />

            {series.map((s) => {
              const val = data[s][hover.mi];
              if (val === 0) return null;
              const [px, py] = getPts(s)[hover.mi];
              const color = orgColor(s);
              return (
                <g key={`dot-${s}`}>
                  <circle cx={px} cy={py} r="5" fill={color} fillOpacity="0.18" />
                  <circle cx={px} cy={py} r="3" fill={color} />
                  <circle cx={px} cy={py} r="1.2" fill="#fff" fillOpacity="0.8" />
                </g>
              );
            })}

            {tipRows.length > 0 && (() => {
              const month = new Date(months[hover.mi] + '-01')
                .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              const total = tipRows.reduce((a, e) => a + e.val, 0);
              const ROW = 15, TW = 136, TH = 26 + tipRows.length * ROW + 8;
              let tx = hover.x + 14;
              if (tx + TW > W - PAD.r) tx = hover.x - TW - 14;
              const ty = PAD.t + 4;
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <rect x={tx} y={ty} width={TW} height={TH} rx="5"
                    fill="rgba(10,10,12,0.97)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.75" />
                  <text x={tx + 10} y={ty + 15} fontSize="8.5"
                    fill="rgba(255,255,255,0.38)" fontWeight="600" letterSpacing="0.07em">
                    {month.toUpperCase()}
                  </text>
                  <text x={tx + TW - 10} y={ty + 15} fontSize="8.5"
                    fill="rgba(255,255,255,0.55)" textAnchor="end" fontWeight="700">
                    {total} PRs
                  </text>
                  {tipRows.map((e, j) => (
                    <g key={e.label}>
                      <rect x={tx + 10} y={ty + 24 + j * ROW + 3}
                        width="7" height="7" rx="1.5" fill={e.color} fillOpacity="0.9" />
                      <text x={tx + 21} y={ty + 24 + j * ROW + 10}
                        fontSize="8.5" fill="rgba(255,255,255,0.65)">{e.label}</text>
                      <text x={tx + TW - 10} y={ty + 24 + j * ROW + 10}
                        fontSize="9" fill={e.color} textAnchor="end" fontWeight="700">{e.val}</text>
                    </g>
                  ))}
                </g>
              );
            })()}
          </>
        )}

        {/* X-axis date labels */}
        {xLabels.map(i => (
          <text key={i} x={xOf(i)} y={H - 5}
            fontSize="8" fill="rgba(255,255,255,0.2)" textAnchor="middle">
            {new Date(months[i] + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 18px', marginTop: 8 }}>
        {series.map((s) => (
          <a key={s}
            href={s !== OTHERS ? `https://github.com/${s}` : undefined}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            className="group">
            <div style={{ width: 20, height: 2, borderRadius: 1, background: orgColor(s) }} />
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.04em' }}
              className="group-hover:text-white/55 transition-colors">
              {seriesLabel(s)}
            </span>
            <span style={{
              fontSize: 8.5, color: orgColor(s), opacity: 0.75,
              background: `${orgColor(s)}18`, padding: '1px 5px', borderRadius: 4,
            }}>{seriesTotal(s)}</span>
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
  const [showPRs, setShowPRs] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

  // Lock the card width to whatever the heatmap renders at, so toggling
  // the PR list (which has long white-space:nowrap titles) can never widen it.
  useEffect(() => {
    if (!loading && cardRef.current) {
      const w = cardRef.current.getBoundingClientRect().width;
      cardRef.current.style.maxWidth = `${w}px`;
    }
  }, [loading]);

  useEffect(() => {
    setIsMounted(true);

    async function fetchAllPages(query: string) {
      const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;
      const allItems: { id: number; title: string; html_url: string; created_at: string }[] = [];
      let page = 1;
      while (true) {
        const res = await fetch(
          `https://api.github.com/search/issues?q=${query}&sort=created&order=desc&per_page=100&page=${page}`,
          { headers: { Accept: 'application/vnd.github+json' } },
        );
        if (!res.ok) break;
        const data = await res.json();
        const items: { id: number; title: string; html_url: string; created_at: string }[] = data.items ?? [];
        if (items.length === 0) break;
        allItems.push(...items);
        // Stop if the oldest item on this page is already beyond 2 years
        const oldest = new Date(items[items.length - 1].created_at).getTime();
        if (oldest < twoYearsAgo) break;
        // GitHub Search API caps at 1000 results total
        if (allItems.length >= Math.min(data.total_count, 1000)) break;
        page++;
      }
      return allItems;
    }

    async function fetchPRs() {
      try {
        const [mdItems, odItems] = await Promise.all([
          fetchAllPages('author:gokuljs+type:pr+is:merged'),
          fetchAllPages('author:gokuljs+type:pr+is:open'),
        ]);
        const md = { items: mdItems };
        const od = { items: odItems };

        const parse = (items: { id: number; title: string; html_url: string; created_at: string }[], state: PR['state']) =>
          items.map(pr => {
            const m = pr.html_url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/\d+/);
            if (!m) return null;
            const [, owner, repo] = m;
            if (owner.toLowerCase() === 'gokuljs') return null;
            return { id: pr.id, title: pr.title, html_url: pr.html_url, repo: `${owner}/${repo}`, repoOwner: owner.toLowerCase(), created_at: pr.created_at, state } as PR;
          }).filter((p): p is PR => p !== null);

        const all = [...parse(od.items, 'open'), ...parse(md.items, 'merged')]
          .filter(pr => new Date(pr.created_at).getTime() >= Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)
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

  // ── Derived data for activity overview ──────────────────────────────────────
  const orgTotals: Record<string, number> = {};
  prs.forEach(pr => { orgTotals[pr.repoOwner] = (orgTotals[pr.repoOwner] || 0) + 1; });
  const topOrgNames = Object.entries(orgTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([o]) => o);
  const otherOrgCount = Math.max(Object.keys(orgTotals).length - 3, 0);

  const repoCounts: Record<string, number> = {};
  prs.forEach(pr => { repoCounts[pr.repo] = (repoCounts[pr.repo] || 0) + 1; });

  // Sort: livekit > pipecat > others by count > rime last
  const repoSortPriority = (repo: string) => {
    const owner = repo.split('/')[0].toLowerCase();
    if (owner === 'livekit') return 0;
    if (owner.includes('pipecat')) return 1;
    if (owner.includes('rime')) return 999;
    return 2;
  };
  const topRepos = Object.entries(repoCounts).sort((a, b) => {
    const pa = repoSortPriority(a[0]), pb = repoSortPriority(b[0]);
    if (pa !== pb) return pa - pb;
    return b[1] - a[1];
  });
  const shownRepos = topRepos.slice(0, 3);
  const otherRepoCount = Math.max(topRepos.length - 3, 0);

  return (
    <div className={styles.github} suppressHydrationWarning>
      <h1 className={styles.heading}>GITHUB</h1>

      <div className={`w-full flex flex-col ${styles.inner}`}>

        {/* ── Single unified card ───────────────────────────────────────────── */}
        <div ref={cardRef} className={styles.card}>
          {/* Heatmap — centered inside the card */}
          <div className="flex justify-end mb-3">
            <Dropdown dropdownState={dropdownState} setDropdownState={setDropdownState} options={gitHubYearList} value={selectedYear} setValue={setSelectedYear} />
          </div>
          <div ref={scrollContainerRef} className={styles.calendarSection}>
            <GitHubCalendar
              username="gokuljs"
              year={selectedYear ?? undefined}
              colorScheme="dark"
              blockSize={15}
              fontSize={12}
              loading={loading}
              theme={{ dark: ['#0a0a0a', '#2e2e2e', '#555555', '#7b7b7b', '#bcbcbc'] }}
              style={{ color: '#F0F1F4' }}
            />
          </div>

          <div className={styles.divider} />

          {/* ── Activity (left) + Graph (right) ──────────────────────────────── */}
          <div className={styles.bottomRow}>

          {/* LEFT — org badges + activity overview / PR list */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

            {/* Org badge pills */}
            {!prLoading && (
              <div className={styles.orgBadges}>
                {topOrgNames.map(org => (
                  <a key={org} href={`https://github.com/${org}`} target="_blank" rel="noopener noreferrer"
                    className={styles.badge}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: orgColor(org), flexShrink: 0 }} />
                    @{org}
                  </a>
                ))}
                {otherOrgCount > 0 && (
                  <span className={styles.badge} style={{ opacity: 0.4, cursor: 'default' }}>
                    +{otherOrgCount} more
                  </span>
                )}
              </div>
            )}

            {prLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="animate-pulse">
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} style={{ height: 26, width: 90, borderRadius: 6, background: 'rgba(255,255,255,0.05)' }} />
                  ))}
                </div>
                <div style={{ height: 160, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.04)', width: i === 3 ? '60%' : '100%' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Height is auto in activity view (hugs text) and fixed in PR list view (scrollable) */}
            {!prLoading && (
              <div className={styles.contentArea} style={showPRs ? { height: 160 } : undefined}>
                {/* Activity overview — collapsed default view */}
                {!showPRs && (
                  <div className={styles.activitySection}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: 10 }}>
                      Activity overview
                    </p>
                    <p style={{ fontSize: 12 }}>
                      Contributed to{' '}
                      {shownRepos.map(([repo], i) => {
                        const isRime = repo.split('/')[0].toLowerCase().includes('rime');
                        return (
                          <span key={repo}>
                            <a
                              href={`https://github.com/${repo}`}
                              target="_blank" rel="noopener noreferrer"
                              className={`${styles.repoLink} ${isRime ? styles.repoLinkDim : ''}`}
                              style={{ color: orgColor(repo.split('/')[0]) }}
                            >
                              {repo}
                            </a>
                            {i < shownRepos.length - 1 ? ', ' : ''}
                          </span>
                        );
                      })}
                      {otherRepoCount > 0 && (
                        <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {' '}and {otherRepoCount} other {otherRepoCount === 1 ? 'repository' : 'repositories'}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Expanded PR list — scrolls within the fixed contentArea height */}
                {showPRs && (
                  <div className={styles.prList}>
                    {prs.map((pr, idx) => (
                      <a key={pr.id} href={pr.html_url} target="_blank" rel="noopener noreferrer"
                        className="group"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', borderBottom: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none', flexShrink: 0 }}>
                        <GitPullRequest style={{ width: 11, height: 11, flexShrink: 0, color: pr.state === 'merged' ? '#a855f7' : '#22c55e' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: idx < 3 ? 11 : 10, color: idx < 3 ? '#d4d4d4' : '#737373', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3, fontWeight: idx < 3 ? 500 : 400 }}>
                            {pr.title}
                          </p>
                          <p style={{ fontSize: 9, color: '#525252', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.repo}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          <span style={{ fontSize: 8.5, padding: '1px 5px', borderRadius: 999, background: pr.state === 'merged' ? 'rgba(168,85,247,0.15)' : 'rgba(34,197,94,0.15)', color: pr.state === 'merged' ? '#c084fc' : '#4ade80' }}>
                            {pr.state}
                          </span>
                          <span style={{ fontSize: 8.5, color: '#525252' }}>{timeAgo(pr.created_at)}</span>
                        </div>
                      </a>
                    ))}
                    {prs.length === 0 && (
                      <p className="text-xs text-neutral-600 mt-4 text-center">No public PRs found</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* See more / See less toggle */}
            {!prLoading && prs.length > 0 && (
              <button className={styles.seeMore} onClick={() => setShowPRs(v => !v)}>
                <span>{showPRs ? '▴' : '▾'}</span>
                <span>{showPRs ? 'See less' : `See more (${prs.length} PRs)`}</span>
              </button>
            )}

          </div>

          {/* RIGHT — contribution line graph */}
          <div style={{ minWidth: 0 }}>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500" style={{ marginBottom: 12 }}>
              Open source contributions
            </p>
            {prLoading && (
              <div style={{ height: 160, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} className="animate-pulse" />
            )}
            {!prLoading && prs.length > 0 && <OrgChart prs={prs} />}
          </div>

          </div>{/* end bottomRow */}
        </div>{/* end card */}

      </div>
    </div>
  );
};

export default GithubGraph;
