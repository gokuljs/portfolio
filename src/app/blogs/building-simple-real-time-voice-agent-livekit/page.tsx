import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
import { VideoThumbnail } from '@/components/ui/video-thumbnail';
import { getBlogBySlug, generateBlogMetadata } from '@/data/blogs-data';

const slug = 'building-simple-real-time-voice-agent-livekit';
const blog = getBlogBySlug(slug)!;

export const metadata: Metadata = generateBlogMetadata(slug);

export default function BuildingSimpleVoiceAgentPage() {
  return (
    <BlogArticleLayout
      title={blog.title}
      description={blog.description}
      date={new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      tags={blog.tags}
    >
      <p>
        In a <a href="/blogs/real-time-voice-agent-infrastructure">previous post</a>, I covered the architecture behind real-time voice agents: WebRTC, VAD, and the tradeoffs between pipeline and realtime models. This post is the practical follow-up: actually building and running one.
      </p>
      <p>
        The goal is simple: a voice agent you can talk to. It listens to your speech, transcribes it, sends it to an LLM, and speaks the response back. The full STT → LLM → TTS loop, end to end. By the end, you'll have something running locally that you can experiment with.
      </p>

      <VideoThumbnail
        url="https://www.youtube.com/watch?v=t2J8ce1vdtc"
        image="/blogs/placeholderimage.png"
        alt="Real-Time Voice Agent Demo"
      />

      <p>
        You can find the full source on GitHub at <a href="https://github.com/gokuljs/Livekit-Voice-agent" target="_blank" rel="noopener noreferrer">gokuljs/Livekit-Voice-agent</a>. Clone it and follow along.
      </p>

      <h2>Before You Start</h2>
      <p>
        If you haven't spent time in the LiveKit docs yet, it's worth doing before diving into the code. The platform has a lot more surface area than what this post covers, and reading through it will give you a much better mental model of what's possible: rooms, participants, tracks, agent workers, SIP integration. You'll come back to these pages often.
      </p>
      <ul>
        <li><a href="https://docs.livekit.io/home/" target="_blank" rel="noopener noreferrer">LiveKit Overview</a>: rooms, participants, and tracks</li>
        <li><a href="https://docs.livekit.io/agents/" target="_blank" rel="noopener noreferrer">LiveKit Agents</a>: how to build and run AI agents</li>
        <li><a href="https://docs.livekit.io/sip/" target="_blank" rel="noopener noreferrer">LiveKit SIP</a>: connecting to phone numbers and telephony systems</li>
      </ul>

      <h2>Architecture</h2>
      <img src="/blogs/sst-llm-tts.svg" alt="Architecture diagram: STT to LLM to TTS pipeline" style={{ width: '65%', margin: '0 auto', display: 'block' }} />

      <h2>Diving Into the Code</h2>
      <p>
        I'll let the code speak for itself here. You'll be surprised how little it takes to get something running.
      </p>
      <pre><code>{`async def entrypoint(ctx: JobContext):
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    await ctx.wait_for_participant()

    rime_tts = rime.TTS(model=RIME_MODEL, speaker=RIME_SPEAKER)
    session = AgentSession(
        stt=openai.STT(model=OPENAI_TRANSCRIPT_MODEL),
        llm=openai.LLM(model=OPENAI_MODEL),
        tts=rime_tts,
        vad=ctx.proc.userdata["vad"],
        turn_detection=MultilingualModel(),
    )

    await session.start(
        room=ctx.room,
        agent=VoiceAssistant(),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC()
        ),
    )
    await session.say(INTRO_PHRASE)`}</code></pre>
      <p>
        That's the entire entrypoint. You initialize your STT, LLM, and TTS, pass them into <code>AgentSession</code>, and start it. LiveKit wires the pipeline together for you. The agent connects to the room, waits for a participant, and greets them. That's all it takes to get a working voice agent off the ground.
      </p>
      <p>
        Once it's running, the real challenges show up: chipping away at latency, building observability on top of what LiveKit provides, and thinking carefully about how you design your agent for the use case you're targeting. Getting started is the easy part.
      </p>

    </BlogArticleLayout>
  );
}
