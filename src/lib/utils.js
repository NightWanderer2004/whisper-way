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

   return {
      coords: {
         lng: coordinates.longitude,
         lat: coordinates.latitude,
      },
      country,
   }
}

export async function getCoordinates(placeName, cityInfo) {
   const accessToken = process.env.MAP_KEY
   const { lng, lat } = cityInfo.coords
   const { country } = cityInfo
   const responseSuggest = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(placeName)}&language=en&country=${country.toLowerCase()}&limit=1&proximity=${lng},${lat}&session_token=2a48b7cb-d6d3-42b4-a9a1-60176a1bc0aa&access_token=${accessToken}`,
   )
   const dataSuggest = await responseSuggest.json()
   const placeId = dataSuggest.suggestions[0]?.mapbox_id

   if (placeId) {
      const responseCoords = await fetch(
         `https://api.mapbox.com/search/searchbox/v1/retrieve/${placeId}?session_token=2a48b7cb-d6d3-42b4-a9a1-60176a1bc0aa&access_token=${accessToken}`,
      )

      const dataCoords = await responseCoords.json()
      const coordinates = dataCoords.features[0].properties.coordinates

      return {
         name: placeName,
         lng: coordinates.longitude,
         lat: coordinates.latitude,
      }
   } else return
}
