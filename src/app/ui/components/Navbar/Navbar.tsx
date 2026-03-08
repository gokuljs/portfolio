'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { MapPinOff, AlertCircle } from 'lucide-react';
import styles from '@styles/navbar.module.scss';

const navLinks = [
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blogs', href: '/blogs' },
];

const RESUME = '/GokulJS.pdf';

const HIDE_DELAY = 2500;

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'info' } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAtTop = useRef(true);

  useEffect(() => {
    const resetHideTimer = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (!isAtTop.current) {
        hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY);
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      isAtTop.current = y < 10;

      if (isAtTop.current) {
        setVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      } else if (delta < -5) {
        setVisible(true);
        resetHideTimer();
      } else if (delta > 8) {
        setVisible(false);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      }

      lastScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
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
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            className={styles.toast}
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className={`${styles.toastIcon} ${toast.type === 'error' ? styles.toastIconError : styles.toastIconInfo}`}>
              {toast.type === 'error' ? <MapPinOff size={15} /> : <AlertCircle size={15} />}
            </div>
            <div className={styles.toastBody}>
              <span className={styles.toastTitle}>
                {toast.type === 'error' ? 'Not available in your region' : 'Info'}
              </span>
              <span className={styles.toastSub}>{toast.message}</span>
            </div>
            <div className={styles.toastProgress} />
          </motion.div>
        )}
      </AnimatePresence>

      <header className={`${styles.header} ${visible ? '' : styles.hidden}`}>
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
