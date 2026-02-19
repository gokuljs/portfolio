import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
import { getBlogBySlug, generateBlogMetadata } from '@/data/blogs-data';

const slug = 'real-time-voice-agent-infrastructure';
const blog = getBlogBySlug(slug)!;

export const metadata: Metadata = generateBlogMetadata(slug);

export default function RealTimeVoiceAgentPage() {
  return (
    <BlogArticleLayout
      title={blog.title}
      description={blog.description}
      date={new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      tags={blog.tags}
    >
      {/* Article content goes here */}
      <p>
        Coming soon...
      </p>
    </BlogArticleLayout>
  );
}
