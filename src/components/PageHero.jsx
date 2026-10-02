import React from 'react'
import { motion } from 'framer-motion'

// Page banner used by every interior page (fixed header needs the top padding)
export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white/60">
      <div className="absolute inset-0 bg-gradient-to-br from-civil-700/[0.06] via-transparent to-gold-500/10" />
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-12 sm:pt-36 sm:pb-14">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-xs sm:text-sm uppercase tracking-[0.25em] text-civil-700 mb-3"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-heading text-3xl sm:text-5xl font-bold text-ink leading-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-4 max-w-2xl font-body text-ink/65 text-sm sm:text-base leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
