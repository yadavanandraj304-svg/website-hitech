import React, { useCallback, useEffect, useState } from 'react'
import { adminFetch } from '../../lib/admin'

// Admin → Projects: upload photos (stored as base64 in server/data/projects.json),
// edit details and publish/unpublish them to the public #/projects gallery.

const emptyForm = { title: '', location: '', category: '', description: '', image: '', published: true }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch('/api/projects?all=1')
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Failed to load')
      setProjects(data.projects || [])
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

  function onPickImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.')
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        // Downscale large photos so the JSON store stays small
        const max = 1280
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        setForm((f) => ({ ...f, image: canvas.toDataURL('image/jpeg', 0.82) }))
        setError('')
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  async function save(e) {
    e.preventDefault()
    if (!form.title.trim()) return setError('Please give the project a title.')
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const res = await adminFetch(editingId ? `/api/projects/${editingId}` : '/api/projects', {
        method: editingId ? 'PATCH' : 'POST',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not save the project.')
      setForm(emptyForm)
      setEditingId(null)
      setNotice(editingId ? 'Project updated.' : 'Project added.')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function togglePublish(p) {
    const res = await adminFetch(`/api/projects/${p.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ published: !p.published }),
    })
    if (res.ok) setProjects((list) => list.map((x) => (x.id === p.id ? { ...x, published: !p.published } : x)))
  }

  async function remove(id) {
    if (!window.confirm('Delete this project permanently?')) return
    const res = await adminFetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) setProjects((list) => list.filter((x) => x.id !== id))
  }

  function edit(p) {
    setEditingId(p.id)
    setForm({
      title: p.title || '',
      location: p.location || '',
      category: p.category || '',
      description: p.description || '',
      image: p.image || '',
      published: p.published !== false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Editor */}
      <form onSubmit={save} className="bg-white border border-line rounded-2xl p-5 sm:p-6 mb-7">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-heading text-lg font-bold">{editingId ? 'Edit project' : 'Add a project'}</h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(emptyForm)
              }}
              className="text-sm text-ink/50 hover:text-ink"
            >
              cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="block text-sm font-medium text-ink/70 mb-1.5">Title *</span>
            <input className="form-input w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Modern 2.5 floor residence" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink/70 mb-1.5">Location</span>
            <input className="form-input w-full" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Birgunj-14, Parsa" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink/70 mb-1.5">Category</span>
            <input className="form-input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Residential / Commercial / Naksa" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink/70 mb-1.5">Photo</span>
            <input type="file" accept="image/*" onChange={onPickImage} className="w-full text-sm text-ink/60 file:mr-3 file:btn-outline file:rounded-lg file:border-0 file:px-3 file:py-1.5" />
          </label>
        </div>

        <label className="block mt-4">
          <span className="block text-sm font-medium text-ink/70 mb-1.5">Details</span>
          <textarea rows={3} className="form-input w-full resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Plot size, floors, scope of work, timeline, approvals…" />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Publish to the public gallery
          </label>

          <div className="ml-auto flex items-center gap-2">
            {form.image && (
              <img src={form.image} alt="preview" className="w-14 h-14 object-cover rounded-lg border border-line" />
            )}
            <button type="submit" disabled={busy} className="btn-gold px-5 py-2.5 text-sm">
              {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add project'}
            </button>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {notice && <p className="mt-3 text-sm text-emerald-700">{notice}</p>}
      </form>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-ink/50">Loading projects…</div>
      ) : !projects.length ? (
        <div className="bg-white border border-dashed border-line rounded-2xl py-14 text-center">
          <p className="font-heading text-lg font-semibold mb-1">No projects yet</p>
          <p className="text-sm text-ink/55">Add your first project above — it appears on #/projects once published.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id} className="bg-white border border-line rounded-2xl overflow-hidden">
              <div className="h-40 bg-warm">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-civil-700 to-civil-500" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 mr-auto">
                    <h3 className="font-heading font-semibold text-ink truncate">{p.title}</h3>
                    <p className="text-xs text-ink/50">
                      {[p.category, p.location].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      p.published ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-ink/50 border-line'
                    }`}
                  >
                    {p.published ? 'Live' : 'Draft'}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => edit(p)} className="btn-outline px-3 py-1.5 text-sm">
                    Edit
                  </button>
                  <button onClick={() => togglePublish(p)} className="btn-outline px-3 py-1.5 text-sm">
                    {p.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
