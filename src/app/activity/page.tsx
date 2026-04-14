'use client';

import { useState, useMemo } from 'react';
import { activities, type ActivityCategory } from '@/data/activity-data';
import styles from './activity.module.scss';

type Filter = 'all' | ActivityCategory;
type SortDir = 'newest' | 'oldest';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'building', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const STATUS_CLASS: Record<string, string> = {
  active: styles.statusActive,
  paused: styles.statusPaused,
  complete: styles.statusComplete,
  backlog: styles.statusBacklog,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortDir>('newest');

  const filtered = useMemo(() => {
    let items = filter === 'all' ? activities : activities.filter((a) => a.category === filter);
    items = [...items].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === 'newest' ? db - da : da - db;
    });
    return items;
  }, [filter, sort]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Activity</h1>
            <span className={styles.countBadge}>{filtered.length}</span>
          </div>
          <a href="/" className={styles.back}>← back</a>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`${styles.filterBtn} ${filter === f.value ? styles.filterBtnActive : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className={styles.sortBtn}
            onClick={() => setSort((s) => (s === 'newest' ? 'oldest' : 'newest'))}
          >
            {sort === 'newest' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>

        <div className={styles.list}>
          {filtered.length === 0 && <div className={styles.empty}>No items match this filter.</div>}
          {filtered.map((item) => (
            <div key={item.id} className={styles.row}>
              <div className={`${styles.statusIcon} ${STATUS_CLASS[item.status] ?? styles.statusComplete}`} />
              <div className={styles.rowContent}>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.rowTitle}>{item.title}</a>
                ) : (
                  <span className={styles.rowTitle}>{item.title}</span>
                )}
                {item.detail && <span className={styles.rowDetail}>{item.detail}</span>}
              </div>
              <div className={styles.actions}>
                {item.codeUrl && (
                  <a href={item.codeUrl} target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
                    Code
                  </a>
                )}
                {item.blogUrl && (
                  <a href={item.blogUrl} className={styles.actionBtn}>
                    Blog
                  </a>
                )}
              </div>
              <span className={styles.date}>{formatDate(item.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
