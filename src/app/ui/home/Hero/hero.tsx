import React from 'react';
import styles from '@styles/hero.module.scss';

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h1>Gokul JS</h1>
          <p>Former Founding Engineer at AeroTime, YC W21</p>
          <p>
            Passionate about web development and in search of an exciting new
            gig.
          </p>
        </div>
      </div>
      <div className={styles.profile}>sasas</div>
    </div>
  );
};

export default Hero;
