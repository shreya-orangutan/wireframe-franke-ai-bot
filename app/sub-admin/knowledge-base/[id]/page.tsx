import { AppLayout } from "@/components/app-layout"
import { ProductDetailsClient } from "@/components/product-details-client"
import { ProductBreadcrumbWrapper } from "@/components/product-breadcrumb-wrapper"

export default async function SubAdminProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <AppLayout>
      <div className="space-y-6">
        <ProductBreadcrumbWrapper productId={id} role="sub-admin" />
        <ProductDetailsClient productId={id} />
      </div>
    </AppLayout>
  )
}
