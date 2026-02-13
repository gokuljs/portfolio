'use client';

import { useParams, notFound } from 'next/navigation';
import { getBlogBySlug, blogsData } from '@/data/blogs-data';
import Footer from '@/app/ui/home/Footer/Footer';
import { CyberpunkBackground } from '@/components/ui/cyberpunk-background';
import { Playfair_Display } from 'next/font/google';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], style: 'italic' });

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden relative">
      <CyberpunkBackground />

      {/* Blog Content */}
      <div className="relative z-10 min-h-screen pt-32 pb-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to blogs</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            {/* Date and Read Time */}
            <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
              <time dateTime={blog.date}>{formatDate(blog.date)}</time>
              {blog.readTime && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-600" />
                  <span>{blog.readTime}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className={`${playfair.className} text-[clamp(2rem,6vw,3.5rem)] font-medium leading-tight text-white mb-6`}>
              {blog.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-neutral-400 leading-relaxed">
              {blog.description}
            </p>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-md bg-white/5 text-neutral-400 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.header>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full h-px bg-white/10 mb-12"
          />

          {/* Content Placeholder */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="text-neutral-400 leading-relaxed space-y-6">
              <p>
                Blog content will be added here. This is where you can write your full blog post content.
              </p>
              <p>
                You can later integrate this with MDX, a CMS, or simply add the content directly to the data file.
              </p>
            </div>
          </motion.article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
