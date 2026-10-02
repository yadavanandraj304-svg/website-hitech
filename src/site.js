// ---------------------------------------------------------------------------
// Central site configuration for Hitech Civil Design Consultancy
// Edit this file to update contact details, social links, services and the
// inquiry endpoint — everything else on the site reads from here.
//
// These values are ALSO editable from the admin dashboard (#/admin → Settings):
// the backend keeps its copy in server/data/settings.json and applySettings()
// below merges it over these defaults when GET /api/settings responds.
// ---------------------------------------------------------------------------

export const site = {
  name: 'Hi-Tech Civil Design Consultancy',
  shortName: 'Hi-Tech Civil',
  division: 'Rajbaba Creative Builders',
  location: 'Birgunj-14, Parsa, Nepal',
  tagline: 'Bringing Your Dream Spaces to Life in Birgunj',
  // Shown under the title in the header + footer, next to the circular logo
  established: 'Birgunj, Parsa | Estd. 2073',
}

export const contact = {
  phoneDisplay: '+977 9855038305',
  whatsapp: '9779855038305', // digits only, with country code
  email: 'hitechrajesh2023@gmail.com', // public contact + inquiry inbox
  address: 'Birgunj-14, Parsa, Nepal',
  hours: 'Sun – Fri : 9:00 AM – 6:00 PM',
}

const WHATSAPP_TEXT = encodeURIComponent(
  'Hello Hitech Civil Design Consultancy, I would like to inquire about your services.'
)

export const social = {
  facebook: 'https://www.facebook.com/p/Hi-Tech-Civil-Design-Consultancy-Birgunj-61588359574251/',
  tiktok: 'https://www.tiktok.com/@hitechrajbaba',
  whatsapp: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${WHATSAPP_TEXT}`,
}

// Leadership + engineering team — editable from admin → Settings
export const team = [
  {
    name: 'Er. Rajesh Yadav',
    role: 'Chairman',
    bio: 'Leads the consultancy across design, valuation and municipal approvals in Birgunj and Parsa.',
  },
  {
    name: 'Er. Krishna Dwivedi',
    role: 'Engineer',
    bio: 'Structural and naksa specialist — takes drawings from sketch to municipal approval and site execution.',
  },
]

// Merge the backend's saved content over the defaults above. Called by
// src/lib/siteContext.jsx; mutates the exported objects in place so every
// component importing them picks the values up on the next render.
export function applySettings(settings) {
  if (!settings) return
  if (settings.site) Object.assign(site, settings.site)
  if (settings.home) Object.assign(home, settings.home)
  if (settings.contact) Object.assign(contact, settings.contact)
  if (settings.social) {
    social.facebook = settings.social.facebook ?? social.facebook
    social.tiktok = settings.social.tiktok ?? social.tiktok
  }
  if (Array.isArray(settings.team) && settings.team.length) {
    team.splice(0, team.length, ...settings.team)
  }
  social.whatsapp = `https://wa.me/${(contact.whatsapp || '').replace(/\D/g, '')}?text=${WHATSAPP_TEXT}`
}

// Inquiry API — handled by the Express backend (server/index.js), which emails
// the owner (codework143@gmail.com) and stores the lead on disk.
export const INQUIRY_ENDPOINT = '/api/inquiry'

export const services = [
  {
    id: '3d-interior-design',
    title: '3D Interior Design',
    icon: 'interior',
    color: 'blue',
    blurb:
      'Photoreal 3D visualization of your home — furniture, lighting, materials and finishes decided before a single brick is laid.',
    features: [
      '3D Home Visualization',
      'Modular Interior Renders',
      'Vastu-compliant Layouts',
      'Furniture & finish selection',
    ],
    cta: 'Inquire',
    formValue: '3D Interior Design',
  },
  {
    id: '3d-exterior-design',
    title: '3D Exterior Design',
    icon: 'exterior',
    color: 'blue',
    blurb:
      'Elevation designs and exterior walkthroughs so you can see the finished building from every angle.',
    features: [
      'Elevation & facade design',
      '3D Walkthroughs',
      'Colour & material schemes',
      'Landscape frontage ideas',
    ],
    cta: 'Inquire',
    formValue: '3D Exterior Design',
  },
  {
    id: 'property-valuation',
    title: 'Property Valuation Services',
    icon: 'valuation',
    color: 'amber',
    blurb:
      'Official, bank-acceptable valuation reports prepared by certified civil engineers for loans, visas and legal use.',
    features: [
      'Bank Collateral Valuation',
      'Visa / Embassy Valuation',
      'Lalpurja verification support',
      'Legal documentation support',
    ],
    cta: 'Book Valuation',
    formValue: 'Property Valuation',
  },
  {
    id: 'naksa-pass',
    title: 'Civil Engineering & Naksa Pass',
    icon: 'naksa',
    color: 'blue',
    blurb:
      'Municipal approval drawings and structural analysis that clear the Birgunj Metropolitan City approval process the first time.',
    features: [
      'Municipal Approval Drawings',
      'Structural Analysis',
      'Naksa Pass submission',
      'Foundation & RCC detailing',
    ],
    cta: 'Inquire',
    formValue: 'Naksa Pass / Civil Planning',
  },
  {
    id: 'construction',
    title: 'Construction & Building Work',
    icon: 'construction',
    color: 'amber',
    featured: true,
    blurb:
      'Turnkey residential and commercial execution by our construction wing, Rajbaba Creative Builders — drawings to handover under one roof.',
    features: [
      'Turnkey Contracting',
      'Site Supervision',
      'Residential & Commercial Build',
      'Structural Execution',
    ],
    cta: 'Get a Quote',
    formValue: 'Building Construction (Rajbaba Creative Builders)',
  },
]

// Values sent to the inquiry form's "Selected Service" field
export const serviceOptions = services.map((s) => s.formValue)

// Home-page hero + stat counters — editable from admin → Settings → Home page
export const home = {
  heroTitle: 'Bringing Your Dream Spaces to Life in Birgunj',
  heroSubtitle:
    '3D interior & exterior design, certified property valuation, civil engineering & naksa pass — plus turnkey construction by Rajbaba Creative Builders.',
}

export const stats = [
  { value: '100+', label: 'Projects Delivered' },
  { value: '10+', label: 'Years Experience' },
  { value: '500+', label: 'Happy Clients' },
  { value: '2', label: 'Brands, One Team' },
]
