'use client';
import { useScroll, useTransform, motion } from 'motion/react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  period?: string;
  company?: string;
  location?: string;
  companyLogo?: { src: string; alt: string };
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  // Track which entry is currently "active" based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const triggerY = window.scrollY + window.innerHeight * 0.45;
      let active = 0;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (triggerY >= top) active = i;
      });
      setActiveIndex(active);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10 bg-black flex items-center justify-center"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 w-full">
        {data.map((item, index) => {
          const isVisited = index < activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div
              key={index}
              ref={(el) => { itemRefs.current[index] = el; }}
              className="flex justify-start pt-10 md:pt-36 md:gap-10"
            >
              {/* Left column: dot + meta */}
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                {/* Dot */}
                <div className="h-10 absolute left-3 md:left-3 w-10 flex items-center justify-center">
                  {/* Pulse ring for current entry — warm stone tint */}
                  {isCurrent && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: 'rgba(168,162,158,0.12)' }}
                    />
                  )}

                  <div
                    className="relative z-10 rounded-full transition-all duration-500 flex items-center justify-center"
                    style={
                      isVisited
                        ? {
                            width: 10,
                            height: 10,
                            background: '#57534e', // stone-600 — clearly past
                          }
                        : isCurrent
                        ? {
                            width: 14,
                            height: 14,
                            background: '#e7e5e4', // stone-200 — bright "you are here"
                            boxShadow:
                              '0 0 0 4px rgba(168,162,158,0.15), 0 0 18px rgba(231,229,228,0.2)',
                          }
                        : {
                            width: 10,
                            height: 10,
                            background: 'transparent',
                            border: '1.5px solid rgba(120,113,108,0.3)', // stone-500 at 30%
                          }
                    }
                  />
                </div>

                {/* Company info in left rail (desktop) */}
                <div className="hidden md:flex flex-col pl-20 gap-1">
                  {item.companyLogo?.src && (
                    <div className="relative w-7 h-7 rounded overflow-hidden mb-1 flex-shrink-0"
                      style={{ border: '1px solid rgba(120,113,108,0.25)' }}>
                      <Image
                        src={item.companyLogo.src}
                        alt={item.companyLogo.alt}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  {item.period && (
                    <span
                      className="text-[11px] font-medium leading-tight"
                      style={{
                        color: isCurrent
                          ? '#a8a29e'   // stone-400
                          : '#57534e',  // stone-600
                      }}
                    >
                      {item.period}
                    </span>
                  )}
                  <h3
                    className="text-sm font-semibold leading-snug"
                    style={{
                      color: isCurrent
                        ? '#d6d3d1'   // stone-300
                        : isVisited
                        ? '#78716c'   // stone-500
                        : '#44403c',  // stone-700
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.company && (
                    <span
                      className="text-[12px] leading-tight"
                      style={{
                        color: isCurrent ? '#78716c' : '#44403c',
                      }}
                    >
                      {item.company}
                    </span>
                  )}
                </div>
              </div>

              {/* Right column: content */}
              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                {/* Mobile header */}
                <div className="md:hidden mb-4">
                  <div className="flex items-center gap-3 mb-1">
                    {item.companyLogo?.src && (
                      <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Image
                          src={item.companyLogo.src}
                          alt={item.companyLogo.alt || ''}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <h3
                      className="text-lg font-bold"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  {item.period && (
                    <p className="text-xs" style={{ color: '#78716c' }}>
                      {item.period} · {item.company}
                    </p>
                  )}
                </div>

                {item.content}
              </div>
            </div>
          );
        })}

        {/* ── Background track: dashed stone line (the "not yet" portion) ── */}
        <div
          className="absolute left-8 top-0 pointer-events-none"
          style={{
            width: 2,
            height: height,
            // 4 px dash / 7 px gap in stone-600 at low opacity
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(120,113,108,0.25) 0px, rgba(120,113,108,0.25) 4px, transparent 4px, transparent 11px)',
          }}
        />

        {/* ── Animated fill: solid stone gradient for the scrolled area ── */}
        <div
          className="absolute left-8 top-0 overflow-hidden pointer-events-none"
          style={{ width: 2, height: height }}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              width: 2,
              // Matches the reading-progress bar stone palette
              background:
                'linear-gradient(to bottom, transparent 0%, #44403c 8%, #78716c 35%, #a8a29e 70%, #d6d3d1 100%)',
              borderRadius: 4,
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};
