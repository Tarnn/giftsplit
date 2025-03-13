'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const giftSchema = z.object({
  description: z.string().min(1, 'Description is required').max(50, 'Description must be 50 characters or less'),
  amount: z.number().min(1, 'Amount must be at least $1').max(10000, 'Amount must be $10,000 or less'),
  splitType: z.enum(['even', 'custom']),
  numberOfPeople: z.number().min(2, 'Need at least 2 people').max(20, 'Maximum 20 people'),
  customSplits: z.array(z.number()).optional(),
})

type GiftFormData = z.infer<typeof giftSchema>

export default function GiftForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<{ giftId: string; shareableLink: string } | null>(null)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      splitType: 'even',
      numberOfPeople: 2,
    },
  })

  const splitType = watch('splitType')
  const numberOfPeople = watch('numberOfPeople')

  const onSubmit = async (data: GiftFormData) => {
    try {
      setIsSubmitting(true)
      
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      // Generate mock data
      const mockGiftId = Math.random().toString(36).substring(2, 8)
      const mockShareableLink = `${window.location.origin}/gift/${mockGiftId}`
      
      setSuccess({
        giftId: mockGiftId,
        shareableLink: mockShareableLink,
      })
    } catch (error) {
      console.error('Error creating gift:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Gift Created Successfully!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Share this link with your friends:</p>
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={success.shareableLink}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(success.shareableLink)
                      alert('Link copied to clipboard!')
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSuccess(null)}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Another Gift
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Gift Description
        </label>
        <input
          type="text"
          id="description"
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., Birthday Watch for Dad"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Total Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          {...register('amount', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="150"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Split Type</label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('splitType')}
              value="even"
              className="form-radio"
            />
            <span className="ml-2">Even Split</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('splitType')}
              value="custom"
              className="form-radio"
            />
            <span className="ml-2">Custom Split</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700">
          Number of People
        </label>
        <input
          type="number"
          id="numberOfPeople"
          {...register('numberOfPeople', { valueAsNumber: true })}
          min={2}
          max={20}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.numberOfPeople && (
          <p className="mt-1 text-sm text-red-600">{errors.numberOfPeople.message}</p>
        )}
      </div>

      {splitType === 'custom' && numberOfPeople > 0 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Custom Split Amounts</label>
          {Array.from({ length: numberOfPeople }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Person {index + 1}</span>
              <input
                type="number"
                {...register(`customSplits.${index}` as any, { valueAsNumber: true })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Amount"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          \$1 fee applies only when gift is funded
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Gift Link'}
        </button>
      </div>
    </form>
  )
} 