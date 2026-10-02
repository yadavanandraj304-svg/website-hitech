// ---------------------------------------------------------------------------
// Hitech Civil Design Consultancy — inquiry + site-content backend
//
// PUBLIC
//   POST  /api/inquiry        contact form → email + data/inquiries.json
//   GET   /api/settings       editable site content (phone, email, links, team)
//   GET   /api/reviews        approved client reviews
//   POST  /api/reviews        submit a review (held for approval)
//   GET   /api/projects       published projects
//   GET   /api/health         uptime check
//
// ADMIN (requires `x-admin-token` from POST /api/admin/login)
//   POST  /api/admin/login    { email, password } → { token }
//   POST  /api/admin/logout
//   GET   /api/inquiries      list every lead
//   PATCH /api/inquiries/:id  update lead status
//   PUT   /api/settings       save site content
//   GET   /api/reviews?all=1  + PATCH / DELETE /api/reviews/:id
//   GET   /api/projects?all=1 + POST / PATCH / DELETE /api/projects/:id
//
// Email uses Gmail SMTP via an "App Password" (GMAIL_USER / GMAIL_APP_PASSWORD
// in .env). Without it the inquiry is still saved, so no lead is ever lost.
// ---------------------------------------------------------------------------

import express from 'express'
import nodemailer from 'nodemailer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Tiny .env loader (no dependency needed)
const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
  }
}

const DATA_DIR = path.join(__dirname, 'data')
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json')
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json')

// Some hosts export a placeholder PORT=0 — treat anything invalid as 3001.
const parsedPort = Number.parseInt(process.env.PORT, 10)
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3001
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'hitechrajesh2023@gmail.com'
const GMAIL_USER = process.env.GMAIL_USER || ''
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''
// Admin logins: every email in ADMIN_EMAILS can sign in. When ADMIN_EMAILS is
// not set, the three owner addresses plus any single ADMIN_EMAIL are accepted.
const DEFAULT_ADMIN_EMAILS = [
  'yadavanandraj304@gmail.com',
  'codework143@gmail.com',
  'hitechrajesh2023@gmail.com',
]
const explicitAdmins = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)
const singleAdmin = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
const ADMIN_EMAILS = explicitAdmins.length
  ? explicitAdmins
  : [...new Set([...(singleAdmin ? [singleAdmin] : []), ...DEFAULT_ADMIN_EMAILS])]
// Per-admin passwords live (as salted SHA-256 hashes only) in
// server/data/admin-auth.json, keyed by email: { "emails": { "a@b.c": { salt,
// passwordHash } }, "shared": { salt, passwordHash } }. "shared" covers every
// admin email, a per-email entry wins for that address, and both fall back to
// ADMIN_PASSWORD from the environment.
function loadPasswordVerifier() {
  try {
    const f = path.join(DATA_DIR, 'admin-auth.json')
    if (!fs.existsSync(f)) return null
    const parsed = JSON.parse(fs.readFileSync(f, 'utf8'))
    const perEmail = parsed && typeof parsed === 'object' ? parsed.emails || {} : {}
    const shared = parsed && typeof parsed === 'object' ? parsed.shared || null : null
    const sha = (s, text) => crypto.createHash('sha256').update(`${s}:${text}`).digest('hex')
    return (email, candidate) => {
      const entry = perEmail[email] || null
      if (entry && entry.salt && entry.passwordHash) {
        return sha(entry.salt, candidate) === entry.passwordHash
      }
      if (shared && shared.salt && shared.passwordHash) {
        return sha(shared.salt, candidate) === shared.passwordHash
      }
      return null // fall back to ADMIN_PASSWORD
    }
  }
  catch {
    return null
  }
}
const verifyPassword = loadPasswordVerifier()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'HiTech@Birgunj#2073'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

const VALID_STATUSES = ['new', 'contacted', 'won', 'closed']
const REVIEW_STATUSES = ['pending', 'approved', 'hidden']

const app = express()
app.use(express.json({ limit: '8mb' })) // projects store base64 photos

// Serve the built website (dist/) when deployed — locally Vite dev serves it.
const DIST_DIR = path.join(__dirname, '..', 'dist')
if (fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  app.use(express.static(DIST_DIR))
}

// --- storage helpers --------------------------------------------------------

