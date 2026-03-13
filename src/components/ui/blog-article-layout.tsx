'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReadingProgressBar } from './reading-progress';
import { TableOfContents } from './table-of-contents';
import { calculateReadingTime } from '@/utils/reading-time';

interface BlogArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  date: string;
  dateISO?: string;
  readingTime?: string;
  tags?: string[];
  featuredImage?: string;
}

export function BlogArticleLayout({
  children,
  title,
  description,
  date,
  dateISO,
  readingTime,
  tags,
  featuredImage,
}: BlogArticleLayoutProps) {
  const estimatedReadTime = readingTime || calculateReadingTime(children);

  const isoDate = dateISO ?? date;

  return (
    <>
      <ReadingProgressBar />
      <TableOfContents />
      
      <article className="min-h-screen bg-black pt-24 md:pt-32">
        <div className="w-full max-w-[700px] mx-auto px-6 md:px-8 lg:px-6">

          {/* Header */}
          <motion.header
            className="mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-3 py-1 rounded-full tracking-wide uppercase"
                    style={{
                      color: '#8a8a8a',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-semibold text-white leading-[1.25] tracking-tight mb-4">
              {title}
            </h1>
            
            {/* Description */}
            <p className="text-[15px] md:text-base text-neutral-400 leading-relaxed mb-6" style={{ lineHeight: '1.65' }}>
              {description}
            </p>

            {/* Meta info row */}
            <div className="flex items-center gap-3 text-[13px] text-neutral-500">
              <time dateTime={isoDate}>{date}</time>
              <span className="text-neutral-700">·</span>
              <span>{estimatedReadTime}</span>
            </div>
          </motion.header>

          {/* Featured Image */}
          {featuredImage && (
            <motion.div
              className="relative w-full aspect-[16/9] mb-10 md:mb-12 rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
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

          {/* Divider */}
          <motion.div
            className="w-full h-px mb-10 md:mb-12"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)' }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Article Body */}
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
            <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, transparent)' }} />

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

      <style jsx global>{`
        .blog-content {
          color: #b0b0b0;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.8;
          letter-spacing: -0.003em;
        }

        .blog-content > * {
          margin-top: 0;
          margin-bottom: 1.25em;
        }

        .blog-content > *:last-child {
          margin-bottom: 0;
        }

        /* ── Headings ── */
        .blog-content h2 {
          font-size: 19px;
          font-weight: 600;
          color: #f0f0f0;
          margin-top: 2.75em;
          margin-bottom: 0.75em;
          line-height: 1.35;
          letter-spacing: -0.02em;
        }

        .blog-content h3 {
          font-size: 16px;
          font-weight: 600;
          color: #dedede;
          margin-top: 2em;
          margin-bottom: 0.6em;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        /* Tighten gap between heading and its first child */
        .blog-content h2 + *,
        .blog-content h3 + * {
          margin-top: 0;
        }

        /* ── Paragraphs ── */
        .blog-content p {
          margin-bottom: 1.25em;
        }

        /* ── Links ── */
        .blog-content a {
          color: #8fb4e8;
          text-decoration: none;
          border-bottom: 1px solid rgba(143, 180, 232, 0.25);
          transition: color 0.15s, border-color 0.15s;
        }

        .blog-content a:hover {
          color: #aecdf5;
          border-bottom-color: rgba(174, 205, 245, 0.5);
        }

        /* ── Strong / Bold ── */
        .blog-content strong {
          color: #e0e0e0;
          font-weight: 600;
        }

        /* ── Lists ── */
        .blog-content ul {
          list-style: none !important;
          padding-left: 0;
          margin-top: 0.75em;
          margin-bottom: 1.25em;
        }

        .blog-content ol {
          list-style: none !important;
          counter-reset: ol-counter;
          padding-left: 0;
          margin-top: 0.75em;
          margin-bottom: 1.25em;
        }

        .blog-content ul li {
          position: relative;
          padding-left: 1.4em;
          margin-bottom: 0.55em;
          display: block !important;
          color: #b0b0b0;
        }

        .blog-content ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #444;
        }

        .blog-content ol li {
          position: relative;
          padding-left: 1.75em;
          margin-bottom: 0.55em;
          display: block !important;
          counter-increment: ol-counter;
          color: #b0b0b0;
        }

        .blog-content ol li::before {
          content: counter(ol-counter) ".";
          position: absolute;
          left: 0;
          top: 0;
          font-size: 13px;
          font-weight: 500;
          color: #555;
          font-variant-numeric: tabular-nums;
          min-width: 1.4em;
        }

        .blog-content ul li:last-child,
        .blog-content ol li:last-child {
          margin-bottom: 0;
        }

        /* Nested lists */
        .blog-content li > ul,
        .blog-content li > ol {
          margin-top: 0.4em;
          margin-bottom: 0;
        }

        /* ── Blockquotes ── */
        .blog-content blockquote {
          border-left: 3px solid rgba(255,255,255,0.15);
          padding: 0.15em 0 0.15em 1.25em;
          margin: 1.75em 0;
          font-style: italic;
          color: #808080;
        }

        .blog-content blockquote p {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
        }

        /* ── Callout blocks ── */
        .blog-content .callout {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-left: 3px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 0.9em 1.1em;
          margin: 1.75em 0;
          font-size: 14px;
          line-height: 1.7;
        }

        .blog-content .callout p {
          margin: 0;
          color: #999;
        }

        .blog-content .callout strong {
          color: #d8d8d8;
          font-weight: 600;
        }

        /* ── Highlighted text inline ── */
        .blog-content mark,
        .blog-content .hl {
          background: rgba(255, 255, 255, 0.08);
          padding: 0.1em 0.3em;
          border-radius: 3px;
          color: #e8e8e8;
        }

        /* ── Inline code ── */
        .blog-content code {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Monaco, monospace;
          font-size: 0.84em;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 0.15em 0.45em;
          border-radius: 4px;
          color: #d0d0d0;
        }

        /* ── Code blocks ── */
        .blog-content pre {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 1.1em 1.25em;
          overflow-x: auto;
          margin: 1.75em 0;
          font-size: 13.5px;
          line-height: 1.6;
        }

        .blog-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: #a8a8a8;
          font-size: inherit;
          border-radius: 0;
        }

        /* ── Images ── */
        .blog-content img {
          max-width: 100%;
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.75em 0;
        }

        /* ── Horizontal rule ── */
        .blog-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent);
          margin: 2.5em 0;
        }

        /* ── Videos and iframes ── */
        .blog-content video,
        .blog-content iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          margin: 1.75em 0;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .blog-content .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          margin: 1.75em 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .blog-content .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          border: none;
          border-radius: 0;
        }

        /* Spacing after lists before new paragraph */
        .blog-content ul + p,
        .blog-content ol + p {
          margin-top: 1.25em;
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .blog-content {
            font-size: 15px;
            line-height: 1.75;
          }

          .blog-content > * {
            margin-bottom: 1.1em;
          }

          .blog-content h2 {
            font-size: 17px;
            margin-top: 2.25em;
            margin-bottom: 0.6em;
          }

          .blog-content h3 {
            font-size: 15px;
            margin-top: 1.75em;
            margin-bottom: 0.5em;
          }

          .blog-content p {
            margin-bottom: 1.1em;
          }

          .blog-content ul,
          .blog-content ol {
            margin-top: 0.6em;
            margin-bottom: 1.1em;
          }

          .blog-content pre {
            font-size: 12.5px;
            padding: 0.875em 1em;
            margin: 1.25em -1.5em;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }

          .blog-content .callout {
            font-size: 13px;
            padding: 0.75em 0.9em;
          }
        }
      `}</style>
    </>
  );
}
