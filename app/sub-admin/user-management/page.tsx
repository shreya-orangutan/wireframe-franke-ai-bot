"use client"

import { Suspense, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { filterUsers, setSelectedUser } from "@/lib/redux/slices/user-slice"
import { Plus, Search, Filter } from "lucide-react"
import { UserManagementTable } from "@/components/user-management-table"
import { UserDetailDrawer } from "@/components/user-detail-drawer"
import { AddUserModal } from "@/components/add-user-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"

function UserManagementContent() {
  const dispatch = useAppDispatch()
  const filteredUsers = useAppSelector((state) => state.user.filteredUsers)
  const selectedUser = useAppSelector((state) => state.user.selectedUser)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    dispatch(filterUsers(value))
  }

  const handleSelectUser = (userId: string) => {
    const user = filteredUsers.find((u) => u.id === userId)
    if (user) {
      dispatch(setSelectedUser(user))
    }
  }

  const displayedUsers = filteredUsers.filter((user) => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      if (user.isActive !== isActive) return false
    }
    if (dateRange?.from) {
      const userDate = new Date(user.createdAt)
      if (userDate < dateRange.from) return false
      if (dateRange.to) {
        const endOfDay = new Date(dateRange.to)
        endOfDay.setHours(23, 59, 59, 999)
        if (userDate > endOfDay) return false
      }
    }
    return true
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="User Management"
          description="Manage trainers and trainees with quick filters and search"
          breadcrumbs={[{ label: "Sub Admin", href: "/sub-admin" }, { label: "User Management" }]}
          actions={
            <Button onClick={() => setShowAddUserModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          }
        />

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[250px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or employee code..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="text-sm"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Trainer">Trainer</SelectItem>
              <SelectItem value="Trainee">Trainee</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker value={dateRange} onChange={setDateRange} placeholder="Filter by date" />
        </div>

        <UserManagementTable users={displayedUsers} onSelectUser={handleSelectUser} />

        {selectedUser && (
          <UserDetailDrawer
            user={selectedUser}
            isOpen={!!selectedUser}
            onClose={() => dispatch(setSelectedUser(null))}
            readOnly={true}
          />
        )}

        {showAddUserModal && <AddUserModal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} />}
      </div>
    </AppLayout>
  )
}

export default function UserManagementPage() {
  return (
    <Suspense fallback={null}>
      <UserManagementContent />
    </Suspense>
  )
}
