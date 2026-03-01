'use client';

import { useEffect, useState } from 'react';
import styles from '@styles/hero.module.scss';
import SocialDock from '../../components/SocialDock/SocialDock';

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className={`${styles.hero} ${mounted ? styles.mounted : ''}`}>
      <div className={styles.heroBody}>
        <p className={styles.overline}>
          EX&#8202;-&#8202;YC &nbsp;·&nbsp; FOUNDING ENGINEER &nbsp;·&nbsp; GENERALIST
        </p>

        <h1 className={styles.name}>GOKUL JS</h1>

        <div className={styles.rule} />

        <div className={styles.bottomRow}>
          <p className={styles.roles}>
            FULL&#8209;STACK &nbsp;·&nbsp; AI SYSTEMS &nbsp;·&nbsp; PRODUCT DESIGN
          </p>
          <button className={styles.ctaBtn} onClick={() => scrollTo('experience')}>
            SEE MY WORK &nbsp;↗
          </button>
        </div>
      </div>

      <footer className={styles.heroFooter}>
        <p className={styles.tagline}>
          Let&apos;s create something incredible together.
        </p>
        <p className={styles.email}>jsgokul123@gmail.com</p>
      </footer>

      <SocialDock />
    </div>
  );
};

export default Hero;
