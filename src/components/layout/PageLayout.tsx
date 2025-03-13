'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Home, User, LayoutDashboard, Gift } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/ui/Logo'
import SparkleEffect from '@/components/ui/SparkleEffect'

interface PageLayoutProps {
  children: React.ReactNode
  showNav?: boolean
}

// Mock gift data - this should eventually come from your data layer
const mockGifts = [
  {
    id: 'gift1',
    description: 'Watch for Dad',
    totalAmount: 200,
    collectedAmount: 150,
    contributors: 3,
    status: 'active',
    role: 'organizer',
    createdAt: '2024-03-13T09:00:00Z'
  },
  {
    id: 'gift2',
    description: 'Birthday gift for Sarah',
    totalAmount: 150,
    collectedAmount: 150,
    contributors: 5,
    status: 'completed',
    role: 'contributor',
    createdAt: '2024-03-12T09:00:00Z'
  }
]

// Function to get navigation items based on gifts existence
const getNavItems = (hasGifts: boolean, userName: string = '') => {
  const baseItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: userName || 'Profile', icon: User }
  ]

  if (hasGifts) {
    // Insert My Gifts after Dashboard
    baseItems.splice(1, 0, { href: '/gifts', label: 'My Gifts', icon: Gift })
  }

  return baseItems
}

export default function PageLayout({ children, showNav = true }: PageLayoutProps) {
  const { user, signIn } = useAuth()
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState<string | null>(null)

  // Check if there are any gifts using the mock data
  const hasGifts = mockGifts.length > 0

  // Get navigation items based on gifts existence and user name
  const navItems = getNavItems(hasGifts, user?.name)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2c] via-[#121a4a] to-[#1a1248]">
      {/* Background Sparkles */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <SparkleEffect color="#ffffff" size={2.5} count={20} />
      </div>

      {showNav && (
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className="relative backdrop-blur-xl bg-black/20">
            <div className="container flex h-16 items-center justify-between px-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/" className="flex items-center gap-2">
                  <Logo />
                </Link>
              </motion.div>

              <div className="flex items-center gap-6">
                {user ? (
                  <>
                    {navItems.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      
                      return (
                        <Link 
                          key={item.href}
                          href={item.href}
                          className="relative"
                          onMouseEnter={() => setIsHovered(item.href)}
                          onMouseLeave={() => setIsHovered(null)}
                        >
                          <motion.div
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
                              isActive 
                                ? 'text-white bg-[#0c1442]' 
                                : 'text-white/70 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="font-medium">{item.label}</span>
                            
                            {/* Hover background */}
                            {(isHovered === item.href && !isActive) && (
                              <motion.div
                                layoutId="navHover"
                                className="absolute inset-0 bg-white/[0.02] rounded-xl -z-10"
                                initial={false}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 30
                                }}
                              />
                            )}
                          </motion.div>
                        </Link>
                      )
                    })}
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signIn}
                    className="relative px-5 py-2 text-sm text-white/90 bg-[#0c1442] rounded-xl overflow-hidden group"
                  >
                    <span className="relative z-10 font-medium">Sign In</span>
                    
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
                        <LogIn className="w-4 h-4 text-blue-400" />
                      </motion.div>
                    </motion.div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Main content */}
      <main className="pt-20 px-6">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      {/* Background dots */}
      <motion.div 
        className="fixed inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none -z-10"
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