'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { toast } from 'sonner'

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

const preferencesList = [
   'coffee',
   'restaurants',
   'bars',
   'parks',
   'malls',
   'hidden gems',
   'family',
   'couples',
   'architecture',
   'activities',
   'museums',
   'arts',
   'quiet places',
   'scenic view',
]

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
         const newPreferences = prev.includes(preference) ? prev.filter(p => p !== preference) : [...prev, preference]
         setPreferencesError('')
         return newPreferences
      })
   }

   const checkCityValidity = async city => {
      try {
         const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
               {
                  role: 'user',
                  content: `Is "${city}" a valid city or text is not something else? Respond with true or false.`,
               },
            ],
         })
         return response.choices[0].message.content.toLowerCase() === 'true'
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

         const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
               {
                  role: 'system',
                  content: [
                     {
                        type: 'text',
                        text: '### Create a Prompt to Generate Travel Recommendations\n\n**Objective**: Generate travel recommendations based on a given city, budget, and preferences. \n\n**Details to Include**:\n- Relevant location details\n- Trip information\n\n---\n\n### Steps\n\n1. **Input Analysis**: \n   - Determine the travel destination, budget, and personal preferences provided by the user.\n\n2. **Research and Selection**: \n   - Find destinations and locations within the specified city that align with the user’s preferences.\n   - Consider budget constraints when selecting locations.\n   - Include notable attractions, activities, or experiences that fit the criteria.\n\n3. **Country Information**: \n   - Provide a brief overview of the country where the city is located.\n   - Include emergency numbers, power socket type, transport prices, local currency, timezone, best season to visit, payment methods, and useful apps for travelers.\n\n---\n\n### Output Format\n\nThe output should be a JSON file that includes:\n- A list of recommended locations and activities within the city, each with an emoji “icon.”\n- A summary of the country’s relevant information.\n\n---\n\n### Example\n\n**Input**:\n- City: [Tokyo]\n- Budget: [9000 zł]\n- People: [2 love couple]\n- Preferences: [coffee, parks, art]\n\n**Output**:\n```json\n{\n  "locations": [\n    {\n      "name": "Shibuya Crossing",\n      "address": "1-23-10, Tokyo, Tokyo Prefecture 150-0041, Japan",\n      "description": "Famous bustling intersection with vibrant lights, perfect for a coffee stop nearby.",\n      "icon": "🌆"\n    },\n    {\n      "name": "Yoyogi Park",\n      "address": "2, Tokyo, Tokyo Prefecture 151-0052, Japan",\n      "description": "Large park near Harajuku, great for a relaxing walk or a picnic with coffee.",\n      "icon": "🌳"\n    },\n    {\n      "name": "Meiji Jingu Shrine",\n      "address": "1-1, Tokyo, Tokyo Prefecture 151-0052, Japan",\n      "description": "Historical and spiritual site, located in a forested park near Yoyogi.",\n      "icon": "⛩️"\n    },\n    {\n      "name": "Mori Art Museum",\n      "address": "6-10-1, Tokyo, Tokyo Prefecture 106-6124, Japan",\n      "description": "Contemporary art museum with stunning views from Roppongi Hills.",\n      "icon": "🖼️"\n    }\n  ],\n  "grocery_stores": [\n    {\n      "name": "Seijo Ishii",\n      "icon": "🛒"\n    },\n    {\n      "name": "Aeon",\n      "icon": "🛒"\n    },\n    {\n      "name": "Life",\n      "icon": "🛒"\n    }\n  ],\n  "emergency_numbers": {\n    "police": {\n      "number": "110",\n      "icon": "🚓"\n    },\n    "ambulance": {\n      "number": "119",\n      "icon": "🚑"\n    },\n    "fire_service": {\n      "number": "119",\n      "icon": "🚒"\n    }\n  },\n  "power_socket": {\n    "type": "A and B",\n    "voltage": "100V",\n    "icon": "🔌"\n  },\n  "transport_prices": {\n    "metro": {\n      "price": "170–320 JPY (5.60–10.50 PLN) depending on distance",\n      "icon": "🚇"\n    },\n    "public_transport": {\n      "price": "170–320 JPY (5.60–10.50 PLN) for buses and trains",\n      "icon": "🚌"\n    },\n    "taxi": {\n      "price": "420 JPY (13.80 PLN) for the first 1 km, then 80 JPY (2.60 PLN) per additional 237m",\n      "icon": "🚖"\n    }\n  },\n  "currency": {\n    "name": "Japanese Yen (JPY)",\n    "icon": "💴"\n  },\n  "average_prices": {\n    "coffee": {\n      "price": "400–600 JPY (13–19 PLN)",\n      "icon": "☕"\n    },\n    "grocery_set": {\n      "price": "2500 JPY (66 PLN) for basic groceries like bread, eggs, milk, etc.",\n      "icon": "🛒"\n    }\n  },\n  "timezone": {\n    "name": "GMT+9",\n    "icon": "🕒"\n  },\n  "best_season": {\n    "season": "Spring (March to May) and Autumn (September to November)",\n    "icon": "🌸🍂"\n  },\n  "payment_method": {\n    "info": "Credit cards are widely accepted, but having some cash is recommended, especially in small shops.",\n    "icon": "💳💵"\n  },\n  "useful_apps": {\n    "Suica": {\n      "description": "App for easy cashless travel across public transport and payments in stores.",\n      "icon": "🚊"\n    },\n    "Tokyo Metro Subway Map": {\n      "description": "The map covers the Tokyo Metro lines, Toei lines and JR Yamanote line.",\n      "icon": "🚇"\n    },\n    "Safety tips": {\n      "description": "Find out the latest disaster information including early earthquake warnings, tsunami, and volcanic activity.",\n      "icon": "🦺"\n    }\n  },\n  "useful_phrases": {\n    "greetings": {\n      "phrase": "Hello / Good morning",\n      "translation": "Konnichiwa / Ohayou gozaimasu",\n      "icon": "👋"\n    },\n    "thank_you": {\n      "phrase": "Thank you",\n      "translation": "Arigatou gozaimasu",\n      "icon": "🙏"\n    },\n    "excuse_me": {\n      "phrase": "Excuse me / Sorry",\n      "translation": "Sumimasen",\n      "icon": "🙇"\n    },\n    "where_is": {\n      "phrase": "Where is...?",\n      "translation": "… wa doko desu ka?",\n      "icon": "📍"\n    },\n    "how_much": {\n      "phrase": "How much?",\n      "translation": "Ikura desu ka?",\n      "icon": "💰"\n    },\n    "help": {\n      "phrase": "Help!",\n      "translation": "Tasukete!",\n      "icon": "🆘"\n    },\n    "do_you_speak_english": {\n      "phrase": "Do you speak English?",\n      "translation": "Eigo o hanasemasu ka?",\n      "icon": "💬"\n    },\n    "bathroom": {\n      "phrase": "Where is the bathroom?",\n      "translation": "Toire wa doko desu ka?",\n      "icon": "🚻"\n    },\n    "food_allergy": {\n      "phrase": "I have a food allergy.",\n      "translation": "Shokuhin arerugī ga arimasu.",\n      "icon": "⚠️"\n    }\n  },\n  "city_cleanliness": {\n    "rating": "Very clean",\n    "description": "The city is known for its cleanliness with regular street cleaning, strict littering laws, and an emphasis on environmental consciousness.",\n    "icon": "🌍🧼"\n  }\n}\n```\n\n---\n\n### Notes\n- If country and currency are the same, skip "useful_phrases".\n- Description of places should be brief (8-12 words).\n- Avoid recommending mapping or travel apps.\n- Ensure locations recommended are budget-friendly.\n- Useful apps should not be nested; list 3-5 with matching icons.\n- Generate at least 8 unique locations within the city.\n- Use street addresses for coordinates but names for display in the app.\n- If you notice some problems, response with "error" key object with "message" text.',
                     },
                  ],
               },
               {
                  role: 'user',
                  content: [
                     {
                        type: 'text',
                        text: `City: [${city}]\nBudget: [${budget} ${currency}]\nPeople: [${people}]\nPreferences: [${preferences.join(', ')}]\nTime of year: [${new Date().getFullYear()}-${new Date().getMonth() + 1}]\n`,
                     },
                  ],
               },
            ],
            temperature: 1,
            max_tokens: 2600,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
               type: 'json_object',
            },
         })

         const tripData = JSON.parse(response.choices[0].message.content)

         if (tripData.error) {
            toast.error(tripData.error.message)
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
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-[395px] space-y-6 px-3 lg:px-0 lg:relative lg:bottom-5'>
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

            <div className='space-y-2 relative pt-4'>
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

            <BottomButton className='lg:mb-28' isForm={true} onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
               Generate Trip
            </BottomButton>
         </form>
      </Form>
   )
}
