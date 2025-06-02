'use client';

import { useState } from 'react';
import styles from '@styles/changelog.module.scss';
import { categories, getAllTags } from '../../../data/changelog';

interface ChangelogFiltersProps {
  selectedCategory?: string;
  selectedTags?: string[];
  onCategoryChange?: (category: string) => void;
  onTagToggle?: (tag: string) => void;
}

export default function ChangelogFilters({
  selectedCategory = 'all',
  selectedTags = [],
  onCategoryChange,
  onTagToggle,
}: ChangelogFiltersProps) {
  const allTags = getAllTags();

  return (
    <div className={styles.filters}>
      <div className={styles.categoryFilters}>
        <h3>Categories</h3>
        {categories.map((category) => (
          <button
            key={category.value}
            className={`${styles.categoryButton} ${
              selectedCategory === category.value ? styles.active : ''
            }`}
            onClick={() => onCategoryChange?.(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className={styles.tagFilters}>
        <h3>Tags</h3>
        <div className={styles.tagGrid}>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tag} ${
                selectedTags.includes(tag) ? styles.active : ''
              }`}
              onClick={() => onTagToggle?.(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
