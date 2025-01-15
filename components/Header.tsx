'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-10 bg-white/80 dark:bg-[#1e2a3a]/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent"
          >
            Jay Choy
          </Link>
          <nav className="flex items-center space-x-8">
            <Link
              href="#experience"
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
            >
              Experience
            </Link>
            <Link
              href="#projects"
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="#work"
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
            >
              Work
            </Link>
            <Link
              href="#contact"
              className="text-[#475569] dark:text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
            >
              Contact
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
