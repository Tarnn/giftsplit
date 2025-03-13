'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface User {
  id: string
  email: string
  name: string
  given: number
  received: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Mock user session check
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async () => {
    setIsLoading(true)
    try {
      // Mock Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: 'google123',
        email: 'user@example.com',
        name: 'John Doe',
        given: 300,
        received: 150
      }
      
      setUser(mockUser)
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(null)
      localStorage.removeItem('mockUser')
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 