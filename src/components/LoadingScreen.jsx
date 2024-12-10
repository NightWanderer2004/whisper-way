'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { TextShimmer } from '@/components/ui/textshimmer'
import { TextLoop } from '@/components/TextLoop'
import { cn } from '@/lib/utils'
import { lexend } from '../app/fonts'

export function LoadingScreen() {
   return (
      <div className='text-center flex flex-col justify-center items-center w-full h-dvh overflow-hidden'>
         {[0, 1, 2, 3, 4].map(index => (
            <motion.div
               key={index}
               className='blob'
               variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 0.3 },
               }}
               initial='hidden'
               animate='visible'
               transition={{ duration: 1, delay: index * 0.2 }}
            />
         ))}
         <AnimatePresence mode='wait'>
            <motion.div
               className='relative z-20'
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               transition={{ duration: 0.6, ease: 'backOut' }}
            >
               <TextShimmer duration={2} spread={5}>
                  Generating ✦
               </TextShimmer>
               <TextLoop
                  interval={6}
                  className={cn('mt-3 text-sm text-textColor font-light block', lexend.className)}
                  transition={{ duration: 0.45, ease: 'backOut' }}
               >
                  <p>Fine-tuning your trip...</p>
                  <p>Personalized travel plan coming soon</p>
                  <p>Unique journey crafted by AI</p>
                  <p>Curating breathtaking spots</p>
                  <p>Your dream trip is almost ready</p>
               </TextLoop>
            </motion.div>
         </AnimatePresence>
      </div>
   )
}
