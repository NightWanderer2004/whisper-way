'use client'
import Map from '@/components/Map'
import { useState, useEffect } from 'react'
import TripForm from '@/components/TripForm'
import { AnimatePresence, motion } from 'framer-motion'
import { useTripStore } from '@/lib/useStore'
import { TextShimmer } from '@/components/ui/textshimmer'

export default function Home() {
   const { tripData, initializeFromLocalStorage, showMap } = useTripStore()
   const [isLoading, setIsLoading] = useState(false)
   const [locations, setLocations] = useState([tripData.locations])

   useEffect(() => {
      initializeFromLocalStorage()
      const storedLocations = JSON.parse(localStorage.getItem('locations') || '[]')
      if (storedLocations.length > 0) {
         setLocations(storedLocations)
      }
   }, [initializeFromLocalStorage])

   return (
      <main className='relative h-screen text-textColor text-2xl flex flex-col justify-center items-center overflow-hidden'>
         {isLoading ? (
            <div>
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
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     transition={{ duration: 0.6, ease: 'backOut' }}
                  >
                     <TextShimmer duration={2} spread={5}>
                        Generating ✦
                     </TextShimmer>
                  </motion.div>
               </AnimatePresence>
            </div>
         ) : showMap ? (
            <Map locations={locations} />
         ) : (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.6, delay: 0.35, ease: 'backOut' }}
            >
               <TripForm isLoading={isLoading} setIsLoading={setIsLoading} setLocations={setLocations} />
            </motion.div>
         )}
      </main>
   )
}
