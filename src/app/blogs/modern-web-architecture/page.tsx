import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Custom metadata for this specific blog
export const metadata: Metadata = {
  title: 'Modern Web Architecture in 2026 | Gokul JS',
  description: 'How I approach building scalable web applications with Next.js, serverless, and edge computing.',
  openGraph: {
    title: 'Modern Web Architecture in 2026',
    description: 'How I approach building scalable web applications with Next.js, serverless, and edge computing.',
    type: 'article',
    publishedTime: '2026-01-15',
    authors: ['Gokul JS'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Web Architecture in 2026',
    description: 'How I approach building scalable web applications with Next.js, serverless, and edge computing.',
  },
};

export default function ModernWebArchitectureBlog() {
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
        <time className="text-sm text-neutral-500">January 15, 2026</time>
        <h1 className="text-3xl font-medium text-white mt-2 mb-4">
          Modern Web Architecture in 2026
        </h1>
        <p className="text-neutral-400 leading-relaxed">
          How I approach building scalable web applications with Next.js, serverless, and edge computing.
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
