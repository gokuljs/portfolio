import React from 'react';
import styles from '@styles/hero.module.scss';

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className={styles.heading}>
            Developer. Innovator. Web Enthusiast.
          </h1>
          <p className={styles.subtext}>
            Hey, I'm Gokul JS. Former Founding Engineer at AeroTime, YC W21.
            Passionate about shaping the web's future and currently looking for
            a new gig.
          </p>
        </div>
      </div>
      <div className={styles.profile}></div>
    </div>
  );
};

export default Hero;
