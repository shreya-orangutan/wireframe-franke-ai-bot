import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Document } from "@/lib/schemas"

interface DocumentState {
  documents: Document[]
}

const initialState: DocumentState = {
  documents: [
    {
      id: "d1",
      productId: "1",
      name: "Training Manual v2.0.pdf",
      purpose: "training",
      fileType: "pdf",
      uploadedAt: new Date("2025-12-16").toISOString(),
    },
    {
      id: "d2",
      productId: "1",
      name: "Quick Reference Guide.pdf",
      purpose: "reference",
      fileType: "pdf",
      uploadedAt: new Date("2025-12-16").toISOString(),
    },
    {
      id: "d3",
      productId: "1",
      name: "Compliance Requirements.docx",
      purpose: "compliance",
      fileType: "docx",
      uploadedAt: new Date("2025-12-17").toISOString(),
    },
    {
      id: "d4",
      productId: "2",
      name: "Security Guidelines.pdf",
      purpose: "guidelines",
      fileType: "pdf",
      uploadedAt: new Date("2025-12-21").toISOString(),
    },
    {
      id: "d5",
      productId: "2",
      name: "Technical Specifications.pdf",
      purpose: "technical",
      fileType: "pdf",
      uploadedAt: new Date("2025-12-21").toISOString(),
    },
    {
      id: "d6",
      productId: "3",
      name: "User Training Materials.pdf",
      purpose: "training",
      fileType: "pdf",
      uploadedAt: new Date("2026-01-06").toISOString(),
    },
  ],
}

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload)
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter((doc) => doc.id !== action.payload)
    },
  },
})

export const { addDocument, deleteDocument } = documentSlice.actions
export default documentSlice.reducer
