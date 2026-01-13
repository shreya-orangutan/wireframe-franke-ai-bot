"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText } from "lucide-react"

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  documentName: string
  documentType: "pdf" | "docx"
}

export function DocumentViewerModal({ isOpen, onClose, documentName, documentType }: DocumentViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {documentName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="text-center space-y-2">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Document viewer</p>
            <p className="text-xs text-muted-foreground">Preview for {documentType.toUpperCase()} files</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
