export type GiftStatus = 'pending' | 'funded' | 'refunded' | 'expired'

export interface Gift {
  id: string
  description: string
  amount: number
  splitType: 'even' | 'custom'
  numberOfPeople: number
  customSplits?: number[]
  paidAmounts: number[]
  status: GiftStatus
  createdAt: string
  expiresAt: string
  organizerEmail: string
}

export interface CreateGiftRequest {
  description: string
  amount: number
  splitType: 'even' | 'custom'
  numberOfPeople: number
  customSplits?: number[]
  organizerEmail: string
}

export interface CreateGiftResponse {
  gift: Gift
  shareableLink: string
} 