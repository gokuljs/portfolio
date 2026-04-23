export interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  metaDescription?: string; // SEO meta description; falls back to description if not set
  date: string; // ISO date string for sorting
  readTime?: string;
  tags?: string[];
  image?: string; // OG image for social sharing (e.g. '/blogs/my-post.png')
  featured?: boolean; // pinned to top of listing
}


export const blogsData: Blog[] = [
  {
    id: '4',
    slug: 'raft-consensus-algorithm',
    title: 'The Consensus Algorithm',
    description: 'A breakdown of Raft: how distributed servers elect a leader, replicate logs, and stay consistent even when nodes fail.',
    metaDescription: 'Learn how the Raft consensus algorithm works from the ground up. This guide covers leader election, log replication, heartbeats, term-based voting, log consistency checks, and how the system handles failures — giving you a clear mental model of how distributed consensus actually works.',
    date: '2026-04-23',
    readTime: '10 min read',
    tags: ['Distributed Systems', 'Raft', 'Consensus Algorithm', 'Leader Election', 'Log Replication', 'Fault Tolerance', 'Distributed Databases'],
    image: '/blogs/raft-consensus-sketch-dark.png',
  },
  {
    id: '3',
    slug: 'retrieval-from-first-principles',
    title: 'The Art of Retrieval',
    description: 'Every retrieval algorithm exists because the previous one had a flaw. This is a deep dive into how search evolved, and why it had to.',
    metaDescription: 'Learn how retrieval actually works from the ground up. This guide walks through keyword search, inverted indexes, TF-IDF, BM25, semantic search, embeddings, cosine similarity, vector databases, chunking strategies, contextual retrieval, ColBERT, late chunking, hybrid search, RRF, cross-encoder reranking, and evaluation — so you walk away with a clear mental model of how to build a production RAG pipeline.',
    date: '2026-03-20',
    readTime: '35 min read',
    tags: ['RAG', 'Retrieval-Augmented Generation', 'BM25', 'TF-IDF', 'Semantic Search', 'Hybrid Search', 'Reranking', 'Cross-Encoder', 'Bi-Encoder', 'ColBERT', 'Late Chunking', 'Contextual Retrieval', 'Vector Database', 'Embeddings', 'Cosine Similarity', 'Inverted Index', 'Reciprocal Rank Fusion', 'Information Retrieval', 'LLM', 'Chunking'],
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

// Helper function to get blogs sorted by date (newest first)
export const getSortedBlogs = (order: 'desc' | 'asc' = 'desc'): Blog[] => {
  return [...blogsData].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return order === 'desc' ? diff : -diff;
  });
};

// Helper function to get blogs with featured pinned to top, then sorted by date
export const getSortedBlogsWithFeatured = (order: 'desc' | 'asc' = 'desc'): Blog[] => {
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

  const seoDescription = blog.metaDescription ?? blog.description;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: seoDescription,
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

  const seoDescription = blog.metaDescription ?? blog.description;

  let ogImage: string;
  if (blog.image) {
    ogImage = `https://gokuljs.com${blog.image}`;
  } else {
    const ogParams = new URLSearchParams({
      title: blog.title,
      description: seoDescription,
      tags: (blog.tags ?? []).join(','),
    });
    ogImage = `/api/og?${ogParams.toString()}`;
  }

  return {
    title: blog.title,
    description: seoDescription,
    alternates: {
      canonical: `https://gokuljs.com/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: seoDescription,
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
      description: seoDescription,
      images: [ogImage],
      site: '@gokul_js029',
      creator: '@gokul_js029',
    },
    keywords: blog.tags,
  };
};
