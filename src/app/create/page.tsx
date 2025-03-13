'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToast } from '@/components/ui/use-toast'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Separator } from '@/components/ui/Separator'
import { useAuth } from '@/context/AuthContext'
import GiftSuccessDialog from '@/components/gift/GiftSuccessDialog'
import { Loader2, AlertCircle } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import { theme, components } from '@/styles/theme'

interface FormErrors {
  description?: string
  amount?: string
  organizerEmail?: string
}

export default function CreateGiftPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [step, setStep] = useState(1)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [giftId, setGiftId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    organizerEmail: '',
  })

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {}

    if (currentStep === 1) {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required'
      } else if (formData.description.length > 50) {
        newErrors.description = 'Description must be 50 characters or less'
      }

      if (!formData.amount) {
        newErrors.amount = 'Amount is required'
      } else if (Number(formData.amount) < 1) {
        newErrors.amount = 'Amount must be at least $1'
      } else if (Number(formData.amount) > 10000) {
        newErrors.amount = 'Maximum amount is $10,000'
      }
    }

    if (currentStep === 2) {
      if (!formData.organizerEmail) {
        newErrors.organizerEmail = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizerEmail)) {
        newErrors.organizerEmail = 'Invalid email format'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(2)) return

    setIsLoading(true)

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a gift ID only when the form is submitted
      const newGiftId = Math.random().toString(36).substring(2, 8)
      setGiftId(newGiftId)
      setShowSuccessDialog(true)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create gift link. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const renderError = (error?: string) => {
    if (!error) return null
    return (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1 flex items-center gap-1 text-sm text-red-500"
      >
        <AlertCircle className="h-4 w-4" />
        {error}
      </motion.p>
    )
  }

  return (
    <PageLayout>
      <motion.div 
        className="max-w-2xl mx-auto"
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme.colors.text.primary}`}>
            Create a Gift Link
          </h1>
          <p className={theme.colors.text.secondary}>
            Set up your group gift in just a few steps. No sign-up required!
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className={components.card}
        >
          {/* Progress bar */}
          <div className="mb-8">
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / 2) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Step {step} of 2</span>
              <span>{(step / 2) * 100}% Complete</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              variants={fadeInUp}
              className="space-y-4"
            >
              <label className={`block ${theme.colors.text.primary}`}>
                Gift Description
                <input
                  type="text"
                  placeholder="e.g., Watch for Dad"
                  className={components.input}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value })
                    setErrors({ ...errors, description: undefined })
                  }}
                  maxLength={50}
                />
                <span className="text-sm text-gray-400 float-right mt-1">
                  {formData.description.length}/50 characters
                </span>
              </label>

              <label className={`block ${theme.colors.text.primary}`}>
                Total Amount (USD)
                <input
                  type="text"
                  placeholder="e.g., 150"
                  className={components.input}
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData({ ...formData, amount: e.target.value })
                    setErrors({ ...errors, amount: undefined })
                  }}
                />
              </label>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex justify-end"
            >
              <Button
                type="submit"
                className={`${components.button.primary} px-8`}
              >
                Next Step
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
        >
          {[
            { label: 'No Sign-Up', description: 'Create and share your gift link in minutes' },
            { label: 'Secure', description: 'Collect funds directly via Stripe' },
            { label: 'Low Fee', description: 'One-time fee per gift' }
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              className={`${components.card} text-center`}
              whileHover={{ y: -5 }}
            >
              <h3 className={`text-lg font-semibold mb-2 ${theme.colors.text.primary}`}>
                {feature.label}
              </h3>
              <p className={theme.colors.text.muted}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <GiftSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false)
          setFormData({
            description: '',
            amount: '',
            organizerEmail: '',
          })
        }}
        giftLink={`http://localhost:3000/gift/${giftId}`}
        giftDetails={{
          description: formData.description,
          amount: formData.amount,
        }}
      />
    </PageLayout>
  )
} 