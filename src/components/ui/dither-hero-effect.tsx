'use client';

import { useEffect, useRef, useState } from 'react';
import { GrainGradient } from '@paper-design/shaders-react';

export default function DitherHeroEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      return;
    }

    const measure = () => {
      const el = containerRef.current?.parentElement;
      if (!el) return;
      setDimensions({ w: el.clientWidth, h: el.clientHeight });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {dimensions.w > 0 && (
        <GrainGradient
          width={dimensions.w}
          height={dimensions.h}
          colors={['#000000', '#000000', '#000000', '#d5d1e6']}
          colorBack="#000000"
          softness={1}
          intensity={1}
          noise={1}
          shape="truchet"
          speed={0.96}
          scale={2.28}
          rotation={80}
          offsetX={1}
          offsetY={-0.28}
        />
      )}
    </div>
  );
}
