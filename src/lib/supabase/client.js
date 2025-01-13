import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)
