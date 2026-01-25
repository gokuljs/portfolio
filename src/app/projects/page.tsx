
'use client';

import Footer from '@/app/ui/home/Footer/Footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const playfair = Playfair_Display({ subsets: ['latin'], style: 'italic' });

const projects = [
  {
    id: 1,
    title: 'Mailyx',
    category: 'AI EMAIL',
    description: 'Minimalist AI email client with smart inbox, search, and navigation.',
    image: '/Mailyx.png',
    href: 'https://getmailyx.com/',
    status: 'progress',
    size: 'large',
    gradient: 'from-violet-600/20 via-purple-500/10 to-fuchsia-500/20',
  },
  {
    id: 2,
    title: 'Aerotime',
    category: 'PRODUCTIVITY',
    description: 'Smart calendar and scheduling tool to boost productivity and focus.',
    image: '/video-poster.jpg',
    href: 'https://www.aerotime.com/',
    status: 'live',
    size: 'medium',
    gradient: 'from-emerald-600/20 via-teal-500/10 to-cyan-500/20',
  },
  {
    id: 3,
    title: 'Teamble',
    category: 'HR TECH',
    description: 'Engagement platform to boost team culture, feedback, and recognition.',
    image: '/teambleBg.png',
    href: 'https://teamble.com/',
    status: 'live',
    size: 'medium',
    gradient: 'from-orange-600/20 via-amber-500/10 to-yellow-500/20',
  },
  {
    id: 4,
    title: 'NotionFlow',
    category: 'WORKSPACE',
    description: 'Collaborative workspace for notes, tasks, databases, and seamless organization.',
    image: '/NotionFlow.png',
    href: 'https://notionflow-omega.vercel.app/',
    status: 'live',
    size: 'large',
    gradient: 'from-blue-600/20 via-indigo-500/10 to-violet-500/20',
  },
  {
    id: 5,
    title: 'GSAP Experiment',
    category: 'ANIMATION',
    description: 'Creative GSAP experiment with stunning animations and transitions.',
    image: '/gsap.png',
    href: 'https://three-js-and-gasp.vercel.app/',
    status: 'live',
    size: 'small',
    gradient: 'from-rose-600/20 via-pink-500/10 to-fuchsia-500/20',
  },
  {
    id: 6,
    title: 'Custom GPT',
    category: 'AI CHAT',
    description: 'A ChatGPT clone with custom UI and backend implementation.',
    image: '/customGpt.png',
    href: 'https://custom-gpt-nine.vercel.app/',
    status: 'live',
    size: 'small',
    gradient: 'from-cyan-600/20 via-sky-500/10 to-blue-500/20',
  },
];

const MatrixShader = () => (
  <div className="absolute top-0 left-0 w-full h-screen pointer-events-none overflow-hidden z-0">
    {/* Dark Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
    
    {/* Falling Green Streaks */}
    <div className="absolute inset-0 opacity-40">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute top-[-20%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-matrix-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>

    {/* Top Green Glow Edge */}
    <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-emerald-500/20 to-transparent" />
    <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400/40 shadow-[0_0_50px_rgba(52,211,153,0.5)]" />
    
    <style jsx global>{`
      @keyframes matrix-fall {
        0% { transform: translateY(-100%); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(400%); opacity: 0; }
      }
      .animate-matrix-fall {
        animation: matrix-fall linear infinite;
      }
    `}</style>
  </div>
);

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden relative">
      <MatrixShader />
      
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
