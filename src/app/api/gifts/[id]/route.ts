import { NextResponse } from 'next/server'

// Mock data store (in memory)
const mockGifts = new Map()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // For development, if no gift exists, create a mock one
    if (!mockGifts.has(params.id)) {
      const mockGift = {
        id: params.id,
        description: 'Birthday Watch for Dad',
        amount: 150,
        splitType: 'even',
        numberOfPeople: 3,
        paidAmounts: [50, 0, 0],
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        organizerEmail: 'test@example.com',
      }
      mockGifts.set(params.id, mockGift)
    }

    const gift = mockGifts.get(params.id)

    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ gift })
  } catch (error) {
    console.error('Error fetching gift:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gift' },
      { status: 500 }
    )
  }
} 