import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { applySettings } from '../site'

// ---------------------------------------------------------------------------
// Loads the admin-editable site content (GET /api/settings) and merges it over
// the defaults in src/site.js. Components keep importing from '../site'; this
// provider bumps a version that re-renders the whole tree whenever settings
// arrive — or after the admin saves new ones (call refresh() from anywhere).
// ---------------------------------------------------------------------------

const SiteContext = createContext({ version: 0, refresh: () => {} })

export function SiteProvider({ children }) {
  const [version, setVersion] = useState(0)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.ok) {
        applySettings(data.settings)
        setVersion((v) => v + 1)
      }
    } catch {
      /* backend offline — the defaults in site.js stay in effect */
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return <SiteContext.Provider value={{ version, refresh }}>{children}</SiteContext.Provider>
}

export function useSiteMeta() {
  return useContext(SiteContext)
}
