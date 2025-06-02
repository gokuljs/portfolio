import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@styles/globals.scss';
import VisitTracker from '@/components/VisitTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gokul JS - Ex-YC Alumnus W21',
  description:
    "I'm a former founding engineer and creative generalist with a track record of turning early-stage ideas into real products. I've built scalable web platforms, intelligent agent systems, and handled everything from system architecture to user feedback. At YC-backed startups, I've contributed across engineering, product, and design to launch tools that actually get used. I thrive in fast-moving environments where speed matters and \"not my job\" doesn't exist.",
  icons: {
    icon: '/newLogo.svg',
    apple: '/newLogo.svg',
  },
  keywords: [
    'Gokul JS',
    'Aerotime',
    'Software Engineer',
    'Founding Engineer',
    'Y Combinator Alumnus',
    'Web Development',
    'JavaScript Expert',
    'Full Stack Developer',
    'Startup Consultant',
    'Entrepreneur',
    'Tech Speaker',
    'Product Development',
    'User Experience Design',
    'React',
    'Node.js',
    'AWS',
    'Yc',
    'JavaScript',
    'TypeScript',
    'Python',
    'HTML',
    'CSS',
    'Sass',
    'Vite',
    'Radix',
    'SolidJS',
    'React JS',
    'Next JS 14',
    'Gatsby JS',
    'Redux',
    'Tailwind CSS',
    'Material UI',
    'Bootstrap',
    'Node.js',
    'Express',
    'AWS S3',
    'AWS SageMaker',
    'GitHub CI/CD',
    'TypeORM',
    'SQL',
    'AWS EFS',
    'GPT-3.5',
    'GPT-4',
    'Llama',
    'Stable Diffusion',
    'Prompt Engineering',
    'Git',
    'GitHub',
    'Frontend',
    'Backend',
    'Open Source',
    'Engineer',
    'writer',
    'builder',
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <VisitTracker />
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
