'use client'

import { motion } from "framer-motion"
import { fadeIn } from "@/utils/motion"
import SectionWrapper from "./SectionWrapper"

function Bio() {
  return (
    <div className="mt-20">
      <motion.div
        variants={fadeIn("up", "tween", 0.2, 1)}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold mb-8 text-[#0f172a] dark:text-[#94a3b8]">
          About Me
        </h2>
        <p className="text-lg text-[#475569] dark:text-[#94a3b8] leading-relaxed">
        I'm a passionate software engineer and UCL Computer Science Master's student (graduating in 2025) with experience in backend development, AI, and building scalable tools. I've worked on automating trading processes at Macquarie, enhancing platform observability at Thought Machine, and developing AI-driven tools for marketers as an early hire at Kaya. My work focuses on creating impactful, efficient solutions, and I'm driven by a love for solving real-world problems and advancing technology.
        </p>
      </motion.div>
    </div>
  )
}

export default SectionWrapper(Bio, "bio")

