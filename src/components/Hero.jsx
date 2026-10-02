import React from 'react'
import { motion } from 'framer-motion'
import { site, stats, home } from '../site'
import { goTo } from '../lib/nav'

export default function Hero() {
  const scrollTo = (id) => () => goTo(id)

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20 relative overflow-hidden"
    >
      {/* Decorative backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(15,44,89,0.10),transparent_60%)]" />
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-civil-500/10 blur-3xl -z-10" />
      <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] rounded-full bg-civil-500/10 blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.p
            className="inline-flex items-center gap-2 font-body text-civil-700 text-sm md:text-base tracking-widest uppercase mb-6 px-4 py-2 rounded-full border border-civil-700/25 bg-white/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="w-2 h-2 rounded-full bg-civil-700 animate-glow-pulse" />
            Birgunj-14, Parsa, Nepal
          </motion.p>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance text-ink">
            {home.heroTitle}
          </h1>

          <p className="font-body text-ink/65 text-lg md:text-xl max-w-3xl mx-auto mb-4">
            {site.division && home.heroSubtitle.includes(site.division) ? (
              home.heroSubtitle.split(site.division).map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="text-civil-700 font-semibold">{site.division}</span>
                  )}
                </React.Fragment>
              ))
            ) : (
              home.heroSubtitle
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10 text-sm text-ink/60 font-body">
            <span>3D Visualization</span>
            <span className="text-civil-400">•</span>
            <span>Vastu Planning</span>
            <span className="text-civil-400">•</span>
            <span>Property Valuation</span>
            <span className="text-civil-400">•</span>
            <span>Naksa Pass</span>
            <span className="text-civil-400">•</span>
            <span>Turnkey Construction</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={scrollTo('contact')}
              className="btn-gold px-8 py-4 rounded-xl font-heading font-semibold text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get a Free Quote
            </motion.button>

            <motion.button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('select-service', {
                    detail: 'Property Valuation',
                  })
                )
                scrollTo('contact')()
              }}
              className="btn-outline px-8 py-4 rounded-xl font-heading font-semibold text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Property Valuation
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glow-border rounded-xl p-4 bg-white/80 backdrop-blur-sm"
            >
              <div className="font-heading text-2xl md:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-ink/55 font-body mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-civil-700/40 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-civil-700 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
