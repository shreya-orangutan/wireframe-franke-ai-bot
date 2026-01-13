"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Bot, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const trainerNavItems = [
  {
    title: "Dashboard",
    href: "/trainer",
    icon: LayoutDashboard,
  },
  {
    title: "Knowledge Base",
    href: "/trainer/knowledge-base",
    icon: BookOpen,
  },
  {
    title: "AI Assistant",
    href: "/trainer/ai-assistant",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/trainer/settings",
    icon: Settings,
  },
]

const traineeNavItems = [
  {
    title: "Dashboard",
    href: "/trainee",
    icon: LayoutDashboard,
  },
  {
    title: "AI Assistant",
    href: "/trainee/ai-assistant",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/trainee/settings",
    icon: Settings,
  },
]

const subAdminNavItems = [
  {
    title: "Dashboard",
    href: "/sub-admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/sub-admin/user-management",
    icon: Users,
  },
  {
    title: "Knowledge Base",
    href: "/sub-admin/knowledge-base",
    icon: BookOpen,
  },
  {
    title: "AI Assistant",
    href: "/sub-admin/ai-assistant",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/sub-admin/settings",
    icon: Settings,
  },
]

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/user-management",
    icon: Users,
  },
  {
    title: "Knowledge Base",
    href: "/admin/knowledge-base",
    icon: BookOpen,
  },
  {
    title: "AI Assistant",
    href: "/admin/ai-assistant",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isAdmin = pathname.startsWith("/admin")
  const isSubAdmin = pathname.startsWith("/sub-admin")
  const isTrainee = pathname.startsWith("/trainee")
  const navItems = isAdmin
    ? adminNavItems
    : isSubAdmin
      ? subAdminNavItems
      : isTrainee
        ? traineeNavItems
        : trainerNavItems
  const roleLabel = isAdmin ? "Admin" : isSubAdmin ? "Sub Admin" : isTrainee ? "AI Trainee" : "AI Trainer"

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground truncate">{roleLabel}</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/trainer" &&
                item.href !== "/trainee" &&
                item.href !== "/sub-admin" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
