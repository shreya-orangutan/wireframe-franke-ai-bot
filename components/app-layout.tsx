"use client"

import type React from "react"
import { AppSidebar } from "./app-sidebar"
import { AppNavbar } from "./app-navbar"
import { useState, useEffect } from "react"

export function AppLayout({ children, hideSidebar = false }: { children: React.ReactNode; hideSidebar?: boolean }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")
    setIsMobile(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  if (hideSidebar) {
    return (
      <div className="min-h-screen bg-background">
        <main className="min-h-screen">{children}</main>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <div className="w-full">
          <AppNavbar />
          <main className="pt-16 w-full overflow-x-hidden">
            <div className="p-4 sm:p-6">{children}</div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64">
        <AppNavbar />
        <main className="pt-16">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
