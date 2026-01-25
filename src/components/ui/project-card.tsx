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
      className="group flex flex-col h-full rounded-[0.5px] border-none  overflow-hidden border border-white/10 transition-all duration-300 hover:border-white/20 !px-[2px] !py-[2px]"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-grow !px-[6px] !py-[6px]">
      
        <div className='flex justify-between items-center'>
        <h3 className="text-xl font-bold text-white mt-2">
          {project.title}
        </h3>
        </div>
        <p className="text-sm text-white/50 mt-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
};
