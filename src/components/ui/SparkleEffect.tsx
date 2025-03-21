'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SparkleEffectProps {
  color?: string
  size?: number
  count?: number
}

export default function SparkleEffect({ color = '#ffffff33', size = 2.5, count = 20 }: SparkleEffectProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number, x: number, y: number, scale: number }>>([])

  useEffect(() => {
    // Generate sparkles only on client side
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.8 + Math.random() * 0.4
    }))
    setSparkles(newSparkles)
  }, [count])

  if (sparkles.length === 0) {
    return null // Return null on server-side to prevent hydration mismatch
  }

  return (
    <motion.div className="absolute inset-0">
      {sparkles.map(({ id, x, y, scale }) => (
        <motion.div
          key={id}
          style={{
            position: 'absolute',
            width: `${size * scale}px`,
            height: `${size * scale}px`,
            backgroundColor: color,
            borderRadius: '50%',
            left: `${x}%`,
            top: `${y}%`,
          }}
          initial={{ opacity: 0.2 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </motion.div>
  )
} 