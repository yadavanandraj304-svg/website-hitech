// ---------------------------------------------------------------------------
// Supabase client — used by the Service Inquiry Form to write rows into the
// `inquiries` table.
//
// Fill these two values in .env (see .env.example):
//   VITE_SUPABASE_URL      — your project URL (https://xxxx.supabase.co)
//   VITE_SUPABASE_ANON_KEY — the anon/publishable key
//
// Until they are set, `isSupabaseConfigured` is false and the form falls back
// to the existing Express email API (server/index.js) so no lead is ever lost.
// ---------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(URL && ANON_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(URL, ANON_KEY, { auth: { persistSession: false } })
  : null

/**
 * Insert one inquiry row into public.inquiries.
 * Columns: full_name, phone, email, location, services (text[]), message.
 * Throws if Supabase is not configured or the insert fails.
 */
export async function insertInquiry(row) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)')
  }
  const { error } = await supabase.from('inquiries').insert(row)
  if (error) throw new Error(`Supabase insert failed: ${error.message}`)
  return true
}
