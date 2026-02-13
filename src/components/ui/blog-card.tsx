'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Blog } from '@/data/blogs-data';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/blogs/${blog.slug}`}>
        <article className="group py-4 border-b border-white/5 hover:border-white/10 transition-colors cursor-pointer">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
            {/* Title */}
            <h2 className="text-base text-neutral-200 group-hover:text-white transition-colors">
              {blog.title}
            </h2>
            
            {/* Date */}
            <time 
              dateTime={blog.date} 
              className="text-sm text-neutral-500 shrink-0"
            >
              {formatDate(blog.date)}
            </time>
          </div>
          
          {/* Description - optional, shown on hover or always if you prefer */}
          <p className="text-sm text-neutral-500 mt-1 line-clamp-1">
            {blog.description}
          </p>
        </article>
      </Link>
    </motion.div>
  );
}
