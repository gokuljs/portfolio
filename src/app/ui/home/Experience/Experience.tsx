import React from 'react';
import styles from '@styles/Experience.module.scss';
import clsx from 'clsx';
import Image from 'next/image';
const Experience = () => {
  return (
    <div className={styles.Experience} id="experience">
      <h1 className={styles.heading}>Professional Experience</h1>
      <div className={styles.timeline}>
        <div className={clsx(styles.container, styles.leftContainer)}>
          <Image
            className={styles.company}
            src="/ae-logo.svg"
            width={40}
            height={40}
            alt="Gokul JS"
          />
          <div className={styles.textBox}>
            <h2>Aerotime, Y Combinator (W21) | Founding Engineer</h2>
            <small>Nov 2022 – Nov 2023 | San Francisco, California</small>
            <ul className={styles.companyAbout}>
              <li>
                Spearheaded the complete management and enhancement of the
                frontend infrastructure, resulting in significant improvements
                in web application performance.
              </li>
              <li>
                Contributed to the development of a JavaScript SDK as part of a
                team, facilitating third-party integrations and expanding the
                application's functionalities.
              </li>
              <li>
                Engaged directly with customers through discovery calls and
                feedback sessions, utilizing these insights to drive
                user-centric product development.
              </li>
              <li>
                Communicated critical user feedback to the company founders,
                playing a pivotal role in strategic decision-making and
                problem-solving processes.
              </li>
              <li>
                Deployed and managed open-source large language models like
                LLaMA and Stable Diffusion, substantially enhancing the
                company's AI capabilities.
              </li>
              <li>
                Employed advanced techniques from the Hugging Face library, such
                as DreamBooth and Textual Inversion, to optimize AI model
                performance and efficiency.
              </li>
            </ul>

            <span className={styles.leftArrow}></span>
          </div>
        </div>
        <div className={clsx(styles.container, styles.rightContainer)}>
          <Image
            className={styles.company}
            src="/tifin.jpeg"
            width={40}
            height={40}
            alt="Gokul JS"
          />
          <div className={styles.textBox}>
            <h2>Tifin Fintech (Previously 1stMain)</h2>
            <small>Mar 2022 – Nov 2022 | Bangalore, India</small>
            <ul className={styles.companyAbout}>
              <li>
                Spearheaded frontend development for TIFIN Wealth using Next.js
                and React.js, increasing productivity by 20% through strategic
                scaling and responsive design initiatives.
              </li>
              <li>
                Streamlined application state management by implementing Redux
                Toolkit, significantly enhancing workflow efficiency and
                contributing to a 15% increase in customer satisfaction through
                rigorous bug fixes.
              </li>
              <li>
                Fostered a 50% improvement in development turnaround by creating
                reusable React components and integrating APIs with GraphQL and
                React Query for optimal frontend functionality.
              </li>
              <li>
                Modernized the platform by migrating to updated codebases and
                translating complex wireframes into user-centric websites,
                maintaining full adherence to project timelines.
              </li>
            </ul>
            <span className={styles.rightArrow}></span>
          </div>
        </div>
        <div className={clsx(styles.container, styles.leftContainer)}>
          <Image
            className={styles.company}
            src="/1stmain_logo.jpeg"
            width={40}
            height={40}
            alt="Gokul JS"
          />
          <div className={styles.textBox}>
            <h2>1stMain</h2>
            <small>Nov 2021 – Feb 2022 | Bangalore, India</small>
            <ul className={styles.companyAbout}>
              <li>
                Leveraged in-depth React expertise to enhance lifecycle methods,
                boosting development efficiency by 40% and ensuring 100%
                compliance with project delivery schedules.
              </li>
              <li>
                Orchestrated the adaptation of over 50 client websites to meet
                evolving industry standards, facilitating clear communication
                among teams, clients, and stakeholders.
              </li>
              <li>
                Pioneered the integration of content management systems (CMS)
                like Strapi and Sanity, and executed seamless migrations between
                GraphQL and REST API, optimizing content flow and website
                interactivity.
              </li>
              <li>
                Collaborated with UI/UX teams to develop and deploy responsive,
                user-centric web applications using React.js, Gatsby.js, and
                Next.js, culminating in highly engaging interfaces that align
                with strategic visions.
              </li>
            </ul>
            <span className={styles.leftArrow}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
