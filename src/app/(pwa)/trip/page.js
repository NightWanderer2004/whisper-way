'use client'
import Map from '@/components/Map'
import { useState, useEffect } from 'react'
import TripForm from '@/components/TripForm'
import { useTripStore } from '@/lib/useStore'
import { LoadingScreen } from '@/components/LoadingScreen'
import AnimatedWrapper from '@/components/AnimatedWrapper'
import TripDashboard from '@/components/TripDashboard'
import { useSupabase } from '@/components/SupabaseProvider'
import { Button } from '@/components/ui/button'

export default function Home() {
   const { initializeFromLocalStorage, showMap, cleanStorage } = useTripStore()
   const supabase = useSupabase()
   const [isLoading, setIsLoading] = useState(false)
   const [locations, setLocations] = useState([])
   const [isPlanning, setIsPlanning] = useState(false)

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

   const handleNewTrip = () => {
      setIsPlanning(true)
   }

   const handleLogout = async () => {
      await supabase.auth.signOut()
      cleanStorage() // Clear local storage data
   }

   return (
      <AnimatedWrapper className='relative h-dvh flex flex-col justify-center items-center sm:overflow-hidden'>
         {isLoading ? (
            <LoadingScreen />
         ) : isPlanning ? (
            showMap ? (
               <Map locations={locations} />
            ) : (
               <TripForm isLoading={isLoading} setIsLoading={setIsLoading} setLocations={setLocations} />
            )
         ) : (
            <TripDashboard onNewTrip={handleNewTrip} handleLogout={handleLogout} />
         )}
      </AnimatedWrapper>
   )
}
