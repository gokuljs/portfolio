export interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string for sorting
  readTime?: string;
  tags?: string[];
  image?: string; // OG image for social sharing (e.g. '/blogs/my-post.png')
  featured?: boolean; // pinned to top of listing
}

export const blogsData: Blog[] = [
  {
    id: '2',
    slug: 'building-simple-real-time-voice-agent-livekit',
    title: 'Building a Simple Real-Time Voice Agent with LiveKit',
    description: 'A hands-on walkthrough of building a real-time voice agent with LiveKit, wiring up the full STT to LLM to TTS loop so you can have back-and-forth voice conversations.',
    date: '2026-02-20',
    readTime: '4 min read',
    tags: ['LiveKit', 'Voice Agent', 'Speech-to-Text', 'LLM', 'Text-to-Speech', 'Python'],
  },
  {
    id: '1',
    slug: 'real-time-voice-agent-infrastructure',
    title: 'How Real-Time Voice Agents Work: Architecture and Latency',
    description: 'A breakdown of how real-time voice agents work under the hood: the two-layer architecture, VAD, STT, LLM, TTS pipeline, and where latency comes from at each stage.',
    date: '2026-02-19',
    readTime: '14 min read',
    tags: ['LiveKit', 'WebRTC', 'Real-Time Systems'],
  },
];

// Helper function to get blogs sorted by date (newest first), featured pinned to top
export const getSortedBlogs = (order: 'desc' | 'asc' = 'desc'): Blog[] => {
  return [...blogsData].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return order === 'desc' ? diff : -diff;
  });
};

// Helper function to get a single blog by slug
export const getBlogBySlug = (slug: string): Blog | undefined => {
  return blogsData.find((blog) => blog.slug === slug);
};

// Generate metadata for a blog post
export const generateBlogMetadata = (slug: string) => {
  const blog = getBlogBySlug(slug);
  if (!blog) return {};

  const ogParams = new URLSearchParams({
    title: blog.title,
    description: blog.description,
    tags: (blog.tags ?? []).join(','),
  });
  const ogImage = `/api/og?${ogParams.toString()}`;

  return {
    title: `${blog.title} | Gokul JS`,
    description: blog.description,
    alternates: {
      canonical: `https://gokuljs.com/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article' as const,
      publishedTime: blog.date,
      authors: ['Gokul JS'],
      tags: blog.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: blog.title,
      description: blog.description,
      images: [ogImage],
    },
    keywords: blog.tags,
  };
};
