import Image from 'next/image';
import { Project } from '@/data/projects-data';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div     
      onClick={() => {
        window.open(project.link, '_blank');
      }}
      rel="noopener noreferrer"
      role="button"
      tabIndex={0}
      className="group flex flex-col border-stone-900/50 h-full rounded-[10px] border-none  overflow-hidden border border-white/10 transition-all duration-300 hover:border-white/20 !px-[4px] !py-[4px]"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform rounded-[4px] duration-500"
        />
      </div>

      <div className="flex flex-col flex-grow !px-[6px] !py-[6px]">
        <h3 className="text-[19px] font-bold text-white mt-3">
          {project.title}
        </h3>
        <p className="text-[15px] text-white/50 mt-2 line-clamp-2 leading-snug">
          {project.description}
        </p>
      </div>
    </div>
  );
};
