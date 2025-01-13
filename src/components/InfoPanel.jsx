import { e_ukraine, lexend } from '@/app/fonts'
import { useTripStore } from '@/lib/useTripStore'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const slideAnimation = {
   initial: { y: '100%' },
   animate: { y: 0 },
   exit: { y: '100%' },
   transition: {
      ease: [0.32, 0.72, 0, 1],
      duration: 0.55,
   },
}

export default function InfoPanel({ showInfoMobile, setShowInfoMobile, setMapPosition, resetMapPosition }) {
   const { cleanStorage, setShowMap, initializeFromLocalStorage, tripData } = useTripStore()
   const [localShowInfoMobile, setLocalShowInfoMobile] = useState(showInfoMobile)
   const city = tripData.userData?.city || 'Unknown City'

   useEffect(() => {
      initializeFromLocalStorage()
      setLocalShowInfoMobile(showInfoMobile)
   }, [showInfoMobile, initializeFromLocalStorage])

   const heading = <h2 className='text-3xl font-medium text-textAccent'>{city}</h2>

   const controlButtons = (
      <div className='flex space-x-2'>
         <Button
            onClick={() => {
               resetMapPosition()
               setLocalShowInfoMobile(false)
            }}
            variant='skeuo-mini'
            size='skeuo-mini'
            className='z-50 text-lime-500/80 relative lg:fixed lg:top-9 lg:right-4'
         >
            reset map
         </Button>
         <Button
            onClick={() => {
               cleanStorage()
               setShowMap(false)
               setLocalShowInfoMobile(false)
            }}
            variant='skeuo-mini'
            size='skeuo-mini'
            className='z-50 text-orange-500/80 relative'
         >
            start over
         </Button>
      </div>
   )

   const content = tripData.locations && tripData.locations.length > 0 ? (
      <Accordion type='multiple' collapsible defaultValue={['item-1']}>
         <AccordionItem value='item-1'>
            <AccordionTrigger>Spots</AccordionTrigger>
            <AccordionContent>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                  {tripData.locations.map((location, index) => (
                     <InfoCard
                        key={index}
                        setShowInfoMobile={setShowInfoMobile}
                        setMapPosition={setMapPosition}
                        title={location.name}
                        coords={[location.lng, location.lat]}
                        icon={location.icon}
                     >
                        {location.description}
                     </InfoCard>
                  ))}
               </div>
            </AccordionContent>
         </AccordionItem>
         {tripData.country_info?.emergency_numbers && (
            <AccordionItem value='item-2'>
               <AccordionTrigger>Emergency numbers</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-2.5'>
                     {Object.entries(tripData.country_info.emergency_numbers).map(([service, info]) => (
                        <InfoCard key={service} title={service.charAt(0).toUpperCase() + service.slice(1).split('_').join(' ')} icon={info.icon}>
                           {info.number}
                        </InfoCard>
                     ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}
         {tripData.country_info?.power_socket && (
            <AccordionItem value='item-3'>
               <AccordionTrigger>Useful info</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                     <InfoCard title='Power socket' icon={tripData.country_info.power_socket.icon}>
                        Type: {tripData.country_info.power_socket.type}
                        <br />
                        Voltage: {tripData.country_info.power_socket.voltage}
                     </InfoCard>
                     {tripData.country_info?.currency && (
                        <InfoCard title='Currency' icon={tripData.country_info.currency.icon}>
                           {tripData.country_info.currency.name}
                        </InfoCard>
                     )}
                     {tripData.country_info?.timezone && (
                        <InfoCard title='Timezone' icon={tripData.country_info.timezone.icon}>
                           {tripData.country_info.timezone.name}
                        </InfoCard>
                     )}
                     {tripData.country_info?.best_season && (
                        <InfoCard title='Best season' icon={tripData.country_info.best_season.icon}>
                           {tripData.country_info.best_season.season}
                        </InfoCard>
                     )}
                     {tripData.country_info?.payment_method && (
                        <InfoCard title='Payment method' icon={tripData.country_info.payment_method.icon}>
                           {tripData.country_info.payment_method.info}
                        </InfoCard>
                     )}
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}
         {(tripData.country_info?.transport_prices || tripData.country_info?.average_prices) && (
            <AccordionItem value='item-4'>
               <AccordionTrigger>Prices</AccordionTrigger>
               <AccordionContent>
                  {tripData.country_info?.transport_prices && (
                     <>
                        <h4 className='text-sm font-normal mb-2'>Transport</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4'>
                           {Object.entries(tripData.country_info.transport_prices).map(([type, info]) => (
                              <InfoCard key={type} title={type.charAt(0).toUpperCase() + type.slice(1).split('_').join(' ')} icon={info.icon}>
                                 {info.price}
                              </InfoCard>
                           ))}
                        </div>
                     </>
                  )}
                  {tripData.country_info?.average_prices && (
                     <>
                        <h4 className='text-sm font-normal mb-2'>Average</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                           {Object.entries(tripData.country_info.average_prices).map(([item, info]) => (
                              <InfoCard key={item} title={item.charAt(0).toUpperCase() + item.slice(1).split('_').join(' ')} icon={info.icon}>
                                 {info.price}
                              </InfoCard>
                           ))}
                        </div>
                     </>
                  )}
               </AccordionContent>
            </AccordionItem>
         )}
         {tripData.country_info?.grocery_stores && (
            <AccordionItem value='item-9'>
               <AccordionTrigger>Grocery Stores</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                     {tripData.country_info.grocery_stores.map((store, index) => (
                        <InfoCard key={index} title={store.name} icon={store.icon}></InfoCard>
                     ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}
         {tripData.country_info?.useful_apps && (
            <AccordionItem value='item-5'>
               <AccordionTrigger>Apps</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                     {Object.entries(tripData.country_info.useful_apps).map(([app, info]) => (
                        <InfoCard key={app} title={app} icon={info.icon}>
                           {info.description}
                        </InfoCard>
                     ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}
         {tripData.country_info?.useful_phrases && (
            <AccordionItem value='item-6'>
               <AccordionTrigger>Handy Phrases</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                     {Object.entries(tripData.country_info.useful_phrases).map(([phrase, info]) => (
                        <InfoCard key={phrase} title={info.phrase} icon={info.icon}>
                           {info.translation}
                        </InfoCard>
                     ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}
         {tripData.country_info?.city_cleanliness && (
            <AccordionItem value='item-7'>
               <AccordionTrigger>City Cleanliness</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-1 gap-2.5'>
                     <InfoCard title={tripData.country_info.city_cleanliness.rating} icon={tripData.country_info.city_cleanliness.icon}>
                        {tripData.country_info.city_cleanliness.description}
                     </InfoCard>
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}
      </Accordion>
   ) : (
      <p>No locations available.</p>
   )

   return (
      <AnimatePresence>
         <div className='relative z-50 hidden lg:block lg:w-[40%] xl:w-[30%] h-full overflow-x-hidden bg-stone-100 overflow-y-auto no-scrollbar border-r border-white/30'>
            <div className='p-5 space-y-8'>
               <div className='mt-4 flex items-center justify-between'>
                  {heading}
                  {controlButtons}
               </div>
               {content}
            </div>
         </div>

         {localShowInfoMobile && (
            <motion.div
               key='info'
               {...slideAnimation}
               className='info-panel absolute z-50 lg:hidden bottom-0 left-0 pb-24 w-full h-full overflow-x-hidden bg-whiteBg overflow-y-auto backdrop-blur-xl no-scrollbar'
            >
               <div className='p-4 pt-16 space-y-8'>
                  {controlButtons}
                  <div className='mt-4 flex items-center justify-between'>{heading}</div>
                  {content}
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   )
}

const InfoCard = ({ setMapPosition, setShowInfoMobile, title, icon, children, coords }) => (
   <div
      onClick={() => {
         if (setMapPosition && coords) {
            setMapPosition(coords)
            setShowInfoMobile(false)
         }
      }}
      className={cn(
         'p-2.5 text-textColor rounded-2xl accent-fill shadow-smooth skeuo-white relative',
         e_ukraine.className,
         setMapPosition && 'cursor-pointer lg:hover:scale-[102%] hover:text-textAccent transition-all duration-300',
      )}
   >
      <h4 className='text-sm sm:text-base md:text-sm text-textAccent/85 font-normal w-full'>
         <span className='mr-2'>{icon}</span>
         {title}
      </h4>
      {children && <p className={cn('mt-1.5 h-full text-sm sm:text-base md:text-sm', lexend.className)}>{children}</p>}
   </div>
)
