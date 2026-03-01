'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '@styles/hero.module.scss';
import SocialDock from '../../components/SocialDock/SocialDock';

const NAME = 'GOKUL JS';


const Hero: React.FC = () => {
  const overlineRef = useRef<HTMLParagraphElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const ruleRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  // Runs synchronously before the first browser paint — elements are hidden
  // before any pixel is drawn, eliminating the flash of visible content.
  useLayoutEffect(() => {
    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    gsap.set(overlineRef.current, { opacity: 0, letterSpacing: '0.55em' });
    gsap.set(chars, { y: '115%' });
    gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(bottomRef.current, { opacity: 0, y: 12 });
  }, []);

  useEffect(() => {
    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];

    // ── Unicorn Studio: parallel fetch, deferred init ──────────────────────
    // Inject the script tag immediately so the browser downloads it in
    // parallel with the entrance animation. .init() is only called once BOTH
    // conditions are true: script loaded AND animation complete.
    // Whichever finishes last calls init().
    type UnicornWindow = Window & { UnicornStudio?: { isInitialized: boolean; init: () => void } };
    let scriptLoaded = false;
    let animDone = false;

    const tryInit = () => {
      (window as UnicornWindow).UnicornStudio?.init();
    };

    if (!(window as UnicornWindow).UnicornStudio) {
      (window as UnicornWindow).UnicornStudio = { isInitialized: false, init: () => {} };
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js';
      s.onload = () => {
        scriptLoaded = true;
        if (animDone) tryInit();
      };
      (document.head || document.body).appendChild(s);
    } else {
      scriptLoaded = true;
    }

    /* ── 1. Entrance timeline ── */
    // gsap.set() already placed everything at its start state, so we use
    // gsap.to() to animate toward the final CSS values.
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        animDone = true;
        if (scriptLoaded) tryInit();
      },
    });

    tl.to(overlineRef.current, {
      opacity: 1,
      letterSpacing: '0.22em',
      duration: 0.9,
      ease: 'power2.out',
    })
    .to(chars, {
      y: '0%',
      duration: 0.85,
      stagger: 0.05,
      ease: 'power4.out',
    }, '-=0.55')
    .to(ruleRef.current, {
      scaleX: 1,
      duration: 0.9,
      ease: 'expo.inOut',
    }, '-=0.5')
    .to(bottomRef.current, {
      opacity: 1,
      y: 0,
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
      {/* Unicorn Studio animated background — injected via initUnicornShader()
          after entrance animations complete to avoid blocking the main thread */}
      <div
        data-us-project="X7Ao7Cu1zSQPCMiFHjvt"
        className={styles.shader}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
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

        <div className={styles.quote}>
          <p>I care about everything</p>
          <p>
            Compression is knowledge. Prediction is understanding.
            If you can&apos;t predict it, you don&apos;t understand it.
            Complexity emerges from simple rules applied recursively.
          </p>
        </div>

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
