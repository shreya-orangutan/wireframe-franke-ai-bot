"use client"

import type React from "react"
import { useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { filterUsers, setSelectedUser } from "@/lib/redux/slices/user-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { UserDetailDrawer } from "@/components/user-detail-drawer"
import { AdminAddUserModal } from "@/components/admin-add-user-modal"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"

type SortField = "name" | "role" | "region" | "preferredLanguage" | "status" | "createdAt"
type SortDirection = "asc" | "desc" | null

export function AdminUserManagementTable() {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.user.filteredUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    dispatch(filterUsers(query))
  }

  const handleRowClick = (userId: string, event: React.MouseEvent) => {
    // Prevent opening drawer when clicking checkbox
    if ((event.target as HTMLElement).closest("[data-checkbox]")) {
      return
    }
    setSelectedUserId(userId)
    const user = users.find((u) => u.id === userId)
    if (user) {
      dispatch(setSelectedUser(user))
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-3 w-3 ml-1 opacity-40" />
    }
    if (sortDirection === "asc") {
      return <ChevronUp className="h-3 w-3 ml-1" />
    }
    return <ChevronDown className="h-3 w-3 ml-1" />
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(new Set(users.map((u) => u.id)))
    } else {
      setSelectedUserIds(new Set())
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelection = new Set(selectedUserIds)
    if (checked) {
      newSelection.add(userId)
    } else {
      newSelection.delete(userId)
    }
    setSelectedUserIds(newSelection)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for users:`, Array.from(selectedUserIds))
    // TODO: Implement bulk actions
    setSelectedUserIds(new Set())
  }

  const selectedUser = users.find((user) => user.id === selectedUserId)

  const filteredUsers = users
    .filter((user) => {
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
    .sort((a, b) => {
      if (!sortField || !sortDirection) return 0

      let aVal: any = a[sortField as keyof typeof a]
      let bVal: any = b[sortField as keyof typeof b]

      if (sortField === "status") {
        aVal = a.isActive ? "Active" : "Inactive"
        bVal = b.isActive ? "Active" : "Inactive"
      }

      if (sortField === "createdAt") {
        aVal = new Date(a.createdAt).getTime()
        bVal = new Date(b.createdAt).getTime()
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users</CardTitle>
            <Button onClick={() => setAddUserOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or employee code..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-md pl-9"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Sub-Admin">Sub-Admin</SelectItem>
                <SelectItem value="Trainer">Trainer</SelectItem>
                <SelectItem value="Trainee">Trainee</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <DateRangePicker value={dateRange} onChange={setDateRange} placeholder="Date Range" />

            {selectedUserIds.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Actions ({selectedUserIds.size})</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkAction("activate")}>Activate Users</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("deactivate")}>Deactivate Users</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkAction("delete")} className="text-destructive">
                    Delete Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={users.length > 0 && selectedUserIds.size === users.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Name
                      <SortIcon field="name" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("role")}>
                    <div className="flex items-center">
                      Role
                      <SortIcon field="role" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("region")}>
                    <div className="flex items-center">
                      Region
                      <SortIcon field="region" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("preferredLanguage")}>
                    <div className="flex items-center">
                      Preferred Language
                      <SortIcon field="preferredLanguage" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center">
                      Date Created
                      <SortIcon field="createdAt" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={(e) => handleRowClick(user.id, e)}
                    >
                      <TableCell data-checkbox onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedUserIds.has(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                          aria-label={`Select ${user.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.region}</TableCell>
                      <TableCell>{user.preferredLanguage}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserDetailDrawer user={selectedUser} isOpen={!!selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}

      <AdminAddUserModal open={addUserOpen} onOpenChange={setAddUserOpen} />
    </>
  )
}
