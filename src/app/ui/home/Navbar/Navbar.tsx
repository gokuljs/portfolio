'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '@styles/navar.module.scss';
import { PinBottomIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [goingUp, setGoingUp] = useState(true);
  const prevScrollY = useRef(0);
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (
        window.pageYOffset > 100 &&
        prevScrollY.current < currentScrollY &&
        goingUp
      ) {
        setGoingUp(false);
      }
      if (prevScrollY.current > currentScrollY && !goingUp) {
        setGoingUp(true);
      }
      prevScrollY.current = currentScrollY;
      if (headerRef.current) {
        headerRef.current.style.background =
          currentScrollY < 100 ? 'transparent' : '#fff';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [goingUp]);

  console.log(goingUp, 'ssss');

  return (
    <div
      ref={headerRef}
      className={clsx(
        styles.Navbar,
        { [styles.scrolled]: scrolled },
        {
          [styles.navHidden]: !goingUp,
        },
      )}
    >
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
