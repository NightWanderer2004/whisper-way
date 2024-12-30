import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
   console.error('Missing Supabase environment variables')
}

export async function middleware(req) {
   const res = NextResponse.next()
   const supabase = createMiddlewareClient(
      {
         req,
         res,
      },
      {
         supabaseUrl: process.env.SUPABASE_URL,
         supabaseKey: process.env.SUPABASE_ANON_KEY,
      },
   )

   try {
      const {
         data: { session },
      } = await supabase.auth.getSession()

      // Refresh session if it exists
      if (session) {
         await supabase.auth.refreshSession()
      }

      // Protected routes handling
      if (!session && req.nextUrl.pathname.startsWith('/trip')) {
         const redirectUrl = new URL('/introduction', req.url)
         return NextResponse.redirect(redirectUrl)
      }

      return res
   } catch (error) {
      console.error('Auth middleware error:', error)
      const redirectUrl = new URL('/introduction', req.url)
      return NextResponse.redirect(redirectUrl)
   }
}

export const config = {
   matcher: ['/trip/:path*'],
}
