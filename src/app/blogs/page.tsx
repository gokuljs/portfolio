import { getSortedBlogs } from '@/data/blogs-data';
import BlogsClient from './BlogsClient';

export default function BlogsPage() {
  const initialBlogs = getSortedBlogs('desc');
  return <BlogsClient initialBlogs={initialBlogs} />;
}
