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

      const e = new Heerich({
        camera: { type: 'orthographic', angle: 128, pitch: 12},
        style: {
          fill: isLight ? '#fafaf8' : '#fbf4ea',
          stroke: isLight ? '#555555' : '#e0e0de',
          strokeWidth: 0.3,
        },
      });

      e.applyGeometry({
        type: 'line',
        from: [0, 0, 0],
        to: [8, 8, 8],
        radius: 1.5,
        shape: 'rounded',
      });

      const svg = e.toSVG({ padding: 20 });
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
