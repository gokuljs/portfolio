import React from 'react';
import styles from '@styles/hero.module.scss';
import Navbar from '../../components/Navbar';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <Navbar />
      <div></div>
      <div className={styles.content}>
        <div className={styles.mainTextContainer}>
          <h1 className={styles.mainText}>
            <div>GOKUL JS</div>
            <div>EX - YC</div>
            <div>GENERALIST</div>
            <div>DEVELOPER</div>
          </h1>
        </div>

        <div className={styles.descriptionContainer}>
          <p className={styles.description}>
            Gokul is an ex-founding engineer and creative generalist with a
            track record of turning early-stage ideas into real products. He’s
            built scalable web platforms, intelligent agent systems, and handled
            everything from system architecture to user feedback. At YC-backed
            startups, he’s contributed across engineering, product, and design
            to launch tools that actually get used. He thrives in fast-moving
            environments where speed matters and “not my job” doesn’t exist.
          </p>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.tagline}>
          Let's create something incredible together.
        </p>
        <p className={styles.email}>jsgokul123@gmail.com</p>
      </footer>
    </div>
  );
};

export default Hero;
