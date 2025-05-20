import React from 'react';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
} from '@tabler/icons-react';
import { Newspaper } from 'lucide-react'; // Using Newspaper icon from lucide-react for Substack
import styles from './SocialDock.module.scss';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/gokuljs', // Replace with your GitHub URL
    icon: <IconBrandGithub size={24} />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/gokul-js/', // Replace with your LinkedIn URL
    icon: <IconBrandLinkedin size={24} />,
  },
  {
    name: 'Twitter',
    url: 'https://x.com/gokul_js029', // Replace with your Twitter URL
    icon: <IconBrandTwitter size={24} />,
  },
  {
    name: 'Substack',
    url: 'https://substack.com/@gokuljs', // Replace with your Substack URL
    icon: <Newspaper size={24} />,
  },
  {
    name: 'Gmail',
    url: 'mailto:jsgokul123@gmail.com',
    icon: <IconMail size={24} />,
  },
];

const SocialDock: React.FC = () => {
  return (
    <div className={styles.socialDock}>
      <GlowingEffect
        spread={90}
        borderWidth={2}
        glow={true}
        disabled={false}
        proximity={44}
        inactiveZone={0.01}
        variant="white"
      />
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          className={styles.socialLink}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialDock;
