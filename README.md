[Landing page](https://whisper-way.co/) | [App itself](https://whisper-way.co/trip)


## Realization

### AI (OpenAI)

I use GPT for three things: generate the trip, validate the city, and extend the list.

The main GPT call takes city, budget, people count, and preferences, and returns one JSON object: spots (name, description, icon) plus “country info” — emergency numbers, sockets, transport prices, currency, timezone, best season, payment tips, useful apps, phrases, etc. Asking for JSON makes it easy to parse and render.

Before that, a tiny GPT call checks if the city field is a real city (“true” / “false”), so I don’t send garbage into map/place APIs and can show a clean error.

All of this happens on the backend, so API keys never touch the browser.

### Maps and places

The visible map is Mapbox GL with a custom style from Mapbox Studio so it feels like the app, not a default embed. Mapbox Geocoding turns the user’s city into coordinates and a bounding box, so I only search inside that area.

Google is only for places and photos. For each GPT spot, I call Google Places (Text Search) with name, city, and bbox to get coordinates and a `place_id`. When the user taps a spot, I use that `place_id` with Place Details + Photo to show images in the detail view.

So: Mapbox for the map and city bounds, Google for “where exactly is this?” and “what does it look like?”.

### Data and state

Trip data (spots, country info, inputs) lives in Zustand and **also in localStorage** under one key. If you close the tab or open the installed app later, I restore the last trip from localStorage and show the same map and list. No login or server storage.

Inputs (city, budget, people, currency) are validated with Zod + React Hook Form, so I get clear rules and consistent errors without manual checks.

### Flow

1. User fills the form → Zod validates → small GPT call checks the city.
2. Full GPT call returns trip JSON (locations + country info).
3. Mapbox Geocoding runs once for the city (coords + bbox).
4. For each location, the backend calls Google Places (Text Search) and returns coords + `place_id`.
5. I merge that into the trip data, save to state + localStorage, and render the map.
6. On tap, I use `place_id` to fetch photos and show them.

### PWA

The app is a PWA, installable on phone or desktop, but **only for the trip part** (e.g. `/trip`). The service worker caches just that scope; marketing pages are left out. A Next.js PWA plugin plus a manifest (name, icons, theme) give it a proper installed‑app feel.

### Other pieces

All third‑party calls go through Next.js API routes, so keys stay on the server. UI is built with Radix, Tailwind, and Framer Motion for smooth transitions. The info panel adapts between desktop side panel and mobile sheet, and map controls are toned down so the map and spots stay the focus.

In short: GPT writes the trip, Mapbox sets the stage, Google anchors spots and photos, state + localStorage keep everything alive across refresh, and the scoped PWA turns it into a small, focused installable app.

---

<img width="2000" height="2006" alt="image" src="https://github.com/user-attachments/assets/cf6c494c-660e-4754-9ed7-894191b0c262" />

<img width="2000" height="2006" alt="image" src="https://github.com/user-attachments/assets/0778fa72-7f03-4eda-a610-35ba79b854c7" />

<img width="1620" height="1200" alt="image" src="https://github.com/user-attachments/assets/88818a66-3080-4b74-a867-185587fb89af" />

<img width="1620" height="1200" alt="image" src="https://github.com/user-attachments/assets/f92cfdf4-a22f-433e-bd0d-871afd53b1e7" />
