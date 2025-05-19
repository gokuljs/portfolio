import React from 'react';
import styles from '@styles/hero.module.scss';
import Navbar from '../../components/Navbar';

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <Navbar />

      <div className={styles.content}>
        <div className={styles.mainTextContainer}>
          <h1 className={styles.mainText}>
            <div>EBENEZER</div>
            <div>CREATIVE</div>
            <div>DESIGNER</div>
            <div>DEVELOPER</div>
          </h1>
        </div>

        <div className={styles.descriptionContainer}>
          <p className={styles.description}>
            Ebenezer is a creative designer and developer, with over half a
            decade of experience in building innovative websites. He specializes
            in design and 3D on the web. Ebenezer approaches each project with
            multidisciplinary expertise and an uncompromising commitment to
            perfection.
          </p>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.tagline}>
          Let's create something incredible together.
        </p>
        <p className={styles.email}>ebenezer@creative.com</p>
      </footer>
    </div>
  );
};

export default Hero;
