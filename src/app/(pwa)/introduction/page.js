import Image from 'next/image'
import authImg from '/public/auth-img.webp'
import AuthForm from '@/components/AuthForm'
import AnimatedWrapper from '@/components/AnimatedWrapper'

export const metadata = {
   title: 'Introduction | Travel Mate',
}

export default function Introduction() {
   return (
      <AnimatedWrapper className='relative overflow-hidden h-dvh text-textColor text-2xl grid grid-cols-1 lg:grid-cols-2 place-items-center p-2'>
         <AuthForm />
         <Image
            className='hidden lg:block rounded-xl w-full h-full object-cover pointer-events-none border-whiteBg border-2 shadow-smooth'
            src={authImg}
            alt=''
            placeholder='blur'
            width={1000}
            height={1000}
         />
      </AnimatedWrapper>
   )
}
