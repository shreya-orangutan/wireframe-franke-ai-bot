"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Trash2, FileText, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { addDocument, deleteDocument } from "@/lib/redux/slices/document-slice"
import { DocumentPurpose } from "@/lib/schemas"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DocumentViewerModal } from "@/components/document-viewer-modal"
import { usePathname } from "next/navigation"

export function ProductDetailsClient({
  productId,
  onProductLoad,
}: {
  productId: string
  onProductLoad?: (productName: string) => void
}) {
  const products = useAppSelector((state) => state.product.products)
  const documents = useAppSelector((state) => state.document.documents)
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  const product = products.find((p) => p.id === productId)
  const productDocs = documents.filter((doc) => doc.productId === productId)

  const [uploadFiles, setUploadFiles] = useState<Record<string, FileList | null>>({})
  const [selectedDocs, setSelectedDocs] = useState<Record<string, Set<string>>>({})
  const [viewerDoc, setViewerDoc] = useState<{ name: string; type: "pdf" | "docx" } | null>(null)
  const [uploadKey, setUploadKey] = useState<Record<string, number>>({})

  useEffect(() => {
    if (product && onProductLoad) {
      onProductLoad(product.name)
    }
  }, [product, onProductLoad])

  const getBackLink = () => {
    if (pathname.includes("/admin")) {
      return "/admin/knowledge-base"
    }
    if (pathname.includes("/sub-admin")) {
      return "/sub-admin/knowledge-base"
    }
    if (pathname.includes("/trainer")) {
      return "/trainer/knowledge-base"
    }
    return "/knowledge-base"
  }

  const handleBackClick = () => {
    router.push(getBackLink())
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Knowledge Base
        </Button>
        <p>Product not found</p>
      </div>
    )
  }

  const groupedDocuments = productDocs.reduce(
    (acc, doc) => {
      if (!acc[doc.purpose]) {
        acc[doc.purpose] = []
      }
      acc[doc.purpose].push(doc)
      return acc
    },
    {} as Record<string, typeof productDocs>,
  )

  const handleUpload = (purpose: string) => {
    const files = uploadFiles[purpose]

    if (!files || files.length === 0) {
      alert("Please select at least one file")
      return
    }

    const currentPurposeDocs = productDocs.filter((doc) => doc.purpose === purpose)

    if (currentPurposeDocs.length + files.length > 10) {
      alert("Maximum 10 documents per purpose. Cannot upload more.")
      return
    }

    // Validate file types
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (
        !["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
          file.type,
        )
      ) {
        alert("Only PDF and DOCX files are allowed")
        return
      }
    }

    // Add documents
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExtension = file.name.split(".").pop()?.toLowerCase()
      const newDocument = {
        id: `d${Date.now()}_${i}`,
        productId: productId,
        name: file.name,
        purpose: purpose as any,
        fileType: (fileExtension === "pdf" ? "pdf" : "docx") as "pdf" | "docx",
        uploadedAt: new Date().toISOString(),
      }
      dispatch(addDocument(newDocument))
    }

    setUploadFiles({ ...uploadFiles, [purpose]: null })
    setUploadKey({ ...uploadKey, [purpose]: (uploadKey[purpose] || 0) + 1 })
  }

  const handleDelete = (docId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      dispatch(deleteDocument(docId))
    }
  }

  const toggleDocSelection = (purpose: string, docId: string) => {
    const currentSelection = selectedDocs[purpose] || new Set()
    const newSelection = new Set(currentSelection)

    if (newSelection.has(docId)) {
      newSelection.delete(docId)
    } else {
      newSelection.add(docId)
    }

    setSelectedDocs({ ...selectedDocs, [purpose]: newSelection })
  }

  const toggleSelectAll = (purpose: string) => {
    const docs = groupedDocuments[purpose] || []
    const currentSelection = selectedDocs[purpose] || new Set()

    if (currentSelection.size === docs.length) {
      setSelectedDocs({ ...selectedDocs, [purpose]: new Set() })
    } else {
      setSelectedDocs({ ...selectedDocs, [purpose]: new Set(docs.map((d) => d.id)) })
    }
  }

  const handleDeleteSelected = (purpose: string) => {
    const selected = selectedDocs[purpose]
    if (!selected || selected.size === 0) {
      alert("Please select documents to delete")
      return
    }

    if (confirm(`Are you sure you want to delete ${selected.size} document(s)?`)) {
      selected.forEach((docId) => {
        dispatch(deleteDocument(docId))
      })
      setSelectedDocs({ ...selectedDocs, [purpose]: new Set() })
    }
  }

  const canUploadMore = (purpose: string) => {
    const purposeDocs = productDocs.filter((doc) => doc.purpose === purpose)
    return purposeDocs.length < 10
  }

  const handleViewDocument = (doc: { name: string; type: "pdf" | "docx" }) => {
    setViewerDoc(doc)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Product Name</Label>
              <p className="font-medium">{product.name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Date Created</Label>
              <p className="font-medium">
                {new Date(product.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Country</Label>
              <p className="font-medium">{product.country}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Region</Label>
              <p className="font-medium">{product.region}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Description</Label>
            <p className="font-medium">{product.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Documents by Purpose</h2>

        {Object.keys(DocumentPurpose).length > 0 ? (
          Object.entries(DocumentPurpose).map(([key, purpose]) => {
            const docs = groupedDocuments[purpose] || []
            const selected = selectedDocs[purpose] || new Set()

            return (
              <Card key={purpose}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">{purpose}</CardTitle>
                    <Badge variant="secondary">{docs.length} / 10 documents</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
                    <Label>Upload Documents (PDF/DOCX only)</Label>
                    <div className="flex gap-2">
                      <Input
                        key={uploadKey[purpose] || 0}
                        type="file"
                        multiple
                        accept=".pdf,.docx"
                        onChange={(e) => setUploadFiles({ ...uploadFiles, [purpose]: e.target.files })}
                        className="cursor-pointer flex-1"
                        disabled={!canUploadMore(purpose)}
                      />
                      <Button onClick={() => handleUpload(purpose)} disabled={!canUploadMore(purpose)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                    {!canUploadMore(purpose) && (
                      <Alert>
                        <AlertDescription>Maximum limit of 10 documents reached for this purpose.</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {docs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`select-all-${purpose}`}
                          checked={selected.size === docs.length && docs.length > 0}
                          onCheckedChange={() => toggleSelectAll(purpose)}
                        />
                        <Label htmlFor={`select-all-${purpose}`} className="text-sm cursor-pointer">
                          Select All
                        </Label>
                      </div>
                      {selected.size > 0 && (
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSelected(purpose)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Selected ({selected.size})
                        </Button>
                      )}
                    </div>
                  )}

                  {docs.length > 0 ? (
                    <div className="space-y-2">
                      {docs.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50">
                          <Checkbox
                            checked={selected.has(doc.id)}
                            onCheckedChange={() => toggleDocSelection(purpose, doc.id)}
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded{" "}
                                {new Date(doc.uploadedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDocument({ name: doc.name, type: doc.fileType })}
                            >
                              <Eye className="h-4 w-4 text-primary" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No documents uploaded for this purpose yet.</p>
                  )}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <p className="text-muted-foreground">No document purposes available.</p>
        )}
      </div>

      {viewerDoc && (
        <DocumentViewerModal
          isOpen={!!viewerDoc}
          onClose={() => setViewerDoc(null)}
          documentName={viewerDoc.name}
          documentType={viewerDoc.type}
        />
      )}
    </div>
  )
}
