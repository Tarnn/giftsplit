'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/use-toast'
import {
  Check,
  Copy,
  Share2,
  Facebook,
  Twitter,
  Mail,
  MessageSquare,
  Linkedin,
  MessageCircle
} from 'lucide-react'

interface GiftSuccessDialogProps {
  isOpen: boolean
  onClose: () => void
  giftLink: string
  giftDetails: {
    description: string
    amount: string
  }
}

export default function GiftSuccessDialog({
  isOpen,
  onClose,
  giftLink,
  giftDetails,
}: GiftSuccessDialogProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(giftLink)
      setCopied(true)
      toast({
        title: 'Link Copied!',
        description: 'The gift link has been copied to your clipboard.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const shareText = `Join me in contributing to ${giftDetails.description}! Total goal: $${giftDetails.amount}`

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      onClick: handleCopyLink,
      active: copied,
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      onClick: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${giftLink}`)}`)
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(giftLink)}&quote=${encodeURIComponent(shareText)}`)
      },
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n\n${giftLink}`)}`)
      },
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(giftLink)}`)
      },
    },
    {
      name: 'Email',
      icon: Mail,
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(`Contribute to ${giftDetails.description}`)}&body=${encodeURIComponent(`${shareText}\n\n${giftLink}`)}`
      },
    },
    {
      name: 'SMS',
      icon: MessageCircle,
      onClick: () => {
        window.location.href = `sms:?body=${encodeURIComponent(`${shareText}\n\n${giftLink}`)}`
      },
    },
  ]

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `Gift: ${giftDetails.description}`,
        text: shareText,
        url: giftLink,
      })
    } catch (err) {
      // If native share fails or is not supported, show share options
      setShowShareOptions(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <Badge variant="success">Success</Badge>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Gift Link Created!
            </motion.span>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-600">
            Share this link with your friends to collect payments.
          </p>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border bg-white p-2 text-sm">
                {giftLink}
              </div>
              <Button onClick={handleCopyLink} variant="secondary" size="sm">
                {copied ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </motion.div>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={handleNativeShare} variant="secondary" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showShareOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-4 gap-2 overflow-hidden sm:grid-cols-7"
              >
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    onClick={option.onClick}
                    className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-colors hover:bg-gray-100 ${
                      option.active ? 'text-green-600' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <option.icon className="h-5 w-5" />
                    {option.name}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="my-4">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="w-full"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>

          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg border bg-white p-4">
                  <h3 className="text-lg font-semibold">{giftDetails.description}</h3>
                  <div className="mt-4">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-sm text-gray-600">Total Goal</p>
                      <p className="text-lg font-semibold">${giftDetails.amount}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="text-sm font-medium">$0/${giftDetails.amount} collected</p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-full w-0 rounded-full bg-blue-500 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={onClose}>
              Create Another Gift
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 