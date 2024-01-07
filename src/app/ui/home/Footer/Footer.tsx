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
    </div>
  );
};

export default Footer;
