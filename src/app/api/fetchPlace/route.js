import { NextResponse } from 'next/server'

export async function GET(req) {
   const placeName = req.nextUrl.searchParams.get('placeName')
   const apiKey = process.env.GOOGLE_MAPS_API_KEY

   if (!placeName) {
      return NextResponse.json({ error: 'Missing placeName query parameter' }, { status: 400 })
   }

   try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${apiKey}`, {
         headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
         const {
            name,
            geometry: {
               location: { lat, lng },
            },
            place_id: placeId,
         } = data.results[0]

         return NextResponse.json({ name, coords: { lat, lng }, placeId }, { status: 200 }, { headers: { 'Cache-Control': 'public, max-age=86400' } })
      } else {
         return NextResponse.json({ error: 'No place found with this name' }, { status: 404 })
      }
   } catch (error) {
      console.error('Error fetching place:', error)
      return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 })
   }
}
