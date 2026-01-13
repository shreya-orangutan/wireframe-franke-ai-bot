import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/lib/schemas"

interface ProductState {
  products: Product[]
  selectedProduct: Product | null
}

const initialState: ProductState = {
  products: [
    {
      id: "1",
      name: "CloudSync Pro",
      description: "Enterprise cloud synchronization solution",
      country: "United States",
      region: "North America",
      createdAt: new Date("2025-12-15").toISOString(),
    },
    {
      id: "2",
      name: "DataGuard Shield",
      description: "Advanced data protection platform",
      country: "Germany",
      region: "Europe",
      createdAt: new Date("2025-12-20").toISOString(),
    },
    {
      id: "3",
      name: "AI Analytics Hub",
      description: "Intelligent analytics and reporting system",
      country: "Singapore",
      region: "Asia Pacific",
      createdAt: new Date("2026-01-05").toISOString(),
    },
  ],
  selectedProduct: null,
}

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
    },
    selectProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
  },
})

export const { addProduct, selectProduct, clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
