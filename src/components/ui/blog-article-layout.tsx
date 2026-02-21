'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const canonicalUrl = `https://gokuljs.com${pathname}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: 'Gokul JS',
      url: 'https://gokuljs.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Gokul JS',
      url: 'https://gokuljs.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: tags?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group text-sm"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                <span>Back to all posts</span>
              </Link>

              <div className="flex items-center gap-4">
                <span className="text-neutral-600 text-xs">Gokul JS</span>
                <div className="w-px h-3 bg-white/10" />
                <a
                  href="https://github.com/gokuljs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/gokul-js/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/gokul_js029"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-white transition-colors"
                  aria-label="X / Twitter"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
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
