export default function Home() {
   return (
      <main className='p-4 bg-sky-50 min-h-screen'>
         <div className='shadow-lg bg-white w-full h-[500px] rounded-xl relative'>
            <div className='absolute bottom-1/4 border-b-[6px] border-sky-50 h-5 w-full border-dotted'>
               <div className='absolute shadow-inner-left -top-1 -left-5 w-10 h-10 bg-sky-50 rounded-full'></div>
               <div className='absolute shadow-inner-right -top-1 -right-5 w-10 h-10 bg-sky-50 rounded-full'></div>
            </div>
         </div>
      </main>
   )
}
