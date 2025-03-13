'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const Spinner = ({ className, size = 'md', color = 'blue', ...props }: SpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div
      className={cn('relative', sizes[size], className)}
      {...props}
    >
      <motion.div
        className={cn('absolute inset-0 rounded-full border-2 border-current')}
        style={{
          borderColor: `var(--${color}-500)`,
          borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

export default Spinner 