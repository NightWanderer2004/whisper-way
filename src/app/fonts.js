import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'

export const dm_sans = DM_Sans({
   subsets: ['latin'],
   style: ['normal', 'italic'],
   weight: '400',
})

export const e_ukraine = localFont({
   src: [
      {
         path: '../../public/font/e-Ukraine-Regular.otf',
         weight: '400',
      },
      {
         path: '../../public/font/e-Ukraine-Medium.otf',
         weight: '500',
      },
   ],
})
