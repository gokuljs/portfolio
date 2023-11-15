import React from 'react';
import styles from '@styles/Footer.module.scss';
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
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
        </div>
        <div className={styles.copyright}></div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#7e7ef1"
          fill-opacity="1"
          d="M0,64L40,101.3C80,139,160,213,240,240C320,267,400,245,480,202.7C560,160,640,96,720,74.7C800,53,880,75,960,106.7C1040,139,1120,181,1200,208C1280,235,1360,245,1400,250.7L1440,256L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default Footer;
