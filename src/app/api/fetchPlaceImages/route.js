import { NextResponse } from 'next/server'

export async function GET(req) {
   const placeId = req.nextUrl.searchParams.get('placeId')
   const apiKey = process.env.GOOGLE_MAPS_API_KEY

   if (!placeId) {
      return NextResponse.json({ error: 'Missing placeId query parameter' }, { status: 400 })
   }

   try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`, {
         headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.status === 'OK') {
         const photos = data.result.photos.slice(0, 6)

         const imageUrls = photos.map(
            photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${photo.photo_reference}&key=${apiKey}`,
         )

         return NextResponse.json({ images: imageUrls }, { status: 200 }, { headers: { 'Cache-Control': 'public, max-age=86400' } })
      } else {
         return NextResponse.json({ error: 'No photos found for this location' }, { status: 404 })
      }
   } catch (error) {
      console.error('Error fetching place images:', error)
      return NextResponse.json({ error: 'Failed to fetch place images' }, { status: 500 })
   }
}
