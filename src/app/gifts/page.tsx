'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PageLayout from '@/components/layout/PageLayout'
import { Search, Plus } from 'lucide-react'

interface Gift {
  id: string
  description: string
  amount: number
  collected: number
  contributors: number
  createdAt: Date
}

export default function GiftsPage() {
  const router = useRouter()
  const [gifts, setGifts] = useState<Gift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        setGifts([
          {
            id: '1',
            description: 'Watch for Dad',
            amount: 150,
            collected: 50,
            contributors: 2,
            createdAt: new Date(Date.now() - 172800000)
          },
          {
            id: '2',
            description: 'Birthday Gift for Mom',
            amount: 200,
            collected: 150,
            contributors: 4,
            createdAt: new Date(Date.now() - 86400000)
          }
        ])
      } catch (error) {
        console.error('Failed to fetch gifts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGifts()
  }, [])

  const filteredGifts = gifts.filter(gift =>
    gift.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white">My Gifts</h1>
            <p className="text-white/70 mt-2">
              Manage and track your gift collections
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/create')}
            className="px-6 py-3 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Create Gift
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#070b2b] rounded-3xl p-8 border border-white/5"
        >
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts..."
                className="w-full pl-10 pr-4 py-3 bg-[#0c1442] text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredGifts.length > 0 ? (
            <div className="grid gap-4">
              {filteredGifts.map((gift) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => router.push(`/gifts/${gift.id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-medium text-lg">{gift.description}</h3>
                      <p className="text-white/40 text-sm">
                        Created {new Date(gift.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-white font-bold">${gift.amount}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white/60">
                        ${gift.collected} of ${gift.amount}
                      </span>
                    </div>
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${(gift.collected / gift.amount) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">{gift.contributors} contributors</span>
                      <span className="text-white/60">
                        {Math.round((gift.collected / gift.amount) * 100)}% funded
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/40">No gifts found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  )
} 