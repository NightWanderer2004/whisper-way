'use client'
import { motion } from 'framer-motion'

export default function AnimatedWrapper({ children, className }) {
   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.6, delay: 0.35, ease: 'backOut' }}
         className={className}
      >
         {children}
      </motion.div>
   )
}