function ensure(file, fallback) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(fallback, null, 2))
}
function read(file, fallback) {
  ensure(file, fallback)
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8') || 'null') ?? fallback
  } catch {
    return fallback
  }
}
function write(file, value) {
  ensure(file, [])
  fs.writeFileSync(file, JSON.stringify(value, null, 2))
}
const readInquiries = () => read(INQUIRIES_FILE, [])

// --- default site content ---------------------------------------------------

const DEFAULT_SETTINGS = {
  site: {
    name: 'Hi-Tech Civil Design Consultancy',
    shortName: 'Hi-Tech Civil',
    division: 'Rajbaba Creative Builders',
    location: 'Birgunj-14, Parsa, Nepal',
    tagline: 'Bringing Your Dream Spaces to Life in Birgunj',
    established: 'Birgunj, Parsa | Estd. 2073',
  },
  home: {
    heroTitle: 'Bringing Your Dream Spaces to Life in Birgunj',
    heroSubtitle:
      '3D interior & exterior design, certified property valuation, civil engineering & naksa pass — plus turnkey construction by Rajbaba Creative Builders.',
    stat1Value: '100+',
    stat1Label: 'Projects Delivered',
    stat2Value: '10+',
    stat2Label: 'Years Experience',
    stat3Value: '500+',
    stat3Label: 'Happy Clients',
    stat4Value: '2',
    stat4Label: 'Brands, One Team',
  },
  contact: {
    phoneDisplay: '+977 9855038305',
    whatsapp: '9779855038305',
    email: 'codework143@gmail.com',
    address: 'Birgunj-14, Parsa, Nepal',
    hours: 'Sun – Fri : 9:00 AM – 6:00 PM',
  },
  social: {
    facebook: 'https://www.facebook.com/p/Hi-Tech-Civil-Design-Consultancy-Birgunj-61588359574251/',
    tiktok: 'https://www.tiktok.com/@hitechrajbaba',
  },
  team: [
    {
      name: 'Er. Rajesh Yadav',
      role: 'Chairman',
      bio: 'Leads the consultancy with 10+ years across design, valuation and municipal approvals in Birgunj and Parsa.',
    },
    {
      name: 'Er. Krishna Dwivedi',
      role: 'Engineer',
      bio: 'Structural and naksa specialist — takes drawings from sketch to municipal approval and site execution.',
    },
  ],
}

function getSettings() {
  const saved = read(SETTINGS_FILE, null)
  if (!saved) {
    write(SETTINGS_FILE, DEFAULT_SETTINGS)
    return DEFAULT_SETTINGS
  }
  return {
    site: { ...DEFAULT_SETTINGS.site, ...(saved.site || {}) },
    home: { ...DEFAULT_SETTINGS.home, ...(saved.home || {}) },
    contact: { ...DEFAULT_SETTINGS.contact, ...(saved.contact || {}) },
    social: { ...DEFAULT_SETTINGS.social, ...(saved.social || {}) },
    team: Array.isArray(saved.team) && saved.team.length ? saved.team : DEFAULT_SETTINGS.team,
  }
}

// --- admin sessions ---------------------------------------------------------

const sessions = new Map() // token -> { expires }

function pruneSessions() {
  const now = Date.now()
  for (const [token, s] of sessions) if (s.expires < now) sessions.delete(token)
}

function requireAdmin(req, res, next) {
  pruneSessions()
  const token = req.get('x-admin-token') || req.query.token || ''
  const session = sessions.get(token)
  if (!session) return res.status(401).json({ ok: false, error: 'Please sign in again.' })
  session.expires = Date.now() + SESSION_TTL_MS
  next()
}

// --- email ------------------------------------------------------------------

const mailer =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      })
    : null

async function sendInquiryEmail(data) {
  if (!mailer) return { sent: false, reason: 'SMTP not configured' }

  const services = data.services?.length ? data.services.join(', ') : data.service || 'Not specified'
  const text = [
    `New service inquiry — ${data.name}`,
    '',
    `Name:             ${data.name}`,
    `Phone / WhatsApp: ${data.phone}`,
    `Email:            ${data.email || '—'}`,
    `Selected Service: ${services}`,
    `Project Location: ${data.location || '—'}`,
    '',
    'Message:',
    data.message || '—',
    '',
    `Received: ${data.receivedAt}`,
  ].join('\n')

  await mailer.sendMail({
    from: `"${data.name}" <${GMAIL_USER}>`,
    // Delivery target is the admin-editable "Email address" (Settings → Contact),
    // falling back to OWNER_EMAIL from the environment.
    to: getSettings().contact.email || OWNER_EMAIL,
    replyTo: data.email || GMAIL_USER,
    subject: `New inquiry: ${services} — ${data.name}`,
    text,
  })
  return { sent: true }
}

