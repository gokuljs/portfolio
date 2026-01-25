'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/data/projects-data';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative flex flex-col w-full max-w-[380px]"
    >
      {/* Outer Glow Effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[24px] blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative flex flex-col h-full bg-[#0A0A0A] border border-white/5 rounded-[22px] overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:translate-y-[-4px]">
        {/* Futuristic Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Image Container with subtle zoom */}
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
          
          {/* Quick View Icon (appears on hover) */}
          <div className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-grow p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium tracking-tight text-white/90 group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <span className="text-[10px] font-mono text-white/30 group-hover:text-white/50 transition-colors uppercase tracking-[0.2em]">
                0{index + 1}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-0.5 text-[9px] uppercase tracking-[0.15em] bg-white/[0.03] border border-white/5 rounded-full text-white/40 font-medium group-hover:border-white/10 group-hover:text-white/60 transition-all"
                >
                  {tag}
                </span>
              ))}
              {project.status && (
                <span className={cn(
                  "px-2.5 py-0.5 text-[9px] uppercase tracking-[0.15em] rounded-full border flex items-center gap-1.5",
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
              )}
            </div>
          </div>

          <p className="text-[13px] text-white/50 group-hover:text-white/70 transition-colors line-clamp-3 leading-[1.6]">
            {project.description}
          </p>

          {/* Action Links */}
          <div className="flex items-center gap-6 pt-2 mt-auto">
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 hover:text-white transition-all group/link"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/link:bg-white group-hover/link:shadow-[0_0_8px_white] transition-all" />
                Live Preview
              </a>
            )}
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 hover:text-white transition-all group/link"
              >
                <Github className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                Repository
              </a>
            )}
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </motion.div>
  );
};
