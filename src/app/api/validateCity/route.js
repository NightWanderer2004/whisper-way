import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPENAI

const openai = new OpenAI({
   apiKey,
})

export async function POST(req) {
   try {
      if (!apiKey) {
         return NextResponse.json({ error: { message: 'Missing OpenAI API key on server' } }, { status: 500 })
      }

      const body = await req.json().catch(() => ({}))
      const city = typeof body.city === 'string' ? body.city.trim() : ''

      if (city.length < 2 || city.length > 60) {
         return NextResponse.json({ valid: false }, { status: 200, headers: { 'Cache-Control': 'no-store' } })
      }

      const completion = await openai.chat.completions.create({
         model: 'gpt-4o-mini',
         response_format: { type: 'json_object' },
         messages: [
            {
               role: 'system',
               content: 'Return only JSON: {"valid": true|false}. "valid" is true only if the input is a real city name.',
            },
            { role: 'user', content: city },
         ],
         temperature: 0,
         max_tokens: 50,
      })

      const content = completion.choices?.[0]?.message?.content
      const parsed = typeof content === 'string' ? JSON.parse(content) : null
      const valid = Boolean(parsed?.valid)

      return NextResponse.json({ valid }, { status: 200, headers: { 'Cache-Control': 'no-store' } })
   } catch (error) {
      console.error('Error validating city:', error)
      return NextResponse.json({ error: { message: 'Failed to validate city' } }, { status: 500 })
   }
}

