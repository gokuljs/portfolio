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
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-black overflow-x-hidden font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      {children}
    </main>
  );
}
