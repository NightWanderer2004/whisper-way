import { lexend } from '@/app/fonts'
import { useTripStore } from '@/lib/useStore'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const slideAnimation = {
   initial: { y: '100%' },
   animate: { y: 0 },
   exit: { y: '100%' },
   transition: {
      ease: [0.32, 0.72, 0, 1],
      duration: 0.55,
   },
}

export default function InfoPanel({ showInfoMobile, setShowInfoMobile, data, resetMapPosition }) {
   const { cleanStorage } = useTripStore()
   const [localShowInfoMobile, setLocalShowInfoMobile] = useState(showInfoMobile)
   const city = useTripStore(state => state.userData.city)

   useEffect(() => {
      setLocalShowInfoMobile(showInfoMobile)
   }, [showInfoMobile])

   const heading = <h2 className='text-3xl font-medium text-textAccent'>{city}</h2>

   const controlButtons = (
      <div className='flex space-x-2'>
         <button
            onClick={() => {
               resetMapPosition()
               setShowInfoMobile(false)
            }}
            className='text-textAccent/80 bg-lime-400/30 text-xs font-normal flex items-center justify-center p-1 px-1.5 leading-none rounded-full border-2 border-white/20 shadow-smooth hover:bg-lime-400/70 transition-colors duration-200'
         >
            reset position
         </button>
         <button
            onClick={() => {
               cleanStorage()
               setShowInfoMobile(false)
               window.location.reload()
            }}
            className='text-textAccent/80 bg-rose-400/30 text-xs font-normal flex items-center justify-center p-1 px-1.5 leading-none rounded-full border-2 border-white/20 shadow-smooth hover:bg-rose-400/70 transition-colors duration-200'
         >
            start over
         </button>
      </div>
   )

   const content = data ? (
      <>
         <Section title='Your spots'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
               {Object.entries(data.locations || {}).map(([index, info]) => (
                  <InfoCard key={index} title={data.locations[index].name} icon={info.icon}>
                     <p className='text-sm'>{info.description}</p>
                  </InfoCard>
               ))}
            </div>
         </Section>

         {data.emergency_numbers && (
            <Section title='Emergency numbers'>
               <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                  {Object.entries(data.emergency_numbers).map(([service, info]) => (
                     <InfoCard key={service} title={service} icon={info.icon}>
                        <p className='text-lg font-semibold'>{info.number}</p>
                     </InfoCard>
                  ))}
               </div>
            </Section>
         )}

         <Section title='Useful info'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
               {data.power_socket && (
                  <InfoCard title='Power socket' icon={data.power_socket.icon}>
                     <p className='text-sm'>Type: {data.power_socket.type}</p>
                     <p className='text-sm'>Voltage: {data.power_socket.voltage}</p>
                  </InfoCard>
               )}
               {data.currency && (
                  <InfoCard title='Currency' icon={data.currency.icon}>
                     <p className='text-sm'>{data.currency.name}</p>
                  </InfoCard>
               )}
               {data.timezone && (
                  <InfoCard title='Timezone' icon={data.timezone.icon}>
                     <p className='text-sm'>{data.timezone.name}</p>
                  </InfoCard>
               )}
               {data.best_season && (
                  <InfoCard title='Best season' icon={data.best_season.icon}>
                     <p className='text-sm'>{data.best_season.season}</p>
                  </InfoCard>
               )}
               {data.payment_method && (
                  <InfoCard title='Payment method' icon={data.payment_method.icon}>
                     <p className='text-sm'>{data.payment_method.info}</p>
                  </InfoCard>
               )}
            </div>
         </Section>

         {(data.transport_prices || data.average_prices) && (
            <Section title='Prices'>
               {data.transport_prices && (
                  <>
                     <h4 className='text-sm font-normal mb-2'>Transport</h4>
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-4'>
                        {Object.entries(data.transport_prices).map(([type, info]) => (
                           <InfoCard key={type} title={type.charAt(0).toUpperCase() + type.slice(1).split('_').join(' ')} icon={info.icon}>
                              <p className='text-sm'>{info.price}</p>
                           </InfoCard>
                        ))}
                     </div>
                  </>
               )}
               {data.average_prices && (
                  <>
                     <h4 className='text-sm font-normal mb-2'>Average</h4>
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {Object.entries(data.average_prices).map(([item, info]) => (
                           <InfoCard key={item} title={item.charAt(0).toUpperCase() + item.slice(1).split('_').join(' ')} icon={info.icon}>
                              <p className='text-sm'>{info.price}</p>
                           </InfoCard>
                        ))}
                     </div>
                  </>
               )}
            </Section>
         )}

         {data.useful_apps && (
            <Section title='Useful Apps'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {Object.entries(data.useful_apps).map(([app, info]) => (
                     <InfoCard key={app} title={app} icon='📱'>
                        <p className='text-sm'>{info.description}</p>
                     </InfoCard>
                  ))}
               </div>
            </Section>
         )}
      </>
   ) : null

   return (
      <AnimatePresence>
         {/* Desktop Info Panel (always visible) */}
         <div className='relative z-50 hidden md:block w-[30%] h-full bg-stone-100 overflow-y-auto backdrop-blur-md no-scrollbar border-r border-white/30'>
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
               className='info-panel absolute z-50 md:hidden bottom-0 left-0 pb-24 w-full h-full bg-whiteBg overflow-y-auto backdrop-blur-md no-scrollbar'
            >
               <div className='p-5 pt-16 space-y-8'>
                  <div className='mt-4 flex items-center justify-between'>
                     {heading}
                     {controlButtons}
                  </div>
                  {content}
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   )
}

const Section = ({ title, children }) => (
   <section>
      <h3 className='text-xl font-normal mb-2 text-textAccent'>{title}</h3>
      {children}
   </section>
)

const InfoCard = ({ title, icon, children }) => (
   <div className={cn('bg-whiteBg p-3 text-textColor rounded-xl border border-white/30 shadow-smooth', lexend.className)}>
      <h4 className='text-sm font-normal flex items-center mb-1'>
         <span className='mr-2'>{icon}</span>
         {title}
      </h4>
      {children}
   </div>
)
