import { create } from 'zustand'

export const useTripStore = create(set => ({
   userData: {
      city: '',
      budget: 0,
      people: 1,
      preferences: [],
   },
   setUserData: userTrip => set({ userTrip }),

   mainCityCoords: { lng: 0, lat:0 },
   setMainCityCoords: newCoords => set({ mainCityCoords: newCoords }),

   // tripData: {
   //    locations: {
   //       "St. Sophia's Cathedral": {
   //          description: 'Historical and cultural landmark.',
   //          icon: '🏛️',
   //       },
   //       'National Art Museum of Ukraine': {
   //          description: 'Museum with a large collection of Ukrainian art.',
   //          icon: '🖼️',
   //       },
   //       'Mystetskyi Arsenal': {
   //          description: 'Cultural center for exhibitions and events.',
   //          icon: '🎨',
   //       },
   //       "Andriyivskyi Uzviz (Andrew's Descent)": {
   //          description: 'Street with galleries, shops, and local cuisine restaurants.',
   //          icon: '🛤️',
   //       },
   //       'Kyiv Opera House': {
   //          description: 'Main opera theater.',
   //          icon: '🎭',
   //       },
   //       'Kanapa Restaurant': {
   //          description: 'Modern interpretation of Ukrainian cuisine.',
   //          icon: '🍽️',
   //       },
   //    },
   //    emergency_numbers: {
   //       police: {
   //          number: '102',
   //          icon: '🚓',
   //       },
   //       ambulance: {
   //          number: '103',
   //          icon: '🚑',
   //       },
   //       fire_service: {
   //          number: '101',
   //          icon: '🚒',
   //       },
   //    },
   //    power_socket: {
   //       type: 'C and F',
   //       voltage: '220V',
   //       icon: '🔌',
   //    },
   //    transport_prices: {
   //       metro: {
   //          price: '8 UAH (0.20 EUR) per trip',
   //          icon: '🚇',
   //       },
   //       public_transport: {
   //          price: '8 UAH (0.20 EUR)',
   //          icon: '🚌',
   //       },
   //       taxi: {
   //          price: '50–150 UAH (1.25–3.75 EUR)',
   //          icon: '🚖',
   //       },
   //    },
   //    currency: {
   //       name: 'Ukrainian Hryvnia (UAH)',
   //       icon: '💱',
   //    },
   //    average_prices: {
   //       beer: {
   //          price: '40–60 UAH (1–1.50 EUR) for 0.5 liter',
   //          icon: '🍺',
   //       },
   //       coffee: {
   //          price: '35–50 UAH (0.85–1.25 EUR)',
   //          icon: '☕',
   //       },
   //       grocery_set: {
   //          price: '260 UAH (5.70 EUR)',
   //          icon: '🛒',
   //       },
   //    },
   //    timezone: {
   //       name: 'GMT+3',
   //       icon: '🕒',
   //    },
   //    best_season: {
   //       season: 'Spring and Autumn',
   //       icon: '🌸🍂',
   //    },
   //    payment_method: {
   //       info: "Bank cards are widely used, but it's good to have some cash.",
   //       icon: '💳💵',
   //    },
   //    useful_apps: {
   //       'Kyiv Smart City': {
   //          description: 'For public transport payments and city services.',
   //          icon: '📱',
   //       },
   //       Uklon: {
   //          description: 'Popular taxi service.',
   //          icon: '🚖',
   //       },
   //       Bolt: {
   //          description: 'Popular taxi and food delivery service.',
   //          icon: '🚖🍔',
   //       },
   //       Glovo: {
   //          description: 'Food delivery service.',
   //          icon: '🍕📦',
   //       },
   //    },
   // },
   tripData: {},
   updateTripData: newTripData => set(state => ({ tripData: { ...state.tripData, ...newTripData } })),

   // increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
   // removeAllBears: () => set({ bears: 0 }),
   // updateBears: newBears => set({ bears: newBears }),
}))
