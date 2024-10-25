import React from 'react'
import SkeuoBtn from './SkeuoBtn'

export default function BottomButton({ children, onClick, className, ...props }) {
   return (
      <div className='fixed z-50 bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-stone-100/80 to-transparent from-40%'>
         <div className=' mx-auto max-w-[395px]'>
            <SkeuoBtn main onClick={onClick} className={`shadow-lg ${className}`} {...props}>
               {children}
            </SkeuoBtn>
         </div>
      </div>
   )
}
