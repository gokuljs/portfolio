import styles from '@styles/page.module.scss';
import Hero from './ui/home/Hero/hero';
import GithubGraph from './ui/home/GithubGraph/GithubGraph';
import Skill from './ui/home/Skills/Skill';
import TsParticles from './ui/home/TsParticles/TsParticles';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Hero />
      <GithubGraph />
      <Skill />
      <TsParticles />
    </div>
  );
}
