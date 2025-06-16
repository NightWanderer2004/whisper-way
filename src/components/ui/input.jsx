import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
   return (
      <input
         type={type}
         className={cn(
            'bg-whiteBg rounded-[24px] shadow-smooth flex gap-x-2 h-[55px] w-full px-[24px] py-[18px] text-textAccent text-[20px] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500/60 focus-visible:placeholder-white/0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:cursor-not-allowed disabled:opacity-50',
            className,
         )}
         ref={ref}
         {...props}
      />
   )
})
Input.displayName = 'Input'

export { Input }
