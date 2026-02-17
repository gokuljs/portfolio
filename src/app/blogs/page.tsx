'use client';

import { BlogListItem } from '@/components/ui/blog-card';
import { getSortedBlogs } from '@/data/blogs-data';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, FileText } from 'lucide-react';

export default function BlogsPage() {
  const blogs = getSortedBlogs();

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-[320px] md:h-[420px] !mt-[90px] flex justify-center md:justify-between bg-black overflow-hidden">
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left px-6 md:!px-12 lg:px-16">
          <motion.p 
            className="text-neutral-600 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            ideas / experiments / reflections
          </motion.p>
          <motion.h1 
            className="!text-5xl md:!text-7xl lg:!text-8xl !font-light !tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{ 
              background: 'linear-gradient(to right, #ffffff 0%, #666666 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.1)' 
            }}
          >
            archive
          </motion.h1>
        </div>
        <motion.div 
          className="relative w-[240px] md:w-[320px] h-full hidden md:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        >
          <Image
            src="/blog-bg-organic.png"
            alt="Blog hero"
            fill
            className="object-contain object-right"
          />
        </motion.div>
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
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
          </p>
          {/* Search Bar - Underline style with icon inside */}
          <div className="flex items-center gap-3 border-b border-white/20 focus-within:border-white/50 transition-all">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent py-1 text-sm text-white placeholder-neutral-500 focus:outline-none w-[150px] md:w-[220px]"
            />
            <Search className="w-4 h-4 text-neutral-500 mb-1" />
          </div>
        </div>
      </motion.div>

      {/* Blog List */}
      <div className="px-6 md:!px-12 lg:px-16 pb-16 max-w-4xl mx-auto w-full min-h-[40vh]">
        {blogs.length > 0 ? (
          <motion.div 
            className="flex flex-col divide-y divide-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {blogs.map((blog, index) => (
              <BlogListItem key={blog.id} blog={blog} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
      </div>
    </>
  );
}
