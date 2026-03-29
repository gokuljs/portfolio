
'use client';

import Footer from '@/app/ui/home/Footer/Footer';
import { ProjectCard } from '@/components/ui/project-card';
import { projectsData } from '@/data/projects-data';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: 'var(--site-bg)', transition: 'background 0.25s' }}>
      <section className="w-full min-h-screen py-32 px-8 md:px-16 lg:px-24 flex flex-col items-center">
        <div className="max-w-7xl w-full mt-[70px]">

          <div style={{ marginBottom: '3rem' }}>
            <p style={{
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--site-text-subtle)',
              marginBottom: '0.75rem',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              work
            </p>
            <h1 style={{
              fontFamily: 'var(--font-lora), Georgia, "Times New Roman", serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--site-text-heading)',
              margin: '0 0 0.75rem',
              transition: 'color 0.25s',
            }}>
              Projects
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1.5rem' }}>
              <div style={{ flex: 0, width: '40px', height: '1px', background: 'var(--site-border)' }} />
              <span style={{ fontSize: '10px', color: 'var(--site-text-subtle)', letterSpacing: '0.2em' }}>✦</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--site-border-subtle)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {projectsData.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
