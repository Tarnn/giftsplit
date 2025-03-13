'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SparkleEffect from '@/components/ui/SparkleEffect'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Mouse follower */}
          <motion.div
            className="fixed w-64 h-64 pointer-events-none z-0"
            animate={{
              x: mousePosition.x - 128,
              y: mousePosition.y - 128,
              scale: isHovering ? 1.2 : 1
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
          </motion.div>

          {/* Sparkle effect */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <SparkleEffect />
          </div>

          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
