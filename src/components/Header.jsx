import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { site, social, contact } from '../site'
import Logo from './Logo'

// Each nav item opens its own page (hash routes handled in src/App.jsx)
const navLinks = [
  { label: 'Home', href: '#/' },
  { label: 'Services', href: '#/services' },
  { label: 'Projects', href: '#/projects' },
  { label: 'Reviews', href: '#/reviews' },
  { label: 'About Us', href: '#/about' },
  { label: 'Contact Us', href: '#/contact' },
]

export function FacebookIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function TikTokIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hash, setHash] = useState(() => window.location.hash || '#/')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    const handleHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', handleHash)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('hashchange', handleHash)
    }
  }, [])

  const isActive = (href) => hash === href || (href === '#/' && (hash === '' || hash === '#'))

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3' : 'py-5 bg-transparent'
      }`}
      data-variant={scrolled ? 'light' : 'transparent'}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#/"
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Logo size={44} variant="light" />
          <span className="leading-tight hidden sm:block">
            <span className="block font-heading text-lg font-bold text-ink tracking-tight">
              Hi-Tech Civil Design Consultancy
            </span>
            <span className="block text-[11px] tracking-[0.18em] uppercase text-civil-700/80 font-body">
              {site.established}
            </span>
          </span>
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className={`font-body text-sm transition-colors duration-300 relative group ${
                isActive(link.href)
                  ? 'text-civil-700 font-semibold'
                  : 'text-ink/75 hover:text-civil-700'
              }`}
              whileHover={{ y: -2 }}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-civil-700 to-civil-400 transition-all duration-300 ${
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </motion.a>
          ))}

          <div className="flex items-center gap-2 pl-4 border-l border-ink/10">
            <motion.a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center text-ink/60 hover:text-civil-700 hover:border-civil-700/50 transition-all"
              whileHover={{ y: -2, scale: 1.1 }}
            >
              <FacebookIcon />
            </motion.a>
            <motion.a
              href={social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center text-ink/60 hover:text-civil-700 hover:border-civil-700/50 transition-all"
              whileHover={{ y: -2, scale: 1.1 }}
            >
              <TikTokIcon />
            </motion.a>
            <motion.a
              href="#/contact"
              className="btn-gold ml-2 px-5 py-2.5 rounded-lg font-heading text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get a Free Quote
            </motion.a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-ink/70 hover:text-civil-700 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="py-4 px-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`transition-colors font-body text-lg ${
                    isActive(link.href)
                      ? 'text-civil-700 font-semibold'
                      : 'text-ink/75 hover:text-civil-700'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-3 border-t border-ink/10">
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center text-ink/60"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center text-ink/60"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${contact.phoneDisplay.replace(/\s/g, '')}`}
                  className="text-sm text-civil-700 font-body"
                >
                  {contact.phoneDisplay}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
