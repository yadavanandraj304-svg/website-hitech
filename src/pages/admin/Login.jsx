import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Logo from '../../components/Logo'
import { adminLogin } from '../../lib/admin'
import { site } from '../../site'

// Admin sign-in — credentials live in .env (ADMIN_EMAIL / ADMIN_PASSWORD).

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await adminLogin(email, password)
      // A distinct hash guarantees the hashchange fires even when we are
      // already sitting on #/admin (otherwise the login form never unmounts).
      window.location.hash = '#/admin/inquiries'
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-line rounded-2xl p-7 sm:p-8 shadow-civil">
          <div className="flex items-center gap-3 mb-6">
            <Logo size={46} />
            <div>
              <p className="font-heading font-bold text-ink leading-tight">Admin Dashboard</p>
              <p className="text-xs text-ink/55">{site.name}</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input w-full"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-gold w-full justify-center py-3">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-line flex items-center justify-between text-sm">
            <a href="#/" className="text-ink/55 hover:text-civil-700">
              ← Back to website
            </a>
            <span className="text-xs text-ink/40">Leads · Projects · Reviews · Settings</span>
          </div>
        </div>

        <p className="text-center text-xs text-ink/40 mt-4">
          Dashboard URL: #/admin · access is logged in the server console
        </p>
      </motion.div>
    </div>
  )
}
