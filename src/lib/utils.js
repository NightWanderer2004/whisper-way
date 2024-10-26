import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
   return twMerge(clsx(inputs))
}

export async function getProximity(cityName) {
   const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(cityName)}&types=place&access_token=${process.env.MAP_KEY}`,
   )

   const data = await response.json()
   const coordinates = data.features[0].properties.coordinates
   const country = data.features[0].properties.context.country.country_code
   const bbox = data.features[0].properties.bbox

   return {
      coords: {
         lng: coordinates.longitude,
         lat: coordinates.latitude,
      },
      country,
      bbox: {
         min_lon: bbox[0],
         min_lat: bbox[1],
         max_lon: bbox[2],
         max_lat: bbox[3],
      },
   }
}

export async function getCoordinates(placeName, cityInfo) {
   const accessToken = process.env.MAP_KEY
   const { lng, lat } = cityInfo.coords
   const { country } = cityInfo
   const { min_lon, min_lat, max_lon, max_lat } = cityInfo.bbox

   const responseCoords = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?country=${country.toLowerCase()}&bbox=${min_lon},${min_lat},${max_lon},${max_lat}&limit=1&proximity=${lng},${lat}&access_token=${accessToken}`,
   )

   const dataCoords = await responseCoords.json()
   const coordinates = dataCoords.features[0]?.center

   return {
      name: placeName,
      lng: coordinates[0],
      lat: coordinates[1],
   }
}
