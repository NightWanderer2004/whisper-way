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

   // increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
   // removeAllBears: () => set({ bears: 0 }),
   // updateBears: newBears => set({ bears: newBears }),
}))
