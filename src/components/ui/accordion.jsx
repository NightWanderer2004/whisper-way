'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
   <AccordionPrimitive.Item
      ref={ref}
      className={cn(
         'border border-white/30 bg-whiteBg shadow-smooth rounded-3xl px-3 mb-2.5 active:scale-[99.5%] transition-all duration-500 ease-gentle',
         className,
      )}
      {...props}
   />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
   <AccordionPrimitive.Header className='flex'>
      <AccordionPrimitive.Trigger
         ref={ref}
         className={cn(
            'flex flex-1 items-center justify-between py-4 px-1 text-xl sm:text-2xl md:text-xl font-normal text-textAccent transition-all text-left [&[data-state=open]>svg]:rotate-180',
            className,
         )}
         {...props}
      >
         {children}
         <ChevronDownIcon className='h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200' />
      </AccordionPrimitive.Trigger>
   </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
   <AccordionPrimitive.Content
      ref={ref}
      className='overflow-y-hidden p-0 px-0.5 pt-0.5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
      {...props}
   >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
   </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
