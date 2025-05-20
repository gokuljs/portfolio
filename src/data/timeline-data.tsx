import React from 'react';

export const timelineData = [
  {
    period: 'June 2024 – March 2025',
    title: 'Full Stack Developer',
    company: 'Teamble',
    location: 'New York City (NYC), USA',
    companyLogo: {
      src: '/images/companies/teamble.png',
      alt: 'Teamble logo',
    },
    locationImage: {
      src: '/images/locations/nyc.jpg',
      alt: 'New York City skyline',
    },
    content: (
      <div className="space-y-4">
        <p>
          Architected and maintained high-performance web applications using
          Node.js and React.
        </p>
        <p>
          Developed a comprehensive frontend design system from scratch,
          implementing a pixel-perfect, scalable framework that significantly
          accelerated development cycles.
        </p>
        <p>
          Optimized APIs by migrating SQL queries and refactoring backend logic,
          resulting in markedly faster response times.
        </p>
        <div className="space-y-2">
          <p className="font-medium">
            Developed LLM-powered AI agents using LangGraph:
          </p>
          <ul className="list-none space-y-2 pl-4">
            <li>
              • Created a conversational AI interface with role-based
              permissions for real-time data interaction.
            </li>
            <li>
              • Built a multi-agent system leveraging Retrieval-Augmented
              Generation (RAG) and fine-tuned models, enabling scalable
              performance review generation and AI-driven collaboration.
            </li>
            <li>
              • A powerful OneOnOne Agent that aggregates data from performance
              and quarterly reviews to generate insightful feedback for managers
              before one-on-one meetings.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    period: 'November 2022 – January 2024',
    title: 'Founding Engineer',
    company: 'Aerotime, Y Combinator (W21)',
    location: 'San Francisco, California',
    companyLogo: {
      src: '/images/companies/aerotime.png',
      alt: 'Aerotime logo',
    },
    locationImage: {
      src: '/images/locations/san-francisco.jpg',
      alt: 'San Francisco Golden Gate Bridge',
    },
    content: (
      <div className="space-y-4">
        <p>
          Spearheaded the complete management and enhancement of frontend
          infrastructure, significantly improving web application performance.
        </p>
        <p>
          Contributed to the development of a JavaScript SDK, facilitating
          third-party integrations and expanding application functionalities.
        </p>
        <div className="space-y-2">
          <p>Customer Engagement & Product Development:</p>
          <ul className="list-none space-y-2 pl-4">
            <li>
              • Engaged directly with customers through discovery calls and
              feedback sessions, driving user-centric product development.
            </li>
            <li>
              • Communicated critical user feedback to company founders,
              influencing strategic decision-making and problem-solving.
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <p>AI & Technical Achievements:</p>
          <ul className="list-none space-y-2 pl-4">
            <li>
              • Deployed and managed open-source large language models like
              LLaMA and Stable Diffusion.
            </li>
            <li>
              • Employed advanced techniques from the Hugging Face library,
              including DreamBooth and Textual Inversion.
            </li>
            <li>
              • Implemented comprehensive analytics and telemetry systems for
              improved UI/UX design.
            </li>
            <li>
              • Developed a sophisticated table with virtualization for
              efficient large dataset management.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    period: 'November 2021 – November 2022',
    title: 'Full Stack Developer',
    company: 'Tifin Fintech (Previously 1stMain)',
    location: 'Bangalore, India',
    companyLogo: {
      src: '/images/companies/tifin.png',
      alt: 'Tifin logo',
    },
    locationImage: {
      src: '/images/locations/bangalore.jpg',
      alt: 'Bangalore cityscape',
    },
    content: (
      <div className="space-y-4">
        <p>
          Spearheaded frontend development for TIFIN Wealth using Next.js and
          React.js, increasing productivity by 20% through strategic scaling and
          responsive design initiatives.
        </p>
        <ul className="list-none space-y-2 pl-4">
          <li>
            • Streamlined application state management by implementing Redux
            Toolkit, significantly enhancing workflow efficiency and
            contributing to a 15% increase in customer satisfaction through
            rigorous bug fixes.
          </li>
          <li>
            • Fostered a 50% improvement in development turnaround by creating
            reusable React components and integrating APIs with GraphQL and
            React Query for optimal frontend functionality.
          </li>
          <li>• Modernized the platform by migrating to updated codebases.</li>
        </ul>
      </div>
    ),
  },
];
