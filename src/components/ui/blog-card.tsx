'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Blog } from '@/data/blogs-data';
import { ArrowUpRight } from 'lucide-react';

interface BlogListItemProps {
  blog: Blog;
  index: number;
}

export function BlogListItem({ blog, index }: BlogListItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Link href={`/blogs/${blog.slug}`}>
        <article className="group py-5 hover:bg-white/[0.02] -mx-4 px-4 rounded-lg transition-all cursor-pointer">
          {/* Top row: Date and Read time */}
          <div className="flex items-center gap-3 mb-2">
            <time 
              dateTime={blog.date} 
              className="text-xs text-neutral-500"
            >
              {formatDate(blog.date)}
            </time>
            {blog.readTime && (
              <>
                <span className="text-neutral-700">·</span>
                <span className="text-xs text-neutral-500">{blog.readTime}</span>
              </>
            )}
          </div>
          
          {/* Title with arrow */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-base md:text-lg text-neutral-200 group-hover:text-white transition-colors leading-snug">
              {blog.title}
            </h2>
            <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          
          {/* Description */}
          <p className="text-sm text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
            {blog.description}
          </p>
          
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {blog.tags.map((tag) => (
                <span 
                  key={tag}
                  className="text-[10px] uppercase tracking-wider text-neutral-500 bg-white/5 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </Link>
    </motion.div>
  );
}
