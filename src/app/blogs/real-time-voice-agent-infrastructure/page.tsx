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
      <p>
        Real-time voice agents differ fundamentally from traditional request-response AI systems. Unlike text interfaces, voice interaction requires continuous media streaming, low-latency inference, and bidirectional audio transport.
      </p>
      <p>
        At a conceptual level, a voice agent is simple: a user speaks, the system processes the input, and a response is returned. In practice, implementing this interaction in real time requires coordinated handling of media transport, speech recognition, language modeling, and speech synthesis, all operating under strict latency constraints.
      </p>
      <p>
        Now, when it comes to building a production grade voice agent, things get more involved. Multiple subsystems have to operate in coordination:
      </p>
      <ul>
        <li>Media transport over WebRTC</li>
        <li>Streaming speech recognition</li>
        <li>Incremental language model inference</li>
        <li>Streaming speech synthesis</li>
        <li>Turn detection and interruption handling</li>
      </ul>
      <p>
        I'll walk through how to build a system like this using LiveKit. The focus here is on architecture and system behavior rather than SDK usage. LiveKit provides the infrastructure and agent framework needed to build these systems without having to implement WebRTC media handling from scratch.
      </p>
      <p>
        At a high level, a voice agent can be understood as two major layers:
      </p>
      <ul>
        <li>Media infrastructure layer</li>
        <li>Inference orchestration layer</li>
      </ul>

      <h2>Media Infrastructure Layer: LiveKit Server</h2>
      <p>
        LiveKit provides the media infrastructure layer through the LiveKit Server. The server operates as a WebRTC SFU. Its responsibilities include:
      </p>
      <ul>
        <li>Signaling and connection negotiation</li>
        <li>ICE and NAT traversal</li>
        <li>Secure media transport</li>
        <li>Track routing between participants</li>
        <li>Room state management</li>
        <li>Horizontal scaling</li>
      </ul>
      <div className="callout">
        <p>
          <strong>SFU (Selective Forwarding Unit)</strong> - LiveKit forwards media packets as-is. It only tweaks RTP headers and selects which layers to send, without decoding the actual audio or video payload.
        </p>
      </div>
      <p>
        This matters because:
      </p>
      <ul>
        <li><strong>Reduced latency</strong> - you skip the encoding and decoding step entirely</li>
        <li><strong>CPU efficiency</strong> - forwarding is far cheaper than transcoding, so a single server can handle many more participants</li>
        <li><strong>Simplicity and reliability</strong> - less processing means fewer failure points and more predictable performance</li>
      </ul>
      <p>
        When a user joins a room, all WebRTC negotiation, encryption, and track establishment occur within the LiveKit server. Once the connection is established, audio frames are streamed between participants with minimal server-side processing.
      </p>
    </BlogArticleLayout>
  );
}
