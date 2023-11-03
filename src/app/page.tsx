import styles from '@styles/page.module.scss';
import Hero from './ui/home/Hero/hero';
import GitHubCalendar from 'react-github-calendar';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Hero />
    </div>
  );
}
