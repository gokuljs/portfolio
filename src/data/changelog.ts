export interface ChangelogContentBlock {
  type: 'paragraph' | 'image' | 'code' | 'list' | 'heading';
  content?: string;
  caption?: string; // For images
  language?: string; // For code blocks
  items?: string[]; // For lists
}

export interface ChangelogEntry {
  id: string;
  title: string;
  date: string;
  category: 'feature' | 'update' | 'fix' | 'design' | 'learning' | 'experiment';
  summary: string;
  content: ChangelogContentBlock[];
  tags: string[];
  featured?: boolean;
  status: 'published' | 'draft';
}

export const changelogEntries: ChangelogEntry[] = [
  {
    id: 'changelog-system-launch',
    title: 'Launched the Changelog System',
    date: '2024-01-15',
    category: 'feature',
    summary:
      'Built a comprehensive changelog system to track my development journey and share insights with the community.',
    content: [
      {
        type: 'paragraph',
        content:
          "I've been thinking about building a proper way to document my journey as I build and experiment with new technologies. This changelog system will be where I share what I'm working on, what I'm learning, and the process behind the projects I build.",
      },
      {
        type: 'heading',
        content: 'Key Features',
      },
      {
        type: 'list',
        items: [
          'Rich content support - paragraphs, images, code snippets',
          'Category-based filtering (features, updates, fixes, learning)',
          'Tag-based organization',
          'Responsive design that works on all devices',
          'Clean, readable typography optimized for long-form content',
        ],
      },
      {
        type: 'paragraph',
        content:
          'The system is built with Next.js 15, TypeScript, and uses a modular SCSS approach for styling. I wanted something that could scale as my content grows but remains fast and accessible.',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `interface ChangelogEntry {
  id: string;
  title: string;
  date: string;
  category: 'feature' | 'update' | 'fix' | 'design' | 'learning';
  content: ChangelogContentBlock[];
  tags: string[];
}`,
      },
      {
        type: 'paragraph',
        content:
          'Looking forward to sharing more updates here as I continue building and learning!',
      },
    ],
    tags: ['nextjs', 'typescript', 'portfolio', 'changelog'],
    featured: true,
    status: 'published',
  },
  {
    id: 'portfolio-redesign-2024',
    title: 'Portfolio Redesign with Modern Stack',
    date: '2024-01-10',
    category: 'design',
    summary:
      'Completely rebuilt my portfolio with Next.js 15, modern animations, and a focus on performance.',
    content: [
      {
        type: 'paragraph',
        content:
          'After using the same portfolio design for over a year, I decided it was time for a complete rebuild. The old site served its purpose, but I wanted something that better reflected my current skills and aesthetic preferences.',
      },
      {
        type: 'heading',
        content: 'Technology Choices',
      },
      {
        type: 'paragraph',
        content:
          'I chose Next.js 15 for its excellent developer experience and performance optimizations. The app router provides clean URL structure, and the built-in optimizations help with SEO and loading times.',
      },
      {
        type: 'list',
        items: [
          'Next.js 15 with App Router',
          'TypeScript for type safety',
          'Tailwind CSS + SCSS modules for styling',
          'Framer Motion for animations',
          'Radix UI for accessible components',
        ],
      },
      {
        type: 'paragraph',
        content:
          'The design focuses on clean typography, subtle animations, and showcasing projects effectively. I wanted visitors to quickly understand what I do and see examples of my work.',
      },
    ],
    tags: ['nextjs', 'redesign', 'tailwind', 'typescript'],
    status: 'published',
  },
  {
    id: 'learning-system-design',
    title: 'Deep Dive into System Design Patterns',
    date: '2024-01-05',
    category: 'learning',
    summary:
      'Spending time learning about scalable system architecture, distributed systems, and design patterns used by large-scale applications.',
    content: [
      {
        type: 'paragraph',
        content:
          "As I work on more complex projects, I've realized the importance of understanding system design principles. This week I've been diving deep into how large-scale applications handle millions of users and massive amounts of data.",
      },
      {
        type: 'heading',
        content: "Key Concepts I'm Exploring",
      },
      {
        type: 'list',
        items: [
          'Load balancing strategies and when to use each type',
          'Database sharding and replication patterns',
          'Caching layers (Redis, CDN, application-level)',
          'Microservices architecture vs monolithic design',
          'Message queues and event-driven architecture',
        ],
      },
      {
        type: 'paragraph',
        content:
          "I'm planning to apply these concepts in my next project - a real-time collaboration tool that needs to handle concurrent users and real-time updates efficiently.",
      },
    ],
    tags: ['system-design', 'learning', 'architecture', 'scalability'],
    status: 'published',
  },
];

export const categories = [
  { value: 'all', label: 'All Updates' },
  { value: 'feature', label: 'New Features' },
  { value: 'update', label: 'Updates' },
  { value: 'fix', label: 'Bug Fixes' },
  { value: 'design', label: 'Design' },
  { value: 'learning', label: 'Learning' },
  { value: 'experiment', label: 'Experiments' },
];

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  changelogEntries.forEach((entry) => {
    entry.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};
