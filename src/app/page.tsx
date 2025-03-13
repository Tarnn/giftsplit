'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Gift, Shield, LineChart, User, DollarSign, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'
import SparkleEffect from '@/components/ui/SparkleEffect'

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

export default function Home() {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [showCoins, setShowCoins] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2c] via-[#121a4a] to-[#1a1248]">
      {/* Background Sparkles */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <SparkleEffect color="#ffffff" size={2.5} count={20} />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="relative backdrop-blur-xl bg-black/20">
          <div className="container flex h-16 items-center justify-between px-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center gap-2 group">
                <Logo />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="relative px-5 py-2 text-sm text-white/90 bg-[#0c1442] rounded-xl overflow-hidden group"
              >
                <span className="relative z-10 font-medium">
                  {user ? 'Dashboard' : 'Sign In'}
                </span>

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/[0.02]" />

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  initial={false}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-[#1a1f4d]" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: -20 }}
                    whileHover={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </motion.div>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div 
          className="w-full max-w-6xl mx-auto text-center space-y-16 relative"
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
            className="space-y-8 -mt-32"
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold tracking-tight mb-12"
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
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Create a gift link and share it with friends.
              <br />
              Collect money together, securely and hassle-free.
            </motion.p>
            <motion.div variants={fadeInUp} className="relative">
              <div className="relative inline-block">
                {/* Sparkle effects */}
                {[0, 0.5, 1].map((delay) => (
                  <ButtonSparkle key={delay} delay={delay} />
                ))}
                
                <Button
                  ref={buttonRef}
                  onClick={handleCreateGift}
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-8 py-4 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Create Gift Link ✨</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </Button>

                {/* Coin explosion effect */}
                <AnimatePresence>
                  {showCoins && (
                    <div className="fixed" style={{ 
                      left: buttonRef.current?.getBoundingClientRect().left ?? 0,
                      top: buttonRef.current?.getBoundingClientRect().top ?? 0,
                      pointerEvents: 'none'
                    }}>
                      {[...Array(24)].map((_, i) => (
                        <Coin
                          key={i}
                          x={buttonRef.current?.offsetWidth ? buttonRef.current.offsetWidth / 2 : 0}
                          y={buttonRef.current?.offsetHeight ? buttonRef.current.offsetHeight / 2 : 0}
                          delay={i * 0.02}
                          index={i}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Gift className="w-7 h-7 text-blue-600" />,
                bg: "bg-blue-100/90",
                title: 'Easy to Use',
                description: 'Create a gift link in seconds and share it with your friends.'
              },
              {
                icon: <Shield className="w-7 h-7 text-green-600" />,
                bg: "bg-green-100/90",
                title: 'Secure Payments',
                description: 'All payments are processed securely through Stripe.'
              },
              {
                icon: <LineChart className="w-7 h-7 text-purple-600" />,
                bg: "bg-purple-100/90",
                title: 'Track Progress',
                description: 'See who has paid and how much is left to collect.'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center space-y-4 relative overflow-hidden group"
                variants={cardVariants}
                whileHover="hover"
                custom={i}
              >
                <motion.div
                  className={`w-14 h-14 ${feature.bg} rounded-full flex items-center justify-center relative z-10`}
                  variants={iconVariants}
                  whileHover="hover"
                >
                  {feature.icon}
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.h3 
                  className="text-xl font-semibold text-white relative z-10"
                  variants={{
                    hover: { scale: 1.05 }
                  }}
                >
                  {feature.title}
                </motion.h3>
                <p className="text-gray-300 relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

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
  )
}
