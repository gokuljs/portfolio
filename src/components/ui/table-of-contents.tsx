'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useSpring } from 'framer-motion';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface DotPos {
  x: number;
  y: number;
}

const TRACK_X = 8;
const SUB_OFFSET_X = 24;
const CURVE_R = 8;
const PLANE_SIZE = 16;

function buildPath(dots: DotPos[]): string {
  if (dots.length < 2) return '';
  const parts: string[] = [];
  parts.push(`M ${dots[0].x} ${dots[0].y}`);

  for (let i = 1; i < dots.length; i++) {
    const prev = dots[i - 1];
    const curr = dots[i];

    if (prev.x === curr.x) {
      parts.push(`L ${curr.x} ${curr.y}`);
    } else if (curr.x > prev.x) {
      // Main track → sub-item (curve right)
      const midY = (prev.y + curr.y) / 2;
      parts.push(`L ${prev.x} ${midY - CURVE_R}`);
      parts.push(`Q ${prev.x} ${midY} ${prev.x + CURVE_R} ${midY}`);
      parts.push(`L ${curr.x - CURVE_R} ${midY}`);
      parts.push(`Q ${curr.x} ${midY} ${curr.x} ${midY + CURVE_R}`);
      parts.push(`L ${curr.x} ${curr.y}`);
    } else {
      // Sub-item → main track (curve back left)
      const midY = (prev.y + curr.y) / 2;
      parts.push(`L ${prev.x} ${midY - CURVE_R}`);
      parts.push(`Q ${prev.x} ${midY} ${prev.x - CURVE_R} ${midY}`);
      parts.push(`L ${curr.x + CURVE_R} ${midY}`);
      parts.push(`Q ${curr.x} ${midY} ${curr.x} ${midY + CURVE_R}`);
      parts.push(`L ${curr.x} ${curr.y}`);
    }
  }
  return parts.join(' ');
}

function getPointAtProgress(dots: DotPos[], activeIdx: number): DotPos {
  if (dots.length === 0) return { x: TRACK_X, y: 0 };
  if (activeIdx < 0) return dots[0];
  if (activeIdx >= dots.length) return dots[dots.length - 1];
  return dots[activeIdx];
}

