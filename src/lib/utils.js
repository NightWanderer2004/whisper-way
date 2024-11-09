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

export async function getCoordinates(locationData, cityInfo) {
   const accessToken = process.env.MAP_KEY
   const { lng, lat } = cityInfo.coords
   const { country } = cityInfo
   const { min_lon, min_lat, max_lon, max_lat } = cityInfo.bbox

   const responseCoords = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationData.address)}.json?country=${country.toLowerCase()}&bbox=${min_lon},${min_lat},${max_lon},${max_lat}&limit=1&proximity=${lng},${lat}&access_token=${accessToken}`,
   )

   const dataCoords = await responseCoords.json()
   if (dataCoords.features.length == 0) return

   const coordinates = dataCoords.features[0].center
   return {
      name: locationData.name,
      address: locationData.address,
      description: locationData.description,
      icon: locationData.icon,
      lng: coordinates[0] || null,
      lat: coordinates[1] || null,
   }
}

export async function fetchPlaceId(placeName) {
   const response = await fetch(`/api/fetchPlaceId?placeName=${placeName}`)
   const data = await response.json()

   if (response.ok) {
      return data.placeId
   } else {
      console.warn(data.error || 'Failed to fetch place ID for this location')
   }

   return null
}

export async function fetchPlaceImages(placeId) {
   const response = await fetch(`/api/fetchPlaceImages?placeId=${placeId}`)
   const data = await response.json()

   if (response.ok) {
      return data || []
   } else {
      console.warn(data.error || 'Failed to fetch images for this location')
   }

   return []
}
