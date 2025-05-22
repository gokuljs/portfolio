import React from 'react';
import Link from 'next/link';
import styles from '@styles/page.module.scss';
import Navbar from '@/app/ui/components/Navbar';
import Footer from '@/app/ui/home/Footer/Footer';

export default function ProjectsPage() {
  return (
    <div className={styles.homePage}>
      <Navbar />

      <section className="min-h-screen bg-black py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12 md:mb-20">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="mt-4 text-neutral-400">
              A showcase of my personal and professional projects in software
              development.
            </p>
          </div>

          {/* Project grid/list will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample project card - You can replace with your actual project data */}
            <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all">
              <div className="h-48 bg-zinc-800"></div>
              <div className="p-4">
                <h3 className="text-white text-xl font-medium">
                  Project Title
                </h3>
                <p className="text-zinc-400 mt-2">
                  Short description of the project and technologies used.
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href="#"
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-full text-zinc-300"
                  >
                    View Project
                  </Link>
                  <Link
                    href="#"
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-full text-zinc-300"
                  >
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
