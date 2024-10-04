import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }) {
   return <div className={cn('animate-pulse rounded-md bg-neutral-500/30', className)} {...props} />
}

export { Skeleton }
