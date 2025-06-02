import styles from '@styles/changelog.module.scss';
import { changelogEntries } from '../../../data/changelog';

export default function ChangelogHeader() {
  const totalEntries = changelogEntries.filter(
    (entry) => entry.status === 'published',
  ).length;
  const featuredEntries = changelogEntries.filter(
    (entry) => entry.featured && entry.status === 'published',
  ).length;
  const categories = new Set(changelogEntries.map((entry) => entry.category))
    .size;

  return (
    <header className={styles.header}>
      <h1>Development Changelog</h1>
      <p className={styles.subtitle}>
        Follow my journey as I build, learn, and ship new features. Get insights
        into my development process and see what's coming next.
      </p>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.number}>{totalEntries}</span>
          <span className={styles.label}>Updates</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>{featuredEntries}</span>
          <span className={styles.label}>Featured</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>{categories}</span>
          <span className={styles.label}>Categories</span>
        </div>
      </div>
    </header>
  );
}
