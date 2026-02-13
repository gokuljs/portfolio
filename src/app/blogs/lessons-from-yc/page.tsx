import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Custom metadata for this specific blog
export const metadata: Metadata = {
  title: 'Lessons from Y Combinator W21 | Gokul JS',
  description: 'Key takeaways and insights from my experience as a founding engineer at a YC-backed startup.',
  openGraph: {
    title: 'Lessons from Y Combinator W21',
    description: 'Key takeaways and insights from my experience as a founding engineer at a YC-backed startup.',
    type: 'article',
    publishedTime: '2026-01-25',
    authors: ['Gokul JS'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lessons from Y Combinator W21',
    description: 'Key takeaways and insights from my experience as a founding engineer at a YC-backed startup.',
  },
};

export default function LessonsFromYCBlog() {
  return (
    <>
      {/* Back Button */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        <span>Back to blogs</span>
      </Link>

      {/* Header */}
      <header className="mb-8">
        <time className="text-sm text-neutral-500">January 25, 2026</time>
        <h1 className="text-3xl font-medium text-white mt-2 mb-4">
          Lessons from Y Combinator W21
        </h1>
        <p className="text-neutral-400 leading-relaxed">
          Key takeaways and insights from my experience as a founding engineer at a YC-backed startup.
        </p>
      </header>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-8" />

      {/* Your custom blog content goes here */}
      <article className="text-neutral-300 leading-relaxed space-y-6">
        {/* Add your custom HTML/CSS here */}
        <p>
          Your blog content goes here. You have full control over the HTML and styling.
        </p>
      </article>
    </>
  );
}
