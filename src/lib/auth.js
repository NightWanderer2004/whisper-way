// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// export async function getUser() {
//    const auth = getSupabaseAuth()
//    const user = (await auth.getUser).data.user

//    return user
// }

// export function getSupabaseAuth() {
//    const cookieStore = cookies()

//    const supabaseClient = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
//       cookies: {
//          getAll() {
//             return cookieStore.getAll()
//          },
//          setAll(cookiesToSet) {
//             try {
//                cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
//             } catch {}
//          },
//       },
//    })

//    return supabaseClient.auth
// }
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
   throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
