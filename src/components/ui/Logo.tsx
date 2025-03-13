'use client'

import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'

const SparkleEffect = ({ color = "#ffffff33" }) => {
  const sparkles = Array(3).fill(null).map((_, i) => ({
    size: Math.random() * 4 + 2,
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

export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative">
        <motion.div
          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg"
          whileHover={{ rotate: 5 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 20px 2px rgba(59, 130, 246, 0.3)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <SparkleEffect />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg"
          whileHover={{ scale: 1.1 }}
        >
          G
        </motion.div>
      </div>
      <motion.span 
        className="text-2xl font-bold text-white"
        animate={{
          textShadow: [
            "0 0 0 rgba(255,255,255,0)",
            "0 0 10px rgba(255,255,255,0.5)",
            "0 0 0 rgba(255,255,255,0)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Gift<span className="text-blue-400">Split</span>
      </motion.span>
    </motion.div>
  )
} 