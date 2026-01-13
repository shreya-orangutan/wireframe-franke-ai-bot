import { Suspense } from "react"
import { KnowledgeBaseClient } from "@/components/knowledge-base-client"

export default function KnowledgeBasePage() {
  return (
    <Suspense fallback={null}>
      <KnowledgeBaseClient />
    </Suspense>
  )
}
