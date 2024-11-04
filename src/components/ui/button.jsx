import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
   'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50',
   {
      variants: {
         variant: {
            default: 'bg-stone-900 text-stone-50 shadow hover:bg-stone-900/90',
            destructive: 'bg-red-500 text-stone-50 shadow-sm hover:bg-red-500/90',
            outline: 'border border-stone-200 bg-white shadow-sm hover:bg-stone-100 hover:text-stone-900',
            secondary: 'bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-100/80',
            ghost: 'hover:bg-stone-100 hover:text-stone-900',
            link: 'text-stone-900 underline-offset-4 hover:underline',
            skeuo: 'skeuo shadow-[0_2px_9px_-1.5px_rgba(0,0,0,25%)] overflow-hidden relative bg-blackBg text-white font-normal lowercase border-2 border-[#161616] rounded-[16px]',
            'skeuo-white':
               'skeuo-white shadow-[0_1.2px_6px_-1.5px_rgba(0,0,0,15%)] overflow-hidden relative bg-whiteBg text-black font-normal lowercase border-2 border-white/10 rounded-[16px]',
            'skeuo-mini':
               'skeuo-white bg-whiteBg border-white/30 shadow-smooth text-textColor font-normal lowercase border-2 border-white/10 rounded-[16px]',
         },
         size: {
            default: 'h-9 rounded-md px-4 py-2',
            sm: 'h-8 rounded-md px-3 text-xs',
            lg: 'h-10 rounded-md px-8',
            icon: 'h-9 w-9',
            skeuo: 'h-[55px] px-[26px] py-[18px] text-base active:text-[15.85px] active:text-opacity-90 transition-all duration-700 ease-gentle',
            'skeuo-white': 'px-[18px] py-[4px] font-normal font-lexend text-[18px] transition-all duration-700 ease-gentle',
            'skeuo-mini': 'h-8 px-3 text-sm active:text-[13.85px] font-lexend transition-all duration-700 ease-gentle',
         },
      },
      defaultVariants: {
         variant: 'skeuo',
         size: 'skeuo',
      },
   },
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
   const Comp = asChild ? Slot : 'button'
   return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
