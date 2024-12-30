import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { e_ukraine } from '../fonts'
import '../globals.css'

export const metadata = {
   title: 'Travel Mate | Start',
   description:
      'Get personalized guidance, explore trending spots, and plan your trips with ease. With just a few clicks, you can tailor your trip to match your style.',
}

export default function IntroLayout({ children }) {
   return (
      <html lang='en'>
         <head>
            <meta charSet='UTF-8' />
            <link rel='icon' href='/favicon.ico' />
            <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
            <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
            <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
            <link rel='icon' type='image/png' sizes='192x192' href='/android-chrome-192x192.png' />
         </head>
         <body className={cn(e_ukraine.className)}>{children}</body>
         <Toaster richColors />
      </html>
   )
}
