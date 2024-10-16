'use client'
import Map from '@/components/Map'
import { useState } from 'react'
import TripForm from '@/components/TripForm'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
   const [isLoading, setIsLoading] = useState(false)
   const [showMap, setShowMap] = useState(false)
   const [locations, setLocations] = useState([])

   return (
      <main className='relative h-screen text-textColor text-2xl flex flex-col justify-center items-center'>
         {isLoading ? (
            <Skeleton className='h-full w-full bg-pink-200' />
         ) : showMap ? (
            <Map locations={locations} />
         ) : (
            <TripForm setIsLoading={setIsLoading} setShowMap={setShowMap} setLocations={setLocations} />
         )}
      </main>
   )
}
