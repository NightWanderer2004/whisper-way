'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import SkeuoBtn from './SkeuoBtn'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useTripStore } from '@/lib/useStore'
import { getCoordinates, getProximity } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import BottomButton from './BottomButton'
import { toast } from 'sonner'

const formSchema = z.object({
   city: z.string().min(2, { message: 'Enter city you want to visit' }).max(50),
   budget: z.coerce.number().int({ message: 'Must be int' }).positive({ message: 'Enter budget' }).min(1, { message: 'Enter budget' }),
   people: z.coerce
      .number()
      .int({ message: 'Must be int' })
      .positive({ message: 'Enter num of people' })
      .min(1, { message: 'Enter num of people' })
      .max(30, { message: 'Max 30 people' }),
   currency: z.string(),
})

const preferencesList = [
   'coffee',
   'bars',
   'parks',
   'art',
   'family',
   'couples',
   'museums',
   'hidden gems',
   'scenic view',
   'popular places',
   'quiet places',
]

const specialPreferences = ['classic', 'strange', 'hyped']

const currencies = [
   { value: 'AED', label: 'د.إ' },
   { value: 'AUD', label: 'A$' },
   { value: 'BRL', label: 'R$' },
   { value: 'CAD', label: 'C$' },
   { value: 'CHF', label: 'CHF' },
   { value: 'CNY', label: '¥' },
   { value: 'DKK', label: 'kr' },
   { value: 'EUR', label: '€' },
   { value: 'GBP', label: '£' },
   { value: 'HKD', label: 'HK$' },
   { value: 'INR', label: '₹' },
   { value: 'JPY', label: '¥' },
   { value: 'KRW', label: '₩' },
   { value: 'MXN', label: 'Mex$' },
   { value: 'NOK', label: 'kr' },
   { value: 'NZD', label: 'NZ$' },
   { value: 'PLN', label: 'zł' },
   { value: 'RUB', label: '₽' },
   { value: 'SAR', label: '﷼' },
   { value: 'SEK', label: 'kr' },
   { value: 'SGD', label: 'S$' },
   { value: 'THB', label: '฿' },
   { value: 'TRY', label: '₺' },
   { value: 'UAH', label: '₴' },
   { value: 'USD', label: '$' },
   { value: 'ZAR', label: 'R' },
]

