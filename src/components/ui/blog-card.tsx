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
        <article className="group py-3 hover:bg-white/[0.02] -mx-3 px-3 rounded-md transition-all cursor-pointer">
          {/* Title row with date */}
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm md:text-base text-neutral-200 group-hover:text-white transition-colors leading-snug">
              {blog.title}
            </h2>
            <div className="flex items-center gap-2 shrink-0">
              <time 
                dateTime={blog.date} 
                className="text-xs text-neutral-600"
              >
                {formatDate(blog.date)}
              </time>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
          
          {/* Description - single line */}
          <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
            {blog.description}
          </p>
          
          {/* Tags inline with read time */}
          <div className="flex items-center gap-2 mt-2">
            {blog.readTime && (
              <span className="text-[10px] text-neutral-600">{blog.readTime}</span>
            )}
            {blog.tags && blog.tags.length > 0 && (
              <>
                {blog.readTime && <span className="text-neutral-700">·</span>}
                <div className="flex gap-1.5">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] text-neutral-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
