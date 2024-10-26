'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import SkeuoBtn from './SkeuoBtn'
import { useState } from 'react'
import OpenAI from 'openai'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useTripStore } from '@/lib/useStore'
import { getCoordinates, getProximity } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import BottomButton from './BottomButton'

const openai = new OpenAI({
   apiKey: process.env.OPENAI,
   dangerouslyAllowBrowser: true,
})

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

const preferencesList = ['coffee', 'restaurants', 'bars', 'nature', 'parks', 'activities', 'zoo', 'arts', 'shopping', 'architecture', 'museums']

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

export default function TripForm({ isLoading, setIsLoading, setShowMap, setLocations }) {
   const { setUserData, setMainCityCoords, updateTripData } = useTripStore()
   const [preferences, setPreferences] = useState([])
   const [preferencesError, setPreferencesError] = useState('')

   const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
         city: '',
         budget: '',
         people: '',
         currency: 'USD',
      },
   })

   const handlePreferences = preference => {
      setPreferences(prev => {
         const newPreferences = prev.includes(preference) ? prev.filter(p => p !== preference) : [...prev, preference]
         setPreferencesError('')
         return newPreferences
      })
   }

   const onSubmit = async formData => {
      if (preferences.length === 0) {
         setPreferencesError('Please select at least one preference')
         return
      }

      setIsLoading(true)
      try {
         const { city, budget, people, currency } = formData
         const userData = { ...formData, preferences }
         setUserData(userData)
         localStorage.setItem('userData', JSON.stringify(userData))

         const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
               {
                  role: 'system',
                  content: [
                     {
                        type: 'text',
                        text: 'Create a prompt to generate travel recommendations based on a given city, budget, and preferences. \n\nInclude relevant location details and country information. \n\n# Steps\n\n1. **Input Analysis**: Determine the travel destination, budget, and personal preferences provided by the user.\n2. **Research and Selection**: \n   - Find destinations and locations within the specified city that align with the user\'s preferences.\n   - Consider the budget constraints when selecting locations.\n   - Include notable attractions, activities, or experiences that fit the criteria.\n3. **Country Information**: \n   - Provide a brief overview of the country where the city is located.\n   - Include emergency numbers, power socket type,  transport prices, local currency, timezone, best season to visit, payment method, useful apps as relevant to a traveler.\n\n# Output Format\n\nThe output should be a JSON file of points that includes:\n- A list of recommended locations and activities within the city with a emoji "icon".\n- A summary of the country\'s relevant information.\n\n# Examples \n\n**Input**: \n- City: [Tokyo]\n- Budget: [9000 zł]\n- People: [2 love couple]\n- Preferences: [coffee, parks, art]\n\n**Output**: \n{\n  "locations": {\n    "Shibuya Crossing": {\n      "description": "Famous bustling intersection with vibrant lights, perfect for a coffee stop nearby.",\n      "icon": "🌆"\n    },\n    "Yoyogi Park": {\n      "description": "Large park near Harajuku, great for a relaxing walk or a picnic with coffee.",\n      "icon": "🌳"\n    },\n    "Meiji Jingu Shrine": {\n      "description": "Historical and spiritual site, located in a forested park near Yoyogi.",\n      "icon": "⛩️"\n    },\n    "Mori Art Museum": {\n      "description": "Contemporary art museum with stunning views from Roppongi Hills.",\n      "icon": "🖼️"\n    }\n  },\n  "emergency_numbers": {\n    "police": {\n      "number": "110",\n      "icon": "🚓"\n    },\n    "ambulance": {\n      "number": "119",\n      "icon": "🚑"\n    },\n    "fire_service": {\n      "number": "119",\n      "icon": "🚒"\n    }\n  },\n  "power_socket": {\n    "type": "A and B",\n    "voltage": "100V",\n    "icon": "🔌"\n  },\n  "transport_prices": {\n    "metro": {\n      "price": "170–320 JPY (5.60–10.50 PLN) depending on distance",\n      "icon": "🚇"\n    },\n    "public_transport": {\n      "price": "170–320 JPY (5.60–10.50 PLN) for buses and trains",\n      "icon": "🚌"\n    },\n    "taxi": {\n      "price": "420 JPY (13.80 PLN) for the first 1 km, then 80 JPY (2.60 PLN) per additional 237m",\n      "icon": "🚖"\n    }\n  },\n  "currency": {\n    "name": "Japanese Yen (JPY)",\n    "icon": "💴"\n  },\n  "average_prices": {\n    "coffee": {\n      "price": "400–600 JPY (13–19 PLN)",\n      "icon": "☕"\n    },\n    "grocery_set": {\n      "price": "2500 JPY (66 PLN) for basic groceries like bread, eggs, milk, etc.",\n      "icon": "🛒"\n    }\n  },\n  "timezone": {\n    "name": "GMT+9",\n    "icon": "🕒"\n  },\n  "best_season": {\n    "season": "Spring (March to May) and Autumn (September to November)",\n    "icon": "🌸🍂"\n  },\n  "payment_method": {\n    "info": "Credit cards are widely accepted, but having some cash is recommended, especially in small shops.",\n    "icon": "💳💵"\n  },\n  "useful_apps": {"Suica":{"description":"App for easy cashless travel across public transport and payments in stores."},"Japan Official Travel App":{"description":"Tourist information app offering guides and tips."},"GuruNavi":{"description":"Food guide app to discover restaurants and coffee shops."}}\n}\n\n\n# Notes\n- Description of places should be short (about 8-12 words)\n- Don\'t recommend a map apps\n- Consider budget and how they influence location recommendations.\n- Address cultural, historical, and recreational aspects when providing country information.\n- Respond me only JSON.\n- Useful apps should not be nested inside each other.\n- Give really good and useful apps, around 3-5 apps and match icon. \n- Generate at least 8 locations around city area. \n- Use locations name that Mapbox Searchbox can recognise.',
                     },
                  ],
               },
               {
                  role: 'user',
                  content: [
                     {
                        type: 'text',
                        text: `City: [${city}]\nBudget: [${budget} ${currency}]\nPeople: [${people}]\nPreferences: [${preferences.join(', ')}]`,
                     },
                  ],
               },
            ],
            temperature: 1,
            max_tokens: 2200,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
               type: 'json_object',
            },
         })

         const tripData = JSON.parse(response.choices[0].message.content)
         updateTripData(tripData)
         localStorage.setItem('tripData', JSON.stringify(tripData))

         const mainCityInfo = await getProximity(city)
         setMainCityCoords(mainCityInfo.coords)
         localStorage.setItem('mainCityCoords', JSON.stringify(mainCityInfo.coords))

         const locationPromises = Object.keys(tripData.locations).map(location => getCoordinates(location, mainCityInfo))
         const resolvedLocations = await Promise.all(locationPromises)

         const formattedLocations = resolvedLocations.map((location, index) => ({
            ...location,
            name: Object.keys(tripData.locations)[index],
            description: tripData.locations[Object.keys(tripData.locations)[index]].description,
            icon: tripData.locations[Object.keys(tripData.locations)[index]].icon,
         }))
         updateTripData({ locations: formattedLocations })
         localStorage.setItem('locations', JSON.stringify(formattedLocations))

         setLocations(formattedLocations)
         setShowMap(true)
      } catch (error) {
         console.error('Error fetching trip data:', error)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-[395px] space-y-6 px-3'>
            <FormField
               control={form.control}
               name='city'
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Input className='text-center' placeholder='Osaka' {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className='flex gap-3 mt-6'>
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

            <div className='space-y-2 relative'>
               <div className='flex flex-wrap gap-2'>
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

            <BottomButton onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
               Generate Trip
            </BottomButton>
         </form>
      </Form>
   )
}
