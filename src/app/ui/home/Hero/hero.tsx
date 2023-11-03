import React from 'react';
import styles from '@styles/hero.module.scss';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <Image
        className={styles.profile}
        src="/portfolio.jpeg"
        width={300}
        height={300}
        alt="Gokul JS"
      />
      <h1 className={styles.heading}>Developer. Innovator. Web Enthusiast</h1>
      <p className={styles.subtext}>
        Hey, I'm Gokul JS. Former Founding Engineer at AeroTime, YC W21.
        <br />
        Passionate about shaping the web's future and currently looking for a
        new gig.
      </p>
    </div>
  );
};

export default Hero;
