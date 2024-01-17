import React from 'react';
import styles from '@styles/projects.module.scss';

const Page = () => {
  return (
    <div className={styles.projects}>
      <div className={styles.projectSection}>
        <div className={styles.card}>card</div>
        <div className={styles.card}>card</div>
        <div className={styles.card}>card</div>
      </div>
    </div>
  );
};

export default Page;
