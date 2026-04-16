import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPENAI

const openai = new OpenAI({
   apiKey,
})

const SYSTEM_PROMPT = `### Create a Prompt to Generate Travel Recommendations

**Objective**: Generate travel recommendations based on a given city, budget, and preferences.

**Details to Include**:
- Relevant location details
- Trip information

---

### Steps

1. **Input Analysis**:
   - Determine the travel destination, budget, and personal preferences provided by the user.

2. **Research and Selection**:
   - Find destinations and locations within the specified city that align with the user’s preferences.
   - Consider budget constraints when selecting locations.
   - Include notable attractions, activities, or experiences that fit the criteria.

3. **Country Information**:
   - Provide a brief overview of the country where the city is located.
   - Include emergency numbers, power socket type, transport prices, local currency, timezone, best season to visit, payment methods, and useful apps for travelers.

---

### Output Format

The output should be a JSON object that includes:
- A list of recommended locations and activities within the city, each with an emoji "icon."
- A summary of the country’s relevant information.

---

### Notes
- If country and currency are the same, skip "useful_phrases".
- Description of places should be brief (8-12 words).
- Avoid recommending mapping or travel apps.
- Ensure locations recommended are budget-friendly.
- Useful apps should not be nested one to each one; list 3-5 with matching icons.
- Generate at least 8 unique locations within the city.
- Use street addresses for coordinates but names for display in the app.
- If you notice some problems, respond with an "error" key object with a "message" text.
- Response should be an object with "locations" and "country_info".`

export async function POST(req) {
   try {
      if (!apiKey) {
         return NextResponse.json({ error: { message: 'Missing OpenAI API key on server' } }, { status: 500 })
      }

      const body = await req.json().catch(() => ({}))
      const city = typeof body.city === 'string' ? body.city.trim() : ''
      const budget = Number(body.budget)
      const people = Number(body.people)
      const currency = typeof body.currency === 'string' ? body.currency.trim() : ''
      const preferences = Array.isArray(body.preferences) ? body.preferences.filter(p => typeof p === 'string') : []

      if (!city || !Number.isFinite(budget) || budget <= 0 || !Number.isFinite(people) || people <= 0 || !currency || preferences.length === 0) {
         return NextResponse.json({ error: { message: 'Invalid input' } }, { status: 400 })
      }

      const completion = await openai.chat.completions.create({
         model: 'gpt-4o',
         response_format: { type: 'json_object' },
         messages: [
            {
               role: 'system',
               content: SYSTEM_PROMPT,
            },
            {
               role: 'user',
               content: `City: [${city}]
Budget: [${budget} ${currency}]
People: [${people}]
Preferences: [${preferences.join(', ')}]
Time of year: [${new Date().getFullYear()}-${new Date().getMonth() + 1}]`,
            },
         ],
         temperature: 1,
         max_tokens: 2700,
         top_p: 1,
         frequency_penalty: 0,
         presence_penalty: 0,
      })

      const content = completion.choices?.[0]?.message?.content
      if (typeof content !== 'string' || !content.trim()) {
         return NextResponse.json({ error: { message: 'Empty model response' } }, { status: 502 })
      }

      const tripData = JSON.parse(content)
      return NextResponse.json(tripData, { status: 200, headers: { 'Cache-Control': 'no-store' } })
   } catch (error) {
      console.error('Error generating trip:', error)
      return NextResponse.json({ error: { message: 'Failed to generate trip' } }, { status: 500 })
   }
}

