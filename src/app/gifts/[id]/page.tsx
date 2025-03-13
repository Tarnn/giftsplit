'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PageLayout from '@/components/layout/PageLayout'
import { motion } from 'framer-motion'
import { Loader2, Search, Share2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import GiftSuccessDialog from '@/components/gift/GiftSuccessDialog'

interface Contribution {
  id: string
  contributorName: string
  amount: number
  message?: string
  timestamp: Date
}

interface GiftData {
  id: string
  description: string
  amount: number
  collected: number
  contributors: number
  organizerEmail?: string
  contributions: Contribution[]
  createdAt: Date
}

export default function GiftPage() {
  const params = useParams()
  const { toast } = useToast()
  const [gift, setGift] = useState<GiftData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contribution, setContribution] = useState('')
  const [contributorName, setContributorName] = useState('')
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    const fetchGift = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        setGift({
          id: params.id as string,
          description: "Watch for Dad",
          amount: 150,
          collected: 50,
          contributors: 2,
          organizerEmail: "anonymous@example.com",
          contributions: [
            {
              id: '1',
              contributorName: 'Alice',
              amount: 30,
              message: 'Happy birthday!',
              timestamp: new Date(Date.now() - 86400000)
            },
            {
              id: '2',
              contributorName: 'Bob',
              amount: 20,
              timestamp: new Date()
            }
          ],
          createdAt: new Date(Date.now() - 172800000)
        })
      } catch (error) {
        console.error('Failed to fetch gift:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGift()
  }, [params.id])

  const handleContribute = async () => {
    if (!contribution || parseFloat(contribution) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid contribution amount",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Integrate with Stripe
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success!",
        description: "Your contribution has been processed. Thank you!",
      })

      // Update gift data
      if (gift) {
        const newContribution: Contribution = {
          id: Math.random().toString(),
          contributorName: contributorName || 'Anonymous',
          amount: parseFloat(contribution),
          message: message || undefined,
          timestamp: new Date()
        }

        setGift({
          ...gift,
          collected: gift.collected + parseFloat(contribution),
          contributors: gift.contributors + 1,
          contributions: [newContribution, ...gift.contributions]
        })

        // Reset form
        setContribution('')
        setContributorName('')
        setMessage('')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process contribution. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  const filteredContributions = gift?.contributions.filter(contribution =>
    contribution.contributorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contribution.message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    )
  }

  if (!gift) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-white mb-4">Gift Not Found</h1>
          <p className="text-white/70">The gift you're looking for doesn't exist or has been removed.</p>
        </div>
      </PageLayout>
    )
  }

  const progress = (gift.collected / gift.amount) * 100

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">{gift.description}</h1>
          <p className="text-white/70 text-lg">
            Contribute to this group gift
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contribution Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#070b2b] rounded-3xl p-8 border border-white/5 h-fit"
          >
            {/* Progress Bar */}
            <div className="relative h-2 bg-white/5 rounded-full mb-8 overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">${gift.amount}</h3>
                <p className="text-white/60">Total Goal</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">${gift.collected}</h3>
                <p className="text-white/60">Collected</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">{gift.contributors}</h3>
                <p className="text-white/60">Contributors</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white mb-2" htmlFor="contribution">
                  Your Contribution (USD)
                </label>
                <input
                  type="number"
                  id="contribution"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-[#0c1442] text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  min="1"
                  max={gift.amount - gift.collected}
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="name">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-[#0c1442] text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="message">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message..."
                  className="w-full px-4 py-3 bg-[#0c1442] text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-between items-center">
                <motion.button
                  onClick={handleShare}
                  className="px-4 py-2 rounded-xl font-medium bg-white/5 hover:bg-white/10 text-white/70 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>

                <motion.button
                  onClick={handleContribute}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Contribute'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#070b2b] rounded-3xl p-8 border border-white/5"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contributions..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0c1442] text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {filteredContributions?.map((contribution) => (
                <motion.div
                  key={contribution.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/5 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-medium">{contribution.contributorName}</h3>
                      <p className="text-white/40 text-sm">
                        {new Date(contribution.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-white font-bold">${contribution.amount}</span>
                  </div>
                  {contribution.message && (
                    <p className="text-white/70 text-sm">{contribution.message}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {gift && (
          <GiftSuccessDialog
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            giftLink={window.location.href}
            giftDetails={{
              description: gift.description,
              amount: gift.amount.toString()
            }}
          />
        )}
      </div>
    </PageLayout>
  )
} 