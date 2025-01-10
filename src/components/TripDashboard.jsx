import SkeuoBtn from '@/components/SkeuoBtn'
import { Button } from './ui/button'
import { useTripStore } from '@/lib/useTripStore'
import Link from 'next/link'

export default function TripDashboard({ onNewTrip, handleLogout }) {
   const { trips } = useTripStore()

   return (
      <div className='flex flex-col items-center gap-8 p-6 max-w-[395px] w-full'>
         <nav className='bg-whiteBg/40 border-b border-whiteBg m-3 rounded-3xl shadow-sm max-w-[395px] sm:max-w-[550px] w-full fixed top-0 z-50 flex justify-between items-center px-5 py-4 backdrop-blur-md'>
            <h1 className='text-textAccent text-xl font-medium'>
               <Link href='/'>Travel Mate</Link>
            </h1>
            <Button onClick={handleLogout} variant='skeuo-mini' size='skeuo-mini' className='z-50 text-orange-500/80 relative'>
               Leave
            </Button>
         </nav>
         <div className='flex flex-col items-center gap-4'>
            {trips.length > 0 && (
               <>
                  <h2 className='text-textAccent text-2xl font-medium text-center'>Your Trips</h2>
                  <ul className='list-disc pl-5'>
                     {trips.map((trip, index) => (
                        <li key={index} className='text-textColor'>
                           {trip.city} - {trip.people} people - Budget: {trip.budget} {trip.currency}
                        </li>
                     ))}
                  </ul>
               </>
            )}
            {trips.length === 0 && <h2 className='text-textAccent text-xl mb-3 font-medium text-center'>You have no trips yet</h2>}
            <SkeuoBtn main onClick={onNewTrip} className='mb-4'>
               Generate New Trip
            </SkeuoBtn>
         </div>
      </div>
   )
}
