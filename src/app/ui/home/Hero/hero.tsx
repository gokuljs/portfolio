'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Script from 'next/script';
import styles from '@styles/hero.module.scss';
import SocialDock from '../../components/SocialDock/SocialDock';

const NAME = 'GOKUL JS';

const Hero: React.FC = () => {
  const overlineRef = useRef<HTMLParagraphElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const ruleRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];

    /* ── 1. Entrance timeline ── */
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(overlineRef.current, {
      opacity: 0,
      letterSpacing: '0.55em',   // collapses into the normal value
      duration: 0.9,
      ease: 'power2.out',
    })
    .from(chars, {
      y: '115%',
      duration: 0.85,
      stagger: 0.05,
      ease: 'power4.out',
    }, '-=0.55')
    .from(ruleRef.current, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.9,
      ease: 'expo.inOut',
    }, '-=0.5')
    .from(bottomRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.6,
    }, '-=0.5');

    /* ── 2. Per-char elastic hover on the name ── */
    chars.forEach((char) => {
      const onEnter = () =>
        gsap.to(char, { y: -10, duration: 0.22, ease: 'power2.out',
          overwrite: 'auto' });
      const onLeave = () =>
        gsap.to(char, { y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto' });

      char.addEventListener('mouseenter', onEnter);
      char.addEventListener('mouseleave', onLeave);
      // cleanup stored on element
      (char as HTMLSpanElement & { _cleanup?: () => void })._cleanup = () => {
        char.removeEventListener('mouseenter', onEnter);
        char.removeEventListener('mouseleave', onLeave);
      };
    });

    /* ── 3. Magnetic CTA button ── */
    const btn = ctaBtnRef.current;
    if (btn) {
      const STRENGTH = 0.35;

      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        gsap.to(btn, {
          x: dx * STRENGTH,
          y: dy * STRENGTH,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      const onLeave = () =>
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: 'elastic.out(1, 0.4)',
        });

      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);

      return () => {
        tl.kill();
        chars.forEach((c) => {
          (c as HTMLSpanElement & { _cleanup?: () => void })._cleanup?.();
        });
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      };
    }

    return () => {
      tl.kill();
      chars.forEach((c) => {
        (c as HTMLSpanElement & { _cleanup?: () => void })._cleanup?.();
      });
    };
  }, []);

  return (
    <div className={styles.hero}>
      {/* Unicorn Studio animated background */}
      <div
        data-us-project="XobrGsLoM2ce1hM4cWjP"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Script
        id="unicorn-studio"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(){var u=window.UnicornStudio;if(u&&u.init){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",function(){u.init()})}else{u.init()}}else{window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js",i.onload=function(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",function(){UnicornStudio.init()})}else{UnicornStudio.init()}},(document.head||document.body).appendChild(i)}}();`,
        }}
      />

      <div className={styles.heroBody}>

        <p ref={overlineRef} className={styles.overline}>
          EX&#8202;-&#8202;YC &nbsp;·&nbsp; GENERALIST &nbsp;·&nbsp; DEVELOPER
        </p>

        <h1 className={styles.name}>
          {NAME.split('').map((char, i) => (
            <span key={i} className={styles.charWrap}>
              <span
                className={styles.char}
                ref={(el) => { charsRef.current[i] = el; }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </h1>

        <div ref={ruleRef} className={styles.rule} />

        <div ref={bottomRef} className={styles.bottomRow}>
          <p className={styles.roles}>
            FULL&#8209;STACK &nbsp;·&nbsp; AI SYSTEMS &nbsp;·&nbsp; VOICE
          </p>
          <a
            ref={ctaBtnRef}
            href="mailto:jsgokul123@gmail.com"
            className={styles.ctaBtn}
          >
            GET IN TOUCH &nbsp;↗
          </a>
        </div>

      </div>

      <SocialDock />
    </div>
  );
};

export default Hero;
