'use client'
import { useState } from 'react'
import { supabase } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import SkeuoBtn from '@/components/SkeuoBtn'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function Auth() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isLogin, setIsLogin] = useState(true)
   const router = useRouter()

   const handleAuth = async e => {
      e.preventDefault()
      try {
         if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({
               email,
               password,
            })
            if (error) throw error
            router.push('/trip')
         } else {
            const { data, error: signUpError } = await supabase.auth.signUp({
               email,
               password,
            })
            if (signUpError) throw signUpError

            const { error: signInError } = await supabase.auth.signInWithPassword({
               email,
               password,
            })
            if (signInError) throw signInError

            toast.success('Account created successfully!')
            router.refresh()
            await new Promise(resolve => setTimeout(resolve, 500)) // Small delay to ensure auth state updates
            router.push('/trip')
         }
      } catch (error) {
         toast.error(error.message)
      }
   }

   return (
      <main className='relative h-dvh text-textColor text-2xl flex flex-col justify-center items-center'>
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className='flex flex-col gap-4 w-80'
         >
            <form onSubmit={handleAuth} className='flex flex-col gap-4'>
               <Input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
               <Input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
               <SkeuoBtn main type='submit'>
                  {isLogin ? 'Sign In' : 'Sign Up'}
               </SkeuoBtn>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className='text-sm text-gray-500 hover:text-gray-700'>
               {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
         </motion.div>
      </main>
   )
}
