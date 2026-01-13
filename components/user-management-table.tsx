"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { Users } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/lib/schemas"
import { format } from "date-fns"

interface UserManagementTableProps {
  users: User[]
  onSelectUser: (userId: string) => void
}

export function UserManagementTable({ users, onSelectUser }: UserManagementTableProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM, yyyy")
    } catch {
      return dateString
    }
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

  if (users.length === 0) {
    return (
      <Empty className="border">
        <EmptyContent>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search or filters to find what you&apos;re looking for
            </EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-3">
      {selectedUserIds.size > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions ({selectedUserIds.size})</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
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

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={users.length > 0 && selectedUserIds.size === users.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell data-checkbox onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedUserIds.has(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium" onClick={() => onSelectUser(user.id)}>
                  {user.name}
                </TableCell>
                <TableCell onClick={() => onSelectUser(user.id)}>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell onClick={() => onSelectUser(user.id)}>{user.region}</TableCell>
                <TableCell onClick={() => onSelectUser(user.id)}>{user.preferredLanguage}</TableCell>
                <TableCell onClick={() => onSelectUser(user.id)}>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell onClick={() => onSelectUser(user.id)}>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
