'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogIn, Home, User, LayoutDashboard, Gift, LucideIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/ui/Logo'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

interface PageLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
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
  const baseItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: userName || 'Profile', icon: User }
  ]

  if (hasGifts) {
    // Insert My Gifts after Dashboard
    baseItems.splice(1, 0, { href: '/gifts', label: 'My Gifts', icon: Gift })
  }

  return baseItems
}

export function PageLayout({ children }: PageLayoutProps) {
  const { user, signIn, signOut } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Check if there are any gifts using the mock data
  const hasGifts = mockGifts.length > 0

  // Get navigation items based on gifts existence and user name
  const navItems = getNavItems(hasGifts, user?.name)

  return (
    <div className="relative min-h-screen bg-[#070b2b]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#070b2b]/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden [@media(min-width:980px)]:flex items-center gap-6">
              {user && navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg
                      ${pathname === item.href 
                        ? 'text-white bg-white/10' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="h-6 w-px bg-white/10" />
              <LanguageSelector />
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signIn}
                  className="bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                >
                  Sign In
                </Button>
              )}
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="flex items-center gap-4 [@media(min-width:980px)]:hidden">
              <LanguageSelector />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="[@media(min-width:980px)]:hidden border-t border-white/5 bg-[#070b2b] overflow-hidden"
            >
              <div className="container px-4 py-4">
                <nav className="flex flex-col gap-2">
                  {user && navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                          ${pathname === item.href 
                            ? 'text-white bg-white/10' 
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                  {user ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={signOut}
                      className="mt-2 w-full bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={signIn}
                      className="mt-2 w-full bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                    >
                      Sign In
                    </Button>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
} 