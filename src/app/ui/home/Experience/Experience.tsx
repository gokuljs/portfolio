import { Timeline } from '@/components/ui/timeline';
import Image from 'next/image';
import YouTubePlayer from '../../components/yotubeplayer';
import styles from '@styles/Experience.module.scss';
export default function Experience() {
  const data = [
    {
      title: 'Jun 25 - Present',
      content: (
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--site-surface)', border: '1px solid var(--site-border)' }}>
                <img
                  src="/rime-logo.png"
                  alt="Rime Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-medium" style={{ color: 'var(--site-text-heading)' }}>Rime TTS</h3>
                <p className="text-xs" style={{ color: 'var(--site-text-muted)' }}>Senior Software Engineer</p>
              </div>
            </div>
            <p className="text-sm font-normal !mt-2" style={{ color: 'var(--site-text-subtle)' }}>
              San Francisco • Full-time • Remote
            </p>
            <p className="!mt-2 text-sm font-normal leading-relaxed" style={{ color: 'var(--site-text)' }}>
              Rime was a great place to build real-time systems with a strong team and
              a lot of ownership. I owned the full voice pipeline, from frontend UX to
              WebRTC transport with LiveKit and Pipecat. Shipped integrations so customers
              could get low-latency voice that actually worked. When audio broke in
              production, I was the one tracing it through the stack and pushing fixes.
              Got comfortable making tradeoffs between speed, reliability, and cost. The
              kind of work where you hear the difference when it&apos;s done right.
            </p>
          </div>

          <div className="w-full !mt-4 h-fit">
            <img
              src="/rimeNew.jpeg"
              alt="Rime TTS"
              width={800}
              height={800}
              className="w-full rounded-lg object-contain h-auto max-h-[400px]"
              style={{ border: '1px solid var(--site-border)' }}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Jun 24 - Mar 25',
      content: (
        <div >
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--site-surface)', border: '1px solid var(--site-border)' }}>
                <img
                  src="/teamble.svg"
                  alt="Company Logo"
                  className="w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-base font-medium" style={{ color: 'var(--site-text-heading)' }}>Teamble</h3>
                <p className="text-xs" style={{ color: 'var(--site-text-muted)' }}>Lead Engineer</p>
              </div>
            </div>
            <p className="text-sm font-normal !mt-2" style={{ color: 'var(--site-text-subtle)' }}>
              New York City, NY, USA • Full-time • Remote
            </p>
            <p className="!mt-2 text-sm font-normal leading-relaxed" style={{ color: 'var(--site-text)' }}>
              Architected high-performance web apps with Node.js and React.
              Built a full design system from scratch, dramatically speeding up
              development. Refactored backend logic and SQL to optimize API
              response times. Developed LLM-powered AI agents using LangGraph
              built a role-aware conversational interface and a multi-agent
              system using RAG and fine-tuned models. Created a OneOnOne Agent
              that aggregates data for performance reviews and real-time
              collaboration.
            </p>
          </div>

          <div className="w-full !mt-4 h-fit">
            <img
              src="/teambleBg.png"
              alt="hero template"
              width={800}
              height={800}
              className="w-full rounded-lg object-contain h-auto max-h-[400px]"
              style={{ border: '1px solid var(--site-border)' }}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Nov 22 – Feb 24',
      content: (
        <div>
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex gap-2">
                <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--site-surface)', border: '1px solid var(--site-border)' }}>
                  <img
                    src="/ae-logo.svg"
                    alt="Company Logo"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium" style={{ color: 'var(--site-text-heading)' }}>Aerotime</h3>
                  <p className="text-xs" style={{ color: 'var(--site-text-muted)' }}>Founding Engineer</p>
                </div>
              </div>
              <div className="flex items-center ml-auto !mt-2 ">
                <Image
                  src="/yx.svg"
                  height={125}
                  width={125}
                  alt="YC Logo"
                  className="object-contain hidden md:block"
                />
              </div>
            </div>
            <p className="text-sm font-normal !mt-2" style={{ color: 'var(--site-text-subtle)' }}>
              San Francisco, California • Full-time • Remote
            </p>
            <p className="!mt-2 text-sm font-normal leading-relaxed" style={{ color: 'var(--site-text)' }}>
              Found my people here. This team showed me you truly become who you
              surround yourself with. Wore all the hats as a founding engineer
              coded frontend to backend, built our JS SDK from scratch, and
              geeked out deploying LLaMA and Stable Diffusion models. The best
              part? Talking directly with users, turning their &ldquo;what if&rdquo; moments
              into actual features. Felt like building my own startup, except
              with brilliant teammates who pushed me daily. Still miss our 3AM
              debugging sessions and spontaneous whiteboard jams.
            </p>
          </div>

          <div className="w-full !mt-3 h-fit">
            <YouTubePlayer />
          </div>
        </div>
      ),
    },
    {
      title: 'Nov 21 - Nov 22',
      content: (
        <div key={"tifin"}>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--site-surface)', border: '1px solid var(--site-border)' }}>
                <img
                  src="/tifin-logo.svg"
                  alt="Company Logo"
                  className="w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-base font-medium" style={{ color: 'var(--site-text-heading)' }}>
                  TIFIN Fintech
                </h3>
                <p className="text-xs" style={{ color: 'var(--site-text-muted)' }}>Software Engineer</p>
              </div>
            </div>
            <p className="text-sm font-normal !mt-2" style={{ color: 'var(--site-text-subtle)' }}>
              Bangalore, India • Full-time
            </p>
            <p className="!mt-2 text-sm font-normal leading-relaxed" style={{ color: 'var(--site-text)' }}>
              Full-stack developer at TIFIN Wealth specializing in modern web
              architecture. Spearheaded frontend development using Next.js and
              React.js while driving backend integrations to enhance platform
              performance. Implemented Redux Toolkit for streamlined state
              management and created an ecosystem of reusable components to
              improve development efficiency. Integrated GraphQL and React Query
              for optimized data fetching while modernizing the platform through
              strategic codebase migrations. Enhanced user experience through
              responsive design implementation and systematic bug resolution.
            </p>
          </div>

          <div className="w-full !mt-4 h-fit">
            <img
              src="/tifin.png"
              alt="hero template"
              width={800}
              height={800}
              className="w-full rounded-lg object-contain h-auto max-h-[400px]"
              style={{ border: '1px solid var(--site-border)' }}
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <div id="experience" style={{ width: '100%', textAlign: 'center', padding: '0 24px' }}>
        <h2 className={styles.timelineHeading} style={{ padding: 0, textAlign: 'center' }}>
          Work
        </h2>
      </div>
      <div className="relative w-full overflow-clip">
        <Timeline data={data} />
      </div>
    </>
  );
}
