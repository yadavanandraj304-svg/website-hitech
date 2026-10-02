import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '../components/PageHero'
import { serviceOptions, site } from '../site'

// Client reviews — anyone can submit; the admin approves them (#/admin → Reviews)

function Stars({ value = 5, className = '' }) {
  return (
    <span className={`inline-flex gap-0.5 text-gold-500 ${className}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? '' : 'opacity-25'}>
          ★
        </span>
      ))}
    </span>
  )
}

export function relativeDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', rating: 5, service: '', message: '' })
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setNotice({ type: 'error', text: 'Please add your name and your review.' })
      return
    }
    setSending(true)
    setNotice(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not send your review.')
      setForm({ name: '', rating: 5, service: '', message: '' })
      setNotice({
        type: 'success',
        text: 'Thank you! Your review has been received and will appear here once approved.',
      })
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    } finally {
      setSending(false)
    }
  }

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : null

  return (
    <>
      <PageHero
        eyebrow="Client Reviews"
        title="What our clients feel about us"
        subtitle="Real feedback from homeowners, builders and property owners across Birgunj and Parsa. Every review here was submitted through this page and approved by our team."
      >
        {average && (
          <div className="inline-flex items-center gap-3 bg-white border border-line rounded-full px-5 py-2.5">
            <span className="font-heading text-2xl font-bold text-ink">{average}</span>
            <Stars value={Math.round(Number(average))} />
            <span className="text-sm text-ink/55">
              {reviews.length} review{reviews.length === 1 ? '' : 's'}
            </span>
          </div>
        )}
      </PageHero>

      <section className="max-w-7xl mx-auto px-6 py-14 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Reviews list */}
        <div>
          {loading ? (
            <p className="text-center text-ink/50 py-16">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <div className="border border-dashed border-line bg-white rounded-2xl py-16 text-center">
              <p className="font-heading text-xl font-semibold text-ink mb-2">
                Be the first to review us
              </p>
              <p className="text-ink/60 text-sm">
                Worked with us? Share how it went — your words help other families in Birgunj choose
                with confidence.
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              <AnimatePresence initial={false}>
                {reviews.map((r, i) => (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                    className="bg-white border border-line rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="w-11 h-11 shrink-0 rounded-full bg-civil-700 text-white font-heading font-bold flex items-center justify-center">
                        {(r.name || '?').trim().charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h2 className="font-heading font-semibold text-ink">{r.name}</h2>
                          <Stars value={r.rating || 5} className="text-sm" />
                          <span className="text-xs text-ink/45">{relativeDate(r.createdAt)}</span>
                        </div>
                        {r.service && (
                          <p className="text-xs uppercase tracking-wider text-civil-700 mt-1">
                            {r.service}
                          </p>
                        )}
                        <p className="mt-2.5 text-ink/75 leading-relaxed whitespace-pre-line">
                          {r.message}
                        </p>
                        {r.reply && (
                          <div className="mt-3 ml-4 border-l-2 border-civil-700/40 pl-3 bg-warm rounded-r-lg py-2 pr-3">
                            <p className="text-xs font-semibold text-civil-700 uppercase tracking-wider">
                              {site.shortName} replied
                            </p>
                            <p className="text-sm text-ink/70 mt-1">{r.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Submit form */}
        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="bg-civil-700 text-white rounded-2xl p-6 shadow-civil">
            <h2 className="font-heading text-xl font-bold">Share your experience</h2>
            <p className="text-white/70 text-sm mt-1.5">
              Took 30 seconds — it helps other families in Birgunj.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                  Your name *
                </label>
                <input
                  className="w-full rounded-lg bg-white/10 border border-white/25 px-3.5 py-2.5 text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-white/60"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                  Rating *
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        n <= form.rating ? 'text-gold-400' : 'text-white/30'
                      }`}
                      aria-label={`${n} star`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                  Service used
                </label>
                <select
                  className="w-full rounded-lg bg-white/10 border border-white/25 px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/60"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  <option value="" className="text-ink">
                    Choose a service…
                  </option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s} className="text-ink">
                      {s}
                    </option>
                  ))}
                  <option value="General Experience" className="text-ink">
                    General Experience
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                  Your review *
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg bg-white/10 border border-white/25 px-3.5 py-2.5 text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-white/60 resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How was your experience with our team?"
                />
              </div>

              {notice && (
                <p
                  className={`text-sm rounded-lg px-3 py-2 ${
                    notice.type === 'success'
                      ? 'bg-white/15 text-white'
                      : 'bg-gold-500/25 text-gold-100'
                  }`}
                >
                  {notice.text}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-white text-civil-700 font-heading font-semibold py-3 hover:bg-gold-400 transition-colors disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Submit my review'}
              </button>
              <p className="text-[11px] text-white/55 text-center">
                Reviews are checked before publishing — no spam, ever.
              </p>
            </form>
          </div>
        </aside>
      </section>
    </>
  )
}
