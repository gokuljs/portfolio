import React from 'react';
import styles from '@styles/Skills.module.scss';
const Skill: React.FC = () => {
  const skills = [
    { category: 'languages', skills: ['Javascript', 'Typescript', 'Python'] },
    {
      category: 'frontend',
      skills: [
        'Html',
        'Vite',
        'Css',
        'Sass',
        'React JS',
        'Next JS 14',
        'Gatsby Js',
        'Redux',
      ],
    },
    {
      category: 'backend',
      skills: ['Node.js', 'Express', 'Aws s3', 'Aws sagemaker', 'Aws efs'],
    },
    {
      category: 'LLM',
      skills: [
        'GPT-3.5',
        'GPT-4',
        'Llama',
        'Stable diffusion',
        'Prompt engineering',
      ],
    },
    { category: 'Version control system', skills: ['git', 'github', 'gitlab'] },
    { category: 'cms', skills: ['strapi', 'sanity'] },

    {
      category: 'Currently exploring',
      skills: [
        'micro services',
        'Kubernetes',
        'Docker',
        'Video based llm',
        'mistral 7b',
        'mistral',
        'Whisper',
      ],
    },
  ];

  return (
    <div className={styles.skills}>
      <h1 className={styles.heading}>What I know</h1>
      <div className={styles.container}>
        {skills.map((item) => (
          <div className={styles.card}>
            <div className={styles.header}>{item.category}</div>
            <div className={styles.cards}>
              {item.skills.map((item) => (
                <div className={styles.box}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skill;
