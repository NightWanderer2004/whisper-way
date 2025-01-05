'use client'
import { useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import SkeuoBtn from '@/components/SkeuoBtn'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
// import { addUser } from '@/lib/supabase/auth'
import Image from 'next/image'
import { TextMorph } from '@/components/TextMorph'
import authImg from '/public/auth-img.webp'
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react'

export default function Auth() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isLogin, setIsLogin] = useState(true)
   const router = useRouter()

   const handleAuth = async e => {
      e.preventDefault()
      // try {
      //    const supabase = addUser()
      //    if (isLogin) {
      //       const { error } = await supabase.auth.signInWithPassword({ email, password })
      //       if (error) throw error
      //       redirect('/trip')
      //    } else {
      //       const { error: signUpError } = await supabase.auth.signUp({
      //          email,
      //          password,
      //       })
      //       if (signUpError) throw signUpError

      //       const { error: signInError } = await supabase.auth.signInWithPassword({
      //          email,
      //          password,
      //          options: {
      //             redirectTo: '/trip',
      //          },
      //       })
      //       if (signInError) throw signInError

      //       toast.success('Account created successfully!')
      //       router.refresh()
      //       await new Promise(resolve => setTimeout(resolve, 500)) // Small delay to ensure auth state updates
      //       redirect('/trip')
      //    }
      // } catch (error) {
      //    toast.error(error.message)
      // }
   }

   return (
      <motion.main
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.6, ease: 'backOut' }}
         className='relative overflow-hidden h-dvh text-textColor text-2xl grid grid-cols-1 lg:grid-cols-2 place-items-center p-2'
      >
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
                  <Mail className='absolute  stroke-[2.25px] size-5 left-3 top-1/2 transform -translate-y-1/2 text-stone-400' />
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
         <Image
            className='hidden lg:block rounded-xl w-full h-full object-cover pointer-events-none border-whiteBg border-2 shadow-smooth'
            src={authImg}
            alt=''
            placeholder='blur'
            width={1000}
            height={1000}
         />
      </motion.main>
   )
}
