import { createClient } from '@supabase/supabase-js'

// Use placeholders if env vars are missing to prevent build-time crashes (Next.js Static Export)
// The actual values will be needed at runtime in the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (supabaseUrl.includes('placeholder')) {
    console.warn('Supabase Client: Using placeholder URL. Environment variables might be missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
