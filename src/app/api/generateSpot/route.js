import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
   apiKey: process.env.OPENAI,
})

export async function POST(req) {
   try {
      const { city, preferences, existingSpots } = await req.json()

      const prompt = `Generate a new interesting spot in ${city} that matches these preferences: ${preferences.join(
         ', ',
      )}. The spot should be different from these existing spots: ${existingSpots.map(spot => spot.name).join(', ')}. 
      
      Return response in this JSON format:
      {
         "name": "spot name",
         "description": "brief description",
         "icon": "relevant emoji"
      }`

      const completion = await openai.chat.completions.create({
         messages: [{ role: 'user', content: prompt }],
         model: 'gpt-4o',
         temperature: 0.7,
      })

      const newSpot = JSON.parse(completion.choices[0].message.content)
      return NextResponse.json(newSpot)
   } catch (error) {
      console.error('Error generating spot:', error)
      return NextResponse.json({ error: 'Failed to generate spot' }, { status: 500 })
   }
}
