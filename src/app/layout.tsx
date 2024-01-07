import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@styles/globals.scss';
import Navbar from './ui/home/Navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gokul JS - Ex-YC Alumnus W21',
  description:
    'Discover the portfolio of Gokul, an innovative tech professional with a track record of success as a Founding Engineer at AeroTime, Y Combinator W21. Explore my contributions to cutting-edge technology solutions, my skill set in modern web development, and the projects that showcase my journey in the tech industry.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
