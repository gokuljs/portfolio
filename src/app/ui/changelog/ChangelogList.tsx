'use client';

import { useState, useMemo } from 'react';
import styles from '@styles/changelog.module.scss';
import { changelogEntries, ChangelogEntry } from '../../../data/changelog';
import ChangelogFilters from './ChangelogFilters';
import ChangelogContent from './ChangelogContent';

const ENTRIES_PER_PAGE = 5;

export default function ChangelogList() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set(),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEntries = useMemo(() => {
    return changelogEntries
      .filter((entry) => entry.status === 'published')
      .filter((entry) => {
        if (selectedCategory === 'all') return true;
        return entry.category === selectedCategory;
      })
      .filter((entry) => {
        if (selectedTags.length === 0) return true;
        return selectedTags.some((tag) => entry.tags.includes(tag));
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedCategory, selectedTags]);

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
    return filteredEntries.slice(0, startIndex + ENTRIES_PER_PAGE);
  }, [filteredEntries, currentPage]);

  const hasMore = paginatedEntries.length < filteredEntries.length;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    setCurrentPage(1);
  };

  const toggleEntryExpansion = (entryId: string) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <ChangelogFilters
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        onCategoryChange={handleCategoryChange}
        onTagToggle={handleTagToggle}
      />

      <div className={styles.entriesList}>
        {paginatedEntries.map((entry) => {
          const isExpanded = expandedEntries.has(entry.id);

          return (
            <article
              key={entry.id}
              className={`${styles.entry} ${
                entry.featured ? styles.featured : ''
              }`}
            >
              <div className={styles.entryHeader}>
                <div className={styles.entryMeta}>
                  <span className={styles.date}>{formatDate(entry.date)}</span>
                  <span
                    className={`${styles.category} ${styles[entry.category]}`}
                  >
                    {entry.category}
                  </span>
                </div>
              </div>

              <h2 className={styles.entryTitle}>{entry.title}</h2>
              <p className={styles.entrySummary}>{entry.summary}</p>

              {isExpanded && <ChangelogContent content={entry.content} />}

              <div className={styles.entryTags}>
                {entry.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <button
                className={styles.expandButton}
                onClick={() => toggleEntryExpansion(entry.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  textDecoration: 'underline',
                }}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            </article>
          );
        })}

        {paginatedEntries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            No entries match your current filters.
          </div>
        )}

        {hasMore && (
          <button className={styles.loadMoreButton} onClick={loadMore}>
            Load More Updates
          </button>
        )}
      </div>
    </>
  );
}
