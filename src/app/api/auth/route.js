import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req) {
   try {
      const supabase = createRouteHandlerClient({ cookies })
      const {
         data: { session },
         error,
      } = await supabase.auth.getSession()

      if (error) throw error

      return NextResponse.json({
         authenticated: !!session,
         session,
      })
   } catch (error) {
      return NextResponse.json(
         {
            authenticated: false,
            error: error.message,
         },
         { status: 401 },
      )
   }
}
