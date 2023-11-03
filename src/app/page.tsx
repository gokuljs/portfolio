import styles from '@styles/page.module.scss';
import Hero from './ui/home/Hero/hero';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Hero />
    </div>
  );
}
