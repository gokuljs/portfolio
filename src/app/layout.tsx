import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@styles/globals.scss';
import Navbar from './ui/home/Navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gokul JS - Tech Innovator & Engineer',
  description:
    'Discover the portfolio of Gokul, an innovative tech professional with a track record of success as a Founding Engineer at AeroTime, Y Combinator W21. Explore my contributions to cutting-edge technology solutions, my skill set in modern web development, and the projects that showcase my journey in the tech industry.',
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
