'use client';
import { useEffect, useRef, useState } from 'react';
import styles from '@styles/githubGraph.module.scss';
import dynamic from 'next/dynamic';
import Dropdown from '../Components/Dropdown/dropdown';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GitPullRequest, ExternalLink, GitMerge, GitBranch } from 'lucide-react';

const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  { ssr: false },
);

interface Contribution {
  date: string;
  count: number;
  level: number;
}

interface WeeklyBar {
  label: string;
  count: number;
  weekStart: string;
}

interface PR {
  id: number;
  title: string;
  html_url: string;
  repo: string;
  repoOwner: string;
  created_at: string;
  state: 'merged' | 'open' | 'closed';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  return 'today';
}

function getWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function LineChart({ bars, maxVal }: { bars: WeeklyBar[]; maxVal: number }) {
  const W = 800;
  const H = 110;
  const PAD = 8;
  const chartW = W - PAD * 2;
  const chartH = H - PAD * 2;

  const points = bars.map((bar, i) => ({
    x: PAD + (i / (bars.length - 1)) * chartW,
    y: PAD + chartH - (bar.count / maxVal) * chartH,
    bar,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    `M${points[0].x.toFixed(1)},${(PAD + chartH).toFixed(1)} ` +
    points.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L${points[points.length - 1].x.toFixed(1)},${(PAD + chartH).toFixed(1)} Z`;

  const labelIndices = [
    0,
    Math.floor(bars.length / 4),
    Math.floor(bars.length / 2),
    Math.floor((bars.length * 3) / 4),
    bars.length - 1,
  ];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '110px' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((r) => (
          <line key={r} x1={PAD} y1={PAD + chartH * (1 - r)} x2={W - PAD} y2={PAD + chartH * (1 - r)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5"
          strokeLinejoin="round" strokeLinecap="round" />
        {points.filter((p) => p.bar.count === maxVal).map((p) => (
          <circle key={p.bar.weekStart} cx={p.x} cy={p.y} r="3" fill="white" />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {labelIndices.map((idx) => (
          <span key={bars[idx]?.weekStart} className="text-[10px] text-neutral-600">
            {bars[idx]?.label}
          </span>
        ))}
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

  // Line chart state
  const [commitBars, setCommitBars] = useState<WeeklyBar[]>([]);
  const [totalContribs, setTotalContribs] = useState(0);
  const [chartLoading, setChartLoading] = useState(true);

  // PR state
  const [prs, setPrs] = useState<PR[]>([]);
  const [prLoading, setPrLoading] = useState(true);
  const [totalPrs, setTotalPrs] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const arr = [];
    for (let i = new Date().getFullYear(); i >= 2019; i--) arr.push(i);
    setGithubYearList([...arr]);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && !loading) {
      const target: HTMLDivElement | null = scrollContainer.querySelector(
        '.react-activity-calendar__scroll-container',
      );
      if (target) {
        target.scrollLeft = target.scrollWidth - target.clientWidth;
        target.style.paddingBottom = '10px';
      }
    }
  }, [loading]);

  useEffect(() => {
    setIsMounted(true);

    // Fetch commit frequency
    async function fetchContributions() {
      try {
        const res = await fetch('https://github-contributions-api.jogruber.de/v4/gokuljs?y=last');
        if (!res.ok) return;
        const data: { contributions: Contribution[] } = await res.json();

        const weekMap: Record<string, number> = {};
        let total = 0;
        data.contributions.forEach(({ date, count }) => {
          total += count;
          const d = new Date(date);
          const monday = new Date(d);
          monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
          monday.setHours(0, 0, 0, 0);
          const key = monday.toISOString();
          weekMap[key] = (weekMap[key] || 0) + count;
        });

        setTotalContribs(total);
        setCommitBars(
          Object.entries(weekMap)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([weekStart, count]) => ({ weekStart, label: getWeekLabel(weekStart), count })),
        );
      } catch {
        // degrade silently
      } finally {
        setChartLoading(false);
      }
    }

    async function fetchPRs() {
      try {
        // Fetch both merged and open PRs to other people's repos
        const [mergedRes, openRes] = await Promise.all([
          fetch('https://api.github.com/search/issues?q=author:gokuljs+type:pr+is:merged&sort=created&order=desc&per_page=20',
            { headers: { Accept: 'application/vnd.github+json' } }),
          fetch('https://api.github.com/search/issues?q=author:gokuljs+type:pr+is:open&sort=created&order=desc&per_page=10',
            { headers: { Accept: 'application/vnd.github+json' } }),
        ]);

        const mergedData = mergedRes.ok ? await mergedRes.json() : { items: [] };
        const openData = openRes.ok ? await openRes.json() : { items: [] };

        const parse = (items: { id: number; title: string; html_url: string; pull_request?: { merged_at: string | null }; state: string; created_at: string }[], state: PR['state']) =>
          items
            .map((pr) => {
              const match = pr.html_url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/\d+/);
              if (!match) return null;
              const [, owner, repo] = match;
              return { id: pr.id, title: pr.title, html_url: pr.html_url, repo: `${owner}/${repo}`, repoOwner: owner.toLowerCase(), created_at: pr.created_at, state } as PR;
            })
            .filter((p): p is PR => p !== null);

        const getGroup = (pr: PR): number => {
          if (pr.repoOwner === 'gokuljs') return 1;       // own repos
          if (pr.repoOwner.includes('rime')) return 2;    // rime repos
          return 0;                                        // other repos — first
        };

        const all = [
          ...parse(openData.items, 'open'),
          ...parse(mergedData.items, 'merged'),
        ].sort((a, b) => {
          const groupDiff = getGroup(a) - getGroup(b);
          if (groupDiff !== 0) return groupDiff;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setTotalPrs(all.length);
        setPrs(all);
      } catch {
        // degrade silently
      } finally {
        setPrLoading(false);
      }
    }

    fetchContributions();
    fetchPRs();
  }, []);

  if (!isMounted) return null;

  const maxBar = Math.max(...commitBars.map((b) => b.count), 1);
  const topThree = prs.slice(0, 3);
  const rest = prs.slice(3);

  return (
    <div className={styles.github} suppressHydrationWarning>
      <h1 className={styles.heading}>GitHub Contribution Journey</h1>

      {/* Contribution Calendar */}
      <div className={styles.container} ref={scrollContainerRef}>
        <GlowingEffect spread={80} borderWidth={1} glow={true} disabled={false} proximity={64} inactiveZone={0.01} variant="white" />
        <div className={styles.dropdown}>
          <Dropdown dropdownState={dropdownState} setDropdownState={setDropdownState}
            options={gitHubYearList} value={selectedYear} setValue={setSelectedYear} />
        </div>
        <GitHubCalendar username="gokuljs" year={selectedYear ? selectedYear : undefined}
          colorScheme="dark" blockSize={15} fontSize={12} loading={loading}
          theme={{ dark: ['#0a0a0a', '#2e2e2e', '#555555', '#7b7b7b', '#bcbcbc'], light: ['#f1f1f1', '#c8d1db', '#98a8b8', '#65778b', '#374151'] }}
          style={{ color: '#F0F1F4' }} />
      </div>

      {/* Commit Frequency Line Graph */}
      <div className="w-full max-w-[900px] p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Commit Frequency</p>
          {!chartLoading && <span className="text-xs text-neutral-600">{totalContribs} contributions · last 365 days</span>}
        </div>
        <p className="text-[11px] text-neutral-600 mb-4">all repos · by week</p>
        {chartLoading && <div className="h-28 w-full animate-pulse rounded bg-white/[0.02]" />}
        {!chartLoading && commitBars.length > 0 && <LineChart bars={commitBars} maxVal={maxBar} />}
        {!chartLoading && commitBars.length === 0 && (
          <div className="h-28 flex items-center justify-center">
            <p className="text-xs text-neutral-600">Could not load data</p>
          </div>
        )}
      </div>

      {/* Open Source Contributions */}
      <div className="w-full max-w-[900px] p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <GitMerge className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-xs uppercase tracking-widest text-neutral-500">Open Source Contributions</p>
          </div>
          {!prLoading && totalPrs > 0 && (
            <span className="text-xs text-neutral-600">{totalPrs} merged PRs</span>
          )}
        </div>
        <p className="text-[11px] text-neutral-600 mb-5">latest merged pull requests</p>

        {/* Skeleton */}
        {prLoading && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.04] animate-pulse h-28" />
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 bg-white/[0.03] rounded animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Top 3 big cards */}
        {!prLoading && topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {topThree.map((pr, idx) => (
              <a
                key={pr.id}
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-4 rounded-xl border transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
                style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="absolute top-3 right-3 text-[10px] text-neutral-600">#{idx + 1}</span>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-neutral-500 truncate">{pr.repo}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${
                    pr.state === 'merged' ? 'bg-purple-500/15 text-purple-400' : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {pr.state === 'merged' ? 'merged' : 'open'}
                  </span>
                </div>

                <p className="text-sm text-neutral-200 line-clamp-3 leading-relaxed mb-4 group-hover:text-white transition-colors">
                  {pr.title}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-neutral-600">{timeAgo(pr.created_at)}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Scrollable rest */}
        {!prLoading && rest.length > 0 && (
          <div className="max-h-[220px] overflow-y-auto flex flex-col divide-y divide-white/[0.04] pr-1">
            {rest.map((pr) => (
              <a
                key={pr.id}
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 py-2.5 hover:bg-white/[0.02] transition-colors rounded px-1"
              >
                <GitPullRequest className={`w-3.5 h-3.5 flex-shrink-0 ${pr.state === 'merged' ? 'text-purple-500' : 'text-emerald-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-300 truncate group-hover:text-white transition-colors">{pr.title}</p>
                  <p className="text-[10px] text-neutral-600 truncate">{pr.repo}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${pr.state === 'merged' ? 'bg-purple-500/15 text-purple-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                    {pr.state}
                  </span>
                  <span className="text-[10px] text-neutral-600">{timeAgo(pr.created_at)}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!prLoading && prs.length === 0 && (
          <div className="h-24 flex flex-col items-center justify-center gap-2">
            <GitBranch className="w-5 h-5 text-neutral-700" />
            <p className="text-xs text-neutral-600">No public merged PRs found</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default GithubGraph;
