import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer'
import BottomButton from './BottomButton'
import { AlignLeft } from 'lucide-react'

export function AnimatedMarker({ location, index }) {
   const [isDrawerOpen, setIsDrawerOpen] = useState(false)

   const handleMarkerClick = useCallback(() => {
      setIsDrawerOpen(true)
   }, [])

   return (
      <>
         <motion.div
            className='marker'
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'backOut', duration: 0.25, delay: 0.5 + index * 0.075 }}
            onClick={handleMarkerClick}
         >
            <span className='icon'>{location.icon || '📍'}</span>
         </motion.div>

         <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerContent className='pb-20'>
               <div className='p-4 pt-2'>
                  <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3'>
                     <div className='hidden xl:block h-[70vh] w-full bg-stone-50 rounded-xl' />
                     <div className='hidden md:block h-[520px] lg:h-[70vh] w-full bg-stone-50 rounded-xl' />
                     <div className='h-[520px] lg:h-[70vh] w-full bg-stone-50 rounded-xl' />
                  </div>
                  <h3 className='mt-3 text-base text-textColor font-normal flex items-start gap-2'>
                     <span className='text-[18px]'>{location.icon || '📍'}</span> {location.name}
                  </h3>
                  <p className='mt-[6.5px] text-base text-textColor flex items-start gap-2'>
                     <AlignLeft className='size-5 mt-0.5 inline-block' />
                     {location.description || 'No description available 🙁'}
                  </p>
               </div>
               <DrawerFooter>
                  <BottomButton onClick={() => setIsDrawerOpen(false)}>Close</BottomButton>
               </DrawerFooter>
            </DrawerContent>
         </Drawer>
      </>
   )
}
