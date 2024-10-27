import React from 'react'
import SkeuoBtn from './SkeuoBtn'

export default function BottomButton({ children, isForm, onClick, className, ...props }) {
   return (
      <div className='fixed z-50 bottom-0 left-0 right-0 p-4 pb-safe-offset-1 lg:pb-safe-offset-2 bg-gradient-to-t from-stone-100/40 to-transparent from-40%'>
         <div className={`mx-auto max-w-[395px] ${isForm ? 'max-w-[395px]' : 'sm:max-w-[550px] lg:max-w-full'}`}>
            <SkeuoBtn main onClick={onClick} className={className} {...props}>
               {children}
            </SkeuoBtn>
         </div>
      </div>
   )
}
