/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
   dest: 'public',
})

export default withPWA({
   env: {
      MAP_KEY: process.env.MAP_KEY,
      OPENAI: process.env.OPENAI,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
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
