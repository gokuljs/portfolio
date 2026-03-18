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

      <article className="min-h-screen pt-24 md:pt-32" style={{ background: '#000000' }}>
        <div className="w-full max-w-[800px] mx-auto px-6 md:px-10 lg:px-8 2xl:ml-auto 2xl:mr-auto">

          {/* Header */}
          <motion.header
            className="mb-14 md:mb-18"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Top row: tags + meta */}
            <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
              {tags && tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold px-2.5 py-[5px] rounded-sm tracking-widest uppercase"
                      style={{
                        color: '#505050',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div />
              )}

              <div
                className="flex items-center gap-2 text-[11.5px] shrink-0"
                style={{ color: '#555', letterSpacing: '0.04em' }}
              >
                <time dateTime={isoDate}>{date}</time>
                <span style={{ color: '#363636' }}>·</span>
                <span>{estimatedReadTime}</span>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-[1.8rem] sm:text-[2.2rem] md:text-[2.6rem] font-bold leading-[1.12] text-white mb-7"
              style={{
                letterSpacing: '-0.02em',
                fontWeight: 700,
                fontFamily: "var(--font-baskerville), 'Georgia', serif",
              }}
            >
              {title}
            </h1>

            {/* Abstract / Description */}
            <div className="relative pl-4 mb-8">
              <div
                className="absolute left-0 top-0 bottom-0 w-px"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              />
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: '#707070', lineHeight: '1.72', fontStyle: 'italic' }}
              >
                {description}
              </p>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#666',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                G
              </div>
              <span className="text-[12.5px]" style={{ color: '#585858' }}>
                Gokul JS
              </span>
            </div>
          </motion.header>

          {/* Featured Image */}
          {featuredImage && (
            <motion.div
              className="relative w-full aspect-[16/9] mb-14 rounded-lg overflow-hidden"
              style={{ border: 'none' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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

          {/* Thin rule before body */}
          <motion.div
            className="w-full h-px mb-12"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
          />

          {/* Article Body */}
          <motion.div
            className="blog-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {children}
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="mt-24 md:mt-28 pb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* End mark */}
            <div className="flex items-center gap-5 mb-12">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <span
                className="text-[9px] tracking-[0.25em] uppercase"
                style={{ color: '#252525' }}
              >
                ◆
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 hover:text-white transition-colors group text-sm"
                style={{ color: '#404040' }}
              >
                <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                <span className="text-[12.5px] tracking-wide">All posts</span>
              </Link>

              <div className="flex items-center gap-4">
                <span className="text-[11.5px]" style={{ color: '#2c2c2c' }}>
                  Gokul JS
                </span>
                <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <a
                  href="https://github.com/gokuljs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: '#3a3a3a' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a3a')}
                  aria-label="GitHub"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/gokul-js/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: '#3a3a3a' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a3a')}
                  aria-label="LinkedIn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/gokul_js029"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: '#3a3a3a' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3a3a3a')}
                  aria-label="X / Twitter"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.footer>
        </div>
      </article>

      <style jsx global>{`
        /* ── Base ── */
        .blog-content {
          color: #bdbdbd;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.85;
          letter-spacing: 0.004em;
          counter-reset: section-counter;
          font-family: var(--font-baskerville), 'Georgia', serif;
        }

        .blog-content > * {
          margin-top: 0;
          margin-bottom: 1.35em;
        }

        .blog-content > *:last-child {
          margin-bottom: 0;
        }

        /* ── Drop Cap ── */
        .blog-content > p:first-of-type::first-letter {
          float: left;
          font-size: 4.4em;
          line-height: 0.8;
          padding-right: 0.06em;
          padding-bottom: 0.05em;
          font-weight: 700;
          color: #ffffff;
          font-family: var(--font-baskerville), 'Georgia', serif;
        }

        /* ── Headings ── */
        .blog-content h2 {
          counter-increment: section-counter;
          font-size: 16.5px;
          font-weight: 700;
          color: #f0f0f0;
          margin-top: 3.5em;
          margin-bottom: 0.85em;
          line-height: 1.3;
          letter-spacing: -0.008em;
          font-family: var(--font-baskerville), 'Georgia', serif;
        }

        .blog-content h2::before {
          content: counter(section-counter, decimal-leading-zero);
          display: block;
          font-size: 9px;
          font-weight: 600;
          color: #383838;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace;
          margin-bottom: 0.5em;
        }

        .blog-content h3 {
          font-size: 15px;
          font-weight: 700;
          color: #e2e2e2;
          margin-top: 2.25em;
          margin-bottom: 0.65em;
          line-height: 1.38;
          letter-spacing: -0.006em;
          font-family: var(--font-baskerville), 'Georgia', serif;
        }

        /* Tighten gap between heading and its first child */
        .blog-content h2 + *,
        .blog-content h3 + * {
          margin-top: 0;
        }

        /* ── Paragraphs ── */
        .blog-content p {
          margin-bottom: 1.35em;
        }

        /* ── Links ── */
        .blog-content a {
          color: #7fa8e0;
          text-decoration: none;
          border-bottom: 1px solid rgba(127, 168, 224, 0.2);
          transition: color 0.15s, border-color 0.15s;
        }

        .blog-content a:hover {
          color: #aecdf5;
          border-bottom-color: rgba(174, 205, 245, 0.45);
        }

        /* ── Strong ── */
        .blog-content strong {
          color: #ebebeb;
          font-weight: 700;
        }

        /* ── Lists ── */
        .blog-content ul {
          list-style: none !important;
          padding-left: 0;
          margin-top: 0.75em;
          margin-bottom: 1.35em;
        }

        .blog-content ol {
          list-style: none !important;
          counter-reset: ol-counter;
          padding-left: 0;
          margin-top: 0.75em;
          margin-bottom: 1.35em;
        }

        .blog-content ul li {
          position: relative;
          padding-left: 1.5em;
          margin-bottom: 0.55em;
          display: block !important;
          color: #bdbdbd;
        }

        .blog-content ul li::before {
          content: '';
          position: absolute;
          left: 0.2em;
          top: 0.67em;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #333;
        }

        .blog-content ol li {
          position: relative;
          padding-left: 1.9em;
          margin-bottom: 0.55em;
          display: block !important;
          counter-increment: ol-counter;
          color: #bdbdbd;
        }

        .blog-content ol li::before {
          content: counter(ol-counter) '.';
          position: absolute;
          left: 0;
          top: 0;
          font-size: 12px;
          font-weight: 500;
          color: #3a3a3a;
          font-variant-numeric: tabular-nums;
          font-family: 'SF Mono', 'Fira Code', monospace;
          min-width: 1.5em;
        }

        .blog-content ul li:last-child,
        .blog-content ol li:last-child {
          margin-bottom: 0;
        }

        .blog-content li > ul,
        .blog-content li > ol {
          margin-top: 0.4em;
          margin-bottom: 0;
        }

        /* ── Blockquotes ── */
        .blog-content blockquote {
          border-left: 2px solid rgba(255, 255, 255, 0.14);
          padding: 0.2em 0 0.2em 1.4em;
          margin: 2em 0;
          font-style: italic;
          color: #787878;
        }

        .blog-content blockquote p {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.75;
        }

        /* ── Pull Quote ── */
        .blog-content .pull-quote {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.5em 0;
          margin: 2.5em 0;
          font-style: normal;
          text-align: center;
        }

        .blog-content .pull-quote p {
          font-size: 19px;
          line-height: 1.55;
          color: #c0c0c0;
          font-weight: 400;
          letter-spacing: -0.008em;
          margin: 0;
          font-family: var(--font-baskerville), 'Georgia', serif;
          font-style: italic;
        }

        /* ── Callout blocks ── */
        .blog-content .callout {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          padding: 0.95em 1.15em;
          margin: 2em 0;
          font-size: 14px;
          line-height: 1.72;
        }

        .blog-content .callout p {
          margin: 0;
          color: #9a9a9a;
        }

        .blog-content .callout strong {
          color: #d8d8d8;
          font-weight: 700;
        }

        /* ── Highlighted text ── */
        .blog-content mark,
        .blog-content .hl {
          background: rgba(255, 255, 255, 0.07);
          padding: 0.1em 0.32em;
          border-radius: 3px;
          color: #e2e2e2;
        }

        /* ── Inline code ── */
        .blog-content code {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Monaco, monospace;
          font-size: 0.83em;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.07);
          padding: 0.15em 0.45em;
          border-radius: 3px;
          color: #c8c8c8;
        }

        /* ── Code blocks ── */
        .blog-content pre {
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 6px;
          padding: 1.15em 1.3em;
          overflow-x: auto;
          margin: 2em 0;
          font-size: 13px;
          line-height: 1.65;
        }

        .blog-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: #888;
          font-size: inherit;
          border-radius: 0;
        }

        /* ── Figure / Caption ── */
        .blog-content figure {
          margin: 2.25em 0;
        }

        .blog-content figcaption {
          font-size: 12px;
          color: #3a3a3a;
          text-align: center;
          margin-top: 0.65em;
          letter-spacing: 0.02em;
          font-style: italic;
        }

        /* ── Images ── */
        .blog-content img {
          max-width: 100%;
          width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 2em 0;
          border: none;
        }

        /* ── Horizontal rule ── */
        .blog-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.08) 25%,
            rgba(255, 255, 255, 0.08) 75%,
            transparent
          );
          margin: 2.75em 0;
        }

        /* ── Videos / iframes ── */
        .blog-content video,
        .blog-content iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 6px;
          margin: 2em 0;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .blog-content .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          margin: 2em 0;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.07);
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

        /* Spacing after lists */
        .blog-content ul + p,
        .blog-content ol + p {
          margin-top: 1.25em;
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .blog-content {
            font-size: 14.5px;
            line-height: 1.82;
          }

          .blog-content > * {
            margin-bottom: 1.2em;
          }

          .blog-content > p:first-of-type::first-letter {
            font-size: 3.5em;
            line-height: 0.82;
          }

          .blog-content h2 {
            font-size: 15.5px;
            margin-top: 2.75em;
            margin-bottom: 0.7em;
          }

          .blog-content h2::before {
            font-size: 8.5px;
            margin-bottom: 0.45em;
          }

          .blog-content h3 {
            font-size: 14px;
            margin-top: 2em;
            margin-bottom: 0.55em;
          }

          .blog-content p {
            margin-bottom: 1.2em;
          }

          .blog-content blockquote p {
            font-size: 13.5px;
          }

          .blog-content ul,
          .blog-content ol {
            margin-top: 0.6em;
            margin-bottom: 1.2em;
          }

          .blog-content pre {
            font-size: 12px;
            padding: 0.85em 1em;
            margin: 1.5em -1.5em;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }

          .blog-content code {
            font-size: 0.78em;
          }

          .blog-content .callout {
            font-size: 13px;
            padding: 0.85em 1em;
          }

          .blog-content .pull-quote p {
            font-size: 15.5px;
          }

          .blog-content figcaption {
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
}
