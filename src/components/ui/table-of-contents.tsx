'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
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

      const scrollY = window.scrollY;

      // Find active heading - the last one that's above the trigger point
      let currentActiveId = headings[0]?.id || '';

      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollY + 150 >= elementTop) {
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

    const elementTop = element.offsetTop;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - viewportHeight;
    
    let scrollTarget = elementTop - 120;
    if (scrollTarget > maxScroll) {
      scrollTarget = maxScroll;
    }

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
    <nav className="hidden xl:block fixed left-6 2xl:left-10 top-1/2 -translate-y-1/2 w-[180px] 2xl:w-[200px] z-40">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-4">
          Contents
        </p>
        
        <ul className="space-y-1">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            
            return (
              <li key={heading.id} className="relative">
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className="flex items-center gap-3 w-full text-left py-1 group"
                >
                  {/* Simple indicator bar */}
                  <div 
                    className={`w-[3px] h-4 rounded-full flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'bg-stone-400' : 'bg-neutral-800'
                    }`}
                  />
                  
                  {/* Heading text */}
                  <span
                    className={`text-[11px] 2xl:text-[12px] leading-snug transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-neutral-500 group-hover:text-neutral-300'
                    }`}
                  >
                    {heading.text.length > 24 
                      ? heading.text.substring(0, 24) + '...' 
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
