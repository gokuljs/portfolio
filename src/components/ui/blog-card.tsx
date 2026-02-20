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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Link href={`/blogs/${blog.slug}`}>
        <article className="group py-5 hover:bg-white/[0.02] -mx-4 px-4 rounded-lg transition-all cursor-pointer">
          {/* Date and read time */}
          <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-2">
            <time dateTime={blog.date}>
              {formatDate(blog.date)}
            </time>
            {blog.readTime && (
              <>
                <span>·</span>
                <span>{blog.readTime}</span>
              </>
            )}
          </div>
          
          {/* Title */}
          <h2 className="text-base md:text-lg font-normal text-white group-hover:text-neutral-300 transition-colors leading-snug">
            {blog.title}
          </h2>
          
          {/* Description */}
          <p className="text-sm text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
            {blog.description}
          </p>
          
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex gap-2 mt-2.5">
              {blog.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs text-neutral-600"
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
