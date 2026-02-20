'use client';

import Image from 'next/image';
import { Project } from '@/data/projects-data';

interface ProjectCardProps {
  project: Project;
  index: number;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
  return match ? match[1] : null;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {

  const videoId = project.video ? getYouTubeId(project.video) : null;

  const handleCardClick = () => {
    if (videoId) return;
    if (project.link) window.open(project.link, '_blank');
  };

  return (
    <div
      onClick={handleCardClick}
      rel="noopener noreferrer"
      role="button"
      tabIndex={0}
      className="group flex flex-col border-stone-900/50 h-full rounded-[10px] border-none overflow-hidden border border-white/10 transition-all duration-300 hover:border-white/20 !px-[4px] !py-[4px]"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[10px]">
        {videoId ? (
          <iframe
            className="absolute inset-0 w-full h-full rounded-[10px]"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform rounded-[10px] duration-500"
          />
        )}
      </div>

      <div className="flex flex-col flex-grow !px-[6px] !py-[6px]">
        <div className="flex justify-between items-center">
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
