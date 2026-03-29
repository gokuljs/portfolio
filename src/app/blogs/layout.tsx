import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Gokul JS',
  description:
    'Articles on real-time systems, voice AI, LLMs, and software engineering by Gokul JS — ex-YC founding engineer.',
  alternates: {
    canonical: 'https://gokuljs.com/blogs',
  },
  openGraph: {
    title: 'Blog | Gokul JS',
    description:
      'Articles on real-time systems, voice AI, LLMs, and software engineering by Gokul JS — ex-YC founding engineer.',
    url: 'https://gokuljs.com/blogs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Gokul JS',
    description:
      'Articles on real-time systems, voice AI, LLMs, and software engineering by Gokul JS — ex-YC founding engineer.',
    site: '@gokul_js029',
    creator: '@gokul_js029',
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: 'var(--site-bg)',
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: 'background 0.25s',
      }}
    >
      {children}
    </main>
  );
}
