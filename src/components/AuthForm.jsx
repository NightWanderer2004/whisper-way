'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import SkeuoBtn from '@/components/SkeuoBtn'
import { TextMorph } from '@/components/TextMorph'
import { Mail, Lock } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isLogin, setIsLogin] = useState(true)
   const router = useRouter()

   const handleAuth = async e => {
      e.preventDefault()
      try {
         const supabase = createBrowserClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
         if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            router.push('/trip')
         } else {
            const { error: signUpError } = await supabase.auth.signUp({
               email,
               password,
            })
            if (signUpError) throw signUpError
            router.refresh()
         }
      } catch (error) {
         toast.error(error.message)
      }
   }

   return (
      <div className='flex flex-col gap-4 w-80 pb-[200px] lg:pb-0'>
         <h1 className='text-textAccent mb-6 lg:mb-3 text-3xl lg:text-2xl pl-2'>Hi, traveler 👋</h1>
         <form onSubmit={handleAuth} className='flex flex-col gap-4 relative'>
            <fieldset className='relative'>
               <Input
                  className='text-lg lg:text-base rounded-[16px] h-[55px] lg:h-[50px] pl-10'
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
               />
               <Mail className='absolute stroke-[2.25px] size-5 left-3 top-1/2 transform -translate-y-1/2 text-stone-400' />
            </fieldset>
            <fieldset className='relative'>
               <Input
                  className='text-lg lg:text-base rounded-[16px] h-[55px] lg:h-[50px] pl-10'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
               />
               <Lock className='absolute stroke-[2.25px] size-5 left-3 top-1/2 transform -translate-y-1/2 text-stone-400' />
            </fieldset>
            <SkeuoBtn className='mt-2 lg:h-[50px]' main type='submit'>
               <TextMorph>{isLogin ? 'Login' : 'Join'}</TextMorph>
            </SkeuoBtn>
         </form>
         <button onClick={() => setIsLogin(!isLogin)} className='text-sm text-gray-500 hover:text-gray-700'>
            {isLogin ? "If you're new here? Create an account" : 'Already here? Login'}
         </button>
      </div>
   )
}
