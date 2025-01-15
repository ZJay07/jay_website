'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

import { fadeIn } from '@/utils/motion';

import SectionWrapper from './SectionWrapper';

function Contact() {
  return (
    <div className="relative">
      <motion.div
        variants={fadeIn('up', 'tween', 0.2, 1)}
        className="max-w-xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold mb-12 text-[#0f172a] dark:text-[#94a3b8]">
          Get in Touch
        </h2>
        <div className="flex justify-center space-x-6">
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="mailto:jaychoy007@gmail.com"
            className="p-3 rounded-full bg-white/80 dark:bg-[#1e2a3a]/80 backdrop-blur-lg shadow-lg
                     border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
          >
            <Mail className="w-6 h-6 text-[#2563eb] dark:text-[#60a5fa]" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://www.linkedin.com/in/zheng-jay-choy-94293621a/"
            className="p-3 rounded-full bg-white/80 dark:bg-[#1e2a3a]/80 backdrop-blur-lg shadow-lg
                     border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
          >
            <Linkedin className="w-6 h-6 text-[#2563eb] dark:text-[#60a5fa]" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="https://github.com/ZJay07"
            className="p-3 rounded-full bg-white/80 dark:bg-[#1e2a3a]/80 backdrop-blur-lg shadow-lg
                     border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
          >
            <Github className="w-6 h-6 text-[#2563eb] dark:text-[#60a5fa]" />
          </motion.a>
        </div>
        <motion.div
          variants={fadeIn('up', 'spring', 0.3, 0.75)}
          className="mt-16 text-sm text-[#475569] dark:text-[#64748b] border-t border-gray-200 dark:border-gray-700 pt-8"
        >
          © {new Date().getFullYear()} Jay Choy. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SectionWrapper(Contact, 'contact');