function getPathLengthAtIndex(
  svgPath: SVGPathElement | null,
  dots: DotPos[],
  index: number
): number {
  if (!svgPath || dots.length === 0) return 0;
  const totalLen = svgPath.getTotalLength();
  if (index <= 0) return 0;
  if (index >= dots.length - 1) return totalLen;

  const target = dots[index];
  let best = 0;
  let bestDist = Infinity;
  const steps = 200;
  for (let s = 0; s <= steps; s++) {
    const len = (s / steps) * totalLen;
    const pt = svgPath.getPointAtLength(len);
    const dist = Math.abs(pt.x - target.x) + Math.abs(pt.y - target.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = len;
    }
  }
  return best;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDir, setScrollDir] = useState<'down' | 'up'>('down');
  const isClickScrolling = useRef(false);
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [dotPositions, setDotPositions] = useState<DotPos[]>([]);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const articleContent = document.querySelector('.blog-content');
      if (!articleContent) return;

      const headingElements = articleContent.querySelectorAll('h2, h3');
      const items: TOCItem[] = [];

      headingElements.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        if (!heading.id) heading.id = id;
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

  const measurePositions = useCallback(() => {
    if (!containerRef.current || itemRefs.current.length === 0) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const positions: DotPos[] = [];
    itemRefs.current.forEach((btn, i) => {
      if (!btn) {
        positions.push({ x: TRACK_X, y: 0 });
        return;
      }
      const btnRect = btn.getBoundingClientRect();
      const centerY = btnRect.top - containerRect.top + btnRect.height / 2;
      const isSubItem = headings[i]?.level === 3;
      positions.push({
        x: isSubItem ? SUB_OFFSET_X : TRACK_X,
        y: centerY,
      });
    });

    setDotPositions(positions);
    if (positions.length > 0) {
      setSvgHeight(Math.max(...positions.map((p) => p.y)) + 20);
    }
  }, [headings]);

  useEffect(() => {
    if (headings.length === 0) return;
    const raf = requestAnimationFrame(() => setTimeout(measurePositions, 60));
    return () => cancelAnimationFrame(raf);
  }, [headings, measurePositions]);

  useEffect(() => {
    window.addEventListener('resize', measurePositions);
    return () => window.removeEventListener('resize', measurePositions);
  }, [measurePositions]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const currentY = window.scrollY;
      if (Math.abs(currentY - lastScrollY.current) > 2) {
        setScrollDir(currentY > lastScrollY.current ? 'down' : 'up');
      }
      lastScrollY.current = currentY;

      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      if (currentY + viewHeight >= docHeight - 50) {
        setActiveIndex(headings.length - 1);
        return;
      }

      let newActive = 0;
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            newActive = i;
            break;
          }
        }
      }
      setActiveIndex(newActive);
    };

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

  const scrollToHeading = (id: string, index: number) => {
    const element = document.getElementById(id);
    if (!element) return;

    isClickScrolling.current = true;
    const dir = index > activeIndex ? 'down' : 'up';
    setScrollDir(dir);
    setActiveIndex(index);

    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    window.scrollTo({
      top: Math.max(0, rect.top + scrollTop - 120),
      behavior: 'smooth',
    });

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const fullPathD = useMemo(() => buildPath(dotPositions), [dotPositions]);

  const dashOffset = useMemo(() => {
    return getPathLengthAtIndex(pathRef.current, dotPositions, activeIndex);
  }, [activeIndex, dotPositions, fullPathD]);

  const totalPathLength = useMemo(() => {
    return pathRef.current?.getTotalLength() || 0;
  }, [fullPathD]);

  const activeDot = useMemo(
    () => getPointAtProgress(dotPositions, activeIndex),
    [dotPositions, activeIndex]
  );

  const planeY = useSpring(activeDot.y, { stiffness: 150, damping: 20, mass: 0.6 });
  const planeX = useSpring(activeDot.x, { stiffness: 150, damping: 20, mass: 0.6 });

  useEffect(() => {
    planeY.set(activeDot.y);
    planeX.set(activeDot.x);
  }, [activeDot, planeX, planeY]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed left-6 2xl:left-10 top-32 w-[220px] 2xl:w-[240px] z-40">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-neutral-400">
            <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="2" y="7.25" width="8" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="2" y="11.5" width="10" height="1.5" rx="0.75" fill="currentColor" />
          </svg>
          <span className="text-[13px] font-medium text-neutral-300 tracking-wide">
            On This Page
          </span>
        </div>

        {/* Timeline container */}
        <div ref={containerRef} className="relative" style={{ paddingLeft: '40px' }}>
          {/* SVG layer for path + dots + plane */}
          {dotPositions.length > 1 && (
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              width="50"
              height={svgHeight}
              style={{ overflow: 'visible' }}
            >
              {/* Dashed full path (background) */}
              <path
                d={fullPathD}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />

              {/* Solid progress path (foreground) */}
              <path
                ref={pathRef}
                d={fullPathD}
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
                strokeDasharray={`${dashOffset} ${totalPathLength}`}
                strokeDashoffset="0"
                style={{
                  transition:
                    'stroke-dasharray 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />

              {/* Dots */}
              {dotPositions.map((dot, i) => {
                const isPassed = i < activeIndex;
                const isActive = i === activeIndex;
                const isSubItem = headings[i]?.level === 3;
                const r = isSubItem ? 2.5 : 3.5;

                if (isActive) return null;

                return isPassed ? (
                  <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r={r}
                    fill="rgba(160,160,160,0.9)"
                  />
                ) : (
                  <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r={r}
                    fill="black"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          )}

          {/* Plane overlay */}
          {dotPositions.length > 0 && (
            <motion.div
              className="absolute pointer-events-none z-20"
              style={{
                x: planeX,
                y: planeY,
                translateX: '-50%',
                translateY: '-50%',
                left: 0,
                top: 0,
              }}
            >
              <motion.svg
                width={PLANE_SIZE}
                height={PLANE_SIZE}
                viewBox="0 0 24 24"
                fill="white"
                animate={{ rotate: scrollDir === 'down' ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </motion.svg>
            </motion.div>
          )}

          {/* Text items */}
          {headings.map((heading, index) => {
            const isPassed = index < activeIndex;
            const isActive = index === activeIndex;
            const isSubItem = heading.level === 3;

            return (
              <button
                key={heading.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                onClick={() => scrollToHeading(heading.id, index)}
                className={`flex items-center w-full text-left group ${
                  isSubItem ? 'pl-4' : 'pl-0'
                }`}
                style={{
                  paddingTop: index === 0 ? '0px' : '5px',
                  paddingBottom: '5px',
                }}
              >
                <span
                  className={`leading-snug transition-colors duration-200 ${
                    isActive
                      ? 'text-white font-medium'
                      : isPassed
                        ? 'text-neutral-400 group-hover:text-neutral-200'
                        : 'text-neutral-500 group-hover:text-neutral-300'
                  } ${isSubItem ? 'text-[11px] 2xl:text-[12px]' : 'text-[12px] 2xl:text-[13px]'}`}
                >
                  {heading.text.length > 28
                    ? heading.text.substring(0, 28) + '…'
                    : heading.text}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}
