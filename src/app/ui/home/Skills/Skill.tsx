import React from 'react';
import styles from '@styles/Skills.module.scss';
const Skill: React.FC = () => {
  const skills = [
    {
      topic: 'Programming Languages',
      contents: [
        { name: 'JavaScript', proficiency: 'Advanced' },
        { name: 'TypeScript', proficiency: 'Intermediate' },
        { name: 'Python', proficiency: 'Intermediate' },
        { name: 'HTML', proficiency: 'Advanced' },
        { name: 'CSS', proficiency: 'Advanced' },
        { name: 'Sass', proficiency: 'Intermediate' },
      ],
    },
    {
      topic: 'Frontend Development',
      contents: [
        { name: 'React JS', proficiency: 'Advanced' },
        { name: 'Next JS', proficiency: 'Intermediate' },
        { name: 'Vite', proficiency: 'Basic' },
        { name: 'Gatsby', proficiency: 'Basic' },
        { name: 'Redux', proficiency: 'Advanced' },
      ],
    },
    {
      topic: 'Backend Development',
      contents: [
        { name: 'Node.js', proficiency: 'Advanced' },
        { name: 'Express.js', proficiency: 'Advanced' },
      ],
    },
    {
      topic: 'Machine Learning and AI Fine-Tuning',
      contents: [
        { name: 'LLaMA', proficiency: 'Basic' },
        { name: 'Stable Diffusion', proficiency: 'Basic' },
      ],
    },
    {
      topic: 'Cloud Services (AWS)',
      contents: [
        { name: 'Amazon S3', proficiency: 'Advanced' },
        { name: 'Amazon EFS', proficiency: 'Intermediate' },
        { name: 'Amazon SageMaker', proficiency: 'Basic' },
        { name: 'AWS Lambda', proficiency: 'Intermediate' },
        { name: 'AWS Amplify', proficiency: 'Basic' },
      ],
    },
    {
      topic: 'Content Management Systems',
      contents: [
        { name: 'Strapi', proficiency: 'Intermediate' },
        { name: 'Sanity', proficiency: 'Intermediate' },
      ],
    },
    {
      topic: 'Version Control Systems',
      contents: [
        { name: 'GitHub', proficiency: 'Advanced' },
        { name: 'GitLab', proficiency: 'Intermediate' },
      ],
    },
  ];

  return (
    <div className={styles.skills}>
      <h1 className={styles.heading}>What I know</h1>
      <div className={styles.container}></div>
    </div>
  );
};

export default Skill;
