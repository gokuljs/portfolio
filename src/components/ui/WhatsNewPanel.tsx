'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { announcements } from '@/data/announcements-data';

const FULL_TEXT = "What's New";

function Typewriter({ delay = 0 }: { delay?: number }) {
  const [text, setText] = useState('');

  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setText(FULL_TEXT.slice(0, i));
        if (i >= FULL_TEXT.length) clearInterval(interval);
      }, 55);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: '#d4d4d4', whiteSpace: 'nowrap' }}>
      {text}
      {text.length < FULL_TEXT.length && (
        <span style={{ display: 'inline-block', width: 1, height: '0.8em', background: '#d4d4d4', marginLeft: 1, verticalAlign: 'middle', animation: 'wn-cursor 0.6s steps(1) infinite' }} />
      )}
    </span>
  );
}

const STORAGE_KEY = 'whats_new_seen_id';
const LATEST_5 = announcements.slice(0, 5);

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Blog:          { bg: 'rgba(59,130,246,0.18)',  color: '#60a5fa' },
  'Open Source': { bg: 'rgba(34,197,94,0.18)',   color: '#4ade80' },
  Update:        { bg: 'rgba(168,85,247,0.18)',  color: '#c084fc' },
  Research:      { bg: 'rgba(251,191,36,0.18)',  color: '#fbbf24' },
};

const POSITIONS = [{ bottom: 28, right: 28, top: 'auto', left: 'auto' }];
const ORIGINS   = ['bottom right'];

