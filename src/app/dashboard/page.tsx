'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
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
import PageLayout from '@/components/layout/PageLayout'

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

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'organizing' | 'contributing'>('all')

  // Mock gift data
  const gifts: GiftSummary[] = [
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

  const filteredGifts = gifts
    .filter(gift => {
      if (filter === 'organizing') return gift.role === 'organizer'
      if (filter === 'contributing') return gift.role === 'contributor'
      return true
    })
    .filter(gift => 
      gift.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

  // Mock activity data
  const activities = [
    {
      id: 1,
      title: 'Birthday Gift Collection',
      contributions: 2,
      amount: 150,
    },
    {
      id: 2,
      title: 'Anniversary Present',
      contributions: 3,
      amount: 150,
    },
    {
      id: 3,
      title: 'Wedding Gift Pool',
      contributions: 1,
      amount: 150,
    },
  ]

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <Layout>
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Please sign in to view your dashboard</h1>
          </div>
        </main>
      </Layout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#070b2b] rounded-3xl p-8 border border-white/5"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0c1442] rounded-2xl p-6"
            >
              <h3 className="text-white/70 text-lg font-medium mb-3">Active Gifts</h3>
              <p className="text-4xl font-bold text-white">2</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0c1442] rounded-2xl p-6"
            >
              <h3 className="text-white/70 text-lg font-medium mb-3">Total Collected</h3>
              <p className="text-4xl font-bold text-white">$300</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0c1442] rounded-2xl p-6"
            >
              <h3 className="text-white/70 text-lg font-medium mb-3">Contributors</h3>
              <p className="text-4xl font-bold text-white">8</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#070b2b] rounded-3xl p-8 border border-white/5"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0c1442] text-white pl-10 pr-4 py-2 rounded-xl border border-white/5 focus:outline-none focus:border-white/20 placeholder:text-white/40"
              />
            </div>
          </div>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-[#0c1442] rounded-2xl p-6 transition-colors hover:bg-[#0f1957] group"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium text-lg group-hover:text-white/90">
                      {activity.title}
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      {activity.contributions} new contributions
                    </p>
                  </div>
                  <span className="text-white font-medium text-lg">
                    ${activity.amount}
                  </span>
                </div>
              </motion.div>
            ))}
            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60">No activities found matching your search.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 