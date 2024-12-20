import { create } from 'zustand'

export const useTripStore = create(set => ({
   userData: {
      city: '',
      budget: 0,
      people: 0,
      preferences: [],
      currency: 'USD',
   },
   setUserData: newUserData => set({ userData: newUserData }),

   mainCityCoords: { lng: 0, lat: 0 },
   setMainCityCoords: newCoords => set({ mainCityCoords: newCoords }),

   tripData: {},
   updateTripData: newTripData => set({ tripData: newTripData }),

   showMap: false,
   setShowMap: show => set({ showMap: show }),

   initializeFromLocalStorage: () => {
      const storedData = localStorage.getItem('tripStorageData')
      if (storedData) {
         const parsedData = JSON.parse(storedData)
         set({
            userData: parsedData.userData || {},
            tripData: parsedData.tripData || {},
            mainCityCoords: parsedData.mainCityCoords || {},
            showMap: parsedData.showMap || false,
         })
      }
   },
   cleanStorage: () => {
      localStorage.removeItem('tripStorageData')
      set({
         userData: {},
         tripData: {},
         mainCityCoords: {},
         showMap: false,
      })
   },
}))
