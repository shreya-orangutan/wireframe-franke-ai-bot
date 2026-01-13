"use client"

import { Suspense } from "react"
import { AdminUserManagementTable } from "@/components/admin-user-management-table"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"

function UserManagementContent() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="User Management"
          description="Manage trainers, trainees, and sub-admins with bulk actions and filters"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "User Management" }]}
        />
        <AdminUserManagementTable />
      </div>
    </AppLayout>
  )
}

export default function AdminUserManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserManagementContent />
    </Suspense>
  )
}
