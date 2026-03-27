'use client';
import React from 'react';
import { motion } from 'motion/react';
import styles from '@styles/Skills.module.scss';
import { skills } from './constant';

const CATEGORY_COLORS: Record<string, string> = {
  Languages:            '#60a5fa',
  Frontend:             '#a78bfa',
  Backend:              '#34d399',
  Infrastructure:       '#fb923c',
  'Real-time':          '#f472b6',
  'AI Agents':          '#facc15',
};

const categories = (() => {
  const cats = [...new Set(skills.map((s) => s.category))];
  return cats.map((cat) => ({
    name: cat,
    color: CATEGORY_COLORS[cat] ?? '#ffffff',
    skills: skills.filter((s) => s.category === cat),
  }));
})();

export default function Skill() {
  return (
    <section className={styles.skills} id="skills">
      <div className={styles.contain}>
        <motion.div
          style={{ width: '100%', marginBottom: '0' }}
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.radialGradientHeading}>
            Skills
          </h2>
        </motion.div>

        <div className={styles.table}>
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.name}
              className={styles.row}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.07 }}
              style={{ '--cc': cat.color } as React.CSSProperties}
            >
              <div className={styles.catLabel}>
                <span className={styles.catDot} />
                <span className={styles.catName}>{cat.name}</span>
              </div>

              <div className={styles.pills}>
                {cat.skills.map((sk) => (
                  <span key={sk.name} className={styles.pill}>
                    {sk.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
