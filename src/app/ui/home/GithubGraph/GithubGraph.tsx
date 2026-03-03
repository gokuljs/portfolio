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

      <div className={`w-full flex flex-col gap-4 ${styles.inner}`}>

        {/* Calendar — centered */}
        <div className={`${styles.container} w-full`} ref={scrollContainerRef}>
          <GlowingEffect spread={80} borderWidth={1} glow={true} disabled={false} proximity={64} inactiveZone={0.01} variant="white" />
          <div className="flex flex-col items-center w-full">
            <div className={styles.calendarWrap}>
              <div className="flex justify-end mb-2">
                <Dropdown dropdownState={dropdownState} setDropdownState={setDropdownState} options={gitHubYearList} value={selectedYear} setValue={setSelectedYear} />
              </div>
              <GitHubCalendar username="gokuljs" year={selectedYear ?? undefined} colorScheme="dark" blockSize={15} fontSize={12} loading={loading}
                theme={{ dark: ['#0a0a0a', '#2e2e2e', '#555555', '#7b7b7b', '#bcbcbc'] }} style={{ color: '#F0F1F4' }} />
            </div>
          </div>
        </div>

        {/* Open source PRs — same width as calendar */}
        <div className="flex justify-center w-full">
        <div className={styles.calendarWrap} style={{ padding: '0 4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: 300, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Open source PRs</p>
            {!prLoading && <span className="text-[10px] text-neutral-600">{prs.length} PRs</span>}
          </div>
          <p className="text-[9px] text-neutral-700" style={{ marginBottom: 8 }}>open source contributions · last 2 years</p>

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
