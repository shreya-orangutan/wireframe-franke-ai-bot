"use client"

import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { useAppSelector } from "@/lib/redux/hooks"
import { Users, UserCheck, Package, Globe } from "lucide-react"

export default function SubAdminDashboardPage() {
  const users = useAppSelector((state) => state.user.users)
  const products = useAppSelector((state) => state.product.products)

  const totalTrainers = users.filter((u) => u.role === "Trainer").length
  const totalTrainees = users.filter((u) => u.role === "Trainee").length
  const uniqueRegions = new Set(users.map((u) => u.region))
  const totalRegions = uniqueRegions.size

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Manage users and monitor platform activity within your scope"
          breadcrumbs={[{ label: "Sub Admin", href: "/sub-admin" }, { label: "Dashboard" }]}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Trainers" value={totalTrainers} icon={UserCheck} />
          <StatCard title="Total Trainees" value={totalTrainees} icon={Users} />
          <StatCard title="Total Products" value={products.length} icon={Package} />
          <StatCard title="Total Regions" value={totalRegions} icon={Globe} />
        </div>
      </div>
    </AppLayout>
  )
}
