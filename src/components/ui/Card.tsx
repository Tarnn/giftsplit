'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  delay?: number
}

export default function Card({ children, className, delay = 0, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl',
        'border border-white/20',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        className
      )}
      {...props}
    >
      <div className="relative p-6">
        {children}
      </div>
    </motion.div>
  )
} 