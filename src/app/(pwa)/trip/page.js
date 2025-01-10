'use client'
import Map from '@/components/Map'
import { useState, useEffect } from 'react'
import TripForm from '@/components/TripForm'
import { LoadingScreen } from '@/components/LoadingScreen'
import AnimatedWrapper from '@/components/AnimatedWrapper'
import TripDashboard from '@/components/TripDashboard'
import { useSupabase } from '@/components/SupabaseProvider'
import { useTripStore } from '@/lib/useTripStore'

export default function Home() {
   const supabase = useSupabase()
   const { fetchTrips, fetchUserData, showMap, setShowMap } = useTripStore()
   const [isLoading, setIsLoading] = useState(false)
   const [isPlanning, setIsPlanning] = useState(false)
   const [locations, setLocations] = useState([])

   useEffect(() => {
      const fetchUserDataAndTrips = async () => {
         await fetchUserData()
         const {
            data: { session },
         } = await supabase.auth.getSession()

         if (session) {
            fetchTrips(session.user.id)
         } else {
            console.error('User is not authenticated')
         }
      }

      fetchUserDataAndTrips()
   }, [fetchTrips, fetchUserData, supabase])

   const handleNewTrip = () => {
      setIsPlanning(true)
   }

   const handleLogout = async () => {
      await supabase.auth.signOut()
   }

   return (
      <AnimatedWrapper className='relative h-dvh flex flex-col justify-center items-center sm:overflow-hidden'>
         {isLoading ? (
            <LoadingScreen />
         ) : isPlanning ? (
            showMap ? (
               <Map locations={locations} />
            ) : (
               <TripForm isLoading={isLoading} setIsLoading={setIsLoading} setShowMap={setShowMap} setLocations={setLocations} />
            )
         ) : (
            <TripDashboard onNewTrip={handleNewTrip} handleLogout={handleLogout} />
         )}
      </AnimatedWrapper>
   )
}
