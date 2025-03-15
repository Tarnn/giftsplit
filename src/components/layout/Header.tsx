'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { MoneyIcon } from '@/components/ui/MoneyIcon'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, User } from 'lucide-react'

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

const moneyIconVariants = {
  initial: { y: 0 },
  float: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export function Header() {
  const { user, signIn, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-0 z-50"
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
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo variant="light" />
            <motion.div
              variants={moneyIconVariants}
              initial="initial"
              animate="float"
              className="hidden sm:block"
            >
              <MoneyIcon className="h-6 w-6 text-yellow-400" variant="coin" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.nav 
            variants={navVariants}
            initial="hidden"
            animate="visible"
            className="hidden items-center gap-6 md:flex"
          >
            <motion.div variants={itemVariants}>
              <Link
                href="/create"
                className="text-sm font-medium text-white hover:text-white/90 transition-colors relative group"
              >
                Create Gift
                <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            </motion.div>
            
            {user ? (
              <>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-white hover:text-white/90 transition-colors relative group"
                  >
                    Dashboard
                    <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-white hover:text-white/90 transition-colors relative group"
                  >
                    Profile
                    <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={signOut}
                    className="border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    Sign Out
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="sm" 
                  onClick={signIn}
                  className="bg-white text-blue-600 hover:bg-white/90 transition-colors group"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                  <motion.div
                    variants={moneyIconVariants}
                    initial="initial"
                    animate="float"
                    className="absolute -right-3 -top-3"
                  >
                    <MoneyIcon className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-lg p-2 text-white hover:bg-white/10 transition-colors md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden backdrop-blur-xl bg-black/20 border-t border-white/10 md:hidden"
          >
            <motion.nav 
              variants={navVariants}
              initial="hidden"
              animate="visible"
              className="container flex flex-col gap-4 p-4"
            >
              <motion.div variants={itemVariants}>
                <Link
                  href="/create"
                  className="text-sm font-medium text-white hover:text-white/90 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Gift
                  <MoneyIcon className="h-4 w-4 text-yellow-400" variant="dollar" />
                </Link>
              </motion.div>
              
              {user ? (
                <>
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-white hover:text-white/90 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/profile"
                      className="text-sm font-medium text-white hover:text-white/90 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={signOut}
                      className="border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="sm" 
                    onClick={signIn}
                    className="bg-white text-blue-600 hover:bg-white/90 transition-colors"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </motion.div>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
} 