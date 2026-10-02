import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import { site } from '../site'

// Public portfolio — projects are added from the admin dashboard
// (#/admin → Projects) and published to GET /api/projects.

function Placeholder({ title }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-civil-700 to-civil-500 flex items-center justify-center">
      <span className="font-heading text-white/90 text-4xl sm:text-5xl font-bold">
        {(title || 'P').trim().charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Our Projects"
        title="Work we've drawn, approved & built"
        subtitle={`A selection of residences, commercial spaces and approvals delivered by ${site.name} and our construction wing, Hitech Builders — across Birgunj and Parsa.`}
      />

      <section className="max-w-7xl mx-auto px-6 py-14">
        {loading ? (
          <p className="text-center text-ink/50 py-16">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-line bg-white rounded-2xl py-16 text-center">
            <p className="font-heading text-xl font-semibold text-ink mb-2">
              Projects are being photographed
            </p>
            <p className="text-ink/60 text-sm max-w-md mx-auto">
              Our portfolio is being uploaded. Call or WhatsApp us for recent work — we're happy
              to share site photos and approval drawings directly.
            </p>
            <a href="#/contact" className="btn-gold inline-flex mt-6 px-6 py-3">
              Request our portfolio
            </a>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
                className="group bg-white border border-line rounded-2xl overflow-hidden hover:shadow-civil transition-shadow duration-300"
              >
                <button
                  onClick={() => setActive(p)}
                  className="block w-full h-56 overflow-hidden text-left"
                  aria-label={`View ${p.title}`}
                >
                  <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <Placeholder title={p.title} />
                    )}
                  </div>
                </button>
                <div className="p-5">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {p.category && (
                      <span className="text-[11px] uppercase tracking-wider text-civil-700 bg-civil-50 border border-civil-200 rounded-full px-2.5 py-0.5">
                        {p.category}
                      </span>
                    )}
                    {p.location && <span className="text-xs text-ink/50">{p.location}</span>}
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-ink">{p.title}</h2>
                  {p.description && (
                    <p className="mt-1.5 text-sm text-ink/65 line-clamp-3">{p.description}</p>
                  )}
                  <button
                    onClick={() => setActive(p)}
                    className="mt-3 text-sm font-semibold text-civil-700 hover:underline"
                  >
                    View details →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-civil"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[60vh] bg-warm">
              {active.image ? (
                <img src={active.image} alt={active.title} className="w-full max-h-[60vh] object-contain" />
              ) : (
                <div className="h-64">
                  <Placeholder title={active.title} />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold text-ink">{active.title}</h3>
              <p className="text-sm text-ink/55 mt-1">
                {[active.category, active.location].filter(Boolean).join(' · ')}
              </p>
              {active.description && (
                <p className="mt-3 text-ink/70 text-sm leading-relaxed whitespace-pre-line">
                  {active.description}
                </p>
              )}
              <div className="mt-5 flex gap-3">
                <a href="#/contact" className="btn-gold px-5 py-2.5 text-sm">
                  Start a similar project
                </a>
                <button onClick={() => setActive(null)} className="btn-outline px-5 py-2.5 text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
