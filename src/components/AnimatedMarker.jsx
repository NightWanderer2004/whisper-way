import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer'
import { AlignLeft } from 'lucide-react'
import SkeuoBtn from './SkeuoBtn'
import { Button } from './ui/button'
import { cn, fetchPlaceId, fetchPlaceImages } from '@/lib/utils'

export function AnimatedMarker({ location, index }) {
   const [isDrawerOpen, setIsDrawerOpen] = useState(false)
   const [placeImages, setPlaceImages] = useState([])

   const handleMarkerClick = useCallback(async () => {
      setIsDrawerOpen(true)
      const placeId = await fetchPlaceId(location.name)
      const imgUrls = await fetchPlaceImages(placeId)
      setPlaceImages(imgUrls.images)
   }, [location.name])

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
                  <div className=' h-[520px] lg:h-[70vh] overflow-x-auto overflow-y-hidden custom-scrollbar snap-x snap-mandatory'>
                     <div className='flex gap-3 flex-row w-fit'>
                        {placeImages.length === 0
                           ? Array(3)
                                .fill(null)
                                .map((_, i) => (
                                   <div
                                      key={i}
                                      className='h-[520px] lg:h-[70vh] w-[calc(100vw-36px)] bg-stone-50 rounded-2xl rounded-b-none shadow-smooth snap-center'
                                   />
                                ))
                           : placeImages.slice(0, 3).map((url, i) => (
                                <div
                                   key={i}
                                   className='h-[520px] lg:h-[70vh] w-[calc(100vw-36px)] rounded-2xl rounded-b-none border border-white/30 overflow-hidden shadow-smooth snap-center'
                                >
                                   <img
                                      src={url}
                                      alt={`${location.name} - Image ${i + 1}`}
                                      className='pointer-events-none w-full h-full object-cover object-center'
                                   />
                                </div>
                             ))}
                     </div>
                  </div>
                  <h3 className='mt-3 text-base text-textColor font-normal flex items-start gap-2'>
                     <span className='text-[18px]'>{location.icon || '📍'}</span> {location.name}
                  </h3>
                  <p className='mt-[6.5px] text-base text-textColor flex items-start gap-2'>
                     <AlignLeft className='size-5 min-w-5 mt-0.5 inline-block' />
                     {location.description || 'No description available 🙁'}
                  </p>
               </div>
               <DrawerFooter className='fixed z-50 bottom-0 left-0 right-0 p-4 pb-safe-offset-1 lg:pb-safe-offset-2 flex flex-row justify-between'>
                  <SkeuoBtn main onClick={() => setIsDrawerOpen(false)}>
                     Close
                  </SkeuoBtn>
                  <a className='w-full' href={`https://www.google.com/maps/place/${location.name}`} target='_blank' rel='noopener noreferrer'>
                     <Button
                        size={'skeuo'}
                        variant={'skeuo-white'}
                        type={'button'}
                        className={cn('bg-white/90 w-full text-[18px] text-textAccent/80')}
                     >
                        <span className='text-base text-[#4285F4] uppercase'>G</span>
                        <span className='text-base text-[#EA4335]'>o</span>
                        <span className='text-base text-[#FBBC05]'>o</span>
                        <span className='text-base text-[#4285F4]'>g</span>
                        <span className='text-base text-[#34A853]'>l</span>
                        <span className='text-base text-[#EA4335]'>e</span>
                        <span className='text-base text-textColor block ml-1.5'>maps</span>
                     </Button>
                  </a>
               </DrawerFooter>
            </DrawerContent>
         </Drawer>
      </>
   )
}
