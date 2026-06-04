[Landing page](https://whisper-way.netlify.app/) | [App itself](https://whisper-way.netlify.app/trip)


### WhisperWay

WhisperWay is a small Next.js PWA. It turns a rough trip idea into a map and a shortlist of places. You type a city, budget, people count, currency, and a few simple preferences. The app calls OpenAI to draft a trip, snaps each suggested place to a real location, and shows everything on a styled Mapbox GL map with a responsive details panel. Alongside the spots, it shows a compact country brief with emergency numbers, transport prices, sockets, currency, timezone, payment tips, useful apps, and phrases. You get both a route and basic context for the trip.

### Under the hood

All AI work runs on the backend in Next.js API routes. OpenAI keys never touch the browser. A small GPT call first checks that the city looks real. Only then does the main GPT call run and return one JSON object with `spots` and `countryInfo`. For mapping, Mapbox Geocoding turns the city name into coordinates and a bounding box. That box scopes all place search so results stay inside the city. For each GPT spot, the backend calls Google Places Text Search with the spot name, city, and `bbox` to get accurate coordinates and a `place_id`. When you open a spot, the app uses that `place_id` with Place Details and Photo to fetch images for the details view.

On the client, the trip lives in a small Zustand store. It is also mirrored into `localStorage` under a single key. If you close the tab or open the installed app later, WhisperWay hydrates from `localStorage` and restores the same map, list, and inputs. There is no login or server-side user storage. Inputs use React Hook Form and Zod for validation, so rules stay declarative and errors stay consistent.

### Interface and implementation

The UI uses React, Radix UI, Tailwind CSS, and Framer Motion. The info panel is a side column on desktop and a bottom sheet on mobile. The Mapbox map stays visible behind it. Map controls are minimal. Most of the feel comes from motion: soft spot cards that appear, the sheet sliding over the map, and fast focus jumps between markers and list items. The app is a scoped PWA: a service worker and manifest apply only to `/trip`. The installed WhisperWay works like a tiny dedicated maps tool, while marketing pages stay regular Next.js routes.

I built WhisperWay as a solo design-engineering project. I wanted to see how OpenAI, Mapbox, and Google Places can work together in a small, opinionated tool: one focused trip surface that lives on your device and is always ready to reopen.

---

<img width="2000" height="2006" alt="image" src="https://github.com/user-attachments/assets/cf6c494c-660e-4754-9ed7-894191b0c262" />

<img width="2000" height="2006" alt="image" src="https://github.com/user-attachments/assets/0778fa72-7f03-4eda-a610-35ba79b854c7" />

<img width="1620" height="1200" alt="image" src="https://github.com/user-attachments/assets/88818a66-3080-4b74-a867-185587fb89af" />

<img width="1620" height="1200" alt="image" src="https://github.com/user-attachments/assets/f92cfdf4-a22f-433e-bd0d-871afd53b1e7" />
