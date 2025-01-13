'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTripStore } from '@/lib/useTripStore'
import Map from '@/components/Map'
import LoadingScreen from '@/components/LoadingScreen'

export default function TripPage() {
   const router = useRouter()
   const { id } = router.query
   const { fetchTripById, tripData } = useTripStore()
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      if (id) {
         fetchTripById(id).then(() => setIsLoading(false))
      }
   }, [id, fetchTripById])

   if (isLoading) {
      return <LoadingScreen />
   }

   return <Map locations={tripData.locations} />
}
