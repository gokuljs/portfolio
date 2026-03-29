import { Metadata } from 'next';
import { Timeline } from '@/components/ui/timeline';
import { timelineData } from '@/data/timeline-data';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Professional timeline of Gokul JS — founding engineer at YC-backed startups, building real-time AI systems, voice agents, and scalable web products.',
  alternates: {
    canonical: 'https://gokuljs.com/experience',
  },
  openGraph: {
    title: 'Experience | Gokul JS',
    description:
      'Professional timeline of Gokul JS — founding engineer at YC-backed startups, building real-time AI systems, voice agents, and scalable web products.',
    url: 'https://gokuljs.com/experience',
    type: 'website',
    images: [
      {
        url: '/gokuljs.png',
        width: 1200,
        height: 630,
        alt: 'Experience | Gokul JS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experience | Gokul JS',
    description:
      'Professional timeline of Gokul JS — founding engineer at YC-backed startups, building real-time AI systems, voice agents, and scalable web products.',
    site: '@gokul_js029',
    creator: '@gokul_js029',
  },
};

export default function ExperiencePage() {
  return (
    <section
      className="min-h-screen py-12 md:py-24"
      style={{ background: 'var(--site-bg)', transition: 'background 0.25s' }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12 md:mb-20">
          <p style={{
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--site-text-subtle)',
            marginBottom: '0.75rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            career
          </p>
          <h1 style={{
            fontFamily: 'var(--font-lora), Georgia, "Times New Roman", serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            color: 'var(--site-text-heading)',
            margin: '0 0 1rem',
            transition: 'color 0.25s',
          }}>
            Professional Experience
          </h1>
          <p style={{
            fontSize: '0.875rem',
            lineHeight: 1.7,
            color: 'var(--site-text-muted)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            margin: 0,
          }}>
            A timeline of my professional journey and key achievements in
            software development and engineering.
          </p>
        </div>

        <Timeline data={timelineData} />
      </div>
    </section>
  );
}
