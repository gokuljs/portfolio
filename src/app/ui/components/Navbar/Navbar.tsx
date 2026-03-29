'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { MapPinOff, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
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
  const [hidden, setHidden] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'info' } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isBlogArticle = pathname.startsWith('/blogs/') && pathname !== '/blogs';

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY > lastY && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = currentY;
    };
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

      const link = document.createElement('a');
      link.href = RESUME;
      link.download = 'GokulJS.pdf';
      link.click();
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  if (isBlogArticle) return null;

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

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${hidden && !menuOpen ? styles.hidden : ''}`}>
        <Link href="/" className={styles.logo}>
          Gokul JS
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} onClick={(e) => handleNavClick(e, href)}>
              {label}
            </Link>
          ))}
          <button className={styles.mobileDownload} onClick={handleDownload}>
            Download CV ↓
          </button>
        </nav>

        <div className={styles.navRight}>
          {/* Theme swatches */}
          <div className={styles.themeSwatches}>
            <button
              onClick={(e) => toggleTheme('light', e.currentTarget)}
              title="Light mode"
              className={`${styles.swatch} ${styles.swatchLight} ${theme === 'light' ? styles.swatchActive : ''}`}
            />
            <button
              onClick={(e) => toggleTheme('dark', e.currentTarget)}
              title="Dark mode"
              className={`${styles.swatch} ${styles.swatchDark} ${theme === 'dark' ? styles.swatchActive : ''}`}
            />
          </div>

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
