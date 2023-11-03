'use client';
import React, { useEffect, useState } from 'react';
import styles from '@styles/githubGraph.module.scss';
import GitHubCalendar from 'react-github-calendar';
import { ScrollArea } from '@radix-ui/themes';

const GithubGraph = () => {
  const [loading, setIsLoading] = useState(true);
  useEffect(() => {
    const timeOutFn = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timeOutFn);
    };
  }, []);

  return (
    <div className={styles.github}>
      <h1></h1>
      <div className={styles.container}>
        <GitHubCalendar
          username="gokuljs"
          colorScheme="dark"
          blockSize={15}
          fontSize={12}
          loading={loading}
          style={{
            color: '#47536B',
          }}
        />
      </div>
    </div>
  );
};

export default GithubGraph;
