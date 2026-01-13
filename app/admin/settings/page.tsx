"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { updatePreferences } from "@/lib/redux/slices/ui-preferences-slice"

export default function AdminSettingsPage() {
  const { userProfile, preferences } = useAppSelector((state) => state.uiPreferences)
  const dispatch = useAppDispatch()

  const [profileData, setProfileData] = useState({
    fullName: userProfile.fullName,
    email: userProfile.email,
    assignedCountry: userProfile.assignedCountry,
    assignedRegion: userProfile.assignedRegion,
  })

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // System Configuration States
  const [aiConfig, setAiConfig] = useState({
    modelVersion: "gpt-4",
    maxTokens: "2000",
    temperature: "0.7",
    apiEndpoint: "https://api.openai.com/v1",
  })

  const [documentRules, setDocumentRules] = useState({
    maxFileSize: "10",
    allowedFormats: "pdf,docx",
    autoProcessing: true,
    retentionDays: "90",
  })

  const [trainerRules, setTrainerRules] = useState({
    maxUploadsPerDay: "50",
    requireApproval: false,
    allowBulkUpload: true,
    sessionTimeout: "60",
  })

  const [traineeRules, setTraineeRules] = useState({
    maxSessionsPerDay: "10",
    mandatoryVideoWatch: true,
    allowChatHistory: true,
    sessionExpiry: "30",
  })

  const handleSaveProfile = () => {
    alert("Profile updated successfully")
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match")
      return
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters")
      return
    }
    alert("Password changed successfully")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    dispatch(updatePreferences({ [key]: value }))
  }

  const handleSaveSystemConfig = (section: string) => {
    alert(`${section} configuration saved successfully`)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage account and system configuration"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="system">System Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={userProfile.role} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Joining</Label>
                    <Input
                      value={new Date(userProfile.dateJoined).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedCountry">Assigned Country</Label>
                    <Input
                      id="assignedCountry"
                      value={profileData.assignedCountry}
                      onChange={(e) => setProfileData({ ...profileData, assignedCountry: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedRegion">Assigned Region</Label>
                    <Input
                      id="assignedRegion"
                      value={profileData.assignedRegion}
                      onChange={(e) => setProfileData({ ...profileData, assignedRegion: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <Input
                    value={new Date(userProfile.lastLogin).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    disabled
                  />
                </div>

                <Button onClick={handleSaveProfile}>Save Profile</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleChangePassword}>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Language Settings</CardTitle>
                <CardDescription>Configure your language preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="uiLanguage">App Language</Label>
                    <Select
                      value={preferences.uiLanguage}
                      onValueChange={(value) => handlePreferenceChange("uiLanguage", value)}
                    >
                      <SelectTrigger id="uiLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chatbotLanguage">Preferred Language</Label>
                    <Select
                      value={preferences.chatbotLanguage}
                      onValueChange={(value) => handlePreferenceChange("chatbotLanguage", value)}
                    >
                      <SelectTrigger id="chatbotLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange("theme", value)}>
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about training sessions and messages
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange("notifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>Configure AI model and API settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="modelVersion">Model Version</Label>
                    <Select
                      value={aiConfig.modelVersion}
                      onValueChange={(value) => setAiConfig({ ...aiConfig, modelVersion: value })}
                    >
                      <SelectTrigger id="modelVersion">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={aiConfig.maxTokens}
                      onChange={(e) => setAiConfig({ ...aiConfig, maxTokens: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={aiConfig.temperature}
                      onChange={(e) => setAiConfig({ ...aiConfig, temperature: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input
                      id="apiEndpoint"
                      value={aiConfig.apiEndpoint}
                      onChange={(e) => setAiConfig({ ...aiConfig, apiEndpoint: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSaveSystemConfig("AI Configuration")}>Save AI Configuration</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Rules</CardTitle>
                <CardDescription>Configure document upload and processing rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={documentRules.maxFileSize}
                      onChange={(e) => setDocumentRules({ ...documentRules, maxFileSize: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allowedFormats">Allowed Formats</Label>
                    <Input
                      id="allowedFormats"
                      value={documentRules.allowedFormats}
                      onChange={(e) => setDocumentRules({ ...documentRules, allowedFormats: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retentionDays">Retention Period (Days)</Label>
                    <Input
                      id="retentionDays"
                      type="number"
                      value={documentRules.retentionDays}
                      onChange={(e) => setDocumentRules({ ...documentRules, retentionDays: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="autoProcessing"
                      checked={documentRules.autoProcessing}
                      onCheckedChange={(checked) =>
                        setDocumentRules({ ...documentRules, autoProcessing: checked as boolean })
                      }
                    />
                    <Label htmlFor="autoProcessing">Auto Processing</Label>
                  </div>
                </div>
                <Button onClick={() => handleSaveSystemConfig("Document Rules")}>Save Document Rules</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trainer Rules</CardTitle>
                <CardDescription>Configure trainer permissions and limitations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxUploadsPerDay">Max Uploads Per Day</Label>
                    <Input
                      id="maxUploadsPerDay"
                      type="number"
                      value={trainerRules.maxUploadsPerDay}
                      onChange={(e) => setTrainerRules({ ...trainerRules, maxUploadsPerDay: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={trainerRules.sessionTimeout}
                      onChange={(e) => setTrainerRules({ ...trainerRules, sessionTimeout: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireApproval"
                      checked={trainerRules.requireApproval}
                      onCheckedChange={(checked) =>
                        setTrainerRules({ ...trainerRules, requireApproval: checked as boolean })
                      }
                    />
                    <Label htmlFor="requireApproval">Require Approval</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowBulkUpload"
                      checked={trainerRules.allowBulkUpload}
                      onCheckedChange={(checked) =>
                        setTrainerRules({ ...trainerRules, allowBulkUpload: checked as boolean })
                      }
                    />
                    <Label htmlFor="allowBulkUpload">Allow Bulk Upload</Label>
                  </div>
                </div>
                <Button onClick={() => handleSaveSystemConfig("Trainer Rules")}>Save Trainer Rules</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trainee Rules</CardTitle>
                <CardDescription>Configure trainee access and session policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxSessionsPerDay">Max Sessions Per Day</Label>
                    <Input
                      id="maxSessionsPerDay"
                      type="number"
                      value={traineeRules.maxSessionsPerDay}
                      onChange={(e) => setTraineeRules({ ...traineeRules, maxSessionsPerDay: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionExpiry">Session Expiry (Days)</Label>
                    <Input
                      id="sessionExpiry"
                      type="number"
                      value={traineeRules.sessionExpiry}
                      onChange={(e) => setTraineeRules({ ...traineeRules, sessionExpiry: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="mandatoryVideoWatch"
                      checked={traineeRules.mandatoryVideoWatch}
                      onCheckedChange={(checked) =>
                        setTraineeRules({ ...traineeRules, mandatoryVideoWatch: checked as boolean })
                      }
                    />
                    <Label htmlFor="mandatoryVideoWatch">Mandatory Video Watch</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowChatHistory"
                      checked={traineeRules.allowChatHistory}
                      onCheckedChange={(checked) =>
                        setTraineeRules({ ...traineeRules, allowChatHistory: checked as boolean })
                      }
                    />
                    <Label htmlFor="allowChatHistory">Allow Chat History</Label>
                  </div>
                </div>
                <Button onClick={() => handleSaveSystemConfig("Trainee Rules")}>Save Trainee Rules</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
