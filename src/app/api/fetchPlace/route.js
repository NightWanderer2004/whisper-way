import { NextResponse } from 'next/server'

export async function GET(req) {
   const city = req.nextUrl.searchParams.get('city')
   const placeName = req.nextUrl.searchParams.get('placeName')
   const bbox = req.nextUrl.searchParams.get('bbox')

   const [swLon, swLat, neLon, neLat] = bbox.split(',').map(Number)
   const bboxString = `${swLat},${swLon}|${neLat},${neLon}`

   const apiKey = process.env.GOOGLE_MAPS_API_KEY

   if (!placeName) {
      return NextResponse.json({ error: 'Missing placeName query parameter' }, { status: 400 })
   }

   try {
      const response = await fetch(
         `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName)}+in+${encodeURIComponent(city)}&locationbias=rectangle:${bboxString}&key=${apiKey}`,
         {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
         },
      )

      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
         const exactMatch = data.results.find(result => result.name.toLowerCase() === placeName.toLowerCase())

         const bestMatch = exactMatch || data.results[0]

         return NextResponse.json(bestMatch)
      } else {
         return NextResponse.json({ error: 'No results found' }, { status: 404 })
      }
   } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
   }
}
