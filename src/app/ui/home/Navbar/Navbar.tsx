'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '@styles/navar.module.scss';
import {
  DragHandleHorizontalIcon,
  PinBottomIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';
import clsx from 'clsx';

const RESUME = '/GokulJS.pdf';
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [goingUp, setGoingUp] = useState(true);
  const prevScrollY = useRef(0);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const [isNavActive, setIsNavActive] = useState(false);
  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
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

  return (
    <>
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
        <div className={styles.mobileNav}>
          <DragHandleHorizontalIcon
            className={styles.menu}
            onClick={() => {
              setIsMobileNav(true);
              setIsNavActive(true);
            }}
          />
        </div>

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
          <a download="GokulJS.pdf" href={RESUME} className={styles.Resume}>
            <span>
              Download CV <PinBottomIcon className={styles.icon} />
            </span>
          </a>
        </div>
      </div>
      <div
        className={clsx(styles.navSlide, {
          [styles.showNav]: isMobileNav,
          [styles.showNavHidden]: !isMobileNav && isNavActive,
        })}
      >
        <div className={styles.items}>
          <div className={styles.crossIcon}>
            <Cross2Icon
              onClick={() => setIsMobileNav(false)}
              className={styles.icon}
            />
          </div>
          <div className={styles.navItems}>
            <div
              className={styles.topics}
              onClick={() => {
                scrollToSection('skills');
                setIsMobileNav(false);
              }}
            >
              skills
            </div>
            {/* <div className={styles.topics}>Projects</div> */}
            <div
              className={styles.topics}
              onClick={() => {
                scrollToSection('experience');
                setIsMobileNav(false);
              }}
            >
              Experience
            </div>
          </div>
        </div>
        <div className={styles.download}>
          <a download="GokulJS.pdf" href={RESUME} className={styles.Resume}>
            <span>
              Download CV <PinBottomIcon className={styles.icon} />
            </span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
