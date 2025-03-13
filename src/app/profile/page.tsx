'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import PageLayout from '@/components/layout/PageLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useAuth } from '@/context/AuthContext'
import { generateReceipt } from '@/lib/pdf'
import { 
  Gift, 
  Download, 
  Crown, 
  CreditCard, 
  Loader2, 
  ChevronRight,
  History,
  Receipt
} from 'lucide-react'

interface GiftHistory {
  id: string
  description: string
  amount: number
  date: string
  role: 'organizer' | 'contributor'
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('history')

  // Mock gift history
  const giftHistory: GiftHistory[] = [
    {
      id: 'gift1',
      description: 'Watch for Dad',
      amount: 30,
      date: '3/13/2024',
      role: 'contributor'
    },
    {
      id: 'gift2',
      description: 'Birthday gift for Sarah',
      amount: 150,
      date: '3/12/2024',
      role: 'organizer'
    }
  ]

  const handleUnlockPremium = async () => {
    setIsLoading(true)
    try {
      // Mock premium unlock
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsPremium(true)
      toast({
        title: 'Premium Features Unlocked!',
        description: 'You now have access to all premium features.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unlock premium features. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportReceipts = async () => {
    setIsLoading(true)
    try {
      // Generate combined PDF for all contributions
      const receipt = await generateReceipt({
        giftDescription: 'All Contributions',
        contributorName: user?.name || '',
        amount: user?.given || 0,
        date: new Date().toISOString(),
        transactionId: 'ALL',
      })

      const link = document.createElement('a')
      link.href = receipt
      link.download = 'giftsplit-all-receipts.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Success',
        description: 'Your receipts have been exported.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export receipts. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto pt-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Please sign in to view your profile</h1>
          </div>
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
          className="mx-auto max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#070b2b] rounded-3xl p-8 border border-white/5 mb-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-white/60">{user.email}</p>
              </div>
              {isPremium ? (
                <Badge variant="outline" className="flex items-center gap-1 bg-[#1a1f4d]/30 text-white border-white/10">
                  <Crown className="h-3 w-3 text-yellow-500" />
                  Premium
                </Badge>
              ) : (
                <Button
                  onClick={handleUnlockPremium}
                  disabled={isLoading}
                  className="bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-4 w-4" />
                      Unlock Premium ($2)
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#1a1f4d]/30 p-4 border border-white/10">
                <p className="text-sm text-white/60">Total Given</p>
                <p className="text-2xl font-bold text-white">${user.given}</p>
              </div>
              <div className="rounded-xl bg-[#1a1f4d]/30 p-4 border border-white/10">
                <p className="text-sm text-white/60">Total Received</p>
                <p className="text-2xl font-bold text-white">${user.received}</p>
              </div>
            </div>
          </motion.div>

          {isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#070b2b] rounded-3xl p-8 border border-white/5 mb-6"
            >
              <h2 className="flex items-center gap-2 font-medium text-white">
                <Crown className="h-4 w-4 text-yellow-500" />
                Premium Features
              </h2>
              <div className="mt-4 grid gap-4">
                <Button
                  className="justify-between bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                  onClick={handleExportReceipts}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Export All Receipts (PDF)
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  className="justify-between bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Multi-Gift Dashboard
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#070b2b] rounded-3xl border border-white/5"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-white/5 px-6 pt-6">
                <TabsList className="w-full bg-[#1a1f4d]/30">
                  <TabsTrigger value="history" className="flex-1 text-white data-[state=active]:bg-blue-500">
                    <History className="mr-2 h-4 w-4" />
                    Gift History
                  </TabsTrigger>
                  <TabsTrigger value="receipts" className="flex-1 text-white data-[state=active]:bg-blue-500">
                    <Receipt className="mr-2 h-4 w-4" />
                    Receipts
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="history" className="p-6">
                <div className="space-y-4">
                  {giftHistory.map((gift) => (
                    <motion.div
                      key={gift.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-xl bg-[#1a1f4d]/30 p-4 border border-white/10"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{gift.description}</span>
                          <Badge variant="outline" className="bg-blue-500/20 text-white border-white/10">
                            {gift.role === 'organizer' ? 'Organizer' : 'Contributor'}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60">{gift.date}</p>
                      </div>
                      <span className="font-bold text-white">${gift.amount}</span>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="receipts" className="p-6">
                <div className="space-y-4">
                  {giftHistory.map((gift) => (
                    <motion.div
                      key={gift.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-xl bg-[#1a1f4d]/30 p-4 border border-white/10"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{gift.description}</span>
                          <Badge variant="outline" className="bg-blue-500/20 text-white border-white/10">
                            Receipt
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60">{gift.date}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                        onClick={() => handleExportReceipts()}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  )
} 