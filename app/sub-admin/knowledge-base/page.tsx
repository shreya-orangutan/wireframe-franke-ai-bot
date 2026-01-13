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
          description="Browse products and training documents"
          breadcrumbs={[{ label: "Sub Admin", href: "/sub-admin" }, { label: "Knowledge Base" }]}
        />
        <KnowledgeBaseClient role="sub-admin" />
      </div>
    </AppLayout>
  )
}

export default function SubAdminKnowledgeBasePage() {
  return (
    <Suspense fallback={null}>
      <KnowledgeBaseContent />
    </Suspense>
  )
}
