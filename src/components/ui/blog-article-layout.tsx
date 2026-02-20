'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { ReadingProgressBar } from './reading-progress';
import { TableOfContents } from './table-of-contents';
import { calculateReadingTime } from '@/utils/reading-time';

interface BlogArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  date: string;
  readingTime?: string;
  tags?: string[];
  featuredImage?: string;
}

export function BlogArticleLayout({
  children,
  title,
  description,
  date,
  readingTime,
  tags,
  featuredImage,
}: BlogArticleLayoutProps) {
  const estimatedReadTime = readingTime || calculateReadingTime(children);

  useEffect(() => {
    if (typeof window === 'undefined' || navigator.userAgent.toLowerCase().includes('bot')) return;
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'blog_read',
        blogTitle: title,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  }, [title]);

  return (
    <>
      <ReadingProgressBar />
      <TableOfContents />
      
      <article className="min-h-screen bg-black pt-24 md:pt-32">
        {/* Centered container with proper horizontal spacing */}
        <div className="w-full max-w-[720px] mx-auto px-8 md:px-12 lg:px-6">
          {/* Header */}
          <motion.header
            className="mb-12 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-4 py-1.5 rounded-full text-neutral-400 border border-white/[0.06]"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-white leading-tight tracking-tight mb-3">
              {title}
            </h1>
            
            {/* Description */}
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed mb-5">
              {description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <time>{date}</time>
              <span className="text-neutral-600">·</span>
              <span>{estimatedReadTime}</span>
            </div>
          </motion.header>

          {/* Featured Image */}
          {featuredImage && (
            <motion.div
              className="relative w-full aspect-[16/9] mb-12 md:mb-16 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}

          {/* Divider - Full width subtle line */}
          <motion.div
            className="w-full h-px bg-gradient-to-r from-white/10 via-white/20 to-white/10 mb-14 md:mb-16"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Article Body - Optimized for reading */}
          <motion.div
            className="blog-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {children}
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="mt-20 md:mt-24 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Faded divider line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group text-sm"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to all posts</span>
            </Link>
          </motion.footer>
        </div>
      </article>

      {/* Blog content styles */}
      <style jsx global>{`
        .blog-content {
          color: #a3a3a3;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.7;
          letter-spacing: 0;
        }

        /* Base spacing between elements */
        .blog-content > * {
          margin-top: 0;
          margin-bottom: 1em;
        }

        .blog-content > *:last-child {
          margin-bottom: 0;
        }

        /* Headings */
        .blog-content h2 {
          font-size: 16px;
          font-weight: 500;
          color: #e5e5e5;
          margin-top: 2em;
          margin-bottom: 0.75em;
          line-height: 1.4;
        }

        .blog-content h3 {
          font-size: 15px;
          font-weight: 500;
          color: #d4d4d4;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          line-height: 1.4;
        }

        /* First element after heading - reduce top margin */
        .blog-content h2 + *,
        .blog-content h3 + * {
          margin-top: 0;
        }

        /* Paragraphs */
        .blog-content p {
          margin-bottom: 1em;
        }

        /* Links */
        .blog-content a {
          color: #60a5fa;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .blog-content a:hover {
          border-bottom-color: #60a5fa;
        }

        /* Strong/Bold */
        .blog-content strong {
          color: #d4d4d4;
          font-weight: 500;
        }

        /* Lists */
        .blog-content ul {
          list-style: disc outside !important;
          padding-left: 1.25em;
          margin-top: 0.5em;
          margin-bottom: 1em;
        }

        .blog-content ol {
          list-style: decimal outside !important;
          padding-left: 1.25em;
          margin-top: 0.5em;
          margin-bottom: 1em;
        }

        .blog-content ul li,
        .blog-content ol li {
          margin-bottom: 0.35em;
          padding-left: 0.25em;
          display: list-item !important;
        }

        .blog-content ul li:last-child,
        .blog-content ol li:last-child {
          margin-bottom: 0;
        }

        .blog-content li::marker {
          color: #525252;
        }

        /* Nested lists */
        .blog-content li > ul,
        .blog-content li > ol {
          margin-top: 0.35em;
          margin-bottom: 0;
        }

        /* Blockquotes */
        .blog-content blockquote {
          border-left: 2px solid #333;
          padding-left: 1em;
          margin: 1.25em 0;
          font-style: italic;
          color: #737373;
        }

        .blog-content blockquote p {
          margin: 0;
        }

        /* Spacing after lists before new paragraph */
        .blog-content ul + p,
        .blog-content ol + p {
          margin-top: 1em;
        }

        /* Callout - minimal style */
        .blog-content .callout {
          background: rgba(255, 255, 255, 0.03);
          border-left: 2px solid #525252;
          padding: 0.6em 0.9em;
          margin: 0.75em 0;
          font-size: 13px;
        }

        .blog-content .callout p {
          margin: 0;
          color: #a3a3a3;
        }

        .blog-content .callout strong {
          color: #e5e5e5;
          font-weight: 500;
        }

        /* Highlight text inline */
        .blog-content mark,
        .blog-content .hl {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.1em 0.25em;
          border-radius: 2px;
          color: #e5e5e5;
        }

        /* Inline code */
        .blog-content code {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Monaco, monospace;
          font-size: 0.85em;
          background: rgba(255, 255, 255, 0.06);
          padding: 0.15em 0.4em;
          border-radius: 3px;
          color: #d4d4d4;
        }

        /* Code blocks */
        .blog-content pre {
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 0.875em 1em;
          overflow-x: auto;
          margin: 1.25em 0;
          font-size: 13px;
          line-height: 1.5;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
          color: #a3a3a3;
          font-size: inherit;
        }

        /* Images */
        .blog-content img {
          max-width: 100%;
          width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 1.5em 0;
        }

        /* Horizontal rule */
        .blog-content hr {
          border: none;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 1.75em 0;
        }

        /* Videos and iframes */
        .blog-content video,
        .blog-content iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 6px;
          margin: 1.25em 0;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .blog-content .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          margin: 1.25em 0;
          border-radius: 6px;
          overflow: hidden;
        }

        .blog-content .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          margin: 0;
        }

        /* Mobile adjustments */
        @media (max-width: 640px) {
          .blog-content {
            font-size: 13px;
            line-height: 1.65;
          }

          .blog-content > * {
            margin-bottom: 0.875em;
          }

          .blog-content h2 {
            font-size: 15px;
            margin-top: 1.75em;
            margin-bottom: 0.6em;
          }

          .blog-content h3 {
            font-size: 14px;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }

          .blog-content p {
            margin-bottom: 0.875em;
          }

          .blog-content ul,
          .blog-content ol {
            padding-left: 1.1em;
            margin-top: 0.4em;
            margin-bottom: 0.875em;
          }

          .blog-content pre {
            font-size: 12px;
            padding: 0.75em;
            margin: 1em -1em;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>
    </>
  );
}
