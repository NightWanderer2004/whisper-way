import { create } from 'zustand'
import { supabase } from './supabase/client'

const useTripStore = create(set => ({
   trips: [],
   userData: null,
   showMap: false,
   fetchTrips: async userId => {
      const { data, error } = await supabase.from('trips').select('*').eq('user_id', userId)
      if (error) {
         console.error('Error fetching trips:', error)
         return
      }
      set({ trips: data })
   },
   addTrip: async (tripData, locations) => {
      const { data, error } = await supabase.from('trips').insert([{ ...tripData, locations }])
      if (error) {
         console.error('Error adding trip:', error)
         return
      }
      set(state => ({ trips: [...state.trips, ...data] }))
   },
   cleanStorage: () => {
      set({ trips: [], userData: null, showMap: false })
   },
   setShowMap: show => {
      set({ showMap: show })
   },
   initializeFromLocalStorage: () => {
      const storedData = localStorage.getItem('tripData')
      if (storedData) {
         set({ trips: JSON.parse(storedData) })
      }
   },
   fetchUserData: async () => {
      const {
         data: { user },
         error,
      } = await supabase.auth.getUser()
      if (error) {
         console.error('Error fetching user data:', error)
         return
      }
      set({ userData: user })
   },
}))

export { useTripStore }
