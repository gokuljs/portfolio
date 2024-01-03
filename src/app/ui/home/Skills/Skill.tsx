'use client';
import React, { useEffect, useState } from 'react';
import styles from '@styles/Skills.module.scss';
import { skillsWithRatings } from './constant';
export type SkillProps = {
  category: string;
  contents: {
    name: string;
    category: string;
    rating: number;
  }[];
};
const Skill: React.FC = () => {
  const [skills, setSkills] = useState<null | SkillProps[]>();

  useEffect(() => {
    const skills = [...new Set(skillsWithRatings.map((item) => item.category))];
    setSkills(
      skills.map((item) => ({
        category: item,
        contents: skillsWithRatings.filter((value) => value.category === item),
      })),
    );
  }, []);
  return (
    <div className={styles.skills} id="skills">
      <div className={styles.contain}>
        <h1 className={styles.heading}>What I know</h1>
        <div className={styles.container}>
          {skills?.map((item, index) => (
            <section key={index} className={styles.category}>
              <h2>{item.category}</h2>
              <div className={styles.items}>
                {item.contents.map((item, index) => (
                  <span key={index}>{item.name}</span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skill;
