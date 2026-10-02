import React, { useState } from 'react'

// The official circular logo. Drop your image at public/logo.png and it is
// used automatically; until then (or if the file is missing/broken) the
// brand seal from the favicon renders inside the same circular frame.
const BRAND_SEAL = (
  <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
    <circle cx="32" cy="32" r="32" fill="#0F2C59" />
    <path d="M14 46h36" stroke="#E9A100" strokeWidth="5" strokeLinecap="round" />
    <rect x="18" y="24" width="9" height="22" rx="2" fill="#E9A100" />
    <rect x="31" y="16" width="9" height="30" rx="2" fill="#7b9bd3" />
    <circle cx="47" cy="20" r="5" fill="#E9A100" />
  </svg>
)

/**
 * Circular logo in a clean frame.
 * @param size  — pixel size of the circle (default 44)
 * @param variant — 'light' (white ring, for warm/light headers)
 *                — 'dark'  (navy ring + gold hairline, for dark headers)
 */
export default function Logo({ size = 44, variant = 'light', className = '' }) {
  const [failed, setFailed] = useState(false)

  const frame =
    variant === 'dark'
      ? 'bg-civil-700 shadow-[0_4px_14px_-4px_rgba(15,44,89,0.45)] ring-1 ring-gold-500/50'
      : 'bg-white shadow-[0_4px_14px_-6px_rgba(15,44,89,0.35)] ring-1 ring-ink/10'

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${frame} ${className}`}
      style={{ width: size, height: size }}
    >
      {!failed ? (
        <img
          src="/logo.png"
          alt="Hi-Tech Civil Design Consultancy logo"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="block w-full h-full p-[6%] box-border">{BRAND_SEAL}</span>
      )}
    </span>
  )
}
