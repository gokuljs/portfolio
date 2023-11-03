import styles from '@styles/page.module.scss';
import Hero from './ui/home/Hero/hero';
import GithubGraph from './ui/home/GithubGraph/GithubGraph';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Hero />
      <GithubGraph />
    </div>
  );
}
