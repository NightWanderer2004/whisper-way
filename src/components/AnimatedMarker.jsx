import { useEffect, useCallback, useState, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from 'framer-motion'
import mapboxgl from 'mapbox-gl'
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer'
import BottomButton from './BottomButton'
import { AlignLeft } from 'lucide-react'

export function AnimatedMarker({ location, map, index }) {
   const [isDrawerOpen, setIsDrawerOpen] = useState(false)
   const markerRef = useRef(null)
   const rootRef = useRef(null)

   const handleMarkerClick = useCallback(() => {
      setIsDrawerOpen(true)
   }, [])

   useEffect(() => {
      if (markerRef.current) return

      const el = document.createElement('div')
      rootRef.current = ReactDOM.createRoot(el)

      rootRef.current.render(
         <motion.div
            className='marker'
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'backOut', duration: 0.25, delay: 0.5 + index * 0.075 }}
            onClick={handleMarkerClick}
         >
            <span className='icon'>{location.icon || '📍'}</span>
         </motion.div>,
      )

      markerRef.current = new mapboxgl.Marker(el).setLngLat([location.lng, location.lat]).addTo(map)

      return () => {
         if (markerRef.current) {
            markerRef.current.remove()
            markerRef.current = null
         }
         if (rootRef.current) {
            rootRef.current.unmount()
            rootRef.current = null
         }
      }
   }, [location, map, index, handleMarkerClick]) // Add dependencies to useEffect

   return (
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
         <DrawerContent className='pb-20'>
            <div className='p-4 pt-2'>
               <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='hidden md:block h-[740px] w-full bg-stone-50 rounded-xl' />
                  <div className='hidden md:block h-[740px] w-full bg-stone-50 rounded-xl' />
                  <div className='h-[520px] md:h-[740px] w-full bg-stone-50 rounded-xl' />
               </div>
               <h3 className='mt-3 text-base text-textColor font-normal flex items-start gap-2'>
                  <span className='text-[18px]'>{location.icon || '📍'}</span> {location.name}
               </h3>
               <p className='mt-[6.5px] text-base text-textColor flex items-start gap-2'>
                  <AlignLeft className='size-[18px] mt-0.5 inline-block' />
                  {location.description || 'No description available 🙁'}
               </p>
            </div>
            <DrawerFooter>
               <BottomButton onClick={() => setIsDrawerOpen(false)}>Close</BottomButton>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   )
}
