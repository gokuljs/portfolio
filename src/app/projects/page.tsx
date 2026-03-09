
'use client';

import Footer from '@/app/ui/home/Footer/Footer';
import { ProjectCard } from '@/components/ui/project-card';
import { projectsData } from '@/data/projects-data';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full bg-[#0C0C0C] overflow-x-hidden">
      <section className="w-full min-h-screen py-32 px-8 md:px-16 lg:px-24 flex flex-col items-center">
        <div className="max-w-7xl w-full mt-[70px]">
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
