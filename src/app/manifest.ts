import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gokul JS',
    short_name: 'Gokul JS',
    description:
      'Ex-YC founding engineer (W21) building real-time AI systems, voice agents, and scalable web products.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0C0C',
    theme_color: '#0C0C0C',
    icons: [
      {
        src: '/newLogo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
