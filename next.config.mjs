/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
   dest: 'public',
})

export default withPWA({
   env: {
      MAP_KEY: process.env.MAP_KEY,
   },
})
