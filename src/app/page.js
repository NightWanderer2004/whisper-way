'use client'
import Map from '@/components/Map'
import { useEffect, useState } from 'react'
import { getCoordinates } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function Home() {
   const [locations, setLocations] = useState([])
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
         // {
         //    icon: '🍕',
         //    place: 'Pizza Hut Kielce',
         // },
         // {
         //    icon: '🍔',
         //    place: 'McDonalds Kielce',
         // },
         // {
         //    icon: '🍺',
         //    place: 'Pub Stara Piekarnia Kielce',
         // },
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
         <Map locations={locations} />
         <Button className='absolute z-50 bottom-safe-offset-4 w-[95%]'>map</Button>
      </main>
   )
}
