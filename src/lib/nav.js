// ---------------------------------------------------------------------------
// Navigation helper for a multi-page site without a router.
//
// Sections live on the Home page; dedicated pages (#/services, #/contact, …)
// render them on their own. goTo() scrolls when the section is on screen and
// opens the right page otherwise, so every CTA works from anywhere.
// ---------------------------------------------------------------------------

const PAGE_FOR_SECTION = {
  home: '#/',
  '': '#/',
  services: '#/services',
  'hitech-builders': '#/',
  about: '#/about',
  team: '#/about',
  contact: '#/contact',
  'contact-form': '#/contact',
  projects: '#/projects',
  reviews: '#/reviews',
}

export function goTo(sectionId) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return true
  }
  const page = PAGE_FOR_SECTION[sectionId]
  if (page) window.location.hash = page
  return false
}

// A service was chosen from a card — preselect it in the inquiry form.
let pendingService = null

export function setPendingService(service) {
  pendingService = service
}

export function takePendingService() {
  const value = pendingService
  pendingService = null
  return value
}

export function inquireWith(serviceTitle) {
  if (serviceTitle) setPendingService(serviceTitle)
  window.dispatchEvent(new CustomEvent('select-service', { detail: serviceTitle }))
  if (!goTo('contact') && serviceTitle) {
    // Contact section isn't on this page — open it; the form picks the value up
    window.location.hash = '#/contact'
  }
}
