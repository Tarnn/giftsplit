'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, AlertCircle, UserPlus, Shield, CreditCard } from 'lucide-react'

interface FormData {
  description: string
  amount: string
  organizerEmail: string
}

interface FormErrors {
  description?: string
  amount?: string
}

export default function CreateGiftPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    description: '',
    amount: '',
    organizerEmail: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'amount') {
      // Remove any non-digit characters except decimal point
      const cleanValue = value.replace(/[^\d.]/g, '')
      // Ensure only one decimal point
      const parts = cleanValue.split('.')
      const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue
      // Limit to 2 decimal places
      const finalValue = formattedValue.includes('.') 
        ? formattedValue.slice(0, formattedValue.indexOf('.') + 3) 
        : formattedValue
      
      setFormData(prev => ({
        ...prev,
        [name]: finalValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!formData.description.trim()) {
      newErrors.description = 'Gift description is required'
    } else if (formData.description.length > 50) {
      newErrors.description = 'Description must be 50 characters or less'
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount'
      } else if (amount > 10000) {
        newErrors.amount = 'Maximum amount is $10,000'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = async () => {
    if (step === 1) {
      if (!validateForm()) {
        return
      }
      setStep(2)
    } else {
      await handleCreateGift()
    }
  }

  const handleCreateGift = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      const giftData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        organizerEmail: formData.organizerEmail || 'anonymous@example.com'
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a temporary gift ID (replace with actual API response)
      const giftId = Math.random().toString(36).substr(2, 9)
      
      toast({
        title: "Success!",
        description: "Your gift has been created successfully.",
      })

      // Redirect to the gift page
      router.push(`/gifts/${giftId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create gift. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const characterCount = formData.description.length
  const maxCharacters = 50
  const progress = (step / 2) * 100

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Create a Gift Link</h1>
          <p className="text-white/70 text-lg">
            Set up your group gift in just a few steps. No sign-up required!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#070b2b] rounded-3xl p-8 border border-white/5"
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

          <div className="flex justify-between items-center mb-6">
            <span className="text-white/70">Step {step} of 2</span>
            <span className="text-white/70">{progress}% Complete</span>
          </div>

          <div className="space-y-6">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-white mb-2" htmlFor="description">
                    Gift Description
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., Watch for Dad"
                      className={`w-full px-4 py-3 bg-[#0c1442] text-white rounded-xl border ${
                        errors.description ? 'border-red-500' : 'border-white/10'
                      } focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                      maxLength={maxCharacters}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                      {characterCount}/{maxCharacters} characters
                    </span>
                  </div>
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2 text-sm text-red-500"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </motion.p>
                  )}
                </div>

                <div className="mt-8">
                  <label className="block text-white mb-2" htmlFor="amount">
                    Total Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`w-full pl-8 pr-4 py-3 bg-[#0c1442] text-white rounded-xl border ${
                        errors.amount ? 'border-red-500' : 'border-white/10'
                      } focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    />
                  </div>
                  {errors.amount && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2 text-sm text-red-500"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.amount}
                    </motion.p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <label className="block text-white mb-2" htmlFor="organizerEmail">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  id="organizerEmail"
                  name="organizerEmail"
                  value={formData.organizerEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#0c1442] text-white rounded-xl border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <p className="mt-2 text-white/40 text-sm">
                  Enter your email to track your gift and receive updates
                </p>
              </div>
            )}

            <div className="flex justify-end mt-8">
              {step === 1 ? (
                <motion.button
                  onClick={handleNextStep}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    formData.description && formData.amount
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-white/5 text-white/40 cursor-not-allowed'
                  }`}
                  whileHover={
                    formData.description && formData.amount
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    formData.description && formData.amount
                      ? { scale: 0.98 }
                      : {}
                  }
                >
                  Next Step
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Gift'
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#0c1442] to-[#070b2b] rounded-2xl p-8 text-center border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-white text-lg font-medium mb-3">No Sign-Up</h3>
            <p className="text-white/60">
              Create and share your gift link in minutes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#0c1442] to-[#070b2b] rounded-2xl p-8 text-center border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-white text-lg font-medium mb-3">Secure</h3>
            <p className="text-white/60">
              Collect funds directly via Stripe
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#0c1442] to-[#070b2b] rounded-2xl p-8 text-center border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 text-green-500 mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-white text-lg font-medium mb-3">Low Fee</h3>
            <p className="text-white/60">
              One-time fee per gift
            </p>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
} 