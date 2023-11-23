'use client';
import React from 'react';
import styles from '@styles/navar.module.scss';
import { PinBottomIcon } from '@radix-ui/react-icons';

const Navbar = () => {
  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className={styles.Navbar}>
      <div className={styles.logo}></div>
      <div className={styles.items}>
        <div
          className={styles.topics}
          onClick={() => {
            scrollToSection('skills');
          }}
        >
          skills
        </div>
        {/* <div className={styles.topics}>Projects</div> */}
        <div
          className={styles.topics}
          onClick={() => {
            scrollToSection('experience');
          }}
        >
          Experience
        </div>
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
