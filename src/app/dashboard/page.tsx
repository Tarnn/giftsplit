'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageLayout } from '@/components/layout/PageLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { useAuth } from '@/context/AuthContext'
import { 
  Gift, 
  Users, 
  DollarSign,
  Crown,
  ChevronRight,
  Plus,
  Search
} from 'lucide-react'

interface GiftSummary {
  id: string
  description: string
  totalAmount: number
  collectedAmount: number
  contributors: number
  status: 'active' | 'completed'
  role: 'organizer' | 'contributor'
  createdAt: string
}

// Mock data
const mockGifts: GiftSummary[] = [
  {
    id: 'gift1',
    description: 'Birthday Gift Collection',
    totalAmount: 150,
    collectedAmount: 100,
    contributors: 2,
    status: 'active',
    role: 'organizer',
    createdAt: '2024-03-13T09:00:00Z'
  },
  {
    id: 'gift2',
    description: 'Anniversary Present',
    totalAmount: 150,
    collectedAmount: 150,
    contributors: 3,
    status: 'completed',
    role: 'contributor',
    createdAt: '2024-03-12T09:00:00Z'
  },
  {
    id: 'gift3',
    description: 'Wedding Gift Pool',
    totalAmount: 150,
    collectedAmount: 50,
    contributors: 1,
    status: 'active',
    role: 'contributor',
    createdAt: '2024-03-11T09:00:00Z'
  }
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const activeGifts = mockGifts.filter(gift => gift.status === 'active')
  const totalCollected = mockGifts.reduce((sum, gift) => sum + gift.collectedAmount, 0)
  const totalContributors = mockGifts.reduce((sum, gift) => sum + gift.contributors, 0)

  const filteredGifts = mockGifts.filter(gift =>
    gift.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <PageLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to view your dashboard</h1>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#070b2b] rounded-3xl p-6 border border-white/5"
          >
            <h2 className="text-white/60 text-sm mb-2">Active Gifts</h2>
            <p className="text-4xl font-bold text-white">{activeGifts.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#070b2b] rounded-3xl p-6 border border-white/5"
          >
            <h2 className="text-white/60 text-sm mb-2">Total Collected</h2>
            <p className="text-4xl font-bold text-white">${totalCollected}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#070b2b] rounded-3xl p-6 border border-white/5 sm:col-span-2 lg:col-span-1"
          >
            <h2 className="text-white/60 text-sm mb-2">Contributors</h2>
            <p className="text-4xl font-bold text-white">{totalContributors}</p>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#070b2b] rounded-3xl border border-white/5 p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <div className="w-full sm:w-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-[#1a1f4d]/30 text-white placeholder-white/40 rounded-xl pl-10 pr-4 py-2 border border-white/10 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredGifts.map((gift) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1f4d]/30 rounded-xl p-4 border border-white/10"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">{gift.description}</span>
                      <Badge variant="outline" className="bg-blue-500/20 text-white border-white/10">
                        {gift.role === 'organizer' ? 'Organizer' : 'Contributor'}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">{gift.contributors} new contributions</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xl font-bold text-white">${gift.collectedAmount}</span>
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                      onClick={() => window.location.href = `/gift/${gift.id}`}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={(gift.collectedAmount / gift.totalAmount) * 100} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 