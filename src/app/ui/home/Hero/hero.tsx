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

  return (
    <div className={`${styles.hero} ${mounted ? styles.mounted : ''}`}>
      <div className={styles.heroBody}>
        <p className={styles.overline}>
          EX&#8202;-&#8202;YC &nbsp;·&nbsp; GENERALIST &nbsp;·&nbsp; DEVELOPER
        </p>

        <h1 className={styles.name}>GOKUL JS</h1>

        <div className={styles.rule} />

        <div className={styles.bottomRow}>
          <p className={styles.roles}>
            FULL&#8209;STACK &nbsp;·&nbsp; AI SYSTEMS &nbsp;·&nbsp; VOICE
          </p>
          <a href="mailto:jsgokul123@gmail.com" className={styles.ctaBtn}>
            GET IN TOUCH &nbsp;↗
          </a>
        </div>
      </div>

      <SocialDock />
    </div>
  );
};

export default Hero;
