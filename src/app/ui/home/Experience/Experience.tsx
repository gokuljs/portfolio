import React from 'react';
import styles from '@styles/Experience.module.scss';
import clsx from 'clsx';
import Image from 'next/image';
const Experience = () => {
  return (
    <div className={styles.Experience} id="experience">
      <h1 className={styles.heading}>Professional Experience</h1>
      <div className={styles.timeline}>
        <div className={clsx(styles.container, styles.leftContainer)}>
          <Image
            className={styles.company}
            src="/ae-logo.svg"
            width={40}
            height={40}
            alt="Gokul JS"
          />
          <div className={styles.textBox}>
            <h2>Aerotime, Y Combinator (W21) | Founding Engineer</h2>
            <small>Nov 2022 – Nov 2023 | San Francisco, California</small>

            <span className={styles.leftArrow}></span>
          </div>
        </div>
        <div className={clsx(styles.container, styles.rightContainer)}>
          <Image
            className={styles.company}
            src="/tifin.jpeg"
            width={40}
            height={40}
            alt="Gokul JS"
          />
          <div className={styles.textBox}>
            <h2>Tifin Fintech (Previously 1stMain)</h2>
            <small>Mar 2022 – Nov 2022 | Bangalore, India</small>

            <span className={styles.rightArrow}></span>
          </div>
        </div>
        <div className={clsx(styles.container, styles.leftContainer)}>
          <Image
            className={styles.company}
            src="/1stmain_logo.jpeg"
            width={40}
            height={40}
            alt="Gokul JS"
          />
          <div className={styles.textBox}>
            <h2>1stMain</h2>
            <small>Nov 2021 – Feb 2022 | Bangalore, India</small>

            <span className={styles.leftArrow}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
