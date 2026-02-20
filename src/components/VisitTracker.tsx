'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const isBlog = pathname.startsWith('/blogs/') && pathname !== '/blogs/';
        const blogTitle = isBlog ? document.title.replace(' | Gokul JS', '').trim() : undefined;

        await fetch('/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pathname,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            eventType: isBlog ? 'blog_read' : 'page_visit',
            ...(blogTitle && { blogTitle }),
          }),
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    if (typeof window !== 'undefined' && !navigator.userAgent.includes('bot')) {
      trackVisit();
    }
  }, [pathname]);

  return null;
}
