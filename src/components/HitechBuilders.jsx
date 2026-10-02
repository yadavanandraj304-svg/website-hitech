import React from 'react'
import { motion } from 'framer-motion'
import { site } from '../site'
import { inquireWith } from '../lib/nav'
import Logo from './Logo'

const capabilities = [
  {
    title: 'Turnkey Contracting',
    text: 'Complete residential and commercial execution — from excavation to handover, one contract, one accountable team.',
    icon: 'M3 21h18M5 21V8l7-4 7 4v13M10 21v-6h4v6',
  },
  {
    title: 'Site Supervision',
    text: 'Daily engineer supervision, quality checks on RCC, brickwork and finishing, plus verified BOQ and material tracking.',
    icon: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  },
  {
    title: 'Structural Execution',
    text: 'Foundation, frame and load-bearing work executed strictly per approved naksa and structural analysis drawings.',
    icon: 'M4 4h16v16H4zM4 10h16M10 4v16',
  },
]

const process = [
  { step: '01', title: 'Design & Naksa', text: 'Drawings prepared and approved by the municipality.' },
  { step: '02', title: 'Estimate & BOQ', text: 'Transparent cost estimate with material breakdown.' },
  { step: '03', title: 'Construction', text: 'Supervised execution with weekly progress updates.' },
  { step: '04', title: 'Handover', text: 'Final inspection, finishing and keys in your hand.' },
]

export default function HitechBuilders() {
  const goContact = () => {
    inquireWith(`Building Construction (${site.division})`)
  }

  return (
    <section id="hitech-builders" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-civil-700/[0.05] to-transparent" />
      <div className="absolute top-1/3 -left-40 w-[420px] h-[420px] rounded-full bg-civil-500/10 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body text-civil-700 tracking-widest uppercase text-sm mb-3 font-medium">
              Our Construction Wing
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 leading-tight text-ink">
              <span className="gradient-text">{site.division}</span>
              <br />
              <span className="text-ink">— Design to Doorstep</span>
            </h2>
            <p className="text-ink/60 font-body text-lg mb-8 leading-relaxed">
              The sister brand of {site.name}. Where our consultancy draws and
              approves the plans, <span className="text-civil-700 font-semibold">{site.division}</span> builds
              them — turning verified drawings into finished buildings across
              Birgunj and the Parsa district.
            </p>

            <div className="space-y-5 mb-10">
              {capabilities.map((cap) => (
                <div key={cap.title} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-civil-700/10 border border-civil-700/20 text-civil-700 flex items-center justify-center shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={cap.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-ink mb-1">
                      {cap.title}
                    </h3>
                    <p className="text-ink/60 font-body text-sm leading-relaxed">
                      {cap.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              onClick={goContact}
              className="btn-gold px-8 py-4 rounded-xl font-heading font-semibold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get a Construction Quote
            </motion.button>
          </motion.div>

          {/* Process panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glow-border rounded-3xl p-8 bg-white backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-line">
              <Logo size={44} variant="light" />
              <div>
                <div className="font-heading text-xl font-bold text-ink">
                  How We Build
                </div>
                <div className="text-xs text-ink/50 font-body tracking-wide">
                  A transparent 4-step process
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {process.map((p, i) => (
                <div key={p.step} className="flex gap-5 items-start group">
                  <div className="flex flex-col items-center">
                    <span className="w-10 h-10 rounded-full border border-civil-700/40 bg-civil-700/[0.07] text-civil-700 font-heading font-bold text-sm flex items-center justify-center group-hover:bg-civil-700 group-hover:text-white transition-colors">
                      {p.step}
                    </span>
                    {i < process.length - 1 && (
                      <span className="w-px flex-1 min-h-[24px] bg-gradient-to-b from-civil-700/30 to-transparent mt-2" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h4 className="font-heading text-base font-semibold text-ink">
                      {p.title}
                    </h4>
                    <p className="text-ink/60 font-body text-sm">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-line grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-heading text-2xl font-bold gradient-text">Residential</div>
                <div className="text-xs text-ink/50 font-body">Homes & apartments</div>
              </div>
              <div>
                <div className="font-heading text-2xl font-bold gradient-text">Commercial</div>
                <div className="text-xs text-ink/50 font-body">Shops, offices & complexes</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
