import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
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

      <h2>What You'll Need</h2>
      <p>
        Before writing any code, you need a few things in place:
      </p>
      <ul>
        <li>A <strong>LiveKit Cloud account</strong> (or a self-hosted LiveKit server) to get a URL, API key, and API secret</li>
        <li>An <strong>OpenAI API key</strong>, used for both the LLM and TTS</li>
        <li>A <strong>Deepgram API key</strong>, used for STT</li>
        <li><strong>Python 3.10+</strong> with pip</li>
      </ul>
      <p>
        LiveKit Cloud has a generous free tier, so you can get going without a credit card for the server side. For the AI providers, you'll need accounts but the costs for experimentation are minimal.
      </p>

      <h2>Project Setup</h2>
      <p>
        Create a new directory and install the dependencies:
      </p>
      <pre><code>{`mkdir voice-agent && cd voice-agent
pip install livekit-agents livekit-plugins-openai livekit-plugins-deepgram livekit-plugins-silero python-dotenv`}</code></pre>
      <p>
        Then create a <code>.env</code> file with your credentials:
      </p>
      <pre><code>{`LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key`}</code></pre>

      <h2>The Agent</h2>
      <p>
        Here's the full agent in one file:
      </p>
      <pre><code>{`import asyncio
from dotenv import load_dotenv
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import deepgram, openai, silero

load_dotenv()

async def entrypoint(ctx: JobContext):
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "You are a helpful voice assistant. Keep your responses concise "
            "and conversational. This is a voice interface, not a chat window."
        ),
    )

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    assistant = VoiceAssistant(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(),
        tts=openai.TTS(),
        chat_ctx=initial_ctx,
    )

    assistant.start(ctx.room)
    await asyncio.sleep(1)
    await assistant.say("Hey, I'm ready. What's on your mind?", allow_interruptions=True)

    await asyncio.Event().wait()

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))`}</code></pre>
      <p>
        That's the whole agent. Let's walk through what's actually happening.
      </p>

      <h2>How It Works</h2>

      <h3>The Worker and Job Context</h3>
      <p>
        When you run this script, it starts a <strong>worker process</strong> that connects to your LiveKit server and waits for jobs. A job is dispatched whenever a participant joins a room. The <code>entrypoint</code> function is called with a <code>JobContext</code> that gives you access to the room and its participants.
      </p>
      <p>
        <code>ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)</code> tells the agent to join the room and automatically subscribe to audio tracks from other participants. It ignores video entirely, which is what you want for a voice agent.
      </p>

      <h3>VoiceAssistant</h3>
      <p>
        <code>VoiceAssistant</code> is the core abstraction from the LiveKit Agents framework. You hand it the four components of the pipeline:
      </p>
      <ul>
        <li><strong>VAD</strong>: Silero VAD, a lightweight neural model that detects speech vs. silence in real time</li>
        <li><strong>STT</strong>: Deepgram for streaming transcription</li>
        <li><strong>LLM</strong>: OpenAI GPT (defaults to gpt-4o-mini)</li>
        <li><strong>TTS</strong>: OpenAI TTS for synthesizing the response audio</li>
      </ul>
      <p>
        The assistant wires these together and manages the conversation loop for you. When the VAD detects end-of-speech, it takes the STT transcript, appends it to the chat context, sends it to the LLM, streams the output to the TTS, and publishes the audio back to the room.
      </p>

      <h3>The Chat Context</h3>
      <p>
        The <code>ChatContext</code> is the conversation history passed to the LLM. You initialize it with a system prompt, and the assistant automatically appends user messages and assistant responses as the conversation progresses. Keeping the system prompt short and voice-specific matters. Instructions that work well in a chat interface can produce overly verbose responses when spoken aloud.
      </p>

      <h3>The Initial Greeting</h3>
      <p>
        <code>assistant.say(...)</code> synthesizes and speaks a message directly, without going through the STT or LLM. This is useful for greetings or prompts. The <code>allow_interruptions=True</code> flag means the user can start talking and the agent will stop speaking immediately, enabling natural turn-taking behavior.
      </p>

      <h2>Running It</h2>
      <p>
        Start the agent in development mode:
      </p>
      <pre><code>{`python agent.py dev`}</code></pre>
      <p>
        In dev mode, the worker connects to your LiveKit server and logs to the terminal. You'll see it waiting for a room participant.
      </p>
      <p>
        To actually talk to it, you need a frontend connected to the same LiveKit room. The easiest way to test this is the <a href="https://agents-playground.livekit.io" target="_blank" rel="noopener noreferrer">LiveKit Agents Playground</a>. Paste in your LiveKit URL, API key, and API secret, and it will generate a token and connect you to a room. The agent will join automatically and you can start talking.
      </p>
      <div className="callout">
        <p>
          <strong>Dev mode vs. production:</strong> <code>python agent.py dev</code> runs a single worker process locally. For production, you'd run <code>python agent.py start</code> and deploy behind something like a process manager or container. Dev mode adds some extra logging and auto-reloads on file changes.
        </p>
      </div>

      <h2>What's Actually Happening Under the Hood</h2>
      <p>
        It's worth understanding the data flow once you connect:
      </p>
      <ul>
        <li>Your browser captures microphone audio and sends it over WebRTC to the LiveKit server</li>
        <li>The LiveKit server forwards the audio track to the agent worker</li>
        <li>The agent's VAD processes incoming audio frames to detect speech boundaries</li>
        <li>When end-of-speech is detected, the buffered audio is sent to Deepgram STT</li>
        <li>The transcript is appended to the chat context and sent to the LLM</li>
        <li>LLM tokens stream back and are passed to OpenAI TTS</li>
        <li>Synthesized audio is published as a new track back to the LiveKit room</li>
        <li>The browser receives and plays the audio</li>
      </ul>
      <p>
        The entire round trip, from you finishing a sentence to hearing the agent's response, typically lands between 800ms and 1.5 seconds with this stack. Not quite human conversational speed, but definitely usable.
      </p>

      <h2>Swapping Components</h2>
      <p>
        One of the better things about the plugin architecture is how easy it is to swap providers. Want to try a different LLM?
      </p>
      <pre><code>{`from livekit.plugins import anthropic

assistant = VoiceAssistant(
    vad=silero.VAD.load(),
    stt=deepgram.STT(),
    llm=anthropic.LLM(model="claude-3-5-haiku-20241022"),
    tts=openai.TTS(),
    chat_ctx=initial_ctx,
)`}</code></pre>
      <p>
        Or switch to ElevenLabs for TTS:
      </p>
      <pre><code>{`from livekit.plugins import elevenlabs

tts=elevenlabs.TTS(voice_id="your_voice_id")`}</code></pre>
      <p>
        The underlying pipeline wiring stays the same. You're just plugging in different components.
      </p>

      <h2>Adding Tools</h2>
      <p>
        You can give the agent tools to call during a conversation. Here's a minimal example, a tool that returns the current time:
      </p>
      <pre><code>{`from livekit.agents import llm as agents_llm

class AssistantFnc(agents_llm.FunctionContext):
    @agents_llm.ai_callable(description="Get the current time")
    def get_current_time(self) -> str:
        from datetime import datetime
        return datetime.now().strftime("%I:%M %p")

assistant = VoiceAssistant(
    vad=silero.VAD.load(),
    stt=deepgram.STT(),
    llm=openai.LLM(),
    tts=openai.TTS(),
    fnc_ctx=AssistantFnc(),
    chat_ctx=initial_ctx,
)`}</code></pre>
      <p>
        The agent will call <code>get_current_time</code> when it decides it's relevant to the conversation. This is where voice agents start to get genuinely useful; you can wire in calendar APIs, databases, or anything else the agent needs to do its job.
      </p>

      <hr />

      <p>
        This setup gives you a working voice agent in under 50 lines of Python. The LiveKit Agents framework handles the hard parts (WebRTC transport, audio track management, and pipeline orchestration) so you can focus on the behavior you actually want.
      </p>
      <p>
        From here, the natural next steps are tuning the system prompt for your use case, experimenting with different STT and TTS providers to find the latency/quality tradeoff that works for you, and adding tools so the agent can do things beyond just talking.
      </p>
    </BlogArticleLayout>
  );
}
