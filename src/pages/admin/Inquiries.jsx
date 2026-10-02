import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { adminFetch } from '../../lib/admin'
import { site } from '../../site'

const STATUSES = ['new', 'contacted', 'won', 'closed']

const STATUS_META = {
  new: { label: 'New', cls: 'bg-civil-50 text-civil-700 border-civil-200' },
  contacted: { label: 'Contacted', cls: 'bg-gold-50 text-gold-700 border-gold-200' },
  won: { label: 'Won', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  closed: { label: 'Closed', cls: 'bg-gray-100 text-gray-600 border-line' },
}

function relativeTime(iso) {
  if (!iso) return ''
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  return new Date(iso).toLocaleDateString()
}

function intlPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('977')) return digits
  if (digits.startsWith('0')) return '977' + digits.slice(1)
  return '977' + digits
}

function waLink(inq) {
  const text = `Hello ${inq.name}, this is ${site.name} about your inquiry${
    inq.services?.length ? ` (${inq.services.join(', ')})` : ''
  }.`
  return `https://wa.me/${intlPhone(inq.phone)}?text=${encodeURIComponent(text)}`
}

function downloadCsv(rows) {
  const head = ['Received', 'Name', 'Phone', 'Email', 'Services', 'Location', 'Message', 'Status', 'Emailed']
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const body = rows.map((r) =>
    [r.receivedAt, r.name, r.phone, r.email, (r.services || []).join(' | '), r.location, r.message, r.status || 'new', r.emailed ? 'yes' : 'no']
      .map(esc)
      .join(',')
  )
  const url = URL.createObjectURL(new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Inquiries() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [updated, setUpdated] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch('/api/inquiries')
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Failed to load')
      setItems(data.inquiries || [])
      setError('')
      setUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 60000)
    return () => clearInterval(t)
  }, [load])

  async function setStatus(id, status) {
    const prev = items
    setItems((list) => list.map((r) => (r.id === id ? { ...r, status } : r)))
    try {
      const res = await adminFetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Update failed')
      setUpdated(new Date().toLocaleTimeString())
      setError('')
    } catch (err) {
      setItems(prev)
      setError(err.message)
    }
  }

  const counts = useMemo(() => {
    const c = { total: items.length, new: 0, contacted: 0, won: 0, closed: 0, today: 0 }
    const todayStart = new Date().setHours(0, 0, 0, 0)
    for (const r of items) {
      const s = r.status || 'new'
      if (c[s] !== undefined) c[s] += 1
      if (r.receivedAt && new Date(r.receivedAt).getTime() >= todayStart) c.today += 1
    }
    return c
  }, [items])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((r) => (filter === 'all' ? true : (r.status || 'new') === filter))
      .filter((r) =>
        !q
          ? true
          : [r.name, r.phone, r.email, r.location, r.message, (r.services || []).join(' ')].join(' ').toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
  }, [items, query, filter])

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: counts.total, tone: 'text-ink' },
          { label: 'New', value: counts.new, tone: 'text-civil-600' },
          { label: 'Contacted', value: counts.contacted, tone: 'text-gold-700' },
          { label: 'Won', value: counts.won, tone: 'text-emerald-700' },
          { label: 'Today', value: counts.today, tone: 'text-seal' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-line rounded-xl px-4 py-3">
            <p className={`font-heading text-2xl font-bold ${s.tone}`}>{s.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-ink/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, service, message…"
          className="form-input flex-1 min-w-[220px] py-2.5"
        />
        <div className="flex flex-wrap gap-1.5">
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`service-chip ${filter === s ? 'active' : ''}`}
            >
              {s === 'all' ? 'All' : STATUS_META[s].label}
            </button>
          ))}
        </div>
        <button onClick={load} className="btn-outline text-sm px-3 py-2">
          ↻ Refresh
        </button>
        <button
          onClick={() => downloadCsv(rows)}
          disabled={!rows.length}
          className="btn-outline text-sm px-3 py-2 disabled:opacity-40"
        >
          ⬇ CSV
        </button>
      </div>

      {error && (
        <div className="mb-5 border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading && !items.length ? (
        <div className="text-center py-16 text-ink/50">Loading inquiries…</div>
      ) : !rows.length ? (
        <div className="bg-white border border-dashed border-line rounded-2xl py-16 text-center">
          <p className="font-heading text-lg font-semibold mb-1">No inquiries yet</p>
          <p className="text-sm text-ink/55">
            Leads from the Service Inquiry Form appear here the moment they arrive.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => {
            const status = r.status || 'new'
            const meta = STATUS_META[status] || STATUS_META.new
            return (
              <li key={r.id} className="bg-white border border-line rounded-2xl p-5">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 mr-auto">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading font-semibold text-lg">{r.name}</h2>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${meta.cls}`}>{meta.label}</span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border ${
                          r.emailed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-ink/50 border-line'
                        }`}
                      >
                        {r.emailed ? 'Emailed' : 'Saved only'}
                      </span>
                    </div>
                    <p className="text-xs text-ink/50 mt-1">
                      {relativeTime(r.receivedAt)}
                      {r.receivedAt ? ` · ${new Date(r.receivedAt).toLocaleString()}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(r.id, e.target.value)}
                      className="form-input py-1.5 text-sm"
                      aria-label="Lead status"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_META[s].label}
                        </option>
                      ))}
                    </select>
                    <a href={`tel:+${intlPhone(r.phone)}`} className="btn-outline px-3 py-1.5 text-sm">
                      📞 Call
                    </a>
                    <a href={waLink(r)} target="_blank" rel="noreferrer" className="btn-gold px-3 py-1.5 text-sm">
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-sm">
                  <p>
                    <span className="text-ink/50">Phone:</span>{' '}
                    <a href={`tel:+${intlPhone(r.phone)}`} className="font-medium text-seal hover:underline">
                      {r.phone}
                    </a>
                    {r.email && (
                      <>
                        {'  ·  '}
                        <span className="text-ink/50">Email:</span>{' '}
                        <a href={`mailto:${r.email}`} className="text-seal hover:underline">
                          {r.email}
                        </a>
                      </>
                    )}
                  </p>
                  {r.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.services.map((s) => (
                        <span key={s} className="text-xs bg-civil-50 text-civil-700 border border-civil-200 rounded-full px-2.5 py-0.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {r.location && (
                    <p>
                      <span className="text-ink/50">Location:</span> {r.location}
                    </p>
                  )}
                  {r.message && (
                    <p className="bg-warm border border-line rounded-lg px-3 py-2 text-ink/80">{r.message}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-center text-xs text-ink/40 mt-8">
        {updated ? `Updated ${updated} · auto-refresh every 60s · ` : ''}
        {counts.total} lead{counts.total === 1 ? '' : 's'} stored on this machine
      </p>
    </>
  )
}
