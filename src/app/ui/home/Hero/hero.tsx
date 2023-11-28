import React from 'react';
import styles from '@styles/hero.module.scss';
import Image from 'next/image';
import { TwitterLogoIcon } from '@radix-ui/react-icons';
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import Gmail from '../../../../../public/gmail.svg';

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <Image
        className={styles.profile}
        src="/portfolio.jpeg"
        width={140}
        height={140}
        alt="Gokul JS"
      />
      <h1 className={styles.heading}>Gokul JS</h1>
      <p className={styles.subtext}>
        Founding Engineer at AeroTime, YC W21
        <br />
        Passionate about shaping the web's future and currently looking for new
        opportunities.
      </p>
      <div className={styles.logos}>
        <Link target="_blank" href={'https://twitter.com/gokul_js029'}>
          <TwitterLogoIcon className={styles.icon} />
        </Link>
        <Link target="_blank" href={'https://www.linkedin.com/in/gokul-js/'}>
          <LinkedInLogoIcon className={styles.icon} />
        </Link>
        <Link target="_blank" href={'https://github.com/gokuljs'}>
          <GitHubLogoIcon className={styles.icon} />
        </Link>
        <Link target="_blank" href="mailto:jsgokul123@gmail.com">
          <Gmail className={styles.svgIcon} />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
