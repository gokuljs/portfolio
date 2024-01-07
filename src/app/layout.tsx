import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@styles/globals.scss';
import Navbar from './ui/home/Navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gokul JS',
  description: 'Ex-Founding Engineer at AeroTime, YC W21',
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
