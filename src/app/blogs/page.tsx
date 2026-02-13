'use client';

import { BlogListItem } from '@/components/ui/blog-card';
import { getSortedBlogs } from '@/data/blogs-data';

export default function BlogsPage() {
  const blogs = getSortedBlogs();

  return (
    <>
      <h1 className="text-2xl font-medium text-white mb-8">Blogs</h1>
      
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
    </>
  );
}
