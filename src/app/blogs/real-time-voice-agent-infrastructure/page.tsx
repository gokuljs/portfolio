'use client';

import { BlogArticleLayout } from '@/components/ui/blog-article-layout';

export default function RealTimeVoiceAgentPage() {
  return (
    <BlogArticleLayout
      title="Inside a Real-Time Voice Agent: Media Infrastructure and Inference Orchestration"
      description="What it takes to build a low-latency voice agent. I walk through the full LiveKit pipeline: WebRTC, voice activity detection, STT, streaming LLM inference, and TTS working in real time."
      date="February 19, 2026"
      tags={['LiveKit', 'WebRTC', 'Real-Time Systems']}
    >
      {/* Article content goes here */}
      <p>
        Coming soon...
      </p>
    </BlogArticleLayout>
  );
}
