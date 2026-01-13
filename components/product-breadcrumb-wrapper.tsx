"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { PageBreadcrumb } from "@/components/page-breadcrumb"

interface ProductBreadcrumbWrapperProps {
  productId: string
  role: "admin" | "sub-admin" | "trainer"
}

export function ProductBreadcrumbWrapper({ productId, role }: ProductBreadcrumbWrapperProps) {
  const products = useAppSelector((state) => state.product.products)
  const product = products.find((p) => p.id === productId)

  const productLabel = product?.name || productId

  const roleLabel = role === "sub-admin" ? "Sub-Admin" : role.charAt(0).toUpperCase() + role.slice(1)
  const roleHref = `/${role}`
  const kbHref = `/${role}/knowledge-base`

  return (
    <PageBreadcrumb
      customPath={[
        { label: roleLabel, href: roleHref },
        { label: "Knowledge Base", href: kbHref },
        { label: productLabel },
      ]}
    />
  )
}
