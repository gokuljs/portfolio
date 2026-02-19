'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [readProgress, setReadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
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
  }, []);

  const calculateProgress = useCallback(() => {
    if (headings.length === 0) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const progress: Record<string, number> = {};
    let currentActive = '';

    headings.forEach((heading, index) => {
      const element = document.getElementById(heading.id);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      
      const nextHeading = headings[index + 1];
      const nextElement = nextHeading ? document.getElementById(nextHeading.id) : null;
      const sectionEnd = nextElement 
        ? nextElement.getBoundingClientRect().top + scrollY 
        : document.body.scrollHeight;

      const sectionHeight = sectionEnd - elementTop;
      const scrolledIntoSection = scrollY + windowHeight * 0.3 - elementTop;
      const sectionProgress = Math.min(Math.max(scrolledIntoSection / sectionHeight, 0), 1);

      progress[heading.id] = sectionProgress;

      if (rect.top <= windowHeight * 0.3 && rect.top > -rect.height) {
        currentActive = heading.id;
      }
    });

    for (let i = headings.length - 1; i >= 0; i--) {
      const element = document.getElementById(headings[i].id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.3) {
          currentActive = headings[i].id;
          break;
        }
      }
    }

    setReadProgress(progress);
    setActiveId(currentActive);
  }, [headings]);

  useEffect(() => {
    calculateProgress();
    window.addEventListener('scroll', calculateProgress, { passive: true });
    return () => window.removeEventListener('scroll', calculateProgress);
  }, [calculateProgress]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed left-[max(2rem,calc(50%-600px))] top-1/2 -translate-y-1/2 w-[200px] z-40">
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
            const progress = readProgress[heading.id] || 0;
            const isRead = progress >= 0.9;
            
            return (
              <li key={heading.id} className="relative">
                <div className="flex items-start gap-3">
                  {/* Progress indicator line */}
                  <div className="relative w-[2px] h-5 mt-1 bg-neutral-800 rounded-full overflow-hidden flex-shrink-0">
                    <motion.div
                      className="absolute bottom-0 left-0 w-full rounded-full"
                      style={{
                        background: isActive 
                          ? 'linear-gradient(to top, #3b82f6, #8b5cf6)' 
                          : isRead 
                            ? '#525252' 
                            : '#525252',
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${progress * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  
                  {/* Heading link */}
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`text-left text-[12px] leading-tight transition-colors duration-200 ${
                      heading.level === 3 ? 'pl-2' : ''
                    } ${
                      isActive
                        ? 'text-white'
                        : isRead
                          ? 'text-neutral-500'
                          : 'text-neutral-600 hover:text-neutral-400'
                    }`}
                  >
                    {heading.text.length > 28 
                      ? heading.text.substring(0, 28) + '...' 
                      : heading.text}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </nav>
  );
}
