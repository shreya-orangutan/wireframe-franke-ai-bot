"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

interface PageBreadcrumbProps {
  customPath?: { label: string; href?: string }[]
}

export function PageBreadcrumb({ customPath }: PageBreadcrumbProps) {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname or custom path
  const paths = customPath || generatePathsFromPathname(pathname)

  if (paths.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1

          return (
            <div key={path.label} className="flex items-center gap-2">
              <BreadcrumbItem>
                {isLast || !path.href ? (
                  <BreadcrumbPage>{path.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path.href}>{path.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function generatePathsFromPathname(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean)
  const paths: { label: string; href: string }[] = []

  let currentPath = ""
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Convert segment to readable label
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    paths.push({
      label,
      href: currentPath,
    })
  })

  return paths
}
