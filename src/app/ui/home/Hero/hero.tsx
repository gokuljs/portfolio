'use client';
import React from 'react';
import styles from '@styles/hero.module.scss';
import Image from 'next/image';
import { TwitterLogoIcon } from '@radix-ui/react-icons';
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import GitHubCalendar from 'react-github-calendar';

const Hero: React.FC = () => {
  return (
    <>
      <div className={styles.hero}>
        <Image
          className={styles.profile}
          src="/portfolio.jpeg"
          width={180}
          height={180}
          alt="Gokul JS"
        />
        <h1 className={styles.heading}>Developer. Innovator. Web Enthusiast</h1>
        <p className={styles.subtext}>
          Hey, I'm Gokul JS. Former Founding Engineer at AeroTime, YC W21.
          <br />
          Passionate about shaping the web's future and currently looking for a
          new gig.
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
        </div>
      </div>
      <GitHubCalendar
        username="gokuljs"
        colorScheme="dark"
        showWeekdayLabels
        labels={{
          totalCount: '{{count}} contributions in the last half year',
        }}
        style={{
          color: '#4949af',
        }}
      />
    </>
  );
};

export default Hero;
