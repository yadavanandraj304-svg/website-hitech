import React, { useEffect, useState } from 'react'
import { adminFetch } from '../../lib/admin'
import { useSiteMeta } from '../../lib/siteContext'
import { site as defaults, contact as defaultContact, social as defaultSocial, team as defaultTeam, home as defaultHome, stats as defaultStats } from '../../site'

// Admin → Settings: edit everything the public site displays.

const SECTIONS = [
  {
    title: 'Company',
    fields: [
      { key: 'name', label: 'Company name' },
      { key: 'shortName', label: 'Short name' },
      { key: 'division', label: 'Construction wing' },
      { key: 'tagline', label: 'Tagline' },
      { key: 'established', label: 'Header / footer tagline' },
      { key: 'location', label: 'Location line' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'phoneDisplay', label: 'Phone number' },
      { key: 'whatsapp', label: 'WhatsApp number (digits, with 977)' },
      { key: 'email', label: 'Email address' },
      { key: 'address', label: 'Office address' },
      { key: 'hours', label: 'Working hours' },
    ],
  },
  {
    title: 'Home page',
    group: 'home',
    fields: [
      { key: 'heroTitle', label: 'Hero heading (big text on top of the home page)' },
      { key: 'heroSubtitle', label: 'Hero subtext (mention the construction wing by name to highlight it)' },
    ],
  },
  {
    title: 'Social links',
    fields: [
      { key: 'facebook', label: 'Facebook URL' },
      { key: 'tiktok', label: 'TikTok URL' },
    ],
  },
]

