import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)

// Storage bucket name used for all site images/uploads
export const STORAGE_BUCKET = 'site-media'

/**
 * Upload a file to the site-media bucket and return its public URL.
 * @param {File} file
 * @param {string} folder - subfolder within the bucket (e.g. 'hero', 'news')
 * @returns {Promise<string>} public URL of the uploaded file
 */
export async function uploadImage(file, folder = 'misc') {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename)
  return data.publicUrl
}
