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