// =========================== public routes =================================

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    emailConfigured: Boolean(mailer),
    to: getSettings().contact.email || OWNER_EMAIL,
    admin: ADMIN_EMAILS.join(', '),
  })
})

app.get('/api/settings', (_req, res) => {
  res.json({ ok: true, settings: getSettings() })
})

app.post('/api/inquiry', async (req, res) => {
  try {
    const { name, phone, email, service, services, location, message } = req.body || {}

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({ ok: false, error: 'Name and phone are required.' })
    }
    const chosen = services?.length ? services : service ? [service] : []
    if (chosen.length === 0) {
      return res.status(400).json({ ok: false, error: 'Please select at least one service.' })
    }

    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      services: chosen,
      location: location?.trim() || '',
      message: message?.trim() || '',
      receivedAt: new Date().toISOString(),
      emailed: false,
      status: 'new',
    }

    // Always store first — email failure must not lose the lead.
    const list = readInquiries()
    list.push(record)
    write(INQUIRIES_FILE, list)

    try {
      const result = await sendInquiryEmail(record)
      record.emailed = result.sent
    } catch (err) {
      console.error('[mail] send failed:', err.message)
      record.mailError = err.message
    }

    const fresh = readInquiries()
    const idx = fresh.findIndex((r) => r.id === record.id)
    if (idx >= 0) {
      fresh[idx].emailed = record.emailed
      if (record.mailError) fresh[idx].mailError = record.mailError
      write(INQUIRIES_FILE, fresh)
    }

    res.json({ ok: true, emailed: record.emailed, id: record.id, ...(record.mailError ? { mailError: record.mailError } : {}) })
  } catch (err) {
    console.error('[inquiry] error:', err)
    res.status(500).json({ ok: false, error: 'Server error. Please WhatsApp us instead.' })
  }
})

app.get('/api/reviews', (req, res) => {
  const all = req.query.all === '1'
  const list = read(REVIEWS_FILE, [])
  const rows = all ? list : list.filter((r) => r.status === 'approved')
  rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ ok: true, count: rows.length, reviews: rows })
})

app.post('/api/reviews', (req, res) => {
  const { name, rating, service, message } = req.body || {}
  if (!name?.trim() || !message?.trim()) {
    return res.status(400).json({ ok: false, error: 'Please add your name and your review.' })
  }
  const stars = Math.min(5, Math.max(1, Number.parseInt(rating, 10) || 5))
  const record = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: name.trim(),
    rating: stars,
    service: service?.trim() || '',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    reply: '',
  }
  const list = read(REVIEWS_FILE, [])
  list.push(record)
  write(REVIEWS_FILE, list)
  res.json({ ok: true, review: record })
})

app.get('/api/projects', (req, res) => {
  const all = req.query.all === '1'
  const list = read(PROJECTS_FILE, [])
  const rows = all ? list : list.filter((p) => p.published)
  rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ ok: true, count: rows.length, projects: rows })
})

// ============================ admin routes =================================

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {}
  const normalized = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const passwordOk = verifyPassword
    ? verifyPassword(normalized, password) ?? password === ADMIN_PASSWORD
    : password === ADMIN_PASSWORD
  const ok = typeof password === 'string' && ADMIN_EMAILS.includes(normalized) && passwordOk
  if (!ok) {
    return res.status(401).json({ ok: false, error: 'Wrong email or password.' })
  }
  const token = crypto.randomBytes(24).toString('hex')
  sessions.set(token, { expires: Date.now() + SESSION_TTL_MS })
  res.json({ ok: true, token, admin: normalized })
})

app.post('/api/admin/logout', (req, res) => {
  const token = req.get('x-admin-token') || ''
  sessions.delete(token)
  res.json({ ok: true })
})

app.get('/api/inquiries', requireAdmin, (_req, res) => {
  const list = readInquiries()
  res.json({ ok: true, count: list.length, inquiries: list })
})

