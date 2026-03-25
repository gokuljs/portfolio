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
    id: '3',
    slug: 'retrieval-from-first-principles',
    title: 'Retrieval, From First Principles',
    description: 'How search actually works, and why it evolved the way it did.',
    date: '2026-03-20',
    readTime: '18 min read',
    tags: ['Search', 'RAG', 'Vector Databases', 'Information Retrieval', 'Embeddings', 'BM25'],
    featured: true,
  },
  {
    id: '2',
    slug: 'building-simple-real-time-voice-agent-livekit',
    title: 'Building a Simple Real-Time Voice Agent with LiveKit',
    description: 'A hands-on walkthrough of building a real-time voice agent with LiveKit, wiring up the full STT to LLM to TTS loop so you can have back-and-forth voice conversations.',
    date: '2026-02-20',
    readTime: '4 min read',
    tags: ['LiveKit', 'Voice Agent', 'Speech-to-Text', 'LLM', 'Text-to-Speech', 'Python'],
    image: '/blog2banner.png',
  },
  {
    id: '1',
    slug: 'real-time-voice-agent-infrastructure',
    title: 'How Real-Time Voice Agents Work: Architecture and Latency',
    description: 'A breakdown of how real-time voice agents work under the hood: the two-layer architecture, VAD, STT, LLM, TTS pipeline, and where latency comes from at each stage.',
    date: '2026-02-19',
    readTime: '14 min read',
    tags: ['LiveKit', 'WebRTC', 'Real-Time Systems'],
    image: '/blogbanner1.png',
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

// Generate Article + BreadcrumbList JSON-LD for a blog post (use in server components)
export const generateBlogJsonLd = (slug: string) => {
  const blog = getBlogBySlug(slug);
  if (!blog) return null;

  const url = `https://gokuljs.com/blogs/${slug}`;
  const ogImage = blog.image
    ? `https://gokuljs.com${blog.image}`
    : `https://gokuljs.com/gokuljs.png`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    image: ogImage,
    datePublished: blog.date,
    dateModified: blog.date,
    author: {
      '@type': 'Person',
      name: 'Gokul JS',
      url: 'https://gokuljs.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Gokul JS',
      url: 'https://gokuljs.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: blog.tags?.join(', '),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gokuljs.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://gokuljs.com/blogs' },
      { '@type': 'ListItem', position: 3, name: blog.title, item: url },
    ],
  };

  return { articleJsonLd, breadcrumbJsonLd };
};

// Generate metadata for a blog post
export const generateBlogMetadata = (slug: string) => {
  const blog = getBlogBySlug(slug);
  if (!blog) return {};

  let ogImage: string;
  if (blog.image) {
    ogImage = `https://gokuljs.com${blog.image}`;
  } else {
    const ogParams = new URLSearchParams({
      title: blog.title,
      description: blog.description,
      tags: (blog.tags ?? []).join(','),
    });
    ogImage = `/api/og?${ogParams.toString()}`;
  }

  return {
    title: blog.title,
    description: blog.description,
    alternates: {
      canonical: `https://gokuljs.com/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `https://gokuljs.com/blogs/${blog.slug}`,
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
      site: '@gokul_js029',
      creator: '@gokul_js029',
    },
    keywords: blog.tags,
  };
};
