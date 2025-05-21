'use client';
import React, { useEffect, useState } from 'react';
import styles from '@styles/Skills.module.scss';
import { skillsWithRatings } from './constant';
import { GlowingEffect } from '@/components/ui/glowing-effect';
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
        <h1 className={styles.radialGradientHeading}>What I know</h1>
        <div className={styles.container}>
          {skills?.map((item, index) => (
            <div className={styles.categoryContainer}>
              <GlowingEffect
                spread={80}
                borderWidth={1}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                variant="white"
              />
              <section key={index} className={styles.category}>
                <h2>{item.category}</h2>
                <div className={styles.items}>
                  {item.contents
                    .sort((a, b) => a.name.length - b.name.length)
                    .map((item, index) => (
                      <span
                        key={index}
                        style={{
                          userSelect: 'none',
                        }}
                      >
                        {item.name}
                      </span>
                    ))}
                </div>
              </section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skill;
