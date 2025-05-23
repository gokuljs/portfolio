import React from 'react';

import Navbar from '@/app/ui/components/Navbar';
import Footer from '@/app/ui/home/Footer/Footer';
import { PinContainer } from '@/app/ui/components/3d-pin';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="container max-w-full min-h-screen px-4 !py-18 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mt-24">
            {/* Project Cards Container */}
            <div className="flex items-stretch w-full">
              <PinContainer
                title="Project 1"
                href="https://github.com/yourusername/project1"
                containerClassName="w-full h-full"
              >
                <div className="flex flex-col h-full items-start p-4 w-96">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Project Title
                  </h3>
                  <p className="text-neutral-200 text-sm mb-4">
                    Project description goes here with a brief overview of what
                    this project does.
                  </p>
                  <div className="flex space-x-2 mt-auto">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      React
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Tailwind
                    </span>
                  </div>
                </div>
              </PinContainer>
            </div>

            {/* Project 2 */}
            <div className="flex items-stretch w-full">
              <PinContainer
                title="Project 2"
                href="https://github.com/yourusername/project2"
                containerClassName="w-full h-full"
              >
                <div className="flex flex-col h-full items-start p-4 w-96">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Portfolio Website
                  </h3>
                  <p className="text-neutral-200 text-sm mb-4">
                    A modern portfolio showcasing my skills and projects with
                    interactive elements.
                  </p>
                  <div className="flex space-x-2 mt-auto">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Next.js
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Tailwind
                    </span>
                  </div>
                </div>
              </PinContainer>
            </div>

            {/* Project 3 */}
            <div className="flex items-stretch w-full">
              <PinContainer
                title="Project 3"
                href="https://github.com/yourusername/project3"
                containerClassName="w-full h-full"
              >
                <div className="flex flex-col h-full items-start p-4 w-96">
                  <h3 className="text-xl font-bold text-white mb-2">
                    E-Commerce App
                  </h3>
                  <p className="text-neutral-200 text-sm mb-4">
                    A full-stack e-commerce application with user authentication
                    and payment processing. This project includes multiple
                    features and integration with third-party services.
                  </p>
                  <div className="flex space-x-2 mt-auto">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      MongoDB
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Express
                    </span>
                  </div>
                </div>
              </PinContainer>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
