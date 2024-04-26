import React from 'react';
import styles from '@styles/displayCard.module.scss';

interface DisplayCardProps {
  url: string;
  title: string;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ url, title }) => {
  return (
    <div className={styles.displayCard}>
      <iframe src={url} allowFullScreen />
    </div>
  );
};

export default DisplayCard;
