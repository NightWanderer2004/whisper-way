import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPENAI

const openai = new OpenAI({
   apiKey,
})

function toSingleLineString(value) {
   if (typeof value === 'string') return value.trim()
   if (value == null) return ''
   if (typeof value === 'number' || typeof value === 'boolean') return String(value)
   return ''
}

function splitListString(value) {
   const s = toSingleLineString(value)
   if (!s) return []
   return s
      .split(/[,;\n]/g)
      .map(x => x.trim())
      .filter(Boolean)
}

function pickEmoji(text) {
   if (typeof text !== 'string') return ''
   const match = text.match(/[\p{Extended_Pictographic}]/u)
   return match?.[0] ?? ''
}

function normalizeLocations(locations) {
   if (!Array.isArray(locations)) return []

   return locations
      .map(item => {
         if (typeof item === 'string') {
            const name = item.trim()
            if (!name) return null
            return { name, description: '', icon: '📍' }
         }

         if (!item || typeof item !== 'object' || Array.isArray(item)) return null

         const nameRaw = item.name ?? item.title ?? item.spot ?? item.place
         const name = typeof nameRaw === 'string' ? nameRaw.trim() : ''
         if (!name) return null

         const descriptionRaw = item.description ?? item.summary
         const description = typeof descriptionRaw === 'string' ? descriptionRaw.trim() : ''

         const icon = typeof item.icon === 'string' && item.icon.trim() ? item.icon.trim() : '📍'

         return { name, description, icon }
      })
      .filter(Boolean)
}

function normalizeEmergencyNumbers(value) {
   if (value && typeof value === 'object' && !Array.isArray(value)) {
      const out = {}
      for (const [key, info] of Object.entries(value)) {
         if (info && typeof info === 'object' && !Array.isArray(info)) {
            const number = toSingleLineString(info.number ?? info.value ?? info.phone ?? info.tel)
            if (number) out[key] = { number }
         } else {
            const number = toSingleLineString(info)
            if (number) out[key] = { number }
         }
      }
      return Object.keys(out).length ? out : null
   }

   if (Array.isArray(value)) {
      const joined = value.map(v => toSingleLineString(v)).filter(Boolean).join(', ')
      return joined ? { emergency: { number: joined } } : null
   }

   const s = toSingleLineString(value)
   return s ? { emergency: { number: s } } : null
}

function normalizePowerSocket(value) {
   if (value && typeof value === 'object' && !Array.isArray(value)) {
      const type = toSingleLineString(value.type)
      const voltage = toSingleLineString(value.voltage)
      const icon = toSingleLineString(value.icon) || '🔌'
      if (type || voltage) return { type, voltage, icon }
   }

   const s = toSingleLineString(value)
   if (!s) return null

   const typeMatch = s.match(/type\s*([a-z0-9&\s]+)/i)
   const voltageMatch = s.match(/(\d{2,3}\s*v)/i)

   return {
      type: (typeMatch?.[1] || s).trim(),
      voltage: (voltageMatch?.[1] || '').toUpperCase(),
      icon: '🔌',
   }
}

function normalizeKeyedPriceMap(value, defaultIcon) {
   if (value && typeof value === 'object' && !Array.isArray(value)) {
      const out = {}
      for (const [key, info] of Object.entries(value)) {
         if (info && typeof info === 'object' && !Array.isArray(info)) {
            const price = toSingleLineString(info.price ?? info.value ?? info.cost)
            if (!price) continue
            const icon = toSingleLineString(info.icon) || defaultIcon
            out[key] = { price, icon }
         } else {
            const price = toSingleLineString(info)
            if (!price) continue
            out[key] = { price, icon: defaultIcon }
         }
      }
      return Object.keys(out).length ? out : null
   }

   const s = Array.isArray(value) ? value.map(v => toSingleLineString(v)).filter(Boolean).join(', ') : toSingleLineString(value)
   return s ? { general: { price: s, icon: defaultIcon } } : null
}

function normalizeCurrency(value) {
   if (value && typeof value === 'object' && !Array.isArray(value)) {
      const name = toSingleLineString(value.name ?? value.currency)
      const icon = toSingleLineString(value.icon) || '💱'
      return name ? { name, icon } : null
   }
   const s = toSingleLineString(value)
   return s ? { name: s, icon: '💱' } : null
}

function normalizeSimpleInfo(value, key, defaultIcon) {
   if (value && typeof value === 'object' && !Array.isArray(value)) {
      const raw = toSingleLineString(value[key])
      const icon = toSingleLineString(value.icon) || defaultIcon
      return raw ? { [key]: raw, icon } : null
   }
   const s = toSingleLineString(value)
   return s ? { [key]: s, icon: defaultIcon } : null
}

function normalizeUsefulApps(value) {
   if (value && typeof value === 'object' && !Array.isArray(value)) {
      const out = {}
      for (const [app, info] of Object.entries(value)) {
         if (info && typeof info === 'object' && !Array.isArray(info)) {
            const description = toSingleLineString(info.description ?? info.info ?? info.text)
            const icon = toSingleLineString(info.icon) || pickEmoji(`${app} ${description}`) || '📱'
            out[app] = { description, icon }
         } else {
            const description = toSingleLineString(info)
            const icon = pickEmoji(`${app} ${description}`) || '📱'
            out[app] = { description, icon }
         }
      }
      return Object.keys(out).length ? out : null
   }

   if (Array.isArray(value)) {
      const out = {}
      for (const item of value) {
         const s = toSingleLineString(item)
         if (!s) continue
         const icon = pickEmoji(s) || '📱'
         const name = s.replace(/[\p{Extended_Pictographic}]/gu, '').trim() || 'App'
         out[name] = { description: s, icon }
      }
      return Object.keys(out).length ? out : null
   }

   const s = toSingleLineString(value)
   return s ? { App: { description: s, icon: pickEmoji(s) || '📱' } } : null
}

