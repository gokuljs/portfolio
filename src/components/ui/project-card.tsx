'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/data/projects-data';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const CardWrapper = project.link ? 'a' : 'div';
  const wrapperProps = project.link 
    ? { href: project.link, target: "_blank", rel: "noopener noreferrer" } 
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full max-w-[380px]"
    >
      <CardWrapper
        {...wrapperProps}
        className="group relative block w-full bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-[#111111]"
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
          
          {/* Status Badge */}
          {project.status && (
            <div className="absolute top-4 left-4">
              <span className={cn(
                "px-2.5 py-0.5 text-[9px] uppercase tracking-[0.15em] rounded-full border flex items-center gap-1.5 backdrop-blur-md",
                project.status === 'Live' 
                  ? "bg-green-900/20 text-green-400 border-green-700/30" 
                  : "bg-yellow-900/20 text-yellow-400 border-yellow-700/30"
              )}>
                <span className={cn(
                  "w-1 h-1 rounded-full animate-pulse",
                  project.status === 'Live' ? "bg-green-400" : "bg-yellow-400"
                )} />
                {project.status}
              </span>
            </div>
          )}

          {/* External Link Icon */}
          <div className="absolute top-4 right-4 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">
              {project.title}
            </h3>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              0{index + 1}
            </span>
          </div>
          
          <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
      </CardWrapper>
    </motion.div>
  );
};
