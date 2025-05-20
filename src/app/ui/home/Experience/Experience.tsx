import React from 'react';
import { Timeline } from '@/components/ui/timeline';
import Image from 'next/image';

export default function Experience() {
  const data = [
    {
      title: '2024',
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Nov 22 – Feb 24',
      content: (
        <div>
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex gap-2">
                <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700">
                  <img
                    src="/ae-logo.svg"
                    alt="Company Logo"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">
                    Aerotime Time
                  </h3>
                  <p className="text-xs text-neutral-400">Founding Engineer</p>
                </div>
              </div>
              <div className="flex items-center ml-auto !mt-2 ">
                <Image
                  src="/yx.svg"
                  height={125}
                  width={125}
                  alt="YC Logo"
                  className="object-contain "
                />
              </div>
            </div>
            <p className="text-sm font-normal text-neutral-300 !mt-2">
              San Francisco, California • Full-time • Remote
            </p>
            <p className="mt-4 text-sm font-normal text-neutral-200 leading-relaxed">
              Full-stack developer at TIFIN Wealth specializing in modern web
              architecture. Spearheaded frontend development using Next.js and
              React.js while driving backend integrations to enhance platform
              performance. Implemented Redux Toolkit for streamlined state
              management and created an ecosystem of reusable components to
              improve development efficiency. Integrated GraphQL and React Query
              for optimized data fetching while modernizing the platform through
              strategic codebase migrations. Enhanced user experience through
              responsive design implementation and systematic bug resolution.
            </p>
          </div>

          <div className="w-full !mt-2 h-fit">
            <img
              src="/tifin.png"
              alt="hero template"
              width={800}
              height={800}
              className="w-full rounded-lg border border-neutral-800 object-contain h-auto max-h-[400px]"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Nov 21 - Nov 22',
      content: (
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700">
                <img
                  src="/tifin-logo.svg"
                  alt="Company Logo"
                  className="w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-base font-medium text-white">
                  TIfin Fintech
                </h3>
                <p className="text-xs text-neutral-400">Software Engineer</p>
              </div>
            </div>
            <p className="text-sm font-normal text-neutral-300 !mt-2">
              Bangalore, India • Full-time
            </p>
            <p className="!mt-2 text-sm font-normal text-neutral-200 leading-relaxed">
              Full-stack developer at TIFIN Wealth specializing in modern web
              architecture. Spearheaded frontend development using Next.js and
              React.js while driving backend integrations to enhance platform
              performance. Implemented Redux Toolkit for streamlined state
              management and created an ecosystem of reusable components to
              improve development efficiency. Integrated GraphQL and React Query
              for optimized data fetching while modernizing the platform through
              strategic codebase migrations. Enhanced user experience through
              responsive design implementation and systematic bug resolution.
            </p>
          </div>

          <div className="w-full !mt-4 h-fit">
            <img
              src="/tifin.png"
              alt="hero template"
              width={800}
              height={800}
              className="w-full rounded-lg border border-neutral-800 object-contain h-auto max-h-[400px]"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
