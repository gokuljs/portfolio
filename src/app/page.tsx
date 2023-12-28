import styles from '@styles/page.module.scss';
import Hero from './ui/home/Hero/hero';
import GithubGraph from './ui/home/GithubGraph/GithubGraph';
import Skill from './ui/home/Skills/Skill';
import TsParticles from './ui/home/TsParticles/TsParticles';
import Experience from './ui/home/Experience/Experience';
import Footer from './ui/home/Footer/Footer';
import Navbar from './ui/home/Navbar/Navbar';
import { initSuperflow } from '@usesuperflow/client';

initSuperflow('VbjQjpBkhVMpTD1tGncR', {
  projectId: '948158540742083',
});

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <Hero />
      <GithubGraph />
      <Skill />
      <Experience />
      <Footer />
      <TsParticles />
    </div>
  );
}
