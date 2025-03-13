import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { CreateGiftRequest, Gift } from '@/types/gift'

// Initialize DynamoDB client
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
    const body: CreateGiftRequest = await request.json()
    
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    
    const gift: Gift = {
      id: uuidv4(),
      ...body,
      paidAmounts: Array(body.numberOfPeople).fill(0),
      status: 'pending',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    // Store in DynamoDB
    await docClient.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE || 'gifts',
      Item: gift,
    }))

    // Generate shareable link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const shareableLink = `${baseUrl}/gift/${gift.id}`

    return NextResponse.json({
      gift,
      shareableLink,
    })
  } catch (error) {
    console.error('Error creating gift:', error)
    return NextResponse.json(
      { error: 'Failed to create gift' },
      { status: 500 }
    )
  }
} 