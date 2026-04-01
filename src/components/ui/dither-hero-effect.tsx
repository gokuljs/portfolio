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
          colors={['#000000', '#1a191a', '#000000', '#8f8f94']}
          colorBack="#000000"
          softness={0.65}
          intensity={0}
          noise={1}
          shape="truchet"
          speed={0.74}
          scale={2.92}
          rotation={280}
          offsetX={-0.24}
          offsetY={-0.3}
        />
      )}
    </div>
  );
}
