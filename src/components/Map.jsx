import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Marker from './Marker'

export default function Map({ locations }) {
   const map = useRef()
   const mapContainerRef = useRef()

   const coords = [20.632208, 50.87181]
   const zoom = 13

   useEffect(() => {
      mapboxgl.accessToken = process.env.MAP_KEY
      map.current = new mapboxgl.Map({
         style: 'mapbox://styles/night2004/clz02xsbu00fp01qnc82b2lm9',
         container: mapContainerRef.current,
         center: coords,
         zoom: zoom,
      })

      return () => {
         map.current.remove()
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

   return <div className='h-screen w-screen absolute top-0 left-0' id='map-container' ref={mapContainerRef} />
}
