import { e_ukraine, lexend } from '@/app/fonts'
import { useTripStore } from '@/lib/useStore'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion' // Import Accordion components

const slideAnimation = {
   initial: { y: '100%' },
   animate: { y: 0 },
   exit: { y: '100%' },
   transition: {
      ease: [0.32, 0.72, 0, 1],
      duration: 0.55,
   },
}

export default function InfoPanel({ showInfoMobile, setShowInfoMobile, data, setMapPosition, resetMapPosition }) {
   const { cleanStorage, setShowMap } = useTripStore()
   const { initializeFromLocalStorage } = useTripStore()
   const [localShowInfoMobile, setLocalShowInfoMobile] = useState(showInfoMobile)
   const city = useTripStore(state => state.userData.city)

   data = data.country_info || data

   useEffect(() => {
      initializeFromLocalStorage()
      setLocalShowInfoMobile(showInfoMobile)
   }, [showInfoMobile])

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
            className='text-lime-500/80 relative'
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
            className='text-orange-500/80 relative'
         >
            start over
         </Button>
      </div>
   )

   const content = data ? (
      <Accordion type='multiple' collapsible defaultValue={['item-1']}>
         <AccordionItem value='item-1'>
            <AccordionTrigger>Your spots</AccordionTrigger>
            <AccordionContent>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                  {data.locations.map((location, index) => (
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

         {data.emergency_numbers && (
            <AccordionItem value='item-2'>
               <AccordionTrigger>Emergency numbers</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-2.5'>
                     {Object.entries(data.emergency_numbers).map(([service, info]) => (
                        <InfoCard key={service} title={service.charAt(0).toUpperCase() + service.slice(1).split('_').join(' ')} icon={info.icon}>
                           {info.number}
                        </InfoCard>
                     ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}

         {data.power_socket ||
            data.currency ||
            data.timezone ||
            data.best_season ||
            (data.payment_method && (
               <AccordionItem value='item-3'>
                  <AccordionTrigger>Useful info</AccordionTrigger>
                  <AccordionContent>
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                        {data.power_socket && (
                           <InfoCard title='Power socket' icon={data.power_socket.icon}>
                              Type: {data.power_socket.type}
                              <br />
                              Voltage: {data.power_socket.voltage}
                           </InfoCard>
                        )}
                        {data.currency && (
                           <InfoCard title='Currency' icon={data.currency.icon}>
                              {data.currency.name}
                           </InfoCard>
                        )}
                        {data.timezone && (
                           <InfoCard title='Timezone' icon={data.timezone.icon}>
                              {data.timezone.name}
                           </InfoCard>
                        )}
                        {data.best_season && (
                           <InfoCard title='Best season' icon={data.best_season.icon}>
                              {data.best_season.season}
                           </InfoCard>
                        )}
                        {data.payment_method && (
                           <InfoCard title='Payment method' icon={data.payment_method.icon}>
                              {data.payment_method.info}
                           </InfoCard>
                        )}
                     </div>
                  </AccordionContent>
               </AccordionItem>
            ))}

         {(data.transport_prices || data.average_prices) && (
            <AccordionItem value='item-4'>
               <AccordionTrigger>Prices</AccordionTrigger>
               <AccordionContent>
                  {data.transport_prices && (
                     <>
                        <h4 className='text-sm font-normal mb-2'>Transport</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4'>
                           {Object.entries(data.transport_prices).map(([type, info]) => (
                              <InfoCard key={type} title={type.charAt(0).toUpperCase() + type.slice(1).split('_').join(' ')} icon={info.icon}>
                                 {info.price}
                              </InfoCard>
                           ))}
                        </div>
                     </>
                  )}
                  {data.average_prices && (
                     <>
                        <h4 className='text-sm font-normal mb-2'>Average</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                           {Object.entries(data.average_prices).map(([item, info]) => (
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

         {data.useful_apps && (
            <AccordionItem value='item-5'>
               <AccordionTrigger>Apps</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                     {Object.entries(data.useful_apps).map(([app, info]) => (
                        <InfoCard key={app} title={app} icon={info.icon}>
                           {info.description}
                        </InfoCard>
                     ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}

         {data.useful_phrases && (
            <AccordionItem value='item-6'>
               <AccordionTrigger>Useful Phrases</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
                     {Object.entries(data.useful_phrases).map(([phrase, info]) => (
                        <InfoCard key={phrase} title={info.phrase} icon={info.icon}>
                           {info.translation}
                        </InfoCard>
                     ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}

         {data.city_cleanliness && (
            <AccordionItem value='item-7'>
               <AccordionTrigger>City Cleanliness</AccordionTrigger>
               <AccordionContent>
                  <div className='grid grid-cols-1 gap-2.5'>
                     <InfoCard title={data.city_cleanliness.rating} icon={data.city_cleanliness.icon}>
                        {data.city_cleanliness.description}
                     </InfoCard>
                  </div>
               </AccordionContent>
            </AccordionItem>
         )}
      </Accordion>
   ) : null

   return (
      <AnimatePresence>
         {/* Desktop Info Panel (always visible) */}
         <div className='relative z-50 hidden lg:block lg:w-[40%] xl:w-[30%] h-full overflow-x-hidden bg-stone-100 overflow-y-auto no-scrollbar border-r border-white/30'>
            <div className='p-5 space-y-8'>
               <div className='mt-4 flex items-center justify-between'>
                  {heading}
                  {controlButtons}
               </div>
               {content}
            </div>
         </div>

         {/* Mobile Info Panel (animated) */}
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
      <h4 className='text-sm sm:text-base md:text-sm text-textAccent/85 font-normal float-left mb-1.5 w-full'>
         <span className='mr-2'>{icon}</span>
         {title}
      </h4>
      <p className={cn('text-sm sm:text-base md:text-sm', lexend.className)}>{children}</p>
   </div>
)
