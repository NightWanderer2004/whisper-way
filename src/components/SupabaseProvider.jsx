'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'

const SupabaseContext = createContext()

export function SupabaseProvider({ children }) {
   const router = useRouter()
   const supabase = createBrowserClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

   useEffect(() => {
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
         router.refresh()
      })

      return () => {
         subscription.unsubscribe()
      }
   }, [router, supabase])

   return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
}

export const useSupabase = () => {
   const context = useContext(SupabaseContext)
   if (context === undefined) {
      throw new Error('useSupabase must be used within a SupabaseProvider')
   }
   return context
}
