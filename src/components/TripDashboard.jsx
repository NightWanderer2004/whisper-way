import SkeuoBtn from '@/components/SkeuoBtn'
import { Button } from './ui/button'

export default function TripDashboard({ onNewTrip, handleLogout }) {
   return (
      <div className='flex flex-col items-center gap-8 p-6'>
         <nav className='bg-whiteBg/40 border-b border-whiteBg m-3 rounded-3xl shadow-sm fixed top-0 right-0 left-0 z-50 flex justify-between items-center px-5 py-4 backdrop-blur-md'>
            <h1 className='text-textAccent text-xl font-medium'>Travel Mate</h1>
            <Button onClick={handleLogout} variant='skeuo-mini' size='skeuo-mini' className='z-50 text-orange-500/80 relative'>
               Leave
            </Button>
         </nav>
         <div className='flex flex-col items-center gap-4'>
            <h1 className='text-textAccent text-2xl font-medium text-center'>Start Planning Your Trip</h1>
            <p className='text-textColor text-center text-base max-w-md'>
               Create a new trip and get personalized recommendations for places to visit
            </p>
         </div>

         <SkeuoBtn main onClick={onNewTrip} className='w-full max-w-xs'>
            New Trip
         </SkeuoBtn>
      </div>
   )
}
