'use client';

import { useState, useCallback, useEffect } from 'react';

interface ThemeImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  expandable?: boolean;
}

export function ThemeImage({ lightSrc, darkSrc, alt, className, style, expandable }: ThemeImageProps) {
  const [expanded, setExpanded] = useState(false);

  const close = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    if (!expanded) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [expanded, close]);

  if (!expandable) {
    return (
      <>
        <img
          src={lightSrc}
          alt={alt}
          className={`theme-img-light${className ? ` ${className}` : ''}`}
          style={style}
        />
        <img
          src={darkSrc}
          alt={alt}
          className={`theme-img-dark${className ? ` ${className}` : ''}`}
          style={style}
        />
      </>
    );
  }

  return (
    <>
      <img
        src={lightSrc}
        alt={alt}
        className={`theme-img-light${className ? ` ${className}` : ''}`}
        style={{ ...style, cursor: 'zoom-in' }}
        onClick={() => setExpanded(true)}
      />
      <img
        src={darkSrc}
        alt={alt}
        className={`theme-img-dark${className ? ` ${className}` : ''}`}
        style={{ ...style, cursor: 'zoom-in' }}
        onClick={() => setExpanded(true)}
      />

      {expanded && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '2rem',
          }}
        >
          <button
            onClick={close}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '36px',
              height: '36px',
              border: 'none',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
          <img
            src={lightSrc}
            alt={alt}
            className="theme-img-light"
            style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain' }}
          />
          <img
            src={darkSrc}
            alt={alt}
            className="theme-img-dark"
            style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain' }}
          />
        </div>
      )}
    </>
  );
}
