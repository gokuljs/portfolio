'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track the visit when component mounts
    const trackVisit = async () => {
      try {
        const visitData = {
          pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          eventType: 'page_visit',
        };

        await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    // Only track real users (not bots/crawlers)
    if (typeof window !== 'undefined' && !navigator.userAgent.includes('bot')) {
      trackVisit();
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
