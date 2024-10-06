'use client'
import Map from '@/components/Map'
import { useEffect, useState } from 'react'
import { getCoordinates } from '@/lib/utils'
import SkeuoBtn from '@/components/SkeuoBtn'

export default function Home() {
   const [locations, setLocations] = useState([])
   const [preferences, setPreferences] = useState([])

   const handlePreferences = e => {
      const preference = e.target.innerText
      if (preferences.includes(preference)) {
         setPreferences(preferences.filter(p => p !== preference))
      } else {
         setPreferences([...preferences, preference])
      }
   }

   useEffect(() => {
      console.log(preferences)
   }, [preferences])

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
      ]

      const getLocations = async () => {
         const locationPromises = places.map(el => getCoordinates(el.place))
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
         <div className='w-[95%] flex flex-wrap gap-2'>
            <SkeuoBtn onClick={handlePreferences}>coffee</SkeuoBtn>
            <SkeuoBtn onClick={handlePreferences}>nature</SkeuoBtn>
            <SkeuoBtn onClick={handlePreferences}>parks</SkeuoBtn>
            <SkeuoBtn onClick={handlePreferences}>museums</SkeuoBtn>
            <SkeuoBtn onClick={handlePreferences}>art</SkeuoBtn>
         </div>
         <SkeuoBtn main>mapee</SkeuoBtn>
      </main>
   )
}
