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
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-neutral-400 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-semibold text-white leading-[1.2] tracking-tight mb-6">
              {title}
            </h1>
            
            {/* Description */}
            <p className="text-[17px] md:text-[19px] text-neutral-400 leading-[1.7] mb-8">
              {description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-sm text-neutral-500">
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
          color: #e5e5e5;
          font-size: 18px;
          line-height: 1.8;
          letter-spacing: -0.003em;
        }

        .blog-content > * + * {
          margin-top: 1.5em;
        }

        .blog-content h2 {
          font-size: 28px;
          font-weight: 600;
          color: #ffffff;
          margin-top: 2.5em;
          margin-bottom: 0.8em;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }

        .blog-content h3 {
          font-size: 22px;
          font-weight: 600;
          color: #ffffff;
          margin-top: 2em;
          margin-bottom: 0.6em;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .blog-content p {
          margin-bottom: 1.5em;
        }

        .blog-content p:last-child {
          margin-bottom: 0;
        }

        .blog-content a {
          color: #60a5fa;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .blog-content a:hover {
          border-bottom-color: #60a5fa;
        }

        .blog-content strong {
          color: #ffffff;
          font-weight: 600;
        }

        .blog-content ul,
        .blog-content ol {
          padding-left: 1.5em;
          margin: 1.5em 0;
        }

        .blog-content li {
          margin-bottom: 0.75em;
          padding-left: 0.5em;
        }

        .blog-content li::marker {
          color: #525252;
        }

        .blog-content blockquote {
          border-left: 3px solid #404040;
          padding-left: 1.5em;
          margin: 2em 0;
          font-style: italic;
          color: #a3a3a3;
        }

        .blog-content blockquote p {
          margin: 0;
        }

        .blog-content code {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Monaco, monospace;
          font-size: 0.9em;
          background: rgba(255, 255, 255, 0.06);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          color: #f472b6;
        }

        .blog-content pre {
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.25em 1.5em;
          overflow-x: auto;
          margin: 2em 0;
          font-size: 14px;
          line-height: 1.7;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
          color: #e5e5e5;
          font-size: inherit;
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 2em 0;
        }

        .blog-content hr {
          border: none;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 3em 0;
        }

        .blog-content video,
        .blog-content iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          margin: 2em 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .blog-content .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          margin: 2em 0;
          border-radius: 8px;
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

        @media (max-width: 640px) {
          .blog-content {
            font-size: 16px;
            line-height: 1.75;
          }

          .blog-content h2 {
            font-size: 24px;
            margin-top: 2em;
          }

          .blog-content h3 {
            font-size: 20px;
          }

          .blog-content pre {
            font-size: 13px;
            padding: 1em;
            margin: 1.5em -1.5em;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>
    </>
  );
}
