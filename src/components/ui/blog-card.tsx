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
        <article
          className="group py-5 -mx-4 px-4 rounded-lg transition-all cursor-pointer"
          style={{ borderBottom: '1px solid var(--site-border-subtle)' }}
        >
          <div className="flex items-center gap-1.5 text-sm mb-2" style={{ color: 'var(--site-text-muted)' }}>
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
          
          <h2
            className="text-base md:text-lg font-normal transition-colors leading-snug"
            style={{ color: 'var(--site-text-heading)' }}
          >
            {blog.title}
          </h2>
          
          <p className="text-sm mt-1.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--site-text-muted)' }}>
            {blog.description}
          </p>
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex gap-2 mt-2.5">
              {blog.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs"
                  style={{ color: 'var(--site-text-subtle)' }}
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
