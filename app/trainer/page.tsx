"use client"

import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { useAppSelector } from "@/lib/redux/hooks"
import { Package, FileText, Globe, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadDocumentModal } from "@/components/upload-document-modal"
import { useState } from "react"

export default function TrainerDashboardPage() {
  const products = useAppSelector((state) => state.product.products)
  const documents = useAppSelector((state) => state.document.documents)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const uniqueRegions = new Set(products.map((p) => p.region))
  const totalRegions = uniqueRegions.size

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back to your training platform"
          breadcrumbs={[{ label: "Trainer", href: "/trainer" }, { label: "Dashboard" }]}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard title="Total Products" value={products.length} icon={Package} />
          <StatCard title="Total Documents Uploaded" value={documents.length} icon={FileText} />
          <StatCard title="Total Regions" value={totalRegions} icon={Globe} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used shortcuts to streamline your workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-1">
              <Button
                variant="outline"
                className="h-auto py-4 justify-start gap-3 bg-transparent"
                onClick={() => setUploadModalOpen(true)}
              >
                <Upload className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Upload Document</div>
                  <div className="text-xs text-muted-foreground">Add new training material</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <UploadDocumentModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </AppLayout>
  )
}