export default function AdminSettings() {
  const { refresh } = useSiteMeta()
  const [form, setForm] = useState({ site: {}, home: {}, contact: {}, social: {} })
  const [stats, setStats] = useState(defaultStats)
  const [team, setTeam] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setForm({
            site: { ...defaults, ...d.settings.site },
            home: { ...defaultHome, ...d.settings.home },
            contact: { ...defaultContact, ...d.settings.contact },
            social: { ...defaultSocial, ...d.settings.social },
          })
          // stats live in the home group as statNValue / statNLabel pairs
          const h = { ...defaultHome, ...d.settings.home }
          setStats(defaultStats.map((s, i) => ({ value: h[`stat${i + 1}Value`] ?? s.value, label: h[`stat${i + 1}Label`] ?? s.label })))
          setTeam(d.settings.team?.length ? d.settings.team : defaultTeam)
        } else setError(d.error || 'Could not load settings')
      })
      .catch(() => {
        setForm({ site: { ...defaults }, home: { ...defaultHome }, contact: { ...defaultContact }, social: { ...defaultSocial } })
        setStats(defaultStats)
        setTeam(defaultTeam)
      })
  }, [])

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      // fold the four stat counters back into the home group
      const homeGroup = { ...form.home }
      stats.forEach((s, i) => {
        homeGroup[`stat${i + 1}Value`] = s.value
        homeGroup[`stat${i + 1}Label`] = s.label
      })
      const res = await adminFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify({ ...form, home: homeGroup, team: team.filter((m) => m.name?.trim()) }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not save settings.')
      refresh() // push the new values through the whole site immediately
      setNotice('Saved — the website is updated already.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const setIn = (group, key, value) =>
    setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }))

  const setTeamMember = (i, key, value) =>
    setTeam((list) => list.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)))

  // Pick + downscale a team member photo (same pipeline as project photos)
  function onPickMemberPhoto(i, e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file for the photo.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        // Square-crop around the centre, sized for the circular frame
        const size = Math.min(img.width, img.height)
        const canvas = document.createElement('canvas')
        canvas.width = 480
        canvas.height = 480
        canvas
          .getContext('2d')
          .drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            480,
            480
          )
        setTeamMember(i, 'photo', canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold">Site settings</h2>
          <p className="text-sm text-ink/55">These values power the header, footer, contact page and social buttons.</p>
        </div>
        <button type="submit" disabled={busy} className="btn-gold px-5 py-2.5 ml-auto">
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      {notice && <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{notice}</p>}

      <div className="grid gap-5 lg:grid-cols-2">
        {SECTIONS.map((section) => (
          <fieldset key={section.title} className="bg-white border border-line rounded-2xl p-5">
            <legend className="px-2 font-heading font-bold text-civil-700 uppercase tracking-wider text-xs">
              {section.title}
            </legend>
            <div className="grid gap-3.5">
              {section.fields.map((field) => {
                const group = section.group || (section.title === 'Company' ? 'site' : section.title === 'Contact' ? 'contact' : 'social')
                const value = form[group]?.[field.key] ?? ''
                return (
                  <label key={field.key} className="block">
                    <span className="block text-sm font-medium text-ink/70 mb-1">{field.label}</span>
                    <input
                      className="form-input w-full py-2"
                      value={value}
                      onChange={(e) => setIn(group, field.key, e.target.value)}
                    />
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}

        {/* Home page stat counters */}
        <fieldset className="bg-white border border-line rounded-2xl p-5 lg:col-span-2">
          <legend className="px-2 font-heading font-bold text-civil-700 uppercase tracking-wider text-xs">
            Home page — stat counters (shown under the hero)
          </legend>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="border border-line rounded-xl p-3.5">
                <label className="block mb-3">
                  <span className="block text-xs text-ink/55 mb-1">Number (e.g. 100+)</span>
                  <input
                    className="form-input w-full py-2"
                    value={s.value}
                    onChange={(e) => setStats((list) => list.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))}
                  />
                </label>
                <label className="block">
                  <span className="block text-xs text-ink/55 mb-1">Label</span>
                  <input
                    className="form-input w-full py-2"
                    value={s.label}
                    onChange={(e) => setStats((list) => list.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                  />
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Team */}
        <fieldset className="bg-white border border-line rounded-2xl p-5 lg:col-span-2">
          <legend className="px-2 font-heading font-bold text-civil-700 uppercase tracking-wider text-xs">
            Team
          </legend>
          <div className="grid gap-4">
            {team.map((member, i) => (
              <div key={i} className="border border-line rounded-xl p-3.5">
                {/* Photo — shown on the site above the member's name */}
                <div className="flex items-center gap-4 mb-3">
                  {member.photo ? (
                    <img src={member.photo} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-civil-50 border border-line" />
                  ) : (
                    <span className="w-16 h-16 rounded-full bg-civil-700/10 border border-dashed border-civil-700/40 flex items-center justify-center text-ink/40 text-xs">
                      No photo
                    </span>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="btn-outline text-xs px-3 py-1.5 cursor-pointer">
                      {member.photo ? 'Change photo' : 'Upload photo'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickMemberPhoto(i, e)} />
                    </label>
                    {member.photo && (
                      <button
                        type="button"
                        onClick={() => setTeamMember(i, 'photo', '')}
                        className="text-xs text-red-600 hover:underline text-left"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-ink/45 ml-auto max-w-[180px]">
                    Shown on the About/Team page above the name. Square photos look best.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto] items-start">
                <label className="block">
                  <span className="block text-xs text-ink/55 mb-1">Name</span>
                  <input className="form-input w-full py-2" value={member.name || ''} onChange={(e) => setTeamMember(i, 'name', e.target.value)} />
                </label>
                <label className="block">
                  <span className="block text-xs text-ink/55 mb-1">Role</span>
                  <input className="form-input w-full py-2" value={member.role || ''} onChange={(e) => setTeamMember(i, 'role', e.target.value)} />
                </label>
                <label className="block">
                  <span className="block text-xs text-ink/55 mb-1">Bio</span>
                  <input className="form-input w-full py-2" value={member.bio || ''} onChange={(e) => setTeamMember(i, 'bio', e.target.value)} />
                </label>
                <button
                  type="button"
                  onClick={() => setTeam((list) => list.filter((_, idx) => idx !== i))}
                  className="px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTeam((list) => [...list, { name: '', role: '', bio: '' }])}
            className="btn-outline mt-4 px-4 py-2 text-sm"
          >
            + Add team member
          </button>
        </fieldset>
      </div>
    </form>
  )
}
