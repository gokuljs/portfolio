'use client';
import React, { useEffect, useState } from 'react';
import styles from '@styles/navar.module.scss';
import { PinBottomIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = (): void => {
    const offset = window.scrollY;

    if (offset > 150) {
      // Adjust this value based on your requirement
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className={clsx(styles.Navbar, { [styles.scrolled]: scrolled })}>
      <div className={styles.logo}></div>
      <div className={styles.items}>
        <div className={styles.topics}>skills</div>
        <div className={styles.topics}>Projects</div>
        <div className={styles.topics}>Experience</div>
        <div className={styles.Resume}>
          <span>
            Download CV <PinBottomIcon className={styles.icon} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
