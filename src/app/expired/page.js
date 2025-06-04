'use client'
import Link from 'next/link'
import { dm_sans } from '../fonts'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Expired() {
   return (
      <main className={cn('px-4 container mx-auto h-dvh text-textAccent flex flex-col justify-center items-center', dm_sans.className)}>
         <motion.div
            className='pb-40'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'backOut' }}
         >
            <p className='text-xl leading-tight'>
               Your early access has expired, thank you for your interest in{' '}
               <span className='my-1 bg-selectedBg rounded-2xl px-2.5 py-0.5 inline-block'>WhisperWay</span>
            </p>
         </motion.div>
      </main>
   )
}