export default function WhatsNewPanel() {
  const [visible, setVisible]   = useState(false);
  const [entered, setEntered]   = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [idx, setIdx]           = useState(0);
  const [posIdx]                = useState(0);
  const cardRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastSeen = localStorage.getItem(STORAGE_KEY);

    // Already seen — just show mini pill, never auto-open again
    if (lastSeen === LATEST_5[0].id) {
      setMinimized(true);
      setVisible(true);
      return;
    }

    // First time — open full card once user scrolls ~300px
    let triggered = false;
    function onScroll() {
      if (triggered) return;
      if (window.scrollY > 300) {
        triggered = true;
        window.removeEventListener('scroll', onScroll);
        setVisible(true);
        setTimeout(() => setEntered(true), 40);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function dismiss() {
    setEntered(false);
    setTimeout(() => {
      setMinimized(true);
      localStorage.setItem(STORAGE_KEY, LATEST_5[0].id);
    }, 320);
  }

  function reopen() {
    setMinimized(false);
    setIdx(0);
    setTimeout(() => setEntered(true), 40);
  }

  useEffect(() => {
    if (minimized || !entered) return;
    function handleOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        dismiss();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [minimized, entered]);

  if (!visible) return null;

  const pos    = POSITIONS[posIdx];
  const origin = ORIGINS[posIdx];
  const item   = LATEST_5[idx];
  const tagStyle = TAG_COLORS[item.tag ?? ''] ?? { bg: 'rgba(255,255,255,0.08)', color: '#a3a3a3' };
  const isExt  = item.url.startsWith('http');

  /* ── Mini pill (after dismiss) ── */
  if (minimized) {
    return (
      <div className="hidden md:block" style={{ position: 'fixed', ...pos, zIndex: 99999 }}>
        <button
          onClick={reopen}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 13px 7px 10px',
            borderRadius: 999,
            background: 'rgba(10,10,10,0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
            cursor: 'pointer',
            animation: 'wn-slidein 0.45s cubic-bezier(0.34,1.5,0.64,1) forwards',
          }}
          className="wn-pill"
        >
          {/* Bell with ring animation */}
          <span style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'wn-bell 3.5s ease-in-out 1.2s infinite',
            transformOrigin: 'top center',
          }}>
            <Bell size={11} color="#a3a3a3" />
          </span>

          <Typewriter delay={500} />

          {/* Pulsing red dot */}
          <span style={{ position: 'relative', width: 7, height: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
              background: '#ef4444', opacity: 0.5,
              animation: 'wn-ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
            }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
          </span>
        </button>

        <style>{`
          @keyframes wn-slidein {
            from { opacity: 0; transform: translateY(16px) scale(0.88); }
            to   { opacity: 1; transform: translateY(0)   scale(1); }
          }
          @keyframes wn-ping {
            0%   { transform: scale(1);   opacity: 0.5; }
            75%  { transform: scale(2.4); opacity: 0; }
            100% { transform: scale(2.4); opacity: 0; }
          }
          @keyframes wn-cursor {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }
          @keyframes wn-bell {
            0%,  100% { transform: rotate(0deg); }
            5%         { transform: rotate(14deg); }
            10%        { transform: rotate(-12deg); }
            15%        { transform: rotate(10deg); }
            20%        { transform: rotate(-8deg); }
            25%        { transform: rotate(0deg); }
          }
          .wn-pill:hover {
            background: rgba(22,22,22,0.92) !important;
            border-color: rgba(255,255,255,0.18) !important;
          }
          .wn-pill:hover span:first-child {
            background: rgba(255,255,255,0.13) !important;
          }
        `}</style>
      </div>
    );
  }

  /* ── Full card ── */
  return (
    <div ref={cardRef} className="hidden md:block" style={{ position: 'fixed', ...pos, zIndex: 99999 }}>
      <div
        style={{
          width: 320,
          borderRadius: 20,
          overflow: 'hidden',
          background: 'rgba(10,10,10,0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          transformOrigin: origin,
          transform: entered ? 'scale(1)' : 'scale(0.6)',
          opacity: entered ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.34,1.5,0.64,1), opacity 0.28s ease',
        }}
      >
        {/* Big image */}
        <div style={{ position: 'relative', width: '100%', height: 170, background: 'rgba(255,255,255,0.04)' }}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="320px"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(10,10,10,0.88) 100%)',
          }} />

          {/* Tag + close */}
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '3px 9px', borderRadius: 999,
              background: tagStyle.bg, color: tagStyle.color,
              backdropFilter: 'blur(8px)',
            }}>
              {item.tag ?? "What's New"}
            </span>
            <button
              onClick={dismiss}
              style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(8px)',
              }}
            >
              <X size={12} color="#a3a3a3" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px 16px' }}>
          <p style={{ fontSize: 9, color: '#525252', margin: '0 0 5px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            What&apos;s New
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#f5f5f5', margin: '0 0 7px', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            {item.title}
          </p>
          <p style={{ fontSize: 11.5, color: '#737373', margin: '0 0 14px', lineHeight: 1.6 }}>
            {item.description}
          </p>

          {/* CTA + Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {isExt ? (
              <a
                href={item.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontWeight: 600, color: '#e5e5e5', textDecoration: 'none',
                  padding: '6px 12px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                View <ArrowUpRight size={11} />
              </a>
            ) : (
              <Link
                href={item.url} onClick={dismiss}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontWeight: 600, color: '#e5e5e5', textDecoration: 'none',
                  padding: '6px 12px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Read more <ArrowUpRight size={11} />
              </Link>
            )}

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setIdx(i => Math.max(0, i - 1))}
                disabled={idx === 0}
                style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1,
                }}
              >
                <ChevronLeft size={12} color="#a3a3a3" />
              </button>

              <div style={{ display: 'flex', gap: 4 }}>
                {LATEST_5.map((_, i) => (
                  <div key={i} onClick={() => setIdx(i)} style={{
                    width: i === idx ? 16 : 5, height: 5, borderRadius: 999,
                    background: i === idx ? '#e5e5e5' : 'rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'width 0.25s ease, background 0.2s ease',
                  }} />
                ))}
              </div>

              <button
                onClick={() => setIdx(i => Math.min(LATEST_5.length - 1, i + 1))}
                disabled={idx === LATEST_5.length - 1}
                style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  cursor: idx === LATEST_5.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === LATEST_5.length - 1 ? 0.3 : 1,
                }}
              >
                <ChevronRight size={12} color="#a3a3a3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
