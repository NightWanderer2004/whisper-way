'use client'
import Image from 'next/image'
import Gradient from '/public/gradient.jpg'
import { motion } from 'framer-motion'

export default function Home() {
   return (
      <main className='text-textColor text-2xl flex justify-center items-center h-dvh'>
         {/* <Image
            className='pointer-events-none fixed left-0 opacity-95 -z-10 scale-[230%] lg:scale-[120%] animate-rotation'
            src={Gradient}
            placeholder='blur'
            alt='Gradient'
            quality={70}
         /> */}
         <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'backOut' }}>
            Travel Mate
         </motion.h1>
      </main>
   )
}
