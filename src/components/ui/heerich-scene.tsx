'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export function HeerichScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const getTheme = useCallback(() => {
    const article = containerRef.current?.closest('article[data-theme]');
    return article?.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }, []);

  useEffect(() => {
    let cancelled = false;

    const observer = new MutationObserver(() => {
      render();
    });

    async function render() {
      const { Heerich } = await import('heerich');
      if (cancelled || !containerRef.current) return;

      const theme = getTheme();
      const isLight = theme === 'light';

      const s = 7;
      const taper = 0.85;

      const h = new Heerich({
        camera: { type: 'isometric', angle: 135 },
        style: {
          fill: isLight ? '#fafaf8' : '#141414',
          stroke: isLight ? '#555555' : '#e0e0de',
          strokeWidth: 0.2,
        },
      });

      h.applyGeometry({
        type: 'box',
        position: [0, 0, 0],
        size: [s, s, s],
        scale: (x: number, y: number, z: number) => {
          const t = 1 - y / s;
          const f = 1 - t * taper;
          const cx = (x + 0.5) / s - 0.5;
          const cz = (z + 0.5) / s - 0.5;
          const dist = Math.sqrt(cx * cx + cz * cz) * 2;
          const yf = Math.max(0.05, 1 - dist * taper);
          return [f, yf, f];
        },
        scaleOrigin: ((_x: number, y: number, _z: number) => [0.5, y % 2 === 0 ? 0 : 1, 0.5]) as unknown as number[],
      });

      const svg = h.toSVG({ padding: 20 });
      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = svg;
        setLoaded(true);
      }
    }

    render();

    const article = containerRef.current?.closest('article[data-theme]');
    if (article) {
      observer.observe(article, { attributes: true, attributeFilter: ['data-theme'] });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [getTheme]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto 2rem',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    />
  );
}
