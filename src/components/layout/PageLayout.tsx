'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/ui/Logo'
import SparkleEffect from '@/components/ui/SparkleEffect'
import { theme, components } from '@/styles/theme'

interface PageLayoutProps {
  children: React.ReactNode
  showNav?: boolean
}

export default function PageLayout({ children, showNav = true }: PageLayoutProps) {
  const { user, signIn } = useAuth()
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
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Navigation */}
      {showNav && (
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-20 ${theme.effects.glass} ${theme.colors.background.overlay}`}
        >
          <Link href="/">
            <Logo />
          </Link>
          
          {!user && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={signIn}
                className={components.button.outline}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                </motion.div>
                Sign In
                <motion.div
                  className={`absolute inset-0 ${theme.effects.gradient.shimmer}`}
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </Button>
            </motion.div>
          )}
        </motion.nav>
      )}

      {/* Main content */}
      <main className={`${components.container} pt-20`}>
        {children}
      </main>

      {/* Background effects */}
      <div className={`absolute inset-0 -z-10 ${components.background}`} />
      <motion.div 
        className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]"
        animate={{
          opacity: [0.2, 0.3, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute inset-0 -z-5 bg-gradient-to-t from-blue-500/10 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <SparkleEffect />
      </motion.div>
    </div>
  )
} 