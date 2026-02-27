export type Announcement = {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  date: string;
  tag?: string;
};

export const announcements: Announcement[] = [
  {
    id: 'blog-real-time-voice-agent-infrastructure',
    title: 'How Real-Time Voice Agents Work: Architecture and Latency',
    description:
      'A breakdown of how real-time voice agents work under the hood: the two-layer architecture, VAD, STT, LLM, TTS pipeline, and where latency comes from at each stage.',
    image: '/blogbanner1.png',
    url: '/blogs/real-time-voice-agent-infrastructure',
    date: '2026-02-19',
    tag: 'Blog',
  },
  {
    id: 'blog-building-simple-real-time-voice-agent-livekit',
    title: 'Building a Simple Real-Time Voice Agent with LiveKit',
    description:
      'A hands-on walkthrough of building a real-time voice agent with LiveKit, wiring up the full STT → LLM → TTS loop so you can have back-and-forth voice conversations.',
    image: '/blog2banner.png',
    url: '/blogs/building-simple-real-time-voice-agent-livekit',
    date: '2026-02-20',
    tag: 'Blog',
  },

];
