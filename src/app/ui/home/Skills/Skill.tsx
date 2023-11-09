'use client';
import React, { useState } from 'react';
import styles from '@styles/Skills.module.scss';
import { skillsWithRatings } from './constant';
import * as Slider from '@radix-ui/react-slider';
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
            <Slider.Root
              className={styles.SliderRoot}
              defaultValue={[item.rating]}
              max={10}
              step={1}
              disabled
            >
              <Slider.Track className={styles.SliderTrack}>
                <Slider.Range className={styles.SliderRange} />
              </Slider.Track>
            </Slider.Root>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skill;
