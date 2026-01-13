"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Trash2, FileText, Plus } from "lucide-react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addProduct } from "@/lib/redux/slices/product-slice"
import { addDocument } from "@/lib/redux/slices/document-slice"
import { DocumentPurpose } from "@/lib/schemas"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Slash } from "lucide-react"
import { usePathname } from "next/navigation"

const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
})

type ProductFormData = z.infer<typeof productSchema>

interface DocumentUpload {
  purpose: string
  files: File[]
}

export function UploadDocumentModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"product" | "documents">("product")
  const [productData, setProductData] = useState<ProductFormData | null>(null)

  const [documentUploads, setDocumentUploads] = useState<DocumentUpload[]>([])
  const [currentPurpose, setCurrentPurpose] = useState<string>("")
  const [currentFiles, setCurrentFiles] = useState<File[]>([])
  const [usedPurposes, setUsedPurposes] = useState<Set<string>>(new Set())

  const dispatch = useAppDispatch()
  const pathname = usePathname()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  const onProductSubmit = (data: ProductFormData) => {
    setProductData(data)
    setStep("documents")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // Validate file types
      for (const file of filesArray) {
        if (
          !["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
            file.type,
          )
        ) {
          alert("Only PDF and DOCX files are allowed")
          return
        }
      }

      if (filesArray.length > 10) {
        alert("Maximum 10 documents per purpose")
        return
      }

      setCurrentFiles(filesArray)
    }
  }

  const removeFile = (index: number) => {
    setCurrentFiles(currentFiles.filter((_, i) => i !== index))
  }

  const addDocumentsForPurpose = () => {
    if (!currentPurpose) {
      alert("Please select a purpose")
      return
    }

    if (currentFiles.length === 0) {
      alert("Please select at least one document")
      return
    }

    documentUploads.push({
      purpose: currentPurpose,
      files: currentFiles,
    })

    setDocumentUploads([...documentUploads])
    setUsedPurposes(new Set([...usedPurposes, currentPurpose]))

    // Reset for next purpose
    setCurrentPurpose("")
    setCurrentFiles([])
  }

  const removePurposeUpload = (index: number) => {
    const removed = documentUploads[index]
    setDocumentUploads(documentUploads.filter((_, i) => i !== index))

    // Remove from used purposes
    const newUsed = new Set(usedPurposes)
    newUsed.delete(removed.purpose)
    setUsedPurposes(newUsed)
  }

  const finalSubmit = () => {
    if (!productData) return

    if (documentUploads.length === 0) {
      alert("Please add at least one document purpose")
      return
    }

    // Create product
    const productId = `p${Date.now()}`
    const newProduct = {
      id: productId,
      name: productData.productName,
      description: productData.description,
      country: productData.country,
      region: productData.region,
      createdAt: new Date().toISOString(),
    }

    dispatch(addProduct(newProduct))

    // Add all documents
    documentUploads.forEach((upload) => {
      upload.files.forEach((file, i) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase()
        const newDocument = {
          id: `d${Date.now()}_${upload.purpose}_${i}`,
          productId,
          name: file.name,
          purpose: upload.purpose as any,
          fileType: (fileExtension === "pdf" ? "pdf" : "docx") as "pdf" | "docx",
          uploadedAt: new Date().toISOString(),
        }
        dispatch(addDocument(newDocument))
      })
    })

    // Reset everything
    reset()
    setStep("product")
    setProductData(null)
    setDocumentUploads([])
    setCurrentPurpose("")
    setCurrentFiles([])
    setUsedPurposes(new Set())
    setOpen(false)
  }

  const handleCancel = () => {
    reset()
    setStep("product")
    setProductData(null)
    setDocumentUploads([])
    setCurrentPurpose("")
    setCurrentFiles([])
    setUsedPurposes(new Set())
    setOpen(false)
  }

  const availablePurposes = Object.entries(DocumentPurpose).filter(([_, value]) => !usedPurposes.has(value))

  const getBreadcrumbs = () => {
    if (pathname.includes("/admin")) {
      return (
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/knowledge-base">Knowledge Base</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Upload Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
    }
    if (pathname.includes("/trainer")) {
      return (
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/trainer">Trainer</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/trainer/knowledge-base">Knowledge Base</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Upload Document</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
    }
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {getBreadcrumbs()}
          <DialogTitle>{step === "product" ? "Upload Product Documents" : "Add Documents by Purpose"}</DialogTitle>
          <DialogDescription>
            {step === "product"
              ? "Add a new product information"
              : "Choose purpose first, then upload all documents for that purpose"}
          </DialogDescription>
        </DialogHeader>

        {step === "product" ? (
          <form onSubmit={handleSubmit(onProductSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" {...register("productName")} placeholder="Enter product name" />
              {errors.productName && <p className="text-sm text-destructive">{errors.productName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter product description"
                rows={3}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} placeholder="Enter country" />
                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" {...register("region")} placeholder="Enter region" />
                {errors.region && <p className="text-sm text-destructive">{errors.region.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Next: Add Documents</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {documentUploads.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Added Documents</h3>
                {documentUploads.map((upload, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="capitalize">{upload.purpose}</Badge>
                          <span className="text-sm text-muted-foreground">{upload.files.length} documents</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removePurposeUpload(idx)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {upload.files.map((file, fileIdx) => (
                          <div key={fileIdx} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {availablePurposes.length > 0 ? (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <h3 className="font-semibold">{documentUploads.length > 0 ? "Add More Documents" : "Add Documents"}</h3>

                <div className="space-y-2">
                  <Label htmlFor="purpose">1. Choose Document Purpose</Label>
                  <Select value={currentPurpose} onValueChange={setCurrentPurpose}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePurposes.map(([key, value]) => (
                        <SelectItem key={value} value={value} className="capitalize">
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentPurpose && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="files">2. Upload Documents (PDF/DOCX only, max 10)</Label>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </div>

                    {currentFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Documents ({currentFiles.length}/10)</Label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {currentFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2 rounded border bg-background"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeFile(idx)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button onClick={addDocumentsForPurpose} disabled={currentFiles.length === 0}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add These Documents
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All purposes have been used.</p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={finalSubmit} disabled={documentUploads.length === 0}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Product & Documents
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
