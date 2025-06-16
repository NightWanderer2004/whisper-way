'use client'
import Map from '@/components/Map'
import { useState, useEffect } from 'react'
import TripForm from '@/components/TripForm'
import { motion } from 'framer-motion'
import { useTripStore } from '@/lib/useStore'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function Home() {
   const { initializeFromLocalStorage, showMap } = useTripStore()
   const [isLoading, setIsLoading] = useState(false)
   const [locations, setLocations] = useState([])

   useEffect(() => {
      initializeFromLocalStorage()
      const storedData = localStorage.getItem('tripStorageData')
      if (storedData) {
         const parsedData = JSON.parse(storedData)
         if (parsedData.tripData?.locations) {
            setLocations(parsedData.tripData.locations)
         }
      }
   }, [initializeFromLocalStorage])

   return (
      <main className='relative h-dvh text-textColor text-2xl flex flex-col justify-center items-center sm:overflow-hidden'>
         {isLoading ? (
            <LoadingScreen />
         ) : showMap ? (
            <Map locations={locations} />
         ) : (
            <motion.div
               className='relative bottom-10'
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
            >
               <TripForm isLoading={isLoading} setIsLoading={setIsLoading} setLocations={setLocations} />
            </motion.div>
         )}
      </main>
   )
}
