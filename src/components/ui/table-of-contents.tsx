'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  theme?: 'light' | 'dark';
}

export function TableOfContents({ theme = 'light' }: TableOfContentsProps) {
  const isLight = theme === 'light';
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const isClickScrolling = useRef(false);

  // Extract headings on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const articleContent = document.querySelector('.blog-content');
      if (!articleContent) return;

      const headingElements = articleContent.querySelectorAll('h2, h3');
      const items: TOCItem[] = [];

      headingElements.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        if (!heading.id) {
          heading.id = id;
        }
        items.push({
          id,
          text: heading.textContent || '',
          level: heading.tagName === 'H2' ? 2 : 3,
        });
      });

      setHeadings(items);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Track active section
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      // Find active heading - the last one that's above the trigger point (150px from top)
      let currentActiveId = headings[0]?.id || '';

      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActiveId = headings[i].id;
            break;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    // Initial calculation
    setTimeout(handleScroll, 150);

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    isClickScrolling.current = true;
    setActiveId(id);

    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const elementTop = rect.top + scrollTop;
    
    const scrollTarget = elementTop - 120;

    window.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: 'smooth',
    });

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 600);
  };

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed left-6 2xl:left-10 top-32 w-[180px] 2xl:w-[200px] z-40" style={{ color: isLight ? '#111' : '#e5e5e5' }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p
          style={{
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: isLight ? '#9ca3af' : '#525252',
            marginBottom: '1rem',
          }}
        >
          Contents
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    textAlign: 'left',
                    padding: '3px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '3px',
                      height: '14px',
                      borderRadius: '2px',
                      flexShrink: 0,
                      background: isActive
                        ? (isLight ? '#374151' : '#a3a3a3')
                        : (isLight ? '#e5e7eb' : '#2a2a2a'),
                      transition: 'background 0.2s',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      lineHeight: 1.4,
                      color: isActive
                        ? (isLight ? '#111' : '#e5e5e5')
                        : (isLight ? '#9ca3af' : '#525252'),
                      transition: 'color 0.2s',
                    }}
                  >
                    {heading.text.length > 26
                      ? heading.text.substring(0, 26) + '…'
                      : heading.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </nav>
  );
}
