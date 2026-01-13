"use client"

import { useState } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addUser } from "@/lib/redux/slices/user-slice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Slash } from "lucide-react"

interface AdminAddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminAddUserModal({ open, onOpenChange }: AdminAddUserModalProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    contactNumber: "",
    employeeCode: "",
    role: "Trainer" as "Trainer" | "Trainee" | "Sub-Admin",
    region: "",
    preferredRegion: "",
    language: "English" as "English" | "Hindi" | "Kannada" | "Bengali",
    preferredLanguage: "English" as "English" | "Hindi" | "Kannada" | "Bengali",
    uiLanguage: "English" as "English" | "Hindi" | "Kannada" | "Bengali",
    preferredTheme: "light" as "light" | "dark",
    department: "",
    reportingManager: "",
    joiningDate: "",
    isActive: true,
    isUserVerified: false,
    isLocked: false,
  })

  const handleSubmit = () => {
    const newUser = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: undefined,
      password: "",
      userType: "",
    }
    dispatch(addUser(newUser))
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      email: "",
      country: "",
      contactNumber: "",
      employeeCode: "",
      role: "Trainer",
      region: "",
      preferredRegion: "",
      language: "English",
      preferredLanguage: "English",
      uiLanguage: "English",
      preferredTheme: "light",
      department: "",
      reportingManager: "",
      joiningDate: "",
      isActive: true,
      isUserVerified: false,
      isLocked: false,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 w-[95vw] sm:w-full">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/user-management">User Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Add New User</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Create a new user account with role and permissions</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] px-4 sm:px-6">
          <div className="space-y-6 py-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCode">Employee ID</Label>
                <Input
                  id="employeeCode"
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trainer">Trainer</SelectItem>
                    <SelectItem value="Trainee">Trainee</SelectItem>
                    <SelectItem value="Sub-Admin">Sub-Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredRegion">Preferred Region</Label>
                <Input
                  id="preferredRegion"
                  value={formData.preferredRegion}
                  onChange={(e) => setFormData({ ...formData, preferredRegion: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value: any) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value: any) => setFormData({ ...formData, preferredLanguage: value })}
                >
                  <SelectTrigger id="preferredLanguage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="uiLanguage">UI Language</Label>
                <Select
                  value={formData.uiLanguage}
                  onValueChange={(value: any) => setFormData({ ...formData, uiLanguage: value })}
                >
                  <SelectTrigger id="uiLanguage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTheme">Preferred Theme</Label>
                <Select
                  value={formData.preferredTheme}
                  onValueChange={(value: any) => setFormData({ ...formData, preferredTheme: value })}
                >
                  <SelectTrigger id="preferredTheme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportingManager">Reporting Manager</Label>
                <Select
                  value={formData.reportingManager}
                  onValueChange={(value) => setFormData({ ...formData, reportingManager: value })}
                >
                  <SelectTrigger id="reportingManager">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Brown">Michael Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                  Active
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isUserVerified"
                  checked={formData.isUserVerified}
                  onCheckedChange={(checked) => setFormData({ ...formData, isUserVerified: checked as boolean })}
                />
                <Label htmlFor="isUserVerified" className="text-sm font-normal cursor-pointer">
                  Verified
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isLocked"
                  checked={formData.isLocked}
                  onCheckedChange={(checked) => setFormData({ ...formData, isLocked: checked as boolean })}
                />
                <Label htmlFor="isLocked" className="text-sm font-normal cursor-pointer">
                  Locked
                </Label>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
