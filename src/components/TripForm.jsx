'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import SkeuoBtn from './SkeuoBtn'
import { useState } from 'react'

const formSchema = z.object({
   city: z.string().min(2, { message: 'Enter city you want to visit' }).max(50),
   budget: z.coerce.number().int({ message: 'Must be int' }).positive({ message: 'Enter budget' }).min(1, { message: 'Enter budget' }),
   people: z.coerce
      .number()
      .int({ message: 'Must be int' })
      .positive({ message: 'Enter num of people' })
      .min(1, { message: 'Enter num of people' })
      .max(30, { message: 'Max 30 people' }),
   preferences: z.string().min(1),
})
const preferencesList = [
   'coffee',
   'restaurants',
   'bars',
   'nature',
   'parks',
   'zoo',
   'activities',
   'shopping',
   'shows',
   'arts',
   'museums',
   'architecture',
]

export default function TripForm() {
   const [preferences, setPreferences] = useState([])

   const handlePreferences = e => {
      const preference = e.target.innerText
      if (preferences.includes(preference)) {
         setPreferences(preferences.filter(p => p !== preference))
      } else {
         setPreferences([...preferences, preference])
      }
   }

   // useEffect(() => {
   //    console.log(preferences)
   // }, [preferences])

   const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
         city: '',
         budget: '',
         people: '',
         preferences: '',
      },
   })

   function onSubmit(values) {
      console.log(values)
   }
   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-[360px]'>
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
               <FormField
                  control={form.control}
                  name='budget'
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input type='number' className='appearance-none' placeholder='3000' {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name='people'
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input type='number' className='appearance-none' placeholder='2' {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>
            <div className='flex flex-wrap gap-2 pt-8'>
               {preferencesList.map(preference => (
                  <SkeuoBtn key={preference} onClick={handlePreferences}>
                     {preference}
                  </SkeuoBtn>
               ))}
            </div>
         </form>
      </Form>
   )
}
