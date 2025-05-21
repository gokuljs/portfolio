'use client';
import React from 'react';
import { FloatingDock } from '@/components/ui/floating-dock';
import { IconBrandGithub, IconBrandX } from '@tabler/icons-react';

export function FloatingDockDemo() {
  const links = [
    {
      title: 'Twitter',
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: 'https://twitter.com/gokul_i',
    },
    {
      title: 'GitHub',
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: 'https://github.com/gokuljs',
    },
    {
      title: 'LinkedIn',
      icon: (
        // Using IconBrandX as a dummy placeholder as IconBrandLinkedin is not imported
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: 'https://www.linkedin.com/in/gokuljs/',
    },
    {
      title: 'Substack',
      icon: (
        // Using IconBrandX as a dummy placeholder as a specific Substack icon or IconWriting is not imported
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#', // Replace with actual Substack link
    },
    {
      title: 'Gmail',
      icon: (
        // Using IconBrandX as a dummy placeholder as IconMail is not imported
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: 'mailto:jsgokul123@gmail.com',
    },
  ];
  return (
    <div className="flex items-center justify-center  w-full">
      <FloatingDock
        mobileClassName="!translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}
