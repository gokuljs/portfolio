'use client';

import { useState, useMemo } from 'react';
import { activities, type ActivityItem } from '@/data/activity-data';
import styles from './activity.module.scss';

type Filter = 'all' | 'in_progress' | 'done';
type SortDir = 'newest' | 'oldest';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const STATUS_CLASS: Record<string, string> = {
  active: styles.statusActive,
  paused: styles.statusPaused,
  complete: styles.statusComplete,
  backlog: styles.statusBacklog,
};

const STATUS_LABEL: Record<string, string> = {
  active: 'In Progress',
  paused: 'Paused',
  complete: 'Done',
  backlog: 'Backlog',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function DetailCard({ item, onClose }: { item: ActivityItem; onClose: () => void }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardStatus}>
          <div className={`${styles.statusIcon} ${STATUS_CLASS[item.status] ?? styles.statusComplete}`} />
          <span className={styles.cardStatusLabel}>{STATUS_LABEL[item.status] ?? item.status}</span>
        </div>
        <button className={styles.cardClose} onClick={onClose}>✕</button>
      </div>

      <h2 className={styles.cardTitle}>{item.title}</h2>

      {item.detail && <p className={styles.cardDetail}>{item.detail}</p>}
      {item.description && <p className={styles.cardDesc}>{item.description}</p>}

      <div className={styles.cardMeta}>
        <span className={styles.cardDate}>{formatDateLong(item.date)}</span>
        <span className={styles.cardCategory}>{item.category}</span>
      </div>

      {(item.url || item.codeUrl || item.blogUrl) && (
        <div className={styles.cardLinks}>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className={`${styles.cardLinkBtn} ${styles.cardLinkUrl}`}>
              Link
            </a>
          )}
          {item.codeUrl && (
            <a href={item.codeUrl} target="_blank" rel="noopener noreferrer" className={`${styles.cardLinkBtn} ${styles.cardLinkCode}`}>
              Code
            </a>
          )}
          {item.blogUrl && (
            <a href={item.blogUrl} className={`${styles.cardLinkBtn} ${styles.cardLinkBlog}`}>
              Blog
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortDir>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = activities;
    if (filter === 'in_progress') {
      items = activities.filter((a) => a.category === 'reading' || a.category === 'building');
    } else if (filter === 'done') {
      items = activities.filter((a) => a.category === 'done');
    }
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
            <div key={item.id}>
              <div
                className={`${styles.row} ${expandedId === item.id ? styles.rowSelected : ''}`}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className={`${styles.statusIcon} ${STATUS_CLASS[item.status] ?? styles.statusComplete}`} />
                <div className={styles.rowContent}>
                  <span className={styles.rowTitle}>{item.title}</span>
                  {item.detail && <span className={styles.rowDetail}>{item.detail}</span>}
                </div>
                <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
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
              {expandedId === item.id && (
                <DetailCard item={item} onClose={() => setExpandedId(null)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
