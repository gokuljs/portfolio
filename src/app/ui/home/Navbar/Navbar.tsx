import React from 'react';
import styles from '@styles/navar.module.scss';
import { PinBottomIcon } from '@radix-ui/react-icons';

const Navbar = () => {
  return (
    <div className={styles.Navbar}>
      <div className={styles.logo}></div>
      <div className={styles.items}>
        <div className={styles.Resume}>
          <span>
            Download CV <PinBottomIcon className={styles.icon} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
