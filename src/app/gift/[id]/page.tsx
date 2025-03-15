'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/components/ui/use-toast'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { Loader2, Share2, Users, DollarSign, CheckCircle2, AlertCircle, Download } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Separator } from '@/components/ui/Separator'
import { useAuth } from '@/context/AuthContext'
import { createCheckoutSession } from '@/lib/stripe'
import { generateReceipt } from '@/lib/pdf'
import { useParams } from 'next/navigation'
import { theme, components } from '@/styles/theme'
import { PageLayout } from '@/components/layout/PageLayout'
import { NextPage } from 'next'
import { ShareModal } from '@/components/ui/ShareModal'

interface ContributionReceipt {
  url: string
  date: string
}

interface Contributor {
  name: string
  amount: number
  status: 'paid' | 'pending'
  date: string
  receipt?: ContributionReceipt
}

interface GiftData {
  id: string
  description: string
  totalAmount: number
  numberOfPeople: number
  amountPerPerson: number
  organizer: string
  contributors: Contributor[]
  createdAt: string
}

interface SuggestedAmount {
  label: string
  amount: number
  percentage?: number
}

// Mock data - replace with actual API call
const mockGiftData: GiftData = {
  id: 'mock-id',
  description: 'Birthday gift for Sarah',
  totalAmount: 150,
  numberOfPeople: 5,
  amountPerPerson: 30,
  organizer: 'John Doe',
  contributors: [
    {
      name: 'Alice',
      amount: 30,
      status: 'paid',
      date: '3/13/2024'
    },
    {
      name: 'Bob',
      amount: 30,
      status: 'pending',
      date: 'Just now'
    }
  ],
  createdAt: '2024-03-13T09:00:00Z'
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const GiftPage: NextPage = () => {
  const { id } = useParams() as { id: string }
  const { toast } = useToast()
  const { user, signIn, isLoading: isAuthLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showContributeForm, setShowContributeForm] = useState(false)
  const [contributorName, setContributorName] = useState('')
  const [contributionAmount, setContributionAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [giftData, setGiftData] = useState<GiftData>(mockGiftData)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('custom')
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  
  const totalPaid = giftData.contributors.reduce((sum, contributor) => 
    contributor.status === 'paid' ? sum + contributor.amount : sum, 0
  )
  
  const progress = (totalPaid / giftData.totalAmount) * 100

  const remainingAmount = giftData.totalAmount - totalPaid
  const minContribution = Math.max(2, giftData.totalAmount * 0.1)

  const suggestedAmounts: SuggestedAmount[] = [
    {
      label: '25%',
      amount: Math.min(remainingAmount, Math.round(giftData.totalAmount * 0.25)),
      percentage: 25
    },
    {
      label: '50%',
      amount: Math.min(remainingAmount, Math.round(giftData.totalAmount * 0.5)),
      percentage: 50
    },
    {
      label: '100%',
      amount: remainingAmount,
      percentage: 100
    },
    {
      label: 'Custom',
      amount: 0
    }
  ].filter(suggestion => suggestion.amount >= minContribution)

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  const validateContribution = (amount: number): boolean => {
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    
    const minAmount = Math.max(2, giftData.totalAmount * 0.1)
    if (amount < minAmount) {
      setError(`Minimum contribution is $${minAmount.toFixed(2)} (10% of total or $2, whichever is greater)`)
      return false
    }
    
    if (amount > remainingAmount) {
      setError(`Maximum contribution cannot exceed the remaining amount: $${remainingAmount.toFixed(2)}`)
      return false
    }

    if (amount > 10000) {
      setError('Maximum contribution amount is $10,000')
      return false
    }

    const existingContributor = giftData.contributors.find(
      c => c.name.toLowerCase() === contributorName.toLowerCase()
    )
    if (existingContributor) {
      setError('You have already contributed to this gift. Please use a different name.')
      return false
    }

    setError(null)
    return true
  }

  const handleSuggestionSelect = (suggestion: SuggestedAmount) => {
    if (suggestion.label === 'Custom') {
      setSelectedSuggestion('custom')
      setContributionAmount('')
    } else {
      setSelectedSuggestion(suggestion.label)
      setContributionAmount(suggestion.amount.toString())
      validateContribution(suggestion.amount)
    }
  }

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(contributionAmount)
    
    if (!contributorName.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (!validateContribution(amount)) {
      return
    }

    setIsLoading(true)
    try {
      // Create Stripe checkout session
      const session = await createCheckoutSession({
        giftId: id,
        contributorName,
        amount,
      })

      // Mock successful payment
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate receipt
      const receipt = await generateReceipt({
        giftDescription: giftData.description,
        contributorName,
        amount,
        date: new Date().toISOString(),
        transactionId: session.id,
      })

      // Update local state
      const newContributor: Contributor = {
        name: contributorName,
        amount,
        status: 'paid',
        date: new Date().toLocaleDateString(),
        receipt: {
          url: receipt,
          date: new Date().toISOString(),
        },
      }

      setGiftData(prev => ({
        ...prev,
        contributors: [...prev.contributors, newContributor],
      }))
      
      toast({
        title: 'Payment Successful!',
        description: 'Your contribution has been processed.',
      })

      // Offer to sign up
      if (!user) {
        toast({
          title: 'Track Your Contributions',
          description: (
            <div className="mt-2 flex items-center gap-2">
              <span>Sign in with Google to track all your contributions!</span>
              <Button size="sm" onClick={signIn}>
                Sign In
              </Button>
            </div>
          ),
        })
      }

      setShowContributeForm(false)
      setContributorName('')
      setContributionAmount('')
      setSelectedSuggestion('custom')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadReceipt = async (contributor: Contributor) => {
    if (!contributor.receipt) return

    setIsGeneratingReceipt(true)
    try {
      const link = document.createElement('a')
      link.href = contributor.receipt.url
      link.download = `giftsplit-receipt-${contributor.date}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download receipt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingReceipt(false)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pt-12 px-4 pb-12">
        {/* Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title={`Contribute to: ${giftData.description}`}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#070b2b] rounded-3xl p-8 border border-white/5 mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{giftData.description}</h1>
              <p className="text-white/60">Organized by {giftData.organizer}</p>
            </div>
            <Button
              onClick={handleShare}
              className="w-full sm:w-auto bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
            >
              Share
              <Share2 className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-white/60 text-sm mb-2">Progress</h2>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between mt-2">
                <span className="text-white/60">${totalPaid} collected</span>
                <span className="text-white/60">${giftData.totalAmount} total</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#070b2b] rounded-3xl border border-white/5 overflow-hidden"
        >
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Contributors</h2>
            <div className="space-y-4">
              {giftData.contributors.map((contributor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#1a1f4d]/30 border border-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{contributor.name}</p>
                    <p className="text-sm text-white/60">Contributed ${contributor.amount}</p>
                  </div>
                  {contributor.receipt && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10"
                      onClick={() => window.open(contributor.receipt?.url)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Receipt
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Contribute to Gift</h2>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Input Fields */}
                <div>
                  <div>
                    <label className="block text-white mb-2 font-medium" htmlFor="name">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-[#1a1f4d]/30 text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-white/40 transition-all duration-200"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-white mb-2 font-medium">
                      Message (Optional)
                    </label>
                    <textarea
                      placeholder="Add a short message..."
                      className="w-full px-4 py-3 bg-[#1a1f4d]/30 text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-white/40 transition-all duration-200 min-h-[100px] resize-none"
                    />
                    <p className="text-white/40 text-sm mt-1">200 characters remaining</p>
                  </div>

                  <div className="mt-6">
                    <label className="block text-white mb-2 font-medium">
                      Contribution Amount
                    </label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {suggestedAmounts.map((suggestion) => (
                        <Button
                          key={suggestion.label}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className={`w-full transition-all duration-200 ${
                            selectedSuggestion === suggestion.label
                              ? 'bg-blue-500 hover:bg-blue-600 text-white ring-2 ring-blue-500/20'
                              : 'bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10'
                          }`}
                        >
                          {suggestion.label}
                          {suggestion.amount > 0 && (
                            <span className="block text-sm opacity-80">${suggestion.amount}</span>
                          )}
                        </Button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => {
                        setContributionAmount(e.target.value)
                        setSelectedSuggestion('custom')
                        validateContribution(Number(e.target.value))
                      }}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 bg-[#1a1f4d]/30 text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-white/40 transition-all duration-200"
                    />
                    {error && (
                      <p className="mt-2 text-red-500 flex items-center gap-2 bg-red-500/10 p-2 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Summary */}
                <div>
                  <div className="bg-[#1a1f4d]/30 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white font-medium mb-6 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Contribution Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-white/60 items-center">
                        <span>Your Name</span>
                        <span className="font-medium text-white">{contributorName || '—'}</span>
                      </div>
                      <div className="flex justify-between text-white/60 items-center">
                        <span>Amount</span>
                        <span className="font-medium text-white">{contributionAmount ? `$${contributionAmount}` : '—'}</span>
                      </div>
                      <div className="flex justify-between text-white/60 items-center">
                        <span>Processing Fee</span>
                        <span className="font-medium text-white">$0.50</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between text-white items-center">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-medium">
                          ${contributionAmount ? (Number(contributionAmount) + 0.50).toFixed(2) : '0.50'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button
                      className="w-full sm:w-auto bg-[#1a1f4d]/30 text-white hover:bg-[#1a1f4d]/50 border border-white/10 transition-all duration-200"
                      onClick={() => setShowContributeForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="w-full sm:flex-1 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50"
                      onClick={handleContribute}
                      disabled={isLoading || !contributorName || !contributionAmount}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Continue to Payment'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}

export default GiftPage; 