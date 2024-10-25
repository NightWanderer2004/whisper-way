'use client'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function TextShimmer({ children, as: Component = 'p', className, duration = 2, spread = 2 }) {
   const MotionComponent = motion(Component)

   const dynamicSpread = useMemo(() => {
      return children.length * spread
   }, [children, spread])

   return (
      <MotionComponent
         className={cn(
            'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
            'text-transparent [--base-color:theme(colors.textAccent)] [--base-gradient-color:rgba(236,252,203,0.7)]',
            '[--bg:linear-gradient(-80deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
            className,
         )}
         initial={{ backgroundPosition: '100% center' }}
         animate={{ backgroundPosition: '0% center' }}
         transition={{
            repeat: Infinity,
            duration,
            ease: 'backInOut',
         }}
         style={{
            '--spread': `${dynamicSpread}px`,
            backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
         }}
      >
         {children}
      </MotionComponent>
   )
}
