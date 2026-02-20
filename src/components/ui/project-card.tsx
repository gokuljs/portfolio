'use client';

import Image from 'next/image';
import { useState } from 'react';
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
  const [playing, setPlaying] = useState(false);
  const videoId = project.video ? getYouTubeId(project.video) : null;

  const handleCardClick = () => {
    if (project.link) window.open(project.link, '_blank');
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(true);
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      className="group flex flex-col border-stone-900/50 h-full rounded-[10px] border-none overflow-hidden border border-white/10 transition-all duration-300 hover:border-white/20 !px-[4px] !py-[4px]"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[10px]">
        {playing && videoId ? (
          <iframe
            className="absolute inset-0 w-full h-full rounded-[10px]"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={project.image}
              alt={project.title}
              fill
              unoptimized
              className="object-contain transition-transform rounded-[10px] duration-500"
            />
            {videoId && (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', borderRadius: 10 }} />
                <div
                  onClick={handlePlayClick}
                  style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(200,240,220,0.15)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(200,240,220,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 2 }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </>
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
