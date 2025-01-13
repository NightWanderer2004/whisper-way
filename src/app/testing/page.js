'use client'
import { supabase } from '@/lib/supabase/client'

export default function page() {
   const addSampleTrip = async () => {
      const { data, error } = await supabase.from('trips').insert({
         user: 1,
         tripData: JSON.stringify({
            city: 'Sample City',
            budget: 1000,
            people: 2,
            currency: 'USD',
            preferences: ['parks', 'museums'],
            locations: [],
            country_info: {},
         }),
      })
      if (error) {
         console.error('Error adding sample trip:', error)
      } else {
         console.log('Sample trip added:', data)
      }
   }

   // addSampleTrip()

   return <button className='mb-4'>Add Sample Trip</button>
}