export default function TripForm({ isLoading, setIsLoading, setLocations }) {
   const { userData, setUserData, setMainCityCoords, updateTripData, setShowMap } = useTripStore()
   const [preferences, setPreferences] = useState(userData.preferences || [])
   const [preferencesError, setPreferencesError] = useState('')

   const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
         city: userData.city || '',
         budget: userData.budget || '',
         people: userData.people || '',
         currency: userData.currency || 'USD',
      },
   })

   const handlePreferences = preference => {
      setPreferences(prev => {
         if (specialPreferences.includes(preference)) {
            const filteredPrev = prev.filter(p => !specialPreferences.includes(p))
            const newPreferences = prev.includes(preference) ? filteredPrev : [...filteredPrev, preference]
            setPreferencesError('')
            return newPreferences
         }

         const newPreferences = prev.includes(preference) ? prev.filter(p => p !== preference) : [...prev, preference]
         setPreferencesError('')
         return newPreferences
      })
   }

   const checkCityValidity = async city => {
      try {
         const res = await fetch('/api/validateCity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({ city }),
         })

         const data = await res.json().catch(() => null)
         if (!res.ok) return false
         return Boolean(data?.valid)
      } catch (error) {
         console.error('Error checking city validity:', error)
         return false
      }
   }

   const onSubmit = async formData => {
      if (preferences.length === 0) {
         setPreferencesError('Please select at least one preference')
         return
      }

      const isCityValid = await checkCityValidity(formData.city)
      if (!isCityValid) {
         toast.error('The provided city is not valid. Please check and try again')
         return
      }

      setIsLoading(true)
      try {
         const { city, budget, people, currency } = formData
         const userData = { ...formData, preferences }
         setUserData(userData)

         const storageUpdates = {
            showMap: true,
         }

         const tripRes = await fetch('/api/generateTrip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({
               city,
               budget,
               people,
               currency,
               preferences,
            }),
         })

         const tripData = await tripRes.json().catch(() => null)

         if (!tripRes.ok) {
            const msg = tripData?.error?.message || tripData?.error || 'Failed to generate trip. Please try again.'
            toast.error(msg)
            setIsLoading(false)
            return
         }

         if (tripData?.error) {
            toast.error(tripData.error.message)
            setIsLoading(false)
            return
         }

         if (!Array.isArray(tripData?.locations) || tripData.locations.length === 0) {
            toast.error('Trip response is missing locations. Please try again.')
            setIsLoading(false)
            return
         }

         const mainCityInfo = await getProximity(city)
         setMainCityCoords(mainCityInfo.coords)
         storageUpdates.mainCityCoords = mainCityInfo.coords
         storageUpdates.userData = userData

         const locationPromises = tripData.locations.map(location =>
            getCoordinates(location, mainCityInfo).catch(error => {
               console.warn(`Failed to get coordinates for ${location.name}:`, error)
               return null
            }),
         )

         const resolvedLocations = await Promise.all(locationPromises)
         const formattedLocations = resolvedLocations.filter(Boolean)

         if (formattedLocations.length === 0) {
            throw new Error('No valid locations found')
         }

         const updatedTripData = {
            ...tripData,
            locations: formattedLocations,
         }
         updateTripData(updatedTripData)

         storageUpdates.tripData = updatedTripData
         storageUpdates.locations = formattedLocations
         storageUpdates.userData = userData
         storageUpdates.mainCityCoords = mainCityInfo.coords

         localStorage.setItem('tripStorageData', JSON.stringify(storageUpdates))

         setLocations(formattedLocations)
         setIsLoading(false)
         setShowMap(true)
      } catch (error) {
         console.error('Error fetching trip data:', error)
         toast.error('Failed to generate trip. Please try again.')
         setIsLoading(false)
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-[395px] px-3 lg:px-0'>
            <FormField
               control={form.control}
               name='city'
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Input className='text-center' placeholder='Montreal' {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className='flex gap-3 mt-4'>
               <div className='relative'>
                  <FormField
                     control={form.control}
                     name='budget'
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input type='number' className='appearance-none pr-24' placeholder='1200' {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className='absolute top-0 right-0'>
                     <FormField
                        control={form.control}
                        name='currency'
                        render={({ field }) => (
                           <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                 <FormControl>
                                    <SelectTrigger className='h-[55px] rounded-r-[24px] px-3'>
                                       <SelectValue placeholder='Select currency' />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {currencies.map(currency => (
                                       <SelectItem key={currency.value} value={currency.value}>
                                          {currency.value} | {currency.label}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </div>
               <FormField
                  control={form.control}
                  name='people'
                  render={({ field }) => (
                     <FormItem className='relative'>
                        <FormControl>
                           <div className='flex items-center justify-center'>
                              <button
                                 type='button'
                                 onClick={() => form.setValue('people', Math.max(1, parseInt(field.value) - 1))}
                                 className='absolute left-0 h-full w-12 text-stone-500/60 rounded-l-[24px] active:scale-95 transition-transform'
                                 aria-label='Decrease number of people'
                              >
                                 -
                              </button>
                              <Input
                                 type='number'
                                 className='appearance-none text-center'
                                 placeholder='👥'
                                 {...field}
                                 onChange={e => {
                                    const value = parseInt(e.target.value)
                                    if (!isNaN(value) && value >= 1 && value <= 30) {
                                       field.onChange(e)
                                    }
                                 }}
                              />
                              <button
                                 type='button'
                                 onClick={() => form.setValue('people', Math.min(30, field.value ? parseInt(field.value) + 1 : 1))}
                                 className='absolute right-0 h-full w-12 text-stone-500/60 rounded-r-[24px] active:scale-95 transition-transform'
                                 aria-label='Increase number of people'
                              >
                                 +
                              </button>
                           </div>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className='space-y-2 relative mt-4'>
               <div className='flex flex-wrap justify-center gap-2'>
                  {preferencesList.map(preference => (
                     <SkeuoBtn
                        key={preference}
                        onClick={e => {
                           e.preventDefault()
                           handlePreferences(preference)
                        }}
                        className={preferences.includes(preference) ? 'bg-selectedBg text-textAccent' : ''}
                     >
                        {preference}
                     </SkeuoBtn>
                  ))}
               </div>
               <div className='flex flex-wrap justify-center gap-2 mt-4'>
                  {specialPreferences.map(preference => (
                     <SkeuoBtn
                        key={preference}
                        onClick={e => {
                           e.preventDefault()
                           handlePreferences(preference)
                        }}
                        className={`${preferences.includes(preference) ? 'bg-selectedBg text-textAccent' : ''} ${preferences.some(p => specialPreferences.includes(p) && p !== preference) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={preferences.some(p => specialPreferences.includes(p) && p !== preference)}
                     >
                        {preference}
                     </SkeuoBtn>
                  ))}
               </div>
               {preferencesError && (
                  <AnimatePresence mode='wait'>
                     <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.55, ease: 'backOut' }}
                        className='text-[0.8rem] font-normal text-red-500/80 absolute left-1.5 -bottom-8'
                     >
                        {preferencesError}
                     </motion.p>
                  </AnimatePresence>
               )}
            </div>

            <BottomButton className='lg:mb-28' isForm={true} onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
               Find Spots
            </BottomButton>
         </form>
      </Form>
   )
}
