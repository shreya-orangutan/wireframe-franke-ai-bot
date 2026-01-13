"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppDispatch } from "@/lib/redux/hooks"
import { updateUser } from "@/lib/redux/slices/user-slice"
import type { User } from "@/lib/schemas"

interface UserDetailDrawerProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function UserDetailDrawer({ user, isOpen, onClose }: UserDetailDrawerProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState<User>(user)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setFormData(user)
  }, [user, isOpen])

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      dispatch(updateUser({ ...formData, updatedAt: new Date().toISOString() }))
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View and edit user information</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <div className="space-y-6 py-6 pr-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-muted-foreground">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password" className="text-muted-foreground">
                    Password
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactNumber" className="text-muted-foreground">
                    Contact Number
                  </Label>
                  <Input
                    id="edit-contactNumber"
                    value={formData.contactNumber}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Role and Assignment */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Role and Assignment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trainer">Trainer</SelectItem>
                      <SelectItem value="Trainee">Trainee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-userType">User Type</Label>
                  <Input
                    id="edit-userType"
                    value={formData.userType}
                    onChange={(e) => handleInputChange("userType", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-employeeCode">Employee Code</Label>
                  <Input
                    id="edit-employeeCode"
                    value={formData.employeeCode}
                    onChange={(e) => handleInputChange("employeeCode", e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-reportingManager">Reporting Manager</Label>
                  <Input
                    id="edit-reportingManager"
                    value={formData.reportingManager || ""}
                    onChange={(e) => handleInputChange("reportingManager", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Location and Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Location and Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-region">Region</Label>
                  <Input
                    id="edit-region"
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-preferredRegion">Preferred Region</Label>
                  <Input
                    id="edit-preferredRegion"
                    value={formData.preferredRegion}
                    onChange={(e) => handleInputChange("preferredRegion", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-preferredLanguage">Preferred Language</Label>
                  <Select
                    value={formData.preferredLanguage}
                    onValueChange={(value) => handleInputChange("preferredLanguage", value)}
                  >
                    <SelectTrigger id="edit-preferredLanguage">
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
                  <Label htmlFor="edit-preferredTheme">Preferred Theme</Label>
                  <Select
                    value={formData.preferredTheme}
                    onValueChange={(value) => handleInputChange("preferredTheme", value)}
                  >
                    <SelectTrigger id="edit-preferredTheme">
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

            {/* Status and Dates */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Status and Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-joiningDate" className="text-muted-foreground">
                    Joining Date
                  </Label>
                  <Input
                    id="edit-joiningDate"
                    type="date"
                    value={formData.joiningDate.split("T")[0]}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastLogin">Last Login</Label>
                  <Input
                    id="edit-lastLogin"
                    type="datetime-local"
                    value={formData.lastLogin ? formData.lastLogin.slice(0, 16) : ""}
                    onChange={(e) => handleInputChange("lastLogin", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-createdBy" className="text-muted-foreground">
                    Created By
                  </Label>
                  <Input
                    id="edit-createdBy"
                    value={formData.createdBy}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                  <Label htmlFor="edit-isActive" className="font-normal cursor-pointer">
                    Is Active
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-isLocked"
                    checked={formData.isLocked}
                    onCheckedChange={(checked) => handleInputChange("isLocked", checked)}
                  />
                  <Label htmlFor="edit-isLocked" className="font-normal cursor-pointer">
                    Is Locked
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-isUserVerified"
                    checked={formData.isUserVerified}
                    onCheckedChange={(checked) => handleInputChange("isUserVerified", checked)}
                  />
                  <Label htmlFor="edit-isUserVerified" className="font-normal cursor-pointer">
                    Is Verified
                  </Label>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-sm text-muted-foreground border-t pt-4">
              <p>Created At: {new Date(formData.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(formData.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 border-t px-6 py-4 bg-background">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
