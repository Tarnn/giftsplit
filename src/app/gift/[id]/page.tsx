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
import PageLayout from '@/components/layout/PageLayout'

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

export default function GiftPage() {
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
  const [copied, setCopied] = useState(false)
  
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
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
      <motion.div
        className="max-w-3xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Gift Details Card */}
        <motion.div variants={fadeInUp} className={`${components.card} mb-8`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme.colors.text.primary}`}>
                Watch for Dad
              </h1>
              <p className={theme.colors.text.secondary}>
                Organized by john@example.com
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleShare}
              className={components.button.outline}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className={`text-sm font-medium mb-1 ${theme.colors.text.secondary}`}>Progress</h3>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className={theme.colors.text.muted}>$90 collected</span>
                <span className={theme.colors.text.primary}>$150 total</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contributors Section */}
        <motion.div variants={fadeInUp}>
          <h2 className={`text-xl font-semibold mb-4 ${theme.colors.text.primary}`}>
            Contributors
          </h2>
          <div className="space-y-4">
            {giftData.contributors.map((contributor, index) => (
              <motion.div
                key={contributor.name}
                className={`${components.card} flex justify-between items-center`}
                whileHover={{ y: -2 }}
              >
                <div>
                  <h3 className={`font-medium ${theme.colors.text.primary}`}>{contributor.name}</h3>
                  <p className={theme.colors.text.muted}>
                    Contributed ${contributor.amount}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={components.button.outline}
                  onClick={() => handleDownloadReceipt(contributor)}
                  disabled={isGeneratingReceipt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contribute Button */}
        <motion.div
          variants={fadeInUp}
          className="mt-8 flex justify-center"
        >
          <Button
            size="lg"
            className={`${components.button.primary} px-8 py-6 text-lg`}
            onClick={() => setShowContributeForm(true)}
          >
            Contribute to Gift
          </Button>
        </motion.div>

        {showContributeForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <form onSubmit={handleContribute} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="Enter your name"
                  value={contributorName}
                  onChange={(e) => {
                    setContributorName(e.target.value)
                    if (error && error.includes('name')) setError(null)
                  }}
                  maxLength={50}
                  required
                />
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Contribution Amount
                  </label>
                  <div className="grid gap-4">
                    <div className="flex flex-wrap gap-2">
                      {suggestedAmounts.map((suggestion) => (
                        <Button
                          key={suggestion.label}
                          type="button"
                          variant={selectedSuggestion === suggestion.label ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="flex-1"
                        >
                          {suggestion.label}
                          {suggestion.percentage && (
                            <span className="ml-1 text-xs">
                              (${suggestion.amount})
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                    <AnimatePresence mode="wait">
                      {selectedSuggestion === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Input
                            type="number"
                            value={contributionAmount}
                            onChange={(e) => {
                              setContributionAmount(e.target.value)
                              if (error) validateContribution(Number(e.target.value))
                            }}
                            placeholder={`Enter amount (min $${minContribution.toFixed(2)})`}
                            min={minContribution}
                            max={Math.min(10000, remainingAmount)}
                            step="0.01"
                            required
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 p-3"
                >
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                </motion.div>
              )}

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium">Contribution Summary</h4>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Your Name:</dt>
                    <dd className="font-medium">{contributorName || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Amount:</dt>
                    <dd className="font-medium">
                      {contributionAmount ? `$${Number(contributionAmount).toFixed(2)}` : '—'}
                    </dd>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Processing Fee:</dt>
                    <dd className="font-medium">$0.50</dd>
                  </div>
                </dl>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowContributeForm(false)
                    setError(null)
                    setContributorName('')
                    setContributionAmount('')
                    setSelectedSuggestion('custom')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !contributorName || !contributionAmount}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </PageLayout>
  )
} 