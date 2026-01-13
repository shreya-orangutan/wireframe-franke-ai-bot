import { AppLayout } from "@/components/app-layout"
import { ProductDetailsClient } from "@/components/product-details-client"

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <AppLayout>
      <ProductDetailsClient productId={id} />
    </AppLayout>
  )
}
