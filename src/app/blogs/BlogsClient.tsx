'use client';

import { useState, useMemo } from 'react';
import { BlogListItem } from '@/components/ui/blog-card';
import { Blog } from '@/data/blogs-data';
import { getSortedBlogs } from '@/data/blogs-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, X, ArrowUpDown } from 'lucide-react';

interface BlogsClientProps {
  initialBlogs: Blog[];
}

export default function BlogsClient({ initialBlogs }: BlogsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const allBlogs = useMemo(
    () => (sortOrder === 'desc' ? initialBlogs : getSortedBlogs('asc')),
    [sortOrder, initialBlogs]
  );

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return allBlogs;

    const query = searchQuery.toLowerCase();
    return allBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query) ||
        blog.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [allBlogs, searchQuery]);

  return (
    <>
      {/* Header */}
      <div className="px-6 md:!px-12 lg:px-16 pt-[120px] pb-4 max-w-4xl mx-auto w-full">
        <motion.p
          className="text-[10px] uppercase tracking-[0.3em] mb-2"
          style={{ color: 'var(--site-text-subtle)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ideas / experiments / reflections
        </motion.p>
        <motion.h1
          className="!text-4xl md:!text-5xl !font-light !tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-lora), Georgia, 'Times New Roman', serif",
            fontWeight: 600,
            color: 'var(--site-text-heading)',
          }}
        >
          archive
        </motion.h1>
      </div>

      {/* Search and Filter */}
      <motion.div
        className="px-6 md:!px-12 lg:px-16 py-8 max-w-4xl mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--site-text-muted)' }}>
            {searchQuery ? (
              <span>
                {filteredBlogs.length} of {allBlogs.length} posts
              </span>
            ) : (
              <span>
                {allBlogs.length} {allBlogs.length === 1 ? 'post' : 'posts'}
              </span>
            )}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: 'var(--site-text-muted)' }}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </button>
            <div
              className="flex items-center gap-2 transition-all"
              style={{ borderBottom: '1px solid var(--site-border)' }}
            >
              <Search className="w-4 h-4" style={{ color: 'var(--site-text-subtle)' }} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent py-1 text-sm focus:outline-none w-[130px] md:w-[200px]"
                style={{ color: 'var(--site-text)', placeholderColor: 'var(--site-text-subtle)' } as React.CSSProperties}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="transition-colors"
                  style={{ color: 'var(--site-text-subtle)' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blog List */}
      <div className="px-6 md:!px-12 lg:px-16 pb-16 max-w-4xl mx-auto w-full min-h-[40vh]">
        <AnimatePresence mode="wait">
          {filteredBlogs.length > 0 ? (
            <motion.div
              key="blog-list"
              className="flex flex-col"
              style={{ borderColor: 'var(--site-border-subtle)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredBlogs.map((blog, index) => (
                <BlogListItem key={blog.id} blog={blog} index={index} />
              ))}
            </motion.div>
          ) : searchQuery ? (
            <motion.div
              key="no-results"
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Search className="w-10 h-10 mb-4" style={{ color: 'var(--site-text-subtle)' }} />
              <h3 className="text-base mb-1" style={{ color: 'var(--site-text)' }}>
                No results for &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-sm" style={{ color: 'var(--site-text-muted)' }}>Try searching for something else</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--site-surface)' }}>
                <FileText className="w-8 h-8" style={{ color: 'var(--site-text-subtle)' }} />
              </div>
              <h3 className="text-lg mb-2" style={{ color: 'var(--site-text)' }}>No posts yet</h3>
              <p className="text-sm max-w-xs" style={{ color: 'var(--site-text-muted)' }}>
                I&apos;m working on some articles. Check back soon for new content.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
