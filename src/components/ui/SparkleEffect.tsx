'use client'

import { motion } from 'framer-motion'

interface SparkleEffectProps {
  color?: string
  size?: number
  count?: number
}

export default function SparkleEffect({ 
  color = "#FFF", 
  size = 4, 
  count = 3 
}: SparkleEffectProps) {
  const sparkles = Array(count).fill(null).map((_, i) => ({
    size: Math.random() * size + 2,
    duration: Math.random() * 1 + 0.5,
    delay: i * 0.2,
  }))

  return (
    <motion.div className="absolute inset-0">
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: color,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  )
} 