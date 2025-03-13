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
    <Layout>
      <Header />
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gift Dashboard</h1>
              <p className="text-gray-600">Manage all your gifts in one place</p>
            </div>
            <Button onClick={() => window.location.href = '/create'}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Gift
            </Button>
          </div>

          <div className="mb-8 grid gap-6 sm:grid-cols-3">
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Gift className="h-4 w-4" />
                  Total Gifts
                </div>
                <p className="mt-2 text-3xl font-bold">{gifts.length}</p>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  Active Contributors
                </div>
                <p className="mt-2 text-3xl font-bold">
                  {gifts.reduce((sum, gift) => sum + gift.contributors, 0)}
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  Total Amount
                </div>
                <p className="mt-2 text-3xl font-bold">
                  ${gifts.reduce((sum, gift) => sum + gift.totalAmount, 0)}
                </p>
              </div>
            </Card>
          </div>

          <Card>
            <div className="border-b p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search gifts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 rounded-md border pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All Gifts
                  </Button>
                  <Button
                    variant={filter === 'organizing' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('organizing')}
                  >
                    Organizing
                  </Button>
                  <Button
                    variant={filter === 'contributing' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('contributing')}
                  >
                    Contributing
                  </Button>
                </div>
              </div>
            </div>

            <div className="divide-y">
              {filteredGifts.map((gift) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{gift.description}</span>
                      <Badge variant={gift.status === 'completed' ? 'success' : 'outline'}>
                        {gift.status === 'completed' ? 'Completed' : 'Active'}
                      </Badge>
                      <Badge variant="outline">
                        {gift.role === 'organizer' ? 'Organizer' : 'Contributor'}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          ${gift.collectedAmount} of ${gift.totalAmount} collected
                        </span>
                      </div>
                      <Progress
                        value={(gift.collectedAmount / gift.totalAmount) * 100}
                        className="mt-2"
                      />
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {gift.contributors} contributors
                        </span>
                        <span className="font-medium">
                          {Math.round((gift.collectedAmount / gift.totalAmount) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={() => window.location.href = `/gift/${gift.id}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}

              {filteredGifts.length === 0 && (
                <div className="p-6 text-center text-gray-600">
                  No gifts found matching your search criteria.
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </main>
    </Layout>
  )
} 