import styles from '@styles/page.module.scss';
import Hero from './ui/home/Hero/hero';
import GithubGraph from './ui/home/GithubGraph/GithubGraph';
import Skill from './ui/home/Skills/Skill';
import TsParticles from './ui/home/TsParticles/TsParticles';
import Experience from './ui/home/Experience/Experience';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Hero />
      <GithubGraph />
      <Skill />
      <Experience />
      <TsParticles />
    </div>
  );
}
