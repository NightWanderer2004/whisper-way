import { useRef, useEffect, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { motion } from 'framer-motion'
import { useTripStore } from '@/lib/useStore'
import BottomButton from './BottomButton'
import InfoPanel from './InfoPanel'
import { TextMorph } from './TextMorph'
import { AnimatedMarker } from './AnimatedMarker'
import ReactDOM from 'react-dom/client'

mapboxgl.accessToken = process.env.MAP_KEY

export default function Map({ locations }) {
   const mainCityCoords = useTripStore(state => state.mainCityCoords)
   const userData = useTripStore(state => state.userData)
   const tripData = useTripStore(state => state.tripData)

   const map = useRef(null)
   const mapContainerRef = useRef(null)
   const [loading, setLoading] = useState(true)
   const [showInfoMobile, setShowInfoMobile] = useState(false)

   const coords = mainCityCoords && mainCityCoords.lng && mainCityCoords.lat ? [mainCityCoords.lng, mainCityCoords.lat] : [0, 0]
   const zoom = 12.5

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
            const logo = document.querySelector('#map-container > div.mapboxgl-control-container > div.mapboxgl-ctrl-bottom-left > div > a')
            const info = document.querySelector('#map-container > div.mapboxgl-control-container > div.mapboxgl-ctrl-bottom-right')
            if (logo) logo.remove()
            if (info) info.remove()
         })
      }
   }, [])

   useEffect(() => {
      if (locations && map.current) {
         // Remove existing markers
         document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove())

         // Add new markers
         Array.isArray(locations) &&
            locations.forEach((location, index) => {
               if (location && location.lng && location.lat && location.name) {
                  ReactDOM.createRoot(document.createElement('div')).render(<AnimatedMarker location={location} map={map.current} index={index} />)
               } else {
                  console.warn('Invalid location data:', location)
               }
            })
      }
   }, [locations])

   const resetMapPosition = useCallback(() => {
      if (map.current) {
         map.current.flyTo({
            center: coords,
            zoom: zoom,
            essential: true,
            pitch: 0,
         })
      }
   }, [coords, zoom])

   const toggleInfoMobile = useCallback(() => {
      setShowInfoMobile(prev => !prev)
   }, [])

   return (
      <motion.div
         style={{ opacity: 0 }}
         animate={{
            opacity: loading ? 0 : 1,
            scale: loading ? 0.98 : 1,
         }}
         transition={{ duration: 0.55, ease: 'backOut' }}
         className='h-full w-full relative overflow-hidden flex flex-col md:flex-row'
      >
         <InfoPanel
            showInfoMobile={showInfoMobile}
            setShowInfoMobile={setShowInfoMobile}
            data={tripData}
            userData={userData}
            resetMapPosition={resetMapPosition}
         />
         <div className='h-full w-full md:w-[60%]' id='map-container' ref={mapContainerRef} />

         <div className='md:hidden'>
            <BottomButton onClick={toggleInfoMobile}>
               <TextMorph>{showInfoMobile ? 'map' : 'menu'}</TextMorph>
            </BottomButton>
         </div>
      </motion.div>
   )
}
