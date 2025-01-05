import { SupabaseProvider } from '@/components/SupabaseProvider'

export default function RootLayout({ children }) {
   return (
      <html lang='en'>
         <body>
            <SupabaseProvider>{children}</SupabaseProvider>
         </body>
      </html>
   )
}
