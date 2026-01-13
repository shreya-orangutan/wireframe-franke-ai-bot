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
          description="Manage products and training documents with categories and tags"
          breadcrumbs={[{ label: "Trainer", href: "/trainer" }, { label: "Knowledge Base" }]}
        />
        <KnowledgeBaseClient role="trainer" />
      </div>
    </AppLayout>
  )
}

export default function TrainerKnowledgeBasePage() {
  return (
    <Suspense fallback={null}>
      <KnowledgeBaseContent />
    </Suspense>
  )
}
