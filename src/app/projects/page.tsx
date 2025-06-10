import React from 'react';

import Footer from '@/app/ui/home/Footer/Footer';
import { PinContainer } from '@/app/ui/components/3d-pin';
import { Spotlight } from '@/components/ui/spotlight-new';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full bg-black !pt-[30px]">
      <div className="hidden md:block">
        <Spotlight />
      </div>

      <div className="flex justify-center items-center ">
        <div className="container max-w-7xl min-h-screen px-4 !py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-24 mt-24 p-4 justify-items-center">
            {/* Project 1 with 3D Pin */}
            <div className="w-full max-w-sm mx-auto">
              <PinContainer
                title="Mailyx"
                href="https://getmailyx.com/"
                containerClassName="w-full h-auto"
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-black group w-80 h-fit rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: '0 0 15px rgba(245, 245, 245, 0.4)' }}
                  ></div>
                  <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden p-6">
                    <div className="h-50 w-full bg-center bg-no-repeat bg-cover bg-[url('/Mailyx.png')] mb-4"></div>
                    <div className="flex-1 flex flex-col justify-between !px-4 !py-2 !pb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-200/10 mb-2">
                          Mailyx
                        </h3>
                        <p className="text-stone-400 text-sm mb-4 line-clamp-3">
                          Minimalist AI email client with smart inbox, search,
                          and navigation.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className="!px-3 !py-1 flex gap-2 items-center bg-yellow-900/40 text-yellow-300 text-xs rounded-full border border-yellow-700/50">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                          Progress
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              </PinContainer>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <PinContainer
                title="Aerotime"
                href="https://www.aerotime.com/"
                containerClassName="w-full h-auto"
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-black group w-80 h-fit rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: '0 0 15px rgba(245, 245, 245, 0.4)' }}
                  ></div>
                  <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden p-6">
                    <div className="h-50 w-full bg-center bg-no-repeat bg-cover bg-[url('/video-poster.jpg')] mb-4"></div>
                    <div className="flex-1 flex flex-col justify-between !px-4 !py-2 !pb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-200/10  mb-2">
                          Aerotime
                        </h3>
                        <p className="text-stone-400 text-sm mb-4 line-clamp-3">
                          Smart calendar and scheduling tool to boost
                          productivity and focus.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex space-x-2">
                          <span className="!px-3 !py-1 flex gap-2 items-center bg-green-900/40 text-green-300 text-xs rounded-full border border-green-700/50">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Live
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              </PinContainer>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <PinContainer
                title="Teamble"
                href="https://teamble.com/"
                containerClassName="w-full h-auto"
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-black group w-80 h-fit rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: '0 0 15px rgba(245, 245, 245, 0.4)' }}
                  ></div>
                  <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden p-6">
                    <div className="h-50 w-full bg-center bg-no-repeat bg-cover bg-[url('/teambleBg.png')] mb-4"></div>
                    <div className="flex-1 flex flex-col justify-between !px-4 !py-2 !pb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-200/10  mb-2">
                          Teamble
                        </h3>
                        <p className="text-stone-400 text-sm mb-4 line-clamp-3">
                          Engagement platform to boost team culture, feedback,
                          and recognition.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex space-x-2">
                          <span className="!px-3 !py-1 flex gap-2 items-center bg-green-900/40 text-green-300 text-xs rounded-full border border-green-700/50">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Live
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              </PinContainer>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <PinContainer
                title="NotionFlow"
                href="https://notionflow-omega.vercel.app/"
                containerClassName="w-full h-auto"
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-black group w-80 h-fit rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: '0 0 15px rgba(245, 245, 245, 0.4)' }}
                  ></div>
                  <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden p-6">
                    <div className="h-50 w-full bg-center bg-no-repeat bg-cover bg-[url('/NotionFlow.png')] mb-4"></div>
                    <div className="flex-1 flex flex-col justify-between !px-4 !py-2 !pb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-200/10  mb-2">
                          NotionFlow
                        </h3>
                        <p className="text-stone-400 text-sm mb-4 line-clamp-3">
                          Collaborative workspace for notes, tasks, databases,
                          and seamless organization.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className="!px-3 !py-1 flex gap-2 items-center bg-green-900/40 text-green-300 text-xs rounded-full border border-green-700/50">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                          Live
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              </PinContainer>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <PinContainer
                title="Gsap Experiment"
                href="https://three-js-and-gasp.vercel.app/"
                containerClassName="w-full h-auto"
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-black group w-80 h-fit rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: '0 0 15px rgba(245, 245, 245, 0.4)' }}
                  ></div>
                  <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden p-6">
                    <div className="h-50 w-full bg-center bg-no-repeat bg-cover bg-[url('/gsap.png')] rounded-lg mb-4"></div>
                    <div className="flex-1 flex flex-col justify-between !px-4 !py-2 !pb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-200/10  mb-2">
                          Gsap Experiment
                        </h3>
                        <p className="text-stone-400 text-sm mb-4 line-clamp-3">
                          Its a Gsap Experiment with a lot of animations and
                          transitions.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex space-x-2">
                          <span className="!px-3 !py-1 flex gap-2 items-center bg-green-900/40 text-green-300 text-xs rounded-full border border-green-700/50">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Live
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              </PinContainer>
            </div>
            <div className="w-full max-w-sm mx-auto">
              <PinContainer
                title="Custom Gpt"
                href="https://custom-gpt-nine.vercel.app/"
                containerClassName="w-full h-auto"
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-black group w-80 h-fit rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: '0 0 15px rgba(245, 245, 245, 0.4)' }}
                  ></div>
                  <div className="relative h-full flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden p-6">
                    <div className="h-50 w-full bg-center bg-no-repeat bg-cover bg-[url('/customGpt.png')]  mb-4"></div>
                    <div className="flex-1 flex flex-col justify-between !px-4 !py-2 !pb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-200/10  mb-2">
                          Custom Gpt
                        </h3>
                        <p className="text-stone-400 text-sm mb-4 line-clamp-3">
                          A chatgpt clone with a custom ui and a custom backend.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex space-x-2">
                          <span className="!px-3 !py-1 flex gap-2 items-center bg-green-900/40 text-green-300 text-xs rounded-full border border-green-700/50">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Live
                          </span>
                        </div>
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
