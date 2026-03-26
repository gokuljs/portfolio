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
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const isClickScrolling = useRef(false);
  const isLight = theme === 'light';

  useEffect(() => {
    const timer = setTimeout(() => {
      const articleContent = document.querySelector('.blog-content');
      if (!articleContent) return;
      const headingElements = articleContent.querySelectorAll('h2, h3');
      const items: TOCItem[] = [];
      headingElements.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        if (!heading.id) heading.id = id;
        items.push({ id, text: heading.textContent || '', level: heading.tagName === 'H2' ? 2 : 3 });
      });
      setHeadings(items);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      let currentActiveId = headings[0]?.id || '';
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.getBoundingClientRect().top <= 150) {
          currentActiveId = headings[i].id;
          break;
        }
      }
      setActiveId(currentActiveId);
    };
    setTimeout(handleScroll, 150);
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => { handleScroll(); ticking = false; });
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
    const scrollTarget = element.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
    setTimeout(() => { isClickScrolling.current = false; }, 600);
  };

  if (headings.length === 0) return null;

  const activeIndex = headings.findIndex(h => h.id === activeId);

  return (
    <nav className="hidden xl:block fixed left-6 2xl:left-10 top-32 w-[200px] 2xl:w-[220px] z-40">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
      >
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isPast = activeIndex > index;
          const isH3 = heading.level === 3;

          const textColor = isActive
            ? (isLight ? '#111827' : '#f0f0ee')
            : isPast
              ? (isLight ? '#d1d5db' : '#2a2a2a')
              : (isLight ? '#c9cdd6' : '#262626');

          const fontSize = isActive
            ? (isH3 ? 12.5 : 13.5)
            : (isH3 ? 10 : 11);

          const paddingTop    = isActive ? 6 : 3;
          const paddingBottom = isActive ? 6 : 3;
          const paddingLeft   = isH3 ? 10 : 0;

          return (
            <motion.button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              animate={{ paddingTop, paddingBottom, paddingLeft }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <motion.span
                animate={{
                  fontSize,
                  color: textColor,
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: isActive ? 0 : 0.2,
                  opacity: isPast ? 0.5 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'block',
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: isActive ? 'italic' : 'normal',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {heading.text}
              </motion.span>
            </motion.button>
          );
        })}
      </motion.div>
    </nav>
  );
}
