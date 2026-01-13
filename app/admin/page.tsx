"use client"

import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Users, Package, FileText, Coins, MapPin, Video } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of system metrics and performance"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Users</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard title="Total Registered Trainers" value={156} icon={Users} />
            <StatCard title="Total Active Trainees" value={1248} icon={Users} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Content</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Total Products Available" value={24} icon={Package} />
            <StatCard title="Total Documents Uploaded" value={342} icon={FileText} />
            <StatCard title="Total Regions Covered" value={12} icon={MapPin} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">AI Usage</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard title="Total Tokens Used Per Day" value="2.4M" icon={Coins} />
            <StatCard title="Total Training Sessions Conducted" value={3567} icon={Video} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
