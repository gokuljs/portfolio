'use client';
import React, { useEffect, useState } from 'react';
import styles from '@styles/githubGraph.module.scss';
import dynamic from 'next/dynamic';
import Dropdown from '../Components/Dropdown/dropdown';
import { initSuperflow } from '@usesuperflow/client';

const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod),
  { ssr: false },
);

const GithubGraph = () => {
  const [loading, setIsLoading] = useState(true);
  const [gitHubYearList, setGithubYearList] = useState<number[]>([]);
  const [dropdownState, setDropdownState] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  useEffect(() => {
    const arr = [];
    for (let i = new Date().getFullYear(); i >= 2019; i--) {
      arr.push(i);
    }
    setGithubYearList([...arr]);
  }, []);

  useEffect(() => {
    const timeOutFn = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timeOutFn);
    };
  }, []);

  // initSuperflow('VbjQjpBkhVMpTD1tGncR', {
  //   projectId: '948158540742083',
  // });
  useEffect(() => {
    //initialize Superflow
    console.log('continouse render');
    initSuperflow('VbjQjpBkhVMpTD1tGncR', {
      projectId: '948158540742083',
    });
  });

  return (
    <div className={styles.github}>
      <h1 className={styles.heading}>Year in Review: GitHub Activity</h1>
      <div className={styles.container}>
        <div className={styles.dropdown}>
          <Dropdown
            dropdownState={dropdownState}
            setDropdownState={setDropdownState}
            options={gitHubYearList}
            value={selectedYear}
            setValue={setSelectedYear}
          />
        </div>
        <GitHubCalendar
          username="gokuljs"
          year={selectedYear ? selectedYear : undefined}
          colorScheme="dark"
          blockSize={15}
          fontSize={12}
          loading={loading}
          theme={{
            light: ['#F0F1F4', '#b8b9f8', '#7e7ef1', '#6768c9', '#5051a1'],
            dark: ['#F0F1F4', '#E5D8F7', '#BD9EEB', '#8E55E0', '#6000A6'],
          }}
          style={{
            color: '#181819',
          }}
        />
      </div>
    </div>
  );
};

export default GithubGraph;
