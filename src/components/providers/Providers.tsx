'use client'

import { Toaster } from '@/components/ui/Toaster'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
} 