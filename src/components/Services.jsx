import React from 'react'
import { motion } from 'framer-motion'
import { services, site } from '../site'
import { inquireWith } from '../lib/nav'

function ServiceIcon({ name }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    interior: (
      <g {...common}>
        <path d="M3 21h18M5 21V9l7-5 7 5v12" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 12h.01M15 12h.01" />
      </g>
    ),
    exterior: (
      <g {...common}>
        <path d="M2 12l10-8 10 8" />
        <path d="M4 10v10h16V10" />
        <path d="M9 20v-6h6v6" />
        <path d="M15.5 6.5h3v3" />
      </g>
    ),
    valuation: (
      <g {...common}>
        <path d="M12 3v18" />
        <path d="M5 7h14" />
        <path d="M7 7l-3 6h6l-3-6zM17 7l-3 6h6l-3-6z" />
        <path d="M8 21h8" />
      </g>
    ),
    naksa: (
      <g {...common}>
        <path d="M4 4h16v16H4z" />
        <path d="M4 9h16M9 4v16" />
        <path d="M13 13l3 3M16 12l2 2" />
      </g>
    ),
    construction: (
      <g {...common}>
        <path d="M3 21h18" />
        <path d="M6 21V8l6-4 6 4v13" />
        <path d="M10 21v-5h4v5" />
        <path d="M2 8l10-5 10 5" />
      </g>
    ),
  }
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true">
      {paths[name] || paths.interior}
    </svg>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' },
  }),
}

function inquire(serviceTitle) {
  inquireWith(serviceTitle)
}

export default function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-civil-700 tracking-widest uppercase text-sm mb-3 font-medium">
            What We Do
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-ink">
            <span className="text-ink">Our </span>
            <span className="gradient-text">Core Services</span>
          </h2>
          <p className="text-ink/60 font-body text-lg max-w-2xl mx-auto">
            From the first 3D render to the final handover — design, approvals,
            valuation and construction under one trusted name.
          </p>
          <div className="mt-4 w-24 h-1 section-line mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="group"
            >
              <div
                className={`card-hover glow-border rounded-2xl p-6 h-full bg-white flex flex-col relative overflow-hidden ${
                  service.featured ? 'ring-1 ring-civil-700/30' : ''
                }`}
              >
                {service.featured && (
                  <span className="absolute top-4 right-4 text-[10px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-civil-700 text-white">
                    {site.division}
                  </span>
                )}

                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                    service.color === 'amber'
                      ? 'bg-gold-500/15 text-gold-600 border border-gold-500/40'
                      : 'bg-civil-700/10 text-civil-700 border border-civil-700/20'
                  }`}
                >
                  <ServiceIcon name={service.icon} />
                </div>

                <h3 className="font-heading text-xl font-semibold text-ink mb-3 group-hover:text-civil-700 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-ink/60 font-body text-sm leading-relaxed mb-5">
                  {service.blurb}
                </p>

                <ul className="space-y-2 mb-6 flex-grow">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-ink/70 font-body"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0 text-civil-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => inquire(service.formValue)}
                  className={`px-5 py-2.5 rounded-lg font-heading text-sm font-medium self-start transition-all duration-300 ${
                    service.featured
                      ? 'btn-gold'
                      : 'border border-ink/20 text-ink/75 hover:border-civil-700/60 hover:text-civil-700'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {service.cta} →
                </motion.button>
              </div>
            </motion.div>
          ))}

          {/* Contact card as 6th grid item */}
          <motion.div
            custom={5}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="group"
          >
            <div className="card-hover rounded-2xl p-6 h-full flex flex-col justify-center bg-gradient-to-br from-civil-700 to-civil-800 border border-civil-700 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gold-500/15 blur-2xl" />
              <h3 className="font-heading text-2xl font-bold text-white mb-3">
                Not sure which service you need?
              </h3>
              <p className="text-civil-100/90 font-body text-sm mb-6">
                Tell us about your plot, property or project — we'll guide you to
                the right service, free of charge.
              </p>
              <motion.button
                onClick={() => inquire('')}
                className="px-6 py-3 rounded-lg font-heading font-semibold text-sm self-start bg-white text-civil-700 hover:bg-civil-50 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Talk to an Engineer
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
