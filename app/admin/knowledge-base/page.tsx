"use client"

import { Suspense } from "react"
import { KnowledgeBaseClient } from "@/components/knowledge-base-client"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"

function KnowledgeBaseContent() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Knowledge Base"
          description="Manage products and training documents with categories and preview"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Knowledge Base" }]}
        />
        <KnowledgeBaseClient role="admin" />
      </div>
    </AppLayout>
  )
}

export default function AdminKnowledgeBasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KnowledgeBaseContent />
    </Suspense>
  )
}
