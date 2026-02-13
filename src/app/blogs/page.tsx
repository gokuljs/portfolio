'use client';

import { BlogListItem } from '@/components/ui/blog-card';
import { getSortedBlogs } from '@/data/blogs-data';
import Image from 'next/image';

export default function BlogsPage() {
  const blogs = getSortedBlogs();

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-[600px] !mt-[90px] flex justify-between bg-black overflow-hidden">
        <div className="flex-1 flex flex-col justify-center !px-16 md:px-20 ">
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-6">
            archive
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-md leading-relaxed">
            A record of ideas, experiments, and what I learn while exploring new things and reflecting on my past experience.
          </p>
        </div>
        <div className="relative flex-1 h-full">
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
