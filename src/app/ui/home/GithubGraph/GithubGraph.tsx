'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from '@styles/githubGraph.module.scss';
import dynamic from 'next/dynamic';
import Dropdown from '../Components/Dropdown/dropdown';

const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod),
  { ssr: false },
);

const GithubGraph = () => {
  const [loading, setIsLoading] = useState(true);
  const [gitHubYearList, setGithubYearList] = useState<number[]>([]);
  const [dropdownState, setDropdownState] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Access the scrollable container element using the ref
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && !loading) {
      const targetElement: HTMLDivElement | null =
        scrollContainer.querySelector(
          '.react-activity-calendar__scroll-container',
        );

      if (targetElement) {
        // Calculate the maximum scroll position
        const maxScrollLeft =
          targetElement.scrollWidth - targetElement.clientWidth;

        // Smoothly scroll to the right end of the target element
        targetElement.style.transition = 'scrollLeft 0.5s ease-in-out';
        targetElement.scrollLeft = maxScrollLeft;
        targetElement.style.paddingBottom = '10px';

        // Remove the transition after scrolling
        setTimeout(() => {
          targetElement.style.transition = '';
        }, 500); // Adjust the time as needed
      }
    }
  }, [loading]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.github} suppressHydrationWarning>
      <h1 className={styles.heading}>Year in Review: GitHub Activity</h1>
      <div className={styles.container} ref={scrollContainerRef}>
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
