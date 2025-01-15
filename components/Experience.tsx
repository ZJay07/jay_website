'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { fadeIn } from '@/utils/motion';

import {
  thoughtmachine,
  unifyai,
  buzzSocial,
  foodCLUB,
  macquarie,
  macquarieGroup,
  kaya,
} from '../assets';

import SectionWrapper from './SectionWrapper';

function ExperienceCard({
  title,
  company,
  date,
  points,
  logo,
  index,
}: {
  title: string;
  company: string;
  date: string;
  points: string[];
  logo: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeIn('up', 'spring', index * 0.5, 0.75)}
      className="bg-white/80 dark:bg-[#1e2a3a]/80 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow
                 backdrop-blur-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2563eb] dark:border-[#60a5fa]">
          <Image
            src={logo || '/placeholder.svg'}
            alt={company}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#0f172a] dark:text-[#94a3b8]">
            {title}
          </h3>
          <p className="text-[#64748b]">
            {company} | {date}
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {points.map((point, pointIndex) => (
          <li key={pointIndex} className="text-[#475569] dark:text-[#94a3b8]">
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Experience() {
  const experiences = [
    {
      title: 'Software Engineer',
      company: 'Kaya (YC 21)',
      date: 'Oct 2024 - Present',
      logo: kaya,
      points: [
        "Improved search speed by implementing Kaya Search, a vector-based search system optimized for marketers' needs.",
        'Developed an AI chatbot agent to help marketers generate ad content and ad copies efficiently.',
        'One of the first engineering hires.',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Macquarie Group',
      date: 'June 2024 - Aug 2024',
      logo: macquarieGroup,
      points: [
        'Automated daily risk team emails and decommissioned an external data platform using Python Airflow, saving over £2000 per month.',
        'Streamlined trading data ingestion by implementing concurrent API calls, reducing process time from 1.5 hours to 0.5 hours and enhancing efficiency by 200%.',
        'Pioneered the automation of database schema updates.',
      ],
    },
    {
      title: 'Backend Engineer',
      company: 'Thought Machine',
      date: 'July 2023 - Sept 2023',
      logo: thoughtmachine,
      points: [
        'Enhanced Deployment Hub API observability by integrating Prometheus metrics in Golang and configuring kube-state-metrics.',
        'Created interactive Grafana dashboards for Kubernetes metrics visualization and improved user experience with a React.js frontend.',
        'Implemented database restoration metrics to optimize system monitoring and troubleshooting.',
      ],
    },
    {
      title: 'Machine Learning Contributor',
      company: 'Unify AI / Ivy',
      date: 'Jan 2024 - Dec 2024',
      logo: unifyai,
      points: [
        'Contributed to the Ivy unified machine learning library by fixing critical test cases and implementing new features to improve compatibility across frameworks like TensorFlow and PyTorch.',
        'Enhanced library robustness by identifying and resolving edge cases, ensuring seamless performance in real-world applications.',
        'Collaborated with the open-source community to review and refine pull requests, promoting high coding standards and maintainability.',
        'Improved the developer experience by documenting features and providing clear examples for new functionalities.',
      ],
    },
  ];

  return (
    <div className="mt-20">
      <h2 className="text-4xl font-bold mb-12 text-center text-[#0f172a] dark:text-[#94a3b8]">
        Experience
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {experiences.map((experience, index) => (
          <ExperienceCard key={index} {...experience} index={index} />
        ))}
      </div>
    </div>
  );
}

export default SectionWrapper(Experience, 'experience');
