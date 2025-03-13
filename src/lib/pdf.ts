import { jsPDF } from 'jspdf'

interface ReceiptData {
  giftDescription: string
  contributorName: string
  amount: number
  date: string
  transactionId: string
}

export async function generateReceipt(data: ReceiptData): Promise<string> {
  // Mock PDF generation
  await new Promise(resolve => setTimeout(resolve, 1000))

  const doc = new jsPDF()
  
  // Add logo/header
  doc.setFontSize(20)
  doc.text('GiftSplit', 105, 20, { align: 'center' })
  
  // Add receipt details
  doc.setFontSize(12)
  doc.text('Receipt', 105, 40, { align: 'center' })
  
  doc.setFontSize(10)
  const startY = 60
  const lineHeight = 7
  
  doc.text(`Date: ${data.date}`, 20, startY)
  doc.text(`Transaction ID: ${data.transactionId}`, 20, startY + lineHeight)
  doc.text(`Gift: ${data.giftDescription}`, 20, startY + lineHeight * 2)
  doc.text(`Contributor: ${data.contributorName}`, 20, startY + lineHeight * 3)
  doc.text(`Amount: $${data.amount.toFixed(2)}`, 20, startY + lineHeight * 4)
  doc.text('Processing Fee: $0.50', 20, startY + lineHeight * 5)
  
  // Add footer
  doc.setFontSize(8)
  doc.text('Thank you for using GiftSplit!', 105, 280, { align: 'center' })
  
  // In production, this would save the PDF to a server or cloud storage
  // For now, we'll return a mock URL
  return URL.createObjectURL(doc.output('blob'))
} 