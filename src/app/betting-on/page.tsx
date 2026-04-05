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
          I am a systems engineer. That is what I do well. Real-time media infrastructure, low-latency pipelines, the kind of work where a few milliseconds of jitter means the whole experience falls apart. Right now I am building a Selective Forwarding Unit from the ground up in Go. The piece of infrastructure that routes video streams in real-time conferencing without mixing or transcoding them. It is the kind of thing that sounds straightforward until you actually try to build one that works at scale.
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

        <h2>Why I Think World Models Are the Next Decade</h2>
        <p>
          LLMs changed everything about how we interact with text. But the world is not text. It is three-dimensional, it obeys physics, things move and break and interact in ways that language can describe but cannot simulate.
        </p>
        <p>
          World models are the attempt to build systems that actually understand this. Systems that can predict what happens when you push a block off a table. Systems that can generate plausible futures from a current observation. Systems that can serve as the internal simulation engine for a robot trying to figure out how to pick up a cup without knocking over the one next to it.
        </p>
        <p>
          This is where the next decade of AI progress happens. Not LLMs alone. Systems that understand physics, predict futures, and interact with the real world in real time. The labs know it. That is why NVIDIA, Meta, and Google are all investing heavily. But the infrastructure to support these systems at scale barely exists yet.
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
          Bets can be wrong. This one might be. Maybe world models do not pan out the way I think they will. Maybe the intersection I am targeting turns out to be less valuable than I expect. I do not think so, but I hold the possibility.
        </p>
        <p>
          What I do know is that I would rather bet on something I genuinely believe in, something that excites me, something that feels like it matters, than play it safe and optimize for the obvious. The worst case is I end up with deep systems knowledge <em>and</em> deep ML knowledge. There are worse positions to be in.
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
