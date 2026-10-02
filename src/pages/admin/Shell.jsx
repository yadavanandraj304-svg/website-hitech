import React from 'react'
import Logo from '../../components/Logo'
import { adminLogout, getToken } from '../../lib/admin'
import { site } from '../../site'

const TABS = [
  { label: 'Inquiries', href: '#/admin' },
  { label: 'Projects', href: '#/admin/projects' },
  { label: 'Reviews', href: '#/admin/reviews' },
  { label: 'Settings', href: '#/admin/settings' },
]

export default function Shell({ active = '#/admin', children }) {
  if (!getToken()) {
    window.location.hash = '#/admin'
    return null
  }

  async function logout() {
    await adminLogout()
    window.location.hash = '#/'
  }

  return (
    <div className="min-h-screen bg-warm text-ink">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <a href="#/admin" className="flex items-center gap-2.5">
            <Logo size={36} />
            <span className="hidden sm:block leading-tight">
              <span className="block font-heading font-bold text-sm">Admin</span>
              <span className="block text-[10px] uppercase tracking-widest text-ink/50">
                {site.shortName}
              </span>
            </span>
          </a>

          <nav className="flex items-center gap-1 ml-3 overflow-x-auto">
            {TABS.map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  active === tab.href
                    ? 'bg-civil-700 text-white font-semibold'
                    : 'text-ink/65 hover:bg-civil-50 hover:text-civil-700'
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a href="#/" className="btn-outline text-sm px-3 py-1.5 hidden sm:inline-flex">
              View site
            </a>
            <button onClick={logout} className="btn-outline text-sm px-3 py-1.5">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  )
}
