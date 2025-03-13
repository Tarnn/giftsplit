'use client'

import { AuthProvider } from '@/context/AuthContext'
import { Providers } from './Providers'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Providers>{children}</Providers>
    </AuthProvider>
  )
} 