import { NextResponse } from 'next/server'
import { Gift } from '@/types/gift'

// Mock gifts data store
const mockGifts: Record<string, Gift> = {
  // Add a sample gift for testing
  'test-gift-id': {
    id: 'test-gift-id',
    description: 'Test Gift',
    amount: 100,
    splitType: 'even',
    numberOfPeople: 3,
    paidAmounts: [0, 0, 0],
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    organizerEmail: 'test@example.com'
  }
}

export async function POST(request: Request) {
  try {
    const { giftId, shareIndex } = await request.json()

    // Get gift from mock data
    const gift = mockGifts[giftId]

    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }
    
    // Calculate share amount (keep this for future reference)
    const shareAmount = gift.splitType === 'custom' && gift.customSplits
      ? gift.customSplits[shareIndex]
      : gift.amount / gift.numberOfPeople

    // Mock Stripe session creation
    const mockSession = {
      id: `mock_session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      amount: shareAmount,
      metadata: {
        giftId,
        shareIndex: shareIndex.toString(),
      }
    }

    // Return mock session ID
    return NextResponse.json({ 
      sessionId: mockSession.id,
      // Include additional mock data that might be useful for testing
      mockData: {
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gift/${giftId}?success=true&share=${shareIndex}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gift/${giftId}?canceled=true`,
        amount: shareAmount,
        platformFee: 1.00, // $1 platform fee
      }
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
} 