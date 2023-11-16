import React from 'react';
import styles from '@styles/Footer.module.scss';
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import Gmail from '../../../../../public/gmail.svg';
const Footer = () => {
  return (
    <div className={styles.Footer}>
      <div className={styles.footerSection}>
        <div className={styles.logo}>
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
        <div className={styles.copyright}>
          © 2023 Gokuljs. All rights reserved
        </div>
      </div>
      <svg
        className={styles.waves}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <linearGradient id="myGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4A00E0', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#8E2DE2', stopOpacity: 1 }}
          />
        </linearGradient>
        <path
          fill="url(#myGradient)"
          fill-opacity="1"
          d="M0,64L1440,192L1440,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default Footer;
