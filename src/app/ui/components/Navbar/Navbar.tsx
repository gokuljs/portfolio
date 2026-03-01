'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'info' } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showToast = useCallback((message: string, type: 'error' | 'info' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
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

  const handleDownload = async () => {
    setMenuOpen(false);
    try {
      const res = await fetch('/api/check-resume-access');
      const { allowed } = await res.json();

      if (!allowed) {
        showToast('Resume download is not available in your region.', 'error');
        return;
      }

      // Track the download
      fetch('/api/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathname: '/resume-download',
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          eventType: 'resume_download',
        }),
      }).catch(() => {});

      // Trigger download
      const link = document.createElement('a');
      link.href = RESUME;
      link.download = 'GokulJS.pdf';
      link.click();
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <>
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'error' ? '#1a1a1a' : '#1a1a1a',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '90vw',
            textAlign: 'center',
            borderLeft: `4px solid ${toast.type === 'error' ? '#ef4444' : '#3b82f6'}`,
            animation: 'slideUp 0.25s ease',
          }}
        >
          <span>{toast.type === 'error' ? '🚫' : 'ℹ️'}</span>
          {toast.message}
        </div>
      )}

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
          <button className={styles.mobileDownload} onClick={handleDownload}>
            Download CV ↓
          </button>
        </nav>

        {/* Right: download CV (desktop) + hamburger (mobile) */}
        <div className={styles.navRight}>
          <button className={styles.downloadBtn} onClick={handleDownload}>
            Download CV <span>↓</span>
          </button>

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
    </>
  );
};

export default Navbar;
