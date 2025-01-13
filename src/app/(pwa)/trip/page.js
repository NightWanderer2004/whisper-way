'use client'
import Map from '@/components/Map'
import { useState, useEffect } from 'react'
import TripForm from '@/components/TripForm'
import { LoadingScreen } from '@/components/LoadingScreen'
import AnimatedWrapper from '@/components/AnimatedWrapper'
import TripDashboard from '@/components/TripDashboard'
// import { useSupabase } from '@/components/SupabaseProvider'
import { useTripStore } from '@/lib/useTripStore'
import { supabase } from '@/lib/supabase/client'

export default function Home() {
   // const supabase = useSupabase()
   const { fetchTrips, fetchUserData, showMap, setShowMap, tripData, setTripData } = useTripStore()
   const [isLoading, setIsLoading] = useState(false)
   const [isPlanning, setIsPlanning] = useState(false)

   // useEffect(() => {
   //    const fetchUserDataAndTrips = async () => {
   //       await fetchUserData()
   //       const {
   //          data: { session },
   //       } = await supabase.auth.getSession()

   //       if (session) {
   //          fetchTrips(session.user.id)
   //       } else {
   //          console.error('User is not authenticated')
   //       }
   //    }

   //    fetchUserDataAndTrips()
   // }, [fetchTrips, fetchUserData, supabase])

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
               <Map locations={tripData.locations} />
            ) : (
               <TripForm isLoading={isLoading} setIsLoading={setIsLoading} setShowMap={setShowMap} setTripData={setTripData} />
            )
         ) : (
            <TripDashboard onNewTrip={handleNewTrip} handleLogout={handleLogout} />
         )}
      </AnimatedWrapper>
   )
}
