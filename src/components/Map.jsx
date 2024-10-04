import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Skeleton } from './ui/skeleton'
import { motion } from 'framer-motion'

mapboxgl.accessToken = process.env.MAP_KEY

export default function Map({ locations }) {
   const map = useRef(null)
   const mapContainerRef = useRef(null)
   const [loading, setLoading] = useState(true)

   const coords = [20.632208, 50.87181]
   const zoom = 13

   useEffect(() => {
      if (!mapboxgl.supported()) {
         console.error('Your browser does not support Mapbox GL')
         return
      }
      if (!map.current && mapContainerRef.current) {
         map.current = new mapboxgl.Map({
            style: 'mapbox://styles/night2004/clz02xsbu00fp01qnc82b2lm9',
            container: mapContainerRef.current,
            center: coords,
            zoom: zoom,
         })
         map.current.on('load', () => {
            setLoading(false)
            document.querySelector('.skeleton').remove()
         })
      }
   }, [])

   useEffect(() => {
      if (locations && map.current) {
         document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove())

         locations.forEach(location => {
            const marker = document.createElement('div')
            const icon = document.createElement('span')
            marker.className = 'marker'
            icon.className = 'icon'
            icon.textContent = location.icon
            marker.appendChild(icon)
            new mapboxgl.Marker(marker)
               .setLngLat([location.lng, location.lat])
               .setPopup(new mapboxgl.Popup().setHTML(`<h4>${location.name}</h4>`))
               .addTo(map.current)
         })
      }
   }, [locations])

   return (
      <div className='h-[calc(100vh+env(safe-area-inset-top))] w-screen'>
         <Skeleton className='skeleton h-full w-full' />
         <motion.div
            animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.98 : 1 }}
            transition={{ duration: 0.55, ease: 'backOut' }}
            className='map opacity-0 h-full w-full'
            id='map-container'
            ref={mapContainerRef}
         />
      </div>
   )
}
