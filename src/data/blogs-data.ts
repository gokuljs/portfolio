export interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string for sorting
  readTime?: string;
  tags?: string[];
}

export const blogsData: Blog[] = [
  {
    id: '1',
    slug: 'building-ai-agents-from-scratch',
    title: 'Building AI Agents from Scratch',
    description: 'A deep dive into creating intelligent agent systems that can reason and take actions autonomously.',
    date: '2026-02-10',
    readTime: '8 min read',
    tags: ['AI', 'Agents', 'LLM'],
  },
  {
    id: '2',
    slug: 'lessons-from-yc',
    title: 'Lessons from Y Combinator W21',
    description: 'Key takeaways and insights from my experience as a founding engineer at a YC-backed startup.',
    date: '2026-01-25',
    readTime: '6 min read',
    tags: ['Startup', 'YC', 'Lessons'],
  },
  {
    id: '3',
    slug: 'modern-web-architecture',
    title: 'Modern Web Architecture in 2026',
    description: 'How I approach building scalable web applications with Next.js, serverless, and edge computing.',
    date: '2026-01-15',
    readTime: '10 min read',
    tags: ['Web', 'Architecture', 'Next.js'],
  },
];

// Helper function to get blogs sorted by date (newest first)
export const getSortedBlogs = (): Blog[] => {
  return [...blogsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Helper function to get a single blog by slug
export const getBlogBySlug = (slug: string): Blog | undefined => {
  return blogsData.find((blog) => blog.slug === slug);
};
