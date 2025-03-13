import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { Gift } from '@/types/gift'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

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
    
    // Calculate share amount
    const shareAmount = typedGift.splitType === 'custom' && typedGift.customSplits
      ? typedGift.customSplits[shareIndex]
      : typedGift.amount / typedGift.numberOfPeople

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Gift Share: ${typedGift.description}`,
              description: `Share ${shareIndex + 1} of ${typedGift.numberOfPeople}`,
            },
            unit_amount: Math.round(shareAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Platform Fee',
              description: 'One-time fee for gift splitting service',
            },
            unit_amount: 100, // $1 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gift/${giftId}?success=true&share=${shareIndex}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/gift/${giftId}?canceled=true`,
      metadata: {
        giftId,
        shareIndex: shareIndex.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    )
  }
} 