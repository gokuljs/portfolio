import { Metadata } from 'next';
import { BlogArticleLayout } from '@/components/ui/blog-article-layout';
import { HeerichScene } from '@/components/ui/heerich-scene';

export const metadata: Metadata = {
  title: 'What I\'m Betting On',
  description:
    'Systems engineering meets world models. Why I\'m positioning at the intersection of real-time infrastructure and the next paradigm in AI.',
  alternates: {
    canonical: 'https://gokuljs.com/betting-on',
  },
  openGraph: {
    title: 'What I\'m Betting On',
    description:
      'Systems engineering meets world models. Why I\'m positioning at the intersection of real-time infrastructure and the next paradigm in AI.',
    url: 'https://gokuljs.com/betting-on',
    type: 'article',
    authors: ['Gokul JS'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What I\'m Betting On',
    description:
      'Systems engineering meets world models. Why I\'m positioning at the intersection of real-time infrastructure and the next paradigm in AI.',
    site: '@gokul_js029',
    creator: '@gokul_js029',
  },
};

export default function BettingOnPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'What I\'m Betting On',
            description: metadata.description,
            url: 'https://gokuljs.com/betting-on',
            author: {
              '@type': 'Person',
              name: 'Gokul JS',
              url: 'https://gokuljs.com',
            },
          }),
        }}
      />
      <BlogArticleLayout
        title="What I'm Betting On"
        description="This is a living document. It will change as I learn, build, and figure things out. I'm not sure about all of it. That's the point."
        date={new Date('2026-04-04').toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
        dateISO="2026-04-04"
        tags={['World Models', 'Systems Engineering', 'AI Infrastructure', 'WebRTC', 'Go']}
      >
        <HeerichScene />

        <p>
          I have spent most of my time building real-time systems and shipping AI into production. Voice pipelines where latency is measured in milliseconds. Multi-agent systems that actually had to work for real users. Deploying and running open-source LLMs before it was the obvious thing to do. The kind of work where you learn fast because the feedback is immediate and unforgiving.
        </p>
        <p>
          Right now I am building a Selective Forwarding Unit from the ground up in Go. The piece of infrastructure that routes video streams in real-time conferencing without mixing or transcoding them. It is the kind of thing that sounds straightforward until you actually try to build one that works at scale.
        </p>
        <p>
          But this essay is not about where I am. It is about where I am going. And more honestly, where I <em>think</em> I am going. I am still figuring this out. I might be wrong about parts of it. I am writing it down anyway because writing forces clarity, and I would rather be wrong in public than vague in private.
        </p>

        <h2>The Bet</h2>
        <p>
          I am betting on world models.
        </p>
        <p>
          Not LLMs alone. LLMs are extraordinary, but they are language machines. They predict the next token in a sequence of text. World models are something different. They try to understand the actual structure of the physical world. Physics, spatial reasoning, cause and effect, what happens next in a visual scene. They are the thing that will eventually power robotics, autonomous systems, and anything that needs to interact with reality in real time.
        </p>
        <p>
          The field is early. Really early. The foundational papers are still being written. Benchmarks are unsettled. NVIDIA is working on Cosmos, Meta has V-JEPA 2, Google DeepMind has Genie 3, there is DreamerV3 from the reinforcement learning side. These are serious efforts from serious labs, but nobody has won yet. The paradigm has not crystallized the way transformers did for NLP.
        </p>
        <p>
          That is exactly why I think now is the time to position yourself here. Not after the field matures and the playbook is obvious. Now, while the gaps are wide open and the people who show up early have a disproportionate say in how things get built.
        </p>

        <h2>Why This Intersection Specifically</h2>
        <p>
          Here is the thing I keep noticing. The people working on world models are mostly ML researchers. They understand diffusion, they understand latent dynamics, they understand video transformers. What they do not always understand is how to serve those models in real time. How to get inference outputs into a video stream at 30 frames per second with predictable latency. How to build the plumbing that connects a world model to an actual user staring at a screen.
        </p>
        <p>
          And on the other side, the systems engineers who could build that plumbing, people who know WebRTC, who know SFUs, who know how to build media pipelines that do not fall over, most of them are not paying attention to world models at all. They are building video conferencing infrastructure or streaming platforms. Important work, but not where the frontier is moving.
        </p>
        <p>
          The gap is the intersection. Real-time media systems on one side. Deep ML understanding on the other. World models in the middle. Very few people are positioned to work across all three. That is where I am trying to be.
        </p>

        <h2>The Audio Dimension</h2>
        <p>
          There is another angle here that I have been paying attention to. World models are not just visual. The real world has sound. And the field is only now starting to figure out what that means.
        </p>
        <p>
          In late 2025, researchers published the first formal framework for audio-visual world models. Multimodal environment simulation with synchronized audio and visual observations. Before that paper, nobody had even formally defined what an audio-visual world model is. A separate survey appeared around the same time establishing the idea of embodied active acoustic intelligence: AI systems that build internal physics engines through sound.
        </p>
        <p>
          The practical results followed quickly. There are now audio world models for robot manipulation that predict future sound states. A robot filling a bottle can anticipate the changing pitch of the water. Runway&apos;s GWM-1 includes audio-driven conversational avatars with real-time lip-sync at 24 fps. Native audio generation became standard across the major video models in late 2025. Google&apos;s Veo 3, Kuaishou&apos;s Kling 2.6, ByteDance&apos;s Seedance 2.0, all generating synchronized sound alongside video.
        </p>
        <p>
          This matters for my bet because real-time audio is where I started. Voice pipelines. Audio routing. Latency-sensitive media delivery. If world models are going multimodal, and they clearly are, the infrastructure layer needs to handle audio and video together. That is not a minor implementation detail. It changes the architecture of the serving layer. The synchronization requirements. The bandwidth estimation. It is exactly the kind of problem where systems expertise meets ML in a way that neither side can solve alone.
        </p>

        <h2>What I Am Doing About It</h2>
        <p>
          The SFU is the systems foundation. It is teaching me everything about real-time media routing. How you handle SRTP streams, how you manage bandwidth estimation, how you deal with packet loss and jitter in a way that does not destroy the user experience. This is not theoretical knowledge. It is the kind of understanding you only get by building the thing yourself and debugging it at 2am when the audio starts crackling.
        </p>
        <p>
          The ML side is next. I want to go through a rigorous, project-based LLM engineering curriculum. Not tutorials. Actual implementation. Building tokenizers from scratch, writing attention mechanisms by hand, implementing KV caches, constructing transformers piece by piece. I want to understand these systems at the level where I can read a paper and know what trade-offs the authors made and why. I have not started this yet. It is on the roadmap, not on the resume.
        </p>
        <p>
          Same with the world model research landscape. I want to read the Cosmos papers, understand V-JEPA&apos;s approach to self-supervised video understanding, study how Genie 3 handles interactive environment generation, follow the DreamerV3 line of work on learning world models through reinforcement learning. Not to become a researcher. To understand where the field is, where the gaps are, and where a systems person could contribute something that a pure ML person cannot. I have not done this work yet either. But I know it is where I need to go.
        </p>

        <h2>The North Star</h2>
        <p>
          If I had to describe the project I am building toward, it would be something like this: a real-time world model inference server built on SFU architecture. Serving world model outputs through a WebRTC pipeline, optimized for latency the way production media systems are.
        </p>
        <p>
          Think about what that requires. You need to understand how world models generate frames. You need to understand how to pipeline that inference so it fits within a real-time budget. You need to understand how to encode those frames and route them through a media pipeline to a client. And you need to understand how to do all of that reliably, at scale, without the whole thing falling apart when load increases.
        </p>
        <p>
          That is not a project a pure ML researcher would build. It is not a project a pure systems engineer would build. It requires genuinely understanding both sides. That is why I think it matters.
        </p>

        <h2>The Post-AI Winners</h2>
        <p>
          There is a narrative going around that AI will flatten everything. That domain expertise stops mattering. That the people who build the models win and everyone else becomes irrelevant.
        </p>
        <p>
          I think that is wrong. I think it is doomer thinking dressed up as insight.
        </p>
        <p>
          The winners in a post-AI world will not be the people who built the best foundation model. They will be the people who have deep domain knowledge in a specific field and know how to use AI to make that field radically better. The cardiologist who uses AI to catch what she would have missed. The structural engineer who uses generative design to explore solutions he never would have drawn by hand. The systems programmer who uses AI to accelerate debugging but understands why the packet loss is happening in the first place.
        </p>
        <p>
          AI is a lever. Levers are useless without someone who understands what needs to be moved.
        </p>
        <p>
          This is part of why I am not trying to become an ML researcher. I am trying to become someone with deep enough systems knowledge and deep enough ML understanding that I can build things neither side would build alone. The AI does not replace the domain. It amplifies it. And the people who will be hardest to replace are the ones whose domain knowledge runs deep enough that AI makes them dangerous rather than redundant.
        </p>
        <p>
          The doomer version of this story says there is nothing left to do. I think the opposite is true. There has never been more to do. The tools just got better. The question is whether you have something worth building with them.
        </p>

        <h2>Why I Think World Models Are the Next Decade</h2>
        <p>
          LLMs changed everything about how we interact with text. But the world is not text. It is three-dimensional, it obeys physics, things move and break and interact in ways that language can describe but cannot simulate.
        </p>
        <p>
          World models are the attempt to build systems that actually understand this. Systems that can predict what happens when you push a block off a table. Systems that can generate plausible futures from a current observation. Systems that can serve as the internal simulation engine for a robot trying to figure out how to pick up a cup without knocking over the one next to it.
        </p>
        <p>
          This is where the next decade of AI progress happens. Not LLMs alone. Systems that understand physics, predict futures, and interact with the real world in real time. The labs know it. NVIDIA, Meta, Google, Runway, World Labs, and now AMI Labs are all investing heavily. Over 2.5 billion dollars has been deployed into world model startups in the last eighteen months alone. Sora&apos;s shutdown proved that building the model is only half the problem. Serving it interactively, reliably, at cost, is the other half. The infrastructure to support these systems at scale barely exists yet.
        </p>
        <p>
          Someone has to build it. I want to be one of those people.
        </p>

        <h2>An Honest Caveat</h2>
        <p>
          I want to be upfront about something. I am not sure all of this is right. I am still early in this transition. I have not built the north star project yet. I have not published a world model paper. I do not have a job at a frontier lab working on this.
        </p>
        <p>
          What I have is a clear direction, the technical foundation to pursue it, and the honesty to say I am still working toward it. This page is not a list of accomplishments. It is a statement of intent. A bet I am making with my time and energy.
        </p>
        <p>
          Bets can be wrong. This one might be. Maybe world models do not pan out the way I think they will. Maybe the intersection I am targeting turns out to be less valuable than I expect. Maybe the generative school wins and the embedding school fades, or vice versa, and the infrastructure requirements end up looking completely different from what I am imagining. I do not think so, but I hold the possibility.
        </p>
        <p>
          What I do know is that I would rather bet on something I believe in, something that excites me, something that feels like it matters, than play it safe and optimize for the obvious. The worst case is I end up with deep systems knowledge <em>and</em> deep ML knowledge. There are worse positions to be in.
        </p>

        <h2>The Stack</h2>
        <p>
          For anyone curious about the specifics. On the systems side: Go, WebRTC, real-time media pipelines, distributed systems. On the ML foundations side: transformers, attention mechanisms, diffusion models, reinforcement learning, all built from scratch, not just imported from a library. On the world model side: video transformers, latent dynamics modeling, physics simulation. Target platforms I am paying attention to: NVIDIA Cosmos, MuJoCo, Isaac Sim.
        </p>

        <hr />

        <p>
          <em>This page is a living document. It will change as I build, ship, and learn. Last updated April 2026.</em>
        </p>
      </BlogArticleLayout>
    </>
  );
}
