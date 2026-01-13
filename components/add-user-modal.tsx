"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addUser } from "@/lib/redux/slices/user-slice"
import type { User } from "@/lib/schemas"
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

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

const initialFormData = {
  id: "",
  name: "",
  email: "",
  password: "",
  role: "Trainee" as const,
  contactNumber: "",
  country: "India",
  region: "",
  preferredLanguage: "English" as const,
  preferredRegion: "",
  preferredTheme: "light" as const,
  department: "",
  employeeCode: "",
  userType: "Full-time",
  reportingManager: "",
  joiningDate: new Date().toISOString().split("T")[0],
  isActive: true,
  isLocked: false,
  isUserVerified: false,
  createdBy: "Admin",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLogin: undefined,
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.region) {
      alert("Please fill all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newUser: User = {
        ...formData,
        id: `u${Date.now()}`,
      }

      dispatch(addUser(newUser))
      setFormData(initialFormData)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const regions = ["Tamil Nadu", "Gujarat", "Karnataka", "West Bengal", "Maharashtra", "Delhi", "Bangalore"]
  const languages = ["English", "Hindi", "Kannada", "Bengali"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col gap-0 p-0 w-[95vw] sm:w-full">
        <DialogHeader className="px-6 pt-6 pb-4">
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/sub-admin">Sub-Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/sub-admin/user-management">User Management</BreadcrumbLink>
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
          <DialogDescription>Create a new user account with all required information</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-180px)] px-4 sm:px-6">
          <div className="space-y-6 pr-2 sm:pr-4 pb-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="add-name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="add-email"
                    type="email"
                    placeholder="user@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="add-password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-contactNumber">Contact Number</Label>
                  <Input
                    id="add-contactNumber"
                    placeholder="+91-9876543210"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Role and Assignment */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Role and Assignment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-role">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger id="add-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trainer">Trainer</SelectItem>
                      <SelectItem value="Trainee">Trainee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-userType">User Type</Label>
                  <Input
                    id="add-userType"
                    placeholder="Full-time / Part-time"
                    value={formData.userType}
                    onChange={(e) => handleInputChange("userType", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-department">Department</Label>
                  <Input
                    id="add-department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-employeeCode">
                    Employee Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="add-employeeCode"
                    placeholder="EMP001"
                    value={formData.employeeCode}
                    onChange={(e) => handleInputChange("employeeCode", e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="add-reportingManager">Reporting Manager</Label>
                  <Input
                    id="add-reportingManager"
                    placeholder="Manager name"
                    value={formData.reportingManager}
                    onChange={(e) => handleInputChange("reportingManager", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Location and Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Location and Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-country">Country</Label>
                  <Input
                    id="add-country"
                    placeholder="India"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-region">
                    Region <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger id="add-region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-preferredRegion">Preferred Region</Label>
                  <Select
                    value={formData.preferredRegion}
                    onValueChange={(value) => handleInputChange("preferredRegion", value)}
                  >
                    <SelectTrigger id="add-preferredRegion">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-preferredLanguage">Preferred Language</Label>
                  <Select
                    value={formData.preferredLanguage}
                    onValueChange={(value) => handleInputChange("preferredLanguage", value)}
                  >
                    <SelectTrigger id="add-preferredLanguage">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-preferredTheme">Preferred Theme</Label>
                  <Select
                    value={formData.preferredTheme}
                    onValueChange={(value) => handleInputChange("preferredTheme", value)}
                  >
                    <SelectTrigger id="add-preferredTheme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Dates and Status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Dates and Status</h3>
              <div className="space-y-2">
                <Label htmlFor="add-joiningDate">Joining Date</Label>
                <Input
                  id="add-joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="add-isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                  <Label htmlFor="add-isActive" className="font-normal cursor-pointer">
                    Is Active
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="add-isUserVerified"
                    checked={formData.isUserVerified}
                    onCheckedChange={(checked) => handleInputChange("isUserVerified", checked)}
                  />
                  <Label htmlFor="add-isUserVerified" className="font-normal cursor-pointer">
                    Is Verified
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 border-t px-6 py-4 bg-background">
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
