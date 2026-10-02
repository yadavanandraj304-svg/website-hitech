import React from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import { team, site } from '../site'

// The people behind the consultancy — names/roles editable from admin → Settings.

function initials(name = '') {
  return name
    .replace(/^er\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
}

export default function Team() {
  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="The engineers behind every drawing"
        subtitle={`${site.name} is run by a small, senior team — you speak to the person who actually designs, values and approves your project.`}
      />

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid gap-7 sm:grid-cols-2">
          {team.map((member, i) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-line rounded-2xl p-7 hover:shadow-civil transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-36 h-36 rounded-full object-cover ring-4 ring-civil-50 border border-line mb-4"
                  />
                ) : (
                  <span className="w-36 h-36 rounded-full bg-gradient-to-br from-civil-700 to-civil-500 text-white font-heading text-3xl font-bold flex items-center justify-center ring-4 ring-civil-50 mb-4">
                    {initials(member.name)}
                  </span>
                )}
                <h2 className="font-heading text-xl font-bold text-ink">{member.name}</h2>
                <p className="text-civil-700 text-sm font-semibold uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
              {member.bio && (
                <p className="mt-4 text-ink/70 leading-relaxed text-sm">{member.bio}</p>
              )}
              {member.phone && (
                <a
                  href={`tel:${String(member.phone).replace(/\s/g, '')}`}
                  className="mt-4 inline-block text-sm text-civil-700 hover:underline"
                >
                  📞 {member.phone}
                </a>
              )}
            </motion.article>
          ))}
        </div>

        <div className="mt-10 bg-civil-700 text-white rounded-2xl p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="mr-auto">
            <h2 className="font-heading text-xl font-bold">Work directly with our engineers</h2>
            <p className="text-white/70 text-sm mt-1">
              No sales middlemen — your first call is with the person who will draw and approve your plan.
            </p>
          </div>
          <a href="#/contact" className="btn-gold px-6 py-3 shrink-0">
            Book a consultation
          </a>
        </div>
      </section>
    </>
  )
}
