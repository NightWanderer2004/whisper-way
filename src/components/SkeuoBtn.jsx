import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useState } from 'react'
import { e_ukraine, lexend } from '@/app/fonts'

export default function SkeuoBtn({ children, main = false, onClick }) {
   const [isChecked, setIsChecked] = useState(false)

   const handleCheck = e => {
      if (!main) setIsChecked(!isChecked)
      onClick(e)
   }

   return (
      <Button
         onClick={handleCheck}
         size={main ? 'skeuo' : 'skeuo-white'}
         variant={main ? 'skeuo' : 'skeuo-white'}
         className={cn(
            main ? 'absolute z-50 bottom-safe w-[95%]' : 'w-auto text-[18px] text-textAccent/80',
            isChecked && 'bg-selectedBg skeuo-white-active text-[17.85px] text-opacity-90 text-textAccent',
            main ? e_ukraine.className : lexend.className,
         )}
      >
         {children}
      </Button>
   )
}
