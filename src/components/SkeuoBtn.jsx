import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useState, useCallback } from 'react'
import { e_ukraine, lexend } from '@/app/fonts'

export default function SkeuoBtn({ children, main = false, onClick, disabled = false, className, ...props }) {
   const [isChecked, setIsChecked] = useState(false)

   const handleCheck = useCallback(
      e => {
         if (!main) {
            setIsChecked(prev => !prev)
         }
         onClick?.(e)
      },
      [main, onClick],
   )

   const buttonSize = main ? 'skeuo' : 'skeuo-white'
   const fontClass = main ? e_ukraine.className : lexend.className

   return (
      <Button
         {...props}
         onClick={handleCheck}
         size={buttonSize}
         variant={buttonSize}
         disabled={disabled}
         type={main ? 'submit' : 'button'} // Set type to 'button' for non-main buttons
         className={cn(
            main ? 'absolute z-50 bottom-safe w-[95%]' : 'w-auto text-[18px] text-textAccent/80',
            isChecked && 'bg-selectedBg skeuo-white-active text-[17.85px] text-opacity-90 text-textAccent',
            fontClass,
            disabled && 'opacity-50 cursor-not-allowed',
            className,
         )}
      >
         {children}
      </Button>
   )
}
