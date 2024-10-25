'use client'
import Map from '@/components/Map'
import { useState } from 'react'
import TripForm from '@/components/TripForm'
import { useTripStore } from '@/lib/useStore'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
   const tripData = useTripStore(state => state.tripData)
   const [isLoading, setIsLoading] = useState(false)
   const [showMap, setShowMap] = useState(false)
   const [locations, setLocations] = useState(tripData.locations)

   return (
      <main className='relative h-screen text-textColor text-2xl flex flex-col justify-center items-center overflow-hidden'>
         {isLoading ? (
            <>
               <Skeleton className='skeleton h-full w-full bg-selectedBg rounded-none' />
               <p className='text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2   '>Generating...</p>
            </>
         ) : showMap ? (
            <Map locations={locations} />
         ) : (
            <TripForm isLoading={isLoading} setIsLoading={setIsLoading} setShowMap={setShowMap} setLocations={setLocations} />
         )}
      </main>
   )
}
