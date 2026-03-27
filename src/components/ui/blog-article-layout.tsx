'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ReadingProgressBar } from './reading-progress';
import { TableOfContents } from './table-of-contents';
import { calculateReadingTime } from '@/utils/reading-time';

type Theme = 'light' | 'dark';

interface BlogArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  date: string;
  dateISO?: string;
  readingTime?: string;
  tags?: string[];
  featuredImage?: string;
}

export function BlogArticleLayout({
  children,
  title,
  description,
  date,
  dateISO,
  readingTime,
  tags,
  featuredImage,
}: BlogArticleLayoutProps) {
  const estimatedReadTime = readingTime || calculateReadingTime(children);
  const isoDate = dateISO ?? date;

  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('blog-theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    const color = theme === 'light' ? '#fafaf8' : '#141414';
    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  const toggleTheme = (t: Theme, originEl?: HTMLElement) => {
    if (t === theme) return;

    const color = t === 'light' ? '#fafaf8' : '#141414';

    const apply = () => {
      // Set bg synchronously so it's captured in the transition snapshot
      document.documentElement.style.backgroundColor = color;
      document.body.style.backgroundColor = color;
      setTheme(t);
      localStorage.setItem('blog-theme', t);
    };

    if (!('startViewTransition' in document)) {
      apply();
      return;
    }

    const rect = originEl?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.style.setProperty('--vt-x', `${x}px`);
    document.documentElement.style.setProperty('--vt-y', `${y}px`);
    document.documentElement.style.setProperty('--vt-r', `${maxRadius}px`);

    (document as Document & { startViewTransition: (cb: () => void) => void })
      .startViewTransition(apply);
  };

  const isLight = theme === 'light';

  const bg        = isLight ? '#fafaf8' : '#141414';
  const topBarBg  = isLight ? 'rgba(250,250,248,0.92)' : 'rgba(20,20,20,0.92)';
  const border    = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
  const textMuted = isLight ? '#9ca3af' : '#525252';
  const textLink  = isLight ? '#6b7280' : '#737373';
  const textLinkHover = isLight ? '#111' : '#e5e5e5';

  if (!mounted) return null;

  return (
    <>
      <ReadingProgressBar />
      <TableOfContents theme={theme} />

      {/* Font import */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
        rel="stylesheet"
      />

      {/* Minimal top bar */}
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          background: topBarBg,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <Link
          href="/blogs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: textLink,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = textLinkHover)}
          onMouseLeave={e => (e.currentTarget.style.color = textLink)}
        >
          <ArrowLeft size={13} />
          All posts
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme swatches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={(e) => toggleTheme('light', e.currentTarget)}
              title="Light mode"
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#f5f5f0',
                border: theme === 'light'
                  ? '2px solid #111'
                  : '1.5px solid #ccc',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
                transition: 'border 0.15s',
              }}
            />
            <button
              onClick={(e) => toggleTheme('dark', e.currentTarget)}
              title="Dark mode"
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#141414',
                border: theme === 'dark'
                  ? '2px solid #888'
                  : '1.5px solid #555',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
                transition: 'border 0.15s',
              }}
            />
          </div>

          <span style={{ width: 1, height: 14, background: border }} />

          <Link
            href="/"
            style={{
              fontSize: '12px',
              color: textLink,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = textLinkHover)}
            onMouseLeave={e => (e.currentTarget.style.color = textLink)}
          >
            gokuljs.com ↗
          </Link>
        </div>
      </header>

      <article
        style={{
          minHeight: '100vh',
          background: bg,
          paddingTop: '88px',
          paddingBottom: '80px',
          transition: 'background 0.25s, color 0.25s',
        }}
        data-theme={theme}
      >
        <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem' }}>

          {/* Article header */}
          <motion.header
            style={{ marginBottom: '2.5rem' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '3px',
                      color: textMuted,
                      background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${border}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
                fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                color: isLight ? '#0f0f0f' : '#f0f0ee',
                margin: '0 0 0.85rem',
              }}
            >
              {title}
            </h1>
            
            {/* Description */}
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: isLight ? '#6b7280' : '#737373',
                margin: '0 0 1.25rem',
              }}
            >
              {description}
            </p>

            {/* Byline */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '12px',
                color: textMuted,
                letterSpacing: '0.01em',
              }}
            >
              <span>Gokul JS</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <time dateTime={isoDate}>{date}</time>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{estimatedReadTime}</span>
            </div>
          </motion.header>

          {/* Featured Image */}
          {featuredImage && (
            <motion.div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                marginBottom: '2.5rem',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image src={featuredImage} alt={title} fill style={{ objectFit: 'cover' }} priority />
            </motion.div>
          )}

          {/* Section break — editorial style */}
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '2.5rem',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div style={{ flex: 1, height: '1px', background: isLight ? '#e5e7eb' : '#262626' }} />
            <span style={{ fontSize: '11px', color: textMuted, letterSpacing: '0.2em', fontFamily: 'system-ui, sans-serif' }}>
              ✦
            </span>
            <div style={{ flex: 1, height: '1px', background: isLight ? '#e5e7eb' : '#262626' }} />
          </motion.div>

          {/* Article body */}
          <motion.div
            className="blog-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            data-theme={theme}
          >
            {children}
          </motion.div>

          {/* Footer */}
          <motion.footer
            style={{ marginTop: '4rem', paddingTop: '0' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: isLight ? '#e5e7eb' : '#262626' }} />
              <span style={{ fontSize: '11px', color: textMuted, letterSpacing: '0.2em' }}>✦</span>
              <div style={{ flex: 1, height: '1px', background: isLight ? '#e5e7eb' : '#262626' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <Link
                href="/blogs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: textLink,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  fontFamily: 'system-ui, sans-serif',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = textLinkHover)}
                onMouseLeave={e => (e.currentTarget.style.color = textLink)}
              >
                <ArrowLeft size={13} />
                All posts
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link
                  href="/"
                  style={{ fontSize: '12px', color: textLink, textDecoration: 'none', fontFamily: 'system-ui, sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.color = textLinkHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = textLink)}
                >
                  gokuljs.com
                </Link>
                <span style={{ width: 1, height: 12, background: border }} />
                <a href="https://github.com/gokuljs" target="_blank" rel="noopener noreferrer" style={{ color: textMuted, transition: 'color 0.2s' }} aria-label="GitHub"
                  onMouseEnter={e => (e.currentTarget.style.color = textLinkHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://x.com/gokul_js029" target="_blank" rel="noopener noreferrer" style={{ color: textMuted, transition: 'color 0.2s' }} aria-label="X / Twitter"
                  onMouseEnter={e => (e.currentTarget.style.color = textLinkHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.footer>
        </div>
      </article>

      <style jsx global>{`
        /* ── Circular theme-switch reveal ── */
        @keyframes vt-reveal {
          from { clip-path: circle(0px at var(--vt-x) var(--vt-y)); }
          to   { clip-path: circle(var(--vt-r) at var(--vt-x) var(--vt-y)); }
        }
        ::view-transition-group(root),
        ::view-transition-image-pair(root),
        ::view-transition-old(root),
        ::view-transition-new(root) {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        ::view-transition-new(root) {
          animation: vt-reveal 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        ::view-transition-old(root) {
          animation: none;
          z-index: -1;
        }

        /* ── Selection colours ── */
        article[data-theme="light"] *::selection {
          background: #c8b89a !important;
          color: #0f0f0f !important;
        }
        article[data-theme="dark"] *::selection {
          background: #3a5070 !important;
          color: #f0f0ee !important;
        }

        /* ── Light theme ── */
        .blog-content[data-theme="light"] {
          color: #2d2d2d;
          font-family: 'Lora', Georgia, 'Times New Roman', serif;
          font-size: 16.5px;
          font-weight: 400;
          line-height: 1.85;
        }
        .blog-content[data-theme="light"] h2 {
          font-family: 'Lora', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #0f0f0f;
          margin-top: 2.5em;
          margin-bottom: 0.75em;
          line-height: 1.35;
        }
        .blog-content[data-theme="light"] h3 {
          font-family: 'Lora', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #1f1f1f;
          margin-top: 2em;
          margin-bottom: 0.6em;
          line-height: 1.4;
        }
        .blog-content[data-theme="light"] p { margin-bottom: 1.15em; }
        .blog-content[data-theme="light"] a { color: #1d4ed8; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(29,78,216,0.35); transition: text-decoration-color 0.2s; }
        .blog-content[data-theme="light"] a:hover { text-decoration-color: #1d4ed8; }
        .blog-content[data-theme="light"] strong { color: #0f0f0f; font-weight: 600; }
        .blog-content[data-theme="light"] em { font-style: italic; }
        .blog-content[data-theme="light"] li::marker { color: #9ca3af; }
        .blog-content[data-theme="light"] blockquote { border-left: 3px solid #e5e7eb; padding-left: 1.25em; color: #6b7280; font-style: italic; margin: 1.5em 0; }
        .blog-content[data-theme="light"] .callout { background: #f9fafb; border-left: 3px solid #d1d5db; padding: 0.75em 1.1em; margin: 1.25em 0; border-radius: 0 4px 4px 0; font-size: 0.92em; }
        .blog-content[data-theme="light"] .callout p { margin: 0; color: #4b5563; }
        .blog-content[data-theme="light"] .callout strong { color: #111827; }
        .blog-content[data-theme="light"] code { font-family: 'SF Mono', 'Fira Code', Menlo, monospace; font-size: 0.82em; background: #f3f4f6; border: 1px solid #e5e7eb; padding: 0.15em 0.4em; border-radius: 3px; color: #1f2937; }
        .blog-content[data-theme="light"] pre { background: #1e1e2e; border-radius: 6px; padding: 1em 1.25em; overflow-x: auto; margin: 1.5em 0; font-size: 13px; line-height: 1.6; }
        .blog-content[data-theme="light"] pre code { background: none; border: none; padding: 0; color: #cdd6f4; font-size: inherit; }
        .blog-content[data-theme="light"] hr { border: none; height: 1px; background: #e5e7eb; margin: 2em 0; }
        .blog-content[data-theme="light"] img { max-width: 100%; height: auto; border-radius: 5px; margin: 1.75em 0; }
        .blog-content[data-theme="light"] mark { background: #fef08a; color: #1f2937; padding: 0.1em 0.25em; border-radius: 2px; }

        /* ── Dark theme ── */
        .blog-content[data-theme="dark"] {
          color: #c9c9c4;
          font-family: 'Lora', Georgia, 'Times New Roman', serif;
          font-size: 16.5px;
          font-weight: 400;
          line-height: 1.85;
        }
        .blog-content[data-theme="dark"] h2 {
          font-family: 'Lora', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #f0f0ee;
          margin-top: 2.5em;
          margin-bottom: 0.75em;
          line-height: 1.35;
        }
        .blog-content[data-theme="dark"] h3 {
          font-family: 'Lora', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #e0e0de;
          margin-top: 2em;
          margin-bottom: 0.6em;
          line-height: 1.4;
        }
        .blog-content[data-theme="dark"] p { margin-bottom: 1.15em; }
        .blog-content[data-theme="dark"] a { color: #93c5fd; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(147,197,253,0.3); transition: text-decoration-color 0.2s; }
        .blog-content[data-theme="dark"] a:hover { text-decoration-color: #93c5fd; }
        .blog-content[data-theme="dark"] strong { color: #f0f0ee; font-weight: 600; }
        .blog-content[data-theme="dark"] em { font-style: italic; }
        .blog-content[data-theme="dark"] li::marker { color: #525252; }
        .blog-content[data-theme="dark"] blockquote { border-left: 3px solid #333; padding-left: 1.25em; color: #737373; font-style: italic; margin: 1.5em 0; }
        .blog-content[data-theme="dark"] .callout { background: rgba(255,255,255,0.03); border-left: 3px solid #333; padding: 0.75em 1.1em; margin: 1.25em 0; border-radius: 0 4px 4px 0; font-size: 0.92em; }
        .blog-content[data-theme="dark"] .callout p { margin: 0; color: #a3a3a3; }
        .blog-content[data-theme="dark"] .callout strong { color: #e5e5e5; }
        .blog-content[data-theme="dark"] code { font-family: 'SF Mono', 'Fira Code', Menlo, monospace; font-size: 0.82em; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); padding: 0.15em 0.4em; border-radius: 3px; color: #e2e8f0; }
        .blog-content[data-theme="dark"] pre { background: #0d0d0d; border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 1em 1.25em; overflow-x: auto; margin: 1.5em 0; font-size: 13px; line-height: 1.6; }
        .blog-content[data-theme="dark"] pre code { background: none; border: none; padding: 0; color: #a3a3a3; font-size: inherit; }
        .blog-content[data-theme="dark"] hr { border: none; height: 1px; background: #262626; margin: 2em 0; }
        .blog-content[data-theme="dark"] img { max-width: 100%; height: auto; border-radius: 5px; margin: 1.75em 0; }
        .blog-content[data-theme="dark"] mark { background: rgba(254,240,138,0.15); color: #fef08a; padding: 0.1em 0.25em; border-radius: 2px; }

        /* Shared list styles */
        .blog-content ul { list-style: disc outside !important; padding-left: 1.4em; margin: 0.5em 0 1.15em; }
        .blog-content ol { list-style: decimal outside !important; padding-left: 1.4em; margin: 0.5em 0 1.15em; }
        .blog-content li { margin-bottom: 0.4em; display: list-item !important; }
        .blog-content li:last-child { margin-bottom: 0; }
        .blog-content li > ul, .blog-content li > ol { margin-top: 0.35em; margin-bottom: 0; }
        .blog-content h2 + *, .blog-content h3 + * { margin-top: 0; }
        .blog-content video, .blog-content iframe { width: 100%; aspect-ratio: 16/9; border-radius: 6px; margin: 1.5em 0; }

        /* Theme-aware images */
        article[data-theme="light"] .theme-img-dark  { display: none; }
        article[data-theme="dark"]  .theme-img-light { display: none; }

        .theme-img-light,
        .theme-img-dark {
          max-width: 100%;
          height: auto;
          display: block;
        }

        @media (max-width: 640px) {
          .blog-content[data-theme="light"],
          .blog-content[data-theme="dark"] { font-size: 15.5px; line-height: 1.78; }
          .blog-content pre { margin-left: -1.5rem; margin-right: -1.5rem; border-radius: 0; }
        }
      `}</style>
    </>
  );
}
