import { Timeline } from '@/components/ui/timeline';
import { timelineData } from '@/data/timeline-data';

export default function ExperiencePage() {
  return (
    <section className="min-h-screen bg-black py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12 md:mb-20">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
            Professional Experience
          </h1>
          <p className="mt-4 text-neutral-400">
            A timeline of my professional journey and key achievements in
            software development and engineering.
          </p>
        </div>

        <Timeline data={timelineData} />
      </div>
    </section>
  );
}
