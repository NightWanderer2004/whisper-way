/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
   dest: 'public',
   register: true,
   scope: '/trip',
   sw: 'service-worker.js',
   skipWaiting: true,
   disable: process.env.NODE_ENV === 'development',
   include: [/^\/trip\/?$/],
   exclude: [/^(?!\/?trip\/?$).*/],
})

export default withPWA({
   env: {
      MAP_KEY: process.env.MAP_KEY,
      OPENAI: process.env.OPENAI,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
   },
   images: {
      domains: ['maps.googleapis.com'],
   },
   rewrites: async () => {
      return [
         {
            source: '/',
            destination: '/index.html',
         },
      ]
   },
})
