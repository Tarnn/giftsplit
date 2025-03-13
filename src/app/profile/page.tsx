'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
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
      <Layout>
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
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
          className="mx-auto max-w-2xl"
        >
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                {isPremium ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    Premium
                  </Badge>
                ) : (
                  <Button
                    onClick={handleUnlockPremium}
                    disabled={isLoading}
                    variant="outline"
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
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Total Given</p>
                  <p className="text-2xl font-bold">${user.given}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Total Received</p>
                  <p className="text-2xl font-bold">${user.received}</p>
                </div>
              </div>
            </div>
          </Card>

          {isPremium && (
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="flex items-center gap-2 font-medium">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Premium Features
                </h2>
                <div className="mt-4 grid gap-4">
                  <Button
                    variant="outline"
                    className="justify-between"
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
                    variant="outline"
                    className="justify-between"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Multi-Gift Dashboard
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-6 pt-6">
                <TabsList className="w-full">
                  <TabsTrigger value="history" className="flex-1">
                    <History className="mr-2 h-4 w-4" />
                    Gift History
                  </TabsTrigger>
                  <TabsTrigger value="receipts" className="flex-1">
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
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{gift.description}</span>
                          <Badge variant="outline">
                            {gift.role === 'organizer' ? 'Organizer' : 'Contributor'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{gift.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${gift.amount}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => window.location.href = `/gift/${gift.id}`}
                        >
                          View Gift
                        </Button>
                      </div>
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
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{gift.description}</p>
                        <p className="text-sm text-gray-600">{gift.date}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportReceipts()}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </main>
    </Layout>
  )
} 