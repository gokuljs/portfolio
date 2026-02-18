export interface SkillNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  size: 'large' | 'medium' | 'small';
  connections: string[];
}

export interface CategoryConfig {
  id: string;
  label: string;
  color: string;
  glowColor: string;
}

export const categoryColors: Record<string, CategoryConfig> = {
  core: {
    id: 'core',
    label: 'Core',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
  },
  frontend: {
    id: 'frontend',
    label: 'Frontend',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  backend: {
    id: 'backend',
    label: 'Backend',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.4)',
  },
  infrastructure: {
    id: 'infrastructure',
    label: 'Infrastructure',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
  },
  realtime: {
    id: 'realtime',
    label: 'Real-time',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
  },
  ai: {
    id: 'ai',
    label: 'AI & Agents',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
  },
};

export const skillNodes: SkillNode[] = [
  // Core Languages (center) - hub connecting everything
  { id: 'typescript', label: 'TypeScript', category: 'core', x: 50, y: 45, size: 'large', connections: ['javascript', 'react', 'nextjs', 'nodejs', 'trpc', 'prisma', 'drizzle'] },
  { id: 'javascript', label: 'JavaScript', category: 'core', x: 42, y: 52, size: 'medium', connections: ['typescript', 'react', 'nodejs', 'websockets'] },
  { id: 'python', label: 'Python', category: 'core', x: 58, y: 52, size: 'medium', connections: ['fastapi', 'langchain', 'langgraph', 'llamaindex', 'huggingface', 'pipecat'] },

  // Frontend (left side) - tighter grouping
  { id: 'react', label: 'React', category: 'frontend', x: 22, y: 38, size: 'large', connections: ['nextjs', 'zustand', 'reactquery', 'typescript', 'tailwind', 'gsap', 'vite'] },
  { id: 'nextjs', label: 'Next.js', category: 'frontend', x: 14, y: 48, size: 'medium', connections: ['react', 'vercel', 'typescript'] },
  { id: 'tailwind', label: 'Tailwind', category: 'frontend', x: 26, y: 26, size: 'medium', connections: ['react', 'shadcn', 'nextjs'] },
  { id: 'shadcn', label: 'shadcn/ui', category: 'frontend', x: 14, y: 30, size: 'small', connections: ['tailwind', 'react'] },
  { id: 'zustand', label: 'Zustand', category: 'frontend', x: 10, y: 40, size: 'small', connections: ['react'] },
  { id: 'reactquery', label: 'React Query', category: 'frontend', x: 12, y: 56, size: 'small', connections: ['react', 'trpc'] },
  { id: 'solidjs', label: 'SolidJS', category: 'frontend', x: 20, y: 62, size: 'small', connections: ['typescript', 'vite'] },
  { id: 'vite', label: 'Vite', category: 'frontend', x: 10, y: 66, size: 'small', connections: ['solidjs', 'react'] },
  { id: 'gsap', label: 'GSAP', category: 'frontend', x: 8, y: 52, size: 'small', connections: ['react'] },

  // Backend (right side) - tighter grouping
  { id: 'nodejs', label: 'Node.js', category: 'backend', x: 78, y: 38, size: 'large', connections: ['typescript', 'trpc', 'graphql', 'websockets', 'javascript'] },
  { id: 'fastapi', label: 'FastAPI', category: 'backend', x: 86, y: 48, size: 'medium', connections: ['python', 'postgresql'] },
  { id: 'trpc', label: 'tRPC', category: 'backend', x: 70, y: 30, size: 'medium', connections: ['typescript', 'reactquery', 'nodejs'] },
  { id: 'graphql', label: 'GraphQL', category: 'backend', x: 88, y: 36, size: 'small', connections: ['nodejs', 'postgresql'] },
  { id: 'grpc', label: 'gRPC', category: 'backend', x: 92, y: 44, size: 'small', connections: ['nodejs', 'python'] },
  { id: 'postgresql', label: 'PostgreSQL', category: 'backend', x: 80, y: 56, size: 'medium', connections: ['prisma', 'drizzle', 'fastapi'] },
  { id: 'prisma', label: 'Prisma', category: 'backend', x: 70, y: 62, size: 'small', connections: ['postgresql', 'typescript'] },
  { id: 'drizzle', label: 'Drizzle', category: 'backend', x: 88, y: 64, size: 'small', connections: ['postgresql', 'typescript'] },
  { id: 'mongodb', label: 'MongoDB', category: 'backend', x: 92, y: 54, size: 'small', connections: ['nodejs'] },
  { id: 'redis', label: 'Redis', category: 'backend', x: 94, y: 62, size: 'small', connections: ['nodejs'] },

  // Infrastructure (bottom) - moved up
  { id: 'docker', label: 'Docker', category: 'infrastructure', x: 35, y: 76, size: 'medium', connections: ['aws', 'github-actions', 'elk'] },
  { id: 'aws', label: 'AWS', category: 'infrastructure', x: 50, y: 82, size: 'medium', connections: ['docker', 'vercel', 'elk'] },
  { id: 'vercel', label: 'Vercel', category: 'infrastructure', x: 65, y: 76, size: 'small', connections: ['nextjs', 'aws', 'sentry', 'posthog'] },
  { id: 'github-actions', label: 'CI/CD', category: 'infrastructure', x: 26, y: 82, size: 'small', connections: ['docker'] },
  { id: 'sentry', label: 'Sentry', category: 'infrastructure', x: 74, y: 82, size: 'small', connections: ['vercel'] },
  { id: 'posthog', label: 'PostHog', category: 'infrastructure', x: 58, y: 88, size: 'small', connections: ['vercel'] },
  { id: 'elk', label: 'ELK Stack', category: 'infrastructure', x: 42, y: 88, size: 'small', connections: ['aws', 'docker'] },

  // Real-time (top right) - connected to AI agents
  { id: 'webrtc', label: 'WebRTC', category: 'realtime', x: 72, y: 16, size: 'large', connections: ['livekit', 'websockets', 'pipecat', 'twilio'] },
  { id: 'livekit', label: 'LiveKit', category: 'realtime', x: 82, y: 10, size: 'medium', connections: ['webrtc', 'pipecat', 'agents'] },
  { id: 'pipecat', label: 'Pipecat', category: 'realtime', x: 90, y: 20, size: 'medium', connections: ['webrtc', 'livekit', 'langchain', 'agents', 'python'] },
  { id: 'websockets', label: 'WebSockets', category: 'realtime', x: 62, y: 10, size: 'small', connections: ['webrtc', 'nodejs', 'javascript'] },
  { id: 'twilio', label: 'Twilio', category: 'realtime', x: 80, y: 24, size: 'small', connections: ['webrtc'] },

  // AI & Agents (top left) - connected to real-time
  { id: 'langchain', label: 'Langchain', category: 'ai', x: 28, y: 16, size: 'large', connections: ['langgraph', 'llamaindex', 'python', 'rag', 'agents', 'pipecat'] },
  { id: 'langgraph', label: 'LangGraph', category: 'ai', x: 18, y: 10, size: 'medium', connections: ['langchain', 'rag', 'agents'] },
  { id: 'llamaindex', label: 'LlamaIndex', category: 'ai', x: 38, y: 10, size: 'medium', connections: ['langchain', 'rag'] },
  { id: 'rag', label: 'RAG', category: 'ai', x: 24, y: 24, size: 'medium', connections: ['langchain', 'langgraph', 'llamaindex', 'agents'] },
  { id: 'huggingface', label: 'HuggingFace', category: 'ai', x: 10, y: 20, size: 'small', connections: ['langchain', 'python'] },
  { id: 'agents', label: 'Agents', category: 'ai', x: 50, y: 26, size: 'medium', connections: ['langchain', 'pipecat', 'livekit', 'langgraph', 'rag'] },
];

export const getNodeColor = (category: string): string => {
  return categoryColors[category]?.color || '#6366f1';
};

export const getNodeGlow = (category: string): string => {
  return categoryColors[category]?.glowColor || 'rgba(99, 102, 241, 0.4)';
};
