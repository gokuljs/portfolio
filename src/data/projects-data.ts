export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  status?: 'Live' | 'Progress';
 
}

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'Mailyx',
    description: 'Minimalist AI email client with smart inbox, search, and navigation.',
    image: '/Mailyx.png',
    tags: ['Next.js', 'AI', 'Tailwind'],
    link: 'https://getmailyx.com/',
    status: 'Progress'

  },
  {
    id: '2',
    title: 'Aerotime',
    description: 'Smart calendar and scheduling tool to boost productivity and focus.',
    image: '/video-poster.jpg',
    tags: ['Productivity', 'Calendar', 'React'],
    link: 'https://www.aerotime.com/',
    status: 'Live'
  
  },
  {
    id: '3',
    title: 'Teamble',
    description: 'Engagement platform to boost team culture, feedback, and recognition.',
    image: '/teambleBg.png',
    tags: ['Team Culture', 'Feedback', 'SaaS'],
    link: 'https://teamble.com/',
    status: 'Live'
  },
  {
    id: '4',
    title: 'NotionFlow',
    description: 'Collaborative workspace for notes, tasks, databases, and seamless organization.',
    image: '/NotionFlow.png',
    tags: ['Next.js', 'Notion', 'Workflow'],
    link: 'https://notionflow-omega.vercel.app/',
    status: 'Live'
  },
  {
    id: '5',
    title: 'Gsap Experiment',
    description: 'Its a Gsap Experiment with a lot of animations and transitions.',
    image: '/gsap.png',
    tags: ['GSAP', 'Animations', 'Three.js'],
    link: 'https://three-js-and-gasp.vercel.app/',
    status: 'Live'
  },
  {
    id: '6',
    title: 'Custom Gpt',
    description: 'A chatgpt clone with a custom ui and a custom backend.',
    image: '/customGpt.png',
    tags: ['OpenAI', 'Next.js', 'UI/UX'],
    link: 'https://custom-gpt-nine.vercel.app/',
    status: 'Live'
  }
];
