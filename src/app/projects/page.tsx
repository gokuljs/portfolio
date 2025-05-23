import React from 'react';

import Navbar from '@/app/ui/components/Navbar';
import Footer from '@/app/ui/home/Footer/Footer';
import { PinContainer } from '@/app/ui/components/3d-pin';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full bg-black">
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="container max-w-full min-h-screen px-4 !py-18">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mt-24">
            {/* Project 1 with 3D Pin */}
            <div className="h-96 w-full flex items-center justify-center">
              <PinContainer
                title="Mailyx"
                href="https://getmailyx.com/"
                containerClassName="w-full h-full flex items-center justify-center"
              >
                <div className="relative  overflow-hidden  bg-gradient-to-r from-gray-900 to-black  group w-96">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: '0 0 15px rgba(245, 245, 245, 0.4)' }}
                  ></div>
                  <div className="relative h-full !min-h-[400px] flex flex-col  bg-gradient-to-b from-gray-900 to-black overflow-hidden p-6">
                    <div className="!h-[15.5rem] w-full bg-center bg-no-repeat bg-cover bg-[url('/Mailyx.png')]"></div>
                    <div className="!h-[30%] !p-4 flex flex-col justify-between gap-2">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Mailyx
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Minimalist AI email client with smart inbox, search, and
                        navigation.
                      </p>
                      <div className="flex space-x-2 mt-4">
                        <span className="!px-2 !py-1 flex gap-2 items-center justify-center bg-yellow-900/40 text-yellow-300 text-xs rounded-full border border-yellow-700/50 flex items-center ">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1 animate-pulse"></span>
                          Progress
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
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
