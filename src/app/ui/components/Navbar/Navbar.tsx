'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@styles/navbar.module.scss';

const navLinks = [
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blogs', href: '/blogs' },
];

const RESUME = '/GokulJS.pdf';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    setMenuOpen(false);
    if (pathname === '/') {
      document.getElementById(href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/${href}`);
    }
  };

  const trackAndDownload = async () => {
    setMenuOpen(false);
    try {
      await fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathname: '/resume-download',
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          eventType: 'resume_download',
        }),
      });
    } catch {
      // silent
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* Logo */}
      <Link href="/" className={styles.logo}>
        Gokul JS
      </Link>

      {/* Centre nav */}
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        {navLinks.map(({ label, href }) => (
          <Link key={label} href={href} onClick={(e) => handleNavClick(e, href)}>
            {label}
          </Link>
        ))}
        {/* visible only in mobile drawer */}
        <a
          href={RESUME}
          download="GokulJS.pdf"
          className={styles.mobileDownload}
          onClick={trackAndDownload}
        >
          Download CV ↓
        </a>
      </nav>

      {/* Right: download CV (desktop) + hamburger (mobile) */}
      <div className={styles.navRight}>
        <a
          href={RESUME}
          download="GokulJS.pdf"
          className={styles.downloadBtn}
          onClick={trackAndDownload}
        >
          Download CV <span>↓</span>
        </a>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
