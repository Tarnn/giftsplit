import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { Gift } from '@/types/gift'

// Comment out Stripe for now
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//   apiVersion: '2025-02-24.acacia',
// })

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: Request) {
  try {
    const { giftId, shareIndex } = await request.json()

    // Get gift from DynamoDB
    const { Item: gift } = await docClient.send(new GetCommand({
      TableName: process.env.DYNAMODB_TABLE || 'gifts',
      Key: { id: giftId },
    }))

    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }

    const typedGift = gift as Gift
    
    // Calculate share amount (keep this for future reference)
    const shareAmount = typedGift.splitType === 'custom' && typedGift.customSplits
      ? typedGift.customSplits[shareIndex]
      : typedGift.amount / typedGift.numberOfPeople

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