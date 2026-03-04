import styles from '@styles/page.module.scss';
import Hero from './ui/home/Hero/hero';
import GithubGraph from './ui/home/GithubGraph/GithubGraph';
import Skill from './ui/home/Skills/Skill';
import Experience from './ui/home/Experience/Experience';
import Footer from './ui/home/Footer/Footer';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gokul JS',
  url: 'https://gokuljs.com',
  image: 'https://gokuljs.com/gokuljs.png',
  jobTitle: 'Founding Engineer',
  description:
    'Ex-YC founding engineer (W21) building real-time AI systems, voice agents, and scalable web products.',
  alumniOf: {
    '@type': 'Organization',
    name: 'Y Combinator',
    url: 'https://www.ycombinator.com',
  },
  knowsAbout: [
    'Real-Time Voice Agents',
    'WebRTC',
    'LiveKit',
    'Large Language Models',
    'Speech-to-Text',
    'Text-to-Speech',
    'Next.js',
    'React',
    'TypeScript',
    'Python',
    'Full Stack Engineering',
    'AI Systems',
  ],
  sameAs: [
    'https://github.com/gokuljs',
    'https://www.linkedin.com/in/gokul-js/',
    'https://x.com/gokul_js029',
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className={styles.homePage}>
        <Hero />
        <GithubGraph />
        <Skill />
        <Experience />
        <Footer />
      </div>
    </>
  );
}
