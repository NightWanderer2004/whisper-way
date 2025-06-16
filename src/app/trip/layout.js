import { cn } from '@/lib/utils'
import { e_ukraine } from '../fonts'
import '../globals.css'
import { Toaster } from '@/components/ui/sonner'

const APP_NAME = 'WhisperWay'
const APP_DEFAULT_TITLE = 'WhisperWay'
const APP_DESCRIPTION =
   'Get personalized guidance, explore trending spots, and plan your trips with ease. With just a few clicks, you can tailor your trip to match your style.'

export const metadata = {
   applicationName: APP_NAME,
   title: {
      default: APP_DEFAULT_TITLE,
   },
   description: APP_DESCRIPTION,
   manifest: '/manifest.json',
   appleWebApp: {
      capable: true,
      display: 'fullscreen',
      statusBarStyle: 'black-translucent',
      title: APP_DEFAULT_TITLE,
   },
}
export const viewport = {
   width: 'device-width',
   initialScale: 1,
   maximumScale: 1,
   viewportFit: 'cover',
   userScalable: false,
}

export default function RootLayout({ children }) {
   return (
      <html lang='en'>
         <head>
            <meta charSet='UTF-8' />
            <link rel='icon' href='/favicon.ico' />
            <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
            <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
            <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
            <link rel='icon' type='image/png' sizes='192x192' href='/android-chrome-192x192.png' />
            <meta name='mobile-web-app-capable' content='yes' />
            <meta name='robots' content='noindex,nofollow' />
         </head>
         <body className={cn(e_ukraine.className)}>{children}</body>
         <Toaster richColors />
      </html>
   )
}
