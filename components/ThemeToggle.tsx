'use client'

import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-100 dark:bg-[#1e2a3a] border border-gray-200 dark:border-gray-700"
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5 text-[#60a5fa]" />
      ) : (
        <MoonIcon className="w-5 h-5 text-[#2563eb]" />
      )}
    </motion.button>
  )
}

