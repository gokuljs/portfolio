'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { activities } from '@/data/activity-data';
import styles from './HeroSidePanel.module.scss';

const mainReading = activities.find((a) => a.main && a.category === 'reading');
const mainBuilding = activities.find((a) => a.main && a.category === 'building');

interface WeeklyBar { label: string; count: number; weekStart: string; }

function MiniSparkline({ bars, maxVal }: { bars: WeeklyBar[]; maxVal: number }) {
  const W = 200, H = 40, PAD = 2;
  const cW = W - PAD * 2, cH = H - PAD * 2;
  const pts = bars.map((b, i) => ({
    x: PAD + (i / (bars.length - 1)) * cW,
    y: PAD + cH - (b.count / maxVal) * cH,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `M${pts[0].x},${PAD + cH} ` + pts.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ` L${pts[pts.length - 1].x},${PAD + cH} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.sparkline} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sg)" />
      <path d={line} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function useCommits() {
  const [bars, setBars] = useState<WeeklyBar[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('https://github-contributions-api.jogruber.de/v4/gokuljs?y=last');
        if (!res.ok) return;
        const data: { contributions: { date: string; count: number }[] } = await res.json();
        let t = 0;
        const wm: Record<string, number> = {};
        data.contributions.forEach(({ date, count }) => {
          t += count;
          const d = new Date(date);
          const mon = new Date(d);
          mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
          mon.setHours(0, 0, 0, 0);
          const k = mon.toISOString();
          wm[k] = (wm[k] || 0) + count;
        });
        setTotal(t);
        setBars(
          Object.entries(wm)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([ws, count]) => ({
              weekStart: ws,
              label: new Date(ws).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              count,
            }))
        );
      } catch { /**/ } finally { setLoaded(true); }
    }
    load();
  }, []);

  return { bars, total, loaded };
}

/* ── Shared panel content ── */
function PanelContent({ bars, total, loaded }: { bars: WeeklyBar[]; total: number; loaded: boolean }) {
  const maxBar = Math.max(...bars.map(b => b.count), 1);

  return (
    <>
      {mainReading && (
        <>
          <div className={styles.block}>
            <p className={styles.blockLabel}>reading</p>
            <a href={mainReading.url} target="_blank" rel="noopener noreferrer" className={styles.paperLink}>
              {mainReading.paper && <span className={styles.paperVenue}>{mainReading.paper.venue}</span>}
              <p className={styles.paperTitle}>{mainReading.title}</p>
              {mainReading.paper && <p className={styles.paperAuthors}>{mainReading.paper.authors}</p>}
              {mainReading.description && <p className={styles.paperHook}>{mainReading.description}</p>}
            </a>
          </div>
          <div className={styles.divider} />
        </>
      )}

      {mainBuilding && (
        <>
          <div className={styles.block}>
            <div className={styles.blockLabelRow}>
              <p className={styles.blockLabel}>building</p>
              {mainBuilding.status === 'active' && <span className={styles.activePulse} />}
            </div>
            <a href={mainBuilding.url} target="_blank" rel="noopener noreferrer" className={styles.buildLink}>
              <p className={styles.buildTitle}>{mainBuilding.title}</p>
              {mainBuilding.detail && (
                <p className={styles.buildGoal}>{mainBuilding.detail}</p>
              )}
              {mainBuilding.description && (
                <p className={styles.buildDesc}>{mainBuilding.description}</p>
              )}
              {mainBuilding.tags && (
                <div className={styles.tags}>
                  {mainBuilding.tags.slice(0, 4).map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
            </a>
          </div>
          <div className={styles.divider} />
        </>
      )}

      <div className={styles.block}>
        <div className={styles.blockLabelRow}>
          <p className={styles.blockLabel}>commits · last year</p>
          {loaded && <span className={styles.commitCount}>{total.toLocaleString()}</span>}
        </div>
        <div className={styles.sparklineWrap}>
          {!loaded && <div className={styles.sparklineSkeleton} />}
          {loaded && bars.length > 0 && <MiniSparkline bars={bars} maxVal={maxBar} />}
        </div>
      </div>

      <Link href="/activity" className={styles.viewFullBtn}>
        <span className={styles.viewFullBtnText}>View full activity →</span>
      </Link>
    </>
  );
}

/* ── Desktop panel ── */
export default function HeroSidePanel() {
  const { bars, total, loaded } = useCommits();
  return (
    <div className={styles.panel}>
      <PanelContent bars={bars} total={total} loaded={loaded} />
    </div>
  );
}

/* ── Mobile badge + bottom sheet ── */
export function HeroSidePanelMobile() {
  const [open, setOpen] = useState(false);
  const { bars, total, loaded } = useCommits();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Badge */}
      <button className={styles.mobileBadge} onClick={() => setOpen(true)}>
        <span className={styles.mobilePulse} />
        {mainBuilding && <span className={styles.mobileBuilding}>{mainBuilding.title}</span>}
        {mainReading?.paper && (
          <span className={styles.mobileReading}>{mainReading.paper.venue}</span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} />
      )}

      {/* Modal */}
      <div className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`}>
        <div className={styles.sheetHandle} onClick={() => setOpen(false)} />
        <div className={styles.sheetScroll}>
          <PanelContent bars={bars} total={total} loaded={loaded} />
        </div>
      </div>
    </>
  );
}
