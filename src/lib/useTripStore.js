import { create } from 'zustand'
import { supabase } from './supabase/client'

const useTripStore = create(set => ({
   tripData: {
      trips: [],
      userData: null,
      locations: [],
      mainCityCoords: null,
      country_info: {},
   },
   showMap: false,
   fetchTrips: async userId => {
      const { data, error } = await supabase.from('trips').select('*').eq('user_id', userId)
      if (error) {
         console.error('Error fetching trips:', error)
         return
      }
      set(state => ({ tripData: { ...state.tripData, trips: data } }))
   },
   addTrip: async (tripData, locations) => {
      const { data, error } = await supabase.from('trips').insert([{ ...tripData, locations }])
      if (error) {
         console.error('Error adding trip:', error)
         return
      }
      set(state => ({ tripData: { ...state.tripData, trips: [...state.tripData.trips, ...data] } }))
   },
   cleanStorage: () => {
      set({ tripData: { trips: [], userData: null, locations: [], mainCityCoords: null, country_info: {} }, showMap: false })
   },
   setShowMap: show => {
      set({ showMap: show })
   },
   setTripData: tripData => {
      set(state => ({ tripData: { ...state.tripData, ...tripData } }))
   },
   initializeFromLocalStorage: () => {
      const storedData = localStorage.getItem('tripData')
      if (storedData) {
         set({ tripData: JSON.parse(storedData) })
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
      set(state => ({ tripData: { ...state.tripData, userData: user } }))
   },
   fetchTripById: async tripId => {
      const { data, error } = await supabase.from('trips').select('*').eq('id', tripId).single()
      if (error) {
         console.error('Error fetching trip:', error)
         return null
      }
      set(state => ({ tripData: { ...state.tripData, ...data } }))
      return data
   },
}))

export { useTripStore }
