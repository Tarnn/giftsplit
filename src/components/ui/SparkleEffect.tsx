'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

interface SparkleEffectProps {
  color?: string
  size?: number
  count?: number
}

function SparkleEffectComponent({ 
  color = "#FFF", 
  size = 4, 
  count = 3 
}: SparkleEffectProps) {
  const [mounted, setMounted] = useState(false)
  const [sparkles, setSparkles] = useState<Array<{
    id: number,
    style: {
      width: number,
      height: number,
      left: string,
      top: string,
      duration: number
    }
  }>>([])

  useEffect(() => {
    setMounted(true)
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      style: {
        width: Math.random() * size + 2,
        height: Math.random() * size + 2,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 1 + 0.5
      }
    }))
    setSparkles(newSparkles)
  }, [count, size])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            width: sparkle.style.width,
            height: sparkle.style.height,
            backgroundColor: color,
            borderRadius: '50%',
            left: sparkle.style.left,
            top: sparkle.style.top,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.style.duration,
            repeat: Infinity,
            repeatDelay: Math.random() * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Export a non-SSR version of the component
export default dynamic(() => Promise.resolve(SparkleEffectComponent), {
  ssr: false
}) 