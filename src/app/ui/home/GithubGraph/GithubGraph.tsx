'use client';
import React, { useEffect, useState } from 'react';
import styles from '@styles/githubGraph.module.scss';
import GitHubCalendar from 'react-github-calendar';

const GithubGraph = () => {
  const [loading, setIsLoading] = useState(true);
  const [gitHubYearList, setGithubYearList] = useState<Number[]>([]);
  useEffect(() => {
    const arr = [];
    for (let i = new Date().getFullYear(); i >= 2019; i--) {
      arr.push(i);
    }
    setGithubYearList([...arr]);
  }, []);

  console.log(gitHubYearList);

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
      <h1 className={styles.heading}>Year in Review: GitHub Activity</h1>
      <div className={styles.container}>
        <GitHubCalendar
          username="gokuljs"
          colorScheme="dark"
          blockSize={15}
          fontSize={12}
          loading={loading}
          theme={{
            light: ['#161b22', '#b8b9f8', '#7e7ef1', '#6768c9', '#5051a1'],
            dark: ['#161b22', '#E5D8F7', '#BD9EEB', '#8E55E0', '#6000A6'],
          }}
          style={{
            color: '#F7F7F7',
          }}
        />
      </div>
    </div>
  );
};

export default GithubGraph;
