import { clientsClaim } from 'workbox-core'
import { NetworkFirst, NetworkOnly } from 'workbox-strategies'
import { registerRoute } from 'workbox-routing'

clientsClaim()
self.skipWaiting()

// Cache the trip page
registerRoute(
   ({ url }) => url.pathname === '/trip',
   new NetworkFirst({
      cacheName: 'trip-page',
   }),
)

// Handle other routes with network-only strategy
registerRoute(
   ({ url }) => url.pathname !== '/trip',
   new NetworkOnly({
      cacheName: 'other-pages',
   }),
)
