// Admin session helpers — the token comes from POST /api/admin/login and is
// kept in sessionStorage, then sent as `x-admin-token` on every admin call.

const KEY = 'hitechAdminToken'

export function getToken() {
  return sessionStorage.getItem(KEY) || ''
}

export function setToken(token) {
  if (token) sessionStorage.setItem(KEY, token)
  else sessionStorage.removeItem(KEY)
}

export async function adminLogin(email, password) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.ok) throw new Error(data.error || 'Login failed.')
  setToken(data.token)
  return data
}

export async function adminLogout() {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: { 'x-admin-token': getToken() },
    })
  } catch {
    /* ignore */
  }
  setToken('')
}

export async function adminFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
      'x-admin-token': getToken(),
    },
  })
  if (res.status === 401) {
    setToken('')
    window.location.hash = '#/admin'
    throw new Error('Session expired — please sign in again.')
  }
  return res
}
