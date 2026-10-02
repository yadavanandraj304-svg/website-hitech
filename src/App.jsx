import React, { Suspense, useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import HitechBuilders from './components/HitechBuilders'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingSocial from './components/FloatingSocial'
import Team from './pages/Team'
import Projects from './pages/Projects'
import Reviews from './pages/Reviews'
import ReviewsPreview from './components/ReviewsPreview'
import Login from './pages/admin/Login'
import Shell from './pages/admin/Shell'
import AdminInquiries from './pages/admin/Inquiries'
import AdminProjects from './pages/admin/Projects'
import AdminReviews from './pages/admin/Reviews'
import AdminSettings from './pages/admin/Settings'
import HouseScene from './components/HouseScene'
import { SiteProvider } from './lib/siteContext'
import { getToken } from './lib/admin'

// ---------------------------------------------------------------------------
// Hash router — no dependency, works on any static host.
//   #/                home (hero, services, builders, team, reviews, contact)
//   #/services        #/about   #/contact   #/projects   #/reviews   #/team
//   #/admin           sign-in + lead dashboard (protected)
//   #/admin/projects  #/admin/reviews  #/admin/settings
// ---------------------------------------------------------------------------

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  // Scroll to the top whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [hash])
  return hash.replace(/^#/, '') || '/'
}

function Page({ children }) {
  return <div className="pt-28 sm:pt-32">{children}</div>
}

function Home() {
  return (
    <>
      <Hero />
      <Services />
      <HitechBuilders />
      <ReviewsPreview />
      <About />
      <Team />
      <Contact />
    </>
  )
}

function AdminArea({ route }) {
  if (route.startsWith('/admin/projects')) {
    return (
      <Shell active="#/admin/projects">
        <AdminProjects />
      </Shell>
    )
  }
  if (route.startsWith('/admin/reviews')) {
    return (
      <Shell active="#/admin/reviews">
        <AdminReviews />
      </Shell>
    )
  }
  if (route.startsWith('/admin/settings')) {
    return (
      <Shell active="#/admin/settings">
        <AdminSettings />
      </Shell>
    )
  }
  return (
    <Shell active="#/admin">
      <AdminInquiries />
    </Shell>
  )
}

function Routed() {
  const raw = useHashRoute()
  const route = raw.startsWith('/inquiries') ? '/admin' : raw

  if (route.startsWith('/admin')) {
    if (!getToken()) return <Login />
    return <AdminArea route={route} />
  }

  const home = route === '/'
  let content
  if (route === '/services') {
    content = (
      <Page>
        <Services />
      </Page>
    )
  } else if (route === '/about') {
    content = (
      <Page>
        <About />
        <Team />
      </Page>
    )
  } else if (route === '/team') {
    content = <Team />
  } else if (route === '/contact') {
    content = (
      <Page>
        <Contact />
      </Page>
    )
  } else if (route === '/projects') {
    content = <Projects />
  } else if (route === '/reviews') {
    content = <Reviews />
  } else {
    content = <Home />
  }

  return (
    <div className="relative min-h-screen bg-warm">
      {/* The 3D house stays mounted (a fresh WebGL context per navigation is
          what causes CONTEXT_LOST) but its render loop is fully PAUSED unless
          the home page is visible — zero background GPU work, zero lag. */}
      <div
        className="canvas-container"
        style={{ visibility: home ? 'visible' : 'hidden', display: home ? undefined : 'none' }}
        aria-hidden="true"
      >
        {!home ? null : (
          <Suspense fallback={null}>
            <HouseScene paused={!home} />
          </Suspense>
        )}
      </div>

      <div className="section-content">
        <Header />
        {content}
        <Footer />
      </div>

      <FloatingSocial />
    </div>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <Routed />
    </SiteProvider>
  )
}
