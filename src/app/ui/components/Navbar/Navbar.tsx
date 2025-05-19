'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@styles/navbar.module.scss';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Gokul JS</div>

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
        <Link href="#skills" onClick={() => setMenuOpen(false)}>
          Skills
        </Link>
        <Link href="#experience" onClick={() => setMenuOpen(false)}>
          Experience
        </Link>
        <Link href="#work" onClick={() => setMenuOpen(false)}>
          work
        </Link>
        <a
          href="#"
          className={styles.downloadBtn}
          onClick={() => setMenuOpen(false)}
        >
          Download CV <span className={styles.downloadIcon}>↓</span>
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
