'use client';

import { BlogArticleLayout } from '@/components/ui/blog-article-layout';

export default function RealTimeVoiceAgentPage() {
  return (
    <BlogArticleLayout
      title="Inside a Real-Time Voice Agent: Media Infrastructure and Inference Orchestration"
      description="A deep dive into building low-latency voice agents, covering WebRTC transport, VAD, STT, streaming LLM inference, and TTS. I walk through the full pipeline from speech input to synthesized response, exploring architectural tradeoffs between modular systems and multimodal models for production deployments."
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
