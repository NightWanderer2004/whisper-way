'use client'
import Map from '@/components/Map'
import { useEffect, useState } from 'react'
import { getCoordinates, getProximity } from '@/lib/utils'
import SkeuoBtn from '@/components/SkeuoBtn'
import TripForm from '@/components/TripForm'

export default function Home() {
   const [locations, setLocations] = useState([])
   const [proximity, setProximity] = useState({ lng: 0, lat: 0 })

   useEffect(() => {
      const places = [
         {
            icon: '🎒',
            place: 'Politechnika Świętokrzyska w Kielcach',
         },
         {
            icon: '🛍️',
            place: 'Galeria Echo',
         },
         {
            icon: '🍔',
            place: 'McDonalds al. Solidarności 16',
         },
      ]

      const getLocations = async () => {
         const mainCity = await getProximity('Kielce')
         const locationPromises = places.map(el => getCoordinates(el.place, mainCity))
         const locationsData = await Promise.all(locationPromises)
         locationsData.forEach((el, i) => {
            el.name = places[i].place
            el.icon = places[i].icon
         })

         setLocations(locationsData)
      }

      getLocations()
   }, [])

   return (
      <main className='relative h-screen text-textColor text-2xl flex flex-col justify-center items-center'>
         {/* <Map locations={locations} /> */}
         <TripForm />
         <SkeuoBtn main>let's start</SkeuoBtn>
      </main>
   )
}
