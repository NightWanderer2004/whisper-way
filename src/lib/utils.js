import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
   return twMerge(clsx(inputs))
}

export async function getProximity(cityName) {
   const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?access_token=${process.env.MAP_KEY}`,
   )
   const data = await response.json()
   const coordinates = data.features[0].center

   return {
      lng: coordinates[0],
      lat: coordinates[1],
   }
}

export async function getCoordinates(placeName, proximity) {
   const accessToken = process.env.MAP_KEY
   const { lng, lat } = proximity
   const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?proximity=${lng},${lat}&access_token=${accessToken}`,
   )
   const data = await response.json()
   const coordinates = data.features[0].center

   return {
      name: placeName,
      lng: coordinates[0],
      lat: coordinates[1],
   }
}
