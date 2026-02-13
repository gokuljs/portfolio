'use client';

import { BlogListItem } from '@/components/ui/blog-card';
import { getSortedBlogs } from '@/data/blogs-data';
import Image from 'next/image';

export default function BlogsPage() {
  const blogs = getSortedBlogs();

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[600px] !mt-[90px] flex justify-center md:justify-between bg-black overflow-hidden">
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left px-8 md:!px-16 lg:px-20">
          <p className="text-neutral-600 text-xs uppercase tracking-[0.3em] mb-4">
            ideas / experiments / reflections
          </p>
          <h1 
            className="!text-5xl md:!text-8xl lg:!text-9xl !font-light !tracking-tight"
            style={{ 
              background: 'linear-gradient(to right, #ffffff 0%, #666666 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.1)' 
            }}
          >
            archive
          </h1>
        </div>
        <div className="relative flex-1 h-full hidden md:block">
          <Image
            src="/blog-bg-organic.png"
            alt="Blog hero"
            fill
            className="object-contain object-right"
          />
        </div>
      </div>

      {/* Blog List */}
      <div className="px-8 py-16 flex justify-center">
        <div className="max-w-2xl w-full">
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
      </div>
    </>
  );
}
