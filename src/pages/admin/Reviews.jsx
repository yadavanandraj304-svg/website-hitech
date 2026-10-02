import React, { useCallback, useEffect, useState } from 'react'
import { adminFetch } from '../../lib/admin'

// Admin → Reviews: approve, hide, reply to or delete client reviews.

const FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Published' },
  { id: 'hidden', label: 'Hidden' },
  { id: 'all', label: 'All' },
]

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replyDraft, setReplyDraft] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch('/api/reviews?all=1')
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Failed to load')
      setReviews(data.reviews || [])
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function patch(id, body) {
    const prev = reviews
    setReviews((list) => list.map((r) => (r.id === id ? { ...r, ...body } : r)))
    try {
      const res = await adminFetch(`/api/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Update failed')
      setError('')
    } catch (err) {
      setReviews(prev)
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this review permanently?')) return
    const prev = reviews
    setReviews((list) => list.filter((r) => r.id !== id))
    try {
      const res = await adminFetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
    } catch (err) {
      setReviews(prev)
      setError(err.message)
    }
  }

  const rows = reviews.filter((r) => filter === 'all' || r.status === filter)
  const pendingCount = reviews.filter((r) => r.status === 'pending').length

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`service-chip ${filter === f.id ? 'active' : ''}`}
            >
              {f.label}
              {f.id === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
            </button>
          ))}
        </div>
        <button onClick={load} className="btn-outline text-sm px-3 py-2 ml-auto">
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {loading && !reviews.length ? (
        <div className="text-center py-16 text-ink/50">Loading reviews…</div>
      ) : !rows.length ? (
        <div className="bg-white border border-dashed border-line rounded-2xl py-16 text-center">
          <p className="font-heading text-lg font-semibold mb-1">Nothing here</p>
          <p className="text-sm text-ink/55">New client reviews land in “Pending” for approval.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li key={r.id} className="bg-white border border-line rounded-2xl p-5">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 mr-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading font-semibold text-lg">{r.name}</h2>
                    <span className="text-gold-500">{'★'.repeat(r.rating || 5)}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        r.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : r.status === 'hidden'
                          ? 'bg-gray-100 text-ink/50 border-line'
                          : 'bg-gold-50 text-gold-700 border-gold-200'
                      }`}
                    >
                      {r.status}
                    </span>
                    {r.service && <span className="text-xs text-civil-700">{r.service}</span>}
                  </div>
                  <p className="text-xs text-ink/50 mt-1">{r.createdAt && new Date(r.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {r.status !== 'approved' && (
                    <button onClick={() => patch(r.id, { status: 'approved' })} className="btn-gold px-3 py-1.5 text-sm">
                      ✓ Approve
                    </button>
                  )}
                  {r.status !== 'hidden' && (
                    <button onClick={() => patch(r.id, { status: 'hidden' })} className="btn-outline px-3 py-1.5 text-sm">
                      Hide
                    </button>
                  )}
                  <button
                    onClick={() => remove(r.id)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-3 text-ink/75 bg-warm border border-line rounded-lg px-3 py-2 whitespace-pre-line">
                {r.message}
              </p>

              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <input
                  className="form-input flex-1 py-2 text-sm"
                  placeholder="Optional reply shown publicly under the review…"
                  value={replyDraft[r.id] ?? r.reply ?? ''}
                  onChange={(e) => setReplyDraft({ ...replyDraft, [r.id]: e.target.value })}
                />
                <button
                  onClick={() => patch(r.id, { reply: replyDraft[r.id] ?? r.reply ?? '' })}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Save reply
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
