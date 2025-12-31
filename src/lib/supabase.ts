import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // Check if we are in a build environment where these might not be set (though for static export they usually are needed if we fetch)
    // But for client side auth usage they are strictly needed.
    // We'll throw a friendly error if missing in browser.
    if (typeof window !== 'undefined') {
        throw new Error('Missing Supabase environment variables')
    }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
