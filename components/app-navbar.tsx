"use client"

import { User, Sparkles, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/redux/hooks"
import { usePathname, useRouter } from "next/navigation"

export function AppNavbar() {
  const { userProfile } = useAppSelector((state) => state.uiPreferences)
  const pathname = usePathname()
  const router = useRouter()

  const isTrainee = pathname.startsWith("/trainee")
  const rolePrefix = isTrainee ? "/trainee" : "/trainer"

  const showAIAssistantButton =
    pathname === rolePrefix || pathname === `${rolePrefix}/knowledge-base` || pathname === `${rolePrefix}/settings`

  // Mock notification count
  const notificationCount = 3

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b bg-background px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex flex-1 items-center gap-4">
          {showAIAssistantButton && (
            <Button onClick={() => router.push(`${rolePrefix}/ai-assistant`)} className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium text-sm">New document uploaded</span>
                <span className="text-xs text-muted-foreground">Product X - Technical Specs added</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium text-sm">Training session completed</span>
                <span className="text-xs text-muted-foreground">Session #1234 marked as complete</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium text-sm">System update available</span>
                <span className="text-xs text-muted-foreground">New features in AI Assistant</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">View all notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userProfile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{userProfile.fullName}</span>
                  <span className="text-xs text-muted-foreground">{userProfile.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
