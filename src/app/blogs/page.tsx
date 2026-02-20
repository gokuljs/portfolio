'use client';

import { useState, useMemo } from 'react';
import { BlogListItem } from '@/components/ui/blog-card';
import { getSortedBlogs } from '@/data/blogs-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, X, ArrowUpDown } from 'lucide-react';

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const allBlogs = useMemo(() => getSortedBlogs(sortOrder), [sortOrder]);

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return allBlogs;
    
    const query = searchQuery.toLowerCase();
    return allBlogs.filter((blog) => 
      blog.title.toLowerCase().includes(query) ||
      blog.description.toLowerCase().includes(query) ||
      blog.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [allBlogs, searchQuery]);

  return (
    <>
      {/* Header */}
      <div className="px-6 md:!px-12 lg:px-16 pt-[120px] pb-4 max-w-4xl mx-auto w-full">
        <motion.p
          className="text-neutral-600 text-[10px] uppercase tracking-[0.3em] mb-2"
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
            background: 'linear-gradient(to right, #ffffff 0%, #666666 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
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
          <p className="text-neutral-500 text-sm">
            {searchQuery ? (
              <span>{filteredBlogs.length} of {allBlogs.length} posts</span>
            ) : (
              <span>{allBlogs.length} {allBlogs.length === 1 ? 'post' : 'posts'}</span>
            )}
          </p>
          <div className="flex items-center gap-3">
          {/* Sort toggle */}
          <button
            onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>
          {/* Search Bar - Underline style with icon inside */}
          <div className="flex items-center gap-2 border-b border-white/20 focus-within:border-white/50 transition-all">
            <Search className="w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent py-1 text-sm text-white placeholder-neutral-500 focus:outline-none w-[130px] md:w-[200px]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-neutral-500 hover:text-white transition-colors"
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
              className="flex flex-col divide-y divide-white/5"
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
              <Search className="w-10 h-10 text-neutral-700 mb-4" />
              <h3 className="text-base text-neutral-300 mb-1">No results for &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-neutral-500 text-sm">
                Try searching for something else
              </p>
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
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-lg text-neutral-300 mb-2">No posts yet</h3>
              <p className="text-neutral-500 text-sm max-w-xs">
                I&apos;m working on some articles. Check back soon for new content.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
