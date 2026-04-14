import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity',
  description:
    'What Gokul JS is currently building, reading, and shipping — a living log of projects, experiments, and learning.',
  alternates: {
    canonical: 'https://gokuljs.com/activity',
  },
  openGraph: {
    title: 'Activity | Gokul JS',
    description:
      'What Gokul JS is currently building, reading, and shipping — a living log of projects, experiments, and learning.',
    url: 'https://gokuljs.com/activity',
    type: 'website',
    images: [
      {
        url: '/gokuljs.png',
        width: 1200,
        height: 630,
        alt: 'Activity | Gokul JS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Activity | Gokul JS',
    description:
      'What Gokul JS is currently building, reading, and shipping — a living log of projects, experiments, and learning.',
    site: '@gokul_js029',
    creator: '@gokul_js029',
  },
};

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
