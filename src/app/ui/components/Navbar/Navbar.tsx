'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@styles/navbar.module.scss';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const RESUME = '/GokulJS.pdf';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    event.preventDefault();
    setMenuOpen(false);

    // If we're already on the home page, just scroll to the section
    if (pathname === '/') {
      const targetElement = document.getElementById(targetId.substring(1)); // Remove '#' from id
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home and then scroll
      router.push(`/${targetId}`);
    }
  };

  const trackResumeDownload = async () => {
    try {
      const downloadData = {
        pathname: '/resume-download',
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        eventType: 'resume_download',
      };

      await fetch('/api/track-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(downloadData),
      });
    } catch (error) {
      console.error('Failed to track resume download:', error);
    }
  };

  const handleResumeDownload = () => {
    setMenuOpen(false);
    trackResumeDownload();
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Gokul JS
      </Link>

      <div className={styles.mobileMenuToggle} onClick={toggleMenu}>
        <div
          className={`${styles.hamburgerIcon} ${menuOpen ? styles.open : ''}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        <Link href="#skills" onClick={(e) => handleNavLinkClick(e, '#skills')}>
          Skills
        </Link>
        <Link
          href="#experience"
          onClick={(e) => handleNavLinkClick(e, '#experience')}
        >
          Experience
        </Link>
        <Link href="/projects" onClick={() => setMenuOpen(false)}>
          Projects
        </Link>
        {/* <Link href="#work" onClick={(e) => handleNavLinkClick(e, '#work')}>
          Work
        </Link> */}
        <a
          download="GokulJS.pdf"
          href={RESUME}
          className={styles.downloadBtn}
          onClick={handleResumeDownload}
        >
          Download CV <span className={styles.downloadIcon}>↓</span>
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
