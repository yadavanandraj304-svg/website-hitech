import React from 'react'
import { motion } from 'framer-motion'
import { site, contact } from '../site'
import Logo from './Logo'

const highlights = [
  {
    title: 'Certified Engineers',
    text: 'Valuation reports and naksa drawings prepared by registered civil engineers — accepted by banks, embassies and the municipality.',
    icon: 'M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 16.8 6.5 19.5l1-6.2L3 8.9 9 8z',
  },
  {
    title: 'Local Birgunj Expertise',
    text: 'A decade of approvals, land records and building bylaws specific to Birgunj Metropolitan City and Parsa.',
    icon: 'M12 21s-7-5.4-7-11a7 7 0 1114 0c0 5.6-7 11-7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  },
  {
    title: 'Design + Build, One Team',
    text: 'Rare in the market: the people who design your building are the people who build it — zero finger-pointing.',
    icon: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(15,44,89,0.08),transparent_55%)]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Visual / brand card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="glow-border rounded-3xl p-8 bg-white backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <Logo size={56} variant="light" />
                  <div>
                    <h3 className="font-heading text-xl font-bold text-ink">
                      {site.name}
                    </h3>
                    <p className="text-civil-700 text-sm font-body">{site.established}</p>
                  </div>
                </div>

                <p className="text-ink/65 font-body leading-relaxed mb-6">
                  We are a civil design consultancy that covers the full lifecycle
                  of a property: visualising it in 3D, valuing it officially,
                  getting it approved by the municipality, and — through our wing{' '}
                  <span className="text-civil-700 font-semibold">{site.division}</span> — actually
                  building it. One office in Birgunj-14, one phone call away for
                  everything between a dream and a doorstep.
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-xl bg-civil-700/[0.06] border border-civil-700/15 p-4">
                    <div className="font-heading text-lg font-bold text-civil-700">3D</div>
                    <div className="text-[11px] text-ink/55 font-body">Design Studio</div>
                  </div>
                  <div className="rounded-xl bg-civil-700/[0.06] border border-civil-700/15 p-4">
                    <div className="font-heading text-lg font-bold text-civil-700">Govt.</div>
                    <div className="text-[11px] text-ink/55 font-body">Naksa & Valuation</div>
                  </div>
                  <div className="rounded-xl bg-civil-700/[0.06] border border-civil-700/15 p-4">
                    <div className="font-heading text-lg font-bold text-civil-700">Turnkey</div>
                    <div className="text-[11px] text-ink/55 font-body">Construction</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-line flex items-center justify-between text-sm font-body">
                  <span className="text-ink/55">{contact.hours}</span>
                  <a
                    href={`tel:${contact.phoneDisplay.replace(/\s/g, '')}`}
                    className="text-civil-700 hover:text-civil-500 transition-colors font-semibold"
                  >
                    {contact.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-4 px-5 py-3 rounded-xl bg-civil-700 text-white font-heading font-bold text-sm shadow-civil hidden sm:block">
                ★ Trusted across Birgunj
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <p className="font-body text-civil-700 tracking-widest uppercase text-sm mb-3 font-medium">
              About Us
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 leading-tight text-ink">
              <span className="text-ink">Engineers Who </span>
              <span className="gradient-text">Understand Dreams</span>
            </h2>
            <p className="text-ink/60 font-body text-lg mb-8 leading-relaxed">
              Building in Nepal means navigating lalpurja records, Vastu
              preferences, municipal naksa approval and bank valuations — often
              all at once. We turn that maze into a clear, step-by-step path.
            </p>

            <div className="space-y-6">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="flex gap-4 items-start"
                >
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
                      <path d={h.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-ink mb-1">
                      {h.title}
                    </h3>
                    <p className="text-ink/60 font-body text-sm leading-relaxed">
                      {h.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
