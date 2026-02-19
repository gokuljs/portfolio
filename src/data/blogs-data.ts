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
    slug: 'real-time-voice-agent-infrastructure',
    title: 'Inside a Real-Time Voice Agent: Media Infrastructure and Inference Orchestration',
    description: 'What it takes to build a low-latency voice agent. I walk through the full LiveKit pipeline: WebRTC, voice activity detection, STT, streaming LLM inference, and TTS working in real time.',
    date: '2026-02-19',
    readTime: '12 min read',
    tags: ['LiveKit', 'WebRTC', 'Real-Time Systems'],
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
