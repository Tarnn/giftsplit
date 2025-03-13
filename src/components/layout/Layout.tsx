'use client'

import { motion } from 'framer-motion'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 gradient-bg opacity-50" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative ${className}`}
      >
        {children}
      </motion.div>

      {/* Background Shapes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Gift Box Shape 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: '10%', y: '10%' }}
          animate={{ opacity: 0.1, scale: 1, x: '0%', y: '0%' }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-blue-500 blur-3xl"
        />
        {/* Gift Box Shape 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: '-10%', y: '10%' }}
          animate={{ opacity: 0.1, scale: 1, x: '0%', y: '0%' }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
          className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-green-500 blur-3xl"
        />
        {/* Gift Box Shape 3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: '10%', y: '-10%' }}
          animate={{ opacity: 0.1, scale: 1, x: '0%', y: '0%' }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
          className="absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-yellow-500 blur-3xl"
        />
      </div>
    </div>
  )
} 