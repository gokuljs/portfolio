
'use client';

import Footer from '@/app/ui/home/Footer/Footer';
import { CyberpunkBackground } from '@/components/ui/cyberpunk-background';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], style: 'italic' });

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden relative">
      <CyberpunkBackground />
      
      <div className="hidden md:block">
        {/* <Spotlight /> */}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <div className="text-center space-y-4 md:space-y-6 flex flex-col justify-center items-center px-4">
            <h1 className={`${playfair.className} text-[clamp(1.5rem,8vw,4.5rem)] font-medium mb-6 md:mb-8 leading-none tracking-tight text-white drop-shadow-sm px-4`}>
              Code that made it to the real world.
            </h1>
            <p className="text-[clamp(0.875rem,2.5vw,1.1rem)] text-neutral-400 font-light opacity-90 max-w-[90vw] md:max-w-3xl leading-relaxed px-6">
              A collection of products, tools, and experiments I&apos;ve built and shipped in the past.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
