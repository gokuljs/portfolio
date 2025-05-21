import styles from '@styles/page.module.scss';
import Hero from './ui/home/Hero/hero';
import GithubGraph from './ui/home/GithubGraph/GithubGraph';
import Skill from './ui/home/Skills/Skill';
import Experience from './ui/home/Experience/Experience';
import Footer from './ui/home/Footer/Footer';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Hero />
      <GithubGraph />
      <Skill />
      <Experience />

      <Footer />
    </div>
  );
}
