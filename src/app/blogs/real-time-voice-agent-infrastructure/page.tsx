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

      <h2>Inference Orchestration Layer: LiveKit Agents</h2>
      <p>
        The inference orchestration layer is where the actual intelligence lives. LiveKit Agents handle this. An agent subscribes to user audio tracks, processes them through an inference pipeline, and publishes synthesized audio back to the room.
      </p>
      <p>
        All the business logic resides inside the agent:
      </p>
      <ul>
        <li>Speech-to-text processing</li>
        <li>Language model invocation</li>
        <li>Tool execution</li>
        <li>Text-to-speech synthesis</li>
        <li>Decision logic</li>
      </ul>
      <p>
        Think of the agent as a real-time media consumer and producer. It listens, thinks, and speaks.
      </p>
      <p>
        LiveKit agents follow a plugin-based architecture. You can swap out different providers for:
      </p>
      <ul>
        <li>VAD (voice activity detection)</li>
        <li>STT (speech-to-text)</li>
        <li>LLM (language model)</li>
        <li>TTS (text-to-speech)</li>
      </ul>
      <p>
        This lets you compose your inference pipeline however you want. Need to switch from Deepgram to Whisper? Swap the plugin. Want to try a different TTS provider? Same deal. The underlying media infrastructure stays untouched.
      </p>
      <p>
        At this point, the architecture can go two different ways: a <strong>pipeline model</strong> or a <strong>realtime model</strong>.
      </p>

      <h2>Pipeline Architecture</h2>
      <p>
        In the pipeline architecture, STT, LLM, and TTS are treated as discrete components. Each stage is explicitly defined and operates independently.
      </p>
      <figure className="my-12 -mx-8 sm:-mx-16 md:-mx-24 lg:-mx-32 xl:-mx-48">
        <img 
          src="/blogs/voice-agent-pipeline.svg" 
          alt="Voice agent pipeline architecture showing User Audio flowing through VAD, STT, LLM, TTS to Audio output"
          className="w-full h-auto"
        />
      </figure>
    </BlogArticleLayout>
  );
}
