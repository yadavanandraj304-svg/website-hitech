import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { site, contact, serviceOptions, INQUIRY_ENDPOINT } from '../site'
import { isSupabaseConfigured, insertInquiry } from '../lib/supabase'
import { goTo, takePendingService } from '../lib/nav'
import { WhatsAppIcon } from './Header'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  service: '',
  location: '',
  message: '',
}

export default function Contact() {
  const [formData, setFormData] = useState(emptyForm)
  const [selected, setSelected] = useState([])
  const [status, setStatus] = useState('idle') // idle | sending | success | error | need-service
  const [toast, setToast] = useState(null) // { type: 'success' | 'error', title, message }

  // Auto-dismiss the confirmation toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 7000)
    return () => clearTimeout(t)
  }, [toast])

  // A service picked on another page (or before navigation) preselects here
  useEffect(() => {
    const value = takePendingService()
    if (value) {
      setSelected([value])
      setFormData((f) => ({ ...f, service: value }))
      const t = setTimeout(() => goTo('contact-form'), 250)
      return () => clearTimeout(t)
    }
  }, [])

  // Service cards / hero CTAs can preselect a service via a custom event
  useEffect(() => {
    const handler = (e) => {
      const value = e?.detail
      if (value) {
        setSelected([value])
        setFormData((f) => ({ ...f, service: value }))
      }
      goTo('contact-form')
    }
    window.addEventListener('select-service', handler)
    return () => window.removeEventListener('select-service', handler)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleService = (svc) => {
    setSelected((prev) => {
      const next = prev.includes(svc)
        ? prev.filter((s) => s !== svc)
        : [...prev, svc]
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const chosen = selected.length
      ? selected
      : formData.service
      ? [formData.service]
      : []
    if (chosen.length === 0) {
      setStatus('need-service')
      setTimeout(() => setStatus('idle'), 5000)
      return
    }

    setStatus('sending')

    const row = {
      full_name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      location: formData.location.trim() || null,
      services: chosen,
      message: formData.message.trim() || null,
    }

    try {
      if (isSupabaseConfigured) {
        // 1) Write the lead straight into the `inquiries` table
        await insertInquiry(row)
        // 2) Best-effort: also notify the owner by email via the Express API
        fetch(INQUIRY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...row, service: chosen.join(', ') }),
        }).catch(() => {})
      } else {
        // Supabase keys not set yet — keep the existing email API working
        const res = await fetch(INQUIRY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: row.full_name,
            phone: row.phone,
            email: row.email,
            services: chosen,
            service: chosen.join(', '),
            location: row.location,
            message: row.message,
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Request failed')
        }
      }

      setStatus('success')
      setToast({
        type: 'success',
        title: 'Inquiry sent!',
        message: "Thank you — your details have been received. We'll contact you shortly on WhatsApp or by phone.",
      })
      setFormData(emptyForm)
      setSelected([])
    } catch (err) {
      setStatus('error')
      setToast({
        type: 'error',
        title: 'Could not send inquiry',
        message: 'Something went wrong. Please WhatsApp us directly — we still want to help.',
      })
    }

    setTimeout(() => setStatus('idle'), 6000)
  }

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(15,44,89,0.08),transparent_60%)]" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-civil-700 tracking-widest uppercase text-sm mb-3 font-medium">
            Contact &amp; Service Booking
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-ink">
            <span className="text-ink">Get a </span>
            <span className="gradient-text">Free Quote</span>
          </h2>
          <p className="text-ink/60 font-body text-lg max-w-2xl mx-auto">
            Select the service you need — we'll reply on WhatsApp or call you
            back the same working day.
          </p>
          <div className="mt-4 w-24 h-1 section-line mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Form */}
          <motion.div
            id="contact-form"
            className="lg:col-span-3 glow-border rounded-3xl p-6 md:p-8 bg-white"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-heading text-xl font-semibold text-ink mb-6">
              Service Inquiry Form
            </h3>

            {/* Service selectors */}
            <div className="mb-6">
              <label className="block text-ink/75 font-body text-sm mb-3">
                Select Service <span className="text-civil-700">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {serviceOptions.map((svc) => (
                  <button
                    type="button"
                    key={svc}
                    onClick={() => toggleService(svc)}
                    className={`service-chip px-4 py-2 rounded-full text-sm font-body ${
                      selected.includes(svc) ? 'active' : ''
                    }`}
                    aria-pressed={selected.includes(svc)}
                  >
                    {selected.includes(svc) ? '✓ ' : ''}
                    {svc}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-ink/75 font-body text-sm mb-2">
                    Full Name <span className="text-civil-700">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 rounded-xl font-body"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-ink/75 font-body text-sm mb-2">
                    Phone / WhatsApp Number <span className="text-civil-700">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input w-full px-4 py-3 rounded-xl font-body"
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-ink/75 font-body text-sm mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 rounded-xl font-body"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-ink/75 font-body text-sm mb-2">
                    Project Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 rounded-xl font-body"
                    placeholder="Ward / tole / city"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink/75 font-body text-sm mb-2">
                  Selected Service (dropdown)
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-xl font-body"
                >
                  <option value="">Choose a service…</option>
                  {serviceOptions.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-ink/75 font-body text-sm mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="form-input w-full px-4 py-3 rounded-xl font-body resize-none"
                  placeholder="Tell us about your plot size, floors, timeline, or the property you need valued…"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                className="btn-gold w-full px-8 py-4 rounded-xl font-heading font-semibold text-lg disabled:opacity-60"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'sending'
                  ? 'Sending…'
                  : status === 'success'
                  ? '✓ Inquiry Sent!'
                  : status === 'need-service'
                  ? 'Please select a service ↑'
                  : 'Send Service Inquiry'}
              </motion.button>

              <AnimatePresence>
                {status === 'need-service' && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gold-700 font-body text-sm"
                  >
                    Please select at least one service above ↑
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="text-center text-ink/45 font-body text-xs">
                Your details go straight to {contact.email} — no spam, ever.
              </p>
            </form>
          </motion.div>

          {/* Contact info sidebar */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-5 lg:sticky lg:top-28"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href={contact.whatsappLink || `https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-border rounded-2xl p-6 bg-white flex items-center gap-4 hover:border-green-400/60 transition-colors group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                <WhatsAppIcon className="w-7 h-7" />
              </div>              <div>
                <h3 className="font-heading text-lg font-semibold text-ink">
                  WhatsApp Us
                </h3>
                <p className="text-ink/55 font-body text-sm">
                  Fastest reply — send property photos &amp; location pins
                </p>
              </div>
            </a>

            <div className="glow-border rounded-2xl p-6 bg-white">
              <h3 className="font-heading text-lg font-semibold text-ink mb-4">
                Office &amp; Hours
              </h3>
              <ul className="space-y-3 font-body text-sm text-ink/70">
                <li className="flex gap-3">
                  <span className="text-civil-700">📍</span>
                  {contact.address}
                </li>
                <li className="flex gap-3">
                  <span className="text-civil-700">📞</span>
                  <a
                    href={`tel:${contact.phoneDisplay.replace(/\s/g, '')}`}
                    className="hover:text-civil-700 transition-colors"
                  >
                    {contact.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="text-civil-700">✉️</span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-civil-700 transition-colors break-all"
                  >
                    {contact.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="text-civil-700">🕘</span>
                  {contact.hours}
                </li>
              </ul>
            </div>

            <div className="glow-border rounded-2xl p-6 bg-white">
              <h3 className="font-heading text-lg font-semibold text-ink mb-4">
                Find Us
              </h3>
              {/* Google Maps embed — replace the q= value with the exact business pin */}
              <div className="overflow-hidden rounded-xl border border-line">
                <iframe
                  title="Hi-Tech Civil Design Consultancy location map"
                  src="https://www.google.com/maps?q=Birgunj-14,%20Parsa,%20Nepal&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  site.name + ', ' + contact.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-civil-700 hover:text-civil-500 font-body text-sm transition-colors"
              >
                Open in Google Maps →
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success / error confirmation toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="inquiry-toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, x: 40, y: -12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className={`inquiry-toast ${toast.type === 'error' ? 'error' : ''}`}
          >
            <span className="toast-icon">
              {toast.type === 'error' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <div>
              <h4>{toast.title}</h4>
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast-close"
              aria-label="Dismiss notification"
              onClick={() => setToast(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
