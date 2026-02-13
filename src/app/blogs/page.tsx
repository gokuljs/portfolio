'use client';

import Footer from '@/app/ui/home/Footer/Footer';
import { CyberpunkBackground } from '@/components/ui/cyberpunk-background';
import { Playfair_Display } from 'next/font/google';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlogListItem } from '@/components/ui/blog-card';
import { getSortedBlogs } from '@/data/blogs-data';

const playfair = Playfair_Display({ subsets: ['latin'], style: 'italic' });

export default function BlogsPage() {
  const blogs = getSortedBlogs();

  const scrollToContent = () => {
    const nextSection = document.getElementById('blogs-list');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden relative">
      <CyberpunkBackground />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <div className="text-center space-y-4 md:space-y-6 flex flex-col justify-center items-center px-4">
            <h1 className={`${playfair.className} text-[clamp(1.5rem,8vw,4.5rem)] font-medium mb-6 md:mb-8 leading-none tracking-tight text-white drop-shadow-sm px-4`}>
              Thoughts, ideas, and learnings.
            </h1>
            <p className="text-[clamp(0.875rem,2.5vw,1.1rem)] text-neutral-400 font-light opacity-90 max-w-[90vw] md:max-w-3xl leading-relaxed px-6">
              Writing about engineering, startups, and building products that matter.
            </p>
          </div>
        </div>

        {/* Scroll Indicator Button */}
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-12 flex flex-col items-center gap-2 group cursor-pointer"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 group-hover:text-white transition-colors duration-300">
            Scroll to explore
          </span>
          <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-white/50 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </div>
        </motion.button>
      </div>

      {/* Blogs List Section */}
      <section id="blogs-list" className="relative z-10 w-full min-h-screen py-32 px-8 md:px-16 lg:px-24 bg-black flex flex-col items-center">
        <div className="max-w-2xl w-full !mt-[70px]">
          <div className="flex flex-col">
            {blogs.map((blog, index) => (
              <BlogListItem key={blog.id} blog={blog} index={index} />
            ))}
          </div>

          {blogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-neutral-500">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
