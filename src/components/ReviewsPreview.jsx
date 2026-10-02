import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Home-page teaser for the latest approved client reviews → #/reviews

export default function ReviewsPreview() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((d) => setReviews((d.reviews || []).slice(0, 3)))
      .catch(() => setReviews([]))
  }, [])

  if (!reviews.length) return null

  const average = (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)

  return (
    <section id="reviews" className="py-20 sm:py-24 border-t border-line">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-end gap-4 mb-10">
          <div className="mr-auto">
            <p className="font-body text-xs sm:text-sm uppercase tracking-[0.25em] text-civil-700 mb-3">
              Client Reviews
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink">
              What our clients <span className="gradient-text">feel about us</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-white border border-line rounded-full px-4 py-2">
            <span className="font-heading text-xl font-bold text-ink">{average}</span>
            <span className="text-gold-500">★★★★★</span>
          </div>
          <a href="#/reviews" className="btn-outline px-5 py-2.5 text-sm">
            Read all reviews →
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-white border border-line rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-civil-700 text-white font-heading font-bold flex items-center justify-center">
                  {(r.name || '?').trim().charAt(0).toUpperCase()}
                </span>
                <div>
                  <figcaption className="font-heading font-semibold text-ink text-sm">{r.name}</figcaption>
                  <span className="text-gold-500 text-sm">{'★'.repeat(r.rating || 5)}</span>
                </div>
              </div>
              <blockquote className="text-sm text-ink/70 leading-relaxed line-clamp-4">
                “{r.message}”
              </blockquote>
              {r.service && (
                <p className="mt-3 text-[11px] uppercase tracking-wider text-civil-700">{r.service}</p>
              )}
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
