'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Gift, Shield, LineChart, User, DollarSign, Sparkles, LayoutDashboard, LogIn } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'
import SparkleEffect from '@/components/ui/SparkleEffect'
import { Layout } from '@/components/layout/Layout'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { useTranslation } from 'react-i18next'
import '@/i18n'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Add new animation variants
const cardVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}

const iconVariants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
}

// Enhanced Coin component for explosion effect
const Coin = ({ x, y, delay, index }: { x: number; y: number; delay: number; index: number }) => {
  const angle = (index / 12) * Math.PI * 2
  const radius = 100 + Math.random() * 50
  const duration = 0.8 + Math.random() * 0.4

  return (
    <motion.div
      style={{ 
        position: 'absolute',
        left: x,
        top: y,
        transformOrigin: 'center',
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.5, 1],
        opacity: [1, 1, 0],
        x: [0, Math.cos(angle) * radius],
        y: [0, Math.sin(angle) * radius - 100],
        rotate: [0, Math.random() * 720 - 360]
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.32, 0.72, 0, 1]
      }}
    >
      <div className="relative">
        <DollarSign className="w-6 h-6 text-yellow-400" />
        <motion.div
          className="absolute inset-0 bg-yellow-400/30 blur-lg"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0] }}
          transition={{ duration: duration * 0.8, delay }}
        />
      </div>
    </motion.div>
  )
}

// Sparkle effect for the button
const ButtonSparkle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute inset-0 rounded-full"
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{
      scale: [0.5, 1.5],
      opacity: [0, 0.3, 0],
    }}
    transition={{
      duration: 1,
      delay,
      repeat: Infinity,
      repeatDelay: 2
    }}
  >
    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
  </motion.div>
)

export default function HomePage() {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [showCoins, setShowCoins] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const handleCreateGift = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    
    const rect = buttonRef.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Create ripple effect
    const ripple = document.createElement('div')
    ripple.style.position = 'fixed'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    document.body.appendChild(ripple)

    setShowCoins(true)
    
    // Navigate after animation
    setTimeout(() => {
      setShowCoins(false)
      router.push('/create')
      ripple.remove()
    }, 1000)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f2c] via-[#121a4a] to-[#1a1248]">
        {/* Background Sparkles */}
        <div className="fixed inset-0 pointer-events-none opacity-40">
          <SparkleEffect color="#ffffff" size={2.5} count={20} />
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Navigation */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-0 right-0 z-50"
          >
            <div className="relative backdrop-blur-xl bg-black/20">
              <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                  {/* Left: Logo */}
                  <Link href="/" className="flex items-center gap-2">
                    <Logo />
                  </Link>

                  {/* Right: Nav Links & Auth */}
                  <div className="flex items-center gap-6">
                    <LanguageSelector />
                    {user ? (
                      <Link href="/dashboard">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border border-white/20 bg-transparent hover:bg-transparent text-white"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          {t('common.dashboard')}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={signIn}
                        className="border border-white/20 bg-transparent hover:bg-transparent text-white"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        {t('common.signIn')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.header>

          <main className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
            <motion.div 
              className="w-full max-w-6xl mx-auto text-center space-y-8 sm:space-y-16 relative pt-16 sm:pt-0"
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {/* Hero Section */}
              <motion.div 
                variants={fadeInUp}
                className="space-y-6 sm:space-y-8"
              >
                <motion.h1 
                  className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight"
                  variants={floatAnimation}
                >
                  <span className="bg-gradient-to-r from-[#4B9EFF] via-[#9D7BFF] to-[#E0A0FF] bg-clip-text text-transparent">
                    Split Gifts
                  </span>
                  {' '}
                  <span className="text-white relative inline-block">
                    with{' '}
                    <span className="relative">
                      Ease
                      <motion.div 
                        className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#4B9EFF] to-[#9D7BFF] rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </span>
                  </span>
                </motion.h1>
                <motion.p 
                  variants={fadeInUp}
                  className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
                >
                  Create a gift link and share it with friends.
                  <br className="hidden sm:block" />
                  Collect money together, securely and hassle-free.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  variants={fadeInUp}
                  className="flex justify-center mt-8 sm:mt-12"
                >
                  <Button
                    size="lg"
                    onClick={() => router.push('/create')}
                    className="relative px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-[#4B9EFF] to-[#9D7BFF] rounded-full hover:opacity-90 transition-opacity"
                  >
                    Create Gift Link
                    <span className="ml-2">✨</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-24 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#070b2b] rounded-2xl p-6 text-center"
                >
                  <h3 className="text-white text-lg font-medium mb-2">Easy to Use</h3>
                  <p className="text-white/60">
                    Create and share your gift link in minutes
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#070b2b] rounded-2xl p-6 text-center"
                >
                  <h3 className="text-white text-lg font-medium mb-2">Secure</h3>
                  <p className="text-white/60">
                    Collect funds directly via Stripe
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#070b2b] rounded-2xl p-6 text-center"
                >
                  <h3 className="text-white text-lg font-medium mb-2">Track Progress</h3>
                  <p className="text-white/60">
                    Monitor contributions in real-time
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </main>
        </div>

        {/* Background dots with animation */}
        <motion.div 
          className="fixed inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </Layout>
  )
}
