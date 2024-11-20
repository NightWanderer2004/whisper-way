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
   const { min_lon, min_lat, max_lon, max_lat } = cityInfo.bbox

   const res = await fetch(`/api/fetchPlace?placeName=${encodeURIComponent(locationData.name)}&bbox=${min_lon},${min_lat},${max_lon},${max_lat}`)

   const data = await res.json()
   if (!res.ok || !data.name || !data.coords) return

   return {
      placeId: data.placeId,
      name: data.name,
      description: locationData.description,
      icon: locationData.icon,
      lng: data.coords.lng,
      lat: data.coords.lat,
   }
}

export async function getPlaceImages(placeId) {
   const response = await fetch(`/api/fetchPlaceImages?placeId=${placeId}`)
   const data = await response.json()

   if (response.ok) {
      return data || []
   } else {
      console.warn(data.error || 'Failed to fetch images for this location')
   }

   return []
}
