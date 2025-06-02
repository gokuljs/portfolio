import ChangelogHeader from '../ui/changelog/ChangelogHeader';
import ChangelogList from '../ui/changelog/ChangelogList';
import styles from '@styles/changelog.module.scss';

export const metadata = {
  title: 'Changelog - Gokul JS',
  description:
    "Follow my journey as I build, learn, and ship new features. Get insights into my development process and see what's coming next.",
};

export default function ChangelogPage() {
  return (
    <div className={styles.changelogPage}>
      <ChangelogHeader />
      <div className={styles.changelogContainer}>
        <ChangelogList />
      </div>
    </div>
  );
}
