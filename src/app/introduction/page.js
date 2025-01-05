'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import authImg from '/public/auth-img.webp'
import AuthForm from '@/components/AuthForm'

export default function Auth() {
   return (
      <motion.main
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.6, ease: 'backOut' }}
         className='relative overflow-hidden h-dvh text-textColor text-2xl grid grid-cols-1 lg:grid-cols-2 place-items-center p-2'
      >
         <AuthForm />
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
