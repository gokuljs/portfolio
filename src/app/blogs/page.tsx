import { getSortedBlogs } from '@/data/blogs-data';
import BlogsClient from './BlogsClient';

export const dynamic = 'force-static';

export default function BlogsPage() {
  const initialBlogs = getSortedBlogs('desc');
  return <BlogsClient initialBlogs={initialBlogs} />;
}
