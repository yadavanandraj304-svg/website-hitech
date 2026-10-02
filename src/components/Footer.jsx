import React from 'react'
import { motion } from 'framer-motion'
import { site, contact, social, services } from '../site'
import { FacebookIcon, TikTokIcon, WhatsAppIcon } from './Header'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="pt-16 pb-8 px-6 border-t border-line bg-white/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={48} variant="light" />
              <div className="leading-tight">
                <div className="font-heading text-lg font-bold text-ink">
                  Hi-Tech Civil Design Consultancy
                </div>
                <div className="text-xs text-civil-700/80 tracking-[0.14em] uppercase">
                  {site.established}
                </div>
              </div>
            </div>
            <p className="text-ink/60 font-body text-sm leading-relaxed max-w-md mb-5">
              3D design, property valuation, naksa pass and turnkey construction —
              everything your property needs, from one office in Birgunj-14.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <motion.a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink/55 hover:text-civil-700 hover:border-civil-700/50 transition-all"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <FacebookIcon className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink/55 hover:text-civil-700 hover:border-civil-700/50 transition-all"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <TikTokIcon className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink/55 hover:text-[#25D366] hover:border-[#25D366]/60 transition-all"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <WhatsAppIcon className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-civil-700 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 font-body text-sm">
              {[
                ['Home', '#/'],
                ['Services', '#/services'],
                ['Projects', '#/projects'],
                ['Reviews', '#/reviews'],
                ['Rajbaba Creative Builders', '#/'],
                ['About Us', '#/about'],
                ['Contact Us', '#/contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-ink/60 hover:text-civil-700 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services + contact */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-civil-700 mb-4">
              Services
            </h4>
            <ul className="space-y-2 font-body text-sm mb-6">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href="#/services"
                    className="text-ink/60 hover:text-civil-700 transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="space-y-2 font-body text-sm text-ink/60">
              <div>{contact.address}</div>
              <a
                href={`tel:${contact.phoneDisplay.replace(/\s/g, '')}`}
                className="block hover:text-civil-700 transition-colors"
              >
                {contact.phoneDisplay}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="block hover:text-civil-700 transition-colors break-all"
              >
                {contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-ink/50 font-body text-sm text-center md:text-left">
            © {year} {site.name} · {site.division} — {site.location}
          </p>
          <p className="text-ink/40 font-body text-xs text-center">
            Local SEO · Google Business Profile friendly · Built to run 24/7 on free static hosting
          </p>
        </div>
      </div>
    </footer>
  )
}
