import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Products, tools, and experiments built and shipped by Gokul JS — real-time AI systems, voice agents, web platforms, and more.',
  alternates: {
    canonical: 'https://gokuljs.com/projects',
  },
  openGraph: {
    title: 'Projects | Gokul JS',
    description:
      'Products, tools, and experiments built and shipped by Gokul JS — real-time AI systems, voice agents, web platforms, and more.',
    url: 'https://gokuljs.com/projects',
    type: 'website',
    images: [
      {
        url: '/gokuljs.png',
        width: 1200,
        height: 630,
        alt: 'Projects | Gokul JS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Gokul JS',
    description:
      'Products, tools, and experiments built and shipped by Gokul JS — real-time AI systems, voice agents, web platforms, and more.',
    site: '@gokul_js029',
    creator: '@gokul_js029',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
