'use client';
import React, { useState } from 'react';
import styles from '@styles/Skills.module.scss';
import { skillsWithRatings } from './constant';
const Skill: React.FC = () => {
  const [skills, setSkills] = useState(skillsWithRatings);
  console.log(skills);
  return (
    <div className={styles.skills}>
      <h1 className={styles.heading}>What I know</h1>
      <div className={styles.container}>
        {skills.map((item) => (
          <div key={item.name} className={styles.card}>
            <div className={styles.header}>{item.name.toLowerCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skill;
