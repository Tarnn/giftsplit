'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  variant?: 'light' | 'dark';
}

export function Logo({ variant = 'dark' }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4B9EFF] to-[#9D7BFF] flex items-center justify-center">
          <span className="text-white font-bold text-xl">G</span>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-[#4B9EFF] to-[#9D7BFF] rounded-lg blur opacity-30" />
      </div>
      <div className="flex items-center">
        <span className={`text-2xl font-bold ${variant === 'light' ? 'text-white' : 'bg-gradient-to-r from-[#4B9EFF] to-[#9D7BFF] bg-clip-text text-transparent'}`}>
          Gift
        </span>
        <span className={`text-2xl font-bold ${variant === 'light' ? 'text-white' : 'text-white'}`}>
          Split
        </span>
      </div>
    </div>
  )
} 