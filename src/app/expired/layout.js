import '../globals.css'

export const metadata = {
   title: 'Early Access Expired',
   description: 'Your early access has expired, thank you for your interest in Travel Mate ✦',
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
         </head>
         <body>{children}</body>
      </html>
   )
}
