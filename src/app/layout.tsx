import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@styles/globals.scss';
import VisitTracker from '@/components/VisitTracker';
import { Analytics } from '@vercel/analytics/next';
import Navbar from './ui/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

const DESCRIPTION =
  'Gokul JS — ex-YC founding engineer (W21). I build real-time AI systems, voice agents, and scalable web products. Writing about LLMs, WebRTC, and full-stack engineering.';

export const metadata: Metadata = {
  metadataBase: new URL('https://gokuljs.com'),
  title: 'Gokul JS - Ex-YC Alumnus W21',
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://gokuljs.com',
  },
  icons: {
    icon: '/newLogo.svg',
    apple: '/newLogo.svg',
  },
  openGraph: {
    title: 'Gokul JS - Ex-YC Alumnus W21',
    description: DESCRIPTION,
    url: 'https://gokuljs.com',
    images: [
      {
        url: '/gokuljs.png',
        width: 1200,
        height: 630,
        alt: 'Gokul JS - Ex-YC Alumnus W21',
      },
    ],
    type: 'website',
    siteName: 'Gokul JS Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gokul JS - Ex-YC Alumnus W21',
    description: DESCRIPTION,
    images: ['/gokuljs.png'],
  },
  keywords: [
    'Gokul JS',
    'Founding Engineer',
    'Y Combinator W21',
    'YC Alumni',
    'Full Stack Engineer',
    'AI Engineer',
    'Real-Time Voice Agent',
    'LLM Engineer',
    'WebRTC',
    'LiveKit',
    'Next.js',
    'React',
    'TypeScript',
    'Python',
    'Node.js',
    'AWS',
    'Vercel',
    'Prompt Engineering',
    'Speech-to-Text',
    'Text-to-Speech',
    'Startup Engineer',
    'Software Engineer Portfolio',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
