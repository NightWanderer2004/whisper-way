import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer'
import { AlignLeft } from 'lucide-react'
import SkeuoBtn from './SkeuoBtn'
import { Button } from './ui/button'
import { cn, getPlaceImages } from '@/lib/utils'
import Image from 'next/image'
import { useTripStore } from '@/lib/useStore'

export function AnimatedMarker({ location, index }) {
   const [isDrawerOpen, setIsDrawerOpen] = useState(false)
   const [placeImages, setPlaceImages] = useState([])
   const [isLoading, setIsLoading] = useState(false)
   const city = useTripStore(state => state.userData.city)

   const handleMarkerClick = useCallback(async () => {
      setIsLoading(true)
      setIsDrawerOpen(true)

      const imgUrls = await getPlaceImages(location?.placeId)
      setPlaceImages(imgUrls.images)
      setIsLoading(false)
   }, [location?.name, city])

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
                  <div className='overflow-x-auto overflow-y-hidden custom-scrollbar snap-both snap-mandatory md:snap-none pb-1.5 rounded-2xl'>
                     <div className='flex gap-3 flex-row h-[60dvh] lg:h-[75dvh] w-fit md:w-auto md:grid grid-cols-2 lg:grid-cols-3 md:grid-rows-2'>
                        {isLoading
                           ? Array(6)
                                .fill(null)
                                .map((_, i) => (
                                   <div
                                      key={i}
                                      className={cn(
                                         i > 3 && 'hidden lg:block',
                                         'h-full w-[calc(100vw-36px)] md:w-auto bg-stone-50 rounded-2xl shadow-smooth snap-center',
                                      )}
                                   />
                                ))
                           : placeImages.map((url, i) => (
                                <div
                                   key={i}
                                   className={cn(
                                      i > 3 && 'hidden lg:block',
                                      'h-full w-[calc(100vw-36px)] md:w-auto rounded-2xl border border-white/30 overflow-hidden shadow-smooth snap-center',
                                   )}
                                >
                                   <Image
                                      src={url}
                                      height={520}
                                      width={520}
                                      alt={`${location.name} - Image ${i + 1}`}
                                      className='pointer-events-none w-full h-full object-cover object-center'
                                      priority
                                   />
                                </div>
                             ))}
                     </div>
                  </div>
                  <h3 className='mt-3 text-base text-textAccent flex items-start gap-2'>
                     <span className='text-[18px]'>{location.icon || '📍'}</span> {location?.name}
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
                  <a className='w-full' href={`https://www.google.com/maps?q=${location?.name} ${city}`} target='_blank' rel='noopener noreferrer'>
                     <Button
                        size={'skeuo'}
                        variant={'skeuo-white'}
                        type={'button'}
                        className={cn('bg-white/90 w-full text-[18px] text-textAccent/80')}
                     >
                        {/* <span className='text-base text-[#4285F4] uppercase'>G</span>
                        <span className='text-base text-[#EA4335]'>o</span>
                        <span className='text-base text-[#FBBC05]'>o</span>
                        <span className='text-base text-[#4285F4]'>g</span>
                        <span className='text-base text-[#34A853]'>l</span>
                        <span className='text-base text-[#EA4335]'>e</span> */}
                        <svg width='18.5' height='18.5' viewBox='0 0 256 262' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid'>
                           <path
                              d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
                              fill='#4285F4'
                           />
                           <path
                              d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
                              fill='#34A853'
                           />
                           <path
                              d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782'
                              fill='#FBBC05'
                           />
                           <path
                              d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
                              fill='#EB4335'
                           />
                        </svg>

                        <span className='text-base text-textColor block ml-1.5'>maps</span>
                     </Button>
                  </a>
               </DrawerFooter>
            </DrawerContent>
         </Drawer>
      </>
   )
}
