import { create } from 'zustand'

export const useTripStore = create(set => ({
   userData: {
      city: '',
      budget: 0,
      people: 1,
      preferences: [],
      currency: 'USD',
   },
   setUserData: userTrip => set({ userTrip }),

   mainCityCoords: { lng: 0, lat: 0 },
   setMainCityCoords: newCoords => set({ mainCityCoords: newCoords }),

   tripData: {},
   updateTripData: newTripData => set(state => ({ tripData: { ...state.tripData, ...newTripData } })),

   initializeFromLocalStorage: () => {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      const mainCityCoords = JSON.parse(localStorage.getItem('mainCityCoords') || '{}')
      const tripData = JSON.parse(localStorage.getItem('tripData') || '{}')
      const locations = JSON.parse(localStorage.getItem('locations') || '[]')

      set(state => ({
         userData: { ...state.userData, ...userData },
         mainCityCoords: { ...state.mainCityCoords, ...mainCityCoords },
         tripData: { ...state.tripData, ...tripData, locations },
      }))
   },
   cleanStorage: () => {
      localStorage.removeItem('userData')
      localStorage.removeItem('mainCityCoords')
      localStorage.removeItem('tripData')
      localStorage.removeItem('locations')

      set({
         userData: {},
         mainCityCoords: {},
         tripData: {},
         locations: [],
      })
   },
}))
