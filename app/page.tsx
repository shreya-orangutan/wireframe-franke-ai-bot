"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { StatCard } from "@/components/stat-card"
import { useAppSelector } from "@/lib/redux/hooks"
import { Package, FileText, Globe } from "lucide-react"

export default function RootPage() {
  const router = useRouter()
  const products = useAppSelector((state) => state.product.products)
  const documents = useAppSelector((state) => state.document.documents)

  useEffect(() => {
    // In a real app, check user role from Redux/session and redirect accordingly
    // For now, default to trainer
    router.replace("/trainer")
  }, [router])

  // Calculate unique regions
  const uniqueRegions = new Set(products.map((p) => p.region))
  const totalRegions = uniqueRegions.size

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your training platform</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard title="Total Products" value={products.length} icon={Package} />
          <StatCard title="Total Documents Uploaded" value={documents.length} icon={FileText} />
          <StatCard title="Total Regions" value={totalRegions} icon={Globe} />
        </div>
      </div>
    </AppLayout>
  )
}