function normalizeUsefulPhrases(value) {
   if (value && typeof value === 'object' && !Array.isArray(value)) {
      const out = {}
      for (const [key, info] of Object.entries(value)) {
         if (info && typeof info === 'object' && !Array.isArray(info)) {
            const phrase = toSingleLineString(info.phrase ?? key)
            const translation = toSingleLineString(info.translation ?? info.value ?? info.text)
            const icon = toSingleLineString(info.icon) || '💬'
            if (phrase || translation) out[key] = { phrase, translation, icon }
         } else {
            const translation = toSingleLineString(info)
            if (translation) out[key] = { phrase: key, translation, icon: '💬' }
         }
      }
      return Object.keys(out).length ? out : null
   }

   const parts = Array.isArray(value) ? value.map(v => toSingleLineString(v)).filter(Boolean) : splitListString(value)
   if (!parts.length) return null

   const out = {}
   for (const part of parts) {
      const [left, right] = part.split(':').map(x => x.trim())
      if (!left) continue
      const key = left.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || left
      out[key] = { phrase: left, translation: right || '', icon: '💬' }
   }
   return Object.keys(out).length ? out : null
}

function normalizeCityCleanliness(value) {
   if (value && typeof value === 'object' && !Array.isArray(value)) {
      const rating = toSingleLineString(value.rating)
      const description = toSingleLineString(value.description)
      const icon = toSingleLineString(value.icon) || '🌍🧼'
      return rating || description ? { rating: rating || description || 'Cleanliness', description: description || '', icon } : null
   }
   const s = toSingleLineString(value)
   return s ? { rating: s, description: '', icon: '🌍🧼' } : null
}

function normalizeGroceryStores(value) {
   if (Array.isArray(value)) {
      return value
         .map(v => {
            if (v && typeof v === 'object' && !Array.isArray(v)) {
               const name = toSingleLineString(v.name ?? v.title)
               if (!name) return null
               const icon = toSingleLineString(v.icon) || '🛒'
               return { name, icon }
            }
            const name = toSingleLineString(v)
            return name ? { name, icon: '🛒' } : null
         })
         .filter(Boolean)
   }

   if (value && typeof value === 'object') {
      const values = Object.values(value).map(v => toSingleLineString(v)).filter(Boolean)
      if (values.length) return values.map(name => ({ name, icon: '🛒' }))
   }

   const items = splitListString(value)
   return items.length ? items.map(name => ({ name, icon: '🛒' })) : []
}

function normalizeTripData(raw) {
   if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

   if (raw.error) {
      return { error: raw.error }
   }

   const candidates = [raw.locations, raw.spots, raw.places, raw.recommendations, raw.items]
   const locations = normalizeLocations(candidates.find(Array.isArray))

   const infoCandidate =
      raw.country_info ??
      raw.countryInfo ??
      raw.country_information ??
      raw.country ??
      raw.city_info ??
      raw.city_information ??
      raw.city ??
      raw

   const country_info = infoCandidate && typeof infoCandidate === 'object' && !Array.isArray(infoCandidate) ? { ...infoCandidate } : {}
   delete country_info.locations
   delete country_info.spots
   delete country_info.places
   delete country_info.recommendations
   delete country_info.items

   const merged = { ...raw, ...country_info }

   const normalizedCountryInfo = {
      emergency_numbers: normalizeEmergencyNumbers(merged.emergency_numbers),
      power_socket: normalizePowerSocket(merged.power_socket),
      transport_prices: normalizeKeyedPriceMap(merged.transport_prices, '🚌'),
      currency: normalizeCurrency(merged.currency),
      timezone: normalizeSimpleInfo(merged.timezone, 'name', '🕒'),
      best_season: normalizeSimpleInfo(merged.best_season, 'season', '🌤️'),
      payment_method: normalizeSimpleInfo(merged.payment_method, 'info', '💳'),
      useful_apps: normalizeUsefulApps(merged.useful_apps),
      useful_phrases: normalizeUsefulPhrases(merged.useful_phrases),
      city_cleanliness: normalizeCityCleanliness(merged.city_cleanliness),
      grocery_stores: normalizeGroceryStores(merged.grocery_stores),
      average_prices: normalizeKeyedPriceMap(merged.average_prices, '💰'),
   }

   Object.keys(normalizedCountryInfo).forEach(key => {
      if (normalizedCountryInfo[key] == null) delete normalizedCountryInfo[key]
   })

   return { locations, country_info: normalizedCountryInfo }
}

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
- Response MUST be a single JSON object with exactly:
  - "locations": array of objects { "name": string, "description": string, "icon": string }
  - "country_info": object with country/city info (emergency_numbers, power_socket, transport_prices, currency, timezone, best_season, payment_method, useful_apps, useful_phrases, city_cleanliness, grocery_stores, average_prices).`

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

      const raw = JSON.parse(content)
      const tripData = normalizeTripData(raw)

      if (!tripData) {
         return NextResponse.json({ error: { message: 'Invalid model JSON' } }, { status: 502 })
      }

      if (tripData.error) {
         return NextResponse.json(tripData, { status: 200, headers: { 'Cache-Control': 'no-store' } })
      }

      if (!Array.isArray(tripData.locations) || tripData.locations.length === 0) {
         return NextResponse.json({ error: { message: 'Model response missing locations' } }, { status: 502 })
      }

      return NextResponse.json(tripData, { status: 200, headers: { 'Cache-Control': 'no-store' } })
   } catch (error) {
      console.error('Error generating trip:', error)
      return NextResponse.json({ error: { message: 'Failed to generate trip' } }, { status: 500 })
   }
}
