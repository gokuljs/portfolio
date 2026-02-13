'use client';

import { useParams, notFound } from 'next/navigation';
import { getBlogBySlug } from '@/data/blogs-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Back Button */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        <span>Back to blogs</span>
      </Link>

      {/* Header */}
      <header className="mb-8">
        <time dateTime={blog.date} className="text-sm text-neutral-500">
          {formatDate(blog.date)}
        </time>
        
        <h1 className="text-3xl font-medium text-white mt-2 mb-4">
          {blog.title}
        </h1>

        <p className="text-neutral-400 leading-relaxed">
          {blog.description}
        </p>
      </header>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 mb-8" />

      {/* Content - You will design each blog differently here */}
      <article className="text-neutral-300 leading-relaxed">
        <p>Blog content goes here. Each blog can be designed differently.</p>
      </article>
    </>
  );
}
