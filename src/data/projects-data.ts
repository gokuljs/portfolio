export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
}

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'NotionFlow',
    description: 'A powerful workflow automation tool built for Notion power users. Streamline your database management with advanced filtering and batch operations.',
    image: '/NotionFlow.png',
    tags: ['Next.js', 'Tailwind', 'Notion API'],
    link: '#',
    github: '#'
  },
  {
    id: '2',
    title: 'Mailyx',
    description: 'Next-generation email marketing platform with integrated AI for content generation and predictive analytics for campaign performance.',
    image: '/Mailyx.png',
    tags: ['React', 'Node.js', 'OpenAI'],
    link: '#',
    github: '#'
  },
  {
    id: '3',
    title: 'Teamble',
    description: 'A collaborative workspace for remote teams focusing on real-time communication and project tracking with a focus on developer experience.',
    image: '/teambleBg.png',
    tags: ['TypeScript', 'Socket.io', 'GSAP'],
    link: '#',
    github: '#'
  },
  {
    id: '4',
    title: 'NotionFlow Pro',
    description: 'The advanced version of NotionFlow featuring multi-workspace support, team collaboration tools, and custom automation scripts.',
    image: '/NotionFlow.png',
    tags: ['Next.js', 'PostgreSQL', 'Redis'],
    link: '#',
    github: '#'
  },
  {
    id: '5',
    title: 'Mailyx Analytics',
    description: 'Real-time dashboard for Mailyx campaigns providing deep insights into user behavior, conversion rates, and A/B test results.',
    image: '/Mailyx.png',
    tags: ['React', 'D3.js', 'AWS'],
    link: '#',
    github: '#'
  },
  {
    id: '6',
    title: 'Teamble Mobile',
    description: 'The mobile companion app for Teamble, enabling teams to stay connected and manage projects on the go with push notifications.',
    image: '/teambleBg.png',
    tags: ['React Native', 'Firebase', 'Expo'],
    link: '#',
    github: '#'
  }
];
