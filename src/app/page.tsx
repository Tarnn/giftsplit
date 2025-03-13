'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Gift, Shield, LineChart, User, DollarSign, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/context/AuthContext'

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
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Animated Background Gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Glass Background */}
        <div className="relative backdrop-blur-xl bg-black/20">
          <div className="container flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo />
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={signIn}
              className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div 
          className="w-full max-w-6xl mx-auto text-center space-y-16"
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
            className="space-y-6 -mt-20"
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold tracking-tight"
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
              className="text-xl text-gray-300 max-w-3xl mx-auto"
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
                icon: <div className="w-14 h-14 bg-blue-100/90 rounded-full flex items-center justify-center">
                  <Gift className="w-7 h-7 text-blue-600" />
                </div>,
                title: 'Easy to Use',
                description: 'Create a gift link in seconds and share it with your friends.'
              },
              {
                icon: <div className="w-14 h-14 bg-green-100/90 rounded-full flex items-center justify-center">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>,
                title: 'Secure Payments',
                description: 'All payments are processed securely through Stripe.'
              },
              {
                icon: <div className="w-14 h-14 bg-purple-100/90 rounded-full flex items-center justify-center">
                  <LineChart className="w-7 h-7 text-purple-600" />
                </div>,
                title: 'Track Progress',
                description: 'See who has paid and how much is left to collect.'
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center space-y-4"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Background dots */}
      <motion.div 
        className="fixed inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </div>
  )
}
