import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { social } from '../site'
import { FacebookIcon, TikTokIcon, WhatsAppIcon } from './Header'

// Floating right-side rail: WhatsApp + Facebook + TikTok, always visible.
export default function FloatingSocial() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const item =
    'w-12 h-12 rounded-full float-rail flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110'

  return (
    <div className="fixed right-4 bottom-6 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className={`${item} bg-white/95 border border-ink/10 text-ink/70 hover:text-civil-700 hover:border-civil-700/40`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={social.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
        className={`${item} bg-white/95 border border-ink/10 text-ink/70 hover:text-ink hover:border-ink/30`}
      >
        <TikTokIcon className="w-5 h-5" />
      </a>

      <a
        href={social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className={`${item} bg-[#1877F2]/90 border border-white/20 text-white`}
      >
        <FacebookIcon className="w-5 h-5" />
      </a>

      <a
        href={social.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`${item} bg-[#25D366] border border-white/20 text-white pulse-ring relative`}
      >
        <WhatsAppIcon className="w-6 h-6" />
      </a>
    </div>
  )
}
