'use client';

import { useState, useMemo } from 'react';
import { activities, type ActivityCategory } from '@/data/activity-data';
import styles from './activity.module.scss';

type Filter = 'all' | ActivityCategory;
type SortDir = 'newest' | 'oldest';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'reading', label: 'Reading' },
  { value: 'building', label: 'Building' },
  { value: 'done', label: 'Done' },
];

const DOT_CLASS: Record<string, string> = {
  active: styles.dotActive,
  paused: styles.dotPaused,
  complete: styles.dotComplete,
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
      <section className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Activity</h1>
          <a href="/" className={styles.back}>
            ← back
          </a>
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

        <p className={styles.issueCount}>{filtered.length} items</p>

        <div className={styles.list}>
          {filtered.length === 0 && <div className={styles.empty}>No items match this filter.</div>}

          {filtered.map((item) => (
            <div key={item.id} className={styles.row}>
              <div className={`${styles.dot} ${DOT_CLASS[item.status] ?? styles.dotComplete}`} />
              <span className={styles.label}>{item.category}</span>
              <div className={styles.content}>
                <p className={styles.itemTitle}>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </p>
                {item.detail && <p className={styles.detail}>{item.detail}</p>}
                {item.tags && item.tags.length > 0 && (
                  <div className={styles.tags}>
                    {item.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className={styles.date}>{formatDate(item.date)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