app.patch('/api/inquiries/:id', requireAdmin, (req, res) => {
  const { status } = req.body || {}
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status.' })
  }
  const list = readInquiries()
  const idx = list.findIndex((r) => r.id === req.params.id)
  if (idx < 0) return res.status(404).json({ ok: false, error: 'Inquiry not found.' })
  list[idx].status = status
  write(INQUIRIES_FILE, list)
  res.json({ ok: true, inquiry: list[idx] })
})

app.put('/api/settings', requireAdmin, (req, res) => {
  const body = req.body || {}
  const current = getSettings()
  const next = {
    site: { ...current.site, ...(body.site || {}) },
    home: { ...current.home, ...(body.home || {}) },
    contact: { ...current.contact, ...(body.contact || {}) },
    social: { ...current.social, ...(body.social || {}) },
    team: Array.isArray(body.team) && body.team.length ? body.team : current.team,
  }
  write(SETTINGS_FILE, next)
  res.json({ ok: true, settings: next })
})

app.patch('/api/reviews/:id', requireAdmin, (req, res) => {
  const { status, reply } = req.body || {}
  const list = read(REVIEWS_FILE, [])
  const idx = list.findIndex((r) => r.id === req.params.id)
  if (idx < 0) return res.status(404).json({ ok: false, error: 'Review not found.' })
  if (status !== undefined) {
    if (!REVIEW_STATUSES.includes(status)) return res.status(400).json({ ok: false, error: 'Invalid status.' })
    list[idx].status = status
  }
  if (reply !== undefined) list[idx].reply = String(reply)
  write(REVIEWS_FILE, list)
  res.json({ ok: true, review: list[idx] })
})

app.delete('/api/reviews/:id', requireAdmin, (req, res) => {
  const list = read(REVIEWS_FILE, [])
  const next = list.filter((r) => r.id !== req.params.id)
  if (next.length === list.length) return res.status(404).json({ ok: false, error: 'Review not found.' })
  write(REVIEWS_FILE, next)
  res.json({ ok: true })
})

app.post('/api/projects', requireAdmin, (req, res) => {
  const { title, location, category, description, image, published } = req.body || {}
  if (!title?.trim()) return res.status(400).json({ ok: false, error: 'Project title is required.' })
  const record = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    title: title.trim(),
    location: location?.trim() || '',
    category: category?.trim() || '',
    description: description?.trim() || '',
    image: typeof image === 'string' ? image : '',
    published: published !== false,
    createdAt: new Date().toISOString(),
  }
  const list = read(PROJECTS_FILE, [])
  list.push(record)
  write(PROJECTS_FILE, list)
  res.json({ ok: true, project: record })
})

app.patch('/api/projects/:id', requireAdmin, (req, res) => {
  const list = read(PROJECTS_FILE, [])
  const idx = list.findIndex((p) => p.id === req.params.id)
  if (idx < 0) return res.status(404).json({ ok: false, error: 'Project not found.' })
  const body = req.body || {}
  for (const key of ['title', 'location', 'category', 'description', 'image']) {
    if (body[key] !== undefined) list[idx][key] = String(body[key])
  }
  if (body.published !== undefined) list[idx].published = Boolean(body.published)
  write(PROJECTS_FILE, list)
  res.json({ ok: true, project: list[idx] })
})

app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const list = read(PROJECTS_FILE, [])
  const next = list.filter((p) => p.id !== req.params.id)
  if (next.length === list.length) return res.status(404).json({ ok: false, error: 'Project not found.' })
  write(PROJECTS_FILE, next)
  res.json({ ok: true })
})

// --- boot -------------------------------------------------------------------

ensure(INQUIRIES_FILE, [])
ensure(SETTINGS_FILE, DEFAULT_SETTINGS)
ensure(REVIEWS_FILE, [])
ensure(PROJECTS_FILE, [])
getSettings()

// Bind to all interfaces in production (RENDER/RAILWAY/FLY_IO set these; on
// your PC it stays localhost-only).
const HOST = process.env.HOST || '127.0.0.1'

app.listen(PORT, HOST, () => {
  console.log(`Hitech inquiry API listening on http://${HOST}:${PORT}`)
  if (fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.log('  serving the built website from dist/')
  }
  console.log(`  email → ${getSettings().contact.email || OWNER_EMAIL} ${mailer ? '(Gmail SMTP configured)' : '(SMTP not configured — inquiries saved to disk only)'}`)
  console.log(`  admins → ${ADMIN_EMAILS.join(', ')}`)
})
