"use client"

import { useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { startSession } from "@/lib/redux/slices/session-slice"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface StartSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSessionStarted: () => void
}

export function StartSessionModal({ open, onOpenChange, onSessionStarted }: StartSessionModalProps) {
  const products = useAppSelector((state) => state.product.products)
  const dispatch = useAppDispatch()
  const [selectedProductId, setSelectedProductId] = useState<string>("")

  const handleStartSession = () => {
    if (!selectedProductId) {
      alert("Please select a product")
      return
    }

    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return

    dispatch(startSession({ productId: product.id, productName: product.name }))
    setSelectedProductId("")
    onOpenChange(false)
    onSessionStarted()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Training Session</DialogTitle>
          <DialogDescription>Select a product to begin your training session with AI guidance.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Product</label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product to train on" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleStartSession} disabled={!selectedProductId} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Start Training Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
