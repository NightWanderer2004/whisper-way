import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
   const res = NextResponse.next()

   const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookies: {
         getAll() {
            return req.cookies.getAll()
         },
         setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
               req,
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
         },
         // get: name => req.cookies.get(name)?.value,
         // set: (name, value, options) => res.cookies.set({ name, value, ...options }),
         // remove: (name, options) => res.cookies.set({ name, value: '', ...options }),
      },
   })

   const {
      data: { session },
   } = await supabase.auth.getSession()

   if (!session && req.nextUrl.pathname.startsWith('/trip')) {
      return NextResponse.redirect(new URL('/introduction', req.url))
   }

   return res
}

export const config = {
   matcher: ['/trip/:path*'],
}
